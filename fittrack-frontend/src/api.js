// simple api helper for my FitTrack backend
// backend is running on http://localhost:5001

const BASE_URL = "http://localhost:5001";

// get saved token from localStorage
function getToken() {
  return localStorage.getItem("token");
}

// common headers
function getHeaders() {
  const token = getToken();
  let h = { "Content-Type": "application/json" };
  if (token) {
    h["Authorization"] = "Bearer " + token;
  }
  return h;
}

async function myFetch(url, method, body) {
  let options = {
    method: method,
    headers: getHeaders(),
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(BASE_URL + url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

const api = {
  register: (d) => myFetch("/api/auth/register", "POST", d),
  login: (d) => myFetch("/api/auth/login", "POST", d),
  getWorkouts: () => myFetch("/api/workouts", "GET"),
  addWorkout: (d) => myFetch("/api/workouts", "POST", d),
  deleteWorkout: (id) => myFetch("/api/workouts/" + id, "DELETE"),
  getPlans: () => myFetch("/api/plans", "GET"),
  addPlan: (d) => myFetch("/api/plans", "POST", d),
  followPlan: (id) => myFetch("/api/plans/" + id + "/follow", "POST", {}),
  searchPlans: (k) => myFetch("/api/plans/search?keyword=" + k, "GET"),
  addMetric: (d) => myFetch("/api/metrics", "POST", d),
  getMetrics: (userId) => myFetch("/api/metrics/user/" + userId, "GET"),
  getSummary: (period) => myFetch("/api/analytics/summary?period=" + period, "GET"),

  // Upload a photo for a specific metric entry.
  // Uses FormData so Content-Type is set automatically by the browser
  // (multer needs the multipart boundary — never set it manually).
  uploadPhoto: (metricId, file) => {
    const formData = new FormData();
    formData.append("photo", file);
    return fetch(BASE_URL + "/api/metrics/" + metricId + "/photo", {
      method: "POST",
      headers: { Authorization: "Bearer " + getToken() }, // no Content-Type here!
      body: formData,
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Upload failed");
      return data;
    });
  },
};

export default api;
export { BASE_URL };
