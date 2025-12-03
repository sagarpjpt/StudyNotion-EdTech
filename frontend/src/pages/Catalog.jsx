import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import Course_Card from "../components/core/Catalog/Course_Card";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import Error from "./Error";
import Spinner from "../components/common/Spinner";

const Catalog = () => {
  const { catalogName } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
  if (!catalogName) return;

  const getCategoryId = async () => {
    try {
      setLoading(true);

      const res = await apiConnector("GET", categories.CATEGORIES_API);
      const categoryList = res?.data?.categories || [];

      const matched = categoryList.find(
        (ct) => ct.name.toLowerCase() === catalogName.toLowerCase()
      );

      setCategoryId(matched?._id || "");
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryId("");
    } finally {
      setLoading(false);
    }
  };

  getCategoryId();
}, [catalogName]);


  // 2) When categoryId is known, fetch category page details
  useEffect(() => {
    if (!categoryId) return;
    let cancelled = false;
    const controller = new AbortController();

    const getCategoryDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiConnector(
          "GET",
          `${categories.CATALOG_PAGE_DATA}${categoryId}`,
          null,
          { signal: controller.signal }
        );

        const payload = res?.data;
        if (!payload || !payload.success) {
          throw new Error(payload?.message || "Failed to fetch category details");
        }

        // payload.data = { categoryDetails, differentCategory, topSellingCourses }
        const { categoryDetails, differentCategory, topSellingCourses } =
          payload.data || {};

        // frontend-friendly shape:
        const selectedCategory = categoryDetails
          ? {
              ...categoryDetails,
              // ensure "courses" property exists (frontend expects .courses)
              courses: Array.isArray(categoryDetails.course)
                ? categoryDetails.course
                : [],
            }
          : null;

        const differentCategoryNormalized = Array.isArray(differentCategory)
          ? differentCategory.map((c) => ({
              ...c,
              courses: Array.isArray(c.course) ? c.course : [],
            }))
          : [];

        const mostSellingCourses = Array.isArray(topSellingCourses)
          ? topSellingCourses
          : [];

        const normalized = {
          success: true,
          data: {
            selectedCategory,
            differentCategory: differentCategoryNormalized,
            mostSellingCourses,
          },
        };

        if (!cancelled) {
          setCatalogPageData(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching category page data:", err);
          setError(err?.response?.data?.message || err?.message || "Failed");
          setCatalogPageData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getCategoryDetails();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [categoryId]);

  if (loading) return <Spinner />;

  if (error) return <Error />;

  if (!catalogPageData || !catalogPageData.success) {
    return <Error message="Category data not available" />;
  }

  const selected = catalogPageData?.data?.selectedCategory;
  const different = catalogPageData?.data?.differentCategory || [];
  const mostSelling = catalogPageData?.data?.mostSellingCourses || [];

  return (
    <>
      {/* HERO */}
      <div className="bg-richblack-800 px-4 text-richblack-5">
        <div className="lg:w-10/12 mx-auto min-h-[220px] flex flex-col justify-center gap-4 py-8">
          <p className="text-sm text-richblack-300">
            Home / Catalog /{" "}
            <span className="text-yellow-25">{selected?.name || catalogName}</span>
          </p>

          <h1 className="text-3xl font-semibold text-richblack-5">
            {selected?.name || catalogName}
          </h1>

          <p className="max-w-[900px] text-richblack-200">
            {selected?.description ||
              "Explore curated courses in this category to upskill and build projects."}
          </p>
        </div>
      </div>

      {/* SECTION: Courses to get you started */}
      <section className="w-11/12 lg:w-10/12 mx-auto px-4 py-12 text-richblack-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-0 text-richblack-5 border-l-4 border-yellow-50 pl-4">1. Courses to get you started</h2>
        </div>

        <div className="mt-6">
          <CourseSlider Courses={selected?.courses || []} />
        </div>
      </section>

      {/* SECTION: Top courses in other categories */}
      <section className="w-11/12 lg:w-10/12 mx-auto px-4 py-12 text-richblack-5">
        <div className="text-2xl sm:text-3xl font-semibold mb-0 text-richblack-5 border-l-4 border-yellow-50 pl-4">2. Top courses in other categories</div>

        <div className="mt-6">
          <CourseSlider
            Courses={different.flatMap((c) => (c?.courses && c.courses.length ? c.courses : []))}
          />
        </div>
      </section>

      {/* SECTION: Frequently Bought / Most Selling */}
      <section className="w-11/12 lg:w-10/12 mx-auto px-4 py-12 text-richblack-5">
        <div className="text-2xl sm:text-3xl font-semibold mb-0 text-richblack-5 border-l-4 border-yellow-50 pl-4">3. Frequently Bought</div>

        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {mostSelling?.slice(0, 4).map((course, i) => (
              <Course_Card course={course} key={course?._id || i} Height={"max-h-[360px]"} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Catalog;
