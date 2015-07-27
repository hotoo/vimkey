# Demo

---

<style type="text/css" media="screen">
  html,body{width:100%; height:100%;}
  #ct{position:fixed; bottom:0; right:1em;}
  #searchBox, #commandBox{position:fixed; bottom:0; left:5px; display:none; z-index:10000;}
</style>

<div id="ct"></div>
<div id="searchBox">
    /<input type="search" id="key" />
</div>
<div id="commandBox">
    :<input type="text" id="command" />
</div>
<div style="width:160%; height:300%;">
    <p>try:<p>
    <pre>
    [count]h
    [count]j
    [count]k
    [count]l
    [count]gg
    [count]G
    :alert(0)
    :any command.
    /keyword for search.
    </pre>
    <p>learnning more about <a href="http://www.vim.org/">Vim</a>.</p>
    <p>project home: <a href="https://github.com/hotoo/vimkey">Vimkey</a>,
    more fun see: <a href="https://github.com/hotoo/Vimlide">Vimlide</a></p>
</div>

````javascript
function $(id){return document.getElementById(id);}
function event_pause(evt){
  if (evt.stopPropagation) {
    evt.stopPropagation();
  } else {
    evt.cancelBubble = true;
  }
}
function event_stop(evt){
  if(evt.stopPropagation){
    evt.stopPropagation();
    evt.preventDefault();
  }else{
    evt.cancelBubble = true;
    evt.returnValue = false;
  }
}

var LINE_HEIGHT = 100;
var Vimkey = require('vimkey');
var searchBox = $("searchBox");
var searchIpt = $("key");

var normal = new Vimkey(document, {
  countable: true,
});
normal.counter = function(c){document.getElementById("ct").innerHTML = c;}
normal.map("j", function(evt, count){
  event_stop(evt);
  window.scrollBy(0, LINE_HEIGHT * (count || 1));
});

normal.map("k", function(evt, c){
  event_stop(evt);
  window.scrollBy(0, -(LINE_HEIGHT * (c || 1)));
});
normal.map("h", function(evt, c){
  event_stop(evt);
  window.scrollBy(-(LINE_HEIGHT * (c || 1)), 0);
});
normal.map("l", function(evt, c){
  event_stop(evt);
  window.scrollBy(LINE_HEIGHT * (c || 1), 0);
});
normal.map("gg", function(evt, c){
  event_stop(evt);
  window.scrollTo(0, (c - 1) * LINE_HEIGHT);
});
normal.map("G", function(evt, c){
  event_stop(evt);
  window.scrollTo(0, c||9999999);
});
normal.map("/", function(evt, c){
  event_stop(evt);
  searchBox.style.display = "block"; searchIpt.focus();
});
normal.map(":", function(evt, c){
  event_stop(evt);
  commandBox.style.display = "block"; commandIpt.focus();
});

function clearSearch(){
  searchIpt.value = "";
  searchIpt.blur();
  searchBox.style.display = "none";
}
var search = new Vimkey(searchIpt, {
  countable: false,
});
search.map("<CR>", function(){
  var key = searchIpt.value;
  clearSearch();
  alert('Search word: ' + key);
});
search.map("<Esc>", clearSearch, true);
search.map("<BS>", function(evt, c){
  if(searchIpt.value=="") {
    event_stop(evt);
    clearSearch();
  } else {
    event_pause(evt);
  }
});


function clearCommand(){
  commandIpt.value = "";
  commandIpt.blur();
  commandBox.style.display = "none";
}
var commandIpt = $("command");
var commandBox = $("commandBox");
var command = new Vimkey(commandIpt, {
  countable: false,
});
command.map("<CR>", function(){
  try {
    window.eval(commandIpt.value);
  } catch(ex) {
    alert("Command not supports.");
  }
  clearCommand();
});
command.map("<Esc>", clearCommand, true);
command.map("<BS>", function(evt, c){
  if(commandIpt.value=="") {
    event_stop(evt);
    clearCommand();
  } else {
    event_pause(evt);
  }
});
````
