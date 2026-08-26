import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import './Contact.css';

const TAP_TARGET = 12;
const TAP_EDIT_THRESHOLD = 8;
const TAP_RESET_MS = 2500;

export default function Contact({ profile, onRequestAdminLogin }) {
  const rootRef = useRef(null);
  useReveal(rootRef, [profile]);

  const [taps, setTaps] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const tapMark = () => {
    const next = taps + 1;
    if (next >= TAP_TARGET) {
      setTaps(0);
      onRequestAdminLogin();
      return;
    }
    setTaps(next);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setTaps(0), TAP_RESET_MS);
  };

  const isEdit = taps >= TAP_EDIT_THRESHOLD;

  return (
    <section id="contact" data-screen-label="Contact" className="contact" ref={rootRef}>
      <img src="/uploads/moon.webp" alt="" aria-hidden="true" className="contact__moon" />
      <div aria-hidden="true" className="contact__cloud-band" />

      <div className="contact__inner">
        <div className="contact__heading" data-reveal="1">
          <span className="kicker"><span className="kicker__glyph">☾</span>04 — Contact</span>
          <h2 className="contact__title">Open to OJT and collaboration</h2>
          <p className="contact__intro">
            Based in {profile.location}. If something here is useful to you, I would be glad to hear from you.
          </p>
        </div>

        <div className="contact__tiles" data-reveal="1">
          <a href={`mailto:${profile.email}`} className="contact__tile">
            <span className="contact__tile-label">Email</span>
            <span className="contact__tile-value">{profile.email}</span>
          </a>
          <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="contact__tile">
            <span className="contact__tile-label">GitHub</span>
            <span className="contact__tile-value">{profile.github_url.replace('https://', '')}</span>
          </a>
          <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="contact__tile">
            <span className="contact__tile-label">LinkedIn</span>
            <span className="contact__tile-value">{profile.linkedin_url.replace('https://www.', '').replace('https://', '')}</span>
          </a>
        </div>

        {profile.resume_url && (
          <div className="contact__resume-row" data-reveal="1">
            <a href={profile.resume_url} download className="contact__resume-btn">
              Download résumé <span>↓</span>
            </a>
          </div>
        )}

        <div className="contact__footer">
          <button type="button" onClick={tapMark} title="hz." className="contact__mark">
            {isEdit ? (
              <span className="contact__mark-edit">Edit</span>
            ) : (
              <span className="contact__mark-logo">hz.</span>
            )}
          </button>
          <span className="contact__footer-note">Hannah Marie Martinez · {profile.location}</span>
        </div>
      </div>
    </section>
  );
}
