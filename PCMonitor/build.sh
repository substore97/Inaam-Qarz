#!/bin/sh
# Builds release/InaamPCMonitor.exe (+ .zip). Pass a photo to use it as the icon:
#   ./build.sh my-photo.jpg
set -e
cd "$(dirname "$0")"
python3 res/make_icon.py "$@"
(cd res && llvm-rc /FO app.res app.rc && llvm-cvtres /MACHINE:X64 /OUT:../rsrc_windows_amd64.syso app.res && rm app.res)
mkdir -p release
GOOS=windows GOARCH=amd64 go build -trimpath -ldflags "-s -w -H windowsgui" -o release/InaamPCMonitor.exe .
(cd release && rm -f InaamPCMonitor.zip && zip -q -9 InaamPCMonitor.zip InaamPCMonitor.exe)
ls -la release
