"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Positioning controls - clean and easy to access
const imagePosition = {
  top: "63%",      // Vertical position (can be %, px, rem)
  left: "50%",     // Horizontal position
  width: "1400px",  // Width of the image
  zIndex: 10,      // Stack order
  transform: "translate(-50%, -50%)", // Center the image exactly on key coordinates
};

const textPosition = {
  top: "50%",
  left: "50%",
  fontSize: "15vw",
  color: "#d1d5db", // Light gray for reduced contrast
  zIndex: 1,
  transform: "translate(-50%, -50%)",
};

const bottlePosition = {
  top: "55%",
  left: "50%",
  width: "900px",
  zIndex: 20,
  transform: "translate(-50%, -50%)",
};

const capPosition = {
  top: "55%",
  left: "50%",
  width: "700px",
  zIndex: 21,
  transform: "translate(-50%, -50%)",
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate scroll phases
  // Phase 1: Bottle and cap converge (scroll 0 -> 600px where they meet)
  // Buffer: Hold position (scroll 600 -> 700px)
  // Phase 2: Both shift up by 20px (scroll 700 -> 800px)
  const phase1Threshold = 600; // Scroll position where bottle/cap reach their stopping points
  const phase2Start = 700; // Start shifting up after this scroll position
  // Lock early: Cap at 300px instead of 500px. This stops scaling/moving sooner.
  const phase2Scroll = Math.min(300, Math.max(0, scrollY - phase2Start) * 0.2);
  const phase2Scale = 1 - (phase2Scroll / 500) * 0.3; // Scale will stop at ~0.82

  // Calculate base positions (phase 1 only)
  const bottleBaseY = Math.max(100, 1000 - scrollY * 1.5); // Stops at 100px
  const capBaseY = Math.min(-68, -1000 + scrollY * 1.5); // Stops at -68px

  // Product features data - Semi-circle arrangement (bottom half, 4 features)
  const features = [
    { icon: "✨", title: "Natural Ingredients", description: "Pure botanical extracts", angle: 0 },
    { icon: "💧", title: "Deep Hydration", description: "24-hour moisture lock", angle: 50 },
    { icon: "🌿", title: "Organic Formula", description: "Certified organic blend", angle: 130 },
    { icon: "🛡️", title: "Skin Protection", description: "Environmental defense", angle: 175 },
  ];

  // Calculate feature card animation (pop out during phase 2)
  const featureProgress = Math.min(1, phase2Scroll / 300); // 0 to 1 over 300px
  const featureDistance = featureProgress * 600; // Max 600px from center

  // Phase 3: Stacking section (after features are revealed)
  const phase3Start = 1800; // Start stacking much later to give features time to be seen
  // Calculate progress for the section sliding up over 500px scroll (faster/reduced height)
  const phase3Progress = Math.min(1, Math.max(0, scrollY - phase3Start) / 500);

  // Calculate bottle movement for Phase 3 ("travel with scroll")
  // Move DOWN (positive Y) and RIGHT (positive X) to place itself in the new section
  const phase3BottleY = phase3Progress * 120; // Move down 120px
  const phase3BottleX = phase3Progress * 250; // Move right 250px

  // Rotate slightly left to sit naturally in the hand
  const phase3Rotation = phase3Progress * -12; // Rotate -12 degrees

  // Phase 3 Scale: Shrink further to fit in the hand (relative to phase2Scale)
  const phase3Scale = 1 - phase3Progress * 0.4; // shrinks down to 60% of phase2 size

  // Dynamic Text Color: Start Black (0,0,0) -> Fade to Gray (209, 213, 219)
  // Happens over first 300px of scroll (while Aloe moves down/Bottle moves up)
  const textProgress = Math.min(1, scrollY / 300);
  const r = Math.round(209 * textProgress);
  const g = Math.round(213 * textProgress);
  const b = Math.round(219 * textProgress);
  const dynamicTextColor = `rgb(${r}, ${g}, ${b})`;

  return (
    <main className="relative bg-white min-h-[500vh]">
      {/* Header: Fixed top bar with Logo, Brand, and Nav */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          padding: "40px 0px 20px 20px", // Reduced left padding to 20px to shift header left
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
          pointerEvents: "auto",
        }}
      >


        {/* Center: Brand - Visibly Large */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            height: "90px",
            width: "290px"
          }}
        >
          <Image
            src="/brand.png"
            alt="Brand"
            fill
            className="object-contain"
          />
        </div>


      </header>

      {/* Content Wrapper: Fixed to keep text static while scrolling */}
      <div className="fixed inset-0 w-full h-screen overflow-hidden">

        {/* "NOURISH" Text - fades out in Phase 3 */}
        <div
          style={{
            position: "absolute",
            top: textPosition.top,
            left: textPosition.left,
            zIndex: textPosition.zIndex,
            transform: textPosition.transform,
            opacity: 1 - phase3Progress * 2,
          }}
          className="pointer-events-none"
        >
          <h1
            className="font-bold tracking-widest select-none whitespace-nowrap"
            style={{
              fontSize: textPosition.fontSize,
              color: dynamicTextColor, // Dynamic fade black -> gray
              lineHeight: 1
            }}
          >
            NOURISH
          </h1>
        </div>

        {/* Controlled Image with Scroll Animation: ALOE (Fades out Phase 3) */}
        <div
          style={{
            position: "absolute",
            top: imagePosition.top,
            left: imagePosition.left,
            width: imagePosition.width,
            zIndex: imagePosition.zIndex,
            transform: `translate(-50%, calc(-50% + ${scrollY * 1.2}px))`,
            opacity: 1 - phase3Progress,
          }}
          className="transition-transform duration-75 ease-out will-change-transform"
        >
          <Image
            src="/alovera.png"
            alt="Aloe Vera"
            width={1400}
            height={1400}
            className="w-full h-auto object-contain block"
            priority
          />
        </div>

        {/* Product Unit Container: Handles Phase 2 (Lift/Scale) and Phase 3 (Travel) for the whole unit */}
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: "50%",
            width: "100%", // Container needs width/height or just be a positioning anchor
            height: "100%",
            pointerEvents: "none",
            zIndex: 30,
            transform: `translate(calc(-50% + ${phase3BottleX}px), calc(-50% + ${-phase2Scroll + phase3BottleY}px)) rotate(${phase3Rotation}deg) scale(${phase2Scale * phase3Scale})`,
            transformOrigin: "center center", // Scale from center of the unit location
            filter: "drop-shadow(0px 20px 30px rgba(0,0,0,0.5))", // 3D depth shadow
          }}
          className="transition-transform duration-75 ease-out will-change-transform"
        >
          {/* Controlled Image: BOTTLE (Handles only Phase 1 convergence) */}
          <div
            style={{
              position: "absolute",
              top: "50%", // Relative to the wrapper center
              left: "50%",
              width: bottlePosition.width,
              zIndex: 30,
              // Only Phase 1 offset
              transform: `translate(-50%, calc(-50% + ${bottleBaseY}px))`,
            }}
          >
            <Image
              src="/bottle.png"
              alt="Bottle"
              width={600}
              height={1000}
              className="w-full h-auto object-contain block"
              priority
            />
          </div>

          {/* Controlled Image: CAP (Handles only Phase 1 convergence) */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: capPosition.width,
              zIndex: 31,
              // Only Phase 1 offset
              transform: `translate(-50%, calc(-49% + ${capBaseY}px))`,
            }}
          >
            <Image
              src="/cap.png"
              alt="Cap"
              width={600}
              height={1000}
              className="w-full h-auto object-contain block"
              priority
            />
          </div>
        </div>

        {/* Feature Cards - Circular spread from behind bottle */}
        {features.map((feature, index) => {
          const angleRad = (feature.angle * Math.PI) / 180;
          const x = Math.cos(angleRad) * featureDistance;
          const y = Math.sin(angleRad) * featureDistance;

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                zIndex: 5,
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                opacity: featureProgress - phase3Progress * 2, // Fade out in Phase 3
                transition: "all 0.3s ease-out",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* Circular icon with border */}
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    border: "8px solid #064e3b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.35)",
                  }}
                >
                  <span style={{ fontSize: "80px" }}>{feature.icon}</span>
                </div>
                {/* Feature title */}
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#000000",
                    textAlign: "center",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {feature.title}
                </h3>
                {/* Feature description */}
                <p
                  style={{
                    fontSize: "16px",
                    color: "#000000",
                    textAlign: "center",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
        {/* Phase 3: Stacking Section (Slides up) - Z-index 15 (below bottle z-30) */}
        <div
          className="absolute bottom-0 left-0 w-full h-screen z-15 pointer-events-none"
          style={{
            transform: `translateY(${(1 - phase3Progress) * 100}%)`,
            transition: 'transform 0.1s linear'
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/section.jpeg"
              alt="Background Section"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-white/10" />
          </div>
        </div>

      </div>


    </main >
  );
}
