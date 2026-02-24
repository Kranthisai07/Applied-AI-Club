import { useEffect, useRef } from 'react';
import './Events.css';

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

const events = [
    {
        date: '2026 · MAR',
        title: 'TED Talk Event',
        type: 'Talk / Speaker Event',
        location: 'Purdue University Northwest',
        desc: 'An inspiring talk series bringing together voices in AI, technology, and innovation. Stay tuned for speaker announcements and registration details.',
        status: 'Upcoming',
        priority: true,
        comingSoon: 'Coming in March 2026',
    },
    {
        date: '2026 · FEB · 10',
        title: 'Meet & Greet',
        type: 'Social / Kickoff',
        location: 'Purdue University Northwest',
        desc: 'Our first club gathering — members met each other, met faculty mentors, and aligned on the club\'s vision for the semester.',
        status: 'Completed',
        priority: false,
    },
];

export default function Events() {
    return (
        <section className="events section-padding" id="events">
            <div className="container">
                <RevealDiv>
                    <div className="aic-label">// MISSION LOG</div>
                    <h2 className="aic-heading">Events &amp; <span className="gold">Timeline</span></h2>
                    <p className="aic-subtext">A record of gatherings, talks, and milestones for the Applied AI Club at PNW.</p>
                </RevealDiv>

                <div className="events__timeline">
                    {events.map((ev, i) => (
                        <RevealDiv key={i} className="events__item">
                            <div className="events__marker">
                                <div className={`events__dot ${ev.priority ? 'events__dot--priority' : ''}`} />
                                {i < events.length - 1 && <div className="events__line" />}
                            </div>
                            <div className={`glass-card events__card ${ev.priority ? 'events__card--priority' : ''}`}>
                                {ev.priority && (
                                    <span className="events__priority-badge">● PRIORITY — NEXT UP</span>
                                )}
                                <div className="events__card-top">
                                    <div className="events__date">{ev.date}</div>
                                    <span className="events__type">{ev.type}</span>
                                </div>
                                <h3 className="events__title">{ev.title}</h3>
                                <p className="events__desc">{ev.desc}</p>
                                <div className="events__meta">
                                    <span className="events__location">📍 {ev.location}</span>
                                    {ev.comingSoon && (
                                        <span className="events__countdown">{ev.comingSoon}</span>
                                    )}
                                </div>
                                <span className={`events__status ${ev.status === 'Upcoming' ? 'events__status--upcoming' : ''}`}>
                                    {ev.status === 'Upcoming' ? <><span className="events__pulse-dot" /> UPCOMING ⟶</> : 'COMPLETED ✓'}
                                </span>
                            </div>
                        </RevealDiv>
                    ))}
                </div>
            </div>
        </section>
    );
}
