import json
import os

def clean_common_name(name_str):
    if not name_str:
        return []
    cleaned = []
    parts = [p.strip() for p in name_str.split(';') if p.strip()]
    for p in parts:
        p_clean = p.strip()
        if p_clean.startswith('('):
            if ')' in p_clean:
                p_clean = p_clean.rsplit(')', 1)[-1].strip()
            else:
                p_clean = ''
        
        p_clean = p_clean.replace('- of-', ' of ').replace('-of- ', ' of ').replace('Rose-of- ', 'Rose of ')
        p_clean = p_clean.replace('Rose-of-China', 'Rose of China').replace('Rose of-China', 'Rose of China')
        p_clean = p_clean.strip(' -')
        
        if not p_clean or p_clean in ['Rose of', 'Rose-of', 'Rose-of-', 'Rose of-']:
            continue
            
        cleaned.append(p_clean)
    return cleaned

CURATED_COMMON_NAMES = {
    "118": ["Night-flowering jasmine", "Tree of sorrow", "Parijat", "Coral jasmine"],
    "471": ["Tuberose"],
    "308": ["Gardenia", "Cape jasmine"],
    "160": ["Sweet alyssum", "Alyssum"],
    "253": ["Sweet pea"],
    "014": ["Rose moss", "Moss rose", "Portulaca"],
    "364": ["Rangoon creeper"],
    "832": ["Cape honeysuckle"],
    "669": ["Frangipani vine"],
    "535": ["Poppy anemone", "Windflower"],
    "869": ["Indian coral tree", "Tiger's claw"],
    "870": ["Indian coral tree", "Tiger's claw"],
    "871": ["Indian coral tree", "Tiger's claw"],
    "137": ["Common leucas"],
    "057": ["Blue eranthemum", "Blue sage"],
    "246": ["Yellow flame tree", "Copperpod"],
    "336": ["Pala indigo plant"],
    "138": ["Scarlet cordia", "Geiger tree"],
    "693": ["Red mussaenda", "Ashanti blood"],
    "493": ["Egyptian rattlesnake tree", "Common sesban"]
}

