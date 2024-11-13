// ui/GraphContainer.tsx
import React from 'react';

interface GraphContainerProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const GraphContainer: React.FC<GraphContainerProps> = ({ title, children, className }) => {
    return (
        <div className={`bg-white rounded-lg p-4 shadow-md overflow-hidden ${className ?? ''}`}>
            <h3 className="font-bold text-lg mb-4">{title}</h3>
            <div className="w-full h-full"> {/* Eliminamos el flex para permitir la disposición vertical */}
                {children}
            </div>
        </div>
    );
};

export default GraphContainer;
