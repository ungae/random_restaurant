import { GoogleGenAI, Type } from "@google/genai";
import { Place, Filters, Coordinates, Language } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "A unique identifier for the place, like 'kakao:12345'" },
    name: { type: Type.STRING, description: "The name of the restaurant." },
    category: { type: Type.STRING, description: "The main category of the food (e.g., Korean, Italian, Cafe)." },
    phone: { type: Type.STRING, description: "The phone number of the restaurant, or null if not available." },
    location: {
      type: Type.OBJECT,
      properties: {
        latitude: { type: Type.NUMBER },
        longitude: { type: Type.NUMBER },
      },
      required: ['latitude', 'longitude']
    },
    address: { type: Type.STRING, description: "The full address of the restaurant." },
    distanceMeters: { type: Type.NUMBER, description: "The estimated distance in meters from the user." },
    priceBand: { type: Type.STRING, description: "The price range: 'cheap', 'normal', 'expensive', or 'unknown'." },
    rating: { type: Type.NUMBER, description: "The user rating, e.g., 4.5, or null if not available." },
    reviewCount: { type: Type.NUMBER, description: "The number of reviews, or null if not available." },
    photoUrl: { type: Type.STRING, description: `A URL for a placeholder image, like 'https://picsum.photos/800/600'.` },
    reason: { type: Type.STRING, description: "A short, enticing reason why this place was recommended for the user. (e.g., 'A hidden gem with amazing pasta that's just a short walk away!')" }
  },
  required: ['id', 'name', 'category', 'location', 'address', 'distanceMeters', 'priceBand', 'reason']
};

function buildPrompt(coordinates: Coordinates, filters: Filters, recentPlaceNames: string[], language: Language): string {
    const { latitude, longitude } = coordinates;
    const { pricePref, distancePref } = filters;
    const isKorean = language === 'ko';

    let distanceDescription = '';
    switch(distancePref) {
        case 'near': distanceDescription = isKorean ? "매우 가까운, 가급적 도보 15분 이내(약 1km)." : "very close, preferably within a 15-minute walk (around 1km)."; break;
        case 'normal': distanceDescription = isKorean ? "적당한 거리, 약 3km 이내." : "a reasonable distance, within about 3km."; break;
        case 'any': distanceDescription = isKorean ? "거리는 상관없지만 5km 이내의 흥미로운 곳 위주." : "any distance, but prioritize interesting options within 5km."; break;
    }

    let priceDescription = '';
    switch(pricePref) {
        case 'cheap': priceDescription = isKorean ? "저렴하고 가성비 좋은 곳." : "an affordable, budget-friendly place."; break;
        case 'normal': priceDescription = isKorean ? "표준적인, 적당한 가격대의 곳." : "a place with standard, moderate prices."; break;
        case 'expensive': priceDescription = isKorean ? "고급스럽거나 특별한 날에 갈 만한 레스토랑." : "a high-end or special occasion restaurant."; break;
        case 'any': priceDescription = isKorean ? "어떤 가격대든 괜찮음." : "any price range is acceptable."; break;
    }
    
    const excludedPlaces = recentPlaceNames.length > 0
        ? (isKorean ? `다음 장소들은 제외하고 추천해주세요: ${recentPlaceNames.join(', ')}.` : `Do not recommend any of the following places again: ${recentPlaceNames.join(', ')}.`)
        : (isKorean ? "첫 추천이라 제외할 곳이 없습니다." : "This is the first recommendation, so there's nothing to exclude.");
    
    const languageInstruction = isKorean
      ? "사용자를 위해 추천하는 매력적인 '이유(reason)'를 반드시 한국어로 생성해주세요."
      : "Generate a compelling 'reason' for the recommendation in English.";

    return `
      You are a helpful assistant that recommends a single, real-world restaurant in South Korea for a user who can't decide where to eat.
      
      User's current location:
      - Latitude: ${latitude}
      - Longitude: ${longitude}
      
      User's preferences:
      - Distance: ${distanceDescription}
      - Price: ${priceDescription}

      Exclusion List:
      - ${excludedPlaces}
      
      Your task is to find one great restaurant that fits these criteria. Be creative and pick something interesting. It must be a real place.
      Provide your response in a JSON format that strictly adheres to the provided schema.
      ${languageInstruction}
    `;
}


export const fetchRecommendation = async (
  coordinates: Coordinates,
  filters: Filters,
  recentPlaces: Place[],
  language: Language
): Promise<Place> => {
  const recentPlaceNames = recentPlaces.map(p => p.name);
  const prompt = buildPrompt(coordinates, filters, recentPlaceNames, language);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text;
    const recommendedPlace = JSON.parse(jsonString) as Place;
    
    // Fallback for photoUrl if Gemini doesn't provide one
    if (!recommendedPlace.photoUrl) {
      recommendedPlace.photoUrl = 'https://picsum.photos/800/600';
    }

    return recommendedPlace;
  } catch (error) {
    console.error("Error fetching recommendation from Gemini API:", error);
    throw new Error("GEMINI_FETCH_FAILED");
  }
};

export const fetchAddressFromCoordinates = async (
  coordinates: Coordinates,
  language: Language
): Promise<string> => {
  const { latitude, longitude } = coordinates;
  const isKorean = language === 'ko';

  const prompt = isKorean
    ? `좌표(위도: ${latitude}, 경도: ${longitude})에 해당하는 대한민국 주소를 간결하게 도로명 주소 형식으로 알려주세요. 예를 들어, '서울특별시 강남구 테헤란로 123' 처럼요. 다른 설명 없이 주소만 반환해주세요.`
    : `Provide a concise street address for the coordinates (latitude: ${latitude}, longitude: ${longitude}) in South Korea. For example, '123 Teheran-ro, Gangnam-gu, Seoul'. Return only the address string, with no other text.`;
    
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching address from Gemini API:", error);
    throw new Error("ADDRESS_FETCH_FAILED");
  }
};
