import { useEffect, useRef } from 'react';
import './JoinUs.css';

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

export default function JoinUs() {
    return (
        <section className="joinus section-padding" id="join">
            <div className="container">
                <RevealDiv className="joinus__inner">
                    <div className="aic-label">// UPLOAD PROTOCOL</div>
                    <h2 className="aic-heading">Ready to <span className="gold">Join</span>?</h2>
                    <p className="aic-subtext" style={{ textAlign: 'center', margin: '0 auto 32px' }}>
                        Become part of Applied AI Club at Purdue University Northwest. Build real projects,
                        collaborate with researchers, and push the boundaries of applied intelligence.
                    </p>
                    <div className="joinus__ctas">
                        <a href="https://forms.gle/placeholder" target="_blank" rel="noopener noreferrer" className="btn-primary">
                            Apply Now
                        </a>
                        <a href="mailto:appliedaiclub@pnw.edu" className="btn-outline">
                            Contact Us
                        </a>
                    </div>
                    <div className="joinus__note">
                        <span style={{ color: 'var(--pnw-gold)' }}>&gt;</span> Open to all PNW students — no prior AI experience required.
                    </div>
                </RevealDiv>
            </div>
        </section>
    );
}
