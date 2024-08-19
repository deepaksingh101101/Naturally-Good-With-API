'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Edit, Trash } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ReactSelect from 'react-select';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileFormType {
  initialData: any | null;
  categories: any;
}

const FormSchema = z.object({
  firstname: z.string().min(1, "First Name is required"),
  lastname: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email format").optional(),
  contactno: z.string().min(1, "Contact Number is required"),
  alterNateContact: z.string().optional(),
  address2: z.string().optional(),
  alterNateAddress: z.string().optional(),
  allergies: z.string().optional(),
  assignedEmployee: z.string().min(1, "Assigned Employee is required"),
  subscriptionType: z.string().min(1, "Subscription Type is required"),
  subscriptionStartDate: z.date({
    required_error: "Subscription Start Date is required.",
  }),
  paymentType: z.string().min(1, "Payment Type is required"),
  street: z.string().min(1, "Street Address is required"),
  city: z.string().min(1, "City is required"),
  source: z.string().min(1, "Source of customer is required"),
  state: z.string().min(1, 'State is required'),
  zipcode: z.string().min(1, 'Zipcode is required'),
  houseNumber: z.string().min(1, 'House and Floor Number is required'),
  society: z.string().min(1, 'Society/Locality is required'),
  // age: z.number().optional(),
  numberOfFamilyMembers: z.number().optional(),
  dob: z.date().optional(),
  gender: z.string().optional(),
  weight: z.number().optional(),
  preferences: z.string().optional(),
  extraNotes: z.string().optional(),
});

