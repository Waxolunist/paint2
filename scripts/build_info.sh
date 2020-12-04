#!/bin/bash
rm -f build_info.txt
while (( "$#" )); do 
  echo $1 >> build_info.txt
  shift 
done