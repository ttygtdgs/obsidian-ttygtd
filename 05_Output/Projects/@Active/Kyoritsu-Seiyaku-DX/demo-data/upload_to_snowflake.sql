-- ============================================================
-- 共立製薬 スコアシート デモデータ Snowflake セットアップ
-- ============================================================
--
-- 手順:
--   1. python generate_demo_data.py    ← CSVを生成
--   2. このSQLをSnowflakeで実行         ← テーブル作成 → データロード
--
-- 方法A: Snowflake Web UI からアップロード
-- 方法B: SnowSQL CLI からアップロード
-- 方法C: Python snowflake-connector からアップロード
-- ============================================================

-- ============================================================
-- 1. スキーマ・テーブル作成
-- ============================================================

CREATE DATABASE IF NOT EXISTS KYORITSU_DEMO;
USE DATABASE KYORITSU_DEMO;
CREATE SCHEMA IF NOT EXISTS SCORE_SHEET;
USE SCHEMA SCORE_SHEET;

-- 試験マスター
CREATE OR REPLACE TABLE STUDY (
    study_id                VARCHAR(36)     NOT NULL,
    study_name              VARCHAR(200)    NOT NULL,
    study_description       TEXT,
    study_period_start      DATE            NOT NULL,
    study_period_end        DATE,
    administered_substance  VARCHAR(500),
    expected_symptoms       TEXT,
    created_at              TIMESTAMP_NTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    updated_at              TIMESTAMP_NTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    CONSTRAINT pk_study PRIMARY KEY (study_id)
);

-- スコアシート（試験 × 個体）
CREATE OR REPLACE TABLE SCORE_SHEET (
    score_sheet_id          VARCHAR(36)     NOT NULL,
    study_id                VARCHAR(36)     NOT NULL,
    animal_id               VARCHAR(50)     NOT NULL,
    administered_substance  VARCHAR(500),
    expected_symptoms       TEXT,
    laboratory_name         VARCHAR(200),
    created_at              TIMESTAMP_NTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    updated_at              TIMESTAMP_NTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    CONSTRAINT pk_score_sheet PRIMARY KEY (score_sheet_id),
    CONSTRAINT fk_score_sheet_study FOREIGN KEY (study_id) REFERENCES STUDY(study_id),
    CONSTRAINT uq_study_animal UNIQUE (study_id, animal_id)
);

-- 観察記録
CREATE OR REPLACE TABLE OBSERVATION (
    observation_id          VARCHAR(36)     NOT NULL,
    score_sheet_id          VARCHAR(36)     NOT NULL,
    observed_at             TIMESTAMP_NTZ   NOT NULL,
    observer_name           VARCHAR(100)    NOT NULL,
    rectal_temperature      DECIMAL(4,1),
    body_weight             DECIMAL(5,2),
    appetite                SMALLINT,
    energy                  SMALLINT,
    dehydration             SMALLINT,
    vomiting                SMALLINT,
    feces                   SMALLINT,
    nasal_discharge_l       SMALLINT,
    nasal_discharge_r       SMALLINT,
    lacrimation_l           SMALLINT,
    lacrimation_r           SMALLINT,
    eye_discharge_l         SMALLINT,
    eye_discharge_r         SMALLINT,
    conjunctivitis_l        SMALLINT,
    conjunctivitis_r        SMALLINT,
    coughing                SMALLINT,
    sneezing                SMALLINT,
    respiratory_abnormal    SMALLINT,
    remarks                 TEXT,
    created_at              TIMESTAMP_NTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    created_by              VARCHAR(100)    NOT NULL,
    CONSTRAINT pk_observation PRIMARY KEY (observation_id),
    CONSTRAINT fk_observation_sheet FOREIGN KEY (score_sheet_id) REFERENCES SCORE_SHEET(score_sheet_id),
    CONSTRAINT uq_sheet_observed UNIQUE (score_sheet_id, observed_at)
);


-- ============================================================
-- 2. CSVファイルのアップロード
-- ============================================================

