import type { Flashcard, FlashcardDeck, FlashcardLiteral } from './types';

export type ScenarioGeneratorInput = {
  job: string;
  goal: string;
  scenario: string;
};

type CardTemplate = FlashcardLiteral;

const RESTAURANT_RESERVATION_TEMPLATES: CardTemplate[] = [
  {
    term: 'Modify reservation',
    def: 'To change the date, time, or size of an existing booking.',
    ex: '"I\'d be happy to modify your reservation for Saturday evening."',
    context: 'A guest calls to move their table from 7 PM to 8:30 PM.',
  },
  {
    term: 'Party size',
    def: 'The number of people in a dining group.',
    ex: '"May I confirm the party size for your reservation?"',
    context: 'The host updates the book when two extra guests join the party.',
  },
  {
    term: 'Availability',
    def: 'Which tables or time slots are open for booking.',
    ex: '"We have availability at six-thirty or nine o\'clock."',
    context: 'You check the floor plan before offering alternate times.',
  },
  {
    term: 'Confirmation number',
    def: 'A reference code that verifies a guest\'s booking.',
    ex: '"Could I have your confirmation number, please?"',
    context: 'You locate the reservation in the system during a busy shift.',
  },
  {
    term: 'Special request',
    def: 'A note about allergies, seating, or occasion needs.',
    ex: '"Do you have any special requests for the table?"',
    context: 'A guest mentions a birthday celebration and a nut allergy.',
  },
  {
    term: 'Waitlist',
    def: 'A queue for guests when no tables are available yet.',
    ex: '"I can add you to the waitlist and text you when a table opens."',
    context: 'The dining room is full but guests are willing to wait nearby.',
  },
  {
    term: 'Hold the table',
    def: 'To reserve a table briefly while the guest is on the way.',
    ex: '"We can hold the table for ten minutes if you\'re running late."',
    context: 'A regular calls to say they are stuck in traffic.',
  },
  {
    term: 'Cancellation policy',
    def: 'Rules about canceling or changing a booking without a fee.',
    ex: '"Our cancellation policy requires twenty-four hours\' notice."',
    context: 'A corporate client asks about a large-party cancellation.',
  },
];

