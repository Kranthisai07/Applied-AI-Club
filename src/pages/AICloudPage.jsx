import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './AICloudPage.css';

/* ============================================================
   DATA
   ============================================================ */
const FACULTY = [
    {
        key: 'calix', dept: 'CIT DEPT', name: 'Ricardo A. Calix, Ph.D.',
        title: 'Professor – Computer & Information Technology', lab: null,
        tags: ['Machine Learning', 'NLP', 'Deep Learning', 'Cyber Security'],
        color: 'var(--pnw-gold)',
        bio: 'Dr. Calix specializes in machine learning, NLP, deep learning, and cybersecurity for healthcare. His research develops scalable AI systems for real-world challenges.',
        pubs: 'Multiple peer-reviewed publications in ML, NLP, and cybersecurity.',
    },
    {
        key: 'ni', dept: 'CIT DEPT · NEXIS LAB', name: 'Yang Ni, Ph.D.',
        title: 'Assistant Professor · Director, NEXIS Lab', lab: 'NEXIS Lab',
        tags: ['Efficient ML', 'Computer Vision', 'AI for Healthcare'],
        color: 'var(--neon-cyan)',
        bio: 'Dr. Ni leads the NEXIS Lab, focusing on efficient ML, computer vision, and multi-modal reasoning for healthcare deployment.',
        pubs: 'Published research in efficient neural architectures and medical imaging.',
    },
    {
        key: 'dai', dept: 'CIT DEPT · AIS LAB', name: 'Wei David Dai, Ph.D.',
        title: 'Assistant Professor · Director, AIS Lab', lab: 'AIS Lab',
        tags: ['Computer Science', 'Data Science', 'Deep Learning'],
        color: 'var(--neon-blue)',
        bio: 'Dr. Dai directs the AIS Lab, with research spanning data science and deep learning for practical applications.',
        pubs: 'Published in top-tier venues on data science and deep learning.',
    },
    {
        key: 'islam', dept: 'CIT DEPT · TRUST-IT LAB', name: 'Shafkat Islam, Ph.D.',
        title: 'Assistant Professor · Director, TRUST-IT Lab', lab: 'TRUST-IT Lab',
        tags: ['Trustworthy AI', 'Robust AI', 'Secure Systems'],
        color: 'var(--neon-magenta)',
        bio: 'Dr. Islam leads the TRUST-IT Lab, dedicated to trustworthy AI and robust intelligent systems resilient against adversarial attacks.',
        pubs: 'Research in adversarial ML, robustness, and AI safety.',
    },
    {
        key: 'jin', dept: 'GRAD STUDIES', name: 'Ge Jin, Ph.D.',
        title: 'Associate Dean, Graduate Studies', lab: null,
        tags: ['Computer Graphics', 'VR', 'Game Dev'],
        color: 'var(--neon-purple)',
        bio: 'Dr. Jin bridges AI with immersive technologies, creating novel applications in education, training, and simulation.',
        pubs: 'Publications in graphics, VR, and interactive simulation.',
    },
    {
        key: 'kim', dept: 'CIT DEPT', name: 'Tae-Hoon Kim, Ph.D.',
        title: 'Professor – Computer Networks & Security', lab: null,
        tags: ['Networks', 'Security', 'Data Science'],
        color: 'var(--neon-green)',
        bio: 'Dr. Kim applies AI and data-driven techniques to network security, developing intelligent threat detection systems.',
        pubs: 'Extensive publications in network security and data science.',
    },
];

const METRICS_DATA = {
    agents: [
        { label: 'Active Experiments', value: 47, suffix: '', change: '↑ 12% this week' },
        { label: 'GPU Utilization', value: 83, suffix: '%', change: '↑ 5% avg' },
        { label: 'Models Deployed', value: 19, suffix: '', change: '↑ 3 new' },
        { label: 'Datasets in Use', value: 234, suffix: '', change: '↑ 28 this month' },
    ],
    datasets: [
        { label: 'Total Datasets', value: 234, suffix: '', change: '↑ 28 new' },
        { label: 'Storage Used', value: 4.2, suffix: ' TB', change: '↑ 0.3 TB' },
        { label: 'Shared Datasets', value: 67, suffix: '', change: '↑ 8 this month' },
        { label: 'Data Pipelines', value: 31, suffix: '', change: '↑ 5 active' },
    ],
    pipelines: [
        { label: 'Active Pipelines', value: 31, suffix: '', change: '↑ 5 new' },
        { label: 'Jobs Completed', value: 1842, suffix: '', change: '↑ 142 this week' },
        { label: 'Avg Runtime', value: 23, suffix: ' min', change: '↓ 4 min faster' },
        { label: 'Success Rate', value: 97, suffix: '%', change: '↑ 2%' },
    ],
};

