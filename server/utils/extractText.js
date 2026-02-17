const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

const extractText = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".pdf") {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  throw new Error("Unsupported file type. Only PDF and DOCX are allowed.");
};

module.exports = { extractText };
