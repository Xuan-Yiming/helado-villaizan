// app/ui/components/selected-filters-display.tsx
import React from 'react';
import FacebookLogo from '@/app/ui/icons/facebook';
import InstagramLogo from '@/app/ui/icons/instagram';

interface SelectedFiltersDisplayProps {
    network: 'facebook' | 'instagram';
    dateRange: { start: Date; end: Date };
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

const SelectedFiltersDisplay: React.FC<SelectedFiltersDisplayProps> = ({ network, dateRange }) => {
    const capitalizedNetwork = network.charAt(0).toUpperCase() + network.slice(1);

    return (
        <div className="bg-gray-200 rounded-lg p-4 mb-6 mt-8">
            <div className="flex items-center">
                {getSocialIcon(network)}
                <h2 className="font-bold text-lg">
                    Red Social Seleccionada: {capitalizedNetwork}
                </h2>
            </div>
            <p className="text-gray-600 mt-2">
                Rango de Fechas: {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
            </p>
        </div>
    );
};

export default SelectedFiltersDisplay;
