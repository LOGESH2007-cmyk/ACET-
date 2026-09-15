/**
 * Code From Zero — Multilingual AI Tutor (Voice & Text)
 * Tanglish mode: English letters only, casual Tamil-accented chat style (no Tamil script).
 * English mode: Clear, friendly explanations.
 */

class AITutor {
  constructor() {
    this.isRecording = false;
    this.recognition = null;
    this.synth = window.speechSynthesis || null;
    this.initSpeechRecognition();
    
    // Knowledge Base — all tanglish responses in English letters only (no Tamil Unicode)
    this.knowledgeBase = [
      {
        keywords: ['pointer', 'pointers', 'point'],
        responses: {
          en: "A **pointer** is a variable that stores the memory address of another variable. Instead of holding a direct value like `int x = 10;`, a pointer `int* ptr = &x;` holds the physical RAM address of `x`. Use `&` (address-of) to get the address and `*` (dereference) to read or modify the value stored there.",
          ta: "**Pointer** என்பது மற்றொரு மாறியின் நினைவக முகவரியை சேமிக்கும் மாறி. `&` மூலம் முகவரியைப் பெறலாம், `*` மூலம் அந்த மதிப்பை அணுகலாம்.",
          tanglish: "Bro, **pointer** na super simple concept daa! 😄\n\nNormal variable la direct value store aagum — like `int x = 10;` potta `x` la 10 irukkum.\n\nAana pointer la value illa bro — **memory address** store aagum! So `int* ptr = &x;` potta, `ptr` la `x` irukura RAM address (like `0x7ffe4`) store aagum.\n\n👉 `&x` — x-oda address edukku\n👉 `*ptr` — aa address la irukura value edukku (dereference)\n\nSimple-a sollunga, pointer = **GPS location of a variable** daa! 🗺️"
        }
      },
      {
        keywords: ['recursion', 'recursive'],
        responses: {
          en: "**Recursion** is when a function calls itself to solve a smaller version of the same problem. Every recursive function needs:\n1. **Base Case** — the stopping condition.\n2. **Recursive Step** — calling itself with a smaller input moving toward the base case.",
          ta: "**Recursion** என்பது ஒரு செயல்பாடு தன்னையே மீண்டும் அழைத்துக்கொள்ளும் முறை. Base Case இல்லாமல் infinite loop ஆகிவிடும்.",
          tanglish: "Bro, **recursion** na oru function thaane thane call pannukuradhu daa! 🔄\n\nMatryoshka doll theriyuma? Oru doll-kulla innoru doll, athukulla innoru doll — same maari function-kulla function call aagum!\n\n⚠️ **Super important**: **Base case** katti saa venum! Ille na function infinite times call aagum, stack overflow aa program crash aayidum!\n\nExample — factorial:\n```\nfact(5) → 5 * fact(4) → 5*4*fact(3) → ... → fact(1) = 1 (base case!)\n```\n\nBase case = door-ku lock poda key daa! 🔑"
        }
      },
      {
        keywords: ['time complexity', 'big-o', 'complexity', 'big o'],
        responses: {
          en: "**Time Complexity** measures how an algorithm's runtime grows as input size N increases. Common orders:\n- O(1): Instant lookup (Array index / HashMap)\n- O(log N): Binary Search\n- O(N): Single loop\n- O(N log N): Merge Sort\n- O(N²): Nested loops (slow!)",
          ta: "**Time Complexity** என்பது input அளவு N அதிகரிக்கும்போது algorithm எத்தனை operations செய்யும் என்பதை அளவிடுவது.",
          tanglish: "Bro, **Time Complexity** na clock time illa daa — input N perukara pothu code evlo operations panrathunn nu measure pannura method! 📊\n\n🚀 O(1) — Lightning fast! (Array index or HashMap lookup)\n⚡ O(log N) — Very fast! (Binary Search — half pannitu porom)\n🚶 O(N) — Good! (Single for loop)\n🐌 O(N²) — Too slow bro! (Nested loops — TCS/Zoho interview la Time Limit Exceeded varum!)\n\nRule of thumb: N = 10^5 irunaaa O(N log N) vare ok, O(N²) potta fail daa! 💀"
        }
      },
      {
        keywords: ['array', 'bounds', 'off-by-one', 'off by one', 'index'],
        responses: {
          en: "Arrays in C, C++, Java, and Python are **0-indexed**. For an array of size N, valid indices are 0 to N-1. Using `i <= n` in a loop is the classic off-by-one error — it tries to access `arr[n]` which is out of bounds.",
          ta: "0 முதல் தொடங்கும் arrays ல N அளவு இருந்தால் N-1 வரை மட்டுமே அணுகலாம். `i <= n` பிழையானது.",
          tanglish: "Bro, arrays **0 la start** aagum — 5 elements irunaa index 0, 1, 2, 3, 4 daa! 5 kidayaathu!\n\n`for (int i = 0; i <= n; i++)` pottaaa i=5 la `arr[5]` access pannalaam — athu **out of bounds** bro! Segmentation fault varum! 💥\n\n✅ Correct: `i < n` (strictly less than)\n❌ Wrong: `i <= n` (less than or equal — off by one trap!)\n\nSimple memory trick: **index = position - 1** always daa!"
        }
      },
      {
        keywords: ['hello world', 'first program', 'print', 'printf', 'println', 'beginner', 'start', 'basic'],
        responses: {
          en: "A **Hello World** program is the simplest first program you write in any language. It just prints text to the screen and confirms your environment is working!\n\n**C:** `printf(\"Hello, World!\");`\n**Python:** `print(\"Hello, World!\")`\n**Java:** `System.out.println(\"Hello, World!\");`",
          ta: "Hello World program — எந்த மொழியிலும் முதன்முதலில் எழுதும் திட்டம். இது screen-ல text print செய்கிறது.",
          tanglish: "Bro, **Hello World** — every programmer-oda first step da! 🎉\n\nAthu oru super simple program, just screen la text print pannudhu — environment work aaguthaann nu confirm pannuradhu!\n\n**C la:**\n```c\nprintf(\"Hello, World!\");\n```\n\n**Python la:**\n```python\nprint(\"Hello, World!\")\n```\n\n**Java la:**\n```java\nSystem.out.println(\"Hello, World!\");\n```\n\nAthula irundhuthan **Zero to Hero** journey start aagudhu bro! 🚀 First step = biggest step!"
        }
      },
      {
        keywords: ['variable', 'variables', 'data type', 'int', 'string', 'float'],
        responses: {
          en: "A **variable** is a named container that stores a value in memory. The **data type** tells the computer what kind of data it holds:\n- `int` — whole numbers (1, 42, -5)\n- `float` — decimal numbers (3.14)\n- `char` — single character ('A')\n- `String` — text (\"hello\")",
          ta: "**Variable** என்பது memory-ல value சேமிக்க ஒரு named container. Data type என்ன சேமிக்கப்படுகிறது என்பதை சொல்கிறது.",
          tanglish: "Bro, **variable** na oru named box daa — therla irukkura box maari, la value store pannalam! 📦\n\n`int age = 20;` — age box la 20 (whole number) store aagum\n`float marks = 85.5;` — marks box la 85.5 (decimal) store aagum\n`char grade = 'A';` — grade box la 'A' (single letter) store aagum\n\n**Data type** — box yeh type items fit aagum nu solludhu! int box la text vaiyala, Python la automatic-a type decide pannudhu — that's dynamic typing daa!"
        }
      },
      {
        keywords: ['loop', 'for loop', 'while', 'iteration'],
        responses: {
          en: "A **loop** repeats a block of code multiple times. Types:\n- `for` loop — when you know how many times to repeat\n- `while` loop — when you repeat until a condition is false\n- `do-while` — runs at least once, then checks condition",
          ta: "**Loop** ஒரு code block-ஐ பலமுறை இயக்குகிறது. for, while, do-while என்பவை பொதுவான வகைகள்.",
          tanglish: "Bro, **loop** na same code-a repeat pannuradhu daa — copy paste illamaa! 🔁\n\n`for` loop — evlo times run aaganum nu therinja use panna:\n```c\nfor(int i = 0; i < 5; i++) {\n    printf(\"%d \", i); // prints 0 1 2 3 4\n}\n```\n\n`while` loop — condition true-a irukkavare run aagum:\n```c\nwhile(score > 0) {\n    score--;\n}\n```\n\nSimple rule: **count therinja = for, condition therinja = while** daa! 😎"
        }
      },
      {
        keywords: ['function', 'method', 'return'],
        responses: {
          en: "A **function** is a reusable block of code that does a specific task. It can take **inputs (parameters)** and give back an **output (return value)**. Functions help avoid repeating code.",
          ta: "**Function** என்பது ஒரு குறிப்பிட்ட வேலை செய்யும் reusable code block. Parameters எடுத்து return value தரலாம்.",
          tanglish: "Bro, **function** na oru reusable code block daa — oru work-a oru jaaga define pannitu, evlo times venum nu call pannalam! 📞\n\n```c\nint add(int a, int b) {  // inputs = a, b\n    return a + b;        // output = sum\n}\n// call pannuradhu:\nint result = add(3, 4); // result = 7\n```\n\n**Return** na function result-a caller-ku thirumba kudukkathu daa!\n\nFunction = **Vending machine** — coins podraa (input), snack varudhu (output)! 🍫"
        }
      },
      {
        keywords: ['placement', 'interview', 'tcs', 'zoho', 'infosys', 'amazon', 'crack'],
        responses: {
          en: "For campus placement coding rounds:\n1. **Arrays & Strings** — 70% of questions come from here. Master Two Pointers and HashMap patterns.\n2. **Edge Cases** — Always test empty arrays, negative numbers, single elements.\n3. **Talk while coding** — explain your thought process aloud, interviewers love that.",
          ta: "Placement rounds-க்கு Arrays, Strings, Two Pointers, HashMap patterns master செய்யுங்கள். Edge cases மறக்காதீர்கள்.",
          tanglish: "Bro! Placement rounds crack pannanum aa? 3 golden tips daa! 🎯\n\n**Tip 1 — Arrays & Strings master pannunga:**\nTCS, Zoho, Infosys — 70% questions arrays/strings baasey! O(N²) nested loop avoid pannitu Two Pointer or HashMap use pannunga — O(N) efficiency daa!\n\n**Tip 2 — Edge cases yaosinga:**\nEmpty array, all negative numbers, single element — interviewer definitely ithey test case poduvaanga! Forget panna fail daa!\n\n**Tip 3 — Loud-a explain pannunga:**\nMouna-va code panna good illa bro — logic-a explain pannukitey code pannunga! Interviewer thinking process pakkanum!\n\nYou got this daa! 💪🔥"
        }
      }
    ];
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.updateMicUI(true);
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('tutor-input-field');
        if (input) {
          input.value = transcript;
          this.askQuestion(transcript);
        }
      };

