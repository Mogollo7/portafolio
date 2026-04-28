document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-btn');
    const langToggle = document.getElementById('lang-btn');
    const body = document.body;
    const moonIcon = document.querySelector('.moon-icon');
    const sunIcon = document.querySelector('.sun-icon');
    const langText = document.getElementById('lang-text');
    const navLogo = document.querySelector('.nav-logo');
    const footerLogo = document.querySelector('.footer-logo');

    // --- Theme Logic ---
    const updateIcons = (theme) => {
        if (theme === 'dark') {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
            if (navLogo) navLogo.src = 'img/logo.png';
            if (footerLogo) footerLogo.src = 'img/logo.png';
        } else {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
            if (navLogo) navLogo.src = 'img/logoClaro.png';
            if (footerLogo) footerLogo.src = 'img/logoClaro.png';
        }
    };

    // Detecta el tema del sistema UNA VEZ al cargar
    // Luego queda fijo — los cambios del OS no afectan la web
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = prefersDark ? 'dark' : 'light';
    body.setAttribute('data-theme', currentTheme);
    updateIcons(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        updateIcons(newTheme);
    });

    // --- Mobile Menu Logic ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navCenter = document.querySelector('.nav-center');
    const navLinks = document.querySelectorAll('.nav-center .nav-link');

    if (mobileMenuBtn && navCenter) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navCenter.classList.toggle('active');
            
            // Si el menú se abre, bloquear scroll del body
            if (navCenter.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Cerrar menú al hacer clic en un link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navCenter.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // --- Mobile Controls (tema + idioma en el menú) ---
    const mobileThemeBtn    = document.getElementById('mobile-theme-btn');
    const mobileLangBtnMenu = document.getElementById('mobile-lang-btn-menu');
    const mobileLangDisplay = document.getElementById('mobile-lang-display');
    const mobileMoonIcon    = document.querySelector('.mobile-moon-icon');
    const mobileSunIcon     = document.querySelector('.mobile-sun-icon');

    const syncMobileIcons = (theme) => {
        if (!mobileMoonIcon || !mobileSunIcon) return;
        mobileMoonIcon.style.display = theme === 'dark' ? 'block' : 'none';
        mobileSunIcon.style.display  = theme === 'dark' ? 'none'  : 'block';
    };

    // Sincronizar estado inicial
    syncMobileIcons(currentTheme);

    if (mobileThemeBtn) {
        mobileThemeBtn.addEventListener('click', () => {
            const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', newTheme);
            updateIcons(newTheme);
            syncMobileIcons(newTheme);
        });
    }

    if (mobileLangBtnMenu) {
        const toggleMobileLang = () => {
            const newLang = langText.textContent === 'ES' ? 'EN' : 'ES';
            langText.textContent = newLang;
            if (mobileLangDisplay) mobileLangDisplay.textContent = newLang;
            loadTranslations(newLang);
        };
        mobileLangBtnMenu.addEventListener('click', toggleMobileLang);
        // Accesibilidad: activar con teclado
        mobileLangBtnMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMobileLang(); }
        });
    }

    // --- Language Logic ---
    let translations = {};

    const loadTranslations = async (lang) => {
        try {
            const response = await fetch(`lang/${lang.toLowerCase()}.json`);
            translations = await response.json();
            applyTranslations();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    };

    const applyTranslations = () => {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.innerHTML = translations[key];
            }
        });
    };

    langText.textContent = 'ES';
    loadTranslations('ES'); // Carga inicial

    langToggle.addEventListener('click', () => {
        const currentLang = langText.textContent;
        const newLang = currentLang === 'ES' ? 'EN' : 'ES';
        langText.textContent = newLang;
        loadTranslations(newLang);
        updateClock(); // Update clock format if language changes
    });

    // --- Clock Logic ---
    const clockElement = document.getElementById('clock');

    const updateClock = () => {
        const now = new Date();
        const lang = langText.textContent;

        // Day abbreviations
        const days = {
            'ES': ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'],
            'EN': ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        };

        const dayName = days[lang][now.getDay()];
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        clockElement.textContent = `${dayName} ${hours}:${minutes}`;
    };

    setInterval(updateClock, 1000); // Update every second for precision
    updateClock(); // Initial call

    // --- Navbar Auto-hide Logic ---
    const topNav = document.querySelector('.top-nav');
    let lastScrollY = window.scrollY;
    let isHoveringNav = false;
    let hideNavTimeout;

    const resetNavTimeout = () => {
        clearTimeout(hideNavTimeout);
        if (window.scrollY > 50 && !isHoveringNav) {
            hideNavTimeout = setTimeout(() => {
                topNav.classList.add('nav-hidden');
            }, 500); // Se oculta tras 2.5 segundos sin interacciÃ³n
        }
    };

    window.addEventListener('scroll', () => {
        if (isHoveringNav) return;

        if (window.scrollY > lastScrollY && window.scrollY > 50) {
            // Scrolling down
            topNav.classList.add('nav-hidden');
        } else {
            // Scrolling up
            topNav.classList.remove('nav-hidden');
            resetNavTimeout();
        }
        lastScrollY = window.scrollY;
    });

    document.addEventListener('mousemove', (e) => {
        if (e.clientY < 100) { // Si el mouse estÃ¡ cerca de la parte superior
            topNav.classList.remove('nav-hidden');
            resetNavTimeout();
        }
    });

    topNav.addEventListener('mouseenter', () => {
        isHoveringNav = true;
        topNav.classList.remove('nav-hidden');
        clearTimeout(hideNavTimeout);
    });

    topNav.addEventListener('mouseleave', () => {
        isHoveringNav = false;
        resetNavTimeout();
    });

    // Iniciar timeout al cargar la página si ya hay scroll
    resetNavTimeout();

    // --- Logo / Brand → Scroll to Top ---
    const navHomeBtn = document.getElementById('nav-home-btn');
    if (navHomeBtn) {
        navHomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Screamer Glitch Logic ---
    const screamer = document.getElementById('screamer');
    const proyectosSection = document.getElementById('proyectos');

    if (screamer && proyectosSection) {
        const screamerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    screamer.classList.add('active');
                } else {
                    screamer.classList.remove('active');
                }
            });
        }, { threshold: 0.3 }); // Trigger when 30% of #proyectos is visible

        screamerObserver.observe(proyectosSection);
    }

    // --- Dynamic UI Color Logic ---
    const targets = document.querySelectorAll('#hero, #sobre-mi, .pink-rect-proyectos, .skills-bg, .experiencia-bg, #contacto, .main-footer');

    const uiColorMap = {
        'hero': 'black',
        'sobre-mi': 'black',
        'pink-rect-proyectos': 'black',
        'skills-bg': 'white',
        'experiencia-bg': 'white',
        'contacto': 'black',
        'main-footer': 'white'
    };

    const uiObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                let key = '';

                if (target.id) key = target.id;
                else if (target.classList.contains('pink-rect-proyectos')) key = 'pink-rect-proyectos';
                else if (target.classList.contains('skills-bg')) key = 'skills-bg';
                else if (target.classList.contains('experiencia-bg')) key = 'experiencia-bg';
                else if (target.classList.contains('main-footer')) key = 'main-footer';

                if (key && uiColorMap[key]) {
                    body.setAttribute('data-ui-color', uiColorMap[key]);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "-10% 0px -10% 0px"
    });

    targets.forEach(target => uiObserver.observe(target));

    // --- Proyectos Carousel Logic ---
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const totalCards = document.querySelectorAll('.proyecto-card').length;

        const updateCarousel = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentIndex = index;
        };

        nextBtn.addEventListener('click', () => {
            let nextIndex = (currentIndex + 1) % totalCards;
            updateCarousel(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel(prevIndex);
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => updateCarousel(i));
        });
    }

    // --- EmailJS Integration ---
    (function() {
        emailjs.init("_o09Qk-oN4IKjOs27");
    })();
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const btnText = btn.querySelector('.btn-text');
            const originalText = btnText.innerHTML;

            const sendingText = langText.textContent === 'ES' ? 'ENVIANDO...' : 'SENDING...';
            const sentText = langText.textContent === 'ES' ? '¡ENVIADO!' : 'SENT!';
            const errorText = langText.textContent === 'ES' ? 'ERROR' : 'ERROR';

            btnText.textContent = sendingText;
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            // Usamos el service_2eailip y template_0rbq8if proporcionados
            emailjs.sendForm('service_2eailip', 'template_0rbq8if', contactForm)
                .then(() => {
                    btnText.textContent = sentText;
                    contactForm.reset();
                    setTimeout(() => {
                        btnText.innerHTML = originalText;
                        btn.style.opacity = '1';
                        btn.style.pointerEvents = 'auto';
                        applyTranslations(); // Restaurar idioma
                    }, 3000);
                }, (error) => {
                    console.error('EmailJS Error:', error);
                    btnText.textContent = errorText;
                    setTimeout(() => {
                        btnText.innerHTML = originalText;
                        btn.style.opacity = '1';
                        btn.style.pointerEvents = 'auto';
                        applyTranslations();
                    }, 3000);
                });
        });
    }
});
