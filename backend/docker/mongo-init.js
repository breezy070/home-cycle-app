db = db.getSiblingDB(process.env.MONGO_DB || "HomeCycleHome");
db.createUser({
  user: process.env.MONGO_USER || "hch_user",
  pwd:  process.env.MONGO_PASSWORD || "hch_pass",
  roles: [{ role: "readWrite", db: process.env.MONGO_DB || "HomeCycleHome" }]
});
