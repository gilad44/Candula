import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRateLimitedApi } from "../../hooks/useRateLimitedApi";
import {
  contactService,
  type ContactMessage,
} from "../../services/contactService";
import type { RootState } from "../../store/store";

const AdminContacts = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);

  // Rate limiting protection for API calls
  const { createDebouncedCall } = useRateLimitedApi({
    debounceMs: 500,
    maxRetries: 3,
    showRateLimitWarning: true,
  });

  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(
    null
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filters, setFilters] = useState({ status: "", priority: "" });

  // Status update state
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  // Create rate-limited API functions
  const debouncedGetAllContacts = useMemo(
    () =>
      createDebouncedCall(
        contactService.getAllContacts.bind(contactService),
        800
      ),
    [createDebouncedCall]
  );

  const debouncedUpdateContactStatus = useMemo(
    () =>
      createDebouncedCall(
        contactService.updateContactStatus.bind(contactService),
        1000
      ),
    [createDebouncedCall]
  );

  const debouncedDeleteContact = useMemo(
    () =>
      createDebouncedCall(
        contactService.deleteContact.bind(contactService),
        1500
      ),
    [createDebouncedCall]
  );

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);

      // Check if user exists and has token
      if (!user?.token) {
        console.error("No user token found");
        toast.error("נדרש להתחבר כמנהל כדי לצפות בהודעות");
        return;
      }

      // Use rate-limited API call
      const data = await debouncedGetAllContacts(
        user.token,
        filters.status || filters.priority ? filters : undefined
      );
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      if (error instanceof Error) {
        // Check if it's a rate limit error
        if (error.message.includes("Rate limited")) {
          console.warn("API call was rate limited, skipping...");
          return;
        }
        toast.error(`שגיאה בטעינת הודעות יצירת קשר: ${error.message}`);
      } else {
        toast.error("שגיאה בטעינת הודעות יצירת קשר");
      }
    } finally {
      setLoading(false);
    }
  }, [user?.token, filters, debouncedGetAllContacts]);

  useEffect(() => {
    if (user?.token) {
      fetchContacts();
    } else {
      setLoading(false);
    }
  }, [user, fetchContacts]);

  const refetchContacts = useCallback(async () => {
    try {
      setLoading(true);

      if (!user?.token) {
        toast.error("נדרש להתחבר כמנהל כדי לצפות בהודעות");
        return;
      }

      // Use rate-limited API call
      const data = await debouncedGetAllContacts(
        user.token,
        filters.status || filters.priority ? filters : undefined
      );
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      if (error instanceof Error) {
        // Check if it's a rate limit error
        if (error.message.includes("Rate limited")) {
          console.warn("API call was rate limited, skipping...");
          return;
        }
        toast.error(`שגיאה בטעינת הודעות יצירת קשר: ${error.message}`);
      } else {
        toast.error("שגיאה בטעינת הודעות יצירת קשר");
      }
    } finally {
      setLoading(false);
    }
  }, [user?.token, filters, debouncedGetAllContacts]);

  const handleViewContact = (contact: ContactMessage) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);
  };

  const handleUpdateStatus = (contact: ContactMessage) => {
    setSelectedContact(contact);
    setNewStatus(contact.status);
    setAdminNotes(contact.adminNotes || "");
    setStatusDialogOpen(true);
  };

  const handleDeleteContact = (contact: ContactMessage) => {
    setSelectedContact(contact);
    setDeleteDialogOpen(true);
  };

  const confirmStatusUpdate = useCallback(async () => {
    if (!selectedContact || !user?.token) return;

    try {
      // Use rate-limited API call
      await debouncedUpdateContactStatus(
        selectedContact._id,
        newStatus,
        user.token,
        adminNotes
      );
      toast.success("סטטוס הודעה עודכן בהצלחה");
      refetchContacts();
      setStatusDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      if (error instanceof Error && error.message.includes("Rate limited")) {
        toast.warn("יותר מדי בקשות. אנא המתן מעט לפני ניסיון נוסף");
        return;
      }
      toast.error("שגיאה בעדכון סטטוס ההודעה");
    }
  }, [
    selectedContact,
    user?.token,
    newStatus,
    adminNotes,
    debouncedUpdateContactStatus,
    refetchContacts,
  ]);

  const confirmDelete = useCallback(async () => {
    if (!selectedContact || !user?.token) return;

    try {
      // Use rate-limited API call
      await debouncedDeleteContact(selectedContact._id, user.token);
      toast.success("הודעה נמחקה בהצלחה");
      refetchContacts();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting contact:", error);
      if (error instanceof Error && error.message.includes("Rate limited")) {
        toast.warn("יותר מדי בקשות. אנא המתן מעט לפני ניסיון נוסף");
        return;
      }
      toast.error("שגיאה במחיקת ההודעה");
    }
  }, [selectedContact, user?.token, debouncedDeleteContact, refetchContacts]);

  const getStatusColor = (
    status: string
  ): "error" | "warning" | "info" | "success" | "default" => {
    switch (status) {
      case "חדש":
        return "error";
      case "נקרא":
        return "warning";
      case "נענה":
        return "info";
      case "טופל":
        return "success";
      default:
        return "default";
    }
  };

  const getPriorityColor = (
    priority: string
  ): "error" | "warning" | "info" | "success" | "default" => {
    switch (priority) {
      case "דחופה":
        return "error";
      case "גבוהה":
        return "warning";
      case "בינונית":
        return "info";
      case "נמוכה":
        return "success";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user || user.role !== "admin") {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5">אין הרשאה לצפייה בעמוד זה</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {!user ? "נדרש להתחבר למערכת" : "נדרשות הרשאות מנהל"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, direction: "rtl" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        ניהול הודעות יצירת קשר
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: { xs: "stretch", sm: "center" },
            }}
          >
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <FormControl fullWidth sx={{ direction: "rtl" }}>
                <InputLabel
                  sx={{
                    right: 14,
                    left: "unset",
                    transformOrigin: "top right",
                  }}
                >
                  סטטוס
                </InputLabel>
                <Select
                  value={filters.status}
                  label="סטטוס"
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  sx={{ textAlign: "right" }}
                >
                  <MenuItem value="">הכל</MenuItem>
                  <MenuItem value="חדש">חדש</MenuItem>
                  <MenuItem value="נקרא">נקרא</MenuItem>
                  <MenuItem value="נענה">נענה</MenuItem>
                  <MenuItem value="טופל">טופל</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <FormControl fullWidth sx={{ direction: "rtl" }}>
                <InputLabel
                  sx={{
                    right: 14,
                    left: "unset",
                    transformOrigin: "top right",
                  }}
                >
                  עדיפות
                </InputLabel>
                <Select
                  value={filters.priority}
                  label="עדיפות"
                  onChange={(e) =>
                    setFilters({ ...filters, priority: e.target.value })
                  }
                  sx={{ textAlign: "right" }}
                >
                  <MenuItem value="">הכל</MenuItem>
                  <MenuItem value="נמוכה">נמוכה</MenuItem>
                  <MenuItem value="בינונית">בינונית</MenuItem>
                  <MenuItem value="גבוהה">גבוהה</MenuItem>
                  <MenuItem value="דחופה">דחופה</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Button
                variant="outlined"
                onClick={() => setFilters({ status: "", priority: "" })}
                fullWidth
              >
                איפוס מסננים
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>שם</TableCell>
              <TableCell>אימייל</TableCell>
              <TableCell>נושא</TableCell>
              <TableCell>סטטוס</TableCell>
              <TableCell>עדיפות</TableCell>
              <TableCell>תאריך</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                  טוען...
                </TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                  אין הודעות יצירת קשר
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    {contact.subject && contact.subject.length > 30
                      ? `${contact.subject.substring(0, 30)}...`
                      : contact.subject || "אין נושא"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={contact.status}
                      color={getStatusColor(contact.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={contact.priority}
                      color={getPriorityColor(contact.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(contact.createdAt)}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleViewContact(contact)}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleUpdateStatus(contact)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteContact(contact)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Contact Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ direction: "rtl" }}>
          פרטי הודעת יצירת קשר
        </DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Box sx={{ direction: "rtl" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedContact.subject}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>שם:</strong> {selectedContact.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>אימייל:</strong> {selectedContact.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>תאריך:</strong> {formatDate(selectedContact.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>סטטוס:</strong>{" "}
                <Chip
                  label={selectedContact.status}
                  color={getStatusColor(selectedContact.status)}
                  size="small"
                />
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>הודעה:</strong>
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="body2">
                  {selectedContact.message}
                </Typography>
              </Paper>
              {selectedContact.adminNotes && (
                <>
                  <Typography variant="body1" sx={{ mb: 1, mt: 2 }}>
                    <strong>הערות מנהל:</strong>
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Typography variant="body2">
                      {selectedContact.adminNotes}
                    </Typography>
                  </Paper>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>סגור</Button>
          {selectedContact && (
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
            >
              השב באימייל
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ direction: "rtl" }}>עדכון סטטוס הודעה</DialogTitle>
        <DialogContent>
          <Box sx={{ direction: "rtl", mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3, direction: "rtl" }}>
              <InputLabel
                sx={{ right: 14, left: "unset", transformOrigin: "top right" }}
              >
                סטטוס
              </InputLabel>
              <Select
                value={newStatus}
                label="סטטוס"
                onChange={(e) => setNewStatus(e.target.value)}
                sx={{ textAlign: "right" }}
              >
                <MenuItem value="חדש">חדש</MenuItem>
                <MenuItem value="נקרא">נקרא</MenuItem>
                <MenuItem value="נענה">נענה</MenuItem>
                <MenuItem value="טופל">טופל</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="הערות מנהל"
              multiline
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="הוסף הערות על הטיפול בהודעה..."
              sx={{ direction: "rtl" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={confirmStatusUpdate}>
            עדכן
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ direction: "rtl" }}>מחיקת הודעה</DialogTitle>
        <DialogContent>
          <Typography sx={{ direction: "rtl" }}>
            האם אתה בטוח שברצונך למחוק הודעה זו? פעולה זו לא ניתנת לביטול.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminContacts;
