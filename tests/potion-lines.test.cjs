// Oct 14: every potion, drunk three times by every kind of body. What the room sees (and what the drinker is told) fits
// the body that drank it, never clinical, nothing leaking, and the room sees it a different way most times.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const stock=(mn,name,gender,species,x)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species,gender,onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,ribbons:10,potionsOn:true},x||{});
const BODIES=[[500,"Moo","female","cow"],[600,"Rex","male","cow"],[700,"Fae","femboy","bunny"],[800,"Fu","futa","pony",{futa:true}],[900,"Bea","female","pony"],[910,"Hob","male","goblin"]];
const people={"221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],ribbons:30}};
for (const [mn,name,g,sp,x] of BODIES) people[mn]=stock(mn,name,g,sp,x);
store.bnb_ledger_v1=JSON.stringify({v:4,people,applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pasture":{X:20,Y:40}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10)].concat(BODIES.map(([mn],i)=>at(mn,15+i*10,10)));
const W={document:doc,addEventListener(){},dispatchEvent(){},CustomEvent:class{},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>{ const t=a.join(' '); if(!/Worker/.test(t)) warns.push(t); }};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const textOf=([e,d])=>{ if(!d) return null; if(typeof d.Content==='string') return d.Content; if(e==='AccountBeep') return String(d.Message||''); return null; };
const VULVA=/\b(pussy|pussies|cunt|cunts|slit|womb|clit|cervix)\b/i, TITS=/\b(tits?|titties|breasts?|udders?|teats?|cleavage)\b/i;
const CLINICAL=/\b(lactat\w*|mammar\w*|secretion|ejaculat\w*|genital\w*|vagina\w*|penis(es)?|semen|urethra\w*|anus|rectum|uterus|ovar\w*|testicles?|scrotum|areolae?|labia|intercourse|copulat\w*)\b/i;
const LEAK=/\{(nv|nc|nt|fu|fb|v|c|t|f|m)\}|%[a-z]{1,8}\b|\bundefined\b|\bNaN\b|\[object|\bnull\b/;
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.SEND_INTERVAL_MS=2;
  chars[1].Name='Laynie'; BODIES.forEach(([mn,name],i)=>chars[i+2].Name=name);
  const ids=['clover','golden','musk','honey','brood','bitterroot','heavy','moo','bell','needy','danger','tentaclemusk','wolfscent','mareheat','sowslop','hiccup','feather','wrongbarn','bigbritches','shrink','echo','heatmist'];
  const seenBy={}, probs=[];
  for (const [mn,name] of BODIES){
    const b=W.__body(mn);
    for (const id of ids) for (let k=0;k<3;k++){
      P(mn).fx={}; const n=sent.length; W.__givePotion(mn,id,221397); await wait(20);
      for (let i=0;i<40 && (W.__st().queue.length||W.__st().urgent.length);i++) await wait(10);
      for (const t of sent.slice(n).map(textOf).filter(Boolean)){
        if (/^\(?\*/.test(t) && t.includes(name)) (seenBy[id]=seenBy[id]||new Set()).add(t.replace(name,'%n'));
        const u=t.replace(/like (a|any other) teat/gi,'').replace(/Heavy Udder Draught/g,'');   // (a bottle's name is its name)
        const why=[]; if(!b.vulva&&VULVA.test(t)) why.push('pussy word: '+t.match(VULVA)[0]); if(!b.tits&&TITS.test(u)) why.push('tit word: '+u.match(TITS)[0]);
        if(CLINICAL.test(t)) why.push('clinical: '+t.match(CLINICAL)[0]); if(LEAK.test(t)) why.push('leak: '+t.match(LEAK)[0]);
        if(why.length) probs.push(name+' '+id+': '+why.join('; ')+' :: '+t.slice(0,160));
      }
    }
  }
  for (const p of probs.slice(0,20)) out('  '+p);
  ok(!probs.length, 'every potion fits the body that drank it: no part they lack, nothing clinical, nothing leaking ('+probs.length+')');
  const thin=ids.filter(id=>!seenBy[id] || seenBy[id].size<3);
  ok(!thin.length, 'the room sees each potion go down at least three different ways ('+(thin.join(', ')||'all')+')');
  const errs=warns.filter(w=>/potion|TypeError|ReferenceError/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all good'); process.exit(fails?1:0);
})();
