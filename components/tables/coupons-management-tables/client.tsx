'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
// import { UserManagement, userManagementData } from '@/constants/user-management-data';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { SubscriptionManagement, SubscriptionManagementData } from '@/constants/subscription-management-data';
import { ProductManagement, ProductManagementData } from '@/constants/product-management-data';
import { CouponManagement, CouponManagementData } from '@/constants/coupons-management-data';

export const CouponsManagementClient: React.FC = () => {
  const router = useRouter();
  const initialData: CouponManagement[] = CouponManagementData;
  const [data, setData] = useState<CouponManagement[]>(initialData);

  const handleSearch = (searchValue: string) => {
    const filteredData = initialData.filter(item =>
      item.code.toLowerCase().includes(searchValue.toLowerCase())
    );
    setData(filteredData);
  };

  const handleSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    // Example: Sorting by first name
    const sortedData = [...data].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.code.localeCompare(b.code);
      } else {
        return b.code.localeCompare(a.code);
      }
    });
    setData(sortedData);
  };
  const filters = [
    {
      label: 'Season ',
      subOptions: ['Winter', 'Autumn',],
    },
    {
      label: 'Priority',
      subOptions: ['High', 'Medium', 'Low'],
    },
  
  ];

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Coupons (${data.length})`}
          description="Manage Coupons (Client side table functionalities.)"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/coupons-management`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKeys={["code"]}
        columns={columns}
        data={data}
        onSearch={handleSearch} 
        filters={filters}

        // onSort={handleSort} 
      />
    </>
  );
};
