import { StaticImageData } from 'next/image';
import offer1 from '@/public/assets/offerr1.png';
import offer2 from '@/public/assets/offerr2.png';

export interface CouponManagement {
  sno: number;
  code: string;
  discountPrice: number;
  visibility: 'global' | 'subscription';
  subscriptionType?: {
    id: string;
    name: string;
  };
  subscriptionPrice?: number;
  netPrice?: number;
  startDate: Date | null;
  endDate: Date | null;
  description: string;
  image: StaticImageData; // Added image field
}

export const CouponManagementData: CouponManagement[] = [
  {
    sno: 1,
    code: 'WELCOME2024',
    discountPrice: 150,
    visibility: 'global',
    subscriptionType: undefined,
    subscriptionPrice: undefined,
    netPrice: undefined,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    description: 'Get a discount of $150 on your first purchase with the WELCOME2024 coupon. Valid for the entire year of 2024.',
    image: offer1 // Added image
  },
  {
    sno: 2,
    code: 'SUBSAVER',
    discountPrice: 200,
    visibility: 'subscription',
    subscriptionType: {
      id: '1',
      name: 'Staples'
    },
    subscriptionPrice: 1000,
    netPrice: 800,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-30'),
    description: 'Save $200 on the Staples subscription with the SUBSAVER coupon. Valid for the month of June 2024.',
    image: offer2 // Added image
  }
];
