import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import EditorialCMS
  from "./EditorialCMS.jsx";

import UserManagement
  from "../components/editorial/UserManagement.jsx";

import AdminMedia
  from "../components/editorial/AdminMedia.jsx";

import MagazineManagement
  from "../components/editorial/MagazineManagement.jsx";

import InReviewArticles
  from "../pages/InReviewArticle";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("overview");


  // ==================================================
  // CHECK ADMIN ACCESS
  // ==================================================

  useEffect(() => {

    async function checkAccess() {

      const token =
        localStorage.getItem("token");

      if (!token) {

        navigate(
          "/editorial/login",
          {
            replace: true
          }
        );

        return;
      }


      try {

        const response =
          await api.get(
            "/auth/me"
          );

        const currentUser =
          response.data?.user;


        if (!currentUser) {

          throw new Error(
            "User information unavailable."
          );

        }


        /*
         * ADMIN and EDITOR are allowed
         * into the administration area.
         */

        if (
          currentUser.role !== "ADMIN" &&
          currentUser.role !== "EDITOR"
        ) {

          navigate(
            "/editorial",
            {
              replace: true
            }
          );

          return;

        }


        setUser(
          currentUser
        );

      } catch (error) {

        console.error(
          "Admin access error:",
          error
        );


        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "editorialUser"
        );


        navigate(
          "/editorial/login",
          {
            replace: true
          }
        );

      } finally {

        setLoading(false);

      }

    }


    checkAccess();

  }, [navigate]);


  // ==================================================
  // LOGOUT
  // ==================================================

  function logout() {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "editorialUser"
    );


    navigate(
      "/editorial/login",
      {
        replace: true
      }
    );

  }


  // ==================================================
  // TAB NAVIGATION
  // ==================================================

  function selectTab(tab) {

    setActiveTab(
      tab
    );

  }


  // ==================================================
  // CONTENT
  // ==================================================

  function renderContent() {

    switch (
      activeTab
    ) {


      // ==============================================
      // OVERVIEW
      // ==============================================

      case "overview":

        return (

          <section
            className="impilo-admin-overview"
          >

            <header
              className="impilo-admin-section-header"
            >

              <span>
                IMPILO ADMINISTRATION
              </span>

              <h2>
                Welcome
                {user?.displayName
                  ? `, ${user.displayName}`
                  : ""}
              </h2>

              <p>
                Manage the IMPILO digital
                publishing platform from
                one administration workspace.
              </p>

            </header>


            <div
              className="impilo-admin-overview-grid"
            >


              {/* EDITORIAL */}

              <button
                type="button"
                className="impilo-admin-overview-card"
                onClick={() =>
                  selectTab(
                    "editorial"
                  )
                }
              >

                <span>
                  EDITORIAL
                </span>

                <strong>
                  Articles
                </strong>

                <p>
                  Create, edit and manage
                  editorial content.
                </p>

              </button>


              {/* MAGAZINE */}

              <button
                type="button"
                className="impilo-admin-overview-card"
                onClick={() =>
                  selectTab(
                    "magazine"
                  )
                }
              >

                <span>
                  MAGAZINE
                </span>

                <strong>
                  Magazine
                </strong>

                <p>
                  Manage magazine issues,
                  pages and publishing.
                </p>

              </button>


              {/* MEDIA */}

              <button
                type="button"
                className="impilo-admin-overview-card"
                onClick={() =>
                  selectTab(
                    "media"
                  )
                }
              >

                <span>
                  MEDIA
                </span>

                <strong>
                  Media
                </strong>

                <p>
                  Manage images, videos
                  and media assets.
                </p>

              </button>


              {/* USERS */}

              <button
                type="button"
                className="impilo-admin-overview-card"
                onClick={() =>
                  selectTab(
                    "users"
                  )
                }
              >

                <span>
                  MANAGEMENT
                </span>

                <strong>
                  Users
                </strong>

                <p>
                  Manage accounts and
                  editorial permissions.
                </p>

              </button>

            </div>

          </section>

        );


      // ==============================================
      // EDITORIAL
      // ==============================================

      case "editorial":

        return (

          <section
            className="impilo-admin-module"
          >

            <div
              className="impilo-admin-module-header"
            >

              <div>

                <span>
                  EDITORIAL
                </span>

                <h2>
                  Articles
                </h2>

              </div>


              <button
                type="button"
                className="impilo-admin-back-module"
                onClick={() =>
                  selectTab(
                    "overview"
                  )
                }
              >
                ← Overview
              </button>

            </div>


            <EditorialCMS
              onOpenInReview={() =>
                selectTab(
                  "in-review"
                )
              }
            />

          </section>

        );


      // ==============================================
      // IN REVIEW
      // ==============================================

      case "in-review":

        return (

          <section
            className="impilo-admin-module"
          >

            <div
              className="impilo-admin-module-header"
            >

              <div>

                <span>
                  EDITORIAL
                </span>

                <h2>
                  In Review
                </h2>

              </div>


              <button
                type="button"
                className="impilo-admin-back-module"
                onClick={() =>
                  selectTab(
                    "editorial"
                  )
                }
              >
                ← Articles
              </button>

            </div>


            <InReviewArticles />

          </section>

        );


      // ==============================================
      // MAGAZINE
      // ==============================================

      case "magazine":

        return (

          <section
            className="impilo-admin-module"
          >

            <div
              className="impilo-admin-module-header"
            >

              <div>

                <span>
                  IMPILO MAGAZINE
                </span>

                <h2>
                  Magazine Management
                </h2>

              </div>


              <button
                type="button"
                className="impilo-admin-back-module"
                onClick={() =>
                  selectTab(
                    "overview"
                  )
                }
              >
                ← Overview
              </button>

            </div>


            <MagazineManagement />

          </section>

        );


      // ==============================================
      // MEDIA
      // ==============================================

      case "media":

        return (

          <section
            className="impilo-admin-module"
          >

            <div
              className="impilo-admin-module-header"
            >

              <div>

                <span>
                  IMPILO MEDIA
                </span>

                <h2>
                  Media Management
                </h2>

              </div>


              <button
                type="button"
                className="impilo-admin-back-module"
                onClick={() =>
                  selectTab(
                    "overview"
                  )
                }
              >
                ← Overview
              </button>

            </div>


            <AdminMedia />

          </section>

        );


      // ==============================================
      // USERS
      // ==============================================

      case "users":

        return (

          <section
            className="impilo-admin-module"
          >

            <div
              className="impilo-admin-module-header"
            >

              <div>

                <span>
                  USER MANAGEMENT
                </span>

                <h2>
                  Users
                </h2>

              </div>


              <button
                type="button"
                className="impilo-admin-back-module"
                onClick={() =>
                  selectTab(
                    "overview"
                  )
                }
              >
                ← Overview
              </button>

            </div>


            <UserManagement />

          </section>

        );


      // ==============================================
      // SETTINGS
      // ==============================================

      case "settings":

        return (

          <section
            className="impilo-admin-module"
          >

            <div
              className="impilo-admin-module-header"
            >

              <div>

                <span>
                  IMPILO SYSTEM
                </span>

                <h2>
                  Settings
                </h2>

              </div>


              <button
                type="button"
                className="impilo-admin-back-module"
                onClick={() =>
                  selectTab(
                    "overview"
                  )
                }
              >
                ← Overview
              </button>

            </div>


            <div
              className="impilo-admin-placeholder"
            >

              <h3>
                System Settings
              </h3>

              <p>
                System settings will be
                connected here.
              </p>

            </div>

          </section>

        );


      // ==============================================
      // DEFAULT
      // ==============================================

      default:

        return null;

    }

  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <main
        className="impilo-admin-loading"
      >

        <div>

          <span>
            IMPILO
          </span>

          <p>
            Loading administration...
          </p>

        </div>

      </main>

    );

  }


  // ==================================================
  // DASHBOARD
  // ==================================================

  return (

    <main
      className="impilo-admin-dashboard"
    >


      {/* ============================================
          SIDEBAR
      ============================================ */}

      <aside
        className="impilo-admin-sidebar"
      >


        {/* BRAND */}

        <div
          className="impilo-admin-brand"
        >

          <strong>
            IMPILO
          </strong>

          <span>
            ADMIN
          </span>

        </div>


        {/* NAVIGATION */}

        <nav
          className="impilo-admin-nav"
        >


          {/* OVERVIEW */}

          <button
            type="button"
            className={
              activeTab === "overview"
                ? "active"
                : ""
            }
            onClick={() =>
              selectTab(
                "overview"
              )
            }
          >

            <span>
              Overview
            </span>

          </button>


          {/* EDITORIAL */}

          <button
            type="button"
            className={
              activeTab === "editorial"
                ? "active"
                : ""
            }
            onClick={() =>
              selectTab(
                "editorial"
              )
            }
          >

            <span>
              Editorial
            </span>

          </button>


          {/* IN REVIEW */}

          <button
            type="button"
            className={
              activeTab === "in-review"
                ? "active"
                : ""
            }
            onClick={() =>
              selectTab(
                "in-review"
              )
            }
          >

            <span>
              In Review
            </span>

          </button>


          {/* MAGAZINE */}

          <button
            type="button"
            className={
              activeTab === "magazine"
                ? "active"
                : ""
            }
            onClick={() =>
              selectTab(
                "magazine"
              )
            }
          >

            <span>
              Magazine
            </span>

          </button>


          {/* MEDIA */}

          <button
            type="button"
            className={
              activeTab === "media"
                ? "active"
                : ""
            }
            onClick={() =>
              selectTab(
                "media"
              )
            }
          >

            <span>
              Media
            </span>

          </button>


          {/* USERS */}

          <button
            type="button"
            className={
              activeTab === "users"
                ? "active"
                : ""
            }
            onClick={() =>
              selectTab(
                "users"
              )
            }
          >

            <span>
              Users
            </span>

          </button>


          {/* SETTINGS */}

          <button
            type="button"
            className={
              activeTab === "settings"
                ? "active"
                : ""
            }
            onClick={() =>
              selectTab(
                "settings"
              )
            }
          >

            <span>
              Settings
            </span>

          </button>

        </nav>


        {/* ==========================================
            SIDEBAR USER
        ========================================== */}

        <div
          className="impilo-admin-sidebar-bottom"
        >

          {user && (

            <div
              className="impilo-admin-user"
            >

              <strong>
                {user.displayName ||
                  user.username}
              </strong>

              <span>
                {user.role}
              </span>

            </div>

          )}


          <button
            type="button"
            className="impilo-admin-logout"
            onClick={
              logout
            }
          >
            Sign Out
          </button>

        </div>

      </aside>


      {/* ============================================
          MAIN AREA
      ============================================ */}

      <section
        className="impilo-admin-main"
      >


        {/* HEADER */}

        <header
          className="impilo-admin-header"
        >

          <div>

            <span>
              IMPILO DIGITAL MEDIA
            </span>

            <h1>
              Administration
            </h1>

          </div>


          <div
            className="impilo-admin-current-user"
          >

            <span>
              {user?.displayName ||
                user?.username}
            </span>

            <strong>
              {user?.role}
            </strong>

          </div>

        </header>


        {/* CONTENT */}

        <div
          className="impilo-admin-content"
        >

          {renderContent()}

        </div>

      </section>

    </main>

  );

}