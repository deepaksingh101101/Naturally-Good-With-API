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
    accessorKey: 'discountPrice',
    header: 'Discount Price',
    cell: ({ row }) => `₹${row.original.discountPrice}`
  },
  {
    accessorKey: 'visibility',
    header: 'Visibility',
    cell: ({ row }) => (
      <div
        style={{ borderRadius: "20px" }}
        className={`flex items-center px-2 py-1 ${
          row.original.visibility === 'global' ? 'bg-green-400' :
          row.original.visibility === 'subscription' ? 'bg-blue-400' :
          'bg-red-400'
        }`}
      >
        <span className='text-black bold'>
          {row.original.visibility === 'global' ? "Global" : "Subscription"}
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
    accessorKey: 'subscriptionPrice',
    header: 'Subscription Price',
    cell: ({ row }) => row.original.subscriptionPrice ? `₹${row.original.subscriptionPrice}` : 'N/A'
  },
  {
    accessorKey: 'netPrice',
    header: 'Net Price',
    cell: ({ row }) => row.original.netPrice ? `₹${row.original.netPrice}` : 'N/A'
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
