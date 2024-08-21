'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { Trash2Icon, EditIcon, PlusIcon, Edit } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Select from 'react-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Controller } from 'react-hook-form';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/MultiSelect';

const initialData = [
  {
    id: uuidv4(),
    city: 'Gurgaon',
    routes: [
      {
        name: 'Route 99',
        taggedVehical: { name: "Dipankar", classification: "External" },
        zones: [
          {
            name: 'Central Gurgaon',
            Serviced: true,
            deliverySequence: 1,
            deliveryCost: 200,
            sortOrder: 1,
            sectorLocality: [
              { name: "Adarsh Nagar", serviced: true },
              { name: "Ashok Vihar", serviced: true }
            ]
          },
          {
            name: 'New Gurgaon',
            Serviced: true,
            deliverySequence: 2,
            deliveryCost: 300,
            sortOrder: 1,
            sectorLocality: [
              { name: "Adarsh Nagar", serviced: true },
              { name: "Ashok Vihar", serviced: true }
            ]
          },
          {
            name: 'Old Gurgaon',
            Serviced: true,
            deliverySequence: 3,
            deliveryCost: 250,
            sortOrder: 1,
            sectorLocality: [
              { name: "Adarsh Nagar", serviced: true },
              { name: "Ashok Vihar", serviced: true }
            ]
          }
        ],
        isActive: true,
        activeDays: ['Wednesday', "Thursday"]
      }
    ]
  },
  {
    id: uuidv4(),
    city: 'Delhi',
    routes: [
      {
        name: 'Route 100',
        taggedVehical: { name: "EV1", classification: "Self" },
        zones: [
          {
            name: 'North Delhi',
            Serviced: true,
            deliverySequence: 1,
            deliveryCost: 300,
            sortOrder: 1,
            sectorLocality: [
              { name: "AzadNagar", serviced: true },
              { name: "Lodhi Colony", serviced: true }
            ]
          },
        ],
        isActive: true,
        activeDays: ['WED', "SAT"]
      }
    ]
  },
  {
    id: uuidv4(),
    city: 'Noida',
    routes: [
      {
        name: 'Route 101',
        taggedVehical: { name: "EV2", classification: "Self" },
        zones: [
          {
            name: 'Greater Noida',
            Serviced: true,
            deliverySequence: 1,
            deliveryCost: 400,
            sortOrder: 1,
            sectorLocality: [
              { name: "Civil Lines", serviced: true },
              { name: "Ashok Vihar", serviced: true }
            ]
          }
        ],
        isActive: true,
        activeDays: ['WED', "SAT"]
      }
    ]
  }
];

const employees = [
  { value: 'deepak-singh', label: 'Deepak Singh - 1234567890', phoneNumber: '1234567890' },
  { value: 'kartik-singh', label: 'Kartik Singh - 0987654321', phoneNumber: '0987654321' },
  { value: 'arya-singh', label: 'Arya Singh - 1122334455', phoneNumber: '1122334455' }
];

