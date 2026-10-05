// Glory stalls, more than one at once: two (sometimes three) strangers through different holes, each with
// their own cock, in an order that makes sense, every finish counted on its own hole.
const path=require('path');
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
(async()=>{
  const S=await import('file://'+path.join(__dirname,'../addons/glory-stalls/scenes.js').replace(/\\/g,'/'));
  const all=['mouth','vulva','butt'];
  let threes=0, mixedTypes=0, both=0, spit=0, dp=0, placeholders=[], orderBad=[], sameHole=0, tooFew=0;
  for (let n=0;n<300;n++){
    const holes=n%3===0?['vulva','butt']:all;
    const first=S.pickVisitor(holes); if (first.type==='double') first.type='human';
    const hole=holes[n%holes.length];
    const sc=S.buildScene({ hole, visitor:first, holes, length:'together' });
    if (sc.kind!=='together'){ tooFew++; continue; }
    const fin=sc.beats.filter(b=>b.finish), text=sc.beats.map(b=>b.t);
    if (fin.length<2) tooFew++;
    if (new Set(fin.map(b=>b.hole)).size!==fin.length) sameHole++;
    if (fin.length===3) threes++;
    if (new Set(fin.map(b=>b.visitor.type)).size>1) mixedTypes++;
    if (text.some(t=>/at the same moment|together|Two loads at once|let go together|same time|two places at once/.test(t) && /cumm|finish|flood|empty|loads/.test(t))) both++;
    if (fin.some(b=>b.hole==='mouth')) spit++; else dp++;
    for (const t of text){ const left=t.replace(/%n/g,''); if (/%\w/.test(left)) placeholders.push(t); }
    // order: every reveal before the first finish; the last beats are after the last finish
    const firstFin=sc.beats.findIndex(b=>b.finish), reveals=sc.beats.map((b,i)=>b.reveal?i:-1).filter(i=>i>=0);
    if (reveals.length!==fin.length || reveals.some(i=>i>firstFin) || !/hatch|Quiet|slumps|empty|strangers leave|knot/i.test(text[text.length-1])) orderBad.push(text.slice(-2).join(' / ').slice(0,160));
  }
  ok(tooFew===0, 'every together scene has two or more strangers finishing ('+tooFew+' short)');
  ok(sameHole===0, 'each stranger has their own hole');
  ok(threes>15, 'sometimes three at once ('+threes+' of 300)');
  ok(mixedTypes>100, 'strangers bring different kinds of cock ('+mixedTypes+' scenes mixed)');
  ok(both>30, 'sometimes two finish together ('+both+')');
  ok(spit>50 && dp>50, 'mouth-and-behind and pussy-and-ass both happen ('+spit+' / '+dp+')');
  ok(!placeholders.length, 'no placeholder left in any line'+(placeholders.length?': '+placeholders[0]:''));
  ok(!orderBad.length, 'the cocks show up before anyone finishes, and it ends after the last finish'+(orderBad.length?': '+orderBad[0]:''));
  // a funnel gag keeps the mouth out of it; one open hole means no together at all
  let mouthWithFunnel=0, together1=0;
  for (let n=0;n<100;n++){
    const sc=S.buildScene({ hole:'vulva', visitor:{type:'human',size:'thick'}, holes:['mouth','vulva','butt'], funnel:true, length:'together' });
    if (sc.beats.some(b=>b.finish&&b.hole==='mouth')) mouthWithFunnel++;
    const one=S.buildScene({ hole:'butt', visitor:{type:'human',size:'thick'}, holes:['butt'], length:'together' });
    if (one.kind==='together') together1++;
  }
  ok(mouthWithFunnel===0, 'a funnel gag keeps the mouth out of a together scene');
  ok(together1===0, 'with only one hole open there is no together scene');
  // without asking for it, together turns up now and then on its own
  let seen=0; for (let n=0;n<400;n++){ const sc=S.buildScene({ hole:'vulva', visitor:{type:'canine',size:'huge'}, holes:all }); if (sc.kind==='together') seen++; }
  ok(seen>30 && seen<140, 'together happens now and then on its own ('+seen+' of 400)');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
