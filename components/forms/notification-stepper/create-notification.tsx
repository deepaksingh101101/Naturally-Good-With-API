'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import ReactSelect from 'react-select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';

interface Notification {
  id: number;
  image: File | string;  // Changed to File | string
  heading: string;
  description: string;
  type: string;
}

interface NotificationFormType {
  initialData?: Notification | null;
}

const notificationFormSchema = z.object({
  image: z.any().refine(file => file instanceof File || typeof file === 'string', 'Invalid file format'),
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.string().min(1, 'Type is required'),
});

type NotificationFormInputs = z.infer<typeof notificationFormSchema>;

export const CreateNotificationForm: React.FC<NotificationFormType> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<NotificationFormInputs>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: initialData || {
      image: '',
      heading: '',
      description: '',
      type: '',
    },
  });

  const { control, handleSubmit, setValue, formState: { errors } } = form;

  const onSubmit: SubmitHandler<NotificationFormInputs> = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('heading', data.heading);
      formData.append('description', data.description);
      formData.append('type', data.type);

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
