'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { City } from '@/constants/city';
import { CellAction } from './cell-action';

export const columns: ColumnDef<City>[] = [
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
    accessorKey: 'name',
    header: 'City Name',
  },
  {
    accessorKey: 'sortOrder',
    header: () => (
      <div className="text-center">Sort Order</div> // Center-align Sort Order header
    ),
    cell: ({ row }) => <div className="flex justify-center">{row.original.sortOrder}</div>

  },
  {
    accessorKey: 'routeCount',
    header: () => (
      <div className="text-center">Route Count</div> // Center-align Route Count header
    ),
    cell: ({ row }) => <div className="flex justify-center">{row.original.routeCount}</div>

  },
  {
    accessorKey: 'zoneCount',
    header: () => (
      <div className="text-center">Zone Count</div> // Center-align Zone Count header
    ),
    cell: ({ row }) => <div className="flex justify-center">{row.original.zoneCount}</div>

  },
  {
    accessorKey: 'sectorCount',
    header: () => (
      <div className="text-center">Sector Count</div> // Center-align Sector Count header
    ),
    cell: ({ row }) => <div className="flex justify-center">{row.original.sectorCount}</div>

  },
  {
    id: 'actions',
    header: () => (
      <div className="text-center">Action</div> // Center-align Action header
    ),
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
