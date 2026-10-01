import test from "node:test";
import assert from "node:assert/strict";
import { getAsset, resolveAsset, searchAssets } from "../src/index.js";

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
