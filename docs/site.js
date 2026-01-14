// Thiago Centurion Apps - Site JavaScript
// Handles dynamic content rendering and animations

let appsData = null;

// Fetch apps data
async function loadAppsData() {
    try {
        const response = await fetch('apps.json');
        appsData = await response.json();
        initializeSite();
    } catch (error) {
        console.error('Failed to load apps data:', error);
        // Fallback for local testing without server
        appsData = {
            brand: {
                name: "Thiago Centurion Apps",
                tagline: "Premium mobile experiences built for speed and polish."
            },
            apps: []
        };
        initializeSite();
    }
}

// Initialize site with data
function initializeSite() {
    // Set brand name in nav and footer
    document.getElementById('brand-name').textContent = appsData.brand.name;
    document.getElementById('footer-brand').textContent = appsData.brand.name;

    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Render featured app
    renderFeaturedApp();

    // Render apps grid
    renderAppsGrid();

    // Initialize animations
    initializeScrollAnimations();

    // Initialize tilt effect on featured card
    initializeTiltEffect();
}

// Render featured app showcase
function renderFeaturedApp() {
    const featuredContainer = document.getElementById('featured-app');

    // Find first live app, or fallback to first app
    let featuredApp = appsData.apps.find(app => app.status === 'live');
    if (!featuredApp && appsData.apps.length > 0) {
        featuredApp = appsData.apps[0];
    }

    if (!featuredApp) {
        featuredContainer.innerHTML = '';
        return;
    }

    const isLive = featuredApp.status === 'live';
    const buttonText = isLive ? 'View on App Store' : 'App Store (soon)';

    featuredContainer.innerHTML = `
        <div class="glass-card rounded-3xl overflow-hidden tilt-card" id="tilt-target">
            <div class="p-8 sm:p-12 bg-gradient-to-br from-${getAccentColor(featuredApp.accent)}/20 to-transparent">
                <div class="flex items-start justify-between mb-6">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradientClasses(featuredApp.iconType)}"></div>
                            ${featuredApp.badge ? `<span class="px-3 py-1 text-xs font-semibold rounded-full ${isLive ? 'status-badge-live' : 'status-badge-soon'}">${featuredApp.badge}</span>` : ''}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        ${featuredApp.platforms.map(platform =>
                            `<span class="px-3 py-1 text-xs font-medium rounded-lg bg-white/5 border border-white/10">${platform}</span>`
                        ).join('')}
                    </div>
                </div>

                <h3 class="text-4xl font-bold mb-3">${featuredApp.name}</h3>
                <p class="text-xl text-gray-400 mb-8">${featuredApp.subtitle}</p>

                <div class="grid grid-cols-2 gap-3 mb-8">
                    ${featuredApp.highlights.slice(0, 4).map(highlight => `
                        <div class="glass-card rounded-xl p-4 text-center">
                            <div class="text-sm font-medium">${highlight}</div>
                        </div>
                    `).join('')}
                </div>

                <a href="${featuredApp.appStoreUrl}" class="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-red-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105">
                    ${buttonText}
                </a>
            </div>
        </div>
    `;
}

// Render apps grid
function renderAppsGrid() {
    const gridContainer = document.getElementById('apps-grid');

    if (appsData.apps.length === 0) {
        gridContainer.innerHTML = '<p class="text-gray-500 text-center col-span-full">No apps available yet.</p>';
        return;
    }

    gridContainer.innerHTML = appsData.apps.map(app => {
        const isLive = app.status === 'live';
        const buttonText = isLive ? 'View on App Store' : 'App Store (soon)';

        return `
            <div class="glass-card rounded-2xl p-6 hover:bg-white/5 transition-all reveal">
                <div class="flex items-start justify-between mb-4">
                    <div class="w-14 h-14 rounded-xl bg-gradient-to-br ${getGradientClasses(app.iconType)}"></div>
                    <span class="px-3 py-1 text-xs font-semibold rounded-full ${isLive ? 'status-badge-live' : 'status-badge-soon'}">
                        ${isLive ? 'Live' : 'Coming Soon'}
                    </span>
                </div>

                <h3 class="text-2xl font-bold mb-2">${app.name}</h3>
                <p class="text-gray-400 mb-4">${app.subtitle}</p>

                <div class="flex flex-wrap gap-2 mb-6">
                    ${app.platforms.map(platform =>
                        `<span class="px-2 py-1 text-xs font-medium rounded-md bg-white/5 border border-white/10">${platform}</span>`
                    ).join('')}
                </div>

                <div class="space-y-2 mb-6">
                    ${app.highlights.slice(0, 4).map(highlight => `
                        <div class="flex items-center gap-2 text-sm text-gray-400">
                            <svg class="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                            <span>${highlight}</span>
                        </div>
                    `).join('')}
                </div>

                <a href="${app.appStoreUrl}" class="block w-full text-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all">
                    ${buttonText}
                </a>
            </div>
        `;
    }).join('');
}

// Initialize scroll-based reveal animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(element => {
        observer.observe(element);
    });
}

// Initialize subtle tilt effect on featured card
function initializeTiltEffect() {
    const tiltCard = document.getElementById('tilt-target');
    if (!tiltCard) return;

    tiltCard.addEventListener('mousemove', (e) => {
        const rect = tiltCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;

        tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
        tiltCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
}

// Helper: Get Tailwind accent color class
function getAccentColor(hexColor) {
    // Map hex colors to Tailwind color names (simplified)
    const colorMap = {
        '#EF4444': 'red-500',
        '#8B5CF6': 'purple-500',
        '#3B82F6': 'blue-500',
        '#10B981': 'green-500',
        '#F59E0B': 'amber-500',
    };
    return colorMap[hexColor] || 'purple-500';
}

// Helper: Get gradient classes for icon
function getGradientClasses(iconType) {
    const gradientMap = {
        'gradient-red': 'from-red-500 to-pink-600',
        'gradient-purple': 'from-purple-500 to-indigo-600',
        'gradient-blue': 'from-blue-500 to-cyan-600',
        'gradient-green': 'from-green-500 to-emerald-600',
        'gradient-amber': 'from-amber-500 to-orange-600',
    };
    return gradientMap[iconType] || 'from-purple-500 to-pink-600';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadAppsData);
