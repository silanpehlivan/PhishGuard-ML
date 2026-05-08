Phishing Web Sitesi Tespiti: Proje Özeti
Veri Madenciliği dersiniz için verilen ödev talimatları başarıyla yerine getirilmiş olup, makine öğrenmesi destekli uçtan uca bir oltalama tespiti sistemi geliştirilmiştir.

1. Veri Ön İşleme ve Model Eğitimi
Training Dataset.arff verisi Pandas kütüphanesi kullanılarak içeri aktarılmış ve -1 (Legitimate) / 1 (Phishing) sınıfları, binary classification için 0 ve 1 olarak standartlaştırılmıştır. Aşağıdaki 3 farklı model kullanılarak başarı metrikleri hesaplanmıştır:

Random Forest: En yüksek F1 skorunu (%97.7) yakaladığı için En İyi Model seçilmiş ve best_model.pkl olarak kaydedilmiştir.
XGBoost: Gradient Boosting algoritmalarından biri olarak kullanılmış ve %97.2 doğruluk ile çok yüksek bir başarı göstermiştir.
SVM: Temel karşılaştırma modeli olarak değerlendirilmiş ve ROC-AUC vb. metrikleri hesaplanmıştır.
Tüm bu performans sonuçları ve en etkili özelliklerin (Feature Importance) sıralaması metrics.json dosyasına kaydedilmiştir.

2. Backend Geliştirme (FastAPI)
Python FastAPI kullanılarak dışarıdan erişilebilecek bir API tasarlanmıştır. Sunucu aktif olarak localhost:8000 üzerinde çalışmaktadır.

/predict endpointi: Frontend üzerinden gönderilen 30 parametreli veri setini işleyip URL'nin güvenli olup olmadığını hesaplar.
/metrics endpointi: Model başarı grafiklerinin çizilmesi için metrics.json verisini frontend'e sunar.
3. Frontend Geliştirme (React & Tailwind CSS)
Sadece bir test aracı olmaktan öte, etkileşimli bir Güvenlik Portalı (PhishGuard) konseptiyle geliştirilmiştir. Sunucu aktif olarak localhost:5173 üzerinde çalışmaktadır. Arayüzde şu 3 temel sayfa bulunmaktadır:

Ana Sayfa (Analiz Alanı): Şüpheli linklerin analiz edildiği ve arka planda API çağrıları yapılarak güvenilirlik skorunun anında gösterildiği bölüm.
Sahte Siteler (Liste): Daha önceden tespit edilmiş phishing sitelerinin durumlarının ve hedef kurumların filtrelenebildiği tablo ekranı.
Model Analizi (Grafikler): Recharts kullanılarak üç farklı modelin Accuracy ve F1 skorlarının Bar Grafiği ve Radar Chart ile görselleştirildiği, şeffaf model analizi sayfası. Ayrıca Random Forest'ın en çok baz aldığı özellikler yatay sütun grafiği ile gösterilmektedir.
Chat Box: Sayfanın sağ alt köşesinde kullanıcıları oltalama riskleri konusunda bilgilendirebilecek temel bir asistan bot penceresi tasarıma dahil edilmiştir.
TIP

Projenizi test etmek için tarayıcınızdan http://localhost:5173 adresine giderek arayüzü görebilir ve URL analizi testlerini yapabilirsiniz!

