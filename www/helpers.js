define(function(require) {
    'use strict';

    var $ = require('jquery');

    var self = {
        settings: (function() {
            var settings = {};
            settings.pageEditorBodyClass = 'page-editor-mode';
            settings.javascriptPath = window.jsPath;
            settings.componentsPath = settings.javascriptPath + 'components/';

            return settings;
        })(),

        cacheDom: function() {
            self.dom = {};
            self.dom.body = $(document.body);
            self.dom.window = $(window);
            self.dom.topLevel = $('html, body');
            self.dom.siteWrapper = $('.site-wrapper');
        },

        init: function() {
            self.cacheDom();
            self.detectPageEditor();

            return self;
        },

        flattenArray: function(baseArray) {
            var flattened = [];

            $.each(baseArray, function (baseArrayIndex, baseArrayItem) {
                $.each(baseArrayItem, function (subArrayIndex, subArrayItem) {
                    flattened.push({ data: subArrayItem, baseArrayIndex: baseArrayIndex, subArrayIndex: subArrayIndex });
                });
            });

            return flattened;
        },

        parsePageDataJSON: function(el) {
            var json = el.text().trim();
            if (json.slice(json.length - 1) === ";") {
                json = json.slice(0, json.length - 1);
            }
            return $.parseJSON(json);
        },

        detectPageEditor: function() {
            self.isPageEditor = self.dom.siteWrapper.hasClass(self.settings.pageEditorBodyClass);
        },

        capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },

        repositionFooter: function() {
            self.dom.window.trigger('reposition_footer');
        },

        initialCaps: function(str) {
            var arr = str.split(' ');

            for (var i = 0; i < arr.length; i++) {
                arr[i] = self.capitalize(arr[i]);
            }

            return arr.join(' ');
        },

        scrollToElement: function(el, padding) {
            var topOffset = el.offset().top;
            padding = padding || 0;

            self.dom.topLevel.animate({scrollTop: topOffset - padding}, 300);
        },

        validDate: function (dateStr) {
            var valid = false,
                d = new Date(dateStr);

            if (Object.prototype.toString.call(d) === "[object Date]") {
                // it is a date
                if (!isNaN(d.getTime())) {
                    valid = true;
                }
            }

            return valid;
        },

        constructGoogleMapsLink: function(address, coords) {
            /* //www.google.com/maps/place/120+E+Main+St,+Aspen,+CO+81611,17z */

            // removing the ,17z from the map url as this causes unintended side-effects
            // maybe should only be used with coords?
            // var mapsURL = 'https://www.google.com/maps/place/' + address + ',17z';
            var mapsUrl;

            if (coords.lat === 0 ||
                coords.lng === 0) {
                mapsUrl = 'https://www.google.com/maps/place/' + address;
                mapsUrl = mapsUrl.replace(/ /g, '+');
            } else {
                mapsUrl = 'https://www.google.com/maps/?q=' + coords.lat + ',+' + coords.lng;
            }

            return mapsUrl;
        },

        yAxisScrollOffset: function () {
            return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        },

        next_day: function (date) {
            var e = new Date(date.getTime() + 24 * 60 * 60 * 1000);
            if (e.getHours() !== date.getHours()) {
                e = new Date(e.getTime() + (e.getHours() - date.getHours()) * 60 * 60 * 1000);
            }
            return e;
        },

        monthName: function(date, short) {
            var month = date.getMonth(),
                type = short ? 'abbr' : 'full',
                months = [
                    {full: 'January', abbr: 'Jan'},
                    {full: 'February', abbr: 'Feb'},
                    {full: 'March', abbr: 'Mar'},
                    {full: 'April', abbr: 'Apr'},
                    {full: 'May', abbr: 'May'},
                    {full: 'June', abbr: 'June'},
                    {full: 'July', abbr: 'July'},
                    {full: 'August', abbr: 'Aug'},
                    {full: 'September', abbr: 'Sept'},
                    {full: 'October', abbr: 'Oct'},
                    {full: 'November', abbr: 'Nov'},
                    {full: 'December', abbr: 'Dec'}
                ];

            return months[month][type];
        },

        relativeProtocol: function(url) {
            var arr = url.split('://');

            return '//' + arr[arr.length - 1];
        },

        baseUrl: function(){
            return window.location.href.substring(0, window.location.href.indexOf("?"));
        },

        getCookie: function() {
            return document.cookie;
        },

        getLocation: function() {
            return window.location;
        },

        getCookieByName: function (name) {
            var regex, results;

            regex = new RegExp('(^| )' + name + '=([^;]+)');
            results = regex.exec(self.getCookie());

            return results === null ? '' : results[2];
        },

        setCookie: function (name, value) {
            document.cookie = name + "=" + value;
        },

        clearCookieByName: function (name) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        },

        clearAllCookies: function() {
            var cookies = self.getCookie().split('; ');

            for (var i=0; i < cookies.length; i++) {
                var thisCookiePair = cookies[i],
                    thisCookieName = thisCookiePair.split("=")[0];
                self.clearCookieByName(thisCookieName);
            }
        },

        getParameterByName: function (name) {
            var regex, results;

            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');

            regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            results = regex.exec(self.getLocation().search);

            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        },

        getNavigator: function () {
            return navigator;
        },

        isUserAgentChrome44OrLess: function () {
            var navigator = self.getNavigator(),
                match = navigator.userAgent.toLowerCase().match(/chrome\/\d+/i),
                temp;

            if (match === null) {
                return false;
            }

            temp = match[0]; // should only be one match
            temp = temp.split('/'); // a match will have a forward slash
            temp = temp[1]; // we want the second part (the number)
            temp = Number(temp); // let's make the number a number

            return temp <= 44;
        },

        isUserAgentIe9: function() {
            var navigator = self.getNavigator();

            return Boolean(navigator.userAgent.toLowerCase().match(/msie 9/i));
        },

        isUserAgentChromeWindows: function () {
            var navigator = self.getNavigator();

            return Boolean(navigator.userAgent.toLowerCase().match(/chrome/i)) &&
                Boolean(navigator.platform.toLowerCase().match(/win32/i)) &&
                Boolean(navigator.vendor.toLowerCase().match(/google/i));
        },

        // found here: http://detectmobilebrowsers.com/
        isMobileDevice: function () {
            var navigator = self.getNavigator(),
                a = navigator.userAgent || navigator.vendor || window.opera;

            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
                return true;
            }

            return false;
        },

        // adding tablet support as described here: http://detectmobilebrowsers.com/about
        isMobileOrTabletDevice: function () {
            var navigator = self.getNavigator(),
                a = navigator.userAgent || navigator.vendor || window.opera;

            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
                return true;
            }

            return false;
        },

        // Debounce borrowed from underscore.js
        debounce: function(func, wait, immediate) {
            var timeout, args, context, timestamp, result;

            var later = function() {
                var last = self.now() - timestamp;

                if (last < wait && last >= 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    }
                }
            };

            return function() {
                context = this;
                args = arguments;
                timestamp = self.now();
                var callNow = immediate && !timeout;
                if (!timeout) timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }

                return result;
            };
        },

        now: Date.now || function() {
            return new Date().getTime();
        },

        // windowWidth, windowHeight and windowWidthsGreaterThan are trying to keep
        // screen size detection as efficient as possible for cases wehre
        // they are called frequently. Significantly faster than Modernizr.mq or $(window).width()
        windowWidth: function() {
            return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        },

        windowHeight: function() {
            return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        },

        windowWidthsGreaterThan: function(width) {
            var winWidth = self.windowWidth();

            return winWidth > width;
        },

        windowWidthLessThan: function(width) {
            var winWidth = self.windowWidth();

            return winWidth < width;
        },

        loadErrorTemplates: function(templatePath) {
            var deferred = $.Deferred(),
                basePath = 'text!/public/AspenSnowmass/templates/',
                templates = (function() {
                    if (typeof(templatePath) === 'string') {
                        templatePath = [templatePath];
                    }

                    return templatePath.map(function(path) {
                        return basePath + path;
                    });
                })();

            require(templates, function(template) {
                deferred.resolve(template);
            });

            return deferred;
        },

        performanceNow: function () {
            if (window.performance && window.performance.now) {
                return window.performance.now();
            }

            return self.now();
        },

        generateGuid: function () { // this should only be used where guid is constrained to the front end
            // method courtesy of: http://stackoverflow.com/a/8809472
            var d = self.performanceNow(),
                uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random()*16)%16 | 0;
                    d = Math.floor(d/16);
                    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                });
            return uuid;
        },

        fetch : function(url, options){
            var defaults = {
                method: "GET",
                cache: false
            };
            var settings = $.extend({}, defaults, options);
            return new Promise(function(resolve, reject){
                $.ajax({
                    url : url,
                    method: settings.method,
                    cache: settings.cache,
                    success : resolve,
                    error : reject
                });
            });
        },

        getTemperatureUnit : function(type){
            return type.toLowerCase() == "imperial" ? "F" : "C";
        },

        getLengthUnit : function(type){
            return type.toLowerCase() == "imperial" ? "\"" : "cm";
        },

        arrayWhere : function(array, whereFunction){
            var resultArray = [];
            for(var i = 0; i < array.length; i++){
                if(whereFunction(array[i])){
                    resultArray.push(array[i]);
                }
            }
            return resultArray;
        },

        arrayRemoveWhere : function(array, whereFunction){
            var remaining = [];

            for (var i = 0; i < array.length; i++) {
                if (!whereFunction(array[i])){
                    remaining.push(array[i]);
                }
            }

            return remaining;
        },

        arrayFirst : function(array, whereFunction){
            for(var i = 0; i < array.length; i++){
                if(whereFunction(array[i])){
                    return array[i];
                }
            }
            return null;
        },

        centeredPopup: function (url, title, w, h, additionalOptions) {
            //Based on code here: http://www.xtf.dk/2011/08/center-new-popup-window-even-on.html
            // Fixes dual-screen position                         Most browsers      Firefox
            var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;
            var newWindow = window.open(url, title, 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left + ', ' + additionalOptions);

            // Puts focus on the newWindow
            if (window.focus) {
                newWindow.focus();
            }
        },

        getMatchingCss : function(element) {
            var sheets = document.styleSheets;
            var matches = {};
            element.matches = element.matches || element.msMatchesSelector;
            for (var i in sheets) {
                var rules = sheets[i].rules || sheets[i].cssRules;
                for (var rule in rules) {
                    try {
                        if (element.matches(rules[rule].selectorText)) {
                            $.extend(matches, rules[rule].style);
                        }
                    } catch (err) {
                        console.log('Got a bad style, but carrying on.', rules[rule].selectorText);
                    }
                }
            }
            return matches;
        },

        cloneParentNodeTree : function(el){
            var nodes = [];
            while(el.parentNode){
                nodes.unshift(el.cloneNode(false));
                el = el.parentNode;
            }
            var root = nodes[0];
            for(var i = 1; i < nodes.length; i++){
                nodes[i - 1].appendChild(nodes[i]);
            }

            return {
                root : root,
                element : nodes[nodes.length - 1]
            };
        },
        isPlainObject : function(value){
            if(typeof(value) !== "object" || value === null){
                return false;
            }
            if(value.nodeType){
                return false;
            }
            if(value.constructor && !Object.prototype.hasOwnProperty.call(value.constructor.prototype, "isPrototypeOf" )){
                return false;
            }

            return true;
        },
        extendIgnoreEmpties : function() {
            var target = arguments[0] || {};
            var sources = Array.prototype.slice.call(arguments, 1);
            for(var i = 0; i < sources.length; i++){
                var source = sources[i];
                for (var prop in source) {
                    if (self.isPlainObject(source[prop])) {
                        target[prop] = extend(target[prop], source[prop]);
                    } else if(source[prop] !== undefined && source[prop] !== null && source[prop] !== ""){
                        target[prop] = source[prop];
                    }
                }
            }
            return target;
        }

    };

    return self.init();
});
