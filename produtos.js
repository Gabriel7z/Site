const WHATSAPP = "5561999291377";

// Preços de teste (R$ 0,10) para validar o Checkout Pro na conta Mercado Pago.

const PRODUCTS = [
  {
    "id": "neurocodigos",
    "name": "NeuroCódigos",
    "category": "mente",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-neurocodigos.jpg",
    "audio": "assets/audio/neurocodigos.mp3",
    "tagline": "Conexão entre neurônios para cognição e foco",
    "description": "Desenvolvido para potencializar as conexões neurais, estimular processos cognitivos e promover maior clareza mental. Sua frequência ajuda a organizar pensamentos, concentração e o foco no dia a dia.",
    "indications": [
      "Estimula a conexão neural e a plasticidade cerebral",
      "Favorece memória e cognição",
      "Melhora a atenção e o foco em tarefas importantes",
      "Apoia estados de clareza mental e produtividade"
    ]
  },
  {
    "id": "bioverbum",
    "name": "BioVerbum",
    "category": "comunicacao",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-bioverbum.jpg",
    "audio": "assets/audio/bioverbum.mp3",
    "tagline": "Frequência do Falar | Clareza de comunicação",
    "description": "Estimula a expressão verbal e desbloqueia a comunicação, trazendo clareza e fluidez ao falar. Atua na verbalização, ajudando a transformar pensamentos em palavras com naturalidade e confiança.",
    "indications": [
      "Estimula a clareza de comunicação",
      "Facilita a expressão verbal em diferentes contextos",
      "Auxilia no desbloqueio de travas emocionais relacionadas ao falar",
      "Promove segurança e confiança ao se expressar"
    ]
  },
  {
    "id": "sono-de-luz",
    "name": "Sono de Luz",
    "category": "sensorial",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-sono-de-luz.jpg",
    "audio": "assets/audio/sono-de-luz.mp3",
    "tagline": "Equilíbrio do sono e descanso profundo restaurador",
    "description": "Promove o equilíbrio natural do sono, favorecendo um descanso profundo e restaurador. Sua frequência atua no relaxamento físico e mental, reduzindo agitação e favorecendo noites reparadoras.",
    "indications": [
      "Regula o ciclo natural do sono",
      "Favorece relaxamento profundo",
      "Melhora a qualidade do descanso ao acordar",
      "Apoia a restauração física e mental"
    ]
  },
  {
    "id": "socializacao",
    "name": "Socialização",
    "category": "comunicacao",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-socializacao.jpg",
    "audio": "assets/audio/socializacao.mp3",
    "tagline": "Integração social | Flexibilidade | Bem-estar integral",
    "description": "Fórmula exclusiva que atua nos quatro corpos — físico, mental, emocional e energético — para estimular flexibilidade e integração social, com mais leveza na convivência.",
    "indications": [
      "Mantém a saúde física, mental, emocional e energética",
      "Previne rigidez física, emocional, mental e espiritual",
      "Aumenta o limiar de frustração e a mobilidade interna",
      "Favorece a convivência social com leveza"
    ]
  },
  {
    "id": "sensipeace",
    "name": "SensiPeace",
    "category": "sensorial",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-sensipeace.jpg",
    "audio": "assets/audio/sensipeace.mp3",
    "tagline": "Suavização da sensibilidade ao som, luz e toque",
    "description": "Criado para auxiliar quem apresenta sensibilidade extrema a estímulos externos, como sons intensos, luzes fortes e toque físico. Promove calma, conforto e adaptação ao ambiente.",
    "indications": [
      "Suaviza a hipersensibilidade sensorial",
      "Equilibra a resposta a som, luz e toque",
      "Favorece estados de calma e acolhimento",
      "Apoia o bem-estar em sobrecarga sensorial"
    ]
  },
  {
    "id": "bioclean",
    "name": "BioClean Parasite",
    "category": "detox",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-bioclean.jpg",
    "audio": "assets/audio/bioclean.mp3",
    "tagline": "Limpeza frequencial contra parasitas energéticos e físicos",
    "description": "Promove informação biofísica celular para neutralização e expulsão de parasitas. Fórmula exclusiva com frequências de orégano, cravo e outros ativos de vermifugação física e energética.",
    "indications": [
      "Limpeza parasitária dos corpos físico, emocional, mental e etérico",
      "Atua na limpeza e no equilíbrio do terreno biológico"
    ]
  },
  {
    "id": "amor-frequencial",
    "name": "Amor Frequencial",
    "category": "emocao",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-amor-frequencial.jpg",
    "audio": "assets/audio/amor-frequencial.mp3",
    "tagline": "Presença materna | Vínculo afetivo | Amor-próprio",
    "description": "Fortalece vínculos afetivos e traz consciência de acolhimento, proteção e amor. Estimula a presença materna para relações mais saudáveis e segurança interior.",
    "indications": [
      "Reforça o sentimento de acolhimento e cuidado materno",
      "Estimula um vínculo afetivo saudável",
      "Ajuda a desenvolver amor-próprio e autoestima",
      "Promove equilíbrio emocional e segurança interna"
    ]
  },
  {
    "id": "bioluz",
    "name": "BioLuz",
    "category": "mente",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-bioluz.jpg",
    "audio": "assets/audio/bioluz.mp3",
    "tagline": "Coerência | Alinhamento interior | Iluminação vibracional",
    "description": "Gera harmonia entre pensamento, sentimento, ação e palavras. Atua como um campo de iluminação vibracional para fortalecer a aura e expandir a consciência.",
    "indications": [
      "Favorece coerência entre mente, coração e atitude",
      "Estimula clareza e autenticidade nas escolhas",
      "Ilumina o campo áurico e amplia a proteção energética",
      "Equilibra o ser interior e o mundo exterior"
    ]
  },
  {
    "id": "neurointestino",
    "name": "NeuroIntestino Balance",
    "category": "corpo",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-neurointestino.jpg",
    "audio": "assets/audio/neurointestino.mp3",
    "tagline": "Reprogramação do eixo intestino-cérebro",
    "description": "Promove a saúde completa do sistema gastrointestinal. Harmoniza, regenera e otimiza o trato digestivo, da digestão à absorção de nutrientes.",
    "indications": [
      "Melhora a função digestiva e reduz desconfortos",
      "Restaura a mucosa intestinal e o equilíbrio da microbiota",
      "Auxilia a absorção de vitaminas e minerais",
      "Regula o trânsito intestinal",
      "Reduz processos inflamatórios do trato digestivo"
    ]
  },
  {
    "id": "emoser",
    "name": "EmoSer",
    "category": "emocao",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-emoser.jpg",
    "audio": "assets/audio/emoser.mp3",
    "tagline": "Equilíbrio emocional | Medo, raiva e choro",
    "description": "Traz harmonia às emoções, favorecendo equilíbrio interior e estabilidade. Ajuda a regular respostas intensas como medo, raiva e choro emocional, com mais serenidade no cotidiano.",
    "indications": [
      "Promove equilíbrio emocional diante de desafios",
      "Auxilia na regulação de medo, raiva e crises emocionais",
      "Favorece estabilidade em situações de estresse",
      "Estimula paz e clareza interior"
    ]
  },
  {
    "id": "presenca",
    "name": "Presença",
    "category": "mente",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-presenca.jpg",
    "audio": "assets/audio/presenca.mp3",
    "tagline": "Aqui e agora | Neuroplasticidade | Potencial individual",
    "description": "Desenvolvido para apoiar mentes atípicas e a presença no aqui e agora. Otimiza a absorção de nutrientes e energia nos quatro corpos, favorecendo neuroplasticidade e potencial individual.",
    "indications": [
      "Mantém a saúde física, mental, emocional e energética",
      "Fortalece a imunidade",
      "Previne distrações e dispersões",
      "Estimula a presença plena no aqui e agora",
      "Apoia o desenvolvimento do potencial individual"
    ]
  },
  {
    "id": "pertencimento",
    "name": "Pertencimento",
    "category": "emocao",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-pertencimento.jpg",
    "audio": "assets/audio/pertencimento.mp3",
    "tagline": "Conexão | Integração | Vínculo com o Todo",
    "description": "Desperta um sentimento profundo de união, conexão e integração. Sua frequência vibra no princípio “somos um”, fortalecendo vínculos e empatia nos campos físico, emocional, mental e espiritual.",
    "indications": [
      "Estimula conexão e acolhimento",
      "Promove integração e vínculos saudáveis",
      "Reduz a sensação de isolamento e separação",
      "Expande a consciência de unidade e coletividade"
    ]
  },
  {
    "id": "biometal",
    "name": "BioMetal Free",
    "category": "detox",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-biometal.jpg",
    "audio": "assets/audio/biometal.mp3",
    "tagline": "Drenagem vibracional de metais pesados",
    "description": "Promove informação biofísica ao organismo, potencializando a eliminação homeostática de metais pesados. Contém frequências de destoxificação hepática fases 1 e 2 e fitoterápicos de limpeza hepática e biliar.",
    "indications": [
      "Auxilia na quelação de metais pesados",
      "Equilibra os processos naturais de limpeza do organismo",
      "Auxilia no tratamento de gordura visceral",
      "Apoia tratamentos de inflamação sistêmica"
    ]
  },
  {
    "id": "lymphoflow",
    "name": "LymphoFlow Quantum",
    "category": "detox",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-lymphoflow.jpg",
    "audio": "assets/audio/lymphoflow.mp3",
    "tagline": "Estímulo à drenagem energética e emocional",
    "description": "Potencializa a liberação homeostática de homotoxinas e a função de todo o sistema linfático, por correção biofísica celular. Fórmula com frequências de fitoterápicos chineses, brasileiros e homotoxicologia alemã.",
    "indications": [
      "Limpeza do terreno biológico",
      "Ativação da drenagem linfática orgânica",
      "Apoio em tratamentos estéticos de peso, celulite e inflamação"
    ]
  },
  {
    "id": "mente-serena",
    "name": "Mente Serena",
    "category": "sensorial",
    "volume": "60ml",
    "price": 0.1,
    "image": "assets/img/prod-mente-serena.jpg",
    "audio": "assets/audio/mente-serena.mp3",
    "tagline": "Redução de hiperatividade, bruxismo e estresse",
    "description": "Harmoniza mente e corpo, aliviando sintomas de estresse e tensões relacionadas ao bruxismo. Favorece calma, presença e paz interior no ritmo do dia a dia.",
    "indications": [
      "Reduz hiperatividade mental e física",
      "Auxilia no controle do bruxismo",
      "Equilibra estresse e ansiedade",
      "Estimula calma e paz interior"
    ]
  },
  {
    "id": "garrafadas-capsula",
    "name": "Garrafadas em Cápsula",
    "category": "frequencial",
    "volume": "cápsulas",
    "price": 0.1,
    "image": "assets/img/garrafadas-capsula.jpg",
    "audio": null,
    "kind": "garrafada",
    "tagline": "Linha de fitoalquímicos | Sabedoria das ervas em cápsulas",
    "description": "As Garrafadas em Cápsula reúnem a tradição das garrafadas medicinais em formato prático e moderno. Fazem parte da linha de fitoalquímicos da Família CEME, para quem busca o cuidado integrativo com a força das plantas.",
    "indications": [
      "Formato em cápsulas, prático no dia a dia",
      "Inspiradas na tradição das garrafadas",
      "Linha de fitoalquímicos da Família CEME",
      "Complemento ao cuidado com o Método CEME"
    ]
  },
  {
    "id": "mapa-holografico",
    "name": "Mapa Holográfico",
    "category": "frequencial",
    "volume": "avaliação",
    "price": 0.1,
    "image": "assets/img/mapa-holografico.jpg",
    "audio": null,
    "kind": "mapa",
    "tagline": "Leitura vibracional e bioenergética",
    "description": "O Mapa Holográfico é uma leitura vibracional e bioenergética para identificar bloqueios e orientar o cuidado nos quatro corpos — físico, emocional, mental e espiritual.",
    "indications": [
      "Leitura vibracional e bioenergética",
      "Ajuda a identificar bloqueios",
      "Orienta o cuidado no Método CEME",
      "Atuação nos quatro corpos"
    ]
  },
  {
    "id": "musicas-neuroconectivas",
    "name": "Músicas NeuroConectivas",
    "category": "frequencial",
    "volume": "digital",
    "price": 0.1,
    "image": "assets/img/musicas-neuroconectivas.jpg",
    "audio": null,
    "kind": "musica",
    "tagline": "Frequências sonoras para conexão neural",
    "description": "As Músicas NeuroConectivas trazem frequências sonoras para apoiar conexão, foco e estados de presença no dia a dia, em sintonia com o Método CEME.",
    "indications": [
      "Frequências sonoras de apoio",
      "Favoráveis à conexão e à presença",
      "Uso prático no cotidiano",
      "Complemento ao Método CEME"
    ]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PRODUCTS, WHATSAPP };
}
