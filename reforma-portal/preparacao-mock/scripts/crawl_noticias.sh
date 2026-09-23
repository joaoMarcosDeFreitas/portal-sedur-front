#!/bin/bash
cd "$(dirname "$0")"
for i in $(seq 0 80); do
  s=$((i*10))
  f=nlist/start_$s.html
  if [ ! -s "$f" ]; then
    if [ "$s" = "0" ]; then u="https://sedur.salvador.ba.gov.br/noticias"; else u="https://sedur.salvador.ba.gov.br/noticias?start=$s"; fi
    bash get.sh "$u" "$f" >> nlist/crawl.log
    sleep 2
  fi
done
echo FIM >> nlist/crawl.log
