// Oct 7 picks: the Companion's "right now" strip and bench buttons (state), while-you-were-gone, the one-time
// nudge for lingerin' visitors, and private add-ons (only: [...]) that nobody else can use or see listed.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,benchOn:true},
 "600":{mn:600,name:"Rex",roles:["LIVESTOCK"],species:"dog",gender:"male",futa:true,onDuty:true,herds:[],tempKeys:[],cover:[],limits:""}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"bench":{X:15,Y:10}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,14,10)];
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
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const to=(mn,n)=>sent.slice(n).filter(([e,d])=>d&&((d.Type==='Whisper'&&d.Target===mn)||(e==='AccountBeep'&&d.MemberNumber===mn))).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
(async()=>{ await wait(3500); W.__cfg.USER_COOLDOWN_S=0;
  ['Laynie','Moo','Rex'].forEach((nm,i)=>chars[i+1].Name=nm);
  // ── the right-now strip and the bench buttons ──
  await say(221397,'?bench 500 20');
  const p5=P(500).prod; p5.heat={until:Date.now()+3600000,by:0}; p5.pentUp=false;
  const s5=W.__stateFor(500);
  ok(s5.now.some(x=>x.icon==='🪵'&&x.until>Date.now()) && s5.now.some(x=>x.icon==='🔥'), 'Moo\'s right-now strip: on the bench, in heat, with clocks');
  const s6=W.__stateFor(600);
  ok(s6.benchHere && s6.benchHere[0].mn===500 && s6.benchHere[0].holes.includes('vulva'), 'Rex\'s panel gets Moo\'s bench buttons');
  ok(!s5.benchHere, '...Moo doesn\'t get buttons for herself');
  // ── while you were gone ──
  P(600).leftAt=Date.now()-5*3600000;
  L().studbook=[{t:Date.now()-3600000,dam:500,sires:[600],kids:{male:1,female:2,futa:0}}];
  P(600).ribbons=10; L().ribbonLog=[{at:Date.now()-60000,mn:600,n:4,why:'x'}];
  let n=sent.length; handlers.ChatRoomSyncMemberJoin({Character:{MemberNumber:600}}); await wait(15000);
  ok(/WHILE YOU WERE GONE/.test(to(600,n)) && /Moo dropped 3, bred by Rex/.test(to(600,n)) && /\+4 ribbons/.test(to(600,n)), 'back after 5 hours: what Rex missed');
  n=sent.length; handlers.ChatRoomSyncMemberJoin({Character:{MemberNumber:500}}); await wait(14000);
  ok(!/WHILE YOU WERE GONE/.test(to(500,n)), 'not for somebody who was never away');
  handlers.ChatRoomSyncMemberLeave({SourceMemberNumber:600});
  ok(P(600).leftAt>Date.now()-5000, 'leavin\' is remembered');
  // ── a nudge for lingerers ──
  chars.push(at(777,30,30)); chars[chars.length-1].Name='Lurker';
  W.__lingerTick(); const st=W.__st(); st.arrivedAt.set(777, Date.now()-6*60000);
  n=sent.length; W.__lingerTick(); await wait(1500);
  ok(/\?tour/.test(to(777,n)), 'somebody lookin\' around 5+ minutes gets one nudge toward the tour');
  n=sent.length; W.__lingerTick(); await wait(1000);
  ok(!/\?tour/.test(to(777,n)), '...only once');
  chars.push(at(778,31,30)); W.__lingerTick(); st.arrivedAt.set(778, Date.now()-6*60000);
  st.lastCmd.set(778,{key:'x',at:Date.now()}); n=sent.length; W.__lingerTick(); await wait(1000);
  ok(!/\?tour/.test(to(778,n)), 'nobody who\'s already talkin\' to me gets nudged');
  // ── a private add-on ──
  W.Farmhand.register({ name:'private-test', label:'Secret', version:'1', only:[221397],
    commands:{ secret:{ usage:'secret', private:true, run:(c)=>c.reply('🤫 just for you') } },
    companion:(mn)=>({ cards:[{ title:'Secret card', text:'hi' }] }) });
  n=sent.length; await say(221397,'?secret');
  ok(/just for you/.test(to(221397,n)), 'the private add-on answers its owner');
  n=sent.length; await say(500,'?secret');
  ok(!/just for you/.test(to(500,n)) && /don't know \?secret/.test(to(500,n)), '...and to anybody else it isn\'t there');
  n=sent.length; await say(500,'?addons');
  ok(!/Secret|private-test/.test(to(500,n)), 'it\'s not in ?addons');
  n=sent.length; await say(221397,'?addons');
  ok(!/Secret|private-test/.test(to(221397,n)), '...not even for its owner');
  ok(!(W.__stateFor(500).mods||{})['private-test'] && (W.__stateFor(221397).mods||{})['private-test'], 'its Companion card goes only to its owner');
  ok(!JSON.stringify(W.__stateFor(221397).addonCmds||[]).includes('secret'), 'its commands aren\'t listed in anybody\'s guides');
  n=sent.length; await say(500,'?secre');
  ok(!/secret/.test(to(500,n)), 'nobody else is told "did you mean ?secret"');
  const errs=warns.filter(w=>/add-on|lookout|bench/.test(w)); ok(!errs.length, 'no errors logged '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
