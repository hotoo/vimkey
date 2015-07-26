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

var Vimkey = require('vimkey');
var searchBox = $("searchBox");
var searchIpt = $("key");

var normal = new Vimkey(document);
normal.counter = function(c){document.getElementById("ct").innerHTML = c;}
normal.map("j", function(c){window.scrollBy(0, 40*(c||1))});
normal.map("k", function(c){window.scrollBy(0, -40*(c||1))});
normal.map("h", function(c){window.scrollBy(-40*(c||1), 0)});
normal.map("l", function(c){window.scrollBy(40*(c||1), 0)});
normal.map("gg", function(c){window.scrollTo(0, c||0)});
normal.map("G", function(c){window.scrollTo(0, c||9999999)});
normal.map("/", function(c){searchBox.style.display = "block"; searchIpt.focus();});
normal.map(":", function(c){commandBox.style.display = "block"; commandIpt.focus();});

function clearSearch(){
  searchIpt.value = "";
  searchIpt.blur();
  searchBox.style.display = "none";
}
var search = new Vimkey(searchIpt);
search.map("<CR>", function(){
  // TODO: search.
  clearSearch();
});
search.map("<Esc>", clearSearch, true);
search.map("<BS>", function(){
  if(searchIpt.value=="") {
    clearSearch();
  }
});


function clearCommand(){
  commandIpt.value = "";
  commandIpt.blur();
  commandBox.style.display = "none";
}
var commandIpt = $("command");
var commandBox = $("commandBox");
var command = new Vimkey(commandIpt);
command.map("<CR>", function(){
  try{window.eval(commandIpt.value)}catch(ex){alert("Command not supports.")}
  clearCommand();
});
command.map("<Esc>", clearCommand, true);
command.map("<BS>", function(){
  if(commandIpt.value=="") {
    clearCommand();
  }
});
````