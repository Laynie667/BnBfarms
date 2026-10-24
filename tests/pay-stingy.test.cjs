// Stingy pay (Laynie, Oct 15: "yes" to milk by the litre and births paying, kept stingy): a ribbon every 2 litres
// milked, 3 a day at most; a birth pays a ribbon per 2 young, rounded up, 5 at most; eggs: up to 400 carried, and a
// gatherin' pays a layer 12 at most.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const P=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],milkable:true,breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "501":P(501,"Bessie"), "502":P(502,"Daisy"), "503":P(503,"Clover")
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(501,5,5),at(502,8,8),at(503,9,9)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,501,502,503]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), R=(mn)=>L().people[mn];
const realTimeout=setTimeout, wait=ms=>new Promise(r=>realTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
(async()=>{ await wait(3500);
  const cfg=W.__cfg;
  ok(cfg.EGG_MAX===400 && cfg.GATHER_MAX_RIBBONS===12, 'eggs: 400 carried, 12 a gatherin\' at most');
  // milk: a ribbon every 2 litres, 3 a day at most
  R(501).quota=0;   // (Oct 24: the quota pays the moment it's met now; this one's only the litres)
  const p=W.__prodOf(501), r0=R(501).ribbons||0;
  p.milk=20000; W.__drainMilk(501,1500); await wait(2800);
  ok((R(501).ribbons||0)===r0, 'a litre and a half pays nothin\' yet');
  W.__drainMilk(501,1000); await wait(2800);
  ok((R(501).ribbons||0)===r0+1, 'two litres in a day: one ribbon');
  p.milk=20000; W.__drainMilk(501,10000); await wait(2800);
  ok((R(501).ribbons||0)===r0+3, 'twelve litres in a day: three ribbons, no more ('+((R(501).ribbons||0)-r0)+')');
  // births: a ribbon per 2 young, rounded up, 5 at most
  const b=(mn,count)=>{ const q=W.__prodOf(mn); q.preg={since:Date.now()-6*86400000,due:Date.now()-1,sires:[-2],count,warned:true}; W.__birth(mn); };
  const d0=R(502).ribbons||0, c0=R(503).ribbons||0;
  b(502,1); b(503,14); await wait(4800);
  ok((R(502).ribbons||0)===d0+1, 'a single calf pays one');
  ok((R(503).ribbons||0)===c0+5, 'fourteen young pay five, no more ('+((R(503).ribbons||0)-c0)+')');
  out(fails?'FAIL':'PASS'); process.exit(fails?1:0);
})();
