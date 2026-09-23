// GLSL lives in template strings so Turbopack needs no shader loader.

/**
 * 3D simplex noise by Ian McEwan and Stefan Gustavson (Ashima Arts), MIT
 * licence, https://github.com/ashima/webgl-noise. Unchanged apart from layout.
 */
const simplexNoise = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

/** Shared by both passes: a stable direction per particle, from its seed. */
const seedDirection = /* glsl */ `
  vec2 seedDirection(float seed) {
    float angle = fract(seed * 7.13) * 6.2831853;
    return vec2(cos(angle), sin(angle));
  }
`;

/**
 * Velocity pass. Free particles ease toward the local flow of a slowly
 * changing curl noise field. Curl noise has no sources or sinks, so dust swirls
 * instead of bunching up or thinning out.
 *
 * Bound particles also feel a critically damped spring toward their home in
 * the current shape: it arrives and settles with no overshoot. Each particle
 * starts pulling after its own random delay, and the pull ramps in softly, so
 * a shape assembles like a gust settling rather than a snap.
 *
 * A gravity well eases particles toward a spiral: inflow proportional to
 * radius, so everything arrives together and never overshoots the centre, and
 * spin that falls off with radius like an orbit. It is a velocity target, not
 * a force, so it stays stable at any frame rate.
 *
 * vel.w carries how bound the particle is, for the position pass.
 */
