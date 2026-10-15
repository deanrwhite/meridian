// Meridian spaceflight briefing data. All facts as of LAST_UPDATE_ISO.
// RULES:
//  1. Every entry's `orgs` must reference ids in ORG_IDS. This is enforced at
//     compile time (OrgId union type) and at runtime by validateBriefing().
//  2. An organization appears in EVERY function where it has a role.
//     validateBriefing() also checks each org is used at least once.
//  3. Use status "open" whenever no date is firm. Never invent launch dates.

export const LAST_UPDATE_ISO = "2026-10-15";

export const ORG_IDS = [
  "nasa", "spacex", "blue-origin", "esa", "roscosmos", "cnsa", "cmsa", "jaxa",
  "csa", "isro", "axiom", "vast", "starlab", "voyager", "boeing", "rocket-lab",
  "ula", "amazon", "arianespace", "virgin-galactic", "firefly",
  "intuitive-machines", "astrobotic", "northrop-grumman", "sierra-space",
] as const;
export type OrgId = (typeof ORG_IDS)[number];

export type OrgKind = "agency" | "company";
export interface Organization { id: OrgId; name: string; country: string; kind: OrgKind; website: string; description: string; }

export type Status =
  | "active"     // happening / in orbit now
  | "scheduled"  // firm date announced by primary source
  | "open"       // no firm date
  | "flying"     // vehicle operational
  | "grounded"   // vehicle stood down
  | "paused"     // program paused
  | "complete";  // recently finished

export interface Entry {
  id: string;
  title: string;
  status: Status;
  /** Human-readable timing exactly as stated by sources; omit if unknown. */
  when?: string;
  detail: string;
  orgs: OrgId[];
  sources: string[]; // ids into SOURCES
  /** Optional sub-group within a job, e.g. "In orbit now" / "Upcoming crew flights". */
  group?: string;
}

/** The 8 "jobs" on the home map. */
export type FunctionId =
  | "flying-people" | "stations" | "cargo" | "moon"
  | "launch" | "orbital-networks" | "suborbital" | "future-stations";

export interface BriefingFunction { id: FunctionId; title: string; entries: Entry[]; }
export interface Source { id: string; title: string; url: string; publisher: string; }

