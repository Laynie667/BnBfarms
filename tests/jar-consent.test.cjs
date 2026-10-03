// Jar insemination always asks first, and ?jarok off means never.
const fs=require('fs');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "232922":{mn:232922,name:"Alexia",roles:["PROPRIETOR"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "800":{mn:800,name:"Hand",roles:["FARMHAND"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herd:null,tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221397,232922,800,500].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,232922,800,500]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(require('path').join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const lastTo=mn=>{const w=sent.filter(s=>(s[0]==='AccountBeep'&&s[1].MemberNumber===mn)||(s[1].Type==='Whisper'&&s[1].Target===mn)).map(s=>s[1].Message||s[1].Content);return w[w.length-1]||'';};
const B=async(mn,msg)=>{handlers.AccountBeep({MemberNumber:mn,Message:msg});await wait(5200);};
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const C=mn=>chars.find(c=>c.MemberNumber===mn);
const I=(g,a)=>({Asset:{Name:a,Description:a,Group:{Name:g},Effect:[],Block:[]}});
const ems=n=>sent.slice(n).filter(s=>s[1]&&s[1].Type==='Emote').map(s=>s[1].Content);
W.InventoryGroupIsBlocked=()=>false;
(async()=>{ await wait(3500);
  C(221397).Name='Laynie'; C(232922).Name='Alexia'; C(800).Name='Hand';
  C(221397).Appearance=[I('Pussy','Pussy2')];
  await B(221397,'breedable on');
  const held=()=>Math.round(((L().people[221397].prod||{}).held||{}).vulva||0);
  const jar=(id)=>{ L().jars=(L().jars||[]).concat([{id,ml:30,stud:232922,t:Date.now()}]); };
  jar(1);
  let n=sent.length; await B(800,'inseminate laynie 1');
  out('1 staff told it was asked ->', /asked laynie first/i.test(lastTo(800)));
  out('1 laynie was asked ->', /jar #1/.test(lastTo(221397)));
  out('1 nothing happened yet ->', held()===0 && ems(n).length===0);
  await B(221397,'no');
  out('2 no is passed on ->', /said no/i.test(lastTo(800)));
  out('2 jar still on the shelf ->', L().jars.some(j=>j.id===1), held()===0);
  n=sent.length; await B(800,'inseminate laynie 1'); await B(221397,'yes');
  out('3 yes does it ->', held()>0, ems(n).some(e=>/jar #1/.test(e)));
  out('3 jar used up ->', !L().jars.some(j=>j.id===1));
  await B(221397,'jarok off');
  out('4 jarok off ->', L().people[221397].jarok===false, /OFF/.test(lastTo(221397)));
  jar(2); const before=held(); await B(800,'inseminate laynie 2');
  out('4 never means never ->', /said never/i.test(lastTo(800)), held()===before);
  await B(221397,'jarok on');
  out('5 jarok on ->', L().people[221397].jarok===true);
  process.exit(0);
})();
