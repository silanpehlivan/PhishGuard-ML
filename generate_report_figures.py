import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.io import arff


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "Training Dataset.arff")
METRICS_PATH = os.path.join(BASE_DIR, "metrics.json")
OUTPUT_DIR = os.path.join(BASE_DIR, "report_figures")

os.makedirs(OUTPUT_DIR, exist_ok=True)

plt.rcParams["font.family"] = "DejaVu Sans"
plt.rcParams["axes.titlesize"] = 14
plt.rcParams["axes.labelsize"] = 11
plt.rcParams["xtick.labelsize"] = 9
plt.rcParams["ytick.labelsize"] = 9


def save_figure(filename):
    output_path = os.path.join(OUTPUT_DIR, filename)
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close()
    print(f"Oluşturuldu: {output_path}")


def load_dataset():
    data, meta = arff.loadarff(DATASET_PATH)
    df = pd.DataFrame(data)

    for col in df.columns:
        df[col] = df[col].astype(int)

    return df


def load_metrics():
    with open(METRICS_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def get_model_names(metrics):
    ignored_keys = {"FeatureImportance"}
    return [name for name in metrics.keys() if name not in ignored_keys]


def percent(value):
    return value * 100


def create_class_distribution(df):
    class_counts = df["Result"].value_counts().sort_index()

    labels = []
    values = []

    for key, value in class_counts.items():
        if key == -1:
            labels.append("Legitimate")
        elif key == 1:
            labels.append("Phishing")
        else:
            labels.append(str(key))
        values.append(value)

    plt.figure(figsize=(7, 5))
    bars = plt.bar(labels, values)

    plt.title("Veri Setindeki Sınıf Dağılımı")
    plt.xlabel("Sınıf")
    plt.ylabel("Kayıt Sayısı")

    for bar in bars:
        height = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width() / 2,
            height + 80,
            f"{int(height)}",
            ha="center",
            va="bottom",
            fontsize=10
        )

    save_figure("class_distribution.png")


def create_accuracy_comparison(metrics):
    model_names = get_model_names(metrics)
    values = [percent(metrics[model]["Accuracy"]) for model in model_names]

    plt.figure(figsize=(10, 5))
    bars = plt.bar(model_names, values)

    plt.title("Modellerin Doğruluk Oranlarının Karşılaştırılması")
    plt.xlabel("Model")
    plt.ylabel("Accuracy (%)")
    plt.ylim(90, 100)
    plt.xticks(rotation=25, ha="right")

    for bar, value in zip(bars, values):
        plt.text(
            bar.get_x() + bar.get_width() / 2,
            value + 0.15,
            f"{value:.2f}%",
            ha="center",
            va="bottom",
            fontsize=9
        )

    save_figure("model_accuracy_comparison.png")


def create_f1_comparison(metrics):
    model_names = get_model_names(metrics)
    values = [percent(metrics[model]["F1 Score"]) for model in model_names]

    plt.figure(figsize=(10, 5))
    bars = plt.bar(model_names, values)

    plt.title("Modellerin F1 Skorlarının Karşılaştırılması")
    plt.xlabel("Model")
    plt.ylabel("F1 Score (%)")
    plt.ylim(90, 100)
    plt.xticks(rotation=25, ha="right")

    for bar, value in zip(bars, values):
        plt.text(
            bar.get_x() + bar.get_width() / 2,
            value + 0.15,
            f"{value:.2f}%",
            ha="center",
            va="bottom",
            fontsize=9
        )

    save_figure("model_f1_comparison.png")


def create_metrics_comparison(metrics):
    model_names = get_model_names(metrics)
    metric_names = ["Accuracy", "Precision", "Recall", "F1 Score"]

    x = np.arange(len(model_names))
    width = 0.18

    plt.figure(figsize=(12, 6))

    for i, metric in enumerate(metric_names):
        values = [percent(metrics[model][metric]) for model in model_names]
        plt.bar(x + (i - 1.5) * width, values, width, label=metric)

    plt.title("Modellerin Performans Metriklerine Göre Karşılaştırılması")
    plt.xlabel("Model")
    plt.ylabel("Başarı Oranı (%)")
    plt.ylim(90, 100)
    plt.xticks(x, model_names, rotation=25, ha="right")
    plt.legend()

    save_figure("model_metrics_comparison.png")


