import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import SharedInput from "../../shared/SharedInput";
import SharedModal from "../../shared/SharedModal";
import { useAddFAQMutation, useGetFAQQuery, useUpdateFAQMutation, useDeleteFAQMutation } from "../../../redux/features/setting/settingApi";
import { toast } from "sonner";
import Swal from "sweetalert2";

const FAQ = () => {
  const [open, setOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);

  const { data: faqsData, refetch } = useGetFAQQuery({});
  const [deleteFAQ] = useDeleteFAQMutation();

  console.log("faqsData", faqsData);

  const handleEdit = (faq: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFAQ(faq);
    setOpen(true);
  };

  const handleDelete = async (faqId: string, e: React.MouseEvent) => {
    e.stopPropagation();

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
        const res = await deleteFAQ(faqId).unwrap();

        console.log("resres", res);
        refetch()
        toast.success(res?.message);
      } catch (err) {
        console.error("Error deleting:", err);
        toast.error("Failed to delete FAQ");
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
    <Box sx={{ maxWidth: 1000 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Button
          onClick={() => {
            setSelectedFAQ(null);
            setOpen(true);
          }}
          variant="contained"
          size="large"
        >
          Add FAQ
        </Button>
      </Box>

      {/* ------------------ FAQ Accordion List ------------------ */}
      {faqsData && faqsData?.data?.map((faq: any) => (
        <Accordion key={faq._id} defaultExpanded sx={{ mb: 2, background: 'var(--color-cardBg)', border: '1px solid rgba(255,255,255, 0.3)', borderRadius: 2 }}>
          <AccordionSummary
            expandIcon={<FaArrowDown />}
            aria-controls={`panel-${faq._id}`}
            id={`panel-${faq._id}-header`}
          >
            <div className="flex items-center justify-between w-full pr-5">
              <Typography component="span" sx={{ fontWeight: 600, color: "white" }}>
                {faq?.question}
              </Typography>

              <div className="flex items-center gap-2">
                <button onClick={(e) => handleEdit(faq, e)}>
                  <FiEdit className="cursor-pointer" color="blue" size={20} />
                </button>

                <button onClick={(e) => handleDelete(faq._id, e)}>
                  <RiDeleteBinLine
                    className="cursor-pointer"
                    color="#ff0000"
                    size={20}
                  />
                </button>
              </div>
            </div>
          </AccordionSummary>

          <AccordionDetails className="text-slate-400 font-sans">{faq.answer}</AccordionDetails>
        </Accordion>
      ))}

      {/* ------------------ Modal ------------------ */}
      {open && (
        <SharedModal
          width={700}
          title={selectedFAQ ? "Edit FAQ" : "Add FAQ"}
          open={open}
          handleClose={() => setOpen(false)}
        >
          <FAQForm refetch={refetch} faq={selectedFAQ} setOpen={setOpen} />
        </SharedModal>
      )}
    </Box>
  );
};

export default FAQ;

// ------------------ FAQ FORM ------------------
const FAQForm = ({ refetch, faq, setOpen }: any) => {
  const [addFAQ] = useAddFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation()

  const [values, setValues] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    if (faq) {
      setValues({
        question: faq.question,
        answer: faq.answer,
      });
    }
  }, [faq]);

  const handleChange = (key: string, value: string) => {
    setValues({ ...values, [key]: value });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!values.question.trim() || !values.answer.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (faq) {
      try {
        const res = await updateFAQ({ id: faq?._id, ...values }).unwrap();

        console.log("", res);
        toast.success(res?.message);
        refetch()
        setOpen(false);
      } catch (err: any) {
        console.error("Error updating:", err);
        toast.error(err?.data?.message || "Failed to update FAQ");
      }
    } else {
      try {
        const res = await addFAQ(values).unwrap();
        console.log("addFAQ", res);
        
        toast.success(res?.message);
        refetch
        setOpen(false);
      } catch (err: any) {
        console.error("Error adding:", err);
        toast.error(err?.data?.message || "Failed to add FAQ");
      }
    }
  };

  return (
    <Box>
      <form onSubmit={onSubmit}>
        <Grid container spacing={4}>
          <SharedInput
            label="Question"
            placeholder="Question"
            value={values.question}
            onChange={(e: any) => handleChange("question", e.target.value)}
          />

          <SharedInput
            label="Answer"
            placeholder="Answer"
            value={values.answer}
            onChange={(e: any) => handleChange("answer", e.target.value)}
          />
        </Grid>
        <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 3, width: '100%', display: 'block' }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};