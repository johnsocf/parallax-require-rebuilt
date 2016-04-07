define('carousel', function(require) {
    'use strict';

    var helpers = require('helpers');
    var $ = require('jquery');
    //var videoPlayer = require('video-player');
    /* Swipe is not AMD Friendly */
    require('swipe');

    var defaults = {
        autoDuration : 0, // Positive integer will enable auto slide
        root : null, // required
        hasPagers : true,
        hasPagination : true,
        before : null,
        after : null,
        changeCallback : null,
        advanceSlideOnClick : false,
        continuous : true,
        pagerButtonSelector : 'button',
        slideHeight : '',
        slideSelector: '.slide',
        pagerContainerSelector : null, // existing element to insert pagers into -- recommend using an ID to guarantee unique target
        paginationContainerSelector : null, // existing element to insert pagination buttons into -- recommend using an ID to guarantee unique target
        pagerContainerClass : 'button-container',
        prevButtonClass : 'prev',
        nextButtonClass : 'next',
        paginationClass : 'pagination-button-container',
        activePageClass : 'currentPage'
    };

    function create(options) {
        var carousel = {};
        carousel.options = $.extend({}, defaults, options);
        bind(carousel);
        carousel.cacheDom();
        carousel.startCarousel();
    }

    function bind(carousel){
        carousel.cacheDom = cacheDom.bind(carousel);
        carousel.startCarousel = startCarousel.bind(carousel);
        carousel.triggerHeightCallback = triggerHeightCallback.bind(carousel);
        carousel.onPagerClick = onPagerClick.bind(carousel);
        carousel.buildPagerButtons = buildPagerButtons.bind(carousel);
        carousel.buildPagination = buildPagination.bind(carousel);
        carousel.onPaginationClick = onPaginationClick.bind(carousel);
        carousel.attachHandlers = attachHandlers.bind(carousel);
        carousel.advanceSlideOnClick = advanceSlideOnClick.bind(carousel);
        carousel.onSlideChange = onSlideChange.bind(carousel);
        carousel.slideChanged = slideChanged.bind(carousel);
        carousel.returnToFirstSlide = returnToFirstSlide.bind(carousel);
    }

    function cacheDom() {
        this.dom = {};
        this.dom.html = $('html');
        this.dom.body = helpers.dom.body;
        this.dom.root = this.options.root;
        this.dom.pagerButtons = this.dom.root.find(this.options.pagerButtonSelector);
        this.dom.slides = this.dom.root.find(this.options.slideSelector);
        this.dom.slideCount = this.dom.slides.length;
    }

    function startCarousel() {
        if (helpers.isPageEditor) {
            return;
        }

        if (this.dom.slides.length > 1) {
            this.triggerHeightCallback();
            this.carousel = new Swipe(this.dom.root[0], {
                auto: this.options.autoDuration,
                callback: this.slideChanged
            });
            this.buildPagerButtons();
            this.buildPagination();
            this.attachHandlers();
            this.onSlideChange(0, true);

            if (typeof(this.options.after) === 'function') {
                this.options.after();
            }
        } else {
            this.dom.root.css('visibility', 'visible');
        }
    }

    function triggerHeightCallback(){
        if (typeof(this.options.before) === 'function') {
            this.options.before(self.dom.slides, this.options.slideHeight);
        }
    }

    function onPagerClick(e) {
        e.preventDefault();
        var button = $(e.currentTarget),
            index = 0;

        if (button.hasClass(this.options.nextButtonClass)) {
            index = (this.currentPage - 1) < 0 ? this.dom.slideCount - 1 : this.currentPage - 1;
        }
        else {
            index = (this.currentPage + 1) >= this.dom.slideCount ? 0 : this.currentPage + 1;
        }

        this.carousel.slide(index);
    }

    function buildPagerButtons() {
        var hasPagers = this.options.hasPagers,
            targetEl = this.options.pagerContainerSelector ? $(this.options.pagerContainerSelector) : this.dom.root;

        if (hasPagers === 'desktop') {
            hasPagers = !('ontouchstart' in document.documentElement);
        }

        if (hasPagers && this.dom.slideCount > 1) {
            this.dom.buttons = $('<button class="' + this.options.prevButtonClass + '"></button><button class="' + this.options.nextButtonClass + '"></button>');
            var container = $('<div>').attr('class', this.options.pagerContainerClass).append(this.dom.buttons);
            this.dom.buttons.on('click', this.onPagerClick);
            targetEl.append(container);
        }
    }

    function buildPagination() {
        var pagers = '',
            targetEl = this.options.paginationContainerSelector ? $(this.options.paginationContainerSelector) : this.dom.root,
            currentPage = null,
            page = '';

        if (this.options.hasPagination && this.dom.slideCount > 1) {
            for (var i = 0; i < this.dom.slides.length; i++) {
                currentPage = i + 1;
                page = '<li><button>page: ' + currentPage + '</button></li>';
                pagers += page;
            }
            pagers = $('<ol>').html(pagers);
            this.dom.pagerContainer = $('<div>').attr('class', this.options.paginationClass).html(pagers);
            targetEl.append(this.dom.pagerContainer);
            this.dom.pagerListItems = this.dom.pagerContainer.find('button');
            this.dom.pagerListItems.on('click', this.onPaginationClick);
        }
    }

    function onPaginationClick(e) {
        e.preventDefault();
        var button = $(e.currentTarget),
            index = this.dom.pagerListItems.index(button);

        this.carousel.slide(index);
    }

    function attachHandlers() {
        this.dom.root.on('click', this.options.slideSelector, this.advanceSlideOnClick);
    }

    function advanceSlideOnClick(e) {
        var touchSupport = this.dom.html.hasClass('modernizr-touch');

        if (!touchSupport && this.options.advanceSlideOnClick) {
            e.preventDefault();
            this.carousel.next();
        }
    }

    function slideChanged(index, event){
        this.onSlideChange(index);
    }

    function onSlideChange(index, isInitial) {
        // Swipe inserts extra slides to make carousel infinite
        // A little extra math needed to determine correct index
        if (index >= (this.dom.slideCount)) {
            var countIsEven = this.dom.slideCount % 2 === 0,
                indexIsEven = index % 2 === 0;

            if (countIsEven) {
                this.currentPage = indexIsEven ? 0 : 1;
            } else {
                this.currentPage = indexIsEven ? 1 : 0;
            }
        } else {
            this.currentPage = index;
            console.log(this.options.activePageClass);
        }

        this.dom.slides.removeClass(this.options.activePageClass);
        $(this.dom.slides[this.currentPage]).addClass(this.options.activePageClass);

        if (this.options.hasPagination && this.dom.slideCount > 1) {
            var newPager = this.dom.pagerListItems.eq(this.currentPage);

            this.dom.pagerListItems.removeClass(this.options.activePageClass);
            newPager.addClass(this.options.activePageClass);
        }

        if (this.options.changeCallback) {
            this.options.changeCallback(index);
        }
    }

    function returnToFirstSlide() {
        if (this.carousel.getPos() !== 0) {
            this.carousel.slide(0);
        }
    }

    return {
        create : create
    };

});
