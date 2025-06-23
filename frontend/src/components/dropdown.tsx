'use client';

import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, RefreshCcw, Search } from 'lucide-react';
import * as React from 'react';
import { ClipLoader } from 'react-spinners';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { PaginationParamsOptional } from '@/interface/pagination.interface';
import { getKelompokKomunitas } from '@/lib/api/kelompokKomunitasApi';
import { getMasterTrees } from '@/lib/api/masterTreeApi';
import { getUsers } from '@/lib/api/userApi';
import { cn } from '@/lib/utils';
import { handleOnRefresh, handleResponseData, onEndReached } from '@/lib/utils/paginationConfig';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';
import { MasterTreeType } from '@/types/masterTree.type';
import { UserType } from '@/types/user.type';

import { Input } from './ui/input';
import { Label } from './ui/label';

export function Dropdown({
  label = '',
  data,
  value,
  setValue,
  search,
  setSearch,
  onEndReached,
  refreshing,
  onRefresh,
  totalData,
}: {
  label?: string;
  data: {
    label: string;
    value: string;
    secondaryLabel?: string;
  }[];
  value: string;
  setValue: (value: string) => void;
  search?: string;
  setSearch?: (search: string) => void;
  onEndReached?: () => Promise<void> | void;
  refreshing?: boolean;
  onRefresh?: () => void;
  totalData?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const selectedItem = data.find((itemValue) => itemValue.value === value);

  const handleEndReached = async () => {
    if (!loadingMore && !refreshing && typeof totalData === 'number' && data.length < totalData) {
      setLoadingMore(true);
      await onEndReached?.();
      setLoadingMore(false);
    }
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between hover:bg-accent/20 transition-colors">
            {value ? (
              <span className="truncate font-normal">
                {selectedItem?.label}{' '}
                {selectedItem?.secondaryLabel && (
                  <span className="italic">- {selectedItem.secondaryLabel}</span>
                )}
              </span>
            ) : (
              <span className={cn('truncate font-normal', 'text-muted-foreground')}>
                {`- Select ${label} -`}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          style={{ width: triggerRef?.current?.offsetWidth }}
          className="p-2 space-y-2">
          {search !== undefined && setSearch !== undefined && (
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${label}...`}
                value={search}
                inputMode="search"
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-10 py-2 text-sm border-0 border-b-1 rounded-b-none focus-visible:ring-0"
              />
              {onRefresh !== undefined && refreshing !== undefined && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => {
                    if (!refreshing) {
                      onRefresh();
                    }
                  }}>
                  <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          )}

          <div
            className="max-h-60 overflow-y-auto"
            onScroll={(e) => {
              const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
              const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
              if (isAtBottom) {
                handleEndReached();
              }
            }}>
            {data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 text-sm text-muted-foreground">
                <Search className="h-5 w-5 mb-2" />
                <p>No {label} found</p>
              </div>
            ) : (
              data.map((item) => (
                <div
                  key={item.value}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md transition-colors',
                    value === item.value && 'bg-accent font-medium text-primary'
                  )}
                  onClick={() => {
                    setValue(item.value === value ? '' : item.value);
                    setOpen(false);
                    setSearch?.('');
                  }}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 flex-shrink-0',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="truncate">
                    {item.label}{' '}
                    {item.secondaryLabel && <span className="italic">- {item.secondaryLabel}</span>}
                  </span>
                </div>
              ))
            )}

            <div className="flex items-center justify-center py-2 text-sm text-muted-foreground gap-2">
              {(refreshing || loadingMore) && (
                <>
                  <ClipLoader size={24} aria-label="Loading Spinner" data-testid="loader" />
                  <Label className="text-xs">Loading...</Label>
                </>
              )}
              {!refreshing && !loadingMore && typeof totalData === 'number' && (
                <Label className="text-xs">{`Showing ${data.length} from ${totalData}`}</Label>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DropdownDataList({
  label = '',
  values,
  value,
  setValue,
}: {
  label?: string;
  values: {
    label: string;
    value: string;
  }[];
  value: string;
  setValue: (value: string) => void;
}) {
  const [search, setSearch] = React.useState('');

  const data = values.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dropdown
      label={label}
      data={data}
      value={value}
      setValue={setValue}
      search={search}
      setSearch={setSearch}
      onEndReached={() => {
        console.log('End reached!');
      }}
    />
  );
}

export function DropdownUsers({
  label = 'User',
  value,
  setValue,
}: {
  label?: string;
  value: string;
  setValue: (value: string) => void;
}) {
  const [search, setSearch] = React.useState('');

  return (
    <Dropdown
      label={label}
      data={[]}
      value={value}
      setValue={setValue}
      search={search}
      setSearch={setSearch}
    />
  );
}

type PaginationDropdownProps = {
  label?: string;
  value: string;
  setValue: (value: string) => void;
  defaultParams?: PaginationParamsOptional;
};

export function DropdownMasterTreeList({
  label = 'Tree',
  value,
  setValue,
  defaultParams,
}: PaginationDropdownProps) {
  const { page, setPage, tempSearch, setTempSearch, data, setData, paginationParams } =
    usePaginationFilter<MasterTreeType>(defaultParams);

  const {
    isPending,
    isError,
    data: responseData,
    refetch,
  } = useQuery({
    queryKey: ['get-master-tree', paginationParams],
    queryFn: () => getMasterTrees(paginationParams),
  });

  React.useEffect(() => {
    handleResponseData({
      responseData,
      isPending,
      isError,
      setData,
      setPage,
    });
  }, [isError, isPending, responseData, responseData?.data, responseData?.page, setData, setPage]);

  const refresing = isPending;

  const onRefresh = () => {
    handleOnRefresh({ page, refetch, setPage });
  };

  return (
    <Dropdown
      label={label}
      data={data.map((item) => ({
        label: item.latinName,
        value: item.id.toString(),
        secondaryLabel: item.masterLocalTree?.map((local) => local.localName).join(', ') ?? '',
      }))}
      value={value}
      setValue={setValue}
      search={tempSearch}
      setSearch={setTempSearch}
      onEndReached={() => {
        onEndReached({ isError, isPending, responseData, setPage });
      }}
      totalData={responseData?.total ?? undefined}
      refreshing={refresing}
      onRefresh={onRefresh}
    />
  );
}

export function DropdownUserList({
  label = 'User',
  value,
  setValue,
  defaultParams,
}: PaginationDropdownProps) {
  const { page, setPage, tempSearch, setTempSearch, data, setData, paginationParams } =
    usePaginationFilter<UserType>(defaultParams);

  const {
    isPending,
    isError,
    data: responseData,
    refetch,
  } = useQuery({
    queryKey: ['get-users', paginationParams],
    queryFn: () => getUsers(paginationParams),
  });

  React.useEffect(() => {
    handleResponseData({
      responseData,
      isPending,
      isError,
      setData,
      setPage,
    });
  }, [isError, isPending, responseData, responseData?.data, responseData?.page, setData, setPage]);

  const refresing = isPending;

  const onRefresh = () => {
    handleOnRefresh({ page, refetch, setPage });
  };

  return (
    <Dropdown
      label={label}
      data={data.map((item) => ({
        label: item.name,
        value: item.id.toString(),
        secondaryLabel: item.email,
      }))}
      value={value}
      setValue={setValue}
      search={tempSearch}
      setSearch={setTempSearch}
      onEndReached={() => {
        onEndReached({ isError, isPending, responseData, setPage });
      }}
      totalData={responseData?.total ?? undefined}
      refreshing={refresing}
      onRefresh={onRefresh}
    />
  );
}

export function DropdownComunityGroupList({
  label = 'Comunity Group',
  value,
  setValue,
  defaultParams,
}: PaginationDropdownProps) {
  const { page, setPage, tempSearch, setTempSearch, data, setData, paginationParams } =
    usePaginationFilter<KelompokKomunitasType>(defaultParams);

  const {
    isPending,
    isError,
    data: responseData,
    refetch,
  } = useQuery({
    queryKey: ['get-kelompok-komunitas', paginationParams],
    queryFn: () => getKelompokKomunitas(paginationParams),
  });

  React.useEffect(() => {
    handleResponseData({
      responseData,
      isPending,
      isError,
      setData,
      setPage,
    });
  }, [isError, isPending, responseData, responseData?.data, responseData?.page, setData, setPage]);

  const refresing = isPending;

  const onRefresh = () => {
    handleOnRefresh({ page, refetch, setPage });
  };

  return (
    <Dropdown
      label={label}
      data={data.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      }))}
      value={value}
      setValue={setValue}
      search={tempSearch}
      setSearch={setTempSearch}
      onEndReached={() => {
        onEndReached({ isError, isPending, responseData, setPage });
      }}
      totalData={responseData?.total ?? undefined}
      refreshing={refresing}
      onRefresh={onRefresh}
    />
  );
}
