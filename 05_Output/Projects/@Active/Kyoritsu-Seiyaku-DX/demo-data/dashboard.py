"""
共立製薬 スコアシート分析ダッシュボード
========================================
デモ用Streamlitアプリ（CSVデータソース）

起動方法:
    cd demo-data
    streamlit run dashboard.py
"""

import pathlib
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import streamlit as st

# ---------------------------------------------------------------------------
# 設定
# ---------------------------------------------------------------------------
st.set_page_config(
    page_title="共立製薬 スコアシート分析",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded",
)

CSV_DIR = pathlib.Path(__file__).parent / "csv"

CLINICAL_ITEMS = [
    "appetite", "energy", "dehydration", "vomiting", "feces",
    "nasal_discharge_max", "lacrimation_max", "eye_discharge_max",
    "conjunctivitis_max", "coughing", "sneezing", "respiratory_abnormal",
]
CLINICAL_LABELS = {
    "appetite": "食欲",
    "energy": "元気",
    "dehydration": "脱水",
    "vomiting": "嘔吐",
    "feces": "糞便",
    "nasal_discharge_max": "鼻汁",
    "lacrimation_max": "流涙",
    "eye_discharge_max": "眼脂",
    "conjunctivitis_max": "結膜炎",
    "coughing": "咳",
    "sneezing": "くしゃみ",
    "respiratory_abnormal": "呼吸異常",
}

COLOR_TREATED = "#1f77b4"
COLOR_CONTROL = "#ff7f0e"

# ---------------------------------------------------------------------------
# データ読み込み & ビュー構築
# ---------------------------------------------------------------------------

@st.cache_data
def load_data():
    study = pd.read_csv(CSV_DIR / "study.csv")
    sheet = pd.read_csv(CSV_DIR / "score_sheet.csv")
    obs = pd.read_csv(CSV_DIR / "observation.csv")

    # JOIN: observation → score_sheet → study
    df = obs.merge(sheet, on="score_sheet_id", suffixes=("", "_sheet"))
    df = df.merge(study, on="study_id", suffixes=("", "_study"))

    # 投与群フラグ
    df["group_type"] = df["administered_substance"].apply(
        lambda x: "対照群" if "プラセボ" in str(x) else "投与群"
    )

    # 日付
    df["observed_at"] = pd.to_datetime(df["observed_at"])
    df["observation_date"] = df["observed_at"].dt.date
    df["study_period_start"] = pd.to_datetime(df["study_period_start"])
    df["day_number"] = (df["observed_at"].dt.normalize() - df["study_period_start"]).dt.days

    # 左右最大値
    for col in ["nasal_discharge", "lacrimation", "eye_discharge", "conjunctivitis"]:
        df[f"{col}_max"] = df[[f"{col}_l", f"{col}_r"]].max(axis=1)

    # 臨床スコア合計
    df["total_clinical_score"] = df[CLINICAL_ITEMS].sum(axis=1)

    return study, sheet, obs, df


study_df, sheet_df, obs_df, detail_df = load_data()

# ---------------------------------------------------------------------------
# サイドバー
# ---------------------------------------------------------------------------
PAGES = {
    "概要ダッシュボード": "overview",
    "体温推移グラフ": "temperature",
    "臨床スコア推移": "clinical_score",
    "ロット比較（Golden Batch）": "lot_comparison",
    "個体検索": "animal_search",
    "異常アラート": "alerts",
    "示唆・インサイト": "insights",
}

st.sidebar.title("スコアシート分析")
st.sidebar.markdown("---")
page = st.sidebar.radio("ページ選択", list(PAGES.keys()))
st.sidebar.markdown("---")
st.sidebar.caption("共立製薬 データ基盤デモ")

