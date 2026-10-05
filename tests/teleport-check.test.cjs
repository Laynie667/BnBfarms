// From the live recording: a summon's teleport was dropped and only the second ?summon worked. The bot now
// checks the person arrived and sends the teleport once more if not; somebody who did arrive gets no repeat.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "260055":{mn:260055,name:"Sirena",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:221397,type:"perm",since:1}],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,35,28),at(260055,14,27),at(500,10,10)];
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const tps=(k,mn)=>sent.slice(k).filter(([e,d])=>d&&d.Content==='ChatRoomMapViewTeleport'&&d.Target===mn).length;
(async()=>{ await wait(3500);
  chars[1].Name='Laynie'; chars[2].Name='Sirena'; chars[3].Name='Moo';
  // the game drops it: Sirena never moves
  let k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'summon 260055'}); await wait(2000);
  ok(tps(k,260055)===1, 'summon sends the teleport');
  await wait(12500);
  ok(tps(k,260055)===2, "it didn't take: sent once more");
  await wait(12500);
  ok(tps(k,260055)===2, '...and only once more');
  // Moo arrives: no repeat
  await wait(5200); k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'summon 500'}); await wait(1500);
  const d=sent.slice(k).find(([e,d])=>d&&d.Content==='ChatRoomMapViewTeleport'&&d.Target===500);
  const p=d&&d[1].Dictionary[0].Position; if (p) chars[3].MapData.Pos={X:p.X,Y:p.Y};
  await wait(12500);
  ok(tps(k,500)===1, 'someone who arrived gets no second teleport');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
