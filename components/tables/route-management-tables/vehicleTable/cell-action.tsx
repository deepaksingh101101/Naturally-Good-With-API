'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/constants/vehicle'; // Change this import to use Vehicle instead of City
import { Edit, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: Vehicle; // Update data type to Vehicle
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    // Your confirm logic here
    setLoading(true);
    // Simulate deletion process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setOpen(false);
    // Perform deletion action here
  };

  const editVehicle = () => {
    router.push(`/vehicle-management/editVehicle/${data.id}`); // Update path to vehicle-management
  };

  const deleteVehicle = () => {
    setOpen(true);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <div className="flex justify-center gap-2">
        <Button 
          variant="outline" 
          onClick={editVehicle}
          className="text-white bg-green-500 hover:bg-green-600 hover:text-white"
        >
          <Edit className="h-4 w-4" /> 
        </Button>
        <Button 
          variant="outline" 
          onClick={deleteVehicle}
          className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
        >
          <Trash className="h-4 w-4" /> 
        </Button>
      </div>
    </>
  );
};
