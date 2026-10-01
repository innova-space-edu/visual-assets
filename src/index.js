import registry from "../registry.json" with { type: "json" };
import core from "../packs/core.json" with { type: "json" };
import science from "../packs/science.json" with { type: "json" };
import layout from "../packs/layout.json" with { type: "json" };
import technical from "../packs/technical.json" with { type: "json" };
import procedural from "../packs/procedural.json" with { type: "json" };
import typography from "../packs/typography.json" with { type: "json" };
import maps from "../packs/maps.json" with { type: "json" };
import icons from "../packs/icons.json" with { type: "json" };
import editorial from "../packs/editorial.json" with { type: "json" };
import ui from "../packs/ui.json" with { type: "json" };
import biology from "../packs/biology.json" with { type: "json" };
import physics from "../packs/physics.json" with { type: "json" };
import chemistry from "../packs/chemistry.json" with { type: "json" };
import math from "../packs/math.json" with { type: "json" };
import shapes from "../packs/shapes.json" with { type: "json" };

const packs = new Map([["core",core],["science",science],["layout",layout],["technical",technical],["procedural",procedural],["shapes",shapes],["math",math],["chemistry",chemistry],["physics",physics],["biology",biology],["ui",ui],["editorial",editorial],["icons",icons],["maps",maps],["typography",typography]]);

export function listPacks(){
  return registry.packs.slice();
}

export function getAsset(id){
  for(const pack of packs.values()){
    const asset=pack.assets.find(function(x){return x.id===id;});
    if(asset) return structuredClone(asset);
  }
  return null;
}

export function searchAssets(query,options={}){
  const q=String(query||"").toLowerCase().trim();
  const tags=Array.isArray(options.tags)?options.tags.map(function(x){return String(x).toLowerCase();}):[];
  const out=[];
  for(const pack of packs.values()){
    for(const asset of pack.assets){
      const hay=[asset.id,asset.name,asset.category].concat(asset.tags||[]).join(" ").toLowerCase();
      if(q && !hay.includes(q)) continue;
      if(tags.length && !tags.every(function(t){return (asset.tags||[]).map(function(x){return x.toLowerCase();}).includes(t);})) continue;
      out.push(structuredClone(asset));
    }
  }
  return out;
}

export function resolveAsset(id,params={}){
  const asset=getAsset(id);
  if(!asset) throw new Error("Unknown visual asset: "+id);
  if(asset.kind==="parametric"){
    return {assetId:id,kind:"parametric",generator:asset.generator,params:Object.assign({},asset.defaults||{},params),license:asset.license};
  }
  return Object.assign({},asset,{params:Object.assign({},params)});
}

export function registerRuntimePack(name,pack){
  if(!name || !pack || !Array.isArray(pack.assets)) throw new Error("Invalid runtime pack");
  packs.set(name,structuredClone(pack));
}

export { recordAssetUsage, getAssetUsage, rankAssets, exportAssetLearning, importAssetLearning } from "./learning.js";
