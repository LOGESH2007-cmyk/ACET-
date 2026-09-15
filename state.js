/**
 * ACET CodeMentor AI - Central Reactive State Store
 * Manages user profile, skill matrix, weaknesses, repeated mistake counts,
 * and placement readiness analytics with LocalStorage synchronization.
 */

class AppState {
  constructor() {
    this.STORAGE_KEY = 'codefromzero_state_v1'; // new key clears old ACET data
    this.listeners = [];
    // Clear any old ACET localStorage data
    localStorage.removeItem('acet_codementor_state_v1');
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      student: {
        name: "Praveen Kumar",
        college: "Code From Zero Academy",
        branch: "Computer Science",
        year: "1st Year",
        avatar: "👨‍💻",
        streakDays: 0,
        totalSolved: 0,
        coins: 0
      },
      settings: {
        languageMode: 'en', // 'en' | 'ta' | 'tanglish'
        soundEnabled: true,
        voiceReadout: true,
        theme: 'dark'
      },
      currentLanguage: 'c',
      currentProblemId: 'c-hello',
      placementReadiness: 0, // percentage
      companyReadiness: {
        tcs: { name: 'TCS NQT', threshold: 60, status: 'Locked' },
        infosys: { name: 'Infosys DSE', threshold: 70, status: 'Locked' },
        zoho: { name: 'Zoho Tech', threshold: 80, status: 'Locked' },
        amazon: { name: 'Amazon SDE', threshold: 90, status: 'Locked' }
      },
      skills: {
        syntax: 0,
        logic: 0,
        complexity: 0,
        edgeCases: 0,
        memory: 0,
        debugging: 0
      },
      // No weaknesses at start — earned as user makes mistakes
      weaknesses: [],
      // No mistake history at start — grows as user practices
      mistakeHistory: {},
      activeRemedial: null,
      completedProblems: [],
      unlockedHints: {}
    };
  }

  loadState() {
    try {
      // Wipe old keys to ensure fresh start
      localStorage.removeItem('acet_codementor_state_v1');
      localStorage.removeItem('codefromzero_state_v1'); // Force reset for new curriculum
    } catch (e) {
      console.warn("Could not clear localStorage:", e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  setLanguageMode(mode) {
    if (['en', 'ta', 'tanglish'].includes(mode)) {
      this.state.settings.languageMode = mode;
      this.saveState();
    }
  }

  setCurrentProblem(problemId) {
    this.state.currentProblemId = problemId;
    this.saveState();
  }

  setCurrentLanguage(lang) {
    this.state.currentLanguage = lang;
    this.saveState();
  }

  toggleSound() {
    this.state.settings.soundEnabled = !this.state.settings.soundEnabled;
    this.saveState();
    return this.state.settings.soundEnabled;
  }

  toggleVoiceReadout() {
    this.state.settings.voiceReadout = !this.state.settings.voiceReadout;
    this.saveState();
    return this.state.settings.voiceReadout;
  }

  setCurrentProblem(problemId) {
    this.state.currentProblemId = problemId;
    this.saveState();
  }

  setCurrentLanguage(lang) {
    this.state.currentLanguage = lang;
    this.saveState();
  }

  unlockHint(problemId, tier) {
    if (!this.state.unlockedHints[problemId]) {
      this.state.unlockedHints[problemId] = [];
    }
    if (!this.state.unlockedHints[problemId].includes(tier)) {
      this.state.unlockedHints[problemId].push(tier);
      // Slight deduction in edge case or logic score for relying on tier 3
      if (tier === 3) {
        this.state.skills.logic = Math.max(40, this.state.skills.logic - 2);
      }
      this.saveState();
    }
  }

  recordMistake(misconceptionKey, title, concept, category) {
    if (!this.state.mistakeHistory[misconceptionKey]) {
      this.state.mistakeHistory[misconceptionKey] = 0;
    }
    this.state.mistakeHistory[misconceptionKey] += 1;
    const count = this.state.mistakeHistory[misconceptionKey];

    // Check if it already exists in weaknesses
    let existing = this.state.weaknesses.find(w => w.id === misconceptionKey);
    if (!existing) {
      existing = {
        id: misconceptionKey,
        title: title || 'Code Misconception',
        concept: concept || 'Logical or boundary error pattern detected.',
        category: category || 'Syntax & Logic',
        severity: count >= 2 ? 'high' : 'medium',
        occurrences: count,
        remedialCompleted: false,
        detectedAt: 'Just now'
      };
      this.state.weaknesses.unshift(existing);
    } else {
      existing.occurrences = count;
      existing.severity = count >= 2 ? 'high' : 'medium';
      existing.detectedAt = 'Just now';
    }

    // Impact skill metrics
    this.state.skills.edgeCases = Math.max(35, this.state.skills.edgeCases - 3);
    this.state.skills.debugging = Math.max(40, this.state.skills.debugging - 2);
    this.updatePlacementReadiness();

    // Trigger Repeated Mistake Remedial Lab if count >= 2!
    if (count >= 2) {
      this.state.activeRemedial = existing;
    }

    this.saveState();
    return { count, triggeredRemedial: count >= 2 };
  }

  resolveWeakness(misconceptionKey) {
    const existing = this.state.weaknesses.find(w => w.id === misconceptionKey);
    if (existing) {
      existing.remedialCompleted = true;
      existing.severity = 'resolved';
    }
    // Boost skills
    this.state.skills.edgeCases = Math.min(95, this.state.skills.edgeCases + 10);
    this.state.skills.debugging = Math.min(95, this.state.skills.debugging + 8);
    this.state.skills.logic = Math.min(95, this.state.skills.logic + 6);
    this.state.student.totalSolved += 1;
    this.state.student.coins += 100;
    this.state.activeRemedial = null;
    this.updatePlacementReadiness();
    this.saveState();
  }

  updatePlacementReadiness() {
    const avgSkills = (
      this.state.skills.syntax +
      this.state.skills.logic +
      this.state.skills.complexity +
      this.state.skills.edgeCases +
      this.state.skills.memory +
      this.state.skills.debugging
    ) / 6;

    // Weight active high-severity weaknesses
    const activeHigh = this.state.weaknesses.filter(w => !w.remedialCompleted && w.severity === 'high').length;
    const penalty = activeHigh * 4;

    this.state.placementReadiness = Math.round(Math.max(20, Math.min(98, avgSkills - penalty)));

    // Update company statuses
    for (const [key, comp] of Object.entries(this.state.companyReadiness)) {
      if (this.state.placementReadiness >= comp.threshold + 5) {
        comp.status = 'Ready 🚀';
      } else if (this.state.placementReadiness >= comp.threshold - 5) {
        comp.status = 'Almost Ready ⚡';
      } else {
        comp.status = 'Needs Practice ⏳';
      }
    }
  }

  recordProblemPassed(problemId) {
    if (!this.state.completedProblems.includes(problemId)) {
      this.state.completedProblems.push(problemId);
      this.state.student.totalSolved += 1;
      this.state.student.coins += 50;
      this.state.skills.logic = Math.min(95, this.state.skills.logic + 3);
      this.state.skills.syntax = Math.min(95, this.state.skills.syntax + 2);
      this.updatePlacementReadiness();
      this.saveState();
    }
  }
}

// Global instance
window.appState = new AppState();
