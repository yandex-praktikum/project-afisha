import { Film, IFilm } from './film';
import { Gallery, IGallery } from './common/gallery';
import { View } from './base/view';
import { Hero } from './common/hero';
import { Card } from './card';
import { EventHandler } from './base/events';

interface IPage {
	counter: number;
	cover: string;
	content: IFilm;
	gallery: IGallery;
}

interface PageConfiguration {
	modalTemplate: string;
	contentTemplate: string;
}

export class Page extends View<
	HTMLButtonElement,
	IPage,
	'buy-ticket' | 'open-basket',
	'locked'
> {
	protected _currentFilm: IMovie;
	protected _filmView: Film;
	protected _tickets: ITicket[] = [];

	protected init() {
		this.select('openBasket', '.header__basket').bindEvent(
			'click',
			'open-basket'
		);

		this.select('hero', '.hero', Hero).on('action', this.trigger('buy-ticket'));

		this.select('gallery', '.gallery', Gallery);
	}

	set counter(value: number) {
		this.select('counter', '.header__basket-counter').setText(String(value));
	}

	get currentFilm() {
		return this._currentFilm;
	}

	lockScroll(state: boolean) {
		console.log('lock: ', state);
		this.element('wrapper').toggle('locked', state);
	}

	protected selectFilm =
		(film: IMovie): EventHandler =>
		() => {
			this._currentFilm = film;
			this.element<Hero>('hero').cover = film.cover;
			this._filmView.render(film);
		};

	setFilms(films: IMovie[], template: string) {
		const items = films.map((film) =>
			Card.clone<Card>(template, film).on('click', this.selectFilm(film))
		);

		this.element<Gallery>('gallery').render({ items });
		this.selectFilm(films[0])({ element: items[0] });
		this.element<Gallery>('gallery').setActiveItem({ element: items[0] });
	}

	configure({ contentTemplate }: PageConfiguration) {
		this._filmView = Film.clone<Film>(contentTemplate);
		this.element<Hero>('hero').content = this._filmView;
		return this;
	}
}
