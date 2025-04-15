import { KelompokKomunitas } from '@server/routes/kelompokkomunitas';
import { useForm, useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import L from 'leaflet';
import { FC, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FieldInfo } from '@/components/ui/field-info';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createKelompokKomunitas, updateKelompokKomunitas } from '@/lib/api/kelompokKomunitasApi';

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

export const FormKelompokKomunitas: FC<{
  kelompokKomunitas?: KelompokKomunitas | null;
}> = ({ kelompokKomunitas }) => {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    kelompokKomunitas
      ? [parseFloat(kelompokKomunitas.latitude), parseFloat(kelompokKomunitas.longitude)]
      : [-2.5489, 118.0149]
  );

  const [file, setFile] = useState<File | null>(null);
  const imageUrl = kelompokKomunitas?.image;

  const form = useForm({
    defaultValues: {
      name: kelompokKomunitas?.name ?? '',
      description: kelompokKomunitas?.description ?? '',
      noSk: kelompokKomunitas?.noSk ?? '',
      kups: kelompokKomunitas?.kups ?? '',
      programUnggulan: kelompokKomunitas?.programUnggulan ?? '',
      latitude: kelompokKomunitas?.latitude ?? '',
      longitude: kelompokKomunitas?.longitude ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        Object.entries(value).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
        if (file) {
          formData.append('image', file);
        } else if (kelompokKomunitas?.image) {
          formData.append('image', kelompokKomunitas.image);
        }
        if (kelompokKomunitas) {
          await updateKelompokKomunitas(kelompokKomunitas.id, formData);
          toast('Komunitas updated successfully');
        } else {
          await createKelompokKomunitas(formData);
          toast('Komunitas added successfully');
        }
        form.reset();
        setMarkerPosition(null);
        setMapCenter([-2.5489, 118.0149]);
        navigate({ to: '/tentang-kami/kelompok-komunitas/list-komunitas' });
      } catch {
        if (kelompokKomunitas) {
          alert('Failed to update komunitas');
        } else {
          alert('Failed to add komunitas');
        }
      }
    },
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    form.setFieldValue('latitude', lat.toString());
    form.setFieldValue('longitude', lng.toString());
  };

  const latitude = useStore(form.store, (s) => s.values.latitude);
  const longitude = useStore(form.store, (s) => s.values.longitude);

  // Sync marker and map center when lat/lng inputs change
  useEffect(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      const newCenter: [number, number] = [lat, lng];
      setMarkerPosition(newCenter);
      setMapCenter(newCenter);
      if (mapRef.current) {
        mapRef.current.setView(newCenter, mapRef.current.getZoom());
      }
    }
  }, [latitude, longitude]);

  const formItem: {
    name: keyof (typeof form)['state']['values'];
    label: string;
    type: string;
  }[] = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
    { name: 'noSk', label: 'No SK', type: 'text' },
    { name: 'kups', label: 'KUPS', type: 'text' },
    { name: 'programUnggulan', label: 'Program Unggulan', type: 'text' },
  ];

  return (
    <form
      className="flex flex-col gap-2 max-w-6xl m-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
      <h2 className="text-2xl font-bold">Add Komunitas</h2>
      {formItem.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => (
            <>
              <Label htmlFor={field.name}>{item.label}</Label>
              {item.name === 'description' ||
              item.name === 'programUnggulan' ||
              item.name === 'kups' ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={item.type}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
              <FieldInfo field={field} />
            </>
          )}
        </form.Field>
      ))}
      <div className="mt-4">
        <Label>Pilih Lokasi</Label>
        <div className="h-92 w-full rounded-md overflow-hidden">
          <MapContainer
            ref={mapRef}
            center={mapCenter}
            zoom={5}
            style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ClickHandler onLocationSelect={handleLocationSelect} />
            {markerPosition && (
              <Marker position={markerPosition}>
                <Popup>Lokasi terpilih</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="latitude">
          {(field) => (
            <div>
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
        </form.Field>
        <form.Field name="longitude">
          {(field) => (
            <div>
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
        </form.Field>
      </div>
      <div className="mt-4">
        <Label>Upload Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              setFile(files[0]);
            }
          }}
        />
        {file && <p className="text-sm text-gray-500">{file.name}</p>}
        <p className="text-sm text-gray-500">Max size: 5MB</p>
        <p className="text-sm text-gray-500">Accepted formats: jpg, png</p>
        {(file || imageUrl) && (
          <div className="mt-1">
            <img
              src={file ? URL.createObjectURL(file) : imageUrl}
              alt="Preview"
              className="h-48 object-cover rounded-md"
            />
            {file && (
              <Button type="button" className="mt-2" onClick={() => setFile(null)}>
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit} className="mt-4">
            {isSubmitting
              ? 'Submitting...'
              : kelompokKomunitas
                ? 'Update Kelompok Komunitas'
                : 'Tambah Kelompok Komunitas'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};