/* ============================================================
   HOOKS
   ============================================================ */
function useScrollReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
            { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return ref;
}

function RevealDiv({ children, className = '', style }) {
    const ref = useScrollReveal();
    return <div ref={ref} className={`aic-reveal ${className}`} style={style}>{children}</div>;
}

function useCountUp(target, suffix = '', duration = 1500) {
    const ref = useRef(null);
    const counted = useRef(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !counted.current) {
                    counted.current = true;
                    const start = performance.now();
                    function step(now) {
                        const p = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - p, 3);
                        const val = Number.isInteger(target) ? Math.round(target * eased) : (target * eased).toFixed(1);
                        el.textContent = val + suffix;
                        if (p < 1) requestAnimationFrame(step);
                    }
                    requestAnimationFrame(step);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [target, suffix, duration]);
    return ref;
}

/* ============================================================
   HERO CANVAS – Neural Network Particles
   ============================================================ */
function HeroCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, nodes = [], mouse = { x: -1000, y: -1000 }, raf;
        const NODE_COUNT = 80;
        const CONN_DIST = 150;
        const MOUSE_R = 200;
        const GOLD = { r: 230, g: 211, b: 149 };
        const CYAN = { r: 0, g: 229, b: 255 };

        function resize() {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }

        function createNodes() {
            nodes = [];
            for (let i = 0; i < NODE_COUNT; i++) {
                nodes.push({
                    x: Math.random() * W, y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
                    r: Math.random() * 2 + 1, pulse: Math.random() * Math.PI * 2,
                    ps: 0.01 + Math.random() * 0.02,
                    c: Math.random() > 0.7 ? CYAN : GOLD,
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            // connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONN_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(230,211,149,${(1 - dist / CONN_DIST) * 0.15})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            // mouse connections
            for (const n of nodes) {
                const dx = n.x - mouse.x, dy = n.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_R) {
                    ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0,229,255,${(1 - dist / MOUSE_R) * 0.3})`;
                    ctx.lineWidth = 0.8; ctx.stroke();
                }
            }
            // nodes
            for (const n of nodes) {
                n.x += n.vx; n.y += n.vy; n.pulse += n.ps;
                if (n.x < 0 || n.x > W) n.vx *= -1;
                if (n.y < 0 || n.y > H) n.vy *= -1;
                const dx = mouse.x - n.x, dy = mouse.y - n.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_R && dist > 0) { n.vx += (dx / dist) * 0.02; n.vy += (dy / dist) * 0.02; }
                n.vx *= 0.99; n.vy *= 0.99;
                const glow = 0.4 + 0.3 * Math.sin(n.pulse);
                const { r, g, b } = n.c;
                const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
                grad.addColorStop(0, `rgba(${r},${g},${b},${glow * 0.3})`);
                grad.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${r},${g},${b},${glow})`; ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        }

        resize(); createNodes(); draw();
        const onResize = () => { resize(); createNodes(); };
        window.addEventListener('resize', onResize);
        const onMove = (e) => { const rect = canvas.getBoundingClientRect(); mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; };
        const onLeave = () => { mouse.x = -1000; mouse.y = -1000; };
        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseleave', onLeave);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseleave', onLeave); };
    }, []);

    return <canvas ref={canvasRef} className="aic-hero-canvas" />;
}

/* ============================================================
   SPARKLINE
   ============================================================ */
function Sparkline({ data, color, id }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.offsetWidth, h = canvas.offsetHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        const max = Math.max(...data), min = Math.min(...data);
        const range = max - min || 1;
        const step = w / (data.length - 1);
        ctx.beginPath();
        data.forEach((v, i) => {
            const x = i * step, y = h - ((v - min) / range) * h * 0.8 - h * 0.1;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.lineTo((data.length - 1) * step, h); ctx.lineTo(0, h); ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, color.replace('rgb', 'rgba').replace(')', ',0.3)'));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad; ctx.fill();
    }, [data, color]);
    return <canvas ref={canvasRef} className="aic-metric-spark" id={id} />;
}

/* ============================================================
   BAR CHART
   ============================================================ */
