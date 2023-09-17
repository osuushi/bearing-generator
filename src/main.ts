import { generate, generatePreview, validate } from "./generate";
import "./style.css";
import heroUrl from "./hero.jpg";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <header style="margin-bottom:0; padding-bottom:0;">
      <h1> Bearing Generator </h1>
    </header>
    <form>
    <p>
    <img src="${heroUrl}" alt="A 608 bearing printed in place" style="width:30%;float:right;margin-left:10px;border-radius:8px">
    This is an STL generator for simple print-in-place bearings. The bearings are made of
    three interlocked rings which can slide past each other to reduce friction.
    </p><p>
    Fill out the form below and click "Download STL" to download the STL file. The default values give
    a standard 608 (i.e. skateboard) bearing.
    </p>
    <p>
    This design is surprisingly effective, and very fast to print. These bearings aren't terribly strong,
    of course, but for low load applications that don't need super low friction, they're great.
    </p><p>
    There are two bearing designs: one with two rings, and one with three rings.
    </p><p>
    The two ring design is simpler, stronger, and will have less play, since there is only one gap where
    clearance is required for printing. The three ring design may have less friction, since it has two
    gaps where the rings can slide past each other, but it has smaller parts, and requires clearance
    for both gaps, so it has twice as much play.
    </p><p>
    In practice, the difference in friction between the two designs is pretty small, and in most cases,
    the reduced play of the two ring design is a better tradeoff.
    </p>
    <section>
    <table>
      <tr>
        <td>
          <label><input type="radio" id="2-rings" name="number-of-rings" value="2" checked>Two rings</label>
          <label><input type="radio" id="3-rings" name="number-of-rings" value="3">3 rings</label>
        </td>
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
    <section>
      <figure>
      <figcaption>Cross section <span id="error" style="color:red;font-weight:bold;"></span></figcaption>
      <canvas id="preview" width="600" height="300" style="max-width: 100%"></canvas>
      </figure>
    </section>
    <section>
    <button type="button" id="generate">Download STL</button>
    </section>
    <article>
      <h2>Other stuff</h2>
      <ul>
        <li>Print these in place in exactly the arrangement that they're saved in. Don't separate the rings before printing, or you won't be able to put them together.</li>
        <li>A clearance of 0.3mm is a good tradeoff between ease of print and smoothness of operation.</li>
        <li>
          For smaller bearings, I recommend printing entirely as vertical walls rather than worrying about infill.
          Just set the walls to "100", for example. This will make the bearing stronger, and it's still very
          fast to print, since every layer will just be made up of circles.
        </li>
        <li>
          These are pretty smooth as printed, but a little grease will help them work even more smoothly.
        </li>
        <li>
          The generator is licensed under the MIT license. I doubt that I have any rights over the generated STLs, but just for clarity,
          I release all rights to them.
        </li>
    </article>
  </form>
`;

document
  .querySelector<HTMLButtonElement>("#generate")!
  .addEventListener("click", () => {
    generate();
  });

// On any change, update the preview
document.querySelectorAll<HTMLInputElement>("#app input").forEach((input) => {
  input.addEventListener("change", () => {
    // Enforce maxes and mins on each field
    let constrainField = (id: string) => {
      let field = document.querySelector<HTMLInputElement>(id)!;
      let min = parseFloat(field.min);
      let max = parseFloat(field.max);
      let value = field.valueAsNumber;
      if (value < min) {
        field.value = min.toString();
      } else if (value > max) {
        field.value = max.toString();
      }
    };
    constrainField("#outer-diameter");
    constrainField("#bore-diameter");
    constrainField("#width");
    constrainField("#clearance");

    validate();

    generatePreview();
  });
});
generatePreview();

export {};
