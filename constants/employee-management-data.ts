// Define the User interface
interface User {
  id: number;
  name: string;
}

// Define the EmployeeManagement interface
export interface EmployeeManagement {
  sno: number;
  firstName: string;
  lastName: string;
  role: string;
  city?: string;
  address?: string;
  assignedUsers: User[]; // Array of user objects assigned to the employee
  contactInformation: {
    email: string;
    phone: string;
  };
}

// Sample data for the employee management system
export const EmployeeManagementData: EmployeeManagement[] = [
  {
    sno: 1,
    firstName: 'John',
    lastName: 'Doe',
    role: 'Manager',
    city: "Delhi",
    address:"Pro4living elite",
    assignedUsers: [
      { id: 1, name: 'Alice Johnson' },
      { id: 2, name: 'Bob Williams' },
      { id: 3, name: 'Charlie Brown' }
    ],
    contactInformation: {
      email: 'john.doe@example.com',
      phone: '123-456-7890'
    }
  },
  {
    sno: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'Support Staff',
    city: "Delhi",
    assignedUsers: [
      { id: 4, name: 'David Miller' },
      { id: 5, name: 'Eva Green' }
    ],
    contactInformation: {
      email: 'jane.smith@example.com',
      phone: '987-654-3210'
    },
    address:"Pro2living elite",

  },
  {
    sno: 3,
    firstName: 'Robert',
    lastName: 'Brown',
    role: 'Technician',
    city: "Kolkata",
    assignedUsers: [
      { id: 6, name: 'Fiona White' },
      { id: 7, name: 'George Black' },
      { id: 8, name: 'Hannah Blue' }
    ],
    contactInformation: {
      email: 'robert.brown@example.com',
      phone: '555-123-4567'
    },
    address:"Pro1living elite",

  },
  {
    sno: 4,
    firstName: 'Emily',
    lastName: 'Davis',
    role: 'Customer Service',
    city: "Delhi",
    assignedUsers: [
      { id: 9, name: 'Ian Yellow' },
      { id: 10, name: 'Jack Purple' }
    ],
    contactInformation: {
      email: 'emily.davis@example.com',
      phone: '444-555-6666'
    },
    address:"Pro5living elite",

  }
];
