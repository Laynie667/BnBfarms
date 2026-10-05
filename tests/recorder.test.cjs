// The flight recorder: everything in and out, map moves, restraints put on and taken off, start-up steps,
// Companion traffic and plain whispers/beeps, kept through a reload; never passwords or e-mails.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={}; let anyIn=null;
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221397,500].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}},Appearance:[]}));
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]),
  ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f,onAny:(f)=>anyIn=f},
  Player:{MemberNumber:260239,FriendList:[221397]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[], CommandCombine(l){ W.Commands.push(...l); }, ChatRoomSendLocal(){}};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
// the game: every message goes to onAny first, then the bot's own handler
const game=(ev,d)=>{ if(anyIn) anyIn(ev,d); if(handlers[ev]) handlers[ev](d); };
const item=(g,a,craft,lock)=>({Group:g,Name:a,Craft:craft?{Name:craft}:undefined,Property:lock?{LockedBy:lock}:undefined});
(async()=>{ await wait(3500);
  ok(typeof anyIn==='function', 'the recorder watches everything the game sends');
  W.ServerSend('AccountLogin',{AccountName:'farmbot',Password:'hunter2'});
  game('ChatRoomSyncMemberJoin',{Character:{MemberNumber:600,Name:'Hana',MapData:{Pos:{X:3,Y:3}},Appearance:[item('ItemNeck','LeatherCollar')]}});
  game('ChatRoomSyncMapData',{MemberNumber:600,MapData:{Pos:{X:4,Y:3}}});
  game('ChatRoomSyncSingle',{Character:{MemberNumber:600,Appearance:[item('ItemNeck','LeatherCollar',null,'MistressPadlock'),item('ItemArms','LeatherArmbinder','Barn Binder')]}});
  game('ChatRoomSyncSingle',{Character:{MemberNumber:600,Appearance:[item('ItemArms','LeatherArmbinder','Barn Binder')]}});
  game('ChatRoomMessage',{Sender:500,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'hello',ver:'0.10.3'}});
  game('ChatRoomMessage',{Sender:221397,Type:'Whisper',Content:'?ping',Target:260239});
  game('AccountBeep',{MemberNumber:221397,MemberName:'Laynie',Message:'?rec mark the bot half-loaded just now'});
  await wait(6500);
  const file=W.__recFile(); const lines=file.trim().split('\n'); const head=JSON.parse(lines[0]);
  const ev=lines.slice(1).map(l=>JSON.parse(l));
  const has=(kind,rx)=>ev.some(e=>e[1]===kind&&rx.test(JSON.stringify(e[2])));
  ok(head.version && head.bot && head.note, 'the file opens with what it is (version, room, add-ons, queue)');
  ok(has('step',/script loaded/) && has('step',/on duty/), 'start-up steps are in it');
  ok(!/hunter2|farmbot/.test(file), 'no password or account name, ever');
  ok(has('join',/Hana/) && has('move',/"X":4/), 'people joining and moving on the map');
  ok(has('items',/MistressPadlock/) && has('items',/Barn Binder/), 'restraints put on and locked');
  ok(has('items',/- LeatherCollar/), 'restraints taken off');
  ok(has('in',/"hello"/), 'what each Companion sends the bot');
  ok(has('out',/"welcome"/), 'what the bot sends each Companion');
  ok(has('in',/\?ping/) && ev.some(e=>(e[1]==='out'||e[1]==='beep-out')&&/221397/.test(JSON.stringify(e[2]))), 'plain whispers and the answers to people without the Companion');
  ok(has('mark',/half-loaded/), '?rec mark puts a note in the recording');
  ok(has('log',/Listeners attached/), "the bot's own log lines");
  // kept through a reload
  W.__rec.saveAt=0; game('ChatRoomSyncMapData',{MemberNumber:600,MapData:{Pos:{X:5,Y:3}}});
  const saved=JSON.parse(store.bnb_flight_v1||'null');
  ok(saved && saved.ev.length>10, 'saved so it survives a reload ('+(saved?saved.ev.length:0)+' things)');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
