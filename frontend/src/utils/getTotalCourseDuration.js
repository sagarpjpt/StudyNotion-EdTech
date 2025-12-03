export const getTotalCourseDuration = (course) => {
  if (!course?.courseContent) return "0 sec";

  let totalSeconds = 0;

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;

    const parts = timeStr.split(":").map(Number);

    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
    }

    if (parts.length === 2) {
      return parts[0] * 60 + parts[1]; // MM:SS
    }

    return 0;
  };

  // Sum durations
  course.courseContent.forEach((section) => {
    section.subSection.forEach((sub) => {
      totalSeconds += parseTime(sub.timeDuration);
    });
  });

  // Convert seconds → readable format
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let result = [];
  if (days > 0) result.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) result.push(`${hours} hr`);
  if (minutes > 0) result.push(`${minutes} min`);
  if (seconds > 0 || result.length === 0) result.push(`${seconds} sec`);

  return result.join(" ");
};
