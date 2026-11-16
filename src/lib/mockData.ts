/**
 * Comprehensive Mock Data Store for Suraksha Setu Vite + React SPA.
 * Allows the entire application to run completely standalone with:
 * - 30 authenticated road safety examination questions with images
 * - Slot countdown timer, video module, and synchronized exam unlock
 * - Auto-scoring, student certificate generation, and live leaderboard
 * - Staff administrative dashboard and coordinator portals
 * - LocalStorage persistence for user attempts and registrations
 */

export interface MockQuestion {
  id: string;
  topic: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
  imageUrl?: string;
}

export const MOCK_QUESTIONS: MockQuestion[] = [
  {
    id: "q-1",
    topic: "helmet",
    prompt: "Which is the single most effective way to reduce head-injury risk on a two-wheeler?",
    options: ["A properly strapped ISI-marked helmet", "A baseball cap", "Riding only in the morning", "Riding on the footpath"],
    correct: 0,
    explanation: "A certified helmet absorbs impact energy and can reduce fatal head injury by around 40%.",
    imageUrl: "/images/signs/helmet-sign.svg",
  },
  {
    id: "q-2",
    topic: "helmet",
    prompt: "A helmet gives real protection only when…",
    options: ["The chin strap is fastened snugly", "It is expensive", "It is worn slightly tilted back", "It is a half-helmet"],
    correct: 0,
    explanation: "An unstrapped helmet flies off on impact, giving zero protection.",
    imageUrl: "/images/signs/helmet-sign.svg",
  },
  {
    id: "q-3",
    topic: "seatbelt",
    prompt: "Who must wear a seatbelt inside a car?",
    options: ["Every occupant, front and rear", "Only the driver", "Only front-seat passengers", "Only children"],
    correct: 0,
    explanation: "Unbelted rear passengers become projectiles and can kill belted front occupants in a collision.",
    imageUrl: "/images/signs/seatbelt.svg",
  },
  {
    id: "q-4",
    topic: "seatbelt",
    prompt: "Airbags in a car are…",
    options: ["A supplement to seatbelts, not a replacement", "A full replacement for seatbelts", "Only useful above 100 km/h", "Fitted for pedestrian safety"],
    correct: 0,
    explanation: "Airbags deploy at 300 km/h — without a belt you can be severely injured by the deploying bag itself.",
    imageUrl: "/images/signs/seatbelt.svg",
  },
  {
    id: "q-5",
    topic: "speed",
    prompt: "Which statement about speed is TRUE?",
    options: ["Higher speed cuts reaction time and increases stopping distance", "Speed only matters on highways", "Skilled drivers are unaffected by speed", "Stopping distance is constant"],
    correct: 0,
    explanation: "Stopping distance = reaction distance + braking distance; both grow rapidly with speed.",
    imageUrl: "/images/signs/speed-30.svg",
  },
  {
    id: "q-6",
    topic: "speed",
    prompt: "Crash energy increases with…",
    options: ["The square of the speed", "The square root of speed", "Tyre pressure", "Vehicle colour"],
    correct: 0,
    explanation: "Kinetic energy = ½mv². A crash at 60 km/h carries roughly twice the destructive energy of one at 45 km/h.",
    imageUrl: "/images/signs/speed-30.svg",
  },
  {
    id: "q-7",
    topic: "speed",
    prompt: "In a residential / school zone the recommended maximum speed for cars is:",
    options: ["25–30 km/h", "60 km/h", "80 km/h", "No limit"],
    correct: 0,
    explanation: "At 30 km/h a struck pedestrian has about a 90% survival chance; at 50 km/h it drops below 20%.",
    imageUrl: "/images/signs/speed-30.svg",
  },
  {
    id: "q-8",
    topic: "distraction",
    prompt: "Using a hand-held mobile phone while driving:",
    options: ["Is illegal and sharply raises crash risk", "Is safe with one hand", "Is allowed below 40 km/h", "Only distracts new drivers"],
    correct: 0,
    explanation: "Phone use delays braking reaction by around 0.5–1 second — 15 metres of unguided travel at 60 km/h.",
    imageUrl: "/images/signs/no-phone.svg",
  },
  {
    id: "q-9",
    topic: "distraction",
    prompt: "Which distraction is the most dangerous?",
    options: ["Reading or typing a text message", "Talking to a passenger", "Listening to the radio", "Adjusting the mirror while parked"],
    correct: 0,
    explanation: "Texting removes eyes, hands and mind from the road simultaneously.",
    imageUrl: "/images/signs/no-phone.svg",
  },
  {
    id: "q-10",
    topic: "distraction",
    prompt: "If an urgent call comes while you are driving, you should:",
    options: ["Pull over safely, park, then talk", "Answer on speaker", "Answer at a red light only", "Type a quick reply"],
    correct: 0,
    explanation: "Even hands-free phone conversation degrades cognitive situational awareness significantly.",
    imageUrl: "/images/signs/no-phone.svg",
  },
  {
    id: "q-11",
    topic: "pedestrian",
    prompt: "At a zebra crossing, a driver must:",
    options: ["Slow down and give way to pedestrians", "Sound the horn and pass", "Accelerate to clear the crossing", "Stop only if a police officer is present"],
    correct: 0,
    explanation: "Pedestrians have right of way at marked crossings under the Motor Vehicles Act.",
    imageUrl: "/images/signs/pedestrian-sign.svg",
  },
  {
    id: "q-12",
    topic: "pedestrian",
    prompt: "Before stepping onto a road, a pedestrian should:",
    options: ["Stop, look right–left–right, then cross", "Run across quickly", "Cross while on the phone", "Cross between parked vehicles"],
    correct: 0,
    explanation: "The right–left–right scan covers the nearest lane of approaching traffic first.",
    imageUrl: "/images/signs/pedestrian-sign.svg",
  },
  {
    id: "q-13",
    topic: "pedestrian",
    prompt: "The safest place to cross a busy multi-lane road is:",
    options: ["A foot-over bridge or signalised crossing", "Anywhere with a gap", "Between two buses", "At a blind corner"],
    correct: 0,
    explanation: "Grade-separated and signalised crossings eliminate conflict with high-speed moving traffic.",
    imageUrl: "/images/signs/pedestrian-sign.svg",
  },
  {
    id: "q-14",
    topic: "pedestrian",
    prompt: "On a road with no footpath you should walk:",
    options: ["On the right, facing oncoming traffic", "On the left, with traffic behind you", "In the middle of the carriageway", "Anywhere with earphones on"],
    correct: 0,
    explanation: "Facing traffic lets you see an approaching vehicle drift toward you and take evasive action.",
    imageUrl: "/images/signs/pedestrian-sign.svg",
  },
  {
    id: "q-15",
    topic: "sober",
    prompt: "The legal blood-alcohol limit for driving in India is:",
    options: ["30 mg per 100 ml of blood", "100 mg per 100 ml", "There is no limit", "60 mg per litre"],
    correct: 0,
    explanation: "Exceeding 30 mg/100 ml invites criminal prosecution, hefty fines and licence suspension.",
    imageUrl: "/images/signs/sober.svg",
  },
  {
    id: "q-16",
    topic: "sober",
    prompt: "Alcohol primarily impairs:",
    options: ["Judgement, reaction time and coordination", "Only eyesight", "Only memory", "Nothing below 2 drinks"],
    correct: 0,
    explanation: "Judgement is affected first — alcohol prevents drivers from accurately gauging their own impairment.",
    imageUrl: "/images/signs/sober.svg",
  },
  {
    id: "q-17",
    topic: "sober",
    prompt: "The only reliable way to become fit to drive after drinking is:",
    options: ["Waiting several hours for the body to metabolise it", "Strong black coffee", "A cold shower", "Chewing gum or mints"],
    correct: 0,
    explanation: "The liver metabolises alcohol at roughly one standard unit per hour. Neither coffee nor showers speed this up.",
    imageUrl: "/images/signs/sober.svg",
  },
  {
    id: "q-18",
    topic: "signs",
    prompt: "A triangular red-bordered sign tells you to:",
    options: ["Slow down, warn and be alert", "Stop immediately", "Turn left", "Accelerate"],
    correct: 0,
    explanation: "Triangular signs are cautionary / warning signs indicating road hazards ahead.",
    imageUrl: "/images/signs/triangular-warning.svg",
  },
  {
    id: "q-19",
    topic: "signs",
    prompt: "A circular sign with a red border means:",
    options: ["Something is prohibited or mandatory", "Something is recommended", "The road ends", "Parking is free"],
    correct: 0,
    explanation: "Circular red-bordered signs are mandatory prohibitions — disobeying them is a punishable traffic offence.",
    imageUrl: "/images/signs/circular-prohibition.svg",
  },
  {
    id: "q-20",
    topic: "signs",
    prompt: "An amber (yellow) traffic signal means:",
    options: ["Stop unless it is already unsafe to do so", "Speed up to clear the junction", "Proceed freely", "Reverse"],
    correct: 0,
    explanation: "Amber indicates the end of green. You must stop unless you have already crossed the stop line or stopping abruptly causes a rear-end collision.",
    imageUrl: "/images/signs/amber-signal.svg",
  },
  {
    id: "q-21",
    topic: "signs",
    prompt: "A flashing yellow signal at an intersection means:",
    options: ["Slow down and proceed with caution", "Stop and wait for green", "No entry", "Give way to nothing"],
    correct: 0,
    explanation: "Flashing amber signals advise drivers to slow down, look both directions, and proceed with caution.",
    imageUrl: "/images/signs/amber-signal.svg",
  },
  {
    id: "q-22",
    topic: "night",
    prompt: "You should dip your headlamp to low beam when:",
    options: ["An oncoming vehicle is within 150–200 m", "Only on highways", "Never", "When it rains heavily only"],
    correct: 0,
    explanation: "High beam dazzles oncoming drivers and temporarily blinds them.",
    imageUrl: "/images/signs/triangular-warning.svg",
  },
  {
    id: "q-23",
    topic: "night",
    prompt: "What most improves your visibility to drivers at night?",
    options: ["Reflective strips or light-coloured clothing", "Dark clothing", "An umbrella", "Walking faster"],
    correct: 0,
    explanation: "Retro-reflective strips reflect vehicle headlights and are visible from up to 150 metres away.",
    imageUrl: "/images/signs/pedestrian-sign.svg",
  },
  {
    id: "q-24",
    topic: "firstaid",
    prompt: "The 'Golden Hour' after a road crash refers to:",
    options: ["The first 60 minutes when emergency care saves most lives", "The hour before sunrise", "The first hour after drinking", "A government scheme"],
    correct: 0,
    explanation: "Prompt medical care within the first hour prevents traumatic deaths and irreversible shock.",
    imageUrl: "/images/signs/first-aid-112.svg",
  },
  {
    id: "q-25",
    topic: "firstaid",
    prompt: "Which emergency number should you dial in India for medical / accident response?",
    options: ["112 (or 108 for ambulance)", "100 only", "198", "139"],
    correct: 0,
    explanation: "112 is the pan-India unified emergency number, while 108 operates state ambulance fleets.",
    imageUrl: "/images/signs/first-aid-112.svg",
  },
  {
    id: "q-26",
    topic: "general",
    prompt: "While overtaking another vehicle on Indian roads, you should pass on:",
    options: ["Its right side", "Its left side", "Either side", "The footpath"],
    correct: 0,
    explanation: "Under the Motor Vehicles Act, overtaking on the left (undertaking) is strictly prohibited.",
    imageUrl: "/images/signs/circular-prohibition.svg",
  },
  {
    id: "q-27",
    topic: "twowheeler",
    prompt: "The maximum number of pillion riders allowed on a two-wheeler is:",
    options: ["One", "Two", "Three if children", "Unlimited"],
    correct: 0,
    explanation: "Tripling destabilises motorcycles, increases stopping distance, and violates traffic law.",
    imageUrl: "/images/signs/helmet-sign.svg",
  },
  {
    id: "q-28",
    topic: "twowheeler",
    prompt: "Children on a two-wheeler must:",
    options: ["Wear a certified helmet and safety harness", "Sit sideways", "Ride without a helmet below 12 years", "Stand on the footboard"],
    correct: 0,
    explanation: "Ministry of Road Transport mandates helmets and safety harnesses for pillion children.",
    imageUrl: "/images/signs/helmet-sign.svg",
  },
  {
    id: "q-29",
    topic: "weather",
    prompt: "Roads are most slippery during:",
    options: ["The first few minutes of rain", "Continuous heavy rain", "Dry windy days", "Just after a wash"],
    correct: 0,
    explanation: "Initial raindrops mix with motor oil, fuel residue, and dust on the road surface, creating an invisible slick grease before heavy rain washes it away.",
    imageUrl: "/images/signs/rain-slip.svg",
  },
  {
    id: "q-30",
    topic: "general",
    prompt: "A vehicle's blind spots are best checked by:",
    options: ["Turning your head and looking over your shoulder", "Only glancing in the rear-view mirror", "Sounding the horn", "Relying on reversing sensors"],
    correct: 0,
    explanation: "Rear-view and side mirrors have blind spot zones beside the B and C pillars that only a quick head check can reveal.",
    imageUrl: "/images/signs/blind-spot.svg",
  },
];

