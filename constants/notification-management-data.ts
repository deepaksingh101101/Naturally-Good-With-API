import { StaticImageData } from "next/image";
import image1 from '@/public/assets/offerr1.png'
// Define the Notification interface
export interface Notification {
  id: number;
  image: StaticImageData;
  heading: string;
  description: string;
  type:string;
}

// Sample data for the notification system
export const NotificationData: Notification[] = [
  {
    id: 1,
    image:image1 ,
    heading: 'System Maintenance',
    description: 'The system will be down for maintenance on 24th March 2024 from 12:00 AM to 4:00 AM.',
    type:"System"
  },
  {
    id: 2,
    image: image1,
    heading: 'New Feature Release',
    type:"Feature",
    description: 'We are excited to announce a new feature in our platform. Check it out now!'
  },
  {
    id: 3,
    image: image1,
    heading: 'Weekly Report',
    type:"Remainder",
    description: 'Your weekly report is now available. Please review it at your earliest convenience.'
  },
  {
    id: 4,
    image: image1,
    heading: 'Meeting Reminder',
    type:"Remainder",
    description: 'Reminder: You have a meeting scheduled with the team tomorrow at 10:00 AM.'
  },
  {
    id: 5,
    image: image1,
    heading: 'Security Alert',
    type:"Alert",
    description: 'A security alert was triggered. Please verify your account activity.'
  }
];
