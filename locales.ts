import { PricePref, DistancePref } from './types';

export const translations = {
  ko: {
    header: {
      title: '맛집 랜덤 룰렛',
      subtitle: '버튼 하나로 오늘의 메뉴 결정!',
    },
    permissionPrompt: {
      title: '맛집 추천을 시작할까요?',
      description: '주변 맛집을 찾으려면 현재 위치 정보가 필요해요.<br/>위치 권한을 허용해주세요.',
      button: '내 주변 맛집 찾기',
      loading: '위치 찾는 중...',
    },
    locationDisplay: {
      currentAddress: '현재 주소',
      fetchingAddress: '주소 변환 중...',
      addressError: '주소를 가져올 수 없습니다.',
      relocateButton: '위치 새로고침',
      relocatingButton: '위치 찾는 중...',
    },
    filters: {
      price: '가격대',
      distance: '거리',
      priceOptions: {
        [PricePref.Any]: '상관없음',
        [PricePref.Cheap]: '저렴',
        [PricePref.Normal]: '보통',
        [PricePref.Expensive]: '비쌈',
      },
      distanceOptions: {
        [DistancePref.Any]: '상관없음',
        [DistancePref.Near]: '가까움',
        [DistancePref.Normal]: '조금 멀어도 OK',
      },
    },
    recommendationCard: {
      home: '홈으로',
      reroll: '다시 추천',
      directions: '길찾기',
      distance: (dist: string, time: number) => `약 ${dist} / 도보 ${time}분`,
      priceMap: {
        cheap: '저렴',
        normal: '보통',
        expensive: '비쌈',
        unknown: '정보 없음',
      },
    },
    loader: [
      "최적의 맛집을 찾고 있어요...",
      "AI가 열심히 고민 중입니다...",
      "숨겨진 맛집을 탐색합니다...",
      "거의 다 됐어요!",
      "맛있는 상상이 현실로!",
    ],
    errorDisplay: {
      title: '이런! 문제가 발생했어요',
      retry: '다시 시도하기',
      home: '홈으로',
    },
    app: {
      recommendButton: '오늘 뭐 먹지?',
      geolocationErrors: {
        permissionDenied: '권한이 거부되었습니다.',
        positionUnavailable: '위치를 확인할 수 없습니다.',
        timeout: '시간이 초과되었습니다.',
        unknown: '알 수 없는 오류가 발생했습니다.',
        prefix: '위치 정보를 가져올 수 없습니다. ',
      },
      recommendationError: '현재 위치를 알 수 없어 추천할 수 없습니다.',
      unknownError: '알 수 없는 오류가 발생했습니다.',
      geminiError: "추천을 받지 못했습니다. AI가 바쁜 것 같아요. 다시 시도해주세요.",
    },
    languageToggle: 'EN',
  },
  en: {
    header: {
      title: 'Restaurant Roulette',
      subtitle: 'Decide your menu with one button!',
    },
    permissionPrompt: {
      title: 'Ready for a recommendation?',
      description: 'We need your current location to find great restaurants near you.<br/>Please allow location access.',
      button: 'Find Restaurants Near Me',
      loading: 'Getting location...',
    },
    locationDisplay: {
      currentAddress: 'Current Address',
      fetchingAddress: 'Fetching address...',
      addressError: 'Could not fetch address.',
      relocateButton: 'Refresh Location',
      relocatingButton: 'Finding...',
    },
    filters: {
      price: 'Price Range',
      distance: 'Distance',
      priceOptions: {
        [PricePref.Any]: 'Any',
        [PricePref.Cheap]: 'Cheap',
        [PricePref.Normal]: 'Normal',
        [PricePref.Expensive]: 'Expensive',
      },
      distanceOptions: {
        [DistancePref.Any]: 'Any',
        [DistancePref.Near]: 'Near',
        [DistancePref.Normal]: 'A bit far is OK',
      },
    },
    recommendationCard: {
      home: 'Go Home',
      reroll: 'Reroll',
      directions: 'Directions',
      distance: (dist: string, time: number) => `Approx. ${dist} / ${time} min walk`,
      priceMap: {
        cheap: 'Cheap',
        normal: 'Normal',
        expensive: 'Expensive',
        unknown: 'No info',
      },
    },
    loader: [
      "Finding the perfect spot...",
      "The AI is thinking hard...",
      "Scouting for hidden gems...",
      "Almost there!",
      "Delicious ideas coming right up!",
    ],
    errorDisplay: {
      title: 'Oops! Something went wrong',
      retry: 'Retry',
      home: 'Go Home',
    },
    app: {
      recommendButton: 'What should I eat today?',
       geolocationErrors: {
        permissionDenied: 'Permission was denied.',
        positionUnavailable: 'Location is unavailable.',
        timeout: 'The request timed out.',
        unknown: 'An unknown error occurred.',
        prefix: 'Could not get location information. ',
      },
      recommendationError: 'Cannot recommend without knowing your current location.',
      unknownError: 'An unknown error occurred.',
      geminiError: "Failed to get a recommendation. The AI might be busy, please try again.",
    },
    languageToggle: '한국어',
  },
};