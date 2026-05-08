# 🛡️ PhishGuard: Makine Öğrenmesi Tabanlı Phishing Web Sitesi Tespit Sistemi

Bu proje, internet kullanıcılarını hedef alan phishing (oltalama) web sitelerini tespit etmek amacıyla geliştirilmiş, makine öğrenmesi tabanlı bir analiz sistemidir. Sistem, web sitelerinin yapısal özelliklerini inceleyerek ilgili bağlantının güvenli mi yoksa oltalama amaçlı mı olduğunu yüksek doğrulukla tahmin eder.

---

# 🚀 Proje Hakkında

PhishGuard, bir web sitesinin risk durumunu belirlemek için URL yapısı, alan adı bilgileri, güvenlik göstergeleri ve web trafiği gibi **30 farklı niteliği** analiz eder.

Geleneksel kara liste yöntemlerinin aksine, makine öğrenmesi kullanarak daha önce görülmemiş saldırı türlerini de tespit edebilecek esnek bir yapı sunar.

## ✨ Temel Özellikler

- 🔍 **Çoklu Model Analizi**  
  Random Forest, XGBoost, SVM, Yapay Sinir Ağı, Extra Trees ve Stacking Ensemble modelleri eğitilerek performansları karşılaştırılmıştır.

- ⚡ **Gerçek Zamanlı Tahmin**  
  Kullanıcıdan alınan URL üzerinden anlık özellik çıkarımı ve risk analizi yapılır.

- 🧠 **Ensemble Learning Desteği**  
  Birden fazla modelin birleşimi ile daha yüksek doğruluk elde edilmiştir.

- 🌐 **Uçtan Uca Mimari**  
  FastAPI ile geliştirilen backend servisleri ve React tabanlı modern frontend arayüzü kullanılmıştır.

- 📊 **Kullanıcı Bilgilendirme Sistemi**  
  Tespit edilen risk faktörleri (SSL durumu, alan adı manipülasyonları vb.) kullanıcıya açıklayıcı şekilde sunulur.

---

# 📊 Model Performansları

Yapılan deneyler sonucunda ensemble tabanlı modellerin en yüksek başarıya ulaştığı görülmüştür.

| Model | Accuracy | F1 Score | ROC-AUC |
|------|------|------|------|
| Stacking Ensemble | %97.60 | %97.86 | %99.80 |
| Extra Trees | %97.60 | %97.86 | %99.46 |
| Random Forest | %97.38 | %97.66 | %99.78 |

---

# 🧩 Karar Sürecindeki Kritik Özellikler

Modelin tahmin başarısında en etkili olan temel özellikler:

- 🔐 **SSLfinal_State**  
  Web sitesinin SSL/HTTPS güvenlik durumu

- 🔗 **URL_of_Anchor**  
  Sayfa içi bağlantıların güvenilirlik analizi

- 📈 **Web Traffic**  
  Sitenin internet üzerindeki popülerlik ve trafik verisi

---

# 🛠️ Teknoloji Yığını

## Veri Bilimi
- Python
- Scikit-learn
- Pandas
- NumPy
- XGBoost

## Backend
- FastAPI
- Uvicorn
- Pickle

## Frontend
- React
- Vite
- Tailwind CSS

---

# 📂 Dosya Yapısı

```plaintext
phishing_websitesi/
│
├── backend/                   # FastAPI API servisleri
├── frontend/                  # React kullanıcı arayüzü
├── Training Dataset.arff      # 11.055 kayıtlı ana veri seti
├── train_models.py            # Model eğitimi ve karşılaştırma scripti
├── generate_report_figures.py # Grafik ve rapor üretim scriptleri
├── best_model.pkl             # En başarılı model dosyası
├── metrics.json               # Performans metrikleri
├── prediction_logs.csv        # Tahmin kayıtları
└── bilgi.md                   # Proje dokümantasyonu
```

---

# ⚙️ Kurulum

## 1️⃣ Projeyi Klonlayın

```bash
git clone <repo-link>
cd phishing_websitesi
```

---

## 2️⃣ Backend Kurulumu

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend varsayılan olarak:

```plaintext
http://127.0.0.1:8000
```

adresinde çalışacaktır.

---

## 3️⃣ Frontend Kurulumu

```bash
cd frontend

npm install

npm run dev
```

Frontend varsayılan olarak:

```plaintext
http://localhost:5173
```

adresinde çalışacaktır.

---

# 🔍 Sistem Nasıl Çalışır?

1. Kullanıcı sisteme bir URL girer.
2. Sistem URL’den çeşitli güvenlik özelliklerini çıkarır.
3. Eğitilmiş makine öğrenmesi modeli analizi gerçekleştirir.
4. Sonuç:
   - ✅ Güvenli
   - ⚠️ Şüpheli
   - ❌ Phishing

olarak kullanıcıya sunulur.

---

# 📈 Kullanılan Makine Öğrenmesi Modelleri

- Random Forest
- XGBoost
- Support Vector Machine (SVM)
- Artificial Neural Network (ANN)
- Extra Trees Classifier
- Stacking Ensemble

---

# 🎯 Projenin Amacı

Bu proje;

- Siber güvenlik farkındalığını artırmak,
- Kullanıcıları oltalama saldırılarından korumak,
- Makine öğrenmesi tabanlı güvenlik çözümleri geliştirmek

amacıyla hazırlanmıştır.

---

# 👥 Proje Ekibi

Bu çalışma,  
**Bitlis Eren Üniversitesi – Bilgisayar Mühendisliği Bölümü**  
**Veri Madenciliği Dersi** kapsamında hazırlanmıştır.

### Proje Ekibi
- Şilan PEHLİVAN
- Semanur YILDIRIM
- İlayda ÖZTÜRK

### Ders Sorumlusu
- Dr. Öğr. Üyesi Emine AYAZ

---

# 📌 Not

Bu proje, akademik ve eğitim amaçlı geliştirilmiş bir siber güvenlik çalışmasıdır. Gerçek dünya kullanımında ek güvenlik kontrolleri ve sürekli model güncellemeleri önerilmektedir.

---

# 📄 Lisans

Bu proje eğitim ve akademik kullanım amaçlı paylaşılmıştır.
