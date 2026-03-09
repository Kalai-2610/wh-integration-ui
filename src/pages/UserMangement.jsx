import { useEffect, useState } from "react";
import { USERS } from "../service/data";
import '../styles/UserManagement.css'
import { formatDate } from "../service/utils";
import STRINGS from "../assets/strings";

export default function UserManagement() {

  const isSystemUser = localStorage.getItem("isSystem") === "true";
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState(1);
  const [size, setSize] = useState(5);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [total, setTotal] = useState('asc')
  const [totalPages, setTotalPages] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editID, setEditID] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const sizes = [5, 10, 15, 20, 25, 50];

  const fetchUsers = () => {
    const params = {
      params: {
        page: page,
        size: size,
        sortBy: sortBy,
        sortOrder: sortOrder,
        search: search,
        isActive: isActive
      }
    };
    USERS.get_all(params).then(res => {
      setUsers(res.data.data);
      setTotal(res.data.pagination.total)
      setTotalPages(Math.ceil(total / size));
    }).catch(err => console.error(err));
  };

  const handleSort = (key) => {
    if (key != sortBy || sortOrder === 'desc')
      setSortOrder('asc')
    else
      setSortOrder('desc')
    setSortBy(key);
  }

  const validateCreate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email";
    }
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validateCreate()) return;
    USERS.create(form).then(res => {
      if (res?.data?.success) {
        fetchUsers();
        setShowCreateModal(false);
      } else if (res.data.error === STRINGS.API_ERRORS.email_exists) {
        setErrors({ email: STRINGS.API_ERRORS.email_exists })
      }
    }).catch(err => console.error(err));
  };

  const handleEdit = () => {
    if (!form.name) {
      setErrors({ name: "Name required" });
      return;
    }
    USERS.update(editID, form).then(res => {
      if (res.data.success) {
        fetchUsers();
        setShowEditModal(false);
      }
    }).catch(err => console.error(err));
  };

  useEffect(fetchUsers, [page, size, sortBy, sortOrder, search, isActive]);


  return (
    <div className="user-page">
      <div className="page-header">
        <h2>User Management</h2>
        <button
          className="create-btn"
          onClick={() => {
            setForm({ name: "", email: "", password: "" });
            setErrors({});
            setShowCreateModal(true);
          }}
        >
          + Create User
        </button>
      </div>

      <div className="filters">
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="status-filter"
          value={isActive}
          onChange={(e) => setIsActive(Number(e.target.value))}
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}> Name </th>
            <th onClick={() => handleSort("email")}> Email </th>
            <th onClick={() => handleSort("_updatedBy")}> Updated By </th>
            <th onClick={() => handleSort("_updated_on")}> Updated On </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td onClick={() => setSelectedUser(u)}>{u.name}</td>
              <td onClick={() => setSelectedUser(u)}>{u.email}</td>
              <td onClick={() => setSelectedUser(u)}>{u._updatedBy?.name}</td>
              <td onClick={() => setSelectedUser(u)}>
                {formatDate(u._updated_on)}
              </td>
              <td>
                <button className="edit-btn" onClick={(e) => {
                  e.stopPropagation();
                  setForm({ name: u.name });
                  setEditID(u._id)
                  setShowEditModal(true);
                }}>
                  Edit
                </button>
                {isSystemUser && (
                  <button className="status-btn">
                    {u.is_active ? "Deactivate" : "Activate"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {total > 5 && (
        <div className="pagination">
          <div className="pagination-left">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <span className="page-info">
              Page <b>{page}</b> of <b>{totalPages}</b>
            </span>
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>

          <div className="pagination-right">
            <span className="page-size-label">
              Rows:
            </span>
            <select
              className="page-size-select"
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create User</h3>
            <button
              className="modal-close"
              onClick={() => setShowCreateModal(false)}
            >
              ✕
            </button>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <div className="input-error">{errors.name}</div>}
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <div className="input-error">{errors.email}</div>}
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <div className="input-error">{errors.password}</div>}
            <div className="modal-actions">
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit User</h3>
            <button
              className="modal-close"
              onClick={() => setShowEditModal(false)}
            >
              ✕
            </button>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <div className="input-error">{errors.name}</div>}
            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
              <button onClick={handleEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>User Details</h3>
            <button
              className="modal-close"
              onClick={() => setSelectedUser(null)}
            >
              ✕
            </button>
            <p><b>Name:</b> {selectedUser.name}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Created By:</b> {selectedUser?._createdBy?.name ?? "-"}</p>
            <p><b>Updated By:</b> {selectedUser?._updatedBy?.name ?? "-"}</p>
          </div>
        </div>
      )}
    </div>
  );
}