// Oct 25 (Laynie: "more variety based on present factors"): pot luck leans toward what fits the moment: full udders, a
// pent-up cock, heat, rut day, carryin', corruption, the hour, a crowd or nobody about, and away from their last three traps.

const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",trapsOn:true,breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo")
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"trap-snare":{X:20,Y:10},"trap-gas":{X:24,Y:10},"pond":{X:30,Y:10},"pasture":{X:40,Y:40},"trap-wolves":{X:5,Y:30}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const moo=at(500,10,10);
const chars=[at(260239,1,1),at(221397,2,2),moo];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const tally=(can,n)=>{ const c={}; for(let i=0;i<n;i++){ const k=W.__trapWeighted(500,can).kind; c[k]=(c[k]||0)+1; } return c; };
(async()=>{ await wait(3500);
  const r=P(500), can=["milker","pillory","vines","plow","crate"];
  W.__hour=14; r.trapLog=[]; chars[1].MapData.Pos={X:40,Y:40};
  let f=W.__trapFactors(500); ok(f.includes('day') && f.includes('alone'), 'an ordinary afternoon on your own: '+f.join(','));
  // full udders → the milker
  const p=W.__prodOf(500); p.milk=W.__milkCapOf(500); f=W.__trapFactors(500);
  ok(f.includes('milk'), 'full udders count');
  let c=tally(can,3000); ok(c.milker>c.pillory*2, 'full udders: the milker comes up a lot more '+JSON.stringify(c));
  ok(/udders are so full/.test(W.__trapWeighted(500,["milker"]).why), '...and the whisper says why');
  p.milk=0;
  // heat → breedin'
  p.heat={until:Date.now()+3600000}; c=tally(can,3000); ok(c.crate>c.pillory*1.6, 'in heat: the breedin\' crate is likelier '+JSON.stringify(c));
  ok(/in heat/.test(W.__trapWeighted(500,["crate"]).why), '...and they\'re told it\'s the heat');
  p.heat=null;
  // night
  W.__hour=23; f=W.__trapFactors(500); ok(f.includes('night'), 'eleven at night is night');
  c=tally(["werewolf","plow"],3000); ok(c.werewolf>c.plow*2, 'at night the werewolf is out more than the plow '+JSON.stringify(c));
  W.__hour=14;
  // a crowd
  for (let i=0;i<3;i++) chars.push(at(700+i,11+i,10));
  f=W.__trapFactors(500); ok(f.includes('crowd') && !f.includes('alone'), 'three folks close by is a crowd');
  c=tally(["pillory","vines"],3000); ok(c.pillory>c.vines*1.5, 'with a crowd, the pillory comes up more than the vines '+JSON.stringify(c));
  chars.splice(3);
  // recent traps
  r.trapLog=[{kind:"wax"},{kind:"wax"}]; c=tally(["wax","pillory"],3000); ok(c.pillory>c.wax*2.5, 'what they just had is a lot less likely '+JSON.stringify(c));
  r.trapLog=[];
  // every kind still comes up
  c=tally(can,3000); ok(can.every(k=>c[k]>0), 'nothin\' is ruled out, only made likelier');
  ok(!warns.some(w=>/trap factors/.test(w)), 'no errors');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
