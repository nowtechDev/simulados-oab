
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Simulator from "./pages/Simulator";
import Cadernos from "./pages/Cadernos";
import Cadernos2 from "./pages/Cadernos2";
import CadernoView from "./pages/CadernoView";
import ProvaView from "./pages/ProvaView";
import Simulados from "./pages/Simulados";
import SimuladosGratuito from "./pages/SimuladosGratuito";
import SimuladosEssencial from "./pages/SimuladosEssencial";
import SimuladosAvancado from "./pages/SimuladosAvancado";
import SimuladosDesbloqueado from "./pages/SimuladosDesbloqueado";
import SimuladoIA from "./pages/SimuladoIA";
import SimuladoPrimeiraFaseIA from "./pages/SimuladoPrimeiraFaseIA";
import SimuladorSegundaFase from "./pages/SimuladorSegundaFase";
import SegundaFaseSimulados from "./pages/SegundaFaseSimulados";
import AgentesIA from "./pages/AgentesIA";
import AgentesIA2 from "./pages/AgentesIA2";
import Assistant from "./pages/Assistant";
import Configuracoes from "./pages/Configuracoes";
import AdminPlataforma from "./pages/AdminPlataforma";
import AdminInstitucional from "./pages/AdminInstitucional";
import PagamentoEssencial from "./pages/PagamentoEssencial";
import PagamentoProfissional from "./pages/PagamentoProfissional";
import NotFound from "./pages/NotFound";
import "./polyfills";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/simulator/:examId" element={<Simulator />} />
              <Route path="/prova/:simuladoId/:numeroProva" element={<Simulator />} />
              <Route path="/cadernos" element={<Cadernos />} />
              <Route path="/cadernos2" element={<Cadernos2 />} />
              <Route path="/caderno/:id" element={<CadernoView />} />
              <Route path="/prova/:id" element={<ProvaView />} />
              <Route path="/simulados" element={<Simulados />} />
              <Route path="/simulados-gratuito" element={<SimuladosGratuito />} />
              <Route path="/simulados-essencial" element={<SimuladosEssencial />} />
              <Route path="/simulados-avancado" element={<SimuladosAvancado />} />
              <Route path="/simulados-desbloqueado" element={<SimuladosDesbloqueado />} />
              <Route path="/simulado-ia" element={<SimuladoIA />} />
              <Route path="/simulado-primeira-fase-ia" element={<SimuladoPrimeiraFaseIA />} />
              <Route path="/simulador-segunda-fase" element={<SimuladorSegundaFase />} />
              <Route path="/segunda-fase-simulados" element={<SegundaFaseSimulados />} />
              <Route path="/agentes-ia" element={<AgentesIA />} />
              <Route path="/agentes-ia2" element={<AgentesIA2 />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/admin-plataforma" element={<AdminPlataforma />} />
              <Route path="/admin-institucional" element={<AdminInstitucional />} />
              <Route path="/pagamento-essencial" element={<PagamentoEssencial />} />
              <Route path="/pagamento-profissional" element={<PagamentoProfissional />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
