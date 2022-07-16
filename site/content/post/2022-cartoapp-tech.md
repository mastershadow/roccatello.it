+++
authors = []
date = "2022-07-16"
lastmod = "2022-07-16"
title = "A technical introduction to carto.app"
summary = "A GIS Android app has a lot of stuff behing and it is amazingly complicated"
tags = ["carto", "app", "android"]
language = "en"
draft = false
mermaid = true
slug = "behind-carto-app-technical-review"

+++

Among all things I do at work, I'm leading the development of carto.app at [3DGIS](https://www.3dgis.it).

I've been designing and developing the app since 2019, but I never had time to explain how it works, technically speaking.

**carto.app does a lot of things**.<br>
For the end user it allows to use, manage and collect geospatial data on the field. It is incredible for data surveys, maintenance activities and to access the whole spatial dataset with a couple of taps.
It has a lot of user features, for instance:

* multiple maps with dynamic web mercator projection in order to overlay with Google Maps / Openstreetmap
* full data access to carto database (the remote one)
* linear referencing in real time
* geometry editing on mobile (for points, lines, polygons and their multi counterpart)
* campaign backed data collection
* traffic sign support

## How does it work?
carto.app relies on the 3DGIS mobile framework, which I'm developming since 2015.
Mobile framework is a foundation upon carto.app relies in order to build its business logic.

### What does the framework account?

* features, geometry and math
* spatial input output formats
* graphical geometry rendering (computational geometry algorithms)
* lifecycle management basics
* spatial database support

The first two bullets are straightforward but still not trivial. They require a lot of algoritms to be known by the team but once written they could be used just with trivial knowledge of the subject (for instance, you can call buffer() on a feature without knowing how to compute one).

The third one is challenging. Drawing geometries involves spatial projection, vector to raster conversion and clipping. Feature styling is also very hard to obtain in a reasonable amount of time (read it as FAST).

The fouth point accounts Android weirdness about lifecycle, permission and data sharing between activities and fragment. Unlike iOS, Android requires you take in account state and memory dumping.

Spatial database support is key feature of **carto.app**. We are using a custom version of a spatialite database, modified in order to run with Room ORM.

## Campaign management primer.<br>Or how we dynamically merge remote data with local data
One of the most user appreciated feature of carto.app is the way the app manages survey sessions.
Survey data is collected offline using the internal spatial database and organized in campaigns. A campaign is a survey session that can be uploaded to carto webGIS in order to be orchestrated with the main spatial infrastructure.

This allows operators to validate data before making them live and also to correct any possible conflict in data updates.

{{< mermaid >}}
    graph TD
    A[Remote data] --> B(Live data)
    C[Local data] --> B
{{< /mermaid >}}

This allows users to work on live data without any hassle.

But how does it work? Mainly we intercept every communication involving remote data and we update responses with local modification.

{{< mermaid >}}
    graph TD
    A[Request Remote data] --> B[Response Interceptor]
    B --> C[Check for local data]
    C --> D[Merge and replace data]
    D --> E[Returns data to caller]
{{< /mermaid >}}

## Conclusions

Developing a spatial app on a mobile platform is not hard as the multitude of apps you can find on the store demonstrates.
But delivering a desktop grade GIS experience on mobile is completely another different task.
In carto we manage data with complex relationships.
What happens when you update or clone a remote element on the app? 
Or... how do you draw a set of 100 raster layers keeping a reasonable amount of frames per second?

carto.app is designed to manage these cases. Reality is complex, way more than academia.
