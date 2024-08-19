'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { Trash2Icon } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Select from 'react-select';

const initialData = [
  { id: uuidv4(), city: 'City A', routes: [{ name: 'Route 1', taggedEmployee: "Deepak Singh", zipCodes: ['10001', '10002'] }] },
  { id: uuidv4(), city: 'City B', routes: [{ name: 'Route 4', taggedEmployee: "Kartik Singh", zipCodes: ['20001', '20002'] }] },
  { id: uuidv4(), city: 'City C', routes: [{ name: 'Route 7', taggedEmployee: "Arya Singh", zipCodes: ['30001', '30002'] }] },
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
          ? { ...city, routes: [...city.routes, { name: name.trim(), taggedEmployee: taggedEmployee.trim(), zipCodes: [] }] }
          : city
      ));
      // Clear the newRoutes fields for this city
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

  const handleEmployeeChange = (cityId: string, routeName: string, selectedOption: any) => {
    const selectedEmployee = selectedOption ? selectedOption.label.split(' - ')[0] : '';
    setNewRoutes(prevRoutes => ({
      ...prevRoutes,
      [cityId]: {
        ...prevRoutes[cityId],
        taggedEmployee: selectedEmployee
      }
    }));
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
              <AccordionTrigger className='bg-green-600 px-3  rounded-t-md mt-3' >
                <div className="flex w-full justify-between items-center">
                  <span className='text-white' >{city.city}</span>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteCity(city.id)}>Delete City</Button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {city.routes.map(route => (
                  <div style={{border:"1px solid green"}} key={route.name} className=" p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{route.name} (Driver: {route.taggedEmployee})</h4>
                      <Trash2Icon className='text-red-500 cursor-pointer' onClick={() => handleDeleteRoute(city.id, route.name)} />
                    </div>
                    <table className="min-w-full bg-white border rounded-md">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 border text-left">Zip Code</th>
                          <th className="px-4 py-2 border text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {route.zipCodes.map(zipCode => (
                          <tr key={zipCode} className="border-b">
                            <td className="px-4 py-2 border">{zipCode}</td>
                            <td className="px-4 py-2 border">
                              <Trash2Icon className='text-red-500 cursor-pointer' onClick={() => handleDeleteZipCode(city.id, route.name, zipCode)} />
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="px-4 py-2 border">
                            <Input
                              value={newZipCodes[route.name] || ''}
                              onChange={(e) => setNewZipCodes({ ...newZipCodes, [route.name]: e.target.value })}
                              placeholder={`Add zip code to ${route.name}`}
                              className="mr-2"
                            />
                          </td>
                          <td className="px-4 py-2 border">
                            <Button onClick={() => handleAddZipCode(city.id, route.name)} disabled={!newZipCodes[route.name]}>Add Zip Code</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
                <div style={{border:"1px solid green"}} className="flex p-3 flex-col space-y-2 mb-4 ">
                  <Input
                    value={newRoutes[city.id]?.name || ''}
                    onChange={(e) => setNewRoutes({ ...newRoutes, [city.id]: { ...newRoutes[city.id], name: e.target.value } })}
                    placeholder={`Add new route to ${city.city}`}
                    className="mr-2"
                  />
         <Select
  options={employees}
  getOptionLabel={(option) => `${option.label}`}
  getOptionValue={(option) => option.value}
  onChange={(selected) => handleEmployeeChange(city.id, newRoutes[city.id]?.name || '', selected)}
  placeholder="Tag a driver (search by name or phone)"
  className="mr-2"
/>

<Button className='min-w-32' onClick={() => handleAddRoute(city.id)} disabled={!newRoutes[city.id]?.name || !newRoutes[city.id]?.taggedEmployee}>Add Route</Button>
   </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};
