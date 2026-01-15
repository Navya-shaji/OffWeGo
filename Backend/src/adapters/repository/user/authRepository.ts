import { OAuth2Client } from "google-auth-library";
import { UserModel } from "../../../framework/database/Models/userModel";
import { IAuthRepository } from "../../../domain/interface/UserRepository/IauthRepository";
import { User } from "../../../domain/entities/UserEntity";
import jwt from 'jsonwebtoken';


let client: OAuth2Client | null = null;

const getOAuthClient = (): OAuth2Client => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID environment variable is not set");
  }
  if (!client) {
    client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  return client;
};

export class AuthRepository implements IAuthRepository {
  async signupWithGoogle(googleToken: string): Promise<User> {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error("Google Client ID is not configured");
    }

    try {
      const oauthClient = getOAuthClient();

      // For debugging: decode without verification to see what's inside
      const decodedToken = jwt.decode(googleToken) as { aud?: string; iss?: string };
      console.log('Google Auth Debug:', {
        envClientId: process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + '...',
        tokenAudience: decodedToken?.aud,
        tokenIssuer: decodedToken?.iss,
        match: decodedToken?.aud === process.env.GOOGLE_CLIENT_ID
      });

      const ticket = await oauthClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new Error("Invalid Google token - missing email");
      }

      // First, check if user already exists
      const existingUser = await UserModel.findOne({ email: payload.email }).lean();

      let userDoc;
      if (existingUser) {
        // User exists - only update isGoogleUser flag, don't overwrite their profile image
        userDoc = await UserModel.findOneAndUpdate(
          { email: payload.email },
          {
            $set: {
              isGoogleUser: true,
              // Only update imageUrl if user doesn't have one set
              ...((!existingUser.imageUrl || existingUser.imageUrl === '') && payload.picture
                ? { imageUrl: payload.picture }
                : {})
            }
          },
          { new: true }
        ).lean();
      } else {
        // New user - create with Google profile picture
        userDoc = await UserModel.create({
          name: payload.name || payload.email?.split('@')[0] || 'User',
          email: payload.email,
          status: 'active',
          role: 'user',
          imageUrl: payload.picture || '',
          isGoogleUser: true,
        });
        userDoc = userDoc.toObject();
      }

      if (!userDoc) {
        throw new Error("User creation or retrieval failed");
      }
      return userDoc;
    } catch (error) {
      if (error.message) {
        throw error;
      }
      throw new Error(`Google authentication failed: ${error?.message || 'Unknown error'}`);
    }
  }
}
