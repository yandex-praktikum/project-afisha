import { View, ViewElement } from '../base/view';

export interface IHero {
	cover: string;
	content: ViewElement;
}

export class Hero extends View<HTMLDivElement, IHero, 'action', never> {
	protected _content: ViewElement = null;

	init() {
		this.element('action').bindEvent('click', 'action');
	}

	set cover(cover: string) {
		this.element('background').setLink(cover);
	}

	set content(content: ViewElement) {
		if (this._content) this._content.remove();
		this._content = content;
		this.element('content').prepend(content);
	}
}