# ---------------------------------------------------------------------------
# Page 1: 概要ダッシュボード
# ---------------------------------------------------------------------------
def page_overview():
    st.title("概要ダッシュボード")

    # KPI カード
    col1, col2, col3 = st.columns(3)
    col1.metric("試験数", f"{study_df.shape[0]} 件")
    col2.metric("個体数", f"{sheet_df.shape[0]} 頭")
    col3.metric("観察記録数", f"{obs_df.shape[0]:,} 件")

    st.markdown("---")

    # 試験一覧テーブル
    st.subheader("試験一覧")
    summary = (
        detail_df.groupby(["study_name", "study_period_start", "study_period_end"])
        .agg(
            個体数=("animal_id", "nunique"),
            観察数=("observation_id", "count"),
            投与物質=("administered_substance_study", "first"),
        )
        .reset_index()
    )
    summary.columns = ["試験名", "開始日", "終了日", "個体数", "観察数", "投与物質"]
    st.dataframe(summary, use_container_width=True, hide_index=True)

    st.markdown("---")

    # 全試験の臨床スコアサマリー
    st.subheader("全試験 臨床スコア推移（平均）")
    avg_score = (
        detail_df.groupby(["study_name", "group_type", "day_number"])["total_clinical_score"]
        .mean()
        .reset_index()
    )
    fig = px.line(
        avg_score,
        x="day_number",
        y="total_clinical_score",
        color="group_type",
        facet_col="study_name",
        color_discrete_map={"投与群": COLOR_TREATED, "対照群": COLOR_CONTROL},
        labels={"day_number": "Day", "total_clinical_score": "臨床スコア平均"},
    )
    fig.update_layout(height=350, margin=dict(t=40))
    st.plotly_chart(fig, use_container_width=True)


# ---------------------------------------------------------------------------
# Page 2: 体温推移グラフ
# ---------------------------------------------------------------------------
def page_temperature():
    st.title("体温推移グラフ")

    studies = detail_df["study_name"].unique().tolist()
    selected = st.selectbox("試験を選択", studies)
    sdf = detail_df[detail_df["study_name"] == selected]

    fig = go.Figure()

    # 正常範囲バンド
    fig.add_hrect(y0=38.0, y1=39.0, fillcolor="green", opacity=0.08,
                  line_width=0, annotation_text="正常範囲", annotation_position="top left")

    # 個体別ライン（薄い線）
    for (aid, grp), gdf in sdf.groupby(["animal_id", "group_type"]):
        color = COLOR_TREATED if grp == "投与群" else COLOR_CONTROL
        fig.add_trace(go.Scatter(
            x=gdf["day_number"], y=gdf["rectal_temperature"],
            mode="lines", opacity=0.25, line=dict(color=color, width=1),
            name=aid, showlegend=False, hovertemplate=f"{aid}<br>Day%{{x}}: %{{y:.1f}}℃",
        ))

    # 群平均ライン
    avg = sdf.groupby(["group_type", "day_number"])["rectal_temperature"].mean().reset_index()
    for grp, gdf in avg.groupby("group_type"):
        color = COLOR_TREATED if grp == "投与群" else COLOR_CONTROL
        fig.add_trace(go.Scatter(
            x=gdf["day_number"], y=gdf["rectal_temperature"],
            mode="lines+markers", line=dict(color=color, width=3),
            name=f"{grp}（平均）",
        ))

    fig.update_layout(
        xaxis_title="Day", yaxis_title="直腸温 (℃)",
        height=500, legend=dict(orientation="h", y=-0.15),
    )
    st.plotly_chart(fig, use_container_width=True)

    # 統計テーブル
    st.subheader("群別 体温統計")
    stats = (
        sdf.groupby("group_type")["rectal_temperature"]
        .agg(["mean", "std", "min", "max"])
        .round(2)
        .reset_index()
    )
    stats.columns = ["群", "平均体温", "標準偏差", "最低体温", "最高体温"]
    st.dataframe(stats, use_container_width=True, hide_index=True)


