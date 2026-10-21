// Meridian spaceflight briefing data. All facts as of LAST_UPDATE_ISO.
// RULES:
//  1. Every entry's `orgs` must reference ids in ORG_IDS. This is enforced at
//     compile time (OrgId union type) and at runtime by validateBriefing().
//  2. An organization appears in EVERY function where it has a role.
//     validateBriefing() also checks each org is used at least once.
//  3. Use status "open" whenever no date is firm. Never invent launch dates.

export const LAST_UPDATE_ISO = "2026-10-21";

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
  /** Optional measured distances (deep-space entries), with the time they apply to. */
  distances?: { from: "Earth" | "Sun"; au: number; km: number; mi: number }[];
  distancesAsOf?: string;
}

/** The 8 "jobs" on the home map. */
export type FunctionId =
  | "flying-people" | "stations" | "cargo" | "moon"
  | "launch" | "orbital-networks" | "suborbital" | "future-stations";

/** Sections outside the 8 jobs (shown below the map). */
export type SectionId = FunctionId | "deep-space";
export interface BriefingFunction { id: SectionId; title: string; entries: Entry[]; }
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
  { id: "voyager", name: "Voyager Technologies", country: "US", kind: "company", website: "https://voyagertechnologies.com", description: "Voyager Technologies; leads the Starlab joint venture and, since July 2026, owns lunar lander maker Astrobotic." },
  { id: "boeing", name: "Boeing", country: "US", kind: "company", website: "https://www.boeing.com/space", description: "Builds the Starliner crew capsule; ULA co-owner." },
  { id: "rocket-lab", name: "Rocket Lab", country: "US/NZ", kind: "company", website: "https://www.rocketlabcorp.com", description: "Small launch provider (Electron) developing medium-lift Neutron." },
  { id: "ula", name: "United Launch Alliance", country: "US", kind: "company", website: "https://www.ulalaunch.com", description: "United Launch Alliance; flies Atlas V and Vulcan Centaur." },
  { id: "amazon", name: "Amazon (Leo)", country: "US", kind: "company", website: "https://www.aboutamazon.com/what-we-do/devices-services/amazon-leo", description: "Building the Amazon Leo (formerly Project Kuiper) broadband constellation." },
  { id: "arianespace", name: "Arianespace", country: "Europe", kind: "company", website: "https://www.arianespace.com", description: "European launch operator flying Ariane 6." },
  { id: "virgin-galactic", name: "Virgin Galactic", country: "US", kind: "company", website: "https://www.virgingalactic.com", description: "Suborbital spaceplane operator developing Delta-class ships." },
  { id: "firefly", name: "Firefly Aerospace", country: "US", kind: "company", website: "https://fireflyspace.com", description: "Builds Alpha rocket and Blue Ghost lunar landers." },
  { id: "intuitive-machines", name: "Intuitive Machines", country: "US", kind: "company", website: "https://www.intuitivemachines.com", description: "Builds Nova-C lunar landers for NASA CLPS." },
  { id: "astrobotic", name: "Astrobotic", country: "US", kind: "company", website: "https://www.astrobotic.com", description: "Builds Peregrine/Griffin lunar landers for NASA CLPS; part of Voyager Technologies since July 2026." },
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
  { id: "nasa-eva100-101", publisher: "NASA", title: "NASA to Host News Conference Previewing US Spacewalks 100, 101 (Oct 14, 2026)", url: "https://www.nasa.gov/news-release/nasa-to-host-news-conference-previewing-us-spacewalks-100-101/" },
  { id: "nasa-blog-1019", publisher: "NASA", title: "Spacewalk Preps and Advanced Biomedical Research Begin Week (Oct 19, 2026)", url: "https://www.nasa.gov/blogs/spacestation/2026/10/19/spacewalk-preps-and-advanced-biomedical-research-begin-week/" },
  { id: "nasa-artemis-brief", publisher: "NASA", title: "NASA to Discuss Artemis Acceleration, Status of Upcoming Moon Missions (Oct 14, 2026)", url: "https://www.nasa.gov/news-release/nasa-to-discuss-artemis-acceleration-status-of-upcoming-moon-missions/" },
  { id: "nasa-a3-boosters", publisher: "NASA", title: "NASA Completes Artemis III Booster Stacking, Shares Status Update (Oct 13, 2026)", url: "https://www.nasa.gov/blogs/missions/2026/10/13/nasa-completes-artemis-iii-booster-stacking-shares-status-update/" },
  { id: "nasa-hls-iac", publisher: "NASA (NTRS)", title: "NASA's Human Landing System — IAC 2026 paper (Creech)", url: "https://ntrs.nasa.gov/api/citations/20260008717/downloads/HLS%20IAC%202026%20FINAL.pdf" },
  { id: "jaxa-mmx", publisher: "JAXA", title: "Launch result of MMX aboard H3 flight No.10 (Oct 20, 2026)", url: "https://global.jaxa.jp/press/2026/10/20261020-1_e.html" },
  { id: "rklb-neutron", publisher: "Rocket Lab", title: "Rocket Lab adjusts Neutron target launch timing to 2027 (Oct 14, 2026)", url: "https://investors.rocketlabcorp.com/news-releases/news-release-details/rocket-lab-provides-update-neutron-development-and-adjusts" },
  { id: "ars-rr-vulcan", publisher: "Ars Technica", title: "Rocket Report: Vulcan return to flight NET Oct 29 with Amazon Leo (Oct 9, 2026)", url: "https://arstechnica.com/space/2026/10/rocket-report-a-rare-falcon-9-scrub-is-it-just-about-vulcans-time-to-shine/" },
  { id: "sfn-new-glenn", publisher: "Spaceflight Now", title: "Blue Origin to add new Florida launch pads; New Glenn return before year-end (Oct 16, 2026)", url: "https://spaceflightnow.com/2026/10/16/blue-origin-to-add-new-florida-launch-pads-seeks-aggressive-increase-in-new-glenn-flight-rate/" },
  { id: "atv-starship15", publisher: "Advanced Television", title: "Starship Flight 15 scheduled for November with dual catch (Oct 20, 2026)", url: "https://www.advanced-television.com/2026/10/20/starship-15-scheduled-for-november-with-dual-catch/" },
  { id: "voyager-griffin1", publisher: "Voyager Technologies", title: "Voyager's Griffin-1 On Track for the Moon (Oct 13, 2026)", url: "https://investors.voyagertechnologies.com/news/news-details/2026/Voyagers-Griffin-1-On-Track-for-the-Moon/default.aspx" },
  { id: "aiaa-moonbase", publisher: "Aerospace America", title: "NASA expects one lunar launch this year, Moon Base manager says (Sep 15, 2026)", url: "https://aerospaceamerica.aiaa.org/nasa-expects-one-lunar-launch-this-year-moon-base-manager-says/" },
  { id: "cnsa-ce7", publisher: "CNSA", title: "嫦娥七号任务不满足发射条件 不能在今年预定窗口实施 (Chang'e-7 cannot launch in this year's window)", url: "https://www.cnsa.gov.cn/n6758823/n6758838/c10770822/content.html" },
  { id: "chinadaily-ce7-lm5", publisher: "China Daily", title: "Long March 5 rocket arrives for Chang'e 7 lunar mission (Oct 14, 2026)", url: "https://govt.chinadaily.com.cn/s/202610/14/WS6acee67e498e23165e07383f/long-march-5-rocket-arrives-for-change-7-lunar-mission.html" },
  { id: "cmse-tz10", publisher: "CMSA", title: "Tianzhou-10 mission (launched May 11, 2026)", url: "https://en.cmse.gov.cn/missions/tianzhou10/" },
  { id: "aiaa-dream-chaser", publisher: "Aerospace America", title: "After NASA contract change, Sierra Space seeks path forward for Dream Chaser (May 20, 2026)", url: "https://aerospaceamerica.aiaa.org/after-nasa-contract-change-sierra-space-seeks-path-forward-for-dream-chaser/" },
  { id: "interfax-ms30", publisher: "Interfax", title: "Soyuz MS-30 to launch to ISS in March 2027 — Cosmonaut Training Center (Aug 14, 2026)", url: "https://www.interfax.com/newsroom/top-stories/118712/" },
  { id: "spacenews-sz24", publisher: "SpaceNews", title: "China sets up busy Q4 manifest; Shenzhou-24 likely around November", url: "https://spacenews.com/china-launches-guowang-yaogan-40-satellites-sets-up-busy-q4-manifest/" },
  { id: "vast-esa-mou", publisher: "Vast", title: "ESA and Vast strengthen cooperation for post-ISS era; Haven-1 launch anticipated 2027 (Oct 6, 2026)", url: "https://www.vastspace.com/updates/esa-vast-mou-post-iss-cooperation" },
  { id: "voyager-starlab", publisher: "Voyager Technologies", title: "Starlab Space Station", url: "https://voyagertechnologies.com/starlab/" },
  { id: "nasa-cldc", publisher: "NASA", title: "Commercial LEO Destination Contract (CLDC) procurement page", url: "https://www.nasa.gov/johnson/jsc-procurement/cldc/" },
  { id: "samgov-cldc", publisher: "SAM.gov", title: "CLDC final RFP 80JSC026R0021 (questions due Oct 21, 2026, 1:00 PM CT)", url: "https://sam.gov/workspace/contract/opp/aee4374189ab4118b3ec0dcb00ae8408/view" },
  { id: "jpl-horizons", publisher: "NASA JPL", title: "JPL Horizons ephemeris API (Voyager 1 = -31, Voyager 2 = -32; observer range at 2026-10-21 13:00 UTC)", url: "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='-31'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='2026-10-21%2013:00'&STOP_TIME='2026-10-21%2014:00'&STEP_SIZE='1h'&QUANTITIES='20'" },
  { id: "nasa-voyager-where", publisher: "NASA", title: "Where Are Voyager 1 and Voyager 2 Now? (live tracker)", url: "https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/" },
  { id: "nasa-crs35-dock", publisher: "NASA", title: "SpaceX Dragon Docks with Science, Supplies, and Roll-Out Solar Arrays (Oct 15, 2026)", url: "https://www.nasa.gov/blogs/spacestation/2026/10/15/spacex-dragon-docks-with-science-supplies-and-roll-out-solar-arrays/" },
];

