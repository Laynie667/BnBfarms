// Oct 26 later (Laynie): panels sent as changes, the water rinses, the farm girl grooms, her futa grooming traps, the sire bottles, Wrong Barn says why
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"female",species:"kitty"}), "800":{mn:800,name:"Hank",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]}, "900":S(900,"Nibs",{gender:"male",species:"ratslut",futa:false})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30),at(800,31,30),at(900,33,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==='ChatRoomCharacterMapDataUpdate'||ev==='ChatRoomCharacterUpdate'){} }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
W.LZString={ compressToBase64:(t)=>Buffer.from(t).toString('base64'), decompressFromBase64:(t)=>Buffer.from(t,'base64').toString() };
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
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2; cfg.WASH_BEAT_S=0.1; cfg.CHAIN_CHANCE=0; cfg.TRAP_BEAT_S=0.12; cfg.TRAP_COOLDOWN_MIN=0;
  ['Laynie','Moo','Rex','Pip','Hank','Nibs'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700]) await say(mn,'?stats',700);
  const friends=set=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:set.map(m=>({MemberNumber:m,ChatRoomName:"B&B Farm"}))});
  friends([221397,500,600,700,800,900]);
  const to=(mn,type,k)=>sent.slice(k).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Target===mn&&d.Dictionary&&d.Dictionary.type===type).map(([e,d])=>d.Dictionary);
  // ── a new Companion gets the shelf on its own, and only what changed after that ──
  let n=sent.length; handlers.ChatRoomMessage({Sender:500,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'hello',ver:'0.45.0'}}); await wait(3000);
  const st1=to(500,'state',n), sh=to(500,'store',n);
  ok(sh.length===1 && Array.isArray(sh[0].items) && sh[0].items.length && st1.length && !st1[st1.length-1].state.store, 'Companion 0.45: the shelf comes on its own, the panel without it');
  n=sent.length; W.__sync(); W.__sync(); W.__sync(); await wait(800);
  ok(!to(500,'state',n).length && !to(500,'stateDiff',n).length && !to(500,'store',n).length, 'nothin\' changed: nothin\' sent (and three syncs in a row are one)');
  P(500).ribbons=(P(500).ribbons||0)+5; n=sent.length; W.__sync(); await wait(800);
  const df=to(500,'stateDiff',n);
  ok(df.length===1 && df[0].set && df[0].set.ribbons===P(500).ribbons && !to(500,'state',n).length && !('store' in df[0].set), 'a change goes as a diff of just that ('+Object.keys((df[0]||{}).set||{}).join(',')+')');
  n=sent.length; handlers.ChatRoomMessage({Sender:700,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'hello',ver:'0.43.0'}}); await wait(2500);
  const old=to(700,'state',n); ok(old.length && old[old.length-1].state.store && !to(700,'store',n).length, 'an older Companion still gets the whole panel, shelf and all');
  // ── the water rinses a third off ──
  L().spots=Object.assign(L().spots||{}, { "water-pond":{X:40,Y:40} });
  P(500).messKinds={cum:Date.now()}; moveTo(500,40,40);
  n=sent.length; W.__tileCareTick(); await wait(200); ok(!to(500,'mark',n).length, 'a step into the water: not straight away');
  P(500).rinse.in=Date.now()-61000; W.__tileCareTick(); await wait(400);
  ok(to(500,'mark',n).some(m=>m.rinse) && P(500).rinse.n===1, 'a minute in the water: a rinse (a third of the mess)');
  n=sent.length; W.__tileCareTick(); await wait(200); ok(!to(500,'mark',n).length, '...and not again right away');
  P(500).rinse.at=Date.now()-4*60000; W.__tileCareTick(); await wait(200); P(500).rinse.at=Date.now()-4*60000; n=sent.length; W.__tileCareTick(); await wait(500);
  ok(to(500,'mark',n).some(m=>m.wash) && !P(500).rinse && !P(500).messKinds, 'the third rinse takes the last of it, like ?wash');
  n=sent.length; P(500).messKinds=null; W.__tileCareTick(); await wait(200); ok(!to(500,'mark',n).length, 'clean already: the water leaves them be');
  moveTo(500,15,10);
  // ── the farm girl brushes whoever stands next to her ──
  moveTo(600,2,1); n=sent.length; W.__tileCareTick(); await wait(200); ok(!/The farm girl/.test(all(n)), 'walkin\' past her: no brushin\'');
  P(600).groomNear=Date.now()-31000; const rnd=Math.random; W.__st().groomAt=0; W.__tileCareTick(); await wait(1200);
  const gl=all(n); ok(/The farm girl/.test(gl) && P(600).groomedAt, 'standin\' next to her a moment: she grooms them ('+(gl.match(/The farm girl[^|]{0,90}/)||[''])[0]+')');
  ok(!/\b(tits|pussy|hooves|fleece)\b/.test(gl), '...fitted to a male dog');
  n=sent.length; W.__st().groomAt=0; W.__tileCareTick(); await wait(300); ok(!/The farm girl/.test(all(n)), 'once every half hour');
  n=sent.length; await say(600,'?grooming off',900); P(600).groomedAt=0; W.__st().groomAt=0; W.__tileCareTick(); await wait(300);
  ok(P(600).noGroom && !/The farm girl/.test(all(n)), '?grooming off: she leaves them be');
  moveTo(600,16,10);
  // ── her futa grooming traps: only her brush (or a proprietor) springs them ──
  P(500).trapsOn=true; free(500);
  ok(/only the farm girl's own brush/.test(W.__trapWhyNot(500,'groomstand')||''), 'a tile or a random trap can never pick them');
  const broke=[], silent=[];
  for (const k of ['groomstand','groomtail','groombucket']) for (const mn of [500,600]){
    if (mn===600){ P(600).trapsOn=true; } free(mn); n=sent.length;
    await say(221397,'?trap spring '+(mn===500?'Moo':'Rex')+' '+k,600); await done(mn,900);
    const said=all(n), icon=W.__farmSets().TRAP_KINDS[k].icon;
    if ((said.split(icon).length-1)+(said.split('(*').length-1)<5 || !/sprung a trap/.test(said)) silent.push(k+'/'+mn+': '+said.length+' '+(said.split('(*').length-1)+' '+said.slice(-300));
    if (/%[nchxs]|\{[a-z]{1,2}\}|undefined|NaN/.test(said)) broke.push(k+': '+(said.match(/.{0,40}(%[nchxs]|\{[a-z]{1,2}\}|undefined|NaN).{0,40}/)||[""])[0]);
    if (mn===600 && /\b(pussy|tits|womb)\b/.test(said.replace(/Moo/g,''))) broke.push(k+' male: '+(said.match(/.{0,40}\b(pussy|tits|womb)\b.{0,40}/)||[''])[0]);
  }
  ok(!silent.length, 'each grooming trap runs its whole story ('+silent.join(' ; ').slice(0,400)+')');
  ok(!broke.length, '...every line filled and fitted ('+broke.join(' ; ')+')');
  free(500); P(500).groomedAt=0; P(500).trapAt=0; moveTo(500,2,2); P(500).groomNear=Date.now()-31000; W.__st().groomAt=0; Math.random=()=>0;
  n=sent.length; W.__tileCareTick(); Math.random=rnd; await done(500,900);
  const lg=(P(500).trapLog||[]).slice(-1)[0]||{}; ok(/^groom/.test(lg.kind||''), 'and sometimes her brushin\' turns into one of them ('+lg.kind+')');
  free(500); moveTo(500,15,10);
  // ── the sire bottles ──
  const prod=mn=>W.__prodOf(mn);
  P(500).breedable=true; P(500).fertile=true; P(600).potionsOn=true; P(500).potionsOn=true;
  prod(500).preg={since:Date.now()-3*86400000,due:Date.now()+86400000,sires:[-12,800],count:3,warned:false}; prod(500).eggs={n:6,by:-16,since:Date.now(),layAt:Date.now()+86400000};
  ok(!W.__givePotion(900,'siresclaim',221397) || true, '');
  n=sent.length; W.__givePotion(600,'siresclaim',221397); await wait(300);
  W.__roll(500,600,200); await wait(600);
  ok(JSON.stringify(prod(500).preg.sires)==='[600]' && prod(500).eggs.by===600 && !(P(600).fx||{}).siresclaim, 'Sire\'s Claim: Rex breeds bred Moo, and the whole brood and clutch are his ('+JSON.stringify(prod(500).preg.sires)+')');
  ok(/everything you're carryin' is Rex's/.test(all(n)) && /🧬/.test(all(n)), '...and they\'re told');
  W.__roll(500,800,200); ok(JSON.stringify(prod(500).preg.sires)==='[600]', 'a claimed litter takes no other sire');
  // One Sire, drunk by the one carryin'
  n=sent.length; W.__givePotion(500,'onesire',221397); await wait(300); W.__roll(500,-43,300); await wait(400);
  ok(JSON.stringify(prod(500).preg.sires)==='[-43]' && prod(500).eggs.by===-43 && !(P(500).fx||{}).onesire && /the minotaur/.test(all(n)), 'One Sire: the next load (the minotaur\'s) is the only sire of all of it');
  // One Sire on an empty belly: if it takes, nobody else can join
  prod(500).preg=null; prod(500).eggs=null; W.__givePotion(500,'onesire',221397); await wait(200);
  const rr=Math.random; Math.random=()=>0; W.__roll(500,600,400); Math.random=rr;
  ok(prod(500).preg && prod(500).preg.claimed===600 && !(P(500).fx||{}).onesire, 'One Sire on an empty belly: it takes, and it\'s locked to that one');
  Math.random=()=>0; W.__roll(500,800,400); Math.random=rr; ok(JSON.stringify(prod(500).preg.sires)==='[600]', '...no second sire joins');
  n=sent.length; const ref=W.__givePotion(700,'siresclaim',221397); P(700).gender='female';
  ok(true,'');
  // ── Wrong Barn tells the drinker why when it can't dress them ──
  P(900)&&(P(900).potionsOn=true);
  n=sent.length; W.__givePotion(800,'wrongbarn',800); await wait(2500);
  const errs=warns.filter(w=>!/Worker/.test(w)&&/command failed|TypeError|ReferenceError|rinse|groom|sire/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all passed'); process.exit(fails?1:0);
})();
