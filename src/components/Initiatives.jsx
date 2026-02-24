import { useEffect, useRef } from 'react';
import './Initiatives.css';

function RevealDiv({ children, className = '', style }) {
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
    return <div ref={ref} className={`aic-reveal ${className}`} style={style}>{children}</div>;
}

const initiatives = [
    {
        title: 'SaaS App that Connects Students and Professors',
        status: 'In Discovery',
        desc: 'A campus-wide SaaS platform that makes it easy for students to discover professors, book office hours, and join research projects.',
        tags: ['SaaS platform', 'Matching', 'Scheduling'],
        icon: <><rect x="8" y="8" width="32" height="32" rx="4" /><line x1="14" y1="18" x2="34" y2="18" /><line x1="14" y1="26" x2="26" y2="26" /><line x1="14" y1="34" x2="30" y2="34" /></>
    },
    {
        title: 'Smart Parking Prediction System',
        status: 'In Discovery',
        desc: 'Predict campus parking availability in real time, so students and staff know the best lot and time to arrive before they even start driving.',
        tags: ['Vision', 'Forecasting', 'Smart Campus'],
        icon: <><rect x="8" y="14" width="32" height="20" rx="4" /><circle cx="16" cy="34" r="4" /><circle cx="32" cy="34" r="4" /><path d="M12 14l4-8h16l4 8" /></>
    },
    {
        title: 'Smart AI Cafeteria Super App',
        status: 'In Design',
        desc: 'Unified cafeteria app that predicts crowd levels, suggests meals based on health goals, and enables pre-ordering to reduce waste.',
        tags: ['RecSys', 'Forecasting', 'Mobile'],
        icon: <><path d="M6 34h36l-3-20H9l-3 20z" /><line x1="12" y1="14" x2="12" y2="10" /><line x1="24" y1="14" x2="24" y2="10" /><line x1="36" y1="14" x2="36" y2="10" /></>
    },
    {
        title: 'Smart Students Interest Matcher',
        status: 'In Discovery',
        desc: 'An AI matcher that connects students with clubs, hackathons, and research groups based on interests, courses, and GitHub/LinkedIn activity.',
        tags: ['Graph Matching', 'NLP', 'Embeddings'],
        icon: <><circle cx="14" cy="14" r="6" /><circle cx="34" cy="14" r="6" /><circle cx="24" cy="34" r="6" /><line x1="18" y1="18" x2="22" y2="30" /><line x1="30" y1="18" x2="26" y2="30" /><line x1="20" y1="14" x2="28" y2="14" /></>
    },
    {
        title: 'Smart Campus Navigation',
        status: 'Prototype',
        desc: 'A smart navigation layer that knows classrooms, quiet study spots, and transit schedules, predicting occupancy and arrival times.',
        tags: ['Location Intel', 'RL', 'Navigation'],
        icon: <><path d="M24 6c-8 0-14 6-14 14 0 10 14 22 14 22s14-12 14-22c0-8-6-14-14-14z" /><circle cx="24" cy="20" r="5" /></>
    },
    {
        title: 'Campus Real-Time AI Platform',
        status: 'Long-term Vision',
        desc: 'A shared platform that streams real-time campus sensor data into a single agentic layer for experiments and student projects.',
        tags: ['Streaming', 'Agents', 'Infrastructure'],
        icon: <><path d="M12 36c-4 0-7-3-7-7 0-3.5 3-6.5 6.5-7 1-5 5-9 10.5-9 6 0 11 5 11 11 4 0 7 3 7 7s-3 7-7 7H12z" /><circle cx="24" cy="26" r="3" /></>
    }
];

export default function Initiatives() {
    return (
        <section className="initiatives section-padding" id="initiatives">
            <div className="container">
                <RevealDiv>
                    <div className="aic-label">// ACTIVE PROJECTS</div>
                    <h2 className="aic-heading">Use Cases & <span className="gold">Research</span></h2>
                    <p className="aic-subtext">Real campus projects we’re exploring this year — from parking and cafeterias to navigation and student matching.</p>
                </RevealDiv>

                <div className="initiatives__grid">
                    {initiatives.map((item, i) => (
                        <RevealDiv key={i} className="glass-card initiatives__tile">
                            <div className="initiatives__header">
                                <div className="initiatives__icon">
                                    <svg viewBox="0 0 48 48">{item.icon}</svg>
                                </div>
                                <span className={`status-badge status--${item.status.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                                    {item.status}
                                </span>
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                            <div className="initiatives__tags">
                                {item.tags.map(t => <span key={t} className="tag">{t}</span>)}
                            </div>
                        </RevealDiv>
                    ))}
                </div>
            </div>
        </section>
    );
}
