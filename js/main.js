document.addEventListener("DOMContentLoaded", function () {

    /* --- 1. LENIS SMOOTH SCROLL INIT --- */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
    });

    /* --- 2. GSAP SCROLLTRIGGER SYNC --- */
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    /* --- 3. GSAP ANIMATIONS --- */
    gsap.utils.toArray('.reveal').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });

    gsap.utils.toArray('.scale-in').forEach(el => {
        gsap.fromTo(el, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });

    document.querySelectorAll('.counter').forEach(counter => {
        ScrollTrigger.create({
            trigger: counter, start: "top 85%", once: true,
            onEnter: () => {
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const updateCount = () => {
                    const inc = target / 30;
                    if (count < target) { count += inc; counter.innerText = Math.ceil(count); setTimeout(updateCount, 40); }
                    else { counter.innerText = target; }
                };
                updateCount();
            }
        });
    });

    /* --- 4. CUSTOM CURSOR --- */
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', e => { cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; });
        document.querySelectorAll('.interactive-hover').forEach(item => {
            item.addEventListener('mouseover', () => { cursor.style.width = '30px'; cursor.style.height = '30px'; cursor.style.background = 'transparent'; cursor.style.border = '2px solid var(--accent)'; });
            item.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; cursor.style.background = 'var(--accent)'; cursor.style.border = 'none'; });
        });
    }

    /* --- 5. BACK TO TOP --- */
    const backToTop = document.querySelector('.back-to-top');
    const topTextSvg = document.querySelector('.top-text-svg');
    if (backToTop && topTextSvg) {
        lenis.on('scroll', (e) => {
            if (e.scroll > 500) { backToTop.classList.add('visible'); } else { backToTop.classList.remove('visible'); }
            topTextSvg.style.transform = `rotate(${e.scroll * 0.2}deg)`;
        });
        backToTop.addEventListener('click', (e) => { e.preventDefault(); lenis.scrollTo(0, { duration: 1.5 }); });
    }

    /* --- 6. TYPOGRAPHY SCRAMBLE --- */
    const scrambleElements = document.querySelectorAll('.scramble-text');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

    scrambleElements.forEach(el => {
        // 💡 FIX: Use textContent instead of innerText so it reads hidden text
        const originalText = el.textContent.trim();
        let scrambleInterval;
        const triggerScramble = () => {
            let iterations = 0;
            clearInterval(scrambleInterval);
            scrambleInterval = setInterval(() => {
                // 💡 FIX: Update the text using textContent
                el.textContent = originalText.split('').map((char, index) => {
                    if (index < iterations || char === ' ') return originalText[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
                if (iterations >= originalText.length) clearInterval(scrambleInterval);
                iterations += 1 / 3;
            }, 30);
        };
        setInterval(triggerScramble, 2000);
    });

    /* --- 7. PROJECT REVEAL (SCROLL GLITCH FIXED) --- */
    const nextBtn = document.getElementById('next-project-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const hiddenContent = document.getElementById('hidden-content');
            hiddenContent.style.display = 'block';

            // 💡 FIX: 100ms breather for the browser to paint before scrolling
            setTimeout(() => {
                ScrollTrigger.refresh();
                lenis.scrollTo('#project-02', { duration: 1.5, offset: 0 });
            }, 100);
        });
    }
});

/* 💡 FIX: Secure clipboard copy for local testing */
function copyHex(hex, el) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(hex);
    } else {
        let textArea = document.createElement("textarea");
        textArea.value = hex; textArea.style.position = "fixed"; textArea.style.left = "-999999px";
        document.body.appendChild(textArea); textArea.select();
        try { document.execCommand('copy'); } catch (err) { }
        textArea.remove();
    }
    const originalText = el.innerText;
    el.innerText = "COPIED!"; el.style.color = "var(--ink-main)";
    setTimeout(() => { el.innerText = originalText; el.style.color = ""; }, 1500);
}