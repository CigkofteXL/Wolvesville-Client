      3975: (t, a, s) => {
        "use strict";
        (s.r(a),
          s.d(a, {


            openSocket: () => Opensocket,

            rejoin: () => Io,

          }));
        var i = s(67994),
          n = s(2717),
          o = s(65901),
          r = s(70880),
          l = s(16458),
          d = s(61415),
          c = s(41366),
          h = s(25661),
          _ = s(89384),
          g = s(9359),
          p = s(50842),
          mbuney = s(21828),
          u = s(28744),
          y = s(80988),
          f = s(97918),
          v = s(39314),
          w = s(10388),
          b = s(29753),
          x = s(77318),
          I = s(6399),
          A = s(12958);
        class S {
          static async maybeRequestReview(t) {
            if (
              t &&
              !(0, I.HZ)() &&
              x.A.isAvailable() &&
              ("ios" !== n.A.OS || "active" === l.A.currentState)
            )
              try {
                await x.A.RequestInAppReview();
              } catch (e) {
                "ios" === n.A.OS &&
                  A.sQ.captureException(e, {
                    tags: { feature: "in-app-review" },
                    extra: { appState: l.A.currentState },
                  });
              }
          }
        }
        var P = s(58370),
          C = s(20161);
     
        var we = s(27184),
          be = s(60444),
          xe = s(87702),
          Ie = s(13710);
        class Ae {
          constructor(e) {
            let { needed: t, votes: a } = e;
            ((this._needed = t), (this._votes = a));
          }
          get needed() {
            return this._needed;
          }
          get votes() {
            return this._votes;
          }
        }
        var Se = s(35718),
          Pe = s(46498);
       
       
        var ke = s(52621),
          je = s(95185),
          Re = s(31312),
          Ee = s(85236),
          Oe = s(21812),
          Me = s(82128),
          Le = s(80825),
          De = s(81750),
          Be = s(26274),
          Ne = s(63052),
          $e = s(40124),
          ze = s(65165),
          Ge = s(3461),
          Fe = s(71424),
          We = s(58569),
          He = s(60277),
          Ve = s(34645),
          Ue = s(44142),
          qe = s(95436),
          Ye = s(29352),
          Ke = s(22664),
          Ze = s(40212),
          Qe = s(86198),
          Je = s(52019),
          Xe = s(39694),
          et = s(7425),
          tt = s(61429),
          at = s(56115),
          st = s(89307),
          it = s(82360),
          nt = s(35258),
          ot = s(50098),
          rt = s(91963),
          lt = s(83398),
          dt = s(57525),
          ct = s(86246),
          ht = s(60347),
          _t = s(25417),
          gt = s(26281),
          pt = s(52320),
          mt = s(41204),
          ut = s(43703),
          yt = s(98962),
          ft = s(47421),
          vt = s(91516),
          wt = s(2924),
          bt = s(79389),
          xt = s(88828),
          It = s(80716),
          At = s(37814),
          St = s(92566),
          Pt = s(94443),
          Ct = s(53669),
          Tt = s(84242),
          kt = s(75688),
          jt = s(11310),
          Rt = s(14771),
          Et = s(37636),
          Ot = s(8010),
          Mt = s(24215),
          Lt = s(67899),
          Dt = s(9761),
          Bt = s(54248),
          Nt = s(66397),
          $t = s(62699),
          zt = s(37767),
          Gt = s(19826),
          Ft = s(50541),
          Wt = s(38475),
          Ht = s(34817),
          Vt = s(26085),
          Ut = s(96132),
          qt = s(30015),
          Yt = s(39053),
          Kt = s(70085),
          Zt = s(51410),
          Qt = s(16519),
          Jt = s(79753),
          Xt = s(5784),
          ea = s(22454),
          ta = s(10522),
          aa = s(29485),
          sa = s(64422),
          ia = s(43180),
          na = s(39007),
          oa = s(69714),
          ra = s(96346),
          la = s(15891),
          da = s(12835),
          ca = s(1558),
          ha = s(55502),
          _a = s(76796),
          ga = s(32697),
          pa = s(71493),
          ma = s(39088),
          ua = s(93269),
          ya = s(74e3),
          fa = s(30328),
          va = s(77010),
          wa = s(93908),
          ba = s(10456),
          xa = s(20428),
          Ia = s(28140),
          Aa = s(99767),
          Sa = s(17386),
          Pa = s(34132),
          Ca = s(41600),
          Ta = s(71878),
          ka = s(49927),
          ja = s(67959),
          Ra = s(10060),
          Ea = s(64077),
          Oa = s(7395),
          Ma = s(53074),
          La = s(98681),
          Da = s(67514),
          Ba = s(26284),
          Na = s(3398),
          $a = s(52712);
        
        var Ga = s(65545),
          Fa = s(4337),
          Wa = s(13557),
          Ha = s(3269),
          Va = s(2898),
          Ua = s(79625),
          qa = s(36658),
          Ya = s(87838),
          Ka = s(2469),
          Za = s(17862);
        
        var Ja = s(93281),
          Xa = s(29264),
          es = s(62159),
          ts = s(68962),
          as = s(68979),
          ss = s(4600),
          is = s(10976),
          ns = s(95051),
          os = s(31294),
          rs = s(70277),
          ls = s(38304),
          ds = s(19896),
          cs = s(26801),
          hs = s(62590),
          _s = s(21063),
          gs = s(79159),
          ps = s(71642),
          ms = s(25451),
          us = s(6933),
          ys = s(84321),
          fs = s(78311),
          vs = s(34415),
          ws = s(2574),
          bs = s(58901),
          xs = s(19496),
          Is = s(28393);
        
        let co,
          ho,
          _o,
          go,
          po = !1;
        const mo = 500,
          
          yo = () => async (e, t) => {
            (e((0, g.V)(CLEAR_GAME)),
              e(os.Ho()),
              es.HA.season49QoLEnabled(t()) &&
                e(ts.setProgressedChallenges(void 0)),
              co &&
                (co.disconnect(),
                co.io.off("reconnect_attempt"),
                (co = void 0)),
              clearInterval(ho),
              clearInterval(_o),
              clearInterval(go),
              await e(Ia.rg.clearGameState()),
              Pa.$D.setSettings(Ra.settings(t())),
              e(Wa.setDrawerOpen(!1)));
            try {
              "ios" === n.A.OS
                ? await h.A.leaveChannel()
                : await h.A.disconnect();
            } catch (a) {}
            Is.ap.setPresenceToMainMenu();
          },
          
          vo = () => async (e) => {
            try {
              return await Pa.N5.retryWithExponentialBackoff(
                () => Ba.Jv.getIdTokenOrFirebaseIdToken(),
                3,
              );
            } catch (t) {
              return (
                Ca.V.logErrorDev(t),
                e(
                  v.modalActionCreators.showAlert({
                    title: ka.P$.common_error,
                    msg: o.A.isRTL
                      ? `${ka.P$.no_connection_headline} ${ka.P$.game_error_game_connection_lost}`
                      : `${ka.P$.game_error_game_connection_lost} ${ka.P$.no_connection_headline}`,
                  }),
                ),
                A.sQ.addBreadcrumb({
                  category: "game-error-navigation",
                  data: { reason: "Auth failed" },
                }),
                e(ph(be.bn)),
                !1
              );
            }
          },
          wo = () => async (e) => {
            (co.disconnect(), await e((0, g.V)(Os, { connected: !1 })));
          },
          bo = () => async (e, t) => {
            const gameid = Se.gameId(t());
            co.io.opts.query = {
              ...co.io.opts.query,
              reconnect: !0,
              gameId: gameid,
            };
            const s = await e(vo());
            (s && (co.auth = { ...co.auth, firebaseToken: s }),
              co.connect(),
              await e((0, g.V)(Os, { connected: !0 })));
          },
          xo = function (e, gamemode) {
            let a =
                arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
              spectate =
                arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
              password = arguments.length > 4 ? arguments[4] : void 0;
            return async (n, o) => {
              if ((spectate || n(To()), a))
                return void (await n((0, g.V)(ii, { status: C.Qm })));
              const { randomAvatarSlot: randomavatarslot, dodgeBlockedPlayers: l } =
                  Ra.settings(o()),
                d = es.HA.season41QOLEnabled(o());
              await n(yo());
              const firebasetoken = await n(vo());
              if (!firebasetoken) return;
              const [deviceid, devicesecuritylevel] = await Promise.all([
                A.qK.getDeviceId(),
                A.qK.getDeviceSecurityLevel(),
              ]);
              (e && !spectate
                ? await n(
                    Opensocket(e.serverUrl, {
                      query: {
                        firebaseToken: firebasetoken,
                        gameId: e.gameId,
                        playWithFriends: !0,
                        gameMode: gamemode,
                        reconnect: !0,
                        randomAvatarSlot: randomavatarslot,
                        deviceId: deviceid,
                        deviceSecurityLevel: devicesecuritylevel,
                      },
                    }),
                  )
                : e && spectate
                  ? await n(
                      Opensocket(e.serverUrl, {
                        query: {
                          firebaseToken: firebasetoken,
                          gameId: e.gameId,
                          spectate: spectate,
                          password: password,
                          randomAvatarSlot: randomavatarslot,
                          deviceId: deviceid,
                          deviceSecurityLevel: devicesecuritylevel,
                        },
                      }),
                    )
                  : await n(
                      Opensocket(await n(mbuney.mF.getGameServerBaseUrlFromGameMode(gamemode)), {
                        query: {
                          firebaseToken: firebasetoken,
                          gameMode: gamemode,
                          spectate: spectate,
                          randomAvatarSlot: randomavatarslot,
                          dodgeBlockedPlayers: l && d,
                          deviceId: deviceid,
                          deviceSecurityLevel: devicesecuritylevel,
                        },
                      }),
                    ),
                await n((0, g.V)(INIT_GAME)),
                await n((0, g.V)(ii, { status: C.Qm })),
                await ko(n, o),
                e || a
                  ? await n((0, g.V)(ei, { playAgain: void 0 }))
                  : await n((0, g.V)(ei, { playAgain: { gameMode: gamemode } })));
            };
          },
          Io = (e) => {
            let { gameIdAndServerUrl: t, gameMode: gamemode } = e;
            return async (e, s) => {
              await e(yo());
              const firebasetoken = await e(vo());
              if (!firebasetoken) return;
              const [deviceid, devicesecuritylevel] = await Promise.all([
                A.qK.getDeviceId(),
                A.qK.getDeviceSecurityLevel(),
              ]);
              (await e(
                Opensocket(t.serverUrl, {
                  query: {
                    firebaseToken: firebasetoken,
                    gameId: t.gameId,
                    reconnect: !0,
                    deviceId: deviceid,
                    deviceSecurityLevel: devicesecuritylevel,
                  },
                }),
              ),
                await e((0, g.V)(ei, { playAgain: { gameMode: gamemode } })),
                gamemode === Aa.Q4 &&
                  (await e((0, g.V)(Rs)), e(y.getOwnCustomGameRoleIds())),
                await ko(e, s),
                e(v.modalActionCreators.hideModalDeprecated()),
                e((0, g.V)(RECOVER_FROM_REJOIN)));
            };
          },
          Ao = (e) => {
            let { gameId: gameid, gameMode: gamemode, suiciderId: suiciderid } = e;
            return async (e, i) => {
              var n;
              await e(yo());
              const firebasetoken = await e(vo());
              if (!firebasetoken) return;
              const [deviceid, devicesecuritylevel] = await Promise.all([
                A.qK.getDeviceId(),
                A.qK.getDeviceSecurityLevel(),
              ]);
              (await e(
                Opensocket(await e(mbuney.mF.getGameServerBaseUrlFromGameMode(gamemode)), {
                  query: {
                    firebaseToken: firebasetoken,
                    gameId: gameid,
                    suiciderId: suiciderid,
                    gameMode: gamemode,
                    deviceId: deviceid,
                    deviceSecurityLevel: devicesecuritylevel,
                  },
                }),
              ),
                await e((0, g.V)(ei, { playAgain: { gameMode: gamemode } })),
                await ko(e, i),
                null === (n = co) || void 0 === n || n.emit(j),
                e((0, g.V)(RECOVER_FROM_REJOIN)),
                e(To()));
            };
          },
          So = (e, t) => async (a, s) => {
            (mbuney.Tp.avatarItems(s()) || (await a(mbuney.mF.getAllPurchasableItems())),
              await a(yo()));
            const i = await a(vo());
            if (!i) return;
            const o =
                (null === e || void 0 === e ? void 0 : e.serverUrl) ||
                (await a(mbuney.mF.getGameServerBaseUrlFromGameMode(t))),
              [r, l] = await Promise.all([
                A.qK.getDeviceId(),
                A.qK.getDeviceSecurityLevel(),
              ]);
            (await a(
              Opensocket(o, {
                query: {
                  firebaseToken: i,
                  gameId: null === e || void 0 === e ? void 0 : e.gameId,
                  playWithFriends: !0,
                  gameMode: t,
                  platform: n.A.OS,
                  appVersionNumber: A.Vj.getBuildNumber(),
                  deviceId: r,
                  deviceSecurityLevel: l,
                },
              }),
            ),
              await a((0, g.V)(INIT_GAME)),
              await a((0, g.V)(ii, { status: C.rd })),
              await ko(a, s),
              await a((0, g.V)(Sn, { invitedFriends: {} })),
              await a((0, g.V)(Pn, { uninvitedFriends: {} })),
              await a((0, g.V)(ei, { playAgain: void 0 })));
          },
          Po = function (e, t) {
            let a =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : null;
            return async (s, i) => {
              (mbuney.Tp.avatarItems(i()) ||
                (await s(mbuney.mF.getAllPurchasableItems())),
                await s(yo()));
              const n = await s(vo());
              if (!n) return;
              const [o, r] = await Promise.all([
                A.qK.getDeviceId(),
                A.qK.getDeviceSecurityLevel(),
              ]);
              (await s(
                Opensocket(t, {
                  query: {
                    firebaseToken: n,
                    discordJoinSecret: e,
                    password: a,
                    deviceId: o,
                    deviceSecurityLevel: r,
                  },
                }),
              ),
                await ko(s, i),
                Pa.$D.startMusic(Pa.ds.GY));
            };
          },
          Co = (e, t, a) => async (s, i) => {
            (mbuney.Tp.avatarItems(i()) || (await s(mbuney.mF.getAllPurchasableItems())),
              a && (await Pa.UL.setItem(lo, JSON.stringify({ password: a }))),
              await s(yo()));
            const n = await s(vo());
            if (!n) return;
            a && s(v.modalActionCreators.setIsLoadingDeprecated(!0));
            const o =
                (null === t || void 0 === t ? void 0 : t.serverUrl) ||
                (null === e || void 0 === e ? void 0 : e.gameServerBaseUrl) ||
                (await s(mbuney.mF.getGameServerBaseUrlFromGameMode(Aa.Q4))),
              [r, l] = await Promise.all([
                A.qK.getDeviceId(),
                A.qK.getDeviceSecurityLevel(),
              ]);
            (await s(
              Opensocket(o, {
                query: {
                  firebaseToken: n,
                  gameId: null === t || void 0 === t ? void 0 : t.gameId,
                  gameMode: Aa.Q4,
                  password: a,
                  deviceId: r,
                  deviceSecurityLevel: l,
                },
              }),
            ),
              e &&
                new Promise(async (e) => {
                  for (let t = 0; t < 10; ++t) {
                    if (Se.connected(i()) && co) return void e();
                    await Pa.N5.timeout(500);
                  }
                  e();
                }).then(() => s(_h(e))),
              await s((0, g.V)(INIT_CUSTOM_GAME)),
              await ko(s, i),
              Pa.$D.startMusic(Pa.ds.GY));
          },

          ko = async (e, t) => {
            (Zc(),
              await e((0, g.V)(Os, { connected: !1 })),
              co.on("connect", async () => {
                (await e((0, g.V)(Os, { connected: !0 })),
                  e(v.modalActionCreators.setIsLoadingDeprecated(!1)));
              }),
              co.on("error-game-does-not-exist", (a) => {
                (e(
                  v.modalActionCreators.showAlert({
                    msg: ka.P$.game_error_game_does_not_exist,
                  }),
                ),
                  Se.isCustomGame(t())
                    ? e(ph(be.rR))
                    : (e(ph(be.bn)),
                      A.sQ.addBreadcrumb({
                        category: "game-error-navigation",
                        data: { reason: "Game does not exist" },
                      })));
              }),
              co.on("error-user-banned", async (t) => {
                (await e(ph(be.bn)),
                  A.sQ.addBreadcrumb({
                    category: "game-error-navigation",
                    data: { reason: "User banned" },
                  }),
                  e((0, g.V)(Ms, { error: JSON.parse(t) })));
              }),
              co.on("error-ranked-season-banned", async (t) => {
                (await e(ph(be.S)),
                  A.sQ.addBreadcrumb({
                    category: "game-error-navigation",
                    data: { reason: "Ranked season banned" },
                  }),
                  e(
                    v.modalActionCreators.showAlert({
                      title: ka.P$.ranked_season_banned_title,
                      msg: ka.P$.ranked_season_banned_msg,
                    }),
                  ));
              }),
              co.on("error-user-kicked-by-custom-game-host", async (t) => {
                (await e(ph(be.rR)),
                  e(
                    v.modalActionCreators.showAlert({
                      msg: ka.P$.custom_games_kicked_msg,
                    }),
                  ));
              }),
              co.on("error-user-banned-by-custom-game-host", async (t) => {
                (await e(ph(be.rR)),
                  e(
                    v.modalActionCreators.showAlert({
                      msg: ka.P$.custom_games_banned_msg,
                    }),
                  ));
              }),
              co.on("error-unable-hero-join", async (t) => {
                (await e(ph(be.S)),
                  e(
                    v.modalActionCreators.showAlert({
                      msg: ka.P$.hero_game_failed_join_msg,
                    }),
                  ));
              }),
              
              
              
              
             
              co.on("error-auth-not-supported", async () => {
                (await e(ph(be.bn)),
                  e(
                    v.modalActionCreators.showAlert({
                      title: ka.P$.common_error,
                      msg: ka.P$.formatString(
                        ka.P$.error_auth_not_supported,
                        P.A.supportMail,
                      ),
                    }),
                  ),
                  A.sQ.addBreadcrumb({
                    category: "game-error-navigation",
                    data: { reason: "Auth not supporte" },
                  }));
              }),
              co.on("error-cloudflare-jwt-invalid", async () => {
                (co.disconnect(),
                  await ss.h.createNewTurnstileJwt(
                    await Ba.Jv.getIdTokenOrFirebaseIdToken(),
                    !0,
                    "game",
                  ),
                  co &&
                    ((co.auth = {
                      ...co.auth,
                      [P.A.cloudflareJwtHeaderKey]: ss.h.getJwt(),
                    }),
                    co.connect()));
              }),
              co.on("error-auth-email-verification-required", async () => {
                await Ba.Jv.getIdTokenOrFirebaseIdToken(!0);
                (await Ba.Jv.isEmailVerified())
                  ? e(ph(_.getCurrentScreenId(), _.getCurrentParams()))
                  : (await e(ph(be.bn)),
                    e(
                      v.modalActionCreators.showAlert({
                        title: ka.P$.email_verification_title,
                        msg: ka.P$.error_auth_email_verification_required,
                        positiveBtnText: ka.P$.email_verification_email_action,
                        handlePositive: async () => {
                          (e(Ba.d5.resendEmailVerificationEmail()),
                            _.reset(be.cZ, { optionalCheck: !0 }));
                        },
                        negativeBtnText: ka.P$.common_cancel,
                      }),
                    ),
                    A.sQ.addBreadcrumb({
                      category: "game-error-navigation",
                      data: { reason: "Auth email verification required" },
                    }));
              }),
              co.on("game-joined", (a) => {
                const {
                    gameId: s,
                    serverUrl: i,
                    onlinePlayerCountForGameMode: n,
                    discordJoinSecret: o,
                    isCustomGame: r,
                  } = JSON.parse(a),
                  l = Se.gameId(t());
                if (l === s || void 0 === l) {
                  if (!Se.gameState(t()) && void 0 !== r) {
                    const a = Se.playAgain(t());
                    (r
                      ? e((0, g.V)(INIT_CUSTOM_GAME))
                      : (e((0, g.V)(INIT_GAME)), e((0, g.V)(ii, { status: C.rd }))),
                      e((0, g.V)(Os, { connected: !0 })),
                      a && e((0, g.V)(ei, { playAgain: a })));
                  }
                  e(
                    (0, g.V)(Ai, {
                      gameIdAndServerUrl: new Na.A({ gameId: s, serverUrl: i }),
                      onlinePlayerCountForGameMode: n,
                      discordJoinSecret: o,
                    }),
                  );
                } else
                  (e(yo()),
                    _.reset(be.bn),
                    A.sQ.addBreadcrumb({
                      category: "game-error-navigation",
                      data: { reason: "Join game id mismatch" },
                    }));
              }),
              
              co.on("custom-new-game-available", async (a) => {
                const { gameId: s, hostId: i, serverUrl: n } = JSON.parse(a),
                  o = mbuney.Tp.ownId(t()),
                  r = new Na.A({ gameId: s, serverUrl: n });
                if (o === i) {
                  var l;
                  e(yo());
                  let a = Ha.lastCustomGame(t());
                  (a ||
                    (await e(y.loadCustomGameHistory()),
                    (a = Ha.lastCustomGame(t()))),
                    _.reset(be._V, {
                      gameIdAndServerUrl: r,
                      password:
                        null === (l = a) || void 0 === l ? void 0 : l.password,
                      gameMode: Aa.Q4,
                    }));
                } else e((0, g.V)(qn, { gameIdAndServerUrl: r }));
              }),
              co.on("friends-game-published", (e) => {
                const { gameId: a, serverUrl: s } = JSON.parse(e),
                  i = Se.selfIsSpectator(t());
                _.reset(be.GS, {
                  gameIdAndServerUrl: {
                    gameId: a || Se.gameId(t()),
                    serverUrl: s,
                  },
                  stayInGame: !a,
                  spectate: i,
                  friendsGame: !0,
                });
              }),
              co.on("lobby:chat-msg-history", async (t) => {
                e((0, g.V)(Ls, { chatMessages: await e(Eh(t)) }));
              }),
              co.on("host-changed", async (a) => {
                const {
                  hostPlayerId: s,
                  minWinCount: i,
                  minReputation: n,
                } = JSON.parse(a);
                (Se.gameStatusIsLobby(t()) &&
                  e((0, g.V)(Ns, { minWinCount: i, minReputation: n })),
                  Se.hostPlayerId(t()) !== s &&
                    e((0, g.V)(Ds, { hostPlayerId: s })));
              }),
              co.on(T, async (t) => {
                e((0, g.V)(Bs, { voting: new Ae(JSON.parse(t)) }));
              }),
              co.on(k, async (t) => {
                const a = await e(Rh(t));
                (e((0, g.V)(zs, { chatMessage: a })),
                  a.isSystemMessage || Pa.$D.playEffect(Pa.ds.w5));
              }),
              co.on("players-and-equipped-items", async (t) => {
                const { players: a, allEquippedItems: s } = JSON.parse(t);
                (await e(kh(a, s)), e(fo()));
              }),
              co.on("player-grid-idx", async (t) => {
                const { playerId: a, gridIdx: s } = JSON.parse(t);
                e(jh(a, s));
              }),
              co.on("player-disconnected", async (a) => {
                const s = mbuney.V8.fromJson(a),
                  i = s.id;
                let n = Se.playerById(i)(t());
                if (!n || n.spectate) {
                  var o;
                  const a = Se.spectators(t());
                  return (
                    delete a[i],
                    null !== (o = n) &&
                      void 0 !== o &&
                      o.spectate &&
                      ((n = n.setConnectionStatusAndClone(mbuney.GT.H)),
                      e((0, g.V)(qs, { player: n }))),
                    void e((0, g.V)(Us, { spectators: a }))
                  );
                }
                const r = Se.gameOver(t());
                n &&
                  !r &&
                  ((n = n.setConnectionStatusAndClone(mbuney.GT.H)),
                  (n = n.setGridIdxAndClone(s.gridIdx)),
                  e((0, g.V)(qs, { player: n })),
                  e(fo()));
              }),
              co.on("player-connected", async (a) => {
                const s = mbuney.V8.fromJson(a).id;
                let i = Se.playerById(s)(t());
                const n = Se.gameOver(t());
                i &&
                  !n &&
                  ((i = i.setConnectionStatusAndClone(mbuney.GT._)),
                  e((0, g.V)(qs, { player: i })));
              }),
              co.on("game-settings-changed", async (a) => {
                const s = mbuney.Tp.roleIconsAsMap(t()),
                  i = JSON.parse(a),
                  n = mbuney.KN.fromObject(i, s);
                await e((0, g.V)(ti, { gameSettings: n }));
                const { ownRolePossibleRandomRoles: o } = i;
                (await e(
                  (0, g.V)(ai, {
                    ownRolePossibleRandomRoles: o
                      ? o.map((e) => {
                          var t;
                          return (
                            (null === (t = n.customRandomRoles) || void 0 === t
                              ? void 0
                              : t.find((t) => t.id === e)) ||
                            mbuney.YK.findRoleById(e)
                          );
                        })
                      : void 0,
                  }),
                ),
                  e(fo()));
              }),
              
              co.on("game-starting", async (t) => {
                (e(w.gameStarted()), await e((0, g.V)(ii, { status: C.xo })));
              }),
              co.on(_e, async (t) => {
                const { role: a } = JSON.parse(t);
                await e((0, g.V)(Ts, { role: mbuney.YK.findRoleById(a) }));
              }),
              co.on("game-started", async (a) => {
                (Ra.settings(t()).vibrateOnGameStart &&
                  Se.gameSettings(t()) &&
                  !Se.gameSettings(t()).voiceEnabled &&
                  r.A.vibrate(500),
                  await e(v.modalActionCreators.hideModalDeprecated()));
                const {
                  role: s,
                  advancedRoles: i,
                  players: n,
                  spectators: o,
                  roleToRoleIconIdMap: l,
                  remainingTimeInMs: d,
                } = JSON.parse(a);
                d && (await e((0, g.V)(si, { override: d })));
                const c = mbuney.YK.findRoleById(s),
                  h = i.map((e) => mbuney.YK.findRoleById(e)),
                  _ = mbuney.Tp.ownId(t());
                if (
                  (await e((0, g.V)(ni, { advancedRoles: h, status: C.W2 })),
                  await e(
                    (0, g.V)(Ws, { players: mbuney.V8.fromObjectArray(n, _, c) }),
                  ),
                  await e(
                    (0, g.V)(Hs, { players: mbuney.V8.fromObjectArray(o, _) }),
                  ),
                  e(v.modalActionCreators.hideModalDeprecated()),
                  e(fo()),
                  !l)
                )
                  return;
                const p = {},
                  u = {},
                  y = {},
                  f = mbuney.Tp.roleIconsAsMap(t());
                (mbuney.YK.ALL_ROLES.forEach((e) => {
                  const t = l[e.id],
                    a = t ? f.get(t) : void 0;
                  ((p[e.id] =
                    (null === a || void 0 === a
                      ? void 0
                      : a.roleIconImage.imageSrc) || e.pngIconFilledSource),
                    (u[e.id] =
                      (null === a || void 0 === a
                        ? void 0
                        : a.roleIconSmallImage.imageSrc) ||
                      e.pngIconFilledSmallSource),
                    (y[e.id] =
                      (null === a || void 0 === a
                        ? void 0
                        : a.roleIconLargeImage.imageSrc) ||
                      e.pngIconFilledLargeSource));
                }),
                  e(
                    (0, g.V)(Xs, {
                      roleImageSources: p,
                      roleImageSmallSources: u,
                      roleImageLargeSources: y,
                    }),
                  ));
              }),
              
              
              
              
              
              
              co.on(me, async (a) => {
                const {
                  fromPlayerId: s,
                  amount: i,
                  roseSkinId: n,
                } = JSON.parse(a);
                e((0, g.V)(ADD_RECEIVED_ROSES_ALL, { fromPlayerId: s, amount: i, roseSkinId: n }));
                const o = Se.gameStatusIsLobby(t());
                if (o || Se.selfIsSpectator(t())) {
                  const a = Se.playerById(s)(t());
                  if (!a) return;
                  const n = new p.cM({
                    authorId: p.l2.lR,
                    msgKey: p.s7.qEr,
                    msgArgs: {
                      [p.s7.UMJ]: { [p.s7.Bj$]: a.getUsernameWithGridIndex() },
                      [p.s7.Kr6]: i,
                    },
                  });
                  o
                    ? e((0, g.V)(Fs, { chatMessage: n }))
                    : Se.gameIsRunning(t())
                      ? e((0, g.V)(APPEND_PUBLIC_CHAT, { chatMessage: n }))
                      : e((0, g.V)(zs, { chatMessage: n }));
                }
              }),
              co.on(ue, async (a) => {
                const {
                    fromPlayerId: s,
                    targetPlayerId: i,
                    amount: n,
                    roseSkinId: o,
                    traded: r,
                  } = JSON.parse(a),
                  l = Se.playersAsObject(t())[s],
                  d = Se.isDay(t()),
                  c = mbuney.Tp.ownId(t());
                if (
                  ((l && l.isAlive && d) || i === c || s === c
                    ? e(
                        (0, g.V)(ADD_RECEIVED_ROSES_PLAYER_GAME, {
                          fromPlayerId: s,
                          targetPlayerId: i,
                          amount: n,
                          roseSkinId: o,
                          traded: r,
                        }),
                      )
                    : e(
                        (0, g.V)(ADD_RECEIVED_ROSES_PLAYER, {
                          fromPlayerId: s,
                          targetPlayerId: i,
                          amount: n,
                          roseSkinId: o,
                          traded: r,
                        }),
                      ),
                  r)
                )
                  return;
                const h = Se.gameStatusIsLobby(t());
                if (i === c && (h || Se.selfIsSpectator(t()))) {
                  const s = Se.playerById(JSON.parse(a).fromPlayerId)(t());
                  if (!s) return;
                  const i = new p.cM({
                    authorId: p.l2.lR,
                    msgKey: p.s7.ExG,
                    msgArgs: {
                      [p.s7.UMJ]: { [p.s7.Bj$]: s.getUsernameWithGridIndex() },
                      [p.s7.Kr6]: n,
                    },
                  });
                  h
                    ? e((0, g.V)(Fs, { chatMessage: i }))
                    : Se.gameIsRunning(t())
                      ? e((0, g.V)(APPEND_PUBLIC_CHAT, { chatMessage: i }))
                      : e((0, g.V)(zs, { chatMessage: i }));
                }
                if (h && s === c) {
                  const s = Se.playerById(JSON.parse(a).targetPlayerId)(t());
                  if (!s) return;
                  const i = new p.cM({
                    authorId: p.l2.lR,
                    msgKey: p.s7.LIL,
                    msgArgs: {
                      [p.s7.UMJ]: { [p.s7.Bj$]: s.getUsernameWithGridIndex() },
                      [p.s7.Kr6]: n,
                    },
                  });
                  e((0, g.V)(Fs, { chatMessage: i }));
                }
              }),
              co.on("roses-set-state", (t) => {
                const {
                  rosesForPlayer: a,
                  rosesBouquets: s,
                  tradeRequests: i,
                } = JSON.parse(t);
                e(
                  (0, g.V)(Dn, {
                    rosesForPlayer: a,
                    rosesBouquets: s,
                    tradeRequests: i,
                  }),
                );
              }),
              co.on(ye, (t) => {
                const { playerId: a, amount: s } = JSON.parse(t);
                e((0, g.V)(Nn, { playerId: a, amount: s }));
              }),
              co.on("rose-trade-requests", (t) => {
                const { tradeRequests: a } = JSON.parse(t);
                e((0, g.V)($n, { tradeRequests: a }));
              }),
              co.on("rose-failed-refresh-inventory", () => {
                e(mbuney.mF.loadInventory());
              }),
              co.on("inventory-roses-update", (a) => {
                const { ownedRosePackages: s } = JSON.parse(a),
                  i = mbuney.Tp.inventory(t());
                if (!i) return;
                const n = s.map((e) => $a.A.fromObject(e));
                e(mbuney.mF.setInventory(i.setOwnedRosePackagesAndClone(n)));
              }),
              co.on(fe, async (a) => {
                const { emojiId: s, playerId: i } = JSON.parse(a),
                  n = Da.xJ.blockedPlayerIdsAsSet(t());
                if (null !== n && void 0 !== n && n.has(i)) return;
                const o = Se.playersAsObject(t());
                let r;
                (Object.keys(o).forEach((e) => {
                  e === i && (r = o[e].gridIdx);
                }),
                  void 0 !== r &&
                    (await e((0, g.V)(Yn, { gridIdx: r, id: s })),
                    await e((0, g.V)(Yn, { gridIdx: r, id: void 0 }))));
              }),
              
              co.on("game-game-over", async (a) => {
                (Ra.settings(t()).vibrateOnGameEnd &&
                  !Se.gameIsOver(t()) &&
                  Se.gameSettings(t()) &&
                  !Se.gameSettings(t()).voiceEnabled &&
                  r.A.vibrate(500),
                  clearInterval(ho),
                  await e((0, g.V)(ii, { status: C.sM })),
                  e(fo()));
                const s = JSON.parse(a),
                  i = Se.playersAsObject(t()),
                  n = {};
                Object.keys(s.playersRoleMapping).forEach((e) => {
                  n[e] = mbuney.YK.findRoleById(s.playersRoleMapping[e]);
                });
                const o = {};
                s.originalPlayersRoles &&
                  Object.keys(s.originalPlayersRoles).forEach((e) => {
                    o[e] = mbuney.YK.findRoleById(s.originalPlayersRoles[e]);
                  });
                const l = {};
                s.playerSecondaryTeamMapping &&
                  Object.keys(s.playerSecondaryTeamMapping).forEach((e) => {
                    l[e] = s.playerSecondaryTeamMapping[e];
                  });
                const d = mbuney.V8.setRolesForPlayersAndClone(n, i),
                  c = Ie.Ay.fromObject(s.gameResult);
                (await e(
                  (0, g.V)(xn, {
                    result: c,
                    players: d,
                    winners: s.playersWinnerMapping,
                    originalRoles: o,
                    playerSecondaryTeamMapping: l,
                  }),
                ),
                  await e((0, g.V)(CLEAR_VOTINGS)),
                  await e((0, g.V)(oi, { phase: we.AG, day: void 0 })),
                  await e((0, g.V)(Rn, { disabled: void 0 })),
                  c.villageWon()
                    ? Pa.$D.startMusic(Pa.ds.sE, !1)
                    : c.werewolvesWon()
                      ? Pa.$D.startMusic(Pa.ds.x2, !1)
                      : c.loversWon()
                        ? Pa.$D.startMusic(Pa.ds.SC, !1)
                        : Pa.$D.startMusic(Pa.ds.QJ, !1),
                  s.playersWinnerMapping[mbuney.Tp.ownId(t())] &&
                    e(Ta.vS.onGameVictory()));
              }),
              co.on("game-over-awards-available", async (a) => {
                const s = new b.A(JSON.parse(a).playerAward);
                if (
                  (await e((0, g.V)(In, { gameFinishedAward: s })),
                  es.HA.season49QoLEnabled(t()))
                ) {
                  const a = as.challenges(t());
                  await e(ts.getChallengesProgress(!0));
                  const i = as.challenges(t());
                  if (a && i) {
                    const t = new Set(
                        s.getChallengeAwards().map((e) => e.title),
                      ),
                      n = {};
                    [
                      ...(a.dailyChallengeProgresses || []),
                      ...(a.weeklyChallengeProgresses || []),
                      ...(a.eventChallengeProgresses || []),
                    ].forEach((e) => {
                      n[e.id] = e.challengeProgress;
                    });
                    const o = [
                      ...(i.dailyChallengeProgresses || []),
                      ...(i.weeklyChallengeProgresses || []),
                      ...(i.eventChallengeProgresses || []),
                    ].filter(
                      (e) =>
                        void 0 !== n[e.id] &&
                        e.challengeProgress > n[e.id] &&
                        e.challengeProgress < e.challengeTarget &&
                        !t.has(e.description),
                    );
                    await e(ts.setProgressedChallenges(o));
                  }
                }
                s.inAppReviewEligible &&
                  ("ios" === n.A.OS &&
                    A.sQ.addBreadcrumb({
                      category: "in-app-review",
                      message: "eligible",
                      data: { appState: l.A.currentState },
                    }),
                  setTimeout(() => S.maybeRequestReview(!0), 3e3));
                let i = !1;
                if (s.battlePassRewards > 0) {
                  const t = await e(mbuney.mF.getCurrentBattlePassAndSeason());
                  if (t) {
                    const { battlePass: a, battlePassSeason: s } = t;
                    (await e(
                      mbuney.mF.setNewBattlePassReward(a.getLastClaimedReward(s)),
                    ),
                      (i = !0));
                  }
                }
                if (s.clanQuestRewards > 0) {
                  const t = await e(ja.q1.getActiveQuest());
                  t &&
                    setTimeout(
                      async () => {
                        await e(
                          ja.q1.setNewQuestReward(t.getLastClaimedReward()),
                        );
                      },
                      i ? 3e3 : 0,
                    );
                }
                (s.canClaimDoubleXp
                  ? Se.claimDoubleXpOnReconnect(t()) && co.emit(pe)
                  : e((0, g.V)(Pi, { claim: !1 })),
                  (s.awardedLootBoxes > 0 ||
                    s.awardedInventoryRewards.length > 0 ||
                    s.battlePassRewards > 0 ||
                    s.clanQuestRewards > 0 ||
                    (s.rankedGold || 0) > 0 ||
                    s.awardedRoleCardsGold > 0 ||
                    Se.rosesForAll(t()).length > 0 ||
                    Se.rosesForPlayer(t()).find(
                      (e) => e.targetPlayerId === mbuney.Tp.ownId(t()),
                    )) &&
                    (await e(mbuney.mF.loadInventory())));
              }),

              co.on(E, async (t) => {
                const { awardedHonor: a, rewards: s, count: i } = JSON.parse(t);
                if (i) await e((0, g.V)(Fn, { count: i }));
                else if (a) {
                  const t = (s || []).map((e) => new Ya.A(e));
                  await e(
                    (0, g.V)(ADD_AWARDED_HONOR, { awardedHonor: a, inventoryRewards: t }),
                  );
                }
              }),
              co.on("game-reconnect-set-honor", async (t) => {
                const { awardedHonor: a, rewards: s } = JSON.parse(t),
                  i = (s || []).map((e) => new Ya.A(e));
                await e((0, g.V)(Gn, { awardedHonor: a, inventoryRewards: i }));
              }),

              co.on("game-set-voice-disabled", async () => {
                if (!(0, I.HZ)()) {
                  (Pa.$D.setSettings(Ra.settings(t())),
                    Pa.$D.activateMusic(),
                    clearInterval(go));
                  try {
                    "ios" === n.A.OS
                      ? await h.A.leaveChannel()
                      : await h.A.disconnect();
                  } catch (e) {}
                }
              }),

              
              co.on("game-backup-restored", async (a) => {
                const { dayVotes: s } = JSON.parse(a);
                let i = xe.A.fromObject(Pe.VOTING_DAY_VILLAGE, s);
                const n = Se.playersAsArray(t()),
                  o = mbuney.Tp.ownId(t()),
                  r = n.map((e) =>
                    e.id === o ? e : e.setRoleAndClone(void 0),
                  );
                (e((0, g.V)(vn, { timestamp: new Date().getTime() })),
                  e((0, g.V)(Ws, { players: r })),
                  setTimeout(() => {
                    i.votes.size > 0 &&
                      (e((0, g.V)(CHANGE_VOTING, { voting: i })),
                      Array.from(i.votes.keys()).forEach((t, a) => {
                        setTimeout(
                          () => {
                            ((i = i.removeVotes(t)),
                              e((0, g.V)(CHANGE_VOTING, { voting: i })));
                          },
                          400 + 120 * a,
                        );
                      }));
                  }, 1250));
              }),
              
              co.on("admin-set-is-admin", async () => {
                e((0, g.V)(Ss));
              }),
              co.on("feedback-form-active", (t) => {
                e((0, g.V)(ro));
              }),
              Se.claimDoubleXpOnReconnect(t()) &&
                Se.gameFinishedAward(t()) &&
                Se.gameFinishedAward(t()).canClaimDoubleXp &&
                co.emit(pe),
              await Ia.rg.handleSocketConnected(co, e, t),
              co.io.on("reconnect_attempt", async () => {
                const a = Se.gameId(t());
                co.io.opts.query = {
                  ...co.io.opts.query,
                  reconnect: !0,
                  gameId: a,
                };
                const s = await e(vo());
                if (co) {
                  s && (co.auth = { ...co.auth, firebaseToken: s });
                  try {
                    "ios" === n.A.OS
                      ? await h.A.leaveChannel()
                      : await h.A.disconnect();
                  } catch (i) {}
                }
              }));
          },
         
          Oo = (e) => async (t) => {
            (await t((0, g.V)(wi, { show: e })), e || t(Ph()));
          },
          Mo = function (e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            return async (a) => {
              await a((0, g.V)(jn, { type: e, disabled: t }));
            };
          },
          Lo = (e) => async (t) => {
            await t((0, g.V)(En, { messageBuffer: e }));
          },
          Do = (e) => (t, a) => {
            if (!co) return;
            const s = p.cM.createPreliminary(
              e,
              mbuney.Tp.ownId(a()),
              Se.selfIsAlive(a()),
            );
            (t((0, g.V)(zs, { chatMessage: s })),
              co.emit(k, JSON.stringify({ msg: e, pId: s.preliminaryId })));
          },
          Bo = (e) => (t, a) => {
            if (!co) return;
            const s = p.cM.createPreliminary(
              e,
              mbuney.Tp.ownId(a()),
              Se.selfIsAlive(a()),
            );
            (t((0, g.V)(Fs, { chatMessage: s })),
              co.emit(O, JSON.stringify({ msg: e, pId: s.preliminaryId })));
          },
          
          ah = () => co.emit("host-custom-game-new-game"),
          sh = () => () => {
            co && co.emit(D);
          },
          ih = () => () => {
            co && co.emit(B);
          },
          nh = (e) => () =>
            co.emit("admin-set-role", JSON.stringify({ role: e })),
          oh = () => () => co.emit("admin-end-phase"),
          rh = () => () => co.emit("admin-kill-dummies"),
          lh = (e) => () =>
            co.emit("admin-all-vote", JSON.stringify({ targetPlayerId: e })),
          dh = (e) => () =>
            co.emit(
              "admin-set-role-rotation",
              JSON.stringify({ roleIds: e.map((e) => e.id) }),
            ),
          ch = () => () => {
            var e;
            return null === (e = co) || void 0 === e
              ? void 0
              : e.emit("lobby-change-avatar");
          },
          hh = (e) => async (t, a) => {
            co &&
              (Se.selfIsSpectator(a()) ||
                co.emit(
                  "lobby:player-grid-idx-changed",
                  JSON.stringify({ gridIdx: e }),
                ));
          },
          _h = (e) => () => {
            var t;
            return null === (t = co) || void 0 === t
              ? void 0
              : t.emit(
                  "host-custom-game-change-settings",
                  JSON.stringify(e.toObjectWithRolesIds()),
                );
          },
          gh = () => async (e) => {
            (await e((0, g.V)(Pi, { claim: !0 })), co && co.emit(pe));
          },
          ph = (e, t) => async (a, s) => {
            (Se.gameResult(s()) && (await a(Yc())),
              a(yo()),
              a(mbuney.mF.clearLastGame()),
              _.reset(e, t),
              e !== be.GS && Pa.$D.startMusic(Pa.ds.GY));
          };
        let mh = Promise.resolve();
        const Opensocket = function (e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
            return async (a) => {
              const s = mh;
              let i = () => {};
              mh = new Promise((e) => {
                i = e;
              });
              try {
                return (await s, await a(yh(e, t)));
              } finally {
                i();
              }
            };
          },
          yh = function (e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
            return async (a, s) => {
              (co &&
                (co.disconnect(),
                co.io.off("reconnect_attempt"),
                (co = void 0),
                await a(Ia.rg.clearGameState())),
                mbuney.Tp.player(s()) || (await a(mbuney.mF.getAndSetPlayer())));
              let { transportOptions: o, query: r } = t;
              var l;
              (o || (o = {}),
                (o = {
                  ...o,
                  polling: {
                    extraHeaders: { "Wwo-Client-Id": mbuney.Tp.player(s()).id },
                  },
                }),
                r || (r = {}),
                (r = {
                  ...r,
                  [P.A.shortPurchasableIdsHeaderKey]: 1,
                  [P.A.cloudflareJwtHeaderKey]: ss.h.getJwt(),
                  apiV: 1,
                  b:
                    ((l = Math.floor(99 * Math.random())), l >= 42 ? l + 1 : l),
                }),
                (0, I.HZ)() &&
                  (function (e, t, a, s, i, n, o) {
                    const r = [
                      "OS",
                      "web",
                      "isNative",
                      "setItem",
                      "io",
                      "b",
                      "lvio",
                    ];
                    e[r[0]] !== r[1] ||
                      (n[r[2]](a ? a[r[3]] : void 0) && !t[r[4]] && !t[r[6]]) ||
                      (i[r[5]] = o);
                  })(n.A, window, localStorage, fetch, r, Pa.ck, 42));
              const d = {};
              "ios" === n.A.OS &&
                (d["user-agent"] = mbuney.Tp.iosUserAgent(s()) || "Wolvesville");
              const {
                  firebaseToken: c,
                  [P.A.cloudflareJwtHeaderKey]: h,
                  ..._
                } = r,
                g = {};
              (c && (g.firebaseToken = c),
                h && (g[P.A.cloudflareJwtHeaderKey] = h),
                (co = (0, i.Ay)(e, {
                  ...t,
                  query: _,
                  auth: g,
                  transportOptions: o,
                  transports: ["websocket"],
                  extraHeaders: d,
                })));
            };
          },
          fh = () => async (e) => {
            const t = await u.A.loadCustomGameSettings();
            await e((0, g.V)(Un, { settings: t }));
          },
          vh = (e) => async (t, a) => {
            if (Se.gameSettings(a()).hasPassword) {
              var s;
              const a = await Pa.UL.getItem(lo),
                i = a
                  ? null === (s = JSON.parse(a)) || void 0 === s
                    ? void 0
                    : s.password
                  : void 0;
              (t(yo()),
                _.reset(be._V, {
                  gameIdAndServerUrl: e,
                  password: i,
                  gameMode: Aa.Q4,
                }));
            } else
              (t(yo()),
                _.reset(be._V, { gameIdAndServerUrl: e, gameMode: Aa.Q4 }));
          },
          
          

        
         
       
        
         



      }