/* jshint esnext: true */
/* global require: false */

let pageMod = require("sdk/page-mod");
let self = require("sdk/self");
let ss = require('sdk/simple-storage');
let buttons = require('sdk/ui/button/toggle');
let tabs = require("sdk/tabs");

let localStorage = ss.storage;
localStorage.getItem = function(key) {
	return ss.storage[key];
};
localStorage.setItem = function(key, value) {
	ss.storage[key] = value;
};
localStorage.removeItem = function(key) {
	delete ss.storage[key];
};



const bes_activated = {
  "label": "Broadworks Enhancement Suite is now Activated",
  "icon": "./on64.png",
}

const bes_deactivated = {
  "label": "Broadworks Enhancement Suite is now Deactivated",
  "icon": "./off64.png",
}

var button = buttons.ToggleButton({
  id: "bes-button",
  label: "Broadworks Enhancement Suite is now Deactivated",
  icon: "./off64.png",
  onClick: handleClick
});

function init() {
  let is_bes_active = localStorage.getItem('is_bes_active');
  if (is_bes_active == undefined || is_bes_active == null) {
    localStorage.setItem('is_bes_active', true);
    button.checked = true;
    button.state(button, bes_activated);

  } else if (is_bes_active == true) {
    button.checked = true;
    button.state(button, bes_activated);

  } else {
    button.checked = false;
    button.state(button, bes_deactivated);
  }
}

function handleClick(state) {
  button.checked = !button.checked;
  localStorage.setItem('is_bes_active', button.checked)

  if (button.checked == true) {
    button.state(button, bes_activated);
  }
  else {
    button.state(button, bes_deactivated);
  }
}

init()
 
// Create a page mod
// It will run a script whenever a ".org" URL is loaded
// The script replaces the page contents with a message
pageMod.PageMod({
  include: "*",
	contentScriptWhen: 'ready',
  contentScriptFile: [
    self.data.url("bes.js"),
  ],
  onAttach: function(worker) {
    worker.port.emit('alert', localStorage.getItem('is_bes_active'));
  }


});

