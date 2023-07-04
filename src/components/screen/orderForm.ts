import { IOrderForm, Order } from '../order';
import { ModalHeader } from '../common/header';
import { settings } from '../../utils/constants';
import { Button } from '../common/button';
import { basket, modal } from './app';

export function orderForm() {
	return new Promise<IOrderForm>((resolve) => {
		const header = ModalHeader.clone<ModalHeader>(
			settings.modalHeaderTemplate,
			{
				title: 'Оформление заказа',
			},
			'film'
		);
		const content = Order.clone<Order>(settings.orderTemplate);
		const nextButton = Button.make('Далее')
			.on('click', () => {
				if (content.isValid())
					resolve({
						email: content.email,
						phone: content.phone,
					});
				else modal.setMessage(content.getValidationMessage(), true);
			})
			.disable() as Button;

		content.on('change', () => {
			nextButton.toggleDisabled(!content.isValid());
		});

		modal.render({
			header,
			content,
			actions: [nextButton],
		});

		modal.setMessage(`Итого: ${basket.total}₽`);
	});
}
