// ==========================================
// ฐานข้อมูลอาหารและสารอาหาร วิทยาศาสตร์ ป.6
// AR NutriQuest Data Engine
// ==========================================

export const NUTRIENT_GROUPS = {
  protein: {
    id: 'protein',
    nameTh: 'โปรตีน (Protein)',
    shortName: 'โปรตีน',
    color: '#FF6B6B',
    bgColor: 'rgba(255, 107, 107, 0.15)',
    icon: '🥩',
    givesEnergy: true,
    energyPerGram: 4,
    benefit: 'เสริมสร้างการเจริญเติบโตของร่างกาย ซ่อมแซมส่วนที่สึกหรอ สร้างกล้ามเนื้อและภูมิคุ้มกัน',
    sources: 'เนื้อสัตว์ นม ไข่ ถั่วเมล็ดแห้ง เต้าหู้ งา',
    deficiencyDisease: 'ร่างกายแคระแกร็น ภูมิต้านทานต่ำ แผลหายช้า (โรคควาชิออร์กอร์)'
  },
  carb: {
    id: 'carb',
    nameTh: 'คาร์โบไฮเดรต (Carbohydrate)',
    shortName: 'คาร์โบไฮเดรต',
    color: '#FFA94D',
    bgColor: 'rgba(255, 169, 77, 0.15)',
    icon: '🍚',
    givesEnergy: true,
    energyPerGram: 4,
    benefit: 'ให้พลังงานหลักและความอบอุ่นแก่ร่างกาย ช่วยในการทำงานของสมองและกล้ามเนื้อ',
    sources: 'ข้าว แป้ง ขนมปัง น้ำตาล เผือก มัน ก๋วยเตี๋ยว',
    deficiencyDisease: 'ร่างกายอ่อนเพลีย ไม่มีแรง น้ำหนักลด ทำงานได้ไม่เต็มที่'
  },
  fat: {
    id: 'fat',
    nameTh: 'ไขมัน (Fat / Lipid)',
    shortName: 'ไขมัน',
    color: '#FFD43B',
    bgColor: 'rgba(255, 212, 59, 0.15)',
    icon: '🥑',
    givesEnergy: true,
    energyPerGram: 9,
    benefit: 'ให้พลังงานสูงที่สุดและให้ความอบอุ่นแก่ร่างกาย เป็นตัวทำละลายวิตามิน A, D, E, K',
    sources: 'น้ำมันพืช เนย กะทิ ชีส น้ำมันหมู ถั่วเปลือกแข็ง',
    deficiencyDisease: 'ร่างกายผอมแห้ง ผิวหนังลอก ขาดวิตามิน A D E K และรู้สึกหนาวง่าย'
  },
  vitamin: {
    id: 'vitamin',
    nameTh: 'วิตามิน (Vitamin)',
    shortName: 'วิตามิน',
    color: '#51CF66',
    bgColor: 'rgba(81, 207, 102, 0.15)',
    icon: '🍊',
    givesEnergy: false,
    energyPerGram: 0,
    benefit: 'ช่วยควบคุมการทำงานของอวัยวะต่างๆ ให้เป็นปกติ สร้างภูมิต้านทานโรค บำรุงผิวพรรณและสายตา',
    sources: 'ผักใบเขียว ผลไม้รสเปรี้ยว ผลไม้หลากสี ตับ ไข่แดง',
    deficiencyDisease: 'เจ็บป่วยง่าย ขาดวิตามินเฉพาะชนิด เช่น เลือดออกตามไรฟัน ตาฟาง เหน็บชา'
  },
  mineral: {
    id: 'mineral',
    nameTh: 'เกลือแร่ / แร่ธาตุ (Minerals)',
    shortName: 'เกลือแร่',
    color: '#339AF0',
    bgColor: 'rgba(51, 154, 240, 0.15)',
    icon: '🥦',
    givesEnergy: false,
    energyPerGram: 0,
    benefit: 'ช่วยให้ร่างกายทำงานปกติ เสริมสร้างกระดูก ฟัน และเม็ดเลือดแดง รักษาสมดุลกรด-ด่าง',
    sources: 'ผักต่างๆ อาหารทะเล สาหร่าย เกลือ นม ไข่',
    deficiencyDisease: 'โรคคอพอก (ขาดไอโอดีน), โลหิตจาง (ขาดธาตุเหล็ก), กระดูกพรุน (ขาดแคลเซียม)'
  },
  water: {
    id: 'water',
    nameTh: 'น้ำ (Water)',
    shortName: 'น้ำ',
    color: '#22B8CF',
    bgColor: 'rgba(34, 184, 207, 0.15)',
    icon: '💧',
    givesEnergy: false,
    energyPerGram: 0,
    benefit: 'เป็นส่วนประกอบหลักของร่างกาย ควบคุมอุณหภูมิ ลำเลียงสารอาหารและขับถ่ายของเสีย',
    sources: 'น้ำดื่มสะอาด ผลไม้ฉ่ำน้ำ น้ำแกง',
    deficiencyDisease: 'ภาวะขาดน้ำ ปากแห้ง ผิวแห้ง ท้องผูก และไตทำงานหนัก'
  }
};

export const VITAMINS_GUIDE = {
  vitA: {
    nameTh: 'วิตามิน A',
    type: 'ละลายในไขมัน',
    benefit: 'บำรุงสายตา ช่วยการมองเห็นในที่มืด บำรุงผิวพรรณ',
    sources: 'มะละกอสุก แครอท ฟักทอง ผักบุ้ง ตับ ไข่แดง',
    deficiency: 'โรคตาบอดกลางคืน (Night Blindness) ตาฟาง ผิวแห้งตกสะเก็ด'
  },
  vitB1: {
    nameTh: 'วิตามิน B1',
    type: 'ละลายในน้ำ',
    benefit: 'บำรุงระบบประสาทและกล้ามเนื้อ ช่วยเผาผลาญคาร์โบไฮเดรต',
    sources: 'ข้าวกล้อง ข้าวซ้อมมือ ถั่ว ตับ ไข่ เนื้อหมู',
    deficiency: 'โรคเหน็บชา (Beriberi) อ่อนแรงที่แขนขา ชาตามปลายนิ้ว'
  },
  vitB2: {
    nameTh: 'วิตามิน B2',
    type: 'ละลายในน้ำ',
    benefit: 'บำรุงผิวหนังและเยื่อบุ บำรุงสายตา',
    sources: 'นม ไข่ โยเกิร์ต ผักใบเขียว ตับ ยีสต์',
    deficiency: 'โรคปากนกกระจอก (Angular Cheilitis) แผลที่มุมปาก ริมฝีปากแห้งแตก'
  },
  vitC: {
    nameTh: 'วิตามิน C',
    type: 'ละลายในน้ำ',
    benefit: 'เสริมภูมิคุ้มกัน ต้านหวัด บำรุงเหงือกและหลอดเลือด สร้างคอลลาเจน',
    sources: 'ส้ม มะนาว ฝรั่ง กีวี สตรอว์เบอร์รี มะเขือเทศ',
    deficiency: 'โรคเลือดออกตามไรฟัน (Scurvy) เป็นหวัดง่าย แผลหายช้า'
  },
  vitD: {
    nameTh: 'วิตามิน D',
    type: 'ละลายในไขมัน',
    benefit: 'ช่วยดูดซึมแคลเซียมและฟอสฟอรัส เสริมสร้างกระดูกและฟันให้แข็งแรง',
    sources: 'แสงแดดยามเช้า ปลาแซลมอน ตับ ไข่แดง นมเสริมวิตามินดี',
    deficiency: 'โรคกระดูกอ่อนในเด็ก (Rickets) กระดูกโก่ง ฟันผุง่าย'
  },
  vitE: {
    nameTh: 'วิตามิน E',
    type: 'ละลายในไขมัน',
    benefit: 'เป็นสารต้านอนุมูลอิสระ ชะลอการเสื่อมของเซลล์ บำรุงผิวพรรณ',
    sources: 'น้ำมันพืช ถั่วอัลมอนด์ อะโวคาโด เมล็ดทานตะวัน จมูกข้าวสาลี',
    deficiency: 'เม็ดเลือดแดงแตกง่าย ระบบประสาททำงานบกพร่อง ผิวแห้งกร้าน'
  },
  vitK: {
    nameTh: 'วิตามิน K',
    type: 'ละลายในไขมัน',
    benefit: 'ช่วยในการแข็งตัวของเลือด ทำให้เลือดหยุดไหลเมื่อเกิดบาดแผล',
    sources: 'ผักโขม บรอกโคลี ผักคะน้า กะหล่ำปลี ตับ น้ำมันถั่วเหลือง',
    deficiency: 'เลือดแข็งตัวช้า เลือดไหลไม่หยุดเมื่อมีบาดแผล'
  }
};

