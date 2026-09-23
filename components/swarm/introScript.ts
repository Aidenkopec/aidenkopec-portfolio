/**
 * Runs inline in <head>, before first paint, on the homepage. It hides the
 * navbar's copy of the name while the hero is in view, and decides whether this
 * visit opens with the intro. If so it marks <html data-swarm-intro="pending">,
 * which hides the hero name so the particles can build it from nothing.
 *
 * The intro plays only on a fresh homepage visit in this tab, at the top of the page, with no
 * reduced motion and WebGL 2 available (checked without creating a context).
 * The session flag is set at once so a crash can never replay the intro. If
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
    if (sessionStorage.getItem('swarm-intro')) return;
    sessionStorage.setItem('swarm-intro', '1');
    root.dataset.swarmIntro = 'pending';
    setTimeout(function () {
      if (root.dataset.swarmIntro === 'pending') delete root.dataset.swarmIntro;
    }, 4000);
  } catch (error) {}
})();`;
