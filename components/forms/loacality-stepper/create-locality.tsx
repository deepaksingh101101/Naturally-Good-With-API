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
import ReactSelect from 'react-select';

export interface LocalityFormData {
  sectorLocality: string;
  pin: string;
  sortOrder: number;
  serviced: string;
  city: { id: string; label: string; value: string; zones: { zoneName: string; zoneId: string }[] } | null;
  zone: { zoneName: string; zoneId: string } | null;
}

const localityFormSchema = z.object({
  sectorLocality: z.string().min(1, 'Sector/Locality is required'),
  pin: z.string().min(1, 'Pin is required').length(6, 'Pin must be 6 digits'),
  sortOrder: z.number().nonnegative().int().min(1, 'Sort Order must be a positive integer'),
  serviced: z.string().min(1, 'Please select if serviced'),
  city: z.object({
    id: z.string(),
    label: z.string(),
    value: z.string(),
    zones: z.array(z.object({
      zoneName: z.string(),
      zoneId: z.string(),
    })),
  }).nullable().refine((data) => data !== null, { message: 'City is required' }),
  zone: z.object({
    zoneName: z.string(),
    zoneId: z.string(),
  }).nullable().refine((data) => data !== null, { message: 'Zone is required' }),
});

const cityOptions = [
  {
    id: 'city1',
    label: 'City 1',
    value: 'city1',
    zones: [
      { zoneName: 'Zone 1-1', zoneId: 'zone1-1' },
      { zoneName: 'Zone 1-2', zoneId: 'zone1-2' },
    ],
  },
  {
    id: 'city2',
    label: 'City 2',
    value: 'city2',
    zones: [
      { zoneName: 'Zone 2-1', zoneId: 'zone2-1' },
      { zoneName: 'Zone 2-2', zoneId: 'zone2-2' },
    ],
  },
];

export const LocalityForm: React.FC<{ initialData?: LocalityFormData }> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(cityOptions.find(city => city.id === initialData?.city?.id) || null);
  
  const form = useForm<LocalityFormData>({
    resolver: zodResolver(localityFormSchema),
    defaultValues: initialData || {
      sectorLocality: '',
      pin: '',
      sortOrder: 1,
      serviced: 'yes',
      city: null,
      zone: null,
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
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={(value) => {
                        const selectedCity = cityOptions.find(option => option.value === value);
                        setSelectedCity(selectedCity || null);
                        field.onChange(selectedCity || null);
                      }}
                      defaultValue={field.value?.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cityOptions.map((option) => (
                          <SelectItem key={option.id} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.city?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone</FormLabel>
                  <FormControl>
                    <ReactSelect
                      isDisabled={loading || !selectedCity}
                      options={selectedCity?.zones.map(zone => ({ label: zone.zoneName, value: zone.zoneId }))}
                      onChange={(selectedOption) => field.onChange(selectedOption ? { zoneName: selectedOption.label, zoneId: selectedOption.value } : null)}
                      value={field.value ? { label: field.value.zoneName, value: field.value.zoneId } : null}
                      placeholder="Select Zone"
                      isSearchable
                    />
                  </FormControl>
                  <FormMessage>{errors.zone?.message}</FormMessage>
                </FormItem>
              )}
            />
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
