'use client';

import { ProductReportManagement, ProductReportManagementData } from '@/constants/sku-report-data';
import { ColumnDef } from '@tanstack/react-table';
import { CalendarCheck } from 'lucide-react';

// Define the row type based on ProductReportManagement
type ProductReportManagementRow = ProductReportManagement;

// Define static columns
const staticColumns: ColumnDef<ProductReportManagementRow>[] = [
  {
    accessorKey: 'sno',
    header: 'S.No',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <span>{row.original.sno}</span>
      </div>
    ),
  },
  {
    accessorKey: 'productCode',
    header: 'Product Code',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <span>{row.original.productCode}</span>
      </div>
    ),
  },
  {
    accessorKey: 'productType',
    header: 'Product Type',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <span>{row.original.productType}</span>
      </div>
    ),
  },
  {
    accessorKey: 'productGroup',
    header: 'Product Group',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <span>{row.original.productGroup}</span>
      </div>
    ),
  },
  {
    accessorKey: 'season',
    header: 'Season',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <span>{row.original.season}</span>
      </div>
    ),
  },
  {
    accessorKey: 'productName',
    header: 'Product Name',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <span>{row.original.productName}</span>
      </div>
    ),
  },
  {
    accessorKey: 'unitQuantity',
    header: 'Unit Quantity',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <span>{row.original.unitQuantity}</span>
      </div>
    ),
  },
  {
    accessorKey: 'totalQuantity',
    header: 'Total Quantity',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <span>{row.original.totalQuantity}</span>
      </div>
    ),
  },
  {
    accessorKey: 'units',
    header: 'Units',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <span>{row.original.units}</span>
      </div>
    ),
  },
];

// Extract unique dates from the sales data
const extractUniqueDates = (data: ProductReportManagement[]) => {
  const dates = new Set<string>();
  data.forEach(record => {
    record.salesData.forEach(sale => {
      dates.add(sale.date);
    });
  });
  return Array.from(dates).sort(); // Sort the dates if needed
};

// Generate columns for sales data
const generateSalesDataColumns = (uniqueDates: string[]) => {
  return uniqueDates.map((date, index) => ({
    accessorKey: `salesData_${index}`,
    header: date,
    cell: ({ row }: { row: { original: ProductReportManagement } }) => {
      const sale = row.original.salesData.find(s => s.date === date);
      return (
        <div className="flex items-center justify-center">
          <span>{sale ? sale.quantitySold : '-'}</span>
        </div>
      );
    },
  }));
};

// Get unique dates from the actual data
const uniqueDates = extractUniqueDates(ProductReportManagementData);

// Combine static columns with dynamically generated sales data columns
export const columns: ColumnDef<ProductReportManagementRow>[] = [
  ...staticColumns,
  ...generateSalesDataColumns(uniqueDates),
];
