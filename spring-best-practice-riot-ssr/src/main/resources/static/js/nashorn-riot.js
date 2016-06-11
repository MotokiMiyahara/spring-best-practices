// simple-dom helper

var simpleDom = require('static/js/simple-dom')
var simpleTokenizer = require('static/js/simple-html-tokenizer')

// create `document` to make riot work
if (typeof window == 'undefined') {
  /*eslint-disable*/
  document = new simpleDom.Document()
  /*eslint-enable*/
}

// easy like a pie! closes #1780
document.createElementNS = document.createElement

document.querySelector = function () { return false }
document.getElementsByTagName = function(tagName) { return [new simpleDom.Element(tagName)] }

// add `innerHTML` property to simple-dom element
Object.defineProperty(simpleDom.Element.prototype, 'innerHTML', {
  set: function(html) {
    var frag = sdom.parse(html)
    while (this.firstChild) this.removeChild(this.firstChild)
    this.appendChild(frag)
  },
  get: function() {
    var html = '',
      next = this.firstChild

    while (next) {
      html += sdom.serialize(next)
      next = next.nextSibling
    }

    return html
  }
})

// set the value attribute correctly on the input tags
Object.defineProperty(simpleDom.Element.prototype, 'value', {
  set: function(val) {
    // is an input tag
    if (~['input', 'option', 'textarea'].indexOf(this.tagName.toLowerCase()))
      this.setAttribute('value', val)
    else
      this.value = val
  }
})

// add `outerHTML` property to simple-dom element
Object.defineProperty(simpleDom.Element.prototype, 'outerHTML', {
  get: function() {
    var html = sdom.serialize(this)
    var rxstr = '^(<' + this.tagName + '>.*?</' + this.tagName + '>)'
    var match = html.match(new RegExp(rxstr, 'i'))
    return match ? match[0] : html
  }
})

// add `style` property to simple-dom element
Object.defineProperty(simpleDom.Element.prototype, 'style', {
  get: function() {
    var el = this
    return Object.defineProperty({}, 'display', {
      set: function(value) {
        el.setAttribute('style', 'display: ' + value + ';')
      }
    })
  }
})

var sdom = module.exports = {
  parse: function(html) {
    // parse html string to simple-dom document
    var blank = new simpleDom.Document()
    var parser = new simpleDom.HTMLParser(simpleTokenizer.tokenize, blank, simpleDom.voidMap)
    return parser.parse(html)
  },
  serialize: function(doc) {
    // serialize simple-dom document to html string
    var serializer = new simpleDom.HTMLSerializer(simpleDom.voidMap)
    return serializer.serialize(doc)
  }
}

var window = this;

var history = {};
history.location = {}
history.location.href = null;

var console = {};
console.debug = print;
console.warn = print;
console.log = print;

var setTimeout = function () {}