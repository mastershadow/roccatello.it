+++
authors = []
date = "2023-01-28"
lastmod = "2023-01-28"
title = "A short guide to QGIS 3 text delimited data file import: your layers from Excel CSV files"
summary = "A text delimited file is a file which contains data organized per rows and columns, in order to build a data storage structure."
tags = ["qgis", "tutorial", "crs", "import", "text", "csv", "geometry"]
language = "en"
draft = false
mermaid = false
ogimage = "post/images/qgis-dark-osm.jpg"
slug = "tutorial-qgis-import-text-files"

+++
In this tutorial we will discover how to use QGIS 3 to import data using a text delimited file, which may be a CSV exported from Excel or LibreOffice.

We will discover to to set attributes and how to build a correct geometry from the data rapidly and easily.

{{< youtube AlRvGQs13L0 >}}

<br>

## TEXT DELIMITED FILES❓
A text delimited file is a file which contains data organized per rows and columns, in order to build a data storage structure.
The two most common file types are CSV, which uses a comma as separator and TSV, which uses a tabulation as separator. Separator characters are usually escaped if contained in data and fields may be surrounded by double quotes. Also you may have column names in the first row of the file.
Text delimited files are a common way to import / export data from many software.


## 🔴 What is QGIS?

QGIS is a professional GIS application that is built on top of and proud to be itself Free and Open Source Software (FOSS).
