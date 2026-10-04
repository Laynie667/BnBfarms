// The bot's own account is a proprietor: /office <command> in its chat runs farm commands with answers on
// its own screen (zones and spots use the bot's position), and a Companion on the bot's account works too.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"glory-1":{X:5,Y:5},"glory-1-visitor":{X:5,Y:6}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){},set textContent(v){this._t=v},get outerHTML(){return '<div>'+this._t+'</div>'}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(500,5,5),at(600,30,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,500]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[], CommandCombine(list){ W.Commands.push(...list); }, ChatRoomSendLocal(h){ local.push(h); }};
const local=[];
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const realTimeout=setTimeout, wait=ms=>new Promise(r=>realTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
// wait till the bot's send queue is empty (it paces messages), plus the 5 s per-person command gap
const drain=async(min)=>{ await wait(min||300); for(let i=0;i<400;i++){ const s=W.__st(); if(!s.queue.length&&!s.urgent.length&&!s.sending) break; await wait(100);} await wait(200); };
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const toWhom=(k,mn)=>sent.slice(k).filter(([e,d])=>d&&d.Target===mn&&(d.Type==='Whisper'||d.Type==='Hidden')).map(([e,d])=>d.Content);
const beepsTo=(k,mn)=>sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===mn).map(([e,d])=>d.Message);
(async()=>{ await wait(3500);
  const office=W.Commands.find(c=>c.Tag==='office');
  ok(!!office, '/office is registered on the bot');
  // stand the bot on a corner, set it; walk to the other, set it
  chars[0].MapData.Pos={X:2,Y:3}; office.Action('zone a barn'); await drain(1300);
  chars[0].MapData.Pos={X:9,Y:8}; office.Action('zone b barn'); await drain(1300);
  const z=L().zones && L().zones.barn;
  ok(z && z.a.X===2 && z.a.Y===3 && z.b.X===9 && z.b.Y===8, 'zones set from where the bot stands');
  office.Action('spot set home'); await drain(1300);
  ok(L().spots.home && L().spots.home.X===9, 'spots too');
  ok(local.some(h=>/barn/.test(h)) && !sent.some(([e,d])=>d&&d.Target===260239), 'answers appear on the bot\'s own screen, nothing sent to itself');
  office.Action('addons'); await drain(1300);
  ok(local.some(h=>/ADD-ONS|add-ons/i.test(h)), 'proprietor commands work');
  // a Companion on the bot's own account
  const k=sent.length;
  handlers.ChatRoomMessage({Sender:260239,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'hello',ver:'0.8.0'}}); await drain(1500);
  ok(sent.slice(k).some(([e,d])=>d&&d.Type==='Hidden'&&d.Target===260239&&d.Dictionary.type==='welcome'), 'a Companion on the bot account gets a welcome');
  await wait(1200);
  const stt=sent.slice(k).filter(([e,d])=>d&&d.Type==='Hidden'&&d.Target===260239&&d.Dictionary.type==='state').map(([e,d])=>d.Dictionary.state).pop();
  ok(stt && stt.proprietor && stt.staff, '...and its state says proprietor (Staff and Dashboard panels)');
  // the bot's own broadcast ping echo is ignored
  handlers.ChatRoomMessage({Sender:260239,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'ping',ver:'x'}}); await wait(200);
  ok(true, 'own ping echo ignored (no crash)');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
