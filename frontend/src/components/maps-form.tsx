/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';

import { FieldInfo } from './ui/field-info';
import { Input } from './ui/input';
import { Label } from './ui/label';

function ClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapsForm(props: {
  mapRef: React.RefObject<L.Map | null>;
  mapCenter: [number, number];
  markerPosition: [number, number] | null;
  handleLocationSelect: (lat: number, lng: number) => void;
  form: any;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Pilih Lokasi</Label>
        <div className="h-92 w-full rounded-md overflow-hidden relative z-0">
          <MapContainer
            ref={props.mapRef}
            center={props.mapCenter}
            zoom={5}
            style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ClickHandler onLocationSelect={props.handleLocationSelect} />
            {props.markerPosition && (
              <Marker position={props.markerPosition}>
                <Popup>Lokasi terpilih</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <props.form.Field name="latitude">
          {(field: any) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor={field.name}>Latitude</Label>
              <Input
                id={field.name}
                name={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </props.form.Field>
        <props.form.Field name="longitude">
          {(field: any) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor={field.name}>Longitude</Label>
              <Input
                id={field.name}
                name={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </props.form.Field>
      </div>
    </div>
  );
}
