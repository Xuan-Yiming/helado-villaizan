// ui/GraphContainer.tsx
import React from 'react';

interface GraphContainerProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const GraphContainer: React.FC<GraphContainerProps> = ({ title, children, className }) => {
    return (
        <div className={`bg-white rounded-lg p-4 shadow-md ${className ?? ''}`}>
            <h3 className="font-bold text-lg mb-4">{title}</h3>
            {children}
        </div>
    );
};

export default GraphContainer;
