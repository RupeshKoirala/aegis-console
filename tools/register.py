# usage: python3 register.py <Mxx> <folder> "<coming-soon title to remove>" "<course map block>"
import sys, re
mid, folder, soon, block = sys.argv[1:5]
p='/home/user/aegis-console/src/app/core/curriculum.ts'
s=open(p).read()
imp=f"import {{ {mid} }} from '../modules/{folder}/module';"
if imp not in s:
    last=[l for l in s.splitlines() if l.startswith("import { M")][-1]
    s=s.replace(last, last+"\n"+imp)
    s=s.replace("  // @@modules", f"  {mid},\n  // @@modules")
s=s.replace(f"  '{soon}',\n","")
open(p,'w').write(s)
p='/home/user/aegis-console/COURSE_MAP.md'
s=open(p).read()
if f"## {mid} ·" not in s:
    s=s.replace("## Coming next", block.strip()+"\n\n## Coming next",1)
    s=re.sub(rf"\| {mid} \|.*\n","",s)
open(p,'w').write(s)
