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
global.console={...console,log:()=>{},warn:(...a)=>process.stdout.write('WARN '+a.join(' ')+'\n')};
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
  const typ=k=>sent.slice(k).filter(x=>x[0]!=='AccountQuery').map(x=>x[0]==='AccountBeep'?'BEEP':x[1].Type).join(',');
  let k=sent.length; await B(221397,'ping'); out('beep ping ->',typ(k));
  k=sent.length; handlers.ChatRoomMessage({Sender:221397,Type:'Hidden',Content:'ChatRoomBot health'}); await wait(5200); out('/bot health ->',typ(k));
  k=sent.length; handlers.ChatRoomMessage({Sender:166990,Type:'Hidden',Content:'ChatRoomBot ping'}); await wait(5200); out('/bot nonfriend ->',typ(k));
  W.__cfg.WHISPER_FIRST=true; k=sent.length; await B(221397,'ping'); out('whisperfirst ping ->',typ(k));
  W.__cfg.WHISPER_FIRST=false;
  // Farmhand Companion: hello, then commands and beeps come back as hidden FarmhandMsg
  const FM=(mn,d)=>handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:1,...d}});
  const hid=k=>sent.slice(k).filter(x=>x[1]&&x[1].Content==='FarmhandMsg');
  k=sent.length; FM(221397,{type:'hello',ver:'0.1.0'}); await wait(1500);
  out('companion welcome ->', hid(k).some(x=>x[1].Dictionary.type==='welcome'&&x[1].Target===221397));
  k=sent.length; FM(221397,{type:'cmd',text:'stats'}); await wait(5200);
  const rs=hid(k).filter(x=>x[1].Dictionary.type==='reply'&&x[1].Target===221397);
  out('companion stats reply ->', rs.length>0 && /LAYNIE|Laynie/i.test(rs.map(x=>x[1].Dictionary.text).join('')), 'no beep', !sent.slice(k).some(x=>x[0]==='AccountBeep'));
  k=sent.length; await B(221397,'ping'); out('companion beep cmd ->', typ(k), hid(k).length>0);
  k=sent.length; FM(221397,{type:'cmd',text:'help me'}); await wait(5200);
  const parts=hid(k).map(x=>x[1].Dictionary); out('companion long card parts ok ->', parts.length>0 && parts.every(d=>d.of===parts.length && d.text.length<=1800));
  k=sent.length; FM(166990,{type:'cmd',text:'ping'}); await wait(5200); out('nonfriend companion ->', hid(k).some(x=>x[1].Target===166990));
  // someone else can't fake a bot message, and a player who leaves gets beeps again
  const keep=chars.splice(chars.findIndex(c=>c.MemberNumber===221397),1);
  k=sent.length; await B(221397,'ping'); out('left room -> beep ->', typ(k)==='BEEP');
  chars.push(...keep);
  k=sent.length; FM(221397,{type:'bye'}); await B(221397,'ping'); out('after bye -> beep ->', typ(k)==='BEEP', typ(k));
  k=sent.length; await RP(221397,'Chat','?health'); await wait(2000); out('health shows companions ->', /Companions:/.test(sent.slice(k).map(x=>x[1].Content||x[1].Message||'').join('')));
  process.exit(0);
})();
