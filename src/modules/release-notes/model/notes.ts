/* eslint-disable @stylistic/max-len */

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

				figmaLink: 'https://www.figma.com/design/Vlh431ShIfbTkfULdBuqii/P9.-i88---v2.3.0?node-id=33153-124699&t=hu4zY15PtdN4mCAV-1',
			},
			{
				id: '2',
				title: 'Виджет top 10 weights',
				description:
          'Создан новый виджет на странице eth-тикера',
				productLink: '/ticker/etf/1',

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

				figmaLink: 'https://www.figma.com/design/Vlh431ShIfbTkfULdBuqii/P9.-i88---v2.3.0?node-id=34377-239473&p=f&t=pfK9TY3TTSaUHMhO-0',
			},
			{
				id: '14',
				title: 'Виджет календаря',
				description: 'Разработан виджет календаря, с учетом сохранения стейта виджета в локальном хранилище',
				productLink: '/',

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
	{
		week: '09-16 10 2025',
		items: [
			{
				id: '26',
				title: 'Исправлен баг в выпадающих списках',
				description: 'Исправлен баг провацирующий "улетание" выпадающих списков',
			},
			{
				id: '27',
				title: 'Сделан виджет Chart',
				description: 'Сделан виджет показывающий цену одного тикера',
				productLink: '/',
			},
			{
				id: '28',
				title: 'Сделан виджет Chart',
				description: 'Сделан виджет в сетке показывающий цену одного тикера',
				productLink: '/',
			},
			{
				id: '29',
				title: 'Механика open full view в ПКМ виджета',
				description: 'Теперь можно виджет открыть в отдельном модально окне, и поменять настройки через него',
				productLink: '/',
			},
			{
				id: '30',
				title: 'Добавлен forex в виджет perfomance',
				description: '',
				productLink: '/',
			},
			{
				id: '31',
				title: 'Обновлены пресеты дашбордов',
				description: '',
				productLink: '/',
			},
			{
				id: '32',
				title: 'В драфтовом варианте добавлены виджеты exchange и eth gas',
				description: '',
				productLink: '/',
			},
		],
	},
	{
		week: '16-30 10 2025',
		items: [
			{
				id: '33',
				title: 'Исправлена перерисовка watchlist\'а при добавлении тикера',
				description: 'Теперь модалка не закрывается после первого выбора.',
				productLink: '/',
			},
			{
				id: '34',
				title: 'Собрал адаптивность тулбаров для всех виджетов',
				description: 'Теперь тулбары адаптированы для всех виджетов, в которых оно требовалось.',
				productLink: '/',
			},
			{
				id: '35',
				title: 'Исправил оверфлоу тултипов на графиках дашборда',
				description: 'Теперь тулбары графиков могут покидать зону графика без проблем с отображением',
				productLink: '/',
			},
			{
				id: '36',
				title: 'Исправил поведение таблиц в firefix',
				description: 'Виджеты, в которых используются таблицы, теперь работают в firefox',
				productLink: '/',
			},
			{
				id: '37',
				title: 'Переработка виджета altcoin season в соответствии с дизайн ревью',

				description: 'Переаботан лейаут, работа с модулями, переработан график, исправлены цвета и дублирующиеся запросы',
				productLink: '/',

				figmaLink: 'https://www.figma.com/design/Vlh431ShIfbTkfULdBuqii/P9.-i88---v2.3.0?node-id=33188-135973&t=H3wUOcub7hZCihYj-4',
			},
			{
				id: '38',
				title: 'Переработка виджета News в соответствии с дизайн ревью',

				description: 'Исправлен визуал строки фильтров, добавлены новые фильтры по дате, исправлено поведение модальных окон,',
				productLink: '/',

				figmaLink: 'https://www.figma.com/design/Vlh431ShIfbTkfULdBuqii/P9.-i88---v2.3.0?node-id=33153-124699&t=H3wUOcub7hZCihYj-4',
			},
			{
				id: '39',
				title: 'Адаптивные скелетоны виджетов',
				description: 'Анимация загрузки теперь динамически занимает весь размер виджета и ' +
				'повторяет некоторые его элементы. Это позволяет сделать загрузку визуально более ' +
				'аккуратной, уменьшить различия загружаемой и настоящей версии виджета.',
				productLink: '/',
			},
			{
				id: '40',
				title: 'Обновлена информация о доступных виджетах в сайдбаре',
				description: '',
				productLink: '/',
			},
			{
				id: '41',
				title: 'В полностью рабочем варианте добавлены виджеты exchange и eth gas',
				description: '',
				productLink: '/',
			},
		],
	},
	{
		week: '30-06 11 2025',
		items: [
			{
				id: '42',
				title: 'Использованы чарты из component-library',

				description: 'Имплементированы чарты из component-library, теперь можно использовать чарты из component-library в дашборде',
				productLink: '/',
			},
			{
				id: '43',
				title: 'Крупное обновление модуля новостей, страница новостей',

				description: 'Добавлена страница новостей, в новость теперь можно зайти,чтобы прочитать тело новости. Добавлены адаптивные экраны для модуля новостей. Исправлено включение и выключение иконки источника новости.',
				productLink: '/news',
			},
			{
				id: '44',
				title: 'Унифицирован визуал scrollbar\'ов на проекте ',

				description: 'Теперь scrollbar\'ы имеют одинаковый визуал на всех страницах проекта, добавлен адаптивный визуал для firefox',
				productLink: '/',
			},
			{
				id: '45',
				title: 'Унифицирован визуал scrollbar\'ов на проекте',
				description: 'Теперь scrollbar\'ы имеют один и тот же визуал на всех страницах проекта',
				productLink: '/',
			},
			{
				id: '46',
				title: 'Унифицированное скругление углов виджетов',
				description: 'Теперь все виджеты имеют одинаковый визуал скругления углов. (Баг был в виджете heatmap)',
				productLink: '/',
			},
			{
				id: '47',
				title: 'Исправлено наименование колонки в таблице performance виджета altcoin season',
				description: 'Название изменено с "Chg%, 7d" на "Performance"',
				productLink: '/',
			},
			{
				id: '48',
				title: 'Изменен скролл таблиц на соответствующий дизайну ',
				description: '',
				productLink: '/',
			},
			{
				id: '49',
				title: ' Исправлены таблицы уходящие в скролл при фиксированной ширине контейнера ',
				description: 'виджеты top indicies, performance , все таблицы с 2 столбцами',
				productLink: '/',
			},
			{
				id: '50',
				title: 'Доработаны виджеты Market Cap и Dominance',

				description: 'Адаптированы под разные размеры на дашборде, отображаемые данные и фильтры теперь связаны между собой. На графики добавлены тултипы с выводом информации о тикерах.',
				productLink: '/',
			},
			{
				id: '51',
				title: 'UX улучшения',
				description: 'Внедрены небольшие UX улучшения из прототипов - autofocus поиска, очистка поиска и т.д',
				productLink: '/',
			},
		],
	},
	{
		week: '06-16 11 2025',
		items: [
			{
				id: '52',
				title: 'Интеграция прайс-листа',
				description: 'Добавлена интеграция с API прайс-листа. Обновлены контракты данных и внесены корректировки для корректного отображения информации в Forex листе.',
				productLink: '/',
			},
			{
				id: '53',
				title: 'Плавная подгрузка данных в списках',
				description: 'Реализована бесконечная прокрутка (infinite scroll) — теперь при пролистывании вниз данные подгружаются автоматически и заранее с поддержкой скелетонов (загрузчики).',
				productLink: '/',
			},
			{
				id: '54',
				title: 'Изменения интерфейса Price Chart',
				description: 'Новый интерфейс для дашборда, добавлены подсказки при наведении на точку на графике',
				productLink: '/',
				figmaLink: 'https://www.figma.com/design/5aCKSgIfAiKBurXVLM6P51/P9.-i88---v2.3.1--%E2%8F%B0-NEW-?node-id=37142-98731&t=qjHsh8LSdjT5tEK5-4',
			},
			{
				id: '55',
				title: 'Подсказки для навигации',
				description: 'Для элементов навигации, которые пока находятся в разработке, добавлены всплывающие подсказки “Coming soon”, чтобы пользователи понимали, что за функция и как скоро появится.',
				productLink: '',
				figmaLink: 'https://www.figma.com/design/5aCKSgIfAiKBurXVLM6P51/P9.-i88---v2.3.1--%E2%8F%B0-NEW-?node-id=39275-229933&t=qjHsh8LSdjT5tEK5-4',
			},
			{
				id: '56',
				title: 'Виджет News встроен в новый дашборд',
				description: 'Виджет News теперь можно использовать, как в новом дашборде, так и в старом, исправлены баги связанные с поведением модальных окон и настроек виджета',
				productLink: '/',
				figmaLink: 'https://www.figma.com/design/5aCKSgIfAiKBurXVLM6P51/P9.-i88---v2.3.1--%E2%8F%B0-NEW-?node-id=39387-286819&t=aEuI0GKVgZ5ab2kl-4',
			},
			{
				id: '57',
				title: 'Обновлены иконок тикеров',
				description: 'Обновлены иконки тикеров, теперь они более аккуратные и соответствуют дизайну, исправлена проблема с иконкой для форекса',
				productLink: '/',
				figmaLink: 'https://www.figma.com/design/5aCKSgIfAiKBurXVLM6P51/P9.-i88---v2.3.1--%E2%8F%B0-NEW-?node-id=37197-386999&t=vjVwbRwGPRTnOCF2-1',
			},
			{
				id: '58',
				title: 'Виджет Calendar встроен в новый дашборд',
				description: 'Виджет Calendar теперь можно использовать, как в новом дашборде, так и в старом',
				productLink: '/',
				figmaLink: 'https://www.figma.com/design/5aCKSgIfAiKBurXVLM6P51/P9.-i88---v2.3.1--%E2%8F%B0-NEW-?node-id=37429-412361&t=aEuI0GKVgZ5ab2kl-4',
			},
			{
				id: '59',
				title: 'Обновления графиков trading view',
				description: 'В графики добавлена возможность кастомизации лейаута, цветов, даты и времени, пересечений, ховер еффектов, информация о положении курсора на графике, для добавления возможности выставить TP/SL и т.д.',
				productLink: '/',
			},
			{
				id: '60',
				title: 'Исправлены стили и поведение таблиц, приведены к большему соответствию с figma',
				description: 'Исправлены баги с пропаданием скрола, некорректным положением действий с строкой, подробнее в https://linear.app/planet-9-group-corporation/issue/PLA-453/tablecommon-pravki-po-tablice-obshie',
				productLink: '/',
			},
			{
				id: '61',
				title: 'Виджет Performance приведен в соответствие с макетом, добавлены полоски %',
				description: '',
				productLink: '/',
			},
			{
				id: '62',
				title: 'Добавлен автобекграунд для таблиц',
				description: 'Исправлена проблема бекграунда в таблицах на виджетах различных цветов',
				productLink: '/',
			},
			{
				id: '63',
				title: 'Сделан виджет Consumer price index',
				description: '',
				productLink: '/',
			},
			{
				id: '64',
				title: 'Сделан виджет Nominal gross domestic product',
				description: '',
				productLink: '/',
			},
			{
				id: '65',
				title: 'Сделан виджет Real gross domestic product',
				description: '',
				productLink: '/',
			},
			{
				id: '66',
				title: 'Сделан виджет Unemployment Rate (1Y)',
				description: '',
				productLink: '/',
			},
			{
				id: '67',
				title: 'Сделан виджет Nonfarm Payrolls (1Y)',
				description: '',
				productLink: '/',
			},
			{
				id: '68',
				title: 'Сделан виджет US inflation (1Y)',
				description: '',
				productLink: '/',
			},
			{
				id: '69',
				title: 'Сделан виджет Federal funds',
				description: '',
				productLink: '/',
			},
		],
	},
];
