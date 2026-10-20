#!/bin/bash
# usage: publish.sh "<commit subject>"   – regenerates main (stub) + solutions (sol), commits, pushes, syncs authoring
set -e
export PATH=/home/user/.toolchain/node-v24.22.0-linux-x64/bin:$PATH
MSG="$1"; TRAILER=$'\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_015krzqpqvuUbeUeFWaQ9keL'
G="git -c user.name=Claude -c user.email=noreply@anthropic.com"
GEN=/home/user/course-src/gen.mjs; SRC=/home/user/aegis-src/modules
cd /home/user/aegis-console
rm -f api/db.json
git checkout -q main
node $GEN stub $SRC src/app/modules
git add -A; $G commit -qm "$MSG$TRAILER"
git checkout -q solutions
$G merge -q --no-edit main
node $GEN sol $SRC src/app/modules
git add -A; $G commit -qm "Solutions: $MSG$TRAILER" || true
git checkout -q main
node $GEN stub $SRC src/app/modules
git push -q origin main solutions
cd /home/user/aegis-authoring
rm -rf modules; cp -r $SRC modules; cp $GEN /home/user/aegis-src/run.sh /home/user/aegis-src/publish.sh /home/user/aegis-src/make-bugs.py tools/
git add -A; $G commit -qm "Authoring: $MSG$TRAILER" || true
git push -q origin authoring
echo "published: $MSG"
