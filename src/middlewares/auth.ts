import passport, { strategies } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import db from "../config/database.config";
import { Account } from "../models/account";
import { Student } from "../models/student";
import { Manager } from "../models/manager";

passport.use(
  "authz",
  new Strategy(
    {
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (payload, done) => {
     
      
      const { user_id, role } = payload;

      if (!user_id || !role) {
        return done("token is not valid!");
      }
      if (role === "admin") return done(null, payload);
      return done("you don't have permission to do this", false);
    }
  )
);

passport.use(
  new Strategy(
    {
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      // console.log(payload);
      const { user_id, role, mssv } = payload;
      const userManagerRepo = db.getRepository(Manager);
      const userManager = await userManagerRepo.findOne({ where: { id: user_id } });
      
      if (!userManager) {
        const userStudentRepo = db.getRepository(Student);
        const userStudent = await userStudentRepo.findOne({ where: { id: user_id } });
        
        if (
          !user_id || !role || !userStudent 
        ) {
          return done("token is not valid!", false);
        }
        return done(null, { user_id, mssv, role });
      }


      if (
        !user_id || !role || !userManager 
      ) {
        return done("token is not valid!", false);
      }
      return done(null, { user_id, mssv, role });
    }
  )
);

export const verifyToken = () => {
  return passport.authenticate("jwt", { session: false });
};

export const require_admin = () => {
  return passport.authorize("authz", { failWithError: false });
};