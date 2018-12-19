System.register(["./app/app", "lodash", "./app/BoomTablePattern"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var app_1, lodash_1, BoomTablePattern_1, GrafanaBoomTableCtrl;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (app_1_1) {
                app_1 = app_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (BoomTablePattern_1_1) {
                BoomTablePattern_1 = BoomTablePattern_1_1;
            }
        ],
        execute: function () {
            app_1.loadPluginCss(app_1.config.list_of_stylesheets);
            GrafanaBoomTableCtrl = (function (_super) {
                __extends(GrafanaBoomTableCtrl, _super);
                function GrafanaBoomTableCtrl($scope, $injector) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.unitFormats = app_1.kbn.getUnitFormats();
                    _this.valueNameOptions = app_1.config.valueNameOptions;
                    lodash_1.default.defaults(_this.panel, app_1.config.panelDefaults);
                    Object.setPrototypeOf(_this.panel.defaultPattern, BoomTablePattern_1.BoomTablePattern.prototype);
                    _this.panel.patterns.map(function (pattern) {
                        Object.setPrototypeOf(pattern, BoomTablePattern_1.BoomTablePattern.prototype);
                        return pattern;
                    });
                    _this.events.on("data-received", _this.onDataReceived.bind(_this));
                    _this.events.on("init-edit-mode", _this.onInitEditMode.bind(_this));
                    return _this;
                }
                GrafanaBoomTableCtrl.prototype.onInitEditMode = function () {
                    var _this = this;
                    lodash_1.default.each(app_1.config.editorTabs, function (editor) {
                        _this.addEditorTab(editor.name, "public/plugins/" + app_1.config.plugin_id + editor.template, editor.position);
                    });
                };
                GrafanaBoomTableCtrl.prototype.onDataReceived = function (data) {
                    this.dataReceived = data;
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.seriesHandler = function (seriesData) {
                    var series = new app_1.TimeSeries({
                        alias: seriesData.target,
                        datapoints: seriesData.datapoints || []
                    });
                    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
                    return series;
                };
                GrafanaBoomTableCtrl.prototype.addPattern = function () {
                    var newPattern = new BoomTablePattern_1.BoomTablePattern({
                        row_col_wrapper: this.panel.row_col_wrapper
                    });
                    this.panel.patterns.push(newPattern);
                    this.panel.activePatternIndex = this.panel.patterns.length - 1;
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.movePattern = function (direction, index) {
                    var tempElement = this.panel.patterns[index];
                    if (direction === "UP") {
                        this.panel.patterns[index] = this.panel.patterns[index - 1];
                        this.panel.patterns[index - 1] = tempElement;
                        this.panel.activePatternIndex = index - 1;
                    }
                    if (direction === "DOWN") {
                        this.panel.patterns[index] = this.panel.patterns[index + 1];
                        this.panel.patterns[index + 1] = tempElement;
                        this.panel.activePatternIndex = index + 1;
                    }
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.removePattern = function (index) {
                    this.panel.patterns.splice(index, 1);
                    this.panel.activePatternIndex = (this.panel.patterns && this.panel.patterns.length > 0) ? (this.panel.patterns.length - 1) : -1;
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.clonePattern = function (index) {
                    var copiedPattern = Object.assign({}, this.panel.patterns[index]);
                    this.panel.patterns.push(copiedPattern);
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.add_time_based_thresholds = function (index) {
                    var new_time_based_threshold = {
                        enabledDays: "Sun,Mon,Tue,Wed,Thu,Fri,Sat",
                        from: "0000",
                        name: "Early morning of everyday",
                        threshold: "70,90",
                        to: "0530"
                    };
                    if (index === 'default') {
                        this.panel.defaultPattern.time_based_thresholds = this.panel.defaultPattern.time_based_thresholds || [];
                        this.panel.defaultPattern.time_based_thresholds.push(new_time_based_threshold);
                    }
                    else {
                        this.panel.patterns[index].time_based_thresholds = this.panel.patterns[index].time_based_thresholds || [];
                        this.panel.patterns[index].time_based_thresholds.push(new_time_based_threshold);
                    }
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.remove_time_based_thresholds = function (patternIndex, index) {
                    if (patternIndex === 'default') {
                        this.panel.defaultPattern.time_based_thresholds.splice(index, 1);
                    }
                    else {
                        this.panel.patterns[patternIndex].time_based_thresholds.splice(index, 1);
                    }
                };
                GrafanaBoomTableCtrl.prototype.computeBgColor = function (thresholds, bgColors, value) {
                    var c = "transparent";
                    if (thresholds && bgColors && typeof value === "number" && thresholds.length + 1 <= bgColors.length) {
                        bgColors = lodash_1.default.dropRight(bgColors, bgColors.length - thresholds.length - 1);
                        if (bgColors[bgColors.length - 1] === "") {
                            bgColors[bgColors.length - 1] = "transparent";
                        }
                        for (var i = thresholds.length; i > 0; i--) {
                            if (value >= thresholds[i - 1]) {
                                return app_1.utils.normalizeColor(bgColors[i]);
                            }
                        }
                        return app_1.utils.normalizeColor(lodash_1.default.first(bgColors));
                    }
                    return c;
                };
                GrafanaBoomTableCtrl.prototype.transformValue = function (thresholds, transform_values, value, displayValue, row_name, col_name) {
                    var t = value;
                    if (thresholds && transform_values && typeof value === "number" && thresholds.length + 1 <= transform_values.length) {
                        transform_values = lodash_1.default.dropRight(transform_values, transform_values.length - thresholds.length - 1);
                        if (transform_values[transform_values.length - 1] === "") {
                            transform_values[transform_values.length - 1] = "_value_";
                        }
                        for (var i = thresholds.length; i > 0; i--) {
                            if (value >= thresholds[i - 1]) {
                                return transform_values[i].replace(new RegExp("_value_", "g"), displayValue).replace(new RegExp("_row_name_", "g"), row_name).replace(new RegExp("_col_name_", "g"), col_name);
                            }
                        }
                        return lodash_1.default.first(transform_values).replace(new RegExp("_value_", "g"), displayValue).replace(new RegExp("_row_name_", "g"), row_name).replace(new RegExp("_col_name_", "g"), col_name);
                    }
                    return t;
                };
                GrafanaBoomTableCtrl.prototype.replaceFontAwesomeIcons = function (value) {
                    if (!value) {
                        return value;
                    }
                    return (value + "")
                        .split(" ")
                        .map(function (a) {
                        if (a.startsWith("_fa-") && a.endsWith("_")) {
                            var icon = a.replace(/\_/g, "").split(",")[0];
                            var color = a.indexOf(",") > -1 ? " style=\"color:" + app_1.utils.normalizeColor(a.replace(/\_/g, "").split(",")[1]) + "\" " : "";
                            var repeatCount = a.split(",").length > 2 ? +(a.replace(/\_/g, "").split(",")[2]) : 1;
                            a = ("<i class=\"fa " + icon + "\" " + color + "></i> ").repeat(repeatCount);
                        }
                        return a;
                    })
                        .join(" ");
                };
                GrafanaBoomTableCtrl.prototype.replaceWithImages = function (value) {
                    if (!value) {
                        return value;
                    }
                    return (value + "")
                        .split(" ")
                        .map(function (a) {
                        if (a.startsWith("_img-") && a.endsWith("_")) {
                            a = a.slice(0, -1);
                            var imgUrl = a.replace("_img-", "").split(",")[0];
                            var imgWidth = a.split(",").length > 1 ? a.replace("_img-", "").split(",")[1] : "20px";
                            var imgHeight = a.split(",").length > 2 ? a.replace("_img-", "").split(",")[2] : "20px";
                            var repeatCount = a.split(",").length > 3 ? +(a.replace("_img-", "").split(",")[3]) : 1;
                            a = ("<img width=\"" + imgWidth + "\" height=\"" + imgHeight + "\" src=\"" + imgUrl + "\"/>").repeat(repeatCount);
                        }
                        return a;
                    })
                        .join(" ");
                };
                GrafanaBoomTableCtrl.prototype.getActualNameWithoutTransformSign = function (value) {
                    return (value + "")
                        .split(" ")
                        .map(function (a) {
                        if (a.startsWith("_fa-") && a.endsWith("_")) {
                            a = "";
                        }
                        if (a.startsWith("_img-") && a.endsWith("_")) {
                            a = "";
                        }
                        return a;
                    })
                        .join(" ");
                };
                GrafanaBoomTableCtrl.prototype.getDecimalsForValue = function (value, _decimals) {
                    if (lodash_1.default.isNumber(+_decimals)) {
                        var o = {
                            decimals: _decimals,
                            scaledDecimals: null
                        };
                        return o;
                    }
                    var delta = value / 2;
                    var dec = -Math.floor(Math.log(delta) / Math.LN10);
                    var magn = Math.pow(10, -dec), norm = delta / magn, size;
                    if (norm < 1.5) {
                        size = 1;
                    }
                    else if (norm < 3) {
                        size = 2;
                        if (norm > 2.25) {
                            size = 2.5;
                            ++dec;
                        }
                    }
                    else if (norm < 7.5) {
                        size = 5;
                    }
                    else {
                        size = 10;
                    }
                    size *= magn;
                    if (Math.floor(value) === value) {
                        dec = 0;
                    }
                    var result = {
                        decimals: Math.max(0, dec),
                        scaledDecimals: Math.max(0, dec) - Math.floor(Math.log(size) / Math.LN10) + 2
                    };
                    return result;
                };
                GrafanaBoomTableCtrl.prototype.setUnitFormat = function (subItem, index) {
                    if (index === -1) {
                        this.panel.defaultPattern.format = subItem.value;
                    }
                    else {
                        this.panel.patterns[index].format = subItem.value;
                    }
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.limitText = function (text, maxlength) {
                    if (text.split('').length > maxlength) {
                        text = text.substring(0, maxlength - 3) + "...";
                    }
                    return text;
                };
                GrafanaBoomTableCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
                    this.scope = scope;
                    this.elem = elem;
                    this.attrs = attrs;
                    this.ctrl = ctrl;
                };
                GrafanaBoomTableCtrl.templateUrl = "partials/module.html";
                return GrafanaBoomTableCtrl;
            }(app_1.MetricsPanelCtrl));
            exports_1("PanelCtrl", GrafanaBoomTableCtrl);
            GrafanaBoomTableCtrl.prototype.render = function () {
                var _this = this;
                if (this.dataReceived) {
                    this.dataComputed = this.dataReceived;
                    this.panel.default_title_for_rows = this.panel.default_title_for_rows || app_1.config.default_title_for_rows;
                    var metricsReceived_1 = app_1.utils.getFields(this.dataComputed, "target");
                    if (metricsReceived_1.length !== lodash_1.default.uniq(metricsReceived_1).length) {
                        var duplicateKeys = lodash_1.default.uniq(metricsReceived_1.filter(function (v) {
                            return metricsReceived_1.filter(function (t) { return t === v; }).length > 1;
                        }));
                        var err = new Error();
                        err.name = "Duplicate data received";
                        err.message = "Duplicate keys : <br/>" + duplicateKeys.join("<br/> ");
                        this.panel.error = err;
                        this.panel.data = undefined;
                    }
                    else {
                        this.panel.error = undefined;
                        this.dataComputed = this.dataReceived.map(this.seriesHandler.bind(this));
                        this.dataComputed = this.dataComputed.map(function (series) {
                            series.current_servertimestamp = new Date();
                            if (series && series.datapoints && series.datapoints.length > 0) {
                                if (lodash_1.default.last(series.datapoints).length === 2) {
                                    series.current_servertimestamp = new Date(lodash_1.default.last(series.datapoints)[1]);
                                }
                            }
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            series.pattern = lodash_1.default.find(_this.panel.patterns.filter(function (p) { return p.disabled !== true; }), function (p) {
                                return series.alias.match(p.pattern);
                            });
                            if (series.pattern === undefined) {
                                series.pattern = _this.panel.defaultPattern || app_1.config.panelDefaults.defaultPattern;
                            }
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            series.decimals = (series.pattern.decimals) || app_1.config.panelDefaults.defaultPattern.decimals;
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            if (series.stats) {
                                series.value = series.stats[series.pattern.valueName || app_1.config.panelDefaults.defaultPattern.valueName];
                                var decimalInfo = _this.getDecimalsForValue(series.value, series.decimals);
                                var formatFunc = app_1.kbn.valueFormats[series.pattern.format || app_1.config.panelDefaults.defaultPattern.format];
                                if (series.value === null) {
                                    series.displayValue = series.pattern.null_value || app_1.config.panelDefaults.defaultPattern.null_value || "Null";
                                }
                                else if (!isNaN(series.value)) {
                                    series.valueFormatted = formatFunc(series.value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                                    series.valueRounded = app_1.kbn.roundValue(series.value, decimalInfo.decimals);
                                    series.displayValue = series.valueFormatted;
                                }
                                else {
                                    series.displayValue = series.pattern.null_value || app_1.config.panelDefaults.defaultPattern.null_value || "Null";
                                }
                            }
                            return series;
                        });
                        this.dataComputed = this.dataComputed.filter(function (series) {
                            if (!series.pattern.filter) {
                                series.pattern.filter = {};
                                series.pattern.filter.value_below = "";
                                series.pattern.filter.value_above = "";
                            }
                            if (series.pattern && series.pattern.filter && (series.pattern.filter.value_below !== "" || series.pattern.filter.value_above !== "")) {
                                if (series.pattern.filter.value_below !== "" && series.value < +(series.pattern.filter.value_below)) {
                                    return false;
                                }
                                if (series.pattern.filter.value_above !== "" && series.value > +(series.pattern.filter.value_above)) {
                                    return false;
                                }
                                return true;
                            }
                            else {
                                return true;
                            }
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            series.row_name = series.alias.split(series.pattern.delimiter || ".").reduce(function (r, it, i) {
                                return r.replace(new RegExp(_this.panel.row_col_wrapper + i + _this.panel.row_col_wrapper, "g"), it);
                            }, series.pattern.row_name.replace(new RegExp(_this.panel.row_col_wrapper + "series" + _this.panel.row_col_wrapper, "g"), series.alias) ||
                                app_1.config.panelDefaults.defaultPattern.row_name.replace(new RegExp(_this.panel.row_col_wrapper + "series" + _this.panel.row_col_wrapper, "g"), series.alias));
                            if (series.alias.split(series.pattern.delimiter || ".").length === 1) {
                                series.row_name = series.alias;
                            }
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            series.col_name = series.alias.split(series.pattern.delimiter || ".").reduce(function (r, it, i) {
                                return r.replace(new RegExp(_this.panel.row_col_wrapper + i + _this.panel.row_col_wrapper, "g"), it);
                            }, series.pattern.col_name || app_1.config.panelDefaults.defaultPattern.col_name);
                            if (series.alias.split(series.pattern.delimiter || ".").length === 1 || series.row_name === series.alias) {
                                series.col_name = series.pattern.col_name || "Value";
                            }
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            series.key_name = series.row_name + "#" + series.col_name;
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            series.thresholds = (series.pattern.thresholds || app_1.config.panelDefaults.defaultPattern.thresholds).split(",").map(function (d) { return +d; });
                            if (series.pattern.enable_time_based_thresholds) {
                                var metricrecivedTimeStamp_1 = series.current_servertimestamp || new Date();
                                var metricrecivedTimeStamp_innumber_1 = metricrecivedTimeStamp_1.getHours() * 100 + metricrecivedTimeStamp_1.getMinutes();
                                var weekdays_1 = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
                                lodash_1.default.each(series.pattern.time_based_thresholds, function (tbtx) {
                                    if (tbtx && tbtx.from && tbtx.to && tbtx.enabledDays &&
                                        (metricrecivedTimeStamp_innumber_1 >= +(tbtx.from)) &&
                                        (metricrecivedTimeStamp_innumber_1 <= +(tbtx.to)) &&
                                        (tbtx.enabledDays.toLowerCase().indexOf(weekdays_1[metricrecivedTimeStamp_1.getDay()]) > -1) &&
                                        tbtx.threshold) {
                                        series.thresholds = (tbtx.threshold + "").split(",").map(function (d) { return +d; });
                                    }
                                });
                            }
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            series.enable_bgColor = series.pattern.enable_bgColor;
                            series.bgColors = (series.pattern.bgColors || app_1.config.panelDefaults.defaultPattern.bgColors).split("|");
                            series.bgColor = series.enable_bgColor === true ? _this.computeBgColor(series.thresholds, series.bgColors, series.value) : "transparent";
                            if (series.displayValue === (series.pattern.null_value || app_1.config.panelDefaults.defaultPattern.null_value || "Null")) {
                                series.bgColor = series.pattern.null_color || app_1.config.panelDefaults.defaultPattern.null_color;
                            }
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            series.enable_bgColor_overrides = series.pattern.enable_bgColor_overrides;
                            series.bgColors_overrides = series.pattern.bgColors_overrides || "";
                            if (series.enable_bgColor_overrides && series.bgColors_overrides !== "") {
                                var _bgColors_overrides = series.bgColors_overrides.split("|").filter(function (con) { return con.indexOf("->"); }).map(function (con) { return con.split("->"); }).filter(function (con) { return +(con[0]) === series.value; }).map(function (con) { return con[1]; });
                                if (_bgColors_overrides.length > 0 && _bgColors_overrides[0] !== "") {
                                    series.bgColor = app_1.utils.normalizeColor(("" + _bgColors_overrides[0]).trim());
                                }
                            }
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            series.enable_transform = series.pattern.enable_transform;
                            series.transform_values = (series.pattern.transform_values || app_1.config.panelDefaults.defaultPattern.transform_values).split("|");
                            series.displayValue = series.enable_transform === true ? _this.transformValue(series.thresholds, series.transform_values, series.value, series.displayValue, series.row_name, series.col_name) : series.displayValue;
                            if (series.displayValue === (series.pattern.null_value || app_1.config.panelDefaults.defaultPattern.null_value || "Null")) {
                                series.displayValue = series.pattern.null_value || app_1.config.panelDefaults.defaultPattern.null_value;
                            }
                            else if (isNaN(series.value)) {
                                series.displayValue = series.pattern.null_value || app_1.config.panelDefaults.defaultPattern.null_value;
                            }
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            series.enable_transform_overrides = series.pattern.enable_transform_overrides;
                            series.transform_values_overrides = series.pattern.transform_values_overrides || "";
                            if (series.enable_transform_overrides && series.transform_values_overrides !== "") {
                                var _transform_values_overrides = series.transform_values_overrides.split("|").filter(function (con) { return con.indexOf("->"); }).map(function (con) { return con.split("->"); }).filter(function (con) { return +(con[0]) === series.value; }).map(function (con) { return con[1]; });
                                if (_transform_values_overrides.length > 0 && _transform_values_overrides[0] !== "") {
                                    series.displayValue = ("" + _transform_values_overrides[0]).trim().replace(new RegExp("_value_", "g"), series.displayValue).replace(new RegExp("_row_name_", "g"), series.row_name).replace(new RegExp("_col_name_", "g"), series.col_name);
                                }
                            }
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            series.actual_displayvalue = series.displayValue;
                            series.actual_row_name = series.row_name;
                            series.actual_col_name = series.col_name;
                            if (series.displayValue && series.displayValue.indexOf("_fa-") > -1) {
                                series.displayValue = _this.replaceFontAwesomeIcons(series.displayValue);
                            }
                            if (series.row_name && series.row_name.indexOf("_fa-") > -1) {
                                series.row_name = _this.replaceFontAwesomeIcons(series.row_name);
                            }
                            if (series.col_name && series.col_name.indexOf("_fa-") > -1) {
                                series.col_name = _this.replaceFontAwesomeIcons(series.col_name);
                            }
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            if (series.displayValue && series.displayValue.indexOf("_img-") > -1) {
                                series.displayValue = _this.replaceWithImages(series.displayValue);
                            }
                            if (series.row_name && series.row_name.indexOf("_img-") > -1) {
                                series.row_name = _this.replaceWithImages(series.row_name);
                            }
                            if (series.col_name && series.col_name.indexOf("_img-") > -1) {
                                series.col_name = _this.replaceWithImages(series.col_name);
                            }
                            return series;
                        });
                        this.dataComputed = this.dataComputed.map(function (series) {
                            if (series.pattern.enable_clickable_cells) {
                                var targetLink = series.pattern.clickable_cells_link || "#";
                                targetLink = targetLink.replace(new RegExp("_row_name_", "g"), _this.getActualNameWithoutTransformSign(series.actual_row_name).trim());
                                targetLink = targetLink.replace(new RegExp("_col_name_", "g"), _this.getActualNameWithoutTransformSign(series.actual_col_name).trim());
                                targetLink = targetLink.replace(new RegExp("_value_", "g"), _this.getActualNameWithoutTransformSign(series.value).trim());
                                series.displayValue = "<a href=\"" + targetLink + "\" target=\"_blank\">" + series.displayValue + "</a>";
                            }
                            return series;
                        });
                        var rows_found = app_1.utils.getFields(this.dataComputed, "row_name");
                        var cols_found_1 = app_1.utils.getFields(this.dataComputed, "col_name");
                        var keys_found_1 = app_1.utils.getFields(this.dataComputed, "key_name");
                        var is_unique_keys = (keys_found_1.length === lodash_1.default.uniq(keys_found_1).length);
                        if (is_unique_keys) {
                            this.panel.error = undefined;
                            var output_1 = [];
                            lodash_1.default.each(lodash_1.default.uniq(rows_found), function (row_name) {
                                var o = {};
                                o.row = row_name;
                                o.cols = [];
                                lodash_1.default.each(lodash_1.default.uniq(cols_found_1), function (col_name) {
                                    var matched_value = (lodash_1.default.find(_this.dataComputed, function (e) {
                                        return e.row_name === row_name && e.col_name === col_name;
                                    }));
                                    if (!matched_value) {
                                        matched_value = {
                                            displayValue: "N/A",
                                            value: NaN
                                        };
                                    }
                                    o.cols.push({
                                        "actual_col_name": matched_value.actual_col_name,
                                        "actual_row_name": matched_value.actual_row_name,
                                        "bgColor": matched_value.bgColor || "transparent",
                                        "displayValue": matched_value.displayValue || matched_value.value,
                                        "name": col_name,
                                        "value": matched_value.value
                                    });
                                });
                                output_1.push(o);
                            });
                            var boomtable_output_body_headers = this.elem.find("#boomtable_output_body_headers");
                            var boomtable_output_body_headers_output_1 = "<br/>";
                            if (this.panel.hide_headers !== true) {
                                boomtable_output_body_headers_output_1 += "<tr>";
                                if (this.panel.hide_first_column !== true) {
                                    boomtable_output_body_headers_output_1 += "<th style=\"padding:4px;text-align:center\">" + this.panel.default_title_for_rows + "</th>";
                                }
                                lodash_1.default.each(lodash_1.default.uniq(cols_found_1), function (c) {
                                    boomtable_output_body_headers_output_1 += "<th style=\"padding:4px;text-align:center\">" + c + "</th>";
                                });
                                boomtable_output_body_headers_output_1 += "</tr>";
                            }
                            boomtable_output_body_headers.html(boomtable_output_body_headers_output_1);
                            var boomtable_output_body = this.elem.find('#boomtable_output_body');
                            var boomtable_output_body_output_1 = "";
                            lodash_1.default.each(output_1, function (o) {
                                boomtable_output_body_output_1 += "<tr>";
                                if (_this.panel.hide_first_column !== true) {
                                    boomtable_output_body_output_1 += "<td style=\"padding:4px;\">" + o.row + "</td>";
                                }
                                lodash_1.default.each(o.cols, function (c) {
                                    boomtable_output_body_output_1 += "<td\n              style=\"padding:4px;background-color:" + c.bgColor + "\"\n              title=\"" + ("Row Name : " + _this.getActualNameWithoutTransformSign(c.actual_row_name) + "\nCol Name : " + _this.getActualNameWithoutTransformSign(c.actual_col_name) + "\nValue : " + c.value) + "\"\n            >" + c.displayValue + "</td>";
                                });
                                boomtable_output_body_output_1 += "</tr>";
                            });
                            boomtable_output_body.html(boomtable_output_body_output_1);
                        }
                        else {
                            var duplicateKeyValues = lodash_1.default.uniq(keys_found_1.filter(function (v) {
                                return keys_found_1.filter(function (t) { return t === v; }).length > 1;
                            }));
                            var err_duplicateKeys = new Error();
                            err_duplicateKeys.name = "Duplicate keys found";
                            err_duplicateKeys.message = "Duplicate key values : <br/>" + duplicateKeyValues.join("<br/> ");
                            this.panel.error = err_duplicateKeys;
                        }
                        var boomtable_output_body_debug = this.elem.find('#boomtable_output_body_debug');
                        var boomtable_output_body_debug_output_1 = "";
                        lodash_1.default.each(this.dataComputed, function (d) {
                            boomtable_output_body_debug_output_1 += "\n        <tr>\n          <td style=\"padding:4px;\" width=\"40%\">" + d.alias + "</td>\n          <td style=\"padding:4px;\">" + (d.pattern.pattern || "Default") + "</td>\n          <td style=\"padding:4px;background-color:" + d.bgColor + "\">" + d.displayValue + "</td>\n          <td style=\"padding:4px;\">" + d.row_name + "</td>\n          <td style=\"padding:4px;\">" + d.col_name + "</td>\n          <td style=\"padding:4px;\">" + d.thresholds + "</td>\n        </tr>\n        ";
                        });
                        boomtable_output_body_debug.html(boomtable_output_body_debug_output_1);
                    }
                    var rootElem = this.elem.find('.table-panel-scroll');
                    var maxheightofpanel = this.panel.debug_mode ? this.ctrl.height - 71 : this.ctrl.height - 31;
                    rootElem.css({ 'max-height': maxheightofpanel + "px" });
                }
            };
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFVQSxtQkFBYSxDQUFDLFlBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztnQkFFUCx3Q0FBZ0I7Z0JBU2pELDhCQUFZLE1BQU0sRUFBRSxTQUFTO29CQUE3QixZQUNFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0FTekI7b0JBakJNLGlCQUFXLEdBQVEsU0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN4QyxzQkFBZ0IsR0FBVyxZQUFNLENBQUMsZ0JBQWdCLENBQUM7b0JBUXhELGdCQUFDLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsWUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUM3QyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLG1DQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUM3RSxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO3dCQUM3QixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxtQ0FBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDM0QsT0FBTyxPQUFPLENBQUM7b0JBQ2pCLENBQUMsQ0FBQyxDQUFDO29CQUNILEtBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNoRSxLQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsQ0FBQyxDQUFDOztnQkFDbkUsQ0FBQztnQkFDTSw2Q0FBYyxHQUFyQjtvQkFBQSxp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Q0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQzs2QkFBRTs0QkFDakosSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dDQUFFLE1BQU0sQ0FBQyxRQUFRLEdBQUcsS0FBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzs2QkFBRTs0QkFDakksSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dDQUFFLE1BQU0sQ0FBQyxRQUFRLEdBQUcsS0FBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzs2QkFBRTs0QkFDakksT0FBTyxNQUFNLENBQUM7d0JBQ2hCLENBQUMsQ0FBQyxDQUFDO3dCQUVILElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBQSxNQUFNOzRCQUM5QyxJQUFJLE1BQU0sQ0FBQyxZQUFZLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0NBQUUsTUFBTSxDQUFDLFlBQVksR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDOzZCQUFFOzRCQUM1SSxJQUFJLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0NBQUUsTUFBTSxDQUFDLFFBQVEsR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzZCQUFFOzRCQUM1SCxJQUFJLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxD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TUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFDN0YsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2lCQUN6RDtZQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAga2JuLFxyXG4gIGxvYWRQbHVnaW5Dc3MsXHJcbiAgTWV0cmljc1BhbmVsQ3RybCxcclxuICBUaW1lU2VyaWVzLFxyXG4gIHV0aWxzLFxyXG4gIGNvbmZpZ1xyXG59IGZyb20gXCIuL2FwcC9hcHBcIjtcclxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xyXG5pbXBvcnQgeyBCb29tVGFibGVQYXR0ZXJuIH0gZnJvbSBcIi4vYXBwL0Jvb21UYWJsZVBhdHRlcm5cIjtcclxubG9hZFBsdWdpbkNzcyhjb25maWcubGlzdF9vZl9zdHlsZXNoZWV0cyk7XHJcblxyXG5jbGFzcyBHcmFmYW5hQm9vbVRhYmxlQ3RybCBleHRlbmRzIE1ldHJpY3NQYW5lbEN0cmwge1xyXG4gIHB1YmxpYyBzdGF0aWMgdGVtcGxhdGVVcmwgPSBcInBhcnRpYWxzL21vZHVsZS5odG1sXCI7XHJcbiAgcHVibGljIHVuaXRGb3JtYXRzOiBhbnkgPSBrYm4uZ2V0VW5pdEZvcm1hdHMoKTtcclxuICBwdWJsaWMgdmFsdWVOYW1lT3B0aW9uczogT2JqZWN0ID0gY29uZmlnLnZhbHVlTmFtZU9wdGlvbnM7XHJcbiAgcHVibGljIGRhdGFSZWNlaXZlZDogYW55O1xyXG4gIHB1YmxpYyBkYXRhQ29tcHV0ZWQ6IGFueTtcclxuICBwdWJsaWMgY3RybDogYW55O1xyXG4gIHB1YmxpYyBlbGVtOiBhbnk7XHJcbiAgcHVibGljIGF0dHJzOiBhbnk7XHJcbiAgY29uc3RydWN0b3IoJHNjb3BlLCAkaW5qZWN0b3IpIHtcclxuICAgIHN1cGVyKCRzY29wZSwgJGluamVjdG9yKTtcclxuICAgIF8uZGVmYXVsdHModGhpcy5wYW5lbCwgY29uZmlnLnBhbmVsRGVmYXVsdHMpO1xyXG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMucGFuZWwuZGVmYXVsdFBhdHRlcm4sIEJvb21UYWJsZVBhdHRlcm4ucHJvdG90eXBlKTtcclxuICAgIHRoaXMucGFuZWwucGF0dGVybnMubWFwKHBhdHRlcm4gPT4ge1xyXG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YocGF0dGVybiwgQm9vbVRhYmxlUGF0dGVybi5wcm90b3R5cGUpO1xyXG4gICAgICByZXR1cm4gcGF0dGVybjtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5ldmVudHMub24oXCJkYXRhLXJlY2VpdmVkXCIsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmV2ZW50cy5vbihcImluaXQtZWRpdC1tb2RlXCIsIHRoaXMub25Jbml0RWRpdE1vZGUuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBvbkluaXRFZGl0TW9kZSgpIHtcclxuICAgIF8uZWFjaChjb25maWcuZWRpdG9yVGFicywgZWRpdG9yID0+IHtcclxuICAgICAgdGhpcy5hZGRFZGl0b3JUYWIoZWRpdG9yLm5hbWUsIFwicHVibGljL3BsdWdpbnMvXCIgKyBjb25maWcucGx1Z2luX2lkICsgZWRpdG9yLnRlbXBsYXRlLCBlZGl0b3IucG9zaXRpb24pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBvbkRhdGFSZWNlaXZlZChkYXRhKSB7XHJcbiAgICB0aGlzLmRhdGFSZWNlaXZlZCA9IGRhdGE7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgc2VyaWVzSGFuZGxlcihzZXJpZXNEYXRhKSB7XHJcbiAgICBsZXQgc2VyaWVzID0gbmV3IFRpbWVTZXJpZXMoe1xyXG4gICAgICBhbGlhczogc2VyaWVzRGF0YS50YXJnZXQsXHJcbiAgICAgIGRhdGFwb2ludHM6IHNlcmllc0RhdGEuZGF0YXBvaW50cyB8fCBbXVxyXG4gICAgfSk7XHJcbiAgICBzZXJpZXMuZmxvdHBhaXJzID0gc2VyaWVzLmdldEZsb3RQYWlycyh0aGlzLnBhbmVsLm51bGxQb2ludE1vZGUpO1xyXG4gICAgcmV0dXJuIHNlcmllcztcclxuICB9XHJcbiAgcHVibGljIGFkZFBhdHRlcm4oKSB7XHJcbiAgICBsZXQgbmV3UGF0dGVybiA9IG5ldyBCb29tVGFibGVQYXR0ZXJuKHtcclxuICAgICAgcm93X2NvbF93cmFwcGVyOiB0aGlzLnBhbmVsLnJvd19jb2xfd3JhcHBlclxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLnB1c2gobmV3UGF0dGVybik7XHJcbiAgICB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9IHRoaXMucGFuZWwucGF0dGVybnMubGVuZ3RoIC0gMTtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyBtb3ZlUGF0dGVybihkaXJlY3Rpb24sIGluZGV4KSB7XHJcbiAgICBsZXQgdGVtcEVsZW1lbnQgPSB0aGlzLnBhbmVsLnBhdHRlcm5zW2luZGV4XTtcclxuICAgIGlmIChkaXJlY3Rpb24gPT09IFwiVVBcIikge1xyXG4gICAgICB0aGlzLnBhbmVsLnBhdHRlcm5zW2luZGV4XSA9IHRoaXMucGFuZWwucGF0dGVybnNbaW5kZXggLSAxXTtcclxuICAgICAgdGhpcy5wYW5lbC5wYXR0ZXJuc1tpbmRleCAtIDFdID0gdGVtcEVsZW1lbnQ7XHJcbiAgICAgIHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID0gaW5kZXggLSAxO1xyXG4gICAgfVxyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJET1dOXCIpIHtcclxuICAgICAgdGhpcy5wYW5lbC5wYXR0ZXJuc1tpbmRleF0gPSB0aGlzLnBhbmVsLnBhdHRlcm5zW2luZGV4ICsgMV07XHJcbiAgICAgIHRoaXMucGFuZWwucGF0dGVybnNbaW5kZXggKyAxXSA9IHRlbXBFbGVtZW50O1xyXG4gICAgICB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9IGluZGV4ICsgMTtcclxuICAgIH1cclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyByZW1vdmVQYXR0ZXJuKGluZGV4KSB7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9ICh0aGlzLnBhbmVsLnBhdHRlcm5zICYmIHRoaXMucGFuZWwucGF0dGVybnMubGVuZ3RoID4gMCkgPyAodGhpcy5wYW5lbC5wYXR0ZXJucy5sZW5ndGggLSAxKSA6IC0xO1xyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgcHVibGljIGNsb25lUGF0dGVybihpbmRleCkge1xyXG4gICAgbGV0IGNvcGllZFBhdHRlcm4gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnBhbmVsLnBhdHRlcm5zW2luZGV4XSk7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLnB1c2goY29waWVkUGF0dGVybik7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgYWRkX3RpbWVfYmFzZWRfdGhyZXNob2xkcyhpbmRleCkge1xyXG4gICAgbGV0IG5ld190aW1lX2Jhc2VkX3RocmVzaG9sZCA9IHtcclxuICAgICAgZW5hYmxlZERheXM6IFwiU3VuLE1vbixUdWUsV2VkLFRodSxGcmksU2F0XCIsXHJcbiAgICAgIGZyb206IFwiMDAwMFwiLFxyXG4gICAgICBuYW1lOiBcIkVhcmx5IG1vcm5pbmcgb2YgZXZlcnlkYXlcIixcclxuICAgICAgdGhyZXNob2xkOiBcIjcwLDkwXCIsXHJcbiAgICAgIHRvOiBcIjA1MzBcIlxyXG4gICAgfTtcclxuICAgIGlmIChpbmRleCA9PT0gJ2RlZmF1bHQnKSB7XHJcbiAgICAgIHRoaXMucGFuZWwuZGVmYXVsdFBhdHRlcm4udGltZV9iYXNlZF90aHJlc2hvbGRzID0gdGhpcy5wYW5lbC5kZWZhdWx0UGF0dGVybi50aW1lX2Jhc2VkX3RocmVzaG9sZHMgfHwgW107XHJcbiAgICAgIHRoaXMucGFuZWwuZGVmYXVsdFBhdHRlcm4udGltZV9iYXNlZF90aHJlc2hvbGRzLnB1c2gobmV3X3RpbWVfYmFzZWRfdGhyZXNob2xkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucGFuZWwucGF0dGVybnNbaW5kZXhdLnRpbWVfYmFzZWRfdGhyZXNob2xkcyA9IHRoaXMucGFuZWwucGF0dGVybnNbaW5kZXhdLnRpbWVfYmFzZWRfdGhyZXNob2xkcyB8fCBbXTtcclxuICAgICAgdGhpcy5wYW5lbC5wYXR0ZXJuc1tpbmRleF0udGltZV9iYXNlZF90aHJlc2hvbGRzLnB1c2gobmV3X3RpbWVfYmFzZWRfdGhyZXNob2xkKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyByZW1vdmVfdGltZV9iYXNlZF90aHJlc2hvbGRzKHBhdHRlcm5JbmRleCwgaW5kZXgpIHtcclxuICAgIGlmIChwYXR0ZXJuSW5kZXggPT09ICdkZWZhdWx0Jykge1xyXG4gICAgICB0aGlzLnBhbmVsLmRlZmF1bHRQYXR0ZXJuLnRpbWVfYmFzZWRfdGhyZXNob2xkcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5wYW5lbC5wYXR0ZXJuc1twYXR0ZXJuSW5kZXhdLnRpbWVfYmFzZWRfdGhyZXNob2xkcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG4gIH1cclxuICBwdWJsaWMgY29tcHV0ZUJnQ29sb3IodGhyZXNob2xkcywgYmdDb2xvcnMsIHZhbHVlKSB7XHJcbiAgICBsZXQgYyA9IFwidHJhbnNwYXJlbnRcIjtcclxuICAgIGlmICh0aHJlc2hvbGRzICYmIGJnQ29sb3JzICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiB0aHJlc2hvbGRzLmxlbmd0aCArIDEgPD0gYmdDb2xvcnMubGVuZ3RoKSB7XHJcbiAgICAgIGJnQ29sb3JzID0gXy5kcm9wUmlnaHQoYmdDb2xvcnMsIGJnQ29sb3JzLmxlbmd0aCAtIHRocmVzaG9sZHMubGVuZ3RoIC0gMSk7XHJcbiAgICAgIGlmIChiZ0NvbG9yc1tiZ0NvbG9ycy5sZW5ndGggLSAxXSA9PT0gXCJcIikge1xyXG4gICAgICAgIGJnQ29sb3JzW2JnQ29sb3JzLmxlbmd0aCAtIDFdID0gXCJ0cmFuc3BhcmVudFwiO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAobGV0IGkgPSB0aHJlc2hvbGRzLmxlbmd0aDsgaSA+IDA7IGktLSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSA+PSB0aHJlc2hvbGRzW2kgLSAxXSkge1xyXG4gICAgICAgICAgcmV0dXJuIHV0aWxzLm5vcm1hbGl6ZUNvbG9yKGJnQ29sb3JzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHV0aWxzLm5vcm1hbGl6ZUNvbG9yKF8uZmlyc3QoYmdDb2xvcnMpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjO1xyXG4gIH1cclxuICBwdWJsaWMgdHJhbnNmb3JtVmFsdWUodGhyZXNob2xkcywgdHJhbnNmb3JtX3ZhbHVlcywgdmFsdWUsIGRpc3BsYXlWYWx1ZSwgcm93X25hbWUsIGNvbF9uYW1lKSB7XHJcbiAgICBsZXQgdCA9IHZhbHVlO1xyXG4gICAgaWYgKHRocmVzaG9sZHMgJiYgdHJhbnNmb3JtX3ZhbHVlcyAmJiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgJiYgdGhyZXNob2xkcy5sZW5ndGggKyAxIDw9IHRyYW5zZm9ybV92YWx1ZXMubGVuZ3RoKSB7XHJcbiAgICAgIHRyYW5zZm9ybV92YWx1ZXMgPSBfLmRyb3BSaWdodCh0cmFuc2Zvcm1fdmFsdWVzLCB0cmFuc2Zvcm1fdmFsdWVzLmxlbmd0aCAtIHRocmVzaG9sZHMubGVuZ3RoIC0gMSk7XHJcbiAgICAgIGlmICh0cmFuc2Zvcm1fdmFsdWVzW3RyYW5zZm9ybV92YWx1ZXMubGVuZ3RoIC0gMV0gPT09IFwiXCIpIHtcclxuICAgICAgICB0cmFuc2Zvcm1fdmFsdWVzW3RyYW5zZm9ybV92YWx1ZXMubGVuZ3RoIC0gMV0gPSBcIl92YWx1ZV9cIjtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGxldCBpID0gdGhyZXNob2xkcy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgICBpZiAodmFsdWUgPj0gdGhyZXNob2xkc1tpIC0gMV0pIHtcclxuICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1fdmFsdWVzW2ldLnJlcGxhY2UobmV3IFJlZ0V4cChcIl92YWx1ZV9cIiwgXCJnXCIpLCBkaXNwbGF5VmFsdWUpLnJlcGxhY2UobmV3IFJlZ0V4cChcIl9yb3dfbmFtZV9cIiwgXCJnXCIpLCByb3dfbmFtZSkucmVwbGFjZShuZXcgUmVnRXhwKFwiX2NvbF9uYW1lX1wiLCBcImdcIiksIGNvbF9uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIF8uZmlyc3QodHJhbnNmb3JtX3ZhbHVlcykucmVwbGFjZShuZXcgUmVnRXhwKFwiX3ZhbHVlX1wiLCBcImdcIiksIGRpc3BsYXlWYWx1ZSkucmVwbGFjZShuZXcgUmVnRXhwKFwiX3Jvd19uYW1lX1wiLCBcImdcIiksIHJvd19uYW1lKS5yZXBsYWNlKG5ldyBSZWdFeHAoXCJfY29sX25hbWVfXCIsIFwiZ1wiKSwgY29sX25hbWUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbiAgfVxyXG4gIHB1YmxpYyByZXBsYWNlRm9udEF3ZXNvbWVJY29ucyh2YWx1ZSkge1xyXG4gICAgaWYgKCF2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH1cclxuICAgIHJldHVybiAodmFsdWUgKyBcIlwiKVxyXG4gICAgICAuc3BsaXQoXCIgXCIpXHJcbiAgICAgIC5tYXAoYSA9PiB7XHJcbiAgICAgICAgaWYgKGEuc3RhcnRzV2l0aChcIl9mYS1cIikgJiYgYS5lbmRzV2l0aChcIl9cIikpIHtcclxuICAgICAgICAgIGxldCBpY29uID0gYS5yZXBsYWNlKC9cXF8vZywgXCJcIikuc3BsaXQoXCIsXCIpWzBdO1xyXG4gICAgICAgICAgbGV0IGNvbG9yID0gYS5pbmRleE9mKFwiLFwiKSA+IC0xID8gYCBzdHlsZT1cImNvbG9yOiR7dXRpbHMubm9ybWFsaXplQ29sb3IoYS5yZXBsYWNlKC9cXF8vZywgXCJcIikuc3BsaXQoXCIsXCIpWzFdKX1cIiBgIDogXCJcIjtcclxuICAgICAgICAgIGxldCByZXBlYXRDb3VudCA9IGEuc3BsaXQoXCIsXCIpLmxlbmd0aCA+IDIgPyArKGEucmVwbGFjZSgvXFxfL2csIFwiXCIpLnNwbGl0KFwiLFwiKVsyXSkgOiAxO1xyXG4gICAgICAgICAgYSA9IGA8aSBjbGFzcz1cImZhICR7aWNvbn1cIiAke2NvbG9yfT48L2k+IGAucmVwZWF0KHJlcGVhdENvdW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5qb2luKFwiIFwiKTtcclxuICB9XHJcbiAgcHVibGljIHJlcGxhY2VXaXRoSW1hZ2VzKHZhbHVlKSB7XHJcbiAgICBpZiAoIXZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfVxyXG4gICAgcmV0dXJuICh2YWx1ZSArIFwiXCIpXHJcbiAgICAgIC5zcGxpdChcIiBcIilcclxuICAgICAgLm1hcChhID0+IHtcclxuICAgICAgICBpZiAoYS5zdGFydHNXaXRoKFwiX2ltZy1cIikgJiYgYS5lbmRzV2l0aChcIl9cIikpIHtcclxuICAgICAgICAgIGEgPSBhLnNsaWNlKDAsIC0xKTtcclxuICAgICAgICAgIGxldCBpbWdVcmwgPSBhLnJlcGxhY2UoXCJfaW1nLVwiLCBcIlwiKS5zcGxpdChcIixcIilbMF07XHJcbiAgICAgICAgICBsZXQgaW1nV2lkdGggPSBhLnNwbGl0KFwiLFwiKS5sZW5ndGggPiAxID8gYS5yZXBsYWNlKFwiX2ltZy1cIiwgXCJcIikuc3BsaXQoXCIsXCIpWzFdIDogXCIyMHB4XCI7XHJcbiAgICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gYS5zcGxpdChcIixcIikubGVuZ3RoID4gMiA/IGEucmVwbGFjZShcIl9pbWctXCIsIFwiXCIpLnNwbGl0KFwiLFwiKVsyXSA6IFwiMjBweFwiO1xyXG4gICAgICAgICAgbGV0IHJlcGVhdENvdW50ID0gYS5zcGxpdChcIixcIikubGVuZ3RoID4gMyA/ICsoYS5yZXBsYWNlKFwiX2ltZy1cIiwgXCJcIikuc3BsaXQoXCIsXCIpWzNdKSA6IDE7XHJcbiAgICAgICAgICBhID0gYDxpbWcgd2lkdGg9XCIke2ltZ1dpZHRofVwiIGhlaWdodD1cIiR7aW1nSGVpZ2h0fVwiIHNyYz1cIiR7aW1nVXJsfVwiLz5gLnJlcGVhdChyZXBlYXRDb3VudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgICB9KVxyXG4gICAgICAuam9pbihcIiBcIik7XHJcbiAgfVxyXG4gIHB1YmxpYyBnZXRBY3R1YWxOYW1lV2l0aG91dFRyYW5zZm9ybVNpZ24odmFsdWUpIHtcclxuICAgIHJldHVybiAodmFsdWUgKyBcIlwiKVxyXG4gICAgICAuc3BsaXQoXCIgXCIpXHJcbiAgICAgIC5tYXAoYSA9PiB7XHJcbiAgICAgICAgaWYgKGEuc3RhcnRzV2l0aChcIl9mYS1cIikgJiYgYS5lbmRzV2l0aChcIl9cIikpIHtcclxuICAgICAgICAgIGEgPSBgYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGEuc3RhcnRzV2l0aChcIl9pbWctXCIpICYmIGEuZW5kc1dpdGgoXCJfXCIpKSB7XHJcbiAgICAgICAgICBhID0gYGA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgICB9KVxyXG4gICAgICAuam9pbihcIiBcIik7XHJcbiAgfVxyXG4gIHB1YmxpYyBnZXREZWNpbWFsc0ZvclZhbHVlKHZhbHVlLCBfZGVjaW1hbHMpIHtcclxuICAgIGlmIChfLmlzTnVtYmVyKCtfZGVjaW1hbHMpKSB7XHJcbiAgICAgIGxldCBvOiBPYmplY3QgPSB7XHJcbiAgICAgICAgZGVjaW1hbHM6IF9kZWNpbWFscyxcclxuICAgICAgICBzY2FsZWREZWNpbWFsczogbnVsbFxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gbztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZGVsdGEgPSB2YWx1ZSAvIDI7XHJcbiAgICBsZXQgZGVjID0gLU1hdGguZmxvb3IoTWF0aC5sb2coZGVsdGEpIC8gTWF0aC5MTjEwKTtcclxuXHJcbiAgICBsZXQgbWFnbiA9IE1hdGgucG93KDEwLCAtZGVjKSxcclxuICAgICAgbm9ybSA9IGRlbHRhIC8gbWFnbiwgLy8gbm9ybSBpcyBiZXR3ZWVuIDEuMCBhbmQgMTAuMFxyXG4gICAgICBzaXplO1xyXG5cclxuICAgIGlmIChub3JtIDwgMS41KSB7XHJcbiAgICAgIHNpemUgPSAxO1xyXG4gICAgfSBlbHNlIGlmIChub3JtIDwgMykge1xyXG4gICAgICBzaXplID0gMjtcclxuICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciAyLjUsIHJlcXVpcmVzIGFuIGV4dHJhIGRlY2ltYWxcclxuICAgICAgaWYgKG5vcm0gPiAyLjI1KSB7XHJcbiAgICAgICAgc2l6ZSA9IDIuNTtcclxuICAgICAgICArK2RlYztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChub3JtIDwgNy41KSB7XHJcbiAgICAgIHNpemUgPSA1O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2l6ZSA9IDEwO1xyXG4gICAgfVxyXG5cclxuICAgIHNpemUgKj0gbWFnbjtcclxuXHJcbiAgICAvLyByZWR1Y2Ugc3RhcnRpbmcgZGVjaW1hbHMgaWYgbm90IG5lZWRlZFxyXG4gICAgaWYgKE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSkge1xyXG4gICAgICBkZWMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZXN1bHQ6IE9iamVjdCA9IHtcclxuICAgICAgZGVjaW1hbHM6IE1hdGgubWF4KDAsIGRlYyksXHJcbiAgICAgIHNjYWxlZERlY2ltYWxzOiBNYXRoLm1heCgwLCBkZWMpIC0gTWF0aC5mbG9vcihNYXRoLmxvZyhzaXplKSAvIE1hdGguTE4xMCkgKyAyXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHB1YmxpYyBzZXRVbml0Rm9ybWF0KHN1Ykl0ZW0sIGluZGV4KSB7XHJcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgIHRoaXMucGFuZWwuZGVmYXVsdFBhdHRlcm4uZm9ybWF0ID0gc3ViSXRlbS52YWx1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucGFuZWwucGF0dGVybnNbaW5kZXhdLmZvcm1hdCA9IHN1Ykl0ZW0udmFsdWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgbGltaXRUZXh0KHRleHQsIG1heGxlbmd0aCkge1xyXG4gICAgaWYgKHRleHQuc3BsaXQoJycpLmxlbmd0aCA+IG1heGxlbmd0aCkge1xyXG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgbWF4bGVuZ3RoIC0gMykgKyBcIi4uLlwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRleHQ7XHJcbiAgfVxyXG4gIHB1YmxpYyBsaW5rKHNjb3BlLCBlbGVtLCBhdHRycywgY3RybCkge1xyXG4gICAgdGhpcy5zY29wZSA9IHNjb3BlO1xyXG4gICAgdGhpcy5lbGVtID0gZWxlbTtcclxuICAgIHRoaXMuYXR0cnMgPSBhdHRycztcclxuICAgIHRoaXMuY3RybCA9IGN0cmw7XHJcbiAgfVxyXG59XHJcblxyXG5HcmFmYW5hQm9vbVRhYmxlQ3RybC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0aGlzLmRhdGFSZWNlaXZlZCkge1xyXG4gICAgLy8gQ29weWluZyB0aGUgZGF0YSByZWNlaXZlZFxyXG4gICAgdGhpcy5kYXRhQ29tcHV0ZWQgPSB0aGlzLmRhdGFSZWNlaXZlZDtcclxuICAgIHRoaXMucGFuZWwuZGVmYXVsdF90aXRsZV9mb3Jfcm93cyA9IHRoaXMucGFuZWwuZGVmYXVsdF90aXRsZV9mb3Jfcm93cyB8fCBjb25maWcuZGVmYXVsdF90aXRsZV9mb3Jfcm93cztcclxuICAgIGNvbnN0IG1ldHJpY3NSZWNlaXZlZCA9IHV0aWxzLmdldEZpZWxkcyh0aGlzLmRhdGFDb21wdXRlZCwgXCJ0YXJnZXRcIik7XHJcbiAgICBpZiAobWV0cmljc1JlY2VpdmVkLmxlbmd0aCAhPT0gXy51bmlxKG1ldHJpY3NSZWNlaXZlZCkubGVuZ3RoKSB7XHJcbiAgICAgIGxldCBkdXBsaWNhdGVLZXlzID0gXy51bmlxKG1ldHJpY3NSZWNlaXZlZC5maWx0ZXIodiA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG1ldHJpY3NSZWNlaXZlZC5maWx0ZXIodCA9PiB0ID09PSB2KS5sZW5ndGggPiAxO1xyXG4gICAgICB9KSk7XHJcbiAgICAgIGxldCBlcnIgPSBuZXcgRXJyb3IoKTtcclxuICAgICAgZXJyLm5hbWUgPSBcIkR1cGxpY2F0ZSBkYXRhIHJlY2VpdmVkXCI7XHJcbiAgICAgIGVyci5tZXNzYWdlID0gXCJEdXBsaWNhdGUga2V5cyA6IDxici8+XCIgKyBkdXBsaWNhdGVLZXlzLmpvaW4oXCI8YnIvPiBcIik7XHJcbiAgICAgIHRoaXMucGFuZWwuZXJyb3IgPSBlcnI7XHJcbiAgICAgIHRoaXMucGFuZWwuZGF0YSA9IHVuZGVmaW5lZDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucGFuZWwuZXJyb3IgPSB1bmRlZmluZWQ7XHJcbiAgICAgIC8vIEJpbmRpbmcgdGhlIGdyYWZhbmEgY29tcHV0YXRpb25zIHRvIHRoZSBtZXRyaWNzIHJlY2VpdmVkXHJcbiAgICAgIHRoaXMuZGF0YUNvbXB1dGVkID0gdGhpcy5kYXRhUmVjZWl2ZWQubWFwKHRoaXMuc2VyaWVzSGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICAgICAgLy8gR2V0IFNlcnZlciBUaW1lIFN0YW1wIG9mIHRoZSBTZXJpZXMgZm9yIHRpbWUgYmFzZWQgdGhyZXNob2xkcy5cclxuICAgICAgdGhpcy5kYXRhQ29tcHV0ZWQgPSB0aGlzLmRhdGFDb21wdXRlZC5tYXAoc2VyaWVzID0+IHtcclxuICAgICAgICBzZXJpZXMuY3VycmVudF9zZXJ2ZXJ0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGlmIChzZXJpZXMgJiYgc2VyaWVzLmRhdGFwb2ludHMgJiYgc2VyaWVzLmRhdGFwb2ludHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgaWYgKF8ubGFzdChzZXJpZXMuZGF0YXBvaW50cykubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgIHNlcmllcy5jdXJyZW50X3NlcnZlcnRpbWVzdGFtcCA9IG5ldyBEYXRlKF8ubGFzdChzZXJpZXMuZGF0YXBvaW50cylbMV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VyaWVzO1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gQXNzaWduIHBhdHRlcm5cclxuICAgICAgdGhpcy5kYXRhQ29tcHV0ZWQgPSB0aGlzLmRhdGFDb21wdXRlZC5tYXAoc2VyaWVzID0+IHtcclxuICAgICAgICBzZXJpZXMucGF0dGVybiA9IF8uZmluZCh0aGlzLnBhbmVsLnBhdHRlcm5zLmZpbHRlcihwID0+IHsgcmV0dXJuIHAuZGlzYWJsZWQgIT09IHRydWU7IH0pLCBmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIHNlcmllcy5hbGlhcy5tYXRjaChwLnBhdHRlcm4pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzZXJpZXMucGF0dGVybiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBzZXJpZXMucGF0dGVybiA9IHRoaXMucGFuZWwuZGVmYXVsdFBhdHRlcm4gfHwgY29uZmlnLnBhbmVsRGVmYXVsdHMuZGVmYXVsdFBhdHRlcm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZXJpZXM7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBBc3NpZ24gRGVjaW1hbCBWYWx1ZXNcclxuICAgICAgdGhpcy5kYXRhQ29tcHV0ZWQgPSB0aGlzLmRhdGFDb21wdXRlZC5tYXAoc2VyaWVzID0+IHtcclxuICAgICAgICBzZXJpZXMuZGVjaW1hbHMgPSAoc2VyaWVzLnBhdHRlcm4uZGVjaW1hbHMpIHx8IGNvbmZpZy5wYW5lbERlZmF1bHRzLmRlZmF1bHRQYXR0ZXJuLmRlY2ltYWxzO1xyXG4gICAgICAgIHJldHVybiBzZXJpZXM7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBBc3NpZ24gdmFsdWVcclxuICAgICAgdGhpcy5kYXRhQ29tcHV0ZWQgPSB0aGlzLmRhdGFDb21wdXRlZC5tYXAoc2VyaWVzID0+IHtcclxuICAgICAgICBpZiAoc2VyaWVzLnN0YXRzKSB7XHJcbiAgICAgICAgICBzZXJpZXMudmFsdWUgPSBzZXJpZXMuc3RhdHNbc2VyaWVzLnBhdHRlcm4udmFsdWVOYW1lIHx8IGNvbmZpZy5wYW5lbERlZmF1bHRzLmRlZmF1bHRQYXR0ZXJuLnZhbHVlTmFtZV07XHJcbiAgICAgICAgICBsZXQgZGVjaW1hbEluZm86IGFueSA9IHRoaXMuZ2V0RGVjaW1hbHNGb3JWYWx1ZShzZXJpZXMudmFsdWUsIHNlcmllcy5kZWNpbWFscyk7XHJcbiAgICAgICAgICBsZXQgZm9ybWF0RnVuYyA9IGtibi52YWx1ZUZvcm1hdHNbc2VyaWVzLnBhdHRlcm4uZm9ybWF0IHx8IGNvbmZpZy5wYW5lbERlZmF1bHRzLmRlZmF1bHRQYXR0ZXJuLmZvcm1hdF07XHJcbiAgICAgICAgICBpZiAoc2VyaWVzLnZhbHVlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHNlcmllcy5kaXNwbGF5VmFsdWUgPSBzZXJpZXMucGF0dGVybi5udWxsX3ZhbHVlIHx8IGNvbmZpZy5wYW5lbERlZmF1bHRzLmRlZmF1bHRQYXR0ZXJuLm51bGxfdmFsdWUgfHwgXCJOdWxsXCI7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKCFpc05hTihzZXJpZXMudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHNlcmllcy52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoc2VyaWVzLnZhbHVlLCBkZWNpbWFsSW5mby5kZWNpbWFscywgZGVjaW1hbEluZm8uc2NhbGVkRGVjaW1hbHMpO1xyXG4gICAgICAgICAgICBzZXJpZXMudmFsdWVSb3VuZGVkID0ga2JuLnJvdW5kVmFsdWUoc2VyaWVzLnZhbHVlLCBkZWNpbWFsSW5mby5kZWNpbWFscyk7XHJcbiAgICAgICAgICAgIHNlcmllcy5kaXNwbGF5VmFsdWUgPSBzZXJpZXMudmFsdWVGb3JtYXR0ZWQ7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXJpZXMuZGlzcGxheVZhbHVlID0gc2VyaWVzLnBhdHRlcm4ubnVsbF92YWx1ZSB8fCBjb25maWcucGFuZWxEZWZhdWx0cy5kZWZhdWx0UGF0dGVybi5udWxsX3ZhbHVlIHx8IFwiTnVsbFwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VyaWVzO1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gRmlsdGVyIFZhbHVlc1xyXG4gICAgICB0aGlzLmRhdGFDb21wdXRlZCA9IHRoaXMuZGF0YUNvbXB1dGVkLmZpbHRlcihzZXJpZXMgPT4ge1xyXG4gICAgICAgIGlmICghc2VyaWVzLnBhdHRlcm4uZmlsdGVyKSB7XHJcbiAgICAgICAgICBzZXJpZXMucGF0dGVybi5maWx0ZXIgPSB7fTtcclxuICAgICAgICAgIHNlcmllcy5wYXR0ZXJuLmZpbHRlci52YWx1ZV9iZWxvdyA9IFwiXCI7XHJcbiAgICAgICAgICBzZXJpZXMucGF0dGVybi5maWx0ZXIudmFsdWVfYWJvdmUgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VyaWVzLnBhdHRlcm4gJiYgc2VyaWVzLnBhdHRlcm4uZmlsdGVyICYmIChzZXJpZXMucGF0dGVybi5maWx0ZXIudmFsdWVfYmVsb3cgIT09IFwiXCIgfHwgc2VyaWVzLnBhdHRlcm4uZmlsdGVyLnZhbHVlX2Fib3ZlICE9PSBcIlwiKSkge1xyXG4gICAgICAgICAgaWYgKHNlcmllcy5wYXR0ZXJuLmZpbHRlci52YWx1ZV9iZWxvdyAhPT0gXCJcIiAmJiBzZXJpZXMudmFsdWUgPCArKHNlcmllcy5wYXR0ZXJuLmZpbHRlci52YWx1ZV9iZWxvdykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHNlcmllcy5wYXR0ZXJuLmZpbHRlci52YWx1ZV9hYm92ZSAhPT0gXCJcIiAmJiBzZXJpZXMudmFsdWUgPiArKHNlcmllcy5wYXR0ZXJuLmZpbHRlci52YWx1ZV9hYm92ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIC8vIEFzc2lnbiBSb3cgTmFtZVxyXG4gICAgICB0aGlzLmRhdGFDb21wdXRlZCA9IHRoaXMuZGF0YUNvbXB1dGVkLm1hcChzZXJpZXMgPT4ge1xyXG4gICAgICAgIHNlcmllcy5yb3dfbmFtZSA9IHNlcmllcy5hbGlhcy5zcGxpdChzZXJpZXMucGF0dGVybi5kZWxpbWl0ZXIgfHwgXCIuXCIpLnJlZHVjZSgociwgaXQsIGkpID0+IHtcclxuICAgICAgICAgIHJldHVybiByLnJlcGxhY2UobmV3IFJlZ0V4cCh0aGlzLnBhbmVsLnJvd19jb2xfd3JhcHBlciArIGkgKyB0aGlzLnBhbmVsLnJvd19jb2xfd3JhcHBlciwgXCJnXCIpLCBpdCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAgIHNlcmllcy5wYXR0ZXJuLnJvd19uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCh0aGlzLnBhbmVsLnJvd19jb2xfd3JhcHBlciArIFwic2VyaWVzXCIgKyB0aGlzLnBhbmVsLnJvd19jb2xfd3JhcHBlciwgXCJnXCIpLCBzZXJpZXMuYWxpYXMpIHx8XHJcbiAgICAgICAgICBjb25maWcucGFuZWxEZWZhdWx0cy5kZWZhdWx0UGF0dGVybi5yb3dfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAodGhpcy5wYW5lbC5yb3dfY29sX3dyYXBwZXIgKyBcInNlcmllc1wiICsgdGhpcy5wYW5lbC5yb3dfY29sX3dyYXBwZXIsIFwiZ1wiKSwgc2VyaWVzLmFsaWFzKSk7XHJcbiAgICAgICAgaWYgKHNlcmllcy5hbGlhcy5zcGxpdChzZXJpZXMucGF0dGVybi5kZWxpbWl0ZXIgfHwgXCIuXCIpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgc2VyaWVzLnJvd19uYW1lID0gc2VyaWVzLmFsaWFzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VyaWVzO1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gQXNzaWduIENvbCBOYW1lXHJcbiAgICAgIHRoaXMuZGF0YUNvbXB1dGVkID0gdGhpcy5kYXRhQ29tcHV0ZWQubWFwKHNlcmllcyA9PiB7XHJcbiAgICAgICAgc2VyaWVzLmNvbF9uYW1lID0gc2VyaWVzLmFsaWFzLnNwbGl0KHNlcmllcy5wYXR0ZXJuLmRlbGltaXRlciB8fCBcIi5cIikucmVkdWNlKChyLCBpdCwgaSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHIucmVwbGFjZShuZXcgUmVnRXhwKHRoaXMucGFuZWwucm93X2NvbF93cmFwcGVyICsgaSArIHRoaXMucGFuZWwucm93X2NvbF93cmFwcGVyLCBcImdcIiksIGl0KTtcclxuICAgICAgICB9LCBzZXJpZXMucGF0dGVybi5jb2xfbmFtZSB8fCBjb25maWcucGFuZWxEZWZhdWx0cy5kZWZhdWx0UGF0dGVybi5jb2xfbmFtZSk7XHJcbiAgICAgICAgaWYgKHNlcmllcy5hbGlhcy5zcGxpdChzZXJpZXMucGF0dGVybi5kZWxpbWl0ZXIgfHwgXCIuXCIpLmxlbmd0aCA9PT0gMSB8fCBzZXJpZXMucm93X25hbWUgPT09IHNlcmllcy5hbGlhcykge1xyXG4gICAgICAgICAgc2VyaWVzLmNvbF9uYW1lID0gc2VyaWVzLnBhdHRlcm4uY29sX25hbWUgfHwgXCJWYWx1ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VyaWVzO1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gQXNzaWduIFJvd0NvbCBLZXlcclxuICAgICAgdGhpcy5kYXRhQ29tcHV0ZWQgPSB0aGlzLmRhdGFDb21wdXRlZC5tYXAoc2VyaWVzID0+IHtcclxuICAgICAgICBzZXJpZXMua2V5X25hbWUgPSBzZXJpZXMucm93X25hbWUgKyBcIiNcIiArIHNlcmllcy5jb2xfbmFtZTtcclxuICAgICAgICByZXR1cm4gc2VyaWVzO1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gQXNzaWduIFRocmVzaG9sZHNcclxuICAgICAgdGhpcy5kYXRhQ29tcHV0ZWQgPSB0aGlzLmRhdGFDb21wdXRlZC5tYXAoc2VyaWVzID0+IHtcclxuICAgICAgICBzZXJpZXMudGhyZXNob2xkcyA9IChzZXJpZXMucGF0dGVybi50aHJlc2hvbGRzIHx8IGNvbmZpZy5wYW5lbERlZmF1bHRzLmRlZmF1bHRQYXR0ZXJuLnRocmVzaG9sZHMpLnNwbGl0KFwiLFwiKS5tYXAoZCA9PiArZCk7XHJcbiAgICAgICAgaWYgKHNlcmllcy5wYXR0ZXJuLmVuYWJsZV90aW1lX2Jhc2VkX3RocmVzaG9sZHMpIHtcclxuICAgICAgICAgIGxldCBtZXRyaWNyZWNpdmVkVGltZVN0YW1wID0gc2VyaWVzLmN1cnJlbnRfc2VydmVydGltZXN0YW1wIHx8IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICBsZXQgbWV0cmljcmVjaXZlZFRpbWVTdGFtcF9pbm51bWJlciA9IG1ldHJpY3JlY2l2ZWRUaW1lU3RhbXAuZ2V0SG91cnMoKSAqIDEwMCArIG1ldHJpY3JlY2l2ZWRUaW1lU3RhbXAuZ2V0TWludXRlcygpO1xyXG4gICAgICAgICAgbGV0IHdlZWtkYXlzID0gW1wic3VuXCIsIFwibW9uXCIsIFwidHVlXCIsIFwid2VkXCIsIFwidGh1XCIsIFwiZnJpXCIsIFwic2F0XCJdO1xyXG4gICAgICAgICAgXy5lYWNoKHNlcmllcy5wYXR0ZXJuLnRpbWVfYmFzZWRfdGhyZXNob2xkcywgKHRidHgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRidHggJiYgdGJ0eC5mcm9tICYmIHRidHgudG8gJiYgdGJ0eC5lbmFibGVkRGF5cyAmJlxyXG4gICAgICAgICAgICAgIChtZXRyaWNyZWNpdmVkVGltZVN0YW1wX2lubnVtYmVyID49ICsodGJ0eC5mcm9tKSkgJiZcclxuICAgICAgICAgICAgICAobWV0cmljcmVjaXZlZFRpbWVTdGFtcF9pbm51bWJlciA8PSArKHRidHgudG8pKSAmJlxyXG4gICAgICAgICAgICAgICh0YnR4LmVuYWJsZWREYXlzLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih3ZWVrZGF5c1ttZXRyaWNyZWNpdmVkVGltZVN0YW1wLmdldERheSgpXSkgPiAtMSkgJiZcclxuICAgICAgICAgICAgICB0YnR4LnRocmVzaG9sZFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICBzZXJpZXMudGhyZXNob2xkcyA9ICh0YnR4LnRocmVzaG9sZCArIFwiXCIpLnNwbGl0KFwiLFwiKS5tYXAoZCA9PiArZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VyaWVzO1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gQXNzaWduIEJHIENvbG9yc1xyXG4gICAgICB0aGlzLmRhdGFDb21wdXRlZCA9IHRoaXMuZGF0YUNvbXB1dGVkLm1hcChzZXJpZXMgPT4ge1xyXG4gICAgICAgIHNlcmllcy5lbmFibGVfYmdDb2xvciA9IHNlcmllcy5wYXR0ZXJuLmVuYWJsZV9iZ0NvbG9yO1xyXG4gICAgICAgIHNlcmllcy5iZ0NvbG9ycyA9IChzZXJpZXMucGF0dGVybi5iZ0NvbG9ycyB8fCBjb25maWcucGFuZWxEZWZhdWx0cy5kZWZhdWx0UGF0dGVybi5iZ0NvbG9ycykuc3BsaXQoXCJ8XCIpO1xyXG4gICAgICAgIHNlcmllcy5iZ0NvbG9yID0gc2VyaWVzLmVuYWJsZV9iZ0NvbG9yID09PSB0cnVlID8gdGhpcy5jb21wdXRlQmdDb2xvcihzZXJpZXMudGhyZXNob2xkcywgc2VyaWVzLmJnQ29sb3JzLCBzZXJpZXMudmFsdWUpIDogXCJ0cmFuc3BhcmVudFwiO1xyXG4gICAgICAgIGlmIChzZXJpZXMuZGlzcGxheVZhbHVlID09PSAoc2VyaWVzLnBhdHRlcm4ubnVsbF92YWx1ZSB8fCBjb25maWcucGFuZWxEZWZhdWx0cy5kZWZhdWx0UGF0dGVybi5udWxsX3ZhbHVlIHx8IFwiTnVsbFwiKSkge1xyXG4gICAgICAgICAgc2VyaWVzLmJnQ29sb3IgPSBzZXJpZXMucGF0dGVybi5udWxsX2NvbG9yIHx8IGNvbmZpZy5wYW5lbERlZmF1bHRzLmRlZmF1bHRQYXR0ZXJuLm51bGxfY29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZXJpZXM7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBCRyBDb2xvcnMgb3ZlcnJpZGVzXHJcbiAgICAgIHRoaXMuZGF0YUNvbXB1dGVkID0gdGhpcy5kYXRhQ29tcHV0ZWQubWFwKHNlcmllcyA9PiB7XHJcbiAgICAgICAgc2VyaWVzLmVuYWJsZV9iZ0NvbG9yX292ZXJyaWRlcyA9IHNlcmllcy5wYXR0ZXJuLmVuYWJsZV9iZ0NvbG9yX292ZXJyaWRlcztcclxuICAgICAgICBzZXJpZXMuYmdDb2xvcnNfb3ZlcnJpZGVzID0gc2VyaWVzLnBhdHRlcm4uYmdDb2xvcnNfb3ZlcnJpZGVzIHx8IFwiXCI7XHJcbiAgICAgICAgaWYgKHNlcmllcy5lbmFibGVfYmdDb2xvcl9vdmVycmlkZXMgJiYgc2VyaWVzLmJnQ29sb3JzX292ZXJyaWRlcyAhPT0gXCJcIikge1xyXG4gICAgICAgICAgbGV0IF9iZ0NvbG9yc19vdmVycmlkZXMgPSBzZXJpZXMuYmdDb2xvcnNfb3ZlcnJpZGVzLnNwbGl0KFwifFwiKS5maWx0ZXIoY29uID0+IGNvbi5pbmRleE9mKFwiLT5cIikpLm1hcChjb24gPT4gY29uLnNwbGl0KFwiLT5cIikpLmZpbHRlcihjb24gPT4gKyhjb25bMF0pID09PSBzZXJpZXMudmFsdWUpLm1hcChjb24gPT4gY29uWzFdKTtcclxuICAgICAgICAgIGlmIChfYmdDb2xvcnNfb3ZlcnJpZGVzLmxlbmd0aCA+IDAgJiYgX2JnQ29sb3JzX292ZXJyaWRlc1swXSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICBzZXJpZXMuYmdDb2xvciA9IHV0aWxzLm5vcm1hbGl6ZUNvbG9yKChcIlwiICsgX2JnQ29sb3JzX292ZXJyaWRlc1swXSkudHJpbSgpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlcmllcztcclxuICAgICAgfSk7XHJcbiAgICAgIC8vIFZhbHVlIFRyYW5zZm9ybVxyXG4gICAgICB0aGlzLmRhdGFDb21wdXRlZCA9IHRoaXMuZGF0YUNvbXB1dGVkLm1hcChzZXJpZXMgPT4ge1xyXG4gICAgICAgIHNlcmllcy5lbmFibGVfdHJhbnNmb3JtID0gc2VyaWVzLnBhdHRlcm4uZW5hYmxlX3RyYW5zZm9ybTtcclxuICAgICAgICBzZXJpZXMudHJhbnNmb3JtX3ZhbHVlcyA9IChzZXJpZXMucGF0dGVybi50cmFuc2Zvcm1fdmFsdWVzIHx8IGNvbmZpZy5wYW5lbERlZmF1bHRzLmRlZmF1bHRQYXR0ZXJuLnRyYW5zZm9ybV92YWx1ZXMpLnNwbGl0KFwifFwiKTtcclxuICAgICAgICBzZXJpZXMuZGlzcGxheVZhbHVlID0gc2VyaWVzLmVuYWJsZV90cmFuc2Zvcm0gPT09IHRydWUgPyB0aGlzLnRyYW5zZm9ybVZhbHVlKHNlcmllcy50aHJlc2hvbGRzLCBzZXJpZXMudHJhbnNmb3JtX3ZhbHVlcywgc2VyaWVzLnZhbHVlLCBzZXJpZXMuZGlzcGxheVZhbHVlLCBzZXJpZXMucm93X25hbWUsIHNlcmllcy5jb2xfbmFtZSkgOiBzZXJpZXMuZGlzcGxheVZhbHVlO1xyXG4gICAgICAgIGlmIChzZXJpZXMuZGlzcGxheVZhbHVlID09PSAoc2VyaWVzLnBhdHRlcm4ubnVsbF92YWx1ZSB8fCBjb25maWcucGFuZWxEZWZhdWx0cy5kZWZhdWx0UGF0dGVybi5udWxsX3ZhbHVlIHx8IFwiTnVsbFwiKSkge1xyXG4gICAgICAgICAgc2VyaWVzLmRpc3BsYXlWYWx1ZSA9IHNlcmllcy5wYXR0ZXJuLm51bGxfdmFsdWUgfHwgY29uZmlnLnBhbmVsRGVmYXVsdHMuZGVmYXVsdFBhdHRlcm4ubnVsbF92YWx1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGlzTmFOKHNlcmllcy52YWx1ZSkpIHtcclxuICAgICAgICAgIHNlcmllcy5kaXNwbGF5VmFsdWUgPSBzZXJpZXMucGF0dGVybi5udWxsX3ZhbHVlIHx8IGNvbmZpZy5wYW5lbERlZmF1bHRzLmRlZmF1bHRQYXR0ZXJuLm51bGxfdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZXJpZXM7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBWYWx1ZSBUcmFuc2Zvcm0gT3ZlcnJpZGVzXHJcbiAgICAgIHRoaXMuZGF0YUNvbXB1dGVkID0gdGhpcy5kYXRhQ29tcHV0ZWQubWFwKHNlcmllcyA9PiB7XHJcbiAgICAgICAgc2VyaWVzLmVuYWJsZV90cmFuc2Zvcm1fb3ZlcnJpZGVzID0gc2VyaWVzLnBhdHRlcm4uZW5hYmxlX3RyYW5zZm9ybV9vdmVycmlkZXM7XHJcbiAgICAgICAgc2VyaWVzLnRyYW5zZm9ybV92YWx1ZXNfb3ZlcnJpZGVzID0gc2VyaWVzLnBhdHRlcm4udHJhbnNmb3JtX3ZhbHVlc19vdmVycmlkZXMgfHwgXCJcIjtcclxuICAgICAgICBpZiAoc2VyaWVzLmVuYWJsZV90cmFuc2Zvcm1fb3ZlcnJpZGVzICYmIHNlcmllcy50cmFuc2Zvcm1fdmFsdWVzX292ZXJyaWRlcyAhPT0gXCJcIikge1xyXG4gICAgICAgICAgbGV0IF90cmFuc2Zvcm1fdmFsdWVzX292ZXJyaWRlcyA9IHNlcmllcy50cmFuc2Zvcm1fdmFsdWVzX292ZXJyaWRlcy5zcGxpdChcInxcIikuZmlsdGVyKGNvbiA9PiBjb24uaW5kZXhPZihcIi0+XCIpKS5tYXAoY29uID0+IGNvbi5zcGxpdChcIi0+XCIpKS5maWx0ZXIoY29uID0+ICsoY29uWzBdKSA9PT0gc2VyaWVzLnZhbHVlKS5tYXAoY29uID0+IGNvblsxXSk7XHJcbiAgICAgICAgICBpZiAoX3RyYW5zZm9ybV92YWx1ZXNfb3ZlcnJpZGVzLmxlbmd0aCA+IDAgJiYgX3RyYW5zZm9ybV92YWx1ZXNfb3ZlcnJpZGVzWzBdICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHNlcmllcy5kaXNwbGF5VmFsdWUgPSAoXCJcIiArIF90cmFuc2Zvcm1fdmFsdWVzX292ZXJyaWRlc1swXSkudHJpbSgpLnJlcGxhY2UobmV3IFJlZ0V4cChcIl92YWx1ZV9cIiwgXCJnXCIpLCBzZXJpZXMuZGlzcGxheVZhbHVlKS5yZXBsYWNlKG5ldyBSZWdFeHAoXCJfcm93X25hbWVfXCIsIFwiZ1wiKSwgc2VyaWVzLnJvd19uYW1lKS5yZXBsYWNlKG5ldyBSZWdFeHAoXCJfY29sX25hbWVfXCIsIFwiZ1wiKSwgc2VyaWVzLmNvbF9uYW1lKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlcmllcztcclxuICAgICAgfSk7XHJcbiAgICAgIC8vIEZvbnQgYXdlc29tZSBpY29uc1xyXG4gICAgICB0aGlzLmRhdGFDb21wdXRlZCA9IHRoaXMuZGF0YUNvbXB1dGVkLm1hcChzZXJpZXMgPT4ge1xyXG4gICAgICAgIHNlcmllcy5hY3R1YWxfZGlzcGxheXZhbHVlID0gc2VyaWVzLmRpc3BsYXlWYWx1ZTtcclxuICAgICAgICBzZXJpZXMuYWN0dWFsX3Jvd19uYW1lID0gc2VyaWVzLnJvd19uYW1lO1xyXG4gICAgICAgIHNlcmllcy5hY3R1YWxfY29sX25hbWUgPSBzZXJpZXMuY29sX25hbWU7XHJcbiAgICAgICAgaWYgKHNlcmllcy5kaXNwbGF5VmFsdWUgJiYgc2VyaWVzLmRpc3BsYXlWYWx1ZS5pbmRleE9mKFwiX2ZhLVwiKSA+IC0xKSB7IHNlcmllcy5kaXNwbGF5VmFsdWUgPSB0aGlzLnJlcGxhY2VGb250QXdlc29tZUljb25zKHNlcmllcy5kaXNwbGF5VmFsdWUpOyB9XHJcbiAgICAgICAgaWYgKHNlcmllcy5yb3dfbmFtZSAmJiBzZXJpZXMucm93X25hbWUuaW5kZXhPZihcIl9mYS1cIikgPiAtMSkgeyBzZXJpZXMucm93X25hbWUgPSB0aGlzLnJlcGxhY2VGb250QXdlc29tZUljb25zKHNlcmllcy5yb3dfbmFtZSk7IH1cclxuICAgICAgICBpZiAoc2VyaWVzLmNvbF9uYW1lICYmIHNlcmllcy5jb2xfbmFtZS5pbmRleE9mKFwiX2ZhLVwiKSA+IC0xKSB7IHNlcmllcy5jb2xfbmFtZSA9IHRoaXMucmVwbGFjZUZvbnRBd2Vzb21lSWNvbnMoc2VyaWVzLmNvbF9uYW1lKTsgfVxyXG4gICAgICAgIHJldHVybiBzZXJpZXM7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBJbWFnZSB0cmFuc2Zvcm1zXHJcbiAgICAgIHRoaXMuZGF0YUNvbXB1dGVkID0gdGhpcy5kYXRhQ29tcHV0ZWQubWFwKHNlcmllcyA9PiB7XHJcbiAgICAgICAgaWYgKHNlcmllcy5kaXNwbGF5VmFsdWUgJiYgc2VyaWVzLmRpc3BsYXlWYWx1ZS5pbmRleE9mKFwiX2ltZy1cIikgPiAtMSkgeyBzZXJpZXMuZGlzcGxheVZhbHVlID0gdGhpcy5yZXBsYWNlV2l0aEltYWdlcyhzZXJpZXMuZGlzcGxheVZhbHVlKTsgfVxyXG4gICAgICAgIGlmIChzZXJpZXMucm93X25hbWUgJiYgc2VyaWVzLnJvd19uYW1lLmluZGV4T2YoXCJfaW1nLVwiKSA+IC0xKSB7IHNlcmllcy5yb3dfbmFtZSA9IHRoaXMucmVwbGFjZVdpdGhJbWFnZXMoc2VyaWVzLnJvd19uYW1lKTsgfVxyXG4gICAgICAgIGlmIChzZXJpZXMuY29sX25hbWUgJiYgc2VyaWVzLmNvbF9uYW1lLmluZGV4T2YoXCJfaW1nLVwiKSA+IC0xKSB7IHNlcmllcy5jb2xfbmFtZSA9IHRoaXMucmVwbGFjZVdpdGhJbWFnZXMoc2VyaWVzLmNvbF9uYW1lKTsgfVxyXG4gICAgICAgIHJldHVybiBzZXJpZXM7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBDZWxsIExpbmtzXHJcbiAgICAgIHRoaXMuZGF0YUNvbXB1dGVkID0gdGhpcy5kYXRhQ29tcHV0ZWQubWFwKHNlcmllcyA9PiB7XHJcbiAgICAgICAgaWYgKHNlcmllcy5wYXR0ZXJuLmVuYWJsZV9jbGlja2FibGVfY2VsbHMpIHtcclxuICAgICAgICAgIGxldCB0YXJnZXRMaW5rID0gc2VyaWVzLnBhdHRlcm4uY2xpY2thYmxlX2NlbGxzX2xpbmsgfHwgXCIjXCI7XHJcbiAgICAgICAgICB0YXJnZXRMaW5rID0gdGFyZ2V0TGluay5yZXBsYWNlKG5ldyBSZWdFeHAoXCJfcm93X25hbWVfXCIsIFwiZ1wiKSwgdGhpcy5nZXRBY3R1YWxOYW1lV2l0aG91dFRyYW5zZm9ybVNpZ24oc2VyaWVzLmFjdHVhbF9yb3dfbmFtZSkudHJpbSgpKTtcclxuICAgICAgICAgIHRhcmdldExpbmsgPSB0YXJnZXRMaW5rLnJlcGxhY2UobmV3IFJlZ0V4cChcIl9jb2xfbmFtZV9cIiwgXCJnXCIpLCB0aGlzLmdldEFjdHVhbE5hbWVXaXRob3V0VHJhbnNmb3JtU2lnbihzZXJpZXMuYWN0dWFsX2NvbF9uYW1lKS50cmltKCkpO1xyXG4gICAgICAgICAgdGFyZ2V0TGluayA9IHRhcmdldExpbmsucmVwbGFjZShuZXcgUmVnRXhwKFwiX3ZhbHVlX1wiLCBcImdcIiksIHRoaXMuZ2V0QWN0dWFsTmFtZVdpdGhvdXRUcmFuc2Zvcm1TaWduKHNlcmllcy52YWx1ZSkudHJpbSgpKTtcclxuICAgICAgICAgIHNlcmllcy5kaXNwbGF5VmFsdWUgPSBgPGEgaHJlZj1cIiR7dGFyZ2V0TGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3Nlcmllcy5kaXNwbGF5VmFsdWV9PC9hPmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZXJpZXM7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBHcm91cGluZ1xyXG4gICAgICBjb25zdCByb3dzX2ZvdW5kID0gdXRpbHMuZ2V0RmllbGRzKHRoaXMuZGF0YUNvbXB1dGVkLCBcInJvd19uYW1lXCIpO1xyXG4gICAgICBjb25zdCBjb2xzX2ZvdW5kID0gdXRpbHMuZ2V0RmllbGRzKHRoaXMuZGF0YUNvbXB1dGVkLCBcImNvbF9uYW1lXCIpO1xyXG4gICAgICBjb25zdCBrZXlzX2ZvdW5kID0gdXRpbHMuZ2V0RmllbGRzKHRoaXMuZGF0YUNvbXB1dGVkLCBcImtleV9uYW1lXCIpO1xyXG4gICAgICBjb25zdCBpc191bmlxdWVfa2V5cyA9IChrZXlzX2ZvdW5kLmxlbmd0aCA9PT0gXy51bmlxKGtleXNfZm91bmQpLmxlbmd0aCk7XHJcbiAgICAgIGlmIChpc191bmlxdWVfa2V5cykge1xyXG4gICAgICAgIHRoaXMucGFuZWwuZXJyb3IgPSB1bmRlZmluZWQ7IC8vLy9cclxuICAgICAgICBsZXQgb3V0cHV0OiBhbnlbXSA9IFtdO1xyXG4gICAgICAgIF8uZWFjaChfLnVuaXEocm93c19mb3VuZCksIChyb3dfbmFtZSkgPT4ge1xyXG4gICAgICAgICAgbGV0IG86IGFueSA9IHt9O1xyXG4gICAgICAgICAgby5yb3cgPSByb3dfbmFtZTtcclxuICAgICAgICAgIG8uY29scyA9IFtdO1xyXG4gICAgICAgICAgXy5lYWNoKF8udW5pcShjb2xzX2ZvdW5kKSwgKGNvbF9uYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBtYXRjaGVkX3ZhbHVlID0gKF8uZmluZCh0aGlzLmRhdGFDb21wdXRlZCwgKGUpID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gZS5yb3dfbmFtZSA9PT0gcm93X25hbWUgJiYgZS5jb2xfbmFtZSA9PT0gY29sX25hbWU7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgaWYgKCFtYXRjaGVkX3ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgbWF0Y2hlZF92YWx1ZSA9IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlWYWx1ZTogXCJOL0FcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBOYU5cclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG8uY29scy5wdXNoKHtcclxuICAgICAgICAgICAgICBcImFjdHVhbF9jb2xfbmFtZVwiOiBtYXRjaGVkX3ZhbHVlLmFjdHVhbF9jb2xfbmFtZSxcclxuICAgICAgICAgICAgICBcImFjdHVhbF9yb3dfbmFtZVwiOiBtYXRjaGVkX3ZhbHVlLmFjdHVhbF9yb3dfbmFtZSxcclxuICAgICAgICAgICAgICBcImJnQ29sb3JcIjogbWF0Y2hlZF92YWx1ZS5iZ0NvbG9yIHx8IFwidHJhbnNwYXJlbnRcIixcclxuICAgICAgICAgICAgICBcImRpc3BsYXlWYWx1ZVwiOiBtYXRjaGVkX3ZhbHVlLmRpc3BsYXlWYWx1ZSB8fCBtYXRjaGVkX3ZhbHVlLnZhbHVlLFxyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBjb2xfbmFtZSxcclxuICAgICAgICAgICAgICBcInZhbHVlXCI6IG1hdGNoZWRfdmFsdWUudmFsdWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIG91dHB1dC5wdXNoKG8pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIHJlZ2lvbiBPdXRwdXQgdGFibGUgY29uc3RydWN0aW9uXHJcbiAgICAgICAgbGV0IGJvb210YWJsZV9vdXRwdXRfYm9keV9oZWFkZXJzID0gdGhpcy5lbGVtLmZpbmQoXCIjYm9vbXRhYmxlX291dHB1dF9ib2R5X2hlYWRlcnNcIik7XHJcbiAgICAgICAgbGV0IGJvb210YWJsZV9vdXRwdXRfYm9keV9oZWFkZXJzX291dHB1dCA9IGA8YnIvPmA7XHJcbiAgICAgICAgaWYgKHRoaXMucGFuZWwuaGlkZV9oZWFkZXJzICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICBib29tdGFibGVfb3V0cHV0X2JvZHlfaGVhZGVyc19vdXRwdXQgKz0gXCI8dHI+XCI7XHJcbiAgICAgICAgICBpZiAodGhpcy5wYW5lbC5oaWRlX2ZpcnN0X2NvbHVtbiAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBib29tdGFibGVfb3V0cHV0X2JvZHlfaGVhZGVyc19vdXRwdXQgKz0gYDx0aCBzdHlsZT1cInBhZGRpbmc6NHB4O3RleHQtYWxpZ246Y2VudGVyXCI+JHt0aGlzLnBhbmVsLmRlZmF1bHRfdGl0bGVfZm9yX3Jvd3N9PC90aD5gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXy5lYWNoKF8udW5pcShjb2xzX2ZvdW5kKSwgYyA9PiB7XHJcbiAgICAgICAgICAgIGJvb210YWJsZV9vdXRwdXRfYm9keV9oZWFkZXJzX291dHB1dCArPSBgPHRoIHN0eWxlPVwicGFkZGluZzo0cHg7dGV4dC1hbGlnbjpjZW50ZXJcIj4ke2N9PC90aD5gO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBib29tdGFibGVfb3V0cHV0X2JvZHlfaGVhZGVyc19vdXRwdXQgKz0gXCI8L3RyPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBib29tdGFibGVfb3V0cHV0X2JvZHlfaGVhZGVycy5odG1sKGJvb210YWJsZV9vdXRwdXRfYm9keV9oZWFkZXJzX291dHB1dCk7XHJcbiAgICAgICAgbGV0IGJvb210YWJsZV9vdXRwdXRfYm9keSA9IHRoaXMuZWxlbS5maW5kKCcjYm9vbXRhYmxlX291dHB1dF9ib2R5Jyk7XHJcbiAgICAgICAgbGV0IGJvb210YWJsZV9vdXRwdXRfYm9keV9vdXRwdXQgPSBgYDtcclxuICAgICAgICBfLmVhY2gob3V0cHV0LCBvID0+IHtcclxuICAgICAgICAgIGJvb210YWJsZV9vdXRwdXRfYm9keV9vdXRwdXQgKz0gXCI8dHI+XCI7XHJcbiAgICAgICAgICBpZiAodGhpcy5wYW5lbC5oaWRlX2ZpcnN0X2NvbHVtbiAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBib29tdGFibGVfb3V0cHV0X2JvZHlfb3V0cHV0ICs9IGA8dGQgc3R5bGU9XCJwYWRkaW5nOjRweDtcIj4ke28ucm93fTwvdGQ+YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIF8uZWFjaChvLmNvbHMsIGMgPT4ge1xyXG4gICAgICAgICAgICBib29tdGFibGVfb3V0cHV0X2JvZHlfb3V0cHV0ICs9IGA8dGRcclxuICAgICAgICAgICAgICBzdHlsZT1cInBhZGRpbmc6NHB4O2JhY2tncm91bmQtY29sb3I6JHtjLmJnQ29sb3J9XCJcclxuICAgICAgICAgICAgICB0aXRsZT1cIiR7IFwiUm93IE5hbWUgOiBcIiArIHRoaXMuZ2V0QWN0dWFsTmFtZVdpdGhvdXRUcmFuc2Zvcm1TaWduKGMuYWN0dWFsX3Jvd19uYW1lKSArIFwiXFxuQ29sIE5hbWUgOiBcIiArIHRoaXMuZ2V0QWN0dWFsTmFtZVdpdGhvdXRUcmFuc2Zvcm1TaWduKGMuYWN0dWFsX2NvbF9uYW1lKSArIFwiXFxuVmFsdWUgOiBcIiArIGMudmFsdWV9XCJcclxuICAgICAgICAgICAgPiR7Yy5kaXNwbGF5VmFsdWV9PC90ZD5gO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBib29tdGFibGVfb3V0cHV0X2JvZHlfb3V0cHV0ICs9IFwiPC90cj5cIjtcclxuICAgICAgICB9KTtcclxuICAgICAgICBib29tdGFibGVfb3V0cHV0X2JvZHkuaHRtbChib29tdGFibGVfb3V0cHV0X2JvZHlfb3V0cHV0KTtcclxuICAgICAgICAvLyBlbmRyZWdpb25cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgZHVwbGljYXRlS2V5VmFsdWVzID0gXy51bmlxKGtleXNfZm91bmQuZmlsdGVyKHYgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGtleXNfZm91bmQuZmlsdGVyKHQgPT4gdCA9PT0gdikubGVuZ3RoID4gMTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgbGV0IGVycl9kdXBsaWNhdGVLZXlzID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgZXJyX2R1cGxpY2F0ZUtleXMubmFtZSA9IFwiRHVwbGljYXRlIGtleXMgZm91bmRcIjtcclxuICAgICAgICBlcnJfZHVwbGljYXRlS2V5cy5tZXNzYWdlID0gXCJEdXBsaWNhdGUga2V5IHZhbHVlcyA6IDxici8+XCIgKyBkdXBsaWNhdGVLZXlWYWx1ZXMuam9pbihcIjxici8+IFwiKTtcclxuICAgICAgICB0aGlzLnBhbmVsLmVycm9yID0gZXJyX2R1cGxpY2F0ZUtleXM7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHJlZ2lvbiBEZWJ1ZyB0YWJsZSBib2R5IGNvbnN0cnVjdGlvblxyXG4gICAgICBsZXQgYm9vbXRhYmxlX291dHB1dF9ib2R5X2RlYnVnID0gdGhpcy5lbGVtLmZpbmQoJyNib29tdGFibGVfb3V0cHV0X2JvZHlfZGVidWcnKTtcclxuICAgICAgbGV0IGJvb210YWJsZV9vdXRwdXRfYm9keV9kZWJ1Z19vdXRwdXQgPSBgYDtcclxuICAgICAgXy5lYWNoKHRoaXMuZGF0YUNvbXB1dGVkLCBkID0+IHtcclxuICAgICAgICBib29tdGFibGVfb3V0cHV0X2JvZHlfZGVidWdfb3V0cHV0ICs9IGBcclxuICAgICAgICA8dHI+XHJcbiAgICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOjRweDtcIiB3aWR0aD1cIjQwJVwiPiR7ZC5hbGlhc308L3RkPlxyXG4gICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzo0cHg7XCI+JHtkLnBhdHRlcm4ucGF0dGVybiB8fCBcIkRlZmF1bHRcIn08L3RkPlxyXG4gICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzo0cHg7YmFja2dyb3VuZC1jb2xvcjoke2QuYmdDb2xvcn1cIj4ke2QuZGlzcGxheVZhbHVlfTwvdGQ+XHJcbiAgICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOjRweDtcIj4ke2Qucm93X25hbWV9PC90ZD5cclxuICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6NHB4O1wiPiR7ZC5jb2xfbmFtZX08L3RkPlxyXG4gICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzo0cHg7XCI+JHtkLnRocmVzaG9sZHN9PC90ZD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgICAgIGA7XHJcbiAgICAgIH0pO1xyXG4gICAgICBib29tdGFibGVfb3V0cHV0X2JvZHlfZGVidWcuaHRtbChib29tdGFibGVfb3V0cHV0X2JvZHlfZGVidWdfb3V0cHV0KTtcclxuICAgICAgLy8gZW5kcmVnaW9uXHJcbiAgICB9XHJcbiAgICBsZXQgcm9vdEVsZW0gPSB0aGlzLmVsZW0uZmluZCgnLnRhYmxlLXBhbmVsLXNjcm9sbCcpO1xyXG4gICAgbGV0IG1heGhlaWdodG9mcGFuZWwgPSB0aGlzLnBhbmVsLmRlYnVnX21vZGUgPyB0aGlzLmN0cmwuaGVpZ2h0IC0gNzEgOiB0aGlzLmN0cmwuaGVpZ2h0IC0gMzE7XHJcbiAgICByb290RWxlbS5jc3MoeyAnbWF4LWhlaWdodCc6IG1heGhlaWdodG9mcGFuZWwgKyBcInB4XCIgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICBHcmFmYW5hQm9vbVRhYmxlQ3RybCBhcyBQYW5lbEN0cmxcclxufTtcclxuIl19