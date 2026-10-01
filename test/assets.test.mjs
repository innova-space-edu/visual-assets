import test from "node:test";
import assert from "node:assert/strict";
import { getAsset, resolveAsset, searchAssets, recordAssetUsage, rankAssets, rankAssetsForContext, recommendAssetsForContext } from "../src/index.js";

test("resolves original parametric asset", function(){
  const a=getAsset("math.axes.cartesian");
  assert.equal(a.kind,"parametric");
  const r=resolveAsset("math.axes.cartesian",{step:25});
  assert.equal(r.params.step,25);
});

test("searches semantic tags", function(){
  const found=searchAssets("chemistry");
  assert.ok(found.length>=2);
});

test("technical and procedural packs resolve",()=>{
  assert.ok(getAsset("technical.dimension.linear"));
  assert.ok(getAsset("procedural.pattern.dots"));
  assert.equal(resolveAsset("procedural.pattern.dots",{seed:"abc"}).params.seed,"abc");
});


test("V4 semantic packs and adaptive usage are available",()=>{
  assert.ok(getAsset("ui.card"));
  assert.ok(getAsset("math.geometry.homothety"));
  assert.ok(getAsset("biology.eye.cross-section"));
  for(let i=0;i<5;i++)recordAssetUsage({assetId:"ui.card",kept:true,exported:true,edits:1});
  assert.equal(rankAssets(["ui.card","icon.info"])[0].id,"ui.card");
});


test("contextual learning can prefer different assets by use case",async()=>{
  for(let i=0;i<10;i++)recordAssetUsage({assetId:"ui.card",kept:true,exported:true,edits:1,context:"dashboard"});
  for(let i=0;i<10;i++)recordAssetUsage({assetId:"icon.info",kept:false,removed:true,edits:3,context:"dashboard"});
  assert.equal(rankAssetsForContext(["ui.card","icon.info"],"dashboard")[0].id,"ui.card");
  const recommended=await recommendAssetsForContext("ui","dashboard");
  assert.ok(recommended.length>0);
});
