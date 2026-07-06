/**
 * Fallback fragment-shader presets for <ShaderCanvas />. Used when the
 * Pexels stock pipeline can't fulfill a slot (rate-limited, no results,
 * offline). Each preset is WebGL1-compatible, references only `uTime`
 * and `uResolution`, and renders cleanly at any viewport size.
 *
 * When adding a new preset: keep it dark/moody by default (these are
 * cinematic backgrounds, not kids' apps), declare `precision highp float`
 * first, and prefer cheap trig/hash noise over texture lookups.
 */

export interface ShaderPreset {
  id: string;
  fragment: string;
  /** Simpler variant used when viewport width < 768 or DPR > 2. */
  mobile?: string;
}

// Shared helpers every preset can assume exist (inlined per-preset for
// compile safety — WebGL1 has no preprocessor includes).
const HEADER = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;
`;

// --- 1. noise -------------------------------------------------------------
// Value noise with slow drift. Dark, grainy — good default background.
const NOISE = `${HEADER}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float n = 0.0;
  n += 0.5 * vnoise(uv * 3.0 + uTime * 0.05);
  n += 0.25 * vnoise(uv * 6.0 - uTime * 0.03);
  n += 0.125 * vnoise(uv * 12.0 + uTime * 0.02);
  vec3 col = mix(vec3(0.02, 0.02, 0.04), vec3(0.08, 0.09, 0.14), n);
  gl_FragColor = vec4(col, 1.0);
}`;

// --- 2. gradient_mesh -----------------------------------------------------
// 3-point radial gradient, points drift on sin orbits. Warm + cinematic.
const GRADIENT_MESH = `${HEADER}
void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;
  float t = uTime * 0.12;
  vec2 p1 = vec2(0.25 + 0.15 * sin(t), 0.30 + 0.10 * cos(t * 1.1));
  vec2 p2 = vec2(0.75 + 0.10 * cos(t * 0.9), 0.70 + 0.12 * sin(t * 1.3));
  vec2 p3 = vec2(0.50 + 0.20 * sin(t * 0.7), 0.20 + 0.08 * cos(t));
  float d1 = 1.0 - clamp(length(uv - p1) * 1.8, 0.0, 1.0);
  float d2 = 1.0 - clamp(length(uv - p2) * 2.0, 0.0, 1.0);
  float d3 = 1.0 - clamp(length(uv - p3) * 2.2, 0.0, 1.0);
  vec3 c1 = vec3(0.60, 0.20, 0.55);  // magenta
  vec3 c2 = vec3(0.10, 0.30, 0.70);  // blue
  vec3 c3 = vec3(0.90, 0.45, 0.25);  // amber
  vec3 col = vec3(0.03, 0.02, 0.06);
  col += c1 * d1 * d1;
  col += c2 * d2 * d2;
  col += c3 * d3 * d3;
  gl_FragColor = vec4(col, 1.0);
}`;

// --- 3. aurora ------------------------------------------------------------
// Flowing layered sin() bands. Northern-lights vibe, deep green/teal/violet.
const AURORA = `${HEADER}
void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;
  float t = uTime * 0.25;
  float band = 0.0;
  for (float i = 0.0; i < 4.0; i += 1.0) {
    float y = 0.45 + 0.25 * sin(uv.x * (2.0 + i) + t + i * 1.7);
    y += 0.05 * sin(uv.x * 9.0 - t * 1.5 + i);
    float d = abs(uv.y - y);
    band += smoothstep(0.18, 0.0, d) * (0.35 - i * 0.05);
  }
  vec3 green = vec3(0.15, 0.85, 0.55);
  vec3 violet = vec3(0.45, 0.20, 0.85);
  vec3 sky = mix(vec3(0.01, 0.02, 0.05), vec3(0.03, 0.04, 0.10), uv.y);
  vec3 col = sky + mix(green, violet, uv.y) * band;
  gl_FragColor = vec4(col, 1.0);
}`;

// --- 4. caustics ----------------------------------------------------------
// Underwater caustic ripples. Iterated refraction approximation.
const CAUSTICS = `${HEADER}
void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = uv * 6.0;
  float t = uTime * 0.6;
  vec2 i = p;
  float c = 1.0;
  float inten = 0.004;
  for (int n = 0; n < 5; n++) {
    float fn = float(n) + 1.0;
    i = p + vec2(cos(t - fn * i.x) + sin(t + fn * i.y), sin(t - fn * i.y) + cos(t + fn * i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
  }
  c /= 5.0;
  c = 1.17 - pow(c, 1.4);
  float bright = pow(abs(c), 8.0);
  vec3 col = vec3(bright) * vec3(0.25, 0.55, 0.85) + vec3(0.01, 0.03, 0.08);
  gl_FragColor = vec4(col, 1.0);
}`;

const CAUSTICS_MOBILE = `${HEADER}
void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = uv * 5.0;
  float t = uTime * 0.4;
  float c = 0.0;
  for (int n = 0; n < 2; n++) {
    float fn = float(n) + 1.0;
    c += sin(p.x * fn + t) * cos(p.y * fn - t);
  }
  float bright = pow(abs(c) * 0.5, 3.0);
  vec3 col = vec3(bright) * vec3(0.25, 0.55, 0.85) + vec3(0.01, 0.03, 0.08);
  gl_FragColor = vec4(col, 1.0);
}`;

// --- 5. grain -------------------------------------------------------------
// Subtle animated film grain over a near-black base.
const GRAIN = `${HEADER}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;
  float g = hash(gl_FragCoord.xy + fract(uTime) * 100.0);
  float vignette = smoothstep(1.1, 0.3, length(uv - 0.5));
  vec3 base = vec3(0.04, 0.04, 0.05) * vignette;
  vec3 col = base + (g - 0.5) * 0.08;
  gl_FragColor = vec4(col, 1.0);
}`;

// --- 6. mercury -----------------------------------------------------------
// Liquid-metal displacement using layered simplex-flavored noise.
const MERCURY = `${HEADER}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * vnoise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float t = uTime * 0.15;
  vec2 q = vec2(fbm(uv + t), fbm(uv - t + 3.7));
  float n = fbm(uv + q * 2.0);
  // Fake fresnel + specular banding
  float spec = pow(smoothstep(0.3, 0.9, n), 3.0);
  vec3 base = mix(vec3(0.06, 0.08, 0.12), vec3(0.40, 0.45, 0.55), n);
  vec3 col = base + vec3(0.7, 0.75, 0.85) * spec * 0.5;
  gl_FragColor = vec4(col, 1.0);
}`;

const MERCURY_MOBILE = `${HEADER}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float t = uTime * 0.12;
  float n = vnoise(uv * 3.0 + t) * 0.6 + vnoise(uv * 6.0 - t) * 0.4;
  float spec = pow(smoothstep(0.3, 0.9, n), 3.0);
  vec3 base = mix(vec3(0.06, 0.08, 0.12), vec3(0.40, 0.45, 0.55), n);
  vec3 col = base + vec3(0.7, 0.75, 0.85) * spec * 0.5;
  gl_FragColor = vec4(col, 1.0);
}`;

// --- 7. parallax_grid -----------------------------------------------------
// 3D-ish perspective grid receding to a vanishing point. Tron/tech feel.
const PARALLAX_GRID = `${HEADER}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  // Perspective project: compress Y below the horizon, divide by depth.
  float horizon = 0.0;
  float y = uv.y - horizon;
  // Fade above the horizon.
  if (y > 0.0) {
    vec3 sky = mix(vec3(0.02, 0.03, 0.08), vec3(0.08, 0.04, 0.14), y * 2.0);
    gl_FragColor = vec4(sky, 1.0);
    return;
  }
  float depth = 1.0 / (-y + 0.0001);
  float scrollZ = uTime * 0.8;
  float gx = uv.x * depth;
  float gz = depth + scrollZ;
  float lineX = abs(fract(gx) - 0.5);
  float lineZ = abs(fract(gz) - 0.5);
  float w = 0.02 * depth;
  float gridX = smoothstep(w, 0.0, lineX);
  float gridZ = smoothstep(w, 0.0, lineZ);
  float g = max(gridX, gridZ);
  // Attenuate distant lines.
  float atten = exp(-depth * 0.15);
  vec3 ground = vec3(0.01, 0.01, 0.03);
  vec3 glow = vec3(0.30, 0.55, 0.95);
  vec3 col = ground + glow * g * atten;
  gl_FragColor = vec4(col, 1.0);
}`;

// --- 8. plasma ------------------------------------------------------------
// Classic plasma with cycling palette.
const PLASMA = `${HEADER}
vec3 palette(float t){
  return 0.5 + 0.5 * cos(6.2831 * (vec3(0.00, 0.33, 0.67) + t));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float t = uTime * 0.3;
  float v = 0.0;
  v += sin(uv.x * 3.0 + t);
  v += sin(uv.y * 4.0 + t * 1.1);
  v += sin((uv.x + uv.y) * 3.0 + t * 0.7);
  v += sin(length(uv) * 6.0 - t * 1.3);
  v *= 0.25;
  vec3 col = palette(v + t * 0.1) * 0.55;
  // Deepen for cinematic mood.
  col *= mix(vec3(0.35, 0.40, 0.55), vec3(1.0), 0.5 + 0.5 * v);
  col = mix(vec3(0.02, 0.02, 0.05), col, 0.9);
  gl_FragColor = vec4(col, 1.0);
}`;

const PLASMA_MOBILE = `${HEADER}
vec3 palette(float t){
  return 0.5 + 0.5 * cos(6.2831 * (vec3(0.00, 0.33, 0.67) + t));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float t = uTime * 0.25;
  float v = sin(uv.x * 3.0 + t) + sin(uv.y * 4.0 + t);
  v *= 0.5;
  vec3 col = palette(v + t * 0.1) * 0.55;
  col = mix(vec3(0.02, 0.02, 0.05), col, 0.9);
  gl_FragColor = vec4(col, 1.0);
}`;

export const PRESETS: Record<string, ShaderPreset> = {
  noise: { id: "noise", fragment: NOISE },
  gradient_mesh: { id: "gradient_mesh", fragment: GRADIENT_MESH },
  aurora: { id: "aurora", fragment: AURORA },
  caustics: { id: "caustics", fragment: CAUSTICS, mobile: CAUSTICS_MOBILE },
  grain: { id: "grain", fragment: GRAIN },
  mercury: { id: "mercury", fragment: MERCURY, mobile: MERCURY_MOBILE },
  parallax_grid: { id: "parallax_grid", fragment: PARALLAX_GRID },
  plasma: { id: "plasma", fragment: PLASMA, mobile: PLASMA_MOBILE },
};

/**
 * Maps a free-form mood string (from the landing agent's stock brief) to
 * one of the shipped presets. Keywords are regex'd against a lowercased
 * input; first match wins. Fallback is `noise` — the safest, quietest
 * preset that won't fight with whatever hero copy lives on top of it.
 */
export function pickPresetForMood(mood: string): string {
  const m = mood.toLowerCase();
  if (/liquid|metal|mercury|chrome/.test(m)) return "mercury";
  if (/aurora|flow|wave|ribbon/.test(m)) return "aurora";
  if (/grid|geometric|tech|wire|tron/.test(m)) return "parallax_grid";
  if (/water|caustic|organic|ocean/.test(m)) return "caustics";
  if (/warm|glow|gradient|sunset|mesh/.test(m)) return "gradient_mesh";
  if (/film|grain|analog|noir|vhs/.test(m)) return "grain";
  if (/energy|plasma|electric|neon/.test(m)) return "plasma";
  return "noise";
}
