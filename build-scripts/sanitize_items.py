"""
A build script for escaping unescaped quotation marks in the "StoreItems.json"
file that Twitch Toolkit writes to disk. This script also removes the trailing
comma from the last item in the "items" JSON array.

The initial step of this build script is to read and parse the "StoreItems.json"
file. Should the file be valid JSON, the script will abort early as there's no
sanitization that needs to be done.

Should the initial parse fail, the script will go through the raw file contents
line by line, looking for lines that indicate it's describing an item's
abbreviation ("abr" in the file). The line is then split by the ':' separator,
with the "key" half being written immediately to an intermediate buffer. The
value half is then iterated, looking for any unescaped quotation marks. Should
any be found, they are escaped to the buffer.

A part of this "line-by-line" iteration is watching for the closing array
character (']'). Should this line be encountered, the script will walk back up
the buffer to the final object in the `items` array, just before the final comma
was written, then write the expected closing object character ('}') and then
the closing array character, effectively removing any trailing comma that may
have been present in the file.

The final step is to reparse the sanitized result. Should it fail, the contents
will be written to disk anyway as a "best attempt." Should it succeed, the
script will use Python's `json.dump` method to serialize it to disk, unindented.
"""
import io
import os
import sys
from json import dump
from json import loads
from json import JSONDecodeError

with open("_data/StoreItems.json", "r") as file:
    contents: str = file.read()

try:
  loads(contents)

  print("Store items is already valid json; aborting...")

  sys.exit(0)
except JSONDecodeError:
  print("Store items was not valid json; attempting to sanitize...")

if not contents:
    print("There are no items available in the store. Aborting...")

    sys.exit(1)

buffer = io.StringIO()
last_position_cookie: int = 0

for line in contents.split("\n"):
    trimmed = line.strip()

    if line.endswith("],"):
        buffer.seek(last_position_cookie)
        buffer.write("\t\t}\n")
        buffer.write("\t],\n")

        continue

    if not trimmed.startswith('"abr"'):
        last_position_cookie = buffer.tell()
        buffer.write(line)
        buffer.write("\n")

        continue

    if trimmed.count('"') > 4:
        key, value = line.split(":")
        buffer.write(key)
        buffer.write(": ")

        first_quote_index = value.index('"')
        last_quote_index = value.rindex('"')

        buffer.write('"')

        last_char: str | None = None
        for char in value[first_quote_index + 1 : last_quote_index]:
            if char == '"' and last_char != "\\":
                buffer.write("\\")

            buffer.write(char)
            last_char = char

        last_position_cookie = buffer.tell()
        buffer.write('",')
    else:
        last_position_cookie = buffer.tell()
        buffer.write(line)

    last_position_cookie = buffer.tell()
    buffer.write("\n")

with open("_data/StoreItems.json", "w") as file:
    buffer.seek(0)
    buffer.truncate(last_position_cookie)

    try:
        data = loads(buffer.getvalue())
        dump(data, file)
    except ValueError:
        print(
            "Finished sanitizing items, but result isn't valid json; writing sanitized results anyway..."
        )

        file.write(buffer.getvalue())
