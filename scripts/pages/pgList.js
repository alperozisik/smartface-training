const extend = require('js-base/core/extend');
const PgListDesign = require('ui/ui_pgList');
const ListViewItem1 = require("../components/ListViewItem1");
const Http = require("sf-core/net/http");
const http = new Http();
const FlexLayout = require('sf-core/ui/flexlayout');
const addChild = require("@smartface/contx/lib/smartface/action/addChild");


const PgList = extend(PgListDesign)(
    function(_super) {
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        const page = this;

        page.data = {
            hotels: []
        };

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

    http.request({
        url: 'https://mobiltest.etstur.com/ets-mobile-api-stg/api/search/searchResult',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cache-Control": "no-cache",
            "APIKEY": "5b9416717194c7de2c8526d9bec1cd19",
            "APPVERSION": "1.1",
            "OSVERSION": "9.1",
            "Postman-Token": "66a7d213-cdf8-fe22-d4ac-901abb58db5f"
        },
        method: 'POST',
        body: JSON.stringify({
            "adultCount": 2,
            "childAges": [],
            "currency": "TL",
            "endDate": "20180607",
            "fetchAvailableOnly": false,
            "filters": [
                "LOCATION--6010"
            ],
            "first": false,
            "from": 0,
            "getAll": false,
            "hotelCountLeft": 133,
            "maxPrice": 0,
            "minPrice": 0,
            "number": 20,
            "pageLoadWithBookmark": false,
            "query": "Antalya-Otelleri",
            "startDate": "20180601"
        }),
        onLoad: function(response) {
            //response.body = response.body.toString();
            //alert(JSON.stringify(response, null, "\t"), "Response");
            //if (response.headers["Content-Type"].startsWith("application/json")) {
            response.body = JSON.parse(response.body.toString());
            page.data = response.body.searchResponseModel;
            page.list.itemCount = page.data.hotels.length;
            page.list.refreshData();
            //}
        },
        onError: function(e) {
            if (e.statusCode === 500) {
                console.log("Internal Server Error Occurred.");
            }
            else {
                console.log("Server responsed with: " + e.statusCode + ". Message is: " + e.message);
            }
        }
    });



}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
    const page = this;

    page.list.onRowCreate = function() {
        var lvi = new ListViewItem1({
            flexDirection: FlexLayout.FlexDirection.ROW
        });
        return lvi;
    };


    page.list.onRowBind = function(lvi, index) {
        var hotelData = page.data.hotels[index];
        if (hotelData) {
            lvi.setData(hotelData);
        }
    };


    page.invalidateListView = invalidateListView.bind(page, page.list.onRowCreate);
    page.invalidateListView();


    page.list.onPullRefresh = function() {

        http.request({
            url: 'https://mobiltest.etstur.com/ets-mobile-api-stg/api/search/searchResult',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Cache-Control": "no-cache",
                "APIKEY": "5b9416717194c7de2c8526d9bec1cd19",
                "APPVERSION": "1.1",
                "OSVERSION": "9.1",
                "Postman-Token": "66a7d213-cdf8-fe22-d4ac-901abb58db5f"
            },
            method: 'POST',
            body: JSON.stringify({
                "adultCount": 2,
                "childAges": [],
                "currency": "TL",
                "endDate": "20180607",
                "fetchAvailableOnly": false,
                "filters": [
                    "LOCATION--6010"
                ],
                "first": false,
                "from": 0,
                "getAll": false,
                "hotelCountLeft": 133,
                "maxPrice": 0,
                "minPrice": 0,
                "number": 20,
                "pageLoadWithBookmark": false,
                "query": "Antalya-Otelleri",
                "startDate": "20180601"
            }),
            onLoad: function(response) {
                //response.body = response.body.toString();
                //alert(JSON.stringify(response, null, "\t"), "Response");
                //if (response.headers["Content-Type"].startsWith("application/json")) {
                response.body = JSON.parse(response.body.toString());
                page.data = response.body.searchResponseModel;
                page.list.itemCount = page.data.hotels.length;
                page.list.refreshData();
                page.list.stopRefresh();
                //}
            },
            onError: function(e) {
                if (e.statusCode === 500) {
                    console.log("Internal Server Error Occurred.");
                }
                else {
                    console.log("Server responsed with: " + e.statusCode + ". Message is: " + e.message);
                }
            }
        });
    };
}

module && (module.exports = PgList);

function invalidateListView(originalOnRowCreate) {
    this.list.dispatch({
        type: "removeChildren"
    });

    var itemIndex = 0;

    this.list.onRowCreate = function myListview_onRowCreate(superOnRowCreate) {
        const myListViewItem = originalOnRowCreate.call(this);
        this.dispatch(addChild(`item${++itemIndex}`, myListViewItem
            , ".listViewItem", function(style) {
                Object.assign(style, {
                    width: null,
                    height: null
                });
                return style;
            }
        ));
        //myListViewItem.dispatch({
        //    type: "updateUserStyle",
        //    userStyle: {
        //        width: null,
        //        height: null,
        //    }
        //});

        return myListViewItem;
    };
}
