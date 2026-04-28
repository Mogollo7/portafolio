function initLoader() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const progressBar = document.querySelector('.loading-progress-bar');
    const statusText = document.querySelector('.loading-status');
    const encryptedTextContainer = document.querySelector('.encrypted-text');
    
    // Bloquear scroll al iniciar la carga
    document.body.style.overflow = 'hidden';
    
    const targetText = "PORTAFOLIO";
    let currentProgress = 0;
    
    // SVG templates for precise injection
    const boxPSVG = `<svg class="decoration-box box-p" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M60 10.168L10.168 60H3.09668L60 3.09668V10.168ZM60 24.3105L24.3105 60H17.2383L60 17.2383V24.3105ZM60 38.4521L38.4521 60H31.3809L60 31.3809V38.4521ZM60 60H45.5234L60 45.5234V60ZM0 56.0254V48.9551L48.9551 0H56.0254L0 56.0254ZM0 41.8828V34.8125L34.8125 0H41.8828L0 41.8828ZM0 27.7412V20.6699L20.6699 0H27.7422L0 27.7412ZM0 13.5996V0H13.5996L0 13.5996Z" fill="#E35A7D"/></svg>`;
    const boxOSVG = `<svg class="decoration-box box-o" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M60 10.168L10.168 60H3.09668L60 3.09668V10.168ZM60 24.3105L24.3105 60H17.2383L60 17.2383V24.3105ZM60 38.4521L38.4521 60H31.3809L60 31.3809V38.4521ZM60 60H45.5234L60 45.5234V60ZM0 56.0254V48.9551L48.9551 0H56.0254L0 56.0254ZM0 41.8828V34.8125L34.8125 0H41.8828L0 41.8828ZM0 27.7412V20.6699L20.6699 0H27.7422L0 27.7412ZM0 13.5996V0H13.5996L0 13.5996Z" fill="#E35A7D"/></svg>`;

    // Static text with embedded SVGs
    encryptedTextContainer.innerHTML = targetText.split('').map((char, index) => {
        if (index === 0) return `<span class="char">${char}${boxPSVG}</span>`;
        if (index === targetText.length - 1) return `<span class="char">${char}${boxOSVG}</span>`;
        return `<span class="char">${char}</span>`;
    }).join('');

    const interval = setInterval(() => {
        currentProgress += Math.random() * 8;
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            setTimeout(revealMainContent, 500);
        }

        // Update progress UI
        progressBar.style.width = `${currentProgress}%`;
        statusText.textContent = `LOADING_ASSETS... ${Math.floor(currentProgress)}%`;
    }, 100);

    function revealMainContent() {
        // Create tiles grid for the transition
        const grid = document.createElement('div');
        grid.id = 'tiles-grid';
        document.body.appendChild(grid);

        // Calculate tile size to ensure perfect squares
        const targetTileWidth = 60; // Desired size in px
        const cols = Math.ceil(window.innerWidth / targetTileWidth);
        const actualTileSize = window.innerWidth / cols; // Force equal width
        const rows = Math.ceil(window.innerHeight / actualTileSize);

        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rows}, ${actualTileSize}px)`;

        const totalTiles = rows * cols;
        const tiles = [];

        // Center coordinates
        const centerX = (cols - 1) / 2;
        const centerY = (rows - 1) / 2;
        const maxDist = Math.sqrt(centerX**2 + centerY**2);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.style.height = `${actualTileSize}px`;
                grid.appendChild(tile);
                
                // Calculate distance from center
                const dist = Math.sqrt((c - centerX)**2 + (r - centerY)**2);
                tiles.push({ element: tile, distance: dist });
            }
        }

        // Hide the original loading screen elements immediately
        loadingScreen.style.opacity = '0';
        
        if (mainContent) {
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = '1';
        }

        // Restaurar scroll al finalizar la carga
        document.body.style.overflow = '';

        // Animate tiles away from center to edges (Shockwave)
        const staggerFactor = 30; // ms per unit of distance
        tiles.forEach((tileObj) => {
            setTimeout(() => {
                tileObj.element.classList.add('reveal');
            }, tileObj.distance * staggerFactor);
        });

        // Cleanup
        setTimeout(() => {
            grid.remove();
            loadingScreen.remove();
        }, maxDist * staggerFactor + 1000);
    }
}

// Start when script is loaded or DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
} else {
    initLoader();
}
