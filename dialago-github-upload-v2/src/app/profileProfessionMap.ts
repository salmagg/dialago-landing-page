export type ProfessionMeta = {
  roleKey: string;
  category: string;
};

/** Exact normalized input (lowercase, trimmed) → role + scenario category */
export const EXACT_MANUAL_PROFESSION: Record<string, ProfessionMeta> = {
  // Agriculture
  agriculture: { roleKey: 'profile.role.agriculture', category: 'agriculture' },
  agricultural: { roleKey: 'profile.role.agriculture', category: 'agriculture' },
  farming: { roleKey: 'profile.role.agriculture', category: 'agriculture' },
  farmer: { roleKey: 'profile.role.farmer', category: 'agriculture' },
  farm: { roleKey: 'profile.role.agriculture', category: 'agriculture' },
  rancher: { roleKey: 'profile.role.farmer', category: 'agriculture' },
  agronomy: { roleKey: 'profile.role.agriculture', category: 'agriculture' },
  agronomist: { roleKey: 'profile.role.agriculture', category: 'agriculture' },

  // Construction
  construction: { roleKey: 'profile.role.construction', category: 'construction' },
  builder: { roleKey: 'profile.role.construction', category: 'construction' },
  contractor: { roleKey: 'profile.role.construction', category: 'construction' },
  carpenter: { roleKey: 'profile.role.carpenter', category: 'construction' },
  electrician: { roleKey: 'profile.role.electrician', category: 'construction' },
  plumber: { roleKey: 'profile.role.plumber', category: 'construction' },
  welder: { roleKey: 'profile.role.welder', category: 'construction' },
  foreman: { roleKey: 'profile.role.foreman', category: 'construction' },
  mason: { roleKey: 'profile.role.mason', category: 'construction' },
  roofer: { roleKey: 'profile.role.roofer', category: 'construction' },
  laborer: { roleKey: 'profile.role.construction', category: 'construction' },

  // Janitorial
  janitor: { roleKey: 'profile.role.janitorial', category: 'janitorial' },
  janitorial: { roleKey: 'profile.role.janitorial', category: 'janitorial' },
  cleaning: { roleKey: 'profile.role.janitorial', category: 'janitorial' },
  cleaner: { roleKey: 'profile.role.cleaner', category: 'janitorial' },
  custodian: { roleKey: 'profile.role.janitorial', category: 'janitorial' },
  custodial: { roleKey: 'profile.role.janitorial', category: 'janitorial' },
  housekeeping: { roleKey: 'profile.role.housekeeper', category: 'janitorial' },
  housekeeper: { roleKey: 'profile.role.housekeeper', category: 'janitorial' },
  sanitation: { roleKey: 'profile.role.janitorial', category: 'janitorial' },

  // Healthcare — specific
  nurse: { roleKey: 'profile.role.nurse', category: 'healthcare' },
  nursing: { roleKey: 'profile.role.nurse', category: 'healthcare' },
  rn: { roleKey: 'profile.role.nurse', category: 'healthcare' },
  lpn: { roleKey: 'profile.role.nurse', category: 'healthcare' },
  cna: { roleKey: 'profile.role.caregiver', category: 'healthcare' },
  caregiver: { roleKey: 'profile.role.caregiver', category: 'healthcare' },
  doctor: { roleKey: 'profile.role.doctor', category: 'healthcare' },
  physician: { roleKey: 'profile.role.doctor', category: 'healthcare' },
  surgeon: { roleKey: 'profile.role.doctor', category: 'healthcare' },
  dentist: { roleKey: 'profile.role.dentist', category: 'healthcare' },
  dental: { roleKey: 'profile.role.dentist', category: 'healthcare' },
  pharmacist: { roleKey: 'profile.role.pharmacist', category: 'healthcare' },
  pharmacy: { roleKey: 'profile.role.pharmacist', category: 'healthcare' },
  therapist: { roleKey: 'profile.role.therapist', category: 'healthcare' },
  paramedic: { roleKey: 'profile.role.paramedic', category: 'healthcare' },
  emt: { roleKey: 'profile.role.paramedic', category: 'healthcare' },
  healthcare: { roleKey: 'profile.role.healthcare', category: 'healthcare' },
  medical: { roleKey: 'profile.role.healthcare', category: 'healthcare' },
  hospital: { roleKey: 'profile.role.healthcare', category: 'healthcare' },
  clinical: { roleKey: 'profile.role.healthcare', category: 'healthcare' },
  clinic: { roleKey: 'profile.role.healthcare', category: 'healthcare' },

  // Hospitality — specific
  hospitality: { roleKey: 'profile.role.hospitality', category: 'hospitality' },
  restaurant: { roleKey: 'profile.role.server', category: 'hospitality' },
  server: { roleKey: 'profile.role.server', category: 'hospitality' },
  waiter: { roleKey: 'profile.role.server', category: 'hospitality' },
  waitress: { roleKey: 'profile.role.server', category: 'hospitality' },
  host: { roleKey: 'profile.role.host', category: 'hospitality' },
  hostess: { roleKey: 'profile.role.host', category: 'hospitality' },
  barista: { roleKey: 'profile.role.barista', category: 'hospitality' },
  chef: { roleKey: 'profile.role.chef', category: 'hospitality' },
  cook: { roleKey: 'profile.role.chef', category: 'hospitality' },
  kitchen: { roleKey: 'profile.role.chef', category: 'hospitality' },
  hotel: { roleKey: 'profile.role.hotel', category: 'hospitality' },
  bartender: { roleKey: 'profile.role.bartender', category: 'hospitality' },
  receptionist: { roleKey: 'profile.role.receptionist', category: 'hospitality' },

  // Business — specific
  business: { roleKey: 'profile.role.business', category: 'business' },
  sales: { roleKey: 'profile.role.sales', category: 'business' },
  salesperson: { roleKey: 'profile.role.sales', category: 'business' },
  marketing: { roleKey: 'profile.role.marketing', category: 'business' },
  marketer: { roleKey: 'profile.role.marketing', category: 'business' },
  manager: { roleKey: 'profile.role.manager', category: 'business' },
  supervisor: { roleKey: 'profile.role.manager', category: 'business' },
  accountant: { roleKey: 'profile.role.accountant', category: 'business' },
  accounting: { roleKey: 'profile.role.accountant', category: 'business' },
  finance: { roleKey: 'profile.role.accountant', category: 'business' },
  consultant: { roleKey: 'profile.role.consultant', category: 'business' },
  analyst: { roleKey: 'profile.role.analyst', category: 'business' },
  engineer: { roleKey: 'profile.role.engineer', category: 'business' },
  developer: { roleKey: 'profile.role.engineer', category: 'business' },
  programmer: { roleKey: 'profile.role.engineer', category: 'business' },
  lawyer: { roleKey: 'profile.role.lawyer', category: 'business' },
  attorney: { roleKey: 'profile.role.lawyer', category: 'business' },
  legal: { roleKey: 'profile.role.lawyer', category: 'business' },
  admin: { roleKey: 'profile.role.admin', category: 'business' },
  administrative: { roleKey: 'profile.role.admin', category: 'business' },
  secretary: { roleKey: 'profile.role.admin', category: 'business' },
  office: { roleKey: 'profile.role.admin', category: 'business' },
  hr: { roleKey: 'profile.role.hr', category: 'business' },
  recruiter: { roleKey: 'profile.role.hr', category: 'business' },
  client: { roleKey: 'profile.role.business', category: 'business' },

  // Education — specific
  education: { roleKey: 'profile.role.education', category: 'education' },
  teacher: { roleKey: 'profile.role.teacher', category: 'education' },
  educator: { roleKey: 'profile.role.teacher', category: 'education' },
  professor: { roleKey: 'profile.role.professor', category: 'education' },
  instructor: { roleKey: 'profile.role.teacher', category: 'education' },
  tutor: { roleKey: 'profile.role.tutor', category: 'education' },
  principal: { roleKey: 'profile.role.principal', category: 'education' },
  faculty: { roleKey: 'profile.role.professor', category: 'education' },
  school: { roleKey: 'profile.role.teacher', category: 'education' },
  student: { roleKey: 'profile.role.student', category: 'education' },

  // Logistics & trades
  driver: { roleKey: 'profile.role.driver', category: 'business' },
  trucking: { roleKey: 'profile.role.driver', category: 'business' },
  warehouse: { roleKey: 'profile.role.warehouse', category: 'business' },
  logistics: { roleKey: 'profile.role.warehouse', category: 'business' },
  retail: { roleKey: 'profile.role.retail', category: 'business' },
  cashier: { roleKey: 'profile.role.retail', category: 'business' },
  mechanic: { roleKey: 'profile.role.mechanic', category: 'construction' },
  technician: { roleKey: 'profile.role.technician', category: 'business' },
  tech: { roleKey: 'profile.role.technician', category: 'business' },
  security: { roleKey: 'profile.role.security', category: 'business' },
  guard: { roleKey: 'profile.role.security', category: 'business' },
};

