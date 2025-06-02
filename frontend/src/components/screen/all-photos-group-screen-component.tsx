import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { baseUrl } from '@/lib/api/api';
import { getGroupActivities } from '@/lib/api/groupActivityApi';
import { toDbDate } from '@/lib/utils/dateTimeFormat';
import { handleResponseData, onEndReached } from '@/lib/utils/paginationConfig';
import { GroupActivityType } from '@/types/groupActivity.type';

import { MapsLocation } from '../maps-location';

export function AllPhotosGroupScreenComponent({
  kelompokKomunitasId,
}: {
  kelompokKomunitasId: string;
}) {
  const paginationParams = usePaginationFilter({
    filter: `kelompokKomunitasId:${kelompokKomunitasId}:eq`,
    // limit: 2,
  });

  const { isPending, error, data, isError } = useQuery({
    queryKey: ['get-group-activities', paginationParams.paginationParams],
    queryFn: () => getGroupActivities(paginationParams),
    enabled: !!kelompokKomunitasId,
  });

  const [loadingMore, setLoadingMore] = useState(false);
  const { setPage } = paginationParams;
  const [activities, setActivities] = useState<GroupActivityType[]>([]);

  const [selectedActivity, setSelectedActivity] = useState<GroupActivityType | undefined>(
    undefined
  );

  useEffect(() => {
    handleResponseData({
      responseData: data,
      isPending,
      isError,
      setData: setActivities,
      setPage,
    });
  }, [isError, isPending, data, data?.data, data?.page, setActivities, setPage]);

  if (isError) return <div>Error: {error.message}</div>;

  const refreshing = isPending;
  const totalData = data?.total ?? undefined;

  const handleEndReached = async () => {
    if (
      !loadingMore &&
      !refreshing &&
      typeof totalData === 'number' &&
      activities.length < totalData
    ) {
      setLoadingMore(true);
      await onEndReached({ isError, isPending, responseData: data, setPage });
      setLoadingMore(false);
    }
  };

  return (
    <div className="m-auto mt-6 max-w-7xl px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Gallery List */}
        <div
          className="flex-1 grid grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-[500px]"
          onScroll={(() => {
            let ticking = false;
            return (e: React.UIEvent<HTMLDivElement>) => {
              if (!ticking) {
                window.requestAnimationFrame(() => {
                  const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
                  if (isAtBottom) {
                    handleEndReached();
                  }
                  ticking = false;
                });
                ticking = true;
              }
            };
          })()}>
          {activities.map((activity) => (
            <button
              key={activity.id}
              className="cursor-pointer border rounded overflow-hidden hover:ring-2 ring-primary"
              onClick={() => setSelectedActivity(activity)}>
              <img
                src={baseUrl + `/thumbnails${activity.image}`}
                alt="Thumbnail"
                width={200}
                height={200}
                className="object-cover w-full h-32"
              />
            </button>
          ))}
        </div>

        {/* Selected Image Preview */}
        <div className="flex-1 border rounded p-4 min-h-[300px] flex items-center justify-center bg-gray-50">
          {selectedActivity ? (
            <div className="w-full">
              <img
                src={baseUrl + `${selectedActivity.image}`}
                alt="Selected"
                width={600}
                height={400}
                className="object-contain w-full"
              />
              <div className="grid grid-cols-[100px_20px_1fr] gap-y-2 pt-2 pb-2">
                <div className="font-semibold">Kode foto</div>
                <div>:</div>
                <div>{selectedActivity.code}</div>

                <div className="font-semibold">Judul</div>
                <div>:</div>
                <div>{selectedActivity.title}</div>

                <div className="font-semibold">Tanggal</div>
                <div>:</div>
                <div>
                  {toDbDate(selectedActivity.date, {
                    fromFormat: 'YYYY-MM-DD',
                    toFormat: 'D MMMM YYYY',
                  })}
                  , {selectedActivity.time}
                </div>

                <div className="font-semibold">Lokasi</div>
                <div>:</div>
                <div>{selectedActivity.location}</div>
              </div>
              <MapsLocation
                center={[selectedActivity.latitude, selectedActivity.longitude]}
                zoom={16}
                scrollWheelZoom={true}
                zoomControl={true}
                className="w-full h-[200px]"
                position={[selectedActivity.latitude, selectedActivity.longitude]}
              />
            </div>
          ) : (
            <p className="text-gray-500">Select a photo to preview</p>
          )}
        </div>
      </div>
    </div>
  );
}
