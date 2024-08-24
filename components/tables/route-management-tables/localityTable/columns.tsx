'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { CellAction } from './cell-action';
import { Locality } from '@/constants/locality';

export const columns: ColumnDef<Locality>[] = [ // Updated type to Locality
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
    accessorKey: 'sector',
    header: 'Locality Name',
  },
  {
    accessorKey: 'city',
    header: 'Associated City',
  },
  {
    accessorKey: 'zone',
    header: 'Associated Zone',
  },

  {
    accessorKey: 'pin',
    header: 'Pin',
  },
  {
    accessorKey: 'sortOrder',
    header: 'Sort Order',
    cell: ({ row }) => <div className="flex justify-center">{row.original.sortOrder}</div>,
  },
  {
    accessorKey: 'serviced',
    header: 'Serviced',
    cell: ({ row }) => <div className="flex justify-center">{row.original.serviced}</div>,
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <CellAction data={row.original} /> // Ensure CellAction handles Locality
  }
];
