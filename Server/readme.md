
# YSS (Yavuz Sultan Selim) — C2 & Matchmaking Management Server

> **Status:** ⚠️ ARCHIVED / UNFINISHED  
> *This project was developed for research and educational purposes. It is currently unmaintained.*

**YSS (Yavuz Sultan Selim)**, HBV (Halid Bin Velid) istemcilerinin (client) bağlandığı, istemci envanterini yöneten ve otomatik yetki/rol ayrımı yapan merkezi komut ve eşleştirme sunucusudur (C2 Server). 

Proje, çoklu istemci yönetimini, otomatik lobi (village win) organizasyonlarını ve hesap kasma süreçlerini otomatize etmek amacıyla tasarlanmıştır.

---

## 🎯 Projenin Amacı ve Temel Mantığı

YSS, kendisine soket/ağ üzerinden bağlanan tüm HBV istemcilerini anlık olarak tespit eder ve bir havuzda (envanter) toplar. Sunucu, bağlanan hesapları niteliklerine göre iki ana gruba ayırarak işler:

1. **Host (Oda Sahibi) Hesaplar:** Lobi oluşturma ve odayı yönetme yetkisine sahip hesaplar.
2. **Guest (Misafir/Bot) Hesaplar:** Oda sahibinin komutlarına göre hareket eden yardımcı hesaplar.

### 🔄 Otomatik Lobi & Eşleştirme Mantığı
Sunucu; **1 Oda Sahibi** hesabın yanına **7 veya 15 Guest hesap** atayarak otomatik olarak kasılma/kazanma odaklı (*Village Win*) odalar kurgular. Bağlı olan istemciler merkezi komutlarla aynı odaya yönlendirilir ve süreç insan müdahalesi olmadan işletilir.

> **💡 Potansiyel Kullanım:** Proje geliştirilmeye devam edilirse; sunucu bir domaine bağlanıp HBV istemcileriyle senkronize edilerek, ağa bağlanan hesapların tamamen otomatik bir şekilde seviye/puan kasması (AFK Farming) sağlanabilir.

---

## 🏗️ Mimari ve Öne Çıkan Özellikler

- **Merkezi İstemci Envanteri:** Bağlı tüm HBV istemcilerinin durumunu, rolünü ve aktifliğini anlık izleme.
- **Dinamik Rol Dağılımı:** Bağlanan istemcileri otomatik olarak `Host` ve `Guest` olarak sınıflandırma.
- **Lobi Yönetim Algoritması:** Mod durumuna göre (7 veya 15 misafirli) esnek oda eşleştirme mimarisi.
- **Ağ Senkronizasyonu:** İstemcilere eşzamanlı komut gönderme ve durum güncellemelerini alma.

---

## ⚠️ Güvenlik ve Çalıştırma Uyarısı (Build Required)

Bu depo **hazır derlenmiş bir yürütülebilir dosya (`.exe`) İÇERMEMEKTEDİR**. 

Herkesin doğrudan sunucu açmasını engellemek, kod güvenliğini sağlamak ve projeyi sadece geliştirmek/incelemek isteyen kişilerin erişimine sunmak amacıyla proje kaynak kodları halinde bırakılmıştır.

### 🛠️ Derleme ve Kurulum Adımları

Projeyi çalıştırmak için kaynak kodları kendi geliştirme ortamınızda derlemeniz gerekmektedir:

1. Depoyu klonlayın:
   ```bash
   git clone [https://github.com/CigkofteXL/Wolvesville-Client.git](https://github.com/CigkofteXL/Wolvesville-Client.git)

2. Proje dizinine gidin:
```bash
cd Wolvesville-Client/Server
```


3. Projeyi .NET CLI ile derleyin ve çalıştırın:
```bash
dotnet build
dotnet run --project yss.varietyshop.com.tr.csproj

```



---

## 📜 Yasal Uyarı / Legal Disclaimer

Bu proje yalnızca **eğitim, ağ mimarisi inceleme ve yazılım geliştirme araştırma amaçlarıyla** açık kaynak olarak paylaşılmıştır.

* Kodların hedef platformlarda (örneğin Wolvesville veya benzeri oyunlar) otomatik bot/hesap kasma amacıyla kullanılması ilgili platformların **Hizmet Şartları'nı (ToS)** ihlal edebilir.
* Projenin kişisel veya ticari kullanımından doğabilecek hesap engellemeleri, yetkisiz erişimler veya yasal sorumluluklar **tamamen kullanıcıya aittir**. Geliştirici hiçbir sorumluluk kabul etmez.

---

## 🛠️ Teknolojiler

* **Dil:** C#
* **Platform:** .NET Core / .NET SDK
* **Mimari:** Client-Server / C2 / Matchmaking Engine

---

## 📄 Lisans

Bu proje [GPLV3 License](https://www.google.com/search?q=LICENSE) altında dilediğiniz gibi incelenebilir ve geliştirilebilir Ancak Ticari Kullanımda açık kaynak yayınlanması zorunludur.
