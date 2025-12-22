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
import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import { useAddCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from "../../../redux/features/categoryApi";
import ConfirmModal from "../../UI/ConfirmModel";
import CategoryModal from "./CategoryModal";
import Swal from "sweetalert2";



/* ---------------- TYPES ---------------- */
interface Category {
  _id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}



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
  const [selected, setSelected] = useState<Category | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const { data: categoriesData } = useGetCategoriesQuery({});
  const [addCategory] = useAddCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()

  /* ---------- HANDLERS ---------- */
  const handleCreate = async (data: any) => {

    try {
      const res = await addCategory(data).unwrap();
      if (res?.data) {
        toast.success(res?.message);
      }
    } catch (error) {
      console.log("category Error", error);
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const res = await updateCategory({ id: selected?._id, name: data?.name }).unwrap();
      if (res?.data) {
        toast.success(res?.message);
      }
    } catch (error) {
      console.log("category Error", error);
    }
  };


  const handleDelete2 = (id:string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      theme: 'dark'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategory(id).unwrap();          
        } catch (error) {
          console.log("category Error", error);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
          theme: 'dark'
        });
      }
    });
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
            {categoriesData?.length > 0 && categoriesData.map((cat: any, index: number) => (
              <StyledRow key={cat._id}>
                <TableCell sx={{ color: "white" }}>{index + 1}</TableCell>
                <TableCell sx={{ color: "white" }}>{cat.name}</TableCell>
                <TableCell sx={{ color: "white" }}>{cat.type}</TableCell>
                <TableCell>
                  <span
                    style={{
                      padding: "5px 14px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 600,
                      background:
                        cat.isActive ? "#E6F7E6" : "#4a4d52",
                      color:
                        cat.isActive ? "#2E7D32" : "#d5d7da",
                    }}
                  >
                    {cat.isActive ? "Active" : "Block"}
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

                    <IconButton
                      onClick={() => {                        
                        handleDelete2(cat?._id);
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
