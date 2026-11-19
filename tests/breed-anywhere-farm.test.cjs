// BREEDIN' ANYWHERE, THE FARM'S SIDE (Nov 19). Laynie: "I want to be the best baby factory wherever I go", then "all
// of them". Ripe days, hips up after a load, the Brood Womb, and the farm's numbers for somebody's cock and cycle sent
// to their Dispensary.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,milkable:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],gender:"female"},
 "500":S(500,"Moo"), "600":S(600,"Hana"), "610":S(610,"Bo",{gender:"male",species:"bull"}), "630":S(630,"Rex",{gender:"male",species:"dog"})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}},PoseMapping:{BodyLower:"BaseLower"}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(610,17,10),at(630,18,10)];
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
const DAY=86400000;
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  ['Laynie','Moo','Hana','Bo','Rex'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [221397,500,600,610,630]) await say(mn,'?stats',500);
  const p=prod(600);

  // ---- ripe days
  ok(cfg.RIPE && cfg.RIPE.EVERY_D===7 && cfg.RIPE.DAYS===2 && cfg.RIPE.X===2, "two ripe days in seven, twice as easy to catch");
  const wire=W.__ripeWire(600);
  ok(wire && wire.at>0 && wire.every===7 && wire.from===3 && wire.days===2, "a Fertile cow has a cycle the farm keeps ("+JSON.stringify(wire)+")");
  const ripeAt=wire.at+3.5*DAY, dryAt=wire.at+1.5*DAY;
  ok(W.__isRipe(600, ripeAt)===true && W.__isRipe(600, dryAt)===false && W.__isRipe(600, ripeAt+7*DAY)===true, "ripe on days three and four, every week");
  let n=sent.length; await say(600,'?fertile off',500);
  ok(W.__isRipe(600, ripeAt)===false && W.__ripeWire(600)===null, "Fertile off: no ripe days, and nothin' sent to her Dispensary");
  await say(600,'?fertile on',500);

  // ---- the welcome: her cycle, and a stud's cock
  n=sent.length; await hid(600,'dispHello',{ver:'0.23.0',farm:true,lscg:false,off:[],holes:1,seed:1,breed:1});
  const wl=msgsTo(600,'dispWelcome',n).pop();
  ok(wl && wl.ripe && wl.ripe.at===wire.at, "her Dispensary is told her ripe days");
  prod(630).ptype='canine'; prod(630).knot=true; prod(630).semen=60;
  n=sent.length; await hid(630,'dispHello',{ver:'0.23.0',farm:true,lscg:false,off:[],holes:1,seed:1,breed:1});
  const wr=msgsTo(630,'dispWelcome',n).pop();
  ok(wr && wr.cock && wr.cock.knot===true && wr.cock.load>=cfg.PROD.MIN_LOAD && Array.isArray(wr.cock.tie) && wr.cock.tie[0]>=cfg.TIE_MIN_M && wr.cock.tie[1]<=cfg.TIE_MAX_M, "a knotted dog's Dispensary is told his load and how long his knot ties ("+JSON.stringify(wr&&wr.cock)+")");
  n=sent.length; await hid(500,'dispHello',{ver:'0.22.0',farm:true,lscg:false,off:[],holes:1,seed:1});
  const wo=msgsTo(500,'dispWelcome',n).pop();
  ok(wo && wo.ripe===undefined && wo.cock===undefined, "an older Dispensary (no breed in its hello): nothin' sent");

  // ---- hips up: another chance to take
  p.preg=null; p.held.vulva=120; p.boosts=p.boosts||{}; p.boosts.ripe=Date.now()+3600000;
  p.lastFill={at:Date.now(),stud:610,ml:120,hole:'vulva'};
  W.__legsUp(600);
  ok(!p.preg && !p.lastFill.up, "standin' as she was: no second chance");
  chars[3].PoseMapping={BodyLower:'AllFours'}; n=sent.length;
  W.__legsUp(600); await wait(1200);
  ok(p.lastFill.up===true && /hips|Rump up|rump|bent over/.test(roomText(n)), "on all fours after Bo's load: the room sees her keep it in ("+roomText(n).slice(0,140)+")");
  ok(p.preg && p.preg.sires[0]===610 && /It took!/.test(roomText(n)), "...and with her hips up, it takes");
  n=sent.length; W.__legsUp(600);
  ok(!/hips|rump/i.test(roomText(n)), "...once a load, not every tick");
  chars[3].PoseMapping={BodyLower:'BaseLower'};

  // ---- the Brood Womb
  const count0=p.preg.count;
  ok(W.__conceive(600,500,100,1,'vulva')===null || p.preg.count===count0, "carryin', without a Brood Womb, a load from somebody else a day later doesn't add to the litter");
  p.preg.since=Date.now()-2*DAY;
  ok(W.__conceive(600,630,100,1,'vulva')===null && p.preg.count===count0, "...two days in, no");
  await say(600,'?broodwomb on',600);
  ok(/Brood Womb.*ON/.test(allText(n)), "?broodwomb on: her Brood Womb's on");
  const got=W.__conceive(600,630,100,1,'vulva');
  ok(got==='more' && p.preg.count===count0+1 && p.preg.sires.includes(630), "now every load takes, and her litter grows ("+count0+" → "+p.preg.count+")");
  const got2=W.__conceive(600,630,100,1,'vulva');
  ok(got2==='more' && p.preg.count===count0+2, "...the same stud again too");
  await say(600,'?broodwomb off',600);
  ok(W.__conceive(600,500,100,1,'vulva')===null, "?broodwomb off: back to the farm's own rules");

  // ---- a load from off the farm, marked hips up, booked with its chance
  p.preg=null; delete p.boosts.ripe; p.held.vulva=0;
  W.__st().seedGap && W.__st().seedGap.clear();
  await hid(600,'dispSeed',{ep:'breedA01',id:1,loads:[{h:'vulva',ml:200,by:221397,at:Date.now()-3600000,up:1}],held:{vulva:150}});
  ok(p.lastFill && p.lastFill.stud===221397, "a load from off the farm with her hips up after is booked (its chance is half again as good)");

  out(fails ? fails+' FAILED' : 'all passed'); if (warns.some(w=>/ripe:|legs up:|seed:/.test(w))) out('warns: '+warns.filter(w=>/ripe:|legs up:|seed:/.test(w)).join(' / '));
  process.exit(fails?1:0);
})();
