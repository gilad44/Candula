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

const AdminUsers = () => {
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
      console.log("Users API response:", usersData); // Debug log
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6">טוען משתמשים...</Typography>
      </Box>
    );
  }

  return (
    <Box dir="rtl" sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">ניהול משתמשים - אדמין</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/admin")}
        >
          חזרה לניהול מערכת
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>שם</TableCell>
              <TableCell>אימייל</TableCell>
              <TableCell>טלפון</TableCell>
              <TableCell>תפקיד</TableCell>
              <TableCell>תאריך הצטרפות</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  {user.name.first} {user.name.last}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role === "admin" ? "מנהל" : "לקוח"}
                    color={user.role === "admin" ? "error" : "primary"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {formatDate(user.createdAt || new Date())}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleEditUser(user)}
                    >
                      ערוך
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => toggleUserRole(user._id, user.role)}
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
      >
        <DialogTitle>עריכת משתמש</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="שם פרטי"
              value={editFormData.firstName}
              onChange={(e) =>
                setEditFormData({ ...editFormData, firstName: e.target.value })
              }
              fullWidth
              dir="rtl"
            />
            <TextField
              label="שם משפחה"
              value={editFormData.lastName}
              onChange={(e) =>
                setEditFormData({ ...editFormData, lastName: e.target.value })
              }
              fullWidth
              dir="rtl"
            />
            <TextField
              label="אימייל"
              type="email"
              value={editFormData.email}
              onChange={(e) =>
                setEditFormData({ ...editFormData, email: e.target.value })
              }
              fullWidth
              dir="rtl"
            />
            <TextField
              label="טלפון"
              value={editFormData.phone}
              onChange={(e) =>
                setEditFormData({ ...editFormData, phone: e.target.value })
              }
              fullWidth
              dir="rtl"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>ביטול</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>מחיקת משתמש</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את המשתמש {selectedUser?.name.first}{" "}
            {selectedUser?.name.last}?
            <br />
            פעולה זו לא ניתנת לביטול.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>ביטול</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;
