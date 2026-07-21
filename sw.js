// GTD push notification service worker
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));

self.addEventListener("push", (event) => {
  let data = { title: "GTD", body: "Something was added.", list: "home" };
  try { data = event.data.json(); } catch (e) {}
  const opts = {
    body: data.body,
    tag: data.list || "gtd",
    renotify: true,
    data: { list: data.list || "home" }
  };
  event.waitUntil(self.registration.showNotification(data.title, opts));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((all) => {
      for (const c of all) { if ("focus" in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow("./");
    })
  );
});
