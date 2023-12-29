import User from '../model/user.js';

export async function findDuplicateUsername(username) {
   const userName = await User.findOne({ username: username });
   console.log(userName);
   if (userName) {
      return true;
   } else {
      return false;
   }
}

export async function findDuplicateEmail(email) {
   const userEmail = await User.findOne({ email: email });
   if (userEmail) {
      return true;
   } else {
      return false;
   }
}
