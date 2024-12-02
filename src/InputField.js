import React from "react";

const InputField = ({
    type = "text",
    label,
    id,
    value,
    onChange,
    options = [],
}) => {
    return (
        <div style={{ marginBottom: "10px" }}>
            {label && (
                <label htmlFor={id} style={{ display: "block" }}>
                    {label}
                </label>
            )}
            {type === "select" ? (
                <select id={id} value={value} onChange={onChange}>
                    <option value="">Select...</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    inputMode={type === "number" ? "numeric" : undefined} // For mobile keyboards
                    style={{
                        MozAppearance: type === "number" ? "textfield" : undefined, // Remove spinner in Firefox
                        WebkitAppearance: type === "number" ? "textfield" : undefined, // Remove spinner in Chrome/Safari
                        appearance: type === "number" ? "textfield" : undefined, // General fallback
                    }}
                />
            )}
        </div>
    );
};

export default InputField;
