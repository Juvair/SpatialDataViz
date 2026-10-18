// Google Earth Engine Code Editor script: Bangladesh land cover (Esri 10 m LULC)
// Exports a 200 m class raster (EPSG:32646) for render_map.py
var year = 2025;   // if 2025 is not yet in the collection, use 2024
// Replace with your official boundary asset if you have one:
var bd = ee.FeatureCollection('FAO/GAUL/2015/level0').filter(ee.Filter.eq('ADM0_NAME', 'Bangladesh'));
var geom = bd.geometry();

var lulc = ee.ImageCollection('projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS')
  .filterDate(year + '-01-01', year + '-12-31').mosaic().clip(geom);

// Esri codes: 1 water, 2 trees, 4 flooded veg, 5 crops, 7 built, 8 bare, 9 snow, 10 clouds, 11 rangeland
// Output codes: 1 Crops, 2 Rangeland, 3 Trees, 4 Built, 5 Bare, 6 Water, 7 Flooded vegetation (0 = outside)
var out = lulc.remap([1,2,4,5,7,8,9,11], [6,3,7,1,4,5,5,2]).unmask(0).toByte().rename('lc');

Map.addLayer(out.updateMask(out.gt(0)), {min:1, max:7,
  palette:['76B041','CDB885','1B4D33','221F2E','EADFC4','2F80C9','6FB7A8']}, 'LULC');
Map.centerObject(geom, 7);

Export.image.toDrive({
  image: out, description: 'bangladesh_lulc_' + year + '_200m',
  region: geom.bounds(), crs: 'EPSG:32646', scale: 200, maxPixels: 1e9
});
