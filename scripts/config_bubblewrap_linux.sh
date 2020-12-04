#!/bin/bash

CWD=$(PWD)
JDK8_HOME="${JAVA_HOME}"
ANDROID_CLI_HOME="${CWD}/.tools"

echo "{\"jdkPath\":\"${JDK8_HOME}\",\"androidSdkPath\":\"${ANDROID_CLI_HOME}\"}" > "${HOME}/.bubblewrap/config.json"
