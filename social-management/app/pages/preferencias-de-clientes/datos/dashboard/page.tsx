"use client"; 
import React, { useEffect, useState, Suspense } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const dataPie = [
  { name: 'EcoGreen', value: 38.6 },
  { name: 'Canada', value: 22.5 },
];

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

const COLORS = [  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D50230', '#36A2EB', '#FFCE56',
  '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#FF6F91', '#845EC2', '#FCE2E2'];

const Dashboard = () => {

  // Estado para almacenar los datos del gráfico de barras
  const searchParams = useSearchParams();
  const [promocionesData, setPromocionesData] = useState<{ name: string; value: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [ciudadesData, setCiudadesData] = useState<{ ciudad: string; total_vendido: number }[]>([]);
  const [cityNameMap, setCityNameMap] = useState<{ [key: string]: string }>({});
  const [barData, setBarData] = useState<ProductoData[]>([]);
  const [dataLine, setDataLine] = useState([]);
  
  const [totalGanancia, setTotalGanancia] = useState<number | null>(null);
  const [totalVentas, setTotalVentas] = useState<number | null>(null); // Estado para cantidad de ventas
  const [totalProductos, setTotalProductos] = useState<number | null>(null);
  const [totalCiudades, setTotalCiudades] = useState<number | null>(null);
  const [totalClientes, setTotalClientes] = useState<number | null>(null);
  const [agesData, setAgesData] = useState<{ age: string; Clientes: number }[]>([]);
  const [loadingAges, setLoadingAges] = useState(true);
  const [clientesData, setClientesData] = useState<{ name: string; value: number; total: number }[]>([]);


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

      // Función para obtener la cantidad total de ganancia en soles desde la API
  const fetchTotalGanancia = async () => {
    try {
      if (startDate && endDate) {
        const response = await axios.get(
          /* CAMBIAR LA API POR LA QUE SIOUXIE DE */
          `https://villaizan-social.onrender.com/ventas-totales-monto/?fecha_inicio=${startDate}&fecha_fin=${endDate}`
        );
        setTotalGanancia(response.data.monto_total || 0); // Suponiendo que la API devuelve { total_ganancia: <número> }
        console.log("ganancia",response.data);
      }
    } catch (error) {
      console.error("Error fetching total ganancia:", error);
      setTotalGanancia(0); // Valor predeterminado en caso de error
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
        cityMap[city.id] = city.nombre;
      });
      setCityNameMap(cityMap);
      console.log("cityNameMap cargado:", cityMap); // Verifica el contenido del mapeo
    } catch (error) {
      console.error("Error fetching city names:", error);
    }
  };

  const fetchCiudadesData = async () => {
    try {
      if (startDate && endDate && Object.keys(cityNameMap).length > 0) {
        const response = await axios.get(`https://villaizan-social.onrender.com/ventas-por-producto-ciudad/?fecha_inicio=${startDate}&fecha_fin=${endDate}`);
        console.log("Usando cityNameMap en fetchCiudadesData:", cityNameMap);
  
        const formattedData = response.data.map((ciudad: CiudadVentas) => ({
          ciudad: cityNameMap[ciudad.ciudad_id] || "Ciudad desconocida",
          total_vendido: ciudad.ventas.reduce((sum, producto: ProductoVenta) => sum + (producto.total_vendido || 0), 0),
        }));
  
        console.log("Datos formateados de ciudades:", formattedData);
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

  // Función para obtener los datos de la API
  const fetchPromocionesData = async () => {
    try {
      if (startDate && endDate) {
        const response = await axios.get(
          `https://villaizan-social.onrender.com/ventas-por-promocion/?fecha_inicio=${startDate}&fecha_fin=${endDate}`
        );

        console.log("Raw API Response:", response.data);

        const totalVentas = response.data.reduce(
          (acc: number, promo: { id_promocion: string; total_ventas: number }) => acc + promo.total_ventas,
          0
        );

        console.log("Total Ventas:", totalVentas);
  
        const formattedData = response.data.map((promo: { id_promocion: string; total_ventas: number }) => ({
          name: `Promoción ${promo.id_promocion}`,
          value: parseFloat(((promo.total_ventas / totalVentas) * 100).toFixed(2)), // Convertir a número
          total: promo.total_ventas,
        }));

        console.log("Formatted Data:", formattedData);
  
        setPromocionesData(formattedData);
        setLoading(false);

      }
    } catch (error) {
      console.error('Error fetching promociones data:', error);
      setPromocionesData([]);
      setLoading(false);
    }
  };

  const fetchAgesData = async () => {
    try {
      setLoadingAges(true);
      const response = await axios.get(
        `https://villaizan-social.onrender.com/edades-frecuentes-clientes/?fecha_inicio=${startDate}&fecha_fin=${endDate}`
      );
      
      const formattedData = response.data.map((item: { edad: string | null; cantidad: number }) => ({
        age: item.edad ? item.edad : "Edad desconocida", // Si `edad` es null, usa "Edad desconocida"
        Clientes: item.cantidad, // Frecuencia de la edad
      }));

      setAgesData(formattedData);
      setLoadingAges(false);
    } catch (error) {
      console.error("Error fetching ages data:", error);
      setAgesData([]);
      setLoadingAges(false);
    }
  };

  const fetchClientesData = async () => {
    try {
      if (startDate && endDate) {
        const response = await axios.get(
          `https://villaizan-social.onrender.com/top-clientes-por-pedidos/?fecha_inicio=${startDate}&fecha_fin=${endDate}`
        );
  
        const totalPedidos = response.data.reduce(
          (acc: number, cliente: { total_pedidos: number }) => acc + cliente.total_pedidos,
          0
        );
  
        const formattedData = response.data.map((cliente: { nombre: string; apellido: string; total_pedidos: number }) => ({
          name: `${cliente.nombre} ${cliente.apellido}`.trim(), // Combina nombre y apellido
          value: parseFloat(((cliente.total_pedidos / totalPedidos) * 100).toFixed(2)), // Calcula el porcentaje
          total: cliente.total_pedidos, // Total absoluto de pedidos
        }));
  
        setClientesData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching clientes data:", error);
      setClientesData([]);
    }
  };


    // Función para exportar a PDF
    const exportToPDF = async () => {
    const dashboardElement = document.getElementById('dashboard-content'); // Selecciona todo el contenido del dashboard
    const exportButton = document.getElementById('export-button'); // Selecciona el botón
  
    // Oculta el botón antes de exportar
    if (exportButton) {
      exportButton.style.display = 'none';
    }  
    const input = document.getElementById('dashboard-content'); // Selecciona el elemento del dashboard
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // Ancho de la imagen en el PDF
      const pageHeight = 295; // Alto de la página en el PDF
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('dashboard_report.pdf'); // Guarda el archivo PDF con el nombre indicado
      if (exportButton) {
        exportButton.style.display = 'block';
      }
    }
  };
  useEffect(() => {
    fetchPromocionesData();
  }, [startDate, endDate]);

  useEffect(() => {
    console.log("Updated Promociones Data:", promocionesData);
  }, [promocionesData]);
  // useEffect para obtener los datos de la API cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      await fetchCityNames();
    };
    fetchData();

    fetchData();
    fetchTotalVentas();
    fetchTotalProductos();
    fetchTotalCiudades();
    fetchTotalClientes();
    fetchTotalGanancia();
    fetchFrecuenciaCompras();
    fetchBarData();
    fetchAgesData();
    fetchClientesData();
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchDataForCiudades = async () => {
      if (Object.keys(cityNameMap).length > 0) {
        await fetchCiudadesData();
      }
    };
    fetchDataForCiudades();
  }, [cityNameMap, startDate, endDate]);

  return (
    <div id="dashboard-content" className="container mx-auto p-4">
      <div className="bg-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="bg-gray-500 rounded-full h-4 w-4 mr-2"></div>
          <h2 className="font-bold text-xl">Procesamiento de Datos de Ventas
             ({startDate ? startDate : "Fecha de inicio no disponible"} / {endDate ? endDate : "Fecha de fin no disponible"})</h2>
        </div>
        <p className="text-gray-600">Data procesada</p>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
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
        <div className="bg-red-100 rounded-lg p-4 text-center">
          <p className="text-red-500 font-bold text-2xl">
            {typeof totalGanancia === "number" ? `${totalGanancia.toLocaleString()}` : "Cargando..."}
          </p>
          <p className="text-gray-600">Soles en ventas</p>
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
            {ciudadesData.length > 0 ? (
              <BarChart data={ciudadesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ciudad" label={{ value: "Ciudad", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Total Vendido", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Bar dataKey="total_vendido" fill="#82ca9d" />
              </BarChart>
            ) : (
              <p>Cargando datos...</p>
            )}
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
            {promocionesData.length === 0 ? (
              <p>No hay ventas con promociones...</p>
            ) : (
              <PieChart width={400} height={300}>
                  <Pie
                    data={promocionesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                  >
                  {promocionesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${props.payload.total} ventas`, name]} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  formatter={(value: string) =>
                    `${value} (${promocionesData.find((d) => d.name === value)?.value}%)`
                  }
                />
              </PieChart>
            )}
            </ResponsiveContainer>


        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 gap-y-8 shadow-md mt-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Clientes con mayor cantidad de pedidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            {clientesData.length === 0 ? (
              <p>Cargando datos...</p>
            ) : (
              <PieChart>
                <Pie
                  data={clientesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${value}%`}
                >
                  {clientesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${props.payload.total} pedidos`, name]} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  formatter={(value: string) =>
                    `${value} (${clientesData.find((d) => d.name === value)?.value}%)`
                  }
                />
              </PieChart>
            )}
          </ResponsiveContainer>


        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Frecuencia de edades</h3>
          <ResponsiveContainer width="100%" height={300}>
            {loadingAges ? (
              <p>Cargando datos...</p>
            ) : (
              <BarChart data={agesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" label={{ value: "Edad", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Cantidad", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Bar dataKey="Clientes" fill="#82ca9d" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button 
          id="export-button" // ID para identificar el botón
          onClick={exportToPDF}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded">
          Exportar reporte
        </button>
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
