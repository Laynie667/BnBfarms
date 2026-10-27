// Oct 27 (Laynie: "halloween pack, but alot more, full of tricks and treats. winter pack yes, easter, yes, soltice and
// equinox based packs with pagan/wiccan themes would be cool"): the seasons, Halloween's traps, trick-or-treatin', and
// the farm girl's costume.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,trapsOn:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"}), "800":S(800,"Fu",{gender:"futa",species:"pony",futa:true}),
 "900":{mn:900,name:"Hank",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pasture":{X:20,Y:40},"trap":{X:22,Y:40},"trap-halloween":{X:40,Y:40},"trap-kennels-1":{X:60,Y:60},"kennel":{X:61,Y:60}}});
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
const free=(...mns)=>{ for(const mn of mns){ const r=P(mn); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; r.benched=null; r.quietUntil=0; if(W.__st().trapRuns) W.__st().trapRuns.delete(mn); } };
const done=async(mn,ms)=>{ for(let i=0;i<80;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(mn))) break; } await wait(ms||600); };
const LEAK=/\{(nv|nc|nt|fu|fb|nb|v|c|t|f|m)\}|%[a-z]{1,8}\b|\bundefined\b|\bNaN\b|\[object/;
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.08; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.SYM.TRAP_CHANCE=0; cfg.SYM.LATEX_TRAP_CHANCE=0; cfg.SEND_INTERVAL_MS=2;
  ['Laynie','Moo','Rex','Pip','Fu','Hank'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700,800]) await say(mn,'?stats',700);
  for (const mn of [500,221397,260239]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:"0.47.0"}});
  await wait(600);
  const sets=W.__farmSets(), seasons=W.__seasons(), of=W.__seasonOf();
  const HW=seasons.halloween.kinds;

  // ── the calendar ──
  ok(HW.length===18, 'Halloween has its 18 traps ('+HW.length+'): '+HW.join(', '));
  { const e=W.__easterOf(2027), e26=W.__easterOf(2026), e28=W.__easterOf(2028);
    ok(e.getMonth()===2&&e.getDate()===28 && e26.getMonth()===3&&e26.getDate()===5 && e28.getMonth()===3&&e28.getDate()===16, 'Easter falls right (2026 Apr 5, 2027 Mar 28, 2028 Apr 16)'); }
  ok(W.__seasonsByDate("2026-10-24T09:00:00").includes("halloween") && W.__seasonsByDate("2026-11-01T22:00:00").includes("halloween") && !W.__seasonsByDate("2026-11-02T09:00:00").includes("halloween") && !W.__seasonsByDate("2026-10-23T22:00:00").includes("halloween"), 'Halloween week runs Oct 24 to Nov 1');
  ok(!W.__seasonsOn().length, 'nothin\'s on in August');

  // ── out of season: never springs, and the tile is a plain one ──
  { let pick=0; for (let i=0;i<40;i++){ if (W.__seasonPick(500,"trap")) pick++; } ok(pick===0, 'out of season, no tile springs from the pack');
    free(500); let n=sent.length; handlers.ChatRoomMessage({Sender:500,Type:'Whisper',Content:'?traps',Target:260239}); await wait(900);
    ok(/Halloween week \(Oct 24/.test(all(n)), '?traps lists the seasons\' traps apart, with their dates'); }

  // ── a season started by hand ──
  { let n=sent.length; await say(221397,'?seasons start halloween 3',1500);
    ok(W.__seasonsOn().includes("halloween") && /Halloween week is on now, for 3 hours/.test(all(n)), '?seasons start halloween 3 runs it now ('+all(n).slice(0,160)+')');
    ok(/🎃 .*(Halloween|veil)/.test(all(n)), '...and the room is told it\'s begun'); }
  { let hit=0, own=0, place=0; const old=cfg.SEASON_SHARE;
    for (let i=0;i<300;i++){ const p=W.__seasonPick(500,"trap"); if (p) hit++; const q=W.__seasonPick(500,"trap-halloween"); if (q && q.kinds.every(k=>of[k]==="halloween"||seasons.halloween.also.includes(k))) own++; }
    ok(hit>60 && hit<150, 'about a third of a plain tile\'s springs come from the pack ('+hit+' of 300)');
    ok(own===300, 'a trap-halloween tile springs nothin\' but Halloween ('+own+' of 300)');
    cfg.SEASON_SHARE=1; const k=W.__seasonPick(500,"trap-kennels-1"); cfg.SEASON_SHARE=old;
    ok(k && k.kinds.length && k.kinds.every(x=>["hellhounds","treatdoor"].includes(x)), 'a kennel tile springs the ones that fit the kennel ('+(k&&k.kinds.join(","))+')'); }
  { const c=W.__farmGear(260239), names=c.map(g=>g.name);
    ok(names.includes("Witch's Hat") && names.includes("Black Cat Ears") && names.includes("Black Cat Tail") && c.every(g=>g.always) && c.find(g=>g.name==="Witch's Hat").only, 'the farm girl dresses up (witch\'s hat only if the game has one, cat ears and tail): '+names.join(", ")); }

  // ── every Halloween trap, start to finish, on four bodies ──
  const broke=[], silent=[], refused=[];
  for (const k of HW){
    for (const [mn,name] of [[500,'Moo'],[600,'Rex'],[700,'Pip'],[800,'Fu']]){
      free(mn); P(mn).prod.milk=400; let n=sent.length;
      await say(221397,'?trap spring '+name+' '+k,500);
      await done(mn,700);
      const said=all(n);
      if (/won't spring/.test(said)) refused.push(k+"/"+name+": "+(said.match(/won't spring[^|]*/)||[""])[0]);
      else if (said.split(" | ").filter(t=>t.includes(name)&&!/Sprung on|stateDiff/.test(t)).length<6) silent.push(k+"/"+name);   // (a line about somebody with no Companion, off by themselves, goes to them quietly, without its icon)
      if (LEAK.test(said)) broke.push(k+"/"+name+": "+(said.match(/.{0,50}(\{(nv|nc|nt|fu|fb|nb|v|c|t|f|m)\}|%[a-z]{1,8}\b|undefined|NaN|\[object).{0,50}/)||[""])[0]);
      if (k==="costumetrunk" && mn===500){ const g=P(500).gear||{}; ok(g.ears && g.tail && g.ears.only && /Costume/.test(g.ears.label), 'the costume trunk leaves real ears and a tail for an hour'); }
      if (k==="demon" && mn===600){ const g=P(600).gear||{}; ok(g.horns && (g.horns.items||[]).includes("Horns2"), 'the demon leaves little horns'); }
      if (k==="revel" && mn===500){ const g=P(500).gear||{}; ok(g.hat && (g.hat.items||[]).includes("ReindeerBand"), 'the Samhain fire leaves antlers'); }
    }
  }
  ok(!refused.length, 'every one springs on every body ('+(refused.join(" ; ")||"all")+')');
  ok(!silent.length, 'every one runs its whole story ('+(silent.join(", ")||"all "+HW.length)+')');
  ok(!broke.length, '...and every line fills in ('+broke.join(" ; ")+')');
  ok(HW.every(k=>W.__lines().INTENSITY_BY_TRAP[k] && W.__lines().INTENSITY_BY_TRAP[k].tender.length>=3 && W.__lines().INTENSITY_BY_TRAP[k].filthy.length>=3), 'every one has its tender and filthy lines');
  ok(HW.every(k=>sets.TRAP_KINDS[k].what && !/undefined/.test(sets.TRAP_KINDS[k].what)), 'every one says what it is');
  ok(["pumpkin","caramel","ecto","cider","brew"].every(m=>sets.MESS[m]), 'the new messes have their colours');

  // ── trick-or-treat ──
  { free(500); P(500).totAt=0; let n=sent.length; await say(500,'?trickortreat',6000);
    const said=all(n); ok(/farm girl/.test(said) && /🎃/.test(said), 'trick-or-treat: the farm girl answers the door ('+said.slice(0,200)+')');
    n=sent.length; await say(500,'?tot',1200); ok(/only just been/.test(all(n)), '...and once every 20 minutes'); }
  { free(700); for (let i=0;i<6;i++){ P(700).totAt=0; await say(700,'?tot',5500); await done(700,300); free(700); }
    ok(P(700).totN===6, 'six knocks counted'); }

  // ── stop it ──
  { let n=sent.length; await say(221397,'?seasons stop',1500); ok(!W.__seasonsOn().length, '?seasons stop ends it');
    ok(/over|out|gutters/.test(all(n)), '...and the room is told');
    free(500); n=sent.length; await say(221397,'?trap spring Moo headless',2500); free(500);
    ok(/Sprung on Moo/.test(all(n)), 'a proprietor can still spring one by hand out of season');
    n=sent.length; await say(500,'?tot',1200); ok(/not Halloween/.test(all(n)), 'no trick-or-treatin\' out of season'); }
  { let n=sent.length; await say(500,'?seasons',1200); ok(/THE FARM'S SEASONS/.test(all(n)) && /Halloween week/.test(all(n)), '?seasons shows the calendar');
    n=sent.length; await say(600,'?calendar',1200); ok(/THE FARM'S SEASONS/.test(all(n)), '...and ?calendar'); }

  // ── any season, any time (Laynie, Oct 27: "i would like to have commands to turn on the holiday traps any time, like for
  //    special occasions, just because") ──
  { let n=sent.length; await say(500,'?seasons start halloween',1200); ok(!W.__seasonsOn().length && /proprietors/.test(all(n)), 'only the proprietors start one');
    ok(!W.__stateFor(500).seasonsAdmin && !W.__stateFor(900).seasonsAdmin, '...and only they get the Seasons card');
    n=sent.length; await say(221397,'?seasons start halloween on',1500);
    const f=L().seasons.forced.halloween;
    ok(W.__seasonsOn().includes("halloween") && f && f.open && /on now, till you stop it/.test(all(n)), '?seasons start halloween on: on till it\'s stopped ('+all(n).slice(0,120)+')');
    L().seasons.forced.halloween.at=Date.now()-400*86400000; W.__seasonTick(); ok(W.__seasonsOn().includes("halloween"), '...and it doesn\'t run out');
    n=sent.length; await say(221397,'?seasons',1200); ok(/started by hand, till it's stopped/.test(all(n)) && /\?seasons start <name\|all>/.test(all(n)), '?seasons says it was started by hand, and how to start one');
    const card=(W.__stateFor(221397).seasonsAdmin||{rows:[]}).rows.find(x=>x.id==='halloween');
    ok(card && card.on && card.hand && card.open && W.__stateFor(221397).seasonsAdmin.costume===true, 'the proprietors\' Seasons card shows it on, by hand, till stopped');
    n=sent.length; await say(221397,'?seasons stop',1500); ok(!W.__seasonsOn().length && !L().seasons.forced.halloween && /off now/.test(all(n)), '?seasons stop ends the ones started by hand');
    n=sent.length; await say(221397,'?seasons start all 3d',1500);
    const g=L().seasons.forced.halloween;
    ok(W.__seasonsOn().includes("halloween") && g && !g.open && Math.abs(g.until-Date.now()-3*86400000)<60000 && /for 3 days/.test(all(n)), '?seasons start all 3d: every pack, for three days ('+all(n).slice(0,120)+')');
    n=sent.length; await say(221397,'?seasons start halloween for 90 minutes',1500);
    ok(Math.abs(L().seasons.forced.halloween.until-Date.now()-90*60000)<60000 && /for 1\.5 hours/.test(all(n)), '...and the time can be changed: "for 90 minutes"');
    n=sent.length; await say(221397,'?seasons start halloween soonish',1500); ok(/How long, sugar/.test(all(n)), 'a length it can\'t read is asked about');
    n=sent.length; await say(221397,'?seasons stop all',1500); ok(!W.__seasonsOn().length, '?seasons stop all');
    // a ledger from before (one season by hand, as S0.force) still counts
    L().seasons.force={id:'halloween',until:Date.now()+3600000,by:221397}; ok(W.__seasonsOn().includes("halloween") && L().seasons.forced.halloween && L().seasons.force===undefined, 'a season started by hand before this still counts');
    await say(221397,'?seasons stop',1500); ok(!W.__seasonsOn().length, '...and stops');
    const dist=fs.readFileSync(path.join(__dirname,'../dist/farmhand-companion.user.js'),'utf8');
    ok(/Till I stop it/.test(dist) && /seasons start all 2h/.test(dist) && /Stop the ones I started/.test(dist), 'the Companion has the Seasons card, with its buttons'); }

  const errs=warns.filter(w=>!/Worker/.test(w)&&/command failed|trap|TypeError|ReferenceError|season/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,400));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all good'); process.exit(fails?1:0);
})();
