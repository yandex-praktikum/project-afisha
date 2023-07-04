import { View } from './base/view';

interface ICardData {
	image: string;
	title: string;
}

export class Card extends View<HTMLButtonElement, ICardData, 'click', never> {
	protected init() {
		this.bindEvent('click');
	}

	set image(src: string) {
		this.element('image').setLink(src);
	}

	set title(value: string) {
		this.element('text').setText(value);
		this.element('image').setText(value);
	}
}
