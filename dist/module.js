System.register(["lodash", "app/core/utils/kbn", "app/plugins/sdk", "./app/boom/index", "./app/app", "./app/config", "./app/boom/BoomUtils"], function (exports_1, context_1) {
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
    var lodash_1, kbn_1, sdk_1, index_1, app_1, config_1, BoomUtils_1, GrafanaBoomTableCtrl;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (app_1_1) {
                app_1 = app_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (BoomUtils_1_1) {
                BoomUtils_1 = BoomUtils_1_1;
            }
        ],
        execute: function () {
            sdk_1.loadPluginCss({
                dark: "plugins/" + config_1.plugin_id + "/css/default.dark.css",
                light: "plugins/" + config_1.plugin_id + "/css/default.light.css",
            });
            GrafanaBoomTableCtrl = (function (_super) {
                __extends(GrafanaBoomTableCtrl, _super);
                function GrafanaBoomTableCtrl($scope, $injector, $sce) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.unitFormats = kbn_1.default.getUnitFormats();
                    _this.valueNameOptions = config_1.value_name_options;
                    _this.textAlignmentOptions = config_1.textAlignmentOptions;
                    lodash_1.default.defaults(_this.panel, config_1.config.panelDefaults);
                    _this.panel.defaultPattern = _this.panel.defaultPattern || app_1.defaultPattern;
                    _this.$sce = $sce;
                    _this.templateSrv = $injector.get('templateSrv');
                    _this.timeSrv = $injector.get('timeSrv');
                    _this.updatePrototypes();
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.panel.activePatternIndex = _this.panel.activePatternIndex === -1 ? _this.panel.patterns.length : _this.panel.activePatternIndex;
                    return _this;
                }
                GrafanaBoomTableCtrl.prototype.updatePrototypes = function () {
                    Object.setPrototypeOf(this.panel.defaultPattern, index_1.BoomPattern.prototype);
                    this.panel.patterns.map(function (pattern) {
                        Object.setPrototypeOf(pattern, index_1.BoomPattern.prototype);
                        return pattern;
                    });
                };
                GrafanaBoomTableCtrl.prototype.onDataReceived = function (data) {
                    this.dataReceived = data;
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.onInitEditMode = function () {
                    this.addEditorTab('Patterns', "public/plugins/" + config_1.plugin_id + "/partials/editor.html", 2);
                };
                GrafanaBoomTableCtrl.prototype.addPattern = function () {
                    var newPattern = new index_1.BoomPattern({
                        row_col_wrapper: this.panel.row_col_wrapper,
                    });
                    this.panel.patterns.push(newPattern);
                    this.panel.activePatternIndex = this.panel.activePatternIndex === -2 ? -2 : this.panel.patterns.length - 1;
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.removePattern = function (index) {
                    this.panel.patterns.splice(index, 1);
                    this.panel.activePatternIndex =
                        this.panel.activePatternIndex === -2 ? -2 : this.panel.patterns && this.panel.patterns.length > 0 ? this.panel.patterns.length - 1 : -1;
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.movePattern = function (direction, index) {
                    var tempElement = this.panel.patterns[Number(index)];
                    if (direction === 'UP') {
                        this.panel.patterns[Number(index)] = this.panel.patterns[Number(index) - 1];
                        this.panel.patterns[Number(index) - 1] = tempElement;
                        this.panel.activePatternIndex = this.panel.activePatternIndex === -2 ? -2 : Number(index) - 1;
                    }
                    if (direction === 'DOWN') {
                        this.panel.patterns[Number(index)] = this.panel.patterns[Number(index) + 1];
                        this.panel.patterns[Number(index) + 1] = tempElement;
                        this.panel.activePatternIndex = this.panel.activePatternIndex === -2 ? -2 : Number(index) + 1;
                    }
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.clonePattern = function (index) {
                    var copiedPattern = Object.assign({}, this.panel.patterns[Number(index)]);
                    Object.setPrototypeOf(copiedPattern, index_1.BoomPattern.prototype);
                    this.panel.patterns.push(copiedPattern);
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.sortByHeader = function (headerIndex) {
                    this.panel.sorting_props = this.panel.sorting_props || {
                        col_index: -1,
                        direction: 'desc',
                    };
                    this.panel.sorting_props.col_index = headerIndex;
                    this.panel.sorting_props.direction = this.panel.sorting_props.direction === 'asc' ? 'desc' : 'asc';
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.limitText = function (text, maxlength) {
                    if (text.split('').length > maxlength) {
                        text = text.substring(0, Number(maxlength) - 3) + '...';
                    }
                    return text;
                };
                GrafanaBoomTableCtrl.prototype.adjustScrollBar = function () {
                    var rootElem = this.elem.find('.table-panel-scroll');
                    var originalHeight = this.ctrl.height;
                    if (isNaN(originalHeight)) {
                        if (this.ctrl && this.ctrl.elem && this.ctrl.elem[0] && this.ctrl.elem[0].clientHeight) {
                            originalHeight = this.ctrl.elem[0].clientHeight;
                        }
                    }
                    var maxheightofpanel = this.panel.debug_mode ? originalHeight - 111 : originalHeight - 31;
                    rootElem.css({ 'max-height': maxheightofpanel + 'px' });
                };
                GrafanaBoomTableCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
                    this.scope = scope;
                    this.elem = elem;
                    this.attrs = attrs;
                    this.ctrl = ctrl;
                    this.panel = ctrl.panel;
                    this.panel.sorting_props = this.panel.sorting_props || {
                        col_index: -1,
                        direction: 'desc',
                    };
                };
                GrafanaBoomTableCtrl.templateUrl = 'partials/module.html';
                return GrafanaBoomTableCtrl;
            }(sdk_1.MetricsPanelCtrl));
            exports_1("PanelCtrl", GrafanaBoomTableCtrl);
            GrafanaBoomTableCtrl.prototype.render = function () {
                var _this = this;
                if (this.dataReceived) {
                    var seriesOptions_1 = {
                        debug_mode: this.panel.debug_mode,
                        row_col_wrapper: this.panel.row_col_wrapper || '_',
                    };
                    var outputdata = this.dataReceived.map(function (seriesData) {
                        return new index_1.BoomSeries(seriesData, _this.panel.defaultPattern, _this.panel.patterns, seriesOptions_1, _this.panel.scopedVars, _this.templateSrv, _this.timeSrv);
                    });
                    outputdata.push.apply(outputdata, BoomUtils_1.supplementUndefinedVals(outputdata, this.panel.patterns, this.panel.defaultPattern, seriesOptions_1, this.panel.scopedVars, this.templateSrv, this.timeSrv));
                    var boomtabledata = app_1.seriesToTable(outputdata);
                    var renderingOptions = {
                        default_title_for_rows: this.panel.default_title_for_rows || config_1.config.default_title_for_rows,
                        first_column_link: this.panel.first_column_link || '#',
                        hide_first_column: this.panel.hide_first_column,
                        hide_headers: this.panel.hide_headers,
                        text_alignment_firstcolumn: this.panel.text_alignment_firstcolumn,
                        text_alignment_values: this.panel.text_alignment_values,
                    };
                    var boom_output = new index_1.BoomOutput(renderingOptions);
                    this.outdata = {
                        cols_found: boomtabledata.cols_found.map(function (col) {
                            return _this.$sce.trustAsHtml(col);
                        }),
                    };
                    var renderingdata = boom_output.getDataAsHTML(boomtabledata, this.panel.sorting_props);
                    this.elem.find('#boomtable_output_body').html("" + renderingdata.body);
                    this.elem.find('#boomtable_output_body_debug').html(this.panel.debug_mode ? boom_output.getDataAsDebugHTML(outputdata) : "");
                    this.elem.find("[data-toggle='tooltip']").tooltip({
                        boundary: 'scrollParent',
                    });
                    this.adjustScrollBar();
                    this.renderingCompleted();
                }
            };
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFpQkEsbUJBQWEsQ0FBQztnQkFDWixJQUFJLEVBQUUsYUFBVyxrQkFBUywwQkFBdUI7Z0JBQ2pELEtBQUssRUFBRSxhQUFXLGtCQUFTLDJCQUF3QjthQUNwRCxDQUFDLENBQUM7O2dCQUVnQyx3Q0FBZ0I7Z0JBV2pELDhCQUFZLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSTtvQkFBbkMsWUFDRSxrQkFBTSxNQUFNLEVBQUUsU0FBUyxDQUFDLFNBV3pCO29CQXJCTSxpQkFBVyxHQUFHLGFBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDbkMsc0JBQWdCLEdBQUcsMkJBQWtCLENBQUM7b0JBQ3RDLDBCQUFvQixHQUFHLDZCQUFvQixDQUFDO29CQVNqRCxnQkFBQyxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsS0FBSyxFQUFFLGVBQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDN0MsS0FBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLElBQUksb0JBQWMsQ0FBQztvQkFDeEUsS0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ2pCLEtBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDaEQsS0FBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN4QyxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDeEIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLEtB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LENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzdILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUNoRCxRQUFRLEVBQUUsY0FBYztxQkFDekIsQ0FBQyxDQUFDO29CQUNILElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7aUJBQzNCO1lBQ0gsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2dyYWZhbmEtc2RrLW1vY2tzL2FwcC9oZWFkZXJzL2NvbW1vbi5kLnRzXCIgLz5cclxuXHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBrYm4gZnJvbSAnYXBwL2NvcmUvdXRpbHMva2JuJztcclxuaW1wb3J0IHsgbG9hZFBsdWdpbkNzcywgTWV0cmljc1BhbmVsQ3RybCB9IGZyb20gJ2FwcC9wbHVnaW5zL3Nkayc7XHJcbmltcG9ydCB7XHJcbiAgSUJvb21SZW5kZXJpbmdPcHRpb25zLFxyXG4gIElCb29tVGFibGUsXHJcbiAgSUJvb21IVE1MLFxyXG4gIEJvb21QYXR0ZXJuLFxyXG4gIEJvb21TZXJpZXMsXHJcbiAgQm9vbU91dHB1dCxcclxufSBmcm9tICcuL2FwcC9ib29tL2luZGV4JztcclxuaW1wb3J0IHsgZGVmYXVsdFBhdHRlcm4sIHNlcmllc1RvVGFibGUgfSBmcm9tIFwiLi9hcHAvYXBwXCI7XHJcbmltcG9ydCB7IHBsdWdpbl9pZCwgdmFsdWVfbmFtZV9vcHRpb25zLCB0ZXh0QWxpZ25tZW50T3B0aW9ucywgY29uZmlnIH0gZnJvbSBcIi4vYXBwL2NvbmZpZ1wiO1xyXG5pbXBvcnQge3N1cHBsZW1lbnRVbmRlZmluZWRWYWxzfSBmcm9tIFwiLi9hcHAvYm9vbS9Cb29tVXRpbHNcIjtcclxuXHJcbmxvYWRQbHVnaW5Dc3Moe1xyXG4gIGRhcms6IGBwbHVnaW5zLyR7cGx1Z2luX2lkfS9jc3MvZGVmYXVsdC5kYXJrLmNzc2AsXHJcbiAgbGlnaHQ6IGBwbHVnaW5zLyR7cGx1Z2luX2lkfS9jc3MvZGVmYXVsdC5saWdodC5jc3NgLFxyXG59KTtcclxuXHJcbmNsYXNzIEdyYWZhbmFCb29tVGFibGVDdHJsIGV4dGVuZHMgTWV0cmljc1BhbmVsQ3RybCB7XHJcbiAgcHVibGljIHN0YXRpYyB0ZW1wbGF0ZVVybCA9ICdwYXJ0aWFscy9tb2R1bGUuaHRtbCc7XHJcbiAgcHVibGljIHVuaXRGb3JtYXRzID0ga2JuLmdldFVuaXRGb3JtYXRzKCk7XHJcbiAgcHVibGljIHZhbHVlTmFtZU9wdGlvbnMgPSB2YWx1ZV9uYW1lX29wdGlvbnM7XHJcbiAgcHVibGljIHRleHRBbGlnbm1lbnRPcHRpb25zID0gdGV4dEFsaWdubWVudE9wdGlvbnM7XHJcbiAgcHVibGljIG91dGRhdGE7XHJcbiAgcHVibGljIGRhdGFSZWNlaXZlZDogYW55O1xyXG4gIHB1YmxpYyBjdHJsOiBhbnk7XHJcbiAgcHVibGljIGVsZW06IGFueTtcclxuICBwdWJsaWMgYXR0cnM6IGFueTtcclxuICBwdWJsaWMgJHNjZTogYW55O1xyXG4gIGNvbnN0cnVjdG9yKCRzY29wZSwgJGluamVjdG9yLCAkc2NlKSB7XHJcbiAgICBzdXBlcigkc2NvcGUsICRpbmplY3Rvcik7XHJcbiAgICBfLmRlZmF1bHRzKHRoaXMucGFuZWwsIGNvbmZpZy5wYW5lbERlZmF1bHRzKTtcclxuICAgIHRoaXMucGFuZWwuZGVmYXVsdFBhdHRlcm4gPSB0aGlzLnBhbmVsLmRlZmF1bHRQYXR0ZXJuIHx8IGRlZmF1bHRQYXR0ZXJuO1xyXG4gICAgdGhpcy4kc2NlID0gJHNjZTtcclxuICAgIHRoaXMudGVtcGxhdGVTcnYgPSAkaW5qZWN0b3IuZ2V0KCd0ZW1wbGF0ZVNydicpO1xyXG4gICAgdGhpcy50aW1lU3J2ID0gJGluamVjdG9yLmdldCgndGltZVNydicpO1xyXG4gICAgdGhpcy51cGRhdGVQcm90b3R5cGVzKCk7XHJcbiAgICB0aGlzLmV2ZW50cy5vbignZGF0YS1yZWNlaXZlZCcsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmV2ZW50cy5vbignZGF0YS1zbmFwc2hvdC1sb2FkJywgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMuZXZlbnRzLm9uKCdpbml0LWVkaXQtbW9kZScsIHRoaXMub25Jbml0RWRpdE1vZGUuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9IHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID09PSAtMSA/IHRoaXMucGFuZWwucGF0dGVybnMubGVuZ3RoIDogdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXg7XHJcbiAgfVxyXG4gIHByaXZhdGUgdXBkYXRlUHJvdG90eXBlcygpOiB2b2lkIHtcclxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLnBhbmVsLmRlZmF1bHRQYXR0ZXJuLCBCb29tUGF0dGVybi5wcm90b3R5cGUpO1xyXG4gICAgdGhpcy5wYW5lbC5wYXR0ZXJucy5tYXAocGF0dGVybiA9PiB7XHJcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihwYXR0ZXJuLCBCb29tUGF0dGVybi5wcm90b3R5cGUpO1xyXG4gICAgICByZXR1cm4gcGF0dGVybjtcclxuICAgIH0pO1xyXG4gIH1cclxuICBwdWJsaWMgb25EYXRhUmVjZWl2ZWQoZGF0YTogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLmRhdGFSZWNlaXZlZCA9IGRhdGE7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgb25Jbml0RWRpdE1vZGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmFkZEVkaXRvclRhYignUGF0dGVybnMnLCBgcHVibGljL3BsdWdpbnMvJHtwbHVnaW5faWR9L3BhcnRpYWxzL2VkaXRvci5odG1sYCwgMik7XHJcbiAgfVxyXG4gIHB1YmxpYyBhZGRQYXR0ZXJuKCk6IHZvaWQge1xyXG4gICAgbGV0IG5ld1BhdHRlcm4gPSBuZXcgQm9vbVBhdHRlcm4oe1xyXG4gICAgICByb3dfY29sX3dyYXBwZXI6IHRoaXMucGFuZWwucm93X2NvbF93cmFwcGVyLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLnB1c2gobmV3UGF0dGVybik7XHJcbiAgICB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9IHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID09PSAtMiA/IC0yIDogdGhpcy5wYW5lbC5wYXR0ZXJucy5sZW5ndGggLSAxO1xyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgcHVibGljIHJlbW92ZVBhdHRlcm4oaW5kZXg6IE51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5wYW5lbC5wYXR0ZXJucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXggPVxyXG4gICAgICB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9PT0gLTIgPyAtMiA6IHRoaXMucGFuZWwucGF0dGVybnMgJiYgdGhpcy5wYW5lbC5wYXR0ZXJucy5sZW5ndGggPiAwID8gdGhpcy5wYW5lbC5wYXR0ZXJucy5sZW5ndGggLSAxIDogLTE7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgbW92ZVBhdHRlcm4oZGlyZWN0aW9uOiBzdHJpbmcsIGluZGV4OiBOdW1iZXIpIHtcclxuICAgIGxldCB0ZW1wRWxlbWVudCA9IHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KV07XHJcbiAgICBpZiAoZGlyZWN0aW9uID09PSAnVVAnKSB7XHJcbiAgICAgIHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KV0gPSB0aGlzLnBhbmVsLnBhdHRlcm5zW051bWJlcihpbmRleCkgLSAxXTtcclxuICAgICAgdGhpcy5wYW5lbC5wYXR0ZXJuc1tOdW1iZXIoaW5kZXgpIC0gMV0gPSB0ZW1wRWxlbWVudDtcclxuICAgICAgdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXggPSB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9PT0gLTIgPyAtMiA6IE51bWJlcihpbmRleCkgLSAxO1xyXG4gICAgfVxyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ0RPV04nKSB7XHJcbiAgICAgIHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KV0gPSB0aGlzLnBhbmVsLnBhdHRlcm5zW051bWJlcihpbmRleCkgKyAxXTtcclxuICAgICAgdGhpcy5wYW5lbC5wYXR0ZXJuc1tOdW1iZXIoaW5kZXgpICsgMV0gPSB0ZW1wRWxlbWVudDtcclxuICAgICAgdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXggPSB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9PT0gLTIgPyAtMiA6IE51bWJlcihpbmRleCkgKyAxO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgcHVibGljIGNsb25lUGF0dGVybihpbmRleDogTnVtYmVyKTogdm9pZCB7XHJcbiAgICBsZXQgY29waWVkUGF0dGVybiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KV0pO1xyXG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGNvcGllZFBhdHRlcm4sIEJvb21QYXR0ZXJuLnByb3RvdHlwZSk7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLnB1c2goY29waWVkUGF0dGVybik7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgc29ydEJ5SGVhZGVyKGhlYWRlckluZGV4OiBudW1iZXIpIHtcclxuICAgIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcyA9IHRoaXMucGFuZWwuc29ydGluZ19wcm9wcyB8fCB7XHJcbiAgICAgIGNvbF9pbmRleDogLTEsXHJcbiAgICAgIGRpcmVjdGlvbjogJ2Rlc2MnLFxyXG4gICAgfTtcclxuICAgIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5jb2xfaW5kZXggPSBoZWFkZXJJbmRleDtcclxuICAgIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5kaXJlY3Rpb24gPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuZGlyZWN0aW9uID09PSAnYXNjJyA/ICdkZXNjJyA6ICdhc2MnO1xyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgcHVibGljIGxpbWl0VGV4dCh0ZXh0OiBzdHJpbmcsIG1heGxlbmd0aDogTnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGlmICh0ZXh0LnNwbGl0KCcnKS5sZW5ndGggPiBtYXhsZW5ndGgpIHtcclxuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIE51bWJlcihtYXhsZW5ndGgpIC0gMykgKyAnLi4uJztcclxuICAgIH1cclxuICAgIHJldHVybiB0ZXh0O1xyXG4gIH1cclxuICBwdWJsaWMgYWRqdXN0U2Nyb2xsQmFyKCk6IHZvaWQge1xyXG4gICAgbGV0IHJvb3RFbGVtID0gdGhpcy5lbGVtLmZpbmQoJy50YWJsZS1wYW5lbC1zY3JvbGwnKTtcclxuICAgIGxldCBvcmlnaW5hbEhlaWdodCA9IHRoaXMuY3RybC5oZWlnaHQ7XHJcbiAgICBpZiAoaXNOYU4ob3JpZ2luYWxIZWlnaHQpKSB7XHJcbiAgICAgIGlmICh0aGlzLmN0cmwgJiYgdGhpcy5jdHJsLmVsZW0gJiYgdGhpcy5jdHJsLmVsZW1bMF0gJiYgdGhpcy5jdHJsLmVsZW1bMF0uY2xpZW50SGVpZ2h0KSB7XHJcbiAgICAgICAgb3JpZ2luYWxIZWlnaHQgPSB0aGlzLmN0cmwuZWxlbVswXS5jbGllbnRIZWlnaHQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBtYXhoZWlnaHRvZnBhbmVsID0gdGhpcy5wYW5lbC5kZWJ1Z19tb2RlID8gb3JpZ2luYWxIZWlnaHQgLSAxMTEgOiBvcmlnaW5hbEhlaWdodCAtIDMxO1xyXG4gICAgcm9vdEVsZW0uY3NzKHsgJ21heC1oZWlnaHQnOiBtYXhoZWlnaHRvZnBhbmVsICsgJ3B4JyB9KTtcclxuICB9XHJcbiAgcHVibGljIGxpbmsoc2NvcGU6IGFueSwgZWxlbTogYW55LCBhdHRyczogYW55LCBjdHJsOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcclxuICAgIHRoaXMuZWxlbSA9IGVsZW07XHJcbiAgICB0aGlzLmF0dHJzID0gYXR0cnM7XHJcbiAgICB0aGlzLmN0cmwgPSBjdHJsO1xyXG4gICAgdGhpcy5wYW5lbCA9IGN0cmwucGFuZWw7XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMgPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMgfHwge1xyXG4gICAgICBjb2xfaW5kZXg6IC0xLFxyXG4gICAgICBkaXJlY3Rpb246ICdkZXNjJyxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5HcmFmYW5hQm9vbVRhYmxlQ3RybC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0aGlzLmRhdGFSZWNlaXZlZCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlbmRlcmluZycpO1xyXG4gICAgbGV0IHNlcmllc09wdGlvbnMgPSB7XHJcbiAgICAgIGRlYnVnX21vZGU6IHRoaXMucGFuZWwuZGVidWdfbW9kZSxcclxuICAgICAgcm93X2NvbF93cmFwcGVyOiB0aGlzLnBhbmVsLnJvd19jb2xfd3JhcHBlciB8fCAnXycsXHJcbiAgICB9O1xyXG4gICAgbGV0IG91dHB1dGRhdGE6IEJvb21TZXJpZXNbXSA9IHRoaXMuZGF0YVJlY2VpdmVkLm1hcChzZXJpZXNEYXRhID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBCb29tU2VyaWVzKFxyXG4gICAgICAgIHNlcmllc0RhdGEsXHJcbiAgICAgICAgdGhpcy5wYW5lbC5kZWZhdWx0UGF0dGVybixcclxuICAgICAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLFxyXG4gICAgICAgIHNlcmllc09wdGlvbnMsXHJcbiAgICAgICAgdGhpcy5wYW5lbC5zY29wZWRWYXJzLFxyXG4gICAgICAgIHRoaXMudGVtcGxhdGVTcnYsXHJcbiAgICAgICAgdGhpcy50aW1lU3J2XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdzdXBwbGVtZW50aW5nJyk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhgb3V0cHV0IGNvbnRhaW5zICR7b3V0cHV0ZGF0YS5sZW5ndGh9YCk7XHJcbiAgICBvdXRwdXRkYXRhLnB1c2goLi4uc3VwcGxlbWVudFVuZGVmaW5lZFZhbHMob3V0cHV0ZGF0YSwgdGhpcy5wYW5lbC5wYXR0ZXJucywgdGhpcy5wYW5lbC5kZWZhdWx0UGF0dGVybiwgc2VyaWVzT3B0aW9ucywgdGhpcy5wYW5lbC5zY29wZWRWYXJzLCB0aGlzLnRlbXBsYXRlU3J2LCB0aGlzLnRpbWVTcnYpKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGBvdXRwdXQgY29udGFpbnMgJHtvdXRwdXRkYXRhLmxlbmd0aH1gKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdkb25lIHN1cHBsZW1lbnRpbmcnKTtcclxuICAgIGxldCBib29tdGFibGVkYXRhOiBJQm9vbVRhYmxlID0gc2VyaWVzVG9UYWJsZShvdXRwdXRkYXRhKTtcclxuICAgIGxldCByZW5kZXJpbmdPcHRpb25zOiBJQm9vbVJlbmRlcmluZ09wdGlvbnMgPSB7XHJcbiAgICAgIGRlZmF1bHRfdGl0bGVfZm9yX3Jvd3M6IHRoaXMucGFuZWwuZGVmYXVsdF90aXRsZV9mb3Jfcm93cyB8fCBjb25maWcuZGVmYXVsdF90aXRsZV9mb3Jfcm93cyxcclxuICAgICAgZmlyc3RfY29sdW1uX2xpbms6IHRoaXMucGFuZWwuZmlyc3RfY29sdW1uX2xpbmsgfHwgJyMnLFxyXG4gICAgICBoaWRlX2ZpcnN0X2NvbHVtbjogdGhpcy5wYW5lbC5oaWRlX2ZpcnN0X2NvbHVtbixcclxuICAgICAgaGlkZV9oZWFkZXJzOiB0aGlzLnBhbmVsLmhpZGVfaGVhZGVycyxcclxuICAgICAgdGV4dF9hbGlnbm1lbnRfZmlyc3Rjb2x1bW46IHRoaXMucGFuZWwudGV4dF9hbGlnbm1lbnRfZmlyc3Rjb2x1bW4sXHJcbiAgICAgIHRleHRfYWxpZ25tZW50X3ZhbHVlczogdGhpcy5wYW5lbC50ZXh0X2FsaWdubWVudF92YWx1ZXMsXHJcbiAgICB9O1xyXG4gICAgbGV0IGJvb21fb3V0cHV0ID0gbmV3IEJvb21PdXRwdXQocmVuZGVyaW5nT3B0aW9ucyk7XHJcbiAgICB0aGlzLm91dGRhdGEgPSB7XHJcbiAgICAgIGNvbHNfZm91bmQ6IGJvb210YWJsZWRhdGEuY29sc19mb3VuZC5tYXAoY29sID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kc2NlLnRydXN0QXNIdG1sKGNvbCk7XHJcbiAgICAgIH0pLFxyXG4gICAgfTtcclxuICAgIGxldCByZW5kZXJpbmdkYXRhOiBJQm9vbUhUTUwgPSBib29tX291dHB1dC5nZXREYXRhQXNIVE1MKGJvb210YWJsZWRhdGEsIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcyk7XHJcbiAgICB0aGlzLmVsZW0uZmluZCgnI2Jvb210YWJsZV9vdXRwdXRfYm9keScpLmh0bWwoYGAgKyByZW5kZXJpbmdkYXRhLmJvZHkpO1xyXG4gICAgdGhpcy5lbGVtLmZpbmQoJyNib29tdGFibGVfb3V0cHV0X2JvZHlfZGVidWcnKS5odG1sKHRoaXMucGFuZWwuZGVidWdfbW9kZSA/IGJvb21fb3V0cHV0LmdldERhdGFBc0RlYnVnSFRNTChvdXRwdXRkYXRhKSA6IGBgKTtcclxuICAgIHRoaXMuZWxlbS5maW5kKFwiW2RhdGEtdG9nZ2xlPSd0b29sdGlwJ11cIikudG9vbHRpcCh7XHJcbiAgICAgIGJvdW5kYXJ5OiAnc2Nyb2xsUGFyZW50JyxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5hZGp1c3RTY3JvbGxCYXIoKTtcclxuICAgIHRoaXMucmVuZGVyaW5nQ29tcGxldGVkKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHsgR3JhZmFuYUJvb21UYWJsZUN0cmwgYXMgUGFuZWxDdHJsIH07XHJcbiJdfQ==