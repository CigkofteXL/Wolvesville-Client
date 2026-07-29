
# 🐺 Wolvesville Automation & Client-Server Architecture Suite

> **Status:** ⚠️ ARCHIVED / DEPRECATED / UNFINISHED  
> *This repository contains research code, custom client implementations, server architecture, and automation tools. It is strictly unmaintained and shared for educational, reverse-engineering, and software architecture exploration purposes.*

---

## 📐 Genel Mimari ve Sistem Analizi (System Architecture)

Bu repo, **Wolvesville** web platformu üzerinde çoklu istemci yönetimi, otomatik lobi organizasyonu (Village Win), tersine mühendislik (reverse engineering) ve headless ağ otomasyonu süreçlerini incelemek amacıyla geliştirilmiş uçtan uca bir yazılım ekosistemidir.

Sistem, dağıtık mikroservis ve **Client-Server (C2)** mimarisine dayanmaktadır. Ana bileşenlerin birbiriyle etkileşimi ve veri akışı aşağıdaki gibidir:


```
              ┌──────────────────────────────────────────┐
              │      fsm.varietyshop.com.tr             │
              │   (Orchestrator & Task Scheduler)        │
              └────────────────────┬─────────────────────┘
                                   │
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼

```
```
┌────────────────────────────────────┐   ┌────────────────────────────────────┐
│      YSS (Server Engine)           │   │  api.varietyproxys.com.tr          │
│  - Matchmaking & Inventory Mgmt    │   │  - Proxy Pool & Dynamic Injection  │
│  - Host vs Guest Logic             │   └─────────────────┬──────────────────┘
└──────────────────┬─────────────────┘                     │
                   │                                       │
                   │ (Sockets & Commands)                  │ (modied_main.js && proxy)
                   ▼                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HBV (Halid Bin Velid Client)                          │
│                                                                             │
│   ┌──────────────────────────┐             ┌────────────────────────────┐   │
│   │   MainThread (Logic)     │ ◄─────────► │  Hooked Webpack UI / Redux │   │
│   └──────────────────────────┘             └────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 🚀 Ana Bileşenler ve İşlevleri

Ekosistem 3 ana katmandan oluşmaktadır:

### 1. Sunucu Katmanı (Server-Side)
* **YSS (Yavuz Sultan Selim):** 
  - .NET tabanlı merkezi Komut ve Eşleştirme (C2 & Matchmaking) sunucusudur.
  - Ağa bağlanan tüm HBV istemcilerini anlık olarak dinler ve envanterine kaydeder.
  - Bağlı hesapları **Host (Oda Sahibi)** ve **Guest (Misafir Bot)** olarak gruplandırır.
  - **1 Host + 7 veya 15 Guest** kombinasyonlarıyla otomatik *Village Win* odaklı özel odalar oluşturarak istemcileri aynı lobiye yönlendirir.

### 2. İstemci Katmanı (Client-Side)
* **HBV (Halid Bin Velid):**
  - Orijinal Wolvesville web istemcisinin modifiye edilmiş versiyonudur.
  - `MainThread` mantık katmanı üzerinden YSS sunucusundan gelen komutları işler; otomatik oyuna katılma, lobi aksiyonları ve çark çevirme gibi süreçleri yürütür.
  - Orijinal JS bundle'ı içerisindeki Redux state motoruna ve eylem işleyicilerine atılan **~60 farklı kanca (hook)** sayesinde DOM/UI seviyesinde tam kontrol sağlar.

* **Börü (Chrome Extension):**
  - Tarayıcı seviyesinde oyun akışını, rol dağılımlarını ve gece/gündüz döngülerini takip etmek/analiz etmek için geliştirilmiş bağımsız Chrome eklentisidir.

### 3. Yardımcı Modüller ve Deneysel Uygulamalar (`/snippets`)
* **`HBVNET`:** Tarayıcı arayüzü ve Webpack yükünden arındırılmış, sadece TCP/Socket ve token yönetimi gerçekleştiren, ~50 MB RAM tüketimli saf ağ istemcisi taslağı.
* **`api.varietyproxys.com.tr`:** İstemcilere dinamik proxy atayan ve en güncel HBV script paketlerini enjekte eden servis.
* **`fsm.varietyshop.com.tr`:** Görev zamanlama, lisanslama ve hesapların günlük XP/level limitlerini takip eden orkestra şefi.
* **`yeniceri.varietyshop.com.tr`:** Docker + Playwright altyapısıyla maksimum sayıda istemciyi izole şekilde çalıştırmayı hedefleyen otomasyon motoru.

---

## 🛠️ Depo Dizini ve Proje Yapısı

```text
.
├── Server/                   # YSS (Yavuz Sultan Selim) C# .NET C2 Sunucusu
│   ├── yss.varietyshop.com.tr.csproj
│   └── README.md             # Sunucu kurulum ve çalıştırma detayları
│
├── Client/                   # HBV (Halid Bin Velid) Modifiye İstemci
│   ├── main.js               # MainThread ve Hook entegreli JS dosyası
│   ├── README.md             # HBV güncelleme ve kanca atma rehberi
|   ├── Extension/            # HBV Chrome Eklentisi kaynak kodları
│   └── INJECTION_GUIDE.md    # Tarayıcıya inject etme yöntemleri
│                             
│
└── snippets/                 # Yarım kalan deneysel modüller ve PoC projeleri
    ├── HBVNET/               # Headless / Pure Socket istemcisi
    ├── api.varietyproxys/    # Proxy & Script Injection API
    ├── fsm.varietyshop/      # Orchestration & XP Tracker
    └── yeniceri/             # Docker & Playwright Instance Engine

