'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
import { setLocalStorageItem } from '@/utils/localStorage';
import { ToastAtTopRight } from '@/lib/sweetAlert';

const FormSchema = z.object({
  Email: z.string().email({ message: 'Enter a valid email address' }),
  Password: z.string()
    .min(6, { message: 'Password must be at least 6 characters long' })
});

type UserFormValue = z.infer<typeof FormSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false); // Explicitly typed as boolean

  const form = useForm<UserFormValue>({
    resolver: zodResolver(FormSchema)
  });

  
  // Correctly defined onSubmit function
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);
      const response:any = await axios.post('http://localhost:3001/admin/employee/login', {
        Email: data.Email,
        Password: data.Password,
      });
      if(response.data.statusCode === 200){
        ToastAtTopRight.fire({
          icon: "success",
          title: "Signed in successfully"
        });
        setLocalStorageItem('token',response.data.data)
        setLoading(false);
      }

      // router.push('/dashboard')
    } catch (error: any) {
      ToastAtTopRight.fire({
        icon: "error",
        title: "Invalid credentials"
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="Email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="ml-auto w-full" type="submit">
            Sign In
          </Button>
        </form>
      </Form>
    </>
  );
}