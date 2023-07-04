import { Film, IFilm } from '../film';
import { settings } from '../../utils/constants';
import { Places } from '../places';
import { Button } from '../common/button';
import { modal } from './app';

export function selectPlace(filmData: IFilm, selectedSession: ISession) {
	return new Promise<ITicket[]>((resolve) => {
		const header = Film.clone<Film>(settings.contentTemplate, filmData).toggle(
			'compact'
		);
		const content = Places.clone<Places>(
			settings.placesTemplate,
			selectedSession
		);
		const nextButton = Button.make('Далее').on('click', () => {
			if (content.selectedPlaces?.length > 0) {
				resolve(
					content.selectedPlaces.map(({ row, seat }) => ({
						title: filmData.title,
						film: filmData.id,
						session: selectedSession.id,
						day: selectedSession.day,
						time: selectedSession.time,
						price: selectedSession.price,
						row,
						seat,
					}))
				);
			} else {
				modal.setMessage('Выберите место', true);
			}
		});

		modal.render({
			header,
			content,
			actions: [nextButton],
		});
	});
}
