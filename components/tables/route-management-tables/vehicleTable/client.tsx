'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns'; // Adjust this import based on your actual columns for vehicles
import { Vehicle, VehicleManagementData } from '@/constants/vehicle';

export const VehicleManagementClient: React.FC = () => {
  const router = useRouter();
  const initialData: Vehicle[] = VehicleManagementData; // Using Vehicle data instead of City data
  const [data, setData] = useState<Vehicle[]>(initialData);

  const handleSearch = (searchValue: string) => {
    const filteredData = initialData.filter(item =>
      item.vehicleName.toLowerCase().includes(searchValue.toLowerCase())
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
          title={`Vehicles (${data.length})`}
          description="Manage Vehicles (Client-side table functionalities.)"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/vehicle-management`)} // Adjust the route if needed
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        searchKeys={['vehicleName','vehicleNumber','driverName','driverNumber','vehicleModel','classification']}
        data={data}
        filters={filters}
      />
    </>
  );
};
