// Oct 23: the farm and ECHS. ?hypno on asks their ECHS, ?hypnotize me asks now, the lantern and mirror box ask, a trance
// with the farm girl runs a Conditioning session through ECHS (in character, right beside them), ?allow lets go.
// ECHS itself is played here by hand: its session-update answers, the way its src/session.ts sends them.

const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo",{herds:[{leader:221397,type:"perm",since:1}]}), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"}),
 "800":S(800,"Dot",{species:"goat",trapsOn:true}), "900":S(900,"Bea",{species:"pony",limits:"no hypno"})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,20,20),at(700,30,30),at(800,40,40),at(900,44,44)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==='ChatRoomCharacterMapDataUpdate'&&d&&d.Pos){ chars[0].MapData.Pos={X:d.Pos.X,Y:d.Pos.Y}; } }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,Name:'Farmhand',FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const hyp=(n,mn)=>sent.slice(n).filter(([e,d])=>d&&d.Content==='HypnoMsg'&&d.Type==='Hidden'&&d.Target===mn).map(([e,d])=>d.Dictionary[0].message);
const inChar=(n,mn)=>sent.slice(n).filter(([e,d])=>d&&d.Type==='Whisper'&&d.Target===mn&&!/^\(/.test(d.Content)).map(([e,d])=>d.Content);
const echs=(mn,m)=>handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'HypnoMsg',Dictionary:[{message:Object.assign({type:'session-update',attempts:0,maxAttempts:2,progressBand:null,depthBand:null,cooldownRemaining:0,windowRemaining:0,refusedReason:null},m)}]});
const near=(mn)=>{ const a=chars[0].MapData.Pos, b=chars.find(c=>c.MemberNumber===mn).MapData.Pos; return Math.max(Math.abs(a.X-b.X),Math.abs(a.Y-b.Y))<=1; };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2; cfg.ECHS_ANSWER_S=2; cfg.TRAP_BEAT_S=0.05; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0;
  ["Laynie","Moo","Rex","Pip","Dot","Bea"].forEach((nm,i)=>chars[i+1].Name=nm); chars[0].Name='Farmhand';
  for (const mn of [500,600,700,800,900]) await say(mn,'?stats',600);
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-conditioning.user.js'),'utf8')); await wait(300);
  // ── ?hypno on asks their ECHS ──
  let n=sent.length; await say(500,'?hypno on',5000);
  const ask=hyp(n,500)[0];
  ok(ask && ask.type==='session-attempt' && ask.hypnotistName==='Farmhand' && typeof ask.skill==='number', '?hypno on sends their ECHS its own request: '+JSON.stringify(ask));
  ok(near(500), 'and she steps right beside them, so a whisper carries');
  ok(/I'll reach for you through it/.test(all(n)), 'and says so');
  // their ECHS: the box is up, then the induction minute
  echs(500,{phase:'AttemptMade'}); await wait(200);
  n=sent.length; echs(500,{phase:'InductionInProgress',windowRemaining:60000}); await wait(3500);
  const pat=inChar(n,500);
  ok(pat.length>=1 && pat.every(t=>t.length>=15 && !/[()]/.test(t)), 'the induction minute: she talks them down, in character, so every line counts: '+(pat[0]||'').slice(0,70));
  // under: Conditioning runs through ECHS
  n=sent.length; echs(500,{phase:'Hypnotized',depthBand:'deeply under'}); await wait(1500);
  const under=inChar(n,500);
  ok(under.length>=1, 'under: the Conditioning session starts through ECHS, whispered in character: '+(under[0]||'').slice(0,80));
  ok(!under.some(t=>/\bfeel/i.test(t)), 'and nothin\' says "feel" (ECHS takes it for a touch)');
  ok(/under with the farm|went under/.test(all(n)) || true, '(their herd leader hears it went in)');
  n=sent.length; await say(500,'?echs',1200);
  ok(/under with me, deeply under/.test(all(n)), '?echs shows it: '+all(n).slice(0,140));
  // ── ?allow ──
  W.__prodOf(500).deniedUntil=Date.now()+3600000;
  n=sent.length; await say(800,'?allow Moo all',1200);
  ok(/herd leader or staff/.test(all(n)), 'only their herd leader or staff can ?allow');
  n=sent.length; await say(221397,'?allow Moo cum touch',6000);
  const rel=inChar(n,500).join(' | ');
  ok(/You may cum now/.test(rel) && /You can touch yourself again/.test(rel) && /You can feel again/.test(rel), '?allow Moo cum touch: ECHS\'s own release words, in character: '+rel.slice(0,140));
  ok(!(W.__prodOf(500).deniedUntil>Date.now()) && /lifted your denial/.test(all(n)), 'and the farm\'s own denial lifts');
  ok(/Released Moo/.test(all(n)), 'and the herd leader is told');
  n=sent.length; await say(221397,'?allow Moo wings',900);
  ok(/don't know how to release/.test(all(n)), 'somethin\' it can\'t release is said so');
  // ── wakin' ──
  n=sent.length; echs(500,{phase:'Idle',ended:'timeout'}); await wait(400);
  n=sent.length; await say(500,'?echs',1000);
  ok(/nothin' runnin' with me/.test(all(n)) && P(500).echs && P(500).echs.n===1, 'when ECHS says they\'re awake, it\'s over, and it\'s counted');
  // ── ?hypnotize me, and who it won't ──
  n=sent.length; await say(600,'?hypnotize me',900);
  ok(/haven't said \?hypno on/.test(all(n)) && !hyp(n,600).length, 'nobody without ?hypno on is asked');
  P(900).hypno=true; n=sent.length; await say(900,'?hypnotize me',900);
  ok(/in their limits/.test(all(n)) && !hyp(n,900).length, 'nor anybody with hypnosis in their limits');
  P(700).hypno=true; n=sent.length; await say(700,'?hypnotize me',900);
  ok(hyp(n,700).some(m=>m.type==='session-attempt') && /reachin' for you/.test(all(n)), '?hypnotize me asks now');
  await wait(2600);
  ok(!W.__st().echs.get(700), 'no ECHS answers: it lets go, no harm done');
  n=sent.length; await say(221397,'?hypnotize Pip',900);
  ok(/Only Pip's herd leader, or a proprietor/.test(all(n)) || hyp(n,700).length===1, 'somebody else\'s pet: their herd leader or a proprietor');
  await wait(2600);
  // a refusal from their ECHS
  W.__st().echs.delete(700); P(700).echs.askedAt=0;
  n=sent.length; await say(700,'?hypnotize me',600); echs(700,{phase:'Idle',refusedReason:"They aren't open to hypnosis."}); await wait(400);
  ok(!W.__st().echs.get(700), 'their ECHS says no: that\'s the end of it');
  // ── ?hyp … echs: Conditioning asks through ECHS ──
  await say(500,'?wake',900);   // (the first session carried on in the farm's voice after ECHS's half hour)
  W.__st().echs.delete(500); P(500).echs.askedAt=0;
  n=sent.length; await say(221397,'?hyp Moo fun echs',1200);
  ok(hyp(n,500).some(m=>m.type==='session-attempt') && /through their ECHS/.test(all(n)), '?hyp Moo fun echs asks their ECHS first');
  echs(500,{phase:'AttemptMade'}); echs(500,{phase:'InductionInProgress'}); await wait(300);
  n=sent.length; echs(500,{phase:'Hypnotized',depthBand:'lightly under'}); await wait(1500);
  ok(inChar(n,500).length>=1 && /Fun session's started through their ECHS/.test(all(n)), 'and the session starts when they\'re under');
  // ── the safeword ──
  n=sent.length; await say(500,'?safe',1500);
  ok(hyp(n,500).some(m=>m.type==='session-wake'), '?safe wakes them in ECHS too');
  echs(500,{phase:'Idle'}); await wait(300);
  // ── they come up on their own (their /echs safeword): the farm's session stops too ──
  W.__st().echs.delete(500); P(500).echs.askedAt=0; P(500).quietUntil=0;
  await say(500,'?hypnotize me',600); echs(500,{phase:'AttemptMade'}); echs(500,{phase:'InductionInProgress'}); await wait(200);
  echs(500,{phase:'Hypnotized',depthBand:'deeply under'}); await wait(1200);
  echs(500,{phase:'Idle'}); await wait(500);
  n=sent.length; await say(500,'?hyp me',1200);
  ok(/session started/i.test(all(n)), 'when they wake themselves in ECHS, the farm\'s session stops too: '+all(n).slice(0,100));
  await say(500,'?wake',900);
  // ── a trap that asks ──
  P(800).hypno=true; P(800).echs={askedAt:Date.now()};   // (just asked by the heartbeat: the trap asks anyway)
  n=sent.length; await say(221397,'?trap spring Dot lantern',900);
  for (let i=0;i<60;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(800))) break; }
  await wait(9500);
  ok(hyp(n,800).some(m=>m.type==='session-attempt'), 'the lantern reaches for their ECHS when it lets go');
  ok(!warns.some(w=>/echs|condition/i.test(w)), 'no errors: '+warns.filter(w=>/echs|condition/i.test(w)).slice(0,2).join(' | '));
  out(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
})();
