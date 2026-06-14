import type { EnglishLevel } from '../app/profileAssessment';
import { cardsPerDeckForLevel } from '../app/profileAssessment';
import type { Flashcard, FlashcardDeck, FlashcardLiteral } from './types';

export type ScenarioGeneratorInput = {
  job: string;
  goal: string;
  scenario: string;
  englishLevel?: EnglishLevel;
  professionCategory?: string;
};

type CardTemplate = FlashcardLiteral;

const HEALTHCARE_TEMPLATES: CardTemplate[] = [
  {
    term: 'Vital signs',
    def: 'Basic measurements such as blood pressure, pulse, and temperature.',
    ex: '"I\'ll check your vital signs before the provider sees you."',
    context: 'You prepare a patient before a renal follow-up visit.',
  },
  {
    term: 'Follow-up labs',
    def: 'Blood tests scheduled to monitor progress after treatment.',
    ex: '"Let\'s schedule follow-up labs in two weeks."',
    context: 'You discuss creatinine trends with a concerned patient.',
  },
  {
    term: 'Side effects',
    def: 'Unwanted symptoms caused by medication or treatment.',
    ex: '"Have you noticed any side effects since starting the new dose?"',
    context: 'You review medication changes during a consultation.',
  },
  {
    term: 'Referral',
    def: 'Sending a patient to a specialist for additional care.',
    ex: '"I\'ll put in a referral to nephrology today."',
    context: 'You coordinate care when kidney function declines.',
  },
  {
    term: 'Informed consent',
    def: 'Explaining risks and benefits before a patient agrees to treatment.',
    ex: '"I want to make sure you understand the procedure before we proceed."',
    context: 'You prepare a patient for a biopsy discussion.',
  },
  {
    term: 'Care plan',
    def: 'A structured outline of treatment steps and goals.',
    ex: '"Here\'s the care plan we\'ll adjust based on your next labs."',
    context: 'You summarize next steps at the end of the visit.',
  },
];

const CONSTRUCTION_TEMPLATES: CardTemplate[] = [
  {
    term: 'Load-bearing',
    def: 'Supporting structural weight from floors or roof above.',
    ex: '"We cannot cut that wall until we confirm it\'s not load-bearing."',
    context: 'A subcontractor asks to start demolition early.',
  },
  {
    term: 'Punch list',
    def: 'Outstanding tasks that must be finished before closeout.',
    ex: '"I\'ll add the scaffolding issue to the punch list."',
    context: 'You track safety items during a walkthrough.',
  },
  {
    term: 'Sign-off',
    def: 'Formal approval that work meets spec or safety requirements.',
    ex: '"We need the engineer\'s sign-off before we proceed."',
    context: 'You halt work pending structural review.',
  },
  {
    term: 'OSHA compliance',
    def: 'Meeting federal workplace safety standards on site.',
    ex: '"Let\'s verify OSHA compliance on fall protection first."',
    context: 'You inspect tags before crews go aloft.',
  },
  {
    term: 'Subcontractor',
    def: 'An outside company hired to perform part of the project.',
    ex: '"The subcontractor must follow our site safety briefing."',
    context: 'You coordinate trades on a tight schedule.',
  },
];

const JANITORIAL_TEMPLATES: CardTemplate[] = [
  {
    term: 'Contact time',
    def: 'How long disinfectant must remain wet to kill pathogens.',
    ex: '"The contact time for this solution is ten minutes."',
    context: 'You respond to a spill in a clinical wing.',
  },
  {
    term: 'Biohazard kit',
    def: 'Supplies used to clean blood or infectious material safely.',
    ex: '"I\'ll grab the biohazard kit and cordon off the area."',
    context: 'A supervisor reports an OR suite spill.',
  },
  {
    term: 'PPE',
    def: 'Personal protective equipment worn to reduce exposure risk.',
    ex: '"I\'ll don PPE before I start sanitizing."',
    context: 'You follow protocol before entering a contaminated zone.',
  },
  {
    term: 'Sanitization protocol',
    def: 'Written steps for cleaning and disinfecting a space.',
    ex: '"I\'m following the full sanitization protocol for this spill."',
    context: 'You explain your plan to the charge nurse.',
  },
  {
    term: 'Dwell time',
    def: 'The period a chemical must sit before wiping or rinsing.',
    ex: '"We wait until dwell time passes before running the buffer."',
    context: 'You prevent premature mechanical cleaning.',
  },
];

const AGRICULTURE_TEMPLATES: CardTemplate[] = [
  {
    term: 'Crop rotation',
    def: 'Planting different crops in sequence to protect soil health.',
    ex: '"We\'ll adjust crop rotation if the rain window shifts."',
    context: 'You plan field work around weather changes.',
  },
  {
    term: 'Irrigation schedule',
    def: 'A timetable for when fields receive water.',
    ex: '"Let\'s revise the irrigation schedule before spraying."',
    context: 'You balance water use with pesticide timing.',
  },
  {
    term: 'Pesticide drift',
    def: 'Chemical spray carried by wind onto unintended areas.',
    ex: '"Wind speeds are too high—we risk pesticide drift."',
    context: 'You delay application for safety.',
  },
  {
    term: 'Harvest yield',
    def: 'The amount of crop produced in a season or field.',
    ex: '"I\'ll check harvest yield projections before we commit."',
    context: 'You decide whether to spray before rain.',
  },
  {
    term: 'Application window',
    def: 'A safe period when weather allows field treatments.',
    ex: '"Today\'s application window closes at four o\'clock."',
    context: 'You coordinate crew timing with the forecast.',
  },
];

