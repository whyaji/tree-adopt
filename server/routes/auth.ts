import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { sign } from 'hono/jwt';
import { z } from 'zod';

import { db } from '../db/database.js';
import { userSchema } from '../db/schema/schema.js';
import env from '../lib/env.js';
import { logger } from '../lib/logger.js';
import authMiddleware from '../middleware/jwt.js';

// JWT secret key
const JWT_SECRET = env.JWT_SECRET;

const userSchemaZod = z.object({
  id: z.number().int().positive(),
  name: z.string().min(3),
  email: z.string().email().min(3),
  password: z.string().min(6),
});

const loginSchema = userSchemaZod.omit({ name: true, id: true });
const registerSchema = userSchemaZod.omit({ id: true });

export const authRoute = new Hono()
  .post('/login', zValidator('json', loginSchema), async (c) => {
    const { email, password } = await c.req.valid('json');

    try {
      // Find user by email
      const user = await db.select().from(userSchema).where(eq(userSchema.email, email));

      if (user.length === 0) {
        return c.json({ message: 'Invalid email or password.' }, 401);
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user[0].password);
      if (!isValidPassword) {
        return c.json({ message: 'Invalid email or password.' }, 401);
      }

      // Generate JWT
      const token = await sign({ userId: user[0].id, email: user[0].email }, JWT_SECRET);

      return c.json({ data: { token } });
    } catch (error) {
      logger.error('Error during sign-in:', error);
      return c.json({ message: 'Internal server error.' }, 500);
    }
  })
  .post('/register', zValidator('json', registerSchema), async (c) => {
    const { email, name, password } = await c.req.json();

    try {
      // Check if user already exists
      const existingUser = await db.select().from(userSchema).where(eq(userSchema.email, email));

      if (existingUser.length > 0) {
        return c.json({ message: 'User already exists.' }, 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const newUser = await db.insert(userSchema).values({
        name,
        email,
        password: hashedPassword,
      });

      return c.json({ message: 'User created successfully.', users: newUser }, 201);
    } catch (error) {
      logger.error('Error during sign-up:', error);
      return c.json({ message: 'Internal server error.' }, 500);
    }
  })
  .get('/profile', authMiddleware, async (c) => {
    const payload = c.get('jwtPayload');
    try {
      const user = await db.select().from(userSchema).where(eq(userSchema.id, payload.userId));

      if (user.length === 0) {
        return c.json({ message: 'User not found.' }, 404);
      }

      return c.json({ data: user[0] });
    } catch (error) {
      logger.error('Error fetching profile:', error);
      return c.json({ message: 'Internal server error.' }, 500);
    }
  })
  .post('/logout', authMiddleware, async (c) => {
    deleteCookie(c, 'auth_token');
    return c.json({ message: 'Logout successful.' });
  });
