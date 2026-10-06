// The farm's side of BC+ contracts: build them, check them, and the hidden messages that carry them.
// Everything here mirrors BC+ itself (src/modules/Contracts.ts, src/system/contracts/ContractTypes.ts,
// Rules.setRuleSetting). The rule list comes from BC+'s own source: shared/bcplus-rules.json
// (re-make it with `node tools/bcplus-catalog.mjs` when BC+ updates).
//
// Why it has to be exact: when somebody signs, BC+ quietly SKIPS any setting it doesn't like and
// REFUSES a contract with an unknown rule. So nothing leaves the farm unless checkContract() says it's clean.
import CATALOG from "./bcplus-rules.json";

export const BCPLUS_VERSION = CATALOG.bcplusVersion;
export const RULES = new Map(CATALOG.rules.map((r) => [r.id, r]));

// BC+'s own limits (ContractTypes.ts)
export const LIMITS = { MAX_RULES: 30, MAX_ACTIVE: 3, MAX_DURATION_MIN: 43_200, MAX_SETTINGS: 32, TITLE: 60, TERMS: 1000 };

// The farm never puts these in a contract: a player must always be able to safeword, reach the farm and speak OOC.
export const NEVER = {
  "settings.safeword": "turns off their safeword",
  "social.forbidBeeps": "stops them beepin' the farm for help",
  "social.forbidBeepMessages": "stops them beepin' the farm for help",
  "speech.forbidOOC": "stops them speakin' out of character",
  "speech.gaggedOOC": "stops them speakin' out of character",
};

export const DURATIONS = [
  { key: "1h", label: "1 hour", min: 60, words: ["1h", "hour", "1 hour", "an hour"] },
  { key: "12h", label: "12 hours", min: 720, words: ["12h", "12 hours", "half a day", "a night", "night", "overnight"] },
  { key: "1d", label: "1 day", min: 1_440, words: ["1d", "day", "1 day", "a day"] },
  { key: "1w", label: "1 week", min: 10_080, words: ["1w", "week", "1 week", "a week"] },
  { key: "2w", label: "2 weeks", min: 20_160, words: ["2w", "2 weeks", "two weeks", "fortnight"] },
  { key: "1m", label: "1 month", min: 43_200, words: ["1m", "month", "1 month", "a month", "30 days", "a season", "season"] },
  { key: "perm", label: "Permanent", min: 0, words: ["perm", "permanent", "forever", "for good", "until released"] },
];
// a whole word or phrase inside the text ("fortnight" must not count as "night")
const hasWords = (t, w) => new RegExp("(^|[^a-z0-9])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^a-z0-9])").test(t);
export function durationFrom(text) {
  const t = String(text || "").trim().toLowerCase();
  return DURATIONS.find((d) => d.key === t || d.words.includes(t) || d.label.toLowerCase() === t)
    || DURATIONS.find((d) => d.words.some((w) => w.length > 3 && hasWords(t, w))) || null;
}

export const DEPTHS = [
  { key: "fun", label: "Fun", words: ["fun", "playful", "light", "silly"] },
  { key: "deep", label: "Deep", words: ["deep", "properly kept", "kept"] },
  { key: "nhl", label: "No human left", words: ["nhl", "no human left", "all animal", "total"] },
];
export function depthFrom(text) {
  const t = String(text || "").trim().toLowerCase();
  return DEPTHS.find((d) => d.key === t || d.words.includes(t)) || DEPTHS.find((d) => d.words.some((w) => hasWords(t, w))) || null;
}

// farm species → BC+ pet sound set (the rest use Custom with their own sounds)
const ANIMALS = { cow: "Cow", bull: "Cow", pony: "Pony", horse: "Pony", pup: "Dog", dog: "Dog", kitt: "Cat", cat: "Cat",
                  bunny: "Bunny", rabbit: "Bunny", fox: "Fox", wolf: "Wolf", mouse: "Mouse" };
