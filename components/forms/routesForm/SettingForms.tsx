'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { Trash2Icon, EditIcon } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Select from 'react-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const initialData = [
  { id: uuidv4(), city: 'City A', routes: [{ name: 'Route 1', taggedEmployee: "Deepak Singh", zipCodes: ['10001', '10002'], isActive: true }] },
  { id: uuidv4(), city: 'City B', routes: [{ name: 'Route 4', taggedEmployee: "Kartik Singh", zipCodes: ['20001', '20002'], isActive: true }] },
  { id: uuidv4(), city: 'City C', routes: [{ name: 'Route 7', taggedEmployee: "Arya Singh", zipCodes: ['30001', '30002'], isActive: false }] },
];

const employees = [
  { value: 'deepak-singh', label: 'Deepak Singh - 1234567890', phoneNumber: '1234567890' },
  { value: 'kartik-singh', label: 'Kartik Singh - 0987654321', phoneNumber: '0987654321' },
  { value: 'arya-singh', label: 'Arya Singh - 1122334455', phoneNumber: '1122334455' }
  // Add more employees as needed
];

export const RoutesForm: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [newCity, setNewCity] = useState('');
  const [newRoutes, setNewRoutes] = useState<{ [key: string]: { name: string; taggedEmployee: string } }>({});
  const [newZipCodes, setNewZipCodes] = useState<{ [key: string]: string }>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<{ cityId: string; routeName: string } | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [editedRouteName, setEditedRouteName] = useState('');

  const handleAddCity = () => {
    if (newCity.trim()) {
      setData([...data, { id: uuidv4(), city: newCity.trim(), routes: [] }]);
      setNewCity('');
    }
  };

  const handleAddRoute = (cityId: string) => {
    const { name, taggedEmployee } = newRoutes[cityId] || {};
    if (name?.trim() && taggedEmployee?.trim()) {
      setData(data.map(city =>
        city.id === cityId
          ? { ...city, routes: [...city.routes, { name: name.trim(), taggedEmployee: taggedEmployee.trim(), zipCodes: [], isActive: true }] }
          : city
      ));
      setNewRoutes({ ...newRoutes, [cityId]: { name: '', taggedEmployee: '' } });
    }
  };

  const handleAddZipCode = (cityId: string, routeName: string) => {
    if (newZipCodes[routeName]?.trim()) {
      setData(data.map(city =>
        city.id === cityId
          ? {
            ...city,
            routes: city.routes.map(route =>
              route.name === routeName
                ? { ...route, zipCodes: [...route.zipCodes, newZipCodes[routeName].trim()] }
                : route
            ),
          }
          : city
      ));
      setNewZipCodes({ ...newZipCodes, [routeName]: '' });
    }
  };

  const handleEmployeeChange = (cityId: string, routeName: string, selectedOption: any) => {
    const selectedEmployee = selectedOption ? selectedOption.label.split(' - ')[0] : '';
    setData(prevData =>
      prevData.map(city =>
        city.id === cityId
          ? {
              ...city,
              routes: city.routes.map(route =>
                route.name === routeName
                  ? { ...route, taggedEmployee: selectedEmployee }
                  : route
              ),
            }
          : city
      )
    );
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

  const handleDeleteZipCode = (cityId: string, routeName: string, zipCode: string) => {
    setData(data.map(city =>
      city.id === cityId
        ? {
          ...city,
          routes: city.routes.map(route =>
            route.name === routeName
              ? { ...route, zipCodes: route.zipCodes.filter(z => z !== zipCode) }
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

  const openEditModal = (cityId: string, routeName: string) => {
    const city = data.find(city => city.id === cityId);
    const route = city?.routes.find(route => route.name === routeName);
    setSelectedRoute({ cityId, routeName });
    setSelectedEmployee(employees.find(emp => emp.label.includes(route?.taggedEmployee || '')));
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
                ? { ...route, name: editedRouteName, taggedEmployee: selectedEmployee.label.split(' - ')[0] }
                : route
            ),
          }
          : city
      ));
      setEditModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title="Routes Settings"
          description="Manage Routes and Zip Codes"
        />
      </div>
      <Separator />
      <div className="my-4 flex justify-between px-3">
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
              <AccordionTrigger className='bg-green-600 px-3 rounded-t-md mt-3'>
                <div className="flex w-full justify-between items-center">
                  <span className='text-white'>{city.city}</span>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteCity(city.id)}>Delete City</Button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {city.routes.map(route => (
                  <div style={{border:"1px solid green"}} key={route.name} className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{route.name} (Driver: {route.taggedEmployee})</h4>
                      <div className="flex items-center space-x-2">
                        <Switch checked={route.isActive} onCheckedChange={() => handleToggleRoute(city.id, route.name)} />
                        <span>{route.isActive ? 'Active' : 'Inactive'}</span>
                        <EditIcon className='text-blue-500 cursor-pointer' onClick={() => openEditModal(city.id, route.name)} />
                        <Trash2Icon className='text-red-500 cursor-pointer' onClick={() => handleDeleteRoute(city.id, route.name)} />
                      </div>
                    </div>
                    <table className="min-w-full bg-white border rounded-md">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 border text-left">Zip Codes</th>
                          {/* <th className="px-4 py-2 border"></th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {route.zipCodes.map(zipCode => (
                          <tr key={zipCode}>
                            <td className="px-4 py-2 border">{zipCode}</td>
                            <td className="px-4 py-2 border text-right">
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteZipCode(city.id, route.name, zipCode)}>Delete</Button>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="px-4 py-2 border">
                            <Input
                              value={newZipCodes[route.name] || ''}
                              onChange={(e) => setNewZipCodes({ ...newZipCodes, [route.name]: e.target.value })}
                              placeholder="Add new zip code"
                              className="w-full"
                            />
                          </td>
                          <td className="px-4 py-2 border text-right">
                            <Button onClick={() => handleAddZipCode(city.id, route.name)}>Add Zip Code</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
                <div style={{border:"1px solid green"}} className="mb-4 flex justify-between flex-col px-3">
                  <Input
                    value={newRoutes[city.id]?.name || ''}
                    onChange={(e) => setNewRoutes({ ...newRoutes, [city.id]: { ...newRoutes[city.id], name: e.target.value } })}
                    placeholder="Add new route"
                    className="mr-2 w-full my-1"
                  />
                  <Select
                    value={employees.find(emp => emp.value === newRoutes[city.id]?.taggedEmployee)}
                    onChange={(selectedOption) => setNewRoutes({ ...newRoutes, [city.id]: { ...newRoutes[city.id], taggedEmployee: selectedOption?.value || '' } })}
                    options={employees}
                    placeholder="Select Employee"
                    isClearable
                    className="mr-2 w-full my-1"
                  />
                  <Button className='w-full my-1'  onClick={() => handleAddRoute(city.id)}>Add Route</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg min-h-80">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Modify the employee assignment and route name.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              value={editedRouteName}
              onChange={(e) => setEditedRouteName(e.target.value)}
              placeholder="Edit route name"
              className="mr-2"
            />
            <Select
              value={selectedEmployee}
              onChange={(selectedOption) => setSelectedEmployee(selectedOption)}
              options={employees}
              placeholder="Select Employee"
              isClearable
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEditedEmployee}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoutesForm;
