document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     BASE DE CONHECIMENTO DO ASSISTENTE
     Para mudar ou acrescentar respostas, edite só esta lista.

     chaves: palavras ou expressões que a pessoa pode escrever
             (sem se preocupar com acentos ou maiúsculas).
             Comece com "~" para uma palavra "fraca" (vale menos) e
             termine com "!" para exigir a palavra inteira.
     prioridade: (opcional) número que faz a resposta ganhar
             quando houver empate com outra.
     resposta: texto mostrado. Use \n para pular linha.
  ========================================================= */
  const BASE = [

    {
      chaves: ["cheiro", "fedor", "podre", "estragad", "limo!", "gosmento", "mofo", "mofad", "seguro comer", "posso comer", "intoxica", "bacteria", "contamina", "~seguranca alimentar"],
      prioridade: 5,
      resposta: "Atenção: não consigo garantir que um alimento está seguro para consumo. Se a carne tem cheiro ruim, limo, cor estranha ou qualquer sinal diferente, descarte por precaução e consulte um profissional (veterinário ou nutricionista). Em caso de dúvida, não consuma."
    },
    {
      chaves: ["220", "110", "220v", "110v", "127v", "volt", "voltagem", "tomada", "fiacao", "fio", "choque", "eletrica", "eletricista", "curto circuito", "queimar", "rede eletrica"],
      prioridade: 5,
      resposta: "A montagem envolve eletricidade da rede (geladeira e relés). Para qualquer ligação em 110/220 V, peça ajuda de um eletricista ou técnico qualificado e nunca mexa em fiação energizada. Tenha cuidado com fusível e com uma caixa fechada para os componentes."
    },
    {
      chaves: ["quanto custa", "custo", "preco", "orcamento", "reais", "r$", "caro!", "barato!", "gastar"],
      resposta: "O custo total aproximado informado no site é de R$ 573,00:\n• ESP32: R$ 150,00\n• Sensor DHT22: R$ 45,00\n• Módulo relé de 4 canais: R$ 38,00\n• Fonte 5V/12V: R$ 60,00\n• Umidificador ultrassônico: R$ 90,00\n• Ventoinhas de exaustão (x2): R$ 40,00\n• Estrutura física: cerca de R$ 150,00\nSão valores estimados. Mais detalhes na página Produção."
    },
    {
      chaves: ["lista de componentes", "componentes", "materiais", "o que preciso", "o que comprar", "pecas", "~comprar"],
      resposta: "Os componentes do MatureBox são:\n• Microcontrolador ESP32\n• Sensor DHT22 (temperatura e umidade)\n• Módulo relé de 4 canais\n• Fonte de alimentação 5V/12V\n• Umidificador ultrassônico\n• 2 ventoinhas de exaustão de 120 mm\n• Uma geladeira frost-free usada, como câmara\nA lista completa está na página Produção."
    },
    {
      chaves: ["esp32", "microcontrolador", "cerebro", "placa"],
      prioridade: 2,
      resposta: "O ESP32 é o \"cérebro\" do sistema: lê os sensores, controla os relés e se comunica por Wi-Fi para enviar a telemetria. Custa cerca de R$ 150,00 na lista do projeto."
    },
    {
      chaves: ["dht22", "dht", "~sensor"],
      prioridade: 2,
      resposta: "O DHT22 é o sensor de temperatura e umidade relativa do ar. Ele é essencial para manter o ambiente de maturação estável. Custa cerca de R$ 45,00 na lista do projeto."
    },
    {
      chaves: ["rele!", "reles!", "modulo rele", "4 canais"],
      prioridade: 2,
      resposta: "O módulo relé de 4 canais liga e desliga o compressor da geladeira, o umidificador, o exaustor e a resistência de aquecimento, comandado pelo ESP32. Custa cerca de R$ 38,00."
    },
    {
      chaves: ["umidificador", "nevoa", "ultrassonico"],
      prioridade: 2,
      resposta: "O umidificador ultrassônico gera névoa para elevar a umidade interna sem gerar calor residual. Custa cerca de R$ 90,00 na lista do projeto."
    },
    {
      chaves: ["ventoinha", "cooler", "exaustor", "exaustao", "ventilacao", "circulacao"],
      prioridade: 2,
      resposta: "São duas ventoinhas (coolers) de 120 mm, para renovar o ar e circular o ar dentro da câmara, evitando pontos de ar parado e a proliferação de fungos indesejados. Custam cerca de R$ 40,00 no total."
    },
    {
      chaves: ["fonte de alimentacao", "fonte", "5v", "12v", "energia estabilizada"],
      prioridade: 2,
      resposta: "A fonte de alimentação 5V/12V dá energia estabilizada para a placa controladora, os sensores e os pequenos atuadores, como as ventoinhas. Custa cerca de R$ 60,00."
    },
    {
      chaves: ["geladeira", "frost free", "camara", "freezer", "compressor"],
      prioridade: 2,
      resposta: "A câmara é feita com uma geladeira frost-free, de qualquer modelo usado. O módulo relé liga e desliga o compressor dela para controlar a temperatura."
    },
    {
      chaves: ["como comeco", "comecar", "montagem", "montar", "passo a passo", "instrucoes", "guia", "tutorial", "como faco", "inicializacao"],
      resposta: "A montagem segue 5 etapas, que estão na página Instruções:\n1. Energização\n2. Conectividade (Wi-Fi)\n3. Calibração térmica\n4. Inoculação e setup (colocar o produto e escolher o perfil)\n5. Monitoramento\nPergunte sobre qualquer uma delas para ver os detalhes."
    },
    {
      chaves: ["energizacao", "ligar o dispositivo", "boot", "led azul", "piscando", "~led"],
      prioridade: 2,
      resposta: "Conecte o dispositivo a uma fonte de energia ininterrupta e aguarde o boot do sistema. Durante a inicialização, o LED frontal pisca em azul. A parte elétrica da geladeira e dos relés deve ser feita por quem entende de eletricidade."
    },
    {
      chaves: ["wifi", "wi fi", "rede!", "redes!", "conectar", "conectividade", "ip padrao", "painel web", "internet", "nuvem", "telemetria"],
      prioridade: 2,
      resposta: "Acesse o painel web local pelo IP padrão do dispositivo e configure os dados da sua rede Wi-Fi. Assim o ESP32 consegue enviar a telemetria dos sensores continuamente."
    },
    {
      chaves: ["calibr", "autocalibracao", "estabilizar", "precisao dos sensores"],
      prioridade: 2,
      resposta: "Depois de ligar, execute a rotina de autocalibração. Ela estabiliza a temperatura interna e valida a precisão dos sensores antes de você colocar o produto."
    },
    {
      chaves: ["inoculacao", "colocar o produto", "colocar a carne", "setup", "perfil de maturacao", "escolher o perfil", "inserir o produto"],
      prioridade: 2,
      resposta: "Com o ambiente estabilizado, coloque o produto na câmara e escolha o perfil de maturação correspondente no painel de controle. O sistema ajusta a umidade e o fluxo de ar automaticamente. Como referência, o perfil de carne usa 2,5 °C e 85% de umidade."
    },
    {
      chaves: ["temperatura ideal", "qual temperatura", "temperatura da carne", "~temperatura", "graus", "2.5", "2,5"],
      resposta: "Para carne, o perfil de referência do projeto é 2,5 °C de temperatura e 85% de umidade relativa."
    },
    {
      chaves: ["~umidade", "~umido", "seco demais", "~85"],
      resposta: "O projeto trabalha com umidade relativa entre 75% e 85%, conforme as referências científicas do site. O perfil de referência da carne usa 85%. Para elevar a umidade é usado o umidificador ultrassônico, e as ventoinhas renovam o ar da câmara."
    },
    {
      chaves: ["monitor", "acompanhar", "alerta", "alertas", "grafico", "historico", "tempo real", "dashboard"],
      resposta: "Com o processo iniciado, acompanhe as leituras em tempo real na página Controle, que mostra temperatura, umidade e o histórico em gráfico. As instruções do projeto preveem alertas quando há desvio dos parâmetros ideais."
    },
    {
      chaves: ["controle", "painel", "modo automatico", "modo manual", "automatico", "manual", "emergencia", "parada", "ajustar", "ajuste"],
      resposta: "A página Controle mostra temperatura e umidade em tempo real. Nela você escolhe o perfil, ajusta a temperatura e a umidade alvo e usa o modo Automático ou Manual. No Manual, você liga e desliga compressor, resistência, umidificador e exaustor. Também há um botão de parada de emergência, que desliga todas as saídas."
    },
    {
      chaves: ["equipe", "quem fez", "quem criou", "quem cuida", "quem desenvolveu", "responsavel", "design", "identidade visual", "integrantes", "autores", "alunos", "desenvolvedor", "arthur", "kaue", "leciane", "pietra", "victor"],
      resposta: "A equipe do MatureBox:\n• Arthur Moreira de Souza: sensores e estrutura física da câmara\n• Kauê Marques Martins: estudo bioquímico da maturação e parâmetros ideais\n• Leciane Leonardo da Silva: design do projeto, interface do site e identidade visual\n• Pietra Oliveira Cavalcanti: painel de controle e algoritmos de automação\n• Victor Garcia Andrade: integração dos sistemas com a nuvem"
    },
    {
      chaves: ["referencia", "referencias", "artigo", "estudo", "cientifico", "ciencia", "pesquisa", "fonte cientifica", "fundamentacao"],
      resposta: "A página Referências reúne a base científica do projeto: um estudo sobre controle de umidade relativa na maturação a seco (que fundamenta a faixa de 75% a 85%), um sobre calibração de sensores em temperaturas próximas de 0 °C e um sobre culturas fúngicas sob ventilação forçada."
    },
    {
      chaves: ["codigo", "github", "open source", "opensource", "repositorio", "codigo fonte"],
      resposta: "O MatureBox é open-source. Na página Produção há o botão \"Ver código\", que leva ao repositório no GitHub."
    },
    {
      chaves: ["jogo", "chefe guardiao", "plankton", "hacker", "sabotador", "vilao", "inimigos"],
      resposta: "A página Jogo apresenta o \"Chefe Guardião da Receita\" e os inimigos que tentam atrapalhar o processo, como o Plankton genérico, os hackers da receita e o sabotador da fábrica."
    },
    {
      chaves: ["conta!", "cadastro", "cadastrar", "criar conta", "login", "~entrar", "senha"],
      resposta: "Para entrar, use o botão Entrar no topo do site. Se ainda não tem conta, na tela de login escolha a opção \"Criar conta\"."
    },
    {
      chaves: ["contato", "suporte", "falar com", "ajuda humana", "email", "telefone"],
      resposta: "Para falar com a equipe, veja a página Sobre nós, onde estão os integrantes do projeto."
    },
    {
      chaves: ["o que e", "para que serve", "como funciona", "objetivo", "dry aging", "maturacao a seco", "~maturebox", "~projeto", "~maturacao"],
      resposta: "O MatureBox é uma câmara de maturação controlada, feita com componentes de baixo custo. Ela controla temperatura e umidade para a maturação a seco de carnes e foi desenvolvida por estudantes como Trabalho de Conclusão de Curso."
    },
    {
      chaves: ["obrigado", "obrigada", "valeu", "brigado", "agradeco"],
      resposta: "De nada! Se tiver mais alguma dúvida sobre o MatureBox, é só perguntar."
    },
    {
      chaves: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "e ai", "eae"],
      resposta: "Olá! Posso ajudar com a montagem, os componentes, os custos e o funcionamento do MatureBox. O que você quer saber?"
    }
  ];

  const SEM_RESPOSTA = "Não encontrei essa informação no projeto. Tente perguntar sobre: montagem, custo, componentes, temperatura e umidade, painel de controle ou equipe. Se preferir, fale com a equipe pela página Sobre nós.";

  const SUGESTOES = [
    "Como começo a montagem?",
    "Quanto custa montar?",
    "Qual a temperatura ideal para carne?",
    "Quais são os componentes?"
  ];

  const BOAS_VINDAS = "Olá! Sou o assistente do MatureBox. Posso ajudar com a montagem, os componentes e o funcionamento do projeto. O que você quer saber?";

  const MAX_CARACTERES = 200;

  /* ---------- Busca da melhor resposta ---------- */
  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9$\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Prepara as chaves uma única vez
  BASE.forEach((item) => {
    item.padroes = item.chaves.map((bruta) => {
      const fraca = bruta.startsWith("~");
      const exata = bruta.endsWith("!");   // "!" no fim = só a palavra inteira
      const limpa = bruta.replace(/^~/, "").replace(/!$/, "");
      const chave = normalizar(limpa);
      const inicio = /^[a-z0-9]/.test(chave) ? "\\b" : "";
      // chaves curtas (até 3 letras) também precisam ser a palavra inteira
      const fim = exata || chave.length <= 3 ? "\\b" : "";

      return {
        regex: new RegExp(inicio + escaparRegex(chave) + fim),
        peso: fraca ? 0.5 : chave.split(" ").length
      };
    });
  });

  function pontuar(item, texto) {
    let pontos = 0;

    item.padroes.forEach((padrao) => {
      if (padrao.regex.test(texto)) pontos += padrao.peso;
    });

    // a prioridade só conta se houve ao menos uma palavra forte
    return pontos >= 1 ? pontos + (item.prioridade || 0) : pontos;
  }

  function responder(pergunta) {
    const texto = normalizar(pergunta);
    let melhor = null;
    let melhorPontos = 0;

    BASE.forEach((item) => {
      const pontos = pontuar(item, texto);
      if (pontos > melhorPontos) {   // em empate, vence a que vem primeiro na lista
        melhor = item;
        melhorPontos = pontos;
      }
    });

    return melhor ? melhor.resposta : null;
  }

  /* ---------- Montagem da janela ---------- */
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "chat-abrir";
  botao.setAttribute("aria-expanded", "false");
  botao.setAttribute("aria-controls", "chat-janela");
  botao.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <span>Ajuda</span>`;

  const janela = document.createElement("section");
  janela.id = "chat-janela";
  janela.className = "chat-janela";
  janela.setAttribute("role", "dialog");
  janela.setAttribute("aria-label", "Assistente MatureBox");
  janela.hidden = true;
  janela.innerHTML = `
    <header class="chat-topo">
      <div class="chat-titulo"><span class="led ligado"></span>Assistente MatureBox</div>
      <button type="button" class="chat-fechar" aria-label="Fechar assistente">&times;</button>
    </header>
    <div class="chat-mensagens" role="log" aria-live="polite" aria-label="Conversa"></div>
    <div class="chat-sugestoes"></div>
    <form class="chat-form">
      <label class="visualmente-oculto" for="chat-entrada">Sua pergunta</label>
      <input id="chat-entrada" class="chat-entrada" type="text" maxlength="${MAX_CARACTERES}" placeholder="Digite sua dúvida..." autocomplete="off">
      <button type="submit" class="btn btn-ambar chat-enviar">Enviar</button>
    </form>
    <p class="chat-aviso">Assistente de perguntas frequentes: responde apenas sobre o projeto. Para dúvidas de segurança com alimentos ou eletricidade, consulte um profissional.</p>`;

  document.body.appendChild(botao);
  document.body.appendChild(janela);

  const listaMensagens = janela.querySelector(".chat-mensagens");
  const areaSugestoes = janela.querySelector(".chat-sugestoes");
  const form = janela.querySelector(".chat-form");
  const entrada = janela.querySelector(".chat-entrada");
  const btnFechar = janela.querySelector(".chat-fechar");

  let aguardando = false;

  /* ---------- Mensagens ---------- */
  function adicionar(texto, tipo) {
    const item = document.createElement("div");
    item.className = `chat-msg ${tipo}`;
    item.textContent = texto;          // textContent: nunca interpreta HTML
    listaMensagens.appendChild(item);
    listaMensagens.scrollTop = listaMensagens.scrollHeight;
    return item;
  }

  function enviar(texto) {
    texto = texto.trim();
    if (!texto || aguardando) return;

    adicionar(texto, "usuario");
    entrada.value = "";
    aguardando = true;

    const digitando = adicionar("Digitando...", "assistente digitando");

    // Pequena pausa, só para a conversa parecer natural
    setTimeout(() => {
      digitando.remove();

      const resposta = responder(texto);

      if (resposta) {
        adicionar(resposta, "assistente");
        areaSugestoes.hidden = true;
      } else {
        adicionar(SEM_RESPOSTA, "assistente");
        areaSugestoes.hidden = false;   // mostra as sugestões de novo
      }

      aguardando = false;
      entrada.focus();
    }, 400);
  }

  /* ---------- Sugestões ---------- */
  SUGESTOES.forEach((texto) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chat-chip";
    chip.textContent = texto;
    chip.addEventListener("click", () => enviar(texto));
    areaSugestoes.appendChild(chip);
  });

  adicionar(BOAS_VINDAS, "assistente");

  /* ---------- Abrir / fechar ---------- */
  function abrir() {
    janela.hidden = false;
    botao.setAttribute("aria-expanded", "true");
    botao.classList.add("oculto");
    entrada.focus();
  }

  function fechar() {
    janela.hidden = true;
    botao.setAttribute("aria-expanded", "false");
    botao.classList.remove("oculto");
    botao.focus();
  }

  botao.addEventListener("click", abrir);
  btnFechar.addEventListener("click", fechar);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !janela.hidden) fechar();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    enviar(entrada.value);
  });

});