export const ORGANIZATIONS: Organization[] = [
  { id: "nasa", name: "NASA", country: "US", kind: "agency", website: "https://www.nasa.gov", description: "US civil space agency; runs ISS operations, Artemis, CLPS and commercial station programs." },
  { id: "spacex", name: "SpaceX", country: "US", kind: "company", website: "https://www.spacex.com", description: "Builds Falcon 9/Heavy, Dragon and Starship; operates Starlink." },
  { id: "blue-origin", name: "Blue Origin", country: "US", kind: "company", website: "https://www.blueorigin.com", description: "Builds New Glenn, New Shepard and the Blue Moon lunar lander." },
  { id: "esa", name: "ESA", country: "Europe", kind: "agency", website: "https://www.esa.int", description: "European Space Agency; ISS partner and Artemis contributor." },
  { id: "roscosmos", name: "Roscosmos", country: "Russia", kind: "agency", website: "https://www.roscosmos.ru", description: "Russian state space corporation; flies Soyuz crew and Progress cargo ships." },
  { id: "cnsa", name: "CNSA", country: "China", kind: "agency", website: "https://www.cnsa.gov.cn/english/", description: "China's national space agency; leads the Chang'e lunar program." },
  { id: "cmsa", name: "China Manned Space Agency", country: "China", kind: "agency", website: "https://www.cmse.gov.cn", description: "China Manned Space Agency; runs Shenzhou crews and the Tiangong station." },
  { id: "jaxa", name: "JAXA", country: "Japan", kind: "agency", website: "https://global.jaxa.jp", description: "Japan's space agency; HTV-X cargo ship and H3 rocket." },
  { id: "csa", name: "Canadian Space Agency", country: "Canada", kind: "agency", website: "https://www.asc-csa.gc.ca/eng/", description: "Canadian Space Agency; ISS partner (Canadarm2) and Artemis contributor." },
  { id: "isro", name: "ISRO", country: "India", kind: "agency", website: "https://www.isro.gov.in", description: "Indian Space Research Organisation; Chandrayaan lunar and Gaganyaan crew programs." },
  { id: "axiom", name: "Axiom Space", country: "US", kind: "company", website: "https://www.axiomspace.com", description: "Commercial company building Axiom Station modules and flying private astronaut missions." },
  { id: "vast", name: "Vast", country: "US", kind: "company", website: "https://www.vastspace.com", description: "Commercial station company building Haven-1." },
  { id: "starlab", name: "Starlab Space", country: "US", kind: "company", website: "https://starlab-space.com", description: "Joint venture developing the Starlab commercial station." },
  { id: "voyager", name: "Voyager Technologies", country: "US", kind: "company", website: "https://voyagertechnologies.com", description: "Voyager Technologies; leads the Starlab joint venture." },
  { id: "boeing", name: "Boeing", country: "US", kind: "company", website: "https://www.boeing.com/space", description: "Builds the Starliner crew capsule; ULA co-owner." },
  { id: "rocket-lab", name: "Rocket Lab", country: "US/NZ", kind: "company", website: "https://www.rocketlabcorp.com", description: "Small launch provider (Electron) developing medium-lift Neutron." },
  { id: "ula", name: "United Launch Alliance", country: "US", kind: "company", website: "https://www.ulalaunch.com", description: "United Launch Alliance; flies Atlas V and Vulcan Centaur." },
  { id: "amazon", name: "Amazon (Leo)", country: "US", kind: "company", website: "https://www.aboutamazon.com/what-we-do/devices-services/amazon-leo", description: "Building the Amazon Leo (formerly Project Kuiper) broadband constellation." },
  { id: "arianespace", name: "Arianespace", country: "Europe", kind: "company", website: "https://www.arianespace.com", description: "European launch operator flying Ariane 6." },
  { id: "virgin-galactic", name: "Virgin Galactic", country: "US", kind: "company", website: "https://www.virgingalactic.com", description: "Suborbital spaceplane operator developing Delta-class ships." },
  { id: "firefly", name: "Firefly Aerospace", country: "US", kind: "company", website: "https://fireflyspace.com", description: "Builds Alpha rocket and Blue Ghost lunar landers." },
  { id: "intuitive-machines", name: "Intuitive Machines", country: "US", kind: "company", website: "https://www.intuitivemachines.com", description: "Builds Nova-C lunar landers for NASA CLPS." },
  { id: "astrobotic", name: "Astrobotic", country: "US", kind: "company", website: "https://www.astrobotic.com", description: "Builds Peregrine/Griffin lunar landers for NASA CLPS." },
  { id: "northrop-grumman", name: "Northrop Grumman", country: "US", kind: "company", website: "https://www.northropgrumman.com/space", description: "Builds the Cygnus ISS cargo spacecraft." },
  { id: "sierra-space", name: "Sierra Space", country: "US", kind: "company", website: "https://www.sierraspace.com", description: "Builds the Dream Chaser spaceplane; Orbital Reef partner." },
];

