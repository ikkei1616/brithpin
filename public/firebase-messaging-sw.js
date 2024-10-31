importScripts("https://www.gstatic.com/firebasejs/7.3.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.3.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: `AIzaSyAfWbDntObUe3B5-nzsWmqYvFncIVc-rhI`,
  authDomain: 'birthpin.firebaseapp.com',
  projectId: 'birthpin',
  storageBucket: 'birthpin.appspot.com',
  messagingSenderId: '64232598136',
  appId: '1:64232598136:web:0c6f5c5d2bc726729e9b8d',
  measurementId: 'G-42QLDS1Y2H',
};

let firebaseApp = firebase.initializeApp(firebaseConfig);

// if (!getApps()?.length) {
//   firebaseApp = firebase.initializeApp(firebaseConfig, 'sw');
// }
// Initialize Firebase


const messaging = firebase.messaging();

// 通知を受けとると push イベントが呼び出される。
self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};

  console.log('Push event data:', data);

  const notificationTitle = data.data.title || 'デフォルトのタイトル';
  const notificationOptions = {
    body: data.data.body || 'デフォルトのメッセージ',
    tag: data.data.tag || 'default-tag',
    icon: data.data.icon || '/BirthHiyokoIcon-512.png',
  };

  const notificationPromise = self.registration.showNotification(notificationTitle, notificationOptions);
  event.waitUntil(notificationPromise);
});

// WEBアプリがバックグラウンドの場合にはsetBackGroundMessageHandlerが呼び出される。
messaging.setBackgroundMessageHandler(function (event) {
  return self.registration.showNotification(
    event.messageTitle,
    {
      body: event.messageBody || 'お知らせが届いています。',
      tag: event.messageTag || 'これはタグです。',
    });
});