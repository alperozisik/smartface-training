const extend = require('js-base/core/extend');
const PgList2Design = require('ui/ui_pgList2');
const ListViewItem = require('sf-core/ui/listviewitem');
const addChild = require("@smartface/contx/lib/smartface/action/addChild");
const FlLoad = require("../components/FlLoad");
const FlDefault = require("../components/FlDefault");
const ListView = require('sf-core/ui/listview');
const Color = require('sf-core/ui/color');
const Menu = require('sf-core/ui/menu');
const MenuItem = require('sf-core/ui/menuitem');

const PgList2 = extend(PgList2Design)(
    function(_super) {
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

    });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
    superOnShow();
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
    const page = this;

    page.list.refreshEnabled = false;

    var itemIndex = 0;
    page.list.onRowCreate = function() {
        var myListViewItem = new ListViewItem();
        this.dispatch(addChild(`item${++itemIndex}`, myListViewItem));

        var flDefault = new FlDefault();

        myListViewItem.addChild(flDefault, "flDefault", "", function(style) {
            style.width = null;
            style.height = null;
            style.flexGrow = 1;
            return style;
        });

        var flLoad = new FlLoad();


        myListViewItem.addChild(flLoad, "flLoad", "", function(style) {
            return Object.assign(style, {
                width: null,
                height: null,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                positionType: "ABSOLUTE",
                visible: false
            });
        });

        return myListViewItem;
    };

    page.list.onRowHeight = function(index) {


        if (index === page.list.itemCount - 1) {
            return 150;
        }
        else
            return 400;
    };


    page.list.onRowBind = function(listViewItem, index) {
        var flDefault = listViewItem.findChildById(2000);
        var flLoad = listViewItem.findChildById(3000);
        console.log(`row bind index ${index}`);
        if (index === page.list.itemCount - 1) {
            flDefault.dispatch({
                type: "updateUserStyle",
                userStyle: {
                    visible: false
                }
            });

            flLoad.dispatch({
                type: "updateUserStyle",
                userStyle: {
                    visible: true
                }
            });

        }
        else {
            flDefault.dispatch({
                type: "updateUserStyle",
                userStyle: {
                    visible: true
                }
            });

            flLoad.dispatch({
                type: "updateUserStyle",
                userStyle: {
                    visible: false
                }
            });
        }

    };

    page.list.ios.leftToRightSwipeEnabled = true;
    page.list.ios.rightToLeftSwipeEnabled = true;

    page.list.ios.onRowSwiped = function(direction, expansionSettings) {
        if (direction == ListView.iOS.SwipeDirection.LEFTTORIGHT) {
            //Expansion button index. Default value 0
            expansionSettings.buttonIndex = -1;

            var archiveSwipeItem = ListView.iOS.createSwipeItem("ARCHIVE", Color.GREEN, 30, function(e) {
                console.log("Archive " + e.index);
            });

            return [archiveSwipeItem];
        }
        else if (direction == ListView.iOS.SwipeDirection.RIGHTTOLEFT) {
            //Expansion button index. Default value 0
            expansionSettings.buttonIndex = 0;
            //Size proportional threshold to trigger the expansion button. Default value 1.5
            expansionSettings.threshold = 1;

            var moreSwipeItem = ListView.iOS.createSwipeItem("MORE", Color.GRAY, 30, function(e) {
                console.log("More " + e.index);
            });

            var deleteSwipeItem = ListView.iOS.createSwipeItem("DELETE", Color.RED, 30, function(e) {
                console.log("Delete " + e.index);
            });

            return [deleteSwipeItem, moreSwipeItem];
        }
    };

    page.list.android.onRowLongSelected = function(listViewItem, index) {
        if (index === page.list.itemCount - 1)
            return;
        var menu = new Menu();
        menu.headerTitle = "My Menu Title";
        var menuItem1 = new MenuItem({
            title: "Delete"
        });
        var menuItem2 = new MenuItem({
            title: "Archive"
        });

        menuItem1.onSelected = function() {
            console.log(`menu item delete clicked: row index = ${index}`);
        };
        menuItem2.onSelected = function() {
            console.log(`menu item archive clicked: row index = ${index}`);
        };

        menu.items = [menuItem1, menuItem2];

        menu.show(page);
    };


}

module && (module.exports = PgList2);
