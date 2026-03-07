// Conversational Onboarding — 3 simple questions to get started
// Replaces the previous 9-step acknowledgment flow

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getSupabaseClient } from '@/lib/supabase';

type QuestionKey = 'name' | 'focus' | 'goal';

interface Question {
  key: QuestionKey;
  prompt: string;
  subtext: string;
  placeholder: string;
  options?: string[];
}

const QUESTIONS: Question[] = [
  {
    key: 'name',
    prompt: "What should we call you?",
    subtext: "Just your first name is fine.",
    placeholder: "Your name",
  },
  {
    key: 'focus',
    prompt: "What's one area of life you'd like to focus on?",
    subtext: "Pick what matters most right now. You can always change this later.",
    placeholder: "Type your own or pick one",
    options: ['Health & Fitness', 'Career & Work', 'Relationships', 'Personal Growth', 'Finances', 'Spiritual Life'],
  },
  {
    key: 'goal',
    prompt: "What's one thing you'd love to accomplish in the next 12 weeks?",
    subtext: "Dream big or keep it simple — both work.",
    placeholder: "e.g. Run a 5K, read 6 books, launch a side project...",
  },
];

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<QuestionKey, string>>({
    name: '',
    focus: '',
    goal: '',
  });
  const [saving, setSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const question = QUESTIONS[currentQuestion];
  const isLast = currentQuestion === QUESTIONS.length - 1;
  const canProceed = answers[question.key].trim().length > 0;

  const animateTransition = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = async () => {
    if (!canProceed) return;

    if (isLast) {
      // Save onboarding answers and complete
      setSaving(true);
      try {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Save to onboarding table
          await supabase
            .from('0008-ap-onboarding')
            .upsert({
              user_id: user.id,
              steps_completed: {
                conversational_onboarding: {
                  answers,
                  completed_at: new Date().toISOString(),
                },
              },
              current_step: 'completed',
              completed_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id',
            });

          // Save user's display name if provided
          if (answers.name) {
            await supabase
              .from('0008-ap-users')
              .upsert({
                id: user.id,
                display_name: answers.name,
              }, {
                onConflict: 'id',
              });
          }

          // If they picked a focus area, we could create a default wellness domain focus
          // This will be handled by AI auto-tagging later
        }
      } catch (error) {
        console.error('Error saving onboarding:', error);
      }
      setSaving(false);
      router.replace('/(tabs)/dashboard');
    } else {
      animateTransition(() => {
        setCurrentQuestion(currentQuestion + 1);
      });
    }
  };

  const handleOptionSelect = (option: string) => {
    setAnswers(prev => ({ ...prev, [question.key]: option }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Progress dots */}
        <View style={styles.progressContainer}>
          {QUESTIONS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i <= currentQuestion
                  ? { backgroundColor: '#D4A843' }
                  : { backgroundColor: colors.border },
              ]}
            />
          ))}
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
            {/* Question */}
            <Text style={[styles.prompt, { color: colors.text }]}>
              {question.prompt}
            </Text>
            <Text style={[styles.subtext, { color: colors.textSecondary }]}>
              {question.subtext}
            </Text>

            {/* Options (if available) */}
            {question.options && (
              <View style={styles.optionsGrid}>
                {question.options.map((option) => {
                  const isSelected = answers[question.key] === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionChip,
                        {
                          backgroundColor: isSelected ? '#D4A843' : colors.surface,
                          borderColor: isSelected ? '#D4A843' : colors.border,
                        },
                      ]}
                      onPress={() => handleOptionSelect(option)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          { color: isSelected ? '#FFFFFF' : colors.text },
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Text Input */}
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={answers[question.key]}
              onChangeText={(text) =>
                setAnswers(prev => ({ ...prev, [question.key]: text }))
              }
              placeholder={question.placeholder}
              placeholderTextColor={colors.textSecondary}
              multiline={question.key === 'goal'}
              returnKeyType={isLast ? 'done' : 'next'}
              onSubmitEditing={handleNext}
              autoFocus={currentQuestion === 0}
            />
          </Animated.View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomBar}>
          {currentQuestion > 0 && (
            <TouchableOpacity
              style={[styles.backButton, { borderColor: colors.border }]}
              onPress={() => animateTransition(() => setCurrentQuestion(currentQuestion - 1))}
            >
              <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor: canProceed ? '#D4A843' : colors.border,
                flex: currentQuestion > 0 ? 1 : undefined,
              },
            ]}
            onPress={handleNext}
            disabled={!canProceed || saving}
          >
            <Text style={styles.nextButtonText}>
              {saving ? 'Setting up...' : isLast ? "Let's Go!" : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  questionContainer: {
    alignItems: 'center',
    gap: 16,
    paddingBottom: 40,
  },
  prompt: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 34,
  },
  subtext: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    textAlign: 'center',
    minHeight: 50,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    gap: 12,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
