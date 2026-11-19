/* WHAT'S IN THIS FILE (shared/dose-words.js)
   THE DISPENSARY'S DOSE WORDS, read by the Dispensary and the farm girl alike (Nov 19; Laynie: "need to double check
   that everything gets routed correctly, and that its accurately checking the phrases, even if we need to hyphenate").
   • loosen(): a phrase matches however it's written between its words: a space, a hyphen, an underscore, or nothin'
     at all. "Denial Serum", "denial-serum", "Denial_Serum" and "DenialSerum" are the same dose. Every phrase list the
     Dispensary reads goes through it (doses, gear words, parasites, parts, animals, hole sizes).
   • FARM_DOSES: the doses the farm girl keeps books for (dispensary/src/doses.js marks them farm: true; a test checks the
     two agree). On her farm, with her in the room, a needle or worn gear carryin' one of these is hers to read, and she
     calls your Dispensary to do the feelin'. Every other dose is your Dispensary's alone: for anybody runnin' one she
     leaves its words be, so nothin' happens twice (bot 10ur2-dispensary.js dispStrip).
*/
// between two words of a phrase: any run of spaces, hyphens and underscores, or none
export const SEP = "[\\s_\\-]*";
// a pattern with its gaps (" ", " ?", "[- ]", "[- ]?", "\s+", "\s*") opened up to SEP
export function loosen(re) {
  const src = re.source.replace(/\[- \]\??/g, SEP).replace(/\\s[+*?]/g, SEP).replace(/ \?/g, SEP).replace(/ /g, SEP);
  return new RegExp(src, re.flags);
}
// a plain phrase (a size name, a part word) as a pattern: any separator between its words, an apostrophe optional
export const phrase = (s) => String(s).toLowerCase().trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/['\u2019]/g, "['\u2019]?").replace(/[\s_-]+/g, SEP);
// the same pattern, findin' every match (for takin' a phrase out of a text)
export const everyOf = (re) => new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");

