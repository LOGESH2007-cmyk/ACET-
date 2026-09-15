/**
 * Code From Zero - Main Application Coordinator
 * Boots the application, wires DOM event listeners, and orchestrates services.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("⚡ Initializing Code From Zero Platform...");
  
  // 0. Splash Screen — only dismisses when user clicks.
  const splash = document.getElementById('splash-screen');
  function hideSplash() {
    if (splash) {
      splash.style.opacity = '0';
      splash.style.transition = 'opacity 0.5s ease';
      setTimeout(() => splash.remove(), 500);
    }
  }
  if (splash) {
    splash.addEventListener('click', hideSplash);
  }

  // 1. Initialize State & UI
  const state = window.appState ? window.appState.state : null;
  if (window.ui) {
    window.ui.switchView('login'); // Start at login
    window.ui.loadProblemIntoIDE(state ? state.currentProblemId : 'c-hello');
  }

  // 2. Wire Top Navigation Tabs
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view && window.ui) {
        window.ui.switchView(view);
      }
    });
  });

  // 3. Wire Multilingual Language Switcher (EN / TA / Tanglish)
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.lang;
      if (window.appState) {
        window.appState.setLanguageMode(mode);
      }
      langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === mode));

      // Update tutor status indicator
      const tutorLangStatus = document.getElementById('tutor-active-lang-text');
      if (tutorLangStatus) {
        const labels = { en: 'English Mode Active', ta: 'தமிழ் பயன்முறை செயலில் உள்ளது', tanglish: 'Tanglish Mode Active' };
        tutorLangStatus.innerText = labels[mode] || mode;
      }

      // Re-render line explanation if visible
      if (window.lineExplainer) {
        const editor = document.getElementById('code-editor-input');
        if (editor) {
          const lines = editor.value.split('\n');
          const lineNum = window.lineExplainer.currentLine || 1;
          window.lineExplainer.explainLine(lineNum, lines[lineNum - 1] || '');
        }
      }

      if (window.ui) {
        window.ui.showToast(`Switched AI Explanation language to ${mode.toUpperCase()}`, "info");
      }
    });
  });

  // 4. Wire Audio and Voice Toggles
  const soundBtn = document.getElementById('btn-toggle-sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      if (window.appState) {
        const active = window.appState.toggleSound();
        soundBtn.classList.toggle('active', active);
        soundBtn.innerHTML = active ? '🔊' : '🔇';
        if (window.ui) window.ui.showToast(active ? "Sound effects enabled" : "Sound muted", "info");
      }
    });
  }

  const voiceBtn = document.getElementById('btn-toggle-voice');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      if (window.appState) {
        const active = window.appState.toggleVoiceReadout();
        voiceBtn.classList.toggle('active', active);
        if (window.ui) window.ui.showToast(active ? "AI Voice auto-readout enabled" : "AI Voice readout muted", "info");
      }
    });
  }

  // 5. Wire Editor Events
  const editor = document.getElementById('code-editor-input');
  if (editor) {
    editor.addEventListener('input', () => {
      if (window.ui) window.ui.updateLineNumbers();
    });

    editor.addEventListener('keyup', (e) => {
      // Determine cursor line
      const text = editor.value.substring(0, editor.selectionStart);
      const lineNum = text.split('\n').length;
      if (window.ui) window.ui.handleLineClick(lineNum);
    });

    // Support Tab key indent
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + "    " + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
        if (window.ui) window.ui.updateLineNumbers();
      }
    });
  }

  // 6. Wire Language Selector in IDE
  const langSelect = document.getElementById('editor-lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      const selectedLang = e.target.value;
      const prob = window.CURRICULUM_DATA.find(p => p.language === selectedLang);
      if (prob && window.ui) {
        window.ui.loadProblemIntoIDE(prob.id);
      }
    });
  }

  // 7. Wire Run Code Button
  const runBtn = document.getElementById('btn-run-code');
  if (runBtn) {
    runBtn.addEventListener('click', async () => {
      if (window.ui) window.ui.playSound('click');
      runBtn.disabled = true;
      runBtn.innerHTML = `<span>⏳</span> Compiling...`;

      const currentProbId = window.appState ? window.appState.state.currentProblemId : 'c-hello';
      const problem = window.CURRICULUM_DATA.find(p => p.id === currentProbId);
      const code = editor ? editor.value : '';
      const lang = langSelect ? langSelect.value : (problem ? problem.language : 'c');

      try {
        const result = await window.compilerEngine.runCode(lang, code, problem);

        // Update Terminal
        const termOutput = document.getElementById('terminal-output-body');
        const termTime = document.getElementById('terminal-metric-time');
        const termMem = document.getElementById('terminal-metric-memory');

        if (termTime) termTime.innerText = `${result.runtimeMs} ms`;
        if (termMem) termMem.innerText = `${result.memoryKb} KB`;

        if (result.success) {
          // Success!
          if (window.ui) {
            window.ui.playSound('success');
            window.ui.showToast("All test cases passed! Great job 🎉", "success");
            window.ui.switchPaneTab('terminal');
          }
          if (termOutput) {
            termOutput.innerHTML = `
<span style="color:#10b981; font-weight:bold;">🚀 STATUS: SUCCESS (All Test Cases Passed)</span>
--------------------------------------------------------
${result.output}
            `;
          }
          if (window.appState) {
            window.appState.recordProblemPassed(problem.id);
            window.ui.renderDashboard();
          }
          // Clear error diagnostic
          if (window.aiErrorDetector) {
            window.aiErrorDetector.renderDiagnostic(null);
          }
        } else {
          // Error or failure detected!
          if (window.ui) {
            window.ui.playSound('error');
            window.ui.showToast("Code error detected! Opening AI Diagnostic...", "error");
            window.ui.switchPaneTab('diagnostics');
          }

          if (termOutput) {
            termOutput.innerHTML = `
<span style="color:#f43f5e; font-weight:bold;">❌ COMPILATION / RUNTIME EXCEPTION</span>
--------------------------------------------------------
${result.errors || 'Assertion failed on test cases.'}

${result.output || ''}
            `;
          }

          // Trigger AI Error Detection 3-part card
          if (window.aiErrorDetector && result.errorDiagnostic) {
            const currentLangMode = window.appState ? window.appState.state.settings.languageMode : 'tanglish';
            window.aiErrorDetector.renderDiagnostic(result.errorDiagnostic, currentLangMode);
          }
        }
      } catch (err) {
        console.error("Execution error:", err);
      } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = `<span>▶</span> Run Code`;
      }
    });
  }

  // 8. Wire AI Tutor Chat & Speech
  const tutorInput = document.getElementById('tutor-input-field');
  const tutorSend = document.getElementById('btn-tutor-send');
  const tutorMic = document.getElementById('btn-tutor-mic');

  if (tutorSend && tutorInput) {
    tutorSend.addEventListener('click', () => {
      if (window.aiTutor) window.aiTutor.askQuestion(tutorInput.value);
    });

    tutorInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (window.aiTutor) window.aiTutor.askQuestion(tutorInput.value);
      }
    });
  }

  if (tutorMic) {
    tutorMic.addEventListener('click', () => {
      if (window.aiTutor) window.aiTutor.toggleRecording();
    });
  }

  // Wire quick doubt chips
  const doubtChips = document.querySelectorAll('.quick-doubt-chip');
  doubtChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query || chip.innerText.trim();
      if (window.aiTutor) window.aiTutor.askQuestion(q);
    });
  });

  // 9. Wire Visualizer Controls
  const playBtn = document.getElementById('btn-play-pause');
  const nextBtn = document.getElementById('btn-step-forward');
  const backBtn = document.getElementById('btn-step-back');
  const resetBtn = document.getElementById('btn-step-reset');
  const algoSelect = document.getElementById('visualizer-algo-select');
  const speedSlider = document.getElementById('visualizer-speed-slider');

  if (playBtn) playBtn.addEventListener('click', () => window.algorithmVisualizer.togglePlay());
  if (nextBtn) nextBtn.addEventListener('click', () => window.algorithmVisualizer.stepForward());
  if (backBtn) backBtn.addEventListener('click', () => window.algorithmVisualizer.stepBack());
  if (resetBtn) resetBtn.addEventListener('click', () => window.algorithmVisualizer.reset());
  if (algoSelect) {
    algoSelect.addEventListener('change', (e) => window.algorithmVisualizer.loadAlgorithm(e.target.value));
  }
  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => window.algorithmVisualizer.setSpeed(Number(e.target.value)));
  }

  // 10. Subscribe state updates
  if (window.appState) {
    window.appState.subscribe(() => {
      if (window.ui) window.ui.renderDashboard();
    });
  }

  // 11. Register Service Worker (PWA Offline Support)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        console.log('[SW] Registered:', reg.scope);
      }).catch((err) => {
        console.warn('[SW] Registration failed:', err);
      });
    });
  }

  // 12. Install App Modal Logic
  let deferredInstallPrompt = null;

  // Capture browser's native PWA install event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    // Show a subtle indicator on the install button
    const btn = document.getElementById('btn-install-app');
    if (btn) btn.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.9)';
  });

  // Open modal
  const btnInstallApp = document.getElementById('btn-install-app');
  const installModalBackdrop = document.getElementById('install-modal-backdrop');
  const btnCloseModal = document.getElementById('btn-close-install-modal');

  function openInstallModal() {
    if (installModalBackdrop) installModalBackdrop.classList.add('active');
  }
  function closeInstallModal() {
    if (installModalBackdrop) installModalBackdrop.classList.remove('active');
  }

  if (btnInstallApp) btnInstallApp.addEventListener('click', openInstallModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeInstallModal);

  // Close when clicking backdrop outside the card
  if (installModalBackdrop) {
    installModalBackdrop.addEventListener('click', (e) => {
      if (e.target === installModalBackdrop) closeInstallModal();
    });
  }
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeInstallModal();
  });

  // Tab Switching
  const installTabs = document.querySelectorAll('.install-tab');
  const installTabContents = document.querySelectorAll('.install-tab-content');
  installTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      installTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
      installTabContents.forEach(c => c.classList.toggle('active', c.id === `install-tab-${target}`));
    });
  });

  // Download: Launch-ACET-App.bat
  const btnDownloadLauncher = document.getElementById('btn-download-launcher');
  if (btnDownloadLauncher) {
    btnDownloadLauncher.addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = './Launch-ACET-App.bat';
      a.download = 'Launch-ACET-App.bat';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (window.ui) window.ui.showToast('Downloading Launch-ACET-App.bat...', 'success');
    });
  }

  // Download: Create-Desktop-Shortcut.ps1
  const btnDownloadShortcut = document.getElementById('btn-download-shortcut');
  if (btnDownloadShortcut) {
    btnDownloadShortcut.addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = './Create-Desktop-Shortcut.ps1';
      a.download = 'Create-Desktop-Shortcut.ps1';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (window.ui) window.ui.showToast('Downloading Create-Desktop-Shortcut.ps1...', 'success');
    });
  }

  // Native PWA Install trigger button
  const btnPwaNativeInstall = document.getElementById('btn-pwa-native-install');
  if (btnPwaNativeInstall) {
    if (!deferredInstallPrompt) {
      btnPwaNativeInstall.textContent = '📲 Install Now (Open via localhost:5500 first)';
      btnPwaNativeInstall.disabled = true;
    }
    btnPwaNativeInstall.addEventListener('click', async () => {
      if (!deferredInstallPrompt) {
        if (window.ui) window.ui.showToast('Open via http://localhost:5500 in Chrome/Edge to install as PWA', 'warning');
        return;
      }
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        if (window.ui) window.ui.showToast('🎉 Code From Zero installed!', 'success');
        closeInstallModal();
      }
      deferredInstallPrompt = null;
    });
  }

  // When PWA is successfully installed, update the button
  window.addEventListener('appinstalled', () => {
    if (window.ui) window.ui.showToast('🎉 Code From Zero has been installed!', 'success');
    const btn = document.getElementById('btn-install-app');
    if (btn) {
      btn.innerHTML = '<span class="install-btn-icon">✅</span><span class="install-btn-text">Installed!</span>';
      btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
    }
    deferredInstallPrompt = null;
  });

  console.log("🚀 Code From Zero is ready!");
});

