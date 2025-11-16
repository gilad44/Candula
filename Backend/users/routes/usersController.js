const express = require("express");
const router = express.Router();
const { handleError } = require("../../utils/errorHandler");
const auth = require("../../auth/authService");
const {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  changeUserBizStatus,
  deleteUser,
  processGoogleAuth,
} = require("../services/usersService");

router.get("/", auth, async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return handleError(res, 403, "Authorization Error: Must be admin");
    }
    const users = await getUsers();
    return res.send(users);
  } catch (err) {
    return handleError(res, err.status || 500, err.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { _id, role } = req.user;
    if (_id !== id && role !== "admin") {
      handleError(
        res,
        403,
        "Authorization Error: Must be admin or the registered user"
      );
    }
    const user = await getUser(id);
    return res.send(user);
  } catch (err) {
    return handleError(res, err.status || 500, err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await registerUser(req.body);
    return res.status(201).send(user);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await loginUser(req.body);
    return res.send(user);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { _id, role } = req.user;
    const id = req.params.id;

    // Allow users to edit their own profile or admins to edit any profile
    if (_id !== id && role !== "admin") {
      return handleError(
        res,
        403,
        "Authorization Error: Must be admin or the registered user"
      );
    }

    const user = await updateUser(id, req.body);
    return res.send(user);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await changeUserBizStatus(id);
    return res.send(user);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});

router.patch("/:id/role", auth, async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return handleError(res, 403, "Authorization Error: Must be admin");
    }

    const id = req.params.id;
    const { role: newRole } = req.body;

    if (!newRole || !["admin", "user"].includes(newRole)) {
      return handleError(res, 400, "Invalid role. Must be 'admin' or 'user'");
    }

    const user = await updateUser(id, { role: newRole });
    return res.send(user);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await deleteUser(id);
    return res.send(user);
  } catch (err) {
    handleError(res, err.status || 500, err.message);
  }
});

router.post("/google-auth", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return handleError(res, 400, "Google credential is required");
    }

    const result = await processGoogleAuth(credential);

    return res.status(200).json({
      message: result.isNewUser
        ? "User registered successfully"
        : "Login successful",
      user: result.user,
      token: result.token,
      isNewUser: result.isNewUser,
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return handleError(res, err.status || 500, err.message);
  }
});

module.exports = router;
