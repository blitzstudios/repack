"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var React = __importStar(require("react"));
var emotion_theming_1 = require("emotion-theming");
var default_1 = __importDefault(require("./theme/default"));
var elements_1 = require("./elements");
var Message_1 = __importDefault(require("./Message"));
// https://stackoverflow.com/a/48254637/4089357
var customStringify = function (v) {
    var cache = new Set();
    return JSON.stringify(v, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our set
            cache.add(value);
        }
        return value;
    });
};
var Console = /** @class */ (function (_super) {
    __extends(Console, _super);
    function Console() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.theme = function () { return ({
            variant: _this.props.variant || 'light',
            styles: __assign(__assign({}, default_1["default"](_this.props)), _this.props.styles)
        }); };
        return _this;
    }
    Console.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.filter, filter = _b === void 0 ? [] : _b, _c = _a.logs, logs = _c === void 0 ? [] : _c, searchKeywords = _a.searchKeywords, logFilter = _a.logFilter, _d = _a.logGrouping, logGrouping = _d === void 0 ? true : _d;
        if (searchKeywords) {
            var regex_1 = new RegExp(searchKeywords);
            var filterFun = logFilter
                ? logFilter
                : function (log) {
                    try {
                        return regex_1.test(customStringify(log));
                    }
                    catch (e) {
                        return true;
                    }
                };
            // @ts-ignore
            logs = logs.filter(filterFun);
        }
        if (logGrouping) {
            // @ts-ignore
            logs = logs.reduce(function (acc, log) {
                var prevLog = acc[acc.length - 1];
                if (prevLog &&
                    prevLog.amount &&
                    prevLog.method === log.method &&
                    prevLog.data.length === log.data.length &&
                    prevLog.data.every(function (value, i) { return log.data[i] === value; })) {
                    prevLog.amount += 1;
                    return acc;
                }
                acc.push(__assign(__assign({}, log), { amount: 1 }));
                return acc;
            }, []);
        }
        return (React.createElement(emotion_theming_1.ThemeProvider, { theme: this.theme },
            React.createElement(elements_1.Root, null, logs.map(function (log, i) {
                // If the filter is defined and doesn't include the method
                var filtered = filter.length !== 0 &&
                    log.method &&
                    filter.indexOf(log.method) === -1;
                return filtered ? null : (React.createElement(Message_1["default"], { log: log, key: log.id || log.method + "-" + i, linkifyOptions: _this.props.linkifyOptions }));
            }))));
    };
    return Console;
}(React.PureComponent));
exports["default"] = Console;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvQ29tcG9uZW50L2luZGV4LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBOEI7QUFDOUIsbURBQStDO0FBRS9DLDREQUFvQztBQUVwQyx1Q0FBaUM7QUFDakMsc0RBQStCO0FBRS9CLCtDQUErQztBQUMvQyxJQUFNLGVBQWUsR0FBRyxVQUFVLENBQUM7SUFDakMsSUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtJQUN2QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxFQUFFLEtBQUs7UUFDM0MsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUMvQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3BCLHdDQUF3QztnQkFDeEMsT0FBTTthQUNQO1lBQ0QseUJBQXlCO1lBQ3pCLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDakI7UUFDRCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBRUQ7SUFBc0IsMkJBQStCO0lBQXJEO1FBQUEscUVBZ0ZDO1FBL0VDLFdBQUssR0FBRyxjQUFNLE9BQUEsQ0FBQztZQUNiLE9BQU8sRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxPQUFPO1lBQ3RDLE1BQU0sd0JBQ0Qsb0JBQU0sQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLEdBQ2xCLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUNyQjtTQUNGLENBQUMsRUFOWSxDQU1aLENBQUE7O0lBeUVKLENBQUM7SUF2RUMsd0JBQU0sR0FBTjtRQUFBLGlCQXNFQztRQXJFSyxJQUFBLEtB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