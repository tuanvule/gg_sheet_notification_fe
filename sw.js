self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Thông báo', body: 'Bạn có tin nhắn mới' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png',
    })
  );
});