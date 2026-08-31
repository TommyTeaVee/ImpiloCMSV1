import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import api from "../../services/api";


const ROLES = [
  "ADMIN",
  "EDITOR",
  "WRITER",
  "MODERATOR",
  "READER"
];


export default function UserManagement() {

  const [users, setUsers] =
    useState([]);

  const [currentUser, setCurrentUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [updatingUser, setUpdatingUser] =
    useState(null);


  // ==================================================
  // LOAD CURRENT USER
  // ==================================================

  const loadCurrentUser = async () => {

    try {

      const response =
        await api.get(
          "/auth/me"
        );

      setCurrentUser(
        response.data?.user || null
      );

    } catch (err) {

      console.error(
        "Failed to load current user:",
        err
      );

      /*
       * The AdminDashboard already
       * protects this area, so we don't
       * need to redirect here.
       */

    }

  };


  // ==================================================
  // LOAD USERS
  // ==================================================

  const loadUsers = async () => {

    try {

      setLoading(true);
      setError(null);


      const response =
        await api.get(
          "/users"
        );


      setUsers(
        Array.isArray(
          response.data?.users
        )
          ? response.data.users
          : []
      );


    } catch (err) {

      console.error(
        "Failed to load users:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Unable to load users"
      );


    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {

    loadCurrentUser();
    loadUsers();

  }, []);


  // ==================================================
  // FILTER USERS
  // ==================================================

  const filteredUsers = useMemo(() => {

    const query =
      search
        .trim()
        .toLowerCase();


    return users.filter(
      (user) => {

        const matchesSearch =
          !query ||
          user.username
            ?.toLowerCase()
            .includes(query) ||
          user.displayName
            ?.toLowerCase()
            .includes(query) ||
          user.email
            ?.toLowerCase()
            .includes(query);


        const matchesRole =
          roleFilter === "ALL" ||
          user.role === roleFilter;


        return (
          matchesSearch &&
          matchesRole
        );

      }
    );

  }, [
    users,
    search,
    roleFilter
  ]);


  // ==================================================
  // AVAILABLE ROLES
  // ==================================================

  function getAvailableRoles(user) {

    /*
     * ADMIN can manage every role.
     */

    if (
      currentUser?.role === "ADMIN"
    ) {

      return ROLES;

    }


    /*
     * EDITOR cannot:
     *
     * - modify an ADMIN
     * - promote someone to ADMIN
     */

    if (
      currentUser?.role === "EDITOR"
    ) {

      return ROLES.filter(
        (role) =>
          role !== "ADMIN"
      );

    }


    /*
     * Safety fallback.
     */

    return [
      user.role
    ];

  }


  // ==================================================
  // CAN MANAGE USER
  // ==================================================

  function canManageUser(user) {

    /*
     * Nobody can change their own role.
     */

    if (
      currentUser?.id === user.id
    ) {

      return false;

    }


    /*
     * ADMIN can manage everyone
     * except their own account.
     */

    if (
      currentUser?.role === "ADMIN"
    ) {

      return true;

    }


    /*
     * EDITOR cannot modify ADMIN.
     */

    if (
      currentUser?.role === "EDITOR" &&
      user.role === "ADMIN"
    ) {

      return false;

    }


    return (
      currentUser?.role === "EDITOR"
    );

  }


  // ==================================================
  // CHANGE ROLE
  // ==================================================

  const changeRole = async (
    user,
    newRole
  ) => {

    if (
      !newRole ||
      newRole === user.role
    ) {

      return;

    }


    /*
     * Frontend permission check.
     *
     * Backend remains the final authority.
     */

    if (
      !canManageUser(user)
    ) {

      setError(
        "You do not have permission to change this user's role."
      );

      return;

    }


    /*
     * Editors cannot promote
     * anyone to ADMIN.
     */

    if (
      currentUser?.role === "EDITOR" &&
      newRole === "ADMIN"
    ) {

      setError(
        "Editors cannot assign the ADMIN role."
      );

      return;

    }


    const confirmed =
      window.confirm(
        `Change ${
          user.displayName ||
          user.username
        }'s role from ${
          user.role
        } to ${
          newRole
        }?`
      );


    if (!confirmed) {

      return;

    }


    try {

      setUpdatingUser(
        user.id
      );

      setError(null);


      const response =
        await api.put(
          `/users/${user.id}/role`,
          {
            role: newRole
          }
        );


      const updatedUser =
        response.data?.user;


      if (!updatedUser) {

        throw new Error(
          "Updated user was not returned."
        );

      }


      setUsers(
        (currentUsers) =>
          currentUsers.map(
            (currentUser) =>
              currentUser.id ===
              user.id
                ? updatedUser
                : currentUser
          )
      );


    } catch (err) {

      console.error(
        "Failed to update user role:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Unable to update user role"
      );


    } finally {

      setUpdatingUser(
        null
      );

    }

  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <section
        className="impilo-user-management"
      >

        <div
          className="impilo-user-management-loading"
        >
          Loading users...
        </div>

      </section>

    );

  }


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <section
      className="impilo-user-management"
    >


      {/* ==========================================
          HEADER
      ========================================== */}

      <header
        className="impilo-user-management-header"
      >

        <div>

          <span>
            USER MANAGEMENT
          </span>

          <h1>
            Users
          </h1>

          <p>
            Manage editorial access and
            user roles.
          </p>

        </div>


        <div
          className="impilo-user-management-count"
        >
          {users.length} users
        </div>

      </header>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (

        <div
          className="impilo-user-management-error"
          role="alert"
        >
          {error}
        </div>

      )}


      {/* ==========================================
          FILTERS
      ========================================== */}

      <div
        className="impilo-user-management-filters"
      >

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search users..."
          aria-label="Search users"
        />


        <select
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(
              event.target.value
            )
          }
          aria-label="Filter users by role"
        >

          <option value="ALL">
            All roles
          </option>


          {ROLES.map(
            (role) => (

              <option
                key={role}
                value={role}
              >
                {role}
              </option>

            )
          )}

        </select>

      </div>


      {/* ==========================================
          TABLE
      ========================================== */}

      <div
        className="impilo-user-management-table-wrap"
      >

        <table
          className="impilo-user-management-table"
        >

          <thead>

            <tr>

              <th>
                User
              </th>

              <th>
                Email
              </th>

              <th>
                Role
              </th>

              <th>
                Joined
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredUsers.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="impilo-user-management-empty"
                >
                  No users found.
                </td>

              </tr>

            ) : (

              filteredUsers.map(
                (user) => {

                  const availableRoles =
                    getAvailableRoles(
                      user
                    );

                  const canManage =
                    canManageUser(
                      user
                    );


                  return (

                    <tr
                      key={user.id}
                    >


                      {/* USER */}

                      <td>

                        <div
                          className="impilo-user-cell"
                        >

                          {user.avatarUrl ? (

                            <img
                              src={
                                user.avatarUrl
                              }
                              alt=""
                            />

                          ) : (

                            <div
                              className="impilo-user-avatar"
                            >

                              {(
                                user.displayName ||
                                user.username ||
                                "?"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                          )}


                          <div>

                            <strong>
                              {
                                user.displayName ||
                                user.username
                              }
                            </strong>

                            <small>
                              @
                              {
                                user.username
                              }
                            </small>

                          </div>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td>
                        {
                          user.email ||
                          "—"
                        }
                      </td>


                      {/* ROLE */}

                      <td>

                        <select
                          value={
                            user.role
                          }

                          disabled={
                            !canManage ||
                            updatingUser ===
                              user.id
                          }

                          onChange={(
                            event
                          ) =>
                            changeRole(
                              user,
                              event.target.value
                            )
                          }

                          aria-label={
                            `Change role for ${
                              user.displayName ||
                              user.username
                            }`
                          }
                        >

                          {availableRoles.map(
                            (role) => (

                              <option
                                key={role}
                                value={role}
                              >
                                {role}
                              </option>

                            )
                          )}

                        </select>

                      </td>


                      {/* JOINED */}

                      <td>

                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "—"}

                      </td>

                    </tr>

                  );

                }
              )

            )}

          </tbody>

        </table>

      </div>

    </section>

  );

}