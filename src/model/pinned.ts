import { model } from "mongoose";
import { Schema } from "mongoose";
import { IPinned } from "../app";

const PinnedSchema = new Schema<IPinned>({
    userId  : { type: [Schema.Types.ObjectId], required: true },
    productId: { type: String, required: true },
});

export const PinnedModel = model<IPinned>("Pinned", PinnedSchema);