import { useEffect, useRef, useState, useCallback } from 'react';
import './Faculty.css';

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

const FACULTY = [
    {
        key: 'raja',
        dept: 'CIT DEPT',
        name: 'Ashok Vardhan Raja, Ph.D.',
        title: 'Assistant Professor of Cybersecurity',
        department: 'Computer Information Technology & Graphics',
        tags: ['Cybersecurity', 'AI-enabled UAVs', 'Machine Learning'],
        status: '● ACTIVE MENTOR',
        color: 'var(--pnw-gold)',
        bio: 'Dr. Raja specializes in cybersecurity, AI-enabled UAV systems, and applied machine learning. He serves as a faculty advisor for the Applied AI Club, guiding students in real-world AI research and development.',
        profileUrl: 'https://www.pnw.edu/people/ashok-vardhan-raja-ph-d/',
        image: '/assets/faculty/ashok-raja.jpg',
    },
    {
        key: 'jiang',
        dept: 'CIT DEPT',
        name: 'Keyuan Jiang, Ph.D.',
        title: 'Professor & Department Chair',
        department: 'Computer Information Technology & Graphics',
        tags: ['AI in Medicine', 'Natural Language Processing', 'Health Informatics'],
        status: '● ACTIVE MENTOR',
        color: 'var(--neon-cyan)',
        bio: 'Dr. Jiang chairs the CIT & Graphics department. His research spans AI applications in medicine, natural language processing, and health informatics. He advises the Applied AI Club on research direction and interdisciplinary AI.',
        profileUrl: 'https://www.pnw.edu/people/keyuan-jiang/',
        image: '/assets/faculty/keyuan-jiang.jpg',
    },
];

function FacultyCard({ data, onClick }) {
    const cardRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const cx = rect.width / 2, cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) * 6;
        cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }, []);

    const handleMouseLeave = useCallback(() => {
        cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    }, []);

    return (
        <div ref={cardRef} className="faculty__card aic-reveal visible"
            onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="faculty__scan" />
            <div className="aic-corner tl" /><div className="aic-corner tr" />
            <div className="aic-corner bl" /><div className="aic-corner br" />
            <div className="faculty__dept">{data.dept}</div>
            <div className="faculty__photo">
                <img
                    src={data.image}
                    alt={data.name}
                    className="faculty__photo-img"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                />
                <svg width="56" height="56" viewBox="0 0 56 56" style={{ display: 'none' }}>
                    <circle cx="28" cy="20" r="11" fill="none" stroke={data.color} strokeWidth="1.5" opacity="0.5" />
                    <path d="M10 50c0-10 8-18 18-18s18 8 18 18" fill="none" stroke={data.color} strokeWidth="1.5" opacity="0.5" />
                </svg>
            </div>
            <div className="faculty__info">
                <div className="faculty__name" onClick={() => onClick(data)} style={{ cursor: 'pointer' }}>{data.name}</div>
                <div className="faculty__title">{data.title}</div>
                {data.department && (
                    <div className="faculty__department">{data.department}</div>
                )}
                <div className="faculty__tags">
                    {data.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <div className="faculty__status">
                    <span className="faculty__dot" /> {data.status}
                </div>
                <a
                    href={data.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="faculty__profile-btn"
                    onClick={e => e.stopPropagation()}
                >
                    VIEW PROFILE ↗
                </a>
            </div>
        </div>
    );
}

function FacultyModal({ data, onClose }) {
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
    }, [onClose]);

    if (!data) return null;
    return (
        <div className="faculty__overlay" onClick={onClose}>
            <div className="faculty__modal" onClick={e => e.stopPropagation()}>
                <button className="faculty__modal-close" onClick={onClose}>✕</button>
                <h3>{data.name}</h3>
                <div className="faculty__modal-title">{data.title}</div>
                {data.department && (
                    <div className="faculty__modal-dept">{data.department}</div>
                )}
                <p className="faculty__modal-bio">{data.bio}</p>
                <div className="faculty__tags" style={{ marginBottom: 20 }}>
                    {data.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <a
                    href={data.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="faculty__profile-btn"
                >
                    VIEW FULL PROFILE ↗
                </a>
            </div>
        </div>
    );
}

export default function Faculty() {
    const [modalFaculty, setModalFaculty] = useState(null);

    return (
        <section className="faculty section-padding" id="faculty">
            <div className="container">
                <RevealDiv>
                    <div className="aic-label">// CREW ROSTER</div>
                    <h2 className="aic-heading">Proud Mentors: <span className="gold">Our Faculty</span></h2>
                    <div className="aic-terminal">
                        &gt; ACCESSING FACULTY DATABASE... [<span style={{ color: 'var(--pnw-gold)' }}>COMPLETE</span>]<span className="blink">_</span>
                    </div>
                </RevealDiv>

                <div className="faculty__grid">
                    {FACULTY.map(f => <FacultyCard key={f.key} data={f} onClick={setModalFaculty} />)}
                </div>
            </div>

            {modalFaculty && <FacultyModal data={modalFaculty} onClose={() => setModalFaculty(null)} />}
        </section>
    );
}
