
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, PauseIcon, PlayIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatarTempo } from '@/utils/formatters';

interface ExamTimerProps {
  initialTime?: number; // Tempo inicial em segundos
  isStarted?: boolean; // New prop to control if timer starts automatically
  className?: string; // Optional class to customize positioning
}

const ExamTimer = ({ initialTime = 5 * 60 * 60, isStarted = true, className }: ExamTimerProps) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(isStarted);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime(prevTime => Math.max(0, prevTime - 1));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Effect to update isRunning when isStarted prop changes
  useEffect(() => {
    setIsRunning(isStarted);
  }, [isStarted]);
  
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  
  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };
  
  if (!isVisible) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleVisibility}
        className={cn("h-9 px-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white border-purple-300", className)}
      >
        <EyeIcon className="h-4 w-4 text-purple-600" />
      </Button>
    );
  }
  
  return (
    <div className={cn(
      "flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-2 rounded-full shadow-md",
      !isRunning && "from-gray-500 to-gray-600",
      className
    )}>
      <Clock className="h-4 w-4" />
      <span className="font-medium text-sm">
        {formatarTempo(time)}
      </span>
      
      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleTimer}
          className="h-6 w-6 p-0 rounded-full hover:bg-white/20 text-white"
        >
          {isRunning ? (
            <PauseIcon className="h-3 w-3" />
          ) : (
            <PlayIcon className="h-3 w-3" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleVisibility}
          className="h-6 w-6 p-0 rounded-full hover:bg-white/20 text-white"
        >
          <EyeOffIcon className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ExamTimer;
