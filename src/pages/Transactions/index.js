/**
=========================================================
* Material Kit 2 PRO React - v2.1.1
=========================================================
*
* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
*
Coded by www.creative-tim.com
*
 =========================================================
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useMemo, useEffect } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// @mui icons
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";

// Features
import { useTransactions } from "features/transactions";

const CATEGORIES = [
  "All",
  "dining",
  "books",
  "transportation",
  "entertainment",
  "services",
  "other",
];

function Transactions() {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("transaction_date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { transactions, loading, error, refetch } = useTransactions({});

  useEffect(() => {
    const filterObj = {
      skip: page * rowsPerPage,
      limit: rowsPerPage,
    };
    if (categoryFilter !== "All") {
      filterObj.category = categoryFilter;
    }
    if (startDate) {
      filterObj.start_date = new Date(startDate).toISOString();
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      filterObj.end_date = endDateTime.toISOString();
    }
    refetch(filterObj);
  }, [page, rowsPerPage, categoryFilter, startDate, endDate, refetch]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = transactions.filter((row) => {
      const matchesSearch =
        row.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.payment_method?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    // Apply sorting
    if (orderBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[orderBy];
        let bValue = b[orderBy];

        if (orderBy === "transaction_date" || orderBy === "created_at") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (orderBy === "amount") {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        } else if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (order === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [transactions, searchQuery, orderBy, order]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedData, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setStartDate("");
    setEndDate("");
    setPage(0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      dining: "primary",
      books: "info",
      transportation: "warning",
      entertainment: "success",
      services: "secondary",
      other: "default",
    };
    return colors[category] || "default";
  };

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Header Section */}
      <MKBox mb={6}>
        <MKBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MKTypography variant="h4" fontWeight="bold">
            Transactions
          </MKTypography>
          <MKButton
            variant="outlined"
            color="info"
            size="medium"
            onClick={() => {
              const filterObj = {
                skip: page * rowsPerPage,
                limit: rowsPerPage,
              };
              if (categoryFilter !== "All") {
                filterObj.category = categoryFilter;
              }
              if (startDate) {
                filterObj.start_date = new Date(startDate).toISOString();
              }
              if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                filterObj.end_date = endDateTime.toISOString();
              }
              refetch(filterObj);
            }}
            startIcon={<RefreshIcon />}
            disabled={loading}
          >
            Refresh
          </MKButton>
        </MKBox>
        <MKTypography variant="body1" color="text">
          View and filter your transaction history. Transactions are automatically created when
          payments are completed.
        </MKTypography>
      </MKBox>

      {/* Error Message */}
      {error && (
        <MKBox mb={3} sx={{ px: 3 }}>
          <MKTypography variant="body2" color="error">
            Error: {error}
          </MKTypography>
        </MKBox>
      )}

      {/* Filters Section */}
      <Card
        sx={{
          mb: 3,
          mx: 3,
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <MKBox display="flex" flexWrap="wrap" gap={2} alignItems="center">
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery("")}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />

          {/* Category Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(0);
              }}
              label="Category"
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Start Date */}
          <TextField
            size="small"
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(0);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ minWidth: 150 }}
          />

          {/* End Date */}
          <TextField
            size="small"
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(0);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ minWidth: 150 }}
          />

          {/* Clear Filters */}
          <MKButton
            variant="outlined"
            color="secondary"
            size="small"
            onClick={clearFilters}
            sx={{ ml: "auto" }}
          >
            Clear Filters
          </MKButton>
        </MKBox>
      </Card>

      {/* Transactions Table */}
      <Card
        sx={{
          mx: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table
                sx={{
                  tableLayout: "auto",
                  "& .MuiTableCell-root": {
                    padding: "12px 16px",
                    verticalAlign: "middle",
                  },
                  "& .MuiTableCell-head": {
                    backgroundColor: ({ palette: { grey } }) => grey[50],
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[2]} solid ${borderColor}`,
                    padding: "12px 16px",
                    fontWeight: 600,
                  },
                  "& .MuiTableCell-body": {
                    padding: "12px 16px",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "15%" }}>
                      <TableSortLabel
                        active={orderBy === "transaction_date"}
                        direction={orderBy === "transaction_date" ? order : "asc"}
                        onClick={() => handleRequestSort("transaction_date")}
                      >
                        <MKTypography variant="caption" fontWeight="bold" color="secondary">
                          DATE
                        </MKTypography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: "35%" }}>
                      <TableSortLabel
                        active={orderBy === "description"}
                        direction={orderBy === "description" ? order : "asc"}
                        onClick={() => handleRequestSort("description")}
                      >
                        <MKTypography variant="caption" fontWeight="bold" color="secondary">
                          DESCRIPTION
                        </MKTypography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center" sx={{ width: "15%" }}>
                      <TableSortLabel
                        active={orderBy === "category"}
                        direction={orderBy === "category" ? order : "asc"}
                        onClick={() => handleRequestSort("category")}
                      >
                        <MKTypography variant="caption" fontWeight="bold" color="secondary">
                          CATEGORY
                        </MKTypography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right" sx={{ width: "15%" }}>
                      <TableSortLabel
                        active={orderBy === "amount"}
                        direction={orderBy === "amount" ? order : "asc"}
                        onClick={() => handleRequestSort("amount")}
                      >
                        <MKTypography variant="caption" fontWeight="bold" color="secondary">
                          AMOUNT
                        </MKTypography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center" sx={{ width: "20%" }}>
                      <MKTypography variant="caption" fontWeight="bold" color="secondary">
                        PAYMENT METHOD
                      </MKTypography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <MKTypography variant="body1" color="text.secondary">
                          {transactions.length === 0
                            ? "No transactions found"
                            : "No transactions match your filters"}
                        </MKTypography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
                        <TableCell>
                          <MKTypography variant="body2" fontWeight="medium">
                            {transaction.description || "N/A"}
                          </MKTypography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={
                              transaction.category?.charAt(0).toUpperCase() +
                                transaction.category?.slice(1) || "Other"
                            }
                            size="small"
                            color={getCategoryColor(transaction.category)}
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <MKTypography variant="body2" fontWeight="bold" color="error">
                            {formatCurrency(transaction.amount)}
                          </MKTypography>
                        </TableCell>
                        <TableCell align="center">
                          <MKTypography variant="body2" color="text.secondary">
                            {transaction.payment_method?.charAt(0).toUpperCase() +
                              transaction.payment_method?.slice(1) || "N/A"}
                          </MKTypography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={filteredAndSortedData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Card>
    </Container>
  );
}

export default Transactions;
