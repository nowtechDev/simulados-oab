import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { useToast } from '@/hooks/use-toast';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    setLoaded(true);
  }, []);
  const containerAnimation = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  const itemAnimation = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  const handleSplineLoad = () => {
    setSplineLoaded(true);
  };
  const handleSplineError = err => {
    console.error('Spline loading error:', err);
    setSplineError(true);
    setSplineLoaded(true);
    toast({
      title: 'Aviso',
      description: 'Alguns recursos visuais não puderam ser carregados.',
      variant: 'default'
    });
  };
  return <section className="relative min-h-[90vh] flex items-center pt-12 pb-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-64 w-[800px] h-[800px] rounded-full bg-[#4F1964]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#F8E6FF] blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div className={cn("flex flex-col text-left max-w-xl", loaded ? "opacity-100" : "opacity-0")} variants={containerAnimation} initial="hidden" animate={loaded ? "show" : "hidden"}>
            <motion.div variants={itemAnimation} className="inline-block mb-6">
              <span className="bg-[#F8E6FF] px-4 py-1.5 rounded-full text-sm font-medium text-[#4F1964]">Do primeiro semestre à aprovação: estude com o apoio do Menthor</span>
            </motion.div>
            
            <motion.h1 variants={itemAnimation} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Estudo prático para a faculdade de Direito e a OAB, com apoio de <span className="text-[#4F1964]">ferramentas inteligentes</span>
            </motion.h1>
            
            <motion.p variants={itemAnimation} className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl">Estude com organização, pratique com simulados comentados e receba orientações inteligentes para evoluir com estratégia.</motion.p>
            
            <motion.div variants={itemAnimation} className="flex flex-col sm:flex-row gap-4 w-full">
              <Link to="/login">
                <Button size="lg" className="h-14 px-8 rounded-xl button-animation bg-[#4F1964] hover:bg-[#6B3182]">
                  Começar agora
                </Button>
              </Link>
              <a href="#planos">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-xl button-animation border-[#4F1964] text-[#4F1964] hover:bg-[#F8E6FF]/50">
                  Ver planos
                </Button>
              </a>
            </motion.div>
          </motion.div>

          <motion.div className="relative h-[500px] md:h-[550px] w-full overflow-visible" initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: loaded ? 1 : 0,
          scale: loaded ? 1 : 0.9,
          transition: {
            delay: 0.3,
            duration: 0.8
          }
        }}>
            {!splineLoaded && !splineError && <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#4F1964] border-t-transparent rounded-full animate-spin"></div>
              </div>}
            
            {!splineError ? <div className={cn("absolute w-[120%] h-[150%] transform -translate-x-4", splineLoaded ? "opacity-100" : "opacity-0")} style={{
            bottom: "-120px"
          }}>
                <Spline scene="https://prod.spline.design/J2sqevUiSNF4arzx/scene.splinecode" onLoad={handleSplineLoad} onError={handleSplineError} />
              </div> : <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#F8E6FF]/50 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium text-[#4F1964] mb-2">Visualização 3D</h3>
                  <p className="text-foreground/70">
                    A visualização 3D não está disponível no momento.
                  </p>
                </div>
              </div>}
          </motion.div>
        </div>
      </div>
    </section>;
};

export default Hero;
