import { TextField, MenuItem } from "@mui/material";

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  fullWidth?: boolean;
}

const SelectField = ({
  label,
  value,
  onChange,
  options,
  required = false,
  fullWidth = true,
}: SelectFieldProps) => {
  return (
    <TextField
      select
      fullWidth={fullWidth}
      label={label}
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        height: 45,
        "& .MuiOutlinedInput-root": {
          color: "#ffffff",
          height: 45,
        },
        "& .MuiInputBase-input::placeholder": {
          color: "#9ca3af",
          opacity: 1,
        },
        "& .MuiInputLabel-root": { color: "#ccc" },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "var(--color-black-200)",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#666",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--color-black-200)",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--color-black-200)",
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectField;
