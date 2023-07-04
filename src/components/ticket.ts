import { View } from './base/view';

export class Ticket extends View<HTMLDivElement, ITicket, 'delete', never> {
	init() {
		this.element('delete')
			.bindEvent('click')
			.on(
				'click',
				this.trigger('delete', {
					element: this,
				})
			);
	}

	set place(value: string) {
		this.element('place').setText(value);
	}

	set session(value: string) {
		this.element('session').setText(value);
	}

	set price(value: string) {
		this.element('price').setText(value);
	}

	render(data?: ITicket) {
		if (data) {
			this.place = `Ряд ${data.row}, место ${data.seat}`;
			this.session = [data.title, data.day, data.time].join(', ');
			this.price = String(data.price);
		}
		return this.node;
	}
}