def create_roc_auc_comparison(metrics):
    model_names = get_model_names(metrics)
    values = [percent(metrics[model]["ROC-AUC"]) for model in model_names]

    plt.figure(figsize=(10, 5))
    bars = plt.bar(model_names, values)

    plt.title("Modellerin ROC-AUC Değerlerine Göre Karşılaştırılması")
    plt.xlabel("Model")
    plt.ylabel("ROC-AUC (%)")
    plt.ylim(95, 100)
    plt.xticks(rotation=25, ha="right")

    for bar, value in zip(bars, values):
        plt.text(
            bar.get_x() + bar.get_width() / 2,
            value + 0.07,
            f"{value:.2f}%",
            ha="center",
            va="bottom",
            fontsize=9
        )

    save_figure("roc_auc_comparison.png")


def find_best_model(metrics):
    model_names = get_model_names(metrics)

    best_model = max(
        model_names,
        key=lambda model: metrics[model]["F1 Score"]
    )

    return best_model


def create_confusion_matrix(metrics):
    best_model = find_best_model(metrics)
    cm = np.array(metrics[best_model]["ConfusionMatrix"])

    plt.figure(figsize=(6.5, 5.5))
    plt.imshow(cm, interpolation="nearest", cmap="Blues")
    plt.title(f"{best_model} Modeline Ait Karmaşıklık Matrisi")
    plt.colorbar()

    classes = ["Legitimate", "Phishing"]
    tick_marks = np.arange(len(classes))

    plt.xticks(tick_marks, classes)
    plt.yticks(tick_marks, classes)

    threshold = cm.max() / 2

    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            plt.text(
                j,
                i,
                format(cm[i, j], "d"),
                ha="center",
                va="center",
                color="white" if cm[i, j] > threshold else "black",
                fontsize=12,
                fontweight="bold"
            )

    plt.ylabel("Gerçek Sınıf")
    plt.xlabel("Tahmin Edilen Sınıf")

    save_figure("confusion_matrix.png")


def create_feature_importance(metrics):
    feature_importance = metrics.get("FeatureImportance", {})

    selected_model = None

    if "Extra Trees" in feature_importance:
        selected_model = "Extra Trees"
    elif "Random Forest" in feature_importance:
        selected_model = "Random Forest"
    elif "XGBoost" in feature_importance:
        selected_model = "XGBoost"

    if selected_model is None:
        print("Feature importance verisi bulunamadı.")
        return

    features = feature_importance[selected_model]
    feature_names = [item[0].replace("_", " ") for item in features]
    importance_values = [item[1] * 100 for item in features]

    y_positions = np.arange(len(feature_names))

    plt.figure(figsize=(10, 6))
    bars = plt.barh(y_positions, importance_values)

    plt.yticks(y_positions, feature_names)
    plt.xlabel("Önem Değeri (%)")
    plt.title(f"{selected_model} Modeline Göre Özellik Önem Sıralaması")
    plt.gca().invert_yaxis()

    for bar, value in zip(bars, importance_values):
        plt.text(
            value + 0.3,
            bar.get_y() + bar.get_height() / 2,
            f"{value:.2f}%",
            va="center",
            fontsize=9
        )

    save_figure("feature_importance.png")


def main():
    print("Rapor görselleri oluşturuluyor...")

    df = load_dataset()
    metrics = load_metrics()

    create_class_distribution(df)
    create_accuracy_comparison(metrics)
    create_f1_comparison(metrics)
    create_metrics_comparison(metrics)
    create_roc_auc_comparison(metrics)
    create_confusion_matrix(metrics)
    create_feature_importance(metrics)

    print("\nTüm rapor görselleri başarıyla oluşturuldu.")
    print(f"Görsellerin bulunduğu klasör: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()


import os
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

# Klasör ayarları
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "report_figures")
os.makedirs(OUTPUT_DIR, exist_ok=True)