export const FUNCTIONS: BriefingFunction[] = [
  { id: "flying-people", title: "Flying people", entries: [
    { id: "iss-crew13", title: "ISS — SpaceX Crew-13", status: "active", when: "Arrived Oct 1, 2026; stays to spring 2027",
      detail: "Jessica Watkins, Luke Delaney (NASA), Joshua Kutryk (CSA), Sergey Teteryatnikov (Roscosmos). Expedition 75. Kutryk joins Anil Menon for US spacewalks 100 (Oct 29) and 101 (Nov 5).",
      orgs: ["nasa", "spacex", "csa", "roscosmos"], sources: ["nasa-crew13", "nasa-eva100-101"] },
    { id: "iss-ms29", title: "ISS — Soyuz MS-29", status: "active", when: "Docked Jul 14, 2026; return planned April 2027",
      detail: "Anil Menon (NASA), Pyotr Dubrov, Anna Kikina (Roscosmos). Seven people aboard ISS after Crew-12's departure.",
      orgs: ["roscosmos", "nasa"], sources: ["nasa-ms29", "nasa-vv"] },
    { id: "tiangong-sz23", title: "Tiangong — Shenzhou-23", status: "active", when: "Launched May 24, 2026",
      detail: "Zhu Yangzhu (cmdr), Zhang Zhiyuan, Li Jiaying (Lai Ka-ying, first Hong Kong astronaut). One crew member is expected to stay on for a year-long mission (reported, not confirmed by CMSA).",
      orgs: ["cmsa"], sources: ["xinhua-sz23"] },
    { id: "crew12-return", title: "Crew-12 splashdown", status: "complete", when: "Oct 8, 2026",
      detail: "Jessica Meir, Jack Hathaway (NASA), Sophie Adenot (ESA), Andrey Fedyaev (Roscosmos) returned.",
      orgs: ["nasa", "spacex", "esa", "roscosmos"], sources: ["nasa-vv", "nasa-crew13"] },
  ].map((e) => ({ ...e, group: "In orbit now" } as Entry)).concat([
    { id: "starliner-1", title: "Boeing Starliner-1 (uncrewed)", status: "open", when: "~Dec 2026 / Jan 2027 (not firm)",
      detail: "Uncrewed flight to ISS to test thruster and propulsion fixes ahead of crewed certification.", orgs: ["boeing", "nasa", "ula"], sources: ["prior-brief"] },
    { id: "starliner-2", title: "Boeing Starliner-2 (crewed)", status: "open", when: "Mid-2028 (not firm)",
      detail: "First crewed rotation-class Starliner flight.", orgs: ["boeing", "nasa", "ula"], sources: ["prior-brief"] },
    { id: "artemis-3", title: "Artemis III — LEO docking test", status: "open", when: "NET June 2027 (NASA: 2027)",
      detail: "Four astronauts in low Earth orbit to rendezvous and dock with Blue Origin and SpaceX lander test articles. SLS boosters fully stacked; core stage next joins them in the \"short stack.\" NASA Artemis update briefing Fri Oct 23, 1:00 PM CT.",
      orgs: ["nasa", "spacex", "blue-origin", "esa"], sources: ["nasa-artemis-brief", "nasa-a3-boosters", "nasa-hls-iac", "prior-brief"] },
    { id: "ms30", title: "Soyuz MS-30", status: "open", when: "March 2027 (Cosmonaut Training Center; no exact date)",
      detail: "Dmitry Petelin, Konstantin Borisov (Roscosmos), Deniz Burnham (NASA). Replaces MS-29.",
      orgs: ["roscosmos", "nasa"], sources: ["interfax-ms30", "nasa-ms29"] },
    { id: "sz24", title: "Shenzhou-24", status: "open", when: "Around late November (reported; no official date)",
      detail: "Next Tiangong rotation from Jiuquan. Crew expected, not confirmed, to include a Pakistani payload specialist — first foreign visitor to Tiangong.",
      orgs: ["cmsa"], sources: ["spacenews-sz24", "xinhua-sz23"] },
  ].map((e) => ({ ...e, group: "Upcoming crew flights" } as Entry)))},
  { id: "stations", title: "Stations", entries: [
    { id: "iss", title: "International Space Station", status: "active",
      detail: "Expedition 75, seven aboard. Attached: Crew-13 Dragon, Soyuz MS-29, Progress 95 & 96, CRS-35 Cargo Dragon (Harmony zenith). US spacewalk 100 (Thu Oct 29) and 101 (Thu Nov 5): Menon and Kutryk install the 7th and 8th (final) IROSA solar arrays, raising capacity from 160 kW to ~215 kW.",
      orgs: ["nasa", "roscosmos", "esa", "jaxa", "csa"], sources: ["nasa-vv", "nasa-crs35-dock", "nasa-eva100-101", "nasa-blog-1019"] },
    { id: "tiangong", title: "Tiangong", status: "active", detail: "Crewed by Shenzhou-23.", orgs: ["cmsa"], sources: ["xinhua-sz23"] },
  ]},
  { id: "cargo", title: "Cargo", entries: [
    { id: "crs-35", title: "SpaceX CRS-35 (Cargo Dragon)", status: "active", when: "Launched Oct 13, 5:33 AM CT; docked Oct 15 ~10 AM CT",
      detail: "Docked to Harmony space-facing port. Delivered the last pair of IROSA solar arrays (spacewalks Oct 29 and Nov 5); stays into November.", orgs: ["spacex", "nasa"], sources: ["nasa-crs35-dock", "nasa-vv", "nasa-eva100-101"] },
    { id: "progress", title: "Progress 95 & 96", status: "active", when: "P96 docked Sep 19, 2026",
      detail: "Both attached to ISS.", orgs: ["roscosmos"], sources: ["nasa-vv"] },
    { id: "ng-24", title: "Cygnus NG-24", status: "complete", when: "Released Oct 9, 2026",
      detail: "Next Cygnus not dated.", orgs: ["northrop-grumman", "nasa"], sources: ["nasa-vv"] },
    { id: "htv-x2", title: "JAXA HTV-X2", status: "open", when: "NASA: NET Sep 2026; JAXA: FY2026 or later",
      detail: "H3 from Tanegashima. No firm date.", orgs: ["jaxa", "nasa"], sources: ["nasa-htvx2", "jaxa-schedule"] },
    { id: "dream-chaser", title: "Sierra Space Dream Chaser", status: "open", when: "Company target: year-end 2026 (not firm)",
      detail: "First flight is a free-flyer demo (no ISS docking) on ULA Vulcan, landing at Vandenberg. Depends on Vulcan availability.", orgs: ["sierra-space", "ula", "nasa"], sources: ["aiaa-dream-chaser"] },
    { id: "tianzhou", title: "Tianzhou-10 (Tiangong cargo)", status: "active", when: "Launched May 11, 2026",
      detail: "Docked at Tianhe aft port with ~6.2 t of supplies; planned to stay about 12 months. Next Tianzhou not dated.", orgs: ["cmsa"], sources: ["cmse-tz10"] },
  ]},
  { id: "moon", title: "The Moon", entries: [
    { id: "griffin-1", title: "Astrobotic Griffin-1", status: "open", when: "Targeted late 2026",
      detail: "Completed acceptance testing (Oct 13); returning to Pittsburgh before shipping to Cape Canaveral. Falcon Heavy (CLPS), 10 payloads incl. Astrolab FLIP rover, to Mons Mouton near the south pole. Astrobotic is now part of Voyager Technologies (acquired July 2026).",
      orgs: ["astrobotic", "voyager", "spacex", "nasa", "esa"], sources: ["voyager-griffin1", "aiaa-moonbase"] },
    { id: "blue-moon-mk1", title: "Blue Moon MK1 pathfinder", status: "open", when: "Early 2027 (target)",
      detail: "\"Endurance\" is assembled; depends on New Glenn return to flight.", orgs: ["blue-origin", "nasa"], sources: ["aiaa-moonbase", "prior-brief"] },
    { id: "artemis-3-l", title: "Artemis III (LEO docking test)", status: "open", when: "NET June 2027",
      detail: "Tests HLS docking in LEO before crewed landings, which NASA plans for Artemis IV (early 2028) and Artemis V (late 2028). Both landers must first make uncrewed lunar landing demos.", orgs: ["nasa", "spacex", "blue-origin"], sources: ["nasa-hls-iac", "prior-brief"] },
    { id: "change-7", title: "Chang'e-7 (lunar south pole)", status: "open", when: "Postponed Aug 23, 2026; partners cite early 2027",
      detail: "China said it could not fly in its 2026 window; no official new date. Long March 5 has arrived at Wenchang.", orgs: ["cnsa"], sources: ["cnsa-ce7", "reuters-ce7", "chinadaily-ce7-lm5"] },
    { id: "im-next", title: "Intuitive Machines IM-3 (Nova-C \"Trinity\")", status: "open", when: "First part of 2027 (CEO: Q1 2027)",
      detail: "In final assembly; heading to Reiner Gamma.", orgs: ["intuitive-machines", "nasa"], sources: ["aiaa-moonbase"] },
    { id: "firefly-bg2", title: "Firefly Blue Ghost Mission 2", status: "open", when: "Later in 2027 (NASA)", detail: "Far-side lander.",
      orgs: ["firefly", "nasa", "esa"], sources: ["aiaa-moonbase"] },
    { id: "chandrayaan", title: "ISRO lunar program", status: "open", detail: "Next Chandrayaan mission date not verified.", orgs: ["isro", "jaxa"], sources: [] },
  ]},
  { id: "launch", title: "Launch", entries: [
    { id: "falcon", title: "Falcon 9 / Falcon Heavy", status: "flying", detail: "Launched CRS-35 Oct 13; Falcon Heavy flew NROL-97 Oct 1.", orgs: ["spacex"], sources: ["nasa-vv"] },
    { id: "starship", title: "Starship", status: "flying", when: "Flight 14: Sep 28, 2026 · Flight 15 reported for ~Nov 8 (not firm)",
      detail: "Flight 14 reached orbit and deployed 26 Starlink V3 satellites. Flight 15 reportedly will try to catch both booster and ship.", orgs: ["spacex"], sources: ["prior-brief", "atv-starship15"] },
    { id: "new-glenn", title: "New Glenn", status: "grounded", when: "Return to flight targeted December 2026 (not firm)",
      detail: "Grounded after May 2026 pad explosion; LC-36A being rebuilt. Return flight to carry Blue Ring (per Bezos). FAA hearing Oct 22 on raising Cape cap from 12 to 50 flights/yr.", orgs: ["blue-origin"], sources: ["sfn-new-glenn", "prior-brief"] },
    { id: "vulcan", title: "Vulcan Centaur", status: "grounded", when: "Return to flight NET Oct 29, 2026 (reported; not confirmed by ULA)",
      detail: "Has not flown since a Feb 2026 solid-booster anomaly. Return flight is Amazon Leo LV-01; a second Amazon Vulcan is planned this year.", orgs: ["ula", "amazon"], sources: ["ars-rr-vulcan", "amazon-leo"] },
    { id: "atlas-v", title: "Atlas V", status: "flying", detail: "Last Amazon Leo Atlas launch LA-08 on Jul 2, 2026.", orgs: ["ula", "amazon"], sources: ["amazon-leo"] },
    { id: "ariane-6", title: "Ariane 6", status: "flying", when: "VA271 NET Nov 23, 2026", detail: "10th flight carries 36 Amazon Leo sats.", orgs: ["arianespace", "esa", "amazon"], sources: ["arianespace-le04"] },
    { id: "soyuz-2", title: "Soyuz-2", status: "flying", detail: "Launched MS-29 and Progress 96.", orgs: ["roscosmos"], sources: ["nasa-vv"] },
    { id: "electron-neutron", title: "Electron / Neutron", status: "open", when: "Neutron debut now expected in 2027",
      detail: "Electron flying; Rocket Lab moved Neutron's first launch from 2026 to 2027 (Oct 14).", orgs: ["rocket-lab"], sources: ["rklb-neutron"] },
    { id: "h3", title: "H3", status: "flying", when: "Flight 10: Oct 20, 2026 (JST)",
      detail: "Launched JAXA's MMX Mars-moons sample-return probe successfully. Also the launcher for HTV-X.", orgs: ["jaxa"], sources: ["jaxa-mmx", "jaxa-schedule"] },
  ]},
  { id: "orbital-networks", title: "Orbital networks", entries: [
    { id: "starlink", title: "Starlink", status: "active", detail: "V3 satellites now deploying from Starship (Flight 14: 26 V3).", orgs: ["spacex"], sources: ["prior-brief"] },
    { id: "amazon-leo", title: "Amazon Leo (formerly Project Kuiper)", status: "active", when: "Next: Vulcan LV-01 reported NET Oct 29; Ariane 6 LE-04 NET Nov 23, 2026",
      detail: "396 satellites deployed across 14 launches (latest Jul 2). Initial service still planned for 2026, no date.",
      orgs: ["amazon", "arianespace", "ula", "spacex", "blue-origin"], sources: ["amazon-leo", "arianespace-le04", "ars-rr-vulcan"] },
  ]},
  { id: "suborbital", title: "Suborbital flight", entries: [
    { id: "new-shepard", title: "Blue Origin New Shepard", status: "paused", when: "Paused ≥2 years from Jan 2026",
      detail: "Last flight NS-38 on Jan 22, 2026.", orgs: ["blue-origin"], sources: ["spacedaily-subo"] },
    { id: "vg-delta", title: "Virgin Galactic Delta", status: "open", when: "Commercial service targeted Feb 2027",
      detail: "Flight test (captive carry) planned to begin Oct 2026; second ship Mar 2027.", orgs: ["virgin-galactic"], sources: ["vg-q2"] },
  ]},
  { id: "future-stations", title: "Stations not in orbit yet", entries: [
    { id: "cld-rfp", title: "NASA Commercial LEO Destinations Phase 2", status: "open", when: "Final RFP Oct 9; industry questions due Oct 21 (1 PM CT); proposals due Dec 8, 2026; awards ~Apr 15, 2027",
      detail: "Competition (CLDC) to succeed ISS.", orgs: ["nasa", "axiom", "vast", "starlab", "voyager", "blue-origin", "sierra-space"], sources: ["samgov-cldc", "nasa-cldc", "prior-brief"] },
    { id: "haven-1", title: "Vast Haven-1", status: "open", when: "2027 (Vast, Oct 6); earlier guidance Q1 2027",
      detail: "Single-module station, Falcon 9. ESA's Arnaud Prost confirmed for a Haven-1 mission.", orgs: ["vast", "spacex", "esa"], sources: ["vast-esa-mou", "prior-brief"] },
    { id: "axiom-station", title: "Axiom Station modules", status: "open", when: "2028 / 2029", detail: "Modules initially attach to ISS.", orgs: ["axiom", "nasa"], sources: ["prior-brief"] },
    { id: "starlab-st", title: "Starlab", status: "open", detail: "Voyager-led JV (with Airbus, Mitsubishi, MDA Space); launches fully outfitted on a single Starship flight before ISS retirement. No firm date verified.", orgs: ["starlab", "voyager", "spacex", "esa"], sources: ["voyager-starlab"] },
    { id: "orbital-reef", title: "Orbital Reef", status: "open", detail: "Blue Origin / Sierra Space concept; no date.", orgs: ["blue-origin", "sierra-space"], sources: [] },
  ]},
];

