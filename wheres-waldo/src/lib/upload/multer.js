// method of pulling image metadata from the request body, and storing the image in memory for later upload to Cloudinary. This allows us to handle the file upload and metadata extraction in a single step, simplifying the process of handling image uploads in our application.
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

export default upload;
