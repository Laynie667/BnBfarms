// Oct 27 (Laynie: "soltice and equinox based packs with pagan/wiccan themes would be cool"): Litha (the summer solstice)
// and Mabon (the autumn equinox, the harvest home): their calendars, the farm girl's costumes, every trap on four bodies,
// the grape mess, and every season at once by hand.
const fs=require('fs'), path=require('path');
const CUR=JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'),'utf8')).versions.companion;   // (the current Companion: no update notice mid-test)
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,trapsOn:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"}), "800":S(800,"Fu",{gender:"futa",species:"pony",futa:true}),
 "900":{mn:900,name:"Hank",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pasture":{X:20,Y:40},"trap":{X:22,Y:40},"trap-litha":{X:40,Y:40},"trap-mabon":{X:42,Y:40},"trap-harvest":{X:44,Y:40}}});
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
// hold gear is only on while the trap has them: look while it's runnin'
async function heldGear(mn, name, kind){
  free(mn); await say(221397,'?trap spring '+name+' '+kind,400);
  let g=null; for (let i=0;i<40&&!g;i++){ const x=P(mn).gear; if (x&&Object.keys(x).length) g=JSON.parse(JSON.stringify(x)); else await wait(100); }
  await done(mn,600); return g||{};
}
const roomFor=(mn)=>{ P(mn).prod.held={}; P(mn).prod.capBonus=(P(mn).prod.capBonus||0)+2000; };   // (room for two at once, after everything before)
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.08; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.SYM.TRAP_CHANCE=0; cfg.SYM.LATEX_TRAP_CHANCE=0; cfg.SEND_INTERVAL_MS=2; cfg.TRAP_WRITE_CHANCE=0;
  ['Laynie','Moo','Rex','Pip','Fu','Hank'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700,800]) await say(mn,'?stats',700);
  for (const mn of [500,600,800,221397,260239]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:CUR}});
  await wait(600);
  const sets=W.__farmSets(), seasons=W.__seasons(), of=W.__seasonOf();
  const LI=seasons.litha.kinds, MA=seasons.mabon.kinds;
  const on=(d,id)=>W.__seasonsByDate(d).includes(id);

  // ── the calendar ──
  ok(LI.length===6 && MA.length===6, 'Litha has its 6 traps ('+LI.join(", ")+') and Mabon its 6 ('+MA.join(", ")+')');
  ok(on("2027-06-18T09:00:00","litha") && on("2027-06-24T22:00:00","litha") && !on("2027-06-17T22:00:00","litha") && !on("2027-06-25T09:00:00","litha"), 'Litha runs Jun 18 to 24, round the summer solstice');
  ok(on("2027-09-19T09:00:00","mabon") && on("2027-09-25T22:00:00","mabon") && !on("2027-09-18T22:00:00","mabon") && !on("2027-09-26T09:00:00","mabon"), 'Mabon runs Sep 19 to 25, round the autumn equinox');
  ok(!W.__seasonsOn().length, 'nothin\'s on in August');
  { const n=sent.length; await say(500,'?seasons',1000); const s=all(n);
    ok(/Litha · Jun 18 – 24, the summer solstice/.test(s) && /Mabon · Sep 19 – 25, the autumn equinox/.test(s), '?seasons lists Litha and Mabon'); }

  // ── Litha, by the calendar ──
  W.__date="2027-06-20T12:00:00";
  { let n=sent.length; W.__seasonTick(); await wait(800);
    ok(W.__seasonsOn().includes("litha") && W.__seasonsOn().length===1, 'Jun 20: Litha\'s on');
    ok(/☀️ .*(Litha|solstice|midsummer|Midsummer)/.test(all(n)), '...and the room is told it\'s begun'); }
  { const c=W.__farmGear(260239), hat=c.find(g=>g.name==="Midsummer Crown");
    ok(hat && hat.only && (hat.items||[]).includes("RoseCrown"), 'the farm girl wears a crown of midsummer roses ('+c.map(g=>g.name).join(", ")+')'); }
  { let own=0; for (let i=0;i<200;i++){ const q=W.__seasonPick(500,"trap-litha"); if (q && q.kinds.every(k=>of[k]==="litha"||seasons.litha.also.includes(k))) own++; }
    ok(own===200, 'a trap-litha tile springs nothin\' but Litha ('+own+' of 200)'); }
  await everyTrap(LI, 'Litha', async (k, mn, name, n) => {
    if (k==="oakking" && mn===500){ const p=P(500).prod; ok((p.held.butt||0)>0 && (p.held.vulva||0)>0, 'the two kings share the prize again, both holes ('+JSON.stringify(p.held)+')'); const g=P(500).gear||{}; ok(g.hat && /Oak King/.test(g.hat.label), '...and Moo wears the Oak King\'s crown after, till Yule'); }
    if (k==="fairyring" && mn===600){ ok(/fae/.test(all(n)) && Object.values(P(600).prod.held||{}).some(v=>v>0), 'the fae folk take their turns with Rex till dawn'); }
    if (k==="mead" && mn===800){ ok(marks(n,800).some(m=>m.mess==="honey"), 'the mead hall leaves Fu sticky with mead'); }
    if (k==="puck" && mn===500){ ok(((W.__prodOf(500).heat||{}).until||0) > Date.now() && /heat/.test(all(n)), 'Robin Goodfellow\'s flower leaves Moo in heat'); }
  }, (k, mn) => { if (k==="oakking" && mn===500) roomFor(500); if (k==="puck") W.__prodOf(mn).heat=null; });
  ok(LI.every(k=>W.__lines().INTENSITY_BY_TRAP[k] && W.__lines().INTENSITY_BY_TRAP[k].tender.length>=3 && W.__lines().INTENSITY_BY_TRAP[k].filthy.length>=3), 'every Litha trap has its tender and filthy lines');
  { const g=await heldGear(600,'Rex','sunwheel');
    ok(g.device && g.device.label==="The Sun Wheel" && (g.device.items||[]).includes("WheelFortune") && g.arms && /Rose Garlands/.test(g.arms.label), 'the sun wheel is the real wheel, with rose garlands at the wrists ('+Object.keys(g).join(", ")+')'); }
  // heat in their limits: the flower still works its mischief, but no heat after
  { free(700); P(700).limits="no heat"; W.__prodOf(700).heat=null; let n=sent.length; await say(221397,'?trap spring Pip puck',500); await done(700,700);
    ok(!/won't spring/.test(all(n)) && /wears off at sunset|wakes up properly|fades with the light/.test(all(n)) && !(((W.__prodOf(700).heat||{}).until||0) > Date.now()), 'heat ruled out: the love-in-idleness wears off by sunset, and no heat'); P(700).limits=""; }

  // ── Mabon, the harvest home ──
  W.__date="2027-09-21T12:00:00";
  { let n=sent.length; W.__seasonTick(); await wait(800);
    ok(W.__seasonsOn().includes("mabon") && !W.__seasonsOn().includes("litha"), 'Sep 21: Mabon\'s on, Litha long gone');
    ok(/🍂 .*(Mabon|harvest)/.test(all(n)), '...and the room is told the harvest home\'s begun'); }
  { const c=W.__farmGear(260239), names=c.map(g=>g.name), apron=c.find(g=>g.name==="Harvest Apron");
    ok(names.includes("Harvest Crown") && apron && apron.slot==="cloak" && !names.includes("Midsummer Crown"), 'the farm girl wears a crown of poppies and a harvest apron ('+names.join(", ")+')'); }
  { let own=0, hv=0; for (let i=0;i<200;i++){ const q=W.__seasonPick(500,"trap-mabon"); if (q && q.kinds.every(k=>of[k]==="mabon"||seasons.mabon.also.includes(k))) own++; const h=W.__seasonPick(500,"trap-harvest"); if (h && h.kinds.every(k=>of[k]==="mabon"||seasons.mabon.also.includes(k))) hv++; }
    ok(own===200 && hv===200, 'a trap-mabon tile (or trap-harvest) springs nothin\' but Mabon ('+own+', '+hv+' of 200)'); }
  await everyTrap(MA, 'Mabon', async (k, mn, name, n) => {
    if (k==="lastsheaf" && mn===600){ ok(/reaper/.test(all(n)) && Object.values(P(600).prod.held||{}).some(v=>v>0), 'every reaper has a turn with Rex in the last sheaf'); }
    if (k==="cornmaiden" && mn===500){ ok((W.__prodOf(500).deniedUntil||0) > Date.now(), 'the corn maiden is kept on the edge, and denied a while'); }
    if (k==="grapestomp" && mn===800){ ok(marks(n,800).some(m=>m.mess==="grape"), 'the grape vat leaves Fu purple'); }
    if (k==="ciderpress" && mn===800){ ok(/milk/.test(all(n)) && marks(n,800).some(m=>m.mess==="milk"), 'the cider press milks Fu into the cider'); }
    if (k==="harvestcrown" && mn===500){ const p=P(500).prod; ok((p.held.butt||0)>0 && (p.held.vulva||0)>0, 'the harvesters share the crowned one, both ends ('+JSON.stringify(p.held)+')'); const g=P(500).gear||{}; ok(g.hat && /Harvest Crown/.test(g.hat.label), '...and Moo wears the harvest crown the rest of the night'); }
    if (k==="harvestsupper" && mn===600){ ok(marks(n,600).some(m=>m.mess==="honey"), 'the harvest supper leaves Rex honey-sticky'); }
  }, (k, mn) => { if (k==="harvestcrown" && mn===500) roomFor(500); });
  ok(MA.every(k=>W.__lines().INTENSITY_BY_TRAP[k] && W.__lines().INTENSITY_BY_TRAP[k].tender.length>=3 && W.__lines().INTENSITY_BY_TRAP[k].filthy.length>=3), 'every Mabon trap has its tender and filthy lines');
  // the cider press on somebody who isn't makin' milk: pressed with the apples, and cider all over
  { free(500); const r=P(500); r.milkable=false; let n=sent.length; await say(221397,'?trap spring Moo ciderpress',500); await done(500,700);
    ok(/orchard|very well pressed|prize batch|tastes faintly/.test(all(n)) && marks(n,500).some(m=>m.mess==="cider"), 'no milk: pressed with the apples instead, and left drippin\' cider'); delete r.milkable; }

  // ── after the harvest: nothin' till Halloween ──
  W.__date="2027-10-05T12:00:00";
  { let n=sent.length; W.__seasonTick(); await wait(800); ok(!W.__seasonsOn().length && /(harvest|Mabon)/.test(all(n)), 'October: Mabon\'s over, and the room is told');
    ok(!W.__farmGear(260239).some(g=>/Harvest/.test(g.name)), '...and the farm girl takes off the poppies and the apron'); }

  // ── every season at once, by hand ──
  { let n=sent.length; await say(221397,'?seasons start ostara easter litha mabon 3h',1500);
    ok(["ostara","easter","litha","mabon"].every(id=>W.__seasonsOn().includes(id)) && /Ostara, 🐣 Easter, ☀️ Litha, 🍂 Mabon are on now, for 3 hours/.test(all(n)), 'the four of them at once, for a party ('+all(n).slice(0,120)+')');
    n=sent.length; await say(221397,'?seasons start all on',1500); const onNow=W.__seasonsOn();
    ok(["halloween","winter","yule","ostara","easter","litha","mabon"].every(id=>onNow.includes(id)) && /Every season's on now/.test(all(n)) && /till you stop them/.test(all(n)), '?seasons start all on: all seven, till stopped');
    const rows=W.__stateFor(221397).seasonsAdmin.rows; ok(rows.length===7 && rows.every(x=>x.on&&x.hand&&x.open), 'the Seasons card has all seven, on by hand');
    n=sent.length; await say(221397,'?seasons stop',1500); ok(!W.__seasonsOn().length, '?seasons stop ends them all'); }

  // ── the Companion knows the new pieces and the grape ──
  { const comp=fs.readFileSync(path.join(__dirname,'../dist/farmhand-companion.user.js'),'utf8');
    const labels=[].concat(...LI.concat(MA).map(k=>(sets.TRAP_GEAR[k]||[]).map(g=>g.label))).concat(["Midsummer Crown","Harvest Crown","Harvest Apron"]);
    const missing=labels.filter(x=>!comp.includes(x)); ok(labels.length>=15 && !missing.length, 'every new piece is one the Companion knows to take off again ('+(missing.join(", ")||labels.length+" pieces")+')');
    ok(sets.MESS.grape && comp.includes('"#5b2245"') && /grape:\s*\{/.test(comp), 'the Companion draws grape juice'); }

  const errs=warns.filter(w=>!/Worker/.test(w)&&/command failed|trap|TypeError|ReferenceError|season/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,400));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all good'); process.exit(fails?1:0);
})();
