import React, { useState, useRef, useEffect } from "react";
import { PORTS } from "../config/ports";

interface PortSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const PortSelect: React.FC<PortSelectProps> = ({
  value,
  onChange,
  label,
  placeholder,
  disabled,
}) => {
  const [search, setSearch] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSelecting) {
      setSearch(value);
    }
  }, [value, isSelecting]);

  const filteredPorts = PORTS.filter((port) => port.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (port: string) => {
    setIsSelecting(true);
    onChange(port);
    setSearch(port);
    setShowDropdown(false);
    // Reset the selecting flag after a short delay
    setTimeout(() => setIsSelecting(false), 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    setShowDropdown(true);

    // If user clears the input, update the parent value
    if (newValue === "") {
      onChange("");
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for selection
    setTimeout(() => {
      if (!isSelecting) {
        setShowDropdown(false);
        // If search doesn't match any port, reset to current value
        if (search !== value && !PORTS.includes(search)) {
          setSearch(value);
        }
      }
    }, 150);
  };

  return (
    <div className="form-group" style={{ position: "relative" }}>
      {label && <label>{label}</label>}
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder || "Search or select port"}
        disabled={disabled}
        autoComplete="off"
        style={{
          width: "100%",
          padding: "0.75rem",
          border: "1px solid var(--border-color, #e5e7eb)",
          borderRadius: "6px",
          fontSize: "1rem",
          backgroundColor: "var(--input-bg, #fff)",
          color: "var(--text-color, #374151)",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && filteredPorts.length > 0) {
            e.preventDefault();
            handleSelect(filteredPorts[0]);
          }
        }}
      />
      {showDropdown && filteredPorts.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            background: "var(--dropdown-bg, #fff)",
            border: "1px solid var(--border-color, #e5e7eb)",
            borderRadius: "6px",
            maxHeight: "180px",
            overflowY: "auto",
            margin: "4px 0 0 0",
            padding: 0,
            listStyle: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {filteredPorts.map((port) => (
            <li
              key={port}
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                background:
                  port === value ? "var(--selected-bg, #f3f4f6)" : "var(--dropdown-bg, #fff)",
                color: "var(--text-color, #374151)",
                borderBottom: "1px solid var(--border-color, #f3f4f6)",
                transition: "background-color 0.15s",
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(port);
              }}
              onMouseEnter={(e) => {
                if (port !== value) {
                  e.currentTarget.style.background = "var(--hover-bg, #f9fafb)";
                }
              }}
              onMouseLeave={(e) => {
                if (port !== value) {
                  e.currentTarget.style.background = "var(--dropdown-bg, #fff)";
                }
              }}
            >
              {port}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PortSelect;
