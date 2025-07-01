import { useNavigate } from '@tanstack/react-router';
import { Eye, TreePine, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LandCoverLabel } from '@/enum/landCover.enum';
import { TreeCategoryLabel } from '@/enum/treeCategory.enum';
import { TreeType } from '@/types/tree.type';

export function TreeMobileCard({ tree }: { tree: TreeType }) {
  const navigate = useNavigate();
  const handleDetailClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log('Navigate to tree details:', tree.id);
    navigate({
      to: `/data/pohon/${tree.id}`,
    });
  };

  const handleCardClick = () => {
    console.log('Card clicked:', tree.code);
    navigate({
      to: `/data/pohon/${tree.id}`,
    });
  };

  return (
    <div className="w-full mx-auto p-2">
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:bg-gray-50"
        onClick={handleCardClick}>
        <CardContent>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TreePine className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-base">{tree.code}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleDetailClick}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Tree Names - Compact */}
          <div className="mb-3">
            {tree.masterTree?.latinName && (
              <div className="text-sm font-medium text-gray-900 mb-1">
                <em>{tree.masterTree.latinName}</em>
              </div>
            )}
            <div className="text-sm text-gray-600">
              {tree.masterLocalTree?.map((localTree) => localTree.localName).join(', ') ||
                tree.localTreeName ||
                '-'}
            </div>
          </div>

          {/* Key Metrics - Horizontal Layout */}
          <div className="flex items-center gap-3 mb-3 text-xs">
            {tree.survey && (
              <>
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  {TreeCategoryLabel[tree.survey.category]}
                </Badge>
                <span className="text-gray-600">⌀ {tree.survey.circumference} cm</span>
                <span className="text-gray-600">{tree.survey.height} m</span>
                <span className="text-green-600 font-medium">CO₂ {tree.survey.serapanCo2}kg</span>
              </>
            )}
          </div>

          {/* Bottom Info */}
          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Komunitas:</span>
              <span className="text-right max-w-[60%] truncate">
                {tree.kelompokKomunitas?.name || '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tanah:</span>
              <span>{LandCoverLabel[tree.landCover]}</span>
            </div>
            {tree.adopter?.user && (
              <div className="flex justify-between items-center">
                <span>Adopter:</span>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="text-right max-w-[60%] truncate">{tree.adopter.user.name}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
