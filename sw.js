const V='lt-v3',SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Trang/JS/JSON: luôn hỏi máy chủ xem có bản mới không (cache:'no-cache' bỏ qua bộ nhớ 10 phút của GitHub Pages), chậm quá 6 giây hoặc mất mạng mới dùng bản đã lưu.
// Ảnh: dùng bản đã lưu cho nhanh, đồng thời tải bản mới ngầm. Không đụng tới API Apps Script và trang ADMIN.
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin||u.pathname.indexOf('ADMIN')>=0)return;
 const page=r.mode==='navigate'||/(\/|\.html|\.js|\.json)$/.test(u.pathname);
 const save=res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res};
 if(page){
  const net=fetch(r.url,{cache:'no-cache'}).then(save);
  const slow=new Promise((_,no)=>setTimeout(no,6000));
  e.respondWith(Promise.race([net,slow]).catch(()=>caches.match(r).then(m=>m||net.catch(()=>caches.match('index.html')))));
 }else{
  e.respondWith(caches.match(r).then(m=>{const net=fetch(r).then(save).catch(()=>m);return m||net}));
 }
});
