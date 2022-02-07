+++
authors = []
date = "2022-02-07"
lastmod = "2022-02-07"
title = "Independent segment angle from direction"
summary = "A useful snippet to figure out the intersection angle of two segments using the direction vectors."
tags = ["coding", "javascript"]
language = "en"
draft = false

+++

Lately, I needed a function to find the impact angle of a direction on a segment.
This is the conceptual algorithm I've implemented in JavaScript using THREE.js as vector library.

Obviously, this is an unoptimized prototype, which I've ported to C++ (and optimized as well).

If you do not have the direction vectors, just compute them out using the normalization of the point subtraction.


```javascript
const d = new THREE.Vector3(0, 1, 0).normalize();
const o = new THREE.Vector3(-1, -1, 0).normalize();
const origin = new THREE.Vector3(0, 0, 0);

const side = function (a, b, p) {
  return (p.x - a.x) * (b.y - a.y) - (b.x - a.x) * (p.y - a.y);
};

const isCcw = side(origin, d, o) < 0;

let angle = NaN;
if (d.y < 0) {
  if (isCcw) {
    angle = Math.acos(d.dot(o));
  } else {
    angle = Math.acos(d.dot(o.negate()));
  }
} else {
  if (isCcw) {
    angle = Math.acos(d.dot(o.negate()));
  } else {
    angle = Math.acos(d.dot(o));
  }
}

console.log((angle * 180) / Math.PI);
```

If you like, you can find the [codepen here](https://codepen.io/mastershadow/pen/JjOGvRM).