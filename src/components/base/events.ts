export type EventData = object;
export type EventHandler = (args: EventData) => void;
export type EventsMap = Map<string, Set<EventHandler>>;

export class EventEmitter {
	protected events: EventsMap;

	constructor() {
		this.events = new Map();
	}

	on(eventName: string, handler: EventHandler) {
		if (!this.events.has(eventName)) {
			this.events.set(eventName, new Set());
		}
		this.events.get(eventName).add(handler);
	}

	off(eventName: string, handler: EventHandler) {
		if (this.events.has(eventName)) {
			this.events.get(eventName).delete(handler);
		}
	}

	emit(eventName: string, data: object) {
		if (this.events.has(eventName)) {
			this.events.get(eventName).forEach((handler) => handler(data));
		}
	}

	reset() {
		this.events.clear();
	}

	bindEmitter(events: EventsMap) {
		this.events = events;
	}
}
