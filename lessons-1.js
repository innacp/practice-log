// Theory lessons, level 1: Beginner. Each lesson has English and Ukrainian text.
// Piano examples: <div class="pw" data-notes="C4 E4 G4" data-mode="seq|chord|both|prog" data-labels="1 3 5" data-caption="..."></div>
// Metronome: <div class="metro" data-bpm="90" data-beats="4"></div>
(window.LESSONS = window.LESSONS || []).push(

{
  id: 'keyboard', level: 'beginner', mins: 5,
  title: { en: 'Finding your way on the keyboard', uk: 'Як орієнтуватися на клавіатурі' },
  body: {
    en: `
<p>The piano is the clearest way to <b>see</b> music theory. Every note has a fixed place, and the patterns you will learn later (scales, chords) become shapes you can see on the keys.</p>
<h3>Low to high</h3>
<p>Keys go from <b>low</b> sounds on the left to <b>high</b> sounds on the right. Tap a few keys below, left then right, and listen.</p>
<div class="pw" data-range="C3-B5"></div>
<h3>Groups of two and three</h3>
<p>Look only at the black keys. They come in groups of <b>two</b>, then <b>three</b>, then two, then three, all the way along. This repeating pattern is your map: you never need to count keys from the edge.</p>
<div class="pw" data-notes="C#4 D#4 | F#4 G#4 A#4" data-caption="A group of 2, then a group of 3"></div>
<h3>Finding C</h3>
<p><b>C</b> is the white key just to the <b>left of every group of two black keys</b>. The C nearest the middle of a real piano is called <b>middle C</b>, or <b>C4</b>. It is the most important landmark: we describe other notes by how far they are from it.</p>
<div class="pw" data-notes="C3 C4 C5" data-range="C3-B5" data-caption="Every C on this keyboard"></div>
<h3>Octaves</h3>
<p>From one C up to the next C is an <b>octave</b>. It contains 12 keys: 7 white and 5 black. Two Cs an octave apart sound like the <i>same note</i>, one higher and one lower. That is why note names repeat, and why we add a number (C3, C4, C5) to say <i>which</i> C.</p>
<div class="key-idea"><b>Key idea:</b> the black-key groups (2 and 3) repeat every octave. C sits left of the two. Learn this and you can find any note on any piano.</div>
<p class="tip"><b>Try it:</b> on a real piano or the keyboard above, find every C without counting from the edge. Then find every key just left of a group of <i>three</i> black keys: that is F.</p>`,
    uk: `
<p>Фортепіано — найнаочніший спосіб <b>побачити</b> музичну теорію. Кожна нота має своє незмінне місце, а закономірності, які ви вивчатимете далі (гами, акорди), перетворюються на фігури, які видно на клавішах.</p>
<h3>Від низьких до високих</h3>
<p>Ліворуч — <b>низькі</b> звуки, праворуч — <b>високі</b>. Натисніть кілька клавіш нижче, спершу ліворуч, потім праворуч, і послухайте.</p>
<div class="pw" data-range="C3-B5"></div>
<h3>Групи з двох і трьох</h3>
<p>Подивіться лише на чорні клавіші. Вони йдуть групами по <b>дві</b>, потім по <b>три</b>, знову по дві, по три — і так по всій клавіатурі. Цей візерунок і є вашою картою: рахувати клавіші від краю не потрібно.</p>
<div class="pw" data-notes="C#4 D#4 | F#4 G#4 A#4" data-caption="Група з 2, потім група з 3"></div>
<h3>Де шукати до (C)</h3>
<p><b>До</b> (латинською <b>C</b>) — біла клавіша одразу <b>ліворуч від кожної групи з двох чорних</b>. До, найближче до середини справжнього фортепіано, називають <b>до першої октави</b>, або <b>C4</b>. Це головний орієнтир: інші ноти описують відносно нього.</p>
<div class="pw" data-notes="C3 C4 C5" data-range="C3-B5" data-caption="Усі до (C) на цій клавіатурі"></div>
<h3>Октави</h3>
<p>Відстань від одного до до наступного — це <b>октава</b>. У ній 12 клавіш: 7 білих і 5 чорних. Два до на відстані октави звучать як <i>та сама нота</i>, лише вище чи нижче. Тому назви нот повторюються, а щоб уточнити, <i>яке саме</i> до, додають число: C3, C4, C5.</p>
<div class="key-idea"><b>Головне:</b> групи чорних клавіш (2 і 3) повторюються щооктави. До стоїть ліворуч від двох. Запам’ятайте це — і знайдете будь-яку ноту на будь-якому фортепіано.</div>
<p class="tip"><b>Спробуйте:</b> на справжньому фортепіано чи на клавіатурі вище знайдіть усі до, не рахуючи від краю. Потім знайдіть клавіші ліворуч від групи з <i>трьох</i> чорних — це фа (F).</p>`
  }
},

{
  id: 'note-names', level: 'beginner', mins: 6,
  title: { en: 'Note names, sharps and flats', uk: 'Назви нот, дієзи й бемолі' },
  body: {
    en: `
<p>Music uses only <b>seven letter names</b> for the white keys: <b>C D E F G A B</b>. After B comes C again, one octave higher. You may also know them as <b>do re mi fa sol la ti</b>.</p>
<div class="pw" data-notes="C4 D4 E4 F4 G4 A4 B4 C5" data-labels="do re mi fa sol la ti do" data-caption="The white keys from C to C"></div>
<h3>Naming the black keys</h3>
<p>Black keys borrow their names from their white neighbours:</p>
<ul>
  <li>A <b>sharp (♯)</b> raises a note to the very next key on the right. The black key right of C is <b>C♯</b>.</li>
  <li>A <b>flat (♭)</b> lowers a note to the very next key on the left. The same black key, seen from D, is <b>D♭</b>.</li>
</ul>
<div class="pw" data-notes="C4 C#4 D4" data-caption="C, then C♯ (= D♭), then D"></div>
<p>So one black key has <b>two names</b>: C♯ and D♭ are the same sound. Notes like this are called <b>enharmonic</b>. Which name we use depends on the key you are playing in. You will see why in the scale lessons.</p>
<h3>The two "missing" black keys</h3>
<p>There is no black key between <b>E and F</b>, or between <b>B and C</b>. These white keys sit right next to each other. Remember these two spots: they explain almost every pattern in scales.</p>
<div class="pw" data-notes="E4 F4 | B4 C5" data-caption="E–F and B–C: no black key between"></div>
<p>A <b>natural (♮)</b> cancels a sharp or flat and brings the note back to its white key.</p>
<div class="key-idea"><b>Key idea:</b> 7 letters for the white keys, ♯ and ♭ for the black ones. Every black key has two names.</div>
<p class="tip"><b>Try it:</b> point to these keys above without looking at the labels: F♯, B♭, E♭, G♯. Then say the other name for each one (G♭, A♯, D♯, A♭).</p>`,
    uk: `
<p>Для білих клавіш у музиці є лише <b>сім назв</b>: <b>до ре мі фа соль ля сі</b>. Міжнародною системою їх позначають літерами <b>C D E F G A B</b>. Після сі знову йде до, на октаву вище.</p>
<div class="pw" data-notes="C4 D4 E4 F4 G4 A4 B4 C5" data-labels="до ре мі фа соль ля сі до" data-caption="Білі клавіші від до до до"></div>
<p class="note">У нашій академічній традиції сі часто позначають літерою <b>H</b>, а <b>B</b> означає сі-бемоль. Тут ми користуємося міжнародною системою, де <b>B = сі</b>: так пишуть в акордах, програмах і більшості сучасних нот.</p>
<h3>Як називаються чорні клавіші</h3>
<p>Чорні клавіші отримують назви від сусідніх білих:</p>
<ul>
  <li><b>Дієз (♯)</b> підвищує ноту до найближчої клавіші праворуч. Чорна клавіша праворуч від до — це <b>до-дієз (C♯)</b>.</li>
  <li><b>Бемоль (♭)</b> знижує ноту до найближчої клавіші ліворуч. Та сама чорна клавіша, якщо дивитися від ре, — <b>ре-бемоль (D♭)</b>.</li>
</ul>
<div class="pw" data-notes="C4 C#4 D4" data-caption="До, до-дієз (= ре-бемоль), ре"></div>
<p>Отже, в однієї чорної клавіші <b>дві назви</b>: C♯ і D♭ звучать однаково. Такі ноти називають <b>енгармонічно рівними</b>. Яку назву обрати, залежить від тональності — чому, побачите в уроках про гами.</p>
<h3>Два місця без чорних клавіш</h3>
<p>Між <b>мі і фа</b> (E–F) та між <b>сі і до</b> (B–C) чорних клавіш немає: ці білі клавіші стоять поруч. Запам’ятайте ці два місця — вони пояснюють майже всі закономірності в гамах.</p>
<div class="pw" data-notes="E4 F4 | B4 C5" data-caption="Мі–фа і сі–до: чорної клавіші між ними немає"></div>
<p><b>Бекар (♮)</b> скасовує дієз чи бемоль і повертає ноту на білу клавішу.</p>
<div class="key-idea"><b>Головне:</b> 7 назв для білих клавіш, ♯ і ♭ — для чорних. Кожна чорна клавіша має дві назви.</div>
<p class="tip"><b>Спробуйте:</b> не дивлячись на підписи, покажіть на клавіатурі вище фа-дієз, сі-бемоль, мі-бемоль, соль-дієз. Потім назвіть другу назву кожної з них (соль-бемоль, ля-дієз, ре-дієз, ля-бемоль).</p>`
  }
},

{
  id: 'steps', level: 'beginner', mins: 5,
  title: { en: 'Half steps and whole steps', uk: 'Півтони й тони' },
  body: {
    en: `
<p>To build scales and chords we need a way to measure distance between notes. On the piano it is simple: count keys.</p>
<h3>Half step</h3>
<p>A <b>half step</b> (also called a <b>semitone</b>) is the distance from one key to the <b>very next key</b>, black or white, with nothing in between. It is the smallest distance on the piano.</p>
<div class="pw" data-notes="C4 C#4 | E4 F4 | B4 C5" data-caption="Three half steps: C–C♯, E–F, B–C"></div>
<p>Notice E–F and B–C: both keys are white, but they are still only a half step apart, because there is no black key between them.</p>
<h3>Whole step</h3>
<p>A <b>whole step</b> (a <b>tone</b>) is <b>two half steps</b>: you skip exactly one key.</p>
<div class="pw" data-notes="C4 D4 | E4 F#4 | A#4 C5" data-caption="Three whole steps: C–D, E–F♯, B♭–C"></div>
<h3>Counting bigger distances</h3>
<p>Larger distances are just more half steps. From C up to E: C → C♯ → D → D♯ → E is <b>4 half steps</b>, which is 2 whole steps. From C up to G is 7 half steps.</p>
<div class="key-idea"><b>Key idea:</b> half step = next key. Whole step = skip one key. Every scale and chord in the next levels is just a recipe of half and whole steps.</div>
<p class="tip"><b>Try it:</b> start on any key and move up in whole steps: you will get back to the same letter after six steps. Then try from D: D, E, F♯, G♯, A♯, C, D.</p>`,
    uk: `
<p>Щоб будувати гами й акорди, потрібно вміти вимірювати відстань між нотами. На фортепіано це просто: рахуйте клавіші.</p>
<h3>Півтон</h3>
<p><b>Півтон</b> — відстань від однієї клавіші до <b>найближчої сусідньої</b>, чорної чи білої, без жодної клавіші між ними. Це найменша відстань на фортепіано.</p>
<div class="pw" data-notes="C4 C#4 | E4 F4 | B4 C5" data-caption="Три півтони: до–до♯, мі–фа, сі–до"></div>
<p>Зверніть увагу на мі–фа і сі–до: обидві клавіші білі, але відстань між ними — лише півтон, бо чорної клавіші між ними немає.</p>
<h3>Тон</h3>
<p><b>Тон</b> — це <b>два півтони</b>: ви перестрибуєте рівно через одну клавішу.</p>
<div class="pw" data-notes="C4 D4 | E4 F#4 | A#4 C5" data-caption="Три тони: до–ре, мі–фа♯, сі♭–до"></div>
<h3>Як рахувати більші відстані</h3>
<p>Більші відстані — це просто більше півтонів. Від до до мі: до → до♯ → ре → ре♯ → мі — <b>4 півтони</b>, тобто 2 тони. Від до до соль — 7 півтонів.</p>
<div class="key-idea"><b>Головне:</b> півтон — сусідня клавіша. Тон — через одну клавішу. Кожна гама й кожен акорд на наступних рівнях — це просто рецепт із тонів і півтонів.</div>
<p class="tip"><b>Спробуйте:</b> почніть із будь-якої клавіші й рухайтеся вгору тонами: через шість кроків ви повернетеся на ту саму ноту. Потім спробуйте від ре: ре, мі, фа♯, соль♯, ля♯, до, ре.</p>`
  }
},

{
  id: 'rhythm', level: 'beginner', mins: 7,
  title: { en: 'Rhythm: beat, tempo and note lengths', uk: 'Ритм: пульс, темп і тривалості' },
  body: {
    en: `
<p>Notes on the piano tell you <i>which</i> sound to play. <b>Rhythm</b> tells you <i>when</i> and <i>for how long</i>.</p>
<h3>Beat and tempo</h3>
<p>The <b>beat</b> is the steady pulse you tap your foot to. <b>Tempo</b> is how fast it goes, measured in <b>BPM</b> (beats per minute). 60 BPM is one beat per second; 120 BPM is twice as fast.</p>
<div class="metro" data-bpm="90" data-beats="4"></div>
<h3>Note lengths</h3>
<p>Each note length is exactly half of the one above it:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Note</th><th>Lasts (in 4/4)</th><th>How many fit in a bar</th><th>Counting</th></tr></thead>
  <tbody>
    <tr><td>Whole</td><td>4 beats</td><td>1</td><td>1 – 2 – 3 – 4</td></tr>
    <tr><td>Half</td><td>2 beats</td><td>2</td><td>1 – 2, 3 – 4</td></tr>
    <tr><td>Quarter</td><td>1 beat</td><td>4</td><td>1 2 3 4</td></tr>
    <tr><td>Eighth</td><td>½ beat</td><td>8</td><td>1 & 2 & 3 & 4 &</td></tr>
    <tr><td>Sixteenth</td><td>¼ beat</td><td>16</td><td>1 e & a 2 e & a …</td></tr>
  </tbody>
</table></div>
<h3>Rests, dots and ties</h3>
<ul>
  <li>A <b>rest</b> is a silence with the same lengths as notes. A quarter rest = be quiet for one beat. Count rests as carefully as notes.</li>
  <li>A <b>dot</b> after a note adds half of its length: a dotted half note = 2 + 1 = <b>3 beats</b>.</li>
  <li>A <b>tie</b> (a curved line joining two equal notes) means play once and hold for both lengths together.</li>
</ul>
<h3>Loud and soft</h3>
<p><b>Dynamics</b> mark how loud to play: <i>pp</i> (very soft), <i>p</i>, <i>mp</i>, <i>mf</i>, <i>f</i>, <i>ff</i> (very loud). A <b>crescendo</b> (&lt;) means get gradually louder, a <b>diminuendo</b> (&gt;) gradually softer.</p>
<div class="key-idea"><b>Key idea:</b> keep the beat steady and fit everything else into it. Counting out loud is not for beginners only: professionals do it too when a rhythm is tricky.</div>
<p class="tip"><b>Try it:</b> with the click at 60 BPM, play middle C as a whole note, then two halves, four quarters and eight eighths, counting aloud each time.</p>`,
    uk: `
<p>Клавіші показують, <i>який</i> звук грати. <b>Ритм</b> показує, <i>коли</i> і <i>як довго</i>.</p>
<h3>Пульс і темп</h3>
<p><b>Пульс</b> (доля) — рівномірні удари, під які ви притупуєте ногою. <b>Темп</b> — їхня швидкість у <b>BPM</b> (ударах за хвилину). 60 BPM — одна доля щосекунди, 120 BPM — удвічі швидше.</p>
<div class="metro" data-bpm="90" data-beats="4"></div>
<h3>Тривалості нот</h3>
<p>Кожна наступна тривалість рівно вдвічі коротша за попередню:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Нота</th><th>Тривалість (у 4/4)</th><th>Скільки в такті</th><th>Як рахувати</th></tr></thead>
  <tbody>
    <tr><td>Ціла</td><td>4 долі</td><td>1</td><td>раз – два – три – чотири</td></tr>
    <tr><td>Половинна</td><td>2 долі</td><td>2</td><td>раз – два, три – чотири</td></tr>
    <tr><td>Четвертна</td><td>1 доля</td><td>4</td><td>раз два три чотири</td></tr>
    <tr><td>Восьма</td><td>½ долі</td><td>8</td><td>раз і два і три і чотири і</td></tr>
    <tr><td>Шістнадцята</td><td>¼ долі</td><td>16</td><td>раз-і-ма-і два-і-ма-і …</td></tr>
  </tbody>
</table></div>
<h3>Паузи, крапки й ліги</h3>
<ul>
  <li><b>Пауза</b> — тиша з такими самими тривалостями, як у нот. Четвертна пауза — мовчимо одну долю. Рахуйте паузи так само уважно, як ноти.</li>
  <li><b>Крапка</b> після ноти додає половину її тривалості: половинна з крапкою = 2 + 1 = <b>3 долі</b>.</li>
  <li><b>Ліга</b> (дуга між двома однаковими нотами) означає: зіграти один раз і тримати обидві тривалості разом.</li>
</ul>
<h3>Голосно й тихо</h3>
<p><b>Динаміка</b> показує гучність: <i>pp</i> (дуже тихо), <i>p</i>, <i>mp</i>, <i>mf</i>, <i>f</i>, <i>ff</i> (дуже голосно). <b>Крещендо</b> (&lt;) — поступово голосніше, <b>димінуендо</b> (&gt;) — поступово тихіше.</p>
<div class="key-idea"><b>Головне:</b> тримайте пульс рівним і вкладайте в нього все інше. Рахувати вголос — не лише для початківців: професіонали теж так роблять, коли ритм складний.</div>
<p class="tip"><b>Спробуйте:</b> під клік 60 BPM зіграйте до першої октави цілою нотою, потім двома половинними, чотирма четвертними й вісьмома восьмими, щоразу рахуючи вголос.</p>`
  }
},

{
  id: 'meter', level: 'beginner', mins: 5,
  title: { en: 'Bars and time signatures', uk: 'Такти й розмір' },
  body: {
    en: `
<p>Beats are grouped into small boxes called <b>bars</b> (or measures), separated by vertical bar lines. Grouping makes music easier to read and gives it a feel: some beats are <b>strong</b>, others <b>weak</b>.</p>
<h3>Reading a time signature</h3>
<p>The two stacked numbers at the start of a piece are the <b>time signature</b>:</p>
<ul>
  <li><b>Top number</b>: how many beats are in each bar.</li>
  <li><b>Bottom number</b>: which note length counts as one beat (4 = quarter note, 8 = eighth note).</li>
</ul>
<div class="sig-row">
  <div class="sig"><b>4<br>4</b><span>Four beats per bar. The most common by far. Strong on 1, medium on 3: "<b>1</b> 2 <i>3</i> 4".</span></div>
  <div class="sig"><b>3<br>4</b><span>Three beats per bar: the waltz. "<b>1</b> 2 3, <b>1</b> 2 3".</span></div>
  <div class="sig"><b>2<br>4</b><span>Two beats per bar: marches and polkas. "<b>1</b> 2, <b>1</b> 2".</span></div>
  <div class="sig"><b>6<br>8</b><span>Six eighth notes in two groups of three. Feels like a sway: "<b>1</b> 2 3 <i>4</i> 5 6".</span></div>
</div>
<p>Hear the difference: the first click of each bar is higher.</p>
<div class="metro" data-bpm="90" data-beats="3"></div>
<h3>Upbeats</h3>
<p>Many melodies start <b>before</b> beat 1, on the last beat of an incomplete bar. This is called an <b>upbeat</b> or <b>pickup</b>. Count it as the end of the previous bar: "(4) <b>1</b> 2 3 4".</p>
<div class="key-idea"><b>Key idea:</b> the time signature tells you how to count. Beat 1 of every bar is the strongest: chords usually change there.</div>
<p class="tip"><b>Try it:</b> play C–E–G as single notes in 3/4, one note per beat, making the C on beat 1 a little louder each time.</p>`,
    uk: `
<p>Долі об’єднуються в невеликі групи — <b>такти</b>, які розділяють вертикальні тактові риски. Так музику легше читати, і вона отримує характер: одні долі <b>сильні</b>, інші <b>слабкі</b>.</p>
<h3>Як читати розмір</h3>
<p>Два числа одне над одним на початку твору — це <b>розмір</b>:</p>
<ul>
  <li><b>Верхнє число</b>: скільки долей у кожному такті.</li>
  <li><b>Нижнє число</b>: яка тривалість дорівнює одній долі (4 — четвертна, 8 — восьма).</li>
</ul>
<div class="sig-row">
  <div class="sig"><b>4<br>4</b><span>Чотири долі в такті. Найпоширеніший розмір. Сильна — перша, відносно сильна — третя: «<b>раз</b> два <i>три</i> чотири».</span></div>
  <div class="sig"><b>3<br>4</b><span>Три долі в такті — вальс. «<b>Раз</b> два три, <b>раз</b> два три».</span></div>
  <div class="sig"><b>2<br>4</b><span>Дві долі в такті: марші й польки. «<b>Раз</b> два, <b>раз</b> два».</span></div>
  <div class="sig"><b>6<br>8</b><span>Шість восьмих двома групами по три. Відчувається як погойдування: «<b>раз</b> два три <i>чотири</i> п’ять шість».</span></div>
</div>
<p>Послухайте різницю: перший клік кожного такту вищий.</p>
<div class="metro" data-bpm="90" data-beats="3"></div>
<h3>Затакт</h3>
<p>Багато мелодій починаються <b>до</b> першої долі, на останній долі неповного такту. Це <b>затакт</b>. Рахуйте його як кінець попереднього такту: «(чотири) <b>раз</b> два три чотири».</p>
<div class="key-idea"><b>Головне:</b> розмір підказує, як рахувати. Перша доля кожного такту найсильніша — зазвичай саме на ній змінюються акорди.</div>
<p class="tip"><b>Спробуйте:</b> зіграйте до–мі–соль окремими нотами в розмірі 3/4, по ноті на долю, щоразу граючи до на першій долі трохи голосніше.</p>`
  }
},

{
  id: 'staff', level: 'beginner', mins: 8,
  title: { en: 'Reading notes on the staff', uk: 'Як читати ноти на нотному стані' },
  body: {
    en: `
<p>Written music uses a <b>staff</b>: five lines with four spaces between them. Each line and each space is one white key. Higher on the staff = higher on the piano.</p>
<h3>Two clefs for two hands</h3>
<ul>
  <li>The <b>treble clef</b> (𝄞) is for higher notes, usually the <b>right hand</b>.</li>
  <li>The <b>bass clef</b> (𝄢) is for lower notes, usually the <b>left hand</b>.</li>
</ul>
<p>Piano music joins both staffs with a brace. <b>Middle C</b> sits exactly between them, on its own short extra line called a <b>ledger line</b>.</p>
<svg class="staff" viewBox="0 0 360 110" role="img" aria-label="Treble staff with notes E G B D F on the lines">
  <g stroke="currentColor" stroke-width="1.2" opacity="0.55"><line x1="10" y1="20" x2="350" y2="20"/><line x1="10" y1="32" x2="350" y2="32"/><line x1="10" y1="44" x2="350" y2="44"/><line x1="10" y1="56" x2="350" y2="56"/><line x1="10" y1="68" x2="350" y2="68"/><line x1="40" y1="80" x2="64" y2="80"/></g>
  <text x="14" y="62" font-size="46" fill="currentColor" opacity="0.8">𝄞</text>
  <g fill="#C800F5"><ellipse cx="52" cy="80" rx="7" ry="5"/><ellipse cx="100" cy="68" rx="7" ry="5"/><ellipse cx="150" cy="56" rx="7" ry="5"/><ellipse cx="200" cy="44" rx="7" ry="5"/><ellipse cx="250" cy="32" rx="7" ry="5"/><ellipse cx="300" cy="20" rx="7" ry="5"/></g>
  <g font-size="12" font-weight="700" fill="currentColor" text-anchor="middle"><text x="52" y="103">C4</text><text x="100" y="103">E</text><text x="150" y="103">G</text><text x="200" y="103">B</text><text x="250" y="103">D</text><text x="300" y="103">F</text></g>
</svg>
<h3>Treble clef: memory tricks</h3>
<ul>
  <li>Lines, bottom to top: <b>E G B D F</b> ("<b>E</b>very <b>G</b>ood <b>B</b>oy <b>D</b>oes <b>F</b>ine").</li>
  <li>Spaces, bottom to top: <b>F A C E</b> (spells "face").</li>
</ul>
<div class="pw" data-notes="E4 G4 B4 D5 F5" data-labels="E G B D F" data-caption="Treble clef lines on the piano"></div>
<div class="pw" data-notes="F4 A4 C5 E5" data-labels="F A C E" data-caption="Treble clef spaces: F A C E"></div>
<h3>Bass clef: memory tricks</h3>
<ul>
  <li>Lines: <b>G B D F A</b> ("<b>G</b>ood <b>B</b>oys <b>D</b>o <b>F</b>ine <b>A</b>lways").</li>
  <li>Spaces: <b>A C E G</b> ("<b>A</b>ll <b>C</b>ows <b>E</b>at <b>G</b>rass").</li>
</ul>
<div class="pw" data-notes="G2 B2 D3 F3 A3" data-labels="G B D F A" data-caption="Bass clef lines on the piano"></div>
<p>Sharps (♯) and flats (♭) are written just <b>before</b> a note and last until the end of that bar.</p>
<div class="key-idea"><b>Key idea:</b> don't read every note from scratch. Learn a few landmarks (middle C, treble G, bass F) and read the others as steps up or down from them.</div>
<p class="tip"><b>Try it:</b> say the line notes of both clefs out loud from memory, then play them. Five minutes a day of this makes sight-reading much faster within a few weeks.</p>`,
    uk: `
<p>Музику записують на <b>нотному стані</b>: п’ять ліній і чотири проміжки між ними. Кожна лінія і кожен проміжок — це одна біла клавіша. Вище на нотному стані — вище на фортепіано.</p>
<h3>Два ключі для двох рук</h3>
<ul>
  <li><b>Скрипковий ключ</b> (𝄞) — для вищих нот, зазвичай <b>права рука</b>.</li>
  <li><b>Басовий ключ</b> (𝄢) — для нижчих нот, зазвичай <b>ліва рука</b>.</li>
</ul>
<p>У фортепіанних нотах обидва стани з’єднані фігурною дужкою. <b>До першої октави</b> розташоване рівно між ними, на окремій короткій лінії — <b>додатковій лінії</b>.</p>
<svg class="staff" viewBox="0 0 360 110" role="img" aria-label="Скрипковий ключ із нотами мі, соль, сі, ре, фа на лініях">
  <g stroke="currentColor" stroke-width="1.2" opacity="0.55"><line x1="10" y1="20" x2="350" y2="20"/><line x1="10" y1="32" x2="350" y2="32"/><line x1="10" y1="44" x2="350" y2="44"/><line x1="10" y1="56" x2="350" y2="56"/><line x1="10" y1="68" x2="350" y2="68"/><line x1="40" y1="80" x2="64" y2="80"/></g>
  <text x="14" y="62" font-size="46" fill="currentColor" opacity="0.8">𝄞</text>
  <g fill="#C800F5"><ellipse cx="52" cy="80" rx="7" ry="5"/><ellipse cx="100" cy="68" rx="7" ry="5"/><ellipse cx="150" cy="56" rx="7" ry="5"/><ellipse cx="200" cy="44" rx="7" ry="5"/><ellipse cx="250" cy="32" rx="7" ry="5"/><ellipse cx="300" cy="20" rx="7" ry="5"/></g>
  <g font-size="12" font-weight="700" fill="currentColor" text-anchor="middle"><text x="52" y="103">до¹</text><text x="100" y="103">мі</text><text x="150" y="103">соль</text><text x="200" y="103">сі</text><text x="250" y="103">ре</text><text x="300" y="103">фа</text></g>
</svg>
<h3>Скрипковий ключ: як запам’ятати</h3>
<ul>
  <li>Лінії знизу вгору: <b>мі, соль, сі, ре, фа</b> (E G B D F). Корисно запам’ятати як «через одну»: мі (фа) соль (ля) сі (до) ре (мі) фа.</li>
  <li>Проміжки знизу вгору: <b>фа, ля, до, мі</b> (F A C E — англійською це слово «face», обличчя).</li>
</ul>
<div class="pw" data-notes="E4 G4 B4 D5 F5" data-labels="мі соль сі ре фа" data-caption="Лінії скрипкового ключа на клавіатурі"></div>
<div class="pw" data-notes="F4 A4 C5 E5" data-labels="фа ля до мі" data-caption="Проміжки скрипкового ключа"></div>
<h3>Басовий ключ: як запам’ятати</h3>
<ul>
  <li>Лінії знизу вгору: <b>соль, сі, ре, фа, ля</b> (G B D F A).</li>
  <li>Проміжки: <b>ля, до, мі, соль</b> (A C E G).</li>
</ul>
<div class="pw" data-notes="G2 B2 D3 F3 A3" data-labels="соль сі ре фа ля" data-caption="Лінії басового ключа на клавіатурі"></div>
<p>Дієзи (♯) і бемолі (♭) пишуть <b>перед</b> нотою, і вони діють до кінця такту.</p>
<div class="key-idea"><b>Головне:</b> не читайте кожну ноту з нуля. Вивчіть кілька орієнтирів (до першої октави, соль у скрипковому ключі, фа в басовому) і читайте інші ноти як кроки вгору чи вниз від них.</div>
<p class="tip"><b>Спробуйте:</b> назвіть уголос ноти на лініях обох ключів напам’ять, а потім зіграйте їх. П’ять хвилин такої вправи щодня за кілька тижнів помітно прискорюють читання з листа.</p>`
  }
}

);
