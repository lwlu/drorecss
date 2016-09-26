var droreMapSet = {

}
var droreMap = (function($, ol, option) {
	var _addPupupEventKey,
		_addMarkerEvent,
		_geoJsonLayer,
		_baseMap,
		_rstLayer,
		_ljtLayer,
		_washroomLayer,
		_tempLayer,
		_routeLayer,
		_routeCoords,
		_features,
		_draw,

		_layerCache = {};

	var defaults = {
		centerX: 103.6141848564148,
		centerY: 31.00069470136539,
		curZoom: 16,
		minZoom: 16,
		maxZoom: 19,
		Copyright: "卓锐",
		hasScale: false
	}
	var options = $.extend(defaults, option);

	var methods = {
		translateCoords: function(originCoords) { //TODO:坐标转换
			var newCoords = new Array();
			$.ajax({
				type: 'POST',
				url: 'http://localhost:54614/Location/SingleConvertor?lat=' + originCoords.y + '&lon=' + originCoords.x,
				cache: false,
				async: false,
				success: function(result) {
					var json = eval(tt);
					newCoords.x = 0;
					newCoords.y = 0;
				},
				error: function(result) {

				}
			})
			return newCoords;
		},
		addMarkers: function(markerList, iconName) { //创建标记
			var vectorSource = new ol.source.Vector({
				//create empty vector
			});
			for(var i = 0; i < markerList.length; i++) {
				var x = markerList[i].x;
				var y = markerList[i].y;
				//每个Marker对应在地图上创建一个标记
				var iconFeature = new ol.Feature({
					geometry: new ol.geom.Point(ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857')),
					name: markerList[i].name,
					data:markerList[i].data,
				});
				//markers[i] = [x, y];
				vectorSource.addFeature(iconFeature);
			}

			//create the style
			var iconStyle = new ol.style.Style({
				image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
					anchor: [0.5, 17],
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					opacity: 0.95,
					src:  iconName
				}))
			});

			//add the feature vector to the layer vector, and apply a style to whole layer
			var vectorLayer = new ol.layer.Vector({
				source: vectorSource,
				style: iconStyle
			});
			return vectorLayer;

		},
		setSource: function(baseZoom, leftTopX, leftTopY, projection, urlTemplate, attribution) {
			//设置2.5D底图的source
			var source = new ol.source.XYZ({
				attributions: [attribution],
				projection: projection,
				tileUrlFunction: function(tileCoord) {
					var diff = tileCoord[0] - baseZoom + 1;
					var url = urlTemplate.replace('{z}', (diff).toString())
						.replace('{x}', (tileCoord[1] - (leftTopX * Math.pow(2, diff - 1))).toString())
						.replace('{y}', (-tileCoord[2] - ((leftTopY - 1) * Math.pow(2, diff - 1)) - 1).toString());
					return url;
				},
				tileLoadFunction: function(imageTile, src) {
					console.log(src);
					imageTile.getImage().src = src;
				},
				wrapX: true
			});
			return source;
		},
		addBaseMap: function(source, centerX, centerY, curZoom, minZoom, maxZoom, projection) {
			var select = new ol.interaction.Select({
				wrapX: false
			});
			var modify = new ol.interaction.Modify({
				features: select.getFeatures()
			});
			//初始化Map
			var map = new ol.Map({
				//				interactions: ol.interaction.defaults().extend([select, modify]),
				target: 'map',
				layers: [
					//					new ol.layer.Tile({//显示背景图
					//						opacity: 0.5,
					//						source: new ol.source.OSM()
					//					}),
					new ol.layer.Tile({
						//minZoom: 13,
						source: source
					})
				],
				controls: options.hasScale ? ol.control.defaults().extend([new ol.control.ScaleLine()]) : undefined,
				view: new ol.View({
					center: ol.proj.fromLonLat([centerX, centerY]),
					projection: projection,
					zoom: curZoom,
					minZoom: minZoom,
					maxZoon: maxZoom,
				})
			});
			return map;
		},
		addLayer: function(iconUrl) {
			var vectorSource = new ol.source.Vector({
				//empty
			});
			//create the style
			var iconStyle = new ol.style.Style({
				image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
					anchor: [0.5, 46],
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					opacity: 0.75,
					src: (iconUrl != "") ? iconUrl : 'images/default.png'
				}))
			});
			//create an empty layer, and apply a style to whole layer
			var layer = new ol.layer.Vector({
				source: vectorSource,
				style: iconStyle
			});
			return layer;
		},
		addDefaultMarker: function(evt, attributes, layer) {
			var iconFeatureX = new ol.Feature({
				//geometry: new ol.geom.Point(ol.proj.transform(evt.coordinate, 'EPSG:4326', 'EPSG:3857')),
				geometry: new ol.geom.Point(evt.coordinate),
				type: attributes[0],
				name: attributes[1],
				info: attributes[2],
			});
			layer.getSource().addFeature(iconFeatureX);
		},
		addCustomMarker: function(evt, attributes, layer) { //新增自定义标注
			var iconFeatureX = new ol.Feature({
				//geometry: new ol.geom.Point(ol.proj.transform(evt.coordinate, 'EPSG:4326', 'EPSG:3857')),
				geometry: new ol.geom.Point(evt.coordinate)
			});
			for(var i = 0; i < attributes.length; i++) {
				//给新建的Feature增加属性对
				iconFeatureX.setProperties(attributes[i][0], attributes[i][1]);
				console.log(attributes[i][0] + "," + attributes[i][1])
			}
			layer.getSource().addFeature(iconFeatureX);
		},
		getIconParas: function(attrStr) {
			var attrArray = new Array();
			var attrStr = document.getElementById('attrs').value;
			var attrCouples = (attrStr.toString()).split(";");
			for(var i = 0; i < attrCouples.length; i++) {
				var str = (attrCouples[i].toString()).split(",");
				var eachAttr = new Array();
				eachAttr.push(str[0]);
				eachAttr.push(str[1]);
				attrArray.push(eachAttr);
			}
			return attrArray;
		},
		addLabel: function(x, y, text) { //添加文字标注
			var feature = new ol.Feature({
				geometry: new ol.geom.Point(ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857'))
			});
			var style = new ol.style.Style({
				//geometry: point,
				//image: new ol.style.Icon( /** @type {olx.style.IconOptions} */({
				//    anchor: [0.5, 46],
				//    anchorXUnits: 'fraction',
				//    anchorYUnits: 'pixels',
				//    opacity: 0.75,
				//    src: 'http://openlayers.org/en/v3.6.0/examples/data/icon.png'
				//})),
				text: new ol.style.Text({
					text: text,
					stroke: new ol.style.Stroke({
						color: 'red'
					}),
					font: "48px serif"
				})
			});

			var labelSource = new ol.source.Vector({
				features: [feature]
			});

			var labelLayer = new ol.layer.Vector({
				source: labelSource,
				style: style
			});
			return labelLayer;
		},
		createLayerFromGeoJson: function(url) {
			// Create vector layers for drawing
			var vectorLayer = new ol.layer.Vector({
				source: new ol.source.Vector({
						url: url,
						format: new ol.format.GeoJSON(),
						wrapX: false
					})
					//style: new ol.style.Style({
					//    fill: new ol.style.Fill({
					//        color: 'rgba(55, 155, 55, 0.5)'
					//    }),
					//    stroke: new ol.style.Stroke({
					//        color: 'rgba(55, 155, 55, 0.8)',
					//        width: 1
					//    }),
					//    image: new ol.style.Circle({
					//        radius: 7,
					//        fill: new ol.style.Fill({
					//            color: 'rgba(55, 155, 55, 0.5)',
					//        })
					//    })
					//})
			});
			return vectorLayer;
		},
		drawCircle: function(centerX, centerY, radius) {
			var circle = new ol.geom.Circle(ol.proj.transform([centerX, centerY], 'EPSG:4326', 'EPSG:3857'), 1000);
			var circleFeature = new ol.Feature(circle);

			var vectorSource = new ol.source.Vector({
				features: [circleFeature],
				projection: 'EPSG:4326'
			});

			// Create vector layers for drawing
			var vectorLayer = new ol.layer.Vector({
				source: vectorSource,
				style: [new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'blue',
						width: 3
					}),
					fill: new ol.style.Fill({
						color: 'rgba(0, 0, 255, 0.3)'
					})
				})]
			});

			return vectorLayer;
		},

		addInteraction: function(value) {
			_draw = new ol.interaction.Draw({
				features: _features,
				type: /** @type {ol.geom.GeometryType} */ value
			});
			_baseMap.addInteraction(_draw);
		},
		showRoute: function(_arr, c1, c2) {
			var geojsonObject = {
				'type': 'FeatureCollection',
				'crs': {
					'type': 'name',
					'properties': {
						'name': 'EPSG:4326'
					}
				},
				'features': [{
					'type': 'Feature',
					'id': '1',
					'properties': {
						"name": 'location'
					},
					'geometry': {
						'type': 'Point',
						'coordinates': [103.61889481544496, 31.008557248243548]
					}
				}, {
					'type': 'Feature',
					'id': '2',
					'properties': {
						"name": 'routetest'
					},
					'geometry': {
						'type': 'LineString',
						'coordinates': _arr
					}
				}]
			};

			var styles = {
				'icon': new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0.5, 1],
						src: 'http://openlayers.org/en/v3.17.1/examples/data/icon.png'
					})
				}),
				'geoMarker': new ol.style.Style({
					image: new ol.style.Circle({
						radius: 7,
						snapToPixel: false,
						fill: new ol.style.Fill({
							color: 'red'
						}),
						stroke: new ol.style.Stroke({
							color: 'white',
							width: 2
						})
					})
				}),
				'Point': [new ol.style.Style({
					image: new ol.style.Circle({
						fill: new ol.style.Fill({
							color: [255, 255, 255, 1]
						}),
						stroke: new ol.style.Stroke({
							color: [0, 0, 0, 1]
						}),
						radius: 5
					})
				})],
				'LineString': [new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'green',
						width: 5
					})
				})]
			};

			var features = new ol.format.GeoJSON().readFeatures(geojsonObject, {
				featureProjection: 'EPSG:3857'
			});

			routeCoords = new Array();
			var feature;
			for(var i = 0; i < features.length; i++) {
				feature = features[i];
				if(feature.getGeometry().getType() == "LineString") {
					geometry = feature.getGeometry();
					geometry_coords = geometry.getCoordinates();
					for(var ii = 0; ii < geometry_coords.length; ii++) {
						var coord = new Array();
						// assign them to two variables
						coord.push(geometry_coords[ii][0]);
						coord.push(geometry_coords[ii][1]);
						routeCoords.push(coord);
					}
				}
			}

			var routeSource = new ol.source.Vector({
				features: features
			});
			var routeLayer = new ol.layer.Vector({
				source: routeSource,
				style: function(feature, resolution) {
					return styles[feature.getGeometry().getType()];
				}
			});

			_baseMap.addLayer(routeLayer);
			_baseMap.on('click', function(evt) {

				var pt = turf.point(evt.coordinate);
				var poly = turf.polygon([routeCoords]);

				var intersects = turf.intersect(poly, pt);
				if(intersects)
					c1();
				else
					c2();
			});
		}
	}
	return {
		init: function(url) {
			var attribution = new ol.Attribution({
				html: 'Copyright:© 2016 Drore'
			});
			var projection = ol.proj.get('EPSG:3857');
			var urlTemplate =url+"{z}/{x},{y}.jpg";
			var baseMapSource = methods.setSource(16, 51625, 26824, projection, urlTemplate, attribution);
			var centerX = options.centerX;
			var centerY = options.centerY;
			var curZoom = options.curZoom;
			var minZoom = options.minZoom;
			var maxZoom = options.maxZoom;

			//添加底图
			_baseMap = methods.addBaseMap(baseMapSource, centerX, centerY, curZoom, minZoom, maxZoom, projection);

			//添加餐馆Markers图层
			var markerList = new Array();
			var marker1 = new Object();

			//			marker1.x = 103.60855489969254;
			//			marker1.y = 31.006619259625214;
			//			marker1.name = "test1";
			//			var marker2 = new Object();
			//			marker2.x = 103.60381272256447;
			//			marker2.y = 31.008798808489427;
			//			marker2.name = "test1";
			//			markerList.push(marker1);
			//			markerList.push(marker2);
			//			rstLayer = methods.addMarkers(markerList, "restaurant.jpg");
			//			_baseMap.addLayer(rstLayer);

			//添加垃圾桶图层
			//			var markerList2 = new Array();
			//			var lajitongMarker1 = new Object();
			//			lajitongMarker1.x = 103.61001133918761;
			//			lajitongMarker1.y = 31.004676633630623;
			//			marker1.name = "lajitong1";
			//			var lajitongMarker2 = new Object();
			//			lajitongMarker2.x = 103.61434042453764;
			//			lajitongMarker2.y = 31.00560082276803;
			//			lajitongMarker2.name = "lajitong2";
			//			markerList2.push(lajitongMarker1);
			//			markerList2.push(lajitongMarker2);
			//			ljtLayer = methods.addMarkers(markerList2, "lajitong.png");
			//			_baseMap.addLayer(ljtLayer);
			//
			//			//添加洗手间图层
			//			var markerList3 = new Array();
			//			var washroomMarker1 = new Object();
			//			washroomMarker1.x = 103.60259494906903;
			//			washroomMarker1.y = 31.008582307174507;
			//			washroomMarker1.name = "washroom1";
			//			var washroomMarker2 = new Object();
			//			washroomMarker2.x = 103.60764732568634;
			//			washroomMarker2.y = 30.991903455246835;
			//			washroomMarker2.name = "washroom2";
			//			var washroomMarker3 = new Object();
			//			washroomMarker3.x = 103.60763542821974;
			//			washroomMarker3.y = 31.008876664832172;
			//			washroomMarker3.name = "washroom3";
			//			markerList3.push(washroomMarker1);
			//			markerList3.push(washroomMarker2);
			//			markerList3.push(washroomMarker3);
			//
			//			washroomLayer = methods.addMarkers(markerList3, "washroom.jpg");
			//			_baseMap.addLayer(washroomLayer);

		},
		on: {
			click: function(fn) {
				_layerCache.click = _baseMap.on('click', fn);
			},
			singleclick: function(fn) {
				_layerCache.singleclick = _baseMap.on('singleclick', fn);
			},
			dbclick: function(fn) {
				_layerCache.dbclick = _baseMap.on('dblclick', fn);
			}
		},
		die: {
			click: function(fn) {
				console.log(_layerCache);
				_baseMap.unByKey(_layerCache.click);
			},
			singleclick: function(fn) {
				_baseMap.unByKey(_layerCache.singleclick);
			},
			dbclick: function(fn) {
				_baseMap.unByKey(_layerCache.dbclick);
			}
		},
		set: {
			center: function(x, y) {
				_baseMap.getView().setCenter(ol.proj.transform([parseFloat(x), parseFloat(y)], 'EPSG:4326', 'EPSG:3857'))
			},
			zoom: function(z) {
				console.log(z);
				_baseMap.getView().setZoom(z);
			}
		},
		get: {
			center: function(dom) {
				var centerP = _baseMap.getView().getCenter();
				dom.value = ol.coordinate.toStringHDMS(ol.proj.transform(
					centerP, 'EPSG:3857', 'EPSG:4326'));
			},
			zoom: function() {
				return _baseMap.getView().getZoom();
			},
			view: function() {
				var extent3857 = _baseMap.getView().calculateExtent(_baseMap.getSize());
				var extent4326 = ol.proj.transformExtent(extent3857, 'EPSG:3857', 'EPSG:4326');
				return extent4326;
			}
		},
		info: {
			scale: {
				on: function() {
					defaults.hasScale = true;
				}
			},
			lola: {
				on: function() {

				}
			}
		},
		click: {
			on: function(dom1, dom2, dom3, c1) {
				var container = dom1;
				var content = dom2;
				var closer = dom3;
				_baseMap.on('click', function(evt) {
					_baseMap.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
						//创建停靠在地图上的一个overlay
						var overlay = new ol.Overlay( /** @type {olx.OverlayOptions} */ ({
							element: container,
							autoPan: true,
							autoPanAnimation: {
								duration: 250
							}
						}));
						_baseMap.addOverlay(overlay);

						closer.onclick = function() {
							overlay.setPosition(undefined);
							closer.blur();
							return false;
						};

						//获取点击到的对象
						var feature = _baseMap.forEachFeatureAtPixel(evt.pixel, function(feature) {
							return feature;
						});
						//弹出信息窗口展示相关信息
						if(feature) {
							var coordinate = evt.coordinate;
							var attrs = feature.getProperties();
							console.log(attrs.name);
							//显示该对象相关的信息
							//var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
							//    coordinate, 'EPSG:3857', 'EPSG:4326'));

							c1(feature,layer);
							overlay.setPosition(coordinate);
						}
					})
				});

			}

		},
		event: {
			click: function(callback) {
				_baseMap.on('click', function(evt) {
					_baseMap.forEachFeatureAtPixel(evt.pixel, callback)
				});
			},
			hover: function(callback) {
				_baseMap.on('pointermove', function(evt) {
					_baseMap.forEachFeatureAtPixel(evt.pixel, callback)
				});
			}
		}

		,
		icon: {
			addDefault: function() {
				var _markerLayer = methods.addLayer("");
				_baseMap.addLayer(_markerLayer);
				_baseMap.on('click', function(evt) {
					var attributes = new Array();
					var type = 'default';
					var name = 'test1';
					var info = "我是一个新添加的标记!";
					attributes.push(type);
					attributes.push(name);
					attributes.push(info);
					methods.addDefaultMarker(evt, attributes, _markerLayer);
				});
			},
			addCustom: function(v1,v2) {
				var _markerLayer;
				var _markerUrl;
				var _attrs;
				_markerUrl = v1;
				_attrs = methods.getIconParas(v2);
				_markerLayer = methods.addLayer(_markerUrl);
				_baseMap.addLayer(_markerLayer);
				_baseMap.on('click', function(evt) {
					methods.addCustomMarker(evt, _attrs, _markerLayer);
				});
			},
			addText: function(x, y, word) {
				var _labelLayer;
				//添加文字标注
				_labelLayer = methods.addLabel(x, y, word);
				_baseMap.addLayer(_labelLayer);
				//显示文字标注
				$('#show').on('click', function(event) {
					_labelLayer.setVisible(true);
				})

				//隐藏文字标注
				$('#hide').on('click', function(event) {
					_labelLayer.setVisible(false);
				})
			},
			addPolygon: function(url) {
				_baseMap.addLayer(methods.createLayerFromGeoJson(url));
			},
			addCircle: function(x, y, r) {
				var circleLayer = methods.drawCircle(x, y, r);
				_baseMap.addLayer(circleLayer);
			}
		},
		lalo: function(tag, t1, c1, t2, c2) {
			var mousePositionControl = new ol.control.MousePosition({
				coordinateFormat: ol.coordinate.createStringXY(4),
				projection: 'EPSG:4326',
				className: 'custom-mouse-position',
				target: tag,
				undefinedHTML: '&nbsp;'
			});

			var projection = ol.proj.get('EPSG:3857');
			var urlTemplate = "./map_sec_sichuan0003/map{z}/{x},{y}.jpg";
			var attribution = new ol.Attribution({
				html: 'Copyright:© 2016 Drore'
			});
			var source = new ol.source.XYZ({
				attributions: [attribution],
				projection: projection,
				tileUrlFunction: function(tileCoord) {
					var diff = tileCoord[0] - 16 + 1;
					var url = urlTemplate.replace('{z}', (diff).toString())
						.replace('{x}', (tileCoord[1] - (51625 * Math.pow(2, diff - 1))).toString())
						.replace('{y}', (-tileCoord[2] - ((26824 - 1) * Math.pow(2, diff - 1)) - 1).toString());
					return url;
				},
				tileLoadFunction: function(imageTile, src) {
					console.log(src);
					imageTile.getImage().src = src;
				},
				wrapX: true
			});

			var map = new ol.Map({
				controls: ol.control.defaults({
					attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
						collapsible: false
					})
				}).extend([mousePositionControl]),
				target: 'map',
				layers: [
					new ol.layer.Tile({
						opacity: 0.5,
						source: new ol.source.OSM()
					}),
					new ol.layer.Tile({
						//minZoom: 13,
						source: source
					})
				],
				view: new ol.View({
					center: ol.proj.fromLonLat([103.6141848564148, 31.00069470136539]),
					projection: projection,
					zoom: 16,
					minZoom: 10,
					maxZoon: 19,
				})
			});

			t1.addEventListener('change', c1);

			t2.addEventListener('change', c2);
		},
		analyze: function(_arr, callback, callback1) {
			methods.showRoute(_arr, callback, callback1);
		},
		translate: function(obj) {
			return _translateCoords(obj)
		},
		addVectorLayer: function(geo) {
			_geoJsonLayer = createLayerFromGeoJson(geo || "http://172.16.10.85:8090/data/dianziweilan.geojson");
			_baseMap.addLayer(_geoJsonLayer);
		},
		popup: {

		},
		layer: {
			show: function(obj) {
				obj.setVisible(true);
			},
			hide: function(obj) {
				obj.setVisible(false);
			},
			set: function(name, markerList, imgurl, _arr) {
				_rstLayer = methods.addMarkers(markerList, imgurl || "restaurant.jpg");
				_baseMap.addLayer(_rstLayer);
				if(_arr != undefined && _arr.length > 0) {
					$.each(_arr, function(i, t) {
						_rstLayer.set(t.key, t.value);
					});
				}
				_layerCache[name] = _rstLayer;
				return _rstLayer;
			},
			get: function(name) {
				console.log(_layerCache);
				return _layerCache[name];
			},
			index: {
				set: function(name, index) {
					_layerCache[name].setZIndex(index);
				}

			},
			getAll: function() {
				var _arr = [];
				_baseMap.getLayers().forEach(function(layer, i) {
					var name = layer.get('name');
					if(name != undefined)
						_arr.push(name);
				});

				return _arr;
			},
			getAllIndex: function() {
				var _arr = [];
				_baseMap.getLayers().forEach(function(layer, i) {
					var name = layer.get('name');
					if(name != undefined)
						_arr.push({
							name: name,
							index: i
						});
				});

				return _arr;
			},
			setVisibility: function(index) {
				_baseMap.getLayers().forEach(function(layer, i) {
					//var name = layer.get('name');
					//					var indexToName;
					//					switch(index) {
					//						case 0:
					//							indexToName = "OSM底图";
					//							break;
					//						case 1:
					//							indexToName = "景区图";
					//							break;
					//						case 2:
					//							indexToName = "餐饮";
					//							break;
					//						case 3:
					//							indexToName = "垃圾桶";
					//							break;
					//						case 4:
					//							indexToName = "洗手间";
					//							break;
					//					}
					//两者一致
					if(index == i) {
						layer.setVisible(!layer.getVisible());
					}
				});
			}
		},
		draw: {
			on: function() {
				_features = new ol.Collection();
				var featureOverlay = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: _features
					}),
					style: new ol.style.Style({
						fill: new ol.style.Fill({
							color: 'rgba(255, 255, 255, 0.2)'
						}),
						stroke: new ol.style.Stroke({
							color: '#ffcc33',
							width: 2
						}),
						image: new ol.style.Circle({
							radius: 7,
							fill: new ol.style.Fill({
								color: '#ffcc33'
							})
						})
					})
				});
				featureOverlay.setMap(_baseMap);

				var modify = new ol.interaction.Modify({
					features: _features,
					// the SHIFT key must be pressed to delete vertices, so
					// that new vertices can be drawn at the same position
					// of existing vertices
					deleteCondition: function(event) {
						return ol.events.condition.shiftKeyOnly(event) &&
							ol.events.condition.singleClick(event);
					}
				});
				_baseMap.addInteraction(modify);

			},
			set: function(draw) {
				_baseMap.removeInteraction(_draw);
				methods.addInteraction(draw);
			},
			get: function() {
				return _features;
			}
		}

		,
		route: {
			show: function() {
				var geojsonObject = {
					'type': 'FeatureCollection',
					'crs': {
						'type': 'name',
						'properties': {
							'name': 'EPSG:4326'
						}
					},
					'features': [{
						'type': 'Feature',
						'id': '1',
						'properties': {
							"name": 'location'
						},
						'geometry': {
							'type': 'Point',
							'coordinates': [103.61889481544496, 31.008557248243548]
						}
					}, {
						'type': 'Feature',
						'id': '2',
						'properties': {
							"name": 'routetest'
						},
						'geometry': {
							'type': 'LineString',
							'coordinates': [
								[
									103.61889481544496,
									31.008557248243548
								],
								[
									103.61934542655945,
									31.008134250530375
								],
								[
									103.61996769905092,
									31.00791355532617
								],
								[
									103.6205041408539,
									31.007692859611026
								],
								[
									103.62110495567322,
									31.007380206473286
								]
							]
						}
					}]
				};

				var styles = {
					'icon': new ol.style.Style({
						image: new ol.style.Icon({
							anchor: [0.5, 1],
							src: 'http://openlayers.org/en/v3.17.1/examples/data/icon.png'
						})
					}),
					'geoMarker': new ol.style.Style({
						image: new ol.style.Circle({
							radius: 7,
							snapToPixel: false,
							fill: new ol.style.Fill({
								color: 'black'
							}),
							stroke: new ol.style.Stroke({
								color: 'white',
								width: 2
							})
						})
					}),
					'Point': [new ol.style.Style({
						image: new ol.style.Circle({
							fill: new ol.style.Fill({
								color: [255, 255, 255, 1]
							}),
							stroke: new ol.style.Stroke({
								color: [0, 0, 0, 1]
							}),
							radius: 5
						})
					})],
					'LineString': [new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: 'green',
							width: 5
						})
					})]
				};

				var features = new ol.format.GeoJSON().readFeatures(geojsonObject, {
					featureProjection: 'EPSG:3857'
				});

				routeCoords = new Array();
				var feature;
				for(var i = 0; i < features.length; i++) {
					feature = features[i];
					if(feature.getGeometry().getType() == "LineString") {
						geometry = feature.getGeometry();
						geometry_coords = geometry.getCoordinates();
						for(ii = 0; ii < geometry_coords.length; ii++) {
							var coord = new Object();
							// assign them to two variables
							coord.x = geometry_coords[ii][0];
							coord.y = geometry_coords[ii][1];
							routeCoords.push(coord);
						}
					}
				}
				var routeSource = new ol.source.Vector({
					//features: [features, geoMarker, startMarker, endMarker]
					features: features
				});
				var routeLayer = new ol.layer.Vector({
					source: routeSource,
					style: function(feature, resolution) {
							//if (animating && feature.get('type') === 'geoMarker') {
							//    return null;
							//}
							return styles[feature.getGeometry().getType()];
						}
						//style: styles
				});

				//var routeLayer2 = new ol.layer.Vector({
				//    source: new ol.source.Vector({
				//        features: [features, geoMarker, startMarker, endMarker]
				//    }),
				//    style: function (feature) {
				//        // hide geoMarker if animation is active
				//        if (feature.getGeometry().getType() == 'LineString') {
				//            return styles[feature.getGeometry().getType()];
				//        }
				//        else {
				//            if (animating && feature.get('type') === 'geoMarker') {
				//                return null;
				//            }
				//            return styles[feature.getGeometry().getType()];
				//        }
				//    }
				//});

				_baseMap.addLayer(routeLayer);
				console.log(_baseMap.getLayers().getLength());
				//首先添加会动态移动的点标记
				geoMarker = new ol.Feature({
					geometry: new ol.geom.Point(ol.proj.transform([103.61889481544496, 31.008557248243548], 'EPSG:4326', 'EPSG:3857')),
					name: 'location'
				});
				console.log(geoMarker.getGeometry().getCoordinates().length);
				var markerSource = new ol.source.Vector({
					features: geoMarker
				});
				//create the style
				var iconStyle3 = new ol.style.Style({
					image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
						anchor: [0.5, 46],
						anchorXUnits: 'fraction',
						anchorYUnits: 'pixels',
						opacity: 0.75,
						src: 'images/person.png'
					}))
				});
				var markerLayer = new ol.layer.Vector({
					source: markerSource,
					style: iconStyle3
				});
				_baseMap.addLayer(markerLayer);
				console.log(_baseMap.getLayers().getLength());
				return routeLayer;
			},
			view: function() {
				routeLength = routeCoords.length;

				//动画演示相关
				if(animating) {
					stopAnimation(false);
				} else {
					animating = true;
					now = new Date().getTime();
					speed = speedInput.value;
					console.log(speed);
					startButton.textContent = 'Cancel Animation';
					// hide geoMarker
					geoMarker.setStyle(null);
					// just in case you pan somewhere else
					//map.getView().setCenter(center);
					_baseMap.on('postcompose', moveFeature);
					_baseMap.render();
				}
			},

			remove: function() {

			}
		}
	}
})(jQuery, ol, droreMapSet | {})