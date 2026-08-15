/* =========================================================
   Forge — app.js
   Flexible, phase-tracked training companion
   ========================================================= */

/* ---------- Global error safety net ---------- */
window.addEventListener('error', function () {
  try {
    var b = document.getElementById('errBanner');
    if (b) { b.style.display = 'block'; b.textContent = 'A small display glitch occurred, but your saved data is safe. Try reloading the page.'; }
  } catch (e) {}
});

/* ---------- Safe storage layer (works even if localStorage is blocked) ---------- */
var memoryStore = {};
var storageOK = true;
try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); } catch (e) { storageOK = false; }
var store = {
  get: function (k) {
    try { return storageOK ? localStorage.getItem(k) : (Object.prototype.hasOwnProperty.call(memoryStore, k) ? memoryStore[k] : null); }
    catch (e) { return Object.prototype.hasOwnProperty.call(memoryStore, k) ? memoryStore[k] : null; }
  },
  set: function (k, v) {
    try { if (storageOK) { localStorage.setItem(k, v); return; } } catch (e) {}
    memoryStore[k] = v;
  },
  remove: function (k) {
    try { if (storageOK) { localStorage.removeItem(k); return; } } catch (e) {}
    delete memoryStore[k];
  },
  clear: function () {
    try { if (storageOK) localStorage.clear(); } catch (e) {}
    memoryStore = {};
  },
  allKeys: function () {
    var keys = [];
    try { if (storageOK) { for (var i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i)); } } catch (e) {}
    for (var mk in memoryStore) if (keys.indexOf(mk) === -1) keys.push(mk);
    return keys;
  }
};

/* ---------- Workout data model ---------- */
var WORKOUTS = {
  "Upper A": {
    hint: "Chest & back emphasis",
    exercises: [
      { name: "Machine chest press", tier: "essential", type: "main",
        alts: ["Machine chest press", "Smith-machine bench press", "Incline machine press", "Dumbbell press", "Cable press"] },
      { name: "Chest-supported row", tier: "essential", type: "main",
        alts: ["Chest-supported row", "Seated cable row", "Iso-lateral row machine", "Chest-supported dumbbell row"] },
      { name: "Incline machine chest press", tier: "recommended", type: "secondary",
        alts: ["Incline machine press", "Cable incline press", "Pec-deck"] },
      { name: "Neutral-grip lat pulldown", tier: "essential", type: "main",
        alts: ["Neutral-grip lat pulldown", "Wide-grip pulldown", "Assisted pull-up", "Single-arm cable pulldown"] },
      { name: "Machine or cable lateral raise", tier: "recommended", type: "isolation3",
        alts: ["Cable lateral raise", "Machine lateral raise", "Dumbbell lateral raise"] },
      { name: "Cable triceps pressdown", tier: "optional", type: "isolation2",
        alts: ["Triceps pressdown", "Overhead cable extension", "Assisted dip machine"] },
      { name: "Machine preacher or cable curl", tier: "optional", type: "isolation2",
        alts: ["Preacher curl machine", "Cable curl", "Dumbbell curl"] }
    ]
  },
  "Lower A": {
    hint: "Quads, hamstrings & calves",
    exercises: [
      { name: "Leg press", tier: "essential", type: "lower",
        alts: ["Leg press", "Hack squat", "Smith-machine squat", "Belt squat"] },
      { name: "Seated leg curl", tier: "essential", type: "secondary",
        alts: ["Seated leg curl", "Lying leg curl", "Standing leg curl"] },
      { name: "Leg extension", tier: "recommended", type: "isolation3",
        alts: ["Leg extension"] },
      { name: "Hip thrust or glute-drive machine", tier: "recommended", type: "secondary",
        alts: ["Hip-thrust machine", "Glute-drive machine", "Smith-machine hip thrust"] },
      { name: "Calf-raise machine", tier: "recommended", type: "calf",
        alts: ["Seated calf raise", "Standing calf raise"] },
      { name: "Cable crunch or ab machine", tier: "optional", type: "abs",
        alts: ["Cable crunch", "Abdominal machine", "Reverse crunch", "Plank"] }
    ]
  },
  "Upper B": {
    hint: "Shoulders & arms emphasis",
    exercises: [
      { name: "Neutral-grip shoulder-press machine", tier: "essential", type: "main",
        alts: ["Shoulder-press machine", "Smith-machine overhead press", "Dumbbell shoulder press", "Cable press"] },
      { name: "Seated cable or machine row", tier: "essential", type: "main",
        alts: ["Seated cable row", "Chest-supported row", "Iso-lateral row"] },
      { name: "Pec-deck or cable chest fly", tier: "recommended", type: "secondary",
        alts: ["Pec-deck", "Cable fly", "Incline machine press"] },
      { name: "Lat pulldown", tier: "essential", type: "main",
        alts: ["Wide-grip pulldown", "Neutral-grip pulldown", "Assisted pull-up"] },
      { name: "Reverse pec-deck", tier: "recommended", type: "rear",
        alts: ["Reverse pec-deck", "Face pull", "Band pull-apart"] },
      { name: "Machine or cable lateral raise", tier: "recommended", type: "isolation3",
        alts: ["Cable lateral raise", "Machine lateral raise"] },
      { name: "Preacher or machine biceps curl", tier: "optional", type: "isolation2",
        alts: ["Preacher curl machine", "Cable curl", "Dumbbell curl"] },
      { name: "Assisted triceps dip machine", tier: "optional", type: "isolation2",
        alts: ["Assisted dip machine", "Triceps pressdown", "Overhead cable extension"] }
    ]
  },
  "Lower B": {
    hint: "Posterior chain & quads",
    exercises: [
      { name: "Hack squat or horizontal leg press", tier: "essential", type: "lower",
        alts: ["Hack squat", "Horizontal leg press", "Smith-machine squat", "Pendulum squat"] },
      { name: "Lying leg curl", tier: "essential", type: "secondary",
        alts: ["Lying leg curl", "Seated leg curl", "Standing leg curl"] },
      { name: "Glute-drive or hip-abduction machine", tier: "recommended", type: "secondary",
        alts: ["Glute-drive machine", "Hip-abduction machine", "Cable kickback"] },
      { name: "Leg extension", tier: "recommended", type: "isolation3",
        alts: ["Leg extension"] },
      { name: "Calf-raise machine", tier: "recommended", type: "calf",
        alts: ["Seated calf raise", "Standing calf raise"] },
      { name: "Cable lateral raise", tier: "optional", type: "isolation3",
        alts: ["Cable lateral raise", "Machine lateral raise"] },
      { name: "Cable biceps curl", tier: "optional", type: "isolation2",
        alts: ["Cable curl", "Preacher curl machine", "Dumbbell curl"] },
      { name: "Overhead cable triceps extension", tier: "optional", type: "isolation2",
        alts: ["Overhead cable extension", "Triceps pressdown", "Assisted dip machine"] }
    ]
  }
};

