import { createFileRoute } from '@tanstack/react-router';

import { PatroliGeoTaggingScreen } from '@/features/program-kami/screen/patroli-&-geo-tagging/screen/Patroli&GeoTaggingScreen';

export const Route = createFileRoute('/_authenticated/program-kami/patroli-&-geo-tagging/')({
  component: PatroliGeoTaggingScreen,
});
