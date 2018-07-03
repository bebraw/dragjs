/*! dragjs - v0.8.0 - Juho Vepsalainen <bebraw@gmail.com> - MIT
https://bebraw.github.com/dragjs - 2018-07-03 */
var drag = (function() {
    function drag(elem, cbs) {
        if(!elem) {
            console.warn('drag is missing elem!');
            return;
        }

        dragTemplate(elem, cbs, 'touchstart', 'touchmove', 'touchend');
        dragTemplate(elem, cbs, 'mousedown', 'mousemove', 'mouseup');
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

        for(var n in cbs) {
          ret[n] = wrap(cbs[n]);
        }

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
        if(klass) {
          elem.className = klass;
        }
        p.appendChild(elem);

        return elem;
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

    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
    function on(elem, evt, handler) {
        // Test via a getter in the options object to see if the passive property is accessed
        var supportsPassive = false;
        try {
        var opts = Object.defineProperty({}, 'passive', {
            get: function() {
            supportsPassive = true;
            }
        });
        window.addEventListener("testPassive", null, opts);
        window.removeEventListener("testPassive", null, opts);
        } catch (e) {}

        elem.addEventListener(evt, handler, supportsPassive ? { passive: false } : false);
    }

    function off(elem, evt, handler) {
      elem.removeEventListener(evt, handler, false);
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
        var r = e.getBoundingClientRect();

        return {
            x: r.left,
            y: r.top
        };
    }

    // http://javascript.about.com/library/blmousepos.htm
    function cursorX(elem, evt) {
        var evtPos = evt.touches ? evt.touches[evt.touches.length -1] : evt;
        return evtPos.clientX;
    }
    function cursorY(elem, evt) {
        var evtPos = evt.touches ? evt.touches[evt.touches.length -1] : evt;
        return evtPos.clientY;
    }
})();