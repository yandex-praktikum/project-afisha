import dayjs from 'dayjs';
import { Api, ApiListResponse } from './base/api';

export interface IFilmAPI {
	getFilms: () => Promise<IMovie[]>;
	getFilmSchedule: (id: string) => Promise<ISession[]>;
	orderTickets: (items: IOrder) => Promise<IOrderResult[]>;
}

export class FilmAPI extends Api implements IFilmAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getFilmSchedule(id: string): Promise<ISession[]> {
		return this.get(`/films/${id}/schedule`).then(
			(data: ApiListResponse<ISession>) =>
				data.items.map((schedule) => {
					const daytime = dayjs(schedule.daytime);
					return {
						...schedule,
						day: daytime.format('D MMMM'),
						time: daytime.format('HH:mm'),
					};
				})
		);
	}

	getFilms(): Promise<IMovie[]> {
		return this.get('/films').then((data: ApiListResponse<IMovie>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
				cover: this.cdn + item.cover,
			}))
		);
	}

	orderTickets(order: IOrder): Promise<IOrderResult[]> {
		return this.post('/order', order).then(
			(data: ApiListResponse<IOrderResult>) => data.items
		);
	}
}
