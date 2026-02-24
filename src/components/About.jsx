import { useEffect, useRef } from 'react';
import './About.css';

function useReveal() {
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
    return ref;
}

function RevealDiv({ children, className = '', style }) {
    const ref = useReveal();
    return <div ref={ref} className={`aic-reveal ${className}`} style={style}>{children}</div>;
}

export default function About() {
    return (
        <section className="about section-padding" id="about">
            <div className="container">
                <RevealDiv>
                    <div className="aic-label">// SYSTEM OVERVIEW</div>
                    <h2 className="aic-heading">What Is <span className="gold">Applied AI Club</span>?</h2>
                    <p className="aic-subtext">
                        We are a student-run organization at Purdue University Northwest dedicated to
                        hands-on learning in applied artificial intelligence.
                    </p>
                    <p className="aic-subtext" style={{ marginTop: '12px' }}>
                        From building LLM-powered agents to exploring computer vision, NLP, and trustworthy
                        AI systems — we bridge the gap between classroom theory and real-world AI practice.
                        Whether you're just starting out or already shipping models, Applied AI Club is your launchpad.
                    </p>
                </RevealDiv>

                <div className="about__grid">
                    {[
                        {
                            title: 'Compute & Cloud',
                            desc: 'GPU / CPU clusters, containers, and scalable infrastructure for running experiments of any size — from quick prototypes to massive training runs.',
                            icon: <><rect x="8" y="14" width="48" height="36" rx="4" /><line x1="20" y1="50" x2="44" y2="50" /><circle cx="32" cy="32" r="8" strokeDasharray="4 3" /></>
                        },
                        {
                            title: 'Applied AI & Agents',
                            desc: 'Multi-agent systems, large language models, computer vision, and NLP pipelines — built and tested on real data for real applications.',
                            icon: <><circle cx="32" cy="20" r="10" /><circle cx="14" cy="44" r="7" /><circle cx="50" cy="44" r="7" /><line x1="25" y1="27" x2="18" y2="39" /><line x1="39" y1="27" x2="46" y2="39" /><line x1="21" y1="44" x2="43" y2="44" /></>
                        },
                        {
                            title: 'Real-World Impact',
                            desc: 'Solving challenges in healthcare, manufacturing, transportation, cybersecurity, finance, and beyond — AI that goes from the lab to the field.',
                            icon: <><circle cx="32" cy="32" r="22" /><ellipse cx="32" cy="32" rx="22" ry="10" /><line x1="32" y1="10" x2="32" y2="54" /></>
                        },
                    ].map((c, i) => (
                        <RevealDiv key={i} className="glass-card about__card">
                            <div className="about__card-icon">
                                <svg viewBox="0 0 64 64">{c.icon}</svg>
                            </div>
                            <h3>{c.title}</h3>
                            <p>{c.desc}</p>
                            <div className="about__circuit-line" />
                        </RevealDiv>
                    ))}
                </div>
            </div>
        </section>
    );
}
