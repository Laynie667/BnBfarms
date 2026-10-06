// ?contract: the bot offers BC+ contracts the BC+ way, notices signing, and can release them.
const fs=require('fs');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "700":{mn:700,name:"Rex",roles:["HERDMASTER"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "800":{mn:800,name:"Hand",roles:["FARMHAND"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "500":{mn:500,name:"Bessie",roles:["LIVESTOCK"],species:"cow",onDuty:true,herd:null,tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221397,700,800,500].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
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
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const lastTo=mn=>{const w=sent.filter(s=>(s[0]==='AccountBeep'&&s[1].MemberNumber===mn)||(s[1].Type==='Whisper'&&s[1].Target===mn)).map(s=>s[1].Message||s[1].Content);return w[w.length-1]||'';};
const bcpTo=(mn,n)=>sent.slice(n).filter(s=>s[0]==='ChatRoomChat'&&s[1].Content==='BCP'&&s[1].Target===mn).map(s=>s[1].Dictionary);
(async()=>{ await wait(3500);
  chars.find(c=>c.MemberNumber===500).Name='Bessie';
  // 1. offer the ready-made Deep contract for a week
  let n=sent.length; await B(700,'contract offer deep 500 1w');
  const offer=bcpTo(500,n)[0]||{};
  out('1 sent as a BC+ ContractOffer ->', offer.message==='ContractOffer', !!offer.payload);
  const p=offer.payload||{};
  out('1 a week, farm-only ending ->', p.durationMin===10080, p.policy==='author');
  out('1 cow speech, summonable by the farm ->', p.rules&&p.rules['pet.speech'].settings.animal==='Cow', p.rules&&p.rules['other.summon'].settings.allowedMembers.includes(260239));
  out('1 tracked as offered ->', (L().contracts||[]).some(x=>x.mn===500&&x.status==='offered'));
  // asked for: the nickname made for whoever it's offered to ("BnB Cow Vicky", "BnB Pet Rya")
  out('1 nickname made for them ->', p.rules&&p.rules['control.nickname'].settings.nickname==='BnB Cow Bessie');
  // 2. farmhands can't offer
  n=sent.length; await B(800,'contract offer deep 500 1w');
  out('2 farmhand refused ->', bcpTo(500,n).length===0, /herdmasters/.test(lastTo(800)));
  // 3. Bessie signs: BC+ tells the author, then answers the bot's query with its list
  n=sent.length;
  handlers.ChatRoomMessage({Sender:500,Type:'Activity',Content:'BCPAction',Target:260239,Dictionary:[{Tag:'MISSING TEXT IN "ActivityDictionary.csv": BCPAction',Text:'BC+: Bessie has signed your contract "'+p.title+'".'}]});
  await wait(2600);
  out('3 marked signed ->', (L().contracts||[]).some(x=>x.mn===500&&x.status==='signed'));
  out('3 asked BC+ for the list ->', bcpTo(500,n).some(d=>d.message==='ContractQuery'));
  handlers.ChatRoomMessage({Sender:500,Type:'Hidden',Content:'BCP',Dictionary:{message:'ContractList',contracts:[{id:'cabc123',title:p.title,durationMin:10080,policy:'author',rules:p.rules,signedAt:Date.now(),until:Date.now()+604800000,prior:{}}]}});
  await wait(300);
  out('3 knows BC+ id ->', (L().contracts||[]).some(x=>x.mn===500&&x.bcpId==='cabc123'));
  // 4. release
  n=sent.length; await B(700,'contract release 500');
  const rel=bcpTo(500,n).find(d=>d.message==='ContractCommand')||{};
  out('4 release sent the BC+ way ->', rel.action==='release' && rel.id==='cabc123');
  handlers.ChatRoomMessage({Sender:500,Type:'Activity',Content:'BCPAction',Dictionary:[{Tag:'x',Text:'Bessie is no longer bound by the contract "'+p.title+'".'}]});
  await wait(300);
  out('4 marked ended ->', (L().contracts||[]).some(x=>x.mn===500&&x.status==='ended'));
  // 5. custom contract by proprietor, with checking
  await B(221397,'contract new prizecow from fun');
  await B(221397,'contract add prizecow other.listenToMyVoice sentences="Good cows stand still.|Moo for me." frequency=15');
  out('5 rule added ->', !!(L().contractTemplates.prizecow.add['other.listenToMyVoice']));
  await B(221397,'contract add prizecow body.controlOrgasms mode=please');
  out('5 bad choice refused ->', /Edged, Ruined, Unresistable/.test(lastTo(221397)));
  await B(221397,'contract add prizecow settings.safeword value="Safeword disabled"');
  out('5 safeword rule refused ->', /never/.test(lastTo(221397)));
  // a saved contract with placeholders fills them in per person
  await B(221397,'contract add prizecow control.nickname nickname="BnB {Species} {name}"');
  await B(221397,'contract add prizecow social.greetRoom greeting="{name} the {species} says hi"');
  const t5=W.__buildContract ? W.__buildContract('prizecow', 500, '1w') : null;
  out('5 placeholders filled per person ->', !!t5 && t5.rules['control.nickname'].settings.nickname==='BnB Cow Bessie' && t5.rules['social.greetRoom'].settings.greeting==='Bessie the cow says hi');
  n=sent.length; await B(221397,'contract offer prizecow 500 perm');
  const c2=(bcpTo(500,n)[0]||{}).payload||{};
  out('5 custom offer sent, permanent ->', c2.durationMin===0, !!(c2.rules&&c2.rules['other.listenToMyVoice']), c2.rules&&c2.rules['other.listenToMyVoice'].settings.sentences.length===2);
  process.exit(0);
})();
