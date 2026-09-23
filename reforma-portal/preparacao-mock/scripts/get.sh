#!/bin/bash
# uso: get.sh URL arquivo
nice -n 19 ionice -c3 curl -sL -m 40 -A "Mozilla/5.0 (X11; Linux x86_64) inventario-leitura" -o "$2" -w "%{http_code} %{size_download} $1\n" "$1"
