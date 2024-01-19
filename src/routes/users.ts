import { Router } from "express";
import { ILogin, IUser } from "../@types/user";
import { User } from "../database/model/user";
import {
  validateLogin,
  validateUserRegistration,
} from "../middleware/validation";
import { createUser, validateUser } from "../service/user-service";
import { isAdmin } from "../middleware/is-admin";
import { isAdminOrUser } from "../middleware/isAdmin";
import { isUser } from "../middleware/is-user";
import { validateToken } from "../middleware/validate-token";

const router = Router();

router.post("/", validateUserRegistration, async (req, res, next) => {
  try {
    const saved = await createUser(req.body as IUser);
    res.status(201).json({ message: "Saved", user: saved });
  } catch (err) {
    next(err);
  }
});

router.post("/login", validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body as ILogin;
    const jwt = await validateUser(email, password);
    res.json(jwt);
  } catch (e) {
    next(e);
  }
});

router.get("/", isAdmin, validateToken, async (req, res, next) => {
  try {
    const allUsers = await User.find();

    res.json(allUsers);
  } catch (e) {
    next(e);
  }
});

router.put(
  "/:id",
  isUser,
  validateUserRegistration,
  validateToken,
  async (req, res, next) => {
    try {
      const savedUser = await User.updateOne({ _id: req.params.id }, req.body);
      res.json({ message: "OK" });
    } catch (e) {
      next(e);
    }
  }
);

router.get("/:id", isAdminOrUser, validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = (await User.findById(id).lean()) as IUser;
    const { password, ...rest } = user!;
    return res.json({ user: rest });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", isAdminOrUser, validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    user.isBusiness = false;
    res.json(user);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", isAdminOrUser, validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteUser = await User.findOneAndDelete({ _id: id });
    return res.json(deleteUser);
  } catch (e) {
    next(e);
  }
});

export { router as usersRouter };
