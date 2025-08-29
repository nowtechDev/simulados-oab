
import React from 'react';
import { Layout } from '@/components/Layout';
import SegundaFaseAreaSelection from '@/components/simulados/SegundaFaseAreaSelection';

const SegundaFaseSimulados = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-[#4F1964] mb-4">
            Simulados Segunda Fase OAB
          </h1>
          <p className="text-foreground/80 text-lg">
            Pratique com questões dissertativas reais dos exames da OAB organizadas por área jurídica.
          </p>
        </div>
        
        <SegundaFaseAreaSelection />
      </div>
    </Layout>
  );
};

export default SegundaFaseSimulados;
