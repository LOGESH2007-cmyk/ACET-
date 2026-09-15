/**
 * ACET CodeMentor AI - Line-by-Line Code Explainer
 * Allows students to click or select any line of code to receive
 * crystal-clear logic breakdowns in English, Tamil, or Tanglish.
 */

class LineExplainer {
  constructor() {
    this.currentLine = 1;
    this.currentProblem = null;
    this.containerId = 'line-explainer-display';
  }

  setProblem(problem) {
    this.currentProblem = problem;
  }

  explainLine(lineNumber, rawLineText) {
    this.currentLine = lineNumber;
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const langMode = window.appState ? window.appState.state.settings.languageMode : 'tanglish';
    const explanationData = this.generateExplanation(lineNumber, rawLineText, langMode);

    container.innerHTML = `
      <div class="line-explainer-card">
        <div class="explainer-line-badge">
          <span>📍</span>
          <span>Line ${lineNumber} Analysis</span>
        </div>

        <div class="explainer-code-snippet">${escapeHtml(rawLineText || '// Empty line')}</div>

        <!-- Language Mode Tabs inside Explainer -->
        <div class="explainer-lang-tabs">
          <button class="explainer-lang-tab ${langMode === 'en' ? 'active' : ''}" onclick="window.lineExplainer.switchLang('en')">English</button>
          <button class="explainer-lang-tab ${langMode === 'ta' ? 'active' : ''}" onclick="window.lineExplainer.switchLang('ta')">தமிழ்</button>
          <button class="explainer-lang-tab ${langMode === 'tanglish' ? 'active' : ''}" onclick="window.lineExplainer.switchLang('tanglish')">Tanglish</button>
        </div>

        <div class="explainer-breakdown">
          <p>${explanationData.explanation}</p>
        </div>

        ${explanationData.variables ? `
          <div class="explainer-variables-box">
            <strong>🧠 Variable & State Impact:</strong>
            <p style="margin-top:0.25rem;">${explanationData.variables}</p>
          </div>
        ` : ''}

        <div style="margin-top:0.85rem; display:flex; justify-content:flex-end;">
          <button class="btn btn-secondary btn-sm speak-toggle-btn" onclick="window.aiTutor.toggleSpeak(this, '${escapeQuotes(explanationData.spokenText)}', '${langMode}')">
            <span class="speak-icon">🔊</span> <span class="speak-label">Listen Explanation</span>
          </button>
        </div>
      </div>
    `;

    // Also highlight gutter line
    this.highlightGutter(lineNumber);
  }

  switchLang(newLang) {
    if (window.appState) {
      window.appState.setLanguageMode(newLang);
    }
    // Re-explain current line
    const editor = document.getElementById('code-editor-input');
    if (editor) {
      const lines = editor.value.split('\n');
      const text = lines[this.currentLine - 1] || '';
      this.explainLine(this.currentLine, text);
    }
  }

  highlightGutter(lineNumber) {
    const gutterLines = document.querySelectorAll('.gutter-line');
    gutterLines.forEach((el, idx) => {
      el.classList.toggle('is-active-line', idx + 1 === lineNumber);
    });
  }

