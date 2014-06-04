// Utility
if (typeof Object.create !== 'function') {
    Object.create = function (obj) {

        'use strict';

        function F() {}
        F.prototype = obj;
        return new F();
    };
}

// Carousel 
(function ($, window, document, undefined) {

    'use strict';

    var Carousel = {
        init: function (options, elem) {
            var self = this;

            self.elem  = elem; // carousel-container
            self.$elem = $(elem);

            self.transSupport = Modernizr.csstransitions;

            self.nextBtn     = self.$elem.find('.next');
            self.prevBtn     = self.$elem.find('.prev');
            self.strip       = self.$elem.find('.carousel-inner');

            self.carousel = self.$elem.find('.carousel');

            // grab some info about the image strip
            self.stripImages = this.strip.find('img');
            self.maxImages   = self.stripImages.length;

            // make sure we need all these
            self.stripWidth     = 0;
            self.currentPos     = 0;

            // has last image been loaded fully
            self.imagesKnown = false;

            self.vents();
        },

        vents: function () {

            var self = this;

            self.prevBtn.on('click', function (e) {
                self.changeSlide('left');
                e.preventDefault();
            });

            self.nextBtn.on('click', function (e) {
                self.changeSlide('right');
                e.preventDefault();
            });

        },

        changeSlide: function (direction) {

            var self = this;

            if (self.imagesKnown === false) {
                self.checkImagePosition();
            }

            if (direction === 'right') {
                self.currentPos += 571;
            } else {
                self.currentPos -= 571;
            }

            self.moveStrip();


        },

        checkImagePosition: function () {

            var self            = this,
                i               = 0,
                tmpWidth        = 0,
                allImagesLoaded = true;

            self.stripWidth = 0; // reset to zero in case this has been run before

            for (i; i < self.maxImages; i++) {
                tmpWidth = self.stripImages[i].width;

                // checking to see if images have loaded
                if (self.stripImages[i].complete === false) {
                    allImagesLoaded = false;
                }

                // checking to make sure all image also have a width
                if (tmpWidth === 0) {
                    allImagesLoaded = false;
                }

                self.stripWidth += self.stripImages[i].width + 16;
            }

            if (allImagesLoaded === true) {
                self.imagesKnown = true;
            }

            self.stripWidth -= 16;
        },

        moveStrip: function () {

            var self = this;

            if (self.transSupport) {
                self.strip.css('left', -self.currentPos);
            } else {
                self.strip.animate({
                    'left': -self.currentPos
                }, 100, 'linear');
            }

            self.changeState();
        },

        changeState: function () {
            var self = this;

            if (self.currentPos === 0) {
                self.$elem.addClass('hide-prev-btn');
            } else {
                self.$elem.removeClass('hide-prev-btn');
            }

            if ((self.currentPos + 571) > self.stripWidth && self.imagesKnown) {
                self.$elem.addClass('hide-next-btn');
            } else {
                self.$elem.removeClass('hide-next-btn');
            }
        }

    };

    $.fn.gatheredCarousel = function (options) {
        return this.each(function () { // we may not need this each

            var carousel = Object.create(Carousel);
            carousel.init(options, this);
        });
    };

    $.fn.gatheredCarousel.options = {

    };

})(jQuery, window, document, undefined);


(function ($) {

    'use strict';
    var $carouselContainers = $('.carousel-container'),
        $scrub = $carouselContainers.data('scrub-length', true),
        $navHeaders = $('.shop-subnav').find('h1');

    $carouselContainers.gatheredCarousel('foo');

    $navHeaders.on('click', function (e) {
        var $this = $(this);

        $this.next('.subnav-children').slideToggle();
    });

})(jQuery);

