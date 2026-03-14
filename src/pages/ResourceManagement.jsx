import { useEffect, useState } from "react";
import { RESOURCES } from "../service/data";
import { formatDate } from "../service/utils";
import "../styles/ResourceManagement.css";
import SchemaBuilder from "../components/SchemaBuilder";

const AUTH_METHODS = [
  { label: "Open", value: "open" },
  { label: "Basic", value: "basic" },
  { label: "API Key", value: "api_key" },
  { label: "Token", value: "token" },
  { label: "OAuth 2.0", value: "oauth2" }
];

export default function ResourceManagement() {

  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [size, setSize] = useState(5);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [total, setTotal] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [editID, setEditID] = useState(null);

  const [form, setForm] = useState({
    name: "",
    schema: [],
    api_path: "",
    reference_name: "",
    allowed_auth_methods: []
  });

  const [errors, setErrors] = useState({});

  const sizes = [5, 10, 15, 20, 25, 50];

  const fetchResources = () => {
    const params = {
      params: {
        page,
        size,
        sortBy,
        sortOrder,
        name: search
      }
    };

    RESOURCES.get_all(params)
      .then(res => {
        setResources(res.data.data);
        setTotal(res.data.pagination.total);
      });
  };

  useEffect(fetchResources, [page, size, sortBy, sortOrder, search]);
  const toggleAuthMethod = (method) => {

    let methods = [...(form.allowed_auth_methods || [])];

    if (methods.includes(method))
      methods = methods.filter(m => m !== method);
    else
      methods.push(method);

    setForm({ ...form, allowed_auth_methods: methods });

  };

  const handleSort = (key) => {
    if (key !== sortBy || sortOrder === "desc")
      setSortOrder("asc");
    else
      setSortOrder("desc");

    setSortBy(key);
  };

  const validateCreate = () => {

    const newErrors = {};

    if (!form.name) newErrors.name = "Name required";
    if (!form.schema.length) newErrors.schema = "Schema required";
    if (!form.api_path) newErrors.api_path = "API Path required";
    if (!form.reference_name) newErrors.reference_name = "Reference name required";
    if (!form.allowed_auth_methods.length) newErrors.allowed_auth_methods = "Auth method required";

    try {
      const schema = form.schema;
      console.log(schema);
      const checkDepth = (obj, depth = 1) => {
        console.log(obj, depth, import.meta.env.VITE_OBJ_DEPTH);
        if (depth > Number.parseInt(import.meta.env.VITE_OBJ_DEPTH)) return false;
        if (Array.isArray(obj)) {
          return obj.map(item => checkDepth(item, depth)).every(item => item)
        } else if (typeof obj === "object" && Object.keys(obj).includes('keys') && obj.keys.length) {
          return checkDepth(obj.keys, depth + 1)
        }
        return true;
      }

      if (!checkDepth(schema))
        newErrors.schema = `Schema nesting > ${import.meta.env.VITE_OBJ_DEPTH} levels not allowed`;

    } catch {
      newErrors.schema = "Schema must be valid JSON";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const cleanSchema = (schema) => {

    const removeEmpty = (obj) => {

      const cleaned = {};

      for (const key in obj) {

        let value = obj[key];

        if (
          value === "" ||
          value === null ||
          value === undefined ||
          (Array.isArray(value) && value.length === 0)
        )
          continue;

        if (key === "showSettings")
          continue;

        if (key === "keys") {
          value = cleanSchema(value);
          if (!value.length) continue;
        }

        cleaned[key] = value;

      }

      return cleaned;

    };

    return schema.map(removeEmpty);

  };
  const handleCreate = () => {

    if (!validateCreate()) return;
    const cleanedSchema = cleanSchema(form.schema);

    const payload = {
      ...form,
      schema: cleanedSchema
    };

    RESOURCES.create(payload)
      .then((res) => {
        if (!res.data.success) {
          const message = [];
          if (res.data.errors?.length) {
            if (typeof res.data.errors[0] === "object")
              res.data.errors.forEach(item => message.push(item.key + ":\n\t" + item?.errors.join("\n\t")))
            else
              message.push(...res.data.errors)
          }
          if (!window.alert("Clear the below Errors: \n" + res.data.error + "\n" + message.join("\n"))) return
        }
        fetchResources();
        setShowCreateModal(false);
      });
  };

  const handleEdit = () => {

    if (!validateCreate()) return;
    const cleanedSchema = cleanSchema(form.schema);

    RESOURCES.update(editID, {
      name: form.name,
      api_path: form.api_path,
      allowed_auth_methods: form.allowed_auth_methods,
      schema: cleanedSchema
    }).then((res) => {
      if (!res.data.success) {
        const message = [];
        if (res.data.errors?.length) {
          res.data.errors.forEach(item => message.push(item.key + ":\n\t" + item.errors.join("\n\t")))
        }
        if (!window.alert("Clear the below Errors: \n" + res.data.error + "\n" + message.join("\n"))) return
      }
      fetchResources();
      setShowEditModal(false);
    });
  };

  const handleDelete = (id) => {

    if (!window.confirm("Delete resource?")) return;

    RESOURCES.delete(id)
      .then(fetchResources);
  };

  const displayAuthMethods = (methods = []) => {
    return methods
      .map(m => AUTH_METHODS.find(a => a.value === m)?.label)
      .filter(Boolean)
      .join(", ");
  }
  const totalPages = Math.ceil(total / size);

  const SchemaViewer = ({ schema, depth = 0 }) => {
    return (

      <div style={{ marginLeft: depth * 20 }}>
        {schema.map((field, i) => (

          <div key={i} className="schema-view-row">
            <div>
              <b>{field.key}</b> ({field.type})
              {field.required && " • required"}
              {field.is_multiple && " • multiple"}
            </div>
            {field.options?.length > 0 && (
              <div className="schema-view-options">
                Options: {field.options.join(", ")}
              </div>
            )}
            {field.min !== undefined && <div>Min: {field.min}</div>}
            {field.max !== undefined && <div>Max: {field.max}</div>}

            {field.regex && <div>Regex: {field.regex}</div>}

            {field.email && <div>Email validation</div>}

            {field.integer && <div>Integer</div>}
            {field.decimal && <div>Decimal</div>}

            {field.min_size && <div>Min Size: {field.min_size}</div>}
            {field.max_size && <div>Max Size: {field.max_size}</div>}
            {field.unique && <div>Unique values</div>}

            {field.keys?.length > 0 && (
              <SchemaViewer schema={field.keys} depth={depth + 1} />
            )}

          </div>

        ))}

      </div>

    );

  };
  return (
    <div className="resource-page">

      <div className="page-header">
        <h2>Resource Management</h2>

        <button
          className="create-btn"
          onClick={() => {
            setForm({
              name: "",
              schema: [],
              api_path: "",
              reference_name: "",
              allowed_auth_methods: []
            });
            setErrors({});
            setShowCreateModal(true);
          }}
        >
          + Create
        </button>

      </div>

      <div className="filters">
        <input
          className="search-input"
          placeholder="Search name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="resource-table">

        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("api_path")}>API Path</th>
            <th>Allowed Methods</th>
            <th>Updated By</th>
            <th onClick={() => handleSort("_updated_on")}>Updated On</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {resources.map(r => (
            <tr key={r._id}>

              <td onClick={() => setSelectedResource(r)} style={{ cursor: "pointer" }}>{r.name}</td>

              <td onClick={() => setSelectedResource(r)} style={{ cursor: "pointer" }}>{r.api_path}</td>

              <td onClick={() => setSelectedResource(r)} style={{ cursor: "pointer" }}>{displayAuthMethods(r.allowed_auth_methods)}</td>

              <td onClick={() => setSelectedResource(r)} style={{ cursor: "pointer" }}>{r._updatedBy?.name}</td>

              <td onClick={() => setSelectedResource(r)} style={{ cursor: "pointer" }}>{formatDate(r._updated_on)}</td>

              <td>

                <button
                  className="edit-btn"
                  onClick={() => {
                    setForm({
                      name: r.name,
                      api_path: r.api_path,
                      allowed_auth_methods: r.allowed_auth_methods,
                      schema: r.schema,
                      reference_name: r.reference_name
                    });
                    setEditID(r._id);
                    setErrors({});
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(r._id)}
                >
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
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            Page {page} of {totalPages}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>

          </div>

          <div className="pagination-right">

            Rows

            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(1);
              }}
            >

              {sizes.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}

            </select>

          </div>

        </div>

      )}

      {/* CREATE MODAL */}

      {showCreateModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>Create Resource</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <div className="input-error">{errors.name}</div>}

            <input
              placeholder="API Path"
              value={form.api_path}
              onChange={(e) => setForm({ ...form, api_path: e.target.value })}
            />
            {errors.api_path && <div className="input-error">{errors.api_path}</div>}

            <input
              placeholder="Reference Name"
              value={form.reference_name}
              onChange={(e) => setForm({ ...form, reference_name: e.target.value })}
            />
            {errors.reference_name && <div className="input-error">{errors.reference_name}</div>}

            <SchemaBuilder
              schema={form.schema}
              setSchema={(schema) => setForm({ ...form, schema })}
            />
            {errors.schema && <div className="input-error">{errors.schema}</div>}

            <div className="method-box">

              {AUTH_METHODS.map(m => (

                <label key={m.value}>

                  <input
                    type="checkbox"
                    checked={form.allowed_auth_methods.includes(m.value)}
                    onChange={() => toggleAuthMethod(m.value)}
                  />

                  {m.label}

                </label>

              ))}

            </div>

            {errors.allowed_auth_methods && (
              <div className="input-error">{errors.allowed_auth_methods}</div>
            )}

            <div className="modal-actions">

              <button onClick={() => setShowCreateModal(false)}>Cancel</button>

              <button onClick={handleCreate}>Create</button>

            </div>

          </div>

        </div>

      )}

      {/* EDIT MODAL */}

      {showEditModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>Edit Resource</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <div className="input-error">{errors.name}</div>}

            <input
              placeholder="API Path"
              value={form.api_path}
              onChange={(e) => setForm({ ...form, api_path: e.target.value })}
            />
            {errors.api_path && <div className="input-error">{errors.api_path}</div>}

            <SchemaBuilder
              schema={form.schema}
              setSchema={(schema) => setForm({ ...form, schema })}
            />
            {errors.schema && <div className="input-error">{errors.schema}</div>}

            <div className="method-box">

              {AUTH_METHODS.map(m => (

                <label key={m.value}>

                  <input
                    type="checkbox"
                    checked={form.allowed_auth_methods.includes(m.value)}
                    onChange={() => toggleAuthMethod(m.value)}
                  />

                  {m.label}

                </label>

              ))}

            </div>

            <div className="modal-actions">

              <button onClick={() => setShowEditModal(false)}>Cancel</button>

              <button onClick={handleEdit}>Save</button>

            </div>

          </div>

        </div>

      )}

      {selectedResource && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>Resource Details</h3>

            <button
              className="modal-close"
              onClick={() => setSelectedResource(null)}
            >
              ✕
            </button>

            <p>

              <b>Name :</b> {selectedResource.name} <br />

              <b>API Path :</b> {selectedResource.api_path} <br />

              <b>Reference :</b> {selectedResource.reference_name} <br />

              <b>Allowed Methods :</b> {selectedResource.allowed_auth_methods?.join(", ")} <br />

              <b>Created By :</b> {selectedResource?._createdBy?.name ?? "-"} <br />

              <b>Created On :</b> {formatDate(selectedResource?._created_on)} <br />

              <b>Updated By :</b> {selectedResource?._updatedBy?.name ?? "-"} <br />

              <b>Updated On :</b> {formatDate(selectedResource?._updated_on)} <br />

            </p>

            {selectedResource.schema?.length !== 0 && <>
              <h4>Schema</h4>
              <SchemaViewer schema={selectedResource.schema} />
            </>}

          </div>

        </div>

      )}
    </div>
  );
}