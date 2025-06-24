import { icon } from 'leaflet';

export const markerDefaultIcon = icon({
  iconUrl: '/images/icons/marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const markerCoordinatesIcon = icon({
  iconUrl: '/images/icons/marker.png',
  iconSize: [18, 18],
  iconAnchor: [9, 18],
  popupAnchor: [0, -18],
});

export const markerTreeIcon = icon({
  iconUrl: '/images/icons/tree-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
