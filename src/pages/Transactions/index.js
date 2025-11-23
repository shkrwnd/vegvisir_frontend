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
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return "N/A";
      }
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "N/A";
    }
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
    <Container
      maxWidth={false}
      sx={{
        px: 0,
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header Section */}
      <MKBox
        mb={6}
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, sm: 4, md: 5 },
          background:
            "linear-gradient(135deg, rgba(204, 0, 0, 0.1) 0%, rgba(204, 0, 0, 0.05) 100%)",
          borderRadius: 3,
          border: "1px solid rgba(204, 0, 0, 0.2)",
          boxShadow: "0 4px 20px rgba(204, 0, 0, 0.1)",
        }}
      >
        <MKBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <MKBox>
            <MKBox display="flex" alignItems="center" gap={2}>
              <MKBox
                sx={{
                  width: { xs: "4px", sm: "6px" },
                  height: { xs: "40px", sm: "50px" },
                  background: "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)",
                  borderRadius: "4px",
                  boxShadow: "0 4px 12px rgba(204, 0, 0, 0.3)",
                }}
              />
              <MKTypography
                variant="h3"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                  letterSpacing: "0.5px",
                  lineHeight: 1.2,
                }}
              >
                Transactions
              </MKTypography>
            </MKBox>
          </MKBox>
          <MKButton
            variant="outlined"
            color="info"
            size="small"
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
            sx={{
              color: "#CC0000",
              borderColor: "#CC0000",
              "&:hover": {
                borderColor: "#CC0000",
                backgroundColor: "rgba(204, 0, 0, 0.05)",
              },
            }}
          >
            Refresh
          </MKButton>
        </MKBox>
      </MKBox>

      {/* Error Message */}
      {error && (
        <MKBox mb={3} sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <MKTypography
            variant="body2"
            color="error"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Error: {error}
          </MKTypography>
        </MKBox>
      )}

      {/* Filters Section */}
      <Card
        sx={{
          mb: 3,
          mx: { xs: 1, sm: 2, md: 3 },
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          width: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)", md: "calc(100% - 48px)" },
          boxSizing: "border-box",
        }}
      >
        <MKBox
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          flexWrap="wrap"
          gap={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
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
            sx={{
              minWidth: { xs: "100%", sm: 250 },
              flex: { xs: "1 1 100%", sm: "0 1 auto" },
            }}
          />

          {/* Category Filter */}
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 150 },
              flex: { xs: "1 1 100%", sm: "0 1 auto" },
            }}
          >
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
            sx={{
              minWidth: { xs: "100%", sm: 150 },
              flex: { xs: "1 1 100%", sm: "0 1 auto" },
            }}
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
            sx={{
              minWidth: { xs: "100%", sm: 150 },
              flex: { xs: "1 1 100%", sm: "0 1 auto" },
            }}
          />

          {/* Clear Filters */}
          <MKButton
            variant="outlined"
            color="secondary"
            size="small"
            onClick={clearFilters}
            sx={{
              ml: { xs: 0, sm: "auto" },
              width: { xs: "100%", sm: "auto" },
              flex: { xs: "1 1 100%", sm: "0 0 auto" },
            }}
          >
            Clear Filters
          </MKButton>
        </MKBox>
      </Card>

      {/* Transactions Table */}
      <Card
        sx={{
          mx: { xs: 1, sm: 2, md: 3 },
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.05)",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          width: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)", md: "calc(100% - 48px)" },
          boxSizing: "border-box",
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer
              sx={{
                overflowX: "auto",
                width: "100%",
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              <Table
                sx={{
                  tableLayout: { xs: "auto", sm: "fixed" },
                  width: "100%",
                  minWidth: { xs: "600px", sm: "auto" },
                  "& .MuiTableCell-root": {
                    padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                    verticalAlign: "middle",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    boxSizing: "border-box",
                  },
                  "& .MuiTableCell-head": {
                    backgroundColor: ({ palette: { grey } }) => grey[50],
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[2]} solid ${borderColor}`,
                    padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                    fontWeight: 600,
                    color: "#000000",
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    boxSizing: "border-box",
                  },
                  "& .MuiTableCell-body": {
                    padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                    color: "#000000",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    boxSizing: "border-box",
                  },
                  "& .MuiTableSortLabel-root": {
                    "& .MuiTableSortLabel-icon": {
                      transition: "opacity 0.2s",
                      marginLeft: "4px",
                    },
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiTableCell-head[align='left']": {
                    textAlign: "left",
                    "& .MuiTableSortLabel-root": {
                      justifyContent: "flex-start",
                    },
                  },
                  "& .MuiTableCell-head[align='right']": {
                    textAlign: "right",
                    "& .MuiTableSortLabel-root": {
                      justifyContent: "flex-end",
                    },
                  },
                  "& .MuiTableCell-head[align='center']": {
                    textAlign: "center",
                    "& .MuiTableSortLabel-root": {
                      justifyContent: "center",
                    },
                  },
                  "& .MuiTableCell-body[align='left']": {
                    textAlign: "left",
                  },
                  "& .MuiTableCell-body[align='right']": {
                    textAlign: "right",
                  },
                  "& .MuiTableCell-body[align='center']": {
                    textAlign: "center",
                  },
                }}
              >
                <colgroup>
                  <col style={{ width: "100px", minWidth: "100px" }} />
                  <col style={{ width: "auto", minWidth: "150px" }} />
                  <col style={{ width: "80px", minWidth: "80px" }} />
                  <col style={{ width: "100px", minWidth: "100px" }} />
                  <col style={{ width: "120px", minWidth: "120px" }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ textAlign: "left", padding: 0 }}>
                      <TableSortLabel
                        active={orderBy === "transaction_date"}
                        direction={orderBy === "transaction_date" ? order : "asc"}
                        onClick={() => handleRequestSort("transaction_date")}
                        sx={{
                          justifyContent: "flex-start",
                          width: "100%",
                          margin: 0,
                          padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                          "& .MuiTableSortLabel-icon": {
                            marginLeft: "4px",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                        }}
                      >
                        <MKTypography
                          variant="caption"
                          fontWeight="bold"
                          sx={{
                            color: "#000000",
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          }}
                        >
                          DATE
                        </MKTypography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left" sx={{ textAlign: "left", padding: 0 }}>
                      <TableSortLabel
                        active={orderBy === "description"}
                        direction={orderBy === "description" ? order : "asc"}
                        onClick={() => handleRequestSort("description")}
                        sx={{
                          justifyContent: "flex-start",
                          width: "100%",
                          margin: 0,
                          padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                          "& .MuiTableSortLabel-icon": {
                            marginLeft: "4px",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                        }}
                      >
                        <MKTypography
                          variant="caption"
                          fontWeight="bold"
                          sx={{
                            color: "#000000",
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          }}
                        >
                          DESCRIPTION
                        </MKTypography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left" sx={{ textAlign: "left", padding: 0 }}>
                      <TableSortLabel
                        active={orderBy === "category"}
                        direction={orderBy === "category" ? order : "asc"}
                        onClick={() => handleRequestSort("category")}
                        sx={{
                          justifyContent: "flex-start",
                          width: "100%",
                          margin: 0,
                          padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                          "& .MuiTableSortLabel-icon": {
                            marginLeft: "4px",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                        }}
                      >
                        <MKTypography
                          variant="caption"
                          fontWeight="bold"
                          sx={{
                            color: "#000000",
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          }}
                        >
                          CATEGORY
                        </MKTypography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right" sx={{ textAlign: "right", padding: 0 }}>
                      <TableSortLabel
                        active={orderBy === "amount"}
                        direction={orderBy === "amount" ? order : "asc"}
                        onClick={() => handleRequestSort("amount")}
                        sx={{
                          justifyContent: "flex-end",
                          width: "100%",
                          margin: 0,
                          padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                          "& .MuiTableSortLabel-icon": {
                            marginLeft: "4px",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                        }}
                      >
                        <MKTypography
                          variant="caption"
                          fontWeight="bold"
                          sx={{
                            color: "#000000",
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          }}
                        >
                          AMOUNT
                        </MKTypography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left" sx={{ textAlign: "left", padding: 0 }}>
                      <MKBox
                        sx={{
                          padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                        }}
                      >
                        <MKTypography
                          variant="caption"
                          fontWeight="bold"
                          sx={{
                            color: "#000000",
                            whiteSpace: "nowrap",
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          }}
                        >
                          PAYMENT METHOD
                        </MKTypography>
                      </MKBox>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <MKTypography variant="body1" sx={{ color: "#000000" }}>
                          {transactions.length === 0
                            ? "No transactions found"
                            : "No transactions match your filters"}
                        </MKTypography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((transaction) => {
                      // Debug: Log transaction data
                      if (process.env.NODE_ENV === "development") {
                        console.log("Transaction data:", transaction);
                      }
                      return (
                        <TableRow key={transaction.id} hover>
                          <TableCell
                            align="left"
                            sx={{
                              textAlign: "left",
                              padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                            }}
                          >
                            <MKTypography variant="body2" sx={{ color: "#000000" }}>
                              {formatDate(transaction.transaction_date || transaction.created_at)}
                            </MKTypography>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              textAlign: "left",
                              padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                            }}
                          >
                            <MKTypography
                              variant="body2"
                              fontWeight="medium"
                              sx={{ color: "#000000" }}
                            >
                              {transaction.description || "N/A"}
                            </MKTypography>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              textAlign: "left",
                              padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                            }}
                          >
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
                          <TableCell
                            align="right"
                            sx={{
                              textAlign: "right",
                              padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                            }}
                          >
                            <MKTypography
                              variant="body2"
                              fontWeight="bold"
                              sx={{ color: "#000000" }}
                            >
                              {formatCurrency(transaction.amount)}
                            </MKTypography>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              textAlign: "left",
                              padding: { xs: "8px 8px", sm: "10px 12px", md: "12px 16px" },
                            }}
                          >
                            <MKTypography variant="body2" sx={{ color: "#000000" }}>
                              {transaction.payment_method?.charAt(0).toUpperCase() +
                                transaction.payment_method?.slice(1) || "N/A"}
                            </MKTypography>
                          </TableCell>
                        </TableRow>
                      );
                    })
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
              labelRowsPerPage="Rows:"
              sx={{
                "& .MuiTablePagination-toolbar": {
                  color: "#000000",
                  flexWrap: "wrap",
                  gap: 1,
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
                "& .MuiTablePagination-selectLabel": {
                  color: "#000000",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
                "& .MuiTablePagination-displayedRows": {
                  color: "#000000",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
                "& .MuiTablePagination-select": {
                  color: "#000000",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
                "& .MuiTablePagination-actions": {
                  color: "#000000",
                },
                "& .MuiIconButton-root": {
                  padding: { xs: "4px", sm: "8px" },
                },
              }}
            />
          </>
        )}
      </Card>
    </Container>
  );
}

export default Transactions;
