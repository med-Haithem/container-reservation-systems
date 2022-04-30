// Routes
import authModule from "../features/auth/auth.module";
import camionModule from "../features/camion/camion.module";
import reservationModule from "../features/reservation/reservation.module";
const { authRoute } = authModule;
const { camionRoute } = camionModule;
export const getRoutes = (app: any) => {
  app.use("/api/auth", authRoute);
  app.use("/api/camion", camionRoute);
  app.use("/api/reservation", reservationModule.reservationRouter);
};
