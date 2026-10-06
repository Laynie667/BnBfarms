// ==UserScript==
// @name         BnB Farm — Farmhand Bot
// @namespace    bnbfarm
// @version      0.15.5
// @updateURL    https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-bot.user.js
// @downloadURL  https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-bot.user.js
// @homepageURL  https://github.com/Laynie667/BnBfarms#install
// @description  B&B Farm: beeps, keys, ledger, roster, herds, summoning, anti-idle
// @author       Laynie & Alexia
// @match        *://*.bondageprojects.elementfx.com/*
// @match        *://bondageprojects.elementfx.com/*
// @match        *://*.bondage-europe.com/*
// @match        *://bondage-europe.com/*
// @match        *://*.bondageprojects.com/*
// @match        *://bondageprojects.com/*
// @match        *://*.bondage-asia.com/*
// @match        *://bondage-asia.com/*
// @match        *://*.bondageeurope.com/*
// @match        *://bondageeurope.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(() => {
  // shared/protocol.js
  var FARM_MSG = "FarmhandMsg";
  var PROTOCOL = 2;
  function makeMsg(type, data = {}, target) {
    const m = { Content: FARM_MSG, Type: "Hidden", Dictionary: { v: PROTOCOL, type, ...data } };
    if (target) m.Target = target;
    return m;
  }
  function readMsg(data) {
    if (!data || data.Type !== "Hidden" || data.Content !== FARM_MSG) return null;
    const d = data.Dictionary;
    if (!d || typeof d !== "object" || Array.isArray(d) || typeof d.type !== "string") return null;
    return { ...d, from: data.Sender };
  }

  // shared/bcplus-rules.json
  var bcplus_rules_default = {
    bcplusVersion: "0.14.0",
    made: "2026-10-03",
    rules: [
      {
        id: "speech.forbidWhisper",
        name: "Forbid whispering",
        category: "Speech",
        description: "The player cannot send whispers to other people in the room.",
        bcxEquivalent: "speech_restrict_whisper_send",
        settings: [
          {
            type: "checkbox",
            name: "allowLover",
            label: "Still allow whispering to Lover-ranked roles and above",
            default: true
          }
        ]
      },
      {
        id: "speech.forbidOOC",
        name: "Forbid OOC messages",
        category: "Speech",
        description: "The player cannot send messages containing out-of-character (parenthesized) text. Whispers are not affected.",
        bcxEquivalent: "speech_block_ooc",
        settings: []
      },
      {
        id: "speech.gaggedOOC",
        name: "Block OOC while gagged",
        category: "Speech",
        description: "The player cannot use out-of-character (parenthesized) text while gagged - a gag should not be so easy to talk around.",
        bcxEquivalent: "speech_block_gagged_ooc",
        settings: []
      },
      {
        id: "speech.forbiddenWords",
        name: "Forbidden words",
        category: "Speech",
        description: "The player cannot use the configured words in chat or whispers.",
        bcxEquivalent: "speech_ban_words",
        settings: [
          {
            type: "stringList",
            name: "words",
            label: "Forbidden words:",
            default: [],
            maxChars: 100,
            entryLabel: "word"
          },
          {
            type: "checkbox",
            name: "includeOOC",
            label: "Also forbid the words in OOC (parentheses)",
            default: false
          }
        ]
      },
      {
        id: "speech.mandatoryWords",
        name: "Mandatory words",
        category: "Speech",
        description: 'Every chat message must contain at least one of the configured words (e.g. "Miss, please, humbly"). Purely out-of-character messages are exempt.',
        bcxEquivalent: "speech_mandatory_words",
        settings: [
          {
            type: "stringList",
            name: "words",
            label: "Required words:",
            default: [],
            maxChars: 100,
            entryLabel: "word"
          },
          {
            type: "checkbox",
            name: "includeWhispers",
            label: "Also apply to whispers",
            default: false
          }
        ]
      },
      {
        id: "speech.minimumWords",
        name: "Require detailed speech",
        category: "Speech",
        description: "Every chat message must contain at least the configured number of words - doll talk in reverse, for detailed roleplay. Purely out-of-character messages and emotes are exempt.",
        settings: [
          {
            type: "option",
            name: "minWords",
            label: "Minimum words per message:",
            options: [
              "2",
              "3",
              "4",
              "5",
              "6",
              "8",
              "10",
              "15",
              "20"
            ],
            default: "5"
          },
          {
            type: "checkbox",
            name: "includeWhispers",
            label: "Also apply to whispers",
            default: false
          }
        ]
      },
      {
        id: "speech.restrainedSpeech",
        name: "Restrained speech",
        category: "Speech",
        description: "The player can only say the configured phrases, nothing else (case and end punctuation are ignored). Purely out-of-character messages are exempt.",
        bcxEquivalent: "speech_restrained_speech",
        settings: [
          {
            type: "stringList",
            name: "phrases",
            label: "Allowed phrases:",
            default: [
              "Yes Miss",
              "No Miss",
              "Thank you Miss",
              "Please Miss"
            ],
            maxChars: 120,
            entryLabel: "phrase"
          }
        ]
      },
      {
        id: "speech.dollTalk",
        name: "Doll talk",
        category: "Speech",
        description: "The player can only speak in short, simple phrases: limited words per message and letters per word. Out-of-character text is not affected.",
        bcxEquivalent: "speech_doll_talk",
        settings: [
          {
            type: "option",
            name: "maxWords",
            label: "Maximum words per message",
            options: [
              "3",
              "5",
              "7",
              "10"
            ],
            default: "5"
          },
          {
            type: "option",
            name: "maxWordLength",
            label: "Maximum letters per word",
            options: [
              "4",
              "5",
              "6",
              "7",
              "8"
            ],
            default: "6"
          }
        ]
      },
      {
        id: "speech.wordReplace",
        name: "Replace spoken words",
        category: "Speech",
        description: 'Configured words are replaced in everything the player says. Each entry is word:replacement (e.g. "i:this doll"). Out-of-character text is not affected.',
        bcxEquivalent: "speech_replace_spoken_words",
        settings: [
          {
            type: "stringList",
            name: "replacements",
            label: "Replacements:",
            default: [],
            maxChars: 120,
            entryLabel: "word:replacement"
          }
        ]
      },
      {
        id: "speech.faltering",
        name: "Enforce faltering speech",
        category: "Speech",
        description: "The player's spoken messages come out st-st-stuttering. Out-of-character text is not affected.",
        bcxEquivalent: "speech_alter_faltering",
        settings: []
      },
      {
        id: "speech.forbidShouting",
        name: "Forbid shouting",
        category: "Speech",
        description: "All-caps chat messages are lowered to normal speech when enforced.",
        settings: []
      },
      {
        id: "speech.forbidEmotes",
        name: "Forbid emotes",
        category: "Speech",
        description: "The player cannot send emote messages to the room.",
        bcxEquivalent: "speech_forbid_emotes",
        settings: []
      },
      {
        id: "social.forbidBeepMessages",
        name: "Forbid beep messages",
        category: "Social",
        description: "The player cannot send beeps with message content to friends.",
        bcxEquivalent: "speech_restrict_beep_send",
        settings: [
          {
            type: "checkbox",
            name: "allowPlainBeeps",
            label: "Still allow plain beeps without a message",
            default: true
          }
        ]
      },
      {
        id: "social.forbidBeeps",
        name: "Forbid sending beeps",
        category: "Social",
        description: "The player cannot send any beeps at all, with or without a message. Hidden mod-to-mod beeps (leashes, summons, BCX) are unaffected, and configured members can still be beeped.",
        settings: [
          {
            type: "members",
            name: "allowedMembers",
            label: "Members who may still be beeped:",
            default: []
          }
        ]
      },
      {
        id: "social.friendListChanges",
        name: "Forbid friend-list changes",
        category: "Social",
        description: "The player cannot add or remove BC friends; each direction can be toggled separately. Covers the friend list screen and in-room dialogs.",
        settings: [
          {
            type: "checkbox",
            name: "blockAdding",
            label: "Block adding friends",
            default: true
          },
          {
            type: "checkbox",
            name: "blockRemoving",
            label: "Block removing friends",
            default: true
          }
        ]
      },
      {
        id: "chat.forbidLeaving",
        name: "Forbid leaving the room",
        category: "Other",
        description: "The player cannot leave the chat room they are in - the exit button and leave commands from other mods are both blocked. Forced moves (leashes, kicks, BC's safeword release) and disconnects are not prevented.",
        bcxEquivalent: "block_leaving_room",
        settings: []
      },
      {
        id: "rooms.create",
        name: "Forbid creating new rooms",
        category: "Rooms",
        description: "The player cannot open the room creation screen. Changing settings of an existing room they administrate is unaffected.",
        bcxEquivalent: "block_creating_rooms",
        settings: []
      },
      {
        id: "rooms.entry",
        name: "Restrict entering rooms",
        category: "Rooms",
        description: 'The player can only join rooms whose name is on the configured list (case-insensitive). As a safety measure the rule does nothing while the list is empty. Being moved by a BC+ command or summon is not restricted. Combines well with "Forbid creating new rooms".',
        bcxEquivalent: "block_entering_rooms",
        settings: [
          {
            type: "stringList",
            name: "allowedRooms",
            label: "Allowed room names:",
            default: [],
            maxChars: 60,
            entryLabel: "room name"
          }
        ]
      },
      {
        id: "rooms.adminUI",
        name: "Forbid room admin UI while blind",
        category: "Rooms",
        description: "The player cannot open the room administration screen while unable to see - it would disclose the room background and admin member numbers. Admin chat commands still work.",
        bcxEquivalent: "block_room_admin_UI",
        settings: []
      },
      {
        id: "social.greetRoom",
        name: "Order to greet the room",
        category: "Social",
        description: "On entering a chat room, the player automatically says the configured greeting.",
        bcxEquivalent: "greet_room_order",
        settings: [
          {
            type: "text",
            name: "greeting",
            label: "Greeting:",
            default: "Hello everyone!",
            maxChars: 200
          }
        ]
      },
      {
        id: "social.farewell",
        name: "Farewell on leave",
        category: "Social",
        description: "When leaving a chat room, the player automatically says the configured farewell first.",
        bcxEquivalent: "farewell_on_slow_leave",
        settings: [
          {
            type: "text",
            name: "farewell",
            label: "Farewell:",
            default: "Goodbye everyone!",
            maxChars: 200
          }
        ]
      },
      {
        id: "other.listenToMyVoice",
        name: "Listen to my voice",
        category: "Other",
        description: "One of the configured sentences appears to the player at random, at the set interval, while they are in a chat room. Only they can see it.",
        bcxEquivalent: "other_constant_reminder",
        settings: [
          {
            type: "stringList",
            name: "sentences",
            label: "Sentences:",
            default: [],
            maxChars: 200,
            entryLabel: "sentence",
            legacySeparator: "|"
          },
          {
            type: "option",
            name: "frequency",
            label: "Minutes between sentences",
            options: [
              "2",
              "5",
              "10",
              "15",
              "30"
            ],
            default: "15"
          }
        ]
      },
      {
        id: "other.summon",
        name: "Ready to be summoned",
        category: "Other",
        description: `Configured members can summon the player from anywhere in the club with a beep whose message starts with the summon text (or just "summon"). After the delay, the player is pulled to the summoner's room - ignoring leashes and locked doors. If the target room is full, they end up in the lobby. The summoner must be in a room and leave "attach room" enabled when writing the beep, or it carries no room to move to.`,
        bcxEquivalent: "alt_forced_summoning",
        settings: [
          {
            type: "members",
            name: "allowedMembers",
            label: "Members who may summon:",
            default: []
          },
          {
            type: "text",
            name: "summonText",
            label: "Summon text:",
            default: "Come to my room immediately",
            maxChars: 100
          },
          {
            type: "option",
            name: "delay",
            label: "Seconds before enforcing",
            options: [
              "10",
              "15",
              "30",
              "60"
            ],
            default: "15"
          }
        ]
      },
      {
        id: "protect.ownerChanges",
        name: "Forbid club owner changes",
        category: "Protection",
        description: "The player cannot leave their current club owner or submit to a new one. Advancing a trial to full ownership is unaffected, and their owner can still release them.",
        bcxEquivalent: "rc_club_owner",
        settings: []
      },
      {
        id: "protect.newLovers",
        name: "Forbid getting new lovers",
        category: "Protection",
        description: "The player cannot start dating anyone new. Advancing an existing lovership (dating to engagement to marriage) is unaffected.",
        bcxEquivalent: "rc_lover_new",
        settings: []
      },
      {
        id: "protect.breakup",
        name: "Forbid breaking up with lovers",
        category: "Protection",
        description: "The player cannot leave any of their lovers, at any lovership stage - neither through the Management mistress nor directly in a chat room. Their lovers can still break up with them.",
        bcxEquivalent: "rc_lover_leave",
        settings: []
      },
      {
        id: "protect.newSubs",
        name: "Forbid taking new submissives",
        category: "Protection",
        description: "The player cannot offer an ownership trial to a new submissive. Advancing an existing trial to full ownership is unaffected.",
        bcxEquivalent: "rc_sub_new",
        settings: []
      },
      {
        id: "protect.disowning",
        name: "Forbid disowning submissives",
        category: "Protection",
        description: "The player cannot let go of any of their submissives (trial or full ownership). Their submissives can still break the bond themselves.",
        bcxEquivalent: "rc_sub_leave",
        settings: []
      },
      {
        id: "protect.blacklist",
        name: "Prevent blacklisting",
        category: "Protection",
        description: "The player cannot add people holding the configured role (or higher) to their BC blacklist or ghostlist.",
        bcxEquivalent: "block_blacklisting",
        settings: [
          {
            type: "option",
            name: "minRole",
            label: "Protect this role and higher",
            options: [
              "BC Owner",
              "Co-Owner",
              "Lover",
              "Mistress",
              "Whitelist",
              "Friend"
            ],
            default: "Mistress"
          }
        ]
      },
      {
        id: "protect.whitelist",
        name: "Prevent whitelisting",
        category: "Protection",
        description: "The player can only add people holding the configured role (or higher) to their BC whitelist.",
        bcxEquivalent: "block_whitelisting",
        settings: [
          {
            type: "option",
            name: "minRole",
            label: "Lowest role allowed on the whitelist",
            options: [
              "BC Owner",
              "Co-Owner",
              "Lover",
              "Mistress",
              "Whitelist",
              "Friend"
            ],
            default: "Mistress"
          }
        ]
      },
      {
        id: "protect.hardcore",
        name: "Hardcore Mode",
        category: "Protection",
        description: "Forces both hardcore options from the General page on while this rule is in effect, locked: the player cannot open their own BC+ while their hands are bound, and people whose hands are bound are refused when they try to change anything in the player's BC+. The player's own choice of the two options is untouched underneath and returns the moment the rule ends. Requires enforcement to have any effect.",
        settings: []
      },
      {
        id: "items.tyingSelf",
        name: "Forbid tying up self",
        category: "Items",
        description: "The player cannot use items on their own body, including swapping worn items.",
        bcxEquivalent: "block_tying_self",
        settings: []
      },
      {
        id: "items.tyingOthers",
        name: "Forbid tying up others",
        category: "Items",
        description: "The player cannot use items on other characters. Can be limited to characters with a higher dominant score than the player.",
        bcxEquivalent: "block_tying_others",
        settings: [
          {
            type: "checkbox",
            name: "onlyDominants",
            label: "Only forbid using items on more dominant characters",
            default: true
          }
        ]
      },
      {
        id: "items.freeingSelf",
        name: "Forbid freeing self",
        category: "Items",
        description: "The player cannot remove, struggle out of or escape items on their own body. Others can still remove them. Low-difficulty items (hand-held toys, plushies...) can optionally stay removable.",
        bcxEquivalent: "block_freeing_self",
        settings: [
          {
            type: "checkbox",
            name: "allowEasy",
            label: "Still allow removing low-difficulty items",
            default: false
          }
        ]
      },
      {
        id: "items.freeingOthers",
        name: "Forbid freeing others",
        category: "Items",
        description: "The player cannot remove items from other characters. Low-difficulty items (hand-held toys, plushies...) can optionally stay removable.",
        bcxEquivalent: "block_freeing_others",
        settings: [
          {
            type: "checkbox",
            name: "allowEasy",
            label: "Still allow removing low-difficulty items",
            default: false
          }
        ]
      },
      {
        id: "items.wardrobeSelf",
        name: "Forbid wardrobe use on self",
        category: "Items",
        description: "The player cannot change their own clothes. Others can still change them.",
        bcxEquivalent: "block_wardrobe_access_self",
        settings: []
      },
      {
        id: "items.wardrobeOthers",
        name: "Forbid wardrobe use on others",
        category: "Items",
        description: "The player cannot change the clothes of other club members.",
        bcxEquivalent: "block_wardrobe_access_others",
        settings: []
      },
      {
        id: "locks.remotesSelf",
        name: "Forbid using remotes on self",
        category: "Items",
        description: "The player cannot use a vibrator remote on their own body. Others can still use remotes on them.",
        bcxEquivalent: "block_remoteuse_self",
        settings: []
      },
      {
        id: "locks.remotesOthers",
        name: "Forbid using remotes on others",
        category: "Items",
        description: "The player cannot use a vibrator remote on anyone else.",
        bcxEquivalent: "block_remoteuse_others",
        settings: []
      },
      {
        id: "locks.keysSelf",
        name: "Forbid using keys on self",
        category: "Items",
        description: "The player cannot unlock locks on their own body, even with the key.",
        bcxEquivalent: "block_keyuse_self",
        settings: []
      },
      {
        id: "locks.keysOthers",
        name: "Forbid using keys on others",
        category: "Items",
        description: "The player cannot unlock locks on anyone else.",
        bcxEquivalent: "block_keyuse_others",
        settings: []
      },
      {
        id: "locks.pickSelf",
        name: "Forbid picking locks on self",
        category: "Items",
        description: "The player cannot pick locks on their own body.",
        bcxEquivalent: "block_lockpicking_self",
        settings: []
      },
      {
        id: "locks.pickOthers",
        name: "Forbid picking locks on others",
        category: "Items",
        description: "The player cannot pick locks on anyone else.",
        bcxEquivalent: "block_lockpicking_others",
        settings: []
      },
      {
        id: "locks.lockSelf",
        name: "Forbid using locks on self",
        category: "Items",
        description: "The player cannot apply locks to their own body.",
        bcxEquivalent: "block_lockuse_self",
        settings: []
      },
      {
        id: "locks.lockOthers",
        name: "Forbid using locks on others",
        category: "Items",
        description: "The player cannot apply locks to anyone else.",
        bcxEquivalent: "block_lockuse_others",
        settings: []
      },
      {
        id: "sensory.sound",
        name: "Sensory deprivation: Sound",
        category: "Sensory",
        description: "Impacts the player's natural hearing the same way items do, independent of them. Strength is adjustable; stacks with worn items.",
        bcxEquivalent: "alt_restrict_hearing",
        settings: [
          {
            type: "option",
            name: "strength",
            label: "Hearing impairment",
            options: [
              "Light",
              "Medium",
              "Heavy"
            ],
            default: "Light"
          }
        ]
      },
      {
        id: "sensory.hearingWhitelist",
        name: "Hearing whitelist",
        category: "Sensory",
        description: "The listed members are always understood clearly, no matter how deafened the player is (by items or rules). Optionally even when those members are gagged.",
        bcxEquivalent: "alt_hearing_whitelist",
        settings: [
          {
            type: "members",
            name: "members",
            label: "Members always heard:",
            default: []
          },
          {
            type: "checkbox",
            name: "includeGagged",
            label: "Understand them even while they are gagged",
            default: false
          }
        ]
      },
      {
        id: "sensory.sight",
        name: "Sensory deprivation: Sight",
        category: "Sensory",
        description: "Impacts the player's natural eyesight the same way items do, independent of them. Strength is adjustable; stacks with worn items.",
        bcxEquivalent: "alt_restrict_sight",
        settings: [
          {
            type: "option",
            name: "strength",
            label: "Eyesight impairment",
            options: [
              "Light",
              "Medium",
              "Heavy"
            ],
            default: "Light"
          }
        ]
      },
      {
        id: "sensory.seeingWhitelist",
        name: "Seeing whitelist",
        category: "Sensory",
        description: "The listed members are always seen normally, no matter how blinded the player is (by items or rules).",
        bcxEquivalent: "alt_seeing_whitelist",
        settings: [
          {
            type: "members",
            name: "members",
            label: "Members always seen:",
            default: []
          }
        ]
      },
      {
        id: "body.forbidPoses",
        name: "Forbid changing poses",
        category: "Body",
        description: "The player cannot change their own body pose unaided - kneeling, standing up, spreading and every other pose stays as it is. Others (and items) can still pose them.",
        bcxEquivalent: "block_restrict_allowed_poses",
        settings: []
      },
      {
        id: "body.forbiddenPoses",
        name: "Forbid specific poses",
        category: "Body",
        description: "The player cannot change into the listed poses by themselves. Pose names: BaseUpper, BackBoxTie, BackCuffs, BackElbowTouch, OverTheHead, Yoked, BaseLower, Kneel, KneelingSpread, LegsClosed, Spread, Hogtied, AllFours, Suspension, TapedHands.",
        bcxEquivalent: "block_restrict_allowed_poses",
        settings: [
          {
            type: "stringList",
            name: "poses",
            label: "Forbidden poses:",
            default: [],
            maxChars: 30,
            entryLabel: "pose name"
          }
        ]
      },
      {
        id: "body.forceKneel",
        name: "Forced to kneel",
        category: "Body",
        description: "The player must stay on their knees: choosing a standing lower-body pose is blocked, and if they end up standing they are put back down. Poses that need aid (restraints forcing them upright) are left alone rather than fought.",
        settings: []
      },
      {
        id: "body.forcedPosition",
        name: "Forced position",
        category: "Body",
        description: "The player is held in a chosen position: pick an arms pose, a legs pose, or both (e.g. hands behind back with legs spread), or a full-body position (hogtied or all fours) that overrides the other two. Changing away is blocked and any deviation is corrected. Poses held by restraints are left alone rather than fought.",
        settings: [
          {
            type: "option",
            name: "fullPose",
            label: "Full body (overrides arms/legs)",
            options: [
              "Any",
              "Hogtied",
              "All fours"
            ],
            default: "Any"
          },
          {
            type: "option",
            name: "armsPose",
            label: "Arms",
            options: [
              "Any",
              "Free",
              "Hands behind back",
              "Elbows behind back",
              "Wrists behind back",
              "Yoked",
              "Arms overhead"
            ],
            default: "Any"
          },
          {
            type: "option",
            name: "legsPose",
            label: "Legs",
            options: [
              "Any",
              "Standing",
              "Legs closed",
              "Legs spread",
              "Kneeling",
              "Kneeling spread"
            ],
            default: "Any"
          }
        ]
      },
      {
        id: "body.afkBehavior",
        name: "Forced AFK behavior",
        category: "Body",
        description: "When the player goes idle, the configured behaviors apply automatically: the Afk emoticon, closed eyes, kneeling, and an automatic reply to whispers. Emoticon and eyes are restored the moment the player is back; a forced kneel is left for them to stand up from.",
        settings: [
          {
            type: "option",
            name: "idleMinutes",
            label: "Minutes until idle",
            options: [
              "2",
              "5",
              "10",
              "15",
              "30"
            ],
            default: "5"
          },
          {
            type: "checkbox",
            name: "afkEmoticon",
            label: "Show the Afk emoticon",
            default: true
          },
          {
            type: "checkbox",
            name: "closeEyes",
            label: "Close the eyes",
            default: false
          },
          {
            type: "checkbox",
            name: "kneel",
            label: "Kneel down",
            default: false
          },
          {
            type: "checkbox",
            name: "autoReply",
            label: "Auto-reply to whispers",
            default: false
          },
          {
            type: "text",
            name: "replyText",
            label: "Auto-reply text:",
            default: "I am away from the club right now.",
            maxChars: 150
          }
        ]
      },
      {
        id: "pet.speech",
        name: "Speak like a pet",
        category: "Pet",
        description: "The player's speech turns pet-like: Sprinkle mode weaves animal sounds between the words, Replace mode swaps words for sounds outright - up to fully non-verbal at Max intensity. Pick an animal sound set or provide custom sounds. Out-of-character text is never touched.",
        settings: [
          {
            type: "option",
            name: "animal",
            label: "Sound set",
            options: [
              "Bunny",
              "Cat",
              "Cow",
              "Dog",
              "Fox",
              "Mouse",
              "Pony",
              "Wolf",
              "Custom"
            ],
            default: "Cat"
          },
          {
            type: "stringList",
            name: "sounds",
            label: "Custom sounds (used with the Custom set):",
            default: [],
            maxChars: 24,
            maxEntries: 20,
            entryLabel: "sound"
          },
          {
            type: "option",
            name: "mode",
            label: "Mode",
            options: [
              "Sprinkle",
              "Replace"
            ],
            default: "Sprinkle"
          },
          {
            type: "option",
            name: "intensity",
            label: "Intensity",
            options: [
              "Low",
              "Medium",
              "High",
              "Max"
            ],
            default: "Medium"
          }
        ]
      },
      {
        id: "pet.hearing",
        name: "Hear like a pet",
        category: "Pet",
        description: `Pet words - commands, praise, the pet's own name, the chosen animal's vocabulary and any custom extras - always come through clearly, while the rest of what the player hears garbles away. "Only when deafened" merely lets the pet words pierce existing deafness (item- or hunger-induced); Light and Heavy garble everything else all the time. Out-of-character text is never touched.`,
        settings: [
          {
            type: "option",
            name: "animal",
            label: "Vocabulary set",
            options: [
              "Bunny",
              "Cat",
              "Cow",
              "Dog",
              "Fox",
              "Mouse",
              "Pony",
              "Wolf",
              "Custom"
            ],
            default: "Cat"
          },
          {
            type: "stringList",
            name: "words",
            label: "Extra understood words:",
            default: [],
            maxChars: 32,
            maxEntries: 30,
            entryLabel: "word"
          },
          {
            type: "option",
            name: "strength",
            label: "Everything else garbles",
            options: [
              "Only when deafened",
              "Light",
              "Heavy"
            ],
            default: "Light"
          }
        ]
      },
      {
        id: "body.controlOrgasms",
        name: "Control orgasms",
        category: "Body",
        description: "Controls what happens when the player's arousal peaks, independent of items: Edge keeps the meter just below the top so the orgasm never starts; Ruin starts the orgasm screen but denies the actual climax; No resisting removes the option to fight an orgasm off. Requires the arousal meter to be enabled.",
        bcxEquivalent: "alt_control_orgasms",
        settings: [
          {
            type: "option",
            name: "mode",
            label: "Orgasm attempts are:",
            options: [
              "Edged",
              "Ruined",
              "Unresistable"
            ],
            default: "Edged"
          }
        ]
      },
      {
        id: "body.secretOrgasms",
        name: "Secret arousal meter",
        category: "Body",
        description: "The player cannot see their own arousal meter even while it is active - the orgasm quick-time event comes as a surprise. Whether others can see the meter is unchanged (that stays a BC setting).",
        bcxEquivalent: "alt_secret_orgasms",
        settings: []
      },
      {
        id: "control.difficulty",
        name: "Forbid changing difficulty",
        category: "Other",
        description: "The player cannot change their Bondage Club multiplayer difficulty, whatever it currently is.",
        bcxEquivalent: "block_difficulty_change",
        settings: []
      },
      {
        id: "control.activities",
        name: "Forbid using activities",
        category: "Other",
        description: "The player cannot use any (sexual) activities on anyone - the activities button vanishes from the item dialogs. Others can still use activities on the player; the arousal system itself stays untouched.",
        bcxEquivalent: "block_activities",
        settings: []
      },
      {
        id: "control.emoticon",
        name: "Forbid changing emoticon",
        category: "Social",
        description: "The player cannot show, change or remove the emoticon (afk, sleep, ...) over their own head.",
        bcxEquivalent: "block_changing_emoticon",
        settings: []
      },
      {
        id: "control.leash",
        name: "Restrict who may leash",
        category: "Protection",
        description: "Only people of at least the configured BC+ role can take the player onto a leash; everyone else's leash slips off with a room message.",
        bcxEquivalent: "alt_restrict_leashability",
        settings: [
          {
            type: "option",
            name: "minimumRole",
            label: "Leashing needs at least:",
            options: [
              "BC Owner",
              "Co-Owner",
              "Lover",
              "Mistress",
              "Whitelist",
              "Friend"
            ],
            default: "Co-Owner"
          }
        ]
      },
      {
        id: "control.nickname",
        name: "Control nickname",
        category: "Social",
        description: "Locks the player's BC nickname: with a nickname configured it is forced to that; with the field left empty the nickname the player had when the rule took hold is kept. The nickname stays as-is when the rule ends.",
        bcxEquivalent: "alt_set_nickname",
        settings: [
          {
            type: "text",
            name: "nickname",
            label: "Forced nickname (empty = lock current):",
            default: "",
            maxChars: 20
          }
        ]
      },
      {
        id: "control.profile",
        name: "Lock profile description",
        category: "Social",
        description: "Freezes the player's online profile description: any change is reverted to the text it had when the rule took hold. The description stays as-is when the rule ends.",
        bcxEquivalent: "alt_set_profile_description",
        settings: []
      },
      {
        id: "settings.itemPermission",
        name: "Force 'Item permission'",
        category: "Settings",
        description: "Pins who is allowed to use items on the player. While enforced, the 'Item permission' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_item_permission",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Everyone, no exceptions",
              "Everyone, except blacklist",
              "Owner, Lovers, whitelist & Dominants",
              "Owner, Lovers and whitelist only",
              "Owner and Lovers only",
              "Owner only"
            ],
            default: "Everyone, no exceptions"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.lockpickingSelf",
        name: "Force 'Locks on you can't be picked'",
        category: "Settings",
        description: "Pins whether locks on the player can be picked at all. While enforced, the 'Locks on you can't be picked' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_forbid_lockpicking",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Locks cannot be picked",
              "Locks can be picked"
            ],
            default: "Locks cannot be picked"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.spRooms",
        name: "Force 'Cannot enter single-player rooms when restrained'",
        category: "Settings",
        description: "Pins whether being restrained blocks entering single-player rooms. While enforced, the 'Cannot enter single-player rooms when restrained' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_forbid_SP_rooms",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Blocked while restrained",
              "Always allowed"
            ],
            default: "Blocked while restrained"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.safeword",
        name: "Force 'Allow safeword use'",
        category: "Settings",
        description: "Pins BC's safeword setting. Forcing it off removes the player's in-game safeword release - use with care and consent. While enforced, the 'Allow safeword use' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_forbid_safeword",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Safeword allowed",
              "Safeword disabled"
            ],
            default: "Safeword disabled"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.arousalMeter",
        name: "Force 'Arousal meter'",
        category: "Settings",
        description: "Pins the arousal meter's activation mode. While enforced, the 'Arousal meter' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_arousal_meter",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Disable sexual activities",
              "Allow without a meter",
              "Allow with a manual meter",
              "Allow with a hybrid meter",
              "Allow with a locked meter"
            ],
            default: "Allow with a hybrid meter"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.arousalStutter",
        name: "Force 'Arousal speech stuttering'",
        category: "Settings",
        description: "Pins when arousal makes the player's speech stutter. While enforced, the 'Arousal speech stuttering' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_arousal_stutter",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Never stutter",
              "When aroused",
              "When vibrated",
              "Aroused & vibrated"
            ],
            default: "Aroused & vibrated"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.vibeModes",
        name: "Force 'Block advanced vibrator modes'",
        category: "Settings",
        description: "Pins whether advanced (escalating/random/edging) vibrator modes work on the player. While enforced, the 'Block advanced vibrator modes' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_block_vibe_modes",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Advanced modes blocked",
              "Advanced modes allowed"
            ],
            default: "Advanced modes allowed"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.afkBubble",
        name: "Force 'Show AFK bubble'",
        category: "Settings",
        description: "Pins whether the player shows the automatic AFK bubble when idle. While enforced, the 'Show AFK bubble' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_show_afk",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "AFK bubble shown",
              "AFK bubble hidden"
            ],
            default: "AFK bubble shown"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.bodyMod",
        name: "Force 'Allow others to alter your whole appearance'",
        category: "Settings",
        description: "Pins whether people with wardrobe access may change the player's whole appearance including body parts. While enforced, the 'Allow others to alter your whole appearance' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_allow_body_mod",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Full appearance access",
              "Body is off-limits"
            ],
            default: "Full appearance access"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.cosplayChange",
        name: "Force 'Prevent others from changing cosplay items'",
        category: "Settings",
        description: "Pins whether others may change the player's cosplay items (ears, tails, wings). While enforced, the 'Prevent others from changing cosplay items' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_forbid_cosplay_change",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Cosplay items protected",
              "Cosplay items changeable"
            ],
            default: "Cosplay items changeable"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.sensdep",
        name: "Force 'Sensory deprivation setting'",
        category: "Settings",
        description: "Pins how strongly blindness items affect the player. While enforced, the 'Sensory deprivation setting' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_sensdep",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Light",
              "Normal",
              "Hide names",
              "Heavy",
              "Total"
            ],
            default: "Normal"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.hideNonAdjacent",
        name: "Force 'Hide non-adjacent players while partially blind'",
        category: "Settings",
        description: "Pins whether partial blindness hides everyone not standing next to the player. While enforced, the 'Hide non-adjacent players while partially blind' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_hide_non_adjecent",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Hidden while blind",
              "Always visible"
            ],
            default: "Hidden while blind"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.blindRoomGarbling",
        name: "Force 'Garble chatroom names and descriptions while blind'",
        category: "Settings",
        description: "Pins whether room names and descriptions garble while the player is blind. While enforced, the 'Garble chatroom names and descriptions while blind' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_blind_room_garbling",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Garbled while blind",
              "Always readable"
            ],
            default: "Garbled while blind"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.relogKeepsRestraints",
        name: "Force 'Keep all restraints when relogging'",
        category: "Settings",
        description: "Pins whether restraints stay on through a relog. While enforced, the 'Keep all restraints when relogging' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_relog_keeps_restraints",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Restraints kept",
              "Restraints removed"
            ],
            default: "Restraints kept"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.leashedRoomChange",
        name: "Force 'Players can drag you to rooms when leashed'",
        category: "Settings",
        description: "Pins whether leash holders can drag the player between rooms. While enforced, the 'Players can drag you to rooms when leashed' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_leashed_roomchange",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Dragging allowed",
              "Dragging blocked"
            ],
            default: "Dragging allowed"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.roomRejoin",
        name: "Force 'Return to chatrooms on relog'",
        category: "Settings",
        description: "Pins whether the player returns to the room they were in when they relog. While enforced, the 'Return to chatrooms on relog' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_room_rejoin",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Returns to the room",
              "Starts in the main hall"
            ],
            default: "Returns to the room"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.plugVibeEvents",
        name: "Force 'Events while plugged or vibed'",
        category: "Settings",
        description: "Pins whether worn plugs and vibrators cause random immersive chat events. While enforced, the 'Events while plugged or vibed' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_plug_vibe_events",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Events enabled",
              "Events disabled"
            ],
            default: "Events enabled"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.tintEffects",
        name: "Force 'Allow item tint effects'",
        category: "Settings",
        description: "Pins whether items may tint the player's vision (colored hoods etc.). While enforced, the 'Allow item tint effects' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_allow_tint_effects",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Tints allowed",
              "Tints disabled"
            ],
            default: "Tints allowed"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.blurEffects",
        name: "Force 'Allow item blur effects'",
        category: "Settings",
        description: "Pins whether items may blur the player's vision. While enforced, the 'Allow item blur effects' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_allow_blur_effects",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "Blur allowed",
              "Blur disabled"
            ],
            default: "Blur allowed"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      },
      {
        id: "settings.upsideDownView",
        name: "Force 'Flip room vertically when upside-down'",
        category: "Settings",
        description: "Pins whether hanging upside-down flips the player's view of the room. While enforced, the 'Flip room vertically when upside-down' setting is held at the configured value - changes snap back within seconds. With the restore option on, the value from before the rule took hold returns when the rule stops applying.",
        bcxEquivalent: "setting_upsidedown_view",
        settings: [
          {
            type: "option",
            name: "value",
            label: "Forced value",
            options: [
              "View flips",
              "View stays upright"
            ],
            default: "View flips"
          },
          {
            type: "checkbox",
            name: "restore",
            label: "Restore the previous value when the rule ends",
            default: true
          }
        ]
      }
    ]
  };

  // shared/bcplus.js
  var BCPLUS_VERSION = bcplus_rules_default.bcplusVersion;
  var RULES = new Map(bcplus_rules_default.rules.map((r) => [r.id, r]));
  var LIMITS = { MAX_RULES: 30, MAX_ACTIVE: 3, MAX_DURATION_MIN: 43200, MAX_SETTINGS: 32, TITLE: 60, TERMS: 1e3 };
  var NEVER = {
    "settings.safeword": "turns off their safeword",
    "social.forbidBeeps": "stops them beepin' the farm for help",
    "social.forbidBeepMessages": "stops them beepin' the farm for help",
    "speech.forbidOOC": "stops them speakin' out of character",
    "speech.gaggedOOC": "stops them speakin' out of character"
  };
  var DURATIONS = [
    { key: "1h", label: "1 hour", min: 60, words: ["1h", "hour", "1 hour", "an hour"] },
    { key: "12h", label: "12 hours", min: 720, words: ["12h", "12 hours", "half a day", "a night", "night", "overnight"] },
    { key: "1d", label: "1 day", min: 1440, words: ["1d", "day", "1 day", "a day"] },
    { key: "1w", label: "1 week", min: 10080, words: ["1w", "week", "1 week", "a week"] },
    { key: "2w", label: "2 weeks", min: 20160, words: ["2w", "2 weeks", "two weeks", "fortnight"] },
    { key: "1m", label: "1 month", min: 43200, words: ["1m", "month", "1 month", "a month", "30 days", "a season", "season"] },
    { key: "perm", label: "Permanent", min: 0, words: ["perm", "permanent", "forever", "for good", "until released"] }
  ];
  var hasWords = (t, w) => new RegExp("(^|[^a-z0-9])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^a-z0-9])").test(t);
  function durationFrom(text) {
    const t = String(text || "").trim().toLowerCase();
    return DURATIONS.find((d) => d.key === t || d.words.includes(t) || d.label.toLowerCase() === t) || DURATIONS.find((d) => d.words.some((w) => w.length > 3 && hasWords(t, w))) || null;
  }
  var DEPTHS = [
    { key: "fun", label: "Fun", words: ["fun", "playful", "light", "silly"] },
    { key: "deep", label: "Deep", words: ["deep", "properly kept", "kept"] },
    { key: "nhl", label: "No human left", words: ["nhl", "no human left", "all animal", "total"] }
  ];
  function depthFrom(text) {
    const t = String(text || "").trim().toLowerCase();
    return DEPTHS.find((d) => d.key === t || d.words.includes(t)) || DEPTHS.find((d) => d.words.some((w) => hasWords(t, w))) || null;
  }
  var ANIMALS = {
    cow: "Cow",
    bull: "Cow",
    pony: "Pony",
    horse: "Pony",
    pup: "Dog",
    dog: "Dog",
    kitt: "Cat",
    cat: "Cat",
    bunny: "Bunny",
    rabbit: "Bunny",
    fox: "Fox",
    wolf: "Wolf",
    mouse: "Mouse"
  };
  var SOUNDS = {
    pig: ["oink", "snort", "squee", "grunt"],
    goat: ["maa", "meh-eh", "bleat"],
    sheep: ["baa", "baaah", "meh"],
    deer: ["bleat", "snort", "huff"],
    goblin: ["heh", "gnuk", "skree", "hrrk"]
  };
  function petFor(species) {
    const s = String(species || "").toLowerCase();
    if (ANIMALS[s]) return { animal: ANIMALS[s], sounds: [] };
    return { animal: "Custom", sounds: SOUNDS[s] || ["moo"] };
  }
  var SOUND_WORD = { Cow: "Moo", Pony: "Neigh", Dog: "Woof", Cat: "Mew", Bunny: "Eep", Fox: "Yip", Wolf: "Awoo", Mouse: "Squeak" };
  function settingProblem(setting, value) {
    switch (setting.type) {
      case "checkbox":
        return typeof value === "boolean" ? "" : "needs on or off";
      case "option":
        return typeof value === "string" && setting.options.includes(value) ? "" : "must be one of: " + setting.options.join(", ");
      case "text": {
        const max = Math.min(setting.maxChars ?? 256, 1e3);
        return typeof value === "string" && value.length <= max ? "" : "must be text, " + max + " characters at most";
      }
      case "members":
        return Array.isArray(value) && value.length <= 100 && value.every((m) => Number.isInteger(m) && m >= 0) ? "" : "must be a list of member numbers";
      case "stringList": {
        const n = Math.min(setting.maxEntries ?? 50, 100), len = Math.min(setting.maxChars ?? 200, 200);
        return Array.isArray(value) && value.length <= n && value.every((s) => typeof s === "string" && s.length <= len) ? "" : "must be a list of up to " + n + " entries, " + len + " characters each";
      }
      default:
        return "unknown setting type";
    }
  }
  function makeSpec(ruleId, settings = {}, opts = {}) {
    const def = RULES.get(ruleId);
    const base = {};
    for (const s of def ? def.settings : []) base[s.name] = Array.isArray(s.default) ? s.default.slice() : s.default;
    const spec = {
      active: true,
      enforce: opts.enforce !== false,
      log: opts.log !== false,
      announce: opts.announce !== false,
      settings: Object.assign(base, settings)
    };
    if (opts.conditions) {
      spec.useGlobal = false;
      spec.conditions = opts.conditions;
    } else spec.useGlobal = false;
    return spec;
  }
  function checkContract(c) {
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
      if (!def) {
        out.push(id + ": BC+ " + BCPLUS_VERSION + " has no rule by that name");
        continue;
      }
      if (NEVER[id] && spec.active) {
        out.push(def.name + ": the farm never uses this one (it " + NEVER[id] + ")");
        continue;
      }
      const names = Object.keys(spec.settings || {});
      if (names.length > LIMITS.MAX_SETTINGS) out.push(def.name + ": too many settings");
      for (const name of names) {
        const s = def.settings.find((x) => x.name === name);
        if (!s) {
          out.push(def.name + ": BC+ has no setting called " + name);
          continue;
        }
        const p = settingProblem(s, spec.settings[name]);
        if (p) out.push(def.name + " \xB7 " + (s.label || name).replace(/:$/, "") + ": " + p);
      }
    }
    return out;
  }
  var DEFAULT_NICKNAME = "BnB {Species} {name}";
  function fillWho(text, who) {
    const sp = String(who && who.species || "").trim(), cap = (s) => s.replace(/^./, (x) => x.toUpperCase());
    return String(text).replace(/\{name\}/gi, who && who.name || "").replace(/\{Species\}/g, cap(sp || "pet")).replace(/\{species\}/g, sp || "pet").replace(/\{Pet\}/g, cap(sp || "pet")).replace(/\{pet\}/g, sp || "pet").replace(/\s+/g, " ").trim();
  }
  function fillRules(rules, who) {
    for (const spec of Object.values(rules || {})) {
      const s = spec && spec.settings;
      if (!s) continue;
      for (const [k, v] of Object.entries(s)) {
        if (typeof v === "string" && /\{\w+\}/.test(v)) s[k] = fillWho(v, who);
        else if (Array.isArray(v) && v.some((x) => typeof x === "string" && /\{\w+\}/.test(x))) s[k] = v.map((x) => typeof x === "string" ? fillWho(x, who) : x);
      }
      if (typeof s.nickname === "string" && s.nickname.length > 20) s.nickname = (who && who.name ? who.name : s.nickname).slice(0, 20);
    }
    return rules;
  }
  function templateRules(depth, who, farm) {
    const pet = petFor(who.species), word = SOUND_WORD[pet.animal] || (pet.sounds[0] || "Moo").replace(/^./, (x) => x.toUpperCase());
    const kind = String(who.species || "").replace(/^./, (x) => x.toUpperCase());
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
  function makeContract({ title, terms = "", duration, depth, policy, rules, who, farm }) {
    const d = typeof duration === "string" ? durationFrom(duration) : duration;
    return {
      title: String(title || "B&B Farm contract").trim().slice(0, LIMITS.TITLE),
      terms: String(terms || "").slice(0, LIMITS.TERMS),
      durationMin: d ? d.min : 0,
      policy: policy || (depth === "fun" ? "either" : "author"),
      rules: rules || templateRules(depth, who, farm)
    };
  }
  var BCP = "BCP";
  var offerMsg = (contract, target, authorName) => ({ Content: BCP, Type: "Hidden", Target: target, Dictionary: { message: "ContractOffer", payload: Object.assign({ author: 0, authorName: authorName || "B&B Farm" }, contract) } });
  var queryMsg = (target) => ({ Content: BCP, Type: "Hidden", Target: target, Dictionary: { message: "ContractQuery" } });
  var releaseMsg = (target, id) => ({ Content: BCP, Type: "Hidden", Target: target, Dictionary: { message: "ContractCommand", action: "release", id } });
  function readBCP(data) {
    if (!data || data.Type !== "Hidden" || data.Content !== BCP) return null;
    const d = data.Dictionary;
    if (!d || typeof d !== "object" || Array.isArray(d) || typeof d.message !== "string") return null;
    return Object.assign({}, d, { from: data.Sender });
  }

  // shared/guides.js
  var PUBLIC_GROUPS = [
    { name: "Safety", cmds: ["safe", "stuck", "staff", "report"] },
    { name: "Gettin' started", cmds: ["help", "help me", "rules", "consent", "tour", "apply", "friend", "species", "luxury", "doors", "addons"] },
    { name: "You and the farm", cmds: ["record", "keys", "who", "herd", "notice", "weather", "feeding", "curfew", "beg"] },
    { name: "Milk", cmds: ["stats", "board", "milkable", "quota"] },
    { name: "Breedin'", cmds: ["breedable", "fertile", "freeuse", "jarok", "yes", "no", "naturalheat", "breed <who>", "cum <who>", "wash", "tally", "eggs", "praise", "degrade", "rights", "accept", "pedigree"] },
    { name: "Body", cmds: ["size", "measure", "penis", "futa", "gender <word>"] },
    { name: "Clothes", cmds: ["outfit", "outfits", "uniform", "outfit back"] },
    { name: "Mind", cmds: ["hypno", "teaseme"] },
    { name: "Fun", cmds: ["fair", "enter"] }
  ];
  var STAFF_GROUPS = [
    { name: "Books", cmds: ["queue", "app <n>", "approve <who> livestock", "deny <who>", "appclear", "roster", "stock", "find <who>", "record <who>", "note <who>", "signed", "addfriend <who>", "unregister <who>", "unregister <who> <role>"] },
    { name: "Herd", cmds: ["claim <who>", "release <who>", "myherd", "herdname <name>", "herdcall", "herdsummon", "turnout <who>", "letup <who>", "brand <who>", "walk <who>"] },
    { name: "Stock", cmds: ["tier <who> <tier>", "stocks <who>", "unstock <who>", "vet <who>", "inspect <who>", "tease list"] },
    { name: "Contracts", cmds: ["contract list", "contract show deep <who>", "contract offer deep <who> 1w", "contract check <who>", "contract release <who>", "contract rules", "contracts"] },
    { name: "Outfits", cmds: ["outfit", "outfit offer <who>", "outfit offer <who> <species> <gender>"] },
    { name: "Barn", cmds: ["milk <who>", "collect <who>", "jars", "inseminate <who> <jar>", "machine <who> <jar>", "drain <who>", "edge <who>", "denial <who>", "ruin <who>", "nomilk <who> <hours>", "quota <who>", "heat <who>", "heatline", "shotlog"] },
    { name: "Map", cmds: ["spot", "spot set <name>", "spot place <name> <x> <y>", "zone", "zone who", "zone a <name>", "zone b <name>", "zone box <name> <ax> <ay> <bx> <by>", "zone pair <name> <group>", "tourstop", "setrescue", "where", "stucklog"] },
    { name: "Voice", cmds: ["voice", "voice on herd", "voice add herd <line>", "voice every herd 15"] },
    { name: "Work and play", cmds: ["clockin", "clockout", "hours", "done", "chores", "chore add <job> @<place>", "wheel", "spin", "begphrase", "score"] },
    { name: "Keys and calls", cmds: ["keys <who>", "keysync", "keydump", "grant <who> <tier>", "revoke <who>", "forced", "summon <who>", "summon all", "pasture", "onduty", "cover"] }
  ];
  var OWNER_GROUPS = [
    { name: "Proprietors", cmds: ["staffadd <who> <role>", "staffremove <who>", "goldkey <who>", "notice <text>", "feeding on", "curfew on", "fair open", "addons off <name>", "addons on <name>", "backup", "health"] }
  ];

  // bot/src/version.js
  var VERSION = "0.15.5";

  // bot-parts:farmhand-bot-parts
  (function() {
    "use strict";
    const CFG = {
      ROOM_NAME: "B&B Farm",
      ROOM_DESC: "Bred & Bound. Bed & Breakfast. Say ?help out loud \u2014 or beep the farm office from anywhere.",
      ROOM_BG: "IndoorsBarn",
      ROOM_LIMIT: 20,
      ROOM_PRIVATE: false,
      ROOM_ADMINS: [221397, 232922, 260239],
      PROPRIETORS: [221397, 232922],
      BOT_MEMBER: 260239,
      PREFIXES: ["?", "-", "!", "."],
      BOT_WORDS: ["bot", "farm", "office"],
      BARE_WHISPER_COMMANDS: true,
      CHAT_REPLY_BEEP: true,
      WHISPER_FIRST: false,
      // true = whisper folks standin' on the map instead of beepin' 'em (some clients/mods hide bot whispers)
      CHAT_REPLY_SAY_MAX: 280,
      GREET_COOLDOWN_MIN: 90,
      SEND_INTERVAL_MS: 250,
      // ONE queue for chat, beeps & hidden msgs (server kicks at 20/sec; 4/sec is plenty safe)
      QUEUE_MAX: 300,
      // drop oldest routine messages past this
      BEEP_MAX_CHUNKS: 8,
      USER_COOLDOWN_S: 5,
      COMPANION_COOLDOWN_S: 1,
      HOME_AFTER_S: 90,
      SPEAKER_MODE: "voice",
      // with speaker-* spots set: "voice" = the spot speaks for me and I never move · "walk" = I go stand on the nearest one
      SPEAKER_RANGE: 8,
      // how far (tiles) from the speaker spot, or from whoever it's about, folks get the line              // after walkin' over to somethin', I head back to my home tile (?spot set home) this long after       // panel buttons: a short gap, and a click that comes too quick waits its turn
      APPLY_TIMEOUT_MIN: 0,
      // 0 = interviews never time out (staff can ?appclear a stale one)
      CLAIM_ASK_TIMEOUT_MIN: 60,
      // unanswered ?claim requests lapse after this
      ROOM_SNAPSHOT_MIN: 10,
      // remember the map so a rebuilt room keeps it
      /* ── ANTI-IDLE ── */
      USE_WORKER_TIMER: true,
      // browsers throttle setInterval in background tabs
      HEARTBEAT_MS: 2e4,
      KEEPALIVE_MIN: 4,
      // invisible server traffic every N minutes
      KEEPALIVE_NUDGE: true,
      // also shuffle position occasionally
      NUDGE_MIN: 11,
      WATCHDOG_MIN: 5,
      // reload the page if broken this long
      WATCHDOG_ENABLED: true,
      KEY_SYNC_ENABLED: true,
      KEY_SYNC_ON_JOIN: true,
      KEY_RESYNC_MIN: 10,
      KEY_JOIN_DELAY_MS: 4e3,
      TELL_ON_KEY_CHANGE: true,
      AUTO_FRIEND: true,
      FRIEND_ON_REGISTER: true,
      FRIEND_ON_BEEP: true,
      FRIEND_ON_JOIN: true,
      /* ── FORCED SUMMONING ── */
      SUMMON_ENABLED: true,
      // BCX "Ready to be summoned" only fires if the beep STARTS WITH the person's own
      // summon text, or is exactly "summon". Plain "summon" works for everyone.
      // They must also list the bot's member number in that rule's allowed members.
      SUMMON_MESSAGE: "summon",
      SUMMON_BEEPTYPE: "",
      SUMMON_COOLDOWN_MIN: 5,
      SUMMON_MAX_PER_CALL: 3,
      SUMMON_ON_SAFEWORD: true,
      SUMMON_ON_STUCK: false,
      SUMMON_ON_STAFF_CALL: false,
      /* ── HERDS ── */
      HERD_CAP: { PROPRIETOR: 20, HERDMASTER: 15, FARMHAND: 10 },
      // farmhand cap covers mandated too
      HERD_WORD_DEFAULT: "herd",
      HERDCALL_COOLDOWN_MIN: 2,
      /* ── PASTURE LOCK ── who can be turned out and kept off duty, and who
         (besides whoever has them in their herd) may lock them. Only their herd
         leader can let them back up; if nobody holds them, whoever locked them can. */
      PASTURE_LOCKABLE: { 221397: [232922] },
      // Laynie: Alexia may lock too
      PASTURE_LOCK_CLAIMED_STAFF: true,
      // any staff or proprietor in a herd can be turned out by their leader
      // People listed in PASTURE_LOCKABLE can always let that person up too,
      // even while a herd leader holds them (Alexia can always let Laynie up).
      /* ── TIERS ── lowest first. The bottom two are punishment tiers. Staff set them all. */
      TIERS: ["degraded", "naughty", "new", "trained", "prize"],
      TIER_PRETTY: { degraded: "\u26D3\uFE0F Degraded", naughty: "\u{1F53B} Naughty", new: "\u{1F331} New stock", trained: "\u{1F380} Trained", prize: "\u{1F3C6} Prize" },
      PUNISH_TIERS: ["degraded", "naughty"],
      /* ── TEASING ── opted-in stock get a random line now and then while they're here */
      TEASE_ENABLED: true,
      TEASE_MIN_GAP_MIN: 25,
      // never closer together than this, per person
      TEASE_MAX_GAP_MIN: 70,
      // ...and usually by this
      /* ── PRODUCTION & BREEDING ── amounts in mL, rates per hour. See doc section 16. */
      /* ── MILKING GEAR ── worn anywhere on the farm, it milks at a rate to match the gear.
         Echo's pumps top out near 40 mL a minute, so the farm does too. */
      GEAR: {
        PUMP_ML: [0, 10, 20, 30, 40],
        // BC Lactation Pump: Off, Low, Medium, High, Maximum (mL a minute)
        ECHO_ML_MIN: 15,
        ECHO_ML_MAX: 40,
        // Echo's portable pump and milk vendor: calm → fully aroused
        EMOTE_MIN: 5,
        // a gear emote about this often per person (with some wobble)
        MACHINE_LOAD_MIN: 30
        // a jar loaded into a machine waits this long for it to run
      },
      PROD: {
        MILK_PER_H: 500,
        MILK_CAP: 8e3,
        // per species "milk" multiplier below
        SEMEN_PER_H: 5,
        SEMEN_CAP: 60,
        BASE_CAPACITY: 200,
        WORN_CAPACITY: 100,
        INJECT_CAPACITY: 250,
        REDUCE_CAPACITY: 500,
        MAX_CAPACITY: 5e4,
        // shots stretch (or shrink) capacity for good
        IMMOBILE_ML: 5e3,
        // this much swelling pins you where you are
        PIN_FROM_MILK: true,
        // milk past its normal cap counts toward it
        PIN_FROM_INFLATION: true,
        // held semen counts too: a stud can cumflate you till you can't move
        // (a stud's own semen never pins)
        SAFEWORD_UNPIN_MIN: 30,
        // a safeword frees them for this long
        HALF_LIFE_H: { vulva: 12, butt: 6, mouth: 1 },
        // stored semen halves this often
        LOAD_SHARE: 0.6,
        MIN_LOAD: 5,
        // ?cum moves 60% of the stud's semen
        SWALLOW_TO_MILK: 0.5,
        // swallowed loads feed the milk a little
        PREG_MILK_X: 1.5,
        FRESH_MILK_X: 2,
        FRESH_DAYS: 3,
        CONCEIVE_BASE: 0.15,
        EXTRA_SIRE_WINDOW_H: 24,
        EXTRA_SIRE_X: 0.5,
        TWIN_CHANCE: 0.1,
        PREG_DAYS: 5,
        SEX_SPLIT: [45, 45],
        // male %, female %, the rest futa
        OVERFULL_H: 24,
        LEAK_EMOTE_MIN: 30,
        HEAT_H: 12,
        NATURAL_HEAT_EVERY_D: 7,
        HEAT_EMOTE_MIN: 20,
        STALL_MILK_PER_MIN: 250,
        STALL_SEMEN_PER_MIN: 5,
        // only for a session started before an update; new ones pace themselves (STALL_SESSION_RANGE)
        STALL_SESSION_RANGE: [5, 30],
        // a stall session takes 5 minutes (just over a quarter full) up to 30 (full)
        STALL_LINE_MIN: 5,
        // an open line in the room at most this often while they're in the stall (their own story is private)
        STALL_OPEN_MAX: 20,
        // ...and at most this many in one session
        STALL_AWAY_GRACE_S: 60,
        STALL_REST_MIN: [10, 20],
        // after a session, the stall rests this many minutes (random in between) before it takes them again      // steppin' off for less than this pauses the session instead of endin' it
        STALL_LEAVE_SHARE: 0.25,
        // milkin' stalls drain you down to this much of your capacity, then stop
        WEEKLY_PRIZE: true
        // top producer each week goes prize tier
      },
      /* ── MILK GRADE ── each milking session is scored 0-100; the grade is the
         average of the last few sessions, so anybody can work their way up. */
      GRADE: {
        BASE: 55,
        TIER: { prize: 15, trained: 8, new: 0, naughty: -12, degraded: -20 },
        REGULAR_MIN_H: 6,
        REGULAR_MAX_H: 16,
        REGULAR: 15,
        // milked on a good rhythm
        TOO_SOON_H: 2,
        TOO_SOON: -10,
        // milked again too soon
        TOO_LONG_H: 36,
        TOO_LONG: -10,
        // left too long
        FRESH: 10,
        HEAT: 5,
        LACT_SHOT: 10,
        LACT_WORN: 5,
        LEAKING: -15,
        // overfull and leaking for a day
        SESSION_GAP_MIN: 30,
        // drains closer than this are one session
        AVERAGE_OF: 5,
        LETTERS: [[85, "A+"], [70, "A"], [55, "B"], [40, "C"], [0, "D"]],
        WEEKLY_PRIZE: true,
        MIN_SESSIONS: 3
        // best average grade of the week goes prize too
      },
      /* ── BODY SIZES ── Udder, balls, gape and throat go by level; penis goes by inches.
         Anybody can set their own up to "natural". Past that is hyper, and only shots get you there. */
      SIZES: {
        udder: {
          label: "Udder",
          start: 3,
          natural: 10,
          max: 20,
          // udder = breasts; measured in bra cups
          cups: ["AA", "A", "B", "C", "D", "DD", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"],
          names: [
            "flat",
            "perky",
            "handful",
            "full",
            "heavy",
            "big",
            "huge",
            "massive",
            "enormous",
            "gigantic",
            "hyper",
            "beachball",
            "bursting",
            "colossal",
            "barrel-sized",
            "titanic",
            "immobilizing",
            "mountainous",
            "room-filling",
            "impossibly huge"
          ]
        },
        testes: {
          label: "Balls",
          start: 3,
          natural: 10,
          max: 20,
          names: [
            "tiny",
            "small",
            "average",
            "full",
            "heavy",
            "big",
            "huge",
            "swollen",
            "massive",
            "enormous",
            "hyper",
            "melon-sized",
            "sloshing",
            "colossal",
            "basketball-sized",
            "titanic",
            "immobilizing",
            "mountainous",
            "room-filling",
            "impossibly huge"
          ]
        },
        penis: {
          label: "Penis",
          start: 6,
          natural: 14,
          max: 30,
          step: 2,
          inches: true,
          // inches; a shot adds or takes 2"
          words: [[3, "tiny"], [5, "small"], [7, "average"], [9, "big"], [12, "huge"], [16, "massive"], [20, "enormous"], [25, "monstrous"], [31, "hyper"]]
        },
        vulva: {
          label: "Vulva",
          start: 1,
          natural: 10,
          max: 20,
          gape: true,
          names: [
            "tight",
            "snug",
            "slightly gaped",
            "gaped",
            "loose",
            "well-used",
            "gaping",
            "wide open",
            "cavernous",
            "ruined",
            "hyper-gaped",
            "fist-wide",
            "yawning",
            "arm-deep",
            "sloppy and slack",
            "bottomless",
            "hollowed out",
            "endless",
            "abyssal",
            "impossibly gaped"
          ]
        },
        butt: {
          label: "Butt",
          start: 1,
          natural: 10,
          max: 20,
          gape: true,
          names: [
            "tight",
            "snug",
            "slightly gaped",
            "gaped",
            "loose",
            "well-used",
            "gaping",
            "wide open",
            "cavernous",
            "ruined",
            "hyper-gaped",
            "fist-wide",
            "yawning",
            "arm-deep",
            "sloppy and slack",
            "bottomless",
            "hollowed out",
            "endless",
            "abyssal",
            "impossibly gaped"
          ]
        },
        knot: {
          label: "Knot",
          start: 3,
          natural: 10,
          max: 20,
          // only for knotted cocks
          names: [
            "little",
            "modest",
            "thick",
            "fat",
            "swollen",
            "fist-sized",
            "bulging",
            "massive",
            "huge",
            "enormous",
            "hyper",
            "grapefruit-sized",
            "lockin'",
            "colossal",
            "melon-sized",
            "titanic",
            "inescapable",
            "mountainous",
            "room-fillin'",
            "impossibly huge"
          ]
        },
        throat: {
          label: "Throat",
          start: 2,
          natural: 10,
          max: 20,
          names: [
            "gaggy",
            "tight",
            "learnin'",
            "eager",
            "practiced",
            "trained",
            "deep",
            "greedy",
            "no gag reflex",
            "bottomless",
            "hyper-trained",
            "stretchy",
            "endless",
            "swallow-anything",
            "cock sleeve",
            "limitless",
            "living funnel",
            "insatiable",
            "abyssal",
            "impossibly deep"
          ]
        }
      },
      SIZE_SELF_SET: true,
      // folks can set their own sizes with ?size, up to "natural" (it's their character)
      UDDER_X_PER_LEVEL: 0.15,
      // each udder level above/below 3: ±15% milk made and held, up to "natural"...
      TESTES_X_PER_LEVEL: 0.25,
      // each ball level above/below 3: ±25% semen made and held, up to "natural"...
      HYPER_X: { udder: 1.3, testes: 1.5 },
      // ...then each hyper level multiplies it again (hyper loads!)
      PIN_FROM_SIZE: { udder: 17, testes: 17 },
      // this big and you can't move till it's reduced (0 = never)
      PREG_UDDER_UP: 1,
      // udder swells this many sizes while expecting and fresh
      INCHES_PER_GAPE: 3,
      // a penis needs one gape (or throat) level per 3"
      STRETCH_PER_BREED: 1,
      // a penis bigger than the hole stretches it this many levels
      GAPE_TIGHTEN_H: 24,
      // stretched holes tighten one level this often, back to their usual
      GAPE_LEAK_X: 0.15,
      // each level looser than tight drains a held load 15% faster
      // worn in the vulva or butt slot (or a mouth slot for the throat), trains only that hole
      STRETCHER_WORDS: ["stretcher", "stretching", "stretch", "gaper", "gape", "dilator", "expander", "spreader", "trainer", "widener", "loosener"],
      STRETCH_TRAIN_H: 12,
      // every 12 hours a stretcher's worn (on the farm), that hole's usual goes up one
      THROAT_TRAIN_EVERY: 3,
      // this many throat loads from a too-big penis trains the throat up one
      PENTUP_H: 24,
      PENTUP_CAGED_H: 12,
      // full this long (or this long while caged) = pent up
      PENTUP_LOAD_X: 1.5,
      PENTUP_FERT_X: 1.5,
      // a pent-up stud empties everything, half again more, and more fertile
      LOAD_WORDS: [
        [5, "a little dribble"],
        [15, "a load"],
        [40, "a thick load"],
        [100, "a huge load"],
        [300, "a gushin' flood"],
        [1e3, "a belly-swellin' torrent"],
        [5e3, "a hyper flood"],
        [Infinity, "an impossible, never-endin' flood"]
      ],
      // shots that change sizes for good (one step per shot, and the only way into hyper).
      // Spaces, hyphens and capitals don't matter.
      SIZE_TAGS: {
        udder: {
          up: ["udder growth", "udder boost", "udder enlarger", "breast growth", "breast enlarger", "boob growth"],
          down: ["udder reducer", "udder reducing", "udder shrink", "breast reducer", "breast reducing", "boob reducer"]
        },
        testes: {
          up: ["ball growth", "balls growth", "testicle growth", "testes growth", "ball enlarger"],
          down: ["ball reducer", "ball reducing", "ball shrink", "testicle reducer", "testes reducer"]
        },
        penis: {
          up: ["penis growth", "penis enlarger", "cock growth", "dick growth"],
          down: ["penis reducer", "penis reducing", "penis shrink", "cock reducer"]
        },
        vulva: {
          up: ["vulva gape", "pussy gape", "vaginal gape"],
          down: ["vulva tightener", "pussy tightener", "vaginal tightener"]
        },
        butt: {
          up: ["anal gape", "butt gape", "ass gape"],
          down: ["anal tightener", "butt tightener", "ass tightener"]
        },
        knot: {
          up: ["knot growth", "knot enlarger", "knot swell"],
          down: ["knot reducer", "knot shrink"]
        },
        throat: {
          up: ["throat trainer", "throat relaxer", "deep throat"],
          down: ["throat tightener", "gag reflex restorer"]
        }
      },
      FAIR_CLASSES: ["show", "udder", "balls", "penis", "gape", "throat", "load"],
      /* ── PENIS TYPES & KNOTS ── any type can also carry a knot (a shot gives one) */
      PENIS_TYPES: {
        human: { label: "human", loadX: 1, stretchX: 1, throatX: 1 },
        canine: { label: "canine", loadX: 1.2, stretchX: 1, throatX: 1, knot: true },
        equine: { label: "flared equine", loadX: 1.5, stretchX: 2, throatX: 1 },
        feline: { label: "barbed feline", loadX: 1, stretchX: 1, throatX: 1, heat: true },
        // every vulva fill rolls like they're in heat
        draconic: { label: "ridged draconic", loadX: 1.2, stretchX: 2, throatX: 2 },
        double: { label: "double", loadX: 1, stretchX: 1, throatX: 1, double: true }
        // ?cum <who> vulva+butt
      },
      SPECIES_PENIS: { dog: "canine", pup: "canine", wolf: "canine", fox: "canine", horse: "equine", pony: "equine", cat: "feline", kitt: "feline" },
      // crafted shot words that change the type for good (spaces, hyphens and capitals don't matter)
      PENIS_TYPE_TAGS: {
        canine: ["canine"],
        equine: ["equine"],
        feline: ["feline", "barbed"],
        draconic: ["draconic"],
        double: ["double cock", "double penis", "hemipenes", "twin cock"],
        human: ["humanizer", "human cock"]
      },
      KNOT_ADD_TAGS: ["knotting", "add knot", "knot shot"],
      KNOT_REMOVE_TAGS: ["knot remover", "unknotting"],
      TIE_MIN_M: 5,
      TIE_MAX_M: 30,
      // a knot ties the pair this long (random), and leashes them together
      KNOT_FERT_X: 1.5,
      // a tied load is more likely to take
      CUMFLATE_PIN_X: 1.5,
      // held semen past 1.5x your capacity pins you (only a knot gets you past full)
      BREEDING_STAND: "breedingstand",
      BREEDING_STAND_X: 1.5,
      // fills on (or next to) that spot catch more
      HEAT_SCENT_TILES: 2,
      // a stud this close to stock in heat gets pent up twice as fast
      MILK_LEAK_SHARE: 0.5,
      // milkin' someone who's cumflated squeezes out this much semen per mL of milk
      TOP_SIRES: 3,
      // how many sires the weekly post names
      /* ── v0.9.23 ── */
      BREED_OK_H: 3,
      // a yes to a stud lasts this long (each fill keeps it fresh)
      BREED_ASK_MIN: 10,
      // a breedin' ask waits this long for a yes or no
      PAINT_H: 6,
      // cum-covered this long unless they ?wash
      SCENT_H: 1,
      // a stud's seed scent lasts this long
      MILK_QUOTA_ML: 1e3,
      // stock that makes milk should give this much a day (staff: ?quota)
      QUOTA_MIN_PRESENT: 60,
      // the milk quota only counts a day they spent at least this many minutes on the farm
      QUOTA_STREAK_UP: 5,
      // this many days in a row on quota moves 'em up a tier (new → trained → prize)
      LABOUR_MIN: 45,
      // labour lasts this long before the litter comes
      LABOUR_WAIT_H: 12,
      // due but away from the farm this long: the litter comes without the show
      EGG_CHANCE: 0.2,
      EGG_TIED_CHANCE: 0.4,
      EGG_COUNT: [2, 6],
      EGG_DAYS: [2, 3],
      MILK_ACHE_MIN: 20,
      // milk-denied and full: an achin' emote about this often
      /* ── v0.9.23 ── */
      RP_ROUGH: /\b(pound\w*|rail\w*|rough\w*|slam\w*|hammer\w*|brutal\w*|ravag\w*|wreck\w*|savage\w*|plow\w*|plough\w*|ruin\w*|hard)\b/i,
      RP_GENTLE: /\b(slow\w*|gentl\w*|tender\w*|soft\w*|loving\w*|careful\w*|sweet\w*)\b/i,
      SLOSH_MIN: 8,
      // a full, sloshin' body gets a waddle emote about this often when it moves
      EDGE_X: 0.25,
      EDGE_MAX: 4,
      EDGE_PENT: 3,
      // each edge adds 25% to the next load (up to 4); 3 edges = pent up
      VEDGE_X: 0.2,
      VEDGE_HOURS: 3,
      AMBIENT_ON: true,
      // two animals standin' close share a small moment every 15–25 minutes              // a pussy edged: each edge makes the next breedin' 20% likelier to take, for 3 hours
      RP_PRAISE: /\bgood (girl|boy|cow|pet|pup|puppy|kitty|kitten|heifer|breeder|stud|pony|piggy|toy|slut|bitch|bull|mare|doll|thing|little \w+)\b/i,
      RP_DEGRADE: /\b(slut|whore|cumdump|cum dump|breeder|cow|heifer|bitch|cocksleeve|cock sleeve|fucktoy|fuck toy|sow|pig|breeding stock|brood ?mare|milk ?bag|onahole|cumrag|cum rag)\b/i,
      TITLES: [
        { key: "cream", name: "Cream Queen", why: "100 L milked" },
        { key: "dump", name: "Farm Cumdump", why: "50 L of seed taken" },
        { key: "brood", name: "Brood Mother", why: "5 litters" },
        { key: "breeder", name: "Prize Breeder", why: "10 litters" },
        { key: "bottom", name: "Bottomless", why: "a hole gaped to ruined for good" },
        { key: "throat", name: "Throat Goat", why: "a bottomless throat" },
        { key: "stud", name: "Stud of the Farm", why: "50 covers" },
        { key: "sire", name: "Prolific Sire", why: "sired 10 litters" },
        { key: "eggs", name: "Egg Layer", why: "10 eggs laid" }
      ],
      FAST_SCENE_TYPES: ["canine", "draconic"],
      FAST_SCENE_S: 30,
      // these can fill every 30 seconds in a scene
      STAMINA_FILLS: 3,
      STAMINA_X: 0.6,
      // past 3 fills in an hour, each load is 60% of the one before (pent up / virility skip it)
      HUNGRY_ML: 50,
      HUNGRY_X: 1.25,
      // swallow this much and your own milk and semen fill 25% faster for an hour
      NURSE_SUPPLY_STEP: 0.05,
      NURSE_SUPPLY_MAX: 0.5,
      // each nursin' this week adds 5% to milk made, up to +50%
      JAR_DAYS: 3,
      // bottled seed keeps this long
      RUT_DAY: 6,
      // 0 Sunday … 6 Saturday: fertility doubles, studs pent up twice as fast
      RUT_EMOTE_MIN: 90,
      LEAKY_GAPE: 8,
      // a hole this loose drips its load now and then
      LEAKY_EMOTE_MIN: 30,
      RIGHTS_DAYS: 7,
      RIGHTS_MAX_DAYS: 60,
      // breedin' rights last this long unless the stud asks for other
      MILK_DRUNK_ML: 1e3,
      // drink this much milk in a day and you get sleepy and docile
      /* ── ROLEPLAY TRIGGERS ── what folks say in chat or emotes moves the numbers */
      RP_CUM_WORDS: /\b(cum|cums|cumming|cummin'?|cummed|creampies?|creampied|orgasms?|orgasming|orgasmed|climax(es|ed|ing)?|ejaculat(es?|ed|ing)|spurts?|spurting|unloads?|unloading|breeds?|seeds?|seeding|fills? (her|him|them|it) up|shoots? (her|his|their|a)? ?loads?)\b/i,
      RP_CUM_COOLDOWN_S: 60,
      // one fill per minute per scene, however much they say it
      SCENE_IDLE_MIN: 120,
      // an open breedin' scene closes itself after this long quiet
      RP_NURSE_WORDS: /\b(suck\w*|suckl\w*|nurs\w*|drink\w*|drank|feed\w*|fed|latch\w*)\b/i,
      RP_NURSE_PARTS: /\b(nipples?|teats?|breasts?|boobs?|tits?|udders?|milk|chest)\b/i,
      NURSE_ML: 300,
      // one nursin' drains this much...
      NURSE_SECONDS: 15,
      // ...a little at a time over this many seconds
      NURSE_COOLDOWN_S: 90,
      BLOCK_CHECK: true,
      // ?cum checks the hole (and the stud's penis) isn't locked, plugged or gagged
      // matched against the species on file; litter = [fewest, most]
      SPECIES: {
        cow: { milk: 2, fert: 1, litter: [1, 1] },
        bull: { milk: 1, fert: 1, litter: [1, 1] },
        pony: { milk: 1, fert: 0.8, litter: [1, 1] },
        horse: { milk: 1, fert: 0.8, litter: [1, 1] },
        deer: { milk: 1, fert: 0.9, litter: [1, 1] },
        pig: { milk: 1, fert: 1.3, litter: [4, 10] },
        pup: { milk: 1, fert: 1.2, litter: [3, 8] },
        dog: { milk: 1, fert: 1.2, litter: [3, 8] },
        kitt: { milk: 1, fert: 1.2, litter: [2, 6] },
        cat: { milk: 1, fert: 1.2, litter: [2, 6] },
        goblin: { milk: 1, fert: 1.6, litter: [2, 5] },
        bunny: { milk: 1, fert: 1.5, litter: [4, 8] },
        rabbit: { milk: 1, fert: 1.5, litter: [4, 8] },
        fox: { milk: 1, fert: 1.1, litter: [2, 5] },
        wolf: { milk: 1, fert: 1.1, litter: [3, 6] },
        goat: { milk: 1.5, fert: 1.1, litter: [1, 3] },
        sheep: { milk: 1, fert: 1, litter: [1, 2] },
        default: { milk: 1, fert: 1, litter: [1, 2] }
      },
      // keywords in a crafted item's name or description (worn, or on an injector)
      TAG_WORDS: {
        lactation: ["lactation", "lactating"],
        virility: ["virility"],
        fertility: ["fertility"],
        heat: ["heat inducer", "heat-inducer"],
        suppressant: ["suppressant"],
        contraceptive: ["contraceptive"],
        capacity: ["capacity", "stretching"],
        reducing: ["reducing", "shrinking"]
      },
      LEAK_LINES: [
        "Oh my \u2014 milk's just drippin' from %name%, too full to hold another drop.",
        "%name% is leakin' again, bless their heart. Somebody be a sweetie and get 'em milked.",
        "A little wet patch is spreadin' under %name%. Somebody's way overdue for the milkin' stall!"
      ],
      HEAT_LINES: [
        "%name% squirms against the rails, all flushed and fidgety. Somebody's feelin' warm today!",
        "%name% just can't keep still, rubbin' up on anything that comes close. Shameless, sugar!",
        "A low, needy little sound slips out of %name%. Oh, honey.",
        "%name% presents without even bein' asked, tail up and not one bit shy about it.",
        "The air 'round %name% smells like heat, and y'all, everybody's noticin'."
      ],
      /* ── FARM LIFE ── hours are the bot machine's local clock */
      FEED_HOURS: [8, 18],
      // trough spot ("barn" spot on indoor-weather days)
      CURFEW: { start: 23, end: 7 },
      // stock to the barn spot overnight
      CURFEW_TAKES_BRONZE: false,
      // bronze is never taken at curfew (house rule); true would hold it overnight
      STOCKS_DEFAULT_MIN: 30,
      STOCKS_MAX_MIN: 240,
      TOUR_STOP_S: 25,
      LEASH_TICK_MS: 3e3,
      WEATHER: [
        { key: "sunny", line: "Sun's out over the pasture, y'all! Perfect grazin' weather." },
        { key: "hot", line: "Whew, hot as blazes today! Stock'll be huntin' for shade and water, so keep that trough full, sweeties." },
        { key: "breezy", line: "Nice little breeze today. Keeps the flies off and the hair a-flyin'." },
        { key: "rainy", line: "Rain's comin' down, sugar. Stock eats in the barn today, nice and dry.", indoors: true },
        { key: "storm", line: "Storm's rollin' in! Everybody into the barn and stay put till it passes, hear?", indoors: true },
        { key: "foggy", line: "Fog's thick as gravy today. Can't see the far fence, so stay close to me, darlin's." }
      ],
      /* ── WORK & PLAY ── */
      SHIFT_IDLE_MIN: 30,
      // quiet this long on the clock = clocked out
      CHORE_EVERY_MIN: 45,
      CHORES: [
        "Refill the trough for me, hon.",
        "Muck out the stalls. I know, I know, but somebody's gotta!",
        "Go check on the new stock and make 'em feel welcome.",
        "Walk the fence line and make sure nobody's wandered off.",
        "Brush down whoever's in the barn. Gently, now!",
        "Restock the milkin' room, sweetie.",
        "Do a quick headcount out in the pasture."
      ],
      BEG_PHRASE: "please, Farmhand",
      BEG_COOLDOWN_MIN: 10,
      TREATS: [
        "Here ya go, %name%, a sugar cube just for you. Don't say I never spoil ya!",
        "C'mere, %name%. A good long scratch behind the ears for my sweet animal.",
        "An apple slice for you, %name%. Chew it slow and savor it, hon.",
        "A pat on the flank, %name%. You asked so nice!"
      ],
      FAIR_PRIZE_DAYS: 7,
      ANNIVERSARY_ENABLED: true,
      NOTICE_ON_JOIN: true,
      // whisper the notice board to people as they walk in
      /* ── SAFETY ── */
      SAFETY_REQUIRE_IN_ROOM: true,
      // ?safe / ?stuck only work for people inside the farm
      DEFAULT_CLAIM_TYPE: "perm",
      DEFAULT_TEMP_DAYS: 7,
      CLAIM_EXPIRY_WARN_H: 24,
      STUCK_COOLDOWN_MIN: 3,
      RESCUE_POINT: { X: 20, Y: 30 },
      GREET_ENABLED: true,
      LSCG_SPLATTERS: true,
      CONTRACT_NICKNAME: "BnB {Species} {name}",
      // the nickname the farm's contracts give: {name} {Species} {species} {pet}          // finishes over somebody draw LSCG's splatters on them (if their LSCG has splatters on)
      SHOW_BADGE: true,
      DEBUG: true,
      LOG_HEARD: true
    };
    const W = typeof unsafeWindow !== "undefined" && unsafeWindow ? unsafeWindow : window;
    const TAG = "[Farmhand]";
    const log = (...a) => console.log(TAG, ...a);
    const dbg = (...a) => {
      if (CFG.DEBUG) console.log(TAG, ...a);
    };
    const warn = (...a) => console.warn(TAG, ...a);
    const ROLE = {
      PROPRIETOR: "PROPRIETOR",
      HERDMASTER: "HERDMASTER",
      MANDATED: "MANDATED",
      FARMHAND: "FARMHAND",
      LIVESTOCK: "LIVESTOCK",
      GUEST: "GUEST",
      LUXURY: "LUXURY",
      GLORYHOLE: "GLORYHOLE"
    };
    const ROLE_ORDER = [
      "PROPRIETOR",
      "HERDMASTER",
      "MANDATED",
      "FARMHAND",
      "LIVESTOCK",
      "LUXURY",
      "GUEST",
      "GLORYHOLE"
    ];
    const ALL_TIERS = ["bronze", "silver", "gold"];
    const state = {
      companions: /* @__PURE__ */ new Map(),
      lastPing: 0,
      booted: false,
      loginTried: 0,
      lastLoginAttempt: 0,
      lastRoomAttempt: 0,
      greeted: /* @__PURE__ */ new Map(),
      cooldowns: /* @__PURE__ */ new Map(),
      queue: [],
      urgent: [],
      sending: false,
      badge: null,
      lastSnapshot: 0,
      sessions: /* @__PURE__ */ new Map(),
      pendingClaims: /* @__PURE__ */ new Map(),
      breedAsks: /* @__PURE__ */ new Map(),
      breedOk: /* @__PURE__ */ new Map(),
      jarAsks: /* @__PURE__ */ new Map(),
      lastSynced: /* @__PURE__ */ new Map(),
      lastFullSync: 0,
      stuckCooldown: /* @__PURE__ */ new Map(),
      summonCooldown: /* @__PURE__ */ new Map(),
      heard: 0,
      lastKeepalive: 0,
      lastNudge: 0,
      lastHealthy: Date.now(),
      worker: null,
      reloading: false,
      arrivals: /* @__PURE__ */ new Map(),
      teaseNext: /* @__PURE__ */ new Map(),
      scenes: /* @__PURE__ */ new Map(),
      leashes: /* @__PURE__ */ new Map(),
      tours: /* @__PURE__ */ new Map(),
      lastSpoke: /* @__PURE__ */ new Map()
    };
    const LEDGER_KEY = "bnb_ledger_v1";
    let L = null;
    function blankLedger() {
      return {
        v: 4,
        people: {},
        applications: [],
        archive: {},
        log: [],
        stuckLog: [],
        rescuePoint: null,
        createdAt: Date.now()
      };
    }
    function loadLedger() {
      try {
        const raw = GM_getValue(LEDGER_KEY, "");
        L = raw ? JSON.parse(raw) : blankLedger();
        if (!L || typeof L !== "object") L = blankLedger();
      } catch (e) {
        warn("Ledger load failed:", e);
        L = blankLedger();
      }
      if (!L.people) L.people = {};
      if (!L.applications) L.applications = [];
      if (!L.archive) L.archive = {};
      if (!L.log) L.log = [];
      if (!L.stuckLog) L.stuckLog = [];
      if (!L.spots || typeof L.spots !== "object") L.spots = {};
      if (L.rescuePoint && !L.spots.rescue) L.spots.rescue = { X: L.rescuePoint.X, Y: L.rescuePoint.Y, by: 0, at: Date.now() };
      if (!Array.isArray(L.tease)) L.tease = [];
      if (L.notice === void 0) L.notice = null;
      if (!L.life) L.life = { feedingOn: true, curfewOn: true };
      for (const r of Object.values(L.people || {})) if (r && r.species === "kitt") r.species = "kitty";
      if (!Array.isArray(L.chores)) L.chores = CFG.CHORES.map((text) => ({ text, by: 0 }));
      if (!Array.isArray(L.wheel)) L.wheel = [];
      if (L.zones && (typeof L.zones !== "object" || Object.values(L.zones).some((z) => !z || typeof z !== "object" || !("group" in z)))) delete L.zones;
      for (const k in L.people) {
        const r = L.people[k];
        if (r.forced === void 0) r.forced = false;
        if (!Array.isArray(r.tempKeys)) r.tempKeys = [];
        if (!Array.isArray(r.cover)) r.cover = [];
        if (!Array.isArray(r.herds)) {
          r.herds = r.herd ? [{
            leader: r.herd,
            type: r.herdType || "perm",
            since: r.herdSince || Date.now(),
            ends: r.herdEnds || null,
            warned: !!r.herdWarned
          }] : [];
        }
        delete r.herd;
        delete r.herdType;
        delete r.herdSince;
        delete r.herdEnds;
        delete r.herdWarned;
      }
      L.v = 5;
      for (const mn of CFG.PROPRIETORS) {
        if (!L.people[mn]) L.people[mn] = newRecord(mn);
        if (!L.people[mn].roles.includes(ROLE.PROPRIETOR)) L.people[mn].roles.push(ROLE.PROPRIETOR);
      }
      saveLedger();
      log("Ledger v5 loaded. Registered: " + Object.keys(L.people).length);
    }
    let saveTimer = null;
    function saveLedger() {
      if (state.dormant) return;
      if (saveTimer) return;
      saveTimer = later(() => {
        saveTimer = null;
        if (!officeCheck()) return;
        try {
          GM_setValue(LEDGER_KEY, JSON.stringify(L));
        } catch (e) {
          warn("save:", e);
        }
      }, 1500);
    }
    function newRecord(mn) {
      return {
        mn,
        name: "",
        roles: [],
        onDuty: true,
        forced: false,
        species: "",
        herds: [],
        herdWord: "",
        goldKey: false,
        pastureLock: null,
        stayType: "",
        stayEnds: null,
        contractSigned: false,
        registeredAt: Date.now(),
        notes: "",
        limits: "",
        triggers: "",
        aftercare: "",
        cover: [],
        pastureNote: "",
        tempKeys: [],
        tier: "",
        brand: null,
        teaseOptIn: false,
        annivYear: 0
      };
    }
    function rec(mn, create) {
      if (!L.people[mn] && create) L.people[mn] = newRecord(mn);
      return L.people[mn] || null;
    }
    function audit(actor, action, detail) {
      L.log.push({ t: Date.now(), by: actor, a: action, d: detail || "" });
      if (L.log.length > 500) L.log = L.log.slice(-500);
      saveLedger();
    }
    function hasRole(mn, role) {
      const r = rec(mn);
      return !!r && r.roles.includes(role);
    }
    function isProprietor(mn) {
      return mn === CFG.BOT_MEMBER || CFG.PROPRIETORS.includes(mn) || hasRole(mn, ROLE.PROPRIETOR);
    }
    function isHerdmaster(mn) {
      return isProprietor(mn) || hasRole(mn, ROLE.HERDMASTER);
    }
    function isMandated(mn) {
      return hasRole(mn, ROLE.MANDATED);
    }
    function isStaff(mn) {
      return isHerdmaster(mn) || hasRole(mn, ROLE.FARMHAND) || isMandated(mn);
    }
    function herdCap(mn) {
      if (isProprietor(mn)) return CFG.HERD_CAP.PROPRIETOR;
      if (hasRole(mn, ROLE.HERDMASTER)) return CFG.HERD_CAP.HERDMASTER;
      if (hasRole(mn, ROLE.FARMHAND) || isMandated(mn)) return CFG.HERD_CAP.FARMHAND;
      return 0;
    }
    function canHoldHerd(mn) {
      return herdCap(mn) > 0;
    }
    function onDuty(mn) {
      const r = rec(mn);
      return r ? r.onDuty !== false : false;
    }
    function keysOf(mn) {
      const r = rec(mn);
      if (!r) return [];
      const k = /* @__PURE__ */ new Set();
      const duty = r.onDuty !== false;
      for (const role of r.roles) {
        switch (role) {
          case ROLE.PROPRIETOR:
            k.add("bronze");
            if (duty) {
              k.add("silver");
              k.add("gold");
            }
            break;
          case ROLE.HERDMASTER:
            k.add("bronze");
            if (duty) {
              k.add("silver");
              if (r.goldKey) k.add("gold");
            }
            break;
          case ROLE.MANDATED:
          case ROLE.FARMHAND:
            k.add("bronze");
            if (duty) k.add("silver");
            break;
          case ROLE.LIVESTOCK:
          case ROLE.LUXURY:
            k.add("bronze");
            break;
          case ROLE.GLORYHOLE:
            break;
        }
      }
      const now = Date.now();
      if (CFG.CURFEW_TAKES_BRONZE && typeof curfewBound === "function" && L.life && curfewBound(mn)) k.delete("bronze");
      r.tempKeys = (r.tempKeys || []).filter((t) => !t.until || t.until > now);
      for (const t of r.tempKeys) k.add(t.tier);
      return Array.from(k);
    }
    function keyString(mn) {
      const k = keysOf(mn);
      if (!k.length) return "no keys";
      const m = { bronze: "\u{1F949} bronze", silver: "\u{1F948} silver", gold: "\u{1F947} gold" };
      return ALL_TIERS.slice().reverse().filter((t) => k.includes(t)).map((t) => m[t]).join("  ");
    }
    const ROLE_PRETTY = {
      PROPRIETOR: "Proprietor",
      HERDMASTER: "Herdmaster",
      MANDATED: "Mandated Farmhand",
      FARMHAND: "Farmhand",
      LIVESTOCK: "Livestock",
      GUEST: "Guest",
      LUXURY: "Luxury Guest",
      GLORYHOLE: "Installed"
    };
    function roleString(mn) {
      const r = rec(mn);
      if (!r || !r.roles.length) return "visitor";
      let s = r.roles.map((x) => ROLE_PRETTY[x] || x).join(" + ");
      if (r.goldKey && r.roles.includes(ROLE.HERDMASTER)) s += " \u{1F947}";
      if (r.onDuty === false) s += r.pastureLock ? " (kept out in pasture \u{1F512})" : " (turned out to pasture)";
      if (isMandated(mn)) s += " \u{1F517}mandated";
      else if (r.forced) s += " \u{1F517}on call";
      return s;
    }
    function tierOf(mn) {
      const r = rec(mn);
      if (!r) return "";
      if (r.tier) return r.tier;
      return r.roles.includes(ROLE.LIVESTOCK) ? "new" : "";
    }
    function tierName(t) {
      return CFG.TIER_PRETTY[t] || t;
    }
    function parseTier(word) {
      const w = String(word || "").toLowerCase().replace(/[^a-z]/g, "");
      if (w === "newstock" || w === "new") return "new";
      return CFG.TIERS.find((t) => t === w) || null;
    }
    function brandTag(mn) {
      const r = rec(mn);
      return r && r.brand ? " [" + r.brand.mark + "]" : "";
    }
    function herdsOf(mn) {
      const r = rec(mn);
      return r && Array.isArray(r.herds) ? r.herds : [];
    }
    function membership(mn, leader) {
      return herdsOf(mn).find((h) => h.leader === leader) || null;
    }
    function herdMembers(leader) {
      return Object.values(L.people).filter((r) => (r.herds || []).some((h) => h.leader === leader));
    }
    function herdWord(leader) {
      const r = rec(leader);
      return r && r.herdWord || CFG.HERD_WORD_DEFAULT;
    }
    function herdLeaderOf(mn) {
      const h = herdsOf(mn)[0];
      return h ? h.leader : null;
    }
    function herdLabel(h) {
      if (!h) return "";
      if (h.type === "temp") {
        if (!h.ends) return "temp";
        const left = h.ends - Date.now();
        if (left <= 0) return "temp (expired)";
        const d = Math.floor(left / 864e5);
        const hr = Math.floor(left % 864e5 / 36e5);
        return "temp \u2014 " + (d ? d + "d " : "") + hr + "h left";
      }
      return "perm";
    }
    function herdsLine(mn) {
      return herdsOf(mn).map((h) => plainName(h.leader) + "'s " + herdWord(h.leader) + " (" + herdLabel(h) + ")").join(", ");
    }
    function addToHerd(mn, leader, type, days) {
      const r = rec(mn, true);
      r.herds = (r.herds || []).filter((h) => h.leader !== leader);
      const temp = type === "temp";
      r.herds.push({
        leader,
        type: temp ? "temp" : "perm",
        since: Date.now(),
        ends: temp ? Date.now() + (days || CFG.DEFAULT_TEMP_DAYS) * 864e5 : null,
        warned: false
      });
      if (!isStaff(mn) && !r.roles.includes(ROLE.LIVESTOCK)) r.roles.push(ROLE.LIVESTOCK);
      saveLedger();
      return r;
    }
    function removeFromHerd(mn, leader) {
      const r = rec(mn);
      if (!r) return false;
      const before = (r.herds || []).length;
      r.herds = (r.herds || []).filter((h) => h.leader !== leader);
      if (r.herds.length !== before) {
        saveLedger();
        return true;
      }
      return false;
    }
    function claimBlocker(leader, t) {
      if (!canHoldHerd(leader)) return "Sorry, sweetie, only staff and proprietors get to keep a " + herdWord(leader) + ".";
      if (t === leader) return "Aw, you can't claim yourself, sugar!";
      const already = membership(t, leader);
      const size = herdMembers(leader).length;
      if (!already && size >= herdCap(leader))
        return "Your " + herdWord(leader) + " is plumb full, hon \u2014 " + size + "/" + herdCap(leader) + ". ?release somebody first to make room (like ?release Bessie).";
      if (isStaff(t) || isProprietor(t)) {
        if (!isHerdmaster(leader)) return "Staff and proprietors can only go in a herdmaster's or herdmistress's " + herdWord(leader) + ", sweetie.";
        const other = herdsOf(t).find((h) => h.leader !== leader);
        if (other) return plainName(t) + " already belongs to " + plainName(other.leader) + ", hon, and staff only answer to one leader.";
      }
      return null;
    }
    function expireHerdClaims() {
      const now = Date.now();
      for (const k in L.people) {
        const r = L.people[k];
        for (const h of (r.herds || []).slice()) {
          if (h.type !== "temp" || !h.ends) continue;
          if (now >= h.ends) {
            removeFromHerd(r.mn, h.leader);
            audit(CFG.BOT_MEMBER, "HERD_EXPIRE", r.mn + " was " + h.leader + "'s");
            beep(r.mn, "\u{1F33E} Your temporary spell in " + plainName(h.leader) + "'s " + herdWord(h.leader) + " is all done, " + plainName(r.mn) + ". You're still ours, sweetie, just not claimed by them anymore.");
            beep(h.leader, "\u{1F33E} " + plainName(r.mn) + "'s temporary claim just ran out, hon. ?claim " + r.mn + " again if you want 'em back.");
          } else if (!h.warned && h.ends - now < CFG.CLAIM_EXPIRY_WARN_H * 36e5) {
            h.warned = true;
            saveLedger();
            beep(h.leader, "\u23F3 Heads up, sugar: " + plainName(r.mn) + "'s temporary claim runs out in less than a day. ?claim " + r.mn + " perm to keep 'em for good.");
          }
        }
      }
    }
    function canLockOut(actor, t) {
      const extra = CFG.PASTURE_LOCKABLE[t];
      const leader = herdLeaderOf(t);
      if (CFG.PASTURE_LOCK_CLAIMED_STAFF && leader === actor && (isStaff(t) || isProprietor(t))) return true;
      if (!extra) return false;
      return leader === actor || extra.includes(actor);
    }
    function canLetUp(actor, t) {
      const r = rec(t);
      if (!r || !r.pastureLock) return false;
      const extra = CFG.PASTURE_LOCKABLE[t] || [];
      if (extra.includes(actor)) return true;
      const leader = herdLeaderOf(t);
      if (leader) return leader === actor;
      return r.pastureLock.by === actor;
    }
    function botIsAdmin() {
      try {
        if (typeof W.ChatRoomPlayerIsAdmin === "function") return !!W.ChatRoomPlayerIsAdmin();
        const admins = W.ChatRoomData && W.ChatRoomData.Admin || [];
        return admins.includes(CFG.BOT_MEMBER);
      } catch (e) {
        return false;
      }
    }
    function pushKeys(mn, tiers, quiet) {
      if (!CFG.KEY_SYNC_ENABLED) return false;
      if (!botIsAdmin()) return false;
      if (!charFor(mn)) return false;
      const want = new Set(tiers);
      const dictionary = ALL_TIERS.map((t) => ({ Tag: "MapViewChangeKey", Key: t, Bool: want.has(t) }));
      send("ChatRoomChat", {
        Content: "ChatRoomMapViewChangeKey",
        Type: "Hidden",
        Dictionary: dictionary,
        Target: mn
      });
      dbg("KEYS \u2192", mn, Array.from(want).join("+") || "none");
      const sig = ALL_TIERS.filter((t) => want.has(t)).join(",");
      const prev = state.lastSynced.get(mn);
      state.lastSynced.set(mn, sig);
      if (!quiet && CFG.TELL_ON_KEY_CHANGE && prev !== void 0 && prev !== sig) {
        beep(mn, "\u{1F511} Your keys just changed, hon: " + (sig ? keyString(mn) : "none right now, so no doors'll open for you just yet."));
      }
      return true;
    }
    function syncKeys(mn, quiet) {
      return pushKeys(mn, keysOf(mn), quiet);
    }
    function syncAllPresent(quiet) {
      let n = 0;
      for (const C of W.ChatRoomCharacter || []) {
        if (C.MemberNumber === CFG.BOT_MEMBER) continue;
        if (syncKeys(C.MemberNumber, quiet)) n++;
      }
      state.lastFullSync = Date.now();
      return n;
    }
    function spotFor(name) {
      const n = String(name || "").toLowerCase();
      return L.spots && L.spots[n] || null;
    }
    function firstSpot(...names) {
      for (const n of names) {
        const p = spotFor(n);
        if (p) return p;
      }
      return null;
    }
    function isOnBooks(mn) {
      if (mn === CFG.BOT_MEMBER) return false;
      const r = rec(mn);
      return CFG.PROPRIETORS.includes(mn) || !!(r && r.roles && r.roles.length);
    }
    function whitelistSync(force) {
      if (!inRoom() || !botIsAdmin() || !W.ChatRoomData) return;
      if (!force && Date.now() - (state.wlAt || 0) < 2e4) return;
      state.wlAt = Date.now();
      const wl = new Set((W.ChatRoomData.Whitelist || []).map(Number));
      L.wlAdded = L.wlAdded || {};
      let changed = 0;
      state.wlSent = state.wlSent || /* @__PURE__ */ new Map();
      const recent = (mn, act) => {
        const s = state.wlSent.get(mn);
        return s && s.act === act && Date.now() - s.at < 12e4;
      };
      const ask = (mn, act) => {
        send("ChatRoomAdmin", { MemberNumber: mn, Action: act });
        state.wlSent.set(mn, { act, at: Date.now() });
        changed++;
      };
      const people = new Set(Object.keys(L.people).map(Number).concat(CFG.PROPRIETORS));
      for (const mn of people) {
        if (changed >= 15) break;
        if (isOnBooks(mn) && !wl.has(mn)) {
          L.wlAdded[mn] = L.wlAdded[mn] || Date.now();
          wl.add(mn);
          if (!recent(mn, "Whitelist")) ask(mn, "Whitelist");
        }
      }
      for (const k of Object.keys(L.wlAdded)) {
        const mn = Number(k);
        if (changed >= 15) break;
        if (isOnBooks(mn)) continue;
        if (wl.has(mn) && !recent(mn, "Unwhitelist")) ask(mn, "Unwhitelist");
        delete L.wlAdded[k];
      }
      if (changed) saveLedger();
    }
    function teleport(mn, pt, urgent, force) {
      if (!pt || !charFor(mn)) return false;
      if (!force && mn !== CFG.BOT_MEMBER && canLead(mn)) return lead(mn, pt, urgent);
      return teleportNow(mn, pt, urgent);
    }
    function teleportNow(mn, pt, urgent, tries) {
      if (!pt || !botIsAdmin() || !charFor(mn)) return false;
      send("ChatRoomChat", {
        Content: "ChatRoomMapViewTeleport",
        Type: "Hidden",
        Dictionary: [{ Tag: "MapViewTeleport", Position: { X: pt.X, Y: pt.Y } }],
        Target: mn
      }, urgent);
      state.tpCheck = state.tpCheck || /* @__PURE__ */ new Map();
      const id = Symbol("tp");
      state.tpCheck.set(mn, id);
      later(() => {
        if (state.tpCheck.get(mn) !== id) return;
        const C = charFor(mn), p = C && C.MapData && C.MapData.Pos;
        if (!C || !p || Math.abs(p.X - pt.X) <= 1 && Math.abs(p.Y - pt.Y) <= 1) {
          state.tpCheck.delete(mn);
          return;
        }
        if ((tries || 0) < 1) {
          log("Teleport of " + mn + " didn't take; sendin' it again.");
          teleportNow(mn, pt, urgent, (tries || 0) + 1);
        } else {
          state.tpCheck.delete(mn);
          warn("Teleport of " + mn + " to " + pt.X + "," + pt.Y + " didn't take twice (they're at " + p.X + "," + p.Y + ").");
        }
      }, 12e3);
      return true;
    }
    function spotBeside(mn) {
      const C = charFor(mn), p = C && C.MapData && C.MapData.Pos;
      if (!p) return null;
      const taken = new Set((W.ChatRoomCharacter || []).filter((c) => c.MapData && c.MapData.Pos).map((c) => c.MapData.Pos.X + "," + c.MapData.Pos.Y));
      const wide = W.ChatRoomMapViewWidth || 40, high = W.ChatRoomMapViewHeight || 40;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
        const x = p.X + dx, y = p.Y + dy;
        if (x < 0 || y < 0 || x >= wide || y >= high || taken.has(x + "," + y)) continue;
        let blocked = false;
        try {
          if (typeof W.ChatRoomMapViewPositionIsBlocked === "function") blocked = !!W.ChatRoomMapViewPositionIsBlocked(x, y);
        } catch (e) {
        }
        if (!blocked) return { X: x, Y: y };
      }
      return { X: p.X, Y: p.Y };
    }
    function rescueTeleport(mn) {
      const pt = firstSpot("rescue", "stuck") || CFG.RESCUE_POINT;
      if (!botIsAdmin()) {
        beep(mn, "I'm sorry, hon, I can't move you right now because I've lost my room admin rights. Please call a proprietor or staff and they'll get you out.");
        return false;
      }
      return teleport(mn, pt, true, true);
    }
    function forcedStaff() {
      const out = [];
      for (const k in L.people) {
        const mn = parseInt(k, 10);
        const r = L.people[k];
        if (!r) continue;
        if (!isStaff(mn)) continue;
        if (!onDuty(mn)) continue;
        if (isMandated(mn) || r.forced) out.push(mn);
      }
      return out;
    }
    function summon(mn, reason, calledBy, spot) {
      if (!CFG.SUMMON_ENABLED) return false;
      const now = Date.now();
      const last = state.summonCooldown.get(mn) || 0;
      if (now - last < CFG.SUMMON_COOLDOWN_MIN * 6e4) return false;
      state.summonCooldown.set(mn, now);
      state.arrivals.set(mn, { spot: spot || "summon", until: now + 15 * 6e4 });
      const msg = CFG.SUMMON_MESSAGE.replace(/%room%/g, currentRoomName());
      send("AccountBeep", {
        MemberNumber: mn,
        BeepType: CFG.SUMMON_BEEPTYPE,
        Message: msg
      }, true);
      log("SUMMONED " + plainName(mn) + " (" + mn + ") \u2014 " + reason);
      audit(calledBy || CFG.BOT_MEMBER, "SUMMON", mn + " \u2014 " + reason);
      beep(
        mn,
        "\u{1F33E} You've been summoned to " + currentRoomName() + ", hon!\n" + reason + "\n\n" + (isMandated(mn) ? "You're mandated, sugar, so pull your boots on and come on down!" : "You put yourself on call, sweetie, so boots on and come on down!"),
        true
      );
      return true;
    }
    function summonHelp(reason, calledBy, urgent, spot) {
      if (!CFG.SUMMON_ENABLED) return 0;
      const pool = forcedStaff().filter((mn) => mn !== calledBy);
      if (!pool.length) return 0;
      const away = pool.filter((mn) => !charFor(mn));
      const here = pool.filter((mn) => charFor(mn));
      const order = away.sort((a, b) => (isMandated(b) ? 1 : 0) - (isMandated(a) ? 1 : 0)).concat(urgent ? here : []);
      let n = 0;
      for (const mn of order) {
        if (n >= CFG.SUMMON_MAX_PER_CALL) break;
        if (summon(mn, reason, calledBy, spot)) n++;
      }
      return n;
    }
    function isFriend(mn) {
      try {
        return (W.Player.FriendList || []).includes(mn);
      } catch (e) {
        return false;
      }
    }
    function canBeep(mn) {
      const m = state.mutual;
      if (m && Date.now() - m.at < 5 * 6e4) return m.set.has(mn);
      return false;
    }
    function askMutual() {
      try {
        W.ServerSend("AccountQuery", { Query: "OnlineFriends" });
      } catch (e) {
        warn("friends query:", e);
      }
    }
    function findCommand(tag) {
      try {
        return (W.Commands || []).find((x) => x && x.Tag && x.Tag.toLowerCase().replace(/^\//, "") === tag.toLowerCase());
      } catch (e) {
        return null;
      }
    }
    function addFriend(mn, quiet) {
      if (!CFG.AUTO_FRIEND || !mn || mn === CFG.BOT_MEMBER) return false;
      try {
        if (mn === W.Player.MemberNumber) return false;
      } catch (e) {
        return false;
      }
      if (isFriend(mn)) return false;
      let ok = false;
      try {
        const cmd = findCommand("friendlistadd");
        if (cmd && typeof cmd.Action === "function") {
          cmd.Action(String(mn), "/friendlistadd " + mn, [String(mn)]);
          ok = true;
          log("addFriend via /friendlistadd \u2192 " + mn);
        }
      } catch (e) {
        warn("friend route 1:", e);
      }
      if (!ok) {
        try {
          if (typeof W.ChatRoomListUpdate === "function") {
            W.ChatRoomListUpdate(W.Player.FriendList, true, mn, "FriendRequest", false);
            ok = true;
            log("addFriend via ChatRoomListUpdate \u2192 " + mn);
          }
        } catch (e) {
          warn("friend route 2:", e);
        }
      }
      if (!ok) {
        try {
          if (!Array.isArray(W.Player.FriendList)) W.Player.FriendList = [];
          W.Player.FriendList.push(mn);
          W.ServerSend("AccountUpdate", { FriendList: W.Player.FriendList });
          ok = true;
          warn("addFriend via raw AccountUpdate \u2192 " + mn);
        } catch (e) {
          warn("friend route 3:", e);
        }
      }
      if (ok && !quiet) {
        later(() => beep(
          mn,
          "\u{1F33E} You're on the farm office's friend list now, " + plainName(mn) + "! \u{1F495}\n\nBeep me any time, from anywhere on the property \u2014 wedged in a corner, hogtied, muzzled, it don't matter one bit. I read gag-talk just fine, sweetie.\n\n\u{1F534} Beep 'safe' and everything stops.\nBeep 'help' for everything else."
        ), 1500);
      }
      return ok;
    }
    function getCreds() {
      return { user: GM_getValue("bnb_user", ""), pass: GM_getValue("bnb_pass", "") };
    }
    function promptCreds() {
      const u = W.prompt("Bot account NAME:", GM_getValue("bnb_user", ""));
      if (u === null) return;
      const p = W.prompt("Bot account PASSWORD:");
      if (p === null) return;
      GM_setValue("bnb_user", u.trim());
      GM_setValue("bnb_pass", p);
      GM_setValue("bnb_login_bad", "");
      W.alert("Saved. Reload the page.");
    }
    function clearCreds() {
      GM_setValue("bnb_user", "");
      GM_setValue("bnb_pass", "");
      W.alert("Cleared.");
    }
    function statusText() {
      const c = getCreds();
      let fl = "-";
      try {
        fl = (W.Player.FriendList || []).length;
      } catch (e) {
      }
      const mins = Math.round((Date.now() - state.lastHealthy) / 6e4);
      return "Farmhand v" + VERSION + "\n\nGame found:   " + (typeof W.ServerSend === "function") + "\nLogged in:    " + isLoggedIn() + "\nIn room:      " + inRoom() + "\nRoom admin:   " + botIsAdmin() + "\nTimer:        " + (state.worker ? "worker \u2705" : "setInterval \u26A0\uFE0F") + "\nLast healthy: " + mins + " min ago\nFriends:      " + fl + "\nHeard msgs:   " + state.heard + "\nCompanions:   " + companionCount() + "\nSend queue:   " + state.queue.length + (state.urgent.length ? " (+" + state.urgent.length + " urgent)" : "") + "\nMap saved:    " + (L && L.roomSnapshot ? new Date(L.roomSnapshot.at).toLocaleString() : "not yet") + "\nRegistered:   " + Object.keys(L ? L.people : {}).length + "\nOn call:      " + forcedStaff().length + "\nPending apps: " + (L ? L.applications.length : 0) + "\nUser saved:   " + (c.user ? "yes (" + c.user + ")" : "NO");
    }
    function exportLedger() {
      const txt = JSON.stringify(L, null, 2);
      console.log(TAG + " ===== LEDGER BACKUP BEGIN =====");
      console.log(txt);
      console.log(TAG + " ===== LEDGER BACKUP END =====");
      try {
        const blob = new Blob([txt], { type: "application/json" });
        const a = W.document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "bnb-ledger-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ".json";
        a.click();
      } catch (e) {
        warn("download:", e);
      }
      return "Ledger exported.";
    }
    try {
      GM_registerMenuCommand("Farmhand: set bot login", promptCreds);
      GM_registerMenuCommand("Farmhand: clear bot login", clearCreds);
      GM_registerMenuCommand("Farmhand: status", () => W.alert(statusText()));
      GM_registerMenuCommand("Farmhand: export ledger", exportLedger);
      GM_registerMenuCommand("Farmhand: resync all keys", () => W.alert("Synced " + syncAllPresent(true) + " people."));
      GM_registerMenuCommand("Farmhand: friend everyone registered", () => {
        let n = 0;
        for (const mn in L.people) if (addFriend(parseInt(mn, 10), true)) n++;
        W.alert("Friended " + n + " new. Total: " + (W.Player.FriendList || []).length);
      });
      GM_registerMenuCommand("Farmhand: force reload", () => W.location.reload());
    } catch (e) {
      warn("menu:", e);
    }
    W.FarmhandSetLogin = promptCreds;
    W.FarmhandStatus = () => {
      console.log(statusText());
      return statusText();
    };
    W.FarmhandExport = exportLedger;
    W.FarmhandLedger = () => L;
    if (W.__FARMHAND_TEST__) Object.assign(W, { __st: () => state, __cfg: CFG, __pt: prodTick, __qt: quotaTick, __lt: leashTick, __ms: milkingStallTick, __vt: voiceTick, __sync: syncCompanions, __gt: gearTick, __ht: homeTick, __addons: (h, ...a) => addonsEmit(h, ...a), __stateFor: (mn) => stateFor(mn), __leadTick: () => leadTick(), __ambient: () => ambientTick(), __about: (t) => aboutWhom(t), __announce: (t) => announce(t), __reply: (mn, t, ch) => reply(mn, t, ch), __office: () => officeCheck(), __namesHere: (t) => namesHere(t), __speciesCheck: (t) => QUESTIONS.find((q) => q.key === "species").check(t), __attach: () => attachListeners(), __tryLogin: () => tryLogin(), __beepText: (m) => beepText(m), __nameOnce: (t, mn) => nameOnce(t, mn), __buildContract: (n, mn, d) => buildContract(contractTemplate(n), mn, d) });
    W.FarmhandSyncKeys = () => syncAllPresent(true);
    W.FarmhandFriends = () => W.Player.FriendList;
    W.FarmhandAddFriend = (mn) => addFriend(mn, false);
    W.FarmhandOnCall = () => forcedStaff();
    function makeBadge() {
      if (!CFG.SHOW_BADGE || state.badge) return;
      const d = W.document.createElement("div");
      d.textContent = "\u{1F33E} Farmhand: starting\u2026";
      d.style.cssText = [
        "position:fixed",
        "top:4px",
        "left:4px",
        "z-index:2147483647",
        "background:rgba(20,15,10,.88)",
        "color:#ffd98a",
        "font:12px/1.4 monospace",
        "padding:5px 9px",
        "border:1px solid #8a6a3a",
        "border-radius:5px",
        "cursor:pointer",
        "user-select:none",
        "max-width:320px"
      ].join(";");
      d.title = "Click: set login \u2022 Shift+Click: status";
      d.addEventListener("click", (ev) => ev.shiftKey ? W.alert(statusText()) : promptCreds());
      W.document.body.appendChild(d);
      state.badge = d;
    }
    function setBadge(t, c) {
      if (!state.badge) return;
      state.badge.textContent = "\u{1F33E} " + t;
      state.badge.style.color = c || "#ffd98a";
    }
    const INSTANCE_ID = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const LOCK_KEY = "bnb_office_lock", LOCK_FRESH_MS = 45e3;
    function officeCheck() {
      let me = 0;
      try {
        me = W.Player && W.Player.MemberNumber;
      } catch (e) {
      }
      if (me && me !== CFG.BOT_MEMBER) {
        if (state.dormant !== "account") {
          state.dormant = "account";
          warn("This is account " + me + ", not the farm bot (" + CFG.BOT_MEMBER + "). The Farmhand Bot script stays off here.");
        }
        return false;
      }
      let lock = null;
      try {
        lock = JSON.parse(GM_getValue(LOCK_KEY, "null"));
      } catch (e) {
      }
      const now = Date.now();
      if (lock && lock.id !== INSTANCE_ID && now - lock.at < LOCK_FRESH_MS) {
        if (state.dormant !== "copy") {
          state.dormant = "copy";
          warn("Another copy of the Farmhand Bot is already running the farm (another tab or browser). This one stays quiet.");
        }
        return false;
      }
      if (state.dormant) {
        const was = state.dormant;
        state.dormant = null;
        if (was === "copy") {
          loadLedger();
          log("Took over the farm office; re-read the books.");
        }
      }
      try {
        GM_setValue(LOCK_KEY, JSON.stringify({ id: INSTANCE_ID, at: now }));
      } catch (e) {
      }
      return true;
    }
    function isLoggedIn() {
      try {
        return !!(W.Player && W.Player.MemberNumber);
      } catch (e) {
        return false;
      }
    }
    function currentRoomName() {
      try {
        if (W.ChatRoomData && W.ChatRoomData.Name) return W.ChatRoomData.Name;
        if (W.ChatRoomName) return W.ChatRoomName;
      } catch (e) {
      }
      return "";
    }
    function inRoom() {
      try {
        if (!Array.isArray(W.ChatRoomCharacter) || !W.ChatRoomCharacter.length) return false;
        return currentRoomName().toLowerCase() === CFG.ROOM_NAME.toLowerCase();
      } catch (e) {
        return false;
      }
    }
    function socketAlive() {
      try {
        return !!(W.ServerSocket && W.ServerSocket.connected !== false);
      } catch (e) {
        return false;
      }
    }
    const credPrint = (user, pass) => {
      let h = 5381;
      for (const ch of String(user) + "\n" + String(pass)) h = (h << 5) + h + ch.charCodeAt(0) | 0;
      return String(h);
    };
    function loginRefused() {
      const { user, pass } = getCreds();
      if (!user || !pass || Date.now() - state.lastLoginAttempt > 2e4) return;
      GM_setValue("bnb_login_bad", credPrint(user, pass));
      warn("The game refused the saved login (wrong name or password). The bot won't try it again; log in by hand, or save the right one in the Tampermonkey menu.");
    }
    function tryLogin() {
      const { user, pass } = getCreds();
      if (!user || !pass) {
        setBadge("no login saved \u2014 click me", "#ff9b9b");
        return;
      }
      if (GM_getValue("bnb_login_bad", "") === credPrint(user, pass)) {
        setBadge("saved login refused \u2014 log in by hand, or fix it in the Tampermonkey menu", "#ff9b9b");
        return;
      }
      const now = Date.now();
      if (now - state.lastLoginAttempt < (state.loginTried >= 3 ? 12e4 : 15e3)) return;
      try {
        const a = W.document.activeElement;
        if (a && (a.id === "InputName" || a.id === "InputPassword")) {
          setBadge("waitin' while somebody logs in\u2026");
          return;
        }
      } catch (e) {
      }
      state.lastLoginAttempt = now;
      state.loginTried++;
      setBadge("logging in\u2026 (" + state.loginTried + ")");
      try {
        const n = W.document.getElementById("InputName"), p = W.document.getElementById("InputPassword");
        if (n && p && typeof W.LoginDoLogin === "function") {
          n.value = user;
          p.value = pass;
          W.LoginDoLogin();
          return;
        }
      } catch (e) {
        warn(e);
      }
      try {
        W.ServerSend("AccountLogin", { AccountName: user, Password: pass });
      } catch (e) {
        warn(e);
      }
    }
    function tryEnterRoom() {
      const now = Date.now();
      if (now - state.lastRoomAttempt < 12e3) return;
      state.lastRoomAttempt = now;
      setBadge("joining room\u2026");
      try {
        W.ServerSend("ChatRoomJoin", { Name: CFG.ROOM_NAME });
      } catch (e) {
        warn(e);
      }
    }
    function snapshotRoom(force) {
      if (!inRoom()) return;
      const now = Date.now();
      if (!force && now - state.lastSnapshot < CFG.ROOM_SNAPSHOT_MIN * 6e4) return;
      state.lastSnapshot = now;
      try {
        const d = W.ChatRoomData;
        if (!d) return;
        const snap = {
          Description: d.Description,
          Background: d.Background,
          Limit: d.Limit,
          Language: d.Language,
          Space: d.Space,
          BlockCategory: d.BlockCategory,
          Ban: d.Ban,
          Whitelist: d.Whitelist,
          Visibility: d.Visibility,
          Access: d.Access,
          Custom: d.Custom,
          MapData: d.MapData
        };
        const json = JSON.stringify(snap);
        if (L.roomSnapshot && JSON.stringify(L.roomSnapshot.room) === json) return;
        L.roomSnapshot = { at: now, room: JSON.parse(json) };
        saveLedger();
        dbg("room snapshot saved" + (d.MapData && d.MapData.Type ? " (map: " + d.MapData.Type + ")" : ""));
      } catch (e) {
        warn("snapshotRoom:", e);
      }
    }
    function tryCreateRoom() {
      setBadge("rebuilding room\u2026");
      const s = L.roomSnapshot && L.roomSnapshot.room || {};
      log("Rebuilding room: " + CFG.ROOM_NAME + (s.MapData ? " (with saved map)" : " (NO saved map)"));
      const visibility = s.Visibility || (CFG.ROOM_PRIVATE ? ["Admin"] : ["All"]);
      const access = s.Access || ["All"];
      const data = {
        Name: CFG.ROOM_NAME,
        Description: s.Description || CFG.ROOM_DESC,
        Background: s.Background || CFG.ROOM_BG,
        Limit: s.Limit || CFG.ROOM_LIMIT,
        Language: s.Language || "EN",
        Space: s.Space || "",
        Private: !visibility.includes("All"),
        Locked: !access.includes("All"),
        Visibility: visibility,
        Access: access,
        Admin: CFG.ROOM_ADMINS.slice(),
        Ban: Array.isArray(s.Ban) ? s.Ban : [],
        BlockCategory: Array.isArray(s.BlockCategory) ? s.BlockCategory : [],
        Game: ""
      };
      if (Array.isArray(s.Whitelist)) data.Whitelist = s.Whitelist;
      if (s.Custom) data.Custom = s.Custom;
      if (s.MapData) data.MapData = s.MapData;
      try {
        W.ServerSend("ChatRoomCreate", data);
      } catch (e) {
        warn(e);
      }
    }
    function keepalive() {
      const now = Date.now();
      if (now - state.lastKeepalive < CFG.KEEPALIVE_MIN * 6e4) return;
      state.lastKeepalive = now;
      send("ChatRoomChat", { Content: "BnBKeepAlive", Type: "Hidden" });
      dbg("keepalive sent");
    }
    function nudge() {
      if (!CFG.KEEPALIVE_NUDGE) return;
      const now = Date.now();
      if (now - state.lastNudge < CFG.NUDGE_MIN * 6e4) return;
      state.lastNudge = now;
      try {
        const C = charFor(CFG.BOT_MEMBER);
        const pos = C && C.MapData && C.MapData.Pos;
        if (!pos) return;
        const back = { X: pos.X, Y: pos.Y };
        const tryDirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [dx, dy] of tryDirs) {
          const nx = pos.X + dx, ny = pos.Y + dy;
          if (typeof W.ChatRoomMapViewIsWall === "function" && W.ChatRoomMapViewIsWall(nx, ny)) continue;
          if (nx < 0 || ny < 0 || nx >= 40 || ny >= 40) continue;
          C.MapData.Pos = { X: nx, Y: ny };
          send("ChatRoomCharacterMapDataUpdate", C.MapData);
          later(() => {
            try {
              if (C.MapData.Pos.X !== nx || C.MapData.Pos.Y !== ny) return;
              C.MapData.Pos = back;
              send("ChatRoomCharacterMapDataUpdate", C.MapData);
            } catch (e) {
            }
          }, 2500);
          dbg("nudged");
          return;
        }
      } catch (e) {
        dbg("nudge failed (harmless):", e);
      }
    }
    function watchdog() {
      if (!CFG.WATCHDOG_ENABLED || state.reloading || state.dormant) return;
      const stale = Date.now() - state.lastHealthy;
      if (stale > CFG.WATCHDOG_MIN * 6e4) {
        state.reloading = true;
        warn("WATCHDOG: unhealthy for " + Math.round(stale / 6e4) + " min. Reloading.");
        setBadge("watchdog reload\u2026", "#ff9b9b");
        try {
          for (const p of CFG.PROPRIETORS) beep(p, "\u26A0\uFE0F Oops, the farm office tripped over its own boots. Reloadin' now, back in a jiffy!");
        } catch (e) {
        }
        later(() => {
          try {
            W.location.reload();
          } catch (e) {
          }
        }, 3e3);
      }
    }
    const wTimers = /* @__PURE__ */ new Map();
    let wSeq = 0;
    function later(fn, ms) {
      if (!state.worker) return setTimeout(fn, ms);
      const id = ++wSeq;
      wTimers.set(id, { fn, every: false });
      state.worker.postMessage({ set: id, ms: Math.max(0, ms | 0), every: false });
      return id;
    }
    function every(fn, ms) {
      if (!state.worker) return setInterval(fn, ms);
      const id = ++wSeq;
      wTimers.set(id, { fn, every: true });
      state.worker.postMessage({ set: id, ms: Math.max(1, ms | 0), every: true });
      return id;
    }
    function startWorkerTimer() {
      if (!CFG.USE_WORKER_TIMER) return false;
      try {
        const src = "let hb=null;const T={};onmessage=function(e){var d=e.data;if(d==='start'){if(hb)clearInterval(hb);hb=setInterval(function(){postMessage('tick');}," + CFG.HEARTBEAT_MS + ");return;}if(d&&d.set){T[d.set]=(d.every?setInterval:setTimeout)(function(){if(!d.every)delete T[d.set];postMessage({fire:d.set});},d.ms);}};";
        const blob = new Blob([src], { type: "application/javascript" });
        const w = new Worker(URL.createObjectURL(blob));
        w.onmessage = (e) => {
          if (e.data === "tick") {
            try {
              heartbeat();
            } catch (err) {
              warn("worker heartbeat:", err);
            }
            return;
          }
          const id = e.data && e.data.fire, t = id && wTimers.get(id);
          if (!t) return;
          if (!t.every) wTimers.delete(id);
          try {
            t.fn();
          } catch (err) {
            warn("timer:", err);
          }
        };
        w.postMessage("start");
        state.worker = w;
        log("Worker timer started \u2014 background throttling defeated (heartbeat, send queue and every delay).");
        return true;
      } catch (e) {
        warn("Worker timer failed, falling back:", e);
        return false;
      }
    }
    const EMOJI = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|[\uFE0F\u200D\u20E3])/gu;
    const noEmoji = (s) => String(s).replace(EMOJI, "").replace(/[ \t]{2,}/g, " ").replace(/^([*(]?)[ \t]+/gm, "$1").replace(/[ \t]+$/gm, "");
    function send(ev, data, urgent) {
      if (ev === "ChatRoomChat" && data && data.Type === "Hidden" && data.Target === CFG.BOT_MEMBER && typeof W.__farmhandOwnPanel === "function") {
        const copy = JSON.parse(JSON.stringify(Object.assign({}, data, { Sender: CFG.BOT_MEMBER })));
        setTimeout(() => {
          try {
            W.__farmhandOwnPanel(copy);
          } catch (e) {
            warn("own panel:", e);
          }
        }, 0);
        return;
      }
      if (ev === "AccountBeep" && data && typeof data.Message === "string") data = Object.assign({}, data, { Message: noEmoji(data.Message) });
      else if (ev === "ChatRoomChat" && data && data.Type !== "Hidden" && typeof data.Content === "string") data = Object.assign({}, data, { Content: noEmoji(data.Content) });
      if (ev === "ChatRoomChat" && data && data.Type === "Hidden" && data.Dictionary && data.Dictionary.type === "state") {
        for (const lane of [state.urgent, state.replies || [], state.queue]) {
          const i = lane.findIndex((x) => x.ev === ev && x.data && x.data.Type === "Hidden" && x.data.Target === data.Target && x.data.Dictionary && x.data.Dictionary.type === "state");
          if (i >= 0) {
            lane[i] = { ev, data };
            pump();
            return;
          }
        }
      }
      if (urgent) state.urgent.push({ ev, data });
      else if (state.inReply) (state.replies || (state.replies = [])).push({ ev, data });
      else {
        state.queue.push({ ev, data });
        if (state.queue.length > CFG.QUEUE_MAX) {
          state.queue.splice(0, state.queue.length - CFG.QUEUE_MAX);
          warn("send queue overflow \u2014 dropped oldest routine messages");
        }
      }
      pump();
    }
    function pump() {
      if (state.sending && Date.now() - (state.sentAt || 0) > CFG.SEND_INTERVAL_MS * 5 + 3e3) state.sending = false;
      if (state.sending) return;
      const lane = state.urgent.length ? state.urgent : state.replies && state.replies.length ? state.replies : state.queue;
      const m = lane[0];
      if (!m) return;
      if (!socketAlive()) {
        if (!state.sendRetry) state.sendRetry = later(() => {
          state.sendRetry = null;
          pump();
        }, 2e3);
        return;
      }
      lane.shift();
      state.sending = true;
      state.sentAt = Date.now();
      try {
        W.ServerSend(m.ev, m.data);
      } catch (e) {
        warn("send:", e);
        m.tries = (m.tries || 0) + 1;
        if (m.tries < 3) lane.unshift(m);
      }
      later(() => {
        state.sending = false;
        pump();
      }, CFG.SEND_INTERVAL_MS);
    }
    const inCharacter = (s) => String(s).replace(/\(/g, "[").replace(/\)/g, "]");
    function enqueue(m, urgent) {
      if (m && (m.Type === "Emote" || m.Type === "Chat") && typeof m.Content === "string") m = Object.assign({}, m, { Content: inCharacter(m.Content) });
      send("ChatRoomChat", m, urgent);
    }
    function waitPlaced(mn, go, last) {
      if (!mn || !mapRoom() || onMap(mn) || !charFor(mn)) return false;
      let n = 0;
      const tryIt = () => {
        if (onMap(mn)) return go();
        if (++n < 5 && charFor(mn)) return later(tryIt, 2e3);
        last();
      };
      later(tryIt, 2e3);
      return true;
    }
    function say(t, urgent, who) {
      const subject = who || aboutWhom(t);
      if (subject && waitPlaced(subject, () => say(t, urgent, subject), () => privateTo(subject, t, "chat"))) return;
      if (speakersOn() && speakerSend(subject, t, "chat", urgent)) return;
      if (mapRoom() && CFG.SPEAKER_MODE !== "walk") {
        if (subject && speakerSend(subject, t, "chat", urgent)) return;
        if (!subject) {
          toEveryone(t, "chat", urgent);
          return;
        }
        if (charFor(subject)) privateTo(subject, t, "chat");
        return;
      }
      walkTo(subject, urgent);
      enqueue({ Content: t, Type: "Chat" }, urgent);
    }
    const mapRoom = () => !!(W.ChatRoomData && W.ChatRoomData.MapData && W.ChatRoomData.MapData.Type && W.ChatRoomData.MapData.Type !== "Never");
    function walkTo(mn, urgent) {
      if (!mn || !mapRoom()) return;
      const me = charFor(CFG.BOT_MEMBER), them = charFor(mn);
      const a = me && me.MapData && me.MapData.Pos, b = them && them.MapData && them.MapData.Pos;
      if (!a || !b || b.X < 0 || b.Y < 0) return;
      const speakers = Object.entries(L.spots || {}).filter(([n]) => n.startsWith("speaker")).map(([, s]) => s);
      if (speakers.length) {
        const d = (s) => Math.max(Math.abs(s.X - b.X), Math.abs(s.Y - b.Y));
        const best = speakers.reduce((x, y) => d(y) < d(x) ? y : x);
        if (best.X === a.X && best.Y === a.Y) return;
        me.MapData.Pos = { X: best.X, Y: best.Y };
        send("ChatRoomCharacterMapDataUpdate", me.MapData, urgent);
        state.walkedAt = Date.now();
        return;
      }
      if (Math.max(Math.abs(a.X - b.X), Math.abs(a.Y - b.Y)) <= 2) return;
      const to = spotBeside(mn);
      if (!to) return;
      me.MapData.Pos = { X: to.X, Y: to.Y };
      send("ChatRoomCharacterMapDataUpdate", me.MapData, urgent);
      state.walkedAt = Date.now();
    }
    function homeTick() {
      const home = spotFor("home"), me = charFor(CFG.BOT_MEMBER), p = me && me.MapData && me.MapData.Pos;
      if (!home || !p || !mapRoom()) return;
      if (Object.keys(L.spots || {}).some((n) => n.startsWith("speaker"))) return;
      if (p.X === home.X && p.Y === home.Y) return;
      if (Date.now() - (state.walkedAt || 0) < CFG.HOME_AFTER_S * 1e3) return;
      me.MapData.Pos = { X: home.X, Y: home.Y };
      send("ChatRoomCharacterMapDataUpdate", me.MapData);
    }
    function aboutWhom(text) {
      text = String(text);
      let best = null, at = Infinity, len = 0;
      for (const c of W.ChatRoomCharacter || []) {
        const mn = c.MemberNumber;
        if (mn === CFG.BOT_MEMBER) continue;
        const r = rec(mn), names = [...new Set([plainName(mn), c.Nickname, c.Name, r && r.name].filter((n) => n && String(n).length > 1))];
        for (const n of names) {
          const i = indexOfWord(text, String(n));
          if (i >= 0 && (i < at || i === at && String(n).length > len)) {
            at = i;
            best = mn;
            len = String(n).length;
          }
        }
      }
      return best;
    }
    function indexOfWord(text, word) {
      let from = 0;
      for (; ; ) {
        const i = text.indexOf(word, from);
        if (i < 0) return -1;
        const before = text[i - 1], after = text[i + word.length];
        if (!(before && /[\p{L}\p{N}]/u.test(before)) && !(after && /[\p{L}\p{N}]/u.test(after))) return i;
        from = i + 1;
      }
    }
    function announce(t, urgent) {
      if (mapRoom() && CFG.SPEAKER_MODE !== "walk") {
        toEveryone(t, "chat", urgent);
        return;
      }
      enqueue({ Content: t, Type: "Chat" }, urgent);
    }
    function emote(t, who, also) {
      if (state.cmdWatch) state.cmdWatch.emotes.push(String(t));
      const subject = who || aboutWhom(t);
      if (subject && waitPlaced(subject, () => emote(t, subject, also), () => privateTo(subject, t, "emote"))) return;
      also = (also || []).filter((m) => m && m !== CFG.BOT_MEMBER && onMap(m));
      if (mapRoom() && subject) {
        const parties = [subject].concat(namesHere(t).filter((m) => m !== subject));
        const by = parties.find((m) => canRelay(m) && namedIn(String(t), [m]));
        if (by) {
          relayEmote(by, t, subject);
          const seen = sightOf(by) ? new Set(audience(by, "see")) : null;
          const far = (m) => {
            const p = charFor(by) && charFor(by).MapData && charFor(by).MapData.Pos, q = charFor(m) && charFor(m).MapData && charFor(m).MapData.Pos;
            return !p || !q || Math.max(Math.abs(p.X - q.X), Math.abs(p.Y - q.Y)) > CFG.SPEAKER_RANGE;
          };
          for (const m of new Set(parties.concat(also))) if (m !== by && (!seen ? also.includes(m) && far(m) : !seen.has(m))) privateTo(m, t, "emote");
          return;
        }
        if (speakersOn() && speakerSend(subject, t, "emote")) return;
        if (CFG.SPEAKER_MODE !== "walk") {
          const who2 = /* @__PURE__ */ new Set();
          for (const a of parties) {
            const s = audienceFor(a, t, "emote");
            if (s) for (const m of s) who2.add(m);
          }
          for (const m of also) who2.add(m);
          if (who2.size) {
            for (const m of who2) privateTo(m, t, "emote");
            return;
          }
        }
      } else if (mapRoom() && CFG.SPEAKER_MODE !== "walk") {
        toEveryone(t, "emote");
        return;
      }
      if (mapRoom() && subject && CFG.SPEAKER_MODE !== "walk") {
        if (charFor(subject)) privateTo(subject, t, "emote");
        return;
      }
      walkTo(subject);
      for (const c of splitMessage(t, 900)) enqueue({ Content: "*" + c, Type: "Emote" });
    }
    function namesHere(text) {
      const people = (W.ChatRoomCharacter || []).map((c) => c.MemberNumber).filter((m) => m !== CFG.BOT_MEMBER && onMap(m));
      return people.filter((m) => {
        const mine = namesOf(m);
        let t = String(text);
        for (const o of people) {
          if (o === m) continue;
          for (const n of namesOf(o)) {
            if (n.length > 3 && mine.some((x) => x.length < n.length && n.includes(x))) {
              const i = t.toLowerCase().indexOf(n);
              if (i >= 0) t = t.split(new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig")).join(" ");
            }
          }
        }
        return namedIn(t, [m]);
      });
    }
    function canRelay(mn) {
      const c = state.companions.get(mn);
      return !!(hasCompanion(mn) && c && c.relay !== false && verAtLeast(c.ver, "0.9.0"));
    }
    function verAtLeast(v, min) {
      const a = String(v || "0").split(".").map(Number), b = min.split(".").map(Number);
      for (let i = 0; i < 3; i++) {
        if ((a[i] || 0) !== b[i]) return (a[i] || 0) > b[i];
      }
      return true;
    }
    function relayEmote(mn, text, subject) {
      state.relays = state.relays || /* @__PURE__ */ new Map();
      const id = ++companionSeq;
      state.relays.set(id, { text, subject: subject || mn, at: Date.now() });
      state.relays.get(id).by = mn;
      enqueue(makeMsg("relay", { text: String(text).slice(0, 900), id }, mn));
      for (const [k, r] of state.relays) if (Date.now() - r.at > 12e4) state.relays.delete(k);
    }
    function relayRefused(id) {
      const r = state.relays && state.relays.get(id);
      if (!r) return;
      state.relays.delete(id);
      const who = /* @__PURE__ */ new Set();
      for (const a of /* @__PURE__ */ new Set([r.by, r.subject])) {
        const s = a && audienceFor(a, r.text, "emote");
        if (s) for (const m of s) who.add(m);
      }
      if (!who.size) {
        for (const c of splitMessage(r.text, 900)) enqueue({ Content: "*" + c, Type: "Emote" });
        return;
      }
      for (const m of who) privateTo(m, r.text, "emote");
    }
    function privateTo(mn, text, kind) {
      const line = (kind === "emote" ? "*" : "") + String(text);
      if (hasCompanion(mn)) enqueue(makeMsg("roomline", { text: line, kind }, mn));
      else for (const part of splitMessage(line, 900)) enqueue({ Content: "(" + part.replace(/\(/g, "[").replace(/\)/g, "]"), Type: "Whisper", Target: mn });
    }
    function toEveryone(text, kind, urgent) {
      const line = (kind === "emote" ? "*" : "") + String(text);
      for (const c of W.ChatRoomCharacter || []) {
        const mn = c.MemberNumber;
        if (mn === CFG.BOT_MEMBER) continue;
        if (hasCompanion(mn)) enqueue(makeMsg("roomline", { text: line, kind }, mn), urgent);
        else for (const part of splitMessage(line, 900)) enqueue({ Content: "(" + part.replace(/\(/g, "[").replace(/\)/g, "]"), Type: "Whisper", Target: mn }, urgent);
      }
    }
    const speakersOn = () => mapRoom() && CFG.SPEAKER_MODE === "voice" && Object.keys(L.spots || {}).some((n) => n.startsWith("speaker"));
    function speakerSend(anchor, text, kind, urgent) {
      const who = audienceFor(anchor, text, kind);
      if (!who) return false;
      const line = (kind === "emote" ? "*" : "") + String(text);
      for (const mn of who) {
        if (hasCompanion(mn)) enqueue(makeMsg("roomline", { text: line, kind }, mn), urgent);
        else for (const c of splitMessage(line, 900)) enqueue({ Content: "(" + c.replace(/\(/g, "[").replace(/\)/g, "]"), Type: "Whisper", Target: mn }, urgent);
      }
      return true;
    }
    function audienceFor(anchor, text, kind) {
      const here = (W.ChatRoomCharacter || []).filter((c) => c.MemberNumber !== CFG.BOT_MEMBER && c.MapData && c.MapData.Pos);
      const pos = (mn) => {
        const c = charFor(mn);
        return c && c.MapData && c.MapData.Pos;
      };
      const at = anchor && pos(anchor);
      if (!at) return null;
      const speakers = Object.entries(L.spots || {}).filter(([n]) => n.startsWith("speaker")).map(([, s]) => s);
      const dist = (p, q) => Math.max(Math.abs(p.X - q.X), Math.abs(p.Y - q.Y));
      const spot = speakers.length ? speakers.reduce((x, y) => dist(y, at) < dist(x, at) ? y : x) : at;
      const R = CFG.SPEAKER_RANGE;
      const named = here.map((c) => c.MemberNumber).filter((m) => namedIn(String(text), [m]));
      const who = new Set([anchor].concat(named));
      if (sightOf(anchor) && !speakersOn()) for (const m of audience(anchor, kind === "chat" ? "hear" : "see")) who.add(m);
      else for (const c of here) if (dist(c.MapData.Pos, spot) <= R || dist(c.MapData.Pos, at) <= R) who.add(c.MemberNumber);
      for (const m of [...who]) if (m !== anchor && !named.includes(m) && !hasCompanion(m)) who.delete(m);
      return who;
    }
    function onMap(mn) {
      const C = charFor(mn);
      if (!C) return false;
      const mapRoom2 = !!(W.ChatRoomData && W.ChatRoomData.MapData && W.ChatRoomData.MapData.Type && W.ChatRoomData.MapData.Type !== "Never");
      if (!mapRoom2) return true;
      const pos = C.MapData && C.MapData.Pos;
      return !!(pos && pos.X >= 0 && pos.Y >= 0);
    }
    function missing(...mns) {
      return mns.find((m) => m && !onMap(m)) || null;
    }
    function whisper(target, text, urgent, plain) {
      if (!plain && hasCompanion(target)) {
        toCompanion(target, text, "notice", urgent);
        return;
      }
      if (target === CFG.BOT_MEMBER) {
        selfLine(text);
        return;
      }
      if (!charFor(target)) {
        if (canBeep(target)) for (const c of splitMessage(text, 900)) send("AccountBeep", { MemberNumber: target, BeepType: "", Message: c }, urgent);
        else holdMail(target, text);
        return;
      }
      const ooc = mapRoom();
      for (const c of splitMessage(text, 900)) enqueue({ Content: ooc ? "(" + c.replace(/\(/g, "[").replace(/\)/g, "]") : c, Type: "Whisper", Target: target }, urgent);
    }
    function splitMessage(text, max) {
      text = String(text);
      if (text.length <= max) return [text];
      const out = [];
      let buf = "";
      for (let line of text.split("\n")) {
        while (line.length > max) {
          if (buf) {
            out.push(buf.trimEnd());
            buf = "";
          }
          out.push(line.slice(0, max));
          line = line.slice(max);
        }
        if ((buf + line + "\n").length > max) {
          if (buf) out.push(buf.trimEnd());
          buf = "";
        }
        buf += line + "\n";
      }
      if (buf.trim()) out.push(buf.trimEnd());
      return out;
    }
    const COMPANION_TTL_MS = 3 * 60 * 60 * 1e3;
    function hasCompanion(mn) {
      const c = state.companions.get(mn);
      return !!(c && Date.now() - c.at < COMPANION_TTL_MS && inRoom() && charFor(mn));
    }
    function companionCount() {
      let n = 0;
      for (const mn of state.companions.keys()) if (hasCompanion(mn)) n++;
      return n;
    }
    let companionSeq = 0;
    function toCompanion(mn, text, kind, urgent, extra) {
      if (state.cmdWatch && state.cmdWatch.mn === mn) state.cmdWatch.replied = true;
      const parts = splitMessage(text, 1800), id = ++companionSeq;
      parts.forEach((t, i) => enqueue(makeMsg(kind, Object.assign({ text: t, id, part: i + 1, of: parts.length }, extra || {}), mn), urgent));
    }
    function pingCompanions(force) {
      if (!inRoom() || !force && Date.now() - state.lastPing < 10 * 60 * 1e3) return;
      state.lastPing = Date.now();
      enqueue(makeMsg("ping", { ver: VERSION }));
    }
    function probeCompanion(mn) {
      if (!state.companions.has(mn)) return;
      const t0 = Date.now();
      enqueue(makeMsg("ping", { ver: VERSION }, mn), true);
      later(() => {
        const c = state.companions.get(mn);
        if (c && c.at < t0) {
          state.companions.delete(mn);
          log("Companion of " + mn + " didn't answer; sendin' plain text from now on.");
        }
      }, 3e4);
    }
    function onCompanion(m) {
      const mn = m.from;
      if (!mn) return;
      if (m.type === "relayNo") {
        relayRefused(m.id);
        return;
      }
      if (m.type === "sight") {
        onSight(mn, m);
        return;
      }
      if (m.type === "leadOk" || m.type === "leadNo") {
        leadAnswer(mn, m);
        return;
      }
      if (m.type === "hello") {
        state.companions.set(mn, { at: Date.now(), ver: String(m.ver || "?"), relay: m.relay !== false, off: m.off && typeof m.off === "object" ? m.off : {} });
        log("Companion hello from " + mn + " (v" + (m.ver || "?") + ")");
        enqueue(makeMsg("welcome", { ver: VERSION, proto: PROTOCOL, name: plainName(mn), staff: isStaff(mn) }, mn));
        later(() => syncCompanions(), 800);
        return;
      }
      if (m.type === "bye") {
        state.companions.delete(mn);
        return;
      }
      if (m.type === "outfitSave") {
        saveOutfit(mn, m);
        return;
      }
      if (m.type === "outfitAnswer") {
        outfitAnswer(mn, m);
        return;
      }
      if (m.type === "cmd") {
        const text = String(m.text || "").trim().replace(/^[?\-!.\/]+/, "").slice(0, 2e3);
        if (!text) return;
        const c = state.companions.get(mn);
        if (c) c.at = Date.now();
        else state.companions.set(mn, { at: Date.now(), ver: "?" });
        state.heard++;
        state.lastHealthy = Date.now();
        log("HEARD [companion] " + mn + ": " + text.slice(0, 70));
        if (!handleYesNo(mn, text)) handleCommand(mn, text, "companion");
        later(() => syncCompanions(), 1500);
      }
    }
    function beep(mn, msg, urgent) {
      if (mn === CFG.BOT_MEMBER && !hasCompanion(mn)) {
        selfLine(msg);
        return;
      }
      if (hasCompanion(mn)) {
        toCompanion(mn, msg, "notice", urgent);
        if (urgent && canBeep(mn)) send("AccountBeep", { MemberNumber: mn, BeepType: "", Message: String(msg).split("\n")[0].slice(0, 300) }, urgent);
        return;
      }
      if (CFG.WHISPER_FIRST && inRoom() && onMap(mn)) {
        whisper(mn, msg, urgent);
        return;
      }
      if (!canBeep(mn)) {
        if (inRoom() && charFor(mn)) {
          whisper(mn, msg, urgent);
          return;
        }
        holdMail(mn, msg);
        return;
      }
      const chunks = splitMessage(msg, 900);
      const max = CFG.BEEP_MAX_CHUNKS;
      for (const c of chunks.slice(0, max)) send("AccountBeep", { MemberNumber: mn, BeepType: "", Message: c }, urgent);
      if (chunks.length > max)
        send("AccountBeep", { MemberNumber: mn, BeepType: "", Message: "(\u2026I had to cut that one short, sugar. It's a long one! Try narrowin' it down.)" }, urgent);
    }
    function holdMail(mn, msg) {
      L.mailbox = L.mailbox || {};
      const gist = String(msg).split("\n")[0].replace(/\s+/g, " ").trim().slice(0, 90);
      const box = L.mailbox[mn] = (L.mailbox[mn] || []).concat({ t: Date.now(), gist }).slice(-10);
      saveLedger();
      dbg("held for " + mn + ": " + box.length);
    }
    function deliverMail(mn) {
      const box = L.mailbox && L.mailbox[mn];
      if (!box || !box.length) return;
      const latest = box.slice(-3).reverse(), more = box.length - latest.length;
      const text = "\u{1F4EC} " + box.length + " farm message" + (box.length === 1 ? "" : "s") + " while you were away. The latest:\n" + latest.map((x) => "\u2022 " + x.gist).join("\n") + (more > 0 ? "\n\u2026and " + more + " older." : "");
      if (hasCompanion(mn)) toCompanion(mn, text, "notice");
      else if (charFor(mn)) whisper(mn, text);
      else if (canBeep(mn)) send("AccountBeep", { MemberNumber: mn, BeepType: "", Message: text.slice(0, 1e3) });
      else return;
      delete L.mailbox[mn];
      saveLedger();
    }
    function selfLine(text) {
      try {
        if (typeof W.ChatRoomSendLocal !== "function") return log("[to self] " + text);
        const p = W.document.createElement("div");
        p.style.cssText = "color:#c9a35b;white-space:pre-wrap;margin:0.25em 0";
        p.textContent = String(text);
        W.ChatRoomSendLocal(p.outerHTML);
      } catch (e) {
        warn("self line:", e);
      }
    }
    function reply(mn, text, channel) {
      if (channel === "companion" || channel !== "chat" && hasCompanion(mn)) {
        toCompanion(mn, text, "reply");
        return;
      }
      if (mn === CFG.BOT_MEMBER) {
        selfLine(text);
        return;
      }
      if (channel === "beep") {
        beep(mn, text);
        return;
      }
      if (channel === "bot") {
        if (canBeep(mn)) beep(mn, text);
        else whisper(mn, text);
        return;
      }
      if (channel === "chat") {
        if (CFG.CHAT_REPLY_BEEP && canBeep(mn)) {
          beep(mn, text);
          return;
        }
        if (String(text).length <= CFG.CHAT_REPLY_SAY_MAX) {
          if (mapRoom()) privateTo(mn, text, "chat");
          else say(text, false, mn);
          return;
        }
        whisper(mn, text);
        if (!canBeep(mn)) {
          say(plainName(mn) + ", I whispered that one to you, hon! Add me (" + CFG.BOT_MEMBER + ") to your friend list and say ?friend, and I can reach you anywhere.", false, mn);
        }
        return;
      }
      whisper(mn, text);
    }
    function charFor(mn) {
      try {
        return (W.ChatRoomCharacter || []).find((c) => c.MemberNumber === mn) || null;
      } catch (e) {
        return null;
      }
    }
    function plainName(mn) {
      if (mn === ANON_STUD) return "an anonymous stranger at the glory stalls";
      const C = charFor(mn);
      if (C) {
        try {
          if (typeof W.CharacterNickname === "function") return W.CharacterNickname(C);
        } catch (e) {
        }
        return C.Nickname || C.Name || "stranger";
      }
      const r = rec(mn);
      return r && r.name ? r.name : "#" + mn;
    }
    function shortName(mn) {
      const full = plainName(mn), parts = String(full).trim().split(/\s+/);
      return parts.length > 1 && parts[parts.length - 1].length >= 2 ? parts[parts.length - 1] : full;
    }
    function nameOnce(text, mn) {
      const full = plainName(mn), short = shortName(mn);
      let seen = false;
      return String(text).replace(/%n/g, () => {
        if (!seen) {
          seen = true;
          return full;
        }
        return short;
      });
    }
    function titledName(mn) {
      const C = charFor(mn), n = plainName(mn);
      if (!C) return n;
      const t = C.Title && C.Title !== "None" ? C.Title : "";
      return t ? t + " " + n : n;
    }
    function fill(t, mn) {
      return String(t).replace(/%titled_name%/g, titledName(mn)).replace(/%name%/g, plainName(mn));
    }
    function namesOf(mn) {
      const C = charFor(mn), r = rec(mn), out = [];
      for (const n of [C && C.Nickname, C && C.Name, r && r.name]) if (n) out.push(String(n).toLowerCase());
      return out;
    }
    function resolveTarget(arg) {
      if (!arg) return null;
      arg = String(arg).replace(/^@/, "").replace(/[,.!?:;]+$/, "");
      if (/^#?\d+$/.test(arg)) return parseInt(arg.replace("#", ""), 10);
      const low = arg.toLowerCase();
      if (!low) return null;
      const room = (W.ChatRoomCharacter || []).map((c) => c.MemberNumber).filter((m) => m !== CFG.BOT_MEMBER);
      const books = Object.keys(L.people).map((k) => parseInt(k, 10));
      const all = [...new Set(room.concat(books))];
      const onBooks = (m) => {
        const r = rec(m);
        return !!(r && r.roles && r.roles.length);
      };
      const score = (m) => (onBooks(m) ? 2 : 0) + (charFor(m) ? 1 : 0);
      const choose = (list) => {
        if (list.length <= 1) return list[0] || null;
        const best = Math.max(...list.map(score)), top = list.filter((m) => score(m) === best);
        if (top.length === 1) return top[0];
        state.ambiguous = { arg, list: top };
        return null;
      };
      const exact = all.filter((m) => namesOf(m).includes(low));
      if (exact.length) return choose(exact);
      if (low.length < 3) return null;
      const starts = all.filter((m) => namesOf(m).some((n) => n.startsWith(low) || n.split(/\s+/).some((w) => w.startsWith(low))));
      return choose(starts);
    }
    const GREETINGS = [
      "Evenin', %titled_name%! Gate's open, come on in, sugar. \u{1F33B}",
      "Well hey there, %titled_name%! Wipe your boots and make yourself at home.",
      "%titled_name%! Didn't even hear the truck pull up. Welcome to B&B Farm, sweetie!",
      "Welcome, %titled_name%! If you're new 'round here, say ?rules out loud and I'll fill you in.",
      "Mornin', %titled_name%! Coffee's fresh and so's the hay. \u2615",
      "Afternoon, %titled_name%! Mind the ruts on your way in, darlin'.",
      "Hey there, %titled_name%! Say ?help any time, hon. I keep the books 'round here."
    ];
    const RETURN_GREETINGS = [
      "Well look who's back! Told ya the gate swings both ways, %titled_name%. \u{1F495}",
      "%titled_name%! I just knew you'd turn up again, sugar.",
      "Back for more, %titled_name%? Straw's still warm and I saved you a spot."
    ];
    function greet(mn) {
      if (!CFG.GREET_ENABLED || mn === CFG.BOT_MEMBER) return;
      const last = state.greeted.get(mn) || 0;
      if (Date.now() - last < CFG.GREET_COOLDOWN_MIN * 6e4) return;
      state.greeted.set(mn, Date.now());
      const r0 = rec(mn);
      const known = L.archive[mn] || r0 && r0.roles && r0.roles.length;
      const pool = known ? RETURN_GREETINGS : GREETINGS;
      const line = pool[Math.floor(Math.random() * pool.length)];
      later(() => say(fill(line, mn), false, mn), 1500);
      const r = rec(mn);
      if (r) {
        r.name = plainName(mn);
        saveLedger();
      }
    }
    function onArrive(mn) {
      const a = state.arrivals.get(mn);
      if (a) {
        state.arrivals.delete(mn);
        if (Date.now() < a.until) {
          const pt = firstSpot(a.spot, "summon");
          if (pt) later(() => teleport(mn, pt, true), 2500);
        }
      }
      if (CFG.NOTICE_ON_JOIN && L.notice && state.greeted.get(mn) > Date.now() - 5e3)
        later(() => whisper(mn, "\u{1F4CC} " + L.notice.text), 3500);
      const r = rec(mn);
      if (CFG.ANNIVERSARY_ENABLED && r && r.roles.length && r.registeredAt) {
        const d0 = new Date(r.registeredAt), now = /* @__PURE__ */ new Date();
        const years = now.getFullYear() - d0.getFullYear();
        if (years >= 1 && d0.getMonth() === now.getMonth() && d0.getDate() === now.getDate() && r.annivYear !== now.getFullYear()) {
          r.annivYear = now.getFullYear();
          saveLedger();
          later(() => say("\u{1F389} " + years + " year" + (years === 1 ? "" : "s") + " on the books today, " + plainName(mn) + "! Somebody fetch this sweetie a ribbon!", false, mn), 4500);
        }
      }
    }
    function teaseTick() {
      if (!CFG.TEASE_ENABLED || !L.tease.length) return;
      const now = Date.now();
      const gap = () => (CFG.TEASE_MIN_GAP_MIN + Math.random() * (CFG.TEASE_MAX_GAP_MIN - CFG.TEASE_MIN_GAP_MIN)) * 6e4;
      for (const C of W.ChatRoomCharacter || []) {
        const mn = C.MemberNumber;
        const r = rec(mn);
        if (!r || !r.teaseOptIn) {
          state.teaseNext.delete(mn);
          continue;
        }
        const next = state.teaseNext.get(mn);
        if (!next) {
          state.teaseNext.set(mn, now + gap());
          continue;
        }
        if (now < next) continue;
        state.teaseNext.set(mn, now + gap());
        const line = L.tease[Math.floor(Math.random() * L.tease.length)];
        whisper(mn, "\u{1F608} " + fill(line.text, mn));
      }
    }
    const SWITCH_CMDS = {
      breedable: "breedable",
      fertile: "fertile",
      jarok: "jarok",
      freeuse: "freeuse",
      futa: "futa",
      milkable: "milkable",
      naturalHeat: "naturalheat",
      praiseMe: "praise",
      degradeMe: "degrade",
      tally: "tally",
      teaseOptIn: "teaseme",
      forced: "forced",
      hypno: "hypno"
    };
    const DOC_CMDS = ["record", "stats", "vet", "quota", "keys", "size", "measure", "pedigree"];
    function shownMl(n) {
      n = Number(n) || 0;
      return n >= 1e3 ? Math.round(n / 100) * 100 : Math.round(n / 50) * 50;
    }
    function stateFor(mn) {
      const staff = isStaff(mn);
      const r = rec(mn, staff);
      if (r && !r.roles) r.roles = [];
      const base = { name: plainName(mn), onBooks: !!(r && (r.roles.length || staff)) };
      if (!base.onBooks) return base;
      const s = Object.assign(base, {
        roles: r.roles.slice(),
        tier: tierOf(mn) || "",
        species: r.species || "",
        gender: r.gender || "",
        staff: isStaff(mn),
        herdmaster: isHerdmaster(mn),
        proprietor: isProprietor(mn),
        mandated: isMandated(mn),
        onDuty: r.onDuty !== false,
        onCall: isStaff(mn) && (isMandated(mn) || !!r.forced),
        pastureLock: r.pastureLock ? plainName(r.pastureLock.by) : null,
        keys: keysOf(mn),
        herdLeader: herdLeaderOf(mn) ? plainName(herdLeaderOf(mn)) : null,
        switches: {}
      });
      for (const k in SWITCH_CMDS) s.switches[SWITCH_CMDS[k]] = k === "jarok" ? r.jarok !== false : k === "milkable" ? makesMilk(mn) : !!r[k];
      try {
        const p = prodOf(mn), now = Date.now();
        if (makesMilk(mn)) s.milk = { ml: shownMl(p.milk), cap: Math.round(milkCap(mn)), grade: milkGrade(mn), lastAt: p.lastMilkAt || 0 };
        if (p.stall && p.stall.until) s.stallUntil = Math.ceil(p.stall.until / 6e4) * 6e4;
        if (makesSemen(mn)) s.semen = { ml: Math.round(p.semen), cap: Math.round(semenCap(mn)) };
        s.holding = { ml: shownMl(heldTotal(p)), cap: Math.round(capacity(mn)) };
        s.body = bodyParts(mn).filter((k) => CFG.SIZES[k]).map((k) => ({ part: k, label: CFG.SIZES[k].label, size: sizeName(mn, k) }));
        if (inHeat(p)) s.heatUntil = p.heat.until;
        if (p.preg) s.preg = { due: p.preg.due, sires: p.preg.sires.map(plainName) };
        if (quotaOf(mn)) s.quota = { ml: Math.round(milkedOn(mn, dayKey())), goal: Math.round(quotaOf(mn)), streak: r.quotaStreak || 0 };
        const g = gearOf(mn);
        if (g.milk || g.machine || g.funnel) s.gear = { milk: g.milk || null, machine: g.machine || null, funnel: !!g.funnel };
        s.today = { tally: tallyToday(mn), naughty: r.naughtyMarks || 0, praised: r.praised || 0, degraded: r.degraded || 0 };
        s.at = now;
        if (isStaff(mn)) Object.assign(s, staffStateFor(mn));
        const mods = addonStateFor(mn);
        if (mods) s.mods = mods;
        const ac = addonCommandGroups(mn);
        if (ac.length) s.addonCmds = ac;
        if (isProprietor(mn)) {
          outfitsLedger();
          s.outfits = {};
          for (const [k, o] of Object.entries(L.outfits)) s.outfits[k] = { items: o.items, locks: o.locks, at: o.at };
          s.outfitRules = Object.assign({}, L.outfitRules);
        }
      } catch (e) {
        dbg("stateFor:", e);
      }
      return s;
    }
    function staffStateFor(mn) {
      const out = {}, here = (W.ChatRoomCharacter || []).map((c) => c.MemberNumber).filter((m) => m !== CFG.BOT_MEMBER && rec(m) && rec(m).roles.length);
      out.herd = here.slice(0, 40).map((m) => {
        const r2 = rec(m), p = prodOf(m);
        return {
          mn: m,
          name: plainName(m),
          role: (r2.roles[0] || "").toLowerCase(),
          where: whereName(m) || "",
          milk: makesMilk(m) ? Math.round(100 * p.milk / Math.max(1, milkCap(m))) : null,
          heat: inHeat(p),
          preg: !!p.preg,
          denied: milkDenied(m),
          mine: herdLeaderOf(m) === mn,
          onDuty: r2.onDuty !== false
        };
      });
      const r = rec(mn), wk = weekKey(), week = r.shift && r.shift.week && r.shift.week.key === wk ? r.shift.week.ms : 0;
      out.shift = {
        clocked: clockedIn(mn),
        weekH: Math.round(10 * (week + (clockedIn(mn) ? Date.now() - r.shift.in : 0)) / 36e5) / 10,
        onDuty: here.filter((m) => isStaff(m) && onDuty(m)).map(plainName),
        onCall: forcedStaff().map((m) => ({ name: plainName(m), mandated: isMandated(m), here: !!charFor(m) }))
      };
      zonesLedger();
      out.zones = L.zones;
      out.spots = L.spots || {};
      out.mapEdit = isHerdmaster(mn);
      if (isHerdmaster(mn)) {
        out.tease = (L.tease || []).slice(0, 60).map((x) => x.text);
        out.teaseOpted = Object.values(L.people).filter((x) => x.teaseOptIn).length;
        out.log = (L.log || []).slice(-10).reverse().map((e) => ({ t: e.t, a: e.a, by: plainName(e.by), d: String(e.d || "").slice(0, 40) }));
      }
      if (canHoldHerd(mn)) {
        voiceLedger();
        const members = Object.keys(L.people).map(Number).filter((m) => herdLeaderOf(m) === mn);
        out.voice = {
          herd: L.voice.herd[mn] || { on: false, lines: [], every: "15" },
          members: members.slice(0, 40).map((m) => Object.assign({ mn: m, name: plainName(m), hypno: !!rec(m).hypno }, L.voice.member[m] || { on: false, lines: [], every: "15" }))
        };
      }
      out.apps = (L.applications || []).slice(0, 30).map((a, i) => ({
        n: i + 1,
        mn: a.mn,
        name: a.name,
        at: a.at,
        staffTrack: !!a.staffTrack,
        sum: ["role", "species", "gender", "stay", "depth"].map((k) => appAnswer(a, k) || "?").join(" \xB7 ")
      }));
      out.mail = {
        sending: state.queue.length + state.urgent.length,
        held: Object.keys(L.mailbox || {}).length,
        beepable: state.mutual ? state.mutual.set.size : null
      };
      return out;
    }
    function syncCompanions(force) {
      for (const [mn, c] of state.companions) {
        if (!hasCompanion(mn)) continue;
        let s;
        try {
          s = stateFor(mn);
        } catch (e) {
          warn("state for " + mn + ":", e);
          continue;
        }
        const key = JSON.stringify(Object.assign({}, s, { at: 0 }));
        if (!force && c.lastState === key) continue;
        c.lastState = key;
        enqueue(makeMsg("state", { state: s }, mn));
      }
    }
    function askCard(mn, kind, text) {
      if (hasCompanion(mn)) {
        enqueue(makeMsg("ask", { kind, text, id: ++companionSeq }, mn));
        if (canBeep(mn)) send("AccountBeep", { MemberNumber: mn, BeepType: "", Message: "\u2753 A yes/no question is waitin' in your \u{1F33E} panel: " + String(text).slice(0, 160) });
      } else tell(mn, text);
    }
    const LIMIT_WORDS = {
      breed: /\b(breed\w*|pregnan\w*|impregnat\w*|inflat\w*|cum\w*|creampie\w*|seed\w*)\b/i,
      heat: /\b(heat|breed\w*|pregnan\w*|impregnat\w*)\b/i,
      milk: /\b(milk\w*|lactat\w*|udders?)\b/i,
      futa: /\b(futa\w*|penis|cock)\b/i,
      eggs: /\b(eggs?|ovipos\w*|clutch)\b/i
    };
    const HOLES = ["vulva", "butt", "mouth"];
    function holeFrom(w) {
      w = String(w || "").toLowerCase();
      if (/^(vulva|pussy|cunt|vagina|vaginal)$/.test(w)) return "vulva";
      if (/^(butt|ass|anus|anal)$/.test(w)) return "butt";
      if (/^(mouth|throat|oral)$/.test(w)) return "mouth";
      return null;
    }
    function prodOf(mn) {
      const r = rec(mn);
      if (!r) return null;
      if (!r.prod) r.prod = {
        milk: 0,
        semen: 0,
        held: { vulva: 0, butt: 0, mouth: 0 },
        capBonus: 0,
        heat: null,
        boosts: {},
        preg: null,
        freshUntil: 0,
        offspring: { male: 0, female: 0, futa: 0, litters: 0 },
        totals: { milked: 0, collected: 0, received: 0, given: 0, sired: 0 },
        hasPenis: false,
        last: Date.now(),
        lastHeatEmote: 0,
        nextHeatAt: 0
      };
      return r.prod;
    }
    function limitBlocks(mn, kind) {
      const r = rec(mn);
      return !!(r && LIMIT_WORDS[kind || "breed"].test(r.limits || ""));
    }
    function speciesKey(mn) {
      const s = String((rec(mn) || {}).species || "").toLowerCase();
      for (const k of Object.keys(CFG.SPECIES)) if (k !== "default" && s.includes(k)) return k;
      return "default";
    }
    function speciesInfo(mn) {
      return CFG.SPECIES[speciesKey(mn)];
    }
    const ml = (n) => n >= 1e3 ? (n / 1e3).toFixed(1) + " L" : Math.round(n) + " mL";
    function craftText(item) {
      if (!item || !item.Craft) return "";
      let d = item.Craft.Description || "";
      try {
        if (W.CraftingDescription && typeof W.CraftingDescription.Decode === "function") d = W.CraftingDescription.Decode(d);
      } catch (e) {
      }
      return ((item.Craft.Name || "") + " | " + d).toLowerCase();
    }
    function squash(t) {
      return String(t || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    }
    const SHOT_PARTS = {
      udder: /^(udders?|breasts?|boobs?|tits?|titty|titties|chest|bust|jugs|melons)$/,
      testes: /^(balls?|testicles?|testes|nuts|sack|scrotum)$/,
      penis: /^(penis|penises|cocks?|dicks?|shaft|member)$/,
      knot: /^knots?$/,
      vulva: /^(pussy|pussies|vulva|vagina|vaginal|cunt|twat)$/,
      butt: /^(anal|anus|ass|asshole|butt|butthole|backdoor)$/,
      throat: /^(throat|gag)$/
    };
    const SHOT_UP = /^(grow|grows|growth|growing|enlarg\w*|enhanc\w*|bigger|boost\w*|swell\w*|expand\w*|expansion|inflat\w*|plump\w*|gape|gaper|gaping|stretch\w*|loosen\w*|widen\w*|trainer|training|relax\w*|increas\w*|hyper|engorg\w*|amplif\w*)$/;
    const SHOT_DOWN = /^(shrink\w*|reduc\w*|smaller|tighten\w*|restor\w*|decreas\w*|minimi\w*|slim\w*)$/;
    function partShots(text) {
      const w = String(text || "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean), out = [], used = /* @__PURE__ */ new Set();
      for (let i = 0; i < w.length; i++) {
        const part = Object.keys(SHOT_PARTS).find((k) => SHOT_PARTS[k].test(w[i]));
        if (!part || out.some((o) => o[0] === part)) continue;
        let best = null;
        for (let d = 1; d <= 3 && !best; d++) for (const j of [i + d, i - d]) {
          if (j < 0 || j >= w.length || used.has(j)) continue;
          if (SHOT_UP.test(w[j])) {
            best = [j, 1];
            break;
          }
          if (SHOT_DOWN.test(w[j])) {
            best = [j, -1];
            break;
          }
        }
        if (best) {
          out.push([part, best[1]]);
          used.add(i);
          used.add(best[0]);
        }
      }
      return { pairs: out, rest: w.filter((x, k) => !used.has(k)).join(" ") };
    }
    function sizeTagsIn(text) {
      const out = [], flat = squash(text);
      for (const [part, d] of Object.entries(CFG.SIZE_TAGS)) {
        if (d.up.some((w) => flat.includes(squash(w)))) out.push([part, 1]);
        else if (d.down.some((w) => flat.includes(squash(w)))) out.push([part, -1]);
      }
      for (const pr of partShots(text).pairs) if (!out.some((o) => o[0] === pr[0])) out.push(pr);
      return out;
    }
    function tagsIn(text) {
      let flat = squash(partShots(text).rest);
      for (const d of Object.values(CFG.SIZE_TAGS)) for (const w of d.up.concat(d.down)) flat = flat.split(squash(w)).join(" ");
      const out = /* @__PURE__ */ new Set();
      for (const [tag, words] of Object.entries(CFG.TAG_WORDS))
        if (words.some((w) => flat.includes(squash(w)))) out.add(tag);
      return out;
    }
    function tell(mn, text) {
      if (canBeep(mn)) beep(mn, text);
      else if (charFor(mn)) whisper(mn, text);
      else beep(mn, text);
    }
    const wornCache = /* @__PURE__ */ new Map();
    function wornTags(mn) {
      const hit = wornCache.get(mn), now = Date.now();
      if (hit && now - hit.t < 5e3) return hit.v;
      const v = wornTagsNow(mn);
      wornCache.set(mn, { t: now, v });
      return v;
    }
    function wornTagsNow(mn) {
      const C = charFor(mn), out = /* @__PURE__ */ new Set();
      for (const it of C && C.Appearance || []) for (const t of tagsIn(craftText(it))) out.add(t);
      return out;
    }
    function seePenis(mn) {
      const C = charFor(mn);
      const p = prodOf(mn);
      if (!C || !p || !Array.isArray(C.Appearance)) return;
      p.hasPenis = C.Appearance.some((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === "Pussy" && /penis/i.test(it.Asset.Name || ""));
    }
    function capacity(mn) {
      const p = prodOf(mn);
      return CFG.PROD.BASE_CAPACITY + (p ? p.capBonus : 0) + (wornTags(mn).has("capacity") ? CFG.PROD.WORN_CAPACITY : 0);
    }
    function makesSemen(mn) {
      const r = rec(mn), p = prodOf(mn);
      return !!(r && (r.futa || p && p.hasPenis));
    }
    function hasVulva(mn) {
      const r = rec(mn), p = prodOf(mn);
      return !!(r && (r.futa || !(p && p.hasPenis)));
    }
    function sizeOf(mn, part) {
      const p = prodOf(mn), S = CFG.SIZES[part];
      if (!p) return S.start;
      if (!p.size) p.size = {};
      if (!p.size[part]) p.size[part] = S.start;
      return p.size[part];
    }
    function udderLevel(mn) {
      const p = prodOf(mn), up = p && (p.preg || p.freshUntil > Date.now()) ? CFG.PREG_UDDER_UP : 0;
      return Math.min(CFG.SIZES.udder.max, sizeOf(mn, "udder") + up);
    }
    function sizeBase(mn, part) {
      const p = prodOf(mn);
      return p.sizeBase && p.sizeBase[part] || sizeOf(mn, part);
    }
    function setSize(mn, part, lvl, permanent) {
      const p = prodOf(mn), S = CFG.SIZES[part];
      lvl = Math.max(1, Math.min(S.max, Math.round(lvl)));
      if (!p.size) p.size = {};
      if (!p.sizeBase) p.sizeBase = {};
      if (!p.gapeAt) p.gapeAt = {};
      if (permanent || !p.sizeBase[part]) p.sizeBase[part] = permanent ? lvl : sizeOf(mn, part);
      p.size[part] = lvl;
      p.gapeAt[part] = Date.now();
      return lvl;
    }
    function sizeWord(part, lvl) {
      const S = CFG.SIZES[part];
      if (S.inches) return (S.words.find((w) => lvl < w[0]) || S.words[S.words.length - 1])[1];
      if (S.cups) return S.cups[lvl - 1] + " cup, " + S.names[lvl - 1];
      return S.names[lvl - 1];
    }
    function isHyper(part, lvl) {
      return lvl > CFG.SIZES[part].natural;
    }
    function sizeName(mn, part) {
      const S = CFG.SIZES[part], l = part === "udder" ? udderLevel(mn) : sizeOf(mn, part);
      const extra = part === "udder" && l > sizeOf(mn, "udder") ? ", swollen from carryin'" : "";
      if (S.inches) return l + '" ' + sizeWord(part, l) + (isHyper(part, l) ? " \u2728" : "");
      return sizeWord(part, l) + " (" + l + "/" + S.max + (isHyper(part, l) ? " \u2728hyper" : "") + extra + ")";
    }
    function sizeX(part, lvl, perLevel) {
      const nat = CFG.SIZES[part].natural;
      const x = Math.max(0.4, 1 + perLevel * (Math.min(lvl, nat) - 3));
      return lvl > nat ? x * Math.pow(CFG.HYPER_X[part], lvl - nat) : x;
    }
    function udderX(mn) {
      return sizeX("udder", udderLevel(mn), CFG.UDDER_X_PER_LEVEL);
    }
    function testesX(mn) {
      return sizeX("testes", sizeOf(mn, "testes"), CFG.TESTES_X_PER_LEVEL);
    }
    function semenCap(mn) {
      return CFG.PROD.SEMEN_CAP * testesX(mn);
    }
    function halfLife(mn, h) {
      if (h === "mouth") return CFG.PROD.HALF_LIFE_H[h];
      return CFG.PROD.HALF_LIFE_H[h] / (1 + CFG.GAPE_LEAK_X * (sizeOf(mn, h) - 1));
    }
    function penisNeeds(inches) {
      return Math.max(1, Math.ceil(inches / CFG.INCHES_PER_GAPE));
    }
    function loadWord(mlAmt) {
      return CFG.LOAD_WORDS.find((w) => mlAmt < w[0])[1];
    }
    function sizePinned(mn) {
      for (const [part, at] of Object.entries(CFG.PIN_FROM_SIZE)) {
        if (!at) continue;
        if (part === "udder" && makesMilk(mn) && udderLevel(mn) >= at) return "udder";
        if (part === "testes" && makesSemen(mn) && sizeOf(mn, "testes") >= at) return "balls";
      }
      return null;
    }
    function penisType(mn) {
      const p = prodOf(mn);
      if (p && p.ptype && CFG.PENIS_TYPES[p.ptype]) return p.ptype;
      return CFG.SPECIES_PENIS[speciesKey(mn)] || "human";
    }
    function typeInfo(mn) {
      return CFG.PENIS_TYPES[penisType(mn)];
    }
    function knotted(mn) {
      const p = prodOf(mn);
      if (p && typeof p.knot === "boolean") return p.knot;
      return !!typeInfo(mn).knot;
    }
    function penisLabel(mn) {
      return (knotted(mn) && penisType(mn) !== "canine" ? "knotted " : "") + typeInfo(mn).label;
    }
    function setPenisType(mn, type) {
      const p = prodOf(mn);
      p.ptype = type;
      p.knot = !!CFG.PENIS_TYPES[type].knot || !!p.knotShot;
    }
    function penisTagsIn(text) {
      let flat = squash(text);
      for (const d of Object.values(CFG.SIZE_TAGS)) for (const w of d.up.concat(d.down)) flat = flat.split(squash(w)).join(" ");
      const out = { type: null, knot: 0 };
      if (CFG.KNOT_REMOVE_TAGS.some((w) => flat.includes(squash(w)))) {
        out.knot = -1;
        for (const w of CFG.KNOT_REMOVE_TAGS) flat = flat.split(squash(w)).join(" ");
      }
      if (CFG.KNOT_ADD_TAGS.some((w) => flat.includes(squash(w)))) out.knot = 1;
      for (const [type, words] of Object.entries(CFG.PENIS_TYPE_TAGS))
        if (words.some((w) => flat.includes(squash(w)))) {
          out.type = type;
          break;
        }
      return out;
    }
    function holesFrom(w) {
      const hs = String(w || "").toLowerCase().split(/[+&,]/).map((x) => holeFrom(x.trim()));
      return hs.length && hs.every(Boolean) ? Array.from(new Set(hs)) : null;
    }
    function holeText(hole) {
      return String(hole).split("+").map((h) => h === "mouth" ? "throat" : h).join(" and ");
    }
    function onBreedingStand(mn) {
      const C = charFor(mn), pos = C && C.MapData && C.MapData.Pos, s = (L.spots || {})[CFG.BREEDING_STAND];
      return !!(pos && s && Math.abs(s.X - pos.X) <= 1 && Math.abs(s.Y - pos.Y) <= 1);
    }
    function isRut() {
      return (/* @__PURE__ */ new Date()).getDay() === CFG.RUT_DAY;
    }
    function sceneCooldown(stud) {
      return CFG.FAST_SCENE_TYPES.includes(penisType(stud)) ? CFG.FAST_SCENE_S : CFG.RP_CUM_COOLDOWN_S;
    }
    function bellyWord(mn) {
      const p = prodOf(mn), f = heldTotal(p) / capacity(mn), now = Date.now();
      let w = f < 0.25 ? "" : f < 0.6 ? "a little soft" : f < 1 ? "round and full" : f < CFG.CUMFLATE_PIN_X ? "swollen and sloshin'" : "drum-tight";
      if (p.preg) {
        const d = (now - p.preg.since) / 864e5;
        const pw = d < 1 ? "" : d < 3 ? "just startin' to show" : d < 4 ? "showin'" : "heavy and round with the litter";
        if (pw) w = w ? w + ", " + pw : pw;
      }
      return w;
    }
    const RUT_LINES = [
      "\u{1F525} It's rut day on the farm, and the air's thick with it. Every stud's achin' and every belly's hungry.",
      "\u{1F525} Somewhere in the barn a stud groans and a pen gate rattles. Rut day's got everybody worked up.",
      "\u{1F525} The whole farm smells like heat and hay today. Rut day, y'all. Fertile as all get out."
    ];
    function rutTick() {
      if (!isRut() || !inRoom()) return;
      const now = Date.now();
      if (L.rutDay !== dayKey()) {
        L.rutDay = dayKey();
        L.rutSaid = now;
        saveLedger();
        announce("\u{1F525} RUT DAY, y'all! All day today every fill is twice as likely to take, and studs get pent up twice as fast. Get breedin'! \u{1F402}");
        return;
      }
      if (now - (L.rutSaid || 0) > CFG.RUT_EMOTE_MIN * 6e4 * (0.75 + Math.random() * 0.5)) {
        L.rutSaid = now;
        emote(RUT_LINES[Math.floor(Math.random() * RUT_LINES.length)].replace(/^🔥 /, "\u{1F525} "));
      }
    }
    function nearHeat(mn) {
      const C = charFor(mn), pos = C && C.MapData && C.MapData.Pos;
      if (!pos) return null;
      for (const O of W.ChatRoomCharacter || []) {
        const om = O.MemberNumber, op = O.MapData && O.MapData.Pos;
        if (om === mn || !op || !rec(om) || !inHeat(prodOf(om))) continue;
        if (Math.abs(op.X - pos.X) <= CFG.HEAT_SCENT_TILES && Math.abs(op.Y - pos.Y) <= CFG.HEAT_SCENT_TILES) return om;
      }
      return null;
    }
    function untie(mn, force) {
      const p = prodOf(mn);
      if (!p || !p.tieUntil) return;
      if (!force && Date.now() < p.tieUntil - 1e3) return;
      const stud = p.tiedTo;
      p.tieUntil = 0;
      p.tiedTo = 0;
      if (state.leashes.get(mn) === stud) state.leashes.delete(mn);
      saveLedger();
      if (charFor(mn)) emote("\u{1F4A7} With a slow, wet pop, " + plainName(stud) + "'s knot finally slips free of " + plainName(mn) + ", and a warm trickle follows it out. They're untied.");
    }
    const PART_WORDS = {
      udder: /^(udders?|breasts?|boobs?|tits?|chest)$/,
      testes: /^(balls?|testes|testicles?|nuts)$/,
      penis: /^(penis|cock|dick|shaft)$/,
      vulva: /^(vulva|pussy|cunt)$/,
      butt: /^(butt|ass|anus|anal)$/,
      throat: /^(throat|mouth|oral)$/,
      knot: /^(knot)$/
    };
    function partFrom(w) {
      w = String(w || "").toLowerCase();
      for (const [k, re] of Object.entries(PART_WORDS)) if (re.test(w)) return k;
      return null;
    }
    function itemLabel(it) {
      return it.Craft && it.Craft.Name || it.Asset.Description || it.Asset.Name;
    }
    function findItem(C, groups, effects) {
      return (C.Appearance || []).find((it) => {
        if (!it || !it.Asset || !it.Asset.Group) return false;
        const eff = [].concat(it.Property && it.Property.Effect || [], it.Asset.Effect || []);
        const blk = [].concat(it.Property && it.Property.Block || [], it.Asset.Block || []);
        return groups.includes(it.Asset.Group.Name) || effects.some((e) => eff.includes(e)) || groups.some((g) => blk.includes(g));
      });
    }
    function holeBlocked(mn, hole) {
      if (!CFG.BLOCK_CHECK) return null;
      const C = charFor(mn);
      if (!C || !Array.isArray(C.Appearance)) return null;
      const items = C.Appearance.filter((x) => x && x.Asset && x.Asset.Group);
      const grp = (x) => x.Asset.Group.Name;
      const eff = (x) => [].concat(x.Property && x.Property.Effect || [], x.Asset.Effect || []);
      const blk = (x) => [].concat(x.Property && x.Property.Block || [], x.Asset.Block || []);
      const FRONT = ["ItemVulva", "ItemPelvis", "ItemVulvaPiercings", "ItemPenis"];
      let it = null;
      if (hole === "vulva") {
        it = items.find((x) => FRONT.includes(grp(x)) && eff(x).includes("Chaste")) || items.find((x) => grp(x) !== "ItemVulva" && blk(x).includes("ItemVulva")) || items.find((x) => grp(x) === "ItemVulva" && (eff(x).includes("FillVulva") || /dildo|plug/i.test(x.Asset.Name)));
      } else if (hole === "butt") {
        it = items.find((x) => eff(x).includes("ButtChaste")) || items.find((x) => grp(x) !== "ItemButt" && blk(x).includes("ItemButt")) || items.find((x) => grp(x) === "ItemButt");
      } else if (hole === "mouth") {
        const MOUTH = ["ItemMouth", "ItemMouth2", "ItemMouth3"];
        const funnel = (x) => x.Asset.Name === "FunnelGag" && x.Property && (x.Property.Type === "Funnel" || x.Property.TypeRecord && x.Property.TypeRecord.typed === 1);
        it = items.find((x) => MOUTH.includes(grp(x)) && eff(x).includes("BlockMouth") && !eff(x).includes("OpenMouth") && !funnel(x)) || items.find((x) => !MOUTH.includes(grp(x)) && blk(x).includes("ItemMouth"));
      } else if (hole === "penis") {
        it = items.find((x) => FRONT.includes(grp(x)) && (eff(x).includes("Chaste") || /chastity|cage/i.test(x.Asset.Name || "")));
      }
      return it ? itemLabel(it) : null;
    }
    function heldTotal(p) {
      return HOLES.reduce((a, h) => a + (p.held[h] || 0), 0);
    }
    function inHeat(p) {
      return !!(p && p.heat && p.heat.until > Date.now());
    }
    function boosted(p, k) {
      return !!(p && p.boosts && p.boosts[k] > Date.now());
    }
    function milkCapNatural(mn) {
      return CFG.PROD.MILK_CAP * speciesInfo(mn).milk * udderX(mn);
    }
    function milkCap(mn) {
      const p = prodOf(mn);
      return milkCapNatural(mn) + (p ? p.capBonus : 0);
    }
    function makesMilk(mn) {
      const r = rec(mn);
      if (!r) return false;
      if (r.milkable === true || r.milkable === false) return r.milkable;
      return (hasRole(mn, ROLE.LIVESTOCK) || !!r.futa) && !limitBlocks(mn, "milk");
    }
    function milkRate(mn) {
      const p = prodOf(mn), now = Date.now();
      let r = CFG.PROD.MILK_PER_H * speciesInfo(mn).milk * udderX(mn);
      if (p.preg) r *= CFG.PROD.PREG_MILK_X;
      if (p.freshUntil > now) r *= CFG.PROD.FRESH_MILK_X;
      if (boosted(p, "milk")) r *= 2;
      if (wornTags(mn).has("lactation")) r *= 1.5;
      if (tierOf(mn) === "prize") r *= 1.25;
      if (boosted(p, "hungry")) r *= CFG.HUNGRY_X;
      if (p.nursed && p.nursed.week === weekKey()) r *= 1 + Math.min(CFG.NURSE_SUPPLY_MAX, CFG.NURSE_SUPPLY_STEP * p.nursed.n);
      return r * addonRateX(mn, "milk");
    }
    function semenRate(mn) {
      const p = prodOf(mn);
      let r = CFG.PROD.SEMEN_PER_H * testesX(mn);
      if (boosted(p, "semen")) r *= 2;
      if (wornTags(mn).has("virility")) r *= 1.5;
      if (boosted(p, "hungry")) r *= CFG.HUNGRY_X;
      return r * addonRateX(mn, "semen");
    }
    function dayKey(d) {
      d = d || /* @__PURE__ */ new Date();
      return d.toISOString().slice(0, 10);
    }
    function weekKey(d) {
      d = new Date(d || Date.now());
      d.setUTCHours(0, 0, 0, 0);
      d.setUTCDate(d.getUTCDate() + 3 - (d.getUTCDay() + 6) % 7);
      const w1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
      return d.getUTCFullYear() + "-W" + (1 + Math.round(((d - w1) / 864e5 - 3 + (w1.getUTCDay() + 6) % 7) / 7));
    }
    function rollBoard() {
      if (!L.yield) L.yield = { day: dayKey(), week: weekKey(), d: {}, w: {} };
      const Y = L.yield;
      if (Y.day !== dayKey()) {
        Y.d = {};
        Y.u = {};
        Y.day = dayKey();
      }
      if (Y.week !== weekKey()) {
        const top = Object.entries(Y.w).sort((a, b) => b[1] - a[1])[0];
        if (top && CFG.PROD.WEEKLY_PRIZE) {
          const mn = parseInt(top[0], 10), r = rec(mn);
          if (r && !CFG.PUNISH_TIERS.includes(r.tier)) {
            r.tier = "prize";
            audit(CFG.BOT_MEMBER, "TIER", mn + " \u2192 prize (top producer " + Y.week + ")");
            beep(mn, "\u{1F3C6} Top producer of the week, with " + ml(top[1]) + "! You're prize stock now, sugar. So proud of you!");
            if (inRoom()) announce("\u{1F3C6} Y'all give it up for this week's top producer: " + plainName(mn) + ", with " + ml(top[1]) + "! Prize stock now.");
          }
        }
        if (CFG.GRADE.WEEKLY_PRIZE && Y.g) {
          const best = Object.entries(Y.g).filter(([, v]) => v.n >= CFG.GRADE.MIN_SESSIONS).map(([m, v]) => [parseInt(m, 10), v.sum / v.n]).sort((a, b) => b[1] - a[1])[0];
          if (best) {
            const r = rec(best[0]);
            if (r && !CFG.PUNISH_TIERS.includes(r.tier)) {
              r.tier = "prize";
              audit(CFG.BOT_MEMBER, "TIER", best[0] + " \u2192 prize (best milk " + Y.week + ")");
              beep(best[0], "\u{1F3C6} Best milk on the farm this week, grade " + gradeLetter(best[1]) + "! You're prize stock now, sweetie. \u{1F95B}");
              if (inRoom()) announce("\u{1F3C6} Best milk of the week goes to " + plainName(best[0]) + ", grade " + gradeLetter(best[1]) + "! Prize stock, y'all. \u{1F95B}");
            }
          }
        }
        const sires = Object.entries(Y.s || {}).sort((a, b) => b[1] - a[1]).slice(0, CFG.TOP_SIRES);
        if (sires.length && inRoom())
          announce("\u{1F402} This week's top sires, y'all: " + sires.map(([m, n], i) => i + 1 + ". " + plainName(parseInt(m, 10)) + " (" + n + " caught)").join(", ") + ". Somebody's been busy! \u{1F37C}");
        for (const [m] of sires.slice(0, 1)) beep(parseInt(m, 10), "\u{1F402} You're the top sire on the farm this week, sugar! Proud of you.");
        Y.w = {};
        Y.g = {};
        Y.s = {};
        Y.week = weekKey();
      }
      saveLedger();
    }
    function credit(mn, amount) {
      rollBoard();
      L.yield.d[mn] = (L.yield.d[mn] || 0) + amount;
      L.yield.w[mn] = (L.yield.w[mn] || 0) + amount;
    }
    function drainMilk(mn, amount, nursing) {
      const p = prodOf(mn);
      if (milkDenied(mn)) return 0;
      const take = Math.min(p.milk, amount);
      if (!(take >= 1)) return 0;
      const now = Date.now();
      if (!nursing) {
        const d = dayKey();
        if (!p.mday || p.mday.day !== d) p.mday = { day: d, ml: 0 };
        p.mday.ml += take;
      }
      if (!nursing && (!p.lastMilkAt || now - p.lastMilkAt > CFG.GRADE.SESSION_GAP_MIN * 6e4)) {
        const gapH = p.lastMilkAt ? (now - p.lastMilkAt) / 36e5 : null;
        const sc = sessionScore(mn, gapH);
        p.grades = (p.grades || []).concat(sc).slice(-20);
        rollBoard();
        const g = L.yield.g || (L.yield.g = {});
        g[mn] = g[mn] || { sum: 0, n: 0 };
        g[mn].sum += sc;
        g[mn].n++;
      }
      if (!nursing) p.lastMilkAt = now;
      p.milk -= take;
      p.totals.milked += take;
      credit(mn, take);
      const over = heldTotal(p) - capacity(mn);
      if (over > 0 && !(p.tieUntil > now)) {
        const out = Math.min(over, take * CFG.MILK_LEAK_SHARE), tot = heldTotal(p);
        for (const h of HOLES) p.held[h] = Math.max(0, (p.held[h] || 0) - out * (p.held[h] || 0) / tot);
        p.leakAcc = (p.leakAcc || 0) + out;
        if (charFor(mn) && now - (p.leakSaid || 0) > 6e4 && p.leakAcc >= 5) {
          p.leakSaid = now;
          emote("\u{1F4A6} Every squeeze of " + plainName(mn) + "'s udder pushes a warm gush of " + (p.lastStud ? plainName(p.lastStud) + "'s" : "somebody's") + " seed back out of 'em (" + ml(p.leakAcc) + "). What a mess, sugar.");
          p.leakAcc = 0;
        }
      }
      return take;
    }
    function drainSemen(mn, amount) {
      const p = prodOf(mn);
      const take = Math.min(p.semen, amount);
      if (!(take >= 1)) return 0;
      p.lastCollectAt = Date.now();
      p.semen -= take;
      p.totals.collected += take;
      credit(mn, take);
      return take;
    }
    function startHeat(mn, by, hours) {
      const p = prodOf(mn);
      const already = inHeat(p);
      p.heat = { until: Date.now() + (hours || CFG.PROD.HEAT_H) * 36e5, by };
      p.nextHeatAt = Date.now() + CFG.PROD.NATURAL_HEAT_EVERY_D * 864e5;
      if (!already) {
        if (charFor(mn)) {
          emote(plainName(mn) + " flushes hot all over, comin' into heat.", mn);
          face(mn, "heat", 90);
        }
        tell(mn, "\u{1F525} Ooh, you've come into heat, " + plainName(mn) + "! Gonna be mighty hard to miss for the next " + (hours || CFG.PROD.HEAT_H) + " hours, sweetie.");
        for (const h of herdsOf(mn)) beep(h.leader, "\u{1F525} Heads up, hon: " + plainName(mn) + " just came into heat.");
      }
      saveLedger();
    }
    function heatLines() {
      return L.heatLines && L.heatLines.length ? L.heatLines.map((x) => x.text) : CFG.HEAT_LINES;
    }
    function rollConception(mother, stud, amount, bonus) {
      const p = prodOf(mother), r = rec(mother);
      if (!r.fertile || boosted(p, "contra")) return null;
      const now = Date.now();
      if (p.preg) {
        if (now - p.preg.since > CFG.PROD.EXTRA_SIRE_WINDOW_H * 36e5) return null;
        if (p.preg.sires.includes(stud)) return null;
      }
      let chance = CFG.PROD.CONCEIVE_BASE * speciesInfo(mother).fert * (0.5 + Math.min(1, (p.held.vulva || 0) / capacity(mother)));
      if (inHeat(p)) chance *= 3;
      if (boosted(p, "fert")) chance *= 2;
      if (wornTags(mother).has("fertility")) chance *= 1.5;
      if (bonus) chance *= bonus;
      if (isRut()) chance *= 2;
      if (p.vEdges && now - (p.vEdgeAt || 0) < CFG.VEDGE_HOURS * 36e5) chance *= 1 + CFG.VEDGE_X * p.vEdges;
      p.vEdges = 0;
      if (r.rights && r.rights.until > now && r.rights.stud !== stud && !(r.rights.allow || []).includes(stud)) return null;
      if (p.preg) chance *= CFG.PROD.EXTRA_SIRE_X;
      chance = Math.min(0.95, chance);
      if (Math.random() >= chance) return null;
      if (p.preg) {
        p.preg.sires.push(stud);
        return "extra";
      }
      const [lo, hi] = speciesInfo(mother).litter;
      let count = lo + Math.floor(Math.random() * (hi - lo + 1));
      if (lo === 1 && hi === 1 && Math.random() < CFG.PROD.TWIN_CHANCE) count = 2;
      p.preg = { since: now, due: now + CFG.PROD.PREG_DAYS * 864e5, sires: [stud], count, warned: false };
      return "new";
    }
    function giveBirth(mn) {
      const p = prodOf(mn), g = p.preg;
      const kids = { male: 0, female: 0, futa: 0 };
      const [m, f] = CFG.PROD.SEX_SPLIT;
      for (let i = 0; i < g.count; i++) {
        const x = Math.random() * 100;
        if (x < m) kids.male++;
        else if (x < m + f) kids.female++;
        else kids.futa++;
      }
      p.offspring.male += kids.male;
      p.offspring.female += kids.female;
      p.offspring.futa += kids.futa;
      p.offspring.litters++;
      for (const s of g.sires) {
        const sp = prodOf(s);
        if (sp) sp.totals.sired += 1;
      }
      if (!L.studbook) L.studbook = [];
      L.studbook.push({ t: Date.now(), dam: mn, sires: g.sires.slice(), kids });
      if (L.studbook.length > 1e3) L.studbook = L.studbook.slice(-1e3);
      const sires = g.sires.slice();
      p.preg = null;
      p.freshUntil = Date.now() + CFG.PROD.FRESH_DAYS * 864e5;
      saveLedger();
      audit(CFG.BOT_MEMBER, "BIRTH", mn + " " + JSON.stringify(kids));
      later(() => addonsEmit("birth", mn, kids, sires), 1500);
      const parts = [];
      if (kids.male) parts.push(kids.male + " male");
      if (kids.female) parts.push(kids.female + " female");
      if (kids.futa) parts.push(kids.futa + " futa");
      const msg = "\u{1F37C} Oh, y'all! " + plainName(mn) + " just delivered " + g.count + " (" + parts.join(", ") + "), sired by " + g.sires.map(plainName).join(" & ") + ". Milk's comin' in strong now!";
      if (onMap(mn)) emote("\u{1F37C} With one last long push, " + plainName(mn) + " delivers " + g.count + " (" + parts.join(", ") + "), sired by " + g.sires.map(plainName).join(" & ") + ". The farm girl tucks 'em in the straw, and " + plainName(mn) + "'s milk comes in strong, breasts swellin' heavy.");
      else beep(mn, msg);
      for (const h of herdsOf(mn)) beep(h.leader, msg);
    }
    function sessionScore(mn, gapH) {
      const p = prodOf(mn), now = Date.now(), G = CFG.GRADE;
      let sc = G.BASE + (G.TIER[tierOf(mn) || "new"] || 0);
      if (gapH === null) sc += 0;
      else if (gapH < G.TOO_SOON_H) sc += G.TOO_SOON;
      else if (gapH > G.TOO_LONG_H) sc += G.TOO_LONG;
      else if (gapH >= G.REGULAR_MIN_H && gapH <= G.REGULAR_MAX_H) sc += G.REGULAR;
      if (p.freshUntil > now) sc += G.FRESH;
      if (inHeat(p)) sc += G.HEAT;
      if (boosted(p, "milk")) sc += G.LACT_SHOT;
      if (wornTags(mn).has("lactation")) sc += G.LACT_WORN;
      if (p.fullSince && now - p.fullSince > CFG.PROD.OVERFULL_H * 36e5) sc += G.LEAKING;
      return Math.max(0, Math.min(100, sc));
    }
    function gradeLetter(sc) {
      for (const [min, l] of CFG.GRADE.LETTERS) if (sc >= min) return l;
      return "D";
    }
    function milkGrade(mn) {
      const p = prodOf(mn);
      const h = p && p.grades || [];
      if (!h.length) return gradeLetter(CFG.GRADE.BASE + (CFG.GRADE.TIER[tierOf(mn) || "new"] || 0));
      const last = h.slice(-CFG.GRADE.AVERAGE_OF);
      return gradeLetter(last.reduce((a, b) => a + b, 0) / last.length);
    }
    function prodTick() {
      const now = Date.now();
      for (const k in L.people) {
        const mn = parseInt(k, 10), r = L.people[k];
        if (!r.prod && !makesMilk(mn) && r.milkable !== true && !r.futa) continue;
        const p = prodOf(mn);
        if (charFor(mn)) seePenis(mn);
        const dtH = Math.max(0, (now - (p.last || now)) / 36e5);
        p.last = now;
        if (dtH > 0) {
          const capM = milkCap(mn);
          if (makesMilk(mn)) p.milk = Math.min(capM, p.milk + milkRate(mn) * dtH);
          if (makesSemen(mn)) p.semen = Math.min(semenCap(mn), p.semen + semenRate(mn) * dtH);
          const tied = p.tieUntil > now;
          for (const h of HOLES) {
            if (tied) continue;
            if (h !== "mouth" && charFor(mn) && holeBlocked(mn, h)) continue;
            p.held[h] = (p.held[h] || 0) * Math.pow(0.5, dtH / halfLife(mn, h));
          }
        }
        for (const h of ["vulva", "butt"]) {
          const cur = sizeOf(mn, h), base = sizeBase(mn, h), at = p.gapeAt && p.gapeAt[h] || 0;
          if (cur > base && now - at > CFG.GAPE_TIGHTEN_H * 36e5) setSize(mn, h, cur - 1, false);
        }
        const Cs = charFor(mn);
        if (Cs) {
          if (!p.stretchMs) p.stretchMs = {};
          if (!p.stretchOn) p.stretchOn = {};
          for (const [h, groups] of [["vulva", ["ItemVulva"]], ["butt", ["ItemButt"]], ["throat", ["ItemMouth", "ItemMouth2", "ItemMouth3"]]]) {
            const it = (Cs.Appearance || []).find((x) => x && x.Asset && x.Asset.Group && groups.includes(x.Asset.Group.Name) && isStretcher(x));
            if (!it) {
              if (p.stretchOn[h]) p.stretchOn[h] = false;
              continue;
            }
            if (!p.stretchOn[h]) {
              p.stretchOn[h] = true;
              const base = sizeBase(mn, h);
              if (sizeOf(mn, h) < base + 1 && base + 1 <= CFG.SIZES[h].max) setSize(mn, h, base + 1, false);
              if (onMap(mn)) emote(h === "throat" ? "\u{1F62E} " + plainName(mn) + "'s " + itemLabel(it) + " works its way deep, holdin' that throat open: " + sizeWord(h, sizeOf(mn, h)) + " for now." : "\u{1F351} " + plainName(mn) + "'s " + itemLabel(it) + " spreads that " + (h === "vulva" ? "pussy" : "ass") + " wide and stays put, stretchin' it " + sizeWord(h, sizeOf(mn, h)) + ".");
            }
            if (!(dtH > 0)) continue;
            p.stretchMs[h] = (p.stretchMs[h] || 0) + dtH * 36e5;
            if (p.stretchMs[h] >= CFG.STRETCH_TRAIN_H * 36e5) {
              p.stretchMs[h] = 0;
              const base = sizeBase(mn, h);
              if (base < CFG.SIZES[h].natural) {
                if (!p.sizeBase) p.sizeBase = {};
                p.sizeBase[h] = base + 1;
                if (sizeOf(mn, h) < base + 1) p.size[h] = base + 1;
                const where = h === "vulva" ? "pussy" : h === "butt" ? "ass" : "throat";
                if (onMap(mn)) emote("\u{1F351} That " + itemLabel(it) + " has done its work: " + plainName(mn) + "'s " + where + " stays " + sizeWord(h, sizeOf(mn, h)) + " for good now.");
                else tell(mn, "\u{1F351} That stretcher's doin' its job, " + plainName(mn) + "! Your " + where + " stays " + sizeWord(h, sizeOf(mn, h)) + " now.");
              }
            }
          }
        }
        if (makesSemen(mn) && p.semen >= semenCap(mn) - 0.5) {
          if (!p.semenFullSince) p.semenFullSince = now;
          const caged = !!holeBlocked(mn, "penis");
          if (isRut() && !p.pentUp) p.semenFullSince -= Math.min(now - (p.last2 || now), CFG.HEARTBEAT_MS * 2);
          const scent = nearHeat(mn);
          if (scent && !p.pentUp) {
            p.semenFullSince -= Math.min(now - (p.last2 || now), CFG.HEARTBEAT_MS * 2);
            if (!p.scentTold || now - p.scentTold > 36e5) {
              p.scentTold = now;
              emote("\u{1F443} " + plainName(mn) + " catches the scent of " + plainName(scent) + "'s heat, and those balls start achin' to empty.");
            }
          }
          const need = (caged ? CFG.PENTUP_CAGED_H : CFG.PENTUP_H) * 36e5;
          if (!p.pentUp && now - p.semenFullSince >= need) {
            p.pentUp = true;
            tell(mn, "\u{1F624} You're all pent up, " + plainName(mn) + "! Next load's gonna be a big one, and extra potent too.");
          }
        } else if (p.semen < semenCap(mn) - 0.5) p.semenFullSince = 0;
        p.last2 = now;
        if (p.heat && p.heat.until <= now) {
          p.heat = null;
          whisper(mn, "Your heat's passed, " + plainName(mn) + ". Bet you're feelin' a little calmer now, hon.");
        }
        if (r.naturalHeat && !limitBlocks(mn, "heat") && !inHeat(p) && p.nextHeatAt && now >= p.nextHeatAt) startHeat(mn, 0);
        if (r.naturalHeat && !p.nextHeatAt) p.nextHeatAt = now + CFG.PROD.NATURAL_HEAT_EVERY_D * 864e5;
        if (charFor(mn)) {
          p.seenDay = dayKey();
          scentTick(mn);
          sloshTick(mn);
          if (!p.seenMin || p.seenMin.day !== p.seenDay) p.seenMin = { day: p.seenDay, min: 0 };
          p.seenMin.min += CFG.HEARTBEAT_MS / 6e4;
        }
        if (p.painted && p.painted.until <= now) p.painted = null;
        checkTitles(mn);
        if (p.milkDeniedUntil) {
          if (now >= p.milkDeniedUntil) {
            p.milkDeniedUntil = 0;
            tell(mn, "\u{1F95B} Your teats are uncapped, " + plainName(mn) + ". Go get yourself milked, sugar!");
            if (onMap(mn)) emote("\u{1F95B} The caps come off " + plainName(mn) + "'s swollen teats, and milk starts beadin' right away. Somebody fetch a pail!");
          } else if (makesMilk(mn) && p.milk >= milkCap(mn) - 1 && onMap(mn) && now - (p.achedAt || 0) > CFG.MILK_ACHE_MIN * 6e4 * (0.75 + Math.random() * 0.5)) {
            p.achedAt = now;
            const ache = [
              "%n's udder is swollen tight and shiny, leakin' around the caps. They can't stop squirmin'.",
              "%n whimpers and cups their achin' breasts, so full it hurts. Nobody's allowed to milk 'em.",
              "A slow drip of milk runs down %n's belly from those capped, overfull teats."
            ];
            emote("\u{1F6AB} " + ache[Math.floor(Math.random() * ache.length)].replace(/%n/g, plainName(mn)));
          }
        }
        if (p.eggs && now >= p.eggs.layAt) {
          const here = onMap(mn);
          if (here || now - p.eggs.layAt > CFG.LABOUR_WAIT_H * 36e5) {
            const e = p.eggs;
            p.eggs = null;
            p.offspring.eggs = (p.offspring.eggs || 0) + e.n;
            if (!L.studbook) L.studbook = [];
            L.studbook.push({ t: now, dam: mn, sires: [e.by], kids: { male: 0, female: 0, futa: 0 }, eggs: e.n });
            saveLedger();
            audit(CFG.BOT_MEMBER, "EGGS", mn + " " + e.n);
            if (here) emote("\u{1F95A} " + plainName(mn) + " squats and strains, belly rollin', and one by one pushes out " + e.n + " slick, warm eggs from " + plainName(e.by) + "'s clutch. The farm girl gathers 'em into a nest of straw.");
            else tell(mn, "\u{1F95A} You laid " + e.n + " eggs from " + plainName(e.by) + "'s clutch, sugar.");
          }
        }
        if (p.preg) {
          if (!p.preg.warned && p.preg.due - now < 864e5) {
            p.preg.warned = true;
            beep(mn, "\u{1F37C} You're due in less than a day, " + plainName(mn) + "! Almost there, sweetie.");
            for (const h of herdsOf(mn)) beep(h.leader, "\u{1F37C} " + plainName(mn) + " is due in less than a day, hon.");
          }
          if (now >= p.preg.due) {
            if (p.labour) {
              if (now >= p.labour.until) {
                p.labour = null;
                giveBirth(mn);
              } else if (onMap(mn) && now >= p.labour.next) {
                p.labour.next = now + (8 + Math.random() * 6) * 6e4;
                const c = [
                  "%n grips the rail and moans through another contraction, belly tight and heavin'.",
                  "%n pants and rocks on all fours. The litter's movin' lower, any time now.",
                  "Another wave rolls through %n, and they let out a long, low moo. Not long now, sugar."
                ];
                emote("\u{1F37C} " + c[Math.floor(Math.random() * c.length)].replace(/%n/g, plainName(mn)));
              }
            } else if (onMap(mn)) {
              p.labour = { until: now + CFG.LABOUR_MIN * 6e4, next: now + 10 * 6e4 };
              emote("\u{1F37C} Y'all, " + plainName(mn) + "'s water just broke! They're in labour with " + p.preg.sires.map(plainName).join(" & ") + "'s litter. Come gather round the stall.");
              for (const h of herdsOf(mn)) tell(h.leader, "\u{1F37C} " + plainName(mn) + " just went into labour, hon. Come watch!");
            } else if (now - p.preg.due > CFG.LABOUR_WAIT_H * 36e5) giveBirth(mn);
          }
        }
        if (p.tieUntil && now >= p.tieUntil) untie(mn, true);
        if (p.deniedUntil && now >= p.deniedUntil) {
          p.deniedUntil = 0;
          p.pentUp = true;
          tell(mn, "\u{1F624} Your denial's up, " + plainName(mn) + ", and you're achin' with it. Next load's a big, pent-up one.");
        }
        if (p.preg && now - p.preg.since > 3 * 864e5 && charFor(mn) && now - (p.showSaid || 0) > 864e5) {
          p.showSaid = now;
          emote("\u{1F930} " + plainName(mn) + " rests a hand on that swellin' belly. " + plainName(p.preg.sires[0]) + "'s litter is really showin' now.");
        }
        for (const h of ["vulva", "butt"]) {
          if (!charFor(mn) || sizeOf(mn, h) < CFG.LEAKY_GAPE || (p.held[h] || 0) < 30 || p.tieUntil > now || holeBlocked(mn, h)) continue;
          p.lastDrip = p.lastDrip || {};
          if (now - (p.lastDrip[h] || 0) < CFG.LEAKY_EMOTE_MIN * 6e4 * (0.75 + Math.random() * 0.5)) continue;
          p.lastDrip[h] = now;
          const out = p.held[h] * 0.1;
          p.held[h] -= out;
          emote("\u{1F4A7} " + plainName(mn) + "'s " + sizeWord(h, sizeOf(mn, h)) + " " + h + " just can't hold it: " + ml(out) + " of " + (p.lastStud ? plainName(p.lastStud) + "'s" : "somebody's") + " seed dribbles down their thighs.");
        }
        const swell = (CFG.PROD.PIN_FROM_INFLATION ? heldTotal(p) : 0) + (CFG.PROD.PIN_FROM_MILK ? Math.max(0, p.milk - milkCapNatural(mn)) : 0);
        const bySize = sizePinned(mn);
        const cumflated = CFG.PROD.PIN_FROM_INFLATION && heldTotal(p) >= CFG.CUMFLATE_PIN_X * capacity(mn);
        const pinned = (swell >= CFG.PROD.IMMOBILE_ML || !!bySize || cumflated) && !(p.unpinUntil > now);
        const Cp = charFor(mn), pos = Cp && Cp.MapData && Cp.MapData.Pos;
        if (pinned && pos) {
          if (!p.pin) {
            p.pin = { X: pos.X, Y: pos.Y };
            if (cumflated && !bySize) {
            } else whisper(mn, bySize ? "\u{1F388} Oh my, your " + (bySize === "udder" ? "udder is" : "balls are") + " just too big to move with, " + plainName(mn) + "! You'll stay put right here till somebody gives you " + (bySize === "udder" ? "an udder" : "a ball") + " reducer shot." : "\u{1F388} Oh my, you're too full to move, " + plainName(mn) + "! You'll stay put right here till you're milked down or somebody gives you a reducin' shot.");
          } else if (pos.X !== p.pin.X || pos.Y !== p.pin.Y) {
            if (p.tieUntil > now) p.pin = { X: pos.X, Y: pos.Y };
            else teleport(mn, p.pin, false, true);
          }
        } else if (p.pin && !pinned) {
          p.pin = null;
          if (Cp) whisper(mn, "You can move again, " + plainName(mn) + "! Go on and stretch those legs.");
          if (Cp && heldTotal(p) > capacity(mn) * 0.5 && !bySize) emote("\u{1F388} Enough has finally drained out of " + plainName(mn) + " that they can waddle again, belly still soft and sloshin'.");
        }
        const capNow = milkCap(mn);
        if (makesMilk(mn) && p.milk >= capNow - 1) {
          if (!p.fullSince) p.fullSince = now;
        } else p.fullSince = 0;
        if (p.fullSince && now - p.fullSince > CFG.PROD.OVERFULL_H * 36e5 && charFor(mn) && now - (p.lastLeak || 0) > CFG.PROD.LEAK_EMOTE_MIN * 6e4 * (0.75 + Math.random() * 0.5)) {
          p.lastLeak = now;
          emote(fill(pickFresh("leak", CFG.LEAK_LINES), mn), mn);
        }
        if (inHeat(p) && charFor(mn) && now - p.lastHeatEmote > CFG.PROD.HEAT_EMOTE_MIN * 6e4 * (0.75 + Math.random() * 0.5)) {
          p.lastHeatEmote = now;
          const lines = heatLines();
          const line = lines[Math.floor(Math.random() * lines.length)];
          emote(fill(line, mn), mn);
        }
      }
      saveLedger();
    }
    function milkingStallTick() {
      const stalls = Object.entries(L.spots || {}).filter(([n]) => n.startsWith("milking"));
      if (!stalls.length) return;
      const dtMin = CFG.HEARTBEAT_MS / 6e4;
      for (const C of W.ChatRoomCharacter || []) {
        const pos = C.MapData && C.MapData.Pos;
        if (!pos || C.MemberNumber === CFG.BOT_MEMBER) continue;
        const on = stalls.some(([, s]) => Math.abs(s.X - pos.X) <= 1 && Math.abs(s.Y - pos.Y) <= 1);
        const mn = C.MemberNumber, now = Date.now();
        if (!on || !rec(mn)) {
          const p0 = rec(mn) && prodOf(mn);
          if (p0) {
            p0.stallSeen = 0;
            p0.stallWhyTold = false;
            if (p0.stall && now - (p0.stall.seenAt || now) > CFG.PROD.STALL_AWAY_GRACE_S * 1e3) {
              p0.stallPaused = { until: now + 6e5, st: p0.stall };
              p0.stall = null;
            }
          }
          continue;
        }
        const p = prodOf(mn);
        const keepM = milkCap(mn) * CFG.PROD.STALL_LEAVE_SHARE, keepS = semenCap(mn) * CFG.PROD.STALL_LEAVE_SHARE;
        const doM = makesMilk(mn) && !milkDenied(mn) && !gearOf(mn).milk && p.milk > keepM;
        const doS = makesSemen(mn) && p.semen > keepS;
        if (!p.stall && !doM && !doS) {
          p.stallSeen = (p.stallSeen || 0) + 1;
          if (p.stallSeen >= 2 && !p.stallWhyTold) {
            p.stallWhyTold = true;
            let why;
            if (!makesMilk(mn) && !makesSemen(mn)) why = "you're not makin' milk right now. Say ?milkable on if you'd like to.";
            else if (makesMilk(mn) && milkDenied(mn)) why = "your teats are capped. Nothin' comes out till staff let it.";
            else if (makesMilk(mn) && gearOf(mn).milk) why = "the pump you're wearin' is already doin' the milkin'.";
            else {
              const rate = makesMilk(mn) ? milkRate(mn) : 0;
              const mins = rate > 0 ? Math.ceil((keepM - p.milk) / rate * 60) : 0;
              const when = mins > 0 ? mins >= 90 ? " Come back in about " + Math.round(mins / 60) + " hours." : " Come back in about " + Math.max(1, mins) + " minutes." : "";
              why = makesMilk(mn) ? "you've only got " + ml(p.milk) + " in there, and the stall leaves you a quarter (" + ml(keepM) + "), so there's nothin' to take yet." + when : "there's not enough built up in you yet. The stall leaves you a quarter.";
            }
            tell(mn, "\u{1F95B} The stall's cups give you a sniff and let go, sugar: " + why);
          }
          continue;
        }
        if (!p.stall && (doM || doS) && p.stallRest > now) {
          if (p.stallRestTold !== p.stallRest) {
            p.stallRestTold = p.stallRest;
            const left = Math.ceil((p.stallRest - now) / 6e4);
            tell(mn, "\u{1F95B} The stall's cups are restin' after your last go, sugar. Come back in about " + left + " minute" + (left === 1 ? "" : "s") + ".");
          }
          continue;
        }
        if (!p.stall && (doM || doS)) {
          p.stallSeen = (p.stallSeen || 0) + 1;
          if (p.stallSeen < 2) continue;
          if (p.stallPaused && p.stallPaused.until > now && p.stallPaused.st) {
            p.stall = p.stallPaused.st;
            p.stall.seenAt = now;
          }
          p.stallPaused = null;
        }
        if (!p.stall && (doM || doS)) {
          const [lo, hi] = CFG.PROD.STALL_SESSION_RANGE;
          const fracM = doM ? (p.milk - keepM) / Math.max(1, milkCap(mn) - keepM) : 0;
          const fracS = doS ? (p.semen - keepS) / Math.max(1, semenCap(mn) - keepS) : 0;
          const mins = Math.round(lo + (hi - lo) * Math.min(1, Math.max(fracM, fracS)));
          const total = { m: doM ? p.milk - keepM : 0, s: doS ? p.semen - keepS : 0 };
          p.stall = {
            since: now,
            seenAt: now,
            mins,
            total,
            got: { m: 0, s: 0 },
            rateM: total.m / mins,
            rateS: total.s / mins,
            kind: doM && doS ? "both" : doM ? "milk" : "cock",
            nextBeat: now + 15e3,
            nextOpen: now + CFG.PROD.STALL_LINE_MIN * 6e4,
            opens: 0
          };
          sound(mn, "stall");
          tell(mn, "\u{1F95B} The stall latches on. About " + mins + " minutes to drain you down to a quarter, sugar. Stay put.");
        }
        if (!p.stall) continue;
        const st = p.stall;
        st.seenAt = now;
        st.got = st.got || { m: 0, s: 0 };
        st.total = st.total || { m: Math.max(0, p.milk - keepM), s: Math.max(0, p.semen - keepS) };
        st.kind = st.kind || (doM && doS ? "both" : doM ? "milk" : "cock");
        const rateM = st.rateM || CFG.PROD.STALL_MILK_PER_MIN, rateS = st.rateS || CFG.PROD.STALL_SEMEN_PER_MIN;
        st.until = now + Math.ceil(Math.max(doM ? (p.milk - keepM) / rateM : 0, doS ? (p.semen - keepS) / rateS : 0)) * 6e4;
        const gotM = doM ? drainMilk(mn, Math.min(rateM * dtMin, p.milk - keepM)) : 0;
        const gotS = doS ? drainSemen(mn, Math.min(rateS * dtMin, p.semen - keepS)) : 0;
        st.got.m += gotM;
        st.got.s += gotS;
        const doneM = !makesMilk(mn) || milkDenied(mn) || gearOf(mn).milk || p.milk <= keepM + 1;
        const doneS = !makesSemen(mn) || p.semen <= keepS + 0.5;
        const done = doneM && doneS;
        if (!done && now >= (st.nextBeat || 0)) {
          st.nextBeat = now + (15 + Math.random() * 10) * 1e3;
          privateTo(mn, (st.kind === "cock" ? "\u{1F402} " : "\u{1F95B} ") + stallBeat(mn, st), "emote");
        }
        if (!done && now >= (st.nextOpen || 0) && (st.opens || 0) < CFG.PROD.STALL_OPEN_MAX) {
          st.nextOpen = now + CFG.PROD.STALL_LINE_MIN * 6e4;
          st.opens = (st.opens || 0) + 1;
          const n = plainName(mn);
          if (st.kind !== "cock") {
            emote("\u{1F95B} " + (addonLine("stallMilk", lineInfo(mn, { ml: ml(st.got.m) })) || [
              "The stall's cups pull at " + n + "'s breasts in a slow rhythm, and warm milk runs down the lines into the bucket.",
              "Milk streams from " + n + " into the stall's bucket. They shift their weight and let out a soft, happy sound."
            ][Math.floor(Math.random() * 2)]), mn);
          } else {
            const c = penisLabel(mn);
            const alt = addonLine("stallSemen", lineInfo(mn, { ml: ml(st.got.s), cock: c }));
            const L1 = [
              n + "'s " + c + " cock is sealed in the stall's wet suction sleeve, and it pumps and pulls in a slow, steady rhythm. Their hips twitch every time it squeezes.",
              "The machine strokes " + n + " from root to tip, milkin' that " + c + " cock for every drop. Seed spurts into the collection jar in thick pulses.",
              "A warm vibrating cup hugs " + n + "'s balls while the sleeve sucks their cock. " + n + " is a moanin', drippin' mess in the stall."
            ];
            emote("\u{1F402} " + (alt || L1[Math.floor(Math.random() * L1.length)]), mn);
          }
        }
        if (done) {
          p.stall = null;
          p.stallPaused = null;
          const R = CFG.PROD.STALL_REST_MIN;
          p.stallRest = now + (R[0] + Math.random() * (R[1] - R[0])) * 6e4;
          if (st.got.m + st.got.s > 0) {
            privateTo(mn, (st.kind === "cock" ? "\u{1F402} " : "\u{1F95B} ") + stallBeat(mn, st, true), "emote");
            const semenOnly = st.kind === "cock";
            const altDone = addonLine(semenOnly ? "stallDoneSemen" : "stallDone", lineInfo(mn));
            emote(altDone ? (semenOnly ? "\u{1F402} " : "\u{1F95B} ") + altDone : semenOnly ? "\u{1F402} The stall wrings " + plainName(mn) + " down to the last quarter and lets go. Balls aching and light, legs wobbly. Good stud!" : "\u{1F95B} The milkin' stall eases off once " + plainName(mn) + " is down to a quarter, sore and drippin'. Good job, sweetie! Off you go.", mn);
          }
        }
      }
    }
    function doCum(stud, t, hole, R, auto, opt) {
      opt = opt || {};
      if (!rec(stud)) {
        R("You need to be on the books for that, sugar. Say ?apply first!");
        return false;
      }
      const rt = rec(t);
      if (!rt || !rt.breedable || limitBlocks(t)) {
        R(plainName(t) + " ain't breedable, hon. They'd have to say ?breedable on themselves (and their limits have to allow it).");
        return false;
      }
      const gone = missing(stud, t);
      if (gone) {
        R(gone === stud ? "You've gotta be here on the map for that, sugar." : plainName(t) + " isn't here on the map right now, hon. You both need to be in the room.");
        return false;
      }
      if (!opt.second && !breedConsent(stud, t)) {
        askBreed(stud, t, hole);
        R("I've asked " + plainName(t) + " first, sugar. Once they say yes, go right ahead.");
        return false;
      }
      const sp = prodOf(stud), tp = prodOf(t);
      seePenis(stud);
      seePenis(t);
      if (hole === "vulva" && !hasVulva(t)) {
        R(plainName(t) + " doesn't have a vulva to fill, hon. Try butt or mouth, like ?cum " + plainName(t) + " butt. (If they're futa, they can say ?futa on.)");
        return false;
      }
      const penBlock = makesSemen(stud) && holeBlocked(stud, "penis");
      if (penBlock) {
        R("Can't do it, sugar: your penis is locked up in " + penBlock + ". Get it off first!");
        blockedTease(stud, t, hole, penBlock, true);
        return false;
      }
      const holeBlock = holeBlocked(t, hole);
      if (holeBlock) {
        R("Whoa there, hon! " + plainName(t) + "'s " + (hole === "mouth" ? "mouth" : hole) + " is blocked by " + holeBlock + ". That'll have to come off before you can fill it.");
        blockedTease(stud, t, hole, holeBlock, false);
        return false;
      }
      if (sp.deniedUntil > Date.now()) {
        R("\u{1F6AB} Not yet, sugar. You're denied for " + Math.ceil((sp.deniedUntil - Date.now()) / 6e4) + " more minutes. Ache for it.");
        return false;
      }
      const T = makesSemen(stud) ? typeInfo(stud) : CFG.PENIS_TYPES.human;
      const knot = makesSemen(stud) && knotted(stud);
      const pent = opt.load ? !!opt.pent : !!sp.pentUp;
      let load = opt.load || 0, rest = 0;
      if (!opt.load) {
        const base = pent ? sp.semen * CFG.PENTUP_LOAD_X : Math.max(sp.semen * CFG.PROD.LOAD_SHARE, Math.min(sp.semen, CFG.PROD.MIN_LOAD));
        if (base < 1) {
          R(makesSemen(stud) ? "Aw, you're drained plumb dry, sugar. Nothin' left to give till you build back up." : "You've got no semen to give, sugar. Wear a penis (or say ?futa on) and it'll build up by the hour.");
          return false;
        }
        sp.semen = pent ? 0 : sp.semen - Math.min(sp.semen, base);
        if (pent) {
          sp.pentUp = false;
          sp.semenFullSince = 0;
        }
        load = base * (T.loadX || 1);
        if (sp.edges) {
          load *= 1 + CFG.EDGE_X * Math.min(sp.edges, CFG.EDGE_MAX);
          opt.edged = sp.edges;
          sp.edges = 0;
        }
        sp.fills = (sp.fills || []).filter((x) => Date.now() - x < 36e5);
        if (!pent && !boosted(sp, "semen") && sp.fills.length >= CFG.STAMINA_FILLS)
          load *= Math.pow(CFG.STAMINA_X, sp.fills.length - CFG.STAMINA_FILLS + 1);
        sp.fills.push(Date.now());
        if (opt.half) {
          rest = load / 2;
          load = load / 2;
        }
      }
      sp.totals.given += load;
      const pen = sizeOf(stud, "penis"), need = penisNeeds(pen);
      let gagged = 0, trained = false;
      const funnel = hole === "mouth" && funnelOn(t);
      if (hole === "mouth" && !funnel && makesSemen(stud) && need > sizeOf(t, "throat")) {
        gagged = load * (1 - sizeOf(t, "throat") / need);
        tp.throatTrain = (tp.throatTrain || 0) + (T.throatX || 1);
        if (tp.throatTrain >= CFG.THROAT_TRAIN_EVERY && sizeBase(t, "throat") < CFG.SIZES.throat.natural) {
          tp.throatTrain = 0;
          setSize(t, "throat", sizeOf(t, "throat") + 1, true);
          trained = true;
        }
      }
      const room = Math.max(0, capacity(t) - heldTotal(tp));
      const fullBefore = heldTotal(tp) / capacity(t);
      const kept = knot ? load - gagged : Math.min(load - gagged, room), spilt = load - gagged - kept;
      tp.held[hole] = (tp.held[hole] || 0) + kept;
      tp.totals.received += kept;
      if (hole === "mouth") tp.milk = Math.min(milkCap(t), tp.milk + kept * CFG.PROD.SWALLOW_TO_MILK);
      if (hole === "mouth" && kept >= CFG.HUNGRY_ML) {
        tp.boosts = tp.boosts || {};
        tp.boosts.hungry = Date.now() + 36e5;
      }
      const sc0 = state.scenes.get(stud);
      const F = L.life && L.life.fair;
      if (F && F.open && F.cls === "load" && F.entrants[stud]) {
        F.loads = F.loads || {};
        F.loads[stud] = Math.max(F.loads[stud] || 0, load);
      }
      tp.lastStud = stud;
      const flavor = {
        equine: " That flared head swells wide with every pulse.",
        feline: " Those barbs make sure every last drop counts.",
        draconic: " Every ridge drags deliciously on the way.",
        double: opt.load || opt.half ? " Both cocks throb and unload at once." : ""
      }[penisType(stud)] || "";
      let o = "\u{1F4A6} " + (pent ? "All pent up, " : "") + plainName(stud) + " empties " + loadWord(load) + " (" + ml(load) + ") " + (funnel ? "down " + plainName(t) + "'s funnel gag, and it pours straight to their belly" : "into " + plainName(t) + "'s " + (hole === "mouth" ? "throat" : hole)) + "." + (makesSemen(stud) ? flavor : "") + " " + plainName(t) + " is " + Math.round(100 * heldTotal(tp) / capacity(t)) + "% full" + (spilt > 0 ? ", and " + ml(spilt) + " spills out" : "") + ".";
      if (opt.edged) o += " Edged " + opt.edged + " time" + (opt.edged === 1 ? "" : "s") + " first, it just keeps on comin'.";
      if (hole === "mouth" && makesSemen(stud)) o += " " + seedTaste(stud, pent);
      if (gagged >= 1) o += " " + plainName(t) + " gags on that " + pen + '" cock and drools ' + ml(gagged) + " back up" + (trained ? ", but that throat's learnin': it's " + sizeWord("throat", sizeOf(t, "throat")) + " now" : "") + ".";
      if (hole !== "mouth" && makesSemen(stud)) {
        const gape = sizeOf(t, hole);
        const needK = need + (knot ? 1 : 0);
        let to = opt.gentle ? gape : needK > gape ? Math.min(needK, gape + CFG.STRETCH_PER_BREED * (T.stretchX || 1)) : gape;
        if (opt.rough) to = Math.min(CFG.SIZES[hole].max, to + 1);
        if (to > gape) {
          setSize(t, hole, to, false);
          o += opt.rough ? " Pounded that hard, " + plainName(t) + "'s " + (hole === "vulva" ? "pussy" : "ass") + " is left " + sizeWord(hole, sizeOf(t, hole)) + " and twitchin'!" : " That " + pen + '" ' + sizeWord("penis", pen) + " cock leaves 'em " + sizeWord(hole, sizeOf(t, hole)) + "!";
        } else if (opt.gentle && needK > gape) o += " Taken slow and sweet, so not one bit of stretchin'.";
      }
      let caught = null;
      if (hole === "vulva") {
        const bonus = (pent ? CFG.PENTUP_FERT_X : 1) * (knot ? CFG.KNOT_FERT_X : 1) * (T.heat && !inHeat(tp) ? 3 : 1) * (onBreedingStand(t) ? CFG.BREEDING_STAND_X : 1);
        tp.lastFill = { at: Date.now(), stud, ml: kept };
        caught = rollConception(t, stud, kept, bonus);
        sp.totals.covers = (sp.totals.covers || 0) + 1;
        if (caught) {
          sp.totals.conceived = (sp.totals.conceived || 0) + 1;
          rollBoard();
          const Y = L.yield;
          Y.s = Y.s || {};
          Y.s[stud] = (Y.s[stud] || 0) + 1;
        }
      }
      okBreed(stud, t);
      face(t, "bred", 40);
      sound(t, "wet");
      if (!opt.second) {
        tally(t);
        tp.scent = { stud, until: Date.now() + CFG.SCENT_H * 36e5 };
        for (const h of herdsOf(t)) {
          if (h.leader === stud) continue;
          tp.toldLeader = tp.toldLeader || {};
          const key = h.leader + ":" + stud;
          if (Date.now() - (tp.toldLeader[key] || 0) < 36e5) continue;
          tp.toldLeader[key] = Date.now();
          tell(h.leader, "\u{1F443} Heads up, hon: " + plainName(stud) + " just filled your " + plainName(t) + " (" + holeText(hole) + "). They smell of " + plainName(stud) + " now.");
        }
      }
      let clutch = 0;
      if (!opt.second && hole !== "mouth" && makesSemen(stud) && penisType(stud) === "draconic" && rt.eggs && !tp.eggs && !limitBlocks(t, "eggs") && Math.random() < (knot ? CFG.EGG_TIED_CHANCE : CFG.EGG_CHANCE)) {
        const [lo, hi] = CFG.EGG_COUNT, [dl, dh] = CFG.EGG_DAYS;
        clutch = lo + Math.floor(Math.random() * (hi - lo + 1));
        tp.eggs = { n: clutch, by: stud, since: Date.now(), layAt: Date.now() + (dl + Math.random() * (dh - dl)) * 864e5 };
      }
      saveLedger();
      audit(stud, "CUM", stud + "\u2192" + t + " " + hole + " " + Math.round(load));
      emote(o, t);
      if (clutch) emote("\u{1F95A} Deep inside " + plainName(t) + ", something takes hold: " + plainName(stud) + "'s draconic seed has left a clutch of " + clutch + " eggs growin' in there. They'll be layin' in a few days.");
      if (sc0) sc0.lastCum = Date.now();
      if (knot && !opt.second) {
        const frac = (sizeOf(stud, "knot") - 1) / (CFG.SIZES.knot.max - 1), span = CFG.TIE_MAX_M - CFG.TIE_MIN_M;
        const lo = CFG.TIE_MIN_M + span * frac * 0.6, hi = CFG.TIE_MIN_M + span * (0.4 + 0.6 * frac);
        const mins = Math.round(lo + Math.random() * (hi - lo));
        const until = Date.now() + mins * 6e4, again = tp.tieUntil > Date.now() && tp.tiedTo === stud;
        tp.tieUntil = Math.max(tp.tieUntil || 0, until);
        tp.tiedTo = stud;
        state.leashes.set(t, stud);
        emote(again ? "\u{1F512} " + plainName(stud) + "'s knot swells even fatter, lockin' " + plainName(t) + " down tighter. Their tie runs another " + Math.round((tp.tieUntil - Date.now()) / 6e4) + " minutes." : "\u{1F512} " + plainName(stud) + "'s " + sizeWord("knot", sizeOf(stud, "knot")) + " knot swells and locks deep in " + plainName(t) + "'s " + (hole === "mouth" ? "throat" : hole) + ". They're tied together now, and " + plainName(t) + " is goin' wherever " + plainName(stud) + " goes for the next " + mins + " minutes.");
        later(() => untie(t, false), tp.tieUntil - Date.now() + 500);
        if (!again && onBreedingStand(t))
          emote("\u{1F440} Right up on the breedin' stand for the whole farm to see: " + plainName(t) + ", knotted fast to " + plainName(stud) + " and squirmin' on it. Pull up a hay bale, y'all.");
      }
      const fullNow = heldTotal(tp) / capacity(t);
      if (fullNow >= CFG.CUMFLATE_PIN_X && fullBefore < CFG.CUMFLATE_PIN_X)
        emote("\u{1F388} " + plainName(t) + "'s belly is stretched round, tight and sloshin' with " + plainName(stud) + "'s seed, way too swollen to waddle off. They're stuck right where they are till it drains.");
      else if (fullNow > 1 && fullBefore <= 1)
        emote("\u{1F388} " + plainName(t) + "'s belly starts to round out, warm and heavy with " + plainName(stud) + "'s load.");
      if (caught === "new") emote("\u{1F37C} It took! A soft, warm glow settles over " + plainName(t) + ": they're carryin' " + plainName(stud) + "'s young now. Due in " + CFG.PROD.PREG_DAYS + " days.");
      if (caught === "new" && !makesMilk(t) && !limitBlocks(t, "milk"))
        tell(t, "\u{1F37C} You're carryin' now, sugar. Want your milk to come in with the litter? Say ?milkable on and you'll start fillin' up. Leave it, and you'll stay dry.");
      if (caught === "extra") emote("\u{1F37C} " + plainName(stud) + " got one in too! " + plainName(t) + " is carryin' for two sires now.");
      if (caught) {
        for (const h of herdsOf(t)) beep(h.leader, "\u{1F37C} Guess what, sugar: " + plainName(t) + " caught from " + plainName(stud) + "!");
      }
      return { load, rest, pent };
    }
    function breedConsent(stud, t) {
      const r = rec(t);
      if (r && r.freeuse) return true;
      const u = state.breedOk.get(t + ":" + stud);
      return !!(u && u > Date.now());
    }
    function okBreed(stud, t) {
      state.breedOk.set(t + ":" + stud, Date.now() + CFG.BREED_OK_H * 36e5);
    }
    function askBreed(stud, t, hole) {
      const a = state.breedAsks.get(t), now = Date.now();
      if (a && a.stud === stud && now - a.at < 6e4) return;
      state.breedAsks.set(t, { stud, hole: hole || null, at: now });
      askCard(t, "breed", "\u{1F402} " + plainName(stud) + " wants to breed you" + (hole ? " (" + holeText(hole) + ")" : "") + ", sugar. Say yes or no (?yes or ?no works too). Say ?freeuse on if you'd rather never be asked.");
    }
    function answerBreed(t, yes) {
      const a = state.breedAsks.get(t);
      if (!a || Date.now() - a.at > CFG.BREED_ASK_MIN * 6e4) {
        state.breedAsks.delete(t);
        return false;
      }
      state.breedAsks.delete(t);
      const stud = a.stud;
      if (!yes) {
        tell(t, "Understood, hon. I told " + plainName(stud) + " no.");
        tell(stud, "\u{1F402} " + plainName(t) + " said no, sugar. Please leave it be.");
        return true;
      }
      okBreed(stud, t);
      const hole = a.hole || "vulva";
      const sc = state.scenes.get(stud), now = Date.now();
      if (sc) {
        if (!sc.with.includes(t)) sc.with.push(t);
        if (a.hole) sc.hole = a.hole;
        sc.lastSeen = now;
      } else state.scenes.set(stud, { with: [t], hole, at: now, by: stud, lastCum: 0, lastSeen: now });
      if (onMap(t) && onMap(stud)) emote("\u{1F402} " + plainName(t) + " nods and presents for " + plainName(stud) + ". The farm girl opens the gate and marks it in the stud book (" + holeText(hole) + ").");
      tell(stud, "\u{1F402} " + plainName(t) + " said yes! Your scene's open (" + holeText(hole) + "). Say cum (or orgasm, breed, fill them up) in your chat or emotes.");
      return true;
    }
    function jarOk(t) {
      const r = rec(t);
      return !!r && r.jarok !== false;
    }
    function inseminateProblem(t, jar, hole) {
      const rt = rec(t);
      if (!rt || !rt.breedable || limitBlocks(t)) return plainName(t) + " ain't breedable, hon. They'd have to say ?breedable on themselves (and their limits have to allow it).";
      if (!onMap(t)) return plainName(t) + " needs to be here on the map for that, hon.";
      if (hole === "vulva" && !hasVulva(t)) return plainName(t) + " doesn't have a vulva, sugar. Try butt or mouth.";
      const blk = holeBlocked(t, hole);
      if (blk) return plainName(t) + "'s " + hole + " is blocked by " + blk + ". That has to come off first.";
      if (!jar) return "that jar's gone off the shelf, sugar.";
      return "";
    }
    function askJar(staff, t, jarId, hole, machine) {
      state.jarAsks.set(t, { staff, jar: jarId, hole, machine: !!machine, at: Date.now() });
      askCard(t, "jar", "\u{1F489} " + plainName(staff) + " wants to " + (machine ? "load jar #" + jarId + " into the machine for you (" + holeText(hole) + "), so it empties into you while it runs" : "inseminate you from jar #" + jarId + " (" + holeText(hole) + ")") + ", sugar. Say yes or no (?yes or ?no works too). Say ?jarok off if you'd rather never be asked.");
    }
    function answerJar(t, yes) {
      const a = state.jarAsks.get(t);
      if (!a || Date.now() - a.at > CFG.BREED_ASK_MIN * 6e4) {
        state.jarAsks.delete(t);
        return false;
      }
      state.jarAsks.delete(t);
      if (!yes) {
        tell(t, "Understood, hon. I told " + plainName(a.staff) + " no.");
        tell(a.staff, "\u{1F489} " + plainName(t) + " said no to the jar, sugar. Please leave it be.");
        return true;
      }
      showConsent(t, a.staff, a.machine ? "the breedin' machine" : "the jar");
      if (a.machine) {
        state.machineLoads = state.machineLoads || /* @__PURE__ */ new Map();
        state.machineLoads.set(t, { staff: a.staff, jar: a.jar, hole: a.hole, at: Date.now() });
        tell(a.staff, "\u2699\uFE0F " + plainName(t) + " said yes. Jar #" + a.jar + " is loaded; it goes in when their machine runs (within " + CFG.GEAR.MACHINE_LOAD_MIN + " minutes).");
        return true;
      }
      const err = inseminate(a.staff, t, a.jar, a.hole);
      if (err) {
        tell(t, "You said yes, hon, but it can't happen right now: " + err);
        tell(a.staff, "\u{1F489} " + plainName(t) + " said yes, but " + err);
      }
      return true;
    }
    function inseminate(sender, t, jarId, hole, machine) {
      L.jars = (L.jars || []).filter((j) => Date.now() - j.t < CFG.JAR_DAYS * 864e5);
      const jar = L.jars.find((j) => String(j.id) === String(jarId));
      const err = inseminateProblem(t, jar, hole);
      if (err) return err;
      const tp = prodOf(t);
      const room = Math.max(0, capacity(t) - heldTotal(tp)), kept = Math.min(jar.ml, room);
      tp.held[hole] = (tp.held[hole] || 0) + kept;
      tp.totals.received += kept;
      tp.lastStud = jar.stud;
      L.jars = L.jars.filter((j) => j !== jar);
      let caught = null;
      if (hole === "vulva") {
        tp.lastFill = { at: Date.now(), stud: jar.stud, ml: kept };
        caught = rollConception(t, jar.stud, kept, onBreedingStand(t) ? CFG.BREEDING_STAND_X : 1);
        if (caught) {
          const sp = prodOf(jar.stud);
          sp.totals.conceived = (sp.totals.conceived || 0) + 1;
          rollBoard();
          const Y = L.yield;
          Y.s = Y.s || {};
          Y.s[jar.stud] = (Y.s[jar.stud] || 0) + 1;
        }
      }
      const tookLine = () => caught && emote("\u{1F37C} It took! A soft, warm glow settles over " + plainName(t) + ": they're carryin' " + plainName(jar.stud) + "'s young now, no stud required.", t);
      const vars = { n: plainName(t), b: plainName(sender), bMn: sender, m: machine || "", h: HOLE_WORD[hole] || hole, ml: ml(kept), stud: plainName(jar.stud), jar: jar.id, icon: machine ? "\u2699\uFE0F" : "\u{1F489}" };
      if (!runScene(machine ? "machine" : "syringe", t, vars, tookLine)) {
        emote(machine ? "\u2699\uFE0F The " + machine + " under " + plainName(t) + " gives a wet click and empties jar #" + jar.id + " deep into their " + vars.h + ": " + ml(kept) + " of " + plainName(jar.stud) + "'s seed, pumped in with every stroke." : "\u{1F489} " + plainName(sender) + " fills the syringe from jar #" + jar.id + " and slides it deep into " + plainName(t) + "'s " + vars.h + ", pushin' " + ml(kept) + " of " + plainName(jar.stud) + "'s seed all the way in.", t);
        tookLine();
      }
      saveLedger();
      audit(sender, "INSEMINATE", t + " jar" + jar.id + " " + Math.round(kept));
      return "";
    }
    function answerPending(t, yes) {
      const j = state.jarAsks.get(t), b = state.breedAsks.get(t);
      if (j && (!b || j.at >= b.at)) return answerJar(t, yes) || answerBreed(t, yes);
      return answerBreed(t, yes) || answerJar(t, yes);
    }
    const PAINT_AREAS = {
      face: "face",
      tits: "tits",
      titties: "tits",
      breasts: "tits",
      boobs: "tits",
      chest: "chest",
      belly: "belly",
      stomach: "belly",
      tummy: "belly",
      back: "back",
      ass: "ass",
      butt: "ass",
      cheeks: "ass",
      hair: "hair",
      thighs: "thighs",
      feet: "feet",
      body: "body"
    };
    const PAINT_RX = /\b(?:on|over|across|onto|all over)\s+(?:(?:her|his|their|its|[a-z]+'s)\s+)?(?:\w+\s+)?(face|tits|titties|breasts|boobs|chest|belly|stomach|tummy|back|ass|butt|cheeks|hair|thighs|feet|body)\b/i;
    function paint(stud, t, area, R) {
      if (!rec(stud)) {
        R("You need to be on the books for that, sugar. Say ?apply first!");
        return false;
      }
      const rt = rec(t);
      if (!rt || !rt.breedable || limitBlocks(t)) {
        R(plainName(t) + " ain't breedable, hon. They'd have to say ?breedable on themselves (and their limits have to allow it).");
        return false;
      }
      const gone = missing(stud, t);
      if (gone) {
        R(gone === stud ? "You've gotta be here on the map for that, sugar." : plainName(t) + " isn't here on the map right now, hon.");
        return false;
      }
      if (!breedConsent(stud, t)) {
        askBreed(stud, t);
        R("I've asked " + plainName(t) + " first, sugar. Once they say yes, go right ahead.");
        return false;
      }
      const sp = prodOf(stud), tp = prodOf(t), now = Date.now();
      seePenis(stud);
      const penBlock = makesSemen(stud) && holeBlocked(stud, "penis");
      if (penBlock) {
        R("Can't do it, sugar: your cock's locked up in " + penBlock + ".");
        return false;
      }
      if (sp.deniedUntil > now) {
        R("\u{1F6AB} Not yet, sugar. You're denied for " + Math.ceil((sp.deniedUntil - now) / 6e4) + " more minutes.");
        return false;
      }
      const pent = !!sp.pentUp;
      const base = pent ? sp.semen * CFG.PENTUP_LOAD_X : Math.max(sp.semen * CFG.PROD.LOAD_SHARE, Math.min(sp.semen, CFG.PROD.MIN_LOAD));
      if (base < 1) {
        R("Aw, you're drained plumb dry, sugar.");
        return false;
      }
      sp.semen = pent ? 0 : sp.semen - Math.min(sp.semen, base);
      if (pent) {
        sp.pentUp = false;
        sp.semenFullSince = 0;
      }
      let load = base * ((makesSemen(stud) ? typeInfo(stud) : CFG.PENIS_TYPES.human).loadX || 1);
      if (sp.edges) {
        load *= 1 + CFG.EDGE_X * Math.min(sp.edges, CFG.EDGE_MAX);
        sp.edges = 0;
      }
      sp.totals.given += load;
      okBreed(stud, t);
      const a = PAINT_AREAS[String(area).toLowerCase()] || "body";
      const was = tp.painted && tp.painted.until > now ? tp.painted.areas : [];
      tp.painted = { areas: Array.from(new Set(was.concat(a))), until: now + CFG.PAINT_H * 36e5, by: stud };
      lscgSplat(t, a, plainName(stud));
      tally(t);
      saveLedger();
      audit(stud, "PAINT", stud + "\u2192" + t + " " + a + " " + Math.round(load));
      const lines = {
        face: "pulls out at the last second and paints %t's face: " + loadWord(load) + " (" + ml(load) + ") in thick ropes across their cheeks, lips and lashes.",
        tits: "pulls out and unloads all over %t's tits: " + loadWord(load) + " (" + ml(load) + ") drippin' down the curves and off those nipples.",
        chest: "pulls out and splashes " + loadWord(load) + " (" + ml(load) + ") across %t's chest.",
        belly: "pulls out and paints %t's belly with " + loadWord(load) + " (" + ml(load) + "), pooling warm in their navel.",
        back: "pulls out and streaks " + loadWord(load) + " (" + ml(load) + ") all up %t's back.",
        ass: "pulls out and glazes %t's ass with " + loadWord(load) + " (" + ml(load) + "), drippin' down between their cheeks.",
        hair: "pulls out and leaves " + loadWord(load) + " (" + ml(load) + ") tangled in %t's hair.",
        thighs: "pulls out and spills " + loadWord(load) + " (" + ml(load) + ") over %t's thighs.",
        feet: "pulls out and coats %t's feet with " + loadWord(load) + " (" + ml(load) + ").",
        body: "pulls out and hoses %t down with " + loadWord(load) + " (" + ml(load) + ")."
      };
      emote("\u{1F4A6} " + (pent ? "All pent up, " : "") + plainName(stud) + " " + lines[a].replace(/%t/g, plainName(t)) + " " + plainName(t) + " is marked as " + plainName(stud) + "'s now, for everybody to see.");
      return { load, pent };
    }
    const SPLAT_SPOTS = {
      face: ["ItemHead", "ItemMouth"],
      hair: ["ItemHead"],
      tits: ["ItemBreast"],
      chest: ["ItemBreast"],
      belly: ["ItemPelvis"],
      back: ["ItemButt"],
      ass: ["ItemButt"],
      thighs: ["ItemVulva"],
      crotch: ["ItemVulva"],
      feet: ["ItemPelvis"],
      body: ["ItemPelvis"]
    };
    function lscgSplatsOn(mn) {
      const C = charFor(mn), S = C && C.LSCG && C.LSCG.SplatterModule;
      return !!(S && S.enabled && S.taker !== false && (!C.LSCG.GlobalModule || C.LSCG.GlobalModule.enabled !== false));
    }
    function lscgSplat(mn, area, who) {
      if (!CFG.LSCG_SPLATTERS || !lscgSplatsOn(mn)) return false;
      for (const group of SPLAT_SPOTS[PAINT_AREAS[String(area || "").toLowerCase()] || "body"] || ["ItemPelvis"]) {
        send("ChatRoomChat", {
          Content: "ChatOther-" + group + "-LSCG_Splat",
          Type: "Activity",
          Target: mn,
          Dictionary: [
            { Tag: "SourceCharacter", Text: who || "A stranger" },
            { TargetCharacter: mn },
            { Tag: "FocusAssetGroup", FocusGroupName: group },
            { ActivityName: "LSCG_Splat" }
          ]
        });
      }
      return true;
    }
    function paintOn(t, area, by) {
      const tp = prodOf(t);
      if (!tp) return;
      const now = Date.now(), a = PAINT_AREAS[String(area || "").toLowerCase()] || "body";
      const was = tp.painted && tp.painted.until > now ? tp.painted.areas : [];
      tp.painted = { areas: Array.from(new Set(was.concat(a))), until: now + CFG.PAINT_H * 36e5, by: by || 0 };
      lscgSplat(t, a, by ? plainName(by) : null);
      saveLedger();
    }
    function paintedText(mn) {
      const p = prodOf(mn);
      return p && p.painted && p.painted.until > Date.now() ? p.painted.areas.join(", ") : "";
    }
    function tally(t) {
      const p = prodOf(t), r = rec(t), d = dayKey();
      if (!p.tally || p.tally.day !== d) p.tally = { day: d, n: 0 };
      p.tally.n++;
      rollBoard();
      const Y = L.yield;
      Y.u = Y.u || {};
      if (r && r.tally) Y.u[t] = p.tally.n;
      if (r && r.tally && [5, 10, 20, 30, 50, 100].includes(p.tally.n) && onMap(t))
        emote("\u270F\uFE0F The farm girl adds another tally mark on " + plainName(t) + "'s thigh: " + p.tally.n + " today, and the day ain't over. Somebody's a popular little cumdump.");
    }
    function tallyToday(mn) {
      const p = prodOf(mn);
      return p && p.tally && p.tally.day === dayKey() ? p.tally.n : 0;
    }
    function scentOf(t) {
      const p = prodOf(t);
      return p && p.scent && p.scent.until > Date.now() ? p.scent.stud : 0;
    }
    function scentTick(mn) {
      const C = charFor(mn), pos = C && C.MapData && C.MapData.Pos, p = prodOf(mn), now = Date.now();
      if (!pos || !makesSemen(mn)) return;
      p.smelled = p.smelled || {};
      for (const O of W.ChatRoomCharacter || []) {
        const om = O.MemberNumber, op = O.MapData && O.MapData.Pos;
        if (om === mn || !op || !rec(om)) continue;
        const other = scentOf(om);
        if (!other || other === mn) continue;
        if (Math.abs(op.X - pos.X) > CFG.HEAT_SCENT_TILES || Math.abs(op.Y - pos.Y) > CFG.HEAT_SCENT_TILES) continue;
        if (now - (p.smelled[om] || 0) < 36e5) continue;
        p.smelled[om] = now;
        emote("\u{1F443} " + plainName(mn) + " leans in close to " + plainName(om) + " and catches it: they reek of " + plainName(other) + "'s seed. Somebody's already been in there today.");
      }
    }
    function sloshTick(mn) {
      const C = charFor(mn), pos = C && C.MapData && C.MapData.Pos, p = prodOf(mn), now = Date.now();
      if (!pos) return;
      const moved = p.lastPos && (p.lastPos.X !== pos.X || p.lastPos.Y !== pos.Y);
      p.lastPos = { X: pos.X, Y: pos.Y };
      if (!moved || p.pin || now - (p.sloshAt || 0) < CFG.SLOSH_MIN * 6e4 * (0.75 + Math.random() * 0.5)) return;
      const full = heldTotal(p) / capacity(mn), milky = makesMilk(mn) && p.milk >= milkCap(mn) * 0.9 && udderLevel(mn) >= 6;
      const n = plainName(mn);
      let line = null;
      if (full > 1) line = [
        n + " waddles along, belly round and tight, and you can hear every step slosh with " + (p.lastStud ? plainName(p.lastStud) + "'s" : "somebody's") + " seed.",
        "Every step makes " + n + "'s swollen belly wobble and gurgle. A little dribble escapes down their thighs.",
        n + " moves real careful, one hand on that sloshin' belly, cheeks pink."
      ][Math.floor(Math.random() * 3)];
      else if (milky) line = [
        n + "'s heavy, milk-swollen udder bounces and sways with every step. A drop beads at each nipple.",
        n + " tries to walk without jigglin' those full, achin' breasts, and fails completely."
      ][Math.floor(Math.random() * 2)];
      if (!line) return;
      p.sloshAt = now;
      emote("\u{1F4A6} " + line, mn);
    }
    function bellyRub(src, t) {
      if (!rec(t) || !onMap(t)) return;
      const p = prodOf(t), now = Date.now();
      if (now - (p.rubAt || 0) < 12e4) return;
      const a = plainName(src), n = plainName(t);
      let line = null;
      if (p.preg) line = [
        a + " rubs " + n + "'s round belly, and the litter kicks right back. " + n + " giggles and leans into the touch.",
        "Under " + a + "'s palm, " + n + "'s belly shifts and flutters. " + p.preg.sires.map(plainName).join(" & ") + "'s young are wide awake in there."
      ][Math.floor(Math.random() * 2)];
      else if (p.eggs) line = a + " strokes " + n + "'s swollen belly and feels the eggs shift and clack together inside. " + n + " lets out a needy little whimper.";
      else if (heldTotal(p) > capacity(t)) line = a + " presses on " + n + "'s cum-swollen belly, and it gurgles. A warm trickle squeezes out of 'em. Messy!";
      if (!line) return;
      p.rubAt = now;
      emote("\u{1F930} " + line, t);
    }
    function praiseOrDegrade(by, t, praise, text) {
      const r = rec(t), p = prodOf(t), now = Date.now();
      const k = praise ? "praised" : "degraded";
      r[k] = (r[k] || 0) + 1;
      saveLedger();
      if (now - ((p.pdAt || {})[k] || 0) < 12e4) return;
      p.pdAt = p.pdAt || {};
      p.pdAt[k] = now;
      const n = plainName(t), a = plainName(by);
      const word = ((praise ? text.match(CFG.RP_PRAISE) : text.match(CFG.RP_DEGRADE)) || [""])[0].toLowerCase();
      const lines = praise ? [
        n + " just glows at bein' called a " + word.replace(/^good /, "good ") + ", squirmin' happy and pink all over.",
        '"' + word.charAt(0).toUpperCase() + word.slice(1) + '" goes straight to ' + n + "'s head. They melt, tail waggin' if they've got one.",
        n + " beams up at " + a + ", practically purrin' from the praise."
      ] : [
        n + " flushes red to the ears at bein' called a " + word + ", and can't quite look " + a + " in the eye. They don't argue, either.",
        'The word "' + word + '" lands, and ' + n + " squirms, cheeks burnin' and thighs pressed together.",
        n + " bites their lip and nods. A " + word + ". Yes. That's exactly what they are."
      ];
      emote((praise ? "\u{1F497} " : "\u{1F940} ") + lines[Math.floor(Math.random() * lines.length)], t);
    }
    function earnedTitle(mn, key) {
      const r = rec(mn), p = prodOf(mn);
      if (!r || !p) return false;
      const t = p.totals || {}, o = p.offspring || {};
      switch (key) {
        case "cream":
          return (t.milked || 0) >= 1e5;
        case "dump":
          return (t.received || 0) >= 5e4;
        case "brood":
          return (o.litters || 0) >= 5;
        case "breeder":
          return (o.litters || 0) >= 10;
        case "bottom":
          return ["vulva", "butt"].some((h) => sizeBase(mn, h) >= CFG.SIZES[h].natural);
        case "throat":
          return sizeBase(mn, "throat") >= CFG.SIZES.throat.natural;
        case "stud":
          return (t.covers || 0) >= 50;
        case "sire":
          return (t.sired || 0) >= 10;
        case "eggs":
          return (o.eggs || 0) >= 10;
      }
      return false;
    }
    function checkTitles(mn) {
      const r = rec(mn);
      if (!r) return;
      r.titles = r.titles || [];
      for (const T of CFG.TITLES) {
        if (r.titles.includes(T.key) || !earnedTitle(mn, T.key)) continue;
        r.titles.push(T.key);
        saveLedger();
        audit(CFG.BOT_MEMBER, "TITLE", mn + " " + T.key);
        if (onMap(mn)) emote("\u{1F396}\uFE0F Y'all hear that? " + plainName(mn) + " just earned the title " + T.name + " (" + T.why + "). The farm girl pins a ribbon right on 'em.");
        else tell(mn, "\u{1F396}\uFE0F You just earned the title " + T.name + " (" + T.why + "), sugar!");
      }
    }
    function titleNames(mn) {
      const r = rec(mn);
      return (r && r.titles || []).map((k) => (CFG.TITLES.find((T) => T.key === k) || {}).name).filter(Boolean);
    }
    function titleTag(mn) {
      const n = titleNames(mn);
      return n.length ? " \xAB" + n[n.length - 1] + "\xBB" : "";
    }
    function quotaOf(mn) {
      const r = rec(mn);
      if (!r || !makesMilk(mn)) return 0;
      if (typeof r.quota === "number") return r.quota;
      return hasRole(mn, ROLE.LIVESTOCK) ? CFG.MILK_QUOTA_ML : 0;
    }
    function milkedOn(mn, d) {
      const p = prodOf(mn);
      return p && p.mday && p.mday.day === d ? p.mday.ml : 0;
    }
    function quotaTick() {
      const today = dayKey();
      if (L.quotaDay === today) return;
      const prev = L.quotaDay;
      L.quotaDay = today;
      saveLedger();
      if (!prev) return;
      for (const k in L.people) {
        const mn = parseInt(k, 10), r = L.people[k], q = quotaOf(mn), p = r.prod;
        if (!q || !p || p.seenDay !== prev) continue;
        if (!p.seenMin || p.seenMin.day !== prev || p.seenMin.min < CFG.QUOTA_MIN_PRESENT) continue;
        if (r.registeredAt && dayKey(new Date(r.registeredAt)) === prev) continue;
        const got = milkedOn(mn, prev);
        if (got >= q) {
          r.quotaStreak = (r.quotaStreak || 0) + 1;
          const tier = tierOf(mn), up = { new: "trained", trained: "prize" }[tier];
          if (r.quotaStreak >= CFG.QUOTA_STREAK_UP && up) {
            r.quotaStreak = 0;
            r.tier = up;
            audit(CFG.BOT_MEMBER, "TIER", mn + " \u2192 " + up + " (milk quota)");
            tell(mn, "\u{1F95B} " + CFG.QUOTA_STREAK_UP + " days in a row on quota! You're " + tierName(up) + " now, sweetie. Good cow.");
            if (onMap(mn)) emote("\u{1F380} " + plainName(mn) + " has filled the pail every day for " + CFG.QUOTA_STREAK_UP + " days, so the farm girl ties a " + tierName(up) + " ribbon on their collar. Such a good, productive cow.");
          } else tell(mn, "\u{1F95B} Quota met yesterday (" + ml(got) + " of " + ml(q) + "). That's " + r.quotaStreak + " day" + (r.quotaStreak === 1 ? "" : "s") + " in a row, sugar!");
        } else {
          r.quotaStreak = 0;
          r.naughtyMarks = (r.naughtyMarks || 0) + 1;
          tell(mn, "\u{1F95B} You only gave " + ml(got) + " of your " + ml(q) + " quota yesterday, sugar. That's a naughty mark (" + r.naughtyMarks + " now). Get yourself milked!");
          if (onMap(mn)) emote("\u{1F4CB} The farm girl taps her clipboard at " + plainName(mn) + ": only " + ml(got) + " in the pail yesterday. A naughty mark goes on the board, and those udders get a disappointed little squeeze.");
        }
      }
      saveLedger();
    }
    function milkDenied(mn) {
      const p = prodOf(mn);
      return !!(p && p.milkDeniedUntil > Date.now());
    }
    function seedTaste(stud, pent) {
      const k = speciesKey(stud);
      const by = {
        cow: "rich and creamy",
        bull: "thick, salty and heavy",
        horse: "musky and endless",
        pony: "musky and sweet",
        dog: "hot, thin and salty",
        pup: "hot and salty",
        wolf: "wild and gamey",
        fox: "sharp and musky",
        cat: "tangy and sharp",
        kitt: "tangy",
        pig: "thick and earthy",
        goat: "strong and musky",
        sheep: "mild and creamy",
        bunny: "sweet and light",
        rabbit: "sweet and light",
        deer: "clean and grassy",
        goblin: "funky and bitter",
        dragon: "smoky and hot"
      }[k];
      return "It tastes " + (by || "salty and warm") + (pent ? ", and so thick from bein' pent up it clings to the throat" : "") + ".";
    }
    function blockedTease(stud, t, hole, item, studSide) {
      state.teased = state.teased || /* @__PURE__ */ new Map();
      const key = stud + ":" + t, now = Date.now();
      if (now - (state.teased.get(key) || 0) < 12e4) return;
      state.teased.set(key, now);
      const where = hole === "mouth" ? "mouth" : hole === "vulva" ? "pussy" : "ass";
      if (studSide) {
        if (onMap(stud)) emote("\u{1F512} " + plainName(stud) + "'s cock strains and throbs against " + item + ", achin' for " + plainName(t) + "'s " + where + ", and can't do a thing about it. Poor thing.");
        return;
      }
      tell(t, "\u{1F512} " + plainName(stud) + " wanted in, sugar, but your " + item + " said no.");
      if (onMap(t)) emote("\u{1F512} " + plainName(stud) + " presses right up against " + plainName(t) + "'s " + where + ", only to find " + item + " in the way. So close, and so locked up.");
    }
    function cumInto(stud, t, holes, R, auto, o2) {
      o2 = o2 || {};
      if (holes.length > 1) {
        if (!(makesSemen(stud) && typeInfo(stud).double)) {
          R("Two holes at once takes a double cock, sugar! Pick one, like ?cum " + plainName(t) + " " + holes[0] + ". (?penis double, or a double cock shot.)");
          return false;
        }
        for (const h of holes) {
          const b = holeBlocked(t, h);
          if (b) {
            R("Whoa there, hon! " + plainName(t) + "'s " + h + " is blocked by " + b + ". That'll have to come off first.");
            return false;
          }
        }
        const first = doCum(stud, t, holes[0], R, auto, Object.assign({ half: true }, o2));
        if (!first) return false;
        doCum(stud, t, holes[1], R, auto, Object.assign({ load: first.rest, pent: first.pent, second: true }, o2));
        return first;
      }
      return doCum(stud, t, holes[0], R, auto, o2);
    }
    function namedIn(text, list) {
      const low = " " + text.toLowerCase().replace(/[^a-z0-9'\s]/g, " ") + " ";
      const has = (w) => w.length > 1 && (low.includes(" " + w + " ") || low.includes(" " + w + "'s "));
      return list.find((mn) => low.includes(" " + mn + " ") || namesOf(mn).some((n) => has(n) || n.split(/\s+/).some((w) => w.length > 2 && has(w))));
    }
    function holeFromRP(text, stud, t) {
      const low = String(text).toLowerCase(), found = [];
      if (/\b(pussy|cunt|vulva|womb|vagina|slit|cervix)\b/.test(low) && hasVulva(t)) found.push("vulva");
      if (/\b(ass|asshole|butthole|butt|anus|rear|backdoor|bowels|rump)\b/.test(low)) found.push("butt");
      if (/\b(mouth|throat|tongue|gullet|lips)\b/.test(low)) found.push("mouth");
      if (!found.length) return null;
      if (found.length >= 2 && found.includes("vulva") && found.includes("butt") && makesSemen(stud) && typeInfo(stud).double) return ["vulva", "butt"];
      return [found[0]];
    }
    const BELLY_WORDS = /\b(belly|bellies|tummy|tum|stomach|womb|bump|baby bump)\b/i;
    const TOUCH_WORDS = /\b(rub\w*|stroke\w*|strok\w*|touch\w*|press\w*|pat\w*|pet\w*|caress\w*|feel\w*|felt|kiss\w*|nuzzl\w*|cuddl\w*|hug\w*|rest\w*|lay\w*|lean\w*|grind\w*|cradl\w*|hold\w*|massag\w*)\b/i;
    function bellyTouchFromRP(sender, text) {
      if (!BELLY_WORDS.test(text) || !TOUCH_WORDS.test(text)) return;
      const others = (W.ChatRoomCharacter || []).map((c) => c.MemberNumber).filter((m) => m !== sender && m !== CFG.BOT_MEMBER);
      const t = namedIn(text, others);
      if (t) bellyRub(sender, t);
    }
    function onRoleplay(sender, text, type) {
      if (!text || /^[?!.\-\/]/.test(text.trim())) return;
      const now = Date.now();
      if (type === "Emote") {
        try {
          bellyTouchFromRP(sender, text);
        } catch (e) {
          warn("belly rp:", e);
        }
      }
      const sc = state.scenes.get(sender);
      if (sc && now - (sc.lastSeen || sc.at) > CFG.SCENE_IDLE_MIN * 6e4) {
        state.scenes.delete(sender);
      } else if (sc) {
        sc.lastSeen = now;
        const hit = CFG.RP_CUM_WORDS.test(text);
        log("RP scene", sender, type, hit ? "cum word \u2713" : "no cum word", JSON.stringify(text.slice(0, 60)));
        if (hit) {
          const wait = sceneCooldown(sender) - Math.floor((now - (sc.lastCum || 0)) / 1e3);
          const t = namedIn(text, sc.with) || sc.with[0];
          if (wait > 0) {
            if (!sc.toldWait || now - sc.toldWait > 2e4) {
              sc.toldWait = now;
              whisper(sender, "\u23F3 Easy, sugar! You just filled 'em. Give it " + wait + " more seconds before the next load.");
            }
          } else if (t) {
            sc.lastCum = now;
            const inside = /\b(in|inside|into|deep|up)\s+(?:(?:her|his|their|its|[a-z]+'s)\s+)?(?:\w+\s+)?(pussy|cunt|vulva|womb|vagina|slit|ass|asshole|butthole|butt|anus|mouth|throat|gullet)\b/i.test(text);
            const pm = !inside && text.match(PAINT_RX);
            if (pm) paint(sender, t, pm[1], (msg) => whisper(sender, msg));
            else cumInto(
              sender,
              t,
              holeFromRP(text, sender, t) || holesFrom(sc.hole) || ["vulva"],
              (msg) => whisper(sender, msg),
              true,
              { rough: CFG.RP_ROUGH.test(text), gentle: !CFG.RP_ROUGH.test(text) && CFG.RP_GENTLE.test(text) }
            );
          }
        }
      }
      if (isStaff(sender)) {
        const isPraise = CFG.RP_PRAISE.test(text), isDeg = !isPraise && CFG.RP_DEGRADE.test(text);
        if (isPraise || isDeg) {
          const key = isPraise ? "praiseMe" : "degradeMe";
          const here = (W.ChatRoomCharacter || []).map((c) => c.MemberNumber).filter((m) => m !== sender && m !== CFG.BOT_MEMBER && rec(m) && rec(m)[key]);
          const t = namedIn(text, here);
          if (t) praiseOrDegrade(sender, t, isPraise, text);
        }
      }
      if (type === "Emote" && CFG.RP_NURSE_WORDS.test(text) && CFG.RP_NURSE_PARTS.test(text)) {
        const here = (W.ChatRoomCharacter || []).map((c) => c.MemberNumber).filter((m) => m !== sender && m !== CFG.BOT_MEMBER);
        const other = namedIn(text, here);
        const low = text.toLowerCase(), on = (n) => n && namesOf(n).some((x) => low.includes(x + "'s") || low.includes(x.split(/\s+/)[0] + "'s"));
        let milker = on(other) ? other : rec(sender) && makesMilk(sender) ? sender : other;
        if (!milker || !rec(milker) || !makesMilk(milker)) return;
        nurse(milker, milker === sender ? other : sender);
      }
    }
    function nurse(milker, drinker) {
      if (missing(milker, drinker)) return false;
      const p = prodOf(milker), now = Date.now();
      if (now - (p.lastNursed || 0) < CFG.NURSE_COOLDOWN_S * 1e3 || p.milk < 1) return false;
      if (milkDenied(milker)) {
        if (now - (p.capSaid || 0) > 12e4) {
          p.capSaid = now;
          emote("\u{1F6AB} " + (drinker ? plainName(drinker) + " suckles and suckles, but" : "") + " not a drop comes out of " + plainName(milker) + ". Those teats are capped, and full to achin'.");
        }
        return false;
      }
      p.lastNursed = now;
      const steps = 5, each = CFG.NURSE_ML / steps;
      let got = 0, n = 0;
      const tick = () => {
        got += drainMilk(milker, each, true);
        if (++n < steps && prodOf(milker).milk >= 1) return later(tick, CFG.NURSE_SECONDS * 1e3 / steps);
        saveLedger();
        audit(drinker || milker, "NURSE", milker + " " + Math.round(got));
        const taste = { "A+": "thick, sweet cream that coats the tongue", "A": "rich, sweet and creamy", "B": "warm and creamy", "C": "a little thin, but sweet enough", "D": "thin and watery, poor thing" }[milkGrade(milker)] || "warm and sweet";
        if (got >= 1) emote("\u{1F37C} " + (drinker ? plainName(drinker) + " drinks " + ml(got) + " warm milk right from " + plainName(milker) + ". It's " + taste + "." : plainName(milker) + " lets down " + ml(got) + " of warm milk, " + taste + "."));
        if (got >= 1) {
          const pm = prodOf(milker), wk = weekKey();
          if (!pm.nursed || pm.nursed.week !== wk) pm.nursed = { week: wk, n: 0 };
          pm.nursed.n++;
        }
        if (got >= 1 && drinker) addonsEmit("nurse", milker, drinker, got, milkGrade(milker));
        if (got >= 1 && drinker && rec(drinker)) {
          const pd = prodOf(drinker), dk = dayKey();
          if (!pd.drank || pd.drank.day !== dk) pd.drank = { day: dk, ml: 0, said: false };
          pd.drank.ml += got;
          if (pd.drank.ml >= CFG.MILK_DRUNK_ML && !pd.drank.said) {
            pd.drank.said = true;
            emote("\u{1F634} " + plainName(drinker) + " is plumb milk-drunk, belly full of warm cream, eyes gone heavy and soft. They'd let anybody lead 'em anywhere right now.");
          }
        }
      };
      tick();
      return true;
    }
    function onBodyActivity(act, focus, src, tgt) {
      if (!src || !tgt || src === tgt) return;
      let stud = null, bred = null, hole = null;
      if (/^penetrate(slow|fast)$/i.test(act) && ["ItemVulva", "ItemButt", "ItemMouth"].includes(focus)) {
        stud = src;
        bred = tgt;
        hole = { ItemVulva: "vulva", ItemButt: "butt", ItemMouth: "mouth" }[focus];
      } else if (/^fuckwith(pussy|ass)$/i.test(act) && focus === "ItemPenis") {
        stud = tgt;
        bred = src;
        hole = /pussy/i.test(act) ? "vulva" : "butt";
      } else if (/^(caress|rub|massage|kiss|gaggedkiss|lick|pet|pat|nuzzle|cuddle|grope|tickle|scratch|hug|press|rest)/i.test(act) && ["ItemTorso", "ItemTorso2", "ItemPelvis"].includes(focus)) {
        bellyRub(src, tgt);
        return;
      } else if (/^(suck|suckle|nibble|nurse|drink)/i.test(act) && (focus === "ItemNipples" || focus === "ItemBreast")) {
        if (rec(tgt) && makesMilk(tgt)) nurse(tgt, src);
        return;
      } else return;
      if (!rec(stud) || !makesSemen(stud)) return;
      const rb = rec(bred);
      if (!rb || !rb.breedable || limitBlocks(bred)) return;
      if (hole === "vulva" && !hasVulva(bred)) return;
      if (bred === src) okBreed(stud, bred);
      else if (!breedConsent(stud, bred)) {
        askBreed(stud, bred, hole);
        return;
      }
      seePenis(stud);
      const sc = state.scenes.get(stud), now = Date.now();
      if (sc && sc.hole === hole && sc.with.includes(bred)) {
        sc.lastSeen = now;
        return;
      }
      if (sc) {
        sc.with = [bred].concat(sc.with.filter((x) => x !== bred));
        sc.hole = hole;
        sc.lastSeen = now;
      } else {
        state.scenes.set(stud, { with: [bred], hole, at: now, by: stud, lastCum: 0, lastSeen: now, fromActivity: true });
      }
      const where = hole === "mouth" ? "throat" : hole;
      emote("\u{1F402} " + plainName(stud) + " is in " + plainName(bred) + "'s " + where + " now. The farm girl marks it in the stud book.");
      state.tipped = state.tipped || /* @__PURE__ */ new Set();
      if (!state.tipped.has(stud)) {
        state.tipped.add(stud);
        whisper(stud, "\u{1F402} Tip, sugar: say cum (or orgasm) in your chat or emotes and I'll fill them up. ?breed stop ends the scene.");
      }
    }
    const SHOT_LINES = {
      "udder+": [
        "%t's breasts swell and strain, heavier with every heartbeat, till they settle at %s.",
        "%t gasps as their chest fills out, nipples stiffening while those tits plump up to %s."
      ],
      "udder-": [
        "%t's breasts tingle and draw in, perkier and lighter, down to %s.",
        "A cool ache, and %t's chest shrinks back to %s."
      ],
      "testes+": [
        "%t's balls throb and drop heavier, fat and churnin' (%s now). Somebody's gonna make bigger loads.",
        "%t groans as their sack tightens, then swells, heavy and churnin': %s."
      ],
      "testes-": [
        "%t's balls draw up tight and shrink down to %s.",
        "A cold tingle, and %t's sack shrinks down to %s."
      ],
      "penis+": [
        "%t's cock thickens and lengthens, throbbin' with every pulse, till it hangs at %s.",
        "%t whimpers as their shaft swells, vein by vein, out to %s."
      ],
      "penis-": [
        "%t's cock tingles and shrinks, smaller and softer, down to %s.",
        "With a little shiver %t's shaft draws in to %s."
      ],
      "knot+": ["%t's knot swells fatter at the base, heavy and aching to lock into somebody: %s now."],
      "knot-": ["%t's knot goes soft and shrinks down to %s."],
      "vulva+": [
        "%t's pussy goes hot and slick as it loosens and opens up: %s now.",
        "%t squirms as their pussy relaxes and spreads, wetter and %s."
      ],
      "vulva-": ["%t's pussy clenches and tightens right up: %s again."],
      "butt+": [
        "%t's ass loosens and opens, achin' to be filled: %s now.",
        "%t's hole relaxes and gapes a little wider, %s and ready."
      ],
      "butt-": ["%t's ass clenches up nice and tight: %s again."],
      "throat+": ["%t's throat relaxes and the gag reflex just melts away: %s now. Open wide, sugar."],
      "throat-": ["%t's throat tightens back up, gaggy as ever: %s."],
      lactation: ["%t's nipples tingle and bead with milk, breasts goin' heavy and achy to be milked."],
      virility: ["%t's balls churn and swell with fresh seed. Somebody's gonna be a fountain for a day."],
      fertility: ["A warm, needy flush spreads through %t's belly. That womb is ripe and waitin'."],
      contraceptive: ["%t gets a cool little shiver. Nothin's takin' root in there for a couple of days."],
      capacity: ["%t's belly goes warm and stretchy, ready to hold even more."],
      reducing: ["%t's belly draws in tight, and anything extra comes spillin' out."],
      suppressant: ["%t's heat breaks like a fever. They sag, flushed and finally calm."],
      "knot+new": ["A fat knot swells up at the base of %t's cock, throbbin' and ready to tie somebody down."],
      "knot-new": ["%t's knot shrinks away to nothin'. No more tyin' anybody down."],
      "type:canine": ["%t's cock reshapes, tapered and red with a thick canine knot at the base."],
      "type:equine": ["%t's cock swells long and heavy, the head flaring wide like a stallion's."],
      "type:feline": ["Little barbs prickle up along %t's cock. That's gonna be felt on the way out."],
      "type:draconic": ["Thick ridges rise along %t's cock, hard and scaled and wicked."],
      "type:double": ["%t's cock splits into two, both throbbin' and ready to fill two holes at once."],
      "type:human": ["%t's cock settles back into a plain human shape."]
    };
    function shotLine(key, t, part) {
      const k = key === "knot+" ? "knot+new" : key === "knot-" ? "knot-new" : key;
      const L0 = SHOT_LINES[k];
      if (!L0) return "";
      const sz = part ? part === "udder" ? CFG.SIZES.udder.cups[udderLevel(t) - 1] + " cup, " + CFG.SIZES.udder.names[udderLevel(t) - 1] : CFG.SIZES[part].inches ? sizeOf(t, part) + " inches" : sizeWord(part, sizeOf(t, part)) + " " + sizeOf(t, part) + "/" + CFG.SIZES[part].max : "";
      return L0[Math.floor(Math.random() * L0.length)].replace(/%t/g, plainName(t)).replace(/%s/g, sz);
    }
    function onActivity(data) {
      let meta = null;
      try {
        if (typeof W.ChatRoomMessageRunExtractors === "function")
          meta = W.ChatRoomMessageRunExtractors(data, charFor(data.Sender) || W.Player).metadata;
      } catch (e) {
      }
      const dict = Array.isArray(data.Dictionary) ? data.Dictionary : [];
      const pick = (k) => {
        const e = dict.find((d) => d && d[k] !== void 0);
        return e ? e[k] : void 0;
      };
      const act = pick("ActivityName") || meta && meta.ActivityName || (String(data.Content || "").match(/-([A-Za-z]+)$/) || [])[1];
      if (act !== "Inject") {
        let src = pick("SourceCharacter"), tgt = pick("TargetCharacter");
        if (typeof src !== "number") src = data.Sender;
        if (typeof tgt !== "number") {
          const old = dict.find((d) => d && d.Tag === "TargetCharacter");
          tgt = old && old.MemberNumber;
        }
        const focus = pick("FocusGroupName") || String(data.Content || "").split("-")[1];
        try {
          onBodyActivity(String(act || ""), focus, src, tgt);
        } catch (e) {
          warn("body activity:", e);
        }
        return;
      }
      let target = pick("TargetCharacter");
      if (typeof target !== "number") {
        const old = dict.find((d) => d && d.Tag === "TargetCharacter");
        target = old && old.MemberNumber || meta && meta.TargetMemberNumber || data.Sender;
      }
      const giver = charFor(data.Sender);
      const tool = giver && (giver.Appearance || []).find((it) => it && it.Asset && it.Asset.Group && it.Asset.Group.Name === "ItemHandheld");
      const text = craftText(tool);
      const tags = tagsIn(text), sizeTags = sizeTagsIn(text), ptags = penisTagsIn(text);
      L.shotLog = (L.shotLog || []).concat({
        t: Date.now(),
        by: data.Sender,
        to: target,
        item: tool ? tool.Craft && tool.Craft.Name || tool.Asset.Name : "(nothing in hand)",
        tags: Array.from(tags).concat(sizeTags.map(([k, d]) => k + (d > 0 ? " up" : " down")))
      }).slice(-15);
      dbg("INJECT", data.Sender, "\u2192", target, "item:", text || "(no crafted item)", "tags:", Array.from(tags).join(",") || "none");
      if (!tags.size && !sizeTags.length && !ptags.type && !ptags.knot) {
        saveLedger();
        return;
      }
      const r = rec(target);
      if (!r) {
        saveLedger();
        tell(data.Sender, "\u{1F489} That shot didn't take with me, hon: " + plainName(target) + " isn't on the farm books yet.");
        return;
      }
      const p = prodOf(target), now = Date.now(), H = 36e5, done = [];
      const fx0 = [];
      if (tags.has("lactation")) {
        p.boosts.milk = now + 24 * H;
        done.push("milk doubled for a day");
        fx0.push("lactation");
      }
      if (tags.has("virility")) {
        p.boosts.semen = now + 24 * H;
        done.push("semen doubled for a day");
        fx0.push("virility");
      }
      if (tags.has("fertility")) {
        p.boosts.fert = now + 24 * H;
        done.push("fertility doubled for a day");
        fx0.push("fertility");
      }
      if (tags.has("contraceptive")) {
        p.boosts.contra = now + 48 * H;
        done.push("no catching for two days");
        fx0.push("contraceptive");
      }
      if (tags.has("capacity")) fx0.push("capacity");
      if (tags.has("reducing")) fx0.push("reducing");
      if (tags.has("capacity")) {
        const b = p.capBonus;
        p.capBonus = Math.min(CFG.PROD.MAX_CAPACITY - CFG.PROD.BASE_CAPACITY, b + CFG.PROD.INJECT_CAPACITY);
        done.push("capacity now " + ml(capacity(target)));
      }
      if (tags.has("reducing")) {
        p.capBonus = Math.max(0, p.capBonus - CFG.PROD.REDUCE_CAPACITY);
        const over = heldTotal(p) - capacity(target);
        if (over > 0) for (const h of HOLES) {
          const cut = Math.min(p.held[h], over * p.held[h] / heldTotal(p));
          p.held[h] -= cut;
        }
        done.push("capacity down to " + ml(capacity(target)));
      }
      if ((ptags.type || ptags.knot) && !makesSemen(target)) {
        done.push("no cock for that shot to change");
        ptags.type = null;
        ptags.knot = 0;
      }
      if (ptags.type) {
        setPenisType(target, ptags.type);
        done.push("cock's turnin' " + CFG.PENIS_TYPES[ptags.type].label);
        fx0.push("type:" + ptags.type);
      }
      if (ptags.knot > 0) {
        p.knot = true;
        p.knotShot = true;
        done.push("a fat knot's swellin' in at the base");
        fx0.push("knot+");
      }
      if (ptags.knot < 0) {
        p.knot = false;
        p.knotShot = false;
        untie(target, true);
        done.push("knot's gone down for good");
        fx0.push("knot-");
      }
      const fx = [];
      for (const [part, d] of sizeTags) {
        if (part === "knot" && !knotted(target)) {
          done.push("no knot to grow yet (that takes a knotting shot first)");
          continue;
        }
        if (!hasPart(target, part)) {
          done.push("no " + (part === "testes" ? "balls" : part) + " for the " + (d > 0 ? "growth" : "shrinkin'") + " to work on");
          continue;
        }
        const S = CFG.SIZES[part], before = sizeOf(target, part);
        setSize(target, part, before + d * (S.step || 1), true);
        const word = S.label.toLowerCase();
        done.push(sizeOf(target, part) === before ? word + " can't go any " + (d > 0 ? "bigger" : "smaller") : word + " " + (d > 0 ? "up" : "down") + " to " + sizeName(target, part));
        if (sizeOf(target, part) !== before) fx.push(shotLine(part + (d > 0 ? "+" : "-"), target, part));
      }
      if (tags.has("suppressant") && inHeat(p)) {
        p.heat = null;
        done.push("heat broken");
        fx0.push("suppressant");
      }
      if (tags.has("heat")) {
        if (limitBlocks(target, "heat")) done.push("no heat, though, 'cause their limits rule it out");
        else {
          startHeat(target, data.Sender);
          done.push("heat");
        }
      }
      saveLedger();
      audit(data.Sender, "INJECT", target + " " + Array.from(tags).concat(sizeTags.map(([k, d]) => k + (d > 0 ? "+" : "-"))).join(" "));
      const lines = fx0.map((k) => shotLine(k, target)).concat(fx).filter(Boolean);
      if (lines.length && onMap(target)) {
        emote("\u{1F489} " + (target === data.Sender ? plainName(target) + " sinks the needle into their own skin and pushes the plunger home." : plainName(data.Sender) + " slides the needle into " + plainName(target) + " and pushes the plunger home.") + " " + lines.join(" "));
        if (done.length > lines.length) tell(target, "\u{1F489} Your shot: " + done.join(", ") + ".");
      } else {
        tell(target, "\u{1F489} " + plainName(data.Sender) + "'s shot is kickin' in, hon: " + done.join(", ") + ".");
        if (target !== data.Sender) tell(data.Sender, "\u{1F489} Your shot took on " + plainName(target) + ": " + done.join(", ") + ".");
      }
    }
    function isStretcher(it) {
      const flat = squash(it && it.Craft ? craftText(it) : "");
      return !!flat && CFG.STRETCHER_WORDS.some((w) => flat.includes(squash(w)));
    }
    function bodyParts(mn) {
      const out = [];
      if (makesMilk(mn) || hasVulva(mn)) out.push("udder");
      if (makesSemen(mn)) out.push("penis", "testes");
      if (makesSemen(mn) && knotted(mn)) out.push("knot");
      if (hasVulva(mn)) out.push("vulva");
      out.push("butt", "throat");
      return out;
    }
    function hasPart(mn, part) {
      return bodyParts(mn).includes(part);
    }
    function noPartWhy(mn, part) {
      if (part === "penis" || part === "testes") return "there's no cock on that one to measure, hon. Wear one, or ?futa on";
      if (part === "knot") return 'no knot on that cock yet, hon! A "knotting" shot gives one, or ?penis canine comes knotted';
      if (part === "vulva") return "that one hasn't got a vulva, hon (futa: ?futa on)";
      if (part === "udder") return "that one hasn't got an udder, hon. ?milkable on gives one";
      return "that part's not there, hon";
    }
    function statsText(mn) {
      const r = rec(mn), p = prodOf(mn), now = Date.now();
      if (!r) return "That one's not on the books yet, sugar.";
      const cap = capacity(mn), held = heldTotal(p), parts = bodyParts(mn);
      const ago = (t2) => {
        if (!t2) return "never";
        const m = Math.round((now - t2) / 6e4);
        return m < 60 ? m + "m ago" : Math.floor(m / 60) + "h " + m % 60 + "m ago";
      };
      const hrsLeft = (t2) => Math.ceil((t2 - now) / 36e5) + "h";
      const out = ["\u{1F95B} " + (r.name || plainName(mn)).toUpperCase() + "'S STATS \u{1F95B}"];
      const sec = (title, lines) => {
        lines = lines.filter(Boolean);
        if (lines.length) out.push("", title, ...lines.map((l) => "  " + l));
      };
      const sz = (k) => CFG.SIZES[k].label + ": " + sizeName(mn, k);
      sec("\u{1F4CF} BODY", [
        parts.includes("udder") && sz("udder"),
        parts.includes("penis") && "Cock: " + sizeName(mn, "penis") + ", " + penisLabel(mn) + (parts.includes("knot") ? " \xB7 Knot: " + sizeWord("knot", sizeOf(mn, "knot")) : ""),
        parts.includes("testes") && sz("testes"),
        ["vulva", "butt", "throat"].filter((k) => parts.includes(k)).map((k) => CFG.SIZES[k].label + ": " + sizeWord(k, sizeOf(mn, k))).join(" \xB7 "),
        bellyWord(mn) && "\u{1F930} Belly: " + bellyWord(mn)
      ]);
      if (makesMilk(mn)) sec("\u{1F37C} MILK", [
        (p.milk < 1 ? "Dry \xB7 " : "") + ml(p.milk) + " of " + ml(milkCap(mn)) + " \xB7 grade " + milkGrade(mn) + (p.milk >= milkCap(mn) - 1 ? " \xB7 full and achin'" : ""),
        "Last milked " + ago(p.lastMilkAt),
        p.stall && p.stall.until && "In the milkin' stall: " + Math.max(0, Math.ceil((p.stall.until - Date.now()) / 6e4)) + " min till you're down to a quarter"
      ]);
      if (makesSemen(mn)) sec("\u{1F4A6} SEMEN", [
        ml(p.semen) + " of " + ml(semenCap(mn)) + " \xB7 last collected " + ago(p.lastCollectAt),
        p.pentUp && "\u{1F624} Pent up: next load's a big one",
        p.deniedUntil > now && "\u{1F6AB} Denied: no fillin' anybody for " + hrsLeft(p.deniedUntil),
        p.tieUntil > now && "\u{1F512} Tied to " + plainName(p.tiedTo) + " for " + Math.ceil((p.tieUntil - now) / 6e4) + " more minutes"
      ]);
      const holeName = { vulva: "Vulva", butt: "Butt", mouth: "Stomach" };
      const holding = HOLES.filter((h) => h !== "vulva" || hasVulva(mn) || p.held.vulva > 0).map((h) => holeName[h] + " " + ml(p.held[h] || 0)).join(" \xB7 ");
      sec("\u{1FAD9} HOLDING \xB7 " + Math.round(100 * held / cap) + "% full", [
        holding,
        "Total " + ml(held) + " of " + ml(cap),
        p.pin && "\u{1F388} " + (sizePinned(mn) ? "Too big to move" : "Too full to move")
      ]);
      sec("\u{1F402} BREEDING", [
        "Breedable " + (r.breedable ? "yes" : "no") + " \xB7 Fertile " + (r.fertile ? "yes" : "no") + (r.futa ? " \xB7 Futa" : "") + (r.species ? " \xB7 " + r.species : ""),
        inHeat(p) && "\u{1F525} In heat \xB7 " + hrsLeft(p.heat.until) + " left",
        p.preg && "\u{1F37C} Bred by " + p.preg.sires.map(plainName).join(" & ") + " \xB7 due " + new Date(p.preg.due).toLocaleDateString() + " (" + Math.ceil((p.preg.due - now) / 864e5) + " day(s))",
        r.rights && r.rights.until > now && "\u{1F50F} Breedin' rights: " + plainName(r.rights.stud) + ((r.rights.allow || []).length ? " (also " + r.rights.allow.map(plainName).join(", ") + ")" : "") + " till " + new Date(r.rights.until).toLocaleDateString(),
        p.offspring.litters && "\u{1F476} Litters: " + p.offspring.litters + " \xB7 " + p.offspring.male + " male, " + p.offspring.female + " female, " + p.offspring.futa + " futa",
        p.labour && "\u{1F37C} In labour right now!",
        p.eggs && "\u{1F95A} Carryin' a clutch of " + p.eggs.n + " from " + plainName(p.eggs.by) + " \xB7 lays in " + Math.max(0, Math.ceil((p.eggs.layAt - now) / 36e5)) + "h",
        p.offspring.eggs && "\u{1F95A} Eggs laid: " + p.offspring.eggs,
        r.freeuse ? "\u{1F513} Free use: anybody may breed you" : "\u{1F510} Studs ask first (?freeuse on to skip that)"
      ]);
      sec("\u{1F351} TODAY", [
        tallyToday(mn) && "\u270F\uFE0F Used " + tallyToday(mn) + " time" + (tallyToday(mn) === 1 ? "" : "s") + " today" + (r.tally ? " (on the board)" : ""),
        paintedText(mn) && "\u{1F4A6} Cum-covered: " + paintedText(mn) + " (?wash cleans up)",
        scentOf(mn) && "\u{1F443} Smellin' of " + plainName(scentOf(mn)) + "'s seed",
        quotaOf(mn) && "\u{1F95B} Quota: " + ml(milkedOn(mn, dayKey())) + " of " + ml(quotaOf(mn)) + " \xB7 streak " + (r.quotaStreak || 0) + (r.naughtyMarks ? " \xB7 naughty marks " + r.naughtyMarks : ""),
        (r.praised || r.degraded) && "\u{1F497} Praised " + (r.praised || 0) + " \xB7 \u{1F940} Degraded " + (r.degraded || 0),
        p.edges && "\u{1F608} Edged " + p.edges + " time" + (p.edges === 1 ? "" : "s") + " \xB7 next load +" + Math.round(100 * CFG.EDGE_X * Math.min(p.edges, CFG.EDGE_MAX)) + "%",
        milkDenied(mn) && "\u{1F6AB} Teats capped: no milkin' for " + Math.ceil((p.milkDeniedUntil - now) / 36e5) + "h"
      ]);
      if (titleNames(mn).length) sec("\u{1F396}\uFE0F TITLES", [titleNames(mn).join(" \xB7 ")]);
      const b = [];
      for (const [k, label] of [["milk", "milk"], ["semen", "semen"], ["fert", "fertility"], ["contra", "contraceptive"]])
        if (boosted(p, k)) b.push(label);
      const wt = Array.from(wornTags(mn));
      sec("\u2728 RIGHT NOW", [b.length && "\u{1F489} Boosted: " + b.join(", "), wt.length && "\u{1F3F7}\uFE0F Wearing: " + wt.join(", ")]);
      const t = p.totals;
      sec("\u{1F4CA} LIFETIME", [
        [
          makesMilk(mn) || t.milked ? "Milked " + ml(t.milked) : "",
          makesSemen(mn) || t.collected ? "Collected " + ml(t.collected) : "",
          "Took " + ml(t.received),
          makesSemen(mn) || t.given ? "Gave " + ml(t.given) : ""
        ].filter(Boolean).join(" \xB7 "),
        t.sired && "Sired " + t.sired + " litter" + (t.sired === 1 ? "" : "s"),
        t.covers && "\u{1F402} Stud record: " + (t.conceived || 0) + " took from " + t.covers + " covers (" + Math.round(100 * (t.conceived || 0) / t.covers) + "%)"
      ]);
      return out.join("\n");
    }
    function hourNow() {
      if (W.__FARMHAND_TEST__) return W.__hour != null ? W.__hour : 14;
      return (/* @__PURE__ */ new Date()).getHours();
    }
    function presentStock() {
      return (W.ChatRoomCharacter || []).map((c) => c.MemberNumber).filter((m) => m !== CFG.BOT_MEMBER && hasRole(m, ROLE.LIVESTOCK) && !(isStaff(m) && onDuty(m)));
    }
    function inCurfew() {
      if (!L.life.curfewOn) return false;
      const h = hourNow(), { start, end } = CFG.CURFEW;
      return start > end ? h >= start || h < end : h >= start && h < end;
    }
    function curfewBound(mn) {
      return inCurfew() && hasRole(mn, ROLE.LIVESTOCK) && !(isStaff(mn) && onDuty(mn)) && !(rec(mn) || {}).begged;
    }
    function weatherToday() {
      const d = dayKey();
      if (!L.life.weather || L.life.weather.day !== d) {
        const w = CFG.WEATHER[Math.floor(Math.random() * CFG.WEATHER.length)];
        L.life.weather = { day: d, key: w.key, line: w.line, indoors: !!w.indoors };
        for (const r of Object.values(L.people)) delete r.begged;
        saveLedger();
        if (inRoom()) announce("\u{1F324}\uFE0F " + w.line);
      }
      return L.life.weather;
    }
    function lifeTick() {
      const h = hourNow(), d = dayKey();
      weatherToday();
      if (L.life.feedingOn && CFG.FEED_HOURS.includes(h) && L.life.lastFeed !== d + "@" + h) {
        L.life.lastFeed = d + "@" + h;
        saveLedger();
        const w = weatherToday();
        const pt = w.indoors ? firstSpot("barn", "trough") : firstSpot("trough");
        const stock = presentStock().filter((m) => !stockedNow(m));
        for (const m of stock) sound(m, "bell");
        announce("\u{1F514} Soo-eee! Feedin' time" + (w.indoors ? ", in the barn on account of the weather" : " at the trough") + ". Come and get it, sweeties!");
        if (pt) for (const m of stock) teleport(m, pt, false);
      }
      const cur = inCurfew();
      if (cur !== !!L.life.curfewActive) {
        L.life.curfewActive = cur;
        saveLedger();
        if (cur) {
          announce("\u{1F319} Curfew, y'all! Stock to the barn and snuggle in" + (CFG.CURFEW_TAKES_BRONZE ? ", and I'll hold onto those bronze keys till mornin'" : "") + ". Sweet dreams!");
          const pt = firstSpot("barn");
          for (const m of presentStock()) if (!stockedNow(m)) {
            if (pt) teleport(m, pt, false);
            syncKeys(m, true);
          }
        } else {
          announce("\u{1F305} Rise and shine, sweeties! Curfew's lifted.");
          for (const r of Object.values(L.people)) delete r.begged;
          syncAllPresent(true);
        }
      }
      for (const r of Object.values(L.people)) {
        const s = r.stocked;
        if (!s) continue;
        if (Date.now() >= s.until) {
          r.stocked = null;
          saveLedger();
          whisper(r.mn, "\u{1F513} Time's up, " + plainName(r.mn) + "! Out of the stocks you come, sugar.");
          continue;
        }
        const C = charFor(r.mn), pos = C && C.MapData && C.MapData.Pos, pt = spotFor("stocks");
        if (pt && pos && (Math.abs(pos.X - pt.X) > 1 || Math.abs(pos.Y - pt.Y) > 1)) {
          teleport(r.mn, pt, false, true);
          whisper(r.mn, "Uh-uh, back in the stocks you go, hon! " + Math.ceil((s.until - Date.now()) / 6e4) + " minutes left.");
        }
      }
      for (const r of Object.values(L.people)) {
        if (r.tierUntil && Date.now() >= r.tierUntil) {
          r.tier = r.tierPrev || "";
          r.tierUntil = null;
          r.tierPrev = null;
          saveLedger();
          beep(r.mn, "\u{1F380} Your fair week's all over, sweetie. Back to " + tierName(tierOf(r.mn)) + ", but you'll always be blue-ribbon in my book!");
        }
      }
    }
    function stockedNow(mn) {
      const r = rec(mn);
      return !!(r && r.stocked && r.stocked.until > Date.now());
    }
    function putInStocks(mn, minutes, by) {
      const r = rec(mn);
      r.stocked = { until: Date.now() + minutes * 6e4, by };
      saveLedger();
      const pt = spotFor("stocks");
      if (pt) teleport(mn, pt, true);
      whisper(mn, "\u26D3\uFE0F Into the stocks with you for " + minutes + " minutes, sugar." + (pt ? "" : " (Nobody's set a stocks spot yet, so just stay put right where you are.)"));
    }
    function leashTick() {
      for (const [follower, lead2] of state.leashes) {
        const F = charFor(follower), Lc = charFor(lead2);
        if (!F || !Lc) {
          state.leashes.delete(follower);
          continue;
        }
        const fp = F.MapData && F.MapData.Pos, lp = Lc.MapData && Lc.MapData.Pos;
        if (!fp || !lp) continue;
        const was = state.leashPos && state.leashPos.get(follower);
        state.leashPos = state.leashPos || /* @__PURE__ */ new Map();
        state.leashPos.set(follower, { f: { X: fp.X, Y: fp.Y }, l: { X: lp.X, Y: lp.Y } });
        if (Math.abs(fp.X - lp.X) <= 1 && Math.abs(fp.Y - lp.Y) <= 1) continue;
        const fpr = prodOf(follower);
        if (was && fpr && fpr.tieUntil > Date.now() && fpr.tiedTo === lead2 && was.l.X === lp.X && was.l.Y === lp.Y && Date.now() - (fpr.tugAt || 0) > 6e4) {
          fpr.tugAt = Date.now();
          emote("\u{1F512} " + plainName(follower) + " tries to pull away, but " + plainName(lead2) + "'s knot holds fast and yanks 'em right back with a wet tug. " + plainName(lead2) + " gasps at the squeeze. Not goin' anywhere yet, sugar.");
        }
        for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
          const x = lp.X + dx, y = lp.Y + dy;
          try {
            if (typeof W.ChatRoomMapViewIsWall === "function" && W.ChatRoomMapViewIsWall(x, y)) continue;
          } catch (e) {
          }
          teleport(follower, { X: x, Y: y }, false);
          break;
        }
      }
    }
    function dropLeashes(mn) {
      let n = 0;
      for (const [f, l] of state.leashes) if (f === mn || l === mn) {
        state.leashes.delete(f);
        n++;
      }
      return n;
    }
    function runTour(mn) {
      const stops = L.life.tour || [];
      if (!stops.length || !botIsAdmin()) return false;
      state.tours.set(mn, 0);
      const step = () => {
        const i = state.tours.get(mn);
        if (i === void 0 || !charFor(mn)) {
          state.tours.delete(mn);
          return;
        }
        if (i >= stops.length) {
          state.tours.delete(mn);
          whisper(mn, "And that's the farm, " + plainName(mn) + "! Hope you loved it. Say ?apply if you wanna stay with us, sweetie.");
          return;
        }
        teleport(mn, stops[i], false);
        whisper(mn, "\u{1F4CD} " + (i + 1) + "/" + stops.length + " \u2014 " + fill(stops[i].text, mn));
        state.tours.set(mn, i + 1);
        later(step, CFG.TOUR_STOP_S * 1e3);
      };
      step();
      return true;
    }
    const DEFAULT_TERMS = {
      fun: "A light little contract with B&B Farm, %name%. You'll moo and wave, and you can end it whenever you like.",
      deep: "You're properly kept by B&B Farm for the length of this contract, %name%. Only the farm can end it early, and a safeword always reaches staff.",
      nhl: "No human left, %name%. You belong to B&B Farm as an animal for the length of this contract, and only the farm can end it early. A safeword always reaches staff, and they'll come check on you."
    };
    function contractsLedger() {
      L.contractTemplates = L.contractTemplates || {};
      L.contracts = L.contracts || [];
    }
    function farmInfo() {
      const staff = Object.keys(L.people).map(Number).filter((m) => isStaff(m));
      return { bot: CFG.BOT_MEMBER, staff, rooms: CFG.CONTRACT_ROOMS && CFG.CONTRACT_ROOMS.length ? CFG.CONTRACT_ROOMS : [CFG.ROOM_NAME] };
    }
    function contractTemplate(name) {
      contractsLedger();
      const n = String(name || "").toLowerCase();
      if (L.contractTemplates[n]) return L.contractTemplates[n];
      const d = depthFrom(n);
      if (d && d.key === n) return { title: "B&B Farm \xB7 " + d.label, terms: DEFAULT_TERMS[d.key], base: d.key, add: {}, remove: [] };
      return null;
    }
    function buildContract(tpl, mn, durKey) {
      const r = rec(mn) || {};
      const who = { name: shortName(mn), species: r.species || "" };
      const rules = tpl.base ? templateRules(tpl.base, who, Object.assign(farmInfo(), { nickname: CFG.CONTRACT_NICKNAME })) : {};
      for (const id of tpl.remove || []) delete rules[id];
      for (const [id, set] of Object.entries(tpl.add || {}))
        rules[id] = makeSpec(id, Object.assign({}, rules[id] ? rules[id].settings : {}, JSON.parse(JSON.stringify(set))));
      fillRules(rules, who);
      return makeContract({
        title: fillWho(tpl.title, who),
        terms: fillWho(fill(tpl.terms || "", mn), who),
        duration: durationFrom(durKey),
        depth: tpl.base,
        policy: tpl.policy,
        rules
      });
    }
    function settingValue(setting, raw) {
      const t = String(raw == null ? "" : raw).trim();
      switch (setting.type) {
        case "checkbox":
          if (/^(on|yes|true|1)$/i.test(t)) return { value: true };
          if (/^(off|no|false|0)$/i.test(t)) return { value: false };
          return { err: "say on or off" };
        case "option": {
          const o = setting.options.find((x) => x.toLowerCase() === t.toLowerCase());
          return o ? { value: o } : { err: "pick one of: " + setting.options.join(", ") };
        }
        case "text":
          return { value: t };
        case "stringList":
          return { value: t ? t.split("|").map((s) => s.trim()).filter(Boolean) : [] };
        case "members": {
          if (/^farm$/i.test(t)) {
            const f = farmInfo();
            return { value: [f.bot].concat(f.staff) };
          }
          if (/^staff$/i.test(t)) return { value: farmInfo().staff };
          const v = t.split(/[,\s]+/).filter(Boolean).map((x) => resolveTarget(x));
          return v.every(Number.isInteger) ? { value: v } : { err: "member numbers or names, separated by commas (or farm, or staff)" };
        }
      }
      return { err: "I don't know that kind of setting" };
    }
    function parsePairs(text) {
      const out = {};
      const rx = /(\w+)=(?:"([^"]*)"|(\S+))/g;
      let m;
      while (m = rx.exec(text)) out[m[1]] = m[2] !== void 0 ? m[2] : m[3];
      return out;
    }
    function describeContract(c) {
      const d = DURATIONS.find((x) => x.min === c.durationMin);
      const lines = ["\u{1F4DC} " + c.title + " \xB7 " + (d ? d.label : Math.round(c.durationMin / 60) + " h") + " \xB7 ends early: " + (c.policy === "either" ? "either side" : "only the farm")];
      if (c.terms) lines.push("\u201C" + c.terms + "\u201D");
      for (const [id, spec] of Object.entries(c.rules)) {
        const def = RULES.get(id);
        const set = Object.entries(spec.settings || {}).filter(([, v]) => !(Array.isArray(v) && !v.length) && v !== "").map(([k, v]) => k + "=" + (Array.isArray(v) ? v.join("|") : v)).join(" ");
        lines.push("  \u2022 " + (def ? def.name : id) + (set ? " \xB7 " + set : ""));
      }
      return lines.join("\n");
    }
    function offerContract(sender, tplName, t, durText) {
      contractsLedger();
      const tpl = contractTemplate(tplName);
      if (!tpl) return "There's no contract called '" + tplName + "', sugar. ?contract list shows them (fun, deep and nhl are always there).";
      const d = durationFrom(durText);
      if (!d) return "How long, hon? Say 1h, 12h, 1d, 1w, 2w, 1m or perm.";
      if (!charFor(t)) return plainName(t) + " has to be here in the room for a contract offer, sugar. BC+ only takes 'em in person.";
      const c = buildContract(tpl, t, d.key);
      const problems = checkContract(c);
      if (problems.length) return "That one wouldn't work in BC+, sugar, so I didn't send it:\n\u2022 " + problems.join("\n\u2022 ");
      const mine = L.contracts.filter((x) => x.mn === t && (x.status === "signed" || x.status === "offered"));
      if (mine.filter((x) => x.status === "signed").length >= LIMITS.MAX_ACTIVE) return plainName(t) + " already holds " + LIMITS.MAX_ACTIVE + " farm contracts, and BC+ won't take more.";
      enqueue(offerMsg(c, t, CFG.ROOM_NAME));
      const entry = {
        mn: t,
        by: sender,
        tpl: String(tplName).toLowerCase(),
        title: c.title,
        depth: tpl.base || "custom",
        durationMin: c.durationMin,
        policy: c.policy,
        rules: Object.keys(c.rules),
        status: "offered",
        at: Date.now()
      };
      const prepared = trackedContract(t, null, ["prepared"]);
      if (prepared) Object.assign(prepared, entry);
      else L.contracts.push(Object.assign({ key: Date.now().toString(36) }, entry));
      if (L.contracts.length > 300) L.contracts = L.contracts.slice(-300);
      saveLedger();
      audit(sender, "CONTRACT_OFFER", t + " " + c.title + " " + d.key);
      tell(t, "\u{1F4DC} " + plainName(sender) + ' offers you the farm contract "' + c.title + '" (' + d.label + "). Read it on your BC+ Contracts page, and only sign if you want it. Nothin' applies till you do.");
      return "";
    }
    function trackedContract(mn, title, statuses) {
      contractsLedger();
      for (let i = L.contracts.length - 1; i >= 0; i--) {
        const x = L.contracts[i];
        if (x.mn === mn && (!title || x.title === title) && (!statuses || statuses.includes(x.status))) return x;
      }
      return null;
    }
    function onBCPAction(data) {
      const d = Array.isArray(data.Dictionary) ? data.Dictionary.find((e) => e && typeof e.Text === "string") : null;
      if (!d) return false;
      const text = d.Text, mn = data.Sender;
      let m;
      if (m = text.match(/has signed your contract "(.+)"\./)) {
        const x = trackedContract(mn, m[1], ["offered"]);
        if (x) {
          x.status = "signed";
          x.signedAt = Date.now();
          x.until = x.durationMin ? Date.now() + x.durationMin * 6e4 : null;
          saveLedger();
          audit(mn, "CONTRACT_SIGNED", x.title);
        }
        notifyStaff("\u{1F4DC} " + plainName(mn) + ' signed the farm contract "' + m[1] + '".', true);
        const tpl = x && contractTemplate(x.tpl), dress = tpl ? tpl.outfit === void 0 ? "auto" : tpl.outfit : "";
        const slot = dress === "auto" ? outfitSlotFor(mn) : dress;
        if (slot) later(() => offerOutfit(mn, slot, "It goes with your new contract"), 3e3);
        later(() => enqueue(queryMsg(mn)), 2e3);
        return true;
      }
      if (m = text.match(/declined the contract "(.+)"\./)) {
        const x = trackedContract(mn, m[1], ["offered"]);
        if (x) {
          x.status = "declined";
          saveLedger();
        }
        return true;
      }
      if (m = text.match(/is no longer bound by the contract "(.+)"\./)) {
        const x = trackedContract(mn, m[1], ["signed", "releasing"]);
        if (x) {
          x.status = "ended";
          x.endedAt = Date.now();
          saveLedger();
        }
        return true;
      }
      return false;
    }
    function onBCPMessage(m) {
      if (m.message !== "ContractList" || !Array.isArray(m.contracts)) return;
      const mn = m.from, held = m.contracts;
      contractsLedger();
      for (const bc of held) {
        const x = trackedContract(mn, bc.title, ["offered", "signed", "releasing"]) || (L.contracts.push({
          key: Date.now().toString(36),
          mn,
          title: bc.title,
          depth: "unknown",
          durationMin: bc.durationMin,
          policy: bc.policy,
          rules: Object.keys(bc.rules || {}),
          status: "signed",
          at: bc.signedAt
        }), L.contracts[L.contracts.length - 1]);
        if (x.status === "offered") x.status = "signed";
        x.bcpId = bc.id;
        x.signedAt = bc.signedAt;
        x.until = bc.until;
      }
      for (const x of L.contracts) if (x.mn === mn && (x.status === "signed" || x.status === "releasing") && x.bcpId && !held.some((bc) => bc.id === x.bcpId)) {
        x.status = "ended";
        x.endedAt = Date.now();
      }
      saveLedger();
    }
    function releaseContract(sender, t, title) {
      const x = trackedContract(t, title || null, ["signed", "releasing"]);
      if (!x) return plainName(t) + " doesn't hold " + (title ? 'a farm contract called "' + title + '"' : "any farm contract") + " that I know of, hon. ?contract check " + plainName(t) + " asks their BC+.";
      if (!charFor(t)) return plainName(t) + " has to be here in the room, sugar. BC+ only listens in person.";
      if (!x.bcpId) {
        enqueue(queryMsg(t));
        return "I'm askin' their BC+ for that contract's number first. Try again in a few seconds, sugar.";
      }
      enqueue(releaseMsg(t, x.bcpId));
      x.status = "releasing";
      saveLedger();
      audit(sender, "CONTRACT_RELEASE", t + " " + x.title);
      return "";
    }
    function contractLine(x) {
      const left = x.until ? Math.max(0, Math.round((x.until - Date.now()) / 36e5)) + " h left" : x.status === "signed" ? "permanent" : "";
      return plainName(x.mn) + ' \xB7 "' + x.title + '" \xB7 ' + x.status + (left ? " \xB7 " + left : "");
    }
    const OUTFIT_MAX_CHARS = 6e4;
    function outfitsLedger() {
      L.outfits = L.outfits || {};
      L.outfitRules = Object.assign({ onApprove: true, onClockIn: true, changeBack: true, keys: "staff" }, L.outfitRules || {});
    }
    function genderOf(mn) {
      const r = rec(mn) || {};
      return r.gender || (r.futa ? "futa" : hasVulva(mn) ? "female" : "male");
    }
    function outfitSlotFor(mn) {
      outfitsLedger();
      const r = rec(mn) || {}, sp = String(r.species || "").toLowerCase(), g = genderOf(mn);
      return [sp + "|" + g, sp + "|*", "*|" + g, "stock"].find((k) => L.outfits[k]) || null;
    }
    function uniformSlotFor(mn) {
      outfitsLedger();
      const order = isProprietor(mn) ? ["proprietor", "herdmaster", "farmhand"] : hasRole(mn, ROLE.HERDMASTER) ? ["herdmaster", "farmhand"] : isMandated(mn) ? ["mandated", "farmhand"] : ["farmhand"];
      return order.map((x) => "uniform:" + x).find((k) => L.outfits[k]) || null;
    }
    function outfitKeysFor(mn) {
      outfitsLedger();
      const leader = herdLeaderOf(mn), owners = CFG.PROPRIETORS.slice();
      const staff = Object.keys(L.people).map(Number).filter((m) => isStaff(m));
      const k = L.outfitRules.keys === "owners" ? owners : L.outfitRules.keys === "leader" ? leader ? [leader] : owners : staff.concat(leader ? [leader] : []);
      return Array.from(new Set(k.concat([CFG.BOT_MEMBER]))).filter((m) => m !== mn).slice(0, 100);
    }
    function outfitSlotFrom(words) {
      const w = words.map((x) => String(x).toLowerCase()).filter(Boolean);
      if (!w.length) return null;
      if (w[0] === "stock" || w[0] === "default") return "stock";
      if (["farmhand", "mandated", "herdmaster", "proprietor"].includes(w[0])) return "uniform:" + w[0];
      if (w[0] === "special" && w[1]) return "special:" + w[1].replace(/[^a-z0-9_-]/g, "");
      if (w.length >= 2) {
        const sp = w[0] === "any" ? "*" : speciesFrom(w[0]), g = w[1] === "any" ? "*" : w[1];
        if (sp && (g === "*" || GENDERS.includes(g)) && !(sp === "*" && g === "*")) return sp + "|" + g;
      }
      if (/^[a-z][a-z0-9_-]{1,19}$/.test(w[0]) && !speciesFrom(w[0])) return "special:" + w[0];
      return null;
    }
    const slotLabel = (k) => k === "stock" ? "Any new stock" : k.startsWith("uniform:") ? k.slice(8) + " uniform" : k.startsWith("special:") ? k.slice(8) : k.split("|").map((x) => x === "*" ? "any" : x).join(" \xB7 ");
    function offerOutfit(mn, slot, why) {
      outfitsLedger();
      const o = slot && L.outfits[slot];
      if (!o) return "There's no outfit saved for that, sugar. ?outfit shows what's saved.";
      if (!hasCompanion(mn)) {
        tell(mn, "\u{1F457} The farm has your " + slotLabel(slot) + " ready" + (why ? " (" + why + ")" : "") + ". The Companion can put it on you in one tap; without it, staff can help you dress by hand.");
        return plainName(mn) + " isn't runnin' the Companion, so I can't hand 'em an outfit. I've told 'em it's ready, and they can dress by hand.";
      }
      enqueue(makeMsg("outfit", { slot, label: slotLabel(slot), data: o.data, keys: outfitKeysFor(mn), why: why || "", id: ++companionSeq }, mn));
      audit(CFG.BOT_MEMBER, "OUTFIT_OFFER", mn + " " + slot);
      return "";
    }
    function saveOutfit(mn, m) {
      if (!isProprietor(mn)) {
        toCompanion(mn, "Savin' farm outfits is for the proprietors, sugar.", "reply");
        return;
      }
      const slot = String(m.slot || ""), data = String(m.data || "");
      if (!/^(stock|uniform:[a-z]+|special:[a-z0-9_-]{2,20}|[a-z*][a-z0-9 _*-]{0,30}\|[a-z*]+)$/.test(slot)) {
        toCompanion(mn, "That's not a slot I know, sugar.", "reply");
        return;
      }
      if (!data || data.length > OUTFIT_MAX_CHARS) {
        toCompanion(mn, "That outfit came through empty or too big to keep, hon.", "reply");
        return;
      }
      outfitsLedger();
      L.outfits[slot] = { data, items: Math.max(0, m.items | 0), locks: Math.max(0, m.locks | 0), by: mn, at: Date.now() };
      saveLedger();
      audit(mn, "OUTFIT_SAVE", slot);
      toCompanion(mn, "\u{1F457} Saved " + slotLabel(slot) + ": " + (m.items | 0) + " pieces" + (m.locks | 0 ? ", " + (m.locks | 0) + " locked" : "") + ".", "reply");
      later(() => syncCompanions(true), 500);
    }
    function outfitAnswer(mn, m) {
      if (m.answer === "worn") {
        audit(mn, "OUTFIT_WORN", String(m.slot || ""));
        if (onMap(mn)) emote("\u{1F457} " + plainName(mn) + " changes into " + (String(m.slot || "").startsWith("uniform:") ? "their farm uniform" : "their farm outfit") + (m.locks ? ", and the padlocks click shut" : "") + ".");
      } else if (m.answer === "declined") audit(mn, "OUTFIT_DECLINED", String(m.slot || ""));
      else if (m.answer === "back") audit(mn, "OUTFIT_BACK", "");
    }
    function zonesLedger() {
      L.zones = L.zones || {};
    }
    function inZone(z, p) {
      if (!z || !z.a || !z.b || !p) return false;
      return p.X >= Math.min(z.a.X, z.b.X) && p.X <= Math.max(z.a.X, z.b.X) && p.Y >= Math.min(z.a.Y, z.b.Y) && p.Y <= Math.max(z.a.Y, z.b.Y);
    }
    function whereName(mn) {
      const C = charFor(mn), p = C && C.MapData && C.MapData.Pos;
      if (!p) return null;
      zonesLedger();
      for (const [n, z] of Object.entries(L.zones)) if (inZone(z, p)) return z.group || n;
      for (const [n, s] of Object.entries(L.spots || {})) if (Math.abs(s.X - p.X) <= 1 && Math.abs(s.Y - p.Y) <= 1) return n;
      return null;
    }
    const zoneText = (n, z) => n + (z.group && z.group !== n ? " (part of " + z.group + ")" : "") + " \xB7 A " + (z.a ? z.a.X + "," + z.a.Y : "not set") + " \u2192 B " + (z.b ? z.b.X + "," + z.b.Y : "not set");
    function voiceLedger() {
      L.voice = L.voice || {};
      L.voice.herd = L.voice.herd || {};
      L.voice.member = L.voice.member || {};
    }
    function voiceFor(mn) {
      voiceLedger();
      const r = rec(mn);
      if (!r || !r.hypno) return null;
      const m = L.voice.member[mn];
      if (m && m.on && m.lines.length) return m;
      const lead2 = herdLeaderOf(mn), h = lead2 && L.voice.herd[lead2];
      return h && h.on && h.lines.length ? h : null;
    }
    function voiceTick() {
      voiceLedger();
      state.voiceNext = state.voiceNext || /* @__PURE__ */ new Map();
      const now = Date.now();
      for (const C of W.ChatRoomCharacter || []) {
        const mn = C.MemberNumber, v = mn !== CFG.BOT_MEMBER && voiceFor(mn);
        if (!v) {
          state.voiceNext.delete(mn);
          continue;
        }
        if (v.every === "chores" && !clockedIn(mn) && !whereName(mn)?.startsWith("milking")) continue;
        const mins = v.every === "chores" ? 10 : parseInt(v.every, 10) || 15;
        const next = state.voiceNext.get(mn);
        if (!next) {
          state.voiceNext.set(mn, now + mins * 6e4 * (0.5 + Math.random() * 0.5));
          continue;
        }
        if (now < next) continue;
        state.voiceNext.set(mn, now + mins * 6e4 * (0.8 + Math.random() * 0.4));
        const line = fill(v.lines[Math.floor(Math.random() * v.lines.length)], mn);
        if (hasCompanion(mn)) enqueue(makeMsg("voice", { text: line }, mn));
        else whisper(mn, "[Voice] " + line);
      }
    }
    function canVoice(sender, t) {
      if (t === "herd") return canHoldHerd(sender);
      return isProprietor(sender) || herdLeaderOf(t) === sender;
    }
    const typeRec = (it) => it && it.Property && it.Property.TypeRecord || {};
    function wornItem(mn, group, name) {
      const C = charFor(mn);
      return C && Array.isArray(C.Appearance) ? C.Appearance.find((x) => x && x.Asset && x.Asset.Group && x.Asset.Group.Name === group && x.Asset.Name === name) || null : null;
    }
    function funnelOn(mn) {
      const C = charFor(mn);
      return !!(C && Array.isArray(C.Appearance) && C.Appearance.find((x) => x && x.Asset && x.Asset.Name === "FunnelGag" && x.Property && (x.Property.Type === "Funnel" || typeRec(x).typed === 1)));
    }
    function gearOf(mn) {
      const C = charFor(mn), g = {};
      if (!C) return g;
      const pump2 = wornItem(mn, "ItemNipples", "LactationPump");
      if (pump2) {
        const lv = Math.min(4, Number(pump2.Property && pump2.Property.SuctionLevel) || Number(typeRec(pump2).typed) || 0);
        if (lv > 0) g.milk = { kind: "pump", name: "lactation pump", level: lv, ml: CFG.GEAR.PUMP_ML[lv] };
      }
      const arousal = Math.max(0, Math.min(100, C.ArousalSettings && C.ArousalSettings.Progress || 0));
      const intensityOf = (it) => it && it.Property && typeof it.Property.Intensity === "number" ? it.Property.Intensity : -1;
      const echo = (name, it) => {
        const i = intensityOf(it);
        const mix = Math.min(1, 0.6 * i / 3 + 0.4 * arousal / 100);
        return { kind: "echo", name, level: i + 1, ml: Math.round(CFG.GEAR.ECHO_ML_MIN + (CFG.GEAR.ECHO_ML_MAX - CFG.GEAR.ECHO_ML_MIN) * mix) };
      };
      const ep = wornItem(mn, "ItemTorso", "\u4FBF\u643A\u4E73\u6CF5");
      if (!g.milk && ep && typeRec(ep).s === 0 && intensityOf(ep) >= 0) g.milk = echo("portable breast pump", ep);
      const ev = wornItem(mn, "ItemDevices", "\u5976\u8D29");
      if (!g.milk && ev && typeRec(ev).m === 1 && intensityOf(ev) >= 0) g.milk = echo("milk vendor", ev);
      for (const [n, label] of [["FuckMachine", "fuck machine"], ["Sybian", "Sybian"]]) {
        const m = wornItem(mn, "ItemDevices", n), i = m && m.Property && typeof m.Property.Intensity === "number" ? m.Property.Intensity : -1;
        if (m) g.machine = { name: label, intensity: i };
      }
      g.funnel = funnelOn(mn);
      return g;
    }
    const GEAR_LINES = {
      pump: [
        [
          "The lactation pump on %n%'s nipples gives a soft, steady little tug. Milk beads and drips into the bottles, +%ml%.",
          "%n%'s pump hums along nice and gentle, coaxin' out warm milk a drop at a time, +%ml%."
        ],
        [
          "The lactation pump pulls in a slow, firm rhythm, and %n%'s teats stretch into the cups with every draw, +%ml%.",
          "Milk runs in steady streams down the pump's tubes from %n%'s swollen nipples, +%ml%."
        ],
        [
          "The pump on %n% sucks hard, stretchin' those nipples long, and the bottles fill fast. %n% squirms in it, +%ml%.",
          "%n%'s lactation pump is cranked up high. Every pull wrings a hot spurt of milk out of 'em, +%ml%."
        ]
      ],
      echo: [
        [
          "The %g% on %n% sighs along, and a thin line of milk creeps up the hose, +%ml%.",
          "%n%'s %g% works slow and patient. Drip, drip, into the tank, +%ml%."
        ],
        [
          "Milk flows steady up the %g%'s hose from %n%'s teats, and the tank's fillin' nicely, +%ml%.",
          "The %g% has %n% let down good now: warm milk pulses up the line with every pull, +%ml%."
        ],
        [
          "%n% is so worked up the %g% can barely keep up. Milk gushes up the hoses into the tank, +%ml%.",
          "The %g%'s tank sloshes as %n%, flushed and needy, pours milk into it, +%ml%."
        ]
      ],
      machine: [
        "The %g% under %n% ticks over slow, just enough to keep 'em squirmin'.",
        "The %g% works %n% in a steady rhythm. They can't sit still.",
        "The %g% pounds away at %n%. They're a moanin', shakin' mess on it.",
        "The %g% is flat out, and %n% is wailin'. Somebody's gonna have to peel 'em off it."
      ]
    };
    function gearLine(mn, kind, level, name, mlGot) {
      const alt = addonLine(kind, lineInfo(mn, { level, gear: name, ml: ml(mlGot || 0) }));
      if (alt) return alt;
      const set = kind === "machine" ? GEAR_LINES.machine : GEAR_LINES[kind][level <= 1 ? 0 : level <= 2 ? 1 : 2];
      const raw = kind === "machine" ? set[Math.max(0, Math.min(3, level))] : set[Math.floor(Math.random() * set.length)];
      return raw.replace(/%n%/g, plainName(mn)).replace(/%g%/g, name).replace(/%ml%/g, ml(mlGot || 0));
    }
    function gearTick() {
      const dtMin = CFG.HEARTBEAT_MS / 6e4, now = Date.now();
      state.machineLoads = state.machineLoads || /* @__PURE__ */ new Map();
      for (const C of W.ChatRoomCharacter || []) {
        const mn = C.MemberNumber;
        if (mn === CFG.BOT_MEMBER || !rec(mn)) continue;
        const g = gearOf(mn), p = prodOf(mn), jitter = () => CFG.GEAR.EMOTE_MIN * 6e4 * (0.75 + Math.random() * 0.5);
        if (g.milk && makesMilk(mn) && !milkDenied(mn)) {
          const got = drainMilk(mn, g.milk.ml * dtMin);
          p.gearMl = (p.gearMl || 0) + got;
          if (got > 0 && now >= (p.gearNext || 0)) {
            p.gearNext = now + jitter();
            emote("\u{1F95B} " + gearLine(mn, g.milk.kind, g.milk.level, g.milk.name, p.gearMl), mn);
            sound(mn, "pump");
            p.gearMl = 0;
          }
          if (got > 0 && p.milk < 1 && !p.gearDry) {
            p.gearDry = true;
            emote("\u{1F95B} " + (addonLine("gearDry", lineInfo(mn, { gear: g.milk.name })) || "The " + g.milk.name + " pulls " + plainName(mn) + " plumb dry. Every last drop's in the tank, sugar."), mn);
          }
          if (p.milk >= 1) p.gearDry = false;
        }
        if (g.machine && g.machine.intensity >= 0) {
          const load = state.machineLoads.get(mn);
          if (load && now - load.at > CFG.GEAR.MACHINE_LOAD_MIN * 6e4) state.machineLoads.delete(mn);
          else if (load) {
            state.machineLoads.delete(mn);
            const err = inseminate(load.staff, mn, load.jar, load.hole, g.machine.name);
            if (err) tell(load.staff, "\u2699\uFE0F The " + g.machine.name + " couldn't do it: " + err);
          }
          if (now >= (p.machineNext || 0)) {
            p.machineNext = now + jitter();
            emote("\u2699\uFE0F " + gearLine(mn, "machine", g.machine.intensity, g.machine.name), mn);
            sound(mn, "machine");
          }
        }
      }
    }
    const ADDONS = /* @__PURE__ */ new Map();
    const ADDON_CMDS = /* @__PURE__ */ new Map();
    const addonAsks = /* @__PURE__ */ new Map();
    const ADDON_NAME = /^[a-z][a-z0-9-]{1,23}$/;
    const RANKS = { anyone: 0, staff: 1, herdmaster: 2, proprietor: 3 };
    const ANON_STUD = -1;
    function staffPoints(mn, n, why) {
      if (!mn || mn < 0) return;
      const S = L.staffScore = L.staffScore || {}, wk = weekKey();
      const x = S[mn] = S[mn] || { week: wk, pts: 0, total: 0, why: {} };
      if (x.week !== wk) {
        x.week = wk;
        x.pts = 0;
        x.why = {};
      }
      x.pts += n;
      x.total += n;
      if (why) x.why[why] = (x.why[why] || 0) + n;
      saveLedger();
    }
    function rankOf(mn) {
      return isProprietor(mn) ? 3 : isHerdmaster(mn) ? 2 : isStaff(mn) ? 1 : 0;
    }
    function addonData(name) {
      L.mods = L.mods || {};
      return L.mods[name] = L.mods[name] || {};
    }
    function addonCall(a, what, fn, ...args) {
      try {
        return fn(...args);
      } catch (e) {
        warn("add-on " + a.name + " (" + what + "):", e);
        a.errors = (a.errors || 0) + 1;
        a.lastError = String(e && e.message || e).slice(0, 200);
        return void 0;
      }
    }
    function addonsEmit(hook, ...args) {
      for (const a of ADDONS.values()) if (a.on && typeof a.on[hook] === "function" && a.enabled !== false) addonCall(a, hook, a.on[hook], ...args);
    }
    function posOf(mn) {
      const C = charFor(mn);
      return C && C.MapData && C.MapData.Pos ? { X: C.MapData.Pos.X, Y: C.MapData.Pos.Y } : null;
    }
    function onSpot(mn, name, reach) {
      const p = posOf(mn), s = L.spots && L.spots[name];
      if (!p || !s) return false;
      return Math.max(Math.abs(p.X - s.X), Math.abs(p.Y - s.Y)) <= (reach || 0);
    }
    function whoOnSpot(name, reach) {
      return (W.ChatRoomCharacter || []).map((c) => c.MemberNumber).filter((m) => m !== CFG.BOT_MEMBER && onSpot(m, name, reach));
    }
    function zonesOf(mn) {
      zonesLedger();
      const p = posOf(mn);
      return p ? Object.entries(L.zones).filter(([, z]) => z.a && z.b && inZone(z, p)).map(([n, z]) => ({ name: n, group: z.group })) : [];
    }
    function inZoneNamed(mn, name) {
      return zonesOf(mn).some((z) => z.name === name || z.group === name);
    }
    function privateLine(mn, text, kind, urgent) {
      const line = (kind === "emote" ? "*" : "") + String(text);
      if (hasCompanion(mn)) {
        enqueue(makeMsg("roomline", { text: line, kind: kind === "emote" ? "emote" : "chat" }, mn), urgent);
        return;
      }
      const ooc = mapRoom();
      for (const c of splitMessage(line, 900)) enqueue({ Content: ooc ? "(" + c.replace(/\(/g, "[").replace(/\)/g, "]") : c, Type: "Whisper", Target: mn }, urgent);
    }
    function addonRateX(mn, kind) {
      let x = 1;
      for (const a of ADDONS.values()) {
        if (a.enabled === false || !a.rates || typeof a.rates[kind] !== "function") continue;
        const v = Number(addonCall(a, "rates." + kind, a.rates[kind], mn));
        if (v > 0 && isFinite(v)) x *= v;
      }
      return Math.max(0.25, Math.min(3, x));
    }
    function addonLine(kind, info) {
      for (const a of ADDONS.values()) {
        if (a.enabled === false || !a.lines || typeof a.lines[kind] !== "function") continue;
        const v = addonCall(a, "lines." + kind, a.lines[kind], info);
        if (typeof v === "string" && v.trim()) return v.slice(0, 900);
      }
      return null;
    }
    function lineInfo(mn, extra) {
      const r = rec(mn) || {}, p = prodOf(mn);
      return Object.assign({
        mn,
        name: plainName(mn),
        full: p && makesMilk(mn) ? Math.min(1, p.milk / Math.max(1, milkCap(mn))) : 0,
        degrade: !!r.degradeMe,
        praise: !!r.praiseMe,
        species: speciesKey(mn)
      }, extra || {});
    }
    function activityInfo(data) {
      const dict = Array.isArray(data && data.Dictionary) ? data.Dictionary : [];
      const pk = (k) => {
        const e = dict.find((d) => d && d[k] !== void 0);
        return e ? e[k] : void 0;
      };
      let src = pk("SourceCharacter"), tgt = pk("TargetCharacter");
      if (typeof src !== "number") src = data.Sender;
      if (typeof tgt !== "number") {
        const old = dict.find((d) => d && d.Tag === "TargetCharacter");
        tgt = old ? old.MemberNumber : src;
      }
      return {
        act: String(pk("ActivityName") || (String(data.Content || "").match(/-([A-Za-z_]+)$/) || [])[1] || ""),
        src,
        tgt,
        focus: String(pk("FocusGroupName") || String(data.Content || "").split("-")[1] || "")
      };
    }
    function addonApi(a) {
      return Object.freeze({
        name: a.name,
        version: VERSION,
        cfg: CFG,
        data: () => addonData(a.name),
        save: () => saveLedger(),
        log: (...x) => log("[" + a.name + "]", ...x),
        audit: (by, action, detail) => audit(by, a.name.toUpperCase() + "_" + action, detail),
        // talkin'
        say: (t, urgent, who) => say(t, urgent, who),
        announce: (t, urgent) => announce(t, urgent),
        // for the whole farm, even when it names somebody
        emote: (t, who) => emote(t, who),
        whisper: (mn, t) => whisper(mn, t),
        privateEmote: (mn, t) => privateLine(mn, t, "emote"),
        privateSay: (mn, t) => privateLine(mn, t, "chat"),
        // a "listen to my voice" line: purple and private in the Companion, an out-of-character whisper otherwise
        voice: (mn, t) => hasCompanion(mn) ? enqueue(makeMsg("voice", { text: String(t) }, mn)) : whisper(mn, "[Voice] " + t),
        tell: (mn, t) => tell(mn, t),
        // a private note: the Companion if they have it, otherwise a beep (friends) or a whisper
        notice: (mn, t) => hasCompanion(mn) ? toCompanion(mn, t, "notice") : tell(mn, t),
        reply: (mn, t, ch) => reply(mn, t, ch),
        notifyStaff: (t, routine) => notifyStaff(t, routine),
        ask: (mn, text, cb) => {
          addonAsks.set(mn, { addon: a.name, cb, at: Date.now() });
          askCard(mn, a.name, text);
        },
        // people
        name: plainName,
        nameOnce: (text, mn) => nameOnce(text, mn),
        paint: (mn, area, by) => paintOn(mn, area, by),
        char: charFor,
        find: resolveTarget,
        here: () => (W.ChatRoomCharacter || []).map((c) => c.MemberNumber).filter((m) => m !== CFG.BOT_MEMBER),
        onMap,
        rec: (mn) => rec(mn),
        isStaff,
        isHerdmaster,
        isProprietor,
        hasRole,
        ROLE,
        onDuty,
        herdLeaderOf,
        herdMembers,
        species: speciesKey,
        gender: genderOf,
        hasCompanion,
        limitBlocks,
        rank: rankOf,
        // bodies
        prod: prodOf,
        HOLES,
        holeBlocked,
        hasVulva,
        makesSemen,
        makesMilk,
        capacity,
        milkCap,
        heldTotal,
        drainMilk,
        drainSemen,
        tally,
        ml,
        ANON_STUD,
        milkGrade,
        gradeLetter,
        staffPoints,
        staffScores: () => JSON.parse(JSON.stringify(L.staffScore || {})),
        // another add-on's saved data, read-only (a copy), so add-ons can work together
        peek: (other) => JSON.parse(JSON.stringify(L.mods && L.mods[other] || {})),
        yieldWeek: (mn) => {
          rollBoard();
          return L.yield && L.yield.w && L.yield.w[mn] || 0;
        },
        // milk (and seed) given this week
        studbook: () => JSON.parse(JSON.stringify(L.studbook || [])),
        clockedIn,
        isMandated,
        hoursThisWeek: (mn) => {
          const r = rec(mn);
          return r && r.shift && r.shift.week && r.shift.week.key === weekKey() ? r.shift.week.ms / 36e5 : 0;
        },
        inHeat,
        startHeat,
        rollConception,
        gearOf,
        funnelOn,
        // the map
        pos: posOf,
        spot: (n) => L.spots && L.spots[n] || null,
        spots: () => Object.assign({}, L.spots || {}),
        onSpot,
        whoOnSpot,
        zonesOf,
        inZone: inZoneNamed,
        zones: () => {
          zonesLedger();
          return L.zones;
        },
        teleport,
        spotBeside,
        activityInfo,
        penisType: (mn) => {
          try {
            return penisType(mn);
          } catch (e) {
            return "human";
          }
        },
        cockInches: (mn) => {
          try {
            return sizeOf(mn, "penis");
          } catch (e) {
            return 7;
          }
        },
        // little cues their own Companion plays (v0.10+): a face, a sound for whoever's around, the trance haze
        face: (mn, mood, secs) => face(mn, mood, secs),
        sound: (mn, name) => sound(mn, name),
        trance: (mn, level) => trance(mn, level),
        // time
        later,
        dayKey,
        weekKey
      });
    }
    function registerAddon(def) {
      if (!def || typeof def !== "object") throw new Error("register() needs { name, ... }");
      const name = String(def.name || "").toLowerCase();
      if (!ADDON_NAME.test(name)) throw new Error("add-on name must be lowercase letters, numbers or dashes, like 'glory-stalls'");
      if (ADDONS.has(name)) {
        warn("add-on " + name + " registered twice; the newer one replaces it");
        unregisterAddon(name);
      }
      const a = {
        name,
        label: String(def.label || name),
        version: String(def.version || "0"),
        on: def.on || {},
        companion: def.companion,
        rates: def.rates || null,
        lines: def.lines || null,
        guide: def.guide || "",
        commands: {},
        enabled: !(L.addonsOff && L.addonsOff[name]),
        errors: 0
      };
      a.api = addonApi(a);
      for (const [word0, c] of Object.entries(def.commands || {})) {
        const word = String(word0).toLowerCase();
        if (PUBLIC_CMDS.includes(word) || STAFF_CMDS.includes(word) || ["addons", "addon"].includes(word)) {
          warn("add-on " + name + ": ?" + word + " belongs to the bot, skipped");
          continue;
        }
        if (ADDON_CMDS.has(word)) {
          warn("add-on " + name + ": ?" + word + " is already taken by " + ADDON_CMDS.get(word).addon.name + ", skipped");
          continue;
        }
        if (!c || typeof c.run !== "function") continue;
        a.commands[word] = c;
        ADDON_CMDS.set(word, { addon: a, def: c });
        for (const al0 of c.aliases || []) {
          const al = String(al0).toLowerCase();
          if (PUBLIC_CMDS.includes(al) || STAFF_CMDS.includes(al) || ADDON_CMDS.has(al)) continue;
          ADDON_CMDS.set(al, { addon: a, def: c });
        }
      }
      ADDONS.set(name, a);
      if (typeof def.setup === "function") addonCall(a, "setup", def.setup, a.api);
      log("Add-on loaded: " + a.label + " v" + a.version + " (" + Object.keys(a.commands).map((c) => "?" + c).join(" ") + ")");
      return a.api;
    }
    function unregisterAddon(name) {
      const a = ADDONS.get(name);
      if (!a) return false;
      for (const [w, hit] of [...ADDON_CMDS]) if (hit.addon === a) ADDON_CMDS.delete(w);
      ADDONS.delete(name);
      return true;
    }
    function runAddonCommand(hit, sender, args, rest, channel, R) {
      const { addon: a, def } = hit;
      if (a.enabled === false) {
        R(a.label + " is switched off right now, sugar.");
        return;
      }
      const need = RANKS[def.rank || "anyone"] || 0;
      if (rankOf(sender) < need) {
        R("Sorry, sugar, that one's for " + (def.rank === "proprietor" ? "proprietors" : def.rank === "herdmaster" ? "herdmasters and proprietors" : "farm staff") + ".");
        return;
      }
      let answered = false;
      const ctx = { sender, args, rest, channel, api: a.api, reply: (t) => {
        answered = true;
        R(t);
      } };
      const errs = a.errors || 0;
      addonCall(a, "?" + Object.keys(a.commands).find((w) => a.commands[w] === def), def.run, ctx);
      if ((a.errors || 0) > errs) {
        audit(sender, "ADDON_ERROR", a.name + " \xB7 " + (a.lastError || ""));
        R("Oops, sugar, that one hit a snag in the " + a.label + " add-on. It's in the farm log for the proprietors. Try again in a bit, or ask staff.");
        return;
      }
      if (!answered && channel !== "chat" && !(state.cmdWatch && state.cmdWatch.emotes.length))
        R("\u{1F44D} Done.");
    }
    function addonYesNo(sender, yes) {
      const ask = addonAsks.get(sender);
      if (!ask) return false;
      addonAsks.delete(sender);
      if (Date.now() - ask.at > 15 * 6e4) {
        tell(sender, "That question timed out, sugar, so nothin' happened.");
        return true;
      }
      const a = ADDONS.get(ask.addon);
      if (a) addonCall(a, "ask", ask.cb, yes);
      return true;
    }
    function addonStateFor(mn) {
      const out = {};
      for (const a of ADDONS.values()) {
        if (a.enabled === false || typeof a.companion !== "function") continue;
        const v = addonCall(a, "companion", a.companion, mn);
        if (v && typeof v === "object") out[a.name] = Object.assign({ label: a.label }, v);
      }
      return Object.keys(out).length ? out : void 0;
    }
    function addonCommandGroups(mn) {
      const rank = rankOf(mn), out = [];
      for (const a of ADDONS.values()) {
        if (a.enabled === false) continue;
        const cmds = Object.entries(a.commands).filter(([, c]) => rank >= (RANKS[c.rank || "anyone"] || 0)).map(([w, c]) => c.usage || w);
        if (cmds.length) out.push({ name: a.label, cmds });
      }
      return out;
    }
    function findAddon(text) {
      const q = String(text || "").toLowerCase().trim();
      if (!q) return null;
      const norm = (s) => String(s || "").toLowerCase().replace(/[\s_-]+/g, "");
      const all = [...ADDONS.values()];
      const exact = ADDONS.get(q) || all.find((a) => norm(a.name) === norm(q) || norm(a.label) === norm(q));
      if (exact) return exact;
      const hits = all.filter((a) => norm(a.name).startsWith(norm(q)) || norm(a.label).startsWith(norm(q)));
      return hits.length === 1 ? hits[0] : null;
    }
    function addonsText(topic) {
      if (topic) {
        const a = findAddon(topic);
        if (!a) return "There's no add-on called '" + topic + "', hon. ?addons lists 'em.";
        return "\u{1F9E9} " + a.label + " v" + a.version + (a.enabled === false ? " (switched off)" : "") + "\n" + (a.guide || "No guide written yet.") + "\n\nCommands: " + (Object.entries(a.commands).map(([w, c]) => "?" + (c.usage || w) + (c.rank && c.rank !== "anyone" ? " (" + c.rank + ")" : "")).join(" \xB7 ") || "none");
      }
      if (!ADDONS.size) return "\u{1F9E9} No add-ons are runnin' on the farm right now.";
      return "\u{1F9E9} FARM ADD-ONS\n" + [...ADDONS.values()].map((a) => "\u2022 " + a.label + " (" + a.name + ")" + (a.enabled === false ? " \xB7 off" : "") + (a.errors ? " \xB7 " + a.errors + " errors" : "") + ": " + (Object.keys(a.commands).map((c) => "?" + c).join(" ") || "no commands")).join("\n") + "\n?addons <name> shows one add-on's guide.";
    }
    function addonsBoot() {
      if (W.Farmhand && W.Farmhand.__bot === true) return;
      W.Farmhand = Object.freeze({
        api: 1,
        version: VERSION,
        __bot: true,
        // returns the add-on's helpers; the same helpers are also handed to setup(api)
        register: (def) => registerAddon(def),
        list: () => [...ADDONS.values()].map((a) => ({ name: a.name, label: a.label, version: a.version, enabled: a.enabled !== false, errors: a.errors })),
        // the Companion on the bot's own account talks to the bot here, on the page
        own: (dict) => {
          try {
            if (!dict || typeof dict !== "object" || !["hello", "bye", "cmd", "outfitSave", "outfitAnswer", "relayNo", "sight", "leadOk", "leadNo"].includes(dict.type)) return false;
            onCompanion(Object.assign({}, JSON.parse(JSON.stringify(dict)), { from: CFG.BOT_MEMBER }));
            return true;
          } catch (e) {
            warn("own panel:", e);
            return false;
          }
        }
      });
      try {
        W.dispatchEvent(new W.CustomEvent("farmhand:ready", { detail: { api: 1, version: VERSION } }));
      } catch (e) {
        warn("farmhand:ready:", e);
      }
      log("Add-on door open (window.Farmhand).");
    }
    const HOLE_WORD = { vulva: "pussy", butt: "ass", mouth: "throat" };
    const SCENES = {
      milk: [
        { t: "%b kneels beside %n with the pail and warms their hands, then cups a heavy breast and gives it a slow, testing squeeze." },
        {
          t: "A first thin stream rings against the bottom of the pail. %n lets out a shaky breath as the milk starts to let down.",
          d: 'A first thin stream rings against the pail. "Listen to that, %n," %b says. "Good little dairy animal, leaking for me already."'
        },
        {
          t: "%b finds the rhythm on %n: squeeze, pull, release. Warm milk spurts into the pail in steady, foaming streams.",
          p: '%b finds the rhythm, murmuring praise with every pull. "There you go, %n, sweet thing. So much. So good."'
        },
        { say: true, t: "That's it, %n. Let it all down for the farm, hon." },
        {
          t: "%b switches sides. The second breast is so full it sprays the moment it's touched, and %n moans and arches into the hands.",
          d: `%b switches sides, and %n sprays the moment they're touched. "Can't even hold it in. Pathetic, leaky cow."`
        },
        { t: "The pail's warm and heavy now. %b strips the last drops out with long, firm pulls until %n's teats are soft and tender: %ml in the pail." }
      ],
      milkSelf: [
        { t: "%n settles over the pail and cups their own breast, squeezing slow and steady." },
        { t: "Milk starts to spurt into the pail, and %n sighs at the relief of it." },
        { t: "%n works one side, then the other, rocking a little with the rhythm, warm milk foaming in the pail." },
        { t: "%n squeezes out the last drops and sits back, flushed and lighter: %ml in the pail." }
      ],
      collect: [
        { t: "%b sets the collection jar in place and wraps a slick, gloved hand around %n's cock, stroking slow from root to tip." },
        {
          t: "%n's hips start to twitch. %b keeps the pace steady and patient, thumb rubbing under the head each time.",
          d: `%n's hips start to twitch. "Look at you, humping air for it," %b says. "Breeding stock with no one to breed."`
        },
        { say: true, t: "Easy, %n. Every drop goes in the jar, hon." },
        { t: "%b squeezes tighter and speeds up, other hand cupping and rolling %n's balls. %n is panting and leaking." },
        {
          t: "%n groans and bucks as they spill, thick ropes pumping into the jar while %b milks every pulse out of them.",
          p: '%n groans and bucks as they spill, and %b murmurs "good stud, good stud" while milking out every pulse.'
        },
        { t: "%b caps the jar and holds it up to the light: %ml of %n's seed, labelled and on the shelf." }
      ],
      collectSelf: [
        { t: "%n sets the collection jar in place and takes themselves in hand." },
        { t: "%n strokes faster, breath hitching, aiming carefully at the jar." },
        { t: "%n spills into the jar with a groan, every pulse caught: %ml bottled for the farm." }
      ],
      machine: [
        { t: "%b loads the jar of %stud's seed into the %m's reservoir and checks the fit. The machine hums and the attachment slides into %n's %h." },
        {
          t: "The %m starts slow, deep strokes, letting %n get used to it. Every push nudges the seed reservoir with a soft, wet click.",
          d: `The %m starts slow and deep in %n. "Don't look so surprised," %b says. "This is how we breed the ones nobody wants to touch."`
        },
        { say: true, t: "Breedin' machine's runnin', y'all. %n's gettin' %stud's seed whether %stud's here or not." },
        { t: "The pace picks up. %n rocks with the %m, breath coming in gasps, the whole frame creaking." },
        {
          t: "%b turns the dial up. The %m pounds into %n's %h, hard and relentless, and %n can't stay quiet.",
          p: `%b turns the dial up and strokes %n's hair. "You're doing so well. Take it all. Good breeder."`
        },
        { t: "The reservoir gurgles. The %m holds deep and pumps, flooding %n's %h with %stud's seed in long, warm surges." },
        { t: "The %m keeps going in %n a while longer, slow and deep, working every drop as far in as it'll go." },
        { t: "The %m eases off and slides out. %n is left shaking and full: %ml of %stud's seed, all of it inside." }
      ],
      syringe: [
        { t: "%b fills the long syringe from jar #%jar and lays a firm hand on %n's hip to hold them still." },
        {
          t: "The tip slides into %n's %h, slow and deep, and %b takes a moment to settle it just right.",
          d: `The tip slides into %n's %h. "Hold still, breeder. You don't get a stud, you get a syringe."`
        },
        { t: "%b pushes the plunger down slowly. %n gasps at the warm, heavy fill." },
        { t: "%b slides it out and keeps a hand pressed over %n's %h a moment so nothing leaks: %ml of %stud's seed, all the way in." }
      ],
      edgeVulva: [
        { t: "%b slips a hand between %n's thighs and starts slow circles, teasing, until %n's hips start to follow." },
        {
          t: "%b works two fingers into %n's pussy and curls them, thumb rubbing faster. %n's breath goes ragged and high.",
          d: `%b works two fingers into %n's dripping pussy. "Listen to how wet you are. Desperate little breeding hole."`
        },
        {
          t: "%n is right there, trembling, about to tip over, and %b pulls their hand away and steps back. Edge number %k.",
          p: `%n is right there, and %b pulls away gently. "Not yet, sweet thing. You're being so good for me. Edge number %k."`
        }
      ]
    };
    function runScene(key, t, vars, onEnd) {
      state.sceneRun = state.sceneRun || /* @__PURE__ */ new Map();
      const beats = SCENES[key], r = rec(t) || {};
      if (!beats || state.sceneRun.has(t)) return false;
      const id = Symbol(key);
      state.sceneRun.set(t, id);
      const cue = {
        milk: ["milked", "pail"],
        milkSelf: ["milked", "pail"],
        collect: ["milked", "wet"],
        collectSelf: ["milked", "wet"],
        machine: ["bred", "machine"],
        syringe: ["bred", "wet"],
        edgeVulva: ["edged", null]
      }[key];
      if (cue) {
        face(t, cue[0], 120);
        if (cue[1]) sound(t, cue[1]);
      }
      const fillV = (s) => String(s).replace(/%(\w+)/g, (m, k) => vars[k] !== void 0 ? vars[k] : m);
      let i = 0;
      const step = () => {
        if (state.sceneRun.get(t) !== id) return;
        if (!onMap(t)) {
          state.sceneRun.delete(t);
          return;
        }
        const b = beats[i++];
        if (!b) {
          state.sceneRun.delete(t);
          if (onEnd) try {
            onEnd();
          } catch (e) {
            warn("scene end:", e);
          }
          return;
        }
        const line = fillV(r.degradeMe && b.d || r.praiseMe && b.p || b.t);
        const from = vars.bMn && vars.b && line.startsWith(vars.b) ? vars.bMn : t;
        if (b.say) say(line, false, t);
        else emote(vars.icon + " " + line, from, [t, vars.bMn]);
        later(step, (15 + Math.random() * 10) * 1e3);
      };
      step();
      return true;
    }
    function stopScene(t) {
      if (state.sceneRun) state.sceneRun.delete(t);
    }
    function cueable(mn, pref) {
      const c = state.companions.get(mn);
      return !!(hasCompanion(mn) && c && verAtLeast(c.ver, "0.10.0") && !(c.off && c.off[pref]));
    }
    function face(mn, mood, secs) {
      if (cueable(mn, "face")) enqueue(makeMsg("face", { mood, secs: secs || 30 }, mn));
    }
    function trance(mn, level) {
      if (cueable(mn, "trance")) enqueue(makeMsg("trance", { level: level || 0 }, mn));
    }
    function sound(anchor, name) {
      const who = new Set([anchor].concat(audience(anchor, "hear")));
      for (const mn of who) if (cueable(mn, "sound")) enqueue(makeMsg("sound", { name }, mn));
    }
    function sightOf(mn) {
      const s = state.sight && state.sight.get(mn);
      return s && Date.now() - s.at < 18e4 ? s : null;
    }
    function audience(mn, kind) {
      const s = sightOf(mn);
      if (!s) return [];
      return (kind === "hear" ? s.hear : s.see).filter((m) => m !== CFG.BOT_MEMBER && charFor(m));
    }
    function onSight(mn, m) {
      state.sight = state.sight || /* @__PURE__ */ new Map();
      const ok = (a) => Array.isArray(a) ? a.map(Number).filter(Number.isFinite).slice(0, 60) : [];
      state.sight.set(mn, { see: ok(m.see), hear: ok(m.hear), at: Date.now() });
    }
    function canLead(mn) {
      return cueable(mn, "lead") && onMap(mn);
    }
    function lead(mn, pt, urgent, why) {
      state.leads = state.leads || /* @__PURE__ */ new Map();
      for (const [id2, l] of state.leads) if (l.mn === mn) state.leads.delete(id2);
      const id = ++companionSeq;
      state.leads.set(id, { mn, pt: { X: pt.X, Y: pt.Y }, at: Date.now(), urgent });
      enqueue(makeMsg("lead", { X: pt.X, Y: pt.Y, id, why: why || "" }, mn), urgent);
      return true;
    }
    function leadAnswer(mn, m) {
      const l = state.leads && state.leads.get(m.id);
      if (!l || l.mn !== mn) return;
      state.leads.delete(m.id);
      if (m.type === "leadNo") teleportNow(mn, l.pt, l.urgent);
    }
    function leadTick() {
      if (!state.leads) return;
      for (const [id, l] of state.leads) {
        const p = posOf(l.mn);
        if (p && Math.max(Math.abs(p.X - l.pt.X), Math.abs(p.Y - l.pt.Y)) <= 1) {
          state.leads.delete(id);
          continue;
        }
        if (Date.now() - l.at > 9e4) {
          state.leads.delete(id);
          teleportNow(l.mn, l.pt, l.urgent);
        }
      }
    }
    function onClimax(mn, content) {
      const r = rec(mn), p = r && prodOf(mn);
      if (!p || limitBlocks(mn)) return;
      const now = Date.now(), d = dayKey(), n = plainName(mn);
      if (!p.climax || p.climax.day !== d) p.climax = { day: d, came: 0, edged: 0, ruined: 0 };
      if (/^OrgasmResist/.test(content)) {
        p.climax.edged++;
        if (makesSemen(mn)) {
          p.edges = Math.min(CFG.EDGE_MAX, (p.edges || 0) + 1);
          if (p.edges >= CFG.EDGE_PENT) p.pentUp = true;
        }
        if (hasVulva(mn)) {
          if (now - (p.vEdgeAt || 0) > CFG.VEDGE_HOURS * 36e5) p.vEdges = 0;
          p.vEdges = Math.min(CFG.EDGE_MAX, (p.vEdges || 0) + 1);
          p.vEdgeAt = now;
        }
        face(mn, "edged", 25);
        if (now - (p.edgeSaid || 0) > 12e4) {
          p.edgeSaid = now;
          emote(pickFresh("edge", [
            n + " holds it back, trembling right on the edge. The farm counts that one.",
            n + " fights it off with a shaky groan and stays right on the brink. Another edge on the tally.",
            n + " clenches up and refuses to tip over. Good. That's " + p.climax.edged + " today."
          ]), mn);
        }
      } else if (/^OrgasmFail/.test(content)) {
        p.climax.ruined++;
        if (hasVulva(mn)) {
          if (now - (p.vEdgeAt || 0) > CFG.VEDGE_HOURS * 36e5) p.vEdges = 0;
          p.vEdges = Math.min(CFG.EDGE_MAX, (p.vEdges || 0) + 1);
          p.vEdgeAt = now;
        }
        if (makesSemen(mn) && p.semen >= 2) {
          const lost = Math.min(p.semen, p.semen * 0.2);
          p.semen -= lost;
        }
        face(mn, "edged", 25);
        emote(pickFresh("ruin", [
          n + " whimpers as it slips away, ruined and leaking, nowhere near enough.",
          n + "'s release fizzles out into a sad, twitching dribble. Ruined.",
          n + " sags with a frustrated whine. So close, and nothin' to show for it."
        ]), mn);
      } else if (/^Orgasm\d/.test(content)) {
        p.climax.came++;
        face(mn, "afterglow", 40);
        const bits = [];
        if (makesMilk(mn) && !milkDenied(mn) && p.milk > 1) {
          const g = gearOf(mn);
          const out = g.milk ? drainMilk(mn, Math.min(p.milk, milkRate(mn) * 0.25)) : Math.min(p.milk, milkRate(mn) * 0.1);
          if (!g.milk) p.milk -= out;
          if (out >= 1) bits.push(g.milk ? "milk gushes down the pump's lines with every spasm (+" + ml(out) + " in the tank)" : "milk spurts from both teats as they shake");
        }
        if (makesSemen(mn) && !holeBlocked(mn, "penis") && p.semen >= 2) {
          const spent = Math.min(p.semen, p.semen * CFG.PROD.LOAD_SHARE * 0.5 * (1 + CFG.EDGE_X * Math.min(p.edges || 0, CFG.EDGE_MAX)));
          p.semen -= spent;
          p.edges = 0;
          p.pentUp = false;
          bits.push("their cock pulses out " + ml(spent) + " of wasted seed");
        }
        emote(n + " comes apart, gasping and shaking" + (bits.length ? ": " + bits.join(", and ") : "") + ".", mn);
        const f = p.lastFill;
        if (f && now - f.at < 15 * 6e4 && !f.rerolled && !p.preg && hasVulva(mn)) {
          f.rerolled = true;
          if (rollConception(mn, f.stud, f.ml, 0.5)) later(() => emote("\u{1F37C} Right as " + n + " peaks, somethin' deep inside catches. " + plainName(f.stud) + "'s seed took after all.", mn), 4e3);
        }
      }
      saveLedger();
    }
    function showConsent(t, to, what) {
      emote(pickFresh("yes", [
        plainName(t) + " nods eagerly at " + plainName(to) + ". Yes. Please.",
        plainName(t) + " flushes and gives " + plainName(to) + " a shy little nod: yes to " + what + ".",
        plainName(t) + " presents for " + plainName(to) + " without a word. That's a yes."
      ]), t);
    }
    function pickFresh(key, list) {
      state.lastPick = state.lastPick || /* @__PURE__ */ new Map();
      const last = state.lastPick.get(key);
      const pool = list.length > 1 ? list.filter((x) => x !== last) : list;
      const v = pool[Math.floor(Math.random() * pool.length)];
      state.lastPick.set(key, v);
      return v;
    }
    const AMBIENT = [
      "%a and %b jostle shoulder to shoulder at the rail, neither willing to give up their spot.",
      "%a nuzzles into %b's neck and gets a sleepy nuzzle back.",
      "%a rests their head on %b's back and lets out a long, contented sigh.",
      "%a licks a stray drip of milk off %b's chin, and %b pretends not to like it.",
      "%a and %b doze off leaning against each other in the straw.",
      "%a bumps %b with their hip, and the two of them tussle in the hay for a moment.",
      "%a grooms %b's hair with careful fingers while %b stays perfectly still.",
      "%a and %b trade soft little animal noises, a whole conversation without a single word."
    ];
    function ambientTick() {
      if (!CFG.AMBIENT_ON || !mapRoom()) return;
      const now = Date.now();
      if (now < (state.ambientAt || 0)) return;
      state.ambientAt = now + (15 + Math.random() * 10) * 6e4;
      const stock = presentStock().filter((m) => onMap(m) && !stockedNow(m) && !(state.sceneRun && state.sceneRun.has(m)));
      const pairs = [];
      for (let i = 0; i < stock.length; i++) for (let j = i + 1; j < stock.length; j++) {
        const a2 = posOf(stock[i]), b2 = posOf(stock[j]);
        if (a2 && b2 && Math.max(Math.abs(a2.X - b2.X), Math.abs(a2.Y - b2.Y)) <= 2) pairs.push([stock[i], stock[j]]);
      }
      if (!pairs.length) return;
      const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
      emote(pickFresh("ambient", AMBIENT).replace(/%a/g, plainName(a)).replace(/%b/g, plainName(b)), Math.random() < 0.5 ? a : b);
    }
    const STALL_SOUNDS = {
      cow: ["a low, needy moo", "a soft moo", "a long, shaky moo"],
      bull: ["a deep, rumbling snort", "a low bellow", "a heavy, shuddering snort"],
      pony: ["a breathy whinny", "a soft nicker", "a shaky little whinny"],
      horse: ["a breathy whinny", "a low nicker", "a long, trembling whinny"],
      deer: ["a thin, wavering bleat", "a soft bleat"],
      pig: ["a needy little oink", "a soft grunt", "a squealing gasp"],
      pup: ["a high, needy whine", "a soft whimper", "a breathless yip"],
      dog: ["a needy whine", "a low whimper", "a shaky yip"],
      kitt: ["a needy mewl", "a soft, broken purr", "a breathy mew"],
      cat: ["a needy mewl", "a rumbling purr", "a breathy mew"],
      goblin: ["a ragged little cackle that turns into a moan", "a breathless giggle"],
      default: ["a soft moan", "a needy whimper", "a shaky gasp"]
    };
    const STALL_STORY = {
      milk: {
        open: [
          "The stall's cups swing down and settle over %n's breasts, cool for a heartbeat before the suction takes hold and pulls their nipples deep.",
          "Soft rubber cups seal over %n's nipples with a wet little kiss, and the pump hums to life somewhere behind the boards.",
          "The machine finds %n's breasts the way it's found a hundred others: a firm seal, a gentle tug, a quiet hiss as the lines open.",
          "A strap cinches gently across %n's back to hold them still, and the cups latch onto both nipples at once.",
          "The stall clicks, the cups lift, and in one smooth motion they're on %n, drawing those nipples down into the warm dark of the liners.",
          "%n's breath catches as the cups latch on. The first pull is gentle, testing, like the machine is getting to know them.",
          "The cups slide into place over %n's breasts and the vacuum takes hold, tugging their nipples long and stiff.",
          "There's a hiss, a click, and then that familiar, insistent pull at %n's nipples. The stall has them now."
        ],
        start: [
          "Nothing at first, just the slow pull and release. Then %n feels it: that deep, tingling ache as the milk starts to let down.",
          "A first thin stream runs down the clear line from %n's left breast, then the right catches up.",
          "%n shivers. The let-down hits all at once, a warm rush that makes their knees go soft.",
          "The rhythm is slow to start, pull and rest, pull and rest, coaxing the milk out of %n instead of taking it.",
          "Their nipples swell inside the cups, dark and tender, and the first milk beads and runs.",
          "%n lets out %s as the pressure in their breasts finally starts to ease.",
          "Little pulses of white chase each other down the tubes. The bucket below gives its first soft patter.",
          "The cups squeeze in time with the pump, a soft rolling pressure that draws a little more out of %n every time.",
          "%n's hands curl around the rail. It always feels a bit too good when the milk starts flowing.",
          "The machine settles into its pace and %n settles with it, breathing in time with the pull.",
          "Warmth spreads through %n's chest as the milk comes, a heavy, liquid relief.",
          "Drip, then trickle, then a steady stream. %n's breasts give it up for the stall."
        ],
        rhythm: [
          "Pull, hold, release. The stall works %n with patient, mechanical devotion.",
          "Milk runs in steady ribbons down the lines, and the bucket fills with a soft, foaming hiss.",
          "%n's nipples are drawn long and stiff inside the cups, every pull sending a little jolt down their spine.",
          "The pump keeps its slow heartbeat, and %n's breasts answer it, stream after stream.",
          "%n sways a little with the rhythm, head bowed, lost in the pull.",
          "A bead of milk escapes the seal and runs down the curve of %n's breast. The cup tugs harder, as if to scold it.",
          "%n lets out %s without meaning to.",
          "Each squeeze of the liners rolls down %n's nipples like a warm mouth, patient and greedy.",
          "The bucket's note gets lower as it fills, a deep, wet drum under %n.",
          "%n's breathing has gone slow and heavy, matched to the machine.",
          "The cups pulse faster for a moment, then ease back, and %n's whole body follows.",
          "Milk foams at the top of the bucket. %n can smell it, sweet and warm, filling the stall.",
          "Something about the steady pull makes %n's thoughts go soft and simple. Stand still. Give milk.",
          "%n shifts their weight, and the cups follow, never losing their grip.",
          "Their breasts feel lighter and heavier at once: emptying, and still so sensitive.",
          "The lines thrum with each pulse, warm against %n's belly where they run.",
          "%n catches themself rocking forward into the cups, chasing the pull.",
          "Pull, release. Pull, release. Time stops meaning much in the stall.",
          "A soft, wet suckling sound comes from the cups every time they ease off.",
          "%n's nipples tingle and ache in the best way, worked and worked and worked.",
          "The pump stutters, catches, and drives on, drawing a fresh rush out of %n.",
          "%n lets their head hang. The milk keeps coming, and so does the pull.",
          "Warm milk sloshes in the bucket as %n shifts, and the sound makes them flush.",
          "The stall has found exactly the pace %n gives most at, and it keeps it.",
          "Every pull is a little deeper now, drawing from somewhere further back in %n's chest.",
          "%n gives %s as the cups tug in perfect unison.",
          "The milk runs thick and steady, and %n can feel every drop leave them.",
          "Their skin is flushed pink around the edges of the cups, warm and damp.",
          "%n's toes curl against the straw. The suction just doesn't let up.",
          "A shiver runs through %n each time the liners squeeze down to the tip."
        ],
        build: [
          "The machine picks up its pace. %n gasps as the cups start to pull in quick, hungry pulses.",
          "Deep in the session now, %n's nipples are swollen and tender, and every pull lands like a spark.",
          "%n's knees tremble. The stall isn't gentle any more. It's thorough.",
          "The suction deepens, drawing %n's nipples further into the cups than they thought they'd go.",
          "%n moans openly now, past caring who might hear.",
          "Their breasts throb in time with the pump, hot and full and aching to give more.",
          "The bucket's well past half. %n can hear how much of themself is in it.",
          "%n's hips start to sway with the rhythm, a slow, helpless roll.",
          "Every pull sends a hot little pulse straight down between %n's thighs.",
          "%n bites their lip as the cups give a long, slow, merciless draw.",
          "The machine finds a second wind and so does %n's milk, streaming hard down both lines.",
          "%n gives %s, long and shaky, and presses into the cups.",
          "Sweat beads at %n's temple. The stall keeps working, steady as the seasons.",
          "%n's nipples are so sensitive now that even the pause between pulls makes them twitch.",
          "The cups tug hard, and %n's breath stutters out of them in little gasps.",
          "%n's grip on the rail goes white-knuckled as the stall drives on."
        ],
        heavy: [
          "The bucket is heavy now, warm milk lapping near the rim.",
          "%n's breasts are softer, emptier, but the cups don't stop pulling.",
          "The streams thin from ribbons to pulses. The stall works harder for every drop.",
          "%n sags against the rail, flushed and dazed, nipples aching from the long pull.",
          "Only short spurts now, each one drawn out by a long, slow squeeze.",
          "%n whimpers as the cups dig for what's left.",
          "The milk is thinner, sweeter. The stall takes it all the same.",
          "%n can feel how much lighter they are. The pull on their nipples feels bigger for it.",
          "The pump's note changes, lower and slower, searching.",
          "%n's breathing evens out into long, tired sighs between pulls.",
          "A last good rush runs down the lines, and %n shudders all the way through it.",
          "Their nipples are deep pink and puffy inside the cups, worked tender and loving it."
        ],
        ending: [
          "The stall slows. Long, deliberate pulls, stripping the last of it out of %n.",
          "One more squeeze, then another, then a pause. The machine is listening for anything left.",
          "%n's nipples twitch in the cups as the suction eases little by little.",
          "The final drops bead and fall. The bucket gives one last soft plink.",
          "The cups give a slow, lingering pull, almost tender, then rest.",
          "%n lets out %s as the pump winds down.",
          "The lines go quiet, a last trickle running into the bucket.",
          "The pressure fades from %n's nipples a breath at a time.",
          "The stall holds %n there a moment longer, as if admiring its work.",
          "A gentle hiss as the seal breaks on one cup, then the other."
        ],
        finish: [
          "The cups let go of %n with a soft, wet pop. %ml in the bucket, and they're down to a quarter. Sore, light, and very well milked.",
          "The stall releases %n and swings its cups away. %ml of warm milk sits foaming in the bucket.",
          "Done. %n's breasts hang soft and tender, nipples still pouting from the cups. The bucket holds %ml.",
          "With a last hiss the stall lets %n go. %ml milked out of them, and a quarter left to start over with.",
          "The pump falls silent. %n blinks slowly at the bucket: %ml, all of it theirs.",
          "The strap loosens and the cups lift away, leaving %n flushed and dripping. %ml in the pail.",
          "The stall's done with %n for now: %ml in the bucket, and two very sore, very satisfied nipples.",
          "Cups off, lines quiet, %ml in the bucket. %n wobbles a little as they straighten up."
        ]
      },
      cock: {
        open: [
          "A warm, wet sleeve slides down over %n's %c cock and seals at the base with a soft, sucking kiss.",
          "The stall's sleeve finds %n's cock and swallows it to the root, snug and slick.",
          "A padded cup settles around %n's balls while the sleeve eases down their %c cock, warm and tight.",
          "%n's breath hitches as the sleeve takes them. The machine is in no hurry, but it doesn't let go.",
          "A strap settles across %n's hips to keep them still, and the sleeve slides home over their %c cock.",
          "The sleeve is warm, wet and ribbed inside, and it closes around %n's cock like it was made for it.",
          "With a hiss the suction takes hold, drawing %n's %c cock deep into the sleeve.",
          "The stall latches on to %n below the belt: a slick sleeve on their cock, a soft cup cradling their balls."
        ],
        start: [
          "The sleeve starts slow, one long stroke from tip to root, then back again.",
          "%n's cock swells hard inside the sleeve, and the machine adjusts its grip to match.",
          "The cup around %n's balls begins to hum, a low, steady vibration that goes straight through them.",
          "Slick and warm, the sleeve works %n's %c cock in long, unhurried pulls.",
          "A bead of precum is drawn out of %n and down the line, the first of many.",
          "%n lets out %s as the sleeve finds its rhythm.",
          "The ribbed inside of the sleeve drags over every inch of %n on each stroke.",
          "Pull, squeeze, release. The machine is learning exactly what %n's cock likes.",
          "%n's hips twitch forward into the sleeve before they can stop them.",
          "The suction pulses softly at the tip, coaxing, patient.",
          "Warmth floods %n's belly. The sleeve isn't rushing them, and that's almost worse.",
          "%n's %c cock throbs in the sleeve, already leaking."
        ],
        rhythm: [
          "The sleeve strokes %n steadily, wet sounds rising from the stall with every pull.",
          "%n's hips roll in time with the machine, helpless to keep still.",
          "Precum strings down the clear line in slow, glossy drips.",
          "The cup around %n's balls squeezes gently, then lets go, then squeezes again.",
          "%n gives %s as the sleeve sucks hard at their tip.",
          "Root to tip, tip to root. The sleeve never tires, never hurries.",
          "%n's cock is flushed and slick, twitching inside the sleeve with every pass.",
          "The vibration in the ball cup shifts up a notch, and %n's thighs shake.",
          "The machine edges %n with lazy, perfect strokes, easing off just when it gets good.",
          "%n's breath comes short and ragged. The sleeve just keeps going.",
          "A warm, wet suckling sound fills the stall, the machine savoring every stroke.",
          "%n grips the rail and pushes back into the sleeve, wanting more of it.",
          "The sleeve tightens around %n's %c cock, then relaxes, then tightens again.",
          "Little spurts of precum pulse down the line. The machine takes every drop.",
          "%n's balls draw up tight in the vibrating cup, aching and full.",
          "The stall's rhythm is slow and deep, and %n's whole body is rocking to it.",
          "%n moans low in their throat as the sleeve sucks them down to the root.",
          "Their cock throbs so hard they can feel their own pulse in the sleeve.",
          "The suction at the tip pulses in a quick little flutter that makes %n gasp.",
          "%n sways in the strap, flushed, mouth open, completely given over to the machine.",
          "The sleeve picks up a little speed, slick and relentless.",
          "%n's toes curl in the straw as the sleeve drags over their most sensitive spot again and again.",
          "The machine milks %n's %c cock the way it milks everything: thoroughly.",
          "%n gives %s and their hips stutter forward.",
          "Wet heat, steady pulls, a gentle squeeze at the base. %n can't think past it.",
          "The ball cup's hum climbs and falls in waves, and %n rides every one.",
          "%n's cock leaks steadily now, and the line carries it all away.",
          "The sleeve slows to a long, torturous stroke, and %n whimpers.",
          "Every pull draws a shiver from the base of %n's spine to the tip of their cock.",
          "%n can hear the slick rhythm of the sleeve over their own heartbeat."
        ],
        build: [
          "The sleeve speeds up, pumping %n in short, hungry strokes.",
          "%n's cock swells even harder. They're close, and the machine knows it.",
          "%n's moans come louder now, raw and needy.",
          "The ball cup squeezes in time with the sleeve, and %n's knees nearly buckle.",
          "%n's hips buck into the sleeve, chasing it.",
          "The suction at the tip turns greedy, pulling hard and fast.",
          "%n gives %s, high and desperate.",
          "%n's legs shake. The sleeve is merciless and slick and perfect."
        ],
        // played in order: the climaxes tell a story
        climax: [
          "%n's %c cock jerks in the sleeve and the first thick pulse shoots down the line.",
          "They cum hard, the sleeve milking every throb out of them. The machine doesn't stop.",
          "Through the aftershocks the sleeve keeps stroking, and %n whines at how sensitive they are.",
          "Cum runs thick down the clear line into the collection jar.",
          "The machine eases off just long enough for %n to breathe, then starts building them up again.",
          "Over-sensitive and twitching, %n can only hang in the strap and take it.",
          "Another wave builds, and the ball cup hums them right up to the edge of it.",
          "%n's second load comes slower and deeper, wrenched out of them by the relentless sleeve.",
          "%n gasps and shakes as the sleeve keeps stroking, wringing out every last pulse.",
          "The sleeve slows to a crawl, and %n sags, panting, cock still throbbing."
        ],
        heavy: [
          "The jar is filling. Thick, pearly seed, all of it %n's.",
          "%n's balls feel lighter, emptier, but the cup keeps humming.",
          "The loads come thinner now, each one drawn out by a long, slow pull.",
          "%n sags against the rail, spent and twitching.",
          "%n whimpers as the sleeve strokes their over-worked cock again.",
          "Another weak spurt, and the machine takes that too.",
          "The sleeve slows, searching for what's left.",
          "%n's cock aches sweetly in the sleeve, wrung out and still hard.",
          "One more shaky climax rolls through %n, thin and long.",
          "The jar's contents glisten, and %n can't believe all that came out of them.",
          "%n's breathing is ragged, their hips barely moving now.",
          "The ball cup's hum turns soft and slow, like a petting hand."
        ],
        ending: [
          "The sleeve gives one last long stroke, root to tip, and holds.",
          "A final drop beads at %n's tip and is drawn away.",
          "The suction eases a breath at a time.",
          "The ball cup's hum fades to nothing.",
          "The machine strokes %n gently, almost kindly, winding down.",
          "%n lets out %s as the stall slows to a stop.",
          "The line goes quiet. The jar is still.",
          "The sleeve loosens its grip, slowly, letting %n's cock soften.",
          "One last little squeeze at the base, and the stall rests.",
          "A soft hiss as the seal at the root lets go."
        ],
        finish: [
          "The sleeve slides off %n's spent cock with a wet pop. %ml in the jar, balls down to a quarter. Good stud.",
          "The stall releases %n: legs wobbly, cock twitching, %ml of seed in the jar.",
          "Done. %n hangs in the strap, drained and glowing, %ml collected.",
          "The ball cup lifts away and the sleeve follows. %ml of %n's seed sits in the jar.",
          "The machine lets %n go. %ml milked from their %c cock, and they're down to a quarter.",
          "The strap loosens. %n staggers, spent: %ml in the jar.",
          "Sleeve off, cup off, jar heavy: %ml. %n won't be walking straight for a while.",
          "The stall's done with %n's cock for now: %ml collected, and one very satisfied stud."
        ]
      },
      // somebody who makes both: lines about both at once, mixed in with the breast and cock lines
      both: [
        "Cups on %n's breasts and a sleeve on their %c cock: the stall works both at once, and %n doesn't know which to moan about first.",
        "Milk runs down one line and precum down the other, and %n is shaking between them.",
        "The breast cups and the cock sleeve pulse together, and %n's whole body follows the rhythm.",
        "%n's nipples are pulled long while their cock is stroked deep, and they give %s.",
        "Both lines are full: white milk, pearly cum. The stall takes everything %n has.",
        "When the sleeve squeezes, %n's breasts let down harder. The machine has noticed.",
        "%n cums, and their milk spurts harder at the same moment, both lines pulsing at once.",
        "Every part of %n that can be milked is being milked, and they're dazed with it.",
        "The cups tug and the sleeve strokes in perfect counterpoint, a slow double rhythm.",
        "%n's legs tremble. Too much, too good, from both ends of the stall's attention.",
        "The bucket and the jar fill side by side, and %n can't stop looking.",
        "The stall drains %n's breasts and balls in lockstep, steady as a heartbeat."
      ],
      bothFinish: [
        "The cups and the sleeve let go together. %ml of milk and %ms of seed: the stall took everything %n had.",
        "Both lines fall quiet. %n is down to a quarter top and bottom: %ml in the bucket, %ms in the jar.",
        "Done with them at last. %n sways in the strap, nipples puffy and cock spent: %ml of milk, %ms of cum.",
        "The stall releases %n from cups and sleeve both. %ml and %ms, and one very dazed, very milked animal."
      ],
      atmos: [
        "Straw rustles somewhere down the row. Another stall hums to life.",
        "Warm barn air hangs heavy around %n's stall, smelling of hay, milk and skin.",
        "A fly drones lazily past %n and out through a gap in the boards.",
        "Somewhere outside a gate creaks, and the barn settles back into its slow rhythm.",
        "Light falls in dusty stripes across %n's stall, moving slow.",
        "The pump's motor ticks and hums behind the boards, warm and steady.",
        "Someone walks past the stall. Their steps slow, just for a moment, then move on.",
        "The rail under %n's hands is worn smooth by everyone who stood here before them.",
        "The barn cat watches %n from a beam overhead, utterly unimpressed.",
        "Distant laughter drifts in from the pasture.",
        "A breeze through the slats cools the sweat on %n's back.",
        "The stall's little brass plate reads 'Property of B&B Farm'. %n can see it from here.",
        "Somebody's boots scuff the floor nearby. %n doesn't look up.",
        "A tap drips somewhere. The barn breathes around %n.",
        "Down the row, someone else lets out a long, happy sigh.",
        "The lines creak softly where they hang from their hooks.",
        "A bucket clanks as a farmhand carries a full one past.",
        "%n can hear their own heartbeat, slow and loud, under the hum of the machine.",
        "The straw under %n is warm from their own body.",
        "Outside, the wind shifts and the barn doors knock softly against their latch.",
        "The clock on the barn wall ticks on. %n has stopped counting.",
        "A farmhand leans in, checks the gauges, gives %n a pat, and moves on.",
        "The stall light flickers, then steadies.",
        "Somewhere, someone is humming. It might be the farm girl."
      ],
      praise: [
        " Such a good, giving animal.",
        " The farm is so proud of you.",
        " You're doing so well, sweetheart.",
        " Look how much you give. Perfect.",
        " Such a good, obedient animal.",
        " That's it. Just like that. Good.",
        " You were made for this stall.",
        " Every drop makes the farm happier.",
        " So productive. So good.",
        " Somebody's earning a ribbon today."
      ],
      degrade: [
        " Look at you, a leaky little farm animal.",
        " This is all you're good for, and you love it.",
        " Dripping like a broken tap. Pathetic.",
        " Just a dumb, needy dairy animal.",
        " Moaning for a machine. How shameless.",
        " Livestock doesn't think. Livestock gives.",
        " Such a greedy, leaky thing.",
        " You'd stand here all day if they let you, wouldn't you?",
        " Mindless, milky, and owned.",
        " Good for one thing, and it's this."
      ]
    };
    function stallProgress(st) {
      const m = st.total.m > 0 ? st.got.m / st.total.m : 0, s = st.total.s > 0 ? st.got.s / st.total.s : 0;
      return Math.min(1, Math.max(m, s));
    }
    function stallPick(st, key, list, inOrder) {
      st.used = st.used || {};
      const used = st.used[key] = st.used[key] || [];
      if (inOrder) {
        const i2 = used.length;
        if (i2 >= list.length) return null;
        used.push(i2);
        return list[i2];
      }
      let free = list.map((_, i2) => i2).filter((i2) => !used.includes(i2));
      if (!free.length) {
        st.used[key] = [];
        free = list.map((_, i2) => i2);
      }
      const i = free[Math.floor(Math.random() * free.length)];
      st.used[key].push(i);
      return list[i];
    }
    function stallFill(mn, st, line) {
      const sounds = STALL_SOUNDS[speciesKey(mn)] || STALL_SOUNDS.default;
      return String(line).replace(/%size/g, () => CFG.SIZES.udder.names[udderLevel(mn) - 1] || "full").replace(/%cup/g, () => CFG.SIZES.udder.cups[udderLevel(mn) - 1] || "D").replace(/%balls/g, () => CFG.SIZES.testes.names[sizeOf(mn, "testes") - 1] || "full").replace(/%len/g, () => sizeOf(mn, "penis") + "-inch").replace(/%ml/g, ml(st.kind === "cock" ? st.got.s : st.got.m)).replace(/%ms/g, ml(st.got.s)).replace(/%s/g, () => sounds[Math.floor(Math.random() * sounds.length)]).replace(/%c/g, makesSemen(mn) ? penisLabel(mn) : "").replace(/^[\s\S]*$/, (all) => nameOnce(all, mn));
    }
    function stallBeat(mn, st, finish) {
      const S = STALL_STORY, r = rec(mn) || {};
      st.beats = (st.beats || 0) + 1;
      let line;
      if (finish) line = st.kind === "both" ? stallPick(st, "bothFinish", S.bothFinish) : stallPick(st, st.kind + "Finish", S[st.kind].finish);
      else if (st.beats === 1) line = stallPick(st, "open", S[st.kind === "cock" ? "cock" : "milk"].open);
      else {
        const prog = stallProgress(st);
        let part = st.kind === "both" ? Math.random() < 0.5 ? "milk" : "cock" : st.kind;
        const phase = prog < 0.08 ? "start" : prog < 0.45 ? "rhythm" : prog < 0.75 ? part === "cock" && prog >= 0.55 ? "climax" : "build" : prog < 0.92 ? "heavy" : "ending";
        const trait = ["rhythm", "build", "heavy"].includes(phase) && st.lastKind !== "trait" && Math.random() < 0.33 ? stallTraitLine(mn, st, part) : null;
        if (trait) {
          line = trait;
          st.lastKind = "trait";
        } else if (phase === "climax" && st.peakNext) {
          line = stallPeakLine(mn);
          st.peakNext = false;
          st.lastKind = "climax";
        } else if (["rhythm", "build", "heavy"].includes(phase) && st.lastKind !== "atmos" && Math.random() < 0.15) {
          line = stallPick(st, "atmos", S.atmos);
          st.lastKind = "atmos";
        } else if (st.kind === "both" && ["rhythm", "build"].includes(phase) && Math.random() < 0.3) {
          line = stallPick(st, "both", S.both);
          st.lastKind = "both";
        } else {
          line = phase === "climax" ? stallPick(st, "climax", S.cock.climax, true) : null;
          if (phase === "climax" && line && st.used.climax.length === 1) st.peakNext = true;
          if (!line) line = stallPick(st, part + "-" + (phase === "climax" ? "build" : phase), S[part][phase === "climax" ? "build" : phase]);
          st.lastKind = phase;
        }
      }
      let out = stallFill(mn, st, line);
      if (!finish && st.beats > 1 && Math.random() < 0.25) {
        if (r.degradeMe) out += stallPick(st, "degrade", S.degrade);
        else if (r.praiseMe) out += stallPick(st, "praise", S.praise);
      }
      return out;
    }
    const STALL_TRAITS = {
      udderSmall: { part: "milk", when: (mn) => udderLevel(mn) <= 3, lines: [
        "%n's %size little breasts barely fill the cups, but the stall pulls at them just as greedily.",
        "The cups are almost too big for %n's %cup-cup chest, and the suction draws every bit of them inside.",
        "Small as they are, %n's breasts give and give. The machine doesn't care about size, only about milk.",
        "%n's perky nipples are drawn out long and pink, the whole of their small breasts tugged up into the liners.",
        "There isn't much of %n's chest for the cups to hold, so they hold all of it."
      ] },
      udderMid: { part: "milk", when: (mn) => udderLevel(mn) >= 4 && udderLevel(mn) <= 6, lines: [
        "%n's %size breasts sway heavily with every pull, filling the cups to the rim.",
        "The cups are sized just right for %n's %cup-cup breasts, sealing snug all the way round.",
        "%n's breasts jiggle softly as the pump pulses, full and warm in the cups.",
        "Each pull lifts the soft weight of %n's breasts a little, then lets them settle back down.",
        "%n's %size breasts are flushed and tight with milk, the skin shiny where the cups grip."
      ] },
      udderBig: { part: "milk", when: (mn) => udderLevel(mn) >= 7 && udderLevel(mn) <= 10, lines: [
        "%n's %size breasts hang heavy in the stall's sling, so full the cups look small on them.",
        "It takes the extra-wide cups to fit %n's %cup-cup breasts, and even those strain at the seal.",
        "%n's huge breasts slosh with every pull. There's so much milk in there the stall has to work for it.",
        "The sling under %n's chest creaks as their %size breasts sway with the pump.",
        "Milk runs from %n's enormous breasts in thick, endless streams, the lines barely keeping up.",
        "%n's breasts are so heavy they rest on the padded shelf, and the cups pull at them from below."
      ] },
      udderHyper: { part: "milk", when: (mn) => udderLevel(mn) >= 11, lines: [
        "%n's %size breasts fill half the stall, propped on padded shelves while the oversized cups work them.",
        "The stall had to be fitted with the special cups for %n: wide as dinner plates, and they still struggle to seal.",
        "%n can't see past their own breasts. They can only feel them: vast, aching, and pouring milk.",
        "The bucket under %n's colossal breasts fills like a rain barrel. The stall will be at this a while.",
        "Every pull sends a slow wave through %n's massive breasts, and the milk just keeps coming."
      ] },
      preg: { part: "milk", when: (mn, p) => !!p.preg, lines: [
        "The milk comes rich and creamy, the way it does when there's a litter on the way. %n's round belly presses against the rail.",
        "%n's belly is round and taut beneath the cups, and something in there kicks as the milk lets down.",
        "Carrying makes everything more sensitive, and %n feels every single pull.",
        "%n cradles their swollen belly with one hand while the stall milks them, flushed and glowing.",
        "The pump hums, the milk flows, and %n's belly gives a lazy little roll from within."
      ] },
      fresh: { part: "milk", when: (mn, p) => !p.preg && p.freshUntil > Date.now(), lines: [
        "%n is still in full fresh-mother flow, and the milk pours out like it's meant for a whole litter.",
        "Freshened and overflowing, %n gives milk faster than the stall can pull it.",
        "There's a little one somewhere who'd want this milk. Today the stall gets it instead.",
        "%n's breasts have been making milk for their young, and they don't hold back now."
      ] },
      pierced: { part: "milk", when: (mn) => {
        const C = charFor(mn);
        return !!(C && (C.Appearance || []).some((x) => x && x.Asset && x.Asset.Group && x.Asset.Group.Name === "ItemNipplesPiercings"));
      }, lines: [
        "The rings through %n's nipples tug and clink inside the cups with every pull.",
        "%n's nipple piercings catch the suction just so, and they gasp each time the liners squeeze.",
        "Metal glints inside the clear cups where %n's pierced nipples are drawn long.",
        "Each pull drags at %n's nipple jewelry, a sharp little sweetness on top of the ache."
      ] },
      heat: { part: "any", when: (mn, p) => inHeat(p), lines: [
        "%n is in heat, and the stall's pull goes straight between their legs. They're dripping on the straw.",
        "Heat-dazed and needy, %n rocks against nothing as the machine works them.",
        "%n's heat makes every pull feel like a touch, and they can't keep quiet about it.",
        "Their skin is fever-warm with heat, flushed all over, and the stall just keeps going."
      ] },
      equine: { part: "cock", when: (mn) => penisType(mn) === "equine", lines: [
        "%n's flared %len horse cock fills the long sleeve, the broad head throbbing at the far end.",
        "The sleeve has to stretch around the flare of %n's equine cock on every stroke, and it drags deliciously.",
        "%n's horse cock hangs long and heavy, the sleeve working it from flare to sheath.",
        "The flare swells and spreads inside the sleeve, and %n stamps a foot."
      ] },
      canine: { part: "cock", when: (mn) => penisType(mn) === "canine", lines: [
        "%n's red, tapered canine cock slides in and out of the sleeve, slick and pointed.",
        "The sleeve squeezes around the base of %n's canine cock where the knot is starting to swell.",
        "%n's pointed tip pulses steady little spurts down the line, the way a dog's does.",
        "The sleeve's grip settles behind %n's knot like a tight fist, and they whine."
      ] },
      knot: { part: "cock", when: (mn) => knotted(mn) && penisType(mn) !== "canine", lines: [
        "A ring inside the sleeve clamps around %n's swelling knot and holds it there.",
        "%n's knot swells fat and tight in the sleeve's grip, and they shake with it.",
        "The machine strokes everything above %n's knot and squeezes the knot itself in slow pulses.",
        "Locked in the sleeve by their own knot, %n isn't going anywhere."
      ] },
      feline: { part: "cock", when: (mn) => penisType(mn) === "feline", lines: [
        "The soft barbs along %n's feline cock catch on the ribbed sleeve, and they shiver all the way down.",
        "%n's barbed cock throbs in the sleeve, every stroke dragging those little nubs the wrong way.",
        "%n purrs, then yowls, as the sleeve works their barbed shaft.",
        "The sleeve is lined soft for barbed cocks, and it still makes %n's tail lash."
      ] },
      draconic: { part: "cock", when: (mn) => penisType(mn) === "draconic", lines: [
        "The ridges along %n's draconic cock bump through the sleeve one by one on every stroke.",
        "%n's ridged cock is thick and textured, and the sleeve works every ridge.",
        "Heat rolls off %n's draconic cock inside the sleeve, the liner warming to match.",
        "%n growls low as the sleeve squeezes ridge after ridge."
      ] },
      double: { part: "cock", when: (mn) => penisType(mn) === "double", lines: [
        "Two sleeves for two cocks: the stall works both of %n's shafts in alternating strokes.",
        "%n's twin cocks throb side by side in their sleeves, leaking together.",
        "The left sleeve strokes while the right one sucks, and %n can't keep track of either.",
        "Both of %n's cocks jerk at once, and two lines fill with precum."
      ] },
      bigCock: { part: "cock", when: (mn) => sizeOf(mn, "penis") >= 12, lines: [
        "%n's %len cock is too long for the standard sleeve, so the stall uses the long one, and it swallows every inch.",
        "There's so much of %n's cock that the sleeve strokes it in two long passes.",
        "%n's huge cock throbs against the sleeve's walls, stretching it.",
        "The sleeve's ribs drag down all %len of %n, and it takes a while to get to the end."
      ] },
      smallCock: { part: "cock", when: (mn) => sizeOf(mn, "penis") <= 5, lines: [
        "%n's little cock disappears completely in the sleeve, which sucks at it greedily all the same.",
        "The sleeve is tight enough to grip even %n's small cock, and it milks it like any other.",
        "Small as it is, %n's cock leaks just as much as anyone's in the sleeve."
      ] },
      ballsSmall: { part: "cock", when: (mn) => sizeOf(mn, "testes") <= 2, lines: [
        "%n's small, tight balls are cupped snugly, the vibration humming right through them.",
        "The cup closes around %n's little balls, gentle, and squeezes them in rhythm."
      ] },
      ballsBig: { part: "cock", when: (mn) => sizeOf(mn, "testes") >= 6 && sizeOf(mn, "testes") <= 10, lines: [
        "%n's %balls balls fill the cup to bursting, heavy and sloshing as it squeezes.",
        "The ball cup strains around %n's big sack, vibrating against all that weight.",
        "%n's balls are so full they ache, and every squeeze of the cup makes them gasp.",
        "The cup lifts %n's heavy balls and kneads them in slow, insistent waves."
      ] },
      ballsHyper: { part: "cock", when: (mn) => sizeOf(mn, "testes") >= 11, lines: [
        "%n's %balls balls rest in a padded cradle of their own, far too big for the cup, so the stall massages them instead.",
        "There's a sea of seed sloshing in %n's colossal balls, and the stall means to have its share.",
        "Every pump sends a shiver across the vast curve of %n's balls."
      ] },
      cow: { part: "any", when: (mn) => speciesKey(mn) === "cow", lines: [
        "%n lets out a long, contented moo, tail swishing behind them.",
        "%n's cowbell clinks softly with every pull.",
        "%n chews slowly at nothing, eyes half-closed, the very picture of a happy dairy cow.",
        "%n's ear flicks at a fly, and they shift their hooves in the straw."
      ] },
      bull: { part: "any", when: (mn) => speciesKey(mn) === "bull", lines: [
        "%n snorts and paws the straw, nostrils flaring with every pump.",
        "%n tosses their head and bellows low, nose ring catching the light.",
        "%n's tail lashes, heavy and impatient, then stills as the machine drags at them."
      ] },
      equid: { part: "any", when: (mn) => ["pony", "horse"].includes(speciesKey(mn)), lines: [
        "%n stamps a hoof and tosses their mane, breath snorting through their nose.",
        "%n's tail flicks high, and they let out a soft nicker.",
        "%n's ears swivel back toward the pump's hum."
      ] },
      deer: { part: "any", when: (mn) => speciesKey(mn) === "deer", lines: [
        "%n's ears twitch at every sound, and their little tail flicks.",
        "%n stands delicately in the straw, trembling like a fawn."
      ] },
      pig: { part: "any", when: (mn) => speciesKey(mn) === "pig", lines: [
        "%n grunts happily, snout twitching, wriggling deeper into the straw.",
        "%n's curly tail wiggles every time the pump pulls."
      ] },
      canid: { part: "any", when: (mn) => ["pup", "dog"].includes(speciesKey(mn)), lines: [
        "%n's tail wags helplessly, thumping against the stall's boards.",
        "%n pants, tongue lolling, and lets out a happy little whine.",
        "%n's ears flatten, then perk, as the machine changes pace."
      ] },
      felid: { part: "any", when: (mn) => ["kitt", "cat"].includes(speciesKey(mn)), lines: [
        "%n's tail lashes and curls, and a purr rumbles out of them despite themself.",
        "%n kneads the padded rail, purring.",
        "%n's ears flatten back as the machine pulls, then relax again."
      ] },
      goblin: { part: "any", when: (mn) => speciesKey(mn) === "goblin", lines: [
        "%n cackles breathlessly, then moans, then cackles again.",
        "%n's long ears droop and twitch as the stall works them.",
        "%n mutters a curse at the machine, then begs it not to stop."
      ] }
    };
    const STALL_PEAK = {
      equine: "%n's flare blooms wide inside the sleeve as they cum, ropes of seed pumping down the line in huge, heavy surges.",
      canine: "%n's knot swells to its fullest and locks in the sleeve's grip, and they pump load after load, the way a dog does.",
      feline: "%n yowls as they cum, barbs flaring, seed spurting in short, hot bursts.",
      draconic: "%n roars as they cum, ridges pulsing in waves, a scalding flood rushing down the line.",
      double: "Both of %n's cocks cum at once, two lines filling side by side.",
      knot: "%n's knot swells and locks in the sleeve, and they cum in long, pulsing throbs.",
      human: "%n cries out as they cum, hips jerking into the sleeve, thick spurts pulsing down the line."
    };
    function stallTraitLine(mn, st, part) {
      const p = prodOf(mn);
      st.used = st.used || {};
      const fits = Object.entries(STALL_TRAITS).filter(([k, t2]) => {
        if (t2.part !== part && t2.part !== "any") return false;
        if ((st.used["trait-" + k] || []).length >= t2.lines.length) return false;
        try {
          return !!t2.when(mn, p);
        } catch (e) {
          return false;
        }
      });
      if (!fits.length) return null;
      st.traitUses = st.traitUses || {};
      const least = Math.min(...fits.map(([k]) => st.traitUses[k] || 0));
      const pool = fits.filter(([k]) => (st.traitUses[k] || 0) === least);
      const [key, t] = pool[Math.floor(Math.random() * pool.length)];
      st.traitUses[key] = (st.traitUses[key] || 0) + 1;
      return stallPick(st, "trait-" + key, t.lines);
    }
    function stallPeakLine(mn) {
      const t = penisType(mn);
      if (STALL_PEAK[t] && t !== "human") return STALL_PEAK[t];
      return knotted(mn) ? STALL_PEAK.knot : STALL_PEAK.human;
    }
    const STALL_MORE = {
      milk: {
        open: [
          "A farmhand's gloved hands guide the cups onto %n's breasts one at a time, and the suction takes each with a soft gasp of air.",
          "The cups are warm from the last cow. They seal over %n's nipples and start to pull before %n has quite settled.",
          "%n leans into the padded frame and the cups find them on their own, latching with a wet, eager hiss.",
          "The liners have been oiled. They slide over %n's nipples slick and snug, and the vacuum takes hold.",
          "A soft chime from the pump, and the cups close on %n's breasts like a promise.",
          "%n feels the cups' rims press warm into their skin, then the long, slow first pull draws their nipples inside."
        ],
        start: [
          "The first few pulls are short and teasing, waking %n's breasts up to what's coming.",
          "%n's nipples tingle and harden in the cups, and a slow warmth gathers behind them.",
          "A single bead of milk shows in the line, then another, then the stall has its stream.",
          "%n holds their breath, waiting for the let-down. When it comes, it comes all at once.",
          "The pump's hum drops to a lower note as the milk starts flowing, as if it's pleased.",
          "%n feels the ache in their breasts turn into a pull, and the pull turn into relief.",
          "Warm milk wets the inside of the cups, and every pull after that is slicker and deeper.",
          "The first spurt hits the bucket with a bright little ring, and %n blushes at the sound."
        ],
        rhythm: [
          "The cups pull in long, rolling waves, and %n's breasts sway gently with each one.",
          "Milk sprays in fine jets inside the cups before it's drawn away down the lines.",
          "%n's mind drifts. There's only the pull, the release, and the warm, heavy feeling of giving.",
          "The bucket hums with a deep, liquid note as it fills.",
          "%n's nipples are long and slick, pulsing inside the liners with every draw.",
          "Each time the cups ease off, %n's breasts tingle in the sudden quiet, waiting for the next pull.",
          "The stall's rhythm and %n's heartbeat have fallen in step.",
          "%n licks their lips. The air is thick with the smell of warm milk.",
          "A drop runs from the seal down %n's belly, warm and slow.",
          "The lines sway softly where they hang, heavy with milk.",
          "%n arches a little, pushing their breasts deeper into the cups.",
          "The suction holds a moment longer than usual, and %n's breath catches.",
          "Pull. %n sighs. Release. %n breathes. Pull.",
          "%n's breasts are flushed and warm, the skin around the cups glowing pink.",
          "The pump ticks over, unhurried, drawing stream after stream out of %n.",
          "There's a soft gurgle in the lines as the milk comes faster.",
          "%n's thoughts have gone quiet and milky. It's easier this way.",
          "Every pull rolls through %n's whole chest, slow and deep.",
          "%n can feel their breasts getting lighter, a little at a time.",
          "The cups give a quick double pull, and %n squeaks."
        ],
        build: [
          "The pump shifts gear, pulling harder, faster, and %n gasps at the change.",
          "%n's nipples throb in the cups, so sensitive now that every pull is almost too much.",
          "Milk sprays hard against the inside of the cups, the lines running thick and white.",
          "%n's legs tremble and they lean their whole weight on the rail.",
          "The stall's grip feels deeper than ever, like it's reaching for milk %n didn't know they had.",
          "%n whimpers as the cups give a long, unrelenting draw.",
          "The bucket sloshes as %n shifts. It's heavier than they expected.",
          "%n's breasts ache sweetly, the fullness giving way to a raw, wonderful tenderness.",
          "Sweat runs down %n's spine. The stall doesn't slow.",
          "%n's moans are coming in time with the pump now, and they've stopped trying to hide them.",
          "The cups pulse in quick flutters, and %n's breath goes ragged.",
          "%n's hands slip on the rail. Their whole body is caught in the rhythm."
        ],
        heavy: [
          "The bucket's near full. The stall works on regardless.",
          "%n's breasts are soft and spent, nipples pulled long and sore.",
          "Each pull now draws only a thin spurt, and the machine has to be patient for it.",
          "%n's head lolls. They're floating somewhere warm and milky and far away.",
          "The cups tug and wait, tug and wait, coaxing out the last of it.",
          "%n hums softly, dazed, as the stall searches for every last drop.",
          "The milk's slowing, but %n's nipples haven't stopped tingling.",
          "%n shivers as the cups give a deep, almost tender pull."
        ],
        ending: [
          "The pump eases to its gentlest setting, just a soft, final coaxing.",
          "%n's nipples twitch as the last drops are pulled from them.",
          "The stall gives one long, slow strip from base to tip, and holds.",
          "The lines empty with a last gurgle into the bucket.",
          "%n sighs, long and contented, as the pull fades away.",
          "The cups loosen their seal a fraction, then another, letting %n's breasts settle."
        ],
        finish: [
          "The cups release with a soft sigh of air. %n's breasts are tender and light, and the bucket holds %ml.",
          "Done. A farmhand wipes %n down with a warm cloth, and carries off %ml of fresh milk.",
          "The stall swings its cups back on their hooks. %ml in the pail, and %n can barely stand.",
          "%n's nipples are pink and pouting as the cups come away. %ml milked, and a quarter left to grow back.",
          "The pump clicks off. %ml, steaming gently in the bucket. Good milk, from a good animal."
        ]
      },
      cock: {
        open: [
          "A farmhand's gloved hand guides %n's cock into the sleeve, and the stall takes it from there.",
          "The sleeve is warm and already wet, and it closes over %n's %c cock with a hungry little gulp of air.",
          "%n shivers as the ball cup closes around them, warm and soft and humming.",
          "The sleeve has been lubed thick. It slides down %n's cock without a catch, all the way to the base.",
          "A soft chime from the pump, and the sleeve tightens around %n's cock like a fist.",
          "%n's cock twitches the moment the sleeve touches it. The machine notices."
        ],
        start: [
          "The first strokes are long and lazy, waking %n's cock up inch by inch.",
          "The ball cup warms against %n, a slow hum that settles deep in their belly.",
          "%n's cock fills the sleeve completely now, hard and throbbing.",
          "A slow drip of precum is drawn down the line, the first sign %n's getting into it.",
          "The sleeve squeezes at the base, then releases, then squeezes again, finding %n's pace.",
          "%n's hips give a small, involuntary thrust, and the sleeve answers with a tight pull.",
          "The pump's hum deepens as %n hardens, settling into its work.",
          "%n bites their lip as the sleeve drags slowly over the head of their cock."
        ],
        rhythm: [
          "The sleeve strokes in long, slick pulls, and %n's cock jerks with each one.",
          "%n's balls tighten in the cup as the vibration rolls through them.",
          "Precum runs freely down the line now, a steady, glistening thread.",
          "%n's breathing comes heavy and slow, matched to the stroke of the sleeve.",
          "The sleeve pauses at the tip and sucks, and %n's knees go weak.",
          "%n leans forward on the rail, hips rolling in slow circles.",
          "The machine strokes and squeezes and strokes, patient as a tide.",
          "A wet, rhythmic sound comes from the sleeve, and %n flushes at it.",
          "%n's cock aches pleasantly, held right at the edge and kept there.",
          "The sleeve's ribs ripple along %n's shaft in a slow wave, tip to base.",
          "%n's thighs tremble as the ball cup squeezes them softly.",
          "Every stroke draws a small, helpless sound out of %n.",
          "The stall's pace is maddeningly steady. %n wants faster. The stall doesn't care.",
          "%n's cock pulses in the sleeve, slick and swollen and dripping.",
          "The sleeve twists a little on the upstroke, and %n gasps.",
          "%n's mind is narrowing to a single point, right where the sleeve grips them.",
          "The suction at the tip comes and goes, little flutters that make %n squirm.",
          "%n's hips jerk forward, chasing the sleeve as it pulls back.",
          "The ball cup's vibration deepens, a low thrum %n feels in their teeth.",
          "%n groans, low and long, as the sleeve slides all the way down again."
        ],
        build: [
          "The sleeve quickens, short sharp strokes that make %n cry out.",
          "%n's balls draw tight against their body, aching.",
          "%n can't hold still. Their hips are pumping in time with the machine.",
          "The suction at the tip turns hard and steady, and %n's whole body tenses.",
          "%n is right on the edge, every stroke pushing them closer.",
          "%n's fingers dig into the rail as the sleeve speeds up again."
        ],
        climax: [],
        heavy: [
          "Another thin load is wrung from %n, slow and shuddering.",
          "%n's cock is raw and sensitive, but the sleeve won't stop stroking.",
          "The jar's level creeps higher with every weak spurt.",
          "%n hangs in the strap, panting, completely spent and still hard.",
          "The machine slows to a crawl, milking out every last drop.",
          "%n's balls feel hollow and tender in the humming cup.",
          "Every stroke now makes %n twitch and whimper.",
          "One more pulse, barely anything, and the line takes it."
        ],
        ending: [
          "The sleeve slows to a last, lazy stroke.",
          "%n's cock softens slowly in the sleeve's loosening grip.",
          "The ball cup gives a final gentle squeeze and goes still.",
          "The last of %n's seed trickles down into the jar.",
          "%n sighs long and deep as the machine winds down.",
          "The sleeve gives one final pull at the tip, then lets go."
        ],
        finish: [
          "The sleeve releases %n's cock with a soft, wet sound. %ml in the jar, every drop of it hard-won.",
          "Done. A farmhand wipes %n down and carries off a jar holding %ml.",
          "The stall lets %n go, cock spent and tender, %ml collected.",
          "The ball cup lifts away. %n's balls are light and aching, and the jar holds %ml.",
          "The pump clicks off. %ml of thick seed in the jar. Good stud."
        ]
      },
      both: [
        "%n doesn't know whether to push their chest into the cups or their hips into the sleeve, so they do both.",
        "The stall alternates: a pull at the breasts, a stroke on the cock, a pull, a stroke, and %n melts.",
        "Milk and precum run side by side down the two lines.",
        "%n's nipples and cock throb in the same rhythm. The machine has synchronized them.",
        "%n gives %s as both the cups and the sleeve squeeze at once.",
        "Every time %n's cock jerks in the sleeve, their breasts spurt harder into the cups.",
        "The bucket and the jar fill together, and %n is wrung out from both ends.",
        "%n's body doesn't know which pleasure to answer first."
      ],
      bothFinish: [
        "Cups and sleeve let go at last. %ml of milk and %ms of seed, and %n is down to a quarter in every way.",
        "The stall releases %n completely: %ml in the bucket, %ms in the jar, and one wobbly, glowing animal."
      ],
      atmos: [
        "A rooster crows somewhere out past the barn.",
        "The stall next door clicks off. Someone else is finished. %n isn't.",
        "Rain patters softly on the barn roof.",
        "A shaft of sunlight creeps across the straw toward %n's feet.",
        "The pump's warm exhaust stirs the straw in a little eddy.",
        "Someone whistles a tune on their way past the stalls.",
        "The barn smells of hay, leather, and milk.",
        "A pail is set down with a clank somewhere close by.",
        "%n hears hooves shift in the next stall over.",
        "The farm girl's voice drifts in from the yard, laughing at something.",
        "The barn doors creak open, let in a gust of cool air, and swing shut again.",
        "A chain rattles softly in another stall.",
        "Somewhere, a radio is playing old country songs, low and crackly.",
        "Dust motes spin lazily in the light above %n.",
        "The scent of fresh straw rises as %n shifts their feet.",
        "Two farmhands chat quietly at the end of the row, paying %n no mind at all."
      ],
      praise: [
        " Such a pretty, productive thing.",
        " The farm couldn't run without you.",
        " What a treasure you are.",
        " Look at you go. So good.",
        " You make the farm proud.",
        " Easy, sweetheart, you're doing beautifully.",
        " Best in the barn.",
        " So well behaved. Such a good animal.",
        " There's my perfect little milker.",
        " Keep giving like that and there'll be treats."
      ],
      degrade: [
        " Nothing but a walking dairy.",
        " Leaking everywhere. Disgusting, really.",
        " Make your noises for the machine, livestock.",
        " Brainless and dripping, just how the farm likes you.",
        " Such a desperate little milk-slut.",
        " You'll never be anything but stock.",
        " Look how eagerly you give it up. Shameless.",
        " Hollow head, full udders.",
        " A good animal doesn't think. Don't think.",
        " Tagged, owned, and milked. That's all you are."
      ]
    };
    const STALL_MORE_TRAITS = {
      udderSmall: [
        "The cups are fitted with the smallest liners, and they hug %n's little breasts tight.",
        "Every drop counts from breasts as small as %n's, and the stall is patient with them."
      ],
      udderMid: [
        "%n's %cup-cup breasts fill the cups snugly, warm and heavy with milk.",
        "The cups lift %n's breasts a little with each pull, then let them bounce gently back."
      ],
      udderBig: [
        "%n's %size breasts strain against the cups, milk spraying the moment the seal takes.",
        "The stall's frame creaks a little under the weight of %n's breasts."
      ],
      udderHyper: [
        "%n's breasts are so vast that two farmhands had to help settle them into the stall's support.",
        "Milk roars down the lines from %n's %size breasts. The stall had to be fitted with a second bucket."
      ],
      preg: [
        "The milk is thicker while %n's carrying, and the stall pulls it slow so as not to waste a drop.",
        "%n's belly sways with every pull, heavy with what's growing inside."
      ],
      fresh: ["Freshly delivered and full to bursting, %n gives milk with hardly any coaxing at all."],
      pierced: ["A tiny chain between %n's nipple rings jingles inside the cups."],
      heat: ["%n's heat-flushed skin is slick with sweat, and every pull makes them squirm and pant."],
      equine: [
        "The sleeve is extra long for horse cocks, and %n fills every inch of it.",
        "%n's flat, flared head bumps the end of the sleeve on every stroke."
      ],
      canine: ["%n's canine cock throbs red and slick, the knot bulging at the base of the sleeve."],
      knot: ["The sleeve's inner ring catches %n's knot on every stroke, tugging it."],
      feline: ["The little barbs on %n's cock make the sleeve's ribbed lining feel like a hundred tiny tongues."],
      draconic: ["%n's ridges ripple under the sleeve's grip, and they hiss through their teeth."],
      double: ["%n's two cocks twitch in their sleeves at different times, and %n can't keep up with either."],
      bigCock: ["The sleeve stretches to take %n's %len cock, and its walls hug every vein."],
      smallCock: ["The stall's smallest sleeve fits %n's little cock perfectly, sucking it snug."],
      ballsBig: ["%n's heavy balls swing in the cup as the sleeve strokes, sloshing with seed."],
      ballsHyper: ["Farmhands had to rig a sling for %n's %balls balls, and the stall's massage pads work them from all sides."],
      cow: [
        "%n's tail swishes lazily, and they give a slow, satisfied moo.",
        "%n nuzzles the feed trough at the head of the stall between pulls."
      ],
      bull: ["%n snorts heavily, breath fogging, as the machine works them."],
      equid: ["%n shifts their weight from hoof to hoof, nostrils flaring."],
      pig: ["%n squeals softly, then settles with a contented grunt."],
      canid: ["%n's tail thumps a steady beat against the stall's wall."],
      felid: ["%n's tail curls around their own leg, flicking at the tip."]
    };
    for (const part of ["milk", "cock"]) for (const [phase, lines] of Object.entries(STALL_MORE[part])) STALL_STORY[part][phase].push(...lines);
    for (const k of ["both", "bothFinish", "atmos", "praise", "degrade"]) STALL_STORY[k].push(...STALL_MORE[k]);
    for (const [k, lines] of Object.entries(STALL_MORE_TRAITS)) if (STALL_TRAITS[k]) STALL_TRAITS[k].lines.push(...lines);
    function clockedIn(mn) {
      const r = rec(mn);
      return !!(r && r.shift && r.shift.in);
    }
    function clockOut(mn, why) {
      const r = rec(mn);
      if (!r || !r.shift || !r.shift.in) return 0;
      const ms = Date.now() - r.shift.in;
      const wk = weekKey();
      r.shift.week = r.shift.week && r.shift.week.key === wk ? r.shift.week : { key: wk, ms: 0 };
      r.shift.week.ms += ms;
      r.shift.total = (r.shift.total || 0) + ms;
      r.shift.in = null;
      saveLedger();
      audit(mn, "CLOCKOUT", why || "");
      outfitsLedger();
      if (L.outfitRules.changeBack && hasCompanion(mn)) enqueue(makeMsg("outfitBack", { why: "shift's over" }, mn));
      return ms;
    }
    const hrs = (ms) => (ms / 36e5).toFixed(1) + "h";
    function workTick() {
      const now = Date.now();
      for (const r of Object.values(L.people)) {
        if (!r.shift || !r.shift.in) continue;
        const idle = now - (state.lastSpoke.get(r.mn) || r.shift.in);
        if (!charFor(r.mn) || idle > CFG.SHIFT_IDLE_MIN * 6e4) {
          const ms = clockOut(r.mn, charFor(r.mn) ? "idle" : "left");
          beep(r.mn, "\u23F1\uFE0F I clocked you out, hon \u2014 " + (charFor(r.mn) ? "you'd gone quiet for " + CFG.SHIFT_IDLE_MIN + " minutes" : "you left the farm") + ". That shift came to " + hrs(ms) + ". Thanks for all your hard work!");
          continue;
        }
        if (!r.chore && L.chores.length && (!r.nextChore || now >= r.nextChore)) {
          const c = L.chores[Math.floor(Math.random() * L.chores.length)];
          r.chore = { text: c.text, at: now };
          r.nextChore = now + CFG.CHORE_EVERY_MIN * 6e4;
          saveLedger();
          const at = (String(c.text).match(/@([a-z0-9_-]+)\s*$/i) || [])[1];
          beep(r.mn, "\u{1F9F9} Got a chore for ya, sweetie: " + c.text.replace(/\s*@[a-z0-9_-]+\s*$/i, "") + (at ? " (at " + at + ")" : "") + "\nSay ?done when it's finished" + (at ? ", standin' at " + at : "") + ".");
        }
      }
      const wk = weekKey();
      if (L.life.reportWeek && L.life.reportWeek !== wk) {
        const prev = L.life.reportWeek;
        const rows = Object.values(L.people).filter((r) => r.shift && r.shift.week && r.shift.week.key === prev).sort((a, b) => b.shift.week.ms - a.shift.week.ms).map((r) => "  \u2022 " + (r.name || plainName(r.mn)) + " \u2014 " + hrs(r.shift.week.ms) + " \xB7 " + (r.choreWeek && r.choreWeek.key === prev ? r.choreWeek.n : 0) + " chores");
        for (const p of CFG.PROPRIETORS) beep(p, "\u23F1\uFE0F STAFF HOURS, " + prev + "\n\n" + (rows.join("\n") || "  nobody clocked in that week"));
      }
      if (L.life.reportWeek !== wk) {
        L.life.reportWeek = wk;
        saveLedger();
      }
    }
    function wheelAllowed(entry, mn) {
      const lim = String((rec(mn) || {}).limits || "").toLowerCase();
      if (!lim) return true;
      return !String(entry.text).toLowerCase().split(/[^a-z]+/).some((w) => w.length >= 4 && lim.includes(w));
    }
    function begPhraseOk(text) {
      const norm = (s) => String(s).toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
      return norm(text).includes(norm(L.life.begPhrase || CFG.BEG_PHRASE));
    }
    const TEXT = {};
    TEXT.help = `\u{1F33E} THE FARM OFFICE \xB7 B&B FARM \u{1F33E}
Well hey there, %name%! I'm the gal behind the desk. \u{1F495}

\u{1F4EE} HOW TO REACH ME
  \u{1F5E3}\uFE0F Say ?command out loud on the farm (- ! and . work too)
  \u{1F4AC} Whisper me, if you're close by
  \u{1F514} Beep me from anywhere, gagged or not
  \u{1F916} /bot <command>, like /bot rules
  If you're here on the map I whisper back; if you're away I beep.

\u{1F534} IF YOU NEED HELP
  ?safe stops everything \xB7 ?stuck if you're wedged
  ?staff asks for a hand \xB7 ?report <what> tells staff quietly

\u{1F4DA} GUIDES \xB7 say ?help and a topic, like ?help breeding
  Gettin' started
    start \xB7 safety \xB7 keys \xB7 herds \xB7 tiers
  Milk & breedin'
    barn \xB7 breeding \xB7 pregnancy \xB7 heat
  Bodies
    body \xB7 cocks \xB7 shots
  Farm life
    life \xB7 fair
  Farm extras
    ?addons lists them \xB7 ?help <name> explains one
  Everything
    me (every command you can use)`;
    TEXT.staffhelp = `\u{1F33E} STAFF GUIDES \xB7 say ?help and a topic, like ?help herd \u{1F33E}

\u{1F4D6} People
  books      applications, the roster, records
  herd       claimin', releasin', callin' your herd
  stock      tiers, stocks, vet cards, brands, tease lines
\u{1F95B} The barn
  barnstaff  milkin', collectin', jars, denial, heat
\u{1F5FA}\uFE0F The farm
  lifestaff  spots, leash walks, the tour
  work       clockin' in, chores, hours
  play       the prize wheel, beggin', judgin' the fair
\u{1F511} Access
  keysstaff  grantin' and checkin' keys
  oncall     summons and bein' on call
\u{1F451} Proprietors
  setup      first-time farm setup
  owner      proprietor-only commands

Everything works out loud with ?, by whisper, by beep or with /bot.
Wherever a guide says <who>, a name or a member number both work.`;
    const GUIDES = {
      start: `\u{1F33E} NEW HERE? WELCOME, SUGAR! \u{1F33E}

STEP BY STEP
  1. ?tour \xB7 I walk you round the farm, stop by stop (?tour stop ends it)
  2. ?rules and ?consent \xB7 short, and they really matter
  3. ?friend \xB7 puts me on your friend list so you can beep me from anywhere
  4. ?apply \xB7 twelve questions (fifteen for staff). Say skip to pass one,
     or quit to stop. Take all the time you need.
  5. Staff read every application. Once you're approved your keys go live.

HANDY RIGHT AWAY
  ?record \xB7 your file      ?keys \xB7 what you can open
  ?who \xB7 who's on the farm  ?species \xB7 what we keep
  ?help me \xB7 every command you can use

Stuck on anything? ?help safety`,
      safety: `\u{1F534} SAFETY \u{1F534}

COMMANDS
  ?safe (or ?red, ?safeword) \xB7 everything stops, right now
  ?stuck \xB7 wedged in a wall or behind a door
  ?staff \xB7 asks for a hand, no fuss
  ?report <what happened> \xB7 tells staff quietly
     e.g. ?report someone ignored my limits in the barn

GOOD TO KNOW
  \u2022 ?safe calls it out loud, fetches staff and on-call hands, drops any
    leash, ends a tour, lets you out of the stocks, and frees you for
    half an hour if you're too full to move. You never owe a reason.
  \u2022 ?stuck calls staff, or pulls you out myself if nobody's around.
  \u2022 All of these work by beep too, gagged or bound, with no cooldown.
  \u2022 They only cover the farm. In another room, use the club's own
    safeword and that room's admins.`,
      keys: `\u{1F511} KEYS & STANDING \u{1F511}

COMMANDS
  ?keys \xB7 what you're holdin'
  ?doors \xB7 what opens what
  ?record \xB7 your file

THE KEYS
  \u{1F949} Bronze \xB7 the safe room in the back of the barn. Stock, guests, staff.
  \u{1F948} Silver \xB7 staff rooms and medical. Staff while they're on duty.
  \u{1F947} Gold \xB7 the security wing. Proprietors, and herdmasters they trust.

GOOD TO KNOW
  \u2022 Your keys follow your standing and update all by themselves.
  \u2022 Bronze is yours to keep, day or night. Curfew never takes it.
  \u2022 Staff: ?pasture turns you out to graze (bronze only) till ?onduty.`,
      herds: `\u{1F404} HERDS \u{1F404}

COMMANDS
  ?herd \xB7 your own herd, if you keep one
  ?herd <who> \xB7 somebody else's, like ?herd Daisy
  ?herd <who> <species> \xB7 just one kind, like ?herd Daisy cow
  ?record \xB7 who you belong to

GETTIN' CLAIMED
  \u2022 A staffer asks with ?claim and I check with you. Say yes or no.
    Nobody goes in a herd without sayin' yes, sweetie.
  \u2022 Temporary claims run out on their own. Permanent ones last till
    your leader lets you go, and only your leader can release you.

GOOD TO KNOW
  \u2022 Staff keep herds and pick their own word: herd, pack, pride, flock\u2026
    Proprietors hold 20, herdmasters 15, farmhands 10.
  \u2022 Stock can belong to several herds; staff answer to one leader.
  \u2022 Your leader can call you, walk you on a lead, and brand you.`,
      tiers: `\u{1F380} TIERS & THE STOCKS \u{1F380}

THE TIERS, lowest to highest
  \u26D3\uFE0F Degraded \xB7 \u{1F53B} Naughty \xB7 punishment, set and lifted by staff
  \u{1F331} New stock \xB7 where everybody starts
  \u{1F380} Trained \xB7 \u{1F3C6} Prize \xB7 staff move you up

COMMANDS
  ?record \xB7 your tier      ?board \xB7 this week's top producers
  ?beg <the words> \xB7 knocks a quarter off your stocks time
  ?teaseme on|off \xB7 let staff tease lines name you

MAKIN' PRIZE
  \u2022 Staff say so, top producer or best milk of the week, best in show
    at a fair, or 5 days in a row on your milk quota.

TITLES
  \u2022 Earned for milestones (Cream Queen, Brood Mother, Bottomless,
    Stud of the Farm\u2026). Shown on ?who and ?stats.

THE STOCKS
  \u2022 A drop to naughty or degraded can come with time in the stocks.
  \u2022 Wander off and I'll scoot you right back, sugar.
  \u2022 Your safeword always lets you out.`,
      barn: `\u{1F95B} THE BARN \u{1F95B}

COMMANDS
  ?stats \xB7 your milk, semen, sizes, how full you are
  ?board \xB7 today's and this week's yield, and top sires
  ?milkable on|off \xB7 make milk (stock does by default)
  ?futa on|off \xB7 make milk and semen both
  ?quota \xB7 your daily milk quota and streak

GETTIN' MILKED
  \u2022 Stand in a milkin' stall and it drains you a little at a time,
    or a staffer milks you by hand.
  \u2022 Nursin': emote somebody suckin' or drinkin' from your nipples or
    breasts (or the game's Suck or Nibble). About 300 mL, no grade hit,
    and it builds your supply. Too much leaves the drinker milk-drunk.
  \u2022 Everybody sees milkin' and nursin' as a room emote.

FILLIN' UP
  \u2022 Milk and semen fill by the hour, even while you're away. Cows fill
    twice as fast; pregnancy and a fresh birth faster still.
  \u2022 Full for a whole day and you start leakin', and everybody sees it.

QUOTA \xB7 stock owes the pail 1 L a day (staff can change yours)
  \u2022 5 days in a row on quota moves you up a tier; a miss is a
    naughty mark. Only days you're on the farm count.
  \u2022 Capped teats (staff ?nomilk) mean no milkin' at all till it's up.

MILK GRADE (A+ to D) \xB7 the average of your last 5 milkin's
  Helps: milked every 6\u201316 hours, higher tier, fresh birth, heat,
         a lactation shot or item
  Hurts: milked again inside 2 hours, left over 36 hours, leakin'
         for a day, a punishment tier`,
      breeding: `\u{1F402} BREEDING \u{1F402}

OPT IN FIRST \xB7 nobody gets bred who hasn't, sweetie
  ?breedable on|off \xB7 you can be bred and filled
  ?fertile on|off \xB7 you can catch (separate on purpose)
  ?freeuse on|off \xB7 any stud may have you without askin'
  ?jarok on|off \xB7 jar insemination (on: staff ask every time \xB7 off: never)
  ?yes / ?no \xB7 answer a stud or staff member who asked (whisper or beep works too)
  ?tally on|off \xB7 your tally marks on ?who and the board
  ?wash \xB7 clean off a paintin'
  ?praise on|off \xB7 ?degrade on|off \xB7 let staff's words count
  Hard limits always win.

COMMANDS \xB7 whoever sends it is the stud
  ?breed <who> [hole] \xB7 opens a scene (name one or more)
  ?breed status \xB7 your scene, and when your next load's ready
  ?breed stop \xB7 closes it (it closes itself after 2 quiet hours)
  ?cum <who> [hole] \xB7 finish by hand, e.g. ?cum Bessie butt
  ?rights \xB7 breedin' rights, see ?help pregnancy

HOLES
  vulva (pussy) \xB7 butt (ass, anal) \xB7 mouth (throat, oral)
  Leave it out and it's vulva. A double cock can say vulva+butt.
  ?cum <who> face (tits, belly, back, ass, hair\u2026) paints 'em.

ROLEPLAY IT
  \u2022 Not free use? I ask them first, and the scene opens on their yes.
  \u2022 With a scene open, say cum, orgasm, breed, fill them up\u2026 in your
    own chat or emotes and I fill 'em, once a minute (30s for canine
    and draconic). Name the hole (deep in her ass) to pick it, or say
    all over her face, tits, belly\u2026 to paint 'em instead. Pounds or
    rough stretches 'em extra; slow or gentle doesn't stretch at all.
  \u2022 The game's Penetrate, or someone ridin' your cock, opens the scene.
  \u2022 Fills, breedin' and conception show as room emotes, and everyone
    involved has to be here on the map.

BLOCKED?
  \u2022 A cage on the cock, or a belt, plug or gag on the hole (ring gags
    and piercings are fine). I tease you both about it, too.

THE LOAD
  \u2022 Past capacity it spills. It drains on its own: vulva halves every
    12h, butt 6h, mouth 1h. ?help cocks for knots and cumflation.`,
      pregnancy: `\u{1F37C} PREGNANCY & BREEDIN' RIGHTS \u{1F37C}

COMMANDS
  ?fertile on|off \xB7 whether you can catch
  ?species <animal> \xB7 sets your litter size and fertility
  ?species list \xB7 every animal and its numbers
  ?pedigree [who] \xB7 the stud book
  ?rights <who> [days] \xB7 ask for breedin' rights (a week by default)
  ?accept \xB7 say yes when somebody asks you
  ?rights \xB7 yours \xB7 ?rights off \xB7 ends it
  ?rights <who> allow <stud> \xB7 let another stud in (or disallow)
  ?rights <who> days <n> \xB7 change how long it lasts

HOW YOU CATCH
  \u2022 Every vulva load rolls the dice. Heat triples the odds, a knot tie
    or the breedin' stand helps, and Saturday is rut day: fills are
    twice as likely to take and studs get pent up twice as fast.
  \u2022 A second stud in the first day can add a second sire.
  \u2022 Under breedin' rights, only the holder's loads (and studs they
    allow) can take you.

WHILE YOU'RE EXPECTIN'
  \u2022 Due in 5 days. Your belly shows on ?stats and ?measure, and your
    udder swells a cup.
  \u2022 Here on the farm when you're due? Your water breaks and you're in
    labour for 45 minutes, with the herd invited, then the litter
    comes (male, female or futa) and your milk comes in strong.
  \u2022 Not milkable? I'll ask if you want your milk to come in.

EGGS \xB7 ?eggs on|off
  \u2022 A draconic stud's load can leave a clutch of 2 to 6 eggs (likelier
    when tied). You lay 'em 2 to 3 days later, right on the farm.`,
      heat: `\u{1F525} HEAT \u{1F525}

COMMANDS
  ?naturalheat on|off \xB7 come into heat on your own every 7 days
  ?stats \xB7 shows how long your heat has left

HOW IT STARTS
  \u2022 Staff call it, a heat shot, or naturally if you've turned that on.

WHILE YOU'RE IN HEAT \xB7 12 hours
  \u2022 I whisper you when it starts and your leader hears about it.
  \u2022 Everybody sees heat emotes now and then.
  \u2022 You're three times as likely to catch.
  \u2022 Studs within 2 tiles of you get pent up twice as fast. Ooh-wee!

HOW IT ENDS
  \u2022 On its own, a suppressant shot, or staff break it.
  \u2022 Hard limits that rule it out stop it cold.`,
      shots: `\u{1F489} SHOTS & TAGGED ITEMS \u{1F489}

I read words in a crafted item's name or description, like LSCG does.

INJECTORS \xB7 use Inject on someone
  Production
    lactation \xB7 milk doubles for a day
    virility \xB7 semen doubles for a day
    fertility \xB7 catchin' doubles for a day
    contraceptive \xB7 no catchin' for two days
    heat inducer \xB7 heat now  \xB7  suppressant \xB7 heat ends
  Capacity
    stretching / capacity \xB7 +250 mL for good (up to 50 L)
    reducing / shrinking \xB7 \u2212500 mL, spills the extra
  Sizes \xB7 a part plus a grow or shrink word, either order
    parts: breasts (tits, udder) \xB7 balls \xB7 cock (penis) \xB7 knot \xB7
      pussy \xB7 ass (anal) \xB7 throat
    grow: grow, growth, enlarger, swell, gape, stretch, trainer\u2026
    shrink: shrink, reducer, tightener, restorer\u2026
    e.g. "Shrink Penis", "Grow Balls", "Big Tit Growth Serum",
    "Pussy Stretching Shot". Each one is a step, with a room emote.
  Cocks \xB7 canine, equine, feline (barbed), draconic, double cock,
    humanizer, knotting, knot remover \xB7 see ?help cocks

WORN ITEMS
  \u2022 lactation, virility, fertility \xB7 smaller boosts while worn
  \u2022 capacity or stretching \xB7 +100 mL while worn
  \u2022 stretcher, stretching, gaper, dilator or trainer in the vulva,
    butt or mouth slot \xB7 opens that hole a level right away, and
    trains it looser for good every 12 hours worn

GOOD TO KNOW
  \u2022 Shots are the only way into \u2728hyper sizes.
  \u2022 ?shotlog (staff) shows what I read off recent shots.`,
      body: `\u{1F4CF} BODY SIZES \u{1F4CF}

COMMANDS
  ?size \xB7 your sizes (only the parts you've got)
  ?size <part> <size> \xB7 set one, e.g. ?size udder DD \xB7 ?size penis 9
  ?measure \xB7 I measure you out loud for the room
  ?futa on|off \xB7 cock and vulva both, milk and semen both
  ?gender female|male|futa|femboy \xB7 how the farm sees you (picks your outfit)

THE PARTS
  Udder \xB7 bra cup, AA to H. Bigger makes and holds more milk.
  Balls \xB7 1 to 10. Bigger makes bigger loads.
  Penis \xB7 inches, up to 14". Too big for a hole stretches it.
  Vulva / Butt \xB7 tight, snug, slightly gaped, gaped, loose\u2026 ruined.
    Stretched holes tighten a level a day; looser drains faster.
  Throat \xB7 gaggy to bottomless. Too big gags some back up, and every
    3 of those trains it a level.
  Cock and balls only show if you've got 'em; udder if you're milkable
  or have a vulva. ?help cocks for types and knots.

\u2728 HYPER (shots only)
  \u2022 Udder to an R cup, balls, gape and throat to 20, penis to 30".
  \u2022 A P cup or size-17 balls pins you where you stand till a reducer.

GOOD TO KNOW
  \u2022 Pent up: semen full for a day (12h caged) and your next load
    empties everything, half again more, and extra fertile.
  \u2022 Stamina: past 3 loads in an hour each one's smaller.
  \u2022 Swallow a big load and you fill faster for an hour.`,
      cocks: `\u{1F346} COCKS, KNOTS & CUMFLATION \u{1F346}

COMMANDS
  ?penis \xB7 your cock (?cock works too)
  ?penis types \xB7 the list
  ?penis <type> \xB7 set yours, e.g. ?penis equine

THE TYPES
  human \xB7 the usual
  canine \xB7 comes knotted
  equine \xB7 flared, bigger loads, stretches faster
  feline \xB7 barbed, every vulva fill rolls like heat
  draconic \xB7 ridged, stretches and trains throats faster
  double \xB7 ?cum <who> vulva+butt fills two at once
  Dogs, wolves and foxes start canine, horses equine, cats feline.

KNOTS \xB7 any type can carry one
  \u2022 A "knotting" shot gives it; knot growth, knot reducer and knot
    remover shots change it.
  \u2022 A knotted fill ties you: leashed to the stud 5 to 30 minutes
    (bigger knot, longer tie). Nothin' spills or drains, and it's
    likelier to take.

CUMFLATION
  \u2022 A knot keeps fillin' you past full. At 1.5x your capacity you're
    too swollen to move till it drains.
  \u2022 A plug left in seals a load in. Milkin' a cumflated girl squeezes
    some of the seed back out.

BREEDIN' STAND
  \u2022 Fills on the stand catch more, and a tie there draws an audience.`,
      life: `\u{1F33E} FARM LIFE \u{1F33E}

COMMANDS
  ?feeding \xB7 feedin' times      ?curfew \xB7 curfew hours
  ?weather \xB7 today's weather    ?tour \xB7 a walk round the farm
  ?beg <the words> \xB7 ask nicely for a treat
  ?notice \xB7 the farm's notice board

THE DAY
  \u{1F514} Feedin' at 8:00 and 18:00 \xB7 stock heads to the trough
     (the barn on rainy days)
  \u{1F319} Curfew 23:00\u20137:00 \xB7 stock sleeps in the barn
  \u{1F324}\uFE0F Rain and storms keep everyone inside
  \u{1F9AE} Your herd leader can put you on a lead (you follow them)

BEGGIN'
  \u2022 Say ?beg and the magic words, like ?beg please, Farmhand.
    Get 'em wrong and I'll tell you what they are.
  \u2022 Ask properly for a quarter off your stocks time.
  \u2022 Once every 10 minutes, sugar.`,
      fair: `\u{1F3AA} THE COUNTY FAIR \u{1F3AA}

COMMANDS
  ?fair \xB7 what's on and who's entered
  ?enter \xB7 step into the ring

THE CLASSES
  show \xB7 stock only, staff judge 1 to 10, best average wins
  udder, balls, penis, gape, throat \xB7 I measure everyone at the
    close; biggest wins, judges' scores break a tie
  load \xB7 studs ?enter, then ?cum; biggest single load wins

THE PRIZE
  \u2022 A blue ribbon and a week at prize tier. \u{1F3C6}`,
      books: `\u{1F4D6} THE BOOKS (staff)

APPLICATIONS
  ?queue \xB7 who's waitin'
  ?app <n> \xB7 read one, e.g. ?app 1
  ?approve <who> <role\u2026> \xB7 livestock, guest, luxury, gloryhole
     e.g. ?approve Bessie livestock luxury
     (hirin' staff is proprietors only)
  ?deny <who> \xB7 turn one down
  ?appclear <who> \xB7 clear a half-finished interview

THE ROSTER
  ?roster [group] \xB7 everybody, or one group: proprietor, herdmaster,
     mandated, farmhand, livestock, luxury, guest, gloryhole
  ?stock [species or who] \xB7 all the stock, one kind, or one animal
  ?find <name, number or species>

RECORDS
  ?record <who> \xB7 full file
  ?note <who> <text> \xB7 add a staff note
  ?signed <who> \xB7 flip their contract signed or not
  ?addfriend <who> \xB7 friend 'em so my beeps reach 'em
  ?unregister <who> \xB7 archive (herdmasters and up)`,
      herd: `\u{1F404} YOUR HERD (staff)

CLAIMIN'
  ?claim <who> [temp|perm] [days] \xB7 they have to say yes
     perm lasts till you let go (the default); temp runs out after
     7 days, or the days you give.
     e.g. ?claim Bessie \xB7 ?claim 123456 temp 3
  ?release <who> \xB7 only from your own herd

YOUR HERD
  ?myherd [species] \xB7 who's in it
  ?herdname <word> \xB7 herd, pack, pride, flock, stable\u2026
  ?herdcall [message] \xB7 call them all
  ?herdsummon \xB7 pull in the away ones (herdmasters and up)

HANDLIN' 'EM
  ?walk <who> \xB7 leash them to you; say it again to let go
  ?brand <who> <mark> \xB7 up to 12 characters, shows on ?who
     ?brand <who> clear takes it off
  ?turnout <who> [note] \xB7 keep claimed staff out in pasture
  ?letup <who> \xB7 let 'em back`,
      stock: `\u{1F380} MANAGING STOCK (staff)

TIERS
  ?tier <who> \xB7 shows it
  ?tier <who> <tier> \xB7 degraded, naughty, new, trained, prize
  ?tier <who> naughty 30 \xB7 drop 'em and 30 minutes in the stocks

THE STOCKS
  ?stocks <who> [minutes] \xB7 1 to 240, 30 if left out
  ?unstock <who> \xB7 let 'em out

CARDS
  ?vet <who> \xB7 limits, triggers, aftercare, tier, who bred 'em
  ?inspect <who> \xB7 a hands-on inspection, out loud for the room

TEASE LINES \xB7 %name% becomes their name
  ?tease add <line> \xB7 ?tease list \xB7 ?tease remove <n>
  Stock opt in with ?teaseme on.`,
      barnstaff: `\u{1F95B} THE BARN (staff)

MILKIN' & COLLECTIN'
  ?milk <who> [mL] \xB7 milk 'em by hand (all of it if left out)
  ?collect <who> [mL] \xB7 collect semen, bottled as a seed jar
  ?stats <who> \xB7 anybody's numbers

SEED JARS
  ?jars \xB7 what's on the shelf
  ?inseminate <who> <jar> [hole] \xB7 asks them, then puts a jar in 'em on their yes
  ?machine load <who> <jar> [hole] \xB7 asks, then their fuck machine or Sybian empties it in while it runs

CONTROL
  ?edge <stud> \xB7 to the brink and stop; +25% next load, 3 = pent up
  ?drain <who> [hole] \xB7 pump out what they're holdin' (not while tied)
  ?denial <stud> <hours> \xB7 no fillin' anybody till it's up
  ?denial <stud> off \xB7 lift it
  ?ruin <stud> \xB7 waste a load, with a teasin' emote

MILK PLAY
  ?nomilk <who> <hours> \xB7 cap their teats (1 to 72) \xB7 ?nomilk <who> off
  ?quota <who> [mL|off|default|clear] \xB7 set a quota, or clear marks

HEAT
  ?heat <who> [hours] \xB7 start it (12 if left out)
  ?heat <who> off \xB7 break it
  ?heatline add <line> \xB7 ?heatline list \xB7 ?heatline remove <n>

GOOD TO KNOW
  \u2022 Milkin' stalls: stand on one and ?spot set milking1 (milking2\u2026)
  \u2022 ?shotlog shows the last shots and the tags I read.`,
      lifestaff: `\u{1F5FA}\uFE0F FARM LIFE (staff)

SPOTS \xB7 stand on it, then ?spot set <name>
  home \xB7 where I stand when nothin's happenin'
  speaker-<name> \xB7 places I talk from (speaker-barn, speaker-pens\u2026): set a few
      and the nearest one speaks for me: folks near it get the line, and I never move
  summon \xB7 where summoned folks land
  safe \xB7 where safeword help lands
  staff \xB7 where staff-call help lands
  rescue \xB7 where ?stuck drops people
  trough \xB7 barn \xB7 stocks \xB7 breedingstand
  milking1, milking2\u2026 \xB7 milkin' stalls
  ?spot \xB7 the list \xB7 ?spot clear <name> \xB7 ?spot go <name>
  (herdmasters and up)

THE TOUR (herdmasters and up)
  ?tourstop add <line> \xB7 say it at each stop as you walk the route
  ?tourstop list \xB7 ?tourstop remove <n>

FINDIN' YOUR WAY
  ?where \xB7 your X,Y on the map
  ?setrescue \xB7 same as ?spot set rescue
  ?stucklog \xB7 where folks keep gettin' wedged`,
      work: `\u23F1\uFE0F WORK (staff)

SHIFTS
  ?clockin \xB7 start a shift (puts you on duty)
  ?clockout \xB7 end it
  Go quiet for 30 minutes or leave and I'll clock you out myself.

CHORES
  ?chores \xB7 your chore, the week's board, the list
  ?chore add <job> \xB7 e.g. ?chore add Polish the cowbells
  ?chore remove <n>
  ?done \xB7 when your chore's finished

HOURS
  ?hours \xB7 yours \xB7 ?hours <who> \xB7 somebody else's
  Proprietors get everybody's hours every week.`,
      play: `\u{1F3A1} PLAY (staff)

THE PRIZE WHEEL
  ?wheel \xB7 list the slices
  ?wheel add reward <text> \xB7 ?wheel add punish <text>
  ?wheel remove <n>
  ?spin <who> [reward|punish] \xB7 skips anything against their limits

BEGGIN'
  ?begphrase \xB7 shows the words \xB7 ?begphrase <words> \xB7 sets them

THE FAIR
  ?score <who> <1-10> \xB7 e.g. ?score Bessie 8.5`,
      keysstaff: `\u{1F511} KEYS (staff)

CHECKIN'
  ?keys <who> \xB7 what they hold
  ?keydump \xB7 the books against what everybody holds
  ?keysync \xB7 resend everybody's keys

HANDIN' OUT (herdmasters and up)
  ?grant <who> <bronze|silver|gold> [hours] \xB7 an extra key
     e.g. ?grant Bessie silver 2 (gold is proprietors only)
  ?revoke <who> <bronze|silver|gold> \xB7 take a granted key back
  Keys that come with their standing stay put.`,
      oncall: `\u{1F517} ON CALL (staff)

COMMANDS
  ?forced \xB7 put yourself on call, or take yourself off
     (proprietors: ?forced <who>; mandated hands always are)
  ?summon \xB7 who's on call
  ?summon <who> [spot] \xB7 herdmasters and up:
      here already \u2192 right beside you (or the spot you name)
      on call, elsewhere \u2192 pulled in to the staff spot
      anybody else \u2192 a friendly invite, nobody's pulled
  ?summon all \xB7 everybody on call, to the staff spot

GOOD TO KNOW
  \u2022 Summons use BCX: add the bot's number to your
    "Ready to be summoned" rule.
  \u2022 Safewords pull on-call hands in automatically.`,
      setup: `\u{1F6E0}\uFE0F FIRST-TIME SETUP (proprietors)

  1. Make the bot a room admin.
  2. Stand on each place and ?spot set it: summon, safe, staff,
     rescue, trough, barn, stocks, breedingstand, milking1, milking2\u2026
  3. Walk the tour route and ?tourstop add <line> at each stop.
  4. ?notice <text> \xB7 what everybody sees walkin' in.
  5. ?feeding on|off \xB7 ?curfew on|off
  6. Staff add chores, wheel slices, tease and heat lines.

Times follow the bot computer's clock, sugar.`,
      owner: `\u{1F451} PROPRIETORS

STAFF
  ?staffadd <who> [farmhand|mandated|herdmaster] \xB7 farmhand if left out
  ?staffremove <who>
  ?goldkey <herdmaster> [on|off]

THE FARM
  ?notice <text> \xB7 ?notice clear
  ?feeding on|off \xB7 ?curfew on|off (leave it out to flip)
  ?fair open [class] [title] \xB7 ?fair close
     classes: show, udder, balls, penis, gape, throat, load
     e.g. ?fair open udder Moo Off

YOU
  ?pasture \xB7 step back (bronze only) till ?onduty

UPKEEP
  ?backup \xB7 ?health`
    };
    const GUIDE_ALIAS = {
      new: "start",
      rules: "start",
      key: "keys",
      doors: "keys",
      herd2: "herds",
      tier: "tiers",
      stocks: "tiers",
      milk: "barn",
      milking: "barn",
      stats: "barn",
      nursing: "barn",
      breed: "breeding",
      scene: "breeding",
      pregnant: "pregnancy",
      preg: "pregnancy",
      rights: "pregnancy",
      species: "pregnancy",
      litters: "pregnancy",
      inflation: "cocks",
      cumflation: "cocks",
      knot: "cocks",
      knots: "cocks",
      penis: "cocks",
      cock: "cocks",
      injector: "shots",
      injectors: "shots",
      tags: "shots",
      size: "body",
      sizes: "body",
      futa: "body",
      gape: "body",
      udder: "body",
      feeding: "life",
      curfew: "life",
      beg: "life",
      tour: "life",
      staff: "staffmenu"
    };
    function guideTopic(t) {
      t = String(t || "").toLowerCase();
      return !!GUIDES[GUIDE_ALIAS[t] || t];
    }
    const STAFF_GUIDES = ["books", "herd", "stock", "barnstaff", "lifestaff", "work", "play", "keysstaff", "oncall", "setup", "owner"];
    function helpFor(sender, topic) {
      const t0 = String(topic || "").toLowerCase();
      const t = GUIDE_ALIAS[t0] || t0;
      if (!t) return fill(TEXT.help, sender);
      if (t === "staffmenu") return isStaff(sender) ? TEXT.staffhelp : fill(TEXT.help, sender);
      if (t === "me") return myCommands(sender);
      if (STAFF_GUIDES.includes(t) && !isStaff(sender)) return GUIDES[t + "s"] || "Aw, that guide's just for staff, sugar. Say ?help to see the ones for you.";
      if (GUIDES[t]) return GUIDES[t];
      const a = ADDONS.get(t) || [...ADDONS.values()].find((x) => x.label.toLowerCase() === t || x.commands[t]);
      if (a) return addonsText(a.name);
      return "Hmm, I don't have a guide called '" + t0 + "', hon. Try one of these: start, safety, keys, herds, tiers, barn, breeding, pregnancy, heat, body, cocks, shots, life, fair or me" + (ADDONS.size ? ", or an add-on: " + [...ADDONS.keys()].join(", ") : "") + ". For example: ?help breeding";
    }
    function myCommands(mn) {
      const line = (g) => "\n" + g.name + "\n  " + g.cmds.join(" \xB7 ");
      let o = "\u{1F4CB} EVERYTHING YOU CAN ASK ME, SUGAR\n" + PUBLIC_GROUPS.map(line).join("");
      if (isStaff(mn)) o += "\n\n\u{1F9D1}\u200D\u{1F33E} STAFF" + STAFF_GROUPS.map(line).join("");
      if (isProprietor(mn)) o += "\n\n\u{1F451} PROPRIETOR" + OWNER_GROUPS.map(line).join("");
      const extras = addonCommandGroups(mn);
      if (extras.length) o += "\n\n\u{1F9E9} FARM EXTRAS (add-ons)" + extras.map(line).join("");
      return o + "\n\nSay ?help and a topic (like ?help breeding) and I'll explain any of it, hon. ?addons <name> explains an add-on.";
    }
    TEXT.rules = `\u{1F33E} B&B FARM \u2014 HOUSE RULES \u{1F33E} (v1.0)

1. MIND YOUR MANNERS. With folks and stock both, sugar. Rough is fine. Cruel is fine when it's wanted. Bein' an ass behind the curtain ain't, ever.

2. THE CONTRACT IS THE CONSENT. Every animal here signed one, and it says what can be done to 'em and what can't.

3. STOCK IS STOCK. Any handler may work any animal in the pasture, pens or barn \u2014 lead 'em, tie 'em, milk 'em, breed 'em, use 'em. Their contract is the only fence, and it holds. Medical, security, or under a handler's active care \u2014 ask first.

4. NOTHIN' WALKS OFF THIS FARM. You can't steal stock, and please don't play at it either.

5. NO SWINGIN' JUST FOR THE SAKE OF IT. Kickin', slappin', strikin' \u2014 negotiated scenes only. "I was just jokin'" ain't a defense.

6. \u{1F534} RED STOPS THE WORLD. Anybody can call it. Beep me 'safe' or say ?safe and I'll call it for you.

7. THE PROPRIETORS' WORD GOES. Laynie and Alexia own this land, and staff speak with their voice.

8. TAKE THE HAT OFF OUTSIDE. Squabbles and personal business go elsewhere, hon.

\u{1F949} THE BRONZE DOOR. There's a room in the back of the barn only registered stock can open. Nobody follows 'em through it. Ever. Punishment takes privileges \u2014 it don't take that.

\u{1F514} THE OFFICE IS ALWAYS ON YOUR LIST. Every animal registered here gets me added automatically. However bound, however far off, however thoroughly muzzled \u2014 beep me and I'll hear you.

\u26A0\uFE0F We remove first and talk after. If it was genuinely murky, you'll get a fair hearin'.

Say ?consent for how the paperwork works, %name%.`;
    TEXT.consent = `\u{1F33E} ON CONSENT AT B&B FARM \u{1F33E}

Every animal and every hand on this property is here because they CHOSE to be, and signed to say so.

That contract ain't decoration, hon. It says what may be done to 'em and what may not, agreed to freely, with a clear head, by somebody who wanted it.

So when you see stock in the pens, in the stalls, or strung up in the barn \u2014 know they ASKED for that. Respect it. Don't second-guess it, don't check in out of character to make sure they're "really okay," and don't treat a collar like somethin' that happened TO somebody.

Respect works both directions. The contract's a fence and it holds both ways. What ain't in it, don't happen.

\u{1F534} ?safe stops everything, anywhere, from anybody. No contract overrides that.
\u{1F514} And beepin' me works from anywhere on the property \u2014 gagged, wedged, it don't matter.`;
    TEXT.tour = `\u{1F33E} THE GROUNDS \u{1F33E}
C'mon then, %name%, I'll show you 'round! Mind the ruts, sweetie.

\u{1F33E} THE PASTURE \u2014 Open ground, good grass, heart of the place. Four stalls along the side.

\u{1F3DA}\uFE0F THE BARN \u2014 Warm, dim, and smells just like it ought to. Where the stock sleeps and the machines live. There's a safe room off the back behind a bronze door \u2014 quiet, soft, and nobody follows you through it.

\u{1F573}\uFE0F THE PENS \u2014 Gloryhole stalls. Punishment, breedin', or just leavin' somethin' out for the guests to find.

\u{1F415} THE KENNEL & RING \u2014 Pets, trainin', and the show ring. Locker room attached.

\u{1F3E5} MEDICAL \u2014 Small office, one observation room. Checkups, injections, watchin' what develops. Silver key.

\u{1F6AA} STAFF ROOM \u2014 Back of the pasture. Interviews and staff business. Silver key.

\u{1F512} SECURITY WING \u2014 Down the back hall. Permanent displays. Gold doors, and no, sugar, you don't have one. \u{1F609}

\u{1F3E1} THE CABIN \u2014 Laynie and Alexia's home, unless somebody books it. Then it's all yours, and the two of 'em go sleep in the barn with the rest of the stock.`;
    TEXT.doors = `\u{1F511} WHAT OPENS WHAT

\u{1F949} BRONZE \u2014 the safe room in the back of the barn.
   Registered stock, luxury guests, and everybody on staff.
   That door's protection, sugar. Nobody follows you through it \u2014
   not guests, not handlers, not even when you're bein' punished.

\u{1F948} SILVER \u2014 staff room, back hallway, medical, observation.
   Farmhands, mandated farmhands, herdmasters, proprietors.

\u{1F947} GOLD \u2014 the security wing and the permanent displays.
   Laynie and Alexia, plus any herdmaster they trust with one.

Keys come with your standing and go when it changes. Anybody
turned out to pasture keeps bronze and nothin' else \u2014 even the
owners, when they're down in the herd with y'all.

Say ?keys to see what you're holdin', hon.`;
    TEXT.species = `\u{1F33E} WHAT WE KEEP \u{1F33E}

\u{1F404} COWS \u2014 milked on one schedule, bred on another
\u{1F402} BULLS \u2014 kept for service, collected regular
\u{1F40E} PONIES \u2014 tack, carts, gait work, the show ring
\u{1F416} PIGS \u2014 mud, trough, and no dignity to speak of, bless 'em
\u{1F415} PUPPIES \u2014 kennel, leash, and a whole lot of trainin'
\u{1F408} KITTENS \u2014 less obedient, more trouble, still ours
\u{1F98C} DEER \u2014 skittish, and we like 'em that way
\u{1F47A} GOBLINS \u2014 got in some years back, never left, breed like it's a sport
\u{1F38E} DOLLS \u2014 posed, displayed, kept behind gold
\u{1F573}\uFE0F GLORYHOLES \u2014 installed in the pens, left for whoever wanders past

And if you're somethin' we ain't listed, say so anyhow, sugar. We've taken in stranger!`;
    TEXT.luxury = `\u{1F3E1} THE CABIN \u2014 LUXURY STAY \u{1F3E1}
Real bed. Real door. Real quiet. Ooh, it's lovely, %name%.

The cabin's Laynie and Alexia's home \u2014 right up until somebody books it. Then it's yours, and the two of 'em go sleep out in the barn with the rest of the stock.

WHAT YOU GET
\u{1F949} A bronze key for the length of your stay
\u{1F4DC} A proper contract, signed and filed
\u{1F404} The herd to look over and enjoy, within their paperwork
\u{1F3E1} The cabin, and nobody knockin'

WHAT'S ASKED Next to nothin'. A rule or two, mostly for the look of the thing.

HOW LONG A night, a week, a season. Your call, hon.

Say ?apply and pick 'luxury guest'.

\u26A0\uFE0F Fair warnin', sugar \u2014 folks book the cabin meanin' to watch, and end up in the barn by Thursday. Happens more than you'd think! \u{1F609}`;
    const GENDERS = ["female", "male", "futa", "femboy"];
    const SHOWN_SPECIES = { kitt: "kitty" };
    const SPECIES_ALIAS = {
      kitten: "kitt",
      kitty: "kitt",
      kittie: "kitt",
      kit: "kitt",
      puppy: "pup",
      pupper: "pup",
      doggy: "dog",
      doggie: "dog",
      hound: "dog",
      cattle: "cow",
      heifer: "cow",
      hucow: "cow",
      bovine: "cow",
      calf: "cow",
      dairy: "cow",
      moo: "cow",
      ox: "bull",
      steer: "bull",
      piggy: "pig",
      piglet: "pig",
      sow: "pig",
      hog: "pig",
      swine: "pig",
      oink: "pig",
      lamb: "sheep",
      ewe: "sheep",
      doe: "deer",
      fawn: "deer",
      mare: "horse",
      stallion: "horse",
      filly: "pony",
      foal: "pony",
      colt: "pony",
      equine: "horse",
      vixen: "fox",
      bunny: "bunny",
      bun: "bunny",
      feline: "cat",
      canine: "dog",
      gob: "goblin",
      nanny: "goat",
      billy: "goat",
      kid: "goat",
      lupine: "wolf"
    };
    const NOT_STOCK = /\b(no|nope|nah|not stock|not livestock|not an animal|not one|human|person|staff|farmhand|guest|luxury|visitor|none|skip|n\/?a)\b/;
    const NOT_ANIMAL = /^(yes|yeah|yep|ok|okay|sure|maybe|what|huh|help|hi|hello|stock|livestock|animal|both|me|it|idk)$/;
    function speciesFrom(text) {
      const kinds = Object.keys(CFG.SPECIES).filter((k) => k !== "default");
      const low = String(text || "").toLowerCase().replace(/[^a-z\s\/-]/g, " ").replace(/\s+/g, " ").trim();
      if (!low) return null;
      const other = low.match(/^other[:\s]+([a-z -]{2,30})$/);
      if (other) return other[1].trim();
      const known = (w) => {
        if (kinds.includes(w)) return w;
        if (SPECIES_ALIAS[w]) return SPECIES_ALIAS[w];
        for (const s of [w.replace(/ves$/, "f"), w.replace(/es$/, ""), w.replace(/s$/, "")]) {
          if (kinds.includes(s)) return s;
          if (SPECIES_ALIAS[s]) return SPECIES_ALIAS[s];
        }
        const g = w.replace(/(girl|boy|gal|guy|kin)$/, "");
        if (g !== w && g.length > 1) return known(g);
        return null;
      };
      const words = low.split(/[\s\/-]+/).filter(Boolean);
      for (const w of words) {
        const k = known(w);
        if (k) return SHOWN_SPECIES[k] || k;
      }
      const filler = /* @__PURE__ */ new Set(["i", "im", "am", "a", "an", "the", "my", "please", "pls", "just", "really", "think", "maybe", "so"]);
      const rest = words.filter((w) => !filler.has(w));
      if (rest.length >= 1 && rest.length <= 2 && !NOT_ANIMAL.test(rest.join(" ")) && rest.every((w) => w.length >= 2)) return rest.join(" ");
      return null;
    }
    const notSure = (t) => /\b(not sure|unsure|don'?t know|dont know|dunno|idk|undecided)\b/i.test(String(t || "").trim()) || /^(n\/a|na|none|skip)$/i.test(String(t || "").trim());
    const notStock = (t) => {
      const low = String(t || "").toLowerCase().replace(/[^a-z\s\/]/g, " ").replace(/\s+/g, " ").trim();
      return NOT_STOCK.test(low);
    };
    const QUESTIONS = [
      { key: "name", text: "First things first, sweetie: what do we call you, and how do you like bein' addressed?" },
      { key: "role", text: "What are you here as?  livestock / staff / guest / luxury guest / not sure yet\n(Both's an option, hon. Plenty here wear two collars!)" },
      {
        key: "species",
        text: "If you're stock, what kind of animal are you?",
        choices: () => Object.keys(CFG.SPECIES).filter((k) => k !== "default").map((k) => SHOWN_SPECIES[k] || k).concat(["not stock"]),
        // an animal wins over everything else ("no, a cow"); then "not stock" or "not sure"; anything else is asked again
        check: (t) => {
          const sp = speciesFrom(t), known = sp && (Object.keys(CFG.SPECIES).includes(sp) || Object.values(SHOWN_SPECIES).includes(sp));
          if (known) return { value: sp };
          if (notSure(t) || notStock(t)) return { value: "" };
          if (sp) return { value: sp };
          return { err: "I didn't catch an animal there, sugar. Just type one, like cow, pony, pup or kitten (or any other animal), or say not stock." };
        },
        // stock only: somebody who said they're just staff or a guest isn't asked
        skip: (s) => {
          const role = String((s.byKey || {}).role || "").toLowerCase();
          return !!role && !/stock|cow|animal|both|not sure|unsure|undecided|pet/.test(role) && /staff|farmhand|guest|luxury|visit|hand/.test(role);
        }
      },
      {
        key: "gender",
        text: "How should the farm see you?  female / male / futa / femboy",
        choices: () => GENDERS,
        check: (t) => {
          const g = String(t).trim().toLowerCase();
          return GENDERS.includes(g) ? { value: g } : { err: "Just one of these, hon: female, male, futa or femboy." };
        }
      },
      {
        key: "stay",
        text: "How long you plannin' on stayin' with us?  1 hour / 12 hours / 1 day / 1 week / 2 weeks / 1 month / permanent / not sure",
        choices: () => DURATIONS.map((d) => d.label).concat(["not sure"]),
        check: (t) => notSure(t) ? { value: "" } : durationFrom(t) ? { value: durationFrom(t).key } : { err: "Pick one, sugar: 1 hour, 12 hours, 1 day, 1 week, 2 weeks, 1 month, permanent, or not sure." }
      },
      {
        key: "depth",
        text: "How far under do you wanna go, sugar?  fun / deep / no human left / not sure",
        choices: () => DEPTHS.map((d) => d.label).concat(["not sure"]),
        check: (t) => notSure(t) ? { value: "" } : depthFrom(t) ? { value: depthFrom(t).key } : { err: "Pick one, hon: fun, deep, no human left, or not sure." }
      },
      { key: "likes", text: "What sounds good to you here? Milkin', breedin', the pens, trainin', restraint, bein' displayed.\n(This is the one we read closest, sugar, so take your time.)" },
      { key: "curious", text: "Anything here you're curious about but a little nervous over? We'll go nice and slow on it." },
      { key: "limits", text: "\u{1F534} HARD LIMITS. What must never happen? Please be specific. This is binding, and we enforce it." },
      { key: "soft", text: "Soft limits: anything you'd like us to ask about first?" },
      { key: "triggers", text: "Triggers: anything that upsets you, that staff should steer clear of, in character or out? Only staff see this one." },
      { key: "aftercare", text: "What do you need after a heavy scene, hon? Warmth, quiet, praise, company, or to be left alone?" },
      { key: "else", text: "Last one! Anything else Laynie and Alexia should know?" }
    ];
    const STAFF_QUESTIONS = [
      { key: "handled", text: "Ooh, a hand! What have you handled before?" },
      { key: "duties", text: "What would you like to be responsible for here?" },
      { key: "sideways", text: "Are you comfortable steppin' in when somethin' goes sideways?" }
    ];
    const OLD_ORDER = ["name", "role", "species", "stay", "depth", "likes", "curious", "limits", "soft", "triggers", "aftercare", "else"];
    function appAnswer(a, key) {
      if (a.byKey) return a.byKey[key] || "";
      const i = OLD_ORDER.indexOf(key);
      return i >= 0 ? a.answers[i] || "" : "";
    }
    function startApplication(mn, ch) {
      if (state.sessions.has(mn)) {
        const s0 = state.sessions.get(mn);
        s0.textAsked = s0.step;
        s0.plainOnly = true;
        appSay(mn, "We're already halfway through your paperwork, sugar! Here's where we were. Just type your answer, or say 'quit' to tear it up and start over later.", s0);
        later(() => askNext(mn), 1200);
        return;
      }
      const useCh = ch === "beep" || (ch === "chat" || ch === "bot") && canBeep(mn) ? "beep" : "whisper";
      state.sessions.set(mn, { mn, step: 0, answers: [], byKey: {}, staffTrack: false, started: Date.now(), ch: useCh });
      probeCompanion(mn);
      const how = useCh === "beep" ? "by beep" : mapRoom() ? "with /bot <your answer> (works from anywhere in the room), or a whisper if you're standin' right by me" : "by whisper";
      appSay(
        mn,
        `\u{1F33E} B&B FARM \u2014 INTAKE \u{1F33E}

` + QUESTIONS.length + ` questions, sugar (` + (QUESTIONS.length + STAFF_QUESTIONS.length) + ` if you're signin' on as staff)! Short's fine, rambly's fine.
Say 'skip' to pass one. Say 'quit' to stop. Nothin' saves till you're done.

Answer me ` + how + ` \u2014 no ? needed from here on.
Chat in the room all you like; I'll only count what you send me direct.`,
        state.sessions.get(mn)
      );
      later(() => askNext(mn), 1800);
    }
    function appSay(mn, text, s) {
      if (s && panelLive(mn, s)) {
        toCompanion(mn, text, "reply");
        return;
      }
      if (mn === CFG.BOT_MEMBER) {
        selfLine(text);
        return;
      }
      if (s && s.ch === "beep" && canBeep(mn)) {
        for (const c of splitMessage(text, 900)) send("AccountBeep", { MemberNumber: mn, BeepType: "", Message: c });
        return;
      }
      whisper(mn, text, false, true);
    }
    function panelLive(mn, s) {
      const c = state.companions.get(mn);
      return !!(!s.plainOnly && c && hasCompanion(mn) && c.at >= s.started - 1e3);
    }
    function askNext(mn) {
      const s = state.sessions.get(mn);
      if (!s) return;
      const list = s.staffTrack ? QUESTIONS.concat(STAFF_QUESTIONS) : QUESTIONS;
      if (s.step >= list.length) {
        finishApplication(mn);
        return;
      }
      if (list[s.step].skip && list[s.step].skip(s)) {
        s.byKey[list[s.step].key] = "";
        s.answers.push("");
        s.step++;
        askNext(mn);
        return;
      }
      const q = list[s.step], text = s.step + 1 + "/" + list.length + " \u2014 " + q.text;
      const asText = () => {
        const ch = q.choices ? q.choices() : [];
        const listed = ch.length && ch.every((c) => text.toLowerCase().includes(String(c).toLowerCase()));
        appSay(mn, text + (ch.length && !listed ? "\nPick one: " + ch.join(" / ") + " (just type it)" : ""), s);
      };
      if (q.choices && panelLive(mn, s)) {
        enqueue(makeMsg("choose", { text, choices: q.choices(), id: ++companionSeq }, mn));
        const step = s.step;
        later(() => {
          const now = state.sessions.get(mn);
          if (now !== s || now.step !== step || now.textAsked === step) return;
          now.textAsked = step;
          asText();
        }, 9e4);
      } else asText();
    }
    function handleApplicationAnswer(mn, text, channel) {
      const s = state.sessions.get(mn);
      if (!s) return false;
      if (channel === "chat") return false;
      if (s.ch === "beep" && channel !== "beep" && channel !== "companion") return false;
      if (s.ch === "whisper" && channel !== "whisper" && channel !== "bot" && channel !== "companion") return false;
      const raw = String(text).trim().replace(/^[?!.\-\/]/, "");
      const low = raw.toLowerCase();
      if (low === "quit" || low === "cancel") {
        state.sessions.delete(mn);
        appSay(mn, "All torn up, " + plainName(mn) + ". No hard feelin's! Say ?apply any time you change your mind.", s);
        return true;
      }
      if (low === "apply") {
        startApplication(mn, channel);
        return true;
      }
      const list = s.staffTrack ? QUESTIONS.concat(STAFF_QUESTIONS) : QUESTIONS;
      const q = list[s.step];
      let answer = low === "skip" ? "(skipped)" : raw;
      if (q && q.check && low !== "skip") {
        const got = q.check(raw);
        if (got.err) {
          appSay(mn, "\u{1F33E} " + got.err, s);
          later(() => askNext(mn), 900);
          return true;
        }
        answer = got.value;
      }
      s.answers.push(answer);
      if (q) s.byKey[q.key] = answer;
      s.last = Date.now();
      if (q && q.key === "role" && /staff|farmhand|work/i.test(answer)) s.staffTrack = true;
      s.step++;
      later(() => askNext(mn), 1200);
      return true;
    }
    function keepApplication(mn, a) {
      const r = rec(mn, true);
      r.application = {
        at: a.at,
        staffTrack: !!a.staffTrack,
        byKey: Object.assign({}, a.byKey || {}),
        answers: a.byKey ? void 0 : (a.answers || []).slice()
      };
    }
    function applicationText(a, onRecord) {
      const list = a.staffTrack ? QUESTIONS.concat(STAFF_QUESTIONS) : QUESTIONS;
      const skip = onRecord ? ["limits", "triggers", "aftercare"] : [];
      let o = "\u{1F4CB} Application, " + new Date(a.at).toLocaleDateString() + "\n";
      if (a.byKey) list.filter((q) => !skip.includes(q.key)).forEach((q) => {
        o += "\n\u25B8 " + q.text.split("\n")[0].split("  ")[0] + "\n   " + (a.byKey[q.key] || "\u2014") + "\n";
      });
      else (a.answers || []).forEach((ans, qi) => {
        const k = OLD_ORDER[qi];
        if (!skip.includes(k)) o += "\n\u25B8 " + (k || "question " + (qi + 1)) + "\n   " + ans + "\n";
      });
      return o.trimEnd();
    }
    function finishApplication(mn) {
      const s = state.sessions.get(mn);
      if (!s) return;
      state.sessions.delete(mn);
      L.applications.push({
        id: Date.now().toString(36),
        mn,
        name: plainName(mn),
        at: Date.now(),
        staffTrack: s.staffTrack,
        answers: s.answers.slice(),
        byKey: Object.assign({}, s.byKey)
      });
      const r = rec(mn, true);
      r.name = plainName(mn);
      saveLedger();
      audit(mn, "APPLY", "");
      appSay(
        mn,
        `That's the lot, ` + plainName(mn) + `! Thank you, sweetie.

I'll put it in front of the proprietors and somebody'll come find you. Might be an hour, might be a day \u2014 we read every single one proper.

Welcome to B&B Farm. Mind the ruts! \u{1F33E}`,
        s
      );
      notifyStaff("\u{1F4CB} Ooh, a new application from " + plainName(mn) + " (" + mn + ")! Say ?queue to read it.", true, true);
    }
    function applyApplication(t, a) {
      const r = rec(t, true);
      r.limits = appAnswer(a, "limits");
      r.triggers = appAnswer(a, "triggers");
      r.aftercare = appAnswer(a, "aftercare");
      const sp = a.byKey ? appAnswer(a, "species") : speciesFrom(appAnswer(a, "species"));
      if (sp) r.species = sp;
      const g = appAnswer(a, "gender");
      if (GENDERS.includes(g)) {
        r.gender = g;
        if (g === "futa") r.futa = true;
      }
      const stay = a.byKey ? appAnswer(a, "stay") : (durationFrom(appAnswer(a, "stay")) || {}).key || "";
      const depth = a.byKey ? appAnswer(a, "depth") : (depthFrom(appAnswer(a, "depth")) || {}).key || "";
      r.stayType = stay;
      r.wantDepth = depth;
      return { stay, depth };
    }
    function notifyStaff(msg, routine, ping) {
      const present = [];
      for (const k in L.people) {
        const m = parseInt(k, 10);
        if (m !== CFG.BOT_MEMBER && isStaff(m) && onDuty(m) && charFor(m)) present.push(m);
      }
      for (const m of present) beep(m, "\u{1F33E} " + msg, !routine || !!ping);
      if (!routine || present.length === 0) {
        for (const p of CFG.PROPRIETORS) {
          if (present.includes(p)) continue;
          beep(p, "[B&B Farm] " + msg, !routine || !!ping);
        }
      }
    }
    const NO_COOLDOWN = ["safe", "safeword", "red", "stuck", "report", "staff"];
    const cooldownMs = (channel) => (channel === "companion" || channel === "local" ? CFG.COMPANION_COOLDOWN_S : CFG.USER_COOLDOWN_S) * 1e3;
    function onCooldown(mn, cmd, channel) {
      if (NO_COOLDOWN.includes(cmd)) return false;
      const last = state.cooldowns.get(mn) || 0;
      if (Date.now() - last < cooldownMs(channel)) return true;
      state.cooldowns.set(mn, Date.now());
      return false;
    }
    function waitYourTurn(mn, raw, channel) {
      state.cmdWaiting = state.cmdWaiting || /* @__PURE__ */ new Map();
      const q = state.cmdWaiting.get(mn) || [];
      const cap = channel === "chat" ? 2 : 10;
      if (q.length >= cap) {
        if (channel !== "chat") reply(mn, "Whoa there, sugar, that's a lot at once! I've got " + q.length + " of yours lined up already. Let me catch up, then send that one again.", channel);
        return;
      }
      q.push({ raw, channel, at: Date.now() });
      state.cmdWaiting.set(mn, q);
      scheduleCommands();
    }
    function scheduleCommands(ms) {
      if (state.cmdTimer) return;
      state.cmdTimer = later(() => {
        state.cmdTimer = null;
        runWaiting();
      }, ms || 250);
    }
    function runWaiting() {
      const m = state.cmdWaiting;
      if (!m || !m.size) return;
      let more = false;
      for (const [mn, q] of m) {
        if (!q.length) {
          m.delete(mn);
          continue;
        }
        const item = q[0];
        if (Date.now() - item.at > 5 * 6e4) {
          q.shift();
          more = more || q.length > 0;
          reply(mn, "Sorry, sugar, ?" + String(item.raw).slice(0, 40) + " waited too long and I let it go. Send it again if you still need it.", item.channel);
          continue;
        }
        if (Date.now() - (state.cooldowns.get(mn) || 0) < cooldownMs(item.channel)) {
          more = true;
          continue;
        }
        q.shift();
        if (q.length) more = true;
        else m.delete(mn);
        handleCommand(mn, item.raw, item.channel, true);
      }
      if (more) scheduleCommands();
    }
    const NATURAL = [
      [/^(who|what) are you\b/, "help"],
      [/\b(i'?m|im|i am|got) (stuck|wedged|trapped|caught)\b/, "stuck"],
      [/\bwho('?s| is) (here|around|about|on duty)\b/, "who"],
      [/\bwhat (keys|doors)\b|\bmy keys\b/, "keys"],
      [/\bwhere am i\b/, "where"],
      [/\bmy (record|file|paperwork)\b/, "record"],
      [/\bhow do i (apply|join|sign up|stay)\b/, "apply"],
      [/\b(house )?rules\b/, "rules"],
      [/\bwhat opens\b/, "doors"],
      [/\bwhat (animals|species)\b/, "species"],
      [/\b(i )?need (a hand|help|staff)\b|\bget (me )?(a )?staff\b/, "staff"],
      [/\bmy (herd|pack|pride|flock|stable|roster)\b/, "herd"]
    ];
    function naturalCommand(text) {
      const low = String(text).toLowerCase().trim();
      if (!low.includes(" ")) return null;
      for (const [re, cmd] of NATURAL) if (re.test(low)) return { cmd, args: [], rest: "" };
      return null;
    }
    function nearestCommand(cmd, sender) {
      const pool = PUBLIC_CMDS.concat(isStaff(sender) ? STAFF_CMDS : [], [...ADDON_CMDS.keys()]);
      const strip = cmd.replace(/^[a-z][-.]/, "");
      if (strip !== cmd && pool.includes(strip)) return strip;
      if (cmd.length < 4) return null;
      const dist = (a, b) => {
        const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
        for (let j = 1; j <= b.length; j++) d[0][j] = j;
        for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        return d[a.length][b.length];
      };
      let best = null, bd = 3;
      for (const c of pool) {
        const x = dist(cmd, c);
        if (x < bd) {
          bd = x;
          best = c;
        }
      }
      return bd <= (cmd.length >= 6 ? 2 : 1) ? best : null;
    }
    function parseCommand(raw, isWhisper, isBeep, noNatural) {
      let text = String(raw).trim();
      if (!text) return null;
      const lower = text.toLowerCase();
      for (const wp of CFG.BOT_WORDS) {
        if (lower === wp) return { cmd: "help", args: [], rest: "" };
        if (lower.startsWith(wp + " ")) {
          text = text.slice(wp.length).trim();
          const parts = text.split(/\s+/);
          return { cmd: parts[0].toLowerCase().replace(/[,.!?]+$/, ""), args: parts.slice(1), rest: parts.slice(1).join(" ") };
        }
      }
      if (CFG.PREFIXES.includes(text[0])) {
        text = text.slice(1).trim();
        if (!text) return null;
        const low2 = text.toLowerCase();
        for (const wp of CFG.BOT_WORDS) {
          if (low2.startsWith(wp + " ")) text = text.slice(wp.length).trim();
        }
        const parts = text.split(/\s+/);
        return { cmd: parts[0].toLowerCase().replace(/[,.!?]+$/, ""), args: parts.slice(1), rest: parts.slice(1).join(" ") };
      }
      if (isWhisper || isBeep) {
        const nat = noNatural ? null : naturalCommand(text);
        if (nat) return nat;
        const parts = text.split(/\s+/);
        return { cmd: parts[0].toLowerCase().replace(/[,.!?]+$/, ""), args: parts.slice(1), rest: parts.slice(1).join(" ") };
      }
      return null;
    }
    const PUBLIC_CMDS = [
      "help",
      "commands",
      "info",
      "guide",
      "rules",
      "consent",
      "tour",
      "species",
      "luxury",
      "doors",
      "ping",
      "apply",
      "record",
      "keys",
      "who",
      "herd",
      "safe",
      "safeword",
      "red",
      "report",
      "staff",
      "stuck",
      "friend",
      "notice",
      "teaseme",
      "stats",
      "board",
      "pedigree",
      "breedable",
      "fertile",
      "naturalheat",
      "breed",
      "cum",
      "milkable",
      "futa",
      "size",
      "sizes",
      "measure",
      "penis",
      "cock",
      "rights",
      "accept",
      "freeuse",
      "jarok",
      "gender",
      "outfit",
      "outfits",
      "uniform",
      "hypno",
      "tally",
      "eggs",
      "yes",
      "no",
      "wash",
      "quota",
      "praise",
      "degrade",
      "weather",
      "feeding",
      "curfew",
      "beg",
      "please",
      "fair",
      "enter",
      "addons",
      "addon"
    ];
    const STAFF_CMDS = [
      "queue",
      "app",
      "approve",
      "deny",
      "register",
      "unregister",
      "grant",
      "revoke",
      "claim",
      "release",
      "myherd",
      "herdname",
      "herdcall",
      "herdsummon",
      "turnout",
      "letup",
      "goldkey",
      "pasture",
      "onduty",
      "cover",
      "staffadd",
      "staffremove",
      "backup",
      "staffhelp",
      "note",
      "keysync",
      "keydump",
      "where",
      "roster",
      "stock",
      "find",
      "signed",
      "setrescue",
      "stucklog",
      "addfriend",
      "forced",
      "summon",
      "health",
      "tier",
      "vet",
      "brand",
      "tease",
      "spot",
      "spots",
      "appclear",
      "milk",
      "collect",
      "heat",
      "heatline",
      "shotlog",
      "stocks",
      "unstock",
      "walk",
      "tourstop",
      "clockin",
      "clockout",
      "hours",
      "done",
      "chore",
      "chores",
      "wheel",
      "spin",
      "begphrase",
      "score",
      "drain",
      "denial",
      "ruin",
      "jars",
      "inseminate",
      "nomilk",
      "inspect",
      "edge",
      "contract",
      "contracts",
      "zone",
      "zones",
      "voice",
      "machine"
    ];
    const SAFETY_CMDS = ["safe", "safeword", "red", "stuck"];
    const PRIVATE_REPLY = [
      "record",
      "keys",
      "find",
      "app",
      "queue",
      "roster",
      "stock",
      "health",
      "myherd",
      "herd",
      "stucklog",
      "keydump",
      "summon",
      "where",
      "cover",
      "vet",
      "spot",
      "spots",
      "tease",
      "teaseme",
      "stats",
      "pedigree",
      "hours",
      "chores",
      "wheel",
      "tourstop",
      "quota",
      "contract",
      "contracts"
    ];
    function parseRoles(args) {
      const out = [];
      for (const a of args) {
        switch (String(a).toLowerCase()) {
          case "livestock":
          case "stock":
            out.push(ROLE.LIVESTOCK);
            break;
          case "guest":
            out.push(ROLE.GUEST);
            break;
          case "luxury":
          case "luxuryguest":
            out.push(ROLE.LUXURY);
            break;
          case "farmhand":
            out.push(ROLE.FARMHAND);
            break;
          case "mandated":
          case "mandatedfarmhand":
            out.push(ROLE.MANDATED);
            break;
          case "herdmaster":
            out.push(ROLE.HERDMASTER);
            break;
          case "gloryhole":
            out.push(ROLE.GLORYHOLE);
            break;
        }
      }
      return out;
    }
    function recordText(mn, staffView, notesView) {
      const r = rec(mn);
      if (!r) return plainName(mn) + " ain't on the books yet, sugar. Say ?apply to get started.";
      let o = "\u{1F33E} FARM RECORD \u2014 " + (r.name || plainName(mn)) + " (" + mn + ")\n";
      o += "\nStanding:  " + roleString(mn);
      o += "\nKeys:      " + keyString(mn);
      if (tierOf(mn)) o += "\nTier:      " + tierName(tierOf(mn));
      if (r.species) o += "\nAnimal:    " + r.species;
      if (r.brand) o += "\nBrand:     " + r.brand.mark + " (put there by " + plainName(r.brand.by) + ")";
      if (r.stayType) o += "\nStay:      " + r.stayType;
      if ((r.herds || []).length) o += "\nBelongs to: " + herdsLine(mn);
      if (canHoldHerd(mn)) o += "\nKeeps:     a " + herdWord(mn) + " of " + herdMembers(mn).length + "/" + herdCap(mn);
      if (r.pastureLock) o += "\nPasture:   \u{1F512} kept out by " + plainName(r.pastureLock.by) + " \u2014 can't go on duty";
      if (isMandated(mn)) o += "\nOn call:   \u{1F517} mandated \u2014 can't opt out";
      else if (r.forced) o += "\nOn call:   \u{1F517} yes \u2014 office can summon";
      o += "\nContract:  " + (r.contractSigned ? "signed \u2705" : "not yet \u26A0\uFE0F");
      o += "\nOn books:  " + new Date(r.registeredAt).toLocaleDateString();
      if (r.limits) o += "\n\n\u{1F534} Hard limits:\n" + r.limits;
      if (staffView && r.triggers) o += "\n\n\u26A0\uFE0F Triggers (you and staff only):\n" + r.triggers;
      if (staffView && r.aftercare) o += "\n\n\u{1F90D} Aftercare:\n" + r.aftercare;
      if (notesView && r.notes) o += "\n\n\u{1F4DD} Staff notes:\n" + r.notes;
      if (staffView && r.prod && r.prod.held) {
        const p = prodOf(mn), cap = capacity(mn), held = heldTotal(p);
        const parts = HOLES.filter((h) => h !== "vulva" || hasVulva(mn) || (p.held.vulva || 0) > 0).map((h) => ({ vulva: "Vulva", butt: "Butt", mouth: "Stomach" })[h] + " " + ml(p.held[h] || 0));
        o += "\n\n\u{1FAD9} Holding: " + parts.join(" \xB7 ") + " (" + Math.round(100 * held / Math.max(1, cap)) + "% full)";
      }
      if (staffView && r.application) o += "\n\n" + applicationText(r.application, true);
      return o;
    }
    function whoText() {
      const here = (W.ChatRoomCharacter || []).map((c) => c.MemberNumber).filter((m) => m !== CFG.BOT_MEMBER);
      const staffHere = [], stockHere = [], guestsHere = [], otherHere = [];
      for (const m of here) {
        if (isStaff(m) && onDuty(m)) staffHere.push(m);
        else if (hasRole(m, ROLE.LIVESTOCK) || rec(m) && !onDuty(m)) stockHere.push(m);
        else if (hasRole(m, ROLE.GUEST) || hasRole(m, ROLE.LUXURY)) guestsHere.push(m);
        else otherHere.push(m);
      }
      let o = "\u{1F33E} WHO'S ABOUT\n";
      o += "\n\u{1F477} Staff on duty: " + (staffHere.length ? staffHere.map(plainName).join(", ") : "none");
      const offProps = CFG.PROPRIETORS.filter((p) => rec(p) && rec(p).onDuty === false);
      if (offProps.length) {
        const holder = offProps.map((p) => herdLeaderOf(p)).find((h) => h);
        let line = null;
        if (holder && rec(holder) && (rec(holder).cover || []).length) {
          const pool = rec(holder).cover;
          line = pool[Math.floor(Math.random() * pool.length)];
        }
        o += "\n   " + (line || "The proprietors are out grazin' in the pasture. Might be a while, hon!");
      }
      const extra = (m) => titleTag(m) + (paintedText(m) ? " \u{1F4A6}" : "") + ((rec(m) || {}).tally && tallyToday(m) ? " \u270F\uFE0F" + tallyToday(m) : "");
      o += "\n\n\u{1F404} Stock: " + (stockHere.length ? stockHere.map((m) => plainName(m) + brandTag(m) + extra(m)).join(", ") : "none about right now");
      if (guestsHere.length) o += "\n\u{1F3E1} Guests: " + guestsHere.map(plainName).join(", ");
      if (otherHere.length) o += "\n\u{1F464} Visitors: " + otherHere.map(plainName).join(", ");
      const oncall = forcedStaff().filter((m) => !charFor(m));
      if (oncall.length) o += "\n\n\u{1F517} On call, away: " + oncall.length + " \u2014 ?summon to fetch 'em, sugar";
      return o;
    }
    function handleCommand(sender, raw, channel, fromQueue) {
      if (!fromQueue) {
        state.lastCmd = state.lastCmd || /* @__PURE__ */ new Map();
        const prev = state.lastCmd.get(sender), key = channel + "|" + String(raw).trim().toLowerCase();
        if (prev && prev.key === key && Date.now() - prev.at < 1500) return;
        state.lastCmd.set(sender, { key, at: Date.now() });
      }
      state.inReply = true;
      state.ambiguous = null;
      const watch = channel === "companion" ? state.cmdWatch = { mn: sender, replied: false, emotes: [] } : null;
      try {
        return handleCommandInner(sender, raw, channel);
      } catch (e) {
        warn("command failed: ?" + String(raw).slice(0, 60) + " from " + sender + ":", e);
        audit(sender, "CMD_ERROR", String(raw).slice(0, 60) + " \xB7 " + String(e && e.message || e).slice(0, 120));
        try {
          reply(sender, "Oops, sugar, ?" + String(raw).slice(0, 40) + " hit a snag on my end. It's written in the farm log for the proprietors. Try again in a bit, or ask staff.", channel);
        } catch (e2) {
        }
      } finally {
        if (state.ambiguous) {
          const a = state.ambiguous;
          state.ambiguous = null;
          try {
            reply(sender, 'More than one person goes by "' + a.arg + '", sugar: ' + a.list.slice(0, 6).map((m) => plainName(m) + " (" + m + (rec(m) && rec(m).roles && rec(m).roles.length ? ", on the books" : "") + (charFor(m) ? ", here" : "") + ")").join(", ") + ". Use the member number instead, like ?" + String(raw).trim().split(/\s+/)[0].replace(/^[?!.\/-]/, "") + " " + a.list[0] + ".", channel);
          } catch (e) {
          }
        }
        if (!state.syncSoon) {
          state.syncSoon = true;
          later(() => {
            state.syncSoon = false;
            syncCompanions();
            whitelistSync(true);
          }, 1500);
        }
        state.inReply = false;
        state.cmdWatch = null;
        if (watch && !watch.replied && watch.emotes.length) toCompanion(sender, "(in the room) " + watch.emotes.join("\n"), "reply");
      }
    }
    function handleCommandInner(sender, raw, channel) {
      const isWhisper = channel === "whisper" || channel === "bot" || channel === "companion" || channel === "local";
      const isBeep = channel === "beep";
      if (state.sessions.has(sender)) {
        const p0 = parseCommand(raw, false, false, true);
        const lone = String(raw).trim().toLowerCase();
        const pass = p0 && [
          "help",
          "rules",
          "species",
          "tour",
          "consent",
          "luxury",
          "doors",
          "safe",
          "safeword",
          "red",
          "stuck",
          "staff"
        ].includes(p0.cmd) || ["safe", "safeword", "red", "stuck"].includes(lone);
        if (!pass && handleApplicationAnswer(sender, raw, channel)) return;
      }
      const huh = (msg) => {
        if (channel === "chat") return;
        state.huhAt = state.huhAt || /* @__PURE__ */ new Map();
        if (Date.now() - (state.huhAt.get(sender) || 0) < 6e4) return;
        state.huhAt.set(sender, Date.now());
        reply(sender, msg, channel);
      };
      const p = parseCommand(raw, isWhisper, isBeep);
      if (!p) {
        huh("I didn't catch a command in that, sugar. Try ?help, or just say what you'd like, like stats or keys.");
        return;
      }
      let { cmd, args, rest } = p;
      let addonCmd = ADDON_CMDS.get(cmd) || null;
      if (!PUBLIC_CMDS.includes(cmd) && !STAFF_CMDS.includes(cmd) && !addonCmd) {
        if (guideTopic(cmd)) {
          args = [cmd];
          rest = cmd;
          cmd = "help";
        } else {
          const words = String(raw).trim().split(/\s+/).length;
          if (channel === "companion" && words >= 3) {
            huh("That looked like chat, hon, not a farm command, so it wasn't sent anywhere. This box talks to me (try ?help); chat goes in the game's own chat box.");
            return;
          }
          const near = nearestCommand(cmd, sender);
          if (channel === "chat") {
            if (near) {
              state.huhAt = state.huhAt || /* @__PURE__ */ new Map();
              if (Date.now() - (state.huhAt.get(sender) || 0) > 6e4) {
                state.huhAt.set(sender, Date.now());
                reply(sender, "Did you mean ?" + near + ", sugar?", canBeep(sender) ? "beep" : "whisper");
              }
            }
            return;
          }
          huh("I don't know ?" + cmd + ", hon." + (near ? " Did you mean ?" + near + "?" : "") + " ?help lists what I can do.");
          return;
        }
      }
      if (STAFF_CMDS.includes(cmd) && !isStaff(sender)) {
        huh("?" + cmd + " is just for farm staff, sugar.");
        return;
      }
      if (onCooldown(sender, cmd, channel)) {
        waitYourTurn(sender, raw, channel);
        return;
      }
      dbg("CMD:", cmd, "from", sender, "via", channel);
      if (CFG.SAFETY_REQUIRE_IN_ROOM && SAFETY_CMDS.includes(cmd) && !charFor(sender)) {
        reply(sender, "\u{1F534} I hear you, " + plainName(sender) + ". The farm office only covers the farm, and you're not here right now, so I can't stop anything where you are. Please use the club's own safeword and your room's admins.\n\n?staff still reaches our people if you'd like a hand.", channel);
        audit(sender, "SAFETY_OUTSIDE", cmd);
        return;
      }
      const replyCh = channel === "chat" && (PRIVATE_REPLY.includes(cmd) || addonCmd && addonCmd.def.private) ? canBeep(sender) ? "beep" : "whisper" : channel;
      const docAbout = channel === "companion" && DOC_CMDS.includes(cmd) && args[0] && isStaff(sender) ? resolveTarget(args[0]) : null;
      const R = docAbout && docAbout !== sender ? (txt) => toCompanion(sender, txt, "doc", false, { kind: cmd, who: plainName(docAbout), about: docAbout }) : (txt) => reply(sender, txt, replyCh);
      if (addonCmd) {
        runAddonCommand(addonCmd, sender, args, rest, channel, R);
        return;
      }
      switch (cmd) {
        case "addons":
        case "addon": {
          const sub = String(args[0] || "").toLowerCase();
          if ((sub === "on" || sub === "off") && args[1]) {
            if (!isProprietor(sender)) {
              R("Only proprietors switch add-ons on and off, sugar.");
              break;
            }
            const a = findAddon(args.slice(1).join(" "));
            if (!a) {
              R("There's no add-on called '" + args[1] + "', hon. ?addons lists 'em.");
              break;
            }
            a.enabled = sub === "on";
            L.addonsOff = L.addonsOff || {};
            if (a.enabled) delete L.addonsOff[a.name];
            else L.addonsOff[a.name] = true;
            saveLedger();
            audit(sender, "ADDON_" + sub.toUpperCase(), a.name);
            R("\u{1F9E9} " + a.label + " is " + (a.enabled ? "on" : "off") + ".");
            syncCompanions(true);
            break;
          }
          R(addonsText(rest));
          break;
        }
        case "help":
        case "commands":
        case "info":
        case "guide":
          R(helpFor(sender, args[0]));
          if (!args[0] && isStaff(sender)) later(() => reply(sender, TEXT.staffhelp, replyCh), 2200);
          break;
        case "staffhelp":
          R(TEXT.staffhelp);
          break;
        case "rules":
          R(fill(TEXT.rules, sender));
          break;
        case "consent":
          R(fill(TEXT.consent, sender));
          break;
        case "tour":
          if (String(args[0] || "").toLowerCase() === "stop") {
            state.tours.delete(sender);
            R("Tour's over, sweetie! Come back and look around any time.");
            break;
          }
          if (charFor(sender) && (L.life.tour || []).length && runTour(sender)) break;
          R(fill(TEXT.tour, sender));
          break;
        case "drain": {
          const t = resolveTarget(args[0]);
          if (!t || !rec(t)) {
            R("Here's how, sugar: ?drain <who> empties everything they're holdin', or ?drain <who> butt just that hole. For example: ?drain Bessie");
            break;
          }
          const hs = args[1] ? holesFrom(args[1]) : HOLES;
          if (!hs) {
            R("Which hole, hon? vulva, butt or mouth, or leave it out for all of 'em.");
            break;
          }
          const p2 = prodOf(t);
          if (p2.tieUntil > Date.now()) {
            R("Not while " + plainName(t) + " is still knotted, sugar! Wait for " + plainName(p2.tiedTo) + "'s knot to go down.");
            break;
          }
          prodTick();
          let out = 0;
          for (const h of hs) {
            out += p2.held[h] || 0;
            p2.held[h] = 0;
          }
          if (out < 1) {
            R(plainName(t) + " isn't holdin' anything to drain, hon.");
            break;
          }
          if (p2.pin && !sizePinned(t)) p2.pin = null;
          saveLedger();
          audit(sender, "DRAIN", t + " " + Math.round(out));
          if (charFor(t)) emote("\u{1FAA3} " + plainName(sender) + " presses down on " + plainName(t) + "'s belly and pumps 'em out: " + ml(out) + " of seed gushes into the bucket, splashin' everywhere. What a beautiful mess.", t);
          else R("\u{1FAA3} Drained " + ml(out) + " out of " + plainName(t) + ".");
          break;
        }
        case "denial": {
          const t = resolveTarget(args[0]);
          if (!t || !rec(t)) {
            R("Here's how, sugar: ?denial <stud> <hours> stops 'em fillin' anybody that long (and they come out of it pent up). ?denial <stud> off lets 'em go early. For example: ?denial Rex 6");
            break;
          }
          const p2 = prodOf(t);
          if (/^(off|stop|end|no)$/i.test(args[1] || "")) {
            p2.deniedUntil = 0;
            saveLedger();
            R("\u{1F513} " + plainName(t) + " is off denial.");
            tell(t, "\u{1F513} You're off denial, sugar. Go on.");
            break;
          }
          const h = parseFloat(args[1]);
          if (!(h > 0 && h <= 168)) {
            R("How many hours, hon? 1 to 168. For example: ?denial " + plainName(t) + " 6");
            break;
          }
          p2.deniedUntil = Date.now() + h * 36e5;
          saveLedger();
          audit(sender, "DENIAL", t + " " + h + "h");
          if (charFor(t)) emote("\u{1F6AB} " + plainName(sender) + " taps " + plainName(t) + " right where it aches: no fillin' anybody for " + h + " hours. Every drop stays in, sugar.", t);
          R("\u{1F6AB} " + plainName(t) + " is denied for " + h + " hours. When it's up they'll be pent up for sure.");
          break;
        }
        case "ruin": {
          const t = resolveTarget(args[0]);
          if (!t || !rec(t) || !makesSemen(t)) {
            R("Whose load are we ruinin', sugar? ?ruin <stud>, somebody who makes semen. For example: ?ruin Rex");
            break;
          }
          if (!onMap(t)) {
            R(plainName(t) + " needs to be here on the map for that, hon.");
            break;
          }
          prodTick();
          const p2 = prodOf(t), lost = p2.semen * CFG.PROD.LOAD_SHARE;
          if (lost < 1) {
            R(plainName(t) + " is already drained dry, sugar.");
            break;
          }
          p2.semen -= lost;
          p2.pentUp = false;
          p2.semenFullSince = 0;
          saveLedger();
          audit(sender, "RUIN", t + " " + Math.round(lost));
          emote("\u{1F608} " + plainName(sender) + " takes " + plainName(t) + " right to the edge, then lets go at the last second. " + ml(lost) + " dribbles out, wasted on the hay, and " + plainName(t) + " whimpers for it. Ruined.", t);
          break;
        }
        case "jars": {
          L.jars = (L.jars || []).filter((j) => Date.now() - j.t < CFG.JAR_DAYS * 864e5);
          R(L.jars.length ? "\u{1FAD9} SEED JARS\n" + L.jars.map((j) => "#" + j.id + ": " + ml(j.ml) + " of " + plainName(j.stud) + "'s, bottled " + new Date(j.t).toLocaleString()).join("\n") + "\n?inseminate <who> <jar> [hole] asks them, and uses one on their yes." : "\u{1FAD9} No seed jars on the shelf, hon. ?collect a stud to bottle some.");
          break;
        }
        case "inseminate": {
          const t = resolveTarget(args[0]);
          L.jars = (L.jars || []).filter((j) => Date.now() - j.t < CFG.JAR_DAYS * 864e5);
          const jar = L.jars.find((j) => String(j.id) === String(args[1] || "").replace(/^#/, ""));
          const hole = args[2] ? holeFrom(args[2]) : "vulva";
          if (!t || !jar || !hole) {
            R("Here's how, sugar: ?inseminate <who> <jar number> [hole]. ?jars shows what's on the shelf. They always get asked first. For example: ?inseminate Bessie 3");
            break;
          }
          if (!jarOk(t)) {
            R(plainName(t) + " has said never to jar insemination, sugar (?jarok off). That's their call, so I won't even ask.");
            break;
          }
          const err = inseminateProblem(t, jar, hole);
          if (err) {
            R(err);
            break;
          }
          if (t === sender) {
            inseminate(sender, t, jar.id, hole);
            break;
          }
          askJar(sender, t, jar.id, hole);
          R("\u{1F489} I've asked " + plainName(t) + " first, sugar. If they say yes, I'll do it right then. If they say no, please leave it be.");
          break;
        }
        case "contract":
        case "contracts": {
          contractsLedger();
          const sub = String(args[0] || "list").toLowerCase(), name = String(args[1] || "").toLowerCase();
          const owner = isProprietor(sender), boss = isHerdmaster(sender);
          const needOwner = () => {
            R("Writin' farm contracts is for the proprietors, sugar.");
            return false;
          };
          const tplFor = (n) => L.contractTemplates[n];
          switch (sub) {
            case "list": {
              const saved = Object.keys(L.contractTemplates);
              const live = L.contracts.filter((x) => x.status === "signed" || x.status === "offered" || x.status === "releasing");
              R("\u{1F4DC} FARM CONTRACTS\nReady-made: fun \xB7 deep \xB7 nhl" + (saved.length ? "\nYours: " + saved.join(" \xB7 ") : "") + "\n\nIN FORCE OR OFFERED\n" + (live.length ? live.map(contractLine).join("\n") : "  none right now") + "\n\n?contract show <name> [who] \xB7 ?contract offer <name> <who> <1h|12h|1d|1w|2w|1m|perm> \xB7 ?contract release <who> \xB7 ?contract check <who>" + (owner ? '\n?contract new <name> [from fun|deep|nhl] \xB7 add \xB7 set \xB7 remove \xB7 title \xB7 terms \xB7 policy \xB7 delete \xB7 ?contract rules\nMade for each person when offered: {name} {Species} {species} {pet} in any text, like nickname="BnB {Species} {name}" \u2192 BnB Cow Vicky' : ""));
              break;
            }
            case "show": {
              const tpl = contractTemplate(name);
              if (!tpl) {
                R("There's no contract called '" + name + "', hon. ?contract list shows them.");
                break;
              }
              const who = args[2] ? resolveTarget(args[2]) : sender;
              const c = buildContract(tpl, who || sender, "1w");
              const problems = checkContract(c);
              R(describeContract(c) + "\n\n" + (problems.length ? "\u26A0\uFE0F BC+ wouldn't take it yet:\n\u2022 " + problems.join("\n\u2022 ") : "\u2705 BC+ " + BCPLUS_VERSION + " will take this one as it is."));
              break;
            }
            case "offer": {
              if (!boss) {
                R("Offerin' contracts is for herdmasters and proprietors, sugar.");
                break;
              }
              const t = resolveTarget(args[2]);
              if (!name || !t || !args[3]) {
                R("Here's how, sugar: ?contract offer <contract> <who> <how long>. How long is 1h, 12h, 1d, 1w, 2w, 1m or perm. For example: ?contract offer deep Bessie 1w");
                break;
              }
              const err = offerContract(sender, name, t, args.slice(3).join(" "));
              R(err || "\u{1F4DC} Offered to " + plainName(t) + "! It's on their BC+ Contracts page now. I'll tell you when they sign.");
              break;
            }
            case "release":
            case "cancel": {
              if (!boss) {
                R("Only herdmasters and proprietors can release a farm contract, sugar. I've told 'em you asked.");
                notifyStaff("\u{1F4DC} " + plainName(sender) + " asks for a farm contract release: " + rest, true);
                break;
              }
              const t = resolveTarget(args[1]);
              if (!t) {
                R("Release whose, sugar? ?contract release <who> [title]");
                break;
              }
              const err = releaseContract(sender, t, args.slice(2).join(" ") || null);
              R(err || "\u{1F4DC} Released! BC+ is puttin' " + plainName(t) + "'s rules back how they were.");
              break;
            }
            case "check": {
              const t = resolveTarget(args[1]);
              if (!t || !charFor(t)) {
                R("They need to be here in the room for me to ask their BC+, hon.");
                break;
              }
              enqueue(queryMsg(t));
              R("\u{1F4DC} Askin' " + plainName(t) + "'s BC+ what farm contracts they hold\u2026");
              later(() => {
                const mine = L.contracts.filter((x) => x.mn === t && x.status !== "declined");
                reply(sender, mine.length ? "\u{1F4DC} " + mine.map(contractLine).join("\n") : plainName(t) + " holds no farm contracts.", replyCh);
              }, 4e3);
              break;
            }
            case "rules":
            case "rule": {
              if (sub === "rule" || RULES.has(name)) {
                const def = RULES.get(name);
                if (!def) {
                  R("BC+ has no rule called '" + name + "', sugar. ?contract rules lists them.");
                  break;
                }
                R("\u{1F4D8} " + def.name + " (" + def.id + ") \xB7 " + def.category + "\n" + def.description + (def.settings.length ? "\n\nSETTINGS\n" + def.settings.map((s) => "  " + s.name + " \xB7 " + s.type + (s.options ? ": " + s.options.join(" / ") : "") + " \xB7 default " + JSON.stringify(s.default)).join("\n") : "\n\nNo settings.") + (NEVER[def.id] ? "\n\n\u{1F6AB} The farm never uses this one: it " + NEVER[def.id] + "." : ""));
                break;
              }
              const cats = {};
              for (const d of RULES.values()) if (!name || d.category.toLowerCase() === name) (cats[d.category] = cats[d.category] || []).push(d.id + (NEVER[d.id] ? " \u{1F6AB}" : ""));
              R("\u{1F4D8} BC+ " + BCPLUS_VERSION + " RULES" + (name ? " \xB7 " + name : "") + "\n" + Object.entries(cats).map(([c, ids]) => c + ": " + ids.join(", ")).join("\n") + "\n\n?contract rule <id> shows its settings.");
              break;
            }
            case "new": {
              if (!owner) {
                needOwner();
                break;
              }
              if (!/^[a-z][a-z0-9_-]{1,19}$/.test(name) || depthFrom(name) && ["fun", "deep", "nhl"].includes(name)) {
                R("Give it a one-word name, sugar (2 to 20 letters or numbers, not fun, deep or nhl). For example: ?contract new prizecow from deep");
                break;
              }
              const base = String(args[2] || "").toLowerCase() === "from" ? (depthFrom(args[3] || "") || {}).key || null : null;
              L.contractTemplates[name] = { title: "B&B Farm \xB7 " + name, terms: base ? DEFAULT_TERMS[base] : "", base, add: {}, remove: [], by: sender, at: Date.now() };
              saveLedger();
              audit(sender, "CONTRACT_NEW", name);
              R("\u{1F4DC} Made '" + name + "'" + (base ? " from " + base : " (empty)") + ". Now ?contract add " + name + " <rule> key=value\u2026, ?contract title " + name + " <text>, ?contract terms " + name + " <text>, then ?contract show " + name + ".");
              break;
            }
            case "add":
            case "set": {
              if (!owner) {
                needOwner();
                break;
              }
              const tpl = tplFor(name), id = String(args[2] || "");
              if (!tpl) {
                R("There's no saved contract called '" + name + "', sugar. ?contract new " + name + " makes one.");
                break;
              }
              const def = RULES.get(id);
              if (!def) {
                R("BC+ has no rule called '" + id + "', sugar. ?contract rules lists them all.");
                break;
              }
              if (NEVER[id]) {
                R("\u{1F6AB} The farm never puts " + def.name + " in a contract, hon: it " + NEVER[id] + ".");
                break;
              }
              const pairs = parsePairs(args.slice(3).join(" ")), set = Object.assign({}, tpl.add[id] || {}), bad = [];
              for (const [k, v] of Object.entries(pairs)) {
                const s = def.settings.find((x) => x.name.toLowerCase() === k.toLowerCase());
                if (!s) {
                  bad.push(k + ": no such setting (it has " + (def.settings.map((x) => x.name).join(", ") || "none") + ")");
                  continue;
                }
                const got = settingValue(s, v);
                if (got.err) bad.push(s.name + ": " + got.err);
                else set[s.name] = got.value;
              }
              if (bad.length) {
                R("Not saved, sugar:\n\u2022 " + bad.join("\n\u2022 "));
                break;
              }
              tpl.add[id] = set;
              tpl.remove = (tpl.remove || []).filter((x) => x !== id);
              saveLedger();
              audit(sender, "CONTRACT_EDIT", name + " +" + id);
              R("\u{1F4DC} " + def.name + " is in '" + name + "'" + (Object.keys(set).length ? " (" + Object.entries(set).map(([k, v]) => k + "=" + (Array.isArray(v) ? v.join("|") : v)).join(" ") + ")" : "") + ".");
              break;
            }
            case "remove": {
              if (!owner) {
                needOwner();
                break;
              }
              const tpl = tplFor(name), id = String(args[2] || "");
              if (!tpl) {
                R("There's no saved contract called '" + name + "', sugar.");
                break;
              }
              delete tpl.add[id];
              if (!tpl.remove.includes(id)) tpl.remove.push(id);
              saveLedger();
              R("\u{1F4DC} Took " + id + " out of '" + name + "'.");
              break;
            }
            case "title":
            case "terms": {
              if (!owner) {
                needOwner();
                break;
              }
              const tpl = tplFor(name), text = args.slice(2).join(" ");
              if (!tpl || !text) {
                R("Here's how: ?contract " + sub + " <name> <text>. %name% becomes their name in the terms.");
                break;
              }
              if (sub === "title" && text.length > LIMITS.TITLE) {
                R("Titles can be " + LIMITS.TITLE + " characters at most in BC+, sugar.");
                break;
              }
              if (sub === "terms" && text.length > LIMITS.TERMS) {
                R("Terms can be " + LIMITS.TERMS + " characters at most in BC+, sugar.");
                break;
              }
              tpl[sub] = text;
              saveLedger();
              R("\u{1F4DC} Saved the " + sub + " for '" + name + "'.");
              break;
            }
            case "policy": {
              if (!owner) {
                needOwner();
                break;
              }
              const tpl = tplFor(name), v = String(args[2] || "").toLowerCase();
              if (!tpl || !/^(farm|author|either)$/.test(v)) {
                R("Here's how: ?contract policy <name> farm (only the farm ends it early) or either (they can end it too).");
                break;
              }
              tpl.policy = v === "either" ? "either" : "author";
              saveLedger();
              R("\u{1F4DC} '" + name + "' can be ended early by " + (tpl.policy === "either" ? "either side" : "the farm only") + ".");
              break;
            }
            case "outfit": {
              if (!owner) {
                needOwner();
                break;
              }
              const tpl = tplFor(name), how = args.slice(2);
              if (!tpl || !how.length) {
                R("Here's how: ?contract outfit <name> auto (theirs, by species and gender) \xB7 none \xB7 or a slot, like cow female, any femboy, stock, luxury.");
                break;
              }
              const v = String(how[0]).toLowerCase();
              tpl.outfit = v === "auto" ? "auto" : v === "none" ? "" : outfitSlotFrom(how);
              if (tpl.outfit === null) {
                R("I don't know that outfit slot, sugar. ?outfit lists them.");
                break;
              }
              saveLedger();
              R("\u{1F4DC} When somebody signs '" + name + "', they'll be offered " + (tpl.outfit === "auto" ? "their own outfit (by species and gender)" : tpl.outfit ? slotLabel(tpl.outfit) : "no outfit") + ".");
              break;
            }
            case "delete": {
              if (!owner) {
                needOwner();
                break;
              }
              if (!tplFor(name)) {
                R("There's no saved contract called '" + name + "', sugar.");
                break;
              }
              delete L.contractTemplates[name];
              saveLedger();
              audit(sender, "CONTRACT_DELETE", name);
              R("\u{1F4DC} Deleted '" + name + "'. Contracts already signed keep goin' till they end.");
              break;
            }
            default:
              R("?contract list \xB7 show \xB7 offer \xB7 release \xB7 check \xB7 rules" + (owner ? " \xB7 new \xB7 add \xB7 set \xB7 remove \xB7 title \xB7 terms \xB7 policy \xB7 delete" : ""));
          }
          break;
        }
        case "outfit":
        case "outfits":
        case "uniform": {
          outfitsLedger();
          const sub = String(args[0] || "").toLowerCase();
          if (!sub || sub === "list") {
            const ks = Object.keys(L.outfits);
            R("\u{1F457} FARM OUTFITS\n" + (ks.length ? ks.map((k) => "  " + slotLabel(k) + " \xB7 " + L.outfits[k].items + " pieces" + (L.outfits[k].locks ? ", " + L.outfits[k].locks + " locked" : "")).join("\n") : "  none saved yet") + "\n\nKeys to farm locks: " + { staff: "farm staff + their herd leader", leader: "their herd leader", owners: "the proprietors" }[L.outfitRules.keys] + "\nOffered on approval: " + (L.outfitRules.onApprove ? "yes" : "no") + " \xB7 uniforms at clock-in: " + (L.outfitRules.onClockIn ? "yes" : "no") + " \xB7 change back at clock-out: " + (L.outfitRules.changeBack ? "yes" : "no") + "\n\nProprietors save outfits from the Companion's Dashboard. ?outfit offer <who> [slot] hands one over.");
            break;
          }
          if (sub === "back") {
            if (!hasCompanion(sender)) {
              R("That needs the Companion, sugar: it's the one keepin' your own clothes.");
              break;
            }
            enqueue(makeMsg("outfitBack", { why: "you asked" }, sender));
            break;
          }
          if (sub === "offer") {
            if (!isStaff(sender)) {
              R("Handin' out outfits is for staff, sugar.");
              break;
            }
            const t = resolveTarget(args[1]);
            if (!t || !rec(t)) {
              R("Offer to who, sugar? ?outfit offer <who> [slot]. Leave the slot off and I'll pick theirs by species and gender.");
              break;
            }
            const slot = args.length > 2 ? outfitSlotFrom(args.slice(2)) : rec(t).roles.some((x) => [ROLE.FARMHAND, ROLE.MANDATED, ROLE.HERDMASTER, ROLE.PROPRIETOR].includes(x)) && clockedIn(t) ? uniformSlotFor(t) : outfitSlotFor(t);
            const err = offerOutfit(t, slot, "From " + plainName(sender));
            R(err || "\u{1F457} Offered " + plainName(t) + " " + slotLabel(slot) + ". They'll say yes or not now on their own screen.");
            break;
          }
          if (!isProprietor(sender)) {
            R("That one's for the proprietors, sugar. ?outfit shows what's saved.");
            break;
          }
          if (sub === "clear") {
            const slot = outfitSlotFrom(args.slice(1));
            if (!slot || !L.outfits[slot]) {
              R("There's no outfit saved there, sugar.");
              break;
            }
            delete L.outfits[slot];
            saveLedger();
            audit(sender, "OUTFIT_CLEAR", slot);
            R("\u{1F457} Cleared " + slotLabel(slot) + ".");
            syncCompanions(true);
            break;
          }
          if (sub === "keys") {
            const v = String(args[1] || "").toLowerCase();
            if (!["staff", "leader", "owners"].includes(v)) {
              R("Who holds the keys to farm locks? ?outfit keys staff (farm staff + their herd leader), leader (their herd leader only) or owners (proprietors only).");
              break;
            }
            L.outfitRules.keys = v;
            saveLedger();
            R("\u{1F512} Farm locks open for: " + { staff: "farm staff + their herd leader", leader: "their herd leader", owners: "the proprietors" }[v] + ".");
            syncCompanions(true);
            break;
          }
          if (sub === "rule") {
            const k = { onapprove: "onApprove", approve: "onApprove", onclockin: "onClockIn", clockin: "onClockIn", changeback: "changeBack", clockout: "changeBack" }[String(args[1] || "").toLowerCase()];
            const v = String(args[2] || "").toLowerCase();
            if (!k || !["on", "off"].includes(v)) {
              R("?outfit rule approve on|off \xB7 clockin on|off \xB7 changeback on|off");
              break;
            }
            L.outfitRules[k] = v === "on";
            saveLedger();
            R("\u{1F457} Got it.");
            syncCompanions(true);
            break;
          }
          R("?outfit \xB7 ?outfit offer <who> [slot] \xB7 ?outfit back \xB7 ?outfit clear <slot> \xB7 ?outfit keys staff|leader|owners \xB7 ?outfit rule approve|clockin|changeback on|off");
          break;
        }
        case "zone":
        case "zones": {
          zonesLedger();
          const sub = String(args[0] || "").toLowerCase(), name = String(args[1] || "").toLowerCase();
          if (!sub || sub === "list") {
            const ks = Object.keys(L.zones);
            R("\u{1F5FA}\uFE0F ZONES\n" + (ks.length ? ks.map((n) => "  " + zoneText(n, L.zones[n])).join("\n") : "  none yet") + "\n\nHerdmasters: stand on a corner and ?zone a <name>, the opposite corner and ?zone b <name>. ?zone pair <name> <group> joins boxes into one place. ?zone who shows who's where.");
            break;
          }
          if (sub === "who") {
            const here = (W.ChatRoomCharacter || []).filter((c) => c.MemberNumber !== CFG.BOT_MEMBER && rec(c.MemberNumber));
            const by = {};
            for (const c of here) {
              const w = whereName(c.MemberNumber) || "out in the open";
              (by[w] = by[w] || []).push(plainName(c.MemberNumber));
            }
            R("\u{1F5FA}\uFE0F WHO'S WHERE\n" + (Object.keys(by).length ? Object.entries(by).map(([w, ns]) => "  " + w + ": " + ns.join(", ")).join("\n") : "  nobody on the books is here"));
            break;
          }
          if (!isHerdmaster(sender)) {
            R("Settin' zones is for herdmasters and proprietors, sugar. ?zone shows them.");
            break;
          }
          if (!/^[a-z][a-z0-9_-]{1,19}$/.test(name)) {
            R("Give the zone a one-word name, sugar, like ?zone a barn-1.");
            break;
          }
          if (sub === "box") {
            const n = args.slice(2, 6).map((v) => parseInt(v, 10)), wide = W.ChatRoomMapViewWidth || 40, high = W.ChatRoomMapViewHeight || 40;
            if (n.length < 4 || n.some((v, i) => !(v >= 0 && v < (i % 2 ? high : wide)))) {
              R("I need two corners on the map, sugar: ?zone box " + name + " <ax> <ay> <bx> <by>.");
              break;
            }
            const z2 = L.zones[name] = L.zones[name] || { group: name };
            z2.a = { X: n[0], Y: n[1] };
            z2.b = { X: n[2], Y: n[3] };
            saveLedger();
            audit(sender, "ZONE_SET", name + " box");
            R("\u{1F5FA}\uFE0F " + zoneText(name, z2));
            break;
          }
          if (sub === "a" || sub === "b") {
            const C = charFor(sender), p2 = C && C.MapData && C.MapData.Pos;
            if (!p2) {
              R("Step onto the map first, hon, so I can see where you're standin'.");
              break;
            }
            const z2 = L.zones[name] = L.zones[name] || { group: name };
            z2[sub] = { X: p2.X, Y: p2.Y };
            saveLedger();
            audit(sender, "ZONE_SET", name + " " + sub + " " + p2.X + "," + p2.Y);
            R("\u{1F5FA}\uFE0F " + zoneText(name, z2) + (z2.a && z2.b ? "" : "\nNow stand on the opposite corner and ?zone " + (sub === "a" ? "b" : "a") + " " + name + "."));
            break;
          }
          const z = L.zones[name];
          if (!z) {
            R("There's no zone called '" + name + "', sugar.");
            break;
          }
          if (sub === "pair") {
            const g = String(args[2] || "").toLowerCase();
            if (!/^[a-z][a-z0-9_-]{1,19}$/.test(g)) {
              R("Pair it into which place, hon? ?zone pair " + name + " barn");
              break;
            }
            z.group = g;
            saveLedger();
            R("\u{1F5FA}\uFE0F " + name + " is part of " + g + " now. Everything in a group counts as one place.");
            break;
          }
          if (sub === "unpair") {
            z.group = name;
            saveLedger();
            R("\u{1F5FA}\uFE0F " + name + " stands on its own again.");
            break;
          }
          if (sub === "clear") {
            delete L.zones[name];
            saveLedger();
            audit(sender, "ZONE_CLEAR", name);
            R("\u{1F5FA}\uFE0F Cleared " + name + ".");
            break;
          }
          R("?zone \xB7 ?zone who \xB7 ?zone a|b <name> \xB7 ?zone pair <name> <group> \xB7 ?zone unpair <name> \xB7 ?zone clear <name>");
          break;
        }
        case "hypno": {
          const r = rec(sender);
          if (!r || !r.roles.length) {
            R("That's just for folks on the books, sugar.");
            break;
          }
          const v = String(args[0] || "").toLowerCase();
          if (v && !["on", "off"].includes(v)) {
            R("?hypno on lets your herd leader's voice lines reach you \xB7 ?hypno off stops them.");
            break;
          }
          r.hypno = v ? v === "on" : !r.hypno;
          saveLedger();
          audit(sender, "HYPNO", r.hypno ? "on" : "off");
          R(r.hypno ? "\u{1F300} Hypno: ON. If your herd leader sets voice lines for you, they'll drift in now and then, just for you. ?hypno off stops them any time." : "\u{1F300} Hypno: off. No voice lines will reach you.");
          break;
        }
        case "voice": {
          voiceLedger();
          const sub = String(args[0] || "").toLowerCase(), who = String(args[1] || "").toLowerCase();
          const key = who === "herd" ? "herd" : resolveTarget(args[1]);
          const slotOf = (k) => k === "herd" ? L.voice.herd[sender] = L.voice.herd[sender] || { on: false, lines: [], every: "15" } : L.voice.member[k] = L.voice.member[k] || { on: false, lines: [], every: "15", by: sender };
          if (!sub) {
            const h = L.voice.herd[sender], mine = Object.entries(L.voice.member).filter(([m, v2]) => v2.by === sender || herdLeaderOf(+m) === sender);
            R("\u{1F300} LISTEN TO MY VOICE\nYour herd: " + (h ? (h.on ? "on" : "off") + " \xB7 " + h.lines.length + " lines \xB7 every " + h.every : "not set") + (mine.length ? "\n" + mine.map(([m, v2]) => plainName(+m) + ": " + (v2.on ? "on" : "off") + " \xB7 " + v2.lines.length + " lines \xB7 every " + v2.every + (rec(+m) && rec(+m).hypno ? "" : " (they haven't said ?hypno on)")).join("\n") : "") + "\n\n?voice add herd|<who> <line> \xB7 ?voice on|off herd|<who> \xB7 ?voice list herd|<who> \xB7 ?voice remove herd|<who> <n> \xB7 ?voice every herd|<who> 5|15|30|chores");
            break;
          }
          if (!key) {
            R("For your herd or who, sugar? ?voice " + sub + " herd \u2026 or ?voice " + sub + " <name> \u2026");
            break;
          }
          if (!canVoice(sender, key)) {
            R(key === "herd" ? "You need a herd of your own for that, hon." : "Only " + plainName(key) + "'s herd leader (or a proprietor) can set their voice, sugar.");
            break;
          }
          const v = slotOf(key), label = key === "herd" ? "your herd" : plainName(key);
          if (sub === "on" || sub === "off") {
            v.on = sub === "on";
            saveLedger();
            audit(sender, "VOICE_" + sub.toUpperCase(), String(key));
            R("\u{1F300} Voice for " + label + ": " + sub + "." + (sub === "on" && key !== "herd" && !(rec(key) || {}).hypno ? " (They still have to say ?hypno on before any reach 'em.)" : ""));
            break;
          }
          if (sub === "add") {
            const line = args.slice(2).join(" ").trim();
            if (!line || line.length > 200) {
              R("Give me a line up to 200 characters, sugar. %name% becomes their name.");
              break;
            }
            if (v.lines.length >= 30) {
              R("That's 30 lines already, hon. Take one out first.");
              break;
            }
            v.lines.push(line);
            saveLedger();
            R("\u{1F300} Added for " + label + " (" + v.lines.length + " lines)." + (v.on ? "" : " It's off right now: ?voice on " + (key === "herd" ? "herd" : args[1])));
            break;
          }
          if (sub === "list") {
            R("\u{1F300} " + label + " (" + (v.on ? "on" : "off") + ", every " + v.every + ")\n" + (v.lines.length ? v.lines.map((l, i) => i + 1 + ". " + l).join("\n") : "no lines yet"));
            break;
          }
          if (sub === "remove") {
            const i = parseInt(args[2], 10) - 1;
            if (!(i >= 0 && i < v.lines.length)) {
              R("Which number, hon? ?voice list " + (key === "herd" ? "herd" : args[1]) + " shows them.");
              break;
            }
            v.lines.splice(i, 1);
            saveLedger();
            R("\u{1F300} Took that one out.");
            break;
          }
          if (sub === "every") {
            const e = String(args[2] || "").toLowerCase();
            if (!["5", "15", "30", "chores"].includes(e)) {
              R("How often, sugar? 5, 15 or 30 (minutes), or chores (only while they're workin' or bein' milked).");
              break;
            }
            v.every = e;
            saveLedger();
            R("\u{1F300} " + label + ": " + (e === "chores" ? "only during chores and milkin'" : "about every " + e + " minutes") + ".");
            break;
          }
          R("?voice \xB7 on|off \xB7 add \xB7 list \xB7 remove \xB7 every");
          break;
        }
        case "machine": {
          state.machineLoads = state.machineLoads || /* @__PURE__ */ new Map();
          const sub = String(args[0] || "").toLowerCase();
          if (!sub) {
            const on = (W.ChatRoomCharacter || []).map((c) => c.MemberNumber).filter((m) => rec(m) && gearOf(m).machine);
            R("\u2699\uFE0F MACHINES\n" + (on.length ? on.map((m) => {
              const g = gearOf(m).machine, l = state.machineLoads.get(m);
              return "  " + plainName(m) + " \xB7 " + g.name + " \xB7 " + (g.intensity < 0 ? "off" : "intensity " + g.intensity) + (l ? " \xB7 jar #" + l.jar + " loaded" : "");
            }).join("\n") : "  nobody's on one") + "\n\n?machine load <who> <jar> [hole] asks them first, then the machine empties it into 'em while it runs.");
            break;
          }
          const t = resolveTarget(args[1]);
          if (sub === "unload") {
            if (t && state.machineLoads.delete(t)) R("\u2699\uFE0F Unloaded.");
            else R("Nothin' loaded for them, hon.");
            break;
          }
          if (sub !== "load") {
            R("?machine \xB7 ?machine load <who> <jar> [hole] \xB7 ?machine unload <who>");
            break;
          }
          L.jars = (L.jars || []).filter((j) => Date.now() - j.t < CFG.JAR_DAYS * 864e5);
          const jar = L.jars.find((j) => String(j.id) === String(args[2] || "").replace(/^#/, ""));
          const hole = args[3] ? holeFrom(args[3]) : "vulva";
          if (!t || !jar || !hole) {
            R("Here's how, sugar: ?machine load <who> <jar number> [hole]. ?jars shows the shelf.");
            break;
          }
          if (!gearOf(t).machine) {
            R(plainName(t) + " isn't on a fuck machine or a Sybian, hon.");
            break;
          }
          if (!jarOk(t)) {
            R(plainName(t) + " has said never to jar insemination (?jarok off), so I won't even ask.");
            break;
          }
          const err = inseminateProblem(t, jar, hole);
          if (err) {
            R(err);
            break;
          }
          askJar(sender, t, jar.id, hole, true);
          R("\u2699\uFE0F I've asked " + plainName(t) + " first. On their yes it's loaded, and the machine does the rest.");
          break;
        }
        case "jarok": {
          const r = rec(sender);
          if (!r || !r.roles.length) {
            R("That's just for folks on the books, sugar. Say ?apply first!");
            break;
          }
          const v = String(args[0] || "").toLowerCase();
          if (v && !["on", "off", "yes", "no"].includes(v)) {
            R("Just say ?jarok on or ?jarok off, sweetie. Leave it blank and it flips.");
            break;
          }
          const on = v ? v === "on" || v === "yes" : r.jarok === false;
          if (on && limitBlocks(sender, "breed")) {
            R("Your hard limits rule that out, sugar, so I'll keep it off. If you want it, change your limits with staff first.");
            break;
          }
          r.jarok = on;
          if (!on) state.jarAsks.delete(sender);
          saveLedger();
          audit(sender, "JAROK", on ? "on" : "off");
          R(on ? "\u{1F489} Jar insemination: ON. Staff still have to ask you every single time, and no is always a fine answer." : "\u{1F489} Jar insemination: OFF. Nobody puts a jar in you, and staff can't even ask. ?jarok on turns it back on.");
          break;
        }
        case "rights": {
          const now = Date.now(), r = rec(sender);
          if (!r || !r.roles.length) {
            R("You need to be on the books first, sugar. Say ?apply!");
            break;
          }
          if (!args.length) {
            const mine = r.rights && r.rights.until > now ? "Only " + [r.rights.stud].concat(r.rights.allow || []).map(plainName).join(" or ") + " can take you till " + new Date(r.rights.until).toLocaleDateString() + "." : "Nobody holds breedin' rights on you.";
            const held2 = Object.entries(L.people).filter(([, x]) => x.rights && x.rights.stud === sender && x.rights.until > now).map(([m]) => plainName(parseInt(m, 10)));
            R("\u{1F50F} " + mine + (held2.length ? " You hold rights on " + held2.join(", ") + "." : "") + " ?rights <who> asks for theirs (they say ?accept), and ?rights off ends rights on you.");
            break;
          }
          if (/^(off|end|stop|clear)$/i.test(args[0])) {
            const who = args[1] ? resolveTarget(args[1]) : sender, rw = who && rec(who);
            if (!rw || !rw.rights) {
              R("No breedin' rights to end there, hon.");
              break;
            }
            if (who !== sender && rw.rights.stud !== sender && !isStaff(sender)) {
              R("That's not yours to end, sugar.");
              break;
            }
            const was = rw.rights.stud;
            rw.rights = null;
            saveLedger();
            R("\u{1F513} Breedin' rights ended: " + plainName(who) + " can catch from anybody again.");
            if (was !== sender) tell(was, "\u{1F513} Your breedin' rights on " + plainName(who) + " have ended, sugar.");
            break;
          }
          const t = resolveTarget(args[0]);
          if (!t || t === sender || !rec(t)) {
            R("Who're you askin' for, sugar? ?rights <who> [days], like ?rights Bessie 14. They'll need to say ?accept.");
            break;
          }
          const rt = rec(t), held = rt.rights && rt.rights.until > now ? rt.rights : null;
          const sub = String(args[1] || "").toLowerCase();
          if (held && ["allow", "disallow", "unallow", "days"].includes(sub)) {
            if (held.stud !== sender && !isStaff(sender)) {
              R("Only " + plainName(held.stud) + " (or staff) can change those rights, sugar.");
              break;
            }
            if (sub === "days") {
              const d = parseFloat(args[2]);
              if (!(d > 0 && d <= CFG.RIGHTS_MAX_DAYS)) {
                R("How many days from now, hon? 1 to " + CFG.RIGHTS_MAX_DAYS + ". For example: ?rights " + plainName(t) + " days 14");
                break;
              }
              held.until = now + d * 864e5;
              saveLedger();
              R("\u{1F50F} " + plainName(held.stud) + "'s rights on " + plainName(t) + " now run " + d + " more day(s), till " + new Date(held.until).toLocaleDateString() + ".");
              tell(t, "\u{1F50F} Your breedin' rights to " + plainName(held.stud) + " now run till " + new Date(held.until).toLocaleDateString() + ", sugar.");
              break;
            }
            const o = resolveTarget(args[2]);
            if (!o || !rec(o)) {
              R("Which stud, sugar? ?rights " + plainName(t) + " " + sub + " <stud>, like ?rights " + plainName(t) + " allow Rex.");
              break;
            }
            held.allow = (held.allow || []).filter((x) => x !== o);
            if (sub === "allow") held.allow.push(o);
            saveLedger();
            R("\u{1F50F} " + (sub === "allow" ? plainName(o) + "'s loads can take " + plainName(t) + " too now." : plainName(o) + " is off " + plainName(t) + "'s list.") + " Allowed: " + [held.stud].concat(held.allow).map(plainName).join(", ") + ".");
            tell(t, "\u{1F50F} " + (sub === "allow" ? plainName(held.stud) + " is lettin' " + plainName(o) + " breed you too, sugar." : plainName(o) + " can't catch you anymore, hon."));
            break;
          }
          if (!makesSemen(sender)) {
            R("Breedin' rights are for studs, hon. You'd need a penis (or ?futa on).");
            break;
          }
          const days = args[1] ? parseFloat(args[1]) : CFG.RIGHTS_DAYS;
          if (!(days > 0 && days <= CFG.RIGHTS_MAX_DAYS)) {
            R("How many days, sugar? 1 to " + CFG.RIGHTS_MAX_DAYS + ", or leave it out for " + CFG.RIGHTS_DAYS + ". For example: ?rights " + plainName(t) + " 14");
            break;
          }
          state.rightsAsk = state.rightsAsk || /* @__PURE__ */ new Map();
          state.rightsAsk.set(t, { stud: sender, at: now, days });
          tell(t, "\u{1F50F} " + plainName(sender) + " is askin' for breedin' rights on you, sugar: for " + days + " day(s) only their loads could take (they can let other studs in too). Say ?accept to say yes, or just ignore it.");
          R("\u{1F50F} I asked " + plainName(t) + " for you. If they say ?accept in the next 10 minutes, the rights are yours for " + days + " day(s). Then ?rights " + plainName(t) + " allow <stud> lets another stud in, and ?rights " + plainName(t) + " days <n> changes how long.");
          break;
        }
        case "accept": {
          const ask = state.rightsAsk && state.rightsAsk.get(sender);
          if (!ask || Date.now() - ask.at > 6e5) {
            R("There's nothin' waitin' on your yes right now, sugar.");
            break;
          }
          state.rightsAsk.delete(sender);
          const r = rec(sender);
          r.rights = { stud: ask.stud, until: Date.now() + (ask.days || CFG.RIGHTS_DAYS) * 864e5, since: Date.now(), allow: [] };
          saveLedger();
          audit(sender, "RIGHTS", ask.stud + "");
          if (onMap(sender) && onMap(ask.stud)) emote("\u{1F50F} " + plainName(sender) + " gives " + plainName(ask.stud) + " breedin' rights for " + (ask.days || CFG.RIGHTS_DAYS) + " day(s). Only " + plainName(ask.stud) + "'s seed can take 'em now. Everybody else is just for fun.", ask.stud);
          else {
            tell(ask.stud, "\u{1F50F} " + plainName(sender) + " said yes! You hold their breedin' rights for " + (ask.days || CFG.RIGHTS_DAYS) + " day(s).");
          }
          R("\u{1F50F} Done, sugar. For " + (ask.days || CFG.RIGHTS_DAYS) + " day(s) only " + plainName(ask.stud) + "'s loads can take you. ?rights off ends it any time.");
          break;
        }
        case "penis":
        case "cock": {
          const types = Object.keys(CFG.PENIS_TYPES);
          const help = "Types: " + types.map((k) => CFG.PENIS_TYPES[k].label === k ? k : k + " (" + CFG.PENIS_TYPES[k].label + ")").join(", ") + `. Set yours with ?penis <type>, like ?penis equine. Any of 'em can carry a knot: a crafted shot with "knotting" gives one (canine comes knotted). Shots with canine, equine, feline (or barbed), draconic, double cock or humanizer change the type.`;
          let t = sender, a = args.slice();
          if (a.length > 1 || a.length === 1 && !types.includes(a[0].toLowerCase()) && !/^(types|list)$/i.test(a[0])) {
            const w = resolveTarget(a[0]);
            if (w && w !== sender) {
              if (!isStaff(sender)) {
                R("Only staff can change somebody else's cock, sugar. ?penis <type> sets yours.");
                break;
              }
              t = w;
              a = a.slice(1);
            }
          }
          if (!rec(t) || !rec(t).roles.length) {
            R("You'll need to be on the books first, hon. ?apply! " + help);
            break;
          }
          if (!makesSemen(t) && !/^(types|list)$/i.test(a[0] || "")) {
            R("\u{1F346} " + (t === sender ? "You haven't" : plainName(t) + " hasn't") + " got a cock right now, hon. Wear one, or ?futa on, and then ?penis <type> picks the kind. ?penis types shows 'em.");
            break;
          }
          if (!a.length) {
            R("\u{1F346} " + plainName(t) + ": " + sizeName(t, "penis") + ", " + penisLabel(t) + (knotted(t) ? ", knot " + sizeName(t, "knot") : "") + ". " + help);
            break;
          }
          if (/^(types|list)$/i.test(a[0])) {
            R("\u{1F346} " + help);
            break;
          }
          const type = a[0].toLowerCase();
          if (!CFG.PENIS_TYPES[type]) {
            R("I don't know that kind, sugar. " + help);
            break;
          }
          setPenisType(t, type);
          if (isStaff(sender) && /^(knotted|knot)$/i.test(a[1] || "")) {
            prodOf(t).knot = true;
            prodOf(t).knotShot = true;
          }
          if (isStaff(sender) && /^(unknotted|noknot|no)$/i.test(a[1] || "")) {
            prodOf(t).knot = false;
            prodOf(t).knotShot = false;
          }
          saveLedger();
          audit(sender, "PENIS", t + " " + penisLabel(t));
          R("\u{1F346} Done! " + (t === sender ? "Yours is" : plainName(t) + "'s is") + " a " + penisLabel(t) + " cock now.");
          break;
        }
        case "species": {
          const kinds = Object.keys(CFG.SPECIES).filter((k2) => k2 !== "default");
          const row = (k2) => {
            const S = CFG.SPECIES[k2];
            return k2 + ": milk x" + S.milk + ", fertility x" + S.fert + ", litters of " + (S.litter[0] === S.litter[1] ? S.litter[0] : S.litter[0] + "-" + S.litter[1]);
          };
          if (!args.length) {
            R(TEXT.species);
            break;
          }
          if (/^(list|all|table)$/i.test(args[0])) {
            R("\u{1F43E} SPECIES & LITTERS\n" + kinds.map(row).join("\n") + "\nAnything else counts as: " + row("default").replace(/^default: /, "") + ". Set yours with ?species <animal>, like ?species bunny.");
            break;
          }
          let who = sender, animal = args.join(" ");
          if (args.length > 1) {
            const t = resolveTarget(args[0]);
            if (t && t !== sender && rec(t)) {
              if (!isStaff(sender)) {
                R("Only staff can set somebody else's species, sugar. ?species <animal> sets your own.");
                break;
              }
              who = t;
              animal = args.slice(1).join(" ");
            }
          }
          if (!rec(who)) {
            R("You need to be on the books first, sugar. Say ?apply!");
            break;
          }
          rec(who).species = animal.toLowerCase().trim().slice(0, 40);
          saveLedger();
          audit(sender, "SPECIES", who + " " + rec(who).species);
          const k = speciesKey(who);
          R("\u{1F43E} " + (who === sender ? "You're" : plainName(who) + " is") + " down as " + rec(who).species + " now, hon. " + (k === "default" ? "I don't have special numbers for that one, so it's " + row("default").replace(/^default: /, "") + ". ?species list shows the rest." : row(k).replace(/^[a-z]+: /, "That means ") + "."));
          break;
        }
        case "luxury":
          R(fill(TEXT.luxury, sender));
          break;
        case "doors":
          R(TEXT.doors);
          break;
        case "ping":
          if (channel === "chat") say("Right here and mindin' the books, " + plainName(sender) + "! \u{1F33E}", false, sender);
          else R("Right here and mindin' the books, " + plainName(sender) + "! \u{1F33E}");
          break;
        case "apply":
          startApplication(sender, channel);
          break;
        case "friend": {
          const mine = isFriend(sender) || addFriend(sender, true);
          later(askMutual, 1500);
          if (!mine) R("Shoot, I couldn't manage that just now, sugar. Try ?friend again in a little bit.");
          else if (canBeep(sender)) R("We're friends both ways, sugar! Beep me any time, from anywhere.\n\u{1F534} Beep 'safe' and everything stops.");
          else R("\u{1F33E} You're on my list, hon, so your beeps reach me. For mine to reach you, add me (" + CFG.BOT_MEMBER + ") to YOUR friend list too. Until then I'll whisper while you're here, and keep anything else for when you come back.\n\u{1F534} Beep 'safe' and everything stops.");
          break;
        }
        case "addfriend": {
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Who should I add, hon? Give me their member number, or their name if they're in the room or on the books. For example: ?addfriend 123456  or  ?addfriend Bessie");
            break;
          }
          const ok = addFriend(t, false);
          let n = "-";
          try {
            n = (W.Player.FriendList || []).length;
          } catch (e) {
          }
          R(ok ? "\u{1F514} Added " + plainName(t) + "! Friends: " + n : "They're already on my list, sugar, or it just wouldn't take.");
          break;
        }
        /* ── THE BOOKS ── */
        case "roster": {
          const all = Object.values(L.people);
          if (!all.length) {
            R("The books are plumb empty, sugar.");
            break;
          }
          const groups = {};
          for (const k of ROLE_ORDER) groups[k] = [];
          for (const r of all) {
            if (!r.roles || !r.roles.length) continue;
            const top = ROLE_ORDER.find((x) => r.roles.includes(x));
            if (top) groups[top].push(r);
          }
          const label = {
            PROPRIETOR: "\u{1F947} PROPRIETORS",
            HERDMASTER: "\u{1F948} HERDMASTERS",
            MANDATED: "\u{1F517} MANDATED FARMHANDS",
            FARMHAND: "\u{1F948} FARMHANDS",
            LIVESTOCK: "\u{1F404} LIVESTOCK",
            LUXURY: "\u{1F3E1} LUXURY GUESTS",
            GUEST: "\u{1F464} GUESTS",
            GLORYHOLE: "\u{1F573}\uFE0F INSTALLED"
          };
          const line = (r) => {
            const here = charFor(r.mn) ? " \u25CF" : "";
            const off = r.onDuty === false ? " \u{1F33E}" : "";
            const fc = isMandated(r.mn) || r.forced ? " \u{1F517}" : "";
            const sp = r.species ? " \xB7 " + r.species : "";
            const hm = (r.herds || []).length ? " \xB7 " + r.herds.map((h) => plainName(h.leader) + "'s").join(", ") : "";
            const ct = r.contractSigned ? "" : " \xB7 \u26A0\uFE0F";
            return "  \u2022 " + (r.name || "#" + r.mn) + " (" + r.mn + ")" + here + off + fc + sp + hm + ct;
          };
          const alias = { STOCK: "LIVESTOCK", STAFF: "FARMHAND", LUX: "LUXURY", ONCALL: "MANDATED" };
          const filter = (args[0] || "").toUpperCase();
          const key = alias[filter] || filter;
          if (key && groups[key]) {
            R("\u{1F4D6} " + label[key] + " (" + groups[key].length + ")\n\n" + (groups[key].length ? groups[key].map(line).join("\n") : "  (nobody)"));
            break;
          }
          const registered = all.filter((r) => r.roles && r.roles.length).length;
          let o = "\u{1F4D6} THE BOOKS \u2014 " + registered + " registered" + (all.length > registered ? " (" + (all.length - registered) + " more with a file but no role)" : "") + "\n";
          for (const k of ROLE_ORDER) {
            if (!groups[k].length) continue;
            o += "\n" + label[k] + " (" + groups[k].length + ")\n" + groups[k].map(line).join("\n") + "\n";
          }
          o += "\n\u25CF here \xB7 \u{1F33E} pastured \xB7 \u{1F517} on call \xB7 \u26A0\uFE0F no contract";
          R(o);
          break;
        }
        case "stock": {
          const spq = String(rest || "").toLowerCase().trim();
          const herd = Object.values(L.people).filter((r) => r.roles && r.roles.includes(ROLE.LIVESTOCK) && (!spq || (r.species || "").toLowerCase().includes(spq)));
          if (spq && !herd.length) {
            state.ambiguous = null;
            const who = resolveTarget(rest);
            if (who && rec(who)) {
              R(recordText(who, true, true));
              break;
            }
            if (state.ambiguous) break;
            R('No species called "' + spq + '" in the herd, and nobody by that name on the books, sugar. ?stock shows every species; ?record <who> shows one person.');
            break;
          }
          if (!herd.length) {
            R("No stock on the books yet, sugar.");
            break;
          }
          const bySpecies = {};
          for (const r of herd) {
            const s = (r.species || "unspecified").toLowerCase();
            (bySpecies[s] = bySpecies[s] || []).push(r);
          }
          let o = "\u{1F404} THE HERD \u2014 " + herd.length + " head\n";
          for (const [sp, list] of Object.entries(bySpecies).sort((a, b) => b[1].length - a[1].length)) {
            o += "\n" + sp.toUpperCase() + " (" + list.length + ")\n";
            o += list.map((r) => {
              const here = charFor(r.mn) ? " \u25CF" : "";
              const hm = (r.herds || []).length ? " \xB7 " + herdsLine(r.mn) : " \xB7 unclaimed";
              return "  \u2022 " + (r.name || "#" + r.mn) + here + hm;
            }).join("\n") + "\n";
          }
          R(o);
          break;
        }
        case "find": {
          const q = String(rest).toLowerCase().trim();
          if (!q) {
            R("Find who, sugar? Give me part of a name, a member number, a species or a stay type. For example: ?find Bessie  or  ?find cow  or  ?find 1234");
            break;
          }
          const hits = Object.values(L.people).filter((r) => (r.name || "").toLowerCase().includes(q) || String(r.mn).includes(q) || (r.species || "").toLowerCase().includes(q) || (r.stayType || "").toLowerCase().includes(q));
          if (!hits.length) {
            const arch = Object.values(L.archive || {}).filter((r) => (r.name || "").toLowerCase().includes(q) || String(r.mn).includes(q));
            R(arch.length ? "Nobody current, hon, but I found " + arch.length + " in the drawer:\n\n" + arch.map((r) => "  \u2022 " + (r.name || "#" + r.mn) + " (" + r.mn + ") \u2014 archived").join("\n") : "Couldn't find a soul by that, sugar. Try part of a name, a member number or a species.");
            break;
          }
          let o = "\u{1F50D} FOUND " + hits.length + "\n";
          for (const r of hits.slice(0, 20)) {
            o += "\n\u2022 " + (r.name || "#" + r.mn) + " (" + r.mn + ")" + (charFor(r.mn) ? " \u25CF" : "") + "\n    " + roleString(r.mn) + "\n    " + keyString(r.mn) + (r.species ? "\n    " + r.species : "") + ((r.herds || []).length ? "\n    " + herdsLine(r.mn) : "");
          }
          if (hits.length > 20) o += "\n\n\u2026and " + (hits.length - 20) + " more.";
          R(o);
          break;
        }
        case "signed": {
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Whose contract, hon? Say ?signed and their name or member number, like ?signed Bessie or ?signed 123456. It flips them between signed and unsigned.");
            break;
          }
          const r = rec(t, true);
          r.contractSigned = !r.contractSigned;
          saveLedger();
          audit(sender, "CONTRACT", t + " " + (r.contractSigned ? "signed" : "unsigned"));
          R(plainName(t) + "'s contract is marked " + (r.contractSigned ? "SIGNED \u2705" : "unsigned \u26A0\uFE0F") + " now, sugar.");
          break;
        }
        /* ── HERDS ── */
        case "claim": {
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Claim who, sugar? Say ?claim, their name or member number, then optionally temp or perm and a number of days. perm (or permanent) lasts till you let 'em go, and it's what you get if you leave it out. temp (or temporary) runs out by itself after 7 days, or after the days you give (a number on its own makes it temp too). For example: ?claim Bessie  or  ?claim 123456 temp 3  or  ?claim Daisy 14");
            break;
          }
          const why = claimBlocker(sender, t);
          if (why) {
            R(why);
            break;
          }
          const pend = state.pendingClaims.get(t);
          if (pend && pend.by !== sender && Date.now() - pend.at < CFG.CLAIM_ASK_TIMEOUT_MIN * 6e4) {
            R(plainName(t) + " already has somebody else's ask in front of 'em, hon. Give it a little bit.");
            break;
          }
          let type = CFG.DEFAULT_CLAIM_TYPE, days = CFG.DEFAULT_TEMP_DAYS;
          for (const a of args.slice(1)) {
            const low = String(a).toLowerCase();
            if (low === "temp" || low === "temporary") type = "temp";
            else if (low === "perm" || low === "permanent") type = "perm";
            else if (/^\d+$/.test(low)) {
              days = parseInt(low, 10);
              type = "temp";
            }
          }
          const word = herdWord(sender);
          state.pendingClaims.set(t, { by: sender, at: Date.now(), type, days });
          R("I asked 'em for you, sugar \u2014 " + type + (type === "temp" ? " (" + days + " days)" : "") + ". They'll need to say yes.");
          beep(
            t,
            "\u{1F33E} Ooh, " + plainName(sender) + " wants you in their " + word + " at B&B Farm, sweetie!\n\nTerms: " + (type === "temp" ? "TEMPORARY \u2014 " + days + " days, then you're unclaimed again." : "PERMANENT \u2014 till they let you go. Only they can.") + "\n\nBeep me 'yes' to accept, or 'no' to decline. No pressure either way, hon."
          );
          break;
        }
        case "release": {
          const t = resolveTarget(args[0]);
          if (!t || !rec(t)) {
            R("Release who, sugar? Say ?release and the name or member number of somebody in your own " + herdWord(sender) + ", like ?release Bessie or ?release 123456. ?myherd shows who you've got.");
            break;
          }
          if (!membership(t, sender)) {
            R(plainName(t) + " ain't in your " + herdWord(sender) + ", hon. Only their own leader can let 'em go.");
            break;
          }
          removeFromHerd(t, sender);
          audit(sender, "RELEASE", String(t));
          R("Done, sugar. They're released from your " + herdWord(sender) + ".");
          beep(t, "You're out of " + plainName(sender) + "'s " + herdWord(sender) + " now, sweetie. Still ours, though!");
          break;
        }
        case "myherd": {
          if (!canHoldHerd(sender)) {
            R("You don't keep a herd, sugar. Only staff and proprietors do.");
            break;
          }
          const spq = String(rest || "").toLowerCase().trim();
          const all = herdMembers(sender);
          const mine = all.filter((r) => !spq || (r.species || "").toLowerCase().includes(spq));
          const word = herdWord(sender);
          if (!mine.length) {
            R(spq ? "No " + spq + " in your " + word + ", hon. Plain ?myherd shows everybody." : "Your " + word + "'s empty, sugar. ?claim somebody to start one!");
            break;
          }
          const line = (r) => {
            const h = membership(r.mn, sender);
            return "  \u2022 " + (r.name || "#" + r.mn) + (charFor(r.mn) ? " \u25CF" : "") + " \u2014 " + (r.species || "unspecified") + (h.type === "temp" ? " \u2014 " + herdLabel(h) : "") + (r.pastureLock ? " \u{1F512}" : "");
          };
          const bySp = {};
          for (const r of mine) (bySp[(r.species || "unspecified").toLowerCase()] = bySp[(r.species || "unspecified").toLowerCase()] || []).push(r);
          let o = "\u{1F33E} YOUR " + word.toUpperCase() + " \u2014 " + all.length + "/" + herdCap(sender) + (spq ? " \xB7 showing " + spq : "") + "\n";
          for (const [sp, list] of Object.entries(bySp).sort((a, b) => b[1].length - a[1].length))
            o += "\n" + sp.toUpperCase() + " (" + list.length + ")\n" + list.map(line).join("\n") + "\n";
          o += "\n?myherd <species> to filter (like ?myherd cow) \xB7 ?herdcall <message> \xB7 ?herdname <word>";
          R(o);
          break;
        }
        case "herd": {
          const named = args[0] ? resolveTarget(args[0]) : null;
          const t = named || sender;
          const spq = (named ? args.slice(1) : args).join(" ").toLowerCase().trim();
          const mine = herdMembers(t).filter((r) => !spq || (r.species || "").toLowerCase().includes(spq));
          const word = herdWord(t);
          R(mine.length ? "\u{1F33E} " + plainName(t).toUpperCase() + "'S " + word.toUpperCase() + " (" + mine.length + ")\n\n" + mine.map((r) => "\u2022 " + (r.name || "#" + r.mn) + " \u2014 " + (r.species || "unspecified") + " \u2014 " + herdLabel(membership(r.mn, t))).join("\n") : plainName(t) + (spq ? " has no " + spq + ", hon." : " don't keep a " + word + ", hon.") + " Try ?herd <who>, like ?herd Daisy, or add a species: ?herd Daisy cow");
          break;
        }
        case "herdname": {
          if (!canHoldHerd(sender)) {
            R("You don't keep a herd, sugar. Only staff and proprietors do.");
            break;
          }
          const w = String(args[0] || "").toLowerCase();
          if (!/^[a-z][a-z ]{1,15}$/.test(w)) {
            R("Give me one short word, sugar: 2 to 16 letters, like herd, pack, pride, flock or stable. For example: ?herdname pack");
            break;
          }
          rec(sender, true).herdWord = w;
          saveLedger();
          R("Aww, your lot's a " + w + " now!");
          break;
        }
        case "herdcall": {
          if (!canHoldHerd(sender)) {
            R("You don't keep a herd, sugar. Only staff and proprietors do.");
            break;
          }
          const members = herdMembers(sender);
          if (!members.length) {
            R("There's nobody in your herd to call yet, sugar.");
            break;
          }
          const key = "herdcall:" + sender;
          const last = state.cooldowns.get(key) || 0;
          if (Date.now() - last < CFG.HERDCALL_COOLDOWN_MIN * 6e4) {
            R("You just called 'em, hon! Give it a couple minutes before you holler again.");
            break;
          }
          state.cooldowns.set(key, Date.now());
          const msg = rest || "Come to " + currentRoomName() + ".";
          for (const r of members) beep(r.mn, "\u{1F4E3} " + plainName(sender) + " calls their " + herdWord(sender) + ": " + msg);
          R("\u{1F4E3} Called all " + members.length + " of 'em for you!");
          audit(sender, "HERDCALL", msg);
          break;
        }
        case "herdsummon": {
          if (!isHerdmaster(sender)) {
            R("Sorry, sugar, that one's just for herdmasters and proprietors.");
            break;
          }
          const away = herdMembers(sender).filter((r) => !charFor(r.mn));
          if (!away.length) {
            R("Everybody's already here, hon!");
            break;
          }
          let n = 0;
          for (const r of away) if (summon(r.mn, "Summoned by " + plainName(sender) + ", their " + herdWord(sender) + " leader.", sender)) n++;
          R("\u{1F517} Sent " + n + " summons, sugar! It only works on folks whose BCX lets the office pull 'em.");
          break;
        }
        /* ── PASTURE LOCK ── */
        case "turnout": {
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Turn out who, sugar? Say ?turnout, their name or member number, and if you like a note they'll see. For example: ?turnout Laynie  or  ?turnout 232922 Go graze a while, darlin'.");
            break;
          }
          if (!canLockOut(sender, t)) {
            R("Sorry, hon, that one ain't yours to turn out. Only their herd leader (or whoever the farm lists for 'em) can.");
            break;
          }
          const r = rec(t, true);
          if (r.onDuty !== false) r.pastureStock = !r.roles.includes(ROLE.LIVESTOCK);
          r.onDuty = false;
          r.forced = false;
          if (!r.roles.includes(ROLE.LIVESTOCK)) r.roles.push(ROLE.LIVESTOCK);
          r.pastureLock = { by: sender, at: Date.now() };
          r.pastureNote = args.slice(1).join(" ");
          saveLedger();
          audit(sender, "TURNOUT", String(t));
          syncKeys(t, true);
          R("\u{1F512} " + plainName(t) + " is out in the pasture now and stays there till they're let up. ?letup " + t + " when you're ready.");
          beep(t, "\u{1F512} " + plainName(sender) + " turned you out to pasture" + (r.pastureNote ? ": " + r.pastureNote : "") + ".\n\nYou can't go back on duty till " + (herdLeaderOf(t) ? plainName(herdLeaderOf(t)) : plainName(sender)) + " lets you up, sweetie. Bronze key only till then.");
          break;
        }
        case "letup": {
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Let up who, sugar? Say ?letup and their name or member number, like ?letup Laynie or ?letup 221397.");
            break;
          }
          const r = rec(t);
          if (!r || !r.pastureLock) {
            R("They ain't locked out in the pasture, hon.");
            break;
          }
          if (!canLetUp(sender, t)) {
            R("Sorry, sugar, only " + plainName(herdLeaderOf(t) || r.pastureLock.by) + " can let 'em up.");
            break;
          }
          r.pastureLock = null;
          saveLedger();
          audit(sender, "LETUP", String(t));
          R("\u{1F513} " + plainName(t) + " can go back on duty whenever they like.");
          beep(t, "\u{1F513} " + plainName(sender) + " let you up, sweetie! Say ?onduty when you're ready.");
          break;
        }
        /* ── GOLD PROMOTION ── */
        case "goldkey": {
          if (!isProprietor(sender)) {
            R("Sorry, sugar, that one's just for the proprietors.");
            break;
          }
          const t = resolveTarget(args[0]);
          if (!t || !hasRole(t, ROLE.HERDMASTER)) {
            R("Who gets the gold key, hon? It has to be a herdmaster. Say ?goldkey, their name or member number, then on or off (leave it out and it's on). For example: ?goldkey Mistress on  or  ?goldkey 700 off");
            break;
          }
          const on = String(args[1] || "on").toLowerCase() !== "off";
          rec(t).goldKey = on;
          saveLedger();
          audit(sender, "GOLDKEY", t + " " + (on ? "on" : "off"));
          syncKeys(t, true);
          R("\u{1F947} " + plainName(t) + (on ? " carries gold on duty now!" : " is back to silver, hon."));
          beep(t, on ? "\u{1F947} Ooh, " + plainName(sender) + " trusted you with a gold key, sweetie! It's live whenever you're on duty." : "\u{1F947} Your gold key's been taken back, hon.");
          break;
        }
        /* ── ON CALL ── */
        case "forced": {
          const target = args[0] ? resolveTarget(args[0]) : sender;
          if (!target) {
            R("Who, sugar? Just ?forced flips your own on-call switch. Proprietors can name somebody else by name or member number, like ?forced Hand or ?forced 800.");
            break;
          }
          if (target !== sender && !isProprietor(sender)) {
            R("Sorry, hon, that's their switch to throw, not yours. Just ?forced flips your own.");
            break;
          }
          if (!isStaff(target)) {
            R("On-call's just for staff, sugar.");
            break;
          }
          if (isMandated(target)) {
            R(plainName(target) + " is a MANDATED farmhand, so they're always on call, hon. Only a proprietor can change that, and only by takin' the role off 'em.");
            break;
          }
          const r = rec(target, true);
          r.forced = !r.forced;
          saveLedger();
          audit(sender, "FORCED", target + " " + (r.forced ? "on" : "off"));
          if (target === sender) {
            R(r.forced ? "\u{1F517} You're on call now, " + plainName(sender) + "!\n\nWhen the office needs hands and nobody's about, I'll summon you \u2014 and if your BCX rule lets me, you'll come whether you fancied it or not, sugar.\n\nSay ?forced again to take it off. Goin' to pasture takes it off too." : "\u{1F513} You're off call, sweetie. I'll ask real nice from now on.");
          } else {
            R(plainName(target) + " on call: " + (r.forced ? "ON \u{1F517}" : "off"));
            beep(target, r.forced ? "\u{1F517} " + plainName(sender) + " put you on call at B&B Farm, sweetie! The office can summon you now." : "\u{1F513} " + plainName(sender) + " took you off call, hon.");
          }
          break;
        }
        case "summon": {
          if (!isHerdmaster(sender)) {
            R("Sorry, sugar, that one's just for herdmasters and proprietors.");
            break;
          }
          if (!args.length) {
            const pool = forcedStaff();
            R(pool.length ? "\u{1F517} ON CALL (" + pool.length + ")\n\n" + pool.map((m) => "  \u2022 " + plainName(m) + " (" + m + ")" + (isMandated(m) ? " \u2014 mandated" : "") + (charFor(m) ? " \u25CF here" : " \u2014 away")).join("\n") + "\n\n?summon <who> [spot] (like ?summon Daisy or ?summon Daisy barn) \xB7 ?summon all" : "Nobody's on call right now, sugar.");
            break;
          }
          if (String(args[0]).toLowerCase() === "all") {
            const n = summonHelp("Summoned by " + plainName(sender) + ".", sender, true, "staff");
            R(n ? "\u{1F517} Summoned " + n + ", hon! They'll land at the staff spot." : "Nobody's available right now, sugar. They're all on cooldown, or nobody's on call.");
            break;
          }
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Summon who, sugar? Say ?summon and a name or member number. Folks already here come right to your side; on-call staff in other rooms get pulled to the staff spot. Add a spot name to send 'em there instead. For example: ?summon Daisy  or  ?summon 800 barn");
            break;
          }
          const sp = args[1] ? String(args[1]).toLowerCase() : null;
          if (sp && !spotFor(sp)) {
            R("There's no spot called '" + sp + "', sugar. Say ?spot for the list, or leave the spot off.");
            break;
          }
          const r = rec(t);
          if (charFor(t)) {
            const pt = sp ? spotFor(sp) : spotBeside(sender);
            if (!pt) {
              R("I can't see where you're standin', sugar. Step onto the map and try again.");
              break;
            }
            if (!teleport(t, pt, true)) {
              R("I can't move folks right now, hon. I've lost my room admin rights.");
              break;
            }
            tell(t, "\u{1F517} " + plainName(sender) + " called you over, sugar.");
            audit(sender, "SUMMON_HERE", t + (sp ? " " + sp : ""));
            R("\u{1F517} Sent for " + plainName(t) + ". They'll turn up " + (sp ? "at the " + sp + " spot" : "right beside you") + " in a moment (I check, and send again if the game drops it).");
            break;
          }
          if (r && isStaff(t) && (r.forced || isMandated(t))) {
            const to = sp || "staff";
            R(summon(t, "Summoned by " + plainName(sender) + ".", sender, to) ? "\u{1F517} Summoned " + plainName(t) + "! They'll land at the " + (spotFor(to) ? to : "summon") + " spot." : "They were summoned real recent, hon. Give it a few minutes.");
            break;
          }
          if (!r) {
            R(plainName(t) + " isn't on the books, sugar, so I won't go callin' 'em.");
            break;
          }
          beep(t, "\u{1F33E} " + plainName(sender) + " would like you at " + currentRoomName() + " when you can, hon. No rush, and nobody's pullin' you.");
          audit(sender, "SUMMON_INVITE", String(t));
          R("\u{1F48C} " + plainName(t) + " isn't here and isn't on call, so I sent 'em a friendly invite instead, sugar.");
          break;
        }
        /* ── PERSONAL ── */
        case "where": {
          const C = charFor(sender);
          const pos = C && C.MapData && C.MapData.Pos;
          R(pos ? "\u{1F4CD} You're at X:" + pos.X + "  Y:" + pos.Y + ", sugar." : "Hmm, I can't see where you're standin', sugar. You need to be on the farm map.");
          break;
        }
        case "record": {
          const t = args[0] ? resolveTarget(args[0]) : sender;
          if (!t) {
            R("I don't know that one, sugar. Just ?record shows your own file; staff can add a name or member number, like ?record Bessie or ?record 123456.");
            break;
          }
          if (t !== sender && !isStaff(sender)) {
            R("Sorry, hon, that file's not yours to read. Just ?record shows your own.");
            break;
          }
          R(recordText(t, isStaff(sender) || t === sender, isStaff(sender)));
          break;
        }
        case "keys": {
          const t = args[0] ? resolveTarget(args[0]) : sender;
          if (!t) {
            R("I don't know that one, hon. Just ?keys shows your own; staff can add a name or member number, like ?keys Bessie or ?keys 123456.");
            break;
          }
          if (t !== sender && !isStaff(sender)) {
            R("Sorry, hon, those aren't yours to read. Just ?keys shows your own.");
            break;
          }
          R("\u{1F511} " + plainName(t) + "\n" + roleString(t) + "\n" + keyString(t) + "\n\nSay ?doors to see what each one opens, sugar.");
          break;
        }
        case "keysync": {
          const n = syncAllPresent(false);
          R("\u{1F511} Resynced " + n + " folks for you, hon." + (botIsAdmin() ? "" : "\n\u26A0\uFE0F I'm not room admin right now, so the keys won't stick."));
          break;
        }
        case "keydump": {
          const rows = (W.ChatRoomCharacter || []).filter((c) => c.MemberNumber !== CFG.BOT_MEMBER).map((C) => {
            const led = keysOf(C.MemberNumber).join("+") || "-";
            const ps = C.MapData && C.MapData.PrivateState;
            const act = ps ? ALL_TIERS.filter((t) => ps["HasKey" + t[0].toUpperCase() + t.slice(1)]).join("+") || "-" : "?";
            return "\u2022 " + plainName(C.MemberNumber) + "\n    ledger: " + led + "\n    theirs: " + act;
          });
          R("\u{1F511} LEDGER vs ACTUAL\n\n" + (rows.join("\n") || "nobody about right now"));
          break;
        }
        case "who":
          R(whoText());
          break;
        case "health": {
          if (!isProprietor(sender)) {
            R("Sorry, sugar, that one's just for the proprietors.");
            break;
          }
          R("\u{1FA7A} " + statusText());
          break;
        }
        /* ── SAFETY ── */
        case "safe":
        case "safeword":
        case "red": {
          say("\u{1F534} PAUSE CALLED. Everything stops, right now, everybody.", true, sender);
          beep(sender, "I've got you, " + plainName(sender) + ". Everything's stopped and I'm fetchin' somebody for you right now. You don't owe anybody an explanation. \u{1F534}", true);
          notifyStaff("\u{1F534} SAFEWORD from " + plainName(sender) + " (" + sender + "). Please go to them now.", false);
          audit(sender, "SAFEWORD", channel);
          addonsEmit("safe", sender);
          stopScene(sender);
          dropLeashes(sender);
          state.tours.delete(sender);
          {
            const r0 = rec(sender);
            if (r0 && r0.prod) {
              r0.prod.pin = null;
              r0.prod.unpinUntil = Date.now() + CFG.PROD.SAFEWORD_UNPIN_MIN * 6e4;
              saveLedger();
            }
          }
          if (rec(sender) && rec(sender).stocked) {
            rec(sender).stocked = null;
            saveLedger();
          }
          if (CFG.SUMMON_ON_SAFEWORD) {
            const n = summonHelp("\u{1F534} Safeword called by " + plainName(sender) + ".", sender, true, "safe");
            if (n) log("Summoned " + n + " on-call staff to a safeword.");
          }
          break;
        }
        case "stuck": {
          const C = charFor(sender);
          const pos = C && C.MapData && C.MapData.Pos;
          const now = Date.now();
          const last = state.stuckCooldown.get(sender) || 0;
          if (now - last < CFG.STUCK_COOLDOWN_MIN * 6e4) {
            R("I've already got help comin' for you, hon. Hold on, it'll just be a minute.");
            break;
          }
          state.stuckCooldown.set(sender, now);
          const where = pos ? pos.X + "," + pos.Y : "unknown";
          L.stuckLog.push({ t: now, mn: sender, name: plainName(sender), pos: where });
          if (L.stuckLog.length > 300) L.stuckLog = L.stuckLog.slice(-300);
          saveLedger();
          audit(sender, "STUCK", where);
          say("Hold still, " + plainName(sender) + ". I'm gettin' you some help.", true, sender);
          const staffHere = [];
          for (const k in L.people) {
            const m = parseInt(k, 10);
            if (isStaff(m) && onDuty(m) && charFor(m)) staffHere.push(m);
          }
          if (staffHere.length) {
            for (const m of staffHere) beep(m, "\u{1FAA2} " + plainName(sender) + " (" + sender + ") is wedged at " + where + ".", true);
            beep(sender, "\u{1FAA2} I've called for a hand and somebody's on their way. Sit tight, you're okay.", true);
          } else {
            beep(sender, "\u{1FAA2} Nobody's around right now, so I'm pullin' you out myself. Hold on just a moment.", true);
            notifyStaff("\u{1FAA2} " + plainName(sender) + " was stuck at " + where + ". Nobody was about, so I pulled 'em out.", true);
            if (CFG.SUMMON_ON_STUCK) summonHelp("\u{1FAA2} " + plainName(sender) + " is wedged at " + where + ".", sender, false, "staff");
            later(() => rescueTeleport(sender), 3e3);
          }
          break;
        }
        case "report": {
          R("Thank you for tellin' me, " + plainName(sender) + ". I've passed it to staff quietly, and somebody will look into it. You can always send more details with ?report and then what happened.");
          notifyStaff("\u26A0\uFE0F REPORT from " + plainName(sender) + " (" + sender + "): " + (rest || "(no detail)"), false);
          audit(sender, "REPORT", rest);
          break;
        }
        case "staff": {
          R("I've sent word, sugar. Somebody'll be right over to help.");
          notifyStaff("\u{1F64B} " + plainName(sender) + " (" + sender + ") is askin' for a hand.", true, true);
          if (CFG.SUMMON_ON_STAFF_CALL && !forcedStaff().some((m) => charFor(m))) {
            summonHelp("\u{1F64B} " + plainName(sender) + " asked for a hand.", sender, false, "staff");
          }
          break;
        }
        case "setrescue": {
          if (!isHerdmaster(sender)) {
            R("Sorry, sugar, that one's just for herdmasters and proprietors.");
            break;
          }
          const C = charFor(sender);
          const pos = C && C.MapData && C.MapData.Pos;
          if (!pos) {
            R("I can't see where you're standin', hon. You need to be on the farm map.");
            break;
          }
          L.spots.rescue = { X: pos.X, Y: pos.Y, by: sender, at: Date.now() };
          saveLedger();
          R("\u{1F4CD} Rescue spot set to " + pos.X + "," + pos.Y + ", sugar. (Same as ?spot set rescue.)");
          break;
        }
        case "stucklog": {
          if (!L.stuckLog.length) {
            R("Nobody's got wedged yet. Map's behavin' itself!");
            break;
          }
          const byPos = {};
          for (const s of L.stuckLog) {
            byPos[s.pos] = byPos[s.pos] || { n: 0, who: /* @__PURE__ */ new Set() };
            byPos[s.pos].n++;
            byPos[s.pos].who.add(s.name);
          }
          const rows = Object.entries(byPos).sort((a, b) => b[1].n - a[1].n);
          let o = "\u{1FAA2} STUCK SPOTS (" + L.stuckLog.length + " incidents)\n\nSpots that keep showin' up are map bugs, not misbehavin'.\n";
          for (const [pos, v] of rows.slice(0, 15)) o += "\n\u2022 " + pos + " \u2014 " + v.n + "\xD7 \u2014 " + Array.from(v.who).slice(0, 4).join(", ");
          R(o);
          break;
        }
        /* ── PAPERWORK ── */
        case "queue": {
          const mailLine = "\u{1F4EE} Messages: " + (state.queue.length + state.urgent.length) + " waitin' to send \xB7 " + Object.keys(L.mailbox || {}).length + " people with messages held \xB7 " + (state.mutual ? state.mutual.set.size : "?") + " online and beep-able";
          if (!L.applications.length) {
            R("Queue's empty, hon. Quiet week!\n" + mailLine);
            break;
          }
          let o = "\u{1F4CB} PENDING APPLICATIONS (" + L.applications.length + ")\n";
          L.applications.forEach((a, i) => {
            o += "\n" + (i + 1) + ". " + a.name + " (" + a.mn + ")" + (a.staffTrack ? " [staff]" : "") + "\n   " + ["role", "species", "gender", "stay", "depth"].map((k) => appAnswer(a, k) || "?").join(" \u2022 ");
          });
          o += "\n\nSay ?app and the number to read one, like ?app 1.\n" + mailLine;
          R(o);
          break;
        }
        case "app": {
          const n0 = String(args[0] || "");
          let a = /^\d{1,3}$/.test(n0) ? L.applications[parseInt(n0, 10) - 1] : null;
          if (!a && n0) {
            state.ambiguous = null;
            const who = resolveTarget(n0);
            if (who) {
              a = L.applications.find((x) => x.mn === who) || null;
              if (!a && rec(who) && rec(who).application) {
                R("\u{1F4CB} " + plainName(who) + " (" + who + "), approved\n\n" + applicationText(rec(who).application, false));
                break;
              }
              if (!a) {
                R(plainName(who) + " has no application on file, sugar. (Folks approved before the farm started keepin' them only have their limits, triggers and aftercare on ?record.)");
                break;
              }
            } else if (state.ambiguous) break;
          }
          if (!a) {
            R("There's no application like that, sugar. Say ?app and a number from the ?queue list (?app 1), or a name or member number (?app Bessie).");
            break;
          }
          const list = a.staffTrack ? QUESTIONS.concat(STAFF_QUESTIONS) : QUESTIONS;
          let o = "\u{1F4CB} APPLICATION \u2014 " + a.name + " (" + a.mn + ")\n" + new Date(a.at).toLocaleString() + "\n";
          if (a.byKey) list.forEach((q) => {
            o += "\n\u25B8 " + q.text.split("\n")[0] + "\n   " + (a.byKey[q.key] || "\u2014") + "\n";
          });
          else a.answers.forEach((ans, qi) => {
            o += "\n\u25B8 " + (OLD_ORDER[qi] || "question " + (qi + 1)) + "\n   " + ans + "\n";
          });
          o += "\n?approve " + a.mn + " livestock\n?deny " + a.mn;
          R(o);
          break;
        }
        case "approve":
        case "register": {
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Approve who, sugar? Say ?approve, their name or member number, then one or more roles separated by spaces: livestock (or stock), guest, luxury (or luxuryguest), gloryhole \u2014 and, for proprietors only, farmhand, mandated (or mandatedfarmhand), herdmaster. For example: ?approve 123456 livestock  or  ?approve Bessie livestock luxury");
            break;
          }
          if (!isStaff(sender)) {
            R("Sorry, sugar, approvals are just for staff.");
            break;
          }
          const roles = parseRoles(args.slice(1));
          if (!roles.length) {
            R("I need a role too, hon. Pick one or more, separated by spaces: livestock (or stock), guest, luxury (or luxuryguest), gloryhole \u2014 and, for proprietors only, farmhand, mandated (or mandatedfarmhand), herdmaster. For example: ?approve " + t + " livestock");
            break;
          }
          if ((roles.includes(ROLE.FARMHAND) || roles.includes(ROLE.MANDATED) || roles.includes(ROLE.HERDMASTER)) && !isProprietor(sender)) {
            R("Sorry, sugar, hirin' staff (farmhand, mandated, herdmaster) is just for the proprietors. You can still approve livestock, guest, luxury or gloryhole.");
            break;
          }
          const r = rec(t, true);
          r.name = plainName(t);
          r.registeredAt = Date.now();
          for (const role of roles) if (!r.roles.includes(role)) r.roles.push(role);
          const idx = L.applications.findIndex((a) => a.mn === t);
          let wants = null;
          if (idx >= 0) {
            wants = applyApplication(t, L.applications[idx]);
            keepApplication(t, L.applications[idx]);
            L.applications.splice(idx, 1);
          }
          saveLedger();
          audit(sender, "APPROVE", t + " " + roles.join("+"));
          syncKeys(t, true);
          if (CFG.FRIEND_ON_REGISTER) addFriend(t, true);
          let ready = "";
          if (wants && wants.depth && wants.stay && roles.includes(ROLE.LIVESTOCK)) {
            const d = durationFrom(wants.stay), dp = depthFrom(wants.depth);
            contractsLedger();
            L.contracts.push({
              key: Date.now().toString(36),
              mn: t,
              by: sender,
              tpl: dp.key,
              title: "B&B Farm \xB7 " + dp.label,
              depth: dp.key,
              durationMin: d.min,
              policy: dp.key === "fun" ? "either" : "author",
              rules: [],
              status: "prepared",
              at: Date.now()
            });
            saveLedger();
            ready = "\n\n\u{1F4DC} They asked for " + dp.label + ", " + d.label + ". It's ready when you are: ?contract show " + dp.key + " " + t + " to look it over, then ?contract offer " + dp.key + " " + t + " " + d.key + " to send it.";
          }
          R("\u2705 " + plainName(t) + " \u2014 " + roleString(t) + "\n\u{1F511} " + keyString(t) + (r.species ? "\n\u{1F43E} " + r.species : "") + (r.gender ? " \xB7 " + r.gender : "") + ready);
          outfitsLedger();
          if (L.outfitRules.onApprove && roles.includes(ROLE.LIVESTOCK) && outfitSlotFor(t)) later(() => offerOutfit(t, outfitSlotFor(t), "Welcome to the farm"), 4e3);
          beep(
            t,
            `\u{1F33E} You're in, ` + plainName(t) + `! Welcome to the family, sweetie. \u{1F495}

Standing: ` + roleString(t) + `
Keys:     ` + keyString(t) + `

Your keys are live right now, so go on and try the doors! ?doors shows what opens what, and ?record shows your file.

\u{1F514} I've put myself on your friend list. Beep me from anywhere on the property, even hogtied in the far corner. Beep 'safe' and everything stops.

Welcome to B&B Farm, hon. \u{1F33E}`
          );
          break;
        }
        case "deny": {
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Deny who, sugar? Say ?deny and their name or member number, like ?deny Bessie or ?deny 123456. ?queue shows who's waitin'.");
            break;
          }
          if (!isStaff(sender)) {
            R("Sorry, sugar, that's not your call to make.");
            break;
          }
          const idx = L.applications.findIndex((a) => a.mn === t);
          if (idx >= 0) L.applications.splice(idx, 1);
          saveLedger();
          audit(sender, "DENY", String(t));
          R("Denied and cleared, hon.");
          beep(t, "I had a look at your paperwork, " + plainName(t) + ", and it ain't quite a fit for us right now. No hard feelin's, sweetie. The gate's always open for a visit.");
          break;
        }
        case "unregister": {
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Unregister who, sugar? ?unregister <who> takes them off the books entirely, or ?unregister <who> <role> takes away just that role, like ?unregister Bessie luxury. Their paperwork gets archived, never shredded.");
            break;
          }
          if (!isHerdmaster(sender)) {
            R("Sorry, hon, that's for herdmasters and proprietors to decide.");
            break;
          }
          if (t === CFG.BOT_MEMBER || CFG.PROPRIETORS.includes(t) || hasRole(t, ROLE.PROPRIETOR)) {
            R("I can't unregister a proprietor, sugar, or take that role away. That's for good.");
            break;
          }
          const r = rec(t);
          if (!r || !r.roles || !r.roles.length) {
            R("They're not on the books, hon.");
            break;
          }
          const words = args.slice(1).map((w) => String(w).toLowerCase());
          if (words.some((w) => /^(proprietor|owner)s?$/.test(w))) {
            R("The proprietor role can't be taken away, sugar.");
            break;
          }
          let full = !words.length;
          if (words.length) {
            const roles = parseRoles(words);
            if (!roles.length) {
              R("I don't know that role, hon. Roles: livestock, guest, luxury, gloryhole, farmhand, mandated, herdmaster.");
              break;
            }
            const staffRoles = [ROLE.FARMHAND, ROLE.MANDATED, ROLE.HERDMASTER];
            if (roles.some((x) => staffRoles.includes(x)) && !isProprietor(sender)) {
              R("Only the proprietors take away staff roles, sugar.");
              break;
            }
            const had = roles.filter((x) => r.roles.includes(x));
            if (!had.length) {
              R(plainName(t) + " doesn't have " + (roles.length === 1 ? "that role" : "those roles") + ", hon.");
              break;
            }
            r.roles = r.roles.filter((x) => !roles.includes(x));
            if (r.roles.length) {
              saveLedger();
              audit(sender, "UNREGISTER_ROLE", t + " " + had.join(","));
              syncKeys(t, true);
              R("Done, sugar: " + plainName(t) + " is no longer " + had.map((x) => x.toLowerCase()).join(" or ") + ". They're still on the books as " + roleString(t) + ".");
              tell(t, "Your " + had.map((x) => x.toLowerCase()).join(" and ") + " standing was taken off, sugar. You're still on the farm's books as " + roleString(t) + ".");
              break;
            }
            full = true;
          }
          for (const k in L.people) {
            const p2 = L.people[k];
            if ((p2.herds || []).some((h) => h.leader === t)) p2.herds = p2.herds.filter((h) => h.leader !== t);
          }
          L.archive[t] = JSON.parse(JSON.stringify(r));
          delete L.people[t];
          saveLedger();
          audit(sender, "UNREGISTER", String(t));
          pushKeys(t, [], true);
          whitelistSync(true);
          R((words.length ? "That was their last role, so " : "") + "all done, sugar. " + plainName(t) + "'s keys are pulled, they're off the room whitelist, and their paperwork's tucked safe in the drawer.");
          beep(t, "Your contract's up, " + plainName(t) + ". Your keys are pulled, but the gate swings both ways, sweetie. I'll keep your paperwork safe in the drawer.");
          break;
        }
        case "grant": {
          const t = resolveTarget(args[0]);
          const tier = String(args[1] || "").toLowerCase();
          const hours = parseFloat(args[2] || "0");
          if (!t || !ALL_TIERS.includes(tier)) {
            R("Here's how, sugar: ?grant, their name or member number, a key (bronze, silver or gold), then hours if you want it to run out. Leave the hours out and it lasts till you ?revoke it. Gold is proprietors only. For example: ?grant Bessie silver 2  or  ?grant 123456 bronze");
            break;
          }
          if (!isHerdmaster(sender)) {
            R("Sorry, hon, grantin' keys is just for herdmasters and proprietors.");
            break;
          }
          if (tier === "gold" && !isProprietor(sender)) {
            R("Gold keys are just for the proprietors to hand out, sugar. Bronze or silver are fine.");
            break;
          }
          const r = rec(t, true);
          r.tempKeys = (r.tempKeys || []).filter((x) => x.tier !== tier);
          r.tempKeys.push({ tier, until: hours > 0 ? Date.now() + hours * 36e5 : null });
          saveLedger();
          audit(sender, "GRANT", t + " " + tier);
          syncKeys(t, true);
          R("\u{1F511} Granted! " + plainName(t) + " holds: " + keyString(t));
          beep(t, "\u{1F511} You've been handed a " + tier + " key" + (hours > 0 ? " for " + hours + " hours" : "") + ", sweetie! It's live right now.");
          break;
        }
        case "revoke": {
          const t = resolveTarget(args[0]);
          const tier = String(args[1] || "").toLowerCase();
          if (!t || !ALL_TIERS.includes(tier)) {
            R("Here's how, sugar: ?revoke, their name or member number, then the key (bronze, silver or gold). It takes back a key handed out with ?grant; keys that come with their standing stay put. For example: ?revoke Bessie silver  or  ?revoke 123456 bronze");
            break;
          }
          if (!isHerdmaster(sender)) {
            R("Sorry, hon, takin' keys back is just for herdmasters and proprietors.");
            break;
          }
          const r = rec(t);
          if (!r) {
            R("They're not on the books, hon.");
            break;
          }
          r.tempKeys = (r.tempKeys || []).filter((x) => x.tier !== tier);
          saveLedger();
          audit(sender, "REVOKE", t + " " + tier);
          syncKeys(t, true);
          R("\u{1F511} Revoked. They now hold: " + keyString(t));
          beep(t, "\u{1F511} Your " + tier + " key's been taken back, hon.");
          break;
        }
        case "pasture": {
          const r = rec(sender, true);
          if (r.onDuty !== false) r.pastureStock = !r.roles.includes(ROLE.LIVESTOCK);
          r.onDuty = false;
          if (!r.roles.includes(ROLE.LIVESTOCK)) r.roles.push(ROLE.LIVESTOCK);
          const wasForced = r.forced;
          r.forced = false;
          r.pastureNote = rest || "";
          saveLedger();
          audit(sender, "PASTURE", rest);
          syncKeys(sender, true);
          R("Turned out to pasture, " + plainName(sender) + "! Go on and graze, sweetie.\n\nStanding: " + roleString(sender) + "\nKeys:     " + keyString(sender) + (wasForced ? "\n\n\u{1F513} You're off call while you're grazin'." : "") + (isMandated(sender) ? "\n\n\u26A0\uFE0F You're mandated, sugar, so you're still summonable. That's the deal." : "") + "\n\nSilver and gold are put away till you say ?onduty. Enjoy the grass! \u{1F33E}");
          break;
        }
        case "onduty": {
          const r = rec(sender, true);
          if (r.pastureLock) {
            R("\u{1F512} You're bein' kept out in the pasture, sugar. Only " + plainName(herdLeaderOf(sender) || r.pastureLock.by) + " can let you up.");
            break;
          }
          r.onDuty = true;
          const strip = r.pastureStock === true;
          if (strip) r.roles = r.roles.filter((x) => x !== ROLE.LIVESTOCK);
          r.pastureStock = false;
          r.pastureNote = "";
          saveLedger();
          audit(sender, "ONDUTY", "");
          syncKeys(sender, true);
          R("Welcome back on duty, hon! Keys: " + keyString(sender) + (isMandated(sender) ? "\n\u{1F517} You're mandated, so you're on call as always." : "\nSay ?forced if you'd like to go on call."));
          break;
        }
        case "cover": {
          const r = rec(sender, true);
          const sub = String(args[0] || "").toLowerCase();
          if (sub === "add") {
            const line = args.slice(1).join(" ");
            if (!line) {
              R("Give me a line to say, sugar. It's what ?who shows while you're out in the pasture. For example: ?cover add The proprietors are off at the feed store.");
              break;
            }
            r.cover = r.cover || [];
            r.cover.push(line);
            saveLedger();
            R("Added! " + r.cover.length + " excuse" + (r.cover.length === 1 ? "" : "s") + " on file.");
          } else if (sub === "clear") {
            r.cover = [];
            saveLedger();
            R("All cleared, hon.");
          } else {
            const c = r.cover || [];
            R(c.length ? "\u{1F33E} YOUR COVER STORIES\n\n" + c.map((x, i) => i + 1 + ". " + x).join("\n") : "None on file yet, sugar. Add one with ?cover add and your line, like ?cover add The proprietors are off at the feed store. ?cover clear wipes them all.");
          }
          break;
        }
        case "staffadd": {
          if (!isProprietor(sender)) {
            R("Sorry, sugar, that one's just for the proprietors.");
            break;
          }
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Who are we hirin', sugar? Say ?staffadd, their name or member number, then the role: farmhand, mandated (or mandatedfarmhand), or herdmaster. Leave the role out and they're a farmhand. For example: ?staffadd Daisy  or  ?staffadd 123456 herdmaster");
            break;
          }
          const which = String(args[1] || "farmhand").toLowerCase();
          if (!["farmhand", "mandated", "mandatedfarmhand", "herdmaster"].includes(which)) {
            R("I don't know that role, sugar. It's farmhand, mandated (or mandatedfarmhand), or herdmaster. For example: ?staffadd Daisy  or  ?staffadd 123456 herdmaster");
            break;
          }
          const role = which === "herdmaster" ? ROLE.HERDMASTER : which === "mandated" || which === "mandatedfarmhand" ? ROLE.MANDATED : ROLE.FARMHAND;
          const r = rec(t, true);
          r.name = plainName(t);
          if (!r.roles.includes(role)) r.roles.push(role);
          saveLedger();
          audit(sender, "STAFFADD", t + " " + role);
          syncKeys(t, true);
          if (CFG.FRIEND_ON_REGISTER) addFriend(t, true);
          R("\u2705 " + plainName(t) + " \u2014 " + roleString(t) + "\n\u{1F511} " + keyString(t));
          beep(t, "\u{1F33E} Welcome aboard, sweetie! You've been taken on at B&B Farm as " + ROLE_PRETTY[role] + ".\n\u{1F511} " + keyString(t) + " \u2014 live right now." + (role === ROLE.MANDATED ? "\n\n\u{1F517} MANDATED means you're on call for good, sugar. The office can summon you and you don't get a say. Set your BCX rule to let me, and mind your boots." : "\n\nSay ?forced if you'd like to go on call.") + "\n\nSay ?staffhelp to see everything you can do.");
          break;
        }
        case "staffremove": {
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Take who off staff, sugar? Say ?staffremove and their name or member number, like ?staffremove Hand or ?staffremove 800.");
            break;
          }
          if (CFG.PROPRIETORS.includes(t)) {
            R("Oh, I can't do that, hon. Proprietors are bedrock.");
            break;
          }
          const r = rec(t);
          if (!r) {
            R("They're not on the books, hon.");
            break;
          }
          if ((r.roles.includes(ROLE.HERDMASTER) || r.roles.includes(ROLE.MANDATED)) && !isProprietor(sender)) {
            R("Sorry, sugar, only the proprietors can remove herdmasters and mandated farmhands.");
            break;
          }
          if (!isHerdmaster(sender)) {
            R("Sorry, hon, that's for herdmasters and proprietors to decide.");
            break;
          }
          r.roles = r.roles.filter((x) => x !== ROLE.FARMHAND && x !== ROLE.HERDMASTER && x !== ROLE.MANDATED);
          r.forced = false;
          saveLedger();
          audit(sender, "STAFFREMOVE", String(t));
          syncKeys(t, true);
          R("Done, sugar. " + plainName(t) + " is now " + roleString(t) + " \u2014 " + keyString(t));
          break;
        }
        case "note": {
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Whose file, hon? Say ?note, their name or member number, then your note. For example: ?note Bessie Loves praise after milkin'.");
            break;
          }
          const r = rec(t, true);
          r.notes = (r.notes ? r.notes + "\n" : "") + "[" + plainName(sender) + "] " + args.slice(1).join(" ");
          saveLedger();
          R("Got it, I've noted that on their file.");
          break;
        }
        /* ── SPOTS ── */
        case "spot":
        case "spots": {
          const sub = String(args[0] || "").toLowerCase();
          const name = String(args[1] || "").toLowerCase();
          if (!sub || sub === "list") {
            const names = Object.keys(L.spots).sort();
            const age = (s) => s.at ? Math.floor((Date.now() - s.at) / 864e5) : null;
            R(names.length ? "\u{1F4CD} SPOTS\n\n" + names.map((n) => "  \u2022 " + n + " \u2014 " + L.spots[n].X + "," + L.spots[n].Y + (age(L.spots[n]) !== null ? " \xB7 set " + (age(L.spots[n]) ? age(L.spots[n]) + "d ago" : "today") : "")).join("\n") + "\n\n?spot set <name> where you stand \xB7 ?spot clear <name> [more names] \xB7 ?spot clear speaker-* \xB7 ?spot clear all \xB7 ?spot go <name>" : "No spots set yet, hon. Stand somewhere and say ?spot set summon (or safe, staff, rescue, trough, barn, stocks, milking1).");
            break;
          }
          if (!isHerdmaster(sender)) {
            R("Sorry, sugar, settin' and usin' spots is for herdmasters and proprietors. Plain ?spot shows the list.");
            break;
          }
          if (sub === "clear" || sub === "remove" || sub === "delete") {
            const words = args.slice(1).map((w) => String(w).toLowerCase()).filter(Boolean);
            if (!words.length) {
              R("Which spot, sugar? ?spot clear <name> (or several names), ?spot clear speaker-* for all the speakers, or ?spot clear all.");
              break;
            }
            let hit;
            if (words[0] === "all") {
              if (!isProprietor(sender)) {
                R("Clearin' every spot is for proprietors, sugar. You can clear them by name.");
                break;
              }
              hit = Object.keys(L.spots);
              if (words[1] !== "yes") {
                R("That would clear all " + hit.length + " spots (" + hit.join(", ") + "). Say ?spot clear all yes to be sure.");
                break;
              }
            } else hit = Object.keys(L.spots).filter((n) => words.some((w) => w.endsWith("*") ? n.startsWith(w.slice(0, -1)) : n === w));
            if (!hit.length) {
              R("No spots match " + words.join(" ") + ", hon. Plain ?spot shows the list.");
              break;
            }
            for (const n of hit) delete L.spots[n];
            saveLedger();
            audit(sender, "SPOT_CLEAR", hit.join(" ").slice(0, 200));
            R("\u{1F4CD} Cleared " + hit.length + " spot" + (hit.length === 1 ? "" : "s") + ": " + hit.join(", ") + ".");
            break;
          }
          if (!/^[a-z][a-z0-9_-]{1,19}$/.test(name)) {
            R("Here's how spots work, sugar: ?spot (or ?spot list) shows them all \xB7 ?spot set <name> marks where you're standin' \xB7 ?spot clear <name> removes one \xB7 ?spot go <name> takes you there. A name is one word, 2 to 20 letters, numbers, - or _, startin' with a letter. The ones the farm uses: summon, safe, staff, rescue, trough, barn, stocks, milking1, milking2 and on. For example: ?spot set barn");
            break;
          }
          if (sub === "set") {
            const C = charFor(sender);
            const pos = C && C.MapData && C.MapData.Pos;
            if (!pos) {
              R("Hmm, I can't see where you're standin', hon. You need to be on the farm map.");
              break;
            }
            L.spots[name] = { X: pos.X, Y: pos.Y, by: sender, at: Date.now() };
            saveLedger();
            audit(sender, "SPOT", name + " " + pos.X + "," + pos.Y);
            R("\u{1F4CD} '" + name + "' is set to " + pos.X + "," + pos.Y + ", sugar!");
          } else if (sub === "place") {
            const x = parseInt(args[2], 10), y = parseInt(args[3], 10), wide = W.ChatRoomMapViewWidth || 40, high = W.ChatRoomMapViewHeight || 40;
            if (!(x >= 0 && y >= 0 && x < wide && y < high)) {
              R("I need a tile on the map, sugar: ?spot place " + name + " <x> <y>, like ?spot place speaker-barn 12 7.");
              break;
            }
            L.spots[name] = { X: x, Y: y, by: sender, at: Date.now() };
            saveLedger();
            audit(sender, "SPOT", name + " " + x + "," + y);
            R("\u{1F4CD} '" + name + "' is set to " + x + "," + y + ", sugar!");
          } else if (sub === "clear") {
            if (!L.spots[name]) {
              R("There's no spot called '" + name + "', hon. Plain ?spot shows the list.");
              break;
            }
            delete L.spots[name];
            saveLedger();
            audit(sender, "SPOT_CLEAR", name);
            R("\u{1F4CD} '" + name + "' is cleared, sugar.");
          } else if (sub === "go") {
            const pt = spotFor(name);
            if (!pt) {
              R("There's no spot called '" + name + "', hon. Plain ?spot shows the list.");
              break;
            }
            R(teleport(sender, pt, false) ? "\u{1F4CD} Off you go, sweetie!" : "Shoot, I can't move you. Are you in the farm, and am I still room admin?");
          } else R("Here's how spots work, sugar: ?spot (or ?spot list) shows them all \xB7 ?spot set <name> marks where you're standin' \xB7 ?spot clear <name> removes one \xB7 ?spot go <name> takes you there. A name is one word, 2 to 20 letters, numbers, - or _, startin' with a letter. The ones the farm uses: summon, safe, staff, rescue, trough, barn, stocks, milking1, milking2 and on. For example: ?spot set barn");
          break;
        }
        /* ── TIERS ── */
        case "tier": {
          const t = resolveTarget(args[0]);
          if (!t || !rec(t)) {
            R("Here's how, sugar: ?tier and their name or member number shows their tier. Add a tier to set it: degraded, naughty, new (or new stock), trained, prize. With naughty or degraded you can add minutes in the stocks too (up to 240). For example: ?tier Bessie  or  ?tier Bessie trained  or  ?tier 123456 naughty 30");
            break;
          }
          if (!args[1]) {
            R(plainName(t) + ": " + (tierOf(t) ? tierName(tierOf(t)) : "no tier yet"));
            break;
          }
          const mins = /^\d+$/.test(args[args.length - 1]) && args.length > 2 ? parseInt(args[args.length - 1], 10) : 0;
          const nt = parseTier(args.slice(1, mins ? -1 : void 0).join(""));
          if (!nt) {
            R("I don't know that tier, hon. Lowest first, they're: degraded \xB7 naughty \xB7 new (or new stock) \xB7 trained \xB7 prize. For example: ?tier " + plainName(t) + " trained  or  ?tier " + plainName(t) + " naughty 30");
            break;
          }
          if (t === sender && !isProprietor(sender)) {
            R("Nice try, sugar, but you can't set your own tier!");
            break;
          }
          const r = rec(t);
          const old = tierOf(t);
          r.tier = nt;
          saveLedger();
          audit(sender, "TIER", t + " " + (old || "-") + "\u2192" + nt);
          const up = CFG.TIERS.indexOf(nt) > CFG.TIERS.indexOf(old);
          if (r.tierUntil) {
            r.tierUntil = null;
            r.tierPrev = null;
          }
          const sm = Math.min(mins, CFG.STOCKS_MAX_MIN);
          R(plainName(t) + " is " + tierName(nt) + " now." + (mins && CFG.PUNISH_TIERS.includes(nt) ? " And into the stocks for " + sm + " minutes." : ""));
          if (mins && CFG.PUNISH_TIERS.includes(nt)) putInStocks(t, sm, sender);
          beep(t, CFG.PUNISH_TIERS.includes(nt) ? "\u{1F53B} Uh-oh, " + plainName(sender) + " dropped you to " + tierName(nt) + ". You'll have to earn your way back up, sugar." : up ? "\u2B06\uFE0F " + plainName(sender) + " moved you up to " + tierName(nt) + "! Such a good animal." : "\u{1F33E} " + plainName(sender) + " set you to " + tierName(nt) + ", hon.");
          break;
        }
        /* ── VET CARD ── */
        case "vet": {
          const t = resolveTarget(args[0]);
          const r = t ? rec(t) : null;
          if (!r) {
            R("Whose vet card, hon? Say ?vet and the name or member number of somebody on the books, like ?vet Bessie or ?vet 123456.");
            break;
          }
          let o = "\u{1FA7A} VET CARD \xB7 " + (r.name || plainName(t)) + " (" + t + ")" + (charFor(t) ? " \u25CF here" : "");
          o += "\n\n\u{1F404} WHO\n  " + roleString(t) + (tierOf(t) ? " \xB7 " + tierName(tierOf(t)) : "") + (r.species ? " \xB7 " + r.species : "");
          o += "\n  Body: " + bodyParts(t).filter((k) => k !== "knot").map((k) => k === "testes" ? "balls" : k === "penis" ? penisLabel(t) + " cock" : k).join(", ");
          {
            const pv = r.prod;
            if (pv && pv.preg) o += "\n\u{1F37C} Bred by " + pv.preg.sires.map(plainName).join(" & ") + ", due " + new Date(pv.preg.due).toLocaleDateString();
            if (r.rights && r.rights.until > Date.now()) o += "\n\u{1F50F} Breedin' rights: " + plainName(r.rights.stud);
          }
          if ((r.herds || []).length) o += "\nBelongs to: " + herdsLine(t);
          if (r.brand) o += "\nBrand: " + r.brand.mark;
          if (titleNames(t).length) o += "\nTitles: " + titleNames(t).join(", ");
          if (r.naughtyMarks) o += "\nNaughty marks: " + r.naughtyMarks + " (missed milk quota)";
          o += "\nContract: " + (r.contractSigned ? "signed \u2705" : "NOT signed \u26A0\uFE0F");
          o += "\n\n\u{1F90D} CARE\n\u{1F534} Hard limits: " + (r.limits || "none on file \u2014 ask first");
          o += "\n\u26A0\uFE0F Triggers: " + (r.triggers || "none on file");
          o += "\n\u{1F90D} Aftercare: " + (r.aftercare || "none on file");
          if (r.notes) o += "\n\u{1F4DD} Notes:\n" + r.notes;
          R(o);
          break;
        }
        /* ── BRANDS ── */
        case "brand": {
          const t = resolveTarget(args[0]);
          const r = t ? rec(t) : null;
          if (!r) {
            R("Here's how, sugar: ?brand, their name or member number, then the mark (up to 12 characters: initials, a symbol, a word). ?brand <who> clear takes it off, and ?brand <who> on its own shows it. For example: ?brand Bessie LA  or  ?brand 123456 clear");
            break;
          }
          const mark = args.slice(1).join(" ").trim();
          const mayBrand = isProprietor(sender) || !!membership(t, sender);
          if (!mark) {
            R(r.brand ? plainName(t) + " carries " + r.brand.mark + ", put there by " + plainName(r.brand.by) + "." : plainName(t) + " is unbranded. Add a mark to brand 'em, like ?brand " + plainName(t) + " LA");
            break;
          }
          if (mark.toLowerCase() === "clear") {
            if (!r.brand) {
              R("There's no brand on 'em to clear, hon.");
              break;
            }
            if (!isProprietor(sender) && r.brand.by !== sender) {
              R("Sorry, sugar, only " + plainName(r.brand.by) + " or a proprietor can take that off.");
              break;
            }
            r.brand = null;
            saveLedger();
            audit(sender, "BRAND_CLEAR", String(t));
            R("Brand's off, hon.");
            beep(t, "\u{1F33E} " + plainName(sender) + " took your brand off, sweetie.");
            break;
          }
          if (!mayBrand) {
            R("You can only brand stock in your own " + herdWord(sender) + ", hon.");
            break;
          }
          if (mark.length > 12) {
            R("Keep it short, sugar: initials, a symbol, or a word, 12 characters at most. For example: ?brand " + plainName(t) + " LA");
            break;
          }
          r.brand = { mark, by: sender, at: Date.now() };
          saveLedger();
          audit(sender, "BRAND", t + " " + mark);
          R("\u{1F525} " + plainName(t) + " carries " + mark + " now!");
          beep(t, "\u{1F525} " + plainName(sender) + " branded you, sweetie: " + mark + ". It shows on ?who and on your record.");
          break;
        }
        /* ── TEASING ── */
        case "tease": {
          const sub = String(args[0] || "list").toLowerCase();
          if (sub === "add") {
            const line = args.slice(1).join(" ").trim();
            if (!line) {
              R("Give me a line, sugar! ?tease add <line> adds one (%name% becomes their name), ?tease list shows them all, ?tease remove <number> takes one off. For example: ?tease add Somebody looks awful cute today, %name%.");
              break;
            }
            L.tease.push({ text: line, by: sender, at: Date.now() });
            saveLedger();
            audit(sender, "TEASE_ADD", line.slice(0, 60));
            R("Added! " + L.tease.length + " teasin' line" + (L.tease.length === 1 ? "" : "s") + " on file.");
          } else if (sub === "remove" || sub === "del") {
            const i = parseInt(args[1], 10) - 1;
            if (!(i >= 0 && i < L.tease.length)) {
              R("Which number, hon? Say ?tease remove and a number from ?tease list, like ?tease remove 2.");
              break;
            }
            const gone = L.tease.splice(i, 1)[0];
            saveLedger();
            audit(sender, "TEASE_REMOVE", gone.text.slice(0, 60));
            R("Took it off: " + gone.text);
          } else {
            const opted = Object.values(L.people).filter((r) => r.teaseOptIn).length;
            R(L.tease.length ? "\u{1F608} TEASING LINES (" + L.tease.length + ") \xB7 " + opted + " opted in\n\n" + L.tease.map((x, i) => i + 1 + ". " + x.text).join("\n") + "\n\n?tease add <line> \xB7 ?tease remove <n>" : "No lines yet, sugar. ?tease add <line> adds one (%name% becomes their name), ?tease list shows them all, ?tease remove <number> takes one off. For example: ?tease add Somebody looks awful cute today, %name%.");
          }
          break;
        }
        case "teaseme": {
          const r = rec(sender);
          if (!r || !r.roles.length) {
            R("That's just for folks on the books, sugar. Say ?apply first!");
            break;
          }
          const v = String(args[0] || "").toLowerCase();
          r.teaseOptIn = v ? v === "on" || v === "yes" : !r.teaseOptIn;
          state.teaseNext.delete(sender);
          saveLedger();
          R(r.teaseOptIn ? "\u{1F608} Ooh, you'll hear from me now and then while you're on the farm, sugar. Say ?teaseme off to stop." : "Alright, hon. No more whisperin' in your ear. Say ?teaseme on if you miss me.");
          break;
        }
        /* ── NOTICE BOARD ── */
        case "notice": {
          if (!args.length || !isProprietor(sender)) {
            R(L.notice ? "\u{1F4CC} NOTICE BOARD\n\n" + L.notice.text + "\n\n\u2014 " + plainName(L.notice.by) + ", " + new Date(L.notice.at).toLocaleDateString() : "Notice board's bare right now, hon.");
            break;
          }
          if (String(args[0]).toLowerCase() === "clear") {
            L.notice = null;
            saveLedger();
            R("Notice board's all cleared.");
            break;
          }
          L.notice = { text: rest, by: sender, at: Date.now() };
          saveLedger();
          audit(sender, "NOTICE", rest.slice(0, 80));
          R("\u{1F4CC} Pinned it up! Everybody who walks in gets it.");
          break;
        }
        case "appclear": {
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Whose interview, hon? Say ?appclear and their name or member number, like ?appclear Bessie or ?appclear 123456. It clears paperwork they started but never finished.");
            break;
          }
          if (!state.sessions.has(t)) {
            R(plainName(t) + " isn't in the middle of an interview, sugar.");
            break;
          }
          const s = state.sessions.get(t);
          state.sessions.delete(t);
          audit(sender, "APPCLEAR", String(t));
          R("Cleared " + plainName(t) + "'s half-done paperwork, sugar.");
          reply(t, "Your half-done paperwork got cleared, sugar. Say ?apply whenever you're ready to start fresh!", s.ch);
          break;
        }
        /* ── PRODUCTION & BREEDING ── */
        case "shotlog": {
          const rows = (L.shotLog || []).slice(-10).reverse();
          R(rows.length ? "\u{1F489} LAST SHOTS I SAW\n\n" + rows.map((x) => new Date(x.t).toLocaleTimeString() + " \u2014 " + plainName(x.by) + " \u2192 " + plainName(x.to) + "\n    " + x.item + " \xB7 tags: " + (x.tags.join(", ") || "none I know")).join("\n") : "I haven't seen a single shot yet, hon. If somebody just used an injector and it's not here, I'm not seein' the Inject at all.");
          break;
        }
        case "milkable": {
          const r = rec(sender);
          if (!r || !r.roles.length) {
            R("You'll need to be on the books first, hon. ?apply and we'll get you sorted. \u{1F33E}");
            break;
          }
          const v = String(args[0] || "").toLowerCase();
          if (v && !["on", "off", "yes", "no"].includes(v)) {
            R("Just say ?milkable on or ?milkable off, sweetie. Leave it blank and it flips.");
            break;
          }
          const now = v ? v === "on" || v === "yes" : !makesMilk(sender);
          if (now && limitBlocks(sender, "milk")) {
            R("Your hard limits rule that out, sugar, so I'll keep it off. If you want it, change your limits with staff first.");
            break;
          }
          r.milkable = now;
          prodOf(sender);
          saveLedger();
          audit(sender, "MILKABLE", now ? "on" : "off");
          R(now ? "\u{1F95B} You're milkable now, darlin'! You'll start fillin' up by the hour. ?stats to watch it, and ?help barn for how grades work." : "Alrighty, no more milk for you. ?milkable on whenever you change your mind. \u{1F49B}");
          break;
        }
        case "gender": {
          let t = sender, g = String(args[0] || "").toLowerCase();
          if (args.length > 1) {
            t = resolveTarget(args[0]);
            g = String(args[1] || "").toLowerCase();
            if (t !== sender && !isStaff(sender)) {
              R("Only staff can set somebody else's, sugar.");
              break;
            }
          }
          const r = t && rec(t);
          if (!r || !r.roles.length) {
            R("That's just for folks on the books, sugar. ?apply first!");
            break;
          }
          if (!g) {
            R((t === sender ? "You're" : plainName(t) + " is") + " down as " + (r.gender || "not set yet") + ", hon. Pick one with ?gender female, male, futa or femboy.");
            break;
          }
          if (!GENDERS.includes(g)) {
            R("Just one of these, hon: ?gender female, male, futa or femboy.");
            break;
          }
          if (g === "futa" && limitBlocks(t, "futa")) {
            R("Their hard limits rule out futa, sugar, so I'll leave it.");
            break;
          }
          const was = r.gender;
          r.gender = g;
          if (g === "futa") r.futa = true;
          else if (was === "futa") r.futa = false;
          prodOf(t);
          saveLedger();
          audit(sender, "GENDER", t + " " + g);
          R("\u{1F338} " + (t === sender ? "You're" : plainName(t) + " is") + " down as " + g + " now, sugar." + (g === "futa" ? " Futa makes milk and semen both." : "") + " It picks your farm outfit, too.");
          break;
        }
        case "futa": {
          const r = rec(sender);
          if (!r || !r.roles.length) {
            R("You'll need to be on the books first, hon. ?apply and we'll get you sorted. \u{1F33E}");
            break;
          }
          const v = String(args[0] || "").toLowerCase();
          if (v && !["on", "off", "yes", "no"].includes(v)) {
            R("Just say ?futa on or ?futa off, sweetie. Leave it blank and it flips.");
            break;
          }
          const on = v ? v === "on" || v === "yes" : !r.futa;
          if (on && limitBlocks(sender, "futa")) {
            R("Your hard limits rule that out, sugar, so I'll keep it off. If you want it, change your limits with staff first.");
            break;
          }
          r.futa = on;
          prodOf(sender);
          saveLedger();
          audit(sender, "FUTA", on ? "on" : "off");
          R(on ? "\u{1F338} Futa it is, darlin'! You'll make milk and semen both, you can breed with ?breed and ?cum, and you can be bred in the vulva too (if you've said ?breedable on). ?futa off whenever you like." : "Alrighty, futa's off. I'll go by what you're wearin' again, sugar. \u{1F49B}");
          break;
        }
        case "size":
        case "sizes": {
          let t = sender, a = args.slice();
          if (a.length && !partFrom(a[0])) {
            const w = resolveTarget(a[0]);
            if (!w || !rec(w)) {
              R("I don't know who that is, sugar. Here's how: ?size shows yours, ?size udder 5 sets yours. Staff can add a name first, like ?size Bessie or ?size Bessie butt 4.");
              break;
            }
            if (w !== sender && !isStaff(sender)) {
              R("Sorry, hon, only staff can set somebody else's sizes. Just ?size shows yours.");
              break;
            }
            t = w;
            a = a.slice(1);
          }
          if (!rec(t) || !rec(t).roles.length) {
            R("You'll need to be on the books first, hon. ?apply and we'll get you sorted. \u{1F33E}");
            break;
          }
          if (!a.length) {
            prodTick();
            const mine = bodyParts(t);
            const label = (k) => k === "penis" ? "Cock" : CFG.SIZES[k].label;
            const lines = mine.map((k) => "  " + label(k) + ": " + sizeName(t, k) + (k === "penis" ? ", " + penisLabel(t) : ""));
            const ex = { udder: "udder DD", penis: "penis 9", testes: "balls 5", vulva: "vulva snug", butt: "butt 3", throat: "throat 2" };
            const eg = mine.filter((k) => ex[k]).slice(0, 2).map((k) => "?size " + ex[k]).join(" or ");
            R("\u{1F4CF} " + plainName(t).toUpperCase() + "'S SIZES\n" + lines.join("\n") + "\n\nSet one with ?size <part> <size>, like " + eg + ". Your parts: " + mine.filter((k) => k !== "knot").map((k) => k === "testes" ? "balls" : k).join(", ") + ". \u2728Hyper sizes only come from shots. ?help body tells what they do.");
            break;
          }
          const part = partFrom(a[0]), S = part && CFG.SIZES[part];
          if (part && !hasPart(t, part)) {
            const w = noPartWhy(t, part);
            R(w.charAt(0).toUpperCase() + w.slice(1) + ".");
            break;
          }
          let lvl = parseInt(a[1], 10);
          if (S && isNaN(lvl) && a[1] && S.names) {
            const said = a.slice(1).join(" ").toLowerCase().replace(/\s*cups?$/, "");
            let i = S.names.indexOf(said);
            if (i < 0 && S.cups) i = S.cups.map((c) => c.toLowerCase()).indexOf(said);
            if (i >= 0) lvl = i + 1;
          }
          const top = S && S.natural;
          if (!S || !(lvl >= 1 && lvl <= S.max)) {
            R("Here's how, sugar: ?size, the part, then a size. Udder (or breasts, boobs, tits, chest) goes by cup, AA up to " + CFG.SIZES.udder.cups[CFG.SIZES.udder.natural - 1] + " (or 1 to " + CFG.SIZES.udder.natural + "). Balls (or testes, testicles, nuts), vulva (or pussy, cunt), butt (or ass, anus, anal) and throat (or mouth, oral) go from 1 to " + CFG.SIZES.udder.natural + " (or the name, like loose); penis (or cock, dick, shaft) goes by inches, 1 to " + CFG.SIZES.penis.natural + ". For example: ?size udder DD  or  ?size butt slightly gaped  or  ?size penis 9. Plain ?size shows 'em all.");
            break;
          }
          if (lvl > top) {
            R("Whoa, that's \u2728hyper, hon! " + S.label + " only goes past " + S.natural + (S.inches ? '"' : "") + ' with shots. Try an injector with "' + (CFG.SIZE_TAGS[part] ? CFG.SIZE_TAGS[part].up[0] : "growth") + '" on it.');
            break;
          }
          if (t === sender && !isStaff(sender) && !CFG.SIZE_SELF_SET) {
            R("Sizes are set by staff and shots here, hon. Ask a farmhand!");
            break;
          }
          setSize(t, part, lvl, true);
          saveLedger();
          audit(sender, "SIZE", t + " " + part + " " + lvl);
          R("\u{1F4CF} Got it! " + plainName(t) + "'s " + S.label.toLowerCase() + " is " + sizeName(t, part) + " now.");
          break;
        }
        case "measure": {
          const t = args[0] ? resolveTarget(args[0]) : sender;
          if (!t || !rec(t)) {
            R("Who're we measurin', sugar? ?measure does you, and staff can add a name or member number, like ?measure Bessie.");
            break;
          }
          if (t !== sender && !isStaff(sender)) {
            R("Only staff can measure somebody else, hon. ?measure does you!");
            break;
          }
          if (!charFor(t)) {
            R(plainName(t) + " has to be here on the farm to get measured, sugar.");
            break;
          }
          prodTick();
          const mp = bodyParts(t), nm = plainName(t), say2 = [];
          if (mp.includes("udder")) say2.push("loops the tape round " + nm + "'s chest and gives each breast a heft: " + CFG.SIZES.udder.cups[udderLevel(t) - 1] + " cup, " + CFG.SIZES.udder.names[udderLevel(t) - 1]);
          if (mp.includes("penis")) say2.push("lays the tape along their " + penisLabel(t) + " cock: " + sizeOf(t, "penis") + " inches, " + sizeWord("penis", sizeOf(t, "penis")) + (mp.includes("knot") ? ", knot " + sizeWord("knot", sizeOf(t, "knot")) : ""));
          if (mp.includes("testes")) say2.push("cups their balls in her palm: " + sizeWord("testes", sizeOf(t, "testes")));
          const holes = ["vulva", "butt", "throat"].filter((k) => mp.includes(k)).map((k) => ({ vulva: "pussy", butt: "ass", throat: "throat" })[k] + " " + sizeWord(k, sizeOf(t, k)));
          if (holes.length) say2.push("checks how much they'll take: " + holes.join(", "));
          const belly = bellyWord(t);
          if (belly) say2.push("pats a belly that's " + belly);
          emote("\u{1F4CF} The farm girl pulls out her tape measure and gets right up close with " + nm + ". She " + say2.join("; she ") + ". She jots it all down with a wicked little grin.", t);
          break;
        }
        case "freeuse":
        case "tally":
        case "eggs": {
          const r = rec(sender);
          if (!r || !r.roles.length) {
            R("That's just for folks on the books, sugar. Say ?apply first!");
            break;
          }
          const v = String(args[0] || "").toLowerCase();
          if (v && !["on", "off", "yes", "no"].includes(v)) {
            R("Just say ?" + cmd + " on or ?" + cmd + " off, sweetie. Leave it blank and it flips.");
            break;
          }
          const on = v ? v === "on" || v === "yes" : !r[cmd];
          if (on && (limitBlocks(sender) || cmd === "eggs" && limitBlocks(sender, "eggs"))) {
            R("Your hard limits rule that out, sugar, so I'll keep it off.");
            break;
          }
          if (on && cmd === "freeuse" && !r.breedable) {
            R("You'll need ?breedable on first, sugar. Then ?freeuse on lets any stud have you without askin'.");
            break;
          }
          r[cmd] = on;
          saveLedger();
          audit(sender, cmd.toUpperCase(), on ? "on" : "off");
          R({
            freeuse: on ? "\u{1F513} Free use: ON. Any stud can breed or paint you without askin' first. ?freeuse off any time and they'll have to ask again." : "\u{1F510} Free use: off. Studs have to ask, and you say yes or no.",
            tally: on ? "\u270F\uFE0F Tally marks: ON. I'll count every load on your thigh, show it on ?who, and you can make the board as cumdump of the day." : "\u270F\uFE0F Tally marks are off the board. I still count 'em on your ?stats.",
            eggs: on ? "\u{1F95A} Eggs: ON. A draconic stud's load might leave a clutch in you; a tie makes it likelier." : "\u{1F95A} Eggs: off. No clutches for you."
          }[cmd]);
          break;
        }
        case "edge": {
          const t = resolveTarget(args[0]);
          if (!t || !rec(t)) {
            R("Who're we edgin', sugar? ?edge <who>, like ?edge Rex or ?edge Bessie. A stud's next load gets bigger; a pussy edged gets likelier to take the next breedin'. Futa: ?edge <who> cock or pussy.");
            break;
          }
          if (limitBlocks(t)) {
            R("Their limits rule that out, sugar.");
            break;
          }
          const away = missing(sender, t);
          if (away) {
            R(away === sender ? "You've gotta be here on the map, sugar." : plainName(t) + " has to be here on the map, hon.");
            break;
          }
          const want = String(args[1] || "").toLowerCase();
          const pussy = /^(pussy|vulva|cunt|clit)$/.test(want) || !/^(cock|penis|dick)$/.test(want) && !makesSemen(t);
          if (pussy) {
            if (!hasVulva(t)) {
              R(plainName(t) + " hasn't got a pussy to edge, hon.");
              break;
            }
            if (holeBlocked(t, "vulva")) {
              R(plainName(t) + "'s pussy is locked away under " + holeBlocked(t, "vulva") + ", sugar.");
              break;
            }
            const vp = prodOf(t), now2 = Date.now();
            if (now2 - (vp.vEdgeAt || 0) < 6e4) {
              R("Let 'em catch their breath a minute, sugar.");
              break;
            }
            if (now2 - (vp.vEdgeAt || 0) > CFG.VEDGE_HOURS * 36e5) vp.vEdges = 0;
            vp.vEdgeAt = now2;
            vp.vEdges = Math.min(CFG.EDGE_MAX, (vp.vEdges || 0) + 1);
            if (!runScene("edgeVulva", t, { n: plainName(t), b: plainName(sender), bMn: sender, k: vp.vEdges, icon: "\u{1F608}" }))
              emote("\u{1F608} " + plainName(sender) + " works " + plainName(t) + "'s pussy right to the brink, then pulls away. Edge number " + vp.vEdges + ".", t);
            if (vp.vEdges >= CFG.EDGE_PENT) later(() => emote("\u{1F624} " + plainName(t) + " is edged so raw they're drippin' down their thighs, achin' to be bred. The next one's gonna take, sure as anything.", t), 6e4);
            saveLedger();
            audit(sender, "EDGE", t + " pussy " + vp.vEdges);
            R("\u{1F608} Edged " + plainName(t) + "'s pussy (" + vp.vEdges + "). Their next breedin' is " + Math.round(100 * CFG.VEDGE_X * vp.vEdges) + "% likelier to take, for the next " + CFG.VEDGE_HOURS + " hours.");
            break;
          }
          if (!makesSemen(t)) {
            R(plainName(t) + " hasn't got a cock to edge, hon.");
            break;
          }
          const sp = prodOf(t), now = Date.now();
          if (now - (sp.edgeAt || 0) < 6e4) {
            R("Let 'em catch their breath a minute, sugar.");
            break;
          }
          sp.edgeAt = now;
          sp.edges = (sp.edges || 0) + 1;
          const n = plainName(t), by = plainName(sender), k = sp.edges;
          const lines = [
            by + " strokes " + n + " slow and tight right up to the edge, then lets go. Their cock throbs, leakin', with nothin' to show for it.",
            by + " works " + n + " until they're beggin' and shakin', then stops cold. A desperate, whiny groan. That's " + k + ".",
            n + " bucks into " + by + "'s hand, so close, so close, and " + by + " pulls away with a grin. Edge number " + k + "."
          ];
          emote("\u{1F608} " + lines[Math.floor(Math.random() * lines.length)], t);
          if (sp.edges >= CFG.EDGE_PENT && !sp.pentUp) {
            sp.pentUp = true;
            emote("\u{1F624} " + n + " is edged so raw their balls ache. All pent up now, and the next load's gonna be enormous.", t);
          }
          saveLedger();
          audit(sender, "EDGE", t + " " + sp.edges);
          R("\u{1F608} Edged " + n + " (" + sp.edges + "). Next load: +" + Math.round(100 * CFG.EDGE_X * Math.min(sp.edges, CFG.EDGE_MAX)) + "%.");
          break;
        }
        case "praise":
        case "degrade": {
          const r = rec(sender);
          if (!r || !r.roles.length) {
            R("That's just for folks on the books, sugar.");
            break;
          }
          const v = String(args[0] || "").toLowerCase();
          if (v && !["on", "off", "yes", "no"].includes(v)) {
            R("Just say ?" + cmd + " on or ?" + cmd + " off, sweetie.");
            break;
          }
          const key = cmd === "praise" ? "praiseMe" : "degradeMe";
          const on = v ? v === "on" || v === "yes" : !r[key];
          if (on && cmd === "degrade" && /\\b(degrad\\w*|humiliat\\w*|name.?call\\w*|insult\\w*)\\b/i.test(r.limits || "")) {
            R("Your hard limits rule that out, sugar.");
            break;
          }
          r[key] = on;
          saveLedger();
          R(cmd === "praise" ? on ? "\u{1F497} Praise: ON. When staff tell you you're a good girl (good cow, good pup\u2026), I'll count it and show everybody how you glow." : "\u{1F497} Praise counting is off." : on ? "\u{1F940} Degradation: ON. When staff call you a slut, a breeder, a cow and the like, I'll count it and show the blush." : "\u{1F940} Degradation counting is off.");
          break;
        }
        case "yes":
        case "no": {
          const plainTalk = (channel === "whisper" || channel === "chat") && !/^\s*[?!.\-\/]/.test(String(raw));
          if (!answerPending(sender, cmd === "yes") && !plainTalk) R("There's nothin' waitin' on a yes or no from you right now, hon.");
          break;
        }
        case "wash": {
          const t = args[0] && isStaff(sender) ? resolveTarget(args[0]) : sender;
          const p2 = t && rec(t) ? prodOf(t) : null;
          if (!p2 || !paintedText(t)) {
            R((t === sender ? "You're" : plainName(t) + " is") + " clean as a whistle, sugar.");
            break;
          }
          const was = paintedText(t);
          p2.painted = null;
          saveLedger();
          if (onMap(t)) emote("\u{1F6BF} " + plainName(t) + " gets hosed down at the trough, washin' the " + was + " clean. Shame, it was a good look.", t);
          else R("All washed up, sugar.");
          break;
        }
        case "quota": {
          let t = sender;
          if (args[0]) {
            t = resolveTarget(args[0]);
            if (!t || !rec(t)) {
              R("I don't know who that is, sugar.");
              break;
            }
            if (t !== sender && !isStaff(sender)) {
              R("Only staff can look at somebody else's quota, hon.");
              break;
            }
          }
          const r = rec(t);
          if (!r) {
            R("You need to be on the books first, sugar.");
            break;
          }
          if (args[1]) {
            if (!isStaff(sender)) {
              R("Only staff can set quotas, hon.");
              break;
            }
            const v = String(args[1]).toLowerCase();
            if (v === "clear") {
              r.naughtyMarks = 0;
              saveLedger();
              R("\u{1F4CB} " + plainName(t) + "'s naughty marks are wiped clean.");
              break;
            }
            if (v === "default") delete r.quota;
            else if (v === "off") r.quota = 0;
            else {
              const n = parseFloat(v);
              if (!(n > 0)) {
                R("Give me mL, off, default or clear, sugar. e.g. ?quota " + plainName(t) + " 1500");
                break;
              }
              r.quota = Math.round(n);
            }
            saveLedger();
            audit(sender, "QUOTA", t + " " + v);
            R("\u{1F4CB} " + plainName(t) + "'s daily quota: " + (quotaOf(t) ? ml(quotaOf(t)) : "none") + ".");
            break;
          }
          const q = quotaOf(t);
          if (!q) {
            R("\u{1F4CB} " + (t === sender ? "You don't" : plainName(t) + " doesn't") + " have a milk quota, sugar.");
            break;
          }
          R("\u{1F4CB} " + plainName(t) + "'s quota: " + ml(milkedOn(t, dayKey())) + " of " + ml(q) + " in the pail today. Streak: " + (r.quotaStreak || 0) + " (at " + CFG.QUOTA_STREAK_UP + " you move up a tier). Naughty marks: " + (r.naughtyMarks || 0) + ". Stalls and hand milkin' count; nursin' doesn't.");
          break;
        }
        case "nomilk": {
          const t = resolveTarget(args[0]);
          if (!t || !rec(t)) {
            R("Here's how, sugar: ?nomilk <who> <hours> caps their teats, ?nomilk <who> off lifts it. e.g. ?nomilk Bessie 6");
            break;
          }
          if (limitBlocks(t, "milk")) {
            R("Their limits rule out milk play, sugar.");
            break;
          }
          const p2 = prodOf(t);
          if (/^(off|stop|lift)$/i.test(args[1] || "")) {
            p2.milkDeniedUntil = 0;
            saveLedger();
            R("\u{1F95B} " + plainName(t) + "'s teats are uncapped.");
            tell(t, "\u{1F95B} Your teats are uncapped, sugar. Go get milked!");
            break;
          }
          const hh = parseFloat(args[1]);
          if (!(hh > 0 && hh <= 72)) {
            R("How many hours, sugar? 1 to 72. e.g. ?nomilk " + plainName(t) + " 6");
            break;
          }
          p2.milkDeniedUntil = Date.now() + hh * 36e5;
          saveLedger();
          audit(sender, "NOMILK", t + " " + hh + "h");
          R("\u{1F6AB} Capped " + plainName(t) + " for " + hh + " hours.");
          if (onMap(t)) emote("\u{1F6AB} " + plainName(sender) + " snaps little caps over " + plainName(t) + "'s nipples. No milkin' for " + hh + " hours, no matter how full and achy those udders get.", t);
          else tell(t, "\u{1F6AB} " + plainName(sender) + " capped your teats for " + hh + " hours, sugar. No milkin' till then.");
          break;
        }
        case "inspect": {
          const t = resolveTarget(args[0]);
          if (!t || !rec(t)) {
            R("Who're we inspectin', sugar? ?inspect <who>, like ?inspect Bessie.");
            break;
          }
          const away = missing(sender, t);
          if (away) {
            R(away === sender ? "You've gotta be here on the map, sugar." : plainName(t) + " has to be here on the map, hon.");
            break;
          }
          prodTick();
          const p2 = prodOf(t), parts = bodyParts(t), n = plainName(t), I0 = plainName(sender), bits = [];
          bits.push(I0 + " takes " + n + " by the jaw and checks their teeth" + (tierOf(t) ? ": a " + tierName(tierOf(t)) + " specimen" : "") + (rec(t).species ? ", " + rec(t).species + " stock" : "") + ".");
          if (parts.includes("udder")) bits.push("Hefts each breast: " + CFG.SIZES.udder.cups[udderLevel(t) - 1] + " cup" + (makesMilk(t) ? ", " + Math.round(100 * p2.milk / Math.max(1, milkCap(t))) + "% full" + (p2.milk > milkCap(t) * 0.6 ? ", and a bead of milk wells up at the squeeze" : "") : "") + ".");
          if (parts.includes("penis")) bits.push("Rolls " + n + "'s " + penisLabel(t) + " cock in a palm, " + sizeOf(t, "penis") + " inches, and squeezes those " + sizeWord("testes", sizeOf(t, "testes")) + " balls" + (p2.semen > semenCap(t) * 0.7 ? ", heavy and full" : "") + ".");
          const holes = [];
          if (parts.includes("vulva")) holes.push("pussy " + sizeWord("vulva", sizeOf(t, "vulva")) + ((p2.held.vulva || 0) >= 5 ? ", still drippin' " + ml(p2.held.vulva) : ""));
          holes.push("ass " + sizeWord("butt", sizeOf(t, "butt")) + ((p2.held.butt || 0) >= 5 ? ", still holdin' " + ml(p2.held.butt) : ""));
          bits.push("Spreads 'em open for a good look: " + holes.join("; ") + ".");
          const belly = bellyWord(t);
          if (belly) bits.push("Pats a belly that's " + belly + ".");
          if (paintedText(t)) bits.push("Notes the dried seed on their " + paintedText(t) + ".");
          if (inHeat(p2)) bits.push("Sniffs: in heat, and dripping for it.");
          bits.push(I0 + " marks the card" + (makesMilk(t) ? ": milk grade " + milkGrade(t) : "") + ". Good stock.");
          emote("\u{1F50D} " + bits.join(" "), t);
          break;
        }
        case "breedable":
        case "fertile":
        case "naturalheat": {
          const r = rec(sender);
          if (!r || !r.roles.length) {
            R("That's just for folks on the books, sugar. Say ?apply first!");
            break;
          }
          const field = cmd === "naturalheat" ? "naturalHeat" : cmd;
          const v = String(args[0] || "").toLowerCase();
          if (v && !["on", "off", "yes", "no"].includes(v)) {
            R("Just say ?" + cmd + " on or ?" + cmd + " off, sweetie. Leave it blank and it flips. For example: ?" + cmd + " on");
            break;
          }
          const on = v ? v === "on" || v === "yes" : !r[field];
          if (on && limitBlocks(sender, field === "naturalHeat" ? "heat" : "breed")) {
            R("Your hard limits rule that out, sugar, so I'll keep it off. If you want it, change your limits with staff first.");
            break;
          }
          r[field] = on;
          if (field === "naturalHeat" && on) prodOf(sender).nextHeatAt = Date.now() + CFG.PROD.NATURAL_HEAT_EVERY_D * 864e5;
          saveLedger();
          audit(sender, field.toUpperCase(), on ? "on" : "off");
          R({ breedable: "Breedable", fertile: "Fertile (can catch)", naturalHeat: "Natural heat every " + CFG.PROD.NATURAL_HEAT_EVERY_D + " days" }[field] + ": " + (on ? "ON" : "off") + ". Say ?" + cmd + " on or ?" + cmd + " off any time to set it, hon; plain ?" + cmd + " flips it.");
          break;
        }
        case "breed": {
          const stud = sender;
          if (/^(status|check|scene)$/i.test(args[0] || "")) {
            const sc = state.scenes.get(stud);
            if (!sc) {
              R("You don't have a breedin' scene open, hon. ?breed <who> [hole] opens one.");
              break;
            }
            const left = Math.max(0, sceneCooldown(stud) - Math.floor((Date.now() - (sc.lastCum || 0)) / 1e3));
            R("\u{1F402} Your scene: " + sc.with.map(plainName).join(" and ") + ", in the " + (sc.hole || "vulva") + ". " + (left ? "Next load ready in " + left + " seconds." : "Ready for a load right now!") + " Say cum (or orgasm, climax, breed, fill them up) in your chat or emotes. ?breed stop ends it.");
            break;
          }
          if (/^(stop|end|done|off)$/i.test(args[0] || "")) {
            const had = state.scenes.get(stud);
            state.scenes.delete(stud);
            R(had ? "\u{1F402} All done! I've closed your breedin' scene with " + had.with.map(plainName).join(" and ") + ", sugar." : "You don't have a breedin' scene open, hon.");
            break;
          }
          const holeList = args.length > 1 ? holesFrom(args[args.length - 1]) : null;
          const holeArg = holeList ? holeList.join("+") : null;
          if (holeList && holeList.length > 1 && !(makesSemen(stud) && typeInfo(stud).double)) {
            R("Two holes at once takes a double cock, sugar! Pick one, like ?breed Bessie " + holeList[0] + ".");
            break;
          }
          const who = holeArg ? args.slice(0, -1) : args;
          const rest2 = who.map(resolveTarget).filter((t) => t && t !== stud);
          if (!rest2.length) {
            R("Who're we breedin', sugar? Say ?breed, a name or member number (more than one is fine, separated by spaces), then the hole if you like. You're the stud. The hole can be vulva (or pussy, cunt), butt (or ass, anus, anal), or mouth (or throat, oral). Leave it out and it's vulva. For example: ?breed Bessie  or  ?breed Bessie butt  or  ?breed Bessie Daisy 123456 mouth. While it's open, just roleplay: say cum (or orgasm, climax, breed, fill them up) in your chat or emotes and I'll fill 'em. ?breed stop ends it.");
            break;
          }
          if (!rec(stud)) {
            R("You need to be on the books to breed the stock, sugar. Say ?apply first!");
            break;
          }
          const bad = rest2.filter((t) => !rec(t) || !rec(t).breedable || limitBlocks(t));
          if (bad.length) {
            R(bad.map(plainName).join(", ") + " ain't breedable, hon. They'd have to say ?breedable on themselves (and their limits have to allow it).");
            break;
          }
          if (!prodOf(stud)) {
            R(plainName(stud) + " ain't on the books, sugar.");
            break;
          }
          const away = missing(stud, ...rest2);
          if (away) {
            R(away === stud ? "You've gotta be here on the map to breed, sugar." : plainName(away) + " isn't here on the map right now, hon. Everybody in the scene needs to be in the room.");
            break;
          }
          seePenis(stud);
          const hole0 = holeArg || "vulva";
          const asked = rest2.filter((t) => !breedConsent(stud, t)), ready = rest2.filter((t) => breedConsent(stud, t));
          for (const t of asked) askBreed(stud, t, hole0);
          if (!ready.length) {
            R("I've asked " + asked.map(plainName).join(" and ") + " first, sugar. The scene opens the moment they say yes.");
            break;
          }
          if (asked.length) R("I've asked " + asked.map(plainName).join(" and ") + " first; they'll join when they say yes.");
          state.scenes.set(stud, { with: ready, hole: hole0, at: Date.now(), by: sender, lastCum: 0 });
          emote("\u{1F402} The farm girl leads " + plainName(stud) + " over and puts 'em to " + ready.map(plainName).join(" and ") + " (" + holeText(hole0) + ").", stud);
          R("Your scene's open, sugar. Just roleplay it: every time you say cum (or orgasm, climax, breed, fill them up) I'll fill " + (ready.length > 1 ? "whoever you name, or the first one," : "'em") + " in the " + hole0 + ". Name a hole in your emote (pussy, ass, mouth) to switch, or say on her face (tits, belly\u2026) to paint 'em. ?breed status shows your scene, ?breed stop ends it.");
          break;
        }
        case "cum": {
          const stud = sender;
          const t = resolveTarget(args[0]);
          if (t && t !== stud && args[1] && PAINT_AREAS[String(args[1]).toLowerCase()] && !holeFrom(args[1])) {
            paint(stud, t, args[1], R);
            break;
          }
          const holes = args[1] ? holesFrom(args.slice(1).join("")) : ["vulva"];
          if (!t || t === stud || !holes) {
            R("Here's how, sugar: ?cum, then who (a name or member number, not yourself), then the hole. You're the stud. The hole can be vulva (or pussy, cunt), butt (or ass, anus, anal), or mouth (or throat, oral). Leave it out and it's vulva. For example: ?cum Bessie butt  or  ?cum 123456");
            break;
          }
          cumInto(stud, t, holes, R, false);
          break;
        }
        case "milk":
        case "collect": {
          const t = resolveTarget(args[0]);
          if (!t || !rec(t)) {
            R("Here's how, sugar: ?milk (for milk) or ?collect (for semen), their name or member number, then an amount in mL if you like. Leave the amount out to take it all. For example: ?milk Bessie  or  ?milk Bessie 500  or  ?collect 123456 20");
            break;
          }
          const amt = args[1] ? parseFloat(args[1]) : Infinity;
          if (!(amt > 0)) {
            R("Give me an amount in mL, sugar, or leave it out to take it all. For example: ?milk Bessie 500  or  ?collect 123456 20");
            break;
          }
          const away = missing(sender, t);
          if (away) {
            R(away === sender ? "You've gotta be here on the map to do the milkin', sugar." : plainName(t) + " isn't here on the map right now, hon. You both need to be in the room.");
            break;
          }
          prodTick();
          if (cmd === "milk" && milkDenied(t)) {
            R("\u{1F6AB} " + plainName(t) + "'s teats are capped for another " + Math.ceil((prodOf(t).milkDeniedUntil - Date.now()) / 6e4) + " minutes, sugar. Let 'em ache.");
            break;
          }
          const got = cmd === "milk" ? drainMilk(t, amt) : drainSemen(t, amt);
          saveLedger();
          audit(sender, cmd.toUpperCase(), t + " " + Math.round(got));
          if (got < 1) {
            R(plainName(t) + " is dry right now, sugar. Give 'em a while to fill back up.");
            break;
          }
          if (cmd === "collect") {
            L.jars = (L.jars || []).filter((j) => Date.now() - j.t < CFG.JAR_DAYS * 864e5);
            L.nextJar = (L.nextJar || 0) + 1;
            L.jars.push({ id: L.nextJar, stud: t, ml: got, t: Date.now(), pent: false });
            saveLedger();
            R("\u{1FAD9} Bottled as jar #" + L.nextJar + " (" + ml(got) + " of " + plainName(t) + "'s). Staff can ?inseminate <who> " + L.nextJar + " [hole] within " + CFG.JAR_DAYS + " days.");
          }
          const scene = (cmd === "milk" ? "milk" : "collect") + (t === sender ? "Self" : "");
          if (!runScene(scene, t, { n: plainName(t), b: plainName(sender), bMn: sender, ml: ml(got), icon: cmd === "milk" ? "\u{1F95B}" : "\u{1F9EA}" }))
            emote(cmd === "milk" ? "\u{1F95B} " + (t === sender ? plainName(t) + " milks " + ml(got) + " into the pail" : plainName(sender) + " milks " + plainName(t) + ": " + ml(got) + " into the pail") + ". Good job, hon!" : "\u{1F9EA} " + (t === sender ? plainName(t) + " fills the collection jar with " + ml(got) : plainName(sender) + " collects " + ml(got) + " from " + plainName(t)) + ". Good job, hon!", t);
          break;
        }
        case "stats": {
          const t = args[0] ? resolveTarget(args[0]) : sender;
          if (!t || !rec(t)) {
            R("They're not on the books, sugar. Just ?stats shows your own; staff can add a name or member number, like ?stats Bessie.");
            break;
          }
          if (t !== sender && !isStaff(sender)) {
            R("Sorry, hon, those aren't yours to read. Just ?stats shows your own.");
            break;
          }
          prodTick();
          R(statsText(t));
          break;
        }
        case "board": {
          rollBoard();
          const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([m, v], i) => "  " + (i + 1) + ". " + plainName(parseInt(m, 10)) + " \u2014 " + ml(v) + " (grade " + milkGrade(parseInt(m, 10)) + ")").join("\n") || "  (nobody yet)";
          const sires = Object.entries(L.yield.s || {}).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([m, n], i) => "  " + (i + 1) + ". " + plainName(parseInt(m, 10)) + " \u2014 " + n + " caught").join("\n") || "  (nobody yet)";
          const dump = Object.entries(L.yield.u || {}).sort((a, b) => b[1] - a[1])[0];
          R("\u{1F95B} YIELD BOARD\n\nToday\n" + top(L.yield.d) + "\n\nThis week (top goes prize)\n" + top(L.yield.w) + "\n\n\u{1F402} Top sires this week\n" + sires + (dump ? "\n\n\u{1FAA3} Farm cumdump of the day: " + plainName(parseInt(dump[0], 10)) + " (" + dump[1] + " times)" : ""));
          break;
        }
        case "pedigree": {
          const t = args[0] ? resolveTarget(args[0]) : sender;
          if (!t) {
            R("I don't know that one, sugar. Just ?pedigree shows your own stud book; add a name or member number for somebody else's, like ?pedigree Bessie or ?pedigree 123456.");
            break;
          }
          const book = L.studbook || [], kidsIn = (e) => e.eggs ? e.eggs : e.kids.male + e.kids.female + e.kids.futa;
          const withWhom = (rows, who) => {
            const m = /* @__PURE__ */ new Map();
            for (const e of rows) for (const w of who(e)) m.set(w, (m.get(w) || 0) + 1);
            return [...m].sort((a, b) => b[1] - a[1]).map(([w, n]) => plainName(w) + " \xD7" + n).join(", ");
          };
          const asDam = book.filter((e) => e.dam === t), asSire = book.filter((e) => e.sires.includes(t));
          const line = (rows, label, who) => rows.length ? label + ": " + rows.length + " litter" + (rows.length === 1 ? "" : "s") + ", " + rows.reduce((a, e) => a + kidsIn(e), 0) + " young \xB7 with " + withWhom(rows, who) : "";
          const out = [line(asDam, "\u{1F404} As dam", (e) => e.sires), line(asSire, "\u{1F402} As sire", (e) => [e.dam])].filter(Boolean);
          const last = book.filter((e) => e.dam === t || e.sires.includes(t)).slice(-1)[0];
          R(out.length ? "\u{1F4DC} PEDIGREE \u2014 " + plainName(t) + "\n" + out.join("\n") + (last ? "\nLatest: " + plainName(last.dam) + " \xD7 " + last.sires.map(plainName).join(" & ") + ", " + new Date(last.t).toLocaleDateString() : "") : plainName(t) + " has no litters in the stud book yet, hon.");
          break;
        }
        case "heat": {
          const t = resolveTarget(args[0]);
          if (!t || !rec(t)) {
            R("Here's how, sugar: ?heat, their name or member number, then how many hours (leave it out for 12), or off to break their heat. For example: ?heat Bessie  or  ?heat Bessie 6  or  ?heat 123456 off");
            break;
          }
          const p2 = prodOf(t);
          if (String(args[1] || "").toLowerCase() === "off") {
            p2.heat = null;
            saveLedger();
            R(plainName(t) + "'s heat is broken, hon.");
            break;
          }
          if (limitBlocks(t, "heat")) {
            R("Their limits rule that out, sugar, so no heat for them.");
            break;
          }
          const hh = parseFloat(args[1]);
          startHeat(t, sender, hh > 0 ? hh : CFG.PROD.HEAT_H);
          R("\u{1F525} " + plainName(t) + " is in heat now! Ooh-wee.");
          break;
        }
        case "heatline": {
          if (!L.heatLines) L.heatLines = [];
          const sub = String(args[0] || "list").toLowerCase();
          if (sub === "add") {
            const line = args.slice(1).join(" ").trim();
            if (!line) {
              R("Give me a line, sugar! ?heatline add <line> adds one (%name% becomes their name), ?heatline list shows yours, ?heatline remove <number> takes one off. For example: ?heatline add %name% grinds against the rails.");
              break;
            }
            L.heatLines.push({ text: line, by: sender, at: Date.now() });
            saveLedger();
            R("Added! " + L.heatLines.length + " heat line(s) of your own now.");
          } else if (sub === "remove" || sub === "del") {
            const i = parseInt(args[1], 10) - 1;
            if (!(i >= 0 && i < L.heatLines.length)) {
              R("Which number, hon? Say ?heatline remove and a number from ?heatline list, like ?heatline remove 2.");
              break;
            }
            R("Took it off: " + L.heatLines.splice(i, 1)[0].text);
            saveLedger();
          } else {
            R(L.heatLines.length ? "\u{1F525} HEAT LINES\n\n" + L.heatLines.map((x, i) => i + 1 + ". " + x.text).join("\n") : "I'm usin' the built-in heat lines right now, sugar. ?heatline add <line> adds one (%name% becomes their name), ?heatline list shows yours, ?heatline remove <number> takes one off. For example: ?heatline add %name% grinds against the rails.");
          }
          break;
        }
        /* ── FARM LIFE ── */
        case "feeding":
        case "curfew": {
          if (!isProprietor(sender)) {
            R(cmd === "feeding" ? "\u{1F514} Feedin' time's at " + CFG.FEED_HOURS.map((h) => h + ":00").join(" and ") + (L.life.feedingOn ? "" : " (switched off right now)") + ", sugar." : "\u{1F319} Curfew runs " + CFG.CURFEW.start + ":00 to " + CFG.CURFEW.end + ":00" + (L.life.curfewOn ? "" : " (switched off right now)") + ", sugar.");
            break;
          }
          const key = cmd === "feeding" ? "feedingOn" : "curfewOn";
          const v = String(args[0] || "").toLowerCase();
          if (v && !["on", "off"].includes(v)) {
            R("Just say ?" + cmd + " on or ?" + cmd + " off, sugar. Leave it blank and it flips. For example: ?" + cmd + " off");
            break;
          }
          L.life[key] = v ? v === "on" : !L.life[key];
          saveLedger();
          audit(sender, cmd.toUpperCase(), L.life[key] ? "on" : "off");
          if (cmd === "curfew") syncAllPresent(true);
          R((cmd === "feeding" ? "\u{1F514} Feedin' times are " : "\u{1F319} Curfew is ") + (L.life[key] ? "ON" : "off") + " now. ?" + cmd + " on or ?" + cmd + " off sets it; plain ?" + cmd + " flips it.");
          break;
        }
        case "weather": {
          const w = weatherToday();
          R("\u{1F324}\uFE0F " + w.line);
          break;
        }
        case "unstock": {
          const t = resolveTarget(args[0]);
          const r = t ? rec(t) : null;
          if (!r || !r.stocked) {
            R("They ain't in the stocks, hon. To let somebody out, say ?unstock and their name or member number, like ?unstock Bessie or ?unstock 123456.");
            break;
          }
          r.stocked = null;
          saveLedger();
          audit(sender, "UNSTOCK", String(t));
          R("\u{1F513} Let " + plainName(t) + " out of the stocks.");
          whisper(t, "\u{1F513} " + plainName(sender) + " let you out of the stocks, sweetie!");
          break;
        }
        case "stocks": {
          const t = resolveTarget(args[0]);
          if (!t || !rec(t)) {
            R("Here's how, sugar: ?stocks, their name or member number, then minutes from 1 to 240 (leave it out for 30). ?unstock <who> lets 'em out early. For example: ?stocks Bessie  or  ?stocks 123456 45");
            break;
          }
          const mins = Math.max(1, Math.min(CFG.STOCKS_MAX_MIN, parseInt(args[1], 10) || CFG.STOCKS_DEFAULT_MIN));
          putInStocks(t, mins, sender);
          audit(sender, "STOCKS", t + " " + mins + "m");
          R("\u26D3\uFE0F " + plainName(t) + " is in the stocks for " + mins + " minutes, hon.");
          break;
        }
        case "walk": {
          const t = resolveTarget(args[0]);
          if (!t) {
            R("Walk who, sugar? Say ?walk and the name or member number of stock in your own herd, like ?walk Bessie or ?walk 123456. Say the same thing again to let go of the lead.");
            break;
          }
          if (state.leashes.get(t) === sender) {
            state.leashes.delete(t);
            R("You let go of " + plainName(t) + "'s lead.");
            whisper(t, plainName(sender) + " let go of your lead, sweetie.");
            break;
          }
          if (!membership(t, sender) && !isProprietor(sender)) {
            R("You can only walk stock in your own " + herdWord(sender) + ", sugar.");
            break;
          }
          if (!charFor(t) || !charFor(sender)) {
            R("You both need to be here on the farm for that, hon.");
            break;
          }
          if (stockedNow(t)) {
            R("They're in the stocks right now, sugar. ?unstock 'em first.");
            break;
          }
          state.leashes.set(t, sender);
          audit(sender, "WALK", String(t));
          say("\u{1F9AE} " + plainName(sender) + " clips a lead on " + plainName(t) + ". Aww!", false, t);
          whisper(t, "You're on " + plainName(sender) + "'s lead now, sweetie. Wherever they go, you go. Safeword ends it.");
          break;
        }
        case "tourstop": {
          if (!isHerdmaster(sender)) {
            R("Sorry, sugar, that one's just for herdmasters and proprietors.");
            break;
          }
          if (!L.life.tour) L.life.tour = [];
          const sub = String(args[0] || "list").toLowerCase();
          if (sub === "add") {
            const C = charFor(sender), pos = C && C.MapData && C.MapData.Pos;
            const text = args.slice(1).join(" ").trim();
            if (!pos || !text) {
              R("Stand right at the stop, sugar, and say ?tourstop add and what they're lookin' at (%name% becomes the visitor's name). For example: ?tourstop add The pasture. Mind the ruts, %name%.");
              break;
            }
            L.life.tour.push({ X: pos.X, Y: pos.Y, text });
            saveLedger();
            R("\u{1F4CD} Stop " + L.life.tour.length + " added at " + pos.X + "," + pos.Y + "!");
          } else if (sub === "remove") {
            const i = parseInt(args[1], 10) - 1;
            if (!(i >= 0 && i < L.life.tour.length)) {
              R("Which stop, hon? Say ?tourstop remove and a number from ?tourstop list, like ?tourstop remove 2.");
              break;
            }
            L.life.tour.splice(i, 1);
            saveLedger();
            R("Took off stop " + (i + 1) + ", sugar.");
          } else {
            R(L.life.tour.length ? "\u{1F5FA}\uFE0F TOUR STOPS\n\n" + L.life.tour.map((s, i) => i + 1 + ". " + s.X + "," + s.Y + " \u2014 " + s.text).join("\n") : "No stops yet, sugar. Stand somewhere and say ?tourstop add and a line, like ?tourstop add The barn. Smells like home, don't it?");
          }
          break;
        }
        /* ── WORK ── */
        case "clockin": {
          const r = rec(sender, true);
          if (r.pastureLock) {
            R("\u{1F512} You're bein' kept out in the pasture, sugar, so no clockin' in just yet.");
            break;
          }
          if (clockedIn(sender)) {
            R("You're already on the clock, hon!");
            break;
          }
          r.shift = r.shift || {};
          r.shift.in = Date.now();
          if (r.onDuty === false) {
            r.onDuty = true;
            if (r.pastureStock === true) r.roles = r.roles.filter((x) => x !== ROLE.LIVESTOCK);
            r.pastureStock = false;
            r.pastureNote = "";
            syncKeys(sender, true);
          }
          state.lastSpoke.set(sender, Date.now());
          r.nextChore = Date.now() + 2 * 6e4;
          saveLedger();
          audit(sender, "CLOCKIN", "");
          R("\u23F1\uFE0F You're on the clock, sweetie! Keep chattin', or I'll clock you out after " + CFG.SHIFT_IDLE_MIN + " quiet minutes.");
          outfitsLedger();
          if (L.outfitRules.onClockIn && uniformSlotFor(sender)) later(() => offerOutfit(sender, uniformSlotFor(sender), "Your shift's startin'"), 1500);
          break;
        }
        case "clockout": {
          if (!clockedIn(sender)) {
            R("You ain't clocked in, hon. Say ?clockin to start a shift.");
            break;
          }
          R("\u23F1\uFE0F Clocked out! That shift came to " + hrs(clockOut(sender, "self")) + ". Thanks, sugar!");
          break;
        }
        case "hours": {
          const t = args[0] ? resolveTarget(args[0]) : sender;
          const r = t ? rec(t) : null;
          if (!r) {
            R("I don't know that one, sugar. Just ?hours shows yours; add a name or member number for somebody else's, like ?hours Hand or ?hours 800.");
            break;
          }
          const wk = weekKey(), week = r.shift && r.shift.week && r.shift.week.key === wk ? r.shift.week.ms : 0;
          const live = clockedIn(t) ? Date.now() - r.shift.in : 0;
          R("\u23F1\uFE0F " + plainName(t) + ": " + hrs(week + live) + " this week \xB7 " + hrs((r.shift && r.shift.total || 0) + live) + " all told" + (live ? " \xB7 on the clock now" : "") + " \xB7 chores this week: " + (r.choreWeek && r.choreWeek.key === wk ? r.choreWeek.n : 0));
          break;
        }
        case "done": {
          const r = rec(sender);
          if (!r || !r.chore) {
            R("You don't have a chore right now, hon. They come by beep while you're clocked in.");
            break;
          }
          const place = r.chore.place || (String(r.chore.text).match(/@([a-z0-9_-]+)\s*$/i) || [])[1];
          if (place && !inZoneNamed(sender, place.toLowerCase()) && !onSpot(sender, place.toLowerCase(), 1)) {
            R("\u{1F9F9} That one gets done at " + place + ", sugar. Head over there and say ?done once you're standin' in it.");
            break;
          }
          const wk = weekKey();
          r.choreWeek = r.choreWeek && r.choreWeek.key === wk ? r.choreWeek : { key: wk, n: 0 };
          r.choreWeek.n++;
          r.choreTotal = (r.choreTotal || 0) + 1;
          audit(sender, "CHORE", r.chore.text.slice(0, 50));
          r.chore = null;
          saveLedger();
          staffPoints(sender, 1, "chore");
          R("\u2705 Thank you, sweetie! That's " + r.choreWeek.n + " this week.");
          break;
        }
        case "chore":
        case "chores": {
          const sub = String(args[0] || "").toLowerCase();
          if (sub === "add") {
            const text = args.slice(1).join(" ").trim();
            if (!text) {
              R("What's the job, sugar? Say ?chore add and the job, like ?chore add Polish the cowbells. Add @place to make it count only there, like ?chore add Muck out the pens @pens.");
              break;
            }
            L.chores.push({ text, by: sender });
            saveLedger();
            R("Added! " + L.chores.length + " chores on the board now.");
          } else if (sub === "remove") {
            const i = parseInt(args[1], 10) - 1;
            if (!(i >= 0 && i < L.chores.length)) {
              R("Which number, hon? Say ?chore remove and a number from the ?chores list, like ?chore remove 3.");
              break;
            }
            R("Took it off: " + L.chores.splice(i, 1)[0].text);
            saveLedger();
          } else {
            const wk = weekKey();
            const board = Object.values(L.people).filter((r) => r.choreWeek && r.choreWeek.key === wk).sort((a, b) => b.choreWeek.n - a.choreWeek.n).slice(0, 5).map((r, i) => "  " + (i + 1) + ". " + (r.name || plainName(r.mn)) + " \u2014 " + r.choreWeek.n).join("\n");
            const mine = rec(sender) && rec(sender).chore;
            R("\u{1F9F9} CHORES\n" + (mine ? "\nYours: " + mine.text + " (say ?done when it's finished)\n" : "") + "\nThis week\n" + (board || "  nobody yet") + "\n\nOn the board (" + L.chores.length + "):\n" + L.chores.map((c, i) => i + 1 + ". " + c.text).join("\n") + "\n\n?chore add <job> \xB7 ?chore remove <number>");
          }
          break;
        }
        /* ── PLAY ── */
        case "wheel": {
          const sub = String(args[0] || "list").toLowerCase();
          if (sub === "add") {
            const kind = String(args[1] || "").toLowerCase();
            const text = args.slice(2).join(" ").trim();
            if (!["reward", "punish"].includes(kind) || !text) {
              R("Say whether it's a reward or a punish slice, sugar, then the words. ?wheel add reward <text> or ?wheel add punish <text> adds a slice (%name% becomes their name), ?wheel lists them, ?wheel remove <number> takes one off. For example: ?wheel add reward Extra hay tonight");
              break;
            }
            L.wheel.push({ kind, text, by: sender });
            saveLedger();
            R("Added to the wheel! " + L.wheel.length + " slices now.");
          } else if (sub === "remove") {
            const i = parseInt(args[1], 10) - 1;
            if (!(i >= 0 && i < L.wheel.length)) {
              R("Which number, hon? Say ?wheel remove and a number from the ?wheel list, like ?wheel remove 2.");
              break;
            }
            R("Took it off: " + L.wheel.splice(i, 1)[0].text);
            saveLedger();
          } else {
            R(L.wheel.length ? "\u{1F3A1} THE WHEEL\n\n" + L.wheel.map((e, i) => i + 1 + ". " + (e.kind === "reward" ? "\u{1F36C}" : "\u{1F53B}") + " " + e.text).join("\n") : "Wheel's empty, sugar. ?wheel add reward <text> or ?wheel add punish <text> adds a slice (%name% becomes their name), ?wheel lists them, ?wheel remove <number> takes one off. For example: ?wheel add reward Extra hay tonight");
          }
          break;
        }
        case "spin": {
          const t = args[0] ? resolveTarget(args[0]) : null;
          if (!t || !rec(t)) {
            R("Spin for who, sugar? Say ?spin, their name or member number, then reward or punish if you want just that kind (leave it out for any slice). Anything that clashes with their hard limits gets left out. For example: ?spin Bessie  or  ?spin 123456 punish");
            break;
          }
          const kind = String(args[1] || "").toLowerCase();
          const pool = L.wheel.filter((e2) => (!["reward", "punish"].includes(kind) || e2.kind === kind) && wheelAllowed(e2, t));
          if (!pool.length) {
            R("Shoot, there's nothin' on the wheel that fits " + plainName(t) + "'s limits, hon. Try leavin' out reward or punish, or add some slices with ?wheel add.");
            break;
          }
          const e = pool[Math.floor(Math.random() * pool.length)];
          audit(sender, "SPIN", t + " " + e.text.slice(0, 50));
          say("\u{1F3A1} Round and round she goes! " + plainName(sender) + " spins the wheel for " + plainName(t) + "\u2026 " + (e.kind === "reward" ? "\u{1F36C} " : "\u{1F53B} ") + fill(e.text, t), false, t);
          break;
        }
        case "beg":
        case "please": {
          const r = rec(sender);
          if (!r) {
            R("You ain't stock here, sugar. Say ?apply if you'd like to be!");
            break;
          }
          const text = cmd === "please" ? "please " + rest : rest;
          if (!begPhraseOk(text)) {
            R('Manners, sugar! Ask properly: ?beg and then "' + (L.life.begPhrase || CFG.BEG_PHRASE) + '". For example: ?beg ' + (L.life.begPhrase || CFG.BEG_PHRASE));
            break;
          }
          const last = state.cooldowns.get("beg:" + sender) || 0;
          if (Date.now() - last < CFG.BEG_COOLDOWN_MIN * 6e4) {
            R("You just begged, hon! Don't wear it out. Try again in a little while.");
            break;
          }
          state.cooldowns.set("beg:" + sender, Date.now());
          audit(sender, "BEG", "");
          if (stockedNow(sender)) {
            const left = r.stocked.until - Date.now();
            r.stocked.until -= Math.round(left * 0.25);
            saveLedger();
            R("Since you asked so nice, I'll knock a quarter off. " + Math.ceil((r.stocked.until - Date.now()) / 6e4) + " minutes left in the stocks, sweetie.");
          } else if (curfewBound(sender) && CFG.CURFEW_TAKES_BRONZE) {
            r.begged = true;
            saveLedger();
            syncKeys(sender, true);
            R("Oh, alright! Bronze key's back for the night. Don't make me regret it, sugar. \u{1F609}");
          } else {
            const treat = CFG.TREATS[Math.floor(Math.random() * CFG.TREATS.length)];
            R("\u{1F36C} " + fill(treat, sender));
          }
          break;
        }
        case "begphrase": {
          if (!isStaff(sender)) {
            break;
          }
          if (!rest) {
            R(`The beggin' phrase is "` + (L.life.begPhrase || CFG.BEG_PHRASE) + '", hon. Say ?begphrase and new words to change it, like ?begphrase pretty please, Farmhand');
            break;
          }
          L.life.begPhrase = rest;
          saveLedger();
          R('Got it! Stock have to say "' + rest + '" now.');
          break;
        }
        /* ── COUNTY FAIR ── */
        case "fair": {
          const sub = String(args[0] || "").toLowerCase();
          const F = L.life.fair;
          if (sub === "open") {
            if (!isProprietor(sender)) {
              R("Only the proprietors can open the fair, sugar.");
              break;
            }
            let cls = String(args[1] || "").toLowerCase(), rest2 = args.slice(2);
            if (!CFG.FAIR_CLASSES.includes(cls)) {
              cls = "show";
              rest2 = args.slice(1);
            }
            const CLASS_TITLE = {
              show: "County Fair",
              udder: "Biggest Udder",
              balls: "Biggest Balls",
              penis: "Biggest Cock",
              gape: "Best Gape",
              throat: "Deepest Throat",
              load: "Biggest Load"
            };
            L.life.fair = { open: true, at: Date.now(), entrants: {}, cls, loads: {}, title: rest2.join(" ") || CLASS_TITLE[cls] };
            saveLedger();
            announce("\u{1F3AA} Y'all, the " + L.life.fair.title + " is open! " + (cls === "show" ? "Stock: say ?enter to show. Staff: ?score <who> <1-10>, like ?score Bessie 8." : cls === "load" ? "Studs: say ?enter, then give it your best ?cum. Biggest single load wins!" : "Say ?enter and I'll measure you up when it closes. Biggest wins, and judges' scores break a tie!"));
          } else if (sub === "close") {
            if (!isProprietor(sender)) {
              R("Only the proprietors can close the fair, sugar.");
              break;
            }
            if (!F || !F.open) {
              R("There's no fair runnin' right now, hon.");
              break;
            }
            const avg = (s) => s.length ? s.reduce((a, b) => a + b, 0) / s.length : 0;
            const cls = F.cls || "show";
            const measure = (m) => cls === "udder" ? udderLevel(m) : cls === "balls" ? sizeOf(m, "testes") : cls === "penis" ? sizeOf(m, "penis") : cls === "gape" ? Math.max(sizeOf(m, "vulva"), sizeOf(m, "butt")) : cls === "throat" ? sizeOf(m, "throat") : cls === "load" ? (F.loads || {})[m] || 0 : 0;
            const shown = (m, v) => cls === "show" ? v.toFixed(1) + "/10" : cls === "load" ? ml(v) : cls === "penis" ? v + '"' : cls === "gape" ? sizeWord("vulva", v) : sizeWord(cls === "balls" ? "testes" : cls, v);
            const ranked = Object.entries(F.entrants).map(([m, e]) => {
              m = parseInt(m, 10);
              const j = avg(Object.values(e.scores));
              return [m, cls === "show" ? j : measure(m), j];
            }).filter((x) => x[1] > 0 && rec(x[0])).sort((a, b) => b[1] - a[1] || b[2] - a[2]);
            F.open = false;
            saveLedger();
            if (!ranked.length) {
              announce("\u{1F3AA} The fair's closed, y'all. Nobody " + (cls === "show" ? "got judged" : "placed") + " this time.");
              break;
            }
            const [win, score] = ranked[0], r = rec(win);
            r.ribbons = (r.ribbons || 0) + 1;
            if (!CFG.PUNISH_TIERS.includes(r.tier)) {
              if (!r.tierUntil) r.tierPrev = r.tier || "";
              r.tier = "prize";
              r.tierUntil = Date.now() + CFG.FAIR_PRIZE_DAYS * 864e5;
            }
            saveLedger();
            audit(sender, "FAIR_WIN", win + " " + cls + " " + score);
            announce("\u{1F3AA}\u{1F3C6} And the " + F.title + " goes to... " + plainName(win) + " (" + shown(win, score) + ")! Blue ribbon" + (r.tierUntil ? " and prize tier for a week" : "") + "." + (ranked[1] ? " Runner-up: " + plainName(ranked[1][0]) + " (" + shown(ranked[1][0], ranked[1][1]) + ")." : ""));
          } else {
            if (!F || !F.open) {
              R("There's no fair runnin' right now, sugar. Proprietors can start one with ?fair open, a class if they like (show, udder, balls, penis, gape, throat or load), and a title, like ?fair open Harvest Show or ?fair open udder Moo Off.");
              break;
            }
            R("\u{1F3AA} " + F.title + " \u2014 here's who's entered:\n\n" + Object.keys(F.entrants).map((m) => {
              const e = F.entrants[m], s = Object.values(e.scores);
              return "  \u2022 " + plainName(parseInt(m, 10)) + " \u2014 " + s.length + " score(s)";
            }).join("\n"));
          }
          break;
        }
        case "enter": {
          const F = L.life.fair;
          if (!F || !F.open) {
            R("There's no fair runnin' right now, hon. I'll holler when there is!");
            break;
          }
          const cls = F.cls || "show";
          if (cls === "show" && !hasRole(sender, ROLE.LIVESTOCK)) {
            R("The show ring's just for stock, sugar.");
            break;
          }
          if (!rec(sender) || !rec(sender).roles.length) {
            R("You'll need to be on the books to enter, sugar. ?apply first!");
            break;
          }
          if ((cls === "load" || cls === "balls" || cls === "penis") && !makesSemen(sender)) {
            R("This one's for folks with a penis, hon (or futa: ?futa on).");
            break;
          }
          if (cls === "udder" && !makesMilk(sender)) {
            R("This one's for milkers, hon. Say ?milkable on first!");
            break;
          }
          F.entrants[sender] = F.entrants[sender] || { scores: {} };
          saveLedger();
          say("\u{1F3AA} Lookin' good! " + plainName(sender) + " steps into the show ring.", false, sender);
          break;
        }
        case "score": {
          const F = L.life.fair;
          const t = resolveTarget(args[0]), n = parseFloat(args[1]);
          if (!F || !F.open) {
            R("There's no fair runnin' right now, hon.");
            break;
          }
          if (!t || !F.entrants[t] || !(n >= 1 && n <= 10)) {
            R("Here's how, sugar: ?score, then somebody who's entered (name or member number; ?fair shows who), then a score from 1 to 10 (halves are fine). For example: ?score Bessie 8  or  ?score 123456 9.5");
            break;
          }
          if (t === sender) {
            R("Nice try, sugar, but you can't judge yourself!");
            break;
          }
          F.entrants[t].scores[sender] = n;
          saveLedger();
          R("Scored " + plainName(t) + " " + n + "/10. Thanks, judge!");
          break;
        }
        case "backup": {
          if (!isProprietor(sender)) {
            R("Sorry, sugar, that one's just for the proprietors.");
            break;
          }
          exportLedger();
          R("All backed up, hon! The ledger's downloaded on the bot's machine. " + Object.keys(L.people).length + " on the books.");
          break;
        }
      }
    }
    function handleYesNo(sender, raw) {
      const pc = state.pendingClaims.get(sender);
      if (!pc) {
        const low0 = String(raw).trim().toLowerCase().replace(/^[?!.\-\/]/, "").replace(/^bot\s+/, "");
        if ((low0 === "yes" || low0 === "no") && (state.breedAsks.has(sender) || state.jarAsks.has(sender))) return answerPending(sender, low0 === "yes");
        if ((low0 === "yes" || low0 === "no") && addonAsks.has(sender)) return addonYesNo(sender, low0 === "yes");
        return false;
      }
      if (Date.now() - pc.at > CFG.CLAIM_ASK_TIMEOUT_MIN * 6e4) {
        state.pendingClaims.delete(sender);
        return false;
      }
      const low = String(raw).trim().toLowerCase().replace(/^[?!.\-\/]/, "").replace(/^bot\s+/, "");
      if (low !== "yes" && low !== "no") return false;
      state.pendingClaims.delete(sender);
      if (low === "no") {
        beep(sender, "Understood, hon. I told 'em no, and that's the end of it.");
        beep(pc.by, plainName(sender) + " declined, sugar. Please leave it be.");
        return true;
      }
      const why = claimBlocker(pc.by, sender);
      if (why) {
        beep(sender, "Sorry, sweetie, I couldn't put you in after all. " + why);
        beep(pc.by, plainName(sender) + " said yes, but there's a snag: " + why);
        return true;
      }
      const r = addToHerd(sender, pc.by, pc.type, pc.days);
      r.name = plainName(sender);
      saveLedger();
      audit(pc.by, "CLAIM", sender + " " + pc.type + (pc.type === "temp" ? " " + pc.days + "d" : ""));
      syncKeys(sender, true);
      if (CFG.FRIEND_ON_REGISTER) addFriend(sender, true);
      const h = membership(sender, pc.by);
      beep(sender, "\u{1F33E} Aww, you're in " + plainName(pc.by) + "'s " + herdWord(pc.by) + " now, sweetie \u2014 " + herdLabel(h) + ".\n\u{1F511} " + keyString(sender));
      beep(pc.by, "\u2705 " + plainName(sender) + " said yes! " + herdLabel(h) + ". " + herdMembers(pc.by).length + "/" + herdCap(pc.by) + " in your " + herdWord(pc.by) + ".");
      return true;
    }
    function listenersIntact(s) {
      try {
        return typeof s.listeners !== "function" || s.listeners("ChatRoomMessage").includes(attachListeners._msgFn);
      } catch (e) {
        return true;
      }
    }
    function beepText(m) {
      let t = typeof m === "string" ? m : m && typeof m === "object" && typeof m.Message === "string" ? m.Message : String(m || "");
      for (let i = 0; i < 3; i++) {
        const cut = t.replace(/[\s\u200B-\u200F\uE000-\uF8FF]*\{[^{}]*"(messageType|messageColor|bceMessageType|type)"[^{}]*\}[\s\u200B-\u200F\uE000-\uF8FF]*$/, "");
        if (cut === t) break;
        t = cut;
      }
      return t.replace(/[\uE000-\uF8FF]/g, "").trim();
    }
    function attachListeners() {
      const s = W.ServerSocket;
      if (!s || typeof s.on !== "function") return false;
      if (attachListeners._sock === s && listenersIntact(s) && !attachListeners._force) return true;
      attachListeners._force = false;
      if (attachListeners._sock) {
        warn(attachListeners._sock !== s ? "The game swapped its connection: listenin' on the new one." : "The bot's listeners were taken off the connection: puttin' them back.");
        try {
          for (const [ev, fn] of attachListeners._fns || []) attachListeners._sock.off(ev, fn);
        } catch (e) {
        }
        state.relistened = (state.relistened || 0) + 1;
      }
      attachListeners._sock = s;
      attachListeners._fns = [];
      const on = (ev, fn0) => {
        const fn = (...a) => {
          state.lastIn = Date.now();
          return fn0(...a);
        };
        s.on(ev, fn);
        attachListeners._fns.push([ev, fn]);
        return fn;
      };
      attachListeners._msgFn = on("ChatRoomMessage", (data) => {
        try {
          if (!data || state.dormant) return;
          if (data.Sender === CFG.BOT_MEMBER) {
            const own = data.Type === "Hidden" && typeof W.__farmhandOwnPanel !== "function" && readMsg(data);
            if (own && ["hello", "bye", "cmd", "outfitSave", "outfitAnswer", "relayNo", "sight", "leadOk", "leadNo"].includes(own.type)) onCompanion(own);
            return;
          }
          if (data.Type === "Hidden") {
            const fm = readMsg(data);
            if (fm) {
              onCompanion(fm);
              return;
            }
            const bm = readBCP(data);
            if (bm) {
              onBCPMessage(bm);
              return;
            }
            if (typeof data.Content === "string" && data.Content.startsWith("ChatRoomBot ")) {
              const text = data.Content.slice("ChatRoomBot ".length).trim().replace(/^\(+/, "").replace(/\)+$/, "");
              if (!text) return;
              state.heard++;
              state.lastHealthy = Date.now();
              log("HEARD [/bot] " + data.Sender + ": " + text.slice(0, 70));
              if (handleYesNo(data.Sender, text)) return;
              handleCommand(data.Sender, text, "bot");
              return;
            }
            if (data.Content === "ChatRoomFriendRequestAdd") {
              log("Friend request from " + data.Sender);
              addFriend(data.Sender, false);
            }
            return;
          }
          if (data.Sender) state.lastSpoke.set(data.Sender, Date.now());
          if (data.Type === "Activity" && data.Content === "BCPAction") {
            try {
              onBCPAction(data);
            } catch (e) {
              warn("bc+:", e);
            }
            return;
          }
          if (data.Type === "Activity" && /^(Orgasm\d|OrgasmResist|OrgasmFail)/.test(String(data.Content || ""))) {
            try {
              onClimax(data.Sender, String(data.Content));
            } catch (e) {
              warn("climax:", e);
            }
            addonsEmit("climax", data.Sender, String(data.Content));
            return;
          }
          if (data.Type === "Activity") {
            try {
              onActivity(data);
            } catch (e) {
              warn("activity:", e);
            }
            addonsEmit("activity", data);
            return;
          }
          if (data.Type === "Emote" || data.Type === "Chat") {
            try {
              onRoleplay(data.Sender, String(data.Content || ""), data.Type);
            } catch (e) {
              warn("rp:", e);
            }
            addonsEmit("roleplay", data.Sender, String(data.Content || ""), data.Type);
          }
          if (data.Type !== "Chat" && data.Type !== "Whisper") return;
          if (typeof data.Content !== "string") return;
          state.heard++;
          state.lastHealthy = Date.now();
          if (CFG.LOG_HEARD) log("HEARD [" + data.Type + "] " + data.Sender + ": " + data.Content.slice(0, 70));
          const ch = data.Type === "Whisper" ? "whisper" : "chat";
          if (ch !== "chat" && handleYesNo(data.Sender, data.Content)) return;
          handleCommand(data.Sender, data.Content, ch);
        } catch (e) {
          warn("msg:", e);
        }
      });
      on("AccountBeep", (data) => {
        try {
          if (!data || data.MemberNumber === CFG.BOT_MEMBER || state.dormant) return;
          if (data.BeepType) return;
          if (!data.Message) return;
          const msg = beepText(data.Message);
          if (!msg) return;
          state.lastHealthy = Date.now();
          log("BEEP from " + data.MemberNumber + ": " + msg.slice(0, 70));
          if (CFG.FRIEND_ON_BEEP) addFriend(data.MemberNumber, true);
          if (handleYesNo(data.MemberNumber, msg)) return;
          handleCommand(data.MemberNumber, msg, "beep");
        } catch (e) {
          warn("beep handler:", e);
        }
      });
      on("ChatRoomSyncMemberJoin", (data) => {
        try {
          if (!data || !data.Character) return;
          const mn = data.Character.MemberNumber;
          if (mn === CFG.BOT_MEMBER) return;
          state.lastHealthy = Date.now();
          greet(mn);
          onArrive(mn);
          later(() => deliverMail(mn), 8e3);
          addonsEmit("join", mn);
          if (CFG.KEY_SYNC_ON_JOIN) later(() => syncKeys(mn, true), CFG.KEY_JOIN_DELAY_MS);
          if (CFG.FRIEND_ON_JOIN && rec(mn)) later(() => addFriend(mn, true), 6e3);
        } catch (e) {
          warn("join:", e);
        }
      });
      on("ChatRoomSyncMemberLeave", (data) => {
        try {
          if (data && data.SourceMemberNumber) addonsEmit("leave", data.SourceMemberNumber);
        } catch (e) {
          warn("leave:", e);
        }
      });
      on("AccountQueryResult", (d) => {
        try {
          if (!d || d.Query !== "OnlineFriends" || !Array.isArray(d.Result)) return;
          state.mutual = { at: Date.now(), set: new Set(d.Result.map((x) => x && x.MemberNumber).filter(Number.isFinite)) };
          for (const mn of state.mutual.set) if (L.mailbox && L.mailbox[mn]) deliverMail(mn);
        } catch (e) {
          warn("friends result:", e);
        }
      });
      on("ChatRoomSync", () => {
        state.lastHealthy = Date.now();
        later(() => pingCompanions(false), 4e3);
      });
      on("ChatRoomSearchResponse", (d) => {
        log("SearchResponse:", d);
        if (d === "CannotFindRoom" || d === "RoomNotFound") later(tryCreateRoom, 1500);
        if (d === "JoinedRoom") later(() => snapshotRoom(true), 5e3);
      });
      on("ChatRoomCreateResponse", (d) => log("CreateResponse:", d));
      on("LoginResponse", (d) => {
        if (typeof d === "string" && /invalid|password|banned|locked/i.test(d)) loginRefused();
        else if (d && typeof d === "object") state.loginTried = 0;
      });
      on("disconnect", () => {
        warn("Socket disconnected.");
        setBadge("disconnected", "#ff9b9b");
      });
      on("connect", () => {
        log("Socket reconnected.");
        state.lastHealthy = Date.now();
      });
      try {
        if (typeof W.CommandCombine === "function" && !(W.Commands || []).some((c) => c && c.Tag === "office")) {
          W.CommandCombine([{
            Tag: "office",
            Description: "<command>: run a farm command as the farm bot (proprietor), e.g. /office zone a barn",
            Action: (args) => {
              const t = String(args || "").trim();
              if (!t) return selfLine("Type a farm command after /office, like /office help me or /office zone a barn.");
              handleCommand(CFG.BOT_MEMBER, t, "local");
            }
          }]);
        }
      } catch (e) {
        warn("/office:", e);
      }
      attachListeners._done = true;
      log("Listeners attached (chat + beeps + friends + sync)" + (state.relistened ? ", again (" + state.relistened + ")" : "") + ".");
      return true;
    }
    function heartbeat() {
      try {
        if (typeof W.ServerSend !== "function") {
          setBadge("game not found", "#ff9b9b");
          watchdog();
          return;
        }
        attachListeners();
        const others = (W.ChatRoomCharacter || []).filter((c) => c.MemberNumber !== CFG.BOT_MEMBER).length;
        if (others && inRoom() && Date.now() - (state.lastIn || Date.now()) > 20 * 6e4 && Date.now() - (state.relistenAt || 0) > 20 * 6e4) {
          state.relistenAt = Date.now();
          warn("Nothin' heard from the game for 20 minutes with folks in the room: listenin' again.");
          attachListeners._force = true;
          attachListeners();
        }
        if (!state.lastIn) state.lastIn = Date.now();
        if (!isLoggedIn()) {
          setBadge("logging in\u2026", "#ffc49b");
          tryLogin();
          watchdog();
          return;
        }
        if (!officeCheck()) {
          setBadge(state.dormant === "account" ? "off: not the bot's account" : "standing by: another copy is running the farm", "#ffc49b");
          return;
        }
        if (!inRoom()) {
          setBadge("joining room\u2026", "#ffc49b");
          tryEnterRoom();
          watchdog();
          return;
        }
        state.lastHealthy = Date.now();
        state.reloading = false;
        const admin = botIsAdmin();
        let fl = 0;
        try {
          fl = (W.Player.FriendList || []).length;
        } catch (e) {
        }
        const oc = forcedStaff().length;
        setBadge("on duty \u2014 " + Object.values(L.people).filter((r) => r.roles && r.roles.length).length + " reg \xB7 " + fl + " friends \xB7 " + oc + " on call" + (admin ? "" : " \u26A0\uFE0FNOT ADMIN"), admin ? "#b8ff9b" : "#ffc49b");
        keepalive();
        runWaiting();
        pump();
        if (Date.now() - (state.lastMutualAsk || 0) > 6e4) {
          state.lastMutualAsk = Date.now();
          askMutual();
        }
        nudge();
        expireHerdClaims();
        snapshotRoom(false);
        for (const [mn, pc] of state.pendingClaims)
          if (Date.now() - pc.at > CFG.CLAIM_ASK_TIMEOUT_MIN * 6e4) state.pendingClaims.delete(mn);
        if (CFG.KEY_SYNC_ENABLED && admin && Date.now() - state.lastFullSync > CFG.KEY_RESYNC_MIN * 6e4) {
          syncAllPresent(true);
        }
        teaseTick();
        voiceTick();
        rutTick();
        quotaTick();
        prodTick();
        milkingStallTick();
        gearTick();
        homeTick();
        lifeTick();
        workTick();
        if (Date.now() - (state.wlTick || 0) > 5 * 6e4) {
          state.wlTick = Date.now();
          whitelistSync(true);
        }
        leadTick();
        ambientTick();
        addonsEmit("tick");
        for (const [mn, a] of state.arrivals) if (Date.now() > a.until) state.arrivals.delete(mn);
        if (Date.now() - (state.lastSync || 0) > 6e4) {
          state.lastSync = Date.now();
          syncCompanions();
        }
        const cutoff = Date.now() - CFG.APPLY_TIMEOUT_MIN * 6e4;
        for (const [mn, s] of state.sessions) {
          if (CFG.APPLY_TIMEOUT_MIN > 0 && (s.last || s.started) < cutoff) {
            state.sessions.delete(mn);
            reply(mn, "Your paperwork timed out, sugar. Say ?apply whenever you'd like to start fresh!", s.ch);
          }
        }
        const gcut = Date.now() - CFG.GREET_COOLDOWN_MIN * 12e4;
        for (const [k, v] of state.greeted) if (v < gcut) state.greeted.delete(k);
      } catch (e) {
        warn("heartbeat:", e);
        watchdog();
      }
    }
    function boot() {
      if (state.booted) return;
      state.booted = true;
      loadLedger();
      addonsBoot();
      makeBadge();
      setBadge("waiting for game\u2026");
      attachListeners();
      if (!startWorkerTimer()) {
        setInterval(heartbeat, CFG.HEARTBEAT_MS);
        log("Using setInterval \u2014 may throttle in background tabs.");
      }
      every(watchdog, 6e4);
      every(() => {
        try {
          if (inRoom()) leashTick();
        } catch (e) {
          warn("leash:", e);
        }
      }, CFG.LEASH_TICK_MS);
      later(heartbeat, 3e3);
      try {
        W.document.addEventListener("visibilitychange", () => {
          dbg("visibility:", W.document.visibilityState);
          if (W.document.visibilityState === "visible") heartbeat();
        });
      } catch (e) {
      }
      log("Farmhand v" + VERSION + " online.");
    }
    log("Script loaded (v" + VERSION + "). Bridge: " + (W === window ? "direct" : "unsafeWindow"));
    if (W.document && W.document.body) boot();
    else W.addEventListener("load", boot);
    const waitGame = setInterval(() => {
      try {
        if (typeof W.ServerSend === "function") {
          clearInterval(waitGame);
          heartbeat();
        }
      } catch (e) {
      }
    }, 1e3);
  })();
})();
