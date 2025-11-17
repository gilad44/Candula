import { ArrowBack, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { config } from "../../config/config";
import type { User } from "../../types/User";
import styles from "../../Styles/pages/admin/AdminUsers.module.css";

const AdminUsersWithCSSModules = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const navigate = useNavigate();

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Loading users with token:", token ? "exists" : "missing"); // Debug log

      const response = await fetch(`${config.API_BASE_URL}/users`, {
        headers: {
          "x-auth-token": token || "",
        },
      });

      console.log("Users API response status:", response.status); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Users API error:", errorText); // Debug log

        if (response.status === 401 || response.status === 403) {
          throw new Error("שגיאת הרשאה: נדרשת התחברות מחדש או הרשאות מנהל");
        }

        throw new Error(
          `Failed to fetch users: ${response.status} - ${errorText}`
        );
      }

      const usersData = await response.json();
      // Ensure we always have an array
      const usersArray = Array.isArray(usersData) ? usersData : [];
      setUsers(usersArray);
    } catch (error) {
      console.error("Error loading users:", error);
      if (error.message.includes("הרשאה")) {
        toast.error(error.message);
      } else {
        toast.error("שגיאה בטעינת המשתמשים");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${config.API_BASE_URL}/users/${selectedUser._id}`,
        {
          method: "DELETE",
          headers: {
            "x-auth-token": token || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success("המשתמש נמחק בהצלחה");
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      loadUsers(); // Refresh users
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("שגיאה במחיקת המשתמש");
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${config.API_BASE_URL}/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token || "",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      toast.success("תפקיד המשתמש עודכן בהצלחה");
      loadUsers(); // Refresh users
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("שגיאה בעדכון תפקיד המשתמש");
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.name?.first || "",
      lastName: user.name?.last || "",
      email: user.email,
      phone: user.phone || "",
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${config.API_BASE_URL}/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token || "",
          },
          body: JSON.stringify({
            name: {
              first: editFormData.firstName,
              last: editFormData.lastName,
            },
            email: editFormData.email,
            phone: editFormData.phone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      toast.success("המשתמש עודכן בהצלחה");
      setEditDialogOpen(false);
      setSelectedUser(null);
      loadUsers(); // Refresh users
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("שגיאה בעדכון המשתמש");
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <Typography variant="h6" className={styles.loadingText}>
          טוען משתמשים...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          ניהול משתמשים - אדמין
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/admin")}
          className={styles.backButton}
        >
          חזרה לניהול מערכת
        </Button>
      </Box>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table className={styles.table}>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell className={styles.tableHeadCell}>שם</TableCell>
              <TableCell className={styles.tableHeadCell}>אימייל</TableCell>
              <TableCell className={styles.tableHeadCell}>טלפון</TableCell>
              <TableCell className={styles.tableHeadCell}>תפקיד</TableCell>
              <TableCell className={styles.tableHeadCell}>
                תאריך הצטרפות
              </TableCell>
              <TableCell className={styles.tableHeadCell}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} className={styles.tableRow}>
                <TableCell className={styles.tableCell}>
                  {user.name.first} {user.name.last}
                </TableCell>
                <TableCell className={styles.tableCell}>{user.email}</TableCell>
                <TableCell className={styles.tableCell}>{user.phone}</TableCell>
                <TableCell className={styles.tableCell}>
                  <Chip
                    label={user.role === "admin" ? "מנהל" : "לקוח"}
                    color={user.role === "admin" ? "error" : "primary"}
                    size="small"
                  />
                </TableCell>
                <TableCell className={styles.tableCell}>
                  {formatDate(user.createdAt || new Date())}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  <Box className={styles.actionsCell}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleEditUser(user)}
                      className={styles.editButton}
                    >
                      ערוך
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => toggleUserRole(user._id, user.role)}
                      className={styles.toggleRoleButton}
                    >
                      {user.role === "admin" ? "הפוך ללקוח" : "הפוך למנהל"}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setSelectedUser(user);
                        setDeleteDialogOpen(true);
                      }}
                      className={styles.deleteButton}
                    >
                      מחק
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        className={styles.dialog}
      >
        <DialogTitle className={styles.dialogTitle}>עריכת משתמש</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <Box className={styles.editForm}>
            <TextField
              label="שם פרטי"
              value={editFormData.firstName}
              onChange={(e) =>
                setEditFormData({ ...editFormData, firstName: e.target.value })
              }
              className={styles.textField}
            />
            <TextField
              label="שם משפחה"
              value={editFormData.lastName}
              onChange={(e) =>
                setEditFormData({ ...editFormData, lastName: e.target.value })
              }
              className={styles.textField}
            />
            <TextField
              label="אימייל"
              type="email"
              value={editFormData.email}
              onChange={(e) =>
                setEditFormData({ ...editFormData, email: e.target.value })
              }
              className={styles.textField}
            />
            <TextField
              label="טלפון"
              value={editFormData.phone}
              onChange={(e) =>
                setEditFormData({ ...editFormData, phone: e.target.value })
              }
              className={styles.textField}
            />
          </Box>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            className={styles.cancelButton}
          >
            ביטול
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            className={styles.confirmButton}
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        className={styles.dialog}
      >
        <DialogTitle className={styles.dialogTitle}>מחיקת משתמש</DialogTitle>
        <DialogContent className={styles.deleteDialogContent}>
          <Typography>
            האם אתה בטוח שברצונך למחוק את המשתמש {selectedUser?.name.first}{" "}
            {selectedUser?.name.last}?
            <br />
            פעולה זו לא ניתנת לביטול.
          </Typography>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            className={styles.cancelButton}
          >
            ביטול
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
            className={styles.deleteConfirmButton}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersWithCSSModules;
