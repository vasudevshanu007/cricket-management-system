import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLogoutAction } from '../redux/actions/userActions';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Events', to: '/event' },
  { label: 'Practice Sessions', to: '/psession' },
  { label: 'Performance', to: '/Performance' },
  { label: 'Coach Details', to: '/coachlist' },
];

const styles = {
  nav: (scrolled) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: '68px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    transition: 'background 0.3s, box-shadow 0.3s, backdrop-filter 0.3s',
    background: scrolled ? '#0D1B2A' : 'rgba(13, 27, 42, 0.6)',
    backdropFilter: scrolled ? 'none' : 'blur(16px)',
    WebkitBackdropFilter: scrolled ? 'none' : 'blur(16px)',
    boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.5)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(201,162,39,0.15)' : '1px solid rgba(255,255,255,0.05)',
  }),
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1280px', margin: '0 auto' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
  logoBall: { fontSize: '26px', lineHeight: 1 },
  logoText: { fontSize: '22px', fontWeight: '800', color: '#C9A227', letterSpacing: '1px', fontFamily: "'Segoe UI', sans-serif" },
  desktopLinks: { display: 'flex', alignItems: 'center', gap: '4px', listStyle: 'none', margin: 0, padding: 0 },
  navLink: (active) => ({ display: 'block', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', color: active ? '#C9A227' : '#A0B0C8', background: active ? 'rgba(201,162,39,0.1)' : 'transparent', transition: 'color 0.2s, background 0.2s', letterSpacing: '0.3px' }),
  rightSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  loginBtn: { padding: '8px 22px', borderRadius: '8px', border: '2px solid #C9A227', background: 'transparent', color: '#C9A227', fontWeight: '700', fontSize: '14px', cursor: 'pointer', textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s, color 0.2s' },
  avatarBtn: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: '40px', padding: '6px 14px 6px 6px', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' },
  avatarCircle: { width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #C9A227, #E5BC3D)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D1B2A', fontWeight: '800', fontSize: '14px' },
  userName: { fontSize: '13px', fontWeight: '700', color: '#E8EDF3', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chevron: { color: '#A0B0C8', fontSize: '11px', marginLeft: '2px' },
  dropdown: { position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: '#122035', border: '1px solid rgba(201,162,39,0.2)', borderRadius: '12px', minWidth: '200px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', zIndex: 999 },
  dropdownHeader: { padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(201,162,39,0.05)' },
  dropdownHeaderName: { fontSize: '14px', fontWeight: '700', color: '#E8EDF3', marginBottom: '2px' },
  dropdownHeaderRole: { fontSize: '12px', color: '#A0B0C8' },
  dropdownItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', textDecoration: 'none', fontSize: '14px', color: '#A0B0C8', cursor: 'pointer', background: 'transparent', border: 'none', width: '100%', textAlign: 'left', transition: 'background 0.15s, color 0.15s' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' },
  hamburger: { flexDirection: 'column', gap: '5px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px' },
  hamburgerBar: { width: '24px', height: '2px', background: '#C9A227', borderRadius: '2px', transition: 'transform 0.3s' },
  mobileMenu: (open) => ({ position: 'fixed', top: '68px', left: 0, right: 0, background: '#0A1628', borderBottom: '1px solid rgba(201,162,39,0.2)', padding: open ? '16px 0 20px' : '0', maxHeight: open ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease, padding 0.35s ease', zIndex: 999 }),
  mobileLink: { display: 'block', padding: '12px 28px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', color: '#A0B0C8', transition: 'color 0.2s, background 0.2s' },
  mobileDivider: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '8px 0' },
};

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cricindiaUser');
      if (stored) setUser(JSON.parse(stored));
      else setUser(null);
    } catch {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cricindiaUser');
    setUser(null);
    setDropdownOpen(false);
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <nav style={styles.nav(scrolled)} role="navigation" aria-label="Main navigation">
        <div style={styles.inner}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <span style={styles.logoBall}>🏏</span>
            <span style={styles.logoText}>CricINDIA</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul style={styles.desktopLinks} className="desktop-nav">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  style={styles.navLink(location.pathname === link.to)}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.to) {
                      e.currentTarget.style.color = '#E8EDF3';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.to) {
                      e.currentTarget.style.color = '#A0B0C8';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div style={styles.rightSection}>
            {user ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  style={styles.avatarBtn}
                  onClick={() => setDropdownOpen((o) => !o)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div style={styles.avatarCircle}>{getInitials(user.name)}</div>
                  <span style={styles.userName}>{user.name || 'User'}</span>
                  <span style={styles.chevron}>{dropdownOpen ? '▲' : '▼'}</span>
                </button>
                {dropdownOpen && (
                  <div style={styles.dropdown} role="menu">
                    <div style={styles.dropdownHeader}>
                      <div style={styles.dropdownHeaderName}>{user.name || 'User'}</div>
                      <div style={styles.dropdownHeaderRole}>{user.role || 'Member'}</div>
                    </div>
                    <Link to="/user/info" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,162,39,0.08)'; e.currentTarget.style.color = '#E8EDF3'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0B0C8'; }}
                    ><span>👤</span> My Profile</Link>
                    <Link to="/user/myperformance" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,162,39,0.08)'; e.currentTarget.style.color = '#E8EDF3'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0B0C8'; }}
                    ><span>📊</span> My Performance</Link>
                    {user && user.role === 1 && (
                      <Link to="/admin/dashboard" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,162,39,0.08)'; e.currentTarget.style.color = '#E8EDF3'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0B0C8'; }}
                      ><span>⚙️</span> Admin Dashboard</Link>
                    )}
                    <div style={styles.divider} />
                    <button style={{ ...styles.dropdownItem, color: '#E05A5A' }} onClick={handleLogout}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(224,90,90,0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    ><span>🚪</span> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={styles.loginBtn}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,162,39,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >Login</Link>
            )}

            {/* Hamburger */}
            <button
              style={{ ...styles.hamburger, display: 'flex' }}
              className="hamburger-btn"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              <span style={styles.hamburgerBar} />
              <span style={styles.hamburgerBar} />
              <span style={styles.hamburgerBar} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div style={styles.mobileMenu(mobileOpen)} className="mobile-menu">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{ ...styles.mobileLink, color: location.pathname === link.to ? '#C9A227' : '#A0B0C8', borderLeft: location.pathname === link.to ? '3px solid #C9A227' : '3px solid transparent' }}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div style={styles.mobileDivider} />
        {user ? (
          <>
            <Link to="/user/info" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>
              👤 My Profile
            </Link>
            <button
              style={{ ...styles.mobileLink, background: 'none', border: 'none', cursor: 'pointer', color: '#E05A5A', width: '100%', textAlign: 'left' }}
              onClick={() => { handleLogout(); setMobileOpen(false); }}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ ...styles.mobileLink, color: '#C9A227', fontWeight: '700' }} onClick={() => setMobileOpen(false)}>
            Login →
          </Link>
        )}
      </div>

      {/* Spacer */}
      <div style={{ height: '68px' }} />
    </>
  );
}