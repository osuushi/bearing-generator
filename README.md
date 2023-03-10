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

The project uses [vite](https://vitejs.dev/) for development. Styles are
provided by [mvp.css](https://andybrewer.github.io/mvp/). It has no other
dependencies.



## STL Generation

These bearings are simple polygons revolved around the Z axis. They're generated
by turning each line segment in the input polygon into a ring of triangles. This
is simplified by using a constant number of points to approximate every circle,
since every pair of corresponding adjacent points can be connected by two
triangles. This is slightly inefficient, but it means that we don't need to
triangulate a polygon with a hole in it.

Since the STL is generated by revolving a polygon, we can use the same polygon
to show a cross section preview.

The stl.ts file handles output generation. Both ascii and binary generation are
provided, although only the binary format is used. The ascii generator might be
useful for debugging.

## License

This project is licensed under the MIT license. See the LICENSE file for more details.
