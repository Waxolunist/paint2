#!/bin/bash

DEFAULT_SYSTEM="linux"
# Possible values: mac | linux | win
SYSTEM=${1:-DEFAULTVALUE}    

# Download from https://developer.android.com/studio#command-tools
mkdir -p .tools
cd .tools
curl https://dl.google.com/android/repository/commandlinetools-${SYSTEM}-6858069_latest.zip --output commandlinetools.zip
unzip -u commandlinetools.zip
rm -rf tools
mv cmdline-tools tools