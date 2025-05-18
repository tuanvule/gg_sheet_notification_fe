let publicVapidKey = ""; // Thay bằng public key từ backend

fetch("https://gg-sheet-notification.vercel.app/get_public_key")
  .then(data => data.json())
  .then(res => {
    publicVapidKey = res.publicKey
    console.log(publicVapidKey)
  })
  .catch(err => console.log(err))

// Hàm chuyển base64 URL-safe sang Uint8Array (để dùng với PushManager)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

document.getElementById('subscribeBtn').onclick = async () => {
  if (!('serviceWorker' in navigator)) {
    alert('Trình duyệt không hỗ trợ Service Worker');
    return;
  }

  // Đăng ký service worker
  const swReg = await navigator.serviceWorker.register('sw.js');

  // Yêu cầu quyền thông báo
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Bạn đã từ chối quyền thông báo');
    return;
  }

  // Đăng ký push subscription
  const subscription = await swReg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  console.log(subscription)

  // Gửi subscription lên server
  var res = await fetch('https://gg-sheet-notification.vercel.app/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: { 'Content-Type': 'application/json' },
  });

  console.log(res)

  alert('Đăng ký nhận thông báo thành công!');
};

document.getElementById('unsubscribeBtn').onclick = async () => {
  console.log("hello")
  if (!('serviceWorker' in navigator)) {
    alert('Trình duyệt không hỗ trợ Service Worker');
    return;
  }

  const swReg = await navigator.serviceWorker.register('sw.js');

  // Đăng ký service worker
  const existingSub = await swReg.pushManager.getSubscription();
  if (existingSub) {
    await existingSub.unsubscribe();
    console.log('Đã huỷ đăng ký cũ');
  }
  alert('Đăng ký nhận thông báo thành công!');
};
