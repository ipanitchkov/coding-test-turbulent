import fs from 'fs';
import * as http from 'http';
import moment from 'moment';
import { Reminder } from './types';

function gracefulShutdown(server: http.Server): void {
    server.close(() => {
        process.exit(0);
    });
}

function sortByTimestamps(a: Reminder, b: Reminder): number {
    return a.timestamp - b.timestamp
}

function setReminders(reminders: Reminder[], filename: string): void {
    const data = JSON.stringify(reminders);

    fs.writeFileSync(filename, data, 'utf8');
}

function getReminders(filename: string): Reminder[] {
    const now = moment().unix();

    try {
        const data = fs.readFileSync(filename, 'utf8');
        const reminders: Reminder[] = JSON.parse(data);

        return reminders.filter((reminder: Reminder) => {
            return now < reminder.timestamp;
        });
    } catch {
        return [];
    }
}

export {
    gracefulShutdown,
    sortByTimestamps,
    setReminders,
    getReminders,
}
