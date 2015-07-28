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

describe('vimkey', function() {

  var nvalue;
  var svalue;

  var normal = new Vimkey(document, {
    countable: true,
  });
  normal.map('j', function(evt, count) {
    nvalue = (count || 1) + 'J';
  });
  normal.map('gj', function(evt, count) {
    nvalue = (count || 1) + 'GJ';
  });
  normal.map('G', function(evt, count) {
    if (count === undefined) {
      count = 9999999;
    }
    nvalue = count + 'G';
  });

  var input = document.createElement('input');
  input.type = 'search';
  document.body.appendChild(input);

  var search = new Vimkey(input, {
    countable: false,
  });
  search.map('j', function() {
    svalue = 's:j';
  });
  search.map('100j', function() {
    svalue = 's:100j';
  });
  search.map('k', function() {
    svalue = 's:k';
  });

  beforeEach(function(){
    nvalue = '';
    svalue = '';
  });

  after(function(){
    document.body.removeChild(input);
  });

  describe('normal', function() {

    it('j', function() {
      keydown('J'.charCodeAt(0));
      expect(nvalue).to.eql('1J');
    });

    it('100j', function() {
      keydown('1'.charCodeAt(0));
      keydown('0'.charCodeAt(0));
      keydown('0'.charCodeAt(0));
      keydown('J'.charCodeAt(0));
      expect(nvalue).to.eql('100J');
    });

    it('gj', function() {
      keydown('G'.charCodeAt(0));
      keydown('J'.charCodeAt(0));
      expect(nvalue).to.eql('1GJ');
    });

    it('100gj', function() {
      keydown('1'.charCodeAt(0));
      keydown('0'.charCodeAt(0));
      keydown('0'.charCodeAt(0));
      keydown('G'.charCodeAt(0));
      keydown('J'.charCodeAt(0));
      expect(nvalue).to.eql('100GJ');
    });

    it('G', function() {
      keydown('G'.charCodeAt(0), null, null, true);
      expect(nvalue).to.eql('9999999G');
    });

    it('100G', function() {
      keydown('1'.charCodeAt(0));
      keydown('0'.charCodeAt(0));
      keydown('0'.charCodeAt(0));
      keydown('G'.charCodeAt(0), null, null, true);
      expect(nvalue).to.eql('100G');
    });

  });

  describe('search', function() {

    it('j', function() {
      keydown('J'.charCodeAt(0), null, input);
      expect(svalue).to.eql('s:j');
      expect(nvalue).to.eql('');
    });

    it('100j', function() {
      keydown('1'.charCodeAt(0), null, input);
      keydown('0'.charCodeAt(0), null, input);
      keydown('0'.charCodeAt(0), null, input);
      keydown('J'.charCodeAt(0), null, input);
      expect(svalue).to.eql('s:100j');
      expect(nvalue).to.eql('');
    });

    it('k', function() {
      keydown('K'.charCodeAt(0), null, input);
      expect(svalue).to.eql('s:k');
      expect(nvalue).to.eql('');
    });

    it('100k', function() {
      keydown('1'.charCodeAt(0), null, input);
      keydown('0'.charCodeAt(0), null, input);
      keydown('0'.charCodeAt(0), null, input);
      keydown('K'.charCodeAt(0), null, input);
      expect(svalue).to.eql('s:k');
      expect(nvalue).to.eql('');
    });

  });

});
