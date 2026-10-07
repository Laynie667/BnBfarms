// From the Oct 6 watch reports: livestock asking ?contract were told it's staff-only (and a second ask got
// silence); "/bot cert" in a beep read as a command called "/bot"; the "I whispered that to you" tip was said out
// loud, naming a newcomer in front of the room after every command; someone said "safe" to find out what it did.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "8560":{mn:8560,name:"Ella",roles:["LIVESTOCK"],species:"dog",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "261343":{mn:261343,name:"Ari",roles:["LIVESTOCK"],onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],
 contracts:[{key:"a",mn:8560,by:232922,tpl:"nhl",title:"BnB Dog Ella",status:"offered",at:1}]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,8560,261343,260094].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:W.Player.FriendList.map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[261343]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239]}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const toSince=(mn,n)=>sent.slice(n).filter(s=>(s[0]==='AccountBeep'&&s[1].MemberNumber===mn)||(s[1]&&s[1].Type==='Whisper'&&s[1].Target===mn)).map(s=>s[1].Message||s[1].Content).join(' | ');
const publicSince=n=>sent.slice(n).filter(s=>s[0]==='ChatRoomChat'&&s[1]&&(s[1].Type==='Chat'||s[1].Type==='Emote')&&!s[1].Target).map(s=>s[1].Content).join(' | ');
const whisperIn=async(mn,msg)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(2500); };
const chatIn=async(mn,msg)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Chat',Content:msg}); await wait(2500); };
(async()=>{ await wait(3500);
  W.__st().mutual={at:Date.now(),set:new Set([261343])};
  let n=sent.length; await whisperIn(8560,'contract');
  ok(/YOUR FARM CONTRACTS/.test(toSince(8560,n)) && /BnB Dog Ella/.test(toSince(8560,n)) && /BC\+ Contracts page/.test(toSince(8560,n)), 'livestock ?contract shows their own contract');
  n=sent.length; await whisperIn(8560,'?contract');
  ok(/YOUR FARM CONTRACTS/.test(toSince(8560,n)), 'asking again still gets an answer');
  n=sent.length; await whisperIn(261343,'?contracts');
  ok(/haven't got a farm contract yet/.test(toSince(261343,n)), 'no contract: told how to get one');
  n=sent.length; handlers.AccountBeep({MemberNumber:261343,Message:'/bot help'}); await wait(5200);
  ok(!/don't know \?\/bot/.test(toSince(261343,n)) && /FARM OFFICE|ask me|help/i.test(toSince(261343,n)), '"/bot help" in a beep is read as help');
  // a newcomer who can't get beeps types commands in room chat: answers whispered, tip once, never out loud
  n=sent.length; await chatIn(260094,'?rules'); await chatIn(260094,'?consent');
  const pub=publicSince(n), w=toSince(260094,n);
  ok(!/I whispered that/.test(pub), 'the friend tip is never said out loud ('+pub.slice(0,80)+')');
  ok((w.match(/I whispered that/g)||[]).length===1, 'the tip comes once, in the whisper');
  n=sent.length; await whisperIn(8560,'?help me');
  ok(/safe stops everything and fetches staff/.test(toSince(8560,n)), 'the command list says what safe does');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
