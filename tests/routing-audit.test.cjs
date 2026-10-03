// Where every kind of message lands. Each line checks the exact route:
//   BEEP (account beep), WHISPER (private), HIDDEN (to their Companion), CHAT/EMOTE (the whole room).
// People: Laynie (proprietor, friend, Companion), Rex (herdmaster, friend, no Companion),
// Hana (stock, NOT a friend, no Companion), Moo (stock, friend, Companion), Faye (away in another room, friend).
const fs=require('fs');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "700":{mn:700,name:"Rex",roles:["HERDMASTER"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "166990":{mn:166990,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:700,type:"perm",at:1}],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:700,type:"perm",at:1}],tempKeys:[],cover:[]},
 "900":{mn:900,name:"Faye",roles:["LIVESTOCK"],species:"pony",onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,0,0),at(221397,10,10),at(700,5,5),at(166990,3,3),at(500,8,8)];
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,700,500,900]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:(...a)=>process.stdout.write('WARN '+a.join(' ')+'\n')};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(require('path').join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const C=mn=>chars.find(c=>c.MemberNumber===mn);
const PEN={Asset:{Name:'Penis',Group:{Name:'Pussy'}}};
// the routes something took to one person (or the whole room) since mark k
function routes(k, mn){
  const r=new Set();
  for (const [ev,d] of sent.slice(k)){
    if (ev==='AccountBeep'){ if (d.MemberNumber===mn) r.add('BEEP'); continue; }
    if (!d) continue;
    if (d.Type==='Whisper' && d.Target===mn) r.add('WHISPER');
    if (d.Type==='Hidden' && d.Content==='FarmhandMsg' && d.Target===mn) r.add('HIDDEN');
    if (d.Type==='Chat' && !d.Target) r.add('CHAT');
    if (d.Type==='Emote' && !d.Target) r.add('EMOTE');
  }
  return [...r].sort().join('+')||'none';
}
const textTo=(k,mn)=>sent.slice(k).filter(([ev,d])=>(ev==='AccountBeep'&&d.MemberNumber===mn)||(d&&d.Target===mn&&(d.Type==='Whisper'||d.Type==='Hidden'))).map(([ev,d])=>d.Message||d.Content+' '+JSON.stringify(d.Dictionary||'')).join(' | ');
const chatEm=k=>sent.slice(k).filter(([ev,d])=>d&&!d.Target&&(d.Type==='Chat'||d.Type==='Emote')).map(([ev,d])=>d.Content).join(' | ');
const expect=(label, got, want)=>out(label+' -> '+(got===want)+' ('+got+(got===want?'':' · wanted '+want)+')');
const B=async(mn,msg)=>{handlers.AccountBeep({MemberNumber:mn,Message:msg});await wait(5200);};
const SAY=async(mn,msg,type='Chat',target)=>{handlers.ChatRoomMessage({Sender:mn,Type:type,Content:msg,Target:target});await wait(5200);};
const BOT=async(mn,msg)=>{handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'ChatRoomBot '+msg});await wait(5200);};
const FM=async(mn,d)=>{handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,...d}});await wait(1500);};
(async()=>{ await wait(3500);
  C(221397).Name='Laynie'; C(700).Name='Rex'; C(166990).Name='Hana'; C(500).Name='Moo';
  C(700).Appearance=[PEN]; C(166990).Appearance=[{Asset:{Name:'Pussy2',Group:{Name:'Pussy'}}}]; C(500).Appearance=[{Asset:{Name:'Pussy2',Group:{Name:'Pussy'}}}];
  await FM(221397,{type:'hello',ver:'0.4.0'}); await FM(500,{type:'hello',ver:'0.4.0'});
  let k;

  // A. answers go back the way they should, for folks without the Companion
  k=sent.length; await SAY(700,'?weather');     expect('A1 room ?weather from a friend → beep', routes(k,700), 'BEEP');
  k=sent.length; await SAY(166990,'?ping');     expect('A2 room ?ping from a non-friend → said in chat (ping is meant to be public)', chatEm(k).includes('Right here')&&!routes(k,166990).includes('WHISPER'), true);
  k=sent.length; await SAY(166990,'?record');   expect('A3 private ?record in room chat → whisper, never chat', routes(k,166990)+(/RECORD|record/i.test(chatEm(k))?'+LEAKED':''), 'WHISPER');
  k=sent.length; await SAY(166990,'stats','Whisper',260239); expect('A4 whispered stats → whisper back', routes(k,166990), 'WHISPER');
  k=sent.length; await BOT(700,'ping');         expect('A5 /bot from a friend → beep', routes(k,700), 'BEEP');
  k=sent.length; await BOT(166990,'ping');      expect('A6 /bot from a non-friend → whisper', routes(k,166990), 'WHISPER');
  k=sent.length; await B(900,'ping');           expect('A7 beep from another room → beep', routes(k,900), 'BEEP');
  k=sent.length; await B(700,'help me');        out('A8 long beep answers are cut to size -> '+sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===700).every(([e,d])=>d.Message.length<=900));

  // B. Companion users get it all in their panel, no beeps or whispers
  k=sent.length; await FM(500,{type:'cmd',text:'stats'}); await wait(4000); expect('B1 Companion command → panel', routes(k,500), 'HIDDEN');
  k=sent.length; await B(500,'ping');           expect('B2 Companion user beeps from the room → panel', routes(k,500), 'HIDDEN');

  // C. yes/no questions
  L().people[166990].breedable=true; L().people[166990].fertile=true; await B(500,'breedable on');   // Hana never beeps, so she stays a non-friend
  k=sent.length; await B(700,'breed hana');     expect('C1 breed ask, non-friend, no Companion → whisper', routes(k,166990), 'WHISPER');
  out('C1 …and it says what to answer -> '+/Say yes or no/.test(textTo(k,166990)));
  await SAY(166990,'yes','Whisper',260239);
  k=sent.length; await B(700,'breed moo');      expect('C2 breed ask to a Companion user → panel only', routes(k,500), 'HIDDEN');
  out('C2 …as a yes/no card -> '+/"type":"ask"/.test(textTo(k,500)));

  // D. staff lookups
  k=sent.length; await B(700,'vet moo');        expect('D1 lookup by staff without Companion → normal beep', routes(k,700), 'BEEP');
  k=sent.length; await FM(221397,{type:'cmd',text:'vet moo'}); await wait(4000);
  expect('D2 lookup by staff with Companion → panel', routes(k,221397), 'HIDDEN'); out('D2 …as an Office doc -> '+/"type":"doc"/.test(textTo(k,221397)));

  // E. things the room should see are emotes; private things never are
  L().jars=[{id:4,ml:20,stud:700,t:Date.now()}];
  k=sent.length; await B(700,'inseminate hana 4'); await SAY(166990,'yes','Whisper',260239);
  out('E1 jar insemination is a public emote -> '+/fills the syringe/.test(chatEm(k)));
  k=sent.length; await B(700,'summon hana');    out('E2 summon moves them and tells them privately -> '+sent.slice(k).some(([e,d])=>d&&d.Content==='ChatRoomMapViewTeleport'&&d.Target===166990)+' '+routes(k,166990));
  L().people[166990].hypno=true; await B(700,'voice add hana Quiet now, %name%.'); await B(700,'voice on hana');
  W.__st().voiceNext=new Map([[166990,1]]); k=sent.length; W.__vt(); await wait(800);
  expect('E3 voice line, no Companion → whisper to them only', routes(k,166990)+(/Quiet now/.test(chatEm(k))?'+LEAKED':''), 'WHISPER');
  k=sent.length; await FM(500,{type:'outfitAnswer',answer:'worn',slot:'cow|*',locks:1});
  out('E4 putting on a farm outfit is a public emote -> '+/padlocks click shut/.test(chatEm(k)));
  await FM(221397,{type:'outfitSave',slot:'cow|*',data:'X',items:3,locks:1}); k=sent.length; await B(700,'outfit offer hana');
  out('E5 outfit offer to someone without the Companion is refused politely -> '+/isn't runnin' the Companion/.test(textTo(k,700)));

  // F. contracts: the offer goes only to them; the notice to them is private
  k=sent.length; await B(700,'contract offer fun hana 1h');
  out('F1 BC+ offer is hidden and only to Hana -> '+sent.slice(k).some(([e,d])=>d&&d.Content==='BCP'&&d.Target===166990)+' '+!sent.slice(k).some(([e,d])=>d&&d.Content==='BCP'&&!d.Target));
  expect('F1 …and she\'s told privately', routes(k,166990), 'WHISPER');

  // G. safety
  k=sent.length; await SAY(166990,'?safe');
  out('G1 safeword: the room hears the pause -> '+/PAUSE CALLED/.test(chatEm(k)));
  out('G1 …staff are told (Rex by beep, Laynie in her panel) -> '+routes(k,700).includes('BEEP')+' '+routes(k,221397).includes('HIDDEN'));
  out('G1 …and nothing was released -> '+!sent.slice(k).some(([e,d])=>d&&d.Content==='BCP'&&d.Dictionary&&d.Dictionary.message==='ContractCommand'));
  k=sent.length; await B(900,'safe');           out('G2 safeword from another room → told to use the club safeword -> '+/farm office only covers the farm/.test(textTo(k,900)));
  k=sent.length; await BOT(166990,'stuck');     out('G3 /bot stuck works -> '+/help|hand/i.test(textTo(k,166990)+chatEm(k)));
  process.exit(0);
})();
