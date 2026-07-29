const initPureNetworkClient = () => {
    // --- 1. ARAYÜZ (UI) KURULUMU ---
    document.body.innerHTML = '';
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background-color: #050508; color: #e0e0e0; font-family: 'Fira Code', monospace; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0a0f; } ::-webkit-scrollbar-thumb { background: #00ff66; border-radius: 3px; }
        
        #vs-header { background: #11111a; border-bottom: 1px solid #00ff66; display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; font-size: 14px; z-index: 10; }
        .glow-green { text-shadow: 0 0 5px #00ff66, 0 0 10px #00ff66; color: #00ff66; font-weight: bold; }
        .glow-cyan { color: #00e5ff; font-weight: bold; }
        .glow-pink { color: #ff0055; font-weight: bold; }

        #vs-terminal { background-color: #0b0b12; flex-grow: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
        .log-row { font-size: 13px; line-height: 1.4; word-wrap: break-word; }
        .log-time { color: #555; margin-right: 8px; }
        .log-INFO { color: #ccc; } .log-SUCCESS { color: #00ff66; } .log-WARN { color: #ffcc00; } .log-ERROR { color: #ff0055; } .log-SOCKET { color: #00e5ff; }

        .btn-panel { display: flex; gap: 10px; }
        .action-btn { background: transparent; border: 1px solid #00ff66; color: #00ff66; font-family: inherit; font-size: 12px; padding: 6px 12px; cursor: pointer; font-weight: 600; transition: 0.2s; }
        .action-btn:hover { background: rgba(0, 255, 102, 0.1); box-shadow: 0 0 8px #00ff66; }
        .action-btn:disabled { border-color: #555; color: #555; cursor: not-allowed; box-shadow: none; background: transparent; }

        #login-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #050508; z-index: 100; display: flex; justify-content: center; align-items: center; }
        .login-box { background: #0b0b12; border: 1px solid #00e5ff; padding: 40px; border-radius: 4px; box-shadow: 0 0 20px rgba(0, 229, 255, 0.1); width: 320px; text-align: center; }
        .login-input { width: 100%; padding: 10px; margin-bottom: 15px; background: #11111a; border: 1px solid #1f1f2e; color: #fff; font-family: inherit; font-size: 13px; outline: none; }
        .login-input:focus { border-color: #00e5ff; }
        .login-submit { width: 100%; padding: 10px; background: transparent; border: 1px solid #00e5ff; color: #00e5ff; font-family: inherit; font-weight: bold; cursor: pointer; }
        .login-submit:hover { background: rgba(0, 229, 255, 0.1); }
        .login-submit:disabled { border-color: #555; color: #555; cursor: not-allowed; }

        /* Turnstile Widget Alanı (UI/Görsel Doğrulama Alanı) */
        #cf-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; }
    `;
    document.head.appendChild(style);

    const appHTML = `
        <div id="login-overlay">
            <div class="login-box">
                <h2 class="glow-cyan" style="margin-top:0;">[ SYSTEM_LOGIN ]</h2>
                <input type="email" id="inp-email" class="login-input" placeholder="Wov E-Posta" autocomplete="off" />
                <input type="password" id="inp-pass" class="login-input" placeholder="Şifre" />
                <button id="btn-login" class="login-submit">SİSTEME BAĞLAN</button>
            </div>
        </div>
        <div id="vs-header">
            <div><span class="glow-green">YSS</span> <span style="color:#666">// NETWORK CORE</span></div>
            <div class="btn-panel">
                <button id="btn-fetch-rooms" class="action-btn" disabled>[ 1. ODALARI ÇEK ]</button>
                <button id="btn-join-room" class="action-btn" disabled>[ 2. ODAYA GİR (WSS) ]</button>
            </div>
            <div>STATUS: <span id="status-ind" style="color:#555">OFFLINE</span></div>
        </div>
        <div id="vs-terminal"><div id="log-container"></div></div>
        <div id="cf-container"></div>
    `;
    document.body.innerHTML = appHTML;

    // --- 2. MERKEZİ HAFIZA VE LOG SİSTEMİ ---
    const STATE = {
        idToken: "",
        refreshToken: "",
        firebaseIdToken: "", // 🔥 Firebase ID Token altyapısı eklendi
        cfJwt: "", 
        wsConnection: null,
        pingInterval: null
    };

    const API = {
        log: (msg, type = 'INFO') => {
            const container = document.getElementById('log-container');
            if (!container) return;
            if (container.children.length > 100) container.removeChild(container.firstChild);
            const row = document.createElement('div');
            row.className = 'log-row';
            const time = new Date().toISOString().split('T')[1].slice(0, 12);
            row.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-${type}">[${type}]</span> ${msg}`;
            container.appendChild(row);
            container.scrollTop = container.scrollHeight;
        }
    };

    // --- 3. ÜÇ KADEMELİ CLOUDFLARE VE FİRREBASE BAĞLANTISI ---
    
    // Modül 25643 ve 8916'dan sökülen anahtarlar:
    const COVERT_KEY_INVISIBLE = "0x4AAAAAAATLZS5RyqlMGxsL"; // Görsel olmayan arka plan anahtarı
    const COVERT_KEY_VISIBLE   = "0x4AAAAAAATLZulAZ6iRPZsU"; // Görsel koruma/Bulmaca anahtarı

    const loadTurnstile = () => new Promise(resolve => {
        if (window.turnstile) return resolve();
        const script = document.createElement('script');
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.onload = () => resolve();
        document.head.appendChild(script);
    });

    // 🔥 İstek Tipi ve Görsel Tercihe Göre Turnstile Tetikleyici Modül
    const generateCfJwt = async (idToken, targetAction = "api-client-auth", forceVisible = false) => {
        await loadTurnstile();
        const siteKey = forceVisible ? COVERT_KEY_VISIBLE : COVERT_KEY_INVISIBLE;
        
        API.log(`Cloudflare Jetonu Oluşturuluyor [Aksiyon: ${targetAction} | Görsel Kalkan: ${forceVisible}]`, "WARN");
        
        return new Promise((resolve, reject) => {
            const widgetId = window.turnstile.render('#cf-container', {
                sitekey: siteKey,
                action: targetAction,
                retry: "never",
                callback: async (cfToken) => {
                    try {
                        const res = await fetch("https://auth.api-wolvesville.com/cloudflareTurnstile/verify", {
                            method: "POST",
                            headers: { "Accept": "application/json", "Content-Type": "application/json" },
                            body: JSON.stringify({ token: cfToken, siteKey: siteKey, idToken: idToken })
                        });
                        const data = await res.json();
                        if (data.jwt) {
                            STATE.cfJwt = data.jwt;
                            API.log(`CF-JWT [${targetAction}] Başarıyla Doğrulandı ve Hafızaya Kazındı!`, "SUCCESS");
                            window.turnstile.remove(widgetId);
                            resolve(data.jwt);
                        } else {
                            reject("Doğrulama sunucusundan JWT dönmedi.");
                        }
                    } catch(e) { reject(e); }
                },
                'error-callback': (err) => {
                    API.log("Turnstile Koruma Hatası: " + err, "ERROR");
                    reject(err);
                }
            });
        });
    };

    // 🔥 Firebase Jeton Katmanı (Modül 12958 İçeriği)
    const fetchFirebaseIdToken = async () => {
        API.log("Firebase Güvenlik Katmanı sorgulanıyor (apiKey hırsızlığı engellendi)...", "WARN");
        try {
            // Modül 12958'deki initializeApp verilerinden sökülen ham Firebase Auth köprüsü
            const firebaseApiKey = "AIzaSyCH9qHx3eLCfXqodcKKBshE9BKfTLAioRo";
            const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${firebaseApiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: STATE.idToken, returnSecureToken: true })
            });
            const data = await res.json();
            if (data.idToken) {
                STATE.firebaseIdToken = data.idToken;
                API.log("Firebase ID Token başarıyla ağ katmanına enjekte edildi!", "SUCCESS");
                return data.idToken;
            }
        } catch(e) {
            API.log("Firebase Katmanında Atlanabilir Hata: " + e.message, "INFO");
        }
        return null;
    };

    // --- 4. AĞ AKIŞ KONTROLLERİ ---

    // A. GİRİŞ YAPMA VE SİSTEMİ AYAĞA KALDIRMA (İlk Girişte JWT Yenileme & Firebase Tetikleme)
    document.getElementById('btn-login').onclick = async () => {
        const email = document.getElementById('inp-email').value.trim();
        const password = document.getElementById('inp-pass').value.trim();
        const btn = document.getElementById('btn-login');
        
        if(!email || !password) return alert("E-posta ve şifre boş olamaz!");

        API.log("Wolvesville Kimlik Doğrulama Katmanına sızılıyor...", "INFO");
        btn.innerText = "BAĞLANTI KURULUYOR...";
        btn.disabled = true;

        try {
            // 1. Wolvesville Giriş İsteği
            const resAuth = await fetch("https://auth.api-wolvesville.com/players/signInWithEmailAndPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, locale: "en" })
            });
            const dataAuth = await resAuth.json();

            if (resAuth.ok && dataAuth.idToken) {
                STATE.idToken = dataAuth.idToken;
                STATE.refreshToken = dataAuth.refreshToken;
                API.log(`Wolvesville Ana idToken Alındı!`, "SUCCESS");

                // 2. Modül 4600 Mantığı: İlk girişte hemen Görsel Olmayan 'schedule-initial' jetonunu yenile!
                btn.innerText = "KORUMA AŞILIYOR (1/3)...";
                await generateCfJwt(STATE.idToken, "schedule-initial", false);

                // 3. Modül 25643 / 58709 Mantığı: 'api-client-auth' korumasını yenile!
                btn.innerText = "KORUMA AŞILIYOR (2/3)...";
                await generateCfJwt(STATE.idToken, "api-client-auth", false);

                // 4. Modül 12958 Mantığı: Firebase Jetonunu Al!
                btn.innerText = "KORUMA AŞILIYOR (3/3)...";
                await fetchFirebaseIdToken();

                // Tüm zincir kırılınca sistemi aç
                document.getElementById('login-overlay').style.display = 'none';
                document.getElementById('status-ind').className = 'glow-green';
                document.getElementById('status-ind').innerText = 'ONLINE';
                
                document.getElementById('btn-fetch-rooms').disabled = false;
                document.getElementById('btn-join-room').disabled = false;
                API.log("Ağ ve Kalkan doğrulama zinciri başarıyla tamamlandı. Hazırız!", "SUCCESS");

            } else {
                API.log(`Giriş Başarısız: ${dataAuth.message || resAuth.status}`, "ERROR");
                btn.innerText = "SİSTEME BAĞLAN";
                btn.disabled = false;
            }
        } catch (error) {
            API.log(`Ağ Zincir Hatası: ${error.message}`, "ERROR");
            btn.innerText = "SİSTEME BAĞLAN";
            btn.disabled = false;
        }
    };

    // B. ODALARI ÇEK (HTTP GET) - Modül 58709 'api-client-core' Korumalı
    document.getElementById('btn-fetch-rooms').onclick = async () => {
        API.log("Oyun listesi çekilmeden önce 'api-client-core' kalkanı dinamik olarak yenileniyor...", "WARN");
        try {
            // Modül 58709 m fonksiyonunun 'u = true' (createNewTurnstileJwt) şartı:
            await generateCfJwt(STATE.idToken, "api-client-core", false);

            const res = await fetch("https://game.api-wolvesville.com/api/public/game/custom", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${STATE.idToken}`,
                    "Cf-JWT": STATE.cfJwt,
                    "ids": "1"
                }
            });

            if (res.ok) {
                const data = await res.json();
                const odalar = data.openGames || data.customGames || data;
                
                if (odalar && odalar.length > 0) {
                    API.log(`Başarılı! ${odalar.length} aktif oda ağdan çekildi:`, "SUCCESS");
                    odalar.slice(0, 10).forEach(o => {
                        API.log(`[ ODA ] Adı: "${o.name}" | Oyuncu: ${o.playerCount}/${o.maxPlayerCount} | ID: ${o.id}`, "INFO");
                    });
                } else {
                    API.log("Aktif özel oda bulunamadı.", "INFO");
                }
            } else if (res.status === 403) {
                API.log("403 Hatası: Sunucu kalkan jetonunu (Cf-JWT) kabul etmedi. Tekrar oda aramayı dene.", "ERROR");
            } else {
                API.log(`Ağ Hatası! Status: ${res.status}`, "ERROR");
            }
        } catch (error) {
            API.log(`Sorgu Başarısız: ${error.message}`, "ERROR");
        }
    };

    // C. ODAYA GİR (SAF WEBSOCKET)
    document.getElementById('btn-join-room').onclick = () => {
        const roomId = prompt("Girmek istediğiniz Oda ID'sini yapıştırın:");
        if(!roomId) return;

        if (STATE.wsConnection) {
            STATE.wsConnection.close();
            clearInterval(STATE.pingInterval);
        }

        API.log(`Odaya [ ${roomId} ] WebSocket üzerinden sızılıyor...`, "WARN");

        STATE.wsConnection = new window.WebSocket("wss://game.api-wolvesville.com/socket.io/?EIO=4&transport=websocket");

        STATE.wsConnection.onopen = () => {
            API.log("Soket kanalı açıldı. Auth sinyali basılıyor...", "INFO");
            const authPayload = { token: `Bearer ${STATE.idToken}` };
            STATE.wsConnection.send("40" + JSON.stringify(authPayload));
        };

        STATE.wsConnection.onmessage = (event) => {
            const data = event.data;
            
            if (data.startsWith("0")) {
                const handshake = JSON.parse(data.slice(1));
                STATE.pingInterval = setInterval(() => {
                    if (STATE.wsConnection.readyState === 1) STATE.wsConnection.send("2");
                }, handshake.pingInterval || 25000);
            }
            
            if (data.startsWith("40")) {
                API.log("Soket Kimliği Doğrulandı! Lobiye giriliyor...", "SUCCESS");
                const joinPacket = ["host-custom-game-join", { gameId: roomId }];
                STATE.wsConnection.send("42" + JSON.stringify(joinPacket));
            }

            if (data.startsWith("42")) {
                try {
                    const parsed = JSON.parse(data.slice(2));
                    if (parsed[0] === 'game-joined') {
                        API.log(`🎉 Tebrikler Kanka! Zombi Odaya Sızdı. Game ID: ${parsed[1].gameId}`, "SUCCESS");
                    } else if (parsed[0] === 'lobby:chat-msg') {
                        API.log(`[SOHBET] ${JSON.stringify(parsed[1])}`, "INFO");
                    } else if (parsed[0] === 'disconnect') {
                        API.log(`Bağlantı kesildi!`, "ERROR");
                    } else {
                        API.log(`[GELEN] ${parsed[0]}`, "SOCKET");
                    }
                } catch(e) {}
            }

            if (data.startsWith("44")) {
                API.log(`Soket Reddedildi! Jeton geçersiz.`, "ERROR");
            }
        };

        STATE.wsConnection.onclose = () => {
            API.log("WebSocket kapandı.", "ERROR");
            clearInterval(STATE.pingInterval);
        };
        
        STATE.wsConnection.onerror = () => {
            API.log("Soket hatası oluştu!", "ERROR");
        };
    };
};

initPureNetworkClient();
idToken
: 
"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3b2x2ZXN2aWxsZSIsImlhdCI6MTc4Mjg4MDAzMCwiZXhwIjoxNzgyODgzNjMwLCJzdWIiOiJjMjk2MjFjMC1iYWM4LTQ0NzktYWJjYi1mYTM4NzQ3ZmU5MWUiLCJlbWFpbCI6Imh1c2V5aW5hbGlwcml3QGdtYWlsLmNvbSIsImVtYWlsVmVyaWZpZWQiOnRydWUsInByb3ZpZGVycyI6W3siaWQiOiJwYXNzd29yZCIsImVtYWlsIjoiaHVzZXlpbmFsaXByaXdAZ21haWwuY29tIn0seyJpZCI6Imdvb2dsZS5jb20iLCJlbWFpbCI6Imh1c2V5aW5hbGlwcml3QGdtYWlsLmNvbSJ9XSwicHJvdmlkZXJJZHMiOlsicGFzc3dvcmQiLCJnb29nbGUuY29tIl19.RO-rZ-q5bjyFfsyS2cS1wnHaSFW0gXyOBqQxBgBmx7G4atLiIyovg-AQD6zXlcByPyIUSFiG5klSYuM7kCUeW9uZ1dFrIanGLFCK1mZ89gVhMZEB9ieuK3tXDuy7vu9nNZhOxXCaVD9IQktu6n4nFpAY-0iVWULUm7RCpbL5FzIvVBhKMOrYlPM3XslGcxMY_6TiD5HuHz83l2FCH9PNqISY5XtEd4WFeFznU5nNB-6rB6UsD_jTeFdQj2o5KnPVkLs5GfLzVrTCy0ckP7RDAVCZ2MV8ozywFwgjtoU9whpnH2HQMyuHz56XBi56yWWikULT_00fLJ2VDZEFrRtARN8TZgpd0LTbjY_rY9K8AyW90WEoYiM8lF_QXD5jWFLHhIlyAV4xut_TFYSNDPkNZ3go--uDPWpxWUxtPMxZaZxCeIqlRLC6eNCH86bF2ZcsySYEKO1AOQqcvr55WptLHd3GXDnL9feMWpHt2yZ1jV1fUqMVYVfzdUuZJBJoSDpUsCJZlh0-Dvf8vxXPsFwNW6sJLZlud9AyKv9Z7v3kgfvUwfP3Luze2XMlX5HK-z897H73iV0v-1NSFviq3_k4wVRWA65z89AnK6rpM1pJA2Ty67P_a-l0RO9HgNVZ75Hes2ub6-qWgA1POtzXmOAhU8J_GRhlEzWi0wq4FOkmFSM"
siteKey
: 
"0x4AAAAAADl76c42d_fnB2_l"
token
: 
"1.OzkZy-eFeoWOFU5KZTntBHlfiR0hl3qvYJSaCb8nJpjvbR5HgulVcKWLwa6SPYiv1eKeA5hEmfkXF-fwTn_BnGzTeZDfXkGayp94sEGopvmOOfvtsI6F5DAvH8JZkbLKGAVupRmevGTwzH3-zVodGlqJcCHv-VFkJ5QqErwF9GCFcSmILCdAPLtWF9TJv6k6Dji0w1CFzFf-q6So8q5cljnMOU8cyvRCUyJjJh-v2bTRgpoI_M4fC7QmlLLsZeosD_yyS9poTNAv2nh1N3Oc4j3VsnJauQZeZXXLIbcNZVLLYGkl5tAmePHK8Y5Wuop8qbSlwldufSPz3p2poMDX-2zN5kAV1DSTrSc72tsjveccNcskdVSMyijJ05_b9Q048oK1LKR5T6KET0k5-oO_56kDI8aPwrE-YDpZogm_EieM6iC2nga2Q7qZXLphrIIkhUgg0e_QSvqGKmrh_4oIMowomoFuMl5jV77NhGXTZqAdplTspqWTGGvduiKz3WpIASGXY1jRRlVO7PjIWiStez3cUvtvgCZmY_lhAtb25yFAjLU91b8BfE8tsPDXkw6ww-x5hXCHVZrObgx1UPTNAB2Pjmu3oORtyQho88ZYB4gPKSoluQr3uPHpXWwgk25ZzN8RWfjCaxbTIlYL-DeBU8E1CcUkwi7zsymiKY00mfo.GL-ZO5RmDvYRcKVGNQ8npQ.3af6c288de7e1d48b87e5212fb2a2cc025250489d49b6ad149290ce2d6f53e6f"

