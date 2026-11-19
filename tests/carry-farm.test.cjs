// CARRYIN' ANYWHERE, THE FARM'S SIDE (Nov 19). The farm girl tells a player's Dispensary what they're carryin', waits
// for it when they're due away (it births them wherever they are), books a birth or a clutch done away without actin'
// it out again, opens them for the hour after by when it happened, takes a Quickening Draught by needle or with their
// loads, and makes a Baby Factory of anybody with twenty litters.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,milkable:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],gender:"female"},
 "500":S(500,"Moo"), "600":S(600,"Hana"), "610":S(610,"Bo",{gender:"male",species:"bull"}), "640":S(640,"Away")
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}},PoseMapping:{BodyLower:"BaseLower"}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(610,17,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
W.LZString={ compressToBase64:(t)=>Buffer.from(t).toString('base64'), decompressFromBase64:(t)=>Buffer.from(t,'base64').toString() };
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const prod=mn=>W.__prodOf(mn);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
const hid=async(mn,type,data,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:Object.assign({v:2,type},data||{})}); await wait(ms||400); };
const msgsTo=(mn,type,from)=>sent.slice(from||0).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Target===mn&&d.Dictionary&&d.Dictionary.type===type).map(([,d])=>d.Dictionary);
const roomText=(from)=>sent.slice(from||0).filter(([e,d])=>e==='ChatRoomChat'&&d&&d.Content!=='FarmhandMsg'&&typeof d.Content==='string').map(([,d])=>d.Content).join(' | ');
const allText=(from)=>sent.slice(from||0).map(([e,d])=>JSON.stringify(d)).join(' ');
const DAY=86400000, HOUR=3600000;
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  ['Laynie','Moo','Hana','Bo'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [221397,500,600,610]) await say(mn,'?stats',500);
  const p=prod(600), now=Date.now();

  // ---- what she's carryin', for her Dispensary
  p.preg={since:now-2*DAY,due:now+3*DAY,sires:[610],count:3,warned:false};
  let n=sent.length; await hid(600,'dispHello',{ver:'0.24.0',farm:true,lscg:false,off:[],holes:1,seed:1,breed:1});
  const wc=msgsTo(600,'dispWelcome',n).pop();
  ok(wc && wc.carry && wc.carry.preg && wc.carry.preg.count===3 && wc.carry.preg.sires[0]==='Bo' && wc.carry.one==='calf' && wc.carry.many==='calves', "her welcome says what she's carryin': three calves, Bo's ("+JSON.stringify(wc&&wc.carry&&wc.carry.preg)+")");

  // ---- born away: booked quietly, and she's open for the hour after it
  const lit0=p.offspring.litters, born=Date.now()-20*60000;
  n=sent.length; await hid(600,'dispHello',{ver:'0.24.0',farm:true,lscg:false,off:[],holes:1,seed:1,breed:1,born:{at:born,midwife:500,helps:2,n:3}},800);
  ok(!p.preg && p.offspring.litters===lit0+1, "a birth done away, in her hello: the litter's on the books");
  ok(/born away from the farm/.test(roomText(n)) && !/water|push|crown/i.test(roomText(n)), "...written in the stud book, not acted out again ("+roomText(n).slice(0,140)+")");
  ok(Math.abs(p.openUntil-(born+cfg.BREDBACK_MIN*60000))<1000, "...and she's wide open till an hour after it happened");
  ok(/Moo/.test(allText(n)), "...with Moo as her midwife");
  const lit1=p.offspring.litters; n=sent.length;
  await hid(600,'dispHello',{ver:'0.24.0',farm:true,lscg:false,off:[],holes:1,seed:1,breed:1,born:{at:born,midwife:500,helps:2,n:3}});
  ok(p.offspring.litters===lit1, "the same hello again: not booked twice");
  const wc2=msgsTo(600,'dispWelcome',n).pop();
  ok(wc2 && wc2.carry && wc2.carry.bornSeen===born && wc2.carry.preg===null, "...and her welcome says she has it, so her Dispensary lets it go");

  // ---- laid away
  p.eggs={n:5,by:610,since:now-3*DAY,layAt:now-HOUR}; const e0=p.offspring.eggs||0;
  await hid(600,'dispHello',{ver:'0.24.0',farm:true,lscg:false,off:[],holes:1,seed:1,breed:1,laid:{at:Date.now()-5*60000,n:5}},800);
  ok(!p.eggs && p.offspring.eggs===e0+5, "a clutch laid away: five eggs on the books");

  // ---- due and away: with a Dispensary that births anywhere, the farm waits for it
  const pa=prod(640); pa.preg={since:now-10*DAY,due:now-20*HOUR,sires:[610],count:1,warned:true};
  const ra=W.__st && null;
  await hid(640,'dispHello',{ver:'0.24.0',farm:true,lscg:false,off:[],holes:1,seed:1,breed:1},300);
  pa.last=Date.now(); W.__pt();
  ok(pa.preg, "away and twenty hours past due, with a Dispensary that births anywhere: the farm still waits for it to say so");
  pa.preg.due=now-80*HOUR; W.__pt();
  ok(!pa.preg, "...three days past, she books it herself");

  // ---- the Quickening Draught
  p.preg={since:now-DAY,due:now+4*DAY,sires:[610],count:2,warned:false};
  const due0=p.preg.due; n=sent.length;
  W.__shot(600,221397,'quickening draught x2');
  ok(Math.round((due0-p.preg.due)/DAY)===2 && /belly|swell|grow/i.test(roomText(n)), "a double Quickening Draught by needle: two days closer, and the room sees her belly swell");
  W.__quicken(600,20);
  ok(p.preg.due>=Date.now()+2*HOUR-1000 && p.preg.due<=Date.now()+2*HOUR+1000, "...never closer than two hours to due");
  p.preg.due=now+4*DAY; p.preg.since=now-DAY;
  await hid(600,'dispSeed',{ep:'carry001',id:1,loads:[],held:{},quick:1});
  ok(Math.round((now+4*DAY-p.preg.due)/DAY)===1, "a draught taken away comes in with her loads: a day closer");

  // ---- Baby Factory
  p.offspring.litters=19; p.preg={since:now-6*DAY,due:now-1000,sires:[610],count:1,warned:true}; p.labour=null;
  n=sent.length; await hid(600,'dispHello',{ver:'0.24.0',farm:true,lscg:false,off:[],holes:1,seed:1,breed:1,born:{at:Date.now()-60000,midwife:0,helps:0,n:1}},800);
  p.last=Date.now(); W.__pt(); await wait(300);
  ok(p.offspring.litters===20 && /Baby Factory/.test(allText(n)), "her twentieth litter makes her a Baby Factory");

  out(fails ? fails+' FAILED' : 'all passed'); if (warns.some(w=>/carry:|eggs laid:|quicken:/.test(w))) out('warns: '+warns.filter(w=>/carry:|eggs laid:|quicken:/.test(w)).join(' / '));
  process.exit(fails?1:0);
})();