var REQUIRED_ORDER = ["Upper A", "Lower A", "Upper B", "Lower B"];
var PHASES = [
  { name: "Adaptation", tag: "Easy", sets: { main: 2, secondary: 2, lower: 2, isolation3: 2, isolation2: 2, rear: 2, calf: 2, abs: 2 }, reps: "10–15", rir: "3–4" },
  { name: "Progression", tag: "Building", sets: { main: 3, secondary: 3, lower: 3, isolation3: 3, isolation2: 2, rear: 3, calf: 3, abs: 3 }, reps: "8–12", rir: "2–3" },
  { name: "Productive", tag: "Heavy", sets: { main: 3, secondary: 3, lower: 3, isolation3: 3, isolation2: 2, rear: 3, calf: 3, abs: 3 }, reps: "6–10 main / 10–15 isolation", rir: "1–2" },
  { name: "Recovery", tag: "Easy", sets: { main: 2, secondary: 2, lower: 2, isolation3: 2, isolation2: 2, rear: 2, calf: 2, abs: 2 }, reps: "10–15, ~10–15% lighter", rir: "3–4" }
];

var DURATION_MODES = ["Express", "Standard", "Complete"];
function tiersAllowedForMode(mode) {
  if (mode === "Express") return ["essential"];
  if (mode === "Standard") return ["essential", "recommended"];
  return ["essential", "recommended", "optional"];
}

var MAX_HISTORY_DOTS = 32;
var STREAK_GAP_LIMIT_DAYS = 10; // allow a little buffer beyond a strict 7-day week

/* ---------- State ---------- */
var state = {
  requiredIndex: parseInt(store.get('requiredIndex') || '0', 10),
  rotationCount: parseInt(store.get('rotationCount') || '0', 10),
  selectedWorkout: store.get('selectedWorkout') || REQUIRED_ORDER[0],
  mode: store.get('mode') || 'Standard',
  intensity: store.get('intensity') || 'heavy'
};

function currentPhase() {
  var idx = state.rotationCount % PHASES.length;
  return PHASES[idx];
}

/* ---------- Workout history (drives phase dots + streak) ---------- */
function getWorkoutHistory() {
  try { return JSON.parse(store.get('workoutHistory') || '[]'); } catch (e) { return []; }
}
function pushWorkoutHistory(entry) {
  var h = getWorkoutHistory();
  h.push(entry);
  store.set('workoutHistory', JSON.stringify(h));
}

/* ---------- Phase history (drives the phase history list) ---------- */
function getPhaseHistory() {
  try { return JSON.parse(store.get('phaseHistory') || '[]'); } catch (e) { return []; }
}
function pushPhaseHistory(entry) {
  var h = getPhaseHistory();
  h.push(entry);
  store.set('phaseHistory', JSON.stringify(h));
}

/* ---------- Streak tracking ---------- */
function getStreakState() {
  try { return JSON.parse(store.get('streakState') || '{"streak":0,"lastRotationDate":null}'); }
  catch (e) { return { streak: 0, lastRotationDate: null }; }
}
function saveStreakState(s) { store.set('streakState', JSON.stringify(s)); }
function daysBetween(a, b) { return Math.round((b - a) / 86400000); }

function onRotationCompleted() {
  var today = new Date(new Date().toDateString());
  var s = getStreakState();
  if (s.lastRotationDate) {
    var last = new Date(s.lastRotationDate + 'T00:00:00');
    var gap = daysBetween(last, today);
    if (gap <= STREAK_GAP_LIMIT_DAYS) s.streak = (s.streak || 0) + 1;
    else s.streak = 1;
  } else {
    s.streak = 1;
  }
  s.lastRotationDate = today.toISOString().slice(0, 10);
  saveStreakState(s);
}

/* ---------- Personal records ---------- */
function getPRs() {
  try { return JSON.parse(store.get('prRecords') || '{}'); } catch (e) { return {}; }
}
function savePRs(prs) { store.set('prRecords', JSON.stringify(prs)); }
function firstNumber(str) {
  if (!str) return null;
  var m = String(str).match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
}
/* Returns true if this load/reps combination is a new PR for this exercise name */
function checkAndRecordPR(exerciseName, loadStr, repsStr) {
  var load = firstNumber(loadStr);
  var reps = firstNumber(repsStr);
  if (load === null) return false;
  var prs = getPRs();
  var existing = prs[exerciseName];
  var isPR = false;
  if (!existing) {
    isPR = true;
  } else if (load > existing.load) {
    isPR = true;
  } else if (load === existing.load && reps !== null && existing.reps !== null && reps > existing.reps) {
    isPR = true;
  }
  if (isPR) {
    prs[exerciseName] = { load: load, reps: reps, date: new Date().toISOString().slice(0, 10) };
    savePRs(prs);
  }
  return isPR;
}
function renderPRList() {
  var el = document.getElementById('prList');
  var countEl = document.getElementById('prCountNum');
  if (!el) return;
  var prs = getPRs();
  var names = Object.keys(prs);
  if (countEl) countEl.textContent = String(names.length);
  if (!names.length) {
    el.innerHTML = '<p style="color:var(--sub);font-size:.85rem">Log a load and rep count on any exercise to start tracking records.</p>';
    return;
  }
  names.sort(function (a, b) { return prs[b].date.localeCompare(prs[a].date); });
  el.innerHTML = names.map(function (name) {
    var p = prs[name];
    return '<div class="pr-item"><div><b>' + name + '</b><div class="ex-note">' + p.date + '</div></div>' +
      '<span>' + p.load + (p.reps ? ' × ' + p.reps : '') + '</span></div>';
  }).join('');
}

