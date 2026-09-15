/**
 * ACET CodeMentor AI - AI Error Detection System
 * Breaks down programming errors into What Went Wrong, Why It Occurred, and How To Fix It.
 * Supports English, Tamil, and Tanglish translations with interactive 1-click code patch application.
 */

class AIErrorDetector {
  constructor() {
    this.containerId = 'ai-error-content';
  }

  /**
   * Render the 3-part diagnostic card
   */
  renderDiagnostic(diagnostic, languageMode = 'tanglish') {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    if (!diagnostic) {
      container.innerHTML = `
        <div style="text-align:center; padding: 2rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎉</div>
          <h4>Zero Errors Detected!</h4>
          <p style="font-size:0.85rem; margin-top:0.35rem;">Your code compiled cleanly without syntax or boundary traps.</p>
        </div>
      `;
      return;
    }

    // Localize the "Why" and "What" based on language mode
    const localized = this.getLocalizedExplanation(diagnostic, languageMode);

    container.innerHTML = `
      <div class="error-diagnostic-card">
        <div class="error-card-header">
          <div class="error-card-title">
            <span>🚨</span>
            <span>${diagnostic.type === 'syntax' ? 'Syntax Crash Detected' : 'Runtime & Memory Trap Detected'}</span>
          </div>
          <span class="badge badge-danger">Line ${diagnostic.line || 1}</span>
        </div>

        <!-- 1. WHAT WENT WRONG -->
        <div class="diagnostic-section">
          <div class="diagnostic-heading what">
            <span>🔴</span>
            <span>1. What Went Wrong</span>
          </div>
          <div class="diagnostic-text">
            ${localized.what}
          </div>
        </div>

        <!-- 2. WHY IT OCCURRED -->
        <div class="diagnostic-section">
          <div class="diagnostic-heading why">
            <span>💡</span>
            <span>2. Why The Error Occurred</span>
          </div>
          <div class="diagnostic-text">
            ${localized.why}
          </div>
        </div>

        <!-- 3. HOW TO CORRECT IT -->
        <div class="diagnostic-section">
          <div class="diagnostic-heading how">
            <span>🛠️</span>
            <span>3. How To Correct It</span>
          </div>
          <div class="diagnostic-text">
            ${localized.how}
          </div>
          
          ${diagnostic.suggestedFix ? `
            <div class="code-diff-box">
              <span class="diff-line-remove">- ${escapeHtml(diagnostic.message || 'Error Line')}</span>
              <span class="diff-line-add">+ ${escapeHtml(diagnostic.suggestedFix)}</span>
            </div>
            <button class="btn btn-success btn-sm fix-action-btn" id="btn-apply-ai-fix" onclick="window.aiErrorDetector.applyFix('${escapeQuotes(diagnostic.suggestedFix)}', ${diagnostic.line})">
              <span>⚡</span> Apply AI Fix Directly to Editor
            </button>
          ` : ''}
        </div>
      </div>
    `;

    // Notify state and repeated mistake detector
    if (window.appState && diagnostic.key) {
      window.appState.recordMistake(diagnostic.key, diagnostic.message, diagnostic.why, diagnostic.type);
      if (window.mistakeDetector) {
        window.mistakeDetector.checkMistakes();
      }
    }
  }

  /**
   * Apply suggested fix into editor
   */
  applyFix(suggestedLine, lineNumber) {
    const editor = document.getElementById('code-editor-input');
    if (!editor || !lineNumber) return;

    const lines = editor.value.split('\n');
    if (lineNumber - 1 < lines.length) {
      lines[lineNumber - 1] = suggestedLine;
      editor.value = lines.join('\n');
      
      // Trigger editor change event
      editor.dispatchEvent(new Event('input'));
      
      if (window.ui) {
        window.ui.showToast("Applied AI Fix to line " + lineNumber + "! Try running the code again.", "success");
      }
    }
  }

