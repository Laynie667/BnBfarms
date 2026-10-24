// Oct 24 (Laynie: "im triggering traps walking by the tiles, not on them, and if im standing still long enough no where
// near a tile, they are getting set off too. Eager off didn't seem to apply the cool down either"): traps go off on
// their own tile only, water and troughs too, the pack only on the spot it's at, and every trap waits out the breather.

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
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1200); };
const to=(X,Y)=>{ moo.MapData.Pos={X,Y}; };
const sprung=()=>(P(500).trapLog||[]).length;
const done=async()=>{ for(let i=0;i<80;i++){ await wait(100); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(500))) break; } await wait(300); };
const fresh=()=>{ const r=P(500); r.trapAt=0; r.spotTrapAt={}; r.penned=null; r.gear=null; r.trapWait=null; r.packAt=0; W.__st().trapAt=new Map(); };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2; cfg.TRAP_BEAT_S=0.05; cfg.CHAIN_CHANCE=0; cfg.TENTACLE_CHANCE=1;
  chars[1].Name='Laynie'; moo.Name='Moo'; await say(500,'?stats',600);
  // ── a tile: beside it is nothin', on it springs ──
  fresh(); let n0=sprung();
  to(21,10); W.__trapTick(); to(19,10); W.__trapTick(); to(20,11); W.__trapTick(); await wait(300);
  ok(sprung()===n0, 'walkin\' right past a trap tile springs nothin\'');
  to(20,10); W.__trapTick(); await done();
  ok(sprung()===n0+1, 'steppin\' on it does');
  // ── the breather, eager off ──
  to(24,10); W.__trapTick(); await wait(300);
  ok(sprung()===n0+1, 'eager off: the next tile waits out the breather after the last trap let go');
  P(500).trapEager=true; to(23,10); W.__trapTick(); to(24,10); W.__trapTick(); await done();
  ok(sprung()===n0+2, 'eager on: no breather');
  P(500).trapEager=false;
  // ── water: on the tile, not beside it ──
  fresh(); n0=sprung();
  to(31,10); W.__trapTick(); to(30,11); W.__trapTick(); await wait(300);
  ok(sprung()===n0, 'standin\' beside the pond: nothin\'');
  to(30,10); W.__trapTick(); await done();
  ok(sprung()===n0+1, 'in it: it can take them');
  // ── the pack: only on the spot it's at ──
  fresh(); n0=sprung(); L().pack={spot:'pasture',at:Date.now()};
  to(41,40); W.__trapTick(); await wait(300); to(39,41); W.__trapTick(); await wait(300);
  ok(sprung()===n0, 'next to where the pack is: nothin\'');
  to(40,40); W.__trapTick(); await done();
  ok(sprung()===n0+1, 'on its spot: the wolves');
  // standin' still far from anything, for a good long while
  fresh(); n0=sprung(); to(12,30);
  for (let i=0;i<20;i++){ W.__trapTick(); await wait(30); }
  ok(sprung()===n0, 'standin\' still nowhere near a tile: nothin\', however long');
  // a trap handin' them straight on to the next (the "back to back to back" a new player got): eager only
  cfg.CHAIN_CHANCE=1; fresh(); n0=sprung(); to(20,10); W.__trapTick(); await done(); await wait(13000); await done();
  ok(sprung()===n0+1, 'eager off: one trap, and it doesn\'t hand them on to another');
  fresh(); P(500).trapEager=true; to(19,10); W.__trapTick(); n0=sprung(); to(20,10); W.__trapTick(); await done(); await wait(13000); await done();
  ok(sprung()>=n0+2, 'eager on: it can hand them on');
  P(500).trapEager=false; cfg.CHAIN_CHANCE=0;
  ok(!warns.some(w=>/trap/i.test(w)), 'no errors: '+warns.filter(w=>/trap/i.test(w)).slice(0,2).join(' | '));
  out(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
})();
