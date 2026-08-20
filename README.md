# 📌 Portfólio Executivo & Especificação Técnica

![Arquitetura](https://img.shields.io/badge/Arquitetura-Clean%20Client--Side-10b981?style=for-the-badge&logo=codeforces)
![Bootstrap 5](https://img.shields.io/badge/UI--Framework-Bootstrap%20v5.3.3-8b5cf6?style=for-the-badge&logo=bootstrap)
![Game Engine](https://img.shields.io/badge/Game--Engine-HTML5%20Canvas%20%7C%2060%20FPS-e34f26?style=for-the-badge&logo=html5)
![JavaScript ES6+](https://img.shields.io/badge/Linguagem-Vanilla%20JS%20ES6+-f7df1e?style=for-the-badge&logo=javascript)
![Modo Escuro](https://img.shields.io/badge/Tema-Auto%20Sync%20(Dark%2FLight)-0284c7?style=for-the-badge)
![Deploy Impact](https://img.shields.io/badge/Carga%20Servidor-0%25%20CPU%20%7C%20InfinityFree%20Ready-059669?style=for-the-badge)

## 📖 Visão Geral do Projeto

Este repositório contém a aplicação web institucional e o ecossistema interativo de **Wesley Samuel Ferreira Rodrigues** (Desenvolvedor Full Stack Júnior e Estudante de Ciência da Computação).

O projeto foi construído sob a filosofia **Zero Server Overhead (0% Carga de Servidor)**, combinando uma interface comercial moderna em **Bootstrap 5.3** com um motor de jogo em tempo real escrito do zero em **HTML5 Canvas (Vanilla JS)**. A solução adapta-se automaticamente à preferência de cor do sistema operacional/navegador (*Dark/Light Mode*), possui modais interativos com vídeos e carrosséis para estudos de caso, e é otimizada para hospedagens estáticas de alta performance como o **InfinityFree**.

---

## 🏗️ Arquitetura do Sistema e Estrutura de Diretórios

A estrutura do projeto segue padrões internacionais de organização para aplicações web modulares (`assets/` segregation pattern):

```
projeto_portifolio/
├── index.html                   # Documento raiz semântico (HTML5 + ARIA)
├── README.md                    # Especificação técnica e arquitetural
├── .htaccess                    # Configuração de cache e compressão Gzip
├── assets/                      # Recursos computacionais e estáticos
│   ├── css/
│   │   ├── style.css            # Design System global, variáveis e modais
│   │   └── game.css             # Estilização do Canvas, HUD e overlays do jogo
│   ├── js/
│   │   ├── script.js            # Engine de tema, abas, modais e auto-pause de vídeo
│   │   └── game.js              # Motor gráfico 2D, física e loop do jogo
│   ├── img/
│   │   ├── meus_dados.jpg       # Banner institucional do cabeçalho
│   │   └── projects/            # Imagens organizadas por estudos de caso
│   │       ├── feel.it/         # Capturas de tela do projeto feel.it
│   │       ├── movies/          # Gráficos e telas do Movie Analytics Pro
│   │       ├── payguardian/     # Interfaces do PayGuardian Mobile
│   │       └── projeto_memorize/# Telas da aplicação Java Memorize
│   ├── video/
│   │   └── wshotelaria.mp4      # Vídeo de demonstração do ERP WS-Hotelaria
│   └── docs/
│       └── curriculo_samuel.pdf # Documento executivo em formato PDF
└── screenshots/                 # Capturas institucionais do portfólio
```

---

## 📁 Vitrine de Projetos & Estudos de Caso Interativos

Os projetos estão estruturados com um **Card Destaque Flagship** no topo e uma grade simétrica dos 4 demais projetos alinhados abaixo. Cada card dispara um **Modal Bootstrap 5** com documentação detalhada:

1. **WS-Hotelaria (ERP Hoteleiro em Produção)**:
   - **Mídia**: Prévia em vídeo executando direto no card destaque (`<video autoplay loop muted>`) e Player HTML5 completo no modal (`assets/video/wshotelaria.mp4`).
   - **Descrição**: ERP em produção há quase 1 ano para a pousada familiar (200+ cadastros, controle financeiro, check-in/out, logs, PHP, MySQL, Bootstrap) e futuro roadmap SaaS com Laravel e Vue.js.

2. **feel.it (Rede Social de Expressão Emocional)**:
   - **Mídia**: Imagem demonstrativa em alta definição (`assets/img/projects/feel.it/`).
   - **Descrição**: Rede social fullstack (Vue 3 + Vite, Node.js + Express + TypeScript, SQLite + Prisma ORM) com feelings, clãs, amigos e notificações.

3. **PayGuardian (Gestão Financeira Mobile)**:
   - **Mídia**: Carrossel de fotos interativo (`assets/img/projects/payguardian/`).
   - **Descrição**: Sistema de gestão financeira pessoal nativo em Kotlin e Android Studio com monitoramento de entradas de capital.

4. **Movie Analytics Pro (Data Science & IA)**:
   - **Mídia**: Carrossel de gráficos e predições (`assets/img/projects/movies/`).
   - **Descrição**: Modernização de prova de conceito acadêmica em PHP para um ecossistema completo de Data Science em Python, Pandas, KNN e Árvores de Decisão.

5. **Projeto Memorize (Flashcards Desktop)**:
   - **Mídia**: Carrossel de fotos do software desktop (`assets/img/projects/projeto_memorize/`).
   - **Descrição**: Aplicação desktop Windows desenvolvida em Java SE e Swing aplicando Orientação a Objetos (POO) para estudo via cartões digitais.

---

## 🎮 Engenharia do Game: "Telhado Felino" (`assets/js/game.js`)

O jogo interativo **Telhado Felino** é um motor 2D do tipo *Endless Runner* desenvolvido em JavaScript puríssimo (ES6+ Class Architecture) rodando a 60 Quadros por Segundo (FPS).

### 1. Loop Principal de Renderização (*Game Loop Architecture*)
O ciclo computacional executa continuamente via `requestAnimationFrame`, garantindo sincronização vertical (V-Sync) com taxa de quadros estável:

$$\text{Frame Rate} = 60 \text{ FPS} \implies \Delta t \approx 16.67 \text{ ms}$$

### 2. Mecânica de Física e Balanceamento Rebalanceado
- **Pulo Único Grounded**: O pulo é permitido exclusivamente quando o gato está pisando no telhado (`isGrounded === true`), eliminando saltos falsos no ar.
- **Pombo Raro Voador (`🐦`)**: Flutua suavemente pelo céu em camada aérea. Capturá-lo restaura **+1 Vida** (máximo 7) ou soma **+100 pontos**.
- **Falcões Raros no Estilo Chrome Dino (`🦅`)**: Os falcões voadores só começam a aparecer após o jogador atingir **350 pontos**, permitindo um início de corrida dinâmico focado nos saltos de prédios.

### 3. Sincronização Dinâmica com o Tema da Aplicação (*Theme Mutation Engine*)
O jogo detecta em tempo real a preferência de cor do navegador (`data-bs-theme` ou `prefers-color-scheme`):

| Parâmetro | Modo Escuro (Dark Theme) | Modo Claro (Light Theme) |
| :--- | :--- | :--- |
| **Cenário** | 🌙 **Noite**: Céu Meia-Noite com Estrelas e Lua | ☀️ **Dia**: Céu Azul Celeste com Nuvens e Sol |
| **Gato (Avatar)** | 🐈‍⬛ **Gato Branco (`#ffffff`)** com Olhos Azuis | 🐈 **Gato Preto (`#18181b`)** com Olhos Verdes |
| **Telhados** | Slate Escuro (`#1e293b`) + Borda Esmeralda | Slate Médio (`#334155`) + Borda Esmeralda |

---

## 🌐 Deploy e Otimização para InfinityFree

Este projeto foi desenhado especificamente para hospedar em infraestruturas estáticas ou PHP com restrições de servidor (como **InfinityFree**):

1. **Zero Carga no Servidor (0% Server Impact)**: Nenhuma operação pesada roda no backend. O servidor atua estritamente enviando arquivos `.html`, `.css`, `.js` e mídias via protocolo HTTP.
2. **Armazenamento Local (*Client Storage*)**: Recordes do jogo (*High Score*) são persistidos via `localStorage.setItem('catRunnerHighScore', score)`.
3. **Compressão & Cache (`.htaccess`)**: Arquivos de mídias e código-fonte são servidos com *Headers* de cache e compressão Gzip habilitada.

---

## 📄 Licença e Contato

Desenvolvido por **Wesley Samuel Ferreira Rodrigues**.

- **Cargo**: Desenvolvedor Full Stack Júnior
- **Formação**: Bacharelado em Ciência da Computação (FPB - Prev. 2026)
- **Localização**: João Pessoa, Paraíba, Brasil
- **Contato**: [+55 83 99602-9026](tel:+5583996029026) | [wesleysamuelfr@outlook.com](mailto:wesleysamuelfr@outlook.com)