/* ---------- Phase tracker rendering ---------- */
function renderPhaseTracker() {
  var headline = document.getElementById('phaseHeadline');
  var sub = document.getElementById('phaseSub');
  var ringNum = document.getElementById('phaseRingNum');
  var ringLabel = document.getElementById('phaseRingLabel');
  var ringFg = document.getElementById('phaseRingFg');
  var dotsWrap = document.getElementById('phaseDots');
  var streakNum = document.getElementById('streakNum');
  var totalWorkoutsNum = document.getElementById('totalWorkoutsNum');
  var summaryStreak = document.getElementById('summaryStreak');
  if (!headline || !ringFg) return;

  var phase = currentPhase();
  var completedInPhase = state.requiredIndex; // 0..3 workouts done in current rotation
  var total = REQUIRED_ORDER.length;
  var circumference = 2 * Math.PI * 42;
  var progress = completedInPhase / total;
  var offset = circumference * (1 - progress);

  ringFg.setAttribute('stroke-dasharray', String(circumference));
  ringFg.setAttribute('stroke-dashoffset', String(offset));
  if (ringNum) ringNum.textContent = completedInPhase + '/' + total;
  if (ringLabel) ringLabel.textContent = 'workouts';

  var blockNum = Math.floor(state.rotationCount / PHASES.length) + 1;
  headline.textContent = 'Block ' + blockNum + ' · ' + phase.name;
  if (sub) sub.textContent = phase.tag + ' · ' + (phase.sets.main) + ' sets on main lifts · RIR ' + phase.rir;

  var history = getWorkoutHistory();
  var recent = history.slice(-MAX_HISTORY_DOTS);
  var filledCount = recent.length;
  var totalDots = MAX_HISTORY_DOTS;
  if (dotsWrap) {
    var html = '';
    var emptyCount = totalDots - filledCount;
    for (var i = 0; i < emptyCount; i++) html += '<div class="phase-dot"></div>';
    recent.forEach(function () { html += '<div class="phase-dot filled"></div>'; });
    dotsWrap.innerHTML = html;
  }

  var streakState = getStreakState();
  var streakVal = streakState.streak || 0;
  if (streakNum) streakNum.textContent = String(streakVal);
  if (summaryStreak) summaryStreak.textContent = String(streakVal);
  if (totalWorkoutsNum) totalWorkoutsNum.textContent = String(history.length);
}

function renderPhaseHistoryList() {
  var el = document.getElementById('phaseHistoryList');
  if (!el) return;
  var history = getPhaseHistory();
  if (!history.length) {
    el.innerHTML = '<p style="color:var(--sub);font-size:.85rem">No phases completed yet.</p>';
    return;
  }
  el.innerHTML = history.slice(-8).reverse().map(function (p) {
    return '<div class="pr-item"><div><b>Phase ' + p.phaseNumber + ' · ' + p.phaseName + '</b><div class="ex-note">' + p.startDate + ' – ' + p.endDate + '</div></div></div>';
  }).join('');
}

/* ---------- Readiness engine (segmented controls) ---------- */
function initSegmentedControls() {
  var groups = document.querySelectorAll('.segmented');
  groups.forEach(function (group) {
    var buttons = group.querySelectorAll('.seg-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        group.setAttribute('data-value', btn.getAttribute('data-val'));
        persistReadinessFromDOM();
        renderRecommendation();
      });
    });
  });
}
function readSegmentedValue(fieldName) {
  var group = document.querySelector('.segmented[data-field="' + fieldName + '"]');
  return group ? group.getAttribute('data-value') : null;
}
function setSegmentedValue(fieldName, value) {
  var group = document.querySelector('.segmented[data-field="' + fieldName + '"]');
  if (!group) return;
  group.setAttribute('data-value', value);
  var buttons = group.querySelectorAll('.seg-btn');
  buttons.forEach(function (b) {
    if (b.getAttribute('data-val') === String(value)) b.classList.add('active');
    else b.classList.remove('active');
  });
}
function persistReadinessFromDOM() {
  var r = {
    date: new Date().toISOString().slice(0, 10),
    energy: readSegmentedValue('rEnergy'),
    soreness: readSegmentedValue('rSoreness'),
    sleep: readSegmentedValue('rSleep'),
    motivation: readSegmentedValue('rMotivation')
  };
  store.set('readinessToday', JSON.stringify(r));
  return r;
}
function getReadiness() {
  try { return JSON.parse(store.get('readinessToday') || '{}'); } catch (e) { return {}; }
}
function restoreReadinessToDOM() {
  var r = getReadiness();
  if (!r || !r.date) return;
  if (r.energy) setSegmentedValue('rEnergy', r.energy);
  if (r.soreness) setSegmentedValue('rSoreness', r.soreness);
  if (r.sleep) setSegmentedValue('rSleep', r.sleep);
  if (r.motivation) setSegmentedValue('rMotivation', r.motivation);
}
function computeRecommendation() {
  var r = getReadiness();
  var score = 0;
  var energy = parseInt(r.energy || '4', 10);
  var soreness = parseInt(r.soreness || '2', 10);
  var motivation = parseInt(r.motivation || '4', 10);

  if (energy <= 2) score += 2;
  if (soreness >= 4) score += 2;
  if (motivation <= 2) score += 1;

  if (score >= 4) return { level: 'red', label: 'Take it easy', text: 'Consider Express mode, lighter loads, or an active recovery day instead.' };
  if (score >= 2) return { level: 'amber', label: 'Moderate', text: 'Standard mode with one fewer set is a good balance today.' };
  return { level: 'green', label: 'Good to go', text: 'Train as planned for the current phase.' };
}
function renderRecommendation() {
  var out = document.getElementById('recommendOut');
  if (!out) return;
  var rec = computeRecommendation();
  out.innerHTML = '<div class="recommend-pill ' + rec.level + '"><span class="dot"></span>' + rec.label + ' — ' + rec.text + '</div>';
}


