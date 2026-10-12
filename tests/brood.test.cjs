// Batch A (Oct 11): laying as a scene with ?tend, a belly that shows, scents, different water, ?quiet, and the
// "what's happenin' to me" lines.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,potionsOn:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:""}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pond":{X:30,Y:30},"nest":{X:40,Y:40},"trough":{X:50,Y:50},"well":{X:60,Y:60},"bath":{X:70,Y:70}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,14,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}}, location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn], prod=mn=>P(mn).prod;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const to=(mn,n)=>sent.slice(n).filter(([e,d])=>d&&((d.Type==='Whisper'&&d.Target===mn)||(e==='AccountBeep'&&d.MemberNumber===mn))).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2400); };
const moveTo=(mn,X,Y)=>{ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.12; cfg.TRAP_COOLDOWN_MIN=0;
  ['Laynie','Moo','Hana'].forEach((nm,i)=>chars[i+1].Name=nm);
  await say(500,'?stats'); await say(600,'?stats');
  let n;
  // ── the belly ──
  ok(W.__belly(500)===0, 'no belly to speak of');
  prod(500).eggs={n:12,by:-2,since:Date.now()-2*3600000,layAt:Date.now()+86400000}; ok(W.__belly(500)===1, 'a dozen eggs: showin\'');
  prod(500).eggs.n=45; ok(W.__belly(500)===3, 'forty-five: huge');
  n=sent.length; W.__trapTick(); await wait(600);
  ok(/huge|past all decency/.test(all(n)) && W.__stateFor(500).now.some(x=>/Belly: huge/.test(x.text)), 'the room hears when it grows, and it shows on their strip');
  // ── layin', tended ──
  moveTo(500,40,40); moveTo(600,41,40);
  n=sent.length; await say(600,'?tend Moo'); ok(/tendin' Moo/.test(to(600,n)) && P(500).tender, '?tend: somebody signs on to help');
  const rb=P(600).ribbons||0; n=sent.length; await say(500,'?lay',600);
  ok(prod(500).eggs && prod(500).eggs.n===45 && P(500).penned && P(500).penned.brood, 'the eggs stay in till the layin\' is done, and she is held on the nest');
  ok(W.__happening(500).some(t=>/comin': part/.test(t)), '"what\'s happenin\' to me" says where the layin\' is');
  await wait(4500);
  ok(!prod(500).eggs && L().nest.eggs===45 && !P(500).penned, 'at the end the clutch is in the nest and she is let go');
  ok(/Hana/.test(all(n)) && (P(600).ribbons||0)===rb+1, 'the one tendin\' is written into it, and paid a ribbon');
  // the safeword stops a layin' with the eggs still in
  prod(500).eggs={n:60,by:-2,since:Date.now()-2*3600000,layAt:Date.now()+86400000}; cfg.TRAP_BEAT_S=5; await say(500,'?lay',600);
  await say(500,'?safeword',2500); cfg.TRAP_BEAT_S=0.12; await wait(400);
  ok(prod(500).eggs && prod(500).eggs.n===60 && !P(500).penned, 'the safeword stops a layin\', and the rest stay in');
  prod(500).eggs=null; P(500).trapQuiet=0; moveTo(500,15,10); moveTo(600,14,10); W.__trapTick();
  // ── different water ──
  cfg.TENTACLE_CHANCE=1; cfg.TENTACLE_HYPER_CHANCE=0;
  const dip=async(X,Y)=>{ P(500).trapAt=0; P(500).penned=null; P(500).gear=null; P(500).dirt=null; moveTo(500,15,10); W.__trapTick(); moveTo(500,X,Y); n=sent.length; W.__trapTick(); await wait(2600); return to(500,n); };
  let got=await dip(50,50); ok(/leeches/.test(got) && (W.__stateFor(500).farmGear||[]).some(g=>/Leeches/.test(g.name)), 'the trough has leeches, and they stay on as real gear');
  got=await dip(60,60); ok(/thing in the well/.test(got) && prod(500).eggs && prod(500).eggs.by===-2, 'the well pulls them down and leaves eggs');
  prod(500).eggs=null; got=await dip(70,70); ok(/slime/.test(got), 'a bath has slime');
  got=await dip(30,30); ok(/thing in the water/.test(got), 'the pond keeps its tentacles');
  prod(500).eggs=null; P(500).gluedUntil=0;
  // ── scents ──
  cfg.TENTACLE_CHANCE=0; cfg.SCENT_WAIT_MIN=0; cfg.SCENT_CHANCE=1; P(500).trapAt=0; P(500).penned=null; P(500).gear=null; moveTo(500,15,10); W.__trapTick();
  await say(221397,'?potion give Moo wolfscent',2600); n=sent.length; W.__trapTick(); await wait(7500);
  ok(/howl|trottin'/.test(all(n)) && /wolf/i.test(to(500,n)), 'Wolf Scent: the pack comes and finds them, no spot needed');
  P(500).trapAt=0; P(500).penned=null; P(500).gear=null; prod(500).held={vulva:0,butt:0,mouth:0};
  // ── quiet ──
  n=sent.length; await say(500,'?quiet'); ok(P(500).quietUntil>Date.now()+55*60000 && /60 minutes of quiet/.test(to(500,n)), '?quiet: an hour by default');
  n=sent.length; await say(221397,'?trap spring Moo mud'); ok(/asked for quiet/.test(to(221397,n)), '...and no trap will spring on them');
  ok(W.__stateFor(500).quietUntil>Date.now() && W.__happening(500).some(t=>/Quiet/.test(t)), '...the Companion knows, and says so');
  await say(500,'?quiet off'); n=sent.length; await say(221397,'?trap spring Moo mud'); ok(/Sprung on Moo/.test(to(221397,n)), '?quiet off: the farm can find them again');
  const errs=warns.filter(w=>/brood|scene|trap|command failed|panel state/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
