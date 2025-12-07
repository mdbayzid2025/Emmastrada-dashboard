"use client";

import { AttachMoney, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SharedInput from "../../shared/SharedInput";

const CommissionManage = () => {
  // Separate commission values
  const [artistCommission, setArtistCommission] = useState<number>(200);
  const [promotorCommission, setPromotorCommission] = useState<number>(150);

  // Track which commission is being edited
  const [currentType, setCurrentType] = useState<"artist" | "promotor" | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ fee: "" });  

  useEffect(() => {
    if (!isModalOpen) {
      setFormData({ fee: "" });      
      setCurrentType(null);
    }
  }, [isModalOpen]);

  const handleOpenModal = (type: "artist" | "promotor") => {
    setCurrentType(type);

    setFormData({
      fee:
        type === "artist"
          ? artistCommission.toString()
          : promotorCommission.toString(),
    });

    setIsModalOpen(true);
  };


  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feeValue = parseFloat(formData.fee);

    if (currentType === "artist") {
      setArtistCommission(feeValue);
    } else if (currentType === "promotor") {
      setPromotorCommission(feeValue);
    }

    setIsModalOpen(false);
  };

  return (
    <Box p={4}>
      <Box sx={{ display: "flex", width: '100%', gap: 5, background: 'transparent' }}>
        {/* ============ Artist Commission ============ */}
        <Box sx={{ maxWidth: 600, width: "100%", }}>
          <Typography variant="h5" fontWeight="bold" mb={3} >
            Commission for Artist
          </Typography>

          <Card sx={{ background: 'var(--color-cardBg)', border: '1px solid rgba(255,255,255,0.5)' }}>
            <CardHeader
              title={<h1 className="text-slate-200">Artist Commission</h1>}
              action={
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => handleOpenModal("artist")}
                >
                  Edit
                </Button>
              }
            />

            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                p={3}
                borderRadius={2}
                bgcolor="#cd671c"
                color="white"
              >
                <Box
                  sx={{
                    background: "white",
                    borderRadius: "50%",
                    padding: 1.5,
                    mr: 3,
                  }}
                >
                  <AttachMoney fontSize="large" sx={{ color: "black" }} />
                </Box>

                <Box>
                  <Typography variant="body2">Artist Commission</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {artistCommission}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* ============ Promotor Commission ============ */}
        <Box sx={{ maxWidth: 600, width: "100%", }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Commission for Promotor
          </Typography>

          <Card sx={{ background: 'var(--color-cardBg)', border: '1px solid rgba(255,255,255,0.5)' }}>
            <CardHeader
              title={<h1 className="text-slate-200">Promotor Commission</h1>}
              action={
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => handleOpenModal("promotor")}
                >
                  Edit
                </Button>
              }
            />

            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                p={3}
                borderRadius={2}
                bgcolor="#cd671c"
                color="white"
              >
                <Box
                  sx={{
                    background: "white",
                    borderRadius: "50%",
                    padding: 1.5,
                    mr: 3,
                  }}
                >
                  <AttachMoney fontSize="large" sx={{ color: "black" }} />
                </Box>

                <Box>
                  <Typography variant="body2">Promotor Commission</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {promotorCommission}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* -------------------- MODAL --------------------- */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fullWidth
        maxWidth="sm"
        className="bg-black/40"
        PaperProps={{
          sx: {
            border: "2px solid rgba(255,255,255,0.2)",   // <-- White border
            borderRadius: "12px",        // <-- Smooth rounded corners
            backgroundColor: "var(--color-cardBg)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "var(--color-cardBg)",
            color: "white",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          Edit {currentType === "artist" ? "Artist" : "Promotor"} Commission
        </DialogTitle>

        <form onSubmit={handleSubmit} className="bg-cardBg">
          <DialogContent
            sx={{
              background: "transparent",
              pt: 3,
            }}
          >
            <SharedInput
              label="Commission Fee"
              placeholder="Commission Fee"
              value={formData.fee}
              onChange={(e: any) => handleChange("fee", e.target.value)}
            />
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "#cd671c",
                ":hover": { background: "#b45a19" },
              }}
            >
              Update Fee
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </Box>
  );
};

export default CommissionManage;
