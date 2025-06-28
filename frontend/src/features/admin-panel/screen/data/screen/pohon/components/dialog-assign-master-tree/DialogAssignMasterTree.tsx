import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { InfoDialog } from '@/components/info-dialog';
import { TableData } from '@/components/table-data';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getTrees, massAssignMasterTree } from '@/lib/api/treeApi';
import { useUserStore } from '@/lib/stores/userStore';
import { TreeType } from '@/types/tree.type';

import { PohonTable } from '../pohon-table/PohonTable';

export function DialogAssignMasterTree({ refetchList }: { refetchList?: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const user = useUserStore((state) => state.user);
  const { setPage, setLimit, tempSearch, setTempSearch, paginationParams } = usePaginationFilter({
    limit: 5,
    withData:
      'masterTreeId,masterLocalTree,kelompokKomunitasId,adopter,adopter.userId,survey,survey.userId',
    sortBy: 'id',
    order: 'desc',
    filter: user?.groupId
      ? `kelompokKomunitasId:${user.groupId}:eq;masterTreeId::null`
      : 'masterTreeId::null',
  });

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-tree', paginationParams],
    queryFn: () => getTrees(paginationParams),
  });

  const totalPage = data?.totalPage ?? 0;

  const [showDialogResult, setShowDialogResult] = useState(false);
  const [resultData, setResultData] = useState<
    {
      id: number;
      code: string;
      localTreeName: string;
      masterTreeId?: number | null;
    }[]
  >([]);

  async function handleAssignMasterTree() {
    setResultData([]);
    try {
      const result = await massAssignMasterTree(user?.groupId ? String(user.groupId) : undefined);
      if (result.data.length === 0) {
        toast('Tidak ada master pohon yang diset secara otomatis');
        return;
      }
      setResultData(result.data);
      setShowDialogResult(true);
      setPage(1);
      refetch();
      refetchList?.();
    } catch (error) {
      console.error('Error assigning master tree:', error);
      toast('Gagal menetapkan pohon master secara otomatis');
    }
  }

  return (
    <DialogContent className="flex w-full sm:max-w-[900px]">
      <div className="w-full flex flex-col justify-center gap-2">
        <DialogHeader>
          <DialogTitle>Set Master Pohon Otomatis</DialogTitle>
          <DialogDescription>Pastikan data nama lokal pohon tidak ada yang salah</DialogDescription>
        </DialogHeader>
        {error ? (
          <div className="text-red-500 text-center mt-4">Error: {error.message}</div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto w-full">
            <TableData
              title="Pohon"
              tempSearch={tempSearch}
              setTempSearch={setTempSearch}
              page={paginationParams.page}
              setPage={setPage}
              totalPage={totalPage}
              limit={paginationParams.limit}
              setLimit={setLimit}
              table={
                <PohonTable
                  data={data?.data as TreeType[]}
                  isPending={isPending}
                  assignMasterTree
                  refetch={refetch}
                />
              }
            />
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" ref={closeRef}>
              Batal
            </Button>
          </DialogClose>
          <ConfirmationDialog
            title="Apakah anda yakin untuk menetapkan pohon master secara otomatis?"
            message="Data pohon yang tidak memiliki master pohon akan ditetapkan secara otomatis."
            confirmText="Set Master Pohon Otomatis"
            onConfirm={async () => {
              handleAssignMasterTree();
            }}
            triggerButton={<Button>Set Master Pohon Otomatis</Button>}
          />
        </DialogFooter>
      </div>
      <InfoDialog
        open={showDialogResult}
        onOpenChange={setShowDialogResult}
        title="Hasil Penetapan Master Pohon">
        {resultData.length > 0 ? (
          <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
            <p className="text-sm text-gray-500">
              Berikut adalah hasil set master pohon secara otomatis:
            </p>
            <ul className="list-decimal list-inside pl-5">
              {resultData.map((item) => (
                <li key={item.id} className="text-sm">
                  {item.code} {item.localTreeName} (ID: {item.id}) - Master Pohon ID:{' '}
                  {item.masterTreeId ?? 'Tidak ada'}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Tidak ada pohon yang ditetapkan sebagai master pohon.
          </p>
        )}
      </InfoDialog>
    </DialogContent>
  );
}
