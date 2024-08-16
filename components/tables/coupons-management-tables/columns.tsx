'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { format } from 'date-fns';
import { CouponManagement } from '@/constants/coupons-management-data';

export const columns: ColumnDef<CouponManagement>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'sno',
    header: 'Sno',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'code',
    header: 'Coupon Code'
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => (
      <div className="flex items-center">
        <Image src={row.original.image} alt={row.original.code} width={50} height={50} />
      </div>
    )
  },
  {
    accessorKey: 'discountPrice',
    header: 'Discount Price',
    cell: ({ row }) => {
      const discount = row.original.discountPrice;
      return discount ? `₹ ${discount}` : 'N/A';
    }
  },
  {
    accessorKey: 'discountPercentage',
    header: 'Discount Percentage',
    cell: ({ row }) => {
      const discount = row.original.discountPercentage;
      return discount ? `${discount}%` : 'N/A';
    }
  }
,  
  {
    accessorKey: 'couponType',
    header: 'Coupon Type',
    cell: ({ row }) => (
      <div
        style={{ borderRadius: "20px" }}
        className={`flex items-center px-2 py-1 ${
          row.original.couponType === 'global' ? 'bg-green-400' :
          row.original.couponType === 'subscription' ? 'bg-blue-400' :
          'bg-red-400'
        }`}
      >
        <span className='text-black bold'>
          {row.original.couponType === 'global' ? "Global" : "Subscription"}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'visibility',
    header: 'Visibility',
    cell: ({ row }) => (
      <div
        style={{ borderRadius: "20px" }}
        className={`flex items-center px-2 py-1 ${
          row.original.visibility === 'public' ? 'bg-green-400' :
          row.original.visibility === 'admin' ? 'bg-blue-400' :
          'bg-red-400'
        }`}
      >
        <span className='text-black bold'>
          {row.original.visibility === 'admin' ? "Admin" : "Public"}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'subscriptionType',
    header: 'Subscription Type',
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.subscriptionType ? row.original.subscriptionType.name : 'N/A'}
      </div>
    )
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => row.original.startDate ? format(row.original.startDate, 'dd MMM yyyy') : 'N/A'
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => row.original.endDate ? format(row.original.endDate, 'dd MMM yyyy') : 'N/A'
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="text-start">
        {row.original.description.split(' ').slice(0, 10).join(' ')}...
      </div>
    )
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
