document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-item');
    const panes = document.querySelectorAll('.tab-pane');

    // Tab Switching Logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Find corresponding pane
            const targetId = tab.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            
            if (targetPane) {
                targetPane.classList.add('active');
                
                // Optional: Re-trigger animation
                targetPane.style.animation = 'none';
                targetPane.offsetHeight; // force reflow
                targetPane.style.animation = null;
            }
        });
    });

    // Copy to Clipboard Logic
    const copyButtons = document.querySelectorAll('[data-copy]');
    const toastContainer = document.getElementById('toast-container');

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
        toastContainer.appendChild(toast);

        // Remove toast after animation
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const label = btn.innerText.split('(')[0].trim();
                showToast(`${label} copiado com sucesso!`);
            }).catch(err => {
                console.error('Erro ao copiar: ', err);
                showToast('Erro ao copiar para a área de transferência.');
            });
        });
    });

    // Add some subtle mouse move effect to background shapes
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 50;
        const y = (e.clientY / window.innerHeight - 0.5) * 50;
        
        const shape1 = document.querySelector('.shape-1');
        const shape2 = document.querySelector('.shape-2');
        const shape3 = document.querySelector('.shape-3');
        
        if (shape1) shape1.style.transform = `translate(${x}px, ${y}px)`;
        if (shape2) shape2.style.transform = `translate(${-x}px, ${-y}px)`;
        if (shape3) shape3.style.transform = `translate(${y}px, ${x}px)`;
    });

    // Add a simple entrance log
    console.log("%c Portfolio - Wesley Samuel %c Loaded Successfully ", "background: #8a2be2; color: #fff; padding: 5px; border-radius: 5px 0 0 5px;", "background: #00ffff; color: #000; padding: 5px; border-radius: 0 5px 5px 0;");
});
