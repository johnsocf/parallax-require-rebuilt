define(function(require) {
    'use strict';

    var carousel = require("carousel");
    var $ = require("jquery");


    $(".territories .slides").each(function(){
        carousel.create({
            root : $(this),
            hasPagination : false,
            changeCallback : onSlideChange
        });
    });
});