/* ---------- Permanent training intelligence ---------- */
function getSelectedIntensity(){ return state.intensity === 'easy' ? 'easy' : 'heavy'; }
function recentSessions(){ return getWorkoutHistory().slice(-8); }
function getLastPerformance(workout, idx){
  try{return JSON.parse(store.get('history-'+workout+'-'+idx)||'[]');}catch(e){return [];}
}
function savePerformanceSnapshot(workout, idx){
  var d=WORKOUTS[workout].exercises[idx];
  var load=store.get(exKey(workout,idx,'load'))||'';
  var reps=store.get(exKey(workout,idx,'reps'))||'';
  var rir=store.get(exKey(workout,idx,'rir'))||'';
  if(!load && !reps)return;
  var h=getLastPerformance(workout,idx);
  h.push({date:new Date().toISOString().slice(0,10),variation:store.get(exKey(workout,idx,'alt'))||d.alts[0],load:load,reps:reps,rir:rir,intensity:getSelectedIntensity()});
  store.set('history-'+workout+'-'+idx,JSON.stringify(h.slice(-30)));
}
function readinessScore(){
  var r=getReadiness(),score=0;
  if(parseInt(r.energy||'4',10)<=2)score+=2;
  if(parseInt(r.soreness||'2',10)>=4)score+=2;
  if(parseInt(r.sleep||'4',10)<=2)score+=2;
  if(parseInt(r.motivation||'4',10)<=2)score+=1;
  var recent=recentSessions();
  var heavy=recent.filter(function(s){return s.intensity==='heavy';}).length;
  if(heavy>=6)score+=2;
  return score;
}
function recommendedIntensity(){ return readinessScore()>=3?'easy':'heavy'; }
function updateIntensityUI(){
  document.querySelectorAll('[data-intensity]').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-intensity')===getSelectedIntensity());});
  var rec=recommendedIntensity(),score=readinessScore();
  var title=document.getElementById('modeRecommendationTitle'), why=document.getElementById('modeRecommendationWhy');
  if(title)title.textContent=rec==='easy'?'Easy mode recommended':'Heavy mode recommended';
  if(why)why.textContent=rec==='easy'?'Recovery signals or recent heavy-session balance suggest reducing fatigue today.':'Recovery looks good and recent workload is balanced.';
  var orb=document.getElementById('fatigueOrb'),fs=document.getElementById('fatigueScore');
  if(orb){orb.className='status-orb '+(score>=4?'high':score>=2?'moderate':'good');}
  if(fs)fs.textContent=score>=4?'High':score>=2?'Moderate':'Low';
  var rm=document.getElementById('recoveryStatus');if(rm)rm.textContent=score>=4?'Limited':score>=2?'Manage':'Good';
  var sm=document.getElementById('sessionModeLabel'),sp=document.getElementById('sessionPrescription');
  if(sm)sm.textContent=getSelectedIntensity()==='easy'?'Easy session':'Heavy session';
  if(sp)sp.textContent=getSelectedIntensity()==='easy'?'2 sets · 10–15 reps · RIR 3–4':'3 main sets · 6–12 reps · RIR 1–2';
}
function initIntensitySwitch(){
  document.querySelectorAll('[data-intensity]').forEach(function(b){b.addEventListener('click',function(){state.intensity=b.getAttribute('data-intensity');store.set('intensity',state.intensity);updateIntensityUI();renderWorkout();renderIntelligence();});});
}
function intensityPrescription(type){
  if(getSelectedIntensity()==='easy'){
    var iso=['isolation3','isolation2','rear','calf','abs'].indexOf(type)>=0;
    return '2 × '+(iso?'12–20':'10–15')+' · RIR 3–4';
  }
  var sets=['isolation2','abs'].indexOf(type)>=0?2:3;
  var reps=['main'].indexOf(type)>=0?'6–10':['isolation3','isolation2','rear','calf','abs'].indexOf(type)>=0?'10–15':'8–12';
  return sets+' × '+reps+' · RIR 1–2';
}
function smartSuggestion(workout,idx){
  var h=getLastPerformance(workout,idx);if(!h.length)return {last:'No previous performance',suggest:'Start conservative and establish clean-form baseline.'};
  var p=h[h.length-1],load=parseFloat(p.load),reps=firstNumber(p.reps);
  var last=(p.load||'—')+' kg · '+(p.reps||'—')+' reps · RIR '+(p.rir||'—');
  if(getSelectedIntensity()==='easy' && !isNaN(load))return {last:last,suggest:'Suggested recovery load: '+Math.round(load*.875*2)/2+' kg.'};
  if(!isNaN(load)&&reps>=10)return {last:last,suggest:'Top range reached: consider the smallest load increase.'};
  return {last:last,suggest:'Repeat the load and beat total clean reps by 1.'};
}
function exerciseGuide(type){
  var map={main:'Set the machine to a stable, pain-free position. Control the lowering phase and stop before technique changes.',lower:'Keep the pelvis supported and use a controlled depth. Drive through the full foot without locking aggressively.',secondary:'Use a smooth full range, stable torso and no momentum.',isolation3:'Keep the target joint controlled. Prioritize tension over load.',isolation2:'Keep upper arms stable and avoid swinging.',rear:'Lead with the elbows and keep shoulders away from the ears.',calf:'Pause in the stretch and at the top.',abs:'Move through the trunk with controlled breathing.'};
  return map[type]||map.secondary;
}
function renderIntelligence(){
  var recent=recentSessions(),h=recent.filter(function(s){return s.intensity==='heavy';}).length,e=recent.filter(function(s){return s.intensity==='easy';}).length;
  var bal=document.getElementById('heavyEasyBalance');if(bal)bal.textContent=h+'H · '+e+'E';
  var cal=document.getElementById('sessionCalendar');if(cal)cal.innerHTML=recent.map(function(s){return '<span class="session-mark '+(s.intensity||'heavy')+'">'+((s.intensity||'heavy')==='heavy'?'H':'E')+'</span>';}).join('');
  var note=document.getElementById('sessionBalanceNote');if(note)note.textContent=recent.length?('Last '+recent.length+' completed sessions.'): 'No sessions logged yet.';
  var score=readinessScore(),signals=[];
  if(h>=6)signals.push('<div class="signal warn">Many recent heavy sessions. An easy session is recommended.</div>');
  if(score>=3)signals.push('<div class="signal warn">Readiness signals indicate accumulating fatigue.</div>');
  if(!signals.length)signals.push('<div class="signal good">No meaningful fatigue warning signs detected.</div>');
  var fs=document.getElementById('fatigueSignals');if(fs)fs.innerHTML=signals.join('');
  var trend=document.getElementById('performanceTrend');if(trend)trend.textContent=getPRs()&&Object.keys(getPRs()).length?'Improving':'Stable';
  var last=recent.length?recent[recent.length-1]:null,lws=document.getElementById('lastWorkoutSummary');
  if(lws)lws.innerHTML=last?('<p><b>'+last.workout+'</b><br>'+last.intensity+' · '+last.date+'</p>'):'<p>No completed workouts yet.</p>';
  var backup=store.get('lastBackupDate'),lb=document.getElementById('lastBackupLabel'),br=document.getElementById('backupReminder');
  if(lb)lb.textContent=backup||'Never';
  if(br)br.textContent=!backup?'Backup recommended':(daysBetween(new Date(backup+'T00:00:00'),new Date())>=14?'Backup due':'');
  renderVolume();
}
function renderVolume(){
  var map={chest:0,back:0,shoulders:0,arms:0,quads:0,hamstrings:0,glutes:0,calves:0,core:0};
  var wk=state.selectedWorkout.toLowerCase();
  WORKOUTS[state.selectedWorkout].exercises.forEach(function(ex){
    var sets=parseInt(intensityPrescription(ex.type),10)||2,n=ex.name.toLowerCase();
    if(n.includes('press')||n.includes('fly')||n.includes('pec'))map.chest+=sets;
    if(n.includes('row')||n.includes('pulldown')||n.includes('pull-up'))map.back+=sets;
    if(n.includes('lateral')||n.includes('shoulder')||n.includes('reverse')||n.includes('face'))map.shoulders+=sets;
    if(n.includes('curl')||n.includes('triceps')||n.includes('dip'))map.arms+=sets;
    if(n.includes('leg press')||n.includes('squat')||n.includes('extension'))map.quads+=sets;
    if(n.includes('leg curl'))map.hamstrings+=sets;
    if(n.includes('hip')||n.includes('glute'))map.glutes+=sets;
    if(n.includes('calf'))map.calves+=sets;
    if(n.includes('ab')||n.includes('crunch'))map.core+=sets;
  });
  var el=document.getElementById('volumeByMuscle');if(!el)return;
  el.innerHTML=Object.keys(map).filter(function(k){return map[k]>0;}).map(function(k){return '<div class="volume-row"><span>'+k+'</span><div class="volume-track"><div class="volume-fill" style="width:'+Math.min(100,map[k]*10)+'%"></div></div><b>'+map[k]+'</b></div>';}).join('');
  var vg=document.getElementById('volumeGuardrail');if(vg)vg.textContent=Object.values(map).some(function(v){return v>16;})?'Review':'Balanced';
}