# ---------------------------------------------------------------------------
# Page 3: 臨床スコア推移
# ---------------------------------------------------------------------------
def page_clinical_score():
    st.title("臨床スコア推移")

    studies = detail_df["study_name"].unique().tolist()
    selected = st.selectbox("試験を選択", studies, key="cs_study")
    sdf = detail_df[detail_df["study_name"] == selected]

    # 臨床スコア推移
    st.subheader("臨床スコア合計の推移")
    avg = sdf.groupby(["group_type", "day_number"])["total_clinical_score"].mean().reset_index()
    fig = px.line(
        avg, x="day_number", y="total_clinical_score", color="group_type",
        color_discrete_map={"投与群": COLOR_TREATED, "対照群": COLOR_CONTROL},
        labels={"day_number": "Day", "total_clinical_score": "臨床スコア平均"},
    )
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)

    # ヒートマップ
    st.subheader("臨床項目別ヒートマップ（投与群 vs 対照群）")
    col1, col2 = st.columns(2)

    for col_container, grp in [(col1, "投与群"), (col2, "対照群")]:
        gdf = sdf[sdf["group_type"] == grp]
        heat = gdf.groupby("day_number")[CLINICAL_ITEMS].mean()
        heat.columns = [CLINICAL_LABELS[c] for c in CLINICAL_ITEMS]

        fig_h = px.imshow(
            heat.T, aspect="auto",
            color_continuous_scale="YlOrRd",
            labels=dict(x="Day", y="臨床項目", color="スコア平均"),
            title=grp,
        )
        fig_h.update_layout(height=400, margin=dict(t=40))
        with col_container:
            st.plotly_chart(fig_h, use_container_width=True)

    # 出現タイミング比較
    st.subheader("臨床徴候の初回出現日")
    first_appear = []
    for grp in ["投与群", "対照群"]:
        gdf = sdf[sdf["group_type"] == grp]
        for item in CLINICAL_ITEMS:
            abnormal = gdf[gdf[item] > 0]
            if not abnormal.empty:
                first_day = abnormal["day_number"].min()
                first_appear.append({"群": grp, "項目": CLINICAL_LABELS[item], "初回出現Day": first_day})
    if first_appear:
        fa_df = pd.DataFrame(first_appear)
        fig_fa = px.bar(
            fa_df, x="項目", y="初回出現Day", color="群", barmode="group",
            color_discrete_map={"投与群": COLOR_TREATED, "対照群": COLOR_CONTROL},
        )
        fig_fa.update_layout(height=350)
        st.plotly_chart(fig_fa, use_container_width=True)


# ---------------------------------------------------------------------------
# Page 4: ロット比較（Golden Batch）
# ---------------------------------------------------------------------------
def page_lot_comparison():
    st.title("ロット比較（Golden Batch）")
    st.markdown("犬5種混合ワクチン **Lot.2025-A3** vs **Lot.2025-B1** の投与群を比較します。")

    # 犬試験の投与群のみ
    dog_studies = detail_df[
        detail_df["study_name"].str.contains("犬") & (detail_df["group_type"] == "投与群")
    ]

    if dog_studies.empty:
        st.warning("犬試験の投与群データがありません。")
        return

    # ロット別集計
    metrics = []
    for sname, gdf in dog_studies.groupby("study_name"):
        lot = gdf["administered_substance"].iloc[0]
        metrics.append({
            "試験名": sname,
            "ロット": lot.split("Lot.")[-1] if "Lot." in lot else lot,
            "平均体温": round(gdf["rectal_temperature"].mean(), 2),
            "ピーク体温": round(gdf["rectal_temperature"].max(), 1),
            "平均臨床スコア": round(gdf["total_clinical_score"].mean(), 2),
            "最大臨床スコア": int(gdf["total_clinical_score"].max()),
            "鼻汁発現率": round((gdf["nasal_discharge_max"] >= 1).mean(), 3),
            "嘔吐発現率": round((gdf["vomiting"] >= 1).mean(), 3),
        })

    if len(metrics) < 2:
        st.warning("比較するロットデータが不足しています。")
        return

    metrics_df = pd.DataFrame(metrics)

    # 比較テーブル
    st.subheader("ロット別サマリー")

    # 逸脱判定の閾値
    thresholds = {
        "ピーク体温": 40.5,
        "平均臨床スコア": 3.0,
        "鼻汁発現率": 0.5,
        "嘔吐発現率": 0.3,
    }

    display_df = metrics_df.copy()
    for col, thresh in thresholds.items():
        display_df[col] = display_df[col].apply(
            lambda v, t=thresh: f"{v} ⚠️" if v >= t else str(v)
        )
    display_df["鼻汁発現率"] = metrics_df["鼻汁発現率"].apply(lambda v: f"{v:.1%}" + (" ⚠️" if v >= 0.5 else ""))
    display_df["嘔吐発現率"] = metrics_df["嘔吐発現率"].apply(lambda v: f"{v:.1%}" + (" ⚠️" if v >= 0.3 else ""))

    st.dataframe(display_df, use_container_width=True, hide_index=True)

    st.markdown("---")

    # レーダーチャート
    st.subheader("レーダーチャート比較")

    radar_items = ["平均体温", "ピーク体温", "平均臨床スコア", "最大臨床スコア", "鼻汁発現率", "嘔吐発現率"]
    # 正規化（0-1）
    norm_df = metrics_df[radar_items].copy()
    for c in radar_items:
        cmax = norm_df[c].max()
        if cmax > 0:
            norm_df[c] = norm_df[c] / cmax

    fig = go.Figure()
    colors = [COLOR_TREATED, "#2ca02c"]
    for i, row in norm_df.iterrows():
        vals = row.tolist() + [row.tolist()[0]]  # close the radar
        cats = radar_items + [radar_items[0]]
        fig.add_trace(go.Scatterpolar(
            r=vals, theta=cats, fill="toself", opacity=0.5,
            name=metrics_df.iloc[i]["ロット"],
            line=dict(color=colors[i % len(colors)]),
        ))
    fig.update_layout(
        polar=dict(radialaxis=dict(visible=True, range=[0, 1.1])),
        height=450,
    )
    st.plotly_chart(fig, use_container_width=True)

    # 体温推移の重ね比較
    st.subheader("体温推移 重ね比較")
    avg_temp = dog_studies.groupby(["study_name", "day_number"])["rectal_temperature"].mean().reset_index()
    fig_temp = px.line(
        avg_temp, x="day_number", y="rectal_temperature", color="study_name",
        labels={"day_number": "Day", "rectal_temperature": "平均体温 (℃)", "study_name": "試験"},
    )
    fig_temp.update_layout(height=400)
    st.plotly_chart(fig_temp, use_container_width=True)


