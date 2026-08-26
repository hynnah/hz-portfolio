import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import ImagePlate from '../components/ImagePlate';
import './Work.css';

export default function Work({ projects }) {
  const rootRef = useRef(null);
  const railRef = useRef(null);
  const [hover, setHover] = useState(null);
  const [open, setOpen] = useState(null);
  const [overflowing, setOverflowing] = useState(false);

  useReveal(rootRef, [projects]);

  useEffect(() => {
    const measure = () => {
      const el = railRef.current;
      if (!el) return;
      setOverflowing(el.scrollWidth - el.clientWidth > 4);
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 120);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, [projects]);

  const scrollRail = (dir) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: 'smooth' });
  };

  const openProject = open === null ? null : projects[open];

  return (
    <section id="work" data-screen-label="Work" className="work" ref={rootRef}>
      <div className="work__inner">
        <div className="work__divider" aria-hidden="true">
          <span className="work__diamond work__diamond--outline" />
          <span className="work__diamond work__diamond--fill" />
          <span className="work__diamond work__diamond--outline" />
        </div>

        <div className="work__heading" data-reveal="1">
          <div className="work__heading-text">
            <span className="kicker"><span className="kicker__glyph">☾</span>03 — Work</span>
            <h2 className="work__title">Selected Projects</h2>
          </div>
          <p className="work__intro">
            Four systems built for real campus problems — a clinic, a shuttle line, a kitchen, a classroom. Select one to read the full case.
          </p>
        </div>
        <div className="rule work__rule" data-rule="1" />

        <div
          ref={railRef}
          className="work__rail"
          onMouseLeave={() => setHover(null)}
        >
          {projects.map((p, i) => {
            const ringActive = hover === i;
            const revealed = hover === i || open === i;
            const curtainL = revealed ? 'scaleX(0.16) translateX(-4%)' : 'scaleX(1)';
            const curtainR = revealed ? 'scaleX(0.16) translateX(4%)' : 'scaleX(1)';
            const zoom = revealed ? 'scale(1.06)' : 'scale(1)';
            const breathe = revealed ? 'hz-breathe 14s ease-in-out 1.4s infinite' : 'none';
            const glow = revealed ? '0 0 52px -8px #b6823577, 0 0 120px -30px #fff3cf3d' : '0 0 0 0 #00000000';
            const panes = revealed ? 0.9 : 0.35;
            const shine = revealed ? 0.15 : 0.035;
            const shineDelay = `${i * 1.7}s`;
            return (
              <div key={p.id ?? p.num} className="work__card-wrap" data-reveal="1">
                <div
                  className="work__card"
                  onMouseEnter={() => setHover(i)}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <div className="work__thumb-wrap">
                    <span className="work__numeral" aria-hidden="true">{p.num}</span>
                    <div className="work__thumb" style={{ boxShadow: glow }}>
                      <div className="work__thumb-image" style={{ transform: zoom, animation: breathe }}>
                        <ImagePlate src={p.image_url} alt={p.title} placeholder={`Drop ${p.title} screenshot`} />
                      </div>
                      <div className="work__thumb-panes" style={{ opacity: panes }} aria-hidden="true">
                        <div className="work__thumb-panes-frame" />
                        <div className="work__thumb-panes-v" />
                        <div className="work__thumb-panes-h1" />
                        <div className="work__thumb-panes-h2" />
                      </div>
                      <div className="work__thumb-shine" style={{ opacity: shine }} aria-hidden="true">
                        <div className="work__thumb-shine-sweep" style={{ animationDelay: shineDelay }} />
                        <div className="work__thumb-shine-glow" />
                      </div>
                      <div className="work__thumb-curtain work__thumb-curtain--left" style={{ transform: curtainL }} aria-hidden="true">
                        <div className="work__thumb-curtain-cloth" />
                        <div className="work__thumb-curtain-sheer" />
                      </div>
                      <div className="work__thumb-curtain work__thumb-curtain--right" style={{ transform: curtainR }} aria-hidden="true">
                        <div className="work__thumb-curtain-cloth" />
                        <div className="work__thumb-curtain-sheer" />
                      </div>
                      <div className="work__thumb-vignette" aria-hidden="true" />
                    </div>
                    <div className={`work__thumb-ring ${ringActive ? 'is-active' : ''}`} aria-hidden="true" />
                  </div>
                  <div className="work__card-text">
                    <span className="work__card-num">{p.num}</span>
                    <h3 className="work__card-title">{p.title}</h3>
                    <p className="work__card-blurb">{p.blurb}</p>
                    <span className="work__card-stack">{p.stack}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="work__footer">
          <a
            href="https://github.com/hynnah?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="work__all-link"
          >
            All repositories
          </a>
          {overflowing && (
            <div className="work__arrows">
              <button type="button" onClick={() => scrollRail(-1)} aria-label="Previous projects" className="work__arrow-btn">←</button>
              <button type="button" onClick={() => scrollRail(1)} aria-label="Next projects" className="work__arrow-btn">→</button>
            </div>
          )}
        </div>

        {openProject && (
          <div className="work__detail">
            <div className="work__detail-head">
              <span className="work__detail-kicker">{openProject.num} — {openProject.kind}</span>
              <h3 className="work__detail-title">{openProject.title}</h3>
              <span className="work__detail-dates">{openProject.dates}</span>
              {openProject.preview_url && (
                <figure className="work__detail-preview">
                  <div className="work__detail-preview-frame">
                    <div className="work__detail-preview-mat">
                      <ImagePlate
                        src={openProject.preview_url}
                        alt={`${openProject.title} system preview`}
                      />
                    </div>
                  </div>
                  <figcaption className="work__detail-preview-caption">System preview — {openProject.title}</figcaption>
                </figure>
              )}
              <button type="button" className="btn btn-ghost work__detail-close" onClick={() => setOpen(null)}>Close ×</button>
            </div>
            <div className="work__detail-body">
              <p className="work__detail-full">{openProject.full}</p>
              <div className="work__detail-tags">
                {openProject.tags.map((t) => (
                  <span key={t} className="tag-outline">{t}</span>
                ))}
              </div>
              {(openProject.repo_url || openProject.demo_url) && (
                <div className="work__detail-links">
                  {openProject.demo_url && (
                    <a href={openProject.demo_url} target="_blank" rel="noopener noreferrer" className="work__link-btn work__link-btn--primary">
                      Live demo →
                    </a>
                  )}
                  {openProject.repo_url && (
                    <a href={openProject.repo_url} target="_blank" rel="noopener noreferrer" className="work__link-btn">
                      Repository →
                    </a>
                  )}
                </div>
              )}
              {openProject.private_note && (
                <span className="work__detail-note">{openProject.private_note}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
