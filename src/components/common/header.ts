import { View } from '../base/view';

interface IModalHeader {
	title: string;
}

export class ModalHeader extends View<
	HTMLDivElement,
	IModalHeader,
	'back',
	never
> {
	init() {
		this.element('back').bindEvent('click').on('click', this.trigger('back'));
	}

	set title(value: string) {
		this.element('title').setText(value);
	}
}