# ---------------------------------------------------------------------------
# Page 5: 個体検索
# ---------------------------------------------------------------------------
def page_animal_search():
    st.title("個体検索")

    col1, col2 = st.columns(2)
    with col1:
        study_filter = st.selectbox("試験", ["すべて"] + detail_df["study_name"].unique().tolist(), key="as_study")
    with col2:
        animal_filter = st.text_input("個体番号（部分一致）", key="as_animal")

    col3, col4 = st.columns(2)
    with col3:
        item_filter = st.selectbox(
            "臨床項目フィルタ",
            ["なし"] + [CLINICAL_LABELS[c] for c in CLINICAL_ITEMS],
            key="as_item",
        )
    with col4:
        threshold = st.slider("スコア閾値（以上）", 0, 5, 1, key="as_thresh")

    # フィルタ適用
    filtered = detail_df.copy()
    if study_filter != "すべて":
        filtered = filtered[filtered["study_name"] == study_filter]
    if animal_filter:
        filtered = filtered[filtered["animal_id"].str.contains(animal_filter, case=False)]
    if item_filter != "なし":
        item_col = [k for k, v in CLINICAL_LABELS.items() if v == item_filter][0]
        filtered = filtered[filtered[item_col] >= threshold]

    # 個体一覧
    st.subheader(f"該当個体 ({filtered['animal_id'].nunique()} 頭)")
    animal_summary = (
        filtered.groupby(["study_name", "animal_id", "group_type"])
        .agg(
            観察数=("observation_id", "count"),
            平均体温=("rectal_temperature", "mean"),
            最大臨床スコア=("total_clinical_score", "max"),
        )
        .round(2)
        .reset_index()
    )
    animal_summary.columns = ["試験名", "個体番号", "群", "観察数", "平均体温", "最大臨床スコア"]
    st.dataframe(animal_summary, use_container_width=True, hide_index=True)

    # CSVダウンロード
    csv_data = filtered.to_csv(index=False).encode("utf-8-sig")
    st.download_button(
        label="フィルタ結果をCSVダウンロード",
        data=csv_data,
        file_name="filtered_observations.csv",
        mime="text/csv",
    )

    st.markdown("---")

    # 個体詳細
    animals = filtered["animal_id"].unique().tolist()
    if animals:
        selected_animal = st.selectbox("個体を選択して詳細表示", animals, key="as_detail")
        adf = detail_df[detail_df["animal_id"] == selected_animal]

        st.subheader(f"{selected_animal} の時系列データ")

        # 体温 + 臨床スコアの二軸グラフ
        fig = make_subplots(specs=[[{"secondary_y": True}]])
        fig.add_trace(
            go.Scatter(x=adf["day_number"], y=adf["rectal_temperature"],
                       mode="lines+markers", name="体温 (℃)", line=dict(color="#d62728")),
            secondary_y=False,
        )
        fig.add_trace(
            go.Bar(x=adf["day_number"], y=adf["total_clinical_score"],
                   name="臨床スコア", marker_color="#9467bd", opacity=0.6),
            secondary_y=True,
        )
        fig.update_yaxes(title_text="体温 (℃)", secondary_y=False)
        fig.update_yaxes(title_text="臨床スコア", secondary_y=True)
        fig.update_xaxes(title_text="Day")
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

        # 全項目テーブル
        display_cols = ["day_number", "rectal_temperature", "body_weight"] + CLINICAL_ITEMS + ["total_clinical_score", "remarks"]
        rename = {"day_number": "Day", "rectal_temperature": "体温", "body_weight": "体重",
                  "total_clinical_score": "合計スコア", "remarks": "備考"}
        rename.update(CLINICAL_LABELS)
        st.dataframe(
            adf[display_cols].rename(columns=rename).reset_index(drop=True),
            use_container_width=True, hide_index=True,
        )


