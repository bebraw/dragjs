/*
 * References:
 * * http://luke.breuer.com/tutorial/javascript-drag-and-drop-tutorial.aspx
 * * http://stackoverflow.com/questions/1291325/drag-drop-problem-draggable-in-positionrelative-parent
 *
 * Note that default drag does not work with position: relative by default!
 * */
var drag = (function() {
    function drag(elem, cbs) {
        if(!elem) {
            console.warn('drag is missing elem!');
            return;
        }

        if(isTouch()) dragTemplate(elem, cbs, 'touchstart', 'touchmove', 'touchend');
        else dragTemplate(elem, cbs, 'mousedown', 'mousemove', 'mouseup');
    }

    function xyslider(o) {
        var twod = div(o['class'] || '', o.parent);
        var pointer = div('pointer', twod);
        div('shape shape1', pointer);
        div('shape shape2', pointer);
        div('bg bg1', twod);
        div('bg bg2', twod);

        drag(twod, attachPointer(o.cbs, pointer));

        return {
            background: twod,
            pointer: pointer
        };
    }

    function slider(o) {
        var oned = div(o['class'], o.parent);
        var pointer = div('pointer', oned);
        div('shape', pointer);
        div('bg', oned);

        drag(oned, attachPointer(o.cbs, pointer));

        return {
            background: oned,
            pointer: pointer
        };
    }

    drag.xyslider = xyslider;
    drag.slider = slider;

    return drag;

    function attachPointer(cbs, pointer) {
        var ret = {};

        for(var n in cbs) ret[n] = wrap(cbs[n]);

        function wrap(fn) {
            return function(p) {
                p.pointer = pointer;
                fn(p);
            };
        }

        return ret;
    }

    // move to elemutils lib?
    function div(klass, p) {
        return e('div', klass, p);
    }

    function e(type, klass, p) {
        var elem = document.createElement(type);
        if(klass) elem.className = klass;
        p.appendChild(elem);

        return elem;
    }

    // http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
    function isTouch() {
        return typeof(window.ontouchstart) != 'undefined';
    }

    function dragTemplate(elem, cbs, down, move, up) {
        var dragging = false;

        cbs = getCbs(cbs);

        var beginCb = cbs.begin;
        var changeCb = cbs.change;
        var endCb = cbs.end;

        on(elem, down, function(e) {
            dragging = true;

            var moveHandler = partial(callCb, changeCb, elem);
            function upHandler() {
                dragging = false;

                off(document, move, moveHandler);
                off(document, up, upHandler);

                callCb(endCb, elem, e);
            }

            on(document, move, moveHandler);
            on(document, up, upHandler);

            callCb(beginCb, elem, e);
        });
    }

    function on(elem, evt, handler) {
        if(elem.addEventListener)
            elem.addEventListener(evt, handler, false);
        else if(elem.attachEvent)
            elem.attachEvent('on' + evt, handler);
    }

    function off(elem, evt, handler) {
        if(elem.removeEventListener)
            elem.removeEventListener(evt, handler, false);
        else if(elem.detachEvent)
            elem.detachEvent('on' + evt, handler);
    }

    function getCbs(cbs) {
        if(!cbs) {
            var initialOffset;
            var initialPos;

            return {
                begin: function(c) {
                    initialOffset = {x: c.elem.offsetLeft, y: c.elem.offsetTop};
                    initialPos = c.cursor;
                },
                change: function(c) {
                    style(c.elem, 'left', (initialOffset.x + c.cursor.x - initialPos.x) + 'px');
                    style(c.elem, 'top', (initialOffset.y + c.cursor.y - initialPos.y) + 'px');
                },
                end: empty
            };
        }
        else {
            return {
                begin: cbs.begin || empty,
                change: cbs.change || empty,
                end: cbs.end || empty
            };
        }
    }

    // TODO: set draggable class (handy for fx)

    function style(e, prop, value) {
        e.style[prop] = value;
    }

    function empty() {}

    function callCb(cb, elem, e) {
        e.preventDefault();

        var offset = findPos(elem);
        var width = elem.clientWidth;
        var height = elem.clientHeight;
        var cursor = {
            x: cursorX(elem, e),
            y: cursorY(elem, e)
        };
        var x = (cursor.x - offset.x) / width;
        var y = (cursor.y - offset.y) / height;

        cb({
            x: isNaN(x)? 0: x,
            y: isNaN(y)? 0: y,
            cursor: cursor,
            elem: elem,
            e: e
        });
    }

    // http://stackoverflow.com/questions/4394747/javascript-curry-function
    function partial(fn) {
        var slice = Array.prototype.slice;
        var args = slice.apply(arguments, [1]);

        return function() {
            return fn.apply(null, args.concat(slice.apply(arguments)));
        };
    }

    // http://www.quirksmode.org/js/findpos.html
    function findPos(e) {
        var x = 0;
        var y = 0;

        if(e.offsetParent) {
            do {
                x += e.offsetLeft;
                y += e.offsetTop;
            } while (e = e.offsetParent);
        }

        return {x: x, y: y};
    }

    // http://javascript.about.com/library/blmousepos.htm
    function cursorX(elem, evt) {
        if(isFixed(elem)) {
            var bodyLeft = parseInt(getStyle(document.body, 'marginLeft'), 10) -
                calc(elem, 'scrollLeft') + window.pageXOffset +
                elem.style.marginLeft;

            return evt.clientX - bodyLeft;
        }
        if(evt.pageX) return evt.pageX;
        else if(evt.clientX)
            return evt.clientX + document.body.scrollLeft;
    }
    function cursorY(elem, evt) {
        if(isFixed(elem)) {
            var bodyTop = parseInt(getStyle(document.body, 'marginTop'), 10) -
                calc(elem, 'scrollTop') + window.pageYOffset +
                elem.style.marginTop;

            return evt.clientY - bodyTop;
        }
        if(evt.pageY) return evt.pageY;
        else if(evt.clientY)
            return evt.clientY + document.body.scrollTop;
    }

    function calc(element, prop) {
        var ret = 0;

        while (element.nodeName != "HTML") {
            ret += element[prop];
            element = element.parentNode;
        }

        return ret;
    }

    // http://www.velocityreviews.com/forums/t942580-mouse-position-in-both-fixed-and-relative-positioning.html
    function isFixed(element) {
        // While not at the top of the document tree, or not fixed, keep
        // searching upwards.
        while (element.nodeName != "HTML" && usedStyle(element,
                "position") != "fixed")
            element = element.parentNode;
            if(element.nodeName == "HTML") return false;
            else return true;
    }

    // http://www.javascriptkit.com/dhtmltutors/dhtmlcascade4.shtml
    function getStyle(el, cssprop){
        if (el.currentStyle) // IE
            return el.currentStyle[cssprop];

        if(document.defaultView && document.defaultView.getComputedStyle)
            return document.defaultView.getComputedStyle(el, "")[cssprop];

        //try and get inline style
        return el.style[cssprop];
    }

    // Used style is to get around browsers' different methods of getting
    // the currently used (e.g. inline, class, etc) style for an element
    function usedStyle(element, property) {
        var s;

        // getComputedStyle is the standard way but some ie versions don't
        // support it
        if(window.getComputedStyle)
            s = window.getComputedStyle(element, null);
        else s = element.currentStyle;

        return s[property];
    }
})();
