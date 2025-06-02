export const getCenterCoordAndZoom = (coordinates: [number, number][]) => {
  if (coordinates.length === 0) {
    return null;
  }

  const latitudes = coordinates.map((coord) => coord[1]);
  const longitudes = coordinates.map((coord) => coord[0]);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const center: [number, number] = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];

  // Calculate zoom based on the bounding box dimensions
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;

  // Use the larger dimension to determine zoom level
  const maxDiff = Math.max(latDiff, lngDiff);

  // Calculate zoom level using logarithmic formula
  // This assumes each zoom level doubles the detail (halves the area shown)
  const zoom = Math.max(1, Math.min(18, Math.floor(Math.log2(360 / maxDiff))));

  return { center, zoom };
};
