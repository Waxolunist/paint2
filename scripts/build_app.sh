#!/bin/bash

yes | .tools/tools/bin/sdkmanager --sdk_root=.tools --licenses
`npm bin`/bubblewrap build