import { useEffect, useState } from "react";
import { CREDENTIALS } from "../service/data";
import { formatDate, formatDateTime } from "../service/utils";
import "../styles/CredentialManagement.css";

const TYPE_OPTIONS = [
  { value: "basic", label: "Basic" },
  { value: "api_key", label: "API Key" },
  { value: "token", label: "Token" },
  { value: "oauth2", label: "OAuth 2.0" }
];
const SCOPES = ["read", "write", "delete"];

export default function CredentialsManagement() {

  const isSystemUser = localStorage.getItem("isSystem") === "true";
  const [credentials, setCredentials] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState(5);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [total, setTotal] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editID, setEditID] = useState(null);
  const [selectedCredential, setSelectedCredential] = useState(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    scopes: [],
    username: "",
    password: "",
    expire_in: ""
  });
  const [errors, setErrors] = useState({});

  const sizes = [5, 10, 15, 20, 25, 50];

  const fetchCredentials = () => {
    const params = {
      params: {
        page,
        size,
        sortBy,
        sortOrder,
        name,
        type
      }
    };
    CREDENTIALS.get_all(params).then(res => {
      const data = res.data.data.map(c => ({
        ...c,
        scopes: Object.keys(c.scopes || {}).filter(k => c.scopes[k])
      }));
      setCredentials(data);
      setTotal(res.data.pagination.total);
    });
  };

  const handleSort = (key) => {
    if (key !== sortBy || sortOrder === "desc")
      setSortOrder("asc");
    else
      setSortOrder("desc");
    setSortBy(key);
  };

  useEffect(fetchCredentials, [page, size, sortBy, sortOrder, name, type]);

  const displayType = (type) => {
    return TYPE_OPTIONS.filter(item => item.value === type).at(0).label ?? "-"
  }
  const displayScope = (scopes = []) => {
    return scopes.map(s => s.at(0).toUpperCase() + s.slice(1)).join(" ")
  }
  const toggleScope = (scope) => {
    let res = [...(form.scopes ?? [])];
    console.log("Before", res)
    const exists = res?.includes(scope);
    if (exists)
      res = res.filter(s => s !== scope);
    else
      res.push(scope);
    setForm({ ...form, scopes: res });
    console.log("After", form.scopes)
  };

  const validateCreate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.type) newErrors.type = "Type is required";
    if (!form.scopes?.length) newErrors.scopes = "Scope is required";
    if (form.type === 'basic') {
      if (!form.username) newErrors.username = "Username is required";
      if (!form.password) newErrors.password = "Password is required";
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;
  }
  const handleCreate = () => {
    if (!validateCreate()) return;
    const payload = {
      ...form,
      scopes: form.scopes
    };
    CREDENTIALS.create(payload).then(() => {
      fetchCredentials();
      setShowCreateModal(false);
    });
  };

  const handleEdit = () => {
    const newErrors = {}
    if (!form.name) newErrors.name = "Name is required"
    if (!form.scopes?.length) newErrors.scopes = "Scope is required"
    setErrors(newErrors)
    if (!form.name || !form.scopes?.length) return;
    const payload = {
      name: form.name,
      scopes: form.scopes
    };
    CREDENTIALS.update(editID, payload).then(() => {
      fetchCredentials();
      setShowEditModal(false);
    });
  };

  const handleDelete = (_id) => {
    if (!window.confirm("Delete credential?")) return;
    CREDENTIALS.delete(_id).then(() => fetchCredentials());
  };

  const handleClear = () => {
    if (!window.confirm("Clear expired credentials?")) return;
    CREDENTIALS.clear().then(() => fetchCredentials());
  }

  const totalPages = Math.ceil(total / size);

  return (
    <div className="credential-page">
      <div className="page-header">
        <h2>Credential Management</h2>
        <div>
          <button
            className="create-btn"
            onClick={() => {
              setForm({ name: "", email: "", password: "" });
              setErrors({});
              setShowCreateModal(true);
            }}
          >
            + Create
          </button>
          {isSystemUser && <button
            className="clear-btn"
            onClick={handleClear}
          >
            Clear
          </button>}
        </div>
      </div>

      <div className="filters">
        <input
          className="name-input"
          type="text"
          placeholder="Name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="type-filter"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value=''>Select</option>
          {TYPE_OPTIONS.map(item => (<option value={item.value}>{item.label}</option>))}
        </select>
      </div>

      <table className="credentials-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}> Name </th>
            <th onClick={() => handleSort("type")}> Type </th>
            <th> Scope </th>
            <th onClick={() => handleSort("_expire_on")}> Expire At </th>
            <th onClick={() => handleSort("_updatedBy")}> Updated By </th>
            <th onClick={() => handleSort("_updated_on")}> Updated On </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {credentials.map((c) => (
            <tr key={c._id}>
              <td onClick={() => setSelectedCredential(c)}>{c.name}</td>
              <td onClick={() => setSelectedCredential(c)}>{displayType(c.type)}</td>
              <td onClick={() => setSelectedCredential(c)}>{displayScope(c.scopes)}</td>
              <td onClick={() => setSelectedCredential(c)}>{formatDateTime(c._expire_on)}</td>
              <td onClick={() => setSelectedCredential(c)}>{c._updatedBy?.name}</td>
              <td onClick={() => setSelectedCredential(c)}>{formatDate(c._updated_on)}</td>
              <td>
                <button className="edit-btn" onClick={(e) => {
                  e.stopPropagation();
                  setErrors({})
                  setForm({ name: c.name, scopes: c.scopes });
                  setEditID(c._id)
                  setShowEditModal(true)
                }}>
                  Edit
                </button>
                <button className="delete-btn" onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(c._id);
                }}>
                  Delete
                </button>
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
            <h3>Create Credential</h3>
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
            <select
              className="type-filter"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="">Select Type</option>
              {TYPE_OPTIONS.map(item => (<option value={item.value}>{item.label}</option>))}
            </select>
            {errors.type && <div className="input-error">{errors.type}</div>}
            {
              form.type === "basic" &&
              <>
                <input
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                {errors.username && <div className="input-error">{errors.username}</div>}
                <input
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {errors.password && <div className="input-error">{errors.password}</div>}
              </>
            }
            <div className="scope-box">
              {SCOPES.map(scope => (
                <label key={scope}>
                  <input
                    type="checkbox"
                    checked={form.scopes?.includes(scope)}
                    onChange={() => toggleScope(scope)}
                  />
                  {scope.toUpperCase()}
                </label>
              ))}
            </div>
            {errors.scopes && <div className="input-error">{errors.scopes}</div>}
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
            <h3>Edit Credential</h3>
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
            <div className="scope-box">
              {SCOPES.map(scope => (
                <label key={scope}>
                  <input
                    type="checkbox"
                    checked={form.scopes.includes(scope)}
                    onChange={() => toggleScope(scope)}
                  />
                  {scope.toUpperCase()}
                </label>
              ))}
            </div>
            {errors.scopes && <div className="input-error">{errors.scopes}</div>}
            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
              <button onClick={handleEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
      {selectedCredential && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>User Details</h3>
            <button
              className="modal-close"
              onClick={() => setSelectedCredential(null)}
            >
              ✕
            </button>
            <p>
              <b>Name       :</b> {selectedCredential.name} <br />
              <b>Type       :</b> {displayType(selectedCredential.type)} <br />
              {
                selectedCredential.type === "basic" && (
                  <><b>User Name  :</b> {selectedCredential?.username ?? "-"} <br /></>
                )
              }
              {
                selectedCredential.type === "api_key" && (
                  <><b>API Key    :</b> {selectedCredential?.api_key ?? "-"} <br /></>
                )
              }
              {
                selectedCredential.type === "token" && (
                  <><b>Token      :</b> {selectedCredential?.token ?? "-"} <br /></>
                )
              }
              {
                selectedCredential.type === "oauth2" && (
                  <><b>Client ID  :</b> {selectedCredential?.client_id ?? "-"} <br />
                    <b>Secret     :</b> {selectedCredential?.client_secret ?? "-"} <br /></>
                )
              }
              <b>Created By :</b> {selectedCredential?._createdBy?.name ?? "-"} <br />
              <b>Created On :</b> {formatDateTime(selectedCredential?._created_on) ?? "-"} <br />
              <b>Updated By :</b> {selectedCredential?._updatedBy?.name ?? "-"} <br />
              <b>Updated On :</b> {formatDateTime(selectedCredential?._updated_on) ?? "-"} <br />
              <b>Expire On  :</b> {formatDateTime(selectedCredential?._expire_on) ?? "-"} <br />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}