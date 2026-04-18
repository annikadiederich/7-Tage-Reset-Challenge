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

    // ── Build overlay DOM ──
    function buildOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'quiz-overlay';
        overlay.id = 'quizOverlay';
        overlay.innerHTML = `
            <div class="qz-progress"><div class="qz-progress-fill" id="qzProgressFill"></div></div>
            <div class="qz-logo" style="text-align:center; padding:24px 0 0; font-family:'Sansita Swashed',cursive; font-size:1.15rem; font-weight:700; color:#1e1c1a;">Elliott Aziz</div>
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
            let html = `<p class="qz-q">${q.q}</p>`;

            if (q.type === 'single') {
                html += `<div class="qz-opts">`;
                q.opts.forEach((o, i) => {
                    html += `<button class="qz-opt" data-idx="${i}">${o}</button>`;
                });
                html += `</div>`;
                html += `<button class="qz-next hidden">Weiter</button>`;
            }
            else if (q.type === 'multi') {
                html += `<div class="qz-opts">`;
                q.opts.forEach((o, i) => {
                    html += `<button class="qz-opt" data-multi data-idx="${i}">${o}</button>`;
                });
                html += `</div>`;
                html += `<button class="qz-next" id="qzNext">Weiter</button>`;
            }
            else if (q.type === 'text') {
                html += `<div class="qz-input-wrap"><textarea class="qz-input" id="qzText" placeholder="${q.placeholder || ''}"></textarea></div>`;
                html += `<button class="qz-next" id="qzNext">Weiter</button>`;
            }
            else if (q.type === 'mixed') {
                html += `<div class="qz-opts">`;
                q.opts.forEach((o, i) => {
                    html += `<button class="qz-opt" data-multi data-idx="${i}">${o}</button>`;
                });
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

    // ── Bind interaction events ──
    function bindEvents(q, idx) {
        const container = document.getElementById('qzQuestion');

        if (q.type === 'single') {
            container.querySelectorAll('.qz-opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.qz-opt').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    answers[q.id] = btn.textContent;
                    // Auto-advance after brief delay
                    setTimeout(() => {
                        currentIdx++;
                        renderQuestion(currentIdx);
                    }, 400);
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
                const selected = Array.from(container.querySelectorAll('.qz-opt.selected')).map(b => b.textContent);
                answers[q.id] = selected;
                currentIdx++;
                renderQuestion(currentIdx);
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
                currentIdx++;
                renderQuestion(currentIdx);
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
                const selected = Array.from(container.querySelectorAll('.qz-opt.selected')).map(b => b.textContent);
                const text = input ? input.value.trim() : '';
                answers[q.id] = { selected, text };
                currentIdx++;
                renderQuestion(currentIdx);
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
