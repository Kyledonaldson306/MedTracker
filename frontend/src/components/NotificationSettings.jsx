import { useState, useEffect } from 'react';
import { requestNotificationPermission, checkNotificationSupport } from '../services/notificationService';

function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsSupported, setNotificationsSupported] = useState(true);

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      setNotificationsSupported(false);
      return;
    }

    // Check current permission status
    setNotificationsEnabled(Notification.permission === 'granted');
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    
    if (granted) {
      alert('Notifications enabled! You will receive reminders when it\'s time to take your medications.');
    } else {
      alert('Notifications were denied. You can enable them later in your browser settings.');
    }
  };

  if (!notificationsSupported) {
    return (
      <div className="notification-banner warning">
        <p>⚠️ Your browser doesn't support notifications</p>
      </div>
    );
  }

  if (!notificationsEnabled) {
    return (
      <div className="notification-banner">
        <p>🔔 Enable notifications to get reminders when it's time to take your medications</p>
        <button onClick={handleEnableNotifications} className="btn btn-primary btn-small">
          Enable Notifications
        </button>
      </div>
    );
  }

  return (
    <div className="notification-banner success">
      <p>✅ Notifications are enabled! You'll receive reminders for your medications.</p>
    </div>
  );
}

export default NotificationSettings;