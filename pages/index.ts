import { draggable, slider, xyslider } from "../mod.ts";

window.onload = function () {
  const draggableElement = $E("draggable");

  draggableElement && draggable({ element: draggableElement });

  const twodContainer = $E("twodContainer");

  twodContainer && xyslider({
    parent: twodContainer,
    "class": "twod",
    cbs: {
      change: ({ cursor, pointer }) => {
        const x = clamp(cursor.x * 100, 0, 100).toFixed(2) + "%";
        const y = clamp(cursor.y * 100, 0, 100).toFixed(2) + "%";

        log("x: " + x + ", y: " + y);

        if (pointer) {
          pointer.style.left = x;
          pointer.style.top = y;
        }
      },
    },
  });

  const onedContainer = $E("onedContainer");

  onedContainer && slider({
    parent: onedContainer,
    "class": "oned",
    cbs: {
      begin: ({ cursor }) => {
        log("2dslider: begin");
        console.log(cursor);
      },
      change: ({ cursor, pointer }) => {
        console.log(cursor, pointer);

        const x = clamp(cursor.x * 100, 0, 100).toFixed(2) + "%";

        log("2dslider: " + x);

        if (pointer) {
          pointer.style.left = x;
        }
      },
      end: ({ cursor }) => {
        log("2dslider: end");
        console.log(cursor);
      },
    },
  });
};

function log(msg: string) {
  const valueElement = $E("value");

  console.log(msg);

  if (valueElement) {
    valueElement.innerHTML = msg;
  }
}

function $E(id: string) {
  return document.getElementById(id);
}

function clamp(a: number, min: number, max: number) {
  return Math.min(Math.max(a, min), max);
}