/* =========================================================
   Stable picker rendering — built once, then only updated.
   ========================================================= */
var workoutChipEls = {};
var modeTabEls = {};

function buildWorkoutPickerOnce() {
  var wrap = document.getElementById('workoutPicker');
  if (!wrap || wrap.dataset.built === '1') return;
  REQUIRED_ORDER.forEach(function (name) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'wk-chip';
    b.textContent = name;
    b.addEventListener('click', function () {
      state.selectedWorkout = name;
      store.set('selectedWorkout', name);
      updateWorkoutPickerUI();
      renderHeader();
      renderWorkout();
    });
    wrap.appendChild(b);
    workoutChipEls[name] = b;
  });
  wrap.dataset.built = '1';
}
function updateWorkoutPickerUI() {
  REQUIRED_ORDER.forEach(function (name) {
    var b = workoutChipEls[name];
    if (!b) return;
    var isNextRequired = (name === REQUIRED_ORDER[state.requiredIndex]);
    b.textContent = name + (isNextRequired ? ' •' : '');
    if (name === state.selectedWorkout) b.classList.add('active'); else b.classList.remove('active');
  });
}

function buildModeTabsOnce() {
  var wrap = document.getElementById('modeTabs');
  if (!wrap || wrap.dataset.built === '1') return;
  DURATION_MODES.forEach(function (m) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'mode-tab';
    b.textContent = m;
    b.addEventListener('click', function () {
      state.mode = m;
      store.set('mode', m);
      updateModeTabsUI();
      renderWorkout();
    });
    wrap.appendChild(b);
    modeTabEls[m] = b;
  });
  wrap.dataset.built = '1';
}
function updateModeTabsUI() {
  DURATION_MODES.forEach(function (m) {
    var b = modeTabEls[m];
    if (!b) return;
    if (m === state.mode) b.classList.add('active'); else b.classList.remove('active');
  });
}