function BarChart() {
    const canvasRef = useRef(null);
    const drawn = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !drawn.current) {
                    drawn.current = true;
                    animateBars();
                    obs.unobserve(canvas);
                }
            });
        }, { threshold: 0.3 });
        obs.observe(canvas);

        function animateBars() {
            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            const w = canvas.offsetWidth, h = canvas.offsetHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.scale(dpr, dpr);

            const data = [18, 25, 32, 28, 42, 38, 55, 47, 62, 58, 71, 47];
            const labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];
            const max = Math.max(...data);
            const barW = (w - 40) / data.length - 6;
            const pad = 20;
            const startTime = performance.now();

            function frame(now) {
                const prog = Math.min((now - startTime) / 1200, 1);
                const eased = 1 - Math.pow(1 - prog, 3);
                ctx.clearRect(0, 0, w, h);
                for (let i = 0; i <= 4; i++) {
                    const y = pad + ((h - pad * 2) / 4) * i;
                    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y);
                    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1; ctx.stroke();
                }
                data.forEach((v, i) => {
                    const barH = ((v / max) * (h - pad * 3)) * eased;
                    const x = pad + i * ((w - pad * 2) / data.length) + 3;
                    const y = h - pad - barH;
                    const grad = ctx.createLinearGradient(x, y, x, h - pad);
                    grad.addColorStop(0, 'rgba(230,211,149,0.9)');
                    grad.addColorStop(1, 'rgba(230,211,149,0.2)');
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0]); else { ctx.rect(x, y, barW, barH); }
                    ctx.fillStyle = grad; ctx.fill();
                    ctx.shadowColor = 'rgba(230,211,149,0.3)'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
                    ctx.fillStyle = 'rgba(255,255,255,0.3)';
                    ctx.font = '9px "Share Tech Mono", monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText(labels[i], x + barW / 2, h - 6);
                });
                if (prog < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        }
        return () => obs.disconnect();
    }, []);

    return <canvas ref={canvasRef} className="aic-chart-canvas" />;
}

/* ============================================================
   GAUGE
   ============================================================ */
function GaugeChart() {
    const canvasRef = useRef(null);
    const drawn = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !drawn.current) {
                    drawn.current = true;
                    animateGauge();
                    obs.unobserve(canvas);
                }
            });
        }, { threshold: 0.3 });
        obs.observe(canvas);

        function animateGauge() {
            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            const size = canvas.offsetWidth;
            canvas.width = size * dpr; canvas.height = size * dpr;
            ctx.scale(dpr, dpr);
            const cx = size / 2, cy = size / 2, radius = size * 0.38, lineW = 10, targetPct = 0.83;
            const startTime = performance.now();

            function frame(now) {
                const prog = Math.min((now - startTime) / 1500, 1);
                const eased = 1 - Math.pow(1 - prog, 3);
                const pct = targetPct * eased;
                ctx.clearRect(0, 0, size, size);
                ctx.beginPath(); ctx.arc(cx, cy, radius, Math.PI * 0.75, Math.PI * 2.25);
                ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = lineW; ctx.lineCap = 'round'; ctx.stroke();
                const startAngle = Math.PI * 0.75;
                const endAngle = startAngle + Math.PI * 1.5 * pct;
                const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
                grad.addColorStop(0, '#E6D395'); grad.addColorStop(0.5, '#E6D395');
                grad.addColorStop(1, pct > 0.7 ? '#e040fb' : '#00e5ff');
                ctx.beginPath(); ctx.arc(cx, cy, radius, startAngle, endAngle);
                ctx.strokeStyle = grad; ctx.lineWidth = lineW; ctx.lineCap = 'round'; ctx.stroke();
                ctx.shadowColor = 'rgba(230,211,149,0.4)'; ctx.shadowBlur = 15; ctx.stroke(); ctx.shadowBlur = 0;
                ctx.fillStyle = '#E6D395'; ctx.font = `bold ${size * 0.18}px Orbitron, sans-serif`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(Math.round(pct * 100) + '%', cx, cy - 4);
                ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = `${size * 0.065}px "Share Tech Mono", monospace`;
                ctx.fillText('GPU LOAD', cx, cy + size * 0.12);
                if (prog < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        }
        return () => obs.disconnect();
    }, []);

    return <canvas ref={canvasRef} className="aic-gauge-canvas" />;
}

/* ============================================================
   FACULTY CARD
   ============================================================ */
