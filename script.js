// REGISTER GSAP PLUGINS
gsap.registerPlugin(ScrollTrigger);

// ── LENIS SMOOTH SCROLL ──
const lenis = new Lenis({
  autoRaf: true,
  lerp: 0.1,
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ── NO CUSTOM CURSOR ──
const cur = document.getElementById('cur');
if (cur) cur.style.display = 'none';

// ── HERO VIDEO PARALLAX ──
gsap.to(".video-hero-container video", {
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    },
    y: 150,
    ease: "none"
});

window.addEventListener('resize', () => {
    initNeural();
});

// ── NEURAL NETWORK HERO ANIMATION ──
const neuralCanvas = document.getElementById('neural-canvas');
if (neuralCanvas) {
    const nctx = neuralCanvas.getContext('2d');
    let nNodes = [];
    const nNodeCount = window.innerWidth < 768 ? 15 : 35;

    function initNeural() {
        neuralCanvas.width = neuralCanvas.offsetWidth;
        neuralCanvas.height = neuralCanvas.offsetHeight;
        nNodes = [];
        
        // Central Agent Node
        nNodes.push({
            x: neuralCanvas.width / 2,
            y: neuralCanvas.height / 2,
            vx: 0,
            vy: 0,
            r: 4,
            isAgent: true
        });

        for (let i = 0; i < nNodeCount; i++) {
            nNodes.push({
                x: Math.random() * neuralCanvas.width,
                y: Math.random() * neuralCanvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2 + 0.5,
                isAgent: false
            });
        }
    }

    function drawNeural() {
        nctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
        
        nNodes.forEach((node, i) => {
            if (!node.isAgent) {
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < 0 || node.x > neuralCanvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > neuralCanvas.height) node.vy *= -1;
            }

            nctx.beginPath();
            nctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
            nctx.fillStyle = node.isAgent ? 'var(--lime)' : 'rgba(184, 245, 0, 0.4)';
            nctx.fill();

            // Connections
            nNodes.forEach((other, j) => {
                if (i === j) return;
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const maxDist = node.isAgent || other.isAgent ? 250 : 120;
                if (dist < maxDist) {
                    nctx.beginPath();
                    nctx.strokeStyle = node.isAgent || other.isAgent 
                        ? `rgba(184, 245, 0, ${0.2 * (1 - dist / maxDist)})` 
                        : `rgba(184, 245, 0, ${0.05 * (1 - dist / maxDist)})`;
                    nctx.lineWidth = node.isAgent || other.isAgent ? 1.5 : 0.5;
                    nctx.moveTo(node.x, node.y);
                    nctx.lineTo(other.x, other.y);
                    nctx.stroke();

                    // Pulse effect on connection
                    if ((node.isAgent || other.isAgent) && Math.random() > 0.98) {
                        nctx.beginPath();
                        nctx.arc(node.x, node.y, node.r + 2, 0, Math.PI * 2);
                        nctx.strokeStyle = 'var(--lime)';
                        nctx.stroke();
                    }
                }
            });
        });
        requestAnimationFrame(drawNeural);
    }

    initNeural();
    drawNeural();
}

// ── HERO 3D TILT & PARALLAX ──
const glassPanel = document.querySelector('.glass-panel');
const heroContent = document.querySelector('.hero-content');
const videoBg = document.querySelector('.video-bg');

document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.clientX) / 300;
    const yAxis = (window.innerHeight / 2 - e.clientY) / 300;
    
    // Tilt the panel
    gsap.to(glassPanel, {
        rotateY: xAxis,
        rotateX: -yAxis,
        duration: 0.8,
        ease: "power3.out"
    });

    // Parallax elements
    const px = (e.clientX - window.innerWidth / 2) * 0.01;
    const py = (e.clientY - window.innerHeight / 2) * 0.01;

    gsap.to(heroContent, {
        x: px * 3,
        y: py * 3,
        duration: 1.2,
        ease: "power3.out"
    });

    gsap.to('.hero-perspective', {
        x: -px,
        y: -py,
        duration: 2,
        ease: "power3.out"
    });

    gsap.to(videoBg, {
        scale: 1.1,
        x: px * 0.5,
        y: py * 0.5,
        duration: 3,
        ease: "power3.out"
    });
});

// Scroll Based Exit (Gentler)
gsap.to(glassPanel, {
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom center",
        scrub: true,
    },
    y: -100,
    opacity: 0,
    scale: 0.95,
    ease: "none"
});

// ── HERO LINE ANIMATION ──
gsap.to(".hero-lines path", {
    strokeDashoffset: 0,
    duration: 2,
    stagger: 0.3,
    ease: "power2.inOut"
});

// Parallax Hero Lines on Scroll
gsap.to(".hero-lines", {
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    },
    y: 200,
    opacity: 0,
    ease: "none"
});

// Nav interaction & Hero Entrance
window.addEventListener('load', () => {
    // Initial Reveal
    const tl = gsap.timeline();
    
    tl.to("nav", { y: 0, opacity: 1, duration: 1, ease: "expo.out" })
      .from(".glass-panel", { 
          scale: 1.05, 
          y: 50,
          opacity: 0, 
          duration: 1.2, 
          ease: "expo.out" 
      }, "-=0.5")
      .from(".hero-content > *", {
          opacity: 0,
          y: 20,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out"
      }, "-=0.8")
      .add(() => {
          document.querySelector('.glass-panel').classList.add('sweep');
      }, "-=0.5");

    // Magnetic Buttons
    const magButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    magButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.5, ease: "power2.out" });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });

    // Smooth reveal for sections
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 90%",
                end: "bottom 10%",
                scrub: 0.5,
            }
        })
        .fromTo(section, 
            { scale: 0.98, opacity: 0, y: 30 },
            { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        )
        .to(section, 
            { scale: 1.02, opacity: 0, y: -30, duration: 0.8, ease: "power2.in" },
            "+=0.2"
        );
    });
});