const SOUNDS = { pig: ["oink", "snort", "squee", "grunt"], goat: ["maa", "meh-eh", "bleat"], sheep: ["baa", "baaah", "meh"],
                 deer: ["bleat", "snort", "huff"], goblin: ["heh", "gnuk", "skree", "hrrk"] };
export function petFor(species) {
  const s = String(species || "").toLowerCase();
  if (ANIMALS[s]) return { animal: ANIMALS[s], sounds: [] };
  return { animal: "Custom", sounds: SOUNDS[s] || ["moo"] };
}
const SOUND_WORD = { Cow: "Moo", Pony: "Neigh", Dog: "Woof", Cat: "Mew", Bunny: "Eep", Fox: "Yip", Wolf: "Awoo", Mouse: "Squeak" };

/* ── checking ── */

// why this value won't stick in BC+, or "" when it's fine (Rules.setRuleSetting + ContractTypes sanitize)
export function settingProblem(setting, value) {
  switch (setting.type) {
    case "checkbox": return typeof value === "boolean" ? "" : "needs on or off";
    case "option": return typeof value === "string" && setting.options.includes(value) ? "" : "must be one of: " + setting.options.join(", ");
    case "text": {
      const max = Math.min(setting.maxChars ?? 256, 1000);
      return typeof value === "string" && value.length <= max ? "" : "must be text, " + max + " characters at most";
    }
    case "members":
      return Array.isArray(value) && value.length <= 100 && value.every((m) => Number.isInteger(m) && m >= 0) ? "" : "must be a list of member numbers";
    case "stringList": {
      const n = Math.min(setting.maxEntries ?? 50, 100), len = Math.min(setting.maxChars ?? 200, 200);
      return Array.isArray(value) && value.length <= n && value.every((s) => typeof s === "string" && s.length <= len)
        ? "" : "must be a list of up to " + n + " entries, " + len + " characters each";
    }
    default: return "unknown setting type";
  }
}

// a full spec for one rule: every setting filled in (BC+ defaults, then yours)
export function makeSpec(ruleId, settings = {}, opts = {}) {
  const def = RULES.get(ruleId);
  const base = {};
  for (const s of def ? def.settings : []) base[s.name] = Array.isArray(s.default) ? s.default.slice() : s.default;
  const spec = { active: true, enforce: opts.enforce !== false, log: opts.log !== false, announce: opts.announce !== false,
                 settings: Object.assign(base, settings) };
  if (opts.conditions) { spec.useGlobal = false; spec.conditions = opts.conditions; }
  else spec.useGlobal = false;     // the contract decides, not the signer's global conditions
  return spec;
}

// every reason BC+ would refuse or quietly change this contract (empty list = clean)
export function checkContract(c) {
  const out = [];
  if (!c || typeof c !== "object") return ["not a contract"];
  if (typeof c.title !== "string" || !c.title.trim()) out.push("it needs a title");
  else if (c.title.trim().length > LIMITS.TITLE) out.push("the title is longer than " + LIMITS.TITLE + " characters");
  if (typeof c.terms === "string" && c.terms.length > LIMITS.TERMS) out.push("the terms are longer than " + LIMITS.TERMS + " characters");
  if (!Number.isInteger(c.durationMin) || c.durationMin < 0 || c.durationMin > LIMITS.MAX_DURATION_MIN) out.push("the length must be up to 30 days, or permanent");
  if (c.policy !== "author" && c.policy !== "either") out.push("who may end it must be the farm or either side");
  const ids = Object.keys(c.rules || {});
  const active = ids.filter((id) => c.rules[id] && c.rules[id].active);
  if (!active.length) out.push("it has no rules switched on");
  if (ids.length > LIMITS.MAX_RULES) out.push("BC+ takes " + LIMITS.MAX_RULES + " rules at most");
  for (const id of ids) {
    const def = RULES.get(id), spec = c.rules[id];
    if (!def) { out.push(id + ": BC+ " + BCPLUS_VERSION + " has no rule by that name"); continue; }
    if (NEVER[id] && spec.active) { out.push(def.name + ": the farm never uses this one (it " + NEVER[id] + ")"); continue; }
    const names = Object.keys(spec.settings || {});
    if (names.length > LIMITS.MAX_SETTINGS) out.push(def.name + ": too many settings");
    for (const name of names) {
      const s = def.settings.find((x) => x.name === name);
      if (!s) { out.push(def.name + ": BC+ has no setting called " + name); continue; }
      const p = settingProblem(s, spec.settings[name]);
      if (p) out.push(def.name + " · " + (s.label || name).replace(/:$/, "") + ": " + p);
    }
  }
  return out;
}

