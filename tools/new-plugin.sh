#!/bin/sh
# Scaffolds a plugin folder: tools/new-plugin.sh <id> "<Name>" [composer]
# Writes index.html, plugin.js and worklet.js. The plugin's own dsp.js and def.js are written by hand.
set -e
cd "$(dirname "$0")/../plugins"
id="$1"; name="$2"; reg="register"; [ "$3" = "composer" ] && reg="registerComposer"
mkdir -p "$id"
sed "s/Hyphal Harp/$name/" hyphal-harp/index.html > "$id/index.html"
printf "import { start } from '../kit/kit.js'\nimport { def } from './def.js'\nstart(def)\n" > "$id/plugin.js"
printf "import { %s } from '../kit/worklet-base.js'\nimport { create } from './dsp.js'\n%s('%s', create)\n" "$reg" "$reg" "$id" > "$id/worklet.js"
