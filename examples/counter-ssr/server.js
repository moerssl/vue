// vue
import Vue from '../../dist/vue.common.js';
import { compileToFunctions } from '../../dist/compiler.js';
import createRenderer from '../../dist/server-renderer.js';

const { renderToString } = createRenderer();
const renderVmWithOptions = (options, cb) => {
  const res = compileToFunctions(options.template, {
    preserveWhitespace: false
  });

  Object.assign(options, res);

  delete options.template;
  renderToString(new Vue(options), (err, res) => cb(res));
};

//drop this out into a module
var vueApp = {
  template: "<div><counter :cnt='count'></counter><button v-on:click='up'>Rauf</button></div>",

  // template: "<html><head></head><body><span>Zählt</span><div is='counter'></div><body></html>",
  data: {
      count: 2
    },
  methods: {
    up: function(){
      this.count = this.count + 1;
    }
  }
};



// server
import fs from 'fs';
import url from 'url';
import http from 'http';
import https from 'https';

const handleRequest = (req, res) => {
  const layout = fs.readFileSync('./templates/layout.html').toString();
  //this should be placed in a file to be shared with the client
  var counterComponent = {
    template: "<span>Hallo Welt {{cnt}}</span>",
    props: ["cnt"]
  }

  //this can be
  var counterResource = compileToFunctions(counterComponent.template);
  Object.assign(counterComponent, counterResource);
  delete counterComponent.template
  Vue.component("counter", counterComponent);

  switch (req.url) {
    // handle external file requests
    case '/vue.js':
      res.end(fs.readFileSync('../../dist/vue.js').toString());
      break;

    case '/app.js':
      res.end(fs.readFileSync('./app.js').toString());
      break;

    case '/client.js':
      res.end(fs.readFileSync('./client.js').toString());
      break;
    case '/favicon.ico':
      res.end("");
      break;
    // retrieve the data and render the layout with embedded app
    default:
      renderVmWithOptions(vueApp, result => {
        const rendered = layout.replace('{{ body }}', result);
        res.end(rendered);
        // res.end(result)
      });
    }
}

// start server
const port = process.env.PORT || 3000;
var server = http.createServer(handleRequest).listen(port, () => {
  console.log(`Server started: http://localhost:${port}`);
});

server.on('error', function (e) {
  // Handle your error here
  console.log(e);
});
