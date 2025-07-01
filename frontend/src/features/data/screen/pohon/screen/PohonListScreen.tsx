import { useQuery } from '@tanstack/react-query';

import { DropdownComunityGroupList, DropdownMasterTreeList } from '@/components/dropdown';
import { InfiniteScrollListMobile } from '@/components/infinite-scroll-list-mobile';
import { TableData } from '@/components/table-data';
import { FILTER_NAME } from '@/enum/filter-name.enum';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getTrees } from '@/lib/api/treeApi';
import { useUserStore } from '@/lib/stores/userStore';
import { TreeType } from '@/types/tree.type';

import { PohonTableAdopter } from '../components/pohon-table-adopter/PohonTableAdopter';
import { TreeMobileCard } from '../components/tree-mobile-card/TreeMobileCard';

export function PohonListScreen() {
  const user = useUserStore((state) => state.user);
  const {
    data: paginationData,
    setData,
    setPage,
    setLimit,
    tempSearch,
    setTempSearch,
    paginationParams,
    tempFilterState,
    handleApplyFilter,
  } = usePaginationFilter<TreeType>(
    {
      withData:
        'masterTreeId,masterLocalTree,kelompokKomunitasId,adopter,adopter.userId,survey,survey.userId',
      sortBy: 'id',
      order: 'desc',
      filter: user?.groupId ? `kelompokKomunitasId:${user.groupId}:eq` : undefined,
    },
    [FILTER_NAME.MASTER_TREE, FILTER_NAME.GROUP]
  );

  const { isPending, error, data } = useQuery({
    queryKey: ['get-tree', paginationParams],
    queryFn: () => getTrees(paginationParams),
  });

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <TableData
      title="Pohon"
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      page={paginationParams.page}
      setPage={setPage}
      totalPage={totalPage}
      limit={paginationParams.limit}
      setLimit={setLimit}
      elementsHeader={[
        <DropdownMasterTreeList
          value={tempFilterState[FILTER_NAME.MASTER_TREE]}
          setValue={(value) => {
            handleApplyFilter(FILTER_NAME.MASTER_TREE, value);
          }}
          withNullValue
          key="master-tree-dropdown"
        />,
        <DropdownComunityGroupList
          value={tempFilterState[FILTER_NAME.GROUP]}
          setValue={(value) => {
            handleApplyFilter(FILTER_NAME.GROUP, value);
          }}
          withNullValue
          key="group-dropdown"
        />,
      ]}
      table={<PohonTableAdopter data={data?.data as TreeType[]} isPending={isPending} />}
      infiniteScrollMobile={
        <InfiniteScrollListMobile<TreeType>
          responseData={data}
          data={paginationData}
          setData={setData}
          setPage={setPage}
          totalData={data?.total}
          refreshing={isPending}
          isError={!!error}
          renderItem={(item) => <TreeMobileCard tree={item} />}
        />
      }
    />
  );
}
