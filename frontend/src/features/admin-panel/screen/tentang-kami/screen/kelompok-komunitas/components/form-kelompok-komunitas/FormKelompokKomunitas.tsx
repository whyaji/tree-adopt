import { KelompokKomunitas } from '@server/routes/kelompokkomunitas';
import { useForm, useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import L from 'leaflet';
import { FC, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { MapsForm } from '@/components/maps-form';
import { Button } from '@/components/ui/button';
import { FieldInfo } from '@/components/ui/field-info';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MAPS_CENTER } from '@/constants/maps';
import { createKelompokKomunitas, updateKelompokKomunitas } from '@/lib/api/kelompokKomunitasApi';

export const FormKelompokKomunitas: FC<{
  kelompokKomunitas?: KelompokKomunitas | null;
}> = ({ kelompokKomunitas }) => {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    kelompokKomunitas
      ? [kelompokKomunitas.latitude, kelompokKomunitas.longitude]
      : MAPS_CENTER.DEFAULT
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
      latitude: kelompokKomunitas?.latitude ? String(kelompokKomunitas?.latitude) : '',
      longitude: kelompokKomunitas?.longitude ? String(kelompokKomunitas?.longitude) : '',
      address: kelompokKomunitas?.address ?? '',
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
        setMapCenter(MAPS_CENTER.DEFAULT);
        navigate({ to: '/admin/tentang-kami/kelompok-komunitas' });
      } catch {
        if (kelompokKomunitas) {
          toast.error('Failed to update komunitas');
        } else {
          toast.error('Failed to add komunitas');
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
    { name: 'description', label: 'Description', type: 'area' },
    { name: 'noSk', label: 'No SK', type: 'text' },
    { name: 'kups', label: 'KUPS', type: 'area' },
    { name: 'programUnggulan', label: 'Program Unggulan', type: 'area' },
    { name: 'address', label: 'Address', type: 'area' },
  ];

  return (
    <form
      className="flex flex-col gap-2 max-w-6xl m-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
      <h2 className="text-2xl font-bold">
        {kelompokKomunitas ? 'Update Kelompok Komunitas' : 'Add Kelompok Komunitas'}
      </h2>
      {formItem.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => (
            <>
              <Label htmlFor={field.name}>{item.label}</Label>
              {item.type === 'area' ? (
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

      <MapsForm
        form={form}
        mapRef={mapRef}
        mapCenter={mapCenter}
        markerPosition={markerPosition}
        handleLocationSelect={handleLocationSelect}
      />

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
              src={file ? URL.createObjectURL(file) : (imageUrl ?? undefined)}
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
          <ConfirmationDialog
            title={
              kelompokKomunitas
                ? 'Apakah anda yakin untuk mengupdate?'
                : 'Apakah anda yakin untuk menambah?'
            }
            message={
              kelompokKomunitas
                ? 'Data yang sudah ada akan diupdate'
                : 'Data akan ditambahkan ke dalam database kelompok komunitas'
            }
            confirmText={
              isSubmitting
                ? 'Submitting...'
                : kelompokKomunitas
                  ? 'Update Kelompok Komunitas'
                  : 'Tambah Kelompok Komunitas'
            }
            onConfirm={async () => {
              try {
                await form.handleSubmit();
              } catch (error) {
                console.error(error);
                toast.error('Failed to submit form');
              }
            }}
            triggerButton={
              <Button disabled={!canSubmit} className="mt-4">
                {kelompokKomunitas ? 'Update Kelompok Komunitas' : 'Tambah Kelompok Komunitas'}
              </Button>
            }
          />
        )}
      </form.Subscribe>
    </form>
  );
};
