// app/dashboard/user-management/page.tsx
import BreadCrumb from '@/components/breadcrumb';
import { IsHavePermission } from '@/components/IsHavePermission';
import MainLayout from '@/components/layout/main-layout';
import ProtectedRoute from '@/components/layout/protected-route';
import { ProductManagementClient } from '@/components/tables/product-management-tables/client';
import { SubscriptionManagementClient } from '@/components/tables/subscription-management-tables/client';

const breadcrumbItems = [{ title: 'Item Management', link: '/dashboard/product-management' }];

export default function ProductManagementPage() {
  return (
    <ProtectedRoute>
      {/* <IsHavePermission requiredRoute="/product-management"> */}
      <MainLayout meta={{ title: 'Item Management' }}>
      <div className="flex-1 space-y-4 min-h-screen p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <ProductManagementClient  />
      </div>
    </MainLayout>
      {/* </IsHavePermission> */}
    </ProtectedRoute>
   
  );
}

