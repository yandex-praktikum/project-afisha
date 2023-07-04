import { Success } from '../success';
import { settings } from '../../utils/constants';
import { basket, modal } from './app';

export function showSuccess() {
	return new Promise<void>(() => {
		const content = Success.clone<Success>(
			settings.successTemplate,
			{},
			'order-success'
		);

		content.on('close', () => {
			modal.close();
		});

		basket.clearTickets();
		modal.render({
			header: null,
			content,
			actions: [],
		});
	});
}
