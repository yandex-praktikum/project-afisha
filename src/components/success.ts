import { View } from './base/view';

export class Success extends View<HTMLDivElement, never, 'close', never> {
	init() {
		this.element('close').bindEvent('click').on('click', this.trigger('close'));
	}
}
