//imagine this is imported
var counterComponent = {
  template: "<span>Hallo Welt {{cnt}}</span>",
  props: ["cnt"]
}

// in the real world this should be imported via a module system
var bareApp = {
  template: "<div><span is='counter' :cnt='count'></span><button v-on:click='up'>Rauf</button></div>",
  data: {
    count: 5
  },
  // template: "<html><head></head><body><span>Zählt</span><div is='counter'></div><body></html>",
  methods: {
    up: function(){
      this.count = this.count + 1;
    }
  }
};

Vue.component("counter", counterComponent);
var demo = new Vue(Object.assign(bareApp, {el: "#main"}))
