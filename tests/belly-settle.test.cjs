// Nov 16: a belly that settles, and body sizes that don't turn back too soon. A player saw lots of belly-size work in
// their console and it lagged: a belly sitting on a line flipped with every load and every leak, and each flip had the
// whole room refit that body (and, at "heavy", load every piece it wore again at a new hip size).
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:""}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(600,14,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}}, location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), prod=mn=>L().people[mn].prod;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2400); };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0;
  chars[1].Name='Laynie'; chars[2].Name='Hana';
  await say(600,'?stats');
  const p=prod(600), cap=W.__capacity(600);
  // w = (full - 0.8) * 3 from fluids alone: heavy (2) starts at 1.467 times capacity
  const fill=(w)=>{ p.held={vulva:cap*(0.8+w/3),butt:0,mouth:0}; };
  fill(0); ok(W.__belly(600)===0, 'empty: no belly');
  ok(W.__shape(600).low===0, 'their own hips');
  fill(2.1); ok(W.__belly(600)===2, 'filled past the line: heavy at once');
  ok(W.__shape(600).low===1, 'and the hips go up a size at once');
  fill(1.95); ok(W.__belly(600)===2, 'leaked a little under the line: still heavy (no flicker)');
  fill(2.05); ok(W.__belly(600)===2, 'topped back up: still heavy, nothing changed');
  fill(1.6); ok(W.__belly(600)===2, 'well under the line: still heavy for now');
  ok(p.bellyHeld && p.bellyHeld.low > 0, 'the wait has started');
  fill(1.8); ok(W.__belly(600)===2 && !p.bellyHeld.low, 'back near the line: the wait starts over');
  fill(1.6); W.__belly(600); p.bellyHeld.low=Date.now()-11*60000;
  ok(W.__belly(600)===1, 'under the line for ten minutes: down to showin\'');
  ok(W.__shape(600).low===1, 'the hips hold a while before turnin\' back');
  p.shapeHeld.at.low=Date.now()-16*60000;
  ok(W.__shape(600).low===0, 'after the hold: their own hips again');
  fill(2.1); ok(W.__belly(600)===2, 'filled again: heavy again at once');
  ok(W.__shape(600).low===0, 'but the hips don\'t flip straight back up');
  fill(0); ok(W.__belly(600)===0, 'emptied right out: no belly at once');
  // a birth or laid eggs show at once, whatever the fluids
  fill(0); p.eggs={n:25,by:-2,since:Date.now()-2*3600000,layAt:Date.now()+86400000};
  ok(W.__belly(600)===2, 'two dozen eggs: heavy');
  p.eggs.n=19; ok(W.__belly(600)===1, 'laid some: smaller at once');
  delete p.eggs; ok(W.__belly(600)===0, 'laid them all: gone at once');
  // the room only hears a new size when the size changes
  fill(2.1); W.__belly(600);
  const s1=JSON.stringify(W.__stateFor(600).drawn);
  fill(1.9); const s2=JSON.stringify(W.__stateFor(600).drawn);
  ok(s1===s2, 'leakin\' a little changes nothing the room is told');
  out(fails?'FAILURES: '+fails:'all good'); process.exit(fails?1:0);
})();