export const MINERALS_GUIDE = {
  calcium: {
    nameTh: 'แคลเซียม (Calcium)',
    benefit: 'เสริมสร้างกระดูกและฟัน ช่วยการหดตัวของกล้ามเนื้อและการแข็งตัวของเลือด',
    sources: 'นม ชีส โยเกิร์ต กุ้งแห้ง ปลาเล็กปลาน้อย ผักคะน้า เต้าหู้',
    deficiency: 'โรคกระดูกอ่อน กระดูกพรุน ฟันไม่แข็งแรง กล้ามเนื้อกระตุก'
  },
  iron: {
    nameTh: 'ธาตุเหล็ก (Iron)',
    benefit: 'เป็นส่วนประกอบสำคัญของฮีโมโกลบินในเม็ดเลือดแดง นำออกซิเจนไปทั่วร่างกาย',
    sources: 'ตับ เลือด เนื้อแดง ไข่แดง ผักใบเขียวเข้ม ถั่วดำ',
    deficiency: 'โรคโลหิตจาง (Anemia) อ่อนเพลีย หน้าซีด เหนื่อยง่าย วิงเวียนศีรษะ'
  },
  iodine: {
    nameTh: 'ไอโอดีน (Iodine)',
    benefit: 'สร้างฮอร์โมนไทรอยด์ ควบคุมการเจริญเติบโตและการพัฒนาการของสมอง',
    sources: 'อาหารทะเล กุ้ง หอย ปู ปลาหมึก เกลือเสริมไอโอดีน สาหร่าย',
    deficiency: 'โรคคอพอก (Goiter) ต่อมไทรอยด์โต เด็กมีสติปัญญาบกพร่อง (โรคเอ๋อ)'
  },
  phosphorus: {
    nameTh: 'ฟอสฟอรัส (Phosphorus)',
    benefit: 'ทำงานร่วมกับแคลเซียมในการสร้างกระดูกและฟัน ควบคุมสมดุลพลังงานในเซลล์',
    sources: 'เนื้อสัตว์ นม ไข่ เมล็ดธัญพืช ปลา ถั่ว',
    deficiency: 'กระดูกเปราะ ปวดกระดูก กล้ามเนื้ออ่อนแรง'
  },
  sodium: {
    nameTh: 'โซเดียม (Sodium)',
    benefit: 'ควบคุมสมดุลน้ำและความดันโลหิตในร่างกาย ช่วยการส่งสัญญาณประสาท',
    sources: 'เกลือแกง น้ำปลา ซอสปรุงรส อาหารหมักดอง (ควรบริโภคแต่พอดี)',
    deficiency: 'ความดันโลหิตต่ำ เป็นตะคริว กล้ามเนื้อเกร็ง แต่หากกินมากไปจะเสี่ยงโรคไตและความดันสูง'
  }
};

