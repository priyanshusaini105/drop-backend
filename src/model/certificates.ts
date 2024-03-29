import { model } from "mongoose";
import { Schema } from "mongoose";
import { Certificate as CertificateType, Extension } from "../app";

const pdfSchema = new Schema<Extension>({
    code: { type: String, required: true },
});

export const Certificate = model<Extension>("certificates", pdfSchema);