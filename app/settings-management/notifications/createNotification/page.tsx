import BreadCrumb from '@/components/breadcrumb';
import { ComplaintForm } from '@/components/forms/complaint-stepper/create-complaint';
import { CreateEmployeeForm } from '@/components/forms/employee-stepper/create-employee';
import { CreateNotificationForm } from '@/components/forms/notification-stepper/create-notification';
import MainLayout from '@/components/layout/main-layout';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [{ title: 'Notifications', link: '/notification' }];
export default function page() {
  // Example structure of user options
 const UserOptions = [
  { id: '1', name: 'Deepak singh',phoneNo:"8102224005" },
  { id: '2', name: 'Kartik singh' ,phoneNo:"8284459245"},
  { id: '3', name: 'Shivam kumar' ,phoneNo:"123456789"},
  { id: '4', name: 'Arya singh',phoneNo:"8438344658" },
];

  return (
    <MainLayout meta={{ title: 'Create Notification' }}>

    <ScrollArea className="h-full">
      <div className="flex-1 min-h-screen space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <CreateNotificationForm  initialData={null}  />
      </div>
    </ScrollArea>
    </MainLayout>
  );
}
