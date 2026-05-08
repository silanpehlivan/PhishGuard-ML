import React, { useState } from 'react';
import { Search, ExternalLink, ShieldAlert, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_SITES = [
  { id: 1, url: 'http://secure-login-paypal.com.verify-info.net', target: 'PayPal', date: '2026-04-26', threatLevel: 'Yüksek', status: 'Aktif' },
  { id: 2, url: 'https://apple-id-support-recover.org', target: 'Apple', date: '2026-04-25', threatLevel: 'Yüksek', status: 'Engellendi' },
  { id: 3, url: 'http://netflix-billing-update-account.com', target: 'Netflix', date: '2026-04-25', threatLevel: 'Orta', status: 'Aktif' },
  { id: 4, url: 'http://ziraat-bankasi-mobil-onay.net', target: 'Ziraat Bankası', date: '2026-04-24', threatLevel: 'Kritik', status: 'İnceleniyor' },
  { id: 5, url: 'https://amazon-prime-reward-claim.co', target: 'Amazon', date: '2026-04-23', threatLevel: 'Düşük', status: 'Engellendi' },
  { id: 6, url: 'http://instagram-verify-badge-req.info', target: 'Instagram', date: '2026-04-22', threatLevel: 'Orta', status: 'Aktif' },
  { id: 7, url: 'http://e-devlet-kapisi-giris-odeme.com', target: 'e-Devlet', date: '2026-04-26', threatLevel: 'Kritik', status: 'Aktif' },
  { id: 8, url: 'https://trendyol-indirim-hediye-ceki.net', target: 'Trendyol', date: '2026-04-25', threatLevel: 'Yüksek', status: 'İnceleniyor' },
  { id: 9, url: 'http://garanti-bbva-sifre-yenileme.org', target: 'Garanti BBVA', date: '2026-04-24', threatLevel: 'Kritik', status: 'Engellendi' },
  { id: 10, url: 'https://twitter-blue-verify-free.com', target: 'Twitter', date: '2026-04-24', threatLevel: 'Düşük', status: 'Aktif' },
  { id: 11, url: 'http://steam-free-games-giveaway.co', target: 'Steam', date: '2026-04-23', threatLevel: 'Orta', status: 'Engellendi' },
  { id: 12, url: 'https://mhrs-randevu-sistemi-onay.info', target: 'MHRS', date: '2026-04-23', threatLevel: 'Kritik', status: 'Aktif' },
  { id: 13, url: 'http://is-bankasi-kampanya-katilim.net', target: 'İş Bankası', date: '2026-04-22', threatLevel: 'Yüksek', status: 'İnceleniyor' },
  { id: 14, url: 'https://facebook-security-check-login.com', target: 'Facebook', date: '2026-04-22', threatLevel: 'Orta', status: 'Engellendi' },
  { id: 15, url: 'http://hepsiburada-iphone-kazan.org', target: 'Hepsiburada', date: '2026-04-21', threatLevel: 'Yüksek', status: 'Aktif' },
  { id: 16, url: 'https://turkcell-fatura-odeme-sistemi.net', target: 'Turkcell', date: '2026-04-20', threatLevel: 'Yüksek', status: 'Engellendi' },
  { id: 17, url: 'http://ptt-kargo-takip-ucreti.com', target: 'PTT', date: '2026-04-20', threatLevel: 'Kritik', status: 'Aktif' },
  { id: 18, url: 'https://binance-account-verify-kyc.org', target: 'Binance', date: '2026-04-19', threatLevel: 'Kritik', status: 'Engellendi' },
  { id: 19, url: 'http://whatsapp-gold-download-free.info', target: 'WhatsApp', date: '2026-04-18', threatLevel: 'Orta', status: 'İnceleniyor' },
  { id: 20, url: 'https://thy-ucuz-bilet-kampanyasi.net', target: 'THY', date: '2026-04-17', threatLevel: 'Yüksek', status: 'Engellendi' }
];

const PhishingSites = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTarget, setFilterTarget] = useState('Tümü');

  const targets = ['Tümü', ...new Set(MOCK_SITES.map(s => s.target))];

  const filteredSites = MOCK_SITES.filter(site => {
    const matchesSearch = site.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTarget = filterTarget === 'Tümü' || site.target === filterTarget;
    return matchesSearch && matchesTarget;
  });

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tespit Edilen Oltalama Siteleri</h1>
        <p className="text-slate-500">Sistemimiz veya kullanıcılarımız tarafından yakın zamanda tespit edilmiş güncel sahte web siteleri.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="URL içinde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center w-full sm:w-auto">
            <Filter className="h-5 w-5 text-slate-400 mr-2" />
            <select
              className="block w-full sm:w-48 pl-3 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={filterTarget}
              onChange={(e) => setFilterTarget(e.target.value)}
            >
              {targets.map(target => (
                <option key={target} value={target}>{target}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-sm uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-medium">URL</th>
                <th className="px-6 py-4 font-medium">Hedef Kurum</th>
                <th className="px-6 py-4 font-medium">Tespit Tarihi</th>
                <th className="px-6 py-4 font-medium">Tehdit Seviyesi</th>
                <th className="px-6 py-4 font-medium text-right">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSites.length > 0 ? (
                filteredSites.map((site) => (
                  <tr key={site.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <ShieldAlert className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                        <span className="font-medium text-slate-700 truncate max-w-xs block">{site.url}</span>
                        <a href="#" className="ml-2 text-blue-500 hover:text-blue-700">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{site.target}</td>
                    <td className="px-6 py-4 text-slate-500">{site.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${site.threatLevel === 'Kritik' ? 'bg-red-100 text-red-800' : 
                          site.threatLevel === 'Yüksek' ? 'bg-orange-100 text-orange-800' : 
                          site.threatLevel === 'Orta' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-emerald-100 text-emerald-800'}`}>
                        {site.threatLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border
                        ${site.status === 'Aktif' ? 'bg-red-50 border-red-200 text-red-700' : 
                          site.status === 'Engellendi' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                          'bg-slate-100 border-slate-200 text-slate-700'}`}>
                        {site.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-lg text-slate-600 mb-2">Bu bağlantı bilinen oltalama veritabanımızda bulunamadı.</p>
                      <p className="text-sm text-slate-400 mb-6">Girdiğiniz adresin güvenliğinden emin değilseniz yapay zeka ile analiz edebilirsiniz.</p>
                      {searchTerm ? (
                        <Link 
                          to="/" 
                          state={{ analyzeUrl: searchTerm }}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                          Ana Sayfada Analiz Et
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      ) : (
                        <p className="text-sm text-slate-400">Arama kriterlerinize uygun sonuç bulunamadı.</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PhishingSites;