export const SOURCES: Source[] = [
  { id: "nasa-crew13", publisher: "NASA", title: "Crew-13 Members Enter Station, Join Expedition 75 (Oct 1, 2026)", url: "https://www.nasa.gov/blogs/spacestation/2026/10/01/crew-13-members-enter-station-join-expedition-75/" },
  { id: "nasa-vv", publisher: "NASA", title: "ISS Visiting Vehicles log", url: "https://www.nasa.gov/international-space-station/space-station-visiting-vehicles/" },
  { id: "nasa-ms29", publisher: "NASA", title: "Soyuz MS-29 docks to station (Jul 14, 2026)", url: "https://www.nasa.gov/blogs/spacestation/2026/07/14/soyuz-docks-to-station-hatches-open-soon-for-crew-greeting/" },
  { id: "nasa-htvx2", publisher: "NASA", title: "JAXA HTV-X2 event page", url: "https://www.nasa.gov/event/jaxa-htv-x2/" },
  { id: "jaxa-schedule", publisher: "JAXA", title: "JAXA Launch Schedule", url: "https://global.jaxa.jp/projects/in_progress.html" },
  { id: "xinhua-sz23", publisher: "Xinhua", title: "Shenzhou-23 astronauts send National Day greetings (Oct 1, 2026)", url: "https://english.news.cn/20261001/1974e2fe956844f5a75713fbea2f9d99/c.html" },
  { id: "reuters-ce7", publisher: "Reuters", title: "China postpones Chang'e-7 lunar mission (Aug 23, 2026)", url: "https://www.reuters.com/science/china-postpones-change-7-lunar-mission-2026-08-23/" },
  { id: "amazon-leo", publisher: "Amazon", title: "Amazon Leo mission updates (updated Oct 14, 2026)", url: "https://www.aboutamazon.com/news/innovation-at-amazon/project-kuiper-satellite-rocket-launch-progress-updates" },
  { id: "arianespace-le04", publisher: "Arianespace", title: "Arianespace to launch 36 Amazon Leo satellites NET Nov 23", url: "https://newsroom.arianespace.com/arianespace-to-launch-36-amazon-leo-satellites-on-november-23-at-the-earliest-for-10th-ariane-6-flight/" },
  { id: "vg-q2", publisher: "Virgin Galactic", title: "Q2 2026 results and business update", url: "https://www.virgingalactic.com/news/virgin-galactic-announces-second-quarter-2026-financial-results-and-provides-business-update" },
  { id: "spacedaily-subo", publisher: "SpaceDaily", title: "Suborbital tourism: Blue Origin and Virgin Galactic pause", url: "https://spacedaily.com/t-suborbital-space-tourism-blue-origin-virgin-galactic-pause/" },
  { id: "prior-brief", publisher: "Meridian prior verified brief", title: "Previously verified weekly brief (Crew-12/13, CRS-35, Starliner, Starship, New Glenn, Artemis, CLD RFP, Haven-1, Axiom, Griffin-1, Blue Moon)", url: "https://www.nasa.gov/" },
  { id: "nasa-crs35-dock", publisher: "NASA", title: "SpaceX Dragon Docks with Science, Supplies, and Roll-Out Solar Arrays (Oct 15, 2026)", url: "https://www.nasa.gov/blogs/spacestation/2026/10/15/spacex-dragon-docks-with-science-supplies-and-roll-out-solar-arrays/" },
];

