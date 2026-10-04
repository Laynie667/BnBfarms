// The bot using each player's Companion (v0.10): leading instead of teleporting (and teleporting after all
// when they can't walk), private lines to exactly who can see them, faces and sounds, scene lines from the one
// acting, orgasms and edges counted from the game's own room messages, visible consent, ambient pair moments.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true,jarok:true,breedable:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"home":{X:12,Y:12}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(500,5,5),at(600,30,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,500]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const realTimeout=setTimeout, wait=ms=>new Promise(r=>realTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
// wait till the bot's send queue is empty (it paces messages), plus the 5 s per-person command gap
const drain=async(min)=>{ await wait(min||300); for(let i=0;i<400;i++){ const s=W.__st(); if(!s.queue.length&&!s.urgent.length&&!s.sending) break; await wait(100);} await wait(200); };
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const toWhom=(k,mn)=>sent.slice(k).filter(([e,d])=>d&&d.Target===mn&&(d.Type==='Whisper'||d.Type==='Hidden')).map(([e,d])=>d.Content);
const beepsTo=(k,mn)=>sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===mn).map(([e,d])=>d.Message);
(async()=>{ await wait(3500);
  chars[1].Name='Laynie'; chars[2].Name='Moo'; chars[3].Name='Hana';
  const FM=(mn,d)=>handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,...d}});
  const hid=(k,mn,type)=>sent.slice(k).filter(([e,d])=>d&&d.Type==='Hidden'&&d.Target===mn&&d.Dictionary&&d.Dictionary.type===type).map(([e,d])=>d.Dictionary);
  const tele=(k,mn)=>sent.slice(k).filter(([e,d])=>d&&d.Content==='ChatRoomMapViewTeleport'&&d.Target===mn).length;
  FM(500,{type:'hello',ver:'0.10.0',relay:true,off:{}}); FM(221397,{type:'hello',ver:'0.10.0',relay:true,off:{}}); await drain(1200);
  // 1. leading: ?spot go home walks Moo there instead of teleporting
  let k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'stats'}); await drain(600);
  L().people[500].roles.push('HERDMASTER');
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'spot go home'}); await drain(1500);
  const ld=hid(k,500,'lead');
  ok(ld.length===1 && ld[0].X===12 && !tele(k,500), 'Moo is led home on foot, not teleported');
  // their Companion says it can't: teleported after all
  k=sent.length; FM(500,{type:'leadNo',id:ld[0].id}); await drain(600);
  ok(tele(k,500)===1, 'when the Companion can\'t walk them, the bot teleports after all');
  // never arrives: teleported after 90 s
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'spot go home'}); await drain(1200);
  for (const l of W.__st().leads.values()) l.at-=95000; W.__leadTick(); await drain(400);
  ok(tele(k,500)===1, 'a lead that never arrives turns into a teleport');
  // switched off: plain teleport
  FM(500,{type:'hello',ver:'0.10.0',relay:true,off:{lead:true}}); await drain(600);
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'spot go home'}); await drain(1200);
  ok(!hid(k,500,'lead').length && tele(k,500)===1, 'with "lead me" switched off, it\'s a teleport');
  L().people[500].roles=L().people[500].roles.filter(r=>r!=='HERDMASTER');
  // 2. sight: Moo (relay off) reports Hana can see her and Laynie can only hear: an emote about Moo goes to Hana privately
  FM(500,{type:'hello',ver:'0.10.0',relay:false,off:{}}); FM(500,{type:'sight',see:[600],hear:[600,221397]}); await drain(600);
  chars[3].MapData.Pos={X:30,Y:30};   // far by distance, but Moo's Companion says Hana can see her
  var P=(mn)=>L().people[mn].prod; P(500).rubAt=0;
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'notice'}); await drain(300);
  k=sent.length; W.__addons('noop');
  // ask the bot to say something about Moo the way any farm line would
  handlers.ChatRoomMessage({Sender:500,Type:'Activity',Content:'OrgasmFailSurrender0',Dictionary:[{SourceCharacter:500}]}); await drain(800);
  const priv=(mn)=>sent.slice(k).some(([e,d])=>d&&d.Target===mn&&(d.Type==='Whisper'||(d.Type==='Hidden'&&d.Dictionary.type==='roomline')));
  ok(priv(600) && !priv(221397), 'a line about Moo goes privately to Hana (who Moo can see), not Laynie (who can only hear her)');
  // 3. scene: faces and sounds go to Moo, and lines Laynie starts are posted by Laynie
  FM(500,{type:'hello',ver:'0.10.0',relay:true,off:{}}); await drain(400);
  P(500).milk=5000; global.setTimeout=(f,ms,...a)=>realTimeout(f, ms>=10000&&ms<=30000?20:ms, ...a);
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'milk Moo 300'}); await drain(2000);
  ok(hid(k,500,'face').some(f=>f.mood==='milked') && hid(k,500,'sound').length>0, 'Moo gets a face and a sound for her milking');
  const byLaynie=hid(k,221397,'relay'), byMoo=hid(k,500,'relay');
  ok(byLaynie.length>=1 && byLaynie.every(r=>/^\S*\s*Laynie/.test(r.text)), 'lines Laynie starts are posted by Laynie ('+byLaynie.length+')');
  ok(byMoo.length>=1, '...and the rest by Moo ('+byMoo.length+')');
  global.setTimeout=realTimeout;
  // 4. orgasms and edges from the game's own messages
  P(500).vEdges=0; P(500).vEdgeAt=0;
  handlers.ChatRoomMessage({Sender:500,Type:'Activity',Content:'OrgasmResist4',Dictionary:[{SourceCharacter:500}]}); await drain(400);
  ok(P(500).vEdges===1 && P(500).climax.edged===1, 'a resisted orgasm counts as an edge');
  P(500).milk=4000; const m0=P(500).milk;
  k=sent.length; handlers.ChatRoomMessage({Sender:500,Type:'Activity',Content:'Orgasm3',Dictionary:[{SourceCharacter:500}]}); await drain(600);
  ok(P(500).climax.came===1 && P(500).milk<m0, 'an orgasm is counted, and her milk lets down');
  ok(hid(k,500,'face').some(f=>f.mood==='afterglow'), 'with an afterglow face');
  handlers.ChatRoomMessage({Sender:500,Type:'Activity',Content:'OrgasmFailTimeout1',Dictionary:[{SourceCharacter:500}]}); await drain(400);
  ok(P(500).climax.ruined>=2, 'a ruined one is counted too');
  // bred recently and it didn't take: cumming gives it one more chance
  L().people[500].fertile=true; P(500).preg=null; P(500).lastFill={at:Date.now(),stud:600,ml:40};
  const rnd=Math.random; Math.random=()=>0.01;
  handlers.ChatRoomMessage({Sender:500,Type:'Activity',Content:'Orgasm1',Dictionary:[{SourceCharacter:500}]}); await drain(400);
  Math.random=rnd;
  ok(!!P(500).preg && P(500).lastFill.rerolled, 'cumming right after being bred can make it take');
  // 5. visible consent: a yes to a jar shows as an emote from them
  L().jars=[{id:9,stud:500,ml:20,t:Date.now()}]; chars[3].MapData.Pos={X:6,Y:6};
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'inseminate Hana 9 butt'}); await drain(1200);
  handlers.ChatRoomMessage({Sender:600,Type:'Whisper',Content:'yes',Target:260239}); await drain(1500);
  ok(sent.slice(k).some(([e,d])=>d&&/Hana (nods|flushes|presents)/.test(String((d.Dictionary&&d.Dictionary.text)||d.Content||''))), 'saying yes shows as a little emote from Hana');
  // 6. ambient: two animals close together share a moment
  chars[2].MapData.Pos={X:5,Y:5}; chars[3].MapData.Pos={X:6,Y:5}; W.__st().ambientAt=0; W.__st().sceneRun.clear();
  k=sent.length; W.__ambient(); await drain(600);
  const amb=sent.slice(k).map(([e,d])=>String((d&&((d.Dictionary&&d.Dictionary.text)||d.Content))||'')).filter(s=>/Moo/.test(s)&&/Hana/.test(s));
  ok(amb.length>=1, 'an ambient moment names both of them');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
