'use client';

import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import ReactSelect, { SingleValue, MultiValue } from 'react-select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';

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
  scheduleTime: z.string().optional(),
  scheduleType: z.string().min(1, 'Schedule type is required'),
  notificationType: z.string().min(1, 'Notification type is required'),
  frequency: z.string().optional(),
  customers: z.array(z.object({
    label: z.string(),
    value: z.string(),
    phone: z.string()
  })).optional()
});

type NotificationFormInputs = z.infer<typeof notificationFormSchema>;

type FrequencyOption = { value: string; label: string; number: number };
type CustomerOption = { value: string; label: string; phone: string };

export const CreateNotificationForm: React.FC<NotificationFormType> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [notificationType, setNotificationType] = useState(initialData?.notificationType || 'Manual');
  const [frequencyModalOpen, setFrequencyModalOpen] = useState(false);
  const [frequencies, setFrequencies] = useState<FrequencyOption[]>([
    { value: 'one-time', label: 'One Time', number: 1 },
    { value: 'daily', label: 'Daily', number: 1 },
    { value: 'weekly', label: 'Weekly', number: 1 },
    { value: 'monthly', label: 'Monthly', number: 1 },
    { value: 'yearly', label: 'Yearly', number: 1 },
  ]);
  const [newFrequency, setNewFrequency] = useState({ name: '', number: 1 });

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
      frequency: '',
      customers: []
    },
  });

  const { control, handleSubmit, setValue, formState: { errors } } = form;
  
  const scheduleType = useWatch({
    control,
    name: 'scheduleType',
  });

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

  const addFrequency = () => {
    if (newFrequency.name.trim()) {
      setFrequencies([...frequencies, { value: newFrequency.name.toLowerCase(), label: newFrequency.name, number: newFrequency.number }]);
      setNewFrequency({ name: '', number: 1 });
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
                  <span>{frequency.label} - {frequency.number}</span>
                  <Button variant="destructive" onClick={() => deleteFrequency(frequency.value)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setFrequencyModalOpen(false)}>Close</Button>
          </DialogFooter>
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
                      <FormLabel>Type</FormLabel>
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
                    control={control}
                    name="scheduleTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schedule Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" disabled={loading} {...field} />
                        </FormControl>
                        <FormMessage>{renderErrorMessage(errors.scheduleTime)}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Frequency</FormLabel>
                          <Edit className="text-red-500 ms-1" height={15} width={15} onClick={() => setFrequencyModalOpen(true)} />
                        </div>
                        <FormControl>
                          <ReactSelect
                            isSearchable
                            options={frequencies}
                            getOptionLabel={(option) => `${option.label} - ${option.number}`}
                            getOptionValue={(option) => option.value}
                            isDisabled={loading}
                            onChange={(selected: SingleValue<FrequencyOption>) => field.onChange(selected ? selected.value : '')}
                            value={frequencies.find(option => option.value === field.value)}
                          />
                        </FormControl>
                        <FormMessage>{renderErrorMessage(errors.frequency)}</FormMessage>
                      </FormItem>
                    )}
                  />
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
            <Button type="submit" disabled={loading}>
              {initialData ? 'Save Changes' : 'Create Notification'}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
