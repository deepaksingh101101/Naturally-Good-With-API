'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Edit, Trash, Trash2Icon, TrashIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactSelect from 'react-select';

import { cn, debounce } from "@/lib/utils";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiCall from "@/lib/axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { createSourceType, deleteSourceType, getAllSourceType } from "@/app/redux/actions/dropdownActions";
import { ToastAtTopRight } from "@/lib/sweetAlert";

interface ProfileFormType {
  initialData: any | null;
  categories: any;
}
export interface family {
  name: string;
  gender: string;
  dob: string;
  height: string;
  weight: string;
  allergies: string;
  contactNumber: number;
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
  customerType: z.string().min(1, "Type of Customer is required"),
  state: z.string().min(1, 'State is required'),
  zipcode: z.string().min(1, 'Zipcode is required'),
  houseNumber: z.string().min(1, 'House and Floor Number is required'),
  society: z.string().min(1, 'Society/Locality is required'),
  // age: z.number().optional(),
  numberOfFamilyMembers: z.number().optional(),
  dob: z.date().optional(),
  gender: z.string().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  preferences: z.string().optional(),
  extraNotes: z.string().optional(),
  cookingTimes: z.string().optional(),
  cookingType: z.string().optional(),
  familyMembers: z
  .array(
    z.object({
      name: z.string(),
      contactNumber: z.string(),
      gender: z.string().optional(), // Gender is optional
      dob: z.date().optional(),       // Date of Birth is optional
      height: z.string().optional(),  // Height is optional
      weight: z.number().optional(),  // Weight is optional
      allergies: z.string().optional() // Allergies is optional
    })
  )
  .optional(),
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


  const [sourceOptions, setSourceOptions] = useState([
    { id: "instagram", name: "Instagram" },
    { id: "facebook", name: "Facebook" }
  ]);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([
    { id: "lead", name: "lead" },
    { id: "prominent", name: "Prominent" }
  ]);

  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [newSource, setNewSource] = useState('');

  const [customerTypeModalOpen, setCustomerTypeModalOpen] = useState(false);
  const [newCustomerType, setNewCustomerType] = useState('');


  const [familyMembers, setFamilyMembers] = useState<any[]>(initialData?.familyMembers || []);

