import { useEffect, useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import ImagePlate from '../components/ImagePlate';
import './About.css';

export default function About({ profile, skillGroups, education, certifications, parallax = 1 }) {
  const rootRef = useRef(null);
  const glowRef = useRef(null);
  useReveal(rootRef, [profile, skillGroups, education, certifications]);

  useEffect(() => {
    const onScroll = () => {
      if (!glowRef.current) return;
      const r = glowRef.current.parentElement.getBoundingClientRect();
      glowRef.current.style.marginTop = `${(-r.top * 0.1 * parallax).toFixed(1)}px`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [parallax]);

  return (
    <section id="about" data-screen-label="About" className="about" ref={rootRef}>
      <div ref={glowRef} className="about__glow" aria-hidden="true" />
      <div className="about__inner">
        <div className="about__heading" data-reveal="1">
          <span className="kicker"><span className="kicker__glyph">☾</span>02 — About</span>
          <h2 className="about__title">{profile.name}</h2>
          <div className="rule rule--fade" data-rule="1" />
        </div>

        <div className="about__body">
          <figure className="about__portrait" data-reveal="1">
            <div className="about__portrait-frame">
              <ImagePlate src={profile.portrait_url} alt={profile.name} placeholder="Drop your photo" />
            </div>
            <figcaption className="about__portrait-caption">{profile.location}</figcaption>
          </figure>

          <div className="about__text" data-reveal="1">
            <p className="about__paragraph">{profile.about_paragraph}</p>

            <div className="about__stack">
              <h4 className="label-heading">Stack</h4>
              <div className="about__stack-grid">
                {skillGroups.map((g) => (
                  <div key={g.id ?? g.label} className="about__stack-group">
                    <span className="about__stack-label">{g.label}</span>
                    <div className="about__stack-items">
                      {g.items.map((s) => (
                        <span key={s} className="chip">
                          <span className="chip__glyph">◇</span>{s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="about__education" data-reveal="1">
          <h4 className="label-heading">Education</h4>
          <div className="about__timeline">
            <div className="rule about__timeline-rule" data-rule="1" />
            {education.map((e) => (
              <div key={e.id ?? e.school} className="about__timeline-item">
                <span className="about__timeline-dot" aria-hidden="true" />
                <span className="about__timeline-years">{e.years}</span>
                <span className="about__timeline-school">{e.school}</span>
                <span className="about__timeline-degree">{e.degree}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about__certs" data-reveal="1">
          <h4 className="label-heading">Certifications</h4>
          <div className="about__certs-grid">
            {certifications.map((c) => (
              <div key={c.id ?? c.title} className="about__cert-card">
                <span className="about__cert-meta">{c.year} · {c.issuer}</span>
                <span className="about__cert-title">{c.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
