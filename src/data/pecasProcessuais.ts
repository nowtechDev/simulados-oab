
import { ExamQuestion, Peca } from "@/types/simulador";

// Exemplo de questões para a segunda fase
const questoesSegundaFase: ExamQuestion[] = [
  {
    id: 1,
    text: "Acerca das medidas cautelares no processo penal, assinale a alternativa correta:",
    options: [
      {
        id: "A",
        text: "A prisão preventiva somente pode ser decretada pelo juiz, de ofício, no curso da ação penal."
      },
      {
        id: "B",
        text: "As medidas cautelares não podem ser aplicadas cumulativamente."
      },
      {
        id: "C",
        text: "O juiz poderá substituir a prisão preventiva pela domiciliar quando o agente for maior de 80 anos."
      },
      {
        id: "D",
        text: "A monitoração eletrônica é medida cautelar diversa da prisão prevista expressamente no Código de Processo Penal."
      }
    ],
    correctOption: "D",
    explanation: "A monitoração eletrônica está expressamente prevista no art. 319, IX, do CPP como medida cautelar diversa da prisão. A alternativa A está incorreta porque, conforme o art. 311 do CPP, a prisão preventiva não pode ser decretada de ofício pelo juiz na fase investigativa. A alternativa B está incorreta porque o art. 282, § 1º do CPP permite a cumulação de medidas cautelares. A alternativa C está incorreta porque o art. 318 do CPP estabelece que o maior de 80 anos 'poderá' ter a prisão preventiva substituída pela domiciliar, sendo uma faculdade do juiz e não uma obrigação.",
    area: "Direito Penal"
  },
  {
    id: 2,
    text: "No âmbito do processo penal, a respeito da prisão temporária, assinale a alternativa correta:",
    options: [
      {
        id: "A",
        text: "A prisão temporária poderá ser decretada em face de representação da autoridade policial ou requerimento do Ministério Público, não podendo ser determinada de ofício pelo juiz."
      },
      {
        id: "B",
        text: "A prisão temporária poderá ser decretada em qualquer fase da investigação policial ou do processo penal."
      },
      {
        id: "C",
        text: "Decretada a prisão temporária, o juiz não poderá conceder liberdade provisória ao preso."
      },
      {
        id: "D",
        text: "A prisão temporária poderá ser decretada para todos os crimes, desde que imprescindível para as investigações."
      }
    ],
    correctOption: "A",
    explanation: "A alternativa A está correta. Conforme dispõe o art. 2º da Lei nº 7.960/89, 'a prisão temporária será decretada pelo Juiz, em face da representação da autoridade policial ou de requerimento do Ministério Público'. Não há previsão legal para decretação de ofício. A alternativa B está incorreta porque a prisão temporária só é cabível na fase pré-processual (investigação policial). A alternativa C está incorreta, pois o juiz pode revogar a prisão temporária se não subsistirem os motivos que a ensejaram. A alternativa D está incorreta porque a prisão temporária só é cabível para os crimes elencados no art. 1º, III, da Lei nº 7.960/89.",
    area: "Direito Penal"
  },
  {
    id: 3,
    text: "A respeito das nulidades no processo penal, assinale a alternativa correta:",
    options: [
      {
        id: "A",
        text: "A nulidade por incompetência territorial do juízo pode ser reconhecida a qualquer tempo, mesmo após a sentença definitiva."
      },
      {
        id: "B",
        text: "As nulidades ocorridas no inquérito policial sempre causam a nulidade do processo penal."
      },
      {
        id: "C",
        text: "As nulidades deverão ser alegadas na primeira oportunidade em que couber à parte falar nos autos, sob pena de preclusão."
      },
      {
        id: "D",
        text: "Reconhecida uma nulidade relativa, o ato processual será renovado, voltando o processo à fase em que estava quando da prática do ato anulado."
      }
    ],
    correctOption: "C",
    explanation: "A alternativa C está correta. O art. 571 do Código de Processo Penal estabelece que 'as nulidades deverão ser arguidas: I - as da instrução criminal dos processos da competência do júri, nos prazos a que se refere o art. 406; II - as da instrução criminal dos processos de competência do juiz singular e dos processos especiais, salvo os dos Capítulos V e VII do Título II do Livro II, nos prazos a que se refere o art. 500; III - as do processo sumário, no prazo a que se refere o art. 537, ou, se verificadas depois desse prazo, logo depois de aberta a audiência e apregoadas as partes; IV - as do processo regulado no Capítulo VII do Título II do Livro II, logo depois de aberta a audiência; V - as ocorridas posteriormente à pronúncia, logo depois de anunciado o julgamento e apregoadas as partes; VI - as de instrução criminal dos processos de competência do Supremo Tribunal Federal e dos Tribunais de Apelação, nos prazos a que se refere o art. 500; VII - se verificadas após a decisão da primeira instância, nas razões de recurso ou logo depois de anunciado o julgamento do recurso e apregoadas as partes; VIII - as do julgamento em plenário, em audiência ou em sessão do tribunal, logo depois de ocorrerem.'",
    area: "Direito Penal"
  },
  {
    id: 4,
    text: "Com relação ao estado de necessidade no Direito Penal, assinale a alternativa correta:",
    options: [
      {
        id: "A",
        text: "É causa excludente de tipicidade."
      },
      {
        id: "B",
        text: "Somente exclui a ilicitude quando o bem protegido é mais valioso que o bem sacrificado."
      },
      {
        id: "C",
        text: "Considera-se em estado de necessidade quem pratica o fato para salvar de perigo atual, que não provocou por sua vontade, nem podia de outro modo evitar, direito próprio ou alheio, cujo sacrifício, nas circunstâncias, não era razoável exigir-se."
      },
      {
        id: "D",
        text: "Não responde pelo excesso doloso ou culposo aquele que, agindo em estado de necessidade, exceder os limites da excludente."
      }
    ],
    correctOption: "C",
    explanation: "A alternativa C está correta pois reproduz o texto do art. 24 do Código Penal: 'Considera-se em estado de necessidade quem pratica o fato para salvar de perigo atual, que não provocou por sua vontade, nem podia de outro modo evitar, direito próprio ou alheio, cujo sacrifício, nas circunstâncias, não era razoável exigir-se.' A alternativa A está incorreta porque o estado de necessidade é causa excludente de ilicitude, não de tipicidade. A alternativa B está incorreta porque o CP adota a teoria unitária do estado de necessidade, não exigindo que o bem protegido seja mais valioso que o sacrificado. A alternativa D está incorreta porque, conforme o art. 23, parágrafo único, do CP, 'o agente, em qualquer das hipóteses deste artigo, responderá pelo excesso doloso ou culposo.'",
    area: "Direito Penal"
  }
];

