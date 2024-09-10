'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ProductManagement } from '@/constants/product-management-data';
import { Edit, MoreHorizontal, Trash, Eye, UserPlus, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    // Your confirm logic here
  };

  // const handleRegisterNewSubscription = () => {
  //   router.push('/product-management/register'); 
  // };

  const handleEditProduct = () => {
    router.push(`/product/edit/${data._id}`); 
  };

  const viewProduct = () => {
    router.push(`/product/view/${data._id}`); 
  };

  const updateProductAvailability = () => {
    router.push(`/product-management/toggleDeliveryDays/${data}`); 
  };



  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* <DropdownMenuItem onClick={handleRegisterNewSubscription}>
            <UserPlus className="mr-2 h-4 w-4" /> Create New Subscription
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={handleEditProduct}>
            <Edit className="mr-2 h-4 w-4" /> Edit Product Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={viewProduct}>
            <Eye className="mr-2 h-4 w-4" /> View Product
          </DropdownMenuItem>
          <DropdownMenuItem onClick={updateProductAvailability}>
            <UserCheck className="mr-2 h-4 w-4" /> Update Product Availability
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
