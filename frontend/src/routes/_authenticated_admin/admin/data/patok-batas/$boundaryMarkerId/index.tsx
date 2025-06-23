import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated_admin/admin/data/patok-batas/$boundaryMarkerId/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/_authenticated_admin/admin/data/patok-batas/$boundaryMarkerId/"!
    </div>
  )
}
