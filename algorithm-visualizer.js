/**
 * ACET CodeMentor AI - Interactive Algorithm & Data Structure Visualizer
 * Step-by-step animations for Two Pointers, Binary Search, Sorting, and Stacks.
 */

class AlgorithmVisualizer {
  constructor() {
    this.currentAlgorithm = 'two-pointers';
    this.steps = [];
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.playTimer = null;
    this.speedMs = 700;
  }

  init() {
    this.loadAlgorithm(this.currentAlgorithm);
  }

  loadAlgorithm(algoName) {
    this.currentAlgorithm = algoName;
    this.pause();
    this.currentStepIndex = 0;

    if (algoName === 'two-pointers') {
      this.initTwoPointers();
    } else if (algoName === 'binary-search') {
      this.initBinarySearch();
    } else if (algoName === 'bubble-sort') {
      this.initBubbleSort();
    } else if (algoName === 'stack-ops') {
      this.initStackOps();
    }

    this.renderCurrentStep();
  }

  initTwoPointers() {
    // Array: Container with most water
    const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    this.steps = [];

    let left = 0;
    let right = heights.length - 1;
    let maxArea = 0;

    this.steps.push({
      type: 'array',
      data: [...heights],
      left: left,
      right: right,
      comparing: [left, right],
      description: `Initial state: Left pointer at index 0 (h=${heights[left]}), Right pointer at index ${right} (h=${heights[right]}).`,
      complexity: "Time: O(N) | Space: O(1)"
    });

    while (left < right) {
      const width = right - left;
      const h = Math.min(heights[left], heights[right]);
      const area = width * h;
      maxArea = Math.max(maxArea, area);

      this.steps.push({
        type: 'array',
        data: [...heights],
        left: left,
        right: right,
        comparing: [left, right],
        description: `Comparing walls at ${left} and ${right}. Min height = ${h}, Width = ${width}. Area = ${area}. Max Area so far = ${maxArea}.`,
        complexity: "Time: O(N) | Space: O(1)"
      });

      if (heights[left] < heights[right]) {
        left++;
        this.steps.push({
          type: 'array',
          data: [...heights],
          left: left,
          right: right,
          comparing: [left],
          description: `Left wall was shorter (${heights[left-1]} < ${heights[right]}). Shifting left pointer to index ${left} to seek a taller wall.`,
          complexity: "Time: O(N) | Space: O(1)"
        });
      } else {
        right--;
        this.steps.push({
          type: 'array',
          data: [...heights],
          left: left,
          right: right,
          comparing: [right],
          description: `Right wall was shorter or equal. Shifting right pointer to index ${right} to seek a taller wall.`,
          complexity: "Time: O(N) | Space: O(1)"
        });
      }
    }

    this.steps.push({
      type: 'array',
      data: [...heights],
      left: left,
      right: right,
      comparing: [],
      description: `Search complete! Pointers met. Global Maximum Water Area = ${maxArea}.`,
      complexity: "Time: O(N) | Space: O(1)"
    });
  }

