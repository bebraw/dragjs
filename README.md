**dragjs** has been designed to make it easy to create JavaScript based drag interactions. This includes use cases such as draggable panels and different types of sliders. The idea is that you use the logic from this package to build your own components as it captures concerns such as mouse and touch handling.

## Demonstrations

<div id="value"></div>

### Simple draggable

<div id="draggableParent">
  <div id="draggable">Drag me!</div>
</div>


```typescript
import { draggable } from "dragjs";

const draggableElement = document.getElementById("draggable");

draggableElement && draggable({ element: draggableElement });
```

### 1D slider

<div id="onedContainer"></div>

```typescript
import { slider } from "dragjs";

const onedContainer = document.getElementById("onedContainer");

onedContainer && slider({
  parent: onedContainer,
  "class": "oned",
  cbs: {
    begin: () => {
      log("2dslider: begin");
    },
    change: ({ x, pointer }) => {
      const newX = clamp(x * 100, 0, 100).toFixed(2) + "%";

      console.log("2dslider: " + newX);

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

const twodContainer = document.getElementById("twodContainer");

twodContainer && xyslider({
  parent: twodContainer,
  "class": "twod",
  cbs: {
    change: ({ x, y, pointer }) => {
      const newX = clamp(x * 100, 0, 100).toFixed(2) + "%";
      const newY = clamp(y * 100, 0, 100).toFixed(2) + "%";

      console.log("x: " + newX + ", y: " + newY);

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

To publish, tag a release with the desired version (i.e. `git tag 0.13.0`) and then `git push`.

## License

**dragjs** is available under MIT. See LICENSE for more details.
