define(["exports", "fable-core", "./fable_external/Fable.Helpers.Virtualdom-1054928770"], function (exports, _fableCore, _FableHelpers) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Clock = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var Clock = exports.Clock = function ($exports) {
        var normalizeNumber = $exports.normalizeNumber = function normalizeNumber(x) {
            return x < 10 ? _fableCore.String.fsFormat("0%i")(function (x) {
                return x;
            })(x) : String(x);
        };

        var Action = $exports.Action = function () {
            function Action(caseName, fields) {
                _classCallCheck(this, Action);

                this.Case = caseName;
                this.Fields = fields;
            }

            _createClass(Action, [{
                key: "Equals",
                value: function Equals(other) {
                    return _fableCore.Util.equalsUnions(this, other);
                }
            }, {
                key: "CompareTo",
                value: function CompareTo(other) {
                    return _fableCore.Util.compareUnions(this, other);
                }
            }]);

            return Action;
        }();

        _fableCore.Util.setInterfaces(Action.prototype, ["FSharpUnion", "System.IEquatable", "System.IComparable"], "MinimalFableSuave.App.Clock.Action");

        var Model = $exports.Model = function () {
            function Model(time, date) {
                _classCallCheck(this, Model);

                this.Time = time;
                this.Date = date;
            }

            _createClass(Model, [{
                key: "Equals",
                value: function Equals(other) {
                    return _fableCore.Util.equalsRecords(this, other);
                }
            }, {
                key: "CompareTo",
                value: function CompareTo(other) {
                    return _fableCore.Util.compareRecords(this, other);
                }
            }], [{
                key: "init",
                get: function get() {
                    return new Model("00:00:00", "1970/01/01");
                }
            }]);

            return Model;
        }();

        _fableCore.Util.setInterfaces(Model.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "MinimalFableSuave.App.Clock.Model");

        var update = $exports.update = function update(model, action) {
            var patternInput = function () {
                var datetime = action.Fields[0];
                var day = normalizeNumber(_fableCore.Date.day(datetime));
                var month = normalizeNumber(_fableCore.Date.month(datetime));

                var date = _fableCore.String.fsFormat("%i/%s/%s")(function (x) {
                    return x;
                })(_fableCore.Date.year(datetime))(month)(day);

                return [new Model(_fableCore.String.format("{0:HH:mm:ss}", datetime), date), new _fableCore.List()];
            }();

            var model_ = patternInput[0];
            var action_ = patternInput[1];
            return [model_, action_];
        };

        var view = $exports.view = function view(model) {
            return function () {
                var tagName = "div";
                return function (children) {
                    return new _FableHelpers.Html.Types.DomNode("Element", [[tagName, new _fableCore.List()], children]);
                };
            }()(_fableCore.List.ofArray([new _FableHelpers.Html.Types.DomNode("Text", [model.Date]), new _FableHelpers.Html.Types.DomNode("VoidElement", [["br", new _fableCore.List()]]), new _FableHelpers.Html.Types.DomNode("Text", [model.Time])]));
        };

        var tickProducer = $exports.tickProducer = function tickProducer(push) {
            window.setInterval(function (_arg1) {
                push(new Action("Tick", [_fableCore.Date.now()]));
                return null;
            }, 1000);
            push(new Action("Tick", [_fableCore.Date.now()]));
        };

        _FableHelpers.App.start((0, _FableHelpers.renderer)(), function (app) {
            return _FableHelpers.App.withProducer(function (push) {
                tickProducer(push);
            }, app);
        }(_FableHelpers.App.withStartNodeSelector("#app", _FableHelpers.App.createApp(Model.init, function (model) {
            return view(model);
        }, function (model) {
            return function (action) {
                return update(model, action);
            };
        }))));

        return $exports;
    }({});
});
//# sourceMappingURL=app.js.map