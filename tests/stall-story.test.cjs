// The milkin' stall's private story fits whoever's in it: breasts, cock or both, any species, and what
// they've got (breast size, cock type, knot, balls, pregnancy, piercings). It plays in order, the climaxes
// in order with that kind of cock's own big moment, and no placeholder is ever left in a line.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "600":{mn:600,name:"Rex",roles:["LIVESTOCK"],species:"dog",onDuty:true,herds:[],tempKeys:[],cover:[],milkable:false},
 "700":{mn:700,name:"Vixen",roles:["LIVESTOCK"],species:"horse",onDuty:true,herds:[],tempKeys:[],cover:[],futa:true,degradeMe:true}
},applications:[],archive:{},log:[],stuckLog:[],spots:{"milking1":{X:5,Y:5},"milking2":{X:15,Y:5},"milking3":{X:25,Y:5}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(500,30,30),at(600,36,36),at(700,39,20)];   // apart, so no ambient moments between them
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const realNow=Date.now; let skew=0; Date.now=()=>realNow()+skew;
const OPEN=/cups pull at .*breasts in a slow rhythm|Milk streams from .* into the stall's bucket|milkin' stall eases off|wet suction sleeve, and it pumps|strokes .* from root to tip, milkin'|vibrating cup hugs .*balls while the sleeve|stall wrings .* down to the last quarter/;
// a whole session for one person standing at (x,5); returns their private story lines
async function session(mn, x){
  const c=chars.find(c=>c.MemberNumber===mn), home=c.MapData.Pos;
  c.MapData.Pos={X:x,Y:5};
  const k=sent.length; let n=0;
  W.__ms(); W.__ms();
  const p=L().people[mn].prod;
  while(p.stall && n<200){ skew+=20000; W.__ms(); n++; }
  c.MapData.Pos=home; W.__ms();
  await wait(5000);
  return sent.slice(k).filter(([e,d])=>d&&d.Type==='Whisper'&&d.Target===mn).map(([e,d])=>String(d.Content)).filter(t=>/^\(\*/.test(t)&&!OPEN.test(t));
}
(async()=>{ await wait(3500);
  chars[1].Name='Moo'; chars[2].Name='Rex'; chars[3].Name='Vixen';
  W.__ms();   // makes the prod records
  const P=mn=>L().people[mn].prod;
  // Moo: a cow, pregnant, huge (level 8) pierced breasts
  P(500).size={udder:8}; P(500).preg={due:Date.now()+86400000,sires:[600],at:Date.now()};
  chars[1].Appearance=[{Asset:{Name:'BarbellPiercing',Group:{Name:'ItemNipplesPiercings'}}}];
  P(500).milk=1e9;   // as full as they get
  const moo=await session(500, 5);
  const mooAll=moo.join('\n');
  ok(moo.length>=40, 'Moo: a full session ('+moo.length+' lines)');
  ok(/cups|nipple|breast/i.test(moo[0]) && !/\b(sleeves?|cocks?)\b/i.test(mooAll), 'Moo: all about her breasts, never a cock');
  ok(/belly|litter|carrying/i.test(mooAll), "Moo: her pregnancy comes into it");
  ok(/massive|enormous|huge|extra-wide|colossal|vast|dinner plates|half the stall|padded shelf|sling/i.test(mooAll), 'Moo: her huge breasts come into it');
  ok(/ring|piercing|jewelry|metal/i.test(mooAll) || moo.length<45, 'Moo: her nipple piercings come into it');
  ok(!/%\w/.test(mooAll), 'Moo: no placeholder left in any line');
  // seen live: "up-cup chest" (%c ate the start of %cup), and %s would do the same to %size
  ok(!/\bup-cup\b|(moo|moan|whimper|gasp|bleat|whinny|nicker|grunt|whine|yip|mewl|purr|mew|snort|bellow|giggle)ize\b/i.test(mooAll), 'Moo: sizes and cups come out as words ("massive", "J-cup")');
  // Rex: a dog, cock only (milkable off), knotted canine, big balls
  L().people[600].prod.hasPenis=true; P(600).size={testes:8,penis:9}; P(600).semen=1e9;
  const rex=await session(600, 15);
  const rexAll=rex.join('\n');
  ok(rex.length>=30, 'Rex: a full session ('+rex.length+' lines)');
  ok(/sleeve/i.test(rex[0]) && !/\b(breasts?|nipples?|udders?)\b/i.test(rexAll), 'Rex: all about his cock, never breasts');
  ok(/canine|knot|tapered/i.test(rexAll), 'Rex: his canine cock and knot come into it');
  const firstCum=rex.findIndex(t=>/first thick pulse/.test(t)), peak=rex.findIndex(t=>/knot swells to its fullest/.test(t)), second=rex.findIndex(t=>/second load/.test(t));
  ok(firstCum>0 && peak===firstCum+1 && (second<0 || second>peak), 'Rex: climaxes in order, his knot locking right after the first');
  ok(/tail wags|whine|ears flatten/i.test(rexAll) || rex.length<35, 'Rex: dog touches (tail, whines)');
  ok(!/%\w/.test(rexAll), 'Rex: no placeholder left');
  // Vixen: a horse futa, both milk and cock, flared equine, degradation on
  P(700).size={udder:5,penis:14,testes:4}; P(700).milk=1e9; P(700).semen=1e9;
  const vix=await session(700, 25);
  const vixAll=vix.join('\n');
  ok(vix.length>=30, 'Vixen: a full session ('+vix.length+' lines)');
  ok(/breast|nipple|cups/i.test(vixAll) && /sleeve|cock/i.test(vixAll), 'Vixen: both her breasts and her cock');
  ok(/flare|horse|equine/i.test(vixAll), 'Vixen: her flared horse cock comes into it');
  ok(/of milk and .* of seed|in the bucket, .* in the jar|of milk, .* of cum|and .*, and one very dazed/i.test(vix[vix.length-1]), 'Vixen: the finish counts milk and seed');
  ok(/leaky|pathetic|dumb|shameless|livestock doesn't think|greedy|mindless|good for one thing|all you're good for|stand here all day/i.test(vixAll), 'Vixen: degradation now and then (she asked for it)');
  ok(!/%\w/.test(vixAll), 'Vixen: no placeholder left');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
