import { createFileRoute } from '@tanstack/react-router';

import { NotFoundComponent } from '@/components/not-found-component';

export const Route = createFileRoute('/not-found')({
  component: NotFoundComponent,
});
