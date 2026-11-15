// Nov 14: layouts from the map studio. ?layout <name> takes a layout's spots and zones from the studio on the bot's PC
// (its map goes in with /mappaste), ?layout back undoes it, ?layout lists them. Proprietors only.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "300":{mn:300,name:"Hand",roles:["HERDMASTER"],onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"trough-1":{X:37,Y:22,by:221397,at:1000},"stocks":{X:30,Y:2,by:221397,at:1000}},zones:{barn:{a:{X:26,Y:21},b:{X:39,Y:31},group:"barn"}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(300,22,22)];
const asked=[];
const RACE={v:1,name:"race-day",map:{},farm:{spots:{"trough-1":{X:37,Y:22},"start":{X:5,Y:5},"finish":{X:30,Y:30}},zones:{track:{a:{X:2,Y:2},b:{X:35,Y:35}}}}};
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,300]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[],
  // the map studio on this computer
  fetch:async(url)=>{ asked.push(url);
    if (/\/__studio\/maps\/$/.test(url)) return { ok:true, status:200, json:async()=>({layouts:[{name:"farm"},{name:"race-day"}]}) };
    if (/race-day\.json$/.test(url)) return { ok:true, status:200, json:async()=>JSON.parse(JSON.stringify(RACE)) };
    return { ok:false, status:404, json:async()=>({}) }; } };
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const realTimeout=setTimeout, wait=ms=>new Promise(r=>realTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const drain=async(min)=>{ await wait(min||300); for(let i=0;i<400;i++){ const s=W.__st(); if(!s.queue.length&&!s.urgent.length&&!s.sending) break; await wait(100);} await wait(200); };
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
// (its answers: a whisper while they're in the room, a beep otherwise)
const beepsTo=(k,mn)=>sent.slice(k).filter(([e,d])=>d&&((e==='AccountBeep'&&d.MemberNumber===mn)||(e==='ChatRoomChat'&&d.Target===mn))).map(([e,d])=>String(d.Message||d.Content));
const cmd=async(mn,text)=>{ const k=sent.length; handlers.AccountBeep({MemberNumber:mn,Message:text}); await drain(5600); return k; };
(async()=>{ await wait(3500);
  let k=await cmd(300,'layout race-day');
  ok(beepsTo(k,300).some(t=>/for the proprietors/.test(t)) && L().spots.stocks, 'a herdmaster can\'t swap the layout');
  k=await cmd(221397,'layout race-day');
  const S=L().spots;
  ok(beepsTo(k,221397).some(t=>/Layout race-day is in: 3 spots and 1 zones/.test(t) && /mappaste/.test(t)), 'a proprietor swaps one in, and is told to paste its map');
  ok(S.start && S.finish && !S.stocks, 'its spots replace the farm\'s');
  ok(S['trough-1'].by===221397 && S['trough-1'].at===1000, 'a spot that didn\'t move keeps who set it and when');
  ok(S.start.by===221397 && S.start.at>1000, 'a new one is set now');
  ok(L().zones.track && !L().zones.barn, 'its zones too');
  ok(L().zones.track.group==='track', 'a zone of its own carries its own name as its group (the ledger throws away zones without one)');
  ok(Object.values(L().zones).every(z=>'group' in z), '...and so does every other zone');
  ok(L().layoutActive==='race-day' && L().layoutBefore && L().layoutBefore.spots.stocks, 'the farm remembers which is in, and what was before');
  ok(asked.some(u=>u==='http://localhost:4780/__studio/maps/race-day.json'), 'it asks the studio on this computer');
  k=await cmd(221397,'layout');
  ok(beepsTo(k,221397).some(t=>/In now: race-day/.test(t) && /farm, race-day/.test(t)), '?layout says which is in and lists the studio\'s');
  k=await cmd(221397,'layout back');
  ok(L().spots.stocks && !L().spots.start && L().zones.barn && !L().layoutActive, '?layout back puts the spots and zones back');
  k=await cmd(221397,'layout nope');
  ok(beepsTo(k,221397).some(t=>/no layout called nope/.test(t)) && L().spots.stocks, 'a layout the studio hasn\'t got changes nothing');
  ok(!warns.some(w=>/error|failed/i.test(w)&&!/Worker|CustomEvent|ModSDK/.test(w)), 'no errors '+warns.filter(w=>/error|failed/i.test(w)).slice(0,2).join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