/* ── a contract made for one person: placeholders in any setting, title or terms ──
   {name} their name (the short part: "Vicky" for "BnB Cow Vicky") · {species} their animal · {Species} the same,
   capitalised · {pet}/{Pet} their animal, or "pet" if they haven't got one. "BnB {Species} {name}" → "BnB Cow Vicky". */
export const DEFAULT_NICKNAME = "BnB {Species} {name}";
export function fillWho(text, who) {
  const sp = String((who && who.species) || "").trim(), cap = (s) => s.replace(/^./, (x) => x.toUpperCase());
  return String(text)
    .replace(/\{name\}/gi, (who && who.name) || "")
    .replace(/\{Species\}/g, cap(sp || "pet")).replace(/\{species\}/g, sp || "pet")
    .replace(/\{Pet\}/g, cap(sp || "pet")).replace(/\{pet\}/g, sp || "pet")
    .replace(/\s+/g, " ").trim();
}
// every text setting in a set of rules, filled in for this person (nicknames, greetings, farewells…)
export function fillRules(rules, who) {
  for (const spec of Object.values(rules || {})) {
    const s = spec && spec.settings; if (!s) continue;
    for (const [k, v] of Object.entries(s)) {
      if (typeof v === "string" && /\{\w+\}/.test(v)) s[k] = fillWho(v, who);
      else if (Array.isArray(v) && v.some((x) => typeof x === "string" && /\{\w+\}/.test(x))) s[k] = v.map((x) => typeof x === "string" ? fillWho(x, who) : x);
    }
    // BC+ nicknames are 20 characters at most: a long one drops to just their name
    if (typeof s.nickname === "string" && s.nickname.length > 20) s.nickname = (who && who.name ? who.name : s.nickname).slice(0, 20);
  }
  return rules;
}

/* ── the farm's three ready-made levels ── */