export const FOOD_ITEMS = [
  // 1. กลุ่มโปรตีนเด่น
  {
    id: 'grilled_chicken',
    nameTh: 'ไก่ย่าง / อกไก่',
    nameEn: 'Grilled Chicken',
    category: 'protein',
    primaryNutrient: 'protein',
    secondaryNutrients: ['mineral', 'fat'],
    calories: 165,
    portion: '100 กรัม',
    proteinGrams: 31,
    carbGrams: 0,
    fatGrams: 3.6,
    icon: '🍗',
    color: '#FF6B6B',
    shape: 'drumstick',
    vitamins: ['vitB1', 'vitB2'],
    minerals: ['phosphorus', 'iron'],
    labReaction: {
      iodine: 'เหลือง/น้ำตาล (ไม่เปลี่ยนสี - ไม่มีแป้ง)',
      biuret: 'เปลี่ยนเป็นสีม่วง (มีโปรตีนสูง)',
      paper: 'ไม่โปร่งแสง / โปร่งแสงเล็กน้อย'
    },
    funFact: 'อกไก่เป็นแหล่งโปรตีนชั้นยอด มีไขมันต่ำ เหมาะกับการสร้างกล้ามเนื้อของวัยเจริญเติบโต',
    cures: ['growth_stunt']
  },
  {
    id: 'salmon',
    nameTh: 'ปลาแซลมอน',
    nameEn: 'Salmon Fish',
    category: 'protein',
    primaryNutrient: 'protein',
    secondaryNutrients: ['fat', 'vitamin', 'mineral'],
    calories: 208,
    portion: '100 กรัม',
    proteinGrams: 20,
    carbGrams: 0,
    fatGrams: 13,
    icon: '🐟',
    color: '#FF8787',
    shape: 'fish',
    vitamins: ['vitD', 'vitB1', 'vitA'],
    minerals: ['phosphorus', 'iodine', 'calcium'],
    labReaction: {
      iodine: 'เหลือง/น้ำตาล (ไม่มีแป้ง)',
      biuret: 'เปลี่ยนเป็นสีม่วงเข้ม (มีโปรตีนสูง)',
      paper: 'โปร่งแสง (มีไขมันดีโอเมก้า 3)'
    },
    funFact: 'ปลาแซลมอนมีกรดไขมันโอเมก้า 3 ช่วยบำรุงสมอง และมีวิตามิน D ช่วยให้กระดูกแข็งแรง!',
    cures: ['rickets', 'growth_stunt']
  },
  {
    id: 'boiled_egg',
    nameTh: 'ไข่ต้ม',
    nameEn: 'Boiled Egg',
    category: 'protein',
    primaryNutrient: 'protein',
    secondaryNutrients: ['fat', 'vitamin', 'mineral'],
    calories: 75,
    portion: '1 ฟอง (50 กรัม)',
    proteinGrams: 7,
    carbGrams: 0.6,
    fatGrams: 5,
    icon: '🥚',
    color: '#FFE066',
    shape: 'egg',
    vitamins: ['vitA', 'vitB2', 'vitD'],
    minerals: ['iron', 'calcium', 'phosphorus'],
    labReaction: {
      iodine: 'เหลือง/น้ำตาล (ไม่มีแป้ง)',
      biuret: 'เปลี่ยนเป็นสีม่วงชัดเจน (ไข่ขาวคือโปรตีนบริสุทธิ์)',
      paper: 'ไข่แดงทำให้กระดาษโปร่งแสง'
    },
    funFact: 'ไข่ต้ม 1 ฟอง อุดมไปด้วยสารอาหารครบเกือบทุกชนิดยกเว้นวิตามิน C เด็ก ป.6 ควรกินวันละ 1 ฟอง',
    cures: ['growth_stunt', 'anemia', 'angular_cheilitis']
  },
  {
    id: 'fresh_milk',
    nameTh: 'นมสดรสจืด',
    nameEn: 'Fresh Milk',
    category: 'protein',
    primaryNutrient: 'protein',
    secondaryNutrients: ['mineral', 'water', 'vitamin'],
    calories: 120,
    portion: '1 กล่อง (200 มล.)',
    proteinGrams: 8,
    carbGrams: 10,
    fatGrams: 4,
    icon: '🥛',
    color: '#E9ECEF',
    shape: 'milk_carton',
    vitamins: ['vitB2', 'vitA', 'vitD'],
    minerals: ['calcium', 'phosphorus'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'เปลี่ยนเป็นสีม่วงอ่อน (มีโปรตีนเคซีน)',
      paper: 'มีรอยโปร่งแสงเล็กน้อย'
    },
    funFact: 'นมเป็นแหล่งแคลเซียมที่ดีที่สุด ช่วยให้เด็กวัย ป.6 ตัวสูงใหญ่และกระดูกฟันแข็งแรง ดื่มวันละ 1-2 แก้ว',
    cures: ['rickets', 'calcium_deficiency', 'angular_cheilitis']
  },
  {
    id: 'tofu',
    nameTh: 'เต้าหู้ขาว / เต้าหู้ไข่',
    nameEn: 'Soy Tofu',
    category: 'protein',
    primaryNutrient: 'protein',
    secondaryNutrients: ['mineral', 'carb'],
    calories: 80,
    portion: '100 กรัม',
    proteinGrams: 10,
    carbGrams: 2,
    fatGrams: 4,
    icon: '🧈',
    color: '#FFF9DB',
    shape: 'cube',
    vitamins: ['vitB1'],
    minerals: ['calcium', 'iron'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'เปลี่ยนเป็นสีม่วง (โปรตีนจากถั่วเหลือง)',
      paper: 'แทบไม่โปร่งแสง'
    },
    funFact: 'เต้าหู้ทำจากถั่วเหลือง ให้โปรตีนจากพืชคุณภาพสูงและแคลเซียมสูง ย่อยง่ายมาก',
    cures: ['growth_stunt', 'calcium_deficiency']
  },
  {
    id: 'shrimp_seafood',
    nameTh: 'กุ้งสด / อาหารทะเล',
    nameEn: 'Fresh Shrimp',
    category: 'protein',
    primaryNutrient: 'protein',
    secondaryNutrients: ['mineral', 'water'],
    calories: 85,
    portion: '100 กรัม',
    proteinGrams: 18,
    carbGrams: 0.5,
    fatGrams: 1,
    icon: '🦐',
    color: '#FFA8A8',
    shape: 'shrimp',
    vitamins: ['vitB12', 'vitE'],
    minerals: ['iodine', 'calcium', 'iron'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'เปลี่ยนเป็นสีม่วง (มีโปรตีน)',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'กุ้งและอาหารทะเลมีไอโอดีนสูงมาก ป้องกันโรคคอพอก และเสริมสร้างสติปัญญาให้ฉลาดสมวัย!',
    cures: ['goiter', 'growth_stunt']
  },

  // 2. กลุ่มคาร์โบไฮเดรตเด่น
  {
    id: 'jasmine_rice',
    nameTh: 'ข้าวสวยหอมมะลิ',
    nameEn: 'Cooked Rice',
    category: 'carb',
    primaryNutrient: 'carb',
    secondaryNutrients: ['protein', 'water'],
    calories: 130,
    portion: '1 ทัพพี (60 กรัม)',
    proteinGrams: 2.7,
    carbGrams: 28,
    fatGrams: 0.3,
    icon: '🍚',
    color: '#FFF',
    shape: 'bowl',
    vitamins: ['vitB1'],
    minerals: ['phosphorus'],
    labReaction: {
      iodine: 'เปลี่ยนจากสีน้ำตาลเป็นสีน้ำเงินเข้ม/ม่วงเข้มทันที! (มีแป้งสูงมาก)',
      biuret: 'ไม่เปลี่ยนสี (สารละลายยังคงเป็นสีฟ้า)',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'ข้าวเป็นอาหารหลักของคนไทย ให้พลังงานในการเรียนและการเล่นกีฬา เมื่อย่อยแล้วจะได้น้ำตาลกลูโคส',
    cures: ['fatigue']
  },
  {
    id: 'brown_rice',
    nameTh: 'ข้าวกล้อง / ข้าวซ้อมมือ',
    nameEn: 'Brown Rice',
    category: 'carb',
    primaryNutrient: 'carb',
    secondaryNutrients: ['vitamin', 'mineral', 'protein'],
    calories: 110,
    portion: '1 ทัพพี (60 กรัม)',
    proteinGrams: 3,
    carbGrams: 23,
    fatGrams: 0.9,
    icon: '🌾',
    color: '#D8B48D',
    shape: 'grain',
    vitamins: ['vitB1', 'vitB2', 'vitE'],
    minerals: ['iron', 'phosphorus'],
    labReaction: {
      iodine: 'เปลี่ยนเป็นสีน้ำเงินเข้ม/ม่วง (มีแป้ง)',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'ข้าวกล้องยังมีเยื่อหุ้มเมล็ดและจมูกข้าว จึงมีวิตามิน B1 สูง ป้องกันโรคเหน็บชาได้ดีกว่าข้าวขาว!',
    cures: ['beriberi', 'fatigue']
  },
  {
    id: 'whole_wheat_bread',
    nameTh: 'ขนมปังโฮลวีท',
    nameEn: 'Whole Wheat Bread',
    category: 'carb',
    primaryNutrient: 'carb',
    secondaryNutrients: ['protein', 'vitamin'],
    calories: 80,
    portion: '1 แผ่น (30 กรัม)',
    proteinGrams: 4,
    carbGrams: 14,
    fatGrams: 1,
    icon: '🍞',
    color: '#D97706',
    shape: 'bread',
    vitamins: ['vitB1', 'vitE'],
    minerals: ['iron'],
    labReaction: {
      iodine: 'เปลี่ยนเป็นสีน้ำเงินเข้ม (มีแป้งสาลี)',
      biuret: 'มีสีม่วงจางๆ จากกลูเตน',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'ขนมปังโฮลวีตมีใยอาหารสูง ทำให้อิ่มนานและช่วยระบบขับถ่ายได้ดีมาก',
    cures: ['fatigue', 'beriberi']
  },
  {
    id: 'steamed_corn',
    nameTh: 'ข้าวโพดหวานต้ม',
    nameEn: 'Sweet Corn',
    category: 'carb',
    primaryNutrient: 'carb',
    secondaryNutrients: ['vitamin', 'water'],
    calories: 90,
    portion: '1 ฝักเล็ก (100 กรัม)',
    proteinGrams: 3,
    carbGrams: 19,
    fatGrams: 1.2,
    icon: '🌽',
    color: '#FACC15',
    shape: 'corn',
    vitamins: ['vitA', 'vitB1', 'vitC'],
    minerals: ['phosphorus'],
    labReaction: {
      iodine: 'เปลี่ยนเป็นสีน้ำเงินแกมม่วง (มีแป้งและน้ำตาล)',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'ข้าวโพดมีสารลูทีนช่วยบำรุงสายตา และเป็นคาร์โบไฮเดรตเชิงซ้อนที่ให้พลังงานอย่างต่อเนื่อง',
    cures: ['fatigue', 'night_blindness']
  },
  {
    id: 'sweet_potato',
    nameTh: 'มันเทศสีส้ม / เผือก',
    nameEn: 'Sweet Potato',
    category: 'carb',
    primaryNutrient: 'carb',
    secondaryNutrients: ['vitamin', 'mineral'],
    calories: 86,
    portion: '1 หัวเล็ก (100 กรัม)',
    proteinGrams: 1.6,
    carbGrams: 20,
    fatGrams: 0.1,
    icon: '🍠',
    color: '#FB923C',
    shape: 'potato',
    vitamins: ['vitA', 'vitC', 'vitB6'],
    minerals: ['calcium'],
    labReaction: {
      iodine: 'เปลี่ยนเป็นสีน้ำเงินเข้ม (มีแป้งสูง)',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'มันเทศสีส้มมีเบต้าแคโรทีนสูงมาก ซึ่งร่างกายจะเปลี่ยนเป็นวิตามิน A ช่วยบำรุงสายตา!',
    cures: ['night_blindness', 'fatigue']
  },
  {
    id: 'noodles',
    nameTh: 'เส้นก๋วยเตี๋ยว / บะหมี่',
    nameEn: 'Noodles / Pasta',
    category: 'carb',
    primaryNutrient: 'carb',
    secondaryNutrients: ['protein', 'water'],
    calories: 140,
    portion: '1 ชาม (100 กรัม)',
    proteinGrams: 4,
    carbGrams: 28,
    fatGrams: 1,
    icon: '🍜',
    color: '#FEF08A',
    shape: 'noodles',
    vitamins: ['vitB1'],
    minerals: ['sodium'],
    labReaction: {
      iodine: 'เปลี่ยนเป็นสีน้ำเงินเข้มจัด (แป้งข้าวเจ้า/แป้งสาลี)',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'เส้นก๋วยเตี๋ยวแปรรูปมาจากแป้ง ให้พลังงานรวดเร็ว เหมาะสำหรับการทำกิจกรรม',
    cures: ['fatigue']
  },

  // 3. กลุ่มไขมันเด่น
  {
    id: 'olive_oil',
    nameTh: 'น้ำมันรำข้าว / น้ำมันมะกอก',
    nameEn: 'Healthy Plant Oil',
    category: 'fat',
    primaryNutrient: 'fat',
    secondaryNutrients: ['vitamin'],
    calories: 120,
    portion: '1 ช้อนโต๊ะ (14 กรัม)',
    proteinGrams: 0,
    carbGrams: 0,
    fatGrams: 14,
    icon: '🫒',
    color: '#A3E635',
    shape: 'oil_bottle',
    vitamins: ['vitE', 'vitK'],
    minerals: [],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี (สีเหลือง/น้ำตาลตามเดิม)',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'กระดาษกลายเป็นรอยโปร่งแสงถาวรแม้แห้งแล้ว! (ทดสอบไขมัน)'
    },
    funFact: 'ไขมันจากพืชไม่มีคอเลสเตอรอล และช่วยละลายวิตามิน A, D, E, K ให้ร่างกายดูดซึมไปใช้ได้',
    cures: ['fat_deficiency', 'dry_skin']
  },
  {
    id: 'avocado',
    nameTh: 'อะโวคาโด',
    nameEn: 'Avocado',
    category: 'fat',
    primaryNutrient: 'fat',
    secondaryNutrients: ['vitamin', 'mineral', 'water'],
    calories: 160,
    portion: 'ครึ่งลูก (100 กรัม)',
    proteinGrams: 2,
    carbGrams: 9,
    fatGrams: 15,
    icon: '🥑',
    color: '#65A30D',
    shape: 'avocado',
    vitamins: ['vitE', 'vitK', 'vitC', 'vitB6'],
    minerals: ['calcium', 'phosphorus'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ถูบนกระดาษแล้วทำให้กระดาษโปร่งแสง (มีไขมันไม่อิ่มตัว)'
    },
    funFact: 'อะโวคาโดเป็นผลไม้ที่มีไขมันดีไม่อิ่มตัวสูงมาก ช่วยบำรุงหัวใจและมีวิตามิน E บำรุงผิวพรรณ',
    cures: ['dry_skin', 'vitamin_e_deficiency']
  },
  {
    id: 'almonds',
    nameTh: 'ถั่วอัลมอนด์ / เม็ดมะม่วงหิมพานต์',
    nameEn: 'Almonds & Nuts',
    category: 'fat',
    primaryNutrient: 'fat',
    secondaryNutrients: ['protein', 'mineral', 'vitamin'],
    calories: 160,
    portion: '1 กำมือ (28 กรัม)',
    proteinGrams: 6,
    carbGrams: 6,
    fatGrams: 14,
    icon: '🥜',
    color: '#B45309',
    shape: 'nut',
    vitamins: ['vitE', 'vitB2'],
    minerals: ['calcium', 'iron', 'phosphorus'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'ม่วงอ่อน (มีโปรตีนพืช)',
      paper: 'บดถูบนกระดาษเกิดรอยโปร่งแสงชัดเจน'
    },
    funFact: 'ถั่วเปลือกแข็งมีทั้งไขมันดี วิตามิน E และโปรตีน ช่วยบำรุงสมองและความจำ',
    cures: ['dry_skin', 'growth_stunt']
  },
  {
    id: 'butter_cheese',
    nameTh: 'เนยสด / ชีส',
    nameEn: 'Butter / Cheddar Cheese',
    category: 'fat',
    primaryNutrient: 'fat',
    secondaryNutrients: ['protein', 'mineral', 'vitamin'],
    calories: 110,
    portion: '1 แผ่น (28 กรัม)',
    proteinGrams: 7,
    carbGrams: 0.4,
    fatGrams: 9,
    icon: '🧀',
    color: '#FDE047',
    shape: 'cheese_wedge',
    vitamins: ['vitA', 'vitD'],
    minerals: ['calcium', 'phosphorus'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'เปลี่ยนเป็นสีม่วง (มีโปรตีนจากนม)',
      paper: 'กระดาษโปร่งแสงชัดเจนมาก (มีไขมัน)'
    },
    funFact: 'ชีสทำจากนมเข้มข้น จึงให้ทั้งไขมัน โปรตีน และแคลเซียมสูง ควรทานในปริมาณที่พอดี',
    cures: ['rickets', 'calcium_deficiency']
  },

  // 4. กลุ่มวิตามินเด่น
  {
    id: 'orange',
    nameTh: 'ส้มสายน้ำผึ้ง',
    nameEn: 'Fresh Orange',
    category: 'vitamin',
    primaryNutrient: 'vitamin',
    secondaryNutrients: ['water', 'carb', 'mineral'],
    calories: 45,
    portion: '1 ผลกลาง (100 กรัม)',
    proteinGrams: 0.9,
    carbGrams: 11,
    fatGrams: 0.1,
    icon: '🍊',
    color: '#F97316',
    shape: 'orange',
    vitamins: ['vitC', 'vitA'],
    minerals: ['calcium'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง (มีน้ำระเหยหมด ไม่ทิ้งคราบมัน)'
    },
    funFact: 'ส้มอุดมไปด้วยวิตามิน C สูง ช่วยป้องกันโรคเลือดออกตามไรฟันและป้องกันหวัดได้ดีเยี่ยม',
    cures: ['scurvy', 'cold_immunity']
  },
  {
    id: 'guava',
    nameTh: 'ฝรั่งกิมจู',
    nameEn: 'Crispy Guava',
    category: 'vitamin',
    primaryNutrient: 'vitamin',
    secondaryNutrients: ['water', 'carb', 'mineral'],
    calories: 68,
    portion: '1 ผลกลาง (150 กรัม)',
    proteinGrams: 2.6,
    carbGrams: 14,
    fatGrams: 0.9,
    icon: '🍏',
    color: '#84CC16',
    shape: 'apple',
    vitamins: ['vitC', 'vitA'],
    minerals: ['calcium'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'ฝรั่งมีวิตามิน C สูงกว่าส้มถึง 4-5 เท่า! เป็นหนึ่งในผลไม้ที่มีวิตามิน C สูงที่สุดในโลก',
    cures: ['scurvy', 'cold_immunity']
  },
  {
    id: 'papaya',
    nameTh: 'มะละกอสุก',
    nameEn: 'Ripe Papaya',
    category: 'vitamin',
    primaryNutrient: 'vitamin',
    secondaryNutrients: ['water', 'carb'],
    calories: 50,
    portion: '6-8 ชิ้นคำ (120 กรัม)',
    proteinGrams: 0.5,
    carbGrams: 12,
    fatGrams: 0.1,
    icon: '🥭',
    color: '#FB923C',
    shape: 'fruit_slice',
    vitamins: ['vitA', 'vitC'],
    minerals: ['calcium'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'มะละกอสุกมีวิตามิน A และสารเบต้าแคโรทีนสูงมาก บำรุงสายตา ป้องกันตาบอดกลางคืน และมีเอนไซม์ช่วยย่อย',
    cures: ['night_blindness', 'scurvy']
  },
  {
    id: 'carrot',
    nameTh: 'แครอทสด',
    nameEn: 'Fresh Carrot',
    category: 'vitamin',
    primaryNutrient: 'vitamin',
    secondaryNutrients: ['mineral', 'water', 'carb'],
    calories: 41,
    portion: '1 หัว (100 กรัม)',
    proteinGrams: 0.9,
    carbGrams: 9.6,
    fatGrams: 0.2,
    icon: '🥕',
    color: '#EA580C',
    shape: 'carrot',
    vitamins: ['vitA', 'vitK', 'vitC'],
    minerals: ['calcium', 'phosphorus'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'แครอทสีส้มสดใสอุดมไปด้วยวิตามิน A ช่วยให้มองเห็นในที่สลัวได้ชัดเจน บำรุงเรตินาดวงตา',
    cures: ['night_blindness']
  },
  {
    id: 'banana',
    nameTh: 'กล้วยหอม / กล้วยน้ำว้า',
    nameEn: 'Banana',
    category: 'vitamin',
    primaryNutrient: 'carb',
    secondaryNutrients: ['vitamin', 'mineral', 'water'],
    calories: 90,
    portion: '1 ผล (100 กรัม)',
    proteinGrams: 1.1,
    carbGrams: 23,
    fatGrams: 0.3,
    icon: '🍌',
    color: '#FACC15',
    shape: 'banana',
    vitamins: ['vitB6', 'vitC'],
    minerals: ['phosphorus'],
    labReaction: {
      iodine: 'เปลี่ยนเป็นสีน้ำเงินอ่อน (มีแป้งเล็กน้อย)',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'กล้วยให้พลังงานทันที มีวิตามินบีและโพแทสเซียม ช่วยลดอาการเหนื่อยล้าของนักกีฬาและนักเรียน',
    cures: ['fatigue', 'angular_cheilitis']
  },

  // 5. กลุ่มเกลือแร่เด่น
  {
    id: 'broccoli',
    nameTh: 'บรอกโคลี',
    nameEn: 'Broccoli',
    category: 'mineral',
    primaryNutrient: 'mineral',
    secondaryNutrients: ['vitamin', 'water'],
    calories: 34,
    portion: '1 ถ้วย (100 กรัม)',
    proteinGrams: 2.8,
    carbGrams: 7,
    fatGrams: 0.4,
    icon: '🥦',
    color: '#16A34A',
    shape: 'broccoli',
    vitamins: ['vitC', 'vitK', 'vitA'],
    minerals: ['calcium', 'iron'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'บรอกโคลีเป็นสุดยอดผักที่มีแคลเซียมและธาตุเหล็กสูงมาก ช่วยสร้างกระดูกและเม็ดเลือดแดง',
    cures: ['calcium_deficiency', 'anemia', 'rickets']
  },
  {
    id: 'spinach_kale',
    nameTh: 'ผักคะน้า / ผักโขม',
    nameEn: 'Kale & Spinach',
    category: 'mineral',
    primaryNutrient: 'mineral',
    secondaryNutrients: ['vitamin', 'water'],
    calories: 28,
    portion: '1 ทัพพีสุก (100 กรัม)',
    proteinGrams: 2.5,
    carbGrams: 4,
    fatGrams: 0.5,
    icon: '🥬',
    color: '#15803D',
    shape: 'leaf',
    vitamins: ['vitA', 'vitC', 'vitK'],
    minerals: ['calcium', 'iron'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'ผักคะน้ามีแคลเซียมเทียบเท่านมสด 1 แก้ว และมีธาตุเหล็กป้องกันโรคโลหิตจาง',
    cures: ['anemia', 'calcium_deficiency', 'night_blindness']
  },
  {
    id: 'pork_liver',
    nameTh: 'ตับหมู / เลือดหมู',
    nameEn: 'Pork Liver',
    category: 'mineral',
    primaryNutrient: 'mineral',
    secondaryNutrients: ['protein', 'vitamin'],
    calories: 135,
    portion: '100 กรัม',
    proteinGrams: 21,
    carbGrams: 3.8,
    fatGrams: 3.6,
    icon: '🫀',
    color: '#881337',
    shape: 'liver',
    vitamins: ['vitA', 'vitB1', 'vitB2', 'vitB12'],
    minerals: ['iron', 'phosphorus'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'เปลี่ยนเป็นสีม่วงเข้มจัด (โปรตีนสูง)',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'ตับหมูเป็นแหล่งธาตุเหล็กและวิตามิน A อันดับหนึ่ง ช่วยรักษาโรคโลหิตจางได้อย่างรวดเร็ว!',
    cures: ['anemia', 'night_blindness', 'angular_cheilitis', 'beriberi']
  },
  {
    id: 'seaweed',
    nameTh: 'สาหร่ายทะเล / เกลือไอโอดีน',
    nameEn: 'Seaweed & Sea Salt',
    category: 'mineral',
    primaryNutrient: 'mineral',
    secondaryNutrients: ['vitamin', 'water'],
    calories: 45,
    portion: '1 แผ่น / 1 ช้อนชา',
    proteinGrams: 3,
    carbGrams: 5,
    fatGrams: 0.5,
    icon: '🍙',
    color: '#064E3B',
    shape: 'seaweed',
    vitamins: ['vitB12'],
    minerals: ['iodine', 'calcium', 'iron'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'สาหร่ายทะเลมีสารไอโอดีนสูงมาก ป้องกันโรคคอพอก และช่วยให้ต่อมไทรอยด์ทำงานปกติ',
    cures: ['goiter']
  },
  {
    id: 'small_fish',
    nameTh: 'ปลาเล็กปลาน้อย / กุ้งแห้ง',
    nameEn: 'Crispy Small Fish',
    category: 'mineral',
    primaryNutrient: 'mineral',
    secondaryNutrients: ['protein', 'fat'],
    calories: 150,
    portion: '50 กรัม',
    proteinGrams: 25,
    carbGrams: 0,
    fatGrams: 5,
    icon: '🐟',
    color: '#CBD5E1',
    shape: 'small_fish',
    vitamins: ['vitD'],
    minerals: ['calcium', 'phosphorus'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'เปลี่ยนเป็นสีม่วง (มีโปรตีน)',
      paper: 'โปร่งแสงเล็กน้อย'
    },
    funFact: 'การกินปลาเล็กปลาน้อยทั้งกระดูก ทำให้ได้รับแคลเซียมแบบเต็มๆ ป้องกันโรคกระดูกพรุนและฟันผุ',
    cures: ['calcium_deficiency', 'rickets']
  },

  // 6. กลุ่มน้ำเด่น
  {
    id: 'pure_water',
    nameTh: 'น้ำดื่มสะอาดบริสุทธิ์',
    nameEn: 'Clean Drinking Water',
    category: 'water',
    primaryNutrient: 'water',
    secondaryNutrients: ['mineral'],
    calories: 0,
    portion: '1 แก้ว (250 มล.)',
    proteinGrams: 0,
    carbGrams: 0,
    fatGrams: 0,
    icon: '💧',
    color: '#38BDF8',
    shape: 'water_glass',
    vitamins: [],
    minerals: [],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'เปียกชื้น เมื่อแห้งแล้วกระดาษกลับมาทึบแสงเหมือนเดิม'
    },
    funFact: 'น้ำเป็นสารอาหารที่ร่างกายขาดไม่ได้แม้แต่วันเดียว ร่างกายคนเรามีน้ำเป็นส่วนประกอบถึง 70% ควรดื่มวันละ 6-8 แก้ว',
    cures: ['dehydration', 'dry_skin']
  },
  {
    id: 'watermelon',
    nameTh: 'แตงโมฉ่ำน้ำ',
    nameEn: 'Juicy Watermelon',
    category: 'water',
    primaryNutrient: 'water',
    secondaryNutrients: ['vitamin', 'carb'],
    calories: 30,
    portion: '1 ชิ้นใหญ่ (100 กรัม)',
    proteinGrams: 0.6,
    carbGrams: 7.5,
    fatGrams: 0.1,
    icon: '🍉',
    color: '#EF4444',
    shape: 'watermelon',
    vitamins: ['vitA', 'vitC'],
    minerals: ['calcium'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'แตงโมประกอบด้วยน้ำบริสุทธิ์ถึง 92% ช่วยดับกระหาย คลายร้อน และเพิ่มความสดชื่นให้ร่างกาย',
    cures: ['dehydration']
  },
  {
    id: 'coconut_water',
    nameTh: 'น้ำมะพร้าวสด',
    nameEn: 'Fresh Coconut Water',
    category: 'water',
    primaryNutrient: 'water',
    secondaryNutrients: ['mineral', 'carb'],
    calories: 45,
    portion: '1 ลูก (200 มล.)',
    proteinGrams: 1,
    carbGrams: 9,
    fatGrams: 0.2,
    icon: '🥥',
    color: '#BAE6FD',
    shape: 'coconut',
    vitamins: ['vitC', 'vitB1'],
    minerals: ['sodium', 'calcium', 'phosphorus'],
    labReaction: {
      iodine: 'ไม่เปลี่ยนสี',
      biuret: 'ไม่เปลี่ยนสี',
      paper: 'ไม่โปร่งแสง'
    },
    funFact: 'น้ำมะพร้าวมีเกลือแร่ธรรมชาติทดแทนการสูญเสียเหงื่อจากการเล่นกีฬาได้ดีมาก',
    cures: ['dehydration']
  }
];

// ข้อมูลเคสโรคขาดสารอาหาร สำหรับโหมดคลินิกหมอน้อย ป.6
export const DEFICIENCY_CASES = [
  {
    id: 'scurvy',
    nameTh: 'โรคเลือดออกตามไรฟัน (ลักปิดลักเปิด)',
    nutrientNeeded: 'vitamin',
    specificSubstance: 'วิตามิน C',
    symptoms: 'เหงือกบวมแดง มีเลือดซึมตามไรฟันเวลาแปรงฟัน เป็นหวัดบ่อย แผลหายช้า',
    characterExpression: '🩸 ริมฝีปากและเหงือกมีเลือดซึม',
    cureFoodIds: ['orange', 'guava', 'papaya', 'carrot'],
    explanation: 'วิตามิน C ช่วยสร้างคอลลาเจน เสริมความแข็งแรงของหลอดเลือดฝอยและเหงือก พบมากในผลไม้รสเปรี้ยว เช่น ส้ม ฝรั่ง'
  },
  {
    id: 'beriberi',
    nameTh: 'โรคเหน็บชา',
    nutrientNeeded: 'vitamin',
    specificSubstance: 'วิตามิน B1',
    symptoms: 'มีอาการชาตามปลายมือปลายเท้า กล้ามเนื้อแขนขาไม่มีแรง รู้สึกเหมือนมีมดไต่',
    characterExpression: '🦵 เดินเซ ขาอ่อนแรง ชาตามปลายเท้า',
    cureFoodIds: ['brown_rice', 'pork_liver', 'whole_wheat_bread', 'boiled_egg'],
    explanation: 'วิตามิน B1 ช่วยในการทำงานของระบบประสาทและกล้ามเนื้อ พบมากในข้าวกล้อง ตับ และถั่ว'
  },
  {
    id: 'angular_cheilitis',
    nameTh: 'โรคปากนกกระจอก',
    nutrientNeeded: 'vitamin',
    specificSubstance: 'วิตามิน B2',
    symptoms: 'มีรอยแผลแตก เปื่อย แสบแดงที่มุมปากทั้งสองข้าง ริมฝีปากแห้งลอก',
    characterExpression: '👄 มุมปากมีแผลเปื่อยเจ็บแสบ',
    cureFoodIds: ['fresh_milk', 'boiled_egg', 'pork_liver', 'almonds'],
    explanation: 'วิตามิน B2 ช่วยบำรุงผิวหนังและเยื่อบุ พบมากในนม ไข่ และตับ'
  },
  {
    id: 'night_blindness',
    nameTh: 'โรคตาบอดกลางคืน (ตาฟาง)',
    nutrientNeeded: 'vitamin',
    specificSubstance: 'วิตามิน A',
    symptoms: 'พอมืดค่ำหรือเข้าที่สลัวจะมองไม่เห็น เดินชนสิ่งของ ตาแห้งเคืองตา',
    characterExpression: '👁️ มองไม่เห็นในที่มืด ขยี้ตาบ่อยๆ',
    cureFoodIds: ['carrot', 'papaya', 'pork_liver', 'sweet_potato', 'boiled_egg'],
    explanation: 'วิตามิน A บำรุงสายตาและสารรับแสงในเรตินา พบมากในผักผลไม้สีส้ม/เหลือง ตับ และไข่แดง'
  },
  {
    id: 'rickets',
    nameTh: 'โรคกระดูกอ่อน / กระดูกโก่ง',
    nutrientNeeded: 'vitamin',
    specificSubstance: 'วิตามิน D & แคลเซียม',
    symptoms: 'กระดูกขารับน้ำหนักไม่ไหว ขาโก่ง ฟันขึ้นช้าและผุง่าย ตัวเตี้ยกว่าเกณฑ์',
    characterExpression: '🦴 ขาโก่ง เดินลำบาก ปวดกระดูก',
    cureFoodIds: ['salmon', 'fresh_milk', 'boiled_egg', 'butter_cheese', 'small_fish'],
    explanation: 'วิตามิน D ช่วยดูดซึมแคลเซียมเข้าสู่กระดูกและฟัน พบในปลาแซลมอน ไข่แดง และแสงแดดยามเช้า'
  },
  {
    id: 'goiter',
    nameTh: 'โรคคอพอก',
    nutrientNeeded: 'mineral',
    specificSubstance: 'เกลือแร่ (ไอโอดีน)',
    symptoms: 'ต่อมไทรอยด์บริเวณลำคอด้านหน้าบวมโต อ่อนเพลีย ตัวบวม น้ำหนักขึ้นง่าย',
    characterExpression: '🧣 บริเวณคอด้านหน้าบวมพองโต',
    cureFoodIds: ['shrimp_seafood', 'seaweed', 'salmon'],
    explanation: 'ไอโอดีนจำเป็นต่อการผลิตฮอร์โมนไทรอยด์ พบมากในอาหารทะเลและเกลือเสริมไอโอดีน'
  },
  {
    id: 'anemia',
    nameTh: 'โรคโลหิตจาง',
    nutrientNeeded: 'mineral',
    specificSubstance: 'เกลือแร่ (ธาตุเหล็ก)',
    symptoms: 'หน้าซีด เปลือกตาด้านในซีด เหนื่อยง่าย วิงเวียนศีรษะ ใจสั่นเวลาออกกำลังกาย',
    characterExpression: '😵 ใบหน้าและริมฝีปากซีดขาว วิงเวียน',
    cureFoodIds: ['pork_liver', 'spinach_kale', 'boiled_egg', 'broccoli'],
    explanation: 'ธาตุเหล็กเป็นส่วนประกอบสำคัญของฮีโมโกลบินในเม็ดเลือดแดง พบมากในตับ เลือด และผักใบเขียวเข้ม'
  },
  {
    id: 'calcium_deficiency',
    nameTh: 'โรคกระดูกพรุน / ฟันผุง่าย',
    nutrientNeeded: 'mineral',
    specificSubstance: 'เกลือแร่ (แคลเซียม)',
    symptoms: 'กระดูกเปราะ หักง่าย ปวดเมื่อยตามข้อ ฟันโยกคลอนและผุกร่อน',
    characterExpression: '🦷 ฟันผุง่าย ปวดกระดูกและข้อ',
    cureFoodIds: ['fresh_milk', 'small_fish', 'spinach_kale', 'tofu', 'butter_cheese'],
    explanation: 'แคลเซียมสร้างความแข็งแรงให้กระดูกและฟัน เด็ก ป.6 กำลังเจริญเติบโตต้องการแคลเซียมสูงมาก'
  },
  {
    id: 'dehydration',
    nameTh: 'ภาวะขาดน้ำในร่างกาย',
    nutrientNeeded: 'water',
    specificSubstance: 'น้ำสะอาดบริสุทธิ์',
    symptoms: 'ปากแห้ง ลิ้นแห้ง ผิวหนังเหี่ยวย่น ปัสสาวะสีเข้ม วิงเวียนศีรษะ และเหนื่อยล้า',
    characterExpression: '🥵 กระหายน้ำ ปากแห้ง ผิวแห้งตึง',
    cureFoodIds: ['pure_water', 'watermelon', 'coconut_water'],
    explanation: 'น้ำเป็นองค์ประกอบ 70% ของร่างกาย ควบคุมอุณหภูมิและช่วยให้ระบบไหลเวียนเลือดทำงานได้'
  }
];

// ข้อมูลจำลองการทดลองวิทยาศาสตร์ ป.6
export const LAB_TESTS = [
  {
    id: 'iodine_starch',
    titleTh: 'การทดสอบแป้ง (Starch Test)',
    reagent: 'สารละลายไอโอดีน (Iodine Solution)',
    reagentColor: '#C05621', // น้ำตาลอมส้ม
    positiveColor: '#1E1B4B', // น้ำเงินเข้มแกมม่วง
    negativeColor: '#D97706', // สีน้ำตาลเหมือนเดิม
    positiveResultText: 'เปลี่ยนจากสีน้ำตาลเป็นสีน้ำเงินเข้มแกมม่วง',
    negativeResultText: 'ไม่เปลี่ยนสี (ยังคงเป็นสีน้ำตาลของไอโอดีน)',
    sciencePrinciple: 'โมเลกุลของแป้งจับกับไอโอดีนเกิดเป็นสารเชิงซ้อนสีน้ำเงินอมม่วง ข้าวและขนมปังจะให้ผลบวกชัดเจน',
    testableFoods: [
      { foodId: 'jasmine_rice', isPositive: true },
      { foodId: 'whole_wheat_bread', isPositive: true },
      { foodId: 'grilled_chicken', isPositive: false },
      { foodId: 'pure_water', isPositive: false },
      { foodId: 'sweet_potato', isPositive: true },
      { foodId: 'boiled_egg', isPositive: false }
    ]
  },
  {
    id: 'biuret_protein',
    titleTh: 'การทดสอบโปรตีน (Biuret Test)',
    reagent: 'สารละลายไบยูเรต (CuSO4 + NaOH)',
    reagentColor: '#38BDF8', // ฟ้าอ่อน
    positiveColor: '#8B5CF6', // สีม่วง
    negativeColor: '#38BDF8', // สีฟ้าตามเดิม
    positiveResultText: 'เปลี่ยนจากสีฟ้าเป็นสีม่วง',
    negativeResultText: 'ไม่เปลี่ยนสี (ยังคงเป็นสีฟ้า)',
    sciencePrinciple: 'ไอออนทองแดง (Cu2+) ทำปฏิกิริยากับพันธะเพปไทด์ในโปรตีนเกิดเป็นสารประกอบสีม่วง ไข่ขาว นม อกไก่ จะเปลี่ยนสีม่วง',
    testableFoods: [
      { foodId: 'boiled_egg', isPositive: true },
      { foodId: 'fresh_milk', isPositive: true },
      { foodId: 'grilled_chicken', isPositive: true },
      { foodId: 'jasmine_rice', isPositive: false },
      { foodId: 'pure_water', isPositive: false },
      { foodId: 'olive_oil', isPositive: false }
    ]
  },
  {
    id: 'paper_fat',
    titleTh: 'การทดสอบไขมัน (Translucent Paper Test)',
    reagent: 'กระดาษขาวซับมัน / กระดาษธรรมดา',
    reagentColor: '#F8FAFC',
    positiveColor: '#FDE047', // โปร่งแสง
    negativeColor: '#F8FAFC', // ทึบแสง
    positiveResultText: 'กระดาษเกิดรอยโปร่งแสงอย่างถาวร แสงส่องผ่านได้แม้แห้งแล้ว',
    negativeResultText: 'กระดาษทึบแสงเหมือนเดิม (ถ้าน้ำเปียก เมื่อแห้งจะทึบแสง)',
    sciencePrinciple: 'ไขมันจะแทรกตัวในเส้นใยกระดาษ ทำให้ดัชนีหักเหแสงเปลี่ยนไป กระดาษจึงโปร่งแสงถาวร',
    testableFoods: [
      { foodId: 'olive_oil', isPositive: true },
      { foodId: 'butter_cheese', isPositive: true },
      { foodId: 'avocado', isPositive: true },
      { foodId: 'jasmine_rice', isPositive: false },
      { foodId: 'pure_water', isPositive: false },
      { foodId: 'orange', isPositive: false }
    ]
  }
];

// คลังข้อสอบวิทยาศาสตร์ ป.6 เรื่องอาหารและสารอาหาร
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'สารอาหารประเภทใดให้พลังงานแก่ร่างกายมากที่สุด เมื่อคำนวณจากน้ำหนัก 1 กรัมเท่ากัน?',
    options: [
      'ก. โปรตีน (4 kcal/g)',
      'ข. คาร์โบไฮเดรต (4 kcal/g)',
      'ค. ไขมัน (9 kcal/g)',
      'ง. วิตามิน (0 kcal/g)'
    ],
    correctAnswer: 2,
    explanation: 'ไขมัน 1 กรัม ให้พลังงานสูงถึง 9 กิโลแคลอรี ขณะที่โปรตีนและคาร์โบไฮเดรตให้พลังงาน 4 กิโลแคลอรีต่อกรัม'
  },
  {
    id: 2,
    question: 'สารอาหารกลุ่มใดต่อไปนี้ "ไม่ให้พลังงาน" แก่ร่างกาย แต่มีความจำเป็นอย่างยิ่งต่อการมีชีวิต?',
    options: [
      'ก. โปรตีน คาร์โบไฮเดรต ไขมัน',
      'ข. วิตามิน เกลือแร่ น้ำ',
      'ค. คาร์โบไฮเดรต วิตามิน น้ำ',
      'ง. ไขมัน เกลือแร่ โปรตีน'
    ],
    correctAnswer: 1,
    explanation: 'วิตามิน เกลือแร่ และน้ำ เป็นสารอาหารที่ไม่ให้พลังงาน แต่ช่วยควบคุมการทำงานของระบบต่างๆ ให้เป็นปกติ'
  },
  {
    id: 3,
    question: 'นักเรียนคนหนึ่งมีอาการเลือดออกตามไรฟันเวลาแปรงฟัน แสดงว่าน่าจะขาดสารอาหารชนิดใด และควรรับประทานสิ่งใด?',
    options: [
      'ก. ขาดวิตามิน A ควรทานตับหมู',
      'ข. ขาดวิตามิน B1 ควรทานข้าวกล้อง',
      'ค. ขาดวิตามิน C ควรทานส้มหรือฝรั่ง',
      'ง. ขาดแคลเซียม ควรดื่มนม'
    ],
    correctAnswer: 2,
    explanation: 'โรคเลือดออกตามไรฟัน (ลักปิดลักเปิด) เกิดจากการขาดวิตามิน C ซึ่งมีมากในผลไม้รสเปรี้ยว เช่น ส้ม มะนาว ฝรั่ง'
  },
  {
    id: 4,
    question: 'การหยดสารละลายไอโอดีนลงในอาหารเพื่อทดสอบแป้ง หากอาหารมีแป้งจะเปลี่ยนเป็นสีใด?',
    options: [
      'ก. เปลี่ยนเป็นสีม่วง',
      'ข. เปลี่ยนเป็นสีน้ำเงินเข้มแกมม่วง',
      'ค. เปลี่ยนเป็นสีแดงอิฐ',
      'ง. เปลี่ยนเป็นสีเขียวมรกต'
    ],
    correctAnswer: 1,
    explanation: 'สารละลายไอโอดีน (เดิมสีน้ำตาล) เมื่อทำปฏิกิริยากับแป้งจะเปลี่ยนเป็นสีน้ำเงินเข้มแกมม่วง'
  },
  {
    id: 5,
    question: 'เด็กในวัยประถมศึกษาปีที่ 6 (อายุ 9-12 ปี) ต้องการพลังงานต่อวันประมาณเท่าใด?',
    options: [
      'ก. 800 - 1,000 กิโลแคลอรี',
      'ข. 1,500 - 1,700 กิโลแคลอรี',
      'ค. 2,500 - 3,000 กิโลแคลอรี',
      'ง. 3,500 - 4,000 กิโลแคลอรี'
    ],
    correctAnswer: 1,
    explanation: 'เด็กวัย 9-12 ปี (ป.6) มีการเจริญเติบโตและกิจกรรมมาก ต้องการพลังงานเฉลี่ยวันละ 1,500 - 1,700 kcal'
  },
  {
    id: 6,
    question: 'ข้อใดจับคู่วิตามินที่ละลายในน้ำ และวิตามินที่ละลายในไขมันได้ถูกต้อง?',
    options: [
      'ก. ละลายในน้ำ: A, D / ละลายในไขมัน: B, C',
      'ข. ละลายในน้ำ: B, C / ละลายในไขมัน: A, D, E, K',
      'ค. ละลายในน้ำ: A, B, C / ละลายในไขมัน: D, E, K',
      'ง. วิตามินทุกชนิดละลายในน้ำได้ทั้งหมด'
    ],
    correctAnswer: 1,
    explanation: 'วิตามินที่ละลายในน้ำได้แก่ วิตามิน B และ C ส่วนวิตามินที่ละลายในไขมันได้แก่ A, D, E, K'
  },
  {
    id: 7,
    question: 'หากมีอาการเหน็บชาตามปลายมือปลายเท้า ควรเลือกรับประทานอาหารชนิดใดเพื่อรักษา?',
    options: [
      'ก. ข้าวขัดขาวและน้ำอัดลม',
      'ข. ข้าวกล้อง ข้าวซ้อมมือ ถั่ว และตับ',
      'ค. ลูกอมและเยลลี่',
      'ง. น้ำมันพืชและเนย'
    ],
    correctAnswer: 1,
    explanation: 'โรคเหน็บชาเกิดจากการขาดวิตามิน B1 ข้าวกล้องและถั่วเป็นแหล่งวิตามิน B1 ชั้นยอด'
  },
  {
    id: 8,
    question: 'การทดสอบสารอาหารใดที่ใช้ "การถูลงบนกระดาษ" แล้วสังเกตความโปร่งแสง?',
    options: [
      'ก. โปรตีน',
      'ข. คาร์โบไฮเดรต',
      'ค. ไขมัน',
      'ง. วิตามิน'
    ],
    correctAnswer: 2,
    explanation: 'การทดสอบไขมันทำได้โดยการนำอาหารมาถูบนกระดาษขาว หากมีไขมัน กระดาษจะมีรอยโปร่งแสงถาวร'
  },
  {
    id: 9,
    question: 'สารอาหารประเภท "เกลือแร่ไอโอดีน" มีความสำคัญอย่างไรต่อร่างกายของเด็กวัยเรียน?',
    options: [
      'ก. ช่วยบำรุงสายตาในเวลากลางคืน',
      'ข. สร้างฮอร์โมนไทรอยด์ ป้องกันโรคคอพอก และช่วยพัฒนาการทางสมอง',
      'ค. ป้องกันโรคเลือดออกตามไรฟัน',
      'ง. ละลายวิตามิน A, D, E, K'
    ],
    correctAnswer: 1,
    explanation: 'ไอโอดีนช่วยสร้างฮอร์โมนไทรอยด์ ป้องกันโรคคอพอก และหากเด็กขาดไอโอดีนอาจเกิดภาวะสติปัญญาบกพร่อง (โรคเอ๋อ)'
  },
  {
    id: 10,
    question: 'ตามหลักธงโภชนาการ สัดส่วนอาหารกลุ่มใดที่ร่างกายควรรับประทานในปริมาณ "มากที่สุด" ในแต่ละวัน?',
    options: [
      'ก. กลุ่มข้าว-แป้ง',
      'ข. กลุ่มผักและผลไม้',
      'ค. กลุ่มเนื้อสัตว์ นม ไข่',
      'ง. กลุ่มน้ำมัน น้ำตาล เกลือ'
    ],
    correctAnswer: 0,
    explanation: 'ตามธงโภชนาการ กลุ่มข้าว-แป้งอยู่ชั้นบนสุดของพีระมิดรับประทานมากที่สุด (วันละ 8-12 ทัพพี) เพื่อให้พลังงานหลัก'
  }
];
