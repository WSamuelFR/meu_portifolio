/**
 * ============================================================================
 * JAVASCRIPT PRINCIPAL DO PORTFÓLIO - WESLEY SAMUEL FERREIRA RODRIGUES
 * ============================================================================
 * Gerencia a alternância automática de temas (Modo Escuro / Modo Claro),
 * sincronização de navegação por abas com rolagem suave, efeito interativo
 * de troca de mídia GIF ao passar o mouse sobre os cards de projetos, e
 * comportamentos da interface do usuário.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. GERENCIADOR DE TEMAS: Sincronização Automática com o Navegador / Sistema
    // =========================================================================
    const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');

    /**
     * Aplica o tema escuro ou claro na tag <html> através do atributo data-bs-theme do Bootstrap 5.
     * @param {MediaQueryListEvent|null} e - Evento de alteração de preferência do sistema
     */
    function applyBrowserTheme(e) {
        const isDark = e ? e.matches : mediaQueryDark.matches;
        const theme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-bs-theme', theme);
        console.log(`[Gerenciador de Temas] Tema aplicado com sucesso: ${theme}`);
    }

    // Aplica o tema imediatamente na inicialização da página
    applyBrowserTheme();

    // Escuta mudanças de tema em tempo real no sistema operacional/navegador
    if (mediaQueryDark.addEventListener) {
        mediaQueryDark.addEventListener('change', applyBrowserTheme);
    } else if (mediaQueryDark.addListener) {
        mediaQueryDark.addListener(applyBrowserTheme);
    }

    // =========================================================================
    // 2. NAVEGAÇÃO POR ABAS: Transição Suave de Scroll
    // =========================================================================
    const tabButtons = document.querySelectorAll('#portfolioTabs button[data-bs-toggle="tab"]');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('shown.bs.tab', () => {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                const headerElem = document.querySelector('header.header-fixed');
                const isMobile = window.innerWidth <= 768;
                const headerHeight = (headerElem && !isMobile) ? headerElem.offsetHeight : 15;
                const targetScrollTop = isMobile ? 0 : Math.max(0, offsetPosition);

                // Realiza a rolagem suave até o início do conteúdo da aba selecionada
                window.scrollTo({
                    top: targetScrollTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================================================
    // 3. GIF HOVER PREVIEW: Alternador de Imagem Estática para GIF Animado
    // =========================================================================
    const projectGifCards = document.querySelectorAll('.project-gif-card');

    projectGifCards.forEach(card => {
        const img = card.querySelector('.gif-media-container img');
        if (!img) return;

        const staticSrc = img.getAttribute('data-static') || img.src;
        const gifSrc = img.getAttribute('data-gif');

        // Troca para o GIF animado quando o mouse entra no card
        card.addEventListener('mouseenter', () => {
            if (gifSrc) {
                img.src = gifSrc;
            }
        });

        // Restaura para a imagem estática quando o mouse sai do card
        card.addEventListener('mouseleave', () => {
            if (staticSrc) {
                img.src = staticSrc;
            }
        });
    });

    // =========================================================================
    // 4. ÍCONES SOCIAIS: Elevação de Z-Index no Efeito Hover
    // =========================================================================
    const socialIcons = document.querySelectorAll('.social-expand-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.zIndex = '10';
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.zIndex = '1';
        });
    });

    // =========================================================================
    // 5. PAUSA DE VÍDEO AUTOMÁTICA AO FECHAR MODAL
    // =========================================================================
    const projectModals = document.querySelectorAll('.modal');
    projectModals.forEach(modal => {
        modal.addEventListener('hidden.bs.modal', () => {
            const videos = modal.querySelectorAll('video');
            videos.forEach(video => {
                video.pause();
            });
        });
    });

    // =========================================================================
    // 6. GERENCIADOR DO MODAL DE JOGO EXCLUSIVO PARA CELULAR
    // =========================================================================
    const mobileGameModal = document.getElementById('modalGameMobile');
    const inlineGameSlot = document.getElementById('gameContainerSlot');
    const modalGameSlot = document.getElementById('gameSlotModal');

    if (mobileGameModal && inlineGameSlot && modalGameSlot) {
        mobileGameModal.addEventListener('show.bs.modal', () => {
            while (inlineGameSlot.firstChild) {
                modalGameSlot.appendChild(inlineGameSlot.firstChild);
            }
        });

        mobileGameModal.addEventListener('hidden.bs.modal', () => {
            while (modalGameSlot.firstChild) {
                inlineGameSlot.appendChild(modalGameSlot.firstChild);
            }
        });
    }

    // Log institucional no console do desenvolvedor
    console.log(
        "%c Portfólio Executivo - Wesley Samuel %c Aplicação Carregada com Sucesso! ", 
        "background: #10b981; color: #fff; padding: 5px 10px; border-radius: 4px 0 0 4px; font-weight: bold;", 
        "background: #0f172a; color: #34d399; padding: 5px 10px; border-radius: 0 4px 4px 0; font-weight: bold;"
    );
});
