import { useSelector } from "react-redux";
import IconBtn from "../../../common/IconBtn";
import checkLogin from "../../../../services/checkLogin";
import { apiConnector } from "../../../../services/apiConnector";
import { payment } from "../../../../services/apis";
import { openRazorpayCheckout } from "../../../../services/payment";
import { useNavigate } from "react-router-dom";

export default function RenderTotalAmount({ total }) {
  const { user } = useSelector((state) => state.profile);
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate()

  const handleBuyCourse = async () => {
    const { loggedIn, user: loggedUser } = await checkLogin();
    if (!loggedIn) return;

    const courseIds = cartItems.map((c) => c._id);

    const res = await apiConnector('POST', payment.CAPTURE, {
      courseIds,
      userId: loggedUser.userId,
    });

    if (res.data.success) {
      openRazorpayCheckout(res.data, loggedUser, navigate);
    }
  };

  return (
    <div className="min-w-[280px] rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>

      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  );
}