export const velocityShader = /* glsl */ `
  uniform float uTime;
  uniform float uDelta;
  uniform float uNoiseScale;
  uniform float uNoiseSpeed;
  uniform float uDriftSpeed;
  uniform float uResponse;
  uniform sampler2D uTargets;
  uniform vec2 uSlot;
  uniform float uForm;
  uniform float uFormTime;
  uniform float uOmega;
  uniform float uMaxDelay;
  uniform float uRamp;
  uniform vec2 uPointer;
  uniform vec2 uPointerVelocity;
  uniform float uWind;
  uniform float uWindRadius;
  uniform float uWindPush;
  uniform float uWindDrag;
  // Shock: centre x, y, seconds since it started, kick; then ring speed,
  // reach and hold.
  uniform vec4 uShock;
  uniform vec3 uShockShape;
  // Well: centre x, y, pull, spin; then reach, horizon, how much it loosens
  // bound particles, and response.
  uniform vec4 uWellA;
  uniform vec4 uWellB;

  ${simplexNoise}
  ${seedDirection}

  // 2D curl of a noise potential: rotate its gradient by 90 degrees.
  vec2 curl(vec3 p) {
    const float e = 0.1;
    float dx = snoise(p + vec3(e, 0.0, 0.0)) - snoise(p - vec3(e, 0.0, 0.0));
    float dy = snoise(p + vec3(0.0, e, 0.0)) - snoise(p - vec3(0.0, e, 0.0));
    return vec2(dy, -dx) / (2.0 * e);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 pos = texture2D(texturePosition, uv);
    vec4 vel = texture2D(textureVelocity, uv);
    vec4 target = texture2D(uTargets, uv);
    float seed = pos.w;

    // Captured by the well's horizon: parked at rest until it opens.
    if (pos.z > 0.5) {
      gl_FragColor = vec4(0.0);
      return;
    }

    // Velocity as the position pass will use it this frame.
    vec2 heading = vel.xy;

    float delay = seed * uMaxDelay;
    float bind = target.w * uForm * smoothstep(delay, delay + uRamp, uFormTime);

    // Shockwave. A ring expands from the click; shockT is the time since it
    // passed this particle, so everything below runs as a wave outward.
    vec2 fromShock = pos.xy - uShock.xy;
    float shockDist = length(fromShock);
    float shockT = uShock.z - shockDist / uShockShape.x;
    float reach = exp(-shockDist / uShockShape.y) * step(0.0, shockT);
    // While held, the spring is almost off and particles drift on the air.
    // It returns after the hold with the same soft ramp as formation.
    float returnAt = uShockShape.z + seed * 0.3;
    // Released fully across most of the blast, not in proportion to it, so
    // letters far from the click still drift instead of snapping back.
    float release = min(reach * 3.0, 1.0);
    float held = release * (1.0 - smoothstep(returnAt, returnAt + uRamp, shockT));
    bind *= 1.0 - 0.97 * held;

    // The well loosens bound particles inside its reach so it can take them.
    vec2 fromWell = pos.xy - uWellA.xy;
    float wellDist = length(fromWell);
    float wellReach = max(uWellB.x, 1.0);
    float influence = step(1.0, uWellB.x)
      * exp(-(wellDist * wellDist) / (wellReach * wellReach));
    bind *= 1.0 - uWellB.z * influence;

    vec2 flow = curl(vec3(pos.xy * uNoiseScale, uTime * uNoiseSpeed));
    // Per particle speed spread keeps neighbours from moving in lockstep. A
    // little flow survives binding so a formed shape still breathes.
    flow *= uDriftSpeed * (0.6 + 0.8 * seed) * mix(1.0, 0.1, bind);

    // Frame rate independent easing toward the flow: air, not springs.
    float k = 1.0 - exp(-uDelta * uResponse);
    vel.xy = mix(vel.xy, flow, k);

    // One short outward kick as the ring passes. Each particle takes its own
    // share, so a blast fills the space instead of leaving one thin ring.
    float pulse = 1.0 - smoothstep(0.0, 0.12, shockT);
    vec2 shockAway = fromShock / max(shockDist, 1.0);
    float share = mix(0.35, 1.0, sqrt(fract(seed * 53.7)));
    vel.xy += shockAway * uShock.w * share * reach * pulse * uDelta;

    // Slot origin is the shape's top left in world space; local y runs down.
    vec2 home = vec2(uSlot.x + target.x, uSlot.y - target.y);
    // Stiffness scales with bind, so damping scales with its square root. That
    // keeps the damping ratio at exactly 1 while the pull ramps in, where
    // scaling both by bind would leave the spring bouncy mid ramp.
    vec2 spring = bind * uOmega * uOmega * (home - pos.xy)
      - 2.0 * sqrt(bind) * uOmega * vel.xy;
    vel.xy += spring * uDelta;
    // Cursor wind: a soft bubble around the pointer pushes particles out and
    // drags them along its path. uWind follows pointer speed, so a still
    // cursor does nothing, and the spring closes the gap behind it.
    vec2 fromPointer = pos.xy - uPointer;
    float dist = length(fromPointer);
    float falloff = exp(-(dist * dist) / (uWindRadius * uWindRadius));
    vec2 away = fromPointer / max(dist, 1.0);
    vec2 wind = away * uWindPush + uPointerVelocity * uWindDrag;
    vel.xy += wind * falloff * uWind * uDelta;

    // Spin is the tangential speed at 100px, rising toward the core.
    vec2 inward = -fromWell / max(wellDist, 1.0);
    vec2 around = vec2(-inward.y, inward.x);
    vec2 orbit = inward * uWellA.z * wellDist
      + around * uWellA.w * sqrt(100.0 / max(wellDist, 20.0));
    vel.xy = mix(vel.xy, orbit, 1.0 - exp(-uDelta * uWellB.w * influence));

    // The position pass turns this particle around the well by the angle
    // below. Turning its velocity by the same angle keeps it pointing along
    // the orbit; left behind, it reads as outward motion next frame and holds
    // particles in a ring they never fall out of.
    if (uWellB.x > 0.0 && wellDist > 1.0) {
      float angle = dot(heading, -around) * uDelta / wellDist;
      float c = cos(angle);
      float s = sin(angle);
      vel.xy = vec2(vel.x * c - vel.y * s, vel.x * s + vel.y * c);
    }

    vel.w = bind;

    gl_FragColor = vel;
  }
`;

/**
 * Position pass. Moves by velocity. Free particles wrap at the viewport edges;
 * bound ones never do, so a shape can follow its slot past the edge.
 *
 * Anything that crosses an open well's horizon is captured (pos.z = 1) and
 * parked a few pixels from the centre along its own seed direction. When the
 * horizon closes, every captured particle is freed at once, already spread in
 * all directions for the shock that follows.
 */
