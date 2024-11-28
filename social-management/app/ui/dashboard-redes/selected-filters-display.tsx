// app/ui/dashboard-redes/selected-filters-display.tsx
import React from 'react';
import FacebookLogo from '@/app/ui/icons/facebook';
import InstagramLogo from '@/app/ui/icons/instagram';

interface SelectedFiltersDisplayProps {
    appliedNetwork: 'facebook' | 'instagram'; // Cambiado a "appliedNetwork" para mayor claridad
    appliedDateRange: { start: Date; end: Date } | null; // Permitir null si no se ha aplicado el rango aún
}

const getSocialIcon = (network: string) => {
    switch (network) {
        case 'facebook':
            return <span className="w-5 h-5 mr-2"><FacebookLogo /></span>;
        case 'instagram':
            return <span className="w-5 h-5 mr-2"><InstagramLogo /></span>;
        default:
            return null;
    }
};

const SelectedFiltersDisplay: React.FC<SelectedFiltersDisplayProps> = ({ appliedNetwork, appliedDateRange }) => {
    const capitalizedNetwork = appliedNetwork.charAt(0).toUpperCase() + appliedNetwork.slice(1);

    return (
        <div className="bg-gray-200 rounded-lg p-4 mb-6 mt-8">
            <div className="flex items-center">
                {getSocialIcon(appliedNetwork)}
                <h2 className="font-bold text-lg">
                    Red Social Seleccionada: {capitalizedNetwork}
                </h2>
            </div>
            {appliedDateRange ? (
                <p className="text-gray-600 mt-2">
                    Rango de Fechas: {appliedDateRange.start.toLocaleDateString()} - {appliedDateRange.end.toLocaleDateString()}
                </p>
            ) : (
                <p className="text-gray-600 mt-2">Rango de Fechas: No seleccionado</p>
            )}
        </div>
    );
};

export default SelectedFiltersDisplay;
