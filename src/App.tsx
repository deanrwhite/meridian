import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, useParams, useLocation, useSearchParams } from "react-router-dom";
import {
  FUNCTIONS, DEEP_SPACE, ORGANIZATIONS, SOURCES, LAST_UPDATE_ISO, ALL_ENTRIES, findEntry,
  nextWednesdayAfter, validateBriefing, rolesFor, type Entry, type OrgId, type Status, type FunctionId,
} from "./data/briefing";

const orgName = new Map(ORGANIZATIONS.map((o) => [o.id, o.name]));
const srcById = new Map(SOURCES.map((s) => [s.id, s]));
const fmt = (iso: string, long = false) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: long ? "long" : "short", month: long ? "long" : "short", day: "numeric", year: "numeric", timeZone: "UTC",
  });
const LABEL: Record<Status, string> = { active: "Active", scheduled: "Scheduled", open: "Date open", flying: "Flying", grounded: "Grounded", paused: "Paused", complete: "Complete" };
/** Rows without a firm date (status "open") show "Date open". */
const whenText = (e: Entry) => (e.status === "open" ? `Date open${e.when ? ` · ${e.when}` : ""}` : e.when);

function useScrollTop(key: unknown) { useEffect(() => { window.scrollTo(0, 0); }, [key]); }

function Chips({ orgs, except }: { orgs: OrgId[]; except?: string }) {
  return <div className="orgs">{orgs.filter((o) => o !== except).map((o) => <Link key={o} to={`/org/${o}`} className="org">{orgName.get(o)}</Link>)}</div>;
}

const nf = (n: number) => n.toLocaleString("en-US");
function Distances({ e }: { e: Entry }) {
  if (!e.distances?.length) return null;
  return (
    <div className="distances">
      <ul>{e.distances.map((d) => <li key={d.from}>From {d.from}: <b>{nf(d.km)} km</b> · {d.au.toFixed(2)} AU · {nf(d.mi)} mi</li>)}</ul>
      {e.distancesAsOf && <p className="note">As of {e.distancesAsOf} · JPL Horizons</p>}
    </div>
  );
}

function Card({ e, except }: { e: Entry; except?: string }) {
  const w = whenText(e);
  return (
    <article className="card">
      <div className="row">
        <h3><Link to={`/activity/${e.id}`} className="title">{e.title}</Link></h3>
        <span className={`pill s-${e.status}`}>{LABEL[e.status]}</span>
      </div>
      {w && <p className="when">{w}</p>}
      <p>{e.detail}</p>
      <Distances e={e} />
      <Chips orgs={e.orgs} except={except} />
    </article>
  );
}

function Search() {
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const res = useMemo(() => {
    if (t.length < 2) return null;
    const orgs = ORGANIZATIONS.filter((o) => (o.name + " " + o.id + " " + o.description).toLowerCase().includes(t));
    const acts = ALL_ENTRIES.filter((e) => (e.title + " " + e.detail + " " + (e.when ?? "")).toLowerCase().includes(t));
    return { orgs, acts };
  }, [t]);
  const { pathname } = useLocation();
  useEffect(() => setQ(""), [pathname]);
  return (
    <div className="search">
      <input type="search" placeholder="Search organizations and activities…" aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      {res && (
        <div className="results" role="listbox">
          {res.orgs.length + res.acts.length === 0 && <p className="note">No matches.</p>}
          {res.orgs.map((o) => <Link key={o.id} to={`/org/${o.id}`} className="hit"><span className="tag">Org</span>{o.name}</Link>)}
          {res.acts.map((e) => <Link key={e.id} to={`/activity/${e.id}`} className="hit"><span className="tag">{e.fnTitle}</span>{e.title}</Link>)}
        </div>
      )}
    </div>
  );
}

function Header() {
  const next = nextWednesdayAfter(LAST_UPDATE_ISO);
  return (
    <header>
      <nav className="nav"><Link to="/" className="brand">Meridian</Link><span><Link to="/">Map</Link> · <Link to="/roster">Roster</Link></span></nav>
      <Search />
      <div className="dates">
        <span>Last update: <b>{fmt(LAST_UPDATE_ISO, true)}</b></span>
        <span>Next update: <b>{fmt(next, true)}, 8:00 AM CT</b></span>
      </div>
    </header>
  );
}

function Home() {
  const { hash } = useLocation();
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); else window.scrollTo(0, 0); }, [hash]);
  const problems = validateBriefing();
  return (
    <main>
      <p className="sub">A map of current space travel activity, in 8 jobs. Tap an organization to see every job it works, or an activity for its briefing.</p>
      <p className="note">“Date open” = no firm date. No launch dates are inferred.</p>
      {problems.length > 0 && <div className="warn">Data validation: {problems.join("; ")}</div>}
      <nav className="jobs">{FUNCTIONS.map((f) => <a key={f.id} href={`#${f.id}`}>{f.title}</a>)}<a href={`#${DEEP_SPACE.id}`}>{DEEP_SPACE.title}</a></nav>
      {FUNCTIONS.map((f) => {
        const groups = [...new Set(f.entries.map((e) => e.group ?? ""))];
        return (
          <section key={f.id} id={f.id}>
            <h2>{f.title}</h2>
            {groups.map((g) => (
              <div key={g}>
                {g && <h4 className="group">{g}</h4>}
                <div className="grid">{f.entries.filter((e) => (e.group ?? "") === g).map((e) => <Card key={e.id} e={e} />)}</div>
              </div>
            ))}
          </section>
        );
      })}
      <section id={DEEP_SPACE.id}>
        <h2>{DEEP_SPACE.title}</h2>
        <p className="note">Beyond the 8 jobs: NASA's twin Voyagers, the farthest spacecraft. Distances update each edition.</p>
        <div className="grid">{DEEP_SPACE.entries.map((e) => <Card key={e.id} e={e} />)}</div>
      </section>
      <section id="sources"><h2>Sources</h2><SourceList ids={SOURCES.map((s) => s.id)} /></section>
    </main>
  );
}

