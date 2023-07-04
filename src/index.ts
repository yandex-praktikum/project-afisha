import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import './scss/styles.scss';

import { API_URL, CDN_URL, settings } from './utils/constants';
import { FilmAPI } from './components/filmAPI';
import { IOrderForm } from './components/order';

import { basket, modal, page } from './components/screen/app';
import { selectDayTime } from './components/screen/selectDayTime';
import { selectPlace } from './components/screen/selectPlace';
import { viewBasket } from './components/screen/viewBasket';
import { orderForm } from './components/screen/orderForm';
import { showSuccess } from './components/screen/showSuccess';

dayjs.locale('ru-ru');

const api = new FilmAPI(CDN_URL, API_URL);

api
	.getFilms()
	.then((films) => {
		page.setFilms(films, settings.cardTemplate);
	})
	.catch((err: string) => console.log(`Error: `, err));

async function saveTickets(tickets: ITicket[]) {
	for (const item of tickets) {
		basket.addTicket(item);
	}
}

function buyTickets(formData: IOrderForm) {
	return api.orderTickets({
		...formData,
		tickets: Array.from(basket.tickets.values()),
	});
}

function selectSession(film: IMovie, schedule: ISession[]) {
	return selectDayTime(film, schedule)
		.then((session) => selectPlace(page.currentFilm, session))
		.then((tickets) => saveTickets(tickets));
}

function purchaseTicket() {
	return viewBasket()
		.then(() => orderForm())
		.then((formData) => buyTickets(formData))
		.then(() => showSuccess());
}

page.on('buy-ticket', () => {
	api
		.getFilmSchedule(page.currentFilm.id)
		.then((schedule) => selectSession(page.currentFilm, schedule))
		.then(() => purchaseTicket())
		.catch((err: string) => {
			modal.setMessage('Что-то пошло не так...', true);
			console.log(err);
		});
});

page.on('open-basket', () => {
	purchaseTicket()
		.then(() => modal.close())
		.catch((err: string) => {
			modal.setMessage(err ?? 'Что-то пошло не так...', true);
			console.log(err);
		});
});

if (DEVELOPMENT) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	window.page = page;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	window.modal = modal;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	window.basket = basket;
}
