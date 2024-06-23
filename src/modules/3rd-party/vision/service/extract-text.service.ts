import { Injectable } from '@nestjs/common';
import { T_DrugInfo, T_DrugRespose } from '../types/type';
import { VisionClient } from './vision.client';

@Injectable()
export class ExtractTextService {
    // 약물 관련 키워드를 상수로 분리
    private static readonly DRUG_KEYWORDS = ['정', '캡슐', 'mg', 'ml'];
    private static readonly DRUG_PATTERN = /\b(\d+mg|\d+정|\d+캡슐|\d+ml)\b/i;
    private static readonly DOSAGE_PATTERN = /\b\d+\s+\d+\s+\d+\b/;

    constructor(private readonly visionClient: VisionClient) {}

    /**
     * 이미지에서 텍스트를 추출하고 유용한 텍스트를 JSON 형태로 반환합니다.
     * @param image - 이미지 경로 또는 URL
     * @returns 유용한 텍스트 배열
     */
    async extractTextFromImage(image: string): Promise<T_DrugRespose[]> {
        const wholeText = await this.visionClient.visionAPI(image);
        return this.extractUsefulText(wholeText);
    }

    /**
     * 추출된 전체 텍스트에서 유용한 텍스트만 필터링하고 JSON 형태로 반환합니다.
     * @param wholeText - 전체 텍스트 배열
     * @returns 유용한 텍스트 배열
     */
    private extractUsefulText(wholeText: string[]): T_DrugRespose[] {
        const extractedData = wholeText
            .filter(text => text.length > 1)
            .map(text => this.extractDrugInfo(text))
            .filter(info => info !== null);

        return this.combineDrugAndDosage(extractedData);
    }

    /**
     * 텍스트에서 약물명 및 복용량 정보를 추출하여 JSON 형태로 반환합니다.
     * @param text - 검사할 텍스트
     * @returns 약물 정보 객체 또는 null
     */
    private extractDrugInfo(text: string): T_DrugInfo | null {
        if (this.hasNoSpecialChars(text)) {
            if (this.matchesDrugPattern(text) || this.containsKeyword(text)) {
                return { type: 'drug', text };
            } else if (this.matchesDosagePattern(text)) {
                return { type: 'dosage', text };
            }
        }
        return null;
    }

    /**
     * 텍스트에 특수 문자가 포함되어 있는지 확인합니다.
     * @param text - 검사할 텍스트
     * @returns 특수 문자 포함 여부
     */
    private hasNoSpecialChars(text: string): boolean {
        return !/[^a-zA-Z0-9가-힣\s]/.test(text);
    }

    /**
     * 텍스트가 약물 패턴에 맞는지 확인합니다.
     * @param text - 검사할 텍스트
     * @returns 패턴 일치 여부
     */
    private matchesDrugPattern(text: string): boolean {
        return ExtractTextService.DRUG_PATTERN.test(text);
    }

    /**
     * 텍스트에 약물 관련 키워드가 포함되어 있는지 확인합니다.
     * @param text - 검사할 텍스트
     * @returns 키워드 포함 여부
     */
    private containsKeyword(text: string): boolean {
        return ExtractTextService.DRUG_KEYWORDS.some(keyword => text.includes(keyword));
    }

    /**
     * 텍스트가 복용량 패턴에 맞는지 확인합니다.
     * @param text - 검사할 텍스트
     * @returns 복용량 패턴 일치 여부
     */
    private matchesDosagePattern(text: string): boolean {
        return ExtractTextService.DOSAGE_PATTERN.test(text);
    }

    /**
     * 약물 정보와 복용량 정보를 결합하여 최종 JSON 형태로 반환합니다.
     * @param extractedData - 추출된 약물 및 복용량 정보 배열
     * @returns 결합된 JSON 배열
     */
    private combineDrugAndDosage(extractedData: T_DrugInfo[]): T_DrugRespose[] {
        const result: T_DrugRespose[] = [];
        let currentDrug: T_DrugInfo | null = null;

        extractedData.forEach(item => {
            if (item.type === 'drug') {
                if (currentDrug) {
                    result.push({ drugName: currentDrug.text, dosage: null });
                }
                currentDrug = item;
            } else if (item.type === 'dosage' && currentDrug) {
                const [day, times, amount] = item.text.split(' ').map(Number);
                result.push({
                    drugName: currentDrug.text,
                    dosage: { day, times, amount }
                });
                currentDrug = null;
            }
        });

        if (currentDrug) {
            result.push({ drugName: currentDrug.text, dosage: null });
        }

        return result;
    }
}