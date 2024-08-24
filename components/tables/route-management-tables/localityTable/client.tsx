'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns'; // Ensure columns are updated for locality
import { Locality, LocalityData } from '@/constants/locality';

export const LocalityManagementClient: React.FC = () => {
  const router = useRouter();
  const initialData: Locality[] = LocalityData; // Using Locality data
  const [data, setData] = useState<Locality[]>(initialData);

  const handleSearch = (searchValue: string) => {
    const filteredData = initialData.filter(item =>
      item.sector.toLowerCase().includes(searchValue.toLowerCase())
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
          title={`Localities (${data.length})`}
          description="Manage Localities (Client-side table functionalities.)"
        />
      
      </div>
      <Separator />
     
      <DataTable
        columns={columns}
        searchKeys={['sector', 'pincode']}
        data={data}
        filters={filters}
      />
    </>
  );
};