function FacultyCard({ data, onClick }) {
    const cardRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const cx = rect.width / 2, cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -8;
        const rotateY = ((x - cx) / cx) * 8;
        cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }, []);

    const handleMouseLeave = useCallback(() => {
        cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    }, []);

    return (
        <div ref={cardRef} className="aic-fcard aic-reveal visible" onClick={() => onClick(data)}
            onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="aic-fcard-scan" />
            <div className="aic-fcard-hex" />
            <div className="aic-corner tl" /><div className="aic-corner tr" />
            <div className="aic-corner bl" /><div className="aic-corner br" />
            <div className="aic-fcard-dept">{data.dept}</div>
            <div className="aic-fcard-photo">
                <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="22" r="12" fill="none" stroke={data.color} strokeWidth="1.5" opacity="0.5" />
                    <path d="M12 52c0-10 8-18 18-18s18 8 18 18" fill="none" stroke={data.color} strokeWidth="1.5" opacity="0.5" />
                </svg>
            </div>
            <div className="aic-fcard-info">
                <div className="aic-fcard-name">{data.name}</div>
                <div className="aic-fcard-title">{data.title}</div>
                <div className="aic-fcard-tags">
                    {data.tags.map((t) => <span key={t} className="aic-ftag">{t}</span>)}
                </div>
                <div className="aic-fcard-status">
                    <span className="aic-fstatus-dot" />
                    Status: Online · Research: Active
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   FACULTY MODAL
   ============================================================ */
function FacultyModal({ data, onClose }) {
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
    }, [onClose]);

    if (!data) return null;
    return (
        <div className="aic-modal-overlay active" onClick={onClose}>
            <div className="aic-modal" onClick={(e) => e.stopPropagation()}>
                <button className="aic-modal-close" onClick={onClose}>✕</button>
                <div className="aic-modal-photo">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="22" r="12" fill="none" stroke="var(--pnw-gold)" strokeWidth="1.5" opacity="0.5" />
                        <path d="M12 52c0-10 8-18 18-18s18 8 18 18" fill="none" stroke="var(--pnw-gold)" strokeWidth="1.5" opacity="0.5" />
                    </svg>
                </div>
                <h3>{data.name}</h3>
                <div className="aic-modal-title">{data.title}</div>
                {data.lab && <div className="aic-modal-lab">LAB: {data.lab}</div>}
                <p className="aic-modal-bio">{data.bio}</p>
                <div className="aic-fcard-tags" style={{ marginBottom: 20 }}>
                    {data.tags.map((t) => <span key={t} className="aic-ftag">{t}</span>)}
                </div>
                <p className="aic-modal-pubs">{data.pubs}</p>
                <div className="aic-modal-links">
                    <a href="#" className="aic-btn aic-btn-secondary" style={{ fontSize: '0.7rem', padding: '10px 20px' }}>Visit Profile →</a>
                    <a href="mailto:ai-cloud@pnw.edu" className="aic-btn aic-btn-secondary" style={{ fontSize: '0.7rem', padding: '10px 20px' }}>Connect</a>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   METRIC CARD (with countup)
   ============================================================ */
function MetricCard({ label, value, suffix, change, sparkData, sparkColor, sparkId }) {
    const valRef = useCountUp(value, suffix);
    return (
        <div className="aic-metric-card">
            <div className="aic-metric-label">{label}</div>
            <div className="aic-metric-value" ref={valRef}>0{suffix}</div>
            <div className="aic-metric-change">{change}</div>
            {sparkData && <Sparkline data={sparkData} color={sparkColor} id={sparkId} />}
        </div>
    );
}

/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */
export default function AICloudPage() {
    const [activeTab, setActiveTab] = useState('agents');
    const [modalFaculty, setModalFaculty] = useState(null);
    const metrics = METRICS_DATA[activeTab];

    const sparklines = [
        { data: [12, 18, 15, 22, 28, 25, 32, 30, 38, 42, 40, 47], color: 'rgb(230,211,149)' },
        { data: [60, 65, 72, 68, 75, 80, 78, 83, 79, 85, 82, 83], color: 'rgb(0,229,255)' },
        { data: [8, 10, 9, 12, 14, 13, 15, 16, 17, 18, 17, 19], color: 'rgb(230,211,149)' },
        { data: [150, 160, 170, 180, 185, 195, 200, 210, 215, 220, 228, 234], color: 'rgb(224,64,251)' },
    ];

    return (
        <div className="ai-cloud-page">

            {/* ────── HERO ────── */}
            <section className="aic-hero" id="aic-hero">
                <HeroCanvas />
                <div className="aic-hero-gradient" />
                <div className="aic-hero-content">
                    <div className="aic-hero-eyebrow">// INITIALIZING AI CLOUD INTERFACE</div>
                    <h1 className="aic-hero-title">
                        <span className="gold">Applied AI Cloud</span><br />
                        Purdue University Northwest
                    </h1>
                    <p className="aic-hero-subtitle">
                        A dark, intelligent cloud for real‑world AI experiments, agents, and data‑driven research — powering the next generation of applied artificial intelligence.
                    </p>
                    <div className="aic-hero-ctas">
                        <a href="#aic-dashboard" className="aic-btn aic-btn-primary">Explore the AI Cloud</a>
                        <a href="#" className="aic-btn aic-btn-secondary" target="_blank" rel="noopener">Visit PNW Applied AI Program</a>
                    </div>
                    <div className="aic-status-bar">
                        <div className="aic-status-item"><span className="aic-status-dot" /> Cluster: Online</div>
                        <span className="aic-status-divider" />
                        <div className="aic-status-item">Agents: 27 active</div>
                        <span className="aic-status-divider" />
                        <div className="aic-status-item">Experiments: 142 this semester</div>
                        <span className="aic-status-divider" />
                        <div className="aic-status-item">GPU Nodes: 8</div>
                    </div>
                </div>
                <div className="aic-scroll-hint"><div className="aic-scroll-line" /></div>
            </section>

            {/* ────── WHAT IS AI CLOUD ────── */}
            <section className="aic-what-is" id="aic-what-is">
                <div className="container">
                    <RevealDiv>
                        <div className="aic-label">// SYSTEM OVERVIEW</div>
                        <h2 className="aic-heading">What Is <span className="gold">Applied AI Cloud</span>?</h2>
                        <p className="aic-subtext">A unified research platform combining scalable compute, intelligent agents, and applied AI — designed to solve real‑world problems across industries.</p>
                    </RevealDiv>
                    <div className="aic-card-grid">
                        {[
                            {
                                title: 'Compute & Cloud', desc: 'GPU / CPU clusters, containers, and scalable infrastructure for running experiments of any size — from quick prototypes to massive training runs.',
                                icon: <><rect x="8" y="14" width="48" height="36" rx="4" /><line x1="20" y1="50" x2="44" y2="50" /><line x1="32" y1="50" x2="32" y2="56" /><line x1="24" y1="56" x2="40" y2="56" /><circle cx="32" cy="32" r="8" strokeDasharray="4 3" /><line x1="32" y1="20" x2="32" y2="24" /><line x1="32" y1="40" x2="32" y2="44" /><line x1="20" y1="32" x2="24" y2="32" /><line x1="40" y1="32" x2="44" y2="32" /></>
                            },
                            {
                                title: 'Applied AI & Agents', desc: 'Multi‑agent systems, large language models, computer vision, and NLP pipelines — built and tested on real data for real applications.',
                                icon: <><circle cx="32" cy="20" r="10" /><circle cx="14" cy="44" r="7" /><circle cx="50" cy="44" r="7" /><line x1="25" y1="27" x2="18" y2="39" /><line x1="39" y1="27" x2="46" y2="39" /><line x1="21" y1="44" x2="43" y2="44" /></>
                            },
                            {
                                title: 'Real‑World Impact', desc: 'Solving challenges in healthcare, manufacturing, transportation, cybersecurity, finance, and beyond — AI that goes from the lab to the field.',
                                icon: <><circle cx="32" cy="32" r="22" /><ellipse cx="32" cy="32" rx="22" ry="10" /><line x1="32" y1="10" x2="32" y2="54" /></>
                            },
                        ].map((c, i) => (
                            <RevealDiv key={i} className="glass-card aic-what-card">
                                <div className="aic-what-card-icon"><svg viewBox="0 0 64 64">{c.icon}</svg></div>
                                <h3>{c.title}</h3>
                                <p>{c.desc}</p>
                                <div className="aic-circuit-line" />
                            </RevealDiv>
                        ))}
                    </div>
                </div>
            </section>

            {/* ────── DASHBOARD ────── */}
            <section className="aic-dashboard" id="aic-dashboard">
                <div className="container">
                    <RevealDiv>
                        <div className="aic-label">// LIVE TELEMETRY</div>
                        <h2 className="aic-heading">AI Cloud <span className="gold">Dashboard</span></h2>
                        <p className="aic-subtext">Real‑time visualization of cluster activity, model deployments, and research throughput.</p>
                    </RevealDiv>
                    <RevealDiv className="aic-dashboard-panel">
                        <div className="aic-dash-tabs">
                            {['agents', 'datasets', 'pipelines'].map((t) => (
                                <button key={t} className={`aic-dash-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="aic-metrics-grid">
                            {metrics.map((m, i) => (
                                <MetricCard key={`${activeTab}-${i}`} label={m.label} value={m.value} suffix={m.suffix} change={m.change}
                                    sparkData={sparklines[i]?.data} sparkColor={sparklines[i]?.color} sparkId={`spark-${activeTab}-${i}`} />
                            ))}
                        </div>
                        <div className="aic-charts-row">
                            <div className="aic-chart-card">
                                <div className="aic-chart-header">
                                    <span className="aic-chart-title">Weekly Experiment Activity</span>
                                    <span className="aic-chart-title" style={{ color: 'var(--pnw-gold)' }}>Last 12 Weeks</span>
                                </div>
                                <BarChart />
                            </div>
                            <div className="aic-chart-card">
                                <div className="aic-chart-header"><span className="aic-chart-title">GPU Load</span></div>
                                <div className="aic-gauge-wrap">
                                    <GaugeChart />
                                    <div className="aic-gauge-label">Current Utilization</div>
                                </div>
                            </div>
                        </div>
                        <div className="aic-dashboard-caption">ⓘ This dashboard is a visualization concept for how Applied AI Cloud tracks research activity.</div>
                    </RevealDiv>
                </div>
            </section>

            {/* ────── USE CASES ────── */}
            <section className="aic-use-cases" id="aic-use-cases">
                <div className="container">
                    <RevealDiv>
                        <div className="aic-label">// ACTIVE PROJECTS</div>
                        <h2 className="aic-heading">Use Cases & <span className="gold">Research</span></h2>
                        <p className="aic-subtext">From manufacturing floors to hospital systems — Applied AI Cloud powers research that matters.</p>
                    </RevealDiv>
                    <div className="aic-card-grid">
                        {[
                            {
                                title: 'Computer Vision for Manufacturing', desc: 'Automated quality inspection using deep learning models trained on production‑line imagery.', tags: ['Vision', 'Deep Learning', 'Industry'],
                                icon: <><rect x="6" y="10" width="36" height="28" rx="3" /><circle cx="24" cy="24" r="8" /><line x1="24" y1="16" x2="24" y2="32" strokeDasharray="2 2" /><line x1="16" y1="24" x2="32" y2="24" strokeDasharray="2 2" /></>
                            },
                            {
                                title: 'Predictive Analytics for Energy', desc: 'Time‑series forecasting models that optimize energy grid management and distribution efficiency.', tags: ['Forecasting', 'Energy', 'Data Science'],
                                icon: <><polyline points="6,36 14,28 22,32 30,18 38,22 46,12" /><line x1="6" y1="42" x2="46" y2="42" /><line x1="6" y1="42" x2="6" y2="10" /></>
                            },
                            {
                                title: 'NLP for Education & Support', desc: 'Intelligent document analysis and chatbot systems that streamline student support and advising.', tags: ['NLP', 'LLMs', 'Education'],
                                icon: <><rect x="10" y="6" width="28" height="36" rx="4" /><line x1="16" y1="14" x2="32" y2="14" /><line x1="16" y1="20" x2="28" y2="20" /><line x1="16" y1="26" x2="30" y2="26" /></>
                            },
                            {
                                title: 'AI Agents & Automation', desc: 'Multi‑agent reinforcement learning for autonomous decision‑making in logistics and scheduling.', tags: ['Agents', 'RL', 'Automation'],
                                icon: <><circle cx="24" cy="18" r="10" /><path d="M14 40c0-5.5 4.5-10 10-10s10 4.5 10 10" /><line x1="34" y1="14" x2="42" y2="8" /><circle cx="42" cy="8" r="3" /></>
                            },
                            {
                                title: 'Healthcare AI & Diagnostics', desc: 'Medical imaging analysis and clinical NLP to accelerate diagnostics and personalize treatment.', tags: ['Healthcare', 'Vision', 'NLP'],
                                icon: <><path d="M24 6v36M6 24h36" /><circle cx="24" cy="24" r="16" /><circle cx="24" cy="24" r="6" /></>
                            },
                            {
                                title: 'Cybersecurity & Threat Intel', desc: 'Deep learning for network intrusion detection, anomaly classification, and automated response.', tags: ['Security', 'Deep Learning', 'Networks'],
                                icon: <><rect x="6" y="14" width="16" height="20" rx="3" /><rect x="26" y="14" width="16" height="20" rx="3" /><line x1="22" y1="22" x2="26" y2="22" /><line x1="22" y1="28" x2="26" y2="28" /></>
                            },
                        ].map((c, i) => (
                            <RevealDiv key={i} className="glass-card aic-use-case-tile">
                                <div className="aic-tile-icon"><svg viewBox="0 0 48 48">{c.icon}</svg></div>
                                <h3>{c.title}</h3>
                                <p>{c.desc}</p>
                                <div className="aic-tile-tags">{c.tags.map((t) => <span key={t} className="aic-tile-tag">{t}</span>)}</div>
                            </RevealDiv>
                        ))}
                    </div>
                </div>
            </section>

            {/* ────── WHY PNW ────── */}
            <section className="aic-why-pnw" id="aic-why-pnw">
                <div className="aic-why-ghost">PNW</div>
                <div className="container">
                    <div className="aic-why-content">
                        <RevealDiv>
                            <div className="aic-label">// WHY PNW</div>
                            <h2 className="aic-heading" style={{ marginBottom: 32 }}>Why <span className="gold">Purdue Northwest</span>?</h2>
                        </RevealDiv>
                        <RevealDiv>
                            <ul className="aic-why-list">
                                {[
                                    'Hands‑on, project‑based AI education in Northwest Indiana — learn by building real systems.',
                                    'Applied research across healthcare, manufacturing, transportation, cybersecurity, finance, and more.',
                                    'Faculty with a proven track record of applied AI innovation and industry partnerships.',
                                    'Dedicated GPU clusters and cloud infrastructure built for student and faculty research.',
                                    'Cross‑disciplinary collaboration with engineering, technology, and business programs.',
                                    'A growing community of AI practitioners, researchers, and industry collaborators.',
                                ].map((text, i) => (
                                    <li key={i}><span className="aic-bullet" />{text}</li>
                                ))}
                            </ul>
                        </RevealDiv>
                    </div>
                </div>
            </section>

            {/* ────── ARCHITECTURE ────── */}
            <section className="aic-architecture" id="aic-architecture">
                <div className="container">
                    <RevealDiv style={{ textAlign: 'center' }}>
                        <div className="aic-label" style={{ justifyContent: 'center' }}>// SYSTEM ARCHITECTURE</div>
                        <h2 className="aic-heading">How It <span className="gold">Works</span></h2>
                        <p className="aic-subtext" style={{ margin: '0 auto' }}>A layered architecture that takes data from source to insight — powered by scalable cloud infrastructure.</p>
                    </RevealDiv>
                    <RevealDiv className="aic-arch-flow">
                        {[
                            {
                                title: 'Data Sources', desc: 'APIs, sensors, databases, streams',
                                icon: <><rect x="4" y="6" width="32" height="8" rx="2" /><rect x="4" y="16" width="32" height="8" rx="2" /><rect x="4" y="26" width="32" height="8" rx="2" /></>
                            },
                            {
                                title: 'Compute & Storage', desc: 'GPU clusters, containers, stores',
                                icon: <><rect x="6" y="8" width="28" height="24" rx="3" /><line x1="12" y1="16" x2="28" y2="16" /><line x1="12" y1="22" x2="28" y2="22" /></>
                            },
                            {
                                title: 'Models & Agents', desc: 'Training, inference, orchestration',
                                icon: <><circle cx="20" cy="14" r="8" /><circle cx="10" cy="30" r="5" /><circle cx="30" cy="30" r="5" /><line x1="15" y1="20" x2="12" y2="26" /><line x1="25" y1="20" x2="28" y2="26" /></>
                            },
                            {
                                title: 'Apps & Outputs', desc: 'Dashboards, APIs, publications',
                                icon: <><rect x="4" y="6" width="14" height="12" rx="2" /><rect x="22" y="6" width="14" height="12" rx="2" /><rect x="4" y="22" width="14" height="12" rx="2" /><rect x="22" y="22" width="14" height="12" rx="2" /></>
                            },
                        ].map((node, i, arr) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="aic-arch-node">
                                    <div className="aic-arch-node-icon"><svg viewBox="0 0 40 40">{node.icon}</svg></div>
                                    <h4>{node.title}</h4>
                                    <p>{node.desc}</p>
                                </div>
                                {i < arr.length - 1 && (
                                    <div className="aic-arch-arrow">
                                        <div className="aic-arch-arrow-line"><span className="aic-pulse-dot" style={{ animationDelay: `${i * 0.4}s` }} /></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </RevealDiv>
                </div>
            </section>

            {/* ────── FACULTY ────── */}
            <section className="aic-faculty" id="aic-faculty">
                <div className="container">
                    <RevealDiv>
                        <div className="aic-label">// CREW ROSTER</div>
                        <h2 className="aic-heading">Proud Mentors: <span className="gold">Our Faculty</span></h2>
                        <div className="aic-terminal">
                            &gt; ACCESSING FACULTY DATABASE... [<span style={{ color: 'var(--pnw-gold)' }}>COMPLETE</span>]<span className="blink">_</span>
                        </div>
                    </RevealDiv>
                    <div className="aic-faculty-grid">
                        {FACULTY.map((f) => <FacultyCard key={f.key} data={f} onClick={setModalFaculty} />)}
                    </div>
                </div>
            </section>

            {/* ────── PEOPLE & ACCESS ────── */}
            <section className="aic-people" id="aic-people">
                <div className="container">
                    <RevealDiv style={{ textAlign: 'center' }}>
                        <div className="aic-label" style={{ justifyContent: 'center' }}>// ACCESS PORTAL</div>
                        <h2 className="aic-heading">Who Is This <span className="gold">For</span>?</h2>
                        <p className="aic-subtext" style={{ margin: '0 auto' }}>Applied AI Cloud is built for everyone in the PNW research ecosystem.</p>
                    </RevealDiv>
                    <div className="aic-card-grid">
                        {[
                            {
                                title: 'Students', desc: 'Access GPU clusters for capstone projects, join research assistantships, and run course experiments on production‑grade infrastructure.',
                                icon: <><path d="M28 6l22 10-22 10L6 16z" /><path d="M12 20v14c0 6 7.2 10 16 10s16-4 16-10V20" /></>
                            },
                            {
                                title: 'Faculty & Labs', desc: 'Run applied research at scale, collaborate on grants, and partner with industry — all backed by dedicated AI infrastructure.',
                                icon: <><rect x="8" y="12" width="40" height="30" rx="4" /><line x1="16" y1="22" x2="40" y2="22" /><line x1="16" y1="28" x2="36" y2="28" /></>
                            },
                            {
                                title: 'Industry Partners', desc: 'Sponsor joint projects, share datasets, host internships, and co‑develop AI solutions with PNW research teams.',
                                icon: <><rect x="8" y="18" width="16" height="28" rx="2" /><rect x="32" y="10" width="16" height="36" rx="2" /><line x1="24" y1="28" x2="32" y2="28" /><line x1="24" y1="34" x2="32" y2="34" /></>
                            },
                        ].map((c, i) => (
                            <RevealDiv key={i} className="glass-card aic-people-card">
                                <div className="aic-people-icon"><svg viewBox="0 0 56 56">{c.icon}</svg></div>
                                <h3>{c.title}</h3>
                                <p>{c.desc}</p>
                            </RevealDiv>
                        ))}
                    </div>
                    <RevealDiv className="aic-people-cta">
                        <a href="mailto:ai-cloud@pnw.edu" className="aic-btn aic-btn-primary">Request Access / Learn More</a>
                    </RevealDiv>
                </div>
            </section>

            {/* ────── FOOTER ────── */}
            <footer className="aic-footer">
                <div className="container">
                    <div className="aic-footer-top">
                        <div className="aic-footer-brand">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect width="48" height="48" rx="10" fill="#E6D395" fillOpacity="0.1" />
                                <path d="M12 34V14h7.2c4 0 6 2 6 5s-2 5-6 5H16v10H12z" fill="#E6D395" />
                                <path d="M26 34V14h3.6l6 12V14h3.6v20h-3.6l-6-12v12H26z" fill="#E6D395" opacity="0.7" />
                                <path d="M8 38h32" stroke="#E6D395" strokeWidth="1.5" opacity="0.5" />
                            </svg>
                            <div className="aic-footer-brand-text">Applied AI Cloud<span>Purdue University Northwest</span></div>
                        </div>
                        <ul className="aic-footer-links">
                            <li><a href="https://pnw.edu" target="_blank" rel="noopener">PNW Home</a></li>
                            <li><a href="#" target="_blank" rel="noopener">Applied AI MS</a></li>
                            <li><a href="#" target="_blank" rel="noopener">College of Technology</a></li>
                            <li><Link to="/">Applied AI Club</Link></li>
                        </ul>
                    </div>
                    <div className="aic-footer-bottom">
                        <p className="aic-footer-disclaimer">This site is an experimental interface concept for Applied AI Cloud at PNW. Demo metrics shown are illustrative.</p>
                        <p className="aic-footer-copyright">© 2026 Purdue University Northwest. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* ────── MODAL ────── */}
            {modalFaculty && <FacultyModal data={modalFaculty} onClose={() => setModalFaculty(null)} />}
        </div>
    );
}
