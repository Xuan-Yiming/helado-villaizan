"use client"; 
import React, { useEffect, useState } from 'react';
import { useSearchParams  } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';

const dataLine = [
  { name: 'Ene', esteAno: 12000, anoAnterior: 8000 },
  { name: 'Feb', esteAno: 15000, anoAnterior: 12000 },
  { name: 'Mar', esteAno: 20000, anoAnterior: 18000 },
  { name: 'Abr', esteAno: 25000, anoAnterior: 22000 },
  { name: 'May', esteAno: 30000, anoAnterior: 28000 },
  { name: 'Jun', esteAno: 32000, anoAnterior: 30000 },
  { name: 'Jul', esteAno: 28000, anoAnterior: 25000 },
];

const dataBar = [
  { name: 'Linux', value: 24000 },
  { name: 'Mac', value: 20000 },
  { name: 'iOS', value: 15000 },
  { name: 'Windows', value: 28000 },
  { name: 'Android', value: 10000 },
  { name: 'Other', value: 12000 },
];

const dataPie = [
  { name: 'EcoGreen', value: 38.6 },
  { name: 'Canada', value: 22.5 },
  { name: 'Mexico', value: 30.8 },
  { name: 'Other', value: 8.1 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {

  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams(); // Obtén los parámetros de búsqueda

  useEffect(() => {
    setIsMounted(true); // Asegúrate de que el componente se monte en el cliente
  }, []);

  if (!isMounted) {
    return null; // No renderizar el componente hasta que esté montado
  }

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const startDateString = Array.isArray(startDate) ? startDate[0] : startDate;
  const endDateString = Array.isArray(endDate) ? endDate[0] : endDate;

  const formattedStartDate = startDateString ? format(new Date(startDateString), "dd 'de' MMMM 'de' yyyy", { locale: es }) : "Fecha de inicio no disponible";
  const formattedEndDate = endDateString ? format(new Date(endDateString), "dd 'de' MMMM 'de' yyyy", { locale: es }) : "Fecha de fin no disponible";


  return (
    <div className="container mx-auto p-4">
      <div className="bg-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="bg-green-500 rounded-full h-4 w-4 mr-2"></div>
          <h2 className="font-bold text-xl">
              Procesamiento de Datos de Venta ({formattedStartDate || "Fecha de inicio no disponible"} - {formattedEndDate || "Fecha de fin no disponible"})
          </h2>        
          </div>
        <p className="text-gray-600">Data procesada</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-red-100 rounded-lg p-4 text-center">
          <p className="text-red-500 font-bold text-2xl">7,265</p>
          <p className="text-gray-600">Cantidad de ventas</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <p className="text-blue-500 font-bold text-2xl">3,671</p>
          <p className="text-gray-600">Productos vendidos</p>
        </div>
        <div className="bg-red-100 rounded-lg p-4 text-center">
          <p className="text-red-500 font-bold text-2xl">15</p>
          <p className="text-gray-600">Ubicaciones</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <p className="text-blue-500 font-bold text-2xl">231</p>
          <p className="text-gray-600">Clientes</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-md col-span-2">
          <h3 className="font-bold text-lg mb-4">Ventas por mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataLine}>
              <Line type="monotone" dataKey="esteAno" stroke="#8884d8" />
              <Line type="monotone" dataKey="anoAnterior" stroke="#82ca9d" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Zonas y demanda</h3>
          <ul className="space-y-2">
            <li>Tarapoto</li>
            <li>Iquitos</li>
            <li>Lima</li>
            <li>Lambayeque</li>
            <li>Pucallpa</li>
            <li>Jaén</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Sabores más populares</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataBar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Promociones con mayor alcance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {dataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;