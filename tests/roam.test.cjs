// Oct 24: roam passes. A summonable contract lets them off the farm an hour at a time (they pick when), the farm girl
// sees where they are from the online friends list, warns them, and summons them home with BC+'s Ready to be summoned.

const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",ribbons:70},extra||{});
const until=Date.now()+86400000*3;
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo",{herds:[{leader:221397,type:"perm",since:1}]}), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip")
},contracts:[{key:"a",mn:500,status:"signed",depth:"deep",rules:["other.summon","pet.speech"],signedAt:Date.now(),until},
             {key:"b",mn:700,status:"signed",depth:"fun",rules:["pet.speech"],signedAt:Date.now(),until}],
 applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const moo=at(500,15,10);
const chars=[at(260239,1,1),at(221397,10,10),moo,at(600,20,20),at(700,30,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
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
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1300); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const beeps=(n,mn)=>sent.slice(n).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===mn).map(([e,d])=>d);
const friends=(rooms)=>handlers.AccountQueryResult({Query:'OnlineFriends',Result:Object.entries(rooms).map(([m,r])=>({MemberNumber:+m,MemberName:'x',ChatRoomName:r,ChatRoomSpace:''}))});
const leave=()=>{ const i=chars.indexOf(moo); if(i>=0) chars.splice(i,1); };
const back=()=>{ if(!chars.includes(moo)) chars.push(moo); };
const tick=async()=>{ W.__roamTick(); await wait(500); };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  ["Laynie","Moo","Rex","Pip"].forEach((nm,i)=>chars[i+1].Name=nm); chars[0].Name='Farmhand';
  for (const mn of [500,600,700]) await say(mn,'?stats',500);
  friends({500:'B&B Farm',221397:'B&B Farm'});
  // ── the passes ──
  let n=sent.length; await say(500,'?roam');
  ok(/roam passes: 0/.test(all(n)), 'no free passes: they earn them: '+all(n).slice(0,90));
  n=sent.length; await say(500,'?roam start');
  ok(/haven't got a roam pass/.test(all(n)) && !(P(500).roam.until>Date.now()), 'no pass, no roam');
  n=sent.length; await say(500,'?buy roampass'); await wait(6000); await say(500,'?buy roampass');
  ok(P(500).roamPasses===2 && P(500).ribbons===10 && /roam pass in your pocket/.test(all(n)), 'they buy them in the store, 30 ribbons each');
  n=sent.length; await say(700,'?buy roampass');
  ok(/come and go as you please/.test(all(n)) && !P(700).roamPasses, 'nobody without a summonable contract can buy one');
  n=sent.length; await say(700,'?roam');
  ok(/come and go as you please/.test(all(n)), 'no summon rule in their contract: they come and go');
  n=sent.length; await say(500,'?roam start');
  ok(P(500).roamPasses===1 && P(500).roam.until>Date.now() && /back by/.test(all(n)), '?roam start: one spent, an hour, and when to be back');
  ok(W.__stateFor(500).roam && W.__stateFor(500).roam.left===1, 'the Companion shows the passes');
  // she wanders off with the pass running
  leave(); friends({500:'Somewhere Else',221397:'B&B Farm'});
  n=sent.length; await tick();
  ok(!beeps(n,500).some(b=>/^summon/.test(b.Message)), 'away on a pass: left be');
  P(500).roam.until=Date.now()+9*60000; n=sent.length; await tick();
  ok(beeps(n,500).some(b=>/9 minutes left/.test(b.Message)), 'a whisper at 10 minutes left');
  P(500).roam.until=Date.now()+90000; n=sent.length; await tick();
  ok(beeps(n,500).some(b=>/2 minutes, sugar|1 minutes|2 minutes/.test(b.Message)), 'and at 2');
  // time's up
  P(500).roam.until=Date.now()-1000; const nm0=P(500).naughtyMarks||0, rib0=P(500).ribbons;
  n=sent.length; await tick();
  const s1=beeps(n,500).find(b=>/^summon/.test(b.Message));
  ok(s1 && s1.IsSecret===false, 'time\'s up: summoned home, with the room attached: '+(s1&&s1.Message));
  ok((P(500).naughtyMarks||0)===nm0+1 && P(500).ribbons===rib0-1, 'late back: a naughty mark and a ribbon');
  ok(/was late back from their roam/.test(all(n)), 'and their herd leader hears');
  // still not home
  n=sent.length; await tick();
  ok(!beeps(n,500).some(b=>/^summon/.test(b.Message)), 'not summoned twice in a row');
  P(500).roam.summonedAt=Date.now()-6*60000; n=sent.length; await tick();
  ok(beeps(n,500).some(b=>/^summon/.test(b.Message)), 'still out five minutes later: summoned again');
  // home again
  back(); n=sent.length; await tick();
  ok(!P(500).roam.summonedAt, 'home: the fetching stops');
  // walkin' off without startin' one: one starts
  leave(); friends({500:'Somewhere Else'});
  n=sent.length; await tick();
  ok(P(500).roam.until>Date.now() && P(500).roamPasses===0 && beeps(n,500).some(b=>/wandered off the farm/.test(b.Message)), 'walk off without a pass: one starts by itself');
  back(); await tick();
  // out with none left
  P(500).roamPasses=0; leave(); friends({500:'Somewhere Else'});
  n=sent.length; await tick();
  ok(beeps(n,500).some(b=>/haven't got a roam pass/.test(b.Message)) && !beeps(n,500).some(b=>/^summon/.test(b.Message)), 'none left: a minute\'s grace first');
  P(500).roam.strayAt=Date.now()-61000; n=sent.length; await tick();
  ok(beeps(n,500).some(b=>/^summon/.test(b.Message)) && /slipped off the farm/.test(all(n)), 'then summoned, and it costs them');
  back(); await tick();
  // their herd leader gives another
  n=sent.length; await say(221397,'?roam give Moo 2');
  ok(P(500).roamPasses===2 && /2 more roam passes/.test(all(n)), '?roam give: their herd leader hands out more');
  n=sent.length; await say(600,'?roam give Moo 1');
  ok(/herd leader or staff/.test(all(n)), 'nobody else can');
  // just safeworded: left alone
  P(500).roamSafeUntil=Date.now()+600000; P(500).roamPasses=0; leave(); friends({500:'Somewhere Else'});
  n=sent.length; await tick(); P(500).roam.strayAt=Date.now()-61000; await tick();
  ok(!beeps(n,500).some(b=>/^summon/.test(b.Message)), 'right after a safeword nobody fetches them');
  P(500).roamSafeUntil=0;
  // offline
  friends({}); n=sent.length; P(500).roam.strayAt=Date.now()-61000; await tick();
  ok(!beeps(n,500).some(b=>/^summon/.test(b.Message)), 'offline: nothin\' to fetch');
  back();
  // ── new contracts: the summon rule in place of Forbid leaving ──
  const c=W.__buildContract('deep',500,'1d');
  ok(c.rules['other.summon'] && c.rules['other.summon'].settings.allowedMembers.includes(260239) && !c.rules['chat.forbidLeaving'], 'every new contract: ready to be summoned by the farm girl, no Forbid leaving');
  const f=W.__buildContract('fun',500,'1d');
  ok(f.rules['other.summon'] && !f.rules['chat.forbidLeaving'], 'fun ones too');
  const x=W.__buildContract('nhl',500,'1d');
  ok(x.rules['other.summon'] && !x.rules['chat.forbidLeaving'] && !x.rules['rooms.entry'], 'and no human left: roam passes, not a room list');
  ok(!x.rules['body.forcedPosition'] && /roam pass/.test(x.terms), 'no human left has no forced all fours (Oct 24), and its terms say how leavin\' works');
  // Oct 26: every contract forbids freeing yourself and locks can't be picked; a permanent one forbids leavin' the room
  { const cs=[c,f,x].concat(['fun','deep','nhl'].map(d=>W.__buildContract(d,500,'perm')));
    ok(cs.every(k=>k.rules['items.freeingSelf'] && k.rules['settings.lockpickingSelf'] && k.rules['settings.lockpickingSelf'].settings.value==='Locks cannot be picked'), 'every contract: Forbid freeing self, and locks can\'t be picked');
    ok(cs.every(k=>Object.keys(k.rules).length<=30), 'still within BC+\'s 30 rules ('+cs.map(k=>Object.keys(k.rules).length).join(',')+')');
    const p=cs.slice(3); ok(p.every(k=>k.rules['chat.forbidLeaving'] && /permanent/.test(k.terms)) && !c.rules['chat.forbidLeaving'], 'permanent ones forbid leavin\' the room and say so; the others don\'t');
    L().contracts=(L().contracts||[]).concat([{key:'pz',mn:500,status:'signed',durationMin:0,rules:Object.keys(p[1].rules)}]);
    let n2=sent.length; await say(500,'?roam start',900); ok(/permanent contract keeps you in the room/.test(all(n2)) && !(P(500).roam.until>Date.now()), '?roam start on a permanent contract: no pass spent');
    L().contracts=L().contracts.filter(k=>k.key!=='pz'); }
  ok(!warns.some(w=>/roam/i.test(w)), 'no errors: '+warns.filter(w=>/roam/i.test(w)).slice(0,2).join(' | '));
  out(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
})();
