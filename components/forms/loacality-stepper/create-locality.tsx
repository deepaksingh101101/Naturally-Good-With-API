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

export interface LocalityFormData {
  sectorLocality: string;
  pin: string;
  sortOrder: number;
  serviced: string;
}

const localityFormSchema = z.object({
  sectorLocality: z.string().min(1, 'Sector/Locality is required'),
  pin: z.string().min(1, 'Pin is required').length(6, 'Pin must be 6 digits'),
  sortOrder: z.number().nonnegative().int().min(1, 'Sort Order must be a positive integer'),
  serviced: z.string().min(1,'Please select if serviced'),
});

export const LocalityForm: React.FC<{ initialData?: LocalityFormData }> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<LocalityFormData>({
    resolver: zodResolver(localityFormSchema),
    defaultValues: initialData || {
      sectorLocality: '',
      pin: '',
      sortOrder: 1,
      serviced: 'yes',
    },
  });

  const { control, handleSubmit, formState: { errors } } = form;

  const onSubmit: SubmitHandler<LocalityFormData> = async (data) => {
    try {
      setLoading(true);
      if (initialData) {
        // Update existing locality
      } else {
        // Create new locality
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
      <Heading title={initialData ? 'Edit Locality' : 'Create Locality'} description="Fill in the details below" />
      <Separator />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <FormField
              control={control}
              name="sectorLocality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector/Locality</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Enter Sector/Locality"
                    />
                  </FormControl>
                  <FormMessage>{errors.sectorLocality?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pin</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Enter Pin"
                    />
                  </FormControl>
                  <FormMessage>{errors.pin?.message}</FormMessage>
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
            <FormField
              control={control}
              name="serviced"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviced</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.serviced?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {initialData ? 'Save Changes' : 'Create Locality'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
