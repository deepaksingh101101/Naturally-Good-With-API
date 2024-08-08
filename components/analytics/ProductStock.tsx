'use client';

import React, { ReactNode, MouseEventHandler } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { FaFileExport } from 'react-icons/fa';

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => (
  <button onClick={onClick} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300">
    {children}
  </button>
);

export const ProductStock: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-300">
      <div className="flex items-start justify-between p-6">
        <Heading
          title="Product Stock"
          description="Detailed product stock report"
        />
        <div className="flex space-x-2">
          <Button onClick={() => { /* handle export logic */ }}>
            <FaFileExport />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="mt-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <select id="entriesPerPage" className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1">
              <option value="10">10</option>
              <option value="20">20</option>
              {/* Add more options if needed */}
            </select>
            <label htmlFor="entriesPerPage" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-400">
              entries per page
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2">DATE</th>
                <th className="px-4 py-2">PRODUCT NAME</th>
                <th className="px-4 py-2">QUANTITY</th>
                <th className="px-4 py-2">TYPE</th>
                <th className="px-4 py-2">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="text-center py-4">No entries found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
