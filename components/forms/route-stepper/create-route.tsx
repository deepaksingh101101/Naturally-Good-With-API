'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

// Define the interface for form data
export interface RouteFormData {
  status: { label: string; value: string } | null;
  routeName: string;
  day: { label: string; value: string }[];
  vehicleTagged: { label: string; value: string }[];
  zoneName: { label: string; value: string }[];
  city: { id: string; label: string; value: string } | null;  // Update here
}


const routeFormSchema = z.object({
  status: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .nullable()
    .refine((data) => data !== null, { message: 'Status is required' }),
  routeName: z.string().min(1, 'Route Name is required'),
  day: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .min(1, 'At least one day must be selected'),
  vehicleTagged: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .min(1, 'At least one vehicle must be tagged'),
  zoneName: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .min(1, 'At least one zone must be selected'),
  city: z
    .object({
      id: z.string(),
      label: z.string(),
      value: z.string(),
    })
    .nullable()
    .refine((data) => data !== null, { message: 'City is required' }),  // Update here
});


// Sample options for the select fields
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const dayOptions = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
];

const vehicleOptions = [
  { label: 'Vehicle 1', value: 'vehicle1' },
  { label: 'Vehicle 2', value: 'vehicle2' },
  { label: 'Vehicle 3', value: 'vehicle3' },
];

const zoneOptions = [
  { label: 'Zone 1', value: 'zone1' },
  { label: 'Zone 2', value: 'zone2' },
  { label: 'Zone 3', value: 'zone3' },
];
const cityOptions = [
  { id: 'city1', label: 'City 1', value: 'city1' },
{ id: 'city2', label: 'City 2', value: 'city2' },
  { id: 'city3', label: 'City 3', value: 'city3' },
];


export const RouteForm: React.FC<{ initialData?: RouteFormData }> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<RouteFormData>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: initialData || {
      status: null,
      routeName: '',
      day: [],
      vehicleTagged: [],
      zoneName: [],
      city: null,  // Add this line
    },
  });
  

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<RouteFormData> = async (data) => {
    try {
      setLoading(true);
      if (initialData) {
        // Update existing route logic here
        console.log('Updating route:', data);
      } else {
        // Create new route logic here
        console.log('Creating new route:', data);
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
      <Heading title={initialData ? 'Edit Route' : 'Create Route'} description="Fill in the details below" />
      <Separator />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <FormField
              control={control}
              name="routeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Route Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.routeName?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
  control={control}
  name="city"
  render={({ field }) => (
    <FormItem>
      <FormLabel>City</FormLabel>
      <FormControl>
        <Select
          isDisabled={loading}
          options={cityOptions.map(option => ({
            label: option.label,
            value: option.value,
            id: option.id, // Include id in options
          }))}
          placeholder="Select City"
          value={field.value ? {
            label: field.value.label,
            value: field.value.value,
            id: field.value.id, // Include id in value
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

            {/* Status Field */}
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      isDisabled={loading}
                      options={statusOptions}
                      placeholder="Select Status"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage>{errors.status?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Route Name Field */}
           

            {/* Day Field */}
            <FormField
              control={control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <FormControl>
                    <Select
                      isMulti
                      isDisabled={loading}
                      options={dayOptions}
                      placeholder="Select Days"
                      value={field.value}
                      onChange={(selected) => field.onChange(selected)}
                    />
                  </FormControl>
                  <FormMessage>{errors.day?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Vehicle Tagged Field */}
            <FormField
              control={control}
              name="vehicleTagged"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Tagged</FormLabel>
                  <FormControl>
                    <Select
                      isMulti
                      isDisabled={loading}
                      options={vehicleOptions}
                      placeholder="Select Vehicles"
                      value={field.value}
                      onChange={(selected) => field.onChange(selected)}
                    />
                  </FormControl>
                  <FormMessage>{errors.vehicleTagged?.message}</FormMessage>
                </FormItem>
              )}
            />

          
          </div>
            {/* Zone Name Field */}
            <FormField
              control={control}
              name="zoneName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone Name</FormLabel>
                  <FormControl>
                    <Select
                      isMulti
                      isDisabled={loading}
                      options={zoneOptions}
                      placeholder="Select Zones"
                      value={field.value}
                      onChange={(selected) => field.onChange(selected)}
                    />
                  </FormControl>
                  <FormMessage>{errors.zoneName?.message}</FormMessage>
                </FormItem>
              )}
            />
          <Button type="submit" disabled={loading}>
            {initialData ? 'Save Changes' : 'Create Route'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
