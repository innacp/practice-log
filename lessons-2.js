// Theory lessons, level 2: Intermediate.
(window.LESSONS = window.LESSONS || []).push(

{
  id: 'major-scale', level: 'intermediate', mins: 8,
  title: { en: 'The major scale', uk: 'Мажорна гама' },
  body: {
    en: `
<p>A <b>scale</b> is a set of notes in order that a piece of music is built from. The <b>major scale</b> is the most important one: it sounds bright and settled, and almost all other theory is explained by comparing to it.</p>
<h3>The recipe</h3>
<p>Every major scale follows the same pattern of steps (W = whole step, H = half step):</p>
<p class="formula">W &nbsp; W &nbsp; <b>H</b> &nbsp; W &nbsp; W &nbsp; W &nbsp; <b>H</b></p>
<p>Start on C and follow it: you get only white keys. That is why C major is the first scale everyone learns: the two half steps fall exactly on E–F and B–C.</p>
<div class="pw" data-notes="C4 D4 E4 F4 G4 A4 B4 C5" data-labels="1 2 3 4 5 6 7 8" data-caption="C major: the notes are numbered 1–7 (scale degrees)"></div>
<h3>Scale degrees</h3>
<p>The numbers 1 to 7 are <b>scale degrees</b>. They let us talk about any key at once. Degree <b>1</b> is "home" (the <b>tonic</b>). Degree <b>7</b> is a half step below home and pulls strongly towards it: play C major and stop on B to feel it.</p>
<h3>Other major scales</h3>
<p>Start the recipe on a different note and you will need black keys to keep the pattern. From G, the 7th note must be <b>F♯</b> (not F) to keep the half step at the end:</p>
<div class="pw" data-notes="G4 A4 B4 C5 D5 E5 F#5 G5" data-labels="1 2 3 4 5 6 7 8" data-caption="G major: one sharp, F♯"></div>
<p>From F, the 4th note must be <b>B♭</b>, so the half step falls between degrees 3 and 4:</p>
<div class="pw" data-notes="F4 G4 A4 Bb4 C5 D5 E5 F5" data-labels="1 2 3 4 5 6 7 8" data-caption="F major: one flat, B♭"></div>
<p>Each letter is used <b>exactly once</b> in a scale. That is why F major has B♭ and not A♯: it already has an A.</p>
<details class="quiz"><summary>Exercise: build D major yourself, then check</summary>
<p>From D: W → E, W → F♯, H → G, W → A, W → B, W → C♯, H → D. Two sharps: <b>F♯ and C♯</b>.</p>
<div class="pw" data-notes="D4 E4 F#4 G4 A4 B4 C#5 D5" data-labels="1 2 3 4 5 6 7 8"></div>
</details>
<div class="key-idea"><b>Key idea:</b> W W H W W W H. Same recipe from any key; only the starting note changes, and black keys appear where the pattern needs them.</div>`,
    uk: `
<p><b>Гама</b> — це ряд нот по порядку, з яких побудований музичний твір. <b>Мажорна гама</b> — найважливіша: вона звучить світло й стійко, і майже всю іншу теорію пояснюють через порівняння з нею.</p>
<h3>Рецепт</h3>
<p>Кожна мажорна гама будується за однаковою схемою (Т — тон, П — півтон):</p>
<p class="formula">Т &nbsp; Т &nbsp; <b>П</b> &nbsp; Т &nbsp; Т &nbsp; Т &nbsp; <b>П</b></p>
<p>Почніть із до й ідіть за схемою — вийдуть лише білі клавіші. Тому до мажор усі вивчають першим: два півтони припадають рівно на мі–фа і сі–до.</p>
<div class="pw" data-notes="C4 D4 E4 F4 G4 A4 B4 C5" data-labels="1 2 3 4 5 6 7 8" data-caption="До мажор: ноти пронумеровано 1–7 (ступені)"></div>
<h3>Ступені</h3>
<p>Числа від 1 до 7 — це <b>ступені</b> гами. Вони дають змогу говорити про будь-яку тональність одразу. <b>I</b> ступінь — «дім», або <b>тоніка</b>. <b>VII</b> ступінь — на півтон нижче від тоніки, і він сильно тяжіє до неї: зіграйте до мажор і зупиніться на сі, щоб це відчути.</p>
<h3>Інші мажорні гами</h3>
<p>Почніть схему з іншої ноти — і щоб зберегти її, знадобляться чорні клавіші. Від соль сьома нота має бути <b>фа-дієз</b> (а не фа), щоб півтон залишився в кінці:</p>
<div class="pw" data-notes="G4 A4 B4 C5 D5 E5 F#5 G5" data-labels="1 2 3 4 5 6 7 8" data-caption="Соль мажор: один дієз, фа♯"></div>
<p>Від фа четверта нота має бути <b>сі-бемоль</b>, щоб півтон припав між III і IV ступенями:</p>
<div class="pw" data-notes="F4 G4 A4 Bb4 C5 D5 E5 F5" data-labels="1 2 3 4 5 6 7 8" data-caption="Фа мажор: один бемоль, сі♭"></div>
<p>У гамі кожна літера використовується <b>рівно один раз</b>. Тому у фа мажорі сі-бемоль, а не ля-дієз: ля в гамі вже є.</p>
<details class="quiz"><summary>Вправа: побудуйте ре мажор самі, а потім перевірте</summary>
<p>Від ре: Т → мі, Т → фа♯, П → соль, Т → ля, Т → сі, Т → до♯, П → ре. Два дієзи: <b>фа♯ і до♯</b>.</p>
<div class="pw" data-notes="D4 E4 F#4 G4 A4 B4 C#5 D5" data-labels="1 2 3 4 5 6 7 8"></div>
</details>
<div class="key-idea"><b>Головне:</b> Т Т П Т Т Т П. Однаковий рецепт від будь-якої ноти; змінюється лише початкова нота, а чорні клавіші з’являються там, де цього вимагає схема.</div>`
  }
},

{
  id: 'keys', level: 'intermediate', mins: 8,
  title: { en: 'Keys, key signatures and the circle of fifths', uk: 'Тональності, ключові знаки й квінтове коло' },
  body: {
    en: `
<p>When a piece is built on the C major scale, we say it is <b>in the key of C major</b>. The tonic (C) feels like home, and the music keeps returning to it.</p>
<h3>Key signatures</h3>
<p>Instead of writing ♯ before every F in G major, the sharps or flats of the key are written once at the start of each line. This is the <b>key signature</b>. It tells you two things at once: which notes to change all the way through, and (almost) which key you are in.</p>
<h3>The circle of fifths</h3>
<p>Go up a <b>fifth</b> (7 half steps) from C and you reach G, which has 1 sharp. Up another fifth: D, 2 sharps. Then A (3), E (4), B (5), F♯ (6). Each step adds one sharp. Going <b>down</b> by fifths from C gives the flat keys: F (1 flat), B♭ (2), E♭ (3), A♭ (4), D♭ (5), G♭ (6).</p>
<div class="pw" data-notes="C3 G3 D4 A4 E5" data-range="C3-B5" data-caption="Climbing in fifths: C → G → D → A → E"></div>
<div class="cof">
  <span><b>C</b>0</span><span><b>G</b>1♯</span><span><b>D</b>2♯</span><span><b>A</b>3♯</span><span><b>E</b>4♯</span><span><b>B</b>5♯</span>
  <span><b>F♯/G♭</b>6</span><span><b>D♭</b>5♭</span><span><b>A♭</b>4♭</span><span><b>E♭</b>3♭</span><span><b>B♭</b>2♭</span><span><b>F</b>1♭</span>
</div>
<p>Neighbours on the circle share all notes but one, so music moves between them smoothly. Keys far apart (C and F♯) share very little.</p>
<h3>Reading a key signature quickly</h3>
<ul>
  <li>Sharps always appear in the order <b>F C G D A E B</b>. Flats in the reverse: <b>B E A D G C F</b>.</li>
  <li>With <b>sharps</b>: the key is a <b>half step above the last sharp</b>. Last sharp C♯ → D major.</li>
  <li>With <b>flats</b>: the key is the <b>second-to-last flat</b>. Flats B♭ E♭ A♭ → E♭ major. (One flat = F major: just memorise it.)</li>
</ul>
<div class="key-idea"><b>Key idea:</b> each key signature is a major key (or its relative minor, see the minor lesson). Moving one step around the circle changes just one note.</div>
<p class="tip"><b>Try it:</b> name the major key for 3 sharps (F♯ C♯ G♯ → A major) and for 4 flats (B♭ E♭ A♭ D♭ → A♭ major). Then play both scales.</p>`,
    uk: `
<p>Коли твір побудований на гамі до мажор, кажуть, що він <b>у тональності до мажор</b>. Тоніка (до) звучить як дім, і музика постійно до неї повертається.</p>
<h3>Ключові знаки</h3>
<p>Замість того щоб писати ♯ перед кожним фа в соль мажорі, дієзи чи бемолі тональності пишуть один раз на початку кожного рядка. Це <b>ключові знаки</b>. Вони підказують дві речі: які ноти змінювати до кінця твору і (майже) в якій ви тональності.</p>
<h3>Квінтове коло</h3>
<p>Підніміться від до на <b>квінту</b> (7 півтонів) — потрапите на соль, де 1 дієз. Ще на квінту — ре, 2 дієзи. Далі ля (3), мі (4), сі (5), фа♯ (6). Кожен крок додає один дієз. Рух квінтами <b>вниз</b> від до дає бемольні тональності: фа (1 бемоль), сі♭ (2), мі♭ (3), ля♭ (4), ре♭ (5), соль♭ (6).</p>
<div class="pw" data-notes="C3 G3 D4 A4 E5" data-range="C3-B5" data-caption="Угору квінтами: до → соль → ре → ля → мі"></div>
<div class="cof">
  <span><b>C</b>0</span><span><b>G</b>1♯</span><span><b>D</b>2♯</span><span><b>A</b>3♯</span><span><b>E</b>4♯</span><span><b>B</b>5♯</span>
  <span><b>F♯/G♭</b>6</span><span><b>D♭</b>5♭</span><span><b>A♭</b>4♭</span><span><b>E♭</b>3♭</span><span><b>B♭</b>2♭</span><span><b>F</b>1♭</span>
</div>
<p>Сусідні тональності на колі мають усі ноти спільні, крім однієї, тож музика переходить між ними плавно. Далекі тональності (до і фа♯) мають мало спільного.</p>
<h3>Як швидко визначити тональність</h3>
<ul>
  <li>Дієзи завжди з’являються в порядку <b>фа до соль ре ля мі сі</b> (F C G D A E B). Бемолі — у зворотному: <b>сі мі ля ре соль до фа</b>.</li>
  <li>Із <b>дієзами</b>: тональність на <b>півтон вища за останній дієз</b>. Останній дієз до♯ → ре мажор.</li>
  <li>Із <b>бемолями</b>: тональність — це <b>передостанній бемоль</b>. Бемолі сі♭ мі♭ ля♭ → мі♭ мажор. (Один бемоль — фа мажор, просто запам’ятайте.)</li>
</ul>
<div class="key-idea"><b>Головне:</b> кожен набір ключових знаків — це мажорна тональність (або паралельний мінор, див. урок про мінор). Крок по колу змінює лише одну ноту.</div>
<p class="tip"><b>Спробуйте:</b> назвіть мажорну тональність із 3 дієзами (фа♯ до♯ соль♯ → ля мажор) і з 4 бемолями (сі♭ мі♭ ля♭ ре♭ → ля♭ мажор). Потім зіграйте обидві гами.</p>`
  }
},

{
  id: 'intervals', level: 'intermediate', mins: 9,
  title: { en: 'Intervals', uk: 'Інтервали' },
  body: {
    en: `
<p>An <b>interval</b> is the distance between two notes. Intervals are the building blocks of melody (notes one after another) and harmony (notes together).</p>
<h3>Interval numbers</h3>
<p>Count the <b>letter names</b> from the bottom note to the top note, including both. C up to E: C, D, E = a <b>3rd</b>. C up to G: C D E F G = a <b>5th</b>. C up to C = an <b>octave</b> (8th).</p>
<h3>Interval quality</h3>
<p>The number is not enough: C–E and C–E♭ are both 3rds but sound very different. So each interval also has a quality, which we get by counting half steps:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Half steps</th><th>Interval</th><th>From C</th><th>Sound</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>minor 2nd</td><td>C–D♭</td><td>tense, crunchy</td></tr>
    <tr><td>2</td><td>major 2nd</td><td>C–D</td><td>a step in a melody</td></tr>
    <tr><td>3</td><td>minor 3rd</td><td>C–E♭</td><td>sad, soft</td></tr>
    <tr><td>4</td><td>major 3rd</td><td>C–E</td><td>happy, bright</td></tr>
    <tr><td>5</td><td>perfect 4th</td><td>C–F</td><td>open, wants to move</td></tr>
    <tr><td>6</td><td>tritone</td><td>C–F♯</td><td>very unstable</td></tr>
    <tr><td>7</td><td>perfect 5th</td><td>C–G</td><td>strong, hollow</td></tr>
    <tr><td>8</td><td>minor 6th</td><td>C–A♭</td><td>warm, dark</td></tr>
    <tr><td>9</td><td>major 6th</td><td>C–A</td><td>sweet</td></tr>
    <tr><td>10</td><td>minor 7th</td><td>C–B♭</td><td>bluesy, unfinished</td></tr>
    <tr><td>11</td><td>major 7th</td><td>C–B</td><td>dreamy, sharp</td></tr>
    <tr><td>12</td><td>octave</td><td>C–C</td><td>the same note, higher</td></tr>
  </tbody>
</table></div>
<p>Unisons, 4ths, 5ths and octaves are called <b>perfect</b>. 2nds, 3rds, 6ths and 7ths are <b>major</b> or <b>minor</b> (major is one half step bigger).</p>
<div class="pw" data-notes="C4 E4 | C4 Eb4" data-mode="chord" data-caption="Major 3rd, then minor 3rd: hear the mood change"></div>
<div class="pw" data-notes="C4 G4 | C4 F#4" data-mode="chord" data-caption="Perfect 5th (stable), then tritone (restless)"></div>
<div class="pw" data-notes="C4 D4 E4 F4 G4 A4 B4 C5" data-labels="1 M2 M3 P4 P5 M6 M7 8" data-caption="Every interval from C inside the major scale"></div>
<h3>Hearing intervals</h3>
<p>Musicians learn to recognise intervals by ear. A great method: link each one to the start of a tune you know well. Pick your own songs: whatever is stuck in your head works best.</p>
<div class="key-idea"><b>Key idea:</b> number = count the letters; quality = count the half steps. Major and minor 3rds are the most important pair: they decide whether chords sound happy or sad.</div>
<p class="tip"><b>Try it:</b> play C with the left hand and every other key up to the next C with the right. Say the interval name before you play each one.</p>`,
    uk: `
<p><b>Інтервал</b> — це відстань між двома нотами. Інтервали — будівельні блоки мелодії (ноти одна за одною) і гармонії (ноти разом).</p>
<h3>Як назвати інтервал</h3>
<p>Порахуйте <b>назви нот</b> від нижньої до верхньої, включно з обома. Від до до мі: до, ре, мі = <b>терція</b> (3). Від до до соль: до ре мі фа соль = <b>квінта</b> (5). Від до до до = <b>октава</b> (8). Назви: 1 — прима, 2 — секунда, 3 — терція, 4 — кварта, 5 — квінта, 6 — секста, 7 — септима, 8 — октава.</p>
<h3>Якість інтервалу</h3>
<p>Самого числа недостатньо: до–мі і до–мі♭ — обидва терції, але звучать зовсім по-різному. Тож кожен інтервал має ще й якість, яку визначаємо за кількістю півтонів:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Півтонів</th><th>Інтервал</th><th>Від до</th><th>Звучання</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>мала секунда</td><td>до–ре♭</td><td>напружене, різке</td></tr>
    <tr><td>2</td><td>велика секунда</td><td>до–ре</td><td>крок у мелодії</td></tr>
    <tr><td>3</td><td>мала терція</td><td>до–мі♭</td><td>сумне, м’яке</td></tr>
    <tr><td>4</td><td>велика терція</td><td>до–мі</td><td>радісне, світле</td></tr>
    <tr><td>5</td><td>чиста кварта</td><td>до–фа</td><td>відкрите, хоче рухатися</td></tr>
    <tr><td>6</td><td>тритон</td><td>до–фа♯</td><td>дуже нестійке</td></tr>
    <tr><td>7</td><td>чиста квінта</td><td>до–соль</td><td>міцне, порожнє</td></tr>
    <tr><td>8</td><td>мала секста</td><td>до–ля♭</td><td>тепле, темне</td></tr>
    <tr><td>9</td><td>велика секста</td><td>до–ля</td><td>ніжне</td></tr>
    <tr><td>10</td><td>мала септима</td><td>до–сі♭</td><td>блюзове, незавершене</td></tr>
    <tr><td>11</td><td>велика септима</td><td>до–сі</td><td>мрійливе, гостре</td></tr>
    <tr><td>12</td><td>чиста октава</td><td>до–до</td><td>та сама нота, вище</td></tr>
  </tbody>
</table></div>
<p>Приму, кварту, квінту й октаву називають <b>чистими</b>. Секунди, терції, сексти й септими бувають <b>великими</b> або <b>малими</b> (велика на півтон більша).</p>
<div class="pw" data-notes="C4 E4 | C4 Eb4" data-mode="chord" data-caption="Велика терція, потім мала: послухайте, як змінюється настрій"></div>
<div class="pw" data-notes="C4 G4 | C4 F#4" data-mode="chord" data-caption="Чиста квінта (стійка), потім тритон (неспокійний)"></div>
<div class="pw" data-notes="C4 D4 E4 F4 G4 A4 B4 C5" data-labels="1 в2 в3 ч4 ч5 в6 в7 8" data-caption="Усі інтервали від до в межах мажорної гами"></div>
<h3>Як чути інтервали</h3>
<p>Музиканти вчаться розпізнавати інтервали на слух. Чудовий спосіб: пов’язати кожен із початком добре знайомої мелодії. Обирайте власні пісні — найкраще працює те, що постійно крутиться в голові.</p>
<div class="key-idea"><b>Головне:</b> число — рахуємо назви нот; якість — рахуємо півтони. Велика й мала терції — найважливіша пара: саме вони вирішують, чи звучить акорд радісно чи сумно.</div>
<p class="tip"><b>Спробуйте:</b> тримайте до лівою рукою і правою грайте по черзі кожну клавішу до наступного до. Перед кожною називайте інтервал уголос.</p>`
  }
},

{
  id: 'minor-scales', level: 'intermediate', mins: 9,
  title: { en: 'Minor scales', uk: 'Мінорні гами' },
  body: {
    en: `
<p>The <b>minor scale</b> is the darker partner of the major scale. Where major sounds bright, minor sounds sad, serious or mysterious. There are three versions, and you will meet all of them in real music.</p>
<h3>1. Natural minor</h3>
<p class="formula">W &nbsp; <b>H</b> &nbsp; W &nbsp; W &nbsp; <b>H</b> &nbsp; W &nbsp; W</p>
<p>Start on A and follow it: all white keys again. A minor uses exactly the same notes as C major, just starting from A.</p>
<div class="pw" data-notes="A3 B3 C4 D4 E4 F4 G4 A4" data-labels="1 2 ♭3 4 5 ♭6 ♭7 8" data-caption="A natural minor"></div>
<p>Compared to major on the same starting note, natural minor has a lowered <b>3rd, 6th and 7th</b>. The lowered 3rd is what makes it sound minor.</p>
<h3>Relative and parallel</h3>
<ul>
  <li><b>Relative</b> keys share all notes and the key signature: C major and A minor. The relative minor starts on the <b>6th degree</b> of the major scale (or 3 half steps below its tonic).</li>
  <li><b>Parallel</b> keys share the same tonic: C major and C minor. C minor has 3 flats (E♭, A♭, B♭).</li>
</ul>
<div class="pw" data-notes="C4 D4 Eb4 F4 G4 Ab4 Bb4 C5" data-labels="1 2 ♭3 4 5 ♭6 ♭7 8" data-caption="C natural minor: the parallel minor of C major"></div>
<h3>2. Harmonic minor</h3>
<p>In natural minor, the 7th degree is a whole step below the tonic, so it does not pull home strongly. <b>Harmonic minor</b> raises the 7th by a half step to fix that. In A minor, G becomes <b>G♯</b>. The jump F → G♯ gives it its famous "Eastern" flavour.</p>
<div class="pw" data-notes="A3 B3 C4 D4 E4 F4 G#4 A4" data-labels="1 2 ♭3 4 5 ♭6 7 8" data-caption="A harmonic minor: raised 7th"></div>
<h3>3. Melodic minor</h3>
<p>To smooth out that jump in melodies, <b>melodic minor</b> raises both the 6th and the 7th going up (F♯, G♯ in A minor). In classical music it returns to natural minor coming down; in jazz it often stays the same both ways.</p>
<div class="pw" data-notes="A3 B3 C4 D4 E4 F#4 G#4 A4" data-labels="1 2 ♭3 4 5 6 7 8" data-caption="A melodic minor, going up"></div>
<div class="key-idea"><b>Key idea:</b> natural minor = major with ♭3 ♭6 ♭7. Harmonic minor raises the 7th; melodic raises the 6th and 7th. Every major key has a relative minor that shares its key signature.</div>
<p class="tip"><b>Try it:</b> find the relative minor of G major (6th degree = E), then play E natural minor: E F♯ G A B C D E.</p>`,
    uk: `
<p><b>Мінорна гама</b> — темніший партнер мажорної. Мажор звучить світло, мінор — сумно, серйозно чи таємниче. Існує три різновиди, і в справжній музиці трапляються всі.</p>
<h3>1. Натуральний мінор</h3>
<p class="formula">Т &nbsp; <b>П</b> &nbsp; Т &nbsp; Т &nbsp; <b>П</b> &nbsp; Т &nbsp; Т</p>
<p>Почніть із ля й ідіть за схемою — знову лише білі клавіші. Ля мінор складається з тих самих нот, що й до мажор, лише починається з ля.</p>
<div class="pw" data-notes="A3 B3 C4 D4 E4 F4 G4 A4" data-labels="1 2 ♭3 4 5 ♭6 ♭7 8" data-caption="Ля мінор натуральний"></div>
<p>Порівняно з мажором від тієї самої ноти, у натуральному мінорі знижені <b>III, VI і VII</b> ступені. Саме знижений III ступінь робить звучання мінорним.</p>
<h3>Паралельні й однойменні</h3>
<ul>
  <li><b>Паралельні</b> тональності мають усі ноти й ключові знаки спільні: до мажор і ля мінор. Паралельний мінор починається з <b>VI ступеня</b> мажору (або на 3 півтони нижче від тоніки).</li>
  <li><b>Однойменні</b> тональності мають спільну тоніку: до мажор і до мінор. У до мінорі 3 бемолі (мі♭, ля♭, сі♭).</li>
</ul>
<div class="pw" data-notes="C4 D4 Eb4 F4 G4 Ab4 Bb4 C5" data-labels="1 2 ♭3 4 5 ♭6 ♭7 8" data-caption="До мінор натуральний — однойменний до мажору"></div>
<h3>2. Гармонічний мінор</h3>
<p>У натуральному мінорі VII ступінь на цілий тон нижчий від тоніки, тому не тяжіє до неї сильно. <b>Гармонічний мінор</b> підвищує VII ступінь на півтон. У ля мінорі соль стає <b>соль-дієзом</b>. Стрибок фа → соль♯ дає знаменитий «східний» колорит.</p>
<div class="pw" data-notes="A3 B3 C4 D4 E4 F4 G#4 A4" data-labels="1 2 ♭3 4 5 ♭6 7 8" data-caption="Ля мінор гармонічний: підвищений VII ступінь"></div>
<h3>3. Мелодичний мінор</h3>
<p>Щоб згладити цей стрибок у мелодіях, <b>мелодичний мінор</b> підвищує і VI, і VII ступені під час руху вгору (фа♯, соль♯ у ля мінорі). У класичній музиці вниз він повертається до натурального; у джазі часто однаковий в обидва боки.</p>
<div class="pw" data-notes="A3 B3 C4 D4 E4 F#4 G#4 A4" data-labels="1 2 ♭3 4 5 6 7 8" data-caption="Ля мінор мелодичний, рух угору"></div>
<div class="key-idea"><b>Головне:</b> натуральний мінор = мажор із ♭3 ♭6 ♭7. Гармонічний підвищує VII ступінь, мелодичний — VI і VII. Кожен мажор має паралельний мінор зі спільними ключовими знаками.</div>
<p class="tip"><b>Спробуйте:</b> знайдіть паралельний мінор до соль мажору (VI ступінь = мі) і зіграйте мі мінор натуральний: мі фа♯ соль ля сі до ре мі.</p>`
  }
},

{
  id: 'triads', level: 'intermediate', mins: 8,
  title: { en: 'Chords: the four triads', uk: 'Акорди: чотири види тризвуків' },
  body: {
    en: `
<p>A <b>chord</b> is three or more notes played together. The most basic chord is the <b>triad</b>: three notes stacked in <b>3rds</b>. On the piano that is easy to see: play a key, skip one white key, play, skip one, play.</p>
<p>The three notes are called the <b>root</b> (the note the chord is named after), the <b>third</b> and the <b>fifth</b>.</p>
<h3>The four kinds</h3>
<p>Which 3rds you stack decides the sound:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Triad</th><th>Recipe (half steps)</th><th>On C</th><th>Symbol</th><th>Sound</th></tr></thead>
  <tbody>
    <tr><td>Major</td><td>major 3rd + minor 3rd (4 + 3)</td><td>C E G</td><td>C</td><td>bright, stable</td></tr>
    <tr><td>Minor</td><td>minor 3rd + major 3rd (3 + 4)</td><td>C E♭ G</td><td>Cm</td><td>sad, soft</td></tr>
    <tr><td>Diminished</td><td>minor 3rd + minor 3rd (3 + 3)</td><td>C E♭ G♭</td><td>C°, Cdim</td><td>tense, unstable</td></tr>
    <tr><td>Augmented</td><td>major 3rd + major 3rd (4 + 4)</td><td>C E G♯</td><td>C+, Caug</td><td>strange, floating</td></tr>
  </tbody>
</table></div>
<div class="pw" data-notes="C4 E4 G4" data-mode="both" data-labels="root 3rd 5th" data-caption="C major"></div>
<div class="pw" data-notes="C4 Eb4 G4" data-mode="both" data-labels="root ♭3rd 5th" data-caption="C minor: only the middle note moved down"></div>
<div class="pw" data-notes="C4 Eb4 Gb4" data-mode="both" data-caption="C diminished"></div>
<div class="pw" data-notes="C4 E4 G#4" data-mode="both" data-caption="C augmented"></div>
<h3>A quick trick</h3>
<p>Any major chord becomes minor if you move the <b>middle note</b> (the 3rd) down one half step. Try it from D: D F♯ A (major) → D F A (minor).</p>
<div class="pw" data-notes="D4 F#4 A4 | D4 F4 A4 | G4 B4 D5 | G4 Bb4 D5" data-mode="prog" data-caption="D, Dm, G, Gm"></div>
<div class="key-idea"><b>Key idea:</b> triads are stacked 3rds. Major = 4+3, minor = 3+4, diminished = 3+3, augmented = 4+4 half steps.</div>
<p class="tip"><b>Try it:</b> play a major triad on every white key from C to B, then turn each one minor by lowering the 3rd. Listen for the moment it changes mood.</p>`,
    uk: `
<p><b>Акорд</b> — це три й більше нот, узятих разом. Найпростіший акорд — <b>тризвук</b>: три ноти, розташовані <b>терціями</b>. На фортепіано це легко побачити: натисніть клавішу, пропустіть одну білу, натисніть, пропустіть, натисніть.</p>
<p>Три ноти називаються <b>прима</b> (основний тон, за яким названо акорд), <b>терція</b> і <b>квінта</b>.</p>
<h3>Чотири види</h3>
<p>Звучання залежить від того, які терції ви складаєте:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Тризвук</th><th>Рецепт (півтони)</th><th>Від до</th><th>Позначення</th><th>Звучання</th></tr></thead>
  <tbody>
    <tr><td>Мажорний</td><td>велика терція + мала (4 + 3)</td><td>до мі соль</td><td>C</td><td>світлий, стійкий</td></tr>
    <tr><td>Мінорний</td><td>мала терція + велика (3 + 4)</td><td>до мі♭ соль</td><td>Cm</td><td>сумний, м’який</td></tr>
    <tr><td>Зменшений</td><td>мала + мала (3 + 3)</td><td>до мі♭ соль♭</td><td>C°, Cdim</td><td>напружений, нестійкий</td></tr>
    <tr><td>Збільшений</td><td>велика + велика (4 + 4)</td><td>до мі соль♯</td><td>C+, Caug</td><td>дивний, «підвішений»</td></tr>
  </tbody>
</table></div>
<div class="pw" data-notes="C4 E4 G4" data-mode="both" data-labels="прима терція квінта" data-caption="До мажор"></div>
<div class="pw" data-notes="C4 Eb4 G4" data-mode="both" data-labels="прима ♭терція квінта" data-caption="До мінор: змістилася лише середня нота"></div>
<div class="pw" data-notes="C4 Eb4 Gb4" data-mode="both" data-caption="До зменшений"></div>
<div class="pw" data-notes="C4 E4 G#4" data-mode="both" data-caption="До збільшений"></div>
<h3>Швидкий трюк</h3>
<p>Будь-який мажорний акорд стане мінорним, якщо опустити <b>середню ноту</b> (терцію) на півтон. Спробуйте від ре: ре фа♯ ля (мажор) → ре фа ля (мінор).</p>
<div class="pw" data-notes="D4 F#4 A4 | D4 F4 A4 | G4 B4 D5 | G4 Bb4 D5" data-mode="prog" data-caption="D, Dm, G, Gm"></div>
<div class="key-idea"><b>Головне:</b> тризвуки складаються з терцій. Мажорний = 4+3, мінорний = 3+4, зменшений = 3+3, збільшений = 4+4 півтони.</div>
<p class="tip"><b>Спробуйте:</b> зіграйте мажорний тризвук від кожної білої клавіші від до до сі, потім зробіть кожен мінорним, опустивши терцію. Вловіть мить, коли змінюється настрій.</p>`
  }
},

{
  id: 'chords-in-key', level: 'intermediate', mins: 10,
  title: { en: 'Chords in a key and progressions', uk: 'Акорди в тональності й гармонічні послідовності' },
  body: {
    en: `
<p>Build a triad on <b>every note of a scale</b>, using only notes from that scale, and you get the family of chords that "belong" to the key. Most songs use mainly these chords.</p>
<h3>The chords of C major</h3>
<p>We name them with <b>Roman numerals</b> for the scale degree: <b>uppercase</b> = major, <b>lowercase</b> = minor, ° = diminished.</p>
<div class="table-wrap"><table>
  <thead><tr><th>I</th><th>ii</th><th>iii</th><th>IV</th><th>V</th><th>vi</th><th>vii°</th></tr></thead>
  <tbody><tr><td>C</td><td>Dm</td><td>Em</td><td>F</td><td>G</td><td>Am</td><td>B°</td></tr></tbody>
</table></div>
<div class="pw" data-notes="C4 E4 G4 | D4 F4 A4 | E4 G4 B4 | F4 A4 C5 | G4 B4 D5 | A4 C5 E5 | B4 D5 F5" data-mode="prog" data-caption="I ii iii IV V vi vii° in C"></div>
<p>The pattern <b>major, minor, minor, major, major, minor, diminished</b> is the same in every major key. In G major: G, Am, Bm, C, D, Em, F♯°.</p>
<h3>Three jobs: tonic, subdominant, dominant</h3>
<ul>
  <li><b>Tonic (I)</b>: home, rest, the end of the story.</li>
  <li><b>Subdominant (IV, also ii)</b>: moving away from home, opening up.</li>
  <li><b>Dominant (V, also vii°)</b>: tension that wants to resolve back to I.</li>
</ul>
<p>Most music is a journey of home → away → tension → home.</p>
<h3>Progressions you will hear everywhere</h3>
<div class="pw" data-notes="C4 E4 G4 | F4 A4 C5 | G4 B4 D5 | C4 E4 G4" data-mode="prog" data-caption="I – IV – V – I: the classic"></div>
<div class="pw" data-notes="C4 E4 G4 | G4 B4 D5 | A4 C5 E5 | F4 A4 C5" data-mode="prog" data-caption="I – V – vi – IV: countless pop songs"></div>
<div class="pw" data-notes="D4 F4 A4 | G4 B4 D5 | C4 E4 G4" data-mode="prog" data-caption="ii – V – I: the backbone of jazz"></div>
<h3>Why numerals are so useful</h3>
<p>Numerals describe a progression in <b>any key</b>. I–V–vi–IV is C–G–Am–F in C, G–D–Em–C in G, and D–A–Bm–G in D. Learn a song in numerals and you can play it in any key, which singers love.</p>
<div class="key-idea"><b>Key idea:</b> chords of a major key are I ii iii IV V vi vii°. Their jobs are home (I), away (IV), tension (V). Think in numerals, not letters.</div>
<p class="tip"><b>Try it:</b> play I–V–vi–IV in G major (G–D–Em–C), then sing or hum any melody over it.</p>`,
    uk: `
<p>Побудуйте тризвук на <b>кожному ступені гами</b>, використовуючи лише її ноти, — і отримаєте родину акордів, що «належать» тональності. Більшість пісень складаються переважно з них.</p>
<h3>Акорди до мажору</h3>
<p>Їх позначають <b>римськими цифрами</b> за ступенем: <b>великі</b> — мажорні, <b>малі</b> — мінорні, ° — зменшені.</p>
<div class="table-wrap"><table>
  <thead><tr><th>I</th><th>ii</th><th>iii</th><th>IV</th><th>V</th><th>vi</th><th>vii°</th></tr></thead>
  <tbody><tr><td>C</td><td>Dm</td><td>Em</td><td>F</td><td>G</td><td>Am</td><td>B°</td></tr></tbody>
</table></div>
<div class="pw" data-notes="C4 E4 G4 | D4 F4 A4 | E4 G4 B4 | F4 A4 C5 | G4 B4 D5 | A4 C5 E5 | B4 D5 F5" data-mode="prog" data-caption="I ii iii IV V vi vii° у до мажорі"></div>
<p>Схема <b>мажор, мінор, мінор, мажор, мажор, мінор, зменшений</b> однакова в кожній мажорній тональності. У соль мажорі: G, Am, Bm, C, D, Em, F♯°.</p>
<h3>Три функції: тоніка, субдомінанта, домінанта</h3>
<ul>
  <li><b>Тоніка (I)</b>: дім, спокій, кінець історії.</li>
  <li><b>Субдомінанта (IV, а також ii)</b>: віддалення від дому, розкриття.</li>
  <li><b>Домінанта (V, а також vii°)</b>: напруга, яка хоче повернутися до I.</li>
</ul>
<p>Більшість музики — це подорож: дім → віддалення → напруга → дім.</p>
<h3>Послідовності, які звучать усюди</h3>
<div class="pw" data-notes="C4 E4 G4 | F4 A4 C5 | G4 B4 D5 | C4 E4 G4" data-mode="prog" data-caption="I – IV – V – I: класика"></div>
<div class="pw" data-notes="C4 E4 G4 | G4 B4 D5 | A4 C5 E5 | F4 A4 C5" data-mode="prog" data-caption="I – V – vi – IV: безліч поп-пісень"></div>
<div class="pw" data-notes="D4 F4 A4 | G4 B4 D5 | C4 E4 G4" data-mode="prog" data-caption="ii – V – I: основа джазу"></div>
<h3>Чому римські цифри такі зручні</h3>
<p>Вони описують послідовність у <b>будь-якій тональності</b>. I–V–vi–IV — це C–G–Am–F у до мажорі, G–D–Em–C у соль мажорі й D–A–Bm–G у ре мажорі. Вивчіть пісню в цифрах — і зможете зіграти її в будь-якій тональності, що дуже цінують вокалісти.</p>
<div class="key-idea"><b>Головне:</b> акорди мажорної тональності: I ii iii IV V vi vii°. Їхні функції: дім (I), віддалення (IV), напруга (V). Думайте цифрами, а не літерами.</div>
<p class="tip"><b>Спробуйте:</b> зіграйте I–V–vi–IV у соль мажорі (G–D–Em–C) і наспівуйте будь-яку мелодію поверх.</p>`
  }
}

);
