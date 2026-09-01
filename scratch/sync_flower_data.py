import json
import os

def main():
    src_path = '../FlowerAI_Project/Data/flower_data.json'
    dst_path = 'assets/data/flower_data.json'

    with open(src_path, 'r', encoding='utf-8') as f:
        src_data = json.load(f)

    with open(dst_path, 'r', encoding='utf-8') as f:
        dst_data = json.load(f)

    # Build map of image_url by flower id from dst_data
    image_url_map = {}
    for f in dst_data:
        fid = str(f.get('id', ''))
        if f.get('image_url'):
            image_url_map[fid] = f['image_url']
            image_url_map[fid.zfill(3)] = f['image_url']

    # Merge fields into src_data
    merged_data = []
    for f in src_data:
        fid = str(f.get('id', ''))
        fid_padded = fid.zfill(3)
        
        # New object with proper field ordering
        new_flower = {}
        new_flower['id'] = fid_padded
        new_flower['mothers_name'] = f.get('mothers_name', '')
        new_flower['mothers_significance'] = f.get('mothers_significance', '')
        new_flower['botanical_name'] = f.get('botanical_name', '')
        new_flower['family'] = f.get('family', '')
        new_flower['common_names'] = f.get('common_names', '')
        new_flower['quotes'] = f.get('quotes', '')
        new_flower['source'] = f.get('source', '')
        
        # Retain or assign image_url
        img = f.get('image_url') or image_url_map.get(fid_padded) or image_url_map.get(fid) or ''
        new_flower['image_url'] = img
        
        new_flower['plant_type'] = f.get('plant_type', '')
        new_flower['primary_color'] = f.get('primary_color', '')
        new_flower['fragrance'] = f.get('fragrance', '')
        new_flower['flowering_season'] = f.get('flowering_season', '')
        new_flower['bloom_time'] = f.get('bloom_time', '')
        
        merged_data.append(new_flower)

    print(f"Total merged flowers: {len(merged_data)}")
    print(f"Flowers with image_url: {sum(1 for f in merged_data if f.get('image_url'))}")

    # Write formatted json to assets/data/flower_data.json
    with open(dst_path, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved {dst_path}")

    # Also write to FlowerAI_Project/Data/flower_data.json
    with open(src_path, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved {src_path}")

if __name__ == '__main__':
    main()
