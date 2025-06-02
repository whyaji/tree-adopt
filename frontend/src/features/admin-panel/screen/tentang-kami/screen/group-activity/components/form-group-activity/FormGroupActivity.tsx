/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import L from 'leaflet';
import moment from 'moment';
import { FC, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { FieldForm, FieldItemType } from '@/components/field-form';
import { MapsForm } from '@/components/maps-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MAPS_CENTER } from '@/constants/maps';
import useDebounce from '@/hooks/use-debounce';
import { createGroupActivity, updateGroupActivity } from '@/lib/api/groupActivityApi';
import { useUserStore } from '@/lib/stores/userStore';
import { toDbDate } from '@/lib/utils/dateTimeFormat';
import { resizedImageBeforeUpload } from '@/lib/utils/image';
import { GroupActivityType } from '@/types/groupActivity.type';

export const FormGroupActivity: FC<{
  groupActivity?: GroupActivityType | null;
  kelompokKomunitasId?: string;
}> = ({ groupActivity, kelompokKomunitasId }) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const mapRef = useRef<L.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    groupActivity ? [groupActivity.latitude, groupActivity.longitude] : MAPS_CENTER.DEFAULT
  );

  const [file, setFile] = useState<File | null>(null);
  const imageUrl = groupActivity?.image;

  const today = moment();

  const form = useForm({
    defaultValues: {
      kelompokKomunitasId: kelompokKomunitasId ? String(kelompokKomunitasId) : '',
      code: groupActivity?.code ?? '',
      title: groupActivity?.title ?? '',
      date: groupActivity?.date ?? toDbDate(today.toString()),
      time: groupActivity?.time ?? today.format('HH:mm'),
      location:
        (groupActivity?.location ?? user?.kelompokKomunitas?.address)
          ? user?.kelompokKomunitas?.address
          : '',
      description: groupActivity?.description ?? '',
      latitude: groupActivity?.latitude ? String(groupActivity?.latitude) : '',
      longitude: groupActivity?.longitude ? String(groupActivity?.longitude) : '',
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        Object.entries(value).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
        if (user) {
          formData.append('createdBy', String(user.id));
        }
        if (file) {
          const fileExtension = file.name.split('.').pop();
          const resizedFile = await resizedImageBeforeUpload({
            file,
            fileName: value.code + `.${fileExtension}`,
          });
          formData.append('image', resizedFile);
        } else if (groupActivity?.image) {
          formData.append('image', groupActivity.image);
        }
        if (groupActivity) {
          await updateGroupActivity(groupActivity.id, formData);
          toast('Komunitas updated successfully');
        } else {
          await createGroupActivity(formData);
          toast('Komunitas added successfully');
        }
        form.reset();
        setMarkerPosition(null);
        setMapCenter(MAPS_CENTER.DEFAULT);
        navigate({ to: `/admin/tentang-kami/kelompok-komunitas/${kelompokKomunitasId}/aktivitas` });
      } catch {
        if (groupActivity) {
          toast.error('Failed to update komunitas');
        } else {
          toast.error('Failed to add komunitas');
        }
      }
    },
  });

  const titleValue = useStore(form.store, (s) => s.values.title);

  const debouncedTitleValue = useDebounce(() => {
    if (titleValue) {
      const code =
        titleValue
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
          .replace(/^-+|-+$/g, '') + // Trim leading/trailing hyphens
        `-${user?.id ?? 'unknown'}` + // Append user ID or 'unknown' if not available
        `-${moment().format('YYMMDDHHmmSS')}`; // Append date in format
      form.setFieldValue('code', code);
    }
  }, 500);

  useEffect(() => {
    debouncedTitleValue();
  }, [debouncedTitleValue, form]);

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

  const formItem: FieldItemType<keyof (typeof form)['state']['values']>[] = [
    { name: 'title', label: 'Judul', type: 'text' },
    { name: 'code', label: 'Code', type: 'text', disabled: true },
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'time', label: 'Time', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'description', label: 'Description', type: 'area' },
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
        {groupActivity ? 'Update Aktivitas Kelompok' : 'Add Aktivitas Kelompok'}
      </h2>
      {formItem.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => <FieldForm item={item} field={field as any} />}
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
              groupActivity
                ? 'Apakah anda yakin untuk mengupdate?'
                : 'Apakah anda yakin untuk menambah?'
            }
            message={
              groupActivity
                ? 'Data yang sudah ada akan diupdate'
                : 'Data akan ditambahkan ke dalam database Aktivitas Kelompok'
            }
            confirmText={
              isSubmitting
                ? 'Submitting...'
                : groupActivity
                  ? 'Update Aktivitas Kelompok'
                  : 'Tambah Aktivitas Kelompok'
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
                {groupActivity ? 'Update Aktivitas Kelompok' : 'Tambah Aktivitas Kelompok'}
              </Button>
            }
          />
        )}
      </form.Subscribe>
    </form>
  );
};
