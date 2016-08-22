"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.App = exports.Html = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createTree = createTree;
exports.render = render;
exports.renderer = renderer;

var _fableCore = require("fable-core");

var _virtualDom = require("virtual-dom");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Html = exports.Html = function ($exports) {
    var Types = $exports.Types = function ($exports) {
        var Attribute = $exports.Attribute = function Attribute(caseName, fields) {
            _classCallCheck(this, Attribute);

            this.Case = caseName;
            this.Fields = fields;
        };

        _fableCore.Util.setInterfaces(Attribute.prototype, ["FSharpUnion"], "Fable.Helpers.Virtualdom.Html.Types.Attribute");

        var DomNode = $exports.DomNode = function DomNode(caseName, fields) {
            _classCallCheck(this, DomNode);

            this.Case = caseName;
            this.Fields = fields;
        };

        _fableCore.Util.setInterfaces(DomNode.prototype, ["FSharpUnion"], "Fable.Helpers.Virtualdom.Html.Types.DomNode");

        return $exports;
    }({});

    var mapEventHandler = $exports.mapEventHandler = function mapEventHandler(mapping, e, f) {
        return new Types.Attribute("EventHandler", [[e, function ($var1) {
            return mapping(f($var1));
        }]]);
    };

    var mapAttributes = $exports.mapAttributes = function mapAttributes(mapping, attribute) {
        return attribute.Case === "Style" ? function () {
            var s = attribute.Fields[0];
            return new Types.Attribute("Style", [s]);
        }() : attribute.Case === "Property" ? function () {
            var kv = attribute.Fields[0];
            return new Types.Attribute("Property", [kv]);
        }() : attribute.Case === "Attribute" ? function () {
            var kv = attribute.Fields[0];
            return new Types.Attribute("Attribute", [kv]);
        }() : function () {
            var eb = attribute.Fields[0];
            var e = eb[0];
            var f = eb[1];
            return mapEventHandler(mapping, e, f);
        }();
    };

    var mapElem = $exports.mapElem = function mapElem(mapping, node_0, node_1) {
        var node = [node_0, node_1];
        var tag = node[0];
        var attrs = node[1];
        return [tag, _fableCore.List.map(function (attribute) {
            return mapAttributes(mapping, attribute);
        }, attrs)];
    };

    var mapVoidElem = $exports.mapVoidElem = function mapVoidElem(mapping, node_0, node_1) {
        var node = [node_0, node_1];
        var tag = node[0];
        var attrs = node[1];
        return [tag, _fableCore.List.map(function (attribute) {
            return mapAttributes(mapping, attribute);
        }, attrs)];
    };

    var map = $exports.map = function map(mapping, node) {
        return node.Case === "VoidElement" ? function () {
            var ve = node.Fields[0];
            return new Types.DomNode("VoidElement", [function () {
                var arg10_ = ve[0];
                var arg11_ = ve[1];
                return mapVoidElem(mapping, arg10_, arg11_);
            }()]);
        }() : node.Case === "Text" ? function () {
            var s = node.Fields[0];
            return new Types.DomNode("Text", [s]);
        }() : node.Case === "WhiteSpace" ? function () {
            var ws = node.Fields[0];
            return new Types.DomNode("WhiteSpace", [ws]);
        }() : node.Case === "Svg" ? function () {
            var ns = node.Fields[1];
            var e = node.Fields[0];
            return new Types.DomNode("Element", [function () {
                var arg10_ = e[0];
                var arg11_ = e[1];
                return mapElem(mapping, arg10_, arg11_);
            }(), _fableCore.List.map(function (node_1) {
                return map(mapping, node_1);
            }, ns)]);
        }() : function () {
            var ns = node.Fields[1];
            var e = node.Fields[0];
            return new Types.DomNode("Element", [function () {
                var arg10_ = e[0];
                var arg11_ = e[1];
                return mapElem(mapping, arg10_, arg11_);
            }(), _fableCore.List.map(function (node_1) {
                return map(mapping, node_1);
            }, ns)]);
        }();
    };

    var Tags = $exports.Tags = function ($exports) {
        return $exports;
    }({});

    var Attributes = $exports.Attributes = function ($exports) {
        return $exports;
    }({});

    var Events = $exports.Events = function ($exports) {
        return $exports;
    }({});

    var Svg = $exports.Svg = function ($exports) {
        var svgNS = $exports.svgNS = function svgNS() {
            return new Types.Attribute("Property", [["namespace", "http://www.w3.org/2000/svg"]]);
        };

        return $exports;
    }({});

    return $exports;
}({});

