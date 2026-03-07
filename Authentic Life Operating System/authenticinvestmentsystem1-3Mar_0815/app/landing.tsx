import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { G, Rect, Circle, Path, Polygon } from 'react-native-svg';
import {
  ArrowRight,
  Compass,
  Sun,
  Sunrise,
  Moon,
  Target,
  Heart,
  Users,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Calendar,
} from 'lucide-react-native';

const GOLD = '#D4A843';
const GOLD_LIGHT = '#F5ECD7';
const DARK = '#1a1a2e';
const DARK_SURFACE = '#16213e';
const WARM_WHITE = '#fefcf8';
const TEXT_SECONDARY = '#8b8fa3';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation */}
      <View style={styles.navigation}>
        <View style={styles.navContainer}>
          <View style={styles.logo}>
            <Compass size={26} color={GOLD} />
            <Text style={styles.logoText}>Authentic Intelligence</Text>
          </View>
          <TouchableOpacity style={styles.signInButton} onPress={handleGetStarted}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section — dark background, gold accent */}
        <View style={styles.hero}>
          <View style={styles.heroInner}>
            <Text style={styles.heroLabel}>YOUR LIFE OPERATING SYSTEM</Text>
            <Text style={styles.heroTitle}>
              Stay focused on{'\n'}what matters most.
            </Text>
            <Text style={styles.heroDescription}>
              The tool that keeps your roles, wellness, and goals front and center — through daily and weekly rituals designed for people serious about how they invest their time.
            </Text>
            <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
              <Text style={styles.ctaButtonText}>Get Started Free</Text>
              <ArrowRight size={20} color={DARK} />
            </TouchableOpacity>
          </View>

          {/* Actual Compass SVG */}
          <View style={styles.compassContainer}>
            <View style={styles.compassSvgWrap}>
              <Svg viewBox="0 0 288 288" width={260} height={260}>
                {/* Outer circle */}
                <Circle cx="144" cy="144" r="113.76" fill="none" stroke={GOLD} strokeWidth="2" opacity={0.4} />
                <Circle cx="144" cy="144" r="112" fill="none" stroke="rgba(212,168,67,0.15)" strokeWidth="1" />
                {/* Middle circle */}
                <Circle cx="144" cy="144" r="86.4" fill="none" stroke={GOLD} strokeWidth="1.5" opacity={0.3} />
                {/* Radial lines (simplified) */}
                {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map((deg) => {
                  const rad1 = (deg * Math.PI) / 180;
                  const rad2 = ((deg + 180) * Math.PI) / 180;
                  return (
                    <Path
                      key={deg}
                      d={`M${144 + 102 * Math.sin(rad1)},${144 - 102 * Math.cos(rad1)} L${144 + 102 * Math.sin(rad2)},${144 - 102 * Math.cos(rad2)}`}
                      stroke="rgba(212,168,67,0.12)"
                      strokeWidth="1"
                    />
                  );
                })}
                {/* Inner white fill */}
                <Circle cx="144" cy="144" r="102" fill={DARK} />
                {/* Star — outer cardinal */}
                <Polygon
                  points="172.3,115.7 144,0 115.7,115.7 0,144 115.7,172.3 144,288 172.3,172.3 288,144"
                  fill={GOLD}
                  opacity={0.9}
                />
                {/* Star inner cutouts */}
                <Polygon points="144,144 144,279.56 170.64,170.64" fill="rgba(26,26,46,0.3)" />
                <Polygon points="144,144 144,279.56 117.36,170.64" fill={GOLD} opacity={0.7} />
                <Polygon points="144,144 279.56,144 170.64,117.36" fill="rgba(26,26,46,0.3)" />
                <Polygon points="144,144 279.56,144 170.64,170.64" fill={GOLD} opacity={0.7} />
                <Polygon points="144,144 144,8.44 117.36,117.36" fill="rgba(26,26,46,0.3)" />
                <Polygon points="144,144 144,8.44 170.64,117.36" fill={GOLD} opacity={0.7} />
                <Polygon points="144,144 8.44,144 117.36,170.64" fill="rgba(26,26,46,0.3)" />
                <Polygon points="144,144 8.44,144 117.36,117.36" fill={GOLD} opacity={0.7} />
                {/* 2nd tier star */}
                <Polygon
                  points="144,112.87 64.8,64.8 112.87,144 64.8,223.2 144,175.13 223.2,223.2 175.13,144 223.2,64.8"
                  fill={GOLD}
                  opacity={0.6}
                />
                <Polygon points="144,144 211.78,211.78 170.64,144" fill="rgba(26,26,46,0.4)" />
                <Polygon points="144,144 211.78,211.78 144,170.64" fill={GOLD} opacity={0.5} />
                <Polygon points="144,144 211.78,76.22 144,117.36" fill="rgba(26,26,46,0.4)" />
                <Polygon points="144,144 211.78,76.22 170.64,144" fill={GOLD} opacity={0.5} />
                <Polygon points="144,144 69.44,69.44 114.7,144" fill="rgba(26,26,46,0.4)" />
                <Polygon points="144,144 69.44,69.44 144,114.7" fill={GOLD} opacity={0.5} />
                <Polygon points="144,144 76.22,211.78 144,170.64" fill="rgba(26,26,46,0.4)" />
                <Polygon points="144,144 76.22,211.78 117.36,144" fill={GOLD} opacity={0.5} />
                {/* Center circles */}
                <Circle cx="144" cy="144" r="24.48" fill={DARK} />
                <Circle cx="144" cy="144" r="20.16" fill={GOLD} opacity={0.8} />
                <Circle cx="144" cy="144" r="16.8" fill={DARK} />
                <Circle cx="144" cy="144" r="10.35" fill={GOLD} opacity={0.6} />
                {/* Spindle (gold needle) */}
                <Polygon points="121.73,144.02 143.91,48.12 166.27,143.98 144.09,239.88" fill={GOLD} />
                <Circle cx="144" cy="144" r="3.6" fill={DARK} />
              </Svg>
            </View>
            {/* Cardinal labels around compass */}
            <View style={[styles.compassLabel, styles.compassN]}>
              <Sparkles size={14} color={GOLD} />
              <Text style={styles.compassLabelText}>North Star & Goals</Text>
            </View>
            <View style={[styles.compassLabel, styles.compassS]}>
              <Sun size={14} color={GOLD} />
              <Text style={styles.compassLabelText}>Today's Contract</Text>
            </View>
            <View style={[styles.compassLabel, styles.compassE]}>
              <Heart size={14} color={GOLD} />
              <Text style={styles.compassLabelText}>Wellness</Text>
            </View>
            <View style={[styles.compassLabel, styles.compassW]}>
              <Users size={14} color={GOLD} />
              <Text style={styles.compassLabelText}>Roles</Text>
            </View>
          </View>
        </View>

        {/* "A Day With AI" Section */}
        <View style={styles.daySection}>
          <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
          <Text style={styles.sectionTitle}>The rituals that keep you aligned</Text>
          <Text style={styles.sectionSubtitle}>
            Three rituals give you the structure to invest your time where it counts.
          </Text>

          <View style={styles.ritualCards}>
            <View style={styles.ritualCard}>
              <View style={[styles.ritualIcon, { backgroundColor: '#FFF3E0' }]}>
                <Sunrise size={28} color="#F57F17" />
              </View>
              <Text style={styles.ritualTitle}>Morning Spark</Text>
              <Text style={styles.ritualTime}>~10 minutes each morning</Text>
              <Text style={styles.ritualDescription}>
                Check your energy. Review what's on your plate. Decide what deserves your best effort today — and commit to it.
              </Text>
            </View>

            <View style={styles.ritualCard}>
              <View style={[styles.ritualIcon, { backgroundColor: '#E8EAF6' }]}>
                <Moon size={28} color="#3949AB" />
              </View>
              <Text style={styles.ritualTitle}>Evening Review</Text>
              <Text style={styles.ritualTime}>~10 minutes each evening</Text>
              <Text style={styles.ritualDescription}>
                Name your roses and thorns. Capture what you learned. Close the day with honesty so tomorrow starts clean.
              </Text>
            </View>

            <View style={styles.ritualCard}>
              <View style={[styles.ritualIcon, { backgroundColor: '#E8F5E9' }]}>
                <CheckCircle2 size={28} color="#2E7D32" />
              </View>
              <Text style={styles.ritualTitle}>Weekly Alignment</Text>
              <Text style={styles.ritualTime}>~1 hour once a week</Text>
              <Text style={styles.ritualDescription}>
                Deep self-reflection guided by five power questions. Are your actions aligned with your roles, goals, and values — or just your habits?
              </Text>
            </View>
          </View>
        </View>

        {/* What You'll Build Section */}
        <View style={styles.buildSection}>
          <Text style={styles.sectionLabel}>WHAT YOU'LL BUILD</Text>
          <Text style={[styles.sectionTitle, { color: '#ffffff' }]}>
            A life that reflects your values
          </Text>

          <View style={styles.buildGrid}>
            <View style={styles.buildItem}>
              <Target size={24} color={GOLD} />
              <View style={styles.buildItemText}>
                <Text style={styles.buildItemTitle}>Goals with teeth</Text>
                <Text style={styles.buildItemDesc}>
                  Set 12-week goals. Break them into weekly actions. Watch real progress stack up.
                </Text>
              </View>
            </View>

            <View style={styles.buildItem}>
              <Users size={24} color={GOLD} />
              <View style={styles.buildItemText}>
                <Text style={styles.buildItemTitle}>Roles that matter</Text>
                <Text style={styles.buildItemDesc}>
                  Father. Leader. Friend. Define your roles and invest in the ones that count.
                </Text>
              </View>
            </View>

            <View style={styles.buildItem}>
              <Heart size={24} color={GOLD} />
              <View style={styles.buildItemText}>
                <Text style={styles.buildItemTitle}>Whole-person wellness</Text>
                <Text style={styles.buildItemDesc}>
                  Eight domains of wellness — physical, emotional, spiritual, and more — tracked in balance.
                </Text>
              </View>
            </View>

            <View style={styles.buildItem}>
              <TrendingUp size={24} color={GOLD} />
              <View style={styles.buildItemText}>
                <Text style={styles.buildItemTitle}>Progress you can see</Text>
                <Text style={styles.buildItemDesc}>
                  Weekly alignment reviews show you exactly where you're growing — and where to adjust.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Who It's For */}
        <View style={styles.forSection}>
          <Text style={styles.sectionLabel}>WHO IT'S FOR</Text>
          <Text style={styles.sectionTitle}>Built for people who want more from life</Text>
          <Text style={styles.sectionSubtitle}>
            Whether you're coaching others or coaching yourself, Authentic Intelligence gives you the daily structure to turn vision into reality.
          </Text>

          <View style={styles.audienceCards}>
            <View style={styles.audienceCard}>
              <Calendar size={32} color={GOLD} />
              <Text style={styles.audienceTitle}>Busy professionals</Text>
              <Text style={styles.audienceDesc}>
                Who know they should be more intentional but don't have a system for it.
              </Text>
            </View>
            <View style={styles.audienceCard}>
              <Sparkles size={32} color={GOLD} />
              <Text style={styles.audienceTitle}>Wellness coaches</Text>
              <Text style={styles.audienceDesc}>
                Who want a structured tool to guide their clients through goals and self-care.
              </Text>
            </View>
            <View style={styles.audienceCard}>
              <Target size={32} color={GOLD} />
              <Text style={styles.audienceTitle}>Goal setters</Text>
              <Text style={styles.audienceDesc}>
                Who are tired of apps that track tasks but never ask "why does this matter?"
              </Text>
            </View>
          </View>
        </View>

        {/* Final CTA */}
        <View style={styles.finalCTA}>
          <Text style={styles.finalCTATitle}>Your North Star is waiting.</Text>
          <Text style={styles.finalCTASubtitle}>
            Start with three questions. Build from there.
          </Text>
          <TouchableOpacity style={styles.ctaButtonLight} onPress={handleGetStarted}>
            <Text style={styles.ctaButtonLightText}>Begin Your Journey</Text>
            <ArrowRight size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>
            An Authentic Intelligence Labs product
          </Text>
          <Text style={styles.footerText}>
            By signing in, you agree to our{' '}
            <Text style={styles.footerLink} onPress={() => router.push('/terms')}>
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text style={styles.footerLink} onPress={() => router.push('/privacy')}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WARM_WHITE,
  },

  // Navigation
  navigation: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 12,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  signInButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: GOLD,
  },
  signInText: {
    fontSize: 14,
    fontWeight: '600',
    color: GOLD,
  },

  content: {
    flex: 1,
  },

  // Hero
  hero: {
    backgroundColor: DARK,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 80,
    alignItems: 'center',
  },
  heroInner: {
    alignItems: 'center',
    maxWidth: 680,
    marginBottom: 48,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    color: GOLD,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 54,
    marginBottom: 20,
  },
  heroDescription: {
    fontSize: 18,
    color: TEXT_SECONDARY,
    lineHeight: 28,
    textAlign: 'center',
    maxWidth: 520,
    marginBottom: 36,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GOLD,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  ctaButtonText: {
    color: DARK,
    fontSize: 17,
    fontWeight: '700',
  },

  // Compass visual
  compassContainer: {
    width: 420,
    height: 340,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compassSvgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassLabel: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  compassLabelText: {
    fontSize: 12,
    color: GOLD,
    fontWeight: '600',
  },
  compassN: { top: 0, left: '50%', transform: [{ translateX: -55 }] },
  compassS: { bottom: 0, left: '50%', transform: [{ translateX: -48 }] },
  compassE: { right: 0, top: '50%', transform: [{ translateY: -10 }] },
  compassW: { left: 0, top: '50%', transform: [{ translateY: -10 }] },

  // Day Section
  daySection: {
    paddingHorizontal: 24,
    paddingVertical: 64,
    alignItems: 'center',
    backgroundColor: WARM_WHITE,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    color: GOLD,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
    maxWidth: 600,
  },
  sectionSubtitle: {
    fontSize: 17,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 520,
    marginBottom: 40,
  },
  ritualCards: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
    maxWidth: 1100,
    flexWrap: 'wrap',
  },
  ritualCard: {
    flex: 1,
    minWidth: 280,
    maxWidth: 340,
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  ritualIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ritualTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  ritualTime: {
    fontSize: 13,
    fontWeight: '500',
    color: GOLD,
    marginBottom: 12,
  },
  ritualDescription: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 23,
  },

  // Build Section
  buildSection: {
    backgroundColor: DARK_SURFACE,
    paddingHorizontal: 24,
    paddingVertical: 64,
    alignItems: 'center',
  },
  buildGrid: {
    width: '100%',
    maxWidth: 800,
    gap: 20,
    marginTop: 32,
  },
  buildItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  buildItemText: {
    flex: 1,
  },
  buildItemTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  buildItemDesc: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    lineHeight: 23,
  },

  // For Section
  forSection: {
    paddingHorizontal: 24,
    paddingVertical: 64,
    alignItems: 'center',
    backgroundColor: WARM_WHITE,
  },
  audienceCards: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
    maxWidth: 1100,
    flexWrap: 'wrap',
    marginTop: 32,
  },
  audienceCard: {
    flex: 1,
    minWidth: 260,
    maxWidth: 340,
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  audienceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  audienceDesc: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 23,
    textAlign: 'center',
  },

  // Final CTA
  finalCTA: {
    backgroundColor: GOLD_LIGHT,
    paddingHorizontal: 24,
    paddingVertical: 64,
    alignItems: 'center',
  },
  finalCTATitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  finalCTASubtitle: {
    fontSize: 17,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  ctaButtonLight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  ctaButtonLightText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },

  // Footer
  footer: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerBrand: {
    fontSize: 13,
    fontWeight: '600',
    color: GOLD,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerLink: {
    color: GOLD,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
