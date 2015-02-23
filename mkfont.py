# Based on generator from grunt-webfont

import fontforge
import os
import re
import sys
import json

args = json.loads(sys.argv[1])

f = fontforge.font()
f.encoding = 'UnicodeFull'
f.copyright = 'Modell Aachen GmbH'
f.design_size = 160

f.descent = 0
f.ascent = 1000
f.em = int(args['fontHeight']*10)

scssTemplate = args['scssTemplate']
scsstf = open(scssTemplate, 'r')
scsstmpl = scsstf.read()
scssOut = args['scssDest']

glyphInfo = []

cp = 0xf500

dimsre = re.compile(r"""
	<svg
	\s+ [^>]*
	viewBox="([0-9.]+) \s+ ([0-9.]+) \s+ ([0-9.]+) \s+ ([0-9.]+)"
""", re.X)

print(str.format("Generating font {0}...", args['fontBaseName']))

for dirname, dirnames, filenames in os.walk(args['inputDir']):
	for filename in sorted(filenames):
		name, ext = os.path.splitext(filename)
		filePath = os.path.join(dirname, filename)
		size = os.path.getsize(filePath)

		if ext in ['.svg']:
			# Grab height, width
			svgfile = open(filePath, 'r')
			svgtext = svgfile.read()
			svgfile.close()

			dims = re.search(dimsre, svgtext)
			vbox = (0, 0, 0, 0)
			if dims:
				vbox = (
					float(dims.group(1))*10.0,
					float(dims.group(2))*10.0,
					float(dims.group(3))*10.0,
					float(dims.group(4))*10.0
				)

			glyph = f.createChar(cp)
			glyph.importOutlines(filePath)
			glyph.correctDirection()
			glyph.round(10e2)

			bbox = glyph.boundingBox()
			glyph.left_side_bearing = bbox[0] - vbox[0]
			glyph.right_side_bearing = vbox[2] - bbox[2]
			glyph.width = vbox[2] - vbox[0]
			glyph.vwidth = vbox[3] - vbox[1]

			glyphInfo.append({'name': name, 'cp': cp, 'bbox': bbox, 'vbox': vbox})
			cp += 1

fontfile = args['dest'] + os.path.sep + args['fontBaseName']

f.fontname = args['fontBaseName']
f.familyname = args['fontBaseName']
f.fullname = args['fontBaseName']

if args['autoHint']:
	f.autoHint()

# font files
f.generate(fontfile + '.ttf')
f.generate(fontfile + '.woff')
f.generate(fontfile + '.svg')

# Fix SVG header for webkit (from: https://github.com/fontello/font-builder/blob/master/bin/fontconvert.py)
svgfile = open(fontfile + '.svg', 'r+')
svgtext = svgfile.read()
svgfile.seek(0)
svgfile.write(svgtext.replace('<svg>', '<svg xmlns="http://www.w3.org/2000/svg">'))
svgfile.close()

# scss
scss = scsstmpl.replace('${fontname}', args['fontBaseName']).replace('${cssbasepath}', args['cssBasePath']).replace('${cssbasename}', args['cssBaseName'])
scss, scssVar, scssSingle = scss.split('---', 2)

for gi in glyphInfo:
	scssGi = scssVar.replace('${name}', gi['name']).replace('${cp}', str.format('\\{:x}', gi['cp'])) + \
		scssSingle.replace('${name}', gi['name']).replace('${cp}', str.format('\\{:x}', gi['cp']))
	scss += scssGi +"\n"

scsstf = open(scssOut, 'w')
scsstf.write(scss)

print(json.dumps({'file': fontfile}))
