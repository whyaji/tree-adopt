import { icon, LatLngTuple } from 'leaflet';
import { FC } from 'react';
import { Marker, Popup } from 'react-leaflet';

import { getCenterCoordAndZoom } from '@/lib/utils/maps';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';

import { MapsLocation } from '../maps-location';

export const DetailGroupScreenComponent: FC<{
  kelompokKomunitas: KelompokKomunitasType;
}> = ({ kelompokKomunitas }) => {
  const position: LatLngTuple = [kelompokKomunitas.latitude, kelompokKomunitas.longitude];

  const kupsList = kelompokKomunitas.kups?.split(',') ?? [];
  const programUnggulanList = kelompokKomunitas.programUnggulan?.split(',') ?? [];

  const centerAndZoom = getCenterCoordAndZoom(
    [
      [kelompokKomunitas.latitude, kelompokKomunitas.longitude],
      ...(kelompokKomunitas.trees?.map((tree) => [tree.latitude, tree.longitude]) ?? []),
      ...(kelompokKomunitas.groupActivities?.map((activity) => [
        activity.latitude,
        activity.longitude,
      ]) ?? []),
    ].filter(
      (coord): coord is [number, number] =>
        Array.isArray(coord) &&
        coord.length === 2 &&
        typeof coord[0] === 'number' &&
        typeof coord[1] === 'number'
    )
  );

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

              <div className="font-semibold">Alamat</div>
              <div>:</div>
              <div>{kelompokKomunitas.address}</div>
            </div>
          </div>
        </div>

        {/* Right side - map */}
        <div className="flex-1">
          <div className="h-140 w-full rounded-md border border-gray-300 shadow-sm overflow-hidden">
            {centerAndZoom && (
              <MapsLocation
                center={centerAndZoom.center}
                zoom={centerAndZoom.zoom}
                scrollWheelZoom={true}
                zoomControl={true}
                className="w-full h-full">
                <Marker position={position}>
                  <Popup>Lokasi Kelompok Komunitas: {kelompokKomunitas.name}</Popup>
                </Marker>
                {kelompokKomunitas.trees?.map(
                  (tree) =>
                    tree.latitude &&
                    tree.longitude && (
                      <Marker
                        key={tree.id}
                        position={[tree.latitude, tree.longitude]}
                        icon={icon({
                          iconUrl: '/images/icons/tree-marker.png',
                          iconSize: [32, 32],
                          iconAnchor: [16, 32],
                          popupAnchor: [0, -32],
                        })}>
                        <Popup>{tree.code}</Popup>
                      </Marker>
                    )
                )}
                {kelompokKomunitas.groupActivities?.map(
                  (activity) =>
                    activity.latitude &&
                    activity.longitude && (
                      <Marker
                        key={activity.id}
                        position={[activity.latitude, activity.longitude]}
                        icon={icon({
                          iconUrl: '/images/icons/acitivity-marker.png',
                          iconSize: [32, 32],
                          iconAnchor: [16, 32],
                          popupAnchor: [0, -32],
                        })}>
                        <Popup>{activity.title}</Popup>
                      </Marker>
                    )
                )}
              </MapsLocation>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