  initBinarySearch() {
    const arr = [12, 24, 32, 45, 57, 68, 79, 88, 95];
    const target = 68;
    this.steps = [];

    let low = 0;
    let high = arr.length - 1;

    this.steps.push({
      type: 'array',
      data: [...arr],
      left: low,
      right: high,
      mid: Math.floor((low + high) / 2),
      comparing: [],
      description: `Target = ${target}. Initial search bounds: low = 0, high = ${high}.`,
      complexity: "Time: O(log N) | Space: O(1)"
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      this.steps.push({
        type: 'array',
        data: [...arr],
        left: low,
        right: high,
        mid: mid,
        comparing: [mid],
        description: `Checking midpoint: arr[${mid}] = ${arr[mid]}. Target is ${target}.`,
        complexity: "Time: O(log N) | Space: O(1)"
      });

      if (arr[mid] === target) {
        this.steps.push({
          type: 'array',
          data: [...arr],
          left: mid,
          right: mid,
          mid: mid,
          sortedIndices: [mid],
          description: `🎯 Match found! Target ${target} located at index ${mid}.`,
          complexity: "Time: O(log N) | Space: O(1)"
        });
        break;
      } else if (arr[mid] < target) {
        low = mid + 1;
        this.steps.push({
          type: 'array',
          data: [...arr],
          left: low,
          right: high,
          mid: mid,
          description: `${arr[mid]} < ${target}. Discarding left half. New low = ${low}.`,
          complexity: "Time: O(log N) | Space: O(1)"
        });
      } else {
        high = mid - 1;
        this.steps.push({
          type: 'array',
          data: [...arr],
          left: low,
          right: high,
          mid: mid,
          description: `${arr[mid]} > ${target}. Discarding right half. New high = ${high}.`,
          complexity: "Time: O(log N) | Space: O(1)"
        });
      }
    }
  }

  initBubbleSort() {
    const arr = [42, 18, 77, 23, 61, 9];
    this.steps = [];
    const n = arr.length;
    const a = [...arr];

    this.steps.push({
      type: 'array',
      data: [...a],
      comparing: [],
      description: "Initial unsorted array before Bubble Sort.",
      complexity: "Time: O(N^2) | Space: O(1)"
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        this.steps.push({
          type: 'array',
          data: [...a],
          comparing: [j, j + 1],
          description: `Comparing arr[${j}] (${a[j]}) and arr[${j+1}] (${a[j+1]}).`,
          complexity: "Time: O(N^2) | Space: O(1)"
        });

        if (a[j] > a[j + 1]) {
          const temp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = temp;

          this.steps.push({
            type: 'array',
            data: [...a],
            swapping: [j, j + 1],
            description: `Swapped: ${a[j + 1]} was greater than ${a[j]}. Bubbling up larger element.`,
            complexity: "Time: O(N^2) | Space: O(1)"
          });
        }
      }
    }

    this.steps.push({
      type: 'array',
      data: [...a],
      sortedIndices: [0, 1, 2, 3, 4, 5],
      description: "Array is completely sorted!",
      complexity: "Time: O(N^2) | Space: O(1)"
    });
  }

  initStackOps() {
    this.steps = [
      { type: 'stack', items: [], description: "Initial Empty Stack (Top = null)." },
      { type: 'stack', items: ["'('"], description: "Pushing opening parenthesis '(' onto stack." },
      { type: 'stack', items: ["'('", "'['"], description: "Pushing opening bracket '[' onto stack." },
      { type: 'stack', items: ["'('", "'['", "'{'"], description: "Pushing opening brace '{' onto stack." },
      { type: 'stack', items: ["'('", "'['"], description: "Encountered '}'. Popped top matching brace '{'." },
      { type: 'stack', items: ["'('"], description: "Encountered ']'. Popped top matching bracket '['." },
      { type: 'stack', items: [], description: "Encountered ')'. Popped top matching parenthesis '('. Stack is empty -> Valid sequence!" }
    ];
  }

  renderCurrentStep() {
    const stage = document.getElementById('visualizer-stage-canvas');
    const descEl = document.getElementById('visualizer-step-desc');
    const compEl = document.getElementById('visualizer-step-complexity');
    if (!stage || this.steps.length === 0) return;

    const step = this.steps[this.currentStepIndex];

    if (descEl) descEl.innerHTML = `<span>⚡</span> <span>${step.description}</span>`;
    if (compEl) compEl.innerText = step.complexity || "Time: O(N)";

    if (step.type === 'array') {
      const maxVal = Math.max(...step.data, 1);
      stage.innerHTML = `
        <div class="array-render-box">
          ${step.data.map((val, idx) => {
            const heightPercent = Math.max(25, (val / maxVal) * 160);
            let stateClass = '';
            if (step.comparing && step.comparing.includes(idx)) stateClass = 'comparing';
            if (step.swapping && step.swapping.includes(idx)) stateClass = 'swapping';
            if (step.sortedIndices && step.sortedIndices.includes(idx)) stateClass = 'sorted';

            return `
              <div class="array-bar-column">
                <div class="array-bar ${stateClass}" style="height: ${heightPercent}px;">
                  ${val}
                </div>
                <span class="array-index-label">${idx}</span>
                ${step.left === idx ? `<div class="pointer-indicator" style="color:var(--secondary);">L</div>` : ''}
                ${step.right === idx ? `<div class="pointer-indicator" style="color:var(--accent-purple); bottom:-42px;">R</div>` : ''}
                ${step.mid === idx ? `<div class="pointer-indicator" style="color:var(--warning); bottom:-56px;">M</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (step.type === 'stack') {
      stage.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center;">
          <div class="stack-render-box">
            ${step.items.length === 0 ? '<div style="color:var(--text-muted); font-size:0.85rem; margin:auto;">Stack is Empty</div>' : ''}
            ${step.items.map(item => `
              <div class="stack-item">${item}</div>
            `).join('')}
          </div>
          <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--secondary); margin-top:0.75rem;">
            Stack Top: ${step.items.length > 0 ? step.items[step.items.length - 1] : 'null'}
          </div>
        </div>
      `;
    }
  }

  stepForward() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.renderCurrentStep();
    } else {
      this.pause();
    }
  }

  stepBack() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.renderCurrentStep();
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) playBtn.innerHTML = '⏸️';

    if (this.currentStepIndex >= this.steps.length - 1) {
      this.currentStepIndex = 0;
    }

    this.playTimer = setInterval(() => {
      if (this.currentStepIndex < this.steps.length - 1) {
        this.stepForward();
      } else {
        this.pause();
      }
    }, this.speedMs);
  }

  pause() {
    this.isPlaying = false;
    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) playBtn.innerHTML = '▶️';
  }

  reset() {
    this.pause();
    this.currentStepIndex = 0;
    this.renderCurrentStep();
  }

  setSpeed(val) {
    // val between 1 and 5
    this.speedMs = 1200 - (val * 200);
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }
}

window.algorithmVisualizer = new AlgorithmVisualizer();
