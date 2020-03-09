# The project demonstrates a Node.js/typescript backend service using a websocket interface to send reminders

## Types
Reminders have the following internal structure:
```
export interface Reminder {
    timestamp: number;
    name: string;
}
```
* the timestamp field holds the number of seconds since 1970 (unix timestamp)
* the name field holds the string that will be sent to all connected clients once the timestamp is reached

## Configuration
The port the service is exposed at could be set by configuring the PORT environment variable or at 9000 if not specified.

The default name of the json file persisting the data is `reminders.json` and could be changed at the top of the index.ts file.

## Playground and testing
Once you install the dependencies you could launch the **dev** build by issuing `npm run dev` and the **prod** build by issuing `npm start` respectively.

In order to see the service in action you would need a WebSocket client. You could install the 
[Simple WebSocket Client](https://chrome.google.com/webstore/detail/simple-websocket-client/pfdhoblngboilpfeibdedpjgfnlcodoo)
which has a simple user interface to connect, send request and get feedback from the service.

Reminders could be set by respecting the following format:
 * date/time as one of the supported formats -> reminder's text

An example could look like:
 * 2020-03-08 10:15:30->This is the reminder text

 The above example will set a reminder to be sent March 8th, 2020 at 10:15:30. The text of the reminder is specified after the **->** marker.

 ## Extras
* It's written in typescript
* ESLint support
* There is a keep alive procedure running every 10 seconds, detecting and closing broken connections.
* You could specify the date/time in both [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and [RFC 2822](https://tools.ietf.org/html/rfc2822#section-3.3) formats
* The service persists data in a json file for testing purposes. It could be changed to a database if needed.
* Automatic cleanup of already sent reminders

 ## Missing
  * Tests
