'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

interface GeneralSettingsForm {
  editBagTime: string;
  editDayValue: number;
}

export const PermissionForm: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<GeneralSettingsForm>({
    defaultValues: {
      editBagTime: '',
      editDayValue: 0,
    },
  });

  const onSubmit = (data: GeneralSettingsForm) => {
    console.log(data);
    // Here you would typically make an API call to save the data
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title="Permissions Settings"
          description="Manage Permissions Settings"
        />
      </div>
      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        

      

      
      </form>
    </>
  );
};

export default PermissionForm;
