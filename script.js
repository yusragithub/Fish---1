/* =========================================
   AbbioccoBakes — main.js
   ========================================= */

(function () {
    'use strict';

    /* -----------------------------------------
       Scroll-reveal
    ----------------------------------------- */
    function initReveal() {
        const els = document.querySelectorAll('.reveal');
        if (!els.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        els.forEach((el) => observer.observe(el));
    }

    /* -----------------------------------------
       Stagger children of a parent on reveal
    ----------------------------------------- */
    function initStaggerGroups() {
        document.querySelectorAll('[data-stagger]').forEach((group) => {
            const children = Array.from(group.children);
            children.forEach((child, i) => {
                child.classList.add('reveal');
                child.style.transitionDelay = `${i * 0.1}s`;
            });
        });
    }

    /* -----------------------------------------
       Smooth active nav link highlight
    ----------------------------------------- */
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        navLinks.forEach((link) => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${entry.target.id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );

        sections.forEach((s) => observer.observe(s));
    }

    /* -----------------------------------------
       Nav background on scroll
    ----------------------------------------- */
    function initNavScroll() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        const update = () => {
            nav.classList.toggle('scrolled', window.scrollY > 20);
        };

        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* -----------------------------------------
       Marquee — pause on hover
    ----------------------------------------- */
    function initMarquee() {
        const track = document.querySelector('.marquee-track');
        if (!track) return;

        const bar = track.closest('.marquee-bar');
        if (!bar) return;

        bar.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        bar.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    }

    /* -----------------------------------------
       Offering cards — subtle tilt on mousemove
    ----------------------------------------- */
    function initCardTilt() {
        document.querySelectorAll('.offering-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
                card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
                card.style.perspective = '600px';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.perspective = '';
            });
        });
    }

    /* -----------------------------------------
       Stat counters — animate up when visible
    ----------------------------------------- */
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    observer.unobserve(entry.target);

                    const el = entry.target;
                    const target = parseFloat(el.dataset.count);
                    const suffix = el.dataset.suffix || '';
                    const duration = 1200;
                    const start = performance.now();

                    const tick = (now) => {
                        const progress = Math.min((now - start) / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 3);
                        const val = Math.round(ease * target);
                        el.textContent = val + suffix;
                        if (progress < 1) requestAnimationFrame(tick);
                    };

                    requestAnimationFrame(tick);
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach((el) => observer.observe(el));
    }

    /* -----------------------------------------
       Init all
    ----------------------------------------- */
    document.addEventListener('DOMContentLoaded', () => {
        initStaggerGroups();
        initReveal();
        initActiveNav();
        initNavScroll();
        initMarquee();
        initCardTilt();
        initCounters();
    });
})();