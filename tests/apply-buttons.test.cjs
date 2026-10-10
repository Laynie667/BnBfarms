// Reported Oct 10: a Companion toggle or button pressed in the middle of an application was saved as the answer.
// Buttons are now marked as buttons (btn) and never count as answers; typed text and the offered choices still do.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,benchOn:true},
 "600":{mn:600,name:"Rex",roles:["LIVESTOCK"],species:"dog",gender:"male",futa:true,onDuty:true,herds:[],tempKeys:[],cover:[],limits:""}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"bench":{X:15,Y:10}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,14,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const to=(mn,n)=>sent.slice(n).filter(([e,d])=>d&&((d.Type==='Whisper'&&d.Target===mn)||(e==='AccountBeep'&&d.MemberNumber===mn))).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
const FM=(mn,d)=>handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,...d}});
const toPanel=(mn,n)=>sent.slice(n).filter(([e,d])=>d&&d.Target===mn&&d.Content==='FarmhandMsg').map(([e,d])=>String((d.Dictionary||{}).text||'')).join(' | ');
(async()=>{ await wait(3500); W.__cfg.USER_COOLDOWN_S=0; chars.push(at(888,25,25)); chars[chars.length-1].Name='Vee';
  FM(888,{type:'hello',ver:'0.12.3'}); await wait(1500);
  await say(888,'?apply',3000);
  const S=()=>W.__st().sessions.get(888);
  ok(!!S() && S().step===0, 'the application is open, on its first question');
  let n=sent.length; FM(888,{type:'cmd',text:'breedable on',btn:true}); await wait(2500);
  ok(S().step===0 && !S().answers.length && /middle of your application/.test(toPanel(888,n)+to(888,n)), 'a switch pressed in the panel is not taken as the answer, and they are told');
  n=sent.length; FM(888,{type:'cmd',text:'stats',btn:true}); await wait(2500);
  ok(S().step===0 && !S().answers.length, 'nor is any other panel button (stats)');
  n=sent.length; FM(888,{type:'cmd',text:'rules',btn:true}); await wait(2500);
  ok(S().step===0 && /HOUSE RULES/.test(toPanel(888,n)+to(888,n)), 'the Rules button still shows the rules, and the question stays open');
  FM(888,{type:'cmd',text:'gender female'}); await wait(2500);
  ok(S() && S().answers.length===1, 'what they type in the box (no btn mark) is still their answer: '+JSON.stringify(S()&&S().answers));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