OUTPUT_PATH = os.path.join(OUTPUT_DIR, "system_architecture.png")

plt.rcParams["font.family"] = "DejaVu Sans"


def add_box(ax, x, y, w, h, title, lines, title_size=12, text_size=9):
    box = FancyBboxPatch(
        (x, y), w, h,
        boxstyle="round,pad=0.02,rounding_size=0.02",
        linewidth=1.5,
        edgecolor="#1F3A5F",
        facecolor="#EAF2F8"
    )
    ax.add_patch(box)

    # Başlık
    ax.text(
        x + w / 2,
        y + h - 0.03,
        title,
        ha="center",
        va="top",
        fontsize=title_size,
        fontweight="bold",
        color="#0B2545"
    )

    # İçerik
    content = "\n".join(lines)
    ax.text(
        x + w / 2,
        y + h / 2 - 0.015,
        content,
        ha="center",
        va="center",
        fontsize=text_size,
        color="#222222",
        linespacing=1.4
    )


def add_arrow(ax, x1, y1, x2, y2):
    ax.annotate(
        "",
        xy=(x2, y2),
        xytext=(x1, y1),
        arrowprops=dict(
            arrowstyle="->",
            lw=2,
            color="#1F3A5F"
        )
    )


def main():
    fig, ax = plt.subplots(figsize=(20, 7))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    # Başlık
    ax.text(
        0.5, 0.95,
        "Phishing Website Detection Sistemi Genel Mimarisi",
        ha="center",
        va="center",
        fontsize=20,
        fontweight="bold",
        color="#0B2545"
    )

    # Kutu boyutları
    w = 0.14
    h = 0.28
    y = 0.45

    x_positions = [0.02, 0.19, 0.36, 0.53, 0.70, 0.87]

    # 1. Veri Seti
    add_box(
        ax, x_positions[0], y, w, h,
        "Veri Seti",
        [
            "Training Dataset.arff",
            "30 özellik + 1 hedef değişken",
            "Phishing / Legitimate kayıtları"
        ]
    )

    # 2. Model Eğitimi
    add_box(
        ax, x_positions[1], y, w, h,
        "Model Eğitimi",
        [
            "train_models.py",
            "Random Forest, XGBoost, SVM,",
            "MLP, Extra Trees,",
            "Stacking Ensemble"
        ]
    )

    # 3. Model Çıktıları
    add_box(
        ax, x_positions[2], y, w, h,
        "Model Çıktıları",
        [
            "best_model.pkl",
            "metrics.json",
            "prediction_logs.csv"
        ]
    )

    # 4. Backend
    add_box(
        ax, x_positions[3], y, w, h,
        "Backend Katmanı",
        [
            "FastAPI",
            "/predict",
            "/metrics",
            "/log-analysis"
        ]
    )

    # 5. Frontend
    add_box(
        ax, x_positions[4], y, w, h,
        "Frontend Katmanı",
        [
            "React",
            "Ana Sayfa",
            "Model Analysis",
            "Phishing Sites",
            "PhishGuard Asistan"
        ]
    )

    # 6. Kullanıcı
    add_box(
        ax, x_positions[5], y, w, h,
        "Kullanıcı İşlemi",
        [
            "URL girişi",
            "Özellik çıkarımı",
            "Tahmin sonucu görüntüleme",
            "Log kaydı oluşturma"
        ]
    )

    # Oklar
    for i in range(len(x_positions) - 1):
        x1 = x_positions[i] + w
        x2 = x_positions[i + 1]
        add_arrow(ax, x1, y + h / 2, x2, y + h / 2)

    # Alt açıklama
    ax.text(
        0.5, 0.16,
        "Sistem; veri seti üzerinde model eğitimi, model çıktılarının backend servisinde sunulması\n"
        "ve React tabanlı arayüz üzerinden kullanıcıya URL analizi sağlanması mantığıyla çalışmaktadır.",
        ha="center",
        va="center",
        fontsize=11,
        color="#222222"
    )

    plt.tight_layout()
    plt.savefig(OUTPUT_PATH, dpi=300, bbox_inches="tight")
    plt.close()

    print(f"Oluşturuldu: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()



import os
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

# Klasör ayarları
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "report_figures")
os.makedirs(OUTPUT_DIR, exist_ok=True)

