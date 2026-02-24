import { Link } from 'react-router-dom';
import './PNWResourcesPage.css';

const categories = [
    {
        title: '🏛️ UNIVERSITY',
        links: [
            { name: 'PNW Homepage', url: 'https://www.pnw.edu' },
            { name: 'Academic Catalog', url: 'https://www.pnw.edu/catalog/' },
            { name: 'Student Portal', url: 'https://www.pnw.edu/students/' },
        ]
    },
    {
        title: '💻 PROGRAMS',
        links: [
            { name: 'Computer Science Department', url: 'https://www.pnw.edu/computer-science/' },
            { name: 'Applied AI Certificate', url: 'https://www.pnw.edu' },
            { name: 'Graduate Programs', url: 'https://www.pnw.edu' },
        ]
    },
    {
        title: '🔬 RESEARCH LABS',
        links: [
            { name: 'NEXIS Lab (Dr. Yang Ni)', url: 'https://www.pnw.edu' },
            { name: 'AIS Lab (Dr. Wei David Dai)', url: 'https://www.pnw.edu' },
            { name: 'TRUST-IT Lab (Dr. Shafkat Islam)', url: 'https://www.pnw.edu' },
        ]
    },
];

export default function PNWResourcesPage() {
    return (
        <div className="pnw-resources section-padding">
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <div className="aic-label">// EXTERNAL CONNECTIONS</div>
                    <h2 className="aic-heading">PNW <span className="gold">Resources</span></h2>
                    <p className="aic-subtext">Official Purdue University Northwest links and academic resources.</p>
                </div>

                <div className="glass-card pnw-resources__disclaimer">
                    <div className="pnw-resources__disclaimer-header">⚠️ DISCLAIMER</div>
                    <p className="pnw-resources__disclaimer-text">
                        Applied AI Club is a student-run organization at Purdue University Northwest.
                        This website is NOT an official PNW web property. Links below lead to official university domains.
                    </p>
                </div>

                <div className="pnw-resources__grid">
                    {categories.map((cat, i) => (
                        <div key={i} className="glass-card pnw-resources__category">
                            <h3 className="pnw-resources__cat-title">{cat.title}</h3>
                            <div className="pnw-resources__links">
                                {cat.links.map((link, j) => (
                                    <a key={j} href={link.url} target="_blank" rel="noopener noreferrer" className="pnw-resources__link">
                                        <span className="pnw-resources__link-name">{link.name}</span>
                                        <span className="pnw-resources__link-arrow">↗</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pnw-resources__back">
                    <Link to="/" className="btn-outline">← RETURN TO HOME</Link>
                </div>
            </div>
        </div>
    );
}
