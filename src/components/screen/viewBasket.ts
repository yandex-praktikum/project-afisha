import { basket, modal } from './app';
import { ModalHeader } from '../common/header';
import { settings } from '../../utils/constants';
import { Button } from '../common/button';

export function viewBasket() {
	return new Promise<void>((resolve) => {
		const onChangeTotal = () => {
			modal.setMessage(`Итого: ${basket.total}₽`);
		};
		const header = ModalHeader.clone<ModalHeader>(
			settings.modalHeaderTemplate,
			{
				title: 'Корзина',
			},
			'film'
		);
		const nextButton = Button.make('Далее').on('click', () => {
			if (basket.tickets.size > 0) {
				basket.off('remove-ticket', onChangeTotal);
				resolve();
			} else modal.setMessage('Добавьте билеты', true);
		});

		basket.on('remove-ticket', onChangeTotal);

		modal.render({
			header,
			content: basket,
			actions: [nextButton],
		});

		onChangeTotal();
	});
}
