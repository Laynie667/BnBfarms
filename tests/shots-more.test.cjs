// Oct 30 (Laynie): more in the needle — new effects, triggered/roulette/drip injectors, piercings, kryptonite, ?myshots
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,milkable:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],gender:"female"},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"bull"})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10)];
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
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn], prod=mn=>W.__prodOf(mn);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms,type)=>{ handlers.ChatRoomMessage({Sender:mn,Type:type||'Whisper',Content:msg,Target:type==='Chat'?undefined:260239}); await wait(ms||1500); };
const txt=([e,d])=>d&&(d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message||''));
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(txt).join(' | ');
const wear=(mn,group,name)=>{ chars.find(c=>c.MemberNumber===mn).Appearance.push({Asset:{Name:'Thing',Group:{Name:group}},Craft:{Name:name,Description:''}}); };
const shot=(t,text)=>W.__applyShot(t,600,text);
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  ['Laynie','Moo','Rex'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [221397,500,600]) await say(mn,'?stats',500);
  const now=()=>Date.now();
  // ── the new effects ──
  shot(500,'Aphrodisiac Shot'); ok(W.__potionOn(500,'needy'), 'aphrodisiac: Needy Nectar');
  shot(500,'Hair Trigger Serum'); ok(prod(500).boosts.trigger>now(), 'hair trigger');
  shot(500,'Denial Serum'); ok(prod(500).deniedUntil>now()+60*60000, 'denial serum: two hours at the edge');
  shot(600,'Cum Flood x2'); ok(prod(600).boosts.flood>now() && prod(600).boostX.flood===2, 'cum flood, double dose');
  const s0=W.__slow(500); shot(500,'Sedative'); ok(W.__slow(500)>=s0+0.7, 'sedative: slower on her feet ('+s0+' → '+W.__slow(500)+')');
  shot(500,'Futa Serum'); ok(P(500).futa===true && P(500).futaShot, 'futa serum: a cock for a day');
  P(500).futaShot.until=now()-1; W.__shotsTick(); ok(P(500).futa===false, '...and it wears off');
  const u0=prod(500).size&&prod(500).size.udder; shot(500,'Temporary Udder Growth'); const u1=prod(500).size.udder;
  ok(u1>(u0||0) && (prod(500).tempSize||[]).length===1, 'temporary udder growth ('+u0+' → '+u1+')');
  prod(500).tempSize[0].until=now()-1; W.__shotsTick(); ok(prod(500).size.udder===u0 && !prod(500).tempSize.length, '...snaps back');
  shot(500,'Strawberry Milk Booster'); ok(prod(500).milkFlavor && prod(500).milkFlavor.k==='strawberry', 'strawberry milk');
  shot(500,'Twins Serum'); shot(500,'Ripening Shot');
  ok(prod(500).boosts.twins>now() && prod(500).boosts.ripe>now(), 'twins and ripe');
  const res=W.__conceive(500,600,50,1,'vulva'); ok(res==='new' && prod(500).preg && prod(500).preg.count>=2, 'ripe: the next load takes, and it\'s twins ('+(prod(500).preg&&prod(500).preg.count)+')');
  ok(!prod(500).boosts.ripe && !prod(500).boosts.twins, '...both used up');
  let n=sent.length; await say(500,'?myshots',1200); ok(/Hair trigger/.test(all(n)) && /strawberry milk/.test(all(n)), '?myshots lists them');
  shot(500,'Purge Serum'); ok(!prod(500).boosts.trigger && !prod(500).deniedUntil && !prod(500).milkFlavor, 'purge: flushed');
  // ── kryptonite ──
  n=sent.length; await say(221397,'?kryptonite set honeybee',1200,'Chat'); ok(!P(221397).kryptonite && /Not out loud/.test(all(n)), 'set out loud in chat: refused');
  await say(221397,'?kryptonite set honeybee',1200); ok(P(221397).kryptonite && P(221397).kryptonite.word==='honeybee', 'whispered: set');
  n=sent.length; await say(500,'?kryptonite',1200); ok(/Laynie/.test(all(n)) && /“H”/.test(all(n)) && !/honeybee/.test(all(n)), 'the rumour board hints, never tells');
  const rb=P(600).ribbons||0; shot(221397,'Honeybee Tonic'); await wait(2500);
  ok(W.__kryptoNow(221397), 'a needle with her word: Laynie is stock');
  ok((P(600).ribbons||0)>rb, 'Rex gets ribbons for findin\' it');
  shot(221397,'Lactation'); ok(prod(221397).boostX && prod(221397).boostX.milk>=2, 'while she\'s down, a shot hits double');
  W.__addons('safe',221397); ok(!W.__kryptoNow(221397), 'her safeword ends it');
  // on an auto-injector piercing
  cfg.AUTOINJECT_MIN=0.0005; cfg.SHOTS2.DRIP_MIN=0.0005; wear(221397,'ItemNipplesPiercings','Honeybee Auto-Injector Ring');
  W.__trapTick(); await wait(200); W.__trapTick(); await wait(200);
  ok(W.__kryptoNow(221397), 'an auto-injector piercing with her word works too');
  W.__addons('safe',221397); chars.find(c=>c.MemberNumber===221397).Appearance=[];
  // ── triggered, roulette, drip ──
  shot(500,'Purge Serum');
  wear(500,'ItemVulvaPiercings','Breeder\'s Ring, when bred: fertility');
  W.__trapTick(); await wait(100); W.__trapTick(); ok(!prod(500).boosts.fert, 'a triggered one doesn\'t go off on the clock');
  W.__shotTrigger(500,'bred'); ok(prod(500).boosts.fert>now(), '...it goes off when she\'s bred');
  chars.find(c=>c.MemberNumber===500).Appearance=[];
  shot(500,'Purge Serum'); wear(500,'ItemNipplesPiercings','IV drip lactation virility');
  n=sent.length; W.__trapTick(); await wait(100); W.__trapTick(); await wait(300);
  ok(prod(500).boosts.milk>now(), 'a drip tops her up');
  ok(!sent.slice(n).some(x=>/drip/.test(txt(x)) && x[1].Type==='Emote'), '...quietly');
  chars.find(c=>c.MemberNumber===500).Appearance=[];
  wear(600,'ItemNipplesPiercings','Roulette Auto-Injector');
  const before=JSON.stringify(prod(600).boosts)+JSON.stringify(prod(600).size)+JSON.stringify(P(600).fx||{})+P(600).futa;
  for (let i=0;i<6;i++){ W.__trapTick(); await wait(150); }
  ok(before!==JSON.stringify(prod(600).boosts)+JSON.stringify(prod(600).size)+JSON.stringify(P(600).fx||{})+P(600).futa, 'roulette: somethin\' random went in');
  ok(!warns.some(w=>/TypeError|ReferenceError/.test(w) && !/Worker|CustomEvent/.test(w)), 'no errors ('+warns.filter(w=>/Error/.test(w)&&!/Worker|CustomEvent/.test(w)).slice(0,2).join(' / ')+')');
  out(fails ? 'FAILED '+fails : 'ALL PASSED'); process.exit(fails?1:0);
})();
