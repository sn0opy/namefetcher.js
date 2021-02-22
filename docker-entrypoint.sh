#! /bin/sh

while true; do
  node name_fetcher.js
  if [ -n "${NF_INTERVAL}" ]; then
    sleep ${NF_INTERVAL}h
  else
    break
  fi
done
