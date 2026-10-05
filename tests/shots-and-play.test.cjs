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
  // A. shots
  n=sent.length; await inject(800,232922,'Shrink Penis'); out('A1 shrink penis ->', P(232922).size.penis, '|', ems(n).join(' / '));
  n=sent.length; await inject(800,232922,'Grow Balls'); out('A2 grow balls ->', P(232922).size.testes, '|', ems(n).join(' / '));
  n=sent.length; await inject(800,221397,'Big Tit Growth Serum'); out('A3 tits ->', P(221397).size.udder, '|', ems(n).join(' / '));
  const cap0=P(221397).capBonus; n=sent.length; await inject(800,221397,'Pussy Stretching Shot'); out('A4 pussy stretch ->', P(221397).size.vulva, 'capBonus same', P(221397).capBonus===cap0, '|', ems(n).join(' / '));
  n=sent.length; await inject(800,221397,'Grow Penis'); out('A5 no penis ->', lastTo(221397).slice(0,90));
  n=sent.length; await inject(800,232922,'Lactation Virility'); out('A6 boosts ->', ems(n).join(' / '));
  // C. consent
  const fillUp=()=>{P(232922).semen=60;P(700).semen=60;};
  n=sent.length; await B(232922,'breed laynie'); out('C1 ask ->', lastTo(221397).slice(0,80), '| stud:', lastTo(232922).slice(0,60));
  n=sent.length; await B(221397,'yes'); out('C2 yes ->', ems(n).join(' / ').slice(0,120));
  fillUp(); n=sent.length; await RP(232922,'Emote','cums deep in Laynie\'s ass'); out('C3 stud whisper', lastTo(232922).slice(0,60)); out('C3 hole from emote -> butt held', Math.round(P(221397).held.butt), '|', ems(n).join(' / ').slice(0,100));
  W.__st().scenes.get(232922).lastCum=0;
  fillUp(); n=sent.length; await RP(232922,'Emote','pulls out and cums all over her face'); out('C4 paint ->', JSON.stringify(P(221397).painted&&P(221397).painted.areas), '|', ems(n).join(' / ').slice(0,120));
  n=sent.length; await B(700,'cum laynie butt'); out('C5 rex not asked yet ->', lastTo(700).slice(0,70), '| asked laynie:', lastTo(221397).slice(0,50));
  await B(221397,'no'); out('C6 no ->', lastTo(700).slice(0,60));
  await B(221397,'freeuse on'); out('C7 freeuse ->', lastTo(221397).slice(0,50));
  await B(221397,'tally on');
  fillUp(); n=sent.length; await B(700,'cum laynie mouth'); out('C8 rex free use ->', ems(n).join(' / ').slice(0,90));
  await B(221397,'board'); out('F board ->', (lastTo(221397).match(/cumdump[^\n]*/)||['?'])[0]);
  await B(221397,'who'); out('F who ->', (lastTo(221397).match(/Stock:[^\n]*/)||['?'])[0]);
  // G scent: Rex is near Laynie who smells of Rex now; make her smell of Alexia
  P(221397).scent={stud:232922,until:Date.now()+3600000}; P(700).smelled={};
  n=sent.length; W.__pt(); await wait(2500); out('G scent ->', ems(n).filter(x=>x.includes('reek')).join(' / ').slice(0,120));
  // H taste
  await B(221397,'milkable on'); P(221397).milk=600;
  n=sent.length; await RP(232922,'Emote','sucks on Laynie\'s nipples'); await wait(17000); out('H taste ->', ems(n).join(' / ').slice(0,160));
  // O nomilk
  n=sent.length; await B(800,'nomilk laynie 2'); out('O cap ->', ems(n).join(' / ').slice(0,90));
  await B(800,'milk laynie'); out('O milk refused ->', lastTo(800).slice(0,70));
  P(221397).milkDeniedUntil=0;
  // K inspect
  n=sent.length; await B(800,'inspect laynie'); out('K inspect ->', ems(n).join(' / '));
  // B blocked tease: plug in Laynie's butt
  C(221397).Appearance=[I('Pussy','Pussy2'), I('ItemButt','ButtPlug',['IsPlugged'])];
  fillUp(); n=sent.length; await B(232922,'cum laynie butt'); out('B6 tease ->', ems(n).join(' / ').slice(0,120), '| laynie:', lastTo(221397).slice(0,60), '| stud:', lastTo(232922).slice(0,80));
  // stretcher
  C(221397).Appearance=[I('Pussy','Pussy2'), Object.assign(I('ItemVulva','Dildo'),{Craft:{Name:'Stretching Plug',Description:''}})];
  const v0=P(221397).size.vulva; P(221397).stretchOn={}; n=sent.length; W.__pt(); await wait(2500); out('ST stretcher ->', v0,'→',P(221397).size.vulva, '|', ems(n).join(' / ').slice(0,120));
  C(221397).Appearance=[I('Pussy','Pussy2')];
  // I milk-in ask + labour, eggs
  W.__cfg.PROD.CONCEIVE_BASE=50; await B(221397,'milkable off'); W.__st().scenes.delete(232922);
  fillUp(); n=sent.length; { const r0=Math.random; Math.random=()=>0.001; setTimeout(()=>{ Math.random=r0; }, 1500); }   // the chance is 95%: make it certain so the test isn't a coin toss
  await B(232922,'cum laynie'); out('I caught ->', !!P(221397).preg, '| ask:', lastTo(221397).slice(0,70));
  P(221397).preg.due=Date.now()-1000; n=sent.length; W.__pt(); await wait(2500); out('L labour ->', !!P(221397).labour, ems(n).join(' / ').slice(0,100));
  P(221397).labour.until=Date.now()-1; n=sent.length; W.__pt(); await wait(2500); out('L birth ->', ems(n).join(' / ').slice(0,120));
  await B(232922,'penis draconic'); await B(221397,'eggs on'); W.__cfg.EGG_CHANCE=1; P(232922).semen=60; P(221397).preg=null;
  n=sent.length; await B(232922,'cum laynie'); out('E clutch ->', JSON.stringify(P(221397).eggs&&P(221397).eggs.n), ems(n).filter(x=>x.includes('egg')).join('').slice(0,80));
  P(221397).eggs.layAt=Date.now()-1; n=sent.length; W.__pt(); await wait(2500); out('E lay ->', ems(n).join(' / ').slice(0,100));
  // N titles
  P(221397).totals.milked=100000; n=sent.length; W.__pt(); await wait(2500); out('N title ->', ems(n).join(' / ').slice(0,100));
  // J quota: Moo is livestock cow
  await B(500,'milkable on'); await B(500,'stats'); const mp=P(500); mp.seenDay='2000-01-01'; mp.seenMin={day:'2000-01-01',min:90}; mp.mday={day:'2000-01-01',ml:10};
  L().quotaDay='2000-01-01'; n=sent.length; W.__qt(); await wait(2500); out('J quota miss ->', L().people[500].naughtyMarks, ems(n).join(' / ').slice(0,90));
  // from the live recording: a short visit (or the day they signed up) never earns a naughty mark
  { const before=L().people[500].naughtyMarks||0;
    mp.seenDay='2000-01-02'; mp.seenMin={day:'2000-01-02',min:10}; mp.mday={day:'2000-01-02',ml:0};
    L().quotaDay='2000-01-02'; W.__qt();
    out('J short visit: no mark ->', (L().people[500].naughtyMarks||0)===before);
    mp.seenDay='2000-01-03'; mp.seenMin={day:'2000-01-03',min:300}; mp.mday={day:'2000-01-03',ml:0}; const reg=L().people[500].registeredAt; L().people[500].registeredAt=Date.parse('2000-01-03T12:00:00Z');
    L().quotaDay='2000-01-03'; W.__qt(); L().people[500].registeredAt=reg;
    out('J the day they signed up: no mark ->', (L().people[500].naughtyMarks||0)===before); }
  await B(221397,'stats'); out('STATS\n'+sent.filter(s=>s[1].Type==='Whisper'&&s[1].Target===221397).slice(-2).map(s=>s[1].Content).join('\n'));
  process.exit(0);
})();
