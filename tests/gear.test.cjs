// Milking gear: pumps and the vendor milk at matching rates with emotes, stalls don't double-count,
// machines empty a loaded jar only after a yes, and a fitted funnel gag is an open target.
const fs=require('fs');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "700":{mn:700,name:"Rex",roles:["HERDMASTER"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],breedable:true,fertile:true,freeuse:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{milking1:{X:8,Y:8}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,0,0),at(221397,10,10),at(700,5,5),at(500,20,20),at(600,3,3)];
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,700,500,600]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(require('path').join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const B=async(mn,msg)=>{handlers.AccountBeep({MemberNumber:mn,Message:msg});await wait(5200);};
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const C=mn=>chars.find(c=>c.MemberNumber===mn);
const I=(g,a,prop,eff)=>({Asset:{Name:a,Description:a,Group:{Name:g},Effect:eff||[],Block:[]},Property:prop||{}});
const ems=n=>sent.slice(n).map(s=>roomText(s)).filter(Boolean).join(' | ');
// the last thing said TO them (room lines whispered to the people around, "(*…", don't count)
const lastTo=mn=>{const w=sent.filter(s=>(s[0]==='AccountBeep'&&s[1].MemberNumber===mn)||(s[1].Type==='Whisper'&&s[1].Target===mn&&!/^\(\*/.test(s[1].Content))).map(s=>s[1].Message||s[1].Content);return w[w.length-1]||'';};
// a line heard in the room: public, or (map rooms) privately to the people around: "(*…" whispers, Companion roomlines and relays
const roomText=s=>{ const d=s&&s[1]; if(!d) return null;
  if(!d.Target&&(d.Type==='Emote'||d.Type==='Chat')) return d.Content;
  if(d.Type==='Whisper'&&typeof d.Content==='string'&&/^\(\*/.test(d.Content)) return d.Content.slice(1);
  if(d.Type==='Hidden'&&d.Content==='FarmhandMsg'&&d.Dictionary&&(d.Dictionary.type==='roomline'||d.Dictionary.type==='relay')) return '*'+String(d.Dictionary.text).replace(/^\*/,'');
  return null; };
(async()=>{ await wait(3500);
  C(500).Name='Moo'; C(600).Name='Hana'; C(700).Name='Rex';
  C(600).Appearance=[I('Pussy','Pussy2')]; C(700).Appearance=[{Asset:{Name:'Penis',Group:{Name:'Pussy'}}}];
  const P=mn=>L().people[mn].prod;
  await B(500,'stats'); P(500).milk=2000;
  const tick=async()=>{ W.__gt(); await wait(1500); };   // room emotes go out through a paced queue
  // 1. BC Lactation Pump on High: 30 mL a minute → 10 mL per 20-second beat
  C(500).Appearance=[I('ItemNipples','LactationPump',{SuctionLevel:3,TypeRecord:{typed:3}})];
  P(500).gearNext=0; let n=sent.length, m0=P(500).milk; await tick();
  out('1 pump on High milks 10 mL a beat ->', Math.round(m0-P(500).milk)===10);
  out('1 with a public emote ->', /pump/.test(ems(n)) && /Moo/.test(ems(n)));
  C(500).Appearance=[I('ItemNipples','LactationPump',{SuctionLevel:0,TypeRecord:{typed:0}})]; m0=P(500).milk; await tick();
  out('1 pump Off milks nothin\' ->', P(500).milk===m0);
  // 2. Echo's portable pump: faster when aroused
  C(500).Appearance=[I('ItemTorso','便携乳泵',{TypeRecord:{s:0},Intensity:3})]; C(500).ArousalSettings={Progress:100};   // turned all the way up, and worked up
  m0=P(500).milk; await tick();
  out('2 Echo pump on high and worked up: 40 mL a minute ->', Math.round((m0-P(500).milk)*3)===40);
  C(500).Appearance[0].Property.Intensity=0; C(500).ArousalSettings={Progress:0}; m0=P(500).milk; await tick();   // lowest setting, calm
  out('2 …and 15 on low and calm ->', Math.round((m0-P(500).milk)*3)===15);
  C(500).Appearance=[I('ItemDevices','奶贩',{TypeRecord:{m:0}})]; m0=P(500).milk; await tick();
  out('2 milk vendor switched off: nothin\' ->', P(500).milk===m0);
  // 3. in a stall AND wearin' a pump: counted once
  C(500).Appearance=[I('ItemNipples','LactationPump',{SuctionLevel:4,TypeRecord:{typed:4}})]; C(500).MapData.Pos={X:8,Y:8};
  m0=P(500).milk; W.__ms(); await tick();
  out('3 stall + pump counts once (pump rate) ->', Math.round((m0-P(500).milk)*3)===40);
  // 4. capped teats stop the pump
  P(500).milkDeniedUntil=Date.now()+3600000; m0=P(500).milk; await tick();
  out('4 teats capped: no milkin\' ->', P(500).milk===m0); P(500).milkDeniedUntil=0;
  // 5. the machine and a loaded jar
  C(600).Appearance=[I('Pussy','Pussy2'), I('ItemDevices','FuckMachine',{Intensity:2})];
  L().jars=[{id:5,ml:25,stud:700,t:Date.now()}];
  n=sent.length; await B(700,'machine load hana 5');
  out('5 she\'s asked first ->', /load jar #5 into the machine/.test(lastTo(600)));
  out('5 nothin\' happens before her yes ->', !(P(600)&&P(600).held&&P(600).held.vulva>0));
  await B(600,'yes'); n=sent.length; await tick();
  out('5 on her yes, the machine starts its breeding scene ->', /loads the jar of .*seed into the .*reservoir/.test(ems(n)), P(600).held.vulva>0);
  out('5 jar used up ->', !(L().jars||[]).some(j=>j.id===5));
  out('5 machine emote while it runs ->', /fuck machine/.test(ems(n)));
  await B(600,'jarok off'); L().jars=[{id:6,ml:25,stud:700,t:Date.now()}];
  await B(700,'machine load hana 6'); out('5 never means never ->', /said never/.test(lastTo(700)));
  // 6. the funnel gag
  C(600).Appearance=[I('Pussy','Pussy2'), I('ItemMouth','FunnelGag',{TypeRecord:{typed:1},Effect:['BlockMouth']},['BlockMouth'])];
  P(700).semen=60; n=sent.length; await B(700,'cum hana mouth');
  out('6 a fitted funnel is a fine target ->', /down Hana's funnel gag/.test(ems(n)), !/blocked/.test(lastTo(700)));
  C(600).Appearance=[I('Pussy','Pussy2'), I('ItemMouth','BallGag',{},['BlockMouth'])];
  P(700).semen=60; n=sent.length; await B(700,'cum hana mouth');
  out('6 a ball gag still blocks ->', /blocked by/.test(lastTo(700)));
  // 7. the Companion sees the gear
  handlers.ChatRoomMessage({Sender:500,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'hello',ver:'0.5.0'}}); await wait(1500);
  n=sent.length; W.__sync(true); await wait(300);
  const st=(sent.slice(n).filter(s=>s[1]&&s[1].Target===500&&s[1].Dictionary&&s[1].Dictionary.type==='state').pop()||[0,{Dictionary:{}}])[1].Dictionary.state||{};
  out('7 state shows the pump ->', st.gear&&st.gear.milk&&st.gear.milk.name==='lactation pump'&&st.gear.milk.ml===40);
  process.exit(0);
})();
