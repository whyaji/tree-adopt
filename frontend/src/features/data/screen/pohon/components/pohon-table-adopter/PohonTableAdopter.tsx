import { useNavigate } from '@tanstack/react-router';
import { Eye } from 'lucide-react';

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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LandCoverLabel } from '@/enum/landCover.enum';
import { TreeCategoryLabel } from '@/enum/treeCategory.enum';
import { TreeType } from '@/types/tree.type';

import { TreeDetailTooltip } from '../tree-detail-tooltip/TreeDetailTooltip';

export function PohonTableAdopter({
  data,
  isPending,
  assignMasterTree = false,
}: {
  data?: TreeType[];
  isPending: boolean;
  assignMasterTree?: boolean;
}) {
  const navigate = useNavigate();

  if (!data && !isPending) {
    return <div className="text-center">No data available</div>;
  }

  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-background">
        <TableRow>
          {[
            'ID',
            'Kode',
            'Nama Pohon',
            !assignMasterTree ? 'Komunitas' : null,
            !assignMasterTree ? 'Deskripsi' : null,
            !assignMasterTree ? 'Adopter' : null,
            'Action',
          ]
            .filter((value) => value !== null)
            .map((head) => (
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
          : data?.map((tree) => (
              <Tooltip key={tree.id}>
                <TooltipTrigger asChild>
                  <TableRow key={tree.id}>
                    <TableCell>{tree.id}</TableCell>
                    <TableCell>{tree.code}</TableCell>
                    <TableCell>
                      {tree.masterTree?.latinName && (
                        <div>
                          <strong>Latin:</strong> {tree.masterTree?.latinName}
                        </div>
                      )}
                      <div>
                        <strong>Lokal:</strong>{' '}
                        {(tree.masterLocalTree
                          ?.map((localTree) => localTree.localName)
                          .join(', ') ||
                          tree.localTreeName) ??
                          '-'}
                      </div>
                    </TableCell>
                    {!assignMasterTree && (
                      <>
                        <TableCell>{tree.kelompokKomunitas?.name}</TableCell>
                        <TableCell>
                          {tree.survey && (
                            <div>
                              <div>
                                <strong>Kategori:</strong> {TreeCategoryLabel[tree.survey.category]}
                              </div>
                              <div>
                                <strong>Circumference:</strong> {tree.survey.circumference} cm
                              </div>
                              <div>
                                <strong>Serapan Karbon (CO2):</strong> {tree.survey.serapanCo2} kg
                              </div>
                            </div>
                          )}
                          <div>
                            <strong>Jenis Tanah:</strong> {LandCoverLabel[tree.landCover]}
                          </div>
                        </TableCell>
                        <TableCell>{tree.adopter?.user?.name ?? '-'}</TableCell>
                      </>
                    )}
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate({
                              to: `/data/pohon/${tree.id}`,
                            })
                          }>
                          <Eye className="h-4 w-4" />
                          Detail
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TooltipTrigger>
                <TooltipContent className="max-w-screen">
                  <TreeDetailTooltip tree={tree} />
                </TooltipContent>
              </Tooltip>
            ))}
      </TableBody>
    </Table>
  );
}
