declare const DEVELOPMENT: boolean;
declare const API_ORIGIN: string;

interface IMovie {
	id: string;
	rating: number;
	director: string;
	tags: string[];
	title: string;
	about: string;
	description: string;
	image: string;
	cover: string;
}

interface ISession {
	id: string;
	daytime: string;
	day: string;
	time: string;
	hall: string;
	rows: number;
	seats: number;
	price: number;
	taken: string[];
}

interface ITicket {
	title: string;
	film: string;
	session: string;
	day: string;
	time: string;
	row: number;
	seat: number;
	price: number;
}

interface IOrder {
	email: string;
	phone: string;
	tickets: ITicket[];
}

interface IOrderResult extends ITicket {
	id: string;
}
