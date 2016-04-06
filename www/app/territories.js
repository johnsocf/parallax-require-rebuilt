define(function(require) {
    'use strict';

    var carousel = require("carousel");
    var $ = require("jquery"),
        dom;

    function init() {
        cacheDom();
        buildCarousel();
        attachHandlers();
    }

    function cacheDom() {
        dom = {};
        dom.viewMap = $('.view-map');
        dom.territoriesCarousel = $(".territories-carousel");
        dom.territoriesCarouselSlides = dom.territoriesCarousel.find('.slides');
        dom.territoriesCarouselModal = $('.territories-carousel-modal');
    }

    function buildCarousel() {
        dom.territoriesCarouselSlides.each(function(){
            console.log($(this));
            carousel.create({
                root : $(this),
                hasPagination : false,
                changeCallback : postSlideChange
            });
        });
    }

    function attachHandlers() {
        dom.viewMap.on('click', queModal);
    }

    function attachDelegatedHandlers() {
        console.log('attach delegated handlers');
        dom.modalCloseButton = dom.territoriesCarouselModal.find('.close');

        console.log(dom.modalCloseButton);

        dom.modalCloseButton.on('click', closeModal);
    }

    function postSlideChange() {
        console.log('slide changed');
    }

    function queModal() {
        var element = $(this),
            slide = element.parents('.slide'),
            modalInfo = slide.find('.modal-info').html();

        console.log(modalInfo);
        console.log(dom.territoriesCarouselModal);

        dom.territoriesCarouselModal.html(modalInfo);
        attachDelegatedHandlers();
        openModal();
    }

    function openModal() {
        dom.territoriesCarouselModal.addClass('open');
    }

    function closeModal() {
        console.log('close modal');
        dom.territoriesCarouselModal.removeClass('open');
    }

    init();
});
