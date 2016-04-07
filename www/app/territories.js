define(function(require) {
    'use strict';

    var carousel = require("carousel");
    var $ = require("jquery"),
        mustache = require("mustache"),
        dom,
        model = {
            'territories' : [
                {
                    name:'cirque',
                    territoryBanner: "images/logos/cirque-logo.png",
                    territoryImage: "images/territories/cirque-territory.png",
                    modalMap: "images/modal-maps/cirque-map.png",
                    challengeLevel: "100"
                },
                {
                    name:'eagle',
                    territoryBanner: "images/logos/eagle-wind-logo.png",
                    territoryImage: "images/territories/eagle-wind-territory.png",
                    modalMap: "images/modal-maps/eagle-map.png",
                    challengeLevel: "84"
                },
                {
                    name:'mary jane',
                    territoryBanner: "images/logos/mary-jane-logo.png",
                    territoryImage: "images/territories/mary-jane-territory.png",
                    modalMap: "images/modal-maps/mary-jane-map.png",
                    challengeLevel: "70"
                },
                {
                    name:'terrain',
                    territoryBanner: "images/logos/terrain-park-logo.png",
                    territoryImage: "images/territories/terrain-park-territory.png",
                    modalMap: "images/modal-maps/terrain-map.png",
                    challengeLevel: "56"
                },
                {
                    name:'parsenn bowl',
                    territoryBanner: "images/logos/parsenn-bowl-logo.png",
                    territoryImage: "images/territories/parsenn-bowl-territory.png",
                    modalMap: "images/modal-maps/parsenn-bowl-map.png",
                    challengeLevel: "42"
                },
                {
                    name:'vasquez',
                    territoryBanner: "images/logos/vasquez-ridge-logo.png",
                    territoryImage: "images/territories/vasquez-ridge-territory.png",
                    modalMap: "images/modal-maps/vasquez-map.png",
                    challengeLevel: "28"
                },
                {
                    name:'winter park',
                    territoryBanner: "images/logos/winter-park-logo.png",
                    territoryImage: "images/territories/winter-park-territory.png",
                    modalMap: "images/modal-maps/winter-park-map.png",
                    challengeLevel: "14"
                },
                {
                    name:'start',
                    territoryBanner: "images/logos/territories-logo.png",
                    territoryImage: "images/territories/territories-region.png",
                    modalMap: "images/modal-maps/all-territories-map.png",
                    challengeLevel: "0"
                }
            ]
        };

    function init() {
        cacheDom();
        buildSlides();
        cacheDelegatedDom();
        buildCarousel();
        attachHandlers();
    }

    function cacheDom() {
        dom = {};
        dom.territoriesCarousel = $(".territories-carousel");
        dom.template = $("#territories");
    }

    function buildSlides() {
        var template = dom.template.html();
        var slideHtml = mustache.render(template, model);
        dom.territoriesCarousel.html(slideHtml);
    }

    function cacheDelegatedDom() {
        dom.viewMap = $('.view-map');
        dom.territoriesCarouselSlides = dom.territoriesCarousel.find('.slides');
        dom.territoriesCarouselModal = $('.territories-carousel-modal');
    }

    function buildCarousel() {
        dom.territoriesCarouselSlides.each(function(){
            carousel.create({
                root : $(this),
                hasPagination : false,
                changeCallback : onSlideUpdate
            });
        });
    }

    function onSlideUpdate() {
        var element = $(this);

        element.addClass('selected-slide');
    }

    function attachHandlers() {
        dom.viewMap.on('click', queModal);
    }

    function attachDelegatedHandlers() {
        dom.modalCloseButton = dom.territoriesCarouselModal.find('.close');

        dom.modalCloseButton.on('click', closeModal);
    }

    function queModal() {
        var element = $(this),
            slide = element.parents('.slide'),
            modalInfo = slide.find('.modal-info').html();

        dom.territoriesCarouselModal.html(modalInfo);
        attachDelegatedHandlers();
        openModal();
    }

    function openModal() {
        dom.territoriesCarouselModal.addClass('open');
        setTimeout(function(){
            dom.territoriesCarouselModal.addClass('fade');
        }, 10);
    }

    function closeModal() {
        dom.territoriesCarouselModal.removeClass('open');
        dom.territoriesCarouselModal.removeClass('fade');
    }

    init();
});
