// ?summon: here → beside the summoner · on-call staff away → pulled to the staff spot · anyone else → invite
const fs=require('fs');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "700":{mn:700,name:"Rex",roles:["HERDMASTER"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "800":{mn:800,name:"Hand",roles:["FARMHAND"],onDuty:true,forced:true,herd:null,tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herd:null,tempKeys:[],cover:[]},
 "600":{mn:600,name:"Daisy",roles:["LIVESTOCK"],species:"goat",onDuty:true,herd:null,tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],spots:{staff:{X:10,Y:10}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,0,0),at(221397,20,20),at(700,5,5),at(500,1,1)];   // Hand and Daisy are elsewhere
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,700,800,500,600]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(require('path').join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const B=async(mn,msg)=>{handlers.AccountBeep({MemberNumber:mn,Message:msg});await wait(5200);};
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const lastTo=mn=>{const w=sent.filter(s=>(s[0]==='AccountBeep'&&s[1].MemberNumber===mn)||(s[1].Type==='Whisper'&&s[1].Target===mn)).map(s=>s[1].Message||s[1].Content);return w[w.length-1]||'';};
const teleTo=(mn,n)=>sent.slice(n).filter(s=>s[0]==='ChatRoomChat'&&s[1].Content==='ChatRoomMapViewTeleport'&&s[1].Target===mn).map(s=>s[1].Dictionary[0].Position);
(async()=>{ await wait(3500);
  let n=sent.length; await B(700,'summon 500'); await wait(500);
  const p=teleTo(500,n)[0]||{};
  out('1 in the room → beside Rex ->', p.X===6 && p.Y===5, JSON.stringify(p), /beside you/.test(lastTo(700)));
  chars.push(at(600,6,5)); n=sent.length; await B(700,'summon 500'); await wait(500);
  const q=teleTo(500,n)[0]||{};
  out('2 skips a taken tile ->', !(q.X===6&&q.Y===5) && Math.abs(q.X-5)<=1 && Math.abs(q.Y-5)<=1, JSON.stringify(q));
  chars.pop();
  n=sent.length; await B(700,'summon 800');
  const pulled=sent.slice(n).some(s=>s[0]==='AccountBeep'&&s[1].MemberNumber===800&&s[1].Message==='summon');
  out('3 on-call staff away → BCX summon ->', pulled, '| lands at', W.__st().arrivals.get(800)&&W.__st().arrivals.get(800).spot);
  n=sent.length; await B(700,'summon 600');
  const forced=sent.slice(n).some(s=>s[0]==='AccountBeep'&&s[1].MemberNumber===600&&s[1].Message==='summon');
  out('4 stock away → invite, no pull ->', !forced, /nobody's pullin/i.test(lastTo(600)), !W.__st().arrivals.has(600));
  process.exit(0);
})();
