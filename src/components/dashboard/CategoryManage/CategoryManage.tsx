import {
  Box,
  Button,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ConfirmModal from "../../UI/ConfirmModel";
import CategoryModal from "./CategoryModal";


/* ---------------- TYPES ---------------- */
interface Category {
  _id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

/* ---------------- MOCK DATA ---------------- */
const MOCK_CATEGORIES: Category[] = [
  {
    _id: "1",
    name: "Painting",
    slug: "painting",
    status: "ACTIVE",
    createdAt: "2024-01-10",
  },
  {
    _id: "2",
    name: "Sculpture",
    slug: "sculpture",
    status: "INACTIVE",
    createdAt: "2024-02-15",
  },
];

/* ---------------- STYLES ---------------- */
const StyledHeadCell = styled(TableCell)(() => ({
  backgroundColor: "var(--color-primary)",
  color: "white",
  fontSize: 16,
  fontWeight: 600,
}));

const StyledRow = styled(TableRow)(() => ({
  "& td": {
    paddingTop: 14,
    paddingBottom: 14,
  },
}));

/* ---------------- COMPONENT ---------------- */
const CategoryManage = () => {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [selected, setSelected] = useState<Category | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  /* ---------- HANDLERS ---------- */
  const handleCreate = (data: any) => {
    setCategories((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        name: data.name,
        slug: data.slug,
        status: "ACTIVE",
        createdAt: new Date().toISOString().split("T")[0],
      },
    ]);
    toast.success("Category added successfully");
  };

  const handleUpdate = (data: any) => {
    setCategories((prev) =>
      prev.map((c) =>
        c._id === selected?._id ? { ...c, ...data } : c
      )
    );
    toast.success("Category updated successfully");
  };

  const handleDelete = () => {
    if (!selected) return;
    setCategories((prev) => prev.filter((c) => c._id !== selected._id));
    toast.success("Category deleted");
    setOpenConfirm(false);
    setSelected(null);
  };

  const toggleStatus = (cat: Category) => {
    setCategories((prev) =>
      prev.map((c) =>
        c._id === cat._id
          ? { ...c, status: c.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
          : c
      )
    );
    toast.success("Status updated");
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "var(--color-cardBg)", borderRadius: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600} color="white">
          Category Management
        </Typography>
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Add Category
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ background: "transparent" }}>
        <Table>
          <TableHead>
            <StyledRow>
              <StyledHeadCell>SL</StyledHeadCell>
              <StyledHeadCell>Name</StyledHeadCell>
              <StyledHeadCell>Category Type</StyledHeadCell>
              <StyledHeadCell>Status</StyledHeadCell>
              <StyledHeadCell>Created</StyledHeadCell>
              <StyledHeadCell align="center">Actions</StyledHeadCell>
            </StyledRow>
          </TableHead>
          <TableBody>
            {categories.map((cat, index) => (
              <StyledRow key={cat._id}>
                <TableCell sx={{ color: "white" }}>{index + 1}</TableCell>
                <TableCell sx={{ color: "white" }}>{cat.name}</TableCell>
                <TableCell sx={{ color: "white" }}>{cat.slug}</TableCell>
                <TableCell>
                  <span
                    style={{
                      padding: "5px 14px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 600,
                      background:
                        cat.status === "ACTIVE" ? "#E6F7E6" : "#4a4d52",
                      color:
                        cat.status === "ACTIVE" ? "#2E7D32" : "#d5d7da",
                    }}
                  >
                    {cat.status}
                  </span>
                </TableCell>
                <TableCell sx={{ color: "white" }}>
                  {cat.createdAt}
                </TableCell>
                <TableCell>
                  <Box display="flex" justifyContent="center" gap={1}>
                    <IconButton
                      onClick={() => {
                        setSelected(cat);
                        setOpenModal(true);
                      }}
                    >
                      <FaEdit color="#60a5fa" />
                    </IconButton>

                    <IconButton onClick={() => toggleStatus(cat)}>
                      {cat.status === "ACTIVE" ? (
                        <LockOpenIcon color="success" />
                      ) : (
                        <LockIcon color="error" />
                      )}
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        setSelected(cat);
                        setOpenConfirm(true);
                      }}
                    >
                      <FaTrashAlt color="#ef4444" />
                    </IconButton>
                  </Box>
                </TableCell>
              </StyledRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirm */}
      <ConfirmModal
        open={openConfirm}
        title="Delete Category?"
        content={`Are you sure you want to delete "${selected?.name}"?`}
        okText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setOpenConfirm(false)}
      />

      {/* Add / Edit Modal */}
      <CategoryModal
        open={openModal}
        editData={selected}
        setOpen={(v) => {
          setOpenModal(v);
          if (!v) setSelected(null);
        }}
        onSubmit={(data) =>
          selected ? handleUpdate(data) : handleCreate(data)
        }
      />
    </Box>
  );
};

export default CategoryManage;
