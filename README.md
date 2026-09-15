# ACET CodeMentor AI ⚡
> **Next-Generation AI-Powered Personalized Coding & Placement Accelerator**  
> Developed for **Team ACET (Akshaya College of Engineering & Technology)**.

---

## 🌟 Executive Summary

**ACET CodeMentor AI** is an intelligent coding education platform designed to empower engineering students to master programming languages (**C, C++, Java, Python**), **Data Structures & Algorithms (DSA)**, and **Campus Placement Coding Rounds** (TCS, Infosys, Zoho, Amazon).

The platform transforms passive coding tutorials into an active, socratic, and personalized mentorship experience through deep AI diagnostics, multilingual voice and text interactions, and continuous learning gap remediation.

---

## 🚀 Key Features

### 1. In-Browser Multi-Language IDE & Compiler Simulation
- Direct browser execution for **C, C++, Java, and Python**.
- Real-time syntax validation, execution timer, simulated memory profiling, and test cases runner (with public and hidden test cases).
- Integrated editor with line gutters, active line tracking, and customizable syntax themes.

### 2. AI Error Detection System (What • Why • How)
- Translates cryptic compiler errors (e.g. `SIGSEGV`, `IndexOutOfBoundsException`, `IndentationError`) into an actionable 3-part diagnostic:
  1. 🔴 **What Went Wrong**: Highlights the exact line and token causing the error.
  2. 💡 **Why It Occurred**: Explains the underlying computer science concept and mental misconception.
  3. 🛠️ **How To Correct It**: Provides a side-by-side diff with a one-click **"Apply AI Fix"** button.

### 3. Multilingual AI Voice & Text Tutor (English • தமிழ் • Tanglish)
- **Voice-Enabled Doubt Clearance**: Students can speak or type their questions.
- **Natural Language Fluency**:
  - **Simple English**: Crisp, professional explanations for corporate interviews.
  - **தமிழ் (Tamil)**: Concept explanations in native Tamil.
  - **Tanglish**: The conversational blend of Tamil and English popular among engineering students, breaking down barriers and reducing learning anxiety.
- **Speech-to-Text (STT) & Text-to-Speech (TTS)**: Listens to voice queries with animated waveforms and reads answers aloud.

### 4. Interactive Line-by-Line Code Explainer
- Students can click any line in the code editor or select "Explain Line" to inspect its mechanical execution, variable mutations, and memory impact in English, Tamil, or Tanglish.

### 5. Progressive 3-Tier Hint System
- Fosters authentic algorithmic thinking rather than spoiler-copying:
  - **Tier 1 (Conceptual Nudge)**: Points in the right direction without mentioning code.
  - **Tier 2 (Algorithmic Blueprint)**: Outlines pseudo-logic or data structure selection ($O(N)$ Hash Map / Two Pointers).
  - **Tier 3 (Edge-Case & Structural Guard)**: Details specific boundary checks ($N=0$, negative indices).

### 6. Repeated Mistake Learning System & Remedial Lab
- When a student commits the same misconception $\ge 2$ times (e.g. `i <= n` array bounds or unhandled negative values):
  - Automatically flags the recurring gap and triggers an active **Remedial Practice Module**.
  - Includes **Visual Memory Animations**, **Concept Teardown**, **Spot-the-Bug Micro-Drills**, and **Targeted Reassessments**.
  - Successfully completing the drill clears the weakness badge, boosts placement readiness, and awards ACET Skill Coins!

### 7. Placement Readiness & AI Skill Matrix
- Real-time **Hexagonal / Radar Skill Chart** assessing:
  - *Syntax & Fluency*
  - *Algorithmic Logic*
  - *Complexity Awareness*
  - *Edge Case Handling*
  - *Memory Management*
  - *Debugging Recovery*
- Placement Preparedness Gauge benchmarked against company hiring bars (**TCS NQT**, **Infosys DSE**, **Zoho Technical**, **Amazon SDE**).

### 8. Interactive Algorithm & Data Structure Visualizer
- Visual canvas with step-by-step animations for:
  - **Two Pointers**: Container With Most Water
  - **Binary Search**: Divide & Conquer
  - **Bubble Sort**: Adjacent Swaps
  - **Stack Operations**: Balanced Parentheses Validator
- Features Play, Pause, Step Next, Step Back, Reset, and Speed Slider controls.

---

## 📁 Project Architecture

```
d:\team ACET\
├── index.html                  # Master Single-Page Application
├── assets/                     # Platform graphics & generated visual assets
│   ├── hero_banner.jpg
│   └── diagnostic_banner.jpg
├── css/
│   ├── style.css               # Design tokens, typography, glassmorphism, responsive grid
│   ├── editor.css              # IDE styling, gutters, terminal, 3-part error cards
│   ├── ai-tutor.css            # Voice chatbot, waveforms, line explainer drawer
│   ├── visualizer.css          # Algorithm animations, pointer markers, stack models
│   └── dashboard.css           # Skill radar, placement gauge, remedial alerts
├── js/
│   ├── app.js                  # Application initialization & event router
│   ├── state.js                # Reactive state store with LocalStorage persistence
│   ├── curriculum.js           # Problem database (C, C++, Java, Python, DSA, Placement)
│   ├── compiler.js             # Browser compiler engine & test execution runner
│   ├── ai-error-detector.js    # 3-part What-Why-How error diagnostic engine
│   ├── ai-tutor.js             # Multilingual tutor brain with Web Speech API (STT/TTS)
│   ├── line-explainer.js       # Interactive line-by-line code logic explainer
│   ├── hint-system.js          # 3-Tier progressive hint controller
│   ├── mistake-detector.js     # Repeated mistake tracking & remedial lab engine
│   ├── algorithm-visualizer.js # Real-time interactive algorithm animator
│   └── ui.js                   # UI rendering, canvas radar charts, sound synthesizer
└── README.md                   # Complete documentation
```

---

## 💻 How to Run Locally

### Option 1: Direct Browser Launch
Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Brave).

### Option 2: Live Server (VS Code / Antigravity IDE)
Right-click `index.html` and select **"Open with Live Server"**.

### Option 3: Python Built-In HTTP Server (if installed)
```bash
python -m http.server 8000
```
Open `http://localhost:8000` in your browser.

---

## 👥 Credits
Developed with ❤️ for **Team ACET**.
Accelerating student potential from zero-foundation to placement ready!
