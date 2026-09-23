/**
 * Runs inline in <head>, before first paint, on the homepage. It hides the
 * navbar's copy of the name while the hero is in view, and decides whether this
 * visit opens with the intro. If so it marks <html data-swarm-intro="pending">,
 * which hides the hero name so the particles can build it from nothing.
 *
 * The intro plays at most once a day per browser, on a homepage visit at the
 * top of the page, with no reduced motion and WebGL 2 available (checked
 * without creating a context). The timestamp is stored at once so a crash can
 * never replay the intro. If
 * the swarm has not claimed it (set "running") within 4s, the name is shown.
 */
export const SWARM_INTRO_SCRIPT = `(function () {
  try {
    var root = document.documentElement;
    if (location.pathname !== '/' || location.hash) return;
    // The hero starts on screen, so the navbar hides its copy of the name
    // from the first frame. The hero's own observer keeps this up to date.
    root.dataset.heroInView = '';
    if (!window.WebGL2RenderingContext) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var last = Number(localStorage.getItem('swarm-intro'));
    if (Date.now() - last < 86400000) return;
    localStorage.setItem('swarm-intro', String(Date.now()));
    root.dataset.swarmIntro = 'pending';
    setTimeout(function () {
      if (root.dataset.swarmIntro === 'pending') delete root.dataset.swarmIntro;
    }, 4000);
  } catch (error) {}
})();`;
