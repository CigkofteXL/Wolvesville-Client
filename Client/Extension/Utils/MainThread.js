;(function () {
  
  //#region OPTİMİZASYON VE KORUMA
  console.log('Halid bin velid (r.a) feth etti');
  var NATIVE_SOCKET = null;
  const SafWebSocketSend = window.WebSocket.prototype.send;

  //#endregion

  //#region GLOBAL DEĞİŞKENLER

    var AUTHTOKENS = {
      idToken: '',
      refreshToken: '',
      'Cf-JWT': '',
    }
    var PLAYER = undefined
    var INVENTORY = undefined
    var PLAYERS = []
    var ROLE = undefined
    var GAME_STATUS = undefined
    var GOLD_WHEEL_SPINS_COUNTER = 0
    var GOLD_WHEEL_SILVER_SESSION = 0
    var TOTAL_XP_SESSION = 0
    var TOTAL_UP_LEVEL = 0
    var GAME_STARTED_AT = 0
    var GAME_ID = undefined
    var SERVER_URL = undefined
    var GAME_SETTINGS = undefined
    var DEADS = []
    let YSS_SOCKET = null;
    let YSS_RECONNECT_TIMER = null;
    let loopCounter = 0
    let ISHOST = false;



  //#endregion
  
  //#region YARDIMCI FONKSİYONLAR
  const randomdelay = (bankoBekleme = 0, rastgelePay = 600) => {
      return bankoBekleme + Math.floor(Math.random() * rastgelePay);
  }


  const generatePid = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const delay = (time = 500) =>
    new Promise((r) => {
      setTimeout(r, time)
  })

  const getHeaders = () => ({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${AUTHTOKENS.idToken}`,
    'Cf-JWT': `${AUTHTOKENS['Cf-JWT']}`,
    ids: 1,
  })

  const masterLoop = () => {
    loopCounter++

    if (loopCounter % 100 === 0) { // 100 saniyede bir temizlik
      // Tarayıcıya "kullanılmayan ne varsa çöpe at" emri ver
      if (window.gc) window.gc(); 
      console.log("🧹 [HBV] RAM Çöpçüsü devrede!");
  }

    if (loopCounter >= 60) loopCounter = 0
  }
  //#endregion
 
  //#region C# KÖPRÜSÜ (YSS SOCKET)

  const connectToYSS = () => {
      // Zaten bağlıysa veya bağlanmaya çalışıyorsa dur
      if (YSS_SOCKET && (YSS_SOCKET.readyState === WebSocket.OPEN || YSS_SOCKET.readyState === WebSocket.CONNECTING)) {
          return;
      }

      console.log("🔌 [YSS] C# Merkezine bağlanılıyor... (ws://localhost:9090)");
      
      // Tarayıcının orijinal WebSocket'ini kullanarak C# sunucumuza bağlanıyoruz
      // Biz yukarıda OrigWebSocket kopyasını almıştık ama window.WebSocket üzerinden yapsak bile
      // kendi kancamızda sadece 'api-wolvesville' geçenleri NATIVE_SOCKET'e atadığımız için bu bağlantı karışmaz.
      YSS_SOCKET = new window.WebSocket('ws://localhost:9090');

    YSS_SOCKET.onopen = () => {
          console.log("%c🟢 [YSS] Merkezle bağlantı KURULDU!", "color: #00FF00; font-weight: bold;");
          if (YSS_RECONNECT_TIMER) clearTimeout(YSS_RECONNECT_TIMER);

          // 🔥 YENİ: Bağlanır bağlanmaz C#'a kimlik fırlat! (Nicki yoksa geçici isim ver)
          let zombiNicki = (typeof PLAYER !== 'undefined' && PLAYER && PLAYER.username) ? PLAYER.username : "Isimsiz_Zombi_" + Math.floor(Math.random() * 1000);
          
          const payload = {
              type: "STATUS_REPORT",
              botName: zombiNicki,
              status: "JUST_CONNECTED"
          };
          YSS_SOCKET.send(JSON.stringify(payload));
          console.log(`🐺 [DEBUG] C#'a ilk rapor fırlatıldı: ${zombiNicki}`);
      };

    YSS_SOCKET.onmessage = (event) => {
          try {
              // C#'tan gelen saf metni objeye çeviriyoruz. Örn: { action: "SET_SLOT", data: 5 }
              const cmd = JSON.parse(event.data); 

              // Gelen emrin adına göre JS içindeki kendi fonksiyonlarımızı tetikliyoruz
              switch (cmd.action) {
                  case "JOIN_ROOM":
                      Join(cmd.data); 
                      break;
                  case "CREATE_ROOM":
                      Create(cmd.data);
                      break;
                  case "LEAVE_ROOM":
                      Leave();
                      break;
                  case "CHANGE_SETTINGS":
                      ChangeRoomSettings(cmd.data);
                      break;
                  case "START_GAME":
                      Start();
                      break;  
                  case "SET_SLOT":
                      SetSlot(cmd.data); 
                      break;
                  case "VOTE":
                      Vote(cmd.data); 
                      break;
                  case "USE_SKILL":
                      UseSkill(cmd.data);
                      break;
                  case "SEND_CHAT":
                      SendMessage(cmd.data);
                      break;
                  case "SPIN_GOLD":
                      SpinGoldWheel();
                      break;
                  case "SPIN_ROSE":
                      SpinRoseWheel();
                      break;
                  case "OPEN_LOOTBOX":
                      OpenLootBox(cmd.data);
                      break;
                     case "SEND_ROSE":
                      SendRose(cmd.data);
                      break;
                  case "SEND_BOUQUET":
                      SendBouquet(cmd.data);
                      break;
                  case "REFRESH":
                      window.location.reload();
                      break;
                      // 🔥 YENİ: C# "Durum Raporu Ver" dediğinde anlık bilgileri toplayıp geri yollar
                  case "GET_REPORT":
                      if (YSS_SOCKET.readyState === WebSocket.OPEN) {
                          const payload = {
                              type: "STATUS_REPORT",
                              botName: typeof PLAYER !== 'undefined' && PLAYER ? PLAYER.username : "BilinmeyenAsker",
                              status: GAME_STATUS || "LOBBY",
                              gameId: GAME_ID || "",
                              role: typeof ROLE !== 'undefined' && ROLE ? ROLE.id : "Belli Degil",
                              isDead: typeof PLAYER !== 'undefined' && DEADS.includes(PLAYER.id)
                          };
                          
                          YSS_SOCKET.send(JSON.stringify(payload));
                      }
                      break;
                  default:
                      console.warn(`[HBV] Bilinmeyen YSS Emri: ${cmd.action}`);
              }
          } catch (e) {
              console.error("🐺 [YSS HATA] Gelen emir çözülemedi:", e);
          }
      };

      YSS_SOCKET.onclose = () => {
          console.log("🔴 [YSS] Merkezle bağlantı KOPTU. 3 saniye sonra tekrar denenecek...");
          YSS_RECONNECT_TIMER = setTimeout(connectToYSS, 3000);
      };

      YSS_SOCKET.onerror = (error) => {
          console.log("⚠️ [YSS] Soket Hatası:", error);
      };
  };



  const reportToYSS = (statusStr, extraData = "") => {
      if (YSS_SOCKET !== undefined) {
          const payload = {
              type: "STATUS_REPORT",
              botName: typeof PLAYER !== 'undefined' && PLAYER ? PLAYER.username : "BilinmeyenAsker",
              status: statusStr,
              gameId: typeof GAME_ID !== 'undefined' ? GAME_ID : "",
              role: typeof ROLE !== 'undefined' && ROLE ? ROLE.id : "Belli Degil",
              isDead: typeof PLAYER !== 'undefined' && typeof DEADS !== 'undefined' ? DEADS.includes(PLAYER.id) : false,
              extra: extraData // C#'a ekstra bilgi lazımsa (Ölüm sebebi vs.)
          };
          YSS_SOCKET.send(JSON.stringify(payload));
          console.log(`🐺 [YSS -> Rapor] ${statusStr} | Ekstra: ${extraData}`);
      }
  };


  //#endregion 
  
  //#region AĞ DİNLEYİCİLERİ (HOOKS)

     
  const requestsToCatch = {
    'https://auth.api-wolvesville.com/players/signUpWithEmailAndPassword': (data) => {
      if (data?.idToken) {
        AUTHTOKENS.idToken = data?.idToken
        AUTHTOKENS.refreshToken = data.refreshToken
      }
    },
    'https://auth.api-wolvesville.com/players/createIdToken': (data) => {
      if (data?.idToken) {
        AUTHTOKENS.idToken = data?.idToken
        AUTHTOKENS.refreshToken = data.refreshToken
      }
    },
    'https://auth.api-wolvesville.com/cloudflareTurnstile/verify': (data) => {
      if (data.jwt) {
        AUTHTOKENS['Cf-JWT'] = data.jwt || ''
        console.log('🛡️ Cloudflare token intercepted')
      }
    },
    'https://core.api-wolvesville.com/players/meAndCheckAppVersion': (data) => {
      if (data.player) {
        const { username, level } = data.player
        !PLAYER && console.log(`👋 ${username} (lvl ${level})`)
        PLAYER = data.player
      }
    },
    'https://core.api-wolvesville.com/inventory/lootBoxes/': (data) => {
      if (data.items?.length) {
        let silver = 0
        let loots = []
        data.items.forEach((item) => {
          loots.push(item.type)
          if (item.duplicateItemCompensationInSilver) {
            silver += item.duplicateItemCompensationInSilver
          } else if (item.type === 'SILVER_PILE') {
            silver += item.silverPile.silverCount
          }
        })
        INVENTORY.silverCount += silver
        console.log(`🎁 ${loots.join(', ')} and 🪙${silver}`)
      }
    },
    'https://core.api-wolvesville.com/inventory?': (data, url) => {
      if (data.silverCount) {
        INVENTORY = data
      }
      if (data.lootBoxes !== undefined) {
        const { lootBoxes } = data
        if (lootBoxes?.length) {
          const cardBoxes = lootBoxes.filter((v) => v.event === 'LEVEL_UP_CARD').length
          const tmp = cardBoxes ? `(including ${cardBoxes} role cards)` : ''
          console.log(`🎁 ${lootBoxes.length} boxes available ${tmp}`)
        }
      }
    },
    'https://game.api-wolvesville.com/api/public/game/running': (data) => {
      return new Response(JSON.stringify({ running: false }))
    },
    'https://core.api-wolvesville.com/rewards/goldenWheelSpin': (data) => {
      if (data?.length) {
        const winner = data.find((v) => v.winner)
        if (winner) {
          const tmp = winner.silver > 0 ? `🪙${winner.silver}` : winner.type
          console.log(`${tmp} looted from 🌹 wheel`)
          INVENTORY.silverCount += winner.silver
          INVENTORY.roseCount -= 30
        }
      }
    },
    'https://core.api-wolvesville.com/rewards/wheelRewardWithSecret/': (data) => {
      if (data.code) {
        console.log(`Error: You probably hit the spins limit for today ${JSON.stringify(data)}`, true, 'color: #ff603b;')
      } else if (data?.length) {
        const winner = data.find((v) => v.winner)
        if (winner) {
          const tmp = winner.silver > 0 ? `🪙${winner.silver}` : winner.type
          INVENTORY.silverCount += winner.silver
          GOLD_WHEEL_SPINS_COUNTER += 1
          GOLD_WHEEL_SILVER_SESSION += winner.silver
          PLAYER.silverCount += winner.silver
          console.log(
            `#${GOLD_WHEEL_SPINS_COUNTER}: ${tmp} looted from 🪙 wheel (session: 🪙${GOLD_WHEEL_SILVER_SESSION})`
          )
        }
      }
    },
    'https://core.api-wolvesville.com/rewards/wheelItems/v2': (data) => {
      if (data.nextRewardAvailableTime) {
      } else {
      }
    },
  }


 const messagesToCatch = {
      'game-joined': (data) => {
          GAME_ID = data.gameId
          console.log("game-joined tetiklendi : " + GAME_ID)
          if(ISHOST === true) {YSS_SOCKET.send(GAME_ID ? JSON.stringify({ type: "ROOM_CREATED", gameId: GAME_ID }) : null);}
      },
      'lobby:chat-msg': (data) => {
        if (data && data.msgKey === 'player-joined') {
            const katilanNick = data.msgArgs?.['player-username'] || "BilinmeyenAsker";
            console.log(`👤 [HBV] Sistem Mesajı: Odaya biri katıldı -> ${katilanNick}`);
            if (YSS_SOCKET && YSS_SOCKET.readyState === WebSocket.OPEN) {
                YSS_SOCKET.send(JSON.stringify({
                    type: "PLAYER_JOINED_LOBBY",
                    username: katilanNick,
                    gameId: GAME_ID || ""
                }));
            }
        }
      },
      'game-started': (data) => {
          GAME_STATUS = 'started';
          setRole(data.role);
          PLAYERS = data.players;
          // Hafıza Sıfırlama
          DEADS = [];
          let myGrid = PLAYERS.find(p => p.id === PLAYER?.id)?.gridIdx || 0;
          window.dispatchEvent(new CustomEvent('HBV_YENI_OYUNCULAR', { detail: PLAYERS }));
         reportToYSS("PLAYING", JSON.stringify({ role: ROLE?.id, grid: myGrid, team: ROLE?.team, playerId: PLAYER?.id }));
      },
      'game-cupid-lover-ids-and-roles': (data) => {
          reportToYSS("LOVERS_SET", JSON.stringify({ loverIds: data.loverPlayerIds }));
      },
      'game-night-started': () => {
          reportToYSS("NIGHT_STARTED", "");
      },
      'game-day-voting-started': () => {
          reportToYSS("DAY_VOTING", "");
      },
      'game-werewolves-set-roles': (data) => {
       // 🔥 ÇÖZÜLDÜ: Yavru kurtun kendi kendine 'Who?' yazma otonomisi silindi!
        // Karargahın haberi olsun diye sadece raporluyoruz.
        reportToYSS("WOLVES_SET", "");
      },
      'game-players-killed': (data) => {
          data['victims'].forEach((victim) => {
              const player = PLAYERS.find((v) => v?.id === victim.targetPlayerId);
              if (player) {
                  if (!DEADS.includes(player.id)) DEADS.push(player.id);
                  if (player.id === PLAYER?.id) {
                     reportToYSS("DEAD", JSON.stringify({ targetId: victim.targetPlayerId, cause: victim.cause }));
                  }
              }
          });
      },
      'game-reconnect-set-players': (data) => {
          PLAYERS = Object.values(data);
          PLAYERS.forEach((player) => {
              if (!player.isAlive && !DEADS.includes(player.id)) DEADS.push(player.id);
          });
          reportToYSS("RECONNECTED", "Oyuna geri dönüldü");
      },
      'game-over-awards-available': (data) => {
         if (data.playerAward.canClaimDoubleXp) {
           emitNative('game-over-double-xp', '{}')
         }
      },
      'game-game-over': () => {
          if (GAME_STATUS === 'over') return;
         
      },
      'game-reconnect-set-chat-day-history': () => {
         GAME_STATUS = 'over';
          reportToYSS("GAME_OVER", "");
      },
      'disconnect': () => {
          ROLE = undefined;
          PLAYERS = [];
          GAME_ID = undefined;
          GAME_STATUS = undefined;
          SERVER_URL = undefined;
          DEADS = [];
          window.hbvDispatch = undefined; 
          console.log("📡 [HBV] Durum sıfırlandı, zombi yeni emirlere hazır!");
          reportToYSS("DISCONNECTED", "Lobiden/Oyundan çıkıldı");
      }
  };

      const interceptNativeSocket = () => {
      const OrigWebSocket = window.WebSocket

      window.WebSocket = function (...args) {
        const ws = new OrigWebSocket(...args)

        console.log(`🐺 [DEBUG] Yeni WebSocket oluşturuldu. URL:`, args[0])

        ws.addEventListener('open', function (e) {
          console.log(`🐺 [DEBUG] Soket AÇILDI. URL: ${ws.url}`)
          if (ws.url.includes('api-wolvesville.com')) {
            NATIVE_SOCKET = ws
            console.log('%c🐺 HBV: Native Socket kancaya takıldı!', 'background: green; color: white; padding: 2px;')
          }
        })

        ws.addEventListener('close', function (e) {
          console.warn(`🐺 [DEBUG] Soket KAPANDI. Kod: ${e.code}, Sebep: ${e.reason}`)
          // 🔥 İŞTE EKSİK OLAN HAYAT KURTARICI KİLİT!
          // Soket koptuğu veya sunucu bizi attığı an radarı zorla sıfırla ve uyandır!
          if (typeof messagesToCatch !== 'undefined' && typeof messagesToCatch.disconnect === 'function') {
              messagesToCatch.disconnect();
          }
        })

        ws.addEventListener('error', function (e) {
          console.error(`🐺 [DEBUG] Soket HATASI!`, e)
        })

        const oyununKendiSendi = ws.send
        ws.send = function (data) {
          if (typeof data === 'string' && data.startsWith('42')) {
            console.log(`%c🐺 [DEBUG - OYUN GÖNDERİYOR]`, 'color: orange;', data)
          }
          // 🔥 HAYALET KAYIT: Sen odayı kurarken ayarları havada çalıyoruz!
        // 🔥 HAYALET KAYIT: Sen odayı kurarken ayarları havada çalıyoruz!
          if (typeof data === 'string' && data.includes('"host-custom-game-change-settings"')) {
            try {
                let tmp = data.slice(2);
                let parsed = JSON.parse(tmp);
                if (parsed && parsed.length > 1) {
                    // Oyun burayı string olarak yolluyor. Objeye çevirip saf haliyle kaydedelim!
                    let settingsObj = typeof parsed[1] === 'string' ? JSON.parse(parsed[1]) : parsed[1];
                    localStorage.setItem('hbv-room-template', JSON.stringify(settingsObj));
                    console.log("💾 [HBV] Oda şablonu (roller, süreler) CUK OTURACAK ŞEKİLDE kopyalandı!");
                }
            } catch(e) {}
          }
          return oyununKendiSendi.apply(this, arguments)
        }

        ws.addEventListener('message', function (event) {
          if (typeof event.data === 'string' && event.data.startsWith('42')) {
            const parsedMessage = messageParser(event.data)
            if (parsedMessage && parsedMessage.length) {
              messageDispatcher(parsedMessage)
            }
          }
        })

        return ws
      }
    }

  //#endregion

  //#region OYUN İÇİ AKSİYONLAR (EMİRLER)

  const Join = (gameid) => {
    console.log("deneme 1")
    if (!PLAYER || !PLAYER.username) {
      setTimeout(() => Join(gameid), 2000);
          return;
      }

      if (GAME_STATUS === 'over' || GAME_ID !== undefined) {
          Leave();
          setTimeout(() => Join(gameid), 1000); // BİZ BUNU EKLEMEYİ UNUTMUŞUZ!
          return;
      }
 
      if (!window.hbvDispatch) {
          if (!stealHBVDispatch()) {
              return;
          }
      }
 
      window.hbvDispatch(
          window.oyunJoinCustom(
            null, 
            { gameId: gameid }, 
          )
        );
  }

  const Create = (allsettings) => {

      ISHOST = true;

    // 🔥 EKSİK OLAN KISIM BURASIYDI! Dispatch yoksa çalmayı denemesi lazım!
      if (!window.hbvDispatch) {
          if (!stealHBVDispatch()) {
              return;
          }
      }

      if (!PLAYER || !PLAYER.username || typeof window.oyunJoinCustom !== 'function') {
          return;
      }

      // 2. BOŞTAYSAK ODAYI KUR (Join'i boş atarak)
      if (GAME_ID === undefined && GAME_STATUS === undefined) {
          console.log("🔨 [HBV] Auto Create: Yeni lobi açtırılıyor...");
          window.hbvDispatch(window.oyunJoinCustom(null, {}, null));
          return;
      }


      // 3. ODAYA GİRDİYSEK VE LOBİ BİZİMSE (Kilit açıksa) ŞABLONU YAPIŞTIR
      if (GAME_ID !== undefined) {
        console.log("⚙️ [HBV] Odaya düşüldü. Kayıtlı şablon (ayarlar) yükleniyor...");
        let savedTemplate = allsettings
        try {
          let settings = JSON.parse(savedTemplate);
          
          // 🔥 MATRUŞKA KIRICI: Eğer bir önceki parse işlemi onu hala string bıraktıysa, bir daha parse et!
          if (typeof settings === 'string') {
            settings = JSON.parse(settings);
          }
          
          let targetName = sessionStorage.getItem('hbv-tab-template') || 'HBV Lobbys';
          settings.name = targetName; // Artık kesinlikle obje olduğu için isim değişecek
          
          // Ayarları sunucuya gönder (Soket üzerinden)
          emitNative("host-custom-game-change-settings", JSON.stringify(settings));
          console.log(`✅ [HBV] Ayarlar başarıyla uygulandı! Oda Adı: ${targetName}`);
        } catch(e) {
            console.error("Şablon yükleme hatası:", e);
        }
    }


    // 4. BOŞTA DEĞİLSEK ODAYI KUR (Join'i boş atarak)
      if (GAME_STATUS === "over") {
          console.log("🔨 [HBV] Auto Create: Yeni lobi açtırılıyor...");
          emitNative("host-custom-game-new-game")
          //window.hbvDispatch(window.oyunJoinCustom(null, {}, null));
          return;
      }
  }

  const ChangeRoomSettings = (payloadStr) => {
      
    // Oyunun kabul ettiği formata çevirip WebSocket'e basıyoruz
    emitNative("host-custom-game-change-settings", payloadStr);
    
  }

  const Start = () => {
      if (GAME_ID !== undefined && GAME_STATUS !== 'started') {
          console.log("⚔️ [HBV] C# Emri: Oyun zorla başlatılıyor!");
          // 🔥 DÜZELTME: 'host-game-start' yerine orijinal 'host-start-game' kullanıldı
          emitNative('host-start-game', '{}'); 
      }
  }

  const Leave = () => {
      console.log("🛑 [HBV] C# Emri: Lobiden/Oyundan çıkılıyor!");

      // 2. Arayüzü (React) zorla ana menüye döndür (En kritik kısım)
      // Not: Eski kodunda boruDispatch yazıyordu, yeni sistemde hbvDispatch yaptık. İkisini de dener.
      let currentDispatch = window.hbvDispatch || window.boruDispatch;
      if (currentDispatch) {
          try {
              if (typeof window.oyunLeave === 'function') currentDispatch(window.oyunLeave());
              if (typeof window.oyunDisconnect === 'function') currentDispatch(window.oyunDisconnect());
              window.hbvDispatch(window.oyunDisconnect());
              console.log("🚪 [HBV] Arayüz ana menüye yönlendirildi.");
          } catch (e) {
              console.error("🐺 [HBV HATA] Dispatch ile çıkış yapılamadı:", e);
          }
      } else {
          console.warn("⚠️ [HBV] Dispatch bulunamadı, arayüz takılı kalabilir!");
      }

      // 3. Bizim kendi zombinin hafızasını sıfırla
      if (typeof messagesToCatch !== 'undefined' && typeof messagesToCatch.disconnect === 'function') {
          messagesToCatch.disconnect();
      }
  }
  const SetSlot = (slot = 0) => {

  if (GAME_ID !== undefined) {
          console.log(`🚀 [HBV] C# Emri: Grid ${parseInt(slot) + 1} kapılıyor!`);
          emitNative('lobby:player-grid-idx-changed', JSON.stringify({ gridIdx: parseInt(slot) }));
      }
  }


  const Vote = (targetId) => {

  if (!PLAYER || DEADS.includes(PLAYER.id)) return;
      
      // Gündüz Oylaması (Herkes)
      emitNative('game-day-vote-set', JSON.stringify({ targetPlayerId: targetId }));
      
      // Gece Kurtadam Oylaması (Eğer kurt ise)
      if (ROLE && ROLE.team === 'WEREWOLF') {
          emitNative('game-werewolves-vote-set', JSON.stringify({ targetPlayerId: targetId }));
      }
  }

const UseSkill = (payloadStr) => {
      try {
          let skillData = JSON.parse(payloadStr);
          if (!ROLE || DEADS.includes(PLAYER.id)) return;

          let roleId = skillData.role || ROLE.id;
          let targetId = skillData.target;

          switch(roleId) {
              case "priest":
                  emitNative('game-priest-kill-player', JSON.stringify({ targetPlayerId: targetId }));
                  break;
              case "vigilante":
                  emitNative('game-vigilante-shoot', JSON.stringify({ targetPlayerId: targetId }));
                  break;
              case "gunner":
                  emitNative('game-gunner-shoot-player', JSON.stringify({ targetPlayerId: targetId }));
                  break;
              case "mayor":
                  emitNative('mayor-reveal-role', '{}');
                  break;
              // 🔥 BUNLARI EKLEMEZSEN VILL WIN SENARYOSU ÇALIŞMAZ! 🔥 Hatası var biliyorum düzelticem daha sonra
              case "junior-werewolf":
                  emitNative('game-junior-werewolf-selected-player', JSON.stringify({ targetPlayerId: targetId }));
                  break;
              case "serial-killer":
                  // (Not: Oyunun SK için kullandığı orijinal emit buydu diye hatırlıyorum, farklıysa burayı düzeltirsin)
                  emitNative('game-serial-killer-vote', JSON.stringify({ targetPlayerId: targetId }));
                  break;
              default:
                  console.warn(`[HBV] Desteklenmeyen veya hedef gerektiren skill: ${roleId}`);
          }
      } catch(e) {
          console.error("🐺 [YSS HATA] UseSkill parse hatası", e);
      }
  }

  const SendMessage = (payloadStr) => {
      // payloadStr: { type: "chat_public", msg: "merhaba" } gibi objeler
      try {
          let sendData = JSON.parse(payloadStr);
          if (!sendData.type) return;

          switch(sendData.type) {
              case "chat_public":
                  emitNative('game:chat-public:msg', JSON.stringify({ msg: sendData.msg, pId: generatePid() }));
                  break;
              case "chat_wolves":
                  emitNative('game:chat-werewolves:msg', JSON.stringify({ msg: sendData.msg, pId: generatePid() }));
                  break;
              case "emoji":
                  emitNative('game-player-emoji', JSON.stringify({ emojiId: sendData.id }));
                  break;
              case "bqt":
                  emitNative('game-player-send-bqt', JSON.stringify({ targetPlayerId: sendData.target, bqtId: sendData.id }));
                  break;
              case "rose":
                  emitNative('game-player-send-rose', JSON.stringify({ targetPlayerId: sendData.target }));
                  break;
          }
      } catch(e) {
          console.error("🐺 [YSS HATA] Send parse hatası", e);
      }
  }
  
  
  //#region ECONOMY

  const SpinGoldWheel = () => {
    if(typeof getHeaders==='function' && typeof getRewardSecret==='function') fetch(`https://core.api-wolvesville.com/rewards/wheelRewardWithSecret/${getRewardSecret()}`, { method: 'POST', headers: getHeaders() }); 
  }

  const SpinRoseWheel = () => {
    if(typeof getHeaders==='function') fetch('https://core.api-wolvesville.com/rewards/goldenWheelSpin', { method: 'POST', headers: getHeaders() });
  }

  const OpenLootBox = async (c = 0) => {
    if (c === 40) {
      console.log(`⏳ wait 1 min before opening again`)
      await delay(1000 * 60 * 1)
      c = 0
    }
    await fetch(`https://core.api-wolvesville.com/inventory/lootBoxes/${INVENTORY.lootBoxes[0].id}`, {
      method: 'POST',
      headers: getHeaders(),
    }).then((rep) => {
      if (rep.status === 200) {
        INVENTORY.lootBoxes.shift()

        if (INVENTORY.lootBoxes?.length) {
          return OpenLootBox(c + 1)
        }
      }
    })
  }

  const SendRose = (rawData) => {
      let targetId = rawData;
      let miktar = 1;

      // Eğer veri obje veya JSON string ise parçala
      if (typeof rawData === 'string' && rawData.includes('{')) {
          try {
              let parsed = JSON.parse(rawData);
              targetId = parsed.target || parsed.targetPlayerId;
              miktar = parsed.amount || 1;
          } catch(e) {}
      } else if (typeof rawData === 'object' && rawData !== null) {
          targetId = rawData.target || rawData.targetPlayerId;
          miktar = rawData.amount || 1;
      }

      if (!targetId) {
          console.warn("🐺 [HBV] Gül atmak için hedef ID eksik!");
          return;
      }
      
      const payload = JSON.stringify({ targetPlayerId: targetId, amount: miktar });
      emitNative('game-player-send-rose', payload);
      console.log(`🌹 [HBV] ${targetId} hedefine ${miktar} adet gül fırlatıldı!`);
  }

  const SendBouquet = (rawData) => {
      let miktar = 1;

      // Eğer veri obje, JSON string veya direkt sayı ise ona göre ayarla
      if (typeof rawData === 'string' && rawData.includes('{')) {
          try {
              let parsed = JSON.parse(rawData);
              miktar = parsed.amount || 1;
          } catch(e) {}
      } else if (typeof rawData === 'object' && rawData !== null) {
          miktar = rawData.amount || 1;
      } else if (!isNaN(parseInt(rawData))) {
          miktar = parseInt(rawData); // Sadece sayı yollandıysa
      }

      const payload = JSON.stringify({ amount: miktar });
      emitNative('roses-for-all', payload);
      console.log(`💐 [HBV] Tüm odaya ${miktar} adet buket patlatıldı! XP'ler şelale!`);
  }
  
  //#endregion

  //#endregion

  //#region CORE ENGINE & DISPATCHER (ÇEKİRDEK MOTOR)


  // 🔥 HBV HACK: React Fiber üzerinden Redux Motorunu Çalma 🔥
  const stealHBVDispatch = () => {
    if (window.hbvDispatch) return true; // Zaten çalındıysa geç
    
    const rootEl = document.getElementById('root');
    if (!rootEl) return false;
    
    // React 17+ / 18 Fiber Root anahtarını bul
    const reactKey = Object.keys(rootEl).find(key => key.startsWith('__reactContainer'));
    if (!reactKey) return false;
    
    let queue = [rootEl[reactKey]];
    
    // Ağacı (Tree) tarayarak Redux Store'u arıyoruz
    while (queue.length > 0) {
      let node = queue.shift();
      if (!node) continue;
      
      // Component'in proplarında veya state'inde store var mı?
      let store = (node.memoizedProps && node.memoizedProps.store) || (node.stateNode && node.stateNode.store);
      
      if (store && typeof store.dispatch === 'function' && typeof store.getState === 'function') {
        window.hbvDispatch = store.dispatch;
        window.hbvGetState = store.getState;
        console.log("%c🐺 [HBV] EFSANE: Dispatch motoru React Fiber ağacından sökülüp alındı! 🎯", "color: #00FF00; font-weight: bold;");
        return true;
      }
      
      if (node.child) queue.push(node.child);
      if (node.sibling) queue.push(node.sibling);
    }
    return false;
  };



  const getPLAYER = () => {
    console.log('getPLAYER called')
    fetch('https://core.api-wolvesville.com/players/meAndCheckAppVersion', {
      method: 'PUT',
      headers: getHeaders(),

      body: JSON.stringify({
        deviceId: null,
        locale: 'en',
        platform: 'web',
        versionNumber: 1,
      }),
    }).catch((e) => console.error('Kimlik doğrulama isteği başarısız:', e))
  }

  

  const getRewardSecret = () => {
    if (!PLAYER || !INVENTORY) return ""; // Güvenlik kilidi
    const i = PLAYER?.id || "";
    const o = INVENTORY.silverCount || 0;
    const n = PLAYER.xpTotal || 0;
    const r = INVENTORY.roseCount || 0;
    console.log(i, o, n, r)
    return `${i.charAt(o % 32)}${i.charAt(n % 32)}${new Date().getTime().toString(16)}${i.charAt((o + 1) % 32)}${i.charAt(
      r % 32
    )}`
  }

  const getRole = (id) => {
    return JSON.parse(localStorage.getItem('roles-meta-data')).roles[id]
  }

  const setRole = (id) => {
    ROLE = getRole(id)
  }

  const getAuthtokens = () => {
    try {
      const authtokens = JSON.parse(localStorage.getItem('authtokens'))
      if (authtokens) {
        console.log('authtokenleri buldum')
        AUTHTOKENS.idToken = authtokens.idToken || ''
        AUTHTOKENS.refreshToken = authtokens.refreshToken || ''
      } else {
        console.log('authtokens not found', authtokens)
      }
    } catch (e) {
      console.log('Failed to parse authtokens from localStorage', e)
    }
  }

  const emitNative = (eventName, payloadStr) => {
    if (!NATIVE_SOCKET) {
      console.error(`🐺 [HBV ERROR] NATIVE_SOCKET tanımlı değil! Event: ${eventName}`)
      return
    }
    if (NATIVE_SOCKET.readyState !== 1) {
      console.error(`🐺 [HBV ERROR] Soket hazır değil! State: ${NATIVE_SOCKET.readyState}. Event: ${eventName}`)
      return
    }
    try {
      const packetArray = payloadStr ? [eventName, payloadStr] : [eventName]
      const packet = '42' + JSON.stringify(packetArray)
      console.log(`🐺 [DEBUG - EMIT] Gönderiliyor:`, packet)
      SafWebSocketSend.call(NATIVE_SOCKET, packet)
      console.log(`%c🐺 [DEBUG - EMIT BAŞARILI]`, 'color: #00FF00; font-weight: bold;')
    } catch (error) {
      console.error(`🐺 [HBV KRİTİK ERROR] Emit hatası:`, error)
    }
  }
  
  const messageDispatcher = (message) => {
    const msg = message[0]
    const data = message.length > 1 ? message[1] : null
    const method = messagesToCatch[msg]
    !!method && method(data)
  }

  function messageParser(message) {
    let tmp = message.slice(2);
    let parsedArray = undefined;
    
    try {
      parsedArray = JSON.parse(tmp);
      
      // Eğer 2. parametre string halinde bir JSON ise (matruşka), onu da objeye çevir
      if (parsedArray && parsedArray.length > 1 && typeof parsedArray[1] === 'string') {
          // Gereksiz replaceAll kullanmadan, doğrudan parse ediyoruz.
          try {
              parsedArray[1] = JSON.parse(parsedArray[1]);
          } catch (e) {
              // Parse edilemiyorsa orijinal haliyle kalsın
          }
      }
    } catch (e) {
        // Hatalı paket
    }
    
    return parsedArray;
  }

  //#endregion

  //#region BAŞLATICI VE DÖNGÜ
  const main = async () => {
  
    getAuthtokens()
    setTimeout(() => {
      if (!PLAYER || !PLAYER.username) {
        console.log('🐺 HBV: Oyun kimliği geciktirdi. Sistem zorla doğrulama yapıyor...')
        getPLAYER()
      }
    }, 2000)
      setTimeout(() => { connectToYSS();},5000)
  
    setInterval(masterLoop, 1000)
  }


  const fetchInterceptor = () => {
    const { fetch: origFetch } = window

    const targetUrls = Object.keys(requestsToCatch)

    window.fetch = async (...args) => {
      const input = args[0]
      let url = typeof input === 'string' ? input : input?.url || ''

      if (url.includes('/players/webBo') || url.includes('/players/webAutomatio') || url.includes('[native code]')) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      if (url.startsWith('https://core.api-wolvesville.com/inventory?')) {
        url = 'https://core.api-wolvesville.com/inventory?'
        if (typeof input === 'string') args[0] = url
      }

      const matchedKey = targetUrls.find((_url) => url.includes(_url))
      const catchMethod = matchedKey ? requestsToCatch[matchedKey] : null

      let init = args[1] || {}
      let headers = init.headers
      if (headers) {
        let authHeader = ''
        if (headers instanceof Headers) {
          authHeader = headers.get('authorization') || ''
        } else {
          authHeader = headers['authorization'] || headers['Authorization'] || ''
        }

        if (authHeader && authHeader.startsWith('Bearer ')) {
          const newToken = authHeader.slice(7)
          if (AUTHTOKENS.idToken !== newToken) {
            AUTHTOKENS.idToken = newToken
          }
        }
      }

      const response = await origFetch(...args)

      if (catchMethod && response.ok) {
        try {
          const clonedResponse = response.clone()
          const contentType = clonedResponse.headers.get('content-type')

          if (contentType && contentType.includes('application/json')) {
            const text = await clonedResponse.text()
            if (text && text.trim() !== '') {
              const data = JSON.parse(text)

              return catchMethod(data, url) || response
            }
          }
        } catch (e) {
          return response
        }
      }

      return response
    }
    console.log('🚀 HBV: Optimized Fetch Interceptor v3.1 Aktif (VDS Ready)')
  }


  interceptNativeSocket()
  fetchInterceptor()
  main()

  //#endregion


})();
