// Map rooms: players only see the bot's emotes when the bot is in sight, and only get its whispers within
// 1 tile, unless they're out-of-character. So lines about someone go privately (whispers start with "(") to
// the people near them and the bot stays put; belly rubs (game actions AND typed emotes) answer back; and the
// old walk-over-and-home behaviour still works with CFG.SPEAKER_MODE "walk".
const fs=require('fs');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,life:{feedingOn:false,curfewOn:false},people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR","LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],spots:{home:{X:1,Y:1}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(500,21,20),at(600,30,5)];
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,500]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(require('path').join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const C=mn=>chars.find(c=>c.MemberNumber===mn);
const near=(p,q,r)=>Math.max(Math.abs(p.X-q.X),Math.abs(p.Y-q.Y))<=r;
// in order since k: was the bot moved next to (x,y) before the first emote that matches?
function walkedThenEmoted(k, pos, rx){
  let moved=null;
  for (const [ev,d] of sent.slice(k)){
    if (ev==='ChatRoomCharacterMapDataUpdate') moved=d.Pos;
    if (d && d.Type==='Emote' && rx.test(d.Content)) return !!(moved && near(moved,pos,2));
  }
  return false;
}
(async()=>{ await wait(3500);
  C(221397).Name='Laynie'; C(500).Name='Moo'; C(600).Name='Hana';
  const P=mn=>L().people[mn].prod;
  // Laynie's carryin'
  const p=P(221397)||(handlers.AccountBeep({MemberNumber:221397,Message:'stats'}),await wait(5300),P(221397));
  P(221397).preg={due:Date.now()+86400000,sires:[500],at:Date.now()};
  // 1. Moo rubs Laynie's belly with the game's own action: the bot walks over first, then the room sees the kick
  let k=sent.length;
  handlers.ChatRoomMessage({Sender:500,Type:'Activity',Content:'ChatOther-ItemPelvis-Rub',Dictionary:[{SourceCharacter:500},{TargetCharacter:221397},{FocusGroupName:'ItemPelvis'},{ActivityName:'Rub'}]});
  await wait(1500);
  // nobody here has the Companion, so lines about Laynie go privately to the people near her; the bot stays put
  const priv=(k0,mn,rx)=>sent.slice(k0).some(([e,d])=>d&&d.Type==='Whisper'&&d.Target===mn&&d.Content.startsWith('(')&&rx.test(d.Content));
  const moved=k0=>sent.slice(k0).some(([e])=>e==='ChatRoomCharacterMapDataUpdate');
  out('1 game action: the kick reaches Moo (right beside her) privately ->', priv(k,500,/kicks|flutters/), priv(k,221397,/kicks|flutters/));
  out('1 ...and the bot never moves ->', !moved(k));
  // 2. Moo types it instead
  P(221397).rubAt=0; k=sent.length;
  handlers.ChatRoomMessage({Sender:500,Type:'Emote',Content:'presses close against Laynie, rubbing her round belly'}); await wait(1500);
  out('2 typed emote counts as a belly rub ->', priv(k,500,/kicks|flutters/));
  P(221397).rubAt=0; k=sent.length;
  handlers.ChatRoomMessage({Sender:500,Type:'Activity',Content:'ChatOther-ItemTorso-Grope',Dictionary:[{SourceCharacter:500},{TargetCharacter:221397},{FocusGroupName:'ItemTorso'},{ActivityName:'Grope'}]});
  await wait(1500);
  out('2 grope counts too ->', priv(k,500,/kicks|flutters/));
  out('2 Hana, far away, does not get it ->', !priv(k,600,/kicks|flutters/));
  // 3. a whisper to someone far away (Hana isn't a friend) is out-of-character, so it gets through
  k=sent.length; handlers.ChatRoomMessage({Sender:600,Type:'Whisper',Content:'stats',Target:260239}); await wait(5300);
  const wh=sent.slice(k).filter(([e,d])=>d&&d.Type==='Whisper'&&d.Target===600).map(([e,d])=>d.Content);
  out('3 map-room whispers start with ( and never close it ->', wh.length>0 && wh.every(c=>c.startsWith('(')&&!c.includes(')')));
  // 4. safeword: the pause reaches them privately at once, without the bot jumping over
  k=sent.length; handlers.ChatRoomMessage({Sender:600,Type:'Chat',Content:'?safe'}); await wait(2000);
  out('4 safeword pause reaches them ->', priv(k,600,/PAUSE CALLED/), !moved(k));
  // 5. the old way still works if the farm wants it: CFG.SPEAKER_MODE "walk"
  W.__cfg.SPEAKER_MODE='walk'; P(221397).rubAt=0; k=sent.length;
  handlers.ChatRoomMessage({Sender:500,Type:'Activity',Content:'ChatOther-ItemPelvis-Rub',Dictionary:[{SourceCharacter:500},{TargetCharacter:221397},{FocusGroupName:'ItemPelvis'},{ActivityName:'Rub'}]});
  await wait(1500);
  out('5 walk mode: bot walks to Laynie, then the kick emote ->', walkedThenEmoted(k, C(221397).MapData.Pos, /kicks|flutters/));
  W.__cfg.HOME_AFTER_S=0; k=sent.length; W.__ht(); await wait(800);
  const back=sent.slice(k).filter(([e])=>e==='ChatRoomCharacterMapDataUpdate').map(([e,d])=>d.Pos).pop()||{};
  out('5 and walks back to its home tile ->', back.X===1 && back.Y===1);
  process.exit(0);
})();
