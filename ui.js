/**
 * ACET CodeMentor AI - UI Controller & View Manager
 * Handles responsive view navigation, Skill Radar chart, Placement Gauge,
 * audio synthesizers, toast notifications, and interactive IDE interactions.
 */

class UIController {
  constructor() {
    this.audioCtx = null;
    this.viewHistory = ['login']; // Track navigation history
  }

  initAudio() {
    if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
  }

  playSound(type) {
    if (!window.appState || !window.appState.state.settings.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'click') {
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(160, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : (type === 'warning' ? '⚠️' : 'ℹ️'));
    toast.innerHTML = `
      <span style="font-size:1.2rem;">${icon}</span>
      <div>${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  switchView(viewName, isBackNav = false) {
    this.playSound('click');
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => sec.classList.remove('active'));

    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.add('active');
    }

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewName);
    });
    
    // Hide nav links and actions if on login view
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    if (viewName === 'login') {
      if (navLinks) navLinks.style.display = 'none';
      if (navActions) navActions.style.display = 'none';
    } else {
      if (navLinks) navLinks.style.display = 'flex';
      if (navActions) navActions.style.display = 'flex';
    }

    // Toggle back button visibility
    const backBtn = document.getElementById('btn-back-nav');
    if (backBtn) {
      if (viewName === 'dashboard' || viewName === 'login') {
        backBtn.classList.remove('visible');
      } else {
        backBtn.classList.add('visible');
      }
    }
    
    // Handle history
    if (!isBackNav) {
      if (this.viewHistory[this.viewHistory.length - 1] !== viewName) {
        this.viewHistory.push(viewName);
      }
    }

    if (viewName === 'dashboard') {
      this.renderDashboard();
    } else if (viewName === 'visualizer') {
      if (window.algorithmVisualizer) window.algorithmVisualizer.init();
    } else if (viewName === 'curriculum') {
      this.renderCurriculum();
    }
  }

  goBack() {
    if (this.viewHistory.length > 1) {
      this.viewHistory.pop(); // Remove current view
      const prevView = this.viewHistory[this.viewHistory.length - 1];
      this.switchView(prevView, true);
    } else {
      this.switchView('dashboard', true);
    }
  }

  renderDashboard() {
    const state = window.appState ? window.appState.state : null;
    if (!state) return;

    // 1. Placement Gauge SVG
    const circle = document.getElementById('gauge-progress-circle');
    const pctLabel = document.getElementById('gauge-percentage-label');
    const navPillPct = document.getElementById('nav-readiness-percent');

    const pct = state.placementReadiness;
    if (pctLabel) pctLabel.innerText = `${pct}%`;
    if (navPillPct) navPillPct.innerText = `${pct}%`;

    if (circle) {
      // radius is 72, circumference is 2 * PI * 72 = 452.38
      const circumference = 452.38;
      
      // Animate progress from zero
      circle.style.strokeDashoffset = circumference;
      circle.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)';
      
      setTimeout(() => {
        const offset = circumference - (pct / 100) * circumference;
        circle.style.strokeDashoffset = offset;
      }, 100);
    }

    // 2. Company readiness list
    const compContainer = document.getElementById('company-milestones-list');
    if (compContainer) {
      compContainer.innerHTML = Object.values(state.companyReadiness).map(comp => {
        const isReady = comp.status.includes('Ready');
        const colorClass = isReady ? 'status-ready' : (comp.status.includes('Almost') ? 'status-almost' : 'status-locked');
        return `
          <div class="milestone-item">
            <span class="milestone-company">🏢 ${comp.name}</span>
            <span class="milestone-status ${colorClass}">${comp.status}</span>
          </div>
        `;
      }).join('');
    }

    // 3. Draw Radar Chart on Canvas
    this.drawRadarChart(state.skills);

    // 4. Render Weaknesses list
    const weaknessList = document.getElementById('active-weaknesses-list');
    if (weaknessList) {
      if (state.weaknesses.length === 0) {
        weaknessList.innerHTML = `<div style="color:var(--text-muted); font-size:0.88rem;">No active weaknesses detected! You are performing exceptionally well.</div>`;
      } else {
        weaknessList.innerHTML = state.weaknesses.map(w => `
          <div class="weakness-card ${w.occurrences >= 2 && !w.remedialCompleted ? 'recurring' : ''}">
            <div class="weakness-info">
              <div class="weakness-icon-box" style="${w.remedialCompleted ? 'background:rgba(16,185,129,0.15); color:var(--success);' : ''}">
                ${w.remedialCompleted ? '✓' : '⚠️'}
              </div>
              <div class="weakness-details">
                <h5 style="${w.remedialCompleted ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${w.title}</h5>
                <p>${w.concept}</p>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:0.65rem;">
              <span class="badge ${w.remedialCompleted ? 'badge-success' : (w.occurrences >= 2 ? 'badge-danger' : 'badge-warning')}">
                ${w.remedialCompleted ? 'Resolved' : `${w.occurrences}x Detected`}
              </span>
              ${!w.remedialCompleted && w.occurrences >= 2 ? `
                <button class="btn btn-danger btn-sm" onclick="window.mistakeDetector.launchRemedialLab('${w.id}')">
                  Fix in Remedial Lab 🚀
                </button>
              ` : ''}
            </div>
          </div>
        `).join('');
      }
    }

    // Check mistake banner
    if (window.mistakeDetector) {
      window.mistakeDetector.checkMistakes();
    }
  }

  drawRadarChart(skills) {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 38;

    ctx.clearRect(0, 0, width, height);

    const labels = [
      { key: 'syntax', text: 'Syntax' },
      { key: 'logic', text: 'Logic' },
      { key: 'complexity', text: 'Complexity' },
      { key: 'edgeCases', text: 'Edge Cases' },
      { key: 'memory', text: 'Memory' },
      { key: 'debugging', text: 'Debugging' }
    ];

    const numAxes = labels.length;
    const angleStep = (Math.PI * 2) / numAxes;

    // Draw background grid polygons
    const levels = 4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level;
      ctx.beginPath();
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw axis lines & labels
    ctx.font = '11px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Label
      const labelX = centerX + (radius + 20) * Math.cos(angle);
      const labelY = centerY + (radius + 20) * Math.sin(angle);
      ctx.fillText(labels[i].text, labelX, labelY);
    }

    // Plot student skill polygon
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';

    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const skillVal = skills[labels[i].key] || 50;
      const r = (radius * skillVal) / 100;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Plot vertex dots
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const skillVal = skills[labels[i].key] || 50;
      const r = (radius * skillVal) / 100;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  renderCurriculum() {
    const grid = document.getElementById('curriculum-grid-container');
    if (!grid || !window.MODULE_CATEGORIES) return;

    grid.innerHTML = window.MODULE_CATEGORIES.map((lang, index) => {
      // Get completed count safely if state exists
      const state = window.appState ? window.appState.state : null;
      let completedCount = 0;
      let totalCount = lang.topics.filter(t => t.problemId).length;
      
      if (state && state.completedProblems) {
        completedCount = lang.topics.filter(t => t.problemId && state.completedProblems.includes(t.problemId)).length;
      }
      
      const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
      
      return `
      <div class="curriculum-module-card" style="display:flex; flex-direction:column; gap:1rem;">
        <div class="chapter-card-header" style="border-bottom:1px solid var(--border-bright); padding-bottom:1rem; margin-bottom:0.5rem;">
          <div class="chapter-num-badge" style="font-size:2rem; background:transparent;">${lang.icon}</div>
          <div>
            <h3 style="font-size: 1.25rem;">${lang.name}</h3>
            <p style="font-size: 0.85rem; color:var(--text-muted);">${lang.desc}</p>
          </div>
        </div>
        
        <div class="chapter-progress-wrap" style="margin-bottom:1rem;">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.25rem;">
            <span>Progress</span>
            <span>${progress}%</span>
          </div>
          <div class="chapter-progress-bar">
            <div class="chapter-progress-fill" style="width: 0%" data-target-width="${progress}%"></div>
          </div>
        </div>

        <div class="language-topics-list" style="display:flex; flex-direction:column; gap:1rem;">
          ${lang.topics.map(topic => `
            <div class="topic-item" style="background:var(--bg-dark); padding:1rem; border-radius:0.5rem; border:1px solid var(--border-bright);">
              <h4 style="margin-bottom:0.25rem; font-size:1.05rem; color:var(--primary-light);">${topic.title}</h4>
              <p style="font-size:0.85rem; color:var(--text-light); margin-bottom:0.75rem;">${topic.text}</p>
              ${topic.problemId ? `
                <button class="btn btn-primary btn-sm" onclick="window.ui.loadProblemIntoIDE('${topic.problemId}'); window.ui.switchView('editor')">
                  Practice Section ➔
                </button>
              ` : `
                <button class="btn btn-secondary btn-sm" disabled>Coming Soon</button>
              `}
            </div>
          `).join('')}
        </div>
      </div>
    `}).join('');
    
    // Trigger progress bar animations from 0 to target
    setTimeout(() => {
      document.querySelectorAll('.chapter-progress-fill').forEach(fill => {
        fill.style.width = fill.getAttribute('data-target-width');
      });
    }, 100);
  }

  openModuleCategory(categoryId) {
    // Pick the matching curriculum problem
    const category = window.MODULE_CATEGORIES.find(c => c.id === categoryId);
    let problemId = category && category.problems ? category.problems[0] : 'ch1-hello-world-c';

    this.loadProblemIntoIDE(problemId);
    this.switchView('editor');
  }

  loadProblemIntoIDE(problemId) {
    const problem = window.CURRICULUM_DATA.find(p => p.id === problemId) || window.CURRICULUM_DATA[0];
    if (window.appState) {
      window.appState.setCurrentProblem(problem.id);
      window.appState.setCurrentLanguage(problem.language);
    }

    // Set UI elements
    const titleEl = document.getElementById('ide-problem-title');
    const diffEl = document.getElementById('ide-difficulty-pill');
    const descEl = document.getElementById('ide-problem-description');
    const langSelect = document.getElementById('editor-lang-select');
    const editor = document.getElementById('code-editor-input');

    if (titleEl) titleEl.innerText = problem.title;
    if (diffEl) {
      diffEl.innerText = problem.difficulty;
      diffEl.className = `difficulty-pill difficulty-${problem.difficulty}`;
    }
    if (descEl) descEl.innerText = problem.description;
    if (langSelect) langSelect.value = problem.language;
    if (editor) {
      editor.value = problem.starterCode;
      this.updateLineNumbers();
    }

    // Load hints
    if (window.hintSystem) {
      window.hintSystem.renderHints(problem);
    }

    // Clear previous diagnostics
    if (window.aiErrorDetector) {
      window.aiErrorDetector.renderDiagnostic(null);
    }

    // Set problem for line explainer
    if (window.lineExplainer) {
      window.lineExplainer.setProblem(problem);
      // default explain line 1
      window.lineExplainer.explainLine(1, problem.starterCode.split('\n')[0]);
    }
  }

  updateLineNumbers() {
    const editor = document.getElementById('code-editor-input');
    const gutter = document.getElementById('line-numbers-gutter');
    if (!editor || !gutter) return;

    const lines = editor.value.split('\n');
    gutter.innerHTML = lines.map((_, i) => `
      <div class="gutter-line" data-line="${i + 1}" onclick="window.ui.handleLineClick(${i + 1})">
        ${i + 1}
      </div>
    `).join('');
  }

  handleLineClick(lineNum) {
    this.playSound('click');
    const editor = document.getElementById('code-editor-input');
    if (!editor) return;

    const lines = editor.value.split('\n');
    const lineText = lines[lineNum - 1] || '';

    // Position active line overlay
    const overlay = document.getElementById('active-line-overlay');
    if (overlay) {
      overlay.style.display = 'block';
      overlay.style.top = `${16 + (lineNum - 1) * 22}px`;
    }

    // Position floating explain button
    const explainBtn = document.getElementById('floating-line-explain-btn');
    if (explainBtn) {
      explainBtn.style.display = 'flex';
      explainBtn.style.top = `${12 + (lineNum - 1) * 22}px`;
      explainBtn.dataset.line = lineNum;
      explainBtn.innerHTML = `<span>⚡</span> Explain Line ${lineNum}`;
    }

    if (window.lineExplainer) {
      window.lineExplainer.explainLine(lineNum, lineText);
    }
  }

  switchPaneTab(tabName) {
    this.playSound('click');
    const tabs = document.querySelectorAll('.pane-tab');
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));

    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(p => p.classList.toggle('active', p.id === `tab-panel-${tabName}`));
  }
}

window.ui = new UIController();