export const MOCK_SCHOOLS = [
  { id: "sch-1", name: "Green Valley Public School", code: "GVPS-DEL-01", city: "New Delhi" },
  { id: "sch-2", name: "St. Mary's High School", code: "SMHS-PUN-07", city: "Pune" },
  { id: "sch-3", name: "Kendriya Vidyalaya Sector 14", code: "KV14-CHD-03", city: "Chandigarh" },
  { id: "sch-4", name: "Little Angels Convent School", code: "LAC-JAI-11", city: "Jaipur" },
];

export const MOCK_CAMPAIGNS = [
  {
    id: "c-1",
    title: "Zebra Crossing Revival Drive",
    category: "school_drive",
    summary: "Re-painting 42 faded zebra crossings outside government schools and running a right-of-way awareness walk with 1,200 students.",
    eventDate: new Date(Date.now() + 9 * 86400000).toISOString(),
    location: "Vasant Kunj & Kothrud school belt",
    imageUrl: "/images/campaign-zebra.svg",
    seats: 1200,
  },
  {
    id: "c-2",
    title: "Helmet First — Two-Wheeler Clinic",
    category: "community",
    summary: "Free helmet fit-checks, strap audits and ISI certification drives at traffic junctions with city rider clubs.",
    eventDate: new Date(Date.now() + 16 * 86400000).toISOString(),
    location: "MG Road Junction, Pune",
    imageUrl: "/images/campaign-helmet.svg",
    seats: 400,
  },
  {
    id: "c-3",
    title: "Safe Routes to School — Video Batch 02",
    category: "video_training",
    summary: "A 15-minute certified video module on pedestrian judgement and crossing behaviour, followed by a timed 30-question assessment.",
    eventDate: new Date().toISOString(),
    location: "Online · all partner schools",
    imageUrl: "/images/campaign-video.svg",
    seats: 300,
  },
  {
    id: "c-4",
    title: "Zero Drunk Driving — Night Patrol",
    category: "community",
    summary: "Volunteer shadowing of police breath-analyser checkpoints with on-spot counselling cards for first-time offenders.",
    eventDate: new Date(Date.now() + 23 * 86400000).toISOString(),
    location: "Chandigarh outer ring",
    imageUrl: "/images/campaign-night.svg",
    seats: 80,
  },
  {
    id: "c-5",
    title: "Pedestrian Right-of-Way Workshop",
    category: "school_drive",
    summary: "A hands-on junction workshop for class 8–10 students: gap judgement, the right-left-right scan and blind-spot demos.",
    eventDate: new Date(Date.now() + 31 * 86400000).toISOString(),
    location: "Kendriya Vidyalaya Sector 14",
    imageUrl: "/images/campaign-workshop.svg",
    seats: 250,
  },
];

