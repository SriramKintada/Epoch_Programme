// ─── NAV SCROLL EFFECT ─────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── MOBILE HAMBURGER ──────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
    const open = navMobile.style.display === 'flex';
    navMobile.style.display = open ? 'none' : 'flex';
});

navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { navMobile.style.display = 'none'; });
});

// ─── FADE-IN ON SCROLL ─────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger sibling cards slightly
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Stagger grid children
function staggerChildren(selector, delayStep) {
    document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('fade-in');
        el.dataset.delay = i * delayStep;
    });
}

staggerChildren('.benefit-card', 80);
staggerChildren('.track-card', 120);
staggerChildren('.pune-card', 70);
staggerChildren('.partner-card', 100);
staggerChildren('.path-card', 60);
staggerChildren('.group-card', 80);
staggerChildren('.apply-detail', 60);
staggerChildren('.accordion-item', 70);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ─── SMOOTH SCROLL FOR NAV LINKS ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
