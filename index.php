<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wesley Samuel | Portfólio</title>
    <!-- Google Fonts: Inter & Outfit -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Main Style -->
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="dark-theme">
    <div class="bg-gradient-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
    </div>

    <main class="app-container">
        <!-- Navigation Tabs -->
        <nav class="glass-nav">
            <ul class="tab-list">
                <li class="tab-item active" data-tab="about">
                    <i class="fa-solid fa-user-tie"></i>
                    <span>Sobre Mim</span>
                </li>
                <li class="tab-item" data-tab="projects">
                    <i class="fa-solid fa-code"></i>
                    <span>Projetos</span>
                </li>
                <li class="tab-item" data-tab="resume">
                    <i class="fa-solid fa-file-pdf"></i>
                    <span>Currículo</span>
                </li>
            </ul>
        </nav>

        <!-- Content Area -->
        <section class="content-wrapper">
            <div id="tab-content" class="fade-in">
                <!-- Tab 1: Sobre Mim (Loaded by default) -->
                <div class="tab-pane active" id="about">
                    <div class="about-grid">
                        <!-- Hero Section -->
                        <div class="hero-card glass-card">
                            <div class="profile-header">
                                <div class="profile-img-container">
                                    <div class="profile-glow"></div>
                                    <img src="files/eu.jpg" alt="Wesley Samuel" class="profile-img">
                                </div>
                                <div class="profile-info">
                                    <h1>Wesley Samuel Ferreira Rodrigues</h1>
                                    <h2 class="typing-text">Full Stack Developer | Analista de Sistemas</h2>
                                    <p class="tagline">Graduando em Ciência da Computação (FPB)</p>
                                </div>
                            </div>
                        </div>

                        <!-- Who I Am -->
                        <div class="glass-card section-card">
                            <h3><i class="fa-solid fa-id-card"></i> Quem Sou</h3>
                            <p>
                                Profissional com experiência sólida em Gestão e Manutenção de Equipamentos de TI, atuando na resolução de problemas, suporte técnico e otimização de infraestrutura. Atualmente, foco no desenvolvimento de soluções web e mobile (PHP, Kotlin, Python) e sou graduando em Ciência da Computação pela Faculdade Internacional da Paraíba (FPB).
                            </p>
                        </div>

                        <!-- Contatos & Redes -->
                        <div class="glass-card section-card">
                            <h3><i class="fa-solid fa-address-book"></i> Contatos & Redes</h3>
                            <div class="contact-grid">
                                <a href="https://www.linkedin.com/in/wesley-samuel-ferreira-rodrigues-265aba2b4" target="_blank" class="contact-btn linkedin">
                                    <i class="fa-brands fa-linkedin"></i> LinkedIn
                                </a>
                                <a href="https://www.instagram.com/wsistemasfr" target="_blank" class="contact-btn instagram">
                                    <i class="fa-brands fa-instagram"></i> Instagram
                                </a>
                                <button class="contact-btn email shadow-btn" data-copy="wesleysamuelfr@outlook.com">
                                    <i class="fa-solid fa-envelope"></i> E-mail (Copiar)
                                </button>
                                <button class="contact-btn whatsapp shadow-btn" data-copy="83996029026">
                                    <i class="fa-brands fa-whatsapp"></i> WhatsApp (Copiar)
                                </button>
                            </div>
                        </div>

                        <!-- Skills (Moving back up as per user request to replace "O que faço" with links) -->
                        <div class="glass-card section-card skills-card">
                            <h3><i class="fa-solid fa-screwdriver-wrench"></i> Competências</h3>
                            <div class="skill-groups">
                                <div class="skill-group">
                                    <h4>Linguagens</h4>
                                    <div class="tags">
                                        <span class="tag">PHP 8.x</span>
                                        <span class="tag">JavaScript</span>
                                        <span class="tag">Kotlin</span>
                                        <span class="tag">Java</span>
                                        <span class="tag">Python</span>
                                    </div>
                                </div>
                                <div class="skill-group">
                                    <h4>Tecnologias</h4>
                                    <div class="tags">
                                        <span class="tag">MySQL / SQLite</span>
                                        <span class="tag">Git / GitHub</span>
                                        <span class="tag">Bootstrap 5</span>
                                        <span class="tag">Tailwind</span>
                                        <span class="tag">APIs REST</span>
                                    </div>
                                </div>
                                <div class="skill-group">
                                    <h4>Hardware & Infra</h4>
                                    <div class="tags">
                                        <span class="tag">Manutenção de TI</span>
                                        <span class="tag">Eletrônica (Solda)</span>
                                        <span class="tag">Redes</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Interests -->
                        <div class="glass-card section-card">
                            <h3><i class="fa-solid fa-briefcase"></i> Experiência Profissional</h3>
                            <ul class="experience-list">
                                <li>
                                    <strong>Dev Full Stack</strong> (Freelancer) 
                                    <span>2023 - Presente</span>
                                </li>
                                <li>
                                    <strong>Tely</strong> (Estagiário Op.) 
                                    <span>2025 - 2026</span>
                                </li>
                                <li>
                                    <strong>Gestão de TI</strong> (Autônomo) 
                                    <span>2021 - Presente</span>
                                </li>
                                <li>
                                    <strong>Hotel da Serra</strong> (Recepção) 
                                    <span>2021 - 2022</span>
                                </li>
                            </ul>
                        </div>

                        <!-- Education -->
                        <div class="glass-card section-card">
                            <h3><i class="fa-solid fa-graduation-cap"></i> Formação</h3>
                            <ul class="education-list">
                                <li>
                                    <strong>Bacharelado em Ciência da Computação</strong>
                                    <span>FPB (Prev. 2026)</span>
                                </li>
                                <li>
                                    <strong>Dev. Web Compacto e Completo</strong>
                                    <span>Udemy</span>
                                </li>
                                <li>
                                    <strong>Java Completo (POO)</strong>
                                    <span>Udemy (Nélio Alves)</span>
                                </li>
                            </ul>
                        </div>

                        <!-- Interests -->
                        <div class="glass-card section-card">
                            <h3><i class="fa-solid fa-heart"></i> Interesses</h3>
                            <ul class="interests-list">
                                <li><i class="fa-solid fa-code"></i> Arquitetura de Sistemas</li>
                                <li><i class="fa-solid fa-microchip"></i> Hardware & IoT</li>
                                <li><i class="fa-solid fa-brain"></i> Inteligência Artificial</li>
                                <li><i class="fa-solid fa-palette"></i> UX/UI Design</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Tab 2: Projetos -->
                <div class="tab-pane" id="projects">
                    <div class="projects-grid">
                        <!-- Projeto Kurta -->
                        <div class="glass-card project-card">
                            <div class="project-icon"><i class="fa-solid fa-hotel"></i></div>
                            <h3>WS-Hotelaria</h3>
                            <p>Sistema web de gerenciamento hoteleiro com controle de reservas, hóspedes e fluxo operacional. Arquitetura MVC e MySQL.</p>
                            <div class="project-tags">
                                <span>PHP 8.x</span>
                                <span>MySQL</span>
                                <span>Bootstrap 5</span>
                            </div>
                            <a href="https://github.com/WSamuelFR/WS-Hotelaria.git" target="_blank" class="repo-btn">
                                <i class="fa-brands fa-github"></i> Ver Repositório
                            </a>
                        </div>

                        <!-- Projeto Memorize -->
                        <div class="glass-card project-card">
                            <div class="project-icon"><i class="fa-solid fa-brain"></i></div>
                            <h3>Projeto Memorize</h3>
                            <p>Sistema interativo desenvolvido em Java SE para organização de informações via flashcards, priorizando UX e organização de código.</p>
                            <div class="project-tags">
                                <span>Java SE</span>
                                <span>Swing</span>
                            </div>
                            <a href="https://github.com/WSamuelFR/Projeto_memorize.git" target="_blank" class="repo-btn">
                                <i class="fa-brands fa-github"></i> Ver Repositório
                            </a>
                        </div>

                        <!-- PayGuardian -->
                        <div class="glass-card project-card">
                            <div class="project-icon"><i class="fa-solid fa-shield-halved"></i></div>
                            <h3>PayGuardian</h3>
                            <p>App de controle financeiro com autenticação, CRUD completo e painel administrativo responsivo. Foco em arquitetura mobile.</p>
                            <div class="project-tags">
                                <span>Kotlin</span>
                                <span>Jetpack Compose</span>
                                <span>Android</span>
                            </div>
                            <a href="https://github.com/WSamuelFR/PayGuardian.git" target="_blank" class="repo-btn">
                                <i class="fa-brands fa-github"></i> Ver Repositório
                            </a>
                        </div>

                        <!-- Movie Analytics Pro -->
                        <div class="glass-card project-card">
                            <div class="project-icon"><i class="fa-solid fa-chart-line"></i></div>
                            <h3>Movie Analytics Pro</h3>
                            <p>Análise estruturada de dados cinematográficos com consultas otimizadas, organização relacional e interface dinâmica.</p>
                            <div class="project-tags">
                                <span>Python</span>
                                <span>Pandas</span>
                                <span>Scikit-learn</span>
                            </div>
                            <a href="https://github.com/WSamuelFR/Movie-Analytics-Pro.git" target="_blank" class="repo-btn">
                                <i class="fa-brands fa-github"></i> Ver Repositório
                            </a>
                        </div>
                    </div>
                </div>
                <!-- Tab 3: Currículo -->
                <div class="tab-pane" id="resume">
                    <div class="resume-container">
                        <div class="glass-card resume-card">
                            <div class="resume-icon">
                                <i class="fa-solid fa-file-lines"></i>
                            </div>
                            <h2>Currículo Profissional</h2>
                            <p>Wesley Samuel Ferreira Rodrigues</p>
                            <div class="resume-actions">
                                <a href="files/curriculo_samuel.pdf" target="_blank" class="resume-btn view">
                                    <i class="fa-solid fa-eye"></i> Visualizar Online
                                </a>
                                <a href="files/curriculo_samuel.pdf" download="Curriculo_Wesley_Samuel.pdf" class="resume-btn download">
                                    <i class="fa-solid fa-download"></i> Baixar PDF
                                </a>
                            </div>
                        </div>
                        
                        <!-- Mini Preview / Info -->
                        <div class="glass-card resume-info-card">
                            <h3><i class="fa-solid fa-circle-info"></i> Resumo das Qualificações</h3>
                            <ul>
                                <li>Desenvolvedor Full Stack (PHP, Kotlin, Java, Python).</li>
                                <li>Especialista em Suporte Técnico e Manutenção de Hardware/Redes.</li>
                                <li>Domínio em Bancos de Dados Relacionais (MySQL, SQLite).</li>
                                <li>Foco em Automação, Sistemas de Gestão e Experiência do Usuário (UX).</li>
                            </ul>
                        </div>
                    </div>
                </div>
        </section>

        <!-- Toast Notification Container -->
        <div id="toast-container"></div>

        <!-- Footer -->
        <footer class="glass-footer">
            <p>&copy; 2026 Wesley Samuel. Criado com <i class="fa-solid fa-heart accent-color"></i> e Tecnologia.</p>
        </footer>
    </main>

    <script src="js/script.js"></script>
</body>
</html>
