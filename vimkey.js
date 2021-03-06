
var KEY_CODE_MAP = {
  8  : ["<BS>"],              // Backspace
  9  : ["<Tab>"],
  12 : ["<Clear>"],
  13 : ["<CR>"],              // Enter / Return
  16 : ["<Shift>"],
  17 : ["<Control>"],         // Ctrl, Control
  18 : ["<Alt>"],
  19 : ["<Pause>"],           // Pause / Break
  20 : ["<CapsLock>"],
  27 : ["<Esc>"],             // Escape
  32 : ["<Space>"],
  33 : ["<PageUp>"],
  34 : ["<PageDown>"],
  35 : ["<End>"],
  36 : ["<Home>"],
  37 : ["<Left>"],
  38 : ["<Up>"],
  39 : ["<Right>"],
  40 : ["<Down>"],
  41 : ["<Select>"],
  42 : ["<Print>"],           // "'print",
  43 : ["<Execute>"],
  44 : ["<Screen>"],
  45 : ["<Insert>"],
  46 : ["<Delete>"],
  47 : ["<Help>"],
  48 : ["0", ")"],
  49 : ["1", "!"],
  50 : ["2", "@"],
  51 : ["3", "#"],
  52 : ["4", "$"],
  53 : ["5", "%"],
  54 : ["6", "^"],
  55 : ["7", "&"],
  56 : ["8", "*"],
  57 : ["9", "("],
  65 : ["a", "A"],
  66 : ["b", "B"],
  67 : ["c", "C"],
  68 : ["d", "D"],
  69 : ["e", "E"],
  70 : ["f", "F"],
  71 : ["g", "G"],
  72 : ["h", "H"],
  73 : ["i", "I"],
  74 : ["j", "J"],
  75 : ["k", "K"],
  76 : ["l", "L"],
  77 : ["m", "M"],
  78 : ["n", "N"],
  79 : ["o", "O"],
  80 : ["p", "P"],
  81 : ["q", "Q"],
  82 : ["r", "R"],
  83 : ["s", "S"],
  84 : ["t", "T"],
  85 : ["u", "U"],
  86 : ["v", "V"],
  87 : ["w", "W"],
  88 : ["x", "X"],
  89 : ["y", "Y"],
  90 : ["z", "Z"],
  91 : ["<Command>"],         // Left Mac Command Key / Left Window Key
  92 : ["<Window>"],          // Right Window Key
  93 : ["<Command>"],         // Right Mac Command Key / Select Key
  96 : ["0"],                 // "Numpad 0",
  97 : ["1"],                 // "Numpad 1",
  98 : ["2"],                 // "Numpad 2",
  99 : ["3"],                 // "Numpad 3",
  100: ["4"],                 // "Numpad 4",
  101: ["5"],                 // "Numpad 5",
  102: ["6"],                 // "Numpad 6",
  103: ["7"],                 // "Numpad 7",
  104: ["8"],                 // "Numpad 8",
  105: ["9"],                 // "Numpad 9",
  106: ["*"],                 // "Numpad *",
  107: ["+"],                 // "Numpad +",
  109: ["-"],                 // "Numpad -",
  110: ["."],                 // "Numpad .",
  111: ["/"],                 // "Numpad /",
  112: ["<F1>"],
  113: ["<F2>"],
  114: ["<F3>"],
  115: ["<F4>"],
  116: ["<F5>"],
  117: ["<F6>"],
  118: ["<F7>"],
  119: ["<F8>"],
  120: ["<F9>"],
  121: ["<F10>"],
  122: ["<F11>"],
  123: ["<F12>"],
  144: ["<NumberLock>"],
  145: ["<ScrollLock>"],      // "Scroll Lock",
  160: ["<Shift>"],           // "Shift (Left)",
  161: ["<Shift>"],           // "Shift (Right)",
  162: ["<Control>"],         // "Control (Left)",
  163: ["<Control>"],         // "Control (Right)",
  164: ["<Alt>"],             // "Alt key (Left)",
  165: ["<Alt>"],             // "Alt key (Right)",
  186: [";", ":"],            // "Semi-colon",
  187: ["=", "+"],            // "Equals", Mac
  188: [",", "<"],            // "Comma",
  189: ["-", "_"],            // "Minus", Mac
  190: [".", ">"],            // "Period",
  191: ["/", "?"],            // "Slash",
  192: ["`", "~"],            // "Tilde",
  219: ["[", "{"],            // "Bracket (Open)",
  220: ["\\", "|"],           // "Backslash", Mac
  221: ["]", "}"],            // "Bracket (Close)",
  222: ["'", '"'],            // "Quote",
  226: ["\\", "|"],           // "Backslash", XXX: this and 220?
};

function getKeyName(evt) {
  var keycode = evt.keyCode || evt.which;
  var keyname = KEY_CODE_MAP[keycode][0];
  if (evt.shiftKey && KEY_CODE_MAP[keycode][1]) {
    keyname = KEY_CODE_MAP[keycode][1];
  }
  return keyname;
}

function hasMap(object, key) {
  return object && object.hasOwnProperty(key) && isFunction(object[key]);
}

var E = {
    pause: function (evt){
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    },
    add : function(elem, evt, handler){
        if (elem.addEventListener) {
            elem.addEventListener(evt, handler, false);
        } else if(elem.attachEvent) {
            elem.attachEvent("on"+evt, handler);
        }
    }
};

var F = {
    createDelegate : function(instance, method) {
        return function() {
            return method.apply(instance, arguments);
        }
    },
};

function typeOf(type) {
  return function(object) {
    return Object.prototype.toString.call(object) === '[object ' + type + ']';
  }
}

var isFunction = typeOf('Function');

var DEFAULT_OPTIONS = {
  countable: false,
};
var Vimkey = function(container, options){
  this.options = options;
  this.autoClear = true;
  this.modeOn = false;
  this.history = "";
  this.count = "";
  this.HANDLER = {};
  // `keypress` event not trigger some key event, like delete.
  E.add(container, "keydown", F.createDelegate(this, this.handler));
};
// Duplicate mapping.
Vimkey.prototype.map = function(keys, callback, duplicate){
  if(!duplicate && hasMap(this.HANDLER, keys)){
    throw new Error("Duplicate mapping: "+keys);
  }
  if(!isFunction(callback)){return;}
  this.HANDLER[keys] = callback;
};
Vimkey.prototype.reset = function() {
    this.count = "";
    this.history = "";
    this.modeOn = true;
    this.counter(this.count);
};
Vimkey.prototype.counter = function(count){};
Vimkey.prototype.handler = function(evt){
    evt = evt || window.event;
    var keycode = evt.keyCode || evt.which;
    var keyname = getKeyName(evt);

    E.pause(evt);

    if(this.autoClear){
      if(this._timer){
        window.clearTimeout(this._timer);
        this._timer=null;
      }
      this._timer = window.setTimeout(this._reset, 2000);
    }

    if (keyname === '<Control>' || keyname === '<Shift>' || keyname === '<Alt>') {
      return false;
    }
    if (this.options.countable && /^[0-9]$/.test(keyname)) {
      this.count += keyname;
      this.counter(this.count);
      return false;
    }

    this.history += keyname;

    var keys;
    if (hasMap(this.HANDLER, this.history)) {
      keys = this.history;
    } else if (hasMap(this.HANDLER, keyname)) {
      keys = keyname;
    } else {
      return false
    }

    this.HANDLER[keys].call(this, evt, this.count === '' ? undefined : Number(this.count));
    this.reset();
    this.counter(this.count);
    return false;
};

module.exports = Vimkey;
