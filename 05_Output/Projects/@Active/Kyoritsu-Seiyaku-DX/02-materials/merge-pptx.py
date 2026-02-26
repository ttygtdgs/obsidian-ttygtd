#!/usr/bin/env python3
"""
共立製薬 PPTX合体スクリプト (ZIP-level merge)
- スコアシートDX提案 (13枚) → 前半（1.3333倍スケール）
- データ基盤メリット提案 (6枚) → 後半（そのまま）
- 出力スライドサイズ: 12192000 x 6858000 (データ基盤側に統一)

Strategy:
  1. Use data infra PPTX as base (keeps its slide master, layouts, theme)
  2. Copy scoresheet's slide master, layout, theme as slideMaster2, slideLayout5, theme3
  3. Copy scoresheet's slides (renumbered as slide7-19) with images
  4. Scale scoresheet slide XML positions/sizes by 1.3333x
  5. Also scale scoresheet's layout and master by 1.3333x
  6. Reorder slides in presentation.xml: scoresheet first, then data infra
"""

import copy
import os
import re
import shutil
import tempfile
import zipfile
from lxml import etree

# --- Paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCORESHEET_PATH = os.path.join(BASE_DIR, "共立製薬-スコアシートDX提案-2026-02.pptx")
DATA_INFRA_PATH = os.path.join(BASE_DIR, "データ基盤メリット提案_共立製薬_NTTDXPN.pptx")
OUTPUT_PATH = os.path.join(BASE_DIR, "共立製薬-統合提案-スコアシートDX+データ基盤_NTTDXPN.pptx")

# --- Constants ---
TARGET_WIDTH = 12192000
TARGET_HEIGHT = 6858000
SOURCE_WIDTH = 9144000
SOURCE_HEIGHT = 5143500
SCALE = TARGET_WIDTH / SOURCE_WIDTH  # 1.3333...

P_NS = 'http://schemas.openxmlformats.org/presentationml/2006/main'
A_NS = 'http://schemas.openxmlformats.org/drawingml/2006/main'
R_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships'
CT_NS = 'http://schemas.openxmlformats.org/package/2006/content-types'


def scale_emu(value):
    return int(round(value * SCALE))


def scale_xml(xml_bytes):
    """Scale positions, sizes, fonts, tables, margins in an XML element."""
    root = etree.fromstring(xml_bytes)

    for xfrm in root.iter(f'{{{A_NS}}}xfrm'):
        off = xfrm.find(f'{{{A_NS}}}off')
        if off is not None:
            for attr in ('x', 'y'):
                val = off.get(attr)
                if val is not None:
                    off.set(attr, str(scale_emu(int(val))))
        ext = xfrm.find(f'{{{A_NS}}}ext')
        if ext is not None:
            for attr in ('cx', 'cy'):
                val = ext.get(attr)
                if val is not None:
                    ext.set(attr, str(scale_emu(int(val))))

    for tag in ('rPr', 'defRPr', 'endParaRPr'):
        for elem in root.iter(f'{{{A_NS}}}{tag}'):
            sz = elem.get('sz')
            if sz is not None:
                elem.set('sz', str(int(round(int(sz) * SCALE))))

    for tr in root.iter(f'{{{A_NS}}}tr'):
        h = tr.get('h')
        if h is not None:
            tr.set('h', str(scale_emu(int(h))))

    for gridCol in root.iter(f'{{{A_NS}}}gridCol'):
        w = gridCol.get('w')
        if w is not None:
            gridCol.set('w', str(scale_emu(int(w))))

    for pPr in root.iter(f'{{{A_NS}}}pPr'):
        for attr in ('marL', 'marR', 'indent', 'defTabSz'):
            val = pPr.get(attr)
            if val is not None:
                pPr.set(attr, str(scale_emu(int(val))))

    for bodyPr in root.iter(f'{{{A_NS}}}bodyPr'):
        for attr in ('lIns', 'tIns', 'rIns', 'bIns'):
            val = bodyPr.get(attr)
            if val is not None:
                bodyPr.set(attr, str(scale_emu(int(val))))

    for ln in root.iter(f'{{{A_NS}}}ln'):
        w = ln.get('w')
        if w is not None:
            ln.set('w', str(scale_emu(int(w))))

    for tab in root.iter(f'{{{A_NS}}}tab'):
        pos = tab.get('pos')
        if pos is not None:
            tab.set('pos', str(scale_emu(int(pos))))

    return etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)


def make_rels_xml(rels_list):
    """Create a .rels XML from a list of (rId, type, target) tuples."""
    root = etree.Element(f'{{{REL_NS}}}Relationships')
    root.set('xmlns', REL_NS)
    for rid, reltype, target in rels_list:
        el = etree.SubElement(root, 'Relationship')
        el.set('Id', rid)
        el.set('Type', reltype)
        el.set('Target', target)
    return etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)


