// Oct 27 (Laynie: "winter pack yes, easter, yes, soltice and equinox based packs with pagan/wiccan themes would be cool"):
// winter's traps and ?stocking, Yule's traps, the farm girl's costumes for both, and the new messes.
const fs=require('fs'), path=require('path');
const CUR=JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'),'utf8')).versions.companion;   // (the current Companion: no update notice mid-test)
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,trapsOn:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"}), "800":S(800,"Fu",{gender:"futa",species:"pony",futa:true}),
 "900":{mn:900,name:"Hank",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pasture":{X:20,Y:40},"trap":{X:22,Y:40},"trap-winter":{X:40,Y:40},"trap-yule":{X:42,Y:40},"cabin":{X:61,Y:60},"trap-cabin":{X:60,Y:60}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30),at(800,31,30),at(900,33,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; W.__date="2026-08-10T12:00:00";
eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const marks=(n,mn)=>sent.slice(n).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Dictionary&&d.Dictionary.type==='mark'&&(!mn||d.Target===mn)).map(([e,d])=>d.Dictionary);
const free=(...mns)=>{ for(const mn of mns){ const r=P(mn); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; r.benched=null; r.quietUntil=0; if(W.__st().trapRuns) W.__st().trapRuns.delete(mn); } };
const done=async(mn,ms)=>{ for(let i=0;i<80;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(mn))) break; } await wait(ms||600); };
const LEAK=/\{(nv|nc|nt|fu|fb|nb|v|c|t|f|m)\}|%[a-z]{1,8}\b|\bundefined\b|\bNaN\b|\[object/;
const BODIES=[[500,'Moo'],[600,'Rex'],[700,'Pip'],[800,'Fu']];
// every trap of a pack, start to finish, on four bodies
async function everyTrap(kinds, label, onEach, pre){
  const broke=[], silent=[], refused=[];
  for (const k of kinds){
    for (const [mn,name] of BODIES){
      free(mn); P(mn).prod.milk=400; if (pre) pre(k, mn); let n=sent.length;
      await say(221397,'?trap spring '+name+' '+k,500);
      await done(mn,700);
      const said=all(n);
      if (/won't spring/.test(said)) refused.push(k+"/"+name+": "+(said.match(/won't spring[^|]*/)||[""])[0]);
      else if (said.split(" | ").filter(t=>(t.includes(name)||t.includes(W.__farmSets().TRAP_KINDS[k].icon))&&!/Sprung on|stateDiff/.test(t)).length<6) silent.push(k+"/"+name);
      if (LEAK.test(said)) broke.push(k+"/"+name+": "+(said.match(/.{0,50}(\{(nv|nc|nt|fu|fb|nb|v|c|t|f|m)\}|%[a-z]{1,8}\b|undefined|NaN|\[object).{0,50}/)||[""])[0]);
      if (onEach) await onEach(k, mn, name, n);
    }
  }
  ok(!refused.length, label+': every one springs on every body ('+(refused.join(" ; ")||"all")+')');
  ok(!silent.length, label+': every one runs its whole story ('+(silent.join(", ")||"all "+kinds.length)+')');
  ok(!broke.length, label+': ...and every line fills in ('+broke.join(" ; ")+')');
}
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.08; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.SYM.TRAP_CHANCE=0; cfg.SYM.LATEX_TRAP_CHANCE=0; cfg.SEND_INTERVAL_MS=2; cfg.TRAP_WRITE_CHANCE=0;
  ['Laynie','Moo','Rex','Pip','Fu','Hank'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700,800]) await say(mn,'?stats',700);
  for (const mn of [500,600,800,221397,260239]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:CUR}});
  await wait(600);
  const sets=W.__farmSets(), seasons=W.__seasons(), of=W.__seasonOf();
  const WI=seasons.winter.kinds, YU=seasons.yule.kinds;

  // ── the calendar ──
  ok(WI.length===10 && YU.length===6, 'winter has its 10 traps ('+WI.join(", ")+') and Yule its 6 ('+YU.join(", ")+')');
  ok(W.__seasonsByDate("2026-12-01T09:00:00").includes("winter") && W.__seasonsByDate("2027-01-31T22:00:00").includes("winter") && !W.__seasonsByDate("2026-11-30T22:00:00").includes("winter") && !W.__seasonsByDate("2027-02-01T09:00:00").includes("winter"), 'winter runs Dec 1 to Jan 31');
  ok(W.__seasonsByDate("2026-12-18T09:00:00").includes("yule") && W.__seasonsByDate("2026-12-24T22:00:00").includes("yule") && !W.__seasonsByDate("2026-12-17T22:00:00").includes("yule") && !W.__seasonsByDate("2026-12-25T09:00:00").includes("yule"), 'Yule runs Dec 18 to 24');
  ok(String(W.__seasonsByDate("2026-12-21T09:00:00"))==="winter,yule", 'on the solstice both are on');
  ok(!W.__seasonsOn().length, 'nothin\'s on in August (the tests never go by the real calendar)');
  { const n=sent.length; await say(500,'?stocking',1000); ok(/not winter/.test(all(n)), '?stocking out of season says so'); }

  // ── winter comes, by the calendar ──
  W.__date="2026-12-05T12:00:00";
  { let n=sent.length; W.__seasonTick(); await wait(800);
    ok(W.__seasonsOn().includes("winter") && !W.__seasonsOn().includes("yule"), 'December: winter\'s on, Yule isn\'t yet');
    ok(/❄️ .*(snow|winter|Winter)/.test(all(n)), '...and the room is told it\'s begun'); }
  { const c=W.__farmGear(260239), names=c.map(g=>g.name), hat=c.find(g=>g.name==="Winter Hat"), cloak=c.find(g=>g.name==="Winter Shawl");
    ok(hat && cloak && names.includes("Fur Gloves") && hat.only && cloak.slot==="cloak" && (hat.items||[]).includes("Santa1") && (cloak.items||[]).includes("XmasShortShawl") && !hat.color, 'the farm girl wraps up: the game\'s red winter hat, short shawl and fur gloves, in their own colours ('+names.join(", ")+')'); }
  { let own=0, plain=0; for (let i=0;i<200;i++){ const q=W.__seasonPick(500,"trap-winter"); if (q && q.kinds.every(k=>of[k]==="winter"||seasons.winter.also.includes(k))) own++; const p=W.__seasonPick(500,"trap"); if (p) plain++; }
    ok(own===200, 'a trap-winter tile springs nothin\' but winter ('+own+' of 200)');
    ok(plain>30 && plain<110, 'about a third of a plain tile\'s springs come from winter ('+plain+' of 200)');
    const sh=cfg.SEASON_SHARE; cfg.SEASON_SHARE=1; const k=W.__seasonPick(500,"trap-cabin"); cfg.SEASON_SHARE=sh;
    ok(k && k.kinds.length && k.kinds.every(x=>(W.__seasonPlaces()[x]||[]).includes("cabin")), 'a cabin tile springs the winter ones that fit the cabin ('+(k&&k.kinds.join(","))+')'); }
  { const n=sent.length; await say(500,'?seasons',1000); const s=all(n);
    ok(/Winter · Dec 1 – Jan 31 · ON NOW/.test(s) && /Yule · Dec 18 – 24/.test(s) && /\?stocking/.test(s), '?seasons shows winter on, Yule comin\', and the stockin\' hint'); }

  // ── every winter trap ──
  await everyTrap(WI, 'winter', async (k, mn, name, n) => {
    if (k==="yeti" && mn===500){ const g=P(500).gear||{}; ok(g.device && (g.device.items||[]).includes("FurBlanketWrap"), 'the yeti leaves them wrapped in his fur'); }
    if (k==="stocking" && mn===600){ const g=P(600).gear||{}; ok(g.plug && /Stuffer/.test(g.plug.label), 'the stockin\' leaves its buzzin\' egg'); }
    if (k==="gingerbread" && mn===500){ ok(marks(n,500).some(m=>m.mess==="icing"), 'the gingerbread man leaves icin\''); }
    if (k==="cocoastand" && mn===800){ ok(/milk|cocoa/.test(all(n)) && marks(n,800).some(m=>m.mess==="milk"||m.mess==="cocoa"), 'the cocoa stand milks Fu into the pot, or pours it over'); }
  });
  ok(WI.every(k=>W.__lines().INTENSITY_BY_TRAP[k] && W.__lines().INTENSITY_BY_TRAP[k].tender.length>=3 && W.__lines().INTENSITY_BY_TRAP[k].filthy.length>=3), 'every winter trap has its tender and filthy lines');
  ok(["icing","cocoa","eggnog","peppermint","wax"].every(m=>sets.MESS[m]), 'the new messes have their colours');
  // the cocoa stand on somebody who isn't makin' milk: poured over
  { free(500); const r=P(500); r.milkable=false; let n=sent.length; await say(221397,'?trap spring Moo cocoastand',500); await done(500,700);
    ok(/marshmallow|cream|cocoa/.test(all(n)) && marks(n,500).some(m=>m.mess==="cocoa"), 'no milk: the cocoa\'s poured over them, and licked off'); r.milkable=undefined; delete r.milkable; }

  // ── ?stocking ──
  { free(500); const r=P(500); r.stockingDay=null; delete r.stockingMarks; let n=sent.length; await say(500,'?stocking',4000);
    const said=all(n); ok(/🧦/.test(said) && /stockin'/.test(said) && !/coal|NAUGHTY/.test(said), 'a nice stockin\' the first time ('+said.slice(0,220)+')');
    n=sent.length; await say(500,'?stocking',1700); ok(/had today's/.test(all(n)), '...once a day');   // (the same command twice inside 1.5 s is dropped)
    r.stockingDay="2000-01-01"; r.naughtyMarks=(r.naughtyMarks||0)+1; n=sent.length; await say(500,'?stocking',6500);
    const s2=all(n); ok(/coal|Coal/.test(s2), 'a naughty mark since last time: coal ('+s2.slice(0,220)+')');
    ok(marks(n,500).some(m=>m.write&&m.write.line==="NAUGHTY LIST"), '...and NAUGHTY LIST on their hips');
    r.stockingDay="2000-01-02"; n=sent.length; await wait(600); await say(500,'?stocking',4000); { const t=all(n).split(' | ').filter(x=>!/stateDiff/.test(x)).join(' | '); ok(!/coal|Coal|NAUGHTY/.test(t), 'good again the next day ('+((t.match(/.{0,80}(coal|Coal|NAUGHTY).{0,80}/)||[''])[0])+')'); }
    ok(P(500).stockingN===3, 'three stockin\'s counted'); }
  { free(600); const r=P(600); r.tier="naughty"; r.stockingDay=null; let n=sent.length; await say(600,'?stocking',5000); ok(/coal|Coal/.test(all(n)), 'a naughty tier gets coal too'); r.tier=undefined; delete r.tier; }

  // ── Yule comes ──
  W.__date="2026-12-20T20:00:00";
  { let n=sent.length; W.__seasonTick(); await wait(800);
    ok(W.__seasonsOn().includes("winter") && W.__seasonsOn().includes("yule"), 'the solstice week: winter and Yule both on');
    ok(/🕯️ .*(Yule|solstice|longest)/.test(all(n)), '...and the room is told Yule\'s begun'); }
  { const c=W.__farmGear(260239), names=c.map(g=>g.name);
    ok(names.includes("Holly Crown") && names.includes("Yule Cloak") && names.includes("Fur Gloves") && !names.includes("Winter Hat"), 'the farm girl changes for Yule: holly crown, deep-red cloak, the same fur gloves ('+names.join(", ")+')'); }
  { let own=0; for (let i=0;i<200;i++){ const q=W.__seasonPick(500,"trap-yule"); if (q && q.kinds.every(k=>of[k]==="yule"||seasons.yule.also.includes(k))) own++; }
    ok(own===200, 'a trap-yule tile springs nothin\' but Yule ('+own+' of 200)'); }
  await everyTrap(YU, 'Yule', async (k, mn, name, n) => {
    if (k==="hollyking" && mn===500){ const p=P(500).prod; ok((p.held.butt||0)>0 && (p.held.vulva||0)>0, 'the two kings share the prize, both holes ('+JSON.stringify(p.held)+' '+((all(n).match(/👑[^|]{0,160}/g)||[]).slice(-1)[0]||'')+')'); const g=P(500).gear||{}; ok(g.hat && /Holly King/.test(g.hat.label), '...and Moo wears the Holly King\'s crown after'); }
    if (k==="ivy" && mn===800){ ok((P(800).prod.eggs||{}).n>0 && /pods/.test(all(n)), 'the ivy lays its berry pods'); }
    if (k==="longnight" && mn===500){ ok(marks(n,500).some(m=>m.mess==="wax"), 'the longest night leaves red wax'); }
    if (k==="wassail" && mn===600){ ok(marks(n,600).some(m=>m.mess==="cider"), 'the wassail leaves cider'); }
  }, (k, mn) => { if (k==="hollyking" && mn===500){ P(500).prod.held={}; P(500).prod.capBonus=(P(500).prod.capBonus||0)+2000; } });   // (room in Moo for both kings, after everything before)
  ok(YU.every(k=>W.__lines().INTENSITY_BY_TRAP[k] && W.__lines().INTENSITY_BY_TRAP[k].tender.length>=3), 'every Yule trap has its tender and filthy lines');
  // a body with eggs ruled out: the ivy only teases
  { free(700); P(700).prod.eggs=null; P(700).limits="no eggs"; let n=sent.length; await say(221397,'?trap spring Pip ivy',500); await done(700,700);
    ok(!(P(700).prod.eggs||{}).n && /ache|wound right up|tinglin'/.test(all(n)), 'eggs ruled out: the ivy only plays'); P(700).limits=""; }

  // ── after the season: the calendar moves on ──
  W.__date="2027-02-03T12:00:00";
  { let n=sent.length; W.__seasonTick(); await wait(800); ok(!W.__seasonsOn().length && /(thaw|Winter's done|Yule's over|longest night's behind)/.test(all(n)), 'February: both over, and the room is told');
    const c=W.__farmGear(260239); ok(!c.some(g=>/Winter Hat|Holly Crown|Yule Cloak/.test(g.name)), '...and the farm girl\'s costume comes off'); }

  // ── any season, any time, several at once (Laynie, Oct 27: "commands to turn on the holiday traps any time, like for
  //    special occasions, just because") ──
  { let n=sent.length; await say(221397,'?seasons start winter yule 2d',1500);
    ok(W.__seasonsOn().includes("winter") && W.__seasonsOn().includes("yule") && /Winter, 🕯️ Yule are on now, for 2 days/.test(all(n)), 'two at once, in February');
    ok(W.__farmGear(260239).some(g=>/Holly Crown/.test(g.name)), '...and the farm girl wears the last one\'s costume');
    n=sent.length; await say(500,'?stocking',2500); ok(/🧦/.test(all(n)) && !/not winter/i.test(all(n)), '...and ?stocking works, since winter\'s on');
    n=sent.length; await say(221397,'?seasons start all on',1500); const on=W.__seasonsOn();
    ok(["halloween","winter","yule"].every(id=>on.includes(id)) && /till you stop them/.test(all(n)), '?seasons start all on: every pack at once, till stopped');
    const rows=W.__stateFor(221397).seasonsAdmin.rows; ok(rows.length>=3 && rows.every(x=>x.on&&x.hand), 'the Seasons card shows them all on, by hand');
    n=sent.length; await say(221397,'?seasons stop yule',1500); ok(!W.__seasonsOn().includes("yule") && W.__seasonsOn().includes("winter") && /Still on/.test(all(n)), '?seasons stop yule stops just that one');
    n=sent.length; await say(221397,'?seasons stop',1500); ok(!W.__seasonsOn().length, '?seasons stop ends the rest started by hand'); }

  // ── the Companion knows the new pieces ──
  { const comp=fs.readFileSync(path.join(__dirname,'../dist/farmhand-companion.user.js'),'utf8');
    ok(/cloak:\s*\{\s*groups:\s*\["ClothAccessory"\]/.test(comp), 'the Companion has the cloak spot');
    ok(["#fffdf8","#6e4128","#f1e0aa","#e23a52","#a3162b"].every(c=>comp.includes('"'+c+'"')) && /peppermint:\s*\{/.test(comp) && /candy:\s*\(/.test(comp), 'the Companion draws icin\', cocoa, eggnog, peppermint and wax');
    ok(["Frozen Fast","Mistletoe Ribbon","Gift Box","Winter Shawl","Holly Crown","Yule Cloak","Holly King's Crown","Ivy (arms)","Vigil Cord (legs)","The Hunt's Rope"].every(x=>comp.includes(x)), 'every new piece is one the Companion knows to take off again'); }

  const errs=warns.filter(w=>!/Worker/.test(w)&&/command failed|trap|TypeError|ReferenceError|season|stocking/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,400));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all good'); process.exit(fails?1:0);
})();
