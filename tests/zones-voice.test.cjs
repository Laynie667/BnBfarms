// Zones (two corners, paired into one place), "who's where", the farm's Listen to my voice,
// and the staff state the Companion's Herd / Zones / Voice / Shift tabs read.
const fs=require('fs');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "700":{mn:700,name:"Rex",roles:["HERDMASTER"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "800":{mn:800,name:"Hand",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:700,type:"perm",at:1}],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],zones:{pens:{a:{X:20,Y:20},b:{X:25,Y:25},group:"pens"}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,0,0),at(221397,20,20),at(700,2,2),at(800,30,30),at(500,3,3)];
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,700,800,500]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(require('path').join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const B=async(mn,msg)=>{handlers.AccountBeep({MemberNumber:mn,Message:msg});await wait(5200);};
const H=async(mn,d)=>{handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,...d}});await wait(400);};
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const lastTo=mn=>{const w=sent.filter(s=>(s[0]==='AccountBeep'&&s[1].MemberNumber===mn)||(s[1].Type==='Whisper'&&s[1].Target===mn)).map(s=>s[1].Message||s[1].Content);return w[w.length-1]||'';};
const farmTo=(mn,type,n)=>sent.slice(n||0).filter(s=>s[1]&&s[1].Content==='FarmhandMsg'&&s[1].Target===mn&&s[1].Dictionary.type===type).map(s=>s[1].Dictionary);
const C=mn=>chars.find(c=>c.MemberNumber===mn);
(async()=>{ await wait(3500);
  C(500).Name='Moo';
  out('0 zones saved before a restart are still there ->', !!(L().zones&&L().zones.pens));
  // 1. zones from two corners, paired into one place
  await B(700,'zone a barn-1'); C(700).MapData.Pos={X:5,Y:4}; await B(700,'zone b barn-1');
  out('1 corners set ->', JSON.stringify(L().zones['barn-1'].a)==='{"X":2,"Y":2}', JSON.stringify(L().zones['barn-1'].b)==='{"X":5,"Y":4}');
  await B(700,'zone pair barn-1 barn');
  await B(700,'zone who');
  out('1 who is where uses the group ->', /barn: [^\n]*Moo/.test(lastTo(700)));
  await B(800,'zone a sneaky');
  out('1 farmhands cannot set zones ->', !L().zones.sneaky);
  await B(800,'spot set sneaky');
  out('1 ...or spots ->', !(L().spots||{}).sneaky);
  out('1 farmhands get the map to look at ->', !!W.__stateFor(800).zones && W.__stateFor(800).mapEdit===false, W.__stateFor(700).mapEdit===true);
  // 2. voice lines: retired Oct 19 (Laynie: "we can probably strip out ... the herd voicelines")
  for (const mn of [500,700]) await H(mn,{type:'hello',ver:'0.4.0'});
  await B(700,'voice add herd Good cows stand still, %name%.');
  out('2 ?voice says it is retired, and keeps nothing ->', /retired/.test(lastTo(700)) || farmTo(700,'reply').some(d => /retired/.test(d.text)), !(L().voice&&L().voice.herd&&L().voice.herd[700]&&L().voice.herd[700].lines.length));
  let n;
  // 3. staff state for the Companion
  n=sent.length; W.__sync(true); await wait(300);
  const st=(farmTo(700,'state',n).pop()||{}).state||{};
  const moo=(st.herd||[]).find(x=>x.mn===500)||{};
  out('3 herd list with where and mine ->', moo.where==='barn', moo.mine===true);
  out('3 zones in state ->', !!(st.zones&&st.zones['barn-1']));
  out('3 shift info ->', !!st.shift && Array.isArray(st.shift.onDuty));
  const moost=(farmTo(500,'state',n).pop()||{}).state||{};
  out('3 stock get no staff data ->', !moost.herd && !moost.zones);
  process.exit(0);
})();
