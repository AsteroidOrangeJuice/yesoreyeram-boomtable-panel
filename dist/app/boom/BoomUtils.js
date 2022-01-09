System.register(["lodash", "./BoomSeries"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, BoomSeries_1, normalizeColor, parseMath, parseMathExpression, getColor, replaceTokens, getActualNameWithoutTokens, getItemBasedOnThreshold, getMetricNameFromTaggedAlias, getLablesFromTaggedAlias, replace_tags_from_field, getSeriesValue, getCurrentTimeStamp, replaceDelimitedColumns, getRowName, getColName, getDisplayValueTemplate, doesValueNeedsToHide, supplementUndefinedVals;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (BoomSeries_1_1) {
                BoomSeries_1 = BoomSeries_1_1;
            }
        ],
        execute: function () {
            exports_1("normalizeColor", normalizeColor = function (color) {
                if (color.toLowerCase() === 'green') {
                    return 'rgba(50, 172, 45, 0.97)';
                }
                else if (color.toLowerCase() === 'orange') {
                    return 'rgba(237, 129, 40, 0.89)';
                }
                else if (color.toLowerCase() === 'red') {
                    return 'rgba(245, 54, 54, 0.9)';
                }
                else {
                    return color.trim();
                }
            });
            exports_1("parseMath", parseMath = function (valuestring) {
                var returnvalue = 0;
                if (valuestring.indexOf('+') > -1) {
                    returnvalue = +valuestring.split('+')[0] + +valuestring.split('+')[1];
                }
                else if (valuestring.indexOf('-') > -1) {
                    returnvalue = +valuestring.split('-')[0] - +valuestring.split('-')[1];
                }
                else if (valuestring.indexOf('*') > -1) {
                    returnvalue = +valuestring.split('*')[0] * +valuestring.split('*')[1];
                }
                else if (valuestring.indexOf('/') > -1) {
                    returnvalue = +valuestring.split('/')[0] / +valuestring.split('/')[1];
                }
                else if (valuestring.indexOf('min') > -1) {
                    returnvalue = lodash_1.default.min([+valuestring.split('min')[0], +valuestring.split('min')[1]]) || 0;
                }
                else if (valuestring.indexOf('max') > -1) {
                    returnvalue = lodash_1.default.max([+valuestring.split('max')[0], +valuestring.split('max')[1]]) || 0;
                }
                else if (valuestring.indexOf('mean') > -1) {
                    returnvalue = lodash_1.default.mean([+valuestring.split('avg')[0], +valuestring.split('avg')[1]]) || 0;
                }
                else {
                    returnvalue = +valuestring;
                }
                return Math.round(+returnvalue);
            });
            exports_1("parseMathExpression", parseMathExpression = function (expression, index) {
                var valuestring = expression.replace(/\_/g, '').split(',')[index];
                return +parseMath(valuestring);
            });
            exports_1("getColor", getColor = function (expression, index) {
                var returnValue = (expression || '').split(',').length > index ? " style=\"color:" + normalizeColor(expression.replace(/\_/g, '').split(',')[index]) + "\" " : '';
                return returnValue;
            });
            exports_1("replaceTokens", replaceTokens = function (value) {
                if (!value) {
                    return value;
                }
                value = value + '';
                value = value
                    .split(' ')
                    .map(function (a) {
                    if (a.startsWith('_fa-') && a.endsWith('_')) {
                        var returnvalue = '';
                        var icon = a.replace(/\_/g, '').split(',')[0];
                        var color = getColor(a, 1);
                        var repeatCount = a.split(',').length >= 3 ? parseMathExpression(a, 2) : 1;
                        returnvalue = ("<i class=\"fa " + icon + "\" " + color + "></i> ").repeat(repeatCount);
                        if (a.split(',').length >= 4) {
                            var maxColor = getColor(a, 3);
                            var maxLength = a.split(',').length >= 5 ? parseMathExpression(a, 4) : 0;
                            returnvalue += ("<i class=\"fa " + icon + "\" " + maxColor + "></i> ").repeat(lodash_1.default.max([maxLength - repeatCount, 0]) || 0);
                        }
                        return returnvalue;
                    }
                    else if (a.startsWith('_img-') && a.endsWith('_')) {
                        a = a.slice(0, -1);
                        var imgUrl = a.replace('_img-', '').split(',')[0];
                        var imgWidth = a.split(',').length > 1 ? a.replace('_img-', '').split(',')[1] : '20px';
                        var imgHeight = a.split(',').length > 2 ? a.replace('_img-', '').split(',')[2] : '20px';
                        var repeatCount = a.split(',').length > 3 ? +a.replace('_img-', '').split(',')[3] : 1;
                        a = ("<img width=\"" + imgWidth + "\" height=\"" + imgHeight + "\" src=\"" + imgUrl + "\"/>").repeat(repeatCount);
                    }
                    return a;
                })
                    .join(' ');
                return value;
            });
            exports_1("getActualNameWithoutTokens", getActualNameWithoutTokens = function (value) {
                if (!value) {
                    return value + '';
                }
                value = value + '';
                return value
                    .split(' ')
                    .map(function (a) {
                    if (a.startsWith('_fa-') && a.endsWith('_')) {
                        a = "";
                    }
                    else if (a.startsWith('_img-') && a.endsWith('_')) {
                        a = "";
                    }
                    return a;
                })
                    .join(' ');
            });
            exports_1("getItemBasedOnThreshold", getItemBasedOnThreshold = function (thresholds, ranges, value, defaultValue) {
                var c = defaultValue;
                if (thresholds && ranges && typeof value === 'number' && thresholds.length + 1 <= ranges.length) {
                    ranges = lodash_1.default.dropRight(ranges, ranges.length - thresholds.length - 1);
                    if (ranges[ranges.length - 1] === '') {
                        ranges[ranges.length - 1] = defaultValue;
                    }
                    for (var i = thresholds.length; i > 0; i--) {
                        if (value >= thresholds[i - 1]) {
                            return ranges[i];
                        }
                    }
                    return lodash_1.default.first(ranges) || '';
                }
                return c;
            });
            exports_1("getMetricNameFromTaggedAlias", getMetricNameFromTaggedAlias = function (target) {
                target = target.trim();
                var _metricname = target;
                if (target.indexOf('{') > -1 && target.indexOf('}') > -1 && target[target.length - 1] === '}') {
                    _metricname = target.split('{')[0].trim();
                }
                else {
                    _metricname = target;
                }
                return _metricname;
            });
            exports_1("getLablesFromTaggedAlias", getLablesFromTaggedAlias = function (target, label) {
                var _tags = [];
                target = target.trim();
                var tagsstring = target.replace(label, '').trim();
                if (tagsstring.startsWith('{') && tagsstring.endsWith('}')) {
                    var parsePrometheusLabels = function (labels) {
                        var labelsByKey = {};
                        labels.replace(/\b(\w+)(!?=~?)"([^"\n]*?)"/g, function (__, key, operator, value) {
                            if (!operator) {
                                console.log(operator);
                            }
                            labelsByKey[key] = value;
                            return '';
                        });
                        return labelsByKey;
                    };
                    lodash_1.default.each(parsePrometheusLabels(tagsstring), function (k, v) {
                        _tags.push({ tag: v, value: k });
                    });
                    if (tagsstring.indexOf(':') > -1 && _tags.length === 0) {
                        var label_values = tagsstring
                            .slice(1)
                            .trim()
                            .slice(0, -1)
                            .trim() || '';
                        _tags = label_values
                            .split(',')
                            .map(function (item) { return (item || '').trim(); })
                            .filter(function (item) { return item && item.indexOf(':') > -1; })
                            .map(function (item) {
                            if (item.split(':').length === 2) {
                                var ret = {};
                                ret.tag = item.split(':')[0].trim();
                                ret.value = item.split(':')[1].trim();
                                return ret;
                            }
                            else {
                                return null;
                            }
                        })
                            .filter(function (item) { return item; });
                    }
                }
                return _tags;
            });
            exports_1("replace_tags_from_field", replace_tags_from_field = function (field, tags) {
                if (tags && tags.length > 0) {
                    field = tags.reduce(function (r, it) {
                        return r.replace(new RegExp('{{' + it.tag.trim() + '}}', 'g'), it.value).replace(/\"/g, '');
                    }, field);
                }
                return field;
            });
            exports_1("getSeriesValue", getSeriesValue = function (series, statType) {
                var value = NaN;
                statType = (statType || '').toLowerCase();
                if (series) {
                    if (statType === 'last_time' && series.datapoints && series.datapoints.length > 0) {
                        if (lodash_1.default.last(series.datapoints)) {
                            value = lodash_1.default.last(series.datapoints)[1];
                        }
                    }
                    else if (statType === 'last_time_nonnull') {
                        var non_null_data = series.datapoints.filter(function (s) { return s[0]; });
                        if (lodash_1.default.last(non_null_data) && lodash_1.default.last(non_null_data)[1]) {
                            value = lodash_1.default.last(non_null_data)[1];
                        }
                    }
                    else if (series.stats) {
                        value = series.stats[statType] !== undefined ? series.stats[statType] : null;
                    }
                }
                return value;
            });
            exports_1("getCurrentTimeStamp", getCurrentTimeStamp = function (dataPoints) {
                var currentTimeStamp = new Date();
                if (dataPoints && dataPoints.length > 0 && lodash_1.default.last(dataPoints).length === 2) {
                    currentTimeStamp = new Date(lodash_1.default.last(dataPoints)[1]);
                }
                return currentTimeStamp;
            });
            exports_1("replaceDelimitedColumns", replaceDelimitedColumns = function (inputstring, seriesName, delimiter, row_col_wrapper) {
                var outputString = seriesName.split(delimiter || '.').reduce(function (r, it, i) {
                    return r.replace(new RegExp(row_col_wrapper + i + row_col_wrapper, 'g'), it);
                }, inputstring);
                return outputString;
            });
            exports_1("getRowName", getRowName = function (row_name, delimiter, row_col_wrapper, seriesName, _metricname, _tags) {
                if (delimiter.toLowerCase() === 'tag') {
                    row_name = row_name.replace(new RegExp('{{metric_name}}', 'g'), _metricname);
                    row_name = replace_tags_from_field(row_name, _tags);
                }
                else {
                    row_name = replaceDelimitedColumns(row_name, seriesName, delimiter, row_col_wrapper);
                    if (seriesName.split(delimiter || '.').length === 1) {
                        row_name = seriesName;
                    }
                }
                return row_name.replace(new RegExp('_series_', 'g'), seriesName.toString());
            });
            exports_1("getColName", getColName = function (col_name, delimiter, row_col_wrapper, seriesName, row_name, _metricname, _tags) {
                if (delimiter.toLowerCase() === 'tag') {
                    col_name = col_name.replace(new RegExp('{{metric_name}}', 'g'), _metricname);
                    row_name = replace_tags_from_field(col_name, _tags);
                }
                else {
                    col_name = replaceDelimitedColumns(col_name, seriesName, delimiter, row_col_wrapper);
                    if (seriesName.split(delimiter || '.').length === 1 || row_name === seriesName) {
                        col_name = col_name || 'Value';
                    }
                }
                return col_name.replace(new RegExp('_series_', 'g'), seriesName.toString());
            });
            exports_1("getDisplayValueTemplate", getDisplayValueTemplate = function (value, pattern, seriesName, row_col_wrapper, thresholds) {
                var template = '_value_';
                if (lodash_1.default.isNaN(value) || value === null) {
                    template = pattern.null_value || 'No data';
                    if (pattern.null_value === '') {
                        template = '';
                    }
                }
                else {
                    template = pattern.displayTemplate || template;
                    if (pattern.enable_transform) {
                        var transform_values = pattern.transform_values.split('|');
                        template = getItemBasedOnThreshold(thresholds, transform_values, value, template);
                    }
                    if (pattern.enable_transform_overrides && pattern.transform_values_overrides !== '') {
                        var _transform_values_overrides = pattern.transform_values_overrides
                            .split('|')
                            .filter(function (con) { return con.indexOf('->'); })
                            .map(function (con) { return con.split('->'); })
                            .filter(function (con) { return +con[0] === value; })
                            .map(function (con) { return con[1]; });
                        if (_transform_values_overrides.length > 0 && _transform_values_overrides[0] !== '') {
                            template = ('' + _transform_values_overrides[0]).trim();
                        }
                    }
                    if (pattern.enable_transform || pattern.enable_transform_overrides) {
                        template = replaceDelimitedColumns(template, seriesName, pattern.delimiter, row_col_wrapper);
                    }
                }
                return template;
            });
            exports_1("doesValueNeedsToHide", doesValueNeedsToHide = function (value, filter) {
                var hidden = false;
                if ((value || value === 0) && filter && (filter.value_below !== '' || filter.value_above !== '')) {
                    if (filter.value_below !== '' && value < +filter.value_below) {
                        hidden = true;
                    }
                    if (filter.value_above !== '' && value > +filter.value_above) {
                        hidden = true;
                    }
                }
                return hidden;
            });
            exports_1("supplementUndefinedVals", supplementUndefinedVals = function (inputdata, patterns, defaultPattern, seriesOptions, scopedVars, templateSrv, timeSrv) {
                var supplementSeries = [];
                try {
                    var rows_found = lodash_1.default.uniq(lodash_1.default.map(inputdata, function (d) { return d.row_name; }));
                    var patterns_found_1 = lodash_1.default.uniq(lodash_1.default.map(inputdata, function (d) { return d.pattern; }));
                    lodash_1.default.each(rows_found, function (row_name) {
                        lodash_1.default.each(patterns_found_1, function (pattern) {
                            var matched_items = lodash_1.default.filter(inputdata, function (o) {
                                return o.row_name === row_name && o.pattern.pattern === pattern.pattern;
                            });
                            if (!matched_items || matched_items.length === 0) {
                                try {
                                    supplementSeries.push(new BoomSeries_1.BoomSeries({
                                        datapoints: [],
                                        target: "" + row_name + pattern.delimiter + " " + pattern.pattern
                                    }, defaultPattern, patterns, seriesOptions, scopedVars, templateSrv, timeSrv));
                                }
                                catch (e) {
                                    console.log('error in undefined creation :(');
                                    console.log(e.message);
                                }
                            }
                        });
                    });
                }
                catch (e) {
                    console.log("error in supplementUndefinedVals: " + e.message);
                }
                return supplementSeries;
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbVV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9ib29tL0Jvb21VdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztZQUtBLDRCQUFhLGNBQWMsR0FBRyxVQUFVLEtBQWE7Z0JBQ25ELElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLE9BQU8sRUFBRTtvQkFDbkMsT0FBTyx5QkFBeUIsQ0FBQztpQkFDbEM7cUJBQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUSxFQUFFO29CQUMzQyxPQUFPLDBCQUEwQixDQUFDO2lCQUNuQztxQkFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxLQUFLLEVBQUU7b0JBQ3hDLE9BQU8sd0JBQXdCLENBQUM7aUJBQ2pDO3FCQUFNO29CQUNMLE9BQU8sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNyQjtZQUNILENBQUMsRUFBQztZQUNGLHVCQUFhLFNBQVMsR0FBRyxVQUFVLFdBQW1CO2dCQUNwRCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFDakMsV0FBVyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZFO3FCQUFNLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFDeEMsV0FBVyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FB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QUFDO2lDQUNIO2dDQUFDLE9BQU8sQ0FBQyxFQUFFO29DQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztvQ0FDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxDQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7aUNBQ25DOzZCQUNGO3dCQUNILENBQUMsQ0FBQyxDQUFDO29CQUNMLENBQUMsQ0FBQyxDQUFDO2lCQUNKO2dCQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUNBQXNDLENBQVcsQ0FBQyxPQUFTLENBQUMsQ0FBQztpQkFDMUU7Z0JBRUQsT0FBTyxnQkFBZ0IsQ0FBQztZQUMxQixDQUFDLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQge0lCb29tUGF0dGVybn0gZnJvbSAnLi9Cb29tLmludGVyZmFjZSc7XHJcbmltcG9ydCB7Qm9vbVNlcmllc30gZnJvbSBcIi4vQm9vbVNlcmllc1wiO1xyXG5pbXBvcnQge0Jvb21QYXR0ZXJufSBmcm9tIFwiLi9Cb29tUGF0dGVyblwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUNvbG9yID0gZnVuY3Rpb24gKGNvbG9yOiBzdHJpbmcpIHtcclxuICBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PT0gJ2dyZWVuJykge1xyXG4gICAgcmV0dXJuICdyZ2JhKDUwLCAxNzIsIDQ1LCAwLjk3KSc7XHJcbiAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09PSAnb3JhbmdlJykge1xyXG4gICAgcmV0dXJuICdyZ2JhKDIzNywgMTI5LCA0MCwgMC44OSknO1xyXG4gIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PT0gJ3JlZCcpIHtcclxuICAgIHJldHVybiAncmdiYSgyNDUsIDU0LCA1NCwgMC45KSc7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBjb2xvci50cmltKCk7XHJcbiAgfVxyXG59O1xyXG5leHBvcnQgY29uc3QgcGFyc2VNYXRoID0gZnVuY3Rpb24gKHZhbHVlc3RyaW5nOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gIGxldCByZXR1cm52YWx1ZSA9IDA7XHJcbiAgaWYgKHZhbHVlc3RyaW5nLmluZGV4T2YoJysnKSA+IC0xKSB7XHJcbiAgICByZXR1cm52YWx1ZSA9ICt2YWx1ZXN0cmluZy5zcGxpdCgnKycpWzBdICsgK3ZhbHVlc3RyaW5nLnNwbGl0KCcrJylbMV07XHJcbiAgfSBlbHNlIGlmICh2YWx1ZXN0cmluZy5pbmRleE9mKCctJykgPiAtMSkge1xyXG4gICAgcmV0dXJudmFsdWUgPSArdmFsdWVzdHJpbmcuc3BsaXQoJy0nKVswXSAtICt2YWx1ZXN0cmluZy5zcGxpdCgnLScpWzFdO1xyXG4gIH0gZWxzZSBpZiAodmFsdWVzdHJpbmcuaW5kZXhPZignKicpID4gLTEpIHtcclxuICAgIHJldHVybnZhbHVlID0gK3ZhbHVlc3RyaW5nLnNwbGl0KCcqJylbMF0gKiArdmFsdWVzdHJpbmcuc3BsaXQoJyonKVsxXTtcclxuICB9IGVsc2UgaWYgKHZhbHVlc3RyaW5nLmluZGV4T2YoJy8nKSA+IC0xKSB7XHJcbiAgICByZXR1cm52YWx1ZSA9ICt2YWx1ZXN0cmluZy5zcGxpdCgnLycpWzBdIC8gK3ZhbHVlc3RyaW5nLnNwbGl0KCcvJylbMV07XHJcbiAgfSBlbHNlIGlmICh2YWx1ZXN0cmluZy5pbmRleE9mKCdtaW4nKSA+IC0xKSB7XHJcbiAgICByZXR1cm52YWx1ZSA9IF8ubWluKFsrdmFsdWVzdHJpbmcuc3BsaXQoJ21pbicpWzBdLCArdmFsdWVzdHJpbmcuc3BsaXQoJ21pbicpWzFdXSkgfHwgMDtcclxuICB9IGVsc2UgaWYgKHZhbHVlc3RyaW5nLmluZGV4T2YoJ21heCcpID4gLTEpIHtcclxuICAgIHJldHVybnZhbHVlID0gXy5tYXgoWyt2YWx1ZXN0cmluZy5zcGxpdCgnbWF4JylbMF0sICt2YWx1ZXN0cmluZy5zcGxpdCgnbWF4JylbMV1dKSB8fCAwO1xyXG4gIH0gZWxzZSBpZiAodmFsdWVzdHJpbmcuaW5kZXhPZignbWVhbicpID4gLTEpIHtcclxuICAgIHJldHVybnZhbHVlID0gXy5tZWFuKFsrdmFsdWVzdHJpbmcuc3BsaXQoJ2F2ZycpWzBdLCArdmFsdWVzdHJpbmcuc3BsaXQoJ2F2ZycpWzFdXSkgfHwgMDtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJudmFsdWUgPSArdmFsdWVzdHJpbmc7XHJcbiAgfVxyXG4gIHJldHVybiBNYXRoLnJvdW5kKCtyZXR1cm52YWx1ZSk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBwYXJzZU1hdGhFeHByZXNzaW9uID0gZnVuY3Rpb24gKGV4cHJlc3Npb246IHN0cmluZywgaW5kZXg6IG51bWJlcik6IG51bWJlciB7XHJcbiAgbGV0IHZhbHVlc3RyaW5nID0gZXhwcmVzc2lvbi5yZXBsYWNlKC9cXF8vZywgJycpLnNwbGl0KCcsJylbaW5kZXhdO1xyXG4gIHJldHVybiArcGFyc2VNYXRoKHZhbHVlc3RyaW5nKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldENvbG9yID0gZnVuY3Rpb24gKGV4cHJlc3Npb246IHN0cmluZywgaW5kZXg6IG51bWJlcikge1xyXG4gIGxldCByZXR1cm5WYWx1ZSA9XHJcbiAgICAoZXhwcmVzc2lvbiB8fCAnJykuc3BsaXQoJywnKS5sZW5ndGggPiBpbmRleCA/IGAgc3R5bGU9XCJjb2xvcjoke25vcm1hbGl6ZUNvbG9yKGV4cHJlc3Npb24ucmVwbGFjZSgvXFxfL2csICcnKS5zcGxpdCgnLCcpW2luZGV4XSl9XCIgYCA6ICcnO1xyXG4gIHJldHVybiByZXR1cm5WYWx1ZTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHJlcGxhY2VUb2tlbnMgPSBmdW5jdGlvbiAodmFsdWU6IHN0cmluZykge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcbiAgdmFsdWUgPSB2YWx1ZSArICcnO1xyXG4gIHZhbHVlID0gdmFsdWVcclxuICAgIC5zcGxpdCgnICcpXHJcbiAgICAubWFwKGEgPT4ge1xyXG4gICAgICBpZiAoYS5zdGFydHNXaXRoKCdfZmEtJykgJiYgYS5lbmRzV2l0aCgnXycpKSB7XHJcbiAgICAgICAgbGV0IHJldHVybnZhbHVlID0gJyc7XHJcbiAgICAgICAgbGV0IGljb24gPSBhLnJlcGxhY2UoL1xcXy9nLCAnJykuc3BsaXQoJywnKVswXTtcclxuICAgICAgICBsZXQgY29sb3IgPSBnZXRDb2xvcihhLCAxKTtcclxuICAgICAgICBsZXQgcmVwZWF0Q291bnQgPSBhLnNwbGl0KCcsJykubGVuZ3RoID49IDMgPyBwYXJzZU1hdGhFeHByZXNzaW9uKGEsIDIpIDogMTtcclxuICAgICAgICByZXR1cm52YWx1ZSA9IGA8aSBjbGFzcz1cImZhICR7aWNvbn1cIiAke2NvbG9yfT48L2k+IGAucmVwZWF0KHJlcGVhdENvdW50KTtcclxuICAgICAgICBpZiAoYS5zcGxpdCgnLCcpLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICBsZXQgbWF4Q29sb3IgPSBnZXRDb2xvcihhLCAzKTtcclxuICAgICAgICAgIGxldCBtYXhMZW5ndGggPSBhLnNwbGl0KCcsJykubGVuZ3RoID49IDUgPyBwYXJzZU1hdGhFeHByZXNzaW9uKGEsIDQpIDogMDtcclxuICAgICAgICAgIHJldHVybnZhbHVlICs9IGA8aSBjbGFzcz1cImZhICR7aWNvbn1cIiAke21heENvbG9yfT48L2k+IGAucmVwZWF0KF8ubWF4KFttYXhMZW5ndGggLSByZXBlYXRDb3VudCwgMF0pIHx8IDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0dXJudmFsdWU7XHJcbiAgICAgIH0gZWxzZSBpZiAoYS5zdGFydHNXaXRoKCdfaW1nLScpICYmIGEuZW5kc1dpdGgoJ18nKSkge1xyXG4gICAgICAgIGEgPSBhLnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBsZXQgaW1nVXJsID0gYS5yZXBsYWNlKCdfaW1nLScsICcnKS5zcGxpdCgnLCcpWzBdO1xyXG4gICAgICAgIGxldCBpbWdXaWR0aCA9IGEuc3BsaXQoJywnKS5sZW5ndGggPiAxID8gYS5yZXBsYWNlKCdfaW1nLScsICcnKS5zcGxpdCgnLCcpWzFdIDogJzIwcHgnO1xyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSBhLnNwbGl0KCcsJykubGVuZ3RoID4gMiA/IGEucmVwbGFjZSgnX2ltZy0nLCAnJykuc3BsaXQoJywnKVsyXSA6ICcyMHB4JztcclxuICAgICAgICBsZXQgcmVwZWF0Q291bnQgPSBhLnNwbGl0KCcsJykubGVuZ3RoID4gMyA/ICthLnJlcGxhY2UoJ19pbWctJywgJycpLnNwbGl0KCcsJylbM10gOiAxO1xyXG4gICAgICAgIGEgPSBgPGltZyB3aWR0aD1cIiR7aW1nV2lkdGh9XCIgaGVpZ2h0PVwiJHtpbWdIZWlnaHR9XCIgc3JjPVwiJHtpbWdVcmx9XCIvPmAucmVwZWF0KHJlcGVhdENvdW50KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYTtcclxuICAgIH0pXHJcbiAgICAuam9pbignICcpO1xyXG4gIHJldHVybiB2YWx1ZTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldEFjdHVhbE5hbWVXaXRob3V0VG9rZW5zID0gZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpIHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUgKyAnJztcclxuICB9XHJcbiAgdmFsdWUgPSB2YWx1ZSArICcnO1xyXG4gIHJldHVybiB2YWx1ZVxyXG4gICAgLnNwbGl0KCcgJylcclxuICAgIC5tYXAoYSA9PiB7XHJcbiAgICAgIGlmIChhLnN0YXJ0c1dpdGgoJ19mYS0nKSAmJiBhLmVuZHNXaXRoKCdfJykpIHtcclxuICAgICAgICBhID0gYGA7XHJcbiAgICAgIH0gZWxzZSBpZiAoYS5zdGFydHNXaXRoKCdfaW1nLScpICYmIGEuZW5kc1dpdGgoJ18nKSkge1xyXG4gICAgICAgIGEgPSBgYDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYTtcclxuICAgIH0pXHJcbiAgICAuam9pbignICcpO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZ2V0SXRlbUJhc2VkT25UaHJlc2hvbGQgPSBmdW5jdGlvbiAodGhyZXNob2xkczogYW55W10sIHJhbmdlczogYW55LCB2YWx1ZTogbnVtYmVyLCBkZWZhdWx0VmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgbGV0IGMgPSBkZWZhdWx0VmFsdWU7XHJcbiAgaWYgKHRocmVzaG9sZHMgJiYgcmFuZ2VzICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgdGhyZXNob2xkcy5sZW5ndGggKyAxIDw9IHJhbmdlcy5sZW5ndGgpIHtcclxuICAgIHJhbmdlcyA9IF8uZHJvcFJpZ2h0KHJhbmdlcywgcmFuZ2VzLmxlbmd0aCAtIHRocmVzaG9sZHMubGVuZ3RoIC0gMSk7XHJcbiAgICBpZiAocmFuZ2VzW3Jhbmdlcy5sZW5ndGggLSAxXSA9PT0gJycpIHtcclxuICAgICAgcmFuZ2VzW3Jhbmdlcy5sZW5ndGggLSAxXSA9IGRlZmF1bHRWYWx1ZTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSB0aHJlc2hvbGRzLmxlbmd0aDsgaSA+IDA7IGktLSkge1xyXG4gICAgICBpZiAodmFsdWUgPj0gdGhyZXNob2xkc1tpIC0gMV0pIHtcclxuICAgICAgICByZXR1cm4gcmFuZ2VzW2ldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gXy5maXJzdChyYW5nZXMpIHx8ICcnO1xyXG4gIH1cclxuICByZXR1cm4gYztcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldE1ldHJpY05hbWVGcm9tVGFnZ2VkQWxpYXMgPSBmdW5jdGlvbiAodGFyZ2V0KTogc3RyaW5nIHtcclxuICB0YXJnZXQgPSB0YXJnZXQudHJpbSgpO1xyXG4gIGxldCBfbWV0cmljbmFtZSA9IHRhcmdldDtcclxuICBpZiAodGFyZ2V0LmluZGV4T2YoJ3snKSA+IC0xICYmIHRhcmdldC5pbmRleE9mKCd9JykgPiAtMSAmJiB0YXJnZXRbdGFyZ2V0Lmxlbmd0aCAtIDFdID09PSAnfScpIHtcclxuICAgIF9tZXRyaWNuYW1lID0gdGFyZ2V0LnNwbGl0KCd7JylbMF0udHJpbSgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBfbWV0cmljbmFtZSA9IHRhcmdldDtcclxuICB9XHJcbiAgcmV0dXJuIF9tZXRyaWNuYW1lO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZ2V0TGFibGVzRnJvbVRhZ2dlZEFsaWFzID0gZnVuY3Rpb24gKHRhcmdldCwgbGFiZWwpOiBhbnlbXSB7XHJcbiAgbGV0IF90YWdzOiBhbnlbXSA9IFtdO1xyXG4gIHRhcmdldCA9IHRhcmdldC50cmltKCk7XHJcbiAgbGV0IHRhZ3NzdHJpbmcgPSB0YXJnZXQucmVwbGFjZShsYWJlbCwgJycpLnRyaW0oKTtcclxuICBpZiAodGFnc3N0cmluZy5zdGFydHNXaXRoKCd7JykgJiYgdGFnc3N0cmluZy5lbmRzV2l0aCgnfScpKSB7XHJcbiAgICAvLyBTbmlwcGV0IGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2dyYWZhbmEvZ3JhZmFuYS9ibG9iLzNmMTUxNzA5MTRjMzE4OWVlNzgzNWYwYjE5ZmY1MDBkYjExM2FmNzMvcGFja2FnZXMvZ3JhZmFuYS1kYXRhL3NyYy91dGlscy9sYWJlbHMudHNcclxuICAgIGNvbnN0IHBhcnNlUHJvbWV0aGV1c0xhYmVscyA9IGZ1bmN0aW9uIChsYWJlbHM6IHN0cmluZykge1xyXG4gICAgICBjb25zdCBsYWJlbHNCeUtleTogYW55ID0ge307XHJcbiAgICAgIGxhYmVscy5yZXBsYWNlKC9cXGIoXFx3KykoIT89fj8pXCIoW15cIlxcbl0qPylcIi9nLCAoX18sIGtleSwgb3BlcmF0b3IsIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgaWYgKCFvcGVyYXRvcikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2cob3BlcmF0b3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYWJlbHNCeUtleVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGxhYmVsc0J5S2V5O1xyXG4gICAgfTtcclxuICAgIF8uZWFjaChwYXJzZVByb21ldGhldXNMYWJlbHModGFnc3N0cmluZyksIChrOiBzdHJpbmcsIHY6IHN0cmluZykgPT4ge1xyXG4gICAgICBfdGFncy5wdXNoKHsgdGFnOiB2LCB2YWx1ZTogayB9KTtcclxuICAgIH0pO1xyXG4gICAgaWYgKHRhZ3NzdHJpbmcuaW5kZXhPZignOicpID4gLTEgJiYgX3RhZ3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGxldCBsYWJlbF92YWx1ZXMgPVxyXG4gICAgICAgIHRhZ3NzdHJpbmdcclxuICAgICAgICAgIC5zbGljZSgxKVxyXG4gICAgICAgICAgLnRyaW0oKVxyXG4gICAgICAgICAgLnNsaWNlKDAsIC0xKVxyXG4gICAgICAgICAgLnRyaW0oKSB8fCAnJztcclxuICAgICAgX3RhZ3MgPSBsYWJlbF92YWx1ZXNcclxuICAgICAgICAuc3BsaXQoJywnKVxyXG4gICAgICAgIC5tYXAoaXRlbSA9PiAoaXRlbSB8fCAnJykudHJpbSgpKVxyXG4gICAgICAgIC5maWx0ZXIoaXRlbSA9PiBpdGVtICYmIGl0ZW0uaW5kZXhPZignOicpID4gLTEpXHJcbiAgICAgICAgLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtLnNwbGl0KCc6JykubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgIGxldCByZXQ6IGFueSA9IHt9O1xyXG4gICAgICAgICAgICByZXQudGFnID0gaXRlbS5zcGxpdCgnOicpWzBdLnRyaW0oKTtcclxuICAgICAgICAgICAgcmV0LnZhbHVlID0gaXRlbS5zcGxpdCgnOicpWzFdLnRyaW0oKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZpbHRlcihpdGVtID0+IGl0ZW0pO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gX3RhZ3M7XHJcbn07XHJcbmV4cG9ydCBjb25zdCByZXBsYWNlX3RhZ3NfZnJvbV9maWVsZCA9IGZ1bmN0aW9uIChmaWVsZDogc3RyaW5nLCB0YWdzOiBhbnlbXSk6IHN0cmluZyB7XHJcbiAgaWYgKHRhZ3MgJiYgdGFncy5sZW5ndGggPiAwKSB7XHJcbiAgICBmaWVsZCA9IHRhZ3MucmVkdWNlKChyLCBpdCkgPT4ge1xyXG4gICAgICByZXR1cm4gci5yZXBsYWNlKG5ldyBSZWdFeHAoJ3t7JyArIGl0LnRhZy50cmltKCkgKyAnfX0nLCAnZycpLCBpdC52YWx1ZSkucmVwbGFjZSgvXFxcIi9nLCAnJyk7XHJcbiAgICB9LCBmaWVsZCk7XHJcbiAgfVxyXG4gIHJldHVybiBmaWVsZDtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldFNlcmllc1ZhbHVlID0gZnVuY3Rpb24gKHNlcmllczogYW55LCBzdGF0VHlwZTogc3RyaW5nKTogbnVtYmVyIHtcclxuICBsZXQgdmFsdWUgPSBOYU47XHJcbiAgc3RhdFR5cGUgPSAoc3RhdFR5cGUgfHwgJycpLnRvTG93ZXJDYXNlKCk7XHJcbiAgaWYgKHNlcmllcykge1xyXG4gICAgaWYgKHN0YXRUeXBlID09PSAnbGFzdF90aW1lJyAmJiBzZXJpZXMuZGF0YXBvaW50cyAmJiBzZXJpZXMuZGF0YXBvaW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGlmIChfLmxhc3Qoc2VyaWVzLmRhdGFwb2ludHMpKSB7XHJcbiAgICAgICAgdmFsdWUgPSBfLmxhc3Qoc2VyaWVzLmRhdGFwb2ludHMpWzFdO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHN0YXRUeXBlID09PSAnbGFzdF90aW1lX25vbm51bGwnKSB7XHJcbiAgICAgIGxldCBub25fbnVsbF9kYXRhID0gc2VyaWVzLmRhdGFwb2ludHMuZmlsdGVyKHMgPT4gc1swXSk7XHJcbiAgICAgIGlmIChfLmxhc3Qobm9uX251bGxfZGF0YSkgJiYgXy5sYXN0KG5vbl9udWxsX2RhdGEpWzFdKSB7XHJcbiAgICAgICAgdmFsdWUgPSBfLmxhc3Qobm9uX251bGxfZGF0YSlbMV07XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoc2VyaWVzLnN0YXRzKSB7XHJcbiAgICAgIHZhbHVlID0gc2VyaWVzLnN0YXRzW3N0YXRUeXBlXSAhPT0gdW5kZWZpbmVkID8gc2VyaWVzLnN0YXRzW3N0YXRUeXBlXSA6IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIGNvbnNvbGUubG9nKHZhbHVlKTtcclxuICAvLyBjb25zb2xlLmxvZyh0eXBlb2YgdmFsdWUpO1xyXG4gIHJldHVybiB2YWx1ZTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldEN1cnJlbnRUaW1lU3RhbXAgPSBmdW5jdGlvbiAoZGF0YVBvaW50czogYW55W10pOiBEYXRlIHtcclxuICBsZXQgY3VycmVudFRpbWVTdGFtcCA9IG5ldyBEYXRlKCk7XHJcbiAgaWYgKGRhdGFQb2ludHMgJiYgZGF0YVBvaW50cy5sZW5ndGggPiAwICYmIF8ubGFzdChkYXRhUG9pbnRzKS5sZW5ndGggPT09IDIpIHtcclxuICAgIGN1cnJlbnRUaW1lU3RhbXAgPSBuZXcgRGF0ZShfLmxhc3QoZGF0YVBvaW50cylbMV0pO1xyXG4gIH1cclxuICByZXR1cm4gY3VycmVudFRpbWVTdGFtcDtcclxufTtcclxuZXhwb3J0IGNvbnN0IHJlcGxhY2VEZWxpbWl0ZWRDb2x1bW5zID0gZnVuY3Rpb24gKGlucHV0c3RyaW5nOiBzdHJpbmcsIHNlcmllc05hbWU6IHN0cmluZywgZGVsaW1pdGVyOiBzdHJpbmcsIHJvd19jb2xfd3JhcHBlcjogc3RyaW5nKTogc3RyaW5nIHtcclxuICBsZXQgb3V0cHV0U3RyaW5nID0gc2VyaWVzTmFtZS5zcGxpdChkZWxpbWl0ZXIgfHwgJy4nKS5yZWR1Y2UoKHIsIGl0LCBpKSA9PiB7XHJcbiAgICByZXR1cm4gci5yZXBsYWNlKG5ldyBSZWdFeHAocm93X2NvbF93cmFwcGVyICsgaSArIHJvd19jb2xfd3JhcHBlciwgJ2cnKSwgaXQpO1xyXG4gIH0sIGlucHV0c3RyaW5nKTtcclxuICByZXR1cm4gb3V0cHV0U3RyaW5nO1xyXG59O1xyXG5leHBvcnQgY29uc3QgZ2V0Um93TmFtZSA9IGZ1bmN0aW9uIChcclxuICByb3dfbmFtZTogc3RyaW5nLFxyXG4gIGRlbGltaXRlcjogc3RyaW5nLFxyXG4gIHJvd19jb2xfd3JhcHBlcjogc3RyaW5nLFxyXG4gIHNlcmllc05hbWU6IHN0cmluZyxcclxuICBfbWV0cmljbmFtZTogc3RyaW5nLFxyXG4gIF90YWdzOiBhbnlbXVxyXG4pOiBzdHJpbmcge1xyXG4gIGlmIChkZWxpbWl0ZXIudG9Mb3dlckNhc2UoKSA9PT0gJ3RhZycpIHtcclxuICAgIHJvd19uYW1lID0gcm93X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCd7e21ldHJpY19uYW1lfX0nLCAnZycpLCBfbWV0cmljbmFtZSk7XHJcbiAgICByb3dfbmFtZSA9IHJlcGxhY2VfdGFnc19mcm9tX2ZpZWxkKHJvd19uYW1lLCBfdGFncyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJvd19uYW1lID0gcmVwbGFjZURlbGltaXRlZENvbHVtbnMocm93X25hbWUsIHNlcmllc05hbWUsIGRlbGltaXRlciwgcm93X2NvbF93cmFwcGVyKTtcclxuICAgIGlmIChzZXJpZXNOYW1lLnNwbGl0KGRlbGltaXRlciB8fCAnLicpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICByb3dfbmFtZSA9IHNlcmllc05hbWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiByb3dfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ19zZXJpZXNfJywgJ2cnKSwgc2VyaWVzTmFtZS50b1N0cmluZygpKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldENvbE5hbWUgPSBmdW5jdGlvbiAoXHJcbiAgY29sX25hbWU6IHN0cmluZyxcclxuICBkZWxpbWl0ZXI6IHN0cmluZyxcclxuICByb3dfY29sX3dyYXBwZXI6IHN0cmluZyxcclxuICBzZXJpZXNOYW1lOiBzdHJpbmcsXHJcbiAgcm93X25hbWU6IHN0cmluZyxcclxuICBfbWV0cmljbmFtZTogc3RyaW5nLFxyXG4gIF90YWdzOiBhbnlbXVxyXG4pOiBzdHJpbmcge1xyXG4gIGlmIChkZWxpbWl0ZXIudG9Mb3dlckNhc2UoKSA9PT0gJ3RhZycpIHtcclxuICAgIGNvbF9uYW1lID0gY29sX25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCd7e21ldHJpY19uYW1lfX0nLCAnZycpLCBfbWV0cmljbmFtZSk7XHJcbiAgICByb3dfbmFtZSA9IHJlcGxhY2VfdGFnc19mcm9tX2ZpZWxkKGNvbF9uYW1lLCBfdGFncyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbF9uYW1lID0gcmVwbGFjZURlbGltaXRlZENvbHVtbnMoY29sX25hbWUsIHNlcmllc05hbWUsIGRlbGltaXRlciwgcm93X2NvbF93cmFwcGVyKTtcclxuICAgIGlmIChzZXJpZXNOYW1lLnNwbGl0KGRlbGltaXRlciB8fCAnLicpLmxlbmd0aCA9PT0gMSB8fCByb3dfbmFtZSA9PT0gc2VyaWVzTmFtZSkge1xyXG4gICAgICBjb2xfbmFtZSA9IGNvbF9uYW1lIHx8ICdWYWx1ZSc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBjb2xfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ19zZXJpZXNfJywgJ2cnKSwgc2VyaWVzTmFtZS50b1N0cmluZygpKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldERpc3BsYXlWYWx1ZVRlbXBsYXRlID0gZnVuY3Rpb24gKFxyXG4gIHZhbHVlOiBudW1iZXIsXHJcbiAgcGF0dGVybjogSUJvb21QYXR0ZXJuLFxyXG4gIHNlcmllc05hbWU6IHN0cmluZyxcclxuICByb3dfY29sX3dyYXBwZXI6IHN0cmluZyxcclxuICB0aHJlc2hvbGRzOiBhbnlbXVxyXG4pOiBzdHJpbmcge1xyXG4gIGxldCB0ZW1wbGF0ZSA9ICdfdmFsdWVfJztcclxuICBpZiAoXy5pc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IG51bGwpIHtcclxuICAgIHRlbXBsYXRlID0gcGF0dGVybi5udWxsX3ZhbHVlIHx8ICdObyBkYXRhJztcclxuICAgIGlmIChwYXR0ZXJuLm51bGxfdmFsdWUgPT09ICcnKSB7XHJcbiAgICAgIHRlbXBsYXRlID0gJyc7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHRlbXBsYXRlID0gcGF0dGVybi5kaXNwbGF5VGVtcGxhdGUgfHwgdGVtcGxhdGU7XHJcbiAgICBpZiAocGF0dGVybi5lbmFibGVfdHJhbnNmb3JtKSB7XHJcbiAgICAgIGxldCB0cmFuc2Zvcm1fdmFsdWVzID0gcGF0dGVybi50cmFuc2Zvcm1fdmFsdWVzLnNwbGl0KCd8Jyk7XHJcbiAgICAgIHRlbXBsYXRlID0gZ2V0SXRlbUJhc2VkT25UaHJlc2hvbGQodGhyZXNob2xkcywgdHJhbnNmb3JtX3ZhbHVlcywgdmFsdWUsIHRlbXBsYXRlKTtcclxuICAgIH1cclxuICAgIGlmIChwYXR0ZXJuLmVuYWJsZV90cmFuc2Zvcm1fb3ZlcnJpZGVzICYmIHBhdHRlcm4udHJhbnNmb3JtX3ZhbHVlc19vdmVycmlkZXMgIT09ICcnKSB7XHJcbiAgICAgIGxldCBfdHJhbnNmb3JtX3ZhbHVlc19vdmVycmlkZXMgPSBwYXR0ZXJuLnRyYW5zZm9ybV92YWx1ZXNfb3ZlcnJpZGVzXHJcbiAgICAgICAgLnNwbGl0KCd8JylcclxuICAgICAgICAuZmlsdGVyKGNvbiA9PiBjb24uaW5kZXhPZignLT4nKSlcclxuICAgICAgICAubWFwKGNvbiA9PiBjb24uc3BsaXQoJy0+JykpXHJcbiAgICAgICAgLmZpbHRlcihjb24gPT4gK2NvblswXSA9PT0gdmFsdWUpXHJcbiAgICAgICAgLm1hcChjb24gPT4gY29uWzFdKTtcclxuICAgICAgaWYgKF90cmFuc2Zvcm1fdmFsdWVzX292ZXJyaWRlcy5sZW5ndGggPiAwICYmIF90cmFuc2Zvcm1fdmFsdWVzX292ZXJyaWRlc1swXSAhPT0gJycpIHtcclxuICAgICAgICB0ZW1wbGF0ZSA9ICgnJyArIF90cmFuc2Zvcm1fdmFsdWVzX292ZXJyaWRlc1swXSkudHJpbSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAocGF0dGVybi5lbmFibGVfdHJhbnNmb3JtIHx8IHBhdHRlcm4uZW5hYmxlX3RyYW5zZm9ybV9vdmVycmlkZXMpIHtcclxuICAgICAgdGVtcGxhdGUgPSByZXBsYWNlRGVsaW1pdGVkQ29sdW1ucyh0ZW1wbGF0ZSwgc2VyaWVzTmFtZSwgcGF0dGVybi5kZWxpbWl0ZXIsIHJvd19jb2xfd3JhcHBlcik7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0ZW1wbGF0ZTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGRvZXNWYWx1ZU5lZWRzVG9IaWRlID0gZnVuY3Rpb24gKHZhbHVlOiBudW1iZXIsIGZpbHRlcjogYW55KTogYm9vbGVhbiB7XHJcbiAgbGV0IGhpZGRlbiA9IGZhbHNlO1xyXG4gIGlmICgodmFsdWUgfHwgdmFsdWUgPT09IDApICYmIGZpbHRlciAmJiAoZmlsdGVyLnZhbHVlX2JlbG93ICE9PSAnJyB8fCBmaWx0ZXIudmFsdWVfYWJvdmUgIT09ICcnKSkge1xyXG4gICAgaWYgKGZpbHRlci52YWx1ZV9iZWxvdyAhPT0gJycgJiYgdmFsdWUgPCArZmlsdGVyLnZhbHVlX2JlbG93KSB7XHJcbiAgICAgIGhpZGRlbiA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBpZiAoZmlsdGVyLnZhbHVlX2Fib3ZlICE9PSAnJyAmJiB2YWx1ZSA+ICtmaWx0ZXIudmFsdWVfYWJvdmUpIHtcclxuICAgICAgaGlkZGVuID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGhpZGRlbjtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBzdXBwbGVtZW50VW5kZWZpbmVkVmFscyA9IGZ1bmN0aW9uIChpbnB1dGRhdGE6IEJvb21TZXJpZXNbXSwgcGF0dGVybnM6IEJvb21QYXR0ZXJuW10sIGRlZmF1bHRQYXR0ZXJuOiBCb29tUGF0dGVybiwgc2VyaWVzT3B0aW9uczogYW55LCBzY29wZWRWYXJzOiBhbnksIHRlbXBsYXRlU3J2OiBhbnksIHRpbWVTcnY6IGFueSk6IEJvb21TZXJpZXNbXSB7XHJcblxyXG4gIGxldCBzdXBwbGVtZW50U2VyaWVzOiBCb29tU2VyaWVzW10gPSBbXTtcclxuXHJcbiAgdHJ5IHtcclxuXHJcbiAgICBsZXQgcm93c19mb3VuZDogc3RyaW5nW10gPSBfLnVuaXEoXy5tYXAoaW5wdXRkYXRhLCBkID0+IGQucm93X25hbWUpKTtcclxuICAgIGxldCBwYXR0ZXJuc19mb3VuZDogQm9vbVBhdHRlcm5bXSA9IF8udW5pcShfLm1hcChpbnB1dGRhdGEsIGQgPT4gZC5wYXR0ZXJuKSk7XHJcblxyXG4gICAgXy5lYWNoKHJvd3NfZm91bmQsIHJvd19uYW1lID0+IHtcclxuICAgICAgXy5lYWNoKHBhdHRlcm5zX2ZvdW5kLCBwYXR0ZXJuID0+IHtcclxuICAgICAgICBsZXQgbWF0Y2hlZF9pdGVtcyA9IF8uZmlsdGVyKGlucHV0ZGF0YSwgbyA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwYXR0ZXJuKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG8ucGF0dGVybik7XHJcbiAgICAgICAgICByZXR1cm4gby5yb3dfbmFtZSA9PT0gcm93X25hbWUgJiYgby5wYXR0ZXJuLnBhdHRlcm4gPT09IHBhdHRlcm4ucGF0dGVybjtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoIW1hdGNoZWRfaXRlbXMgfHwgbWF0Y2hlZF9pdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHN1cHBsZW1lbnRTZXJpZXMucHVzaChcclxuICAgICAgICAgICAgICAgIG5ldyBCb29tU2VyaWVzKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGFwb2ludHM6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBgJHtyb3dfbmFtZX0ke3BhdHRlcm4uZGVsaW1pdGVyfSAke3BhdHRlcm4ucGF0dGVybn1gXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0UGF0dGVybixcclxuICAgICAgICAgICAgICAgICAgICBwYXR0ZXJucyxcclxuICAgICAgICAgICAgICAgICAgICBzZXJpZXNPcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlZFZhcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVTcnYsXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZVNydlxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgaW4gdW5kZWZpbmVkIGNyZWF0aW9uIDooJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKChlIGFzIEVycm9yKS5tZXNzYWdlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coYGVycm9yIGluIHN1cHBsZW1lbnRVbmRlZmluZWRWYWxzOiAkeyhlIGFzIEVycm9yKS5tZXNzYWdlfWApO1xyXG4gIH1cclxuICAvLyBjb25zb2xlLmxvZyhgU3VwcGxlbWVudGluZyAke3N1cHBsZW1lbnRTZXJpZXMubGVuZ3RofWApO1xyXG4gIHJldHVybiBzdXBwbGVtZW50U2VyaWVzO1xyXG59O1xyXG4iXX0=