#!/usr/bin/env python3
"""
MQTT listener for retirementHome/rooms
–––––––––––––––––––––––––––––––––––––––
• Connects over secure WebSockets (TLS) to test.mosquitto.org:8081
• Expects the payload to be the JSON array of rooms you showed
• Prints the decoded array and keeps listening

Requires:
    pip install "paho-mqtt>=2.0"
"""

import ssl
import json
import paho.mqtt.client as mqtt

from gpiozero import Servo
from time import sleep


BROKER = "test.mosquitto.org"
PORT   = 8081                  # TLS WebSocket listener
TOPIC  = "retirementHome/rooms"

# --------------------------------------------------------------------------- #
# MQTT client setup
# --------------------------------------------------------------------------- #
client = mqtt.Client(
    mqtt.CallbackAPIVersion.VERSION1,  # mandatory since paho‑mqtt 2.0
    client_id="",                      # let Paho choose a random ID
    protocol=mqtt.MQTTv5,
    transport="websockets",
)

# Port 8081 on test.mosquitto.org is TLS‑only
client.tls_set(tls_version=ssl.PROTOCOL_TLS_CLIENT)

# --------------------------------------------------------------------------- #
# callbacks
# --------------------------------------------------------------------------- #
def on_connect(client, userdata, flags, rc, properties=None):
    print("✅ connected (rc =", rc, ") – subscribing to", TOPIC)
    client.subscribe(TOPIC, qos=1)

def on_message(client, userdata, msg):
    print(f"📩 Message received on topic {msg.topic}")
    try:
        # Decode the payload and parse it as JSON
        payload = msg.payload.decode("utf-8")
        data = json.loads(payload)

        # Process the received data
        for room in data:
            print(f"Room Number: {room['number']}")
            for patient in room['patients']:
                print(f"  Patient Name: {patient['name']}")
                for medication in patient['medications']:
                    if medication['name'] == "Paracetamol":
                        quantity = int(medication['quantity'])
                        for _ in range(quantity):
                            # Insert arm code here
                            print(f"    Quantity of Paracetamol: {quantity}")
                    if medication['name'] == "Cocaine":
                        quantity = int(medication['quantity'])
                        for _ in range(quantity):
                            # Insert arm code here
                            print(f"    Quantity of Cocaine: {quantity}")
                    if medication['name'] == "Ibuprofen":
                        quantity = int(medication['quantity'])
                        for _ in range(quantity):
                            # Insert arm code here
                            print(f"    Quantity of Ibuprofen: {quantity}")
                            
    except json.JSONDecodeError as e:
        print("❌ Failed to decode JSON:", e)
    except KeyError as e:
        print("❌ Missing expected key in data:", e)

client.on_connect = on_connect
client.on_message = on_message

# --------------------------------------------------------------------------- #
# go!
# --------------------------------------------------------------------------- #
if __name__ == "__main__":
    client.connect(BROKER, PORT, keepalive=60)
    print("ℹ️  waiting for messages – Ctrl‑C to exit")
    client.loop_forever()