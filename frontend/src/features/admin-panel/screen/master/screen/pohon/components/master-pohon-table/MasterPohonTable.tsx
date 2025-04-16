import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteMasterTree } from '@/lib/api/masterTreeApi';
import { MasterTreeType } from '@/types/masterTree.type';

export function MasterPohonTable({
  data,
  isPending,
}: {
  data?: MasterTreeType[];
  isPending: boolean;
}) {
  const navigate = useNavigate();

  if (!data && !isPending) {
    return <div className="text-center">No data available</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {['ID', 'Latin Name', 'Local Name', 'Action'].map((head) => (
            <TableHead key={head}>{head}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending
          ? Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 9 }).map((_, subIndex) => (
                  <TableHead key={subIndex}>
                    <Skeleton className="h-5" />
                  </TableHead>
                ))}
              </TableRow>
            ))
          : data?.map((masterTree) => (
              <TableRow key={masterTree.id}>
                <TableCell>{masterTree.id}</TableCell>
                <TableCell>{masterTree.latinName}</TableCell>
                <TableCell>{masterTree.localName}</TableCell>
                <TableCell className="flex flex-row gap-4">
                  <Button
                    variant="outline"
                    className="w-20"
                    onClick={() =>
                      navigate({
                        to: `/admin/master/pohon/update/${masterTree.id}`,
                      })
                    }>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="w-20"
                    onClick={async () => {
                      await deleteMasterTree(String(masterTree.id));
                      window.location.reload();
                    }}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
