
# 💉 HBV Client Injection Methods — Guide

> **Status:** ⚠️ ARCHIVED / EDUCATIONAL  
> *This document explains various technical methods for local JavaScript file overrides and injection on modern web browsers.*

Hazırladığınız veya modifiye ettiğiniz **HBV (`main.js`)** istemcisini Wolvesville web ortamına (`wolvesville.com`) aktarmak ve orijinal dosya yerine çalıştırmak için kullanabileceğiniz başlıca yöntemler aşağıda sıralanmıştır.

---

## 📌 Yöntem 1: Local Overrides (Yerel Yerine Koyma) — *En Kolay Ama Önerilmez*

Google Chrome, Chromium tabanlı tarayıcılar veya Brave/Edge gibi araçların dahili Geliştirici Araçları (DevTools) özelliğini kullanarak herhangi bir eklentiye ihtiyaç duymadan dosyayı değiştirebilirsiniz.

1. `https://www.wolvesville.com` adresini açın ve `F12` ile **DevTools**'u başlatın.
2. **Sources (Kaynaklar)** sekmesine geçin.
3. Sol paneldeki **Overrides (Yerine Koymalar)** alt sekmesini bulun *(Görünmüyorsa `>>` simgesine tıklayın)*.
4. **+ Select folder for overrides** seçeneğine tıklayarak bilgisayarınızdan boş bir klasör seçin ve tarayıcının izin isteğine onay verin.
5. **Page (Sayfa)** sekmesinden sitenin çektiği orijinal `main.[hash].js` dosyasını bulun.
6. Dosyaya sağ tıklayıp **Save for override (Yerine koymak için kaydet)** seçeneğine basın.
7. İndirdiğiniz/düzenlediğiniz kendi **HBV `main.js`** kodlarınızı bu dosyanın içine yapıştırıp kaydedin (`Ctrl + S`).
8. Sayfayı yenilediğinizde (`F5`) tarayıcı orijinal dosya yerine sizin yerel dosyanızı çalıştıracaktır.

---

## 📌 Yöntem 2: Chromium Extension (Tarayıcı Eklentisi / Declarative Net Request)

Kendi geliştireceğiniz ufak bir Chrome eklentisi (Manifest V3) ile ağ isteklerini yönlendirerek (redirect) injection yapabilirsiniz.

1. Yerel bir klasör oluşturup içine `manifest.json` dosyası ekleyin:
   ```json
   {
     "manifest_version": 3,
     "name": "HBV Injector",
     "version": "1.0",
     "permissions": ["declarativeNetRequest"],
     "host_permissions": ["*://*[.wolvesville.com/](https://.wolvesville.com/)*"],
     "declarative_net_request": {
       "rule_resources": [{
         "id": "ruleset_1",
         "enabled": true,
         "path": "rules.json"
       }]
     }
   }



2. Aynı klasöre `rules.json` dosyası oluşturun ve orijinal script isteğini yerel/uzak sunucunuzdaki HBV dosyasına yönlendirin:
```json
[
  {
    "id": 1,
    "priority": 1,
    "action": {
      "type": "redirect",
      "redirect": { "url": "http://localhost:8080/main.js" }
    },
    "condition": {
      "urlFilter": "[https://www.wolvesville.com/static/js/main.*.js](https://www.wolvesville.com/static/js/main.*.js)",
      "resourceTypes": ["script"]
    }
  }
]

```


3. `chrome://extensions` adresine gidin, **Geliştirici Modu**'nu açın ve **Paketlenmemiş öge yükle** diyerek klasörü seçin.

---

## 📌 Yöntem 3: Proxy / Network Interception (Mitmproxy, Fiddler, Charles)

Trafik araya girme (Man-in-the-Middle) yöntemlerini kullanarak ağ seviyesinde JS dosyasını değiştirebilirsiniz.

* **Fiddler / Charles Proxy:**
* AutoResponder (veya Map Local) özelliğini aktifleştirin.
* Kural olarak URL eşleşmesine `REGEX:.*wolvesville\.com/.*main.*\.js` girin.
* Yanıt (Response) kısmına kendi bilgisayarınızdaki `main.js` dosyasının yolunu gösterin.


* **Mitmproxy (Terminal / CLI):**
* Mitmproxy’nin `map_local` özelliğini çalıştırarak ilgili statik JS isteğini yerel diskteki dosya ile değiştirebilirsiniz:


```bash
mitmproxy --map-local "|[https://www.wolvesville.com/static/js/main.*.js](https://www.wolvesville.com/static/js/main.*.js)|/path/to/your/hbv/main.js"

```



---

## 📌 Yöntem 4: Userscript (Tampermonkey / Violentmonkey)

Eğer tüm `main.js` dosyasını değiştirmek istemiyorsanız ve sadece üzerine script çalıştırmak/kanca atmak istiyorsanız:

1. **Tampermonkey** eklentisini yükleyin.
2. Yeni bir script oluşturun ve `@run-at document-start` veya `document-body` aşamasında çalışacak şekilde ayarlayın.
3. DOM yüklenmeden önce global nesnelere (`window`) kancalarınızı enjekte edin veya `fetch`/`XMLHttpRequest` isteklerini intercept edin.

---

## 📌 Yöntem 5: Yerel Node.js / Express Reverse Proxy

Kendi yerel sunucunuz üzerinden oyunu proxy'leyerek dosyayı sunucu tarafında değiştirebilirsiniz.

1. Basit bir Node.js sunucusu kurun (`http-proxy-middleware` ile).
2. `wolvesville.com` adresine giden tüm trafiği proxy üzerinden geçirin.
3. İstek `/static/js/main.js` yoluna geldiğinde proxy araya girerek orijinal yanıt yerine yerel diskinizdeki HBV dosyasını istemciye servis etsin.

---

## ⚖️ Yasal Uyarı / Legal Disclaimer

Bu doküman yalnızca **ağ trafiği analizi, tarayıcı mekanizmaları ve istemci taraflı güvenlik araştırmaları** amacıyla hazırlanmıştır. Üçüncü taraf servislerde izinsiz kod çalıştırmak veya istemci kodlarını değiştirmek ilgili platformların **Hizmet Şartları'nı (ToS)** ihlal edebilir. Oluşabilecek sorumluluklar tamamen uygulayan kişiye aittir.

