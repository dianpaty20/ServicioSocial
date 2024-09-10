/* *
 *
 *  (c) 2009-2024 Øystein Moseng
 *
 *  Class representing a Timeline with sonification events to play.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import TimelineChannel from './TimelineChannel.js';
import toMIDI from './MIDI.js';
import DU from '../DownloadURL.js';
const { downloadURL } = DU;
import U from '../../Core/Utilities.js';
const { defined, find, merge } = U;
/**
 * Get filtered channels. Timestamps are compensated, so that the first
 * event starts immediately.
 * @private
 */
function filterChannels(filter, channels) {
    const filtered = channels.map((channel) => {
        channel.cancel();
        return {
            channel,
            filteredEvents: channel.muted ?
                [] : channel.events.filter(filter)
        };
    }), minTime = filtered.reduce((acc, cur) => Math.min(acc, cur.filteredEvents.length ?
        cur.filteredEvents[0].time : Infinity), Infinity);
    return filtered.map((c) => (new TimelineChannel(c.channel.type, c.channel.engine, c.channel.showPlayMarker, c.filteredEvents.map((e) => merge(e, { time: e.time - minTime })), c.channel.muted)));
}
/**
 * The SonificationTimeline class. This class represents a timeline of
 * audio events scheduled to play. It provides functionality for manipulating
 * and navigating the timeline.
 * @private
 */
