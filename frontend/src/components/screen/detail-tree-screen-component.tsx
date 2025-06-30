import moment from 'moment';
import { useState } from 'react';
import ImageGallery from 'react-image-gallery';

import { ListTreeImage, TREE_IMAGE, TreeImageLabels } from '@/enum/treeImage.enum';
import { baseUrl } from '@/lib/api/api';
import { dateTimeFormat } from '@/lib/utils/dateTimeFormat';
import { getDiameterFromCircumference } from '@/lib/utils/uomConfig';
import { TreeType } from '@/types/tree.type';

import { Dropdown } from '../dropdown';
import { MapsLocation } from '../maps-location';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function DetailTreeScreenComponent({ tree }: { tree: TreeType | null }) {
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterImageType, setFilterImageType] = useState<string>('');
  if (!tree) {
    return (
      <div className="m-auto mt-6 max-w-7xl px-4">
        <h1 className="text-2xl font-bold mb-4">Pohon tidak ditemukan</h1>
      </div>
    );
  }

  const surveys = tree.surveyHistory?.slice().reverse();
  const lastSurvey = surveys?.[0];

  const getObjectImage = (image: string, type: TREE_IMAGE, date: string, time: string) => {
    const splitImage = image.split('/');
    const file = splitImage[splitImage.length - 1];
    const splitFileName = file.split('_');
    const code = splitFileName[2];
    const stringDate = moment(date, 'YYYY-MM-DD').format('DD MMMM YYYY');
    return {
      original: baseUrl + image,
      thumbnail: baseUrl + '/thumbnails' + image,
      description: `${TreeImageLabels[type]} ${code} ${stringDate}, ${time}`,
      date,
      type,
    };
  };

  const listOfImage =
    surveys
      ?.flatMap((survey) => [
        (survey.treeImage ?? []).map((img) =>
          getObjectImage(img, TREE_IMAGE.TREE_IMAGE, survey.surveyDate, survey.surveyTime)
        ),
        (survey.leafImage ?? []).map((img) =>
          getObjectImage(img, TREE_IMAGE.LEAF_IMAGE, survey.surveyDate, survey.surveyTime)
        ),
        (survey.skinImage ?? []).map((img) =>
          getObjectImage(img, TREE_IMAGE.SKIN_IMAGE, survey.surveyDate, survey.surveyTime)
        ),
        (survey.fruitImage ?? []).map((img) =>
          getObjectImage(img, TREE_IMAGE.FRUIT_IMAGE, survey.surveyDate, survey.surveyTime)
        ),
        (survey.flowerImage ?? []).map((img) =>
          getObjectImage(img, TREE_IMAGE.FLOWER_IMAGE, survey.surveyDate, survey.surveyTime)
        ),
        (survey.sapImage ?? []).map((img) =>
          getObjectImage(img, TREE_IMAGE.SAP_IMAGE, survey.surveyDate, survey.surveyTime)
        ),
        (survey.otherImage ?? []).map((img) =>
          getObjectImage(img, TREE_IMAGE.OTHER_IMAGE, survey.surveyDate, survey.surveyTime)
        ),
      ])
      .flat() ?? [];

  const getTreeLocalName = (tree: TreeType) => {
    if (tree.masterLocalTree && tree.masterLocalTree.length > 0) {
      return tree.masterLocalTree.map((localTree) => localTree.localName).join(', ');
    }
    if (tree.localTreeName) {
      return tree.localTreeName;
    }
    return '-';
  };

  const listDetail = [
    { label: 'Nama Lokal', value: getTreeLocalName(tree) },
    { label: 'Nama Latin', value: tree.masterTree?.latinName ?? '-' },
    {
      label: 'Keliling',
      value: lastSurvey?.circumference ? `${lastSurvey?.circumference} cm` : '-',
    },
    {
      label: 'Diameter',
      value: lastSurvey?.circumference
        ? `${getDiameterFromCircumference(lastSurvey.circumference)} cm`
        : '-',
    },
    { label: 'Tinggi', value: lastSurvey?.height ? `${lastSurvey?.height} m` : '-' },
    { label: 'Elevasi', value: `${tree.elevation} mdpl` },
    { label: 'Serapan CO2', value: lastSurvey?.serapanCo2 ? `${lastSurvey?.serapanCo2} kg` : '-' },
    { label: 'Surveyor', value: lastSurvey?.user?.name ?? '-' },
    {
      label: 'Tanggal Survey',
      value: lastSurvey?.surveyDate
        ? moment(lastSurvey.surveyDate, 'YYYY-MM-DD').format('D MMMM YYYY')
        : '-',
    },
    { label: 'Waktu Survey', value: lastSurvey?.surveyTime ?? '-' },
    { label: 'Lokasi', value: tree.kelompokKomunitas?.address ?? '-' },
  ];

  const listFilteredImage = listOfImage.filter((image) => {
    const isDateMatch = filterDate ? image.date === filterDate : true;
    const isTypeMatch = filterImageType ? image.type === filterImageType : true;
    return isDateMatch && isTypeMatch;
  });

  return (
    <div className="m-auto mt-6 max-w-7xl px-4">
      <h1 className="text-2xl font-bold mb-4">{`Profil Pohon ${tree.code}`}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - details */}
        <div className="flex-1">
          <p>Detail</p>

          <div className="space-y-2">
            {listDetail.map((item, index) => (
              <div key={index} className="grid grid-cols-[180px_20px_1fr] gap-y-2">
                <div className="font-semibold">{item.label}</div>
                <div>:</div>
                <div>{item.value}</div>
              </div>
            ))}
            <div>
              <div className="h-70 w-full rounded-md border border-gray-300 shadow-sm overflow-hidden relative z-1">
                <MapsLocation position={[tree.latitude, tree.longitude]} popupContent={tree.code} />
              </div>
            </div>
          </div>
        </div>

        {/* Right side - map Galery using react-image-gallery */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mt-8 mb-4">Galeri Gambar</h2>
          {/* Filter */}
          <div className="flex flex-row gap-4 items-end mb-4">
            <div className="flex-1">
              <Label className="mb-2 block">Tanggal</Label>
              <Dropdown
                label="Tanggal"
                data={[
                  { label: 'Semua', value: '' },
                  ...Array.from(new Set(surveys?.map((survey) => survey.surveyDate) ?? [])).map(
                    (date) => ({
                      label: moment(date, 'YYYY-MM-DD').format('D MMMM YYYY'),
                      value: date,
                    })
                  ),
                ]}
                setValue={setFilterDate}
                value={filterDate}
              />
            </div>
            <div className="flex-1">
              <Label className="mb-2 block">Jenis Gambar</Label>
              <Dropdown
                label="Jenis Gambar"
                data={[
                  {
                    label: 'Semua',
                    value: '',
                  },
                  ...ListTreeImage,
                ]}
                setValue={setFilterImageType}
                value={filterImageType}
              />
            </div>
          </div>
          {listFilteredImage.length > 0 && (
            <ImageGallery
              items={listFilteredImage}
              showThumbnails
              showBullets
              showNav
              thumbnailPosition="left"
              showPlayButton={false}
            />
          )}
        </div>
      </div>

      {/* Adopt History Table */}
      <h2 className="text-xl font-bold mt-8 mb-4">Riwayat Adopsi</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {['ID', 'Nama Pengadopsi', 'Nomer Kontrak', 'Tanggal Mulai', 'Tanggal Berakhir'].map(
              (head) => (
                <TableHead key={head}>{head}</TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tree.adoptHistory?.map((adopt) => (
            <TableRow key={adopt.userId}>
              <TableCell>{adopt.userId}</TableCell>
              <TableCell>{adopt.user?.name}</TableCell>
              <TableCell>{adopt.id}</TableCell>
              <TableCell>{dateTimeFormat(adopt.startDate, { dateOnly: true })}</TableCell>
              <TableCell>{dateTimeFormat(adopt.endDate, { dateOnly: true })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Survey History Table */}
      <h2 className="text-xl font-bold mt-8 mb-4">Riwayat Survey</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {['ID', 'Tanggal Survey', 'Kategori Pohon', 'Keliling', 'Tinggi', 'Serapan CO2'].map(
              (head) => (
                <TableHead key={head}>{head}</TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {surveys?.map((survey) => (
            <TableRow key={survey.id}>
              <TableCell>{survey.id}</TableCell>
              <TableCell>{dateTimeFormat(survey.surveyDate, { dateOnly: true })}</TableCell>
              <TableCell>{survey.category}</TableCell>
              <TableCell>{survey.circumference} cm</TableCell>
              <TableCell>{survey.height} m</TableCell>
              <TableCell>{survey.serapanCo2} kg</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
