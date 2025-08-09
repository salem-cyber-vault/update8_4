import React, { useState } from "react";
import events from "../data/violetRoomEvents.json";
import overlays from "../data/violetRoomOverlays.json";

export const VioletRoomLayer: React.FC = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="violet-room-layer">
      <h2>The Violet Room</h2>
      <p className="violet-intro">
        This is a digital sanctum. Every event here is real, but told in fragments—
        <strong>click to see what happened, why it matters, and how it feels.</strong>
      </p>
      <div className="violet-overlays">
        {overlays.map((o) => (
          <blockquote key={o.id} className="violet-overlay">{o.text}</blockquote>
        ))}
      </div>
      <ul className="violet-event-list">
        {events.map((e) => (
          <li key={e.id} onClick={() => setSelected(e)} className="violet-event-item">
            {e.title}
          </li>
        ))}
      </ul>
      {selected && (
        <div className="violet-event-detail">
          <h3>{selected.title}</h3>
          <p>{selected.summary}</p>
          <p className="violet-fragment">{selected.fragment}</p>
          <div className="violet-plain-explanation">
            <strong>What happened?</strong>
            <p>{selected.plain_explanation}</p>
            <a href={selected.source} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        </div>
      )}
    </div>
  );
};