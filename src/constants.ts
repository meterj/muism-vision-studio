/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const SHAMANIC_KNOWLEDGE = {
  colors: [
    { id: 'blue', name: '청색 (Blue)', meaning: '동쪽, 탄생, 하늘, 생명의 기운', hex: '#0000FF' },
    { id: 'red', name: '홍색 (Red)', meaning: '남쪽, 땅, 강한 양기, 벽사(귀신을 쫓음)', hex: '#FF0000' },
    { id: 'yellow', name: '황색 (Yellow)', meaning: '중앙, 우주의 축, 신성함, 재물', hex: '#FFFF00' },
    { id: 'green', name: '연두색 (Light Green)', meaning: '조상의 보살핌, 생명력, 맑은 기운', hex: '#90EE90' },
    { id: 'jade', name: '옥색 (Jade)', meaning: '하늘의 감응, 신격의 고결함', hex: '#00A86B' },
    { id: 'peach', name: '분홍 (Peach)', meaning: '인연, 사랑, 구원의 서사', hex: '#FFDAB9' },
    { id: 'white', name: '백색 (White)', meaning: '서쪽, 정화, 결백, 신성함', hex: '#FFFFFF' },
    { id: 'purple', name: '자색 (Purple)', meaning: '신의 권위, 영적 깊이, 고귀함', hex: '#800080' }
  ],
  deities: [
    { 
      category: '가정 수호 (Household Guardians)',
      items: [
        { id: 'seongju', name: '성주신', meaning: '집안의 대주, 가옥의 수호와 번영', detailedDescription: '집의 대들보에 거주하며 가문의 운명을 관장하는 가장 높은 가택신입니다. 무신도에서는 상투를 틀고 인자한 미소를 지은 어르신의 모습으로 묘사됩니다.' },
        { id: 'jowang', name: '조왕신', meaning: '부엌의 감찰신, 가족의 건강과 안정', detailedDescription: '부엌의 불씨를 지키며 가족의 행실을 기록해 하늘에 보고하는 신입니다. 주로 정화수 한 그릇과 함께 묘사되며 여성적인 보살핌의 기운을 가집니다.' },
        { id: 'samshin', name: '삼신할머니', meaning: '생명 점지, 아이의 수호', detailedDescription: '아이의 탄생부터 7세까지의 성장을 책임지는 생명의 신입니다. 인자한 할머니의 모습이나 세 분의 여신(세존) 모습으로 나타납니다.' },
        { id: 'teoju', name: '터주대감', meaning: '집터의 주인, 재물과 안정', detailedDescription: '집이 서 있는 땅을 지키는 신으로, 업구렁이나 복두꺼비의 형상으로 인식되기도 하며 재물의 복을 관장합니다.' }
      ]
    },
    {
      category: '천문과 우주 (Celestial Powers)',
      items: [
        { id: 'chilseong', name: '칠성님', meaning: '수명장수, 자손 번창, 영험한 감응', detailedDescription: '북두칠성을 신격화한 존재로 인간의 수명과 운명을 결정합니다. 무속에서는 하얀 고깔을 쓴 신선의 모습으로 묘사되며 비와 구름을 관장하는 농경신의 성격도 가집니다.' },
        { id: 'cheonshin', name: '천신/상제', meaning: '하늘의 주재자, 절대적 질서' },
        { id: 'yongshin', name: '용왕님', meaning: '물의 주권자, 비와 풍요, 변신', detailedDescription: '바다와 강, 우물을 다스리는 신입니다. 위엄 있는 왕의 복식을 하고 용을 거느리거나 용을 타고 나타나며 부정함을 씻어내는 정화의 힘을 상징합니다.' },
        { id: 'sanshin', name: '산신령', meaning: '산의 주인, 지역 수호, 위엄', detailedDescription: '산을 지키는 영적 주인입니다. 주로 흰 수염을 길게 기르고 호랑이 옆에 앉아 산삼이나 지팡이를 든 모습으로 묘사되며 산의 정기를 상징합니다.' }
      ]
    },
    {
      category: '장군과 기세 (General Spirits)',
      items: [
        { id: 'janggun', name: '장군신 (예: 최영 장군)', meaning: '벽사, 강력한 수호, 원력', detailedDescription: '역사적으로 억울하게 돌아가셨거나 위대한 업적을 남긴 장군들이 신격화된 존재입니다. 화려한 갑옷과 신칼을 들고 작두를 타는 위엄 있는 모습으로 표현됩니다.' },
        { id: 'shinjang', name: '오방신장', meaning: '다섯 방위의 수호, 악귀 제압', detailedDescription: '동서남북과 중앙을 지키는 무장들입니다. 오방기(五方旗)의 색과 일치하는 갑옷을 입고 악한 기운을 칼로 쳐내는 역동적인 모습입니다.' },
        { id: 'daegam', name: '대감신', meaning: '재물 복, 호탕한 위엄, 권위' }
      ]
    },
    {
      category: '인도와 위무 (Guiding Spirits)',
      items: [
        { id: 'bari', name: '바리공주', meaning: '인도자, 희생, 서천꽃밭의 주인', detailedDescription: '한국 무속의 시조신 중 하나입니다. 부모의 병을 고치기 위해 서천서역국에서 생명초를 구해온 효녀이며, 망자의 넋을 맑게 씻겨 좋은 곳으로 인도합니다. 활옷을 입고 꽃방울을 든 모습이 특징입니다.' },
        { id: 'sashin', name: '저승사자', meaning: '운명의 집행, 인도, 엄격함' }
      ]
    }
  ],
  ritual_purposes: [
    { id: 'chibyeong', name: '치병 (Healing)', meaning: '질병의 퇴치와 건강 회복' },
    { id: 'jaesu', name: '재수 (Wealth)', meaning: '막힌 재물이 터지고 복이 들어옴' },
    { id: 'cheondo', name: '씻김/천도 (Guiding)', meaning: '망자의 한을 풀고 조상의 품으로 인도' },
    { id: 'byeoksa', name: '액막이 (Warding)', meaning: '살을 맞거나 나쁜 운이 들어오는 것을 차단' },
    { id: 'antaek', name: '안택 (Household Peace)', meaning: '집안의 기둥을 세우고 평안을 기원' },
    { id: 'jeomsa', name: '영적 소통 (Divination)', meaning: '신령의 말씀과 운명의 해석' }
  ],
  ritual_spaces: [
    { id: 'shindan', name: '신단/신당', meaning: '신령의 위패와 무신도가 모셔진 신성한 방' },
    { id: 'gutcheong', name: '굿청/마당', meaning: '오색 깃발이 날리고 무악이 울려 퍼지는 역동적 현장' },
    { id: 'seonangdang', name: '성황당/고개', meaning: '마을 입구 고목에 오색 천을 매단 수호의 공간' },
    { id: 'bashin', name: '바위/계곡', meaning: '산의 정기가 서린 자연 속 제장' }
  ],
  patterns: [
    { id: 'saljang', name: '살장 (Saljang)', meaning: '신성한 그물, 악기운 차단', description: '기하학적 마름모와 붉은 선의 반복', visualCharacteristics: '촘촘한 기하학적 선들이 악한 기운을 걸러내는 수호의 결계입니다. 붉은색과 검은색의 대비가 강합니다.' },
    { id: 'osaekcheon', name: '오색천 (Osaekcheon)', meaning: '신과 인간의 통로, 환희', description: '길게 늘어진 다섯 가지 색상의 비단 천', visualCharacteristics: '빨강, 파랑, 노랑, 하양, 초록의 천들이 바람에 흩날리며 역동적인 선을 만듭니다. 신령이 하강하는 통로를 상징합니다.' },
    { id: 'jijeon', name: '지전 (Jijeon)', meaning: '신성한 공양물, 영적 정화', description: '꽃 모양으로 오려낸 하얀 한지 뭉치', visualCharacteristics: '하얀 종이를 겹겹이 오려 만든 입체적인 꽃이나 엽전 모양입니다. 정결함과 정성을 상징합니다.' },
    { id: 'flower_pattern', name: '전통 꽃문양', meaning: '번영과 평화', description: '창살이나 무복에 쓰이는 꽃무늬' }
  ],
  mugu: [
    { id: 'obanggi', name: '오방기 (Obanggi)', meaning: '운세 판단, 신령의 응답', description: '다섯 가지 색깔의 깃발 묶음', visualCharacteristics: '빨강, 파랑, 노랑, 하양, 초록의 깃발입니다. 굿판에서 신령의 뜻을 묻는 가장 핵심적인 도구로 역동적인 색감이 강조됩니다.' },
    { id: 'fan', name: '일월선 (Fan)', meaning: '선신을 부르는 도구', description: '해와 달, 선녀가 그려진 부채', visualCharacteristics: '화려한 채색의 부채입니다. 신령을 즐겁게 하고 부정을 씻어내는 기류를 만듭니다.' },
    { id: 'bells', name: '방울 (Bells)', meaning: '신의 목소리, 떨림의 감응', description: '금속 방울 뭉치와 붉은 끈', visualCharacteristics: '날카롭고 맑은 금속성 소리를 냅니다. 떨림을 통해 영적 주파수를 맞추는 이미지가 강합니다.' },
    { id: 'myeongdu', name: '명두 (Mirror)', meaning: '신의 거울, 광명, 진리', description: '둥근 놋쇠 거울', visualCharacteristics: '태양처럼 빛을 반사하는 황동색 원형 거울입니다. 신의 눈을 상징하며 통찰의 기운을 담고 있습니다.' },
    { id: 'jakdu', name: '작두/신칼', meaning: '부정 타파, 강력한 원력', description: '날카로운 날을 가진 칼', visualCharacteristics: '차가운 금속의 질감과 베일 듯한 날의 위엄이 느껴집니다. 모든 나쁜 것들을 끊어내는 위압감이 특징입니다.' }
  ],
  taboos: [
    '불교 사찰(대웅전 등) 건축물 묘사 절대 금지',
    '불상, 석탑, 스님(가사 입은 모습) 묘사 절대 금지',
    '공포 영화식 좀비나 악마 연출 금지',
    '일본식 신사(Torii)나 무녀 복장 혼용 절대 금지',
    '중국식 도교 사원 포인트 혼용 금지',
    '무의미한 판타지풍 유럽 성전 비주얼 금지',
    '무속 행위를 조롱하거나 기괴하게 뒤트는 연출 금지'
  ]
};

