import { Film, IFilm } from '../film';
import { Schedule } from '../schedule';
import { settings } from '../../utils/constants';
import { Button } from '../common/button';
import { modal } from './app';

export function selectDayTime(filmData: IFilm, scheduleData: ISession[]) {
	return new Promise<ISession>((resolve) => {
		const groupedSessions = Schedule.group(scheduleData);
		const header = Film.clone<Film>(settings.contentTemplate, filmData).toggle(
			'compact'
		);
		const content = Schedule.clone<Schedule>(
			settings.scheduleTemplate,
			groupedSessions
		);
		const nextButton = Button.make('Далее').on('click', () => {
			if (content.selectedSession) {
				const { day, time } = content.selectedSession;
				resolve(groupedSessions[day][time]);
			} else {
				modal.setMessage('Выберите дату и время', true);
			}
		});

		modal.render({
			header,
			content,
			actions: [nextButton],
		});
	});
}
