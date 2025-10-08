
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
				id: '5',
				title: 'Обновление пересетов дашбордов',
				description:
          'Раньше можно было задать только одно состояние по умолчанию (при первом заходе пользователя) ' +
					'у виджета, к примеру price, теперь не ограниченное количество',
			},
		],
	},
	{
		week: '11-18 09 2025',
		items: [
			{
				id: '6',
				title: 'Минимальное боковое меню',
				description: 'Сделали просто боковое меню справа',
			},
			{
				id: '7',
				title: 'Фиксированные раскрытые панели на широких экрана',
				description: 'Так же, убрана возможность закрывать шторку выбора виджетов когда дашборд пуст',
			},
			{
				id: '8',
				title: 'Исправлен баг с пересчетом сетки при изменение размера экрана',
				description: 'Раньше, при открытие шторки не пересчитывалась ширина виджетов',
				productLink: '/',
			},
			{
				id: '9',
				title: 'Исправлен баг связанные с возникновением ошибки при удаление последнего виджета из сетке',
				description: '',
				productLink: '/',
			},
			{
				id: '10',
				title:
					'Исправлен баг связанные с неправильным позиционирование мышки ' +
					'пи миниатюры при перетягивание виджетов',
				description: '',
				productLink: '/',
			},
			{
				id: '11',
				title:
					'Исправлен баг связанные с неправильным позиционирование мышки ' +
					'пи миниатюры при перетягивание виджетов',
				description: '',
				productLink: '/',
			},
			{
				id: '12',
				title: 'Произведены небольшие оптимизации рендеринга виджетов',
				description: '',
				productLink: '/',
			},
		],
	},
	{
		week: '18-25 09 2025',
		items: [
			{
				id: '13',
				title: 'Страница календаря',
				description: 'Разработана адаптивная страница календаря, включая ' +
				'недельную краткую сводку, фильтрацию по: рынку, вачлисту, типу ивента, импакту и временному отрезку.',
				productLink: '/calendar',
				// eslint-disable-next-line @stylistic/max-len
				figmaLink: 'https://www.figma.com/design/Vlh431ShIfbTkfULdBuqii/P9.-i88---v2.3.0?node-id=34377-239473&p=f&t=pfK9TY3TTSaUHMhO-0',
			},
			{
				id: '14',
				title: 'Виджет календаря',
				description: 'Разработан виджет календаря, с учетом сохранения стейта виджета в локальном хранилище',
				productLink: '/',
				// eslint-disable-next-line @stylistic/max-len
				figmaLink: 'https://www.figma.com/design/Vlh431ShIfbTkfULdBuqii/P9.-i88---v2.3.0?node-id=34041-272333&t=pfK9TY3TTSaUHMhO-4',
			},
			{
				id: '15',
				title: 'Обновления в вочлисте',
				description: 'Сделано: добавление секции, удаление секции добавление тикера из секции, ' +
				'добавление тикера из пустого вочлиста',
				productLink: '/',
			},
			{
				id: '16',
				title: 'Сделан виджет хитмеп',
				description: '',
				productLink: '/',
			},
		],
	},
	{
		week: '25-02 10 2025',
		items: [
			{
				id: '17',
				title: 'Обновление новостей',
				description: 'Сделано: фильтрация по тикерам, сортировка по дате, сортировка по значимости. ' +
				'Визуал строки настроек пересобран в соответствие с макетом',
				productLink: '/',
				// eslint-disable-next-line @stylistic/max-len
				figmaLink: 'https://www.figma.com/design/Vlh431ShIfbTkfULdBuqii/P9.-i88---v2.3.0?node-id=34041-272333&t=pfK9TY3TTSaUHMhO-4',
			},
			{
				id: '18',
				title: 'Оптимизация продукта',
				description: 'Сделано: стояние загрузки после перетягивания виджета для плавности, ' +
        'оптимизирована сборка продукта, сделана динамическая загрузка тяжелых виджетов ' +
        '(это ускоряет навигацию и при первом заходе) ',
				productLink: '/',
			},
			{
				id: '19',
				title: 'Индикаторы загрузки и состояние ошибки',
				description: 'Во все виджеты добавлены индикаторы загрузки и состояние ошибки, '+
				'для улучшения отзывчивости интерфейса. '+
				'При ошибке загрузки данных, их можно перезапросить из состояния ошибки',
				productLink: '/',
			},
		],
	},
	{
		week: '02-09 10 2025',
		items: [
			{
				id: '20',
				title: 'Оптимизация приложения',
				description: 'уменьшили скорость загрузки за счет уменьшения размера загружаемого кода',
				productLink: '/',
			},
			{
				id: '22',
				title: 'Удаление дашборда',
				description: 'Сделан механизм удаления дашборда с возможностью отмены действия. ',
				productLink: '/',
			},
			{
				id: '23',
				title: 'Дублирование виджета',
				description: 'Сделано дублирование виджета на текущий дашборд из ПКМ',
				productLink: '/',
			},
			{
				id: '24',
				title: 'Перемещение виджета',
				description: 'Сделано дублирование виджета на другой дашборд из ПКМ',
				productLink: '/',
			},
			{
				id: '25',
				title: 'Обновления в прайсе',
				description: 'Добавлены новые фильтры, закрыта часть багов по дизайн ревью',
				productLink: '/',
			},
		],
	},
];
