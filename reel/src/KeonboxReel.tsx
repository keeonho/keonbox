import { AbsoluteFill, Composition, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadCherry } from "@remotion/google-fonts/CherryBombOne";
import { loadFont as loadFredoka } from "@remotion/google-fonts/Fredoka";

const { fontFamily: cherry } = loadCherry();
const { fontFamily: fredoka } = loadFredoka("normal", { weights: ["700"] });

const MEMBERS = ["dreams", "euphoria", "heaven", "wonder", "daydream", "moon", "miracle", "wishes", "whisper", "mirage", "snooze", "lovelight", "clouds", "azure", "bliss"];
const EACH = 12;
const SKY = "#bfe6f7";
const BLUE = "#8fd0ee";
const DEEP = "#4aa7d8";

// postage-stamp perforation: solid content box unioned with a grid of holes
const stamp: React.CSSProperties = {
  background: "#fff",
  padding: 22,
  WebkitMask: "linear-gradient(#000 0 0) content-box, radial-gradient(circle, #0000 11px, #000 11.5px) -22px -22px / 44px 44px round",
  mask: "linear-gradient(#000 0 0) content-box, radial-gradient(circle, #0000 11px, #000 11.5px) -22px -22px / 44px 44px round",
};

const Star: React.FC<{ x: number; y: number; s: number; d: number }> = ({ x, y, s, d }) => {
  const f = useCurrentFrame();
  const tw = 0.6 + 0.4 * Math.sin((f + d) / 6);
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} style={{ position: "absolute", left: x, top: y, scale: String(tw), rotate: `${(f + d) * 2}deg` }}>
      <path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" fill="#fff" />
    </svg>
  );
};

const Cloud: React.FC<{ y: number; s: number; speed: number; o: number }> = ({ y, s, speed, o }) => {
  const f = useCurrentFrame();
  return (
    <svg viewBox="0 0 200 100" width={s} style={{ position: "absolute", top: y, left: ((f * speed + o) % 1500) - 300, opacity: 0.75 }}>
      <path d="M40 80h120a30 30 0 0 0 0-60 40 40 0 0 0-75-5A30 30 0 0 0 40 80z" fill="#fff" />
    </svg>
  );
};

export const KeonboxReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = Math.floor(frame / EACH) % MEMBERS.length;
  const local = frame % EACH;
  const pop = spring({ frame: local, fps, config: { damping: 9, stiffness: 180 } });
  const name = MEMBERS[i];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${SKY}, ${BLUE})`, overflow: "hidden" }}>
      <Cloud y={110} s={420} speed={3} o={0} />
      <Cloud y={980} s={520} speed={2} o={700} />
      <Cloud y={560} s={300} speed={4} o={1200} />
      <Star x={120} y={180} s={70} d={0} />
      <Star x={880} y={260} s={54} d={20} />
      <Star x={150} y={1060} s={48} d={40} />
      <Star x={900} y={1100} s={76} d={10} />

      <div
        style={{
          position: "absolute",
          left: 200,
          top: 210,
          width: 680,
          height: 860,
          ...stamp,
          rotate: `${(i % 2 ? 4 : -4) * (1 - pop) + (i % 2 ? 1.5 : -1.5)}deg`,
          scale: String(interpolate(pop, [0, 1], [0.6, 1])),
          filter: "drop-shadow(0 14px 22px rgba(40,120,170,.35))",
        }}
      >
        <Img src={staticFile(`${name}.webp`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 990,
          textAlign: "center",
          fontFamily: cherry,
          fontSize: 150,
          color: "#fff",
          WebkitTextStroke: `10px ${BLUE}`,
          paintOrder: "stroke fill",
          textShadow: `0 0 0 #fff, 0 8px 0 ${DEEP}`,
          translate: `0 ${interpolate(pop, [0, 1], [80, 0])}px`,
          opacity: interpolate(local, [0, 3], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {name}
      </div>

      <div style={{ position: "absolute", left: 80, top: 70, fontFamily: fredoka, fontWeight: 700, fontSize: 64, color: "#fff", textShadow: `0 4px 0 ${DEEP}` }}>KeonBox</div>
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 84,
          fontFamily: fredoka,
          fontWeight: 700,
          fontSize: 40,
          color: DEEP,
          background: "#fff",
          borderRadius: 40,
          padding: "6px 26px",
          scale: String(interpolate(Math.sin(frame / 5), [-1, 1], [0.96, 1.04], { easing: Easing.inOut(Easing.ease) })),
        }}
      >
        series {String(i + 1).padStart(3, "0")}
      </div>
    </AbsoluteFill>
  );
};

export const KeonboxComposition = () => (
  <Composition id="KeonboxReel" component={KeonboxReel} durationInFrames={MEMBERS.length * EACH} fps={24} width={1080} height={1350} />
);
