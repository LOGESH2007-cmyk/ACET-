/**
 * ACET CodeMentor AI - Repeated Mistake Learning System & Remedial Lab
 * Detects recurring misconceptions across exercises and automatically provides
 * dedicated remedial modules with visual animations, concept teardowns, and reassessment.
 */

class RepeatedMistakeDetector {
  constructor() {
    this.remedialModalId = 'remedial-modal-backdrop';
  }

  checkMistakes() {
    const state = window.appState ? window.appState.state : null;
    if (!state) return;

    // Check if any weakness has >= 2 occurrences and is not yet completed
    const recurring = state.weaknesses.find(w => w.occurrences >= 2 && !w.remedialCompleted);

    const banner = document.getElementById('remedial-alert-banner');
    if (banner) {
      if (recurring) {
        banner.style.display = 'flex';
        const titleEl = document.getElementById('remedial-alert-title');
        const descEl = document.getElementById('remedial-alert-desc');
        if (titleEl) titleEl.innerText = `Recurring Misconception: ${recurring.title}`;
        if (descEl) descEl.innerText = `You have made this exact mistake ${recurring.occurrences} times. Launch the 3-minute remedial module to master this concept and protect your placement score.`;
      } else {
        banner.style.display = 'none';
      }
    }
  }

  launchRemedialLab(weaknessId = 'off-by-one-c') {
    const modal = document.getElementById(this.remedialModalId);
    if (!modal) return;

    modal.classList.add('active');
    this.renderRemedialContent(weaknessId);
  }

  closeRemedialLab() {
    const modal = document.getElementById(this.remedialModalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  renderRemedialContent(weaknessId) {
    const container = document.getElementById('remedial-dialog-content');
    if (!container) return;

    const langMode = window.appState ? window.appState.state.settings.languageMode : 'tanglish';

    if (weaknessId === 'off-by-one-c' || weaknessId.includes('off-by-one')) {
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div class="remedial-alert-icon">⚡</div>
            <div>
              <h2 style="font-size:1.4rem;">Remedial Practice: Array Boundary & Off-by-One Guard</h2>
              <span class="badge badge-danger">Repeated Misconception Detected</span>
            </div>
          </div>
          <button class="icon-btn" onclick="window.mistakeDetector.closeRemedialLab()">✕</button>
        </div>

        <!-- 1. VISUAL ANIMATION TEARDOWN -->
        <div class="card" style="background:#090d16; border-color:var(--border-bright);">
          <h4 style="color:var(--secondary); margin-bottom:0.75rem; display:flex; align-items:center; gap:0.5rem;">
            <span>🎬</span> 1. Visual Mental Model: Why Memory Breaks
          </h4>
          <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1rem;">
            In zero-indexed memory, an array of 5 elements occupies indices <code>0, 1, 2, 3, 4</code>. Let's see what happens when the loop uses <code>i &lt;= 5</code>:
          </p>

          <div style="display:flex; gap:10px; justify-content:center; padding:1.25rem; background:rgba(0,0,0,0.5); border-radius:var(--border-radius-md);">
            <div style="text-align:center;">
              <div style="width:55px; height:55px; background:var(--primary); border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:800; color:#fff;">10</div>
              <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-top:4px;">arr[0]</div>
            </div>
            <div style="text-align:center;">
              <div style="width:55px; height:55px; background:var(--primary); border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:800; color:#fff;">20</div>
              <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-top:4px;">arr[1]</div>
            </div>
            <div style="text-align:center;">
              <div style="width:55px; height:55px; background:var(--primary); border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:800; color:#fff;">30</div>
              <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-top:4px;">arr[2]</div>
            </div>
            <div style="text-align:center;">
              <div style="width:55px; height:55px; background:var(--primary); border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:800; color:#fff;">40</div>
              <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-top:4px;">arr[3]</div>
            </div>
            <div style="text-align:center;">
              <div style="width:55px; height:55px; background:var(--primary); border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:800; color:#fff;">50</div>
              <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-top:4px;">arr[4]</div>
            </div>
            <div style="text-align:center;">
              <div style="width:55px; height:55px; background:rgba(244,63,94,0.3); border:2px dashed var(--danger); border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:800; color:var(--danger); animation:pulse-glow 1.5s infinite;">☠️</div>
              <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--danger); margin-top:4px; font-weight:700;">arr[5] (SEGFAULT)</div>
            </div>
          </div>
        </div>

        <!-- 2. CONCEPT TEARDOWN IN TANGLISH / TAMIL -->
        <div class="card" style="background:var(--bg-tertiary);">
          <h4 style="color:#38bdf8; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
            <span>💡</span> 2. Simple Rule of Thumb
          </h4>
          <p style="font-size:0.9rem; line-height:1.6; color:var(--text-primary);">
            ${langMode === 'tanglish' 
              ? `Bro, எப்பவுமே memory-ல ஒரு formula ஞாபகம் வச்சுக்கோங்க: <strong>Start from 0 ➡️ End at &lt; n</strong>. நீங்க <code>&lt;= n</code> போட்டா மொத்தம் <code>n + 1</code> elements loop ஆகும். Last element எப்பவுமே <code>n - 1</code> தான்!`
              : `வரிசைகளில் சுட்டி 0-ல் தொடங்கினால், முடிவு நிபந்தனை <strong>&lt; n</strong> ஆக மட்டுமே இருக்க வேண்டும். <code>&lt;= n</code> என்பது ஒரு கூடுதல் உறுப்பை தேடி நினைவக பிழையை ஏற்படுத்தும்.`
            }
          </p>
        </div>

        <!-- 3. SPOT THE BUG MICRO-DRILL -->
        <div class="card">
          <h4 style="color:var(--warning); margin-bottom:0.65rem; display:flex; align-items:center; gap:0.5rem;">
            <span>🎯</span> 3. Reassessment Drill: Spot the Correct Loop
          </h4>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">
            Click on the code option that safely iterates over an array of size <code>int N = 10;</code>:
          </p>

          <div style="display:flex; flex-direction:column; gap:0.75rem;" id="drill-options-container">
            <div class="quick-doubt-chip" style="font-family:var(--font-mono); font-size:0.85rem;" onclick="window.mistakeDetector.answerDrill(false, this)">
              A) for (int i = 0; i &lt;= 10; i++) { printf("%d", arr[i]); }
            </div>
            <div class="quick-doubt-chip" style="font-family:var(--font-mono); font-size:0.85rem;" onclick="window.mistakeDetector.answerDrill(true, this)">
              B) for (int i = 0; i &lt; 10; i++) { printf("%d", arr[i]); }  // SAFE
            </div>
            <div class="quick-doubt-chip" style="font-family:var(--font-mono); font-size:0.85rem;" onclick="window.mistakeDetector.answerDrill(false, this)">
              C) for (int i = 1; i &lt;= 10; i++) { printf("%d", arr[i]); }
            </div>
          </div>

