// Theory lessons, level 3: Advanced.
(window.LESSONS = window.LESSONS || []).push(

{
  id: 'sevenths', level: 'advanced', mins: 9,
  title: { en: 'Seventh chords', uk: 'Септакорди' },
  body: {
    en: `
<p>Stack <b>one more 3rd</b> on top of a triad and you get a four-note <b>seventh chord</b> (the new note is a 7th above the root). Sevenths add colour and tension. They are everywhere in jazz, soul, R&B and modern pop.</p>
<h3>The five main types</h3>
<div class="table-wrap"><table>
  <thead><tr><th>Name</th><th>Built from</th><th>On C</th><th>Symbol</th><th>Feel</th></tr></thead>
  <tbody>
    <tr><td>Major 7th</td><td>major triad + major 7th</td><td>C E G B</td><td>Cmaj7</td><td>dreamy, soft</td></tr>
    <tr><td>Dominant 7th</td><td>major triad + minor 7th</td><td>C E G B♭</td><td>C7</td><td>bluesy, wants to resolve</td></tr>
    <tr><td>Minor 7th</td><td>minor triad + minor 7th</td><td>C E♭ G B♭</td><td>Cm7</td><td>mellow, smooth</td></tr>
    <tr><td>Half-diminished</td><td>diminished triad + minor 7th</td><td>C E♭ G♭ B♭</td><td>Cm7♭5, Cø</td><td>dark, searching</td></tr>
    <tr><td>Diminished 7th</td><td>stacked minor 3rds</td><td>C E♭ G♭ A</td><td>C°7</td><td>dramatic, suspenseful</td></tr>
  </tbody>
</table></div>
<div class="pw" data-notes="C4 E4 G4 B4" data-mode="both" data-caption="Cmaj7"></div>
<div class="pw" data-notes="C4 E4 G4 Bb4" data-mode="both" data-caption="C7 (dominant)"></div>
<div class="pw" data-notes="C4 Eb4 G4 Bb4" data-mode="both" data-caption="Cm7"></div>
<div class="pw" data-notes="C4 Eb4 Gb4 Bb4 | C4 Eb4 Gb4 A4" data-mode="chord" data-caption="Cm7♭5, then C°7"></div>
<h3>Sevenths in a major key</h3>
<p>Add the 7th from the scale to every triad of C major and you get: <b>Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7♭5</b>. Only one chord is a dominant 7th: the one on degree <b>V</b>.</p>
<h3>Why the dominant 7th pulls so hard</h3>
<p>G7 (G B D F) contains B and F, a <b>tritone</b>. B wants to rise a half step to C, and F wants to fall a half step to E. Both land on notes of C major, so G7 → C feels like a door closing.</p>
<div class="pw" data-notes="G3 B3 D4 F4 | C4 E4 G4 C5" data-mode="prog" data-caption="G7 → C: B goes up to C, F goes down to E"></div>
<div class="key-idea"><b>Key idea:</b> 7th chord = triad + another 3rd. In a major key: Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7. The V7's tritone is the engine of resolution.</div>
<p class="tip"><b>Try it:</b> play the ii7–V7–Imaj7 in C: Dm7 (D F A C) → G7 (G B D F) → Cmaj7 (C E G B). Notice how few notes actually move.</p>`,
    uk: `
<p>Додайте до тризвуку <b>ще одну терцію</b> зверху — і отримаєте чотиризвучний <b>септакорд</b> (нова нота — на септиму вище від основного тону). Септакорди додають колориту й напруги. Вони скрізь у джазі, соулі, R&B і сучасному попі.</p>
<h3>П’ять основних видів</h3>
<div class="table-wrap"><table>
  <thead><tr><th>Назва</th><th>Будова</th><th>Від до</th><th>Позначення</th><th>Характер</th></tr></thead>
  <tbody>
    <tr><td>Великий мажорний</td><td>мажорний тризвук + велика септима</td><td>до мі соль сі</td><td>Cmaj7</td><td>мрійливий, м’який</td></tr>
    <tr><td>Домінантсептакорд (малий мажорний)</td><td>мажорний тризвук + мала септима</td><td>до мі соль сі♭</td><td>C7</td><td>блюзовий, хоче розв’язатися</td></tr>
    <tr><td>Малий мінорний</td><td>мінорний тризвук + мала септима</td><td>до мі♭ соль сі♭</td><td>Cm7</td><td>м’який, плавний</td></tr>
    <tr><td>Напівзменшений (малий зменшений)</td><td>зменшений тризвук + мала септима</td><td>до мі♭ соль♭ сі♭</td><td>Cm7♭5, Cø</td><td>темний, пошуковий</td></tr>
    <tr><td>Зменшений</td><td>лише малі терції</td><td>до мі♭ соль♭ ля</td><td>C°7</td><td>драматичний, тривожний</td></tr>
  </tbody>
</table></div>
<div class="pw" data-notes="C4 E4 G4 B4" data-mode="both" data-caption="Cmaj7"></div>
<div class="pw" data-notes="C4 E4 G4 Bb4" data-mode="both" data-caption="C7 (домінантсептакорд)"></div>
<div class="pw" data-notes="C4 Eb4 G4 Bb4" data-mode="both" data-caption="Cm7"></div>
<div class="pw" data-notes="C4 Eb4 Gb4 Bb4 | C4 Eb4 Gb4 A4" data-mode="chord" data-caption="Cm7♭5, потім C°7"></div>
<h3>Септакорди в мажорі</h3>
<p>Додайте до кожного тризвуку до мажору септиму з гами: <b>Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7♭5</b>. Домінантсептакорд лише один — на <b>V</b> ступені.</p>
<h3>Чому домінантсептакорд так тягне</h3>
<p>G7 (соль сі ре фа) містить сі і фа — <b>тритон</b>. Сі хоче піднятися на півтон до до, а фа — опуститися на півтон до мі. Обидві ноти потрапляють у до мажор, тому G7 → C звучить як двері, що зачиняються.</p>
<div class="pw" data-notes="G3 B3 D4 F4 | C4 E4 G4 C5" data-mode="prog" data-caption="G7 → C: сі йде вгору до до, фа — вниз до мі"></div>
<div class="key-idea"><b>Головне:</b> септакорд = тризвук + ще одна терція. У мажорі: Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7. Тритон у V7 — двигун розв’язання.</div>
<p class="tip"><b>Спробуйте:</b> зіграйте ii7–V7–Imaj7 у до мажорі: Dm7 (ре фа ля до) → G7 (соль сі ре фа) → Cmaj7 (до мі соль сі). Зверніть увагу, як мало нот насправді рухається.</p>`
  }
},

{
  id: 'inversions', level: 'advanced', mins: 9,
  title: { en: 'Inversions and voice leading', uk: 'Обернення й голосоведення' },
  body: {
    en: `
<p>A chord doesn't have to be played with its root at the bottom. Rearranging the same notes is called an <b>inversion</b>, and choosing inversions well is what makes chord changes sound smooth instead of jumpy.</p>
<h3>Three positions of a triad</h3>
<ul>
  <li><b>Root position</b>: root at the bottom. C E G.</li>
  <li><b>First inversion</b>: the 3rd at the bottom. E G C. Written <b>C/E</b> ("C over E").</li>
  <li><b>Second inversion</b>: the 5th at the bottom. G C E. Written <b>C/G</b>.</li>
</ul>
<div class="pw" data-notes="C4 E4 G4 | E4 G4 C5 | G4 C5 E5" data-mode="chord" data-caption="C, C/E, C/G: same chord, three colours"></div>
<p>They are all C major, but the lowest note changes the feel: root position is solid, first inversion is lighter, second inversion is unsettled and often moves on.</p>
<h3>Voice leading</h3>
<p>Think of each finger as a separate <b>voice</b>, like a small choir. Good voice leading means each voice moves as little as possible. Three rules of thumb:</p>
<ol>
  <li><b>Keep common notes</b> in the same place when the chord changes.</li>
  <li>Move the other voices by <b>step</b> (half or whole step) where you can.</li>
  <li>Avoid jumping the whole hand around the keyboard.</li>
</ol>
<p>Compare the same progression, C – F – G – C, played two ways:</p>
<div class="pw" data-notes="C4 E4 G4 | F4 A4 C5 | G4 B4 D5 | C4 E4 G4" data-mode="prog" data-caption="All root position: the hand jumps"></div>
<div class="pw" data-notes="C4 E4 G4 | C4 F4 A4 | B3 D4 G4 | C4 E4 G4" data-mode="prog" data-caption="Smooth: C – F/C – G/B – C. Almost no movement"></div>
<p>In the smooth version, C stays put from C to F, and G stays put from G back to C. The music sounds connected, and your hand barely moves.</p>
<h3>Slash chords and bass lines</h3>
<p>Inversions also create walking bass lines. In C – G/B – Am – G, the bass goes C → B → A → G, stepping down while the chords change above it.</p>
<div class="pw" data-notes="C3 C4 E4 G4 | B2 B3 D4 G4 | A2 A3 C4 E4 | G2 G3 B3 D4" data-mode="prog" data-caption="C – G/B – Am – G: a descending bass line"></div>
<div class="key-idea"><b>Key idea:</b> the bottom note decides the inversion. Choose inversions so that shared notes stay and the rest move by step.</div>
<p class="tip"><b>Try it:</b> play I–vi–IV–V in C (C, Am, F, G) without moving your hand more than one key at a time. Hint: C (C E G), Am (C E A), F (C F A), G/B (B D G).</p>`,
    uk: `
<p>Акорд не обов’язково грати з основним тоном унизу. Перестановка тих самих нот називається <b>оберненням</b>, і вдалий вибір обернень робить зміну акордів плавною, а не стрибкуватою.</p>
<h3>Три положення тризвуку</h3>
<ul>
  <li><b>Основний вигляд</b>: основний тон унизу. До мі соль.</li>
  <li><b>Секстакорд</b> (перше обернення): унизу терція. Мі соль до. Позначають <b>C/E</b> («до з мі в басу»).</li>
  <li><b>Квартсекстакорд</b> (друге обернення): унизу квінта. Соль до мі. Позначають <b>C/G</b>.</li>
</ul>
<div class="pw" data-notes="C4 E4 G4 | E4 G4 C5 | G4 C5 E5" data-mode="chord" data-caption="C, C/E, C/G: той самий акорд, три відтінки"></div>
<p>Усі вони — до мажор, але нижня нота змінює характер: основний вигляд стійкий, секстакорд легший, квартсекстакорд нестійкий і зазвичай кудись рухається далі.</p>
<h3>Голосоведення</h3>
<p>Уявіть кожен палець окремим <b>голосом</b>, як невеликий хор. Добре голосоведення — це коли кожен голос рухається якомога менше. Три правила:</p>
<ol>
  <li><b>Спільні ноти</b> залишайте на місці під час зміни акорду.</li>
  <li>Інші голоси ведіть <b>поступово</b> (на тон чи півтон), де це можливо.</li>
  <li>Не перестрибуйте всією рукою через клавіатуру.</li>
</ol>
<p>Порівняйте ту саму послідовність C – F – G – C у двох варіантах:</p>
<div class="pw" data-notes="C4 E4 G4 | F4 A4 C5 | G4 B4 D5 | C4 E4 G4" data-mode="prog" data-caption="Усе в основному вигляді: рука стрибає"></div>
<div class="pw" data-notes="C4 E4 G4 | C4 F4 A4 | B3 D4 G4 | C4 E4 G4" data-mode="prog" data-caption="Плавно: C – F/C – G/B – C. Майже без руху"></div>
<p>У плавному варіанті до залишається на місці від C до F, а соль — від G назад до C. Музика звучить зв’язно, а рука майже не рухається.</p>
<h3>Акорди з басом і басові лінії</h3>
<p>Обернення створюють і басові лінії. У C – G/B – Am – G бас іде до → сі → ля → соль, крокуючи вниз, поки акорди змінюються над ним.</p>
<div class="pw" data-notes="C3 C4 E4 G4 | B2 B3 D4 G4 | A2 A3 C4 E4 | G2 G3 B3 D4" data-mode="prog" data-caption="C – G/B – Am – G: низхідна басова лінія"></div>
<div class="key-idea"><b>Головне:</b> нижня нота визначає обернення. Обирайте обернення так, щоб спільні ноти залишалися, а решта рухалася поступово.</div>
<p class="tip"><b>Спробуйте:</b> зіграйте I–vi–IV–V у до мажорі (C, Am, F, G), не зсуваючи руку більш ніж на одну клавішу за раз. Підказка: C (до мі соль), Am (до мі ля), F (до фа ля), G/B (сі ре соль).</p>`
  }
},

{
  id: 'cadences', level: 'advanced', mins: 7,
  title: { en: 'Cadences: musical punctuation', uk: 'Каденції: розділові знаки музики' },
  body: {
    en: `
<p>A <b>cadence</b> is the chord movement at the end of a phrase. It works like punctuation in a sentence: it tells the listener whether the thought is finished, paused, or about to surprise them.</p>
<h3>Authentic cadence (V → I): the full stop</h3>
<p>The strongest ending. Dominant to tonic, often with the tonic note on top. Adding the 7th (V7 → I) makes it even stronger.</p>
<div class="pw" data-notes="G3 B3 D4 F4 | C4 E4 G4 C5" data-mode="prog" data-caption="G7 → C"></div>
<h3>Plagal cadence (IV → I): the "amen"</h3>
<p>Softer and warm, like the "a-men" at the end of a hymn. Often used after an authentic cadence as a gentle extra ending.</p>
<div class="pw" data-notes="C4 F4 A4 | C4 E4 G4" data-mode="prog" data-caption="F → C"></div>
<h3>Half cadence (… → V): the comma</h3>
<p>The phrase stops on V. It sounds like a question or a breath: we know more is coming. Very common at the end of a verse before the chorus.</p>
<div class="pw" data-notes="C4 E4 G4 | D4 F4 A4 | B3 D4 G4" data-mode="prog" data-caption="C → Dm → G (and we wait…)"></div>
<h3>Deceptive cadence (V → vi): the plot twist</h3>
<p>The ear expects V → I, but gets V → vi instead. Because vi shares two notes with I, it is close enough to make sense, but surprising enough to keep the music going.</p>
<div class="pw" data-notes="G3 B3 D4 F4 | A3 C4 E4 A4" data-mode="prog" data-caption="G7 → Am: not the ending you expected"></div>
<div class="key-idea"><b>Key idea:</b> V–I = full stop, IV–I = amen, ending on V = comma, V–vi = surprise. Listen for these at the end of every phrase in songs you like.</div>
<p class="tip"><b>Try it:</b> play a 4-chord phrase ending on a half cadence (C–F–Dm–G), then repeat it ending on an authentic cadence (C–F–G7–C). Together they form a question and an answer.</p>`,
    uk: `
<p><b>Каденція</b> — це рух акордів наприкінці фрази. Вона працює як розділовий знак у реченні: підказує слухачеві, чи думка завершена, чи це пауза, чи зараз буде несподіванка.</p>
<h3>Автентична каденція (V → I): крапка</h3>
<p>Найсильніше завершення. Домінанта переходить у тоніку, часто з тонікою у верхньому голосі. Із септимою (V7 → I) ще сильніше.</p>
<div class="pw" data-notes="G3 B3 D4 F4 | C4 E4 G4 C5" data-mode="prog" data-caption="G7 → C"></div>
<h3>Плагальна каденція (IV → I): «амінь»</h3>
<p>М’якша й тепла, як «а-мінь» наприкінці гімну. Часто звучить після автентичної каденції як лагідне додаткове завершення.</p>
<div class="pw" data-notes="C4 F4 A4 | C4 E4 G4" data-mode="prog" data-caption="F → C"></div>
<h3>Половинна каденція (… → V): кома</h3>
<p>Фраза зупиняється на V. Звучить як запитання чи вдих: ми знаємо, що буде продовження. Дуже часто трапляється наприкінці куплету перед приспівом.</p>
<div class="pw" data-notes="C4 E4 G4 | D4 F4 A4 | B3 D4 G4" data-mode="prog" data-caption="C → Dm → G (і ми чекаємо…)"></div>
<h3>Перервана каденція (V → vi): несподіваний поворот</h3>
<p>Слух очікує V → I, а отримує V → vi. Оскільки vi має дві спільні ноти з I, звучить це логічно, але достатньо несподівано, щоб музика продовжувалася.</p>
<div class="pw" data-notes="G3 B3 D4 F4 | A3 C4 E4 A4" data-mode="prog" data-caption="G7 → Am: не той кінець, на який чекали"></div>
<div class="key-idea"><b>Головне:</b> V–I — крапка, IV–I — «амінь», зупинка на V — кома, V–vi — несподіванка. Прислухайтеся до них наприкінці кожної фрази в улюблених піснях.</div>
<p class="tip"><b>Спробуйте:</b> зіграйте фразу з 4 акордів, що закінчується половинною каденцією (C–F–Dm–G), а потім повторіть її з автентичною (C–F–G7–C). Разом це запитання й відповідь.</p>`
  }
},

{
  id: 'modes', level: 'advanced', mins: 10,
  title: { en: 'Modes', uk: 'Лади (модуси)' },
  body: {
    en: `
<p>Major and minor are two of seven <b>modes</b>. Each mode is a different "flavour" of scale with its own mood. Film music, jazz, rock and folk all use them.</p>
<h3>Way 1: same notes, different home</h3>
<p>Play the white keys from C to C: that is major (called <b>Ionian</b>). Play the same white keys from D to D, and D feels like home: that is <b>Dorian</b>. Each white key gives one mode:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Start on</th><th>Mode</th><th>Compared to major/minor</th><th>Mood</th></tr></thead>
  <tbody>
    <tr><td>C</td><td>Ionian</td><td>= major</td><td>bright, settled</td></tr>
    <tr><td>D</td><td>Dorian</td><td>minor with a <b>raised 6th</b></td><td>minor but hopeful, cool</td></tr>
    <tr><td>E</td><td>Phrygian</td><td>minor with a <b>lowered 2nd</b></td><td>dark, Spanish, heavy</td></tr>
    <tr><td>F</td><td>Lydian</td><td>major with a <b>raised 4th</b></td><td>dreamy, magical, floating</td></tr>
    <tr><td>G</td><td>Mixolydian</td><td>major with a <b>lowered 7th</b></td><td>bluesy, rock, relaxed</td></tr>
    <tr><td>A</td><td>Aeolian</td><td>= natural minor</td><td>sad, serious</td></tr>
    <tr><td>B</td><td>Locrian</td><td>minor with <b>♭2 and ♭5</b></td><td>unstable, rarely used</td></tr>
  </tbody>
</table></div>
<h3>Way 2: one note changed</h3>
<p>The second way is more useful in practice: think of each mode as major or minor with <b>one characteristic note</b> changed. That note is what gives the mode its colour, so lean on it in melodies.</p>
<div class="pw" data-notes="D4 E4 F4 G4 A4 B4 C5 D5" data-labels="1 2 ♭3 4 5 6 ♭7 8" data-caption="D Dorian: like D minor, but B instead of B♭"></div>
<div class="pw" data-notes="F4 G4 A4 B4 C5 D5 E5 F5" data-labels="1 2 3 ♯4 5 6 7 8" data-caption="F Lydian: like F major, but B instead of B♭"></div>
<div class="pw" data-notes="G4 A4 B4 C5 D5 E5 F5 G5" data-labels="1 2 3 4 5 6 ♭7 8" data-caption="G Mixolydian: like G major, but F instead of F♯"></div>
<div class="pw" data-notes="E4 F4 G4 A4 B4 C5 D5 E5" data-labels="1 ♭2 ♭3 4 5 ♭6 ♭7 8" data-caption="E Phrygian: the ♭2 (F) gives the Spanish sound"></div>
<h3>Hearing a mode</h3>
<p>A mode only sounds like itself when its tonic feels like home. Hold the tonic in the bass (or play a drone) while you play the scale over it, and the colour becomes obvious.</p>
<div class="pw" data-notes="D3 A3 F4 | C3 G3 E4" data-mode="prog" data-caption="Dm → C: a classic Dorian vamp"></div>
<div class="key-idea"><b>Key idea:</b> brightest to darkest: Lydian, Ionian, Mixolydian, Dorian, Aeolian, Phrygian, Locrian. Each is major or minor with one note changed.</div>
<p class="tip"><b>Try it:</b> hold D in your left hand and improvise slowly with the white keys in your right. Then hold G and do the same. Same keys, different world.</p>`,
    uk: `
<p>Мажор і мінор — лише два із семи <b>ладів</b> (модусів). Кожен лад — окремий «смак» гами зі своїм настроєм. Їх використовують у кіномузиці, джазі, року й фольку.</p>
<h3>Спосіб 1: ті самі ноти, інший дім</h3>
<p>Зіграйте білі клавіші від до до до — це мажор (<b>іонійський</b> лад). Зіграйте ті самі білі клавіші від ре до ре, і домом стане ре — це <b>дорійський</b> лад. Кожна біла клавіша дає один лад:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Від ноти</th><th>Лад</th><th>Порівняно з мажором/мінором</th><th>Настрій</th></tr></thead>
  <tbody>
    <tr><td>до</td><td>Іонійський</td><td>= мажор</td><td>світлий, стійкий</td></tr>
    <tr><td>ре</td><td>Дорійський</td><td>мінор із <b>підвищеним VI</b></td><td>мінорний, але з надією</td></tr>
    <tr><td>мі</td><td>Фригійський</td><td>мінор зі <b>зниженим II</b></td><td>темний, іспанський, важкий</td></tr>
    <tr><td>фа</td><td>Лідійський</td><td>мажор із <b>підвищеним IV</b></td><td>мрійливий, чарівний</td></tr>
    <tr><td>соль</td><td>Міксолідійський</td><td>мажор зі <b>зниженим VII</b></td><td>блюзовий, роковий, розслаблений</td></tr>
    <tr><td>ля</td><td>Еолійський</td><td>= натуральний мінор</td><td>сумний, серйозний</td></tr>
    <tr><td>сі</td><td>Локрійський</td><td>мінор із <b>♭II і ♭V</b></td><td>нестійкий, рідко вживаний</td></tr>
  </tbody>
</table></div>
<h3>Спосіб 2: одна змінена нота</h3>
<p>Другий спосіб корисніший на практиці: уявляйте кожен лад як мажор чи мінор з <b>однією характерною нотою</b>. Саме вона дає ладу колорит, тож спирайтеся на неї в мелодіях.</p>
<div class="pw" data-notes="D4 E4 F4 G4 A4 B4 C5 D5" data-labels="1 2 ♭3 4 5 6 ♭7 8" data-caption="Ре дорійський: як ре мінор, але сі замість сі♭"></div>
<div class="pw" data-notes="F4 G4 A4 B4 C5 D5 E5 F5" data-labels="1 2 3 ♯4 5 6 7 8" data-caption="Фа лідійський: як фа мажор, але сі замість сі♭"></div>
<div class="pw" data-notes="G4 A4 B4 C5 D5 E5 F5 G5" data-labels="1 2 3 4 5 6 ♭7 8" data-caption="Соль міксолідійський: як соль мажор, але фа замість фа♯"></div>
<div class="pw" data-notes="E4 F4 G4 A4 B4 C5 D5 E5" data-labels="1 ♭2 ♭3 4 5 ♭6 ♭7 8" data-caption="Мі фригійський: ♭II (фа) дає іспанське звучання"></div>
<h3>Як почути лад</h3>
<p>Лад звучить по-своєму, лише коли його тоніка відчувається домом. Тримайте тоніку в басу (або грайте органний пункт) і грайте гаму поверх — колорит стане очевидним.</p>
<div class="pw" data-notes="D3 A3 F4 | C3 G3 E4" data-mode="prog" data-caption="Dm → C: класичний дорійський «вемп»"></div>
<div class="key-idea"><b>Головне:</b> від найсвітлішого до найтемнішого: лідійський, іонійський, міксолідійський, дорійський, еолійський, фригійський, локрійський. Кожен — це мажор чи мінор з однією зміненою нотою.</div>
<p class="tip"><b>Спробуйте:</b> тримайте ре лівою рукою й повільно імпровізуйте правою по білих клавішах. Потім тримайте соль і зробіть те саме. Ті самі клавіші — інший світ.</p>`
  }
},

{
  id: 'secondary', level: 'advanced', mins: 10,
  title: { en: 'Secondary dominants and changing key', uk: 'Побічні домінанти й модуляція' },
  body: {
    en: `
<p>So far every chord has come from the key's own scale. Real music often borrows notes from outside to create extra pull. The most common way is the <b>secondary dominant</b>.</p>
<h3>"The V of" another chord</h3>
<p>We know V7 → I is a strong pull. The trick: <b>any major or minor chord in the key</b> can be treated as a temporary "I" and given its own V7 just before it.</p>
<ul>
  <li><b>V7/V</b> ("five of five"): in C, V is G. The V7 of G is <b>D7</b> (D F♯ A C). D7 → G.</li>
  <li><b>V7/vi</b>: vi is Am. Its V7 is <b>E7</b> (E G♯ B D). E7 → Am.</li>
  <li><b>V7/ii</b>: ii is Dm. Its V7 is <b>A7</b> (A C♯ E G). A7 → Dm.</li>
</ul>
<p>You can spot them by the <b>out-of-key notes</b>: F♯, G♯ and C♯ don't belong to C major. Each one is a half step below the chord it leads to.</p>
<div class="pw" data-notes="C4 E4 G4 | A3 C#4 E4 G4 | D4 F4 A4 | G3 B3 D4 F4 | C4 E4 G4" data-mode="prog" data-caption="C – A7 – Dm – G7 – C"></div>
<div class="pw" data-notes="C4 E4 G4 | E3 G#3 B3 D4 | A3 C4 E4 | F3 A3 C4 | G3 B3 D4 | C4 E4 G4" data-mode="prog" data-caption="C – E7 – Am – F – G – C"></div>
<h3>Modulation: changing key</h3>
<p>A <b>modulation</b> moves the home note somewhere new for a while, or for good.</p>
<ul>
  <li><b>Pivot chord modulation</b>: find a chord that belongs to both keys. Am is vi in C major and ii in G major. Arrive on Am as vi, leave it as ii, then use D7 → G to confirm the new key.</li>
  <li><b>Direct modulation</b>: just jump. Pop songs often lift the last chorus up a half or whole step for energy.</li>
</ul>
<div class="pw" data-notes="C4 E4 G4 | F4 A4 C5 | A3 C4 E4 | D4 F#4 A4 C5 | G3 B3 D4 G4" data-mode="prog" data-caption="C – F – Am (pivot) – D7 – G: from C major to G major"></div>
<div class="key-idea"><b>Key idea:</b> a secondary dominant is the V7 of a chord other than I. Out-of-key sharps that lead up a half step are a giveaway. Pivot chords let you change key without a bump.</div>
<p class="tip"><b>Try it:</b> take I–vi–ii–V (C–Am–Dm–G) and replace the Am with A7. Then also replace the Dm with D7. Hear how each change adds forward motion.</p>`,
    uk: `
<p>Досі кожен акорд брався з гами самої тональності. У справжній музиці часто запозичують ноти ззовні, щоб додати тяжіння. Найпоширеніший спосіб — <b>побічна домінанта</b>.</p>
<h3>«Домінанта до» іншого акорду</h3>
<p>Ми знаємо, що V7 → I тягне дуже сильно. Трюк у тому, що <b>будь-який мажорний чи мінорний акорд тональності</b> можна на мить вважати «тонікою» і поставити перед ним його власний V7.</p>
<ul>
  <li><b>V7/V</b> («домінанта до домінанти»): у до мажорі V — це G. Домінантою до G є <b>D7</b> (ре фа♯ ля до). D7 → G.</li>
  <li><b>V7/vi</b>: vi — це Am. Його V7 — <b>E7</b> (мі соль♯ сі ре). E7 → Am.</li>
  <li><b>V7/ii</b>: ii — це Dm. Його V7 — <b>A7</b> (ля до♯ мі соль). A7 → Dm.</li>
</ul>
<p>Їх легко помітити за <b>нотами поза тональністю</b>: фа♯, соль♯ і до♯ не належать до мажору. Кожна з них на півтон нижча від акорду, до якого веде.</p>
<div class="pw" data-notes="C4 E4 G4 | A3 C#4 E4 G4 | D4 F4 A4 | G3 B3 D4 F4 | C4 E4 G4" data-mode="prog" data-caption="C – A7 – Dm – G7 – C"></div>
<div class="pw" data-notes="C4 E4 G4 | E3 G#3 B3 D4 | A3 C4 E4 | F3 A3 C4 | G3 B3 D4 | C4 E4 G4" data-mode="prog" data-caption="C – E7 – Am – F – G – C"></div>
<h3>Модуляція: зміна тональності</h3>
<p><b>Модуляція</b> переносить «дім» в інше місце — на якийсь час або назавжди.</p>
<ul>
  <li><b>Модуляція через спільний акорд</b>: знайдіть акорд, що належить обом тональностям. Am — це vi у до мажорі й ii у соль мажорі. Прийдіть на Am як на vi, вийдіть із нього як із ii, а потім підтвердьте нову тональність через D7 → G.</li>
  <li><b>Пряма модуляція</b>: просто стрибок. У поп-піснях останній приспів часто піднімають на півтон чи тон для енергії.</li>
</ul>
<div class="pw" data-notes="C4 E4 G4 | F4 A4 C5 | A3 C4 E4 | D4 F#4 A4 C5 | G3 B3 D4 G4" data-mode="prog" data-caption="C – F – Am (спільний акорд) – D7 – G: з до мажору в соль мажор"></div>
<div class="key-idea"><b>Головне:</b> побічна домінанта — це V7 до будь-якого акорду, крім I. Дієзи поза тональністю, що ведуть на півтон угору, її видають. Спільні акорди дають змогу змінити тональність без «стрибка».</div>
<p class="tip"><b>Спробуйте:</b> візьміть I–vi–ii–V (C–Am–Dm–G) і замініть Am на A7. Потім замініть ще й Dm на D7. Послухайте, як кожна заміна додає руху вперед.</p>`
  }
},

{
  id: 'extensions', level: 'advanced', mins: 10,
  title: { en: 'Extended, added and suspended chords', uk: 'Розширені, додані й затримані акорди' },
  body: {
    en: `
<p>Once you know 7th chords, you can keep stacking 3rds to get richer colours, or remove the 3rd for an open sound. This is the vocabulary of jazz, neo-soul, gospel and film music.</p>
<h3>Extensions: 9, 11, 13</h3>
<p>Above the 7th, the next 3rds are the <b>9th, 11th and 13th</b>. They are just the 2nd, 4th and 6th of the scale, played an octave higher on top of a 7th chord.</p>
<ul>
  <li><b>Cmaj9</b>: C E G B + D. Lush and open.</li>
  <li><b>C9</b>: C E G B♭ + D. Funky dominant.</li>
  <li><b>Cm11</b>: C E♭ G B♭ (D) + F. Wide, modern minor.</li>
  <li><b>C13</b>: C E B♭ + A (5th and 9th often left out). Bright, jazzy dominant.</li>
</ul>
<div class="pw" data-notes="C3 E3 G3 B3 D4" data-mode="both" data-caption="Cmaj9"></div>
<div class="pw" data-notes="C3 Bb3 D4 E4 A4" data-mode="both" data-caption="C13 as pianists often play it: C B♭ D E A"></div>
<h3>Voicing tips</h3>
<p>Big chords get muddy if you play every note. Pianists usually:</p>
<ol>
  <li><b>Drop the 5th</b>: it adds little colour.</li>
  <li>Let the <b>left hand play the root</b> (or a bass player cover it), and the right hand play the 3rd, 7th and extensions.</li>
  <li>Keep the 3rd and 7th: they define the chord type.</li>
</ol>
<h3>Added-note chords</h3>
<p>An <b>add</b> chord adds one colour note to a plain triad, without the 7th. <b>Cadd9</b> = C E G D. Very common in pop and acoustic music: it sounds fresh but simple.</p>
<div class="pw" data-notes="C4 E4 G4 D5" data-mode="both" data-caption="Cadd9"></div>
<h3>Suspended chords</h3>
<p>A <b>sus</b> chord replaces the 3rd with the 2nd (<b>sus2</b>) or the 4th (<b>sus4</b>). With no 3rd it is neither major nor minor: open and waiting. Sus4 classically resolves down to the 3rd.</p>
<div class="pw" data-notes="C4 F4 G4 | C4 E4 G4" data-mode="prog" data-caption="Csus4 → C: tension and release"></div>
<div class="pw" data-notes="C4 D4 G4 | C4 E4 G4" data-mode="prog" data-caption="Csus2 → C"></div>
<h3>Putting it together</h3>
<div class="pw" data-notes="D3 C4 F4 A4 E5 | G2 F3 B3 E4 | C3 B3 E4 G4 D5" data-mode="prog" data-caption="ii–V–I with colour: Dm9 – G13 – Cmaj9"></div>
<div class="key-idea"><b>Key idea:</b> extensions (9, 11, 13) add colour on top of 7th chords; add chords add one note to a triad; sus chords replace the 3rd. Leave out notes that don't matter, keep the 3rd and 7th.</div>
<p class="tip"><b>Where to go next:</b> take a simple song you love, write its chords as Roman numerals, then try adding 7ths, swapping in a secondary dominant and a sus4 before the last chord. That is how arrangers think.</p>`,
    uk: `
<p>Коли ви знаєте септакорди, можна й далі додавати терції для багатших барв або прибрати терцію для відкритого звучання. Це словник джазу, неосоулу, госпелу й кіномузики.</p>
<h3>Розширення: 9, 11, 13</h3>
<p>Над септимою наступні терції — <b>нона (9), ундецима (11) і терцдецима (13)</b>. Це просто II, IV і VI ступені гами, узяті на октаву вище поверх септакорду.</p>
<ul>
  <li><b>Cmaj9</b>: до мі соль сі + ре. Пишний і відкритий.</li>
  <li><b>C9</b>: до мі соль сі♭ + ре. Фанкова домінанта.</li>
  <li><b>Cm11</b>: до мі♭ соль сі♭ (ре) + фа. Широкий, сучасний мінор.</li>
  <li><b>C13</b>: до мі сі♭ + ля (квінту й нону часто пропускають). Яскрава джазова домінанта.</li>
</ul>
<div class="pw" data-notes="C3 E3 G3 B3 D4" data-mode="both" data-caption="Cmaj9"></div>
<div class="pw" data-notes="C3 Bb3 D4 E4 A4" data-mode="both" data-caption="C13 так, як його часто грають піаністи: до сі♭ ре мі ля"></div>
<h3>Поради щодо розташування</h3>
<p>Великі акорди стають «брудними», якщо грати всі ноти. Піаністи зазвичай:</p>
<ol>
  <li><b>Пропускають квінту</b>: вона майже не додає барви.</li>
  <li>Дають <b>лівій руці основний тон</b> (або його грає басист), а правою грають терцію, септиму й розширення.</li>
  <li>Зберігають терцію й септиму: саме вони визначають вид акорду.</li>
</ol>
<h3>Акорди з доданою нотою</h3>
<p>Акорд <b>add</b> додає до звичайного тризвуку одну барвисту ноту, без септими. <b>Cadd9</b> = до мі соль ре. Дуже поширений у попі й акустичній музиці: звучить свіжо, але просто.</p>
<div class="pw" data-notes="C4 E4 G4 D5" data-mode="both" data-caption="Cadd9"></div>
<h3>Затримані акорди (sus)</h3>
<p>В акорді <b>sus</b> терцію замінює секунда (<b>sus2</b>) або кварта (<b>sus4</b>). Без терції він ні мажорний, ні мінорний — відкритий і в очікуванні. Sus4 класично розв’язується вниз у терцію.</p>
<div class="pw" data-notes="C4 F4 G4 | C4 E4 G4" data-mode="prog" data-caption="Csus4 → C: напруга й розрядка"></div>
<div class="pw" data-notes="C4 D4 G4 | C4 E4 G4" data-mode="prog" data-caption="Csus2 → C"></div>
<h3>Усе разом</h3>
<div class="pw" data-notes="D3 C4 F4 A4 E5 | G2 F3 B3 E4 | C3 B3 E4 G4 D5" data-mode="prog" data-caption="ii–V–I із барвами: Dm9 – G13 – Cmaj9"></div>
<div class="key-idea"><b>Головне:</b> розширення (9, 11, 13) додають барв поверх септакордів; акорди add додають одну ноту до тризвуку; sus замінюють терцію. Пропускайте неважливі ноти, але зберігайте терцію й септиму.</div>
<p class="tip"><b>Що далі:</b> візьміть просту улюблену пісню, запишіть її акорди римськими цифрами, а потім спробуйте додати септими, вставити побічну домінанту й sus4 перед останнім акордом. Саме так мислять аранжувальники.</p>`
  }
}

);
