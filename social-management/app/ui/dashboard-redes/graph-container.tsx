// ui/GraphContainer.tsx
import React from 'react';

interface GraphContainerProps {
    title: string;
    children: React.ReactNode;
}

const GraphContainer: React.FC<GraphContainerProps> = ({ title, children }) => {
    return (
        <div className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="font-bold text-lg mb-4">{title}</h3>
            {children}
        </div>
    );
};

export default GraphContainer;
