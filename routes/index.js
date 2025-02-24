import e from "express";
import{ userRouter} from "./userRoutes.js";
import { adminRouter} from "./adminRouter.js";
import { sellerRouter } from "./sellerRouter.js";
import { productRouter } from "./productRouter.js";
import { cartRouter } from "./cartRouter.js";
import {reviewRouter} from "./reviewRouter.js";

const router = e.Router();

router.use("/user",userRouter);
router.use("/admin", adminRouter);
router.use("/seller", sellerRouter);
router.use("/product", productRouter);
router.use("/cart", cartRouter);
router.use("/review", reviewRouter);

export {router as apiRouter};


