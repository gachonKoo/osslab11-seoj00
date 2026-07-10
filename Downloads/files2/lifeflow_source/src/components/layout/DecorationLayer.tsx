import { useTheme } from "../../context/ThemeContext";

export default function DecorationLayer() {
  const { settings } = useTheme();

  if (!settings.decorations || settings.decorations.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {settings.decorations.map((deco) => (
        <img
          key={deco.id}
          src={deco.image}
          alt=""
          style={{
            position: "absolute",
            left: `${deco.x}%`,
            top: `${deco.y}%`,
            width: `${deco.size}px`,
            height: `${deco.size}px`,
            transform: `rotate(${deco.rotate}deg)`,
            opacity: 0.35,
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ))}
    </div>
  );
}