OUTPUT_PATH = os.path.join(OUTPUT_DIR, "url_analysis_flow.png")

plt.rcParams["font.family"] = "DejaVu Sans"


def add_box(ax, x, y, w, h, title, lines, title_size=12, text_size=9, facecolor="#EEF4FA"):
    box = FancyBboxPatch(
        (x, y), w, h,
        boxstyle="round,pad=0.02,rounding_size=0.02",
        linewidth=1.5,
        edgecolor="#1F3A5F",
        facecolor=facecolor
    )
    ax.add_patch(box)

    ax.text(
        x + w / 2,
        y + h - 0.025,
        title,
        ha="center",
        va="top",
        fontsize=title_size,
        fontweight="bold",
        color="#0B2545"
    )

    content = "\n".join(lines)
    ax.text(
        x + w / 2,
        y + h / 2 - 0.01,
        content,
        ha="center",
        va="center",
        fontsize=text_size,
        color="#222222",
        linespacing=1.35
    )


def add_arrow(ax, x1, y1, x2, y2):
    ax.annotate(
        "",
        xy=(x2, y2),
        xytext=(x1, y1),
        arrowprops=dict(
            arrowstyle="->",
            lw=2,
            color="#1F3A5F"
        )
    )


def main():
    fig, ax = plt.subplots(figsize=(20, 7))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    # Başlık
    ax.text(
        0.5, 0.94,
        "URL Analiz Süreci Akış Diyagramı",
        ha="center",
        va="center",
        fontsize=20,
        fontweight="bold",
        color="#0B2545"
    )

    # Kutu ayarları
    w = 0.10
    h = 0.26
    y = 0.48

    x_positions = [0.01, 0.135, 0.26, 0.385, 0.51, 0.635, 0.76, 0.885]

    steps = [
        ("1. Kullanıcı Girdisi",
         ["Kullanıcı arayüze", "bir URL girer"]),
        
        ("2. Frontend Ön Analizi",
         ["URL biçimi kontrol edilir", "Temel risk göstergeleri", "incelenir"]),
        
        ("3. Özellik Oluşturma",
         ["URL'den modele uygun", "özellikler çıkarılır", "(30 özellik yapısı)"]),
        
        ("4. API İsteği",
         ["Özellikler", "/predict endpointine", "gönderilir"]),
        
        ("5. Backend İşleme",
         ["FastAPI isteği alır", "best_model.pkl", "yüklenir/kullanılır"]),
        
        ("6. Model Tahmini",
         ["Model phishing veya", "legitimate tahmini", "üretir"]),
        
        ("7. Sonucun Gösterilmesi",
         ["Tahmin sonucu", "güven skoru ile birlikte", "kullanıcıya gösterilir"]),
        
        ("8. Log Kaydı",
         ["Analiz sonucu", "prediction_logs.csv", "dosyasına kaydedilir"])
    ]

    # Kutuları çiz
    for x, (title, lines) in zip(x_positions, steps):
        add_box(ax, x, y, w, h, title, lines)

    # Okları çiz
    for i in range(len(x_positions) - 1):
        x1 = x_positions[i] + w
        x2 = x_positions[i + 1]
        add_arrow(ax, x1, y + h / 2, x2, y + h / 2)

    # Alt açıklama
    ax.text(
        0.5, 0.16,
        "Bu akışta kullanıcı tarafından girilen URL, frontend tarafında ön analizden geçirilmekte,\n"
        "backend servisine gönderilmekte, makine öğrenmesi modeli ile sınıflandırılmakta ve sonuç kullanıcıya sunulmaktadır.",
        ha="center",
        va="center",
        fontsize=11,
        color="#222222"
    )

    plt.tight_layout()
    plt.savefig(OUTPUT_PATH, dpi=300, bbox_inches="tight")
    plt.close()

    print(f"Oluşturuldu: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()