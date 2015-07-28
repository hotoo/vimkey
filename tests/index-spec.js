var expect = require('expect.js');
var Vimkey = require('../vimkey');

function keydown(code, modifiers, el, shiftKey){
  var event = document.createEvent('Event');
  event.initEvent('keydown', true, true);
  event.keyCode = code;
  event.shiftKey = shiftKey;
  if (modifiers && modifiers.length > 0)
      for(i in modifiers) event[modifierMap[modifiers[i]]] = true;
  (el||document).dispatchEvent(event);
}

function keyup(code, el){
  var event = document.createEvent('Event');
  event.initEvent('keyup', true, true);
  event.keyCode = code;
  (el||document).dispatchEvent(event);
}

describe('vimkey', function() {

  var value;
  var normal = new Vimkey(document, {
    countable: true,
  });
  normal.map('j', function(evt, count) {
    value = (count || 1) + 'J';
  });
  normal.map('gj', function(evt, count) {
    value = (count || 1) + 'GJ';
  });
  normal.map('G', function(evt, count) {
    if (count === undefined) {
      count = 9999999;
    }
    value = count + 'G';
  });

  it('j', function() {
    keydown('J'.charCodeAt(0));
    expect(value).to.eql('1J');
  });

  it('100j', function() {
    keydown('1'.charCodeAt(0));
    keydown('0'.charCodeAt(0));
    keydown('0'.charCodeAt(0));
    keydown('J'.charCodeAt(0));
    expect(value).to.eql('100J');
  });

  it('gj', function() {
    keydown('G'.charCodeAt(0));
    keydown('J'.charCodeAt(0));
    expect(value).to.eql('1GJ');
  });

  it('100gj', function() {
    keydown('1'.charCodeAt(0));
    keydown('0'.charCodeAt(0));
    keydown('0'.charCodeAt(0));
    keydown('G'.charCodeAt(0));
    keydown('J'.charCodeAt(0));
    expect(value).to.eql('100GJ');
  });

  it('G', function() {
    keydown('G'.charCodeAt(0), null, null, true);
    expect(value).to.eql('9999999G');
  });

  it('100G', function() {
    keydown('1'.charCodeAt(0));
    keydown('0'.charCodeAt(0));
    keydown('0'.charCodeAt(0));
    keydown('G'.charCodeAt(0), null, null, true);
    expect(value).to.eql('100G');
  });

});