          <div id="drill-feedback-box" style="display:none; margin-top:1rem; padding:0.85rem; border-radius:var(--border-radius-sm);"></div>
        </div>
      `;
    }
  }

  answerDrill(isCorrect, element) {
    const feedback = document.getElementById('drill-feedback-box');
    if (!feedback) return;

    feedback.style.display = 'block';

    if (isCorrect) {
      feedback.style.background = 'rgba(16, 185, 129, 0.15)';
      feedback.style.border = '1px solid var(--success)';
      feedback.style.color = '#a7f3d0';
      feedback.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div>
            <strong>🎉 Correct! You nailed the boundary invariant!</strong>
            <p style="font-size:0.82rem; margin-top:0.25rem;">Indices 0 to 9 are accessed safely. No memory overrun occurs.</p>
          </div>
          <button class="btn btn-success btn-sm" onclick="window.mistakeDetector.completeRemedial('off-by-one-c')">
            Claim Mastery & Clear Weakness 🚀
          </button>
        </div>
      `;
    } else {
      feedback.style.background = 'rgba(244, 63, 94, 0.15)';
      feedback.style.border = '1px solid var(--danger)';
      feedback.style.color = '#fecdd3';
      feedback.innerHTML = `
        <strong>❌ Oops! Notice the bounds:</strong>
        <p style="font-size:0.82rem; margin-top:0.25rem;">Zero-indexed arrays must start at index 0 and end strictly before index 10 (<code>i &lt; 10</code>). Try Option B!</p>
      `;
    }
  }

  completeRemedial(weaknessId) {
    if (window.appState) {
      window.appState.resolveWeakness(weaknessId);
    }
    this.closeRemedialLab();
    this.checkMistakes();

    if (window.ui) {
      window.ui.showToast("🎉 Weakness Overcome! +100 Coins & Placement Readiness Boosted!", "success");
      window.ui.renderDashboard();
    }
  }
}

window.mistakeDetector = new RepeatedMistakeDetector();
