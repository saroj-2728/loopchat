"use server"
import connectToDatabase from "@/lib/mongodb";

async function connectDatabaseOnLanding () {
    await connectToDatabase()
}
export default connectDatabaseOnLanding;