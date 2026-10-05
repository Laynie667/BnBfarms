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
  const mins=ticks*20/60;
  ok(mins>=8 && mins<=12, 'a full big udder takes about 10 minutes ('+mins.toFixed(1)+' min)');
  const lines=roomLines(k);
  ok(lines>=1 && lines<=3, 'only a few lines on the way, finish included ('+lines+')');
  ok(p().milk <= 24000*0.25+400, 'drained down to about a quarter');
  // the stall rests now
  ok(p().stallRest > Date.now()+9*60000 && p().stallRest < Date.now()+21*60000, 'the stall rests 10-20 minutes');
  full(); k=sent.length; W.__ms(); W.__ms(); W.__ms(); await wait(4000);
  ok(!p().stall, '...and does not take them again meanwhile');
  const told=sent.slice(k).filter(([e,d])=>d&&/restin'/.test(String(d.Content||d.Message||'')));
  ok(told.length===1, '...they are told once, not every tick');
  skew+=21*60000; W.__ms(); W.__ms();
  ok(!!p().stall, 'after the rest it takes them again');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
