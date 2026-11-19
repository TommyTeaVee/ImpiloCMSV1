import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://api.impilomag.co.za/api",

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("editorialToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("readerToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },

  (error) => Promise.reject(error)
);

/*
 * =========================================================
 * MAGAZINE ADMIN API
 * =========================================================
 *
 * Backend:
 *
 * app.use(
 *   "/api/magazine-admin",
 *   magazineAdminRoutes
 * );
 *
 * Therefore the routes are:
 *
 * GET    /api/magazine-admin
 * GET    /api/magazine-admin/:id
 * POST   /api/magazine-admin
 * PUT    /api/magazine-admin/:id
 * POST   /api/magazine-admin/:id/publish
 * POST   /api/magazine-admin/:id/unpublish
 *
 * POST   /api/magazine-admin/:id/pages
 * PUT    /api/magazine-admin/:id/pages/:pageId
 * DELETE /api/magazine-admin/:id/pages/:pageId
 * PATCH  /api/magazine-admin/:id/pages/reorder
 * =========================================================
 */

export const magazineApi = {
  getIssues() {
    return api.get("/magazine-admin");
  },

  getIssue(issueId) {
    return api.get(`/magazine-admin/${issueId}`);
  },

  createIssue(data) {
    return api.post(
      "/magazine-admin",
      data
    );
  },

  updateIssue(issueId, data) {
    return api.put(
      `/magazine-admin/${issueId}`,
      data
    );
  },

  publishIssue(issueId) {
    return api.post(
      `/magazine-admin/${issueId}/publish`
    );
  },

  unpublishIssue(issueId) {
    return api.post(
      `/magazine-admin/${issueId}/unpublish`
    );
  },

  addPage(issueId, data) {
    return api.post(
      `/magazine-admin/${issueId}/pages`,
      data
    );
  },

  updatePage(issueId, pageId, data) {
    return api.put(
      `/magazine-admin/${issueId}/pages/${pageId}`,
      data
    );
  },

  deletePage(issueId, pageId) {
    return api.delete(
      `/magazine-admin/${issueId}/pages/${pageId}`
    );
  },

  reorderPages(issueId, pages) {
    return api.patch(
      `/magazine-admin/${issueId}/pages/reorder`,
      {
        pages,
      }
    );
  },
};

export default api;