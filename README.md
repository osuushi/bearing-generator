# bearing-generator

This is a small standalone web-app written in typescript which generates STL
files for simple 3D printed bearings which can be printed in place.

This is fully client-side, so there is no need to check out the code if you just
want to use the generator.

You can find [the online version here](https://osuushi.github.io/bearing-generator/).

## Usage

Fill out the form, check the preview, then click "Download STL" to download.
Print the resulting STL in the orientation generated, flat on the build plate,
and don't separate the parts. If it sticks together, you can try bumping up the
clearance. If you want less play, you can tighten up the clearance, but you may
have more difficulty getting a successful print.

## Development

This is a typescript project and requires node 19.7.0. To build, run `yarn
install`, then `yarn build`. To run a development server, run `yarn dev` and
visit the localhost link it prints out.

The project uses [vite](https://vitejs.dev/) for development. It has no other
depedencies.

## STL Generation

These bearings are simple polygons revolved around the Z axis. They're generated
by turning each line segment in the input polygon into a ring of triangles.
These triangles are then spat out into an ascii STL file.

## License

This project is licensed under the MIT license. See the LICENSE file for more details.
