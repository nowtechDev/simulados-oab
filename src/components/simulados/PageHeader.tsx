
import React from 'react';

const PageHeader = () => {
  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      <span className="bg-[#F8E6FF] px-4 py-1.5 rounded-full text-sm font-medium text-[#4F1964] mb-4 inline-block">
        Plano Avançado
      </span>
      <h1 className="text-4xl font-bold text-[#4F1964] mb-4">
        Escolha seu Simulado
      </h1>
      <p className="text-foreground/80 text-lg mb-6">
        Pratique com simulados personalizados que se adaptam ao seu nível de conhecimento.
        Receba feedback detalhado e instruções para melhorar seu desempenho.
      </p>
    </div>
  );
};

export default PageHeader;