const GENERIC_TEMPLATES: CardTemplate[] = [
  {
    term: 'Clarify the request',
    def: 'Ask questions so you fully understand what the person needs.',
    ex: '"Just to clarify, you\'d like to change the original plan—is that right?"',
    context: 'You repeat back details before taking action in a new situation.',
  },
  {
    term: 'Walk me through',
    def: 'Invite someone to explain steps or details one at a time.',
    ex: '"Could you walk me through what happened yesterday?"',
    context: 'You gather context before responding in an unfamiliar scenario.',
  },
  {
    term: 'On my end',
    def: 'From your side of the situation or responsibility.',
    ex: '"On my end, I can update the schedule by this afternoon."',
    context: 'You explain what you can control while coordinating with others.',
  },
  {
    term: 'Follow up',
    def: 'To check back after an earlier conversation or action.',
    ex: '"I\'ll follow up with you once I have an update."',
    context: 'You promise to reconnect after confirming details with a supervisor.',
  },
  {
    term: 'Best option',
    def: 'The most suitable choice given the constraints.',
    ex: '"The best option right now would be to reschedule for Tuesday."',
    context: 'You recommend a path forward after weighing alternatives.',
  },
  {
    term: 'Let me check',
    def: 'Buy time while you verify information accurately.',
    ex: '"Let me check that and get back to you in a moment."',
    context: 'You avoid guessing when policy or availability is unclear.',
  },
  {
    term: 'Does that work',
    def: 'Confirm that a proposed plan is acceptable.',
    ex: '"We can move it to Thursday at noon—does that work for you?"',
    context: 'You close the conversation by confirming agreement.',
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

function detectTemplateSet(input: ScenarioGeneratorInput): CardTemplate[] {
  const blob = `${input.job} ${input.goal} ${input.scenario}`.toLowerCase();
  if (
    blob.includes('restaurant') ||
    blob.includes('server') ||
    blob.includes('reservation') ||
    blob.includes('dining') ||
    blob.includes('host') ||
    blob.includes('waiter') ||
    blob.includes('waitress')
  ) {
    return RESTAURANT_RESERVATION_TEMPLATES;
  }
  return GENERIC_TEMPLATES.map((template) => ({
    ...template,
    context: template.context.replace('a new situation', input.scenario.toLowerCase()),
  }));
}

function pickCardCount(input: ScenarioGeneratorInput): number {
  const hash = `${input.job}${input.goal}${input.scenario}`.length;
  return 5 + (hash % 6);
}

function buildCards(templates: CardTemplate[], count: number, deckId: string, scenarioSource: string): Flashcard[] {
  const selected = templates.slice(0, count);
  while (selected.length < count && templates.length > 0) {
    selected.push(templates[selected.length % templates.length]);
  }

  return selected.map((template, index) => ({
    id: `${deckId}-c${index + 1}`,
    termKey: 'flash.gen.placeholder',
    defKey: 'flash.gen.placeholder',
    exKey: 'flash.gen.placeholder',
    contextKey: 'flash.gen.placeholder',
    literal: {
      ...template,
      context: template.context.includes(scenarioSource) ? template.context : `${template.context} (${scenarioSource})`,
    },
    tags: ['generated'],
  }));
}

export function buildGeneratedDeck(input: ScenarioGeneratorInput): FlashcardDeck {
  const job = input.job.trim();
  const goal = input.goal.trim();
  const scenario = input.scenario.trim();
  const deckId = `gen-${slugify(scenario || goal || job)}-${Date.now()}`;
  const templates = detectTemplateSet(input);
  const count = Math.min(pickCardCount(input), templates.length);
  const scenarioSource = scenario || goal;

  return {
    id: deckId,
    titleKey: 'flash.gen.customDeckTitle',
    descKey: 'flash.gen.customDeckDesc',
    scenarioKey: 'profile.scenario.def2',
    scenarioLabelKey: 'flash.scenarioLabel.def2',
    professionCategory: 'custom',
    professionLabelKey: 'flash.prof.general',
    practiceScenarioId: 'customer',
    isGenerated: true,
    personalized: false,
    displayTitle: `${scenario} Deck`,
    displayDesc: goal,
    displayProfessionLabel: job,
    displayScenarioLabel: scenario,
    cards: buildCards(templates, count, deckId, scenarioSource),
  };
}

export const GENERATION_STEP_KEYS = [
  'flash.gen.step1',
  'flash.gen.step2',
  'flash.gen.step3',
  'flash.gen.step4',
] as const;

const STEP_MS = [720, 880, 760, 920];

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Simulates AI generation with staged progress updates. */
export async function mockGenerateScenarioDeck(
  input: ScenarioGeneratorInput,
  onStep: (stepIndex: number, stepKey: string) => void,
): Promise<FlashcardDeck> {
  for (let i = 0; i < GENERATION_STEP_KEYS.length; i += 1) {
    onStep(i, GENERATION_STEP_KEYS[i]);
    await delay(STEP_MS[i] ?? 800);
  }
  return buildGeneratedDeck(input);
}

const CUSTOM_DECKS_KEY = 'dialago-custom-decks-v1';

export function readCustomDecks(): FlashcardDeck[] {
  try {
    const raw = localStorage.getItem(CUSTOM_DECKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FlashcardDeck[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCustomDecks(decks: FlashcardDeck[]) {
  try {
    localStorage.setItem(CUSTOM_DECKS_KEY, JSON.stringify(decks));
  } catch {
    /* ignore */
  }
}

export function appendCustomDeck(deck: FlashcardDeck): FlashcardDeck[] {
  const next = [deck, ...readCustomDecks()].slice(0, 12);
  writeCustomDecks(next);
  return next;
}

export function clearCustomDecks() {
  try {
    localStorage.removeItem(CUSTOM_DECKS_KEY);
  } catch {
    /* ignore */
  }
}
