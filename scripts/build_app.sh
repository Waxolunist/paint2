#!/bin/bash

yes | .tools/tools/bin/sdkmanager --sdk_root=.tools --licenses
cd android
`npm bin`/bubblewrap build