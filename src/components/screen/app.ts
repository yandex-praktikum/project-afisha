import { Page } from '../page';
import { Modal } from '../common/modal';
import { Basket } from '../basket';

import { settings } from '../../utils/constants';

export const page = Page.mount<Page>('.page').configure(settings);

export const modal = Modal.configure(settings);
modal.on('open', () => page.lockScroll(true));
modal.on('hide', () => page.lockScroll(false));

export const basket = Basket.clone<Basket>(settings.basketTemplate).configure(
	settings
);

function onChangeTickets() {
	page.counter = basket.tickets.size;
	basket.save();
}

basket.on('add-ticket', onChangeTickets);
basket.on('remove-ticket', onChangeTickets);

basket.load();
