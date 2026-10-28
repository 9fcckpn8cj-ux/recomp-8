/* =========================================================
   Forge v3 — permanent strength & physique companion
   ========================================================= */
'use strict';

/* ---------- Safety net ---------- */
window.addEventListener('error', function () {
  try { toast('Something glitched, but your data is safe. Reload if it persists.'); } catch (e) {}
});

/* ---------- Storage (namespaced, safe fallback) ---------- */
var NS = 'fg3.';
var memory = {};
var storageOK = true;
try { localStorage.setItem(NS + '__t', '1'); localStorage.removeItem(NS + '__t'); } catch (e) { storageOK = false; }
var store = {
  get: function (k) { var key = NS + k; try { if (storageOK) return localStorage.getItem(key); } catch (e) {} return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null; },
  set: function (k, v) { var key = NS + k; try { if (storageOK) { localStorage.setItem(key, v); return; } } catch (e) {} memory[key] = v; },
  remove: function (k) { var key = NS + k; try { if (storageOK) localStorage.removeItem(key); } catch (e) {} delete memory[key]; },
  keys: function () {
    var out = [];
    try { if (storageOK) { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(NS) === 0) out.push(k.slice(NS.length)); } } } catch (e) {}
    Object.keys(memory).forEach(function (k) { if (k.indexOf(NS) === 0 && out.indexOf(k.slice(NS.length)) === -1) out.push(k.slice(NS.length)); });
    return out;
  }
};
function load(k, def) { try { var v = store.get(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } }
function save(k, v) { store.set(k, JSON.stringify(v)); }

/* ---------- Helpers ---------- */
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
function pad(n) { return String(n).padStart(2, '0'); }
function dstr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function today() { return dstr(new Date()); }
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function num(s) { if (s === '' || s == null) return NaN; return parseFloat(String(s).replace(',', '.')); }
function fmt(n) { return String(+(+n).toFixed(2)); }
function roundLoad(x) { return x < 20 ? Math.round(x * 2) / 2 : Math.round(x / 2.5) * 2.5; }
function fdate(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }); }
function mmss(s) { return pad(Math.floor(s / 60)) + ':' + pad(s % 60); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function vib(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
var toastT = null;
function toast(msg) {
  var t = $('#toast'); if (!t) return;
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2400);
}

/* ---------- Program ---------- */
var RANGES = {
  main:      { lo: 6,  hi: 10, eLo: 10, eHi: 15 },
  lower:     { lo: 8,  hi: 12, eLo: 10, eHi: 15 },
  secondary: { lo: 8,  hi: 12, eLo: 10, eHi: 15 },
  isolation: { lo: 12, hi: 20, eLo: 12, eHi: 20 },
  carry:     { lo: 20, hi: 40, eLo: 20, eHi: 30 }
};
var REST = {
  heavy: { main: 150, lower: 150, secondary: 120, isolation: 75, carry: 120 },
  easy:  { main: 90,  lower: 90,  secondary: 75,  isolation: 60, carry: 90 }
};
var TECH = {
  main: 'Set the machine or bench so the movement feels stable and pain-free. Control the lowering, drive hard, and stop 1–2 reps before technique changes.',
  lower: 'Keep your hips and lower back supported. Use a depth you control, push through the whole foot, and avoid locking out aggressively.',
  secondary: 'Smooth full range of motion, no bouncing or momentum. Keep the target muscle doing the work.',
  isolation: 'Light-to-moderate load, slow lowering, and a clear squeeze. Chase tension, not weight.',
  carry: 'Stand tall, shoulders packed, grip crushing the handles. Walk smoothly and stop when posture slips.'
};
var PROGRAM = {
  'Back & Biceps': {
    hint: 'Lats, upper back, traps, biceps',
    exercises: [
      { id: 'bb1', slot: 'Vertical pull', tier: 'essential', type: 'main', sets: 3, muscles: { back: 1, biceps: 0.5 },
        alts: ['Iso-lateral front pulldown', 'Lat pulldown (cable)', 'Wide-grip pulldown', 'Weighted / assisted pull-up', 'Single-arm cable pulldown'] },
      { id: 'bb2', slot: 'Row', tier: 'essential', type: 'main', sets: 3, muscles: { back: 1, biceps: 0.5, traps: 0.5 },
        alts: ['T-bar row (plate-loaded)', 'Chest-supported T-bar row', 'Barbell row', 'Dumbbell row', 'Iso-lateral row machine'] },
      { id: 'bb3', slot: 'Width', tier: 'recommended', type: 'secondary', sets: 2, muscles: { back: 1, biceps: 0.5 },
        alts: ['Crossed-arm pulldown', 'Neutral-grip pulldown', 'Straight-arm pulldown (cable)', 'Pullover machine'] },
      { id: 'bb4', slot: 'Traps', tier: 'essential', type: 'secondary', sets: 3, muscles: { traps: 1 },
        alts: ['Dumbbell shrug', 'Trap-bar shrug', 'Barbell shrug', 'Smith-machine shrug', 'Machine shrug'] },
      { id: 'bb5', slot: 'Upper chest', tier: 'recommended', type: 'secondary', sets: 2, muscles: { chest: 1, shoulders: 0.5, triceps: 0.5 },
        alts: ['Incline dumbbell press', 'Incline machine press', 'Smith incline press'] },
      { id: 'bb6', slot: 'Rear delts', tier: 'recommended', type: 'isolation', sets: 3, muscles: { shoulders: 1 },
        alts: ['Reverse pec-deck', 'Cable rear-delt fly', 'Dumbbell rear-delt raise', 'Face pull'] },
      { id: 'bb7', slot: 'Biceps', tier: 'recommended', type: 'isolation', sets: 3, muscles: { biceps: 1 },
        alts: ['Incline dumbbell curl', 'Preacher curl machine', 'Cable curl', 'Barbell curl'] },
      { id: 'bb8', slot: 'Neck', tier: 'optional', type: 'isolation', sets: 2, muscles: { neck: 1 },
        alts: ['Neck extension (plate or band)', 'Neck flexion (plate or band)', 'Neck machine'],
        tip: 'Go light and slow. Never jerk, build up over weeks, and stop at any dizziness or tingling.' }
    ]
  },
  'Lower': {
    hint: 'Quads, hamstrings, calves, core',
    exercises: [
      { id: 'lo1', slot: 'Quad press', tier: 'essential', type: 'lower', sets: 3, muscles: { quads: 1, glutes: 0.5 },
        alts: ['Hack squat', '45° leg press', 'V-squat machine', 'Pendulum squat', 'Smith-machine squat'] },
      { id: 'lo2', slot: 'Hip hinge', tier: 'essential', type: 'main', sets: 3, muscles: { hamstrings: 1, glutes: 0.5 },
        alts: ['Dumbbell Romanian deadlift', 'Smith-machine Romanian deadlift', 'Barbell Romanian deadlift', 'Cable pull-through', '45° back extension'],
        tip: 'Push the hips back, keep the bar close and your back flat. Stop where your hamstrings are stretched, not where your back rounds.' },
      { id: 'lo3', slot: 'Hamstrings', tier: 'recommended', type: 'secondary', sets: 3, muscles: { hamstrings: 1 },
        alts: ['Seated leg curl', 'Lying leg curl', 'Standing leg curl'] },
      { id: 'lo4', slot: 'Quads', tier: 'recommended', type: 'secondary', sets: 3, muscles: { quads: 1 },
        alts: ['V-squat machine', 'Pendulum squat', 'Horizontal leg press', 'Leg extension'] },
      { id: 'lo5', slot: 'Calves', tier: 'recommended', type: 'isolation', sets: 3, muscles: { calves: 1 },
        alts: ['Standing calf raise', 'Seated calf raise', 'Leg-press calf raise'] },
      { id: 'lo6', slot: 'Abs', tier: 'optional', type: 'isolation', sets: 3, muscles: { core: 1 },
        alts: ['Cable crunch', 'Ab machine', 'Hanging knee raise', 'Reverse crunch'] }
    ]
  },
  'Chest & Shoulders': {
    hint: 'Chest, shoulders, triceps',
    exercises: [
      { id: 'cs1', slot: 'Incline press', tier: 'essential', type: 'main', sets: 3, muscles: { chest: 1, shoulders: 0.5, triceps: 0.5 },
        alts: ['Incline machine press', 'Incline dumbbell press', 'Smith incline press', 'Incline barbell press'] },
      { id: 'cs2', slot: 'Shoulder press', tier: 'essential', type: 'main', sets: 3, muscles: { shoulders: 1, triceps: 0.5 },
        alts: ['Shoulder-press machine', 'Dumbbell shoulder press', 'Smith overhead press', 'Barbell overhead press'] },
      { id: 'cs3', slot: 'Chest press', tier: 'recommended', type: 'secondary', sets: 3, muscles: { chest: 1, triceps: 0.5 },
        alts: ['Converging chest press', 'Flat dumbbell press', 'Smith bench press', 'Cable press'] },
      { id: 'cs4', slot: 'Side delts', tier: 'essential', type: 'isolation', sets: 4, muscles: { shoulders: 1 },
        alts: ['Cable lateral raise', 'Machine lateral raise', 'Dumbbell lateral raise'] },
      { id: 'cs5', slot: 'Chest fly', tier: 'recommended', type: 'isolation', sets: 2, muscles: { chest: 1 },
        alts: ['Pec-deck', 'Cable fly', 'Dumbbell fly'] },
      { id: 'cs6', slot: 'Triceps stretch', tier: 'recommended', type: 'isolation', sets: 3, muscles: { triceps: 1 },
        alts: ['Overhead cable extension', 'Overhead dumbbell extension', 'EZ-bar skull crusher'] },
      { id: 'cs7', slot: 'Triceps', tier: 'optional', type: 'isolation', sets: 2, muscles: { triceps: 1 },
        alts: ['Rope pressdown', 'Bar pressdown', 'Assisted dip machine'] }
    ]
  },
  'Back, Traps & Arms': {
    hint: 'Thickness, traps, arms, carries',
    exercises: [
      { id: 'ba1', slot: 'Thick row', tier: 'essential', type: 'main', sets: 3, muscles: { back: 1, biceps: 0.5, traps: 0.5 },
        alts: ['Chest-supported row (machine)', 'Chest-supported dumbbell row', 'Seated cable row', 'Iso-lateral row machine'] },
      { id: 'ba2', slot: 'Pull, new angle', tier: 'essential', type: 'secondary', sets: 3, muscles: { back: 1, biceps: 0.5 },
        alts: ['Iso-lateral front pulldown (neutral grip)', 'Underhand pulldown', 'Lat pulldown (cable)', 'Weighted / assisted pull-up'] },
      { id: 'ba3', slot: 'Carry', tier: 'recommended', type: 'carry', sets: 3, muscles: { traps: 1, core: 0.5 },
        alts: ["Farmer's carry (handles)", 'Trap-bar carry', "Dumbbell farmer's walk"],
        tip: 'Log the weight held in each hand (or the bar) and the metres walked per set.' },
      { id: 'ba4', slot: 'Side delts', tier: 'recommended', type: 'isolation', sets: 3, muscles: { shoulders: 1 },
        alts: ['Cable lateral raise', 'Machine lateral raise', 'Dumbbell lateral raise'] },
      { id: 'ba5', slot: 'Chest finisher', tier: 'optional', type: 'isolation', sets: 2, muscles: { chest: 1 },
        alts: ['Pec-deck', 'Cable fly', 'Machine chest press', 'Dumbbell fly'] },
      { id: 'ba6', slot: 'Hammer curl', tier: 'recommended', type: 'isolation', sets: 3, muscles: { biceps: 1 },
        alts: ['Hammer curl (dumbbell)', 'Rope hammer curl', 'Cross-body hammer curl', 'Cable curl'] },
      { id: 'ba7', slot: 'Triceps', tier: 'recommended', type: 'isolation', sets: 3, muscles: { triceps: 1 },
        alts: ['Rope pressdown', 'Overhead cable extension', 'EZ-bar skull crusher', 'Assisted dip machine'] },
      { id: 'ba8', slot: 'Neck', tier: 'optional', type: 'isolation', sets: 2, muscles: { neck: 1 },
        alts: ['Neck extension (plate or band)', 'Neck flexion (plate or band)', 'Neck machine'],
        tip: 'Go light and slow. Never jerk, build up over weeks, and stop at any dizziness or tingling.' },
      { id: 'ba9', slot: 'Leg add-on · press', tier: 'optional', type: 'secondary', sets: 2, muscles: { quads: 1, glutes: 0.5 },
        alts: ['Hack squat', '45° leg press', 'V-squat machine'] },
      { id: 'ba10', slot: 'Leg add-on · curl', tier: 'optional', type: 'secondary', sets: 2, muscles: { hamstrings: 1 },
        alts: ['Seated leg curl', 'Lying leg curl', 'Standing leg curl'] }
    ]
  }
};
var ORDER = ['Back & Biceps', 'Lower', 'Chest & Shoulders', 'Back, Traps & Arms'];
var PHASES = [
  { name: 'Adaptation', def: 'easy' },
  { name: 'Progression', def: 'heavy' },
  { name: 'Productive', def: 'heavy' },
  { name: 'Recovery', def: 'easy' }
];
var MODES = [
  { id: 'Express', sub: '≈ 45 min', tiers: ['essential'] },
  { id: 'Standard', sub: '≈ 65 min', tiers: ['essential', 'recommended'] },
  { id: 'Complete', sub: '≈ 80 min', tiers: ['essential', 'recommended', 'optional'] }
];
var PAGES = ['timer', 'train', 'history', 'progress', 'more'];
var MUSCLES = ['back', 'chest', 'shoulders', 'biceps', 'triceps', 'traps', 'quads', 'hamstrings', 'glutes', 'calves', 'core', 'neck'];

/* ---------- State ---------- */
var DEF = {
  requiredDone: [], rotationCount: 0, selectedWorkout: ORDER[0], mode: 'Standard', intensityOverride: null,
  variation: {}, sessionStart: {}, lastTimer: 90, lastBackup: null, phaseStart: null,
  streak: { count: 0, last: null },
  settings: { alarm: true, volume: 0.8, vibrate: true, wake: true },
  features: { measure: false, nutrition: false },
  nutrition: { kcal: 2700, protein: 165 }
};
var S = (function () {
  var s = load('state', {});
  var out = JSON.parse(JSON.stringify(DEF));
  Object.keys(s).forEach(function (k) {
    if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) Object.assign(out[k], s[k]);
    else out[k] = s[k];
  });
  if (!PROGRAM[out.selectedWorkout]) out.selectedWorkout = ORDER[0];
  if (!MODES.some(function (m) { return m.id === out.mode; })) out.mode = 'Standard';
  return out;
})();
var drafts = load('drafts', { entries: {}, done: {} });
if (!drafts.entries) drafts.entries = {};
if (!drafts.done) drafts.done = {};
var sessions = load('sessions', []);
var phaseHist = load('phaseHist', []);
var measures = load('measures', []);
function saveState() { save('state', S); }
var draftT = null;
function saveDrafts() { clearTimeout(draftT); draftT = setTimeout(function () { save('drafts', drafts); }, 120); }
function flush() { clearTimeout(draftT); save('drafts', drafts); saveState(); }
window.addEventListener('pagehide', flush);
document.addEventListener('visibilitychange', function () { if (document.hidden) flush(); });