export type ShamanicIntent = 
  | '보호/벽사' 
  | '복/재물' 
  | '치유/회복' 
  | '천도/추모' 
  | '안녕/가정 평화' 
  | '신내림/영적 교감'
  | '학업/합격'
  | '인연/사랑'
  | '사업/번창'
  | '정화/결계'
  | '승진/영전'
  | '태교/순산'
  | '여행/무사고'
  | '소원성취'
  | '건강/장수'
  | '금전/횡재'
  | '구설/차단'
  | '화합/조직'
  | '영감/창의'
  | '심신/안정'
  | '액운/소멸'
  | '귀인/상봉'
  | '터주/수호'
  | '명예/권위'
  | '승리/경쟁'
  | '꿈/해몽'
  | '용기/극복'
  | '지혜/통찰'
  | '매매/성사'
  | '화해/용서';

export const INTENT_CATEGORIES: Record<ShamanicIntent, any> = {
  '보호/벽사': {
    symbols: ['saljang', 'jakdu', 'shinjang'],
    colors: ['red', 'blue'],
    keywords: ['막아줘', '지켜줘', '나쁜 기운', '살풀이', '보호']
  },
  '복/재물': {
    symbols: ['jijeon', 'teoju', 'yellow'],
    colors: ['yellow', 'red'],
    keywords: ['돈', '복', '번창', '풍요', '행운']
  },
  '치유/회복': {
    symbols: ['jowang', 'green'],
    colors: ['green', 'white', 'jade'],
    keywords: ['치유', '회복', '건강', '살려내기', '재생']
  },
  '천도/추모': {
    symbols: ['bari', 'jijeon', 'white'],
    colors: ['white', 'jade', 'green'],
    keywords: ['보내기', '닦기', '좋은곳', '조상', '추모']
  },
  '안녕/가정 평화': {
    symbols: ['seongju', 'samshin', 'osaekcheon'],
    colors: ['yellow', 'blue', 'red'],
    keywords: ['가족', '집안', '평안', '화목', '정착']
  },
  '신내림/영적 교감': {
    symbols: ['obanggi', 'bells', 'myeongdu'],
    colors: ['red', 'blue', 'yellow', 'purple'],
    keywords: ['신령', '교감', '감응', '내림', '통치']
  },
  '학업/합격': {
    symbols: ['myeongdu', 'blue'],
    colors: ['blue', 'yellow', 'white'],
    keywords: ['공부', '합격', '시험', '명석', '성취']
  },
  '인연/사랑': {
    symbols: ['peach', 'samshin'],
    colors: ['peach', 'red', 'white'],
    keywords: ['사랑', '인연', '결혼', '만남', '매듭']
  },
  '사업/번창': {
    symbols: ['jijeon', 'teoju', 'jakdu'],
    colors: ['yellow', 'red', 'blue'],
    keywords: ['사업', '성공', '확장', '번영', '추진']
  },
  '정화/결계': {
    symbols: ['saljang', 'white', 'jade'],
    colors: ['white', 'jade', 'blue'],
    keywords: ['정화', '맑음', '결계', '청소', '정돈']
  },
  '승진/영전': {
    symbols: ['daegam', 'purple'],
    colors: ['purple', 'red', 'blue'],
    keywords: ['높이', '성공', '명예', '벼슬', '상승']
  },
  '태교/순산': {
    symbols: ['samshin', 'peach'],
    colors: ['peach', 'green', 'white'],
    keywords: ['아이', '태교', '순산', '생명', '보호']
  },
  '여행/무사고': {
    symbols: ['seonangdang', 'blue'],
    colors: ['blue', 'yellow', 'white'],
    keywords: ['여행', '안전', '무사고', '길', '무탈']
  },
  '소원성취': {
    symbols: ['obanggi', 'bells'],
    colors: ['red', 'blue', 'yellow', 'jade', 'purple'],
    keywords: ['소원', '성취', '바람', '이룸', '기도']
  },
  '건강/장수': {
    symbols: ['chilseong', 'green'],
    colors: ['green', 'jade', 'white'],
    keywords: ['장수', '건강', '무병', '오래', '무탈']
  },
  '금전/횡재': {
    symbols: ['jijeon', 'yellow'],
    colors: ['yellow', 'red', 'purple'],
    keywords: ['횡재', '금전', '로또', '대박', '이익']
  },
  '구설/차단': {
    symbols: ['jakdu', 'saljang'],
    colors: ['red', 'blue', 'white'],
    keywords: ['구설', '말', '차단', '평온', '입막음']
  },
  '화합/조직': {
    symbols: ['osaekcheon', 'yellow'],
    colors: ['yellow', 'blue', 'red'],
    keywords: ['화합', '단결', '협동', '조직', '융합']
  },
  '영감/창의': {
    symbols: ['fan', 'purple'],
    colors: ['purple', 'blue', 'white'],
    keywords: ['영감', '창의', '아이디어', '직관', '새로움']
  },
  '심신/안정': {
    symbols: ['jade', 'white'],
    colors: ['jade', 'green', 'white'],
    keywords: ['안정', '평온', '휴식', '명상', '복귀']
  },
  '액운/소멸': {
    symbols: ['jakdu', 'saljang', 'red'],
    colors: ['red', 'white', 'black'],
    keywords: ['액운', '소멸', '살', '제거', '청정']
  },
  '귀인/상봉': {
    symbols: ['yellow', 'blue'],
    colors: ['yellow', 'blue', 'peach'],
    keywords: ['귀인', '도움', '만남', '조력', '행운']
  },
  '터주/수호': {
    symbols: ['teoju', 'saljang'],
    colors: ['yellow', 'red', 'blue'],
    keywords: ['터주', '땅', '건물', '수호', '안정']
  },
  '명예/권위': {
    symbols: ['purple', 'daegam'],
    colors: ['purple', 'red', 'yellow'],
    keywords: ['명예', '권위', '위엄', '인정', '품격']
  },
  '승리/경쟁': {
    symbols: ['jakdu', 'red'],
    colors: ['red', 'blue', 'yellow'],
    keywords: ['승리', '이김', '우승', '돌파', '쟁취']
  },
  '꿈/해몽': {
    symbols: ['purple', 'myeongdu'],
    colors: ['purple', 'blue', 'white'],
    keywords: ['꿈', '해몽', '예지', '신호', '풀이']
  },
  '용기/극복': {
    symbols: ['jakdu', 'red'],
    colors: ['red', 'blue', 'white'],
    keywords: ['용기', '극복', '도전', '돌파', '의지']
  },
  '지혜/통찰': {
    symbols: ['myeongdu', 'jade'],
    colors: ['jade', 'blue', 'white'],
    keywords: ['지혜', '통찰', '명석', '판단', '이해']
  },
  '매매/성사': {
    symbols: ['jijeon', 'teoju'],
    colors: ['yellow', 'red', 'blue'],
    keywords: ['매매', '계약', '거래', '성립', '완료']
  },
  '화해/용서': {
    symbols: ['white', 'peach'],
    colors: ['white', 'peach', 'green'],
    keywords: ['화해', '용서', '화합', '풀림', '개선']
  }
};
