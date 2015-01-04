(function($){

    var EVENTS = {
        VISIBLE: 'visible',
        HIDDEN: 'hidden'
    };

    var CSS_CLASS_REGEXP = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g;

    var ElementDescriptor = (function(){

        var viewport = updateViewport();
        $(window).on('resize', updateViewport);
        function updateViewport(){
            var $window = $(window);
            return viewport = {
                top: 0,
                left: 0,
                bottom: $window.height(),
                right: $window.width()
            };
        }

        function ElementDescriptor(element, options){
            this.element = element;
            this.$element = $(element);
            this.options = options;
            this.processOptions();
            this.updateVisibility();
            this.updateClassesAndTrigger();
        }

        ElementDescriptor.prototype = {
            element: null,
            $element: null,
            visible: false,
            options: null,
            classes: {
                visible: null,
                hidden: null
            }
        };

        ElementDescriptor.prototype.equals = function(elementDescriptor){
            return this.element === elementDescriptor.element;
        };

        ElementDescriptor.prototype.processOptions = function(){
            this.classes = {
                visible: getClass(this.options, 'visible'),
                hidden: getClass(this.options, 'hidden')
            };
        };

        function getClass(options, property){
            if (!options || !options[property])
                return null;
            var classes = options[property].match(CSS_CLASS_REGEXP);
            return (classes && classes.length)? classes[0].replace(/\.(.*)/, '$1') : null;
        }

        ElementDescriptor.prototype.update = function (){
            var visible = this.visible;
            this.updateVisibility();
            if (this.visible == visible)
                this.updateClassesAndTrigger();
        };

        ElementDescriptor.prototype.updateVisibility = function(){
            this.visible = intersects(this.element.getBoundingClientRect(), viewport);
        };

        function intersects(a, b){
            var intersectsX = between(a.left, b.left, b.right) || between(b.left, a.left, a.right);
            var intersectsY = between(a.top, b.top, b.bottom) || between(b.top, a.top, a.bottom);
            return intersectsX && intersectsY;
        }

        function between(value, min, max){
            return value >= min && value <= max;
        }

        ElementDescriptor.prototype.updateClassesAndTrigger = function(){
            this.updateClasses();
            this.trigger();
        };

        ElementDescriptor.prototype.trigger = function(){
            this.$element.trigger((this.visible? EVENTS.VISIBLE : EVENTS.HIDDEN), this.element);
        };

        ElementDescriptor.prototype.updateClasses = function(){
            if (this.visible)
                this._setVisibleClass();
            else
                this._setHiddenClass();
        };

        ElementDescriptor.prototype._setVisibleClass = function(){
            if (this.classes.hidden)
                this.$element.removeClass(this.classes.hidden);
            if (this.classes.visible)
                this.$element.addClass(this.classes.visible);
        };

        ElementDescriptor.prototype._setHiddenClass = function(){
            if (this.classes.visible)
                this.$element.removeClass(this.classes.visible);
            if (this.classes.hidden)
                this.$element.addClass(this.classes.hidden);
        };

        return ElementDescriptor;
    }());

    var DescriporsCollection = (function(){
        function DescriptorsCollection(){
            this.collection = [];
        }
        DescriptorsCollection.prototype = {
            collection: null
        };

        DescriptorsCollection.prototype.indexOf = function(descriptor){
            for (var i = 0; i < this.collection.length; i++)
                if (this.collection[i].equals(descriptor))
                    return i;
            return -1;
        };

        DescriptorsCollection.prototype.contains = function(descriptor){
            return (this.indexOf(descriptor) > -1);
        };

        DescriptorsCollection.prototype.add = function(descriptor){
            if (!this.contains(descriptor))
                this.collection.push(descriptor);
            return descriptor;
        };

        DescriptorsCollection.prototype.remove = function(descriptor){
            var index = this.indexOf(descriptor);
            if (index > -1)
                this.collection.splice(index, 1);
            return descriptor;
        };

        DescriptorsCollection.prototype.addCollection = function(jqueryCollection, options){
            return Array.prototype.map.call(jqueryCollection, createElementDescriptor)
                .map(this.add.bind(this));

            function createElementDescriptor(domElement){
                return new ElementDescriptor(domElement, options);
            }
        };

        DescriptorsCollection.prototype.update = function(){
            for (var i = 0; i < this.collection.length; i++)
                this.collection[i].update();
        };

        return DescriptorsCollection;
    }());


    (function init(){
        var descriptors = new DescriporsCollection();

        $.fn.viewport = function(options){
            descriptors.addCollection(this, options);
            return this;
        };

        $(window).on('DOMContentLoaded load resize scroll', descriptors.update.bind(descriptors));
    }());
}(jQuery));