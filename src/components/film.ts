import { View } from './base/view';

export interface IFilm {
	id: string;
	rating: number;
	director: string;
	tags: string[];
	title: string;
	description: string;
}

export class Film extends View<HTMLDivElement, IFilm, never, 'compact'> {
	set rating(value: number) {
		this.element('rating').setText(String(value));
	}

	set director(value: string) {
		this.element('director').setText(value);
	}

	set tags(value: string[]) {
		this.element('tags').setText(value.join(', '));
	}

	set title(value: string) {
		this.element('title').setText(value);
	}

	set description(value: string) {
		this.element('description').setText(value);
	}
}
