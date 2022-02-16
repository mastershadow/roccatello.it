+++
authors = ["Eduard Roccatello"]
date = "2022-02-14"
lastmod = "2022-02-14"
title = "Converting between GIS raster data formats using gdal_translate"
summary = "Do you need to convert GIS raster data between different formats? Here is how gdal_translate could help you!"
tags = ["coding", "gis", "gdal"]
language = "en"
draft = false
slug = "converting-gis-raster-data-formats-using-gdal"

+++
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

Let's see some examples!

## Changing raster format

This is the the most common option.

Use the **-of** flag to specify the output format. Raster images come in a lot of formats and you may want to translate them into the commonly used format, which is the **GeoTIFF** format.

Let's make an example. You have a JPG + world file raster set and you want to translate to GeoTIFF. Your command will be:
```bash
gdal_translate -of GTiff input.jpg output.tif
```

Other options would be:
* -of PNG
* -of JPEG
* -of BMP
* -of PDF
* -of JPEG2000 (needs plugins)

> Always remember to specify **-of** flag, as missing it could lead to unpredictable results.

### Creation options
**gdal_translate** offers the **-co** flag to provide format-specific options. You can specify the CO flag multiple times, one for every options. An option is specified using key-value format, using equal sign as separator.

If you want a tiled GeoTIFF using DEFLATE as compression algorithm call the program as follows:
```bash
gdal_translate -co TILED=YES -co COMPRESS=DEFLATE input.tif output.tif
```

## Reduce raster resolution or increase it with upscaling

Sometimes, raster data is just too much detailed so, you may to reduce the pixel density increasing pixel resolution.

> Pixel resolution is the size of a pixel in the real world. 
> 
> For example a single image pixel could be a 8cm x 8cm square in the real world.

**gdal_translate** has a filter called **-outsize**, which could be used for our need.

You need to pass two values to the filter: width and height. Values may be percentual or absolute, and you can derive one on the two using the image aspect ratio (just set the input value to 0).

Here are some examples:
```bash
# resize to 25%
gdal_translate -outsize 25% 25% input.tif output.tif
# resize to 50%
gdal_translate -outsize 50% 0 input.tif output.tif
# resize to 100px x 100px
gdal_translate -outsize 100 100 input.tif output.tif
# resize to 150%
gdal_translate -outsize 150% 0 input.tif output.tif
```

You can also set resampling options using the **-r** value. Take a look to the options in the manpage above.

This is just the tip of the iceberg when talking about **gdal_translate**. There is a lot of filters that could be useful but I will talk about them in another post (probably a series about GDAL).