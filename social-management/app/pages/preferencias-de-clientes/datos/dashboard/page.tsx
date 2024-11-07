"use client"; 
import React, { useEffect, useState, Suspense } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

interface CompraSemana {
  dia: string;
  total_pedidos: number;
}

interface ProductoData {
  id_producto: string;
  total_ventas: number;
  nombre?: string; // Añadimos un campo opcional para el nombre
}

interface ProductoVenta {
  producto_id: string;
  producto_nombre: string;
  total_vendido: number;
}

interface CiudadVentas {
  ciudad_id: string;
  ventas: ProductoVenta[];
}

const dataPie = [
  { name: 'Promocion 1', value: 38.6 },
  { name: 'Promocion 2', value: 22.5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {

  // Estado para almacenar los datos del gráfico de barras
  const searchParams = useSearchParams();
  const [ciudadesData, setCiudadesData] = useState([]);
  const [cityNameMap, setCityNameMap] = useState<{ [key: string]: string }>({});
  const [barData, setBarData] = useState<ProductoData[]>([]);
  const [dataLine, setDataLine] = useState([]);

  const [totalVentas, setTotalVentas] = useState<number | null>(null); // Estado para cantidad de ventas
  const [totalProductos, setTotalProductos] = useState<number | null>(null);
  const [totalCiudades, setTotalCiudades] = useState<number | null>(null);
  const [totalClientes, setTotalClientes] = useState<number | null>(null);

  // Obtener las fechas de los parámetros de consulta
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Función para obtener la cantidad total de ventas desde la API
  const fetchTotalVentas = async () => {
    try {
      if (startDate && endDate){
      const response = await axios.get(`https://villaizan-social.onrender.com/cantidad-pedidos-entregados-por-fecha/?fecha_inicio=${startDate}&fecha_fin=${endDate}`);
      setTotalVentas(response.data.cantidad_pedidos_entregados || 0);; // Suponiendo que la API devuelve { total_ventas: <número> }
      }
    } catch (error) {
      console.error("Error fetching total ventas:", error);
      setTotalVentas(0);
    }
  };

    // Función para obtener la cantidad total de productos desde la API
    const fetchTotalProductos = async () => {
      try {
        if (startDate && endDate) {
          const response = await axios.get(`https://villaizan-social.onrender.com/cantidades-totales/?fecha_inicio=${startDate}&fecha_fin=${endDate}`);
          setTotalProductos(response.data.cantidades_totales || 0); // Asume que la API devuelve la cantidad directamente
        }
      } catch (error) {
        console.error("Error fetching total productos:", error);
        setTotalProductos(0);
      }
    };

    const fetchTotalCiudades = async () => {
      try {
        if (startDate && endDate) {
        const response = await axios.get(`https://villaizan-social.onrender.com/cantidad-ciudades-ventas/?fecha_inicio=${startDate}&fecha_fin=${endDate}`);
        setTotalCiudades(response.data.cantidad_ciudades || 0); // Contamos el número de elementos en la lista de ciudades
        }
      } catch (error) {
        console.error("Error fetching total ciudades:", error);
        setTotalCiudades(0);
      }
    };

    const fetchTotalClientes = async () => {
      try {
        if (startDate && endDate) {
          const response = await axios.get(`https://villaizan-social.onrender.com/clientes-con-pedido-entregado/?fecha_inicio=${startDate}&fecha_fin=${endDate}`);
          setTotalClientes(response.data.length); // Almacena la cantidad de clientes basándose en la longitud de la lista
        }
      } catch (error) {
        console.error("Error fetching total clientes:", error);
        setTotalClientes(0);
      }
    };

  const fetchFrecuenciaCompras = async () => {
    try {
      const response = await axios.get(`https://villaizan-social.onrender.com/frecuencia-compras-dia-semana/?fecha_inicio=${startDate}&fecha_fin=${endDate}`);
      //console.log("Datos de frecuencia de compras:", response.data);
      const formattedData = response.data.map((item: CompraSemana) => ({
        name: item.dia, // Días de la semana para el eje X
        value: item.total_pedidos, // Total de pedidos para el eje Y
      }));
      setDataLine(formattedData);
    } catch (error) {
      console.error("Error fetching frecuencia de compras:", error);
      setDataLine([]);
    }
  };

  // Función para obtener el mapeo de nombres de ciudades
  const fetchCityNames = async () => {
    try {
      const response = await axios.get("https://villaizan-social.onrender.com/ciudades/");
      const cityMap: { [key: string]: string } = {};
      response.data.forEach((city: { id: string; nombre: string }) => {
        cityMap[city.id] = city.nombre; // Asegúrate de que los nombres de los campos coincidan
      });
      setCityNameMap(cityMap);
      console.log("cityNameMap cargado:", cityMap); // Verifica el contenido del mapeo
    } catch (error) {
      console.error("Error fetching city names:", error);
    }
  };

// Función para obtener la cantidad de ventas por ciudad desde la API
const fetchCiudadesData = async () => {
  try {
    if (startDate && endDate && Object.keys(cityNameMap).length > 0) { // Asegurarse de que cityNameMap esté cargado
      const response = await axios.get(`https://villaizan-social.onrender.com/ventas-por-producto-ciudad/?fecha_inicio=${startDate}&fecha_fin=${endDate}`);
      console.log("cityNameMap antes de formatear:", cityNameMap); // Verifica si el mapeo está disponible

      const formattedData = response.data.map((ciudad: CiudadVentas) => ({
        ciudad: cityNameMap[ciudad.ciudad_id] || "Ciudad desconocida",
        total_vendido: ciudad.ventas.reduce((sum, producto: ProductoVenta) => sum + (producto.total_vendido || 0), 0),
      }));

      setCiudadesData(formattedData);
    }
  } catch (error) {
    console.error("Error fetching ciudades data:", error);
    setCiudadesData([]);
  }
};

  // Función para obtener datos de la API
  const fetchBarData = async () => {
    try {
      if (startDate && endDate) {
        const response = await axios.get(`https://villaizan-social.onrender.com/ventas-por-producto/?fecha_inicio=${startDate}&fecha_fin=${endDate}`);
      // Formatear los datos según la estructura de la API
      const productos = response.data;
        // Crear un array de promesas para obtener los nombres de los productos
        const productosConNombre = await Promise.all(
          productos.map(async (producto: ProductoData) => {
            try {
              const productoResponse = await axios.get(`https://villaizan-social.onrender.com/productos/${producto.id_producto}/`);
              return {
                ...producto,
                nombre: productoResponse.data.nombre || producto.id_producto, // Usa el nombre obtenido o el id si falla
              };
            } catch (error) {
              console.error(`Error fetching nombre for product ID ${producto.id_producto}:`, error);
              return producto; // En caso de error, devolver el producto sin nombre
            }
          })
        );

        setBarData(productosConNombre);
      }
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  // useEffect para obtener los datos de la API cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      await fetchCityNames(); // Carga el mapa de nombres de ciudades primero
      await fetchCiudadesData(); // Luego, llama a fetchCiudadesData para utilizar el mapa de nombres
    };
  
    fetchData(); // Ejecuta el fetchData para asegurar la sincronización.
    fetchTotalVentas();
    fetchTotalProductos();
    fetchTotalCiudades();
    fetchTotalClientes();
    fetchFrecuenciaCompras();
    fetchBarData();
  }, [startDate, endDate]); 

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="bg-gray-500 rounded-full h-4 w-4 mr-2"></div>
          <h2 className="font-bold text-xl">Procesamiento de Datos de Ventas
             ({startDate ? startDate : "Fecha de inicio no disponible"} - {endDate ? endDate : "Fecha de fin no disponible"})</h2>
        </div>
        <p className="text-gray-600">Data procesada</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-red-100 rounded-lg p-4 text-center">
        <p className="text-red-500 font-bold text-2xl">
        {typeof totalVentas === "number" ? totalVentas.toLocaleString() : "Cargando..."}
          </p>
          <p className="text-gray-600">Cantidad de ventas</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <p className="text-blue-500 font-bold text-2xl">
          {typeof totalProductos === "number" ? totalProductos.toLocaleString() : "Cargando..."}
          </p>
          <p className="text-gray-600">Productos vendidos</p>
        </div>
        <div className="bg-red-100 rounded-lg p-4 text-center">
          <p className="text-red-500 font-bold text-2xl">
          {typeof totalCiudades === "number" ? totalCiudades.toLocaleString() : "Cargando..."}
          </p>
          <p className="text-gray-600">Ubicaciones</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <p className="text-blue-500 font-bold text-2xl">
          {typeof totalClientes === "number" ? totalClientes.toLocaleString() : "Cargando..."}
          </p>
          <p className="text-gray-600">Clientes</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-md col-span-2">
          <h3 className="font-bold text-lg mb-4">Ventas semanales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataLine}>
              <Line type="monotone" dataKey="value" stroke="#82ca9d" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" label={{ value: "Día", position: "insideBottom", offset: -5 }}  />
              <YAxis label={{ value: "Total de Pedidos", angle: -90, position: "insideLeft" }} domain={[0, 'auto']} 
              interval={0} allowDecimals={false} tickCount={5}  />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Zonas y demanda</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ciudadesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ciudad" label={{ value: "Ciudad", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "Total Vendido", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Bar dataKey="total_vendido" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Ventas por Producto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" label={{ value: "Producto", position: "insideBottom", offset: -5 }} />
              <YAxis dataKey="total_ventas" label={{ value: "Cantidad Total de Ventas", angle: -90, position: "insideCenter" }} />
              <Tooltip />
              <Bar dataKey="total_ventas" fill="#82ca9d" />
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

const DashboardPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Dashboard />
  </Suspense>
);

export default DashboardPage;
