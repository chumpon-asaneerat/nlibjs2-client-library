const uuidv4 = require('uuid/v4');
let users = [];

const createUser = (name, pwd) => {
    let uniqId = uuidv4();
    let user = {
        tokenId: uniqId,
        username: name,
        password: pwd,
        isSignIn: false,
        lastAccess: null
    }
    return user;
}

const indexByName = (name) => {
    let names = users.map((user) => user.username )
    return names.indexOf(name)
}

const indexByToken = (tokenId) => {
    let tokens = users.map((user) => user.tokenId )
    return tokens.indexOf(tokenId)
}

const getUser = (idx) => {
    let ret = null;
    if (idx >= 0 && idx < users.length) ret = users[idx];
    return ret;
}

const register = (name, pwd) => {
    let ret = { status: '', message: '', user: null }
    let user = getUser(indexByName(name))
    if (user) {
        ret.status = 'failed';
        ret.message = 'register: user is already register.';
        ret.user = null;
    }
    else {
        user = createUser(name, pwd);
        users.push(user);
        ret.status = 'success';
        ret.message = 'register: successfully register user.';
        ret.user = user;
    }
    return ret;
}

const registerAsync = async (name, pwd) => {
    return new Promise(resolve => {
        setTimeout(() => { 
            let ret = register(name, pwd);
            resolve(ret)
        }, 2000)
    });
}

const signIn = (name, pwd) => {
    let ret = { status: '', message: '', user: null };
    let user = getUser(indexByName(name));
    if (user) {
        if (user.password === pwd) {
            // update flag and last access.
            user.isSignIn = true;
            user.lastAccess = new Date();

            ret.status = 'success';
            ret.message = 'sign in: successfully sign in.';
            ret.user = user;            
        }
        else {
            ret.status = 'failed';
            ret.message = 'sign in: invalid password.';
            ret.user = null;
        }
    }
    else {
        ret.status = 'failed';
        ret.message = 'sign in: user not found.';
        ret.user = null;
    }
    return ret;
}
const signOut = (tokenId) => {
    let ret = { status: '', message: '', user: null };
    let user = getUser(indexByToken(tokenId));
    if (user) {
        // update flag and last access.        
        user.isSignIn = false;
        
        ret.status = 'success';
        ret.message = 'sign out: successfully sign out.';
        ret.user = user;
    }
    else {
        ret.status = 'failed';
        ret.message = 'sign out: user with specificed token id not found.';
        ret.user = null;
    }
    return ret;
}

const getUsers = () => { return users; }

module.exports = exports = {
    register: register,
    registerAsync: registerAsync,
    signIn: signIn,
    signOut: signOut,
    getUsers: getUsers
}