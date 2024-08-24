'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { VehicleManagementClient } from '@/components/tables/route-management-tables/vehicleTable/client';
import { ZoneManagementClient } from '@/components/tables/route-management-tables/zoneTable/client';

// Define the interface for form data
export interface ZoneFormData {
  zoneName: string;
  serviced: { label: string; value: string } | null;
  deliverySequence: number;
  deliveryCost: number;
  locality: { name: string; id: string; pincode: string }[];
  city: { id: string; label: string; value: string } | null;
}

// Define the schema for form validation
const zoneFormSchema = z.object({
  zoneName: z.string().min(1, 'Zone Name is required'),
  serviced: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .nullable()
    .refine((data) => data !== null, { message: 'Serviced status is required' }),
  deliverySequence: z.number().positive().int().min(1, 'Delivery Sequence must be a positive integer'),
  deliveryCost: z.number().positive().min(0, 'Delivery Cost must be a positive number'),
  locality: z
    .array(
      z.object({
        name: z.string(),
        id: z.string(),
        pincode: z.string(),
      })
    )
    .min(1, 'At least one locality must be selected'),
  city: z
    .object({
      id: z.string(),
      label: z.string(),
      value: z.string(),
    })
    .nullable()
    .refine((data) => data !== null, { message: 'City is required' }),
});

// Sample options for select fields
const servicedOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const localityOptions = [
  { name: 'Locality 1', id: 'locality1', pincode: '123456' },
  { name: 'Locality 2', id: 'locality2', pincode: '654321' },
  { name: 'Locality 3', id: 'locality3', pincode: '789012' },
];

const cityOptions = [
  { id: 'city1', label: 'City 1', value: 'city1' },
  { id: 'city2', label: 'City 2', value: 'city2' },
  { id: 'city3', label: 'City 3', value: 'city3' },
];

export const ZoneForm: React.FC<{ initialData?: ZoneFormData }> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<ZoneFormData>({
    resolver: zodResolver(zoneFormSchema),
    defaultValues: initialData || {
      zoneName: '',
      serviced: null,
      deliverySequence: 1,
      deliveryCost: 0,
      locality: [],
      city: null,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<ZoneFormData> = async (data) => {
    try {
      setLoading(true);
      if (initialData) {
        // Update existing zone logic here
        console.log('Updating zone:', data);
      } else {
        // Create new zone logic here
        console.log('Creating new zone:', data);
      }
      // Add success notification or redirect as needed
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle error (e.g., show notification)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Heading title={initialData ? 'Edit Zone' : 'Create Zone'} description="Fill in the details below" />
      <Separator />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Zone Name Field */}
             {/* City Field */}
             <FormField
              control={control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Select
                      isDisabled={loading}
                      options={cityOptions}
                      placeholder="Select City"
                      value={field.value ? {
                        label: field.value.label,
                        value: field.value.value,
                        id: field.value.id,
                      } : null}
                      onChange={(selected) => {
                        field.onChange(selected ? {
                          id: selected.id,
                          label: selected.label,
                          value: selected.value,
                        } : null);
                      }}
                    />
                  </FormControl>
                  <FormMessage>{errors.city?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="zoneName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Zone Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.zoneName?.message}</FormMessage>
                </FormItem>
              )}
            />

           

            {/* Serviced Field */}
            <FormField
              control={control}
              name="serviced"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviced</FormLabel>
                  <FormControl>
                    <Select
                      isDisabled={loading}
                      options={servicedOptions}
                      placeholder="Select Serviced Status"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage>{errors.serviced?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Delivery Sequence Field */}
            <FormField
              control={control}
              name="deliverySequence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Sequence</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Enter Delivery Sequence"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.deliverySequence?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Delivery Cost Field */}
            <FormField
              control={control}
              name="deliveryCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Enter Delivery Cost"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.deliveryCost?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

        {/* Locality Field */}
          {/* <FormField
            control={control}
            name="locality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Locality</FormLabel>
                <FormControl>
                  <Select
                    isMulti
                    isDisabled={loading}
                    options={localityOptions.map(option => ({
                      label: (
                        <div className='flex justify-between'>
                          {option.name} <span style={{ color: 'green' }}>(Pincode: {option.pincode})</span>
                        </div>
                      ),
                      value: option.id,
                    }))}
                    placeholder="Select Localities"
                    value={field.value.map(option => ({
                      label: (
                        <div>
                          {option.name} <span style={{ color: 'green' }}>(Pincode: {option.pincode})</span>
                        </div>
                      ),
                      value: option.id,
                    }))}
                    onChange={(selected) => {
                      field.onChange(selected.map(opt => ({
                        name: localityOptions.find(loc => loc.id === opt.value)?.name || '',
                        id: opt.value,
                        pincode: localityOptions.find(loc => loc.id === opt.value)?.pincode || '',
                      })));
                    }}
                    formatOptionLabel={({ label }) => <div>{label}</div>}
                  />
                </FormControl>
                <FormMessage>{errors.locality?.message}</FormMessage>
              </FormItem>
            )}
          /> */}

          <Button type="submit" disabled={loading}>
            {initialData ? 'Save Changes' : 'Create Zone'}
          </Button>
        </form>
      </Form>


      {/* Starting Table */}
      <ZoneManagementClient  />

    </div>
  );
};
