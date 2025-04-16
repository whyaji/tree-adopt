import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TableHeadbar({
  title,
  tempSearch,
  setTempSearch,
  addUrl,
}: {
  title: string;
  tempSearch: string;
  setTempSearch: (val: string) => void;
  addUrl?: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center mb-4">
      <h1>{title}</h1>
      <div className="flex items-center gap-2">
        {addUrl && (
          <Button variant="default" onClick={() => navigate({ to: addUrl })}>
            +
          </Button>
        )}
        <Input
          className="w-100"
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          placeholder="Search"
        />
      </div>
    </div>
  );
}
