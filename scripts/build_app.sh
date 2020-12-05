#!/bin/bash

echo "Debug Information:"
echo "Current Dir: $(pwd)"
echo "<====================>"
ls -la
echo "<====================>"

yes | ../.tools/tools/bin/sdkmanager --sdk_root=.tools --licenses

echo "Debug Information:"
echo "Current Dir: $(pwd)"
echo "<====================>"
echo "Tools content"
echo "<====================>"
ls -la ../.tools
echo "<====================>"

`npm bin`/bubblewrap build --skipPwaValidation