$(document).ready(function() {
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
});