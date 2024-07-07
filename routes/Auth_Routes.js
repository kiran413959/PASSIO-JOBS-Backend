const express =require('express')
const router = express.Router()


const{
    signupget,
    signuppost,
    loginget,
    loginpost,
    homeget,
    resume_selectionget,
    resume_selectionpost,
    experienceget,
    experiencepost,
    QandAget,
    QandApost,
}=require('../controllers/Auth_Controller')


router

    .get('/signup',signupget)

    .post('/signup/:userType',signuppost)

    .get('/login',loginget)

    .post('/login',loginpost)

    .get('/home',homeget)

    .get('/resume_selection',resume_selectionget)

    .post('/resume_selection',resume_selectionpost)

    .get('/experience',experienceget)

    .post('/experience',experiencepost )

    .get('/Q&A',QandAget)

    .post('/Q&A',QandApost)



module.exports=router


