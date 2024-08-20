'use client';

import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import ReactSelect, { SingleValue, MultiValue } from 'react-select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, ClockIcon, Edit } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

interface Notification {
  id: number;
  image: File | string;
  heading: string;
  description: string;
  type: string;
  scheduleTime: string;
  scheduleType: string;
  notificationType: string;
  frequency: string;
}

interface NotificationFormType {
  initialData?: Notification | null;
}

const notificationFormSchema = z.object({
  image: z.any().refine(file => file instanceof File || typeof file === 'string', 'Invalid file format'),
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.string().min(1, 'Type is required'),
  noOfTimes: z.number().min(1, 'Number of Times is required'),
  scheduleTime: z.string().optional(),
  scheduleType: z.string().min(1, 'Schedule type is required'),
  notificationType: z.string().min(1, 'Notification type is required'),
  autoMaticType: z.string().min(1, 'AutoMaticType type is required'),
  frequency: z.string().optional(),
  customers: z.array(z.object({
    label: z.string(),
    value: z.string(),
    phone: z.string()
  })).optional(),
  startDate: z.date({
    required_error: 'Start Date is required.',
  }).optional(),
  endDate: z.date({
    required_error: 'End Date is required.',
  }).optional(),
  

});

type NotificationFormInputs = z.infer<typeof notificationFormSchema>;

type FrequencyOption = { value: string; label: string; number: number };
type ScheduledOption = { scheduleDate: ""; scheduleTime: ""};
type CustomerOption = { value: string; label: string; phone: string };

export const CreateNotificationForm: React.FC<NotificationFormType> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [notificationType, setNotificationType] = useState(initialData?.notificationType || 'Manual');
  const [frequencyModalOpen, setFrequencyModalOpen] = useState(false);
  type FrequencyOption = { value: string; label: string; number: number,dayBasis:number };

  


  const [newFrequency, setNewFrequency] = useState({ name: '', number: 1, dayBasis: 1});

  const [customers, setCustomers] = useState<CustomerOption[]>([
    { value: '1', label: 'John Doe', phone: '1234567890' },
    { value: '2', label: 'Jane Smith', phone: '0987654321' },
    // Add more customers as needed
  ]);

  const form = useForm<NotificationFormInputs>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: initialData || {
      image: '',
      heading: '',
      description: '',
      type: '',
      scheduleTime: '',
      scheduleType: '',
      notificationType: 'Manual',
      autoMaticType: 'fixedType',
      frequency: '',
      noOfTimes: 0,
      customers: [],
      startDate:new Date(),
      endDate:new Date()
    },
  });

  const { control, handleSubmit, setValue,watch, formState: { errors } } = form;
  
  const [frequencyNumber, setFrequencyNumber] = useState<any>(undefined);
  const [scheduledData, setScheduledData] = useState<{ scheduleDate: string; scheduleTime: string }[]>([{ scheduleDate: "", scheduleTime: "" }]);

  // const notificationType = watch('notificationType');
  const selectedAutoMaticType = watch('autoMaticType');
  const selectedNoOfTimes = watch('noOfTimes');

  const scheduleType = useWatch({
    control,
    name: 'scheduleType',
  });



  const frequency = useWatch({
    control,
    name: 'frequency',
  });

  useEffect(() => {
    if (frequency) {
      const selectedFrequency = frequencies.find(f => f.value === frequency);
      if (selectedFrequency) {
        setFrequencyNumber(selectedFrequency.number);
      }
    }
    setValue('noOfTimes',0)
    setValue('frequency', undefined);
    setScheduledData([]);

  }, [frequency,selectedAutoMaticType]);

// ...

useEffect(() => {
  const length = selectedNoOfTimes ||  frequencyNumber || 0;
  const newScheduledData = Array.from({ length }, () => ({ scheduleDate: "", scheduleTime: "" }));
  setScheduledData(newScheduledData);
}, [selectedNoOfTimes, selectedAutoMaticType, frequencyNumber]);