export const positionShader = /* glsl */ `
  uniform float uDelta;
  uniform vec2 uHalfBounds;
  uniform vec4 uWellA;
  uniform vec4 uWellB;

  ${seedDirection}

  vec2 parked(float seed) {
    return uWellA.xy + seedDirection(seed) * (2.0 + 4.0 * seed);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 pos = texture2D(texturePosition, uv);
    vec4 vel = texture2D(textureVelocity, uv);
    float horizon = uWellB.y;

    if (pos.z > 0.5) {
      if (horizon > 0.0) pos.xy = parked(pos.w);
      else pos.z = 0.0;
      gl_FragColor = pos;
      return;
    }

    // Near a well, motion is split into radial and around. Moving in a
    // straight line along a tight orbit drifts outward every frame, fast
    // enough to stall particles in a ring they never leave; turning by the
    // exact angle keeps the orbit's radius and lets the inflow win.
    vec2 fromWell = pos.xy - uWellA.xy;
    float wellDist = length(fromWell);
    if (uWellB.x > 0.0 && wellDist > 1.0) {
      vec2 outward = fromWell / wellDist;
      vec2 around = vec2(-outward.y, outward.x);
      float angle = dot(vel.xy, around) * uDelta / wellDist;
      float radius = max(wellDist + dot(vel.xy, outward) * uDelta, 0.0);
      float c = cos(angle);
      float s = sin(angle);
      pos.xy = uWellA.xy + (outward * c + around * s) * radius;
    } else {
      pos.xy += vel.xy * uDelta;
    }
    if (horizon > 0.0 && length(pos.xy - uWellA.xy) < horizon) {
      pos.xy = parked(pos.w);
      pos.z = 1.0;
    } else if (vel.w < 0.001) {
      pos.xy = mod(pos.xy + uHalfBounds, 2.0 * uHalfBounds) - uHalfBounds;
    }

    gl_FragColor = pos;
  }
`;

/**
 * Draw pass. Reads each particle's position and velocity from the simulation
 * textures. Speed sets temperature: settled dust stays warm, anything moving
 * fast glows hot. Each particle also has a fixed depth that sets its size and
 * how far it shifts as the pointer moves, which gives the dust parallax. Bound
 * particles skip the parallax so a formed shape stays on its slot.
 */
export const pointsVertexShader = /* glsl */ `
  uniform sampler2D uPositions;
  uniform sampler2D uVelocities;
  uniform float uPixelRatio;
  uniform vec3 uColor;
  uniform vec3 uHotColor;
  uniform vec2 uParallax;
  uniform vec3 uLens;
  attribute vec2 aRef;
  attribute float aSize;
  attribute float aBrightness;
  varying vec3 vColor;
  varying float vBrightness;

  void main() {
    vec4 pos = texture2D(uPositions, aRef);
    vec4 vel = texture2D(uVelocities, aRef);
    float depth = fract(sin(pos.w * 91.7) * 43758.5453);
    float heat = smoothstep(80.0, 900.0, length(vel.xy));

    vec2 p = pos.xy + uParallax * (depth - 0.5) * 2.0 * (1.0 - vel.w);
    // Gravitational lensing, drawn only: a point lens with Einstein radius
    // uLens.z shows light from radius r at (r + sqrt(r² + 4Re²)) / 2, so dust
    // behind the hole smears into a ring just outside it.
    vec2 fromLens = p - uLens.xy;
    float lensDist = length(fromLens);
    float lensed = 0.5 * (lensDist + sqrt(lensDist * lensDist + 4.0 * uLens.z * uLens.z));
    p = uLens.xy + fromLens / max(lensDist, 0.001) * lensed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
    // Captured particles (pos.z = 1) are inside the horizon: not drawn.
    gl_PointSize = aSize * mix(0.7, 1.3, depth) * uPixelRatio * (1.0 - pos.z);
    vColor = mix(uColor, uHotColor, heat);
    vBrightness = aBrightness * mix(0.75, 1.15, depth) * (1.0 + 1.5 * heat);
  }
`;

export const pointsFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vBrightness;

  void main() {
    // Soft round falloff, no hard disc edge.
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, alpha * vBrightness);
  }
`;
