import { model } from "mongoose";
import { Schema } from "mongoose";
import { Certificate as CertificateType, Extension } from "../app";

const pdfSchema = new Schema<Extension>({
    code: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
});

export const ExtensionModel = model<Extension>("Extension", pdfSchema);