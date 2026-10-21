import { validateBriefing, nextWednesdayAfter, LAST_UPDATE_ISO } from "../src/data/briefing.ts";
const errs = validateBriefing();
// Next update must be the Wednesday strictly after the last update, at most 7 days later.
const next = new Date(nextWednesdayAfter(LAST_UPDATE_ISO) + "T00:00:00Z");
const days = (next.getTime() - new Date(LAST_UPDATE_ISO + "T00:00:00Z").getTime()) / 86_400_000;
if (next.getUTCDay() !== 3 || days < 1 || days > 7) errs.push("next-update calc wrong");
if (nextWednesdayAfter("2026-10-21") !== "2026-10-28") errs.push("nextWednesdayAfter regression");
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
console.log("briefing data valid");
