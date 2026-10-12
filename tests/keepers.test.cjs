// Batch D (Oct 11): toys that follow the scene, home-built traps, broodin' on the nest, the keeper's whistle,
// keepsakes, trained holes, barn dreams, herd leaders' reins, and the vat.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],ribbons:30},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[{leader:600,type:"perm",since:1,ends:null,warned:false}],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,ribbons:20},
 "600":{mn:600,name:"Hana",roles:["HERDMASTER"],onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",ribbons:20},
 "700":{mn:700,name:"Fern",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",ribbons:5}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"nest":{X:40,Y:40},"barn":{X:60,Y:60},"pasture":{X:20,Y:40}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,17,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}}, location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn], prod=mn=>P(mn).prod;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const to=(mn,n)=>sent.slice(n).filter(([e,d])=>d&&((d.Type==='Whisper'&&d.Target===mn)||(e==='AccountBeep'&&d.MemberNumber===mn))).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const raw=n=>JSON.stringify(sent.slice(n));
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2400); };
const moveTo=(mn,X,Y)=>{ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.12; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0;
  ['Laynie','Moo','Hana','Fern'].forEach((nm,i)=>chars[i+1].Name=nm);
  await say(500,'?stats'); await say(600,'?stats'); await say(221397,'?stats'); await say(700,'?stats');
  const free=()=>{ const r=P(500); r.trapAt=0; r.penned=null; r.gear=null; r.benched=null; r.trapWait=null; r.dirt=null; r.trapQuiet=0; };
  let n;
  // ── a home-built trap ──
  n=sent.length; await say(221397,'?trap make Sticky fill brutal | A hose comes up for %n. | It finds its way in. | %n is pumped tight.');
  ok(L().customTraps && L().customTraps.sticky && L().customTraps.sticky.lines.length===3 && /Built: the sticky trap/.test(to(221397,n)), 'a proprietor builds a trap with lines of their own');
  n=sent.length; await say(600,'?trap make other strip'); ok(/just for the proprietors/.test(to(600,n)), '...and nobody else can');
  n=sent.length; await say(221397,'?trap make wolves strip'); ok(/already a trap called wolves/.test(to(221397,n)), 'a name that is taken is refused');
  const held0=Object.values(prod(500).held).reduce((a,b)=>a+b,0);
  n=sent.length; await say(221397,'?trap spring Moo sticky'); await wait(1600);
  ok(/A hose comes up for Moo/.test(all(n)) && /Moo is pumped tight/.test(all(n)), 'it runs the proprietor\'s own lines, with the name put in');
  ok(Object.values(prod(500).held).reduce((a,b)=>a+b,0) > held0, '...and does what it was built to do (a fill)');
  n=sent.length; await say(221397,'?trap made'); ok(/sticky: fill, brutal/.test(to(221397,n)), '?trap made lists them');
  // ── keepsakes and trained holes ──
  ok(W.__album(500).some(e=>/sticky/.test(e.h)) && (W.__stateFor(500).album||[]).length>0, 'a trap leaves a card in their album, and the Companion gets it');
  ok(W.__holes(500).length===1 && W.__holes(500)[0].loads===1 && W.__holes(500)[0].rank==='green', 'each hole keeps count of what it has taken');
  const cap0=prod(500).capBonus||0, hole=Object.keys(P(500).holes)[0];
  for(let i=0;i<9;i++) W.__holeTook(500,hole,120);
  ok(W.__holes(500)[0].loads===10 && W.__holes(500)[0].rank==='broken in' && (prod(500).capBonus||0)===cap0+cfg.HOLE_CAP_BONUS, 'at 10 loads a hole is broken in: they hold more for good');
  ok(W.__album(500).some(e=>/broken in/.test(e.h)), '...and that goes in the album too');
  n=sent.length; await say(500,'?holes'); ok(/broken in\. 10 loads/.test(to(500,n)), '?holes reads the record back');
  n=sent.length; await say(500,'?album'); ok(/YOUR KEEPSAKES/.test(to(500,n)), '?album opens it');
  n=sent.length; await say(600,'?album'); ok(/empty yet/.test(to(600,n)), 'nobody else\'s album is in yours');
  // ── toys follow the scene ──
  W.__st().companions.set(500,{at:Date.now()}); free();
  n=sent.length; await say(221397,'?trap spring Moo sticky'); await wait(1600);
  ok(/vibe/.test(raw(n)), 'with a Companion on, the scene turns the dial on their toys');
  W.__st().companions.delete(500);
  // ── the keeper's whistle ──
  free(); n=sent.length; await say(500,'?whistle wolves Moo'); ok(/staff hook/.test(to(500,n)), 'the whistle is for staff');
  n=sent.length; await say(700,'?whistle stallion Moo',1200); await wait(6500);
  ok(/whistle/i.test(all(n)) && /sprung a trap/.test(to(500,n)), 'a farmhand whistles, and the stallion comes to the subject where they stand');
  free(); n=sent.length; await say(700,'?whistle bull Moo'); ok(/only just been called/.test(to(700,n)), '...with a long wait before the next call');
  await wait(1500);
  // ── herd leaders ──
  free(); n=sent.length; await say(700,'?send Moo mud'); ok(/isn't in your herd/.test(to(700,n)), 'the reins only reach your own herd');
  n=sent.length; await say(600,'?send Moo mud'); await wait(1200);
  ok(/Sent\./.test(to(600,n)) && /herd leader sent you/.test(to(500,n)), 'a herd leader sends one of their own to a trap');
  n=sent.length; await say(600,'?dose Moo fertility'); ok(/Easy on the reins/.test(to(600,n)), '...not twice in a row');
  P(600).reinsAt=0; free(); n=sent.length; await say(600,'?dose Moo fertility x2');
  ok(/Done\./.test(to(600,n)) && prod(500).boosts && prod(500).boosts.fert>Date.now(), 'a herd leader doses their own');
  n=sent.length; await say(600,'?herdtraps'); ok(/YOUR HERD'S TRAP CARDS/.test(to(600,n)) && /Moo/.test(to(600,n)), '?herdtraps shows their herd\'s cards');
  // ── broodin' ──
  free(); cfg.SIT_MIN=0.15; cfg.SIT_LINE_MIN=0.01;
  L().nest={eggs:8,by:{500:8},types:{500:{water:8}}};
  n=sent.length; await say(500,'?sit'); ok(/Climb onto the nest/.test(to(500,n)), 'you have to be on the nest to sit it');
  moveTo(500,40,40); const rb=P(500).ribbons||0, lead=P(600).ribbons||0;
  n=sent.length; await say(500,'?sit');
  ok(P(500).sitting && P(500).sitting.n===8 && L().nest.eggs===0 && P(500).penned && P(500).penned.sit, '?sit takes the clutch under them and keeps them on the nest');
  ok(W.__happening(500).some(t=>/sittin' 8 eggs/.test(t)), '"what\'s happenin\' to me" says so');
  W.__keepTick(); await wait(900);
  ok(/mash|bottle|feeds/.test(all(n)), 'they are fed by hand where they sit');
  await wait(7000); n=sent.length; W.__keepTick(); await wait(900);
  ok(!P(500).sitting && !P(500).penned && P(500).brooded===8 && (P(500).ribbons||0)>rb, 'when they hatch the brood is theirs, and it pays');
  ok((P(600).ribbons||0)>lead, '...and their herd leader takes a share');
  ok(W.__album(500).some(e=>/brood hatched/.test(e.h)), '...and it goes in the album');
  L().nest={eggs:5,by:{500:5},types:{500:{water:5}}}; await say(500,'?sit'); await say(500,'?safeword',2500);
  ok(!P(500).sitting && L().nest.eggs===5, 'the safeword gets them up, and the eggs go back in the straw');
  moveTo(500,15,10); free();
  // ── the vat ──
  prod(500).milk=900; P(500).vat=0; const before=P(500).ribbons||0;
  n=sent.length; await say(500,'?buy shot-fert with milk'); ok(/Get yourself milked/.test(to(500,n)), 'an empty vat buys nothin\'');
  P(500).vat=4000; n=sent.length; await say(500,'?buy shot-fert with milk');
  ok(/Paid in what came out of you/.test(to(500,n)) && P(500).vat===1000 && (P(500).ribbons||0)===before, 'a full one buys a shot, and no ribbons change hands');
  n=sent.length; await say(500,'?buy luxury with milk'); ok(/only buys potions and shots/.test(to(500,n)), 'the vat only buys potions and shots');
  n=sent.length; await say(500,'?vat'); ok(/Your vat: /.test(to(500,n)) && W.__stateFor(500).vat===1000, '?vat shows what is in it, and so does the Companion');
  // ── barn dreams ──
  free(); P(500).trapLog=[{t:Date.now(),kind:'wolves',spot:''}]; ok(W.__dreamTheme(500)==='bred', 'a night\'s dreams follow what the day did');
  L().life.curfewOn=true; W.__hour=23; moveTo(500,60,61); W.__st().dreamAt=0; W.__keepTick(); P(500).dream.at=0; W.__st().dreamAt=0;
  n=sent.length; W.__keepTick(); await wait(1500);
  ok(P(500).dream && P(500).dream.n===1 && /dream/.test(to(500,n)), 'asleep in the barn through curfew, a dream comes');
  W.__hour=8; n=sent.length; W.__keepTick(); await wait(900);
  ok(!P(500).dream && /Mornin', sugar|gettin' light|First light/.test(to(500,n)), 'come mornin\' they wake needy, sore or carryin\'');
  // ── takin' one apart ──
  n=sent.length; await say(221397,'?trap unmake sticky'); ok(!L().customTraps.sticky && /taken apart/.test(to(221397,n)), '?trap unmake takes it apart');
  const errs=warns.filter(w=>/keep|custom|holes|vat|trap|command failed|panel state/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
