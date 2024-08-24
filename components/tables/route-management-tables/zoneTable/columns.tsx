'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Zone } from '@/constants/zones';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Zone>[] = [
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
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'zoneName',
    header: 'Zone Name',
  },
  {
    accessorKey: 'city',
    header: 'Associated City',
  },
  {
    accessorKey: 'serviced',
    header: 'Serviced',
    cell: ({ row }) => <div className="">{row.original.serviced ? 'Yes' : 'No'}</div>
  },
  {
    accessorKey: 'deliverySequence',
    header: 'Delivery Sequence',
    cell: ({ row }) => <div className="flex justify-center">{row.original.deliverySequence}</div>
  },
  {
    accessorKey: 'deliveryCost',
    header: 'Delivery Cost',
    cell: ({ row }) => <div className="flex justify-center">${row.original.deliveryCost.toFixed(2)}</div>
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
