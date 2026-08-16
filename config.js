/* ============================================================
   PERSONALIZE AQUI — este é o único arquivo que você precisa editar
   para deixar o site com a cara de vocês dois.
   ============================================================ */

const CONFIG = {
  // Nome dela (aparece na capa, na carta e no final)
  nomeDela: "Meu Amor",

  // Seu nome (assinatura da carta)
  seuNome: "Gabriel",

  // Data em que vocês começaram a namorar (ano-mês-dia)
  // O contador no site usa essa data.
  dataInicio: "2024-02-14",

  // Apelido carinhoso que aparece no envelope
  apelido: "princesa",

  // Frase da capa, antes de abrir a carta
  fraseCapa: "Uma carta que eu escrevi só para você",

  // Título grande depois que ela abre
  tituloHero: "Você é o meu lugar favorito no mundo",

  // A carta de amor (use \n\n para pular um parágrafo)
  carta: `Se você está lendo isso, é porque eu quis encontrar um jeito diferente de te dizer o que o coração já grita todos os dias.

Você transformou os meus dias comuns em algo que vale a pena lembrar. O seu sorriso é o lugar para onde eu quero voltar. A sua voz acalma o que eu nem sabia que estava barulhento.

Obrigado por ser exatamente quem você é — intensa, doce, corajosa, e o meu lar.

Eu te amo. Hoje, amanhã, e em todos os dias que a gente ainda vai escrever juntos.`,

  // Motivos / homenagens (aparecem em cartões)
  motivos: [
    {
      titulo: "O seu sorriso",
      texto: "É o primeiro lugar em que eu penso quando o dia pesa. Um sorriso seu e o mundo inteiro fica mais leve.",
    },
    {
      titulo: "A sua força",
      texto: "Você enfrenta a vida com uma coragem linda. Eu te admiro em silêncio, e em voz alta, todos os dias.",
    },
    {
      titulo: "O jeito que você cuida",
      texto: "Nos detalhes, no tom de voz, no abraço. Você faz qualquer lugar virar casa.",
    },
    {
      titulo: "A sua risada",
      texto: "É a trilha sonora favorita da minha vida. Eu coleciono cada uma delas.",
    },
    {
      titulo: "Os seus sonhos",
      texto: "Eu quero estar ao seu lado quando eles acontecerem — e ajudar a construir cada um.",
    },
    {
      titulo: "Ser simplesmente você",
      texto: "Não é uma versão, não é um dia especial. É você, do jeito que é, que eu escolho de novo.",
    },
  ],

  // Linha do tempo da história de vocês
  historia: [
    {
      data: "O começo",
      titulo: "O dia em que te conheci",
      texto: "Eu ainda não sabia, mas a minha vida tinha acabado de mudar de cor.",
    },
    {
      data: "O clique",
      titulo: "Quando eu soube",
      texto: "Não foi um raio. Foi um silêncio gostoso: “é ela”.",
    },
    {
      data: "Nós",
      titulo: "Cada dia do lado dela",
      texto: "Brigas pequenas, café, mensagens bobas, planos enormes. Tudo isso é a gente.",
    },
    {
      data: "Hoje",
      titulo: "Este site, este “eu te amo”",
      texto: "Uma homenagem pequena para um sentimento enorme. Você merece o mundo — e o meu.",
    },
  ],

  // Fotos da galeria. Coloque as imagens na pasta /fotos
  // Se o arquivo não existir, o site mostra um coração no lugar.
  fotos: [
    { src: "fotos/1.jpg", legenda: "A gente" },
    { src: "fotos/2.jpg", legenda: "O seu sorriso" },
    { src: "fotos/3.jpg", legenda: "Um dia especial" },
    { src: "fotos/4.jpg", legenda: "Nós dois" },
    { src: "fotos/5.jpg", legenda: "Memória favorita" },
    { src: "fotos/6.jpg", legenda: "Para sempre" },
  ],

  // Promessas no final
  promessas: [
    "Te escolher mesmo nos dias cansados",
    "Ouvir de verdade, não só esperar a minha vez de falar",
    "Celebrar cada vitória sua como se fosse minha",
    "Cuidar do “nós” com a mesma atenção que cuido de você",
    "Te amar de um jeito calmo, constante e sincero",
  ],

  // Frase final
  fraseFinal: "Eu te amo. E vou continuar te amando.",

  // Música (opcional). Coloque um arquivo musica.mp3 na pasta do site.
  // Deixe vazio "" se não quiser música.
  musica: "musica.mp3",
};