/* ---------- Core logic ---------- */
function tiersFor(mode) { var m = MODES.filter(function (x) { return x.id === mode; })[0]; return m ? m.tiers : MODES[1].tiers; }
function visible(wk) {
  var tiers = tiersFor(S.mode), out = [];
  PROGRAM[wk].exercises.forEach(function (ex, idx) { if (tiers.indexOf(ex.tier) !== -1) out.push({ ex: ex, idx: idx }); });
  return out;
}
function curVariation(wk, idx) { var ex = PROGRAM[wk].exercises[idx]; var v = S.variation[wk + '|' + idx]; return v && ex.alts.indexOf(v) !== -1 ? v : ex.alts[0]; }
function dKey(wk, idx, v) { return wk + '|' + idx + '|' + v; }
function readinessToday() { var r = load('readiness', null); return r && r.date === today() ? r : null; }

function recommended() {
  var reasons = [], score = 0, r = readinessToday();
  if (r) {
    if (+r.energy <= 2) { score += 2; reasons.push('low energy'); }
    if (+r.soreness >= 4) { score += 2; reasons.push('high soreness'); }
    if (+r.sleep <= 2) { score += 2; reasons.push('poor sleep'); }
    if (+r.motivation <= 2) { score += 1; reasons.push('low motivation'); }
  }
  var last6 = sessions.slice(-6);
  if (last6.length >= 6 && last6.every(function (s) { return s.intensity === 'heavy'; })) { score += 2; reasons.push('six heavy sessions in a row'); }
  var ph = PHASES[S.rotationCount % 4], value;
  if (score >= 3) value = 'easy';
  else { value = ph.def; if (!reasons.length) reasons.push(ph.name + ' phase' + (value === 'heavy' ? ', recovery looks good' : '')); }
  return { value: value, reasons: reasons, score: score };
}
function intensity() { return S.intensityOverride || recommended().value; }
function fatigueLevel() { var s = recommended().score; return s >= 4 ? 'High' : s >= 2 ? 'Moderate' : 'Low'; }

