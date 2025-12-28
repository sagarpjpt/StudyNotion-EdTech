const BASE_URL = import.meta.env.VITE_BACKEND_URL

export const courses = {
    CREATE_COURSE: BASE_URL + '/api/v1/courses/create-course',
    EDIT_COURSE: BASE_URL + '/api/v1/courses/edit-course',
    GET_INSTRUCTOR_COURSES: BASE_URL + '/api/v1/courses/instructor-courses-details',
    DELETE_COURSE: BASE_URL + '/api/v1/courses/delete-course',
    GET_COURSE_DETAILS: BASE_URL + '/api/v1/courses/course/', // :courseId is to be added
    GET_STUDENT_ENROLLED_COURSES: BASE_URL + '/api/v1/courses/student-enrolled-courses',
    GET_COURSE_PROGRESS: BASE_URL + '/api/v1/courses/course-progress/' // add courseId
}

export const course_sections = {
    CREATE_SECTION: BASE_URL + '/api/v1/courses/add-section',
    EDIT_SECTION: BASE_URL + '/api/v1/courses/update-section',
    DELETE_SECTION: BASE_URL + '/api/v1/courses/delete-section',
    CREATE_SUB_SECTION: BASE_URL + '/api/v1/courses/add-subsection',
    EDIT_SUB_SECTION: BASE_URL + '/api/v1/courses/update-subsection',
    DELETE_SUB_SECTION: BASE_URL + '/api/v1/courses/delete-subsection',
    MARK_LEC_COMPLETED: BASE_URL + '/api/v1/courses/mark-completed'
}

export const categories = {
    CATEGORIES_API: BASE_URL + '/api/v1/courses/get-all-categories',
    CATALOG_PAGE_DATA: BASE_URL + '/api/v1/courses/category-page-details/' //categoryId is to be attached
}

export const auth = {
    LOGIN_API: BASE_URL + '/api/v1/auth/login',
    IS_LOGGED: BASE_URL + '/api/v1/auth/me',
    SEND_OTP: BASE_URL + '/api/v1/auth/sendotp',
    SIGNUP: BASE_URL + '/api/v1/auth/signup',
    LOG_OUT: BASE_URL + '/api/v1/auth/logout',
    CHANGE_PASSWORD: BASE_URL + '/api/v1/auth/changepassword',
    O_AUTH_GOOGLE: BASE_URL + '/api/v1/auth/google'
}

export const profile = {
    GET_USER_DETAILS: BASE_URL + '/api/v1/profiles/get-user-details',
    UPDATE_DP: BASE_URL + '/api/v1/profiles/update-display-picture',
    UPDATE_PROFILE: BASE_URL + '/api/v1/profiles/update-profile',
    DEL_PROF: BASE_URL + '/api/v1/profiles/delete-account',
    GET_INSTRUCTOR_DASHBOARD_DATA: BASE_URL + '/api/v1/profiles/instructor-dashboard-data'
}

export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/api/v1/reach/contact",
}

export const ratingReview = {
    CREATE_RR: BASE_URL + '/api/v1/courses/create-rating-review',
    GET_AVG_RR: BASE_URL + '/api/v1/courses/average-rating/', // courseid has to be added
    GET_ALL_RR: BASE_URL + '/api/v1/courses/all-ratings-reviews'
}

export const payment = {
    CAPTURE: BASE_URL + '/api/v1/payments/capturepayment',
}

export const resetPassword = {
    RESET_PASSWORD_TOKEN: BASE_URL + '/api/v1/auth/reset-password-token',
    RESET_PASSWORD: BASE_URL + '/api/v1/auth/reset-password'
}