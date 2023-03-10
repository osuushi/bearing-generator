import { Bearing } from "./bearing"
import { makeAsciiSTL } from "./stl"

export function generate() {
  // Get the bearing
  let bearing = bearingFromForm()
  // Get the triangles
  let triangles = bearing.getTriangles()
  // Create the STL contents
  const stl = makeAsciiSTL(triangles)

  // Create a link to download the STL
  let link = document.createElement('a')
  link.download = bearing.fileName
  link.href = 'data:application/octet-stream,' + encodeURIComponent(stl)
  link.click()
}

export function generatePreview() {
  let bearing = bearingFromForm()
  let canvas = document.querySelector<HTMLCanvasElement>('#preview')!
  bearing.drawPreview(canvas)
}

function bearingFromForm(): Bearing {
  // Get the form values
  let outerDiameter = parseFloat(document.querySelector<HTMLInputElement>('#outer-diameter')!.value)
  let boreDiameter = parseFloat(document.querySelector<HTMLInputElement>('#bore-diameter')!.value)
  let width = parseFloat(document.querySelector<HTMLInputElement>('#width')!.value)
  let clearance = parseFloat(document.querySelector<HTMLInputElement>('#clearance')!.value)
  // Create the bearing
  return new Bearing({
    outerDiameter: outerDiameter,
    boreDiameter: boreDiameter,
    width: width,
    clearance: clearance,
  })
}