function prescription(ex) {
  var i = intensity(), e = i === 'easy', r = RANGES[ex.type];
  return { int: i, sets: e ? 2 : ex.sets, lo: e ? r.eLo : r.lo, hi: e ? r.eHi : r.hi, rir: e ? '3–4' : '1–2', unit: ex.type === 'carry' ? 'm' : 'reps', rest: REST[i][ex.type] };
}

/* ---- per-variation history: loads are tracked for each variation separately ---- */
function variationHistory(name) {
  var out = [];
  sessions.forEach(function (s) {
    s.exercises.forEach(function (e) {
      var L = num(e.load);
      if (e.name === name && !isNaN(L) && L > 0) {
        out.push({ date: s.date, load: L, reps: (e.reps || []).map(num).filter(function (x) { return !isNaN(x); }), rir: e.rir, intensity: s.intensity });
      }
    });
  });
  return out;
}
function bestMap() {
  var best = {};
  sessions.forEach(function (s) {
    s.exercises.forEach(function (e) {
      var L = num(e.load); if (isNaN(L) || L <= 0) return;
      var mr = Math.max.apply(null, [0].concat((e.reps || []).map(num).filter(function (x) { return !isNaN(x); })));
      var b = best[e.name];
      if (!b || L > b.load || (L === b.load && mr > b.reps)) best[e.name] = { load: L, reps: mr, date: s.date };
    });
  });
  return best;
}
function suggest(variation, ex) {
  var rx = prescription(ex), hist = variationHistory(variation), easy = rx.int === 'easy';
  if (!hist.length) return { last: null, load: null, text: 'First time on this variation. Pick a load you control for ' + rx.lo + ' clean reps and stop ' + rx.rir + ' reps short.' };
  var lastAny = hist[hist.length - 1];
  var heavyH = hist.filter(function (h) { return h.intensity === 'heavy'; });
  var easyH = hist.filter(function (h) { return h.intensity === 'easy'; });
  var lastHeavy = heavyH[heavyH.length - 1], lastEasy = easyH[easyH.length - 1];
  var last = fmt(lastAny.load) + ' kg · ' + (lastAny.reps.join('/') || '—') + ' · RIR ' + (lastAny.rir || '—') + ' · ' + lastAny.intensity + ' · ' + fdate(lastAny.date);
  if (easy && lastHeavy && lastAny.intensity === 'easy') last += '  (last heavy ' + fmt(lastHeavy.load) + ' kg)';
  var load, text, step = function (l) { return l < 20 ? 1 : (ex.type === 'lower' ? 5 : 2.5); };
  if (easy) {
    if (lastHeavy) { load = roundLoad(lastHeavy.load * 0.875); text = 'Easy day: ' + fmt(load) + ' kg, about 12% under your last heavy ' + fmt(lastHeavy.load) + ' kg.'; }
    else { load = lastEasy.load; text = 'Easy day: repeat ' + fmt(load) + ' kg and keep ' + rx.rir + ' reps in reserve.'; }
  } else if (lastHeavy) {
    var minR = lastHeavy.reps.length ? Math.min.apply(null, lastHeavy.reps) : 0;
    var rirN = num(lastHeavy.rir);
    var hitTop = lastHeavy.reps.length > 0 && minR >= rx.hi;
    var tooEasy = !isNaN(rirN) && rirN >= 4 && minR >= rx.lo;
    if (hitTop || tooEasy) {
      load = roundLoad(lastHeavy.load + step(lastHeavy.load));
      text = (hitTop ? 'Top of the range reached' : 'Last heavy set felt easy') + '. Go to ' + fmt(load) + ' kg and aim for ' + rx.lo + '+ reps.';
    } else {
      load = lastHeavy.load;
      var target = Math.min(rx.hi, (minR || rx.lo - 1) + 1);
      text = 'Repeat ' + fmt(load) + ' kg and aim for ' + target + ' on every set.';
    }
  } else {
    load = roundLoad(lastEasy.load / 0.875);
    text = 'Heavy day: your easy load was ' + fmt(lastEasy.load) + ' kg. Start near ' + fmt(load) + ' kg and find your ' + rx.lo + '-rep weight.';
  }
  return { last: last, load: load, text: text };
}

/* =========================================================
   TIMER (+ alarm, audio, wake lock)
   ========================================================= */
var T = { secs: S.lastTimer || 90, left: S.lastTimer || 90, end: 0, id: null, running: false };
var CIRC = 2 * Math.PI * 100;
var actx = null, alarmLoop = null, alarmStop = null, wakeLock = null;

function unlockAudio() {
  try {
    if (!actx) { var AC = window.AudioContext || window.webkitAudioContext; if (AC) actx = new AC(); }
    if (actx && actx.state === 'suspended') actx.resume();
    if (actx) { var b = actx.createBuffer(1, 1, 22050), s = actx.createBufferSource(); s.buffer = b; s.connect(actx.destination); s.start(0); }
  } catch (e) {}
}
document.addEventListener('click', unlockAudio, true);
document.addEventListener('touchend', unlockAudio, true);

function chime(at, freq, vol) {
  var o = actx.createOscillator(), g = actx.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), at + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.55);
  o.connect(g); g.connect(actx.destination);
  o.start(at); o.stop(at + 0.6);
}
function burst() {
  if (!actx) return;
  try {
    if (actx.state === 'suspended') actx.resume();
    var t = actx.currentTime + 0.05, v = (S.settings.volume || 0.8) * 0.6;
    [0, 0.34, 0.68].forEach(function (o) { chime(t + o, 880, v); chime(t + o, 1318.5, v * 0.55); });
  } catch (e) {}
  if (S.settings.vibrate) vib([220, 110, 220, 110, 420]);
}
function startAlarmSound() {
  stopAlarmSound();
  if (!S.settings.alarm) return;
  unlockAudio(); burst();
  alarmLoop = setInterval(burst, 1700);
  alarmStop = setTimeout(stopAlarmSound, 25000);
}
function stopAlarmSound() { clearInterval(alarmLoop); clearTimeout(alarmStop); alarmLoop = null; alarmStop = null; }
function showAlarm() {
  var a = $('#alarm'); a.hidden = false; requestAnimationFrame(function () { a.classList.add('on'); });
  startAlarmSound();
}
function hideAlarm() {
  stopAlarmSound();
  var a = $('#alarm'); a.classList.remove('on'); setTimeout(function () { a.hidden = true; }, 350);
}
function lockScreen(on) {
  try {
    if (on && S.settings.wake && 'wakeLock' in navigator && !wakeLock) {
      navigator.wakeLock.request('screen').then(function (l) { wakeLock = l; l.addEventListener('release', function () { wakeLock = null; }); }).catch(function () {});
    } else if (!on && wakeLock) { wakeLock.release(); wakeLock = null; }
  } catch (e) {}
}
function timerSet(s) {
  clearInterval(T.id); T.id = null; T.running = false; T.secs = s; T.left = s; T.end = 0;
  S.lastTimer = s; saveState(); lockScreen(false); renderTimer();
}
function timerStart() {
  if (T.running) return;
  unlockAudio();
  if (T.left <= 0) T.left = T.secs;
  T.end = Date.now() + T.left * 1000; T.running = true;
  T.id = setInterval(timerTick, 200);
  lockScreen(true); renderTimer();
}
function timerPause() {
  if (!T.running) return;
  clearInterval(T.id); T.id = null; T.running = false;
  T.left = Math.max(0, Math.ceil((T.end - Date.now()) / 1000)); T.end = 0;
  lockScreen(false); renderTimer();
}
function timerToggle() { T.running ? timerPause() : timerStart(); }
function timerAdjust(d) {
  var wasRunning = T.running;
  if (wasRunning) { T.end += d * 1000; T.left = Math.max(1, Math.ceil((T.end - Date.now()) / 1000)); }
  else { T.secs = Math.max(15, T.secs + d); T.left = T.secs; S.lastTimer = T.secs; saveState(); }
  if (wasRunning) T.secs = Math.max(T.secs, T.left);
  renderTimer();
}
function timerTick() {
  var left = Math.max(0, Math.ceil((T.end - Date.now()) / 1000));
  if (left !== T.left) { T.left = left; var d = $('#tDisplay'); if (d && left <= 5 && left > 0) { d.classList.remove('tick'); void d.offsetWidth; d.classList.add('tick'); } }
  renderTimer(true);
  if (left <= 0) { clearInterval(T.id); T.id = null; T.running = false; T.end = 0; lockScreen(false); renderTimer(); showAlarm(); }
}
document.addEventListener('visibilitychange', function () { if (!document.hidden) { if (T.running) timerTick(); if (T.running) lockScreen(true); } });
function renderTimer(light) {
  var txt = mmss(T.left), frac = T.secs ? Math.max(0, Math.min(1, T.left / T.secs)) : 0;
  var disp = $('#tDisplay'); if (disp) disp.textContent = txt;
  var mt = $('#miniTime'); if (mt) mt.textContent = txt;
  var ring = $('#tRing'); if (ring) ring.style.strokeDashoffset = String(CIRC * (1 - frac));
  var fill = $('#miniFill'); if (fill) fill.style.width = (frac * 100) + '%';
  var lab = $('#tLabel'); if (lab) lab.textContent = T.running ? 'Resting' : (T.left <= 0 ? 'Done' : (T.left < T.secs ? 'Paused' : 'Ready'));
  var hero = $('#timerHero'); if (hero) hero.classList.toggle('running', T.running);
  var label = T.running ? 'Pause' : (T.left < T.secs && T.left > 0 ? 'Resume' : 'Start');
  var st = $('#tStart'); if (st) st.textContent = label;
  var mb = $('#miniBtn'); if (mb) mb.textContent = label;
  if (light) return;
  $$('#tPresets .pchip').forEach(function (b) { b.classList.toggle('active', +b.dataset.s === T.secs); });
  var bell = $('#tBell'); if (bell) bell.classList.toggle('off', !S.settings.alarm);
}
function buildPresets() {
  $('#tPresets').innerHTML = [45, 60, 90, 120, 150, 180].map(function (s) { return '<button class="pchip" type="button" data-s="' + s + '">' + mmss(s).replace(/^0/, '') + '</button>'; }).join('');
}
function renderRestGuide() {
  $('#restGuide').innerHTML = '<h3>Suggested rest</h3><p>Heavy: 2:30 for main lifts, 2:00 for secondary lifts, 1:15 for isolation.<br>Easy: 1:30 for main lifts, 1:00–1:15 for the rest.</p>' +
    '<div class="center" style="margin-top:10px"><button class="btn btn-soft btn-sm" type="button" data-set="150">2:30</button><button class="btn btn-soft btn-sm" type="button" data-set="120">2:00</button><button class="btn btn-soft btn-sm" type="button" data-set="75">1:15</button><button class="btn btn-soft btn-sm" type="button" data-set="60">1:00</button></div>';
}

