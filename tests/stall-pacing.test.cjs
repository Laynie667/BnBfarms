// The milking stall: walkin' past does nothin', a session takes about 10 minutes however full they are,
// only a line or two goes to the room, and afterwards the stall rests 10-20 minutes before takin' them again.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"milking1":{X:5,Y:5}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,500].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}},Appearance:[]}));
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const realNow=Date.now; let skew=0; Date.now=()=>realNow()+skew;
const roomLines=k=>sent.slice(k).filter(([e,d])=>d&&(d.Type==='Emote'||(d.Type==='Whisper'&&/^\(\*/.test(String(d.Content))))).length;
(async()=>{ await wait(3500);
  chars[1].Name='Moo';
  const p=()=>L().people[500].prod;
  W.__ms();   // makes the prod record
  const full=()=>{ p().milk=24000; };   // a big udder's worth
  // walkin' past: one tick on the stall, then gone
  full(); chars[1].MapData.Pos={X:5,Y:5}; W.__ms(); chars[1].MapData.Pos={X:9,Y:9}; W.__ms();
  ok(!p().stall, 'walking past the stall does nothing');
  // standin' in it: latched on the second look
  chars[1].MapData.Pos={X:5,Y:5};
  let k=sent.length; W.__ms(); W.__ms();
  ok(!!p().stall, 'staying put: the stall latches on');
  // run it in 20-second ticks until done
  let ticks=0; k=sent.length;
  while (p().stall && ticks<200){ skew+=20000; W.__ms(); ticks++; }
  await wait(4000);
  const mins=ticks*20/60;
  ok(mins>=27 && mins<=32, 'a full udder takes about 30 minutes ('+mins.toFixed(1)+' min)');
  const toMoo=sent.slice(k).filter(([e,d])=>d&&d.Type==='Whisper'&&d.Target===500).map(([e,d])=>String(d.Content));
  const OPEN=/cups pull at .*breasts in a slow rhythm|Milk streams from .* into the stall's bucket|milkin' stall eases off/;
  const opens=toMoo.filter(c=>OPEN.test(c)), story=toMoo.filter(c=>!OPEN.test(c)&&/^\(\*/.test(c));
  ok(opens.length>=4 && opens.length<=7, 'the room gets an open line about every 5 minutes, finish included ('+opens.length+')');
  ok(story.length>=40, 'their own story comes privately, about every 25 seconds ('+story.length+' lines)');
  ok(/cups|latch|seal|liners|vacuum/i.test(story[0]) && /\d+(\.\d)? (L|mL)/.test(story[story.length-1]), 'it starts with the cups going on and ends with how much came out');
  ok(new Set(story).size===story.length, 'no line twice in one session');
  ok(p().milk <= 24000*0.25+400, 'drained down to about a quarter');
  // the stall rests now
  ok(p().stallRest > Date.now()+9*60000 && p().stallRest < Date.now()+21*60000, 'the stall rests 10-20 minutes');
  full(); k=sent.length; W.__ms(); W.__ms(); W.__ms(); await wait(4000);
  ok(!p().stall, '...and does not take them again meanwhile');
  const told=sent.slice(k).filter(([e,d])=>d&&/restin'/.test(String(d.Content||d.Message||'')));
  ok(told.length===1, '...they are told once, not every tick');
  skew+=21*60000; W.__ms(); W.__ms();
  ok(!!p().stall, 'after the rest it takes them again');
  // from the live recording: steppin' off for two minutes and back carries on, without a new announcement
  await wait(3000); chars[1].MapData.Pos={X:9,Y:9}; skew+=20000; W.__ms(); skew+=120000; W.__ms();
  ok(!p().stall && p().stallPaused, 'gone two minutes: the session is on hold');
  chars[1].MapData.Pos={X:5,Y:5}; k=sent.length; skew+=20000; W.__ms(); skew+=20000; W.__ms(); await wait(3000);
  ok(!!p().stall && !sent.slice(k).some(([e,d])=>d&&/latches on/.test(String(d.Content||d.Message||''))), '...and coming back picks it up quietly');
  // reported live: a cow milked dry by hand stood in the stall and nothing happened, not even a message.
  // Now she's told once per visit why, and when to come back
  chars[1].MapData.Pos={X:9,Y:9}; skew+=20000; W.__ms();
  p().stall=null; p().stallPaused=null; p().stallRest=0; p().milk=500;
  chars[1].MapData.Pos={X:5,Y:5}; k=sent.length; skew+=20000; W.__ms(); skew+=20000; W.__ms(); skew+=20000; W.__ms(); await wait(3000);
  const why=sent.slice(k).filter(([e,d])=>d&&/give you a sniff/.test(String(d.Content||d.Message||'')));
  ok(!p().stall && why.length===1 && /quarter/.test(String(why[0][1].Content||why[0][1].Message)) && /Come back in about/.test(String(why[0][1].Content||why[0][1].Message)), 'too empty: told once why, and when to come back');
  chars[1].MapData.Pos={X:9,Y:9}; skew+=20000; W.__ms(); chars[1].MapData.Pos={X:5,Y:5}; k=sent.length; skew+=20000; W.__ms(); skew+=20000; W.__ms(); await wait(3000);
  ok(sent.slice(k).filter(([e,d])=>d&&/give you a sniff/.test(String(d.Content||d.Message||''))).length===1, '...and again on the next visit');
  // live, Oct 7: a futa cow (small balls, 60 mL) was milked down to a quarter but never let go, "30 min to go"
  // for 25 minutes: half a mL a tick was never drained. Now the balls empty too and the session ends.
  chars[1].MapData.Pos={X:9,Y:9}; skew+=20000; W.__ms();
  L().people[500].futa=true; p().stall=null; p().stallPaused=null; p().stallRest=0; p().milk=24000; p().semen=60;
  chars[1].MapData.Pos={X:5,Y:5}; skew+=20000; W.__ms(); skew+=20000; W.__ms();
  ok(!!p().stall && p().stall.kind==='both', 'a futa cow: the stall milks breasts and cock both');
  ticks=0; while (p().stall && ticks<200){ skew+=20000; W.__ms(); ticks++; }
  ok(!p().stall && ticks*20/60<=32, 'the session ends ('+(ticks*20/60).toFixed(1)+' min)');
  ok(p().semen<=16.5, 'the balls are drained to a quarter too ('+p().semen.toFixed(1)+' mL)');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
