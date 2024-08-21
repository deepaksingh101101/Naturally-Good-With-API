'use client';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export interface VehicleFormData {
  vehicle: string;
  classification: string;
  sortOrder: number;
}

const vehicleFormSchema = z.object({
  vehicle: z.string().min(1, 'Vehicle name is required'),
  classification: z.string().min(1, 'Classification is required'),
  sortOrder: z.number().nonnegative().int().min(1, 'Sort Order must be a positive integer'),
});

export const VehicleForm: React.FC<{ initialData?: VehicleFormData }> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: initialData || {
      vehicle: '',
      classification: '',
      sortOrder: 1,
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
              control={form.control}
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
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Enter Sort Order"
                    />
                  </FormControl>
                  <FormMessage>{errors.sortOrder?.message}</FormMessage>
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