export const RoutesForm: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [newCity, setNewCity] = useState('');
  const [newRoutes, setNewRoutes] = useState<{ [key: string]: { name: string; taggedVehical: string; classification: string } }>({});
  const [newzones, setNewzones] = useState<{ [key: string]: { name: string, deliveryCost: number, deliverySequence: number } }>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addRouteModalOpen, setAddRouteModalOpen] = useState(false);  // Added for new route modal
  const [selectedRoute, setSelectedRoute] = useState<{ cityId: string; routeName: string } | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [editedRouteName, setEditedRouteName] = useState('');
  
  // States for the Add Route Modal
  const [newRouteName, setNewRouteName] = useState('');
  const [newTaggedVehicle, setNewTaggedVehicle] = useState('');
  const [newClassification, setNewClassification] = useState('');

  const handleAddCity = () => {
    if (newCity.trim()) {
      setData([...data, { id: uuidv4(), city: newCity.trim(), routes: [] }]);
      setNewCity('');
    }
  };

  interface Option {
    id: string;
    name: string;
  }
  
  const deliveryDaysOptions: Option[] = [
    { id: 'Monday', name: 'Monday' },
    { id: 'Tuesday', name: 'Tuesday' },
    { id: 'Wednesday', name: 'Wednesday' },
    { id: 'Thursday', name: 'Thursday' },
    { id: 'Friday', name: 'Friday' },
    { id: 'Saturday', name: 'Saturday' },
    { id: 'Sunday', name: 'Sunday' },
    // Add other options here
  ];

  
  const handleAddZone = (cityId: string, routeName: string) => {
    const newZone = newzones[routeName];
    if (newZone?.name?.trim()) {
      setData(data.map(city =>
        city.id === cityId
          ? {
            ...city,
            routes: city.routes.map(route =>
              route.name === routeName
                ? {
                    ...route,
                    zones: [
                      ...route.zones,
                      {
                        name: newZone.name.trim(),
                        Serviced: true,
                        deliverySequence: newZone.deliverySequence || 1,
                        deliveryCost: newZone.deliveryCost || 100,
                        sortOrder: 1,
                        sectorLocality: []
                      }
                    ]
                  }
                : route
            ),
          }
          : city
      ));
      setNewzones({ ...newzones, [routeName]: { name: '', deliveryCost: 0, deliverySequence: 1 } });
    }
  };


  const openAddRouteModal = (cityId: string) => {
    setSelectedRoute({ cityId, routeName: '' });
    setNewRouteName('');
    setNewTaggedVehicle('');
    setNewClassification('');
    setAddRouteModalOpen(true);
  };
  
  const handleAddRouteFromModal = () => {
    if (selectedRoute && selectedRoute.cityId && newRouteName.trim() && selectedVehicleType ) {
      const newRoute = {
        name: newRouteName.trim(),
        taggedVehical: {
          name: selectedVehicleType.label,
          classification: 'Self'
        },
        zones: [],
        isActive: true,
        activeDays:selectedDeliveryDays||[] // Initialize activeDays as needed
        
      };
  
      setData(data.map(city =>
        city.id === selectedRoute.cityId
          ? {
              ...city,
              routes: [...city.routes, newRoute]
            }
          : city
      ));
  
      // Reset modal state
      setNewRouteName('');
      setNewTaggedVehicle('');
      setNewClassification('');
      setAddRouteModalOpen(false);
    } else {
      console.log('Missing information or no selected route');
    }
  };
  
  
  

  const handleDeleteCity = (cityId: string) => {
    setData(data.filter(city => city.id !== cityId));
  };

  const handleDeleteRoute = (cityId: string, routeName: string) => {
    setData(data.map(city =>
      city.id === cityId
        ? { ...city, routes: city.routes.filter(route => route.name !== routeName) }
        : city
    ));
  };

  const handleDeleteZone = (cityId: string, routeName: string, zoneName: string) => {
    setData(data.map(city =>
      city.id === cityId
        ? {
          ...city,
          routes: city.routes.map(route =>
            route.name === routeName
              ? { ...route, zones: route.zones.filter(zone => zone.name !== zoneName) }
              : route
          ),
        }
        : city
    ));
  };

  const handleToggleRoute = (cityId: string, routeName: string) => {
    setData(data.map(city =>
      city.id === cityId
        ? {
          ...city,
          routes: city.routes.map(route =>
            route.name === routeName
              ? { ...route, isActive: !route.isActive }
              : route
          ),
        }
        : city
    ));
  };

  


  const vehicleTypes = [
    { value: 'ev1', label: 'Ev1' },
    { value: 'ev2', label: 'Ev2' },
    { value: 'dipankar', label: 'Dipankar' }
  ];

  const ClassificationTypes = [
    { value: 'external', label: 'External' },
    { value: 'self', label: 'Self' }
  ];
   // States for the Add Route Modal
   const [selectedVehicleType, setSelectedVehicleType] = useState<any>(null);
   const [selectedClassificationType, setSelectedClassificationType] = useState<any>(null);
   
   // States for CRUD vehicle types
   const [vehicleTypeModalOpen, setVehicleTypeModalOpen] = useState(false);
   const [classificationTypeModalOpen, setClassificationTypeModalOpen] = useState(false);
   const [newVehicleType, setNewVehicleType] = useState('');
   const [newClassificationType, setNewClassificationType] = useState('');
 
   const openEditModal = (cityId: string, routeName: string) => {
    const city = data.find(city => city.id === cityId);
    const route = city?.routes.find(route => route.name === routeName);
    
    setSelectedRoute({ cityId, routeName });
    
    const taggedVehicalName = route?.taggedVehical?.name || '';
    
    setSelectedEmployee(employees.find(emp => emp.label.includes(taggedVehicalName)));
    
    setEditedRouteName(route?.name || '');
    setEditModalOpen(true);
  };

  const handleSaveEditedEmployee = () => {
    if (selectedRoute && selectedEmployee) {
      setData(data.map(city =>
        city.id === selectedRoute.cityId
          ? {
            ...city,
            routes: city.routes.map(route =>
              route.name === selectedRoute.routeName
                ? { ...route, name: editedRouteName, taggedVehical: { name: selectedEmployee.label.split(' - ')[0], classification: route.taggedVehical.classification } }
                : route
            ),
          }
          : city
      ));
      setEditModalOpen(false);
    }
  };

  const handleAddVehicleType = () => {
    if (newVehicleType.trim()) {
      const newVehicle = { value: newVehicleType.trim().toLowerCase().replace(/\s+/g, '-'), label: newVehicleType.trim() };
      vehicleTypes.push(newVehicle);
      setVehicleTypeModalOpen(false);
      setNewVehicleType('');
    }
  };
  const handleAddClassificationType = () => {
    if (newClassificationType.trim()) {
      const newClassification = { value: newClassificationType.trim().toLowerCase().replace(/\s+/g, '-'), label: newClassificationType.trim() };
      ClassificationTypes.push(newClassification);
      setClassificationTypeModalOpen(false);
      setNewClassificationType('');
    }
  };

  const [selectedDeliveryDays, setSelectedDeliveryDays] = useState<string[]>([]);


  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title="Routes Settings"
          description="Manage Routes and Zones"
        />
      </div>
      <Separator />
      <div className="my-4 flex justify-between px-3  ">
  <Input
    value={newCity}
    onChange={(e) => setNewCity(e.target.value)}
    placeholder="Add new city"
    className="mr-2"
  />
  <Button className='min-w-32' onClick={handleAddCity}>Add City</Button>
