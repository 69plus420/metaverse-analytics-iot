const express = require('express');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');
const d3 = require('d3');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

client.on('connect', () => {
    console.log("Connected to MQTT broker for analytics");
    client.subscribe('iot/devices/#', (err) => {
        if (!err) {
            console.log("Subscribed to IoT analytics topic");
        }
    });
});

client.on('message', (topic, message) => {
    console.log(`Received analytics data on ${topic}`);
    io.emit('analytics-data', { topic, message: JSON.parse(message.toString()) });
    // Example: Process data with D3 for visualization
});

server.listen(3001, () => {
    console.log('Metaverse Analytics IoT running on http://localhost:3001');
});