
const { admin, db } = require('../util/admin');
const  config  = require('../util/config');

const firebase = require('firebase')

firebase.initializeApp(config);

const { validateSignUpData , validateLoginData, reduceUserDetails } = require('../util/validators');

exports.signup = (req, res)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    const { valid, errors } = validateSignUpData(newUser);
    if(!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png'
    
    //handle check
    let tokenUser , userId;
    db.doc(`/users/${newUser.handle}`)
    .get()
    .then(data => {
        if(data.exists){
            return res.status(400).json({ handle: 'This handle is already taken'});
        } else {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken()
    })
    .then( token => {
        tokenUser = token;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            userId: userId
        }
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(()=> {
        return res.status(201).json({tokenUser});
    })
    .catch(err => {
        console.log(err);
        if(err.code === 'auth/email-already-in-use'){
            return res.status(400).json({ email: 'Email already is in Use' })
        } else {
            return res.status(500).json({message: "Something went wrong! Please try again Later"})
        }
    });
}

exports.login = (req, res)=>{
    const user = {
        email: req.body.email,
        password: req.body.password,
    } 
    const { valid, errors} = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);  

    //Login logic
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({token});
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/user-not-found'){
            return res.status(400).json({ email: 'Email is not Registered' })
        } else if (err.code === 'auth/wrong-password'){
            return res.status(403).json({ general: 'Wrong Credentials' })
        }else {
            return res.status(500).json({error: err.code})
        }
    })
}

//Add User Details
exports.addUserDetails = (req, res) => {

    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then(()=>{
        return res.json({message: 'Updated Profile Successfully'});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: err.code})
    })
}


//Get User Details

exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
    .then( doc => {
        if(doc.exists){
            userData.credentials = doc.data();
            return db.collection('likes').where('userHandle','==', req.user.handle).get()
        }
    })
    .then( data => {
        userData.likes = [];
        data.forEach(doc => {
            userData.likes.push(doc.data());
        });
        return db.collection('notifications').where('recipient','==',req.user.handle)
            .orderBy('createdAt','desc').limit(10).get();
    })
    .then(data => {
        userData.notifications = [];
        data.forEach(doc => {
            userData.notifications.push({
                recipient: doc.data().recipient,
                sender: doc.data().sender,
                read: doc.data().read,
                screamId: doc.data().screamId,
                type: doc.data().type,
                createdAt: doc.data().createdAt,
                notificationId: doc.id
            })
        });
        return res.json(userData)
    })
    .catch(err=> {
        console.error(err);
        res.status(500).json({error: err.code})
    })
}

//Get User Details Public
exports.getUserDetails = (req, res) => {
    let userData = {}
    db.doc(`/users/${req.params.handle}`).get()
    .then(doc => {
        if(doc.exists){
            userData.user = doc.data();
            return db.collection('screams').where('userHandle','==',req.params.handle)
                .orderBy('createdAt','desc')
                .get();
        } else {
            return res.status(404).json({error: 'User not Found'})
        }
    })
    .then(data => {
        userData.screams = []
        data.forEach(doc => {
            userData.screams.push({
                body: doc.data().body,
                createdAt: doc.data().createdAt,
                userHandle: doc.data().userHandle,
                userImg: doc.data().userImg,
                likeCount: doc.data().likeCount,
                commentCount: doc.data().commentCount,
                screamId: doc.id
            })
        })
        return res.json(userData);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: err.code});
    })

}

//Upload User profile Image
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const fs = require('fs');
    const os = require('os');
    const path = require('path');

    const busboy = new BusBoy( { headers: req.headers } );

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file',(fieldname, file, filename, encoding, mimetype) => {

        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return res.status(400).json({ error: 'Wrong File Type'})
        }

        const imageExtension = filename.split('.')[filename.split('.').length -1]
        imageFileName = `${Math.round(Math.random()*1000000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype }
        file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on('finish', ()=> {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(()=>{
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
        })
        .then(()=> {
            return res.json({message: "Image Uploaded SuccessFully"});
        })
        .catch(err => {
            console.error(err);
        })
    });
    busboy.end(req.rawBody);
}

exports.markNotificationsRead = (req, res) => {
    let batch = db.batch()
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification,  { read: true});
    })
    batch.commit()
        .then(() => {
            return res.json({message: 'Notification Marked read'})
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.code});
        })
}