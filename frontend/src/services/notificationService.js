// Request permission for browser notifications
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Check if notifications are supported and permitted
export const checkNotificationSupport = () => {
  return 'Notification' in window && Notification.permission === 'granted';
};

// Send a notification
export const sendNotification = (title, options = {}) => {
  if (!checkNotificationSupport()) {
    console.log('Notifications not supported or not permitted');
    return;
  }

  const defaultOptions = {
    icon: '/vite.svg', // You can change this to a custom icon
    badge: '/vite.svg',
    vibrate: [200, 100, 200],
    requireInteraction: true, // Notification stays until user interacts
    ...options
  };

  const notification = new Notification(title, defaultOptions);

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  return notification;
};

// Schedule notifications for medications
export const scheduleMedicationNotifications = (medications) => {
  if (!checkNotificationSupport()) {
    return;
  }

  medications.forEach(med => {
    const times = typeof med.times === 'string' ? JSON.parse(med.times) : med.times;
    
    times.forEach(time => {
      const [hours, minutes] = time.split(':');
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // If the time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime - now;

      // Schedule the notification
      setTimeout(() => {
        sendNotification(
          `Time to take ${med.name}`,
          {
            body: `${med.dosage} - ${med.notes || 'No additional notes'}`,
            tag: `med-${med.id}-${time}`, // Prevents duplicate notifications
            data: {
              medicationId: med.id,
              medicationName: med.name,
              time: time
            }
          }
        );
      }, timeUntilNotification);
    });
  });
};

// Check medications and send notifications for upcoming doses (within 5 minutes)
export const checkUpcomingMedications = (medications) => {
  if (!checkNotificationSupport()) {
    return;
  }

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  medications.forEach(med => {
    const times = typeof med.times === 'string' ? JSON.parse(med.times) : med.times;
    
    times.forEach(time => {
      // Check if medication time matches current time (within same minute)
      if (time === currentTime) {
        sendNotification(
          `Time to take ${med.name}! 💊`,
          {
            body: `${med.dosage}\n${med.notes || ''}`,
            tag: `med-reminder-${med.id}-${time}`,
            requireInteraction: true
          }
        );
      }
    });
  });
};