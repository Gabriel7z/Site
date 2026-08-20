/* ============================================================
   PERSONALIZE AQUI
   ============================================================ */

const CONFIG = {
  nomeDela: "Amanda",
  seuNome: "Gabriel",
  apelido: "Amanda",

  // 22/10/2022 — o dia em que vocês se conheceram
  dataConheceu: "2022-10-22",

  // 23/08/2023 — o dia em que começaram a namorar
  dataNamoro: "2023-08-23",

  fraseCapa: "Para Amanda",
  tituloHero: "Você é a minha outra metade",

  carta: `Meu amor,

Eu te amo de maneira indescritível. Todos os momentos que passamos juntos nessa jornada, eu louvo a Deus por cada um deles. Muito obrigado por essa pessoa incrível na minha vida — mulher abençoada, que tantas vezes eu estive caído e você me levantou. Quantas vezes achei que seria o fim, e você foi a minha luz.

Eu te amo muito mais do que eu consigo demonstrar, muito mais do que eu consigo escrever. Eu tenho total certeza sobre você: você é a minha namorada, a minha noiva e futura esposa, a minha amiga, a minha confidente, o meu porto seguro — tudo em que eu posso confiar.

Amo os nossos sorrisos, os nossos sonhos, o nosso caminhar e cada tijolinho que colocamos nessa construção diária que é a nossa vida.

Quantas vezes você me perdoa, né, amor? Muito obrigado por sempre acreditar em mim. Desculpa por esse ogro chucro em diversas circunstâncias. Apesar de já ter um tempo, eu estou tentando melhorar a cada dia, meu amor. 🥺

Eu tenho suspeitas de que eu tenho TDAH, mas só suspeita!

Eu fiz este mini site em forma de carta para dizer o quanto eu te amo. É mais uma prova do meu amor.

Você é tudo para mim. O meu tudo.

Eu te amo, meu grande amor! 🥺❤️`,

  motivos: [
    {
      titulo: "O seu sorriso",
      texto: "É o primeiro lugar em que eu penso quando o dia pesa. Um sorriso seu e o mundo inteiro fica mais leve.",
    },
    {
      titulo: "A sua fé",
      texto: "Eu te vejo com o coração aberto e as mãos levantadas — e admiro a mulher que você é também nisso.",
    },
    {
      titulo: "A futura dentista",
      texto: "Eu tenho orgulho da profissional que você está se tornando. Cada passo seu eu celebro como se fosse meu.",
    },
    {
      titulo: "O jeito que a gente se abraça",
      texto: "Cabeça com cabeça, o mundo inteiro some. É nesse silêncio que eu sei que encontrei a minha metade.",
    },
    {
      titulo: "Nossos momentos",
      texto: "Você é a água do meu rio, você é o sol nos meus dias de frio.",
    },
    {
      titulo: "Ser a Amanda",
      texto: "Não é uma versão, não é um dia especial. É você, do jeito que é, que eu escolho de novo. Sempre.",
    },
  ],

  historia: [
    {
      data: "22 de outubro de 2022",
      titulo: "O dia em que te conheci",
      texto: "A data em que a minha vida mudou de cor. Eu ainda não sabia, mas já era você.",
    },
    {
      data: "Os dias seguintes",
      titulo: "Quando eu soube",
      texto: "Não foi um raio. Foi um silêncio gostoso: “é ela”. Amanda.",
    },
    {
      data: "23 de agosto de 2023",
      titulo: "O dia em que viramos namoro",
      texto: "O nosso “sim”. Três anos de um nós que eu cuidaria outra vez, do zero, se precisasse.",
    },
    {
      data: "Hoje",
      titulo: "Este site, este eu te amo",
      texto: "Uma homenagem pequena para um sentimento enorme. Você merece o mundo — e o meu.",
    },
  ],

  fotos: [
    { src: "fotos/1.jpg", legenda: "O seu sorriso" },
    { src: "fotos/2.jpg", legenda: "Do seu jeito" },
    { src: "fotos/3.jpg", legenda: "Um dia nosso" },
    { src: "fotos/4.jpg", legenda: "Beto Carrero" },
    { src: "fotos/5.jpg", legenda: "Beto Carrero, você" },
    { src: "fotos/6.jpg", legenda: "Luz do fim de tarde" },
    { src: "fotos/7.jpg", legenda: "Eu tenho orgulho de você" },
    { src: "fotos/8.jpg", legenda: "A futura dentista" },
    { src: "fotos/9.jpg", legenda: "A sua fé" },
    { src: "fotos/10.jpg", legenda: "O nosso beijo" },
    { src: "fotos/11.jpg", legenda: "O jeito que a gente se abraça" },
    { src: "fotos/12.jpg", legenda: "Um dia especial" },
    { src: "fotos/13.jpg", legenda: "Duas metades" },
    { src: "fotos/14.jpg", legenda: "Família" },
    { src: "fotos/15.jpg", legenda: "Com carinho" },
    { src: "fotos/16.jpg", legenda: "Até nas caretas" },
    { src: "fotos/17.jpg", legenda: "Você, do seu jeito" },
    { src: "fotos/18.jpg", legenda: "Linda assim" },
    { src: "fotos/19.jpg", legenda: "A gente" },
    { src: "fotos/20.jpg", legenda: "Meu lugar favorito" },
    { src: "fotos/21.jpg", legenda: "A gente arrumado" },
    { src: "fotos/22.jpg", legenda: "Pertinho de você" },
    { src: "fotos/23.jpg", legenda: "Um dia de sol e você" },
    { src: "fotos/24.jpg", legenda: "O jeito que você cuida" },
    { src: "fotos/25.jpg", legenda: "Vivendo o seu sonho" },
    { src: "fotos/26.jpg", legenda: "Essa timidez linda" },
    { src: "fotos/27.jpg", legenda: "Dançando na sala" },
    { src: "fotos/28.jpg", legenda: "O nosso jeito bobo" },
    { src: "fotos/29.jpg", legenda: "Você, em silêncio" },
    { src: "fotos/30.jpg", legenda: "Um dia de festa" },
  ],

  promessas: [
    "Te escolher mesmo nos dias cansados",
    "Ouvir de verdade, não só esperar a minha vez de falar",
    "Celebrar cada vitória sua como se fosse minha",
    "Cuidar do “nós” com a mesma atenção que cuido de você",
    "Te amar de um jeito calmo, constante e sincero",
  ],

  // Bilhetes para ela abrir no dia certo, um por vez.
  bilhetes: [
    {
      quando: "Abra quando estiver triste",
      texto: `Amor, vai ter dias que são difíceis de suportar, dias em que parece impossível passar, dor esmagadora. Mas lembra: isso é apenas uma fase, e você é maior que tudo isso.

Eu tenho muito, muito orgulho de você — da mulher que você é, da namorada que você é!

Eu só tenho a agradecer a Deus por ter me agraciado com uma mulher tão incrível! 🥺❤️`,
    },
    {
      quando: "Abra quando bater saudade de mim",
      texto: `Se você está lendo isso, é certeza que eu também estou com saudades agora. Eu tenho saudades infinitas de você 🥺❤️

Como eu queria estar ao seu lado agora, sentindo o seu cheiro, o seu toque. Eu sinto falta de você todos os momentos do meu dia. Eu te amooo! 🥺❤️`,
    },
    {
      quando: "Abra quando a gente brigar",
      texto: `É, meu amorzinho... mais uma briga. Eu já peço desculpas desde agora 😭😭😭

Eu errei tentando acertar, meu amorzinho. Paciência comigo, minha princesa. Aceita as minhas desculpas: eu sei que eu erro, que eu falo besteira, que às vezes eu faço as coisas ficarem mais difíceis. Eu te amo muito, muito, muito!

E não é intencional. Às vezes eu não sei expressar, sabe, amor, a vontade que eu tenho de você.

Me perdoa, meu amor. Cada dia eu tento melhorar um pouquinho! 😔🥺❤️`,
    },
    {
      quando: "Abra quando duvidar de você mesma",
      texto: `Amor, eu tenho orgulho de você. Da mulher que você é e da profissional que você está se tornando.

Eu vejo o seu esforço de perto. Vejo você cansada e indo de novo. Isso não é sorte nem talento: é caráter, e você tem.

Se hoje você não consegue ver isso em você, acredita no que eu vejo: eu tenho total certeza sobre você. Sempre tive.`,
    },
    {
      quando: "Abra num dia bom",
      texto: `Se hoje foi um dia bonito, eu quero estar dentro dele com você. Me conta tudo, com detalhes, do jeito comprido que você conta — eu amo.

E guarda isso: você merece dias assim, muitos. Não é sorte, é você.

Eu louvo a Deus por cada dia bom que a vida te dá, e por poder ver de pertinho.`,
    },
    {
      quando: "Abra antes de dormir",
      texto: `Boa noite, meu amor.

Se você chegou até aqui hoje, já deu tudo certo — já é motivo de agradecer.

Dorme tranquila sabendo que tem alguém no mundo pensando em você com um sorriso bobo na cara. Eu te amo. Amanhã eu te amo de novo.`,
    },
  ],

  // Um motivo diferente por dia. Ela abre o site e encontra o de hoje.
  motivosDoDia: [
    "Hoje eu te amo pelo seu sorriso, que continua sendo a melhor notícia do meu dia.",
    "Hoje eu te amo pela paciência que você tem comigo, mesmo quando eu não mereço.",
    "Hoje eu te amo pelo jeito que você fala dos seus sonhos, com os olhos brilhando.",
    "Hoje eu te amo por você ter ficado, mesmo nos dias em que eu estava difícil.",
    "Hoje eu te amo pelo seu abraço, que é o único lugar em que eu descanso de verdade.",
    "Eu te amo, meu amor. Eu te amo pelo que você é: linda, charmosa, dengosa, cuidadosa... Eu tenho muito orgulho de você, te amo mil milhões!",
    "Hoje eu te amo pela sua fé, que muitas vezes segurou a minha.",
    "Hoje eu te amo pelo som da sua risada quando eu falo alguma besteira.",
    "Hoje eu te amo por você me escutar até quando eu não sei explicar o que estou sentindo.",
    "Hoje eu te amo pela sua coragem de continuar estudando, cansada, e ir de novo.",
    "Hoje eu te amo por você acreditar em mim antes de eu acreditar.",
    "Hoje eu te amo pelo jeito que você cuida das pessoas sem ninguém pedir.",
    "Hoje eu te amo porque com você até o dia comum fica bonito.",
    "Hoje eu te amo pela sua honestidade, mesmo quando dói ouvir.",
    "Hoje eu te amo pelo seu perdão, que eu já usei tantas vezes.",
    "Hoje eu te amo pelo jeito que você me chama quando está feliz.",
    "Hoje eu te amo porque você virou a minha casa, e não só a minha namorada.",
    "Hoje eu te amo pela sua teimosia boa, a que não deixa a gente desistir.",
    "Hoje eu te amo por cada tijolinho que a gente colocou nessa vida juntos.",
    "Hoje eu te amo pelo seu silêncio do meu lado, que já é conversa.",
    "Hoje eu te amo porque você me faz querer ser um homem melhor, sem me cobrar.",
    "Hoje eu te amo pelo jeito que você fica linda sem tentar.",
    "Hoje eu te amo por você ser a primeira pessoa que eu quero contar tudo.",
    "Hoje eu te amo pela força que você tem e nem percebe.",
    "Hoje eu te amo pela sua fome de viver as coisas comigo.",
    "Hoje eu te amo por você aguentar o meu jeito e ainda me achar graça.",
    "Hoje eu te amo pelo futuro que eu vejo quando eu olho você.",
    "Hoje eu te amo pelo carinho que você tem com a sua família e com a minha.",
    "Hoje eu te amo porque você é a água do meu rio e o sol nos meus dias de frio.",
    "Hoje eu te amo por você ter dito sim, e por continuar dizendo todos os dias.",
    "Hoje eu te amo simplesmente porque é você. E isso já bastaria.",
  ],

  ceuFrase: "O céu já tinha você. Eu é que ainda não sabia.",

  roleta: [
    "linda",
    "charmosa",
    "dengosa",
    "cuidadosa",
    "meu tudo",
    "mil milhões",
    "meu orgulho",
    "minha princesa",
    "o seu sorriso",
    "futura esposa",
  ],

  fraseFinal: "Eu te amo, Amanda. E vou continuar te amando.",

  // Clipe oficial no canal da dupla (YouTube). Não hospedamos o áudio.
  youtubeId: "HR4ZxjGQGYY",
  musicaTitulo: "Duas Metades",
  musicaArtista: "Jorge & Mateus",
};
