'use client';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export interface VehicleFormData {
  vehicle: string;
  classification: string;
  sortOrder: number;
  vehicleNumber: string;
  driverName: string;
  driverNumber: string;
  vehicleModel: string;
}

const vehicleFormSchema = z.object({
  vehicle: z.string().min(1, 'Vehicle name is required'),
  classification: z.string().min(1, 'Classification is required'),
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  driverName: z.string().min(1, 'Driver name is required'),
  driverNumber: z.string().min(1, 'Driver number is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
});

export const VehicleForm: React.FC<{ initialData?: VehicleFormData }> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: initialData || {
      vehicle: '',
      classification: '',
      sortOrder: 1,
      vehicleNumber: '',
      driverName: '',
      driverNumber: '',
      vehicleModel: '',
    },
  });

  const { control, handleSubmit, formState: { errors } } = form;

  const onSubmit: SubmitHandler<VehicleFormData> = async (data) => {
    try {
      setLoading(true);
      if (initialData) {
        // Update existing vehicle
      } else {
        // Create new vehicle
      }
      // Refresh or redirect after submission
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Heading title={initialData ? 'Edit Vehicle' : 'Create Vehicle'} description="Fill in the details below" />
      <Separator />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <FormField
              control={control}
              name="vehicle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Enter Vehicle Name"
                    />
                  </FormControl>
                  <FormMessage>{errors.vehicle?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="classification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classification</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Enter Classification"
                    />
                  </FormControl>
                  <FormMessage>{errors.classification?.message}</FormMessage>
                </FormItem>
              )}
            />
         
            <FormField
              control={control}
              name="vehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Enter Vehicle Number"
                    />
                  </FormControl>
                  <FormMessage>{errors.vehicleNumber?.message}</FormMessage>
                </FormItem>
              )}
            />
              <FormField
              control={control}
              name="vehicleModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Model</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Enter Vehicle Model"
                    />
                  </FormControl>
                  <FormMessage>{errors.vehicleModel?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Enter Driver Name"
                    />
                  </FormControl>
                  <FormMessage>{errors.driverName?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="driverNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Enter Driver Number"
                    />
                  </FormControl>
                  <FormMessage>{errors.driverNumber?.message}</FormMessage>
                </FormItem>
              )}
            />
          
          </div>
          <Button type="submit" disabled={loading}>
            {initialData ? 'Save Changes' : 'Create Vehicle'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