export const DOSE_WORDS = {
  denial: loosen(/\b(denial serum|edge serum|orgasm (?:block\w*|denial)|held at the edge)\b/),
  sedative: loosen(/\b(sedat\w*|tranquili[sz]\w*|drowsy|sleepy serum)\b/),
  needy: loosen(/\b(aphrodisiac|horny|lust serum|libido|needy nectar)\b/),
  hairtrigger: loosen(/\b(hair[- ]?trigger|sensiti[sz]er|oversensitiv\w*)\b/),
  bitterroot: loosen(/\b(bitterroot|ruin(?:ing|ed)? (?:serum|draught|tonic|shot))\b/),
  moo: loosen(/\b(moo (?:serum|shot|juice))\b/),
  hiccup: loosen(/\b(hiccup\w*)\b/),
  feather: loosen(/\b(featherlight|tickl\w* (?:serum|draught|potion|shot))\b/),
  heat: loosen(/\b(heat[- ]?inducer|heat mist|in heat serum)\b/),
  suggestible: loosen(/\b(obedien\w*|docile|compliance|suggest[ia]ble)\b/),
  letdown: loosen(/\b(let[- ]?down (?:tonic|serum|shot|draught|drops?|potion)|leaky (?:tits|teats|udders?) (?:tonic|serum|shot))\b/),
  fillout: loosen(/\b(fill[-_]?out\b|fill[- ]?out (?:serum|shot|tonic|potion|drops?)|swell(?:ing)? (?:serum|shot|tonic|potion|drops?))\b/),
  airhead: loosen(/\b((?:airhead|bimbo) (?:elixir|potion|serum|tonic|shot|juice|drops?))\b/),
  kit: loosen(/\bkit\s*:\s*[a-z0-9]/),
  tongue: loosen(/\b((?:animal|beast|puppy|pup|doggy|dog|kitty|kitten|cat|pony|horse|cow|bovine|bunny|rabbit|fox|vixen|goat|sheep|lamb|piggy|pig|wolf|dragon|rat)[- ]?tongue)\b/),
  babble: loosen(/\b(babble (?:brew|potion|tonic|shot|serum)|potty[- ]?mouth (?:potion|tonic|brew|serum))\b/),
  deepthroat: loosen(/\b(deep[- ]?throat (?:drops?|serum|spray|shot|tonic)|throat relax\w*|gag[- ]?reflex (?:blocker|drops?|serum))\b/),
  rut: loosen(/\b(rut(?:ting)? (?:serum|shot|tonic|potion|musk|drops?)|in[- ]rut (?:serum|shot|tonic))\b/),
  tender: loosen(/\b(tender (?:drops?|serum|balm|oil|shot|tonic)|tenderi[sz]er)\b/),
  honey: loosen(/\bhoney[- ]tongue\b/),
  golden: loosen(/\bgolden[- ]hour\b/),
  musk: loosen(/\b(blue[- ]ribbon[- ]musk|ribbon musk)\b/),
  echo: loosen(/\becho[- ]elixir\b/),
  growcup: loosen(/\b(udder|breast|tits?|boobs?|chest|cup) (growth|boost|enlarger)\b/),
  growass: loosen(/\b(ass|butt|booty|hips?) (growth|enlarger)\b/),
  growcock: loosen(/\b(cock|penis|dick|shaft) (growth|enlarger)\b/),
  growballs: loosen(/\b(balls?|testes|testicles?|nuts) (growth|enlarger)\b/),
  reducing: loosen(/\b(reducing (?:serum|shot|tonic|potion|drops?)|(?:udder|breast|boob|tits?|ass|butt|balls?|testicle|testes|penis|cock|dick) (?:reducer|reducing))\b/),   // (not "shrinking": that's LSCG's, and it shrinks all of you)
  weakknees: loosen(/\b(weak[- ]?knees?|jelly[- ]?legs?|kneel(?:ing)? (?:serum|draught|shot|tonic|potion))\b/),
  allfours: loosen(/\b(down[- ](?:girl|boy|pet) (?:serum|draught|shot|tonic|potion|drops?)|all[- ]fours (?:serum|draught|shot|tonic|potion|drops?))\b/),
  blinder: loosen(/\b(blind(?:er|ing)? drops?|dim(?:ming)? drops?|darkness drops?)\b/),
  cotton: loosen(/\b(cotton[- ]?ears?|deaf(?:ening)? (?:drops?|serum|draught|tonic)|muffl\w* drops?)\b/),
  tunnel: loosen(/\b(tunnel[- ]?vision(?: (?:drops?|serum|draught|tonic))?|blinker (?:drops?|serum))\b/),
  haze: loosen(/\b(haze (?:drops?|serum|potion|mist|tonic)|hazy (?:drops?|serum|potion)|daze (?:drops?|serum))\b/),
  statue: loosen(/\b(statue (?:serum|potion|tonic|draught|drops?|elixir|shot)|petrif(?:y|ying|ication) (?:serum|potion|tonic|draught|drops?|elixir|shot)|stone[- ]?skin|gilding (?:serum|potion|tonic|draught|drops?|elixir|shot))\b/),
  surecatch: loosen(/\b(sure[- ]?catch(?: (?:serum|shot|tonic|potion|drops?))?|every[- ]load[- ]takes?|womb[- ]?opener)\b/),
  dilator: loosen(/\b(nipple[- ](?:dilat\w*|stretch\w*|opener|spreader)|teat[- ](?:dilat\w*|opener|stretch\w*))\b/),
  balm: loosen(/\b(tightening (?:balm|cream|gel|serum|salve|tonic)|(?:nipple|pussy|ass|butt|hole|throat) (?:tightener|closer|balm)|virgin(?:ity)? (?:balm|tonic|cream|serum|salve))\b/),
  purge: loosen(/\b(purge (?:serum|shot)|antidote|detox|cleanser)\b/),
};
export const FARM_DOSES = ["denial", "sedative", "needy", "hairtrigger", "bitterroot", "moo", "hiccup", "feather", "heat", "suggestible", "growcup", "growass", "growcock", "growballs", "reducing", "purge"];
// which doses a text names (ids), in the book's order
export const dosesNamed = (text) => { const t = String(text || "").toLowerCase(); return Object.keys(DOSE_WORDS).filter((id) => DOSE_WORDS[id].test(t)); };