      this.recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        this.stopRecording();
      };

      this.recognition.onend = () => {
        this.stopRecording();
      };
    }
  }

  toggleRecording() {
    if (!this.recognition) {
      if (window.ui) {
        window.ui.showToast("Speech Recognition not supported. Please use text input.", "warning");
      }
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
      this.stopRecording();
    } else {
      try {
        this.recognition.lang = 'en-US';
        this.recognition.start();
      } catch (err) {
        console.warn("Could not start recognition:", err);
      }
    }
  }

  stopRecording() {
    this.isRecording = false;
    this.updateMicUI(false);
  }

  updateMicUI(isRecording) {
    const micBtn = document.getElementById('btn-tutor-mic');
    const wave = document.getElementById('tutor-voice-wave');
    if (micBtn) {
      micBtn.classList.toggle('recording', isRecording);
      micBtn.innerHTML = isRecording ? '⏹️' : '🎙️';
    }
    if (wave) {
      wave.classList.toggle('recording', isRecording);
    }
  }

  askQuestion(query) {
    if (!query || !query.trim()) return;
    const cleanQuery = query.trim();

    // 1. Append user message to UI
    this.appendMessage('user', cleanQuery);

    // Clear input
    const input = document.getElementById('tutor-input-field');
    if (input) input.value = '';

    // 2. Generate AI Answer
    const currentLang = window.appState ? window.appState.state.settings.languageMode : 'tanglish';
    const answer = this.generateResponse(cleanQuery, currentLang);

    setTimeout(() => {
      this.appendMessage('ai', answer.text, answer.lang);
      
      // Auto voice readout if enabled
      if (window.appState && window.appState.state.settings.voiceReadout) {
        this.speakText(answer.spokenText || answer.text, answer.lang);
      }
    }, 450);
  }

  generateResponse(query, langMode) {
    const lower = query.toLowerCase();

    // Check knowledge base
    for (const item of this.knowledgeBase) {
      if (item.keywords.some(kw => lower.includes(kw))) {
        const fullText = item.responses[langMode] || item.responses.tanglish;
        return {
          text: fullText,
          spokenText: this.stripMarkdown(fullText),
          lang: langMode
        };
      }
    }

    // Dynamic contextual fallback
    if (langMode === 'ta') {
      return {
        text: `உங்கள் கேள்வி: "${query}". \n\nEditor-ல் code எழுதி 'Run Code' அழுத்தினால், AI உடனடியாக error-ஐ explain செய்யும்!`,
        spokenText: "உங்கள் கேள்வி பெறப்பட்டது. Editor-ல் code run பண்ணி AI explanation பெறுங்கள்.",
        lang: 'ta'
      };
    } else if (langMode === 'tanglish') {
      return {
        text: `Bro, "${query}" — super question daa! 🤔\n\nConcept-a visualize pannitu try pannunga — memorize panna venam! Editor la code type panni Run pannaa, AI instant-a error explain pannudhu. Hints tab la Level 1 unblock pannitu start pannunga — zero-la irundhey hero aagalam daa! 💪`,
        spokenText: `Bro, super question daa! Editor la code run pannaa AI instant-a diagnose pannudhu. Try pannunga!`,
        lang: 'tanglish'
      };
    }

    return {
      text: `Great question about "${query}"! To master this concept, try writing code in the Editor and clicking Run — the AI will immediately diagnose any errors and explain them line by line. You can also click any line in the editor to get a mechanical explanation of what that line does!`,
      spokenText: `Great question! Try writing code in the editor and run it — the AI will explain errors instantly.`,
      lang: 'en'
    };
  }

  appendMessage(sender, text, lang = 'tanglish') {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;

    const langBadge = sender === 'ai' ? `
      <div class="chat-lang-indicator">
        <span>🌐</span>
        <span>${lang.toUpperCase()}</span>
      </div>
    ` : '';

    const speakBtn = sender === 'ai' ? `
      <div>
        <button class="chat-speak-btn speak-toggle-btn" onclick="window.aiTutor.toggleSpeak(this, '${escapeQuotes(this.stripMarkdown(text))}', '${lang}')">
          <span class="speak-icon">🔊</span> <span class="speak-label">Listen</span>
        </button>
      </div>
    ` : '';

    bubble.innerHTML = `
      <div class="chat-bubble-avatar">${sender === 'ai' ? '🤖' : '👨‍💻'}</div>
      <div class="chat-bubble-content">
        ${langBadge}
        ${this.formatMarkdown(text)}
        ${speakBtn}
      </div>
    `;

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  toggleSpeak(btnElement, text, lang = 'en') {
    if (!this.synth) return;

    // If currently speaking, stop it
    if (this.synth.speaking) {
      this.stopSpeaking();
      return;
    }

    // Start speaking
    this.speakText(text, lang, btnElement);
  }

  speakText(text, lang = 'en', triggerBtn = null) {
    if (!this.synth) return;
    this.synth.cancel();

    const clean = this.stripMarkdown(text);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US'; // always English for tanglish

    // Update all speak buttons to show "Stop" state
    this._setAllSpeakButtons('stop');

    utterance.onend = () => {
      this._setAllSpeakButtons('listen');
    };
    utterance.onerror = () => {
      this._setAllSpeakButtons('listen');
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (!this.synth) return;
    this.synth.cancel();
    this._setAllSpeakButtons('listen');
  }

  _setAllSpeakButtons(state) {
    const btns = document.querySelectorAll('.speak-toggle-btn');
    btns.forEach(btn => {
      const icon = btn.querySelector('.speak-icon');
      const label = btn.querySelector('.speak-label');
      if (state === 'stop') {
        if (icon) icon.textContent = '🔇';
        if (label) label.textContent = 'Stop';
        btn.classList.add('speaking-active');
      } else {
        if (icon) icon.textContent = '🔊';
        if (label) label.textContent = 'Listen';
        btn.classList.remove('speaking-active');
      }
    });
  }

  formatMarkdown(text) {
    return '<p>' + text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre class="code-block">$1</pre>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>') + '</p>';
  }

  stripMarkdown(text) {
    return text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/👉|⚠️|🚀|⚡|🔄|📦|🎉|💥|✅|❌|🔁|📞|📊|💪|🔥|🎯|🗺️|🏢|😄|😎|💀|🍫|🔑|🔐/g, '');
  }
}

window.aiTutor = new AITutor();
