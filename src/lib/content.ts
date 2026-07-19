/**
 * Единая модель контента «Нашего путешествия».
 * Всё, что видно на сайте, живёт здесь и может быть
 * переопределено через админ-панель (localStorage).
 */

export interface QuestStop {
  id: string;
  /** Порядковый номер главы в квесте */
  order: number;
  name: string;
  chapterTitle: string;
  message: string;
  question?: string;
  /** Задание со свободным вводом (мечта, письмо в будущее) */
  taskPrompt?: string;
  /** Кодовое слово, открывающее главу на месте */
  codeWord: string;
  /** Подсказка, куда идти (показывается ДО прибытия) */
  hint: string;
  /** Координаты для кнопки «Открыть в Google Maps» */
  lat: number;
  lng: number;
  /** Позиция точки на иллюстрированной карте (viewBox 1000×700) */
  mapX: number;
  mapY: number;
}

export interface GalleryPhoto {
  src: string;
  caption: string;
}

export interface ChecklistSection {
  title: string;
  items: string[];
}

export interface Content {
  couple: {
    name1: string;
    name2: string;
    /** ISO-дата начала отношений — для счётчика дней */
    startDate: string;
    /** ISO дата и время предложения — для обратного отсчёта */
    proposalDateTime: string;
  };
  opening: {
    title: string;
    subtitle: string;
    button: string;
  };
  story1: {
    title: string;
    text: string;
  };
  story2: {
    title: string;
    lines: string[];
  };
  stops: QuestStop[];
  finalMap: {
    title: string;
    message: string;
    button: string;
  };
  homeScreen: {
    title: string;
    message: string;
    button: string;
  };
  proposal: {
    line1: string;
    line2: string;
    question: string;
  };
  loveMessages: string[];
  gallery: GalleryPhoto[];
  playlist: string[];
  checklist: ChecklistSection[];
  dinnerList: string[];
  adminPassword: string;
}