const BUSINESS_TEMPLATES: CardTemplate[] = [
  {
    term: 'Stakeholder',
    def: 'A person with interest or authority in a project outcome.',
    ex: '"I\'ll loop in the key stakeholder before we finalize."',
    context: 'You align teams before a client meeting.',
  },
  {
    term: 'Action items',
    def: 'Specific tasks assigned after a meeting.',
    ex: '"Let me recap the action items from yesterday."',
    context: 'You clarify responsibilities on a call.',
  },
  {
    term: 'Timeline',
    def: 'The schedule of milestones and deadlines.',
    ex: '"Can we adjust the timeline if the permit is delayed?"',
    context: 'You negotiate project dates with a partner.',
  },
  {
    term: 'Scope',
    def: 'The defined boundaries of what work includes.',
    ex: '"That change is outside the original scope."',
    context: 'You manage expectations during a renovation project.',
  },
  {
    term: 'Follow up',
    def: 'To check back after an earlier conversation.',
    ex: '"I\'ll follow up once legal reviews the contract."',
    context: 'You close a meeting with clear next steps.',
  },
];

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
  const blob = `${input.job} ${input.goal} ${input.scenario} ${input.professionCategory ?? ''}`.toLowerCase();

  if (
    blob.includes('renal') ||
    blob.includes('patient') ||
    blob.includes('clinical') ||
    blob.includes('health') ||
    blob.includes('nurs') ||
    blob.includes('doctor') ||
    input.professionCategory === 'healthcare'
  ) {
    return HEALTHCARE_TEMPLATES;
  }
  if (
    blob.includes('janitor') ||
    blob.includes('clean') ||
    blob.includes('sanit') ||
    blob.includes('ppe') ||
    blob.includes('spill')
  ) {
    return JANITORIAL_TEMPLATES;
  }
  if (blob.includes('construct') || blob.includes('jobsite') || blob.includes('osha') || blob.includes('scaffold') || blob.includes('load-bearing') || blob.includes('foreman')) {
    return CONSTRUCTION_TEMPLATES;
  }
  if (input.professionCategory === 'business') {
    return BUSINESS_TEMPLATES;
  }
  if (
    blob.includes('farm') ||
    blob.includes('crop') ||
    blob.includes('irrigation') ||
    blob.includes('pesticide') ||
    blob.includes('harvest') ||
    blob.includes('agri')
  ) {
    return AGRICULTURE_TEMPLATES;
  }
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
  if (input.professionCategory === 'education') {
    return BUSINESS_TEMPLATES.map((t) => ({
      ...t,
      context: t.context.replace('meeting', 'parent conference'),
    }));
  }
  return GENERIC_TEMPLATES.map((template) => ({
    ...template,
    context: template.context.replace('a new situation', input.scenario.toLowerCase()),
  }));
}

function pickCardCount(input: ScenarioGeneratorInput): number {
  const templates = detectTemplateSet(input);
  const levelCount = cardsPerDeckForLevel(input.englishLevel);
  const hash = `${input.job}${input.goal}${input.scenario}`.length;
  const variant = hash % 2;
  return Math.min(templates.length, Math.max(4, levelCount + variant));
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
  const count = pickCardCount(input);
  const scenarioSource = scenario || goal;

  return {
    id: deckId,
    titleKey: 'flash.gen.customDeckTitle',
    descKey: 'flash.gen.customDeckDesc',
    scenarioKey: 'profile.scenario.def2',
    scenarioLabelKey: 'flash.scenarioLabel.def2',
    professionCategory: 'custom',
    professionLabelKey: 'flash.prof.general',
    practiceScenarioId: mapPracticeSlug(input),
    isGenerated: true,
    personalized: true,
    displayTitle: `${scenario} Deck`,
    displayDesc: goal,
    displayProfessionLabel: job,
    displayScenarioLabel: scenario,
    cards: buildCards(templates, count, deckId, scenarioSource),
  };
}

function mapPracticeSlug(input: ScenarioGeneratorInput): string {
  const blob = `${input.job} ${input.scenario} ${input.professionCategory ?? ''}`.toLowerCase();
  if (blob.includes('clean') || blob.includes('janitor') || blob.includes('sanit') || blob.includes('spill')) return 'hos2';
  if (blob.includes('construct') || blob.includes('osha') || blob.includes('scaffold')) return 'hos3';
  if (blob.includes('farm') || blob.includes('crop') || blob.includes('pesticide') || blob.includes('harvest')) return 'hos4';
  return 'hos1';
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
