// Reported live: livestock got whispers that weren't meant for them. "BnB Cow Mira comes apart..." went to
// BnB CuntBitch and BnB Dog Nikto (they share "BnB"), and lines with "the" in them went to Eve the Kitt.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "164951":{mn:164951,name:"BnB Cow Mira",roles:["LIVESTOCK"],species:"cow",gender:"futa",futa:true,onDuty:true,herds:[],tempKeys:[],cover:[]},
 "21235":{mn:21235,name:"BnB CuntBitch",roles:["LIVESTOCK"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "255688":{mn:255688,name:"BnB Dog Nikto",roles:["LIVESTOCK"],species:"dog",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "207187":{mn:207187,name:"Eve the Kitt",roles:["LIVESTOCK"],species:"kitty",onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,name,X,Y)=>({MemberNumber:m,Name:name,Nickname:name,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,'BnB Farms',1,1),at(164951,'BnB Cow Mira',30,33),at(21235,'BnB CuntBitch',29,33),at(255688,'BnB Dog Nikto',31,34),at(207187,'Eve the Kitt',30,34)];
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const whispersSince=n=>sent.slice(n).filter(([e,d])=>d&&d.Type==='Whisper').map(([e,d])=>[d.Target,String(d.Content)]);
(async()=>{ await wait(3500);
  let n=sent.length;
  handlers.ChatRoomMessage({Sender:164951,Type:'Activity',Content:'Orgasm2',Dictionary:[{SourceCharacter:164951}]});
  await wait(4000);
  const w=whispersSince(n).filter(([t,c])=>/comes apart/.test(c));
  ok(w.some(([t])=>t===164951), "Mira gets her own line");
  ok(!w.some(([t])=>t!==164951), "nobody else gets Mira's line as a whisper ("+w.map(([t])=>t).join(",")+")");
  // the name still works when it's really used
  n=sent.length;
  W.__namesHere && ok(W.__namesHere("Mira bumps Nikto with her hip").sort().join(",")==="164951,255688", "real names still count (Mira, Nikto)");
  W.__namesHere && ok(W.__namesHere("A bucket clanks as a farmhand carries the full one past the BnB sign").length===0, "'the' and 'BnB' alone name nobody");
  W.__namesHere && ok(W.__namesHere("Eve purrs").join(",")==="207187", "Eve by her first name");
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