/* =========================================================
   NAVIGATION
   ========================================================= */
var curPage = 'timer';
function go(name) {
  if (PAGES.indexOf(name) === -1) name = 'timer';
  curPage = name;
  $$('.page').forEach(function (p) { p.classList.toggle('active', p.dataset.page === name); });
  $$('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.go === name); });
  $('#tabInd').style.transform = 'translateX(' + (PAGES.indexOf(name) * 100) + '%)';
  var pg = $('#pages'); pg.scrollTop = 0;
  if (name === 'train') renderTrain();
  if (name === 'history') renderHistory();
  if (name === 'progress') renderProgress();
  if (name === 'more') renderMore();
}

/* =========================================================
   TRAIN
   ========================================================= */
var pickerBuilt = false;
function buildPickers() {
  if (pickerBuilt) return;
  $('#wkPicker').innerHTML = ORDER.map(function (n) { return '<button class="chip" type="button" data-wk="' + esc(n) + '">' + esc(n) + '<small></small></button>'; }).join('');
  $('#modeTabs').innerHTML = MODES.map(function (m) { return '<button class="chip" type="button" data-mode="' + m.id + '">' + m.id + '<small>' + m.sub + '</small></button>'; }).join('');
  pickerBuilt = true;
}
function nextWorkout() { for (var i = 0; i < ORDER.length; i++) if (S.requiredDone.indexOf(ORDER[i]) === -1) return ORDER[i]; return ORDER[0]; }
function updatePickers() {
  var nxt = nextWorkout();
  $$('#wkPicker .chip').forEach(function (c) {
    var n = c.dataset.wk; c.classList.toggle('active', n === S.selectedWorkout);
    c.querySelector('small').textContent = S.requiredDone.indexOf(n) !== -1 ? 'Done this round' : (n === nxt ? 'Up next' : '\u00a0');
  });
  $$('#modeTabs .chip').forEach(function (c) { c.classList.toggle('active', c.dataset.mode === S.mode); });
}
function renderDecision() {
  var rec = recommended(), cur = intensity(), manual = !!S.intensityOverride;
  var sw = $('#intSwitch'); sw.dataset.v = cur;
  $$('#intSwitch button').forEach(function (b) { b.classList.toggle('on', b.dataset.int === cur); });
  $('#decisionLine').textContent = manual ? (cur === rec.value ? 'You chose the recommended mode.' : 'Manual choice. You are in control.') : 'Following the recommendation.';
  $('#recLine').innerHTML = '<span>Recommended: <b style="color:var(--ink)">' + (rec.value === 'easy' ? 'Easy' : 'Heavy') + '</b> · ' + esc(rec.reasons.join(', ')) + '</span>' +
    (manual ? ' <button class="btn btn-soft btn-sm" type="button" id="intAuto">Use recommended</button>' : '');
  var lv = fatigueLevel(), fb = $('#fatigueBadge');
  fb.textContent = 'Fatigue ' + lv.toLowerCase(); fb.className = 'badge ' + (lv === 'High' ? 'bad' : lv === 'Moderate' ? 'mid' : 'ok');
}
function renderReadiness() {
  var r = readinessToday() || {};
  var groups = [['energy', 'Energy'], ['soreness', 'Soreness'], ['sleep', 'Sleep quality'], ['motivation', 'Motivation']];
  $('#readyBody').innerHTML = groups.map(function (g) {
    return '<div class="segg"><span class="lab">' + g[1] + '</span><div class="segs" data-g="' + g[0] + '">' +
      [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" class="sb' + (+r[g[0]] === n ? ' active' : '') + '" data-v="' + n + '">' + n + '</button>'; }).join('') + '</div></div>';
  }).join('') + '<p class="note">1 = low, 5 = high. Poor energy, sleep or motivation, or high soreness, will recommend an easy session.</p>';
}
function cardHTML(wk, idx) {
  var ex = PROGRAM[wk].exercises[idx], v = curVariation(wk, idx), dk = dKey(wk, idx, v);
  var d = drafts.entries[dk] || {}, done = !!drafts.done[wk + '|' + idx];
  var rx = prescription(ex), sg = suggest(v, ex), best = bestMap()[v];
  var reps = d.reps || [];
  var opts = ex.alts.map(function (a) { return '<option value="' + esc(a) + '"' + (a === v ? ' selected' : '') + '>' + esc(a) + '</option>'; }).join('');
  var repInputs = '';
  for (var i = 0; i < rx.sets; i++) {
    repInputs += '<div class="f"><label>' + (rx.unit === 'm' ? 'S' + (i + 1) + ' m' : 'Set ' + (i + 1)) + '</label><input class="inp" data-f="r' + i + '" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="' + rx.lo + '" value="' + esc(reps[i] || '') + '"></div>';
  }
  return '<article class="exercise' + (done ? ' done' : '') + '" data-wk="' + esc(wk) + '" data-idx="' + idx + '" data-dk="' + esc(dk) + '">' +
    '<div class="ex-top"><input class="chk" type="checkbox" aria-label="Mark done" ' + (done ? 'checked' : '') + '>' +
    '<div><div class="slot">' + esc(ex.slot) + ' · ' + ex.tier + '</div><div class="ex-name">' + esc(v) + '</div>' +
    '<span class="badge dark live-pr" data-livepr>New best</span></div>' +
    '<div class="rx">' + rx.sets + ' × ' + rx.lo + '–' + rx.hi + (rx.unit === 'm' ? ' m' : '') + '<small>RIR ' + rx.rir + ' · rest ' + mmss(rx.rest).replace(/^0/, '') + '</small></div></div>' +
    '<div class="var-row"><label>Variation</label><select class="var" aria-label="Variation">' + opts + '</select></div>' +
    (sg.last ? '<div class="hint"><span>Last on this variation: <b>' + esc(sg.last) + '</b></span></div>' : '') +
    '<div class="sug"><span>' + esc(sg.text) + '</span>' + (sg.load != null ? '<button class="btn btn-ghost btn-sm" type="button" data-use="' + sg.load + '">Use ' + fmt(sg.load) + '</button>' : '') + '</div>' +
    '<div class="logrow" style="--n:' + rx.sets + '"><div class="f"><label>Load kg</label><input class="inp" data-f="load" inputmode="decimal" autocomplete="off" placeholder="' + (sg.load != null ? fmt(sg.load) : 'kg') + '" value="' + esc(d.load || '') + '"></div>' +
    repInputs + '<div class="f"><label>RIR</label><input class="inp" data-f="rir" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="' + rx.rir.charAt(0) + '" value="' + esc(d.rir || '') + '"></div></div>' +
    '<div class="ex-foot"><button class="btn btn-soft btn-sm" type="button" data-tech>Technique</button><button class="btn btn-primary btn-sm" type="button" data-rest="' + rx.rest + '">Rest ' + mmss(rx.rest).replace(/^0/, '') + '</button></div>' +
    '<div class="tech"><div><p>' + esc(ex.tip || TECH[ex.type]) + '</p></div></div>' +
    '</article>';
}
function renderWorkout() {
  var wk = S.selectedWorkout, list = visible(wk);
  $('#workoutPanel').innerHTML = list.map(function (o) { return cardHTML(wk, o.idx); }).join('');
  $$('#workoutPanel .exercise').forEach(updateLive);
  updateSummary();
}
function updateLive(card) {
  var wk = card.dataset.wk, idx = +card.dataset.idx, v = curVariation(wk, idx), b = bestMap()[v];
  var L = num((card.querySelector('[data-f="load"]') || {}).value);
  var mx = Math.max.apply(null, [0].concat($$('[data-f^="r"]', card).filter(function (i) { return i.dataset.f !== 'rir'; }).map(function (i) { return num(i.value); }).filter(function (x) { return !isNaN(x); })));
  var is = !!b && !isNaN(L) && (L > b.load || (L === b.load && mx > b.reps));
  var chip = card.querySelector('[data-livepr]'); if (chip) chip.classList.toggle('show', is);
}
function updateSummary() {
  var wk = S.selectedWorkout, list = visible(wk);
  var done = list.filter(function (o) { return drafts.done[wk + '|' + o.idx]; }).length;
  var pct = list.length ? Math.round(done / list.length * 100) : 0;
  $('#sumTitle').textContent = done + ' of ' + list.length + ' exercises';
  var base = MODES.filter(function (m) { return m.id === S.mode; })[0].sub.replace(/[^\d]/g, '');
  var mins = Math.round(+base * (intensity() === 'easy' ? 0.85 : 1) / 5) * 5;
  $('#sumSub').textContent = '≈ ' + mins + ' min · ' + (intensity() === 'easy' ? 'Easy' : 'Heavy') + ' session';
  $('#pring').style.setProperty('--p', pct); $('#pringTxt').textContent = pct + '%';
}
function renderTrain() {
  buildPickers(); updatePickers(); renderDecision(); renderReadiness();
  var ph = PHASES[S.rotationCount % 4];
  $('#trainEyebrow').textContent = 'Block ' + (Math.floor(S.rotationCount / 4) + 1) + ' · ' + ph.name;
  $('#trainTitle').textContent = S.selectedWorkout;
  renderWorkout(); renderTimer();
}
function markStart(wk) { if (!S.sessionStart[wk]) { S.sessionStart[wk] = Date.now(); saveState(); } }

/* ---------- Train events (delegated: nothing re-renders while typing) ---------- */
function bindTrain() {
  var panel = $('#workoutPanel');
  panel.addEventListener('input', function (e) {
    var t = e.target; if (!t.classList.contains('inp')) return;
    var card = t.closest('.exercise'), dk = card.dataset.dk, f = t.dataset.f;
    var d = drafts.entries[dk] || (drafts.entries[dk] = { reps: [] });
    if (!d.reps) d.reps = [];
    if (f === 'load') d.load = t.value;
    else if (f === 'rir') d.rir = t.value;
    else if (f && f.charAt(0) === 'r') { var i = +f.slice(1); while (d.reps.length <= i) d.reps.push(''); d.reps[i] = t.value; }
    markStart(card.dataset.wk); saveDrafts();
  });
  panel.addEventListener('change', function (e) {
    var t = e.target, card = t.closest('.exercise'); if (!card) return;
    if (t.classList.contains('inp')) { updateLive(card); return; }
    if (t.classList.contains('chk')) {
      var key = card.dataset.wk + '|' + card.dataset.idx;
      if (t.checked) drafts.done[key] = true; else delete drafts.done[key];
      card.classList.toggle('done', t.checked); markStart(card.dataset.wk); saveDrafts(); updateSummary(); vib(12); return;
    }
    if (t.classList.contains('var')) {
      S.variation[card.dataset.wk + '|' + card.dataset.idx] = t.value; saveState();
      card.outerHTML = cardHTML(card.dataset.wk, +card.dataset.idx);
      var nc = $('#workoutPanel .exercise[data-idx="' + card.dataset.idx + '"]'); if (nc) updateLive(nc);
    }
  });
  panel.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var card = b.closest('.exercise');
    if (b.hasAttribute('data-use')) {
      var inp = card.querySelector('[data-f="load"]'); inp.value = b.getAttribute('data-use');
      inp.dispatchEvent(new Event('input', { bubbles: true })); updateLive(card); vib(10);
    } else if (b.hasAttribute('data-tech')) {
      card.querySelector('.tech').classList.toggle('open');
    } else if (b.hasAttribute('data-rest')) {
      timerSet(+b.getAttribute('data-rest')); timerStart(); toast('Rest started · ' + mmss(+b.getAttribute('data-rest')));
    }
  });
  $('#wkPicker').addEventListener('click', function (e) {
    var c = e.target.closest('[data-wk]'); if (!c) return;
    S.selectedWorkout = c.dataset.wk; saveState(); renderTrain(); vib(8);
  });
  $('#modeTabs').addEventListener('click', function (e) {
    var c = e.target.closest('[data-mode]'); if (!c) return;
    S.mode = c.dataset.mode; saveState(); updatePickers(); renderWorkout(); vib(8);
  });
  $('#decision').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.int) { S.intensityOverride = b.dataset.int; saveState(); renderDecision(); renderWorkout(); vib(10); }
    else if (b.id === 'intAuto') { S.intensityOverride = null; saveState(); renderDecision(); renderWorkout(); }
  });
  $('#readyBody').addEventListener('click', function (e) {
    var b = e.target.closest('.sb'); if (!b) return;
    var g = b.parentNode.dataset.g, r = readinessToday() || { date: today() };
    r[g] = +b.dataset.v; save('readiness', r);
    $$('.sb', b.parentNode).forEach(function (x) { x.classList.toggle('active', x === b); });
    renderDecision(); renderWorkout();
  });
  $('#btnComplete').addEventListener('click', completeWorkout);
  var mini = $('#mini');
  $('#pages').addEventListener('scroll', function () { mini.classList.toggle('stuck', $('#pages').scrollTop > 6); }, { passive: true });
  $('#miniBtn').addEventListener('click', timerToggle);
  mini.addEventListener('click', function (e) { if (e.target === mini || e.target.id === 'miniTime') go('timer'); });
}

