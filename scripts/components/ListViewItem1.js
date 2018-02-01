const extend = require('js-base/core/extend');
const Image = require('sf-core/ui/image');
var placeholder = Image.createFromFile("images://ic_landscape.png");

const ListViewItem1Design = require('library/ListViewItem1');

const ListViewItem1 = extend(ListViewItem1Design)(
    //constructor
    function(_super, props, pageName) {
        // initalizes super class for this scope
        _super(this, props || {});
        this.pageName = pageName;
        const lvi = this;
        
        
        lvi.setData = function(data) {
            var url = data.image;
            if(url)
                lvi.imgHotel.loadFromUrl( url , placeholder);
            else
                lvi.imgHotel.image = placeholder;
            
            lvi.lblTitle.text = data.hotelName || "<Title>";
            lvi.lblSubTitle.text = data.shortDescription || data.pensionText || "<SubTitle>";
            
        };
    }

);

module && (module.exports = ListViewItem1);
