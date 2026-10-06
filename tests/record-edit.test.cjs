// Asked for: the proprietors can fix anybody's record (name, species, application answers...) when an
// applicant made a mistake or wants a change. Only proprietors; a name set this way sticks through greetings.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "700":{mn:700,name:"Hand",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "900":{mn:900,name:"Daisy",roles:["LIVESTOCK"],species:"kitty",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"no blood",
        application:{at:1,staffTrack:false,answers:["Daisy","livestock","kitty","1 week","deep","milkin","nothin","no blood","ask first","loud noises","cuddles","thanks"]}}
},applications:[{id:"x",mn:900,name:"Daisy",at:1,staffTrack:false,answers:[],byKey:{name:"Daisy",species:"kitty"}}],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221397,700,900].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:W.Player.FriendList.map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,700,900]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const B=async(mn,msg)=>{handlers.AccountBeep({MemberNumber:mn,Message:msg});await wait(5200);};
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const since=(mn,n)=>sent.slice(n).filter(s=>(s[0]==='AccountBeep'&&s[1].MemberNumber===mn)||(s[1]&&s[1].Type==='Whisper'&&s[1].Target===mn)).map(s=>s[1].Message||s[1].Content).join(' | ');
(async()=>{ await wait(3500);
  const D=()=>L().people[900];
  let n=sent.length; await B(700,'?edit 900 species cow');
  ok(/just for the proprietors/.test(since(700,n)) && D().species==='kitty', 'a farmhand cannot edit records');
  n=sent.length; await B(221397,'?edit 900');
  ok(/EDIT/.test(since(221397,n)) && /species: kitty/.test(since(221397,n)) && /app\.likes/.test(since(221397,n)), '?edit <who> shows what is on file and what can change');
  await B(221397,'?edit 900 species a bunny');
  ok(D().species==='bunny' && D().application.byKey.species==='bunny', 'species changed, on the record and the kept application');
  await B(221397,'?edit 900 name Daisy Mae');
  ok(D().name==='Daisy Mae' && D().nameSet==='Daisy Mae', 'name changed');
  W.__st().greeted && W.__st().greeted.delete && W.__st().greeted.delete(900);
  ok(W.FarmhandLedger && L().people[900].name==='Daisy Mae', 'the set name sticks');
  await B(221397,'?edit 900 gender futa');
  ok(D().gender==='futa' && D().futa===true, 'gender changed (futa on)');
  n=sent.length; await B(221397,'?edit 900 gender girl');
  ok(/female, male, futa or femboy/.test(since(221397,n)) && D().gender==='futa', 'a gender that is not one of the four is refused');
  await B(221397,'?edit 900 stay 2 weeks'); await B(221397,'?edit 900 depth no human left');
  ok(D().stayType && D().wantDepth==='nhl' || D().wantDepth, 'stay and depth changed ('+D().stayType+', '+D().wantDepth+')');
  await B(221397,'?edit 900 limits no blood, no needles');
  ok(D().limits==='no blood, no needles' && D().application.byKey.limits==='no blood, no needles', 'hard limits changed on both');
  await B(221397,'?edit 900 app.likes milkin and the pens');
  ok(D().application.byKey.likes==='milkin and the pens', 'an application answer changed');
  ok(L().applications[0].byKey.likes==='milkin and the pens', 'the pending application changes too');
  await B(221397,'?edit 900 triggers clear');
  ok(D().triggers==='', 'clear empties a field');
  await B(221397,'?edit 900 name clear');
  ok(!D().nameSet && D().name==='N900', 'clearing the name goes back to their game name');
  ok(L().log.some(e=>e.action==='EDIT'||/EDIT/.test(JSON.stringify(e))), 'edits are in the audit log');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
