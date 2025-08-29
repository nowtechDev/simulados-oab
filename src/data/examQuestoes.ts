
export type ExamQuestion = {
  id: number;
  text: string;
  options: { id: string; text: string }[];
  correctOption: string;
  explanation: string;
  area: string;
};

type ExamData = {
  [key: string]: {
    title: string;
    totalQuestions: number;
    timeLimit: string;
    questions: ExamQuestion[];
  }
};

export const examQuestoes: ExamData = {
  "42": {
    title: "42º Exame de Ordem Unificado - OAB - Primeira Fase FGV",
    totalQuestions: 80,
    timeLimit: "5 horas",
    questions: [
      {
        id: 1,
        text: "José foi atropelado por um ônibus da empresa Rápido Ltda. e teve fratura no fêmur, ficando impossibilitado de trabalhar por quatro meses. O referido ônibus possuía seguro para danos a terceiros, mas com o seu valor limitado a R$ 30.000,00. Dentro desse contexto, conforme o Código Civil, o valor da indenização a que a vítima tem direito:",
        options: [
          { id: "A", text: "fica limitado ao montante do seguro contratado, que, efetivamente, será o valor da indenização, uma vez que o seguro foi contratado com o objetivo de ressarcir danos a terceiros." },
          { id: "B", text: "independe do valor do seguro contratado, devendo a vítima mover a ação diretamente contra a seguradora, que está obrigada a cobrir integralmente o valor do dano causado." },
          { id: "C", text: "deve ser pago pela seguradora nos seus limites e, se insuficiente, pelo causador do dano, que responde pelo montante excedente ao valor segurado." },
          { id: "D", text: "é plenamente limitado à cobertura do seguro, pois os contratos geram efeitos perante terceiros, inclusive nos casos de atropelamento com morte." }
        ],
        correctOption: "C",
        explanation: "De acordo com o Código Civil, Art. 786, 'Paga a indenização, o segurador sub-roga-se, nos limites do valor respectivo, nos direitos e ações que competirem ao segurado contra o autor do dano.' Portanto, a seguradora paga até o limite contratado (R$ 30.000,00) e o causador do dano (empresa Rápido Ltda.) responde pelo valor excedente.",
        area: "Direito Civil"
      },
      {
        id: 2,
        text: "Wagner firmou contrato de locação de um imóvel por dois anos, comprometendo-se a pagar, mensalmente, o aluguel de R$ 8.000,00. Para a garantia do pagamento, foi contratada fiança com Jorge, que se obrigou como principal pagador. No primeiro mês, Wagner não conseguiu quitar o valor acordado, e Jorge, ao ser cobrado pelo locador, pagou todo o valor devido. Sobre o exemplo citado, conforme o Código Civil, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Jorge poderá demandar Wagner pelo valor total, ficando, porém, subrogado nos direitos, privilégios e garantias do locador." },
          { id: "B", text: "Jorge não poderá demandar Wagner, uma vez que a fiança é gratuita, e ele se comprometeu como principal pagador." },
          { id: "C", text: "Jorge poderá demandar Wagner para que este lhe satisfaça metade do valor pago pela sua condição de devedor solidário." },
          { id: "D", text: "Jorge não poderá demandar Wagner, pois deveria ter pago apenas a metade do valor devido por ser devedor solidário." }
        ],
        correctOption: "A",
        explanation: "De acordo com o Código Civil, Art. 831, 'O fiador que pagar integralmente a dívida fica sub-rogado nos direitos do credor (...)'. Como principal pagador, Jorge pode demandar Wagner pelo valor total, sub-rogando-se nos direitos do locador.",
        area: "Direito Civil"
      },
      {
        id: 3,
        text: "Manoel, único filho de Carlos, pretende propor ação de alimentos contra seu genitor para custear o pagamento de sua faculdade particular de Medicina. Sobre a hipótese, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Manoel não tem direito aos alimentos contra seu genitor para custear seus estudos de ensino superior, uma vez que a obrigação do genitor é de prover os alimentos durante a menoridade do filho." },
          { id: "B", text: "Manoel tem direito aos alimentos enquanto estiver cursando o ensino superior, desde que seja menor de 24 anos e não exerça atividade remunerada." },
          { id: "C", text: "Manoel tem direito aos alimentos durante o curso de Medicina, independentemente da sua idade e condição socioeconômica." },
          { id: "D", text: "Manoel não tem direito aos alimentos contra o genitor, uma vez que Carlos não está obrigado a custear universidade particular, apenas o ensino público." }
        ],
        correctOption: "B",
        explanation: "O Superior Tribunal de Justiça firmou jurisprudência no sentido de que é possível a fixação de alimentos para o filho maior que esteja cursando ensino superior, desde que seja menor de 24 anos e não exerça atividade remunerada, conforme Súmula 358 do STJ.",
        area: "Direito Civil"
      },
      {
        id: 4,
        text: "A Constituição da República, como norma fundamental do Estado, estabelece diversos direitos e garantias fundamentais. Em relação a esses direitos, assinale a alternativa correta.",
        options: [
          { id: "A", text: "Direitos fundamentais são absolutos e incontrastáveis, configurando cláusulas pétreas, não admitindo qualquer intervenção." },
          { id: "B", text: "As decisões judiciais não podem ser fundamentadas exclusivamente com base em direitos fundamentais previstos na Constituição, sendo necessária lei infraconstitucional regulamentadora." },
          { id: "C", text: "Os direitos fundamentais vinculam apenas o Estado e seus órgãos, não possuindo eficácia nas relações privadas." },
          { id: "D", text: "Os direitos fundamentais podem sofrer restrições, desde que estas sejam proporcionais e preservem o núcleo essencial do direito restringido." }
        ],
        correctOption: "D",
        explanation: "Os direitos fundamentais não são absolutos e podem sofrer restrições quando em conflito com outros direitos fundamentais ou valores constitucionais. Essas restrições, contudo, devem respeitar o princípio da proporcionalidade e preservar o núcleo essencial do direito fundamental, conforme entendimento consolidado do STF.",
        area: "Direito Constitucional"
      },
      {
        id: 5,
        text: "A União concedeu isenção de Imposto sobre Produtos Industrializados (IPI) para fabricantes de automóveis, por prazo certo e sob determinadas condições. Após um ano de vigência da medida, foi promulgada lei ordinária federal revogando a aludida isenção, sem a previsão de qualquer regra de transição. Nos termos do Sistema Tributário Nacional, essa revogação:",
        options: [
          { id: "A", text: "é regular, estando sujeita somente ao princípio da anterioridade nonagesimal." },
          { id: "B", text: "é regular, mas está sujeita ao princípio da anterioridade anual e nonagesimal." },
          { id: "C", text: "é irregular, por violar o princípio da anterioridade anual e nonagesimal específica do IPI." },
          { id: "D", text: "é irregular, por violar o princípio da não surpresa, já que a isenção foi concedida por prazo certo e sob condições determinadas." }
        ],
        correctOption: "D",
        explanation: "De acordo com o Código Tributário Nacional, art. 178, 'A isenção, quando concedida por prazo certo e em função de determinadas condições, não pode ser revogada ou modificada por lei, a qualquer tempo.' Assim, a revogação da isenção concedida por prazo certo é irregular, violando o princípio da não surpresa e a segurança jurídica.",
        area: "Direito Tributário"
      },
      {
        id: 6,
        text: "Paulo foi admitido como empregado pela empresa Beta, tendo sido dispensado sem justa causa após 5 anos e 7 meses de contrato, recebendo aviso prévio indenizado. No dia seguinte, Paulo ajuizou reclamação trabalhista postulando pagamento de horas extras e diferenças de férias. Sobre a situação descrita, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "As verbas pleiteadas estão prescritas, pois Paulo ajuizou a ação após o prazo de 5 anos contados da contratação." },
          { id: "B", text: "Não há prescrição, pois Paulo ajuizou a ação durante o período de aviso prévio indenizado." },
          { id: "C", text: "As parcelas anteriores a 5 anos do ajuizamento da ação estão prescritas." },
          { id: "D", text: "Não há prescrição, pois a contagem do prazo prescricional só teria início após o término do aviso prévio." }
        ],
        correctOption: "C",
        explanation: "Conforme o Art. 7º, XXIX, da Constituição Federal, é direito dos trabalhadores urbanos e rurais 'ação, quanto aos créditos resultantes das relações de trabalho, com prazo prescricional de cinco anos para os trabalhadores urbanos e rurais, até o limite de dois anos após a extinção do contrato de trabalho'. Portanto, estão prescritas as parcelas anteriores a 5 anos do ajuizamento da ação.",
        area: "Direito do Trabalho"
      },
      {
        id: 7,
        text: "Lúcio foi condenado à pena de reclusão de cinco anos, pela prática do crime de roubo simples. Após o cumprimento de um ano de pena, Lúcio fugiu do estabelecimento prisional, mas, após 30 dias, foi recapturado. Nesse caso, de acordo com a Lei de Execução Penal:",
        options: [
          { id: "A", text: "o condenado perderá os dias remidos pela fuga e o tempo de fuga não será considerado para fins de remição." },
          { id: "B", text: "o condenado perderá os dias remidos pela fuga, mas o tempo de fuga será considerado para fins de remição." },
          { id: "C", text: "o condenado não perderá os dias remidos pela fuga, mas o tempo de fuga não será considerado para fins de remição." },
          { id: "D", text: "o condenado não perderá os dias remidos pela fuga, e o tempo de fuga será considerado para fins de remição." }
        ],
        correctOption: "A",
        explanation: "De acordo com o Art. 127 da Lei de Execução Penal, 'Em caso de falta grave, o juiz poderá revogar até 1/3 (um terço) do tempo remido, observado o disposto no art. 57, recomeçando a contagem a partir da data da infração disciplinar.' A fuga é considerada falta grave (Art. 50, II, LEP) e, além disso, o tempo de fuga não é computado como pena cumprida.",
        area: "Direito Penal"
      },
      {
        id: 8,
        text: "O Ministério Público ofereceu denúncia em face de Cássio, imputando-lhe a prática do crime de furto qualificado pelo rompimento de obstáculo. Após o recebimento da denúncia, durante a instrução, o Ministério Público aditou a inicial para incluir a qualificadora do concurso de agentes, narrando que Pedro teria participado do crime. Com base apenas nas informações narradas, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "O aditamento é inviável, tendo em vista que o oferecimento da denúncia esgotou a opinio delicti." },
          { id: "B", text: "O juiz deverá rejeitar o aditamento, pois Pedro não está sendo processado no mesmo feito, o que impede o reconhecimento do concurso de agentes na condenação de Cássio." },
          { id: "C", text: "O aditamento deve ser admitido, com posterior manifestação da defesa, reabrindo-se o prazo para resposta à acusação." },
          { id: "D", text: "Como houve alteração fática da imputação, o aditamento deve ser rejeitado." }
        ],
        correctOption: "C",
        explanation: "O aditamento da denúncia pelo Ministério Público para inclusão de qualificadora é possível, desde que realizado antes da sentença e que seja garantido o contraditório. De acordo com o Art. 384 do CPP, a defesa deve ser ouvida e tem direito a prazo para manifestação e produção de provas.",
        area: "Direito Processual Penal"
      },
      {
        id: 9,
        text: "Pois, segundo entendo, o limite do cognoscível é que se ajusta à virtude: a ideia do Bem; e, uma vez avistada, compreende-se que ela é para todos a causa do quanto há de justo e belo... (Platão) Em seu livro A República, Platão conta a famosa Alegoria da Caverna, enfatinando a não confundir aparência (imperfeita) com essência (perfeita). Nesse sentido, é correto afirmar que, para Platão, a justiça corresponde:",
        options: [
          { id: "A", text: "a uma prática que decorre dos atos justos por meio de contrato social que assegura os direitos e as liberdades individuais." },
          { id: "B", text: "ao processo histórico de luta contra a exploração e a conquista da emancipação." },
          { id: "C", text: "a uma concepção ideal a ser conhecida e compreendida pela razão." },
          { id: "D", text: "a normas específicas que regulam as relações sociais segundo a utilidade da maioria." }
        ],
        correctOption: "C",
        explanation: "Para Platão, a justiça corresponde a uma concepção ideal que deve ser compreendida pela razão. Na Alegoria da Caverna, ele explica que só através do conhecimento da verdadeira realidade (mundo das ideias) é possível compreender a essência das coisas, incluindo a justiça, que é uma ideia pura e não apenas uma convenção social ou resultado de lutas históricas.",
        area: "Filosofia do Direito"
      },
      {
        id: 10,
        text: "O governo e o exercício do poder supremo do Estado. Este poder só poderia estar ou nas mãos de um só, ou da minoria, ou da maioria das pessoas. Quando o monarca, a minoria ou a maioria não buscam, uns ou outros, senão a felicidade geral, o governo é necessariamente justo. (Aristóteles) No texto em questão, Aristóteles distingue o que ele considera as formas adequadas ou justas de governo de um, de poucos e de muitos. São elas, respectivamente:",
        options: [
          { id: "A", text: "monarquia, aristocracia e república. Porém, ele afirma que cada uma dessas formas de governo pode degenerar, respectivamente, em: tirania, oligarquia e democracia." },
          { id: "B", text: "absolutismo, que busca apenas a utilidade dos ricos; despotismo, que busca apenas a utilidade dos pobres; e imperialismo, que busca apenas o que é bom para o dinheiro, aprofitando o que busca apenas o que é bom para os ricos." },
          { id: "C", text: "cleptocracia, que admite os desvios de quem governa; parlamentarismo, que enfraquece o poder do governo; e agorismo, que confunde o exercício do poder." },
          { id: "D", text: "elitismo, que é um feliche em torno do governante; e assembleísmo, que dificulta o processo de decisão política." }
        ],
        correctOption: "A",
        explanation: "Aristóteles, em sua obra 'A Política', classifica as formas de governo em justas (monarquia, aristocracia e república) e suas formas degeneradas (tirania, oligarquia e democracia). Para ele, as formas justas buscam o bem comum, enquanto as formas degeneradas buscam apenas o interesse particular dos governantes.",
        area: "Filosofia do Direito"
      },
      {
        id: 11,
        text: "No processo legislativo afeto ao projeto de Lei Complementar nº XXX e à proposta de Emenda Constitucional nº YYY, o Congresso Nacional aprovou a redação final de ambas. Como divulgado pela imprensa, auxiliares do Presidente da República entendiam que, tanto o projeto de Lei Complementar quanto a proposta de Emenda Constitucional melhor atenderiam aos seus objetivos se fossem suprimidos alguns dispositivos de ambos. Com essa finalidade, sugeriram que o Presidente da República acionasse seu poder de veto, a fim de adequar os referidos textos a seus interesses - como já fizera em situações anteriores, vetando parcelas de projetos de emenda. Sobre os procedimentos descritos, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "De acordo com a Constituição da República, não cabe ao Chefe do Poder Executivo vetar dispositivos de projeto de Lei Complementar nem da proposta de Emenda Constitucional." },
          { id: "B", text: "A Constituição da República concede o poder de veto ao Chefe do Poder Executivo, por ser um instrumento jurídico que desequilibra a divisão de poderes." },
          { id: "C", text: "O Presidente da República pode vetar parte do projeto de Lei Complementar nº XXX, mas não tem poderes para fazer o mesmo em relação à proposta de Emenda Constitucional nº YYY." },
          { id: "D", text: "O poder de veto do Presidente da República se restringe às leis ordinárias, logo não poderá vetar dispositivos do projeto de Lei Complementar nº XXX e da proposta de Emenda Constitucional nº YYY." }
        ],
        correctOption: "C",
        explanation: "O Presidente da República pode vetar, parcial ou totalmente, projeto de lei complementar, conforme art. 66 da Constituição Federal. No entanto, não tem poder de veto sobre propostas de emenda à Constituição, que seguem rito próprio previsto no art. 60 da CF/88 e não estão sujeitas à sanção ou veto presidencial.",
        area: "Direito Constitucional"
      },
      {
        id: 12,
        text: "O Conselho Nacional de Justiça (CNJ) recebeu expediente relacionado à atuação de João, Juiz de Direito do Estado Delta. De acordo com a narrativa, em sede cautelar, no âmbito de processo penal, João proferiu decisão contrária ao sistema jurídico, pois teria condenado uma pessoa sem que ela seu advogado tivessem participado do contraditório prévio. A decisão, manifestamente anulável, antes de decisão judicial mostrando o erro, foi revogada pelo próprio João. Acerca da narrativa, segundo a Constituição da República, assinale a opção que indica, corretamente, o entendimento a ser adotado pelo CNJ em relação à atividade jurisdicional praticada.",
        options: [
          { id: "A", text: "O CNJ é parte da estrutura do Poder Judiciário, mas não está constitucionalmente autorizado a rever ou desconstituir a decisão judicial em tela." },
          { id: "B", text: "A matéria deve ser analisada pelo CNJ que, por ser órgão do Poder Judiciário, mas plenos poderes para desconstituir a decisão judicial em tela." },
          { id: "C", text: "O CNJ, por ser órgão de controle externo diretamente vinculado ao Ministério da Justiça, não poderá exercer controle da atividade jurisdicional." },
          { id: "D", text: "O CNJ faz parte da estrutura do Poder Judiciário e, apesar de seus poderes jurisdicionais atípicos, não está autorizado a desconstituir a decisão judicial." }
        ],
        correctOption: "D",
        explanation: "O CNJ faz parte da estrutura do Poder Judiciário (art. 92, I-A, CF) e tem competência de controle da atuação administrativa e financeira do Poder Judiciário (art. 103-B, §4º, CF), mas não possui competência para revisar ou desconstituir decisões judiciais, ainda que manifestamente ilegais, pois isso seria violação à independência funcional dos magistrados.",
        area: "Direito Constitucional"
      },
      {
        id: 13,
        text: "Algumas lideranças partidárias do Congresso Nacional têm considerado inadequadas as políticas governamentais que estão sendo implementadas pelo chefe do Poder Executivo e suas lideranças, não se comprometiam com as iniciativas adotadas pela União. Por esta razão, vislumbram que, proferindo uma declaração pública, poderiam constranger o Supremo Tribunal Federal a impedir a realização de qualquer deliberação legislativa, enquanto não seja reformulada pelo Congresso Nacional qualquer ato emanado pelo governo federal. De acordo com essa hipótese, segundo a ordem jurídica vigente no Brasil, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "O Congresso Nacional, investido na função de poder constituinte reformador, pode estabelecer essa alteração, por se tratar da proposição de emenda à Constituição." },
          { id: "B", text: "Os Estados-membros, por serem dotados de autonomia, podem ampliar seus poderes, inclusive o direito de secessão, mas não poderiam ter seus atuais poderes restringidos." },
          { id: "C", text: "O sistema constitucional prevê a subordinação dos poderes dos Estados-membros aos poderes da União, o que torna desnecessária a emenda para atingir os objetivos pretendidos." },
          { id: "D", text: "Uma emenda constitucional com esse teor atacaria frontalmente o princípio federativo e, por violar cláusula pétrea, seria considerada incompatível com a Constituição da República." }
        ],
        correctOption: "D",
        explanation: "Uma emenda constitucional que subordinasse os poderes legislativos dos estados-membros à vontade do Congresso Nacional violaria o princípio federativo, que é protegido como cláusula pétrea pelo art. 60, §4º, I, da Constituição Federal. Portanto, tal emenda seria inconstitucional por atentar contra a forma federativa de Estado.",
        area: "Direito Constitucional"
      },
      {
        id: 14,
        text: "O governador do Estado Alfa determinou, de forma deliberada, que Alfa deixasse de realizar os repasses constitucionais de parte da arrecadação tributária que possuía com a União. Advertido sobre possíveis consequências jurídico-políticas pelo Procurador Geral do Estado sobre a retenção, e que tal situação poderia ensejar, dentre outras consequências, a intervenção federal, segundo o ordenamento jurídico-constitucional brasileiro, assinale a opção que apresenta, corretamente, a previsão contemplada pela Constituição da República Federal do Brasil.",
        options: [
          { id: "A", text: "O Presidente da República poderá decretar a intervenção federal no Estado Alfa, sendo necessária a apreciação, a posteriori, do Congresso Nacional." },
          { id: "B", text: "O Estado Alfa, em razão de sua condição de ente autônomo da República Federativa do Brasil, não se sujeita à intervenção por parte da União." },
          { id: "C", text: "O Presidente da República somente poderá decretar intervenção federal no Estado Alfa após decisão judicial por parte do Supremo Tribunal Federal." },
          { id: "D", text: "O Presidente da República poderá decretar intervenção federal no Estado Alfa, a ser executada pelo Congresso Nacional, diretamente ou por meio da autoridade que indicar." }
        ],
        correctOption: "A",
        explanation: "Conforme o art. 34, V, b, da Constituição Federal, a União pode intervir nos Estados para garantir a obediência ao princípio constitucional de 'entregar aos Municípios as receitas tributárias fixadas nesta Constituição'. O art. 36, §1º, CF estabelece que o decreto de intervenção será submetido à apreciação do Congresso Nacional, no prazo de 24 horas.",
        area: "Direito Constitucional"
      },
      {
        id: 15,
        text: "O Presidente da Assembleia Legislativa do Estado Alfa, almejando que fosse respeitada a igualdade jurídica entre parlamentares estaduais e federais e considerando a autonomia dos distintos entes federativos, sancionou e fez publicar a votação do Colégio de Casa Legislativa o projeto de lei que fixa o subsídio dos Deputados Estaduais em valor idêntico ao dos Deputados Federais. Com esse objetivo, consultou você, como advogado(a) (leia-se consultor(a) jurídico(a)) da Assembleia Legislativa, a respeito da compatibilidade do projeto de lei com a Constituição da República e a legislação em vigor, em especial a CRFB/88 e os limites estabelecidos ao teto do funcionalismo. Diante do cenário que se apresenta, assinale a resposta correta.",
        options: [
          { id: "A", text: "A CRFB/88 estabelece o dever de igualdade jurídica de tratamento entre os parlamentares, sendo assim, o projeto de lei anexo não disames constitucionais ao igualar o subsídio dos Deputados Estaduais ao dos Deputados Federais." },
          { id: "B", text: "O Presidente da Assembleia Legislativa do Estado Alfa pode levar a votação o projeto de lei, entretanto, por se tratar de matéria constitucional, subsídios de parlamentares, há a necessidade de que o projeto seja aprovado por três quintos dos votos em dois turnos de votação." },
          { id: "C", text: "A CRFB/88 estabelece a paridade de subsídios entre Deputados Estaduais e Deputados Federais, pois os últimos são os representantes dos Estados-membros no Congresso Nacional, havendo, portanto, necessidade de se alterar o projeto de lei." },
          { id: "D", text: "O projeto de lei não está em harmonia com a CRFB/88, pois o subsídio dos Deputados Estaduais está limitado ao máximo de 75% do subsídio estabelecido para os Deputados Federais." }
        ],
        correctOption: "D",
        explanation: "De acordo com o art. 27, §2º da Constituição Federal, 'O subsídio dos Deputados Estaduais será fixado por lei de iniciativa da Assembleia Legislativa, na razão de, no máximo, setenta e cinco por cento daquele estabelecido, em espécie, para os Deputados Federais...' Portanto, há um limite constitucional de 75% para o subsídio dos deputados estaduais em relação aos federais.",
        area: "Direito Constitucional"
      },
      {
        id: 16,
        text: "Renato Carlos, renomado pianista, foi convidado para se apresentar em um grande evento musical em uma ordem jurídica nacional. Ao tomar conhecimento no evento, foi informado de que era obrigatório estar inscrito em uma ordem nacional de músicos para poder se apresentar publicamente no país. Como advogado(a), é solicitado que seja analisada a compatibilidade da exigência com o ordenamento jurídico-constitucional brasileiro. Em relação à exigência, analise a opção jurídica, corretamente, a orientação cabível.",
        options: [
          { id: "A", text: "É válida, pois o legislador nacional pode harmonizar a ordem regimental das entidades de classe, regra a ser observada no exercício profissional no Brasil." },
          { id: "B", text: "Não é válida, pois a ordem constitucional, pela liberdade profissional é um direito com alto grau de amplitude, sendo vedado ao legislador estabelecer condições para o seu exercício." },
          { id: "C", text: "Está de acordo com a Constituição da República, pois visa garantir maior qualidade no desempenho profissional." },
          { id: "D", text: "Encontra-se em desacordo com a Constituição da República, pois, além de não possuir interesse público relevante, viola o princípio da liberdade de expressão artística." }
        ],
        correctOption: "D",
        explanation: "A exigência de inscrição em ordem de músicos para apresentações artísticas viola a liberdade de expressão artística, garantida pelo art. 5º, IX, da CF que assegura a livre expressão da atividade intelectual, artística, científica e de comunicação, independentemente de censura ou licença. O STF já declarou inconstitucional a exigência de registro em conselhos profissionais para artistas.",
        area: "Direito Constitucional"
      },
      {
        id: 17,
        text: "Você está participando de um debate na OAB de sua cidade sobre direitos humanos de comunidades quilombolas. Você está sendo perguntado sobre a identificação e o reconhecimento dos remanescentes das comunidades de quilombolas. Você foi requisitado a apresentar, segundo a jurisprudência do STF a propriedade de natureza jurídica, coletiva/comunitária, que reforça a dignidade por meio da titulação de territórios específicos, com presenção de ancestralidade negra relacionado à resistência à a opressão histórica sofrida. Sobre o assunto, são considerações corretas afirmar que:",
        options: [
          { id: "A", text: "Não é qualquer cidadão ou cidade que esteja privado do seu direito à moradia em função de grave violação de direitos humanos e que seja descendente de imigrantes que se estabeleceram no Brasil com ou sem autorização de permanência dada pelo Estado brasileiro." },
          { id: "B", text: "Toda e qualquer cidadão ou cidade que esteja privado do seu direito à moradia em função de grave violação de direitos humanos e que seja descendente de imigrantes que se estabeleceram no Brasil com ou sem autorização de permanência dada pelo Estado brasileiro." },
          { id: "C", text: "A população afrodescendente brasileira, que vive processo de privação de direitos e, por isso, busca tanto os meios próprios de subsistência quanto a ocupação pelos processos e pela discriminação que sofreu e que resultaram em restrições de acesso à terra e à moradia." },
          { id: "D", text: "Os povos originais, as quais são reconhecidos a organização social, os costumes, as línguas, as crenças e as tradições, bem como os direitos originários sobre as terras que tradicionalmente ocuparam, competindo à União demarcá-las, proteger e fazer respeitar todos os seus bens." }
        ],
        correctOption: "C",
        explanation: "A alternativa C está correta pois reflete o entendimento do STF (ADI 3239) sobre o direito à propriedade quilombola, reconhecendo que os quilombolas são grupos étnicos formados predominantemente por população negra rural ou urbana, que se autodefinem a partir das relações de territorialidade, com presunção de ancestralidade negra relacionada à resistência à opressão histórica sofrida.",
        area: "Direito Constitucional"
      },
      {
        id: 18,
        text: "Um cidadão venezuelano, que ingressou de forma irregular no país, com o propósito de regularizar sua situação no Brasil, procura você, como advogado(a), para ter sua assistência jurídica. Nesse contexto, com base nos direitos dos refugiados e migrantes, assinale a opção que apresenta, corretamente, sua orientação.",
        options: [
          { id: "A", text: "O reconhecimento da condição de refugiado não impedirá o prosseguimento do processo administrativo eventualmente já instaurado para a apuração de seu ingresso irregular no país." },
          { id: "B", text: "De acordo com a legislação brasileira, o cidadão em questão terá sua condição de refugiado reconhecida se demonstrar que foi obrigado a deixar seu país de nacionalidade em razão de grave e generalizada violação de Direitos Humanos." },
          { id: "C", text: "Se sua vinda para o Brasil não tiver sido motivada pelo risco de responder penalmente, no âmbito do Estado de origem, pelo cometimento de crimes políticos, ele deverá solicitar a concessão de asilo político, ao invés do refúgio." },
          { id: "D", text: "De acordo com a legislação brasileira, se o solicitado e reconhecimento da sua condição de refugiado, inclusive somente terá proteção jurídica após a devida instrução e o devido encerramento do procedimento para a obtenção de refúgio no Comitê Nacional para os Refugiados - Conare. Antes disso, poderá ser expulso ou deportado." }
        ],
        correctOption: "A",
        explanation: "De acordo com a Lei 9.474/97 (Lei do Refúgio), o reconhecimento da condição de refugiado não impede o prosseguimento do processo administrativo para apuração do ingresso irregular, conforme dispõe o art. 8º: 'O ingresso irregular no território nacional não constitui impedimento para o estrangeiro solicitar refúgio às autoridades competentes'.",
        area: "Direito Internacional"
      },
      {
        id: 19,
        text: "O Partido Político Alfa tomou conhecimento de que o Comitê de Deputado Estadual, estava veiculando propaganda eleitoral paga, na imprensa escrita, durante a sua campanha eleitoral. Como o departamento jurídico nas reuniões deliberadas argumentadas, considerou criticamente, o Partido Político o como da condição de advogado, em relação à atitude dessa conduta. Sobre a veiculação da propaganda realizada por Joana, assinale a opção que indica, corretamente, sua resposta.",
        options: [
          { id: "A", text: "É permitido até a data da eleição, desde que observados os balizamentos legais." },
          { id: "B", text: "É permitida, até a antevéspera da eleição, observados os balizamentos legais." },
          { id: "C", text: "É vedada, logo Alfa pode ajuizar representação eleitoral, pugnando a aplicação de multa." },
          { id: "D", text: "Deve ser considerada ilícita se não tiver sido celebrado ajuste coletivo, pelos partidos políticos, autorizando-a, o que será apurado em investigação judicial eleitoral." }
        ],
        correctOption: "B",
        explanation: "De acordo com a Lei das Eleições (Lei nº 9.504/97), art. 43, a propaganda eleitoral paga na imprensa escrita é permitida até a antevéspera da eleição, observando-se limites de tamanho para cada veículo. É ilícita a partir desse momento, sujeitando-se os responsáveis às sanções previstas na legislação eleitoral.",
        area: "Direito Eleitoral"
      },
      {
        id: 20,
        text: "Pedro, com 40 anos de idade, por razões ideológicas, decidiu não mais votar nas eleições para o provimento de cargos dos Poderes Executivo e Legislativo dos distintos níveis da Federação. Após repetir esse procedimento em três eleições consecutivas, comparecem ao cartório eleitoral e solicitou uma certidão de quitação eleitoral para que pudesse requerer a emissão de seu passaporte. Para sua surpresa, foi informado que sua inscrição fora cancelada, o que, ao ver o informante de outro Órgão, o impediria de obter o passaporte. Irresignado com a situação descrita, Pedro consultou você, como advogado(a), a respeito da juridicidade desse procedimento. Assinale a opção que apresenta a informação correta.",
        options: [
          { id: "A", text: "A obtenção do passaporte instrumentaliza o direito de ir e vir, o que é um direito cujo o exercício do direito de voto." },
          { id: "B", text: "O exercício da objeção de consciência, como a realizada por ele, é amparado pela legislação eleitoral, sendo uma forma de exercício dos direitos políticos, logo o cancelamento foi ilícito." },
          { id: "C", text: "A inscrição eleitoral instrumentaliza o direito de votar, que não pode ser obstado pela prática de ilícitos eleitorais, o que configura sanção política, logo não poderia ter sido cancelada." },
          { id: "D", text: "O cancelamento é correto, pois o eleitor que não tenha votado em três eleições consecutivas, nem tenha pago a multa ou apresentado justificativa no prazo prescrito na legislação, a contar da última eleição a que deveria ter comparecido." }
        ],
        correctOption: "D",
        explanation: "De acordo com o art. 7º, §3º do Código Eleitoral, o eleitor que não votar em três eleições consecutivas e não justificar sua ausência ou pagar a multa correspondente terá sua inscrição cancelada. Isso está em conformidade com o art. 14, §1º da CF que estabelece o voto como obrigatório para os maiores de 18 anos.",
        area: "Direito Eleitoral"
      },
      {
        id: 21,
        text: "Você atua, como advogado(a), em um caso em que seu cliente, Luka, croata, de 65 anos de idade e 6 anos de residência fixa no Brasil, sem família no país, foi condenado, com sentença transitada em julgado, pela prática do crime de estupro no Brasil. Com base no disposto a Lei de Migração (Lei nº 13.445/2017), a condenação ensejará a expulsão de Luka do Brasil,",
        options: [
          { id: "A", text: "sem a possibilidade de impedimento de ingresso por prazo determinado." },
          { id: "B", text: "com a possibilidade de ingresso por prazo determinado." },
          { id: "C", text: "conjugada com o impedimento de regresso por prazo indeterminado." },
          { id: "D", text: "com a possibilidade de regresso, por ser pessoa com mais de" }
        ],
        correctOption: "C",
        explanation: "De acordo com a Lei de Migração (Lei 13.445/2017), art. 54, §1º, a pessoa condenada definitivamente por crime de estupro pode ser expulsa do país, e conforme o art. 54, §2º, a expulsão implica impedimento de reingresso por prazo indeterminado.",
        area: "Direito Internacional"
      },
      {
        id: 22,
        text: "No Brasil, quanto às formas de ingresso no país, é aplicada a política de visto por reciprocidade, de acordo com a nacionalidade do estrangeiro. O tipo de visto, previsto na Lei de Migração, depende do objetivo da viagem do solicitante ao Brasil. A Lei de Migração (Lei nº 13.445/2017) ajustou o tratamento do estrangeiro no Brasil aos preceitos constitucionais. Sobre as formas de ingresso no país, segundo a legislação pertinente, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "O visto é documento que dá a seu titular o direito absoluto de ingresso em território nacional." },
          { id: "B", text: "Ao solicitante que pretenda ingressar ou permanecer em território nacional poderá ser concedido visto de turista, temporário, diplomático e oficial." },
          { id: "C", text: "É causa de recusa absoluta de visto, sem possibilidade de entrevista individual e necessidade de ato fundamentado, quando a razão da viagem não seja condizente com o visto ou com o motivo alegado para a isenção de visto." },
          { id: "D", text: "O visto temporário para pesquisa, ensino ou extensão acadêmica poderá ser concedido ao imigrante com ou sem vínculo empregatício com a instituição de pesquisa ou de ensino brasileira, sendo exigida, na hipótese de vínculo, a comprovação de formação compatível." }
        ],
        correctOption: "D",
        explanation: "De acordo com a Lei de Migração (Lei 13.445/2017), o art. 14, I, e, prevê o visto temporário para pesquisa, ensino ou extensão acadêmica, e o §4º deste artigo dispõe que esse visto pode ser concedido com ou sem vínculo empregatício, exigindo-se comprovação de formação compatível quando houver vínculo.",
        area: "Direito Internacional"
      },
      {
        id: 23,
        text: "O Prefeito e a Câmara de Vereadores de Alfa, município de cem mil habitantes, situado no interior do Estado Beta, pretendem modernizar a administração pública municipal. Assim, iniciaram um programa de ampliação da transparência da gestão fiscal, que prevê a implantação de mecanismos previstos na Constituição Federal de 1988 e na Lei de Responsabilidade Fiscal, objetivando dar maior efetividade ao princípio da transparência fiscal. Sobre a hipótese formulada, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "As contas apresentadas pelo Prefeito devem ficar disponíveis, durante todo o exercício, apenas no órgão técnico responsável pela sua elaboração, para consulta e apreciação pelos cidadãos e instituições da sociedade civil." },
          { id: "B", text: "A realização de audiências públicas durante os processos de elaboração e discussão dos planos, da lei de diretrizes orçamentárias e dos orçamentos não deve ser aplicada ao Município Alfa, mas tão somente às esferas estadual ou federal." },
          { id: "C", text: "O Município Alfa está obrigado a disponibilizar em meio eletrônico de amplo acesso público suas informações e seus dados contábeis, orçamentários e fiscais de acordo com uma periodicidade, um formato e um sistema estabelecido pelo órgão central de contabilidade da União." },
          { id: "D", text: "A prestação de contas do Prefeito deve ter ampla divulgação, mas o respectivo parecer prévio do Tribunal de Contas do Estado Beta sobre tais contas e apenas envido à Câmara de Vereadores para que estas possam ser julgadas, não podendo ser veiculadas em meios eletrônicos de acesso público." }
        ],
        correctOption: "C",
        explanation: "De acordo com a Lei de Responsabilidade Fiscal (LC 101/2000), art. 48, §2º, 'A União, os Estados, o Distrito Federal e os Municípios disponibilizarão suas informações e dados contábeis, orçamentários e fiscais conforme periodicidade, formato e sistema estabelecidos pelo órgão central de contabilidade da União'.",
        area: "Direito Administrativo"
      },
      {
        id: 24,
        text: "Em certo período de apuração, a despesa total de pessoal da União alcançou o patamar de 60% da receita corrente líquida (RCL), de acordo com os critérios de cálculo estabelecidos na Lei Complementar nº 101/2000 (Lei de Responsabilidade Fiscal - LRF). Sobre o patamar alcançado, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Mantém-se dentro do limite válido para a esfera federal estabelecido na LRF, que é expressamente previsto em 45% da RCL." },
          { id: "B", text: "Viola o limite válido para a esfera federal estabelecido na LRF, que está expressamente previsto em 50% da RCL." },
          { id: "C", text: "Situa-se abaixo do limite válido para a esfera federal estabelecido na LRF, que está expressamente previsto em 70% da RCL." },
          { id: "D", text: "Mantém-se dentro do limite válido para a esfera federal estabelecido na LRF, uma vez que configura o próprio preceito daquela norma jurídica." }
        ],
        correctOption: "B",
        explanation: "De acordo com a Lei de Responsabilidade Fiscal (LC 101/2000), art. 19, I, o limite para despesas com pessoal na esfera federal é de 50% da Receita Corrente Líquida. Portanto, o patamar de 60% viola esse limite.",
        area: "Direito Administrativo"
      },
      {
        id: 25,
        text: "José foi citado, em janeiro de 2022, em uma ação de execução fiscal movida pela Fazenda Nacional para cobrança de Imposto sobre a Renda de Pessoa Física (IRPF), cujo débito tributário foi por ele próprio apurado na sua Declaração de Ajuste Anual entregue à Secretaria da Receita Federal do Brasil, em março de 2021 (referente ao ano-base de 2020). Sem pagar o valor, em março daquele ano, foi intimado da penhora de sua conta bancária. Três meses após a intimação da penhora, José finalmente encontrou e juntou ao DARF do IRPF integralmente pago dentro do prazo, no exato valor apurado como devido naquela declaração de ajuste anual. José, ora, procura para, como advogado(a), adotar a medida processual cabível nos autos daquela ação de cobrança considerada indevida. Diante desse cenário, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "José deverá oferecer embargos à execução, oportunidade em que poderá alegar a quitação da dívida tributária." },
          { id: "B", text: "Por ser matéria de ordem pública, será possível alegar apenas a prescrição daquela ação de execução fiscal, que terá ocorrido em dezembro de 2021." },
          { id: "C", text: "José poderá apresentar uma exceção de pré-executividade, demonstrando documentalmente, por meio da DARF, que o imposto havia sido pago tempestivamente." },
          { id: "D", text: "Caberá a José requerer que seja determinada a penhora da sua conta bancária por meio do agravo de instrumento, com o fundamento de quitação da dívida tributária." }
        ],
        correctOption: "C",
        explanation: "A exceção de pré-executividade é o meio processual adequado quando se trata de matéria de ordem pública (como pagamento) que pode ser comprovada documentalmente, sem necessidade de dilação probatória. No caso, José pode apresentar o DARF pago para comprovar a quitação do débito, dispensando a apresentação de embargos.",
        area: "Direito Processual Tributário"
      },
      {
        id: 26,
        text: "João, pessoa com deficiência física, com base na Lei nº XX do Estado Alfa que isenta as pessoas com tal deficiência do pagamento do Imposto sobre Propriedade de Veículo Automotor (IPVA) João, somente após realizar o depósito prévio em dinheiro, teve seu recurso admitido e poderá recorrer para a segunda instância administrativa. b) Tal taxa, como espécie de tributo contraprestacional, não pode ser objeto de isenção, sob pena de prejudicar a realização dos serviços específicos e divisíveis que ela financia.",
        options: [
          { id: "A", text: "A legislação tributária que outorga isenção deve ser interpretada literalmente, não sendo extensível a exenção prevista em lei para o IPVA à Taxa Anual de Licenciamento Veicular não prevista na referida lei." },
          { id: "B", text: "João poderá ajuizar ação declaratória de inexistência de relação jurídico-tributária, uma vez que as isenções podem ser interpretadas extensivamente e sua condição de pessoa com deficiência é comprovável por laudo médico e perícia judicial." },
          { id: "C", text: "A legislação tributária que outorga isenções deve ser interpretada literalmente, não sendo extensível a exenção prevista em lei para o IPVA à Taxa Anual de Licenciamento Veicular prevista na referida lei." },
          { id: "D", text: "João poderá ajuizar ação declaratória de inexistência de relação jurídico-tributária, uma vez que as isenções podem ser interpretadas extensivamente e sua condição de pessoa com deficiência é comprovável por laudo médico e perícia judicial." }
        ],
        correctOption: "A",
        explanation: "De acordo com o art. 111, II, do Código Tributário Nacional, a legislação tributária que dispõe sobre outorga de isenção deve ser interpretada literalmente. Assim, a isenção concedida para o IPVA não se estende automaticamente à Taxa de Licenciamento, pois são tributos de naturezas distintas.",
        area: "Direito Tributário"
      },
      {
        id: 27,
        text: "A sociedade empresária ABC Ltda. teve um auto de infração lavrado contra si pelo Fisco federal em junho de 2021, lançando de ofício valores de tributo federal não declarados, nem pagos, referentes a fatos geradores ocorridos em junho de 2017. A sociedade empresária impugnou o auto dentro do prazo, apontando a existência de vício formal, o que foi reconhecido pelo Fisco federal, que anulou tal lançamento em junho de 2022. Diante desse cenário e à luz do texto expresso do Código Tributário Nacional, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "O Fisco poderá efetuar novo lançamento, contendo-se o prazo decadencial de 5 anos da data em que se tornou definitiva a decisão que anulou, por vício formal, o lançamento anteriormente efetuado." },
          { id: "B", text: "O Fisco não poderá efetuar novo lançamento, pois o prazo decadencial de 5 anos se conta a partir de 01/01/2023, primeiro dia do exercício seguinte àquele em que o novo lançamento poderia ter sido efetuado." },
          { id: "C", text: "O Fisco não poderá efetuar novo lançamento, pois o prazo decadencial de 5 anos se conta, no caso em tela, a partir dos fatos geradores, ocorridos em junho de 2017, e se encerrou em junho de 2022." },
          { id: "D", text: "O Fisco não poderá efetuar novo lançamento, pois o prazo decadencial de 5 anos se computa a partir de junho de 2022, 5 anos após a ocorrência dos fatos geradores objeto do lançamento original que foi anulado." }
        ],
        correctOption: "A",
        explanation: "Conforme o art. 173, II, do Código Tributário Nacional, o direito de a Fazenda Pública constituir o crédito tributário extingue-se após 5 (cinco) anos, contados 'da data em que se tornar definitiva a decisão que houver anulado, por vício formal, o lançamento anteriormente efetuado'.",
        area: "Direito Tributário"
      },
      {
        id: 28,
        text: "Certa carga foi abandonada no Porto de Santos (SP) pela sociedade empresária Importa 100% Ltda. Em razão disso, passados o prazo previsto e obedecidas as formalidades da legislação tributária, foi promovida pela Secretaria Especial da Receita Federal do Brasil (SERFB) a venda de perdimento de mercadoria importada por abandono. José, participando de leilão da SERFB, logra êxito em arrematar a mercadoria abandonada. Sobre a destinação das mercadorias abandonadas no leilão promovido pela SERFB, à luz do Código Tributário Nacional, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "José terá de pagar o Imposto de Importação, a despeito de a base de cálculo ser diversa daquela utilizada para as mercadorias importadas que transitam regularmente em regime de importação." },
          { id: "B", text: "Como base de cálculo do Impostos de Importação não seriam aplicadas as mesmas regras do mercado que tais bens alcançariam." },
          { id: "C", text: "José, por ser pessoa física, não poderá arrematar bens oriundos da aplicação da pena de perdimento de mercadoria importada por abandono." },
          { id: "D", text: "NULA" }
        ],
        correctOption: "A",
        explanation: "Conforme o art. 22, parágrafo único, do Código Tributário Nacional, quando se tratar de produto apreendido ou abandonado, levado a leilão, considera-se ocorrido o fato gerador do Imposto de Importação na data do leilão, sendo o imposto devido pelo arrematante (José). A base de cálculo, segundo o art. 24, é o preço alcançado no leilão.",
        area: "Direito Tributário"
      },
      {
        id: 29,
        text: "Uma lei municipal do Município Alfa concedeu isenção do IPTU a determinado segmento econômico. Contudo, em razão de dificuldades financeiras municipais, tal isenção foi revogada por outra lei, publicada em 20/12/2024, que estabelece a produção de seus efeitos a partir de 1º/06/2024. A sociedade empresária ABC Ltda., que chegou a ser beneficiada, consultou você, como advogado(a), para saber se tal lei revogatória não estaria eivada de algum vício. Diante dessa situação, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "A revogação foi regular, pois, para ser legítima, a isenção que favorecia a sociedade ABC Ltda. não poderia ser revogada, nem mesmo por emenda constitucional." },
          { id: "B", text: "A revogação é legítima, a licitude que favorecia a sociedade ABC Ltda. poderia ser revogada a qualquer tempo. Porém, por configurar cláusula pétrea, a isenção só favorecia a sociedade ABC Ltda. não poderia ser revogada, nem mesmo por emenda constitucional." },
          { id: "C", text: "A isenção que favorecia a sociedade ABC Ltda. poderia ter seus efeitos produzidos a partir de 1º/01/2025." },
          { id: "D", text: "A isenção que favorecia a sociedade ABC Ltda. poderia ser revogada por mera lei municipal, mas apenas por Emenda Constitucional, por ser prevista como garantia tributária constitucional." }
        ],
        correctOption: "C",
        explanation: "De acordo com o art. 104, III, c/c art. 150, III, b, da Constituição Federal, a revogação de isenção está sujeita ao princípio da anterioridade anual. Assim, a revogação da isenção do IPTU só poderia produzir efeitos a partir de 1º de janeiro de 2025, respeitando-se o princípio da anterioridade.",
        area: "Direito Tributário"
      },
      {
        id: 30,
        text: "O Município Alfa editou lei, aplicável após sua entrada em vigor, sem caráter retroativo, determinando novo modo de intervenção sobre o número máximo de pavimentos em edificações situadas em determinadas ruas, locais, em razão da reserva legal e do direito de propriedade. Sendo-lhe apresentada pelo órgão municipal que, poderia sobre determinação da quantidade do efetudo da propriedade, procurou você, como advogado(a), para ser informado sobre a modalidade de intervenção praticada pelo Estado. Assinale a opção que indica, corretamente, sua resposta.",
        options: [
          { id: "A", text: "Trata-se de restrição administrativa, embasada no regular emprego do poder de polícia, diante da vis condizente o exercício do direito de propriedade ao cumprimento de sua função social." },
          { id: "B", text: "Trata-se de função social constitucional para regular emprego do poder disciplinar, haja vista que visa disciplinar e compatibilizar o direito de propriedade ao cumprimento de sua função social." },
          { id: "C", text: "Trata-se de requisição administrativa, embasada no regular emprego do poder disciplinar, haja vista que reduziu parcialmente o direito de propriedade, diante da supremacia do interesse público sobre o privado." },
          { id: "D", text: "Trata-se de desapropriação indireta, embasada no emprego do poder regulamentar, haja vista que reduziu parcialmente o direito de propriedade." }
        ],
        correctOption: "A",
        explanation: "Trata-se de restrição administrativa, que é uma limitação ao direito de propriedade imposta pelo poder público com base no poder de polícia, visando adequar o exercício desse direito à sua função social. O limite de pavimentos é um exemplo clássico de restrição administrativa urbanística.",
        area: "Direito Administrativo"
      },
      {
        id: 31,
        text: "João Silva, servidor público federal estável, ao assumir cargo efetivo com atribuições inerentes ao controle interno da Administração, constatou que, nos últimos dois anos, foram praticados numerosos atos administrativos que ensejaram efeitos favoráveis a destinatários de boa-fé. Esses atos continham vícios de legalidade, sendo certo que, em muitos deles, não há acerca de forma. Você foi consultado(a) como advogado(a) a respeito da juridicidade desse procedimento administrativo analisado por João Silva. À luz do disposto na Lei nº 9784/99, assinale a opção que indica, corretamente, materializa a escolha jurídica confiável a seu cliente Paulo.",
        options: [
          { id: "A", text: "A eventual anulação dos atos administrativos viciados não precisa ser precedida de abertura de processo administrativo específico, desde que respeitados os direitos adquiridos de terceiros." },
          { id: "B", text: "Os atos administrativos viciados podem ser revogados, desde que respeitados os direitos adquiridos de terceiros, e da convalidação." },
          { id: "C", text: "Nos processos em que foram analisados por João Silva, os atos administrativos viciados poderão ser invalidados a qualquer tempo, pois não há prazo para o exercício do direito da Administração de anulá-los." },
          { id: "D", text: "Nos processos analisados por João Silva, os atos administrativos viciados poderão ser revogados a qualquer tempo." }
        ],
        correctOption: "B",
        explanation: "De acordo com a Lei 9.784/99 (Lei do Processo Administrativo Federal), art. 55: 'Em decisão na qual se evidencie não acarretarem lesão ao interesse público nem prejuízo a terceiros, os atos que apresentarem defeitos sanáveis poderão ser convalidados pela própria Administração'. Os atos com vícios de forma podem ser convalidados, preservando-se seus efeitos favoráveis a destinatários de boa-fé.",
        area: "Direito Administrativo"
      },
      {
        id: 32,
        text: "Em decorrência de uma denúncia anônima, as autoridades competentes da União promoveram investigação e verificaram que Wagner, servidor público federal estável, cometeu infração disciplinar que também é capitulada como crime contra a Administração Pública. Em razão disso, de forma motivada, foi instaurado o respectivo processo administrativo disciplinar que, após observado o prazo para a defesa do servidor e para a conclusão do feito, resultou na sua demissão. Wagner, não se conforma com a mencionada penalização, pois alega a existência de vícios insanáveis nos processos administrativos decorrentes. Ainda, os fatos ocorreram seis anos antes da sua instauração e, além disso, eles são, em tese, controversos. Não satisfeito, procurou o seu advogado. No que tange à matéria, assinale a opção que indica, corretamente, a orientação jurídica a ser dada pelo advogado.",
        options: [
          { id: "A", text: "Wagner está correto, pois o prazo de prescrição da lei penal aplicado às infrações disciplinares capituladas como crime é o prazo prescricional da lei penal para o próprio crime, desde que não tenha havido prejuízo para a defesa." },
          { id: "B", text: "Wagner está correto, pois os prazos de prescrição do CP devem ser aplicados às infrações disciplinares capituladas como crime, contado o prazo para a conclusão do processo administrativo disciplinar, por isso, enseja a nulidade da penalidade." },
          { id: "C", text: "Wagner está correto, pois o prazo para a conclusão do processo administrativo disciplinar não poderá ser instaurado após a investigação levada a cabo em razão de denúncia anônima." },
          { id: "D", text: "O exercício da prescrição disciplinar está limitado pelo prazo prescricional, neste tipo transcorreram mais de cinco anos entre a ocorrência do fato e a instauração do respectivo processo administrativo disciplinar." }
        ],
        correctOption: "A",
        explanation: "De acordo com a Lei 8.112/90, art. 142, §2º, 'Os prazos de prescrição previstos na lei penal aplicam-se às infrações disciplinares capituladas também como crime'. Assim, se a infração disciplinar também é crime, o prazo prescricional a ser aplicado é o da lei penal, que geralmente é maior que o administrativo.",
        area: "Direito Administrativo"
      },
      {
        id: 33,
        text: "Diante da divulgação de uma notícia veiculando a intenção do Município Paris de formalizar uma concessão administrativa para a realização de certo serviço indivisível, que envolve a realização de obras de infraestrutura para sua implementação, os representantes da sociedade empresarial Astúcias ficaram entusiasmados em participar da respectiva licitação. Em razão disso, procuraram você, como advogado(a), para esclarecer as incompatibilidades da respectiva avença. Sobre o contrato, assinale a opção que apresenta, corretamente, a orientação jurídica prestada.",
        options: [
          { id: "A", text: "Não pode ter prazo de vigência inferior a cinco anos, nem superior a trinta e cinco anos, incluindo eventuais prorrogações, e o serviço é prestado diretamente aos usuários." },
          { id: "B", text: "Envolve a contraprestação pecuniária do parceiro público ao parceiro privado, adicionalmente à tarifa cobrada dos usuários." },
          { id: "C", text: "Independe da criação da sociedade de propósito específico antes de sua celebração, pois tem fins de implementação e gestão do objeto da parceria." },
          { id: "D", text: "Não pode prever a repartição de riscos entre as partes, especialmente em relação ao caso fortuito, força maior, fato do príncipe e álea econômica extraordinária." }
        ],
        correctOption: "B",
        explanation: "De acordo com a Lei 11.079/2004 (Lei das PPPs), art. 2º, §1º, a concessão administrativa é um contrato de prestação de serviços em que a Administração Pública é a usuária direta ou indireta, mesmo que envolva execução de obra ou fornecimento e instalação de bens. É característico desse tipo de contrato a contraprestação pecuniária do parceiro público ao privado.",
        area: "Direito Administrativo"
      },
      {
        id: 34,
        text: "Após o devido procedimento licitatório, foi formalizado com a sociedade empresária Esperta determinado contrato de prestação de serviços contínuos sem dedicação exclusiva de mão de obra, sendo certo que, no curso do contrato, a contratada, ou seja, a sociedade Esperta, inadimpliu com diversos encargos previdenciários e trabalhistas, decorrentes da aludida avença. Em razão disso, a Administração contratante consultou a respectiva assessoria jurídica para aferir as dúvidas atinentes à responsabilidade do ente público e quais medidas que poderiam ser adotadas na situação descrita, à luz do disposto na Lei nº 14.133/2021. Assinale a opção que apresenta a informação correta.",
        options: [
          { id: "A", text: "Somente a Administração Pública será objetivamente responsável pelos danos que causar a terceiros no curso da execução contratual." },
          { id: "B", text: "A Administração Pública não está obrigada, regularmente, a fiscalizar a execução do contrato, tendo em vista que o objetivo da contratação é a responsabilidade do contratado pelo resultado." },
          { id: "C", text: "A fiscalização exige que a Administração contratante intervenha na execução do contrato, para caso de inadimplemento, efetue diretamente o pagamento das verbas trabalhistas, que serão deduzidas do pagamento devido ao contratado." },
          { id: "D", text: "A Administração contratante, mediante disposição em edital ou em contrato, poderá, em caso de inadimplemento, efetuar diretamente o pagamento das verbas trabalhistas, que serão deduzidas do pagamento devido ao contratado." }
        ],
        correctOption: "D",
        explanation: "De acordo com a Lei 14.133/2021 (Nova Lei de Licitações), art. 121, §3º: 'A Administração poderá exigir, em edital ou em contrato, a prestação de garantia específica para assegurar o pagamento de encargos trabalhistas e previdenciários não quitados pelo contratado'. O §4º prevê que a autoridade competente poderá determinar o pagamento direto das verbas trabalhistas.",
        area: "Direito Administrativo"
      },
      {
        id: 35,
        text: "Bruno pretende realizar supressão de vegetação nativa em Área de Preservação Permanente no interior da sua propriedade, objetivando a construção de uma pousada destinada ao ecoturismo. Com o objetivo de verificar a legalidade de seu projeto, Bruno consultou você, como advogado(a). Você informou a seu cliente que, de acordo com o Código Florestal, a intervenção ou a supressão de vegetação nativa em Área de Preservação Permanente ocorrerá nas hipóteses previstas naquela Lei. Assim, sobre a implantação de trilhas para o desenvolvimento do ecoturismo, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Enquadra-se na hipótese de utilidade pública, razão pela qual é viável a supressão vegetal." },
          { id: "B", text: "Não se amolda a qualquer das hipóteses, razão pela qual é inviável a supressão vegetal." },
          { id: "C", text: "Enquadra-se na hipótese de baixo impacto ambiental, razão pela qual é viável a supressão vegetal, mediante pagamento de prévia compensação ambiental." },
          { id: "D", text: "Não se compatibiliza com qualquer das hipóteses, mas é viável a supressão vegetal, mediante pagamento de prévia compensação ambiental." }
        ],
        correctOption: "C",
        explanation: "De acordo com o Código Florestal (Lei 12.651/2012), art. 8º, permite-se a intervenção em APP em caso de utilidade pública, interesse social ou baixo impacto ambiental. O art. 3º, X, g classifica 'a construção de rampa de lançamento de barcos e pequeno ancoradouro' como atividade de baixo impacto ambiental, o que se aplica analogamente a trilhas para ecoturismo.",
        area: "Direito Ambiental"
      },
      {
        id: 36,
        text: "A palavra piracema vem do tupi e significa saída de peixes. Trata-se de um fenômeno que ocorre com diversas espécies de peixes e constitui importante estratégia reprodutiva para garantir que o peixe complete seu ciclo de vida, seguindo o período de migrações e desova. Ciente de que, durante a época do defeso, a pesca de determinado peixe estaria proibida, Carlos, que, sendo pescador, estava praticando a pesca do referido peixe na época em que a pesca deste estava proibida. Por isso, foi abordado por fiscais do meio ambiente, que encontraram em seu barco várias caixas de peixes já mortos. Após o aludido fato, Carlos procurou você, como advogado(a), para tirar dúvidas acerca das penalidades que poderiam a ele ser aplicadas e os eventuais reflexos decorrentes. Sobre a conduta praticada por Carlos, à luz da Lei nº 9.605/1998, assinale a opção que apresenta, corretamente, a orientação dada.",
        options: [
          { id: "A", text: "Caracteriza crime ambiental punível com pena de detenção, sendo incabível, todavia, a transação penal, em decorrência da expressiva gravidade para o meio ambiente." },
          { id: "B", text: "Caracteriza tanto crime ambiental quanto infração administrativa, mas não pode ensejar a apreensão dos peixes porque utilizados na prática do ilícito." },
          { id: "C", text: "Caracteriza apenas infração administrativa, passível da aplicação de multa e da apreensão dos peixes e dos instrumentos, petrechos e equipamentos de qualquer natureza utilizados na infração." },
          { id: "D", text: "Não caracteriza infração ambiental, já que os peixes eram de pequeno porte e foram pescados para a alimentação do agente e sua família." }
        ],
        correctOption: "A",
        explanation: "De acordo com a Lei 9.605/98 (Lei de Crimes Ambientais), art. 34, é crime 'pescar em período no qual a pesca seja proibida ou em lugares interditados por órgão competente', com pena de detenção de um a três anos. Conforme previsto no art. 27 da mesma lei, os crimes ambientais de menor potencial ofensivo admitem transação penal.",
        area: "Direito Ambiental"
      },
      {
        id: 37,
        text: "Miguel Tavares vendeu um imóvel para Margarida Pinto localizado na comarca de Caxias do Sul, RS. Ficou avençado que a imissão na posse ocorreria na celebração da escritura pública, e o pagamento seria feito em 48 prestações. Após o pagamento de 15 prestações, a compradora entrou em virtude de desemprego, passou a não ter condições financeiras para a quitação das prestações, fato que foi imediatamente comunicado ao vendedor. Diante da inadimplência, Miguel contratou uma sociedade empresária, conferindo expressamente amplos poderes para a cobrança. A referida sociedade entrou em contato com a compradora dezenas de vezes por dia cobrando a dívida. O teor do contato da cobrança, tendo sido emitido centenas de mensagens por períodos de até 45 dias, em horários diferentes, inclusive, pela via digital, telefone, mensagens de redes sociais e em endereços sociais com alcance na região de Caxias do Sul, informando a inadimplência da compradora, mediante inclusão de seu nome em todas as publicações. Diante da situação hipotética narrada, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "A atitude da sociedade empresária é válida, visto que age em nome do vendedor, no exercício regular da cobrança de um débito." },
          { id: "B", text: "Por ser terceira interessada, a conduta da sociedade empresária é considerada ato ilícito, não conduzindo à responsabilidade civil." },
          { id: "C", text: "O eventual ato ilícito cometido pela sociedade empresária só atinge a credora se for demonstrado o dolo excessivo de sua conduta." },
          { id: "D", text: "A conduta da sociedade empresária, que age em nome da vendedora, excede manifestamente os limites impostos pelo seu fim econômico ou social, pela boa-fé ou pelos bons costumes, caracterizando ato ilícito." }
        ],
        correctOption: "D",
        explanation: "De acordo com o Código Civil, art. 187, 'Também comete ato ilícito o titular de um direito que, ao exercê-lo, excede manifestamente os limites impostos pelo seu fim econômico ou social, pela boa-fé ou pelos bons costumes'. A sociedade empresária extrapolou os limites razoáveis na cobrança da dívida, caracterizando abuso de direito.",
        area: "Direito Civil"
      },
      {
        id: 38,
        text: "Mariana e Manuela celebraram contrato escrito de locação de imóvel urbano para fim residencial, pelo prazo de 30 meses. Decorrido o prazo previsto no contrato, Mariana, locatária, permaneceu no imóvel, e Manuela, locadora, periodicamente recebe e dá quitação dos aluguéis recebidos. Sobre a situação de Mariana, passados três meses do prazo findo do contrato, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Está sujeita ao direito potestativo de renovação de Manuela, que poderá renovar por mais 30 meses o contrato." },
          { id: "B", text: "Tem a possibilidade de exercer denúncia vazia, garantindo à Manuela, pelo menos, o prazo de 30 dias para a desocupação do imóvel." },
          { id: "C", text: "Não tem a faculdade de exercer denúncia vazia, pois, em razão do prazo contratual inicialmente convencionado, somente caberá denúncia cheia." },
          { id: "D", text: "Deverá renegociar as cláusulas contratuais com Manuela, e estabelecer um novo prazo, por não haver presunção de prorrogação contratual para o caso." }
        ],
        correctOption: "B",
        explanation: "De acordo com a Lei 8.245/91 (Lei de Locações), art. 46, §2º, 'Se, findo o prazo, o locatário continuar na posse do imóvel alugado por mais de 30 dias sem oposição do locador, presumir-se-á prorrogada a locação por prazo indeterminado'. Nesse caso, o locatário pode exercer a denúncia vazia, conforme art. 57, observando o prazo de 30 dias para desocupação.",
        area: "Direito Civil"
      },
      {
        id: 39,
        text: "Priscila e Lucas tiveram filhos muito cedo. Com 20 anos, Priscila teve Hugo, com Pedro. Com 19 anos, Lucas teve Vitória, com Larissa. Priscila e Lucas decidiram se casar tempos depois. Após vinte anos de casamento, sempre moraram com os filhos que eram bebês e se casaram tempos depois. Após vinte anos de casamento, sempre moraram com os filhos que eram bebês e se casaram tempos depois. Durante esse tempo, Priscila cuidou de Vitória como se fosse filha dela, contribuindo, inclusive, com as despesas da menina e de Lucas, por sua vez, cuidou dos custos e da educação de Hugo. Priscila a Lucas e Pedro, apesar de os menores sempre terem vivido na mesma casa. Os gastos específicos de cada menor sempre foram custeados por Priscila e por Pedro. Sobre os fatos narrados, segundo o ordenamento jurídico brasileiro, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Por terem Priscila e Lucas constituído multiparentalidade, Vitória e Hugo, que sempre foram criados como um casal, não se podem namorar e, caso o mesmo fato, fica automaticamente configurada a multiparentalidade." },
          { id: "B", text: "Por ter sempre morado com Lucas, Hugo pode buscar o reconhecimento do vínculo de paternidade socioafetiva com ele, o que não extingue o vínculo jurídico entre Hugo e Pedro." },
          { id: "C", text: "Por ter Priscila criado Vitória como se fosse mãe e filha, é possível o reconhecimento do vínculo de parentalidade socioafetiva, com o consentimento de Vitória sem prejuízo, necessariamente, do vínculo de Vitória com Larissa." },
          { id: "D", text: "Por ser conhecida a mãe biológica de Vitória, não é possível a configuração de parentalidade socioafetiva com Priscila, assim como, por ser conhecido o pai biológico de Hugo, não é possível a configuração de parentalidade socioafetiva com Lucas." }
        ],
        correctOption: "C",
        explanation: "O STF reconheceu a possibilidade jurídica da multiparentalidade (RE 898.060), permitindo o reconhecimento simultâneo de laços biológicos e socioafetivos. Assim, Priscila pode ter seu vínculo socioafetivo com Vitória reconhecido sem prejuízo do vínculo biológico de Vitória com Larissa, desde que haja o consentimento da filha.",
        area: "Direito Civil"
      },
      {
        id: 40,
        text: "Ivan, André e Caio celebraram negócio jurídico pelo qual se obrigaram a entregar um veículo da marca M à Bruna. Na data avençada para o cumprimento da obrigação, Ivan deu à Bruna uma carta de marca V de sua propriedade. Sobre a situação hipotética apresentada, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Bruna pode exigir de André e Caio, independentemente das respectivas cotas-partes, o objeto da dívida." },
          { id: "B", text: "Ivan deve poder obrigar André e Caio, pelo dinheiro, as respectivas cotas-partes no débito." },
          { id: "C", text: "André e Caio permanecem co-obrigados perante Bruna pela parte que lhes cabe na dívida." },
          { id: "D", text: "Tanto André como Caio permanecem responsáveis pela entrega de um carro, agora perante Ivan." }
        ],
        correctOption: "B",
        explanation: "De acordo com o Código Civil, art. 283, 'O devedor que satisfez a dívida por inteiro tem direito a exigir de cada um dos co-devedores a sua quota'. Assim, Ivan, que cumpriu integralmente a obrigação, tem direito de regresso contra André e Caio, pelas respectivas quotas-partes.",
        area: "Direito Civil"
      },
      {
        id: 41,
        text: "Maria, idosa de 75 anos, mãe de três filhos, decidiu contratar você, como advogado(a), para formalizar seu planejamento sucessório. A mensora deseja que as regras de transferência antecipada da propriedade de um de seus imóveis (cujo valor representa 40% do seu patrimônio) para seu filho mais velho. No entanto, ela pretende reservar para si o direito de permanecer usando e explorando o bem para usufruto e exploração até sua morte. Em razão dessas circunstâncias, ela pretendeu formalizar uma escritura pública com cláusula que colocava o bem na parte disponível de seu patrimônio, conforme um registro no Cartório de Registro de Imóveis, o que foi feito por Paulo. Poucos anos depois, Maria faleceu. Diante da situação jurídica desse, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "A doação deve ser declarada nula, porque caracteriza-se como inoficiosa." },
          { id: "B", text: "O herdeiro testamentário é obrigado, à colação, a conferir o valor da doação para igualar as legítimas." },
          { id: "C", text: "Os três filhos de Maria tinham, via sucessão legítima, o seu direito de usufruto sobre o bem imóvel." },
          { id: "D", text: "O usufruto é extinto, consolidando-se a propriedade plena do donatário com o cancelamento do registro." }
        ],
        correctOption: "D",
        explanation: "De acordo com o Código Civil, art. 1.410, I, 'O usufruto extingue-se, cessando o direito do usufrutuário: I - pela morte do usufrutuário'. Assim, com a morte de Maria, o usufruto se extingue, consolidando-se a propriedade plena em favor do filho que recebeu o imóvel em doação.",
        area: "Direito Civil"
      },
      {
        id: 42,
        text: "Braz Cubas procurou você, como advogado(a), relatando ser possuidor e proprietário do imóvel situado à Rua Machado de Assis, nº XX, centro, no Município Alpha, há mais de 50 anos, preservando, desde as suas origens até o presente, as mesmas características, sem que houvesse por parte da vizinhança qualquer reclamação ou denúncia, sobretudo no que tange à disposição das janelas, já que se encontram dentro dos limites legais. Segundo o relato de Braz, sua vizinha, Virgília, no último mês, abriu grandes janelas no muro da divisória dos terrenos e uma claraboia no telhado. Em consonância com o Código Civil brasileiro, assinale a opção que apresenta, corretamente, sua orientação dada.",
        options: [
          { id: "A", text: "O caso apresentado, por estar sujeito ao direito de vizinhança, as janelas cuja visão não incida sobre a linha divisória, bem como as perpendiculares, não poderão ser abertas a menos de um metro e meio." },
          { id: "B", text: "A abertura é válida e eficaz, porque nada na norma legal que impeça a abertura de janelas ou a construção de eirado, terraço ou varanda a menos de metro e meio do terreno vizinho." },
          { id: "C", text: "O proprietário pode, no lapso de ano e dia após a conclusão da obra, pedir que se desfaça janela que fora construída em desacordo com a legislação vigente." },
          { id: "D", text: "A construção de claraboia não é impedida devido à função social da propriedade, positivado no Código Civil brasileiro e tutelado no direito dos confinantes." }
        ],
        correctOption: "A",
        explanation: "De acordo com o Código Civil, art. 1.301, 'É defeso abrir janelas, ou fazer eirado, terraço ou varanda, a menos de metro e meio do terreno vizinho'. Esta limitação visa proteger a privacidade entre vizinhos, impedindo a visão direta de uma propriedade para outra a curta distância.",
        area: "Direito Civil"
      },
      {
        id: 43,
        text: "João, 14 anos, criou um perfil online para realizar apostas em sites de jogos de futebol, realizando esportes e ganhando prêmies em dinheiro prestados. Sobre a possibilidade de responsabilização do site, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Não há ilícito por parte do site, pois a maioridade não é exigida para sua atividade." },
          { id: "B", text: "O site deve ser responsabilizado, pois cometeu infração administrativa prevista no Estatuto da Criança e Adolescente." },
          { id: "C", text: "O site não deve ser responsabilizado, pois não é exigível o controle além da autodeclaração de maioridade, demandada em cada acesso." },
          { id: "D", text: "A atividade de aposta desportivizada no site não se identifica, para fins de prevenção normativa, com a restrição de acesso imposta às crianças e adolescentes às casas de apostas, de modo que não há infração por parte do site." }
        ],
        correctOption: "B",
        explanation: "De acordo com o Estatuto da Criança e do Adolescente (Lei 8.069/90), art. 80, é proibida a entrada de crianças e adolescentes em casas de jogos e apostas. O art. 258 prevê multa para quem descumprir esta determinação. Sites de apostas online também estão sujeitos a essas restrições, devendo implementar mecanismos efetivos de verificação de idade.",
        area: "Direito Civil"
      },
      {
        id: 44,
        text: "Roberta, 35 anos, descobriu que estava grávida e ficou muito preocupada, já que possuia parcos recursos financeiros e acredita que não seria uma boa mãe. Essa angústia desencadeou graves problemas que precisam ser tratados por meio de sessões com psicólogo(a). Diante da falta de recursos financeiros para custear o profissional, Roberta lhe procura para obter orientação jurídica. De acordo com o Estatuto da Criança e do Adolescente (ECA), Roberta :",
        options: [
          { id: "A", text: "não possui direito à assistência psicológica, por inexistir previsão legal." },
          { id: "B", text: "tem direito à assistência psicológica apenas no período pós-natal, caso se verifique que o estado puerperal pode prejudicar o desenvolvimento da criança." },
          { id: "C", text: "Roberta tem direito à assistência psicológica durante a gestação, no período pré e pós-natal, inclusive como forma de prevenir ou minorar as consequências do estado puerperal, sendo essa incumbência do poder público." },
          { id: "D", text: "Deve contar com o poder público para lhe proporcionar assistência psicológica a Roberta enquanto estiver gestante. No período pós-natal, como a criança estará fora de qualquer risco, o poder público não terá a obrigação de prestar assistência psicológica." }
        ],
        correctOption: "C",
        explanation: "De acordo com o Estatuto da Criança e do Adolescente (ECA), art. 8º, §4º: 'Incumbe ao poder público proporcionar assistência psicológica à gestante e à mãe, no período pré e pós-natal, inclusive como forma de prevenir ou minorar as consequências do estado puerperal'.",
        area: "Direito Civil"
      },
      {
        id: 45,
        text: "A sociedade empresária Óleo Essencial de Barreto Ltda. fabrica, há cinquenta anos, o produto que originou o nome empresarial, criado pelo fundador da indústria e amplamente utilizado pelo público como item pessoal inclusive e várias utilidades, sobretudo como óleo de banho. Recentemente, ao conduzir uma pesquisa científica, o químico da fábrica levou ao conhecimento da diretoria o fato de que o uso do produto Óleo Essencial de Barreto pode causar queimaduras graves em um certo grupo de pessoas, caso seja associado a um novo tipo de produto cuja uso vem crescendo no país. Sobre o caso narrado, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Cabe à Óleo Essencial de Barreto Ltda. cessar, imediatamente, a fabricação do produto." },
          { id: "B", text: "Cabe à Óleo Essencial de Barreto Ltda. comunicar, imediatamente, o risco descoberto às autoridades administrativas, se ofício, proibir, imediatamente, a fabricação do produto." },
          { id: "C", text: "Cabe à Óleo Essencial de Barreto Ltda. comunicar, imediatamente, o risco aos consumidores." },
          { id: "D", text: "Por se tratar de um produto disponibilizado no mercado há mais de cinquenta anos, a Óleo Essencial de Barreto Ltda. não precisa tomar qualquer providência quanto ao risco descoberto." }
        ],
        correctOption: "C",
        explanation: "De acordo com o Código de Defesa do Consumidor (Lei 8.078/90), art. 10, §1º: 'O fornecedor de produtos e serviços que, posteriormente à sua introdução no mercado de consumo, tiver conhecimento da periculosidade que apresentem, deverá comunicar o fato imediatamente às autoridades competentes e aos consumidores, mediante anúncios publicitários'.",
        area: "Direito do Consumidor"
      },
      {
        id: 46,
        text: "A sociedade empresária XYZ Fabrica e Comercialização Digital S.A., por meio do site de um representante empresarial autorizado, vende os bens informáticos que fabrica. Glaucia, estudante universitária, em 23 de junho de 2024, realizou a compra na Internet de um desktop e dois monitores. Os produtos seriam destinados aos seus estudos e ao trabalho na modalidade home office, que começaria em 1º de julho. Mas os produtos não chegaram à sociedade empresária informou que não os possui em estoque, e a fábrica encontra-se com carência de matéria-prima. Sobre a hipótese apresentada, com base no Código de Defesa do Consumidor, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Glaucia deve esperar 30 dias afim do prazo inicial para, então, exigir a substituição ou devolução do valor pago." },
          { id: "B", text: "Glaucia pode desistir da compra e solicitar a devolução integral do valor pago, uma vez que o produto não foi entregue dentro do prazo." },
          { id: "C", text: "Glaucia deve esperar até que a falta de insumos é uma causa legítima para o atraso." },
          { id: "D", text: "Diante da cláusula e da ausência de matéria-prima, a sociedade empresária XYZ Fabrica e Comercialização Digital S.A. não responde solidariamente pelos atos do representante autônomo." }
        ],
        correctOption: "B",
        explanation: "De acordo com o Código de Defesa do Consumidor (Lei 8.078/90), art. 35, III, se o fornecedor recusar cumprimento à oferta ou não entregar o produto no prazo, o consumidor pode 'rescindir o contrato, com direito à restituição de quantia eventualmente antecipada, monetariamente atualizada, e a perdas e danos'. A falta de insumos não é justificativa válida para descumprimento contratual.",
        area: "Direito do Consumidor"
      },
      {
        id: 47,
        text: "O Código Civil, ao tratar da caracterização do empresário, afasta dessa instituto as pessoas naturais que exercem profissão intelectual, de natureza científica, literária ou artística. Todavia, o Código Civil admitiu a possibilidade de essas pessoas virem a ser reputadas empresárias, e, como tais, sujeitas a inscrição na Junta Comercial. Assinale a opção que apresenta a condição para que isso ocorra.",
        options: [
          { id: "A", text: "O exercício da profissão intelectual deve constituir elemento de empresa." },
          { id: "B", text: "A pessoa natural deve exercer atividade econômica com o concurso de auxiliares ou colaboradores." },
          { id: "C", text: "O exercício da profissão, de natureza científica, literária ou artística, deve constituir elemento de empresa e a pessoa natural deve ser enquadrada como Microempreendedor individual." },
          { id: "D", text: "A pessoa natural deve exercer atividade não eventual em nome próprio." }
        ],
        correctOption: "A",
        explanation: "De acordo com o Código Civil, art. 966, parágrafo único: 'Não se considera empresário quem exerce profissão intelectual, de natureza científica, literária ou artística, ainda com o concurso de auxiliares ou colaboradores, salvo se o exercício da profissão constituir elemento de empresa'.",
        area: "Direito Empresarial"
      },
      {
        id: 48,
        text: "Roberto, 67 anos, sócio de sociedade limitada, relacionada a sua atividade profissional de prazo indeterminado, que entrou em atividade na data da assinatura do contrato, levado a registro na semana seguinte, no Registro Civil de Pessoas Jurídicas. Assinale a opção que indica a hipótese de dissolução da referida sociedade.",
        options: [
          { id: "A", text: "A deliberação dos sócios, por maioria absoluta de capital." },
          { id: "B", text: "A septamente da exploração de objeto social declarado na sua inexequibilidade." },
          { id: "C", text: "O falecimento de qualquer dos sócios, independentemente de quorum." },
          { id: "D", text: "A existência de apenas um sócio, não reconstituída a pluralidade em até 180 (cento e oitenta) dias." }
        ],
        correctOption: "D",
        explanation: "De acordo com o Código Civil, art. 1.033, IV, a sociedade limitada se dissolve quando 'a sociedade de sócios for reduzida a unidade, se no prazo de 180 (cento e oitenta) dias não for recomposto o número mínimo de sócios'.",
        area: "Direito Empresarial"
      },
      {
        id: 49,
        text: "Maura Chaile, sócia administradora da sociedade Produtora de Lacticinios Santana do Manhuaçu Ltda., procura você, como advogado(a), informando que a sociedade é titular da marca de produto Chale e deseja saber quais os direitos assegurados por ser titular da marca de produto. Sobre a situação descrita, com base na legislação, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "A sociedade pode licenciar o uso da marca de produto Chale e ceder sua titularidade." },
          { id: "B", text: "A sociedade pode impedir que empresários utilizem sinais distintivos ou legislação, mesmo que não sejam idênticos, para identificar produtos ou serviços semelhantes." },
          { id: "C", text: "A sociedade pode, na venda direta ao consumidor, omitir a exposição do preço, bem como indicado para as práticas leais de comércio." },
          { id: "D", text: "A sociedade pode vetar a citação da marca em discurso, obra científica ou literária, com ou sem conotação comercial, independentemente de prejuízo ao caráter distintivo." }
        ],
        correctOption: "A",
        explanation: "De acordo com a Lei da Propriedade Industrial (Lei 9.279/96), art. 130, o titular da marca tem o direito de 'ceder seu registro ou pedido de registro; licenciar seu uso; zelar pela sua integridade material ou reputação'. Portanto, a sociedade pode licenciar o uso da marca e ceder sua titularidade.",
        area: "Direito Empresarial"
      },
      {
        id: 50,
        text: "A sociedade empresaria Drogaria Porto dos Volantes Ltda. requereu recuperação judicial e teve deferido o processamento, sendo que ambos os eventos ocorreram no ano de 2021. Nos exercícios sociais de 2022 e 2023, a sociedade não distribuiu lucros aos sócios, embora eles tivessem sido auferidos em 2022 e 2023. O sócio minoritário Lucas Sobrado consultou você, como advogado(a), para saber da validade da ausência de distribuição dos lucros aos sócios. Informando que o plano de recuperação judicial foi aprovado em dezembro de 2023, consulta a você, como advogado(a), qual a opção que apresenta, corretamente, a resposta jurídica.",
        options: [
          { id: "A", text: "A sociedade agiu em contrariedade a direito, pois o plano de recuperação judicial deve ser aprovado e homologado antes da distribuição de lucros nos exercícios sociais, informando-o ainda que não há ilegalidade em distribuir lucros após o deferimento do processamento da recuperação judicial, desde que os valores gerados sejam excepcionais." },
          { id: "B", text: "A sociedade poderá ter deixado de distribuir lucros nos exercícios sociais de 2022 e 2023, pois os lucros podem ser retidos por sócios por direito essencial deles." },
          { id: "C", text: "É vedada a distribuição de lucros pela sociedade aos sócios enquanto não for realizado o pagamento do plano de recuperação judicial, de modo que não há ilegalidade por parte dela." },
          { id: "D", text: "A sociedade empresarial, até a aprovação do plano de recuperação judicial, estava impedida de distribuir lucros aos sócios, mas não há justificativa para o não pagamento no exercício de 2023." }
        ],
        correctOption: "C",
        explanation: "De acordo com a Lei 11.101/2005 (Lei de Recuperação de Empresas), art. 6-A, §9º, é vedada a distribuição de lucros ou dividendos aos sócios ou acionistas da empresa em recuperação judicial até a aprovação do plano de recuperação judicial, exceto se houver expressa previsão no plano aprovado ou se houver autorização judicial.",
        area: "Direito Empresarial"
      },
      {
        id: 51,
        text: "Ana Carolina procurou você, como advogado(a), para elaborar sua defesa em demanda pelo procedimento comum movida por Eduardo perante Vara Cível com o objetivo de obter indenização em virtude de suposto descumprimento de Ana Carolina, qual seja, fez entrega de uma quantidade pelo valor que seria de fato menor do que a que foi contratada. Nessa reunião, Ana Carolina relatou que a indenização não era devida, porque ela havia entregado a quantidade contratada e, na realidade, fez Eduardo não tinha realizado o pagamento integral conforme avençado na minuta final. Sob as circunstâncias, na referia de suas soa aconselhada, ele indiciou se, como advogado(a) de Ana Carolina, ela indicou-se, como advogado(a), que a defendida terá que indicar uma nova demanda movida por Eduardo, sendo que essa medida devera ser formulada em peça separada da contestação. Assinale a opção que apresenta a medida que você, como advogado(a) de Ana Carolina, indicou.",
        options: [
          { id: "A", text: "Ana Carolina terá que ajuizar uma nova demanda autônoma, visando ao pagamento da quantia devida por Eduardo." },
          { id: "B", text: "Ana Carolina deverá apresentar reconvenção para cobrar a quantia que lhe é devida por Eduardo, sendo que essa medida deverá ser formulada em peça apartada da contestação." },
          { id: "C", text: "Ana Carolina poderá apresentar reconvenção para cobrar a quantia que lhe é devida por Eduardo, sendo que essa medida deverá ser formulada em petição ajustada da contestação." },
          { id: "D", text: "Ana Carolina poderá formular pedido contraposto para cobrar a quantia que lhe é devida por Eduardo, sendo que essa medida deverá ser formulada em petição apartada da contestação." }
        ],
        correctOption: "C",
        explanation: "De acordo com o Código de Processo Civil, art. 343, §1º: 'Proposta a reconvenção, o autor será intimado, na pessoa de seu advogado, para apresentar resposta no prazo de 15 (quinze) dias'. O §6º dispõe que 'A reconvenção pode ser proposta contra o autor e terceiro'. A reconvenção deve ser apresentada na própria contestação.",
        area: "Direito Processual Civil"
      },
      {
        id: 52,
        text: "Neusa ajuizou ação condenatória em face de Marcelo. Em sua causa de pedir, a autora sustentou que o réu, utilizando seu veículo automotor, colidiu contra o carro da autora, dirigido pelo seu filho, causando-lhes danos morais e materiais. Diante da necessidade de produção de prova oral, consistente em depoimento pessoal e oitiva de testemunhas, o juiz designou audiência de instrução e julgamento. As partes tempestivamente apresentaram suas testemunhas, que estavam nos respectivos veículos no momento da colisão. Neusa indicou Gabriel, de 17 anos, por sua vez, Marcelo indicou João, seu amigo íntimo, é Bruno, sua prima. Sobre o caso acima, segundo o ordenamento jurídico brasileiro, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Gabriel é incapaz de depor, por ser menor de 18 anos de idade." },
          { id: "B", text: "João também é impedido de depor, diante da amizade íntima e da relação de interesse com Marcelo." },
          { id: "C", text: "Bruno poderá depor como testemunha, não havendo impedimento referente à relação de parentesco por consanguinidade que possui com Marcelo." },
          { id: "D", text: "O juiz poderá admitir o depoimento de João, ainda que seja amigo íntimo de Marcelo, em caso em que seja indispensável a prestação do compromisso de dizer a verdade." }
        ],
        correctOption: "D",
        explanation: "De acordo com o Código de Processo Civil, art. 447, §4º: 'Sendo necessário, pode o juiz admitir o depoimento das testemunhas menores, impedidas ou suspeitas'. O §5º complementa: 'Os depoimentos referidos no § 4º serão prestados independentemente de compromisso, e o juiz lhes atribuirá o valor que possam merecer'.",
        area: "Direito Processual Civil"
      },
      {
        id: 53,
        text: "Gabriela ajuizou um pacote de viagens com a sociedade empresarial VoaKlass, mas não conseguiu embarcar pois, na hora da viagem, não conseguiu emitir seus bilhetes aéreos. Em consequência, Gabriela ajuizou ação indenizatória em face de VoaKlass. Em sentença, o juiz julgou procedente o pedido, condenando a ré ao pagamento de indenização por danos morais e materiais, acrescidos de juros e correção monetária, de R$ 30.000,00 (trinta mil reais). Inconformada, a VoaKlass recorreu de apelação e, interposto este recurso, Gabriela, então, procurou você, na qualidade de advogado(a), com o objetivo de receber imediatamente o valor previsto na condenação, independentemente do julgamento da apelação interposta. nessa situação de sentença. Assinale a opção que presenta, corretamente, sua orientação sobre o tema.",
        options: [
          { id: "A", text: "Ela não poderá iniciar o cumprimento da sentença na modalidade definitiva, tendo em vista que a sentença não é de natureza alimentar." },
          { id: "B", text: "Ela poderá iniciar o cumprimento da sentença, na modalidade provisória, que não correrá por sua iniciativa e responsabilidade, tendo certo que, no caso de reforma da sentença, o levantamento do depósito em dinheiro dependerá, sempre, de caução idônea prestada nos próprios autos." },
          { id: "C", text: "Ela poderá iniciar o cumprimento da sentença na modalidade provisória, que correrá por sua iniciativa e responsabilidade, tendo certo que a tutela provisória é concedida na sentença." },
          { id: "D", text: "Ela poderá iniciar o cumprimento da sentença, na modalidade provisória, mas o levantamento de depósito em dinheiro dependerá, em regra, de caução idônea prestada nos próprios autos." }
        ],
        correctOption: "D",
        explanation: "De acordo com o Código de Processo Civil, art. 520, IV, o levantamento de depósito em dinheiro no cumprimento provisório de sentença depende de caução idônea, exceto em alguns casos específicos como créditos de natureza alimentar ou valor que não exceda a 60 salários mínimos para credores em estado de necessidade.",
        area: "Direito Processual Civil"
      },
      {
        id: 54,
        text: "João propôs ação indenizatória em face da sociedade empresária Campo Bom, em causa própria. Foi proferida sentença, condenando a ré ao pagamento ao principal e, considerando que ela sucumbiu mínima, o pagamento integral de honorários advocatícios de sucumbência. Sobre os honorários advocatícios arbitrados no caso, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Os honorários não são devidos, nos casos em que o advogado atua em causa própria." },
          { id: "B", text: "Um litigante sucumbir em parte mínima do pedido, o outro responderá, por inteiro, pelos honorários." },
          { id: "C", text: "Como arbitrados os honorários no cumprimento de sentença." },
          { id: "D", text: "Os honorários podem ser arbitrados por equidade, apesar de o valor da condenação ser líquido, por se tratar de ação indenizatória." }
        ],
        correctOption: "B",
        explanation: "De acordo com o Código de Processo Civil, art. 86, parágrafo único: 'Se um litigante sucumbir em parte mínima do pedido, o outro responderá, por inteiro, pelas despesas e pelos honorários'. Esta regra aplica-se independentemente de o advogado atuar em causa própria.",
        area: "Direito Processual Civil"
      },
      {
        id: 55,
        text: "Joana formulou requerimento de cumprimento de sentença, em face de Regina. No curso do processo, Joana obteve a penhora de um automóvel de propriedade de Regina, cujo valor de mercado é R$ 10.000,00 (dez mil reais), superior ao do montante executado, sendo nomeada depositária do bem. No atual momento processual, Joana deseja se tornar proprietária do automóvel de Regina. Por essa razão, requereu a adjudicação do bem ao juízo. Nesse caso, segundo o ordenamento jurídico brasileiro, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "É admitido o uso de adjudicação pelo exequente, mas o pedido deve ser precedido à alienação do bem, que é medida expropriatória preferencial." },
          { id: "B", text: "Desde que depositada a eventual diferença entre o valor do crédito e o da avaliação do automóvel, que ficará à disposição do executado, Joana poderá se tornar proprietária do automóvel." },
          { id: "C", text: "Coma a alienação é a única forma de expropriação de bens admitida pelo Código de Processo Civil, caberá a Joana tentar a arrematação do bem em leilão eletrônico, tendo direito de preferência." },
          { id: "D", text: "Como a alienação é a única forma de expropriação de bens admitida pelo Código de Processo Civil, caberá a Joana tentar a arrematação do bem em leilão eletrônico, tendo direito de preferência." }
        ],
        correctOption: "B",
        explanation: "De acordo com o Código de Processo Civil, art. 876: 'É lícito ao exequente, oferecendo preço não inferior ao da avaliação, requerer que lhe sejam adjudicados os bens penhorados'. O art. 876, §4º, I determina que: 'Se o valor do crédito for inferior ao dos bens, o requerente da adjudicação depositará de imediato a diferença, que ficará à disposição do executado'.",
        area: "Direito Processual Civil"
      },
      {
        id: 56,
        text: "Em uma tarde de domingo, voltando do shopping com seu namorado, Marisa se distraiu e colidiu contra a traseira do automóvel de Leandro. Assustada com a reação de Leandro, que saiu do carro aos gritos, Marisa insistiu anotar placa do carro e ajuizou uma ação indenizatória por dano material em face de Marisa, na mesma semana, com pedido de indenização por danos materiais em face de Marisa, ela procurou sua seguradora até a decisão seguradora. Acerca do caso, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Marisa deve pedir a ODR (Online Dispute Resolution) da seguradora atá a decisão seguradora." },
          { id: "B", text: "Se a empresa seguradora contestar o pedido de Leandro, o processo prosseguindo tendo, na ação principal, um litisconsorte, Marisa e a seguradora." },
          { id: "C", text: "Sendo julgado procedente o pedido de indenização por danos materiais, Leandro não pode pedir o cumprimento de sentença somente contra Marisa." },
          { id: "D", text: "Sendo julgado procedente o pedido de indenização por danos materiais, mesmo apresentando contestação quanto ao mérito, a seguradora não será condenada em honorários de sucumbência." }
        ],
        correctOption: "B",
        explanation: "De acordo com o Código de Processo Civil, art. 125, II, é admissível o chamamento ao processo do segurador pela parte demandada. Formando-se um litisconsórcio passivo entre a segurada (Marisa) e a seguradora, ambas serão partes no processo, com todos os direitos e deveres processuais decorrentes dessa condição.",
        area: "Direito Processual Civil"
      },
      {
        id: 57,
        text: "Maria, brasileira e residente no Brasil, resolveu viajar para o exterior e lá praticou o delito de embriaguez ao volante, que, embora típico no Brasil, no país onde seria praticado não é tipificado. Ao retornar ao Brasil, os fatos foram noticiados às autoridades competentes. Com base na hipótese apresentada, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Maria está sujeita à extraterritorialidade da lei penal brasileira em razão de sua nacionalidade, podendo responder pelo ilícito praticado." },
          { id: "B", text: "Maria não poderá responder pelo fato, tendo em vista a inaplicabilidade da lei penal brasileira em razão de lei territorial do pais." },
          { id: "C", text: "Maria não poderá responder pelo fato, tendo em vista que a conduta foi praticada fora do território do Brasil." },
          { id: "D", text: "Maria está sujeita à extraterritorialidade da lei penal brasileira, em razão da lei em vigor no Estado de sua residência." }
        ],
        correctOption: "B",
        explanation: "De acordo com o Código Penal, art. 7º, §2º, II, b, para que se aplique a lei brasileira aos crimes cometidos por brasileiros no exterior (extraterritorialidade condicionada), é necessário que o fato seja punível também no país em que foi praticado (princípio da dupla tipicidade). Como no caso a conduta não é considerada crime no país onde foi praticada, não se pode aplicar a lei penal brasileira.",
        area: "Direito Penal"
      },
      {
        id: 58,
        text: "Ana Paula é repórter esportiva de uma emissora de televisão. Ao participar de uma reportagem ao vivo na mídia televisiva, um torcedor presente ao estádio, com intenção de satisfazer sua própria lascívia, a abraça e, em seguida, foge. Ana Paula, então, procura você, como advogado(a), para saber como proceder. Assinale a afirmativa que apresenta corretamente sua orientação.",
        options: [
          { id: "A", text: "O fato constitui importunação sexual e se processa mediante ação penal pública incondicionada." },
          { id: "B", text: "O ato deve ser identificado como delito de injúria real e se processa mediante ação penal privada." },
          { id: "C", text: "O episódio equivale a estupro e se processa mediante ação penal pública condicionada à representação da ofendida." },
          { id: "D", text: "O caso tipifica posse sexual mediante fraude e se processa mediante ação penal pública condicionada à representação da vítima." }
        ],
        correctOption: "A",
        explanation: "De acordo com o Código Penal, art. 215-A (incluído pela Lei 13.718/2018): 'Praticar contra alguém e sem a sua anuência ato libidinoso com o objetivo de satisfazer a própria lascívia ou a de terceiro' constitui o crime de importunação sexual. Conforme art. 225 do CP, trata-se de crime que se processa mediante ação penal pública incondicionada.",
        area: "Direito Penal"
      },
      {
        id: 59,
        text: "Caio, muito atuante nas redes sociais, compartilhou vídeos e fotos pornográficos em um grupo de amigos. O material compartilhado continha imagens que feriam a dignidade de terceiros, já tendo sido inclusive objeto de registros policiais por parte das vítimas. Uma das pessoas para as quais Caio repassou o material relata a atitude de Caio. O Delegado indicia Caio pelo crime de?",
        options: [
          { id: "A", text: "O Delegado indicia Caio pele crime previsto no art. 218-C do CP, o qual prevê a figura penal do compartilhamento não autorizado de cena de sexo ou pornografia." },
          { id: "B", text: "O fato é atípico, porque Caio não ter conhecimento de que o fato por ele praticado seria criminoso." },
          { id: "C", text: "O fato é permissivo, já que todas as pessoas eram maiores de 18 anos." },
          { id: "D", text: "O fato é de proibição indireta." }
        ],
        correctOption: "A",
        explanation: "De acordo com o Código Penal, art. 218-C: 'Oferecer, trocar, disponibilizar, transmitir, vender ou expor à venda, distribuir, publicar ou divulgar, por qualquer meio - inclusive por meio de comunicação de massa ou sistema de informática ou telemática -, fotografia, vídeo ou outro registro audiovisual que contenha cena de estupro ou de estupro de vulnerável ou que faça apologia ou induza a sua prática, ou, sem o consentimento da vítima, cena de sexo, nudez ou pornografia' constitui crime.",
        area: "Direito Penal"
      },
      {
        id: 60,
        text: "Alfredo, motorista da sociedade empresária Guardião Ltda., pessoa jurídica de direito privado que presta serviços de segurança, é subordinado ao gerente Marcos. No dia 10/3/2023, Marcos ordenou que Alfredo fizesse a escolta de um cliente. Na busca de vada, Alfredo foi preso em uma blitz, acusado de um crime antecedente, até mesmo por não ser responsável pelos serviços que o veículo funcional que conduzia era proveniente de roubo. A despeito de não ter ciência do crime antecedente, Marcos foi preso em flagrante por suposta prática do crime de receptação dolosa. Diante da exposição, assinale a opção que apresenta, corretamente, a alegação que você, como advogado(a) de Alfredo, deverá apresentar.",
        options: [
          { id: "A", text: "A excludente da culpabilidade, por exercício regular do direito." },
          { id: "B", text: "A excludente da ilicitude, por exercício do dever legal." },
          { id: "C", text: "A excludente da tipicidade, por ausência de elemento subjetivo do tipo." },
          { id: "D", text: "A excludente da culpabilidade por inexigibilidade de conduta diversa, consistente na obediência hierárquica." }
        ],
        correctOption: "C",
        explanation: "De acordo com o Código Penal, art. 180, a receptação exige o dolo, ou seja, o agente deve saber que a coisa é produto de crime. Se Alfredo não tinha ciência de que o veículo era proveniente de roubo (ausência de dolo), há exclusão da tipicidade por ausência do elemento subjetivo do tipo. Não se trata de obediência hierárquica, pois a ordem do superior não era manifestamente ilegal.",
        area: "Direito Penal"
      },
      {
        id: 61,
        text: "Filateu, empresário, contratou Mateus para matar seu concorrente, Lucas, mediante pagamento antecipado de R$ 50.000,00 (cinquenta mil reais). Portando arma de fogo municiada, Mateus se pôs em campanha, levando consigo seu amigo, Atílio, que nada sabia sobre os fatos. Quando Lucas saiu de casa com seu filho no colo, Mateus não teve coragem de cumprir o acordado e abandonou o local sem que Lucas o avistasse. Diante dessas situações hipotéticas, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Filateu não praticou fato penalmente típico." },
          { id: "B", text: "Filateu e Mateus praticaram o crime de associação criminosa." },
          { id: "C", text: "Filateu deve responder por tentativa de homicídio em concurso." },
          { id: "D", text: "Filateu deve responder por tentativa de homicídio, tendo a pena atenuada em razão do arrependimento posterior de Mateus." }
        ],
        correctOption: "C",
        explanation: "De acordo com o Código Penal, art. 121 c/c art. 14, II, a contratação de pessoa para matar alguém mediante pagamento configura tentativa de homicídio qualificado quando há início da execução (Mateus se pôs em campanha armado). Filateu responde como mandante em concurso de agentes com Mateus, conforme art. 29 do CP.",
        area: "Direito Penal"
      },
      {
        id: 62,
        text: "Joelerson, quando tinha de 28 anos, foi condenado a cumprir uma pena privativa de liberdade de 20 anos de reclusão, mínima prevista para o delito que cometeu (tortura mediante seqüestro - Art. 1º, § 3º, do Código Penal). No dia seguinte ao trânsito em julgado da condenação, entrou em vigor a Lei A, que reduziu a pena mínima para o delito referido, fixando-a em 20 (vinte) anos de reclusão. Após intensos debates jurídicos, a Lei B revogou a Lei A, restabelecendo o patamar sancionatório anteriormente previsto. No dia seguinte à entrada em vigor da Lei B, Joelerson foi capturado e iniciou o cumprimento da pena. Diante dessa situação hipotética, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Joelerson somente terá jus à redução de pena se a sentença condenátória fosse iniciada antes da entrada em vigor da Lei A." },
          { id: "B", text: "Joelerson somente terá jus à redução da pena se a execução da condenação fosse iniciada antes da entrada em vigor da Lei B." },
          { id: "C", text: "Joelerson tem jus à redução da pena, pois ambas as leis citadas entraram em vigor após o trânsito em julgado da sentença condenatória." },
          { id: "D", text: "Joelerson não faz jus à redução da pena, pois ambas as leis citadas entraram em vigor após o trânsito em julgado da sentença condenatória." }
        ],
        correctOption: "C",
        explanation: "De acordo com o Código Penal, art. 2º, parágrafo único: 'A lei posterior, que de qualquer modo favorecer o agente, aplica-se aos fatos anteriores, ainda que decididos por sentença condenatória transitada em julgado'. A Lei A, mais benéfica, deve ser aplicada mesmo após o trânsito em julgado, e a Lei B não pode retroagir para prejudicar Joelerson.",
        area: "Direito Penal"
      },
      {
        id: 63,
        text: "Antônio e Rogério praticaram, em comunhão de ações e desígnios, um ilícito penal, e ambos foram condenados. Antônio, insatisfeito, interpôs recurso de apelação. Em razão da interposição do recurso, porém constatou que havia prescrição da pretensão punitiva na modalidade retroativa, o que foi sustentado em contrarrazões recursais. Neste caso, considerando os efeitos do recurso, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "O efeito devolutivo do recurso permite que o juiz reconsidere a decisão recorrida." },
          { id: "B", text: "O efeito translativo do recurso permite à instância ad quem apreciar a prescrição em suas contrarrazões." },
          { id: "C", text: "O efeito suspensivo do recurso permite que o Tribunal conheça toda a matéria impugnada." },
          { id: "D", text: "O efeito extensivo do recurso permite que Rogério aproveite qualquer decisão favorável a Antônio." }
        ],
        correctOption: "D",
        explanation: "De acordo com o Código de Processo Penal, art. 580: 'No caso de concurso de agentes, a decisão do recurso interposto por um dos réus, se fundado em motivos que não sejam de caráter exclusivamente pessoal, aproveitará aos outros'. Este é o chamado efeito extensivo do recurso, que permite que o corréu (Rogério) se beneficie da decisão favorável ao recorrente (Antônio).",
        area: "Direito Processual Penal"
      },
      {
        id: 64,
        text: "Em um inquérito policial, o juiz decretou, de ofício, a prisão preventiva de Débora, sem que esta possuísse qualquer antecedente criminal, apontando como fundamento para a prisão a gravidade em abstrato do crime de homicídio doloso. Como não houve a decretação anterior de medida cautelar diversa da prisão, o magistrado considerou, diante da situação, assinale a opção que apresenta, corretamente, a alegação que você, como advogado(a) de Débora, deverá apresentar.",
        options: [
          { id: "A", text: "O magistrado não pode decretar prisão preventiva de ofício, bem como a gravidade em abstrato do crime não é fundamento para o decreto prisional." },
          { id: "B", text: "O Tribunal concedeu o writ em habeas corpus impetrado com o argumento de excesso de prazo na formação da culpa." },
          { id: "C", text: "O Tribunal agiu de modo correto, pois a incompetência do juízo é o único fundamento de habeas corpus." },
          { id: "D", text: "O Tribunal equivocou-se, pois não é vinculado aos argumentos aportados pelo impetrante do habeas corpus, sendo inadmissível a concessão da ordem de ofício." }
        ],
        correctOption: "A",
        explanation: "De acordo com o Código de Processo Penal, art. 311 (com redação dada pela Lei 13.964/2019), o juiz não pode decretar prisão preventiva de ofício, apenas a requerimento do Ministério Público, do querelante ou do assistente, ou por representação da autoridade policial. Além disso, conforme jurisprudência consolidada do STF e STJ, a gravidade abstrata do crime não é fundamento idôneo para a decretação da prisão preventiva.",
        area: "Direito Processual Penal"
      },
      {
        id: 65,
        text: "Amanda impetrou habeas corpus em favor de Nélma, que foi presa preventivamente por decisão do Juiz de Primeira Grau, sendo acusada da prática de crime hediondo. O habeas corpus foi impetrado com o argumento de excesso de prazo de prisão preventiva. O Tribunal concedeu de ofício, uma vez que o magistrado que decretou a prisão era flagrantemente incompetente para fazê-lo. O Tribunal agiu de modo correto, pois.",
        options: [
          { id: "A", text: "O Tribunal equivocou-se, uma vez que a incompetência do julgador não é fundamento de habeas corpus." },
          { id: "B", text: "O Tribunal agiu de modo correto, pois a incompetência do juízo é fundamento do habeas corpus." },
          { id: "C", text: "O Tribunal agiu de modo correto, uma vez que é possível a concessão da ordem de habeas corpus de ofício sempre que houver constrangimento ilegal à liberdade de ir e vir e um motivo legítimo para tanto." },
          { id: "D", text: "O Tribunal equivocou-se, pois fica vinculado aos argumentos aportados pelo impetrante do habeas corpus, sendo inadmissível a concessão da ordem de ofício." }
        ],
        correctOption: "C",
        explanation: "De acordo com o Código de Processo Penal, art. 654, §2º: 'Os juízes e os tribunais têm competência para expedir de ofício ordem de habeas corpus, quando no curso de processo verificarem que alguém sofre ou está na iminência de sofrer coação ilegal'. O tribunal pode conceder habeas corpus de ofício quando verificar qualquer ilegalidade na prisão, mesmo que por fundamento diverso do alegado na impetração.",
        area: "Direito Processual Penal"
      },
      {
        id: 66,
        text: "Daniel foi denunciado pela prática do crime de instigação ao suicídio. Após a fase de instrução, o Juiz pronunciou o réu, afirmando ser Daniel totalmente culpado da prática do crime e que qualquer jurado teria a obrigação moral de reconhecer sua autoria. Nessa hipótese, de acordo com nosso ordenamento jurídico, você, como advogado(a) de Daniel, afirma que a decisão de pronúncia é ilegal, uma vez que:",
        options: [
          { id: "A", text: "houve excesso de linguagem, uma vez que há livre convencimento motivado do julgador." },
          { id: "B", text: "o juiz que observa o livre convencimento motivado do julgador uma vez que a restrição legal de excesso de linguagem aplica-se apenas para o crime de homicídio." },
          { id: "C", text: "a decisão é legal, porque a restrição legal de excesso de linguagem aplica-se apenas para os crimes de competência do Tribunal do Júri." },
          { id: "D", text: "a decisão é nula, porque o crime de instigação ao suicídio, por sua natureza, não deveria ser julgado pelo Tribunal do Júri." }
        ],
        correctOption: "A",
        explanation: "De acordo com o Código de Processo Penal, art. 413, §1º: 'A fundamentação da pronúncia limitar-se-á à indicação da materialidade do fato e da existência de indícios suficientes de autoria ou de participação, devendo o juiz declarar o dispositivo legal em que julgar incurso o acusado e especificar as circunstâncias qualificadoras e as causas de aumento de pena'. Há excesso de linguagem quando o juiz emite juízo de certeza sobre a culpabilidade do réu.",
        area: "Direito Processual Penal"
      },
      {
        id: 67,
        text: "Policiais ingressaram no imóvel pertencente a Paulo, às 6 horas da manhã, em regular perseguição iniciada logo após a prática de um homicídio, a fim de prender Júnior (filho de Paulo) em flagrante delito. Ao adentrarem no local, os policiais, além de efetuarem em busca, pelas regras do flagrante, localizaram também o telefone celular do acusado contendo sentença definitiva prolatada. Assim, foi instaurado inquérito policial contra Júnior, para apurar o delito de associação criminosa. Nesse caso, assinale a opção que indica corretamente, a alegação que você, como advogado(a) do Júnior, deve apresentar.",
        options: [
          { id: "A", text: "A prisão em flagrante foi válida, porém a apreensão do aparelho telefônico só poderia ser apresentado por ordem judicial prévia e expressa." },
          { id: "B", text: "O ingresso em domicílio para prisão em flagrante não pode ocorrer no período noturno, havendo nulidade absoluta, portanto do mandado, de busca, havendo nulidade de todos os atos subsequentes ao ingresso dos policiais no domicílio de Paulo, invalidando-se a prisem em flagrante." },
          { id: "C", text: "O ingresso em domicílio para prisão em flagrante foi válida, entretanto a apreensão de terceiros depende de expedição de mandado de busca, havendo nulidade dos atos subsequentes." },
          { id: "D", text: "A prisão em flagrante foi válida, entretanto a autoridade policial não poderia determinar a quebra de sigilo de dados do telefone celular flagranteado, o qual somente poderia ser apresentado por ordem judicial prévia a expressa." }
        ],
        correctOption: "D",
        explanation: "De acordo com a Constituição Federal, art. 5º, XII, é inviolável o sigilo de dados e comunicações. A jurisprudência do STF e STJ firma entendimento de que o acesso aos dados do celular sem autorização judicial prévia, mesmo em situação de flagrante, constitui prova ilícita. A apreensão do aparelho é lícita, mas o acesso ao seu conteúdo depende de ordem judicial.",
        area: "Direito Processual Penal"
      },
      {
        id: 68,
        text: "Anderson, motorista da sociedade empresária X, dirigindo o veículo da sociedade empresária fora do horário comercial e acima da velocidade permitida, atropelou Lucas. Lucas foi internado, pelo período de dois meses. Anderson foi condenado com trânsito em julgado, no âmbito criminal. Lucas propõe ação civil ex delicto de execução contra a sociedade empresária X. Afirmou, corretamente, que ela é parte:",
        options: [
          { id: "A", text: "A parte ilegítima uma vez que é responsável." },
          { id: "B", text: "legítima para figurar como ré, ainda que Anderson fosse absolutamente" },
          { id: "C", text: "ilegítima para ação civil ex delicto, mas legítima para a ação civil de indenização." },
          { id: "D", text: "ilegítima para ação civil ex delicto, seja de conhecimento ou de execução, que somente pode ser ajuizada em face de Anderson." }
        ],
        correctOption: "A",
        explanation: "De acordo com o Código de Processo Penal, art. 63, a ação de execução civil ex delicto deve ser proposta contra o autor do crime. A responsabilidade civil da sociedade empresária X não decorre da condenação criminal de Anderson, mas da responsabilidade objetiva do empregador por ato do empregado (art. 932, III, CC), que deve ser apurada em ação civil própria, não na execução da sentença penal.",
        area: "Direito Processual Penal"
      },
      {
        id: 69,
        text: "Eduardo Jorge, viúvo, de 71 anos de idade, é segurado da Previdência Social e tem três filhas, Francisca, de 47 anos, casada e não dependente economicamente de seu pai, Helena que é estudante e tem 19 anos e Joana, de 12 anos. Jorge é a principal fonte de renda da família e o único sustento da sua casa. Por isso, precisou acompanhar sua filha Helena ao campus da universidade que ela frequenta e viu e faleceu. Em busca de pensão por morte no INSS. Sobre as hipóteses apresentadas, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Apenas Helena terá jus à pensão por morte, sendo necessária a comprovação de dependência econômica." },
          { id: "B", text: "Apenas Helena e Joana terão jus à pensão por morte, sendo necessária a comprovação de dependência econômica." },
          { id: "C", text: "Helena e Francisca terão jus à pensão por morte, sendo necessária a comprovação de dependência econômica." },
          { id: "D", text: "Somente Francisca faz jus à pensão por morte, sendo necessária a comprovação de dependência econômica." }
        ],
        correctOption: "B",
        explanation: "De acordo com a Lei 8.213/91, art. 16, I, são beneficiários do Regime Geral de Previdência Social, na condição de dependentes do segurado, o cônjuge, companheira, companheiro e o filho não emancipado, de qualquer condição, menor de 21 anos ou inválido ou que tenha deficiência intelectual ou mental ou deficiência grave. Helena (19 anos) e Joana (12 anos) têm direito à pensão por morte, sem necessidade de comprovar dependência econômica.",
        area: "Direito Previdenciário"
      },
      {
        id: 70,
        text: "Antônio recebe aposentadoria por incapacidade permanente e, por necessitar da assistência permanente de outra pessoa, terá direito ao acréscimo de 25%. Em relação a esse acréscimo, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Será incorporado ao valor da pensão, com a morte do aposentado." },
          { id: "B", text: "Deverá ser recalculado, quando o valor da aposentadoria atingir o limite máximo legal." },
          { id: "C", text: "Não será devido, quando o valor da aposentadoria atingir o limite máximo legal." },
          { id: "D", text: "É devido ao segurado que recebe auxílio por incapacidade temporária e necessita da assistência permanente de outra pessoa." }
        ],
        correctOption: "C",
        explanation: "De acordo com a Lei 8.213/91, art. 45: 'O valor da aposentadoria por incapacidade permanente do segurado que necessitar da assistência permanente de outra pessoa será acrescido de 25%'. E seu parágrafo único determina: 'O acréscimo de que trata este artigo: a) será devido ainda que o valor da aposentadoria atinja o limite máximo legal'.",
        area: "Direito Previdenciário"
      },
      {
        id: 71,
        text: "Geraldo trabalha desde 2022 para uma sociedade empresária, atua na região metropolitana do Estado e recebe um salário fixo de R$ 4.000,00, sem qualquer desconto, exceto o imposto sobre a renda e o INSS. Além disso, desfruta de um pacote de benefícios que inclui auxílio-alimentação em forma de ticket, habitação num luxuoso apartamento, plano de saúde e auxílio-educação (mensalidade, uniformes e livros e material didático). Geraldo consultou você, como advogado(a), para saber quais benefícios deverão ser considerados na sua remuneração, de acordo com os dados do enunciado, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Apenas a educação integrará a remuneração." },
          { id: "B", text: "Apenas o plano de saúde não integrará a remuneração." },
          { id: "C", text: "Apenas habitação, fornecida pelo trabalho, integrará a remuneração." },
          { id: "D", text: "Alimentação, habitação, plano de saúde e auxílio-educação integrarão a remuneração." }
        ],
        correctOption: "C",
        explanation: "De acordo com a CLT, art. 458, §2º, não integram a remuneração: vestuário, educação, transporte, assistência médica, seguros de vida e acidentes, previdência privada e vale-alimentação. Já a habitação fornecida como contraprestação salarial integra a remuneração do empregado para todos os efeitos legais, conforme o caput do art. 458 da CLT.",
        area: "Direito do Trabalho"
      },
      {
        id: 72,
        text: "Os irmãos Décio e Beatriz são empresários. Décio explora a atividade pesqueira, enquanto Beatriz tem duas lojas de calçados. Em 2022, a sociedade empresária de Décio teve uma reclamação trabalhista ajuizada por um operador de produção e Beatriz, alegando existir grupo econômico entre Décio e Beatriz. Considerando esses fatos e o que dispõe a CLT, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "O autor está correto, pois existe vínculo familiar entre Décio e Beatriz." },
          { id: "B", text: "Para se caracterizar grupo econômico somente é necessário haver identidade de sócios." },
          { id: "C", text: "Não há grupo econômico porque não há direção, controle ou administração de uma empresa sobre outra." },
          { id: "D", text: "O grupo econômico pode ser reconhecido pelo parentesco, mas apenas na linha executada no reclamado." }
        ],
        correctOption: "C",
        explanation: "De acordo com a CLT, art. 2º, §2º: 'Sempre que uma ou mais empresas, tendo, embora, cada uma delas, personalidade jurídica própria, estiverem sob a direção, controle ou administração de outra, ou ainda quando, mesmo guardando cada uma sua autonomia, integrem grupo econômico, serão responsáveis solidariamente pelas obrigações decorrentes da relação de emprego'. O mero parentesco sem direção, controle ou administração comum não configura grupo econômico.",
        area: "Direito do Trabalho"
      },
      {
        id: 73,
        text: "Em 2023, Denilson ajuizou reclamação trabalhista contra um supermercado alegando que trabalhou de 2004 a 2006 sem ter a CTPS assinada. Na reclamação, ele requereu a anotação do vínculo de emprego na carteira profissional, pois precisaria interromper para conseguir sua aposentadoria no INSS. Em defesa, a sociedade empresária alegou prescrição, pois a ação foi ajuizada após o biênio constitucional. Considerando esses fatos e o que dispõe a CLT, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "A sociedade empresária está equivocada, pois o prazo de 30 anos é tal qual sucede com o CPF." },
          { id: "B", text: "A prescrição se consolida após 5 anos da ruptura, tal qual sucede com o CPF." },
          { id: "C", text: "A sociedade empresária está correta, havendo prescrição porque a ação foi ajuizada mais de 2 anos após a ruptura." },
          { id: "D", text: "A sociedade empresária está incorreta, pois as ações que têm por objeto anotações para fins de prova junto à Previdência Social são imprescritíveis." }
        ],
        correctOption: "D",
        explanation: "De acordo com a jurisprudência consolidada pelo TST na Súmula 268: 'Não corre a prescrição bienal do direito de ação quanto aos créditos trabalhistas, quando há ação anterior proposta, arquivada ou julgada improcedente'. Além disso, ações declaratórias como o reconhecimento de vínculo empregatício para fins previdenciários são consideradas imprescritíveis.",
        area: "Direito do Trabalho"
      },
      {
        id: 74,
        text: "Leopoldo foi contratado, em 2020, por uma sociedade empresária de terceirização, como auxiliar de limpeza externo, para trabalhar 44 horas semanais, com salário estabelecido na norma coletiva da sua categoria. Após um ano de trabalho sem faltas injustificadas, e chegado o momento de Leopoldo tirar férias, consultou você, como advogado(a), sobre os direitos a férias, considerando que dispõe a CLT, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Por ser empregado em regime de tempo parcial, ele não terá direito a férias remuneradas." },
          { id: "B", text: "Tal qual os demais empregados, ele terá direito a 30 dias de férias com adicional de 1/3." },
          { id: "C", text: "Ele somente terá direito a férias se isso estiver expressamente previsto na convenção coletiva de sua categoria." },
          { id: "D", text: "Por cumprir apenas a metade da jornada dos demais empregados, ele terá direito a 15 dias de férias com adicional de 1/3." }
        ],
        correctOption: "B",
        explanation: "De acordo com a CLT, art. 129: 'Todo empregado terá direito anualmente ao gozo de um período de férias, sem prejuízo da remuneração'. O art. 130 estabelece que, após cada período de 12 meses de vigência do contrato de trabalho, o empregado terá direito a férias na proporção de 30 dias corridos, quando não houver faltado ao serviço mais de 5 vezes. As férias são acrescidas de 1/3, conforme art. 7º, XVII da CF.",
        area: "Direito do Trabalho"
      },
      {
        id: 75,
        text: "Em sede de acordo coletivo, firmado em janeiro de 2024 e com vigência de dois anos, entre uma sociedade empresária e o sindicato da categoria profissional, constou cláusula determinando que o deslocamento dos empregados do portão até o interior da sociedade empresária, onde se situa o relógio de ponto, seria considerado tempo à disposição do empregador. Essa norma coletiva também dispõe que esse deslocamento é feito em transporte fornecido pela sociedade empresária e não são utilizados durante o trajeto quaisquer equipamentos de trabalho. A sociedade empresária indagou a você, como advogado(a), se todos esses períodos, seja o deslocamento, seja o tempo entendido nos espaços mencionados, deveria integrar a jornada de trabalho. Acerca do tema, com base na CLT, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Todos os períodos não se computam na jornada de trabalho dos empregados." },
          { id: "B", text: "Apenas o tempo de utilização obrigatória dos equipamentos de trabalho na jornada, pela norma coletiva." },
          { id: "C", text: "O período de deslocamento assim como o período de utilização da biblioteca, quando para estudo, devem ser computados na jornada." },
          { id: "D", text: "Os demais períodos não são computados na jornada." }
        ],
        correctOption: "A",
        explanation: "De acordo com a CLT, art. 58, §2º (com redação dada pela Lei 13.467/2017): 'O tempo despendido pelo empregado desde a sua residência até a efetiva ocupação do posto de trabalho e para o seu retorno, caminhando ou por qualquer meio de transporte, inclusive o fornecido pelo empregador, não será computado na jornada de trabalho, por não ser tempo à disposição do empregador'. Norma coletiva não pode contrariar dispositivo expresso em lei.",
        area: "Direito do Trabalho"
      },
      {
        id: 76,
        text: "Em sede de reclamação trabalhista você advoga para a parte autora. Dos três pedidos formulados, você saampou vitoriosa em dois, horas extras e equiparação salarial, sucumbindo apenas no pedido de integração da habitação. Atendendo a um desejo de seu cliente, optou-se por não recorrer, tendo o prazo recursal transcorrido integralmente. A ré, por sua vez e no seu prazo, apresentou recurso pertinente e, agora, o processo encontra-se com prazo para você contestar o recurso da ré. Ocorre que seu cliente mudou de opinião, já que o processo irá se alongar por conta do recurso adesivo. Diante desse fato, indagou da possibilidade de reconsiderar a questão relativa à integração da habitação. Com base no enunciado e no entendimento consolidado do TST, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Caberá recurso adesivo." },
          { id: "B", text: "Caberá recurso ordinário." },
          { id: "C", text: "Caberá agravo de instrumento." },
          { id: "D", text: "Não há medida a ser adotada, transitou em julgado a decisão do pedido de integração da habitação." }
        ],
        correctOption: "A",
        explanation: "De acordo com o CPC, art. 997, §1º (aplicável ao processo trabalhista por força do art. 769 da CLT): 'Ao recurso adesivo se aplicam as mesmas regras do recurso independente quanto às condições de admissibilidade e julgamento no tribunal'. O recurso adesivo é cabível quando a parte inicialmente não recorre, mas a parte contrária interpõe recurso, permitindo que se recorra adesivamente das matérias em que sucumbiu.",
        area: "Direito Processual do Trabalho"
      },
      {
        id: 77,
        text: "Em uma reclamação trabalhista requerendo a responsabilidade civil do empregador em razão de uma alegada doença profissional, o Juiz deferiu a realização de perícia, sendo que ambas as partes quesitaram e indicaram assistentes técnicos. No laudo, foi detectado que realmente houve a doença ocupacional. Com base nele, o Juiz julgou procedente o pedido. Sobre os honorários do perito e dos assistentes, considerando o entendimento consolidado do TST, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "A empresa deverá arcar com os honorários do perito e do assistente técnico do Autor." },
          { id: "B", text: "A justiça arcará com os honorários do perito, e cada parte será responsável pelos honorários do seu assistente técnico." },
          { id: "C", text: "Cada parte arcará com metade do valor dos honorários do perito e integralmente com os honorários do seu assistente técnico." },
          { id: "D", text: "O réu será condenado a pagar os honorários do perito, porque sucumbiu no objeto da prova, e arcará com os honorários do assistente técnico por ele indicado." }
        ],
        correctOption: "D",
        explanation: "De acordo com a CLT, art. 790-B (com redação dada pela Lei 13.467/2017): 'A responsabilidade pelo pagamento dos honorários periciais é da parte sucumbente na pretensão objeto da perícia, ainda que beneficiária da justiça gratuita'. Quanto aos assistentes técnicos, cada parte arca com os honorários do assistente por ela indicado, pois são profissionais de confiança das partes.",
        area: "Direito Processual do Trabalho"
      },
      {
        id: 78,
        text: "Foi protocolizada petição de homologação de acordo extrajudicial à 200ª Vara do Trabalho de Florianópolis. As partes envolvidas são Luísa, empregada doméstica, e José Pedro, seu ex-empregador. O valor apresentado para o acordo é de R$ 27.000,00 (vinte e sete mil reais), pagos em duas parcelas iguais e sucessivas, sendo mantidas as anotações na CTPS de Luísa. Empregada e empregador estão representados pelo mesmo advogado. Sobre esses fatos, segundo os termos da CLT, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Não é possível a homologação, porque as partes não podem ser representadas pelo mesmo advogado." },
          { id: "B", text: "Na homologação de acordo extrajudicial, os empregados precisam ser assistidos pelo advogado do seu sindicato de classe." },
          { id: "C", text: "Contanto que ambas as partes ratifiquem perante o juiz o desejo de realizar a transação, o acordo deve ser homologado pelo Magistrado." },
          { id: "D", text: "Tratando-se de um procedimento especial de jurisdição voluntária, o Juiz não pode negar a homologação de acordo alegando vício formal." }
        ],
        correctOption: "A",
        explanation: "De acordo com a CLT, art. 855-B, §1º: 'As partes não poderão ser representadas por advogado comum'. Esta disposição visa garantir que cada parte tenha representação jurídica independente, para evitar conflito de interesses na homologação de acordos extrajudiciais.",
        area: "Direito Processual do Trabalho"
      },
      {
        id: 79,
        text: "Em 2024, o Juiz proferiu sentença ilíquida em reclamação trabalhista, na qual você advoga para o autor, que foi julgada procedente. O feito havia sido ajuizado no final do ano de 2022. O Juiz elaborou e tornou líquida a conta, tendo aberto um prazo para as partes se manifestarem. A parte ré silenciou-se e você apresentou sua impugnação, que não foi acolhida pelo Juiz. Ato contínuo, houve decisão homologatória da sentença de liquidação. As partes foram intimadas. A ré garantiu o juízo e apresentou embargos à execução. Você apresentou impugnação de credor e contraminuta aos embargos à execução apresentados pela ré. Diante desta circunstância, assinale a afirmativa correta.",
        options: [
          { id: "A", text: "Você deverá sustentar em contraminuta aos embargos à execução que a ré apenas poderia questionar a sentença de liquidação por meio dos embargos à penhora." },
          { id: "B", text: "Tendo em vista que sua impugnação à conta do juízo foi rejeitada, a matéria atinente à sua impugnação de credor deve ser diversa, não podendo ser renovada a discussão da impugnação à conta de liquidação." },
          { id: "C", text: "Na sua contraminuta, assim como na impugnação de credor, caberá apenas discutir a matéria relativa às razões pelas quais os valores apurados estariam incorretos, não havendo o que se arguir acerca da não impugnação da ré à conta de liquidação, por ser facultativa." },
          { id: "D", text: "Está preclusa a arguição de matérias que impugnam os cálculos homologados em sede de embargos à execução da ré, uma vez que a parte não apresentou impugnação aos cálculos no momento oportuno, cabendo ao advogado do autor formular essa alegação na contraminuta aos embargos da ré." }
        ],
        correctOption: "D",
        explanation: "De acordo com a CLT, art. 879, §2º: 'Elaborada a conta e tornada líquida, o juiz poderá abrir às partes prazo sucessivo de 10 (dez) dias para impugnação fundamentada com a indicação dos itens e valores objeto da discordância, sob pena de preclusão'. Como a ré não impugnou os cálculos no prazo legal, ocorreu a preclusão, não podendo mais questionar esses valores em sede de embargos à execução.",
        area: "Direito Processual do Trabalho"
      },
      {
        id: 80,
        text: "As irmãs Alessandra, Antônia, Alba e Aline foram dispensadas de seus empregos em 2024, e cada qual contratou uma advogada de sua confiança para ajuizar reclamação trabalhista visando postular horas extras. Alessandra tem 58 anos de idade; Antônia, 65 anos de idade; Alba,",
        options: [
          { id: "A", text: "nan" },
          { id: "B", text: "nan" },
          { id: "C", text: "nan" },
          { id: "D", text: "nan" }
        ],
        correctOption: "C",
        explanation: "De acordo com a CLT, art. 852-A e seguintes, o rito sumaríssimo é aplicável às causas cujo valor não exceda a 40 salários mínimos, independentemente da idade das partes envolvidas. Na hipótese, o valor da causa é o critério para definir o procedimento aplicável, não a idade das reclamantes.",
        area: "Direito Processual do Trabalho"
      }
    ]
  }
};

