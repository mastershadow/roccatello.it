+++
authors = ["Eduard Roccatello"]
date = "2022-02-21"
lastmod = "2022-02-21"
title = "Scale GIS raster data using gdal_translate"
summary = "The GIS paladin of raster data, gdal_translate, could solve your headaches when you want to reduce its scale from 16 bit per component to 8 bit per component."
tags = ["gis", "gdal"]
language = "en"
draft = false
slug = "gdal-translate-scale-raster-gis-data"
ogimage = "post/images/raster_dataset.png"

+++
Let's continue our journey into **gdal_translate** utility with another nice option.

## A moment... what is gdal_translate?

The **gdal_translate** utility can be used to convert raster data between different formats, potentially performing some operations like sub-settings, resampling, and rescaling pixels in the process.

Anyway, the syntax is not so simple, as you can see in the help screen:

```bash
gdal_translate [--help-general]
    [-ot {Byte/Int16/UInt16/UInt32/Int32/Float32/Float64/
            CInt16/CInt32/CFloat32/CFloat64}] [-strict]
    [-if format]* [-of format]
    [-b band]* [-mask band] [-expand {gray|rgb|rgba}]
    [-outsize xsize[%]|0 ysize[%]|0] [-tr xres yres]
    [-r {nearest,bilinear,cubic,cubicspline,lanczos,average,rms,mode}]
    [-unscale] [-scale[_bn] [src_min src_max [dst_min dst_max]]]* [-exponent[_bn] exp_val]*
    [-srcwin xoff yoff xsize ysize] [-epo] [-eco]
    [-projwin ulx uly lrx lry] [-projwin_srs srs_def]
    [-a_srs srs_def] [-a_coord_epoch <epoch>]
    [-a_ullr ulx uly lrx lry] [-a_nodata value]
    [-a_scale value] [-a_offset value]
    [-nogcp] [-gcp pixel line easting northing [elevation]]*
    |-colorinterp{_bn} {red|green|blue|alpha|gray|undefined}]
    |-colorinterp {red|green|blue|alpha|gray|undefined},...]
    [-mo "META-TAG=VALUE"]* [-q] [-sds]
    [-co "NAME=VALUE"]* [-stats] [-norat] [-noxmp]
    [-oo NAME=VALUE]*
    src_dataset dst_dataset
```

> Conceptually, you just need to do: 
> 
> **gdal_translate OPTIONS input output**

Let's see some other examples!

## A step back: what is raster data?
I forgot to explain that in the previous post, so here it is!
In its simplest form, a raster consists of a matrix of cells (or pixels) organized into rows and columns (or a grid) where each cell contains a value representing information, such as temperature. Rasters are digital aerial photographs, imagery from satellites, digital pictures, or even scanned maps.
A raster dataset is composed of rows (running across) and columns (running down) of pixels (also know as cells). Each pixel represents a geographical region, and the value in that pixel represents some characteristic of that region.

{{< figure src="/post/images/raster_dataset.png" title="Conceptual representation of a raster GIS data" width="100%" >}}


## Scale raster data value components with GDAL
Each pixel in the image above could contain a lot of different information, which could be encoded in many ways.

Your computer screen is capable to show RGB data and each channel (red green blue) is encoded in a byte (8 bit). There is also space for a 8 bit alpha channel in a 32 bit per pixel image.

Raster data is way more complex than that, and could be greyscale with integer value, RGB with 24bit or 32bit, RGB with 16 bit per channel, non image data with float values.

Not only that, raster data could be also multiband so a specific data for the row / column tuple could have more than a value.

**Woot!**

> Now, how could you scale a 16bit greyscale raster into a 8bit greyscale raster? Simple! Let's use **gdal_translate** with the **-scale** option.

The **-scale** options wants 4 values:
* source min value
* source max value
* target min value
* target max value

So if you want to map 16 bits into 8 bits, just do:

```bash
gdal_translate -scale 0 65535 0 255 input.tif output.tif
```

If you want to work on a multiband raster, you can use the **-scale_bn** option followed by the number of the band to work on.

> If you want some info on the raster you are working on, you could give a try to the **-stats** options. GDAL would rebuild a new output giving you information about the input raster.
