# HBV (Halid Bin Velid) — Modified Wolvesville Client

> **Status:** ⚠️ ARCHIVED / UNFINISHED  
> *This project is developed for reverse engineering, client-hooking, and browser automation research.*

**HBV (Halid Bin Velid)**, Wolvesville web istemcisinin modifiye edilmesiyle oluşturulmuş özel bir oyun istemcisidir (Client). Primary görevi, **YSS (Yavuz Sultan Selim)** sunucusuna bağlanarak sunucudan gelen emirleri (oyuna katılma, çark çevirme, lobi aksiyonları vb.) otomatik olarak yerine getirmektir.

---

## 🏗️ İstemci Yapısı ve Mimarisi

HBV istemcisi **2 temel kısımdan** oluşmaktadır:

### 1. MainThread (Mantık & Ağ Katmanı)
* Oyunu oynayan, otomasyon aksiyonlarını gerçekleştiren ve YSS sunucusu ile anlık iletişim halinde olan bölümdür.
* Yeni bir özellik (otomasyon, yeni komutlar, çark çevirme vb.) ekleneceği zaman **%90 ihtimalle sadece bu kısım düzenlenir**.

### 2. Hooked Webpack Client (Kanca Atılmış Arayüz)
* Wolvesville’in orijinal istemci koduna `MainThread`'in enjekte edilmesi ve oyuna müdahale edebilmesi için kancaların (function hooks) atıldığı kısımdır.
* Orijinal kod içerisinde `Ctrl + F` ile **`HBV`** kelimesini aratarak atılmış kancaları (yaklaşık 54-60 farklı noktada) inceleyebilirsiniz.
* Bu kancalar çoğunlukla oyunun **Redux** state motoruna ve eylem işleyicilerine (action creators) müdahale eder.

---

## 🛠️ Modifiye İstemciyi Sıfırdan Oluşturma & Güncelleme Rehberi

Wolvesville yaklaşık **15 günde bir (veya hata düzeltmelerine göre)** güncelleme almaktadır. Kendi güncel HBV istemcinizi oluşturmak için aşağıdaki adımları izleyebilirsiniz:

### Adım 1: Orijinal `main.js` Dosyasını İndirme
1. Tarayıcınızdan `wolvesville.com` adresine gidin.
2. `F12` ile Geliştirici Araçları'nı açıp **Sources (Kaynaklar)** sekmesine geçin.
3. Sitenin yüklediği ana JavaScript dosyasını (`main.[hash].js`) bulun ve bilgisayarınıza indirin.

### Adım 2: Kod Biçimlendirme & Telemetri Temizliği
1. İndirdiğiniz dosyayı okunanabilir ve düzenlenebilir hale getirmek için VS Code eklentisi veya bir *JS Formatter/Unminify* aracı ile biçimlendirin.
2. Dosya içerisindeki **Sentry / Telemetry** kod bloklarını temizleyin.
3. Hazırladığınız veya depoda yer alan **MainThread** kod bloğunu bu kısma yapıştırın.

### Adım 3: Kancaları (Hooks) Yeni Dosyaya Aktarma
Her güncellemede Webpack tarafında fonksiyon ve değişken isimleri (örneğin `Io`, `m.Tp`, `Pa.UL`) rastgele değiştirilir. Ancak fonksiyonların içindeki sabit metinler veya spesifik kod yapıları değişmez.

Eski dosyadaki kancaları bulmak için sabitleşmiş kod bloklarını `Ctrl + F` ile aratmalısınız:

> **Örnek Kanca Arama Metodu:**
> Oyun join fonksiyonunu bulmak için kod içerisinde `modalActionCreators.setIsLoadingDeprecated` yapısını aratın:
> 
> ```javascript
> },//HBV oyun join
> Io = window.oyunJoinCustom = (e, t, a) => async (s, i) => {
>   (m.Tp.avatarItems(i()) || (await s(m.mF.getAllPurchasableItems())),
>     a && (await Pa.UL.setItem(io, JSON.stringify({ password: a }))),
>     await s(po()));
>   const n = await s(mo());
>   if (!n) return;
>   a && s(v.modalActionCreators.setIsLoadingDeprecated(!0));
>   const o =
> ```
> 
> **Mantık:** Orijinal koddaki `Io = () => ...` atanmış anonim fonksiyonu, `Io = window.oyunJoinCustom = () => ...` şeklinde küresel (`window`) alana çekerek `MainThread`'in bu fonksiyona dışarıdan erişip tetiklemesini sağlıyoruz.

---

## 💡 İpuçları & Önemli Bilgiler

* **Güncelleme Yapmadan Kullanım:** Güncelleme yapmasanız bile eski dosya arka planda YSS ile iletişim kurmaya ve oyuna girmeye devam edebilir. Ancak Webpack dynamic import (chunk) yapısı değiştiği için görsel arayüz yüklenme ekranında kalabilir veya beyaz ekran verebilir. HBV işlevsel olarak çalışmaya devam eder.
* **Minify / Performans (RAM Kullanımı):** Biçimlendirilmiş kod düzenleme kolaylığı sağlar. Ancak yayınlamadan önce koda tekrar **Minify** işlemi yaparsanız tarayıcı RAM kullanımı ciddi oranda düşecek ve istemci çok daha performanslı çalışacaktır.
* **Sunucu Uyumsuzluğu:** Farklı sunucularda veri paketleri (socket/HTTP payloads) farklılık gösterebilir. Bu yüzden HBV'yi bağlayacağınız sunucunun protokolüne göre özelleştirmeniz önerilir.
* **Saf Ağ İstemcisi (Pure Network Client):** İstemciyi tamamen arayüzden (DOM/UI) arındırıp sadece saf network trafiği ile çalıştırmak isterseniz, `snippets/HBVNET` klasöründeki taslağı inceleyebilirsiniz.

---

## ⚖️ Yasal Uyarı / Legal Disclaimer

Bu proje yalnızca **eğitim, tersine mühendislik (reverse engineering) ve istemci mimarileri inceleme amaçlarıyla** açık kaynak olarak sunulmuştur. 

* HBV kullanımı **Wolvesville Hizmet Şartları'nı (ToS)** ihlal eder ve hesabınızın engellenmesine (ban) yol açabilir.
* Bu yazılımın kullanımından doğabilecek her türlü sorumluluk kullanıcıya aittir. Geliştirici hiçbir sorumluluk kabul etmez.

---

## 📜 Lisans

Distributed under the [GPLV3 License](LICENSE).
