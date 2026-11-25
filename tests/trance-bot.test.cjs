// THE FARM'S TRANCE, the bot's side (Nov 25, Conditioning 2.0). Sessions come from the trance library (labelled blocks put
// together by recipes); with LSCG the session runs as LSCG's own trance in the farm's name and a trigger block is planted
// as LSCG's own suggestion (the way any LSCG hypnotist plants one: a hidden "Leash" beep, set-suggestions); without LSCG
// the farm keeps the trigger and the Companion carries it out. Laynie: "focus on lscgs default suggestion inputs on the
// first rendition"; "I prefer they have the ability to swap to kneeling or to all fours"; stalls are shared.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,hypno:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"pony",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],hypno:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(500,5,5),at(600,30,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,Name:'Farmhand',FriendList:[221397,500,600]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const ext=(mn,type,data)=>handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:Object.assign({v:2,type},data||{})});
const toExt=(k,mn,type)=>sent.slice(k).filter(([e,d])=>d&&d.Type==='Hidden'&&d.Content==='FarmhandMsg'&&d.Target===mn&&(!type||d.Dictionary.type===type)).map(([e,d])=>d.Dictionary);
const hyp=(k,mn,what)=>toExt(k,mn,'hypno').filter(d=>!what||d.do===what);
const lscgBeeps=(k,mn)=>sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===mn&&d.Message&&d.Message.IsLSCG).map(([e,d])=>d);
const words=(k,mn)=>toExt(k,mn).filter(d=>d.type==='reply'||d.type==='notice').map(d=>d.text).concat(sent.slice(k).filter(([e,d])=>d&&((e==='AccountBeep'&&d.MemberNumber===mn&&typeof d.Message==='string')||(d.Type==='Whisper'&&d.Target===mn))).map(([e,d])=>e==='AccountBeep'?d.Message:d.Content)).join(' | ');
const beep=async(mn,msg,ms)=>{ handlers.AccountBeep({MemberNumber:mn,Message:msg}); await wait(ms||1500); };
const FAST=`# a quick library for the test
=== induction: Quick Down
pace: 1s
beats: alpha 10 → theta 6 over 1m
look: haze 20%, spiral slow

Hear my voice, {name}.
Breathe out slow, good {animal}.

=== deepener: Quick Deeper
level: deep, nhl
pace: 1s
beats: theta → delta 3 over 1m
look: haze 50%, words drift
deeper: +25

Deeper now, {name}. A good {animal} sinks.

=== trigger: Milking Time
level: deep, nhl
pace: 1s
trigger: milking time
does: strip top → pose {low} → say "{sound}… milk me, please."
waits: 3s, 3s

When anyone says it's milking time, you find a free stall, go down {low} and ask for it.

=== wake: Quick Up
level: fun, deep
pace: 1s
beats: → alpha 10 over 30s
look: clear

Up you come, {name}.

=== wake: Stay Down
level: nhl
pace: 1s

The {animal} stays.

=== session: Quick
induction: any
deepener: any
trigger: any
wake: any
`;
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  chars[1].Name='Laynie'; chars[2].Name='Moo'; chars[3].Name='Hana'; chars[0].Name='Farmhand';
  L().mods=L().mods||{}; L().mods.conditioning={people:{"500":{max:"nhl",sessions:{fun:0,deep:0,nhl:0},total:0,tier:0}}, lib:{text:FAST,stamp:'t1',at:Date.now()}};
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-conditioning.user.js'),'utf8')); await wait(300);
  ext(500,'hello',{ver:'0.80.0'}); ext(600,'hello',{ver:'0.80.0'}); await wait(1500);
  // Moo's Companion: LSCG with hypnosis on, the farm let in, suggestions not allowed yet
  const lscg={lscg:true,ver:'0.9.12',on:true,sugg:false,needHyp:true,mins:5,beats:true,scopes:['hypno','states'],under:false,ours:false,farmBeats:false,planted:[]};
  ext(500,'hypnoState',lscg); await wait(200);

  // ── the pose they're comfy in ──
  let k=sent.length; await beep(500,'lowpose fours');
  ok(/on all fours/.test(words(k,500)), '?lowpose fours: down low means all fours for them: '+words(k,500).slice(0,80));
  ok(L().mods.conditioning.people['500'].low==='fours', '...kept');

  // ── ?trancelib: the library the farm's running ──
  k=sent.length; await beep(221397,'trancelib');
  ok(/pushed from the studio/.test(words(k,221397)) && /1 sessions, 1 inductions, 1 deepeners/.test(words(k,221397)) && /1 triggers, 2 wakes/.test(words(k,221397)), 'a proprietor sees which library and what\'s in it: '+words(k,221397).slice(0,140));
  k=sent.length; await beep(500,'trancelib');
  ok(/proprietors/.test(words(k,500)), '...nobody else');

  // ── a deep session through LSCG ──
  k=sent.length; await beep(221397,'hyp Moo deep session Quick',300);
  const u=hyp(k,500,'under')[0];
  ok(u && u.by===260239 && u.level==='deep' && u.session==='Quick' && u.ms>=300000, 'the session starts: their Companion is told to take them under in the farm\'s name: '+JSON.stringify(u));
  ext(500,'hypnoState',Object.assign({},lscg,{under:true,ours:true})); ext(500,'hypnoEvent',{ev:'under',via:'lscg'});
  await wait(10500);
  const cues=hyp(k,500,'cue');
  ok(cues[0] && cues[0].kind==='induction' && cues[0].beats.from===10 && cues[0].beats.to===6 && cues[0].beats.over===60 && cues[0].look.haze===20 && cues[0].look.spiral==='slow',
    'each block sets the beats and the look as it starts: '+JSON.stringify(cues[0]));
  const dc=cues.find(c=>c.kind==='deepener');
  ok(dc && dc.beats.from>=4 && dc.beats.from<=8 && dc.beats.to===3 && dc.look.words===true, '...the deepener slides theta down to delta and the words start driftin\'');
  ok(hyp(k,500,'depth').some(d=>d.depth===25), 'deeper by 25');
  const said=toExt(k,500,'voice').map(d=>d.text);
  ok(said.includes('Hear my voice, Moo.') && said.includes('Breathe out slow, good cow.') && said.some(t=>/find a free stall, go down on all fours and ask for it/.test(t)),
    'the lines in the farm\'s voice, filled in for them (a free stall, all fours as they picked): '+said.join(' / ').slice(0,200));
  ok(!lscgBeeps(k,500).length && /tick Allow suggestions/.test(words(k,500)), 'the trigger: LSCG doesn\'t allow suggestions yet, so nothin\'s planted, and they\'re told how once');
  ok(hyp(k,500,'wake').length===1, 'a deep session: woken at the end, out of LSCG\'s trance too');
  ok(L().mods.conditioning.people['500'].total===1, 'the session counted');
  // they tick Allow suggestions; next time they're under in the farm's name, it goes in
  k=sent.length; ext(500,'hypnoState',Object.assign({},lscg,{sugg:true})); await wait(300);
  ok(!lscgBeeps(k,500).length, 'allowed now, but not under in the farm\'s name: still waitin\'');
  k=sent.length; ext(500,'hypnoState',Object.assign({},lscg,{sugg:true,under:true,ours:true})); await wait(600);
  const b=lscgBeeps(k,500)[0], m=b&&b.Message, sg=m&&m.command.args[0].value[0];
  ok(b && b.BeepType==='Leash' && b.IsSecret===true && m.type==='command' && m.target===500 && m.version==='0.9.12' && m.command.name==='set-suggestions',
    'under in the farm\'s name with suggestions allowed: planted the way an LSCG hypnotist plants one (a hidden Leash beep, set-suggestions)');
  ok(sg && sg.id==='bnbfarm-milking-time' && sg.name==='B&B Milking Time' && sg.trigger==='milking time' && sg.installedBy===260239 && sg.exclusive===false,
    '...LSCG\'s own suggestion, the farm as the one who planted it: '+JSON.stringify(sg).slice(0,160));
  ok(sg && sg.instructions.map(i=>i.type).join()==='Strip,Assume Pose,Speak Phrase' && sg.instructions[1].arguments.selection.full==='AllFours' &&
    sg.instructions[2].arguments.config==='moo… milk me, please.' && sg.instructions[1].delay===3000, '...LSCG\'s default instructions: strip the top, down on all fours (their pick), "moo… milk me, please."');
  await wait(4500);
  const chk=hyp(k,500,'check')[0];
  ok(chk && chk.ids.join()==='bnbfarm-milking-time', 'then their Companion checks LSCG took it');
  ext(500,'hypnoEvent',{ev:'checked',ids:['bnbfarm-milking-time'],found:['bnbfarm-milking-time']}); await wait(200);
  k=sent.length; await beep(500,'planted');
  ok(/Milking Time: "milking time" → Strip, Assume Pose, Speak Phrase · in their LSCG/.test(words(k,500)) && /remove-suggestion B&B/.test(words(k,500)), '?planted: what the farm planted, where, and how to take it out: '+words(k,500).slice(0,200));
  k=sent.length; ext(500,'hypnoState',Object.assign({},lscg,{sugg:true,under:true,ours:true,planted:['bnbfarm-milking-time']})); await wait(400);
  ok(!lscgBeeps(k,500).length, 'never planted twice');
  ext(500,'hypnoEvent',{ev:'resolved',name:'B&B Milking Time',resisted:true}); await wait(100);
  ok(L().mods.conditioning.people['500'].sugg['bnbfarm-milking-time'].fired===1 && L().mods.conditioning.people['500'].sugg['bnbfarm-milking-time'].fought===1, 'it fired and they fought it off: the farm keeps count');

  // ── No human left: not woken ──
  ext(500,'hypnoState',Object.assign({},lscg,{sugg:true}));
  k=sent.length; await beep(221397,'hyp Moo nhl',300); await wait(7000);
  ok(hyp(k,500,'linger').length===1 && !hyp(k,500,'wake').length, 'No human left: left under, the trance runs out on its own');
  ok(toExt(k,500,'voice').some(d=>d.text==='The cow stays.'), '...with its own wake');

  // ── snapped out of it ──
  k=sent.length; await beep(221397,'hyp Moo deep',300);
  ext(500,'hypnoEvent',{ev:'awake',method:'snap'}); await wait(300);
  const n=toExt(k,500,'voice').length; await wait(3000);
  ok(toExt(k,500,'voice').length===n && /at a snap of fingers/.test(words(k,500)) && /came up out of the session early/.test(words(k,221397)), 'snapped out of it mid-session: the session stops, they and their herd leader are told');

  // ── no LSCG: the farm's own ──
  k=sent.length; ext(500,'hypnoState',{lscg:false,on:false,sugg:false,scopes:[],under:false,ours:false,planted:[]}); await wait(400);
  const fl=hyp(k,500,'suggestions').pop();
  ok(fl && fl.list.length===1 && fl.list[0].id==='bnbfarm-milking-time', 'LSCG gone: the farm\'s triggers move to their Companion, which carries them out');
  k=sent.length; await beep(221397,'planted Moo');
  ok(/the farm's own/.test(words(k,221397)), 'their herd leader can see what\'s planted');
  k=sent.length; await beep(600,'planted remove milking time Moo');
  ok(/Only their herd leader or a proprietor/.test(words(k,600)), 'somebody else can\'t take it out of them');
  k=sent.length; await beep(500,'planted remove milking time');
  ok(/Taken out: 1/.test(words(k,500)) && hyp(k,500,'suggestions').pop().list.length===0 && !Object.keys(L().mods.conditioning.people['500'].sugg).length, 'they take it out themselves: gone from the farm and their Companion');
  // a farm-only session for somebody without LSCG: the trigger goes straight to their Companion
  ext(600,'hypnoState',{lscg:false,on:false,sugg:false,scopes:[],under:false,ours:false,planted:[]});
  L().mods.conditioning.people['600']={max:'deep',sessions:{fun:0,deep:0,nhl:0},total:0,tier:0};
  k=sent.length; await beep(600,'hyp me deep',300); await wait(7000);
  const f2=hyp(k,600,'suggestions').pop();
  ok(f2 && f2.list.length===1 && f2.list[0].trigger==='milking time' && f2.list[0].instructions[1].arguments.selection.lower==='Kneel' && f2.list[0].instructions[2].arguments.config==='whinny… milk me, please.',
    'no LSCG: planted with the farm, kneelin\' (the default), in a pony\'s own sound');
  ok(!lscgBeeps(k,600).length, '...and never a beep at an LSCG that isn\'t there');
  // ── a push from the studio on the bot's PC ──
  const urls=[]; let pushed='=== induction: From the Studio\npace: 1s\n\nStudio line, {name}.\n\n=== wake: Up\npace: 1s\n\nUp, {name}.\n';
  W.fetch=async(u)=>{ urls.push(u); if(/published\.json$/.test(u)) return { ok:true, json: async()=>({stamp:'s2',at:'x',blocks:2}) }; if(/published\.txt$/.test(u)) return { ok:true, text: async()=>pushed }; return { ok:false, status:404 }; };
  k=sent.length; await beep(221397,'trancelib pull',800);
  ok(urls[0]==='http://localhost:4780/__studio/trance/published.json' && /Pulled from the studio/.test(words(k,221397)) && /1 inductions/.test(words(k,221397)) && L().mods.conditioning.lib.stamp==='s2',
    '?trancelib pull: what Laynie pushed from the studio on this PC, now the farm\'s library: '+words(k,221397).slice(0,120));
  k=sent.length; await beep(221397,'hyp Moo fun',300); await wait(4000);
  ok(toExt(k,500,'voice').some(d=>d.text==='Studio line, Moo.'), '...and the next session runs from it');
  pushed='=== induction: Broken\nbeats: gamma\n';
  W.fetch=async(u)=>(/json$/.test(u)?{ ok:true, json: async()=>({stamp:'s3'}) }:{ ok:true, text: async()=>pushed });
  await beep(221397,'trancelib pull',800);
  k=sent.length; await beep(221397,'hyp Moo fun',300); await wait(3000);
  ok(toExt(k,500,'voice').length>0, 'a push with nothin\' usable in it never leaves the farm without sessions (the starter steps in)');
  W.fetch=async()=>{ throw new Error('connection refused'); };
  k=sent.length; await beep(221397,'trancelib pull',800);
  ok(/Couldn't reach the studio/.test(words(k,221397)) && /Start the studio/.test(words(k,221397)), 'the studio not open: said plainly');
  k=sent.length; await beep(221397,'trancelib starter',500);
  ok(/Back to the starter/.test(words(k,221397)) && !L().mods.conditioning.lib, '?trancelib starter: back to the farm\'s own');
  ok(!warns.some(w=>/conditioning|hypno/i.test(w)), 'no add-on errors: '+warns.filter(w=>/conditioning|hypno/i.test(w)).join(' | ').slice(0,200));
  out(fails ? 'FAIL '+fails : 'ALL OK'); process.exit(fails?1:0);
})();
