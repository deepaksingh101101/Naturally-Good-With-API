'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash, CalendarIcon, Edit } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { cn, debounce } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import ReactSelect from 'react-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, isBefore, addDays, getDay } from 'date-fns';
import apiCall from '@/lib/axios';

interface Coupon {
  id: string;
  code: string;
  discountPrice: number;
}


interface OrderManagementFormType {
  initialData: any | null;
}

const orderFormSchema = z.object({
  CustomerName: z.string().min(1, 'Customer Name is required'),
  employeeName: z.string().min(1, 'Employee Name is required'),
  SubscriptionType: z.string().min(1, 'Subscription Type is required'),
  subscriptionPrice: z.number().positive('Subscription Price must be greater than zero'),
  coupon: z.object({
    id: z.string(),
    code: z.string(),
    discountPrice: z.number()
  }).optional(),
  manualDiscount: z.number().min(0, 'Manual Discount cannot be negative').default(0),
  amountReceived: z.number().min(0, 'Amount Received cannot be negative').default(0),
  amountDue: z.number().min(0, 'Amount Due cannot be negative').default(0),
  manualDiscountPercentage: z.number().default(0),
  netPrice: z.number().positive('Net Price must be greater than zero'),
  deliveryStartDate: z.date({
    required_error: "Delivery Date is required.",
  }),
  bookingDate: z.date({
    required_error: "Booking Date is required.",
  }),
  paymentDate: z.date({
    required_error: "Payment Date is required.",
  }),
  deliveryStatus: z.string(),
  bagOrdered: z.array(z.string()).min(1, 'Products Ordered is required'),
  totalWeight: z.number().positive('Total Weight must be greater than zero'),
  paymentStatus: z.string(),
  paymentType: z.string(),
  specialInstructions: z.string().optional(),
  orderStatus: z.string()  // New field for order status
});


const getDayIndex = (day: string): number => {
  switch(day) {
    case 'SUNDAY': return 0;
    case 'MONDAY': return 1;
    case 'TUESDAY': return 2;
    case 'WEDNESDAY': return 3;
    case 'THURSDAY': return 4;
    case 'FRIDAY': return 5;
    case 'SATURDAY': return 6;
    default: return -1;
  }
};

