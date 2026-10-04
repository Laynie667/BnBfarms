// ?apply never gets stuck waitin' on a button nobody can see: someone the bot last saw with a Companion
// (closed since, no bye) gets every question as plain text; a Companion that answers still gets its buttons.
const fs=require('fs');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herd:null,tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221397,900,901].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
const live=new Set([901]);   // only 901's Companion is really runnin'
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]);
    if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:[]}),0);
    // a live Companion answers a ping with a hello
    if(d&&d.Type==='Hidden'&&d.Dictionary&&d.Dictionary.type==='ping'&&live.has(d.Target)) setTimeout(()=>FM(d.Target,{type:'hello',ver:'0.10.3'}),50);
  }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(require('path').join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const FM=(mn,d)=>handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,...d}});
const WH=async(mn,msg)=>{handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239});await wait(5300);};
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const whispers=(mn,n)=>sent.slice(n).filter(s=>s[1]&&s[1].Type==='Whisper'&&s[1].Target===mn).map(s=>s[1].Content).join(' | ');
const panel=(mn,n,type)=>sent.slice(n).filter(s=>s[1]&&s[1].Type==='Hidden'&&s[1].Target===mn&&s[1].Dictionary&&(!type||s[1].Dictionary.type===type));
(async()=>{ await wait(3500);
  // both said hello earlier; 900 has since closed the Companion without a bye
  FM(900,{type:'hello',ver:'0.10.3'}); FM(901,{type:'hello',ver:'0.10.3'}); await wait(1500);
  let n=sent.length;
  await WH(900,'?apply');
  out('1 the intro reaches them as a whisper ->', /INTAKE/.test(whispers(900,n)));
  out('1 it says how to answer from anywhere on the map ->', /\/bot/.test(whispers(900,n)));
  await WH(900,'Daisy please'); await WH(900,'livestock');
  out('2 the species question comes as text with the picks ->', /what kind of animal/i.test(whispers(900,n)) && /Pick one:/.test(whispers(900,n)));
  out('2 no panel buttons were sent ->', panel(900,n,'choose').length===0);
  await WH(900,'goat');
  out('3 the answer counts ->', /How should the farm see you/.test(whispers(900,n)));
  await wait(26000);
  out('4 the silent Companion is forgotten ->', !W.__st().companions.has(900));

  // 901's Companion is really there: buttons as before
  n=sent.length;
  FM(901,{type:'cmd',text:'apply'}); await wait(5300);
  FM(901,{type:'cmd',text:'Bess'}); await wait(5300);
  FM(901,{type:'cmd',text:'livestock'}); await wait(5300);
  out('5 a live Companion still gets buttons ->', panel(901,n,'choose').length===1);
  out('5 ...and no whispers ->', whispers(901,n)==='');

  // asking ?apply again mid-way re-sends the question as text
  n=sent.length;
  await WH(901,'?apply');
  out('6 ?apply again re-asks in plain text ->', /halfway/.test(whispers(901,n)) && /what kind of animal/i.test(whispers(901,n)));
  process.exit(0);
})();
