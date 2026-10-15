import { useEffect } from "react";
import { Routes, Route, Link, useParams, useLocation } from "react-router-dom";
import { rolesFor, type OrgId, FUNCTIONS, ORGANIZATIONS, SOURCES, LAST_UPDATE_ISO, nextWednesdayAfter, validateBriefing, type Status } from "./data/briefing";

const orgName = new Map(ORGANIZATIONS.map((o) => [o.id, o.name]));
const srcById = new Map(SOURCES.map((s) => [s.id, s]));
const fmt = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const LABEL: Record<Status, string> = { active: "Active", scheduled: "Scheduled", open: "Open", flying: "Flying", grounded: "Grounded", paused: "Paused", complete: "Complete" };

function Home() {
  const { hash } = useLocation();
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); else window.scrollTo(0, 0); }, [hash]);
  const problems = validateBriefing();
  const next = nextWednesdayAfter(LAST_UPDATE_ISO);
  return (
    <main>
      <header>
        <h1><Link to="/" className="brand">Meridian</Link></h1>
        <p className="sub">A map of current space travel activity — tap any organization to see all its roles.</p>
        <div className="dates">
          <span>Last update: <b>{fmt(LAST_UPDATE_ISO)}</b></span>
          <span>Next update: <b>{fmt(next)}</b></span>
        </div>
        <p className="note">“Open” = no firm date. No launch dates are inferred.</p>
      </header>
      {problems.length > 0 && <div className="warn">Data validation: {problems.join("; ")}</div>}
      {FUNCTIONS.map((f) => (
        <section key={f.id} id={f.id}>
          <h2>{f.title}</h2>
          <div className="grid">
            {f.entries.map((e) => (
              <article key={e.id} className="card">
                <div className="row">
                  <h3>{e.title}</h3>
                  <span className={`pill s-${e.status}`}>{LABEL[e.status]}</span>
                </div>
                {e.when && <p className="when">{e.when}</p>}
                <p>{e.detail}</p>
                <div className="orgs">{e.orgs.map((o) => <Link key={o} to={`/org/${o}`} className="org">{orgName.get(o)}</Link>)}</div>
                {e.sources.length > 0 && (
                  <p className="src">Sources: {e.sources.map((s, i) => { const x = srcById.get(s)!; return <span key={s}>{i > 0 && ", "}<a href={x.url} target="_blank" rel="noreferrer">{x.publisher}</a></span>; })}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
      <section>
        <h2>Sources</h2>
        <ul className="sources">{SOURCES.map((s) => <li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> — {s.publisher}</li>)}</ul>
      </section>
    </main>
  );
}

function OrgPage() {
  const { id } = useParams();
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  const org = ORGANIZATIONS.find((o) => o.id === id);
  if (!org) return <main><p>Unknown organization.</p><Link to="/">← Back to map</Link></main>;
  const roles = rolesFor(org.id as OrgId);
  return (
    <main>
      <p><Link to="/">← Back to map</Link></p>
      <h1>{org.name}</h1>
      <p className="sub">{org.country}</p>
      <p>{org.description}</p>
      <p className="note">Roles in {roles.length} function{roles.length === 1 ? "" : "s"} · data as of {fmt(LAST_UPDATE_ISO)}</p>
      {roles.map(({ fn, entries }) => (
        <section key={fn.id}>
          <h2><Link to={`/#${fn.id}`}>{fn.title}</Link></h2>
          <div className="grid">{entries.map((e) => (
            <article key={e.id} className="card">
              <div className="row"><h3>{e.title}</h3><span className={`pill s-${e.status}`}>{LABEL[e.status]}</span></div>
              {e.when && <p className="when">{e.when}</p>}
              <p>{e.detail}</p>
              <div className="orgs">{e.orgs.filter((o) => o !== org.id).map((o) => <Link key={o} to={`/org/${o}`} className="org">{orgName.get(o)}</Link>)}</div>
            </article>))}</div>
        </section>))}
      <p><Link to="/">← Back to map</Link></p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/org/:id" element={<OrgPage />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
