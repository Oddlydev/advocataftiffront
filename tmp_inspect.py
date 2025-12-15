from pathlib import Path
lines=Path('wp-templates/single-dataset.tsx').read_text().splitlines()
for i,line in enumerate(lines):
    if 'openInsightsPanel' in line:
        for l in lines[i-5:i+15]:
            print(l)
        break
