import { View, ViewElement, ViewEvent } from './base/view';

export type SelectedPlace = {
	row: number;
	seat: number;
};

export class Places extends View<HTMLDivElement, ISession, 'select', never> {
	protected _selected: SelectedPlace[] = [];

	init() {
		this.element('seat').remove();
		this.element('label').remove();
		this.element('seats').remove();
		this.element('row').remove();

		this.on('select', ({ row, seat, element }: SelectedPlace & ViewEvent) => {
			this._selected.push({ row, seat });
			element.toggle('active');
		});
	}

	get selectedPlaces() {
		return this._selected;
	}

	render(hall: ISession) {
		if (hall)
			for (let row = 1; row <= hall.rows; row++) {
				const rowElement = this.element('row').copy();
				const labelElement = this.element('label').copy().setText(`Ряд ${row}`);
				const seatsElement = this.element('seats').copy();

				for (let seat = 1; seat <= hall.seats; seat++) {
					const seatElement = this.element('seat')
						.copy()
						.setText(String(seat))
						.toggleDisabled(hall.taken.includes([row, seat].join(':')))
						.bindEvent('click')
						.on(
							'click',
							this.trigger('select', {
								row,
								seat,
							})
						) as ViewElement;
					seatsElement.append(seatElement);
				}

				rowElement.append(labelElement, seatsElement);
				this.append(rowElement);
			}
		return this.node;
	}
}
