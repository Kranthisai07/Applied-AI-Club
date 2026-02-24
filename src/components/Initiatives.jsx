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
        title: 'Computer Vision for Manufacturing',
        desc: 'Automated quality inspection using deep learning models trained on production-line imagery.',
        tags: ['Vision', 'Deep Learning', 'Industry'],
        icon: <><rect x="6" y="10" width="36" height="28" rx="3" /><circle cx="24" cy="24" r="8" /><line x1="24" y1="16" x2="24" y2="32" strokeDasharray="2 2" /><line x1="16" y1="24" x2="32" y2="24" strokeDasharray="2 2" /></>
    },
    {
        title: 'Predictive Analytics for Energy',
        desc: 'Time-series forecasting models that optimize energy grid management and distribution efficiency.',
        tags: ['Forecasting', 'Energy', 'Data Science'],
        icon: <><polyline points="6,36 14,28 22,32 30,18 38,22 46,12" /><line x1="6" y1="42" x2="46" y2="42" /><line x1="6" y1="42" x2="6" y2="10" /></>
    },
    {
        title: 'NLP for Education & Support',
        desc: 'Intelligent document analysis and chatbot systems that streamline student support and advising.',
        tags: ['NLP', 'LLMs', 'Education'],
        icon: <><rect x="10" y="6" width="28" height="36" rx="4" /><line x1="16" y1="14" x2="32" y2="14" /><line x1="16" y1="20" x2="28" y2="20" /><line x1="16" y1="26" x2="30" y2="26" /></>
    },
    {
        title: 'AI Agents & Automation',
        desc: 'Multi-agent reinforcement learning for autonomous decision-making in logistics and scheduling.',
        tags: ['Agents', 'RL', 'Automation'],
        icon: <><circle cx="24" cy="18" r="10" /><path d="M14 40c0-5.5 4.5-10 10-10s10 4.5 10 10" /><line x1="34" y1="14" x2="42" y2="8" /><circle cx="42" cy="8" r="3" /></>
    },
    {
        title: 'Healthcare AI & Diagnostics',
        desc: 'Medical imaging analysis and clinical NLP to accelerate diagnostics and personalize treatment.',
        tags: ['Healthcare', 'Vision', 'NLP'],
        icon: <><path d="M24 6v36M6 24h36" /><circle cx="24" cy="24" r="16" /><circle cx="24" cy="24" r="6" /></>
    },
    {
        title: 'Cybersecurity & Threat Intel',
        desc: 'Deep learning for network intrusion detection, anomaly classification, and automated response.',
        tags: ['Security', 'Deep Learning', 'Networks'],
        icon: <><rect x="6" y="14" width="16" height="20" rx="3" /><rect x="26" y="14" width="16" height="20" rx="3" /><line x1="22" y1="22" x2="26" y2="22" /><line x1="22" y1="28" x2="26" y2="28" /></>
    }
];

export default function Initiatives() {
    return (
        <section className="initiatives section-padding" id="initiatives">
            <div className="container">
                <RevealDiv>
                    <div className="aic-label">// ACTIVE PROJECTS</div>
                    <h2 className="aic-heading">Use Cases & <span className="gold">Research</span></h2>
                    <p className="aic-subtext">From manufacturing floors to hospital systems — Applied AI Club powers research that matters.</p>
                </RevealDiv>

                <div className="initiatives__grid">
                    {initiatives.map((item, i) => (
                        <RevealDiv key={i} className="glass-card initiatives__tile">
                            <div className="initiatives__icon">
                                <svg viewBox="0 0 48 48">{item.icon}</svg>
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