var App = exports.App = function ($exports) {
    var mapAction = $exports.mapAction = function mapAction(mapping, action, x) {
        action(function ($var2) {
            return x(mapping($var2));
        });
    };

    var mapActions = $exports.mapActions = function mapActions(m) {
        var mapping = function mapping(action) {
            return function (x) {
                mapAction(m, action, x);
            };
        };

        return function (list) {
            return _fableCore.List.map(mapping, list);
        };
    };

    var toActionList = $exports.toActionList = function toActionList(a) {
        return _fableCore.List.ofArray([a]);
    };

    var AppEvents = $exports.AppEvents = function () {
        function AppEvents(caseName, fields) {
            _classCallCheck(this, AppEvents);

            this.Case = caseName;
            this.Fields = fields;
        }

        _createClass(AppEvents, [{
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

        return AppEvents;
    }();

    _fableCore.Util.setInterfaces(AppEvents.prototype, ["FSharpUnion", "System.IEquatable", "System.IComparable"], "Fable.Helpers.Virtualdom.App.AppEvents");

    var RenderState = $exports.RenderState = function () {
        function RenderState(caseName, fields) {
            _classCallCheck(this, RenderState);

            this.Case = caseName;
            this.Fields = fields;
        }

        _createClass(RenderState, [{
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

        return RenderState;
    }();

    _fableCore.Util.setInterfaces(RenderState.prototype, ["FSharpUnion", "System.IEquatable", "System.IComparable"], "Fable.Helpers.Virtualdom.App.RenderState");

    var App = $exports.App = function App(model, view, update, initMessage, actions, producers, node, currentTree, subscribers, nodeSelector, renderState) {
        _classCallCheck(this, App);

        this.Model = model;
        this.View = view;
        this.Update = update;
        this.InitMessage = initMessage;
        this.Actions = actions;
        this.Producers = producers;
        this.Node = node;
        this.CurrentTree = currentTree;
        this.Subscribers = subscribers;
        this.NodeSelector = nodeSelector;
        this.RenderState = renderState;
    };

    _fableCore.Util.setInterfaces(App.prototype, ["FSharpRecord"], "Fable.Helpers.Virtualdom.App.App");

    var ScheduleMessage = $exports.ScheduleMessage = function ScheduleMessage(caseName, fields) {
        _classCallCheck(this, ScheduleMessage);

        this.Case = caseName;
        this.Fields = fields;
    };

    _fableCore.Util.setInterfaces(ScheduleMessage.prototype, ["FSharpUnion"], "Fable.Helpers.Virtualdom.App.ScheduleMessage");

    var AppMessage = $exports.AppMessage = function AppMessage(caseName, fields) {
        _classCallCheck(this, AppMessage);

        this.Case = caseName;
        this.Fields = fields;
    };

    _fableCore.Util.setInterfaces(AppMessage.prototype, ["FSharpUnion"], "Fable.Helpers.Virtualdom.App.AppMessage");

    var Renderer = $exports.Renderer = function Renderer(render, diff, patch, createElement) {
        _classCallCheck(this, Renderer);

        this.Render = render;
        this.Diff = diff;
        this.Patch = patch;
        this.CreateElement = createElement;
    };

    _fableCore.Util.setInterfaces(Renderer.prototype, ["FSharpRecord"], "Fable.Helpers.Virtualdom.App.Renderer");

    var createApp = $exports.createApp = function createApp(model, view, update) {
        var NodeSelector = null;
        var InitMessage = null;
        var Producers = new _fableCore.List();

        var Subscribers = _fableCore.Map.create(null, new _fableCore.GenericComparer(function (x, y) {
            return x < y ? -1 : x > y ? 1 : 0;
        }));

        var CurrentTree = null;
        var RenderState_1 = new RenderState("NoRequest", []);
        return new App(model, view, update, InitMessage, new _fableCore.List(), Producers, null, CurrentTree, Subscribers, NodeSelector, RenderState_1);
    };

    var createSimpleApp = $exports.createSimpleApp = function createSimpleApp(model, view, update) {
        return createApp(model, view, function (x) {
            return function (y) {
                return [update(x)(y), new _fableCore.List()];
            };
        });
    };

    var withStartNodeSelector = $exports.withStartNodeSelector = function withStartNodeSelector(selector, app) {
        var NodeSelector = selector;
        return new App(app.Model, app.View, app.Update, app.InitMessage, app.Actions, app.Producers, app.Node, app.CurrentTree, app.Subscribers, NodeSelector, app.RenderState);
    };

    var withInitMessage = $exports.withInitMessage = function withInitMessage(msg, app) {
        var InitMessage = msg;
        return new App(app.Model, app.View, app.Update, InitMessage, app.Actions, app.Producers, app.Node, app.CurrentTree, app.Subscribers, app.NodeSelector, app.RenderState);
    };

    var withProducer = $exports.withProducer = function withProducer(p, app) {
        var Producers = _fableCore.List.ofArray([p], app.Producers);

        return new App(app.Model, app.View, app.Update, app.InitMessage, app.Actions, Producers, app.Node, app.CurrentTree, app.Subscribers, app.NodeSelector, app.RenderState);
    };

    var withSubscriber = $exports.withSubscriber = function withSubscriber(subscriberId, subscriber, app) {
        var subsribers = function (table) {
            return _fableCore.Map.add(subscriberId, subscriber, table);
        }(app.Subscribers);

        return new App(app.Model, app.View, app.Update, app.InitMessage, app.Actions, app.Producers, app.Node, app.CurrentTree, subsribers, app.NodeSelector, app.RenderState);
    };

    var createScheduler = $exports.createScheduler = function createScheduler() {
        return _fableCore.MailboxProcessor.start(function (inbox) {
            var loop = function loop(unitVar0) {
                return function (builder_) {
                    return builder_.Delay(function (unitVar) {
                        return builder_.Bind(inbox.receive(), function (_arg1) {
                            var message = _arg1;
                            var milliseconds = message.Fields[0];
                            var cb = message.Fields[1];
                            window.setTimeout(cb, milliseconds);
                            return builder_.ReturnFrom(loop());
                        });
                    });
                }(_fableCore.defaultAsyncBuilder);
            };

            return loop();
        });
    };

    var createFirstLoopState = $exports.createFirstLoopState = function createFirstLoopState(renderTree, startElem, post, renderer, state) {
        var tree = renderTree(state.View)(post)(state.Model);
        var rootNode = renderer.CreateElement(tree);
        startElem.appendChild(rootNode);
        {
            var matchValue = state.InitMessage;

            if (matchValue != null) {
                var init = matchValue;
                init(post);
            }
        }
        var CurrentTree = tree;
        var _Node = rootNode;
        return new App(state.Model, state.View, state.Update, state.InitMessage, state.Actions, state.Producers, _Node, CurrentTree, state.Subscribers, state.NodeSelector, state.RenderState);
    };

    var handleMessage = $exports.handleMessage = function handleMessage(msg, notify, schedule, state) {
        notify(state.Subscribers)(new AppEvents("ActionReceived", [msg]));
        var patternInput = state.Update(state.Model)(msg);
        var model_ = patternInput[0];
        var actions = patternInput[1];

        var renderState = function () {
            var matchValue = state.RenderState;

            if (matchValue.Case === "InProgress") {
                return new RenderState("InProgress", []);
            } else {
                schedule();
                return new RenderState("InProgress", []);
            }
        }();

        var Actions = _fableCore.List.append(state.Actions, actions);

        return new App(model_, state.View, state.Update, state.InitMessage, Actions, state.Producers, state.Node, state.CurrentTree, state.Subscribers, state.NodeSelector, renderState);
    };

    var handleDraw = $exports.handleDraw = function handleDraw(renderTree, renderer, post, notify, rootNode, currentTree, state) {
        var matchValue = state.RenderState;

        if (matchValue.Case === "NoRequest") {
            throw "Shouldn't happen";
        } else {
            notify(state.Subscribers)(new AppEvents("DrawStarted", []));
            var model = state.Model;
            var tree = renderTree(state.View)(post)(model);
            var patches = renderer.Diff(currentTree)(tree);
            renderer.Patch(rootNode)(patches);

            _fableCore.Seq.iterate(function (i) {
                i(post);
            }, state.Actions);

            notify(state.Subscribers)(new AppEvents("ModelChanged", [model, state.Model]));
            var RenderState_1 = new RenderState("NoRequest", []);
            var CurrentTree = tree;
            var Actions = new _fableCore.List();
            return new App(state.Model, state.View, state.Update, state.InitMessage, Actions, state.Producers, state.Node, CurrentTree, state.Subscribers, state.NodeSelector, RenderState_1);
        }
    };

    var start = $exports.start = function start(renderer, app) {
        var renderTree = function renderTree(view) {
            return function (handler) {
                return function (model) {
                    return renderer.Render(handler)(view(model));
                };
            };
        };

        var startElem = function () {
            var matchValue = app.NodeSelector;

            if (matchValue != null) {
                var sel = matchValue;
                return document.body.querySelector(sel);
            } else {
                return document.body;
            }
        }();

        var scheduler = createScheduler();
        return _fableCore.MailboxProcessor.start(function (inbox) {
            var post = function post(message) {
                inbox.post(new AppMessage("Message", [message]));
            };

            var notifySubscribers = function notifySubscribers(subs) {
                return function (model) {
                    _fableCore.Map.iterate(function (key, handler) {
                        handler(model);
                    }, subs);
                };
            };

            _fableCore.Seq.iterate(function (p) {
                p(post);
            }, app.Producers);

            var schedule = function schedule(unitVar0) {
                scheduler.post(new ScheduleMessage("PingIn", [1000 / 60, function (unitVar0_1) {
                    inbox.post(new AppMessage("Draw", []));
                }]));
            };

            var loop = function loop(state) {
                return function (builder_) {
                    return builder_.Delay(function (unitVar) {
                        var matchValue = [state.Node, state.CurrentTree];

                        if (matchValue[0] != null) {
                            if (matchValue[1] != null) {
                                var currentTree = matchValue[1];
                                var rootNode = matchValue[0];
                                return builder_.Bind(inbox.receive(), function (_arg1) {
                                    var message = _arg1;

                                    if (message.Case === "Message") {
                                        var msg = message.Fields[0];
                                        var state_ = handleMessage(msg, notifySubscribers, schedule, state);
                                        return builder_.ReturnFrom(loop(state_));
                                    } else {
                                        if (message.Case === "Draw") {
                                            var state_ = handleDraw(renderTree, renderer, post, notifySubscribers, rootNode, currentTree, state);
                                            return builder_.ReturnFrom(loop(state_));
                                        } else {
                                            return builder_.ReturnFrom(loop(state));
                                        }
                                    }
                                });
                            } else {
                                throw "Shouldn't happen";
                                return builder_.Zero();
                            }
                        } else {
                            var state_ = createFirstLoopState(renderTree, startElem, post, renderer, state);
                            return builder_.ReturnFrom(loop(state_));
                        }
                    });
                }(_fableCore.defaultAsyncBuilder);
            };

            return loop(app);
        });
    };

    return $exports;
}({});

function createTree(handler, tag, attributes, children) {
    var toAttrs = function toAttrs(attrs) {
        var elAttributes = function (_arg2) {
            return _arg2.tail == null ? null : function () {
                var v = _arg2;
                return ["attributes", _fableCore.Util.createObj(v)];
            }();
        }(_fableCore.List.choose(function (x) {
            return x;
        }, _fableCore.List.map(function (_arg1) {
            return _arg1.Case === "Attribute" ? function () {
                var v = _arg1.Fields[0][1];
                var k = _arg1.Fields[0][0];
                return [k, v];
            }() : null;
        }, attrs)));

        var props = _fableCore.List.map(function (_arg4) {
            return _arg4.Case === "Style" ? function () {
                var style = _arg4.Fields[0];
                return ["style", _fableCore.Util.createObj(style)];
            }() : _arg4.Case === "Property" ? function () {
                var v = _arg4.Fields[0][1];
                var k = _arg4.Fields[0][0];
                return [k, v];
            }() : _arg4.Case === "EventHandler" ? function () {
                var f = _arg4.Fields[0][1];
                var ev = _arg4.Fields[0][0];
                return [ev, function ($var3) {
                    return handler(f($var3));
                }];
            }() : function () {
                throw "Shouldn't happen";
            }();
        }, _fableCore.List.filter(function (_arg3) {
            return _arg3.Case === "Attribute" ? false : true;
        }, attrs));

        return _fableCore.Util.createObj(elAttributes != null ? function () {
            var x = elAttributes;
            return _fableCore.List.ofArray([x], props);
        }() : props);
    };

    var elem = (0, _virtualDom.h)(tag, toAttrs(attributes), Array.from(children));
    return elem;
}

function render(handler, node) {
    var $target0 = function $target0(attrs, nodes, tag) {
        return createTree(handler, tag, attrs, _fableCore.List.map(function (node_1) {
            return render(handler, node_1);
        }, nodes));
    };

    if (node.Case === "Svg") {
        return $target0(node.Fields[0][1], node.Fields[1], node.Fields[0][0]);
    } else {
        if (node.Case === "VoidElement") {
            var tag = node.Fields[0][0];
            var attrs = node.Fields[0][1];
            return createTree(handler, tag, attrs, new _fableCore.List());
        } else {
            if (node.Case === "Text") {
                var str = node.Fields[0];
                return str;
            } else {
                if (node.Case === "WhiteSpace") {
                    var str = node.Fields[0];
                    return str;
                } else {
                    return $target0(node.Fields[0][1], node.Fields[1], node.Fields[0][0]);
                }
            }
        }
    }
}

function renderer() {
    return new App.Renderer(function (handler) {
        return function (node) {
            return render(handler, node);
        };
    }, function (tree1) {
        return function (tree2) {
            return (0, _virtualDom.diff)(tree1, tree2);
        };
    }, function (node) {
        return function (patches) {
            return (0, _virtualDom.patch)(node, patches);
        };
    }, function (e) {
        return (0, _virtualDom.create)(e);
    });
}
//# sourceMappingURL=Fable.Helpers.Virtualdom-1535947195.js.map