import { useState, useEffect } from 'react';
import { requestNotificationPermission, checkNotificationSupport } from '../services/notificationService';

function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsSupported, setNotificationsSupported] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
      setShowSuccessMessage(true);
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } else {
      alert('Notifications were denied. You can enable them later in your browser settings.');
    }
  };

  const handleDisableNotifications = () => {
    alert('To disable notifications, please go to your browser settings:\n\nChrome/Edge: Settings → Privacy and Security → Site Settings → Notifications\n\nSafari: Preferences → Websites → Notifications');
  };

  if (!notificationsSupported) {
    return (
      <div className="notification-banner warning">
        <p>⚠️ Your browser doesn't support notifications</p>
      </div>
    );
  }

  // Show success message temporarily
  if (showSuccessMessage) {
    return (
      <div className="notification-banner success">
        <p>✅ Notifications enabled! You'll receive reminders for your medications.</p>
      </div>
    );
  }

  if (!notificationsEnabled) {
    return (
      <div className="notification-settings-inline">
        <button onClick={handleEnableNotifications} className="btn btn-notification">
          🔔 Enable Notifications
        </button>
      </div>
    );
  }

  return (
    <div className="notification-settings-inline">
      <button onClick={handleDisableNotifications} className="btn btn-notification-disable">
        🔕 Disable Notifications
      </button>
    </div>
  );
}

export default NotificationSettings;