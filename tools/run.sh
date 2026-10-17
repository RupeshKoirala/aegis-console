#!/bin/bash
# usage: run.sh sol|stub [test-include...]
export PATH=/home/user/.toolchain/node-v24.22.0-linux-x64/bin:$PATH
cd /home/user/aegis-console
node /home/user/course-src/gen.mjs "$1" /home/user/aegis-src/modules src/app/modules || exit 1
shift
if [ $# -gt 0 ]; then
  args=(); for i in "$@"; do args+=(--include "$i"); done
  npx ng test "${args[@]}" --watch=false 2>&1 | grep -E "✓|×|ERROR|Error:|error TS|NG[0-9]|Tests |Test Files" | head -80
fi