export const defaultContent: Content = {
  couple: {
    name1: "Я",
    name2: "Ты",
    startDate: "2023-07-19",
    proposalDateTime: "2026-08-01T19:00:00",
  },
  opening: {
    title: "Наше путешествие",
    subtitle: "Каждая великая история любви начинается с одного маленького шага.",
    button: "Начать",
  },
  story1: {
    title: "Двое незнакомцев",
    text:
      "Когда-то жили двое людей, которые даже не догадывались, что однажды станут друг для друга домом.",
  },
  story2: {
    title: "Наша первая встреча",
    lines: [
      "Я до сих пор помню, как увидел тебя впервые...",
      "Мир вокруг словно стал тише.",
      "И в тот момент я ещё не знал,",
      "что смотрю на своё будущее.",
    ],
  },
  stops: [
    {
      id: "baiterek",
      order: 1,
      name: "Байтерек",
      chapterTitle: "Глава третья · Надежда",
      message: "Каждая история любви начинается с надежды.",
      question: "Когда ты впервые почувствовала, что между нами происходит что-то особенное?",
      codeWord: "надежда",
      hint: "Там, где город тянется к солнцу, а на ладони загадывают желания.",
      lat: 51.1283,
      lng: 71.4305,
      mapX: 500,
      mapY: 355,
    },
    {
      id: "nurzhol",
      order: 2,
      name: "Бульвар Нуржол",
      chapterTitle: "Глава четвёртая · Шаги",
      message: "Каждый шаг, который мы делаем вместе, становится ещё одним воспоминанием.",
      question: "Какое наше воспоминание ты готова проживать снова и снова?",
      codeWord: "память",
      hint: "Длинная аллея, по которой мы могли бы гулять бесконечно.",
      lat: 51.1268,
      lng: 71.4237,
      mapX: 380,
      mapY: 420,
    },
    {
      id: "lovers-park",
      order: 3,
      name: "Парк влюблённых",
      chapterTitle: "Глава пятая · Мечта",
      message: "Любовь не находят.\nЕё строят.",
      taskPrompt: "Напиши одну мечту о нашем будущем вместе.",
      codeWord: "мечта",
      hint: "Парк, само имя которого — про нас.",
      lat: 51.132,
      lng: 71.4177,
      mapX: 300,
      mapY: 300,
    },
    {
      id: "embankment",
      order: 4,
      name: "Набережная Есиля",
      chapterTitle: "Глава шестая · Река времени",
      message: "Представь нас через 30 лет.\nЧто ты видишь?",
      taskPrompt: "Опиши, какими ты нас видишь через 30 лет.",
      codeWord: "будущее",
      hint: "Там, где вода несёт время, а мосты соединяют берега — как мы.",
      lat: 51.1483,
      lng: 71.4232,
      mapX: 430,
      mapY: 195,
    },
    {
      id: "expo",
      order: 5,
      name: "Сфера EXPO",
      chapterTitle: "Глава седьмая · Звёзды",
      message: "Будущее — это не место.\nЭто человек.",
      codeWord: "звёзды",
      hint: "Огромный стеклянный шар, в котором отражается завтрашний день.",
      lat: 51.0895,
      lng: 71.4164,
      mapX: 620,
      mapY: 540,
    },
  ],
  finalMap: {
    title: "Последняя точка",
    message: "Место, которое мы искали весь день...\nвсегда ждало нас.",
    button: "Идём домой ❤️",
  },
  homeScreen: {
    title: "Дом",
    message: "Последняя глава — не где-то в Астане.\nОна там, где мы построим нашу семью.",
    button: "Продолжить",
  },
  proposal: {
    line1: "Вся моя жизнь вела меня сюда.",
    line2: "У меня остался только один вопрос.",
    question: "Ты выйдешь за меня?",
  },
  loveMessages: [
    "Я люблю тебя",
    "Ты — моё спокойствие",
    "Ты — моё самое безопасное место",
    "Ты прекрасна",
    "Спасибо, что выбрала меня",
    "Каждый день я влюбляюсь заново",
    "Навсегда начинается сегодня",
    "Ты — мой дом",
  ],
  gallery: [
    { src: "/photos/placeholder-1.svg", caption: "Наше первое фото" },
    { src: "/photos/placeholder-2.svg", caption: "Тот самый вечер" },
    { src: "/photos/placeholder-3.svg", caption: "Просто мы" },
    { src: "/photos/placeholder-4.svg", caption: "Смеёмся до слёз" },
    { src: "/photos/placeholder-5.svg", caption: "Путешествуем" },
    { src: "/photos/placeholder-6.svg", caption: "Дом там, где ты" },
  ],
  playlist: [
    "Ludovico Einaudi — Nuvole Bianche",
    "Yiruma — River Flows in You",
    "Ólafur Arnalds — Saman",
    "Joep Beving — Sleeping Lotus",
  ],
  checklist: [
    { title: "Дорога", items: ["Маршрут проверен", "Такси / машина готова", "Время рассчитано"] },
    { title: "Кольцо", items: ["Кольцо у меня", "Коробочка", "Спрятано надёжно"] },
    { title: "Письма", items: ["Записки с кодовыми словами написаны", "Разложены по точкам"] },
    { title: "Цветы", items: ["Букет заказан", "Доставка/самовывоз", "Ваза дома"] },
    { title: "Свечи", items: ["Свечи куплены", "Расставлены", "Зажигалка/спички"] },
    { title: "Плейлист", items: ["Плейлист собран", "Колонка заряжена"] },
    { title: "Продукты", items: ["Список закуплен", "Ничего не забыто"] },
    { title: "Ужин", items: ["Меню продумано", "Время готовки рассчитано", "Стол сервирован"] },
    { title: "Уборка", items: ["Квартира убрана", "Свежие полотенца", "Всё лишнее спрятано"] },
    { title: "Камера", items: ["Штатив установлен", "Камера заряжена", "Запись проверена"] },
    { title: "Техника", items: ["Зарядка телефона", "Пауэрбанк взят", "Сайт открывается офлайн"] },
    { title: "Декор дома", items: ["Гирлянды", "Лепестки", "Свет приглушён"] },
  ],
  dinnerList: [
    "Стейки",
    "Картофель",
    "Сливочное масло",
    "Розмарин",
    "Чеснок",
    "Спаржа",
    "Салат",
    "Черри",
    "Оливковое масло",
    "Газированная вода",
    "Сок",
    "Десерт",
    "Шоколад",
    "Клубника",
    "Салфетки",
    "Свечи",
    "Спички",
    "Цветы",
    "Вино (по желанию)",
  ],
  adminPassword: "forever",
};

/** Порядок шагов путешествия — для навигации и защиты маршрутов */
export const journeySteps = [
  "opening",
  "story-1",
  "story-2",
  "stop-baiterek",
  "stop-nurzhol",
  "stop-lovers-park",
  "stop-embankment",
  "stop-expo",
  "final",
  "home",
  "proposal",
] as const;

export type JourneyStep = (typeof journeySteps)[number];

export const stepRoutes: Record<JourneyStep, string> = {
  opening: "/",
  "story-1": "/story/1",
  "story-2": "/story/2",
  "stop-baiterek": "/quest/baiterek",
  "stop-nurzhol": "/quest/nurzhol",
  "stop-lovers-park": "/quest/lovers-park",
  "stop-embankment": "/quest/embankment",
  "stop-expo": "/quest/expo",
  final: "/final",
  home: "/home",
  proposal: "/proposal",
};

export function stepIndex(step: JourneyStep): number {
  return journeySteps.indexOf(step);
}
