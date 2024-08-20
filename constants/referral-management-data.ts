// Define the ReferralManagement interface
export interface ReferralManagement {
  id: number;
  couponCode: string;
  discountPercentage: number; // Assuming discount is in percentage
  startDate: Date;
  endDate: Date;
  status: 'Active' | 'Inactive';
}

// Sample data for the referral management system
export const ReferralManagementData: ReferralManagement[] = [
  {
    id: 1,
    couponCode: 'XWFERFEWRNFOW',
    discountPercentage: 15,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    status: 'Active'
  },
  {
    id: 2,
    couponCode: 'WEFVWFEWRNFOW',
    discountPercentage: 10,
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    status: 'Inactive'
  }
];
