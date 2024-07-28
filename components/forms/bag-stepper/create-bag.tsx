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
import { useState, useEffect } from 'react';
import ReactSelect from 'react-select';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export interface BagItem {
  itemName: string;
  itemPrice: number;
  itemPieces?: number;
  itemWeight?: number;
  totalItemPrice?: number;
}

export interface Bag {
  bagName: string;
  bagItems: BagItem[];
  totalPrice: number;
  totalWeight?: number;
  totalPieces?: number;
  createdDate: string;
  updatedDate?: string;
  status: 'Active' | 'Inactive';
}



const dummyItems = [
  { value: 'Carrot', label: 'Carrot', price: 1.5, unit: "grams" },
  { value: 'Broccoli', label: 'Broccoli', price: 2.0, unit: "pieces" },
  { value: 'Potato', label: 'Potato', price: 0.5, unit: "grams" },
];

const bagFormSchema = z.object({
  bagName: z.string().min(1, 'Bag name is required'),
  bagItems: z.array(
    z.object({
      itemName: z.string().min(1, 'Item name is required'),
      itemPrice: z.number().nonnegative(),
      itemPieces: z.number().nonnegative().optional(),
      itemWeight: z.number().min(5000, 'At least 5000 grams').max(10000, 'At most 10000 grams').optional(),
      totalItemPrice: z.number().optional(),
    })
  ).min(1, 'At least one item is required'),
  totalPrice: z.number().nonnegative(),
  totalWeight: z.number().nonnegative().optional(),
  totalPieces: z.number().nonnegative().optional(),
  updatedDate: z.string().optional(),
  status: z.enum(['Active', 'Inactive']),
});

