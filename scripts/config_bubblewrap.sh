#!/bin/bash

CWD=$(PWD)
if command -v /usr/libexec/java_home &> /dev/null
then
    JDK8_HOME=$(cd "`/usr/libexec/java_home -v1.8`/../.." && pwd)
fi
ANDROID_CLI_HOME="${CWD}/.tools"

echo "{\"jdkPath\":\"${JDK8_HOME:-JAVA_HOME}\",\"androidSdkPath\":\"${ANDROID_CLI_HOME}\"}" > "${HOME}/.bubblewrap/config.json"
