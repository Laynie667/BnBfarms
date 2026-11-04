// Nov 4, Phase 1: the command book (bot/src/parts/01b-commands.js). Every ?command is written down once, with who
// may use it and whether its answer stays private. Nothin' may change for players: the book has to give back
// exactly the lists the parser used to keep by hand, and every command in it has to have somebody answering it.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],ribbons:40}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221397,500].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:W.Player.FriendList.map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,500]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const since=(mn,n)=>sent.slice(n).filter(s=>(s[0]==='AccountBeep'&&s[1].MemberNumber===mn)||(s[1]&&s[1].Type==='Whisper'&&s[1].Target===mn)).map(s=>s[1].Message||s[1].Content).join(' | ');
const room=(n)=>sent.slice(n).filter(s=>s[0]==='ChatRoomChat'&&s[1]&&(s[1].Type==='Chat'||s[1].Type==='Emote')&&!s[1].Target).map(s=>s[1].Content).join(' | ');
const chat=async(mn,msg)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Chat',Content:msg}); await wait(5600); };   // (past the 5 s between commands)
const beep=async(mn,msg)=>{ handlers.AccountBeep({MemberNumber:mn,Message:msg}); await wait(5600); };

// the lists exactly as 14-parser.js, 07b-companion-sync.js and 15-commands.js kept them before the book (Bot 0.70.0)
const PUBLIC=["help","commands","info","guide","rules","consent","tour","species","luxury","doors","ping","apply","record","keys","who","herd","safe","safeword","red","report","staff","stuck","friend","notice","teaseme","tease","dressme","dress","hypnotize","hypnotise","allow","letgo","echs","roam","stats","board","pedigree","breedable","fertile","mpreg","naturalheat","breed","cum","milkable","seedmilk","outfitwheel","dresswheel","wheeloutfit","grooming","futa","size","sizes","measure","penis","cock","rights","accept","freeuse","jarok","gender","outfit","outfits","uniform","hypno","tally","eggs","yes","no","wash","quota","praise","degrade","weather","feeding","curfew","beg","please","fair","enter","addons","addon","ribbons","ribbon","store","buy","messes","ownoutfit","myoutfit","chest","gift","potions","potion","dares","dare","dared","bench","use","feedback","suggest","idea","bug","meh","more","today","subject","subjects","traps","trap","watersports","parasite","symbiote","symbiotes","struggle","free","goad","hunt","lay","gather","pack","watersport","parasites","eager","quiet","tend","brood","bet","cleanse","corruption","gauntlet","lend","bid","route","mysterybox","suit","whistle","send","dose","herdtraps","sit","broody","album","holes","vat","stalldial","bringin","bedrest","callme","nevercall","intensity","keep","kept","seasons","calendar","trickortreat","tot","stocking","stockings","egghunt","rate","renew","renewal","renewals","services","service","coax","nursery","little","care","kryptonite","myshots","shotsin","feats","feat","achievements","perks","perk"];
const STAFF=["queue","app","approve","deny","register","unregister","grant","revoke","claim","release","myherd","herdname","herdcall","herdsummon","turnout","letup","goldkey","pasture","onduty","cover","staffadd","staffremove","backup","staffhelp","note","keysync","keydump","where","roster","stock","find","signed","setrescue","stucklog","addfriend","forced","summon","health","tier","vet","brand","spot","spots","appclear","milk","collect","heat","heatline","shotlog","stocks","unstock","walk","reins","tourstop","clockin","clockout","hours","done","chore","chores","wheel","spin","begphrase","score","drain","denial","ruin","jars","inseminate","nomilk","inspect","edge","contract","contracts","zone","zones","voice","machine","edit","corral","uncorral","unbench","purge","away"];
const PRIVATE=["feats","feat","achievements","perks","perk","kryptonite","myshots","shotsin","today","feedback","suggest","idea","bug","meh","more","record","keys","find","app","queue","roster","stock","health","myherd","herd","stucklog","keydump","summon","where","cover","vet","spot","spots","tease","teaseme","stats","pedigree","hours","chores","wheel","tourstop","quota","contract","contracts"];
const SAFETY=["safe","safeword","red","stuck"], NOW=["safe","safeword","red","stuck","report","staff"], PLAY=["milk","edge","drain"];
const DOC=["record","stats","vet","quota","keys","size","measure","pedigree"];
const WORDS=["feedback","suggest","idea","bug","meh","more","report","notice","dare","contract","voice","heatline","tease","begphrase","beg","chore","edit","wheel","store","note"];   // (+ jot and say, bot parts' own)
const INTERVIEW=["help","rules","consent","tour","species","luxury","doors","safe","safeword","red","stuck","staff"];

(async()=>{ await wait(3500);
  const B=W.__commands, words=(f)=>[...B.keys()].filter(w=>f(B.get(w))).sort().join(' ');
  const same=(f,list,what)=>{ const a=words(f), b=[...new Set(list)].sort().join(' ');
    const extra=a.split(' ').filter(w=>w&&!list.includes(w)), missing=list.filter(w=>!a.split(' ').includes(w));
    ok(a===b, what+(a===b?'':' (extra: '+extra.join(' ')+' · missing: '+missing.join(' ')+')')); };
  ok(W.__commandClash.length===0, 'no word is written down twice: '+W.__commandClash.join(' '));
  same(e=>!e.staff, PUBLIC, 'everybody\'s commands are the same '+PUBLIC.length);
  same(e=>e.staff, STAFF, 'staff commands are the same '+STAFF.length);
  same(e=>e.private, PRIVATE, 'the private answers are the same');
  same(e=>e.safety, SAFETY, 'safety commands are the same');
  same(e=>e.now, NOW, 'the never-wait commands are the same');
  same(e=>e.stockPlay, PLAY, 'stock-on-stock commands are the same');
  same(e=>e.doc, DOC, 'the Office lookups are the same');
  same(e=>e.words, WORDS, 'the free-text commands are the same');
  same(e=>e.interview, INTERVIEW, 'the mid-application ones are the same');
  // somebody answers every one: its own part (run) or a case in the big switch
  const sw=fs.readFileSync(path.join(__dirname,'../bot/src/parts/15-commands.js'),'utf8');
  const orphan=[...B.keys()].filter(w=>!B.get(w).run && !sw.includes('case "'+w+'":'));
  ok(!orphan.length, 'every command is answered (by its part, or the switch): '+orphan.join(' '));
  const twice=[...B.keys()].filter(w=>B.get(w).run && sw.includes('case "'+w+'":'));
  ok(!twice.length, 'and none is answered in two places: '+twice.join(' '));
  ok([...B.values()].every(e=>e.topic), 'every command has a topic');

  // and it all still answers the same way
  let n=sent.length; await chat(500,'?feats');
  ok(/Dairy|feat/i.test(since(500,n)) && !/Dairy/.test(room(n)), '?feats asked in the room: answered privately, by its own part');
  n=sent.length; await beep(500,'?store');
  ok(/FARM STORE/.test(since(500,n)), '?store, from its own part (10l-ribbons.js)');
  n=sent.length; await beep(500,'?queue');
  ok(/just for farm staff/.test(since(500,n)), 'a staff command from stock: just for farm staff');
  n=sent.length; await beep(500,'?adons');
  ok(/Did you mean \?addons/.test(since(500,n)), 'a near miss still gets "did you mean"');
  n=sent.length; await beep(500,'?watersport');
  ok(/watersports/i.test(since(500,n)), '?watersport still reads as ?watersports');
  n=sent.length; await beep(221397,'?queue');
  ok(/queue|application/i.test(since(221397,n)), 'staff get the queue');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
