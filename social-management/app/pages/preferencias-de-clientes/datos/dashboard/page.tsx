"use client"; 
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Datos para los gráficos
  const lineData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Este año',
        data: [12000, 15000, 10000, 20000, 25000, 22000, 27000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Año anterior',
        data: [10000, 14000, 9000, 19000, 23000, 20000, 26000],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-500 rounded-full h-10 w-10"></div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">Temporada Verano 2024 (Enero 01, 2024 - Abril 01, 2024)</h2>
            <p className="text-gray-600">Data procesada</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-red-200 p-4 rounded-lg">
            <h3 className="text-red-700">Cantidad de ventas</h3>
            <p className="text-2xl font-bold">7,265</p>
          </div>
          <div className="bg-blue-200 p-4 rounded-lg">
            <h3 className="text-blue-700">Productos vendidos</h3>
            <p className="text-2xl font-bold">3,671</p>
          </div>
          <div className="bg-red-200 p-4 rounded-lg">
            <h3 className="text-red-700">Ubicaciones</h3>
            <p className="text-2xl font-bold">15</p>
          </div>
          <div className="bg-blue-200 p-4 rounded-lg">
            <h3 className="text-blue-700">Clientes</h3>
            <p className="text-2xl font-bold">231</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-bold mb-4">Ventas por mes</h3>
          <Line data={lineData} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Sabores más populares</h3>
            {/* Aquí se puede agregar un gráfico de barras para los sabores */}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Promociones con mayor alcance</h3>
            {/* Aquí se puede agregar un gráfico de pastel para las promociones */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;