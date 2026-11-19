/* WHAT'S IN THIS FILE (lines-carry.js)
   The lines for carryin' anywhere (carry.js): bein' bred and showin' it, cravin', heat, labour and the birth, layin',
   back to back, the Quickening Draught and the Breeder's Scan. %t is the one carryin', %S the sire or sires, %c how
   many, %kids "3 calves" or "a calf", %one and %many their young's words, %e how many eggs, %b who's there (the
   midwife, the scanner), %a how much seed. Lines that only you see say "you"; the room's say %t.
   In story order: just caught, showin', heavy, the kicks, the cravings; heat; the waters, the labour, the birth; the
   eggs; open again after; the draught; the scan.
*/
import { LINES } from "./lines.js";

LINES.carry = {
  // ── carryin' (mostly only you; now and then the room) ──
  early_mine: [
    "There's a warm, secret fullness low in your belly. %S young are in there, takin' hold.",
    "Your tits feel heavy and tender today, achin' for no reason at all. You know the reason.",
    "You catch yourself restin' a hand on your belly. Bred. Really, properly bred.",
    "Every time you move you feel it: that soft, full weight that says you took.",
  ],
  show_mine: [
    "Your belly's round now, firm and warm under your hand. Everybody can see what you are.",
    "You're showin', and you can't stop touchin' it. %c in there, all %S.",
    "Your clothes sit tight over your swellin' belly. You're a breeder, and it shows.",
    "Your tits are swollen and achin', fillin' up for what's comin'.",
  ],
  heavy_mine: [
    "Your belly's heavy and huge, stretched tight with %S %many. Every step's a slow, swayin' waddle.",
    "Somethin' shifts and kicks deep inside you, then again. They're gettin' big in there.",
    "You're so full of them you can hardly bend. Your belly sits heavy and round in front of you, proud.",
    "Milk beads at your nipples all by itself now. Your body's ready for them.",
  ],
  room_show: [
    "%t rests both hands on their round, swellin' belly. Bred, and showin' it off.",
    "%t's belly's grown round and firm. Somebody's been well and truly bred.",
    "%t shifts their weight with a little sigh, one hand cupped under their full belly.",
  ],
  room_heavy: [
    "%t waddles a few slow steps, belly huge and heavy in front of them, and has to stop and catch their breath.",
    "%t's belly gives a visible kick. They gasp, then smile and rub the spot.",
    "%t is heavy with young, belly stretched tight and round, tits swollen and leakin'.",
    "%t lowers themselves down slow and careful, cradlin' a belly that's almost ready to burst.",
  ],
  crave: [
    "You're achin' for seed. Not just a little: you'd drink a load right now, from anybody who'd give it.",
    "Carryin's made you hungry, and not for food. You want a thick load down your throat or deep in you.",
    "Your belly's full and your mouth's empty, and all you can think about is cock.",
  ],
  // ── heat, anywhere ──
  heat_start: [
    "🔥 Heat hits %t like a wave: flushed, slick and achin', and they can't keep still.",
    "🔥 %t comes into heat right where they are, cheeks burnin', thighs pressed tight, needy all over.",
    "🔥 %t's in heat. You can see it on them, and anybody close enough can smell it.",
  ],
  heat_scent: [
    "You catch the scent of %b's heat, sweet and heavy, and your cock throbs with it.",
    "%b's in heat, and you can smell it from here. Your balls ache to empty into them.",
    "There's heat in the air: %b's. It goes straight to your cock.",
  ],
  // ── labour, wherever you are (the room sees it) ──
  water: [
    "%t gasps and grabs for somethin' to hold: their waters have broken, right here. %S %many are on their way.",
    "A warm gush runs down %t's thighs, and their belly tightens hard. It's time.",
    "%t doubles over with a low moan as the first real wave rolls through their swollen belly. Their %many are comin'.",
  ],
  early: [
    "Another wave rolls through %t's belly. They rock their hips and breathe through it, slow.",
    "%t's belly tightens and holds, then eases. It's only startin'.",
    "%t pants, both hands on their belly, as it squeezes hard and lets go.",
  ],
  strong: [
    "The waves come close and strong now. %t's on their knees, moanin' with every one.",
    "%t bears down with a long, deep groan, belly drawn hard and tight. They're pushin' now.",
    "%t can't hold back the noises: every push is a deep, needy groan.",
  ],
  close: [
    "%t's almost there, red-faced and shakin', pushin' with everything they've got.",
    "One more, %t. They grit their teeth and push, and push.",
    "%t cries out: the first one's crownin'.",
  ],
  midwife: [
    "%b kneels beside %t and rubs their belly through the next wave, slow and firm.",
    "%b holds %t's hand and talks them through it, steady and sweet.",
    "%b's hands work low on %t's belly, easin' the next one along.",
  ],
  birth: [
    "With one last long push, %t delivers %kids, %S. Spent, glowin' and well bred, they gather them close.",
    "%t's labour ends in a rush: %kids, slick and squirmin', %S every one. They're a mother again.",
    "There they are: %kids. %t sinks back, belly soft and empty, tits heavy with milk, and laughs breathless.",
  ],
  birth_midwife: [
    "With %b's hands to help, %t delivers %kids, %S. %b gathers them up and lays them on %t's chest.",
    "%t pushes the last one out into %b's waitin' hands: %kids, %S. What a good breeder.",
  ],
  // ── layin' eggs ──
  lay_start: [
    "%t's belly rolls and shifts. The eggs in them want out, and they want out now.",
    "%t squirms, belly heavy and lumpy with eggs, and squats down low.",
  ],
  lay_push: [
    "%t strains and moans, and a slick, warm egg slides out of them.",
    "Another egg crowns and pops free with a wet sound. %t shudders all over.",
    "%t bears down, gasps, and pushes out another egg, round and glistenin'.",
  ],
  lay_done: [
    "%t pushes the last of them out: %e eggs, warm and slick, in a little pile. Their belly's soft and empty again.",
    "With a long shiver %t lays the last one. %e eggs, every one of them perfect.",
  ],
  // ── back to back: open again after a birth ──
  open_mine: [
    "You're still open and achin' from the birth, and already you want filled again.",
    "Your womb's wide open and hungry. The next load in you could take, easy.",
  ],
  // ── the Quickening Draught ──
  quicken: [
    "The draught goes down warm, and %t's belly swells a little rounder right away. Their %many are growin' faster.",
    "%t gasps as their belly tightens and grows, hurried along. They're closer to due now.",
    "Warmth floods %t's belly, and it swells, heavier and rounder by the minute.",
  ],
  quicken_none: [
    "The draught goes down warm and settles low, achin'. There's nothin' in %t to hurry along. Yet.",
  ],
  // ── the Breeder's Scan ──
  scan_preg: [
    "%b runs the scanner slow over %t's belly, and it lights up: %c in there, %S, %d.",
    "The scan shows it plain: %t's carryin' %c, all %S, and %d.",
    "%b's scan glides across %t's swollen belly. %c heartbeats, %S, %d.",
  ],
  scan_eggs: [
    "...and a clutch of %e eggs packed in there too, nearly ready.",
  ],
  scan_seed: [
    "%b runs the scanner over %t's belly: nothin' caught yet, but %a of seed sloshin' in there, waitin' to take.",
    "Empty for now, the scan says. Just %a of seed in %t, and a womb hungry for it.",
  ],
  scan_empty: [
    "%b runs the scanner over %t's belly. Nothin' in there. Somebody should fix that.",
    "The scan comes up empty: %t's not carryin'. Not yet.",
  ],
  scan_ripe: [
    "...and they're ripe right now: a load today would take twice as easy.",
  ],
};
