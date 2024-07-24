export interface Subscription {
    id: number;
    subType: string;
    noOfBag: number;
    pricePercentageSeasonalVeggies: number;
    // Add other fields as necessary
  }
  
  export const SubscriptionData: Subscription[] = [
    { id: 1, subType: 'Trial', noOfBag: 1, pricePercentageSeasonalVeggies: 10 },
   
    // Add more sample data as needed
  ];
  