/* ---------- Complete workout ---------- */
var completing = false;
function completeWorkout() {
  if (completing) return;
  var wk = S.selectedWorkout, list = visible(wk), exs = [], best = bestMap(), intens = intensity();
  list.forEach(function (o) {
    var ex = o.ex, v = curVariation(wk, o.idx), d = drafts.entries[dKey(wk, o.idx, v)] || {}, done = !!drafts.done[wk + '|' + o.idx];
    var rx = prescription(ex), reps = (d.reps || []).slice(0, rx.sets);
    var has = (d.load && String(d.load).trim() !== '') || reps.some(function (r) { return r !== '' && r != null; }) || (d.rir && String(d.rir).trim() !== '');
    if (!has && !done) return;
    var e = { id: ex.id, slot: ex.slot, name: v, type: ex.type, load: d.load || '', reps: reps, rir: d.rir || '', done: done, sets: rx.sets };
    var L = num(e.load), mr = Math.max.apply(null, [0].concat(reps.map(num).filter(function (x) { return !isNaN(x); })));
    var b = best[v];
    if (!isNaN(L) && L > 0 && b && (L > b.load || (L === b.load && mr > b.reps))) e.pr = true;
    exs.push(e);
  });
  if (!exs.length) { toast('Log or tick at least one exercise first.'); return; }
  completing = true; setTimeout(function () { completing = false; }, 800);

  var now = new Date(), started = S.sessionStart[wk];
  var s = { id: uid(), date: dstr(now), time: pad(now.getHours()) + ':' + pad(now.getMinutes()), workout: wk, intensity: intens, mode: S.mode,
    block: Math.floor(S.rotationCount / 4) + 1, phase: PHASES[S.rotationCount % 4].name,
    duration: started ? Math.max(1, Math.round((Date.now() - started) / 60000)) : null, exercises: exs };
  sessions.push(s); save('sessions', sessions);

  var setsLogged = 0, vol = 0, prs = [];
  exs.forEach(function (e) {
    var L = num(e.load);
    e.reps.forEach(function (r) { var n = num(r); if (!isNaN(n)) { setsLogged++; if (!isNaN(L) && e.type !== 'carry') vol += L * n; } });
    if (e.pr) prs.push(e.name);
  });

  /* rotation + phase + streak */
  var rotationDone = false;
  if (S.requiredDone.indexOf(wk) === -1) S.requiredDone.push(wk);
  if (!S.phaseStart) S.phaseStart = s.date;
  if (S.requiredDone.length >= ORDER.length) {
    phaseHist.push({ block: Math.floor(S.rotationCount / 4) + 1, name: PHASES[S.rotationCount % 4].name, start: S.phaseStart, end: s.date }); save('phaseHist', phaseHist);
    S.rotationCount++; S.requiredDone = []; S.phaseStart = null; rotationDone = true;
    var st = S.streak, tdy = new Date(new Date().toDateString());
    if (st.last) { var gap = Math.round((tdy - new Date(st.last + 'T00:00:00')) / 86400000); st.count = gap <= 10 ? st.count + 1 : 1; } else st.count = 1;
    st.last = s.date;
  }
  Object.keys(drafts.entries).forEach(function (k) { if (k.indexOf(wk + '|') === 0) delete drafts.entries[k]; });
  Object.keys(drafts.done).forEach(function (k) { if (k.indexOf(wk + '|') === 0) delete drafts.done[k]; });
  delete S.sessionStart[wk]; S.intensityOverride = null;
  S.selectedWorkout = nextWorkout();
  flush(); vib([30, 40, 30]);

  var nxt = S.selectedWorkout;
  openSheet('<h2>Workout complete</h2><p class="sub">' + esc(wk) + ' · ' + (intens === 'easy' ? 'Easy' : 'Heavy') + (s.duration ? ' · ' + s.duration + ' min' : '') + '</p>' +
    '<div class="sgrid"><div><b>' + exs.length + '</b><span>Exercises</span></div><div><b>' + setsLogged + '</b><span>Sets logged</span></div><div><b>' + (vol ? Math.round(vol).toLocaleString() : '—') + '</b><span>Volume kg</span></div></div>' +
    (prs.length ? '<div class="card" style="box-shadow:none;background:var(--soft)"><h3>New personal best' + (prs.length > 1 ? 's' : '') + '</h3>' + prs.map(function (n) { return '<p style="color:var(--ink)">• ' + esc(n) + '</p>'; }).join('') + '</div>' : '') +
    (rotationDone ? '<p class="sub" style="color:var(--ink);font-weight:700">Phase complete. Next up: ' + esc(PHASES[S.rotationCount % 4].name) + '.</p>' : '') +
    '<p class="sub">Next workout: <b style="color:var(--ink)">' + esc(nxt) + '</b></p>' +
    '<div class="center"><button class="btn btn-primary btn-xl" type="button" data-sheet="close">Done</button><button class="btn btn-ghost btn-xl" type="button" data-sheet="history">View history</button></div>');
  cal.sel = s.date; cal.y = now.getFullYear(); cal.m = now.getMonth();
  renderTrain();
}
function openSheet(html) { $('#sheetPanel').innerHTML = html; $('#sheet').hidden = false; }
function closeSheet() { $('#sheet').hidden = true; }

