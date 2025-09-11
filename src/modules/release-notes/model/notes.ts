
import type { IWeekGroup } from './types';

export const notes: IWeekGroup[] = [
	{
		week: '04-11 09 2025',
		items: [
			{
				id: '1',
				title: 'Обновление модального окна выбора тикеров',
				description:
          'Проведен редизайн компонента, переписан api ' +
					'слой с контрактами по примеру виджета маркет, сделано 2 ' +
					'вариации, с бэйджиком и без него, сделано так чтобы данные прокидывались ' +
					'через v-model и расчёты все содержал только модальное окно',
				// productLink: 'https://example.com/feature/auth',
				// eslint-disable-next-line @stylistic/max-len
				figmaLink: 'https://www.figma.com/design/Vlh431ShIfbTkfULdBuqii/P9.-i88---v2.3.0?node-id=33153-124699&t=hu4zY15PtdN4mCAV-1',
			},
			{
				id: '2',
				title: 'Виджет top 10 weights',
				description:
          'Создан новый виджет на странице eth-тикера',
				productLink: '/ticker/etf/1',
				// eslint-disable-next-line @stylistic/max-len
				figmaLink: 'https://www.figma.com/design/Vlh431ShIfbTkfULdBuqii/P9.-i88---v2.3.0?node-id=33377-180770&t=mWep67d5KdrOdh8o-11',
			},
			{
				id: '3',
				title: 'Обновления данных в реальном времени',
				description:
          'Обновление данных тикера в табличных виджетах на стр дашборд',
				productLink: '/',

				// figmaLink: 'https://www.figma.com/design/Vlh431ShIfbTkfULdBuqii/P9.-i88---v2.3.0?node-id=33377-180770&t=mWep67d5KdrOdh8o-11',
			},
			{
				id: '4',
				title: 'Навигация на страницу тикера',
				description:
          'Переход из виджетов в дашборде на страницу тикера',
				productLink: '/',
				// eslint-disable-next-line @stylistic/max-len
				figmaLink: 'https://www.figma.com/design/Vlh431ShIfbTkfULdBuqii/P9.-i88---v2.3.0?node-id=9738-229053&p=f&m=dev',
			},
			{
				id: '4',
				title: 'Обновление пересетов дашбордов',
				description:
          'Раньше можно было задать только одно состояние по умолчанию (при первом заходе пользователя) ' +
					'у виджета, к примеру price, теперь не ограниченное количество',
			},
		],
	},
];
