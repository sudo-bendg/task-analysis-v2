import { connect } from "mongoose";

const getConnection = async (connectionString: string) => {
  await connect(connectionString);
  console.log("Database connected");
};

export { getConnection };
