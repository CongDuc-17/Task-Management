// src/common/middlewares/upload.middleware.ts
import multer from 'multer';

// Sử dụng MemoryStorage để lưu file thẳng vào RAM dưới dạng Buffer
const storage = multer.memoryStorage();

export const uploadAvatarMiddleware = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('image/')) {
			cb(null, true);
		} else {
			cb(new Error('Chỉ cho phép tải lên định dạng hình ảnh.'));
		}
	},
});
