import { Image } from "expo-image";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { images } from "@/constants/images";
import { palette, shadows } from "@/theme";

const cardStyle = {
  backgroundColor: palette.background,
  borderCurve: "continuous" as const,
  boxShadow: shadows.overlay,
};

function AccentMarks() {
  return (
    <View className="h-8 w-8" accessibilityElementsHidden>
      <View
        className="absolute left-2 top-0 h-4 w-[3px] rounded-full bg-emerald"
        style={{ transform: [{ rotate: "24deg" }] }}
      />
      <View
        className="absolute left-4 top-3 h-3 w-[3px] rounded-full bg-emerald"
        style={{ transform: [{ rotate: "-18deg" }] }}
      />
      <View
        className="absolute left-0 top-3 h-2.5 w-[3px] rounded-full bg-emerald"
        style={{ transform: [{ rotate: "40deg" }] }}
      />
    </View>
  );
}

function SoftBlob() {
  return (
    <View
      pointerEvents="none"
      className="absolute bg-emerald-light"
      style={{
        width: 230,
        height: 188,
        borderRadius: 999,
        top: 28,
        left: 4,
        opacity: 0.95,
        transform: [{ scaleX: 1.2 }, { rotate: "-14deg" }],
      }}
    />
  );
}

function Leaf() {
  const leaves = [
    { left: 18, bottom: 92, rotate: "-40deg", width: 16, height: 34 },
    { left: 30, bottom: 74, rotate: "48deg", width: 15, height: 30 },
    { left: 6, bottom: 58, rotate: "-62deg", width: 16, height: 32 },
    { left: 28, bottom: 40, rotate: "36deg", width: 14, height: 28 },
    { left: 8, bottom: 22, rotate: "-28deg", width: 14, height: 26 },
  ];

  return (
    <View className="h-40 w-[72px]">
      <View
        className="absolute bottom-1 left-8 h-32 w-[3px] rounded-full bg-emerald"
        style={{ transform: [{ rotate: "-8deg" }] }}
      />
      {leaves.map((leaf) => (
        <View
          key={`${leaf.left}-${leaf.bottom}`}
          className="absolute bg-emerald"
          style={{
            left: leaf.left,
            bottom: leaf.bottom,
            width: leaf.width,
            height: leaf.height,
            borderTopLeftRadius: leaf.height,
            borderBottomLeftRadius: leaf.height,
            borderTopRightRadius: leaf.width / 2,
            borderBottomRightRadius: 2,
            transform: [{ rotate: leaf.rotate }],
          }}
        />
      ))}
    </View>
  );
}

function PlusGlyph({ light = false }: { light?: boolean }) {
  const bar = light ? "bg-on-accent" : "bg-emerald";
  return (
    <View className="h-3.5 w-3.5 items-center justify-center">
      <View className={`absolute h-[2px] w-3.5 rounded-full ${bar}`} />
      <View className={`absolute h-3.5 w-[2px] rounded-full ${bar}`} />
    </View>
  );
}

function RingIcon() {
  return <View className="h-3.5 w-3.5 rounded-full border-2 border-slate" />;
}

function DocIcon() {
  return <View className="h-3.5 w-2.5 rounded-[2px] border-2 border-slate" />;
}

function Chevron() {
  return (
    <View
      className="h-2 w-2 border-r-2 border-t-2 border-slate"
      style={{ transform: [{ rotate: "45deg" }] }}
    />
  );
}

function PaperPlane() {
  return (
    <View style={{ width: 36, height: 36, transform: [{ rotate: "-18deg" }] }}>
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 8,
          width: 0,
          height: 0,
          borderTopWidth: 9,
          borderBottomWidth: 9,
          borderLeftWidth: 28,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: palette.emerald,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 6,
          top: 16,
          width: 14,
          height: 2,
          borderRadius: 1,
          backgroundColor: palette.emeraldLight,
          transform: [{ rotate: "24deg" }],
        }}
      />
    </View>
  );
}

const creditRows = [
  { id: "loan", label: "Loan", amount: "+₦50,000", icon: "doc" },
  { id: "service", label: "Service", amount: "+₦20,000", icon: "ring" },
  { id: "other", label: "Other", amount: "+₦15,000", icon: "ring" },
] as const;