function renderHeader() {
  var phase = currentPhase();
  var label = document.getElementById('phaseLabel');
  var name = document.getElementById('nextWorkoutName');
  var hint = document.getElementById('nextWorkoutHint');
  var nextRequired = REQUIRED_ORDER[state.requiredIndex];
  if (label) label.textContent = 'Block ' + (Math.floor(state.rotationCount / PHASES.length) + 1) + ' · ' + phase.name;
  if (name) name.textContent = state.selectedWorkout;
  if (hint) hint.textContent = WORKOUTS[state.selectedWorkout].hint + (state.selectedWorkout === nextRequired ? ' · next required' : '');
}

/* ---------- Prescription ---------- */
function prescriptionFor(type) { return intensityPrescription(type); }

/* ---------- Exercise store keys ---------- */
function exKey(workout, idx, suffix) { return 'ex-' + workout + '-' + idx + '-' + suffix; }

function renderWorkout() {
  var panel = document.getElementById('workoutPanel');
  if (!panel) return;
  var workoutName = state.selectedWorkout;
  var data = WORKOUTS[workoutName];
  var allowedTiers = tiersAllowedForMode(state.mode);
  var visible = data.exercises.filter(function (e) { return allowedTiers.indexOf(e.tier) !== -1; });

  var doneCount = visible.filter(function (e) {
    var realIdx = data.exercises.indexOf(e);
    return store.get(exKey(workoutName, realIdx, 'done')) === '1';
  }).length;
  var pct = visible.length ? Math.round((doneCount / visible.length) * 100) : 0;
  var ring = document.getElementById('ringToday');
  var ringPct = document.getElementById('ringPct');
  if (ring) ring.style.background = 'conic-gradient(var(--accent) ' + (pct * 3.6) + 'deg, #e9ebee 0)';
  if (ringPct) ringPct.textContent = pct + '%';

  var prs = getPRs();
  var html = '';
  visible.forEach(function (e) {
    var idx = data.exercises.indexOf(e);
    var done = store.get(exKey(workoutName, idx, 'done')) === '1';
    var load = store.get(exKey(workoutName, idx, 'load')) || '';
    var reps = store.get(exKey(workoutName, idx, 'reps')) || '';
    var rir = store.get(exKey(workoutName, idx, 'rir')) || '';
    var chosenAlt = store.get(exKey(workoutName, idx, 'alt'));
    var altIndex = chosenAlt ? e.alts.indexOf(chosenAlt) : 0;
    if (altIndex < 0) altIndex = 0;
    var altOptions = e.alts.map(function (a, ai) {
      return '<option value="' + ai + '"' + (ai === altIndex ? ' selected' : '') + '>' + a + '</option>';
    }).join('');
    var isPR = !!prs[e.name];
    html += '<div class="exercise">' +
      '<div class="ex-top">' +
        '<input aria-label="Complete ' + e.name + '" class="check" type="checkbox" ' + (done ? 'checked' : '') + ' onchange="saveExercise(\'' + workoutName + '\',' + idx + ',\'done\',this.checked?\'1\':\'0\')">' +
        '<div><div class="ex-name">' + e.name + '</div><span class="badge ' + e.tier + '">' + e.tier + '</span>' + (isPR ? '<span class="badge pr">PR</span>' : '') + '</div>' +
        '<div class="prescription">' + prescriptionFor(e.type) + '</div>' +
      '</div>' +
      '<div class="alt-row"><label style="font-size:.75rem;color:var(--sub)">Variation:</label><select onchange="saveExercise(\'' + workoutName + '\',' + idx + ',\'alt\',this.options[this.selectedIndex].text)">' + altOptions + '</select></div>' +
      '<div class="previous-line">Last: ' + smartSuggestion(workoutName,idx).last + '</div>' +
      '<div class="suggest-line">' + smartSuggestion(workoutName,idx).suggest + '</div>' +
      '<div class="exercise-guide"><button type="button" class="guide-toggle" data-guide="'+workoutName+'-'+idx+'">Technique guide</button><div class="guide-body" id="guide-'+workoutName+'-'+idx+'">'+exerciseGuide(e.type)+'</div></div>' +
      '<div class="log-row">' +
        '<label>Load<input inputmode="decimal" placeholder="kg" value="' + load + '" oninput="saveExercise(\'' + workoutName + '\',' + idx + ',\'load\',this.value)"></label>' +
        '<label>Reps<input inputmode="numeric" placeholder="e.g. 10/9/8" value="' + reps + '" oninput="saveExercise(\'' + workoutName + '\',' + idx + ',\'reps\',this.value)"></label>' +
        '<label>RIR<input inputmode="numeric" placeholder="RIR" value="' + rir + '" oninput="saveExercise(\'' + workoutName + '\',' + idx + ',\'rir\',this.value)"></label>' +
      '</div>' +
    '</div>';
  });
  html += '<div class="actions"><button type="button" class="primary" id="btnCompleteWorkout">Complete workout</button><button type="button" class="secondary" id="btnClearChecks">Clear checks</button></div>';
  panel.innerHTML = html;
  panel.querySelectorAll('.guide-toggle').forEach(function(b){b.addEventListener('click',function(){var g=document.getElementById('guide-'+b.getAttribute('data-guide'));if(g)g.classList.toggle('open');});});

  var completeBtn = document.getElementById('btnCompleteWorkout');
  var clearBtn = document.getElementById('btnClearChecks');
  if (completeBtn) completeBtn.addEventListener('click', completeWorkout);
  if (clearBtn) clearBtn.addEventListener('click', uncheckWorkout);
}

