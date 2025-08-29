
import React from 'react';

const LoadingView = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <p className="text-center text-lg text-foreground/80 mb-2">Carregando simulados...</p>
      <div className="animate-pulse h-2 w-40 bg-[#4F1964]/30 rounded-full"></div>
    </div>
  );
};

export default LoadingView;
