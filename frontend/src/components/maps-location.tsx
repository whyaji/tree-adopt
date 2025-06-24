import { LatLngTuple } from 'leaflet';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

import { markerDefaultIcon } from '@/lib/utils/markerIcons';

const RecenterAutomatically = ({ center, zoom }: { center?: [number, number]; zoom?: number }) => {
  const map = useMap();
  useEffect(() => {
    if (center !== undefined) {
      map.setView(center, zoom);
    }
    if (zoom !== undefined) {
      map.setZoom(zoom);
    }
  }, [center, map, zoom]);
  return null;
};

export function MapsLocation(
  props: ComponentProps<typeof MapContainer> & {
    position?: LatLngTuple;
    popupContent?: string;
    autoRecenter?: boolean;
    autoReZoom?: boolean;
  }
) {
  const listUrl = [
    {
      label: 'Street View',
      value: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      source: 'OpenStreetMap',
    },
    {
      label: 'Satellite View',
      value: 'https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
      source: 'Google Maps',
    },
  ];

  const [selectedMapTile, setSelectedMapTile] = useState(listUrl[0]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleFullScreen = () => {
    if (!isFullScreen) {
      if (mapContainerRef.current?.requestFullscreen) {
        mapContainerRef.current.requestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  // Listen for fullscreen change to update state
  // (so closing with ESC or browser UI also updates the button)
  if (typeof window !== 'undefined') {
    document.onfullscreenchange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
  }

  const zoom = props.zoom ?? 12; // Default zoom level if not provided

  return (
    <div
      ref={mapContainerRef}
      className={`relative w-full h-full ${isFullScreen ? 'fixed inset-0 z-[2000] bg-white' : ''}`}
      style={isFullScreen ? { width: '100vw', height: '100vh' } : {}}>
      {/* Selector Dropdown */}
      <select
        onChange={(e) =>
          setSelectedMapTile(listUrl.find((item) => item.value === e.target.value) || listUrl[0])
        }
        className="absolute top-2 right-12 z-[1000] bg-white border border-gray-300 rounded p-1 text-sm shadow"
        value={selectedMapTile.value}>
        {listUrl.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {/* Fullscreen Button */}
      <button
        onClick={handleFullScreen}
        className="absolute top-2 right-2 z-[1000] bg-white border border-gray-300 rounded p-1 text-sm shadow"
        aria-label={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        type="button">
        {isFullScreen ? '—' : '⛶'}
      </button>
      {/* Map */}
      <MapContainer
        center={props.position ?? props.center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={true}
        className="w-full h-full"
        {...props}>
        <TileLayer url={selectedMapTile.value} attribution={selectedMapTile.source} />
        {props.position && (
          <Marker position={props.position} icon={markerDefaultIcon}>
            {props.popupContent && <Popup>{props.popupContent}</Popup>}
          </Marker>
        )}
        {props.center && (
          <RecenterAutomatically
            center={props.autoRecenter ? (props.center as [number, number]) : undefined}
            zoom={props.autoReZoom ? zoom : undefined}
          />
        )}
        {props.children}
      </MapContainer>
    </div>
  );
}
