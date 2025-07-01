import React, { useRef } from 'react';

import { PaginationResponse } from '@/interface/pagination.interface';
import { handleResponseData, onEndReached } from '@/lib/utils/paginationConfig';

export function InfiniteScrollListMobile<T>({
  renderItem,
  data,
  className,
  totalData,
  refreshing,
  responseData,
  isError,
  setData,
  setPage,
}: {
  renderItem: (item: T) => React.ReactNode;
  data: T[];
  className?: string;
  totalData?: number;
  refreshing: boolean;
  responseData: PaginationResponse<T> | undefined;
  isError: boolean;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [loadingMore, setLoadingMore] = React.useState(false);

  React.useEffect(() => {
    handleResponseData<T>({
      responseData,
      isPending: refreshing,
      isError,
      setData,
      setPage,
    });
  }, [isError, refreshing, responseData, responseData?.data, responseData?.page, setData, setPage]);

  const handleEndReached = async () => {
    if (!loadingMore && !refreshing && typeof totalData === 'number' && data.length < totalData) {
      setLoadingMore(true);
      onEndReached({ isError, isPending: refreshing, responseData, setPage });
      setLoadingMore(false);
    }
  };

  return (
    <div
      ref={listRef}
      className={`infinite-scroll-list-mobile overflow-y-auto w-full ${className ?? ''}`}
      onScroll={(e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
        if (isAtBottom) {
          handleEndReached();
        }
      }}>
      {data.length === 0 && !refreshing ? (
        <div className="flex flex-col items-center justify-center py-4 text-sm text-muted-foreground">
          <span>No items found</span>
        </div>
      ) : (
        data.map((item, index) => (
          <div key={index} className="item">
            {renderItem(item)}
          </div>
        ))
      )}

      <div className="flex items-center justify-center py-2 text-sm text-muted-foreground gap-2">
        {(loadingMore || refreshing) && (
          <>
            <span className="loader" /> {/* Replace with your spinner */}
            <span className="text-xs">Loading...</span>
          </>
        )}
        {!refreshing && !loadingMore && typeof totalData === 'number' && (
          <span className="text-xs">{`Showing ${data.length} from ${totalData}`}</span>
        )}
      </div>
    </div>
  );
}
