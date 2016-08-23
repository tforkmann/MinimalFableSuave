define(["exports", "fable-core", "./../fable_external/Fable.Helpers.Virtualdom-1054928770"], function (exports, _fableCore, _FableHelpers) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.initModel = exports.Actions = exports.SudokuAppState = exports.SudokuSolver = undefined;
    exports.update = update;
    exports.maxlength = maxlength;
    exports.view = view;

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

    var SudokuSolver = exports.SudokuSolver = function ($exports) {
        var rows = $exports.rows = function rows() {
            return function (x) {
                return x;
            };
        };

        var cols = $exports.cols = function cols(sudoku) {
            return Array.from(_fableCore.Seq.mapIndexed(function (a, row) {
                return Int32Array.from(_fableCore.Seq.mapIndexed(function (b, cell) {
                    return sudoku[b][a];
                }, row));
            }, sudoku));
        };

        var getBoxIndex = $exports.getBoxIndex = function getBoxIndex(count, row, col) {
            var n = ~~(row / count);
            var m = ~~(col / count);
            return n * count + m;
        };

        var boxes = $exports.boxes = function boxes(sudoku) {
            var d = Math.floor(Math.sqrt(sudoku.length));
            var list = [];

            for (var a = 0; a <= d * d - 1; a++) {
                list.push([]);
            }

            for (var a = 0; a <= sudoku.length - 1; a++) {
                for (var b = 0; b <= sudoku.length - 1; b++) {
                    list[getBoxIndex(d, a, b)].push(sudoku[a][b]);
                }
            }

            return _fableCore.Seq.map(function (source) {
                return Int32Array.from(source);
            }, list);
        };

        var toSudoku = $exports.toSudoku = function toSudoku(x) {
            return Array.from(_fableCore.Seq.map(function (source) {
                return Int32Array.from(source);
            }, x));
        };

        var allUnique = $exports.allUnique = function allUnique(numbers) {
            var set = new Set();
            return _fableCore.Seq.forAll(function (arg00) {
                return _fableCore.Set.addInPlace(arg00, set);
            }, _fableCore.Seq.filter(function () {
                var x = 0;
                return function (y) {
                    return x !== y;
                };
            }(), numbers));
        };

        var solvable = $exports.solvable = function solvable(sudoku) {
            return _fableCore.Seq.forAll(function (numbers) {
                return allUnique(numbers);
            }, _fableCore.Seq.append(boxes(sudoku), _fableCore.Seq.append(cols(sudoku), rows()(sudoku))));
        };

        var replaceAtPos = $exports.replaceAtPos = function replaceAtPos(x, row, col, newValue) {
            return Array.from(_fableCore.Seq.delay(function (unitVar) {
                return _fableCore.Seq.map(function (a) {
                    return Int32Array.from(_fableCore.Seq.delay(function (unitVar_1) {
                        return _fableCore.Seq.map(function (b) {
                            return (a === row ? b === col : false) ? newValue : x[a][b];
                        }, _fableCore.Seq.range(0, x.length - 1));
                    }));
                }, _fableCore.Seq.range(0, x.length - 1));
            }));
        };

        var substitute = $exports.substitute = function substitute(row, col, x) {
            var patternInput = col >= x.length ? [row + 1, 0] : [row, col];
            var b = patternInput[1];
            var a = patternInput[0];

            if (a >= x.length) {
                return _fableCore.Seq.delay(function (unitVar) {
                    return _fableCore.Seq.singleton(x);
                });
            } else {
                if (x[a][b] === 0) {
                    return _fableCore.Seq.concat(_fableCore.Seq.map(function () {
                        var col_1 = b + 1;
                        return function (x_1) {
                            return substitute(a, col_1, x_1);
                        };
                    }(), function (source) {
                        return _fableCore.Seq.filter(function (sudoku) {
                            return solvable(sudoku);
                        }, source);
                    }(_fableCore.Seq.map(function (newValue) {
                        return replaceAtPos(x, a, b, newValue);
                    }, _fableCore.Seq.toList(_fableCore.Seq.range(1, x.length))))));
                } else {
                    return substitute(a, b + 1, x);
                }
            }
        };

        var getFirstSolution = $exports.getFirstSolution = function ($var5) {
            return _fableCore.Seq.head(substitute(0, 0, $var5));
        };

        return $exports;
    }({});

    var SudokuAppState = exports.SudokuAppState = function () {
        function SudokuAppState(sudoku) {
            _classCallCheck(this, SudokuAppState);

            this.Sudoku = sudoku;
        }

        _createClass(SudokuAppState, [{
            key: "Equals",
            value: function Equals(other) {
                return _fableCore.Util.equalsRecords(this, other);
            }
        }, {
            key: "CompareTo",
            value: function CompareTo(other) {
                return _fableCore.Util.compareRecords(this, other);
            }
        }]);

        return SudokuAppState;
    }();

    _fableCore.Util.setInterfaces(SudokuAppState.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "MinimalFableSuave.FrontEnd.Pages.Fabletest.SudokuAppState");

    var Actions = exports.Actions = function () {
        function Actions(caseName, fields) {
            _classCallCheck(this, Actions);

            this.Case = caseName;
            this.Fields = fields;
        }

        _createClass(Actions, [{
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

        return Actions;
    }();

    _fableCore.Util.setInterfaces(Actions.prototype, ["FSharpUnion", "System.IEquatable", "System.IComparable"], "MinimalFableSuave.FrontEnd.Pages.Fabletest.Actions");

    function update(model, command) {
        return function (m) {
            return [m, new _fableCore.List()];
        }(command.Case === "ChangeBox" ? function () {
            var y = command.Fields[0][1];
            var x = command.Fields[0][0];
            var v = command.Fields[1];
            model[x][y] = v;
            return model;
        }() : SudokuSolver.getFirstSolution(model));
    }

    var initModel = exports.initModel = SudokuSolver.toSudoku(_fableCore.List.ofArray([_fableCore.List.ofArray([0, 0, 8, 3, 0, 0, 6, 0, 0]), _fableCore.List.ofArray([0, 0, 4, 0, 0, 0, 0, 1, 0]), _fableCore.List.ofArray([6, 7, 0, 0, 8, 0, 0, 0, 0]), _fableCore.List.ofArray([0, 1, 6, 4, 3, 0, 0, 0, 0]), _fableCore.List.ofArray([0, 0, 0, 7, 9, 0, 0, 2, 0]), _fableCore.List.ofArray([0, 9, 0, 0, 0, 0, 4, 0, 1]), _fableCore.List.ofArray([0, 0, 0, 9, 1, 0, 0, 0, 5]), _fableCore.List.ofArray([0, 0, 3, 0, 5, 0, 0, 0, 2]), _fableCore.List.ofArray([0, 5, 0, 0, 0, 0, 0, 7, 4])]));

    function maxlength(i) {
        return new _FableHelpers.Html.Types.Attribute("Attribute", [["maxlength", String(i)]]);
    }

    function view(model) {
        var inputs = function () {
            var tagName = "div";
            return function (children) {
                return new _FableHelpers.Html.Types.DomNode("Element", [[tagName, new _fableCore.List()], children]);
            };
        }()(_fableCore.Seq.toList(_fableCore.Seq.delay(function (unitVar) {
            return _fableCore.Seq.map(function (i) {
                return function () {
                    var tagName = "div";
                    return function (children) {
                        return new _FableHelpers.Html.Types.DomNode("Element", [[tagName, new _fableCore.List()], children]);
                    };
                }()(_fableCore.Seq.toList(_fableCore.Seq.delay(function (unitVar_1) {
                    return _fableCore.Seq.map(function (j) {
                        return new _FableHelpers.Html.Types.DomNode("VoidElement", [["input", _fableCore.List.ofArray([maxlength(1), new _FableHelpers.Html.Types.Attribute("Property", [["value", function () {
                            var matchValue = model[i][j];

                            if (matchValue === 0) {
                                return "";
                            } else {
                                var v = matchValue;
                                return String(v);
                            }
                        }()]]), new _FableHelpers.Html.Types.Attribute("EventHandler", [["oninput", function (e) {
                            return function (x) {
                                return new Actions("ChangeBox", [[i, j], Math.floor(x)]);
                            }(e.target.value);
                        }]])])]]);
                    }, _fableCore.Seq.range(0, model.length - 1));
                })));
            }, _fableCore.Seq.range(0, model.length - 1));
        })));

        return function () {
            var tagName = "div";
            return function (children) {
                return new _FableHelpers.Html.Types.DomNode("Element", [[tagName, new _fableCore.List()], children]);
            };
        }()(_fableCore.List.ofArray([function () {
            var tagName = "h1";
            return function (children) {
                return new _FableHelpers.Html.Types.DomNode("Element", [[tagName, new _fableCore.List()], children]);
            };
        }()(_fableCore.List.ofArray([new _FableHelpers.Html.Types.DomNode("Text", ["Sudoku"])])), function () {
            var tagName = "div";
            return function (children) {
                return new _FableHelpers.Html.Types.DomNode("Element", [[tagName, new _fableCore.List()], children]);
            };
        }()(_fableCore.List.ofArray([inputs, new _FableHelpers.Html.Types.DomNode("VoidElement", [["br", new _fableCore.List()]]), function () {
            var tagName = "button";
            return function (children) {
                return new _FableHelpers.Html.Types.DomNode("Element", [[tagName, _fableCore.List.ofArray([new _FableHelpers.Html.Types.Attribute("Attribute", [["class", "button"]]), new _FableHelpers.Html.Types.Attribute("EventHandler", [["onclick", function (_arg1) {
                    return new Actions("Solve", []);
                }]])])], children]);
            };
        }()(_fableCore.List.ofArray([new _FableHelpers.Html.Types.DomNode("Text", ["Solve"])]))]))]));
    }

    _FableHelpers.App.start((0, _FableHelpers.renderer)(), _FableHelpers.App.withSubscriber("allseeingeye", function (x) {
        window.console.log("Something happened: ", x);
    }, _FableHelpers.App.withStartNodeSelector("#todoapp", _FableHelpers.App.createApp(initModel, function (model) {
        return view(model);
    }, function (model) {
        return function (command) {
            return update(model, command);
        };
    }))));
});
//# sourceMappingURL=fabletest.js.map