import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Rating,
  Box,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SharedInput from "../../shared/SharedInput";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSubmit: (values: any) => void;
  editData?: any;
}

const PlannerModal: React.FC<Props> = ({
  open,
  setOpen,
  onSubmit,
  editData,
}) => {
  const [values, setValues] = useState({
    name: "",
    rating: 0,
  });

  useEffect(() => {
    if (editData) {
      setValues({
        name: editData.name || "",
        rating: editData.rating || 0,
      });
    }
  }, [editData]);

  const handleClose = () => {
    setOpen(false);
    setValues({ name: "", rating: 0 });
  };

  const handleSubmit = () => {
    if (!values.name || values.rating === 0) return;
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
        {editData ? "Edit Planner" : "Add Planner"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={12}>
            <SharedInput
              label="Planner Name"
              value={values.name}
              onChange={(e: any) =>
                setValues({ ...values, name: e.target.value })
              }
            />
          </Grid>

          <Grid size={12}>
            <Box>
              <Typography variant="body2" color="rgba(255,255,255,0.7)" mb={1}>
                Rating
              </Typography>
              <Rating
                name="planner-rating"
                value={values.rating}
                onChange={(_, newValue) => {
                  setValues({ ...values, rating: newValue || 0 });
                }}
                size="large"
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#fbbf24",
                  },
                  "& .MuiRating-iconEmpty": {
                    color: "rgba(255,255,255,0.3)",
                  },
                }}
              />
            </Box>
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

export default PlannerModal;