def main():
    print(f"Source: {SCORESHEET_PATH}")
    print(f"Base:   {DATA_INFRA_PATH}")
    print(f"Output: {OUTPUT_PATH}")

    # --- Read both ZIPs ---
    src_zip = zipfile.ZipFile(SCORESHEET_PATH, 'r')
    dst_zip = zipfile.ZipFile(DATA_INFRA_PATH, 'r')

    # Collect all files for the output
    output_files = {}  # path -> bytes

    # --- Step 1: Copy ALL files from data infra (base) ---
    for name in dst_zip.namelist():
        output_files[name] = dst_zip.read(name)

    # --- Step 2: Copy scoresheet's slide master, layout, theme ---
    # Scoresheet has: slideMaster1, slideLayout1, theme1
    # Data infra has: slideMaster1, slideLayout1-4, theme1-2
    # We'll add as: slideMaster2, slideLayout5, theme3

    # Copy and scale slideMaster1 -> slideMaster2
    src_master = src_zip.read('ppt/slideMasters/slideMaster1.xml')
    src_master_scaled = scale_xml(src_master)
    output_files['ppt/slideMasters/slideMaster2.xml'] = src_master_scaled

    # slideMaster2 rels: point to slideLayout5 and theme3
    output_files['ppt/slideMasters/_rels/slideMaster2.xml.rels'] = make_rels_xml([
        ('rId1', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout',
         '../slideLayouts/slideLayout5.xml'),
        ('rId2', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme',
         '../theme/theme3.xml'),
    ])

    # Copy and scale slideLayout1 -> slideLayout5
    src_layout = src_zip.read('ppt/slideLayouts/slideLayout1.xml')
    src_layout_scaled = scale_xml(src_layout)
    output_files['ppt/slideLayouts/slideLayout5.xml'] = src_layout_scaled

    # slideLayout5 rels: point to slideMaster2
    output_files['ppt/slideLayouts/_rels/slideLayout5.xml.rels'] = make_rels_xml([
        ('rId1', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster',
         '../slideMasters/slideMaster2.xml'),
    ])

    # Copy theme1 -> theme3
    output_files['ppt/theme/theme3.xml'] = src_zip.read('ppt/theme/theme1.xml')

    # --- Step 3: Copy scoresheet's slides (13 slides) ---
    # Data infra has slides 1-6, we'll add scoresheet as slides 7-19
    # Then reorder in presentation.xml

    SRC_SLIDE_COUNT = 13
    DST_SLIDE_COUNT = 6
    SLIDE_OFFSET = DST_SLIDE_COUNT  # scoresheet slide N -> slide (N + OFFSET)

    for src_idx in range(1, SRC_SLIDE_COUNT + 1):
        dst_idx = src_idx + SLIDE_OFFSET
        print(f"  Copying slide {src_idx} -> slide{dst_idx}")

        # Read and scale slide XML
        slide_xml = src_zip.read(f'ppt/slides/slide{src_idx}.xml')
        slide_xml_scaled = scale_xml(slide_xml)
        output_files[f'ppt/slides/slide{dst_idx}.xml'] = slide_xml_scaled

        # Read slide rels and remap
        src_rels_xml = src_zip.read(f'ppt/slides/_rels/slide{src_idx}.xml.rels')
        src_rels = etree.fromstring(src_rels_xml)

        new_rels = []
        for rel in src_rels.findall(f'{{{REL_NS}}}Relationship'):
            rid = rel.get('Id')
            reltype = rel.get('Type')
            target = rel.get('Target')

            if 'slideLayout' in reltype:
                # Point to our copied layout (slideLayout5)
                new_rels.append((rid, reltype, '../slideLayouts/slideLayout5.xml'))
            elif 'notesSlide' in reltype:
                # Skip notes
                continue
            elif 'image' in reltype:
                # Remap image target: ../media/image-1-1.png -> ../media/src-image-1-1.png
                img_filename = target.split('/')[-1]
                new_target = f'../media/src-{img_filename}'
                new_rels.append((rid, reltype, new_target))
            else:
                new_rels.append((rid, reltype, target))

        output_files[f'ppt/slides/_rels/slide{dst_idx}.xml.rels'] = make_rels_xml(new_rels)

    # --- Step 4: Copy scoresheet's media files ---
    for name in src_zip.namelist():
        if name.startswith('ppt/media/'):
            filename = name.split('/')[-1]
            if filename:
                output_files[f'ppt/media/src-{filename}'] = src_zip.read(name)
                print(f"  Copying media: {filename} -> src-{filename}")

    # --- Step 5: Update presentation.xml ---
    pres_xml = etree.fromstring(output_files['ppt/presentation.xml'])

    # Add slideMaster2 to sldMasterIdLst
    master_list = pres_xml.find(f'{{{P_NS}}}sldMasterIdLst')
    new_master = etree.SubElement(master_list, f'{{{P_NS}}}sldMasterId')
    new_master.set('id', '2147483649')
    new_master.set(f'{{{R_NS}}}id', 'rId30')

    # Rebuild sldIdLst with scoresheet slides first
    sld_list = pres_xml.find(f'{{{P_NS}}}sldIdLst')
    existing_slds = list(sld_list)

    # Clear existing
    for child in existing_slds:
        sld_list.remove(child)

    # Add scoresheet slides first (slide7 through slide19)
    base_id = 300
    for i in range(SRC_SLIDE_COUNT):
        dst_idx = i + 1 + SLIDE_OFFSET
        rid = f'rId{40 + i}'
        sld = etree.SubElement(sld_list, f'{{{P_NS}}}sldId')
        sld.set('id', str(base_id + i))
        sld.set(f'{{{R_NS}}}id', rid)

    # Then existing data infra slides
    for child in existing_slds:
        sld_list.append(child)

    output_files['ppt/presentation.xml'] = etree.tostring(
        pres_xml, xml_declaration=True, encoding='UTF-8', standalone=True
    )

    # --- Step 6: Update presentation.xml.rels ---
    pres_rels_xml = etree.fromstring(output_files['ppt/_rels/presentation.xml.rels'])

    # Add relationship for slideMaster2
    rel_el = etree.SubElement(pres_rels_xml, 'Relationship')
    rel_el.set('Id', 'rId30')
    rel_el.set('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster')
    rel_el.set('Target', 'slideMasters/slideMaster2.xml')

    # Add relationships for scoresheet slides
    for i in range(SRC_SLIDE_COUNT):
        dst_idx = i + 1 + SLIDE_OFFSET
        rid = f'rId{40 + i}'
        rel_el = etree.SubElement(pres_rels_xml, 'Relationship')
        rel_el.set('Id', rid)
        rel_el.set('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide')
        rel_el.set('Target', f'slides/slide{dst_idx}.xml')

    output_files['ppt/_rels/presentation.xml.rels'] = etree.tostring(
        pres_rels_xml, xml_declaration=True, encoding='UTF-8', standalone=True
    )

    # --- Step 7: Update [Content_Types].xml ---
    ct_xml = etree.fromstring(output_files['[Content_Types].xml'])

    # Add content types for new slides
    for i in range(SRC_SLIDE_COUNT):
        dst_idx = i + 1 + SLIDE_OFFSET
        override = etree.SubElement(ct_xml, f'{{{CT_NS}}}Override')
        override.set('PartName', f'/ppt/slides/slide{dst_idx}.xml')
        override.set('ContentType', 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml')

    # Add content type for slideMaster2
    override = etree.SubElement(ct_xml, f'{{{CT_NS}}}Override')
    override.set('PartName', '/ppt/slideMasters/slideMaster2.xml')
    override.set('ContentType', 'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml')

    # Add content type for slideLayout5
    override = etree.SubElement(ct_xml, f'{{{CT_NS}}}Override')
    override.set('PartName', '/ppt/slideLayouts/slideLayout5.xml')
    override.set('ContentType', 'application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml')

    # Add content type for theme3
    override = etree.SubElement(ct_xml, f'{{{CT_NS}}}Override')
    override.set('PartName', '/ppt/theme/theme3.xml')
    override.set('ContentType', 'application/vnd.openxmlformats-officedocument.drawingml.theme+xml')

    # Ensure PNG extension is in defaults
    has_png = False
    for default in ct_xml.findall(f'{{{CT_NS}}}Default'):
        if default.get('Extension') == 'png':
            has_png = True
    if not has_png:
        default_el = etree.SubElement(ct_xml, f'{{{CT_NS}}}Default')
        default_el.set('Extension', 'png')
        default_el.set('ContentType', 'image/png')

    output_files['[Content_Types].xml'] = etree.tostring(
        ct_xml, xml_declaration=True, encoding='UTF-8', standalone=True
    )

    # --- Step 8: Write output ZIP ---
    print(f"\nWriting {len(output_files)} files to output...")
    with zipfile.ZipFile(OUTPUT_PATH, 'w', zipfile.ZIP_DEFLATED) as out_zip:
        for path, data in sorted(output_files.items()):
            out_zip.writestr(path, data)

    src_zip.close()
    dst_zip.close()

    total_slides = SRC_SLIDE_COUNT + DST_SLIDE_COUNT
    print(f"\nDone! Total slides: {total_slides}")
    print(f"  1-{SRC_SLIDE_COUNT}: ScoreSheet DX (scaled x{SCALE:.4f})")
    print(f"  {SRC_SLIDE_COUNT+1}-{total_slides}: Data Infra Merit (original)")
    print(f"Output: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