export function CreditArtwork() {
  return (
    <View
      className="w-full max-w-[320px] items-center justify-center"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View className="relative w-full items-center pb-8 pl-6 pt-4">
        <SoftBlob />
        <View className="w-full flex-row items-end">
          <View className="mb-2 -mr-2">
            <Leaf />
          </View>
          <View className="relative flex-1">
            <View className="absolute -right-3 -top-4 z-10">
              <AccentMarks />
            </View>
            <View className="rounded-3xl border border-line px-3.5 pb-4 pt-3.5" style={cardStyle}>
              <Image
                source={images.logo}
                contentFit="contain"
                accessibilityLabel="LedgerBook"
                style={{ width: 132, height: 32 }}
              />
              <View className="mt-4 flex-row items-center gap-2.5">
                <View className="h-7 w-7 items-center justify-center rounded-full bg-emerald-light">
                  <PlusGlyph />
                </View>
                <Text className="font-poppins-medium text-[13px] leading-5 text-ink">Add Record</Text>
              </View>
              <View className="my-3 h-px bg-line" />
              {creditRows.map((row) => (
                <View key={row.id} className="flex-row items-center gap-2.5 py-1.5">
                  <View className="h-7 w-7 items-center justify-center rounded-full bg-canvas">
                    {row.icon === "doc" ? <DocIcon /> : <RingIcon />}
                  </View>
                  <Text className="flex-1 font-poppins-medium text-[13px] leading-5 text-ink">
                    {row.label}
                  </Text>
                  <Text className="font-poppins-semibold text-[12px] leading-4 text-emerald">
                    {row.amount}
                  </Text>
                </View>
              ))}
            </View>
            <View
              className="absolute -bottom-4 -right-2 h-12 w-12 items-center justify-center rounded-full bg-emerald"
              style={{ boxShadow: shadows.raised }}
            >
              <PlusGlyph light />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function Dots() {
  return (
    <View className="flex-row gap-0.5">
      <View className="h-1 w-1 rounded-full bg-slate" />
      <View className="h-1 w-1 rounded-full bg-slate" />
      <View className="h-1 w-1 rounded-full bg-slate" />
    </View>
  );
}

export function ReminderArtwork() {
  return (
    <View
      className="w-full max-w-[320px] items-center"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View className="relative w-full items-center px-3 pb-16 pt-4">
        <SoftBlob />
        <View className="w-full rounded-3xl border border-line px-3.5 pb-4 pt-3" style={cardStyle}>
          <View className="flex-row items-center gap-2.5">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-emerald-light">
              <Text className="font-poppins-semibold text-[12px] text-emerald">JD</Text>
            </View>
            <View className="flex-1">
              <Text className="font-poppins-semibold text-[14px] leading-5 text-ink">James Doe</Text>
              <Text className="caption text-slate">+234 801 234 5678</Text>
            </View>
            <Dots />
          </View>
          <View className="mt-3 rounded-2xl rounded-tl-md bg-line px-3 py-2.5">
            <Text className="body-sm text-ink">
              Hi James, a friendly reminder that ₦25,000 is still outstanding for the consultancy
              service.
            </Text>
            <Text className="caption mt-1.5 text-slate">10:24 AM</Text>
          </View>
          <View className="mt-3 max-w-[88%] self-end rounded-2xl rounded-br-md bg-emerald px-3 py-2">
            <Text className="body-sm text-on-accent">{"Thanks! I'll take care of it now."}</Text>
            <Text className="caption mt-1 text-right text-on-accent opacity-80">10:26 AM</Text>
          </View>
        </View>
        <View className="absolute bottom-8 left-1 items-start">
          <PaperPlane />
          <View className="-mt-1 ml-1 h-7 w-9 overflow-hidden">
            <View
              className="h-12 w-12 rounded-full border-2 border-emerald"
              style={{ borderStyle: "dashed", marginLeft: -6, marginTop: -2 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const people = [
  { initials: "JD", name: "James Doe", detail: "Consultancy Service", amount: "+₦50,000" },
  { initials: "AO", name: "Ada Okafor", detail: "Loan Repayment", amount: "+₦35,000" },
  { initials: "TK", name: "Tunde Kola", detail: "Design Work", amount: "+₦20,000" },
  { initials: "FA", name: "Faith Adeyemi", detail: "Product Support", amount: "+₦20,000" },
] as const;

function ArrowUpRight() {
  return (
    <View className="h-4 w-4">
      <View className="absolute right-0 top-0 h-[2px] w-2.5 bg-on-accent" />
      <View className="absolute right-0 top-0 h-2.5 w-[2px] bg-on-accent" />
      <View
        className="absolute left-0 top-1.5 h-[2px] w-4 bg-on-accent"
        style={{ transform: [{ rotate: "-45deg" }] }}
      />
    </View>
  );
}

export function BalanceArtwork() {
  return (
    <View
      className="w-full max-w-[320px]"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View className="relative pt-3">
        <View className="absolute -right-1 top-0">
          <AccentMarks />
        </View>
        <View className="rounded-3xl bg-emerald px-4 pb-8 pt-4" style={{ borderCurve: "continuous" }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-poppins-medium text-[11px] leading-4 text-on-accent opacity-90">
                Total Owed to You
              </Text>
              <Text className="font-poppins-bold text-[28px] leading-9 text-on-accent">₦125,000</Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-full border border-white/50">
              <ArrowUpRight />
            </View>
          </View>
        </View>
        <View className="-mt-5 rounded-3xl border border-line px-3 py-1.5" style={cardStyle}>
          {people.map((person, index) => (
            <View key={person.initials}>
              <View className="flex-row items-center gap-2.5 py-2">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-emerald-light">
                  <Text className="font-poppins-semibold text-[11px] text-emerald">{person.initials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-poppins-semibold text-[13px] leading-5 text-ink">{person.name}</Text>
                  <Text className="caption text-slate">{person.detail}</Text>
                </View>
                <Text className="font-poppins-semibold text-[12px] leading-4 text-emerald">
                  {person.amount}
                </Text>
                <Chevron />
              </View>
              {index < people.length - 1 ? <View className="h-px bg-line" /> : null}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function ArtworkFrame({ children }: { children: ReactNode }) {
  return <View className="w-full items-center justify-center px-1">{children}</View>;
}
