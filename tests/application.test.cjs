// ?apply asks for real species, gender, length and depth (and asks again on a wrong answer);
// ?approve sets them up and gets the contract they asked for ready.
const fs=require('fs');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "700":{mn:700,name:"Rex",roles:["HERDMASTER"],onDuty:true,herd:null,tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221397,700,900].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,700,900]},
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
const toSince=(mn,n)=>sent.slice(n).filter(s=>(s[0]==='AccountBeep'&&s[1].MemberNumber===mn)).map(s=>s[1].Message).join(' | ');
(async()=>{ await wait(3500);
  chars.find(c=>c.MemberNumber===900).Name='Daisy';
  await B(900,'apply'); await wait(2000);
  await B(900,'Daisy, ma\'am please'); await B(900,'livestock');
  let n=sent.length; await B(900,'dragon');
  out('1 unknown animal asked again ->', /don't know that animal/.test(toSince(900,n)), /what kind of animal/i.test(toSince(900,n)));
  await B(900,'goat');
  n=sent.length; await B(900,'girl');
  out('2 wrong gender asked again ->', /female, male, futa or femboy/.test(toSince(900,n)));
  await B(900,'femboy');
  n=sent.length; await B(900,'a fortnight');
  out('3 length understood ->', !/Pick one/.test(toSince(900,n)));
  await B(900,'deep');
  for (const a of ['milkin','nothin','no blood','ask first','loud noises','cuddles','thank you']) await B(900,a);
  const app=(L().applications||[]).find(a=>a.mn===900)||{};
  out('4 saved by key ->', app.byKey && app.byKey.species==='goat' && app.byKey.gender==='femboy' && app.byKey.stay==='2w' && app.byKey.depth==='deep');
  await B(700,'queue'); out('4 queue shows the picks ->', /goat • femboy • 2w • deep/.test(lastTo(700)));
  await B(221397,'approve 900 livestock');
  const r=L().people[900]||{};
  out('5 approve sets species, gender, triggers ->', r.species==='goat', r.gender==='femboy', r.triggers==='loud noises');
  out('5 contract ready for staff ->', /contract offer deep 900 2w/.test(lastTo(221397)), (L().contracts||[]).some(x=>x.mn===900&&x.status==='prepared'));
  await B(700,'contract offer deep 900 2w');
  const mine=(L().contracts||[]).filter(x=>x.mn===900);
  out('6 offering uses the prepared one ->', mine.length===1 && mine[0].status==='offered');
  const offer=sent.filter(s=>s[1]&&s[1].Content==='BCP'&&s[1].Target===900).map(s=>s[1].Dictionary.payload)[0]||{};
  out('6 goat sounds in their contract ->', offer.rules&&offer.rules['pet.speech'].settings.animal==='Custom' && offer.rules['pet.speech'].settings.sounds.includes('maa'));
  await B(900,'gender futa'); out('7 ?gender futa ->', L().people[900].gender==='futa' && L().people[900].futa===true);
  process.exit(0);
})();
