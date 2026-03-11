import { useState } from "react";
import "../styles/SchemaBuilder.css"

const FIELD_TYPES = [
    { label: "Boolean", value: "boolean" },
    { label: "Number", value: "number" },
    { label: "String", value: "string" },
    { label: "Date", value: "date" },
    { label: "Date Time", value: "datetime" },
    { label: "Object", value: "object" }
];

const newField = () => ({
    key: "",
    type: "string",

    required: false,
    is_multiple: false,

    options: [],

    min: "",
    max: "",

    regex: "",
    email: false,
    lowercase: false,
    uppercase: false,

    integer: false,
    decimal: false,
    decimal_min_places: "",
    decimal_max_places: "",

    min_size: "",
    max_size: "",
    unique: false,

    keys: [],

    showSettings: false
});

export default function SchemaBuilder({ schema, setSchema, depth = 1 }) {

    const addField = () => {
        setSchema([...schema, newField()]);
    };

    const deleteField = (index) => {
        const updated = [...schema];
        updated.splice(index, 1);
        setSchema(updated);
    };

    const updateField = (index, key, value) => {
        const updated = [...schema];
        updated[index][key] = value;
        setSchema(updated);
    };

    const toggleSettings = (index) => {
        const updated = [...schema];
        updated[index].showSettings = !updated[index].showSettings;
        setSchema(updated);
    };

    const addOption = (index) => {
        const updated = [...schema];
        updated[index].options = [...(updated[index].options || []), ""];
        setSchema(updated);
    };

    const updateOption = (index, optIndex, value) => {
        const updated = [...schema];
        updated[index].options[optIndex] = value;
        setSchema(updated);
    };

    return (
        <div className="schema-box">

            {(schema || []).map((field, i) => {

                const hasOptions = (field.options || []).length > 0;

                const hasValidation =
                    field.min ||
                    field.max ||
                    field.regex ||
                    field.email ||
                    field.lowercase ||
                    field.uppercase ||
                    field.integer ||
                    field.decimal ||
                    field.decimal_min_places ||
                    field.decimal_max_places;

                return (

                    <div key={i} className="schema-item">

                        {/* MAIN ROW */}

                        <div className="schema-row">

                            <input
                                placeholder="Key"
                                value={field.key}
                                onChange={(e) => updateField(i, "key", e.target.value)}
                            />

                            <select
                                value={field.type}
                                onChange={(e) => updateField(i, "type", e.target.value)}
                            >

                                {FIELD_TYPES.map(t => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}

                            </select>

                            <label className="checkbox-label">

                                <input
                                    type="checkbox"
                                    checked={field.required || false}
                                    onChange={(e) => updateField(i, "required", e.target.checked)}
                                />

                                Required

                            </label>

                            <label className="checkbox-label">

                                <input
                                    type="checkbox"
                                    checked={field.is_multiple || false}
                                    onChange={(e) => updateField(i, "is_multiple", e.target.checked)}
                                />

                                Multiple

                            </label>

                            <button
                                className="schema-icon"
                                onClick={() => toggleSettings(i)}
                            >
                                ⚙
                            </button>

                            <button
                                className="schema-icon delete"
                                onClick={() => deleteField(i)}
                            >
                                🗑
                            </button>

                        </div>

                        {/* SETTINGS */}

                        {field.showSettings && (

                            <div className="schema-settings">

                                {/* OPTIONS */}

                                {!hasValidation && (

                                    <div className="schema-setting-block">

                                        <label>Options</label>

                                        {(field.options || []).map((opt, oi) => (
                                            <div key={oi} className="option-row">

                                                <input
                                                    value={opt}
                                                    placeholder="Option value"
                                                    onChange={(e) => {

                                                        const updated = [...(field.options || [])];
                                                        updated[oi] = e.target.value;

                                                        updateField(i, "options", updated);

                                                    }}
                                                />

                                                <button
                                                    className="remove-option"
                                                    onClick={() => {

                                                        const updated = [...(field.options || [])];
                                                        updated.splice(oi, 1);

                                                        updateField(i, "options", updated);

                                                    }}
                                                >
                                                    ✕
                                                </button>

                                            </div>
                                        ))}

                                        <button
                                            className="add-option"
                                            onClick={() => addOption(i)}
                                        >
                                            + Add Option
                                        </button>

                                    </div>

                                )}

                                {/* STRING VALIDATION */}

                                {field.type === "string" && !hasOptions && (

                                    <div className="schema-setting-block">

                                        <label>Min Length</label>
                                        <input
                                            type="number"
                                            value={field.min || ""}
                                            onChange={(e) => updateField(i, "min", Number(e.target.value))}
                                        />

                                        <label>Max Length</label>
                                        <input
                                            type="number"
                                            value={field.max || ""}
                                            onChange={(e) => updateField(i, "max", Number(e.target.value))}
                                        />

                                        <label>Regex</label>
                                        <input
                                            value={field.regex || ""}
                                            onChange={(e) => updateField(i, "regex", e.target.value)}
                                        />

                                        <label className="checkbox-label">

                                            <input
                                                type="checkbox"
                                                checked={field.email || false}
                                                onChange={(e) => updateField(i, "email", e.target.checked)}
                                            />

                                            Email

                                        </label>

                                        <label className="checkbox-label">

                                            <input
                                                type="checkbox"
                                                checked={field.lowercase || false}
                                                onChange={(e) => updateField(i, "lowercase", e.target.checked)}
                                            />

                                            Lowercase

                                        </label>

                                        <label className="checkbox-label">

                                            <input
                                                type="checkbox"
                                                checked={field.uppercase || false}
                                                onChange={(e) => updateField(i, "uppercase", e.target.checked)}
                                            />

                                            Uppercase

                                        </label>

                                    </div>

                                )}

                                {/* NUMBER VALIDATION */}

                                {field.type === "number" && !hasOptions && (

                                    <div className="schema-setting-block">

                                        <label>Min</label>
                                        <input
                                            type="number"
                                            value={field.min || ""}
                                            onChange={(e) => updateField(i, "min", Number(e.target.value))}
                                        />

                                        <label>Max</label>
                                        <input
                                            type="number"
                                            value={field.max || ""}
                                            onChange={(e) => updateField(i, "max", Number(e.target.value))}
                                        />

                                        <label className="checkbox-label">

                                            <input
                                                type="checkbox"
                                                checked={field.integer || false}
                                                onChange={(e) => updateField(i, "integer", e.target.checked)}
                                            />

                                            Integer

                                        </label>

                                        <label className="checkbox-label">

                                            <input
                                                type="checkbox"
                                                checked={field.decimal || false}
                                                onChange={(e) => updateField(i, "decimal", e.target.checked)}
                                            />

                                            Decimal

                                        </label>

                                        <label>Decimal Min Places</label>
                                        <input
                                            type="number"
                                            value={field.decimal_min_places || ""}
                                            onChange={(e) => updateField(i, "decimal_min_places", Number(e.target.value))}
                                        />

                                        <label>Decimal Max Places</label>
                                        <input
                                            type="number"
                                            value={field.decimal_max_places || ""}
                                            onChange={(e) => updateField(i, "decimal_max_places", Number(e.target.value))}
                                        />

                                    </div>

                                )}

                                {/* DATE VALIDATION */}

                                {(field.type === "date" || field.type === "datetime") && !hasOptions && (

                                    <div className="schema-setting-block">

                                        <label>Min</label>
                                        <input
                                            value={field.min || ""}
                                            onChange={(e) => updateField(i, "min", e.target.value)}
                                        />

                                        <label>Max</label>
                                        <input
                                            value={field.max || ""}
                                            onChange={(e) => updateField(i, "max", e.target.value)}
                                        />

                                    </div>

                                )}

                                {/* ARRAY SETTINGS */}

                                {field.is_multiple && (

                                    <div className="schema-setting-block">

                                        <label>Min Size</label>
                                        <input
                                            type="number"
                                            value={field.min_size || ""}
                                            onChange={(e) => updateField(i, "min_size", Number(e.target.value))}
                                        />

                                        <label>Max Size</label>
                                        <input
                                            type="number"
                                            value={field.max_size || ""}
                                            onChange={(e) => updateField(i, "max_size", Number(e.target.value))}
                                        />

                                        <label className="checkbox-label">

                                            <input
                                                type="checkbox"
                                                checked={field.unique || false}
                                                onChange={(e) => updateField(i, "unique", e.target.checked)}
                                            />

                                            Unique

                                        </label>

                                    </div>

                                )}

                            </div>

                        )}

                        {/* NESTED OBJECT */}

                        {field.type === "object" && depth < 3 && (

                            <div className="nested-schema">

                                <SchemaBuilder
                                    schema={field.keys}
                                    setSchema={(keys) => updateField(i, "keys", keys)}
                                    depth={depth + 1}
                                />

                            </div>

                        )}

                    </div>

                );

            })}

            <button className="add-field-btn" onClick={addField}>
                + Add Field
            </button>

        </div>
    );
}