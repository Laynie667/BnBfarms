// Nov 7 (Laynie, from a watch report: "It says Exe is trying to summon alexia and i"): somethin' holdin' Exe in place had
// the bot teleportin' Exe every few seconds, Exe's game said no every time, and said it out loud in the room under Exe's
// name ("A teleportation attempt has been cancelled because not allowed"). Now a no from somebody's game to a teleport
// the bot just sent means no more teleports to them for a while: they're told once, privately, a hold stops tryin',
// the stocks stop whisperin' "back you go", and staff summonin' them are told why.
const fs=require('fs');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "700":{mn:700,name:"Rex",roles:["HERDMASTER"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "500":{mn:500,name:"Exe",roles:["LIVESTOCK"],species:"cow",onDuty:true,herd:null,tempKeys:[],cover:[]},
 "600":{mn:600,name:"Daisy",roles:["LIVESTOCK"],species:"goat",onDuty:true,herd:null,tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],spots:{stocks:{X:30,Y:30}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,0,0),at(221397,20,20),at(700,5,5),at(500,1,1),at(600,8,8)];
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,700,500,600]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(require('path').join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
// till the bot's send queue is empty (it paces messages)
const drain=async(min)=>{ await wait(min||200); for(let i=0;i<200;i++){ const q=W.__st(); if(!q.queue.length&&!q.urgent.length&&!q.sending) break; await wait(100);} await wait(200); };
const B=async(mn,msg)=>{handlers.AccountBeep({MemberNumber:mn,Message:msg});await wait(5200);};
const toWhom=(mn,n)=>sent.slice(n).filter(s=>(s[0]==='AccountBeep'&&s[1].MemberNumber===mn)||(s[1].Target===mn&&(s[1].Type==='Whisper'||s[1].Type==='Hidden'))).map(s=>s[1].Message||s[1].Content).join(' | ');
const teleTo=(mn,n)=>sent.slice(n).filter(s=>s[0]==='ChatRoomChat'&&s[1].Content==='ChatRoomMapViewTeleport'&&s[1].Target===mn);
// their game's no, the way it came in the watch report: an action, "Beep", the words in its dictionary
const refuse=(mn)=>handlers.ChatRoomMessage({Sender:mn,Type:'Action',Content:'Beep',Dictionary:[{Tag:'Beep',Text:'A teleportation attempt has been cancelled because not allowed.'},{Tag:'fbc_nonce',Text:175}]});
(async()=>{ await wait(3500);
  const st=W.__st();
  // a hold: Exe on Laynie's leash (a knot does the same), standin' well away from her
  st.leashes.set(500, 221397);
  let n=sent.length; W.__lt(); await drain();
  ok(teleTo(500,n).length>=1, 'a hold moves them ('+teleTo(500,n).length+' teleport)');
  // a no from somebody the bot didn't just try to move does nothin'
  n=sent.length; refuse(600); await wait(300);
  ok(!/won't let me move you/.test(toWhom(600,n)) && !(st.noMove&&st.noMove.has(600)), "a no out of nowhere (Daisy wasn't bein' moved) is ignored");
  // Exe's game says no
  n=sent.length; refuse(500); await drain();
  ok(/won't let me move you/.test(toWhom(500,n)), 'their game says no: they\'re told once, privately ('+toWhom(500,n).slice(0,90)+')');
  n=sent.length; for(let i=0;i<5;i++){ W.__lt(); await wait(50); } await drain();
  ok(!teleTo(500,n).length, '...and the hold stops tryin\' (no more teleports, so their game has nothin\' to say no to)');
  n=sent.length; refuse(500); await wait(300);
  ok(!/won't let me move you/.test(toWhom(500,n)), '...and a second no doesn\'t tell them twice');
  await wait(13000);
  ok(!teleTo(500,n).length, "...and the bot's own 'did it take?' check doesn't send it again");
  // the stocks: no "back in the stocks you go" whispers every few seconds
  st.leashes.delete(500);
  W.FarmhandLedger().people[500].stocked={until:Date.now()+600000,by:221397};
  n=sent.length; W.__heartbeat(); await wait(300); W.__heartbeat(); await wait(300);
  ok(!teleTo(500,n).length && !/back in the stocks/.test(toWhom(500,n)), 'the stocks don\'t keep whisperin\' "back in the stocks" at somebody they can\'t move');
  W.FarmhandLedger().people[500].stocked=null;
  // staff summon them: told why
  n=sent.length; await B(700,'summon 500');
  ok(/won't let me move them/.test(toWhom(700,n)) && !teleTo(500,n).length, 'a staff summon is told their game won\'t let me move them');
  // the half hour's up: tried again
  W.__cfg.NO_MOVE_MIN=0; st.leashes.set(500, 221397);
  n=sent.length; W.__lt(); await drain();
  ok(teleTo(500,n).length>=1, 'once the time\'s up, a hold tries again');
  st.leashes.delete(500);
  // too full to move, while their game's still loadin' them in (Laynie: "the script half loaded on Exe's end, and i think
  // Alexia and I tried to milk them before they were fully in"): the game has them at -1,-1 till they're placed
  // (a belly too full to waddle: held seed counts toward the pin, and it stays put between ticks)
  const D=chars.find(c=>c.MemberNumber===600), dp=W.__prodOf(600), full=()=>{ dp.held={vulva:8000,butt:0,mouth:0}; };
  // ?pinme (Laynie, Nov 7: "some players seem really frustrated with the mechanic"): off till they switch it on
  D.MapData.Pos={X:8,Y:8}; full(); dp.pin=null; dp.unpinUntil=0; W.__pt(); await drain();
  ok(!dp.pin, 'too full, but ?pinme is off (the default): no pin, they just waddle');
  n=sent.length; await B(600,'pinme on');
  ok(W.FarmhandLedger().people[600].pinMe===true && /Can be pinned.*ON/.test(toWhom(600,n)), '?pinme on switches it on');
  ok(W.__stateFor(600).switches.pinme===true, '...and the panel shows the switch on');
  D.MapData.Pos={X:-1,Y:-1}; full(); dp.pin=null; dp.unpinUntil=0;
  n=sent.length; W.__pt(); await drain();
  ok(!dp.pin && !teleTo(600,n).length, 'no pin taken off the map, while their game is still placin\' them');
  D.MapData.Pos={X:8,Y:8}; full(); W.__pt(); await drain();
  ok(!!dp.pin && dp.pin.X===8 && dp.pin.Y===8, '...and once they\'re on the map, the pin is where they stand ('+JSON.stringify(dp.pin)+')');
  dp.pin={X:-1,Y:-1,since:Date.now()}; D.MapData.Pos={X:9,Y:9}; full();   // a pin from before this fix, taken off the map
  n=sent.length; W.__pt(); await drain();
  ok(!!dp.pin && dp.pin.X===9 && dp.pin.Y===9 && !teleTo(600,n).length, 'a pin left off the map moves to where they stand: no teleport off the map');
  out(fails?fails+' FAILED':'ALL PASSED'); process.exit(fails?1:0);
})();
