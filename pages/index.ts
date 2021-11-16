import { draggable, slider, xyslider } from "../mod.ts";

window.onload = function () {
  const draggableElement = document.getElementById("draggable");

  draggableElement && draggable({ element: draggableElement });

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

  const twodContainer = document.getElementById("twodContainer");

  twodContainer && xyslider({
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
};

function log(msg: string) {
  const valueElement = document.getElementById("value");

  console.log(msg);

  if (valueElement) {
    valueElement.innerHTML = msg;
  }
}

function clamp(a: number, min: number, max: number) {
  return Math.min(Math.max(a, min), max);
}