</div>

<div style={{ border: "" }} className="">
  <Accordion type="single" collapsible>
    {data.map((city) => (
      <AccordionItem key={city.id} value={city.id}>
        <AccordionTrigger className="text-lg font-semibold bg-green-600  px-2 rounded-t-lg text-white ">
          <div className="flex justify-between w-full">
          <span>{city.city}</span>
          <div className="flex">
          <span className="">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteCity(city.id)}
              className="ml-auto"
            >
             <span> Delete City</span>
              <Trash2Icon className="h-4 w-4 ms-2" />
            </Button>
            </span>
            <Button size="sm" onClick={() => openAddRouteModal(city.id)} className="bg-blue-500 ms-2 text-white px-2 rounded hover:bg-blue-600">
  <PlusIcon /> Add Route
</Button>

  </div>
          </div>
          </AccordionTrigger>
        <AccordionContent>
          <div className=" flex items-center justify-center">
          <div className="flex w-full">

                          
            </div>
          </div>
          
          {/* Routes Table */}
          <div className="">
            <table className="w-full text-left table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border border-gray-300">Route Name</th>
                  <th className="p-2 border border-gray-300">Tagged Vehicle</th>
                  <th className="p-2 border border-gray-300">Days</th>
                  <th className="p-2 border border-gray-300 text-center ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {city.routes.map(route => (
                  <tr key={route.name} className="bg-white hover:bg-gray-100">
                    <td className="p-2 border border-gray-300">
                      <strong className="text-lg">{route.name}</strong>
                    </td>
                    <td className="p-2 border border-gray-300">
                      <em>{route.taggedVehical.name} ({route.taggedVehical.classification})</em>
                    </td>
                    <td className="p-2 border border-gray-300">
                      {route.activeDays.join(', ')}
                    </td>
                    <td className="p-2 border border-gray-300 flex items-center justify-center space-x-2">
                      <Button variant="outline" size="sm" className="border-gray-300 bg-yellow-500  text-white rounded" >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-300 bg-red-600  text-white rounded" onClick={() => handleDeleteRoute(city.id, route.name)}>
                        <Trash2Icon className=" h-4 w-4" />
                      </Button>
                      <Switch checked={route.isActive} onCheckedChange={() => handleToggleRoute(city.id, route.name)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Zones Section */}
          {city.routes.map(route => (
            <div key={route.name} className="mt-4">
              <div className="flex items-center mb-3">
              <Input
    value={newzones[route.name]?.name || ''}
    onChange={(e) => setNewzones({ ...newzones, [route.name]: { ...newzones[route.name], name: e.target.value } })}
    placeholder="Zone name"
    className="mr-2 w-1/4 border-gray-300 rounded"
  />
  <Input
    value={newzones[route.name]?.deliveryCost || ''}
    onChange={(e) => setNewzones({ ...newzones, [route.name]: { ...newzones[route.name], deliveryCost: Number(e.target.value) } })}
    placeholder="Delivery Cost"
    type="number"
    className="mr-2 w-1/4 border-gray-300 rounded"
  />
  <Input
    value={newzones[route.name]?.deliverySequence || ''}
    onChange={(e) => setNewzones({ ...newzones, [route.name]: { ...newzones[route.name], deliverySequence: Number(e.target.value) } })}
    placeholder="Delivery Sequence"
    type="number"
    className="mr-2 w-1/4 border-gray-300 rounded"
  />
   <Button onClick={() => handleAddZone(city.id, route.name)} className="bg-green-500 text-white px-4 py-2 w-1/4  rounded hover:bg-green-600">
    Add Zone
  </Button>
              </div>

              {/* Zones Table */}
              <table className="w-full text-left table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border border-gray-300">Zone Name</th>
                    <th className="p-2 border border-gray-300">Delivery Cost</th>
                    <th className="p-2 border border-gray-300">Delivery Sequence</th>
                    <th className="p-2 border border-gray-300">Serviceable</th>
                    <th className="p-2 border border-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {route.zones.map(zone => (
                    <tr key={zone.name} className="bg-white hover:bg-gray-100">
                      <td className="p-2 border border-gray-300">{zone.name}</td>
                      <td className="p-2 border border-gray-300">{zone.deliveryCost}</td>
                      <td className="p-2 border border-gray-300">{zone.deliverySequence}</td>
                      <td className='p-2 border border-gray-300' >
  <span className={`px-2 py-1 rounded-md ${zone.Serviced ? 'bg-green-500' : 'bg-red-500'}`} >{zone.Serviced ? 'Serviced' : 'Not Serviced'}</span>
</td>
                      <td className="p-2 border border-gray-300">
                      <Button variant="outline" size="sm" className="border-gray-300 bg-yellow-500 hover:bg-yellow-600  hover:text-white text-white rounded">
                        <EditIcon className="h-4 w-4" />
                      </Button>
                        <Button variant="outline" size="sm" className="border-gray-300 ms-2 bg-red-500 hover:bg-red-600 hover:text-white text-white rounded" onClick={() => handleDeleteZone(city.id, route.name, zone.name)}>
                          <Trash2Icon className="  h-4 w-4" />
                          
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</div>




      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>Edit the details of the route.</DialogDescription>
          </DialogHeader>
          <div className="my-2">
            <Input
              value={editedRouteName}
              onChange={(e) => setEditedRouteName(e.target.value)}
              placeholder="Route Name"
              className="mb-2"
            />
            <Select
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              options={employees}
            />
           
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEditedEmployee}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal for routes adding route */}
      <Dialog open={addRouteModalOpen} onOpenChange={setAddRouteModalOpen}>
  <DialogContent className='max-w-lg' >
    <DialogHeader>
      <DialogTitle>Add New Route</DialogTitle>
      <DialogDescription>
        Add a new route for the selected city.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4">
      <Input
        value={newRouteName}
        onChange={(e) => setNewRouteName(e.target.value)}
        placeholder="Route Name"
      />
      <div className="flex w-full">
      <Select
        options={vehicleTypes}
        value={selectedVehicleType}
        onChange={setSelectedVehicleType}
        placeholder="Select Vehicle Type"
        className='w-full'
      />
      </div>
  
        {/* <div className="flex w-full">
      <Select
        options={ClassificationTypes}
        value={selectedClassificationType}
        onChange={setSelectedClassificationType}
        placeholder="Select Classification Type"
        className='w-full'
      />
      </div> */}

      <MultiSelect
  value={selectedDeliveryDays}
  onChange={(value: string[]) => setSelectedDeliveryDays(value)}
  options={deliveryDaysOptions}
  placeholder="Select Delivery Days"
/>


      <Button
        type="button"
        onClick={handleAddRouteFromModal}
        className="bg-blue-500 text-white"
      >
        Add Route
      </Button>
      <div className="space-y-2">
  {data.map((city) =>
    city.routes.map((route) => (
      <div key={route.name} className="flex justify-between items-center">
        <span>{route.name}</span>
        <Button
          variant="destructive"
          onClick={() => handleDeleteRoute(city.id, route.name)}
        >
          Delete
        </Button>
      </div>
    ))
  )}
</div>

    </div>
    
  </DialogContent>
</Dialog>

    </>
  );
};

export default RoutesForm;
