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

// ── CUSTOM CURSOR ──
const cur = document.getElementById('cur');
document.addEventListener('mousemove', e => {
  gsap.to(cur, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: "power2.out"
  });
});

// ── THREE.JS BACKGROUND (PREMIUM WAVE) ──
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(150, 150, 100, 100);
const material = new THREE.MeshBasicMaterial({
  color: 0x111010,
  wireframe: true,
  transparent: true,
  opacity: 0.05
});
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -Math.PI / 2.5;
plane.position.y = -20;
scene.add(plane);
camera.position.z = 60;

// Animation Loop
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  // Wave Logic
  const positions = plane.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    positions[i + 2] = Math.sin(x * 0.1 + time) * 2 + Math.cos(y * 0.1 + time) * 2;
  }
  plane.geometry.attributes.position.needsUpdate = true;

  // Scroll based rotation
  plane.rotation.z = window.pageYOffset * 0.0005;
  plane.position.y = -20 - (window.pageYOffset * 0.01);

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ── HERO 3D TILT & FLIP ──
const glassPanel = document.querySelector('.glass-panel');

document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.clientX) / 25;
    const yAxis = (window.innerHeight / 2 - e.clientY) / 25;
    gsap.to(glassPanel, {
        rotateY: xAxis,
        rotateX: -yAxis,
        duration: 0.5,
        ease: "power2.out"
    });
});

// Scroll Based Flip
gsap.to(glassPanel, {
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
    },
    rotateX: 90,
    opacity: 0,
    scale: 0.8,
    z: -500,
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

// ── SECTION ZOOM & PREMIUM FADE ──
const sections = document.querySelectorAll('section:not(.hero)');
sections.forEach(section => {
    // Single Timeline for entry and exit
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top bottom", // Starts when top of section hits bottom of screen
            end: "bottom top",    // Ends when bottom of section hits top of screen
            scrub: 1.5,
            toggleActions: "play reverse play reverse"
        }
    });

    tl.fromTo(section, 
        { scale: 0.8, opacity: 0, y: 100 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    )
    .to(section, 
        { scale: 1.2, opacity: 0, filter: "blur(20px)", y: -100, duration: 0.5, ease: "power3.in" },
        "+=0.2" // Wait a bit before exiting
    );
});

// Nav interaction
// Always visible as per user request
window.addEventListener('load', () => {
    gsap.to("nav", { y: 0, opacity: 1, duration: 0.5 });
});

// ── DYNAMIC BACKGROUND SHIFT ──
gsap.to("#bg-overlay", {
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    },
    background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(10,20,10,0.9) 50%, rgba(20,10,30,0.95) 100%)",
    ease: "none"
});

// ── HERO ENTRANCE ──
const tl = gsap.timeline();
tl.from(".glass-panel", {
    opacity: 0,
    y: 100,
    rotateX: -20,
    duration: 1.5,
    ease: "power4.out"
})
.from(".hero-content > *", {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 1,
    ease: "power3.out"
}, "-=1");
