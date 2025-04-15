import { LatLngTuple } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { Route } from '@/routes/_authenticated/tentang-kami/kelompok-komunitas/$kelompokKomunitasName';

export function DetailKelompokKomunitasScreen() {
  const { kelompokKomunitas } = Route.useLoaderData();

  if (!kelompokKomunitas) {
    return <div>Kelompok Komunitas tidak ditemukan.</div>;
  }

  const position: LatLngTuple = [
    parseFloat(kelompokKomunitas.latitude),
    parseFloat(kelompokKomunitas.longitude),
  ];

  const kupsList = kelompokKomunitas.kups?.split(',') ?? [];
  const programUnggulanList = kelompokKomunitas.programUnggulan?.split(',') ?? [];

  return (
    <div className="m-auto mt-6 max-w-7xl px-4">
      <h1 className="text-2xl font-bold mb-4">{kelompokKomunitas.name}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - details */}
        <div className="flex-1 space-y-4">
          <p>{kelompokKomunitas.description}</p>

          <div className="space-y-2">
            <div className="grid grid-cols-[180px_20px_1fr] gap-y-2">
              <div className="font-semibold">Nama Komunitas</div>
              <div>:</div>
              <div>{kelompokKomunitas.name}</div>

              <div className="font-semibold">Nomor SK</div>
              <div>:</div>
              <div>{kelompokKomunitas.noSk}</div>

              <div className="font-semibold">KUPS</div>
              <div>:</div>
              <div>
                <div className="list-disc list-inside">
                  {kupsList.map((item, index) => (
                    <p key={index}>{item.trim()}</p>
                  ))}
                </div>
              </div>

              <div className="font-semibold">Program Unggulan</div>
              <div>:</div>
              <div>
                <div className="list-disc list-inside">
                  {programUnggulanList.map((item, index) => (
                    <p key={index}>{item.trim()}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - map */}
        <div className="flex-1">
          <div className="h-140 w-full rounded-md border border-gray-300 shadow-sm overflow-hidden">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={true}
              zoomControl={true}
              className="w-full h-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>Lokasi Kelompok Komunitas: {kelompokKomunitas.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
