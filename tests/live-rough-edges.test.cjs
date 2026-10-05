// From the live recording (bot side, after the connection fix): the rough edges people actually hit.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "232922":{mn:232922,name:"Alexia",roles:["PROPRIETOR","LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "8560":{mn:8560,name:"Ella",roles:["LIVESTOCK"],species:"pony",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "3723":{mn:3723,name:"Spatchy",roles:["LIVESTOCK"],species:"pup",onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,34,33),at(221397,5,29),at(232922,6,29),at(8560,18,20),at(3723,32,38)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const FM=(mn,d)=>handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,...d}});
const toMe=(k,mn)=>sent.slice(k).filter(([e,d])=>d&&(d.Target===mn||d.MemberNumber===mn)).map(([e,d])=>String(d.Dictionary&&d.Dictionary.text||d.Content||d.Message||'')).join(' | ');
const wh=async(mn,t,type)=>{ const k=sent.length; handlers.ChatRoomMessage({Sender:mn,Type:type||'Whisper',Content:t,Target:260239}); await wait(5600); return k; };
(async()=>{ await wait(3500);
  chars[1].Name='Laynie'; chars[1].Nickname="Alexia's Laynie"; chars[2].Name='Alexia'; chars[3].Name='Ella'; chars[4].Name='Spatchy';
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-barn-life.user.js'),'utf8')); await wait(300);
  FM(221397,{type:'hello',ver:'0.10.7'}); await wait(1500);
  // 1. "/record Alexia" in the Companion box
  let k=sent.length; FM(221397,{type:'cmd',text:'/record Alexia'}); await wait(5600);
  ok(/FARM RECORD — Alexia/.test(toMe(k,221397)) && !/don't know/.test(toMe(k,221397)), '"/record Alexia" in the Companion box works');
  // 2. chat typed into the Companion box
  k=sent.length; FM(221397,{type:'cmd',text:"I'm in the lead cause I'm always here lol"}); await wait(5600);
  ok(/looked like chat/.test(toMe(k,221397)) && /game's own chat box/.test(toMe(k,221397)), "chat typed into the Companion box is told where chat goes");
  // 3. add-ons by their shown name
  k=await wh(8560,'?addons Barn life'); ok(/Barn life v/.test(toMe(k,8560)), '?addons Barn life finds it');
  k=await wh(8560,'?addons Barn'); ok(/Barn life v/.test(toMe(k,8560)), '?addons Barn finds it too (the start of the name)');
  // 4. a typo said out loud gets a private "did you mean"
  k=await wh(3723,'?a-addons','Chat'); const sp=toMe(k,3723);
  ok(/Did you mean \?addons/.test(sp) && !sent.slice(k).some(([e,d])=>d&&!d.Target&&d.Type==='Chat'), '"?a-addons" in the room gets a private "did you mean ?addons"');
  k=await wh(3723,'hello everyone','Chat'); ok(toMe(k,3723)==='', 'ordinary room chat still gets nothing');
  k=await wh(8560,'?adons'); ok(/Did you mean \?addons/.test(toMe(k,8560)), 'a misspelling in a whisper gets the suggestion too');
  // 5. a guide's name on its own
  k=await wh(221397,'?play'); ok(/PRIZE WHEEL|PLAY/.test(toMe(k,221397)) && !/don't know/.test(toMe(k,221397)), '?play opens the play guide');
  // 6. brackets in whispers
  k=await wh(8560,'?help'); const help=toMe(k,8560);
  ok(/\(- ! and \. work too\]/.test(help)===false && !/\(260239\]/.test(help), 'no "(…]" brackets in whispers');
  // 7. a greeting for somebody mid-join is never said out loud
  const lily=at(262073,-1,-1); lily.Name='lily'; chars.push(lily);
  k=sent.length; handlers.ChatRoomSyncMemberJoin({Character:{MemberNumber:262073,Name:'lily',MapData:{}}}); await wait(15000);
  ok(!sent.slice(k).some(([e,d])=>d&&!d.Target&&(d.Type==='Chat'||d.Type==='Emote')), 'a greeting for someone not yet on the map is never said to the whole room');
  ok(/lily/.test(toMe(k,262073)), '...it reaches them privately');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