/* =========================================================
   HISTORY (calendar)
   ========================================================= */
var cal = (function () { var n = new Date(); return { y: n.getFullYear(), m: n.getMonth(), sel: null }; })();
function sessionsByDate() { var map = {}; sessions.forEach(function (s) { (map[s.date] = map[s.date] || []).push(s); }); return map; }
function renderHistory() {
  var map = sessionsByDate(), first = new Date(cal.y, cal.m, 1), offset = (first.getDay() + 6) % 7, tdy = today();
  $('#calTitle').textContent = first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  var html = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function (d) { return '<div class="dow">' + d + '</div>'; }).join('');
  for (var i = 0; i < 42; i++) {
    var d = new Date(cal.y, cal.m, 1 - offset + i), k = dstr(d), list = map[k] || [], out = d.getMonth() !== cal.m;
    var dots = list.slice(0, 3).map(function (s) { return '<i class="dot' + (s.intensity === 'easy' ? ' e' : '') + '"></i>'; }).join('');
    html += '<button type="button" class="day' + (out ? ' out' : '') + (k === tdy ? ' today' : '') + (k === cal.sel ? ' sel' : '') + '" data-d="' + k + '" aria-label="' + k + '"><span>' + d.getDate() + '</span><span class="dots">' + dots + '</span></button>';
  }
  $('#calGrid').innerHTML = html;
  var inMonth = sessions.filter(function (s) { var p = s.date.split('-'); return +p[0] === cal.y && +p[1] - 1 === cal.m; });
  var h = inMonth.filter(function (s) { return s.intensity === 'heavy'; }).length;
  $('#calSummary').textContent = inMonth.length ? inMonth.length + ' session' + (inMonth.length > 1 ? 's' : '') + ' this month · ' + h + ' heavy · ' + (inMonth.length - h) + ' easy' : 'No sessions this month yet.';
  renderDayDetail();
  var rec = sessions.slice(-6).reverse();
  $('#recentList').innerHTML = rec.length ? rec.map(function (s) {
    return '<button type="button" data-jump="' + s.date + '"><span><b>' + esc(s.workout) + '</b><br><span class="muted" style="font-size:.78rem">' + fdate(s.date) + ' · ' + s.time + '</span></span><span class="badge ' + (s.intensity === 'easy' ? 'light' : 'dark') + '">' + (s.intensity === 'easy' ? 'Easy' : 'Heavy') + '</span></button>';
  }).join('') : '<div class="empty">Your completed workouts will appear here.</div>';
}
function sessionHTML(s) {
  var prs = s.exercises.filter(function (e) { return e.pr; }).length;
  var rows = s.exercises.map(function (e) {
    var L = num(e.load), reps = (e.reps || []).filter(function (r) { return r !== '' && r != null; });
    var right = (!isNaN(L) && L > 0 ? fmt(L) + ' kg' : '—') + (reps.length ? ' × ' + reps.join(' / ') + (e.type === 'carry' ? ' m' : '') : '') + (e.rir !== '' && e.rir != null ? ' · RIR ' + esc(e.rir) : '');
    return '<li><span class="n">' + esc(e.name) + (e.pr ? ' <span class="badge dark">PR</span>' : '') + '</span><span class="v">' + esc(right) + '</span></li>';
  }).join('');
  return '<div class="sess"><div class="sess-head"><b>' + esc(s.workout) + '</b><span class="badge ' + (s.intensity === 'easy' ? 'light' : 'dark') + '">' + (s.intensity === 'easy' ? 'Easy' : 'Heavy') + '</span></div>' +
    '<div class="sess-meta">' + s.time + (s.duration ? ' · ' + s.duration + ' min' : '') + ' · ' + s.exercises.length + ' exercises' + (prs ? ' · ' + prs + ' PR' : '') + ' · Block ' + s.block + ' ' + esc(s.phase) + ' · ' + esc(s.mode) + '</div>' +
    '<ul class="sess-ex">' + rows + '</ul><div class="center" style="margin-top:10px"><button class="btn btn-danger btn-sm" type="button" data-del="' + s.id + '">Delete session</button></div></div>';
}
function renderDayDetail() {
  var ex = $('#dayExpand'), det = $('#dayDetail');
  if (!cal.sel) { ex.classList.remove('open'); return; }
  var list = sessionsByDate()[cal.sel] || [];
  var title = new Date(cal.sel + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  det.innerHTML = '<div class="eyebrow" style="margin:16px 4px 0">' + esc(title) + '</div>' + (list.length ? list.map(sessionHTML).join('') : '<div class="sess"><div class="empty">Rest day. Nothing logged.</div></div>');
  requestAnimationFrame(function () { ex.classList.add('open'); });
}
function bindHistory() {
  $('#calGrid').addEventListener('click', function (e) {
    var b = e.target.closest('.day'); if (!b) return;
    var k = b.dataset.d;
    if (cal.sel === k) { cal.sel = null; $('#dayExpand').classList.remove('open'); $$('#calGrid .day').forEach(function (x) { x.classList.remove('sel'); }); return; }
    cal.sel = k; var p = k.split('-'); cal.y = +p[0]; cal.m = +p[1] - 1;
    var wasOpen = $('#dayExpand').classList.contains('open');
    if (wasOpen) $('#dayExpand').classList.remove('open');
    setTimeout(renderHistory, wasOpen ? 220 : 0); if (!wasOpen) renderHistory();
    vib(8);
  });
  $('#calPrev').addEventListener('click', function () { cal.m--; if (cal.m < 0) { cal.m = 11; cal.y--; } cal.sel = null; renderHistory(); });
  $('#calNext').addEventListener('click', function () { cal.m++; if (cal.m > 11) { cal.m = 0; cal.y++; } cal.sel = null; renderHistory(); });
  $('#recentList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-jump]'); if (!b) return;
    var k = b.dataset.jump, p = k.split('-'); cal.sel = k; cal.y = +p[0]; cal.m = +p[1] - 1; renderHistory(); $('#pages').scrollTop = 0;
  });
  $('#dayDetail').addEventListener('click', function (e) {
    var b = e.target.closest('[data-del]'); if (!b) return;
    var ok = true; try { ok = confirm('Delete this session from your history?'); } catch (x) {}
    if (!ok) return;
    sessions = sessions.filter(function (s) { return s.id !== b.dataset.del; }); save('sessions', sessions); renderHistory(); toast('Session deleted');
  });
}

