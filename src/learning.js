const stats=new Map();

function initial(id){
  return {id,samples:0,inserted:0,kept:0,removed:0,exports:0,meanEdits:0,score:.5,lastUsed:0};
}

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
  const meanEdits=samples<=1?edits:prev.meanEdits+(edits-prev.meanEdits)/samples;
  const keepRate=(kept+1)/(samples+2);
  const exportRate=(exports+1)/(samples+2);
  const editPenalty=1/(1+meanEdits*.1);
  const confidence=1-Math.exp(-samples/10);
  const raw=.55*keepRate+.25*exportRate+.20*editPenalty;
  const score=.5*(1-confidence)+raw*confidence;
  const next={id,samples,inserted,kept,removed,exports,meanEdits,score,lastUsed:Date.now()};
  stats.set(id,next);
  return structuredClone(next);
}

export function getAssetUsage(id){
  return structuredClone(stats.get(id)||initial(id));
}

export function rankAssets(ids){
  return ids.map(getAssetUsage).sort((a,b)=>b.score-a.score||b.samples-a.samples||a.id.localeCompare(b.id));
}

export function exportAssetLearning(){
  return {version:"1.0",updatedAt:Date.now(),stats:Object.fromEntries(stats)};
}

export function importAssetLearning(snapshot){
  if(!snapshot||snapshot.version!=="1.0")throw new Error("Unsupported asset learning snapshot");
  stats.clear();
  Object.entries(snapshot.stats||{}).forEach(([id,value])=>stats.set(id,structuredClone(value)));
}
