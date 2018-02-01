const Dialog = require("sf-core/ui/dialog");
const extend = require('js-base/core/extend');
const Page4Design = require('ui/ui_page4');
const System = require('sf-core/device/system');
const Color = require('sf-core/ui/color');
const Http = require("sf-core/net/http");
const http = new Http();
const config = require("../config.json");
const commonProps = require("../commonProps");

const Page4 = extend(Page4Design)(
  // Constructor
  function(_super) {
    _super(this);
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
    this.overlay = new Dialog();
    this.overlay.layout.backgroundColor = Color.create("#00000000");
  });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
  superOnShow();
  const page = this;
  page.aiWait.visible = false;
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();

  const page = this;

  page.btnLogin.onPress = () => {
    http.request({
      url: 'https://mapi.etstur.com/ucuzabilet-hotel-api/api/login/login',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Cache-Control": "no-cache"
      },
      method: 'POST',
      body: JSON.stringify({
        "userName": page.tbUserName.text,
        "password": page.tbPassword.text
      }),
      onLoad: function(response) {
        closeDialog(page);
        //response.body = response.body.toString();
        //alert(JSON.stringify(response, null, "\t"), "Response");
        if (response.headers["Content-Type"].startsWith("application/json")) {
          response.body = JSON.parse(response.body.toString());
          commonProps.authToken = response.body.token;

        }
      },
      onError: function(e) {
        closeDialog(page);
        if (e.statusCode === 500) {
          console.log("Internal Server Error Occurred.");
        }
        else {
          console.log("Server responsed with: " + e.statusCode + ". Message is: " + e.message);
        }
      }
    });

    page.overlay.show();
    page.aiWait.visible = true;

  };

  if (System.OS === "Android") {
    if (System.android.apiLevel >= 21) {
      page.btnLogin.nativeObject.setElevation(0);
      page.aiWait.nativeObject.setElevation(9);
    }

  }
  else { // iOS
  }

  page.imgLogo.onTouchEnded = function() {
    if (config.channel === "test") {
      page.tbPassword.text = "123456";
      page.tbUserName.text = "okan.burcak@etstur.com";
    }
  };
}

function closeDialog(page) {
  page.overlay.hide();
  page.aiWait.visible = false;
}

module && (module.exports = Page4);