def main():
    flower_data_path = 'assets/data/flower_data.json'
    common_200_path = 'assets/data/common_indian_flowers.json'
    master_index_path = 'assets/data/english_common_names_index.json'

    with open(flower_data_path, 'r', encoding='utf-8') as f:
        flower_data = json.load(f)

    with open(common_200_path, 'r', encoding='utf-8') as f:
        common_200 = json.load(f)

    with open(master_index_path, 'r', encoding='utf-8') as f:
        master_index = json.load(f)

    flower_rank_map = {}
    c200_ids_set = set()
    for rank, item in enumerate(common_200):
        fid = str(item['id'])
        c200_ids_set.add(fid)
        c200_ids_set.add(fid.zfill(3))
        flower_rank_map[fid] = rank
        flower_rank_map[fid.zfill(3)] = rank

    db_map = {}
    for f in flower_data:
        fid = str(f['id'])
        db_map[fid] = f
        db_map[fid.zfill(3)] = f

    species_to_cnames = {}
    for f in flower_data:
        bot = (f.get('botanical_name') or '').strip()
        if not bot:
            continue
        parts = bot.split()
        genus = parts[0].strip(" []().'\"").capitalize()
        species_key = genus.lower()
        if len(parts) > 1 and not parts[1].startswith('(') and not parts[1].startswith("'"):
            species_key += " " + parts[1].strip(" []().'\"").lower()

        cnames = clean_common_name(f.get('common_names', ''))
        for cn in cnames:
            species_to_cnames.setdefault(species_key, set()).add(cn)
            species_to_cnames.setdefault(genus.lower(), set()).add(cn)

    for name, refs in master_index.get('name_index', {}).items():
        if name.startswith('('):
            continue
        cleaned_list = clean_common_name(name)
        for clean_n in cleaned_list:
            for r in refs:
                bot = (r.get('botanical_name') or '').strip()
                if not bot:
                    continue
                parts = bot.split()
                genus = parts[0].strip(" []().'\"").capitalize()
                species_key = genus.lower()
                if len(parts) > 1 and not parts[1].startswith('(') and not parts[1].startswith("'"):
                    species_key += " " + parts[1].strip(" []().'\"").lower()
                species_to_cnames.setdefault(species_key, set()).add(clean_n)
                species_to_cnames.setdefault(genus.lower(), set()).add(clean_n)

    name_index = {}
    flower_names_count = {}

    for item in common_200:
        fid = str(item['id'])
        fid_padded = fid.zfill(3)
        full_flower = db_map.get(fid_padded) or db_map.get(fid) or item

        bot = (full_flower.get('botanical_name') or item.get('botanical_name') or '').strip()
        parts = bot.split()
        genus = parts[0].strip(" []().'\"").capitalize() if parts else ''
        species_key = genus.lower()
        if len(parts) > 1 and not parts[1].startswith('(') and not parts[1].startswith("'"):
            species_key += " " + parts[1].strip(" []().'\"").lower()

        assigned_names = set()

        # 1. From master_index
        for mname, mrefs in master_index.get('name_index', {}).items():
            if mname.startswith('('):
                continue
            for clean_n in clean_common_name(mname):
                for r in mrefs:
                    rfid = str(r['id'])
                    if rfid == fid or rfid.zfill(3) == fid_padded:
                        assigned_names.add(clean_n)

        # 2. From flower_data direct common_names
        direct_cnames = clean_common_name(full_flower.get('common_names', ''))
        for cn in direct_cnames:
            assigned_names.add(cn)

        # 3. From Curated List
        if fid in CURATED_COMMON_NAMES:
            for cn in CURATED_COMMON_NAMES[fid]:
                assigned_names.add(cn)
        if fid_padded in CURATED_COMMON_NAMES:
            for cn in CURATED_COMMON_NAMES[fid_padded]:
                assigned_names.add(cn)

        # 4. Fallback to species level common names
        if not assigned_names and species_key in species_to_cnames:
            assigned_names.update(species_to_cnames[species_key])

        # 5. Fallback to genus level
        if not assigned_names and genus.lower() in species_to_cnames:
            g_names = species_to_cnames[genus.lower()]
            if genus in g_names:
                assigned_names.add(genus)
            else:
                assigned_names.update(g_names)

        ref_obj = {
            "id": fid_padded,
            "mothers_name": full_flower.get('mothers_name') or item.get('mothers_name') or '',
            "botanical_name": full_flower.get('botanical_name') or item.get('botanical_name') or ''
        }

        flower_names_count[fid_padded] = len(assigned_names)

        for name in assigned_names:
            if not name or name.startswith('(') or name in ['Rose of', 'Rose-of']:
                continue
            if name not in name_index:
                name_index[name] = []
            if not any(x['id'] == ref_obj['id'] for x in name_index[name]):
                name_index[name].append(ref_obj)

    for name in name_index:
        name_index[name].sort(key=lambda x: int(x['id']))

    name_ranks = []
    for name, refs in name_index.items():
        ranks = [flower_rank_map.get(str(r['id']), 999) for r in refs]
        ranks = [r for r in ranks if r != 999]
        min_rank = min(ranks) if ranks else 999
        avg_rank = sum(ranks) / len(ranks) if ranks else 999
        name_ranks.append((min_rank, avg_rank, name))

    name_ranks.sort(key=lambda x: (x[0], x[1], x[2].lower()))
    ranked_names = [x[2] for x in name_ranks]

    result = {
        "total_distinct_names": len(ranked_names),
        "names": ranked_names,
        "name_index": name_index
    }

    print(f"Total distinct common names: {len(ranked_names)}")
    print(f"Total common flowers covered: {sum(1 for cnt in flower_names_count.values() if cnt > 0)} out of {len(common_200)}")

    output_path = 'assets/data/english_common_names_200_index.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"Saved {output_path} successfully!")

    target_project_dir = '../FlowerAI_Project/Data'
    if os.path.exists(target_project_dir):
        project_out = os.path.join(target_project_dir, 'english_common_names_200_index.json')
        with open(project_out, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        print(f"Saved {project_out} successfully!")

if __name__ == '__main__':
    main()