function SourceList({ ids }: { ids: string[] }) {
  if (!ids.length) return <p className="note">No primary source verified yet.</p>;
  return <ul className="sources">{ids.map((id) => { const s = srcById.get(id)!; return <li key={id}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> — {s.publisher}</li>; })}</ul>;
}

function OrgPage() {
  const { id } = useParams();
  useScrollTop(id);
  const org = ORGANIZATIONS.find((o) => o.id === id);
  if (!org) return <main><p>Unknown organization.</p><Link to="/">← Back to map</Link></main>;
  const roles = rolesFor(org.id);
  return (
    <main>
      <p><Link to="/">← Back to map</Link> · <Link to="/roster">Roster</Link></p>
      <h1>{org.name}</h1>
      <p className="sub">{org.kind === "agency" ? "Agency" : "Company"} · {org.country}</p>
      <p>{org.description}</p>
      <p><a href={org.website} target="_blank" rel="noreferrer" className="ext">Official website ↗</a></p>
      <p className="note">Works in {roles.length} job{roles.length === 1 ? "" : "s"}: {roles.map((r) => r.fn.title).join(", ")}</p>
      {roles.map(({ fn, entries }) => (
        <section key={fn.id}>
          <h2><Link to={`/#${fn.id}`}>{fn.title}</Link></h2>
          <div className="grid">{entries.map((e) => <Card key={e.id} e={e} except={org.id} />)}</div>
        </section>
      ))}
      <p><Link to="/">← Back to map</Link></p>
    </main>
  );
}

function ActivityPage() {
  const { id } = useParams();
  useScrollTop(id);
  const e = id ? findEntry(id) : undefined;
  if (!e) return <main><p>Unknown activity.</p><Link to="/">← Back to map</Link></main>;
  return (
    <main>
      <p><Link to={`/#${e.fnId}`}>← {e.fnTitle}</Link></p>
      <p className="sub">{e.fnTitle}{e.group ? ` · ${e.group}` : ""}</p>
      <h1>{e.title}</h1>
      <dl className="facts">
        <dt>Status</dt><dd><span className={`pill s-${e.status}`}>{LABEL[e.status]}</span></dd>
        <dt>Dates</dt><dd>{whenText(e) ?? "—"}</dd>
        <dt>Details</dt><dd>{e.detail}</dd>
        {e.distances && <><dt>Distance</dt><dd><Distances e={e} /></dd></>}
        <dt>Organizations</dt><dd><Chips orgs={e.orgs} /></dd>
        <dt>As of</dt><dd>{fmt(LAST_UPDATE_ISO, true)}</dd>
      </dl>
      <h2>Sources</h2>
      <SourceList ids={e.sources} />
    </main>
  );
}

function Roster() {
  useScrollTop("roster");
  const [sp, setSp] = useSearchParams();
  const kind = sp.get("kind") ?? "all";
  const fn = (sp.get("fn") ?? "all") as FunctionId | "all";
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v === "all") n.delete(k); else n.set(k, v); setSp(n, { replace: true }); };
  const list = ORGANIZATIONS.filter((o) => kind === "all" || o.kind === kind)
    .map((o) => ({ o, roles: rolesFor(o.id) }))
    .filter(({ roles }) => fn === "all" || roles.some((r) => r.fn.id === fn))
    .sort((a, b) => a.o.name.localeCompare(b.o.name));
  return (
    <main>
      <h1>Roster</h1>
      <div className="filters">
        <label>Type <select aria-label="Type" value={kind} onChange={(e) => set("kind", e.target.value)}>
          <option value="all">All</option><option value="agency">Agencies</option><option value="company">Companies</option></select></label>
        <label>Job <select aria-label="Job" value={fn} onChange={(e) => set("fn", e.target.value)}>
          <option value="all">All jobs</option>{FUNCTIONS.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}</select></label>
        <span className="note">{list.length} organizations</span>
      </div>
      <ul className="roster">
        {list.map(({ o, roles }) => (
          <li key={o.id} className="card">
            <div className="row"><h3><Link to={`/org/${o.id}`} className="title">{o.name}</Link></h3><span className="tag">{o.kind === "agency" ? "Agency" : "Company"}</span></div>
            <p>{o.description}</p>
            <p className="note">{roles.map((r) => r.fn.title).join(" · ")}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/org/:id" element={<OrgPage />} />
        <Route path="/activity/:id" element={<ActivityPage />} />
        <Route path="/roster" element={<Roster />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
