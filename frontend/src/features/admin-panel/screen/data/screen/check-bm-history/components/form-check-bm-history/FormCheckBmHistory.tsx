import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import moment from 'moment';
import { FC, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { FieldForm, FieldItemType } from '@/components/field-form';
import { ImageForm } from '@/components/image-form';
import { Button } from '@/components/ui/button';
import { PERMISSION } from '@/enum/permission.enum';
import {
  createBoundaryMarkerCheckHistory,
  updateBoundaryMarkerCheckHistory,
} from '@/lib/api/boundaryMarkerApi';
import { useUserStore } from '@/lib/stores/userStore';
import { toDbDate } from '@/lib/utils/dateTimeFormat';
import { checkPermission } from '@/lib/utils/permissions';
import { assertAndHandleFormErrors } from '@/lib/utils/setErrorForms';
import { BoundaryMarkerType, CheckBmHistoryType } from '@/types/boundaryMarker.type';

type ImagesType = {
  images: (File | string)[];
};

const imageTypes: (keyof ImagesType)[] = ['images'];

export const FormCheckBmHistory: FC<{
  title?: string;
  checkBmHistory?: CheckBmHistoryType | null;
  boundaryMarker?: BoundaryMarkerType | null;
}> = ({ checkBmHistory, boundaryMarker, title }) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  // Initialize images state for each type, max 5 images each
  const [images, setImages] = useState<ImagesType>(() => {
    const initial: ImagesType = {
      images: [],
    };

    imageTypes.forEach((type) => {
      initial[type] = checkBmHistory?.[type] ?? [];
    });

    return initial;
  });

  const loggedInUserId = user?.id ? String(user.id) : '';
  const loggedInUserGroupId = user?.groupId ? String(user.groupId) : '';

  console.log('loggedInusergroupId', loggedInUserGroupId);

  const form = useForm({
    defaultValues: {
      boundaryMarkerId: boundaryMarker ? String(boundaryMarker?.id) : '',
      kelompokKomunitasId: boundaryMarker?.kelompokKomunitasId
        ? String(boundaryMarker.kelompokKomunitasId)
        : loggedInUserGroupId,
      checkerId: boundaryMarker?.checkerId ? String(boundaryMarker.checkerId) : loggedInUserId,
      checkDate: checkBmHistory ? checkBmHistory.checkDate : toDbDate(moment().toString()),
      checkTime: checkBmHistory ? checkBmHistory.checkTime : moment().format('HH:mm'),
      description: checkBmHistory?.description ?? '',
      actions: checkBmHistory?.actions ?? {
        cleaned: false,
        fixed_repainted: false,
        moved: false,
        replaced: false,
        reported: false,
      },
      conditions: checkBmHistory?.conditions ?? {
        good: false,
        color_text_unclear: false,
        wrong_placement: false,
        damaged: false,
        lost: false,
      },
    },
    onSubmit: async ({ value, formApi }) => {
      const formData = new FormData();
      Object.entries(value).forEach(([key, value]) => {
        if (key === 'actions' || key === 'conditions') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      // Append images for each type, max 5 per type
      imageTypes.forEach((type) => {
        images[type]?.slice(0, 5).forEach((img, idx) => {
          if (img instanceof File) {
            formData.append(`${type}[${idx}]`, img);
          } else if (typeof img === 'string') {
            // If it's a string (existing image URL), send as is or handle as needed
            formData.append(`${type}[${idx}]`, img);
          }
        });
      });

      try {
        if (checkBmHistory) {
          const result = await updateBoundaryMarkerCheckHistory(checkBmHistory.id, formData);
          assertAndHandleFormErrors<typeof value>(result, formApi.setFieldMeta);
          toast('Check Patok Batas History updated successfully');
        } else {
          const result = await createBoundaryMarkerCheckHistory(formData);
          assertAndHandleFormErrors<typeof value>(result, formApi.setFieldMeta);
          toast('Check Patok Batas History added successfully');
        }
        form.reset();
        navigate({ to: `/admin/data/patok-batas/${boundaryMarker?.id}/check-history` });
      } catch {
        toast.error('Failed to Check Patok Batas History');
      }
    },
  });

  const isGlobalAdmin = checkPermission(user?.permissions ?? [], [
    PERMISSION.BOUNDARY_MARKER_CREATE_LEVEL_GLOBAL,
    PERMISSION.BOUNDARY_MARKER_UPDATE_LEVEL_GLOBAL,
  ]);

  const formItem: FieldItemType<keyof (typeof form)['state']['values']>[] = [
    {
      name: 'boundaryMarkerId',
      label: 'Boundary Marker',
      type: 'dropdown-boundary-marker',
      paginationParams: {
        limit: 9999,
        filter: isGlobalAdmin ? undefined : `kelompokKomunitasId:${user?.groupId}`,
      },
      required: true,
    },
    {
      name: 'kelompokKomunitasId',
      label: 'Kelompok Komunitas',
      type: 'dropdown-comunity-group',
      paginationParams: { limit: 9999, filter: isGlobalAdmin ? undefined : `id:${user?.groupId}` },
      required: true,
    },
    {
      name: 'checkerId',
      label: 'Checker',
      type: 'dropdown-surveyor',
      required: true,
      paginationParams: {
        limit: 9999,
        filter: isGlobalAdmin ? undefined : `groupId:${user?.groupId}`,
      },
    },
    { name: 'checkDate', label: 'Check Date', type: 'date', required: true },
    { name: 'checkTime', label: 'Check Time', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: false },
    {
      name: 'conditions',
      label: 'Conditions',
      type: 'checkbox-json-actions-conditions-bm',
      required: false,
    },
    {
      name: 'actions',
      label: 'Actions',
      type: 'checkbox-json-actions-conditions-bm',
      required: false,
    },
  ];

  // Handler for image changes
  const handleImageChange = (type: keyof ImagesType, files: File[]) => {
    setImages((prev) => ({
      ...prev,
      [type]: files.slice(0, 5),
    }));
  };

  return (
    <form
      className="flex flex-col gap-2 max-w-6xl m-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      {formItem.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => <FieldForm item={item} field={field}></FieldForm>}
        </form.Field>
      ))}

      {/* Render ImageForm for each image type */}
      {imageTypes.map((type) => (
        <div key={type} className="mb-2">
          <ImageForm
            label={type}
            required={type === 'images'}
            files={images[type] as (File | string)[]}
            setFiles={(files: File[]) => handleImageChange(type, files)}
            maxFiles={5}
          />
        </div>
      ))}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <ConfirmationDialog
            title={
              checkBmHistory
                ? 'Apakah anda yakin untuk mengupdate?'
                : 'Apakah anda yakin untuk menambah?'
            }
            message={
              checkBmHistory
                ? 'Data yang sudah ada akan diupdate'
                : 'Data akan ditambahkan ke dalam database check patok batas'
            }
            confirmText={
              isSubmitting
                ? 'Submitting...'
                : checkBmHistory
                  ? 'Update Check Patok Batas History'
                  : 'Add Check Patok Batas History'
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
                {checkBmHistory
                  ? 'Update Check Patok Batas History'
                  : 'Add Check Patok Batas History'}
              </Button>
            }
          />
        )}
      </form.Subscribe>
    </form>
  );
};