export const MOCK_DEMO_CODES = [
  { code: "RS-DEMO01", name: "Aarav Sharma", school: "Green Valley Public School" },
  { code: "RS-DEMO02", name: "Diya Verma", school: "Green Valley Public School" },
  { code: "RS-DEMO03", name: "Kabir Nair", school: "Green Valley Public School" },
  { code: "RS-DEMO07", name: "Arjun Patil", school: "St. Mary's High School" },
  { code: "RS-DEMO11", name: "Aditya Singh", school: "Kendriya Vidyalaya Sector 14" },
];

export const MOCK_STUDENTS: Record<string, {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  email: string | null;
  schoolName: string;
  standard: string;
  section: string;
  experience: string;
  experienceLabel: string;
  accessCode: string;
}> = {
  "RS-DEMO01": {
    id: "std-01",
    name: "Aarav Sharma",
    phone: "+91 98100 41122",
    address: "Vasant Kunj, New Delhi",
    email: "aarav@student.gvps.in",
    schoolName: "Green Valley Public School",
    standard: "10",
    section: "A",
    experience: "1to3",
    experienceLabel: "1–3 years regular riding",
    accessCode: "RS-DEMO01",
  },
  "RS-DEMO02": {
    id: "std-02",
    name: "Diya Verma",
    phone: "+91 98100 41983",
    address: "Sector 9, Vasant Vihar",
    email: "diya@student.gvps.in",
    schoolName: "Green Valley Public School",
    standard: "10",
    section: "A",
    experience: "lt1",
    experienceLabel: "Under 1 year",
    accessCode: "RS-DEMO02",
  },
  "RS-DEMO07": {
    id: "std-07",
    name: "Arjun Patil",
    phone: "+91 98220 61120",
    address: "Kothrud, Pune",
    email: "arjun@stmarys.edu.in",
    schoolName: "St. Mary's High School",
    standard: "11",
    section: "A",
    experience: "lt1",
    experienceLabel: "Under 1 year",
    accessCode: "RS-DEMO07",
  },
};
