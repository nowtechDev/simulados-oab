import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  BarChart2, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';

// Mock data for performance by area
const performanceData = [
  { name: 'Constitucional', nota: 85 },
  { name: 'Civil', nota: 65 },
  { name: 'Penal', nota: 75 },
  { name: 'Tributário', nota: 50 },
  { name: 'Administrativo', nota: 70 },
  { name: 'Empresarial', nota: 60 },
  { name: 'Trabalho', nota: 80 },
];

// Mock data for progress
const pieData = [
  { name: 'Completado', value: 65 },
  { name: 'Restante', value: 35 },
];

// Mock data for recent exams
const recentExams = [
  { 
    id: 1, 
    title: 'Simulado OAB - Primeira Fase',
    date: '10/06/2023',
    score: 76,
    questions: 80,
    correct: 61,
    time: '4h 20min',
    status: 'complete'
  },
  { 
    id: 2, 
    title: 'Direito Civil - Contratos',
    date: '05/06/2023',
    score: 65,
    questions: 20,
    correct: 13,
    time: '50min',
    status: 'complete'
  },
  { 
    id: 3, 
    title: 'Direito Penal - Parte Geral',
    date: '01/06/2023',
    score: 90,
    questions: 20,
    correct: 18,
    time: '45min',
    status: 'complete'
  },
];

// Mock data for recommended content
const recommendedContent = [
  {
    id: 1,
    title: 'Revisão Direito Tributário',
    type: 'material',
    priority: 'alta',
    description: 'Material recomendado baseado em seu desempenho nos últimos simulados.'
  },
  {
    id: 2,
    title: 'Simulado Direito Civil - Contratos',
    type: 'simulado',
    priority: 'média',
    description: 'Praticar este tópico pode melhorar seu desempenho geral.'
  },
  {
    id: 3,
    title: 'Jurisprudência STF - Direito Constitucional',
    type: 'jurisprudência',
    priority: 'baixa',
    description: 'Conteúdo complementar para aprofundar seu conhecimento.'
  },
];

// Mock data for study plan
const studyPlan = [
  {
    id: 1,
    date: 'Hoje',
    tasks: [
      { id: 101, title: 'Revisão Direito Tributário', complete: false, duration: '2h' },
      { id: 102, title: 'Simulado Direito Civil', complete: false, duration: '1h' },
    ]
  },
  {
    id: 2,
    date: 'Amanhã',
    tasks: [
      { id: 201, title: 'Estudo Direito Penal', complete: false, duration: '3h' },
      { id: 202, title: 'Revisão Jurisprudência STF', complete: false, duration: '1h' },
    ]
  },
  {
    id: 3,
    date: 'Quarta-feira',
    tasks: [
      { id: 301, title: 'Simulado Completo OAB', complete: false, duration: '5h' },
    ]
  },
];

// Colors for the pie chart
const COLORS = ['#4f86e7', '#e4e9f2'];

const Dashboard = () => {
  const [activeTask, setActiveTask] = useState<number | null>(null);
  
  const toggleTask = (taskId: number) => {
    if (activeTask === taskId) {
      setActiveTask(null);
    } else {
      setActiveTask(taskId);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-foreground/60">Acompanhe seu progresso e plano de estudos personalizado</p>
      </div>
      
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Aproveitamento Geral</p>
              <h3 className="text-3xl font-bold">75%</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> 5%
            </span>
            <span className="text-foreground/60 ml-2">desde o último mês</span>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Simulados Realizados</p>
              <h3 className="text-3xl font-bold">15</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> 3
            </span>
            <span className="text-foreground/60 ml-2">nesta semana</span>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Tempo de Estudo</p>
              <h3 className="text-3xl font-bold">24h</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> 2h
            </span>
            <span className="text-foreground/60 ml-2">a mais que semana passada</span>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Dias até a Prova</p>
              <h3 className="text-3xl font-bold">45</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-red-600 font-medium flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" /> 7
            </span>
            <span className="text-foreground/60 ml-2">dias desde a semana passada</span>
          </div>
        </div>
      </motion.div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance by Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel p-6 lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium">Desempenho por Área</h2>
              <p className="text-sm text-foreground/60">Seus resultados nos últimos simulados</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="nota" fill="#4f86e7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Progress Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium">Progresso do Plano</h2>
              <p className="text-sm text-foreground/60">Seu avanço no plano de estudos</p>
            </div>
          </div>
          
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span className="text-sm">Completado (65%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
              <span className="text-sm">Restante (35%)</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Recent Exams and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Exams */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-panel p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium">Simulados Recentes</h2>
              <p className="text-sm text-foreground/60">Seus últimos 3 simulados realizados</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">Ver todos</Button>
          </div>
          
          <div className="space-y-4">
            {recentExams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-base">{exam.title}</h3>
                    <p className="text-sm text-foreground/60">{exam.date}</p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    exam.score >= 70 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {exam.score}%
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-primary/70" />
                    <span>{exam.correct}/{exam.questions} questões</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary/70" />
                    <span>{exam.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Recommended Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-panel p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium">Conteúdo Recomendado</h2>
              <p className="text-sm text-foreground/60">Baseado no seu desempenho</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {recommendedContent.map((content) => (
              <div key={content.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-base">{content.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-foreground/60 bg-gray-100 px-2 py-0.5 rounded-full">
                        {content.type}
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        content.priority === 'alta' ? "bg-red-100 text-red-700" :
                        content.priority === 'média' ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      )}>
                        Prioridade {content.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-foreground/70 mb-3">
                  {content.description}
                </p>
                
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  <span>Acessar conteúdo</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Study Plan */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-panel p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-medium">Plano de Estudos</h2>
            <p className="text-sm text-foreground/60">Seu cronograma personalizado</p>
          </div>
          <Button size="sm">Atualizar plano</Button>
        </div>
        
        <div className="space-y-6">
          {studyPlan.map((day) => (
            <div key={day.id}>
              <h3 className="font-medium text-base mb-4">{day.date}</h3>
              <div className="space-y-3">
                {day.tasks.map((task) => (
                  <div key={task.id} className={cn(
                    "bg-white rounded-lg p-4 shadow-sm border transition-all duration-300",
                    activeTask === task.id ? "border-primary" : "border-transparent"
                  )}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                            task.complete ? "bg-green-100 border-green-300" : 
                            activeTask === task.id ? "border-primary" : "border-gray-300"
                          )}
                        >
                          {task.complete && <CheckCircle className="w-4 h-4 text-green-600" />}
                        </button>
                        <div>
                          <h4 className={cn(
                            "font-medium",
                            task.complete && "text-foreground/50 line-through"
                          )}>
                            {task.title}
                          </h4>
                          <div className="flex items-center text-sm text-foreground/60 mt-1 gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{task.duration}</span>
                            </div>
                            {activeTask === task.id && (
                              <button className="text-primary hover:underline">
                                Iniciar agora
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {day.id === 1 && task.id === 101 && (
                        <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          Prioridade alta
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
