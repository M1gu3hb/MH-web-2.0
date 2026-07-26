import { useEffect, useState } from 'react';

export function PageLoader({ onComplete }) {
  const [progress, setProgress] = useState(8);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    let finishTimer;
    const started = performance.now();
    const ticker = window.setInterval(() => {
      setProgress((value) => Math.min(88, value + Math.max(0.7, (90 - value) * 0.065)));
    }, 80);

    const image = new Image();
    image.src = '/mh-logo-v2-720.png';
    const imageReady = image.decode?.().catch(() => undefined) ?? Promise.resolve();
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const pageReady =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));

    Promise.all([imageReady, fontsReady, pageReady]).then(() => {
      const delay = Math.max(0, 900 - (performance.now() - started));
      finishTimer = window.setTimeout(() => {
        if (!mounted) return;
        window.clearInterval(ticker);
        setProgress(100);
        window.setTimeout(() => {
          if (!mounted) return;
          setLeaving(true);
          window.setTimeout(onComplete, 520);
        }, 150);
      }, delay);
    });

    return () => {
      mounted = false;
      window.clearInterval(ticker);
      window.clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className={`loader ${leaving ? 'loader--leaving' : ''}`} aria-live="polite">
      <div className="loader__top">
        <span>MH / 97</span>
        <span>Fundición digital</span>
        <span>CDMX</span>
      </div>
      <div className="loader__core">
        <div className="loader__logo">
          <img src="/mh-logo-v2-720.png" alt="" width="190" height="170" />
          <span />
        </div>
        <p>Construyendo la experiencia</p>
      </div>
      <div className="loader__bottom">
        <div className="loader__track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)}>
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <strong>{Math.round(progress).toString().padStart(3, '0')}%</strong>
      </div>
    </div>
  );
}
