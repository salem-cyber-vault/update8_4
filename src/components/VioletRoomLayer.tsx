import React, { useState, useEffect } from "react";
import mqtt from "mqtt";
import "../styles/violetRoom.css";

const MQTT_BROKER = "ws://broker.hivemq.com:8000/mqtt";
const DEVICE_TOPIC = "violetroom/device/+/status"; // + means any device
const EVENT_TOPIC = "violetroom/events";

export const VioletRoomLayer: React.FC = () => {
  const [deviceStates, setDeviceStates] = useState({});
  const [eventLog, setEventLog] = useState([]);
  const [securityAlert, setSecurityAlert] = useState(null);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER);

    client.on("connect", () => {
      client.subscribe(DEVICE_TOPIC);
      client.subscribe(EVENT_TOPIC);
    });

    client.on("message", (topic, message) => {
      if (topic.startsWith("violetroom/device/")) {
        // e.g., topic: violetroom/device/sensor-1/status
        const deviceId = topic.split("/")[2];
        const payload = JSON.parse(message.toString());
        setDeviceStates(prev =>
          ({
            ...prev,
            [deviceId]: {
              ...payload,
            }
          })
        );
      }
      if (topic === EVENT_TOPIC) {
        const event = JSON.parse(message.toString());
        setEventLog(log => [
          { ts: new Date().toLocaleTimeString(), ...event },
          ...log.slice(0, 9)
        ]);
        if (event.type === "alert") {
          setSecurityAlert({ ts: new Date().toLocaleTimeString(), msg: event.title });
          setTimeout(() => setSecurityAlert(null), 5000);
        }
      }
    });

    return () => client.end();
  }, []);

  return (
    <div className="violet-room-layer">
      <h2>The Violet Room – IoT (MQTT Live)</h2>
      <div className="violet-iot-devices">
        <h4>MQTT Device Status</h4>
        <ul>
          {Object.entries(deviceStates).map(([id, dev]: any) => (
            <li key={id} className={`device-${dev.status}`}>  
              <span>
                <b>{id}</b> — <span>{dev.status}</span>
                <span style={{marginLeft:12, fontSize:"0.95em"}}>
                  🌡️ {dev.temp}°C / 💧 {dev.humidity}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="violet-event-log" style={{margin:"2em 0"}}>
        <h4>MQTT Event Log</h4>
        <ul style={{maxHeight:180, overflowY:"auto", fontSize:"0.98em", background:"#1e1433", padding:"1em", borderRadius:"6px"}}>
          {eventLog.map((log, i) => (
            <li key={i}>
              <span style={{color:"#be99e7"}}>[{log.ts}]</span> <b>{log.title}</b>
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