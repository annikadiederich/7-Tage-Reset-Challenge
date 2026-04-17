/* ═══════════════════════════════════
   QUIZ ENGINE
   ═══════════════════════════════════ */

(function () {
    'use strict';

    // ── Question data (Q2–Q35, Q1 is on the landing page) ──
    const questions = [
        { id: 2, q: 'Wie viel möchtest du gerne abnehmen?', type: 'single', opts: ['<5kg', '5–10kg', '10–15kg', '15+'] },
        { id: 3, q: 'Wie oft hast du ein schlechtes Gewissen wegen deinem Essen?', type: 'single', opts: ['Täglich', 'Mehrmals pro Woche', 'Ab und zu', 'Kaum / nie'] },
        { id: 4, q: 'Was trifft am ehesten auf dich zu?', type: 'single', opts: ['Ich denke ständig darüber nach, was ich essen darf / sollte', 'Ich kann Essen kaum noch entspannt genießen', 'Ich plane, kontrolliere oder hinterfrage mein Essen ständig', 'Ich fühle mich oft hin- und hergerissen zwischen „richtig machen" und „einfach essen"', 'Eigentlich alles davon'] },
        { id: 5, q: 'Wann verlierst du am häufigsten die Kontrolle über dein Essen?', type: 'single', opts: ['Abends, wenn endlich Ruhe ist', 'Nach stressigen Tagen', 'Wenn ich emotional bin', 'Eigentlich den ganzen Tag verteilt', 'Ich habe keinen Kontrollverlust'] },
        { id: 6, q: 'Was passiert dann meistens?', type: 'multi', opts: ['Ich esse mehr als ich wollte', 'Ich greife zu Süßem / Snacks', 'Ich kann nicht mehr aufhören', 'Ich fühle mich danach schlecht', 'Alles davon'] },
        { id: 7, q: 'Wie oft passiert dir das?', type: 'single', opts: ['Fast täglich', 'Mehrmals pro Woche', 'Ab und zu', 'Selten'] },
        { id: 8, q: 'Was geht diesen Momenten meistens voraus?', type: 'single', opts: ['Ein stressiger oder überfordernder Tag', 'Emotionale Situationen (z.\u00a0B. Streit, Gedanken, Druck)', 'Leere oder Langeweile', 'Ich funktioniere nur noch und bin innerlich angespannt', 'Ich kann keinen klaren Auslöser erkennen'] },
        { id: 9, q: 'Was denkst du in diesen Momenten über dich?', type: 'single', opts: ['„Ich hab einfach nicht genug Disziplin"', '„Warum schaffe ich es nicht, das durchzuziehen?"', '„Ich weiß doch, wie es geht – warum mache ich es nicht?"', '„Vielleicht werde ich es nie wirklich schaffen"', 'Ich versuche, nicht darüber nachzudenken'] },
        { id: 10, q: 'Was versuchst du in diesen Momenten zu vermeiden?', type: 'single', opts: ['Druck und inneren Stress', 'Enttäuschung über mich selbst', 'Das Gefühl, nicht gut genug zu sein', 'Unruhe oder innere Leere', 'Ich kann es nicht genau greifen'] },
        { id: 11, q: 'Wie fühlst du dich nach einem Rückfall meistens?', type: 'single', opts: ['Enttäuscht von mir selbst', 'Beschämt', 'Machtlos', 'Frustriert', 'Gleichgültig / leer'] },
        { id: 12, q: 'Welcher Satz beschreibt dein inneres Gefühl am besten?', type: 'single', opts: ['„Warum kriege ich das nicht hin?"', '„Ich sabotiere mich immer wieder selbst"', '„Andere schaffen es – ich irgendwie nicht"', '„Ich verliere die Kontrolle über mich"', '„Ich starte immer wieder neu und komme nicht raus"'] },
        { id: 13, q: 'Was hast du schon versucht, um das in den Griff zu bekommen?', type: 'multi', opts: ['Diäten', 'Kalorien zählen', 'Mehr Sport', 'Disziplin & „zusammenreißen"', 'Alles davon'] },
        { id: 14, q: 'Und warum hat es nie dauerhaft funktioniert?', type: 'single', opts: ['Ich halte es nicht durch', 'Ich falle immer wieder zurück', 'Es fühlt sich zu anstrengend an', 'Ich verliere irgendwann die Motivation', 'Ich weiß es ehrlich gesagt nicht'] },
        { id: 15, q: 'Kennst du das Gefühl, dass du eigentlich weißt, was zu tun ist… aber es trotzdem nicht schaffst umzusetzen?', type: 'single', opts: ['Ja, extrem', 'Oft', 'Manchmal', 'Eher nicht'] },
        { id: 16, q: 'Wie würdest du deinen Alltag beschreiben?', type: 'single', opts: ['Sehr stressig, ich funktioniere nur', 'Oft unter Druck', 'Mal so, mal so', 'Eher entspannt'] },
        { id: 17, q: 'Wenn Probleme im Leben auftauchen – wie reagierst du innerlich meistens?', type: 'single', opts: ['Ich fühle mich schnell überfordert', 'Ich funktioniere weiter, aber innerlich kippe ich', 'Ich verliere schnell den Glauben an mich', 'Ich ziehe mich zurück', 'Ich kompensiere es oft über Essen', 'Ich bleibe entspannt'] },
        { id: 18, q: 'Kennst du das Gefühl, dass dich schon kleine Rückschläge sofort aus deiner Spur bringen?', type: 'single', opts: ['Ja, total', 'Oft', 'Manchmal', 'Eher nicht'] },
        { id: 19, q: 'Wie sehr hast du das Gefühl, dir selbst wirklich vertrauen zu können?', type: 'single', opts: ['Gar nicht', 'Wenig', 'Teilweise', 'Eigentlich schon'] },
        { id: 20, q: 'Kennst du das Gefühl, dass Essen für dich eine Art „Ausgleich" ist?', type: 'single', opts: ['Ja, absolut', 'Oft', 'Manchmal', 'Nein'] },
        { id: 21, q: 'Wie oft denkst du am Tag an Essen?', type: 'single', opts: ['Sehr oft', 'Regelmäßig', 'Geht so', 'Kaum'] },
        { id: 22, q: 'Wie stark ist dein Heißhunger? Überisst du dich oft?', type: 'single', opts: ['Extrem stark', 'Stark', 'Mittel', 'Kaum vorhanden'] },
        { id: 23, q: 'Fühlst du dich mit diesem Thema von deinem Umfeld wirklich verstanden?', type: 'single', opts: ['Nein, überhaupt nicht', 'Eher nicht', 'Teilweise', 'Ja'] },
        { id: 24, q: 'Hast du das Gefühl, dass jemand in deinem Leben wirklich an dich glaubt – auch dann, wenn du selbst es gerade nicht kannst?', type: 'single', opts: ['Nein', 'Eher selten', 'Teilweise', 'Ja'] },
        { id: 25, q: 'Wie sehr bist du von Menschen umgeben, die selbst gestresst, zweifelnd oder im „Funktionieren" sind?', type: 'single', opts: ['Sehr stark', 'Ziemlich', 'Teilweise', 'Kaum'] },
        { id: 26, q: 'Was beschreibt dein Umfeld am ehesten?', type: 'single', opts: ['Viel Druck, wenig echte Ruhe', 'Viele Ausreden statt Veränderung', 'Man funktioniert, aber lebt nicht wirklich', 'Es fehlt an Menschen, die größer denken', 'Eigentlich alles davon'] },
        { id: 27, q: 'Wenn sich nichts ändert… wo stehst du in 6 Monaten?', type: 'single', opts: ['Genau am gleichen Punkt', 'Noch frustrierter', 'Mit noch mehr Gewicht', 'Ich will gar nicht daran denken'] },
        { id: 28, q: 'Was kostet dich das aktuell wirklich?', type: 'multi', opts: ['Energie', 'Selbstvertrauen', 'Lebensfreude', 'Beziehungen', 'Alles davon'] },
        { id: 29, q: 'Was schmerzt mehr als das Gewicht selbst?', type: 'single', opts: ['Das Gefühl, mich nicht im Griff zu haben', 'Mich immer wieder selbst zu enttäuschen', 'Mich zu verstecken', 'Nicht frei zu sein', 'Nicht mehr an mich zu glauben'] },
        { id: 30, q: 'Was würdest du dir innerlich am meisten zurückwünschen?', type: 'single', opts: ['Ruhe', 'Kontrolle', 'Leichtigkeit', 'Selbstvertrauen', 'Das Gefühl, wieder ich selbst zu sein'] },
        { id: 31, q: 'Wie würde dein Leben aussehen, wenn du das endlich im Griff hast?', type: 'single', opts: ['Leichter, freier, entspannter', 'Ich würde mich wieder wohlfühlen', 'Ich hätte Kontrolle', 'Ich wäre stolz auf mich'] },
        { id: 32, q: 'Was belastet dich aktuell am meisten an deiner Situation?', type: 'mixed', opts: ['Der ständige Heißhunger & Kontrollverlust', 'Mein Gewicht verändert sich nicht (oder kommt immer zurück)', 'Ich denke ständig an Essen', 'Ich verliere immer mehr Vertrauen in mich', 'Ich fühle mich einfach nicht mehr wohl in meinem Körper'], placeholder: 'Oder beschreibe es in deinen eigenen Worten' },
        { id: 33, q: 'Was wünschst du dir stattdessen?', type: 'mixed', opts: ['Endlich Ruhe im Kopf', 'Kontrolle über mein Essverhalten', 'Dauerhaft abnehmen ohne Rückfälle', 'Mich wieder wohl und sicher fühlen', 'Einfach wieder ich selbst sein'], placeholder: 'Oder beschreibe deinen Wunsch in deinen eigenen Worten' },
        { id: 34, q: 'Kurze Reflexion: Was ist dir bereits durch die Fragen bewusst geworden?', type: 'single', opts: ['Dass es so nicht weitergehen kann', 'Dass mein Problem tiefer liegt als Ernährung', 'Dass ich mich selbst immer wieder blockiere', 'Dass ich endlich etwas verändern muss', 'Ich weiß es noch nicht genau, aber irgendwas stimmt nicht'] },
        { id: 35, q: 'Willst du aktuell wirklich etwas verändern oder kann es für dich so weitergehen?', type: 'text', placeholder: 'Schreib hier deine ehrliche Antwort' },
        { id: 36, q: 'Bist du bereit, einen neuen Ansatz kennenzulernen, der nichts mit Diäten oder Disziplin zu tun hat?', type: 'single', opts: ['Ja, ich will das endlich lösen', 'Ich bin neugierig', 'Ich bin noch skeptisch'] },
    ];

    const totalQuestions = questions.length + 1; // +1 for Q1 on landing page
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
                    <span><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 3 Min.</span>
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

    // ── Start quiz (called after Q1 answer on landing page) ──
    function startQuiz(q1Answer) {
        answers[1] = q1Answer;
        buildOverlay();

        const overlay = document.getElementById('quizOverlay');
        // Small delay for DOM paint
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            setTimeout(() => renderQuestion(0), 400);
        });
    }

    // ── Expose globally ──
    window.startQuiz = startQuiz;

})();
