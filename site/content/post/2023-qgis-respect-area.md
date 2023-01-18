+++
authors = []
date = "2023-01-18"
lastmod = "2023-01-18"
title = "How to create a respect area in QGIS 3 to manage an hazardous event"
summary = "Let's create a respect area starting from an event point and using buffer and difference vector processing tools."
tags = ["qgis", "tutorial", "respect area", "buffer", "vector", "urban planning", "basemap", "layer", "geometry"]
language = "en"
draft = false
mermaid = false
ogimage = "post/images/qgis-dark-osm.jpg"
slug = "tutorial-qgis-respect-area"

+++
In this tutorial I'll show you how to use QGIS 3 to create a respect area starting from an event point and using buffer and difference vector processing tools.

{{< youtube IgvFj0Knf54 >}}

<br>

## 🔴 What is a RESPECT AREA❓

A respect area is a zone around a point which have some law regulation applied. Think about deactivating a bomb from the WW2: you need to evacuate a lot of people around the place, and also you have to alert other people living in a very vast area around the event.

How do you know who to alert and who to evacuate? How do you know which roads should be closed? Let's apply the GIS power to this need.

## 🔴 What is QGIS?

QGIS is a professional GIS application that is built on top of and proud to be itself Free and Open Source Software (FOSS).
