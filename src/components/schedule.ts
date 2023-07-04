import { View, ViewElement, ViewEvent } from './base/view';

export type HallSchedule = {
	[key: string]: ISession;
};

export type GroupedSessions = {
	[key: string]: HallSchedule;
};

export type SelectedSession = {
	day: string;
	time: string;
};

export class Schedule extends View<
	HTMLDivElement,
	GroupedSessions,
	'select',
	never
> {
	protected _selected: SelectedSession = null;
	protected _times: ViewElement[] = [];

	init() {
		this.element('time').remove();
		this.element('label').remove();
		this.element('day').remove();

		this.on('select', ({ day, time, element }: SelectedSession & ViewEvent) => {
			this._times.map((item) => item.toggle('active', false));
			this._selected = { day, time };
			element.toggle('active');
		});
	}

	get selectedSession() {
		return this._selected;
	}

	render(schedule: GroupedSessions) {
		for (const day in schedule) {
			const dayElement = this.element('day').copy();
			const dayLabel = this.element('label').copy().setText(day);
			dayElement.append(dayLabel);

			for (const time in schedule[day]) {
				const timeElement = this.element('time')
					.copy()
					.setText(time)
					.bindEvent('click')
					.on(
						'click',
						this.trigger('select', {
							day,
							time,
						})
					) as ViewElement;

				this._times.push(timeElement);
				dayElement.append(timeElement);
			}

			this.append(dayElement);
		}
		return this.node;
	}

	static group(data: ISession[]) {
		return data.reduce<GroupedSessions>((a, c) => {
			if (!a[c.day]) a[c.day] = {};
			a[c.day][c.time] = c;
			return a;
		}, {});
	}
}
