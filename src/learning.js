const stats=new Map();
const contextStats=new Map();

function initial(id){
  return {id,samples:0,inserted:0,kept:0,removed:0,exports:0,meanEdits:0,score:.5,lastUsed:0};
}
function contextKey(assetId,context){
  const key=String(context||"global").trim().toLowerCase().replace(/\s+/g,"-");
  return assetId+"::"+key;
}
function mean(prev,count,value){return count<=1?value:prev+(value-prev)/count;}
function clamp(value){return Math.max(0,Math.min(1,value));}

export function recordAssetUsage(input){
  if(!input||!input.assetId)throw new Error("assetId is required");
  const id=String(input.assetId);
  const prev=stats.get(id)||initial(id);
  const samples=prev.samples+1;
  const inserted=prev.inserted+(input.inserted===false?0:1);
  const kept=prev.kept+(input.kept?1:0);
  const removed=prev.removed+(input.removed?1:0);
  const exports=prev.exports+(input.exported?1:0);
  const edits=Number.isFinite(input.edits)?Math.max(0,input.edits):prev.meanEdits;
  const meanEdits=mean(prev.meanEdits,samples,edits);
  const keepRate=(kept+1)/(samples+2);
  const exportRate=(exports+1)/(samples+2);
  const editPenalty=1/(1+meanEdits*.1);
  const confidence=1-Math.exp(-samples/10);
  const raw=.55*keepRate+.25*exportRate+.20*editPenalty;
  const score=.5*(1-confidence)+raw*confidence;
  const next={id,samples,inserted,kept,removed,exports,meanEdits,score,lastUsed:Date.now()};
  stats.set(id,next);

  const contexts=Array.isArray(input.contexts)?input.contexts:(input.context?[input.context]:[]);
  for(const context of contexts){
    const key=contextKey(id,context);
    const old=contextStats.get(key)||{assetId:id,context:String(context),samples:0,positive:0,negative:0,exports:0,meanEdits:0,score:.5,lastUsed:0};
    const cs=old.samples+1;
    const positive=old.positive+(input.kept?1:0);
    const negative=old.negative+(input.removed?1:0);
    const cexports=old.exports+(input.exported?1:0);
    const cmean=mean(old.meanEdits,cs,edits);
    const cconfidence=1-Math.exp(-cs/8);
    const acceptance=(positive+1)/(cs+2);
    const exportScore=(cexports+1)/(cs+2);
    const contextScore=.5*(1-cconfidence)+(.6*acceptance+.25*exportScore+.15*(1/(1+cmean*.1)))*cconfidence;
    contextStats.set(key,{assetId:id,context:String(context),samples:cs,positive,negative,exports:cexports,meanEdits:cmean,score:contextScore,lastUsed:Date.now()});
  }

  return structuredClone(next);
}

export function getAssetUsage(id){
  return structuredClone(stats.get(id)||initial(id));
}

export function rankAssets(ids){
  return ids.map(getAssetUsage).sort((a,b)=>b.score-a.score||b.samples-a.samples||a.id.localeCompare(b.id));
}

export function getAssetContextUsage(id,context){
  return structuredClone(contextStats.get(contextKey(id,context))||{assetId:id,context:String(context),samples:0,positive:0,negative:0,exports:0,meanEdits:0,score:.5,lastUsed:0});
}

export function rankAssetsForContext(ids,context){
  return ids.map(id=>{
    const global=getAssetUsage(id);
    const local=getAssetContextUsage(id,context);
    const localWeight=clamp(local.samples/12);
    return {
      id,
      score:global.score*(1-localWeight)+local.score*localWeight,
      globalScore:global.score,
      contextScore:local.score,
      contextSamples:local.samples
    };
  }).sort((a,b)=>b.score-a.score||b.contextSamples-a.contextSamples||a.id.localeCompare(b.id));
}

export function exportAssetLearning(){
  return {version:"2.0",updatedAt:Date.now(),stats:Object.fromEntries(stats),contextStats:Object.fromEntries(contextStats)};
}

export function importAssetLearning(snapshot){
  if(!snapshot||!["1.0","2.0"].includes(snapshot.version))throw new Error("Unsupported asset learning snapshot");
  stats.clear();contextStats.clear();
  Object.entries(snapshot.stats||{}).forEach(([id,value])=>stats.set(id,structuredClone(value)));
  Object.entries(snapshot.contextStats||{}).forEach(([id,value])=>contextStats.set(id,structuredClone(value)));
}
