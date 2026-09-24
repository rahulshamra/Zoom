import { Router } from "express"
import { getUsers, getCurrentUser, joinMeeting, getMeetings, getChatHistory, clearChatHistory, deleteChatMessage, signUpUser, logInUser, logOutUser } from "../controllers/userControlller.js"
import { authenticate } from "../middleware/auth.js";
const router = Router();
router.post('/', signUpUser);
router.post('/login', logInUser);
router.use(authenticate);
router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.post('/logout', logOutUser);
router.post('/meetings', joinMeeting);
router.get('/meetings', getMeetings);
router.get('/meetings/:meetingId/chat-history', getChatHistory);
router.delete('/meetings/:meetingId/chat-history', clearChatHistory);
router.delete('/meetings/:meetingId/chat-history/:messageId', deleteChatMessage);

export default router;
 
