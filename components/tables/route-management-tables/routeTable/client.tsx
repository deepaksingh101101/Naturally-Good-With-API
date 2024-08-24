'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns'; // Ensure columns are updated for route
import { Route, RouteData } from '@/constants/route';

export const RouteManagementClient: React.FC = () => {
  const router = useRouter();
  const initialData: Route[] = RouteData; // Using Route data
  const [data, setData] = useState<Route[]>(initialData);

  const handleSearch = (searchValue: string) => {
    const filteredData = initialData.filter(item =>
      item.routeName.toLowerCase().includes(searchValue.toLowerCase())
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
          title={`Routes (${data.length})`}
          description="Manage Routes (Client-side table functionalities.)"
        />
    
      </div>
      <Separator />
      <DataTable
        columns={columns}
        searchKeys={['routeName', 'city', 'status', 'day', 'vehicleTagged', 'serviced']}
        data={data}
        filters={filters}
      />
    </>
  );
};