  generateExplanation(lineNumber, lineText, langMode) {
    const trimmed = (lineText || '').trim();

    // 1. Check if problem has pre-mapped custom explanation
    if (this.currentProblem && this.currentProblem.lineExplanations && this.currentProblem.lineExplanations[lineNumber]) {
      const item = this.currentProblem.lineExplanations[lineNumber];
      const text = item[langMode] || item.en;
      return {
        explanation: text,
        spokenText: text,
        variables: "Directly affects execution pointer and control flow."
      };
    }

    // 2. Heuristic dynamic explanation generator
    if (/^#include/.test(trimmed)) {
      if (langMode === 'ta') {
        return {
          explanation: "இந்த வரி தேவையான முன்வரையறுக்கப்பட்ட தலைப்பு கோப்பை (Header file) திட்டத்துடன் இணைக்கிறது.",
          spokenText: "இந்த வரி தேவையான முன்வரையறுக்கப்பட்ட தலைப்பு கோப்பை இணைக்கிறது.",
          variables: "நினைவகத்தில் functions மற்றும் macros-ஐ தயார் செய்கிறது."
        };
      } else if (langMode === 'tanglish') {
        return {
          explanation: "C/C++ -ல தேவையான standard functions (printf, scanf போன்றவை) access பண்ண header file include பண்றோம் bro.",
          spokenText: "Standard functions access பண்ண header file include பண்றோம்.",
          variables: "Standard library symbols register ஆகும்."
        };
      }
      return {
        explanation: "Pre-processor directive that includes the declarations of standard input/output library routines.",
        spokenText: "Pre processor directive including standard library functions.",
        variables: "Makes external library symbols available."
      };
    }

    if (/for\s*\(/.test(trimmed) || /^for\s+/.test(trimmed)) {
      if (langMode === 'ta') {
        return {
          explanation: "இது ஒரு சுழற்சி (for loop). குறிப்பிட்ட எல்லை வரை அடுத்தடுத்து உள்ள கூறுகளை மீண்டும் மீண்டும் இயக்க பயன்படுகிறது.",
          spokenText: "இது ஒரு சுழற்சி. எல்லை வரை கூறுகளை மீண்டும் இயக்க பயன்படுகிறது.",
          variables: "சுழற்சி மாறி (i) ஒவ்வொரு சுழற்சியிலும் புதுப்பிக்கப்படும்."
        };
      } else if (langMode === 'tanglish') {
        return {
          explanation: "இது ஒரு **for loop** bro! குறிப்பிட்ட condition true-வா இருக்கிற வரைக்கும் உள்ள இருக்கிற code block-ஐ repeat பண்ணும். Zero-index array-னா condition `< n` இருக்கணும், `<=` இருக்கக்கூடாது!",
          spokenText: "இது ஒரு ஃபார் லூப். கண்டிஷன் ட்ரூவா இருக்கிற வரைக்கும் உள்ள இருக்கிற கோட் ரிப்பீட் ஆகும்.",
          variables: "Loop variable `i` ஒவ்வொரு step-லயும் increment/decrement ஆகும்."
        };
      }
      return {
        explanation: "Iterates through a sequence or range until the condition becomes false. Pay close attention to loop bounds.",
        spokenText: "Iterates through a sequence until condition evaluates to false.",
        variables: "Index variable is updated at each cycle."
      };
    }

    if (/^return\b/.test(trimmed)) {
      if (langMode === 'ta') {
        return {
          explanation: "தற்போதைய செயல்பாட்டை முடித்துவிட்டு, கணக்கிடப்பட்ட இறுதி மதிப்பை அழைத்த இடத்திற்கு திருப்பி அனுப்புகிறது.",
          spokenText: "செயல்பாட்டை முடித்து இறுதி மதிப்பை திருப்பி அனுப்புகிறது.",
          variables: "Stack frame நினைவகத்திலிருந்து நீக்கப்படுகிறது."
        };
      } else if (langMode === 'tanglish') {
        return {
          explanation: "Function-ஓட execution-ஐ முடிச்சிட்டு, output value-ஐ call பண்ண இடத்துக்கே return பண்ணுது bro.",
          spokenText: "Function எக்சிகியூஷன் முடிந்து இறுதி மதிப்பு ரிட்டர்ன் ஆகிறது.",
          variables: "Function call stack frame pops out of memory."
        };
      }
      return {
        explanation: "Terminates function execution and passes the computed output value back to the caller.",
        spokenText: "Terminates execution and returns calculated value.",
        variables: "Removes current activation record from call stack."
      };
    }

    // Generic fallback
    if (langMode === 'ta') {
      return {
        explanation: `இந்த வரி ஒரு கணக்கீட்டு கட்டளையாகும். மாறி மற்றும் தர்க்க ரீதியான செயல்பாடுகளை செய்கிறது.`,
        spokenText: "இந்த வரி கணக்கீட்டு கட்டளையாகும்.",
        variables: "மாறியின் மதிப்பு மாற்றியமைக்கப்படுகிறது."
      };
    } else if (langMode === 'tanglish') {
      return {
        explanation: `இந்த line ஒரு statement execution bro. Variables-ஐ update பண்ணியோ அல்லது condition-ஐ check பண்ணியோ program flow-ஐ வழிநடத்துது.`,
        spokenText: "இந்த லைன் ஸ்டேட்மெண்ட் எக்ஸிகியூஷன் செய்கிறது.",
        variables: "Current program counter advances to next instruction."
      };
    }

    return {
      explanation: "This statement performs an assignment, condition evaluation, or data processing operation.",
      spokenText: "Statement execution step advancing instruction pointer.",
      variables: "State mutation or conditional branching occurs."
    };
  }
}

window.lineExplainer = new LineExplainer();