export const FUNCTIONS: BriefingFunction[] = [
  { id: "flying-people", title: "Flying people", entries: [
    { id: "iss-crew13", title: "ISS — SpaceX Crew-13", status: "active", when: "Arrived Oct 1, 2026; stays to spring 2027",
      detail: "Jessica Watkins, Luke Delaney (NASA), Joshua Kutryk (CSA), Sergey Teteryatnikov (Roscosmos). Expedition 75.",
      orgs: ["nasa", "spacex", "csa", "roscosmos"], sources: ["nasa-crew13"] },
    { id: "iss-ms29", title: "ISS — Soyuz MS-29", status: "active", when: "Docked Jul 14, 2026; return planned April 2027",
      detail: "Anil Menon (NASA), Pyotr Dubrov, Anna Kikina (Roscosmos). Seven people aboard ISS after Crew-12's departure.",
      orgs: ["roscosmos", "nasa"], sources: ["nasa-ms29", "nasa-vv"] },
    { id: "tiangong-sz23", title: "Tiangong — Shenzhou-23", status: "active", when: "Launched May 24, 2026",
      detail: "Zhu Yangzhu (cmdr), Zhang Zhiyuan, Li Jiaying (Lai Ka-ying, first Hong Kong astronaut).",
      orgs: ["cmsa"], sources: ["xinhua-sz23"] },
    { id: "crew12-return", title: "Crew-12 splashdown", status: "complete", when: "Oct 8, 2026",
      detail: "Jessica Meir, Jack Hathaway (NASA), Sophie Adenot (ESA), Andrey Fedyaev (Roscosmos) returned.",
      orgs: ["nasa", "spacex", "esa", "roscosmos"], sources: ["nasa-vv", "nasa-crew13"] },
  ].map((e) => ({ ...e, group: "In orbit now" } as Entry)).concat([
    { id: "starliner-1", title: "Boeing Starliner-1 (uncrewed)", status: "open", when: "~Dec 2026 / Jan 2027 (not firm)",
      detail: "Uncrewed cargo flight to ISS ahead of crewed certification.", orgs: ["boeing", "nasa", "ula"], sources: ["prior-brief"] },
    { id: "starliner-2", title: "Boeing Starliner-2 (crewed)", status: "open", when: "Mid-2028 (not firm)",
      detail: "First crewed rotation-class Starliner flight.", orgs: ["boeing", "nasa", "ula"], sources: ["prior-brief"] },
    { id: "artemis-3", title: "Artemis III — LEO docking test", status: "open", when: "NET June 2027",
      detail: "Restructured as a low-Earth-orbit crewed docking test. Artemis update briefing Oct 23, 2026.",
      orgs: ["nasa", "spacex", "blue-origin", "esa"], sources: ["prior-brief"] },
    { id: "ms30", title: "Soyuz MS-30", status: "open", detail: "Next Soyuz rotation; follows MS-29 (return planned April 2027). No date verified.",
      orgs: ["roscosmos", "nasa"], sources: ["nasa-ms29"] },
    { id: "sz24", title: "Shenzhou-24", status: "open", detail: "Next Tiangong rotation; no date announced.", orgs: ["cmsa"], sources: ["xinhua-sz23"] },
  ].map((e) => ({ ...e, group: "Upcoming crew flights" } as Entry)))},
  { id: "stations", title: "Stations", entries: [
    { id: "iss", title: "International Space Station", status: "active",
      detail: "Expedition 75. Attached: Crew-13 Dragon, Soyuz MS-29, Progress 95 & 96, CRS-35 Cargo Dragon (Harmony zenith).",
      orgs: ["nasa", "roscosmos", "esa", "jaxa", "csa"], sources: ["nasa-vv", "nasa-crs35-dock"] },
    { id: "tiangong", title: "Tiangong", status: "active", detail: "Crewed by Shenzhou-23.", orgs: ["cmsa"], sources: ["xinhua-sz23"] },
  ]},
  { id: "cargo", title: "Cargo", entries: [
    { id: "crs-35", title: "SpaceX CRS-35 (Cargo Dragon)", status: "active", when: "Launched Oct 13, 5:33 AM CT; docked Oct 15 ~10 AM CT",
      detail: "Docked to Harmony space-facing port. Carries the last pair of iROSA solar arrays; stay through mid-November.", orgs: ["spacex", "nasa"], sources: ["nasa-crs35-dock", "nasa-vv"] },
    { id: "progress", title: "Progress 95 & 96", status: "active", when: "P96 docked Sep 19, 2026",
      detail: "Both attached to ISS.", orgs: ["roscosmos"], sources: ["nasa-vv"] },
    { id: "ng-24", title: "Cygnus NG-24", status: "complete", when: "Released Oct 9, 2026",
      detail: "Next Cygnus not dated.", orgs: ["northrop-grumman", "nasa"], sources: ["nasa-vv"] },
    { id: "htv-x2", title: "JAXA HTV-X2", status: "open", when: "NASA: NET Sep 2026; JAXA: FY2026 or later",
      detail: "H3 from Tanegashima. No firm date.", orgs: ["jaxa", "nasa"], sources: ["nasa-htvx2", "jaxa-schedule"] },
    { id: "dream-chaser", title: "Sierra Space Dream Chaser", status: "open",
      detail: "First flight on ULA Vulcan; no primary-source date verified.", orgs: ["sierra-space", "ula", "nasa"], sources: [] },
    { id: "tianzhou", title: "Tianzhou (Tiangong cargo)", status: "open", detail: "Next Tianzhou not verified.", orgs: ["cmsa"], sources: [] },
  ]},
  { id: "moon", title: "The Moon", entries: [
    { id: "griffin-1", title: "Astrobotic Griffin-1", status: "open", when: "NET late 2026 (possibly Dec)",
      detail: "Launches on Falcon Heavy (CLPS).", orgs: ["astrobotic", "spacex", "nasa"], sources: ["prior-brief"] },
    { id: "blue-moon-mk1", title: "Blue Moon MK1 pathfinder", status: "open", when: "Jan 2027 (target)",
      detail: "Depends on New Glenn return to flight.", orgs: ["blue-origin", "nasa"], sources: ["prior-brief"] },
    { id: "artemis-3-l", title: "Artemis III (LEO docking test)", status: "open", when: "NET June 2027",
      detail: "Cislunar program milestone; tests HLS docking in LEO.", orgs: ["nasa", "spacex", "blue-origin"], sources: ["prior-brief"] },
    { id: "change-7", title: "Chang'e-7 (lunar south pole)", status: "open", when: "Postponed Aug 23, 2026; partners cite 2027",
      detail: "China said it could not fly in its 2026 window; no official new date.", orgs: ["cnsa"], sources: ["reuters-ce7"] },
    { id: "im-next", title: "Intuitive Machines next lander", status: "open", detail: "Next IM mission date not verified.",
      orgs: ["intuitive-machines", "nasa"], sources: [] },
    { id: "firefly-bg2", title: "Firefly Blue Ghost Mission 2", status: "open", detail: "Far-side lander; date not verified.",
      orgs: ["firefly", "nasa", "esa"], sources: [] },
    { id: "chandrayaan", title: "ISRO lunar program", status: "open", detail: "Next Chandrayaan mission date not verified.", orgs: ["isro", "jaxa"], sources: [] },
  ]},
  { id: "launch", title: "Launch", entries: [
    { id: "falcon", title: "Falcon 9 / Falcon Heavy", status: "flying", detail: "Launched CRS-35 Oct 13.", orgs: ["spacex"], sources: ["nasa-vv"] },
    { id: "starship", title: "Starship", status: "flying", when: "Flight 14: Sep 28, 2026",
      detail: "Flight 14 reached orbit and deployed 26 Starlink V3 satellites.", orgs: ["spacex"], sources: ["prior-brief"] },
    { id: "new-glenn", title: "New Glenn", status: "grounded", when: "Return to flight targeted 2026",
      detail: "Grounded after May 2026 pad explosion.", orgs: ["blue-origin"], sources: ["prior-brief"] },
    { id: "vulcan", title: "Vulcan Centaur", status: "flying", detail: "First Amazon Leo Vulcan launch (LV-01) said to be 'weeks away'; no firm date.", orgs: ["ula", "amazon"], sources: ["amazon-leo"] },
    { id: "atlas-v", title: "Atlas V", status: "flying", detail: "Last Amazon Leo Atlas launch LA-08 on Jul 2, 2026.", orgs: ["ula", "amazon"], sources: ["amazon-leo"] },
    { id: "ariane-6", title: "Ariane 6", status: "flying", when: "VA271 NET Nov 23, 2026", detail: "10th flight carries 36 Amazon Leo sats.", orgs: ["arianespace", "esa", "amazon"], sources: ["arianespace-le04"] },
    { id: "soyuz-2", title: "Soyuz-2", status: "flying", detail: "Launched MS-29 and Progress 96.", orgs: ["roscosmos"], sources: ["nasa-vv"] },
    { id: "electron-neutron", title: "Electron / Neutron", status: "open", detail: "Electron flying; Neutron debut date not verified.", orgs: ["rocket-lab"], sources: [] },
    { id: "h3", title: "H3", status: "flying", detail: "Launch vehicle for HTV-X.", orgs: ["jaxa"], sources: ["jaxa-schedule"] },
  ]},
  { id: "orbital-networks", title: "Orbital networks", entries: [
    { id: "starlink", title: "Starlink", status: "active", detail: "V3 satellites now deploying from Starship (Flight 14: 26 V3).", orgs: ["spacex"], sources: ["prior-brief"] },
    { id: "amazon-leo", title: "Amazon Leo (formerly Project Kuiper)", status: "active", when: "Next: LE-04 NET Nov 23, 2026",
      detail: "396 satellites deployed across 14 launches (latest Jul 2). Initial service still planned for 2026, no date.",
      orgs: ["amazon", "arianespace", "ula", "spacex", "blue-origin"], sources: ["amazon-leo", "arianespace-le04"] },
  ]},
  { id: "suborbital", title: "Suborbital flight", entries: [
    { id: "new-shepard", title: "Blue Origin New Shepard", status: "paused", when: "Paused ≥2 years from Jan 2026",
      detail: "Last flight NS-38 on Jan 22, 2026.", orgs: ["blue-origin"], sources: ["spacedaily-subo"] },
    { id: "vg-delta", title: "Virgin Galactic Delta", status: "open", when: "Commercial service targeted Feb 2027",
      detail: "Flight test (captive carry) planned to begin Oct 2026; second ship Mar 2027.", orgs: ["virgin-galactic"], sources: ["vg-q2"] },
  ]},
  { id: "future-stations", title: "Stations not in orbit yet", entries: [
    { id: "cld-rfp", title: "NASA Commercial LEO Destinations Phase 2", status: "open", when: "Final RFP Oct 9; proposals due Dec 8, 2026; awards ~Apr 15, 2027",
      detail: "Competition to succeed ISS.", orgs: ["nasa", "axiom", "vast", "starlab", "voyager", "blue-origin", "sierra-space"], sources: ["prior-brief"] },
    { id: "haven-1", title: "Vast Haven-1", status: "open", when: "Q1 2027", detail: "Single-module station, Falcon 9.", orgs: ["vast", "spacex"], sources: ["prior-brief"] },
    { id: "axiom-station", title: "Axiom Station modules", status: "open", when: "2028 / 2029", detail: "Modules initially attach to ISS.", orgs: ["axiom", "nasa"], sources: ["prior-brief"] },
    { id: "starlab-st", title: "Starlab", status: "open", detail: "Voyager-led JV; single launch on Starship. No firm date verified.", orgs: ["starlab", "voyager", "spacex", "esa"], sources: [] },
    { id: "orbital-reef", title: "Orbital Reef", status: "open", detail: "Blue Origin / Sierra Space concept; no date.", orgs: ["blue-origin", "sierra-space"], sources: [] },
  ]},
];

