import { PaginationResponse } from '@/interface/pagination.interface';

export function handleResponseData<T>({
  responseData,
  isPending,
  isError,
  setData,
  setPage,
}: {
  responseData: PaginationResponse<T> | undefined;
  isPending: boolean;
  isError: boolean;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  if (responseData && !isPending && !isError) {
    if (responseData.page === 1) {
      setPage(1);
      setData(responseData.data);
    } else if (responseData.page > 1) {
      setData((prevData) => [...prevData, ...responseData.data]);
    }
  }
}

export function onEndReached<T>({
  isError,
  isPending,
  responseData,
  setPage,
}: {
  isError: boolean;
  isPending: boolean;
  responseData?: PaginationResponse<T> | null;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  if (!isError && !isPending && responseData?.page && responseData?.totalPage) {
    if (responseData.page < responseData.totalPage) {
      setPage((prevPage) => prevPage + 1);
    }
  }
}

export function handleOnRefresh({
  page,
  refetch,
  setPage,
}: {
  page: number;
  refetch: () => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  if (page === 1) {
    refetch();
  } else {
    setPage(1);
  }
}
