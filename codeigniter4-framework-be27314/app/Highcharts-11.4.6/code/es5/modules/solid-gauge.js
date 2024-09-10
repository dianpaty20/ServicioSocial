!/**
 * Highcharts JS v11.4.6 (2024-07-08)
 *
 * Solid angular gauge module
 *
 * (c) 2010-2024 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */function(t){"object"==typeof module&&module.exports?(t.default=t,module.exports=t):"function"==typeof define&&define.amd?define("highcharts/modules/solid-gauge",["highcharts","highcharts/highcharts-more"],function(o){return t(o),t.Highcharts=o,t}):t("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(t){"use strict";var o=t?t._modules:{};function e(o,e,r,s){o.hasOwnProperty(e)||(o[e]=s.apply(null,r),"function"==typeof CustomEvent&&t.win.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:e,module:o[e]}})))}e(o,"Core/Axis/Color/ColorAxisLike.js",[o["Core/Color/Color.js"],o["Core/Utilities.js"]],function(t,o){var e,r,s=t.parse,i=o.merge;return(e=r||(r={})).initDataClasses=function(t){var o,e,r,n=this.chart,a=this.legendItem=this.legendItem||{},l=this.options,d=t.dataClasses||[],h=n.options.chart.colorCount,u=0;this.dataClasses=e=[],a.labels=[];for(var c=0,p=d.length;c<p;++c)o=i(o=d[c]),e.push(o),(n.styledMode||!o.color)&&("category"===l.dataClassColor?(n.styledMode||(h=(r=n.options.colors||[]).length,o.color=r[u]),o.colorIndex=u,++u===h&&(u=0)):o.color=s(l.minColor).tweenTo(s(l.maxColor),p<2?.5:c/(p-1)))},e.initStops=function(){for(var t=this.options,o=this.stops=t.stops||[[0,t.minColor||""],[1,t.maxColor||""]],e=0,r=o.length;e<r;++e)o[e].color=s(o[e][1])},e.normalizedValue=function(t){var o=this.max||0,e=this.min||0;return this.logarithmic&&(t=this.logarithmic.log2lin(t)),1-(o-t)/(o-e||1)},e.toColor=function(t,o){var e,r,s,i,n,a,l=this.dataClasses,d=this.stops;if(l){for(a=l.length;a--;)if(r=(n=l[a]).from,s=n.to,(void 0===r||t>=r)&&(void 0===s||t<=s)){i=n.color,o&&(o.dataClass=a,o.colorIndex=n.colorIndex);break}}else{for(e=this.normalizedValue(t),a=d.length;a--&&!(e>d[a][0]););r=d[a]||d[a+1],e=1-((s=d[a+1]||r)[0]-e)/(s[0]-r[0]||1),i=r.color.tweenTo(s.color,e)}return i},r}),e(o,"Core/Axis/SolidGaugeAxis.js",[o["Core/Axis/Color/ColorAxisLike.js"],o["Core/Utilities.js"]],function(t,o){var e=o.extend;return{init:function(o){e(o,t)}}}),e(o,"Series/SolidGauge/SolidGaugeSeriesDefaults.js",[],function(){return{colorByPoint:!0,dataLabels:{y:0}}}),e(o,"Series/SolidGauge/SolidGaugeSeries.js",[o["Extensions/BorderRadius.js"],o["Core/Series/SeriesRegistry.js"],o["Core/Axis/SolidGaugeAxis.js"],o["Series/SolidGauge/SolidGaugeSeriesDefaults.js"],o["Core/Utilities.js"]],function(t,o,e,r,s){var i,n=this&&this.__extends||(i=function(t,o){return(i=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,o){t.__proto__=o}||function(t,o){for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e])})(t,o)},function(t,o){if("function"!=typeof o&&null!==o)throw TypeError("Class extends value "+String(o)+" is not a constructor or null");function e(){this.constructor=t}i(t,o),t.prototype=null===o?Object.create(o):(e.prototype=o.prototype,new e)}),a=o.seriesTypes,l=a.gauge,d=a.pie,h=s.clamp,u=s.extend,c=s.isNumber,p=s.merge,g=s.pick,f=s.pInt,C=function(o){function s(){return null!==o&&o.apply(this,arguments)||this}return n(s,o),s.prototype.translate=function(){var t=this.yAxis;e.init(t),!t.dataClasses&&t.options.dataClasses&&t.initDataClasses(t.options),t.initStops(),l.prototype.translate.call(this)},s.prototype.drawPoints=function(){var o,e=this.yAxis,r=e.center,s=this.options,i=this.chart.renderer,n=s.overshoot,a=s.rounded&&void 0===s.borderRadius,l=c(n)?n/180*Math.PI:0;c(s.threshold)&&(o=e.startAngleRad+e.translate(s.threshold,void 0,void 0,void 0,!0)),this.thresholdAngleRad=g(o,e.startAngleRad);for(var d=0,p=this.points;d<p.length;d++){var C=p[d];if(!C.isNull){var m=f(g(C.options.radius,s.radius,100))*r[2]/200,y=f(g(C.options.innerRadius,s.innerRadius,60))*r[2]/200,v=Math.min(e.startAngleRad,e.endAngleRad),x=Math.max(e.startAngleRad,e.endAngleRad),A=C.graphic,R=e.startAngleRad+e.translate(C.y,void 0,void 0,void 0,!0),j=void 0,S=void 0,b=e.toColor(C.y,C);"none"===b&&(b=C.color||this.color||"none"),"none"!==b&&(C.color=b),R=h(R,v-l,x+l),!1===s.wrap&&(R=h(R,v,x));var w=a?(m-y)/2/m:0,M=Math.min(R,this.thresholdAngleRad)-w,_=Math.max(R,this.thresholdAngleRad)+w;_-M>2*Math.PI&&(_=M+2*Math.PI);var G=a?"50%":0;s.borderRadius&&(G=t.optionsToObject(s.borderRadius).radius),C.shapeArgs=j={x:r[0],y:r[1],r:m,innerR:y,start:M,end:_,borderRadius:G},C.startR=m,A?(S=j.d,A.animate(u({fill:b},j)),S&&(j.d=S)):C.graphic=A=i.arc(j).attr({fill:b,"sweep-flag":0}).add(this.group),this.chart.styledMode||("square"!==s.linecap&&A.attr({"stroke-linecap":"round","stroke-linejoin":"round"}),A.attr({stroke:s.borderColor||"none","stroke-width":s.borderWidth||0})),A&&A.addClass(C.getClassName(),!0)}}},s.prototype.animate=function(t){t||(this.startAngleRad=this.thresholdAngleRad,d.prototype.animate.call(this,t))},s.defaultOptions=p(l.defaultOptions,r),s}(l);return o.registerSeriesType("solidgauge",C),C}),e(o,"masters/modules/solid-gauge.src.js",[o["Core/Globals.js"]],function(t){return t})});