// ...


  const onSubmit: SubmitHandler<NotificationFormInputs> = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('heading', data.heading);
      formData.append('description', data.description);
      formData.append('type', data.type);
      formData.append('scheduleTime', data.scheduleTime || '');
      formData.append('scheduleType', data.scheduleType);
      formData.append('notificationType', data.notificationType);
      formData.append('frequency', data.frequency || '');

      if (data.image instanceof File) {
        formData.append('image', data.image);
      } else {
        formData.append('imageUrl', data.image);
      }

      if (initialData) {
        // Update existing notification
      } else {
        // Create new notification
      }
      // Refresh or redirect after submission
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderErrorMessage = (error: any) => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return null;
  };

  const [newType, setNewType] = useState('');

  const [types, setTypes] = useState([
    { value: 'System', label: 'System' },
    { value: 'Feature', label: 'Feature' },
    { value: 'Report', label: 'Report' },
    { value: 'Reminder', label: 'Reminder' },
    { value: 'Alert', label: 'Alert' },
  ]);

  const addType = () => {
    if (newType.trim()) {
      setTypes([...types, { value: newType, label: newType }]);
      setNewType('');
    }
  };

  const deleteType = (typeToDelete: string) => {
    setTypes(types.filter(t => t.value !== typeToDelete));
  };
  
  // const newValue = `${newFrequency.name.toLowerCase()}-${newFrequency.dayBasis}-${newFrequency.number}`;
  const [frequencies, setFrequencies] = useState<FrequencyOption[]>([
    { value: 'daily', label: 'Daily', number: 1, dayBasis: 1 },
    { value: 'weekly', label: 'Weekly', number: 3, dayBasis: 7 },
  ]);
  
  const addFrequency = () => {
    if (newFrequency.name.trim()) {
      const newValue = {
        value: newFrequency.name.toLowerCase(),
        label: newFrequency.name,
        number: newFrequency.number,
        dayBasis: newFrequency.dayBasis,
      };
  
      // Check if a frequency with the same name, number, and dayBasis already exists
      const existingIndex = frequencies.findIndex(
        (f) =>
          f.value === newValue.value &&
          f.number === newValue.number &&
          f.dayBasis === newValue.dayBasis
      );
  
      if (existingIndex !== -1) {
        const updatedFrequencies = [...frequencies];
        updatedFrequencies[existingIndex] = newValue;
        setFrequencies(updatedFrequencies);
      } else {
        setFrequencies([...frequencies, newValue]);
      }
      
  
      setNewFrequency({ name: '', number: 1, dayBasis: 1 });
    }
  };
  
  
  
  
  
  

  const deleteFrequency = (frequencyToDelete: string) => {
    setFrequencies(frequencies.filter(f => f.value !== frequencyToDelete));
  };

  const [typeModalOpen, setTypeModalOpen] = useState(false);

  return (
    <>
      <Dialog open={typeModalOpen} onOpenChange={setTypeModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Types</DialogTitle>
            <DialogDescription>Add or remove types.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Input
                placeholder="New Type"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
              />
              <Button className='ms-3' onClick={addType}>Add</Button>
            </div>
            <div className="space-y-2">
              {types.map((type) => (
                <div key={type.value} className="flex justify-between items-center">
                  <span>{type.label}</span>
                  <Button variant="destructive" onClick={() => deleteType(type.value)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setTypeModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={frequencyModalOpen} onOpenChange={setFrequencyModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Frequencies</DialogTitle>
            <DialogDescription>Add or remove frequencies.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Input
                placeholder="Frequency Name"
                value={newFrequency.name}
                onChange={(e) => setNewFrequency({ ...newFrequency, name: e.target.value })}
              />
      <Input
  type="number"
  placeholder="Day Basis in number"
  value={newFrequency.dayBasis !== 0 ? newFrequency.dayBasis : ''} // Allow the input to show an empty string if the value is 0
  onChange={(e) =>
    setNewFrequency({
      ...newFrequency,
      dayBasis: e.target.value === '' ? 0 : Number(e.target.value), // Set to 0 if the input is empty
    })
  }
/>


              <Input
                type="number"
                placeholder="Frequency Number"
                value={newFrequency.number}
                onChange={(e) => setNewFrequency({ ...newFrequency, number: parseInt(e.target.value) })}
                className="ml-2"
              />
              
              <Button className='ms-3' onClick={addFrequency}>Add</Button>
            </div>
            <div className="space-y-2">
              {frequencies.map((frequency) => (
                <div key={frequency.value} className="flex justify-between items-center">
                  <span>{frequency.label} - {frequency.number} Times</span>
                  <Button variant="destructive" onClick={() => deleteFrequency(frequency.value)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {/* <DialogFooter>
            <Button onClick={() => setFrequencyModalOpen(false)}>Close</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>

      <div className="container mx-auto p-4">
        <Heading title={initialData ? 'Edit Notification' : 'Create Notification'} description="Fill in the details below" />
        <Separator />
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
              <FormField
                control={control}
                name="heading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heading</FormLabel>
                    <FormControl>
                      <Input type="text" disabled={loading} placeholder="Enter Heading" {...field} />
                    </FormControl>
                    <FormMessage>{renderErrorMessage(errors.heading)}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        disabled={loading}
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setValue('image', e.target.files[0]);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage>{renderErrorMessage(errors.image)}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input type="text" disabled={loading} placeholder="Enter Description" {...field} />
                    </FormControl>
                    <FormMessage>{renderErrorMessage(errors.description)}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Category</FormLabel>
                      <Edit className="text-red-500 ms-1" height={15} width={15} onClick={() => setTypeModalOpen(true)} />
                    </div>
                    <FormControl>
                      <ReactSelect
                        isSearchable
                        options={types}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        isDisabled={loading}
                        onChange={(selected) => field.onChange(selected ? selected.value : '')}
                        value={types.find(option => option.value === field.value)}
                      />
                    </FormControl>
                    <FormMessage>{renderErrorMessage(errors.type)}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="notificationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Type</FormLabel>
                    <FormControl>
                      <ReactSelect
                        isSearchable
                        options={[
                          { value: 'Automatic', label: 'Automatic' },
                          { value: 'Manual', label: 'Manual' },
                        ]}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        isDisabled={loading}
                        onChange={(selected) => {
                          field.onChange(selected ? selected.value : '');
                          setNotificationType(selected ? selected.value : 'Manual');
                        }}
                        value={[
                          { value: 'Automatic', label: 'Automatic' },
                          { value: 'Manual', label: 'Manual' },
                        ].find(option => option.value === field.value)}
                      />
                    </FormControl>
                    <FormMessage>{renderErrorMessage(errors.notificationType)}</FormMessage>
                  </FormItem>
                )}
              />
              
              {notificationType === 'Automatic' && (
                <>
                <FormField
                control={form.control}
                name="autoMaticType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Automatic Type</FormLabel>
                    <FormControl>
                      <ReactSelect
                        isSearchable
                        options={[
                          { value: 'fixedType', label: 'Fixed Type' },
                          { value: 'infiniteType', label: 'Infinite Type' },
                          { value: 'rangeType', label: 'Range Type' },
                        ]}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        isDisabled={loading}
                        onChange={(selected) => {
                          field.onChange(selected ? selected.value : '');
                        }}
                        value={[
                          { value: 'fixedType', label: 'Fixed Type' },
                          { value: 'infiniteType', label: 'Infinite Type' },
                          { value: 'rangeType', label: 'Range Type' },
                        ].find(option => option.value === field.value)}
                      />
                    </FormControl>
                    <FormMessage>{renderErrorMessage(errors.autoMaticType)}</FormMessage>
                  </FormItem>
                )}
              />   
          {selectedAutoMaticType==="fixedType" &&   <FormField
              control={form.control}
              name="noOfTimes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number Of Times</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Enter Number Of Times"
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />}
            {(selectedAutoMaticType === "rangeType" || selectedAutoMaticType === "infiniteType") && (
 <FormField
 control={control}
 name="frequency"
 render={({ field }) => (
   <FormItem>
     <div className="flex items-center">
       <FormLabel>Select Frequency</FormLabel>
       <Edit
         className="text-red-500 ms-1"
         height={15}
         width={15}
         onClick={() => setFrequencyModalOpen(true)}
       />
     </div>
     <FormControl>
     <ReactSelect
  options={frequencies}
  getOptionLabel={(option) => `${option.label} - ${option.number} Times`}
  getOptionValue={(option) => option.value}
  value={frequencies.find(frequency => frequency.value === field.value)}  // Ensures the correct value is displayed
  onChange={(selected: SingleValue<FrequencyOption>) => {
    if (selected) setValue('frequency', selected.value);
  }}
  isClearable={true}  // Allows the user to clear the selection
/>

     </FormControl>
     <FormMessage>{renderErrorMessage(errors.frequency)}</FormMessage>
   </FormItem>
 )}
/>

)}

   {frequency!=="one-time" &&               <>
   <FormField
  control={form.control}
  name="startDate"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Start Date</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full pl-3 text-left font-normal',
              !(field.value) && 'text-muted-foreground'
            )}
          >
            {field.value ? format(field.value, 'PPP') : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            selected={field.value || new Date}
            onSelect={(date) => {
              field.onChange(date);
            }}
            mode="single"
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormMessage>{renderErrorMessage(errors.startDate)}</FormMessage>
    </FormItem>
  )}
/>
  {selectedAutoMaticType!=="infiniteType" && (<FormField
  control={form.control}
  name="endDate"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>End Date</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full pl-3 text-left font-normal',
              !(field.value) && 'text-muted-foreground'
            )}
          >
            {field.value ? format(field.value, 'PPP') : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            selected={field.value || new Date}
            onSelect={(date) => {
              field.onChange(date);
            }}
            mode="single"
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormMessage>{renderErrorMessage(errors.endDate)}</FormMessage>
    </FormItem>
  )}
/>)}
</>}




              
                </>
              )}
              <FormField
                control={control}
                name="scheduleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Type</FormLabel>
                    <FormControl>
                      <ReactSelect
                        isSearchable
                        options={[
                          { value: 'Global', label: 'Global' },
                          { value: 'Non-Global', label: 'Non-Global' },
                        ]}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        isDisabled={loading}
                        onChange={(selected) => field.onChange(selected ? selected.value : '')}
                        value={[
                          { value: 'Global', label: 'Global' },
                          { value: 'Non-Global', label: 'Non-Global' },
                        ].find(option => option.value === field.value)}
                      />
                    </FormControl>
                    <FormMessage>{renderErrorMessage(errors.scheduleType)}</FormMessage>
                  </FormItem>
                )}
              />
            
            </div>
            {scheduleType === 'Non-Global' && (
                <FormField
                  control={control}
                  name="customers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customers</FormLabel>
                      <FormControl>
                        <ReactSelect
                          isSearchable
                          isMulti
                          options={customers}
                          getOptionLabel={(option) => `${option.label} (${option.phone})`}
                          getOptionValue={(option) => option.value}
                          isDisabled={loading}
                          onChange={(selected: MultiValue<CustomerOption>) => field.onChange(selected)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage>{renderErrorMessage(errors.customers)}</FormMessage>
                    </FormItem>
                  )}
                />
              )}
               <div className="mt-8">
            {(selectedNoOfTimes || frequencyNumber) && (  <table className="min-w-full divide-y divide-gray-200">
               <thead>
                  <tr>
                    
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Schedule Date
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Schedule Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {scheduledData.map((item, index) => (
        <tr key={index} >
          <td  className="px-6  py-4 whitespace-nowrap text-sm text-gray-500">
           <FormField
  control={form.control}
  name="endDate"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full pl-3 text-left font-normal',
              !(field.value) && 'text-muted-foreground'
            )}
          >
            {field.value ? format(field.value, 'PPP') : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            selected={field.value || new Date}
            onSelect={(date) => {
              field.onChange(date);
            }}
            mode="single"
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormMessage>{renderErrorMessage(errors.endDate)}</FormMessage>
    </FormItem>
  )}
/>
</td>

<td  className="px-6 py-4  whitespace-nowrap text-sm text-gray-500">
<Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <ClockIcon className="mr-1 h-4 w-4 -translate-x-1" />
            <span>Select Time</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="w-full" />
        </PopoverContent>
      </Popover>
          </td>
          
        </tr>
      ))}

</tbody>
</table>)}
                  </div>
            <Button type="submit" disabled={loading}>
              {initialData ? 'Save Changes' : 'Create Notification'}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
