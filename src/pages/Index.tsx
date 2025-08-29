import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import Hero from '@/components/Hero';
import { Book, GraduationCap, ShieldCheck, Award, Building, CheckCircle, Star, BarChart3, FileText, Brain, Sparkles, X, ChevronDown, ChevronUp, Lock, PlusCircle, MinusCircle } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from '@/components/ui/separator';
const Index = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };
  return <Layout>
      <Hero />
      
      {/* Seção de recursos */}
      <section id="recursos" className="py-16 bg-gradient-to-br from-[#4F1964]/5 to-[#F8E6FF]/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4F1964] mb-4">Você continua no controle. O Menthor te ajuda a aprender com estratégia.</h2>
            <p className="text-foreground/80 text-lg">
              A plataforma usa inteligência artificial para organizar seus estudos, gerar simulações práticas e esclarecer dúvidas com base no que você realmente precisa entender.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard icon={Book} title="Apoio Inteligente em Direito" description="A IA do Menthor foi treinada com base em provas reais e padrões jurídicos. Ela ajuda você a entender melhor os conteúdos e a praticar com mais objetividade — sem perder tempo." />
            <FeatureCard icon={GraduationCap} title="Estudo Prático e Orientado" description="Gere simulados e peças com base no seu ritmo. A cada resposta, você recebe explicações claras e orientações para seguir evoluindo com segurança." />
            <FeatureCard icon={ShieldCheck} title="Organização Personalizada dos Estudos" description="Crie cadernos por disciplina, organize seus conteúdos e receba sugestões para aprimorar o que escreveu. O Menthor te ajuda a revisar com foco e clareza, sempre a partir do seu próprio material." />
          </div>
        </div>
      </section>

      {/* Seção de planos */}
      <section id="planos" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="bg-[#F8E6FF] px-4 py-1.5 rounded-full text-sm font-medium text-[#4F1964] mb-4 inline-block">
              Comece Agora
            </span>
            <h2 className="text-4xl font-bold text-[#4F1964] mb-4">Escolha o plano certo para a sua jornada de estudos
          </h2>
            <p className="text-foreground/80 text-lg">Conte com a Inteligência Artificial para treinar, revisar e aprender com mais eficiência.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Plano Gratuito */}
            <div className="rounded-2xl bg-white border-2 border-[#4F1964]/30 overflow-hidden shadow-lg transform transition-transform hover:scale-105 flex flex-col h-full">
              <div className="bg-[#4F1964]/10 p-6 text-center flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-[#4F1964]">Menthor Gratuito</h3>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#4F1964]">R$0</span>
                  <span className="ml-1 text-[#4F1964]/70">/mês</span>
                </div>
                <p className="mt-2 text-sm text-[#4F1964]/80 min-h-[40px]">Ideal pra quem quer experimentar o Menthor sem compromisso.</p>
              </div>

              <div className="p-6 space-y-4 flex-grow flex flex-col">
                <div className="space-y-3 flex-grow">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Acesse o ambiente de simulados da OAB FGV</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Resolva até 10 questões de 1ª fase por dia, com correção automática</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Receba explicações rápidas e diretas do Menthor</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="font-medium flex items-center mb-2">
                      <Lock className="h-4 w-4 mr-1 text-gray-600" />
                      Não inclui:
                    </p>
                    <div className="flex items-start">
                      <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Acesso ilimitado ao banco de questões</span>
                    </div>
                    <div className="flex items-start">
                      <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Treinamento para 2ª fase</span>
                    </div>
                    <div className="flex items-start">
                      <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Criação de simulados ou peças</span>
                    </div>
                    <div className="flex items-start">
                      <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Cadernos aprimorados pela IA</span>
                    </div>
                    <div className="flex items-start">
                      <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Exportação de cadernos para Word</span>
                    </div>
                  </div>
                </div>

                <Link to="/register" className="w-full mt-auto">
                  <Button className="w-full mt-6 h-12 bg-[#4F1964] hover:bg-[#6B3182]">
                    Começar Grátis
                  </Button>
                </Link>
              </div>
            </div>

            {/* Plano Essencial */}
            <div className="rounded-2xl bg-white border-2 border-[#4F1964]/30 overflow-hidden shadow-lg transform transition-transform hover:scale-105 flex flex-col h-full">
              <div className="bg-[#4F1964]/10 p-6 text-center flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-[#4F1964]">Menthor Aprendiz</h3>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#4F1964]">R$39,90</span>
                  <span className="ml-1 text-[#4F1964]/70">/mês</span>
                </div>
                <p className="mt-2 text-sm text-[#4F1964]/80 min-h-[40px]">Para quem quer ter um mentor de verdade na preparação.</p>
              </div>

              <div className="p-6 space-y-4 flex-grow flex flex-col">
                <div className="space-y-3 flex-grow">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Acesso completo ao banco de questões da 1ª e 2ª fase FGV</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Resolva provas e converse com o Menthor diretamente abaixo das questões</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>A IA interage com o enunciado e alternativas, explica seus erros e tira dúvidas em tempo real</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Treinamento para a 2ª fase com acesso ao banco de provas reais</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>A IA corrige sua peça como um examinador, dá feedback e responde suas dúvidas</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Crie cadernos com ajuda da IA e organize por tema e matéria</span>
                  </div>
                </div>

                <Link to="/pagamento-essencial" className="w-full mt-auto">
                  <Button className="w-full mt-6 h-12 bg-[#4F1964] hover:bg-[#6B3182]">Assinar Menthor Aprendiz</Button>
                </Link>
              </div>
            </div>

            {/* Plano Profissional */}
            <div className="rounded-2xl bg-white border-2 border-[#4F1964] overflow-hidden shadow-xl transform transition-transform hover:scale-105 relative flex flex-col h-full">
              <div className="absolute top-0 right-0 bg-[#4F1964] text-white px-4 py-1 text-sm font-medium">Mais vendido!</div>
              <div className="bg-[#4F1964] text-white p-6 text-center flex flex-col justify-center">
                <h3 className="text-2xl font-bold flex items-center justify-center">
                  Menthor Avançado
                  <Star className="h-5 w-5 ml-2 fill-yellow-300 text-yellow-300" />
                </h3>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-3xl font-bold">R$59,90</span>
                  <span className="ml-1 text-white/80">/mês</span>
                </div>
                <p className="mt-2 text-sm text-white/80 min-h-[40px]">Para quem quer um plano estratégico com ferramentas inteligentes. </p>
              </div>

              <div className="p-6 space-y-4 flex-grow flex flex-col">
                <div className="space-y-3 flex-grow">
                  <div className="flex items-start font-medium text-[#4F1964]">
                    <span>Tudo do plano Essencial, e mais:</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>O Menthor cria simulados completos da 1ª fase com foco nos temas que mais caem</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Acompanha sua resolução com explicações personalizadas e análise de desempenho</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Gere peças da 2ª fase personalizadas: escolha a área, o tipo de peça, e a IA entrega o enunciado, corrige e oferece um modelo nota 10</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Solicite questões estilo FGV sobre os temas em que mais tem dificuldade</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Exporte cadernos otimizados pela IA direto para Word</span>
                  </div>
                </div>

                <Link to="/pagamento-profissional" className="w-full mt-auto">
                  <Button className="w-full mt-6 h-12 bg-[#4F1964] hover:bg-[#6B3182]">Assinar Menthor Avançado</Button>
                </Link>
              </div>
            </div>

            {/* Plano Institucional */}
            <div className="rounded-2xl bg-white border-2 border-[#4F1964]/30 overflow-hidden shadow-lg transform transition-transform hover:scale-105 flex flex-col h-full">
              <div className="bg-[#4F1964]/10 p-6 text-center flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-[#4F1964]">Plano Institucional</h3>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#4F1964]">Sob Consulta</span>
                </div>
                <p className="mt-2 text-sm text-[#4F1964]/80 min-h-[40px]">Para universidades e cursinhos que querem inovar o ensino jurídico.</p>
              </div>

              <div className="p-6 space-y-4 flex-grow flex flex-col">
                <div className="space-y-3 flex-grow">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Licenças para múltiplos alunos</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Painel pedagógico com métricas e desempenho</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Provas no estilo da instituição, criadas com apoio da IA</span>
                  </div>
                  <div className="flex items-start">
                    
                    
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Treinamento e suporte pedagógico para professores</span>
                  </div>
                </div>

                <Link to="/login" className="w-full mt-auto">
                  <Button className="w-full mt-6 h-12 bg-[#4F1964] hover:bg-[#6B3182]">
                    Fale com a gente
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Perguntas Frequentes - Layout redesenhado */}
      <section className="py-20 bg-gradient-to-br from-[#F8E6FF]/30 to-[#4F1964]/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="bg-[#F8E6FF] px-4 py-1.5 rounded-full text-sm font-medium text-[#4F1964] mb-4 inline-block">
              Dúvidas?
            </span>
            <h2 className="text-4xl font-bold text-[#4F1964] mb-4">Perguntas Frequentes</h2>
            <p className="text-foreground/80 text-lg">
              Tire suas dúvidas sobre o Menthor e nossa plataforma de estudos
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna 1 */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#4F1964]/10">
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-5 text-left border-b border-[#4F1964]/10 hover:bg-[#F8E6FF]/10 transition-colors">
                    <h3 className="font-semibold text-lg text-[#4F1964]">O que é o Menthor, exatamente?</h3>
                    <div className="rounded-full bg-[#F8E6FF]/50 p-1">
                      {expandedFaq === 'faq-1' ? <MinusCircle className="h-5 w-5 text-[#4F1964]" /> : <PlusCircle className="h-5 w-5 text-[#4F1964]" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-5 bg-[#F8E6FF]/5 text-gray-700">
                    <p>O Menthor é uma plataforma de estudos jurídicos com uma IA treinada exclusivamente para provas da OAB. Ela entende a banca FGV, os padrões das questões e das peças jurídicas, e te ajuda a estudar com clareza, foco e estratégia.</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#4F1964]/10">
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-5 text-left border-b border-[#4F1964]/10 hover:bg-[#F8E6FF]/10 transition-colors">
                    <h3 className="font-semibold text-lg text-[#4F1964]">A IA realmente entende do conteúdo jurídico?</h3>
                    <div className="rounded-full bg-[#F8E6FF]/50 p-1">
                      {expandedFaq === 'faq-2' ? <MinusCircle className="h-5 w-5 text-[#4F1964]" /> : <PlusCircle className="h-5 w-5 text-[#4F1964]" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-5 bg-[#F8E6FF]/5 text-gray-700">
                    <p>Sim! O Menthor foi treinado com base em milhares de questões da FGV, peças de segunda fase, legislação e doutrina. Ele não dá "respostas genéricas" — ele explica com base no padrão da OAB, como se fosse um corretor experiente.</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#4F1964]/10">
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-5 text-left border-b border-[#4F1964]/10 hover:bg-[#F8E6FF]/10 transition-colors">
                    <h3 className="font-semibold text-lg text-[#4F1964]">Qual a diferença entre o Plano Essencial e o Profissional?</h3>
                    <div className="rounded-full bg-[#F8E6FF]/50 p-1">
                      {expandedFaq === 'faq-3' ? <MinusCircle className="h-5 w-5 text-[#4F1964]" /> : <PlusCircle className="h-5 w-5 text-[#4F1964]" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-5 bg-[#F8E6FF]/5 text-gray-700">
                    <p>No Plano Menthor Aprendiz, você tem acesso ao banco completo de questões da OAB (1ª e 2ª fase), com explicações personalizadas, correção de peças e criação de cadernos.</p>
                    <p className="mt-2">Já no Plano Menthor Avançado, além disso, o Menthor cria simulados completos da 1ª fase, elabora peças simuladas da 2ª fase com enunciado, correção e modelo ideal. Também permite que você solicite questões personalizadas conforme suas dificuldades.</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#4F1964]/10">
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-5 text-left border-b border-[#4F1964]/10 hover:bg-[#F8E6FF]/10 transition-colors">
                    <h3 className="font-semibold text-lg text-[#4F1964]">O Menthor cria peças de segunda fase?</h3>
                    <div className="rounded-full bg-[#F8E6FF]/50 p-1">
                      {expandedFaq === 'faq-5' ? <MinusCircle className="h-5 w-5 text-[#4F1964]" /> : <PlusCircle className="h-5 w-5 text-[#4F1964]" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-5 bg-[#F8E6FF]/5 text-gray-700">
                    <p>Sim! No plano Menthor Avançado, você escolhe a área e o tipo de peça que deseja treinar. A plataforma propõe um enunciado, oferece um espaço de escrita e, ao final, apresenta correções e um modelo de peça ideal para referência, como forma de aprendizado.</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#4F1964]/10">
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-5 text-left border-b border-[#4F1964]/10 hover:bg-[#F8E6FF]/10 transition-colors">
                    <h3 className="font-semibold text-lg text-[#4F1964]">Posso exportar os cadernos criados pela IA?</h3>
                    <div className="rounded-full bg-[#F8E6FF]/50 p-1">
                      {expandedFaq === 'faq-6' ? <MinusCircle className="h-5 w-5 text-[#4F1964]" /> : <PlusCircle className="h-5 w-5 text-[#4F1964]" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-5 bg-[#F8E6FF]/5 text-gray-700">
                    <p>Sim! No Menthor Profissional, os cadernos otimizados pela IA podem ser exportados para Word com formatação limpa e organizada, prontos para impressão ou revisão.</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
            
            {/* Coluna 2 */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#4F1964]/10">
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-5 text-left border-b border-[#4F1964]/10 hover:bg-[#F8E6FF]/10 transition-colors">
                    <h3 className="font-semibold text-lg text-[#4F1964]">Como funciona o uso da inteligência artificial na plataforma? Tem um limite?</h3>
                    <div className="rounded-full bg-[#F8E6FF]/50 p-1">
                      {expandedFaq === 'faq-4' ? <MinusCircle className="h-5 w-5 text-[#4F1964]" /> : <PlusCircle className="h-5 w-5 text-[#4F1964]" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-5 bg-[#F8E6FF]/5 text-gray-700">
                    <p>Todos os planos do Menthor contam com um limite diário inteligente de uso da IA, pensado para oferecer autonomia e constância nos estudos, sem desperdício — nem exagero.</p>
                    
                    <p className="mt-3 font-medium">No Plano Aprendiz, você pode:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Resolver questões com correções completas da IA</li>
                      <li>Tirar dúvidas com explicações detalhadas, diretamente no simulado</li>
                      <li>Corrigir peças da 2ª fase com feedback como um corretor de verdade</li>
                      <li>Criar e organizar seus cadernos com apoio da IA</li>
                    </ul>
                    
                    <p className="mt-3">Esse uso diário equivale a algo como 30 páginas de Word em interações (explicações e correções), mais 20 páginas de cadernos gerados pela IA — o que atende perfeitamente uma rotina de estudos consistente.</p>
                    
                    <p className="mt-3 font-medium">No Plano Avançado, você tem tudo isso e ainda pode:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Solicitar a criação de até 80 novas questões por dia (um simulado completo)</li>
                      <li>Receber até 3 peças simuladas da 2ª fase por dia, com enunciado, correção e modelo ideal</li>
                      <li>Pedir criação de questões avulsas sobre os temas que quiser revisar</li>
                    </ul>
                    
                    <p className="mt-3">Nosso objetivo é garantir que você tenha um mentor jurídico ativo e presente todos os dias, com autonomia real, no ritmo certo para o seu aprendizado.</p>
                    
                    <p className="mt-3 text-[#4F1964] font-medium cursor-pointer hover:underline">Clique aqui para ver a tabela completa de limites diários</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#4F1964]/10">
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-5 text-left border-b border-[#4F1964]/10 hover:bg-[#F8E6FF]/10 transition-colors">
                    <h3 className="font-semibold text-lg text-[#4F1964]">Posso conversar com a IA durante o estudo?</h3>
                    <div className="rounded-full bg-[#F8E6FF]/50 p-1">
                      {expandedFaq === 'faq-7' ? <MinusCircle className="h-5 w-5 text-[#4F1964]" /> : <PlusCircle className="h-5 w-5 text-[#4F1964]" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-5 bg-[#F8E6FF]/5 text-gray-700">
                    <p>Sim! Durante a resolução das questões, há uma área para conversar com o Menthor. Ele explica por que sua resposta está errada, mostra o que a banca espera e esclarece dúvidas jurídicas — tudo na hora.</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#4F1964]/10">
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-5 text-left border-b border-[#4F1964]/10 hover:bg-[#F8E6FF]/10 transition-colors">
                    <h3 className="font-semibold text-lg text-[#4F1964]">Posso cancelar minha assinatura quando quiser?</h3>
                    <div className="rounded-full bg-[#F8E6FF]/50 p-1">
                      {expandedFaq === 'faq-8' ? <MinusCircle className="h-5 w-5 text-[#4F1964]" /> : <PlusCircle className="h-5 w-5 text-[#4F1964]" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-5 bg-[#F8E6FF]/5 text-gray-700">
                    <p>Sim! Você pode cancelar sua assinatura a qualquer momento — sem burocracia.</p>
                    <p className="mt-2">E se for dentro dos primeiros 7 dias após a contratação, garantimos o reembolso total, conforme o direito de arrependimento previsto no Código de Defesa do Consumidor.</p>
                    <p className="mt-2">Para solicitar o reembolso, é só enviar um e-mail para: institucional@menthor.tec.br</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#4F1964]/10">
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-5 text-left border-b border-[#4F1964]/10 hover:bg-[#F8E6FF]/10 transition-colors">
                    <h3 className="font-semibold text-lg text-[#4F1964]">Posso testar antes de assinar?</h3>
                    <div className="rounded-full bg-[#F8E6FF]/50 p-1">
                      {expandedFaq === 'faq-9' ? <MinusCircle className="h-5 w-5 text-[#4F1964]" /> : <PlusCircle className="h-5 w-5 text-[#4F1964]" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-5 bg-[#F8E6FF]/5 text-gray-700">
                    <p>Sim! O plano gratuito oferece 10 questões de 1ª fase por dia, com correção e explicações da IA. Assim, você testa a qualidade do Menthor antes de escolher um plano pago.</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#4F1964]/10">
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-5 text-left border-b border-[#4F1964]/10 hover:bg-[#F8E6FF]/10 transition-colors">
                    <h3 className="font-semibold text-lg text-[#4F1964]">Meus dados estão seguros?</h3>
                    <div className="rounded-full bg-[#F8E6FF]/50 p-1">
                      {expandedFaq === 'faq-10' ? <MinusCircle className="h-5 w-5 text-[#4F1964]" /> : <PlusCircle className="h-5 w-5 text-[#4F1964]" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-5 bg-[#F8E6FF]/5 text-gray-700">
                    <p>Sim! A proteção dos seus dados é uma prioridade para o Menthor.</p>
                    <p className="mt-2">Seguimos rigorosamente a Lei Geral de Proteção de Dados (LGPD) e utilizamos práticas de segurança modernas para garantir a privacidade das suas informações.</p>
                    <p className="mt-2">A plataforma foi idealizada por profissionais do Direito com especialização em proteção de dados e inteligência artificial, o que reforça nosso compromisso com o uso responsável da tecnologia no ambiente educacional.</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nova seção "O que a Oráculos.IA entrega pra você" */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="bg-[#F8E6FF] px-4 py-1.5 rounded-full text-sm font-medium text-[#4F1964] mb-4 inline-block">
              Sua Jornada
            </span>
            <h2 className="text-4xl font-bold text-[#4F1964] mb-4">O que o Menthor entrega pra você que quer passar na OAB</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1 - Simulados com IA */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-[#4F1964]/10 hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="w-14 h-14 bg-[#F8E6FF] rounded-full flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-[#4F1964]" />
              </div>
              <h3 className="text-xl font-bold text-[#4F1964] mb-3">Simulados Jurídicos com Correção Inteligente</h3>
              <p className="text-foreground/80 mb-4">Treine e receba explicações que realmente ensinam</p>
              <ul className="space-y-3 text-foreground/80 flex-grow">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Geração de simulados personalizados pela IA</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Correção automática com explicações claras</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Opção de refazer provas antigas e tirar dúvidas com o Menthor</span>
                </li>
              </ul>
            </div>

            {/* Box 2 - Cadernos Inteligentes */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-[#4F1964]/10 hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="w-14 h-14 bg-[#F8E6FF] rounded-full flex items-center justify-center mb-6">
                <Book className="h-7 w-7 text-[#4F1964]" />
              </div>
              <h3 className="text-xl font-bold text-[#4F1964] mb-3">Cadernos Inteligentes e Estudo Direcionado</h3>
              <p className="text-foreground/80 mb-4">Transforme seus rascunhos em conteúdo pronto pra revisão</p>
              <ul className="space-y-3 text-foreground/80 flex-grow">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                  <span>IA complementa seus textos e organiza os estudos por disciplina</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Geração automática de resumos e estrutura de cadernos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Exportação para Word com apenas 1 clique</span>
                </li>
              </ul>
            </div>

            {/* Box 3 - Análise de desempenho */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-[#4F1964]/10 hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="w-14 h-14 bg-[#F8E6FF] rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-[#4F1964]" />
              </div>
              <h3 className="text-xl font-bold text-[#4F1964] mb-3">Análise de desempenho simplificada</h3>
              <p className="text-foreground/80 mb-4">Entenda seus pontos fortes e fracos com dados claros</p>
              <ul className="space-y-3 text-foreground/80 flex-grow">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Acompanhamento de desempenho por matéria</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Estudo direcionado com base nos seus erros e acertos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#4F1964] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Estude com mais foco e segurança</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative mt-16 py-6 px-8 bg-gradient-to-r from-[#4F1964] to-[#6B3182] rounded-xl text-white text-center shadow-lg overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <Sparkles className="absolute top-4 left-12 h-6 w-6 text-white/20" />
              <Sparkles className="absolute bottom-4 right-12 h-8 w-8 text-white/20" />
              <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/5 blur-xl"></div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/5 blur-xl"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Com o Menthor, você estuda com estratégia e acompanhamento de verdade.
            </h3>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Prática, dedicação, revisão e correção com inteligência.
              </p>
              <Link to="/register" className="mt-6 inline-block">
                <Button size="lg" variant="outline" className="bg-white text-[#4F1964] hover:bg-white/90 border-none">
                  Comece sua jornada agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default Index;
