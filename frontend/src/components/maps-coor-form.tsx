import { useRef, useState } from 'react';
import { Marker, Polygon, Polyline, Popup, useMapEvents } from 'react-leaflet';

import { markerCoordinatesIcon } from '@/lib/utils/markerIcons.js';

import { MapsLocation } from './maps-location.js';
import { Button } from './ui/button.js';
import { Label } from './ui/label.js';

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

export function MapsCoorForm(props: {
  label?: string;
  required?: boolean;
  mapCenter: [number, number];
  markerCoordinates: [number, number][];
  onSaveCoordinates: (coords: [number, number][]) => void;
}) {
  const mapCoorRef = useRef<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(props.mapCenter);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCoordinates, setEditingCoordinates] = useState<[number, number][]>([]);
  const [followNewCoords, setFollowNewCoords] = useState(false);

  const handleStartEdit = () => {
    setEditingCoordinates([...props.markerCoordinates]);
    setIsEditing(true);
  };

  const handleClickAddCoord = (lat: number, lng: number) => {
    setEditingCoordinates((prev) => [...prev, [lat, lng]]);
    setMapCenter([lat, lng]); // Update map center to the new coordinate
  };

  const handleUndo = () => {
    setEditingCoordinates((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    setEditingCoordinates([]);
  };

  const handleSave = () => {
    props.onSaveCoordinates(editingCoordinates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingCoordinates([]);
  };

  const isEditValid = editingCoordinates.length >= 3;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>
          {props.label ?? 'Pilih Area Koordinat'}
          {props.required ? <Label className="text-red-500">*</Label> : ''}
        </Label>
        <div className="h-92 w-full rounded-md overflow-hidden relative z-0">
          <MapsLocation
            autoRecenter={followNewCoords}
            ref={mapCoorRef}
            center={mapCenter}
            zoom={5}
            style={{ height: '100%', width: '100%' }}>
            {isEditing && <ClickHandler onLocationSelect={handleClickAddCoord} />}

            {!isEditing && props.markerCoordinates.length > 0 && (
              <Polygon positions={props.markerCoordinates}>
                <Popup>Area tersimpan</Popup>
              </Polygon>
            )}

            {isEditing && editingCoordinates.length > 0 && (
              <Polyline positions={editingCoordinates} color="blue">
                <Popup>Mode edit aktif</Popup>
              </Polyline>
            )}

            {isEditing &&
              editingCoordinates.map((coord, index) => (
                <Marker key={String(coord)} position={coord} icon={markerCoordinatesIcon}>
                  <Popup>{`Titik ${index + 1}`}</Popup>
                </Marker>
              ))}
          </MapsLocation>
        </div>

        <div className="flex gap-2 mt-2 flex-wrap">
          {!isEditing && (
            <Button type="button" variant="default" onClick={handleStartEdit}>
              Edit Koordinat
            </Button>
          )}

          {isEditing && (
            <div className="flex gap-2 items-center w-full flex-wrap sm:flex-nowrap">
              <Button
                type="button"
                variant={followNewCoords ? 'secondary' : 'outline'}
                onClick={() => setFollowNewCoords(!followNewCoords)}
                className="flex-1 min-w-[120px]">
                {followNewCoords ? 'Stop Follow' : 'Follow'}
              </Button>
              {/* separator with max width, hide on mobile */}
              <span className="hidden sm:flex flex-grow h-px bg-muted mx-2" />
              <Button
                type="button"
                variant="outline"
                onClick={handleUndo}
                className="flex-1 min-w-[120px]">
                Undo Titik
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1 min-w-[120px]">
                Reset Semua
              </Button>
              {/* separator with max width, hide on mobile */}
              <span className="hidden sm:flex flex-grow h-px bg-muted mx-2" />
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancel}
                className="flex-1 min-w-[120px]">
                Batal
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleSave}
                disabled={!isEditValid}
                className="flex-1 min-w-[120px]">
                Simpan Area
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
