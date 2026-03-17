import cloudinary from "@/lib/cloudinary";
import upload from "@/lib/upload/multer";
import { createMap } from "@/lib/db/queries.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to run upload middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

function uploadBufferToCloudinary(buffer, folder = "wheres-waldo") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      },
    );

    stream.end(buffer);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    await runMiddleware(req, res, upload.single("image"));
    const formData = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No image file uploaded" });
    }

    const uploadResult = await uploadBufferToCloudinary(req.file.buffer);
    const mapData = {
      name: formData.name ?? formData["level-name"],
      waldoCoordinates:
        formData.waldoCoordinates ?? formData["waldo-coordinates"],
      wendaCoordinates:
        formData.wendaCoordinates ?? formData["wenda-coordinates"],
      odlawCoordinates:
        formData.odlawCoordinates ?? formData["odlaw-coordinates"],
      wizardCoordinates:
        formData.wizardCoordinates ?? formData["wizard-coordinates"],
    };

    await createMap(mapData, uploadResult);

    return res.status(201).json({
      success: true,
      image: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
      },
      fields: req.body,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Upload failed",
    });
  }
}
