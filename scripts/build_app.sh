#!/bin/bash

echo "Debug Information:"
echo "Current Dir: $(pwd)"
echo "<====================>"
ls -la
echo "<====================>"

yes | ../.tools/tools/bin/sdkmanager --sdk_root=.tools --licenses
`npm bin`/bubblewrap build --skipPwaValidation