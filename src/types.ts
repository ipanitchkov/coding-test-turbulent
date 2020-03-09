import * as WebSocket from 'ws';

export interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
}

export interface Reminder {
    timestamp: number;
    name: string;
}
