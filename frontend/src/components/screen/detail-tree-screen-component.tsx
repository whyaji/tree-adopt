import { dateTimeFormat } from '@/lib/utils/dateTimeFormat';
import { TreeType } from '@/types/tree.type';

import { MapsLocation } from '../maps-location';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function DetailTreeScreenComponent({ tree }: { tree: TreeType | null }) {
  if (!tree) {
    return (
      <div className="m-auto mt-6 max-w-7xl px-4">
        <h1 className="text-2xl font-bold mb-4">Pohon tidak ditemukan</h1>
      </div>
    );
  }

  const listDetail = [
    { label: 'Nama Lokal', value: tree.masterTree?.localName ?? '-' },
    { label: 'Nama Latin', value: tree.masterTree?.latinName ?? '-' },
    { label: 'Circumference', value: tree.survey?.circumference ? `${tree.survey?.circumference} cm` : '-' },
    { label: 'Tinggi', value: tree.survey?.height ? `${tree.survey?.height} m` : '-' },
    { label: 'Elevasi', value: `${tree.elevation} m` },
    { label: 'Surveyor', value: tree.survey?.user?.name ?? '-' },
    { label: 'Tanggal Survey', value: tree.survey?.surveyDate ?? '-' },
    { label: 'Lokasi', value: tree.address ?? '-' },
  ];

  return (
    <div className="m-auto mt-6 max-w-7xl px-4">
      <h1 className="text-2xl font-bold mb-4">{`Profil Pohon ${tree.code}`}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - details */}
        <div className="flex-1 space-y-4">
          <p>Detail</p>

          <div className="space-y-2">
            {listDetail.map((item, index) => (
              <div key={index} className="grid grid-cols-[180px_20px_1fr] gap-y-2">
                <div className="font-semibold">{item.label}</div>
                <div>:</div>
                <div>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - map */}
        <div className="flex-1">
          <div className="h-140 w-full rounded-md border border-gray-300 shadow-sm overflow-hidden">
            <MapsLocation position={[tree.latitude, tree.longitude]} popupContent={tree.code} />
          </div>
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
    </div>
  );
}