/** Pattern match on normalized text — most specific entries first */
export const PATTERN_MANUAL_PROFESSION: Array<{ match: RegExp; roleKey: string; category: string }> = [
  // Healthcare
  { match: /\b(registered nurse|nurse practitioner|nursing|nurses?|rn\b|lpn\b|cna\b)\b/i, roleKey: 'profile.role.nurse', category: 'healthcare' },
  { match: /\b(doctors?|physicians?|surgeons?|md\b)\b/i, roleKey: 'profile.role.doctor', category: 'healthcare' },
  { match: /\b(dentists?|dental\s+(hygienist|assistant))\b/i, roleKey: 'profile.role.dentist', category: 'healthcare' },
  { match: /\b(pharmacists?|pharmacy\s+tech)\b/i, roleKey: 'profile.role.pharmacist', category: 'healthcare' },
  { match: /\b(caregivers?|home\s+health)\b/i, roleKey: 'profile.role.caregiver', category: 'healthcare' },
  { match: /\b(paramedics?|emt\b|emergency\s+medical)\b/i, roleKey: 'profile.role.paramedic', category: 'healthcare' },
  { match: /\b(physical|occupational|speech)\s+therapists?\b/i, roleKey: 'profile.role.therapist', category: 'healthcare' },
  { match: /\b(healthcare|health\s+care|medical|hospital|clinical|clinic)\b/i, roleKey: 'profile.role.healthcare', category: 'healthcare' },

  // Education
  { match: /\b(professors?|lecturers?|faculty)\b/i, roleKey: 'profile.role.professor', category: 'education' },
  { match: /\b(teachers?|teaching|educators?|instructors?)\b/i, roleKey: 'profile.role.teacher', category: 'education' },
  { match: /\b(tutors?|tutoring)\b/i, roleKey: 'profile.role.tutor', category: 'education' },
  { match: /\b(principals?|school\s+admin)\b/i, roleKey: 'profile.role.principal', category: 'education' },
  { match: /\b(students?|undergrad|graduate\s+student)\b/i, roleKey: 'profile.role.student', category: 'education' },
  { match: /\b(education|school|classroom|academic)\b/i, roleKey: 'profile.role.education', category: 'education' },

  // Hospitality
  { match: /\b(restaurant\s+servers?|food\s+servers?|waiters?|waitresses?|servers?)\b/i, roleKey: 'profile.role.server', category: 'hospitality' },
  { match: /\b(baristas?|coffee\s+shop)\b/i, roleKey: 'profile.role.barista', category: 'hospitality' },
  { match: /\b(chefs?|cooks?|line\s+cook|kitchen\s+staff)\b/i, roleKey: 'profile.role.chef', category: 'hospitality' },
  { match: /\b(bartenders?|mixologists?)\b/i, roleKey: 'profile.role.bartender', category: 'hospitality' },
  { match: /\b(hotel\s+housekeeping|hotel\s+staff|hotels?|hospitality)\b/i, roleKey: 'profile.role.hotel', category: 'hospitality' },
  { match: /\b(hosts?|hostesses?|greeters?)\b/i, roleKey: 'profile.role.host', category: 'hospitality' },
  { match: /\b(receptionists?|reception)\b/i, roleKey: 'profile.role.receptionist', category: 'hospitality' },
  { match: /\b(restaurants?|hotels?|hospitality)\b/i, roleKey: 'profile.role.hospitality', category: 'hospitality' },

  // Construction
  { match: /\b(electricians?|electrical)\b/i, roleKey: 'profile.role.electrician', category: 'construction' },
  { match: /\b(plumbers?|plumbing)\b/i, roleKey: 'profile.role.plumber', category: 'construction' },
  { match: /\b(carpenters?|carpentry)\b/i, roleKey: 'profile.role.carpenter', category: 'construction' },
  { match: /\b(welders?|welding)\b/i, roleKey: 'profile.role.welder', category: 'construction' },
  { match: /\b(roofers?|roofing)\b/i, roleKey: 'profile.role.roofer', category: 'construction' },
  { match: /\b(masons?|masonry)\b/i, roleKey: 'profile.role.mason', category: 'construction' },
  { match: /\b(foremen?|site\s+supervisor)\b/i, roleKey: 'profile.role.foreman', category: 'construction' },
  { match: /\b(construction\s+workers?|builders?|contractors?|jobsite|construction)\b/i, roleKey: 'profile.role.construction', category: 'construction' },
  { match: /\b(mechanics?|auto\s+repair)\b/i, roleKey: 'profile.role.mechanic', category: 'construction' },

  // Janitorial
  { match: /\b(janitors?|janitorial|custodians?|custodial)\b/i, roleKey: 'profile.role.janitorial', category: 'janitorial' },
  { match: /\b(cleaners?|cleaning|sanit(?:ize|ization|ation))\b/i, roleKey: 'profile.role.cleaner', category: 'janitorial' },
  { match: /\b(housekeepers?|housekeeping)\b/i, roleKey: 'profile.role.housekeeper', category: 'janitorial' },

  // Agriculture
  { match: /agricultur\w*/i, roleKey: 'profile.role.agriculture', category: 'agriculture' },
  { match: /\b(farmers?|farming|ranchers?|ranching|crop|livestock)\b/i, roleKey: 'profile.role.farmer', category: 'agriculture' },

  // Business
  { match: /\b(sales\s+(rep|associate|person)|salespeople|sales)\b/i, roleKey: 'profile.role.sales', category: 'business' },
  { match: /\b(marketing\s+(manager|specialist)|marketers?|marketing)\b/i, roleKey: 'profile.role.marketing', category: 'business' },
  { match: /\b(accountants?|accounting|bookkeepers?|finance)\b/i, roleKey: 'profile.role.accountant', category: 'business' },
  { match: /\b(lawyers?|attorneys?|legal\s+counsel)\b/i, roleKey: 'profile.role.lawyer', category: 'business' },
  { match: /\b(software\s+(engineer|developer)|developers?|programmers?|engineers?)\b/i, roleKey: 'profile.role.engineer', category: 'business' },
  { match: /\b(data\s+analysts?|business\s+analysts?|analysts?)\b/i, roleKey: 'profile.role.analyst', category: 'business' },
  { match: /\b(consultants?|consulting)\b/i, roleKey: 'profile.role.consultant', category: 'business' },
  { match: /\b(managers?|supervisors?|team\s+lead)\b/i, roleKey: 'profile.role.manager', category: 'business' },
  { match: /\b(administrative\s+assistants?|secretaries?|office\s+admin|reception\s+admin)\b/i, roleKey: 'profile.role.admin', category: 'business' },
  { match: /\b(hr\s+(manager|specialist)|human\s+resources|recruiters?)\b/i, roleKey: 'profile.role.hr', category: 'business' },
  { match: /\b(truck\s+drivers?|delivery\s+drivers?|drivers?|cdl)\b/i, roleKey: 'profile.role.driver', category: 'business' },
  { match: /\b(warehouse\s+(worker|associate)|warehouses?|logistics|fulfillment)\b/i, roleKey: 'profile.role.warehouse', category: 'business' },
  { match: /\b(retail\s+(associate|worker)|cashiers?|retail|store\s+clerk)\b/i, roleKey: 'profile.role.retail', category: 'business' },
  { match: /\b(technicians?|it\s+support|help\s+desk)\b/i, roleKey: 'profile.role.technician', category: 'business' },
  { match: /\b(security\s+(guard|officer)|guards?|security)\b/i, roleKey: 'profile.role.security', category: 'business' },
  { match: /\b(business|corporate|office\s+worker|professional)\b/i, roleKey: 'profile.role.business', category: 'business' },
];

export function normalizeManualProfession(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function inferManualProfessionMeta(customText: string): ProfessionMeta | null {
  const normalized = normalizeManualProfession(customText);
  if (!normalized) return null;

  const exact = EXACT_MANUAL_PROFESSION[normalized];
  if (exact) return exact;

  for (const entry of PATTERN_MANUAL_PROFESSION) {
    if (entry.match.test(normalized)) {
      return { roleKey: entry.roleKey, category: entry.category };
    }
  }

  return null;
}