/* =========================================================
   PROGRESS
   ========================================================= */
function weeklySets() {
  var m = {}, tiers = tiersFor(S.mode), i = intensity();
  ORDER.forEach(function (wk) { PROGRAM[wk].exercises.forEach(function (ex) {
    if (tiers.indexOf(ex.tier) === -1) return;
    var sets = i === 'easy' ? 2 : ex.sets;
    Object.keys(ex.muscles).forEach(function (k) { m[k] = (m[k] || 0) + sets * ex.muscles[k]; });
  }); });
  return m;
}
function renderProgress() {
  var circ = 2 * Math.PI * 42, done = S.requiredDone.length, ph = PHASES[S.rotationCount % 4];
  $('#blockHero').innerHTML = '<div class="hero-row"><div class="bigring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="8"/><circle cx="50" cy="50" r="42" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + circ + '" stroke-dashoffset="' + (circ * (1 - done / 4)) + '" style="transition:stroke-dashoffset .8s cubic-bezier(.22,.8,.24,1)"/></svg><div class="c"><b>' + done + '/4</b><span>this phase</span></div></div>' +
    '<div><div class="eyebrow">Block ' + (Math.floor(S.rotationCount / 4) + 1) + '</div><h2>' + ph.name + '</h2><p>Finish all four workouts to complete the phase. Blocks repeat forever.</p></div></div>' +
    '<div class="stats"><div class="stat"><b>' + sessions.length + '</b><span>Workouts</span></div><div class="stat"><b>' + S.streak.count + '</b><span>Phase streak</span></div><div class="stat"><b>' + sessions.reduce(function (a, s) { return a + s.exercises.filter(function (e) { return e.pr; }).length; }, 0) + '</b><span>New bests</span></div></div>';
  var rec = recommended(), last10 = sessions.slice(-10);
  $('#fatigueCard').innerHTML = '<div class="center" style="justify-content:space-between"><h3 style="margin:0">Recovery &amp; balance</h3><span class="badge ' + (rec.score >= 4 ? 'bad' : rec.score >= 2 ? 'mid' : 'ok') + '">Fatigue ' + fatigueLevel().toLowerCase() + '</span></div>' +
    '<p>Recommended today: <b style="color:var(--ink)">' + (rec.value === 'easy' ? 'Easy' : 'Heavy') + '</b> (' + esc(rec.reasons.join(', ')) + ')</p>' +
    '<div class="strip">' + (last10.length ? last10.map(function (s, i) { return '<span class="pill ' + (s.intensity === 'easy' ? 'e' : 'h') + '" style="animation-delay:' + (i * 40) + 'ms">' + (s.intensity === 'easy' ? 'E' : 'H') + '</span>'; }).join('') : '<span class="muted" style="font-size:.84rem">Your last ten sessions will show here.</span>') + '</div>';
  var w = weeklySets();
  $('#volBars').innerHTML = MUSCLES.map(function (k) {
    var v = w[k] || 0; return '<div class="bar-row"><span class="nm">' + k + '</span><div class="bar"><span class="band"></span><i style="width:' + Math.min(100, v / 24 * 100) + '%"></i></div><b>' + (Math.round(v * 2) / 2) + '</b></div>';
  }).join('');
  var best = bestMap(), names = Object.keys(best).sort(function (a, b) { return best[b].date.localeCompare(best[a].date); }).slice(0, 14);
  $('#prList').innerHTML = names.length ? names.map(function (n) { var b = best[n]; return '<div class="li"><div>' + esc(n) + '<small>' + fdate(b.date) + '</small></div><div class="r">' + fmt(b.load) + ' kg' + (b.reps ? ' × ' + b.reps : '') + '</div></div>'; }).join('') : '<div class="empty">Log a load to start your records.</div>';
  $('#phaseList').innerHTML = phaseHist.length ? phaseHist.slice(-8).reverse().map(function (p) { return '<div class="li"><div>Block ' + p.block + ' · ' + esc(p.name) + '<small>' + fdate(p.start) + ' – ' + fdate(p.end) + '</small></div></div>'; }).join('') : '<div class="empty">Completed phases will be listed here.</div>';
  var bt = $('#bodyTrend');
  if (S.features.measure && measures.length) {
    bt.hidden = false;
    var tag = { am: 'morning', day: 'daytime', pm: 'evening' }, L = measures[measures.length - 1], rows = [];
    [['weight', 'Weight', 'kg'], ['waist', 'Waist', 'cm'], ['neck', 'Neck', 'cm'], ['arm', 'Arm', 'cm'], ['chest', 'Chest', 'cm']].forEach(function (m) {
      if (!L[m[0]]) return;
      var prev = null; for (var i = measures.length - 2; i >= 0; i--) if (measures[i].when === L.when && measures[i][m[0]]) { prev = measures[i]; break; }
      var d = prev ? (+L[m[0]] - +prev[m[0]]) : null;
      rows.push('<div class="li"><div>' + m[1] + '<small>' + (prev ? 'vs previous ' + tag[L.when] + ' entry' : 'first ' + tag[L.when] + ' entry') + '</small></div><div class="r">' + fmt(L[m[0]]) + ' ' + m[2] + (d != null ? ' <span class="muted">(' + (d > 0 ? '+' : '') + fmt(d) + ')</span>' : '') + '</div></div>');
    });
    bt.innerHTML = '<h3>Body trend</h3>' + rows.join('');
  } else bt.hidden = true;
}

/* =========================================================
   MORE: switches, measurements, nutrition, backup
   ========================================================= */
