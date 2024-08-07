'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import ReactSelect from 'react-select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns';

interface CouponFormProps {
  initialData: any | null;
}

const couponFormSchema = z.object({
  code: z.string().min(1, 'Coupon Code is required'),
  discountPrice: z.number().positive('Discount Price must be greater than zero'),
  visibility: z.enum(['global', 'subscription']),
  cvisibility: z.enum(['Admin', 'Public']),
  subscriptionType: z.object({
    id: z.string(),
    name: z.string()
  }).optional(),
  subscriptionPrice: z.number().optional(),
  netPrice: z.number().optional(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  description: z.string().min(1, 'Description is required'),
  image: z.instanceof(File).nullable()
});

const subscriptionTypes = [
  { id: '1', name: 'Staples', subscriptionPrice: 1000 },
  { id: '2', name: 'Monthly Mini Veggies', subscriptionPrice: 1200 }
];

export const CreateCoupons: React.FC<CouponFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit Coupon' : 'Create New Coupon';
  const description = initialData ? 'Edit the Coupon details.' : 'To create a new Coupon, fill in the required information.';
  const toastMessage = initialData ? 'Coupon updated.' : 'Coupon created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm({
    resolver: zodResolver(couponFormSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
      discountPrice: 0,
      visibility: 'global',
      cvisibility: 'Admin',
      subscriptionType: undefined,
      subscriptionPrice: 0,
      netPrice: 0,
      startDate: null,
      endDate: null,
      description: '',
      image: null
    }
  });

  const { control, handleSubmit, setValue, watch, formState: { errors } } = form;

  const selectedVisibility = watch('visibility');
  const selectedSubscriptionType = watch('subscriptionType');
  const discountPrice = watch('discountPrice');

  useEffect(() => {
    if (selectedSubscriptionType) {
      const subscription = subscriptionTypes.find(sub => sub.id === selectedSubscriptionType.id);
      if (subscription) {
        setValue('subscriptionPrice', subscription.subscriptionPrice);
        const netPrice = subscription.subscriptionPrice - discountPrice;
        setValue('netPrice', netPrice > 0 ? netPrice : 0);
      }
    } else {
      setValue('subscriptionPrice', 0);
      setValue('netPrice', 0);
    }
  }, [selectedSubscriptionType, discountPrice, setValue]);

  const onSubmit: SubmitHandler<typeof couponFormSchema._type> = async (data) => {
    try {
      setLoading(true);
      if (initialData) {
        // await axios.post(`/api/coupons/edit-coupon/${initialData._id}`, data);
      } else {
        // await axios.post(`/api/coupons/create-coupon`, data);
      }
      // router.refresh();
      // router.push(`/dashboard/coupons`);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // await axios.delete(`/api/coupons/${params.couponId}`);
      // router.refresh();
      // router.push(`/dashboard/coupons`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="w-full gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Visibility</FormLabel>
                  <FormControl>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.visibility?.message}</FormMessage>
                </FormItem>
              )}
            />

            {selectedVisibility === 'subscription' && (
              <>
                <FormField
                  control={form.control}
                  name="subscriptionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription Type</FormLabel>
                      <FormControl>
                        <Controller
                          control={form.control}
                          name="subscriptionType"
                          render={({ field: { onChange, value } }) => (
                            <ReactSelect
                              isClearable
                              isSearchable
                              options={subscriptionTypes}
                              getOptionLabel={(option) => option.name}
                              getOptionValue={(option) => option.id}
                              onChange={(selected) => onChange(selected ? { id: selected.id, name: selected.name } : undefined)}
                              value={subscriptionTypes.find(option => option.id === value?.id)}
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage>{errors.subscriptionType?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  name="subscriptionPrice"
                  render={() => (
                    <FormItem>
                      <FormLabel>Subscription Price</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={watch('subscriptionPrice')}
                          readOnly
                          disabled
                          placeholder="Subscription Price"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="netPrice"
                  render={() => (
                    <FormItem>
                      <FormLabel>Net Price</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={watch('netPrice')}
                          readOnly
                          disabled
                          placeholder="Net Price"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Coupon Code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.code?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Discount Price"
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage>{errors.discountPrice?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-[240px] pl-3 text-left font-normal ${!field.value && 'text-muted-foreground'}`}
                        >
                          {field.value ? format(field.value, 'dd MMM yyyy') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        // disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage>{errors.startDate?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-[240px] pl-3 text-left font-normal ${!field.value && 'text-muted-foreground'}`}
                        >
                          {field.value ? format(field.value, 'dd MMM yyyy') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        // disabled={(date) => date > new Date() || date > new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage>{errors.endDate?.message}</FormMessage>
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="cvisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupons Visibility</FormLabel>
                  <FormControl>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin Only</SelectItem>
                        <SelectItem value="Public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.cvisibility?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      disabled={form.formState.isSubmitting}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          field.onChange(e.target.files[0]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage>{errors.image?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {action}
            </Button>
          </div>
        </form>
      </Form>
      {initialData && (
        <div className="mt-8 pt-5 border-t border-gray-200">
          <div className="flex justify-between">
            <Heading
              title="Delete Coupon"
              description="This action cannot be undone."
            />
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={loading}
            >
              Delete Coupon
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
