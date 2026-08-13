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


  if (loading) {
    return (
      <main>
        <h1>Loading IMPILO...</h1>
      </main>
    );
  }


  if (error) {
    return (
      <main>
        <h1>IMPILO Reader</h1>

        <p>{error}</p>
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
    <main>

      <header>
        <h1>
          IMPILO Reader
        </h1>

        <p>
          Level {profile.level} —{" "}
          {profile.levelName}
        </p>

        <h2>
          {profile.xp} XP
        </h2>

        <p>
          Rank #{profile.rank ?? "—"}
        </p>
      </header>


      <section>
        <h2>
          Level Progress
        </h2>

        <progress
          value={profile.progress}
          max="100"
        />

        <p>
          {profile.progressXP} /{" "}
          {profile.requiredXP} XP
        </p>

        {profile.nextLevelXP !== null && (
          <p>
            {profile.nextLevelXP -
              profile.xp}{" "}
            XP to next level
          </p>
        )}
      </section>


      <section>
        <h2>
          Achievements
        </h2>

        {achievements.length === 0 ? (
          <p>
            No achievements yet.
          </p>
        ) : (
          achievements.map(
            achievement => (
              <article
                key={
                  achievement.id
                }
              >
                <h3>
                  {achievement.icon ||
                    "🏆"}{" "}
                  {achievement.name}
                </h3>

                <p>
                  {achievement.description}
                </p>

                <p>
                  {achievement.progress} /{" "}
                  {achievement.target}
                </p>

                <p>
                  +{achievement.points} XP
                </p>
              </article>
            )
          )
        )}
      </section>


      <section>
        <h2>
          Leaderboard
        </h2>

        {leaderboard.map(
          player => (
            <div
              key={
                player.userId
              }
            >
              <strong>
                #{player.rank}
              </strong>{" "}

              {player.displayName ||
                player.username}

              {" — "}

              {player.points} XP
            </div>
          )
        )}
      </section>


      <section>
        <h2>
          Recent Activity
        </h2>

        {recentActivity.map(
          activity => (
            <div
              key={
                activity.id
              }
            >
              <strong>
                {activity.points > 0
                  ? "+"
                  : ""}
                {activity.points} XP
              </strong>{" "}

              {activity.reason}
            </div>
          )
        )}
      </section>

    </main>
  );
}

export default ReaderDashboard;