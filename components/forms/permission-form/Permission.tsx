'use client';

import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

type Role = 'member' | 'manager' | 'admin';

type ActionPermissions = {
  [K in Role]: boolean;
};

type ProductManagementPermissions = {
  createProduct: ActionPermissions;
  deleteProduct: ActionPermissions;
  viewProduct: ActionPermissions;
  editProduct: ActionPermissions;
};

type CustomerManagementPermissions = {
  createCustomer: ActionPermissions;
  deleteCustomer: ActionPermissions;
  viewCustomer: ActionPermissions;
  editCustomer: ActionPermissions;
};

type BagManagementPermissions = {
  createBag: ActionPermissions;
  deleteBag: ActionPermissions;
  viewBag: ActionPermissions;
  editBag: ActionPermissions;
};

type EmployeeManagementPermissions = {
  createEmployee: ActionPermissions;
  deleteEmployee: ActionPermissions;
  viewEmployee: ActionPermissions;
  editEmployee: ActionPermissions;
};

interface PermissionFormValues {
  permissions: {
    productManagement: ProductManagementPermissions;
    customerManagement: CustomerManagementPermissions;
    bagManagement: BagManagementPermissions;
    employeeManagement: EmployeeManagementPermissions;
  };
}

export const PermissionForm: React.FC = () => {
  const { control, handleSubmit } = useForm<PermissionFormValues>({
    defaultValues: {
      permissions: {
        productManagement: {
          createProduct: { member: false, manager: true, admin: true },
          deleteProduct: { member: false, manager: true, admin: true },
          viewProduct: { member: true, manager: true, admin: true },
          editProduct: { member: false, manager: true, admin: true },
        },
        customerManagement: {
          createCustomer: { member: false, manager: true, admin: true },
          deleteCustomer: { member: false, manager: true, admin: true },
          viewCustomer: { member: true, manager: true, admin: true },
          editCustomer: { member: false, manager: true, admin: true },
        },
        bagManagement: {
          createBag: { member: false, manager: true, admin: true },
          deleteBag: { member: false, manager: true, admin: true },
          viewBag: { member: true, manager: true, admin: true },
          editBag: { member: false, manager: true, admin: true },
        },
        employeeManagement: {
          createEmployee: { member: false, manager: true, admin: true },
          deleteEmployee: { member: false, manager: true, admin: true },
          viewEmployee: { member: true, manager: true, admin: true },
          editEmployee: { member: false, manager: true, admin: true },
        }
      }
    },
  });

  const onSubmit = (data: PermissionFormValues) => {
    console.log(data);
    // Handle form submission, like making an API call to save the data
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title="Permissions Settings"
          description="Manage Permissions Settings"
        />
      </div>
      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div  style={{border:"1px solid green"}} className=" p-2 space-y-4">
          <div className="font-bold text-2xl text-green-500  mt-2 ">Product Management</div>
          <div className="flex items-center">
            <div className="w-1/4 text-center"></div>
            <div className="w-1/4 text-center font-semibold">Member</div>
            <div className="w-1/4 text-center font-semibold">Manager</div>
            <div className="w-1/4 text-center font-semibold">Admin</div>
          </div>
          {(['createProduct', 'deleteProduct', 'viewProduct', 'editProduct'] as const).map((action) => (
            <div key={action} className="flex items-center">
              <div className="w-1/4 font-semibold">{action.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
              <div className="w-1/4 text-center">
                <Controller
                  control={control}
                  name={`permissions.productManagement.${action}.member`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      aria-label={`${action} Member`}
                    />
                  )}
                />
              </div>
              <div className="w-1/4 text-center">
                <Controller
                  control={control}
                  name={`permissions.productManagement.${action}.manager`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      aria-label={`${action} Manager`}
                    />
                  )}
                />
              </div>
              <div className="w-1/4 text-center">
                <Controller
                  control={control}
                  name={`permissions.productManagement.${action}.admin`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      aria-label={`${action} Admin`}
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div  style={{border:"1px solid green"}} className=" p-2 space-y-4">
          <div className="font-bold text-2xl text-green-500  mt-2 ">Customer Management</div>
          <div className="flex items-center">
            <div className="w-1/4 text-center"></div>
            <div className="w-1/4 text-center font-semibold">Member</div>
            <div className="w-1/4 text-center font-semibold">Manager</div>
            <div className="w-1/4 text-center font-semibold">Admin</div>
          </div>
          {(['createCustomer', 'deleteCustomer', 'viewCustomer', 'editCustomer'] as const).map((action) => (
            <div key={action} className="flex items-center">
              <div className="w-1/4 font-semibold">{action.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
              <div className="w-1/4 text-center">
                <Controller
                  control={control}
                  name={`permissions.customerManagement.${action}.member`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      aria-label={`${action} Member`}
                    />
                  )}
                />
              </div>
              <div className="w-1/4 text-center">
                <Controller
                  control={control}
                  name={`permissions.customerManagement.${action}.manager`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      aria-label={`${action} Manager`}
                    />
                  )}
                />
              </div>
              <div className="w-1/4 text-center">
                <Controller
                  control={control}
                  name={`permissions.customerManagement.${action}.admin`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      aria-label={`${action} Admin`}
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div  style={{border:"1px solid green"}} className=" p-2 space-y-4">
          <div className="font-bold text-2xl text-green-500  mt-2 ">Bag Management</div>
          <div className="flex items-center">
            <div className="w-1/4 text-center"></div>
            <div className="w-1/4 text-center font-semibold">Member</div>
            <div className="w-1/4 text-center font-semibold">Manager</div>
            <div className="w-1/4 text-center font-semibold">Admin</div>
          </div>
          {(['createBag', 'deleteBag', 'viewBag', 'editBag'] as const).map((action) => (
            <div key={action} className="flex items-center">
              <div className="w-1/4 font-semibold">{action.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
              <div className="w-1/4 text-center">
                <Controller
                  control={control}
                  name={`permissions.bagManagement.${action}.member`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      aria-label={`${action} Member`}
                    />
                  )}
                />
              </div>
              <div className="w-1/4 text-center">
                <Controller
                  control={control}
                  name={`permissions.bagManagement.${action}.manager`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      aria-label={`${action} Manager`}
                    />
                  )}
                />
              </div>
              <div className="w-1/4 text-center">
                <Controller
                  control={control}
                  name={`permissions.bagManagement.${action}.admin`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      aria-label={`${action} Admin`}
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div  style={{border:"1px solid green"}} className=" p-2 space-y-4">
          <div className="font-bold text-2xl text-green-500  mt-2 ">Employee Management</div>
          <div className="flex items-center">
            <div className="w-1/4 text-center"></div>
            <div className="w-1/4 text-center font-semibold">Member</div>
            <div className="w-1/4 text-center font-semibold">Manager</div>
            <div className="w-1/4 text-center font-semibold">Admin</div>
          </div>
          {(['createEmployee', 'deleteEmployee', 'viewEmployee', 'editEmployee'] as const).map((action) => (
            <div key={action} className="flex items-center">
              <div className="w-1/4 font-semibold">{action.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
              <div className="w-1/4 text-center">
                <Controller
                  control={control}
                  name={`permissions.employeeManagement.${action}.member`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      aria-label={`${action} Member`}
                    />
                  )}
                />
              </div>
              <div className="w-1/4 text-center">
                <Controller
                  control={control}
                  name={`permissions.employeeManagement.${action}.manager`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      aria-label={`${action} Manager`}
                    />
                  )}
                />
              </div>
              <div className="w-1/4 text-center">
                <Controller
                  control={control}
                  name={`permissions.employeeManagement.${action}.admin`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      aria-label={`${action} Admin`}
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <Button type="submit">Save Permissions</Button>
      </form>
    </>
  );
};

export default PermissionForm;
