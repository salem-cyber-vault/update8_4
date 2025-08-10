import React, { useState, useEffect } from "react";
import events from "../data/violetRoomEvents.json";
import "../styles/violetRoom.css";

const mockDevices = [
  { id: "sensor-1", name: "North Wall Sensor" },
  { id: "sensor-2", name: "Server Rack Node" },
  { id: "sensor-3", name: "Main Console" }
];

function getRandomStatus() {
  return Math.random() > 0.15 ? "online" : "offline";
}
function getRandomTemp() {
  return (18 + Math.random() * 8).toFixed(1);
}
function getRandomHumidity() {
  return (36 + Math.random() * 18).toFixed(1);
}

export const VioletRoomLayer: React.FC = () => {
  const [deviceStates, setDeviceStates] = useState([]);
  const [devicePower, setDevicePower] = useState({});
  const [eventLog, setEventLog] = useState([]);
  const [securityAlert, setSecurityAlert] = useState(null);

  // Initialize power state
  useEffect(() => {
    setDevicePower(
      mockDevices.reduce((acc, d) => ({ ...acc, [d.id]: true }), {})
    );
  }, []);

  // Live device updates
  useEffect(() => {
    const updateDevices = () => {
      setDeviceStates(
        mockDevices.map((d) => ({
          ...d,
          status: devicePower[d.id] ? getRandomStatus() : "offline",
          temp: devicePower[d.id] ? getRandomTemp() : "--",
          humidity: devicePower[d.id] ? getRandomHumidity() : "--",
        }))
      );
    };
    updateDevices();
    const interval = setInterval(updateDevices, 1000);
    return () => clearInterval(interval);
  }, [devicePower]);

  // Simulate event log (one every 5s)
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      const e = events[idx];
      setEventLog((log) => [
        { 
          ts: new Date().toLocaleTimeString(),
          ...e,
          source: mockDevices[Math.floor(Math.random() * mockDevices.length)].name 
        },
        ...log.slice(0, 9)
      ]);
      // Simulate rare security event
      if (Math.random() < 0.18) {
        setSecurityAlert({
          ts: new Date().toLocaleTimeString(),
          msg: "⚠️ Security breach detected on " + mockDevices[Math.floor(Math.random()*mockDevices.length)].name
        });
        setTimeout(() => setSecurityAlert(null), 5000);
      }
      idx = (idx + 1) % events.length;
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Toggle device power
  const togglePower = (id) => {
    setDevicePower((power) => ({
      ...power, [id]: !power[id]
    }));
  };

  return (
    <div className="violet-room-layer">
      <h2>The Violet Room – IoT Security Ops Center</h2>
      <p className="violet-intro">
        Devices hum. Metrics shift. Alerts flash. You control the network.
      </p>
      <div className="violet-iot-devices">
        <h4>Device Status & Controls</h4>
        <ul>
          {deviceStates.map((dev) => (
            <li key={dev.id} className={`device-${dev.status}`}>  
              <span>
                <b>{dev.name}</b> — <span>{dev.status}</span>
                <span style={{marginLeft:12, fontSize:"0.95em"}}>
                  🌡️ {dev.temp}°C / 💧 {dev.humidity}%
                </span>
                <button 
                  style={{marginLeft:20, fontSize:"0.92em"}}
                  onClick={()=>togglePower(dev.id)}
                >
                  {devicePower[dev.id] ? "Turn Off" : "Turn On"}
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="violet-event-log" style={{margin:"2em 0"}}>
        <h4>Event Log</h4>
        <ul style={{maxHeight:180, overflowY:"auto", fontSize:"0.98em", background:"#1e1433", padding:"1em", borderRadius:"6px"}}>
          {eventLog.map((log, i) => (
            <li key={i}>
              <span style={{color:"#be99e7"}}>[{log.ts}]</span> <b>{log.title}</b> on <span style={{color:"#a1f7c4"}}>{log.source}</span>
            </li>
          ))}
        </ul>
      </div>
      {securityAlert && (
        <div className="violet-alert" style={{
          background:"#39092b",
          color:"#fdc1d8",
          border:"2px solid #ff3b7b",
          padding:"1em",
          marginBottom:"1.5em",
          borderRadius:"8px",
          animation:"glitch 0.7s infinite alternate"
        }}>
          <b>{securityAlert.ts}</b> — {securityAlert.msg}
        </div>
      )}
    </div>
  );
};