function saveExercise(workout, idx, key, value) {
  store.set(exKey(workout, idx, key), value);
  if (key === 'done') renderWorkout();
  if (key === 'load' || key === 'reps') {
    var data = WORKOUTS[workout];
    var e = data.exercises[idx];
    var load = store.get(exKey(workout, idx, 'load'));
    var reps = store.get(exKey(workout, idx, 'reps'));
    if (load) {
      var wasPR = checkAndRecordPR(e.name, load, reps);
      if (wasPR) {
        renderWorkout();
        renderPRList();
        renderPhaseTracker();
        var s = document.getElementById('saveStatus'); if (s) s.textContent = 'New personal record on ' + e.name + '!';
      }
    }
  }
}

function visibleIndices(workoutName) {
  var data = WORKOUTS[workoutName];
  var allowedTiers = tiersAllowedForMode(state.mode);
  var indices = [];
  data.exercises.forEach(function (e, i) { if (allowedTiers.indexOf(e.tier) !== -1) indices.push(i); });
  return indices;
}

function completeWorkout() {
  var workoutName = state.selectedWorkout;
  visibleIndices(workoutName).forEach(function (i) { store.set(exKey(workoutName, i, 'done'), '1'); savePerformanceSnapshot(workoutName,i); });

  pushWorkoutHistory({ date: new Date().toISOString().slice(0, 10), workout: workoutName, phaseIndex: state.rotationCount % PHASES.length, block: Math.floor(state.rotationCount/PHASES.length)+1, intensity:getSelectedIntensity() });

  if (workoutName === REQUIRED_ORDER[state.requiredIndex]) {
    var phaseBeforeAdvance = currentPhase();
    var phaseNumberBeforeAdvance = (state.rotationCount % PHASES.length) + 1;

    if (state.requiredIndex === 0) {
      // starting a fresh rotation right now, remember start date for phase-history purposes
      if (!store.get('currentPhaseStartDate')) {
        store.set('currentPhaseStartDate', new Date().toISOString().slice(0, 10));
      }
    }

    state.requiredIndex = (state.requiredIndex + 1) % REQUIRED_ORDER.length;
    store.set('requiredIndex', String(state.requiredIndex));

    if (state.requiredIndex === 0) {
      // full rotation just completed -> phase complete
      var startDate = store.get('currentPhaseStartDate') || new Date().toISOString().slice(0, 10);
      var endDate = new Date().toISOString().slice(0, 10);
      pushPhaseHistory({ phaseNumber: phaseNumberBeforeAdvance, phaseName: phaseBeforeAdvance.name, startDate: startDate, endDate: endDate });
      store.remove('currentPhaseStartDate');

      state.rotationCount = state.rotationCount + 1;
      store.set('rotationCount', String(state.rotationCount));

      onRotationCompleted();
    }
    state.selectedWorkout = REQUIRED_ORDER[state.requiredIndex];
    store.set('selectedWorkout', state.selectedWorkout);
  }
  var s = document.getElementById('saveStatus'); if (s) s.textContent = 'Workout completed and stored on this device.';
  updateWorkoutPickerUI();
  renderHeader();
  renderWorkout();
  renderPhaseTracker();
  renderPhaseHistoryList();
  renderIntelligence();
  updateIntensityUI();
}
function uncheckWorkout() {
  var workoutName = state.selectedWorkout;
  visibleIndices(workoutName).forEach(function (i) { store.remove(exKey(workoutName, i, 'done')); });
  renderWorkout();
}

/* ---------- Rest timer (absolute end-time based, resilient to backgrounding) ---------- */
var timerSeconds = 90, timerLeft = 90, timerId = null, timerEnd = 0;
function formatTime(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.max(0, s % 60)).padStart(2, '0'); }
function setTimer(s) {
  clearInterval(timerId); timerId = null; timerSeconds = s; timerLeft = s; timerEnd = 0;
  var b = document.getElementById('timerToggle'); if (b) b.textContent = 'Start';
  updateTimer();
}
function updateTimer() { var d = document.getElementById('timerDisplay'); if (d) d.textContent = formatTime(timerLeft); }
function timerTick() {
  timerLeft = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
  updateTimer();
  if (timerLeft <= 0) {
    clearInterval(timerId); timerId = null; timerEnd = 0;
    var b = document.getElementById('timerToggle'); if (b) b.textContent = 'Restart';
    try { if (navigator.vibrate) navigator.vibrate([150, 100, 150]); } catch (e) {}
  }
}
function toggleTimer() {
  var b = document.getElementById('timerToggle');
  if (timerId) {
    clearInterval(timerId); timerId = null;
    timerLeft = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
    timerEnd = 0;
    if (b) b.textContent = 'Resume';
    updateTimer();
  } else {
    if (timerLeft <= 0) timerLeft = timerSeconds;
    timerEnd = Date.now() + timerLeft * 1000;
    timerId = setInterval(timerTick, 250);
    if (b) b.textContent = 'Pause';
    timerTick();
  }
}
function resetTimer() { setTimer(timerSeconds); }
document.addEventListener('visibilitychange', function () { if (!document.hidden && timerId) timerTick(); });

/* ---------- Weekly check-in ---------- */
function saveCheckin() {
  var arr;
  try { arr = JSON.parse(store.get('checkins') || '[]'); } catch (e) { arr = []; }
  arr.push({
    date: val('pDate'), weight: val('pWeight'), waist: val('pWaist'),
    steps: val('pSteps'), sleep: val('pSleep'), energy: val('pEnergy'), training: val('pTraining'), notes: val('pNotes')
  });
  store.set('checkins', JSON.stringify(arr));
  var s = document.getElementById('saveStatus'); if (s) s.textContent = 'Check-in saved locally.';
  renderHistory();
}
function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }
function renderHistory() {
  var arr; try { arr = JSON.parse(store.get('checkins') || '[]'); } catch (e) { arr = []; }
  var el = document.getElementById('history');
  if (!el) return;
  if (!arr.length) { el.innerHTML = ''; return; }
  el.innerHTML = '<h3 style="margin-top:18px">Recent check-ins</h3>' + arr.slice(-5).reverse().map(function (x) {
    return '<div class="exercise"><b>' + (x.date || 'Undated') + ' · ' + (x.weight || '–') + ' kg</b>' +
      '<div class="ex-note">Waist ' + (x.waist || '–') + ' cm · Steps ' + (x.steps || '–') +
      ' · Sleep ' + (x.sleep || '–') + ' h · Energy ' + x.energy + '/5 · Training ' + x.training + '/5' +
      (x.notes ? '<br>' + x.notes : '') + '</div></div>';
  }).join('');
}

