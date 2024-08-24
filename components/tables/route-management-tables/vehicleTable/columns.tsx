'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Vehicle } from '@/constants/vehicle';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Vehicle>[] = [
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
    accessorKey: 'vehicleName',
    header: 'Vehicle Name',
  },
  {
    accessorKey: 'classification',
    header: 'Classification',
  },
  {
    accessorKey: 'vehicleNumber',
    header: 'Vehicle Number',
    cell: ({ row }) => <div className="flex justify-center">{row.original.vehicleNumber}</div>
  },
  {
    accessorKey: 'vehicleModel',
    header: 'Vehicle Model',
    cell: ({ row }) => <div className="flex justify-center">{row.original.vehicleModel}</div>
  },
  {
    accessorKey: 'driverName',
    header: 'Driver Name',
    cell: ({ row }) => <div className="flex justify-center">{row.original.driverName}</div>
  },
  {
    accessorKey: 'driverNumber',
    header: 'Driver Number',
    cell: ({ row }) => <div className="flex justify-center">{row.original.driverNumber}</div>
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