export const CreateOrder: React.FC<OrderManagementFormType> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualDiscountPercentage, setManualDiscountPercentage] = useState(0); // New state for manual discount percentage
  const title = initialData ? 'Edit Order' : 'Create New Order';
  const description = initialData ? 'Edit the Order details.' : 'To create a new Order, fill in the required information.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm({
    resolver: zodResolver(orderFormSchema),
    mode: 'onChange',
    defaultValues: {
      CustomerName: '',
      employeeName: '',
      SubscriptionType: '',
      subscriptionPrice: 0,
      coupon: undefined,
      manualDiscount: 0,
      manualDiscountPercentage: 0,
      netPrice: 0,
      deliveryStartDate: new Date(),
      bookingDate: new Date(),
      paymentDate: new Date(),
      deliveryStatus: 'Pending',
      bagOrdered: [] as string[],
      totalWeight: 0,
      amountReceived: 0,
      amountDue: 0,
      paymentStatus: 'Pending',
      paymentType: '',
      specialInstructions: '',
      orderStatus: 'Pending'  // New default value for order status
    }
  });

  const { control, trigger, watch, handleSubmit, setValue, formState: { errors } } = form;

  const selectedPaymentType=watch('paymentType');

  const onSubmit: SubmitHandler<typeof orderFormSchema._type> = async (data) => {
    try {
      setLoading(true);
      if (initialData) {
        // await axios.post(`/api/orders/edit-order/${initialData._id}`, data);
      } else {
        // const res = await axios.post(`/api/orders/create-order`, data);
        // console.log("order", res);
      }
      // router.refresh();
      // router.push(`/dashboard/orders`);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storemployeeName}/orders/${params.orderId}`);
      // router.refresh();
      // router.push(`/${params.storemployeeName}/orders`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

// Search use debouncing implementation
  const [fetchedUser, setFetchedUser] = useState<{ id: string; name: string,phone:string,email:string }[]>([]);
  const [searchUserTerm, setSearchUserTerm] = useState('');

  
  const fetchUser = useCallback(
    debounce(async (term: string) => {
      if (!term) {
        setFetchedUser([]);
        return;
      }

      try {
        const response = await apiCall('GET', `/admin/user/filter?term=${term}`);
        if (response.status) {
          setFetchedUser(response.data.users.map((user: any) => ({ name: user.FirstName + user.LastName, id: user._id,phone:user.PhoneNumber,email:user.Email  })))
        } else {
          console.error(response);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchUser(searchUserTerm);
  }, [searchUserTerm, fetchUser]);

// Search subscription debouncing implementation
const [fetchedSubscription, setFetchedSubscription] = useState<any[]>([]);
const [searchSubscriptionTerm, setSearchSubscriptionTerm] = useState('');


const fetchSubscription = useCallback(
  debounce(async (term: string) => {
    if (!term) {
      setFetchedSubscription([]);
      return;
    }

    try {
      const response = await apiCall('GET', `/subscription/search?term=${term}`);
      if (response.status) {
        console.log(response.data.subscriptions)
        setFetchedSubscription(response.data.subscriptions)
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  }, 500),
  []
);

useEffect(() => {
  fetchSubscription(searchSubscriptionTerm);
}, [searchSubscriptionTerm, fetchSubscription]);



  const selectedSubscriptionType = watch('SubscriptionType');
  const selectedCoupon = watch('coupon') as Coupon | undefined;
  const subscriptionPrice = watch('subscriptionPrice');
  const manualDiscount = watch('manualDiscount');
  const netPrice = watch('netPrice'); // Watch netPrice
  const amountReceived = watch('amountReceived'); // Watch netPrice
  const amountDue = watch('amountDue'); // Watch netPrice

  const isAllowedDeliveryDate = (date: Date, allowedDays: string[]) => {
    const today = new Date();
    if (isBefore(date, today)) {
      return false;
    }
    const dayIndex = getDay(date);
    return allowedDays.some(day => getDayIndex(day) === dayIndex);
  };

  const highlightDeliveryDate = (date: Date, allowedDays: string[]) => {
    const dayIndex = getDay(date);
    return allowedDays.some(day => getDayIndex(day) === dayIndex);
  };

  // useEffect(() => {
  //   const customer = customerOptions.find(option => option.name === selectedCustomer);
  //   if (customer) {
  //     setValue('employeeName', customer.assignedEmployee.name);
  //   } else {
  //     setValue('employeeName', '');
  //   }
  // }, [selectedCustomer, setValue]);

  useEffect(() => {
    const subscription = fetchedSubscription.find(option => option._id === selectedSubscriptionType);
    if (subscription) {
      setValue('subscriptionPrice', subscription?.OriginalPrice);
      setValue('coupon', undefined); // Reset coupon when subscription type changes
      setValue('manualDiscount', 0); // Reset manual discount when subscription type changes
      setValue('netPrice', subscription.NetPrice); // Reset net price
    } else {
      setValue('subscriptionPrice', 0);
      setValue('coupon', undefined);
      setValue('manualDiscount', 0);
      setValue('netPrice', 0);
    }
  }, [selectedSubscriptionType, setValue]);

  useEffect(() => {
    let netPrice = subscriptionPrice;
    if (selectedCoupon) {
      netPrice -= selectedCoupon.discountPrice;
    }
    if (manualDiscount) {
      netPrice -= manualDiscount;
    }
    setValue('netPrice', netPrice);
  }, [selectedCoupon, subscriptionPrice, manualDiscount, setValue,selectedPaymentType]);

  // Update manual discount percentage when net price or subscription price changes
  useEffect(() => {
    if (subscriptionPrice > 0) {
      const discountPercentage = ((subscriptionPrice - netPrice) / subscriptionPrice) * 100;
      setManualDiscountPercentage(discountPercentage);
    } else {
      setManualDiscountPercentage(0);
    }
  }, [netPrice, subscriptionPrice,selectedPaymentType]);

  interface DeliveryDay {
    day: string;
    _id: string;
  }
  const allowedDeliveryDays: string[] = fetchedSubscription
  .find(option => option._id === selectedSubscriptionType)
  ?.DeliveryDays.map((dayObj: DeliveryDay) => dayObj.day.toUpperCase()) || [];
  
  // const allowedDeliveryDays: string[] = ['MONDAY', 'TUESDAY']
  console.log(allowedDeliveryDays)
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
            <>
              <Controller
                control={form.control}
                name="CustomerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <ReactSelect
                        isClearable
                        isSearchable
                        options={fetchedUser}
                        onInputChange={(inputValue) => setSearchUserTerm(inputValue)}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        isDisabled={loading}
                        onChange={(selected) => field.onChange(selected ? selected.id : '')}
                        value={fetchedUser.find(option => option.id === field.value)}
                       
                      />
                    </FormControl>
                    <FormMessage>{errors.CustomerName?.message}</FormMessage>
                  </FormItem>
                )}
              />

<Controller
  control={form.control}
  name="SubscriptionType"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Subscription Type</FormLabel>
      <FormControl>
        <ReactSelect
          isClearable
          isSearchable
          options={fetchedSubscription}
          getOptionLabel={(option) => option.subscriptionType[0]?.Name + " "+option.frequencyType[0]?.Name +" "+option.TotalDeliveryNumber+" "+option.bag[0]?.BagName}  // Correct label for display
          getOptionValue={(option) => option._id}  // Correct value for form
          onInputChange={(inputValue) => setSearchSubscriptionTerm(inputValue)}
          isDisabled={loading}
          onChange={(selected) => field.onChange(selected ? selected._id : '')}
          value={fetchedSubscription.find(option => option._id === field.value)}
        />
      </FormControl>
      <FormMessage>{errors.SubscriptionType?.message}</FormMessage>
    </FormItem>
  )}
/>



              <FormField
                control={form.control}
                name="subscriptionPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Price</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Subscription Price"
                        value={field.value} // Corrected
                        onChange={field.onChange} // Corrected
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             

              <FormField
                control={form.control}
                name="netPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Net Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Net Price"
                        value={field.value || ''} // Corrected
                        onChange={(e) => {
                          const value = e.target.value ? parseFloat(e.target.value) : undefined;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage>{errors.netPrice?.message}</FormMessage>
                  </FormItem>
                )}
              />
 {/* <Controller
                control={form.control}
                name="coupon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon</FormLabel>
                    <FormControl>
                      <ReactSelect
                        isClearable
                        isSearchable
                        options={subscriptionTypes.find(option => option.name === selectedSubscriptionType)?.coupons || []}
                        getOptionLabel={(option) => option?.code || ''}
                        getOptionValue={(option) => option?.id || ''}
                        isDisabled={loading}
                        onChange={(selected) => field.onChange(selected || undefined)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="manualDiscountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manual Discount</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        value={manualDiscountPercentage.toFixed(2) + '%'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
           <FormField
  control={form.control}
  name="amountReceived"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Amount Received</FormLabel>
      <FormControl>
        <Input
          type="number"
          disabled={loading||selectedPaymentType==="Cod"}
          placeholder="Enter Amount Received"
          onChange={(e) => {
            const value = e.target.value;
            field.onChange(value === '' ? '' : Number(value));
          }}
          value={field.value === undefined ? '' :selectedPaymentType==="Cod"?0: field.value}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>



<FormField
  control={form.control}
  name="amountDue"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Amount Dues</FormLabel>
      <FormControl>
        <Input
          type="number"
          disabled
          placeholder="Enter Amount Dues"
          onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          value={
            field.value ||
            selectedPaymentType === "Cod"
              ? netPrice - (selectedCoupon?.discountPrice ?? 0)
              : netPrice - amountReceived
          }
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

              <FormField
                control={form.control}
                name="bookingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Booking Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd MMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0)) || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

<FormField
                control={form.control}
                name="deliveryStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Delivery Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd MMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            isBefore(date, new Date(new Date().setHours(0, 0, 0, 0)))
                          }
                          modifiers={{
                            highlight: (date) => highlightDeliveryDate(date, allowedDeliveryDays)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Payment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd MMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0)) || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select Payment Status"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Type</FormLabel>
                    <Controller
                      control={control}
                      name="paymentType"
                      render={({ field }) => (
                        <ReactSelect
                          isClearable
                          isSearchable
                          options={[
                            { id: 'Upi', name: 'UPI' },
                            { id: 'Netbanking', name: 'Net Banking' },
                            { id: 'Credit/Debit', name: 'Credit/Debit' },
                            { id: 'Cod', name: 'Cash On Delivery' }
                          ]}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          isDisabled={loading}
                          onChange={(selected) => field.onChange(selected ? selected.id : '')}
                          value={[
                            { id: 'Upi', name: 'UPI' },
                            { id: 'Netbanking', name: 'Net Banking' },
                            { id: 'Credit/Debit', name: 'Credit/Debit' },
                            { id: 'Cod', name: 'Cash On Delivery' }

                          ].find(option => option.id === field.value)}
                        />
                      )}
                    />
                    <FormMessage>{errors.paymentType?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="orderStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Status</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select Order Status"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </>
          </div>

          <FormField
            control={form.control}
            name="specialInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    rows={5}
                    placeholder="Enter Special Instructions"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
              title="Delete Order"
              description="This action cannot be undone."
            />
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={loading}
            >
              Delete Order
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
