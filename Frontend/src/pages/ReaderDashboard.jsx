import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";


function ReaderDashboard() {

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  useEffect(() => {

    async function loadDashboard() {

      try {

        setLoading(true);
        setError(null);

        const response =
          await api.get(
            "/gamification/dashboard"
          );

        setDashboard(
          response.data
        );

      } catch (error) {

        console.error(
          "Dashboard error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Unable to load dashboard"
        );

      } finally {

        setLoading(false);
      }
    }

    loadDashboard();

  }, []);


  /* ==================================================
     LOADING
     ================================================== */

  if (loading) {
    return (
      <main className="impilo-reader-dashboard-state">

        <div className="impilo-reader-loading-card">

          <span className="impilo-reader-loading-logo">
            IMPILO
          </span>

          <h1>
            Loading IMPILO...
          </h1>

          <div className="impilo-reader-loading-line" />

        </div>

      </main>
    );
  }


  /* ==================================================
     ERROR
     ================================================== */

  if (error) {
    return (
      <main className="impilo-reader-dashboard-state">

        <div className="impilo-reader-error-card">

          <span>
            IMPILO READER
          </span>

          <h1>
            Unable to load dashboard
          </h1>

          <p>
            {error}
          </p>

        </div>

      </main>
    );
  }


  if (!dashboard) {
    return null;
  }


  const {
    profile,
    achievements,
    leaderboard,
    recentActivity,
  } = dashboard;


  return (
    <main className="impilo-reader-dashboard">


      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="impilo-reader-dashboard-header">

        <div>

          <span className="impilo-reader-kicker">
            IMPILO READER
          </span>

          <h1>
            Reader Dashboard
          </h1>

          <p>
            Track your reading journey,
            achievements and XP.
          </p>

        </div>


        <div className="impilo-reader-level-card">

          <span>
            LEVEL
          </span>

          <strong>
            {profile.level}
          </strong>

          <p>
            {profile.levelName}
          </p>

        </div>

      </header>


      {/* ==================================================
          PROFILE SUMMARY
      ================================================== */}

      <section className="impilo-reader-stats">

        <article className="impilo-reader-stat-card">

          <span>
            EXPERIENCE
          </span>

          <strong>
            {profile.xp}
          </strong>

          <small>
            XP
          </small>

        </article>


        <article className="impilo-reader-stat-card">

          <span>
            RANK
          </span>

          <strong>
            #{profile.rank ?? "—"}
          </strong>

          <small>
            Leaderboard
          </small>

        </article>


        <article className="impilo-reader-stat-card">

          <span>
            LEVEL
          </span>

          <strong>
            {profile.level}
          </strong>

          <small>
            {profile.levelName}
          </small>

        </article>


        <article className="impilo-reader-stat-card">

          <span>
            PROGRESS
          </span>

          <strong>
            {profile.progress}%
          </strong>

          <small>
            Current level
          </small>

        </article>

      </section>


      {/* ==================================================
          LEVEL PROGRESS
      ================================================== */}

      <section className="impilo-reader-panel impilo-reader-progress-panel">

        <header>

          <div>

            <span>
              YOUR JOURNEY
            </span>

            <h2>
              Level Progress
            </h2>

          </div>

          <strong>
            {profile.progress}%
          </strong>

        </header>


        <div className="impilo-reader-progress-track">

          <div
            className="impilo-reader-progress-bar"
            style={{
              width:
                `${profile.progress}%`
            }}
          />

        </div>


        <div className="impilo-reader-progress-info">

          <span>
            {profile.progressXP} XP
          </span>

          <span>
            {profile.requiredXP} XP
          </span>

        </div>


        {profile.nextLevelXP !== null && (

          <p className="impilo-reader-next-level">

            <strong>
              {profile.nextLevelXP -
                profile.xp}
            </strong>{" "}
            XP to next level

          </p>

        )}

      </section>


      {/* ==================================================
          MAIN DASHBOARD GRID
      ================================================== */}

      <div className="impilo-reader-dashboard-grid">


        {/* ==================================================
            ACHIEVEMENTS
        ================================================== */}

        <section className="impilo-reader-panel">

          <header className="impilo-reader-panel-header">

            <div>

              <span>
                MILESTONES
              </span>

              <h2>
                Achievements
              </h2>

            </div>

            <strong>
              {achievements.length}
            </strong>

          </header>


          {achievements.length === 0 ? (

            <div className="impilo-reader-empty">

              <div>
                🏆
              </div>

              <p>
                No achievements yet.
              </p>

              <small>
                Keep reading to unlock
                your first milestone.
              </small>

            </div>

          ) : (

            <div className="impilo-achievement-list">

              {achievements.map(
                achievement => (

                  <article
                    key={
                      achievement.id
                    }
                    className="impilo-achievement-card"
                  >

                    <div className="impilo-achievement-icon">

                      {achievement.icon ||
                        "🏆"}

                    </div>


                    <div className="impilo-achievement-content">

                      <h3>
                        {achievement.name}
                      </h3>

                      <p>
                        {achievement.description}
                      </p>


                      <div className="impilo-achievement-progress">

                        <div>

                          <span>
                            Progress
                          </span>

                          <strong>
                            {achievement.progress}
                            {" / "}
                            {achievement.target}
                          </strong>

                        </div>

                        <div className="impilo-achievement-track">

                          <div
                            className="impilo-achievement-fill"
                            style={{
                              width:
                                `${
                                  achievement.target > 0
                                    ? Math.min(
                                        100,
                                        (
                                          achievement.progress /
                                          achievement.target
                                        ) * 100
                                      )
                                    : 0
                                }%`
                            }}
                          />

                        </div>

                      </div>

                    </div>


                    <div className="impilo-achievement-xp">

                      <strong>
                        +{achievement.points}
                      </strong>

                      <span>
                        XP
                      </span>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>


        {/* ==================================================
            LEADERBOARD
        ================================================== */}

        <section className="impilo-reader-panel">

          <header className="impilo-reader-panel-header">

            <div>

              <span>
                COMMUNITY
              </span>

              <h2>
                Leaderboard
              </h2>

            </div>

            <span>
              TOP READERS
            </span>

          </header>


          <div className="impilo-leaderboard">

            {leaderboard.map(
              player => (

                <div
                  key={
                    player.userId
                  }
                  className={
                    `impilo-leaderboard-row ${
                      player.rank <= 3
                        ? "top-rank"
                        : ""
                    }`
                  }
                >

                  <strong className="impilo-leaderboard-rank">

                    #{player.rank}

                  </strong>


                  <div className="impilo-leaderboard-player">

                    <strong>
                      {
                        player.displayName ||
                        player.username
                      }
                    </strong>

                  </div>


                  <span className="impilo-leaderboard-xp">

                    {player.points} XP

                  </span>

                </div>

              )
            )}

          </div>

        </section>


        {/* ==================================================
            RECENT ACTIVITY
        ================================================== */}

        <section className="impilo-reader-panel impilo-reader-activity-panel">

          <header className="impilo-reader-panel-header">

            <div>

              <span>
                YOUR JOURNEY
              </span>

              <h2>
                Recent Activity
              </h2>

            </div>

          </header>


          {recentActivity.length === 0 ? (

            <div className="impilo-reader-empty">

              <div>
                ✦
              </div>

              <p>
                No recent activity.
              </p>

            </div>

          ) : (

            <div className="impilo-reader-activity-list">

              {recentActivity.map(
                activity => (

                  <div
                    key={
                      activity.id
                    }
                    className="impilo-reader-activity-row"
                  >

                    <div className="impilo-activity-icon">
                      ✦
                    </div>

                    <div>

                      <strong>
                        {activity.reason}
                      </strong>

                    </div>

                    <span
                      className={
                        activity.points > 0
                          ? "positive"
                          : "negative"
                      }
                    >
                      {activity.points > 0
                        ? "+"
                        : ""}
                      {activity.points} XP
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>


      </div>

    </main>
  );
}


export default ReaderDashboard;