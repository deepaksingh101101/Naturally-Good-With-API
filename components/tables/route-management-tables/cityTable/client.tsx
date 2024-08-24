'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { City, CityManagementData } from '@/constants/city';

export const CityManagementClient: React.FC = () => {
  const router = useRouter();
  const initialData: City[] = CityManagementData;
  const [data, setData] = useState<City[]>(initialData);

  const handleSearch = (searchValue: string) => {
    const filteredData = initialData.filter(item =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setData(filteredData);
  };

  const filters = [
    {
      label: 'Sort By',
      subOptions: ['Ascending order', 'Descending order'],
    },
  ];
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`City (${data.length})`}
          description="Manage City (Client-side table functionalities.)"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/city-management`)} // Adjust the route if needed
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        searchKeys={['name']}
        data={data}
        filters={filters}
      />
    </>
  );
};
