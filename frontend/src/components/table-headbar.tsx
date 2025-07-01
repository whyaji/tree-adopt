import { useNavigate } from '@tanstack/react-router';
import { Filter } from 'lucide-react';
import React, { JSX } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { Label } from './ui/label';

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
      <h1 className="text-lg font-semibold hidden sm:block">{title}</h1>
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
            className="hidden sm:flex items-center justify-center sm:justify-start w-full sm:w-auto"
            key={index}>
            {element}
          </div>
        ))}
        <div className="flex w-full sm:w-64 items-center gap-2">
          <Input
            className="flex-1"
            value={tempSearch}
            onChange={(e) => setTempSearch(e.target.value)}
            placeholder="Search"
          />
          <div className="sm:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="p-2">
                  <Filter size={16} />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="flex flex-col gap-2 p-4 min-h-[50vh] max-h-[80vh]">
                  <Label className="text-sm font-medium">Filter</Label>
                  {elementsHeader?.map((element, index) => (
                    <div className="flex items-center justify-between w-full" key={index}>
                      {element}
                    </div>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
};
