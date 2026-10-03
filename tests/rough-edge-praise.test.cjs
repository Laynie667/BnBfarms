const fs=require('fs');
const store={}; const sent=[]; const handlers={};
// v4 ledger with old single-herd shape
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "232922":{mn:232922,name:"Alexia",roles:["PROPRIETOR"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "700":{mn:700,name:"Mistress",roles:["HERDMASTER"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "800":{mn:800,name:"Hand",roles:["FARMHAND"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "166990":{mn:166990,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herd:null,tempKeys:[],cover:[]},
 "180836":{mn:180836,name:"Kitty",roles:["LIVESTOCK"],species:"cow",onDuty:true,herd:null,tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herd:700,herdType:"perm",tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221397,232922,700,800,500,166990,180836].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,232922,700,800,500]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(require('path').join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const lastTo=mn=>{const w=sent.filter(s=>(s[0]==='AccountBeep'&&s[1].MemberNumber===mn)||(s[1].Type==='Whisper'&&s[1].Target===mn)).map(s=>s[1].Message||s[1].Content);return w[w.length-1]||'';};
const beepsTo=mn=>sent.filter(s=>s[0]==='AccountBeep'&&s[1].MemberNumber===mn).map(s=>s[1].Message);
const B=async(mn,msg)=>{handlers.AccountBeep({MemberNumber:mn,Message:msg});await wait(5200);};
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const C=mn=>chars.find(c=>c.MemberNumber===mn);
const lastSay=()=>{const c=sent.filter(s=>s[0]==='ChatRoomChat'&&s[1].Type==='Chat').map(s=>s[1].Content);return c[c.length-1]||'';};
const PEN={Asset:{Name:'Penis',Group:{Name:'Pussy'}}};
const RP=async(mn,type,text)=>{handlers.ChatRoomMessage({Sender:mn,Type:type,Content:text});await wait(1200);};
const ACT=async(src,tgt,group,name)=>{handlers.ChatRoomMessage({Sender:src,Type:'Activity',Content:'ChatOther-'+group+'-'+name,Dictionary:[{SourceCharacter:src},{TargetCharacter:tgt},{Tag:'FocusAssetGroup',FocusGroupName:group},{ActivityName:name}]});await wait(1200);};
const I=(g,a,eff=[],blk=[],d)=>({Asset:{Name:a,Description:d||a,Group:{Name:g},Effect:eff,Block:blk}});
W.InventoryGroupIsBlocked=()=>true;   // what the live game does
(async()=>{ await wait(3500);
  C(221397).Name='Laynie'; C(232922).Name='Alexia'; C(700).Name='Rex';
  C(221397).Appearance=[I('Pussy','Pussy2')]; C(232922).Appearance=[PEN]; C(700).Appearance=[PEN];
  const ems=n=>sent.slice(n).filter(s=>s[1]&&s[1].Type==='Emote').map(s=>s[1].Content.slice(0,200));
  const inject=async(giver,target,name)=>{C(giver).Appearance=(C(giver).Appearance||[]).filter(x=>x.Asset.Group.Name!=='ItemHandheld').concat([{Asset:{Name:'MedicalInjector',Group:{Name:'ItemHandheld'}},Craft:{Name:name,Description:''}}]); await ACT(giver,target,'ItemArms','Inject');};
  const P=mn=>L().people[mn].prod; let n;
  await B(221397,'breedable on'); await B(221397,'fertile on'); await B(700,'stats'); await B(232922,'stats'); await B(221397,'stats');
  const fill=()=>{P(232922).semen=60;P(700).semen=60;};
  await B(221397,'freeuse on'); await B(221397,'praise on'); await B(221397,'degrade on');
  L().people[232922].species='horse';
  // rough / gentle
  await B(232922,'breed laynie'); fill(); const v0=P(221397).size.vulva;
  n=sent.length; await RP(232922,'Emote','pounds Laynie hard and cums'); out('R rough ->', v0,'→',P(221397).size.vulva, '|', ems(n).join(' / ').slice(-120));
  W.__st().scenes.get(232922).lastCum=0; fill(); const v1=P(221397).size.vulva;
  n=sent.length; await RP(232922,'Emote','slowly and gently cums in Laynie'); out('R gentle ->', v1,'→',P(221397).size.vulva, '|', ems(n).join(' / ').slice(-80));
  // seed taste
  fill(); n=sent.length; await B(232922,'cum laynie mouth'); out('T taste ->', ems(n).join(' / ').slice(-110));
  // edging
  for (let k=0;k<3;k++){ P(232922).edgeAt=0; n=sent.length; await B(800,'edge alexia'); out('E edge',k+1,'->', ems(n).join(' / ').slice(0,110)); }
  out('E pent ->', P(232922).pentUp, P(232922).edges);
  // slosh
  P(221397).held.vulva=500; P(221397).lastPos={X:5,Y:5}; P(221397).sloshAt=0; n=sent.length; W.__pt(); await wait(1500); out('S slosh ->', ems(n).filter(x=>x.includes('💦')).join(' / ').slice(0,120));
  // knot tug
  P(221397).tieUntil=Date.now()+600000; P(221397).tiedTo=232922; W.__st().leashes.set(221397,232922);
  W.__lt(); C(221397).MapData.Pos={X:4,Y:4}; n=sent.length; W.__lt(); await wait(1500); out('K tug ->', ems(n).join(' / ').slice(0,120));
  P(221397).tieUntil=0; W.__st().leashes.delete(221397); C(221397).MapData.Pos={X:1,Y:1};
  // stud stall
  L().spots=Object.assign(L().spots||{},{milking1:{X:1,Y:1}}); P(232922).semen=60; P(232922).stallSaid=0;
  n=sent.length; W.__ms(); await wait(1500); out('ST stall ->', ems(n).join(' / ').slice(0,120)); delete L().spots.milking1;
  // belly rub
  P(221397).preg={since:Date.now()-86400000,due:Date.now()+86400000*4,sires:[232922],count:2,warned:false}; P(221397).rubAt=0;
  n=sent.length; await ACT(800,221397,'ItemTorso','Caress'); out('B rub ->', ems(n).join(' / ').slice(0,120));
  // praise / degrade
  n=sent.length; await RP(800,'Chat','Such a good girl, Laynie'); out('P praise ->', ems(n).join(' / ').slice(0,120));
  n=sent.length; await RP(800,'Chat','Laynie is a filthy little breeder'); out('P degrade ->', ems(n).join(' / ').slice(0,120));
  out('P counts ->', L().people[221397].praised, L().people[221397].degraded);
  n=sent.length; await RP(232922,'Chat','good girl Laynie'); out('P non-staff ignored ->', ems(n).length===0);
  await B(221397,'help breeding'); out('G help ok ->', /degrade/.test(beepsTo(221397).slice(-3).join('')));
  process.exit(0);
})();
