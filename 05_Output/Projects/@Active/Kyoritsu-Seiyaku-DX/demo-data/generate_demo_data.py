"""
共立製薬 スコアシート デモデータ生成スクリプト
=============================================
ワクチン効力試験（チャレンジ試験）のリアルなデモデータを生成し、
CSVファイルとして出力する。

使い方:
  python generate_demo_data.py

出力:
  ./csv/study.csv
  ./csv/score_sheet.csv
  ./csv/observation.csv
  ./csv/audit_log.csv
"""

import csv
import uuid
import random
import os
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)

OUTPUT_DIR = Path(__file__).parent / "csv"
OUTPUT_DIR.mkdir(exist_ok=True)


# ============================================================
# ヘルパー
# ============================================================

def uid():
    return str(uuid.uuid4())


def clamp(val, lo, hi):
    return max(lo, min(hi, val))


def maybe_none(val, prob=0.05):
    """一定確率でNoneを返す（欠損データの再現）"""
    return None if random.random() < prob else val


# ============================================================
# 臨床スコア生成ロジック
# ============================================================

class AnimalSimulator:
    """1個体のチャレンジ試験における臨床経過をシミュレート"""

    def __init__(self, is_vaccinated: bool, species: str):
        self.is_vaccinated = is_vaccinated
        self.species = species  # "dog" or "cat"

        # 個体差パラメータ
        self.base_temp = random.gauss(38.5, 0.2) if species == "dog" else random.gauss(38.6, 0.2)
        self.base_weight = random.gauss(10.0, 1.5) if species == "dog" else random.gauss(4.0, 0.5)

        # ワクチン接種群は症状が軽く、対照群は重い
        if is_vaccinated:
            self.severity_factor = random.uniform(0.1, 0.4)
            self.peak_day = random.randint(4, 6)
            self.recovery_speed = random.uniform(0.3, 0.5)
        else:
            self.severity_factor = random.uniform(0.6, 1.0)
            self.peak_day = random.randint(5, 8)
            self.recovery_speed = random.uniform(0.1, 0.25)

    def _severity_curve(self, day: int) -> float:
        """日ごとの重症度カーブ（0〜1）"""
        if day <= 1:
            return 0.0
        # ガウシアンカーブ: ピーク日に最大
        import math
        x = (day - self.peak_day) / 2.5
        curve = math.exp(-0.5 * x * x)
        # 回復フェーズ: ピーク後は徐々に下がる
        if day > self.peak_day:
            recovery = 1.0 - self.recovery_speed * (day - self.peak_day) / 5
            curve *= max(0, recovery)
        return curve * self.severity_factor

    def observe(self, day: int) -> dict:
        sev = self._severity_curve(day)

        # 直腸温: 重症度に応じて上昇
        temp = self.base_temp + sev * random.gauss(2.0, 0.3)
        temp = round(clamp(temp + random.gauss(0, 0.1), 36.0, 41.5), 1)

        # 体重: 重症度に応じて減少
        weight_loss = sev * random.gauss(0.08, 0.02)  # 最大8%減
        weight = round(self.base_weight * (1 - weight_loss) + random.gauss(0, 0.05), 2)
        weight = max(0.5, weight)

        # 各臨床スコア
        def score(max_val, threshold=0.2, noise=0.15):
            if sev < threshold * random.uniform(0.5, 1.5):
                return 0
            raw = sev * max_val * random.uniform(0.5, 1.3) + random.gauss(0, noise)
            return clamp(round(raw), 0, max_val)

        # 先行指標（体温と連動）
        appetite = score(3, threshold=0.15)
        energy = score(3, threshold=0.25)
        dehydration = score(3, threshold=0.35)

        # 消化器症状
        vomiting = score(1, threshold=0.4)
        feces = score(4, threshold=0.3)

        # 呼吸器・眼症状（やや遅延して出現）
        delayed_sev = self._severity_curve(day - 1) if day > 1 else 0
        nasal_l = score(5, threshold=0.3) if delayed_sev > 0.2 else 0
        nasal_r = nasal_l if random.random() < 0.7 else score(5, threshold=0.3)  # 左右は多くの場合同じ

        lacrimation_l = score(2, threshold=0.3) if delayed_sev > 0.25 else 0
        lacrimation_r = lacrimation_l if random.random() < 0.8 else score(2, threshold=0.3)

        eye_discharge_l = score(2, threshold=0.4) if delayed_sev > 0.3 else 0
        eye_discharge_r = eye_discharge_l if random.random() < 0.75 else score(2, threshold=0.4)

        conjunctivitis_l = score(3, threshold=0.3) if delayed_sev > 0.25 else 0
        conjunctivitis_r = conjunctivitis_l if random.random() < 0.8 else score(3, threshold=0.3)

        # 咳・くしゃみ（さらに遅延）
        late_sev = self._severity_curve(day - 2) if day > 2 else 0
        coughing = score(2, threshold=0.35) if late_sev > 0.25 else 0
        sneezing = score(2, threshold=0.3) if late_sev > 0.2 else 0

        # 呼吸音異常（最も遅延）
        very_late_sev = self._severity_curve(day - 3) if day > 3 else 0
        respiratory = 1 if very_late_sev > 0.6 and random.random() < 0.4 else 0

        return {
            "rectal_temperature": temp,
            "body_weight": weight,
            "appetite": appetite,
            "energy": energy,
            "dehydration": dehydration,
            "vomiting": vomiting,
            "feces": feces,
            "nasal_discharge_l": nasal_l,
            "nasal_discharge_r": nasal_r,
            "lacrimation_l": lacrimation_l,
            "lacrimation_r": lacrimation_r,
            "eye_discharge_l": eye_discharge_l,
            "eye_discharge_r": eye_discharge_r,
            "conjunctivitis_l": conjunctivitis_l,
            "conjunctivitis_r": conjunctivitis_r,
            "coughing": coughing,
            "sneezing": sneezing,
            "respiratory_abnormal": respiratory,
        }


