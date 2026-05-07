import { connect } from "mongoose";
import { logger } from "../logger";

const getConnection = async (connectionString: string) => {
  await connect(connectionString);
  logger.info("Database connected");
};

export { getConnection };
