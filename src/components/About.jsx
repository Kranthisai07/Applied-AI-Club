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
                    <div className="aic-label">// WHY JOIN</div>
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
                    <p className="aic-subtext aic-lead-in">
                        Here’s what you actually get when you’re part of the club.
                    </p>
                </RevealDiv>

                <div className="about__grid">
                    {[
                        {
                            title: 'Hands-On Campus Projects',
                            desc: 'Build real AI systems for our own campus — from smart parking and cafeteria prediction to student-interest matching and navigation.',
                            bottom: 'Smart Parking · Smart Cafeteria · Interest Matcher · Campus Navigation',
                            icon: <><rect x="12" y="16" width="40" height="32" rx="2" /><path d="M12 28h40M24 16v32M40 16v32" /><path d="M8 8l8 8M56 8l-8 8M8 56l8-8M56 56l-8-8" strokeWidth="1" opacity="0.5" /></>
                        },
                        {
                            title: 'Agents, Tools & Infrastructure',
                            desc: 'Experiment with LLM agents, MCP/A2A protocols, and modern AI stacks — not just toy prompts, but systems wired into real tools and data.',
                            bottom: 'Multi-agent systems · MCP · A2A · Tooling',
                            icon: <><circle cx="32" cy="32" r="8" /><circle cx="32" cy="10" r="4" /><circle cx="32" cy="54" r="4" /><circle cx="10" cy="32" r="4" /><circle cx="54" cy="32" r="4" /><path d="M32 18v6M32 40v6M18 32h6M40 32h6" /></>
                        },
                        {
                            title: 'Faculty Mentors & Research',
                            desc: 'Learn directly from PNW faculty mentors and discover pathways into research, labs, and grad projects with real-world impact.',
                            bottom: 'Cybersecurity · Applied AI · Data Science Mentorship',
                            link: '#faculty',
                            icon: <><path d="M32 8l20 10v16c0 10-8 18-20 22-12-4-20-12-20-22V18L32 8z" /><circle cx="32" cy="28" r="6" /><path d="M24 40h16M32 34v10" /></>
                        },
                        {
                            title: 'Community & Career Launchpad',
                            desc: 'Meet other builders, ship side projects, prep for hackathons and internships, and turn your AI journey into a standout portfolio.',
                            bottom: 'Meetups · Hackathons · Portfolio · Internships',
                            icon: <><circle cx="20" cy="20" r="6" /><circle cx="44" cy="20" r="6" /><circle cx="32" cy="44" r="6" /><path d="M26 20h12M24 24l4 12M40 24l-4 12" /></>
                        },
                    ].map((c, i) => (
                        <RevealDiv
                            key={i}
                            className="glass-card about__card"
                            style={{ cursor: c.link ? 'pointer' : 'default' }}
                            onClick={() => c.link && (window.location.hash = c.link)}
                        >
                            <div className="about__card-icon">
                                <svg viewBox="0 0 64 64">{c.icon}</svg>
                            </div>
                            <h3>{c.title}</h3>
                            <p className="about__card-desc">{c.desc}</p>
                            <div className="about__card-bottom">{c.bottom}</div>
                            <div className="about__circuit-line" />
                        </RevealDiv>
                    ))}
                </div>
            </div>
        </section>
    );
}
