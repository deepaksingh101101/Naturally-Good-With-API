'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { LocalityManagementClient } from '@/components/tables/route-management-tables/localityTable/client';
import { RouteManagementClient } from '@/components/tables/route-management-tables/routeTable/client';

// Define the interface for form data
export interface RouteFormData {
  status: { label: string; value: string } | null;
  routeName: string;
  day: { label: string; value: string }[];
  vehicleTagged: { label: string; value: string }[];
  zoneName: { label: string; value: string }[];
  city: { id: string; label: string; value: string; zones: { label: string; value: string }[] } | null;
}

// Define schema for form validation
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
      zones: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      ),
    })
    .nullable()
    .refine((data) => data !== null, { message: 'City is required' }),
});

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

const cityOptions = [
  { id: 'city1', label: 'City 1', value: 'city1', zones: [
      { label: 'Zone 1A', value: 'zone1a' },
      { label: 'Zone 1B', value: 'zone1b' },
    ]
  },
  { id: 'city2', label: 'City 2', value: 'city2', zones: [
      { label: 'Zone 2A', value: 'zone2a' },
      { label: 'Zone 2B', value: 'zone2b' },
    ]
  },
  { id: 'city3', label: 'City 3', value: 'city3', zones: [
      { label: 'Zone 3A', value: 'zone3a' },
      { label: 'Zone 3B', value: 'zone3b' },
    ]
  },
];

export const RouteForm: React.FC<{ initialData?: RouteFormData }> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [zoneOptions, setZoneOptions] = useState<{ label: string; value: string }[]>([]);

  const form = useForm<RouteFormData>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: initialData || {
      status: null,
      routeName: '',
      day: [],
      vehicleTagged: [],
      zoneName: [],
      city: null,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  // Watch for changes in city selection
  const selectedCity = watch('city');

  useEffect(() => {
    if (selectedCity) {
      const city = cityOptions.find(option => option.value === selectedCity.value);
      setZoneOptions(city ? city.zones : []);
    } else {
      setZoneOptions([]);
    }
  }, [selectedCity]);

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
                        id: option.id,
                      }))}
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
                          zones: cityOptions.find(city => city.value === selected.value)?.zones || [],
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
          <Button type="submit" disabled={loading} className="mt-4">
            {initialData ? 'Update Route' : 'Create Route'}
          </Button>
        </form>
      </Form>

      <RouteManagementClient  />

    </div>
  );
};
