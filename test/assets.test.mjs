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