export const BagForm: React.FC<{ initialData?: Bag }> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bagItems, setBagItems] = useState<BagItem[]>(initialData?.bagItems || []);
  const form = useForm<Bag>({
    resolver: zodResolver(bagFormSchema),
    defaultValues: initialData || {
      bagName: '',
      bagItems: [],
      totalPrice: 0,
      totalWeight: undefined,
      totalPieces: undefined,
      createdDate: '',
      status: 'Active',
    },
  });

  const { control, handleSubmit, formState: { errors }, setValue, watch, reset } = form;
  const router = useRouter();

  const onSubmit: SubmitHandler<Bag> = async (data) => {
    try {
      setLoading(true);
      if (initialData) {
        // Update existing bag
      } else {
        // Create new bag
      }
      // Refresh or redirect after submission
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const processForm: SubmitHandler<Bag> = (data) => {
    // Process form data
  };

  const steps = [
    {
      id: 'Step 1',
      name: 'Bag Details',
      fields: ['bagName', 'status']
    },
    {
      id: 'Step 2',
      name: 'Bag Items',
      fields: ['bagItems']
    }];

  type FieldName = keyof Bag;

  const next = async () => {
    const fields = steps[currentStep].fields;

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await form.handleSubmit(processForm)();
      }
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleAddItem = () => {
    setBagItems([...bagItems, { itemName: '', itemPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedBagItems = bagItems.filter((_, i) => i !== index);
    setBagItems(updatedBagItems);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedBagItems = [...bagItems];
    updatedBagItems[index] = { ...updatedBagItems[index], [field]: value };

    // Update total item price
    const item = updatedBagItems[index];
    if (field === 'itemWeight' || field === 'itemPieces') {
      if (item.itemWeight) {
        item.totalItemPrice = item.itemPrice * (item.itemWeight / 1000);
      } else if (item.itemPieces) {
        item.totalItemPrice = item.itemPrice * item.itemPieces;
      }
    }

    setBagItems(updatedBagItems);
  };

  const [weight, setWeight] = useState<number>(0);
  const [pieces, setPieces] = useState<number>(0);

  return (
    <div className="container mx-auto p-4">
      <Heading title={initialData ? 'Edit Bag' : 'Create Bag'} description="Fill in the details below" />
      <Separator />
      <div className='mt-2'>
        <ul className="flex gap-4">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-[#04894D] py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-[#04894D] transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium my-2">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-[#04894D] py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-[#04894D]">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium my-2">{step.name}</span>
                </div>
              ) : (
                <div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div
            className={cn(
              currentStep === 1
                ? 'w-full mt-5'
                : 'gap-8 md:grid md:grid-cols-2 mt-5'
            )}
          >
            {currentStep === 0 && (
              <>
                <FormField
                  control={form.control}
                  name="bagName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bag Name</FormLabel>
                      <FormControl>
                      <Input
  name="bagName"
  type='text'
  disabled={loading}
  placeholder="Enter Bag Name"
  onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)} // Correctly handle as a string
  value={field.value || ''}
/>


                      </FormControl>
                      <FormMessage>{errors.bagName?.message}</FormMessage>
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
                        <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.status?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </>
            )}
            {currentStep === 1 && (
              <>
                <div className="mt-4">
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={loading}
                    className="mt-2"
                  >
                    Add Item
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className="mt-8">
            {bagItems.length > 0 && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Price
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Weight
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Pieces
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Item Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bagItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <FormField
                          control={control}
                          name={`bagItems.${index}.itemName` as const}
                          render={({ field }) => (
                            <FormControl>
                              <Controller
                                control={control}
                                name={`bagItems.${index}.itemName` as const}
                                render={({ field }) => (
                                  <ReactSelect
                                    isClearable
                                    isSearchable
                                    options={dummyItems.map(item => ({
                                      value: item.value,
                                      label: item.label,
                                      price: item.price,
                                      unit: item.unit
                                    }))}
                                    formatOptionLabel={({ value, label, price }) => (
                                      <div className="flex justify-between">
                                        <span>{label}</span>
                                        <span>₹{price}</span>
                                      </div>
                                    )}
                                    isDisabled={loading}
                                    onChange={(selected) => {
                                      field.onChange(selected?.value);
                                      const selectedItem = dummyItems.find(item => item.value === selected?.value);
                                      handleItemChange(index, 'itemPrice', selectedItem?.price || 0);
                                    }}
                                    value={dummyItems.find((option) => option.value === field.value)}
                                  />
                                )}
                              />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{item.itemPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <FormField
                            control={control}
                            name={`bagItems.${index}.itemWeight` as const}
                            render={({ field }) => (
                              <FormItem>
                              <FormControl>
                              <Input
  type="number"
  disabled={loading}
  placeholder="Enter Item Weight"
  onChange={(e) => {
    const newValue = e.target.value === '' ? 0 : Number(e.target.value); // Default to 0 if empty
    field.onChange(newValue); // Update the form field (assuming 'field' comes from Formik or similar)
    setWeight(newValue); // Update local state
  }}
  value={field.value || ''}
/>

                              </FormControl>
                                                    <FormMessage />
                                                    </FormItem>

                            )}
                          />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  <FormField
    control={control}
    name={`bagItems.${index}.itemPieces` as const}
    render={({ field }) => (
      <FormItem>
      <FormControl>
      <Input
  {...field} // Spread Formik or similar library field props
  type="number"
  disabled={loading}
  placeholder="Enter Item Pieces"
  onChange={(e) => {
    const newValue = e.target.value === '' ? 0 : Number(e.target.value); // Use 0 or another default instead of undefined
    field.onChange(newValue); // Update the form field
    setPieces(newValue); // Update local state with a number, avoiding undefined
  }}
  value={field.value || ''}
/>


      </FormControl>
                            <FormMessage />
                            </FormItem>


    )}
  />
{/* )} */}

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ₹{item.itemPrice * (weight?(weight/1000):(pieces)) || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="mt-8 pt-5">
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={prev}
                disabled={currentStep === 0}
                className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </Button>
              <Button
                type="button"
                onClick={next}
                disabled={currentStep === steps.length - 1}
                className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </form>
      </Form>
      {initialData && (
        <div className="mt-8 pt-5 border-t border-gray-200">
          <div className="flex justify-between">
            <Heading
              title="Delete Bag"
              description="This action cannot be undone."
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => {} /* Add your delete logic here */}
              disabled={loading}
            >
              Delete Bag
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
