import { format, parseISO } from 'date-fns';
import { NavItem } from '@/types';
import { string } from 'zod';

export type UserSnapshot = {
  sno: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  totalDeliveries: number;
  remainingDeliveries: number;
  lastSubscription: string; // You can format this date if needed
  lastDelivery: string; // You can format this date if needed
  additionalDays: number;
  currentDayDelivery: string;
  lastDayDelivery: string;
  subscribedSince: string; // You can format this date if needed
  totalRevenue: number;
};


// Helper function to format dates
const formatDate = (dateString: string) => {
  return format(parseISO(dateString), 'dd MMM yyyy');
};

export const userSnapshotData: UserSnapshot[] = [
  {
    sno: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    totalDeliveries: 50,
    remainingDeliveries: 10,
    lastSubscription: formatDate('2023-08-15'),
    lastDelivery: formatDate('2023-08-20'),
    additionalDays: 2,
    currentDayDelivery: "Monday",
    lastDayDelivery: "Wednesday",
    subscribedSince: formatDate('2023-01-01'),
    totalRevenue: 5000,
  },
  {
    sno: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    totalDeliveries: 40,
    remainingDeliveries: 5,
    lastSubscription: formatDate('2023-07-10'),
    lastDelivery: formatDate('2023-07-15'),
    additionalDays: 1,
    currentDayDelivery: "Friday",
    lastDayDelivery: "Wednesday",
    subscribedSince: formatDate('2022-12-01'),
    totalRevenue: 4000,
  },
  {
    sno: 3,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    totalDeliveries: 40,
    remainingDeliveries: 5,
    lastSubscription: formatDate('2023-07-10'),
    lastDelivery: formatDate('2023-07-15'),
    additionalDays: 1,
    currentDayDelivery: "Friday",
    lastDayDelivery: "Wednesday",
    subscribedSince: formatDate('2022-12-01'),
    totalRevenue: 4000,
  },
  {
    sno: 4,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    totalDeliveries: 40,
    remainingDeliveries: 5,
    lastSubscription: formatDate('2023-07-10'),
    lastDelivery: formatDate('2023-07-15'),
    additionalDays: 1,
    currentDayDelivery: "Friday",
    lastDayDelivery: "Wednesday",
    subscribedSince: formatDate('2022-12-01'),
    totalRevenue: 4000,
  },
  {
    sno: 5,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    totalDeliveries: 40,
    remainingDeliveries: 5,
    lastSubscription: formatDate('2023-07-10'),
    lastDelivery: formatDate('2023-07-15'),
    additionalDays: 1,
    currentDayDelivery: "Friday",
    lastDayDelivery: "Wednesday",
    subscribedSince: formatDate('2022-12-01'),
    totalRevenue: 4000,
  },
  {
    sno: 6,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    totalDeliveries: 40,
    remainingDeliveries: 5,
    lastSubscription: formatDate('2023-07-10'),
    lastDelivery: formatDate('2023-07-15'),
    additionalDays: 1,
    currentDayDelivery: "Friday",
    lastDayDelivery: "Wednesday",
    subscribedSince: formatDate('2022-12-01'),
    totalRevenue: 4000,
  },
  {
    sno: 7,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    totalDeliveries: 40,
    remainingDeliveries: 5,
    lastSubscription: formatDate('2023-07-10'),
    lastDelivery: formatDate('2023-07-15'),
    additionalDays: 1,
    currentDayDelivery: "Friday",
    lastDayDelivery: "Wednesday",
    subscribedSince: formatDate('2022-12-01'),
    totalRevenue: 4000,
  },
  {
    sno: 8,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    totalDeliveries: 40,
    remainingDeliveries: 5,
    lastSubscription: formatDate('2023-07-10'),
    lastDelivery: formatDate('2023-07-15'),
    additionalDays: 1,
    currentDayDelivery: "Friday",
    lastDayDelivery: "Wednesday",
    subscribedSince: formatDate('2022-12-01'),
    totalRevenue: 4000,
  },
  {
    sno: 9,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    totalDeliveries: 40,
    remainingDeliveries: 5,
    lastSubscription: formatDate('2023-07-10'),
    lastDelivery: formatDate('2023-07-15'),
    additionalDays: 1,
    currentDayDelivery: "Friday",
    lastDayDelivery: "Wednesday",
    subscribedSince: formatDate('2022-12-01'),
    totalRevenue: 4000,
  },
  {
    sno: 10,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    totalDeliveries: 40,
    remainingDeliveries: 5,
    lastSubscription: formatDate('2023-07-10'),
    lastDelivery: formatDate('2023-07-15'),
    additionalDays: 1,
    currentDayDelivery: "Friday",
    lastDayDelivery: "Wednesday",
    subscribedSince: formatDate('2022-12-01'),
    totalRevenue: 4000,
  },
  // Add more user data as needed
];

