(function e(b, g, d) {
    function c(m, j) {
        if (!g[m]) {
            if (!b[m]) {
                var i = typeof require == "function" && require;
                if (!j && i) {
                    return i(m, !0)
                }
                if (a) {
                    return a(m, !0)
                }
                var k = new Error("Cannot find module '" + m + "'");
                throw k.code = "MODULE_NOT_FOUND",
                k
            }
            var h = g[m] = {
                exports: {}
            };
            b[m][0].call(h.exports, 
            function(l) {
                var o = b[m][1][l];
                return c(o ? o: l)
            },
            h, h.exports, e, b, g, d)
        }
        return g[m].exports
    }
    var a = typeof require == "function" && require;
    for (var f = 0; f < d.length; f++) {
        c(d[f])
    }
    return c
})({
    1: [function(b, c, a) {
        window.DatePicker = b("./index.js")
    },
    {
        "./index.js": 2
    }],
    2: [function(b, c, a) {
        c.exports = b("./lib/datepicker").DatePicker
    },
    {
        "./lib/datepicker": 4
    }],
    3: [function(b, c, a) {
        function d() {}
        d.prototype = {
            getDaysInMonth: function(f, g) {
                return new Date(f, g, 0).getDate()
            },
            getFirstdayWeek: function(f, g) {
                return new Date(f, g - 1, 1).getDay()
            },
            getLastDayInMonth: function(f, g) {
                return new Date(f, g - 1, this.getDaysInMonth(f, g))
            },
            getLastMonth: function(i, j, f) {
                var g = (j - 1 === 0 ? 12: j - 1),
                h = (j - 1 === 0 ? i - 1: i);
                if ( !! f) {
                    g = (j === 0 ? 11: j - 1);
                    h = (j === 0 ? i - 1: i)
                }
                return {
                    year: h,
                    month: g
                }
            },
            getNextMonth: function(g, h) {
                var f = (h + 1 === 12 ? 0: h + 1);
                nextYear = (h + 1 === 12 ? g + 1: g);
                return {
                    year: nextYear,
                    month: f
                }
            },
            _packLastMonthDays: function(k, m, j) {
                var f = null,
                l = [],
                h = this.getLastMonth(k, m),
                n = this.getDaysInMonth(h.year, h.month);
                startIndex = (j === 0 ? 6: j - 1);
                for (var g = startIndex; g >= 0; g--) {
                    f = {
                        num: n - g,
                        gray: 1
                    };
                    l.push(f)
                }
                return l
            },
            _packNextMonthDays: function(h, j) {
                var l = [],
                f = null,
                j = j || 0,
                k = (h < 6 ? (6 - h) : (6 - h) + 7);
                for (var g = 1; g <= k + j; g++) {
                    f = {
                        num: g,
                        gray: 1
                    };
                    l.push(f)
                }
                return l
            },
            _packCurrMonthDays: function(k, j) {
                var h = [],
                f = null;
                for (var g = 1; g <= k; g++) {
                    f = {
                        num: g,
                        gray: 0
                    };
                    f.active = (g === j ? 1: 0);
                    h.push(f)
                }
                return h
            },
            getOneMonth: function(m, k, n) {
                var p = this.getDaysInMonth(m, k),
                g = this.getFirstdayWeek(m, k),
                o = this.getLastDayInMonth(m, k).getDay();
                var l = [];
                var j = this._packLastMonthDays(m, k, g),
                f = this._packCurrMonthDays(p, n),
                i = (j.length + f.length < 35 ? 7: 0),
                h = this._packNextMonthDays(o, i);
                l = l.concat(j, f, h);
                return l
            }
        };
        c.exports = d
    },
    {}],
    4: [function(b, a, d) {
        var g = b("./datepicker_tpl"),
        f = b("./util"),
        k = b("./dateparse"),
        c = b("fastclick");
        var i = {
            minDate: "",
            maxDate: "",
            currDate: new Date(),
            panelShow: "datepicker_show",
            grayCls: "datepicker__day-item_gray",
            activeCls: "datepicker__day-item_active",
            confirmCbk: null
        };
        function h(l) {
            this.config = $.extend(i, l || {});
            this._init()
        }
        f.inheritPrototype(h, k);
        var j = {
            _init: function() {
                this._appendPanel();
                this._initDom();
                this._initEvents()
            },
            _initEvents: function() {
                var l = this;
                aniEvt = f.whichTransitionEvent();
                c(document.body);
                this.$cancel.on("click", this.close.bind(this));
                this.$mask.on("click", this.close.bind(this));
                this.$mPrev.on("click", this._clickPrevMonth.bind(this));
                this.$mNext.on("click", this._clickNextMonth.bind(this));
                this.$yPrev.on("click", this._clickPrevYear.bind(this));
                this.$yNext.on("click", this._clickNextYear.bind(this));
                this.$confirm.on("click", this._onClickConfirm.bind(this));
                this.$panel.on("click", ".datepicker__day-item", 
                function(m) {
                    l._onClickDayBtn.call(l, this)
                });
                this.$panel.on(aniEvt, ".datepicker__day-list_prev", 
                function() {
                    $(this).remove()
                });
                this.$panel.on(aniEvt, ".datepicker__day-list_next", 
                function() {
                    $(this).remove()
                });
                this.$panel.on(aniEvt, ".datepicker__mask", 
                function() {
                    if (!l.$picker.hasClass(l.config.panelShow)) {
                        l.$picker.addClass("ui-d-n")
                    }
                })
            },
            _initDom: function() {
                this.$picker = $(".datepicker");
                this.$mask = this.$panel.find(".datepicker__mask");
                this.$dayList = this.$panel.find(".datepicker__day-wrap");
                this.$yPrev = this.$panel.find("#_j_year_prev");
                this.$yNext = this.$panel.find("#_j_year_next");
                this.$mPrev = this.$panel.find("#_j_month_prev");
                this.$mNext = this.$panel.find("#_j_month_next");
                this.$year = this.$panel.find("#_j_year_text");
                this.$month = this.$panel.find("#_j_month_text");
                this.$cancel = this.$panel.find("#_j_cancel_btn");
                this.$confirm = this.$panel.find("#_j_confirm_btn")
            },
            _appendPanel: function() {
                var o = this,
                q = this.config.currDate,
                n = q.getFullYear(),
                p = q.getMonth() + 1,
                l = q.getDate(),
                m = o.getOneMonth(n, p, l),
                r = {
                    year: n,
                    month: p,
                    all_days: o._genOneMonthStr(m).join("")
                };
                this.$panel = $(f.format(g, r));
                $("body").append(this.$panel);
                this._saveCurrentData(n, p, q.getDate())
            },
            _genOneMonthStr: function(p) {
                var r = [],
                l = "datepicker__day-item ",
                t = "datepicker__day-item_gray",
                m = "datepicker__day-item_active",
                o = "",
                s = "";
                for (var n = 0, q = p.length; n < q; n++) {
                    o = (p[n].gray ? l + t: l);
                    o = (p[n].active ? o + m: o);
                    s = '<li class="' + o + '">' + p[n].num + "</li>";
                    r.push(s)
                }
                return r
            },
            _appendMonth: function(o, p, l, q) {
                var m = this.getOneMonth(o, p, l),
                n = this._genOneMonthStr(m).join("");
                _class = (q ? "datepicker__day-list datepicker__day-list_prev": "datepicker__day-list datepicker__day-list_next"),
                $newMonth = $('<ul class="' + _class + '">' + n + "</ul>");
                this.$dayList.append($newMonth)
            },
            _toggleMonth: function(l, r, q, s) {
                this._appendMonth(l, r, q, s);
                this._saveCurrentData(l, r, q);
                this._syncDataToDom();
                var p = "datepicker__day-list-curr",
                o = (s ? "datepicker__day-list_prev": "datepicker__day-list_next"),
                n = (s ? "datepicker__day-list_next": "datepicker__day-list_prev");
                var m = $("." + p);
                setTimeout(function() {
                    $("." + o).removeClass(o).addClass(p);
                    m.addClass(n).removeClass(p)
                },
                0)
            },
            _saveCurrentData: function(m, n, l) {
                this.data = {
                    year: m,
                    month: n,
                    day: l
                }
            },
            _getCurrentData: function() {
                return this.data

            },
            _syncDataToDom: function() {
                var n = this._getCurrentData(),
                m = (n.month === 0 ? 12: n.month),
                l = (n.month === 0 ? n.year - 1: n.year);
                this.$year.text(l + "年");
                this.$month.text(m + "月")
            },
            _clickPrevMonth: function() {
                var l = this._getCurrentData();
                last = this.getLastMonth(l.year, l.month, true),
                prevYear = last.year,
                prevMonth = last.month;
                this._toggleMonth(prevYear, prevMonth, l.day, 1)
            },
            _clickNextMonth: function() {
                var l = this._getCurrentData();
                next = this.getNextMonth(l.year, l.month),
                nextYear = next.year,
                nextMonth = next.month;
                this._toggleMonth(nextYear, nextMonth, l.day, 0)
            },
            _clickPrevYear: function() {
                var l = this._getCurrentData();
                this._toggleMonth(l.year - 1, l.month, l.day, 1)
            },
            _clickNextYear: function() {
                var l = this._getCurrentData();
                this._toggleMonth(l.year + 1, l.month, l.day, 0)
            },
            _onClickDayBtn: function(n) {
                var l = this.config.grayCls,
                o = this.config.activeCls,
                p = this._getCurrentData(),
                m = $(n);
                if (m.hasClass(l) || m.hasClass(o)) {
                    return
                }
                $(".datepicker__day-item").removeClass(o);
                m.addClass(o);
                this._saveCurrentData(p.year, p.month, parseInt(m.text()))
            },
            _onClickConfirm: function() {
                var l = this._getCurrentData();
                this.close();
                this.config.confirmCbk && this.config.confirmCbk(l)
            },
            open: function(l) {
                var m = this;
                m.$el = (l ? l: null);
                m.$picker.removeClass("ui-d-n");
                setTimeout(function() {
                    m.$panel.addClass(m.config.panelShow)
                },
                30)
            },
            close: function() {
                var l = this;
                l.$panel.removeClass(l.config.panelShow);
                setTimeout(function() {
                    l.$picker.addClass("ui-d-n")
                },
                310)
            }
        };
        f.extend(j, h.prototype);
        a.exports = {
            DatePicker: h
        }
    },
    {
        "./dateparse": 3,
        "./datepicker_tpl": 5,
        "./util": 6,
        "fastclick": 7
    }],
    5: [function(c, d, a) {
        var b = ['<div class="datepicker ui-d-n">', '	<div class="datepicker__mask"></div>', '	<div class="datepicker__main">', '		<div class="datepicker__header">', '			<div class="datepicker__time-toggle"></div>', '			<div class="datepicker__time-selector-list">', '				<div class="datepicker__time-selector-item">', '					<a href="javascript:;" class="datepicker__time-selector-arrow datepicker__time-selector-prev" id="_j_year_prev">&lt;</a>', '					<a href="javascript:;" class="datepicker__time-selector-text" id="_j_year_text">{year}年</a>', '					<a href="javascript:;" class="datepicker__time-selector-arrow datepicker__time-selector-next" id="_j_year_next">&gt;</a>', "				</div>", '				<div class="datepicker__time-selector-item">', '					<a href="javascript:;" class="datepicker__time-selector-arrow datepicker__time-selector-prev" id="_j_month_prev">&lt;</a>', '					<a href="javascript:;" class="datepicker__time-selector-text" id="_j_month_text">{month}月</a>', '					<a href="javascript:;" class="datepicker__time-selector-arrow datepicker__time-selector-next" id="_j_month_next" >&gt;</a>', "				</div>", "			</div>", "		</div>", '		<div class="datepicker__panel">', '			<ul class="datepicker__week-list">', '				<li class="datepicker__week-item">日</li>', '				<li class="datepicker__week-item">一</li>', '				<li class="datepicker__week-item">二</li>', '				<li class="datepicker__week-item">三</li>', '				<li class="datepicker__week-item">四</li>', '				<li class="datepicker__week-item">五</li>', '				<li class="datepicker__week-item">六</li>', "			</ul>", '			<div class="datepicker__day-wrap">', '				<ul class="datepicker__day-list datepicker__day-list-curr">', "					{all_days}", "				</ul>", "			</div>", "		</div>", "		", '		<div class="datepicker__footer">', '			<div class="datepicker__btn" id="_j_confirm_btn">确定</div>', '			<div class="datepicker__btn" id="_j_cancel_btn">取消</div>', "		</div>", "	</div>", "</div>"].join("");
        d.exports = b
    },
    {}],
    6: [function(c, d, b) {
        var a = {
            inheritPrototype: function(h, g) {
                var f = Object.create(g.prototype);
                f.constructor = h;
                h.prototype = f
            },
            extend: function(f, h) {
                for (var g in f) {
                    h[g] = f[g]
                }
            },
            format: function(f, g) {
                f = f + "";
                return f.replace(/\{(\w+)\}/g, 
                function(h, i) {
                    return g[i] !== undefined ? g[i].toString() : h
                })
            },
            whichTransitionEvent: function() {
                var f,
                g = document.createElement("fakeelement");
                transitions = {
                    "OTransition": "oTransitionEnd",
                    "MSTransition": "msTransitionEnd",
                    "MozTransition": "transitionend",
                    "WebkitTransition": "webkitTransitionEnd",
                    "transition": "transitionEnd"
                };
                for (f in transitions) {
                    if (g.style[f] !== undefined) {
                        return transitions[f]
                    }
                }
                return false
            }
        };
        d.exports = a
    },
    {}],
    7: [function(b, c, a) { (function() {
            function h(r, o) {
                var s;
                o = o || {};
                this.trackingClick = false;
                this.trackingClickStart = 0;
                this.targetElement = null;
                this.touchStartX = 0;
                this.touchStartY = 0;
                this.lastTouchIdentifier = 0;
                this.touchBoundary = o.touchBoundary || 10;
                this.layer = r;
                this.tapDelay = o.tapDelay || 200;
                this.tapTimeout = o.tapTimeout || 700;
                if (h.notNeeded(r)) {
                    return
                }
                function t(u, l) {
                    return function() {
                        return u.apply(l, arguments)
                    }
                }
                var n = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"];
                var q = this;
                for (var p = 0, m = n.length; p < m; p++) {
                    q[n[p]] = t(q[n[p]], q)
                }
                if (f) {
                    r.addEventListener("mouseover", this.onMouse, true);
                    r.addEventListener("mousedown", this.onMouse, true);
                    r.addEventListener("mouseup", this.onMouse, true)
                }
                r.addEventListener("click", this.onClick, true);
                r.addEventListener("touchstart", this.onTouchStart, false);
                r.addEventListener("touchmove", this.onTouchMove, false);
                r.addEventListener("touchend", this.onTouchEnd, false);
                r.addEventListener("touchcancel", this.onTouchCancel, false);
                if (!Event.prototype.stopImmediatePropagation) {
                    r.removeEventListener = function(u, w, l) {
                        var v = Node.prototype.removeEventListener;
                        if (u === "click") {
                            v.call(r, u, w.hijacked || w, l)
                        } else {
                            v.call(r, u, w, l)
                        }
                    };
                    r.addEventListener = function(v, w, u) {
                        var l = Node.prototype.addEventListener;
                        if (v === "click") {
                            l.call(r, v, w.hijacked || (w.hijacked = function(x) {
                                if (!x.propagationStopped) {
                                    w(x)
                                }
                            }), u)
                        } else {
                            l.call(r, v, w, u)
                        }
                    }
                }
                if (typeof r.onclick === "function") {
                    s = r.onclick;
                    r.addEventListener("click", 
                    function(l) {
                        s(l)
                    },
                    false);
                    r.onclick = null
                }
            }
            var g = navigator.userAgent.indexOf("Windows Phone") >= 0;
            var f = navigator.userAgent.indexOf("Android") > 0 && !g;
            var k = /iP(ad|hone|od)/.test(navigator.userAgent) && !g;
            var i = k && (/OS 4_\d(_\d)?/).test(navigator.userAgent);
            var j = k && (/OS [6-7]_\d/).test(navigator.userAgent);
            var d = navigator.userAgent.indexOf("BB10") > 0;
            h.prototype.needsClick = function(l) {
                switch (l.nodeName.toLowerCase()) {
                case "button":
                case "select":
                case "textarea":
                    if (l.disabled) {
                        return true
                    }
                    break;
                case "input":
                    if ((k && l.type === "file") || l.disabled) {
                        return true
                    }
                    break;
                case "label":
                case "iframe":
                case "video":
                    return true
                }
                return (/\bneedsclick\b/).test(l.className)
            };
            h.prototype.needsFocus = function(l) {
                switch (l.nodeName.toLowerCase()) {
                case "textarea":
                    return true;
                case "select":
                    return ! f;
                case "input":
                    switch (l.type) {
                    case "button":
                    case "checkbox":
                    case "file":
                    case "image":
                    case "radio":
                    case "submit":
                        return false
                    }
                    return ! l.disabled && !l.readOnly;
                default:
                    return (/\bneedsfocus\b/).test(l.className)
                }
            };
            h.prototype.sendClick = function(m, n) {
                var l,
                o;
                if (document.activeElement && document.activeElement !== m) {
                    document.activeElement.blur()
                }
                o = n.changedTouches[0];
                l = document.createEvent("MouseEvents");
                l.initMouseEvent(this.determineEventType(m), true, true, window, 1, o.screenX, o.screenY, o.clientX, o.clientY, false, false, false, false, 0, null);
                l.forwardedTouchEvent = true;
                m.dispatchEvent(l)
            };
            h.prototype.determineEventType = function(l) {
                if (f && l.tagName.toLowerCase() === "select") {
                    return "mousedown"
                }
                return "click"
            };
            h.prototype.focus = function(l) {
                var m;
                if (k && l.setSelectionRange && l.type.indexOf("date") !== 0 && l.type !== "time" && l.type !== "month") {
                    m = l.value.length;
                    l.setSelectionRange(m, m)
                } else {
                    l.focus()
                }
            };
            h.prototype.updateScrollParent = function(m) {
                var n,
                l;
                n = m.fastClickScrollParent;
                if (!n || !n.contains(m)) {
                    l = m;
                    do {
                        if (l.scrollHeight > l.offsetHeight) {
                            n = l;
                            m.fastClickScrollParent = l;
                            break
                        }
                        l = l.parentElement
                    }
                    while (l)
                }
                if (n) {
                    n.fastClickLastScrollTop = n.scrollTop
                }
            };
            h.prototype.getTargetElementFromEventTarget = function(l) {
                if (l.nodeType === Node.TEXT_NODE) {
                    return l.parentNode
                }
                return l
            };
            h.prototype.onTouchStart = function(n) {
                var l,
                o,
                m;
                if (n.targetTouches.length > 1) {
                    return true
                }
                l = this.getTargetElementFromEventTarget(n.target);
                o = n.targetTouches[0];
                if (k) {
                    m = window.getSelection();
                    if (m.rangeCount && !m.isCollapsed) {
                        return true
                    }
                    if (!i) {
                        if (o.identifier && o.identifier === this.lastTouchIdentifier) {
                            n.preventDefault();
                            return false
                        }
                        this.lastTouchIdentifier = o.identifier;
                        this.updateScrollParent(l)
                    }
                }
                this.trackingClick = true;
                this.trackingClickStart = n.timeStamp;
                this.targetElement = l;
                this.touchStartX = o.pageX;
                this.touchStartY = o.pageY;
                if ((n.timeStamp - this.lastClickTime) < this.tapDelay) {
                    n.preventDefault()
                }
                return true
            };
            h.prototype.touchHasMoved = function(l) {
                var n = l.changedTouches[0],
                m = this.touchBoundary;
                if (Math.abs(n.pageX - this.touchStartX) > m || Math.abs(n.pageY - this.touchStartY) > m) {
                    return true
                }
                return false
            };
            h.prototype.onTouchMove = function(l) {
                if (!this.trackingClick) {
                    return true
                }
                if (this.targetElement !== this.getTargetElementFromEventTarget(l.target) || this.touchHasMoved(l)) {
                    this.trackingClick = false;
                    this.targetElement = null
                }
                return true
            };
            h.prototype.findControl = function(l) {
                if (l.control !== undefined) {
                    return l.control
                }
                if (l.htmlFor) {
                    return document.getElementById(l.htmlFor)
                }
                return l.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
            };
            h.prototype.onTouchEnd = function(n) {
                var p,
                o,
                m,
                r,
                q,
                l = this.targetElement;
                if (!this.trackingClick) {
                    return true
                }
                if ((n.timeStamp - this.lastClickTime) < this.tapDelay) {
                    this.cancelNextClick = true;
                    return true
                }
                if ((n.timeStamp - this.trackingClickStart) > this.tapTimeout) {
                    return true
                }
                this.cancelNextClick = false;
                this.lastClickTime = n.timeStamp;
                o = this.trackingClickStart;
                this.trackingClick = false;
                this.trackingClickStart = 0;
                if (j) {
                    q = n.changedTouches[0];
                    l = document.elementFromPoint(q.pageX - window.pageXOffset, q.pageY - window.pageYOffset) || l;
                    l.fastClickScrollParent = this.targetElement.fastClickScrollParent
                }
                m = l.tagName.toLowerCase();
                if (m === "label") {
                    p = this.findControl(l);
                    if (p) {
                        this.focus(l);
                        if (f) {
                            return false
                        }
                        l = p
                    }
                } else {
                    if (this.needsFocus(l)) {
                        if ((n.timeStamp - o) > 100 || (k && window.top !== window && m === "input")) {
                            this.targetElement = null;
                            return false
                        }
                        this.focus(l);
                        this.sendClick(l, n);
                        if (!k || m !== "select") {
                            this.targetElement = null;
                            n.preventDefault()
                        }
                        return false
                    }
                }
                if (k && !i) {
                    r = l.fastClickScrollParent;
                    if (r && r.fastClickLastScrollTop !== r.scrollTop) {
                        return true
                    }
                }
                if (!this.needsClick(l)) {
                    n.preventDefault();
                    this.sendClick(l, n)
                }
                return false
            };
            h.prototype.onTouchCancel = function() {
                this.trackingClick = false;
                this.targetElement = null
            };
            h.prototype.onMouse = function(l) {
                if (!this.targetElement) {
                    return true

                }
                if (l.forwardedTouchEvent) {
                    return true
                }
                if (!l.cancelable) {
                    return true
                }
                if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
                    if (l.stopImmediatePropagation) {
                        l.stopImmediatePropagation()
                    } else {
                        l.propagationStopped = true
                    }
                    l.stopPropagation();
                    l.preventDefault();
                    return false
                }
                return true
            };
            h.prototype.onClick = function(l) {
                var m;
                if (this.trackingClick) {
                    this.targetElement = null;
                    this.trackingClick = false;
                    return true
                }
                if (l.target.type === "submit" && l.detail === 0) {
                    return true
                }
                m = this.onMouse(l);
                if (!m) {
                    this.targetElement = null
                }
                return m
            };
            h.prototype.destroy = function() {
                var l = this.layer;
                if (f) {
                    l.removeEventListener("mouseover", this.onMouse, true);
                    l.removeEventListener("mousedown", this.onMouse, true);
                    l.removeEventListener("mouseup", this.onMouse, true)
                }
                l.removeEventListener("click", this.onClick, true);
                l.removeEventListener("touchstart", this.onTouchStart, false);
                l.removeEventListener("touchmove", this.onTouchMove, false);
                l.removeEventListener("touchend", this.onTouchEnd, false);
                l.removeEventListener("touchcancel", this.onTouchCancel, false)
            };
            h.notNeeded = function(m) {
                var l;
                var p;
                var o;
                var n;
                if (typeof window.ontouchstart === "undefined") {
                    return true
                }
                p = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
                if (p) {
                    if (f) {
                        l = document.querySelector("meta[name=viewport]");
                        if (l) {
                            if (l.content.indexOf("user-scalable=no") !== -1) {
                                return true
                            }
                            if (p > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                                return true
                            }
                        }
                    } else {
                        return true
                    }
                }
                if (d) {
                    o = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);
                    if (o[1] >= 10 && o[2] >= 3) {
                        l = document.querySelector("meta[name=viewport]");
                        if (l) {
                            if (l.content.indexOf("user-scalable=no") !== -1) {
                                return true
                            }
                            if (document.documentElement.scrollWidth <= window.outerWidth) {
                                return true
                            }
                        }
                    }
                }
                if (m.style.msTouchAction === "none" || m.style.touchAction === "manipulation") {
                    return true
                }
                n = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
                if (n >= 27) {
                    l = document.querySelector("meta[name=viewport]");
                    if (l && (l.content.indexOf("user-scalable=no") !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                        return true
                    }
                }
                if (m.style.touchAction === "none" || m.style.touchAction === "manipulation") {
                    return true
                }
                return false
            };
            h.attach = function(m, l) {
                return new h(m, l)
            };
            if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
                define(function() {
                    return h
                })
            } else {
                if (typeof c !== "undefined" && c.exports) {
                    c.exports = h.attach;
                    c.exports.FastClick = h
                } else {
                    window.FastClick = h
                }
            }
        } ())
    },
    {}]
},
{},
[1]);