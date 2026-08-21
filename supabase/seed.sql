-- 계정이 없어도 채울 수 있는 기준 데이터만 먼저 넣어 둡니다.
-- (schema.sql을 실행한 뒤 이 파일을 실행하세요)
-- armorShopData.ts의 ARMOR_ITEMS와 동일한 내용입니다.

insert into armor_catalog (id, emoji, name, price, description, color_hex) values
  ('helmet', '🪖', '구원의 투구', 50, '구원의 기쁨으로 생각을 지켜요.', '#FFF2C9'),
  ('shield', '🛡️', '믿음의 방패', 50, '어려움 앞에서도 믿음을 꼭 붙들어요.', '#EAF5F3'),
  ('sword', '🗡️', '성령의 검', 60, '하나님의 말씀으로 용기를 내요.', '#EEEAFB'),
  ('shoes', '👟', '평안의 신발', 40, '기쁜 소식을 전하러 힘차게 걸어요.', '#EAF4DE'),
  ('belt', '🎗️', '진리의 띠', 30, '언제나 정직하고 진실하게 말해요.', '#FFF0EA'),
  ('breastplate', '🦺', '의의 호신경', 40, '예수님의 바른 마음으로 행동해요.', '#FCE9EA'),
  ('sling', '🪨', '다윗의 물맷돌', 80, '작아도 하나님을 믿고 도전해요.', '#F2EEE9')
on conflict (id) do nothing;