# ---------------------------------------------------------------------------
# Page 6: 異常アラート
# ---------------------------------------------------------------------------
def page_alerts():
    st.title("異常アラート")
    st.markdown("閾値ベースの自動アラート検出結果を表示します。")

    col1, col2, col3, col4 = st.columns(4)
    temp_thresh = col1.number_input("体温閾値 (℃)", value=39.5, step=0.1, key="al_temp")
    weight_pct = col2.number_input("体重減少率 (%)", value=5.0, step=1.0, key="al_wt")
    score_thresh = col3.number_input("臨床スコア閾値", value=5, step=1, key="al_score")
    multi_thresh = col4.number_input("同時異常項目数", value=3, step=1, key="al_multi")

    alerts = []

    for _, row in detail_df.iterrows():
        reasons = []

        # 体温
        if pd.notna(row["rectal_temperature"]) and row["rectal_temperature"] >= temp_thresh:
            reasons.append(f"体温 {row['rectal_temperature']:.1f}℃")

        # 体重減少（同一個体の初日比）
        animal_data = detail_df[detail_df["animal_id"] == row["animal_id"]]
        baseline_weight = animal_data.loc[animal_data["day_number"].idxmin(), "body_weight"]
        if pd.notna(baseline_weight) and baseline_weight > 0 and pd.notna(row["body_weight"]):
            pct_change = (baseline_weight - row["body_weight"]) / baseline_weight * 100
            if pct_change >= weight_pct:
                reasons.append(f"体重 -{pct_change:.1f}%")

        # 臨床スコア
        if row["total_clinical_score"] >= score_thresh:
            reasons.append(f"臨床スコア {int(row['total_clinical_score'])}")

        # 複数項目同時異常
        abnormal_count = sum(1 for item in CLINICAL_ITEMS if row.get(item, 0) >= 1)
        if abnormal_count >= multi_thresh:
            reasons.append(f"同時異常 {abnormal_count}項目")

        if reasons:
            alerts.append({
                "試験名": row["study_name"],
                "個体番号": row["animal_id"],
                "群": row["group_type"],
                "Day": row["day_number"],
                "体温": row["rectal_temperature"],
                "臨床スコア": int(row["total_clinical_score"]),
                "検出理由": " / ".join(reasons),
            })

    alert_df = pd.DataFrame(alerts)

    if alert_df.empty:
        st.success("現在の閾値設定ではアラートは検出されていません。")
        return

    # KPI
    col1, col2, col3 = st.columns(3)
    col1.metric("アラート件数", f"{len(alert_df)} 件")
    col2.metric("該当個体数", f"{alert_df['個体番号'].nunique()} 頭")
    col3.metric("対照群アラート率", f"{(alert_df['群'] == '対照群').mean():.0%}")

    st.markdown("---")

    # アラート一覧
    st.subheader("アラート一覧")
    st.dataframe(
        alert_df.sort_values(["試験名", "個体番号", "Day"]),
        use_container_width=True, hide_index=True,
    )

    st.markdown("---")

    # アラート該当個体の時系列
    st.subheader("アラート該当個体の体温推移")
    alert_animals = alert_df["個体番号"].unique().tolist()
    selected = st.selectbox("個体を選択", alert_animals, key="al_animal")
    adf = detail_df[detail_df["animal_id"] == selected]

    fig = make_subplots(specs=[[{"secondary_y": True}]])
    fig.add_trace(
        go.Scatter(x=adf["day_number"], y=adf["rectal_temperature"],
                   mode="lines+markers", name="体温", line=dict(color="#d62728")),
        secondary_y=False,
    )
    fig.add_trace(
        go.Bar(x=adf["day_number"], y=adf["total_clinical_score"],
               name="臨床スコア", marker_color="#9467bd", opacity=0.6),
        secondary_y=True,
    )

    # アラートポイント表示
    alert_days = alert_df[alert_df["個体番号"] == selected]["Day"].tolist()
    alert_temps = adf[adf["day_number"].isin(alert_days)]["rectal_temperature"]
    alert_days_matched = adf[adf["day_number"].isin(alert_days)]["day_number"]
    fig.add_trace(
        go.Scatter(x=alert_days_matched, y=alert_temps,
                   mode="markers", name="アラート",
                   marker=dict(color="red", size=14, symbol="x")),
        secondary_y=False,
    )

    # 閾値ライン
    fig.add_hline(y=temp_thresh, line_dash="dash", line_color="red",
                  annotation_text=f"体温閾値 {temp_thresh}℃", secondary_y=False)

    fig.update_yaxes(title_text="体温 (℃)", secondary_y=False)
    fig.update_yaxes(title_text="臨床スコア", secondary_y=True)
    fig.update_xaxes(title_text="Day")
    fig.update_layout(height=450)
    st.plotly_chart(fig, use_container_width=True)


