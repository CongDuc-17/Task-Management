// src/common/utils/cloudinary.util.ts
import cloudinary from '../../configs/upload.config';

// 1. Hàm upload từ Buffer
export const uploadImageFromBuffer = async (
	fileBuffer: Buffer,
	mimetype: string,
	folderName: string,
) => {
	// Chuyển buffer thành chuỗi Data URI
	const b64 = fileBuffer.toString('base64');
	const dataURI = `data:${mimetype};base64,${b64}`;

	const result = await cloudinary.uploader.upload(dataURI, {
		folder: folderName,
		resource_type: 'auto',
	});
	return result;
};

// 2. Hàm xóa ảnh (dùng cho Rollback hoặc xóa ảnh cũ)
export const deleteImageFromCloudinary = async (publicId: string) => {
	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.error(`[Cloudinary] Lỗi khi xóa ảnh có public_id ${publicId}:`, error);
	}
};

export const extractPublicIdFromUrl = (url: string): string | null => {
	try {
		// Ví dụ url: .../upload/v1776250045/TrelloLike_Avatars/hrytidb4njzgugv9733m.jpg
		const splitUrl = url.split('/');

		const filenameWithExt = splitUrl.pop(); // "hrytidb4njzgugv9733m.jpg"
		const folder = splitUrl.pop(); // "TrelloLike_Avatars"

		const filename = filenameWithExt?.split('.')[0]; // Lấy "hrytidb4njzgugv9733m" bỏ đuôi ".jpg"

		if (!folder || !filename) return null;

		return `${folder}/${filename}`; // Ghép lại thành: "TrelloLike_Avatars/hrytidb4njzgugv9733m"
	} catch (error) {
		console.error('Lỗi khi bóc tách public_id từ URL:', error);
		return null;
	}
};