// who: { name, species }, farm: { bot, staff: [member numbers], rooms: ["B&B Farm", …] }
export function templateRules(depth, who, farm) {
  const pet = petFor(who.species), word = SOUND_WORD[pet.animal] || (pet.sounds[0] || "Moo").replace(/^./, (x) => x.toUpperCase());
  const kind = String(who.species || "").replace(/^./, (x) => x.toUpperCase());
  // the farm's nickname style ("BnB Cow Vicky"); farm.nickname changes it, and a long one drops to just their name
  let nick = fillWho(farm.nickname || DEFAULT_NICKNAME, who);
  if (nick.length > 20) nick = String(who.name || nick).slice(0, 20);
  const summoners = [farm.bot].concat(farm.staff || []).filter((m) => Number.isInteger(m)).slice(0, 100);
  const speech = (mode, intensity) => makeSpec("pet.speech", { animal: pet.animal, sounds: pet.sounds, mode, intensity });
  const rules = {};
  if (depth === "fun") {
    rules["pet.speech"] = speech("Sprinkle", "Low");
    rules["social.greetRoom"] = makeSpec("social.greetRoom", { greeting: word + "! Mornin', y'all." });
    rules["social.farewell"] = makeSpec("social.farewell", { farewell: word + "! Back to the barn with me." });
    rules["control.nickname"] = makeSpec("control.nickname", { nickname: nick });
  } else if (depth === "deep") {
    rules["pet.speech"] = speech("Replace", "Medium");
    rules["pet.hearing"] = makeSpec("pet.hearing", { animal: pet.animal, strength: "Light" });
    rules["body.controlOrgasms"] = makeSpec("body.controlOrgasms", { mode: "Edged" });
    rules["control.leash"] = makeSpec("control.leash", { minimumRole: "Whitelist" });
    rules["other.summon"] = makeSpec("other.summon", { allowedMembers: summoners, summonText: "summon", delay: "15" });
    rules["control.nickname"] = makeSpec("control.nickname", { nickname: nick });
    rules["social.greetRoom"] = makeSpec("social.greetRoom", { greeting: word + "! Mornin', y'all." });
  } else if (depth === "nhl") {
    rules["pet.speech"] = speech("Replace", "Max");
    rules["pet.hearing"] = makeSpec("pet.hearing", { animal: pet.animal, strength: "Heavy" });
    rules["body.forcedPosition"] = makeSpec("body.forcedPosition", { fullPose: "All fours" });
    rules["body.secretOrgasms"] = makeSpec("body.secretOrgasms");
    rules["body.controlOrgasms"] = makeSpec("body.controlOrgasms", { mode: "Edged" });
    rules["chat.forbidLeaving"] = makeSpec("chat.forbidLeaving");
    if ((farm.rooms || []).length) rules["rooms.entry"] = makeSpec("rooms.entry", { allowedRooms: farm.rooms.slice(0, 50) });
    rules["other.summon"] = makeSpec("other.summon", { allowedMembers: summoners, summonText: "summon", delay: "10" });
    rules["control.leash"] = makeSpec("control.leash", { minimumRole: "Whitelist" });
    rules["control.nickname"] = makeSpec("control.nickname", { nickname: nick });
    rules["control.profile"] = makeSpec("control.profile");
    rules["protect.hardcore"] = makeSpec("protect.hardcore");
  }
  return rules;
}

// a whole contract, ready to check and send
export function makeContract({ title, terms = "", duration, depth, policy, rules, who, farm }) {
  const d = typeof duration === "string" ? durationFrom(duration) : duration;
  return {
    title: String(title || "B&B Farm contract").trim().slice(0, LIMITS.TITLE),
    terms: String(terms || "").slice(0, LIMITS.TERMS),
    durationMin: d ? d.min : 0,
    policy: policy || (depth === "fun" ? "either" : "author"),
    rules: rules || templateRules(depth, who, farm),
  };
}

/* ── the hidden messages (BC+ reads Content "BCP") ── */

export const BCP = "BCP";
export const offerMsg = (contract, target, authorName) =>
  ({ Content: BCP, Type: "Hidden", Target: target, Dictionary: { message: "ContractOffer", payload: Object.assign({ author: 0, authorName: authorName || "B&B Farm" }, contract) } });
export const queryMsg = (target) => ({ Content: BCP, Type: "Hidden", Target: target, Dictionary: { message: "ContractQuery" } });
export const releaseMsg = (target, id) => ({ Content: BCP, Type: "Hidden", Target: target, Dictionary: { message: "ContractCommand", action: "release", id } });
// { from, message, ... } for a BC+ hidden message, or null
export function readBCP(data) {
  if (!data || data.Type !== "Hidden" || data.Content !== BCP) return null;
  const d = data.Dictionary;
  if (!d || typeof d !== "object" || Array.isArray(d) || typeof d.message !== "string") return null;
  return Object.assign({}, d, { from: data.Sender });
}
// a paste-able BC+ code (needs the game's LZString)
export function offerCode(contract, author, authorName, LZ) {
  const payload = Object.assign({ author, authorName }, contract);
  return "BCP1:contract:" + LZ.compressToBase64(JSON.stringify(payload));
}