-- ファイルフォーマット定義
CREATE OR REPLACE FILE FORMAT CSV_UTF8
    TYPE = 'CSV'
    FIELD_DELIMITER = ','
    SKIP_HEADER = 1
    FIELD_OPTIONALLY_ENCLOSED_BY = '"'
    NULL_IF = ('', 'NULL')
    ENCODING = 'UTF8';

-- 内部ステージ作成
CREATE OR REPLACE STAGE DEMO_STAGE
    FILE_FORMAT = CSV_UTF8;

-- ------------------------------------------------------------
-- 方法A: SnowSQL CLI からアップロードする場合
-- ------------------------------------------------------------
-- SnowSQL で以下を実行:
--
--   PUT file:///path/to/csv/study.csv @DEMO_STAGE/study/;
--   PUT file:///path/to/csv/score_sheet.csv @DEMO_STAGE/score_sheet/;
--   PUT file:///path/to/csv/observation.csv @DEMO_STAGE/observation/;

-- ------------------------------------------------------------
-- 方法B: Snowflake Web UI からアップロードする場合
-- ------------------------------------------------------------
-- 1. Snowsight (Web UI) を開く
-- 2. Database > KYORITSU_DEMO > SCORE_SHEET > Stages > DEMO_STAGE
-- 3. 「+ Files」ボタンで各CSVをアップロード
--    - study/ フォルダに study.csv
--    - score_sheet/ フォルダに score_sheet.csv
--    - observation/ フォルダに observation.csv


-- ============================================================
-- 3. ステージからテーブルへロード
-- ============================================================

COPY INTO STUDY
FROM @DEMO_STAGE/study/
FILE_FORMAT = CSV_UTF8
ON_ERROR = 'ABORT_STATEMENT';

COPY INTO SCORE_SHEET
FROM @DEMO_STAGE/score_sheet/
FILE_FORMAT = CSV_UTF8
ON_ERROR = 'ABORT_STATEMENT';

COPY INTO OBSERVATION
FROM @DEMO_STAGE/observation/
FILE_FORMAT = CSV_UTF8
ON_ERROR = 'ABORT_STATEMENT';


-- ============================================================
-- 4. 分析ビュー作成
-- ============================================================

CREATE OR REPLACE VIEW V_OBSERVATION_DETAIL AS
SELECT
    s.study_id,
    s.study_name,
    s.study_period_start,
    s.study_period_end,
    ss.score_sheet_id,
    ss.animal_id,
    ss.administered_substance,
    ss.laboratory_name,
    -- 投与群フラグ
    CASE
        WHEN ss.administered_substance LIKE '%プラセボ%' THEN '対照群'
        ELSE '投与群'
    END AS group_type,
    o.observation_id,
    o.observed_at,
    DATE(o.observed_at) AS observation_date,
    DATEDIFF('day', s.study_period_start, DATE(o.observed_at)) AS day_number,
    o.observer_name,
    o.rectal_temperature,
    o.body_weight,
    o.appetite,
    o.energy,
    o.dehydration,
    o.vomiting,
    o.feces,
    o.nasal_discharge_l,
    o.nasal_discharge_r,
    o.lacrimation_l,
    o.lacrimation_r,
    o.eye_discharge_l,
    o.eye_discharge_r,
    o.conjunctivitis_l,
    o.conjunctivitis_r,
    o.coughing,
    o.sneezing,
    o.respiratory_abnormal,
    -- 左右最大値（分析用）
    GREATEST(COALESCE(o.nasal_discharge_l, 0), COALESCE(o.nasal_discharge_r, 0)) AS nasal_discharge_max,
    GREATEST(COALESCE(o.lacrimation_l, 0), COALESCE(o.lacrimation_r, 0))         AS lacrimation_max,
    GREATEST(COALESCE(o.eye_discharge_l, 0), COALESCE(o.eye_discharge_r, 0))     AS eye_discharge_max,
    GREATEST(COALESCE(o.conjunctivitis_l, 0), COALESCE(o.conjunctivitis_r, 0))   AS conjunctivitis_max,
    -- 臨床スコア合計
    COALESCE(o.appetite, 0)
    + COALESCE(o.energy, 0)
    + COALESCE(o.dehydration, 0)
    + COALESCE(o.vomiting, 0)
    + COALESCE(o.feces, 0)
    + GREATEST(COALESCE(o.nasal_discharge_l, 0), COALESCE(o.nasal_discharge_r, 0))
    + GREATEST(COALESCE(o.lacrimation_l, 0), COALESCE(o.lacrimation_r, 0))
    + GREATEST(COALESCE(o.eye_discharge_l, 0), COALESCE(o.eye_discharge_r, 0))
    + GREATEST(COALESCE(o.conjunctivitis_l, 0), COALESCE(o.conjunctivitis_r, 0))
    + COALESCE(o.coughing, 0)
    + COALESCE(o.sneezing, 0)
    + COALESCE(o.respiratory_abnormal, 0) AS total_clinical_score
