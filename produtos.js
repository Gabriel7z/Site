const WHATSAPP = "5561999291377";

const PRODUCTS = [
{
  "id": "neurocodigos",
  "name": "NeuroCódigos",
  "category": "mente",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-neurocodigos.jpg",
  "audio": "assets/audio/neurocodigos.mp3",
  "i18n": {
    "pt": {
      "tagline": "Conexão entre neurônios para cognição e foco",
      "description": "Desenvolvido para potencializar as conexões neurais, estimular processos cognitivos e promover maior clareza mental. Sua frequência ajuda a organizar pensamentos, concentração e o foco no dia a dia.",
      "indications": [
        "Estimula a conexão neural e a plasticidade cerebral",
        "Favorece memória e cognição",
        "Melhora a atenção e o foco em tarefas importantes",
        "Apoia estados de clareza mental e produtividade"
      ]
    },
    "en": {
      "tagline": "Neuron connection for cognition and focus",
      "description": "Designed to strengthen neural connections, stimulate cognitive processes and promote greater mental clarity. Its frequency helps organize thoughts, concentration and daily focus.",
      "indications": [
        "Stimulates neural connection and brain plasticity",
        "Supports memory and cognition",
        "Improves attention and focus on important tasks",
        "Supports mental clarity and productivity"
      ]
    },
    "de": {
      "tagline": "Neuronale Verbindung für Kognition und Fokus",
      "description": "Entwickelt, um neuronale Verbindungen zu stärken, kognitive Prozesse anzuregen und mentale Klarheit zu fördern. Die Frequenz hilft, Gedanken, Konzentration und den Fokus im Alltag zu ordnen.",
      "indications": [
        "Fördert neuronale Verbindung und Gehirnplastizität",
        "Unterstützt Gedächtnis und Kognition",
        "Verbessert Aufmerksamkeit und Fokus bei wichtigen Aufgaben",
        "Unterstützt mentale Klarheit und Produktivität"
      ]
    },
    "es": {
      "tagline": "Conexión entre neuronas para cognición y enfoque",
      "description": "Desarrollado para potenciar las conexiones neurales, estimular procesos cognitivos y promover mayor claridad mental. Su frecuencia ayuda a organizar pensamientos, concentración y el enfoque en el día a día.",
      "indications": [
        "Estimula la conexión neural y la plasticidad cerebral",
        "Favorece la memoria y la cognición",
        "Mejora la atención y el enfoque en tareas importantes",
        "Apoya estados de claridad mental y productividad"
      ]
    }
  }
},
{
  "id": "bioverbum",
  "name": "BioVerbum",
  "category": "comunicacao",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-bioverbum.jpg",
  "audio": "assets/audio/bioverbum.mp3",
  "i18n": {
    "pt": {
      "tagline": "Frequência do Falar | Clareza de comunicação",
      "description": "Estimula a expressão verbal e desbloqueia a comunicação, trazendo clareza e fluidez ao falar. Atua na verbalização, ajudando a transformar pensamentos em palavras com naturalidade e confiança.",
      "indications": [
        "Estimula a clareza de comunicação",
        "Facilita a expressão verbal em diferentes contextos",
        "Auxilia no desbloqueio de travas emocionais relacionadas ao falar",
        "Promove segurança e confiança ao se expressar"
      ]
    },
    "en": {
      "tagline": "Frequency of speaking | Communication clarity",
      "description": "Stimulates verbal expression and unlocks communication, bringing clarity and fluency when speaking. It supports verbalization, helping turn thoughts into words with natural ease and confidence.",
      "indications": [
        "Supports clearer communication",
        "Facilitates verbal expression in different contexts",
        "Helps release emotional blocks related to speaking",
        "Promotes confidence when expressing yourself"
      ]
    },
    "de": {
      "tagline": "Frequenz des Sprechens | Klarheit in der Kommunikation",
      "description": "Anregt den verbalen Ausdruck und öffnet die Kommunikation – mit Klarheit und Fluss beim Sprechen. Unterstützt die Verbalisierung und hilft, Gedanken natürlich und selbstsicher in Worte zu verwandeln.",
      "indications": [
        "Fördert Klarheit in der Kommunikation",
        "Erleichtert den verbalen Ausdruck in verschiedenen Kontexten",
        "Hilft, emotionale Blockaden beim Sprechen zu lösen",
        "Stärkt Sicherheit und Vertrauen beim Ausdrücken"
      ]
    },
    "es": {
      "tagline": "Frecuencia del Hablar | Claridad de comunicación",
      "description": "Estimula la expresión verbal y desbloquea la comunicación, aportando claridad y fluidez al hablar. Actúa en la verbalización, ayudando a transformar pensamientos en palabras con naturalidad y confianza.",
      "indications": [
        "Estimula la claridad de comunicación",
        "Facilita la expresión verbal en diferentes contextos",
        "Ayuda a desbloquear bloqueos emocionales relacionados con el hablar",
        "Promueve seguridad y confianza al expresarse"
      ]
    }
  }
},
{
  "id": "sono-de-luz",
  "name": "Sono de Luz",
  "category": "sensorial",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-sono-de-luz.jpg",
  "audio": "assets/audio/sono-de-luz.mp3",
  "i18n": {
    "pt": {
      "tagline": "Equilíbrio do sono e descanso profundo restaurador",
      "description": "Promove o equilíbrio natural do sono, favorecendo um descanso profundo e restaurador. Sua frequência atua no relaxamento físico e mental, reduzindo agitação e favorecendo noites reparadoras.",
      "indications": [
        "Regula o ciclo natural do sono",
        "Favorece relaxamento profundo",
        "Melhora a qualidade do descanso ao acordar",
        "Apoia a restauração física e mental"
      ]
    },
    "en": {
      "tagline": "Sleep balance and deep restorative rest",
      "description": "Promotes natural sleep balance, favoring deep restorative rest. Its frequency supports physical and mental relaxation, reducing agitation and favoring restorative nights.",
      "indications": [
        "Supports the natural sleep cycle",
        "Favors deep relaxation",
        "Improves rest quality upon waking",
        "Supports physical and mental restoration"
      ]
    },
    "de": {
      "tagline": "Schlafbalance und tiefe regenerative Ruhe",
      "description": "Fördert das natürliche Schlafleichgewicht und begünstigt tiefe, regenerative Ruhe. Die Frequenz wirkt auf körperliche und mentale Entspannung, reduziert Unruhe und unterstützt erholsame Nächte.",
      "indications": [
        "Unterstützt den natürlichen Schlafzyklus",
        "Fördert tiefe Entspannung",
        "Verbessert die Erholungsqualität beim Aufwachen",
        "Unterstützt körperliche und mentale Regeneration"
      ]
    },
    "es": {
      "tagline": "Equilibrio del sueño y descanso profundo restaurador",
      "description": "Promueve el equilibrio natural del sueño, favoreciendo un descanso profundo y restaurador. Su frecuencia actúa en la relajación física y mental, reduciendo la agitación y favoreciendo noches reparadoras.",
      "indications": [
        "Regula el ciclo natural del sueño",
        "Favorece la relajación profunda",
        "Mejora la calidad del descanso al despertar",
        "Apoya la restauración física y mental"
      ]
    }
  }
},
{
  "id": "socializacao",
  "name": "Socialização",
  "category": "comunicacao",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-socializacao.jpg",
  "audio": "assets/audio/socializacao.mp3",
  "i18n": {
    "pt": {
      "tagline": "Integração social | Flexibilidade | Bem-estar integral",
      "description": "Fórmula exclusiva que atua nos quatro corpos — físico, mental, emocional e energético — para estimular flexibilidade e integração social, com mais leveza na convivência.",
      "indications": [
        "Mantém a saúde física, mental, emocional e energética",
        "Previne rigidez física, emocional, mental e espiritual",
        "Aumenta o limiar de frustração e a mobilidade interna",
        "Favorece a convivência social com leveza"
      ]
    },
    "en": {
      "tagline": "Social integration | Flexibility | Integral wellbeing",
      "description": "Exclusive formula that works on the four bodies — physical, mental, emotional and energetic — to stimulate flexibility and social integration, with more ease in relating to others.",
      "indications": [
        "Supports physical, mental, emotional and energetic health",
        "Helps prevent physical, emotional, mental and spiritual rigidity",
        "Raises frustration tolerance and inner mobility",
        "Favors lighter social coexistence"
      ]
    },
    "de": {
      "tagline": "Soziale Integration | Flexibilität | Ganzheitliches Wohlbefinden",
      "description": "Exklusive Formel, die auf die vier Körper wirkt — physisch, mental, emotional und energetisch — um Flexibilität und soziale Integration zu fördern, mit mehr Leichtigkeit im Miteinander.",
      "indications": [
        "Unterstützt physische, mentale, emotionale und energetische Gesundheit",
        "Hilft, physische, emotionale, mentale und spirituelle Starrheit zu vermeiden",
        "Erhöht die Frustrationstoleranz und innere Beweglichkeit",
        "Fördert leichtes soziales Miteinander"
      ]
    },
    "es": {
      "tagline": "Integración social | Flexibilidad | Bienestar integral",
      "description": "Fórmula exclusiva que actúa en los cuatro cuerpos — físico, mental, emocional y energético — para estimular la flexibilidad y la integración social, con más ligereza en la convivencia.",
      "indications": [
        "Mantiene la salud física, mental, emocional y energética",
        "Previene la rigidez física, emocional, mental y espiritual",
        "Aumenta el umbral de frustración y la movilidad interna",
        "Favorece la convivencia social con ligereza"
      ]
    }
  }
},
{
  "id": "sensipeace",
  "name": "SensiPeace",
  "category": "sensorial",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-sensipeace.jpg",
  "audio": "assets/audio/sensipeace.mp3",
  "i18n": {
    "pt": {
      "tagline": "Suavização da sensibilidade ao som, luz e toque",
      "description": "Criado para auxiliar quem apresenta sensibilidade extrema a estímulos externos, como sons intensos, luzes fortes e toque físico. Promove calma, conforto e adaptação ao ambiente.",
      "indications": [
        "Suaviza a hipersensibilidade sensorial",
        "Equilibra a resposta a som, luz e toque",
        "Favorece estados de calma e acolhimento",
        "Apoia o bem-estar em sobrecarga sensorial"
      ]
    },
    "en": {
      "tagline": "Softening sensitivity to sound, light and touch",
      "description": "Created to support those with extreme sensitivity to external stimuli such as intense sounds, strong lights and physical touch. It promotes calm, comfort and adaptation to the environment.",
      "indications": [
        "Softens sensory hypersensitivity",
        "Balances response to sound, light and touch",
        "Favors states of calm and comfort",
        "Supports wellbeing during sensory overload"
      ]
    },
    "de": {
      "tagline": "Sanfter Umgang mit Empfindlichkeit für Klang, Licht und Berührung",
      "description": "Entwickelt für Menschen mit starker Empfindlichkeit gegenüber äußeren Reizen wie intensiven Geräuschen, starkem Licht und körperlicher Berührung. Fördert Ruhe, Komfort und Anpassung an die Umgebung.",
      "indications": [
        "Mildert sensorische Überempfindlichkeit",
        "Balanceiert die Reaktion auf Klang, Licht und Berührung",
        "Fördert Zustände von Ruhe und Geborgenheit",
        "Unterstützt Wohlbefinden bei sensorischer Überlastung"
      ]
    },
    "es": {
      "tagline": "Suavización de la sensibilidad al sonido, la luz y el tacto",
      "description": "Creado para ayudar a quienes presentan sensibilidad extrema a estímulos externos, como sonidos intensos, luces fuertes y el tacto físico. Promueve calma, confort y adaptación al entorno.",
      "indications": [
        "Suaviza la hipersensibilidad sensorial",
        "Equilibra la respuesta al sonido, la luz y el tacto",
        "Favorece estados de calma y acogida",
        "Apoya el bienestar en sobrecarga sensorial"
      ]
    }
  }
},
{
  "id": "bioclean",
  "name": "BioClean Parasite",
  "category": "detox",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-bioclean.jpg",
  "audio": "assets/audio/bioclean.mp3",
  "i18n": {
    "pt": {
      "tagline": "Limpeza frequencial contra parasitas energéticos e físicos",
      "description": "Promove informação biofísica celular para neutralização e expulsão de parasitas. Fórmula exclusiva com frequências de orégano, cravo e outros ativos de vermifugação física e energética.",
      "indications": [
        "Limpeza parasitária dos corpos físico, emocional, mental e etérico",
        "Atua na limpeza e no equilíbrio do terreno biológico"
      ]
    },
    "en": {
      "tagline": "Frequency cleansing against energetic and physical parasites",
      "description": "Promotes cellular biophysical information for neutralization and expulsion of parasites. Exclusive formula with oregano, clove and other frequencies for physical and energetic cleansing support.",
      "indications": [
        "Parasite cleansing across physical, emotional, mental and etheric bodies",
        "Supports cleansing and balance of the biological terrain"
      ]
    },
    "de": {
      "tagline": "Frequenzielle Reinigung gegen energetische und physische Parasiten",
      "description": "Fördert biophysikalische Zellinformation zur Neutralisierung und Ausscheidung von Parasiten. Exklusive Formel mit Oregano-, Nelken- und weiteren Frequenzen zur physischen und energetischen Reinigungsunterstützung.",
      "indications": [
        "Parasitäre Reinigung der physischen, emotionalen, mentalen und ätherischen Körper",
        "Unterstützt Reinigung und Balance des biologischen Terrains"
      ]
    },
    "es": {
      "tagline": "Limpieza frecuencial contra parásitos energéticos y físicos",
      "description": "Promueve información biofísica celular para la neutralización y expulsión de parásitos. Fórmula exclusiva con frecuencias de orégano, clavo y otros activos de desparasitación física y energética.",
      "indications": [
        "Limpieza parasitaria de los cuerpos físico, emocional, mental y etérico",
        "Actúa en la limpieza y el equilibrio del terreno biológico"
      ]
    }
  }
},
{
  "id": "amor-frequencial",
  "name": "Amor Frequencial",
  "category": "emocao",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-amor-frequencial.jpg",
  "audio": "assets/audio/amor-frequencial.mp3",
  "i18n": {
    "pt": {
      "tagline": "Presença materna | Vínculo afetivo | Amor-próprio",
      "description": "Fortalece vínculos afetivos e traz consciência de acolhimento, proteção e amor. Estimula a presença materna para relações mais saudáveis e segurança interior.",
      "indications": [
        "Reforça o sentimento de acolhimento e cuidado materno",
        "Estimula um vínculo afetivo saudável",
        "Ajuda a desenvolver amor-próprio e autoestima",
        "Promove equilíbrio emocional e segurança interna"
      ]
    },
    "en": {
      "tagline": "Maternal presence | Affective bond | Self-love",
      "description": "Strengthens affective bonds and brings awareness of welcome, protection and love. It stimulates maternal presence for healthier relationships and inner safety.",
      "indications": [
        "Reinforces feelings of welcome and maternal care",
        "Stimulates a healthy affective bond",
        "Helps develop self-love and self-esteem",
        "Promotes emotional balance and inner safety"
      ]
    },
    "de": {
      "tagline": "Mütterliche Präsenz | Affektive Bindung | Selbstliebe",
      "description": "Stärkt affektive Bindungen und bringt Bewusstsein für Annahme, Schutz und Liebe. Fördert mütterliche Präsenz für gesündere Beziehungen und innere Sicherheit.",
      "indications": [
        "Verstärkt das Gefühl von Annahme und mütterlicher Fürsorge",
        "Fördert eine gesunde affektive Bindung",
        "Hilft, Selbstliebe und Selbstwert zu entwickeln",
        "Fördert emotionales Gleichgewicht und innere Sicherheit"
      ]
    },
    "es": {
      "tagline": "Presencia materna | Vínculo afectivo | Amor propio",
      "description": "Fortalece vínculos afectivos y aporta conciencia de acogida, protección y amor. Estimula la presencia materna para relaciones más saludables y seguridad interior.",
      "indications": [
        "Refuerza el sentimiento de acogida y cuidado materno",
        "Estimula un vínculo afectivo saludable",
        "Ayuda a desarrollar amor propio y autoestima",
        "Promueve equilibrio emocional y seguridad interna"
      ]
    }
  }
},
{
  "id": "bioluz",
  "name": "BioLuz",
  "category": "mente",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-bioluz.jpg",
  "audio": "assets/audio/bioluz.mp3",
  "i18n": {
    "pt": {
      "tagline": "Coerência | Alinhamento interior | Iluminação vibracional",
      "description": "Gera harmonia entre pensamento, sentimento, ação e palavras. Atua como um campo de iluminação vibracional para fortalecer a aura e expandir a consciência.",
      "indications": [
        "Favorece coerência entre mente, coração e atitude",
        "Estimula clareza e autenticidade nas escolhas",
        "Ilumina o campo áurico e amplia a proteção energética",
        "Equilibra o ser interior e o mundo exterior"
      ]
    },
    "en": {
      "tagline": "Coherence | Inner alignment | Vibrational illumination",
      "description": "Creates harmony between thought, feeling, action and words. It acts as a field of vibrational illumination to strengthen the aura and expand consciousness.",
      "indications": [
        "Favors coherence between mind, heart and attitude",
        "Stimulates clarity and authenticity in choices",
        "Illuminates the auric field and expands energetic protection",
        "Balances the inner being and the outer world"
      ]
    },
    "de": {
      "tagline": "Kohärenz | Innere Ausrichtung | Vibrationale Erleuchtung",
      "description": "Erzeugt Harmonie zwischen Denken, Fühlen, Handeln und Worten. Wirkt als Feld vibrationaler Erleuchtung, um die Aura zu stärken und das Bewusstsein zu erweitern.",
      "indications": [
        "Fördert Kohärenz zwischen Geist, Herz und Haltung",
        "Anregt Klarheit und Authentizität in Entscheidungen",
        "Erhellt das aurische Feld und erweitert energetischen Schutz",
        "Balanceiert das innere Sein und die äußere Welt"
      ]
    },
    "es": {
      "tagline": "Coherencia | Alineación interior | Iluminación vibracional",
      "description": "Genera armonía entre pensamiento, sentimiento, acción y palabras. Actúa como un campo de iluminación vibracional para fortalecer el aura y expandir la conciencia.",
      "indications": [
        "Favorece la coherencia entre mente, corazón y actitud",
        "Estimula claridad y autenticidad en las elecciones",
        "Ilumina el campo áurico y amplía la protección energética",
        "Equilibra el ser interior y el mundo exterior"
      ]
    }
  }
},
{
  "id": "neurointestino",
  "name": "NeuroIntestino Balance",
  "category": "corpo",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-neurointestino.jpg",
  "audio": "assets/audio/neurointestino.mp3",
  "i18n": {
    "pt": {
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
    "en": {
      "tagline": "Reprogramming the gut-brain axis",
      "description": "Promotes complete gastrointestinal health. It harmonizes, regenerates and optimizes the digestive tract, from digestion to nutrient absorption.",
      "indications": [
        "Improves digestive function and reduces discomfort",
        "Restores intestinal mucosa and microbiota balance",
        "Supports absorption of vitamins and minerals",
        "Regulates intestinal transit",
        "Helps reduce inflammatory processes in the digestive tract"
      ]
    },
    "de": {
      "tagline": "Neuprogrammierung der Darm-Hirn-Achse",
      "description": "Fördert die ganzheitliche Gesundheit des Magen-Darm-Systems. Harmonisiert, regeneriert und optimiert den Verdauungstrakt – von der Verdauung bis zur Nährstoffaufnahme.",
      "indications": [
        "Verbessert die Verdauungsfunktion und mindert Unwohlsein",
        "Stellt Darmschleimhaut und Mikrobiota-Balance wieder her",
        "Unterstützt die Aufnahme von Vitaminen und Mineralstoffen",
        "Reguliert den Darmtransit",
        "Hilft, entzündliche Prozesse im Verdauungstrakt zu reduzieren"
      ]
    },
    "es": {
      "tagline": "Reprogramación del eje intestino-cerebro",
      "description": "Promueve la salud completa del sistema gastrointestinal. Armoniza, regenera y optimiza el tracto digestivo, desde la digestión hasta la absorción de nutrientes.",
      "indications": [
        "Mejora la función digestiva y reduce molestias",
        "Restaura la mucosa intestinal y el equilibrio de la microbiota",
        "Auxilia la absorción de vitaminas y minerales",
        "Regula el tránsito intestinal",
        "Reduce procesos inflamatorios del tracto digestivo"
      ]
    }
  }
},
{
  "id": "emoser",
  "name": "EmoSer",
  "category": "emocao",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-emoser.jpg",
  "audio": "assets/audio/emoser.mp3",
  "i18n": {
    "pt": {
      "tagline": "Equilíbrio emocional | Medo, raiva e choro",
      "description": "Traz harmonia às emoções, favorecendo equilíbrio interior e estabilidade. Ajuda a regular respostas intensas como medo, raiva e choro emocional, com mais serenidade no cotidiano.",
      "indications": [
        "Promove equilíbrio emocional diante de desafios",
        "Auxilia na regulação de medo, raiva e crises emocionais",
        "Favorece estabilidade em situações de estresse",
        "Estimula paz e clareza interior"
      ]
    },
    "en": {
      "tagline": "Emotional balance | Fear, anger and crying",
      "description": "Brings harmony to emotions, favoring inner balance and stability. It helps regulate intense responses such as fear, anger and emotional crying, with more serenity in daily life.",
      "indications": [
        "Promotes emotional balance in the face of challenges",
        "Supports regulation of fear, anger and emotional crises",
        "Favors stability in stressful situations",
        "Stimulates inner peace and clarity"
      ]
    },
    "de": {
      "tagline": "Emotionales Gleichgewicht | Angst, Wut und Weinen",
      "description": "Bringt Harmonie in die Emotionen und fördert inneren Ausgleich sowie Stabilität. Hilft, intensive Reaktionen wie Angst, Wut und emotionales Weinen zu regulieren – mit mehr Gelassenheit im Alltag.",
      "indications": [
        "Fördert emotionales Gleichgewicht angesichts von Herausforderungen",
        "Unterstützt die Regulation von Angst, Wut und emotionalen Krisen",
        "Begünstigt Stabilität in Stresssituationen",
        "Anregt inneren Frieden und Klarheit"
      ]
    },
    "es": {
      "tagline": "Armonía emocional | Serenidad | Estabilidad interior",
      "description": "Aporta armonía a las emociones, favoreciendo el equilibrio interior y la estabilidad. Ayuda a regular respuestas intensas como miedo, ira y llanto emocional, con más serenidad en lo cotidiano.",
      "indications": [
        "Promueve equilibrio emocional ante los desafíos",
        "Ayuda en la regulación del miedo, la ira y las crisis emocionales",
        "Favorece la estabilidad en situaciones de estrés",
        "Estimula paz y claridad interior"
      ]
    }
  }
},
{
  "id": "presenca",
  "name": "Presença",
  "category": "mente",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-presenca.jpg",
  "audio": "assets/audio/presenca.mp3",
  "i18n": {
    "pt": {
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
    "en": {
      "tagline": "Here and now | Neuroplasticity | Individual potential",
      "description": "Developed to support atypical minds and presence in the here and now. It optimizes absorption of nutrients and energy across the four bodies, favoring neuroplasticity and individual potential.",
      "indications": [
        "Supports physical, mental, emotional and energetic health",
        "Strengthens immunity",
        "Helps prevent distraction and dispersion",
        "Stimulates full presence in the here and now",
        "Supports development of individual potential"
      ]
    },
    "de": {
      "tagline": "Hier und jetzt | Neuroplastizität | Individuelles Potenzial",
      "description": "Entwickelt zur Unterstützung atypischer Geister und der Präsenz im Hier und Jetzt. Optimiert die Aufnahme von Nährstoffen und Energie in den vier Körpern und fördert Neuroplastizität sowie individuelles Potenzial.",
      "indications": [
        "Unterstützt physische, mentale, emotionale und energetische Gesundheit",
        "Stärkt die Immunität",
        "Hilft, Ablenkung und Zerstreuung zu vermeiden",
        "Anregt volle Präsenz im Hier und Jetzt",
        "Unterstützt die Entfaltung individuellen Potenzials"
      ]
    },
    "es": {
      "tagline": "Presencia | Aquí y ahora | Neuroplasticidad",
      "description": "Desarrollado para apoyar mentes atípicas y la presencia en el aquí y ahora. Optimiza la absorción de nutrientes y energía en los cuatro cuerpos, favoreciendo la neuroplasticidad y el potencial individual.",
      "indications": [
        "Mantiene la salud física, mental, emocional y energética",
        "Fortalece la inmunidad",
        "Previene distracciones y dispersiones",
        "Estimula la presencia plena en el aquí y ahora",
        "Apoya el desarrollo del potencial individual"
      ]
    }
  }
},
{
  "id": "pertencimento",
  "name": "Pertencimento",
  "category": "emocao",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-pertencimento.jpg",
  "audio": "assets/audio/pertencimento.mp3",
  "i18n": {
    "pt": {
      "tagline": "Conexão | Integração | Vínculo com o Todo",
      "description": "Desperta um sentimento profundo de união, conexão e integração. Sua frequência vibra no princípio “somos um”, fortalecendo vínculos e empatia nos campos físico, emocional, mental e espiritual.",
      "indications": [
        "Estimula conexão e acolhimento",
        "Promove integração e vínculos saudáveis",
        "Reduz a sensação de isolamento e separação",
        "Expande a consciência de unidade e coletividade"
      ]
    },
    "en": {
      "tagline": "Connection | Integration | Bond with the Whole",
      "description": "Awakens a deep feeling of union, connection and integration. Its frequency vibrates with the principle “we are one”, strengthening bonds and empathy across physical, emotional, mental and spiritual fields.",
      "indications": [
        "Stimulates connection and welcome",
        "Promotes integration and healthy bonds",
        "Reduces feelings of isolation and separation",
        "Expands awareness of unity and collectivity"
      ]
    },
    "de": {
      "tagline": "Verbindung | Integration | Bindung an das Ganze",
      "description": "Weckt ein tiefes Gefühl von Einheit, Verbindung und Integration. Die Frequenz schwingt mit dem Prinzip „wir sind eins“ und stärkt Bindungen sowie Empathie in physischen, emotionalen, mentalen und spirituellen Feldern.",
      "indications": [
        "Fördert Verbindung und Annahme",
        "Unterstützt Integration und gesunde Bindungen",
        "Reduziert das Gefühl von Isolation und Trennung",
        "Erweitert das Bewusstsein für Einheit und Gemeinschaft"
      ]
    },
    "es": {
      "tagline": "Unión | Conexión | Sentido de pertenencia",
      "description": "Despierta un sentimiento profundo de unión, conexión e integración. Su frecuencia vibra en el principio “somos uno”, fortaleciendo vínculos y empatía en los campos físico, emocional, mental y espiritual.",
      "indications": [
        "Fortalece el sentido de pertenencia",
        "Estimula empatía y conexión con el otro",
        "Favorece la integración en grupos y vínculos",
        "Apoya la unión en los cuatro cuerpos"
      ]
    }
  }
},
{
  "id": "biometal",
  "name": "BioMetal Free",
  "category": "detox",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-biometal.jpg",
  "audio": "assets/audio/biometal.mp3",
  "i18n": {
    "pt": {
      "tagline": "Drenagem vibracional de metais pesados",
      "description": "Promove informação biofísica ao organismo, potencializando a eliminação homeostática de metais pesados. Contém frequências de destoxificação hepática fases 1 e 2 e fitoterápicos de limpeza hepática e biliar.",
      "indications": [
        "Auxilia na quelação de metais pesados",
        "Equilibra os processos naturais de limpeza do organismo",
        "Auxilia no tratamento de gordura visceral",
        "Apoia tratamentos de inflamação sistêmica"
      ]
    },
    "en": {
      "tagline": "Vibrational drainage of heavy metals",
      "description": "Promotes biophysical information to the organism, potentiating homeostatic elimination of heavy metals. It includes hepatic detoxification frequencies for phases 1 and 2 and phytotherapeutic support for liver and biliary cleansing.",
      "indications": [
        "Supports heavy metal chelation",
        "Balances the organism’s natural cleansing processes",
        "Supports visceral fat care protocols",
        "Supports systemic inflammation protocols"
      ]
    },
    "de": {
      "tagline": "Vibrationale Drainage von Schwermetallen",
      "description": "Fördert biophysikalische Information an den Organismus und potenziert die homöostatische Ausscheidung von Schwermetallen. Enthält Frequenzen der Leberdetoxifikation der Phasen 1 und 2 sowie phytotherapeutische Unterstützung für Leber- und Gallereinigung.",
      "indications": [
        "Unterstützt die Chelatbildung von Schwermetallen",
        "Balanceiert natürliche Reinigungsprozesse des Organismus",
        "Unterstützt Protokolle bei viszeralem Fett",
        "Unterstützt Protokolle bei systemischer Entzündung"
      ]
    },
    "es": {
      "tagline": "Desintoxicación de metales pesados | Limpieza hepática",
      "description": "Promueve información biofísica al organismo, potenciando la eliminación homeostática de metales pesados. Contiene frecuencias de desintoxicación hepática fases 1 y 2 y fitoterápicos de limpieza hepática y biliar.",
      "indications": [
        "Ayuda en la quelación de metales pesados",
        "Equilibra los procesos naturales de limpieza del organismo",
        "Ayuda en el tratamiento de grasa visceral",
        "Apoya tratamientos de inflamación sistémica"
      ]
    }
  }
},
{
  "id": "lymphoflow",
  "name": "LymphoFlow Quantum",
  "category": "detox",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-lymphoflow.jpg",
  "audio": "assets/audio/lymphoflow.mp3",
  "i18n": {
    "pt": {
      "tagline": "Estímulo à drenagem energética e emocional",
      "description": "Potencializa a liberação homeostática de homotoxinas e a função de todo o sistema linfático, por correção biofísica celular. Fórmula com frequências de fitoterápicos chineses, brasileiros e homotoxicologia alemã.",
      "indications": [
        "Limpeza do terreno biológico",
        "Ativação da drenagem linfática orgânica",
        "Apoio em tratamentos estéticos de peso, celulite e inflamação"
      ]
    },
    "en": {
      "tagline": "Stimulus for energetic and emotional drainage",
      "description": "Potentiates homeostatic release of homotoxins and the function of the entire lymphatic system through cellular biophysical correction. Formula with frequencies from Chinese and Brazilian phytotherapy and German homotoxicology.",
      "indications": [
        "Cleansing of the biological terrain",
        "Activation of organic lymphatic drainage",
        "Support for aesthetic protocols related to weight, cellulite and inflammation"
      ]
    },
    "de": {
      "tagline": "Anregung der energetischen und emotionalen Drainage",
      "description": "Potenziert die homöostatische Freisetzung von Homotoxinen und die Funktion des gesamten Lymphsystems durch zelluläre biophysikalische Korrektur. Formel mit Frequenzen chinesischer und brasilianischer Phytotherapie sowie deutscher Homotoxikologie.",
      "indications": [
        "Reinigung des biologischen Terrains",
        "Aktivierung der organischen Lymphdrainage",
        "Unterstützung ästhetischer Protokolle zu Gewicht, Cellulite und Entzündung"
      ]
    },
    "es": {
      "tagline": "Flujo linfático | Liberación de homotoxinas",
      "description": "Potencia la liberación homeostática de homotoxinas y la función de todo el sistema linfático, por corrección biofísica celular. Fórmula con frecuencias de fitoterápicos chinos, brasileños y homotoxicología alemana.",
      "indications": [
        "Limpieza del terreno biológico",
        "Activación del drenaje linfático orgánico",
        "Apoyo en tratamientos estéticos de peso, celulitis e inflamación"
      ]
    }
  }
},
{
  "id": "mente-serena",
  "name": "Mente Serena",
  "category": "sensorial",
  "volume": "60ml",
  "price": 120,
  "image": "assets/img/prod-mente-serena.jpg",
  "audio": "assets/audio/mente-serena.mp3",
  "i18n": {
    "pt": {
      "tagline": "Redução de hiperatividade, bruxismo e estresse",
      "description": "Harmoniza mente e corpo, aliviando sintomas de estresse e tensões relacionadas ao bruxismo. Favorece calma, presença e paz interior no ritmo do dia a dia.",
      "indications": [
        "Reduz hiperatividade mental e física",
        "Auxilia no controle do bruxismo",
        "Equilibra estresse e ansiedade",
        "Estimula calma e paz interior"
      ]
    },
    "en": {
      "tagline": "Reduction of hyperactivity, bruxism and stress",
      "description": "Harmonizes mind and body, easing stress symptoms and tensions related to bruxism. It favors calm, presence and inner peace in the rhythm of daily life.",
      "indications": [
        "Reduces mental and physical hyperactivity",
        "Supports bruxism control",
        "Balances stress and anxiety",
        "Stimulates calm and inner peace"
      ]
    },
    "de": {
      "tagline": "Reduktion von Hyperaktivität, Bruxismus und Stress",
      "description": "Harmonisiert Geist und Körper, lindert Stresssymptome und Spannungen im Zusammenhang mit Bruxismus. Fördert Ruhe, Präsenz und inneren Frieden im Alltag.",
      "indications": [
        "Reduziert mentale und physische Hyperaktivität",
        "Unterstützt die Kontrolle von Bruxismus",
        "Balanceiert Stress und Angst",
        "Anregt Ruhe und inneren Frieden"
      ]
    },
    "es": {
      "tagline": "Calma mental | Alivio del estrés | Bruxismo",
      "description": "Armoniza mente y cuerpo, aliviando síntomas de estrés y tensiones relacionadas con el bruxismo. Favorece calma, presencia y paz interior en el ritmo del día a día.",
      "indications": [
        "Reduce la hiperactividad mental y física",
        "Ayuda en el control del bruxismo",
        "Equilibra el estrés y la ansiedad",
        "Estimula calma y paz interior"
      ]
    }
  }
},
{
  "id": "garrafadas-capsula",
  "name": "Garrafadas em Cápsula",
  "category": "fito",
  "volume": "cápsulas",
  "price": 88,
  "image": "assets/img/garrafadas-capsula.jpg",
  "audio": null,
  "kind": "garrafada",
  "i18n": {
    "pt": {
      "tagline": "Linha de fitoalquímicos | Sabedoria das ervas em cápsulas",
      "description": "As Garrafadas em Cápsula reúnem a tradição das garrafadas medicinais em formato prático e moderno. Fazem parte da linha de fitoalquímicos da Família CEME, para quem busca o cuidado integrativo com a força das plantas.",
      "indications": [
        "Formato em cápsulas, prático no dia a dia",
        "Inspiradas na tradição das garrafadas",
        "Linha de fitoalquímicos da Família CEME",
        "Complemento ao cuidado com o Método CEME"
      ]
    },
    "en": {
      "tagline": "Phytoalchemy line | Herbal wisdom in capsules",
      "description": "Garrafadas in Capsules bring the tradition of medicinal herbal tonics into a practical, modern format. Part of Família CEME’s phytoalchemy line for integrative care with the power of plants.",
      "indications": [
        "Capsule format, practical for daily use",
        "Inspired by traditional herbal tonics (garrafadas)",
        "Part of Família CEME’s phytoalchemy line",
        "Complements care with the CEME Method"
      ]
    },
    "de": {
      "tagline": "Phytoalchemie-Linie | Kräuterweisheit in Kapseln",
      "description": "Garrafadas in Kapseln bringen die Tradition medizinischer Kräuterelixiere in ein praktisches, modernes Format. Teil der Phytoalchemie-Linie der Família CEME für integrative Pflege mit der Kraft der Pflanzen.",
      "indications": [
        "Kapselformat – praktisch für den Alltag",
        "Inspiriert von traditionellen Kräuterelixieren (Garrafadas)",
        "Teil der Phytoalchemie-Linie der Família CEME",
        "Ergänzt die Pflege mit der CEME-Methode"
      ]
    },
    "es": {
      "tagline": "Línea de fitoalquimia | Sabiduría de las hierbas en cápsulas",
      "description": "Las Garrafadas en Cápsula reúnen la tradición de las garrafadas medicinales en un formato práctico y moderno. Forman parte de la línea de fitoalquimia de Família CEME, para quien busca el cuidado integrativo con la fuerza de las plantas.",
      "indications": [
        "Formato en cápsulas, práctico en el día a día",
        "Inspiradas en la tradición de las garrafadas",
        "Línea de fitoalquimia de Família CEME",
        "Complemento al cuidado con el Método CEME"
      ]
    }
  }
}
];
