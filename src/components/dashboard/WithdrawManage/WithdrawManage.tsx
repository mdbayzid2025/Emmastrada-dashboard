import {
  Box,
  Button,
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
import dayjs from "dayjs";
import { X } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useApprovedWithdrawalRequestMutation, useGetWithdrawalsQuery, useRejectWithdrawalRequestMutation } from "../../../redux/features/withdraw/withdrawApi";

/* ---------------- TYPES ---------------- */
interface Transaction {
  _id: string;
  transactionId: string;
  userId: string;
  walletId: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  stripeTransferId?: string;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Withdrawal {
  _id: string;
  requestId: string;
  userId: string;
  walletId: string;
  amount: number;
  currency: string;
  withdrawalMethod: string;
  autoApproved: boolean;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "REJECTED" | "APPROVED" | "CANCELLED";
  processingFee: number;
  netAmount: number;
  createdAt: string;
  updatedAt: string;
  submitAt: string;
  processedAt?: string;
  transactionId?: Transaction;
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
const WithdrawManage = () => {
  const { data: withdrawalsData } = useGetWithdrawalsQuery({});
  const [approvedWithdrawalRequest] = useApprovedWithdrawalRequestMutation();
  const [rejectWithdrawalRequest] = useRejectWithdrawalRequestMutation();

  
  /* ---------- HANDLERS ---------- */
  const handleStatusChange = async (id: string, requestId: string, amount: number, currency: string) => {
    Swal.fire({
      title: "Approve Withdrawal?",
      html: `
        <p>Request ID: <strong>${requestId}</strong></p>
        <p>Amount: <strong>${currency} ${amount}</strong></p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#06c258",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await approvedWithdrawalRequest({ id }).unwrap();
          
          if (res?.data) {
            Swal.fire({
              title: "Approved!",
              text: res?.message || "Withdrawal has been approved successfully.",
              icon: "success",
            });
          }
        } catch (error) {
          console.log("Withdrawal Status Update Error", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to approve withdrawal request.",
            icon: "error",
          });
        }
      }
    });
  };

    const handleRejectRequest = async (id: string, requestId: string, amount: number, currency: string) => {
    Swal.fire({
      title: "Rejeect Withdrawal?",
      html: `
        <p>Request ID: <strong>${requestId}</strong></p>
        <p>Amount: <strong>${currency} ${amount}</strong></p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#06c258",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await rejectWithdrawalRequest({ id }).unwrap();
          
          if (res?.data) {
            Swal.fire({
              title: "Reject!",
              text: res?.message || "Withdrawal has been reject successfully.",
              icon: "success",
            });
          }
        } catch (error) {
          console.log("Withdrawal Status Update Error", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to approve withdrawal request.",
            icon: "error",
          });
        }
      }
    });
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return { bg: "#06c258", color: "#fff" };
      case "PENDING":
        return { bg: "#FFF4E5", color: "#ED6C02" };
      case "PROCESSING":
        return { bg: "#E3F2FD", color: "#0288D1" };
      case "REJECTED":
        return { bg: "#FFEBEE", color: "#D32F2F" };
      case "CANCELLED":
        return { bg: "#4a4d52", color: "#d5d7da" };
      default:
        return { bg: "#4a4d52", color: "#d5d7da" };
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "var(--color-cardBg)", borderRadius: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600} color="white">
          Withdrawal Management
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ background: "transparent" }}>
        <Table>
          <TableHead>
            <StyledRow>
              <StyledHeadCell>SL</StyledHeadCell>
              <StyledHeadCell>Request ID</StyledHeadCell>
              <StyledHeadCell>Amount</StyledHeadCell>
              <StyledHeadCell>Net Amount</StyledHeadCell>
              <StyledHeadCell>Method</StyledHeadCell>
              <StyledHeadCell>Status</StyledHeadCell>
              <StyledHeadCell>Submitted</StyledHeadCell>
              <StyledHeadCell>Processed</StyledHeadCell>
              <StyledHeadCell align="center">Actions</StyledHeadCell>
            </StyledRow>
          </TableHead>
          <TableBody>
            {withdrawalsData?.length > 0 &&
              withdrawalsData.map((withdrawal: Withdrawal, index: number) => {
                const statusColors = getStatusColor(withdrawal.status);

                return (
                  <StyledRow key={withdrawal._id}>
                    <TableCell sx={{ color: "white" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "white", fontSize: 12 }}>
                      {withdrawal.requestId}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {withdrawal.currency} {withdrawal.amount}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {withdrawal.currency} {withdrawal.netAmount}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {withdrawal.withdrawalMethod}
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          padding: "5px 14px",
                          borderRadius: 20,
                          fontSize: 13,
                          fontWeight: 600,
                          background: statusColors.bg,
                          color: statusColors.color,
                        }}
                      >
                        {withdrawal.status}
                      </span>
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {dayjs(withdrawal.submitAt).format("DD MMM, YYYY HH:mm")}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {withdrawal.processedAt
                        ? dayjs(withdrawal.processedAt).format("DD MMM, YYYY HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Button
                          onClick={() =>
                            handleStatusChange(
                              withdrawal._id,
                              withdrawal.requestId,
                              withdrawal.amount,
                              withdrawal.currency
                            )
                          }
                          disabled={withdrawal?.status === "APPROVED"}
                          variant="contained"
                          sx={{
                            display: "flex",
                            background: "#06c258",
                            gap: 1,
                            "&:hover": {
                              background: "#05a347",
                            },
                            "&.Mui-disabled": {
                              background: "#4a4d52",
                              color: "#d5d7da",
                            },
                          }}
                        >
                          Accept
                          <FaEdit color="#ffffff" />
                        </Button>
                        <Button
                          onClick={() =>
                            handleRejectRequest(
                              withdrawal._id,
                              withdrawal.requestId,
                              withdrawal.amount,
                              withdrawal.currency
                            )
                          }
                          disabled={withdrawal?.status !== "PENDING"}
                          variant="contained"
                          color="error"
                          sx={{
                            display: "flex",                            
                            gap: 1,
                            "&:hover": {
                              background: "red",
                            },
                            "&.Mui-disabled": {
                              background: "#4a4d52",
                              color: "#d5d7da",
                            },
                          }}
                        >
                          Reject
                          <X color="#ffffff" />
                        </Button>
                      </Box>
                    </TableCell>
                  </StyledRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WithdrawManage;