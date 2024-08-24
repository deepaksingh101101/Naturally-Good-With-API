'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { CellAction } from './cell-action';
import { Route } from '@/constants/route'; // Ensure the import path matches your project structure

export const columns: ColumnDef<Route>[] = [ // Updated type to Route
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
    accessorKey: 'routeName',
    header: 'Route Name',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'day',
    header: 'Days',
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.day.join(', ')} {/* Display days as comma-separated */}
      </div>
    ),
  },
  {
    accessorKey: 'vehicleTagged',
    header: 'Vehicles Tagged',
    cell: ({ row }) => (
      <div className="flex flex-col">
        {row.original.vehicleTagged.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-green-300 ">Vehicle Name</th>
                <th className="border p-2 bg-green-300 ">Driver Name</th>
                <th className="border p-2 bg-green-300 ">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {row.original.vehicleTagged.map(vehicle => (
                <tr key={vehicle.id}>
                  <td className="border p-2">{vehicle.vehicleName}</td>
                  <td className="border p-2">{vehicle.driverName}</td>
                  <td className="border p-2">{vehicle.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No vehicles tagged</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'serviced',
    header: 'Serviced',
    cell: ({ row }) => <div className="flex justify-center">{row.original.serviced}</div>,
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <CellAction data={row.original} /> // Ensure CellAction handles Route
  }
];
