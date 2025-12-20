import { useEffect, useState } from "react";
import { onMessageListener } from "@/Firebase/firebase"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FirebaseNotification = () => {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        console.log("Received foreground notification:", payload);

        setNotification(payload);

        toast.info(`${payload.notification?.title} - ${payload.notification?.body}`);
      })
      .catch((err) => console.error("Failed to receive notification:", err));
  }, []);

  return (
    <>
    
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

 
      {notification && (
        <div className="notification-banner">
          <h4>{notification.notification?.title}</h4>
          <p>{notification.notification?.body}</p>
        </div>
      )}
    </>
  );
};

export default FirebaseNotification;
