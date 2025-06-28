import { useNavigate } from '@tanstack/react-router';
import React, { JSX } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const TableHeadbar: React.FC<{
  title: string;
  tempSearch: string;
  setTempSearch: (val: string) => void;
  addUrl?: string;
  elementsHeader?: JSX.Element[];
}> = ({ title, tempSearch, setTempSearch, addUrl, elementsHeader }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        {addUrl && (
          <Button
            variant="default"
            onClick={() => navigate({ to: addUrl })}
            className="w-full sm:w-auto">
            +
          </Button>
        )}
        {elementsHeader?.map((element, index) => (
          <div
            className="flex items-center justify-center sm:justify-start w-full sm:w-auto"
            key={index}>
            {element}
          </div>
        ))}
        <Input
          className="w-full sm:w-64"
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          placeholder="Search"
        />
      </div>
    </div>
  );
};
