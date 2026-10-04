// Farm emotes from the people they're about: a line about someone with the Companion (v0.9+) is handed to
// their Companion to post as their own emote; if they refuse it goes privately to the people near them; with
// no Companion it's whispered to whoever's near; the bot never walks over; and chat lines carry no emojis.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[],breedable:true,fertile:true,degradeMe:true},
 "600":{mn:600,name:"Hana",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"glory-1":{X:5,Y:5},"glory-1-visitor":{X:5,Y:6}}});
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
  chars[3].MapData.Pos={X:6,Y:6};   // Hana stands next to Moo
  const FM=(mn,d)=>handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,...d}});
  const moves=k=>sent.slice(k).filter(([e])=>e==='ChatRoomCharacterMapDataUpdate').length;
  const relaysTo=(k,mn)=>sent.slice(k).filter(([e,d])=>d&&d.Type==='Hidden'&&d.Target===mn&&d.Dictionary&&d.Dictionary.type==='relay').map(([e,d])=>d.Dictionary);
  // Moo has a v0.9 Companion
  FM(500,{type:'hello',ver:'0.9.0',relay:true}); await drain(1200);
  let k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'stats'}); await drain(1200);
  L().people[500].prod.milk=5000;
  global.setTimeout=(f,ms,...a)=>realTimeout(f, ms>=10000&&ms<=30000?20:ms, ...a);
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'milk Moo 300'}); await drain(2000);
  const r=relaysTo(k,500);
  ok(r.length>=4 && r.every(x=>/Moo/.test(x.text)), 'the milking scene is handed to Moo\'s Companion to post as Moo\'s emote ('+r.length+')');
  ok(!sent.slice(k).some(([e,d])=>d&&d.Type==='Emote'), 'the bot posts no room emote itself');
  ok(moves(k)===0, 'and the bot never moves');
  // Moo's Companion refuses one: it goes privately to the people near Moo
  k=sent.length; FM(500,{type:'relayNo',id:r[0].id}); await drain(600);
  ok(sent.slice(k).some(([e,d])=>d&&d.Type==='Whisper'&&d.Target===600&&/^\(\*/.test(d.Content)), 'a refused one is whispered to Hana, who is near Moo');
  // Moo turns relaying off: lines about Moo go privately to people near instead
  FM(500,{type:'hello',ver:'0.9.0',relay:false}); await drain(800);
  L().people[500].prod.milk=5000; await wait(5200);
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'milk Moo 300'}); await drain(2000);
  ok(!relaysTo(k,500).length && sent.slice(k).some(([e,d])=>d&&d.Type==='Whisper'&&d.Target===600), 'with the switch off, nothing is posted as Moo; Hana gets it privately');
  ok(moves(k)===0, 'still no walking over');
  // an old Companion (v0.8) never gets asked
  FM(500,{type:'hello',ver:'0.8.0',relay:true}); await drain(800);
  L().people[500].prod.milk=5000; await wait(5200);
  k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'milk Moo 300'}); await drain(2000);
  ok(!relaysTo(k,500).length, 'an older Companion is never asked to post');
  // no emojis in anything that lands in chat
  const chatty=sent.filter(([e,d])=>(e==='ChatRoomChat'&&d&&d.Type!=='Hidden')||e==='AccountBeep').map(([e,d])=>e==='AccountBeep'?d.Message:d.Content);
  const withEmoji=chatty.filter(s=>/\p{Extended_Pictographic}/u.test(s));
  ok(!withEmoji.length, 'no emojis in chat or beeps ('+withEmoji.slice(0,2).join(' | ')+')');
  ok(relaysTo(0,500).length>0, 'relay texts may still carry them (the Companion strips them before posting)');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
