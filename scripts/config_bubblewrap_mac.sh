#!/bin/bash

CWD=$(PWD)
JDK8_HOME=$(cd "`/usr/libexec/java_home -v1.8`/../.." && pwd)
ANDROID_CLI_HOME="${CWD}/.tools"

echo "{\"jdkPath\":\"${JDK8_HOME}\",\"androidSdkPath\":\"${ANDROID_CLI_HOME}\"}" > "${HOME}/.bubblewrap/config.json"
