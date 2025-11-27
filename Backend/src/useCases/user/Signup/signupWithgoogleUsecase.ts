// import { UserModel } from "../../models/UserModel";
// import { User } from "../../entities/userEntity";

// export class GoogleSignupUseCase implements IGoogleSignupUseCase {
//   async execute(googleToken: string): Promise<User> {
//     // 1. Verify Google token
//     const googleUser = await verifyGoogleToken(googleToken);

//     // 2. Check if user exists
//     let user = await UserModel.findOne({ email: googleUser.email });

//     // 3. If not, create & save new user
//     if (!user) {
//       user = await UserModel.create({
//         name: googleUser.name,
//         email: googleUser.email,
//         role: "user",
//         fcmToken: "",
//       });
//     }

//     // 4. Return user (now _id exists)
//     return user;
//   }
// }
