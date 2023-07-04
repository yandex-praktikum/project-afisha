import { View } from './base/view';
import { Ticket } from './ticket';

export interface BasketConfiguration {
	ticketTemplate: string;
	basketStorageKey: string;
}

export class Basket extends View<
	HTMLDivElement,
	ITicket[],
	'add-ticket' | 'remove-ticket',
	never
> {
	protected _ticketTemplate: Ticket;
	protected _tickets: Map<string, ITicket> = new Map();
	protected _storageKey: string;

	save() {
		localStorage.setItem(
			this._storageKey,
			JSON.stringify(Array.from(this._tickets.values()))
		);
	}

	load() {
		try {
			const rawData: string = localStorage.getItem(this._storageKey);
			if (rawData) {
				const items: ITicket[] = JSON.parse(rawData);
				for (const item of items) {
					this.addTicket(item);
				}
			}
		} catch (err) {
			console.warn(`Не удалось прочитать билеты из localStorage`, err);
		}
	}

	configure({ ticketTemplate, basketStorageKey }: BasketConfiguration) {
		this._ticketTemplate = Ticket.clone<Ticket>(ticketTemplate);
		this._storageKey = basketStorageKey;
		return this;
	}

	addTicket(item: ITicket): string {
		const id = [item.film, item.session, item.row, item.seat].join('|');
		this._tickets.set(id, item);
		const ticketElement = this._ticketTemplate
			.copy()
			.on('delete', this.onDeleteTicket(id));
		this.append(ticketElement.render(item));
		this.emit('add-ticket', { id, ...item });

		return id;
	}

	removeTicket(id: string) {
		const removedTicket = this._tickets.get(id);
		this._tickets.delete(id);
		this.emit('remove-ticket', removedTicket);
	}

	protected onDeleteTicket =
		(id: string) =>
		({ element }: { element: Ticket }) => {
			this.removeTicket(id);
			element.remove();
		};

	get tickets() {
		return this._tickets;
	}

	get total() {
		return Array.from(this._tickets.values()).reduce((a, c) => a + c.price, 0);
	}

	clearTickets() {
		this._tickets.forEach((item, id) => this.removeTicket(id));
		this.clear();
	}
}
