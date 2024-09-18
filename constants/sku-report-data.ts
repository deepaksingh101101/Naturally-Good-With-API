
export interface ProductReportManagement {
  sno: number;
  productCode: string;
  productType: string;
  productGroup: string;
  season: string;
  productName: string;
  unitQuantity: number;
  totalQuantity: number;
  units: string;
  salesData: {
    date: string;
    quantitySold: number;
  }[];
}

export const ProductReportManagementData: ProductReportManagement[] = [
  {
    sno: 1,
    productCode: 'PRD01',
    productType: 'Staples',
    productGroup: 'Staples',
    season: 'All',
    productName: 'Rice (Basmati)',
    unitQuantity: 1000,
    totalQuantity: 5000,
    units: 'Gram',
    salesData: [
      { date: '15-May', quantitySold: 100 },
      { date: '16-May', quantitySold: 95 },
      { date: '17-May', quantitySold: 110 },
      { date: '18-May', quantitySold: 105 },
      { date: '19-May', quantitySold: 115 },
      { date: '20-May', quantitySold: 135 },
      { date: '21-MAY', quantitySold: 155 },
    ]
  },
  {
    sno: 2,
    productCode: 'PRD02',
    productType: 'Staples',
    productGroup: 'Staples',
    season: 'All',
    productName: 'Wheat (Whole)',
    unitQuantity: 1000,
    totalQuantity: 4800,
    units: 'Gram',
    salesData: [
      { date: '15-May', quantitySold: 90 },
      { date: '16-May', quantitySold: 85 },
      { date: '17-May', quantitySold: 100 },
      { date: '18-May', quantitySold: 95 },
      { date: '19-May', quantitySold: 105 },
      { date: '20-May', quantitySold: 135 },
      { date: '21-MAY', quantitySold: 155 },
    ]
  },
  {
    sno: 3,
    productCode: 'PRD03',
    productType: 'Staples',
    productGroup: 'Staples',
    season: 'All',
    productName: 'Lentils (Masoor)',
    unitQuantity: 1000,
    totalQuantity: 3200,
    units: 'Gram',
    salesData: [
      { date: '15-May', quantitySold: 70 },
      { date: '16-May', quantitySold: 75 },
      { date: '17-May', quantitySold: 80 },
      { date: '18-May', quantitySold: 85 },
      { date: '19-May', quantitySold: 90 },
      { date: '20-May', quantitySold: 135 },
      { date: '21-MAY', quantitySold: 155 },
    ]
  }
];