class SonificationTimeline {
    constructor(options, chart) {
        this.chart = chart;
        this.isPaused = false;
        this.isPlaying = false;
        this.channels = [];
        this.scheduledCallbacks = [];
        this.playTimestamp = 0;
        this.resumeFromTime = 0;
        this.options = options || {};
    }
    // Add a channel, optionally with events, to be played.
    // Note: Only one speech channel is supported at a time.
    addChannel(type, engine, showPlayMarker = false, events) {
        if (type === 'instrument' &&
            !engine.scheduleEventAtTime ||
            type === 'speech' &&
                !engine.sayAtTime) {
            throw new Error('Highcharts Sonification: Invalid channel engine.');
        }
        const channel = new TimelineChannel(type, engine, showPlayMarker, events);
        this.channels.push(channel);
        return channel;
    }
    // Play timeline, optionally filtering out only some of the events to play.
    // Note that if not all instrument parameters are updated on each event,
    // parameters may update differently depending on the events filtered out,
    // since some of the events that update parameters can be filtered out too.
    // The filterPersists argument determines whether or not the filter persists
    // after e.g. pausing and resuming. Usually this should be true.
    play(filter, filterPersists = true, resetAfter = true, onEnd) {
        if (this.isPlaying) {
            this.cancel();
        }
        else {
            this.clearScheduledCallbacks();
        }
        this.onEndArgument = onEnd;
        this.playTimestamp = Date.now();
        this.resumeFromTime = 0;
        this.isPaused = false;
        this.isPlaying = true;
        const skipThreshold = this.options.skipThreshold || 2, onPlay = this.options.onPlay, showTooltip = this.options.showTooltip, showCrosshair = this.options.showCrosshair, channels = filter ?
            filterChannels(filter, this.playingChannels || this.channels) :
            this.channels, getEventKeysSignature = (e) => Object.keys(e.speechOptions || {})
            .concat(Object.keys(e.instrumentEventOptions || {}))
            .join(), pointsPlayed = [];
        if (filterPersists) {
            this.playingChannels = channels;
        }
        if (onPlay) {
            onPlay({ chart: this.chart, timeline: this });
        }
        let maxTime = 0;
        channels.forEach((channel) => {
            if (channel.muted) {
                return;
            }
            const numEvents = channel.events.length;
            let lastCallbackTime = -Infinity, lastEventTime = -Infinity, lastEventKeys = '';
            maxTime = Math.max(channel.events[numEvents - 1] &&
                channel.events[numEvents - 1].time || 0, maxTime);
            for (let i = 0; i < numEvents; ++i) {
                const e = channel.events[i], keysSig = getEventKeysSignature(e);
                // Optimize by skipping extremely close events (<2ms apart by
                // default), as long as they don't introduce new event options
                if (keysSig === lastEventKeys &&
                    e.time - lastEventTime < skipThreshold) {
                    continue;
                }
                lastEventKeys = keysSig;
                lastEventTime = e.time;
                if (channel.type === 'instrument') {
                    channel.engine
                        .scheduleEventAtTime(e.time / 1000, e.instrumentEventOptions || {});
                }
                else {
                    channel.engine.sayAtTime(e.time, e.message || '', e.speechOptions || {});
                }
                const point = e.relatedPoint, chart = point && point.series && point.series.chart, needsCallback = e.callback ||
                    point && (showTooltip || showCrosshair) &&
                        channel.showPlayMarker !== false &&
                        (e.time - lastCallbackTime > 50 || i === numEvents - 1);
                if (point) {
                    pointsPlayed.push(point);
                }
                if (needsCallback) {
                    this.scheduledCallbacks.push(setTimeout(() => {
                        if (e.callback) {
                            e.callback();
                        }
                        if (point) {
                            if (showCrosshair) {
                                const s = point.series;
                                if (s && s.xAxis && s.xAxis.crosshair) {
                                    s.xAxis.drawCrosshair(void 0, point);
                                }
                                if (s && s.yAxis && s.yAxis.crosshair) {
                                    s.yAxis.drawCrosshair(void 0, point);
                                }
                            }
                            if (showTooltip && !(
                            // Don't re-hover if shared tooltip
                            chart && chart.hoverPoints &&
                                chart.hoverPoints.length > 1 &&
                                find(chart.hoverPoints, (p) => p === point) &&
                                // Stock issue w/Navigator
                                point.onMouseOver)) {
                                point.onMouseOver();
                            }
                        }
                    }, e.time));
                    lastCallbackTime = e.time;
                }
            }
        });
        const onEndOpt = this.options.onEnd, onStop = this.options.onStop;
        this.scheduledCallbacks.push(setTimeout(() => {
            const chart = this.chart, context = { chart, timeline: this, pointsPlayed };
            this.isPlaying = false;
            if (resetAfter) {
                this.resetPlayState();
            }
            if (onStop) {
                onStop(context);
            }
            if (onEndOpt) {
                onEndOpt(context);
            }
            if (onEnd) {
                onEnd(context);
            }
            if (chart) {
                if (chart.tooltip) {
                    chart.tooltip.hide(0);
                }
                if (chart.hoverSeries) {
                    chart.hoverSeries.onMouseOut();
                }
                chart.axes.forEach((a) => a.hideCrosshair());
            }
        }, maxTime + 250));
        this.resumeFromTime = filterPersists ? maxTime : this.getLength();
    }
    // Pause for later resuming. Returns current timestamp to resume from.
    pause() {
        this.isPaused = true;
        this.cancel();
        this.resumeFromTime = Date.now() - this.playTimestamp - 10;
        return this.resumeFromTime;
    }
    // Get current time
    getCurrent<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<assembly xmlns="urn:schemas-microsoft-com:asm.v3" manifestVersion="1.0" description="Handwriting [Beta] and pen for Malay (Brunei Darussalam)" displayName="Malay (Brunei Darussalam) handwriting" copyright="Copyright (c) Microsoft Corporation. All Rights Reserved" supportInformation="http://support.microsoft.com/?kbid=777777">
  <assemblyIdentity name="Microsoft-Windows-LanguageFeatures-Handwriting-ms-bn-Package" version="10.0.22621.1" processorArchitecture="amd64" language="neutral" buildType="release" publicKeyToken="31bf3856ad364e35" />
  <package identifier="KB777778" releaseType="OnDemand Pack">
    <mum2:customInformation xmlns:mum2="urn:schemas-microsoft-com:asm.v3">
      <mum2:OptionalFeatures SchemaVersion="1.0">
        <mum2:SettingsPageOptions Visibility="installed" FeatureType="language" ManageFeatureSettings="page=SettingsPageTimeRegionLanguage" />
      </mum2:OptionalFeatures>
    </mum2:customInformation>
    <localizedStrings>
      <string language="ar-SA" displayName="الكتابة باليد للغة المالاوية (بروناي دار السلام)‏" description="الكتابة باليد [بيتا] والقلم للغة المالاوية (بروناي دار السلام)‏" />
      <string language="bg-BG" displayName="Ръкопис на малайски език (Бруней Дарусалам)" description="Ръкопис (бета версия) и перо за малайски език (Бруней Дарусалам)" />
      <string language="cs-CZ" displayName="Rukopis pro malajštinu (Sultanát Brunej)" description="Rukopis [Beta] a pero pro malajštinu (Sultanát Brunej)" />
      <string language="da-DK" displayName="Malaysisk (Brunei Darussalam) håndskrift" description="Håndskrift [beta] og pen til malaysisk (Brunei Darussalam)" />
      <string language="de-DE" displayName="Handschrift für Malaiisch (Brunei Darussalam)" description="Handschrift [Beta] und Stift für Malaiisch (Brunei Darussalam)" />
      <string language="el-GR" displayName="Χειρόγραφο κείμενο για Μαλαϊκά (Μπρουνέι Νταρουσαλάμ)" description="Χειρόγραφο κείμενο [Beta] και πένα για Μαλαϊκά (Μπρουνέι Νταρουσαλάμ)" />
      <string language="en-GB" displayName="Malay (Brunei Darussalam) handwriting" description="Handwriting [Beta] and pen for Malay (Brunei Darussalam)" />
      <string language="en-US" displayName="Malay (Brunei Darussalam) handwriting" description="Handwriting [Beta] and pen for Malay (Brunei Darussalam)" />
      <string language="es-ES" displayName="Escritura a mano en malayo (Brunéi Darussalam)" description="Escritura a mano [beta] y lápiz para malayo (Brunéi Darussalam)" />
      <string language="es-MX" displayName="Escritura manual en malayo (Brunéi Darussalam)" description="Escritura manual [beta] y lápiz para malayo (Brunéi Darussalam)" />
      <string language="et-EE" displayName="Käsitsikiri malai keele jaoks (Brunei Darussalam)" description="Käsitsikiri [beetaversioon] ja pliiats malai keele jaoks (Brunei Darussalam)" />
      <string language="fi-FI" displayName="Malaijin (Brunei Darussalam) käsinkirjoitus" description="Käsinkirjoitus [beetaversio] ja kynä malaijille (Brunei Darussalam)" />
      <string language="fr-CA" displayName="Écriture manuscrite en malais (Brunei Darussalam)" description="Écriture manuscrite [bêta] et stylet en malais (Brunei Darussalam)" />
      <string language="fr-FR" displayName="Écriture manuscrite en malais (Brunei Darussalam)" description="Écriture manuscrite [bêta] et stylet pour le malais (Brunei Darussalam)" />
      <string language="he-IL" displayName="כתב יד במלאית (ברוניי דרוסלאם)" description="כתב יד [ביתא] ועט למלאית (ברוניי דרוסלאם)" />
      <string language="hr-HR" displayName="Rukopis za malajski (Brunej Darussalam)" description="Rukopis [Beta] i olovka za malajski (Brunej Darussalam)" />
      <string language="hu-HU" displayName="Maláj (Brunei szultanátusi) kézírás-felismerés" description="Kézírás-felismerés [bétaverzió] és tollkezelés (Brunei szultanátusi) maláj nyelven" />
      <string language="it-IT" displayName="Scrittura manuale malese (Brunei Darussalam)" description="Scrittura manuale [Beta] e penna per malese (Brunei Darussalam)" />
      <string language="ja-JP" displayName="マレー語 (ブルネイ ダルサラーム) 手書き入力" description="マレー語 (ブルネイ ダルサラーム) の手書き入力 [ベータ版] とペン" />
      <string language="ko-KR" displayName="말레이어(브루나이) 필기" description="말레이어(브루나이) 필기 [베타] 및 펜" />
      <string language="lt-LT" displayName="Malajiečių (Brunėjaus Darusalamas) rankraštis" description="Malajiečių (Brunėjaus Darusalamas) rankraštis [beta] ir liestukas" />
      <string language="lv-LV" displayName="Malajiešu (Bruneja Darusalama) valodas rokraksts" description="Rokraksts [Beta] un pildspalva malajiešu (Bruneja Darusalama) valodai" />
      <string language="nb-NO" displayName="Malayisk (Brunei Darussalam) håndskrift" description="Håndskrift [Beta] og penn for malayisk (Brunei Darussalam)" />
      <string language="nl-NL" displayName="Handgeschreven tekst in het Maleis (Brunei Darussalam)" description="Handgeschreven tekst [Bèta] en pen voor het Maleis (Brunei Darussalam)" />
      <string language="pl-PL" displayName="Pismo ręczne dla języka malajskiego (Brunei Darussalam)" description="Pismo ręczne [Beta] i pióro dla języka malajskiego (Brunei Darussalam)" />
      <string language="pt-BR" displayName="Manuscrito para malaio (Brunei Darussalam)" description="Manuscrito [beta] e caneta para Malaio (Brunei Darussalam)" />
      <string language="pt-PT" displayName="Escrita manual em malaio (Brunei Darussalam)" description="Escrita manual [Beta] e em caneta para Malaio (Brunei Darussalam)" />
      <string language="ro-RO" displayName="Scriere de mână pentru malaysiană (Brunei Darussalam)" description="Scriere de mână [Beta] și stilou pentru malaysiană (Brunei Darussalam)" />
      <string language="ru-RU" displayName="Рукописный ввод на малайском языке (Бруней-Даруссалам)" description="Рукописный ввод [бета-версия] и ввод с помощью пера на малайском языке (Бруней-Даруссалам)" />
      <string language="sk-SK" displayName="Písanie rukou pre malajčinu (Brunejsko-darussalamský štát)" description="Písanie rukou [Beta] a perom pre malajčinu (Brunejsko-darussalamský štát)" />
      <string language="sl-SI" displayName="Rokopis za malajščino (Brunej Darussalam)" description="Rokopis [beta] in pero za malajščino (Brunej Darussalam)" />
      <string language="sr-Latn-RS" displayName="Rukopis za malajski (Brunej Daresalam)" description="Rukopis [Beta] i olovka za malajski (Brunej Daresalam)" />
      <string language="sv-SE" displayName="Handskrift för malajiska (Brunei Darussalam)" description="Handskrift [Beta] och penna för malajiska (Brunei Darussalam)" />
      <string language="th-TH" displayName="ข้อความที่เขียนด้วยลายมือภาษามลายู (บรูไนดารุสซาลาม)" description="ข้อความที่เขียนด้วยลายมือ [รุ่นเบต้า] และปากกาสำหรับภาษามลายู (บรูไนดารุสซาลาม)" />
      <string language="tr-TR" displayName="Malay dili (Barış Yurdu Brunei Devleti) el yazısı" description="Malay dili (Barış Yurdu Brunei Devleti) için el yazısı [Beta] ve kalem" />
      <string language="uk-UA" displayName="Рукописний текст: малайська (Бруней-Даруссалам)" description="Рукописний текст [бета-версія] і перо: малайська (Бруней-Даруссалам)" />
      <string language="zh-CN" displayName="马来语(文莱达鲁萨兰国)手写" description="马来语(文莱达鲁萨兰国)的手写 [Beta] 和笔" />
      <string language="zh-TW" displayName="馬來文 (汶萊達魯薩蘭) 手寫" description="適用於馬來文 (汶萊達魯薩蘭) 的手寫 [搶鮮版 (Beta)] 與手寫筆" />
    </localizedStrings>
    <declareCapability>
      <capability>
        <capabilityIdentity name="Language.Handwriting" version="1.0" language="ms-bn" />
      </capability>
      <dependency>
        <capabilityIdentity name="Language.Basic" version="1.0" language="ms-bn" />
      </dependency>
    </declareCapability>
    <update name="4cc125d800e7d01d0c04852f65538045">
      <component>
        <assemblyIdentity name="Microsoft-Windows-LanguageFeatures-Handwriting-ms-bn-Deployment" version="10.0.22621.1" processorArchitecture="amd64" language="neutral" buildType="release" publicKeyToken="31bf3856ad364e35" versionScope="nonSxS" />
      </component>
    </update>
    <update name="2603ec80c001f614b6ed639a3726ad97">
      <package contained="false" integrate="hidden">
        <assemblyIdentity name="Microsoft-Windows-LanguageFeatures-Handwriting-ms-bn-Package" version="10.0.22621.1" processorArchitecture="wow64" language="neutral" buildType="release" publicKeyToken="31bf3856ad364e35" />
      </package>
    </update>
    <packageExtended packageSize="3759201" />
  </package>
</assembly>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               