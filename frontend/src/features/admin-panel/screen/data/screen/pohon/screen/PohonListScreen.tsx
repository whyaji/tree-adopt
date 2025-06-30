import { useQuery } from '@tanstack/react-query';

import { DropdownComunityGroupList, DropdownMasterTreeList } from '@/components/dropdown';
import { TableData } from '@/components/table-data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { FILTER_NAME } from '@/enum/filter-name.enum';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getTrees } from '@/lib/api/treeApi';
import { useUserStore } from '@/lib/stores/userStore';
import { TreeType } from '@/types/tree.type';

import { DialogAssignMasterTree } from '../components/dialog-assign-master-tree/DialogAssignMasterTree';
import { PohonTable } from '../components/pohon-table/PohonTable';

export function PohonListScreen() {
  const user = useUserStore((state) => state.user);
  const {
    setPage,
    setLimit,
    tempSearch,
    setTempSearch,
    paginationParams,
    tempFilterState,
    handleApplyFilter,
  } = usePaginationFilter(
    {
      withData:
        'masterTreeId,masterLocalTree,kelompokKomunitasId,adopter,adopter.userId,survey,survey.userId',
      sortBy: 'id',
      order: 'desc',
      filter: user?.groupId ? `kelompokKomunitasId:${user.groupId}:eq` : undefined,
    },
    [FILTER_NAME.MASTER_TREE, FILTER_NAME.GROUP]
  );

  const { isPending, error, data, refetch } = useQuery({
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
      addUrl="/admin/data/pohon/add"
      elementsHeader={[
        <Dialog key="dialog-assign-master-tree">
          <DialogTrigger asChild>
            <Button className="w-full" variant="default">
              Set Master Pohon Otomatis
            </Button>
          </DialogTrigger>
          <DialogAssignMasterTree refetchList={refetch} />
        </Dialog>,
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
      table={<PohonTable data={data?.data as TreeType[]} isPending={isPending} refetch={refetch} />}
    />
  );
}
