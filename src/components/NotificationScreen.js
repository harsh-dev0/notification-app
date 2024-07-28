import React, { useEffect } from 'react';

const NotificationScreen = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);

  async function send() {
    const register = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BFk9bwK0Ss3ARXdUy-zIIrGn2VYu8PvbW6wiIuEbFqUrsEr1dY9Cw7EtmxO_kV_skEj5dFcw-_jYVKmxC5mEIi8')
    });

    await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function sendNotification() {
    if (Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.getRegistration();
      registration.showNotification('Notification from app', {
        body: 'This is a push notification.',
        icon: '/icon-192x192.png'
      });
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        sendNotification();
      } else {
        alert('Notification permission denied.');
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <div className="text-center text-white">
        <h1 className="mb-20 text-2xl">Hola!</h1>
        <div className="pb-6 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center mt-12 mb-12">
            <div className="absolute rounded-full bg-purple-500 h-[300px] w-[300px] animate-pulse"></div>
            <div className="absolute rounded-full bg-purple-400 h-[250px] w-[250px] animate-pulse"></div>
            <div className="absolute rounded-full bg-purple-300 h-[200px] w-[200px] animate-pulse"></div>
            <img src="/bell.png" alt="bell" className="relative z-10 h-[100px] w-[100px]" />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="mt-6 mb-2 font-inter font-semibold text-[29px]">Lorem Ipsum...</p>
          <p className="font-inter font-normal text-[19px] text-opacity-40">Lorem ipsum dolor sit amet.</p>
        </div>
        <div className="flex items-center justify-center mt-16 mb-6">
          <button
            className="relative w-[327px] h-[42px] rounded-md p-0 shadow-md overflow-hidden bg-gradient-to-r from-transparent via-red-600 to-transparent font-inter font-semibold text-[16px] text-center text-white hover:bg-gradient-to-r hover:from-transparent hover:via-red-600 hover:to-transparent hover:bg-red-300 transition-all duration-300 ease-in-out"
            onClick={() => sendNotification()}
          >
            <span className="absolute inset-0 z-[-1] bg-gradient-to-r from-transparent via-red-600 to-transparent border-solid border-[1.4px] rounded-md  "></span>
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationScreen;