export const CreateProfileOne: React.FC<ProfileFormType> = ({
  initialData,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? "Edit Customer" : "Create Customer";
  const description = initialData
    ? "Edit a product."
    : "To create new Customer, we first need some basic information about Customer.";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        // await axios.post(`/api/products/edit-product/${initialData._id}`, data);
      } else {
        // const res = await axios.post(`/api/products/create-product`, data);
        // console.log("product", res);
      }
      router.refresh();
      router.push(`/dashboard/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const processForm = (data: z.infer<typeof FormSchema>) => {
    // api call and reset
    // form.reset();
  };

  const employees = [
    { id: "employee1", name: "John Doe", phoneNumber: "123-456-7890" },
    { id: "employee2", name: "Jane Smith", phoneNumber: "098-765-4321" },
    // Add more employees as needed
  ];

  const subscriptionTypes = [
    { id: "Staples", name: "Basic" },
    { id: "Veggies", name: "Premium" },
    { id: "Beans", name: "VIP" },
    { id: "Gourds", name: "VIP" },
    { id: "Beans", name: "VIP" },
    { id: "Beans", name: "VIP" },
    { id: "Beans", name: "VIP" },
  ];

  const [cityOptions, setCityOptions] = useState([
    { id: "Gurgaon", name: "Gurgaon" },
    { id: "Delhi", name: "Delhi" },
    { id: "Noida", name: "Noida" },
    { id: "Faridabad", name: "Faridabad" },
    { id: "Ghaziabad", name: "Ghaziabad" },
    { id: "Sahibabad", name: "Sahibabad" },
  ]);
  const [sourceOptions, setSourceOptions] = useState([
    { id: "instagram", name: "Instagram" },
    { id: "facebook", name: "Facebook" }
  ]);

  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [newSource, setNewSource] = useState('');

  const openCityModal = () => {
    setIsCityModalOpen(true);
  };

  const closeCityModal = () => {
    setIsCityModalOpen(false);
  };
  const openSourceModal = () => {
    setIsSourceModalOpen(true);
  };

  const closeSourceModal = () => {
    setIsSourceModalOpen(false);
  };

  const addCity = () => {
    if (newCity) {
      setCityOptions([...cityOptions, { id: newCity.toLowerCase(), name: newCity }]);
      setNewCity('');
    }
  };
  const addSource = () => {
    if (newSource) {
      setSourceOptions([...sourceOptions, { id: newSource.toLowerCase(), name: newSource }]);
      setNewSource('');
    }
  };

  const deleteCity = (index: number) => {
    setCityOptions(cityOptions.filter((_, i) => i !== index));
  };
  const deleteSource = (index: number) => {
    setSourceOptions(sourceOptions.filter((_, i) => i !== index));
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
      <Dialog open={isCityModalOpen} onOpenChange={(open) => !open && closeCityModal()}>
        <DialogContent className="max-w-lg" >
          <DialogHeader>
            <DialogTitle>Manage Cities</DialogTitle>
            <DialogDescription>You can manage cities here.</DialogDescription>
          </DialogHeader>
          <div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-red-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    City
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {cityOptions.map((city, cityIndex) => (
                  <tr key={cityIndex}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {city.name}
                    </td>
                    <td className="px-6 flex justify-end py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Trash onClick={() => deleteCity(cityIndex)} className="cursor-pointer text-red-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex mt-4">
              <Input
                type="text"
                placeholder="Add new city"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              />
              <Button onClick={addCity} className="ml-2">
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isSourceModalOpen} onOpenChange={(open) => !open && closeSourceModal()}>
        <DialogContent className="max-w-lg" >
          <DialogHeader>
            <DialogTitle>Manage Sources</DialogTitle>
            <DialogDescription>You can manage customer source.</DialogDescription>
          </DialogHeader>
          <div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-red-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Source
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {sourceOptions.map((source, sourceIndex) => (
                  <tr key={sourceIndex}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {source.name}
                    </td>
                    <td className="px-6 flex justify-end py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Trash onClick={() => deleteSource(sourceIndex)} className="cursor-pointer text-red-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex mt-4">
              <Input
                type="text"
                placeholder="Add new source"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
              />
              <Button onClick={addSource} className="ml-2">
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(processForm)}
          className="w-full space-y-8"
        >
          <div className="relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage>{errors.firstname?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage>{errors.lastname?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your contact number"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.contactno?.message}</FormMessage>
                </FormItem>
              )}
            />
          
        
            <FormField
              control={form.control}
              name="houseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House and Floor Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter House/Floor Number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.houseNumber?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="society"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Society/Locality</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Society/Locality"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.society?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Sector"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.address2?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <div className="flex mt-2">
                    <FormLabel>City</FormLabel>
                    <Edit onClick={openCityModal} className="ms-3 cursor-pointer text-red-500" height={15} width={15} />
                  </div>
                  <Controller
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <ReactSelect
                        isClearable
                        isSearchable
                        options={cityOptions}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        isDisabled={loading}
                        onChange={(selected) => field.onChange(selected ? selected.id : '')}
                        value={cityOptions.find(option => option.id === field.value)}
                      />
                    )}
                  />
                  <FormMessage>{errors.city?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <div className="flex mt-2">
                    <FormLabel>Source of Customer</FormLabel>
                    <Edit onClick={openSourceModal} className="ms-3 cursor-pointer text-red-500" height={15} width={15} />
                  </div>
                  <Controller
                    control={control}
                    name="source"
                    render={({ field }) => (
                      <ReactSelect
                        isClearable
                        isSearchable
                        options={sourceOptions}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        isDisabled={loading}
                        onChange={(selected) => field.onChange(selected ? selected.id : '')}
                        value={sourceOptions.find(option => option.id === field.value)}
                      />
                    )}
                  />
                  <FormMessage>{errors.source?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignedEmployee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Employee</FormLabel>
                  <Controller
                    control={control}
                    name="assignedEmployee"
                    render={({ field }) => (
                      <ReactSelect
                        isClearable
                        isSearchable
                        options={employees}
                        getOptionLabel={(option) => option.name} // Only display the employee name
                        getOptionValue={(option) => option.id}
                        isDisabled={loading}
                        onChange={(selected) => field.onChange(selected ? selected.id : '')}
                        value={employees.find(option => option.id === field.value)}
                        filterOption={(candidate, input) => {
                          const employee = employees.find(emp => emp.id === candidate.value);
                          return candidate.label.toLowerCase().includes(input.toLowerCase()) ||
                            (employee?.phoneNumber.includes(input) ?? false);
                        }} // Custom filter logic to search by phone number
                      />
                    )}
                  />
                  <FormMessage>{errors.assignedEmployee?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zipcode</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Zipcode"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.zipcode?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter State"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.state?.message}</FormMessage>
                </FormItem>
              )}
            />




          </div>
          <div className="relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-3">
     
            <FormField
              control={form.control}
              name="alterNateContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AlterNate Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your contact number"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.alterNateContact?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergies</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter any allergies"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.allergies?.message}</FormMessage>
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="alterNateAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter House number, Floor number, locality Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.alterNateAddress?.message}</FormMessage>
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="numberOfFamilyMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number Of Family Members</FormLabel>
                  <FormControl>
                    <Input
                    type="number"
                      disabled={loading}
                      placeholder="Enter Number Of Family Members"
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage>{errors.numberOfFamilyMembers?.message}</FormMessage>
                </FormItem>
              )}
            />

        
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="johndoe@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "dd MMM yyyy") : <span>Pick a date</span>}
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
                          date > new Date(new Date().setHours(0, 0, 0, 0)) || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage>{errors.dob?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.gender?.message}</FormMessage>
                </FormItem>
              )}
            />
         <FormField
  control={form.control}
  name="weight"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Weight</FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder="Enter weight"
          disabled={loading}
          {...field}
          onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          value={field.value || ''}
        />
      </FormControl>
      <FormMessage>{errors.weight?.message}</FormMessage>
    </FormItem>
  )}
/>


<FormField
  control={form.control}
  name="preferences"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Preferences</FormLabel>
      <FormControl>
        <Input
          placeholder="Enter preferences"
          disabled={loading}
          {...field}
        />
      </FormControl>
      <FormMessage>{errors.preferences?.message}</FormMessage>
    </FormItem>
  )}
/>

          </div>
          <FormField
  control={form.control}
  name="extraNotes"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Extra Notes</FormLabel>
      <FormControl>
        <Input
          placeholder="Enter any extra notes"
          disabled={loading}
          {...field}
        />
      </FormControl>
      <FormMessage>{errors.extraNotes?.message}</FormMessage>
    </FormItem>
  )}
/>
          <div className="mt-8 pt-5">
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="px-7 bg-green-700 text-white"
              >
                {action}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
