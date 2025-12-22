import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import SharedInput from "../../shared/SharedInput";
import SelectField from "../../shared/SelectField";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSubmit: (values: any) => void;
  editData?: any;
}

const CategoryModal: React.FC<Props> = ({
  open,
  setOpen,
  onSubmit,
  editData,
}) => {
  const [values, setValues] = useState({
    name: "",
    type: "",
  });

  useEffect(() => {
    if (editData) {
      setValues({
        name: editData.name,
        type: editData.type,
      });
    }
  }, [editData]);

  const handleClose = () => {
    setOpen(false);
    setValues({ name: "", type: "" });
  };

  const handleSubmit = () => {
    if (!values.name || !values.type) return;
    onSubmit(values);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          background: "#121212",
          color: "white",
          borderRadius: 3,
          border: "1px solid rgba(207,151,2,0.6)",
        },
      }}
    >
      <DialogTitle fontWeight={600}>
        {editData ? "Edit Category" : "Add Category"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={12}>
            <SharedInput
              label="Category Name"
              value={values.name}
              onChange={(e: any) =>
                setValues({ ...values, name: e.target.value })
              }
            />
          </Grid>

          <Grid size={12}>
            <SelectField
              label="Type"
              value={values.type}
              required
              onChange={(value) => setValues({ ...values, type: value })}
              options={[
                { label: "Category", value: "CATEGORY" },
                { label: "User", value: "USER" },
                { label: "Genre", value: "GENRE" },
              ]}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {editData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryModal;
