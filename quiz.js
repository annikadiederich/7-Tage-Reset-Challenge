/* ═══════════════════════════════════
   QUIZ ENGINE
   ═══════════════════════════════════ */

(function () {
    'use strict';

    // ── Question data (Q2–Q35, Q1 is on the landing page) ──
    const questions = [
        { id: 2, q: 'Wie alt bist du?', type: 'single', opts: ['Unter 25', '25–34', '35–44', '45–54', '55+'] },
        { id: 3, q: 'Wie oft denkst du am Tag über Essen oder Abnehmen nach?', type: 'single', opts: ['Ständig', 'Sehr oft', 'Immer wieder', 'Selten'] },
        { id: 4, q: 'Wie viel möchtest du abnehmen?', type: 'single', opts: ['Unter 5 kg', '5–10 kg', '10–15 kg', 'Über 15 kg'] },
        { id: 5, q: 'Hast du oft ein schlechtes Gewissen nach dem Essen?', type: 'single', opts: ['Ja, täglich', 'Mehrmals pro Woche', 'Ab und zu', 'Kaum'] },
        { id: 6, q: 'Welcher Satz passt am besten zu dir?', type: 'single', opts: ['Ich denke ständig darüber nach, was ich essen darf', 'Ich kann Essen nicht mehr entspannt genießen', 'Ich kontrolliere mein Essen ständig', 'Ich schwanke zwischen Kontrolle und Aufgeben', 'Alles davon'] },
        { id: 7, q: 'Wann verlierst du am ehesten die Kontrolle beim Essen?', type: 'single', opts: ['Abends', 'Nach Stress', 'Bei Emotionen', 'Über den ganzen Tag', 'Eigentlich nie'] },
        { id: 8, q: 'Was passiert dann?', type: 'multi', opts: ['Ich esse mehr als geplant', 'Ich greife zu Süßem', 'Ich kann nicht aufhören', 'Ich fühle mich danach schlecht', 'Alles davon'] },
        { id: 9, q: 'Wie oft passiert das?', type: 'single', opts: ['Fast täglich', 'Mehrmals pro Woche', 'Ab und zu', 'Selten'] },
        { id: 10, q: 'Was passiert meistens davor?', type: 'single', opts: ['Stress oder Überforderung', 'Emotionale Situationen', 'Langeweile oder Leere', 'Innere Anspannung', 'Ich weiß es nicht genau'] },
        { id: 11, q: 'Was denkst du dann über dich?', type: 'single', opts: ['Mir fehlt die Disziplin', 'Warum schaffe ich es nicht?', 'Ich weiß es doch eigentlich besser', 'Vielleicht schaffe ich es nie', 'Ich denke lieber nicht darüber nach'] },
        { id: 12, q: 'Was willst du in diesen Momenten vermeiden?', type: 'single', opts: ['Inneren Druck', 'Enttäuschung über mich', 'Das Gefühl, nicht gut genug zu sein', 'Innere Unruhe', 'Ich kann es nicht genau sagen'] },
        { id: 13, q: 'Wie fühlst du dich nach einem Rückfall?', type: 'single', opts: ['Enttäuscht', 'Beschämt', 'Machtlos', 'Frustriert', 'Leer'] },
        { id: 14, q: 'Welcher Gedanke kommt dir am häufigsten?', type: 'single', opts: ['Warum schaffe ich das nicht?', 'Ich sabotiere mich selbst', 'Andere schaffen es, ich nicht', 'Ich verliere die Kontrolle', 'Ich starte immer wieder neu'] },
        { id: 15, q: 'Was hast du schon versucht?', type: 'multi', opts: ['Diäten', 'Kalorien zählen', 'Mehr Sport', 'Disziplin', 'Alles davon'] },
        { id: 16, q: 'Warum hat es nie dauerhaft geklappt?', type: 'single', opts: ['Ich halte nicht durch', 'Ich falle immer zurück', 'Es ist zu anstrengend', 'Die Motivation geht verloren', 'Ich weiß es nicht'] },
        { id: 17, q: 'Du weißt, was zu tun ist, aber setzt es nicht um?', type: 'single', opts: ['Ja, total', 'Oft', 'Manchmal', 'Eher nicht'] },
        { id: 18, q: 'Wie stressig ist dein Alltag?', type: 'single', opts: ['Sehr stressig', 'Oft unter Druck', 'Mal so, mal so', 'Eher entspannt'] },
        { id: 19, q: 'Wie reagierst du auf Probleme?', type: 'single', opts: ['Schnell überfordert', 'Funktioniere, aber kippe innerlich', 'Verliere den Glauben an mich', 'Ziehe mich zurück', 'Kompensiere über Essen', 'Bleibe entspannt'] },
        { id: 20, q: 'Bringen dich kleine Rückschläge schnell aus der Bahn?', type: 'single', opts: ['Ja, total', 'Oft', 'Manchmal', 'Eher nicht'] },
        { id: 21, q: 'Vertraust du dir selbst?', type: 'single', opts: ['Gar nicht', 'Wenig', 'Teilweise', 'Ja'] },
        { id: 22, q: 'Ist Essen für dich eine Art Ausgleich?', type: 'single', opts: ['Ja, absolut', 'Oft', 'Manchmal', 'Nein'] },
        { id: 23, q: 'Wie oft kreisen deine Gedanken ums Essen?', type: 'single', opts: ['Sehr oft', 'Regelmäßig', 'Geht so', 'Kaum'] },
        { id: 24, q: 'Wie stark ist dein Heißhunger?', type: 'single', opts: ['Extrem', 'Stark', 'Mittel', 'Kaum'] },
        { id: 25, q: 'Fühlt sich dein Umfeld verständnisvoll?', type: 'single', opts: ['Gar nicht', 'Eher nicht', 'Teilweise', 'Ja'] },
        { id: 26, q: 'Glaubt jemand wirklich an dich?', type: 'single', opts: ['Nein', 'Eher selten', 'Teilweise', 'Ja'] },
        { id: 27, q: 'Sind die Menschen um dich herum selbst gestresst?', type: 'single', opts: ['Sehr', 'Ziemlich', 'Teilweise', 'Kaum'] },
        { id: 28, q: 'Was beschreibt dein Umfeld am besten?', type: 'single', opts: ['Viel Druck, wenig Ruhe', 'Viele Ausreden', 'Man funktioniert nur', 'Es fehlen inspirierende Menschen', 'Alles davon'] },
        { id: 29, q: 'Wo stehst du in 6 Monaten, wenn sich nichts ändert?', type: 'single', opts: ['Am gleichen Punkt', 'Noch frustrierter', 'Mit mehr Gewicht', 'Will ich nicht dran denken'] },
        { id: 30, q: 'Was kostet dich die Situation gerade?', type: 'multi', opts: ['Energie', 'Selbstvertrauen', 'Lebensfreude', 'Beziehungen', 'Alles davon'] },
        { id: 31, q: 'Was schmerzt dich am meisten?', type: 'single', opts: ['Keine Kontrolle zu haben', 'Mich immer zu enttäuschen', 'Mich zu verstecken', 'Nicht frei zu sein', 'Nicht an mich zu glauben'] },
        { id: 32, q: 'Was wünschst du dir am meisten zurück?', type: 'single', opts: ['Ruhe', 'Kontrolle', 'Leichtigkeit', 'Selbstvertrauen', 'Ich selbst zu sein'] },
        { id: 33, q: 'Wie wäre dein Leben, wenn du es im Griff hast?', type: 'single', opts: ['Leichter und freier', 'Ich würde mich wohlfühlen', 'Ich hätte Kontrolle', 'Ich wäre stolz auf mich'] },
        { id: 34, q: 'Was belastet dich gerade am meisten?', type: 'mixed', opts: ['Heißhunger & Kontrollverlust', 'Gewicht verändert sich nicht', 'Essen ist ständig im Kopf', 'Ich verliere Vertrauen in mich', 'Ich fühle mich nicht wohl'], placeholder: 'Oder in eigenen Worten' },
        { id: 35, q: 'Was wünschst du dir stattdessen?', type: 'mixed', opts: ['Ruhe im Kopf', 'Kontrolle über mein Essen', 'Dauerhaft abnehmen', 'Mich wieder wohlfühlen', 'Einfach ich selbst sein'], placeholder: 'Oder in eigenen Worten' },
        { id: 36, q: 'Was ist dir durch die Fragen bewusst geworden?', type: 'single', opts: ['So kann es nicht weitergehen', 'Mein Problem liegt tiefer', 'Ich blockiere mich selbst', 'Ich muss etwas ändern', 'Irgendwas stimmt nicht'] },
        { id: 37, q: 'Willst du wirklich etwas verändern?', type: 'text', placeholder: 'Deine ehrliche Antwort' },
        { id: 38, q: 'Bist du bereit für einen neuen Ansatz?', type: 'single', opts: ['Ja, ich will das lösen', 'Ich bin neugierig', 'Noch skeptisch'] },
    ];

    const totalQuestions = questions.length + 1; // +1 for gender on landing page
    const answers = {};

    // ── Category mapping for progress context ──
    const categories = [
        { name: 'Über dich', range: [1, 2] },
        { name: 'Dein Muster', range: [3, 16] },
        { name: 'Dein Alltag', range: [17, 28] },
        { name: 'Deine Vision', range: [29, 33] },
        { name: 'Dein Wunsch', range: [34, 38] },
    ];

    function categoryFor(qId) {
        return categories.find(c => qId >= c.range[0] && qId <= c.range[1]) || categories[0];
    }

    // Show breather screen when entering a new category (after this question finishes)
    const BREATHERS = {
        2: { title: 'Super, starten wir!', sub: 'Jetzt geht\'s um dein Essverhalten.' },
        16: { title: 'Starke Offenheit.', sub: 'Weiter mit deinem Alltag.' },
        28: { title: 'Fast geschafft!', sub: 'Lass uns deine Zukunft anschauen.' },
        33: { title: 'Nur noch wenige Schritte.', sub: 'Was wünschst du dir wirklich?' },
    };

    // ── Emoji mapping by keyword (first match in option text wins) ──
    const EMOJI_RULES = [
        // Age groups
        [/^unter 25$/i, '🌱'], [/^25.34$/i, '🌿'], [/^35.44$/i, '🌳'],
        [/^45.54$/i, '🍂'], [/^55\+$/i, '🌲'],
        // Weight goals
        [/unter 5.?kg/i, '🎯'], [/5.10.?kg/i, '💫'], [/10.15.?kg/i, '🚀'], [/über 15.?kg/i, '🌟'],
        // Frequency high → low
        [/ständig/i, '🔄'], [/sehr oft/i, '⏱️'], [/fast täglich/i, '📅'],
        [/täglich/i, '📅'], [/mehrmals/i, '📆'], [/immer wieder/i, '♻️'],
        [/regelmäßig/i, '🔁'], [/ab und zu/i, '🌀'], [/manchmal/i, '💭'],
        [/geht so/i, '🤷'], [/selten/i, '💤'], [/kaum/i, '🌾'],
        [/eigentlich nie/i, '🚫'], [/^nie$/i, '🚫'],
        // Times of day
        [/abends/i, '🌙'], [/morgens/i, '🌅'],
        [/ganzen tag/i, '☀️'],
        // Triggers / emotions (negative)
        [/stress/i, '😰'], [/überforder/i, '🌊'], [/druck/i, '🫨'],
        [/emotional/i, '💔'], [/langeweile/i, '🥱'], [/leere/i, '🕳️'],
        [/anspannung/i, '⚡'], [/unruhe/i, '🌪️'],
        [/enttäusch/i, '😞'], [/beschämt|scham/i, '😔'],
        [/machtlos/i, '🪫'], [/frustr/i, '😤'], [/^leer$/i, '🍂'],
        // Self-doubt
        [/disziplin fehlt|mir fehlt die disziplin/i, '💪'],
        [/warum schaffe/i, '❓'], [/weiß.+besser/i, '🧠'],
        [/nie schaffe/i, '🥀'], [/lieber nicht/i, '🙈'],
        [/sabotier/i, '🔻'], [/andere schaffen/i, '👥'],
        [/verliere.+kontrolle|kontrollverlust/i, '🌊'],
        [/starte.+neu/i, '🔄'],
        // Past attempts
        [/diät/i, '🥬'], [/kalorien/i, '🔢'], [/sport/i, '🏃'],
        [/^disziplin$/i, '💪'],
        // Food
        [/süß/i, '🍫'], [/essen/i, '🍽️'], [/heißhunger/i, '🍰'],
        [/mehr als geplant/i, '🍕'], [/nicht aufhören/i, '🌀'],
        [/danach schlecht/i, '😣'],
        // Self-trust scale
        [/gar nicht/i, '❌'], [/^wenig$/i, '🔸'], [/teilweise/i, '🔹'],
        [/eher nicht/i, '🚫'], [/^sehr$/i, '🔥'], [/ziemlich/i, '🔶'],
        // Environment
        [/viel druck/i, '🌪️'], [/ausreden/i, '💬'], [/funktionier/i, '🤖'],
        [/inspirierend/i, '✨'],
        // Future pain
        [/gleichen punkt/i, '🔁'], [/frustrierter/i, '😖'],
        [/mehr gewicht/i, '⚖️'], [/will ich nicht/i, '🙈'],
        [/energie/i, '🔋'], [/selbstvertrauen/i, '💎'],
        [/lebensfreude/i, '🌈'], [/beziehungen/i, '🤝'],
        // Positive desires
        [/^ruhe$|ruhe im kopf/i, '🕊️'], [/^kontrolle$|kontrolle über/i, '🎯'],
        [/leichtigkeit|leichter/i, '🍃'],
        [/ich selbst/i, '🦋'], [/dauerhaft abnehmen/i, '⚖️'],
        [/wohlfühlen|wohl/i, '🤗'], [/stolz/i, '🏆'],
        [/frei/i, '🕊️'],
        // Awareness
        [/nicht weitergehen/i, '🛑'], [/tiefer/i, '🧭'],
        [/blockier/i, '🔓'], [/muss.+ändern|etwas ändern/i, '🔥'],
        [/irgendwas stimmt/i, '⚠️'],
        // Commitment
        [/will das lösen/i, '🔥'], [/neugierig/i, '🤔'],
        [/skeptisch/i, '🤨'],
        // "Alles davon" catchall
        [/alles davon/i, '✨'],
        // Generic scale fallbacks
        [/ja, total/i, '✅'], [/^ja/i, '✅'], [/^nein/i, '❌'],
        [/extrem/i, '🔥'], [/^stark$/i, '💥'], [/^mittel$/i, '🔸'],
        [/^oft$/i, '🕐'],
    ];

    function emojiFor(text) {
        for (const [pattern, emoji] of EMOJI_RULES) {
            if (pattern.test(text)) return emoji;
        }
        return '💭';
    }

    function shouldUseGrid(opts) {
        if (opts.length < 4 || opts.length > 8) return false;
        return opts.every(o => o.length <= 22);
    }

    // ── Build overlay DOM ──
    function buildOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'quiz-overlay';
        overlay.id = 'quizOverlay';
        overlay.innerHTML = `
            <div class="qz-progress"><div class="qz-progress-fill" id="qzProgressFill"></div></div>
            <div class="qz-logo" style="text-align:center; padding:24px 0 0;"><img src="elliott-aziz-logo.png" alt="Elliott Aziz" style="height:30px; width:auto; mix-blend-mode:multiply;"></div>
            <div class="qz-body"><div class="qz-question" id="qzQuestion"></div></div>
        `;
        document.body.appendChild(overlay);
    }

    // ── Render a question ──
    let currentIdx = 0;

    function renderQuestion(idx) {
        const q = questions[idx];
        if (!q) { quizComplete(); return; }

        const container = document.getElementById('qzQuestion');
        container.classList.remove('visible');
        container.classList.add('exit');

        setTimeout(() => {
            const cat = categoryFor(q.id);
            const posInCat = q.id - cat.range[0] + 1;
            const totalInCat = cat.range[1] - cat.range[0] + 1;

            let html = `
                <div class="qz-cat-label">
                    <span class="qz-cat-name">${cat.name}</span>
                    <span class="qz-cat-dot">·</span>
                    <span class="qz-cat-count">${posInCat}/${totalInCat}</span>
                </div>
                <p class="qz-q">${q.q}</p>
            `;

            const useGrid = (q.type === 'single' || q.type === 'multi' || q.type === 'mixed') && q.opts && shouldUseGrid(q.opts);
            const optsClass = 'qz-opts' + (useGrid ? ' qz-opts-grid' : '');

            const renderOpt = (o, i, isMulti) => {
                const emoji = emojiFor(o);
                const multiAttr = isMulti ? ' data-multi' : '';
                return `<button class="qz-opt"${multiAttr} data-idx="${i}">
                    <span class="qz-opt-emoji" aria-hidden="true">${emoji}</span>
                    <span class="qz-opt-text">${o}</span>
                </button>`;
            };

            if (q.type === 'single') {
                html += `<div class="${optsClass}">`;
                q.opts.forEach((o, i) => { html += renderOpt(o, i, false); });
                html += `</div>`;
                html += `<button class="qz-next hidden">Weiter</button>`;
            }
            else if (q.type === 'multi') {
                html += `<div class="${optsClass}">`;
                q.opts.forEach((o, i) => { html += renderOpt(o, i, true); });
                html += `</div>`;
                html += `<button class="qz-next" id="qzNext">Weiter</button>`;
            }
            else if (q.type === 'text') {
                html += `<div class="qz-input-wrap"><textarea class="qz-input" id="qzText" placeholder="${q.placeholder || ''}"></textarea></div>`;
                html += `<button class="qz-next" id="qzNext">Weiter</button>`;
            }
            else if (q.type === 'mixed') {
                html += `<div class="${optsClass}">`;
                q.opts.forEach((o, i) => { html += renderOpt(o, i, true); });
                html += `</div>`;
                html += `<div class="qz-mixed-divider">oder</div>`;
                html += `<div class="qz-input-wrap"><textarea class="qz-input" id="qzText" placeholder="${q.placeholder || ''}"></textarea></div>`;
                html += `<button class="qz-next" id="qzNext">Weiter</button>`;
            }

            html += `
                <div class="qz-trust">
                    <span><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 100% anonym</span>
                    <span><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Keine Daten</span>
                    <span><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 5 Min.</span>
                </div>
            `;

            container.innerHTML = html;
            container.classList.remove('exit');

            // Force reflow
            void container.offsetHeight;
            container.classList.add('visible');

            // Update progress
            const pct = ((idx + 2) / totalQuestions) * 100; // +2 because Q1 is done
            document.getElementById('qzProgressFill').style.width = pct + '%';

            // Bind events
            bindEvents(q, idx);
        }, 350);
    }

    // ── Breather screen between categories ──
    function showBreather(breather, onDone) {
        const container = document.getElementById('qzQuestion');
        container.classList.remove('visible');
        container.classList.add('exit');

        setTimeout(() => {
            container.innerHTML = `
                <div class="qz-breather">
                    <div class="qz-breather-icon">✨</div>
                    <h2 class="qz-breather-title">${breather.title}</h2>
                    <p class="qz-breather-sub">${breather.sub}</p>
                </div>
            `;
            container.classList.remove('exit');
            void container.offsetHeight;
            container.classList.add('visible');

            setTimeout(onDone, 1600);
        }, 350);
    }

    // ── Advance to next question, possibly through a breather ──
    function advance(fromQId) {
        const breather = BREATHERS[fromQId];
        const next = () => {
            currentIdx++;
            renderQuestion(currentIdx);
        };
        if (breather) {
            showBreather(breather, next);
        } else {
            next();
        }
    }

    // ── Get the text of the option (ignoring emoji span) ──
    function optText(btn) {
        const textEl = btn.querySelector('.qz-opt-text');
        return textEl ? textEl.textContent : btn.textContent.trim();
    }

    // ── Bind interaction events ──
    function bindEvents(q, idx) {
        const container = document.getElementById('qzQuestion');

        if (q.type === 'single') {
            container.querySelectorAll('.qz-opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.qz-opt').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    answers[q.id] = optText(btn);
                    // Auto-advance after brief delay
                    setTimeout(() => advance(q.id), 500);
                });
            });
        }
        else if (q.type === 'multi') {
            const nextBtn = document.getElementById('qzNext');
            container.querySelectorAll('.qz-opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.classList.toggle('selected');
                    const selected = container.querySelectorAll('.qz-opt.selected');
                    if (selected.length > 0) {
                        nextBtn.classList.add('enabled');
                    } else {
                        nextBtn.classList.remove('enabled');
                    }
                });
            });
            nextBtn.addEventListener('click', () => {
                if (!nextBtn.classList.contains('enabled')) return;
                const selected = Array.from(container.querySelectorAll('.qz-opt.selected')).map(optText);
                answers[q.id] = selected;
                advance(q.id);
            });
        }
        else if (q.type === 'text') {
            const nextBtn = document.getElementById('qzNext');
            const input = document.getElementById('qzText');
            input.addEventListener('input', () => {
                if (input.value.trim().length > 0) {
                    nextBtn.classList.add('enabled');
                } else {
                    nextBtn.classList.remove('enabled');
                }
            });
            nextBtn.addEventListener('click', () => {
                if (!nextBtn.classList.contains('enabled')) return;
                answers[q.id] = input.value.trim();
                advance(q.id);
            });
        }
        else if (q.type === 'mixed') {
            const nextBtn = document.getElementById('qzNext');
            const input = document.getElementById('qzText');

            function checkValid() {
                const selected = container.querySelectorAll('.qz-opt.selected').length;
                const hasText = input && input.value.trim().length > 0;
                if (selected > 0 || hasText) {
                    nextBtn.classList.add('enabled');
                } else {
                    nextBtn.classList.remove('enabled');
                }
            }

            container.querySelectorAll('.qz-opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.classList.toggle('selected');
                    checkValid();
                });
            });

            if (input) {
                input.addEventListener('input', checkValid);
            }

            nextBtn.addEventListener('click', () => {
                if (!nextBtn.classList.contains('enabled')) return;
                const selected = Array.from(container.querySelectorAll('.qz-opt.selected')).map(optText);
                const text = input ? input.value.trim() : '';
                answers[q.id] = { selected, text };
                advance(q.id);
            });
        }
    }

    // ── Quiz complete — loading screen ──
    function quizComplete() {
        const container = document.getElementById('qzQuestion');
        container.classList.remove('visible');
        container.classList.add('exit');

        document.getElementById('qzProgressFill').style.width = '100%';

        try { sessionStorage.setItem('quizAnswers', JSON.stringify(answers)); } catch(e) {}

        setTimeout(() => {
            container.innerHTML = `
                <div class="qz-loading">
                    <p class="qz-loading-title">Deine Analyse wird erstellt&hellip;</p>
                    <div class="qz-loading-bar"><div class="qz-loading-bar-fill" id="qzLoadFill"></div></div>
                    <p class="qz-loading-status" id="qzLoadStatus">Antworten werden analysiert&hellip;</p>
                </div>
            `;
            container.classList.remove('exit');
            void container.offsetHeight;
            container.classList.add('visible');

            var fill = document.getElementById('qzLoadFill');
            var status = document.getElementById('qzLoadStatus');
            var steps = [
                { pct: 35, text: 'Antworten werden analysiert\u2026', time: 0 },
                { pct: 68, text: 'Muster werden erkannt\u2026', time: 1600 },
                { pct: 95, text: 'Dein Abnehmprofil wird erstellt\u2026', time: 3200 },
                { pct: 100, text: '', time: 4500 }
            ];

            steps.forEach(function(s) {
                setTimeout(function() {
                    if (fill) fill.style.width = s.pct + '%';
                    if (status && s.text) {
                        status.style.opacity = '0';
                        setTimeout(function() {
                            status.textContent = s.text;
                            status.style.opacity = '1';
                        }, 200);
                    }
                }, s.time);
            });

            setTimeout(function() {
                window.location.href = 'result.html';
            }, 5000);
        }, 350);
    }

    // ── Start quiz (called after gender selection on landing page) ──
    function startQuiz(q1Answer) {
        answers[1] = q1Answer; // gender
        buildOverlay();

        const overlay = document.getElementById('quizOverlay');
        document.documentElement.classList.add('quiz-active');
        // Small delay for DOM paint
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            setTimeout(() => renderQuestion(0), 400);
        });
    }

    // ── Expose globally ──
    window.startQuiz = startQuiz;

})();
