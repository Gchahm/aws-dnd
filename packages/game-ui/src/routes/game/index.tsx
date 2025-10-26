import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/game/')({
  component: () => <Navigate to="/game" />,
});
