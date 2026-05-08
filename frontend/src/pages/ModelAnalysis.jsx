import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell
} from 'recharts';
import { Activity, Zap, Target, Layers } from 'lucide-react';

const ModelAnalysis = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:8000/metrics');
        setMetrics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Metrik verileri alınamadı. Backend sunucusunun çalıştığından emin olun.');
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
        <p>{error || 'Veri bulunamadı.'}</p>
      </div>
    );
  }

  const modelOrder = [
    'Random Forest',
    'XGBoost',
    'SVM',
    'YSA',
    'Extra Trees',
    'Stacking Ensemble'
  ];

  const models = modelOrder.filter(model => metrics[model]);

  const bestModel = models.reduce((best, modelName) => {
    const currentF1 = metrics[modelName]?.['F1 Score'] || 0;
    const bestF1 = best ? metrics[best]?.['F1 Score'] || 0 : 0;

    return currentF1 > bestF1 ? modelName : best;
  }, models[0]);

  const bestModelMetrics = metrics[bestModel] || {};
  const bestConfusionMatrix = bestModelMetrics.ConfusionMatrix;

  const comparisonData = [
    {
      name: 'Random Forest',
      Accuracy: 97.38,
      Precision: 97.11,
      Recall: 98.21,
      'F1 Score': 97.66,
      'ROC-AUC': 99.78
    },
    {
      name: 'XGBoost',
      Accuracy: 96.74,
      Precision: 96.18,
      Recall: 98.05,
      'F1 Score': 97.10,
      'ROC-AUC': 99.60
    },
    {
      name: 'SVM',
      Accuracy: 94.89,
      Precision: 94.02,
      Recall: 96.99,
      'F1 Score': 95.48,
      'ROC-AUC': 98.96
    },
    {
      name: 'YSA',
      Accuracy: 96.79,
      Precision: 95.81,
      Recall: 98.54,
      'F1 Score': 97.16,
      'ROC-AUC': 99.57
    },
    {
      name: 'Extra Trees',
      Accuracy: 97.60,
      Precision: 97.50,
      Recall: 98.21,
      'F1 Score': 97.86,
      'ROC-AUC': 99.46
    },
    {
      name: 'Stacking Ensemble',
      Accuracy: 97.60,
      Precision: 97.27,
      Recall: 98.46,
      'F1 Score': 97.86,
      'ROC-AUC': 99.80
    }
  ];

  const radarData = [
    {
      metric: 'Accuracy',
      'Random Forest': 97.38,
      'Extra Trees': 97.60,
      'Stacking Ensemble': 97.60
    },
    {
      metric: 'Precision',
      'Random Forest': 97.11,
      'Extra Trees': 97.50,
      'Stacking Ensemble': 97.27
    },
    {
      metric: 'Recall',
      'Random Forest': 98.21,
      'Extra Trees': 98.21,
      'Stacking Ensemble': 98.46
    },
    {
      metric: 'F1 Score',
      'Random Forest': 97.66,
      'Extra Trees': 97.86,
      'Stacking Ensemble': 97.86
    },
    {
      metric: 'ROC-AUC',
      'Random Forest': 99.78,
      'Extra Trees': 99.46,
      'Stacking Ensemble': 99.80
    }
  ];

  const featureImportanceModels = metrics.FeatureImportance || {};

  const selectedFeatureModel =
    featureImportanceModels[bestModel]
      ? bestModel
      : featureImportanceModels['Extra Trees']
        ? 'Extra Trees'
        : featureImportanceModels['Random Forest']
          ? 'Random Forest'
          : featureImportanceModels['XGBoost']
            ? 'XGBoost'
            : null;

  const featureData = selectedFeatureModel
    ? featureImportanceModels[selectedFeatureModel]?.map(([name, value]) => ({
        name: name.replace(/_/g, ' '),
        importance: value * 100
      })) || []
    : [];

  return (
    <div className="py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Yapay Zeka Model Analizi</h1>
        <p className="text-slate-500">
          Geliştirdiğimiz makine öğrenmesi modellerinin başarım kriterleri, karşılaştırmalı performansları ve karar mekanizmalarının şeffaf analizi.
        </p>
      </div>

      {/* Executive Summary Box */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 md:p-8 mb-10 text-white flex flex-col md:flex-row items-center gap-6">
        <div className="bg-white/20 p-4 rounded-full flex-shrink-0">
          <Zap size={32} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Model Performans Özeti</h2>
          <p className="text-blue-100 leading-relaxed">
            Eğittiğimiz modeller arasında <strong>{bestModel}</strong>, %{((bestModelMetrics['F1 Score'] || 0) * 100).toFixed(1)} F1 Skoru ile en iyi performansı göstermiştir. Bu sayfada Random Forest, XGBoost, SVM, YSA, Extra Trees ve Stacking Ensemble modellerinin performansları karşılaştırmalı olarak gösterilmektedir. Karar mekanizmasının daha anlaşılır olması için karmaşıklık matrisi ve özellik önemi grafikleri de ayrıca sunulmuştur.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-blue-100 p-4 rounded-xl text-blue-600 mr-4">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">En İyi Model</p>
            <h3 className="text-xl font-bold text-slate-900">{bestModel}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600 mr-4">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Maksimum F1 Score</p>
            <h3 className="text-xl font-bold text-slate-900">
              %{((bestModelMetrics['F1 Score'] || 0) * 100).toFixed(1)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-indigo-100 p-4 rounded-xl text-indigo-600 mr-4">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Veri Seti Boyutu</p>
            <h3 className="text-xl font-bold text-slate-900">11.055</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-orange-100 p-4 rounded-xl text-orange-600 mr-4">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Özellik (Feature) Sayısı</p>
            <h3 className="text-xl font-bold text-slate-900">30</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart Comparison */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Model Performans Karşılaştırması (%)</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 30, left: 0, bottom: 45 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={75}
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={[94, 100]}
                  tickFormatter={(value) => `%${value}`}
                />

                <RechartsTooltip
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(value) => `%${Number(value).toFixed(2)}`}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />

                <Legend wrapperStyle={{ paddingTop: '20px' }} />

                <Bar dataKey="Accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="F1 Score" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Model Metrik Profilleri (Çok Yönlü Analiz)</h3>
          <p className="text-sm text-slate-500 mb-4">
            Daha okunabilir olması için bu grafikte en başarılı üç modelin Accuracy, Precision, Recall, F1 Score ve ROC-AUC değerleri karşılaştırılmıştır.
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />

                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fontSize: 12 }}
                />

                <PolarRadiusAxis
                  angle={30}
                  domain={[94, 100]}
                  tickFormatter={(value) => `%${value}`}
                />

                <Radar
                  name="Random Forest"
                  dataKey="Random Forest"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.18}
                />

                <Radar
                  name="Extra Trees"
                  dataKey="Extra Trees"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.18}
                />

                <Radar
                  name="Stacking Ensemble"
                  dataKey="Stacking Ensemble"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.18}
                />

                <Legend wrapperStyle={{ paddingTop: '20px' }} />

                <RechartsTooltip
                  formatter={(value) => `%${Number(value).toFixed(2)}`}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Confusion Matrix Section */}
      {bestConfusionMatrix && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Karmaşıklık Matrisi (Confusion Matrix) - En İyi Model
            </h3>
            <p className="text-sm text-slate-500">
              {bestModel} modelinin test veri setindeki gerçek tahmin başarı dağılımı.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-100 p-6 rounded-xl flex flex-col items-center justify-center border border-emerald-200 shadow-sm">
                <span className="text-sm font-semibold text-emerald-800 mb-1">Gerçek Güvenli (TN)</span>
                <span className="text-3xl font-black text-emerald-600">{bestConfusionMatrix[0][0]}</span>
                <span className="text-xs text-emerald-700 mt-2 text-center">Doğru Tahmin Edilen<br/>Meşru Siteler</span>
              </div>

              <div className="bg-red-50 p-6 rounded-xl flex flex-col items-center justify-center border border-red-200 shadow-sm">
                <span className="text-sm font-semibold text-red-800 mb-1">Yanlış Alarm (FP)</span>
                <span className="text-3xl font-black text-red-500">{bestConfusionMatrix[0][1]}</span>
                <span className="text-xs text-red-700 mt-2 text-center">Sahte Sanılan<br/>Meşru Siteler</span>
              </div>

              <div className="bg-orange-50 p-6 rounded-xl flex flex-col items-center justify-center border border-orange-200 shadow-sm">
                <span className="text-sm font-semibold text-orange-800 mb-1">Kaçırılan Sahte (FN)</span>
                <span className="text-3xl font-black text-orange-500">{bestConfusionMatrix[1][0]}</span>
                <span className="text-xs text-orange-700 mt-2 text-center">Güvenli Sanılan<br/>Sahte Siteler</span>
              </div>

              <div className="bg-red-100 p-6 rounded-xl flex flex-col items-center justify-center border border-red-300 shadow-sm">
                <span className="text-sm font-semibold text-red-900 mb-1">Gerçek Sahte (TP)</span>
                <span className="text-3xl font-black text-red-600">{bestConfusionMatrix[1][1]}</span>
                <span className="text-xs text-red-800 mt-2 text-center">Doğru Tespit Edilen<br/>Sahte Siteler</span>
              </div>
            </div>

            <div className="max-w-sm">
              <h4 className="font-semibold text-slate-800 mb-2">Bu tablo ne anlama geliyor?</h4>
              <p className="text-sm text-slate-600 mb-3">
                En iyi model olan <strong>{bestModel}</strong>, test verisi üzerinde <strong>{bestConfusionMatrix[1][1]}</strong> adet oltalama sitesini doğru şekilde tespit etmiştir.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                <li><span className="font-medium text-emerald-600">TN (True Negative):</span> Doğru şekilde güvenli olarak sınıflandırılan siteler.</li>
                <li><span className="font-medium text-red-600">TP (True Positive):</span> Doğru şekilde oltalama olarak sınıflandırılan siteler.</li>
                <li>FP ve FN değerlerinin düşük olması modelin hata payının düşük olduğunu gösterir.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Feature Importance */}
      {featureData.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Özellik Önemi (Feature Importance)</h3>
              <p className="text-sm text-slate-500 mt-1">
                {selectedFeatureModel} modelinin kararlarında en çok etkili olan ilk 10 özellik.
              </p>
            </div>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={featureData} margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <RechartsTooltip
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(value) => `%${Number(value).toFixed(2)}`}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="importance" fill="#6366f1" radius={[0, 4, 4, 0]} name="Etki Yüzdesi (%)">
                  {featureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index < 3 ? '#4f46e5' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelAnalysis;