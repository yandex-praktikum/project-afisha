import { View, ViewEvent } from '../base/view';
import { HTMLCustomItem } from '../base/html';

export type GalleryItem =
	| View<HTMLElement, object, 'click', string>
	| HTMLCustomItem<HTMLElement, 'click'>;

export interface IGallery {
	items: GalleryItem[];
}

export class Gallery extends View<
	HTMLDivElement,
	IGallery,
	'item-click',
	never
> {
	protected _items: GalleryItem[] = [];

	init() {
		this.on('item-click', this.setActiveItem.bind(this));
	}

	setActiveItem({ element }: ViewEvent) {
		this._items.map((item) => item.removeClass('gallery__item_active'));
		element.addClass('gallery__item_active');
	}

	set items(items: View<HTMLElement, object, 'click', string>[]) {
		this._items = items;
		this.clear();
		this.append(
			...items.map((item) =>
				item
					.addClass(this.bem('item').name)
					.on('click', this.trigger('item-click'))
			)
		);
	}
}
