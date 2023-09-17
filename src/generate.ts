import { Bearing } from "./bearing";
import { Bearing2Ring } from "./bearing-2-ring";
import { Bearing3Ring } from "./bearing-3-ring";
import { makeBinarySTL } from "./stl";

export function generate() {
  // Get the bearing
  let bearing = bearingFromForm();
  // Get the triangles
  let triangles = bearing.getTriangles();
  // Create the STL contents
  const stl = makeBinarySTL(triangles);

  // Create a link to download the STL
  let link = document.createElement("a");
  link.download = bearing.fileName;
  // We have a uint8array, but we need a downloadable url. We can do this by creating a blob.
  let blob = new Blob([stl], { type: "application/octet-stream" });
  link.href = URL.createObjectURL(blob);
  link.click();
}

export function generatePreview() {
  let bearing = bearingFromForm();
  let canvas = document.querySelector<HTMLCanvasElement>("#preview")!;
  bearing.drawPreview(canvas);
}

export function validate() {
  let bearing = bearingFromForm();
  try {
    bearing.validate();
    document.querySelector("#error")!.textContent = "";
  } catch (e) {
    if (e instanceof Error) {
      document.querySelector("#error")!.textContent = e.message;
    } else {
      document.querySelector("#error")!.textContent = "Unknown error";
    }
  }
}

function bearingFromForm(): Bearing {
  // Get the form values
  let rings = parseInt(
    document.querySelector<HTMLInputElement>(
      'input[name="number-of-rings"]:checked'
    )!.value
  );
  let outerDiameter = parseFloat(
    document.querySelector<HTMLInputElement>("#outer-diameter")!.value
  );
  let boreDiameter = parseFloat(
    document.querySelector<HTMLInputElement>("#bore-diameter")!.value
  );
  let width = parseFloat(
    document.querySelector<HTMLInputElement>("#width")!.value
  );
  let clearance = parseFloat(
    document.querySelector<HTMLInputElement>("#clearance")!.value
  );
  if (rings === 2) {
    return new Bearing2Ring({
      outerDiameter: outerDiameter,
      boreDiameter: boreDiameter,
      width: width,
      clearance: clearance,
    });
  } else {
    // Create the bearing
    return new Bearing3Ring({
      outerDiameter: outerDiameter,
      boreDiameter: boreDiameter,
      width: width,
      clearance: clearance,
    });
  }
}
