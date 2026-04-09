import { PrismaService } from '../database';
export class CardLabelsRepository {
	constructor(private readonly prismaService = new PrismaService()) {}

	async addLabelToCard(cardId: string, labelId: string) {
		return this.prismaService.cardLabels.create({
			data: {
				cardId: cardId,
				labelId: labelId,
			},
		});
	}

	async getLabelsByCardId(cardId: string) {
		return this.prismaService.cardLabels.findMany({
			where: {
				cardId: cardId,
			},
		});
	}

	async findLabelOnCard(cardId: string, labelId: string) {
		return this.prismaService.cardLabels.findFirst({
			where: {
				cardId: cardId,
				labelId: labelId,
			},
		});
	}
	async removeLabelFromCard(cardId: string, labelId: string) {
		return this.prismaService.cardLabels.deleteMany({
			where: {
				cardId: cardId,
				labelId: labelId,
			},
		});
	}
}
