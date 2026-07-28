using System;
using System.Collections.Concurrent;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Titanium.Web.Proxy;
using Titanium.Web.Proxy.EventArguments;
using Titanium.Web.Proxy.Models;
using api.varietyproxys.com.tr.Entities;

namespace api.varietyproxys.com.tr.Services
{
    public class ProxyManager
    {
        private ProxyServer? _proxyServer;

        // 🔥 Key artık Email oldu. Değer ise proxy ayarları ve bot şifresi tuple olarak tutuluyor panpa
        private readonly ConcurrentDictionary<string, (ExternalProxy proxy, string password)> _botProxies = new ConcurrentDictionary<string, (ExternalProxy proxy, string password)>();

        // 🔥 ARABİRİM İÇİN CANLI LOG KUYRUĞU
        public readonly ConcurrentQueue<string> LiveLogs = new ConcurrentQueue<string>();

        public void AddLog(string message)
        {
            string timeStamp = DateTime.Now.ToString("HH:mm:ss");
            LiveLogs.Enqueue($"[{timeStamp}] {message}");

            while (LiveLogs.Count > 50)
            {
                LiveLogs.TryDequeue(out _);
            }
        }

        public void StartProxy(int port = 8888)
        {
            _proxyServer = new ProxyServer();
            _proxyServer.ConnectionTimeOutSeconds = 1800;
            _proxyServer.EnableConnectionPool = true;
            _proxyServer.TcpTimeWaitSeconds = 300;

            // 🔥 ZIRHLI AUTH KONTROLÜ: Playwright'ın bastığı Mail ve Şifreyi burada tokatlıyoruz kanka
            _proxyServer.ProxyBasicAuthenticateFunc = async (session, username, password) =>
            {
                if (_botProxies.TryGetValue(username, out var botData) && botData.password == password)
                {
                    session.UserData = username; // Oturuma email adresini mühürle
                    return true;
                }

                AddLog($"[SİBER ENGEL] Yetkisiz proxy kullanım girişimi reddedildi! Kullanıcı: {username}");
                return false;
            };

            var explicitEndPoint = new ExplicitProxyEndPoint(IPAddress.Any, port, true);
            explicitEndPoint.BeforeTunnelConnectRequest += OnBeforeTunnelConnectRequest;

            _proxyServer.BeforeRequest += OnBeforeRequest;
            _proxyServer.BeforeResponse += OnBeforeResponse;

            _proxyServer.AddEndPoint(explicitEndPoint);
            _proxyServer.Start();

            AddLog($"[SİSTEM] Ana Trafik İstasyonu {port} portunda devriyeye başladı.");
        }

        // 🔥 FSM'den gelen mühimmatı RAM hafıza kartına işleyen metot
        public void SyncBotProxy(string email, string password, ProxyEntity proxy)
        {
            if (string.IsNullOrEmpty(email)) return;

            var extProxy = new ExternalProxy
            {
                HostName = proxy.Ip,
                Port = proxy.Port,
                UserName = proxy.Username,
                Password = proxy.Password
            };

            _botProxies.AddOrUpdate(email, (extProxy, password), (key, oldValue) => (extProxy, password));
            AddLog($"[ROTASYON] {email} tüneli zırhlı dış IP'ye bağlandı -> {proxy.Ip}:{proxy.Port}");
        }

        // ========================================================
        // 🔥 HATA FIX: Tüm geçersiz yerel değişkenler (keyWorker, _botRegistry vb.) temizlendi!
        // ========================================================
        public void RemoveProxyByWovId(string wovId)
        {
            // Tuple içindeki proxy hostname'i veya doğrudan email key'i ile eşleşen kaydı buluyoruz panpa
            var item = _botProxies.FirstOrDefault(x => x.Key == wovId || x.Value.proxy.HostName == wovId);
            string keyToRemove = item.Key;

            if (!string.IsNullOrEmpty(keyToRemove))
            {
                _botProxies.TryRemove(keyToRemove, out _);
                AddLog($"[ROTASYON] {wovId} üzerinden proxy zimmeti tamamen kaldırıldı.");
            }
        }

        private async Task OnBeforeTunnelConnectRequest(object sender, TunnelConnectSessionEventArgs e)
        {
            string host = e.HttpClient.Request.RequestUri.Host;
            string botEmail = e.UserData as string ?? string.Empty; // 🔥 HATA FIX: botAddress hataları botEmail yapıldı
            bool isLocalhost = host.Contains("localhost") || host.Contains("127.0.0.1");

            // 🔥 HATA FIX: Tuple doğrudan IExternalProxy'ye atanamazdı, botData.proxy çekilerek tip uyuşmazlığı çözüldü!
            if (!isLocalhost && !string.IsNullOrEmpty(botEmail) && _botProxies.TryGetValue(botEmail, out var botData))
            {
                e.CustomUpStreamProxy = botData.proxy;
                AddLog($"[TÜNEL] {botEmail} -> {host} (Proxy: {botData.proxy.HostName} üzerinden)");
            }
            else if (!isLocalhost)
            {
                AddLog($"[SIZINTI UYARISI!] {host} adresine kural dışı direkt tünel açılıyor!");
            }

            if (host.Contains("api-wolvesville.com") || host.Contains("auth.wolvesville.com") || host.Contains("challenges.cloudflare.com"))
            {
                e.DecryptSsl = false;
            }
        }

        private async Task OnBeforeRequest(object sender, SessionEventArgs e)
        {
            string host = e.HttpClient.Request.RequestUri.Host;
            string botEmail = e.UserData as string ?? string.Empty;

            bool isLocalhost = host.Contains("localhost") || host.Contains("127.0.0.1");
            if (!isLocalhost && !string.IsNullOrEmpty(botEmail) && _botProxies.TryGetValue(botEmail, out var botData))
            {
                e.CustomUpStreamProxy = botData.proxy; // 🔥 HATA FIX: Tuple çözümlenerek proxy nesnesi atandı
            }
        }

        // ========================================================
        // 🔥 RECOV: WOLVESVILLE JS ENJEKSİYONU (VURGUN LOJİĞİ) TAM KORUNDU
        // ========================================================
        private async Task OnBeforeResponse(object sender, SessionEventArgs e)
        {
            string requestUrl = e.HttpClient.Request.Url;

            if (requestUrl.Contains("wolvesville.com"))
            {
                if (e.HttpClient.Response.Headers.HeaderExists("Content-Security-Policy"))
                    e.HttpClient.Response.Headers.RemoveHeader("Content-Security-Policy");
            }

            if (e.HttpClient.Response.StatusCode == 200 && requestUrl.Contains("wolvesville.com") && requestUrl.Contains("main.") && requestUrl.EndsWith(".js"))
            {
                string localFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "HBV", "modified_main.js");

                if (System.IO.File.Exists(localFilePath))
                {
                    string myCustomJs = await System.IO.File.ReadAllTextAsync(localFilePath);
                    e.SetResponseBodyString(myCustomJs);
                    AddLog($"[VURGUN] Wolvesville {Path.GetFileName(requestUrl)} yakalandı ve HBV Enjeksiyonu yapıldı!");
                }
            }
        }
    }
}