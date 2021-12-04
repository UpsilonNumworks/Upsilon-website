#!/bin/sh

for f in *.png
do
  cwebp -q 90 $f -o ${f%%.*}.webp &
done
