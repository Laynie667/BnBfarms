// Reported live: some answers to the application's animal question didn't work for people without the
// Companion (they type it, so punctuation, "cowgirl", "I'm staff"...). Everyday answers all work now, staff
// and guests aren't asked at all, and only answers that aren't an animal get asked again.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,900].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
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
(async()=>{ await wait(3500);
  const C=W.__speciesCheck;
  const expect={
    "cow":"cow", "Cow.":"cow", "a cow!":"cow", "cowgirl":"cow", "cow girl":"cow", "I am a cow":"cow", "I'm a hucow please":"cow",
    "dairy cow":"cow", "heifer":"cow", "puppy girl":"pup", "pupgirl":"pup", "doggy":"dog", "horse girl":"horse", "ponyboy":"pony",
    "mare":"horse", "kitty cat":"kitty", "kitten":"kitty", "kitty":"kitty", "no, a kitty":"kitty", "bunny girl":"bunny", "vixen":"fox", "fox":"fox", "goats":"goat",
    "piglet":"pig", "ewe":"sheep", "doe":"deer", "wolves":"wolf", "no, a cow":"cow",
    "no":"", "nope":"", "human":"", "staff":"", "Im staff":"", "guest":"", "luxury guest":"", "not stock.":"", "Not Stock!":"",
    "not an animal":"", "n/a":"", "none":"", "not sure":"", "I don't know yet":"",
    "dragon":"dragon", "other dragon":"dragon", "red panda":"red panda"
  };
  const bad=[];
  for (const [a,want] of Object.entries(expect)){ const got=C(a); if (got.err || got.value!==want) bad.push(a+' → '+(got.err?'asked again':JSON.stringify(got.value))+' (wanted '+JSON.stringify(want)+')'); }
  ok(!bad.length, 'everyday answers all understood ('+Object.keys(expect).length+' tried)'+(bad.length?': '+bad.join('; '):''));
  ok(!!C('yes').err && !!C('ok').err && !!C('').err, 'answers that are not an animal are asked again');
  // staff and guests: the animal question is skipped
  const B=async(msg)=>{handlers.AccountBeep({MemberNumber:900,Message:msg});await wait(5200);};
  W.__st().mutual={at:Date.now(),set:new Set([900])};
  await B('apply'); await wait(2000); await B('Daisy'); let k=sent.length; await B('staff');
  const after=sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===900).map(([e,d])=>d.Message).join(' | ');
  ok(!/what kind of animal/i.test(after) && /How should the farm see you/.test(after), 'someone who is only staff is not asked for an animal');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
