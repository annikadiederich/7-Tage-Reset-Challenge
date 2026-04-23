/* ═══════════════════════════════════
   QUIZ ENGINE
   ═══════════════════════════════════ */

(function () {
    'use strict';

    // ── Question data (Q2–Q29, Q1 is gender on landing page) ──
    const questions = [
        { id: 2, q: 'Wie alt bist du?', type: 'single', layout: 'stack', opts: ['Unter 25', '25 – 34', '35 – 44', '45 – 54', '55+'] },
        { id: 3, q: 'Wähle deinen Körpertyp', type: 'bodytype', opts: [
            { label: 'Normal', img: 'bodytype-female-1.png' },
            { label: 'Kurvig', img: 'bodytype-female-3.png' },
            { label: 'Deutlich kurvig', img: 'bodytype-female-4.png' },
            { label: 'Kräftig', img: 'bodytype-female-5.png' },
        ]},
        { id: 4, q: 'Wie viel möchtest du abnehmen?', type: 'stepcards', opts: [
            { label: 'Unter 5 kg', level: 1 },
            { label: '5–10 kg', level: 2 },
            { label: '10–15 kg', level: 3 },
            { label: 'Über 15 kg', level: 4 },
        ] },
        { id: 5, q: 'Wie oft denkst du am Tag über Essen oder Abnehmen nach?', type: 'stepcards', opts: [
            { label: 'Selten', sub: 'Kaum Gedanken daran', level: 1 },
            { label: 'Immer wieder', sub: 'Ein paar Mal täglich', level: 2 },
            { label: 'Sehr oft', sub: 'Viele Male pro Stunde', level: 3 },
            { label: 'Ständig', sub: 'Durchgehend im Kopf', level: 4 },
        ] },
        { id: 6, q: 'Hast du oft ein schlechtes Gewissen nach dem Essen?', type: 'stepcards', opts: [
            { label: 'Kaum', sub: 'Fast nie', level: 1 },
            { label: 'Ab und zu', sub: 'Ein paar Mal im Monat', level: 2 },
            { label: 'Mehrmals pro Woche', sub: 'Regelmäßig', level: 3 },
            { label: 'Ja, täglich', sub: 'Nach fast jeder Mahlzeit', level: 4 },
        ] },
        // ── Breather 1 nach Q6 ──
        { id: 7, q: 'Welcher Satz passt am besten zu dir?', type: 'single', opts: [
            { text: 'Ich denke ständig darüber nach, was ich essen darf', emoji: '🧠', highlight: 'ständig' },
            { text: 'Ich kann Essen nicht mehr entspannt genießen',        emoji: '😣', highlight: 'nicht mehr entspannt' },
            { text: 'Ich kontrolliere mein Essen ständig',                 emoji: '🔒', highlight: 'kontrolliere' },
            { text: 'Ich schwanke zwischen Kontrolle und Aufgeben',        emoji: '🔄', highlight: 'Kontrolle und Aufgeben' },
            { text: 'Alles davon',                                         emoji: '🎯', highlight: 'Alles davon', critical: true },
        ] },
        { id: 8, q: 'Wann verlierst du am ehesten die Kontrolle beim Essen?', type: 'single', opts: ['Abends', 'Nach Stress', 'Bei Emotionen', 'Über den ganzen Tag', 'Eigentlich nie'] },
        { id: 9, q: 'Was passiert dann?', type: 'single', opts: [
            { text: 'Ich esse mehr als geplant',     emoji: '🍽️', highlight: 'mehr als geplant' },
            { text: 'Ich greife zu Süßem',            emoji: '🍬', highlight: 'Süßem' },
            { text: 'Ich kann nicht aufhören',        emoji: '🛑', highlight: 'nicht aufhören' },
            { text: 'Ich fühle mich danach schlecht', emoji: '😔', highlight: 'schlecht' },
            { text: 'Alles davon',                    emoji: '🎯', highlight: 'Alles davon', critical: true },
        ] },
        { id: 10, q: 'Wie oft passiert das?', type: 'stepcards', opts: [
            { label: 'Selten', sub: 'Ein paar Mal im Monat', level: 1 },
            { label: 'Ab und zu', sub: 'Ein paar Mal pro Woche', level: 2 },
            { label: 'Mehrmals pro Woche', sub: 'Regelmäßig', level: 3 },
            { label: 'Fast täglich', sub: 'Nahezu jeden Tag', level: 4 },
        ] },
        { id: 11, q: 'Was passiert meistens davor?', type: 'single', opts: [
            { text: 'Stress oder Überforderung', emoji: '🌀', highlight: 'Stress' },
            { text: 'Emotionale Situationen',    emoji: '💭', highlight: 'Emotionale' },
            { text: 'Langeweile oder Leere',     emoji: '🕳️', highlight: 'Leere' },
            { text: 'Innere Anspannung',         emoji: '⚡', highlight: 'Anspannung' },
            { text: 'Ich weiß es nicht genau',   emoji: '🤷' },
        ] },
        { id: 12, q: 'Wie stark ist dein Heißhunger?', type: 'scale', opts: [
            { label: 'Kaum',   sub: 'Kaum spürbar' },
            { label: 'Mittel', sub: 'Kommt und geht' },
            { label: 'Stark',  sub: 'Regelmäßig stark' },
            { label: 'Extrem', sub: 'Dauerhaft intensiv' },
        ] },
        { id: 13, q: 'Du weißt, was zu tun ist — aber setzt es nicht um?', hint: 'Sei ehrlich zu dir. Deine Antwort bleibt anonym.', type: 'stepcards', opts: [
            { label: 'Eher nicht', sub: 'Ich setze um, was ich weiß', level: 1 },
            { label: 'Manchmal', sub: 'Mal so, mal so', level: 2 },
            { label: 'Oft', sub: 'Regelmäßig', level: 3 },
            { label: 'Ja, total', sub: 'Das ist genau mein Problem', level: 4 },
        ] },
        // ── Breather 2 nach Q13 ──
        { id: 14, q: 'Welcher Gedanke kommt dir am häufigsten?', type: 'single', opts: [
            { text: 'Warum schaffe ich das nicht?', emoji: '❓', highlight: 'Warum' },
            { text: 'Ich sabotiere mich selbst',     emoji: '💥', highlight: 'sabotiere' },
            { text: 'Andere schaffen es, ich nicht', emoji: '👥', highlight: 'Andere schaffen' },
            { text: 'Ich verliere die Kontrolle',    emoji: '🌊', highlight: 'Kontrolle' },
            { text: 'Ich starte immer wieder neu',   emoji: '🔄', highlight: 'immer wieder' },
        ] },
        { id: 15, q: 'Wie fühlst du dich nach einem Rückfall?', type: 'single', opts: ['Enttäuscht', 'Beschämt', 'Machtlos', 'Frustriert', 'Leer'] },
        { id: 16, q: 'Was hast du schon versucht?', type: 'multi', opts: [
            'Diäten',
            'Kalorien zählen',
            'Mehr Sport',
            'Disziplin',
            { text: 'Alles davon', emoji: '✔️', critical: true, highlight: 'Alles davon' },
        ] },
        { id: 17, q: 'Warum hat es nie dauerhaft geklappt?', type: 'single', opts: [
            { text: 'Ich halte nicht durch',         emoji: '🪫', highlight: 'nicht durch' },
            { text: 'Ich falle immer zurück',        emoji: '📉', highlight: 'immer zurück' },
            { text: 'Es ist zu anstrengend',         emoji: '🏋️‍♀️', highlight: 'anstrengend' },
            { text: 'Die Motivation geht verloren',  emoji: '💨', highlight: 'Motivation' },
            { text: 'Ich weiß es nicht',             emoji: '🤷' },
        ] },
        { id: 18, q: 'Wie stressig ist dein Alltag?', type: 'scale', opts: [
            { label: 'Eher entspannt',  sub: 'Wenig Druck im Alltag' },
            { label: 'Mal so, mal so',  sub: 'Gute und schwere Tage wechseln sich ab' },
            { label: 'Oft unter Druck', sub: 'Regelmäßig angespannt' },
            { label: 'Sehr stressig',   sub: 'Dauerhaft unter Druck' },
        ] },
        { id: 19, q: 'Ist Essen für dich eine Art Ausgleich?', type: 'scale', opts: [
            { label: 'Nein',        sub: 'Gar nicht' },
            { label: 'Manchmal',    sub: 'Ab und zu' },
            { label: 'Oft',         sub: 'Regelmäßig' },
            { label: 'Ja, absolut', sub: 'Fast immer' },
        ] },
        { id: 20, q: 'Wie reagierst du auf Probleme?', type: 'single', opts: [
            { text: 'Schnell überfordert',             emoji: '😰', highlight: 'überfordert' },
            { text: 'Funktioniere, aber kippe innerlich', emoji: '🎭', highlight: 'kippe innerlich' },
            { text: 'Verliere den Glauben an mich',    emoji: '📉', highlight: 'Glauben' },
            { text: 'Ziehe mich zurück',               emoji: '🙈', highlight: 'zurück' },
            { text: 'Kompensiere über Essen',          emoji: '🍩', highlight: 'über Essen' },
            { text: 'Bleibe entspannt',                emoji: '🌿', highlight: 'entspannt', positive: true },
        ] },
        { id: 21, q: 'Bringen dich kleine Rückschläge schnell aus der Bahn?', type: 'scale', opts: [
            { label: 'Eher nicht', sub: 'Ich bleibe stabil' },
            { label: 'Manchmal',   sub: 'Kommt drauf an' },
            { label: 'Oft',        sub: 'Regelmäßig' },
            { label: 'Ja, total',  sub: 'Komplett raus' },
        ] },
        { id: 22, q: 'Vertraust du dir selbst?', type: 'scale', opts: [
            { label: 'Gar nicht',  sub: 'Kein Vertrauen' },
            { label: 'Wenig',      sub: 'Kaum noch' },
            { label: 'Teilweise',  sub: 'Hier und da' },
            { label: 'Ja',         sub: 'Voll und ganz' },
        ] },
        // ── Breather 3 nach Q22 ──
        { id: 23, q: 'Wo stehst du in 6 Monaten, wenn sich nichts ändert?', type: 'single', opts: [
            { text: 'Am gleichen Punkt',        emoji: '📍', highlight: 'gleichen Punkt' },
            { text: 'Noch frustrierter',        emoji: '😤', highlight: 'frustrierter' },
            { text: 'Mit mehr Gewicht',         emoji: '📈', highlight: 'mehr Gewicht' },
            { text: 'Will ich nicht dran denken', emoji: '❌', highlight: 'nicht dran denken' },
        ] },
        { id: 24, q: 'Was kostet dich die Situation gerade?', type: 'single', opts: [
            { text: 'Energie',          emoji: '🪫' },
            { text: 'Selbstvertrauen',  emoji: '😔' },
            { text: 'Lebensfreude',     emoji: '🙁' },
            { text: 'Beziehungen',      emoji: '👥' },
            { text: 'Alles davon',      emoji: '❌', critical: true, highlight: 'Alles davon' },
        ] },
        { id: 25, q: 'Was schmerzt dich am meisten?', type: 'single', opts: [
            { text: 'Keine Kontrolle zu haben',   emoji: '🌊', highlight: 'Kontrolle' },
            { text: 'Mich immer zu enttäuschen',  emoji: '😔', highlight: 'enttäuschen' },
            { text: 'Mich zu verstecken',         emoji: '🙈', highlight: 'verstecken' },
            { text: 'Nicht frei zu sein',         emoji: '⛓️', highlight: 'frei' },
            { text: 'Nicht an mich zu glauben',   emoji: '💔', highlight: 'glauben' },
        ] },
        { id: 26, q: 'Was wünschst du dir stattdessen?', type: 'multi', opts: [
            { text: 'Ruhe im Kopf',                         emoji: '🧘‍♀️', highlight: 'Ruhe' },
            { text: 'Kontrolle über mein Essen',            emoji: '🎯', highlight: 'Kontrolle' },
            { text: 'Dauerhaft abnehmen',                   emoji: '⚖️', highlight: 'Dauerhaft' },
            { text: 'Mit Selbstvertrauen ich selbst sein',  emoji: '💪', highlight: 'Selbstvertrauen' },
            { text: 'Leichtigkeit',                         emoji: '✨', highlight: 'Leichtigkeit' },
        ] },
        { id: 27, q: 'Was belastet dich gerade am meisten?', type: 'multi', opts: [
            { text: 'Heißhunger & Kontrollverlust',    emoji: '🔥', highlight: 'Kontrollverlust' },
            { text: 'Gewicht verändert sich nicht',    emoji: '⚖️', highlight: 'nicht' },
            { text: 'Essen ist ständig im Kopf',       emoji: '🧠', highlight: 'ständig' },
            { text: 'Ich verliere Vertrauen in mich',  emoji: '💔', highlight: 'Vertrauen' },
            { text: 'Ich fühle mich nicht wohl',       emoji: '😔', highlight: 'nicht wohl' },
        ] },
        { id: 28, q: 'Was ist dir durch die Fragen bewusst geworden?', type: 'single', opts: [
            { text: 'So kann es nicht weitergehen', emoji: '🚦', highlight: 'nicht weitergehen' },
            { text: 'Mein Problem liegt tiefer',    emoji: '🔍', highlight: 'tiefer' },
            { text: 'Ich blockiere mich selbst',    emoji: '🧱', highlight: 'blockiere' },
            { text: 'Ich muss etwas ändern',        emoji: '🔄', highlight: 'ändern' },
            { text: 'Irgendwas stimmt nicht',       emoji: '❗', highlight: 'stimmt nicht' },
        ] },
        { id: 29, q: 'Bist du bereit für einen neuen Ansatz für deine Abnahme?', type: 'single', opts: [
            { text: 'Ja, ich will das lösen', emoji: '✅', highlight: 'lösen', positive: true },
            { text: 'Ich bin neugierig',      emoji: '👀', highlight: 'neugierig' },
        ] },
    ];

    const totalQuestions = questions.length + 1; // +1 for gender on landing page
    const answers = {};

    // ── Category mapping for progress context ──
    const categories = [
        { name: 'Über dich', range: [1, 6] },
        { name: 'Deine Abnehmblockade', range: [7, 13] },
        { name: 'Stress & Alltag', range: [14, 22] },
        { name: 'Kosten & Wunsch', range: [23, 29] },
    ];

    function categoryFor(qId) {
        return categories.find(c => qId >= c.range[0] && qId <= c.range[1]) || categories[0];
    }

    // Breather screen shown AFTER this question finishes
    const BREATHERS = {
        6: {
            chapter: 1,
            total: 3,
            chapterName: 'Basis-Check',
            title: 'Du bist nicht <span class="qz-script">allein</span>.',
            intro: 'Viele Frauen in deinem Alter erleben gerade genau das:',
            points: [
                { icon: 'head',   text: 'Der Kopf ist voll mit Essen und Abnehmen' },
                { icon: 'guilt',  text: 'Schlechtes Gewissen nach dem Essen' },
                { icon: 'spark',  text: 'Wissen, was zu tun ist — und es trotzdem nicht schaffen' },
            ],
            outro: 'Die nächsten Fragen zeigen, was deine Abnahme <span class="qz-script">konkret</span> blockiert.',
            cta: 'Weiter zur Analyse',
            icon: 'strength'
        },
        13: {
            chapter: 2,
            total: 3,
            chapterName: 'Muster-Analyse',
            titleLayout: 'split',
            title: '<span class="qz-script">Heißhunger</span> ist kein Zufall.',
            intro: 'Deine Antworten zeigen: Essen ist für dich nicht nur „Energie" — <strong>es ist Ausgleich, Beruhigung und Ventil.</strong>',
            points: [
                { icon: 'swirl', text: 'Stress, Druck, Emotionen',                     sub: 'Dein tägliches Grundrauschen' },
                { icon: 'gear',  text: 'Du funktionierst am Tag',                      sub: 'Aber innen tickt die Uhr' },
                { icon: 'moon',  text: 'Abends holt sich dein Körper Ruhe über Essen', sub: 'Der einzige Moment, der „dir" gehört' },
            ],
            outro: 'Das hat nichts mit <span class="qz-strike">„zu schwach"</span> zu tun.<br><span class="qz-outro-emph">Es ist ein überlastetes System.</span>',
            outroVerdict: true,
            trustStrip: 'card',
            cta: 'Weiter zur Auswertung',
        },
        22: {
            chapter: 3,
            total: 3,
            chapterName: 'Dein Reset',
            pillLabel: 'Dein Zwischenfazit',
            title: 'Wenn dein Nervensystem kaum <span class="qz-script">zur Ruhe</span> kommt …',
            intro: '… fühlt sich Abnehmen immer wie <strong>ein Kampf</strong> an:',
            points: [
                { icon: 'downturn', text: 'Jeder Rückschlag wirft dich gefühlt komplett zurück' },
                { icon: 'question', text: 'Du zweifelst an dir' },
                { icon: 'restart',  text: 'Du weißt, was zu tun ist – setzt es aber nicht konstant um' },
            ],
            outro: 'Gleich bekommst du deinen <span class="qz-br-outro-accent">Haupt-Abnehmblocker</span><br><span class="qz-outro-emph">schwarz auf weiß.</span>',
            outroVerdict: true,
            trustStrip: 'card',
            cta: 'Zu den letzten Fragen',
        },
    };

    // ── Fitness-style breather icons (inline SVG) ──
    const BREATHER_ICONS = {
        strength: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="4" y="24" width="8" height="16" rx="2" fill="currentColor"/>
            <rect x="52" y="24" width="8" height="16" rx="2" fill="currentColor"/>
            <rect x="12" y="28" width="6" height="8" rx="1" fill="currentColor"/>
            <rect x="46" y="28" width="6" height="8" rx="1" fill="currentColor"/>
            <rect x="18" y="30" width="28" height="4" rx="2" fill="currentColor"/>
        </svg>`,
        fire: `<svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
            <path d="M32 6 C 28 14, 22 18, 22 28 C 22 32, 24 36, 28 36 C 26 32, 27 28, 30 26 C 30 32, 34 36, 34 42 C 34 46, 30 48, 28 46 C 30 50, 34 52, 38 52 C 46 52, 50 46, 50 38 C 50 30, 44 24, 42 20 C 40 26, 36 28, 36 22 C 36 16, 34 10, 32 6 Z"/>
        </svg>`,
        trophy: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 10 h24 v12 a12 12 0 0 1 -24 0 z" fill="currentColor"/>
            <path d="M12 14 h8 v8 a6 6 0 0 1 -8 0 z"/>
            <path d="M44 14 h8 v8 a6 6 0 0 1 -8 0 z" transform="translate(-44 0) scale(-1 1) translate(-64 0)"/>
            <path d="M44 14 h8 v6 a6 6 0 0 1 -8 0 z"/>
            <path d="M28 34 h8 v8 h-8 z" fill="currentColor" stroke="none"/>
            <path d="M22 44 h20 v6 h-20 z" fill="currentColor" stroke="none"/>
        </svg>`
    };

    // Line-style SVG icons for breather point cards — peach tinted badge
    const POINT_ICONS = {
        // Breather 1
        head: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5c-2 0-4 1.5-4 3.8 0 1-.8 1.7-1.2 2.8-.5 1.5.3 2.9 1.7 3.3-.2 1.9 1.2 3.6 3 3.8.5 1.4 2 2.3 3.5 2.3 1.8 0 3.3-1.3 3.5-3 1.9-.2 3.3-1.9 3.1-3.8 1.4-.4 2.2-1.8 1.7-3.3-.4-1.1-1.2-1.8-1.2-2.8C18 6.5 16 5 14 5c-.8 0-1.5.3-2 .7-.5-.4-1.2-.7-2-.7-.8 0-1.5.3-2 .7-.5-.4-1.2-.7-2-.7z"/><path d="M12 6v12"/></svg>`,
        guilt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 16 Q 12 13 16 16"/><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none"/></svg>`,
        spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 21.5h4"/><path d="M12 2a7 7 0 0 0-4 12.5c.9.8 1 1.9 1 2.5h6c0-.6.1-1.7 1-2.5A7 7 0 0 0 12 2z"/></svg>`,
        // Breather 2
        swirl: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-18 0 6 6 0 0 1 12 0 3 3 0 0 1-6 0"/></svg>`,
        gear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>`,
        moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`,
        // Breather 3
        downturn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l6 6 3-3 9 9"/><path d="M21 19v-5"/><path d="M21 19h-5"/></svg>`,
        question: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 3.8"/><circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none"/></svg>`,
        restart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>`,
        // Extras
        fire: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-5 2-5 7a8 8 0 0 0 16 0c0-6-8-12-8-12z"/></svg>`,
        heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>`,
        target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/></svg>`,
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
        return opts.every(o => {
            const t = typeof o === 'object' && o !== null ? o.text : o;
            return (t || '').length <= 22;
        });
    }

    // ── Body type photo per option (gender-aware) ──
    function bodyTypeImage(opt) {
        const gender = answers[1] || 'Weiblich';
        const isMan = gender === 'Männlich';
        const file = isMan ? opt.img.replace('female', 'male') : opt.img;
        return `<img class="qz-bt-photo" src="generated-images/${file}" alt="" draggable="false">`;
    }

    // ── Build overlay DOM ──
    function buildOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'quiz-overlay';
        overlay.id = 'quizOverlay';
        overlay.innerHTML = `
            <div class="qz-logo"><img src="elliott-aziz-logo.png" alt="Elliott Aziz"></div>
            <div class="qz-progress-wrap">
                <div class="qz-progress"><div class="qz-progress-fill" id="qzProgressFill"></div></div>
            </div>
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

            const hintHTML = q.hint ? `<p class="qz-q-hint">${q.hint}</p>` : '';
            let html = `
                <div class="qz-cat-label">
                    <span class="qz-cat-name">${cat.name}</span>
                    <span class="qz-cat-dot">·</span>
                    <span class="qz-cat-count">${posInCat}/${totalInCat}</span>
                </div>
                <p class="qz-q">${q.q}</p>
                ${hintHTML}
            `;

            const useGrid = q.layout !== 'stack'
                && (q.type === 'single' || q.type === 'multi' || q.type === 'mixed')
                && q.opts && shouldUseGrid(q.opts);
            const optsClass = 'qz-opts' + (useGrid ? ' qz-opts-grid' : '');

            const SOFT_PATTERN = /wei(?:ß|ss) (?:es )?nicht|keine ahnung|nicht sicher/i;
            const renderOpt = (o, i, isMulti) => {
                // Option may be a plain string OR an object { text, emoji?, highlight?, positive?, critical? }
                const isObj = typeof o === 'object' && o !== null;
                const text = isObj ? o.text : o;
                const customEmoji = isObj ? o.emoji : null;
                const highlight = isObj ? o.highlight : null;
                const positive = isObj ? o.positive : false;
                const critical = isObj ? o.critical : false;

                // Emoji: custom wins, else grid auto-emoji, else none
                let emojiHTML = '';
                if (customEmoji) {
                    emojiHTML = `<span class="qz-opt-emoji" aria-hidden="true">${customEmoji}</span>`;
                } else if (useGrid) {
                    emojiHTML = `<span class="qz-opt-emoji" aria-hidden="true">${emojiFor(text)}</span>`;
                }

                // Inject highlight span around the accent phrase
                let textHTML = text;
                if (highlight) {
                    const escapedHL = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    textHTML = text.replace(new RegExp(escapedHL), `<span class="qz-opt-highlight">${highlight}</span>`);
                }

                const multiAttr = isMulti ? ' data-multi' : '';
                const softClass = (!useGrid && SOFT_PATTERN.test(text)) ? ' qz-opt--soft' : '';
                const posClass = positive ? ' qz-opt--positive' : '';
                const critClass = critical ? ' qz-opt--critical' : '';
                return `<button class="qz-opt${softClass}${posClass}${critClass}"${multiAttr} data-idx="${i}">
                    ${emojiHTML}
                    <span class="qz-opt-text">${textHTML}</span>
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
            else if (q.type === 'scale') {
                const optLabel = (o) => typeof o === 'object' && o !== null ? o.label : o;
                const arrowSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>`;
                html += `<div class="qz-scale">`;
                html += `<p class="qz-scale-instruction">Ziehe den Regler zu deiner Antwort <span class="qz-scale-instr-arrow">${arrowSVG}</span></p>`;
                html += `<div class="qz-scale-track" id="qzScaleTrack">
                    <div class="qz-scale-fill" id="qzScaleFill"></div>
                    <div class="qz-scale-stops">`;
                q.opts.forEach((o, i) => {
                    html += `<div class="qz-scale-stop" data-idx="${i}"><span class="qz-scale-dot"></span></div>`;
                });
                html += `</div>
                    <div class="qz-scale-thumb qz-scale-thumb--hint" id="qzScaleThumb">
                        <span class="qz-scale-thumb-grip"></span>
                        <span class="qz-scale-thumb-tip" id="qzScaleThumbTip">Ziehen ${arrowSVG}</span>
                    </div>
                </div>`;
                html += `<div class="qz-scale-labels">`;
                q.opts.forEach((o, i) => {
                    html += `<button class="qz-scale-label${i === 0 ? ' active' : ''}" data-idx="${i}">${optLabel(o)}</button>`;
                });
                html += `</div>`;
                html += `</div>`;
                html += `<button class="qz-next hidden">Weiter</button>`;
            }
            else if (q.type === 'bodytype') {
                html += `<div class="qz-bodytypes">`;
                q.opts.forEach((opt, i) => {
                    html += `<button class="qz-bodytype" data-idx="${i}">
                        <span class="qz-bt-fig">${bodyTypeImage(opt)}</span>
                        <span class="qz-bt-label">${opt.label}</span>
                    </button>`;
                });
                html += `</div>`;
                html += `<button class="qz-next hidden">Weiter</button>`;
            }
            else if (q.type === 'numcards') {
                html += `<div class="qz-numgrid">`;
                q.opts.forEach((opt, i) => {
                    html += `<button class="qz-numcard" data-idx="${i}">
                        <span class="qz-numcard-num">${opt.display}</span>
                    </button>`;
                });
                html += `</div>`;
                html += `<button class="qz-next hidden">Weiter</button>`;
            }
            else if (q.type === 'stepcards') {
                const total = q.opts.length;
                html += `<div class="qz-stepcards">`;
                q.opts.forEach((opt, i) => {
                    let bars = '';
                    for (let b = 1; b <= total; b++) {
                        bars += `<span class="qz-step-bar${b <= opt.level ? ' filled' : ''}"></span>`;
                    }
                    const sub = opt.sub ? `<span class="qz-stepcard-sub">${opt.sub}</span>` : '';
                    html += `<button class="qz-stepcard${opt.sub ? ' has-sub' : ''}" data-idx="${i}" data-level="${opt.level}">
                        <span class="qz-stepcard-bars">${bars}</span>
                        <span class="qz-stepcard-label">${opt.label}</span>
                        ${sub}
                    </button>`;
                });
                html += `</div>`;
                html += `<button class="qz-next hidden">Weiter</button>`;
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

            // Update progress — overall, over all questions (no text counter)
            const currentNum = idx + 2; // +2 because Q1 (gender) is done
            const pct = (currentNum / totalQuestions) * 100;
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
            const chapterNum = breather.chapter || 1;
            const chapterLabel = breather.pillLabel
                ? breather.pillLabel
                : (chapterNum === 1
                    ? 'ZWISCHENFAZIT'
                    : `ZWISCHENFAZIT <span class="qz-br-pill-num">#${chapterNum}</span>`);

            // Build the main content block (new layout if points present, else fallback body HTML)
            let contentHTML = '';
            if (breather.points && breather.points.length) {
                if (breather.intro) contentHTML += `<p class="qz-br-intro">${breather.intro}</p>`;
                contentHTML += `<div class="qz-br-points">`;
                breather.points.forEach(p => {
                    const ico = POINT_ICONS[p.icon] || POINT_ICONS.spark;
                    const subHTML = p.sub ? `<span class="qz-br-point-sub">${p.sub}</span>` : '';
                    contentHTML += `<div class="qz-br-point${p.sub ? ' has-sub' : ''}">
                        <span class="qz-br-point-ico">${ico}</span>
                        <span class="qz-br-point-body">
                            <span class="qz-br-point-text">${p.text}</span>
                            ${subHTML}
                        </span>
                    </div>`;
                });
                contentHTML += `</div>`;
                if (breather.outro) {
                    contentHTML += `<p class="qz-br-outro">${breather.outro}</p>`;
                }
            } else {
                contentHTML = `<div class="qz-breather-body">${breather.body || `<p>${breather.sub || ''}</p>`}</div>`;
            }

            // Wrap outro in verdict block if flagged
            let finalContentHTML = contentHTML;
            if (breather.outroVerdict && breather.outro) {
                // Replace plain outro with verdict-styled outro
                finalContentHTML = finalContentHTML.replace(
                    `<p class="qz-br-outro">${breather.outro}</p>`,
                    `<div class="qz-br-verdict"><p class="qz-br-verdict-text">${breather.outro}</p></div>`
                );
            }

            let proofHTML = '';
            const starSq = `<span class="qz-br-tp-star"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 16.8l-5.8 3.1 1.1-6.5L2.6 8.8l6.5-.9z"/></svg></span>`;
            if (breather.trustStrip === 'card') {
                proofHTML = `<div class="qz-br-tp-card">
                    <div class="qz-br-tp-stars">${starSq.repeat(5)}</div>
                    <div class="qz-br-tp-meta">
                        <span class="qz-br-tp-label">Trustpilot</span>
                        <span class="qz-br-tp-sep">—</span>
                        <span class="qz-br-tp-rating"><strong>4.9 / 5</strong> · Ausgezeichnet</span>
                    </div>
                    <p class="qz-br-tp-count">Bereits über <strong>10.000 Teilnehmer</strong></p>
                </div>`;
            } else if (breather.trustStrip) {
                const star = `<span class="qz-tb-star"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 16.8l-5.8 3.1 1.1-6.5L2.6 8.8l6.5-.9z"/></svg></span>`;
                proofHTML = `<div class="qz-br-trustbanner">
                    <div class="qz-tb-col">
                        <div class="qz-tb-stars">${star.repeat(5)}</div>
                        <span class="qz-tb-text">4,9/5 aus 100+ Bewertungen</span>
                    </div>
                    <div class="qz-tb-col">
                        <div class="qz-tb-avatars">
                            <div class="qz-tb-av" style="background-image:url('trafo 1.jpeg')"></div>
                            <div class="qz-tb-av" style="background-image:url('trafo 2.jpeg')"></div>
                            <div class="qz-tb-av" style="background-image:url('trafo 3.jpeg')"></div>
                            <div class="qz-tb-av" style="background-image:url('trafo 4.jpeg')"></div>
                        </div>
                        <span class="qz-tb-sub">Bereits über <strong>10.000</strong> Teilnehmer</span>
                    </div>
                </div>`;
            } else if (breather.proofText) {
                const starsHTML = `<span class="qz-br-stars">${'★'.repeat(5)}</span>`;
                proofHTML = `<div class="qz-br-proof">
                    ${starsHTML}
                    <span class="qz-br-proof-text">${breather.proofText}</span>
                </div>`;
            }

            // Title: split layout extracts the script accent as big eyebrow
            let titleHTML;
            if (breather.titleLayout === 'split') {
                const m = breather.title.match(/^\s*<span class="qz-script">([\s\S]*?)<\/span>\s*([\s\S]*)$/);
                if (m) {
                    titleHTML = `<div class="qz-breather-title qz-breather-title--split">
                        <span class="qz-breather-eyebrow">${m[1]}</span>
                        <h2 class="qz-breather-main">${m[2]}</h2>
                    </div>`;
                } else {
                    titleHTML = `<h2 class="qz-breather-title">${breather.title}</h2>`;
                }
            } else {
                titleHTML = `<h2 class="qz-breather-title">${breather.title}</h2>`;
            }

            container.innerHTML = `
                <div class="qz-breather">
                    <div class="qz-breather-chapter-pill">${chapterLabel}</div>
                    ${titleHTML}
                    ${finalContentHTML}
                    ${proofHTML}
                    <button class="qz-breather-btn">${breather.cta || 'Weiter'} <span class="qz-breather-arrow">→</span></button>
                </div>
            `;
            container.classList.remove('exit');
            void container.offsetHeight;
            container.classList.add('visible');

            const btn = container.querySelector('.qz-breather-btn');
            if (btn) btn.addEventListener('click', onDone);
        }, 350);
    }

    // ── Advance to next question, possibly through a breather ──
    let advancing = false;
    function advance(fromQId) {
        if (advancing) return; // prevent double-advance (e.g. slider stop click + pointerup)
        advancing = true;
        const breather = BREATHERS[fromQId];
        const next = () => {
            currentIdx++;
            renderQuestion(currentIdx);
            // Keep guard up until the new question has fully rendered (render has 350 ms exit + paint)
            setTimeout(() => { advancing = false; }, 700);
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
        else if (q.type === 'scale') {
            const stops = Array.from(container.querySelectorAll('.qz-scale-stop'));
            const labels = Array.from(container.querySelectorAll('.qz-scale-label'));
            const fill = container.querySelector('#qzScaleFill');
            const thumb = container.querySelector('#qzScaleThumb');
            const track = container.querySelector('#qzScaleTrack');
            const count = stops.length;
            let hasInteracted = false;
            let wiggleTimer = null;
            let wiggleInterval = null;

            // Initial state: thumb at position 0, labels[0] active
            setVisual(0, true);

            function markInteracted() {
                if (hasInteracted) return;
                hasInteracted = true;
                if (thumb) {
                    thumb.classList.remove('qz-scale-thumb--hint', 'qz-scale-thumb--wiggle');
                    thumb.classList.add('qz-scale-thumb--touched');
                }
                if (wiggleTimer) { clearTimeout(wiggleTimer); wiggleTimer = null; }
                if (wiggleInterval) { clearInterval(wiggleInterval); wiggleInterval = null; }
            }

            function setVisual(i, instant) {
                const pct = count <= 1 ? 0 : (i / (count - 1)) * 100;
                if (fill) {
                    fill.style.width = pct + '%';
                    if (instant) fill.classList.add('qz-scale-fill--instant');
                    else fill.classList.remove('qz-scale-fill--instant');
                }
                if (thumb) {
                    thumb.style.left = pct + '%';
                    if (instant) thumb.classList.add('qz-scale-thumb--instant');
                    else thumb.classList.remove('qz-scale-thumb--instant');
                }
                stops.forEach((s, j) => s.classList.toggle('active', j <= i));
                stops.forEach((s, j) => s.classList.toggle('selected', j === i));
                labels.forEach((l, j) => l.classList.toggle('active', j === i));
            }

            function setContinuousVisual(ratio) {
                const pct = Math.max(0, Math.min(1, ratio)) * 100;
                if (fill) {
                    fill.classList.add('qz-scale-fill--instant');
                    fill.style.width = pct + '%';
                }
                if (thumb) {
                    thumb.classList.add('qz-scale-thumb--instant');
                    thumb.style.left = pct + '%';
                }
                const nearest = Math.round(ratio * (count - 1));
                stops.forEach((s, j) => s.classList.toggle('active', j <= nearest));
                stops.forEach((s, j) => s.classList.toggle('selected', j === nearest));
                labels.forEach((l, j) => l.classList.toggle('active', j === nearest));
            }

            function commit(i, autoAdvance) {
                setVisual(i, false);
                const opt = q.opts[i];
                const optLabel = typeof opt === 'object' && opt !== null ? opt.label : opt;
                answers[q.id] = optLabel;
                if (autoAdvance) setTimeout(() => advance(q.id), 550);
            }

            function ratioFromEvent(e) {
                const rect = track.getBoundingClientRect();
                const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                const x = clientX - rect.left;
                return Math.max(0, Math.min(1, x / rect.width));
            }

            // Label click: jump + commit + advance
            labels.forEach((l, i) => l.addEventListener('click', () => {
                markInteracted();
                commit(i, true);
            }));

            // Track: handles tap + drag
            if (track) {
                let dragging = false;
                let pendingRatio = null;
                let rafId = 0;
                function flushDrag() {
                    rafId = 0;
                    if (pendingRatio === null) return;
                    const r = pendingRatio;
                    pendingRatio = null;
                    setContinuousVisual(r);
                }

                track.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    dragging = true;
                    markInteracted();
                    if (thumb) thumb.classList.add('qz-scale-thumb--dragging');
                    try { track.setPointerCapture(e.pointerId); } catch(_) {}
                    setContinuousVisual(ratioFromEvent(e));
                });
                track.addEventListener('pointermove', (e) => {
                    if (!dragging) return;
                    pendingRatio = ratioFromEvent(e);
                    if (!rafId) rafId = requestAnimationFrame(flushDrag);
                });
                track.addEventListener('pointerup', (e) => {
                    if (!dragging) return;
                    dragging = false;
                    if (thumb) thumb.classList.remove('qz-scale-thumb--dragging');
                    try { track.releasePointerCapture(e.pointerId); } catch(_) {}
                    const ratio = ratioFromEvent(e);
                    const nearest = Math.round(ratio * (count - 1));
                    commit(nearest, true);
                });
                track.addEventListener('pointercancel', () => {
                    dragging = false;
                    if (thumb) thumb.classList.remove('qz-scale-thumb--dragging');
                });
            }

            // Wiggle after 1.2s if no interaction, then repeat every 4.5s
            wiggleTimer = setTimeout(() => {
                if (!hasInteracted && thumb) thumb.classList.add('qz-scale-thumb--wiggle');
            }, 1200);
            wiggleInterval = setInterval(() => {
                if (hasInteracted || !thumb) return;
                thumb.classList.remove('qz-scale-thumb--wiggle');
                void thumb.offsetWidth;
                thumb.classList.add('qz-scale-thumb--wiggle');
            }, 4500);
        }
        else if (q.type === 'bodytype') {
            container.querySelectorAll('.qz-bodytype').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.qz-bodytype').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    const idx = parseInt(btn.dataset.idx, 10);
                    answers[q.id] = q.opts[idx].label;
                    setTimeout(() => advance(q.id), 500);
                });
            });
        }
        else if (q.type === 'numcards') {
            container.querySelectorAll('.qz-numcard').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.qz-numcard').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    const idx = parseInt(btn.dataset.idx, 10);
                    answers[q.id] = q.opts[idx].value;
                    setTimeout(() => advance(q.id), 500);
                });
            });
        }
        else if (q.type === 'stepcards') {
            container.querySelectorAll('.qz-stepcard').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.qz-stepcard').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    const idx = parseInt(btn.dataset.idx, 10);
                    answers[q.id] = q.opts[idx].label;
                    setTimeout(() => advance(q.id), 500);
                });
            });
        }
    }

    // ── Quiz complete — loading screen ──
    function quizComplete() {
        const container = document.getElementById('qzQuestion');
        container.classList.remove('visible');
        container.classList.add('exit');

        const progFill = document.getElementById('qzProgressFill');
        if (progFill) progFill.style.width = '100%';

        try { sessionStorage.setItem('quizAnswers', JSON.stringify(answers)); } catch(e) {}

        setTimeout(() => {
            container.innerHTML = `
                <div class="qz-loading">
                    <p class="qz-loading-caption">Deine persönliche Auswertung</p>
                    <div class="qz-loading-ring">
                        <svg class="qz-ring-svg" viewBox="0 0 200 200" aria-hidden="true">
                            <defs>
                                <linearGradient id="qzRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#1f5d3a"/>
                                    <stop offset="55%" stop-color="#14482c"/>
                                    <stop offset="100%" stop-color="#e8530e"/>
                                </linearGradient>
                            </defs>
                            <circle class="qz-ring-track" cx="100" cy="100" r="86"/>
                            <circle class="qz-ring-progress" cx="100" cy="100" r="86" id="qzRingProgress"/>
                            <circle class="qz-ring-dot" cx="100" cy="14" r="7" id="qzRingDot"/>
                        </svg>
                        <div class="qz-ring-decor" aria-hidden="true"></div>
                        <div class="qz-ring-center">
                            <div class="qz-ring-percent"><span id="qzRingPercent">0</span><span class="qz-ring-sign">%</span></div>
                            <div class="qz-ring-label">Analyse läuft</div>
                        </div>
                    </div>
                    <div class="qz-load-phase" id="qzLoadPhase">
                        <h2 class="qz-load-title" id="qzLoadTitle">Muster werden erkannt</h2>
                        <p class="qz-load-sub" id="qzLoadSub">Deine Antworten werden auf wiederkehrende Blockaden geprüft.</p>
                    </div>
                    <div class="qz-load-steps">
                        <div class="qz-load-step" data-step="0">
                            <span class="qz-load-step-ico"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>
                            <span>Antwortmuster werden analysiert</span>
                        </div>
                        <div class="qz-load-step" data-step="1">
                            <span class="qz-load-step-ico"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>
                            <span>Dein Haupt-Abnehmblocker wird identifiziert</span>
                        </div>
                        <div class="qz-load-step" data-step="2">
                            <span class="qz-load-step-ico"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>
                            <span>Dein persönlicher Reset-Pfad wird gebaut</span>
                        </div>
                    </div>
                </div>
            `;
            container.classList.remove('exit');
            void container.offsetHeight;
            container.classList.add('visible');

            const R = 86;
            const CIRC = 2 * Math.PI * R;
            const ring = document.getElementById('qzRingProgress');
            const dot = document.getElementById('qzRingDot');
            const pctEl = document.getElementById('qzRingPercent');
            const titleEl = document.getElementById('qzLoadTitle');
            const subEl = document.getElementById('qzLoadSub');
            const phaseWrap = document.getElementById('qzLoadPhase');
            const stepEls = container.querySelectorAll('.qz-load-step');

            if (ring) {
                ring.setAttribute('stroke-dasharray', CIRC.toFixed(2));
                ring.setAttribute('stroke-dashoffset', CIRC.toFixed(2));
            }

            const phases = [
                { until: 34, title: 'Muster werden erkannt', sub: 'Deine Antworten werden auf wiederkehrende Blockaden geprueft.', step: 0 },
                { until: 72, title: 'Dein Blocker kristallisiert sich', sub: 'Wir gleichen deine Werte mit ueber 10.000 Auswertungen ab.', step: 1 },
                { until: 95, title: 'Dein Reset-Pfad entsteht', sub: 'Ein klarer, umsetzbarer Weg \u2014 individuell auf dich zugeschnitten.', step: 2 },
                { until: 100, title: 'Fast geschafft \u2014 du bist nah dran', sub: 'Der Weg raus aus der Blockade wird gleich sichtbar.', step: 2 }
            ];
            let currentPhase = -1;

            function setRing(p) {
                p = Math.max(0, Math.min(100, p));
                if (ring) ring.setAttribute('stroke-dashoffset', (CIRC * (1 - p/100)).toFixed(2));
                if (dot) {
                    const a = (p/100) * 2 * Math.PI - Math.PI/2;
                    dot.setAttribute('cx', (100 + R*Math.cos(a)).toFixed(2));
                    dot.setAttribute('cy', (100 + R*Math.sin(a)).toFixed(2));
                }
                if (pctEl) pctEl.textContent = Math.round(p);
            }
            function setPhase(p) {
                let idx = phases.findIndex(ph => p <= ph.until);
                if (idx === -1) idx = phases.length - 1;
                if (idx === currentPhase) return;
                currentPhase = idx;
                const ph = phases[idx];
                if (phaseWrap) phaseWrap.classList.add('swap');
                setTimeout(() => {
                    if (titleEl) titleEl.textContent = ph.title;
                    if (subEl) subEl.textContent = ph.sub;
                    if (phaseWrap) phaseWrap.classList.remove('swap');
                }, 280);
                stepEls.forEach((el, i) => {
                    el.classList.remove('active', 'done');
                    if (i < ph.step) el.classList.add('done');
                    else if (i === ph.step) el.classList.add('active');
                });
            }

            const DURATION = 5200;
            const startTime = performance.now();
            function tick(now) {
                const t = Math.min(1, (now - startTime) / DURATION);
                const eased = 1 - Math.pow(1 - t, 2.2);
                const p = eased * 100;
                setRing(p);
                setPhase(p);
                if (t < 1) requestAnimationFrame(tick);
                else {
                    setRing(100);
                    stepEls.forEach(el => { el.classList.remove('active'); el.classList.add('done'); });
                    if (phaseWrap) phaseWrap.classList.add('swap');
                    setTimeout(() => {
                        if (titleEl) titleEl.textContent = 'Deine Analyse ist bereit';
                        if (subEl) subEl.textContent = 'Gleich siehst du, was dich bisher blockiert hat.';
                        if (phaseWrap) phaseWrap.classList.remove('swap');
                    }, 280);
                }
            }
            requestAnimationFrame(tick);

            setTimeout(function() {
                window.location.href = 'result.html';
            }, 5800);
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
