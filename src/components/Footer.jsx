import LogoBrand from './LogoBrand';
import './Footer.css';

/* ── Inline SVG icons (no lucide-react dependency) ── */
const IconGithub = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer__social-icon">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

const IconLinkedin = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer__social-icon">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const IconInstagram = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer__social-icon">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const IconDiscord = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="footer__social-icon">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
);

const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#initiatives' },
    { label: 'Events', href: '#events' },
    { label: 'Team', href: '#members' },
    { label: 'Faculty', href: '#faculty' },
];

const SOCIALS = [
    { Icon: IconInstagram, label: 'Instagram', href: '#', hoverClass: 'footer__social-link--ig' },
    { Icon: IconLinkedin, label: 'LinkedIn', href: '#', hoverClass: 'footer__social-link--li' },
    { Icon: IconDiscord, label: 'Discord', href: 'https://discord.gg/48BWveQJ', hoverClass: 'footer__social-link--dc' },
    { Icon: IconGithub, label: 'GitHub', href: '#', hoverClass: 'footer__social-link--gh' },
];

export default function Footer() {
    return (
        <footer className="footer" id="footer">
            <div className="footer__top-line" />

            <div className="container footer__grid">
                {/* ── LEFT : Brand ── */}
                <div className="footer__col footer__col--brand">
                    <LogoBrand size="small" />
                    <div className="footer__brand-text">
                        <div className="footer__brand-name">APPLIED AI CLUB</div>
                        <div className="footer__brand-uni">PURDUE UNIVERSITY NORTHWEST</div>
                    </div>
                    <p className="footer__tagline">Student-run. Research-driven. AI-first.</p>
                </div>

                {/* ── RIGHT : Socials ── */}
                <div className="footer__col footer__col--social">
                    <div className="footer__col-heading">// SECURE_CHANNELS</div>
                    <div className="footer__socials">
                        {SOCIALS.map(({ Icon, label, href, hoverClass }) => (
                            <a
                                key={label}
                                href={href}
                                className={`footer__social-link ${hoverClass}`}
                                aria-label={label}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Icon />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── BOTTOM DISCLAIMER ── */}
            <div className="footer__bottom">
                <div className="container footer__bottom-inner">
                    <span className="footer__disclaimer">
                        Applied AI Club is a student-run organization at Purdue University Northwest.
                    </span>
                    <span className="footer__copy">
                        &copy; {new Date().getFullYear()} Applied AI Club. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}
