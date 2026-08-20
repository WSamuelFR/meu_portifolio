/**
 * ============================================================================
 * ENGINE DO JOGO - TELHADO FELINO (ROOFTOP CAT ENDLESS RUNNER)
 * ============================================================================
 * Desenvolvido em JavaScript Puríssimo (ES6+ Class) + HTML5 Canvas
 * Execução 100% Client-Side (0% de carga no servidor)
 * 
 * Funcionalidades:
 * - Sistema de 7 Vidas com indicador no HUD
 * - Pulos simples e pulos duplos com física realista de gravidade
 * - Geração procedural de telhados com vãos (gaps)
 * - Obstáculos com colisão AABB: Antenas, Chaminés, Falcões e Cobras
 * - Item coletável raro: Pombo (+1 Vida ou +100 Pontos)
 * - Alternância automática de tema:
 *   - Modo Escuro: Gato Branco em cenário Noturno com Lua e Estrelas
 *   - Modo Claro: Gato Preto em cenário Diurno com Sol e Nuvens
 * - Escalonamento de velocidade progressivo a cada 500 pontos
 * - Recorde salvo no localStorage
 * ============================================================================
 */

class RooftopCatGame {
    /**
     * Construtor da classe principal do jogo.
     * Inicializa dimensões, estado de jogo, atributos do jogador e eventos.
     * @param {string} canvasId - ID do elemento HTML5 Canvas
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        // Resolução interna fixa do Canvas (proporção 2:1)
        this.width = 800;
        this.height = 400;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Estados Globais do Jogo (START, PLAYING, PAUSED, GAMEOVER)
        this.state = 'START';
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('catRunnerHighScore') || '0', 10);
        this.speedBase = 4.5;
        this.currentSpeed = this.speedBase;

        // Configuração do Sistema de Áudio Retrô (Web Audio API)
        this.soundEnabled = localStorage.getItem('catRunnerSoundEnabled') !== 'false';
        this.audioCtx = null;
        this.lastSpeedMilestone = 0;

        // Propriedades Físicas e Atributos do Personagem (Gato)
        this.cat = {
            x: 100,
            y: 200,
            width: 38,
            height: 32,
            vy: 0,                   // Velocidade vertical
            gravity: 0.55,           // Força da gravidade equilibrada
            jumpForce: -11.2,        // Impulso de pulo único ajustado
            jumpsMax: 1,             // Pulo único (somente no telhado)
            jumpsLeft: 1,            // Pulo disponível ao tocar o solo
            isGrounded: false,       // Indica se o gato está pisando em um telhado
            lives: 7,                // Total de vidas iniciais
            maxLives: 7,             // Limite máximo de vidas acumuláveis
            invulnerableTimer: 0,    // Tempo de invulnerabilidade após sofrer dano (em quadros)
            legFrame: 0              // Animação de corrida das patas
        };

        // Arrays de Objetos do Mundo
        this.rooftops = [];
        this.obstacles = [];
        this.collectibles = [];
        this.floatingTexts = [];
        this.stars = [];
        this.clouds = [];

        // Inicializa elementos decorativos, controles e UI do som
        this.initStars();
        this.initClouds();
        this.bindControls();
        this.updateSoundButtonsUI();
    }

    /**
     * Inicializa ou retoma o contexto de áudio do navegador (Web Audio API).
     */
    initAudio() {
        if (!this.audioCtx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.audioCtx = new AudioCtx();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    /**
     * Alterna o estado de som (Ligado / Desligado) e salva no localStorage.
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('catRunnerSoundEnabled', this.soundEnabled.toString());
        if (this.soundEnabled) this.initAudio();
        this.updateSoundButtonsUI();
    }

    /**
     * Atualiza o visual dos botões de áudio no HUD e na tela sobreposta.
     */
    updateSoundButtonsUI() {
        const hudBtn = document.getElementById('hudSoundBtn');
        const overlayIcon = document.getElementById('overlaySoundIcon');
        const overlayText = document.getElementById('overlaySoundText');

        if (hudBtn) {
            hudBtn.innerHTML = this.soundEnabled ? 
                '<i class="fa-solid fa-volume-high"></i>' : 
                '<i class="fa-solid fa-volume-xmark text-muted"></i>';
        }

        if (overlayIcon && overlayText) {
            overlayIcon.className = this.soundEnabled ? 'fa-solid fa-volume-high me-2' : 'fa-solid fa-volume-xmark me-2 text-muted';
            overlayText.innerText = this.soundEnabled ? 'SOM: LIGADO' : 'SOM: DESLIGADO';
        }
    }

    /**
     * Sintetiza o som retrô 8-bit de pulo (Varredura ascendente de frequência).
     */
    playJumpSound() {
        if (!this.soundEnabled) return;
        this.initAudio();
        if (!this.audioCtx) return;

        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'square';
            const now = this.audioCtx.currentTime;
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) {}
    }

    /**
     * Sintetiza o som de arpejo de moeda/powerup ao pegar o pombo raro.
     */
    playCollectSound() {
        if (!this.soundEnabled) return;
        this.initAudio();
        if (!this.audioCtx) return;

        try {
            const now = this.audioCtx.currentTime;
            const osc1 = this.audioCtx.createOscillator();
            const gain1 = this.audioCtx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(659.25, now); // Nota E5
            gain1.gain.setValueAtTime(0.15, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc1.connect(gain1);
            gain1.connect(this.audioCtx.destination);
            osc1.start(now);
            osc1.stop(now + 0.1);

            const osc2 = this.audioCtx.createOscillator();
            const gain2 = this.audioCtx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(987.77, now + 0.08); // Nota B5
            gain2.gain.setValueAtTime(0.15, now + 0.08);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
            osc2.connect(gain2);
            gain2.connect(this.audioCtx.destination);
            osc2.start(now + 0.08);
            osc2.stop(now + 0.22);
        } catch (e) {}
    }

    /**
     * Sintetiza o som retrô de dano ao colidir com um obstáculo.
     */
    playHurtSound() {
        if (!this.soundEnabled) return;
        this.initAudio();
        if (!this.audioCtx) return;

        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sawtooth';
            const now = this.audioCtx.currentTime;
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.2);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) {}
    }

