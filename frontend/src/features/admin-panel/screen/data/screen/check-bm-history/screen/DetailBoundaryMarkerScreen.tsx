import moment from 'moment';
import { useState } from 'react';
import ImageGallery from 'react-image-gallery';

import { Dropdown } from '@/components/dropdown';
import { MapsLocation } from '@/components/maps-location';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getActionsLabelIsTrue, getConditionsLabelIsTrue } from '@/enum/actions-conditions.enum';
import { baseUrl } from '@/lib/api/api';
import { dateTimeFormat } from '@/lib/utils/dateTimeFormat';
import { Route } from '@/routes/_authenticated_admin/admin/data/patok-batas/$boundaryMarkerId';

export function DetailBoundaryMarkerScreen() {
  const { boundaryMarker } = Route.useLoaderData();
  const [filterDate, setFilterDate] = useState<string>('');
  if (!boundaryMarker) {
    return (
      <div className="m-auto mt-6 max-w-7xl px-4">
        <h1 className="text-2xl font-bold mb-4">Patok Batas tidak ditemukan</h1>
      </div>
    );
  }

  const checkBmHistory = boundaryMarker.checkBoundaryMarkerHistory?.slice().reverse();
  const lastCheck = checkBmHistory?.[0];

  const getObjectImage = (image: string, date: string, time: string) => {
    const splitImage = image.split('/');
    const file = splitImage[splitImage.length - 1];
    const splitFileName = file.split('_');
    const code = splitFileName[2];
    const stringDate = moment(date, 'YYYY-MM-DD').format('DD MMMM YYYY');
    return {
      original: baseUrl + image,
      thumbnail: baseUrl + '/thumbnails' + image,
      description: `${code} ${stringDate}, ${time}`,
      date,
    };
  };

  const listOfImage =
    checkBmHistory
      ?.flatMap((check) => [
        (check.images ?? []).map((img) => getObjectImage(img, check.checkDate, check.checkTime)),
      ])
      .flat() ?? [];

  const listDetail = [
    { label: 'Kode', value: boundaryMarker.code },
    { label: 'Komunitas', value: boundaryMarker.kelompokKomunitas?.name ?? '-' },
    { label: 'Checker', value: boundaryMarker.checker?.name ?? '-' },
    {
      label: 'Tanggal Check',
      value: lastCheck
        ? `${dateTimeFormat(lastCheck.checkDate, { dateOnly: true })}, ${lastCheck.checkTime}`
        : '-',
    },
    {
      label: 'Kondisi',
      value:
        lastCheck && lastCheck.conditions
          ? getConditionsLabelIsTrue(lastCheck.conditions).join(', ')
          : '-',
    },
    {
      label: 'Aksi',
      value:
        lastCheck && lastCheck.actions ? getActionsLabelIsTrue(lastCheck.actions).join(', ') : '-',
    },
    { label: 'Deskripsi', value: boundaryMarker.description ?? '-' },
    { label: 'Lokasi', value: boundaryMarker.kelompokKomunitas?.address ?? '-' },
  ];

  const listFilteredImage = listOfImage.filter((image) => {
    const isDateMatch = filterDate ? image.date === filterDate : true;
    return isDateMatch;
  });

  return (
    <div className="m-auto mt-6 max-w-7xl px-4">
      <h1 className="text-2xl font-bold mb-4">{`Detail Patok Batas ${boundaryMarker.code}`}</h1>

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
                <MapsLocation
                  position={[boundaryMarker.latitude, boundaryMarker.longitude]}
                  popupContent={boundaryMarker.code}
                />
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
                  ...Array.from(
                    new Set(checkBmHistory?.map((survey) => survey.checkDate) ?? [])
                  ).map((date) => ({
                    label: moment(date, 'YYYY-MM-DD').format('D MMMM YYYY'),
                    value: date,
                  })),
                ]}
                setValue={setFilterDate}
                value={filterDate}
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

      {/* Check History Table */}
      <h2 className="text-xl font-bold mt-8 mb-4">Riwayat Cek Patok Batas</h2>
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            {['ID', 'Tanggal Check', 'Kondisi', 'Aksi'].map((head) => (
              <TableHead key={head}>{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {checkBmHistory?.map((checkBmHistory) => (
            <TableRow key={checkBmHistory.id}>
              <TableCell>{checkBmHistory.id}</TableCell>
              <TableCell>
                {dateTimeFormat(checkBmHistory.checkDate, { dateOnly: true })},{' '}
                {checkBmHistory.checkTime}
              </TableCell>
              <TableCell>
                {getConditionsLabelIsTrue(checkBmHistory.conditions).map((condition, index) => (
                  <div key={condition}>
                    {index + 1}. {condition}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                {getActionsLabelIsTrue(checkBmHistory.actions).map((action, index) => (
                  <div key={action}>
                    {index + 1}. {action}
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
