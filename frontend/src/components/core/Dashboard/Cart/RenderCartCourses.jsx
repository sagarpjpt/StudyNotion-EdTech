import { FaStar } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
// replaced external rating component with a simple local star display
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../../redux/slices/cartSlice";
import { apiConnector } from "../../../../services/apiConnector";
import { ratingReview } from "../../../../services/apis";

export default function RenderCartCourses() {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [avgR, setAvgR] = useState(0)

  const handleRemove = useCallback(
    (id) => dispatch(removeFromCart(id)),
    [dispatch]
  );

  useEffect(() =>{
    const getAvgRating = async (id) => {
      try {
        const res = await apiConnector('GET', ratingReview.GET_AVG_RR + id)
        res?.data?.success ? setAvgR(res?.data?.averageRating) : setAvgR(0);
      } catch {
        
      }
    }
    getAvgRating()
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      {cartItems.map((course, indx) => (
        <div
          key={course._id}
          className={`flex w-full flex-wrap items-start justify-between gap-6 ${
            indx !== cartItems.length - 1 &&
            "border-b border-b-richblack-400 pb-6"
          } ${indx !== 0 && "mt-6"}`}
        >
          <div className="flex flex-1 flex-col gap-4 xl:flex-row">
            <img
              src={course.thumbnail}
              alt={course.courseName}
              className="h-[148px] w-[220px] rounded-lg object-cover"
            />
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-medium text-richblack-5">
                {course.courseName}
              </p>
              <p className="text-sm text-richblack-300">
                {course?.category?.name}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-yellow-5">{avgR}</span>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const ratingCount = Math.min(
                      5,
                      Math.round(course.ratingAndReviews?.length || 0)
                    );
                    return (
                      <FaStar
                        key={i}
                        className={
                          i < ratingCount
                            ? "text-yellow-50"
                            : "text-richblack-400"
                        }
                      />
                    );
                  })}
                </div>
                <span className="text-richblack-400">
                  {course.ratingAndReviews?.length} Ratings
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() => handleRemove(course._id)}
              className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>

            <p className="mb-6 text-3xl font-medium text-yellow-100">
              ₹ {course.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