/* ---------- Export / Restore ---------- */
function collectAllStoredData() {
  var all = {};
  store.allKeys().forEach(function (k) { all[k] = store.get(k); });
  return all;
}
function exportData() {
  var data = { exported: new Date().toISOString(), app: 'Forge', storage: collectAllStoredData() };
  var text = JSON.stringify(data, null, 2);
  var done = false;
  try {
    var blob = new Blob([text], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'forge-backup.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { try { URL.revokeObjectURL(url); } catch (e) {} }, 1000);
    done = true;
  } catch (e) {}
  if (!done) {
    try { var w = window.open('', '_blank'); if (w) { w.document.write('<pre style="white-space:pre-wrap;word-break:break-word;font-family:monospace;padding:16px;">' + text.replace(/</g, '&lt;') + '</pre>'); done = true; } } catch (e) {}
  }
  if (!done) { try { prompt('Copy your saved data below:', text); done = true; } catch (e) {} }
  var s = document.getElementById('saveStatus');
  if(done){store.set('lastBackupDate',new Date().toISOString().slice(0,10));renderIntelligence();}
  if (s) s.textContent = done ? 'Backup exported.' : 'Export is not available in this viewer. Try opening the file directly in Safari.';
}
function restoreData(file) {
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function () {
    try {
      var data = JSON.parse(reader.result);
      var storage = data.storage || data;
      Object.keys(storage).forEach(function (k) { store.set(k, storage[k]); });
      var s = document.getElementById('saveStatus'); if (s) s.textContent = 'Backup restored. Reloading…';
      setTimeout(function () { location.reload(); }, 900);
    } catch (e) {
      var s2 = document.getElementById('saveStatus'); if (s2) s2.textContent = 'That file could not be read as a valid backup.';
    }
  };
  reader.readAsText(file);
}
function clearData() {
  var ok = true;
  try { ok = confirm('Delete all workout logs, records and check-ins stored in this browser?'); } catch (e) { ok = true; }
  if (ok) {
    store.clear();
    state.requiredIndex = 0; state.rotationCount = 0; state.selectedWorkout = REQUIRED_ORDER[0]; state.mode = 'Standard'; state.intensity='heavy';
    try { updateWorkoutPickerUI(); updateModeTabsUI(); renderAll(); } catch (e) {}
    try { renderHistory(); } catch (e) {}
    var s = document.getElementById('saveStatus'); if (s) s.textContent = 'All local data was cleared.';
  }
}

/* ---------- Wire up static (non-regenerated) buttons once ---------- */
function wireStaticControls() {
  var byId = document.getElementById.bind(document);

  var timerToggleBtn = byId('timerToggle'); if (timerToggleBtn) timerToggleBtn.addEventListener('click', toggleTimer);
  var timerResetBtn = byId('timerReset'); if (timerResetBtn) timerResetBtn.addEventListener('click', resetTimer);
  document.querySelectorAll('[data-secs]').forEach(function (b) {
    b.addEventListener('click', function () { setTimer(parseInt(b.getAttribute('data-secs'), 10)); });
  });

  var saveCheckinBtn = byId('btnSaveCheckin'); if (saveCheckinBtn) saveCheckinBtn.addEventListener('click', saveCheckin);
  var exportBtn = byId('btnExport'); if (exportBtn) exportBtn.addEventListener('click', exportData);
  var clearBtn = byId('btnClearData'); if (clearBtn) clearBtn.addEventListener('click', clearData);

  var restoreInput = byId('restoreFile');
  if (restoreInput) restoreInput.addEventListener('change', function () { restoreData(this.files[0]); });
}

/* ---------- Init ---------- */
function renderAll() {
  renderPhaseTracker();
  renderPhaseHistoryList();
  renderRecommendation();
  updateWorkoutPickerUI();
  updateModeTabsUI();
  renderHeader();
  renderWorkout();
  renderPRList();
  updateIntensityUI();
  renderIntelligence();
}
function registerOfflineApp() {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./service-worker.js').then(function () {
      var s = document.getElementById('saveStatus'); if (s && !s.textContent) s.textContent = 'Offline mode is ready.';
    }).catch(function (e) { console.warn('Offline registration unavailable', e); });
  }
}
function safeInit() {
  try { var d = document.getElementById('pDate'); if (d) { try { d.valueAsDate = new Date(); } catch (e) { d.value = new Date().toISOString().slice(0, 10); } } } catch (e) {}
  try { buildWorkoutPickerOnce(); } catch (e) { console.error('buildWorkoutPickerOnce failed', e); }
  try { buildModeTabsOnce(); } catch (e) { console.error('buildModeTabsOnce failed', e); }
  try { initSegmentedControls(); initIntensitySwitch(); } catch (e) { console.error('initSegmentedControls failed', e); }
  try { restoreReadinessToDOM(); } catch (e) { console.error('restoreReadinessToDOM failed', e); }
  try { wireStaticControls(); } catch (e) { console.error('wireStaticControls failed', e); }
  try { renderAll(); } catch (e) { console.error('renderAll failed', e); }
  try { renderHistory(); } catch (e) { console.error('renderHistory failed', e); }
  try { updateTimer(); } catch (e) { console.error('updateTimer failed', e); }
  if (!storageOK) {
    var s = document.getElementById('saveStatus');
    if (s) s.textContent = 'Note: this browser is blocking local storage, so entries will only be kept for this session.';
  }
}
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', safeInit); } else { safeInit(); }
window.addEventListener('load', registerOfflineApp);
