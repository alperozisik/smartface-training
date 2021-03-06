const Router = require("sf-core/ui/router");

const extend = require('js-base/core/extend');

const Page3Design = require('../ui/ui_page3');

const Page3 = extend(Page3Design)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);
    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

  });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow, data) {
  superOnShow();
  if (data) {
    alert(data.alper);
  }
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
  this.layout.removeChild(this.children.button1);
  this.btn.onPress = function() {
    Router.go("page2");
  };
}

module && (module.exports = Page3);