FROM STUDY s
JOIN SCORE_SHEET ss ON s.study_id = ss.study_id
JOIN OBSERVATION o  ON ss.score_sheet_id = o.score_sheet_id;


-- ============================================================
-- 5. デモ用分析クエリ（動作確認）
-- ============================================================

-- ----- データ件数確認 -----
SELECT 'study' AS table_name, COUNT(*) AS row_count FROM STUDY
UNION ALL
SELECT 'score_sheet', COUNT(*) FROM SCORE_SHEET
UNION ALL
SELECT 'observation', COUNT(*) FROM OBSERVATION;

-- ----- デモクエリ1: ロット間の平均体温比較 -----
SELECT
    study_name,
    group_type,
    day_number,
    ROUND(AVG(rectal_temperature), 1) AS avg_temp,
    COUNT(*) AS n
FROM V_OBSERVATION_DETAIL
WHERE day_number BETWEEN 0 AND 13
GROUP BY study_name, group_type, day_number
ORDER BY study_name, group_type, day_number;

-- ----- デモクエリ2: 投与群 vs 対照群の臨床スコア推移 -----
SELECT
    study_name,
    group_type,
    day_number,
    ROUND(AVG(total_clinical_score), 1) AS avg_clinical_score,
    MAX(total_clinical_score) AS max_clinical_score
FROM V_OBSERVATION_DETAIL
GROUP BY study_name, group_type, day_number
ORDER BY study_name, group_type, day_number;

-- ----- デモクエリ3: 特定個体の時系列データ -----
SELECT
    animal_id,
    day_number,
    rectal_temperature,
    body_weight,
    appetite,
    energy,
    nasal_discharge_max,
    total_clinical_score
FROM V_OBSERVATION_DETAIL
WHERE animal_id = 'D-006'  -- 対照群の1個体
ORDER BY day_number;

-- ----- デモクエリ4: 鼻汁を示した個体の検索 -----
SELECT DISTINCT
    study_name,
    animal_id,
    group_type,
    MIN(day_number) AS first_nasal_discharge_day
FROM V_OBSERVATION_DETAIL
WHERE nasal_discharge_max >= 1
GROUP BY study_name, animal_id, group_type
ORDER BY study_name, first_nasal_discharge_day;

-- ----- デモクエリ5: Golden Batch風 ロットプロファイル比較 -----
SELECT
    study_name,
    group_type,
    ROUND(AVG(rectal_temperature), 2)     AS avg_temp,
    ROUND(MAX(rectal_temperature), 1)     AS peak_temp,
    ROUND(AVG(total_clinical_score), 2)   AS avg_clinical_score,
    ROUND(MAX(total_clinical_score), 0)   AS max_clinical_score,
    ROUND(AVG(body_weight), 2)            AS avg_weight,
    SUM(CASE WHEN nasal_discharge_max >= 1 THEN 1 ELSE 0 END)
        / COUNT(*)::FLOAT                 AS nasal_discharge_rate,
    SUM(CASE WHEN vomiting >= 1 THEN 1 ELSE 0 END)
        / COUNT(*)::FLOAT                 AS vomiting_rate
FROM V_OBSERVATION_DETAIL
WHERE group_type = '投与群'
GROUP BY study_name, group_type
ORDER BY study_name;
