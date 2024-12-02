import React from "react";

const InputField = ({
    type = "text",
    label,
    id,
    value,
    onChange,
    options = [],
}) => {
    const handleInputChange = (e) => {
        let newValue = e.target.value;

        if (/[^0-9]/.test(newValue)) {
            newValue = newValue.replace(/[^0-9]/g, ""); 
        }


        if (newValue && parseInt(newValue, 10) < 0) {
            newValue = "0"; 
        }

        onChange(e, newValue);
    };

    return (
        <div className="input-field">
            {label && (
                <label htmlFor={id}>
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
                    onChange={handleInputChange}  
                    inputMode={type === "number" ? "numeric" : undefined} 
                    pattern="[0-9]*"  
                    min="0"  
                />
            )}
        </div>
    );
};

export default InputField;
