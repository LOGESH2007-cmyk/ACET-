/**
 * Code From Zero - Language Based Curriculum
 * Reorganized by Programming Language, with subtitles and practice problems.
 */

const CURRICULUM_DATA = [
  // ── C PROGRAMMING ──
  {
    id: "c-hello",
    title: "Hello World in C",
    language: "c",
    category: "C Programming",
    difficulty: "easy",
    description: "Write your first program to print 'Hello World' to the console in C.",
    examples: [
      { input: "(None)", output: "Hello World" }
    ],
    starterCode: `#include <stdio.h>\n\nint main() {\n    // Print Hello World here\n    \n    return 0;\n}`,
    testCases: [
      { input: "", expected: "Hello World", hidden: false }
    ],
    hints: [
      { tier: 1, title: "Function to use", text: "Use the `printf` function." },
      { tier: 2, title: "Exact syntax", text: "Write `printf(\"Hello World\");` inside main." }
    ],
    lineExplanations: {
      1: { en: "Includes standard I/O library for printf function." },
      3: { en: "The main function where execution begins." }
    },
    commonMisconception: "Forgetting semicolon",
    misconceptionKey: "c-semicolon"
  },
  {
    id: "c-variables",
    title: "Variables and Math",
    language: "c",
    category: "C Programming",
    difficulty: "easy",
    description: "Read two integers and print their sum.",
    examples: [
      { input: "3 5", output: "8" }
    ],
    starterCode: `#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    \n    // Calculate and print sum\n    \n    return 0;\n}`,
    testCases: [
      { input: "3 5", expected: "8", hidden: false },
      { input: "10 20", expected: "30", hidden: true }
    ],
    hints: [
      { tier: 1, title: "Sum logic", text: "Use `a + b` to calculate the sum." },
      { tier: 2, title: "Print format", text: "Use `%d` in `printf` to print an integer." }
    ],
    lineExplanations: {
      4: { en: "Reads two integers from standard input and stores them in a and b." }
    },
    commonMisconception: "Missing ampersand in scanf",
    misconceptionKey: "c-scanf-ampersand"
  },
  
  // ── PYTHON PROGRAMMING ──
  {
    id: "py-hello",
    title: "Hello World in Python",
    language: "python",
    category: "Python Programming",
    difficulty: "easy",
    description: "Write your first Python script to print 'Hello World'.",
    examples: [
      { input: "(None)", output: "Hello World" }
    ],
    starterCode: `# Print Hello World below\n`,
    testCases: [
      { input: "", expected: "Hello World", hidden: false }
    ],
    hints: [
      { tier: 1, title: "Function to use", text: "Use the built-in `print()` function." }
    ],
    lineExplanations: {},
    commonMisconception: "Using capital P in Print",
    misconceptionKey: "py-print-caps"
  },
  {
    id: "py-loops",
    title: "For Loops in Python",
    language: "python",
    category: "Python Programming",
    difficulty: "easy",
    description: "Print numbers from 1 to N using a for loop.",
    examples: [
      { input: "3", output: "1\\n2\\n3" }
    ],
    starterCode: `n = int(input())\n# Write a loop to print 1 to n\n`,
    testCases: [
      { input: "3", expected: "1\\n2\\n3", hidden: false },
      { input: "5", expected: "1\\n2\\n3\\n4\\n5", hidden: true }
    ],
    hints: [
      { tier: 1, title: "Range function", text: "Use `range(1, n + 1)`." }
    ],
    lineExplanations: {
      1: { en: "Reads input, converts it to an integer, and assigns it to n." }
    },
    commonMisconception: "Off by one in range",
    misconceptionKey: "py-range-end"
  },

  // ── DATA STRUCTURES & ALGORITHMS ──
  {
    id: "dsa-twosum",
    title: "Two Sum Target Finder",
    language: "python",
    category: "Data Structures & Algorithms",
    difficulty: "medium",
    description: "Given an array and a target, return indices of two numbers that add up to target.",
    examples: [
      { input: "nums=[2,7,11,15], target=9", output: "[0,1]" }
    ],
    starterCode: `def two_sum(nums, target):\n    # Write your O(N) hashmap solution here\n    pass\n`,
    testCases: [
      { input: "nums=[2,7,11,15], target=9", expected: "[0, 1]", hidden: false }
    ],
    hints: [
      { tier: 1, title: "Use a Dictionary", text: "Store the complement (target - num) in a dictionary as you iterate." }
    ],
    lineExplanations: {},
    commonMisconception: "O(N^2) instead of O(N)",
    misconceptionKey: "dsa-twosum-slow"
  }
];

const MODULE_CATEGORIES = [
  {
    id: "lang-c",
    name: "C Programming",
    icon: "⚙️",
    desc: "The mother of all languages. Build a strong foundation in memory and logic.",
    topics: [
      { title: "Introduction & Syntax", text: "Learn the basic structure of a C program. Understand the #include directives and the main function.", problemId: "c-hello" },
      { title: "Variables & Data Types", text: "Understand how C stores data in memory. Learn about int, float, char, and input/output functions like scanf and printf.", problemId: "c-variables" }
    ]
  },
  {
    id: "lang-python",
    name: "Python Programming",
    icon: "🐍",
    desc: "Simple, powerful, and versatile. Perfect for beginners and experts alike.",
    topics: [
      { title: "Python Basics", text: "Learn Python's elegant syntax. No semicolons or curly braces required!", problemId: "py-hello" },
      { title: "Control Flow", text: "Master loops and conditional statements in Python using indentation.", problemId: "py-loops" }
    ]
  },
  {
    id: "lang-java",
    name: "Java Programming",
    icon: "☕",
    desc: "Object-oriented programming language used heavily in enterprise software.",
    topics: [
      { title: "Coming Soon", text: "Java curriculum is under construction and will be added soon.", problemId: null }
    ]
  },
  {
    id: "lang-dsa",
    name: "Data Structures & Algorithms",
    icon: "🌳",
    desc: "Crack technical interviews by mastering core problem-solving techniques.",
    topics: [
      { title: "HashMaps & Optimization", text: "Learn to reduce O(N^2) time complexity to O(N) using HashMaps.", problemId: "dsa-twosum" }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.CURRICULUM_DATA = CURRICULUM_DATA;
  window.MODULE_CATEGORIES = MODULE_CATEGORIES;
}
