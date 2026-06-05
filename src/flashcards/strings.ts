type LangCode = 'en' | 'es';

type CardTriple = { term: string; def: string; ex: string; context?: string };

function pack(slug: string, cards: CardTriple[]): Record<string, string> {
  const out: Record<string, string> = {};
  cards.forEach((c, i) => {
    const n = i + 1;
    out[`flash.${slug}.c${n}.term`] = c.term;
    out[`flash.${slug}.c${n}.def`] = c.def;
    out[`flash.${slug}.c${n}.ex`] = c.ex;
    out[`flash.${slug}.c${n}.context`] = c.context ?? c.ex;
  });
  return out;
}

const EN: Record<string, string> = {
  'flash.hc1.c1.context': 'The patient mentioned sharp pain when drinking cold water.',
  'flash.hc1.c2.context': 'During the exam, the hygienist checks the gum line for swelling.',
  'flash.hc1.c3.context': 'I need to schedule a follow-up appointment.',
  'flash.hc1.c4.context': 'You may feel numbness for a few hours after the procedure.',
  'flash.hc1.c5.context': 'Please let me know if you feel any pain or pressure.',
  'flash.hc1.c6.context': 'Would you like to book your next appointment before you leave?',
  ...pack('hc2', [
    {
      term: 'Chief complaint',
      def: 'The main reason the patient is seeking care right now.',
      ex: '“What brings you in today—what’s your chief complaint?”',
    },
    {
      term: 'Onset',
      def: 'When symptoms started and how they began.',
      ex: '“When did the pain start, and did it come on suddenly?”',
    },
    {
      term: 'Triage',
      def: 'Sorting patients by urgency so the sickest are seen first.',
      ex: '“We’ll triage you now and get you to the right provider.”',
    },
    {
      term: 'Vital signs',
      def: 'Basic measurements like blood pressure, pulse, and temperature.',
      ex: '“I’m going to check your vital signs before the doctor sees you.”',
    },
  ]),
  ...pack('hc3', [
    {
      term: 'Coverage',
      def: 'What medical services an insurance plan will pay for.',
      ex: '“Let me verify your coverage for today’s visit.”',
    },
    {
      term: 'Copay',
      def: 'A fixed amount the patient pays at the time of service.',
      ex: '“Your copay for this appointment is twenty dollars.”',
    },
    {
      term: 'Prior authorization',
      def: 'Insurance approval required before certain treatments or tests.',
      ex: '“This procedure may need prior authorization from your insurer.”',
    },
    {
      term: 'Eligibility',
      def: 'Whether a patient’s insurance is active and valid on a given date.',
      ex: '“I’ll confirm your eligibility before we check you in.”',
    },
  ]),
  ...pack('hc4', [
    {
      term: 'Recovery',
      def: 'The process of healing after illness, injury, or treatment.',
      ex: '“How has your recovery been since the procedure?”',
    },
    {
      term: 'Side effects',
      def: 'Unwanted symptoms that can happen after medication or treatment.',
      ex: '“Are you experiencing any side effects from the medication?”',
    },
    {
      term: 'Discharge instructions',
      def: 'Written guidance given when a patient leaves care.',
      ex: '“I’ll review your discharge instructions before you go home.”',
    },
    {
      term: 'Reschedule',
      def: 'To move an appointment to a different date or time.',
      ex: '“Would you like to reschedule your follow-up for next week?”',
    },
  ]),
  ...pack('biz1', [
    {
      term: 'Pleased to meet you',
      def: 'A polite opening when meeting a client for the first time.',
      ex: '“I’m pleased to meet you—thank you for making time today.”',
    },
    {
      term: 'Background',
      def: 'A person’s professional history and experience.',
      ex: '“Let me give you a quick background on our team’s work.”',
    },
    {
      term: 'Expertise',
      def: 'Special skill or deep knowledge in a particular area.',
      ex: '“Our expertise is helping small businesses scale operations.”',
    },
    {
      term: 'Looking forward',
      def: 'Expressing positive anticipation about future collaboration.',
      ex: '“I’m looking forward to exploring this partnership with you.”',
    },
  ]),
  ...pack('biz2', [
    {
      term: 'Proposal',
      def: 'A formal offer outlining terms, scope, and pricing.',
      ex: '“I’ll send the updated proposal by end of day Friday.”',
    },
    {
      term: 'Terms',
      def: 'The conditions both sides agree to in a deal.',
      ex: '“Let’s align on the payment terms before we finalize.”',
    },
    {
      term: 'Timeline',
      def: 'The schedule for delivering work or reaching milestones.',
      ex: '“Does this timeline work for your launch date?”',
    },
    {
      term: 'Next steps',
      def: 'The agreed actions that happen after a meeting or call.',
      ex: '“Here are the next steps—we’ll review the contract Monday.”',
    },
  ]),
  ...pack('biz3', [
    {
      term: 'Strength',
      def: 'A skill or quality that helps you perform well at work.',
      ex: '“One of my strengths is staying calm under tight deadlines.”',
    },
    {
      term: 'Relevant experience',
      def: 'Past work that directly relates to the role you want.',
      ex: '“I have three years of relevant experience in client onboarding.”',
    },
    {
      term: 'Team player',
      def: 'Someone who collaborates well and supports colleagues.',
      ex: '“Colleagues describe me as a team player who shares context early.”',
    },
    {
      term: 'Questions for you',
      def: 'Thoughtful questions a candidate asks the interviewer.',
      ex: '“I have a few questions for you about how success is measured here.”',
    },
  ]),
  ...pack('biz4', [
    {
      term: 'Scheduling conflict',
      def: 'When two commitments overlap and one must move.',
      ex: '“I have a scheduling conflict—could we move the meeting to Thursday?”',
    },
    {
      term: 'Availability',
      def: 'The times when someone is free to meet.',
      ex: '“What’s your availability early next week?”',
    },
    {
      term: 'Confirm',
      def: 'To verify that a plan or appointment is set.',
      ex: '“Can you confirm the video link works on your end?”',
    },
    {
      term: 'Apologize for the inconvenience',
      def: 'A professional way to acknowledge disruption caused to others.',
      ex: '“I apologize for the inconvenience—thanks for your flexibility.”',
    },
  ]),
  ...pack('hos1', [
    {
      term: 'Reservation',
      def: 'A booking held for a guest’s stay or service.',
      ex: '“I have your reservation under Garcia for three nights.”',
    },
    {
      term: 'Availability',
      def: 'Which rooms or dates are open for booking.',
      ex: '“We have availability on the quiet floor starting Tuesday.”',
    },
    {
      term: 'Upgrade',
      def: 'Moving a guest to a better room or service level.',
      ex: '“We’re happy to offer a complimentary upgrade tonight.”',
    },
    {
      term: 'Confirmation number',
      def: 'A reference code that verifies a booking.',
      ex: '“Your confirmation number is HT-48291—please keep it handy.”',
    },
  ]),
  ...pack('hos2', [
    {
      term: 'I apologize',
      def: 'A direct way to acknowledge a guest’s bad experience.',
      ex: '“I apologize for the delay—you shouldn’t have waited that long.”',
    },
    {
      term: 'Resolve',
      def: 'To fix a problem so the guest feels taken care of.',
      ex: '“Let me resolve this for you before you settle the bill.”',
    },
    {
      term: 'Compensation',
      def: 'Something offered to make up for a service failure.',
      ex: '“We’d like to offer compensation for the noise last night.”',
    },
    {
      term: 'Follow up',
      def: 'To check back after an issue to ensure it was fixed.',
      ex: '“I’ll follow up this evening to make sure the room is quiet.”',
    },
  ]),
  ...pack('hos3', [
    {
      term: 'Recommend',
      def: 'To suggest a place, route, or experience you trust.',
      ex: '“I’d recommend the waterfront café—it’s a ten-minute walk.”',
    },
    {
      term: 'Directions',
      def: 'Instructions for how to get somewhere.',
      ex: '“Here are directions to the theater—turn left at the plaza.”',
    },
    {
      term: 'Reservation',
      def: 'A table or ticket held under the guest’s name.',
      ex: '“I can make a dinner reservation for eight o’clock if you’d like.”',
    },
    {
      term: 'Enjoy your evening',
      def: 'A warm closing after helping a guest.',
      ex: '“The car is waiting out front—enjoy your evening.”',
    },
  ]),
  ...pack('hos4', [
    {
      term: 'Shift handoff',
      def: 'Passing key updates from one team to the next shift.',
      ex: '“Quick shift handoff—VIP arrival at six, room not ready yet.”',
    },
    {
      term: 'Priority',
      def: 'The task that should be handled first.',
      ex: '“Top priority is clearing the backlog at the front desk.”',
    },
    {
      term: 'Heads-up',
      def: 'An early warning so the team can prepare.',
      ex: '“Heads-up—we’re expecting a full house this weekend.”',
    },
    {
      term: 'Coverage',
      def: 'Who is responsible for an area while someone is away.',
      ex: '“Maria has lobby coverage until the banquet team arrives.”',
    },
  ]),
  ...pack('edu1', [
    {
      term: 'Progress',
      def: 'How a student is advancing in learning over time.',
      ex: '“I’m happy to share how your child’s progress has improved this term.”',
    },
    {
      term: 'Area of concern',
      def: 'A skill or subject that needs extra support.',
      ex: '“One area of concern is reading fluency—we have a plan in place.”',
    },
    {
      term: 'Conference',
      def: 'A scheduled meeting between teacher and family.',
      ex: '“Would Thursday afternoon work for a parent conference?”',
    },
    {
      term: 'Support at home',
      def: 'Ways families can reinforce learning outside school.',
      ex: '“Ten minutes of reading at home each night would really help.”',
    },
  ]),
  ...pack('edu2', [
    {
      term: 'Learning objective',
      def: 'What students should know or do by the end of a lesson.',
      ex: '“Today’s learning objective is to compare two fractions.”',
    },
    {
      term: 'Participate',
      def: 'To take part actively in class discussion or activities.',
      ex: '“Please participate by sharing one idea with your partner.”',
    },
    {
      term: 'Review',
      def: 'To go over material again to strengthen understanding.',
      ex: '“We’ll review yesterday’s vocabulary before the quiz.”',
    },
    {
      term: 'Homework',
      def: 'Practice work assigned to complete outside class.',
      ex: '“Homework is pages twelve to fourteen—due tomorrow.”',
    },
  ]),
  ...pack('edu3', [
    {
      term: 'Strength',
      def: 'Something the student does well that should be recognized.',
      ex: '“A strength I’ve noticed is how clearly you explain your thinking.”',
    },
    {
      term: 'Room for growth',
      def: 'A gentle way to name an area to improve.',
      ex: '“There’s room for growth in checking your work before submitting.”',
    },
    {
      term: 'Goal',
      def: 'A specific target the student will work toward.',
      ex: '“Let’s set a goal to finish writing tasks within the class period.”',
    },
    {
      term: 'Practice',
      def: 'Repeated effort to build a skill over time.',
      ex: '“With practice, this will feel much more natural.”',
    },
  ]),
  ...pack('edu4', [
    {
      term: 'Agenda',
      def: 'The list of topics planned for a meeting.',
      ex: '“First on the agenda is the new grading policy.”',
    },
    {
      term: 'Curriculum',
      def: 'The planned content and skills taught across a term.',
      ex: '“We’re aligning the curriculum with updated state standards.”',
    },
    {
      term: 'Deadline',
      def: 'The date by which work must be completed.',
      ex: '“The deadline for unit plans is the fifteenth.”',
    },
    {
      term: 'Collaboration',
      def: 'Working together across roles or departments.',
      ex: '“Collaboration between grade teams has improved outcomes.”',
    },
  ]),
  ...pack('def1', [
    {
      term: 'Check in',
      def: 'A brief update on status, blockers, or next steps.',
      ex: '“Quick check-in—are you on track for Friday’s deliverable?”',
    },
    {
      term: 'Blocker',
      def: 'Something preventing progress until it is resolved.',
      ex: '“My blocker is waiting on approval from finance.”',
    },
    {
      term: 'Bandwidth',
      def: 'How much capacity someone has for additional work.',
      ex: '“I don’t have bandwidth this week, but I can help Monday.”',
    },
    {
      term: 'Loop in',
      def: 'To include someone in a conversation or decision.',
      ex: '“I’ll loop in HR so they’re aware of the schedule change.”',
    },
  ]),
  ...pack('def2', [
    {
      term: 'How can I help',
      def: 'An open, service-oriented way to start with a customer.',
      ex: '“Thanks for calling—how can I help you today?”',
    },
    {
      term: 'Let me look into that',
      def: 'Promising to investigate without guessing an answer.',
      ex: '“Let me look into that and get back to you within an hour.”',
    },
    {
      term: 'Policy',
      def: 'An official rule that explains what is allowed.',
      ex: '“According to our policy, exchanges are allowed within thirty days.”',
    },
    {
      term: 'Is there anything else',
      def: 'A closing question to catch remaining needs.',
      ex: '“Is there anything else I can help you with today?”',
    },
  ]),
  ...pack('def3', [
    {
      term: 'Stand-up',
      def: 'A short daily team meeting for sync and priorities.',
      ex: '“In stand-up, keep updates to under two minutes.”',
    },
    {
      term: 'Priority',
      def: 'The most important task for the day or sprint.',
      ex: '“My priority today is finishing the client report.”',
    },
    {
      term: 'Sync',
      def: 'To align with teammates on progress and plans.',
      ex: '“Can we sync after lunch on the rollout timeline?”',
    },
    {
      term: 'Action item',
      def: 'A specific task someone commits to after a meeting.',
      ex: '“Your action item is to send the revised deck by four.”',
    },
  ]),
  ...pack('def4', [
    {
      term: 'Follow up',
      def: 'To contact someone again after an earlier conversation.',
      ex: '“I’m following up on our call about the onboarding timeline.”',
    },
    {
      term: 'Per our conversation',
      def: 'Referring back to what was agreed verbally.',
      ex: '“Per our conversation, I’ve attached the updated scope.”',
    },
    {
      term: 'Next steps',
      def: 'Clear actions that move a project forward.',
      ex: '“Here are the next steps—we’ll review feedback Wednesday.”',
    },
    {
      term: 'Thank you for your patience',
      def: 'Acknowledging a delay while staying professional.',
      ex: '“Thank you for your patience while we finalize the details.”',
    },
  ]),
};

