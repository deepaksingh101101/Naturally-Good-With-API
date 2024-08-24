'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { City } from '@/constants/city';
import { Edit, Trash, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: City;
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

  const editCity = () => {
    router.push(`/city-management/editCity/${data.id}`);
  };

  const viewCityDetails = () => {
    router.push(`/city-management/viewCityDetails/${data.id}`);
  };

  const deleteCity = () => {
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
          color="green"
          onClick={editCity}
          className="text-white bg-green-500 hover:bg-green-600 hover:text-white"
        >
          <Edit className=" h-4 w-4" /> 
        </Button>
        <Button 
          variant="outline" 
          color="red"
          onClick={deleteCity}
          className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
        >
          <Trash className=" h-4 w-4" /> 
        </Button>
      </div>
    </>
  );
};
