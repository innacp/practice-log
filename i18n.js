// English / Ukrainian translations + the language switch.
// In HTML: data-i18n="key" (text), data-i18n-ph (placeholder), data-i18n-aria (aria-label).
// Long lesson text uses blocks marked data-l="en" / data-l="uk" instead.
const LANG_KEY = 'practice-log-lang';

const I18N = {
  en: {
    'title.log': 'Practice Log',
    'title.timer': 'Timer · Practice Log',
    'title.theory': 'Theory · Practice Log',
    'nav.pages': 'Pages', 'nav.log': 'Log', 'nav.timer': 'Timer', 'nav.theory': 'Theory',
    'lang.label': 'Language',
    'drums': 'Drums', 'vocals': 'Vocals', 'all': 'All',
    'drums.lower': 'drums', 'vocals.lower': 'vocals', 'practice.lower': 'practice',
    'instrument': 'Instrument',
    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    monthsLong: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    weekLetters: ['M','T','W','T','F','S','S'],
    'dur.hm': '{h}h {m}m', 'dur.h': '{h}h', 'dur.m': '{m}m',
    'min': '{n} min',
    'hours': ['{n} hour', '{n} hours'],
    'days': ['day', 'days'],
    'sessionsWord': ['session', 'sessions'],
    'save': 'Save', 'cancel': 'Cancel',

    // Log page
    'lock': 'Lock',
    'unlock.title': 'Unlock your log',
    'unlock.text': 'Enter your passcode to load and save your progress online.',
    'unlock.ph': 'Passcode',
    'unlock.btn': 'Unlock',
    'unlock.wrong': 'That passcode didn’t work. Try again.',
    'unlock.changed': 'Your passcode changed. Enter it again.',
    'sync.locked': 'Locked', 'sync.ok': 'Saved online', 'sync.saving': 'Saving…',
    'sync.partial': 'Some sessions not uploaded',
    'sync.nodb': 'Database not set up: saved on this device',
    'sync.local': 'Saved on this device only',
    'sync.fail': 'Not saved online. Will retry on reload',
    'sync.delfail': 'Delete not saved online',
    'sync.goalfail': 'Goal not saved online',
    'streak.title': 'Current streak',
    'stat.longest': 'longest streak', 'stat.week': 'min this week', 'stat.hours': 'hours total',
    'log.title': 'Log a session', 'log.date': 'Date', 'log.howlong': 'How long',
    'log.notes': 'What did you work on?', 'log.ph': 'e.g. paradiddles at 90 bpm', 'log.add': 'Add session',
    'goal.title': 'Weekly goal', 'goal.edit': 'Edit goal', 'goal.hours': 'Hours per week',
    'goal.of': '{done} of {goal}',
    'goal.reached': 'Goal reached!', 'goal.exact': 'Right on target.', 'goal.extra': '{x} extra so far.',
    'goal.left': '{left} to go · about {perDay} a day',
    'goal.daily': 'Daily target', 'goal.bars': 'Minutes each day this week', 'goal.none': 'no practice',
    'recap.title': 'Monthly recap', 'recap.prev': 'Previous month', 'recap.next': 'Next month',
    'recap.emptyNow': 'Nothing logged this month yet. Your recap builds up as you practise.',
    'recap.empty': 'No practice logged in {month}.',
    'recap.total': 'total practice', 'recap.daysWord': ['day practised', 'days practised'], 'recap.longest': 'longest streak',
    'recap.best': 'best day · {t}',
    'recap.change': '{arrow} {pct}% vs {month}',
    'recap.soFar': ' so far',
    'year.title': 'The last year',
    'year.summary': '{min} minutes · {days} {dayWord} practised',
    'legend.less': 'Less', 'legend.more': 'More',
    'tip.some': '{n} min {type}', 'tip.none': 'No {type}',
    'tip.all': 'practice', 'tip.drums': 'drums', 'tip.vocals': 'vocals',
    'sessions.title': 'Recent sessions', 'export': 'Export', 'import': 'Import',
    'sessions.empty': 'No sessions yet. Log your first one above.',
    'sessions.del': 'Delete session', 'sessions.confirm': 'Delete this session?',
    'import.ok': 'Imported {n} session(s).',
    'import.bad': 'That file doesn’t look like a Practice Log export.',

    // Timer page
    'timer.ready': 'Ready when you are', 'timer.practising': 'Practising…', 'timer.paused': 'Paused',
    'timer.finished': 'Finished', 'timer.toGo': '{t} to go', 'timer.reached': 'Goal reached. Keep going!',
    'timer.goal': 'Goal', 'timer.goalGroup': 'Session goal', 'timer.none': 'None',
    'timer.start': 'Start', 'timer.pause': 'Pause', 'timer.resume': 'Resume', 'timer.finish': 'Finish',
    'timer.discard': 'Discard this session',
    'timer.nice': 'Nice work! {t} of {type}.',
    'timer.save': 'Save session', 'timer.keep': 'Keep going',
    'timer.min1': 'Practise for at least a minute to save a session.',
    'timer.discardConfirm': 'Discard this session? The time won’t be saved.',
    'timer.savedOk': 'Saved {t} of {type} online.',
    'timer.savedLocal': 'Saved {t} of {type} on this device. It will upload next time you open the log unlocked.',
    'timer.seeLog': 'See your log',
    'timer.today': 'Practised today: {t} across {n} {word}',
    'timer.todayNone': 'Nothing logged today yet.',

    // Theory page
    'theory.h1': 'Music theory for beginners',
    'theory.intro': 'Short lessons for drums and vocals. Read one, then practise it with the timer. Tick a lesson when it clicks.',
    'theory.basics': 'Basics', 'theory.show': 'Show lessons',
    'theory.progress': '{n} of {total} lessons done',
    'theory.allDone': 'All {n} lessons done. Nice work!',
    'theory.mark': 'Mark as done', 'theory.done': '✓ Done',
    'theory.playClick': 'Play click', 'theory.playBeat': 'Play beat', 'theory.stop': 'Stop',
    'theory.playScale': 'Play the whole scale', 'theory.at90': 'at 90 BPM',
    'theory.hihat': 'Hi-hat', 'theory.snare': 'Snare', 'theory.kick': 'Kick',
    'theory.foot1': 'Ready to practise?', 'theory.foot2': 'Start the timer', 'theory.foot3': 'and log what you worked on.',
    'l.basics': 'Basics', 'l.drums': 'Drums', 'l.vocals': 'Vocals', 'l.min': '{n} min',
    'l1': 'Beat, tempo and BPM', 'l2': 'Note lengths', 'l3': 'Bars and time signatures', 'l4': 'Dynamics: loud and soft',
    'l5': 'Holding the sticks', 'l6': 'Your first three rudiments', 'l7': 'Your first rock beat', 'l8': 'Simple fills',
    'l9': 'Breathing for singing', 'l10': 'Warm-ups that actually help', 'l11': 'Pitch and the major scale',
    'l12': 'Chest voice, head voice and mix', 'l13': 'Looking after your voice',
  },

  uk: {
    'title.log': 'Журнал практики',
    'title.timer': 'Таймер · Журнал практики',
    'title.theory': 'Теорія · Журнал практики',
    'nav.pages': 'Сторінки', 'nav.log': 'Журнал', 'nav.timer': 'Таймер', 'nav.theory': 'Теорія',
    'lang.label': 'Мова',
    'drums': 'Барабани', 'vocals': 'Вокал', 'all': 'Усе',
    'drums.lower': 'барабани', 'vocals.lower': 'вокал', 'practice.lower': 'занять',
    'instrument': 'Інструмент',
    months: ['січ','лют','бер','кві','тра','чер','лип','сер','вер','жов','лис','гру'],
    monthsLong: ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'],
    weekLetters: ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'],
    'dur.hm': '{h} год {m} хв', 'dur.h': '{h} год', 'dur.m': '{m} хв',
    'min': '{n} хв',
    'hours': ['{n} година', '{n} години', '{n} годин'],
    'days': ['день', 'дні', 'днів'],
    'sessionsWord': ['заняття', 'заняття', 'занять'],
    'save': 'Зберегти', 'cancel': 'Скасувати',

    'lock': 'Заблокувати',
    'unlock.title': 'Розблокуйте журнал',
    'unlock.text': 'Введіть код доступу, щоб завантажувати й зберігати свій прогрес онлайн.',
    'unlock.ph': 'Код доступу',
    'unlock.btn': 'Розблокувати',
    'unlock.wrong': 'Код не підійшов. Спробуйте ще раз.',
    'unlock.changed': 'Код доступу змінився. Введіть його ще раз.',
    'sync.locked': 'Заблоковано', 'sync.ok': 'Збережено онлайн', 'sync.saving': 'Зберігаю…',
    'sync.partial': 'Не всі заняття завантажено',
    'sync.nodb': 'Без бази даних: лише на цьому пристрої',
    'sync.local': 'Лише на цьому пристрої',
    'sync.fail': 'Не збережено онлайн. Спробую знову після перезавантаження',
    'sync.delfail': 'Видалення не збережено онлайн',
    'sync.goalfail': 'Ціль не збережено онлайн',
    'streak.title': 'Поточна серія',
    'stat.longest': 'найдовша серія', 'stat.week': 'хв цього тижня', 'stat.hours': 'годин загалом',
    'log.title': 'Записати заняття', 'log.date': 'Дата', 'log.howlong': 'Тривалість',
    'log.notes': 'Над чим працювали?', 'log.ph': 'напр. парадидли на 90 bpm', 'log.add': 'Додати заняття',
    'goal.title': 'Ціль на тиждень', 'goal.edit': 'Змінити ціль', 'goal.hours': 'Годин на тиждень',
    'goal.of': '{done} з {goal}',
    'goal.reached': 'Ціль досягнуто!', 'goal.exact': 'Точно в ціль.', 'goal.extra': 'Вже на {x} більше.',
    'goal.left': 'Залишилось {left} · приблизно {perDay} на день',
    'goal.daily': 'Денна ціль', 'goal.bars': 'Хвилини за кожен день тижня', 'goal.none': 'без занять',
    'recap.title': 'Підсумки місяця', 'recap.prev': 'Попередній місяць', 'recap.next': 'Наступний місяць',
    'recap.emptyNow': 'Цього місяця ще нічого не записано. Підсумки з’являться, щойно ви почнете займатися.',
    'recap.empty': 'У цьому місяці ({month}) занять не записано.',
    'recap.total': 'всього практики', 'recap.daysWord': ['день із заняттями', 'дні із заняттями', 'днів із заняттями'], 'recap.longest': 'найдовша серія',
    'recap.best': 'найкращий день · {t}',
    'recap.change': '{arrow} {pct}% порівняно з минулим місяцем',
    'recap.soFar': ' (поки що)',
    'year.title': 'Останній рік',
    'year.summary': '{min} хв · {days} {dayWord} із заняттями',
    'legend.less': 'Менше', 'legend.more': 'Більше',
    'tip.some': '{type}: {n} хв', 'tip.none': '{type}: немає',
    'tip.all': 'Заняття', 'tip.drums': 'Барабани', 'tip.vocals': 'Вокал',
    'sessions.title': 'Останні заняття', 'export': 'Експорт', 'import': 'Імпорт',
    'sessions.empty': 'Ще немає занять. Запишіть перше вище.',
    'sessions.del': 'Видалити заняття', 'sessions.confirm': 'Видалити це заняття?',
    'import.ok': 'Імпортовано занять: {n}.',
    'import.bad': 'Цей файл не схожий на експорт із Practice Log.',

    'timer.ready': 'Готово до старту', 'timer.practising': 'Займаємось…', 'timer.paused': 'Пауза',
    'timer.finished': 'Завершено', 'timer.toGo': 'Залишилось {t}', 'timer.reached': 'Ціль досягнуто. Продовжуйте!',
    'timer.goal': 'Ціль', 'timer.goalGroup': 'Ціль заняття', 'timer.none': 'Без цілі',
    'timer.start': 'Старт', 'timer.pause': 'Пауза', 'timer.resume': 'Продовжити', 'timer.finish': 'Завершити',
    'timer.discard': 'Скасувати це заняття',
    'timer.nice': 'Чудова робота! {type}: {t}.',
    'timer.save': 'Зберегти заняття', 'timer.keep': 'Продовжити',
    'timer.min1': 'Щоб зберегти заняття, позаймайтеся хоча б хвилину.',
    'timer.discardConfirm': 'Скасувати це заняття? Час не буде збережено.',
    'timer.savedOk': 'Збережено онлайн: {type}, {t}.',
    'timer.savedLocal': 'Збережено на цьому пристрої: {type}, {t}. Заняття завантажиться онлайн, коли ви відкриєте розблокований журнал.',
    'timer.seeLog': 'Відкрити журнал',
    'timer.today': 'Сьогодні: {t}, {n} {word}',
    'timer.todayNone': 'Сьогодні ще нічого не записано.',

    'theory.h1': 'Музична теорія для початківців',
    'theory.intro': 'Короткі уроки для барабанів і вокалу. Прочитайте урок, а потім попрактикуйтеся з таймером. Позначайте урок, коли все зрозуміло.',
    'theory.basics': 'Основи', 'theory.show': 'Показати уроки',
    'theory.progress': 'Пройдено уроків: {n} з {total}',
    'theory.allDone': 'Усі {n} уроків пройдено. Чудова робота!',
    'theory.mark': 'Позначити як пройдений', 'theory.done': '✓ Пройдено',
    'theory.playClick': 'Увімкнути клік', 'theory.playBeat': 'Увімкнути біт', 'theory.stop': 'Стоп',
    'theory.playScale': 'Зіграти всю гаму', 'theory.at90': 'на 90 BPM',
    'theory.hihat': 'Хай-хет', 'theory.snare': 'Малий', 'theory.kick': 'Бочка',
    'theory.foot1': 'Готові займатися?', 'theory.foot2': 'Запустіть таймер', 'theory.foot3': 'і запишіть, над чим працювали.',
    'l.basics': 'Основи', 'l.drums': 'Барабани', 'l.vocals': 'Вокал', 'l.min': '{n} хв',
    'l1': 'Пульс, темп і BPM', 'l2': 'Тривалості нот', 'l3': 'Такти й розмір', 'l4': 'Динаміка: голосно й тихо',
    'l5': 'Як тримати палички', 'l6': 'Перші три рудименти', 'l7': 'Ваш перший рок-біт', 'l8': 'Прості збивки',
    'l9': 'Дихання для співу', 'l10': 'Розспівки, які справді допомагають', 'l11': 'Висота звуку й мажорна гама',
    'l12': 'Грудний, головний і мікстовий голос', 'l13': 'Як берегти голос',
  },
};

