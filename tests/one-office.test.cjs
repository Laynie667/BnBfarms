// One farm office: the bot script on the wrong account, or a second copy while another is running the farm,
// stays quiet. It doesn't answer, doesn't save over the books and doesn't walk into the room.
const fs=require('fs'), path=require('path');
const realTimeout=setTimeout, wait=ms=>new Promise(r=>realTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const BOOKS=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "180836":{mn:180836,name:"Auri",roles:["FARMHAND","LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],spots:{}});

function boot(me, lock){
  const store={bnb_ledger_v1:BOOKS}; if (lock) store.bnb_office_lock=JSON.stringify(lock);
  const sent=[], handlers={};
  global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
  const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){},set textContent(v){this._t=v}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
  const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
  const W={document:doc,addEventListener(){},dispatchEvent(){},CustomEvent:class{},location:{reload(){ W.__reloaded=true; }},alert(){},prompt(){},
    ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
    Player:{MemberNumber:me,FriendList:[221397,180836]},
    ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:[at(me,1,1),at(221397,2,2),at(180836,3,3)],
    ChatRoomPlayerIsAdmin:()=>true, Commands:[], CommandCombine(l){ W.Commands.push(...l); }, ChatRoomSendLocal(){}};
  global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
  global.console={...console,log:()=>{},warn:()=>{}};
  W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
  return {W,store,sent,handlers};
}

(async()=>{
  // 1. the script on someone's personal account
  let b=boot(221397);
  await wait(3500);
  b.handlers.ChatRoomMessage && b.handlers.ChatRoomMessage({Sender:180836,Type:'Whisper',Content:'?record 180836'});
  await wait(1500);
  ok(b.W.__st().dormant==='account', 'wrong account: goes quiet');
  ok(!b.sent.some(([e,d])=>d&&(d.Type==='Whisper'||d.Type==='Chat'||d.Type==='Emote')), '...and answers nobody');
  ok(b.store.bnb_ledger_v1===BOOKS, '...and never touches the books');

  // 2. a second copy while another is running the farm
  b=boot(260239, {id:'other-tab', at:Date.now()});
  await wait(3500);
  b.handlers.ChatRoomMessage && b.handlers.ChatRoomMessage({Sender:221397,Type:'Whisper',Content:'?unregister 180836'});
  await wait(1500);
  ok(b.W.__st().dormant==='copy', 'second copy: stands by');
  ok(!b.sent.some(([e,d])=>d&&d.Type==='Whisper'), '...answers nobody');
  ok(JSON.parse(b.store.bnb_ledger_v1).people["180836"], '...and Auri stays on the books');
  ok(!b.W.__reloaded, '...and the watchdog leaves it alone');

  // 3. the other copy goes away (stale lock): this one takes over
  b.store.bnb_office_lock=JSON.stringify({id:'other-tab', at:Date.now()-60000});
  ok(b.W.__office()===true, 'stale lock: takes over');
  ok(!b.W.__st().dormant, '...and is back on duty');

  // 4. ?stock with a person (not a species) shows that person, not "not on the books"
  for (const q of ['180836','Auri']){
    const k=b.sent.length;
    b.handlers.ChatRoomMessage({Sender:221397,Type:'Whisper',Content:'?stock '+q});
    await wait(2500);
    const txt=b.sent.slice(k).filter(([e,d])=>d&&d.Target===221397).map(([e,d])=>String(d.Content)).join('\n');
    ok(/FARM RECORD/.test(txt) && /180836/.test(txt) && !/No 1808|No auri/i.test(txt), '?stock '+q+' finds Auri');
    await wait(5200);   // the per-person command gap
  }

  out(fails ? fails+' FAILED' : 'ALL PASS'); process.exit(fails?1:0);
})();
