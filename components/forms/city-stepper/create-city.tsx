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

export interface CityFormData {
  cityName: string;
  pin: string;
  sortOrder: number;
  serviced: string;
}

const cityFormSchema = z.object({
  cityName: z.string().min(1, 'City name is required'),
  pin: z.string().min(1, 'Pin is required').length(6, 'Pin must be 6 digits'),
  sortOrder: z.number().nonnegative().int().min(1, 'Sort Order must be a positive integer'),
  serviced: z.string().min(1, 'Please select if serviced'),
});

export const CityForm: React.FC<{ initialData?: CityFormData }> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<CityFormData>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: initialData || {
      cityName: '',
      sortOrder: 1,
      serviced: 'yes',
    },
  });

  const { control, handleSubmit, formState: { errors } } = form;

  const onSubmit: SubmitHandler<CityFormData> = async (data) => {
    try {
      setLoading(true);
      if (initialData) {
        // Update existing city
      } else {
        // Create new city
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
      <Heading title={initialData ? 'Edit City' : 'Create City'} description="Fill in the details below" />
      <Separator />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <FormField
              control={control}
              name="cityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Enter City Name"
                    />
                  </FormControl>
                  <FormMessage>{errors.cityName?.message}</FormMessage>
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
            {initialData ? 'Save Changes' : 'Create City'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
