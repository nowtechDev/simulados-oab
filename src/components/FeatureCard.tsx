
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon: Icon, title, description, className }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn(
        "p-6 md:p-8 flex flex-col items-start rounded-xl",
        "group cursor-pointer transition-all duration-300 ease-out border border-gray-200",
        isHovered ? "shadow-lg bg-white border-[#4F1964]/20" : "bg-white",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "w-12 h-12 flex items-center justify-center rounded-xl mb-6",
        "bg-[#F8E6FF] text-[#4F1964] transition-all duration-300 ease-out",
        isHovered && "bg-[#4F1964] text-white"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold mb-3 tracking-tight">{title}</h3>
      <p className="text-foreground/70 whitespace-pre-line">{description}</p>
    </div>
  );
};

export default FeatureCard;