  const handleAddMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { 
        name: "", 
        contactNumber: "", 
        gender: "", 
        dob: null, 
        height: "", 
        weight: "", 
        allergies: "" 
      }
    ]);
  };

  const handleRemoveMember = (index: number) => {
    const updatedFamilyMembers = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updatedFamilyMembers);
  };

  const handleMemberChange = (index: number, field: string, value: any) => {
    const updatedFamilyMembers = [...familyMembers];
    updatedFamilyMembers[index][field] = value;
    setFamilyMembers(updatedFamilyMembers);
  };

  const openSourceModal = () => {
    setIsSourceModalOpen(true);
  };

  const closeSourceModal = () => {
    setIsSourceModalOpen(false);
  };
  const openCustomerTypeModal = () => {
    setCustomerTypeModalOpen(true);
  };

  const closeCustomerTypeModal = () => {
    setCustomerTypeModalOpen(false);
  };


  const addSource =async () => {
    if (newSource.trim()) { // Ensure sort order is non-negative
      try {
          const response = await dispatch(createSourceType({ Name: newSource})); // Include SortOrder

          if (response.type === 'sourceType/create/fulfilled') {
              const newSourceType:any = {
                  _id: response.payload.data._id, // Ensure this is a string
                  Name: newSource
              };
              setFetchedSourceType((prev: any[]) => [...prev, newSourceType]); // Ensure prev is of the correct type
              ToastAtTopRight.fire({
                  icon: 'success',
                  title: 'New source type created!',
              });
              setNewSource(''); // Clear the input field
          } else {
              ToastAtTopRight.fire({
                  icon: 'error',
                  title: response.payload.message || 'Failed to add product type',
              });
          }
      } catch (error) {
          console.error('Error adding product type:', error);
      } finally {
      }
  }
  };
  const deleteSource = (index: number) => {
    setSourceOptions(sourceOptions.filter((_, i) => i !== index));
  };
  const addCustomerType = () => {
    if (newCustomerType) {
      setCustomerTypeOptions([...customerTypeOptions, { id: newCustomerType.toLowerCase(), name: newCustomerType }]);
      setNewCustomerType('');
    }
  };
  const deleteCustomerType = (index: number) => {
    setCustomerTypeOptions(customerTypeOptions.filter((_, i) => i !== index));
  };


  const [searchTerm, setSearchTerm] = useState('');
  const [fetchedCity, setFetchedCity] = useState<{ id: string; name: string }[]>([]);

  const fetchCity = useCallback(
    debounce(async (term: string) => {
      if (!term) {
        setFetchedCity([]);
        return;
      }

      try {
        const response = await apiCall('GET', `/route/city/filter?CityName=${term}`);
        if (response.status) {
          console.log()
          setFetchedCity(response.data.cities.map((city: any) => ({ name: city.CityName, id: city._id })))
        } else {
          console.error(response);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchCity(searchTerm);
  }, [searchTerm, fetchCity]);

  const [fetchedSourceType, setFetchedSourceType] = useState<any[]>([]); // Specify the type here


  const dispatch = useDispatch<AppDispatch>(); // Use typed dispatch
  useEffect(() => {
    const fetchSourceType = async () => {
    const sourceTypes=  await dispatch(getAllSourceType());
    setFetchedSourceType(sourceTypes.payload.data)
    };
    fetchSourceType();
  }, []);
 
  const [deleteSourceTypeModalOpen, setDeleteSourceTypeModalOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);

  const confirmDeleteSourceType = async () => {
    if (sourceToDelete) {
      await deleteSourceTypeTemp(sourceToDelete);
      setDeleteSourceTypeModalOpen(false); // Close the modal
    }
  };

  const  deleteSourceTypeTemp = async (sourceToDelete: string) => {
    if (sourceToDelete) {
      const response=  await dispatch(deleteSourceType(sourceToDelete)); // Dispatch the delete action
      if (response.type === 'sourceType/delete/fulfilled') {
        setFetchedSourceType((prev) => prev.filter(type => type._id !== sourceToDelete));
         ToastAtTopRight.fire({
            icon: 'success',
            title: 'Source type deleted!',
        });
        setNewSource(''); // Clear the input field
    } else {
        ToastAtTopRight.fire({
            icon: 'error',
            title: response.payload.message || 'Failed to delete source type',
        });
    }
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
      <Dialog open={deleteSourceTypeModalOpen} onOpenChange={setDeleteSourceTypeModalOpen}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this source type? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button onClick={confirmDeleteSourceType} variant="destructive">Delete</Button>
      <Button onClick={() => setDeleteSourceTypeModalOpen(false)}>Cancel</Button>
    </DialogFooter>
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
                {fetchedSourceType?.map((source, sourceIndex) => (
                  <tr key={sourceIndex}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {source.Name}
                    </td>
                    <td className="px-6 flex justify-end py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Trash 
                      // onClick={() => deleteSource(sourceIndex)}
                       onClick={() => {
                        if (source._id) { // Ensure _id is defined
                          setSourceToDelete(source._id); // Set the type ID to delete
                          setDeleteSourceTypeModalOpen(true); // Open the confirmation modal
                        }
                      }}
                      className="cursor-pointer text-red-500" />
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

      {/* Modal for customer type */}


      <Dialog open={customerTypeModalOpen} onOpenChange={(open) => !open && closeCustomerTypeModal()}>
        <DialogContent className="max-w-lg" >
          <DialogHeader>
            <DialogTitle>Manage Customer Type</DialogTitle>
            <DialogDescription>You can manage customer Type.</DialogDescription>
          </DialogHeader>
          <div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-red-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Customer Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {customerTypeOptions.map((type, typeIndex) => (
                  <tr key={typeIndex}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {type.name}
                    </td>
                    <td className="px-6 flex justify-end py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Trash onClick={() => deleteCustomerType(typeIndex)} className="cursor-pointer text-red-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex mt-4">
              <Input
                type="text"
                placeholder="Add new Customer type"
                value={newCustomerType}
                onChange={(e) => setNewCustomerType(e.target.value)}
              />
              <Button onClick={addCustomerType} className="ml-2">
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
              name="city"
              render={({ field }) => (
                <FormItem>
                  <div className="flex mt-2">
                    <FormLabel>City</FormLabel>
                  </div>
                  <Controller
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <ReactSelect
                        isClearable
                        isSearchable
                        options={fetchedCity}
                        onInputChange={(inputValue) => setSearchTerm(inputValue)}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        isDisabled={loading}
                        onChange={(selected) => field.onChange(selected ? selected.id : '')}
                        value={fetchedCity.find(option => option.id === field.value)}
                      />
                    )}
                  />
                  <FormMessage>{errors.city?.message}</FormMessage>
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
              name="customerType"
              render={({ field }) => (
                <FormItem>
                  <div className="flex mt-2">
                    <FormLabel>Customer Type</FormLabel>
                    <Edit onClick={openCustomerTypeModal} className="ms-3 cursor-pointer text-red-500" height={15} width={15} />
                  </div>
                  <Controller
                    control={control}
                    name="customerType"
                    render={({ field }) => (
                      <ReactSelect
                        isClearable
                        isSearchable
                        options={customerTypeOptions}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        isDisabled={loading}
                        onChange={(selected) => field.onChange(selected ? selected.id : '')}
                        value={customerTypeOptions.find(option => option.id === field.value)}
                      />
                    )}
                  />
                  <FormMessage>{errors.customerType?.message}</FormMessage>
                </FormItem>
              )}
            />



          </div>
          <div className="relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-3">
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
              control={form.control}
              name="alterNateContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Contact Number</FormLabel>
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
  name="height"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Height</FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder="Enter height"
          disabled={loading}
          {...field}
          onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          value={field.value || ''}
        />
      </FormControl>
      <FormMessage>{errors.height?.message}</FormMessage>
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

<FormField
  control={form.control}
  name="allergies"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Allergies</FormLabel>
      <FormControl>
        <Input
          placeholder="Enter allergies"
          disabled={loading}
          {...field}
        />
      </FormControl>
      <FormMessage>{errors.allergies?.message}</FormMessage>
    </FormItem>
  )}
/>
<FormField
              control={form.control}
              name="cookingTimes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How often do you cook at home? </FormLabel>
                  <FormControl>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select here" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-3">2-3 Times</SelectItem>
                        <SelectItem value="3-5">3-5 Times</SelectItem>
                        <SelectItem value="more than 5">More than 5 Times</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.cookingTimes?.message}</FormMessage>
                </FormItem>
              )}
            />

<FormField
  control={form.control}
  name="cookingType"
  render={({ field }) => (
    <FormItem>
      <FormLabel>What do you usually cook?</FormLabel>
      <FormControl>
        <Input
          placeholder="Select here"
          disabled={loading}
          {...field}
        />
      </FormControl>
      <FormMessage>{errors.cookingType?.message}</FormMessage>
    </FormItem>
  )}
/>

{/* <FormField
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
            /> */}

{/* <FormField
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
            /> */}

<div className="mt-4 flex justify-between">
                  <Button
                    type="button"
                    onClick={handleAddMember}
                    disabled={loading}
                    className="mt-2"
                  >
                    Add Family Member
                  </Button>
                </div>

          

          </div>

                {/* Family Members Table */}
                <div className="mt-8">
                  {familyMembers.length > 0 && (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">   

                            Name
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs   
 font-medium text-gray-500 uppercase tracking-wider">
                            Height
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">   

                           Weight
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">   

                          DOB
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">   

                       Gender
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">   

                         Allergies
                          </th>
                          {/* Add more header cells for Height, Weight, Allergies */}
                          <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y   
 divide-gray-200">
                        {familyMembers.map((member, index) => (
                          <tr key={index}>
                            <td className=" py-2 whitespace-nowrap text-sm text-gray-500">
                              <Input
                                type="text"
                                disabled={loading}
                                placeholder="Enter name"
                                value={member.name}
                                onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm max-w-7 text-gray-500">
      <Input
        type="text"
        disabled={loading}
        placeholder="Height"
        value={member.height}
        onChange={(e) => handleMemberChange(index, "height", e.target.value)}
      />
    </td>

    {/* Weight */}
    <td className="px-2 py-2 whitespace-nowrap text-sm max-w-7 text-gray-500">
      <Input
        type="number"
        disabled={loading}
        placeholder="Weight"
        value={member.weight || ''}
        onChange={(e) => handleMemberChange(index, "weight", e.target.value === '' ? undefined : Number(e.target.value))}
      />
    </td>
                        
                           
                            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
      <Controller
        control={control}
        name={`familyMembers.${index}.dob`}
        render={({ field }) => (
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
                  {field.value ? format(field.value,   
 "dd MMM yyyy") : <span>Pick a date</span>}
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
                  date > new   
 Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>   

        )}
      />
      {/* You can add FormMessage here if needed */}
    </td>
    <td className="px-2 py-2  whitespace-nowrap text-sm min-w-32 text-gray-500">
                              <Select
                                disabled={loading}
                                onValueChange={(value) => handleMemberChange(index, "gender", value)}
                                value={member.gender}
                              >
                                <SelectTrigger className="mt-5 " >
                                  <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>   
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>   

                            </td>
  
    

    {/* Allergies */}
    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
      <Input
        type="text"
        disabled={loading}
        placeholder="Enter any allergies"
        value={member.allergies}
        onChange={(e) => handleMemberChange(index, "allergies", e.target.value)}
      />
    </td>
                            {/* Add more table cells for Date of Birth, Height, Weight, Allergies */}
                            <td className="pe-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => handleRemoveMember(index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2Icon className="h-6 w-6" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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
