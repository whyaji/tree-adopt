import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Marker, Polygon, Popup } from 'react-leaflet';

import { MAPS_CENTER } from '@/constants/maps';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { PaginationParams } from '@/interface/pagination.interface';
import { getKelompokKomunitas } from '@/lib/api/kelompokKomunitasApi';
import { getTrees } from '@/lib/api/treeApi';
import { getCenterCoordAndZoom } from '@/lib/utils/maps';
import { markerDefaultIcon, markerTreeIcon } from '@/lib/utils/markerIcons';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';
import { TreeType } from '@/types/tree.type';

import { MapsLocation } from '../maps-location';

const getColorGroupBasedOnId = (index: number) => {
  const colors = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#F1C40F',
    '#8E44AD',
    '#1ABC9C',
    '#E67E22',
    '#2ECC71',
    '#E74C3C',
    '#3498DB',
    '#9B59B6',
    '#34495E',
    '#16A085',
    '#F39C12',
    '#C0392B',
  ];
  return colors[index % colors.length];
};

export function MappingScreenComponent() {
  const mapRef = useRef<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(MAPS_CENTER.DEFAULT);
  const [mapZoom, setMapZoom] = useState(12);

  const { paginationParams } = usePaginationFilter({ limit: 999, withData: 'groupCoordinateArea' });

  const { data } = useQuery({
    queryKey: ['get-komunitas', paginationParams],
    queryFn: () => getKelompokKomunitas(paginationParams),
  });

  const dataGroups = data?.data as KelompokKomunitasType[] | undefined;
  const [trees, setTrees] = useState<TreeType[]>([]);

  useEffect(() => {
    if (dataGroups && dataGroups.length > 0) {
      const allCoordinates: [number, number][] = [
        ...dataGroups.flatMap((komunitas) => [
          [komunitas.latitude, komunitas.longitude],
          ...(komunitas.groupCoordinateArea
            ?.map((coordinateArea) => coordinateArea.coordinates)
            .flat() ?? []),
        ]),
        ...trees.map((tree) => [tree.latitude, tree.longitude] as [number, number]),
      ].filter(
        (coord): coord is [number, number] =>
          Array.isArray(coord) &&
          coord.length === 2 &&
          typeof coord[0] === 'number' &&
          typeof coord[1] === 'number'
      );

      const centerAndZoom = getCenterCoordAndZoom(allCoordinates);

      if (centerAndZoom) {
        setMapCenter(centerAndZoom.center);
        setMapZoom(centerAndZoom.zoom);
      }
    }
  }, [dataGroups, trees]);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchTrees = async (paginationParams: PaginationParams) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        const response = await getTrees(paginationParams);
        setTrees((prevTrees) => [...prevTrees, ...(response.data as TreeType[])]);

        if (paginationParams.page < response.totalPage) {
          await fetchTrees({
            ...paginationParams,
            page: paginationParams.page + 1,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    setTrees([]);
    fetchTrees({ page: 1, limit: 50 });
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden relative z-0">
      <MapsLocation
        autoReZoom
        autoRecenter
        ref={mapRef}
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        zoomControl={true}
        className="w-full h-full">
        {dataGroups?.map((komunitas) => (
          <Marker
            position={[komunitas.latitude, komunitas.longitude]}
            key={komunitas.id}
            icon={markerDefaultIcon}>
            <Popup>
              <div className="text-sm">
                <strong>{komunitas.name}</strong>
                <br />
                {komunitas.address}
              </div>
            </Popup>
          </Marker>
        ))}
        {dataGroups?.map((komunitas, indexGroup) =>
          komunitas.groupCoordinateArea?.map((coordinateArea, index) => (
            <Polygon
              key={`${komunitas.id}-area-${index}`}
              positions={coordinateArea.coordinates}
              color={getColorGroupBasedOnId(indexGroup)}>
              <Popup>{`Area ${komunitas.name} ` + (index + 1)}</Popup>
            </Polygon>
          ))
        )}
        {trees.map((tree) => (
          <Marker position={[tree.latitude, tree.longitude]} key={tree.id} icon={markerTreeIcon}>
            <Popup>
              <div className="text-sm">
                <strong>{tree.code}</strong>
                <br />
                {dataGroups?.find((komunitas) => komunitas.id === tree.kelompokKomunitasId)?.name ??
                  'Kelompok Tidak diketahui'}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapsLocation>
    </div>
  );
}
