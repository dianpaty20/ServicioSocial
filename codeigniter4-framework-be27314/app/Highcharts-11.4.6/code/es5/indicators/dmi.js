!/**
 * Highstock JS v11.4.6 (2024-07-08)
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2024 Rafal Sebestjanski
 *
 * License: www.highcharts.com/license
 */function(t){"object"==typeof module&&module.exports?(t.default=t,module.exports=t):"function"==typeof define&&define.amd?define("highcharts/indicators/dmi",["highcharts","highcharts/modules/stock"],function(e){return t(e),t.Highcharts=e,t}):t("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(t){"use strict";var e=t?t._modules:{};function o(e,o,i,n){e.hasOwnProperty(o)||(e[o]=n.apply(null,i),"function"==typeof CustomEvent&&t.win.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:o,module:e[o]}})))}o(e,"Stock/Indicators/MultipleLinesComposition.js",[e["Core/Series/SeriesRegistry.js"],e["Core/Utilities.js"]],function(t,e){var o,i=t.seriesTypes.sma.prototype,n=e.defined,a=e.error,s=e.merge;return function(t){var e=["bottomLine"],o=["top","bottom"],r=["top"];function l(t){return"plot"+t.charAt(0).toUpperCase()+t.slice(1)}function p(t,e){var o=[];return(t.pointArrayMap||[]).forEach(function(t){t!==e&&o.push(l(t))}),o}function u(){var t,e=this,o=e.pointValKey,r=e.linesApiNames,u=e.areaLinesNames,c=e.points,h=e.options,f=e.graph,d={options:{gapSize:h.gapSize}},y=[],m=p(e,o),g=c.length;if(m.forEach(function(e,o){for(y[o]=[];g--;)t=c[g],y[o].push({x:t.x,plotX:t.plotX,plotY:t[e],isNull:!n(t[e])});g=c.length}),e.userOptions.fillColor&&u.length){var D=y[m.indexOf(l(u[0]))],v=1===u.length?c:y[m.indexOf(l(u[1]))],M=e.color;e.points=v,e.nextPoints=D,e.color=e.userOptions.fillColor,e.options=s(c,d),e.graph=e.area,e.fillGraph=!0,i.drawGraph.call(e),e.area=e.graph,delete e.nextPoints,delete e.fillGraph,e.color=M}r.forEach(function(t,o){y[o]?(e.points=y[o],h[t]?e.options=s(h[t].styles,d):a('Error: "There is no '+t+' in DOCS options declared. Check if linesApiNames are consistent with your DOCS line names."'),e.graph=e["graph"+t],i.drawGraph.call(e),e["graph"+t]=e.graph):a('Error: "'+t+" doesn't have equivalent in pointArrayMap. To many elements in linesApiNames relative to pointArrayMap.\"")}),e.points=c,e.options=h,e.graph=f,i.drawGraph.call(e)}function c(t){var e,o=[],n=[];if(t=t||this.points,this.fillGraph&&this.nextPoints){if((e=i.getGraphPath.call(this,this.nextPoints))&&e.length){e[0][0]="L",o=i.getGraphPath.call(this,t),n=e.slice(0,o.length);for(var a=n.length-1;a>=0;a--)o.push(n[a])}}else o=i.getGraphPath.apply(this,arguments);return o}function h(t){var e=[];return(this.pointArrayMap||[]).forEach(function(o){e.push(t[o])}),e}function f(){var t,e=this,o=this.pointArrayMap,n=[];n=p(this),i.translate.apply(this,arguments),this.points.forEach(function(i){o.forEach(function(o,a){t=i[o],e.dataModify&&(t=e.dataModify.modifyValue(t)),null!==t&&(i[n[a]]=e.yAxis.toPixels(t,!0))})})}t.compose=function(t){var i=t.prototype;return i.linesApiNames=i.linesApiNames||e.slice(),i.pointArrayMap=i.pointArrayMap||o.slice(),i.pointValKey=i.pointValKey||"top",i.areaLinesNames=i.areaLinesNames||r.slice(),i.drawGraph=u,i.getGraphPath=c,i.toYData=h,i.translate=f,t}}(o||(o={})),o}),o(e,"Stock/Indicators/DMI/DMIIndicator.js",[e["Stock/Indicators/MultipleLinesComposition.js"],e["Core/Series/SeriesRegistry.js"],e["Core/Utilities.js"]],function(t,e,o){var i,n=this&&this.__extends||(i=function(t,e){return(i=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])})(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw TypeError("Class extends value "+String(e)+" is not a constructor or null");function o(){this.constructor=t}i(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}),a=e.seriesTypes.sma,s=o.correctFloat,r=o.extend,l=o.isArray,p=o.merge,u=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.calculateDM=function(t,e,o){var i=t[e][1],n=t[e][2],a=t[e-1][1],r=t[e-1][2];return s(i-a>r-n?o?Math.max(i-a,0):0:o?0:Math.max(r-n,0))},e.prototype.calculateDI=function(t,e){return t/e*100},e.prototype.calculateDX=function(t,e){return s(Math.abs(t-e)/Math.abs(t+e)*100)},e.prototype.smoothValues=function(t,e,o){return s(t-t/o+e)},e.prototype.getTR=function(t,e){return s(Math.max(t[1]-t[2],e?Math.abs(t[1]-e[3]):0,e?Math.abs(t[2]-e[3]):0))},e.prototype.getValues=function(t,e){var o=e.period,i=t.xData,n=t.yData,a=n?n.length:0,s=[],r=[],p=[];if(!(i.length<=o)&&l(n[0])&&4===n[0].length){var u,c=0,h=0,f=0;for(u=1;u<a;u++){var d=void 0,y=void 0,m=void 0,g=void 0,D=void 0,v=void 0,M=void 0,I=void 0,x=void 0;u<=o?(g=this.calculateDM(n,u,!0),D=this.calculateDM(n,u),v=this.getTR(n[u],n[u-1]),c+=g,h+=D,f+=v,u===o&&(M=this.calculateDI(c,f),I=this.calculateDI(h,f),x=this.calculateDX(c,h),s.push([i[u],x,M,I]),r.push(i[u]),p.push([x,M,I]))):(g=this.calculateDM(n,u,!0),D=this.calculateDM(n,u),v=this.getTR(n[u],n[u-1]),d=this.smoothValues(c,g,o),y=this.smoothValues(h,D,o),m=this.smoothValues(f,v,o),c=d,h=y,f=m,M=this.calculateDI(c,f),I=this.calculateDI(h,f),x=this.calculateDX(c,h),s.push([i[u],x,M,I]),r.push(i[u]),p.push([x,M,I]))}return{values:s,xData:r,yData:p}}},e.defaultOptions=p(a.defaultOptions,{params:{index:void 0},marker:{enabled:!1},tooltip:{pointFormat:'<span style="color: {point.color}">●</span><b> {series.name}</b><br/><span style="color: {point.color}">DX</span>: {point.y}<br/><span style="color: {point.series.options.plusDILine.styles.lineColor}">+DI</span>: {point.plusDI}<br/><span style="color: {point.series.options.minusDILine.styles.lineColor}">-DI</span>: {point.minusDI}<br/>'},plusDILine:{styles:{lineWidth:1,lineColor:"#06b535"}},minusDILine:{styles:{lineWidth:1,lineColor:"#f21313"}},dataGrouping:{approximation:"averages"}}),e}(a);return r(u.prototype,{areaLinesNames:[],nameBase:"DMI",linesApiNames:["plusDILine","minusDILine"],pointArrayMap:["y","plusDI","minusDI"],parallelArrays:["x","y","plusDI","minusDI"],pointValKey:"y"}),t.compose(u),e.registerSeriesType("dmi",u),u}),o(e,"masters/indicators/dmi.src.js",[e["Core/Globals.js"]],function(t){return t})});