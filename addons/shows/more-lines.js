/* WHAT'S IN THIS FILE (shows/more-lines.js)
   Lines for the show ring (Oct 15): steppin' in for each event, cues done or missed, the race finish, best in show and
   wearin' a ribbon, each fitted to the animal (their kind's gait and noise, their body by tag, their collar or harness
   if they wear one). %name% them · %a% what they are · %call% their noise · %gait% how their kind moves · %time% seconds
*/
// how each kind moves, for the race and the ring
export const GAIT = {
  cow: ["lumbers", "trundles", "barrels"], bull: ["charges", "thunders", "barrels"], pony: ["gallops", "thunders", "prances"], horse: ["gallops", "thunders", "canters"],
  deer: ["bounds", "springs", "darts"], pig: ["trots", "scurries", "hurtles"], pup: ["scrambles", "bounds", "tears"], dog: ["bounds", "tears", "races"],
  kitt: ["streaks", "darts", "pounces"], cat: ["streaks", "darts", "slinks"], goblin: ["scuttles", "scrambles", "cackles"], bunny: ["hops", "bounds", "zigzags"],
  rabbit: ["hops", "bounds", "zigzags"], fox: ["darts", "streaks", "bounds"], wolf: ["lopes", "races", "tears"], goat: ["clatters", "bounds", "skitters"],
  sheep: ["trots", "bundles", "bounces"], default: ["runs", "dashes", "races"],
};
export const ENTER = {
  udder: [
    "{t}🎀 %name% steps into the ring for udder judgin', heavy and swingin', and gives the judges a good long look.",
    "{t}🎀 %name% walks into the ring slow and proud, udder full and tight for the judges.",
    "{nt}🎀 %name% steps into the ring for udder judgin', chest out and nipples stiff, ready to show what they give.",
    "🎀 %name% is led into the ring for udder judgin' and stands square, waitin' to be felt over.",
  ],
  breeding: [
    "🎀 %name% steps into the ring for the breedin' stand, and the stud book comes out.",
    "🎀 %name% struts into the breedin' ring like they've got a season's worth to show for it.",
    "{v}🎀 %name% takes the breedin' stand, tail up and proud.",
    "{c}🎀 %name% takes the breedin' stand, every inch a stud and showin' it.",
  ],
  race: [
    "🎀 %name% paws the ground at the start line, ready to go.",
    "🎀 %name% lines up for the cart race, stampin' and snortin' and rarin' to go.",
    "🎀 %name% shakes out their legs at the start and eyes the course.",
  ],
  obedience: [
    "🎀 %name% trots into the ring for the obedience trial and sits pretty for the judges.",
    "🎀 %name% steps into the obedience ring, ears pricked, watchin' the judge's hands.",
    "🎀 %name% comes into the ring and waits for their first cue, all eyes and good manners.",
  ],
};
export const CUE_OK = [
  "🎀 %name% does it perfectly on cue. The judge marks the card.",
  "🎀 %name% nails the cue, quick and neat, and the crowd claps.",
  "🎀 Right on cue! %name% gets a nod from the judge and a pat on the head.",
  "🎀 %name% does just what was asked, first time. Good %a%.",
  "🎀 Perfect. %name% gives a pleased little %call% and the judge marks it down.",
];
export const CUE_MISS = [
  "🎀 %name% misses the cue. The judge shakes their head and marks it down.",
  "🎀 %name% gets distracted by somethin' in the straw and misses it entirely.",
  "🎀 Not quite. %name% gets halfway there and loses their nerve. The judge marks it down.",
  "🎀 %name% looks at the judge, looks at the crowd, and does the wrong thing with great confidence.",
];
export const FINISH = [
  "🏁 %name% %gait% across the finish line in %time% seconds!",
  "🏁 Over the line! %name% %gait% home in %time% seconds, flanks heavin'.",
  "🏁 %name% %gait% through the last checkpoint and over the line: %time% seconds.",
  "🏁 Here comes %name%, flat out for the line, %time% seconds on the clock!",
];
export const BEST = [
  "🎀 The judge pins a blue ribbon on %name%. Best in show!",
  "🎀 Blue ribbon for %name%, and a round of applause from the rail. Best in show!",
  "🎀 The judge steps back, looks %name% over once more, and pins the blue on them. Best in show!",
];
export const BEST_COLLAR = [
  "🎀 The judge pins a blue ribbon to %name%'s collar. Best in show!",
  "🎀 A blue ribbon goes on %name%'s collar, and the judge gives it a proud little tug. Best in show!",
];
export const BEST_HARNESS = [
  "🎀 The judge buckles a blue rosette to %name%'s harness. Best in show!",
];
export const WEAR = [
  "🎀 %name% wears their %ribbon% proudly.",
  "🎀 %name% shows off their %ribbon% to anybody who'll look.",
  "🎀 %name%'s %ribbon% catches the light as they come in.",
];
export const WEAR_COLLAR = [
  "🎀 %name% has their %ribbon% pinned to their collar, and it bobs when they walk.",
  "🎀 There's a %ribbon% on %name%'s collar today, and they keep checkin' it's still there.",
];
