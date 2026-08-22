import { Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { ANCHORS as A, TIER_METAL, type ArmorSlot, type EquippedArmor } from './characterParts';

interface ArmorLayersProps {
  equipped: EquippedArmor;
  /** 화면에 캐릭터가 여러 명 떠 있어도 그라데이션이 섞이지 않도록 받는 고유 접두사입니다. */
  uid: string;
}

/**
 * 착용한 갑주만 골라 몸 위에 겹쳐 그립니다.
 * 모든 조각이 characterParts의 앵커를 기준으로 그려지므로 조합이 바뀌어도 위치가 어긋나지 않습니다.
 */
export default function ArmorLayers({ equipped, uid }: ArmorLayersProps) {
  const slots = Object.keys(equipped) as ArmorSlot[];
  const metalOf = (slot: ArmorSlot) => TIER_METAL[equipped[slot] ?? 'basic'];
  const has = (slot: ArmorSlot) => Boolean(equipped[slot]);

  return (
    <G>
      <Defs>
        {slots.map((slot) => {
          const metal = metalOf(slot);
          return (
            <LinearGradient id={`metal-${slot}-${uid}`} key={slot} x1="0" y1="0" x2="0.9" y2="1">
              <Stop offset="0" stopColor={metal.light} />
              <Stop offset="0.55" stopColor={metal.base} />
              <Stop offset="1" stopColor={metal.dark} />
            </LinearGradient>
          );
        })}
      </Defs>

      {/* 평안의 신발 */}
      {has('shoes') && (
        <G>
          <Path d={`M78 ${A.feet.y + 2} h22 v10 q0 5 -6 5 h-16 q-5 0 -5 -5 z`} fill={`url(#metal-shoes-${uid})`} />
          <Path d={`M100 ${A.feet.y + 2} h22 q5 0 5 5 v5 q0 5 -5 5 h-22 z`} fill={`url(#metal-shoes-${uid})`} />
        </G>
      )}

      {/* 의의 호신경 (가슴 갑옷) */}
      {has('breastplate') && (
        <G>
          <Path
            d="M70 140 Q 100 128 130 140 L127 182 Q 100 194 73 182 Z"
            fill={`url(#metal-breastplate-${uid})`}
            stroke={metalOf('breastplate').dark}
            strokeWidth={1.5}
          />
          <Path d="M100 132 L100 188" stroke={metalOf('breastplate').dark} strokeWidth={1.6} opacity={0.5} />
          <Path d="M82 146 Q 100 140 118 146" stroke={metalOf('breastplate').light} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.8} />
        </G>
      )}

      {/* 진리의 띠 */}
      {has('belt') && (
        <G>
          <Rect x={69} y={A.waist.y - 4} width={62} height={12} rx={5} fill={`url(#metal-belt-${uid})`} />
          <Rect x={92} y={A.waist.y - 7} width={16} height={18} rx={4} fill={metalOf('belt').light} stroke={metalOf('belt').dark} strokeWidth={1.2} />
        </G>
      )}

      {/* 구원의 투구 */}
      {has('helmet') && (
        <G>
          <Path
            d={`M${A.head.x - 43} ${A.head.y - 6}
                Q ${A.head.x - 46} ${A.head.y - 50} ${A.head.x} ${A.head.y - 47}
                Q ${A.head.x + 46} ${A.head.y - 50} ${A.head.x + 43} ${A.head.y - 6}
                Q ${A.head.x + 20} ${A.head.y - 16} ${A.head.x} ${A.head.y - 15}
                Q ${A.head.x - 20} ${A.head.y - 16} ${A.head.x - 43} ${A.head.y - 6} Z`}
            fill={`url(#metal-helmet-${uid})`}
          />
          <Path
            d={`M${A.head.x - 26} ${A.head.y - 36} Q ${A.head.x - 6} ${A.head.y - 44} ${A.head.x + 10} ${A.head.y - 36}`}
            stroke={metalOf('helmet').light}
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            opacity={0.85}
          />
          <Ellipse cx={A.head.x} cy={A.head.y - 48} rx={5} ry={5} fill={metalOf('helmet').light} />
        </G>
      )}

      {/* 믿음의 방패 (왼손) */}
      {has('shield') && (
        <G>
          <Path
            d={`M${A.leftHand.x} ${A.leftHand.y - 30}
                q 22 6 22 14 q0 22 -22 34 q-22 -12 -22 -34 q0 -8 22 -14 Z`}
            fill={`url(#metal-shield-${uid})`}
            stroke={metalOf('shield').dark}
            strokeWidth={1.6}
          />
          <Path
            d={`M${A.leftHand.x} ${A.leftHand.y - 20} v30 M${A.leftHand.x - 12} ${A.leftHand.y - 6} h24`}
            stroke={metalOf('shield').light}
            strokeWidth={3.4}
            strokeLinecap="round"
          />
        </G>
      )}

      {/* 성령의 검 (오른손) */}
      {has('sword') && (
        <G>
          <Path
            d={`M${A.rightHand.x} ${A.rightHand.y - 62} l7 12 v34 h-14 v-34 Z`}
            fill={`url(#metal-sword-${uid})`}
            stroke={metalOf('sword').dark}
            strokeWidth={1.2}
          />
          <Rect x={A.rightHand.x - 15} y={A.rightHand.y - 17} width={30} height={7} rx={3} fill={metalOf('sword').dark} />
          <Rect x={A.rightHand.x - 4} y={A.rightHand.y - 10} width={8} height={20} rx={4} fill="#8A6A4B" />
        </G>
      )}

      {/* 모세의 지팡이 (오른손) */}
      {has('staff') && (
        <G>
          <Path d={`M${A.rightHand.x + 4} ${A.rightHand.y + 22} L${A.rightHand.x - 2} ${A.rightHand.y - 60}`} stroke="#A9793F" strokeWidth={7} strokeLinecap="round" />
          <Path d={`M${A.rightHand.x - 2} ${A.rightHand.y - 60} q 16 -6 14 8 q-2 10 -13 6`} stroke="#A9793F" strokeWidth={7} strokeLinecap="round" fill="none" />
        </G>
      )}

      {/* 다윗의 물맷돌 (왼손) */}
      {has('sling') && (
        <G>
          <Path d={`M${A.leftHand.x - 12} ${A.leftHand.y - 6} q 12 22 24 0`} stroke="#8A6A4B" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Ellipse cx={A.leftHand.x} cy={A.leftHand.y + 8} rx={9} ry={8} fill="#9AA0A6" />
          <Ellipse cx={A.leftHand.x - 3} cy={A.leftHand.y + 5} rx={3.4} ry={3} fill="#C2C7CC" opacity={0.8} />
        </G>
      )}

      {/* 성탄절 한정판 코스튬 (모자 + 망토) */}
      {has('costume') && (
        <G>
          <Path d="M66 132 Q 100 122 134 132 L140 196 Q 100 208 60 196 Z" fill="#C0392B" opacity={0.92} />
          <Path
            d={`M${A.head.x - 40} ${A.head.y - 20} Q ${A.head.x - 10} ${A.head.y - 70} ${A.head.x + 34} ${A.head.y - 44} Q ${A.head.x + 16} ${A.head.y - 22} ${A.head.x - 40} ${A.head.y - 20} Z`}
            fill="#C0392B"
          />
          <Ellipse cx={A.head.x + 36} cy={A.head.y - 44} rx={9} ry={9} fill="#FFFFFF" />
          <Rect x={A.head.x - 42} y={A.head.y - 24} width={84} height={11} rx={5.5} fill="#FFFFFF" />
        </G>
      )}
    </G>
  );
}
