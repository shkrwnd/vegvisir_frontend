/**
=========================================================
* Material Kit 2 PRO React - v2.1.1
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2025 Made by Vegvisir Team

Coded by Vegvisir Team

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useMemo } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
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

// @mui icons
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Icon from "@mui/material/Icon";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";
import MKAvatar from "components/base/MKAvatar";
import MKBadge from "components/base/MKBadge";
import MKSnackbar from "components/base/MKSnackbar";

// Sample data
const initialData = [
  {
    id: 1,
    name: "John Michael",
    email: "john@creative-tim.com",
    role: "Manager",
    status: "Active",
    department: "Sales",
    joinDate: "23/04/18",
  },
  {
    id: 2,
    name: "Alexa Liras",
    email: "alexa@creative-tim.com",
    role: "Programator",
    status: "Active",
    department: "Development",
    joinDate: "11/01/19",
  },
  {
    id: 3,
    name: "Laurent Perrier",
    email: "laurent@creative-tim.com",
    role: "Executive",
    status: "Inactive",
    department: "Marketing",
    joinDate: "19/09/17",
  },
  {
    id: 4,
    name: "Michael Levi",
    email: "michael@creative-tim.com",
    role: "Programator",
    status: "Active",
    department: "Development",
    joinDate: "24/12/08",
  },
  {
    id: 5,
    name: "Richard Gran",
    email: "richard@creative-tim.com",
    role: "Manager",
    status: "Inactive",
    department: "Sales",
    joinDate: "04/10/21",
  },
  {
    id: 6,
    name: "Miriam Eric",
    email: "miriam@creative-tim.com",
    role: "Designer",
    status: "Active",
    department: "Design",
    joinDate: "14/09/20",
  },
  {
    id: 7,
    name: "Sarah Johnson",
    email: "sarah@creative-tim.com",
    role: "Manager",
    status: "Active",
    department: "Sales",
    joinDate: "15/03/19",
  },
  {
    id: 8,
    name: "David Wilson",
    email: "david@creative-tim.com",
    role: "Programator",
    status: "Active",
    department: "Development",
    joinDate: "08/06/21",
  },
  {
    id: 9,
    name: "Emma Thompson",
    email: "emma@creative-tim.com",
    role: "Designer",
    status: "Active",
    department: "Design",
    joinDate: "22/07/20",
  },
  {
    id: 10,
    name: "James Brown",
    email: "james@creative-tim.com",
    role: "Executive",
    status: "Active",
    department: "Marketing",
    joinDate: "30/11/19",
  },
];

function DataTables() {
  const [data] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    color: "info",
    icon: "info",
    title: "",
    dateTime: "now",
    content: "",
  });

  const showSnackbar = (color, icon, title, content) => {
    setSnackbar({
      open: true,
      color,
      icon,
      title,
      dateTime: "now",
      content,
    });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((row) => {
      const matchesSearch =
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || row.status === statusFilter;
      const matchesRole = roleFilter === "All" || row.role === roleFilter;
      const matchesDepartment = departmentFilter === "All" || row.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesRole && matchesDepartment;
    });

    // Apply sorting
    if (orderBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[orderBy];
        let bValue = b[orderBy];

        if (typeof aValue === "string") {
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
  }, [data, searchQuery, statusFilter, roleFilter, departmentFilter, orderBy, order]);

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
    setStatusFilter("All");
    setRoleFilter("All");
    setDepartmentFilter("All");
    setOrderBy("");
    setOrder("asc");
    setPage(0);
    showSnackbar(
      "info",
      "filter_alt",
      "Filters Cleared",
      "All filters have been reset to default values."
    );
  };

  const handleEdit = (row) => {
    showSnackbar("success", "edit", "Edit Action", `Editing user: ${row.name}`);
  };

  const handleAddNew = () => {
    showSnackbar(
      "success",
      "add",
      "Add New Entry",
      "Opening form to add a new entry to the table."
    );
  };

  const getStatusColor = (status) => {
    return status === "Active" ? "success" : "secondary";
  };

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Header Section */}
      <MKBox mb={6}>
        <MKBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MKTypography variant="h4" fontWeight="bold">
            Data Tables
          </MKTypography>
          <MKButton variant="gradient" color="info" size="large" onClick={handleAddNew}>
            Add New Entry
          </MKButton>
        </MKBox>
        <MKTypography variant="body1" color="text">
          Comprehensive data table with sorting, filtering, and pagination functionality.
        </MKTypography>
      </MKBox>

      {/* Filters Section */}
      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="medium"
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "56px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchQuery("");
                        setPage(0);
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl
              fullWidth
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "56px",
                },
              }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl
              fullWidth
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "56px",
                },
              }}
            >
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Programator">Programator</MenuItem>
                <MenuItem value="Executive">Executive</MenuItem>
                <MenuItem value="Designer">Designer</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl
              fullWidth
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "56px",
                },
              }}
            >
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentFilter}
                label="Department"
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <MKButton
              variant="outlined"
              color="info"
              fullWidth
              onClick={clearFilters}
              sx={{
                textTransform: "uppercase",
                height: "56px",
                minHeight: "56px",
              }}
            >
              Clear Filters
            </MKButton>
          </Grid>
        </Grid>

        {/* Active Filters Display */}
        {(searchQuery ||
          statusFilter !== "All" ||
          roleFilter !== "All" ||
          departmentFilter !== "All") && (
          <MKBox mt={2} display="flex" flexWrap="wrap" gap={1} alignItems="center">
            <MKTypography variant="caption" color="text" mr={1} sx={{ opacity: 0.7 }}>
              Active filters:
            </MKTypography>
            {searchQuery && (
              <Chip
                label={`Search: ${searchQuery}`}
                onDelete={() => {
                  setSearchQuery("");
                  setPage(0);
                }}
                size="small"
              />
            )}
            {statusFilter !== "All" && (
              <Chip
                label={`Status: ${statusFilter}`}
                onDelete={() => {
                  setStatusFilter("All");
                  setPage(0);
                }}
                size="small"
              />
            )}
            {roleFilter !== "All" && (
              <Chip
                label={`Role: ${roleFilter}`}
                onDelete={() => {
                  setRoleFilter("All");
                  setPage(0);
                }}
                size="small"
              />
            )}
            {departmentFilter !== "All" && (
              <Chip
                label={`Department: ${departmentFilter}`}
                onDelete={() => {
                  setDepartmentFilter("All");
                  setPage(0);
                }}
                size="small"
              />
            )}
          </MKBox>
        )}

        {/* Results Count */}
        <MKBox mt={2}>
          <MKTypography variant="caption" color="text" sx={{ opacity: 0.7 }}>
            Showing {paginatedData.length} of {filteredAndSortedData.length} results
          </MKTypography>
        </MKBox>
      </Card>

      {/* Table Section */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table
            sx={{
              tableLayout: "fixed",
              width: "100%",
              "& .MuiTableCell-root": {
                padding: "12px 16px",
                verticalAlign: "middle",
              },
              "& .MuiTableCell-head": {
                backgroundColor: ({ palette: { grey } }) => grey[50],
                borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[2]} solid ${borderColor}`,
                padding: "12px 16px",
              },
              "& .MuiTableCell-body": {
                padding: "12px 16px",
              },
              "& .MuiTableSortLabel-root": {
                "& .MuiTableSortLabel-icon": {
                  transition: "opacity 0.2s",
                },
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "180px", minWidth: "180px", maxWidth: "180px" }}>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleRequestSort("name")}
                  >
                    <MKTypography variant="caption" fontWeight="bold" color="secondary">
                      NAME
                    </MKTypography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "email"}
                    direction={orderBy === "email" ? order : "asc"}
                    onClick={() => handleRequestSort("email")}
                  >
                    <MKTypography variant="caption" fontWeight="bold" color="secondary">
                      EMAIL
                    </MKTypography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "role"}
                    direction={orderBy === "role" ? order : "asc"}
                    onClick={() => handleRequestSort("role")}
                  >
                    <MKTypography variant="caption" fontWeight="bold" color="secondary">
                      ROLE
                    </MKTypography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ width: "120px" }}>
                  <MKTypography variant="caption" fontWeight="bold" color="secondary">
                    STATUS
                  </MKTypography>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "department"}
                    direction={orderBy === "department" ? order : "asc"}
                    onClick={() => handleRequestSort("department")}
                  >
                    <MKTypography variant="caption" fontWeight="bold" color="secondary">
                      DEPARTMENT
                    </MKTypography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "joinDate"}
                    direction={orderBy === "joinDate" ? order : "asc"}
                    onClick={() => handleRequestSort("joinDate")}
                  >
                    <MKTypography variant="caption" fontWeight="bold" color="secondary">
                      JOIN DATE
                    </MKTypography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ width: "100px" }}>
                  <MKTypography variant="caption" fontWeight="bold" color="secondary">
                    ACTION
                  </MKTypography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <MKTypography variant="body2" color="text" sx={{ opacity: 0.7 }}>
                      No data found matching your filters
                    </MKTypography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell
                      sx={{
                        width: "180px",
                        minWidth: "180px",
                        maxWidth: "180px",
                        overflow: "hidden",
                      }}
                    >
                      <MKBox display="flex" alignItems="center" sx={{ minWidth: 0 }}>
                        <MKAvatar
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 1.5,
                            bgcolor: "primary.main",
                            flexShrink: 0,
                          }}
                        >
                          {row.name.charAt(0)}
                        </MKAvatar>
                        <MKTypography
                          variant="button"
                          fontWeight="medium"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          {row.name}
                        </MKTypography>
                      </MKBox>
                    </TableCell>
                    <TableCell>
                      <MKTypography variant="caption" color="text">
                        {row.email}
                      </MKTypography>
                    </TableCell>
                    <TableCell>
                      <MKTypography variant="caption" color="text">
                        {row.role}
                      </MKTypography>
                    </TableCell>
                    <TableCell align="center" sx={{ width: "120px" }}>
                      <MKBadge
                        variant="contained"
                        badgeContent={row.status}
                        color={getStatusColor(row.status)}
                        size="xs"
                        container
                      />
                    </TableCell>
                    <TableCell>
                      <MKTypography variant="caption" color="text">
                        {row.department}
                      </MKTypography>
                    </TableCell>
                    <TableCell>
                      <MKTypography variant="caption" color="text" sx={{ opacity: 0.7 }}>
                        {row.joinDate}
                      </MKTypography>
                    </TableCell>
                    <TableCell align="center" sx={{ width: "100px" }}>
                      <MKButton
                        variant="text"
                        color="info"
                        size="small"
                        onClick={() => handleEdit(row)}
                        sx={{
                          margin: 0,
                          minWidth: "auto",
                          padding: "4px 8px",
                        }}
                      >
                        Edit
                      </MKButton>
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
      </Card>

      {/* Snackbar */}
      <MKSnackbar
        color={snackbar.color}
        icon={<Icon>{snackbar.icon}</Icon>}
        title={snackbar.title}
        content={snackbar.content}
        dateTime={snackbar.dateTime}
        open={snackbar.open}
        close={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Container>
  );
}

export default DataTables;
