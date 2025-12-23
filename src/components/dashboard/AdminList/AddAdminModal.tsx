import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField
} from "@mui/material";
import React, { useEffect } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import SharedInput from "../../shared/SharedInput";

interface AddAdminModalProps {
  editData?: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: any) => void;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  editData,
  open,
  setOpen,
  onSubmit,
}) => {
  const [values, setValues] = React.useState({
    firstName: "",
    lastName: "",
    email: "",    
    password: "",
  });

  const [showPassword, setShowPassword] = React.useState(false);

  // Pre-fill when editing
  useEffect(() => {
    if (editData) {
      setValues({
        firstName: editData?.firstName || "",
        lastName: editData?.lastName || "",
        email: editData?.email || "",        
        password: "",
      });
    }
  }, [editData]);

  const handleClose = () => {
    setOpen(false);
    setValues({
      firstName: "",
      lastName: "",
      email: "",      
      password: "",
    });
  };


  const handleSubmit = () => {
    if (
      !values.firstName 
      || !values.lastName 
      || !values.email       
      || (!editData && !values.password)) {
      return;
    }
    onSubmit(values);
    handleClose();
  };

  const handleChange = (key: string, value: string) => {
    setValues({ ...values, [key]: value });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" className="bg-black/70 "
      PaperProps={{
        sx: {
          background: "#121212",
          color: "white",
          border: "1px solid rgba(207,151,2,0.7)",
          borderRadius: 3,
        },
      }}>
      <DialogTitle sx={{ fontSize: 20, fontWeight: 600 }}>
        {!editData ? "Add Admin" : "Edit Admin"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>

          {/* Name */}
          <Grid size={12}>
            <SharedInput
              label="First Name"
              placeholder="First Name"
              value={values.firstName}
              onChange={(e: any) => handleChange("firstName", e.target.value)}
            />
          </Grid>
          <Grid size={12}>
            <SharedInput
              label="Last Name"
              placeholder="Last Name"
              value={values.lastName}
              onChange={(e: any) => handleChange("lastName", e.target.value)}
            />
          </Grid>

          {/* Email */}
          <Grid size={12}>
            <SharedInput

              label="Email"
              type="email"
              value={values.email}
              onChange={(e: any) => handleChange("email", e.target.value)}
              required
            />
          </Grid>

          {/* Password (Add Only) */}
          {!editData && (
            <Grid size={12}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                required
                sx={{
                  height: 45,
                  "& .MuiOutlinedInput-root": {
                    color: "#ffffff",
                    height: 45,
                  },
                  "& .MuiInputBase-input::placeholder": { color: "#9ca3af", opacity: 1 },
                  "& .MuiInputLabel-root": { color: "#ccc" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-black-200)" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-black-200)",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <MdOutlineVisibilityOff size={22} color="white" /> : <MdOutlineVisibility size={22} color="white" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          size="large"
          sx={{ height: 45 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          sx={{ height: 45 }}
        >
          {!editData ? "Add Admin" : "Update Admin"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAdminModal;
