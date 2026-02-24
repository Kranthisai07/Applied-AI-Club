import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoBrand from './LogoBrand';
import './Navbar.css';

const navLinks = [
    { label: 'ABOUT', href: '#about' },
    { label: 'PROJECTS', href: '#initiatives' },
    { label: 'EVENTS', href: '#events' },
    { label: 'TEAM', href: '#members' },
    { label: 'FACULTY', href: '#faculty' },
    { label: 'RESOURCES', href: '#resources' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            if (!isHome) return;
            const sections = navLinks.map(l => l.href.slice(1));
            let current = '';
            for (const id of sections) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= 200) current = id;
            }
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    const handleNavClick = (href) => {
        setMobileOpen(false);
        if (!isHome) window.location.href = '/' + href;
    };

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar__inner container">
                <Link to="/" className="navbar__logo" aria-label="Applied AI Club — Home">
                    <LogoBrand size="small" showText={false} />
                </Link>

                <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
                    {navLinks.map(link => (
                        <a
                            key={link.href}
                            href={isHome ? link.href : '/' + link.href}
                            className={`navbar__link ${activeSection === link.href.slice(1) ? 'navbar__link--active' : ''}`}
                            onClick={() => handleNavClick(link.href)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a href="#join" className="btn-primary navbar__cta" onClick={() => setMobileOpen(false)}>
                        JOIN
                    </a>
                </div>

                <button
                    className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span><span></span><span></span>
                </button>
            </div>
        </nav>
    );
}
