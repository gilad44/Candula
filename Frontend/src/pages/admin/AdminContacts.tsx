import {
  ArrowBack as ArrowBackIcon,
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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRateLimitedApi } from "../../hooks/useRateLimitedApi";
import {
  contactService,
  type ContactMessage,
} from "../../services/contactService";
import type { RootState } from "../../store/store";
import styles from "../../Styles/pages/admin/AdminContacts.module.css";

const AdminContactsWithCSSModules = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);
  const navigate = useNavigate();

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
  const debouncedUpdateContactStatus = useMemo(
    () =>
      createDebouncedCall(
        contactService.updateContactStatus.bind(contactService),
        1000
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
        setContacts([]);
        return;
      }

      // Use direct API call
      const data = await contactService.getAllContacts(
        user.token,
        filters.status || filters.priority ? filters : undefined
      );
      // Ensure data is always an array
      const contactsArray = Array.isArray(data) ? data : [];
      setContacts(contactsArray);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]); // Reset to empty array on error
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
  }, [user?.token, filters]);

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
        setContacts([]);
        return;
      }

      // Use direct API call
      const data = await contactService.getAllContacts(
        user.token,
        filters.status || filters.priority ? filters : undefined
      );
      // Ensure data is always an array
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]); // Reset to empty array on error
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
  }, [user?.token, filters]);

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
      // Use direct API call
      await contactService.deleteContact(selectedContact._id, user.token);
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
  }, [selectedContact, user?.token, refetchContacts]);

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
      <Box className={styles.noAccessContainer}>
        <Typography variant="h5" className={styles.noAccessTitle}>
          אין הרשאה לצפייה בעמוד זה
        </Typography>
        <Typography variant="body2" className={styles.noAccessText}>
          {!user ? "נדרש להתחבר למערכת" : "נדרשות הרשאות מנהל"}
        </Typography>
      </Box>
    );
  }

  const labelProps = {
    style: {
      right: 14,
      left: "unset",
      transformOrigin: "top right",
    },
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin")}
            className={styles.backButton}
            startIcon={<ArrowBackIcon />}
          >
            חזרה לניהול מערכת
          </Button>
          <Typography variant="h4" className={styles.title}>
            ניהול הודעות יצירת קשר
          </Typography>
        </Box>
        {contacts.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (
                window.confirm(
                  `האם אתה בטוח שברצונך למחוק את כל ${contacts.length} ההודעות?`
                )
              ) {
                try {
                  for (const contact of contacts) {
                    await contactService.deleteContact(
                      contact._id,
                      user?.token || ""
                    );
                  }
                  toast.success("כל ההודעות נמחקו בהצלחה");
                  refetchContacts();
                } catch (error) {
                  console.error("Error deleting all contacts:", error);
                  toast.error("שגיאה במחיקת ההודעות");
                }
              }
            }}
          >
            מחק הכל ({contacts.length})
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Card className={styles.filtersCard}>
        <CardContent>
          <Box className={styles.filtersContent}>
            <Box className={styles.filterBox}>
              <FormControl className={styles.formControl}>
                <InputLabel sx={labelProps.style}>סטטוס</InputLabel>
                <Select
                  value={filters.status}
                  label="סטטוס"
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className={styles.select}
                >
                  <MenuItem value="">הכל</MenuItem>
                  <MenuItem value="חדש">חדש</MenuItem>
                  <MenuItem value="נקרא">נקרא</MenuItem>
                  <MenuItem value="נענה">נענה</MenuItem>
                  <MenuItem value="טופל">טופל</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className={styles.filterBox}>
              <FormControl className={styles.formControl}>
                <InputLabel sx={labelProps.style}>עדיפות</InputLabel>
                <Select
                  value={filters.priority}
                  label="עדיפות"
                  onChange={(e) =>
                    setFilters({ ...filters, priority: e.target.value })
                  }
                  className={styles.select}
                >
                  <MenuItem value="">הכל</MenuItem>
                  <MenuItem value="נמוכה">נמוכה</MenuItem>
                  <MenuItem value="בינונית">בינונית</MenuItem>
                  <MenuItem value="גבוהה">גבוהה</MenuItem>
                  <MenuItem value="דחופה">דחופה</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className={styles.filterBox}>
              <Button
                variant="outlined"
                onClick={() => setFilters({ status: "", priority: "" })}
                className={styles.resetButton}
              >
                איפוס מסננים
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table className={styles.table}>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell className={styles.tableHeadCell}>שם</TableCell>
              <TableCell className={styles.tableHeadCell}>אימייל</TableCell>
              <TableCell className={styles.tableHeadCell}>נושא</TableCell>
              <TableCell className={styles.tableHeadCell}>סטטוס</TableCell>
              <TableCell className={styles.tableHeadCell}>עדיפות</TableCell>
              <TableCell className={styles.tableHeadCell}>תאריך</TableCell>
              <TableCell className={styles.tableHeadCell}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className={styles.loadingCell}>
                  טוען...
                </TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className={styles.emptyCell}>
                  אין הודעות יצירת קשר
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact._id} className={styles.tableRow}>
                  <TableCell className={styles.tableCell}>
                    {contact.name || "לא צוין"}
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    {contact.email || "לא צוין"}
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    {contact.subject && contact.subject.length > 30
                      ? `${contact.subject.substring(0, 30)}...`
                      : contact.subject || "אין נושא"}
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    <Chip
                      label={contact.status || "לא זמין"}
                      color={getStatusColor(contact.status || "")}
                      size="small"
                    />
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    <Chip
                      label={contact.priority || "לא זמין"}
                      color={getPriorityColor(contact.priority || "")}
                      size="small"
                    />
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    {contact.createdAt
                      ? formatDate(contact.createdAt)
                      : "לא זמין"}
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    <IconButton
                      onClick={() => handleViewContact(contact)}
                      size="small"
                      className={styles.iconButton}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleUpdateStatus(contact)}
                      size="small"
                      className={styles.iconButton}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteContact(contact)}
                      size="small"
                      color="error"
                      className={styles.deleteIconButton}
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
        className={styles.dialog}
      >
        <DialogTitle className={styles.dialogTitle}>
          פרטי הודעת יצירת קשר
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          {selectedContact && (
            <Box className={styles.viewContactBox}>
              <Typography variant="h6" className={styles.viewContactSubject}>
                {selectedContact.subject || "אין נושא"}
              </Typography>
              <Typography variant="body2" className={styles.viewContactDetail}>
                <strong>שם:</strong> {selectedContact.name || "לא צוין"}
              </Typography>
              <Typography variant="body2" className={styles.viewContactDetail}>
                <strong>אימייל:</strong> {selectedContact.email || "לא צוין"}
              </Typography>
              <Typography variant="body2" className={styles.viewContactDetail}>
                <strong>תאריך:</strong>{" "}
                {selectedContact.createdAt
                  ? formatDate(selectedContact.createdAt)
                  : "לא זמין"}
              </Typography>
              <Typography variant="body2" className={styles.viewContactDetail}>
                <strong>סטטוס:</strong>{" "}
                <Chip
                  label={selectedContact.status}
                  color={getStatusColor(selectedContact.status)}
                  size="small"
                />
              </Typography>
              <Typography variant="body1" className={styles.viewContactMessage}>
                <strong>הודעה:</strong>
              </Typography>
              <Paper className={styles.messagePaper}>
                <Typography className={styles.messageText}>
                  {selectedContact.message || "אין הודעה"}
                </Typography>
              </Paper>
              {selectedContact.adminNotes && (
                <>
                  <Typography
                    variant="body1"
                    className={styles.adminNotesTitle}
                  >
                    <strong>הערות מנהל:</strong>
                  </Typography>
                  <Paper className={styles.adminNotesPaper}>
                    <Typography className={styles.messageText}>
                      {selectedContact.adminNotes}
                    </Typography>
                  </Paper>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button
            onClick={() => setViewDialogOpen(false)}
            className={styles.cancelButton}
          >
            סגור
          </Button>
          {selectedContact && selectedContact.email && (
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              href={`mailto:${selectedContact.email}?subject=Re: ${
                selectedContact.subject || ""
              }`}
              className={styles.replyButton}
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
        className={styles.dialog}
      >
        <DialogTitle className={styles.dialogTitle}>
          עדכון סטטוס הודעה
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <Box className={styles.statusUpdateBox}>
            <FormControl className={styles.statusFormControl}>
              <InputLabel sx={labelProps.style}>סטטוס</InputLabel>
              <Select
                value={newStatus}
                label="סטטוס"
                onChange={(e) => setNewStatus(e.target.value)}
                className={styles.select}
              >
                <MenuItem value="חדש">חדש</MenuItem>
                <MenuItem value="נקרא">נקרא</MenuItem>
                <MenuItem value="נענה">נענה</MenuItem>
                <MenuItem value="טופל">טופל</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="הערות מנהל"
              multiline
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="הוסף הערות על הטיפול בהודעה..."
              className={styles.notesField}
            />
          </Box>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button
            onClick={() => setStatusDialogOpen(false)}
            className={styles.cancelButton}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            onClick={confirmStatusUpdate}
            className={styles.confirmButton}
          >
            עדכן
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        className={styles.dialog}
      >
        <DialogTitle className={styles.dialogTitle}>מחיקת הודעה</DialogTitle>
        <DialogContent className={styles.deleteDialogContent}>
          <Typography>
            האם אתה בטוח שברצונך למחוק הודעה זו? פעולה זו לא ניתנת לביטול.
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
            variant="contained"
            color="error"
            onClick={confirmDelete}
            className={styles.deleteConfirmButton}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminContactsWithCSSModules;
