// Nov 7 (Laynie: "even with the admin powers off, the ram usage is spiking way up again", only on the bot's tab): the game
// never trims its chat log (only its Cut button does), and the bot's tab runs all day with thousands of lines an hour.
// Now the bot keeps the last CFG.CHATLOG_KEEP lines on its own page: the oldest go, the room's divider and the newest stay.
const fs=require('fs'), path=require('path');
const { JSDOM } = require('jsdom');
const page=new JSDOM('<!doctype html><html><body><div id="TextAreaChatLog"></div></body></html>');
const logEl=page.window.document.getElementById('TextAreaChatLog');
const sep=page.window.document.createElement('div'); sep.className='chat-room-sep'; sep.textContent='B&B Farm'; logEl.appendChild(sep);
for (let i=0;i<1200;i++){ const d=page.window.document.createElement('div'); d.className='ChatMessage'; d.textContent='line '+i; logEl.appendChild(d); }
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{"221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herd:null,tempKeys:[],cover:[]}},applications:[],archive:{},log:[],stuckLog:[],spots:{}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(id){ return id==='TextAreaChatLog'?logEl:null; },visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}}});
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:[at(260239,0,0),at(221397,5,5)],
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
(async()=>{ await wait(3500);
  W.__heartbeat(); await wait(100);
  const keep=W.__cfg.CHATLOG_KEEP;
  ok(logEl.childElementCount===keep, 'the bot\'s chat log is cut to the last '+keep+' ('+logEl.childElementCount+' left of 1201)');
  ok(logEl.firstElementChild===sep, '...the room\'s divider stays');
  ok(logEl.lastElementChild.textContent==='line 1199' && logEl.children[1].textContent==='line '+(1200-keep+1), '...and it\'s the newest lines that stay, the oldest that go');
  const n=logEl.childElementCount; W.__heartbeat(); await wait(100);
  ok(logEl.childElementCount===n, 'a log already short enough is left alone');
  out(fails?fails+' FAILED':'ALL PASSED'); process.exit(fails?1:0);
})();
