import { useMemo, useState } from "react";
import "./App.css";

const initialZones = [
  { name: "Hall A", type: "Keynote", capacity: 500, occupancy: 340, tone: "warning" },
  { name: "Hall B", type: "Workshop", capacity: 220, occupancy: 118, tone: "good" },
  { name: "Hall C", type: "Overflow", capacity: 260, occupancy: 84, tone: "good" },
  { name: "Networking Lounge", type: "People", capacity: 140, occupancy: 92, tone: "warning" },
  { name: "Expo Zone", type: "Sponsor", capacity: 200, occupancy: 128, tone: "warning" },
  { name: "Food Court", type: "Break", capacity: 180, occupancy: 101, tone: "good" },
];

const baseSessions = [
  {
    title: "AI Keynote — Hall A",
    time: "In 8 min",
    note: "High relevance for your interests",
    score: "98%",
  },
  {
    title: "GenAI Workshop — Hall B",
    time: "In 27 min",
    note: "Hands-on and low queue",
    score: "91%",
  },
  {
    title: "Product Networking — Lounge",
    time: "In 40 min",
    note: "Best for meeting peers",
    score: "87%",
  },
];

const initialMatches = [
  {
    name: "Arjun",
    role: "ML Lead @ Flipkart",
    common: "LLM, RAG, inference",
    icebreaker: "You both care about LLM evaluation.",
  },
  {
    name: "Meera",
    role: "AI Product Manager",
    common: "GenAI, UX, workflows",
    icebreaker: "Ask about her GenAI product launch playbook.",
  },
];

const initialAlerts = [
  {
    level: "info",
    title: "System online",
    text: "VenueTwin is monitoring live venue flow.",
  },
];

function occupancyPercent(zone) {
  return Math.round((zone.occupancy / zone.capacity) * 100);
}

function zoneToneClass(zone) {
  if (occupancyPercent(zone) >= 80) return "danger";
  if (occupancyPercent(zone) >= 55) return "warning";
  return "good";
}

function statusLabel(zone) {
  const pct = occupancyPercent(zone);
  if (pct >= 80) return "Hot";
  if (pct >= 55) return "Busy";
  return "Clear";
}