/** Outside the 8 jobs: humanity's farthest spacecraft. Distances from JPL Horizons
 *  (observer range, quantity 20) at 2026-10-21 13:00 UTC = 8:00 AM CT. 1 AU = 149,597,870.7 km. */
export const DEEP_SPACE: BriefingFunction = { id: "deep-space", title: "Deep space: Voyager", entries: [
  { id: "voyager-1", title: "Voyager 1", status: "active", when: "Launched Sep 5, 1977; in interstellar space since Aug 2012",
    detail: "Farthest human-made object. Radio signals take about 23.9 hours one way. Operated by NASA JPL.",
    distances: [
      { from: "Earth", au: 172.64, km: 25_827_130_000, mi: 16_048_235_000 },
      { from: "Sun", au: 172.11, km: 25_746_944_000, mi: 15_998_410_000 },
    ], distancesAsOf: "Oct 21, 2026, 8:00 AM CT (13:00 UTC)",
    orgs: ["nasa"], sources: ["jpl-horizons", "nasa-voyager-where"] },
  { id: "voyager-2", title: "Voyager 2", status: "active", when: "Launched Aug 20, 1977; in interstellar space since Nov 2018",
    detail: "Only spacecraft to visit Uranus and Neptune. Radio signals take about 20.0 hours one way. Operated by NASA JPL.",
    distances: [
      { from: "Earth", au: 144.36, km: 21_595_335_000, mi: 13_418_719_000 },
      { from: "Sun", au: 144.26, km: 21_580_514_000, mi: 13_409_510_000 },
    ], distancesAsOf: "Oct 21, 2026, 8:00 AM CT (13:00 UTC)",
    orgs: ["nasa"], sources: ["jpl-horizons", "nasa-voyager-where"] },
]};

/** The 8 jobs plus sections shown below the map. */
export const ALL_SECTIONS: BriefingFunction[] = [...FUNCTIONS, DEEP_SPACE];

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
  for (const f of ALL_SECTIONS) for (const e of f.entries) {
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
  return ALL_SECTIONS.map((f) => ({ fn: f, entries: f.entries.filter((e) => e.orgs.includes(id)) })).filter((r) => r.entries.length);
}

export const ALL_ENTRIES = ALL_SECTIONS.flatMap((f) => f.entries.map((e) => ({ ...e, fnId: f.id, fnTitle: f.title })));
export const findEntry = (id: string) => ALL_ENTRIES.find((e) => e.id === id);
