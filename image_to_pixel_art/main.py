import os
from PIL import Image

from sys import argv

levels = "--lvl" in argv


def getpixels(path: str):
    img = Image.open(path).convert("RGB")

    width, height = img.size
    lines = []
    for y in range(height):
        line = '    "'
        for x in range(width):
            # Do something with each pixel
            pixel = img.getpixel((x, y))
            if pixel == (255, 255, 255):
                line += " "
            elif levels and pixel[0] == 255:
                line += "@"
            elif levels and pixel[1] == 255:
                line += "+"
            else:
                line += "#"

        line += '\\n"'
        lines.append(line)

    output = " + \n".join(lines)
    if levels:
        return output
    else:
        return ".loadArt(\n" + output + "\n)"


filenames = map(lambda x: x.name, os.scandir("input"))
files = map(lambda x: "input/" + x, sorted(filenames))
frames = map(getpixels, files)

with open("output.js", "wb") as f:
    if levels:
        output = "const Levels = [\n" + ",\n".join(frames) + "\n]"
    else:
        output = "prefab" + ".addFrame()".join(frames)
    f.write(output.encode("utf8"))
