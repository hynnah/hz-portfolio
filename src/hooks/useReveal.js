import { useEffect } from 'react';

/**
 * Fades/slides in any [data-reveal] element and draws out any [data-rule]
 * element under a given root once it scrolls into view. Re-runs whenever
 * `deps` changes so content loaded asynchronously (e.g. from Supabase)
 * still gets observed.
 */
export function useReveal(rootRef, deps = []) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    const ruleIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            ruleIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const raf = requestAnimationFrame(() => {
      root.querySelectorAll('[data-reveal]').forEach((el, i) => {
        el.style.transitionDelay = `${(i % 4) * 0.08}s`;
        revealIo.observe(el);
      });
      root.querySelectorAll('[data-rule]').forEach((el) => ruleIo.observe(el));
    });

    return () => {
      cancelAnimationFrame(raf);
      revealIo.disconnect();
      ruleIo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