function getPath(p) { var parts = p.split('.'); return S[parts[0]][parts[1]]; }
function setPath(p, v) { var parts = p.split('.'); S[parts[0]][parts[1]] = v; saveState(); }
function renderMore() {
  $$('[data-sw]').forEach(function (b) { b.setAttribute('aria-checked', getPath(b.dataset.sw) ? 'true' : 'false'); });
  $('#measureCard').hidden = !S.features.measure; $('#nutriCard').hidden = !S.features.nutrition;
  if (!$('#mDate').value) $('#mDate').value = today();
  $('#nKcal').value = S.nutrition.kcal; $('#nPro').value = S.nutrition.protein;
  var tag = { am: 'Morning, fasted', day: 'Daytime', pm: 'Evening, after eating' };
  $('#mList').innerHTML = measures.length ? measures.slice(-5).reverse().map(function (m) {
    var parts = []; ['weight:kg', 'waist:cm', 'neck:cm', 'arm:cm', 'chest:cm'].forEach(function (x) { var p = x.split(':'); if (m[p[0]]) parts.push(p[0] + ' ' + fmt(m[p[0]]) + ' ' + p[1]); });
    return '<div class="li"><div>' + fdate(m.date) + '<small>' + tag[m.when] + '</small></div><div class="r" style="font-weight:600;font-size:.78rem;max-width:60%;white-space:normal">' + esc(parts.join(' · ')) + '</div></div>';
  }).join('') : '';
  $('#backupLine').textContent = S.lastBackup ? 'Last backup: ' + fdate(S.lastBackup) + (Math.round((new Date(new Date().toDateString()) - new Date(S.lastBackup + 'T00:00:00')) / 86400000) >= 14 ? ' · due for a new one' : '') : 'No backup yet. Export one now.';
}
function bindMore() {
  document.addEventListener('click', function (e) {
    var sw = e.target.closest('[data-sw]'); if (!sw) return;
    var p = sw.dataset.sw, v = !getPath(p); setPath(p, v); sw.setAttribute('aria-checked', v ? 'true' : 'false');
    if (p === 'settings.wake' && !v) lockScreen(false);
    if (p.indexOf('features.') === 0) renderMore();
    if (p === 'settings.alarm') renderTimer();
    vib(8);
  });
  $('#mSave').addEventListener('click', function () {
    var m = { id: uid(), date: $('#mDate').value || today(), when: $('#mWhen').value };
    ['Weight', 'Waist', 'Neck', 'Arm', 'Chest'].forEach(function (k) { var v = num($('#m' + k).value); if (!isNaN(v)) m[k.toLowerCase()] = v; });
    if (!m.weight && !m.waist && !m.neck && !m.arm && !m.chest) { toast('Enter at least one measurement.'); return; }
    measures.push(m); measures.sort(function (a, b) { return a.date.localeCompare(b.date); }); save('measures', measures);
    ['Weight', 'Waist', 'Neck', 'Arm', 'Chest'].forEach(function (k) { $('#m' + k).value = ''; });
    renderMore(); toast('Measurement saved');
  });
  $('#nKcal').addEventListener('input', function () { S.nutrition.kcal = +this.value || 0; saveState(); });
  $('#nPro').addEventListener('input', function () { S.nutrition.protein = +this.value || 0; saveState(); });
  $('#btnExport').addEventListener('click', exportData);
  $('#restoreFile').addEventListener('change', function () { restoreData(this.files[0]); });
  $('#btnReset').addEventListener('click', function () {
    var ok = true; try { ok = confirm('Delete ALL Forge data on this device? Export a backup first if you want to keep it.'); } catch (x) {}
    if (!ok) return;
    store.keys().forEach(function (k) { store.remove(k); }); location.reload();
  });
}
function exportData() {
  flush();
  var data = { app: 'Forge', version: 3, exported: new Date().toISOString(), data: {} };
  store.keys().forEach(function (k) { data.data[k] = store.get(k); });
  var text = JSON.stringify(data, null, 2), done = false;
  try {
    var blob = new Blob([text], { type: 'application/json' }), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'forge-backup-' + today() + '.json'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { try { URL.revokeObjectURL(url); } catch (e) {} }, 1500); done = true;
  } catch (e) {}
  if (!done) { try { prompt('Copy your backup:', text); done = true; } catch (e) {} }
  if (done) { S.lastBackup = today(); saveState(); renderMore(); toast('Backup exported'); }
}
function restoreData(file) {
  if (!file) return;
  var r = new FileReader();
  r.onload = function () {
    try {
      var d = JSON.parse(r.result);
      if (!d || d.app !== 'Forge' || !d.data || typeof d.data !== 'object') throw new Error('bad');
      var ok = true; try { ok = confirm('Restore this backup? It replaces the data currently on this device.'); } catch (x) {}
      if (!ok) return;
      store.keys().forEach(function (k) { store.remove(k); });
      Object.keys(d.data).forEach(function (k) { if (typeof d.data[k] === 'string') store.set(k, d.data[k]); });
      toast('Backup restored'); setTimeout(function () { location.reload(); }, 700);
    } catch (e) { toast('That file is not a valid Forge backup.'); }
  };
  r.readAsText(file);
}

/* =========================================================
   INIT
   ========================================================= */
function bindGlobal() {
  $('#tabbar').addEventListener('click', function (e) { var t = e.target.closest('[data-go]'); if (t) { go(t.dataset.go); vib(8); } });
  $('#tStart').addEventListener('click', timerToggle);
  $('#tReset').addEventListener('click', function () { timerSet(T.secs); });
  $('#tBell').addEventListener('click', function () { S.settings.alarm = !S.settings.alarm; saveState(); renderTimer(); renderMore(); toast(S.settings.alarm ? 'Alarm on' : 'Alarm muted'); });
  $('#tMinus').addEventListener('click', function () { timerAdjust(-15); });
  $('#tPlus').addEventListener('click', function () { timerAdjust(15); });
  $('#tPresets').addEventListener('click', function (e) { var b = e.target.closest('[data-s]'); if (b) { timerSet(+b.dataset.s); vib(8); } });
  $('#restGuide').addEventListener('click', function (e) { var b = e.target.closest('[data-set]'); if (b) { timerSet(+b.dataset.set); toast('Timer set'); } });
  $('#tTest').addEventListener('click', function () { unlockAudio(); burst(); toast('Alarm test'); });
  $('#vol').addEventListener('input', function () { S.settings.volume = +this.value; saveState(); });
  $('#vol').addEventListener('change', function () { unlockAudio(); burst(); });
  $('#alarmDismiss').addEventListener('click', function () { hideAlarm(); timerSet(T.secs); });
  $('#alarmAgain').addEventListener('click', function () { hideAlarm(); timerSet(T.secs); timerStart(); });
  $('#sheet').addEventListener('click', function (e) {
    var b = e.target.closest('[data-sheet]');
    if (b) { closeSheet(); if (b.dataset.sheet === 'history') go('history'); return; }
    if (e.target.id === 'sheet') closeSheet();
  });
}
function registerSW() {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./service-worker.js').catch(function () {});
  }
}

/* =========================================================
   FULL-SCREEN FIT (iOS Home Screen apps size themselves unreliably)
   ========================================================= */
var VERSION = 'v3.2';
function isStandalone() { return navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches); }
function fitApp() {
  var app = $('#app'), probe = $('#probe'); if (!app || !probe) return;
  var cs = getComputedStyle(probe), vh = probe.offsetHeight, ih = window.innerHeight, sa = isStandalone();
  var h = sa ? Math.max(ih, vh) : ih;
  if (!h || h < 300) return;
  [document.documentElement, document.body, app].forEach(function (el) { el.style.setProperty('height', h + 'px', 'important'); });
  var d = $('#diag');
  if (d) d.textContent = VERSION + ' · ' + (sa ? 'Home Screen app' : 'Safari tab') + ' · view ' + window.innerWidth + '×' + ih + ' · screen ' + screen.width + '×' + screen.height + ' · insets ' + Math.round(parseFloat(cs.paddingTop) || 0) + '/' + Math.round(parseFloat(cs.paddingBottom) || 0);
  var hint = $('#installHint'); if (hint) hint.classList.toggle('show', !sa && store.get('hintOff') !== '1');
}
function bindFit() {
  fitApp();
  [60, 250, 800, 1800, 3500].forEach(function (ms) { setTimeout(fitApp, ms); });      // iOS settles late on cold start
  window.addEventListener('resize', fitApp);
  window.addEventListener('orientationchange', function () { setTimeout(fitApp, 120); setTimeout(fitApp, 600); });
  window.addEventListener('pageshow', fitApp);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { fitApp(); setTimeout(fitApp, 300); } });
  document.addEventListener('focusout', function () { setTimeout(function () { window.scrollTo(0, 0); fitApp(); }, 60); });   // keyboard closes: reset iOS scroll offset
  var hc = $('#hintClose'); if (hc) hc.addEventListener('click', function () { store.set('hintOff', '1'); fitApp(); });
}

function init() {
  buildPresets(); renderRestGuide();
  $('#vol').value = S.settings.volume;
  bindGlobal(); bindTrain(); bindHistory(); bindMore(); bindFit();
  renderTimer(); go('timer');
  if (!storageOK) toast('Storage is blocked here. Data will not persist.');
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
window.addEventListener('load', registerSW);
