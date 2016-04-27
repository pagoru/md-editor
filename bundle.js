/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

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

	  var electron = window.require('electron').remote;

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
	});

/***/ }
/******/ ]);