let LANG = (() => {
  try { const s = localStorage.getItem(LANG_KEY); if (s === 'en' || s === 'uk') return s; } catch {}
  return (navigator.language || '').toLowerCase().startsWith('uk') ? 'uk' : 'en';
})();

function t(key, vars) {
  let s = I18N[LANG][key] ?? I18N.en[key] ?? key;
  if (vars && typeof s === 'string') s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
  return s;
}

// Picks the right plural form: English has 2 forms, Ukrainian 3 (1 день, 2 дні, 5 днів)
function plural(n, key, vars) {
  const forms = t(key);
  let i;
  if (LANG === 'uk') {
    const m10 = n % 10, m100 = n % 100;
    i = m10 === 1 && m100 !== 11 ? 0 : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 1 : 2;
  } else {
    i = n === 1 ? 0 : 1;
  }
  return forms[i].replace(/\{(\w+)\}/g, (_, k) => ({ n, ...vars })[k] ?? '');
}

function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(e => { e.textContent = t(e.dataset.i18n); });
  root.querySelectorAll('[data-i18n-ph]').forEach(e => { e.placeholder = t(e.dataset.i18nPh); });
  root.querySelectorAll('[data-i18n-aria]').forEach(e => { e.setAttribute('aria-label', t(e.dataset.i18nAria)); });
  const titleKey = document.body.dataset.title;
  if (titleKey) document.title = t(titleKey);
  document.documentElement.lang = LANG;
  document.querySelectorAll('.lang-switch button').forEach(b => {
    const on = b.dataset.lang === LANG;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  });
}

function setLang(l) {
  if (l === LANG) return;
  LANG = l;
  try { localStorage.setItem(LANG_KEY, l); } catch {}
  applyI18n();
  document.dispatchEvent(new Event('langchange'));
}

document.querySelectorAll('.lang-switch button').forEach(b => { b.onclick = () => setLang(b.dataset.lang); });
applyI18n();
