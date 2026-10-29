// Oct 27 (Laynie): "the bot should automatically unregister livestock, guest, and luxury guest who have not been inside the
// same room as the bot in two weeks" ... "that doesnt include anyone registered with a perm contract". The two weeks only
// count while the bot's in the room; staff, the proprietors and permanent contracts are never taken off.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,roles,extra)=>Object.assign({mn,name,roles,species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:""},extra||{});
const people={
 "221397":S(221397,"Laynie",["PROPRIETOR"]),
 "500":S(500,"Moo",["LIVESTOCK"],{herds:[{leader:600,type:"temp",since:1}]}), "600":S(600,"Rex",["LIVESTOCK"]), "610":S(610,"Bea",["GUEST"]), "620":S(620,"Lux",["LUXURY"]),
 "630":S(630,"Perma",["LIVESTOCK"]), "640":S(640,"Weekly",["LIVESTOCK"]), "650":S(650,"Hole",["GLORYHOLE"]), "660":S(660,"Hand",["LIVESTOCK","FARMHAND"]),
 "800":S(800,"Hank",["FARMHAND"])
};
for (let i=0;i<7;i++) people[String(700+i)]=S(700+i,"Herd"+i,["LIVESTOCK"]);
store.bnb_ledger_v1=JSON.stringify({v:4,people,applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50}},
  contracts:[{key:"a",mn:630,title:"Forever Farm",status:"signed",durationMin:0,rules:[],at:1},
             {key:"b",mn:640,title:"A Week",status:"signed",durationMin:10080,until:Date.now()+7*86400000,rules:[],at:1}]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'},Whitelist:[]}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
W.LZString={ compressToBase64:(t)=>Buffer.from(t).toString('base64'), decompressFromBase64:(t)=>Buffer.from(t,'base64').toString() };
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
const beeps=(mn,k)=>sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===mn).map(([e,d])=>d.Message).join(' | ');
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const online=()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:[221397,500,600].map(m=>({MemberNumber:m,ChatRoomName:m===600?"Somewhere Else":"B&B Farm"}))});
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2; cfg.CHAIN_CHANCE=0;
  chars[1].Name='Laynie'; chars[2].Name='Moo';
  online();
  W.__awayTick();
  ok(Object.values(L().people).every(r=>r.hereMin!=null), 'everybody on the books gets a clock the first time (nobody was timed before)');
  const start=L().away.min;
  W.__awayTick(8*3600000);
  ok(L().away.min-start<=3.01, 'the PC asleep for 8 hours only counts a few minutes ('+(L().away.min-start).toFixed(1)+')');

  // 12 days away: a note
  let k=sent.length; W.__awayAdd(12); online(); W.__awayTick(); await wait(1500);
  ok(P(600).awayWarned>0 && /haven't seen you on the farm in 12 days/.test(beeps(600,k)), 'twelve days away: Rex (online somewhere else) is beeped a note');
  ok(P(610).awayWarned>0 && (L().mailbox||{})[610] && /haven't seen you/.test(L().mailbox[610].map(x=>x.gist).join(' ')), '...Bea (offline) has it kept for her');
  ok(!P(500).awayWarned && !P(630).awayWarned && !P(800).awayWarned && !P(650).awayWarned && !P(660).awayWarned, 'nobody in the room, on a permanent contract, staff or gloryhole-only is warned');
  k=sent.length; await say(221397,'?away',1500);
  const list=all(k);
  ok(/AWAY FROM THE FARM/.test(list) && /Rex · 12 days away/.test(list) && /off the books in 2 days/.test(list) && /told/.test(list), '?away lists who is gone and when they come off');
  ok(/Perma/.test(list) && !/Moo ·/.test(list) && !/Hank ·/.test(list), '...names the permanent contracts kept, and leaves out who is here and staff');
  k=sent.length; await say(500,'?away',1500);
  ok(!/AWAY FROM THE FARM/.test(all(k)), '?away is staff-only');

  // Bea comes by: her place is kept
  chars.push(at(610,20,20)); chars[chars.length-1].Name='Bea';
  W.__awayTick();
  ok(!P(610).awayWarned && P(610).hereMin===L().away.min, 'steppin\' into the room clears it');
  chars.pop();

  // two weeks: off the books
  k=sent.length; W.__awayAdd(2.1); online(); W.__awayTick(); await wait(2000);
  const gone=[600,620,640,700,701,702,703,704,705,706].filter(mn=>!P(mn));
  ok(gone.length===5, 'two weeks away: at most five come off at once ('+gone.join(',')+')');
  W.__awayTick(); await wait(1500); W.__awayTick(); await wait(1500);
  ok([600,620,640,700,701,702,703,704,705,706].every(mn=>!P(mn) && L().archive[mn]), '...then the rest: livestock, the luxury guest and a one-week contract, paperwork archived');
  ok(P(221397) && P(500) && P(610) && P(630) && P(650) && P(660) && P(800), 'kept: the proprietor, whoever came by, the permanent contract, gloryhole-only, and staff');
  ok(/taken you off the books/.test(beeps(600,k)), 'Rex is told');
  ok((L().mailbox||{})[620] && /off the books/.test(L().mailbox[620].map(x=>x.gist).join(' ')), '...Lux (offline) has it waitin\' for her');
  ok(/Away from the farm for 14 days, so off the books now/.test(all(k)) && /Rex \(600\)/.test(all(k)), 'staff are told who came off');
  ok(!P(500).herds.some(h=>h.leader===600), 'nobody is left in a herd led by someone who came off');
  const errs=warns.filter(w=>/away|unregister|offTheBooks|ReferenceError|TypeError/i.test(w) && !/Worker is not defined/.test(w)); ok(!errs.length, 'no errors ('+errs.join(' | ').slice(0,200)+')');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
