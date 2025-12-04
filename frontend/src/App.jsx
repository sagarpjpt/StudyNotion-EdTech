import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/common/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Contact from "./pages/Contact.jsx";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "./services/apiConnector.js";
import { auth } from "./services/apis.js";
import { logout, setUser } from "./redux/slices/profileSlice.jsx";
import Spinner from "./components/common/Spinner.jsx";
import PublicRoute from "./components/core/Auth/PublicRoute.jsx";
import PrivateRoute from "./components/core/Auth/PrivateRoute.jsx";
import VerifyEmailRoute from "./components/core/Auth/VerifyEmailRoute.jsx";
import About from "./pages/About.jsx";
import Rateus from "./pages/Rateus.jsx";
import Project from "./pages/Project.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyProfile from "./components/core/Dashboard/MyProfile.jsx";
import Settings from "./components/core/Dashboard/Settings/Settings.jsx";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor.jsx";
import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse.jsx";
import MyCourses from "./components/core/Dashboard/MyCourses.jsx";
import EditCourse from "./components/core/Dashboard/EditCourse/EditCourse.jsx";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses.jsx";
import Cart from "./components/core/Dashboard/Cart/Cart.jsx";
import Error from "./pages/Error.jsx";
import ViewCourse from "./pages/ViewCourse.jsx";
import VideoDetails from "./components/core/ViewCourse/VideoDetails.jsx";
import Catalog from "./pages/Catalog.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const [authChecking, setAuthChecking] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulating a loading time
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiConnector("GET", auth.IS_LOGGED);
        if (res?.data?.success) {
          dispatch(setUser(res.data.user));
        } else {
          dispatch(logout());
        }
      } catch (e) {
        dispatch(logout());
      } finally {
        setAuthChecking(false);
      }
    };
    fetchMe();
  }, [dispatch]);

  if (authChecking || loading) {
    return <Spinner />;
  }

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <VerifyEmailRoute>
              <VerifyEmail />
            </VerifyEmailRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/rateus" element={<Rateus />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        {/* protected routes */}
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings />} />
          {user?.role === "Student" && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
            </>
          )}
          {user?.role === "Instructor" && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        </Route>
        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.role === "Student" && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};

export default App;
