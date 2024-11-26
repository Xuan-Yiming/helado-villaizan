'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { special_ad_categories } from '@/app/lib/constants'; // Define las categorías en un archivo reutilizable si es necesario
import { create_campaign } from '@/app/lib/data'; // Importa la función que llama a la API para crear campañas

export default function CreateCampaignPage() {
    const [name, setName] = useState('');
    const [objective, setObjective] = useState('OUTCOME_TRAFFIC');
    const [status, setStatus] = useState('PAUSED');
    const [budget, setBudget] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const newCampaign = {
                name,
                objective,
                status,
                lifetime_budget: parseInt(budget) || 0, // El presupuesto es obligatorio en la API
                start_time: startDate,
                end_time: endDate,
                bid_strategy: 'LOWEST_COST_WITHOUT_CAP', // Estrategia de puja fija
                special_ad_categories: [], // Campo requerido por la API
            };

            await create_campaign(newCampaign); // Llama a la función para interactuar con la API
            router.push('/pages/publicaciones/campanas'); // Redirige a la lista de campañas
        } catch (error: any) {
            console.error('Error creating campaign:', error);
            setError('Hubo un error al crear la campaña.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="p-4 mx-auto sm:w-full lg:w-1/2">
            <h1 className="text-xl font-bold mb-4">Crear Nueva Campaña</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div>
                    <label htmlFor="name" className="block font-medium">
                        Nombre de la Campaña
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="objective" className="block font-medium">
                        Objetivo
                    </label>
                    <select
                        id="objective"
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    >
                        {special_ad_categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className="block font-medium">
                        Estado
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="ACTIVE">Activo</option>
                        <option value="PAUSED">Pausado</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="budget" className="block font-medium">
                        Presupuesto Total (en PEN)
                    </label>
                    <input
                        type="number"
                        id="budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="startDate" className="block font-medium">
                        Fecha de Inicio
                    </label>
                    <input
                        type="datetime-local"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block font-medium">
                        Fecha de Fin
                    </label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-[#BD181E] text-white rounded hover:bg-[#a5161c]"
                >
                    {isLoading ? 'Creando...' : 'Crear Campaña'}
                </button>
            </form>
        </main>
    );
}