const ES: Record<string, string> = {
  'flash.hc1.c1.context': 'El paciente mencionó dolor agudo al beber agua fría.',
  'flash.hc1.c2.context': 'Durante el examen, la higienista revisa la línea de las encías.',
  'flash.hc1.c3.context': 'Necesito programar una cita de seguimiento.',
  'flash.hc1.c4.context': 'Puede sentir entumecimiento por algunas horas después del procedimiento.',
  'flash.hc1.c5.context': 'Por favor avíseme si siente dolor o presión.',
  'flash.hc1.c6.context': '¿Le gustaría reservar su próxima cita antes de irse?',
  ...pack('hc2', [
    {
      term: 'Motivo principal de consulta',
      def: 'La razón principal por la que el paciente busca atención ahora.',
      ex: '“¿Qué le trae hoy—cuál es su motivo principal de consulta?”',
    },
    {
      term: 'Inicio',
      def: 'Cuándo comenzaron los síntomas y cómo aparecieron.',
      ex: '“¿Cuándo empezó el dolor y fue de repente?”',
    },
    {
      term: 'Triaje',
      def: 'Clasificar pacientes por urgencia para atender primero a los más graves.',
      ex: '“Ahora le haremos triaje y le llevaremos al proveedor adecuado.”',
    },
    {
      term: 'Signos vitales',
      def: 'Medidas básicas como presión arterial, pulso y temperatura.',
      ex: '“Voy a revisar sus signos vitales antes de que la vea el médico.”',
    },
  ]),
  ...pack('hc3', [
    {
      term: 'Cobertura',
      def: 'Qué servicios médicos pagará el plan de seguro.',
      ex: '“Permítame verificar su cobertura para la visita de hoy.”',
    },
    {
      term: 'Copago',
      def: 'Cantidad fija que paga el paciente al recibir el servicio.',
      ex: '“Su copago para esta cita es de veinte dólares.”',
    },
    {
      term: 'Autorización previa',
      def: 'Aprobación del seguro antes de ciertos tratamientos o pruebas.',
      ex: '“Este procedimiento puede requerir autorización previa de su aseguradora.”',
    },
    {
      term: 'Elegibilidad',
      def: 'Si el seguro del paciente está activo y válido en una fecha dada.',
      ex: '“Confirmaré su elegibilidad antes de registrarlo.”',
    },
  ]),
  ...pack('hc4', [
    {
      term: 'Recuperación',
      def: 'Proceso de sanar tras enfermedad, lesión o tratamiento.',
      ex: '“¿Cómo ha sido su recuperación desde el procedimiento?”',
    },
    {
      term: 'Efectos secundarios',
      def: 'Síntomas no deseados que pueden aparecer tras medicación o tratamiento.',
      ex: '“¿Tiene algún efecto secundario del medicamento?”',
    },
    {
      term: 'Instrucciones de alta',
      def: 'Indicaciones escritas al salir del cuidado médico.',
      ex: '“Repasaré sus instrucciones de alta antes de irse a casa.”',
    },
    {
      term: 'Reprogramar',
      def: 'Mover una cita a otra fecha u hora.',
      ex: '“¿Le gustaría reprogramar su seguimiento para la próxima semana?”',
    },
  ]),
  ...pack('biz1', [
    {
      term: 'Encantado de conocerle',
      def: 'Saludo cortés al conocer a un cliente por primera vez.',
      ex: '“Encantado de conocerle—gracias por dedicarnos tiempo hoy.”',
    },
    {
      term: 'Trayectoria',
      def: 'Historial y experiencia profesional de una persona.',
      ex: '“Permítame contarle brevemente la trayectoria de nuestro equipo.”',
    },
    {
      term: 'Experiencia especializada',
      def: 'Habilidad profunda en un área concreta.',
      ex: '“Nuestra experiencia es ayudar a pymes a escalar operaciones.”',
    },
    {
      term: 'Con muchas ganas',
      def: 'Expresar expectativa positiva sobre una colaboración futura.',
      ex: '“Tengo muchas ganas de explorar esta alianza con usted.”',
    },
  ]),
  ...pack('biz2', [
    {
      term: 'Propuesta',
      def: 'Oferta formal con alcance, términos y precio.',
      ex: '“Le enviaré la propuesta actualizada el viernes al cierre.”',
    },
    {
      term: 'Términos',
      def: 'Condiciones que ambas partes acuerdan en un trato.',
      ex: '“Alineemos los términos de pago antes de cerrar.”',
    },
    {
      term: 'Cronograma',
      def: 'Calendario para entregar trabajo o hitos.',
      ex: '“¿Este cronograma funciona para su fecha de lanzamiento?”',
    },
    {
      term: 'Próximos pasos',
      def: 'Acciones acordadas después de una reunión o llamada.',
      ex: '“Estos son los próximos pasos—revisamos el contrato el lunes.”',
    },
  ]),
  ...pack('biz3', [
    {
      term: 'Fortaleza',
      def: 'Habilidad o cualidad que le ayuda a rendir bien en el trabajo.',
      ex: '“Una de mis fortalezas es mantener la calma con plazos ajustados.”',
    },
    {
      term: 'Experiencia relevante',
      def: 'Trabajo previo directamente relacionado con el puesto.',
      ex: '“Tengo tres años de experiencia relevante en onboarding de clientes.”',
    },
    {
      term: 'Trabajo en equipo',
      def: 'Colaborar bien y apoyar a los compañeros.',
      ex: '“Me describen como alguien de equipo que comparte contexto a tiempo.”',
    },
    {
      term: 'Preguntas para ustedes',
      def: 'Preguntas reflexivas que hace el candidato al entrevistador.',
      ex: '“Tengo algunas preguntas sobre cómo miden el éxito aquí.”',
    },
  ]),
  ...pack('biz4', [
    {
      term: 'Conflicto de agenda',
      def: 'Cuando dos compromisos se superponen y uno debe moverse.',
      ex: '“Tengo un conflicto de agenda—¿podemos mover la reunión al jueves?”',
    },
    {
      term: 'Disponibilidad',
      def: 'Horarios en los que alguien puede reunirse.',
      ex: '“¿Cuál es su disponibilidad a principios de la próxima semana?”',
    },
    {
      term: 'Confirmar',
      def: 'Verificar que un plan o cita quedó acordado.',
      ex: '“¿Puede confirmar que el enlace de video funciona de su lado?”',
    },
    {
      term: 'Disculpe las molestias',
      def: 'Forma profesional de reconocer una interrupción causada a otros.',
      ex: '“Disculpe las molestias—gracias por su flexibilidad.”',
    },
  ]),
  ...pack('hos1', [
    {
      term: 'Reserva',
      def: 'Una reservación registrada para la estadía o servicio del huésped.',
      ex: '“Tengo su reserva a nombre de García por tres noches.”',
    },
    {
      term: 'Disponibilidad',
      def: 'Qué habitaciones o fechas están libres para reservar.',
      ex: '“Tenemos disponibilidad en el piso tranquilo desde el martes.”',
    },
    {
      term: 'Mejora de habitación',
      def: 'Mover al huésped a una habitación o categoría superior.',
      ex: '“Con gusto ofrecemos una mejora de habitación sin costo esta noche.”',
    },
    {
      term: 'Número de confirmación',
      def: 'Código de referencia que verifica una reserva.',
      ex: '“Su número de confirmación es HT-48291—guárdelo a mano.”',
    },
  ]),
  ...pack('hos2', [
    {
      term: 'Le pido disculpas',
      def: 'Forma directa de reconocer una mala experiencia del huésped.',
      ex: '“Le pido disculpas por la demora—no debió esperar tanto.”',
    },
    {
      term: 'Resolver',
      def: 'Solucionar un problema para que el huésped se sienta atendido.',
      ex: '“Permítame resolverlo antes de que pague la cuenta.”',
    },
    {
      term: 'Compensación',
      def: 'Algo ofrecido para compensar una falla de servicio.',
      ex: '“Nos gustaría ofrecer compensación por el ruido anoche.”',
    },
    {
      term: 'Dar seguimiento',
      def: 'Volver a contactar tras un problema para confirmar que quedó resuelto.',
      ex: '“Daré seguimiento esta noche para asegurar que la habitación esté tranquila.”',
    },
  ]),
  ...pack('hos3', [
    {
      term: 'Recomendar',
      def: 'Sugerir un lugar, ruta o experiencia de confianza.',
      ex: '“Recomiendo el café del muelle—está a diez minutos caminando.”',
    },
    {
      term: 'Indicaciones',
      def: 'Instrucciones para llegar a un lugar.',
      ex: '“Aquí tiene indicaciones al teatro—gire a la izquierda en la plaza.”',
    },
    {
      term: 'Reservación',
      def: 'Mesa o entrada reservada a nombre del huésped.',
      ex: '“Puedo hacer una reservación de cena para las ocho si desea.”',
    },
    {
      term: 'Disfrute su noche',
      def: 'Cierre cordial después de ayudar a un huésped.',
      ex: '“El auto lo espera afuera—disfrute su noche.”',
    },
  ]),
  ...pack('hos4', [
    {
      term: 'Entrega de turno',
      def: 'Pasar información clave al equipo del siguiente turno.',
      ex: '“Entrega rápida de turno—llegada VIP a las seis, habitación aún no lista.”',
    },
    {
      term: 'Prioridad',
      def: 'La tarea que debe atenderse primero.',
      ex: '“La prioridad es despejar la cola en recepción.”',
    },
    {
      term: 'Aviso anticipado',
      def: 'Alerta temprana para que el equipo se prepare.',
      ex: '“Aviso: esperamos casa llena este fin de semana.”',
    },
    {
      term: 'Cobertura',
      def: 'Quién responde por un área mientras alguien no está.',
      ex: '“María cubre el lobby hasta que llegue el equipo de banquetes.”',
    },
  ]),
  ...pack('edu1', [
    {
      term: 'Progreso',
      def: 'Cómo avanza un estudiante en el aprendizaje con el tiempo.',
      ex: '“Me alegra compartir cómo ha mejorado el progreso de su hijo este trimestre.”',
    },
    {
      term: 'Área de preocupación',
      def: 'Habilidad o materia que necesita apoyo extra.',
      ex: '“Un área de preocupación es la fluidez lectora—tenemos un plan.”',
    },
    {
      term: 'Conferencia',
      def: 'Reunión programada entre docente y familia.',
      ex: '“¿Le funciona el jueves por la tarde para una conferencia?”',
    },
    {
      term: 'Apoyo en casa',
      def: 'Formas en que la familia refuerza el aprendizaje fuera de clase.',
      ex: '“Diez minutos de lectura en casa cada noche ayudarían mucho.”',
    },
  ]),
  ...pack('edu2', [
    {
      term: 'Objetivo de aprendizaje',
      def: 'Lo que los estudiantes deben saber o hacer al final de la lección.',
      ex: '“El objetivo de hoy es comparar dos fracciones.”',
    },
    {
      term: 'Participar',
      def: 'Tomar parte activamente en la clase o actividades.',
      ex: '“Participen compartiendo una idea con su compañero.”',
    },
    {
      term: 'Repasar',
      def: 'Volver a ver el material para reforzar la comprensión.',
      ex: '“Repasaremos el vocabulario de ayer antes del quiz.”',
    },
    {
      term: 'Tarea',
      def: 'Trabajo de práctica para completar fuera de clase.',
      ex: '“La tarea es de la página doce a la catorce—para mañana.”',
    },
  ]),
  ...pack('edu3', [
    {
      term: 'Fortaleza',
      def: 'Algo que el estudiante hace bien y debe reconocerse.',
      ex: '“Una fortaleza que noto es cómo explica su razonamiento.”',
    },
    {
      term: 'Margen de mejora',
      def: 'Forma amable de señalar un área a mejorar.',
      ex: '“Hay margen de mejora al revisar el trabajo antes de entregar.”',
    },
    {
      term: 'Meta',
      def: 'Objetivo concreto hacia el que trabajará el estudiante.',
      ex: '“Fijemos la meta de terminar escritos dentro del periodo de clase.”',
    },
    {
      term: 'Práctica',
      def: 'Esfuerzo repetido para desarrollar una habilidad.',
      ex: '“Con práctica, esto se sentirá mucho más natural.”',
    },
  ]),
  ...pack('edu4', [
    {
      term: 'Agenda',
      def: 'Lista de temas planificados para una reunión.',
      ex: '“Lo primero en la agenda es la nueva política de calificaciones.”',
    },
    {
      term: 'Currículo',
      def: 'Contenido y habilidades planificadas a lo largo del periodo.',
      ex: '“Estamos alineando el currículo con los estándares estatales.”',
    },
    {
      term: 'Fecha límite',
      def: 'Día en que el trabajo debe estar completo.',
      ex: '“La fecha límite para los planes de unidad es el quince.”',
    },
    {
      term: 'Colaboración',
      def: 'Trabajar juntos entre roles o departamentos.',
      ex: '“La colaboración entre equipos de grado mejoró los resultados.”',
    },
  ]),
  ...pack('def1', [
    {
      term: 'Check-in',
      def: 'Actualización breve sobre estado, bloqueos o próximos pasos.',
      ex: '“Check-in rápido—¿van bien para la entrega del viernes?”',
    },
    {
      term: 'Bloqueo',
      def: 'Algo que impide avanzar hasta resolverse.',
      ex: '“Mi bloqueo es esperar la aprobación de finanzas.”',
    },
    {
      term: 'Capacidad',
      def: 'Cuánto margen tiene alguien para trabajo adicional.',
      ex: '“No tengo capacidad esta semana, pero puedo ayudar el lunes.”',
    },
    {
      term: 'Incluir en el loop',
      def: 'Sumar a alguien a una conversación o decisión.',
      ex: '“Incluiré a RR. HH. para que sepan del cambio de horario.”',
    },
  ]),
  ...pack('def2', [
    {
      term: '¿En qué puedo ayudarle?',
      def: 'Forma abierta y orientada al servicio para iniciar con un cliente.',
      ex: '“Gracias por llamar—¿en qué puedo ayudarle hoy?”',
    },
    {
      term: 'Permítame revisarlo',
      def: 'Prometer investigar sin adivinar la respuesta.',
      ex: '“Permítame revisarlo y le respondo en una hora.”',
    },
    {
      term: 'Política',
      def: 'Regla oficial que explica qué está permitido.',
      ex: '“Según nuestra política, los cambios son dentro de treinta días.”',
    },
    {
      term: '¿Algo más?',
      def: 'Pregunta de cierre para detectar necesidades pendientes.',
      ex: '“¿Hay algo más en lo que pueda ayudarle hoy?”',
    },
  ]),
  ...pack('def3', [
    {
      term: 'Stand-up',
      def: 'Reunión diaria breve del equipo para sincronizar prioridades.',
      ex: '“En el stand-up, mantengan las actualizaciones bajo dos minutos.”',
    },
    {
      term: 'Prioridad',
      def: 'La tarea más importante del día o sprint.',
      ex: '“Mi prioridad hoy es terminar el informe del cliente.”',
    },
    {
      term: 'Sincronizar',
      def: 'Alinear con el equipo avances y planes.',
      ex: '“¿Podemos sincronizar después del almuerzo sobre el lanzamiento?”',
    },
    {
      term: 'Acción pendiente',
      def: 'Tarea concreta que alguien asume tras una reunión.',
      ex: '“Su acción pendiente es enviar la presentación revisada antes de las cuatro.”',
    },
  ]),
  ...pack('def4', [
    {
      term: 'Dar seguimiento',
      def: 'Volver a contactar tras una conversación anterior.',
      ex: '“Le escribo para dar seguimiento a nuestra llamada sobre el onboarding.”',
    },
    {
      term: 'Según nuestra conversación',
      def: 'Referirse a lo acordado verbalmente.',
      ex: '“Según nuestra conversación, adjunto el alcance actualizado.”',
    },
    {
      term: 'Próximos pasos',
      def: 'Acciones claras que hacen avanzar un proyecto.',
      ex: '“Estos son los próximos pasos—revisamos comentarios el miércoles.”',
    },
    {
      term: 'Gracias por su paciencia',
      def: 'Reconocer una demora manteniendo profesionalismo.',
      ex: '“Gracias por su paciencia mientras finalizamos los detalles.”',
    },
  ]),
};

export const FLASHCARD_STRINGS: Record<LangCode, Record<string, string>> = {
  en: EN,
  es: ES,
};
