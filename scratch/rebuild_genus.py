import json
import os

with open('assets/data/flower_data.json', 'r', encoding='utf-8') as f:
    flowers = json.load(f)

print(f"Total flowers in dataset: {len(flowers)}")

genus_map = {}
unmatched = []

for flower in flowers:
    fid = flower.get('id', '')
    bot = flower.get('botanical_name', '').strip()
    if not bot:
        unmatched.append((fid, flower.get('mothers_name', ''), 'No botanical name'))
        continue
    
    parts = bot.split()
    first_word = parts[0].strip(" '\"[],.")
    genus = first_word.capitalize()
    
    if len(genus) <= 1 or not genus.isalpha():
        unmatched.append((fid, flower.get('mothers_name', ''), bot))
        continue

    if genus not in genus_map:
        genus_map[genus] = []
    genus_map[genus].append(fid)

print(f"Total unique genus groups found: {len(genus_map)}")

total_assigned = sum(len(ids) for ids in genus_map.values())
print(f"Total flowers assigned: {total_assigned}")
if unmatched:
    print(f"Unmatched flowers ({len(unmatched)}): {unmatched}")
else:
    print("ALL flowers cleanly matched to Genus groups!")

groups_list = []
idx = 1
for genus in sorted(genus_map.keys(), key=lambda g: (-len(genus_map[g]), g)):
    ids = genus_map[genus]
    groups_list.append({
        "group_id": f"G{idx}",
        "genus": genus,
        "total_flowers": len(ids),
        "flower_ids": ids
    })
    idx += 1

os.makedirs('scratch', exist_ok=True)
with open('scratch/new_flower_groups.json', 'w', encoding='utf-8') as f:
    json.dump(groups_list, f, indent=2)

print("Saved scratch/new_flower_groups.json successfully!")
