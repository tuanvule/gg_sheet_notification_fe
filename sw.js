self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Thông báo', body: 'Bạn có tin nhắn mới' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png',
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // đóng thông báo

  const targetUrl = "http://127.0.0.1:5500/fe/index.html";

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Nếu đã mở sẵn trang thì focus
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Nếu chưa mở thì mở tab mới
      if (clients.openWindow) {
        return clients.openWindow("https://docs.google.com/spreadsheets/d/1OQWZdc9cHe8FoyIt6EmFIjDd5iGv6cDxPo74t1dSzTM/edit?gid=1343032234#gid=1343032234");
      }
    })
  );
});