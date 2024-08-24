'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Zone, ZoneManagementData } from '@/constants/zones';
import { columns } from './columns';

export const ZoneManagementClient: React.FC = () => {
  const router = useRouter();
  const initialData: Zone[] = ZoneManagementData; // Using Zone data instead of Vehicle data
  const [data, setData] = useState<Zone[]>(initialData);

  const handleSearch = (searchValue: string) => {
    const filteredData = initialData.filter(item =>
      item.zoneName.toLowerCase().includes(searchValue.toLowerCase())
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
          title={`Zones (${data.length})`}
          description="Manage Zones (Client-side table functionalities.)"
        />
      
      </div>
      <Separator />
      <DataTable
        columns={columns}
        searchKeys={['zoneName','city', 'serviced', 'deliverySequence', 'deliveryCost']}
        data={data}
        filters={filters}
      />
    </>
  );
};