  /**
   * Localized explanations in English, Tamil, and Tanglish
   */
  getLocalizedExplanation(diagnostic, lang) {
    if (diagnostic.key === 'off-by-one-c') {
      if (lang === 'ta') {
        return {
          what: `வரிசை சுட்டி எல்லை மீறியுள்ளது (Line ${diagnostic.line}): \`i <= n\` என கொடுக்கப்பட்டுள்ளது. அளவீடு \`n\` கொண்ட ஒரு வரிசையில் சுட்டிகள் \`0\` முதல் \`n-1\` வரை மட்டுமே செல்லுபடியாகும்.`,
          why: `C/C++ மொழியில் வரிசைகள் 0-லிருந்து தொடங்குகின்றன (Zero-indexed). நீங்கள் \`i <= n\` என எழுதும்போது, loop \`n+1\` தடவை இயங்கும். கடைசி சுழற்சியில் \`arr[n]\` அணுகப்படும்போது, அது ஒதுக்கப்பட்ட நினைவகத்திற்கு வெளியேயுள்ள குப்பையை (garbage memory) படிக்கிறது அல்லது Segmentation Fault பிழையை ஏற்படுத்துகிறது.`,
          how: `நிபந்தனையை \`i <= n\` என்பதற்குப் பதிலாக \`i < n\` என மாற்றுங்கள். இதன் மூலம் சுழற்சி \`n-1\`-ல் பத்திரமாக முடிவடையும்.`
        };
      } else if (lang === 'tanglish') {
        return {
          what: `Line ${diagnostic.line}-ல loop condition \`i <= n\`-னு இருக்கு bro. Size \`n\` array-க்கு valid indices \`0\` லிருந்து \`n-1\` வரைக்கும்தான்! \`arr[n]\` என்பது எல்லைக்கு வெளியே உள்ள மெமரி.`,
          why: `C & C++ -ல Arrays zero-indexed bro. \`i <= n\` போட்டா loop \`n+1\` times run ஆகும். Last iteration-ல \`arr[n]\` access பண்ணும்போது Segmentation fault (SIGSEGV) அல்லது garbage value read ஆகும்.`,
          how: `Loop condition-ஐ \`i <= n\`-க்கு பதிலா \`i < n\`-னு மாத்துங்க. அப்போதான் loop \`n-1\`-ல safe-ஆ terminate ஆகும்.`
        };
      }
    }

    if (diagnostic.key === 'missing-semicolon') {
      if (lang === 'ta') {
        return {
          what: `வரி ${diagnostic.line}-ல் முற்றுப்புள்ளி ';' விடுபட்டுள்ளது.`,
          why: `C/C++/Java போன்ற மொழிகளில் ஒவ்வொரு கட்டளையும் ஒரு ';' கொண்டு முடிக்கப்பட வேண்டும். இல்லையெனில் மொழிபெயர்ப்பாளரால் (compiler) அடுத்த வரியை அடையாளம் காண முடியாது.`,
          how: `வரியின் இறுதியில் ';' சேர்த்து பிழையை சரிசெய்யவும்.`
        };
      } else if (lang === 'tanglish') {
        return {
          what: `Line ${diagnostic.line} கடைசில semicolon ';' miss ஆகிருக்கு bro.`,
          why: `C, C++, Java-ல semicolon தான் statement-ஓட end boundary. அது இல்லனா compiler அடுத்த line-ஐ parse பண்ண முடியாம crash ஆகும்.`,
          how: `Line ${diagnostic.line} எண்டுல ஒரு \`;\` சேருங்க: \`${diagnostic.suggestedFix}\``
        };
      }
    }

    if (diagnostic.key === 'kadane-negative-init') {
      if (lang === 'ta') {
        return {
          what: `\`max_sum = 0\` என துவக்கியதால், அனைத்து எண்களும் எதிர்மறையாக (negative) இருக்கும் போது தவறான விடை 0 கிடைக்கிறது.`,
          why: `Kadane முறையில் ஒரு துணை வரிசையில் குறைந்தபட்சம் ஒரு எண்ணாவது இருக்க வேண்டும். அனைத்து எண்களும் [-3, -2, -5] போன்ற எதிர்மறை எண்களாக இருக்கும் போது, அதிகபட்ச கூட்டுத்தொகை -2 ஆகும். ஆனால் நீங்கள் 0 என துவக்கியதால் -2 ஐ விட 0 பெரியது என தவறு செய்கிறது.`,
          how: `\`max_sum = nums[0]\` என துவக்க வேண்டும்.`
        };
      } else if (lang === 'tanglish') {
        return {
          what: `Line ${diagnostic.line}-ல \`max_sum = 0\` initialize பண்ணிருக்கீங்க. Array-ல எல்லா numbers-ம் negative-ஆ இருந்தா (e.g. \`[-3, -2, -5]\`), answer \`-2\` வரணும், ஆனா \`0\` வருது!`,
          why: `Subarray-ல at least ஒரு number கண்டிப்பா இருக்கணும். \`max_sum = 0\` போட்டா, empty subarray count ஆகுற மாதிரி ஆகிடும். Negative array-ல 0 தான் பெருசுனு நினைச்சி தப்பான result கொடுக்கும்.`,
          how: `\`max_sum = nums[0]\` அல்லது \`float('-inf')\`-னு initialize பண்ணுங்க bro.`
        };
      }
    }

    // Default English
    return {
      what: diagnostic.what || diagnostic.message,
      why: diagnostic.why || "The syntax or logical rule of the programming language was violated.",
      how: diagnostic.how || "Review the flagged code and replace it with the suggested syntax."
    };
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeQuotes(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

window.aiErrorDetector = new AIErrorDetector();
