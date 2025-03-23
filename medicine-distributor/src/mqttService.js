import mqtt from "mqtt";

const brokerUrl = "ws://broker.hivemq.com:8000/mqtt"; // WebSocket-URL deines Brokers
const options = {
  clientId: "react-client-" + Math.random().toString(16).substr(2, 8),
  keepalive: 60,
  reconnectPeriod: 1000,
};

const client = mqtt.connect(brokerUrl, options);

client.on("connect", () => {
  console.log("Connected to MQTT Broker");
});

client.on("error", (err) => {
  console.error("MQTT Error:", err);
});

export default client;
