require('hightlightjs');
require('markdownit');
require('codemirrorjs');
require('codemirrorjs_overlay');
require('codemirrorjs_javascript');
require('codemirrorjs_gfm');
require('codemirrorjs_markdown');
require('../node_modules/codemirror/lib/codemirror.css');
require('../node_modules/codemirror/theme/monokai.css');
require('../node_modules/highlight.js/styles/default.css');
require('./design.css');

var languageOverrides = {
  js: 'javascript',
  html: 'xml'
};

var editor = CodeMirror.fromTextArea(document.getElementById('input'), {
  mode: 'gfm',
  lineNumbers: false,
  matchBrackets: true,
  lineWrapping: true,
  theme: 'monokai',
  extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
});

var md = markdownit({
  html: true,
  linkify: true,
  highlight: function(code, lang){
    if(languageOverrides[lang]) lang = languageOverrides[lang];
    if(lang && hljs.getLanguage(lang)){
      try {
        return hljs.highlight(lang, code).value;
      }catch(e){
      }
    }
    return '';
  }
})

function update(e) {
  markdownRender(e.getValue());
}

function markdownRender(input) {
  var out = document.getElementById('right');
  var old = out.cloneNode(true);
  out.innerHTML = md.render(input);
}

editor.on('change', update);

markdownRender(document.getElementById('input').value);

var electron = require('electron');

electron.ipcRenderer.on('new-file', function(event, message) {
  editor.setValue('');
});

electron.ipcRenderer.on('load-file', function(event, message) {
  editor.setValue(message);
});

electron.ipcRenderer.on('get-editor-content', function(event, message) {
  electron.ipcRenderer.send('editor-content', editor.getValue());
});

electron.ipcRenderer.on('get-output-content', function(event, message) {
  electron.ipcRenderer.send('output-content', document.getElementById('right').innerHTML);
});
