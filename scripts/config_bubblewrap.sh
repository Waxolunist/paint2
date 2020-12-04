#!/bin/bash

if command -v /usr/libexec/java_home &> /dev/null
then
    JDK8_HOME=$(cd "`/usr/libexec/java_home -v1.8`/../.." && pwd)
fi
CWD=$(pwd)
ANDROID_CLI_HOME="${CWD}/.tools"

mkdir -p "${HOME}/.bubblewrap"
echo "{\"jdkPath\":\"${JDK8_HOME:-$JAVA_HOME}\",\"androidSdkPath\":\"${ANDROID_CLI_HOME}\"}" > "${HOME}/.bubblewrap/config.json"

cat "${HOME}/.bubblewrap/config.json"