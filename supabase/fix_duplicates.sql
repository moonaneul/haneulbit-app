-- 🧹 같은 아이가 두 번 들어갔을 때 정리하는 파일입니다.
-- accounts.sql을 실수로 두 번 실행하면 이름이 두 개씩 생깁니다.
--
-- 이름이 겹치면 로그인할 때 누구인지 가릴 수 없어서 반드시 정리해야 합니다.
-- 같은 이름 중 먼저 들어온 한 명만 남기고 나머지를 지웁니다.

delete from students
where id in (
  select id from (
    select id, row_number() over (partition by name order by created_at, id) as rn
    from students
  ) ranked
  where rn > 1
);

-- 정리 결과 확인 — 아이 수와 서로 다른 이름 수가 같으면 성공입니다.
select count(*) as 전체인원, count(distinct name) as 서로다른이름 from students;
