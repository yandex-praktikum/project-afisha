import { View } from '../base/view';

export interface IButton {
	label: string;
}

export class Button extends View<HTMLButtonElement, IButton, 'click', never> {
	init() {
		this.bindEvent('click');
	}

	set label(value: string) {
		this.setText(value);
	}

	static make(label: string) {
		return super
			.create<HTMLButtonElement>('button', {
				className: 'button',
			})
			.assign({ label });
	}
}
