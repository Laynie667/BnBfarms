// Oct 27 (Laynie: "easter, yes, soltice and equinox based packs with pagan/wiccan themes would be cool"): Ostara (the
// spring equinox) and Easter: their calendars (Easter moves every year), the farm girl's costumes, every trap on four
// bodies, ?egghunt, and the new messes (egg dye, pollen, marshmallow).
const fs=require('fs'), path=require('path');
const CUR=JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'),'utf8')).versions.companion;   // (the current Companion: no update notice mid-test)
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,trapsOn:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"}), "800":S(800,"Fu",{gender:"futa",species:"pony",futa:true}),
 "900":{mn:900,name:"Hank",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "950":{mn:950,name:"Bea",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:""}   // (traps off)
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pasture":{X:20,Y:40},"trap":{X:22,Y:40},"trap-ostara":{X:40,Y:40},"trap-easter":{X:42,Y:40},"trap-spring":{X:44,Y:40}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30),at(800,31,30),at(900,33,30),at(950,35,30)];
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
      else if (said.split(" | ").filter(t=>t.includes(name)&&!/Sprung on|stateDiff/.test(t)).length<6) silent.push(k+"/"+name);
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
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.08; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.SYM.TRAP_CHANCE=0; cfg.SYM.LATEX_TRAP_CHANCE=0; cfg.SEND_INTERVAL_MS=2; cfg.TRAP_WRITE_CHANCE=0;
  ['Laynie','Moo','Rex','Pip','Fu','Hank','Bea'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700,800,950]) await say(mn,'?stats',700);
  for (const mn of [500,600,800,950,221397,260239]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:CUR}});
  await wait(600);
  const sets=W.__farmSets(), seasons=W.__seasons(), of=W.__seasonOf();
  const OS=seasons.ostara.kinds, EA=seasons.easter.kinds;
  const on=(d,id)=>W.__seasonsByDate(d).includes(id);

  // ── the calendar ──
  ok(OS.length===6 && EA.length===8, 'Ostara has its 6 traps ('+OS.join(", ")+') and Easter its 8 ('+EA.join(", ")+')');
  ok(on("2027-03-17T09:00:00","ostara") && on("2027-03-23T22:00:00","ostara") && !on("2027-03-16T22:00:00","ostara") && !on("2027-03-24T09:00:00","ostara"), 'Ostara runs Mar 17 to 23, round the spring equinox');
  { const e27=W.__easterOf(2027), e28=W.__easterOf(2028);
    ok(e27.getMonth()===2 && e27.getDate()===28 && e28.getMonth()===3 && e28.getDate()===16, 'Easter Sunday is Mar 28 in 2027 and Apr 16 in 2028'); }
  ok(on("2027-03-21T09:00:00","easter") && on("2027-03-29T22:00:00","easter") && !on("2027-03-20T22:00:00","easter") && !on("2027-03-30T09:00:00","easter"), 'Easter week runs from the Sunday before to Easter Monday (Mar 21 to 29, 2027)');
  ok(on("2028-04-09T09:00:00","easter") && on("2028-04-17T20:00:00","easter") && !on("2028-03-28T12:00:00","easter"), '...and moves with Easter (Apr 9 to 17, 2028)');
  ok(on("2027-03-22T12:00:00","ostara") && on("2027-03-22T12:00:00","easter"), 'in 2027 the two overlap for three days, and both are on');
  ok(!W.__seasonsOn().length, 'nothin\'s on in August');
  { const n=sent.length; await say(500,'?seasons',1000); const s=all(n);
    ok(/Ostara · Mar 17 – 23, the spring equinox/.test(s) && /Easter · Mar 21 – 29, 2027 \(Easter Sunday's Mar 28\)/.test(s), '?seasons lists Ostara, and the next Easter week ('+(s.match(/[^\n]*Easter ·[^\n]*/)||[''])[0].slice(0,120)+')'); }
  { const n=sent.length; await say(500,'?egghunt',1000); ok(/not Easter/.test(all(n)) && /Mar 21 – 29, 2027/.test(all(n)), '?egghunt out of season says when the eggs get hidden'); }

  // ── no season's name is a trap's name, so ?traps <name> and trap-<name> tiles mean one thing ──
  { const kinds=Object.keys(sets.TRAP_KINDS), words=[];
    for (const [id,Sx] of Object.entries(seasons)) words.push(id, ...(Sx.alias||[]));
    const clash=words.filter(w=>kinds.includes(w)); ok(!clash.length, 'no season or season word is also a trap ('+clash.join(", ")+')'); }

  // ── Ostara, by the calendar ──
  W.__date="2027-03-18T12:00:00";
  { let n=sent.length; W.__seasonTick(); await wait(800);
    ok(W.__seasonsOn().includes("ostara") && !W.__seasonsOn().includes("easter"), 'Mar 18: Ostara\'s on, Easter isn\'t yet');
    ok(/🌱 .*(Ostara|equinox|spring)/.test(all(n)), '...and the room is told it\'s begun'); }
  { const c=W.__farmGear(260239), names=c.map(g=>g.name), mine=c.filter(g=>/Spring Crown|Hare/.test(g.name));
    ok(["Spring Crown","Hare Ears","Hare's Tail"].every(x=>names.includes(x)) && mine.every(g=>g.only), 'the farm girl wears a spring crown, hare\'s ears and a hare\'s tail, never a stand-in ('+names.join(", ")+')'); }
  { let own=0, sp=0; for (let i=0;i<200;i++){ const q=W.__seasonPick(500,"trap-ostara"); if (q && q.kinds.every(k=>of[k]==="ostara"||seasons.ostara.also.includes(k))) own++; const s=W.__seasonPick(500,"trap-spring"); if (s && s.kinds.every(k=>of[k]==="ostara"||seasons.ostara.also.includes(k))) sp++; }
    ok(own===200 && sp===200, 'a trap-ostara tile (or trap-spring) springs nothin\' but Ostara ('+own+', '+sp+' of 200)'); }
  await everyTrap(OS, 'Ostara', async (k, mn, name, n) => {
    if (k==="greenman" && mn===500){ const g=P(500).gear||{}; ok(g.hat && /First Bloom/.test(g.hat.label), 'the Green Man crowns Moo with the first bloom'); ok(marks(n,500).some(m=>m.mess==="pollen"), '...and leaves her dusted with pollen'); }
    if (k==="sowing" && mn===600){ ok(marks(n,600).some(m=>m.mess==="mud"), 'the first furrow leaves Rex muddy'); }
    if (k==="eggdye" && mn===800){ ok(marks(n,800).some(m=>m.mess==="dye"), 'the dye tubs leave Fu every pastel colour'); }
    if (k==="balance" && mn===500){ ok((W.__prodOf(500).deniedUntil||0) > Date.now(), 'the see-saw leaves Moo on the edge, and denied a while'); }
    if (k==="nixie" && mn===800){ ok((P(800).prod.eggs||{}).n>0 && /spawn|pearl/.test(all(n)), 'the nixie leaves her pearly spawn in Fu'); }
    if (k==="marchhares" && mn===500){ ok(/hare/.test(all(n)) && Object.values(P(500).prod.held||{}).some(v=>v>0), 'the March hares breed Moo, quick as hares'); }
  });
  ok(OS.every(k=>W.__lines().INTENSITY_BY_TRAP[k] && W.__lines().INTENSITY_BY_TRAP[k].tender.length>=3 && W.__lines().INTENSITY_BY_TRAP[k].filthy.length>=3), 'every Ostara trap has its tender and filthy lines');

  // ── Easter week ──
  W.__date="2027-03-25T12:00:00";
  { let n=sent.length; W.__seasonTick(); await wait(800);
    ok(W.__seasonsOn().includes("easter") && !W.__seasonsOn().includes("ostara"), 'Mar 25: Easter week, and Ostara\'s over');
    ok(/🐣 .*(Easter|egg)/.test(all(n)), '...and the room is told'); }
  { const c=W.__farmGear(260239), names=c.map(g=>g.name);
    ok(["Easter Bonnet","Bunny Ears","Bunny Tail"].every(x=>names.includes(x)) && !names.includes("Spring Crown"), 'the farm girl changes into an Easter bonnet, bunny ears and a bunny tail ('+names.join(", ")+')'); }
  { const n=sent.length; await say(500,'?seasons',1000); ok(/Easter · Mar 21 – 29, 2027 \(Easter Sunday's Mar 28\) · ON NOW/.test(all(n)) && /\?egghunt/.test(all(n)), '?seasons shows Easter on, and the egg hunt'); }
  { let own=0; for (let i=0;i<200;i++){ const q=W.__seasonPick(500,"trap-easter"); if (q && q.kinds.every(k=>of[k]==="easter"||seasons.easter.also.includes(k))) own++; }
    ok(own===200, 'a trap-easter tile springs nothin\' but Easter ('+own+' of 200)'); }
  await everyTrap(EA, 'Easter', async (k, mn, name, n) => {
    if (k==="hiddeneggs" && mn===500){ ok(/eggs/.test(all(n)) && marks(n,500).some(m=>m.mess==="chocolate"), 'the egg hunt finds every egg in Moo, and leaves chocolate'); }
    if (k==="chocfountain" && mn===600){ ok(marks(n,600).some(m=>m.mess==="chocolate"), 'the chocolate fountain leaves Rex glossy brown'); }
    if (k==="marshmallow" && mn===800){ ok(marks(n,800).some(m=>m.mess==="marshmallow"), 'the marshmallow vat leaves Fu sticky'); }
    if (k==="basket" && mn===500){ ok(Object.values(P(500).prod.held||{}).some(v=>v>0), 'whoever the basket was for unwraps Moo properly'); }
  });
  ok(EA.every(k=>W.__lines().INTENSITY_BY_TRAP[k] && W.__lines().INTENSITY_BY_TRAP[k].tender.length>=3 && W.__lines().INTENSITY_BY_TRAP[k].filthy.length>=3), 'every Easter trap has its tender and filthy lines');
  // the bunny suit is real gear while it has them: the suit, the ears, the collar and cuffs, and the tail
  { const g=await heldGear(600,'Rex','bunnysuit');
    ok(g.suit && g.suit.label==="Bunny Girl Suit" && g.suit.only && (g.suit.items||[]).includes("BunnySuit") && g.cloak && /Collar and Cuffs/.test(g.cloak.label) && g.plug && /Tail Plug/.test(g.plug.label) && g.ears && g.ears.only, 'the bunny suit puts on the real suit, ears, collar and cuffs, and a tail plug ('+Object.keys(g).join(", ")+')'); }
  // eggs ruled out: the hunt hides them on Pip instead, and finds them all
  { free(700); P(700).limits="no eggs"; let n=sent.length; await say(221397,'?trap spring Pip hiddeneggs',500); await done(700,700);
    ok(/rolled down somewhere|very well searched|tucked/.test(all(n)) && !/won't spring/.test(all(n)), 'eggs ruled out: the eggs are hidden on Pip, not in them'); P(700).limits=""; }

  // ── ?egghunt ──
  const rnd=Math.random;
  const hunt=async(mn,r,ms)=>{ const H=P(mn).eggHunt; if (H) H.at=0; free(mn); Math.random=()=>r; const n=sent.length; await say(mn,'?egghunt',ms||4500); Math.random=rnd; return n; };
  { const rb0=P(500).ribbons||0; let n=await hunt(500,0.05);
    ok(/🐣/.test(all(n)) && /golden egg/.test(all(n)) && (P(500).ribbons||0)===rb0+1 && P(500).eggHunt.gold===1, 'a golden egg: a ribbon ('+(all(n).match(/🐣[^|]*/g)||[]).slice(-1)[0]+')');
    const rb1=P(500).ribbons||0; n=await hunt(500,0.05,5000);
    ok(P(500).eggHunt.gold===1 && (P(500).ribbons||0)===rb1 && /bait|tied to somethin'|surprise of its own/.test(all(n)), '...only one golden egg a day: the next "egg" was bait for an Easter trap');
    await done(500,800);
    n=await hunt(500,0.45); ok(marks(n,500).some(m=>m.mess==="marshmallow") && /marshmallow/.test(all(n)), 'a soft egg goes all over them (marshmallow)');
    n=await hunt(500,0.7); ok(/🐣[^|]*(cream-filled|caramel egg|honeycomb|blue sugar|sherbet|cinnamon heart)/.test(all(n)), 'a chocolate egg, eaten on the spot');
    n=await hunt(500,0.9); ok(/pretty|pebble|empty|wrapper/.test(all(n)), 'and sometimes just a pretty shell');
    const fnd=P(500).eggHunt.n; n=sent.length; await say(500,'?egghunt',1700);
    ok(/just been round/.test(all(n)) && /20 minutes/.test(all(n)), 'once every twenty minutes ('+fnd+' found)');
    n=await hunt(950,0.2); ok(/jelly bean|bell in it|fizzin'|pink sugar egg|wolf-shaped|green chocolate|purple jelly/.test(all(n)) && !(W.__st().trapRuns&&W.__st().trapRuns.has(950)), 'with traps off, a trick is a strange sweet, never a trap');
    n=sent.length; await say(500,'?egghunt board',1700); const b=all(n);
    ok(/THE EGG HUNT, 2027/.test(b) && new RegExp("Moo · "+fnd+" eggs \\(1 golden\\)").test(b) && /Bea · 1 egg\b/.test(b), '?egghunt board: who\'s found the most ('+b.slice(0,140)+')'); }

  // ── the Companion knows the new pieces and messes ──
  { const comp=fs.readFileSync(path.join(__dirname,'../dist/farmhand-companion.user.js'),'utf8');
    const labels=[].concat(...OS.concat(EA).map(k=>(sets.TRAP_GEAR[k]||[]).map(g=>g.label))).concat(["Spring Crown","Hare Ears","Hare's Tail","Easter Bonnet","Bunny Ears","Bunny Tail"]);
    const missing=labels.filter(x=>!comp.includes(x)); ok(labels.length>=20 && !missing.length, 'every new piece is one the Companion knows to take off again ('+(missing.join(", ")||labels.length+" pieces")+')');
    ok(["dye","pollen","marshmallow"].every(m=>sets.MESS[m]) && ["#e7a3c8","#f2c230","#fce6ef"].every(c=>comp.includes('"'+c+'"')) && /dye:\s*\{/.test(comp) && /pollen:\s*\{/.test(comp) && /marshmallow:\s*\{/.test(comp) && /pastel:\s*\(/.test(comp), 'the Companion draws egg dye (in pastel bands), pollen and marshmallow'); }

  const errs=warns.filter(w=>!/Worker/.test(w)&&/command failed|trap|TypeError|ReferenceError|season|egg/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,400));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all good'); process.exit(fails?1:0);
})();
