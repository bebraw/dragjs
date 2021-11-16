dragjs makes it easy to write deal with dragging in JavaScript making it handy for draggables, sliders, and such.

## Demonstrations

<div id="value"></div>

### Simple draggable

<div id="draggable">Drag me!</div>


```typescript
import { draggable } from "dragjs";

const draggableElement = $E("draggable");

draggableElement && draggable({ element: draggableElement });
```

### 1D slider

<div id="onedContainer"></div>

```typescript
import { slider } from "dragjs";

slider({
  parent: onedContainer,
  "class": "oned",
  cbs: {
    begin: () => {
      log("2dslider: begin");
    },
    change: ({ x, pointer }) => {
      const newX = clamp(x * 100, 0, 100).toFixed(2) + "%";

      log("2dslider: " + newX);

      if (pointer) {
        pointer.style.left = newX;
      }
    },
    end: () => {
      log("2dslider: end");
    },
  },
});
```

### 2D slider

<div id="twodContainer"></div>

```typescript
import { xyslider } from "dragjs";

xyslider({
  parent: twodContainer,
  "class": "twod",
  cbs: {
    change: ({ x, y, pointer }) => {
      const newX = clamp(x * 100, 0, 100).toFixed(2) + "%";
      const newY = clamp(y * 100, 0, 100).toFixed(2) + "%";

      log("x: " + newX + ", y: " + newY);

      if (pointer) {
        pointer.style.left = newX;
        pointer.style.top = newY;
      }
    },
  },
});
```

## Contributors

* [Jean Carrière](https://github.com/JeanCarriere)
* [Sam Potts](https://github.com/SamPotts) - Use getBoundingClientRect(), IE9+ support

## Development

Run the available commands through [velociraptor](https://github.com/umbopepato/velociraptor) (vr).

To build, run `vr build <version?>`. Then to publish, `cd npm && npm publish`.

## License

dragjs is available under MIT. See LICENSE for more details.
