import { useId } from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import ArmorLayers from './ArmorLayers';
import { ANCHORS, BODY_PALETTE as P, CANVAS, type EquippedArmor } from './characterParts';

interface HaneulCharacterProps {
  equipped?: EquippedArmor;
  /** 화면에 그려질 실제 크기 (기준 좌표계는 그대로 두고 비율만 조절합니다) */
  size?: number;
}

/**
 * 이모지를 쌓는 대신 부위별 레이어로 그리는 하늘빛 캐릭터입니다.
 * 몸 → 갑주 순서로 겹쳐 그리고, 모든 갑주는 characterParts의 앵커를 기준으로 붙습니다.
 */
export default function HaneulCharacter({ equipped = {}, size = 200 }: HaneulCharacterProps) {
  const height = (size / CANVAS.width) * CANVAS.height;
  // 빛의 용사 티어를 하나라도 착용하면 몸 전체에 은은한 아우라가 돕니다.
  const hasLightTier = Object.values(equipped).includes('light');
  // 웹에서는 SVG 그라데이션 id가 문서 전체에서 공유됩니다.
  // 화면 두 개가 동시에 떠 있을 때 서로의 그라데이션을 덮어쓰지 않도록 인스턴스마다 고유 id를 붙입니다.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  return (
    <Svg height={height} viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`} width={size}>
      <Defs>
        <RadialGradient id={`skinVol-${uid}`} cx="38%" cy="32%" r="72%">
          <Stop offset="0" stopColor="#FFE6CE" />
          <Stop offset="1" stopColor={P.skin} />
        </RadialGradient>
        <LinearGradient id={`tunicVol-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={P.tunic} />
          <Stop offset="0.55" stopColor={P.tunic} />
          <Stop offset="1" stopColor={P.tunicShade} />
        </LinearGradient>
        <RadialGradient id={`bodyGlow-${uid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#FFF6D2" stopOpacity="0.85" />
          <Stop offset="1" stopColor="#FFF6D2" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* 빛의 용사 아우라 */}
      {hasLightTier && <Ellipse cx={100} cy={140} rx={96} ry={124} fill={`url(#bodyGlow-${uid})`} />}

      {/* 다리 (몸보다 뒤에 그려 자연스럽게 이어지게 합니다) */}
      <G>
        <Rect x={84} y={188} width={14} height={46} rx={7} fill={P.skin} />
        <Rect x={102} y={188} width={14} height={46} rx={7} fill={P.skinShade} />
      </G>

      {/* 몸통 (크림색 옷) */}
      <Path
        d={`M${ANCHORS.body.x - 33} 148
            Q ${ANCHORS.body.x - 36} 118 ${ANCHORS.body.x} 116
            Q ${ANCHORS.body.x + 36} 118 ${ANCHORS.body.x + 33} 148
            L ${ANCHORS.body.x + 30} 196
            Q ${ANCHORS.body.x} 204 ${ANCHORS.body.x - 30} 196 Z`}
        fill={`url(#tunicVol-${uid})`}
      />
      {/* 옷자락 주름 — 갑옷을 벗어도 옷이 밋밋해 보이지 않게 하는 최소한의 표현입니다. */}
      <Path d="M100 124 L100 196" stroke={P.tunicShade} strokeWidth={2.4} opacity={0.6} />

      {/* 팔 */}
      <Path d="M72 134 Q 56 152 54 174" stroke={P.skin} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Path d="M128 134 Q 144 152 146 174" stroke={P.skinShade} strokeWidth={17} strokeLinecap="round" fill="none" />

      {/* 머리 */}
      <Circle cx={ANCHORS.head.x} cy={ANCHORS.head.y} r={ANCHORS.head.r} fill={`url(#skinVol-${uid})`} />

      {/* 머리카락 */}
      <Path
        d={`M${ANCHORS.head.x - 41} ${ANCHORS.head.y - 4}
            Q ${ANCHORS.head.x - 44} ${ANCHORS.head.y - 44} ${ANCHORS.head.x} ${ANCHORS.head.y - 41}
            Q ${ANCHORS.head.x + 44} ${ANCHORS.head.y - 44} ${ANCHORS.head.x + 41} ${ANCHORS.head.y - 4}
            Q ${ANCHORS.head.x + 30} ${ANCHORS.head.y - 22} ${ANCHORS.head.x} ${ANCHORS.head.y - 20}
            Q ${ANCHORS.head.x - 30} ${ANCHORS.head.y - 22} ${ANCHORS.head.x - 41} ${ANCHORS.head.y - 4} Z`}
        fill={P.hair}
      />
      <Path
        d={`M${ANCHORS.head.x - 22} ${ANCHORS.head.y - 34} Q ${ANCHORS.head.x - 6} ${ANCHORS.head.y - 40} ${ANCHORS.head.x + 8} ${ANCHORS.head.y - 33}`}
        stroke={P.hairShine}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        opacity={0.7}
      />

      {/* 옆머리 — 투구를 써도 머리카락이 보이도록 귀 옆으로 살짝 내려옵니다. */}
      <Path
        d={`M${ANCHORS.head.x - 38} ${ANCHORS.head.y - 12} q -6 18 2 30 q 9 -10 8 -28 Z`}
        fill={P.hair}
      />
      <Path
        d={`M${ANCHORS.head.x + 38} ${ANCHORS.head.y - 12} q 6 18 -2 30 q -9 -10 -8 -28 Z`}
        fill={P.hair}
      />

      {/* 얼굴 — 비율은 그대로 두고 눈·웃음·볼만 키워 인상을 밝게 잡았습니다. */}
      <Ellipse cx={ANCHORS.head.x - 14} cy={ANCHORS.head.y + 3} rx={5.3} ry={6.7} fill={P.outline} />
      <Ellipse cx={ANCHORS.head.x + 14} cy={ANCHORS.head.y + 3} rx={5.3} ry={6.7} fill={P.outline} />
      <Ellipse cx={ANCHORS.head.x - 12.2} cy={ANCHORS.head.y + 0.6} rx={1.8} ry={2.1} fill="#FFFFFF" />
      <Ellipse cx={ANCHORS.head.x + 15.8} cy={ANCHORS.head.y + 0.6} rx={1.8} ry={2.1} fill="#FFFFFF" />
      <Ellipse cx={ANCHORS.head.x - 26} cy={ANCHORS.head.y + 15} rx={7.5} ry={4.5} fill="#F7B9A6" opacity={0.8} />
      <Ellipse cx={ANCHORS.head.x + 26} cy={ANCHORS.head.y + 15} rx={7.5} ry={4.5} fill="#F7B9A6" opacity={0.8} />
      <Path
        d={`M${ANCHORS.head.x - 11} ${ANCHORS.head.y + 17} Q ${ANCHORS.head.x} ${ANCHORS.head.y + 28} ${ANCHORS.head.x + 11} ${ANCHORS.head.y + 17}`}
        stroke={P.outline}
        strokeWidth={2.8}
        strokeLinecap="round"
        fill="none"
      />

      {/* 착용한 갑주를 몸 위에 겹쳐 그립니다 */}
      <ArmorLayers equipped={equipped} uid={uid} />
    </Svg>
  );
}