/** Following Wednesday strictly after the given ISO date (UTC-safe). */
export function nextWednesdayAfter(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  const add = ((3 - d.getUTCDay() + 7) % 7) || 7;
  d.setUTCDate(d.getUTCDate() + add);
  return d.toISOString().slice(0, 10);
}

/** Runtime validation: returns list of problems (empty = OK). */
export function validateBriefing(): string[] {
  const errs: string[] = [];
  const known = new Set<string>(ORGANIZATIONS.map((o) => o.id));
  const srcIds = new Set(SOURCES.map((s) => s.id));
  const used = new Set<string>();
  const entryIds = new Set<string>();
  for (const id of ORG_IDS) if (!known.has(id)) errs.push(`ORG_IDS has ${id} with no ORGANIZATIONS record`);
  for (const f of FUNCTIONS) for (const e of f.entries) {
    if (entryIds.has(e.id)) errs.push(`duplicate entry id ${e.id}`);
    entryIds.add(e.id);
    if (e.orgs.length === 0) errs.push(`${e.id} has no orgs`);
    for (const o of e.orgs) { if (!known.has(o)) errs.push(`${e.id} references unknown org ${o}`); used.add(o); }
    for (const s of e.sources) if (!srcIds.has(s)) errs.push(`${e.id} references unknown source ${s}`);
  }
  for (const o of ORGANIZATIONS) if (!used.has(o.id)) errs.push(`org ${o.id} has no role in any function`);
  return errs;
}

/** All roles for one org across functions. */
export function rolesFor(id: OrgId) {
  return FUNCTIONS.map((f) => ({ fn: f, entries: f.entries.filter((e) => e.orgs.includes(id)) })).filter((r) => r.entries.length);
}

export const ALL_ENTRIES = FUNCTIONS.flatMap((f) => f.entries.map((e) => ({ ...e, fnId: f.id, fnTitle: f.title })));
export const findEntry = (id: string) => ALL_ENTRIES.find((e) => e.id === id);
