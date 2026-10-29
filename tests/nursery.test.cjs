// Oct 29 (Laynie): the nursery. A safe list of littles and caregivers, little space, play, care, ABCL wetness, privacy.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,trapsOn:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Pip"), "600":S(600,"Nanny",{gender:"female"}), "700":S(700,"Rex",{gender:"male",species:"bull"})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50},"nursery-ballpit":{X:20,Y:20}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,17,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
W.LZString={ compressToBase64:(t)=>Buffer.from(t).toString('base64'), decompressFromBase64:(t)=>Buffer.from(t,'base64').toString() };
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
const txt=([e,d])=>d&&(d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message||''));
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(txt).join(' | ');
const to=(n,mn)=>sent.slice(n).filter(([e,d])=>d&&(d.Target===mn||d.MemberNumber===mn)).map(txt).join(' | ');
// a nursery line anywhere it shouldn't be: to Rex, or out loud to the room
const leaks=(n)=>sent.slice(n).filter(([e,d])=>d&&/🧸|🛁|🎲|🧷|⭐|little one|sweetpea/.test(txt([e,d]))&&(d.Target===700||d.MemberNumber===700||(!d.Target&&!d.MemberNumber&&e==='ChatRoomChat'&&d.Type!=='Hidden')));
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2; cfg.NURSERY.BEAT_S=0.15; cfg.NURSERY.STAR_CHANCE=1;
  ['Laynie','Pip','Nanny','Rex'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700]) await say(mn,'?stats',500);
  const n0=sent.length;
  // hidden from everybody else
  let n=sent.length; await say(700,'?little on'); ok(/don't know \?little/.test(all(n)), 'to somebody off the list, ?little doesn\'t exist');
  // the list: a proprietor adds a caregiver, the caregiver invites a little, each says yes
  n=sent.length; await say(221397,'?nursery add Nanny caregiver'); ok(/asked Nanny/.test(all(n)), 'Laynie invites Nanny as a caregiver');
  await say(600,'?yes'); ok(P(600).nursery && P(600).nursery.role==='caregiver', 'Nanny says yes: a caregiver');
  n=sent.length; await say(700,'?nursery add Pip caregiver'); ok(/don't know/.test(all(n)), 'Rex can\'t add anybody (it doesn\'t exist for him)');
  await say(600,'?nursery add Pip little'); await say(500,'?yes');
  ok(P(500).nursery && P(500).nursery.role==='little' && P(500).nursery.carers.includes(600), 'Nanny invites Pip as a little: Pip says yes, they\'re paired');
  // little space
  n=sent.length; await say(500,'?little on',2500); ok(W.__littleNow(500), 'Pip goes little');
  ok(/little (space )?now/.test(to(n,600)), 'Nanny is told, privately');
  // the farm's grown-up things leave them be
  n=sent.length; await say(700,'?milk Pip'); ok(/isn't available/.test(all(n)) && !/wants to milk/.test(to(n,500)), 'Rex can\'t milk Pip; Pip never even gets asked');
  n=sent.length; await say(500,'?traps on'); ok(/little space/.test(all(n)), 'Pip\'s own grown-up commands wait');
  n=sent.length; await say(700,'?buy cake smash for Pip',2000); ok(!/isn't available/.test(all(n)), 'a cake smash is still fine');
  // play: only nursery folk see it
  n=sent.length; await say(500,'?little story',3000);
  ok(/📖|book|story/i.test(to(n,600)) && /book|story/i.test(to(n,500)), 'story time reaches Pip and Nanny');
  await say(500,'?little game rps rock',1500);
  // care
  n=sent.length; await say(600,'?care cuddle Pip',1500); ok(/cuddle|arms/i.test(to(n,500)), 'Nanny cuddles Pip');
  // ABCL: soggy padding gets teased, kindly, to the nursery only
  W.__nurseryStats(500,{abcl:true,wet:0.7,diaper:true}); await wait(600);
  ok(P(500).nursery.wet && P(500).nursery.wet.told===2, 'soggy paddin\' is noticed');
  handlers.ChatRoomMessage({Sender:500,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'hello',ver:'0.44.0'}}); await wait(800);
  n=sent.length; await say(600,'?care change Pip',1500);
  ok(sent.slice(n).some(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Target===500&&d.Dictionary.type==='nursery'&&d.Dictionary.do==='change'), 'a change tells Pip\'s Companion to set ABCL dry');
  ok(P(500).nursery.wet.pct===0, '...and the farm knows they\'re dry');
  // Littlish Club: a mommy who's a caregiver here gets paired
  P(600).nursery.role='caregiver'; P(500).nursery.carers=[]; W.__nurseryStats(500,{mommy:600}); await wait(300);
  ok(P(500).nursery.carers.includes(600), 'a Littlish Club mommy on the list is paired automatically');
  // the nursery's traps: a ball pit on a nursery spot
  chars.find(c=>c.MemberNumber===500).MapData.Pos={X:20,Y:20};
  n=sent.length; W.__nurseryTick(); await wait(1500); ok(/ball pit|balls/i.test(to(n,500)), 'the ball pit springs for Pip');
  // stars, small
  ok((P(500).nursery.stars||{}).n>=1 && (P(500).nursery.stars||{}).n<=cfg.NURSERY.STARS_DAY, 'gold stars, a few ('+((P(500).nursery.stars||{}).n)+')');
  // the panel
  const s5=W.__stateFor(500), s7=W.__stateFor(700), s6=W.__stateFor(600);
  ok(s5.nursery && s5.nursery.role==='little' && s5.nursery.space, 'Pip\'s panel has the Nursery');
  ok(!s7.nursery, 'Rex\'s panel has no Nursery at all');
  ok(s6.nursery && (s6.nursery.littles||[]).some(l=>l.mn===500&&l.space), 'Nanny\'s panel lists Pip');
  // back to grown-up
  n=sent.length; await say(500,'?little off'); ok(!W.__littleNow(500), 'Pip grows back up');
  // something grown-up holds them: little space waits
  W.__latch && W.__latch(500,'given'); n=sent.length; await say(500,'?little on'); ok(!W.__littleNow(500) && /parasite/.test(all(n)), 'with a parasite on, little space waits');
  // privacy, all the way through
  const lk=leaks(n0); ok(!lk.length, 'not one nursery line reached Rex or the room ('+lk.slice(0,2).map(txt).join(' / ')+')');
  ok(!warns.some(w=>/TypeError|ReferenceError/.test(w) && !/Worker/.test(w)), 'no errors ('+warns.filter(w=>/Error/.test(w)&&!/Worker/.test(w)).slice(0,2).join(' / ')+')');
  out(fails ? 'FAILED '+fails : 'ALL PASSED'); process.exit(fails?1:0);
})();
