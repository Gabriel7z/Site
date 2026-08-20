const WHATSAPP = "5561999291377";

const PRODUCTS = [
  {
    id: "neurocodigos",
    name: "NeuroCódigos",
    tagline: "Conexão entre neurônios para cognição e foco",
    category: "Mente",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-neurocodigos.jpg",
    audio: "assets/audio/neurocodigos.mp3",
    description:
      "Desenvolvido para potencializar as conexões neurais, estimular processos cognitivos e promover maior clareza mental. Sua frequência ajuda a organizar pensamentos, concentração e o foco no dia a dia.",
    indications: [
      "Estimula a conexão neural e a plasticidade cerebral",
      "Favorece memória e cognição",
      "Melhora a atenção e o foco em tarefas importantes",
      "Apoia estados de clareza mental e produtividade",
    ],
  },
  {
    id: "bioverbum",
    name: "BioVerbum",
    tagline: "Frequência do Falar | Clareza de comunicação",
    category: "Comunicação",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-bioverbum.jpg",
    audio: "assets/audio/bioverbum.mp3",
    description:
      "Estimula a expressão verbal e desbloqueia a comunicação, trazendo clareza e fluidez ao falar. Atua na verbalização, ajudando a transformar pensamentos em palavras com naturalidade e confiança.",
    indications: [
      "Estimula a clareza de comunicação",
      "Facilita a expressão verbal em diferentes contextos",
      "Auxilia no desbloqueio de travas emocionais relacionadas ao falar",
      "Promove segurança e confiança ao se expressar",
    ],
  },
  {
    id: "sono-de-luz",
    name: "Sono de Luz",
    tagline: "Equilíbrio do sono e descanso profundo restaurador",
    category: "Sensorial",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-sono-de-luz.jpg",
    audio: "assets/audio/sono-de-luz.mp3",
    description:
      "Promove o equilíbrio natural do sono, favorecendo um descanso profundo e restaurador. Sua frequência atua no relaxamento físico e mental, reduzindo agitação e favorecendo noites reparadoras.",
    indications: [
      "Regula o ciclo natural do sono",
      "Favorece relaxamento profundo",
      "Melhora a qualidade do descanso ao acordar",
      "Apoia a restauração física e mental",
    ],
  },
  {
    id: "socializacao",
    name: "Socialização",
    tagline: "Integração social | Flexibilidade | Bem-estar integral",
    category: "Comunicação",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-socializacao.jpg",
    audio: "assets/audio/socializacao.mp3",
    description:
      "Fórmula exclusiva que atua nos quatro corpos — físico, mental, emocional e energético — para estimular flexibilidade e integração social, com mais leveza na convivência.",
    indications: [
      "Mantém a saúde física, mental, emocional e energética",
      "Previne rigidez física, emocional, mental e espiritual",
      "Aumenta o limiar de frustração e a mobilidade interna",
      "Favorece a convivência social com leveza",
    ],
  },
  {
    id: "sensipeace",
    name: "SensiPeace",
    tagline: "Suavização da sensibilidade ao som, luz e toque",
    category: "Sensorial",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-sensipeace.jpg",
    audio: "assets/audio/sensipeace.mp3",
    description:
      "Criado para auxiliar quem apresenta sensibilidade extrema a estímulos externos, como sons intensos, luzes fortes e toque físico. Promove calma, conforto e adaptação ao ambiente.",
    indications: [
      "Suaviza a hipersensibilidade sensorial",
      "Equilibra a resposta a som, luz e toque",
      "Favorece estados de calma e acolhimento",
      "Apoia o bem-estar em sobrecarga sensorial",
    ],
  },
  {
    id: "bioclean",
    name: "BioClean Parasite",
    tagline: "Limpeza frequencial contra parasitas energéticos e físicos",
    category: "Detox",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-bioclean.jpg",
    audio: "assets/audio/bioclean.mp3",
    description:
      "Promove informação biofísica celular para neutralização e expulsão de parasitas. Fórmula exclusiva com frequências de orégano, cravo e outros ativos de vermifugação física e energética.",
    indications: [
      "Limpeza parasitária dos corpos físico, emocional, mental e etérico",
      "Atua na limpeza e no equilíbrio do terreno biológico",
    ],
  },
  {
    id: "amor-frequencial",
    name: "Amor Frequencial",
    tagline: "Presença materna | Vínculo afetivo | Amor-próprio",
    category: "Emoção",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-amor-frequencial.jpg",
    audio: "assets/audio/amor-frequencial.mp3",
    description:
      "Fortalece vínculos afetivos e traz consciência de acolhimento, proteção e amor. Estimula a presença materna para relações mais saudáveis e segurança interior.",
    indications: [
      "Reforça o sentimento de acolhimento e cuidado materno",
      "Estimula um vínculo afetivo saudável",
      "Ajuda a desenvolver amor-próprio e autoestima",
      "Promove equilíbrio emocional e segurança interna",
    ],
  },
  {
    id: "bioluz",
    name: "BioLuz",
    tagline: "Coerência | Alinhamento interior | Iluminação vibracional",
    category: "Mente",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-bioluz.jpg",
    audio: "assets/audio/bioluz.mp3",
    description:
      "Gera harmonia entre pensamento, sentimento, ação e palavras. Atua como um campo de iluminação vibracional para fortalecer a aura e expandir a consciência.",
    indications: [
      "Favorece coerência entre mente, coração e atitude",
      "Estimula clareza e autenticidade nas escolhas",
      "Ilumina o campo áurico e amplia a proteção energética",
      "Equilibra o ser interior e o mundo exterior",
    ],
  },
  {
    id: "neurointestino",
    name: "NeuroIntestino Balance",
    tagline: "Reprogramação do eixo intestino-cérebro",
    category: "Corpo",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-neurointestino.jpg",
    audio: "assets/audio/neurointestino.mp3",
    description:
      "Promove a saúde completa do sistema gastrointestinal. Harmoniza, regenera e otimiza o trato digestivo, da digestão à absorção de nutrientes.",
    indications: [
      "Melhora a função digestiva e reduz desconfortos",
      "Restaura a mucosa intestinal e o equilíbrio da microbiota",
      "Auxilia a absorção de vitaminas e minerais",
      "Regula o trânsito intestinal",
      "Reduz processos inflamatórios do trato digestivo",
    ],
  },
  {
    id: "emoser",
    name: "EmoSer",
    tagline: "Equilíbrio emocional | Medo, raiva e choro",
    category: "Emoção",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-emoser.jpg",
    audio: "assets/audio/emoser.mp3",
    description:
      "Traz harmonia às emoções, favorecendo equilíbrio interior e estabilidade. Ajuda a regular respostas intensas como medo, raiva e choro emocional, com mais serenidade no cotidiano.",
    indications: [
      "Promove equilíbrio emocional diante de desafios",
      "Auxilia na regulação de medo, raiva e crises emocionais",
      "Favorece estabilidade em situações de estresse",
      "Estimula paz e clareza interior",
    ],
  },
  {
    id: "presenca",
    name: "Presença",
    tagline: "Aqui e agora | Neuroplasticidade | Potencial individual",
    category: "Mente",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-presenca.jpg",
    audio: "assets/audio/presenca.mp3",
    description:
      "Desenvolvido para apoiar mentes atípicas e a presença no aqui e agora. Otimiza a absorção de nutrientes e energia nos quatro corpos, favorecendo neuroplasticidade e potencial individual.",
    indications: [
      "Mantém a saúde física, mental, emocional e energética",
      "Fortalece a imunidade",
      "Previne distrações e dispersões",
      "Estimula a presença plena no aqui e agora",
      "Apoia o desenvolvimento do potencial individual",
    ],
  },
  {
    id: "pertencimento",
    name: "Pertencimento",
    tagline: "Conexão | Integração | Vínculo com o Todo",
    category: "Emoção",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-pertencimento.jpg",
    audio: "assets/audio/pertencimento.mp3",
    description:
      "Desperta um sentimento profundo de união, conexão e integração. Sua frequência vibra no princípio “somos um”, fortalecendo vínculos e empatia nos campos físico, emocional, mental e espiritual.",
    indications: [
      "Estimula conexão e acolhimento",
      "Promove integração e vínculos saudáveis",
      "Reduz a sensação de isolamento e separação",
      "Expande a consciência de unidade e coletividade",
    ],
  },
  {
    id: "biometal",
    name: "BioMetal Free",
    tagline: "Drenagem vibracional de metais pesados",
    category: "Detox",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-biometal.jpg",
    audio: "assets/audio/biometal.mp3",
    description:
      "Promove informação biofísica ao organismo, potencializando a eliminação homeostática de metais pesados. Contém frequências de destoxificação hepática fases 1 e 2 e fitoterápicos de limpeza hepática e biliar.",
    indications: [
      "Auxilia na quelação de metais pesados",
      "Equilibra os processos naturais de limpeza do organismo",
      "Auxilia no tratamento de gordura visceral",
      "Apoia tratamentos de inflamação sistêmica",
    ],
  },
  {
    id: "lymphoflow",
    name: "LymphoFlow Quantum",
    tagline: "Estímulo à drenagem energética e emocional",
    category: "Detox",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-lymphoflow.jpg",
    audio: "assets/audio/lymphoflow.mp3",
    description:
      "Potencializa a liberação homeostática de homotoxinas e a função de todo o sistema linfático, por correção biofísica celular. Fórmula com frequências de fitoterápicos chineses, brasileiros e homotoxicologia alemã.",
    indications: [
      "Limpeza do terreno biológico",
      "Ativação da drenagem linfática orgânica",
      "Apoio em tratamentos estéticos de peso, celulite e inflamação",
    ],
  },
  {
    id: "mente-serena",
    name: "Mente Serena",
    tagline: "Redução de hiperatividade, bruxismo e estresse",
    category: "Sensorial",
    volume: "60ml",
    price: 120,
    image: "assets/img/prod-mente-serena.jpg",
    audio: "assets/audio/mente-serena.mp3",
    description:
      "Harmoniza mente e corpo, aliviando sintomas de estresse e tensões relacionadas ao bruxismo. Favorece calma, presença e paz interior no ritmo do dia a dia.",
    indications: [
      "Reduz hiperatividade mental e física",
      "Auxilia no controle do bruxismo",
      "Equilibra estresse e ansiedade",
      "Estimula calma e paz interior",
    ],
  },
];

const CATEGORIES = ["Todos", "Mente", "Comunicação", "Sensorial", "Emoção", "Detox", "Corpo"];

if (typeof module === "object" && module.exports) {
  module.exports = { WHATSAPP, PRODUCTS, CATEGORIES };
}
