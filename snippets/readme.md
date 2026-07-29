# 🧩 Snippets & Experimental Modules

> **Status:** ⚠️ ARCHIVED / EXPERIMENTAL  
> *This folder contains unfinished prototypes, code snippets, architectural drafts, and proof-of-concept (PoC) modules. They are published purely for inspiration, research, and educational purposes.*

Bu klasör altında yer alan projeler ve kod blokları, otomasyon ekosisteminin farklı aşamalarında geliştirilmiş ancak çeşitli sebeplerle yarım bırakılmış **deneysel modüllerden** oluşmaktadır. Kodlar tam olarak stabil çalışmayabilir veya hata içerebilir; geliştirme yapmak ya da mimari fikir edinmek isteyenler için referans olarak sunulmuştur.

---

## 🛠️ Klasör İçeriği ve Proje Mimarileri

### ⚡ `HBVNET` (Pure Network & Socket Client)
- **Açıklama:** HBV istemcisinin tarayıcı arayüzünden (DOM/UI), AFrame ve Webpack bağımlılıklarından tamamen arındırılmış **saf ağ (network) versiyonudur**.
- **Öne Çıkan Özellik:** Sadece `Login`, `Socket` haberleşmesi ve `Token` yönetimi işlemlerini yürütür.
- **Performans:** Tarayıcı motoru çalıştırmadığı için **yaklaşık 50 MB RAM** gibi son derece düşük bir kaynak tüketimine sahiptir. İleri seviye optimizasyon ve headless otomasyonlar için tasarlanmış bir PoC çalışmasıdır.

### 🌐 `api.varietyproxys.com.tr` (Proxy & Injection API)
- **Açıklama:** Bağlanan istemcilere ve botlara dinamik olarak IP/Proxy ataması yapan ve modifiye edilmiş `main.js` (HBV) istemcisini inject eden mikroservis API'sidir.
- **Öne Çıkan Özellik:** Hesapların IP engellerine takılmasını önlemek için proxy havuzunu yönetir ve istemcilerin güncel script paketleriyle ayağa kalkmasını sağlar.

### 🎼 `fsm.varietyshop.com.tr` (Orchestrator & Task Scheduler)
- **Açıklama:** Sistemdeki tüm botları, sunucuları ve yan servisleri tek bir merkezden yöneten **orkestra şefi (master controller)** mimarisidir.
- **Sorumlulukları:**
  - Zamanlanmış görev (Task Scheduling) yönetimi.
  - Abonelik ve lisans kontrolleri.
  - Hesapların günlük XP/Seviye limitlerinin takibi ve sınır aşıldığında hesapların dinlenmeye çekilmesi.

### ⚔️ `yeniceri.varietyshop.com.tr` (High-Scale Instance Engine)
- **Açıklama:** Docker, Proxy rotasyonu ve Playwright kombinasyonu ile donatılmış yüksek ölçekli hesap açma/çalıştırma motorudur.
- **Amacı:** Tek bir fiziksel cihaz üzerinde kaynakları maksimum verimle kullanarak, donanım limitleri elverdiğince fazla bağımsız istemci (instance) açmayı hedefler.

---

## 💡 Geliştiricilere Notlar

- Bu klasördeki kodlar tak-çalıştır (plug-and-play) şeklinde değildir; derleme veya çalıştırma aşamasında bağımlılık eksikleri ya da kırık fonksiyonlar ile karşılaşabilirsiniz.
- Ağ protokollerini, headless otomasyon mantığını ve sistem orchestrator yapılarını incelemek isteyen geliştiriciler için güçlü fikirler sunar.

---

## ⚖️ Yasal Uyarı / Legal Disclaimer

Bu klasördeki tüm araç ve kod parçacıkları yalnızca **eğitim, sistem mimarisi analizi ve yazılım araştırmaları** amacıyla paylaşılmıştır. Herhangi bir platformun Hizmet Şartları'nı (ToS) ihlal edecek şekilde kullanılması durumunda tüm sorumluluk kullanıcıya aittir.
