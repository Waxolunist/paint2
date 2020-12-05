#!/bin/bash

echo "Debug Information:"
echo "Current Dir: $(pwd)"
echo "<====================>"
ls -la
echo "<====================>"

DEFAULT_SYSTEM="linux"
# Possible values: mac | linux | win
SYSTEM=${1:-$DEFAULT_SYSTEM}    
echo "Download commandline tools for ${SYSTEM}."
# Download from https://developer.android.com/studio#command-tools
mkdir -p .tools
cd .tools

echo "Debug Information:"
echo "Current Dir: $(pwd)"
echo "<====================>"
ls -la
echo "<====================>"

curl https://dl.google.com/android/repository/commandlinetools-${SYSTEM}-6858069_latest.zip --output commandlinetools.zip
unzip -u commandlinetools.zip
rm -rf tools
cp -R cmdline-tools tools

echo "Debug Information:"
echo "Current Dir: $(pwd)"
echo "<====================>"
ls -la
echo "<====================>"