export default function App() {
  const [zones, setZones] = useState(initialZones);
  const [sessions, setSessions] = useState(baseSessions);
  const [matches, setMatches] = useState(initialMatches);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [focusedSession, setFocusedSession] = useState("AI Keynote — Hall A");
  const [heroMessage, setHeroMessage] = useState("Everything is stable. You are on track for your next session.");

  const stats = useMemo(() => {
    const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
    const totalOccupancy = zones.reduce((sum, z) => sum + z.occupancy, 0);
    const hotZones = zones.filter((z) => occupancyPercent(z) >= 80).length;

    return {
      totalCapacity,
      totalOccupancy,
      checkedIn: 1874,
      hotZones,
      avgLoad: Math.round((totalOccupancy / totalCapacity) * 100),
    };
  }, [zones]);

  function pushAlert(level, title, text) {
    setAlerts((prev) => [{ level, title, text, id: Date.now() }, ...prev].slice(0, 5));
  }

  function simulateCrowdSpike() {
    const updatedZones = zones.map((zone) => {
      if (zone.name === "Hall A") {
        return { ...zone, occupancy: Math.min(zone.capacity, zone.occupancy + 110) };
      }
      if (zone.name === "Networking Lounge") {
        return { ...zone, occupancy: Math.min(zone.capacity, zone.occupancy + 18) };
      }
      if (zone.name === "Hall C") {
        return { ...zone, occupancy: Math.min(zone.capacity, zone.occupancy + 34) };
      }
      return zone;
    });

    setZones(updatedZones);

    setSessions((prev) =>
      prev.map((s) =>
        s.title.includes("AI Keynote")
          ? { ...s, time: "Rerouted", note: "Overflow route recommended to Hall C", score: "Auto" }
          : s
      )
    );

    setMatches((prev) => [
      {
        name: "Sana",
        role: "GenAI Engineer",
        common: "RAG, evaluation, agents",
        icebreaker: "Both of you are interested in agent workflows.",
      },
      ...prev,
    ].slice(0, 3));

    setFocusedSession("GenAI Workshop — Hall B");
    setHeroMessage("Hall A is nearing capacity. Rerouting attendees to Hall C and updating itineraries.");
    pushAlert(
      "danger",
      "Crowd spike detected",
      "Hall A is approaching capacity. Suggested reroute: Hall C overflow zone."
    );
    pushAlert(
      "warning",
      "Networking opportunity",
      "A high-match attendee is now in the lounge with shared AI interests."
    );
  }

  function resetDemo() {
    setZones(initialZones);
    setSessions(baseSessions);
    setMatches(initialMatches);
    setAlerts(initialAlerts);
    setFocusedSession("AI Keynote — Hall A");
    setHeroMessage("Everything is stable. You are on track for your next session.");
  }

  return (
    <div className="app-shell">
      <div className="app-card">
        <div className="topbar">
          <div>
            <div className="eyebrow">Physical Event Experience</div>
            <h1>VenueTwin Concierge</h1>
            <p className="subtitle">
              A real-time AI digital twin for physical events that guides attendees and predicts venue pressure before it happens.
            </p>
          </div>

          <div className="live-pill">
            <span className="pulse-dot" />
            Live Demo Mode
          </div>
        </div>

        <div className="stats-grid">
          <StatCard label="Checked in" value={stats.checkedIn} />
          <StatCard label="Venue load" value={`${stats.avgLoad}%`} />
          <StatCard label="Hot zones" value={stats.hotZones} />
          <StatCard label="Active alerts" value={alerts.length} />
        </div>

        <div className="hero-banner">
          <div>
            <div className="hero-label">Orchestrator status</div>
            <div className="hero-message">{heroMessage}</div>
          </div>
          <div className="hero-actions">
            <button className="btn primary" onClick={simulateCrowdSpike}>
              Simulate Crowd Spike
            </button>
            <button className="btn secondary" onClick={resetDemo}>
              Reset Demo
            </button>
          </div>
        </div>

        <div className="main-grid">
          <section className="panel attendee-panel">
            <div className="panel-header">
              <h2>Attendee Experience</h2>
              <span className="panel-tag">Personalized</span>
            </div>

            <div className="focus-card">
              <div className="focus-title">Next best action</div>
              <div className="focus-value">{focusedSession}</div>
              <div className="focus-copy">
                Your itinerary adapts to crowd flow, timing, and interest match.
              </div>
            </div>

            <div className="section-title">Live itinerary</div>
            <div className="session-list">
              {sessions.map((session) => (
                <div key={session.title} className="session-card">
                  <div className="session-main">
                    <div className="session-title">{session.title}</div>
                    <div className="session-meta">{session.time}</div>
                  </div>
                  <div className="session-note">{session.note}</div>
                  <div className="session-score">{session.score}</div>
                </div>
              ))}
            </div>

            <div className="section-title">Networking match</div>
            <div className="match-list">
              {matches.map((match) => (
                <div key={match.name} className="match-card">
                  <div className="match-row">
                    <div>
                      <div className="match-name">{match.name}</div>
                      <div className="match-role">{match.role}</div>
                    </div>
                    <div className="match-chip">Nearby</div>
                  </div>
                  <div className="match-common">Common: {match.common}</div>
                  <div className="match-icebreaker">Icebreaker: {match.icebreaker}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel organizer-panel">
            <div className="panel-header">
              <h2>Organizer Control Tower</h2>
              <span className="panel-tag dark">Predictive</span>
            </div>

            <div className="map-grid">
              {zones.map((zone) => {
                const pct = occupancyPercent(zone);
                return (
                  <div key={zone.name} className={`zone-card ${zoneToneClass(zone)}`}>
                    <div className="zone-top">
                      <div>
                        <div className="zone-name">{zone.name}</div>
                        <div className="zone-type">{zone.type}</div>
                      </div>
                      <div className="zone-badge">{statusLabel(zone)}</div>
                    </div>

                    <div className="zone-bar">
                      <div className="zone-fill" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="zone-foot">
                      <span>{zone.occupancy}/{zone.capacity}</span>
                      <span>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="section-title">Live alerts</div>
            <div className="alert-list">
              {alerts.map((alert, index) => (
                <div key={alert.id ?? index} className={`alert-card ${alert.level}`}>
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-text">{alert.text}</div>
                </div>
              ))}
            </div>

            <div className="section-title">Why it matters</div>
            <div className="insight-box">
              VenueTwin does not just show a schedule. It acts on top of the venue state and helps people move, meet, and avoid bottlenecks.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}