import { useEffect, useRef } from 'react';
import './Members.css';

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

const members = [
    { name: 'Basil Ebinesar', role: 'President', image: '/assets/team/basil.jpg' },
    { name: 'Ghaayathri Devi K', role: 'Vice-President', image: '/assets/team/ghaayathri.jpg' },
    { name: 'Charansai Maddineni', role: 'Secretary', image: '/assets/team/charansai.jpg' },
    { name: 'Tanvi Tomar', role: 'Treasurer', image: '/assets/team/tanvi.jpg' },
    { name: 'Kranthi Gadi', role: 'Tech Lead', image: '/assets/team/kranthi.jpg' },
    { name: 'Sam Franco', role: 'Officer - Videographer', image: '/assets/team/sam.jpg' },
    { name: 'Panagiotis Papadopoulos', role: 'Event Planner', image: '/assets/team/panagiotis.jpg' },
];

export default function Members() {
    return (
        <section className="members section-padding" id="members">
            <div className="container">
                <RevealDiv>
                    <div className="aic-label">// CORE TEAM</div>
                    <h2 className="aic-heading">Our <span className="gold">Team</span></h2>
                    <p className="aic-subtext">The operators behind Applied AI Club.</p>
                </RevealDiv>

                <div className="members__grid">
                    {members.map((m, i) => (
                        <RevealDiv key={i} className="glass-card members__card">
                            <div className="members__avatar">
                                <img
                                    src={m.image}
                                    alt={m.name}
                                    className="members__avatar-img"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                />
                                {/* Fallback SVG if image fails to load */}
                                <div className="members__avatar-fallback" style={{ display: 'none' }}>
                                    <svg width="56" height="56" viewBox="0 0 56 56">
                                        <circle cx="28" cy="20" r="11" fill="none" stroke="var(--pnw-gold)" strokeWidth="1.5" opacity="0.5" />
                                        <path d="M10 50c0-10 8-18 18-18s18 8 18 18" fill="none" stroke="var(--pnw-gold)" strokeWidth="1.5" opacity="0.5" />
                                    </svg>
                                </div>
                            </div>
                            <div className="members__info">
                                <h3>{m.name}</h3>
                                <div className="members__role">{m.role}</div>
                            </div>
                        </RevealDiv>
                    ))}
                </div>
            </div>
        </section>
    );
}
