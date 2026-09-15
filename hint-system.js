/**
 * ACET CodeMentor AI - Progressive 3-Tier Hint System
 * Guides students toward solutions without immediately revealing full code.
 * Tier 1: Conceptual Nudge -> Tier 2: Algorithmic Blueprint -> Tier 3: Edge Case & Structure
 */

class HintSystem {
  constructor() {
    this.containerId = 'progressive-hints-list';
  }

  renderHints(problem) {
    const container = document.getElementById(this.containerId);
    if (!container || !problem) return;

    const unlocked = (window.appState && window.appState.state.unlockedHints[problem.id]) || [1];

    container.innerHTML = `
      <div style="margin-bottom:1rem; font-size:0.85rem; color:var(--text-secondary);">
        💡 <strong>Socratic Guidance:</strong> Hints are unlocked progressively to foster genuine problem-solving. Unlock only if you feel genuinely stuck!
      </div>
    `;

    const hints = problem.hints || [
      { tier: 1, title: "Conceptual Direction", text: "Think about the problem inputs and constraints." },
      { tier: 2, title: "Algorithmic Strategy", text: "Consider what data structure enables fastest lookups." },
      { tier: 3, title: "Boundary Guard", text: "Ensure you handle null, single elements, and empty inputs." }
    ];

    hints.forEach(hint => {
      const isUnlocked = unlocked.includes(hint.tier);
      const card = document.createElement('div');
      card.className = `hint-tier-card ${isUnlocked ? 'unlocked' : 'locked'}`;

      const tierBadgeColor = hint.tier === 1 ? 'badge-primary' : (hint.tier === 2 ? 'badge-warning' : 'badge-danger');

      card.innerHTML = `
        <div class="hint-header">
          <div class="hint-level-tag">
            <span>${hint.tier === 1 ? '🌱' : (hint.tier === 2 ? '⚡' : '🎯')}</span>
            <span>Tier ${hint.tier}: ${hint.title}</span>
          </div>
          <span class="badge ${tierBadgeColor}">${isUnlocked ? 'Unlocked' : 'Locked'}</span>
        </div>
        
        <div class="hint-content">
          ${isUnlocked ? `
            <p>${hint.text}</p>
          ` : `
            <p style="color:var(--text-muted); font-style:italic;">Hint hidden. Try working through your algorithm first.</p>
            <button class="btn btn-secondary btn-sm" style="margin-top:0.6rem;" onclick="window.hintSystem.unlockHint('${problem.id}', ${hint.tier})">
              🔓 Unlock Tier ${hint.tier} Hint
            </button>
          `}
        </div>
      `;

      container.appendChild(card);
    });
  }

  unlockHint(problemId, tier) {
    if (window.appState) {
      window.appState.unlockHint(problemId, tier);
      
      const currentProb = window.CURRICULUM_DATA ? window.CURRICULUM_DATA.find(p => p.id === problemId) : null;
      if (currentProb) {
        this.renderHints(currentProb);
      }

      if (window.ui) {
        window.ui.showToast(`Unlocked Tier ${tier} Hint! Read carefully before editing code.`, "info");
      }
    }
  }
}

window.hintSystem = new HintSystem();
