import React from 'react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Events', to: '/event' },
  { label: 'Practice Sessions', to: '/psession' },
  { label: 'Player Performance', to: '/Performance' },
  { label: 'Coach Details', to: '/coachlist' },
];

const resources = [
  { label: 'Register', to: '/register' },
  { label: 'Login', to: '/login' },
  { label: 'Admin Dashboard', to: '/admin/dashboard' },
];

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
];

const s = {
  footer: { background: '#0A1628', borderTop: '2px solid #C9A227', fontFamily: "'Segoe UI', sans-serif", color: '#A0B0C8' },
  mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', maxWidth: '1200px', margin: '0 auto', padding: '60px 32px 48px' },
  brand: { display: 'flex', flexDirection: 'column' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', textDecoration: 'none' },
  logoBall: { fontSize: '28px' },
  logoText: { fontSize: '22px', fontWeight: '800', color: '#C9A227', letterSpacing: '1px' },
  tagline: { fontSize: '13px', color: '#A0B0C8', lineHeight: 1.7, marginBottom: '20px', maxWidth: '260px' },
  accentLine: { width: '48px', height: '3px', background: 'linear-gradient(90deg, #C9A227, #E5BC3D)', borderRadius: '2px', marginBottom: '20px' },
  badgeRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  badge: { background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.25)', color: '#C9A227', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px' },
  col: {},
  colTitle: { fontSize: '13px', fontWeight: '700', color: '#C9A227', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid rgba(201,162,39,0.2)' },
  linkList: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' },
  footerLink: { textDecoration: 'none', color: '#7A8FA8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' },
  linkArrow: { fontSize: '10px', color: '#C9A227', opacity: 0.6 },
  socialGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' },
  socialBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', textDecoration: 'none', color: '#7A8FA8', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s, color 0.2s, border-color 0.2s', cursor: 'pointer' },
  bottom: { borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 32px' },
  bottomInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', maxWidth: '1200px', margin: '0 auto' },
  copyright: { fontSize: '13px', color: '#4A5F74' },
  bottomLinks: { display: 'flex', gap: '20px' },
  bottomLink: { fontSize: '13px', color: '#4A5F74', textDecoration: 'none', transition: 'color 0.2s' },
};

export default function Footer() {
  const handleLinkHover = (e, hovered) => {
    e.currentTarget.style.color = hovered ? '#C9A227' : '#7A8FA8';
  };

  const handleSocialHover = (e, hovered) => {
    e.currentTarget.style.background = hovered ? 'rgba(201,162,39,0.1)' : 'rgba(255,255,255,0.04)';
    e.currentTarget.style.color = hovered ? '#C9A227' : '#7A8FA8';
    e.currentTarget.style.borderColor = hovered ? 'rgba(201,162,39,0.3)' : 'rgba(255,255,255,0.08)';
  };

  return (
    <footer style={s.footer}>
      <div style={s.mainGrid}>

        {/* Brand Column */}
        <div style={s.brand}>
          <Link to="/" style={s.logoRow}>
            <span style={s.logoBall}>🏏</span>
            <span style={s.logoText}>CricINDIA</span>
          </Link>
          <p style={s.tagline}>India&apos;s Premier Cricket Franchise &mdash; nurturing champions, building legacies, and celebrating the spirit of cricket.</p>
          <div style={s.accentLine} />
          <div style={s.badgeRow}>
            <span style={s.badge}>Est. 2006</span>
            <span style={s.badge}>BCCI Affiliated</span>
            <span style={s.badge}>18+ Titles</span>
          </div>
        </div>

        {/* Quick Links */}
        <div style={s.col}>
          <h3 style={s.colTitle}>Quick Links</h3>
          <ul style={s.linkList}>
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} style={s.footerLink}
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                >
                  <span style={s.linkArrow}>►</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div style={s.col}>
          <h3 style={s.colTitle}>Resources</h3>
          <ul style={s.linkList}>
            {resources.map((link) => (
              <li key={link.to}>
                <Link to={link.to} style={s.footerLink}
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                >
                  <span style={s.linkArrow}>►</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div style={s.col}>
          <h3 style={s.colTitle}>Connect</h3>
          <div style={s.socialGrid}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                style={s.socialBtn}
                aria-label={social.label}
                onMouseEnter={(e) => handleSocialHover(e, true)}
                onMouseLeave={(e) => handleSocialHover(e, false)}
              >
                {social.icon}
                <span>{social.label.split(' ')[0]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={s.bottom}>
        <div style={s.bottomInner}>
          <p style={s.copyright}>
            &copy; 2025 <span style={{ color: '#C9A227', fontWeight: '700' }}>CricINDIA</span>. All Rights Reserved.
          </p>
          <div style={s.bottomLinks}>
            <Link to="/privacy" style={s.bottomLink}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#C9A227'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#4A5F74'; }}
            >Privacy Policy</Link>
            <Link to="/terms" style={s.bottomLink}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#C9A227'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#4A5F74'; }}
            >Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}