```

---

## ⚡ Kurulum ve Çalıştırma Özet Rehberi

### Sunucuyu Ayağa Kaldırma (YSS)

Proje güvenlik ve kontrol gerekçesiyle **derlenmiş `.exe` barındırmaz**. Kaynak koddan derlenmelidir:

```bash
cd Server
dotnet build
dotnet run --project yss.varietyshop.com.tr.csproj

```

### İstemciyi Çalıştırma (HBV)

Modifiye `main.js` istemcisini hedef siteye yüklemek için en pratik yöntem Chrome **Local Overrides** özelliğidir:

1. `wolvesville.com` adresinde DevTools (`F12`) açın.
2. `Sources -> Overrides` sekmesinden bir yerel klasör yetkilendirin.
3. Sitenin çektiği `main.[hash].js` dosyasını `Save for override` diyerek bu repodaki güncel HBV `main.js` kodlarıyla değiştirin ve sayfayı yenileyin.

*(Detaylı alternatif teknikler için `Client/INJECTION_GUIDE.md` dosyasına göz atabilirsiniz.)*

---

## ⚖️ Yasal Uyarı & Sorumluluk Reddi (Disclaimer)

* **English:**
This codebase, including all modules, extensions, and documentation, is intended **strictly for educational, reverse-engineering, and software architecture research purposes**. The author has no official affiliation with Wolvesville or its parent companies. The use of automation, client modifications, or unauthorized tools violates the **Wolvesville Terms of Service (ToS)** and will result in account suspension or termination. The author assumes **no responsibility** for any misuse, financial loss, or account bans resulting from this software.
* **Türkçe:**
Bu depoda yer alan tüm kodlar, eklentiler ve belgelendirmeler **yalnızca eğitim, tersine mühendislik ve yazılım mimarisi araştırmaları amacıyla** sunulmuştur. Geliştiricinin Wolvesville veya bağlı markalarıyla hiçbir resmi bağı bulunmamaktadır. Otomasyon, istemci modifikasyonu veya üçüncü taraf araçların kullanımı Wolvesville Hizmet Şartları'nı (ToS) ihlal eder ve hesapların kalıcı olarak engellenmesine yol açabilir. Bu projenin kullanımından doğabilecek hiçbir doğrudan ya da dolaylı sorumluluk geliştirici tarafından kabul edilmez.

---

## 📜 Lisans

Bu proje [GPLV3 License](https://www.google.com/search?q=LICENSE) altında açık kaynak olarak paylaşılmıştır.

```

Tüm reponun, parçaların ve mimarinin bağlandığı en detaylı özet bu şekilde. Başka dokümante etmek istediğin bir şey varsa ya da kafana takılan bir yer kaldıysa yazman yeterli!

```
