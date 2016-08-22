define(["exports", "fable-core"], function (exports, _fableCore) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.formatOption = formatOption;

  function formatOption(defaultValue, x) {
    return function () {
      var $var4 = x;

      if ($var4 != null) {
        return function (x_1) {
          return _fableCore.Util.toString(x_1);
        }($var4);
      } else {
        return $var4;
      }
    }() != null ? function () {
      var $var4 = x;

      if ($var4 != null) {
        return function (x_1) {
          return _fableCore.Util.toString(x_1);
        }($var4);
      } else {
        return $var4;
      }
    }() : defaultValue;
  }
});
//# sourceMappingURL=domain.js.map