# ---------------------------------------------------------------------------
# Page 7: 示唆・インサイト
# ---------------------------------------------------------------------------

def _insight_card(icon: str, category: str, title: str, body: str, severity: str = "info"):
    """示唆カードを描画する。severity: info / success / warning / error"""
    color_map = {
        "info": "#e3f2fd",
        "success": "#e8f5e9",
        "warning": "#fff3e0",
        "error": "#fce4ec",
    }
    border_map = {
        "info": "#1976d2",
        "success": "#388e3c",
        "warning": "#f57c00",
        "error": "#d32f2f",
    }
    bg = color_map.get(severity, color_map["info"])
    border = border_map.get(severity, border_map["info"])
    st.markdown(
        f"""<div style="background:{bg}; border-left:4px solid {border};
        padding:12px 16px; border-radius:4px; margin-bottom:12px;">
        <div style="font-size:0.8em; color:#666;">{icon} {category}</div>
        <div style="font-weight:bold; margin:4px 0;">{title}</div>
        <div style="font-size:0.95em;">{body}</div>
        </div>""",
        unsafe_allow_html=True,
    )


def _generate_insights(df: pd.DataFrame) -> list[dict]:
    """データからルールベースの示唆を生成する。"""
    insights = []

    # === 1. ワクチン効果の示唆 ===
    for sname, sdf in df.groupby("study_name"):
        treated = sdf[sdf["group_type"] == "投与群"]
        control = sdf[sdf["group_type"] == "対照群"]
        if treated.empty or control.empty:
            continue

        # 体温ピーク差
        t_peak = treated["rectal_temperature"].max()
        c_peak = control["rectal_temperature"].max()
        diff = c_peak - t_peak
        if diff > 0.3:
            insights.append(dict(
                icon="💉", category="ワクチン効果", severity="success",
                title=f"{sname}: 体温抑制効果を確認",
                body=f"投与群のピーク体温 {t_peak:.1f}℃ に対し、対照群は {c_peak:.1f}℃"
                     f"（差 {diff:.1f}℃）。ワクチンによる発熱抑制効果が示唆されます。",
                priority=10,
            ))

        # 臨床スコアピーク差
        t_score_peak = treated.groupby("day_number")["total_clinical_score"].mean().max()
        c_score_peak = control.groupby("day_number")["total_clinical_score"].mean().max()
        if c_score_peak > 0:
            reduction_pct = (c_score_peak - t_score_peak) / c_score_peak * 100
            if reduction_pct > 30:
                insights.append(dict(
                    icon="📊", category="ワクチン効果", severity="success",
                    title=f"{sname}: 臨床症状の大幅軽減",
                    body=f"投与群の平均臨床スコアピークは {t_score_peak:.1f}、対照群は {c_score_peak:.1f}。"
                         f"投与群で {reduction_pct:.0f}% の症状軽減が認められます。",
                    priority=9,
                ))

        # 回復速度
        t_avg_by_day = treated.groupby("day_number")["total_clinical_score"].mean()
        c_avg_by_day = control.groupby("day_number")["total_clinical_score"].mean()
        if len(t_avg_by_day) > 7:
            t_peak_day = t_avg_by_day.idxmax()
            c_peak_day = c_avg_by_day.idxmax()
            # ピーク後にスコアが半減するまでの日数
            t_half = None
            c_half = None
            t_peak_val = t_avg_by_day.max()
            c_peak_val = c_avg_by_day.max()
            for d in range(t_peak_day, t_avg_by_day.index.max() + 1):
                if d in t_avg_by_day.index and t_avg_by_day[d] <= t_peak_val / 2:
                    t_half = d - t_peak_day
                    break
            for d in range(c_peak_day, c_avg_by_day.index.max() + 1):
                if d in c_avg_by_day.index and c_avg_by_day[d] <= c_peak_val / 2:
                    c_half = d - c_peak_day
                    break
            if t_half is not None and c_half is not None and c_half > t_half:
                insights.append(dict(
                    icon="⏱️", category="回復速度", severity="info",
                    title=f"{sname}: 投与群の回復が早い",
                    body=f"投与群はピーク後 {t_half} 日で症状半減、"
                         f"対照群は {c_half} 日。投与群のほうが {c_half - t_half} 日早く回復しています。",
                    priority=7,
                ))

    # === 2. ロット比較示唆 ===
    dog_treated = df[df["study_name"].str.contains("犬") & (df["group_type"] == "投与群")]
    lot_groups = list(dog_treated.groupby("study_name"))
    if len(lot_groups) >= 2:
        (name_a, lot_a), (name_b, lot_b) = lot_groups[0], lot_groups[1]
        a_avg_score = lot_a["total_clinical_score"].mean()
        b_avg_score = lot_b["total_clinical_score"].mean()
        better, worse = (name_a, name_b) if a_avg_score < b_avg_score else (name_b, name_a)
        diff_score = abs(a_avg_score - b_avg_score)
        if diff_score > 0.5:
            insights.append(dict(
                icon="🏭", category="ロット比較", severity="warning",
                title="ロット間で臨床スコアに差異あり",
                body=f"「{better}」の平均臨床スコアが「{worse}」より {diff_score:.1f} 低く、"
                     f"品質面でより安定した結果を示しています。ロット間のばらつきに注意が必要です。",
                priority=8,
            ))

        # 鼻汁発現率比較
        a_nasal = (lot_a["nasal_discharge_max"] >= 1).mean()
        b_nasal = (lot_b["nasal_discharge_max"] >= 1).mean()
        if abs(a_nasal - b_nasal) > 0.1:
            higher_name = name_a if a_nasal > b_nasal else name_b
            higher_rate = max(a_nasal, b_nasal)
            lower_rate = min(a_nasal, b_nasal)
            insights.append(dict(
                icon="🔍", category="ロット比較", severity="info",
                title="鼻汁発現率にロット間差異",
                body=f"「{higher_name}」の鼻汁発現率 {higher_rate:.0%} に対し、"
                     f"もう一方は {lower_rate:.0%}。"
                     f"製造工程や原料ロットの影響が考えられます。",
                priority=6,
            ))

    # === 3. 注意個体の示唆 ===
    # 投与群で最もスコアが高かった個体
    treated_all = df[df["group_type"] == "投与群"]
    if not treated_all.empty:
        worst_row = treated_all.loc[treated_all["total_clinical_score"].idxmax()]
        if worst_row["total_clinical_score"] >= 5:
            insights.append(dict(
                icon="⚠️", category="注意個体", severity="warning",
                title=f"投与群 {worst_row['animal_id']}: 高い臨床スコアを記録",
                body=f"Day{int(worst_row['day_number'])} に臨床スコア {int(worst_row['total_clinical_score'])} を記録。"
                     f"投与群としては高いスコアであり、個体差またはワクチン応答不良の可能性があります。"
                     f"個体検索ページで詳細を確認してください。",
                priority=7,
            ))

    # 対照群で症状が軽い個体（非感染の可能性）
    control_all = df[df["group_type"] == "対照群"]
    if not control_all.empty:
        control_max_by_animal = control_all.groupby("animal_id")["total_clinical_score"].max()
        mild_controls = control_max_by_animal[control_max_by_animal < 3]
        if len(mild_controls) > 0 and len(mild_controls) < len(control_max_by_animal):
            insights.append(dict(
                icon="🔬", category="注意個体", severity="info",
                title=f"対照群で症状軽微な個体: {', '.join(mild_controls.index[:3])}",
                body=f"対照群 {len(control_max_by_animal)} 頭中 {len(mild_controls)} 頭で"
                     f"最大臨床スコアが3未満。チャレンジウイルスへの感受性が低い可能性があり、"
                     f"試験結果の解釈に注意が必要です。",
                priority=5,
            ))

    # === 4. 症状パターンの示唆 ===
    for sname, sdf in df.groupby("study_name"):
        control = sdf[sdf["group_type"] == "対照群"]
        if control.empty:
            continue

        # 症状の出現順序を分析
        onset_days = {}
        for item in CLINICAL_ITEMS:
            abnormal = control[control[item] > 0]
            if not abnormal.empty:
                onset_days[CLINICAL_LABELS[item]] = abnormal["day_number"].min()

        if len(onset_days) >= 3:
            sorted_items = sorted(onset_days.items(), key=lambda x: x[1])
            progression = " → ".join([f"{name}(Day{day})" for name, day in sorted_items[:5]])
            insights.append(dict(
                icon="📈", category="症状パターン", severity="info",
                title=f"{sname}: 対照群の症状進行パターン",
                body=f"対照群における症状の出現順序: {progression}。"
                     f"この進行パターンは典型的なチャレンジ感染の臨床経過と考えられます。",
                priority=4,
            ))

    # === 5. 体重変化の示唆 ===
    for sname, sdf in df.groupby("study_name"):
        for grp in ["投与群", "対照群"]:
            gdf = sdf[sdf["group_type"] == grp]
            if gdf.empty:
                continue
            # 初日と最終日の平均体重比較
            day0 = gdf[gdf["day_number"] == 0]["body_weight"]
            day_last = gdf[gdf["day_number"] == gdf["day_number"].max()]["body_weight"]
            if not day0.empty and not day_last.empty:
                avg_change = day_last.mean() - day0.mean()
                pct_change = avg_change / day0.mean() * 100
                if pct_change < -3:
                    insights.append(dict(
                        icon="⚖️", category="体重変化", severity="warning",
                        title=f"{sname} {grp}: 体重減少傾向",
                        body=f"試験期間中の平均体重変化: {avg_change:+.2f}kg（{pct_change:+.1f}%）。"
                             f"3%以上の減少は栄養状態や全身状態の悪化を示唆します。",
                        priority=6,
                    ))

    # === 6. データ品質の示唆 ===
    missing = df[["rectal_temperature", "body_weight"]].isna().sum()
    total = len(df)
    for col_name, label in [("rectal_temperature", "体温"), ("body_weight", "体重")]:
        miss_count = missing[col_name]
        if miss_count > 0:
            insights.append(dict(
                icon="📋", category="データ品質", severity="info",
                title=f"{label}データの欠損: {miss_count} 件",
                body=f"全 {total} 件中 {miss_count} 件（{miss_count/total:.1%}）の{label}データが欠損しています。"
                     f"データ入力漏れの確認を推奨します。",
                priority=2,
            ))

    # 優先度順にソート
    insights.sort(key=lambda x: x["priority"], reverse=True)
    return insights


