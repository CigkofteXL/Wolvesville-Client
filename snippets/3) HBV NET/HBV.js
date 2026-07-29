97941: (e, t, a) => {
        "use strict";
        a.d(t, { A: () => y });
        var s = a(41600),
          i = a(43548);
        const n = "authtokens";
        const o = class {
          static async read() {
            const e = localStorage.getItem(n);
            if (e && "" !== e)
              try {
                return new i.A(JSON.parse(e));
              } catch (t) {
                return (s.V.logErrorDev(`Failed to parse ${e}`, t), null);
              }
          }
          static async write(e) {
            localStorage.setItem(n, JSON.stringify(e.toObject()));
          }
          static async clear() {
            localStorage.removeItem(n);
          }
        };
        var r = a(79705),
          l = a.n(r);
        const d = class {
          static parseIdTokenPayload(e) {
            const t = e.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"),
              a = decodeURIComponent(
                l()
                  .decode(t)
                  .split("")
                  .map(
                    (e) => `%${`00${e.charCodeAt(0).toString(16)}`.slice(-2)}`,
                  )
                  .join(""),
              );
            return JSON.parse(a);
          }
        };
        const c = class {
          constructor(e) {
            let { id: t, email: a } = e;
            ((this._id = t), (this._email = a));
          }
          get id() {
            return this._id;
          }
          get email() {
            return this._email;
          }
        };
        class h {
          static fromIdToken(e) {
            const t = d.parseIdTokenPayload(e);
            return new h({
              id: t.sub,
              firebaseId: t.firebaseId,
              email: t.email,
              emailVerified: t.emailVerified,
              providers: t.providers.map((e) => new c(e)),
            });
          }
          constructor(e) {
            let {
              id: t,
              firebaseId: a,
              email: s,
              emailVerified: i,
              providers: n,
            } = e;
            ((this._id = t),
              (this._firebaseId = a),
              (this._email = s),
              (this._emailVerified = i),
              (this._providers = n));
          }
          get id() {
            return this._id;
          }
          get firebaseId() {
            return this._firebaseId;
          }
          get email() {
            return this._email;
          }
          get emailVerified() {
            return this._emailVerified;
          }
          get providers() {
            return this._providers;
          }
        }
        const _ = h;
        var g = a(37170),
          p = a(6399),
          m = a(12958);
        class u {
          static async _assertInit() {
            var e;
            if (
              !this._initCompleted &&
              ((this._authTokens = await o.read()),
              this._setState(this._authTokens),
              (this._initCompleted = !0),
              (0, p.HZ)() &&
                null !== (e = this._authTokens) &&
                void 0 !== e &&
                e.refreshToken)
            )
              try {
                await this.getIdToken(!0);
              } catch (t) {}
          }
          static async setTokens(e) {
            e &&
              ((this._authTokens = e),
              this._setState(this._authTokens),
              await o.write(e));
          }
          static _setState(e) {
            if (null === e || void 0 === e || !e.idToken) return;
            const t = d.parseIdTokenPayload(e.idToken),
              {
                exp: a,
                email: s,
                emailVerified: i,
                emailVerificationRequired: n,
              } = t;
            ((this._idTokenExpiration = a),
              (this._email = s),
              (this._emailVerified = !!i),
              (this._emailVerificationRequired = n),
              (this._2FAEnabled = t["2fa"]));
          }
          static async getIdToken() {
            var e;
            let t =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
            if ((await this._assertInit(), this._authTokens)) {
              if (
                !this._idTokenExpiration ||
                new Date(1e3 * this._idTokenExpiration).getTime() -
                  new Date().getTime() <
                  3e5 ||
                t
              )
                if (this._authTokensGetPromise)
                  await this._authTokensGetPromise;
                else
                  try {
                    ((this._authTokensGetPromise = g.A.createIdToken(
                      this._authTokens.refreshToken,
                    ).then((e) => this.setTokens(e))),
                      await this._authTokensGetPromise);
                  } finally {
                    this._authTokensGetPromise = void 0;
                  }
              return null === (e = this._authTokens) || void 0 === e
                ? void 0
                : e.idToken;
            }
          }
          static async getRefreshToken() {
            var e;
            return (
              await this._assertInit(),
              null === (e = this._authTokens) || void 0 === e
                ? void 0
                : e.refreshToken
            );
          }
          static async getFirebaseIdToken() {
            const e = m.yn.currentUser();
            if (!e) return;
            let t = await e.getIdTokenResult(!1);
            if (t.claims && t.claims.exp) {
              const a = new Date(1e3 * t.claims.exp),
                s = new Date();
              a.getTime() - s.getTime() < 3e5 &&
                (t = await e.getIdTokenResult(!0));
            }
            return t.token;
          }
          static async getIdTokenOrFirebaseIdToken() {
            let e =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
            const t = await this.getIdToken(e);
            return t || this.getFirebaseIdToken();
          }
          static async userExists() {
            var e;
            return (
              await this._assertInit(),
              !(
                null === (e = this._authTokens) ||
                void 0 === e ||
                !e.idToken
              ) || !!m.yn.currentUser()
            );
          }
          static async userEmail() {
            var e, t, a, s;
            return (
              await this._assertInit(),
              null !== (e = this._authTokens) && void 0 !== e && e.idToken
                ? _.fromIdToken(this._authTokens.idToken).email
                : null === (t = m.yn.currentUser()) ||
                    void 0 === t ||
                    null === (a = t.providerData) ||
                    void 0 === a ||
                    null === (s = a[0]) ||
                    void 0 === s
                  ? void 0
                  : s.email
            );
          }
          static async userLoginProviders() {
            var e, t, a;
            return (
              await this._assertInit(),
              null !== (e = this._authTokens) && void 0 !== e && e.idToken
                ? _.fromIdToken(this._authTokens.idToken).providers || []
                : (null === (t = m.yn.currentUser()) ||
                  void 0 === t ||
                  null === (a = t.providerData) ||
                  void 0 === a
                    ? void 0
                    : a.map(
                        (e) => new c({ id: e.providerId, email: e.email }),
                      )) || []
            );
          }
          static async userIsGuest() {
            var e, t, a, s;
            return (
              await this._assertInit(),
              null !== (e = this._authTokens) && void 0 !== e && e.idToken
                ? (null === (t = _.fromIdToken(this._authTokens.idToken)) ||
                  void 0 === t ||
                  null === (a = t.providers) ||
                  void 0 === a
                    ? void 0
                    : a.length) <= 0
                : !(
                    null === (s = m.yn.currentUser()) ||
                    void 0 === s ||
                    !s.isAnonymous
                  )
            );
          }
          static async getEmail() {
            return (await this._assertInit(), this._email);
          }
          static async isEmailVerified() {
            return (await this._assertInit(), this._emailVerified);
          }
          static async isEmailVerificationRequired() {
            return (await this._assertInit(), this._emailVerificationRequired);
          }
          static async is2FAEnabled() {
            return (await this._assertInit(), !!this._2FAEnabled);
          }
          static async clearTokens() {
            ((this._authTokens = void 0),
              (this._idTokenExpiration = void 0),
              (this._email = void 0),
              (this._emailVerificationRequired = void 0));
            try {
              await o.clear();
            } catch (e) {
              s.V.logErrorDev("Clear tokens error", e);
            }
          }
          static async signOut() {
            await this.clearTokens();
            try {
              await m.yn.signOut();
            } catch (e) {
              s.V.logErrorDev("Firebase sign out error", e);
            }
          }
        }
        u._initCompleted = !1;
        const y = u;
      },

      37170: (e, t, a) => {
        "use strict";
        a.d(t, { A: () => g });
        var s = a(58370),
          i = a(43548),
          n = a(6399),
          o = a(34132),
          r = a(49927),
          l = a(60444),
          d = a(89275);
        const c = class {
          constructor(e) {
            let { qrCodeUrl: t, secret: a, accountName: s } = e;
            ((this._qrCodeUrl = t),
              (this._secret = a),
              (this._accountName = s));
          }
          get qrCodeUrl() {
            return this._qrCodeUrl;
          }
          get secret() {
            return this._secret;
          }
          get accountName() {
            return this._accountName;
          }
        };
        var h = a(25643);
        class _ {
          static signUpWithEmailAndPassword(e, t) {
            return this._createFetchRequest(
              "/players/signUpWithEmailAndPassword",
              "POST",
              { email: e, password: t, locale: this._getLocale() },
            ).then((e) => new i.A(e));
          }
          static signInWithEmailAndPassword(e, t, a) {
            return this._createFetchRequest(
              "/players/signInWithEmailAndPassword",
              "POST",
              {
                email: e,
                password: t,
                oneTimePassword: this._sanitizeOneTimePassword(a),
              },
            ).then((e) => new i.A(e));
          }
          static changeEmail(e, t, a, s) {
            return this._createFetchRequest("/players/changeEmail", "POST", {
              email: e,
              idToken: t,
              firebaseIdToken: a,
              oneTimePassword: this._sanitizeOneTimePassword(s),
            }).then((e) => (e ? new i.A(e) : void 0));
          }
          static changePassword(e, t, a, s) {
            return this._createFetchRequest("/players/changePassword", "POST", {
              password: e,
              idToken: t,
              firebaseIdToken: a,
              oneTimePassword: this._sanitizeOneTimePassword(s),
            }).then((e) => (e ? new i.A(e) : void 0));
          }
          static resetPassword(e) {
            return this._createFetchRequest("/players/resetPassword", "POST", {
              email: e,
            });
          }
          static signInWithGoogle(e, t) {
            return this._createFetchRequest(
              "/players/signInWithGoogle",
              "POST",
              {
                googleIdToken: e,
                oneTimePassword: this._sanitizeOneTimePassword(t),
                locale: this._getLocale(),
              },
            ).then((e) => new i.A(e));
          }
          static googleAuthorizationCodeToIdToken(e, t) {
            return this._createFetchRequest(
              "/players/googleAuthorizationCodeToIdToken",
              "POST",
              { googleOAuthClientId: e, googleAuthorizationCode: t },
            ).then((e) => e.googleIdToken);
          }
          static signInWithFacebook(e, t, a) {
            return this._createFetchRequest(
              "/players/signInWithFacebook",
              "POST",
              {
                facebookAccessToken: e,
                facebookAuthenticationToken: t,
                oneTimePassword: this._sanitizeOneTimePassword(a),
                locale: this._getLocale(),
              },
            ).then((e) => new i.A(e));
          }
          static signInWithApple(e, t, a) {
            return this._createFetchRequest(
              "/players/signInWithApple",
              "POST",
              {
                appleIdentityToken: e,
                appleNonce: t,
                oneTimePassword: this._sanitizeOneTimePassword(a),
                locale: this._getLocale(),
              },
            ).then((e) => new i.A(e));
          }
          static linkWithEmailAndPassword(e, t, a, s) {
            return this._createFetchRequest(
              "/players/linkWithEmailAndPassword",
              "POST",
              { email: e, password: t, idToken: a, firebaseIdToken: s },
            ).then((e) => (e ? new i.A(e) : void 0));
          }
          static linkWithGoogle(e, t, a) {
            return this._createFetchRequest("/players/linkWithGoogle", "POST", {
              googleIdToken: e,
              idToken: t,
              firebaseIdToken: a,
            }).then((e) => (e ? new i.A(e) : void 0));
          }
          static linkWithFacebook(e, t, a, s) {
            return this._createFetchRequest(
              "/players/linkWithFacebook",
              "POST",
              {
                facebookAccessToken: e,
                facebookAuthenticationToken: t,
                idToken: a,
                firebaseIdToken: s,
              },
            ).then((e) => (e ? new i.A(e) : void 0));
          }
          static linkWithApple(e, t, a, s) {
            return this._createFetchRequest("/players/linkWithApple", "POST", {
              appleIdentityToken: e,
              appleNonce: t,
              idToken: a,
              firebaseIdToken: s,
            }).then((e) => (e ? new i.A(e) : void 0));
          }
          static unlinkGoogle(e, t, a) {
            return this._createFetchRequest("/players/unlinkGoogle", "POST", {
              idToken: e,
              firebaseIdToken: t,
              oneTimePassword: this._sanitizeOneTimePassword(a),
            }).then(() => {});
          }
          static unlinkFacebook(e, t, a) {
            return this._createFetchRequest("/players/unlinkFacebook", "POST", {
              idToken: e,
              firebaseIdToken: t,
              oneTimePassword: this._sanitizeOneTimePassword(a),
            }).then(() => {});
          }
          static unlinkApple(e, t, a) {
            return this._createFetchRequest("/players/unlinkApple", "POST", {
              idToken: e,
              firebaseIdToken: t,
              oneTimePassword: this._sanitizeOneTimePassword(a),
            }).then(() => {});
          }
          static async createIdToken(e) {
            return this._createFetchRequest("/players/createIdToken", "POST", {
              refreshToken: e,
            }).then((e) => new i.A(e));
          }
          static signOut(e) {
            return this._createFetchRequest("/players/signOut", "POST", {
              refreshToken: e,
            }).then(() => {});
          }
          static signOutOfAllDevices(e, t, a) {
            return this._createFetchRequest(
              "/players/signOutOfAllDevices",
              "POST",
              {
                idToken: e,
                firebaseIdToken: t,
                oneTimePassword: this._sanitizeOneTimePassword(a),
              },
            ).then(() => {});
          }
          static migrate(e) {
            return this._createFetchRequest("/players/migrate", "POST", {
              firebaseIdToken: e,
              locale: this._getLocale(),
            }).then((e) => (e ? new i.A(e) : void 0));
          }
          static resendEmailVerificationEmail(e) {
            return this._createFetchRequest(
              "/players/verifyEmail/resendVerificationEmail",
              "POST",
              { idToken: e },
            ).then(() => {});
          }
          static add2FA(e) {
            return this._createFetchRequest("/players/2fa", "POST", {
              refreshToken: e,
            }).then((e) => new c(e));
          }
          static verify2FA(e, t) {
            return this._createFetchRequest("/players/2fa/verify", "PUT", {
              idToken: e,
              oneTimePassword: this._sanitizeOneTimePassword(t),
            }).then((e) => e.backupCodes);
          }
          static remove2FA(e, t) {
            return this._createFetchRequest("/players/2fa", "DELETE", {
              idToken: e,
              oneTimePassword: this._sanitizeOneTimePassword(t),
            }).then(() => {});
          }
          static refresh2FABackupCodes(e, t) {
            return this._createFetchRequest(
              "/players/2fa/refreshCodes",
              "PUT",
              { idToken: e, oneTimePassword: this._sanitizeOneTimePassword(t) },
            ).then((e) => e.backupCodes);
          }
          static async _createFetchRequest(e, t, i) {
            let r =
                arguments.length > 3 && void 0 !== arguments[3]
                  ? arguments[3]
                  : 0,
              c =
                arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
            c &&
              (await h.A.createNewTurnstileJwt(
                (null === i || void 0 === i ? void 0 : i.idToken) ||
                  (null === i || void 0 === i ? void 0 : i.firebaseIdToken),
                !0,
                "api-client-auth",
              ));
            const _ = { ...this._headers };
            return (
              h.A.getJwt() && (_[s.A.cloudflareJwtHeaderKey] = h.A.getJwt()),
              (0, n.HZ)() && (_["X-Auth-Transport"] = "cookie"),
              fetch(`${s.A.api.authUrl}${e}`, {
                method: t,
                headers: _,
                credentials: (0, n.HZ)() ? "include" : "same-origin",
                body: i ? JSON.stringify(i) : void 0,
              })
                .catch(() => Promise.reject({ message: d.CONNECTION_FAILED }))
                .then(async (s) => {
                  if (!s.ok) {
                    if (503 === s.status) {
                      const e = (await s.json()).message.toLowerCase();
                      if ("maintenance mode" === e) {
                        const { NavigationService: t } = a(59673);
                        if (t.getCurrentScreenId() !== l.Hb)
                          return (t.reset(l.Hb), Promise.reject(e));
                      }
                    }
                    if (s.status >= 400 && s.status < 500) {
                      const a = await s.text();
                      if (
                        a.includes(">403 Forbidden<") ||
                        a
                          .toLowerCase()
                          .includes("you are being rate limited") ||
                        429 === s.status
                      )
                        return Promise.reject({
                          code: 403,
                          message: d.TOO_MANY_REQUESTS,
                        });
                      if (
                        403 === s.status &&
                        !c &&
                        a.toLowerCase().includes("cloudflare jwt")
                      )
                        return this._createFetchRequest(e, t, i, r, !0);
                      if (403 === s.status && a.includes("Cloudflare"))
                        return Promise.reject({
                          code: 403,
                          message: d.CLOUDFLARE_BLOCKED,
                        });
                      try {
                        return Promise.reject(JSON.parse(a));
                      } catch (n) {
                        return Promise.reject(a);
                      }
                    }
                    return r >= 3
                      ? Promise.reject(s)
                      : (await o.N5.timeout(1e3 * 2 ** (r + 1)),
                        this._createFetchRequest(e, t, i, r + 1, c));
                  }
                  if (204 !== s.status) return s.json();
                })
            );
          }
          static _getLocale() {
            const e = r.P$.getInterfaceLanguage();
            return -1 !== e.indexOf("-") ? e.substring(0, e.indexOf("-")) : e;
          }
          static _sanitizeOneTimePassword(e) {
            if (!e) return;
            const t = parseInt(e.substring(0, 8), 10);
            return Number.isNaN(t) ? void 0 : t;
          }
        }
        _._headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };
        const g = _;
      },

            4600: (e, t, a) => {
        "use strict";
        a.d(t, { z: () => _, h: () => r.A });
        var s = a(66685),
          i = a(16458),
          n = a(68751),
          o = a(8916),
          r = a(25643),
          l = a(97941),
          d = a(6399),
          c = a(59017);
        class h extends s.Component {
          constructor() {
            (super(...arguments),
              (this.state = { appState: i.A.currentState }),
              (this._handleAppStateChange = (e) => {
                (0, d.uI)() ||
                  (this.state.appState.match(/inactive|background/) &&
                  "active" === e
                    ? clearInterval(this._timer)
                    : !this.state.appState.match(/active/) ||
                      ("inactive" !== e && "background" !== e) ||
                      this._scheduleTokenFetch(),
                  this.setState({ appState: e }));
              }),
              (this._scheduleTokenFetch = async () => {
                clearInterval(this._timer);
                try {
                  r.A.createNewTurnstileJwt(
                    await l.A.getIdTokenOrFirebaseIdToken(),
                    !1,
                    "schedule-initial",
                  );
                } catch (e) {}
                this._timer = setInterval(async () => {
                  try {
                    r.A.createNewTurnstileJwt(
                      await l.A.getIdTokenOrFirebaseIdToken(),
                      !1,
                      "schedule-reoccurring",
                    );
                  } catch (e) {}
                }, 6e5);
              }));
          }
          componentDidMount() {
            ((this._appStateListener = i.A.addEventListener(
              "change",
              this._handleAppStateChange,
            )),
              this._scheduleTokenFetch());
          }
          componentWillUnmount() {
            var e;
            (null === (e = this._appStateListener) ||
              void 0 === e ||
              e.remove(),
              clearInterval(this._timer));
          }
          render() {
            return (0, c.jsx)(o.A, {});
          }
        }
        const _ = (0, n.Ng)()(h);
      },
            12958: (e, t, a) => {
        "use strict";
        a.d(t, {
          IW: () => w,
          F$: () => s,
          M8: () => S,
          qK: () => P,
          Vj: () => y.A,
          pb: () => g,
          dJ: () => A,
          yn: () => r,
          O_: () => l,
          UZ: () => _,
          uU: () => p.A,
          Fr: () => n,
          xB: () => u,
          B1: () => f,
          sQ: () => i.A,
          SY: () => m,
          Zp: () => v.A,
        });
        const s = {
          signIn: async () =>
            new Promise((e, t) => {
              try {
                const t = document.querySelector("pwa-auth");
                (t.addEventListener("signin-completed", (t) => {
                  var a, s, i;
                  const n = t.detail;
                  n.error
                    ? e(!1)
                    : e({
                        appleIdentityToken:
                          null === (a = n.providerData) ||
                          void 0 === a ||
                          null === (s = a.authorization) ||
                          void 0 === s
                            ? void 0
                            : s.id_token,
                        appleNonce:
                          null === (i = n.providerData) || void 0 === i
                            ? void 0
                            : i.appleNonce,
                      });
                }),
                  t.signIn("Apple"));
              } catch (a) {
                t(a);
              }
            }),
          signOut: () => {},
          isSupported: !0,
        };
        var i = a(12296);
        const n = {
          TriggerType: {},
          AndroidStyle: {},
          EventType: {},
          cancelNotification: () => {},
          cancelAllNotifications: () => {},
          displayNotification: () => {},
          onForegroundEvent: () => {},
          createChannel: () => {},
          createTriggerNotification: () => {},
        };
        var o = a(8587);
        (a(30868), a(66402));
        o.A.initializeApp({
          apiKey: "AIzaSyCH9qHx3eLCfXqodcKKBshE9BKfTLAioRo",
          authDomain: "werewolf-online-191812.firebaseapp.com",
          databaseURL: "https://werewolf-online-191812.firebaseio.com",
          projectId: "werewolf-online-191812",
          storageBucket: "werewolf-online-191812.appspot.com",
          messagingSenderId: "982334079049",
          appId: "1:982334079049:web:f1ad91fe8ac2ee5d407f98",
          measurementId: "G-JWTKK25N8R",
          automaticDataCollectionEnabled: !1,
        });
        const r = {
            currentUser: () => o.A.auth().currentUser,
            signOut: () => o.A.auth().signOut(),
            onAuthStateChanged: (e) => o.A.auth().onAuthStateChanged(e),
            signInWithEmailAndPassword: (e, t) =>
              o.A.auth().signInWithEmailAndPassword(e, t),
            createUserWithEmailAndPassword: (e, t) =>
              o.A.auth().createUserWithEmailAndPassword(e, t),
            signInWithCredential: (e) => o.A.auth().signInWithCredential(e),
            GoogleAuthProvider: o.A.auth.GoogleAuthProvider,
            FacebookAuthProvider: o.A.auth.FacebookAuthProvider,
            OAuthProvider: o.A.auth.OAuthProvider,
          },
          l = {
            getToken: () => o.A.messaging().getToken(),
            onMessage: (e) => o.A.messaging().onMessage(e),
          };
        var d = a(37170),
          c = a(58370);
        let h;
        const _ = {
            setAuthorizationCode: (e) => {
              h = e;
            },
            signIn: async () =>
              d.A.googleAuthorizationCodeToIdToken(
                c.A.googleOAuthClientIdWeb,
                h,
              ),
            signOut: async () => {},
          },
          g = {
            signIn: async () =>
              new Promise((e, t) => {
                try {
                  const t = document.querySelector("pwa-auth");
                  (t.addEventListener("signin-completed", (t) => {
                    var a, s;
                    const i = t.detail;
                    i.error
                      ? e({})
                      : e({
                          accessToken:
                            null === (a = i.providerData) ||
                            void 0 === a ||
                            null === (s = a.auth) ||
                            void 0 === s
                              ? void 0
                              : s.accessToken,
                        });
                  }),
                    t.signIn("Facebook"));
                } catch (a) {
                  t(a);
                }
              }),
            signOut: () => {
              var e;
              null === (e = window.FB) || void 0 === e || e.logout();
            },
          };
        var p = a(45880);
        const m = { open: () => {} },
          u = {
            check: () => {},
            request: () => {},
            PERMISSIONS: {},
            RESULTS: {},
          };
        var y = a(22944);
        const f = void 0;
        var v = a(22439),
          w = (a(2081), a(34366)),
          b = a(66685),
          x = a(23283),
          I = a(59017);
        const A = (e) => {
            const { style: t, children: a, filterSettings: s, ...i } = e;
            return (0, I.jsx)(x.A, {
              ...i,
              style: [t, { filter: "sepia(0)" }],
              children: b.cloneElement(a, {
                style: {
                  filter: `brightness(${100 * s.brightness}%) sepia(${100 * s.sepia}%) `,
                },
              }),
            });
          },
          S = {
            addEventListener: () => ({ remove: () => {} }),
            exitApp: () => {},
          },
          P = {
            getDeviceId: async () => null,
            getDeviceSecurityLevel: async () => null,
          };
      },
      25643: (e, t, a) => {
        "use strict";
        a.d(t, { A: () => d });
        var s = a(8916),
          i = a(58370);
        const n = class {
          static async createCloudflareTurnstileJwt(e, t, a) {
            return fetch(`${i.A.api.authUrl}/cloudflareTurnstile/verify`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: e, siteKey: t, idToken: a }),
            }).then((e) => {
              if (e.ok) return e.json().then((e) => e.jwt);
            });
          }
        };
        var o = a(95944),
          r = a(6399);
        class l {
          static async init() {
            this._jwt || (this._jwt = await o.A.getJwt());
          }
          static createNewTurnstileJwt(e, t, a) {
            return o.A.getResetGlobalPromise()
              .then(
                (e) => (
                  e && (this._createNewJwtPromise = void 0),
                  o.A.setResetGlobalPromise(!1)
                ),
              )
              .then(() => {
                if (this._createNewJwtPromise) {
                  if (t === this._forceShowVisibleWidget)
                    return this._createNewJwtPromise;
                  if (!t) return this._createNewJwtPromise;
                }
                let i = (0, r.HZ)()
                  ? "0x4AAAAAADl76c42d_fnB2_l"
                  : t
                    ? "0x4AAAAAAATLZulAZ6iRPZsU"
                    : "0x4AAAAAAATLZS5RyqlMGxsL";
                this._forceShowVisibleWidget = t;
                const d = s.A.getToken(i, t, a)
                  .then((t) => n.createCloudflareTurnstileJwt(t, i, e))
                  .then((e) => {
                    if (e)
                      return o.A.setJwt(e).then(() => ((this._jwt = e), e));
                  })
                  .catch((s) => {
                    if (s && !a.endsWith("-retry-retry-retry"))
                      return (
                        this._createNewJwtPromise === d &&
                          (this._createNewJwtPromise = void 0),
                        l.createNewTurnstileJwt(e, t, `${a}-retry`)
                      );
                  })
                  .finally(() => {
                    this._createNewJwtPromise === d &&
                      (this._createNewJwtPromise = void 0);
                  });
                return (
                  (this._createNewJwtPromise = d),
                  this._createNewJwtPromise
                );
              });
          }
          static getJwt() {
            return this._jwt;
          }
          static clearCreateNewTurnstileJwtPromise() {
            this._createNewJwtPromise = void 0;
          }
        }
        l._forceShowVisibleWidget = !1;
        const d = l;
      },
            58370: (e, t, a) => {
        "use strict";
        a.d(t, { A: () => r });
        var s = a(2723),
          i = (a(38826), a(33517)),
          n = a(6399);
        const o = {
          facebookUrl: "https://www.facebook.com/wolvesville.wov",
          twitterUrl: "https://twitter.com/wolvesville_app",
          discordInviteUrl: "https://discord.gg/wolvesville",
          instagramAccount: "wolvesville.wov",
          instagramUrl: "https://www.instagram.com/wolvesville.wov/",
          redditUrl: "https://www.reddit.com/r/werewolfonline/",
          supportMail: "howl@wolvesville.com",
          vouchersUrl: "https://vouchers.wolvesville.com/",
          androidPackageId: "com.werewolfapps.online",
          iosBundleId: "com.werewolfapps.online",
          appStoreId: "1394503496",
          paddleClientApiToken: "live_071b8a00f408b9a136a39d41979",
          tenjinApiKey: "GCEDFYVUXQX2MTDR29QW7PAEM6GBGRVF",
          playerIdIOSReview: "f2bd944f-22e4-48b8-8a67-2685d4132370",
          api: {
            authUrl: (0, n.HZ)()
              ? "https://auth.wolvesville.com"
              : "https://auth.api-wolvesville.com",
            coreUrl: "https://core.api-wolvesville.com",
            gamesUrl:
              (0, n.HZ)() && "dev.wolvesville.com" === window.location.hostname
                ? "https://game-dev.api-wolvesville.com"
                : "https://game.api-wolvesville.com",
            gamesUrlAsia: "https://game-asia.api-wolvesville.com",
            originUrl: "https://api-origin.wolvesville.com",
            cosmeticsCdnUrl: "https://cdn2.wolvesville.com",
            avatarsCdnUrl: "https://cdn-avatars2.wolvesville.com",
            profileImagesCdnUrl: "https://profiles.wolvesville.com",
            paddle: "https://api.paddle.com",
          },
          shortPurchasableIdsHeaderKey: "ids",
          cloudflareJwtHeaderKey: "Cf-JWT",
          webLocalStorageModifiedHeaderKey: "wlsm",
          avatar: { smallDefaultBodyWidth: 37, largeDefaultBodyWidth: 186 },
          firebaseIosClientId:
            "982334079049-6dohelbvo5ju4i8mogj4injttupv5h6r.apps.googleusercontent.com",
          firebaseIosClientIdDEV:
            "67665629654-kt1dpu3a16ro7p7ll44i23igu8oqqcku.apps.googleusercontent.com",
          googleOAuthClientIdWeb:
            "982334079049-ogsrm6s2c46dmke9gg62j31vk0p71atl.apps.googleusercontent.com",

          votingGalleryUploadDesignsUrl:
            "https://goo.gl/forms/xP3suiuyvKkDMXV42",
          wolvesvilleWebUrl: "https://www.wolvesville.com",
          wolvesvilleLandingUrl: "https://app.wolvesville.com",
          cloudflareTurnstileUrl: "https://verify.wolvesville.com",
          discordApplicationId: "672188101707169852"
        }
      },
            8916: (e, t, a) => {
        "use strict";
        a.d(t, { A: () => x });
        var s = a(66685),
          i = a(29742),
          n = a(2717),
          o = a(23283),
          r = a(20141),
          l = a(38524),
          d = a(58370),
          c = a(79337),
          h = a(34132),
          _ = a(12296),
          g = a(17429),
          p = a(23857),
          m = a(95944),
          u = a(60444),
          y = a(49927),
          f = a(6399),
          v = a(59017);
        const w = i.A.create({
          containerInner: { alignItems: "center" },
          containerWebView: {
            width: (0, f.HZ)() ? 400 : 340,
            height: 120,
            borderRadius: 4,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
          },
          webView: {
            width: (0, f.HZ)() ? 400 : 340,
            height: 120,
            backgroundColor: "transparent",
          },
          textStuck: {
            color: g.textDark,
            marginTop: 16,
            backgroundColor: "white",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 4,
            fontWeight: "bold",
          },
        });
        class b extends s.Component {
          constructor() {
            (super(...arguments),
              (this.state = {
                sequenceNumber: 0,
                resolve: void 0,
                reject: void 0,
                forceShowVisibleWidget: !1,
                siteKey: "",
                showStuckHelp: !1,
                origin: void 0,
              }),
              (this._handleMessage = (e) => {
                const {
                  resolve: t,
                  reject: a,
                  sequenceNumber: s,
                  origin: i,
                } = this.state;
                let n, o;
                ((0, f.HZ)()
                  ? ({ token: n, error: o } = e)
                  : ({ token: n, error: o } = JSON.parse(e.nativeEvent.data)),
                  _.A.addBreadcrumb({
                    message: "handle-message",
                    category: "cloudflare-turnstile",
                    data: {
                      resolve: !!t,
                      reject: !!a,
                      token: !!n,
                      error: o,
                      sequenceNumber: s,
                      origin: i || "no-state",
                    },
                  }),
                  n ? t && t(n) : a && a(o),
                  this.setState({ resolve: void 0, reject: void 0 }),
                  clearTimeout(this._timerStuckHelp));
              }),
              (this._handleClickStuckHelp = () => {
                (this.setState({ resolve: void 0, reject: void 0 }),
                  m.A.setResetGlobalPromise(!0));
                const e = a(89384);
                (e.isGameLobbyInForeground() || e.isGameInForeground()) &&
                  e.reset(u.bn);
              }));
          }
          static async getToken(e, t, a) {
            if (
              (_.A.addBreadcrumb({
                message: "get-token",
                category: "cloudflare-turnstile",
                data: {
                  siteKey: e.slice(-5),
                  forceShowVisibleWidget: t,
                  viewSingletonExists: !!b._instance,
                  stateRejectExists: !!(b._instance.state || {}).reject,
                  sequenceNumber:
                    ((b._instance.state || {}).sequenceNumber || 0) + 1,
                  origin: a,
                },
              }),
              b._instance)
            )
              return new Promise(async (s, i) => {
                const n = b._instance.state || {};
                (n.reject && n.reject(),
                  b._instance.setState({
                    resolve: s,
                    reject: i,
                    sequenceNumber: (n.sequenceNumber || 0) + 1,
                    forceShowVisibleWidget: t,
                    siteKey: e,
                    origin: a,
                  }));
              });
          }
          componentDidMount() {
            (b._instance, (b._instance = this));
          }
          componentWillUnmount() {
            (b._instance === this && (b._instance = void 0),
              clearTimeout(this._timerStuckHelp),
              (0, f.HZ)() &&
                b._turnstileWidgetId &&
                window.turnstile &&
                (window.turnstile.remove(b._turnstileWidgetId),
                (b._turnstileWidgetId = void 0)));
          }
          async componentDidUpdate(e, t) {
            (this.state.sequenceNumber > t.sequenceNumber &&
              this.state.forceShowVisibleWidget &&
              (this._timerStuckHelp = setTimeout(() => {
                this.setState({ showStuckHelp: !0 });
              }, 1e4)),
              (0, f.HZ)() &&
                this.state.sequenceNumber !== t.sequenceNumber &&
                (window.turnstile ||
                  (await h.N5.retryWithExponentialBackoff(
                    () =>
                      h.EO.loadScript(
                        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
                      ),
                    3,
                  )),
                b._turnstileWidgetId &&
                  window.turnstile.remove(b._turnstileWidgetId),
                (b._turnstileWidgetId = window.turnstile.render(
                  "#turnstile-widget",
                  {
                    sitekey: this.state.siteKey,
                    retry: "never",
                    "refresh-expired": "never",
                    callback: (e) => this._handleMessage({ token: e }),
                    "error-callback": (e) => this._handleMessage({ error: e }),
                    "before-interactive-callback": () => {
                      this.state.forceShowVisibleWidget ||
                        this._handleMessage({ error: "interactive-required" });
                    },
                    action: n.A.OS,
                  },
                ))));
          }
          render() {
            const {
              resolve: e,
              reject: t,
              forceShowVisibleWidget: a,
              siteKey: s,
              sequenceNumber: i,
              showStuckHelp: h,
            } = this.state;
            return e && t
              ? (0, v.jsx)(
                  o.A,
                  {
                    style: [
                      c.A.positionAbsoluteTopLeftRightBottomCenter,
                      {
                        backgroundColor: "#000000AA",
                        opacity: a ? 1 : 0,
                        zIndex: 1e4,
                        elevation: 1e4,
                        pointerEvents: a ? "auto" : "none",
                      },
                    ],
                    children: (0, v.jsxs)(o.A, {
                      style: w.containerInner,
                      children: [
                        (0, v.jsxs)(o.A, {
                          style: w.containerWebView,
                          children: [
                            !(0, f.HZ)() &&
                              (0, v.jsx)(l.S, {
                                originWhitelist: ["*"],
                                onMessage: this._handleMessage,
                                source: {
                                  uri: `${d.A.cloudflareTurnstileUrl}?siteKey=${s}&action=${n.A.OS}`,
                                },
                                style: w.webView,
                                scalesPageToFit: !1,
                                showsHorizontalScrollIndicator: !1,
                                showsVerticalScrollIndicator: !1,
                              }),
                            (0, f.HZ)() &&
                              (0, v.jsx)(o.A, { nativeID: "turnstile-widget" }),
                          ],
                        }),
                        h &&
                          (0, v.jsx)(p.A, {
                            onPress: this._handleClickStuckHelp,
                            children: (0, v.jsx)(r.A, {
                              style: w.textStuck,
                              children: y.P$.cloudflare_help_stuck,
                            }),
                          }),
                      ],
                    }),
                  },
                  i.toString(),
                )
              : null;
          }
        }
        const x = b;
      },
            58709: (t, a, s) => {
        "use strict";
        s.d(a, { A: () => u });
        var i,
          n,
          o,
          r = s(60444),
          l = s(58370);
        const d =
          null === (i = window) ||
          void 0 === i ||
          null === (n = i.localStorage) ||
          void 0 === n ||
          null === (o = n.setItem) ||
          void 0 === o
            ? void 0
            : o.toString();
        const c = class {
          static checkLocalStorageFunctionsOverwritten() {
            var e, t, a;
            return (
              !!d &&
              d !==
                (null === (e = window) ||
                void 0 === e ||
                null === (t = e.localStorage) ||
                void 0 === t ||
                null === (a = t.setItem) ||
                void 0 === a
                  ? void 0
                  : a.toString())
            );
          }
        };
        var h = s(49927),
          _ = s(6399),
          g = s(12958);
        const p = Math.random().toString(),
          m = async function (t, a, i, n) {
            var o;
            let d =
                arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
              u =
                arguments.length > 5 && void 0 !== arguments[5] && arguments[5];
            const { NavigationService: y } = s(59673),
              f = s(97941).A,
              v = s(25643).A,
              w = await f.getIdTokenOrFirebaseIdToken(d);
            u && (await v.createNewTurnstileJwt(w, !0, "api-client-core"));
            const b = {
              method: a || "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: w ? `Bearer ${w}` : void 0,
                [l.A.shortPurchasableIdsHeaderKey]: 1,
                [l.A.cloudflareJwtHeaderKey]: v.getJwt(),
              },
            };
            ((0, _.HZ)() &&
              c.checkLocalStorageFunctionsOverwritten() &&
              (b.headers[l.A.webLocalStorageModifiedHeaderKey] = 1),
              i && (b.body = JSON.stringify(i)),
              n && n && (b.headers["Wwo-Client-Id"] = p));
            const x = await fetch(t, b);
            let I;
            const A =
                !(
                  (null === (o = x.headers) || void 0 === o
                    ? void 0
                    : o.get("content-type")) || ""
                ).includes("application/json") && 204 !== x.status,
              S = 401 === x.status || 403 === x.status || 503 === x.status;
            if (
              ((A || S) && (I = await x.clone().text()),
              A &&
                null != I &&
                ((e) => {
                  const t = e.trimStart().charAt(0);
                  return "<" === t || "C" === t;
                })(I))
            ) {
              g.sQ.addBreadcrumb({
                category: "cloudflare-block",
                message: `Non-JSON response: ${a || "GET"} ${t} \u2192 ${x.status}`,
                data: {
                  url: t,
                  method: a || "GET",
                  status: x.status,
                  bodySnippet: I.substring(0, 500),
                },
                level: "warning",
              });
              const e = new Error(
                `Non-JSON response: ${a || "GET"} ${t} (${x.status})`,
              );
              ((e.code = x.status), (x.json = () => Promise.reject(e)));
            }
            if (401 === x.status && (await f.isEmailVerificationRequired()))
              y.getCurrentScreenId() !== r.cZ && y.reset(r.cZ);
            else if (401 !== x.status || d)
              if (403 !== x.status || u) {
                if (429 === x.status)
                  y.isScreenInForeground(r.wG) ||
                    y.push(r.wG, {
                      title: h.P$.common_error,
                      msg: h.P$.error_too_many_requests_msg,
                    });
                else if (503 === x.status)
                  try {
                    var P;
                    "maintenance mode" ===
                      (null === (P = JSON.parse(I || "").message) ||
                      void 0 === P
                        ? void 0
                        : P.toLowerCase()) &&
                      y.getCurrentScreenId() !== r.Hb &&
                      y.reset(r.Hb);
                  } catch (e) {}
              } else {
                var C;
                if (
                  null !== (C = I) &&
                  void 0 !== C &&
                  C.toLowerCase().includes("cloudflare jwt")
                )
                  return m(t, a, i, n, d, !0);
              }
            else {
              var T;
              if (
                null !== (T = I) &&
                void 0 !== T &&
                T.toLowerCase().includes(
                  "credentials are required to access this resource",
                )
              )
                return m(t, a, i, n, !0);
            }
            return x;
          },
          u = m;
      },
      95944: (e, t, a) => {
        "use strict";
        a.d(t, { A: () => o });
        var s = a(34132);
        const i = "cloudflare-turnstile-jwt",
          n = "cloudflare-turnstile-reset-global-promise";
        const o = class {
          static getJwt() {
            return s.UL.getItem(i);
          }
          static async setJwt(e) {
            await s.UL.setItem(i, e);
          }
          static async getResetGlobalPromise() {
            return "true" === (await s.UL.getItem(n));
          }
          static async setResetGlobalPromise(e) {
            await s.UL.setItem(n, e ? "true" : "false");
          }
        };
      },
