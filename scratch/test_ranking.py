import json

def main():
    c200_path = 'assets/data/common_indian_flowers.json'
    idx_path = 'assets/data/english_common_names_200_index.json'

    with open(c200_path, 'r', encoding='utf-8') as f:
        c200 = json.load(f)

    with open(idx_path, 'r', encoding='utf-8') as f:
        idx = json.load(f)

    flower_rank_map = {}
    for rank, f in enumerate(c200):
        fid = str(f['id'])
        flower_rank_map[fid] = rank
        flower_rank_map[fid.zfill(3)] = rank

    name_ranks = []
    for name, refs in idx['name_index'].items():
        ranks = [flower_rank_map.get(str(r['id']), 999) for r in refs]
        ranks = [r for r in ranks if r != 999]
        min_rank = min(ranks) if ranks else 999
        avg_rank = sum(ranks) / len(ranks) if ranks else 999
        name_ranks.append((min_rank, avg_rank, name))

    name_ranks.sort(key=lambda x: (x[0], x[1], x[2].lower()))

    print("Top 30 Ranked Common Names:")
    for min_r, avg_r, name in name_ranks[:30]:
        matched = idx['name_index'][name]
        ids = [r['id'] for r in matched]
        print(f"Rank {min_r+1:3d} (avg {avg_r+1:5.1f}): {name:32s} -> Flower IDs: {ids}")

if __name__ == '__main__':
    main()
