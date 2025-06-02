import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import Cookies from 'js-cookie';
import moment from 'moment';
import { FC, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { FieldForm, FieldItemType } from '@/components/field-form';
import { ImageForm } from '@/components/image-form';
import { Button } from '@/components/ui/button';
import { ListTreeCategory } from '@/enum/treeCategory.enum';
import { createSurveyHistory, updateSurveyHistory } from '@/lib/api/surveyHistoryApi';
import { toDbDate } from '@/lib/utils/dateTimeFormat';
import { SurveyHistoryType } from '@/types/surveyHistory.type';
import { TreeType } from '@/types/tree.type';

type ImagesType = {
  treeImage: (File | string)[];
  leafImage?: (File | string)[];
  skinImage?: (File | string)[];
  fruitImage?: (File | string)[];
  flowerImage?: (File | string)[];
  sapImage?: (File | string)[];
  otherImage?: (File | string)[];
};

const imageTypes: (keyof ImagesType)[] = [
  'treeImage',
  'leafImage',
  'skinImage',
  'fruitImage',
  'flowerImage',
  'sapImage',
  'otherImage',
];

export const FormSurveyHistory: FC<{
  title?: string;
  survey?: SurveyHistoryType | null;
  tree?: TreeType | null;
}> = ({ survey, tree, title }) => {
  const navigate = useNavigate();
  const user = Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null;

  // Initialize images state for each type, max 5 images each
  const [images, setImages] = useState<ImagesType>(() => {
    const initial: ImagesType = {
      treeImage: [],
      leafImage: [],
      skinImage: [],
      fruitImage: [],
      flowerImage: [],
      sapImage: [],
      otherImage: [],
    };

    imageTypes.forEach((type) => {
      initial[type] = survey?.[type] ?? [];
    });

    return initial;
  });

  const form = useForm({
    defaultValues: {
      treeId: tree ? String(tree?.id) : '',
      userId: user ? String(user.id) : '',
      surveyDate: survey ? survey.surveyDate : toDbDate(moment().toString()),
      surveyTime: survey ? survey.surveyTime : moment().format('HH:mm'),
      category: survey ? String(survey.category) : '',
      circumference: survey ? String(survey.circumference) : '',
      height: survey ? String(survey.height) : '',
      serapanCo2: survey ? String(survey.serapanCo2) : '',
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      Object.entries(value).forEach(([key, value]) => {
        formData.append(key, String(value));
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
        if (survey) {
          await updateSurveyHistory(survey.id, formData);
          toast('Survey history updated successfully');
        } else {
          await createSurveyHistory(formData);
          toast('Survey history added successfully');
        }
        form.reset();
        navigate({ to: `/admin/data/pohon/${tree?.id}/survey-history` });
      } catch {
        toast.error('Failed to Survey history');
      }
    },
  });

  const formItem: FieldItemType<keyof (typeof form)['state']['values']>[] = [
    { name: 'surveyDate', label: 'Survey Date', type: 'date' },
    { name: 'surveyTime', label: 'Survey Time', type: 'text' },
    { name: 'category', label: 'Category', type: 'dropdown', data: ListTreeCategory },
    { name: 'circumference', label: 'Circumference (cm)', type: 'number' },
    { name: 'height', label: 'Height (m)', type: 'number' },
    { name: 'serapanCo2', label: 'Serapan CO2 (kg)', type: 'number' },
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
              survey ? 'Apakah anda yakin untuk mengupdate?' : 'Apakah anda yakin untuk menambah?'
            }
            message={
              survey
                ? 'Data yang sudah ada akan diupdate'
                : 'Data akan ditambahkan ke dalam database master pohon'
            }
            confirmText={
              isSubmitting
                ? 'Submitting...'
                : survey
                  ? 'Update Survey History'
                  : 'Add Survey History'
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
                {survey ? 'Update Survey History' : 'Add Survey History'}
              </Button>
            }
          />
        )}
      </form.Subscribe>
    </form>
  );
};
