import { toast } from "react-hot-toast";

export const openRazorpayCheckout = (orderData, user, navigate) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: orderData.currency,
    name: "StudyNotion",
    description: "Course purchase",
    order_id: orderData.orderId,

    // after successful payment
    handler: function (response) {
      // console.log("Payment Success:", response);
      toast.success("Payment successful! Processing your enrollment...");

      setTimeout(() => {
        navigate("/dashboard/enrolled-courses");
      }, 2000);
    },

    prefill: {
      name: user.firstName + " " + user.lastName,
      email: user.email,
    },

    theme: {
      color: "#01212A",
    },
  };

  const razorpayWindow = new window.Razorpay(options);
  razorpayWindow.open();
};
