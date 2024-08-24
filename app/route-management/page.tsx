import BreadCrumb from '@/components/breadcrumb';
import { CityForm } from '@/components/forms/city-stepper/create-city';
import { RouteForm } from '@/components/forms/route-stepper/create-route';
import MainLayout from '@/components/layout/main-layout';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [{ title: 'Complaint', link: '/dashboard/complaint' }];
export default function page() {
  return (
    <MainLayout meta={{ title: 'Create Route' }}>
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 min-h-screen p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <RouteForm/>
      </div>
    </ScrollArea>
    </MainLayout>
  );
}