def page_insights():
    st.title("示唆・インサイト")
    st.markdown("データから自動検出された分析示唆を表示します。ルールベースの分析エンジンが"
                "統計的パターンや注目すべき傾向を自動的に抽出します。")

    insights = _generate_insights(detail_df)

    if not insights:
        st.info("現在のデータからは特筆すべき示唆は検出されませんでした。")
        return

    # カテゴリ別フィルタ
    categories = sorted(set(i["category"] for i in insights))
    selected_cats = st.multiselect("カテゴリで絞り込み", categories, default=categories)

    filtered = [i for i in insights if i["category"] in selected_cats]

    st.markdown(f"**{len(filtered)} 件の示唆が検出されました**")
    st.markdown("---")

    for ins in filtered:
        _insight_card(ins["icon"], ins["category"], ins["title"], ins["body"], ins["severity"])

    # サマリーテーブル
    st.markdown("---")
    st.subheader("示唆サマリー（カテゴリ別件数）")
    cat_counts = pd.DataFrame(
        [{"カテゴリ": i["category"], "重要度": i["severity"]} for i in insights]
    )
    summary = cat_counts.groupby("カテゴリ").size().reset_index(name="件数")
    st.dataframe(summary, use_container_width=True, hide_index=True)


# ---------------------------------------------------------------------------
# ルーティング
# ---------------------------------------------------------------------------
page_key = PAGES[page]
if page_key == "overview":
    page_overview()
elif page_key == "temperature":
    page_temperature()
elif page_key == "clinical_score":
    page_clinical_score()
elif page_key == "lot_comparison":
    page_lot_comparison()
elif page_key == "animal_search":
    page_animal_search()
elif page_key == "alerts":
    page_alerts()
elif page_key == "insights":
    page_insights()
