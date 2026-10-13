import { router } from "expo-router";
import { useRef, useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArtworkFrame,
  BalanceArtwork,
  CreditArtwork,
  ReminderArtwork,
} from "@/components/onboarding-artwork";
import { useSettingsStore } from "@/store/settings-store";
import { spacing } from "@/theme";

const slides = [
  {
    id: "credit",
    lead: "Record credit",
    accent: "in seconds",
    body: "Log what's owed, from loans to services, in just a few taps. Keep your records organized and accurate.",
    art: CreditArtwork,
  },
  {
    id: "reminders",
    lead: "Send polite",
    accent: "reminders",
    body: "Prepare a polite reminder for what a customer still owes, then share it yourself by WhatsApp or SMS.",
    art: ReminderArtwork,
  },
  {
    id: "balances",
    lead: "Track who",
    accent: "owes you",
    body: "See what each customer still owes, and the total outstanding, in one place.",
    art: BalanceArtwork,
  },
] as const;

function OnboardingSlide({
  slide,
  width,
  height,
}: {
  slide: (typeof slides)[number];
  width: number;
  height: number;
}) {
  const [copyHeight, setCopyHeight] = useState(0);
  const Art = slide.art;
  const artMax = Math.max(140, height - copyHeight - spacing.md);

  return (
    <View style={{ width, height }}>
      <View
        className="px-6 pt-4"
        onLayout={(event) => {
          const next = event.nativeEvent.layout.height;
          setCopyHeight((current) => (current === next ? current : next));
        }}
      >
        <Text className="h1 text-foreground">{slide.lead}</Text>
        <Text className="h1 text-accent">{slide.accent}</Text>
        <Text className="body-lg mt-3 text-muted">{slide.body}</Text>
      </View>
      <View className="min-h-0 flex-1 items-center justify-center overflow-hidden py-2">
        {copyHeight > 0 ? (
          <FittedArtwork maxHeight={artMax}>
            <ArtworkFrame>
              <Art />
            </ArtworkFrame>
          </FittedArtwork>
        ) : null}
      </View>
    </View>
  );
}

function FittedArtwork({ maxHeight, children }: { maxHeight: number; children: ReactNode }) {
  const [naturalHeight, setNaturalHeight] = useState(0);
  const scale = naturalHeight > maxHeight && maxHeight > 0 ? maxHeight / naturalHeight : 1;

  return (
    <View
      className="w-full items-center"
      style={{
        height: naturalHeight > 0 ? naturalHeight * scale : undefined,
        overflow: "hidden",
      }}
    >
      <View
        className="w-full"
        onLayout={(event) => {
          const next = event.nativeEvent.layout.height;
          if (next > 0 && naturalHeight === 0) {
            setNaturalHeight(next);
          }
        }}
        style={
          scale === 1
            ? undefined
            : {
                transform: [{ scale }],
                transformOrigin: "top center",
              }
        }
      >
        {children}
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [frame, setFrame] = useState({ width: windowWidth, height: windowHeight });
  const [page, setPage] = useState(0);
  const pager = useRef<ScrollView>(null);
  const leaving = useRef(false);
  const hydrated = useSettingsStore((state) => state.hydrated);
  const markOnboardingSeen = useSettingsStore((state) => state.markOnboardingSeen);

  function goToSignUp() {
    if (leaving.current) {
      return;
    }

    leaving.current = true;
    markOnboardingSeen();
    router.replace("/sign-up");
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (frame.width <= 0) {
      return;
    }

    const next = Math.round(event.nativeEvent.contentOffset.x / frame.width);
    const clamped = Math.min(Math.max(next, 0), slides.length - 1);
    setPage((current) => (current === clamped ? current : clamped));
  }

  function continueOnboarding() {
    if (page < slides.length - 1) {
      pager.current?.scrollTo({ x: frame.width * (page + 1), animated: true });
      return;
    }

    goToSignUp();
  }

  if (!hydrated) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView style={styles.safe}>
        <View className="mx-auto w-full max-w-[440px] items-end px-6">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            onPress={goToSignUp}
            style={({ pressed }) => [styles.skip, pressed ? styles.pressed : null]}
          >
            <Text className="h4 text-accent">Skip</Text>
          </Pressable>
        </View>

        <View
          className="mx-auto w-full max-w-[440px] flex-1"
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setFrame((current) =>
              current.width === width && current.height === height ? current : { width, height },
            );
          }}
          style={styles.pagerHost}
        >
          <ScrollView
            ref={pager}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={handleScroll}
            style={styles.horizontal}
            accessibilityLabel={`Introduction, slide ${page + 1} of ${slides.length}`}
            accessibilityHint="Swipe sideways to see the next introduction."
          >
            {slides.map((slide) => (
              <OnboardingSlide
                key={slide.id}
                slide={slide}
                width={frame.width}
                height={frame.height}
              />
            ))}
          </ScrollView>
        </View>

        <View className="mx-auto w-full max-w-[440px] gap-4 px-6 pb-2">
          <View
            accessible
            accessibilityLabel={`Slide ${page + 1} of ${slides.length}`}
            className="flex-row items-center justify-center gap-2"
          >
            {slides.map((slide, index) => (
              <View
                key={slide.id}
                className={`h-2 rounded-full ${index === page ? "w-6 bg-accent" : "w-2 bg-border"}`}
              />
            ))}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={page === slides.length - 1 ? "Continue to create an account" : "Continue"}
            onPress={continueOnboarding}
            className="min-h-12 items-center justify-center rounded-2xl bg-emerald px-4"
            style={({ pressed }) => [styles.continue, pressed ? styles.pressed : null]}
          >
            <Text className="h4 text-on-accent">Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  pagerHost: {
    minHeight: 0,
    overflow: "hidden",
  },
  horizontal: {
    flex: 1,
  },
  skip: {
    minHeight: spacing.touch,
    minWidth: spacing.touch,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  continue: {
    borderCurve: "continuous",
  },
});
