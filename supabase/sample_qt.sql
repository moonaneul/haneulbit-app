-- 📖 이번 주 QT 다섯 개를 넣는 파일입니다.
--
-- 원래는 선생님이 앱의 '주간 템플릿' 화면에서 직접 쓰는 내용입니다.
-- 그 화면이 아직 서버에 연결되기 전이라, 아이들이 QT 화면을 바로 써 볼 수 있도록
-- 샘플을 넣어 둡니다. 나중에 선생님이 쓰신 내용으로 덮어쓰면 됩니다.
--
-- 실행할 때의 '이번 주'(월요일 시작)에 들어갑니다. 다음 주가 되면 다시 실행하세요.

insert into weekly_qt_templates (week_start_date, weekday, reference, verse, teacher_message, is_published)
values
  (date_trunc('week', current_date)::date, 'mon',
   '빌립보서 4장 13절',
   '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라.',
   '하늘빛 친구들, 오늘 어려운 일이 생겨도 혼자가 아니에요. 예수님이 주시는 힘을 믿고 작은 일부터 용기 내어 시작해 보아요! 🌱',
   true),
  (date_trunc('week', current_date)::date, 'tue',
   '시편 23편 1절',
   '여호와는 나의 목자시니 내게 부족함이 없으리로다.',
   '목자는 양을 하나하나 이름으로 불러요. 하나님도 우리 이름을 알고 계세요. 오늘 하루 나를 지켜 주시는 분을 떠올려 보아요 🐑',
   true),
  (date_trunc('week', current_date)::date, 'wed',
   '요한복음 13장 34절',
   '서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라.',
   '사랑은 마음보다 행동이에요. 오늘 친구 한 명에게 먼저 인사하거나 도와주는 걸로 시작해 볼까요? 💛',
   true),
  (date_trunc('week', current_date)::date, 'thu',
   '잠언 3장 5절',
   '너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라.',
   '내 생각만으로 답이 안 나올 때가 있죠. 그럴 때 기도로 먼저 물어보는 연습을 해 보아요 🙏',
   true),
  (date_trunc('week', current_date)::date, 'fri',
   '데살로니가전서 5장 18절',
   '범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라.',
   '한 주를 마치며 감사한 일 세 가지를 세어 보아요. 작은 것부터 찾으면 생각보다 많답니다 🌷',
   true)
on conflict (week_start_date, weekday) do nothing;

-- 잘 들어갔는지 확인 — 다섯 줄이 나오면 성공입니다.
select weekday, reference from weekly_qt_templates
where week_start_date = date_trunc('week', current_date)::date
order by case weekday when 'mon' then 1 when 'tue' then 2 when 'wed' then 3 when 'thu' then 4 else 5 end;
