// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app',
        jquery: 'jquery-2.1.1.min',
        carousel: '../app/carousel',
        territoriesCarousel: '../app/territories',
        global: '../global',
        helpers: '../helpers',
        swipe: 'swipe'
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/main']);
requirejs(['app/carousel']);
requirejs(['app/territories']);
requirejs(['swipe']);
requirejs(['../global']);
requirejs(['../helpers']);
requirejs(['jquery']);
