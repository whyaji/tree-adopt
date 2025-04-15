import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <div className="flex flex-col gap-2 max-w-xl m-auto mt-6">
      <h1 className="text-2xl font-bold">About Tree Adopt</h1>
      <p>
        TreeAdopt is a green-tech platform that connects individuals, communities, and organizations
        with real-world tree-planting initiatives. Through the app, users can adopt trees planted by
        environmental partners across the globe, track their growth, and contribute to a greener
        planet—all from their smartphones.
      </p>
    </div>
  );
}
