import { generate, generatePreview } from "./generate"

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header style="margin-bottom:0; padding-bottom:0;">
  <h1> Bearing Generator </h1>
  </header>
  <form>
    <p> 
    This is an STL generator for simple print-in-place bearings. The bearings are made of
    three interlocked rings which can slide past each other to reduce friction.
    </p><p>
    Fill out the form below and click "Generate" to download the STL file.
    For example, the defaults produce a standard 608 (i.e. skateboard) bearing.
    </p>
    <section>
    <table>
      <tr>
        <td>
          <label for="outer-diameter">Outer diameter (mm)</label>
          <input type="number" id="outer-diameter" name="outer-diameter" value="22" step="0.1" min="10" max="1000" required>
        </td>
        <td>
          <label for="bore-diameter">Bore diameter (mm)</label>
          <input type="number" id="bore-diameter" name="bore-diameter" value="8" step="0.1" min="1" max="1000" required>
        </td>
        <td>
          <label for="width">Width (mm)</label>
          <input type="number" id="width" name="width" value="7" step="0.1" min="6" max="1000" required>
        </td>
        <td>
          <label for="clearance">Clearance (mm)</label>
          <input type="number" id="clearance" name="clearance" value="0.3" step="0.1" min="0" max=".5" required>
        </td>
      </tr>
    </table>
    </section>
    <br>
    <small> (Distance between the rings. For reference, 0.1 is doable on a well calibrated printer, 0.3 is a little wobbly, but much easier to print) </small>  
    <section>
      <figure>
      <figcaption>Cross section</figcaption>
      <canvas id="preview" width="600" height="400"></canvas>
      </figure>
    </section>
    <br>
    <button type="button" id="generate">Generate STL</button>
  </form>
`

document.querySelector<HTMLButtonElement>('#generate')!.addEventListener('click', () => {
  generate()
})

// On any change, update the preview
document.querySelectorAll<HTMLInputElement>('#app input').forEach(input => {
  input.addEventListener('change', () => {
    generatePreview()
  })
})
generatePreview()

export { }