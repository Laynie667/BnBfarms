// The suggestion box: ?feedback, ?suggest, ?bug, ?feedback mine; proprietors list them, mark them done (the sender's told).
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
(async()=>{ await wait(3500); W.__cfg.USER_COOLDOWN_S=0; chars.push(at(888,25,25)); chars[chars.length-1].Name='Visitor';
  ['Laynie','Moo','Rex'].forEach((nm,i)=>chars[i+1].Name=nm);
  let n=sent.length; await say(500,'?suggest a hayride on Sundays');
  ok(L().feedback.length===1 && L().feedback[0].kind==='idea' && /#1 in the suggestion box/.test(to(500,n)), 'stock send an idea');
  ok(/New in the suggestion box, #1 from Moo/.test(to(221397,n)), 'the proprietor gets a quiet note: '+to(221397,n).slice(0,150));
  n=sent.length; await say(888,'?bug the stall never let me go');
  ok(L().feedback[1].kind==='bug' && L().feedback[1].mn===888 && /#2/.test(to(888,n)), 'a guest not on the books can send a bug');
  n=sent.length; await say(600,'?feedback');
  ok(/What would you like to tell/.test(to(600,n)) && L().feedback.length===2, 'a bare ?feedback explains itself');
  await say(600,'?feedback I love the bench');
  ok(L().feedback[2].kind==='feedback', 'plain feedback');
  n=sent.length; await say(500,'?feedback list');
  ok(!/SUGGESTION BOX ·/.test(to(500,n)) && L().feedback.length===4, 'stock saying "?feedback list" just sends feedback, the list is proprietors only');
  n=sent.length; await say(221397,'?feedback list');
  ok(/SUGGESTION BOX · open/.test(to(221397,n)) && /hayride/.test(to(221397,n)), 'the proprietor lists them');
  n=sent.length; await say(221397,'?feedback done 1 Booked for Sunday!');
  ok(L().feedback[0].status==='done' && /taken care of/.test(to(500,n)) && /Booked for Sunday/.test(to(500,n)), 'done: the sender is told, with the note');
  n=sent.length; await say(500,'?feedback mine');
  ok(/WHAT YOU'VE SENT/.test(to(500,n)) && /done/.test(to(500,n)), '?feedback mine shows theirs and what came of it');
  n=sent.length; await say(221397,'?feedback export');
  ok(/EVERYTHING IN THE SUGGESTION BOX [([]4[)\]]/.test(to(221397,n)), 'export for the proprietors');
  const st=W.__stateFor(221397);
  ok(st.feedback && st.feedback.length===4 && st.feedback[0].id===4 && st.feedback.find(f=>f.id===1).status==='done', "the Dashboard's Suggestions tab gets the box, newest first");
  ok(!W.__stateFor(500).feedback, '...and nobody but proprietors does');
  for (let i=0;i<10;i++) await say(888,'?idea number '+i, 400);
  ok(L().feedback.filter(f=>f.mn===888).length===10, 'ten a day per person, then it says try tomorrow');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
