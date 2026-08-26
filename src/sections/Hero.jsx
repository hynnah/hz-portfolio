import { useEffect, useRef } from 'react';
import './Hero.css';

export default function Hero({ storyLine, name, subtitle, parallax = 1 }) {
  const cloudFarRef = useRef(null);
  const cloudNearRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const h = window.innerHeight || 1;
      const t = Math.min(y / h, 1);
      const fade = Math.max(0, 1 - t * 1.9).toFixed(3);

      if (cloudFarRef.current) {
        cloudFarRef.current.style.transform = `translate3d(${(-t * 55 * parallax).toFixed(1)}%, ${(t * 30 * parallax).toFixed(1)}%, 0)`;
        cloudFarRef.current.style.opacity = fade;
      }
      if (cloudNearRef.current) {
        cloudNearRef.current.style.transform = `translate3d(${(t * 55 * parallax).toFixed(1)}%, ${(t * 30 * parallax).toFixed(1)}%, 0)`;
        cloudNearRef.current.style.opacity = fade;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [parallax]);

  return (
    <section id="top" data-screen-label="Home" className="hero">
      <div className="hero__vignette" aria-hidden="true" />

      <div className="hero__clouds" aria-hidden="true">
        <img ref={cloudFarRef} src="/uploads/clouds1.webp" alt="" className="hero__cloud hero__cloud--far" />
        <img ref={cloudNearRef} src="/uploads/clouds2.webp" alt="" className="hero__cloud hero__cloud--near" />
      </div>

      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__content">
        <p className="hero__story">{storyLine}</p>

        <div className="hero__mark-stage">
          <div className="hero__mark" aria-label="hz.">
            <span className="hero__mark-h">h</span>
            <span className="hero__mark-z">z.</span>
          </div>
          <h1 className="hero__name">{name}</h1>
        </div>

        <p className="hero__subtitle">{subtitle}</p>
        <div className="hero__rule" />
        <img src="/uploads/moon.webp" alt="" className="hero__moon" />
      </div>

      <div className="hero__cue-wrap">
        <a href="#about" className="hero__cue">
          Scroll to explore
          <span className="hero__cue-arrow">↓</span>
        </a>
      </div>
    </section>
  );
}
