+++
authors = []
date = "2023-01-16"
lastmod = "2023-01-16"
title = "How to create a convex hull in QGIS 3"
summary = "The convex hull or convex envelope or convex closure of a shape is the smallest convex set that contains it."
tags = ["qgis", "tutorial", "convex hull", "geometry"]
language = "en"
draft = false
mermaid = false
ogimage = "post/images/qgis-dark-osm.jpg"
slug = "tutorial-qgis-create-convex-hull"

+++

In this tutorial I'll show you how to use QGIS 3 to create a convex hull for both a single geometry and a bunch of sparse geometries.

{{< youtube oXO-joRGbSY >}}

<br>

## 🔴 What is a convex hull?

The convex hull or convex envelope or convex closure of a shape is the smallest convex set that contains it. 

## 🔴 What is QGIS?

QGIS is a professional GIS application that is built on top of and proud to be itself Free and Open Source Software (FOSS).

In QGIS 3 the convex hull command is under the Geoprocessing tools in the Vector menu. If you need to work with multiple features you will need the Minimum bounding polygon algorithm in the Processing Toolbox.