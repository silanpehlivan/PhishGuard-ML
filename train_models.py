import os
import json
import joblib
import pandas as pd
from scipy.io import arff

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier, StackingClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

from xgboost import XGBClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)

print("1. Veri seti yükleniyor...")
data, meta = arff.loadarff('Training Dataset.arff')
df = pd.DataFrame(data)

# Byte objelerini int'e çevir
for col in df.columns:
    df[col] = df[col].astype(int)

# Hedef değişken: 'Result' (1: Phishing, -1: Legitimate)
# Binary classification için -1 değerlerini 0'a çevirelim.
df['Result'] = df['Result'].replace(-1, 0)

X = df.drop('Result', axis=1)
y = df['Result']

print("2. Train/Test bölünmesi yapılıyor...")
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Stacking içinde kullanılacak temel modeller
stacking_estimators = [
    (
        "rf",
        RandomForestClassifier(
            n_estimators=300,
            max_depth=None,
            random_state=42,
            n_jobs=-1
        )
    ),
    (
        "xgb",
        XGBClassifier(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=5,
            subsample=0.9,
            colsample_bytree=0.9,
            eval_metric="logloss",
            random_state=42,
            n_jobs=-1
        )
    ),
    (
        "extra",
        ExtraTreesClassifier(
            n_estimators=300,
            max_depth=None,
            random_state=42,
            n_jobs=-1
        )
    ),
    (
        "ysa",
        Pipeline([
            ("scaler", StandardScaler()),
            ("mlp", MLPClassifier(
                hidden_layer_sizes=(16, 8),
                activation="relu",
                solver="adam",
                alpha=0.0001,
                learning_rate_init=0.001,
                max_iter=1000,
                early_stopping=True,
                random_state=42
            ))
        ])
    )
]

models = {
    "Random Forest": RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        random_state=42,
        n_jobs=-1
    ),

    "XGBoost": XGBClassifier(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=5,
        subsample=0.9,
        colsample_bytree=0.9,
        eval_metric="logloss",
        random_state=42,
        n_jobs=-1
    ),

    "SVM": SVC(
        probability=True,
        random_state=42
    ),

    "YSA": Pipeline([
        ("scaler", StandardScaler()),
        ("mlp", MLPClassifier(
            hidden_layer_sizes=(128, 64),
            activation="relu",
            solver="adam",
            alpha=0.0001,
            learning_rate_init=0.001,
            max_iter=1000,
            early_stopping=True,
            random_state=42
        ))
    ]),

    "Extra Trees": ExtraTreesClassifier(
        n_estimators=300,
        max_depth=None,
        random_state=42,
        n_jobs=-1
    ),

    "Stacking Ensemble": StackingClassifier(
        estimators=stacking_estimators,
        final_estimator=Pipeline([
            ("scaler", StandardScaler()),
            ("lr", LogisticRegression(
                max_iter=2000,
                random_state=42
            ))
        ]),
        stack_method="predict_proba",
        passthrough=True,
        cv=5,
        n_jobs=-1
    )
}

metrics_results = {}
best_model = None
best_f1 = 0
best_model_name = ""

print("3. Modeller eğitiliyor...")
for name, model in models.items():
    print(f"   Eğitilen model: {name}")

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    if hasattr(model, "predict_proba"):
        y_prob = model.predict_proba(X_test)[:, 1]
    else:
        y_prob = [0] * len(y_test)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)

    if hasattr(model, "predict_proba"):
        roc_auc = roc_auc_score(y_test, y_prob)
    else:
        roc_auc = 0

    cm = confusion_matrix(y_test, y_pred).tolist()

    metrics_results[name] = {
        "Accuracy": float(acc),
        "Precision": float(prec),
        "Recall": float(rec),
        "F1 Score": float(f1),
        "ROC-AUC": float(roc_auc),
        "ConfusionMatrix": cm
    }

    print(f"      Accuracy : {acc:.4f}")
    print(f"      Precision: {prec:.4f}")
    print(f"      Recall   : {rec:.4f}")
    print(f"      F1 Score : {f1:.4f}")
    print(f"      ROC-AUC  : {roc_auc:.4f}")

    if f1 > best_f1:
        best_f1 = f1
        best_model = model
        best_model_name = name

print(f"4. En iyi model bulundu: {best_model_name} (F1: {best_f1:.4f})")

joblib.dump(best_model, "best_model.pkl")

# Save feature importance for tree-based models
feature_importance = {}

if hasattr(models["Random Forest"], "feature_importances_"):
    rf_imp = models["Random Forest"].feature_importances_.tolist()
    rf_features = sorted(
        zip(X.columns, rf_imp),
        key=lambda x: x[1],
        reverse=True
    )[:10]
    feature_importance["Random Forest"] = rf_features

if hasattr(models["XGBoost"], "feature_importances_"):
    xgb_imp = models["XGBoost"].feature_importances_.tolist()
    xgb_features = sorted(
        zip(X.columns, xgb_imp),
        key=lambda x: x[1],
        reverse=True
    )[:10]
    feature_importance["XGBoost"] = xgb_features

if hasattr(models["Extra Trees"], "feature_importances_"):
    extra_imp = models["Extra Trees"].feature_importances_.tolist()
    extra_features = sorted(
        zip(X.columns, extra_imp),
        key=lambda x: x[1],
        reverse=True
    )[:10]
    feature_importance["Extra Trees"] = extra_features

metrics_results["FeatureImportance"] = feature_importance

# Save results for frontend
with open("metrics.json", "w") as f:
    json.dump(metrics_results, f, indent=4)

print("Eğitim tamamlandı, best_model.pkl ve metrics.json oluşturuldu.")