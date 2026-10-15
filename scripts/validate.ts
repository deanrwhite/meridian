import { validateBriefing, nextWednesdayAfter, LAST_UPDATE_ISO } from "../src/data/briefing.ts";
const errs = validateBriefing();
if (nextWednesdayAfter(LAST_UPDATE_ISO) !== "2026-10-21") errs.push("next-update calc wrong");
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
console.log("briefing data valid");
