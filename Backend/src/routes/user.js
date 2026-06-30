import  {Router} from  "express"
import {getUsers,signUpUser,logInUser} from "../controllers/userControlller.js"
const router=Router();
router.get('/', getUsers);
router.post('/',signUpUser);
router.post('/login',logInUser);

export default router;
 