export const pecaExemplo: Peca = {
  id: "1",
  titulo: "Peça Processual - Direito Penal",
  tipo: "Alegações Finais",
  descricao: "Elabore as alegações finais em favor do acusado conforme o caso apresentado.",
  area: "Direito Penal",
  problema: `Na madrugada do dia 1º de janeiro de 2020, Luiz, nascido em 24 de abril de 1948, estava em sua residência, em
Porto Alegre, na companhia de seus três filhos e do irmão Igor, nascido em 29 de novembro de 1965, que
também morava há dois anos no mesmo imóvel. Em determinado momento, um dos filhos de Luiz acionou fogos
de artifício, no quintal do imóvel, para comemorar a chegada do novo ano. Ocorre que as faíscas atingiram o
telhado da casa, que começou a pegar fogo. Todos correram para sair pela única e pequena porta da casa, mas
Luiz, em razão de sua idade e pela dificuldade de locomoção, acabou ficando por último na fila para saída da
residência. Percebendo que o fogo estava dele se aproximando e que iria atingi-lo em segundos, Luiz desferiu um
forte soco na cabeça do irmão, que estava em sua frente, conseguindo deixar o imóvel. Igor ficou caído por alguns
momentos, mas conseguiu sair da casa da família, sangrando em razão do golpe recebido.

Policiais chegaram ao local do ocorrido, sendo instaurado procedimento para investigar a autoria do crime de
incêndio e outro procedimento para apurar o crime de lesão corporal. Luiz, verificando as consequências de seus
atos, imediatamente levou o irmão para unidade de saúde e pagou pelo tratamento médico necessário. Igor
compareceu em sede policial após ser intimado, narrando o ocorrido, apesar de destacar não ter interesse em ver
o autor do fato responsabilizado criminalmente.

Concluídas as investigações em relação ao crime de lesão, os autos foram encaminhados ao Ministério Público,
que, com base no laudo prévio de lesão corporal de Igor atestando a existência de lesão de natureza leve na
cabeça, ofereceu denúncia, perante a 5ª Vara Criminal de Porto Alegre/RS, órgão competente, em face de Luiz
como incurso nas sanções penais do Art. 129, § 9º, do Código Penal. Deixou o órgão acusador de oferecer
proposta de suspensão condicional do processo com fundamento no Art. 41 da Lei nº 11.340/06, que veda a
aplicação dos institutos da Lei nº 9.099/95, tendo em vista que aquela lei (Lei nº 11.340/06) estabeleceu nova
pena para o delito imputado.

Após citação e apresentação de resposta à acusação, na qual Luiz demonstrou interesse na aplicação do Art. 89
da Lei nº 9.099/95, os fatos foram integralmente confirmados durante a instrução probatória. Igor confirmou a
agressão, a ajuda posterior do irmão e o desinteresse em responsabilizá-lo. O réu permaneceu em silêncio
durante seu interrogatório. Em seguida, foi acostado ao procedimento o laudo definitivo de lesão corporal da
vítima atestando a existência de lesões de natureza leve, assim como a Folha de Antecedentes Criminais de Luiz,
que registrava uma única condenação, com trânsito em julgado em 10 de dezembro de 2019, pela prática de
contravenção penal.

O Ministério Público apresentou a manifestação cabível requerendo a condenação do réu nos termos da
denúncia, destacando, ainda, a incidência do Art. 61, inciso I, do CP. Em seguida, a defesa técnica de Luiz foi
intimada, em 19 de janeiro de 2021, terça-feira, para apresentação da medida cabível.

Considerando apenas as informações expostas, apresente, na condição de advogado(a) de Luiz, a peça jurídica
cabível, diferente do habeas corpus e embargos de declaração, expondo todas as teses cabíveis de direito
material e processual. A peça deverá ser datada no último dia do prazo para apresentação, devendo segunda a
sexta-feira serem considerados dias úteis em todo o país.

Obs.: o examinando deve abordar todas os fundamentos de Direito que possam ser utilizados para dar respaldo à pretensão.
A mera citação do dispositivo legal não confere pontuação.`,
  orientacoes: [
    "Identifique a peça jurídica adequada",
    "Observe o prazo processual indicado no enunciado",
    "Elabore as teses de defesa conforme os fatos narrados",
    "Fundamente os argumentos com base na legislação penal aplicável",
    "Cite os dispositivos legais pertinentes, explicando sua aplicação ao caso",
    "Estruture corretamente a peça com endereçamento, qualificação e pedidos"
  ],
  gabarito: `ALEGAÇÕES FINAIS

EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA 5ª VARA CRIMINAL DA COMARCA DE PORTO ALEGRE/RS

Processo nº [Número do Processo]

LUIZ, já devidamente qualificado nos autos do processo em epígrafe, por intermédio de seu advogado que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência, apresentar ALEGAÇÕES FINAIS, pelos fatos e fundamentos a seguir expostos:

I – SÍNTESE DOS FATOS

Trata-se de ação penal pública incondicionada em que o Ministério Público imputa ao réu a prática do delito previsto no art. 129, § 9º, do Código Penal (lesão corporal no âmbito doméstico), por ter, supostamente, desferido um forte soco na cabeça de seu irmão, Igor, que resultou em lesões de natureza leve.

Conforme consta dos autos, no dia 1º de janeiro de 2020, a residência onde o réu, a vítima e os filhos do réu moravam começou a pegar fogo após um dos filhos acionar fogos de artifício que atingiram o telhado. Na iminência de ser atingido pelo fogo, o réu desferiu um soco na cabeça do irmão, que estava à sua frente, para conseguir sair da residência.

Após o ocorrido, o réu imediatamente levou a vítima para atendimento médico e arcou com todas as despesas do tratamento. A vítima declarou expressamente não ter interesse na responsabilização criminal do autor do fato.

O Ministério Público ofereceu denúncia, imputando ao réu a prática do crime previsto no art. 129, § 9º, do Código Penal, e deixou de oferecer a proposta de suspensão condicional do processo sob fundamento de aplicação do art. 41 da Lei nº 11.340/06.

Ao final, o Ministério Público requereu a condenação do réu nos termos da denúncia, com a incidência da agravante do art. 61, inciso I, do Código Penal.

É o breve relatório.

II – DO MÉRITO

1. DA LEGÍTIMA DEFESA

Inicialmente, cumpre destacar que o acusado agiu em legítima defesa, causa excludente de ilicitude prevista no art. 25 do Código Penal, que assim dispõe:

"Art. 25. Entende-se em legítima defesa quem, usando moderadamente dos meios necessários, repele injusta agressão, atual ou iminente, a direito seu ou de outrem."

No caso em tela, o acusado encontrava-se em situação de perigo iminente, com risco concreto à sua vida, em razão do incêndio que se alastrava rapidamente pela residência. A única saída da residência era uma porta pequena, e o acusado, por ser idoso (71 anos à época dos fatos) e ter dificuldade de locomoção, estava em situação de vulnerabilidade extrema.

A conduta do acusado foi a única forma encontrada para preservar sua própria vida diante do perigo real e iminente de ser atingido pelo fogo. O meio utilizado foi proporcional ao perigo enfrentado, pois o soco, embora tenha causado lesão, permitiu sua saída e não resultou em consequências mais graves à vítima.

Portanto, estão presentes todos os requisitos da legítima defesa:
a) agressão injusta (o fogo que ameaçava sua vida);
b) atualidade ou iminência da agressão (o fogo se aproximava rapidamente);
c) defesa de direito próprio (preservação da vida);
d) uso moderado dos meios necessários (soco que permitiu sua saída e não resultou em lesão grave).

2. DO ESTADO DE NECESSIDADE

Subsidiariamente, caso não se entenda pela legítima defesa, configura-se o estado de necessidade, causa excludente de ilicitude prevista no art. 24 do Código Penal:

"Art. 24. Considera-se em estado de necessidade quem pratica o fato para salvar de perigo atual, que não provocou por sua vontade, nem podia de outro modo evitar, direito próprio ou alheio, cujo sacrifício, nas circunstâncias, não era razoável exigir-se."

O acusado estava diante de uma situação de perigo atual (incêndio) que não provocou por sua vontade. Não havia outro modo de evitar o perigo senão deslocando a vítima que estava à sua frente, uma vez que a casa possuía apenas uma saída, que estava obstruída. O sacrifício da integridade física da vítima, causando-lhe apenas lesões leves, não era desproporcional diante do risco à vida do acusado.

Ademais, o § 2º do art. 24 do Código Penal estabelece que, mesmo que o agente exceda os limites do estado de necessidade, poderá ter sua pena reduzida ou mesmo ser isento dela, se o fato é cometido por escusável medo, surpresa ou perturbação de ânimo.

No caso concreto, o acusado estava em situação de pânico, diante do fogo que se alastrava, o que justifica eventuais excessos na sua conduta para salvar sua própria vida.

3. DA INAPLICABILIDADE DA LEI MARIA DA PENHA E DA CABIMENTO DA SUSPENSÃO CONDICIONAL DO PROCESSO

O Ministério Público incorreu em erro ao fundamentar a não aplicação da suspensão condicional do processo com base no art. 41 da Lei nº 11.340/06 (Lei Maria da Penha).

A Lei Maria da Penha destina-se a coibir e prevenir a violência doméstica e familiar contra a mulher, conforme estabelece seu art. 1º:

"Art. 1º Esta Lei cria mecanismos para coibir e prevenir a violência doméstica e familiar contra a mulher, nos termos do § 8º do art. 226 da Constituição Federal, da Convenção sobre a Eliminação de Todas as Formas de Violência contra a Mulher, da Convenção Interamericana para Prevenir, Punir e Erradicar a Violência contra a Mulher e de outros tratados internacionais ratificados pela República Federativa do Brasil; dispõe sobre a criação dos Juizados de Violência Doméstica e Familiar contra a Mulher; e estabelece medidas de assistência e proteção às mulheres em situação de violência doméstica e familiar."

No caso em tela, a vítima é Igor, irmão do acusado, pessoa do sexo masculino, não se enquadrando no âmbito de proteção da Lei Maria da Penha. Portanto, é inaplicável o art. 41 da Lei nº 11.340/06, que veda a aplicação dos institutos da Lei nº 9.099/95 somente aos casos de violência doméstica contra a mulher.

Assim, tendo em vista que o delito imputado ao acusado (art. 129, § 9º, do CP) possui pena mínima de 3 meses, inferior a 1 ano, é perfeitamente cabível a suspensão condicional do processo, nos termos do art. 89 da Lei nº 9.099/95:

"Art. 89. Nos crimes em que a pena mínima cominada for igual ou inferior a um ano, abrangidas ou não por esta Lei, o Ministério Público, ao oferecer a denúncia, poderá propor a suspensão do processo, por dois a quatro anos, desde que o acusado não esteja sendo processado ou não tenha sido condenado por outro crime, presentes os demais requisitos que autorizariam a suspensão condicional da pena (art. 77 do Código Penal)."

O acusado manifestou expressamente interesse na aplicação desse benefício em sua resposta à acusação e preenche os requisitos legais, pois não está sendo processado por outro crime e sua única condenação anterior é por contravenção penal, o que não impede a concessão do benefício.

4. DA INEXISTÊNCIA DE REPRESENTAÇÃO DA VÍTIMA

Considerando que o crime de lesão corporal leve no âmbito doméstico é de ação penal pública condicionada à representação, conforme entendimento firmado pelo Supremo Tribunal Federal no julgamento da ADI 4424, e tendo a vítima manifestado expressamente o desinteresse na responsabilização criminal do autor do fato, resta configurada a ausência de condição de procedibilidade da ação penal.

A vítima Igor compareceu em sede policial e destacou não ter interesse em ver o autor do fato responsabilizado criminalmente, o que configura retratação da representação, que é admissível até o oferecimento da denúncia, nos termos do art. 25 do Código de Processo Penal.

5. DA PERDÃO JUDICIAL OU RECONHECIMENTO DE CAUSA DE DIMINUIÇÃO DE PENA

Subsidiariamente, caso Vossa Excelência entenda pelo prosseguimento da ação penal e eventual condenação, requer-se o reconhecimento do perdão judicial, nos termos do art. 120 do Código Penal, ou a aplicação de causa de diminuição de pena, com fundamento no arrependimento eficaz (art. 15 do CP) ou arrependimento posterior (art. 16 do CP).

O acusado, imediatamente após o fato, levou a vítima para atendimento médico e arcou com todas as despesas do tratamento, demonstrando seu arrependimento e a reparação do dano, o que justifica a aplicação dos referidos institutos.

6. DO AFASTAMENTO DA AGRAVANTE PREVISTA NO ART. 61, I, DO CP

O Ministério Público requereu a aplicação da agravante prevista no art. 61, I, do Código Penal (reincidência). Contudo, conforme consta dos autos, o acusado possui apenas uma condenação anterior, com trânsito em julgado em 10 de dezembro de 2019, pela prática de contravenção penal.

De acordo com o entendimento do Superior Tribunal de Justiça (REsp 1.710.154/MG), a condenação anterior por contravenção penal não gera reincidência para crimes. Nesse sentido:

"A condenação anterior por contravenção penal não serve para caracterizar a agravante genérica da reincidência em crime posteriormente praticado."

Portanto, não há que se falar em reincidência no presente caso, devendo ser afastada a agravante prevista no art. 61, I, do CP.

III – PEDIDOS

Ante o exposto, requer-se:

a) Preliminarmente, o reconhecimento da ausência de condição de procedibilidade, em razão da manifestação expressa da vítima de desinteresse na responsabilização criminal do acusado, com a consequente extinção da punibilidade;

b) No mérito, a absolvição do acusado com fundamento no art. 386, VI, do Código de Processo Penal, em razão da existência de legítima defesa ou estado de necessidade;

c) Subsidiariamente, caso não seja acolhido o pedido de absolvição, requer-se:
c.1) A aplicação da suspensão condicional do processo, nos termos do art. 89 da Lei nº 9.099/95;
c.2) O reconhecimento do perdão judicial ou a aplicação de causa de diminuição de pena com fundamento no arrependimento eficaz ou posterior;
c.3) O afastamento da agravante prevista no art. 61, I, do Código Penal.

Termos em que,
Pede deferimento.

Porto Alegre, 22 de janeiro de 2021.

[Nome do Advogado]
OAB/RS [número]`,
  questoes: questoesSegundaFase
};
