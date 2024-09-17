'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format, addDays } from 'date-fns';
import { Calendar } from 'lucide-react';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'week',
    header: 'Week',
    cell: ({ row }) => <span>{row.original.week}</span>, // Displays Week
  },
  {
    accessorKey: 'startDate',
    header: 'Week Start Date',
    cell: ({ row }) => <span className='flex justify-start items-center' ><Calendar height={14} width={14} className='text-blue-600 me-2' /><span>{row.original.startDate}</span></span>, // Displays Start Date
  },
  {
    accessorKey: 'endDate',
    header: 'Week End Date',
    cell: ({ row }) => <span className='flex justify-start items-center' ><Calendar height={14} width={14} className='text-red-600 me-2' /><span>{row.original.endDate}</span></span>, // Displays End Date
  },
  {
    accessorKey: 'totalSubscription',
    header: 'Subscriptions',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <span>{row.original.totalSubscription}</span>
      </div>
    ),
  }
,  
  {
    accessorKey: 'totalRenewalDue',
    header: 'Renewal Due',
    cell: ({ row }) => 
      <div className="flex  items-center justify-center">

    <span className='bg-red-400 rounded-lg text-white px-3' >{row.original.totalRenewalDue}</span>
    </div>
  },
  {
    accessorKey: 'renewed',
    header: 'Renewed',
    cell: ({ row }) => 
      <div className="flex items-center justify-center">

    <span className='bg-green-500 rounded-lg text-white px-3 '>{row.original.renewed}</span> </div>
  },
  {
    accessorKey: 'drop',
    header: 'Drop',
    cell: ({ row }) =>
      <div className="flex items-center justify-center">
 <span className='bg-red-500 rounded-lg text-white px-3 '>{row.original.drop}</span>    </div>

  },
  {
    accessorKey: 'carryForward',
    header: 'Carry Forward',
    cell: ({ row }) =>
      <div className="flex items-center justify-center">

      <span className='bg-yellow-500 rounded-lg text-white px-3 '>{row.original.carryForward}</span>
      </div>
  },
  {
    accessorKey: 'cumulativeDrop',
    header: 'Cumulative Drop',
    cell: ({ row }) =>
      <div className="flex items-center justify-center">
 <span>{row.original.cumulativeDrop}</span>      </div>

  },
  {
    accessorKey: 'activeSubscriber',
    header: 'Active Subscribers',
    cell: ({ row }) =>
      <div className="flex items-center justify-center">
 <span>{row.original.activeSubscriber}</span>   </div>
  },
  {
    accessorKey: 'inactiveSubscriber',
    header: 'Inactive Subscribers',
    cell: ({ row }) =>
      <div className="flex items-center justify-center">

      <span>{row.original.inactiveSubscriber}</span></div>
  },
];
