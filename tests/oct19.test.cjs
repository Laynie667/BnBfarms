// Oct 19: themed traps, the record (chatlog), contract conditions, nonbinary, the mess shelf in the panel, tease/voice retired.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"maze-start":{X:40,Y:40},"maze-exit":{X:44,Y:40}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==='ChatRoomCharacterMapDataUpdate'||ev==='ChatRoomCharacterUpdate'){} }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const moveTo=(mn,X,Y)=>{ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; };
const free=(...mns)=>{ for(const mn of mns){ const r=P(mn); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; r.maze=null; r.benched=null; if(W.__st().trapRuns) W.__st().trapRuns.delete(mn); } };
const done=async(mn,ms)=>{ for(let i=0;i<60;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(mn))) break; } await wait(ms||600); };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.12; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.SYM.TRAP_CHANCE=0;
  ['Laynie','Moo','Rex','Pip'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700]) await say(mn,'?stats',900);
  const prod=mn=>P(mn).prod;
  cfg.SEND_INTERVAL_MS=2;
  for (const mn of [500,221397]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:"0.30.0"}});
  await wait(800);
  const marks=(n,mn)=>sent.slice(n).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Dictionary&&d.Dictionary.type==='mark'&&(!mn||d.Target===mn)).map(([e,d])=>d.Dictionary);
  const farmTo=(mn,type,n)=>sent.slice(n||0).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Target===mn&&d.Dictionary.type===type).map(([e,d])=>d.Dictionary);
  // ── the new themed traps all run, start to finish, with lines that fit ──
  const NEW=["groomer","whelping","leashpost","teatcheck","wax","tomatoes","bearskin","trophy","hottub","slop","hogtie","booth","milkinghole","feedbag","stag","desk","inspection","stamp","goblinraid","goblinpit","goblinmarket","goblincart","warband","minotaur","werewolf","foxden","lionpride","ramstud","shrine","studchair","clutch","buttermill","syruptap","pieeat","mudslide","squeezechute","twine","yoke","ponycart"];
  const broke=[], silent=[];
  for (const k of NEW){
    free(500); prod(500).milk=400; let n=sent.length;
    await say(221397,'?trap spring Moo '+k,300); await done(500,900);
    const said=all(n);
    if (!new RegExp(W.__farmSets().TRAP_KINDS[k].icon.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).test(said)) silent.push(k);
    if (/%[nchx]|\{[a-z]{1,2}\}|undefined/.test(said)) broke.push(k+": "+(said.match(/.{0,40}(%[nchx]|\{[a-z]{1,2}\}|undefined).{0,40}/)||[""])[0]);
  }
  ok(!silent.length, 'every new themed trap runs and ends ('+(silent.join(", ")||"all "+NEW.length)+')');
  ok(!broke.length, '...with no unfilled words or tags ('+broke.join(" | ")+')');
  ok(W.__farmSets().TRAP_GEAR.whelping && W.__farmSets().TRAP_GEAR.desk, 'the new traps have their own equipment');
  // ── a plain trap tile picks from the place it's in ──
  L().spots={ "kennel-run":{X:20,Y:20}, "trap-7":{X:22,Y:21}, "trap-9":{X:70,Y:70}, "office":{X:50,Y:50}, "trap-theme-cabin":{X:5,Y:5} };
  const kinds=(spot,times)=>{ const got=new Set(); for(let i=0;i<times;i++){ free(500); const r=P(500); r.trapLog=[]; W.__heard; } return got; };
  const picks=new Set();
  for (let i=0;i<14;i++){ free(500); let n=sent.length; moveTo(500,22,21); W.__st().trapAt=new Map(); P(500).spotTrapAt={}; P(500).trapAt=0; W.__trapTick(); await wait(150); const lg=P(500).trapLog||[]; const last=lg[lg.length-1]; if (last && last.spot==="trap-7") picks.add(last.kind); if (W.__st().trapRuns) W.__st().trapRuns.delete(500); }
  const KENNEL=W.__themes ? W.__themes().kennel.kinds : ["kennel","wolves","teaser","crate","bell","groomer","whelping","leashpost","werewolf","foxden"];
  ok(picks.size && [...picks].every(k=>KENNEL.includes(k)), 'a plain trap tile by the kennels springs kennel traps ('+[...picks].join(", ")+')');
  { L().spots['trap-kennels-1']={X:90,Y:90}; const got=new Set(); for (let i=0;i<10;i++){ free(500); moveTo(500,90,90); W.__st().trapAt=new Map(); P(500).spotTrapAt={}; P(500).trapAt=0; W.__trapTick(); await wait(150); const lg=P(500).trapLog||[]; const last=lg[lg.length-1]; if (last && last.spot==='trap-kennels-1') got.add(last.kind); if (W.__st().trapRuns) W.__st().trapRuns.delete(500); }
    ok(got.size && [...got].every(k=>KENNEL.includes(k)), 'a tile named trap-kennels-1 springs kennel traps ('+[...got].join(', ')+')'); }
  let n=sent.length; await say(221397,'?traps themes',900);
  ok(/TRAPS BY PLACE/.test(all(n)) && /cabin/.test(all(n)) && /bearskin/.test(all(n)), '?traps themes lists the places and their traps');
  // ── the record ──
  n=sent.length; handlers.ChatRoomMessage({Sender:500,Type:"Hidden",Content:"FarmhandMsg",Target:260239,Dictionary:{v:2,type:"chatlog",rows:[{t:Date.now(),k:"whisper",f:600,x:"psst, the stall's stuck"},{t:Date.now(),k:"cmd",f:260239,x:"?stats"}]}});
  handlers.ChatRoomMessage({Sender:221397,Type:"Hidden",Content:"FarmhandMsg",Target:260239,Dictionary:{v:2,type:"chatlog",rows:[{t:Date.now(),k:"beep",f:600,x:"Rex: hello boss"}]}});
  await wait(300);
  n=sent.length; handlers.ChatRoomMessage({Sender:221397,Type:"Hidden",Content:"FarmhandMsg",Target:260239,Dictionary:{v:2,type:"logAsk",who:0,hours:3,kind:"",q:""}});
  await wait(1500);
  const rows=farmTo(221397,'logRows',n).flatMap(d=>d.rows||[]);
  ok(rows.some(r=>/stall's stuck/.test(r.x)) && rows.some(r=>/hello boss/.test(r.x)), 'the record: Companions send it, and the Log tab gets it back ('+rows.length+' lines)');
  n=sent.length; handlers.ChatRoomMessage({Sender:221397,Type:"Hidden",Content:"FarmhandMsg",Target:260239,Dictionary:{v:2,type:"logAsk",who:500,hours:3,kind:"cmd",q:""}});
  await wait(1200);
  const r2=farmTo(221397,'logRows',n).flatMap(d=>d.rows||[]);
  ok(r2.length===1 && r2[0].x==="?stats", '...filtered by whose and what kind ('+r2.length+')');
  n=sent.length; handlers.ChatRoomMessage({Sender:500,Type:"Hidden",Content:"FarmhandMsg",Target:260239,Dictionary:{v:2,type:"logAsk",who:0,hours:3}});
  await wait(800);
  ok(!farmTo(500,'logRows',n).length, '...and nobody else can read it');
  ok(W.__stateFor(221397).logMust===true && W.__stateFor(221397).logReader===true && W.__stateFor(500).logMust===false && !W.__stateFor(500).logReader, 'proprietors are always recorded; only the reader gets the Log tab');
  // ── contracts: when the rules apply ──
  n=sent.length; await say(221397,'?contract offer deep Moo 1w when room=private names=farm with=221397 time=20:00-06:00 only=pet.speech',1200);
  const off=sent.slice(n).map(([e,d])=>d).find(d=>d&&d.Content==='BCP'&&d.Dictionary&&d.Dictionary.message==='ContractOffer');
  const pr=off&&off.Dictionary.payload.rules;
  ok(pr && pr["pet.speech"].conditions && pr["pet.speech"].conditions.roomType==="private" && pr["pet.speech"].conditions.timeStart===1200 && pr["pet.speech"].conditions.members==="221397" && !pr["pet.hearing"].conditions,
     'a contract offer carries BC+ conditions, on just the rules asked for ('+JSON.stringify(pr&&pr["pet.speech"].conditions)+')');
  n=sent.length; await say(221397,'?contract offer deep Moo 1w when time=lunch',900);
  ok(/couldn't read when/.test(all(n)), '...and says so when it can\'t read them');
  // ── nonbinary ──
  n=sent.length; await say(700,'?gender nonbinary',900);
  ok(P(700).gender==="nonbinary" && /nonbinary/.test(all(n)), '?gender nonbinary');
  await say(700,'?gender enby',600); ok(P(700).gender==="nonbinary", '...enby works too');
  const b=W.__body(700); ok(b.g==="nonbinary" && b.vulva && !b.cock && b.tits, 'a nonbinary body goes by what they have ('+JSON.stringify(b)+')');
  await say(700,'?chest flat',600); ok(W.__body(700).tits===false, '?chest flat');
  ok(W.__bodyWords(700,"Such a good girl, a fine heifer.")==="Such a good pet, a fine yearlin'.", 'no girl words for them ('+W.__bodyWords(700,"Such a good girl, a fine heifer.")+')');
  { const got=W.__pickFor(700,"t:nb",["{f}A girl line.","{nb}Their own line.","{m}A boy line."]); ok(/Their own line/.test(got), '{nb} lines are theirs ('+got+')'); }
  // ── the mess shelf in the panel's state ──
  const st=W.__stateFor(500); ok((st.store||[]).some(it=>it.shelf==="mess" && it.id==="creampie") && st.messesOn===false, 'the store sends the mess shelf to the panel');
  // ── tease lines and herd voice lines are gone ──
  n=sent.length; await say(221397,'?voice on',900); ok(/retired/.test(all(n)), '?voice is still retired (Tease Me came back Oct 23: teaseme.test.cjs)');
  out(fails ? 'FAILED '+fails : 'all passed'); process.exit(fails?1:0);
})();
