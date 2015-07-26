/**
 * @overview
 *
 * @author 闲耘™ (hotoo.cn[AT]gmail.com)
 * @version 2011/07/07
 */

var E = {
    KEY_BACKSPACE: 8,
    KEY_TAB     : 9,
    KEY_RETURN  : 13,
    KEY_SHIFT   : 16,
    KEY_CTRL    : 17,
    KEY_CAPSLOCK: 20,
    KEY_ESC     : 27,
    KEY_LEFT    : 37,
    KEY_UP      : 38,
    KEY_RIGHT   : 39,
    KEY_DOWN    : 40,
    KEY_DELETE  : 46,
    KEY_HOME    : 36,
    KEY_END     : 35,
    KEY_PAGEUP  : 33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT  : 45,
    KEY_0       : 48,
    KEY_1       : 49,
    KEY_2       : 50,
    KEY_3       : 51,
    KEY_4       : 52,
    KEY_5       : 53,
    KEY_6       : 54,
    KEY_7       : 55,
    KEY_8       : 56,
    KEY_9       : 57,
    KEY_WINDOWS : 91,
    KEY_COMMA   : 188,
    KEY_SEMICOLON: 186,
    KEY_QUOTATION: 222,
    KEY_SIGN    : 49,
    stop : function(evt){
        if(evt.stopPropagation){
            evt.stopPropagation();
            evt.preventDefault();
        }else{
            evt.cancelBubble = true;
            evt.returnValue = false;
        }
    },
    pause : function(evt){
        if(evt.stopPropagation){
            evt.stopPropagation();
            //evt.preventDefault();
        }else{
            evt.cancelBubble = true;
            //evt.returnValue = false;
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
    }
};

var Vimkey = function(container){
    this.autoClear = true;
    this.modeOn = false;
    this.history = [];
    this.count = "";
    this.HANDLER = {};
    E.add(container, "keypress", F.createDelegate(this, this.handler));
    this._reset = F.createDelegate(this, this.reset);
    this.map("<Esc>", this._reset);
};
// Duplicate mapping.
Vimkey.prototype.map = function(keys, callback, duplicate){
    if(!duplicate && (this.HANDLER.hasOwnProperty(keys) &&
      "function"==typeof(this.HANDLER[keys]))){
        throw new Error("Duplicate mapping: "+keys);
    }
    if(typeof(callback) != "function"){return;}
    this.HANDLER[keys] = callback;
};
Vimkey.prototype.reset = function(){
    this.count = "";
    this.history.length = 0;
    this.modeOn = true;
    this.counter(this.count);
};
Vimkey.prototype.counter = function(count){};
Vimkey.prototype.handler = function(evt){
    evt = evt || window.event;
    var keycode = evt.keyCode || evt.which,
        keyname;

    if(this.autoClear){
        if(this._timer){window.clearTimeout(this._timer); this._timer=null;}
        this._timer = window.setTimeout(this._reset, 2000);
    }

    switch(keycode){
    case E.KEY_ESC:
        keyname = "<Esc>";
        break;
    case E.KEY_BACKSPACE:
        keyname = "<BS>";
        break;
    case E.KEY_TAB:
        keyname = "<Tab>";
        break;
    case E.KEY_RETURN:
        keyname = "<CR>";
        break;
    case E.KEY_SHIFT:
    case E.KEY_CTRL:
        return false;
    case E.KEY_CAPSLOCK:
        keyname = "<CapsLock>";
        break;
    case E.KEY_LEFT:
        keyname = "<Left>";
        break;
    case E.KEY_UP:
        keyname = "<Up>";
        break;
    case E.KEY_RIGHT:
        keyname = "<Right>";
        break;
    case E.KEY_DOWN:
        keyname = "<Down>";
        break;
    case E.KEY_0:
        // "0" 开始的量词是没有意义的，可以直接当作命令。
        // 所以这里排除了这种情况。
        if(this.history.length>0 || !this.count){
            keyname="0";
        }else{
            this.count+="0";
            this.counter(this.count);
            return false;
        }
        break;
    case E.KEY_1:
    case E.KEY_2:
    case E.KEY_3:
    case E.KEY_4:
    case E.KEY_5:
    case E.KEY_6:
    case E.KEY_7:
    case E.KEY_8:
    case E.KEY_9:
        this.count += String.fromCharCode(keycode);
        this.counter(this.count);
        return false;
    default:
        keyname = String.fromCharCode(keycode);
        break;
    }

    if(!keyname){return false;}
    this.history.push(keyname);

    E.pause(evt);

    // Note: 优先考虑处理当前键的映射函数，避免未映射到的键加在 history
    // 中影响到后续映射无法执行。
    // 比如命令模式没有映射普通的 a,b,c... 键，这些按键会一直 push 到
    // history 中，如果只考虑 history+<CR> 的话会导致映射的 <CR> 键
    // 无法被触发。
    // TODO: 缺点是，如果同时映射了 j 和 gj，则 gj 永远都无法被触发。
    // 目前已知的方案是：针对 <Esc>, <Tab>, <CR> 等特殊键特殊处理。
    var keys = null;
    if(this.HANDLER.hasOwnProperty(keyname) &&
      "function"==typeof(this.HANDLER[keyname])){
        keys = keyname;
    }else if(this.HANDLER.hasOwnProperty(keys = this.history.join("")) &&
      "function"==typeof(this.HANDLER[keys])){
        //keys = this.history.join("");
    }else{
        return false;
    }
    this.HANDLER[keys].call(this, this.count, evt);
    this.reset();
    this.counter(this.count);
    return false;
};

module.exports = Vimkey;
