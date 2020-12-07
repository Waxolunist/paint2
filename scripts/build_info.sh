#!/bin/bash
rm -f build_info.txt
while (( "$#" )); do 
  echo $1 >> build_info.txt
  shift 
done

echo "Debug Information:"
echo "Current Dir: $(pwd)"
echo "<====================>"
ls -la