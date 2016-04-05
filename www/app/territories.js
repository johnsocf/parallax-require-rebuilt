define(function(require) {
    'use strict';

    var carousel = require("carousel");
    var $ = require("jquery");


    $(".territories-carousel .slides").each(function(){
        console.log($(this));
        carousel.create({
            root : $(this),
            hasPagination : false,
            changeCallback : postSlideChange
        });
    });

    function postSlideChange() {
        console.log('slide changed');
    }
});