# ============================================================
# デモデータ定義
# ============================================================

OBSERVERS = ["田中", "鈴木", "佐藤", "山本", "犬山"]

STUDIES = [
    {
        "study_name": "犬5種混合ワクチン効力試験 2025-A",
        "study_description": "犬5種混合ワクチン（CDV, CAV-2, CPiV, CPV, CCoV）のチャレンジ試験。Lot.2025-A3の効力評価。",
        "study_period_start": "2025-09-01",
        "study_period_end": "2025-09-14",
        "administered_substance": "犬5種混合ワクチン Lot.2025-A3",
        "expected_symptoms": "発熱、食欲低下、鼻汁、流涙、くしゃみ、下痢",
        "species": "dog",
        "animals": [
            {"animal_id": "D-001", "substance": "犬5種混合ワクチン Lot.2025-A3", "vaccinated": True},
            {"animal_id": "D-002", "substance": "犬5種混合ワクチン Lot.2025-A3", "vaccinated": True},
            {"animal_id": "D-003", "substance": "犬5種混合ワクチン Lot.2025-A3", "vaccinated": True},
            {"animal_id": "D-004", "substance": "犬5種混合ワクチン Lot.2025-A3", "vaccinated": True},
            {"animal_id": "D-005", "substance": "犬5種混合ワクチン Lot.2025-A3", "vaccinated": True},
            {"animal_id": "D-006", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
            {"animal_id": "D-007", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
            {"animal_id": "D-008", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
            {"animal_id": "D-009", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
            {"animal_id": "D-010", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
        ],
        "laboratory": "第1実験棟 A室",
        "days": 14,
    },
    {
        "study_name": "犬5種混合ワクチン効力試験 2025-B",
        "study_description": "犬5種混合ワクチン Lot.2025-B1との比較試験。Lot.2025-A3と同一プロトコルで実施。",
        "study_period_start": "2025-10-01",
        "study_period_end": "2025-10-14",
        "administered_substance": "犬5種混合ワクチン Lot.2025-B1",
        "expected_symptoms": "発熱、食欲低下、鼻汁、流涙、くしゃみ、下痢",
        "species": "dog",
        "animals": [
            {"animal_id": "D-101", "substance": "犬5種混合ワクチン Lot.2025-B1", "vaccinated": True},
            {"animal_id": "D-102", "substance": "犬5種混合ワクチン Lot.2025-B1", "vaccinated": True},
            {"animal_id": "D-103", "substance": "犬5種混合ワクチン Lot.2025-B1", "vaccinated": True},
            {"animal_id": "D-104", "substance": "犬5種混合ワクチン Lot.2025-B1", "vaccinated": True},
            {"animal_id": "D-105", "substance": "犬5種混合ワクチン Lot.2025-B1", "vaccinated": True},
            {"animal_id": "D-106", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
            {"animal_id": "D-107", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
            {"animal_id": "D-108", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
            {"animal_id": "D-109", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
            {"animal_id": "D-110", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
        ],
        "laboratory": "第1実験棟 A室",
        "days": 14,
    },
    {
        "study_name": "猫3種混合ワクチン効力試験 2025-C",
        "study_description": "猫3種混合ワクチン（FPV, FCV, FHV-1）のチャレンジ試験。新ロットの効力評価。",
        "study_period_start": "2025-11-01",
        "study_period_end": "2025-11-14",
        "administered_substance": "猫3種混合ワクチン Lot.2025-C1",
        "expected_symptoms": "発熱、食欲低下、鼻汁、流涙、結膜炎、くしゃみ",
        "species": "cat",
        "animals": [
            {"animal_id": "C-001", "substance": "猫3種混合ワクチン Lot.2025-C1", "vaccinated": True},
            {"animal_id": "C-002", "substance": "猫3種混合ワクチン Lot.2025-C1", "vaccinated": True},
            {"animal_id": "C-003", "substance": "猫3種混合ワクチン Lot.2025-C1", "vaccinated": True},
            {"animal_id": "C-004", "substance": "猫3種混合ワクチン Lot.2025-C1", "vaccinated": True},
            {"animal_id": "C-005", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
            {"animal_id": "C-006", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
            {"animal_id": "C-007", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
            {"animal_id": "C-008", "substance": "プラセボ（生理食塩水）", "vaccinated": False},
        ],
        "laboratory": "第2実験棟 B室",
        "days": 14,
    },
]


# ============================================================
# データ生成
# ============================================================

def generate():
    studies = []
    score_sheets = []
    observations = []

    for study_def in STUDIES:
        study_id = uid()

        studies.append({
            "study_id": study_id,
            "study_name": study_def["study_name"],
            "study_description": study_def["study_description"],
            "study_period_start": study_def["study_period_start"],
            "study_period_end": study_def["study_period_end"],
            "administered_substance": study_def["administered_substance"],
            "expected_symptoms": study_def["expected_symptoms"],
            "created_at": "2025-08-15 09:00:00",
            "updated_at": "2025-08-15 09:00:00",
        })

        start_date = datetime.strptime(study_def["study_period_start"], "%Y-%m-%d")

        for animal_def in study_def["animals"]:
            ss_id = uid()
            score_sheets.append({
                "score_sheet_id": ss_id,
                "study_id": study_id,
                "animal_id": animal_def["animal_id"],
                "administered_substance": animal_def["substance"],
                "expected_symptoms": study_def["expected_symptoms"],
                "laboratory_name": study_def["laboratory"],
                "created_at": "2025-08-15 09:00:00",
                "updated_at": "2025-08-15 09:00:00",
            })

            sim = AnimalSimulator(
                is_vaccinated=animal_def["vaccinated"],
                species=study_def["species"],
            )

            for day in range(study_def["days"]):
                obs_date = start_date + timedelta(days=day)
                # 観察時間: 9:00〜10:00の間でランダム
                obs_time = f"{random.randint(9, 10)}:{random.choice(['00', '15', '30', '45'])}"
                observed_at = f"{obs_date.strftime('%Y-%m-%d')} {obs_time}:00"

                scores = sim.observe(day)
                observer = random.choice(OBSERVERS)

                # 異常スコア合計を計算して画像パス判定
                clinical_items_for_total = [
                    "appetite", "energy", "dehydration", "vomiting", "feces",
                    "coughing", "sneezing", "respiratory_abnormal",
                ]
                lr_items = ["nasal_discharge", "lacrimation", "eye_discharge", "conjunctivitis"]
                total_score = sum(scores.get(c, 0) for c in clinical_items_for_total)
                for lr in lr_items:
                    total_score += max(scores.get(f"{lr}_l", 0), scores.get(f"{lr}_r", 0))

                # image_path: 高スコア時に主要症状の画像パスを設定
                image_path = ""
                if total_score >= 3:
                    # 最も高いスコアの症状を特定
                    symptom_scores = {}
                    for c in ["vomiting", "coughing", "respiratory_abnormal", "dehydration"]:
                        if scores.get(c, 0) >= 1:
                            symptom_scores[c] = scores[c]
                    for lr in lr_items:
                        val = max(scores.get(f"{lr}_l", 0), scores.get(f"{lr}_r", 0))
                        if val >= 2:
                            symptom_scores[lr] = val
                    if symptom_scores:
                        top_symptom = max(symptom_scores, key=symptom_scores.get)
                        image_path = f"images/{animal_def['animal_id']}_day{day:02d}_{top_symptom}.png"

                obs = {
                    "observation_id": uid(),
                    "score_sheet_id": ss_id,
                    "observed_at": observed_at,
                    "observer_name": observer,
                    **scores,
                    "remarks": "",
                    "image_path": image_path,
                    "created_at": observed_at,
                    "created_by": observer,
                }
                observations.append(obs)

    return studies, score_sheets, observations


def generate_audit_log(observations):
    """観察レコードからデモ用監査ログを生成する"""
    audit_logs = []

    # 全観察レコードのINSERT
    for obs in observations:
        audit_logs.append({
            "log_id": uid(),
            "timestamp": obs["created_at"],
            "user_name": obs["created_by"],
            "operation": "INSERT",
            "table_name": "観察記録",
            "record_id": obs["observation_id"],
            "field_name": "",
            "old_value": "",
            "new_value": "",
            "reason": "初回登録",
        })

    # 一部レコードのUPDATE（5〜10件）
    update_candidates = [o for o in observations if o["rectal_temperature"] >= 39.0]
    random.shuffle(update_candidates)
    update_targets = update_candidates[:8]

    update_reasons = [
        "記入ミス修正",
        "再計測による修正",
        "転記ミス修正",
        "確認者による修正",
        "小数点以下の記録漏れ修正",
    ]

    for obs in update_targets:
        obs_dt = datetime.strptime(obs["created_at"][:19], "%Y-%m-%d %H:%M:%S")
        update_dt = obs_dt + timedelta(hours=random.randint(1, 4), minutes=random.randint(0, 59))

        updater = random.choice(OBSERVERS)
        reason = random.choice(update_reasons)

        # 体温修正
        old_temp = obs["rectal_temperature"]
        new_temp = round(old_temp + random.choice([-0.3, -0.2, -0.1, 0.1, 0.2, 0.3]), 1)
        audit_logs.append({
            "log_id": uid(),
            "timestamp": update_dt.strftime("%Y-%m-%d %H:%M:%S"),
            "user_name": updater,
            "operation": "UPDATE",
            "table_name": "観察記録",
            "record_id": obs["observation_id"],
            "field_name": "直腸温",
            "old_value": str(old_temp),
            "new_value": str(new_temp),
            "reason": reason,
        })

    # スコア修正（2〜3件追加）
    score_candidates = [o for o in observations if o["appetite"] >= 1]
    random.shuffle(score_candidates)
    for obs in score_candidates[:3]:
        obs_dt = datetime.strptime(obs["created_at"][:19], "%Y-%m-%d %H:%M:%S")
        update_dt = obs_dt + timedelta(hours=random.randint(2, 6), minutes=random.randint(0, 59))

        old_val = obs["appetite"]
        new_val = max(0, old_val - 1)
        audit_logs.append({
            "log_id": uid(),
            "timestamp": update_dt.strftime("%Y-%m-%d %H:%M:%S"),
            "user_name": random.choice(OBSERVERS),
            "operation": "UPDATE",
            "table_name": "観察記録",
            "record_id": obs["observation_id"],
            "field_name": "食欲",
            "old_value": str(old_val),
            "new_value": str(new_val),
            "reason": random.choice(update_reasons),
        })

    # タイムスタンプでソート
    audit_logs.sort(key=lambda x: x["timestamp"])
    return audit_logs


def write_csv(filename, rows, fieldnames):
    path = OUTPUT_DIR / filename
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"  {path} ({len(rows)} rows)")


def main():
    print("デモデータ生成中...")
    studies, score_sheets, observations = generate()

    print(f"\n生成結果:")
    print(f"  試験数: {len(studies)}")
    print(f"  スコアシート数: {len(score_sheets)}")
    print(f"  観察記録数: {len(observations)}")

    print(f"\nCSV出力:")
    write_csv("study.csv", studies, [
        "study_id", "study_name", "study_description",
        "study_period_start", "study_period_end",
        "administered_substance", "expected_symptoms",
        "created_at", "updated_at",
    ])

    write_csv("score_sheet.csv", score_sheets, [
        "score_sheet_id", "study_id", "animal_id",
        "administered_substance", "expected_symptoms",
        "laboratory_name", "created_at", "updated_at",
    ])

    write_csv("observation.csv", observations, [
        "observation_id", "score_sheet_id", "observed_at", "observer_name",
        "rectal_temperature", "body_weight",
        "appetite", "energy", "dehydration", "vomiting", "feces",
        "nasal_discharge_l", "nasal_discharge_r",
        "lacrimation_l", "lacrimation_r",
        "eye_discharge_l", "eye_discharge_r",
        "conjunctivitis_l", "conjunctivitis_r",
        "coughing", "sneezing", "respiratory_abnormal",
        "remarks", "image_path", "created_at", "created_by",
    ])

    # 監査ログ生成
    print(f"\n監査ログ生成中...")
    audit_logs = generate_audit_log(observations)
    print(f"  監査ログ: {len(audit_logs)} 件（INSERT: {sum(1 for a in audit_logs if a['operation'] == 'INSERT')}, UPDATE: {sum(1 for a in audit_logs if a['operation'] == 'UPDATE')}）")

    write_csv("audit_log.csv", audit_logs, [
        "log_id", "timestamp", "user_name", "operation",
        "table_name", "record_id", "field_name",
        "old_value", "new_value", "reason",
    ])

    print(f"\n完了! CSVファイルは {OUTPUT_DIR} に出力されました。")
    print(f"次のステップ:")
    print(f"  1. python generate_demo_images.py  (プレースホルダー画像生成)")
    print(f"  2. streamlit run dashboard.py  (ダッシュボード起動)")
    print(f"  3. upload_to_snowflake.sql を Snowflake で実行")


if __name__ == "__main__":
    main()
