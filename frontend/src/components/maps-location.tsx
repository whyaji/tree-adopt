import { LatLngTuple } from 'leaflet';
import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export function MapsLocation(props: {
  position: LatLngTuple;
  zoom?: number;
  popupContent?: React.ReactNode;
}) {
  const listUrl = [
    {
      label: 'Street View',
      value: 'https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}',
    },
    {
      label: 'Satellite View',
      value: 'https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
    },
  ];
  const [tileUrl, setTileUrl] = useState(listUrl[0].value);

  return (
    <div className="relative w-full h-full">
      {/* Selector Dropdown */}
      <select
        onChange={(e) => setTileUrl(e.target.value)}
        className="absolute top-2 right-2 z-[1000] bg-white border border-gray-300 rounded p-1 text-sm shadow"
        value={tileUrl}>
        {listUrl.map((item) => (
          <option key={item.value} value={item.value} onClick={() => setTileUrl(item.value)}>
            {item.label}
          </option>
        ))}
      </select>
      {/* Map */}
      <MapContainer
        center={props.position}
        zoom={props.zoom ?? 12}
        scrollWheelZoom={true}
        zoomControl={true}
        className="w-full h-full">
        <TileLayer url={tileUrl} attribution="Google Maps" />
        <Marker position={props.position}>
          {props.popupContent && <Popup>{props.popupContent}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}
