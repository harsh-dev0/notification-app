// pages/api/subscribe.js
import webPush from 'web-push';

const publicVapidKey = 'BFk9bwK0Ss3ARXdUy-zIIrGn2VYu8PvbW6wiIuEbFqUrsEr1dY9Cw7EtmxO_kV_skEj5dFcw-_jYVKmxC5mEIi8';
const privateVapidKey = 'jTl2id9gglHxo0pvA1ggpJUwKhJfAhvvEnhB5EcyOlw';

webPush.setVapidDetails('mailto:jb503098@gmail.com', publicVapidKey, privateVapidKey);

export default (req, res) => {
  if (req.method === 'POST') {
    const subscription = req.body;
    const payload = JSON.stringify({
      title: 'Push Test',
      body: 'Hello, World!',
    });

    webPush.sendNotification(subscription, payload)
      .then(() => res.status(200).json({ success: true }))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.message });
      });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
