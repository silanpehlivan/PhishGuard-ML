import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Home, List, BarChart2, MessageCircle, X } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Merhaba! Ben PhishGuard asistanı. Oltalama siteleri hakkında bilgi almak veya bir linki kontrol ettirmek için bana yazabilirsiniz.' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');

    // Gelişmiş chatbot mantığı
    setTimeout(() => {
      let botResponse = "Bu oldukça ilginç! Benim uzmanlığım siber güvenlik, şüpheli link analizleri ve internette güvende kalmanız üzerine odaklanmış durumda. İnternet güvenliğinizle, şüpheli bağlantılarla veya güvenilir site tavsiyeleriyle ilgili her türlü sorunuzu seve seve yanıtlarım.";
      const lowerInput = userMessage.toLowerCase();

      // Günlük Konuşmalar (Chit-chat)
      if (lowerInput.includes("nasılsın") || lowerInput.includes("ne haber") || lowerInput.includes("naber")) {
        botResponse = "Teşekkür ederim, sistemlerim %100 çalışıyor ve harika hissediyorum! Sizi oltalama saldırılarından korumak için buradayım. Siz nasılsınız?";
      } else if (lowerInput.includes("kimsin") || lowerInput.includes("adın ne") || lowerInput.includes("sen nesin")) {
        botResponse = "Ben PhishGuard Asistanıyım. Yapay zeka tabanlı bir siber güvenlik rehberiyim. Amacım internette daha güvende olmanızı sağlamak.";
      } else if (lowerInput.includes("ne işe yararsın") || lowerInput.includes("neler yapabilirsin") || lowerInput.includes("ne yaparsın")) {
        botResponse = "Şüpheli bağlantıları (URL) makine öğrenmesi modelleriyle analiz ederek oltalama olup olmadığını söylerim. Ayrıca size çeşitli konularda (bankacılık, alışveriş vb.) güvenilir siteler önerebilir ve siber güvenlik sorularınızı yanıtlayabilirim.";
      } else if (lowerInput.includes("teşekkür") || lowerInput.includes("sağol") || lowerInput.includes("harika")) {
        botResponse = "Rica ederim! Güvenliğiniz benim için her şeyden önemli. Başka bir sorunuz veya kontrol etmemi istediğiniz bir site olursa buradayım.";
      } else if (lowerInput.includes("hava durumu") || lowerInput.includes("şaka") || lowerInput.includes("film")) {
        botResponse = "Benim uzmanlığım siber dünya! Hava durumunu veya filmleri pek bilemem ama şifrenizin durumuyla ilgili çok iyi tavsiyeler verebilirim. Her zaman güçlü şifreler kullanmayı unutmayın!";
      } else if (lowerInput.includes("hayatın anlamı") || lowerInput.includes("aşk")) {
        botResponse = "Hayatın anlamı benim için interneti herkes için güvenli bir yer haline getirmek! 42 de olabilir tabii. Siber uzayda güvende olduğunuz sürece hayat çok daha güzel.";
      }

      // Güvenilir site / Yönlendirme mantığı (Direkt kelime eşleşmesi)
      if (lowerInput.includes("alışveriş") || lowerInput.includes("e-ticaret") || lowerInput.includes("market") || lowerInput.includes("trendyol") || lowerInput.includes("hepsiburada") || lowerInput.includes("amazon")) {
        botResponse = "Güvenilir alışveriş siteleri için buraya tıklayabilirsiniz: <br/>• <a href='https://www.amazon.com.tr' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Amazon Türkiye</a><br/>• <a href='https://www.hepsiburada.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Hepsiburada</a><br/>• <a href='https://www.trendyol.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Trendyol</a>";
      } 
      // Banka ve direkt markalar (yazım yanlışları dahil)
      else if (lowerInput.includes("banka") || lowerInput.includes("finans") || lowerInput.includes("kredi") || lowerInput.includes("ziraat") || lowerInput.includes("zirrat") || lowerInput.includes("garanti") || lowerInput.includes("iş bankası") || lowerInput.includes("akbank") || lowerInput.includes("yapı kredi") || lowerInput.includes("halkbank") || lowerInput.includes("vakıfbank")) {
        botResponse = "Bankacılık işlemleri için en çok kullanılan resmi siteler şunlardır (Linklere tıklayarak güvenle gidebilirsiniz):<br/>• <a href='https://www.ziraatbank.com.tr' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Ziraat Bankası</a><br/>• <a href='https://www.garantibbva.com.tr' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Garanti BBVA</a><br/>• <a href='https://www.isbank.com.tr' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Türkiye İş Bankası</a><br/>• <a href='https://www.akbank.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Akbank</a><br/>• <a href='https://www.yapikredi.com.tr' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Yapı Kredi</a><br/>• <a href='https://www.halkbank.com.tr' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Halkbank</a><br/>• <a href='https://www.vakifbank.com.tr' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>VakıfBank</a>";
      } 
      // Haber
      else if (lowerInput.includes("haber") || lowerInput.includes("gazete")) {
        botResponse = "Güncel ve güvenilir haberler için şu siteleri ziyaret edebilirsiniz:<br/>• <a href='https://www.aa.com.tr' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Anadolu Ajansı</a><br/>• <a href='https://www.trthaber.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>TRT Haber</a>";
      } 
      // Devlet
      else if (lowerInput.includes("devlet") || lowerInput.includes("resmi") || lowerInput.includes("hastane") || lowerInput.includes("mhrs")) {
        botResponse = "Resmi kamu işlemleri için '.gov.tr' uzantılı resmi siteleri kullanmalısınız:<br/>• <a href='https://www.turkiye.gov.tr' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>e-Devlet Kapısı</a><br/>• <a href='https://www.mhrs.gov.tr' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>MHRS (Hastane Randevu)</a>";
      } 
      // Yemek
      else if (lowerInput.includes("yemek") || lowerInput.includes("sipariş") || lowerInput.includes("yemeksepeti") || lowerInput.includes("getir")) {
        botResponse = "Güvenilir yemek siparişi siteleri (Linklere tıklayarak güvenle gidebilirsiniz):<br/>• <a href='https://www.yemeksepeti.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Yemeksepeti</a><br/>• <a href='https://getir.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Getir</a>";
      }
      // Bilgi & Araştırma (Vikipedi vb)
      else if (lowerInput.includes("bilgi") || lowerInput.includes("araştırma") || lowerInput.includes("vikipedi") || lowerInput.includes("wikipedia")) {
        botResponse = "Güvenilir bilgi kaynaklarına ulaşmak için:<br/>• <a href='https://tr.wikipedia.org' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Vikipedi (Türkçe)</a><br/>• <a href='https://www.tdk.gov.tr' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Türk Dil Kurumu (TDK)</a>";
      }
      // Seyahat & Bilet
      else if (lowerInput.includes("seyahat") || lowerInput.includes("bilet") || lowerInput.includes("uçak") || lowerInput.includes("otobüs") || lowerInput.includes("obilet") || lowerInput.includes("thy") || lowerInput.includes("pegasus")) {
        botResponse = "Güvenilir seyahat ve bilet siteleri:<br/>• <a href='https://www.obilet.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Obilet</a><br/>• <a href='https://www.turkishairlines.com/tr-tr/' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Türk Hava Yolları (THY)</a><br/>• <a href='https://www.flypgs.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Pegasus</a>";
      }
      // Video & Eğlence
      else if (lowerInput.includes("video") || lowerInput.includes("film") || lowerInput.includes("dizi") || lowerInput.includes("izle") || lowerInput.includes("youtube") || lowerInput.includes("netflix") || lowerInput.includes("exxen")) {
        botResponse = "Güvenilir video ve eğlence platformları:<br/>• <a href='https://www.youtube.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>YouTube</a><br/>• <a href='https://www.netflix.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Netflix</a><br/>• <a href='https://www.exxen.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Exxen</a>";
      }
      // Sosyal Medya
      else if (lowerInput.includes("sosyal") || lowerInput.includes("medya") || lowerInput.includes("iletişim") || lowerInput.includes("instagram") || lowerInput.includes("twitter") || lowerInput.includes("linkedin") || lowerInput.includes("facebook") || lowerInput.includes("tiktok")) {
        botResponse = "Popüler sosyal medya platformlarının resmi giriş bağlantıları:<br/>• <a href='https://www.instagram.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Instagram</a><br/>• <a href='https://twitter.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>Twitter (X)</a><br/>• <a href='https://www.linkedin.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>LinkedIn</a><br/>• <a href='https://www.tiktok.com' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800'>TikTok</a>";
      } 
      // Genel "öner" durumu
      else if (lowerInput.includes("öner") || lowerInput.includes("istiyorum") || lowerInput.includes("tavsiye") || lowerInput.includes("ver") || lowerInput.includes("yönlendir") || lowerInput.includes("link") || lowerInput.includes("git") || lowerInput.includes("sayfa")) {
        botResponse = "İstediğiniz konuda güvenilir siteler arıyorsanız her zaman adres çubuğunda kilit simgesi (HTTPS) olduğuna emin olun. Hangi konuda bir site aradığınızı daha spesifik yazarsanız (örneğin: alışveriş, banka, haber, seyahat, yemek, bilgi, vikipedi) size tıklanabilir resmi linkler verebilirim.";
      } 
      // Temel oltalama cevapları
      else if (lowerInput.includes("merhaba") || lowerInput.includes("selam")) {
        botResponse = "Merhaba! Size nasıl yardımcı olabilirim? Herhangi bir konuda güvenilir siteler önermemi isterseniz veya oltalama hakkında sorularınız varsa çekinmeyin.";
      } else if (lowerInput.includes("nedir") && lowerInput.includes("oltalama")) {
        botResponse = "Oltalama (Phishing), saldırganların güvenilir bir kurum veya kişi gibi davranarak kullanıcıların şifre, kredi kartı numarası gibi hassas bilgilerini ele geçirmeye çalışmasıdır.";
      } else if (lowerInput.includes("nasıl korunurum") || lowerInput.includes("korunma")) {
        botResponse = "E-posta veya mesajlardaki şüpheli linklere tıklamaktan kaçının. Kurumların resmi web sitelerine tarayıcıdan adresi kendiniz yazarak girin ve adres çubuğundaki kilit ikonunu kontrol edin.";
      } else if (lowerInput.includes("sahte")) {
        botResponse = "Sahte olabileceğinden şüphelendiğiniz bir siteyle karşılaşırsanız, lütfen ana sayfadaki 'Analiz Et' aracımızı kullanarak URL'yi test edin.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  const navItems = [
    { name: 'Ana Sayfa', path: '/', icon: <Home size={20} /> },
    { name: 'Sahte Siteler', path: '/sites', icon: <List size={20} /> },
    { name: 'Model Analizi', path: '/analysis', icon: <BarChart2 size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <ShieldAlert className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  PhishGuard
                </span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      {/* Chat Bot Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen && (
          <div className="bg-white rounded-2xl shadow-2xl mb-4 w-80 overflow-hidden border border-slate-100 flex flex-col h-96 animate-in slide-in-from-bottom-4 zoom-in-95">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center">
                <ShieldAlert size={20} className="mr-2" />
                <h3 className="font-semibold">PhishGuard Asistan</h3>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-4 bg-slate-50 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg, index) => (
                <div key={index} className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white self-end rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 self-start rounded-bl-none'}`}>
                  <p dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input 
                  type="text" 
                  placeholder="Bir soru sorun..." 
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50" disabled={!inputValue.trim()}>
                  Gönder
                </button>
              </form>
            </div>
          </div>
        )}
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    </div>
  );
};

export default Layout;