    /**
     * Sintetiza a melodia 8-bit descendente de Game Over.
     */
    playGameOverSound() {
        if (!this.soundEnabled) return;
        this.initAudio();
        if (!this.audioCtx) return;

        try {
            const notes = [392, 329.63, 261.63]; // Notas G4, E4, C4
            const now = this.audioCtx.currentTime;
            notes.forEach((freq, idx) => {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.type = 'square';
                const noteTime = now + idx * 0.14;
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0.15, noteTime);
                gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.14);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 0.14);
            });
        } catch (e) {}
    }

    /**
     * Sintetiza a vinheta de aceleração ao atingir 500 pontos.
     */
    playSpeedUpSound() {
        if (!this.soundEnabled) return;
        this.initAudio();
        if (!this.audioCtx) return;

        try {
            const notes = [523.25, 659.25, 783.99]; // Notas C5, E5, G5
            const now = this.audioCtx.currentTime;
            notes.forEach((freq, idx) => {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.type = 'sine';
                const noteTime = now + idx * 0.08;
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0.12, noteTime);
                gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.1);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 0.1);
            });
        } catch (e) {}
    }

    /**
     * Verifica se o navegador/sistema está utilizando o Modo Escuro.
     * @returns {boolean} True se for tema escuro, False se for claro.
     */
    isDarkMode() {
        const themeAttr = document.documentElement.getAttribute('data-bs-theme');
        if (themeAttr) return themeAttr === 'dark';
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * Gera posições aleatórias para as estrelas do cenário noturno.
     */
    initStars() {
        this.stars = [];
        for (let i = 0; i < 40; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.height * 0.5),
                size: Math.random() * 2 + 0.5,
                alpha: Math.random()
            });
        }
    }

    /**
     * Gera nuvens decorativas para o cenário diurno.
     */
    initClouds() {
        this.clouds = [];
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.width,
                y: 15 + Math.random() * 80,
                speed: 0.3 + Math.random() * 0.4,
                scale: 0.8 + Math.random() * 0.5
            });
        }
    }

    /**
     * Associa os eventos de teclado, toque e cliques dos botões da interface.
     */
    bindControls() {
        // Desbloqueio global de áudio no primeiro toque/clique em telas sensíveis ao toque (iOS/Android)
        const unlockAudio = () => {
            this.initAudio();
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('touchend', unlockAudio);
            window.removeEventListener('click', unlockAudio);
        };
        window.addEventListener('touchstart', unlockAudio, { passive: true });
        window.addEventListener('touchend', unlockAudio, { passive: true });
        window.addEventListener('click', unlockAudio, { passive: true });

        const handleAction = () => {
            this.initAudio();
            if (this.state === 'PLAYING') {
                this.jump();
            } else if (this.state === 'START' || this.state === 'GAMEOVER') {
                this.startGame();
            }
        };

        // Eventos Globais de Teclado
        window.addEventListener('keydown', (e) => {
            if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
                e.preventDefault();
                handleAction();
            }
        });

        // Eventos de Clique / Toque no Canvas
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleAction();
        });

        let lastTouchTime = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.cancelable) e.preventDefault();
            const now = Date.now();
            if (now - lastTouchTime < 50) return; // Evita disparo duplo
            lastTouchTime = now;
            handleAction();
        }, { passive: false });

        // Botões de Interface HTML
        const startBtn = document.getElementById('startGameBtn');
        const restartBtn = document.getElementById('restartGameBtn');
        const mobileJumpBtn = document.getElementById('mobileJumpBtn');
        const hudSoundBtn = document.getElementById('hudSoundBtn');
        const overlaySoundBtn = document.getElementById('overlaySoundBtn');

        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.startGame();
            });
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.startGame();
            });
        }

        if (mobileJumpBtn) {
            let lastJumpTouch = 0;
            mobileJumpBtn.addEventListener('touchstart', (e) => {
                if (e.cancelable) e.preventDefault();
                const now = Date.now();
                if (now - lastJumpTouch < 50) return;
                lastJumpTouch = now;
                handleAction();
            }, { passive: false });

            mobileJumpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const now = Date.now();
                if (now - lastJumpTouch < 300) return; // Ignora clique sintetizado se touchstart já disparou
                handleAction();
            });
        }

        if (hudSoundBtn) {
            hudSoundBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSound();
            });
            hudSoundBtn.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            }, { passive: true });
        }

        if (overlaySoundBtn) {
            overlaySoundBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSound();
            });
            overlaySoundBtn.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            }, { passive: true });
        }
    }

    /**
     * Inicia ou reinicia uma nova partida.
     */
    startGame() {
        this.initAudio();
        this.state = 'PLAYING';
        this.score = 0;
        this.lastSpeedMilestone = 0;
        this.currentSpeed = this.speedBase;

        // Reseta atributos do Gato
        this.cat.x = 100;
        this.cat.y = 200;
        this.cat.vy = 0;
        this.cat.lives = 7;
        this.cat.jumpsLeft = 1;
        this.cat.isGrounded = false;
        this.cat.invulnerableTimer = 0;

        // Limpa os elementos do mundo
        this.rooftops = [];
        this.obstacles = [];
        this.collectibles = [];
        this.floatingTexts = [];

        // Cria o telhado inicial contínuo onde o gato começa
        this.rooftops.push({
            x: 0,
            y: 280,
            width: 450,
            height: 150
        });

        // Preenche a tela inicial com telhados subsequentes
        let currentX = 450;
        while (currentX < this.width + 500) {
            currentX = this.generateRooftop(currentX);
        }

        // Esconde a tela de overlay (menu/gameover)
        const overlay = document.getElementById('gameOverlayScreen');
        if (overlay) overlay.classList.add('hidden');

        this.updateHUD();
    }

    /**
     * Algoritmo procedural para geração de novos prédios e obstáculos no caminho.
     * @param {number} startX - Posição horizontal X onde o novo prédio começará
     * @returns {number} Posição X final do prédio gerado
     */
    generateRooftop(startX) {
        const gap = 55 + Math.random() * 35;       // Vão equilibrado (55px a 90px max)
        const width = 180 + Math.random() * 200;   // Largura confortável do telhado
        const y = 260 + Math.random() * 45;        // Altura Y do topo do prédio

        const roof = {
            x: startX + gap,
            y: y,
            width: width,
            height: 200
        };

        this.rooftops.push(roof);

        // Geração de Obstáculos de Chão (Antena, Chaminé, Cobra)
        if (Math.random() < 0.55) {
            const groundTypes = ['antenna', 'chimney', 'snake'];
            const type = groundTypes[Math.floor(Math.random() * groundTypes.length)];

            if (type === 'antenna') {
                this.obstacles.push({
                    type: 'antenna',
                    x: roof.x + 45 + Math.random() * Math.max(10, roof.width - 90),
                    y: roof.y - 42,
                    width: 28,
                    height: 42
                });
            } else if (type === 'chimney') {
                this.obstacles.push({
                    type: 'chimney',
                    x: roof.x + 45 + Math.random() * Math.max(10, roof.width - 90),
                    y: roof.y - 38,
                    width: 32,
                    height: 38
                });
            } else if (type === 'snake') {
                this.obstacles.push({
                    type: 'snake',
                    x: roof.x + 45 + Math.random() * Math.max(10, roof.width - 90),
                    y: roof.y - 20,
                    width: 26,
                    height: 20
                });
            }
        }

        // FALCÃO RARO (Estilo Pterodáctilo Chrome Dino: Só aparece após 350 pontos!)
        if (this.score >= 350 && Math.random() < 0.12) {
            this.obstacles.push({
                type: 'falcon',
                x: roof.x + roof.width / 2,
                y: 110 + Math.random() * 70, // Voo aéreo
                width: 38,
                height: 30
            });
        }

        // POMBO RARO VOANDO NO CÉU (+1 Vida)
        if (Math.random() < 0.10) {
            this.collectibles.push({
                type: 'pigeon',
                x: roof.x + roof.width / 2,
                y: 110 + Math.random() * 60, // Pombo voando no alto do céu
                width: 28,
                height: 28,
                floatOffset: Math.random() * Math.PI * 2
            });
        }

        return roof.x + roof.width;
    }

    /**
     * Executa a ação de pulo (Permitido SOMENTE quando o gato está sobre o telhado).
     */
    jump() {
        if (this.cat.isGrounded) {
            this.cat.vy = this.cat.jumpForce;
            this.cat.isGrounded = false;
            this.playJumpSound();
        }
    }

    /**
     * Atualização lógica da física, movimentação de objetos e checagem de colisões.
     */
    update() {
        if (this.state !== 'PLAYING') return;

        // Incrementa pontuação e escala a velocidade a cada 500 pontos
        this.score++;
        this.currentSpeed = this.speedBase + Math.floor(this.score / 500) * 0.6;

        // Toca vinheta sonora ao atingir múltiplos de 500 pontos
        const milestone = Math.floor(this.score / 500);
        if (milestone > this.lastSpeedMilestone) {
            this.lastSpeedMilestone = milestone;
            this.playSpeedUpSound();
        }

        // Aplicação da física no gato (Velocidade Y + Gravidade)
        this.cat.vy += this.cat.gravity;
        this.cat.y += this.cat.vy;

        // Decrementa tempo de invulnerabilidade
        if (this.cat.invulnerableTimer > 0) {
            this.cat.invulnerableTimer--;
        }

        // Atualiza ciclo da animação das patinhas
        this.cat.legFrame = (this.cat.legFrame + 0.25) % 4;

        // Movimentação das nuvens no modo diurno
        this.clouds.forEach(c => {
            c.x -= c.speed;
            if (c.x < -100) c.x = this.width + 50;
        });

        // Movimentação dos Telhados e Verificação de Colisão com o Solo
        this.cat.isGrounded = false;
        for (let i = 0; i < this.rooftops.length; i++) {
            const roof = this.rooftops[i];
            roof.x -= this.currentSpeed;

            // Checagem se o gato pousou sobre a superfície superior do prédio
            if (this.cat.x + this.cat.width > roof.x &&
                this.cat.x < roof.x + roof.width &&
                this.cat.y + this.cat.height >= roof.y &&
                this.cat.y + this.cat.height <= roof.y + 16 &&
                this.cat.vy >= 0) {

                this.cat.y = roof.y - this.cat.height;
                this.cat.vy = 0;
                this.cat.isGrounded = true;
            }
        }

        // Queda em vãos livres entre telhados (Game Over)
        if (this.cat.y > this.height + 20) {
            this.gameOver("Queda do Telhado!");
            return;
        }

        // Geração contínua de telhados conforme o jogador avança
        const lastRoof = this.rooftops[this.rooftops.length - 1];
        if (lastRoof && lastRoof.x + lastRoof.width < this.width + 200) {
            this.generateRooftop(lastRoof.x + lastRoof.width);
        }

        // Remove telhados que já saíram da tela à esquerda
        this.rooftops = this.rooftops.filter(r => r.x + r.width > -100);

        // Movimentação de Obstáculos e Checagem de Impacto
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.x -= (obs.type === 'falcon' ? this.currentSpeed + 1.2 : this.currentSpeed);

            if (this.checkCollision(this.cat, obs)) {
                if (this.cat.invulnerableTimer <= 0) {
                    this.cat.lives--;
                    this.cat.invulnerableTimer = 60; // 1 segundo de piscada invulnerável
                    this.playHurtSound();
                    this.addFloatingText("-1 VIDA!", this.cat.x, this.cat.y - 20, '#ef4444');

                    if (this.cat.lives <= 0) {
                        this.gameOver("Suas vidas acabaram!");
                        return;
                    }
                }
            }

            if (obs.x + obs.width < -50) {
                this.obstacles.splice(i, 1);
            }
        }

        // Coleta de Itens Raros (Pombos Voadores)
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const col = this.collectibles[i];
            col.x -= this.currentSpeed;
            // Efeito suave de voo/flutuação do pombo
            col.y += Math.sin(Date.now() * 0.005 + (col.floatOffset || 0)) * 0.35;

            if (this.checkCollision(this.cat, col)) {
                this.playCollectSound();
                if (this.cat.lives < this.cat.maxLives) {
                    this.cat.lives = Math.min(this.cat.maxLives, this.cat.lives + 1);
                    this.addFloatingText("+1 VIDA! 🐦", this.cat.x, this.cat.y - 20, '#10b981');
                } else {
                    this.addFloatingText("+100 PTS! 🐦", this.cat.x, this.cat.y - 20, '#38bdf8');
                    this.score += 100;
                }
                this.collectibles.splice(i, 1);
                continue;
            }

            if (col.x + col.width < -50) {
                this.collectibles.splice(i, 1);
            }
        }

        // Animação de textos flutuantes (+1 VIDA, -1 VIDA, etc)
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y -= 1;
            ft.alpha -= 0.02;
            if (ft.alpha <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }

        this.updateHUD();
    }

    /**
     * Algoritmo de Colisão AABB (Axis-Aligned Bounding Box) entre dois retângulos.
     * @param {Object} rect1 - Primeiro objeto com x, y, width, height
     * @param {Object} rect2 - Segundo objeto com x, y, width, height
     * @returns {boolean} True se houver sobreposição, False caso contrário.
     */
    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    /**
     * Adiciona uma notificação de texto animado sobre o personagem.
     */
    addFloatingText(text, x, y, color) {
        this.floatingTexts.push({ text, x, y, color, alpha: 1.0 });
    }

    /**
     * Atualiza os elementos visuais de pontuação e corações no painel HUD.
     */
    updateHUD() {
        const livesContainer = document.getElementById('hudLivesContainer');
        const scoreElem = document.getElementById('hudScoreNum');
        const speedElem = document.getElementById('hudSpeedNum');

        if (livesContainer) {
            let heartsHTML = '';
            for (let i = 0; i < this.cat.maxLives; i++) {
                if (i < this.cat.lives) {
                    heartsHTML += '<i class="fa-solid fa-heart text-danger"></i>';
                } else {
                    heartsHTML += '<i class="fa-regular fa-heart text-muted"></i>';
                }
            }
            livesContainer.innerHTML = heartsHTML;
        }

        if (scoreElem) scoreElem.innerText = this.score;
        if (speedElem) speedElem.innerText = `${(this.currentSpeed / this.speedBase).toFixed(1)}x`;
    }

    /**
     * Finaliza a partida e exibe a tela de Game Over com o resultado.
     * @param {string} reason - Motivo da derrota
     */
    gameOver(reason) {
        this.state = 'GAMEOVER';
        this.playGameOverSound();
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('catRunnerHighScore', this.highScore.toString());
        }

        const overlay = document.getElementById('gameOverlayScreen');
        const titleElem = document.getElementById('overlayTitle');
        const msgElem = document.getElementById('overlayMessage');

        if (overlay) overlay.classList.remove('hidden');
        if (titleElem) titleElem.innerText = 'FIM DE JOGO!';
        if (msgElem) {
            msgElem.innerHTML = `
                <p class="mb-1 text-danger fw-bold">${reason}</p>
                <p class="mb-1 fs-5">Pontuação Final: <strong class="text-emerald">${this.score}</strong></p>
                <p class="small text-muted">Melhor Recorde: <strong>${this.highScore}</strong></p>
            `;
        }
    }

    /**
     * Renderiza todos os elementos visuais no Canvas a cada quadro.
     */
    draw() {
        const isDark = this.isDarkMode();
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (isDark) {
            // MODO NOTURNO: Céu Noturno + Estrelas + Lua
            const nightGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
            nightGrad.addColorStop(0, '#090d16');
            nightGrad.addColorStop(0.7, '#1e293b');
            nightGrad.addColorStop(1, '#0f172a');
            this.ctx.fillStyle = nightGrad;
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Estrelas cintilantes
            this.ctx.fillStyle = '#ffffff';
            this.stars.forEach(s => {
                this.ctx.globalAlpha = s.alpha;
                this.ctx.fillRect(s.x, s.y, s.size, s.size);
            });
            this.ctx.globalAlpha = 1.0;

            // Lua prateada com brilho
            this.ctx.fillStyle = '#fef08a';
            this.ctx.beginPath();
            this.ctx.arc(720, 60, 24, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // MODO DIURNO: Céu Azul Ensolarado + Sol + Nuvens
            const dayGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
            dayGrad.addColorStop(0, '#38bdf8');
            dayGrad.addColorStop(0.7, '#bae6fd');
            dayGrad.addColorStop(1, '#e0f2fe');
            this.ctx.fillStyle = dayGrad;
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Sol Amarelo Reluzente
            this.ctx.fillStyle = '#facc15';
            this.ctx.beginPath();
            this.ctx.arc(700, 65, 30, 0, Math.PI * 2);
            this.ctx.fill();

            // Nuvens Brancas Flutuantes
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            this.clouds.forEach(c => {
                this.drawCloud(c.x, c.y, c.scale);
            });
        }

        // Renderização dos Prédios / Telhados
        this.rooftops.forEach(roof => {
            this.ctx.fillStyle = isDark ? '#1e293b' : '#334155';
            this.ctx.fillRect(roof.x, roof.y, roof.width, roof.height);

            // Linha superior de destaque do telhado
            this.ctx.fillStyle = isDark ? '#10b981' : '#059669';
            this.ctx.fillRect(roof.x, roof.y, roof.width, 4);

            // Janelas Iluminadas dos Prédios
            this.ctx.fillStyle = '#fef08a';
            for (let wx = roof.x + 20; wx < roof.x + roof.width - 20; wx += 35) {
                for (let wy = roof.y + 20; wy < roof.y + roof.height - 20; wy += 40) {
                    if ((Math.floor(wx) + Math.floor(wy)) % 3 === 0) {
                        this.ctx.globalAlpha = isDark ? 0.6 : 0.85;
                        this.ctx.fillRect(wx, wy, 14, 18);
                    }
                }
            }
            this.ctx.globalAlpha = 1.0;
        });

        // Renderização do Pombo Raro
        this.collectibles.forEach(col => {
            this.ctx.font = '28px sans-serif';
            this.ctx.fillText('🐦', col.x, col.y + 24);
        });

        // Renderização dos Obstáculos (Tamanhos Ampliados)
        this.obstacles.forEach(obs => {
            if (obs.type === 'antenna') {
                this.ctx.font = '36px sans-serif';
                this.ctx.fillText('📡', obs.x, obs.y + 36);
            } else if (obs.type === 'chimney') {
                this.ctx.font = '34px sans-serif';
                this.ctx.fillText('🏭', obs.x, obs.y + 34);
            } else if (obs.type === 'falcon') {
                this.ctx.font = '34px sans-serif';
                this.ctx.fillText('🦅', obs.x, obs.y + 26);
            } else if (obs.type === 'snake') {
                this.ctx.font = '26px sans-serif';
                this.ctx.fillText('🐍', obs.x, obs.y + 19);
            }
        });

        // Renderização do Personagem (Gato Branco no Escuro / Gato Preto no Claro)
        if (this.cat.invulnerableTimer % 6 < 3) {
            this.drawCat(this.cat.x, this.cat.y, isDark);
        }

        // Renderização das Mensagens Flutuantes
        this.floatingTexts.forEach(ft => {
            this.ctx.fillStyle = ft.color;
            this.ctx.globalAlpha = ft.alpha;
            this.ctx.font = 'bold 15px sans-serif';
            this.ctx.fillText(ft.text, ft.x, ft.y);
        });
        this.ctx.globalAlpha = 1.0;
    }

    /**
     * Desenha uma nuvem decorativa em formato vetorial.
     */
    drawCloud(x, y, scale) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(scale, scale);
        this.ctx.beginPath();
        this.ctx.arc(20, 20, 18, 0, Math.PI * 2);
        this.ctx.arc(40, 15, 22, 0, Math.PI * 2);
        this.ctx.arc(60, 20, 18, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    /**
     * Desenha o personagem (Gato Felino) em formato vetorial 2D.
     * Alterna as cores de acordo com o tema ativo:
     * - Modo Escuro: Gato Branco (`#ffffff`) com orelhas rosadas e olhos azuis
     * - Modo Claro: Gato Preto (`#18181b`) com olhos verdes
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {boolean} isDark - Flag do Modo Escuro
     */
    drawCat(x, y, isDark) {
        this.ctx.save();
        this.ctx.translate(x, y);

        const bodyColor = isDark ? '#ffffff' : '#18181b';
        const earColor = isDark ? '#f472b6' : '#27272a';
        const eyeColor = isDark ? '#38bdf8' : '#34d399';
        const legColor = isDark ? '#e2e8f0' : '#27272a';

        // Corpo do Gato
        this.ctx.fillStyle = bodyColor;
        this.ctx.beginPath();
        this.ctx.ellipse(18, 18, 16, 11, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Cabeça do Gato
        this.ctx.beginPath();
        this.ctx.arc(28, 12, 10, 0, Math.PI * 2);
        this.ctx.fill();

        // Orelhas Triangulares
        this.ctx.fillStyle = earColor;
        this.ctx.beginPath();
        this.ctx.moveTo(22, 5);
        this.ctx.lineTo(26, 0);
        this.ctx.lineTo(28, 6);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(30, 5);
        this.ctx.lineTo(34, 1);
        this.ctx.lineTo(35, 7);
        this.ctx.fill();

        // Olhos Brilhantes
        this.ctx.fillStyle = eyeColor;
        this.ctx.beginPath();
        this.ctx.arc(31, 10, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = isDark ? '#0f172a' : '#000000';
        this.ctx.beginPath();
        this.ctx.arc(32, 10, 1.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Cauda Curvada Animada
        this.ctx.strokeStyle = bodyColor;
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.moveTo(4, 16);
        this.ctx.quadraticCurveTo(-6, 8, -2, 2);
        this.ctx.stroke();

        // Patinhas em Animação de Corrida
        this.ctx.fillStyle = legColor;
        const legOffset = Math.sin(this.cat.legFrame * Math.PI) * 6;
        this.ctx.fillRect(10 + legOffset, 26, 4, 8);
        this.ctx.fillRect(22 - legOffset, 26, 4, 8);

        this.ctx.restore();
    }

    /**
     * Loop infinito da animação via requestAnimationFrame.
     */
    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    /**
     * Inicializador do jogo.
     */
    init() {
        this.loop();
    }
}

// Inicializa automaticamente a instância do jogo assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const game = new RooftopCatGame('gameCanvas');
    game.init();
});
