System.register(["lodash", "./boom/index", "./config"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, index_1, config_1, defaultPattern, seriesToTable;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            }
        ],
        execute: function () {
            defaultPattern = new index_1.BoomPattern(config_1.default_pattern_options);
            exports_1("defaultPattern", defaultPattern);
            seriesToTable = function (inputdata) {
                var rows_found = lodash_1.default.uniq(lodash_1.default.map(inputdata, function (d) { return d.row_name; }));
                var rows_without_token = lodash_1.default.uniq(lodash_1.default.map(inputdata, function (d) { return d.row_name_raw; }));
                var cols_found = lodash_1.default.uniq(lodash_1.default.map(inputdata, function (d) { return d.col_name; }));
                var output = [];
                lodash_1.default.each(rows_found.sort(), function (row_name) {
                    var cols = [];
                    lodash_1.default.each(cols_found.sort(), function (col_name) {
                        var matched_items = lodash_1.default.filter(inputdata, function (o) {
                            return o.row_name === row_name && o.col_name === col_name;
                        });
                        if (!matched_items || matched_items.length === 0) {
                            cols.push({
                                col_name: col_name,
                                color_bg: 'darkred',
                                color_text: 'white',
                                display_value: 'undefined data',
                                hidden: false,
                                link: '-',
                                row_name: row_name,
                                tooltip: '-',
                                value: NaN,
                            });
                        }
                        else if (matched_items && matched_items.length === 1) {
                            cols.push(matched_items[0]);
                        }
                        else if (matched_items && matched_items.length > 1) {
                            cols.push({
                                col_name: col_name,
                                color_bg: 'darkred',
                                color_text: 'white',
                                display_value: 'Duplicate matches',
                                hidden: false,
                                link: '-',
                                row_name: row_name,
                                tooltip: '-',
                                value: NaN,
                            });
                        }
                    });
                    output.push(cols);
                });
                return {
                    cols_found: cols_found,
                    output: output,
                    rows_found: rows_found,
                    rows_without_token: rows_without_token,
                };
            };
            exports_1("seriesToTable", seriesToTable);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC9hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFLTSxjQUFjLEdBQUcsSUFBSSxtQkFBVyxDQUFDLGdDQUF1QixDQUFDLENBQUM7O1lBRTFELGFBQWEsR0FBRyxVQUFTLFNBQXdCO2dCQUVyRCxJQUFJLFVBQVUsR0FBRyxnQkFBQyxDQUFDLElBQUksQ0FBQyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsUUFBUSxFQUFWLENBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELElBQUksa0JBQWtCLEdBQUcsZ0JBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFlBQVksRUFBZCxDQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUN2RSxJQUFJLFVBQVUsR0FBRyxnQkFBQyxDQUFDLElBQUksQ0FBQyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsUUFBUSxFQUFWLENBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELElBQUksTUFBTSxHQUF5QixFQUFFLENBQUM7Z0JBQ3RDLGdCQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxVQUFBLFFBQVE7b0JBQ2hDLElBQUksSUFBSSxHQUF1QixFQUFFLENBQUM7b0JBQ2xDLGdCQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxVQUFBLFFBQVE7d0JBQ2hDLElBQUksYUFBYSxHQUFHLGdCQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFBLENBQUM7NEJBQ3ZDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsS0FBSyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUM7d0JBQzVELENBQUMsQ0FBQyxDQUFDO3dCQUNILElBQUksQ0FBQyxhQUFhLElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQ2hELElBQUksQ0FBQyxJQUFJLENBQUM7Z0NBQ1IsUUFBUSxFQUFFLFFBQVE7Z0NBQ2xCLFFBQVEsRUFBRSxTQUFTO2dDQUNuQixVQUFVLEVBQUUsT0FBTztnQ0FDbkIsYUFBYSxFQUFFLGdCQUFnQjtnQ0FDL0IsTUFBTSxFQUFFLEtBQUs7Z0NBQ2IsSUFBSSxFQUFFLEdBQUc7Z0NBQ1QsUUFBUSxFQUFFLFFBQVE7Z0NBQ2xCLE9BQU8sRUFBRSxHQUFHO2dDQUNaLEtBQUssRUFBRSxHQUFHOzZCQUNYLENBQUMsQ0FBQzt5QkFDSjs2QkFBTSxJQUFJLGFBQWEsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs0QkFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDN0I7NkJBQU0sSUFBSSxhQUFhLElBQUksYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7NEJBQ3BELElBQUksQ0FBQyxJQUFJLENBQUM7Z0NBQ1IsUUFBUSxFQUFFLFFBQVE7Z0NBQ2xCLFFBQVEsRUFBRSxTQUFTO2dDQUNuQixVQUFVLEVBQUUsT0FBTztnQ0FDbkIsYUFBYSxFQUFFLG1CQUFtQjtnQ0FDbEMsTUFBTSxFQUFFLEtBQUs7Z0NBQ2IsSUFBSSxFQUFFLEdBQUc7Z0NBQ1QsUUFBUSxFQUFFLFFBQVE7Z0NBQ2xCLE9BQU8sRUFBRSxHQUFHO2dDQUNaLEtBQUssRUFBRSxHQUFHOzZCQUNYLENBQUMsQ0FBQzt5QkFDSjtvQkFDSCxDQUFDLENBQUMsQ0FBQztvQkFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwQixDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPO29CQUNMLFVBQVUsWUFBQTtvQkFDVixNQUFNLFFBQUE7b0JBQ04sVUFBVSxZQUFBO29CQUNWLGtCQUFrQixvQkFBQTtpQkFDbkIsQ0FBQztZQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBJQm9vbVNlcmllcywgSUJvb21DZWxsRGV0YWlscywgSUJvb21UYWJsZSB9IGZyb20gJy4vYm9vbS9pbmRleCc7XG5pbXBvcnQgeyBCb29tUGF0dGVybiB9IGZyb20gJy4vYm9vbS9pbmRleCc7XG5pbXBvcnQgeyBkZWZhdWx0X3BhdHRlcm5fb3B0aW9ucyB9IGZyb20gJy4vY29uZmlnJztcblxuY29uc3QgZGVmYXVsdFBhdHRlcm4gPSBuZXcgQm9vbVBhdHRlcm4oZGVmYXVsdF9wYXR0ZXJuX29wdGlvbnMpO1xuXG5jb25zdCBzZXJpZXNUb1RhYmxlID0gZnVuY3Rpb24oaW5wdXRkYXRhOiBJQm9vbVNlcmllc1tdKTogSUJvb21UYWJsZSB7XG4gIC8vIGNvbnNvbGUubG9nKGBpbnB1dGRhdGEgY29udGFpbnMgJHtpbnB1dGRhdGEubGVuZ3RofWApO1xuICBsZXQgcm93c19mb3VuZCA9IF8udW5pcShfLm1hcChpbnB1dGRhdGEsIGQgPT4gZC5yb3dfbmFtZSkpO1xuICBsZXQgcm93c193aXRob3V0X3Rva2VuID0gXy51bmlxKF8ubWFwKGlucHV0ZGF0YSwgZCA9PiBkLnJvd19uYW1lX3JhdykpO1xuICBsZXQgY29sc19mb3VuZCA9IF8udW5pcShfLm1hcChpbnB1dGRhdGEsIGQgPT4gZC5jb2xfbmFtZSkpO1xuICBsZXQgb3V0cHV0OiBJQm9vbUNlbGxEZXRhaWxzW11bXSA9IFtdO1xuICBfLmVhY2gocm93c19mb3VuZC5zb3J0KCksIHJvd19uYW1lID0+IHtcbiAgICBsZXQgY29sczogSUJvb21DZWxsRGV0YWlsc1tdID0gW107XG4gICAgXy5lYWNoKGNvbHNfZm91bmQuc29ydCgpLCBjb2xfbmFtZSA9PiB7XG4gICAgICBsZXQgbWF0Y2hlZF9pdGVtcyA9IF8uZmlsdGVyKGlucHV0ZGF0YSwgbyA9PiB7XG4gICAgICAgIHJldHVybiBvLnJvd19uYW1lID09PSByb3dfbmFtZSAmJiBvLmNvbF9uYW1lID09PSBjb2xfbmFtZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKCFtYXRjaGVkX2l0ZW1zIHx8IG1hdGNoZWRfaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbHMucHVzaCh7XG4gICAgICAgICAgY29sX25hbWU6IGNvbF9uYW1lLFxuICAgICAgICAgIGNvbG9yX2JnOiAnZGFya3JlZCcsXG4gICAgICAgICAgY29sb3JfdGV4dDogJ3doaXRlJyxcbiAgICAgICAgICBkaXNwbGF5X3ZhbHVlOiAndW5kZWZpbmVkIGRhdGEnLFxuICAgICAgICAgIGhpZGRlbjogZmFsc2UsXG4gICAgICAgICAgbGluazogJy0nLFxuICAgICAgICAgIHJvd19uYW1lOiByb3dfbmFtZSxcbiAgICAgICAgICB0b29sdGlwOiAnLScsXG4gICAgICAgICAgdmFsdWU6IE5hTixcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKG1hdGNoZWRfaXRlbXMgJiYgbWF0Y2hlZF9pdGVtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29scy5wdXNoKG1hdGNoZWRfaXRlbXNbMF0pO1xuICAgICAgfSBlbHNlIGlmIChtYXRjaGVkX2l0ZW1zICYmIG1hdGNoZWRfaXRlbXMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb2xzLnB1c2goe1xuICAgICAgICAgIGNvbF9uYW1lOiBjb2xfbmFtZSxcbiAgICAgICAgICBjb2xvcl9iZzogJ2RhcmtyZWQnLFxuICAgICAgICAgIGNvbG9yX3RleHQ6ICd3aGl0ZScsXG4gICAgICAgICAgZGlzcGxheV92YWx1ZTogJ0R1cGxpY2F0ZSBtYXRjaGVzJyxcbiAgICAgICAgICBoaWRkZW46IGZhbHNlLFxuICAgICAgICAgIGxpbms6ICctJyxcbiAgICAgICAgICByb3dfbmFtZTogcm93X25hbWUsXG4gICAgICAgICAgdG9vbHRpcDogJy0nLFxuICAgICAgICAgIHZhbHVlOiBOYU4sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG91dHB1dC5wdXNoKGNvbHMpO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICBjb2xzX2ZvdW5kLFxuICAgIG91dHB1dCxcbiAgICByb3dzX2ZvdW5kLFxuICAgIHJvd3Nfd2l0aG91dF90b2tlbixcbiAgfTtcbn07XG5cbmV4cG9ydCB7IGRlZmF1bHRQYXR0ZXJuLCBzZXJpZXNUb1RhYmxlIH07XG4iXX0=