import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Resources.css';

function RevealDiv({ children, className = '' }) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
            { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return <div ref={ref} className={`aic-reveal ${className}`}>{children}</div>;
}

const DiscordIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" width="24" height="24" fill="#5865F2">
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.1,46,96,53,91.08,65.69,84.69,65.69Z" />
    </svg>
);

const resources = [
    { name: 'Projects Gallery', href: '/projects', icon: '📂' },
    { name: 'Blog & Articles', href: '/blog', icon: '📝' },
    { name: 'PNW Resources', href: '/resources/pnw', icon: '🎓' },
    { name: 'Official Discord Server', href: 'https://discord.gg/48BWveQJ', icon: <DiscordIcon /> },
    { name: 'GitHub Organization', href: '#', icon: '💻' },
    { name: 'Learning Roadmaps', href: '#', icon: '🗺️' },
];

export default function Resources() {
    return (
        <section className="resources section-padding" id="resources">
            <div className="container">
                <RevealDiv>
                    <div className="aic-label">// DATA VAULT</div>
                    <h2 className="aic-heading">Club <span className="gold">Resources</span></h2>
                    <p className="aic-subtext">Quick access to everything Applied AI Club offers.</p>
                </RevealDiv>

                <div className="resources__grid">
                    {resources.map((r, i) => (
                        <RevealDiv key={i} className="glass-card resources__item">
                            {r.href.startsWith('/') ? (
                                <Link to={r.href} className="resources__link">
                                    <span className="resources__icon">{r.icon}</span>
                                    <span className="resources__name">{r.name}</span>
                                    <span className="resources__arrow">→</span>
                                </Link>
                            ) : (
                                <a href={r.href} className="resources__link" target="_blank" rel="noopener noreferrer">
                                    <span className="resources__icon">{r.icon}</span>
                                    <span className="resources__name">{r.name}</span>
                                    <span className="resources__arrow">→</span>
                                </a>
                            )}
                        </RevealDiv>
                    ))}
                </div>
            </div>
        </section>
    );
}
