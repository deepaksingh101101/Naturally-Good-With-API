'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { Locality } from '@/constants/locality';
import { Edit, Eye, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: Locality; // Update data type to Locality
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
    // For example, make an API call to delete the locality
    // await fetch(`/api/localities/${data.id}`, { method: 'DELETE' });
  };

  const editLocality = () => {
    router.push(`/locality-management/editLocality/${data.id}`); // Update path to locality-management with ID
  };
  
  const viewLocality = () => {
    router.push(`/locality-management/viewLocality/${data.id}`); // Update path to locality-management with ID
  };

  const deleteLocality = () => {
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
          onClick={editLocality}
          className="text-white bg-green-500 hover:bg-green-600 hover:text-white"
        >
          <Edit className="h-4 w-4" /> 
        </Button>
        <Button 
          variant="outline" 
          onClick={deleteLocality}
          className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
        >
          <Trash className="h-4 w-4" /> 
        </Button>
      </div>
    </>
  );
};
