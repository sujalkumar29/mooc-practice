/**
 * Test fixture for verifying the MOOC Practice Quiz Engine.
 * 
 * NOTE: This fixture is kept isolated in the fixtures directory and is NOT part
 * of the official Wildlife Ecology educational question bank.
 * It provides sample questions across different topics to thoroughly verify:
 * - Option selection and highlighting
 * - Study Mode instant check and explanation reveals
 * - Exam Mode question palette, flagging, and timer
 * - Submission confirmation modal with answered/unanswered counts
 * - Scoring engine, accuracy calculation, and solutions review
 */

export const sampleQuizFixture = {
  id: 'fixture-quiz-engine',
  title: 'Quiz Engine Verification & Interactive Demo',
  description: 'A 5-question test fixture to demonstrate the platform quiz engine, study mode, exam mode, timer, and detailed solutions review.',
  questions: [
    {
      id: 'demo_q1',
      subjectId: 'demo',
      week: 1,
      question: 'Which of the following best describes the ecological concept of "Carrying Capacity" (K)?',
      options: [
        'The absolute maximum physical space available in a geographic biome',
        'The maximum population size of a species that an environment can sustain indefinitely without degradation',
        'The minimum number of individuals required to prevent inbreeding depression',
        'The total biomass of apex predators in a climax community'
      ],
      correctAnswer: 'B',
      explanation: 'Carrying capacity (K) represents the maximum equilibrium population size that an environment can sustain indefinitely given the available food, habitat, water, and other necessities.',
      marks: 1
    },
    {
      id: 'demo_q2',
      subjectId: 'demo',
      week: 1,
      question: 'In computer science and algorithms, what is the worst-case time complexity of standard Binary Search on a sorted array of size n?',
      options: [
        'O(1)',
        'O(n)',
        'O(log n)',
        'O(n log n)'
      ],
      correctAnswer: 'C',
      explanation: 'Binary search divides the sorted search space in half at each step, yielding a worst-case and average-case logarithmic time complexity of O(log n).',
      marks: 1
    },
    {
      id: 'demo_q3',
      subjectId: 'demo',
      week: 2,
      question: 'Which of the following database ACID properties guarantees that a transaction once committed will survive power failures and system crashes?',
      options: [
        'Atomicity',
        'Consistency',
        'Isolation',
        'Durability'
      ],
      correctAnswer: 'D',
      explanation: 'Durability ensures that once a transaction has been committed, it remains committed even in the event of a system crash, power loss, or OS failure, typically via Write-Ahead Logging (WAL).',
      marks: 1
    },
    {
      id: 'demo_q4',
      subjectId: 'demo',
      week: 2,
      question: 'What is the primary role of a "Keystone Species" within an ecological community?',
      options: [
        'It is always the most abundant and numerically dominant species in the ecosystem',
        'It exerts strong disproportionate control on community structure relative to its abundance or biomass',
        'It is an introduced alien species that displaces indigenous taxa',
        'It is an organism that reproduces strictly through vegetative propagation'
      ],
      correctAnswer: 'B',
      explanation: 'Robert Paine coined the term "Keystone Species" for organisms whose impact on their community or ecosystem is disproportionately large compared to their relative abundance or biomass.',
      marks: 1
    },
    {
      id: 'demo_q5',
      subjectId: 'demo',
      week: 3,
      question: 'In the OSI networking model, at which layer does the Internet Protocol (IP) operate?',
      options: [
        'Layer 2 — Data Link Layer',
        'Layer 3 — Network Layer',
        'Layer 4 — Transport Layer',
        'Layer 7 — Application Layer'
      ],
      correctAnswer: 'B',
      explanation: 'The Internet Protocol (IP, including IPv4 and IPv6) operates at Layer 3 (Network Layer), responsible for logical addressing and packet routing across networks.',
      marks: 1
    }
  ]
};
