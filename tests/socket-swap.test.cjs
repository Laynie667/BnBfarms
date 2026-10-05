// Seen live: the game swapped its connection after the page loaded, and the bot (and the watcher) kept
// listening to the old one: an hour with no commands answered and nobody greeted, while it still sent.
// Now it follows the new connection, takes its listeners off the old one, and puts them back if removed.
const fs=require('fs'), path=require('path');
const store={}; const sent=[];
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221397].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
// a socket.io-like connection: on, off, listeners, and a way to deliver an event
function Sock(){ const L={}; return { connected:true, L,
  on(e,f){ (L[e]=L[e]||[]).push(f); }, off(e,f){ L[e]=(L[e]||[]).filter(x=>x!==f); },
  listeners(e){ return (L[e]||[]).slice(); }, fire(e,d){ (L[e]||[]).slice().forEach(f=>f(d)); } }; }
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:Sock(),
  Player:{MemberNumber:260239,FriendList:[221397]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const answered=(k)=>sent.slice(k).some(([e,d])=>d&&d.Target===221397&&/PONG|pong|here|on duty|Farmhand/i.test(String(d.Content||d.Message||'')));
(async()=>{ await wait(3500);
  const first=W.ServerSocket;
  let k=sent.length; first.fire('ChatRoomMessage',{Sender:221397,Type:'Whisper',Content:'?ping',Target:260239}); await wait(2500);
  ok(sent.length>k, 'the bot hears on the connection it started with');
  // the game swaps its connection
  const second=Sock(); W.ServerSocket=second; W.__attach();
  ok(warns.some(w=>/swapped its connection/.test(w)), 'the swap is noticed and logged');
  ok(first.listeners('ChatRoomMessage').length===0, 'its listeners come off the old connection');
  await wait(5200); k=sent.length; second.fire('ChatRoomMessage',{Sender:221397,Type:'Whisper',Content:'?ping',Target:260239}); await wait(2500);
  ok(sent.length>k, 'and it hears on the new one');
  // someone takes the listeners off the connection
  second.L.ChatRoomMessage=[]; W.__attach();
  ok(second.listeners('ChatRoomMessage').length===1, 'listeners taken off are put back, once');
  await wait(5200); k=sent.length; second.fire('ChatRoomMessage',{Sender:221397,Type:'Whisper',Content:'?ping',Target:260239}); await wait(2500);
  ok(sent.length>k, '...and it hears again');
  // nothing changes: nothing doubles up
  W.__attach(); W.__attach();
  ok(second.listeners('ChatRoomMessage').length===1 && second.listeners('AccountBeep').length===1, 'checking again changes nothing (no double listeners)');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
