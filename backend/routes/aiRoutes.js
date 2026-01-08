import express from "express";
import { userAuth } from "../middleware/authMiddleware.js";
import { getPostIdeas, analyzeSentiment, chatWithAI } from "../controllers/aiController.js";
import { aiIdeaValidator, aiSentimentValidator, aiChatValidator } from "../validators/contentValidators.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/post-ideas", userAuth, aiIdeaValidator, validate, getPostIdeas);
router.post("/sentiment", userAuth, aiSentimentValidator, validate, analyzeSentiment);
router.post("/chat", userAuth, aiChatValidator, validate, chatWithAI);

export default router;
