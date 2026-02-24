import { useEffect, useRef } from 'react';
import LogoBrand from './LogoBrand';
import './Hero.css';

/* ===== Neural particle canvas ===== */
function HeroCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, nodes = [], mouse = { x: -1000, y: -1000 }, raf;
        const NODE_COUNT = 70;
        const CONN_DIST = 140;
        const MOUSE_R = 180;
        const GOLD = { r: 230, g: 211, b: 149 };
        const CYAN = { r: 0, g: 229, b: 255 };

        function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }

        function createNodes() {
            nodes = [];
            for (let i = 0; i < NODE_COUNT; i++) {
                nodes.push({
                    x: Math.random() * W, y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
                    r: Math.random() * 2 + 1, pulse: Math.random() * Math.PI * 2,
                    ps: 0.01 + Math.random() * 0.02,
                    c: Math.random() > 0.7 ? CYAN : GOLD,
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONN_DIST) {
                        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(230,211,149,${(1 - dist / CONN_DIST) * 0.12})`;
                        ctx.lineWidth = 0.5; ctx.stroke();
                    }
                }
            }
            for (const n of nodes) {
                const dx = n.x - mouse.x, dy = n.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_R) {
                    ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0,229,255,${(1 - dist / MOUSE_R) * 0.25})`;
                    ctx.lineWidth = 0.8; ctx.stroke();
                }
            }
            for (const n of nodes) {
                n.x += n.vx; n.y += n.vy; n.pulse += n.ps;
                if (n.x < 0 || n.x > W) n.vx *= -1;
                if (n.y < 0 || n.y > H) n.vy *= -1;
                const dmx = mouse.x - n.x, dmy = mouse.y - n.y;
                const mdist = Math.sqrt(dmx * dmx + dmy * dmy);
                if (mdist < MOUSE_R && mdist > 0) { n.vx += (dmx / mdist) * 0.015; n.vy += (dmy / mdist) * 0.015; }
                n.vx *= 0.99; n.vy *= 0.99;
                const glow = 0.4 + 0.3 * Math.sin(n.pulse);
                const { r, g, b } = n.c;
                const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
                grad.addColorStop(0, `rgba(${r},${g},${b},${glow * 0.3})`);
                grad.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${glow})`; ctx.fill();
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

    return <canvas ref={canvasRef} className="hero__canvas" />;
}

export default function Hero() {
    return (
        <section className="hero" id="hero">
            <HeroCanvas />
            <div className="hero__gradient" />

            <div className="hero__content">

                <div className="hero__logo-wrap">
                    <LogoBrand size="hero" />
                </div>

                <h1 className="hero__title">
                    <span className="hero__title-gold">Applied AI Club</span><br />
                    Purdue University Northwest
                </h1>

                <p className="hero__subtitle">
                    Where students at Purdue University Northwest build, experiment, and deploy real AI — together.<br />
                    <span className="hero__tagline">Agents. Models. Research. Community.</span>
                </p>

                <div className="hero__ctas">
                    <a href="#about" className="btn-primary">Explore the Club</a>
                    <a href="#join" className="btn-outline">Join Applied AI</a>
                </div>

                <div className="hero__status-bar">
                    <div className="hero__status-item">
                        <span className="hero__status-dot"></span> Status: Active
                    </div>
                    <span className="hero__status-div"></span>
                    <div className="hero__status-item">Members: Growing</div>
                    <span className="hero__status-div"></span>
                    <div className="hero__status-item">Events This Sem: 02</div>
                    <span className="hero__status-div"></span>
                    <div className="hero__status-item">Faculty Mentors: 06</div>
                </div>
            </div>

            <div className="hero__scroll-hint">
                <div className="hero__scroll-line"></div>
            </div>
        </section>
    );
}
