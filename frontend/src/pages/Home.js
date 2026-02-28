import React, { useState, useEffect } from 'react';
import NavBar from '../component/NavBar';
import { Link } from 'react-router-dom';
import Footer from '../component/Footer';

const slideData = [
  { image: 'https://images.unsplash.com/photo-1540747913346-19212a4f4975?w=1600&q=80', headline: 'Welcome to CricINDIA', sub: "India's Premier Cricket Franchise Management Platform" },
  { image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600&q=80', headline: 'Train. Perform. Excel.', sub: 'Empowering players with world-class coaching and analytics' },
  { image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1600&q=80', headline: 'Join the Legacy', sub: 'Become part of a championship-winning cricket family' },
];

const stats = [
  { value: '500+', label: 'Players Enrolled', icon: '🏏' },
  { value: '120+', label: 'Matches Played', icon: '🏆' },
  { value: '40+', label: 'Expert Coaches', icon: '🎯' },
  { value: '18+', label: 'Championships Won', icon: '🥇' },
];

const features = [
  { icon: '📊', title: 'Performance Analytics', desc: 'Track every run, wicket, and milestone with our advanced analytics dashboard tailored for players and coaches.' },
  { icon: '🏋️', title: 'Practice Sessions', desc: 'Schedule and manage high-intensity practice sessions with real-time attendance and drill tracking.' },
  { icon: '📅', title: 'Events Management', desc: 'Organize tournaments, friendlies, and internal leagues with our seamless event management system.' },
  { icon: '🧑‍🏫', title: 'Coaching Hub', desc: 'Connect with certified coaches, review coaching plans, and get personalized feedback after every session.' },
  { icon: '🛡️', title: 'Equipment Tracking', desc: 'Monitor inventory, assign equipment to players, and manage requests without any paperwork.' },
  { icon: '💰', title: 'Finance & Billing', desc: 'Handle player registrations, fee collection, and financial reporting in one centralized place.' },
];

const steps = [
  { step: '01', title: 'Register Your Account', desc: 'Sign up as a player, coach, or franchise admin in under two minutes.' },
  { step: '02', title: 'Complete Your Profile', desc: 'Add your cricket history, preferred position, and upload your photo.' },
  { step: '03', title: 'Join Events & Sessions', desc: 'Browse upcoming matches and practice sessions and register with one click.' },
  { step: '04', title: 'Track Your Growth', desc: 'View performance reports, earn badges, and climb the franchise leaderboard.' },
];

const dotStyle = (active) => ({
  width: active ? '28px' : '10px',
  height: '10px',
  borderRadius: '999px',
  background: active ? '#C9A227' : 'rgba(255,255,255,0.4)',
  cursor: 'pointer',
  transition: 'all 0.3s',
  border: 'none',
  padding: 0,
});

const styles = {
  page: { background: '#0D1B2A', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", color: '#E8EDF3', overflowX: 'hidden' },
  heroWrapper: { position: 'relative', width: '100%', height: '100vh', minHeight: '600px', overflow: 'hidden' },
  slideImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 1s ease-in-out' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.65) 50%, rgba(201,162,39,0.15) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' },
  heroBadge: { display: 'inline-block', background: 'rgba(201,162,39,0.15)', border: '1px solid #C9A227', color: '#C9A227', borderRadius: '999px', padding: '6px 20px', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' },
  heroHeadline: { fontSize: 'clamp(36px, 6vw, 76px)', fontWeight: '800', lineHeight: 1.1, marginBottom: '20px', background: 'linear-gradient(90deg, #FFFFFF 0%, #C9A227 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  heroSub: { fontSize: 'clamp(15px, 2vw, 20px)', color: '#A0B0C8', maxWidth: '620px', lineHeight: 1.7, marginBottom: '40px' },
  heroBtns: { display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' },
  btnGold: { background: 'linear-gradient(135deg, #C9A227 0%, #E5BC3D 100%)', color: '#0D1B2A', fontWeight: '700', padding: '14px 32px', borderRadius: '8px', border: 'none', fontSize: '15px', cursor: 'pointer', textDecoration: 'none', display: 'inline-block', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 20px rgba(201,162,39,0.4)' },
  btnOutline: { background: 'transparent', color: '#C9A227', fontWeight: '700', padding: '14px 32px', borderRadius: '8px', border: '2px solid #C9A227', fontSize: '15px', cursor: 'pointer', textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s, color 0.2s' },
  dotRow: { position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' },
  statsSection: { padding: '80px 24px', background: '#0A1628' },
  sectionInner: { maxWidth: '1200px', margin: '0 auto' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginTop: '48px' },
  statCard: { background: 'linear-gradient(145deg, #0D1B2A, #122035)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: '16px', padding: '36px 24px', textAlign: 'center', transition: 'transform 0.3s, border-color 0.3s', cursor: 'default' },
  statIcon: { fontSize: '40px', marginBottom: '12px' },
  statValue: { fontSize: '42px', fontWeight: '800', color: '#C9A227', lineHeight: 1, marginBottom: '8px' },
  statLabel: { fontSize: '15px', color: '#A0B0C8', fontWeight: '500' },
  sectionBadge: { display: 'inline-block', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)', color: '#C9A227', borderRadius: '999px', padding: '5px 18px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' },
  sectionTitle: { fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: '800', color: '#E8EDF3', marginBottom: '12px' },
  sectionDesc: { fontSize: '16px', color: '#A0B0C8', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 },
  sectionHeader: { textAlign: 'center' },
  featuresSection: { padding: '80px 24px', background: '#0D1B2A' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '52px' },
  featureCard: { background: 'linear-gradient(145deg, #0A1628, #0D1B2A)', border: '1px solid rgba(201,162,39,0.15)', borderRadius: '16px', padding: '32px 28px', transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s', cursor: 'default' },
  featureIcon: { fontSize: '38px', marginBottom: '16px', background: 'rgba(201,162,39,0.1)', width: '64px', height: '64px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: '19px', fontWeight: '700', color: '#E8EDF3', marginBottom: '10px' },
  featureDesc: { fontSize: '14px', color: '#A0B0C8', lineHeight: 1.8 },
  stepsSection: { padding: '80px 24px', background: '#0A1628' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '32px', marginTop: '52px' },
  stepCard: { position: 'relative', background: 'linear-gradient(145deg, #0D1B2A, #122035)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: '16px', padding: '36px 24px 28px', textAlign: 'center' },
  stepNum: { fontSize: '48px', fontWeight: '900', color: 'rgba(201,162,39,0.15)', lineHeight: 1, marginBottom: '12px' },
  stepTitle: { fontSize: '18px', fontWeight: '700', color: '#E8EDF3', marginBottom: '10px' },
  stepDesc: { fontSize: '14px', color: '#A0B0C8', lineHeight: 1.8 },
  ctaSection: { padding: '90px 24px', background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2D45 50%, #0D1B2A 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  ctaGlow: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  ctaTitle: { fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', color: '#E8EDF3', marginBottom: '16px', position: 'relative' },
  ctaDesc: { fontSize: '17px', color: '#A0B0C8', maxWidth: '540px', margin: '0 auto 36px', lineHeight: 1.8, position: 'relative' },
};

export default function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % slideData.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCardHover = (e, hovered) => {
    e.currentTarget.style.transform = hovered ? 'translateY(-6px)' : 'translateY(0)';
    e.currentTarget.style.borderColor = hovered ? 'rgba(201,162,39,0.5)' : 'rgba(201,162,39,0.15)';
    e.currentTarget.style.boxShadow = hovered ? '0 16px 40px rgba(201,162,39,0.12)' : 'none';
  };

  const handleStatHover = (e, hovered) => {
    e.currentTarget.style.transform = hovered ? 'translateY(-4px)' : 'translateY(0)';
    e.currentTarget.style.borderColor = hovered ? 'rgba(201,162,39,0.4)' : 'rgba(201,162,39,0.2)';
  };

  return (
    <div style={styles.page}>

      <NavBar />

      {/* HERO */}
      <section style={styles.heroWrapper}>
        {slideData.map((s, i) => (
          <img key={i} src={s.image} alt={s.headline}
            style={{ ...styles.slideImg, opacity: i === slide ? 1 : 0, zIndex: i === slide ? 1 : 0 }} />
        ))}
        <div style={{ ...styles.heroOverlay, zIndex: 2 }}>
          <span style={styles.heroBadge}>India&apos;s #1 Cricket Franchise</span>
          <h1 style={styles.heroHeadline}>{slideData[slide].headline}</h1>
          <p style={styles.heroSub}>{slideData[slide].sub}</p>
          <div style={styles.heroBtns}>
            <Link to="/register" style={styles.btnGold}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,162,39,0.55)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,162,39,0.4)'; }}
            >Join CricINDIA</Link>
            <Link to="/events" style={styles.btnOutline}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,162,39,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >View Events</Link>
          </div>
        </div>
        <div style={{ ...styles.dotRow, zIndex: 3 }}>
          {slideData.map((_, i) => (
            <button key={i} style={dotStyle(i === slide)} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={styles.statsSection}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionBadge}>By The Numbers</span>
            <h2 style={styles.sectionTitle}>Our Achievements Speak</h2>
            <p style={styles.sectionDesc}>Over a decade of dedication, we have built one of India&apos;s most successful cricket franchises.</p>
          </div>
          <div style={styles.statsGrid}>
            {stats.map((s, i) => (
              <div key={i} style={styles.statCard} onMouseEnter={(e) => handleStatHover(e, true)} onMouseLeave={(e) => handleStatHover(e, false)}>
                <div style={styles.statIcon}>{s.icon}</div>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionBadge}>Platform Features</span>
            <h2 style={styles.sectionTitle}>Everything You Need to Succeed</h2>
            <p style={styles.sectionDesc}>A complete suite of tools built specifically for cricket franchises, from grassroots to elite level.</p>
          </div>
          <div style={styles.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} style={styles.featureCard} onMouseEnter={(e) => handleCardHover(e, true)} onMouseLeave={(e) => handleCardHover(e, false)}>
                <div style={styles.featureIcon}>{f.icon}</div>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.stepsSection}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionBadge}>Getting Started</span>
            <h2 style={styles.sectionTitle}>How It Works</h2>
            <p style={styles.sectionDesc}>Join CricINDIA in four simple steps and start your journey to cricket excellence.</p>
          </div>
          <div style={styles.stepsGrid}>
            {steps.map((st, i) => (
              <div key={i} style={styles.stepCard}>
                <div style={styles.stepNum}>{st.step}</div>
                <h3 style={styles.stepTitle}>{st.title}</h3>
                <p style={styles.stepDesc}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaGlow} />
        <span style={styles.sectionBadge}>Ready to Begin?</span>
        <h2 style={styles.ctaTitle}>
          Become Part of the{' '}
          <span style={{ color: '#C9A227' }}>CricINDIA</span> Family
        </h2>
        <p style={styles.ctaDesc}>
          Register today and unlock access to world-class training resources, elite coaches, and a community of passionate cricketers.
        </p>
        <div style={styles.heroBtns}>
          <Link to="/register" style={styles.btnGold}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >Register Now</Link>
          <Link to="/login" style={styles.btnOutline}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,162,39,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >Sign In</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}