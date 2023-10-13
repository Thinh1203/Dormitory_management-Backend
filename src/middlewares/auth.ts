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
      return done("you dont have permission to do this", false);
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
      const { user_id, role, fullName } = payload;
      const userManagerRepo = db.getRepository(Manager);
      const userManager = await userManagerRepo.findOne({ where: { id: user_id } });

      if (!userManager) {
        const userStudentRepo = db.getRepository(Student);
        const userStudent = await userStudentRepo.findOne({ where: { id: user_id } });
        
        if (
          !user_id || !role || !userStudent || !fullName || userStudent.id != user_id
        ) {
          return done("token is not valid!", false);
        }
        return done(null, { user_id, fullName, role });
      }


      if (
        !user_id || !role || !userManager || !fullName || userManager.id != user_id
      ) {
        return done("token is not valid!", false);
      }
      return done(null, { user_id, fullName, role });
    }
  )
);

export const verifyToken = () => {
  return passport.authenticate("jwt", { session: false });
};

export const require_admin = () => {
  return passport.authorize("authz", { failWithError: false });
};