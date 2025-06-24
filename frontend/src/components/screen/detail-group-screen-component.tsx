import { useNavigate } from '@tanstack/react-router';
import { icon, LatLngTuple } from 'leaflet';
import { FC } from 'react';
import { Marker, Polygon, Popup } from 'react-leaflet';

import { baseUrl } from '@/lib/api/api';
import { getCenterCoordAndZoom } from '@/lib/utils/maps';
import { markerDefaultIcon } from '@/lib/utils/markerIcons';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';

import { MapsLocation } from '../maps-location';

export const DetailGroupScreenComponent: FC<{
  kelompokKomunitas: KelompokKomunitasType;
  allPhotosRoute?: string;
}> = ({ kelompokKomunitas, allPhotosRoute }) => {
  const navigate = useNavigate();
  const position: LatLngTuple = [kelompokKomunitas.latitude, kelompokKomunitas.longitude];

  const kupsList = kelompokKomunitas.kups?.split(',') ?? [];
  const programUnggulanList = kelompokKomunitas.programUnggulan?.split(',') ?? [];

  const centerAndZoom = getCenterCoordAndZoom(
    [
      [kelompokKomunitas.latitude, kelompokKomunitas.longitude],
      ...(
        kelompokKomunitas.groupCoordinateArea?.map(
          (coordinateArea) => coordinateArea.coordinates
        ) ?? []
      ).flat(),
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

              {/* Scroll horizontal images with height 100 */}
              {kelompokKomunitas.groupActivities &&
                kelompokKomunitas.groupActivities.length > 0 && (
                  <div className="col-span-3">
                    <div className="flex overflow-x-auto py-2">
                      {kelompokKomunitas.groupActivities.map((activity) =>
                        activity.image ? (
                          <div key={activity.id} className="flex-shrink-0">
                            <img
                              src={baseUrl + '\\thumbnails' + activity.image}
                              alt={activity.title}
                              className="h-24 w-auto object-cover border"
                              style={{ minWidth: 100, maxHeight: 100 }}
                            />
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
              {/* max width, text center, and can click to navigate to route gallery */}
              <div className="col-span-3 flex justify-center">
                <button
                  onClick={() => {
                    if (allPhotosRoute) {
                      navigate({ to: allPhotosRoute });
                    }
                  }}
                  className="block max-w-xs w-full text-center text-primary hover:underline cursor-pointer font-semibold">
                  Click to see all photos
                </button>
              </div>
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
                <Marker position={position} icon={markerDefaultIcon}>
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
                {kelompokKomunitas.groupCoordinateArea?.map((coordinateArea, index) => (
                  <Polygon key={coordinateArea.id} positions={coordinateArea.coordinates}>
                    <Popup>{'Area ' + (index + 1)}</Popup>
                  </Polygon>
                ))}
              </MapsLocation>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
