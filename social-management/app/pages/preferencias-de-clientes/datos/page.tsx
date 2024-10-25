"use client";
import React from 'react';
import SalesDataItem from './componentes/SalesDataItem';
import Link from 'next/link';

function App() {
    return (
        <div>
            <h1 className="text-xl font-bold">Datos de Ventas</h1>
            <SalesDataItem />
        </div>
    );
}

export default App;