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



// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 通知を受けとると push イベントが呼び出される。
self.addEventListener('push', function (event) {
  const notificationPromise = self.registration.showNotification(
    messageTitle,
    {
      body: messageBody,
      tag: messageTag
    });
  event.waitUntil(notificationPromise);
}, false)

// WEBアプリがバックグラウンドの場合にはsetBackGroundMessageHandlerが呼び出される。
messaging.setBackgroundMessageHandler(function () {
  return self.registration.showNotification(
    messageTitle,
    {
      body: messageBody,
      tag: messageTag
    });
});