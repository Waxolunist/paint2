#!/bin/bash

DEFAULT_SYSTEM="linux"
# Possible values: mac | linux | win
SYSTEM=${1:-$DEFAULT_SYSTEM}    
echo "Download commandline tools for ${SYSTEM}."
# Download from https://developer.android.com/studio#command-tools
mkdir -p .tools
cd .tools

curl https://dl.google.com/android/repository/commandlinetools-${SYSTEM}-7302050_latest.zip --output commandlinetools.zip
unzip -u commandlinetools.zip
rm -rf tools
cp -R cmdline-tools tools