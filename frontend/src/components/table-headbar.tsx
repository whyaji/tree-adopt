import { useNavigate } from '@tanstack/react-router';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const TableHeadbar: React.FC<{
  title: string;
  tempSearch: string;
  setTempSearch: (val: string) => void;
  addUrl?: string;
  elementsHeader?: React.ReactNode[];
}> = ({ title, tempSearch, setTempSearch, addUrl, elementsHeader }) => {
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
        {elementsHeader?.map((element, index) => (
          <React.Fragment key={index}>{element}</React.Fragment>
        ))}
        <Input
          className="w-100"
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          placeholder="Search"
        />
      </div>
    </div>
  );
};
