import { createFileRoute } from '@tanstack/react-router';

import { MappingScreenComponent } from '@/components/screen/mapping-screen-component';

export const Route = createFileRoute('/_authenticated/pemetaan/')({
  component: MappingScreenComponent,
});
