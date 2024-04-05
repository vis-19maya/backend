const bcrypt = require('bcrypt');
const User = require('../../models/user');

//////////////register\\\\\\\\\\\\\\\\\
const registerUserCntrl =  async (req,res) => {
    try {
        console.log(req);
      if(!req.body) throw Error('Request body is empty');
      if(!req.body.email &&
         !req.body.password) throw Error('Request body is empty');

      const {
            email,
            firstName,
            lastName,
            password,
           } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email,
        firstName,
        lastName,
        password:hashedPassword
    });
    const savedUserToDb = await newUser.save();
    console.log('kjlhgfcd',savedUserToDb);
    if(!savedUserToDb) throw Error('Not able to save user, please try again later');
    res.status(200).send({
        message: "successFully registered the user"
    });
    } catch (error) {
        
        res.status(500).send({
             error: error.message, 
        });
    }
}


//////////////login\\\\\\\\\\\\\\\\\
const loginUserCntrl =  async (req,res) => {
    try {
      if(!req.body) throw Error('Request body is empty');
      if(!req.body.email && 
         !req.body.password) throw Error('Request body is empty');

      const {
            email,
            password,
           } = req.body;
    const userByEmail = await User.findOne({ email: email});
    if(!userByEmail) throw Error('user with the Given mail not found');
    const hashedPassword = await  bcrypt.compare(password, userByEmail.password)

    if(!hashedPassword) throw Error('Given password is incorrect, please try again later');
    res.status(200).send(userByEmail);
    } catch (error) {
        
        res.status(500).send({
             error: error.message, 
        });
    }
}



const getAllUser = async (req, res, next) => {
    try {
        const user = await User.find();
        if(!user) throw new Error('users not found');
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
};


//////////////////////forget//////////////////////////////////////////
const updateForget = async (req, res, next) => {
    try {
        console.log(req.body);
        if(!req.body) throw new Error('Body is required');
     
        const {
            email,
            newPassword
        } = req.body;
        

console.log(1);
console.log(email);
        const updatingUser = await User.findOne({email: email});
console.log(updatingUser);


            const hashedPassword = await bcrypt.hash(newPassword, 10);

            updatingUser.password = hashedPassword;

            const savedUserToDb = await updatingUser.save();
            console.log(3);

                res.status(200).send({
                    msg: 'User saved successfully'
                })
            
           
    } catch (error) {
        console.log(4);

        res.status(500).send({
            error: error.message
        });
    }
}


module.exports = {
   registerUserCntrl,
   loginUserCntrl,
   getAllUser,
   updateForget
}