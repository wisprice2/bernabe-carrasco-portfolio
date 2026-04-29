/**
 * BERNABÉ CARRASCO - CORE SCRIPTS
 * Handles Navigation, Animations, and UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Logic
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');
    let isMenuOpen = false;

    if (btn && menu) {
        function toggleMenu() {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                menu.classList.remove('opacity-0', 'pointer-events-none');
                document.body.classList.add('mobile-menu-active');
                if (line1) line1.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (line2) line2.style.opacity = '0';
                if (line3) line3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                menu.classList.add('opacity-0', 'pointer-events-none');
                document.body.classList.remove('mobile-menu-active');
                if (line1) line1.style.transform = 'none';
                if (line2) line2.style.opacity = '1';
                if (line3) line3.style.transform = 'none';
            }
        }

        btn.addEventListener('click', toggleMenu);

        const mobileLinks = menu.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) toggleMenu();
            });
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('navbar-scrolled');
                navbar.classList.remove('pt-6', 'pb-6');
            } else {
                navbar.classList.remove('navbar-scrolled');
                navbar.classList.add('pt-6', 'pb-6');
            }
        });
        // Trigger once on load
        window.dispatchEvent(new Event('scroll'));
    }

    // 3. Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => {
        observer.observe(el);
    });

    // 4. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 5. Beneficios Carousel
    const track = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (track && dots.length) {
        let current = 0;
        const total = dots.length;
        let autoplayTimer;

        function goTo(index) {
            current = ((index % total) + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => {
                d.classList.toggle('bg-white', i === current);
                d.classList.toggle('bg-white/30', i !== current);
                d.style.transform = i === current ? 'scale(1.3)' : 'scale(1)';
            });
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(next, 7000);
        }
        function stopAutoplay() {
            clearInterval(autoplayTimer);
        }

        // Arrow buttons
        if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });

        // Dot buttons
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goTo(parseInt(dot.dataset.index));
                startAutoplay();
            });
        });

        // Touch / Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? next() : prev();
            }
            startAutoplay();
        }, { passive: true });

        startAutoplay();
    }
});
