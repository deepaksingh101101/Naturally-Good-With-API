'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { Zone } from '@/constants/zones';
import { Edit, Eye, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: Zone; // Update data type to Zone
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
    // For example, make an API call to delete the zone
    // await fetch(`/api/zones/${data.id}`, { method: 'DELETE' });
  };

  const editZone = () => {
    router.push(`/zone-management/editZone/${data.id}`); // Update path to zone-management
  };

  const deleteZone = () => {
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
          onClick={editZone}
          className="text-white bg-blue-500 hover:bg-blue-600 hover:text-white"
        >
          <Eye className="h-4 w-4" /> 
        </Button>
        <Button 
          variant="outline" 
          onClick={editZone}
          className="text-white bg-green-500 hover:bg-green-600 hover:text-white"
        >
          <Edit className="h-4 w-4" /> 
        </Button>
        <Button 
          variant="outline" 
          onClick={deleteZone}
          className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
        >
          <Trash className="h-4 w-4" /> 
        </Button>
      </div>
    </>
  );
};
