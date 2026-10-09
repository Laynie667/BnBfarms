// The Oct 8 evening watches: a pin never traps you (20 minutes at most, never from a Heavy Udder Draught), a switch flipped
// mid-application isn't saved as an answer, body marks go to the Companion, and potions live in their scenes.
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
const all=n=>sent.slice(n).filter(([e,d])=>d&&typeof d.Content==="string").map(([e,d])=>d.Content).join(" | ");
(async()=>{ await wait(3500); W.__cfg.USER_COOLDOWN_S=0;
  ['Laynie','Moo','Rex'].forEach((nm,i)=>chars[i+1].Name=nm);
  const p=()=>P(500).prod;
  // pinned by too much milk, at the stocks, far from a stall
  W.__pt(); p().held.vulva=7000; W.__pt(); await wait(500);
  ok(p().pin && p().pin.since, 'too full: pinned where they stand');
  p().pin.since=Date.now()-21*60000; let n=sent.length; W.__pt(); await wait(1500);
  ok(!p().pin && p().unpinUntil>Date.now() && /takes pity/.test(all(n)), 'after 20 minutes the farm girl milks them down where they stand, and they can move');
  // a Heavy Udder Draught never pins
  p().unpinUntil=0; p().held.vulva=7000; P(500).potionsOn=true; await say(221397,'?potion give 500 heavy'); W.__pt(); await wait(300);
  ok(!p().pin, 'a Heavy Udder Draught makes you ache, never stuck');
  // potions in their scenes
  n=sent.length; const f=P(500).fx.heavy; f.next=1; W.__potionTick(); await wait(1500);
  ok(/udder|teats|breasts/.test(all(n)), 'the draught has its own lines while it lasts');
  // the Broodmare Tonic: eggs from anybody and huge litters while it lasts; the safeword pours it out
  await say(221397,'?potion give 500 brood');
  ok(P(500).fx && P(500).fx.brood && p().boosts.eggs>Date.now() && p().boosts.hyper>Date.now(), 'a Broodmare Tonic: eggs from anybody and hyper litters for three hours');
  p().preg=null; P(500).breedable=true; P(500).fertile=true; p().held.vulva=2000;
  for (let i=0;i<200 && !p().preg;i++) W.__roll(500, 600, 500, 5);
  ok(p().preg && p().preg.count>=3, 'a cow (one calf, normally) on the Tonic carries a litter of '+(p().preg&&p().preg.count));
  await say(500,'?safe',3000);
  ok(!P(500).fx.brood && !(p().boosts.hyper>Date.now()), 'the safeword pours it out, boosts and all');
  // a switch flipped mid-application is a command, not an answer
  chars.push(at(255688,22,22)); chars[chars.length-1].Name='Nikto';
  await say(255688,'?apply'); n=sent.length; await say(255688,'potions on');
  const app=(W.__st().sessions.get(255688)||{});
  ok(!JSON.stringify(app).includes('potions on'), '"potions on" mid-application is not saved as an answer');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
