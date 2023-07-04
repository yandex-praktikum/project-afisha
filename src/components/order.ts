import { View } from './base/view';
import { CustomEvent } from './base/html';

export interface IOrderForm {
	email: string;
	phone: string;
}

export class Order extends View<
	HTMLDivElement,
	never,
	'change' | 'submit',
	never
> {
	init() {
		this.select('email', 'input[name=email]');
		this.select('phone', 'input[name=phone]');

		this.select('form', 'form[name=order]')
			.bindEvent('keyup', 'change')
			.bindEvent('change', 'change')
			.bindEvent('submit', 'submit')
			.on('submit', ({ event }: CustomEvent) => {
				event.preventDefault();
			});
	}

	get email() {
		return this.element('email').getValue();
	}

	get phone() {
		return this.element('phone').getValue();
	}

	override isValid(): boolean {
		return (
			this.element('email').isValid() &&
			this.element('phone').isValid() &&
			this.element('email').getValue().length > 0 &&
			this.element('phone').getValue().length > 0
		);
	}

	override getValidationMessage(): string | undefined {
		return [
			this.element('email').getValidationMessage(),
			this.element('phone').getValidationMessage(),
		]
			.filter((s) => !!s)
			.join(' ');
	}
}
