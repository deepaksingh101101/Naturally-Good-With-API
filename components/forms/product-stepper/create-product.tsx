'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash, Edit } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ReactSelect from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { createProductType, deleteProductType, getAllProductType } from '@/app/redux/actions/dropdownActions';
import { setLoading } from '@/app/redux/slices/authSlice';
import { ProductType } from '@/types/Dropdown';
import { ToastAtTopRight } from '@/lib/sweetAlert';

interface ProductFormType {
  initialData: any | null;
}

const productFormSchema = z.object({
  productName: z.string().min(1, 'Product Name is required'),
  description: z.string().min(1, 'Description is required'),
  productImage: z.object({}).optional(),
  visibility: z.string().min(1, 'Visibility is required'),
  unitType: z.string().min(1, 'Unit Type is required'),
  minUnit: z.number().min(1, 'Minimum Quantity is required'),
  maxUnit: z.number().min(1, 'Maximum Quantity is required'),
  available: z.string().min(1, 'Please Enter availability'),
  productPrice: z.number().min(1, 'Product Price is required'),
  type: z.string().min(1, 'Type is required'),
  subtype: z.string().min(1, 'Subtype is required'),
  group: z.string().min(1, 'Group is required'),
  season: z.string().min(1, 'Season is required'),
  priority: z.string().min(1, 'Priority is required'),
  roster: z.string().min(1, 'Roster is required'),
  veggieNameInHindi: z.string().min(1, 'Veggie Name in Hindi is required'),
  unitQuantity: z.number().positive('Unit Quantity must be greater than zero'),
  pieces: z.number().positive('Pieces must be greater than zero'),
  buffer: z.number().positive('Buffer Percentage must be greater than zero'),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const CreateProductForm: React.FC<ProductFormType> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [subtypeModalOpen, setSubtypeModalOpen] = useState(false);
  const [seasonModalOpen, setSeasonModalOpen] = useState(false);
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const { loading } = useSelector((state: RootState) => state.auth);
  const [deleteTypeModalOpen, setDeleteTypeModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);
  interface ProductTypeInterface {
    _id?: string;
    Name: string;
    SortOrder:number;
  }

  // Define the ProductTypeInterface with expected types


  interface RosterInterface {
    _id: string;
    Name: string;
    SortOrder:number;
  }
  interface SeasonInterface {
    _id: string;
    Name: string;
  }
  const [fetchedProductType, setFetchedProductType] = useState<ProductTypeInterface[]>([]); // Specify the type here


  const dispatch = useDispatch<AppDispatch>(); // Use typed dispatch
  useEffect(() => {
    const fetchProductType = async () => {
    const productTypes=  await dispatch(getAllProductType());
    setFetchedProductType(productTypes.payload.data)
    };
    fetchProductType();
    dispatch(setLoading(false)); 

  }, []);
  const confirmDeleteType = async () => {
    if (typeToDelete) {
      await deleteType(typeToDelete);
      setDeleteTypeModalOpen(false); // Close the modal
    }
  };

  const [types, setTypes] = useState([
    { value: 'Staples', label: 'Staples' },
    { value: 'Regular Veggie', label: 'Regular Veggie' },
    { value: 'Exotics Veggies', label: 'Exotics Veggies' },
    { value: 'Salads', label: 'Salads' },
    { value: 'Exotic Salads', label: 'Exotic Salads' },
    { value: 'Add Ons', label: 'Add Ons' },
  ]);
  const [subtypes, setSubtypes] = useState([
    { value: 'Staples', label: 'Staples' },
    { value: 'Regular Veggie', label: 'Regular Veggie' },
    { value: 'Exotics Veggies', label: 'Exotics Veggies' },
    { value: 'Salads', label: 'Salads' },
    { value: 'Exotic Salads', label: 'Exotic Salads' },
    { value: 'Add Ons', label: 'Add Ons' },
  ]);

  const [seasons, setSeasons] = useState([
    { value: 'Summer', label: 'Summer' },
    { value: 'Winter', label: 'Winter' },
    { value: 'Monsoon', label: 'Monsoon' },
    { value: 'All', label: 'All' },
  ]);
  const [rosters, setRosters] = useState([
    { value: 'Mandatory', label: 'Mandatory' },
    { value: 'Recommended Veggie', label: 'Recommended Veggie' },
    { value: 'optional Veggies', label: 'optional Veggies' },
    { value: 'Herbs', label: 'Herbs' },
    { value: 'Add on', label: 'Add on' },
    { value: 'Trial', label: 'Trial' },
    { value: 'Inactive', label: 'Inactive' },
  ]);
  const [unitTypes, setUnitTypes] = useState([
    { value: 'grams', label: 'Grams' },
    { value: 'pieces', label: 'Pieces' },
  ]);

  const [newType, setNewType] = useState('');
const [sortOrder, setSortOrder] = useState(1); // Default sort order
  const [newSubtype, setNewSubtype] = useState('');
  const [newSeason, setNewSeason] = useState('');
  const [newRoster, setNewRoster] = useState('');

  const title = initialData ? 'Edit Item' : 'Create New Item';
  const description = initialData
    ? 'Edit Item details.'
    : 'To create a new Items, fill in the required information.';
  const toastMessage = initialData ? 'Item updated.' : 'Item created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: 'onChange',
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = form;

  const selectedUnitType=watch('unitType')

  const onSubmit = async (data: ProductFormValues) => {
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

  const addType = async () => {
    if (newType.trim() && sortOrder >= 0) { // Ensure sort order is non-negative
        try {
            dispatch(setLoading(true));
            const response = await dispatch(createProductType({ Name: newType, SortOrder: sortOrder })); // Include SortOrder

            if (response.type === 'productType/create/fulfilled') {
                const newProductType: ProductTypeInterface = {
                    _id: response.payload.data._id, // Ensure this is a string
                    Name: newType,
                    SortOrder: sortOrder, // Use the specified sort order
                };
                setFetchedProductType((prev: ProductTypeInterface[]) => [...prev, newProductType]); // Ensure prev is of the correct type
                ToastAtTopRight.fire({
                    icon: 'success',
                    title: 'New product type created!',
                });
                setNewType(''); // Clear the input field
                setSortOrder(1); // Reset sort order to default
            } else {
                ToastAtTopRight.fire({
                    icon: 'error',
                    title: response.payload.message || 'Failed to add product type',
                });
            }
        } catch (error) {
            console.error('Error adding product type:', error);
        } finally {
            dispatch(setLoading(false));
        }
    }
};
  
  

  const addSubtype = () => {
    if (newSubtype.trim()) {
      setSubtypes([...subtypes, { value: newSubtype, label: newSubtype }]);
      setNewSubtype('');
    }
  };

  const addSeason = () => {
    if (newSeason.trim()) {
      setSeasons([...seasons, { value: newSeason, label: newSeason }]);
      setNewSeason('');
    }
  };

  const addRoster = () => {
    if (newRoster.trim()) {
      setRosters([...rosters, { value: newRoster, label: newRoster }]);
      setNewRoster('');
    }
  };

  const  deleteType = async (typeToDelete: string) => {
    if (typeToDelete) {
      const response=  await dispatch(deleteProductType(typeToDelete)); // Dispatch the delete action
      if (response.type === 'productType/delete/fulfilled') {
        setFetchedProductType((prev) => prev.filter(type => type._id !== typeToDelete));
         ToastAtTopRight.fire({
            icon: 'success',
            title: 'Product type deleted!',
        });
        setNewType(''); // Clear the input field
        setSortOrder(1); // Reset sort order to default
    } else {
        ToastAtTopRight.fire({
            icon: 'error',
            title: response.payload.message || 'Failed to add product type',
        });
    }
    }
  };

  const deleteSubtype = (subtypeToDelete: string) => {
    setSubtypes(subtypes.filter(subtype => subtype.value !== subtypeToDelete));
  };

  const deleteSeason = (seasonToDelete: string) => {
    setSeasons(seasons.filter(season => season.value !== seasonToDelete));
  };

  const deleteRoster = (rosterToDelete: string) => {
    setRosters(rosters.filter(roster => roster.value !== rosterToDelete));
  };

  return (
    <>
    <Dialog open={deleteTypeModalOpen} onOpenChange={setDeleteTypeModalOpen}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this product type? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button onClick={confirmDeleteType} variant="destructive">Delete</Button>
      <Button onClick={() => setDeleteTypeModalOpen(false)}>Cancel</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
 <Dialog open={typeModalOpen} onOpenChange={setTypeModalOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Types</DialogTitle>
          <DialogDescription>Add or remove product types.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-row ">
            <Input
              placeholder="Type Name"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="mb-2 me-2 "
            />
            <Input
              placeholder="Sort Order"
              type="number" // Ensure this is a number input
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="mb-4 ms-2"
            />
            <Button className='ms-3' onClick={addType}>Add</Button>
          </div>
          <div className="space-y-2">
            {fetchedProductType?.map((type) => (
              <div key={type._id} className="flex justify-between items-center">
                <span className='w-full' >{type.Name}</span>
                <span className='w-full' >{type.SortOrder}</span> {/* Display Sort Order */}
                <Button 
  variant="destructive" 
  disabled={loading}
  onClick={() => {
    if (type._id) { // Ensure _id is defined
      setTypeToDelete(type._id); // Set the type ID to delete
      setDeleteTypeModalOpen(true); // Open the confirmation modal
    }
  }}
>
  Delete
</Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );


      <Dialog open={subtypeModalOpen} onOpenChange={setSubtypeModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Subtypes</DialogTitle>
            <DialogDescription>Add or remove product subtypes.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
          <div className="flex justify-between">

            <Input
              placeholder="New Subtype"
              value={newSubtype}
              onChange={(e) => setNewSubtype(e.target.value)}
            />
            <Button  className='ms-3' onClick={addSubtype}>Add</Button>
            </div>
            <div className="space-y-2">
              {subtypes.map((subtype) => (
                <div key={subtype.value} className="flex justify-between items-center">
                  <span>{subtype.label}</span>
                  <Button variant="destructive" onClick={() => deleteSubtype(subtype.value)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSubtypeModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={seasonModalOpen} onOpenChange={setSeasonModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Seasons</DialogTitle>
            <DialogDescription>Add or remove product seasons.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
          <div className="flex justify-between">

            <Input
              placeholder="New Season"
              value={newSeason}
              onChange={(e) => setNewSeason(e.target.value)}
            />
            <Button className='ms-2' onClick={addSeason}>Add</Button>
            </div>
            <div className="space-y-2">
              {seasons.map((season) => (
                <div key={season.value} className="flex justify-between items-center">
                  <span>{season.label}</span>
                  <Button variant="destructive" onClick={() => deleteSeason(season.value)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSeasonModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rosterModalOpen} onOpenChange={setRosterModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Rosters</DialogTitle>
            <DialogDescription>Add or remove product rosters.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
          <div className="flex justify-between">

            <Input
              placeholder="New Roster"
              value={newRoster}
              onChange={(e) => setNewRoster(e.target.value)}
            />
            <Button  className='ms-3' onClick={addRoster}>Add</Button>
            </div>
            <div className="space-y-2">
              {rosters.map((roster) => (
                <div key={roster.value} className="flex justify-between items-center">
                  <span>{roster.label}</span>
                  <Button variant="destructive" onClick={() => deleteRoster(roster.value)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setRosterModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

          <div className="relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-3">

            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Item Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
<FormField
  control={form.control}
  name="type"
  render={({ field }) => {
    const options: any[] = fetchedProductType?.map(type => ({
      value: type._id, // Assuming _id is guaranteed to be a string
      label: type.Name.trim(), // Trimmed label to avoid issues with spaces
    }));

    return (
      <FormItem>
        <div className="flex items-center">
          <FormLabel>Type</FormLabel>
          <Edit className="text-red-500 ms-1" height={15} width={15} onClick={() => setTypeModalOpen(true)} />
        </div>
        <FormControl>
          <ReactSelect
            isSearchable
            options={options} // Use the newly defined options
            isDisabled={loading}
            onChange={(selected) => field.onChange(selected ? selected.value : '')} // Handle selection
            value={options?.find(option => option.value === field.value) ?? null} // Safely access selected value
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>
             <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Season</FormLabel>
                    <Edit className="text-red-500 ms-1" height={15} width={15} onClick={() => setSeasonModalOpen(true)}/>
                  </div>
                  <FormControl>
                    <ReactSelect
                      isSearchable
                      options={seasons}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      isDisabled={loading}
                      onChange={(selected) => field.onChange(selected ? selected.value : '')}
                      value={seasons.find(option => option.value === field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter priority"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="roster"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Roster</FormLabel>
                    <Edit className="text-red-500 ms-1" height={15} width={15} onClick={() => setRosterModalOpen(true)}/>
                  </div>
                  <FormControl>
                    <ReactSelect
                      isSearchable
                      options={rosters}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      isDisabled={loading}
                      onChange={(selected) => field.onChange(selected ? selected.value : '')}
                      value={rosters.find(option => option.value === field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Group"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="veggieNameInHindi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veggie Name in Hindi</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Veggie Name in Hindi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {/* <FormField
              control={control}
              name="unitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Type</FormLabel>
                  <FormControl>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Unit Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grams">Grams</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.available?.message}</FormMessage>
                </FormItem>
              )}
            /> */}

<FormField
              control={form.control}
              name="unitQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Quantity (gms)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Enter Unit Quantity"
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
{/* <FormField
              control={form.control}
              name="pieces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Quantity (piece)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Enter Piece "
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}









          


 <FormField
              control={form.control}
              name="minUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Units</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Enter Minimum Units"
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Units</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Enter Maximum Unit "
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="productPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Enter Item Price"
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          
          <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Visibility</FormLabel>
                  <FormControl>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.visibility?.message}</FormMessage>
                </FormItem>
              )}
            />
          
            {/* <FormField
              control={form.control}
              name="subtype"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Subtype</FormLabel>
                    <Edit className="text-red-500 ms-1" height={15} width={15} onClick={() => setSubtypeModalOpen(true)}/>
                  </div>
                  <FormControl>
                    <ReactSelect
                      isSearchable
                      options={subtypes}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      isDisabled={loading}
                      onChange={(selected) => field.onChange(selected ? selected.value : '')}
                      value={subtypes.find(option => option.value === field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
        
           
           

           
         
           
           
            <FormField
              control={control}
              name="available"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Availability</FormLabel>
                  <FormControl>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.available?.message}</FormMessage>
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="buffer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buffer Percentage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Enter Buffer Units "
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={control}
              name="organic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organic/Inorganic</FormLabel>
                  <FormControl>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organic/Inorganic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Organic">Organic</SelectItem>
                        <SelectItem value="Inorganic">Inorganic</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.available?.message}</FormMessage>
                </FormItem>
              )}
            /> */}
           
            <Controller
              name="productImage"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Image</FormLabel>
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
                  {errors.productImage && <FormMessage>{errors.productImage.message}</FormMessage>}
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    rows={5}
                    placeholder="Enter Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {action}
          </Button>
        </form>
      </Form>
      {initialData && (
        <div className="mt-8 pt-5 border-t border-gray-200">
          <div className="flex justify-between">
            <Heading
              title="Delete Product"
              description="This action cannot be undone."
            />
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={loading}
            >
              Delete Product
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
