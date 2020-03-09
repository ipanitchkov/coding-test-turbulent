/* eslint-disable no-console */
import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import moment from 'moment';
import { ExtWebSocket, Reminder } from './types';
import { gracefulShutdown, sortByTimestamps, setReminders, getReminders } from './utils';

const PORT = process.env.PORT || 9000;
const FILENAME = './reminders.json';

const app = express();
const server: http.Server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let reminders: Reminder[] = getReminders(FILENAME);

wss.on('connection', (ws: ExtWebSocket) => {
    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (message: string) => {
        const [timePart, ...nameParts] = message.split('->');
        const time = moment(timePart.trim());
        if (time.isValid()) {
            const now = moment().unix();
            const timestamp = time.unix();

            if (timestamp < now) {
                ws.send(`The reminder is discarded as its time is in the past: ${timePart}`);
            } else {
                const reminder = {
                    timestamp,
                    name: nameParts.join('->'),
                };

                reminders.push(reminder);
                reminders = reminders.sort(sortByTimestamps);
                ws.send(`A reminder has been set: ${JSON.stringify(reminder)}`);
            }
        } else {
            ws.send(`Incorrect time format for ${timePart}`);
        }
    });
    ws.send('Connected to the WebSocket server');
});

setInterval(() => {
    if (reminders.length) {
        const now = moment().unix();
        const reminder = reminders[0];

        if (reminder.timestamp < now) {
            wss.clients.forEach((ws) => {
                const extWs = ws as ExtWebSocket;

                if (!extWs.isAlive) return ws.terminate();

                extWs.send(reminder.name);
            });
            reminders.shift();
        }
    }
}, 1000);

const keepAlive = setInterval(() => {
    wss.clients.forEach((ws) => {
        const extWs = ws as ExtWebSocket;

        if (!extWs.isAlive) return ws.terminate();

        extWs.isAlive = false;
        ws.ping();
    });
}, 10000);

wss.on('close', () => {
    clearInterval(keepAlive);
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

process.on('SIGTERM', () => {
    setReminders(reminders, FILENAME);
    gracefulShutdown(server);
});

process.on('SIGINT', () => {
    setReminders(reminders, FILENAME);
    gracefulShutdown(server);
});
