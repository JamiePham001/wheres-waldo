import cloudinary from "@/lib/cloudinary";
import { createMap } from "@/lib/db/queries.js";
import { NextResponse } from "next/server";

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

// Helper function to get form values with fallback keys
function getFormValue(formData, primaryKey, fallbackKey) {
  return formData.get(primaryKey) ?? formData.get(fallbackKey) ?? "";
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!formData) {
      return NextResponse.json(
        { success: false, error: "No form data provided" },
        { status: 400 },
      );
    }

    if (!(image instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No image file uploaded" },
        { status: 400 },
      );
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const uploadResult = await uploadBufferToCloudinary(imageBuffer);

    if (!uploadResult) {
      return NextResponse.json(
        { success: false, error: "Image upload failed" },
        { status: 500 },
      );
    }

    const mapData = {
      name: getFormValue(formData, "name", "level-name"),
      waldoCoordinates: getFormValue(
        formData,
        "waldoCoordinates",
        "waldo-coordinates",
      ),
      wendaCoordinates: getFormValue(
        formData,
        "wendaCoordinates",
        "wenda-coordinates",
      ),
      odlawCoordinates: getFormValue(
        formData,
        "odlawCoordinates",
        "odlaw-coordinates",
      ),
      wizardCoordinates: getFormValue(
        formData,
        "wizardCoordinates",
        "wizard-coordinates",
      ),
    };

    const map = await createMap(mapData, uploadResult);

    if (!map) {
      return NextResponse.json(
        { success: false, error: "Failed to create map" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        image: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
        },
        fields: Object.fromEntries(formData.entries()),
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Upload failed",
      },
      { status: 500 },
    );
  }
}
