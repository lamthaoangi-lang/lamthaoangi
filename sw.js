const V='lt-v2',SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Mạng trước (tối đa 4 giây), chậm hoặc mất mạng thì dùng bản đã lưu. Không đụng tới API Apps Script và trang ADMIN.
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin||u.pathname.indexOf('ADMIN')>=0)return;
const net=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res});
const slow=new Promise((_,no)=>setTimeout(no,4000));
e.respondWith(Promise.race([net,slow]).catch(()=>caches.match(r).then(m=>m||net.catch(()=>caches.match('index.html')))))});
