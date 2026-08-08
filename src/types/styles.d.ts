// CSS Module을 import하면 클래스 이름과 문자열 값으로 구성된 객체를 받습니다.
declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

// global.css처럼 화면 전체에 적용하는 CSS 파일의 side-effect import를 허용합니다.
declare module '*.css';
