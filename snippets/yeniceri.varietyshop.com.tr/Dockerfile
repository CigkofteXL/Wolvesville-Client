# ========================================================
# 1. DERLEME AŞAMASI (SDK GÖVDESİ)
# ========================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0-noble AS build-env
WORKDIR /app

# Playwright tarayıcılarının indirileceği ortak klasörü set edelim kanka
ENV PLAYWRIGHT_BROWSERS_PATH=/app/ms-playwright

# Bağımlılıkları optimize etmek için önce csproj kopyala ve restore et kanka
COPY *.csproj ./
RUN dotnet restore

# Tüm kaynak kodları içeri al ve Release olarak paketle
COPY . ./
RUN dotnet publish -c Release -o out

# 🔥 PLAYWRIGHT TARAYICI ENJEKSİYONU: Chromium'u SDK aşamasında indirip klasöre gömüyoruz
RUN dotnet tool install --global Microsoft.Playwright.CLI
ENV PATH="${PATH}:/root/.dotnet/tools"
RUN playwright install chromium

# ========================================================
# 2. ÇALIŞTIRMA VE SİBER ZIRHLAMA AŞAMASI (RUNTIME)
# ========================================================
# 🔥 TUZAK FIX: Paket isimlerinin (libasound2t64) tam uyması için Ubuntu 24.04 (Noble) tabanlı imaj
FROM mcr.microsoft.com/dotnet/runtime:10.0-noble AS runtime
WORKDIR /app

# Derlenmiş projenin çıktılarını ve indirdiğimiz tarayıcıları içeri aktarıyoruz panpa
COPY --from=build-env /app/out .
COPY --from=build-env /app/ms-playwright /app/ms-playwright

# 🔥 PLAYWRIGHT AYARI: Çalışma zamanında Playwright'ın tarayıcıyı bulacağı siber hat
ENV PLAYWRIGHT_BROWSERS_PATH=/app/ms-playwright
ENV CHROMIUM_FLAGS="--no-sandbox --disable-setuid-sandbox"

# 🔥 SİBER KALKAN: Playwright ve Google Chrome'un Linux kabuğunda sorunsuz akması için gerekli tüm OS kütüphaneleri
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    gnupg \
    ca-certificates \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2t64 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

# Bağımsız bot kabuğu maça çıkmaya hazır kanka (Dual-Mode konteynır tetikleyicisi)
ENTRYPOINT ["dotnet", "yeniceri.varietyshop.com.tr.dll"]